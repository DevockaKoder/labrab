export interface ExtractedStudentInfo {
  studentName: string;
  groupName: string;
  tasks: { [taskId: string]: string };
}

export function extractStudentHeader(code: string, fileName: string): { studentName: string; groupName: string } {
  // Check first few lines for comments with group and name
  const lines = code.split('\n').slice(0, 10);
  let studentName = '';
  let groupName = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      const content = trimmed.replace(/^#+\s*/, '');
      // Match group like ТРП-1-22 or ИВТ-21 or similar
      const groupMatch = content.match(/([А-Яа-яA-Za-z0-9\-]+(?:-\d+)+)/);
      if (groupMatch && !groupName) {
        groupName = groupMatch[1];
      }
      // Match Russian name: Иванов И.И. or Иванов Иван
      const nameMatch = content.match(/([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ]\.[А-ЯЁ]\.|\s+[А-ЯЁ][а-яё]+))/);
      if (nameMatch && !studentName) {
        studentName = nameMatch[1];
      }
    }
  }

  // Fallback to fileName if not detected in code
  if (!studentName) {
    const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    studentName = baseName || 'Студент';
  }

  return { studentName, groupName: groupName || 'Группа 1' };
}

export function splitCodeIntoTasks(code: string, fileName = ''): { [taskId: string]: string } {
  const taskMap: { [taskId: string]: string } = {};

  // Check if filename itself denotes a specific task (e.g., task_1_2.py, 2.3.py)
  const fileTaskMatch = fileName.match(/(?:task|задача|задание)?[_\s]*([1-4]\.[1-7])/i);
  if (fileTaskMatch && !code.includes('# 1.') && !code.includes('# 2.') && !code.includes('# 3.') && !code.includes('# 4.')) {
    taskMap[fileTaskMatch[1]] = code;
    return taskMap;
  }

  // Split lines and scan for task markers
  // Markers like: # 1.1, #1.1, # Задача 1.2, #Задание 2.3, """1.1...""", # Task 3.4
  const taskMarkerRegex = /(?:^|\n)\s*#+\s*(?:задача|задание|task)?\s*([1-4]\.[1-7])\b/gi;

  const matches: { taskId: string; index: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = taskMarkerRegex.exec(code)) !== null) {
    matches.push({
      taskId: m[1],
      index: m.index,
    });
  }

  // Also check for print("1.1 ...") or print('1.1') markers if comments were omitted
  if (matches.length === 0) {
    const printMarkerRegex = /(?:^|\n)\s*print\s*\(\s*["']([1-4]\.[1-7])\b/gi;
    while ((m = printMarkerRegex.exec(code)) !== null) {
      matches.push({
        taskId: m[1],
        index: m.index,
      });
    }
  }

  if (matches.length === 0) {
    // Cannot detect multiple tasks, assign whole code to single task if indicated, or general
    taskMap['1.1'] = code;
    return taskMap;
  }

  // Extract preamble imports (e.g., import math, from math import *)
  const firstIndex = matches[0]?.index ?? 0;
  const preamble = code.slice(0, firstIndex);
  const preambleImports = preamble
    .split('\n')
    .filter((line) => /^\s*(?:import\s+|from\s+)/.test(line))
    .map((l) => l.trim())
    .join('\n');

  const fileHasMathImport = code.includes('import math') || code.includes('from math');

  // Extract snippets between matches
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const startIndex = current.index;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : code.length;
    let snippet = code.slice(startIndex, endIndex).trim();

    // If the student specified import math at the top of their file (or whole file),
    // ensure any individual task snippet using math has the import present.
    if (
      (fileHasMathImport || preambleImports.includes('math')) &&
      !snippet.includes('import math') &&
      !snippet.includes('from math') &&
      /\bmath\b/.test(snippet)
    ) {
      snippet = 'import math\n' + snippet;
    }

    taskMap[current.taskId] = snippet;
  }

  return taskMap;
}
