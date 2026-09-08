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

  // Prepare input string
  const inputStr = inputs.map((v) => String(v)).join('\n') + '\n';

  // Run wrapper in python that sets up stdin/stdout and performs AST checks
  const runnerScript = `
import sys
import io
import ast
import json

code_to_run = ${JSON.stringify(code)}
mock_input = ${JSON.stringify(inputStr)}

sys.stdin = io.StringIO(mock_input)
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
    # Use clean globals with standard builtins and math
    exec_globals = {"__name__": "__main__"}
    exec(compiled, exec_globals)
except Exception as e:
    exec_error = str(e)

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
