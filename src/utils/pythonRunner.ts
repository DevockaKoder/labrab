/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL?: string }) => Promise<any>;
  }
}

let pyodideInstance: any = null;
let pyodideLoadingPromise: Promise<any> | null = null;

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

  // Normalize inputs: convert to string, replace Russian comma in decimals (e.g. 5,5 -> 5.5)
  const normalizedInputs = inputs.map((v) => {
    const s = String(v).trim();
    // Replace comma between digits with dot
    return s.replace(/^(-?\d+),(\d+)$/, '$1.$2');
  });

  const inputStr = normalizedInputs.join('\n') + '\n';

  // Run wrapper in python that sets up stdin/stdout and performs AST checks
  const runnerScript = `
import sys
import io
import ast
import json
import math

code_to_run = ${JSON.stringify(code)}
raw_inputs = ${JSON.stringify(normalizedInputs)}

# Detect if student code uses .split() on input
has_split_call = ".split" in code_to_run

input_idx = 0
input_queue = list(raw_inputs)

# Smart input function that handles both multiple input() calls and input().split()
def smart_input(prompt=None):
    global input_idx, input_queue
    # If code uses .split() on the first line and multiple inputs were provided
    if has_split_call and input_idx == 0 and len(input_queue) > 1:
        input_idx += 1
        return " ".join(input_queue)
    
    if input_idx < len(input_queue):
        val = input_queue[input_idx]
        input_idx += 1
        return val
    
    # Safe fallback if input queue is exhausted (e.g., student has extra input() or trailing pause)
    # Returning "0" prevents ValueError: could not convert string to float: ''
    return "0"

# Also set up standard stdin buffer with fallback lines
input_lines = [s + "\\n" for s in raw_inputs]
if not input_lines:
    input_lines = ["0\\n"]
# Add extra fallback lines so sys.stdin.readline() never hits EOF prematurely
input_lines.extend(["0\\n"] * 5)
sys.stdin = io.StringIO("".join(input_lines))
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()

ast_result = {
    "hasForLoop": False,
    "hasWhileLoop": False,
    "usedMinMax": False,
    "usedFunctions": []
}

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
except Exception as e:
    pass

exec_error = None
try:
    # Compile and execute student snippet
    compiled = compile(code_to_run, '<student_code>', 'exec')
    # Use clean globals with standard builtins and math library pre-loaded
    exec_globals = {
        "__name__": "__main__",
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
except Exception as e:
    raw_msg = str(e)
    if "could not convert string to float" in raw_msg:
        exec_error = f"ValueError: {raw_msg} (Не удалось преобразовать значение в float. Проверьте правильность входных чисел или вызов float(input()))"
    elif "can only concatenate str" in raw_msg and "float" in raw_msg:
        exec_error = f"TypeError: {raw_msg} (В коде попытка сложить строку со значением float через '+'. В Python нужно: print('текст', число) или f-строку f'{{значение}}')"
    elif "can only concatenate str" in raw_msg and "int" in raw_msg:
        exec_error = f"TypeError: {raw_msg} (В коде попытка сложить строку с целым числом int через '+'. В Python нужно: print('текст', число) или f-строку)"
    elif "invalid literal for int()" in raw_msg:
        exec_error = f"ValueError: {raw_msg} (Не удалось преобразовать строку в int: возможно, передано вещественное число или пробелы, используйте float(input()))"
    else:
        exec_error = f"{type(e).__name__}: {raw_msg}"

out_val = sys.stdout.getvalue()
err_val = sys.stderr.getvalue()

json.dumps({
    "stdout": out_val,
    "stderr": err_val,
    "error": exec_error,
    "astChecks": ast_result
})
`;

  try {
    const rawResultJson = await py.runPythonAsync(runnerScript);
    const parsed = JSON.parse(rawResultJson);
    return {
      stdout: parsed.stdout || '',
      stderr: parsed.stderr || '',
      error: parsed.error || undefined,
      astChecks: parsed.astChecks || {
        hasForLoop: false,
        hasWhileLoop: false,
        usedMinMax: false,
        usedFunctions: [],
      },
    };
  } catch (err: any) {
    return {
      stdout: '',
      stderr: String(err),
      error: err.message || String(err),
      astChecks: {
        hasForLoop: code.includes('for ') && code.includes('in '),
        hasWhileLoop: code.includes('while '),
        usedMinMax: code.includes('min(') || code.includes('max('),
        usedFunctions: [],
      },
    };
  }
}
