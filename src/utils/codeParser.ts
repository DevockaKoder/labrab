export interface ExtractedStudentInfo {
  studentName: string;
  groupName: string;
  tasks: { [taskId: string]: string };
}


/**
 * Cleanly extracts student display name if the raw name has Moodle artifacts like:
 * "Ильхам Сагынтай 1544268 assignsubmission file ТРИС 1 26 Сагынтай ЛР3"
 */
export function cleanStudentDisplayName(name: string): string {
  if (!name) return 'Студент';
  const trimmed = name.trim();
  // Moodle pattern: Name + ID + assignsubmission
  const moodleMatch = trimmed.match(/^([^\d_]+(?:[^\d_]+)*?)[_\s]+\d{4,9}[_\s]+assignsubmission\b/i);
  if (moodleMatch) {
    return moodleMatch[1].replace(/_/g, ' ').trim();
  }
  const altMoodle = trimmed.match(/^(.+?)[_\s]+\d{4,9}[_\s]+assignsubmission\b/i);
  if (altMoodle) {
    return altMoodle[1].replace(/_/g, ' ').trim();
  }
  return trimmed;
}

/**
 * Tries to extract group name like "ТРИС 1 26", "ПИ 4 26", "ТРП 1 26", "ТРП-1-22" from text or filename.
 */
export function extractGroupFromText(text: string): string | null {
  if (!text) return null;
  // Match patterns like "ТРИС 1 26", "ПИ 4 26", "ТРП-1-22", "ИВТ-21"
  // Avoid matching words like "ЛР 3" or "ЛБ 3" as group name
  const matches = text.matchAll(/\b([А-ЯA-Z]{2,8}(?:[-_\s]\d+){1,3})\b/gi);
  for (const m of matches) {
    const candidate = m[1].replace(/_/g, ' ').trim();
    // Exclude laboratory prefixes like ЛР 3, ЛБ 3, LAB 3
    if (/^(?:лр|лб|лаб|lab|пр)\s*\d+$/i.test(candidate)) {
      continue;
    }
    return candidate;
  }
  return null;
}

export function extractStudentHeader(code: string, fileName: string): { studentName: string; groupName: string } {
  // 1. Check for Moodle pattern in filename first
  // e.g. "Ильхам Сагынтай 1544268 assignsubmission file ТРИС 1 26 Сагынтай ЛР3.py"
  let moodleStudentName = '';
  let moodleGroup = '';

  const moodleMatch = fileName.match(/^([^\d_]+(?:[^\d_]+)*?)[_\s]+(\d{4,9})[_\s]+assignsubmission(?:[_\s]+file)?[_\s]+(.*)$/i);
  if (moodleMatch) {
    moodleStudentName = moodleMatch[1].replace(/_/g, ' ').trim();
    const rest = moodleMatch[3];
    const extractedGrp = extractGroupFromText(rest);
    if (extractedGrp) {
      moodleGroup = extractedGrp;
    }
  }

  // 2. Check first lines for comments with group and name
  const lines = code.split('\n').slice(0, 30);
  let studentName = '';
  let groupName = moodleGroup;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      const content = trimmed.replace(/^#+\s*/, '');

      // Match explicit group declarations: "Группа: ТРП-1-22" or "Гр. ПИ 4 26"
      const explicitGroup = content.match(/(?:группа|гр\.?|group)\s*[:=\-]?\s*([А-Яа-яA-Za-z0-9\s\-]+)/i);
      if (explicitGroup && (!groupName || groupName === 'Группа 1')) {
        const candidate = explicitGroup[1].trim();
        if (candidate.length < 25) {
          groupName = candidate;
        }
      } else if (!groupName) {
        const found = extractGroupFromText(content);
        if (found) groupName = found;
      }

      // Match explicit student declarations: "Студент: Иванов Иван" or "Выполнил: ..."
      const explicitName = content.match(/(?:студент|выполнил|автор|фио)\s*[:=\-]?\s*([А-ЯЁа-яёA-Za-z\s\.]+)/i);
      if (explicitName && !studentName) {
        const candidate = explicitName[1].trim();
        if (candidate.length < 35 && candidate.length > 2) {
          studentName = candidate;
        }
      }

      // Match Russian name: Иванов И.И. or Иванов Иван
      if (!studentName) {
        const nameMatch = content.match(/([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ]\.[А-ЯЁ]\.|\s+[А-ЯЁ][а-яё]+))/);
        if (nameMatch) {
          studentName = nameMatch[1];
        }
      }
    }
  }

  // 3. Fallback to Moodle student name or cleaned fileName
  if (!studentName) {
    if (moodleStudentName) {
      studentName = moodleStudentName;
    } else {
      const baseName = fileName
        .replace(/\.[^/.]+$/, '')
        .replace(/(?:лабораторная|лаб|лаба|lr|lab)\s*\d*/gi, '')
        .replace(/[-_]/g, ' ')
        .trim();
      studentName = cleanStudentDisplayName(baseName) || 'Студент';
    }
  }

  // Fallback group from filename if not yet found
  if (!groupName || groupName === 'Группа 1') {
    const fromFile = extractGroupFromText(fileName);
    if (fromFile) {
      groupName = fromFile;
    }
  }

  return { studentName, groupName: groupName || 'Группа 1' };
}

export function detectLabType(
  code: string,
  fileName = '',
  fallbackLab: 'lab1' | 'lab2' | 'lab3' = 'lab1'
): 'lab1' | 'lab2' | 'lab3' {
  // 1. Explicit filename cues
  if (/lab_?3|лабораторная_?3|практика_?3|лаб_?3|лр_?3/i.test(fileName)) return 'lab3';
  if (/lab_?2|лабораторная_?2|практика_?2|лаб_?2|лр_?2/i.test(fileName)) return 'lab2';
  if (/lab_?1|лабораторная_?1|практика_?1|лаб_?1|лр_?1/i.test(fileName)) return 'lab1';

  // 2. Explicit header comments in code
  if (/(?:лабораторная|лаб\.?|практическая|практика|лр)\s*(?:работа\s*)?№?\s*3\b/i.test(code)) {
    return 'lab3';
  }
  if (/(?:лабораторная|лаб\.?|практическая|практика|лр)\s*(?:работа\s*)?№?\s*2\b/i.test(code)) {
    return 'lab2';
  }
  if (/(?:лабораторная|лаб\.?|практическая|практика|лр)\s*(?:работа\s*)?№?\s*1\b/i.test(code)) {
    return 'lab1';
  }

  // 3. Lab 3 specific keywords
  if (
    /(?:двойной\s+факториал|n!!|гармоническ|фибоначчи|однопроходн|округленные\s+значения|дробные\s+части|признак\s+его\s+завершения|вложенные\s+циклы|последовательность\s+(?:целых\s+чисел\s+)?a[kк]|сумма\s+первых\s+n\s+нечетных|квадрат\s+данного\s+числа.*n2\s*=|1\.1\s*–\s*1\.2\s*\+\s*1\.3|набор\s+из\s+n\s+(?:вещественных|положительных|целых)\s+чисел|последними\s+двумя\s+нулями|k\s+наборов\s+ненулевых|элементы\s+набора\s+возрастают)/i.test(
      code
    )
  ) {
    return 'lab3';
  }

  // 4. Lab 2 specific markers:
  // Numbers 21..25 only exist in Lab 2 (Lab 3 has 20 tasks, Lab 1 has only 1.1-1.5, 2.1-2.6, 3.1-3.5, 4.1-4.7)
  if (/(?:^|\n)\s*#+\s*(?:задача|задание|task|№)?\s*(?:[12]\.)?2[1-5](?:\.|\b)/i.test(code)) {
    return 'lab2';
  }

  // Lab 2 keywords
  if (
    /(?:счастлив\w*\s+билет|секунд\s+с\s+начала|полных\s+метров|полных\s+тонн|трехзначн|двузначн|день\s+года|факторион)/i.test(
      code
    )
  ) {
    return 'lab2';
  }

  // 5. Lab 1 specific markers:
  // Blocks 3.x and 4.x (e.g. # 3.1, # 4.1) only if not already detected as Lab 3
  if (/(?:^|\n)\s*#+\s*(?:задача|задание|task|№)?\s*[34]\.[1-7]\b/i.test(code)) {
    if (fallbackLab === 'lab3') return 'lab3';
    return 'lab1';
  }

  // Task numbers 8..20 could be Lab 2 or Lab 3
  if (/(?:^|\n)\s*#+\s*(?:задача|задание|task|№)?\s*(?:1\d|20)\b/i.test(code)) {
    if (fallbackLab === 'lab3') return 'lab3';
    return 'lab2';
  }

  return fallbackLab;
}

export function splitCodeIntoTasks(
  code: string,
  fileName = '',
  targetLab?: 'lab1' | 'lab2' | 'lab3'
): { [taskId: string]: string } {
  const lab = targetLab || detectLabType(code, fileName);

  if (lab === 'lab3') {
    return splitCodeForLab3(code, fileName);
  }
  if (lab === 'lab2') {
    return splitCodeForLab2(code, fileName);
  }

  return splitCodeForLab1(code, fileName);
}

function splitCodeForLab1(code: string, fileName: string): { [taskId: string]: string } {
  const taskMap: { [taskId: string]: string } = {};

  // Split lines and scan for task markers like # 1.1, # Задача 1.2
  const taskMarkerRegex = /(?:^|\n)\s*#+\s*(?:задача|задание|task)?\s*([1-4]\.[1-7])\b/gi;
  const rawMatches: { taskId: string; index: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = taskMarkerRegex.exec(code)) !== null) {
    rawMatches.push({
      taskId: m[1],
      index: m.index,
    });
  }

  if (rawMatches.length === 0) {
    const printMarkerRegex = /(?:^|\n)\s*print\s*\(\s*["']([1-4]\.[1-7])\b/gi;
    while ((m = printMarkerRegex.exec(code)) !== null) {
      rawMatches.push({
        taskId: m[1],
        index: m.index,
      });
    }
  }

  // Once a task ID is seen, do not register it again later in the file
  const matches: { taskId: string; index: number }[] = [];
  const seenTaskIds = new Set<string>();
  for (const item of rawMatches) {
    if (seenTaskIds.has(item.taskId)) {
      continue;
    }
    seenTaskIds.add(item.taskId);
    matches.push(item);
  }

  if (matches.length === 0) {
    const fileBase = fileName.replace(/\.[^/.]+$/, '').trim();
    const isLabName = /(?:lab|лаб|лабораторн|практик|лр|работа)/i.test(fileBase);
    if (!isLabName) {
      const fileTaskMatch =
        fileBase.match(/^(?:task|задача|задание)[_\s-]*([1-4]\.[1-7])$/i) ||
        fileBase.match(/^([1-4]\.[1-7])$/i);
      if (fileTaskMatch) {
        taskMap[fileTaskMatch[1]] = code;
        return taskMap;
      }
    }
    taskMap['1.1'] = code;
    return taskMap;
  }

  return extractSnippets(code, matches);
}

/**
 * Checks if a line is a direction prompt or interactive menu, NOT a task delimiter!
 * E.g. print('1 - west 0 - north -1 - east -2 - south')
 * or input('1 - север, 2 - запад, 3 - юг, 4 - восток')
 */
function isDirectionOrMenuPrompt(line: string): boolean {
  const norm = line.toLowerCase();
  // Contains directions in English or Russian
  const hasDirections = /(?:west|north|east|south|север|запад|восток|юг|влево|вправо)/.test(norm);
  // Contains multiple numbered options (e.g., '1 - ... 0 - ...' or '1: ... 2: ...')
  const hasMultipleOptions = /(?:-?\d+\s*[-–—:]\s*\w+[\s\S]+-?\d+\s*[-–—:]\s*\w+)/.test(norm);
  return hasDirections || hasMultipleOptions;
}

/**
 * Detects if a line announces a group/section header in Lab 3 or Lab 2.
 */
function detectGroupHeader(line: string): number | null {
  const norm = line.toLowerCase().replace(/^[#\s/\\*=-]+/, '').trim();
  if (/(?:^|\b)(?:1[\.\)]\s*(?:цикл\s+с\s+параметром|группа\s+for)|группа\s*1\b|group\s*1\b|блок\s*1\b|раздел\s*1\b)/i.test(norm)) {
    return 1;
  }
  if (/(?:^|\b)(?:2[\.\)]\s*(?:цикл\s+с\s+условием|группа\s+while)|группа\s*2\b|group\s*2\b|блок\s*2\b|раздел\s*2\b)/i.test(norm)) {
    return 2;
  }
  if (/(?:^|\b)(?:3[\.\)]\s*однопроходн|группа\s*3\b|group\s*3\b|блок\s*3\b|раздел\s*3\b)/i.test(norm)) {
    return 3;
  }
  if (/(?:^|\b)(?:4[\.\)]\s*вложенн|группа\s*4\b|group\s*4\b|блок\s*4\b|раздел\s*4\b)/i.test(norm)) {
    return 4;
  }
  return null;
}

/**
 * Resolves task number taking into account group context and duplicate prevention.
 */
function resolveTaskNumber(
  num: number,
  currentGroup: number,
  maxTaskNum: number,
  labPrefix: '2' | '3',
  seenTaskIds: Set<string>
): string | null {
  if (num > maxTaskNum) return null;

  // In Lab 3 (20 tasks, 4 groups of 5):
  // If student restarted numbering from 1..5 in Group 2, 3, or 4
  if (labPrefix === '3' && num <= 5) {
    if (currentGroup > 1 && seenTaskIds.has(String(num))) {
      const mapped = (currentGroup - 1) * 5 + num;
      if (mapped <= maxTaskNum) {
        return String(mapped);
      }
    }
  }

  return String(num);
}

/**
 * Flexible extractor for task markers on a single line.
 * Supports:
 * - Comments: # 1, # Задача 1, # Задача № 1, # 1-я задача, # 1 задача, # Task 1, # 1.1, # 2.1
 * - Decorated borders: # ===== 1 =====, # ----- Задача 1 -----
 * - Condition text starts: # 1. Дано целое число N...
 * - Docstrings: """ 1 """, """ Задача 1 """
 * - Print statements: print("--- 1 ---"), print("Задача 1")
 */
function parseTaskMarkerFromLine(
  line: string,
  currentGroup: number,
  maxTaskNum: number,
  labPrefix: '2' | '3',
  seenTaskIds: Set<string>
): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (isDirectionOrMenuPrompt(line)) return null;

  const isComment = /^[ \t]*#+/.test(line);
  const isDocstring = /^[ \t]*(?:"""|''')/.test(line);
  const isPrint = /^[ \t]*print\s*\(/i.test(line);

  if (!isComment && !isDocstring && !isPrint) {
    return null;
  }

  let content = trimmed;
  if (isComment) {
    content = content.replace(/^[ \t]*#+[ \t]*/, '');
  } else if (isDocstring) {
    content = content.replace(/^[ \t]*(?:"""|''')[ \t]*/, '').replace(/[ \t]*(?:"""|''')[ \t]*$/, '');
  } else if (isPrint) {
    const printInner = content.match(/^[ \t]*print\s*\(\s*["']([^"']*)["']/i);
    if (!printInner) return null;
    content = printInner[1];
  }

  // Strip decorative borders: ===, ---, ***, ___, ~~~, +++
  content = content.replace(/^[-=*~_+ \t|/]+/, '').replace(/[-=*~_+ \t|/]+$/, '').trim();
  if (!content) return null;

  // Avoid pure group headers without task number
  if (
    /^(?:[1-4]\.\s*)?(?:цикл\s+с\s+параметром|цикл\s+с\s+условием|однопроходн|вложенн|лабораторн|практическ)/i.test(content) &&
    !/(?:задач|задан|task|№|номер)\s*\d+/i.test(content)
  ) {
    return null;
  }

  // Pattern 1: Explicit subtask notation, e.g. "1.1", "2.3", "3.2", "4.1", "Задача 2.1"
  const subtaskMatch = content.match(
    /(?:(?:задача|задание|task|завдання|номер|№|ex)?\.?[ \t]*)?([1-4])\s*[\.\-_]\s*(2[0-5]|1\d|[1-9])(?:\s*[\.\):\-–—]|\s+|$)/i
  );
  if (subtaskMatch) {
    const grp = parseInt(subtaskMatch[1], 10);
    const sub = parseInt(subtaskMatch[2], 10);

    if (labPrefix === '3') {
      if (grp === 3 && sub > 5 && sub <= maxTaskNum) {
        return String(sub);
      }
      if (sub <= 5) {
        const mapped = (grp - 1) * 5 + sub;
        if (mapped <= maxTaskNum) {
          return String(mapped);
        }
      }
    } else {
      if (grp === 2 && sub <= maxTaskNum) {
        return String(sub);
      }
    }
  }

  // Pattern 2: Keyword then number:
  // "Задача 1", "Задача № 1", "Задание №1", "Task 12", "№ 13", "Номер 5", "Ex 4", "Пункт 3"
  const keywordMatch = content.match(
    /^(?:задача|задание|task|завдання|номер|ex|exercise|упражнение|пункт|п\.?|№|no\.?|n\.?)\s*(?:№|no\.?|n\.?)?\s*(2[0-5]|1\d|[1-9])(?:\s*[\.\):\-–—]|\s+|$)/i
  );
  if (keywordMatch) {
    const num = parseInt(keywordMatch[1], 10);
    return resolveTaskNumber(num, currentGroup, maxTaskNum, labPrefix, seenTaskIds);
  }

  // Pattern 3: Number then keyword:
  // "1 задача", "1-я задача", "1 задание", "1-е задание", "1 task", "1-й", "1я"
  const numFirstMatch = content.match(
    /^(2[0-5]|1\d|[1-9])\s*(?:-?[а-яa-z]{1,2})?\s*(?:задач\w*|задан\w*|task\w*|упражн\w*|номер\w*|№)(?:\s*[\.\):\-–—]|\s+|$)/i
  );
  if (numFirstMatch) {
    const num = parseInt(numFirstMatch[1], 10);
    return resolveTaskNumber(num, currentGroup, maxTaskNum, labPrefix, seenTaskIds);
  }

  // Pattern 4: Bare number at start of line with delimiter or text:
  // "1", "1.", "1)", "1:", "1 -", "1. Дано целое число...", "1. Квадрат..."
  const bareNumMatch = content.match(
    /^(2[0-5]|1\d|[1-9])(?:\s*[\.\):\-–—]|\s+|$)/
  );
  if (bareNumMatch) {
    const num = parseInt(bareNumMatch[1], 10);
    return resolveTaskNumber(num, currentGroup, maxTaskNum, labPrefix, seenTaskIds);
  }

  return null;
}

/**
 * Robust sequential extractor for numbered labs (Lab 2 has 1..25, Lab 3 has 1..20).
 * Rule requested by user:
 * "Давай если номер 1 уже встретилась и мы ее проверили, мы на эту цифру больше не реагируем. И так со всеми, логично ж?"
 * Once a task number (e.g. 1) is found and registered, subsequent occurrences of that digit
 * in comments or print statements (e.g. in task 23) are COMPLETELY IGNORED!
 */
function splitNumberedLab(
  code: string,
  fileName: string,
  maxTaskNum: number,
  labPrefix: '2' | '3'
): { [taskId: string]: string } {
  const taskMap: { [taskId: string]: string } = {};

  const rawMatches: { taskId: string; index: number; fullLine: string }[] = [];
  const lines = code.split('\n');
  let currentGroup = 1;
  let charOffset = 0;
  const seenTaskIds = new Set<string>();

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l];

    // Check for section / group transition
    const groupDetected = detectGroupHeader(line);
    if (groupDetected !== null) {
      currentGroup = groupDetected;
    }

    const taskId = parseTaskMarkerFromLine(line, currentGroup, maxTaskNum, labPrefix, seenTaskIds);
    if (taskId && !seenTaskIds.has(taskId)) {
      seenTaskIds.add(taskId);
      rawMatches.push({
        taskId,
        index: charOffset,
        fullLine: line,
      });
    }

    charOffset += line.length + 1; // +1 for the newline
  }

  // Fallback if no task markers detected: check if filename itself denotes a specific single task
  if (rawMatches.length === 0) {
    const fileBase = fileName.replace(/\.[^/.]+$/, '').trim();
    const isLabName = /(?:lab|лаб|лабораторн|практик|лр|работа)/i.test(fileBase);
    if (!isLabName) {
      const fileTaskMatch =
        fileBase.match(/^(?:task|задача|задание|номер|ex)[_\s-]*([1-9]|1\d|2[0-5])$/i) ||
        fileBase.match(/^([1-9]|1\d|2[0-5])$/i);
      if (fileTaskMatch) {
        const num = parseInt(fileTaskMatch[1], 10);
        if (num <= maxTaskNum) {
          const singleId = String(num);
          taskMap[singleId] = code;
          taskMap[`${labPrefix}.${singleId}`] = code;
          return taskMap;
        }
      }
    }

    taskMap['1'] = code;
    taskMap[`${labPrefix}.1`] = code;
    return taskMap;
  }

  const extracted = extractSnippets(code, rawMatches);
  for (const [key, val] of Object.entries(extracted)) {
    taskMap[key] = val;
    taskMap[`${labPrefix}.${key}`] = val;
    taskMap[`1.${key}`] = val;
    taskMap[`task_${key}`] = val;
    taskMap[`задача_${key}`] = val;

    // In Lab 3, also store subtask aliases so lookups like '2.1' or '3.1' always resolve:
    if (labPrefix === '3') {
      const n = parseInt(key, 10);
      if (n >= 1 && n <= 5) {
        taskMap[`1.${n}`] = val;
      } else if (n >= 6 && n <= 10) {
        taskMap[`2.${n - 5}`] = val;
      } else if (n >= 11 && n <= 15) {
        taskMap[`3.${n - 10}`] = val;
      } else if (n >= 16 && n <= 20) {
        taskMap[`4.${n - 15}`] = val;
      }
    }
  }
  return taskMap;
}


function splitCodeForLab2(code: string, fileName: string): { [taskId: string]: string } {
  return splitNumberedLab(code, fileName, 25, '2');
}

function splitCodeForLab3(code: string, fileName: string): { [taskId: string]: string } {
  return splitNumberedLab(code, fileName, 20, '3');
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

  const fileHasMathImport = code.includes('import math') || code.includes('from math') || /\bmath\./.test(code);
  const fileHasRandomImport = code.includes('import random') || code.includes('from random') || /\brandom\./.test(code);

  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const startIndex = current.index;
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : code.length;
    let snippet = code.slice(startIndex, endIndex).trim();

    const neededImports: string[] = [];

    if (
      (fileHasMathImport || /\bmath\b/.test(snippet)) &&
      !snippet.includes('import math') &&
      !snippet.includes('from math') &&
      !preambleImports.includes('math')
    ) {
      neededImports.push('import math');
    }

    if (
      (fileHasRandomImport || /\brandom\b/.test(snippet)) &&
      !snippet.includes('import random') &&
      !snippet.includes('from random') &&
      !preambleImports.includes('random')
    ) {
      neededImports.push('import random');
    }

    if (preambleImports) {
      const missingPreamble = preambleImports
        .split('\n')
        .filter((imp) => !snippet.includes(imp))
        .join('\n');
      if (missingPreamble) {
        snippet = missingPreamble + '\n' + snippet;
      }
    }

    if (neededImports.length > 0) {
      snippet = neededImports.join('\n') + '\n' + snippet;
    }

    taskMap[current.taskId] = snippet;
  }

  return taskMap;
}
