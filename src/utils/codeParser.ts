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

export function detectLabType(code: string, fileName = ''): 'lab1' | 'lab2' {
  if (/lab_?2|лабораторная_?2|практика_?2/i.test(fileName)) return 'lab2';
  if (/lab_?1|лабораторная_?1|практика_?1/i.test(fileName)) return 'lab1';

  // Check code markers
  // If has markers like # 24, # 25, # 15, # 18, # 20 or # 2.25 -> lab2
  if (/(?:^|\n)\s*#+\s*(?:задача|задание|task)?\s*(?:2\.)?(?:1[5-9]|2[0-5])\b/i.test(code)) {
    return 'lab2';
  }
  // If has markers like 1.1, 2.1, 3.1, 4.1 -> lab1
  if (/(?:^|\n)\s*#+\s*(?:задача|задание|task)?\s*[1-4]\.[1-7]\b/i.test(code)) {
    return 'lab1';
  }
  return 'lab1';
}

export function splitCodeIntoTasks(
  code: string,
  fileName = '',
  targetLab?: 'lab1' | 'lab2'
): { [taskId: string]: string } {
  const taskMap: { [taskId: string]: string } = {};
  const lab = targetLab || detectLabType(code, fileName);

  if (lab === 'lab2') {
    return splitCodeForLab2(code, fileName);
  }

  return splitCodeForLab1(code, fileName);
}

function splitCodeForLab1(code: string, fileName: string): { [taskId: string]: string } {
  const taskMap: { [taskId: string]: string } = {};

  // Check if filename itself denotes a specific task (e.g., task_1_2.py, 2.3.py)
  const fileTaskMatch = fileName.match(/(?:task|задача|задание)?[_\s]*([1-4]\.[1-7])/i);
  if (fileTaskMatch && !code.includes('# 1.') && !code.includes('# 2.') && !code.includes('# 3.') && !code.includes('# 4.')) {
    taskMap[fileTaskMatch[1]] = code;
    return taskMap;
  }

  // Split lines and scan for task markers like # 1.1, # Задача 1.2
  const taskMarkerRegex = /(?:^|\n)\s*#+\s*(?:задача|задание|task)?\s*([1-4]\.[1-7])\b/gi;
  const matches: { taskId: string; index: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = taskMarkerRegex.exec(code)) !== null) {
    matches.push({
      taskId: m[1],
      index: m.index,
    });
  }

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
    taskMap['1.1'] = code;
    return taskMap;
  }

  return extractSnippets(code, matches);
}

function splitCodeForLab2(code: string, fileName: string): { [taskId: string]: string } {
  const taskMap: { [taskId: string]: string } = {};

  // Matches:
  // # 1, # 25, # 1., # 25.
  // # Задача 1, # Задание 25, # Task 14
  // # 2.1, # 2.25
  const taskMarkerRegex = /(?:^|\n)\s*#+\s*(?:задача|задание|task)?\s*(?:2\.)?([1-9]|1\d|2[0-5])(?:\.|\b)/gi;
  const matches: { taskId: string; index: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = taskMarkerRegex.exec(code)) !== null) {
    matches.push({
      taskId: m[1], // e.g. "1" ... "25"
      index: m.index,
    });
  }

  if (matches.length === 0) {
    const printMarkerRegex = /(?:^|\n)\s*print\s*\(\s*["'](?:задание\s*|задача\s*|task\s*)?(?:2\.)?([1-9]|1\d|2[0-5])(?:\.|\b)/gi;
    while ((m = printMarkerRegex.exec(code)) !== null) {
      matches.push({
        taskId: m[1],
        index: m.index,
      });
    }
  }

  if (matches.length === 0) {
    taskMap['1'] = code;
    return taskMap;
  }

  const extracted = extractSnippets(code, matches);
  // Also create aliases (e.g., '1' and '2.1')
  for (const [key, val] of Object.entries(extracted)) {
    taskMap[key] = val;
    taskMap[`2.${key}`] = val;
  }
  return taskMap;
}

function extractSnippets(
  code: string,
  matches: { taskId: string; index: number }[]
): { [taskId: string]: string } {
  const taskMap: { [taskId: string]: string } = {};
  const firstIndex = matches[0]?.index ?? 0;
  const preamble = code.slice(0, firstIndex);
  const preambleImports = preamble
    .split('\n')
    .filter((line) => /^\s*(?:import\s+|from\s+)/.test(line))
    .map((l) => l.trim())
    .join('\n');

  const fileHasMathImport = code.includes('import math') || code.includes('from math');

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const startIndex = current.index;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : code.length;
    let snippet = code.slice(startIndex, endIndex).trim();

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
