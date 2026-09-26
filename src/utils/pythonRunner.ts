/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL?: string }) => Promise<any>;
  }
}

let pyodideInstance: any = null;
let pyodideLoadingPromise: Promise<any> | null = null;
let totalExecutionCount = 0;

export async function getPyodide(): Promise<any> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoadingPromise) return pyodideLoadingPromise;

  pyodideLoadingPromise = (async () => {
    // If window.loadPyodide is not loaded yet, wait or load dynamically
    if (typeof window !== 'undefined' && !window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
        script.onload = () => resolve();
        script.onerror = (err) => reject(new Error('Не удалось загрузить Pyodide WebAssembly: ' + err));
        document.head.appendChild(script);
      });
    }

    if (window.loadPyodide) {
      const py = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
      });
      pyodideInstance = py;
      return py;
    }
    throw new Error('Pyodide script not found');
  })();

  return pyodideLoadingPromise;
}

export interface PyExecutionResult {
  stdout: string;
  stderr: string;
  error?: string;
  isLoopTimeout?: boolean;
  isMemoryLimitExceeded?: boolean;
  astChecks: {
    hasForLoop: boolean;
    hasWhileLoop: boolean;
    usedMinMax: boolean;
    usedFunctions: string[];
  };
}

export async function runPythonCode(
  code: string,
  inputs: (string | number)[] = []
): Promise<PyExecutionResult> {
  const py = await getPyodide();

  totalExecutionCount++;
  // Periodic proactive garbage collection to keep WebAssembly heap minimal
  if (totalExecutionCount % 40 === 0) {
    try {
      await py.runPythonAsync(`
import gc
gc.collect()
`);
    } catch {
      // Ignore background gc errors
    }
  }

  // Normalize inputs: convert to string, replace Russian comma in decimals (e.g. 5,5 -> 5.5)
  const normalizedInputs = inputs.map((v) => {
    const s = String(v).trim();
    // Replace comma between digits with dot
    return s.replace(/^(-?\d+),(\d+)$/, '$1.$2');
  });

  // Runner script with:
  // 1. AST LoopGuardTransformer to intercept infinite while/for loops
  // 2. SafeLimitedOutput to prevent stdout memory explosions (>25 KB)
  // 3. Memory bomb AST checks ([0] * 10000000, 2**1000000)
  // 4. Recursion limit (250) to prevent WASM stack overflow
  // 5. Automatic gc.collect() and environment cleanup
  const runnerScript = `
import sys
import io
import ast
import json
import math
import time
import gc

code_to_run = ${JSON.stringify(code)}
raw_inputs = ${JSON.stringify(normalizedInputs)}

# Safe bounded output stream: caps at 25,000 chars to protect browser memory
class SafeLimitedOutput(io.StringIO):
    def __init__(self, max_chars=25000):
        super().__init__()
        self.max_chars = max_chars
        self.limit_exceeded = False

    def write(self, s):
        current_len = self.tell()
        if current_len + len(s) > self.max_chars:
            remaining = self.max_chars - current_len
            if remaining > 0:
                super().write(s[:remaining])
            if not self.limit_exceeded:
                super().write("\\n[... Вывод прерван: превышен безопасный лимит 25 КБ для защиты памяти браузера ...]")
                self.limit_exceeded = True
            raise MemoryError("Превышен допустимый объём вывода print() (максимум 25 КБ). Защита от переполнения памяти браузера.")
        return super().write(s)

# AST Transformer that inserts guard check calls at the top of every loop body
class LoopGuardTransformer(ast.NodeTransformer):
    def visit_While(self, node):
        self.generic_visit(node)
        guard_call = ast.Expr(
            value=ast.Call(
                func=ast.Name(id='__guard_check', ctx=ast.Load()),
                args=[ast.Constant(value=node.lineno), ast.Constant(value='while')],
                keywords=[]
            )
        )
        node.body.insert(0, guard_call)
        return node

    def visit_For(self, node):
        self.generic_visit(node)
        guard_call = ast.Expr(
            value=ast.Call(
                func=ast.Name(id='__guard_check', ctx=ast.Load()),
                args=[ast.Constant(value=node.lineno), ast.Constant(value='for')],
                keywords=[]
            )
        )
        node.body.insert(0, guard_call)
        return node

    def visit_AsyncFor(self, node):
        self.generic_visit(node)
        guard_call = ast.Expr(
            value=ast.Call(
                func=ast.Name(id='__guard_check', ctx=ast.Load()),
                args=[ast.Constant(value=node.lineno), ast.Constant(value='async for')],
                keywords=[]
            )
        )
        node.body.insert(0, guard_call)
        return node

ast_result = {
    "hasForLoop": False,
    "hasWhileLoop": False,
    "usedMinMax": False,
    "usedFunctions": []
}

exec_error = None
is_loop_timeout = False
is_memory_limit = False
out_val = ""
err_val = ""
guarded_tree = None

try:
    tree = ast.parse(code_to_run)
    for node in ast.walk(tree):
        if isinstance(node, (ast.For, ast.AsyncFor)):
            ast_result["hasForLoop"] = True
        elif isinstance(node, ast.While):
            ast_result["hasWhileLoop"] = True
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                ast_result["usedFunctions"].append(node.func.id)
                if node.func.id in ("min", "max"):
                    ast_result["usedMinMax"] = True
        elif isinstance(node, ast.BinOp):
            # Memory bomb detection: creating giant arrays or strings
            if isinstance(node.op, ast.Mult):
                if isinstance(node.right, ast.Constant) and isinstance(node.right.value, (int, float)) and node.right.value > 100000:
                    raise MemoryError(f"Обнаружена попытка создания структуры данных чрезмерного размера (* {node.right.value}). Защита памяти браузера.")
                if isinstance(node.left, ast.Constant) and isinstance(node.left.value, (int, float)) and node.left.value > 100000:
                    raise MemoryError(f"Обнаружена попытка создания структуры данных чрезмерного размера (* {node.left.value}). Защита памяти браузера.")
            elif isinstance(node.op, ast.Pow):
                if isinstance(node.right, ast.Constant) and isinstance(node.right.value, (int, float)) and node.right.value > 50000:
                    raise MemoryError(f"Обнаружено вычисление огромной степени (** {node.right.value}). Защита памяти браузера.")

    transformer = LoopGuardTransformer()
    guarded_tree = transformer.visit(tree)
    ast.fix_missing_locations(guarded_tree)
except SyntaxError as syn_err:
    exec_error = f"SyntaxError: {syn_err.msg} (строка {syn_err.lineno})"
except MemoryError as mem_err:
    exec_error = f"MemoryError: {mem_err}"
    is_memory_limit = True
except Exception as e:
    exec_error = f"Ошибка анализа AST: {type(e).__name__}: {str(e)}"

if not exec_error and guarded_tree is not None:
    has_split_call = ".split" in code_to_run
    input_idx = 0
    input_queue = list(raw_inputs)

    def smart_input(prompt=None):
        nonlocal input_idx
        if has_split_call and input_idx == 0 and len(input_queue) > 1:
            input_idx += 1
            return " ".join(input_queue)
        if input_idx < len(input_queue):
            val = input_queue[input_idx]
            input_idx += 1
            return val
        return "0"

    loop_iterations = 0
    start_time = time.time()
    MAX_LOOP_STEPS = 50000
    MAX_EXEC_SECONDS = 1.8

    def guard_check(lineno, loop_type):
        nonlocal loop_iterations, is_loop_timeout
        loop_iterations += 1
        if loop_iterations > MAX_LOOP_STEPS:
            is_loop_timeout = True
            raise TimeoutError(f"Обнаружен бесконечный цикл {loop_type} (строка {lineno})! Превышен безопасный лимит {MAX_LOOP_STEPS} итераций. Проверьте условия выхода из цикла.")
        if time.time() - start_time > MAX_EXEC_SECONDS:
            is_loop_timeout = True
            raise TimeoutError(f"Превышено максимальное время выполнения ({MAX_EXEC_SECONDS} сек, строка {lineno})! Возможно, в коде бесконечный цикл.")

    out_buf = SafeLimitedOutput(25000)
    err_buf = SafeLimitedOutput(5000)
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    old_stdin = sys.stdin

    input_lines = [s + "\\n" for s in raw_inputs] or ["0\\n"]
    input_lines.extend(["0\\n"] * 5)
    sys.stdin = io.StringIO("".join(input_lines))
    sys.stdout = out_buf
    sys.stderr = err_buf

    old_rec_limit = sys.getrecursionlimit()
    sys.setrecursionlimit(250)

    try:
        compiled = compile(guarded_tree, '<student_code>', 'exec')
        exec_globals = {
            "__name__": "__main__",
            "__guard_check": guard_check,
            "input": smart_input,
            "math": math,
            "m": math,
            "pi": math.pi,
            "e": math.e,
            "sqrt": math.sqrt,
            "hypot": math.hypot,
            "sin": math.sin,
            "cos": math.cos,
            "tan": math.tan,
            "radians": math.radians,
            "degrees": math.degrees,
            "ceil": math.ceil,
            "floor": math.floor,
            "fabs": math.fabs,
        }
        exec(compiled, exec_globals)
        exec_globals.clear()
    except TimeoutError as te:
        is_loop_timeout = True
        exec_error = f"TimeoutError: {str(te)}"
    except MemoryError as me:
        is_memory_limit = True
        exec_error = f"MemoryError: {str(me)}"
    except RecursionError:
        exec_error = "RecursionError: Превышена максимальная глубина рекурсии (в коде обнаружен бесконечный вызов функции без базового условия остановки)."
    except Exception as e:
        raw_msg = str(e)
        if "could not convert string to float" in raw_msg:
            exec_error = f"ValueError: {raw_msg} (Не удалось преобразовать значение в float. Проверьте правильность входных чисел или вызов float(input()))"
        elif "can only concatenate str" in raw_msg and "float" in raw_msg:
            exec_error = f"TypeError: {raw_msg} (Попытка сложить строку со значением float через '+'. В Python нужно: print('текст', число) или f-строку)"
        elif "can only concatenate str" in raw_msg and "int" in raw_msg:
            exec_error = f"TypeError: {raw_msg} (Попытка сложить строку с целым числом int через '+'. В Python нужно: print('текст', число) или f-строку)"
        elif "invalid literal for int()" in raw_msg:
            exec_error = f"ValueError: {raw_msg} (Не удалось преобразовать строку в int: возможно, передано вещественное число или пробелы, используйте float(input()))"
        else:
            exec_error = f"{type(e).__name__}: {raw_msg}"
    finally:
        sys.setrecursionlimit(old_rec_limit)
        sys.stdout = old_stdout
        sys.stderr = old_stderr
        sys.stdin = old_stdin
        out_val = out_buf.getvalue()
        err_val = err_buf.getvalue()
        gc.collect()

json.dumps({
    "stdout": out_val,
    "stderr": err_val,
    "error": exec_error,
    "isLoopTimeout": is_loop_timeout,
    "isMemoryLimitExceeded": is_memory_limit,
    "astChecks": ast_result
})
`;

  try {
    // JavaScript timeout watchdog (2.8 seconds) as second line of defense
    const JS_TIMEOUT_MS = 2800;
    const pyPromise = py.runPythonAsync(runnerScript);
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            'Превышен лимит времени выполнения (Time Limit Exceeded). Код остановлен защитой от бесконечных циклов.'
          )
        );
      }, JS_TIMEOUT_MS);
    });

    const rawResultJson = await Promise.race([pyPromise, timeoutPromise]);
    const parsed = JSON.parse(rawResultJson);

    return {
      stdout: parsed.stdout || '',
      stderr: parsed.stderr || '',
      error: parsed.error || undefined,
      isLoopTimeout: Boolean(parsed.isLoopTimeout || (parsed.error && (parsed.error.includes('бесконечный цикл') || parsed.error.includes('TimeoutError')))),
      isMemoryLimitExceeded: Boolean(parsed.isMemoryLimitExceeded || (parsed.error && (parsed.error.includes('MemoryError') || parsed.error.includes('памяти')))),
      astChecks: parsed.astChecks || {
        hasForLoop: false,
        hasWhileLoop: false,
        usedMinMax: false,
        usedFunctions: [],
      },
    };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const isTimeout = errMsg.includes('Time Limit') || errMsg.includes('бесконечный цикл') || errMsg.includes('TimeoutError');
    const isMem = errMsg.includes('Memory') || errMsg.includes('памяти');

    return {
      stdout: '',
      stderr: errMsg,
      error: errMsg,
      isLoopTimeout: isTimeout,
      isMemoryLimitExceeded: isMem,
      astChecks: {
        hasForLoop: code.includes('for ') && code.includes('in '),
        hasWhileLoop: code.includes('while '),
        usedMinMax: code.includes('min(') || code.includes('max('),
        usedFunctions: [],
      },
    };
  }
}
