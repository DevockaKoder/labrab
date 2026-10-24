import { LabTask } from '../types';
import { extractNumbers } from './lab1Tasks';

function cleanText(text: string): string {
  return text.trim().replace(/\r\n/g, '\n');
}

export const LAB4_TASKS: LabTask[] = [
  // ==========================================
  // РАЗДЕЛ 1. Задачи для самостоятельного выполнения (1 - 6)
  // ==========================================
  {
    id: '1',
    section: '1. Базовые операции со строками',
    title: 'Код символа C в таблице символов',
    condition: 'Дан символ C. Вывести его код (то есть номер в кодовой таблице).',
    formulaDescription: 'ord(C)',
    sampleCode: `# 1\nC = input().strip()\nprint(ord(C[0]))`,
    testCases: [
      {
        id: '4_1_t1',
        description: 'Символ "A" (латинский) -> код 65',
        inputs: ['A'],
        expectedValueDescription: '65',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(65);
          return {
            passed,
            details: passed ? 'Код символа "A" корректно определен как 65' : 'Ожидался код 65',
            expected: '65',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '4_1_t2',
        description: 'Символ "a" -> 97',
        inputs: ['a'],
        expectedValueDescription: '97',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(97);
          return {
            passed,
            details: passed ? 'Код символа "a" корректно равен 97' : 'Ожидался код 97',
            expected: '97',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '4_1_t3',
        description: 'Символ "0" -> 48',
        inputs: ['0'],
        expectedValueDescription: '48',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(48);
          return {
            passed,
            details: passed ? 'Код символа "0" корректно равен 48' : 'Ожидался код 48',
            expected: '48',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '2',
    section: '1. Базовые операции со строками',
    title: 'N последних строчных букв латинского алфавита в обратном порядке',
    condition: 'Дано целое число N (1 ≤ N ≤ 26). Вывести N последних строчных (то есть маленьких) букв латинского алфавита в обратном порядке (начиная с буквы «z»).',
    sampleCode: `# 2\nN = int(input())\nfor i in range(N):\n    print(chr(ord('z') - i), end='')\nprint()`,
    testCases: [
      {
        id: '4_2_t1',
        description: 'N = 5 -> z y x w v (или zyxwv)',
        inputs: [5],
        expectedValueDescription: 'zyxwv',
        validator: (stdout) => {
          const cleaned = stdout.toLowerCase().replace(/[^a-z]/g, '');
          const passed = cleaned.includes('zyxwv') || (cleaned.startsWith('zyx') && cleaned.length >= 5);
          return {
            passed,
            details: passed ? '5 последних букв корректно выведены в обратном порядке' : 'Ожидалось zyxwv',
            expected: 'zyxwv',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '4_2_t2',
        description: 'N = 3 -> zyx',
        inputs: [3],
        expectedValueDescription: 'zyx',
        validator: (stdout) => {
          const cleaned = stdout.toLowerCase().replace(/[^a-z]/g, '');
          const passed = cleaned.includes('zyx');
          return {
            passed,
            details: passed ? '3 последние буквы выведены корректно' : 'Ожидалось zyx',
            expected: 'zyx',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '3',
    section: '1. Базовые операции со строками',
    title: 'Символы, предшествующий и следующий за символом C',
    condition: 'Дан символ C. Вывести два символа, первый из которых предшествует символу C в кодовой таблице, а второй следует за символом C.',
    sampleCode: `# 3\nC = input().strip()[0]\nprint(chr(ord(C) - 1), chr(ord(C) + 1))`,
    testCases: [
      {
        id: '4_3_t1',
        description: 'Символ "b" -> "a" и "c"',
        inputs: ['b'],
        expectedValueDescription: 'a c',
        validator: (stdout) => {
          const lower = stdout.toLowerCase();
          const passed = lower.includes('a') && lower.includes('c');
          return {
            passed,
            details: passed ? 'Предшествующий и следующий символы определены верно' : 'Ожидались символы "a" и "c"',
            expected: 'a c',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '4_3_t2',
        description: 'Символ "5" -> "4" и "6"',
        inputs: ['5'],
        expectedValueDescription: '4 6',
        validator: (stdout) => {
          const passed = stdout.includes('4') && stdout.includes('6');
          return {
            passed,
            details: passed ? 'Символы "4" и "6" для "5" найдены верно' : 'Ожидались символы "4" и "6"',
            expected: '4 6',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '4',
    section: '1. Базовые операции со строками',
    title: 'Строка длины N из символов C',
    condition: 'Дано целое число N (> 0) и символ C. Вывести строку длины N, которая состоит из символов C.',
    sampleCode: `# 4\nN = int(input())\nC = input().strip()\nprint(C[0] * N)`,
    testCases: [
      {
        id: '4_4_t1',
        description: 'N = 5, C = "*" -> "*****"',
        inputs: [5, '*'],
        expectedValueDescription: '*****',
        validator: (stdout) => {
          const passed = stdout.includes('*****');
          return {
            passed,
            details: passed ? 'Строка длины 5 из звездочек сформирована верно' : 'Ожидалось *****',
            expected: '*****',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '4_4_t2',
        description: 'N = 4, C = "A" -> "AAAA"',
        inputs: [4, 'A'],
        expectedValueDescription: 'AAAA',
        validator: (stdout) => {
          const passed = stdout.includes('AAAA');
          return {
            passed,
            details: passed ? 'Строка длины 4 из символов "A" сформирована верно' : 'Ожидалось AAAA',
            expected: 'AAAA',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '5',
    section: '1. Базовые операции со строками',
    title: 'Строка с пробелами между символами',
    condition: 'Дана непустая строка S. Вывести строку, содержащую символы строки S, между которыми вставлено по одному пробелу.',
    sampleCode: `# 5\nS = input().strip()\nprint(' '.join(S))`,
    testCases: [
      {
        id: '4_5_t1',
        description: 'S = "Python" -> "P y t h o n"',
        inputs: ['Python'],
        expectedValueDescription: 'P y t h o n',
        validator: (stdout) => {
          const passed = stdout.includes('P y t h o n') || /P\s+y\s+t\s+h\s+o\s+n/i.test(stdout);
          return {
            passed,
            details: passed ? 'Символы строки разделены пробелами' : 'Ожидалось "P y t h o n"',
            expected: 'P y t h o n',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '4_5_t2',
        description: 'S = "код" -> "к о д"',
        inputs: ['код'],
        expectedValueDescription: 'к о д',
        validator: (stdout) => {
          const passed = stdout.includes('к о д') || /к\s+о\s+д/i.test(stdout);
          return {
            passed,
            details: passed ? 'Пробелы вставлены верно' : 'Ожидалось "к о д"',
            expected: 'к о д',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '6',
    section: '1. Базовые операции со строками',
    title: 'Строка с N звездочками между символами',
    condition: 'Дана непустая строка S и целое число N (> 0). Вывести строку, содержащую символы строки S, между которыми вставлено по N символов «*» (звездочка).',
    sampleCode: `# 6\nS = input().strip()\nN = int(input())\nprint(('*' * N).join(S))`,
    testCases: [
      {
        id: '4_6_t1',
        description: 'S = "cat", N = 2 -> "c**a**t"',
        inputs: ['cat', 2],
        expectedValueDescription: 'c**a**t',
        validator: (stdout) => {
          const passed = stdout.includes('c**a**t');
          return {
            passed,
            details: passed ? 'Строка со звездочками сформирована верно' : 'Ожидалось c**a**t',
            expected: 'c**a**t',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '4_6_t2',
        description: 'S = "AB", N = 3 -> "A***B"',
        inputs: ['AB', 3],
        expectedValueDescription: 'A***B',
        validator: (stdout) => {
          const passed = stdout.includes('A***B');
          return {
            passed,
            details: passed ? 'По 3 звездочки между символами вставлены верно' : 'Ожидалось A***B',
            expected: 'A***B',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },

  // ==========================================
  // РАЗДЕЛ 2. Индексация и нарезание срезов (7 - 18)
  // ==========================================
  {
    id: '7',
    section: '2. Индексация и срезы строк',
    title: 'Коды первого и последнего символа строки',
    condition: 'Дана непустая строка. Вывести коды ее первого и последнего символа.',
    sampleCode: `# 7\nS = input().strip()\nprint(ord(S[0]), ord(S[-1]))`,
    testCases: [
      {
        id: '4_7_t1',
        description: 'S = "hello" -> 104 (h) и 111 (o)',
        inputs: ['hello'],
        expectedValueDescription: '104 111',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(104) && nums.includes(111);
          return {
            passed,
            details: passed ? 'Коды первого (104) и последнего (111) символов найдены верно' : 'Ожидались 104 и 111',
            expected: '104, 111',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '4_7_t2',
        description: 'S = "ABC" -> 65 (A) и 67 (C)',
        inputs: ['ABC'],
        expectedValueDescription: '65 67',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(65) && nums.includes(67);
          return {
            passed,
            details: passed ? 'Коды 65 и 67 определены верно' : 'Ожидались 65 и 67',
            expected: '65, 67',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '8',
    section: '2. Индексация и срезы строк',
    title: 'Строка в обратном порядке (реверс)',
    condition: 'Дана строка. Вывести строку, содержащую те же символы, но расположенные в обратном порядке.',
    sampleCode: `# 8\nS = input().strip()\nprint(S[::-1])`,
    testCases: [
      {
        id: '4_8_t1',
        description: 'S = "Привет" -> "тевирП"',
        inputs: ['Привет'],
        expectedValueDescription: 'тевирП',
        validator: (stdout) => {
          const passed = stdout.includes('тевирП');
          return {
            passed,
            details: passed ? 'Строка успешно развернута в обратном порядке' : 'Ожидалось "тевирП"',
            expected: 'тевирП',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '4_8_t2',
        description: 'S = "hello" -> "olleh"',
        inputs: ['hello'],
        expectedValueDescription: 'olleh',
        validator: (stdout) => {
          const passed = stdout.includes('olleh');
          return {
            passed,
            details: passed ? 'Реверс строки выполнен верно' : 'Ожидалось "olleh"',
            expected: 'olleh',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '9',
    section: '2. Индексация и срезы строк',
    title: 'Копия строки длиной более 10 символов через срез',
    condition: 'Дана строка длиной более 10 символов. Создать ее копию, через использование среза.',
    sampleCode: `# 9\nS = input().strip()\ncopy_S = S[:]\nprint(copy_S)`,
    testCases: [
      {
        id: '4_9_t1',
        description: 'S = "programming123" -> копирование через срез S[:]',
        inputs: ['programming123'],
        expectedValueDescription: 'programming123',
        validator: (stdout) => {
          const passed = stdout.includes('programming123');
          return {
            passed,
            details: passed ? 'Копия строки успешно получена и выведена' : 'Ожидалась строка "programming123"',
            expected: 'programming123',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '10',
    section: '2. Индексация и срезы строк',
    title: '5-й элемент строки длиной более 10 символов',
    condition: 'Дана строка длиной более 10 символов. Получить из нее 5-тый элемент строки.',
    sampleCode: `# 10\nS = input().strip()\nprint(S[4])`,
    testCases: [
      {
        id: '4_10_t1',
        description: 'S = "abcdefghijkl" -> 5-й символ "e" (индекс 4) или "f" (индекс 5)',
        inputs: ['abcdefghijkl'],
        expectedValueDescription: 'e',
        validator: (stdout) => {
          const clean = stdout.trim();
          const passed = clean.includes('e') || clean.includes('f');
          return {
            passed,
            details: passed ? '5-й элемент строки успешно извлечен' : 'Ожидался символ "e" (индекс 4)',
            expected: 'e',
            actual: clean,
          };
        },
      },
    ],
  },
  {
    id: '11',
    section: '2. Индексация и срезы строк',
    title: 'Последний элемент строки',
    condition: 'Дана строка длиной более 10 символов. Получить из нее последний элемент строки.',
    sampleCode: `# 11\nS = input().strip()\nprint(S[-1])`,
    testCases: [
      {
        id: '4_11_t1',
        description: 'S = "abcdefghijkZ" -> последний символ "Z"',
        inputs: ['abcdefghijkZ'],
        expectedValueDescription: 'Z',
        validator: (stdout) => {
          const passed = stdout.includes('Z');
          return {
            passed,
            details: passed ? 'Последний элемент успешно получен через S[-1]' : 'Ожидался символ "Z"',
            expected: 'Z',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '12',
    section: '2. Индексация и срезы строк',
    title: 'Срез из первых 5 символов строки',
    condition: 'Дана строка длиной более 10 символов. Получить из нее срез из первых 5 символов.',
    sampleCode: `# 12\nS = input().strip()\nprint(S[:5])`,
    testCases: [
      {
        id: '4_12_t1',
        description: 'S = "abcdefghijklmn" -> первые 5 символов "abcde"',
        inputs: ['abcdefghijklmn'],
        expectedValueDescription: 'abcde',
        validator: (stdout) => {
          const passed = stdout.includes('abcde');
          return {
            passed,
            details: passed ? 'Срез первых 5 символов выполнен верно' : 'Ожидалось "abcde"',
            expected: 'abcde',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '13',
    section: '2. Индексация и срезы строк',
    title: 'Срез из последних 5 символов строки',
    condition: 'Дана строка длиной более 10 символов. Получить из нее срез из последних 5 символов.',
    sampleCode: `# 13\nS = input().strip()\nprint(S[-5:])`,
    testCases: [
      {
        id: '4_13_t1',
        description: 'S = "abcdefghij12345" -> последние 5 символов "12345"',
        inputs: ['abcdefghij12345'],
        expectedValueDescription: '12345',
        validator: (stdout) => {
          const passed = stdout.includes('12345');
          return {
            passed,
            details: passed ? 'Срез последних 5 символов выполнен верно' : 'Ожидалось "12345"',
            expected: '12345',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '14',
    section: '2. Индексация и срезы строк',
    title: 'Срез из 5 символов, начиная с 4-го символа',
    condition: 'Дана строка длиной более 10 символов. Получить из нее срез из 5 символов, начиная с 4 символа строки.',
    sampleCode: `# 14\nS = input().strip()\nprint(S[3:8])`,
    testCases: [
      {
        id: '4_14_t1',
        description: 'S = "0123456789abc" -> начиная с 4-го символа ("3"): "34567" (или "45678")',
        inputs: ['0123456789abc'],
        expectedValueDescription: '34567',
        validator: (stdout) => {
          const passed = stdout.includes('34567') || stdout.includes('45678');
          return {
            passed,
            details: passed ? 'Срез из 5 символов с 4-й позиции извлечен верно' : 'Ожидалось "34567" (или "45678")',
            expected: '34567',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '15',
    section: '2. Индексация и срезы строк',
    title: 'Срез из 5 символов, начиная с 4-го символа от конца',
    condition: 'Дана строка длиной более 10 символов. Получить из нее срез из 5 символов, начиная с 4 символа от конца строки.',
    sampleCode: `# 15\nS = input().strip()\nprint(S[-8:-3])`,
    testCases: [
      {
        id: '4_15_t1',
        description: 'S = "abcdefghijklmn" -> срез из 5 символов от конца',
        inputs: ['abcdefghijklmn'],
        expectedValueDescription: 'ghijk (или соседний 5-символьный срез)',
        validator: (stdout) => {
          const clean = stdout.trim();
          // Any reasonable 5-char slice around the 4th from end: e.g. "ghijk", "hijkl", "fghij"
          const passed = ['ghijk', 'hijkl', 'fghij', 'klmn'].some((sub) => clean.includes(sub)) || clean.length === 5;
          return {
            passed,
            details: passed ? 'Срез от конца строки выполнен корректно' : 'Ожидался срез из 5 символов от конца',
            expected: '5 символов от конца строки (например, "ghijk")',
            actual: clean,
          };
        },
      },
    ],
  },
  {
    id: '16',
    section: '2. Индексация и срезы строк',
    title: 'Каждый второй элемент строки',
    condition: 'Дана строка длиной более 10 символов. Получить из нее каждый второй элемент строки.',
    sampleCode: `# 16\nS = input().strip()\nprint(S[::2])`,
    testCases: [
      {
        id: '4_16_t1',
        description: 'S = "abcdefghijkl" -> каждый 2-й: "acegik"',
        inputs: ['abcdefghijkl'],
        expectedValueDescription: 'acegik',
        validator: (stdout) => {
          const clean = stdout.trim();
          const passed = clean.includes('acegik') || clean.includes('bdfhjl');
          return {
            passed,
            details: passed ? 'Каждый второй элемент извлечен верно через срез S[::2]' : 'Ожидалось "acegik"',
            expected: 'acegik',
            actual: clean,
          };
        },
      },
    ],
  },
  {
    id: '17',
    section: '2. Индексация и срезы строк',
    title: 'Каждый второй элемент строки в обратном порядке',
    condition: 'Дана строка длиной более 10 символов. Получить из нее каждый второй элемент строки, расположенные в обратном порядке.',
    sampleCode: `# 17\nS = input().strip()\nprint(S[::-2])`,
    testCases: [
      {
        id: '4_17_t1',
        description: 'S = "abcdefghijkl" -> каждый 2-й в обратном порядке: "ljigec" или "kigeca"',
        inputs: ['abcdefghijkl'],
        expectedValueDescription: 'ljigec',
        validator: (stdout) => {
          const clean = stdout.trim();
          const passed = clean.includes('ljigec') || clean.includes('kigeca');
          return {
            passed,
            details: passed ? 'Каждый второй элемент в обратном порядке извлечен верно через S[::-2]' : 'Ожидалось "ljigec" или "kigeca"',
            expected: 'ljigec',
            actual: clean,
          };
        },
      },
    ],
  },
  {
    id: '18',
    section: '2. Индексация и срезы строк',
    title: 'Срез из 5 символов от 4-го с конца в обратном порядке',
    condition: 'Дана строка длиной более 10 символов. Получить из нее срез из 5 символов, начиная с 4 символа от конца строки, идущие в обратном порядке.',
    sampleCode: `# 18\nS = input().strip()\nprint(S[-4:-9:-1])`,
    testCases: [
      {
        id: '4_18_t1',
        description: 'S = "abcdefghijklmn" -> 5 символов от 4 с конца назад: "kjihg"',
        inputs: ['abcdefghijklmn'],
        expectedValueDescription: 'kjihg',
        validator: (stdout) => {
          const clean = stdout.trim();
          const passed = clean.includes('kjihg') || clean.includes('jihgf') || clean.includes('lkjih');
          return {
            passed,
            details: passed ? 'Срез в обратном порядке извлечен верно' : 'Ожидалась последовательность "kjihg"',
            expected: 'kjihg',
            actual: clean,
          };
        },
      },
    ],
  },

  // ==========================================
  // РАЗДЕЛ 3. Посимвольный анализ, строки и числа (19 - 25)
  // ==========================================
  {
    id: '19',
    section: '3. Посимвольный анализ и преобразование строк',
    title: 'Подсчет количества цифр в строке',
    condition: 'Дана строка. Подсчитать количество содержащихся в ней цифр.',
    sampleCode: `# 19\nS = input().strip()\ncount = sum(1 for c in S if c.isdigit())\nprint(count)`,
    testCases: [
      {
        id: '4_19_t1',
        description: 'S = "abc123d4!5" -> 5 цифр',
        inputs: ['abc123d4!5'],
        expectedValueDescription: '5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(5);
          return {
            passed,
            details: passed ? 'Количество цифр (5) подсчитано верно' : 'Ожидалось 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '4_19_t2',
        description: 'S = "no digits here" -> 0 цифр',
        inputs: ['no digits here'],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Количество цифр (0) подсчитано верно' : 'Ожидалось 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '20',
    section: '3. Посимвольный анализ и преобразование строк',
    title: 'Количество прописных латинских букв в строке',
    condition: 'Дана строка. Подсчитать количество содержащихся в ней прописных латинских букв.',
    sampleCode: `# 20\nS = input().strip()\ncount = sum(1 for c in S if 'A' <= c <= 'Z')\nprint(count)`,
    testCases: [
      {
        id: '4_20_t1',
        description: 'S = "Hello World! ABC" -> 5 прописных латинских букв (H, W, A, B, C)',
        inputs: ['Hello World! ABC'],
        expectedValueDescription: '5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(5);
          return {
            passed,
            details: passed ? 'Количество прописных букв (5) подсчитано верно' : 'Ожидалось 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '4_20_t2',
        description: 'S = "python and Привет" -> 0 прописных латинских букв',
        inputs: ['python and Привет'],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Латинские заглавные буквы отсутствуют (0)' : 'Ожидалось 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '21',
    section: '3. Посимвольный анализ и преобразование строк',
    title: 'Преобразование прописных латинских букв в строчные',
    condition: 'Дана строка. Преобразовать в ней все прописные латинские буквы в строчные.',
    sampleCode: `# 21\nS = input().strip()\nres = ''.join(c.lower() if 'A' <= c <= 'Z' else c for c in S)\nprint(res)`,
    testCases: [
      {
        id: '4_21_t1',
        description: 'S = "HeLLo World! 123" -> "hello world! 123"',
        inputs: ['HeLLo World! 123'],
        expectedValueDescription: 'hello world! 123',
        validator: (stdout) => {
          const clean = stdout.trim();
          const passed = clean.includes('hello world! 123') || clean.toLowerCase().includes('hello world!');
          return {
            passed,
            details: passed ? 'Латинские буквы переведены в строчные' : 'Ожидалось "hello world! 123"',
            expected: 'hello world! 123',
            actual: clean,
          };
        },
      },
    ],
  },
  {
    id: '22',
    section: '3. Посимвольный анализ и преобразование строк',
    title: 'Инверсия регистра всех букв (латинских и русских)',
    condition: 'Дана строка. Преобразовать в ней все строчные буквы (как латинские, так и русские) в прописные, а прописные – в строчные.',
    formulaDescription: 'S.swapcase()',
    sampleCode: `# 22\nS = input().strip()\nprint(S.swapcase())`,
    testCases: [
      {
        id: '4_22_t1',
        description: 'S = "Привет World!" -> "пРИВЕТ wORLD!"',
        inputs: ['Привет World!'],
        expectedValueDescription: 'пРИВЕТ wORLD!',
        validator: (stdout) => {
          const clean = stdout.trim();
          const passed = clean.includes('пРИВЕТ wORLD!') || (clean.includes('пРИВЕТ') && clean.includes('wORLD'));
          return {
            passed,
            details: passed ? 'Регистр букв успешно инвертирован (swapcase)' : 'Ожидалось "пРИВЕТ wORLD!"',
            expected: 'пРИВЕТ wORLD!',
            actual: clean,
          };
        },
      },
    ],
  },
  {
    id: '23',
    section: '3. Посимвольный анализ и преобразование строк',
    title: 'Сумма цифр целого положительного числа (из строки)',
    condition: 'Дана строка, изображающая целое положительное число. Вывести сумму цифр этого числа.',
    sampleCode: `# 23\nS = input().strip()\nprint(sum(int(c) for c in S if c.isdigit()))`,
    testCases: [
      {
        id: '4_23_t1',
        description: 'S = "12345" -> сумма цифр 15',
        inputs: ['12345'],
        expectedValueDescription: '15',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(15);
          return {
            passed,
            details: passed ? 'Сумма цифр числа 12345 равна 15' : 'Ожидалась сумма 15',
            expected: '15',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '4_23_t2',
        description: 'S = "987" -> сумма 24',
        inputs: ['987'],
        expectedValueDescription: '24',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(24);
          return {
            passed,
            details: passed ? 'Сумма цифр числа 987 равна 24' : 'Ожидалась сумма 24',
            expected: '24',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '24',
    section: '3. Посимвольный анализ и преобразование строк',
    title: 'Сумма цифр целого положительного числа (вариант 2)',
    condition: 'Дана строка, изображающая целое положительное число. Вывести сумму цифр этого числа.',
    sampleCode: `# 24\nS = input().strip()\ns = 0\nfor ch in S:\n    if ch.isdigit():\n        s += int(ch)\nprint(s)`,
    testCases: [
      {
        id: '4_24_t1',
        description: 'S = "40506" -> сумма цифр 15',
        inputs: ['40506'],
        expectedValueDescription: '15',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(15);
          return {
            passed,
            details: passed ? 'Сумма цифр 40506 равна 15' : 'Ожидалась сумма 15',
            expected: '15',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '4_24_t2',
        description: 'S = "99" -> сумма цифр 18',
        inputs: ['99'],
        expectedValueDescription: '18',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(18);
          return {
            passed,
            details: passed ? 'Сумма цифр 99 равна 18' : 'Ожидалась сумма 18',
            expected: '18',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '25',
    section: '3. Посимвольный анализ и преобразование строк',
    title: 'Перевод двоичной строки в десятичное число',
    condition: 'Дана строка, изображающая двоичную запись целого положительного числа. Вывести строку, изображающую десятичную запись этого же числа.',
    formulaDescription: 'str(int(S, 2))',
    sampleCode: `# 25\nS = input().strip()\nprint(str(int(S, 2)))`,
    testCases: [
      {
        id: '4_25_t1',
        description: 'S = "1101" -> десятичное 13',
        inputs: ['1101'],
        expectedValueDescription: '13',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(13);
          return {
            passed,
            details: passed ? 'Двоичное число 1101 успешно переведено в десятичное 13' : 'Ожидалось 13',
            expected: '13',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '4_25_t2',
        description: 'S = "100000" -> десятичное 32',
        inputs: ['100000'],
        expectedValueDescription: '32',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(32);
          return {
            passed,
            details: passed ? 'Двоичное число 100000 переведено в 32' : 'Ожидалось 32',
            expected: '32',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
];
