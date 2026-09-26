import { LabTask } from '../types';
import { extractNumbers } from './lab1Tasks';

// Helper to normalize Russian text output for string-based tasks
function normalizeOutput(text: string): string {
  return text.toLowerCase().replace(/ё/g, 'е').replace(/[\t\r\n]+/g, ' ').trim();
}

export const LAB2_TASKS: LabTask[] = [
  // --- БЛОК 1: Целочисленная арифметика и разряды (1 - 10) ---
  {
    id: '1',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Расстояние в метрах (L // 100)',
    condition: 'Дано расстояние L в сантиметрах. Используя операцию деления нацело, найти количество полных метров в нем (1 метр = 100 см).',
    formulaDescription: 'meters = L // 100',
    sampleCode: `# 1\nL = int(input("Введите расстояние в см: "))\nmeters = L // 100\nprint("Полных метров:", meters)`,
    testCases: [
      {
        id: '2_1_t1',
        description: 'L = 450 см',
        inputs: [450],
        expectedValueDescription: '4',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(4);
          return {
            passed,
            details: passed ? 'Найдено значение 4' : 'Ожидалось число 4',
            expected: '4',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_1_t2',
        description: 'L = 99 см',
        inputs: [99],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Найдено значение 0' : 'Ожидалось число 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_1_t3',
        description: 'L = 1250 см',
        inputs: [1250],
        expectedValueDescription: '12',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(12);
          return {
            passed,
            details: passed ? 'Найдено значение 12' : 'Ожидалось число 12',
            expected: '12',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '2',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Масса в тоннах (M // 1000)',
    condition: 'Дана масса M в килограммах. Используя операцию деления нацело, найти количество полных тонн в ней (1 тонна = 1000 кг).',
    formulaDescription: 'tons = M // 1000',
    sampleCode: `# 2\nM = int(input("Масса в кг: "))\ntons = M // 1000\nprint("Полных тонн:", tons)`,
    testCases: [
      {
        id: '2_2_t1',
        description: 'M = 5400 кг',
        inputs: [5400],
        expectedValueDescription: '5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(5);
          return {
            passed,
            details: passed ? 'Найдено 5 тонн' : 'Ожидалось число 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_2_t2',
        description: 'M = 850 кг',
        inputs: [850],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Найдено 0 тонн' : 'Ожидалось число 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '3',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Размер файла в килобайтах (Bytes // 1024)',
    condition: 'Дан размер файла в байтах. Используя операцию деления нацело, найти количество полных килобайтов, которые занимает этот файл (1 Кбайт = 1024 байта).',
    formulaDescription: 'kb = bytes // 1024',
    sampleCode: `# 3\nb = int(input("Байт: "))\nkb = b // 1024\nprint("Килобайт:", kb)`,
    testCases: [
      {
        id: '2_3_t1',
        description: 'Размер = 2050 байт',
        inputs: [2050],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Найдено 2 КБ' : 'Ожидалось число 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_3_t2',
        description: 'Размер = 1024 байт',
        inputs: [1024],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Найдено 1 КБ' : 'Ожидалось число 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '4',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Цифры двузначного числа (десятки и единицы)',
    condition: 'Дано двузначное число. Вывести сначала его левую цифру (десятки), а затем — правую цифру (единицы). Для нахождения десятков использовать деление нацело (// 10), для нахождения единиц — остаток от деления (% 10).',
    formulaDescription: 'tens = n // 10, units = n % 10',
    sampleCode: `# 4\nn = int(input("Двузначное число: "))\ntens = n // 10\nunits = n % 10\nprint("Десятки:", tens, "Единицы:", units)`,
    testCases: [
      {
        id: '2_4_t1',
        description: 'Число 47 -> десятки 4, единицы 7',
        inputs: [47],
        expectedValueDescription: '4 и 7',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has4 = nums.includes(4);
          const has7 = nums.includes(7);
          const passed = has4 && has7;
          return {
            passed,
            details: passed ? 'Найдены цифры 4 и 7' : 'Ожидались цифры 4 и 7',
            expected: '4 и 7',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_4_t2',
        description: 'Число 90 -> десятки 9, единицы 0',
        inputs: [90],
        expectedValueDescription: '9 и 0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has9 = nums.includes(9);
          const has0 = nums.includes(0);
          const passed = has9 && has0;
          return {
            passed,
            details: passed ? 'Найдены цифры 9 и 0' : 'Ожидались цифры 9 и 0',
            expected: '9 и 0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '5',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Сумма и произведение цифр двузначного числа',
    condition: 'Дано двузначное число. Найти сумму и произведение его цифр.',
    formulaDescription: 's = (n // 10) + (n % 10), p = (n // 10) * (n % 10)',
    sampleCode: `# 5\nn = int(input("Двузначное число: "))\na = n // 10\nb = n % 10\nprint("Сумма:", a + b)\nprint("Произведение:", a * b)`,
    testCases: [
      {
        id: '2_5_t1',
        description: 'Число 35 -> сумма 8, произведение 15',
        inputs: [35],
        expectedValueDescription: 'сумма: 8, произведение: 15',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has8 = nums.includes(8);
          const has15 = nums.includes(15);
          const passed = has8 && has15;
          return {
            passed,
            details: passed ? 'Найдены сумма 8 и произведение 15' : 'Ожидались 8 и 15',
            expected: '8 и 15',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_5_t2',
        description: 'Число 20 -> сумма 2, произведение 0',
        inputs: [20],
        expectedValueDescription: 'сумма: 2, произведение: 0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has2 = nums.includes(2);
          const has0 = nums.includes(0);
          const passed = has2 && has0;
          return {
            passed,
            details: passed ? 'Найдены сумма 2 и произведение 0' : 'Ожидались 2 и 0',
            expected: '2 и 0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '6',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Перестановка цифр двузначного числа',
    condition: 'Дано двузначное число. Получить число, образованное при перестановке цифр исходного числа (например, из 72 получить 27).',
    formulaDescription: 'reversed = (n % 10) * 10 + (n // 10)',
    sampleCode: `# 6\nn = int(input("Двузначное число: "))\na = n // 10\nb = n % 10\nres = b * 10 + a\nprint("Результат:", res)`,
    testCases: [
      {
        id: '2_6_t1',
        description: 'Число 72 -> 27',
        inputs: [72],
        expectedValueDescription: '27',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(27);
          return {
            passed,
            details: passed ? 'Найдено 27' : 'Ожидалось число 27',
            expected: '27',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_6_t2',
        description: 'Число 40 -> 4 или 04',
        inputs: [40],
        expectedValueDescription: '4 (или 04)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(4) || stdout.includes('04');
          return {
            passed,
            details: passed ? 'Найдено число 4' : 'Ожидалось число 4',
            expected: '4',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '7',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Сотни в трехзначном числе',
    condition: 'Дано трехзначное число. Используя одну операцию деления нацело, вывести его первую цифру (сотни).',
    formulaDescription: 'hundreds = n // 100',
    sampleCode: `# 7\nn = int(input("Трехзначное число: "))\nh = n // 100\nprint("Сотни:", h)`,
    testCases: [
      {
        id: '2_7_t1',
        description: 'Число 853 -> 8',
        inputs: [853],
        expectedValueDescription: '8',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(8);
          return {
            passed,
            details: passed ? 'Найдено число 8' : 'Ожидалось число 8',
            expected: '8',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_7_t2',
        description: 'Число 100 -> 1',
        inputs: [100],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Найдено число 1' : 'Ожидалось число 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '8',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Сумма и произведение цифр трехзначного числа',
    condition: 'Дано трехзначное число. Найти сумму и произведение всех трех его цифр.',
    formulaDescription: 'c1 = n // 100, c2 = (n // 10) % 10, c3 = n % 10',
    sampleCode: `# 8\nn = int(input("Трехзначное число: "))\na = n // 100\nb = (n // 10) % 10\nc = n % 10\nprint("Сумма:", a + b + c)\nprint("Произведение:", a * b * c)`,
    testCases: [
      {
        id: '2_8_t1',
        description: 'Число 123 -> сумма 6, произведение 6',
        inputs: [123],
        expectedValueDescription: 'сумма: 6, произведение: 6',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has6 = nums.filter((x) => x === 6).length >= 1;
          return {
            passed: has6,
            details: has6 ? 'Сумма и произведение 6 найдены' : 'Ожидалось число 6',
            expected: '6',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_8_t2',
        description: 'Число 234 -> сумма 9, произведение 24',
        inputs: [234],
        expectedValueDescription: 'сумма: 9, произведение: 24',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has9 = nums.includes(9);
          const has24 = nums.includes(24);
          const passed = has9 && has24;
          return {
            passed,
            details: passed ? 'Сумма 9 и произведение 24 найдены' : 'Ожидались 9 и 24',
            expected: '9 и 24',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '9',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Переворот трехзначного числа',
    condition: 'Дано трехзначное число. Вывести число, полученное при прочтении исходного числа справа налево (например, из 123 получить 321).',
    formulaDescription: 'res = (n % 10)*100 + ((n // 10) % 10)*10 + (n // 100)',
    sampleCode: `# 9\nn = int(input("Трехзначное число: "))\na = n // 100\nb = (n // 10) % 10\nc = n % 10\nres = c * 100 + b * 10 + a\nprint("Перевернутое:", res)`,
    testCases: [
      {
        id: '2_9_t1',
        description: 'Число 123 -> 321',
        inputs: [123],
        expectedValueDescription: '321',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(321);
          return {
            passed,
            details: passed ? 'Найдено 321' : 'Ожидалось число 321',
            expected: '321',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_9_t2',
        description: 'Число 540 -> 45 (или 045)',
        inputs: [540],
        expectedValueDescription: '45 (или 045)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(45) || stdout.includes('045');
          return {
            passed,
            details: passed ? 'Найдено число 45' : 'Ожидалось число 45',
            expected: '45',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '10',
    section: 'I. Целочисленная арифметика и разряды',
    title: 'Смещение цифр трехзначного числа (первая в конец)',
    condition: 'Дано трехзначное число. В нем зачеркнули первую слева цифру и приписали ее справа. Найти полученное число (например, из 123 получается 231).',
    formulaDescription: 'res = (n % 100) * 10 + (n // 100)',
    sampleCode: `# 10\nn = int(input("Трехзначное число: "))\na = n // 100\nrem = n % 100\nres = rem * 10 + a\nprint("Результат:", res)`,
    testCases: [
      {
        id: '2_10_t1',
        description: 'Число 123 -> 231',
        inputs: [123],
        expectedValueDescription: '231',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(231);
          return {
            passed,
            details: passed ? 'Найдено 231' : 'Ожидалось число 231',
            expected: '231',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_10_t2',
        description: 'Число 456 -> 564',
        inputs: [456],
        expectedValueDescription: '564',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(564);
          return {
            passed,
            details: passed ? 'Найдено 564' : 'Ожидалось число 564',
            expected: '564',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },

  // --- БЛОК 2: Время и календарь (11 - 15) ---
  {
    id: '11',
    section: 'II. Время и календарь',
    title: 'Время — полные часы с начала суток',
    condition: 'С начала суток прошло N секунд (N — целое). Найти количество полных часов, прошедших с начала суток.',
    formulaDescription: 'hours = N // 3600',
    sampleCode: `# 11\nN = int(input("Секунд: "))\nhours = N // 3600\nprint("Полных часов:", hours)`,
    testCases: [
      {
        id: '2_11_t1',
        description: 'N = 7300 сек (2 часа 1 минута 40 сек)',
        inputs: [7300],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Найдено 2 часа' : 'Ожидалось число 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_11_t2',
        description: 'N = 3600 сек (ровно 1 час)',
        inputs: [3600],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Найдено 1 час' : 'Ожидалось число 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '12',
    section: 'II. Время и календарь',
    title: 'Время — минуты и секунды с начала часа',
    condition: 'С начала суток прошло N секунд (N — целое). Найти количество полных минут, прошедших с начала последнего часа, и количество секунд, прошедших с начала последней минуты.',
    formulaDescription: 'minutes = (N % 3600) // 60, seconds = N % 60',
    sampleCode: `# 12\nN = int(input("Секунд: "))\nminutes = (N % 3600) // 60\nseconds = N % 60\nprint("Минут с начала часа:", minutes)\nprint("Секунд с начала минуты:", seconds)`,
    testCases: [
      {
        id: '2_12_t1',
        description: 'N = 3665 сек (1 час 1 мин 5 сек)',
        inputs: [3665],
        expectedValueDescription: 'минуты: 1, секунды: 5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has1 = nums.includes(1);
          const has5 = nums.includes(5);
          const passed = has1 && has5;
          return {
            passed,
            details: passed ? 'Найдены 1 мин и 5 сек' : 'Ожидались числа 1 и 5',
            expected: '1 и 5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_12_t2',
        description: 'N = 7200 сек (ровно 2 часа)',
        inputs: [7200],
        expectedValueDescription: 'минуты: 0, секунды: 0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has0 = nums.includes(0);
          return {
            passed: has0,
            details: has0 ? 'Значение 0 найдено' : 'Ожидались 0 минут и 0 секунд',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '13',
    section: 'II. Время и календарь',
    title: 'Форматирование времени (ЧЧ:ММ:СС)',
    condition: 'С начала суток прошло N секунд (N — целое). Вывести текущее время в формате электронных часов: ЧЧ:ММ:СС (или H:M:S), где часы, минуты и секунды вычисляются с начала суток.',
    formulaDescription: 'h = (N // 3600) % 24, m = (N % 3600) // 60, s = N % 60',
    sampleCode: `# 13\nN = int(input("Секунд: "))\nh = (N // 3600) % 24\nm = (N % 3600) // 60\ns = N % 60\nprint(f"{h:02d}:{m:02d}:{s:02d}")`,
    testCases: [
      {
        id: '2_13_t1',
        description: 'N = 3665 сек -> 01:01:05 (или 1 1 5)',
        inputs: [3665],
        expectedValueDescription: '01:01:05 или 1:1:5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has1 = nums.includes(1);
          const has5 = nums.includes(5);
          const hasTimeStr = /0?1:0?1:0?5/.test(stdout);
          const passed = (has1 && has5) || hasTimeStr;
          return {
            passed,
            details: passed ? 'Время 01:01:05 выведено верно' : 'Ожидалось время 01:01:05',
            expected: '01:01:05',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_13_t2',
        description: 'N = 0 сек -> 00:00:00 (или 0:0:0)',
        inputs: [0],
        expectedValueDescription: '00:00:00 или 0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0) || /00:00:00/.test(stdout);
          return {
            passed,
            details: passed ? 'Найдено 00:00:00' : 'Ожидалось 00:00:00',
            expected: '00:00:00',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '14',
    section: 'II. Время и календарь',
    title: 'День недели для K-го дня (1 января — понедельник)',
    condition: 'Дни недели пронумерованы от 1 до 7 (1 — понедельник, 2 — вторник, ..., 7 — воскресенье) или от 0 до 6 (0 — воскресенье/понедельник). Дано целое число K (1 <= K <= 365). Определить номер дня недели для K-го дня года, если 1 января было понедельником.',
    formulaDescription: 'day = (K - 1) % 7 + 1 (при 1..7) или K % 7',
    sampleCode: `# 14\nK = int(input("День года K: "))\nday = (K - 1) % 7 + 1\nprint("День недели:", day)`,
    testCases: [
      {
        id: '2_14_t1',
        description: 'K = 1 (1 января) -> 1 (понедельник)',
        inputs: [1],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1) || /понедельник/i.test(stdout);
          return {
            passed,
            details: passed ? 'День 1 (понедельник) найден' : 'Ожидался понедельник (1)',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_14_t2',
        description: 'K = 8 (прошла неделя) -> 1 (понедельник)',
        inputs: [8],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1) || /понедельник/i.test(stdout);
          return {
            passed,
            details: passed ? 'День 1 (понедельник) найден' : 'Ожидался понедельник (1)',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_14_t3',
        description: 'K = 10 -> 3 (среда)',
        inputs: [10],
        expectedValueDescription: '3 (среда)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3) || /сред/i.test(stdout);
          return {
            passed,
            details: passed ? 'День 3 (среда) найден' : 'Ожидалась среда (3)',
            expected: '3',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '15',
    section: 'II. Время и календарь',
    title: 'День недели для K-го дня со смещением D',
    condition: 'Дни недели пронумерованы: 1 — понедельник, 2 — вторник, ..., 7 — воскресенье (или 0..6). Дано целое число K (1 <= K <= 365) и число D (номер дня недели для 1 января). Определить номер дня недели для K-го дня года.',
    formulaDescription: 'day = (D + K - 2) % 7 + 1',
    sampleCode: `# 15\nK = int(input("День года K: "))\nD = int(input("День недели 1 января D: "))\nday = (D + K - 2) % 7 + 1\nprint("День недели:", day)`,
    testCases: [
      {
        id: '2_15_t1',
        description: 'K = 8, 1 января — четверг (D = 4) -> 4 (четверг)',
        inputs: [8, 4],
        expectedValueDescription: '4 (четверг)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(4) || /четверг/i.test(stdout);
          return {
            passed,
            details: passed ? 'День 4 (четверг) найден' : 'Ожидался четверг (4)',
            expected: '4',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_15_t2',
        description: 'K = 2, 1 января — вторник (D = 2) -> 3 (среда)',
        inputs: [2, 2],
        expectedValueDescription: '3 (среда)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3) || /сред/i.test(stdout);
          return {
            passed,
            details: passed ? 'День 3 (среда) найден' : 'Ожидалась среда (3)',
            expected: '3',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },

  // --- БЛОК 3: Условный оператор и координаты (16 - 18) ---
  {
    id: '16',
    section: 'III. Условный оператор и координатная плоскость',
    title: 'Модификация числа по знаку',
    condition: 'Дано целое число. Если оно является положительным, прибавить к нему 1; если отрицательным, вычесть из него 2; если нулевым, заменить его на 10. Вывести полученное число.',
    formulaDescription: 'if n > 0: n+1; elif n < 0: n-2; else: 10',
    sampleCode: `# 16\nn = int(input("Число: "))\nif n > 0:\n    res = n + 1\nelif n < 0:\n    res = n - 2\nelse:\n    res = 10\nprint("Результат:", res)`,
    testCases: [
      {
        id: '2_16_t1',
        description: 'Положительное число: 5 -> 6',
        inputs: [5],
        expectedValueDescription: '6',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(6);
          return {
            passed,
            details: passed ? 'Найдено 6 (5 + 1)' : 'Ожидалось число 6',
            expected: '6',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_16_t2',
        description: 'Отрицательное число: -3 -> -5',
        inputs: [-3],
        expectedValueDescription: '-5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(-5);
          return {
            passed,
            details: passed ? 'Найдено -5 (-3 - 2)' : 'Ожидалось число -5',
            expected: '-5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_16_t3',
        description: 'Ноль: 0 -> 10',
        inputs: [0],
        expectedValueDescription: '10',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(10);
          return {
            passed,
            details: passed ? 'Найдено 10' : 'Ожидалось число 10',
            expected: '10',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '17',
    section: 'III. Условный оператор и координатная плоскость',
    title: 'Минимум и максимум из трех чисел (без min/max)',
    condition: 'Даны три числа. Найти и вывести наименьшее и наибольшее из них (не используя встроенные функции min() и max()).',
    formulaDescription: 'Использовать сравнения if / elif',
    astRules: [
      {
        id: 'forbid_min_max_2_17',
        title: 'Запрет min() и max()',
        description: 'В задании требуется использовать условный оператор, а не функции min() или max()',
        checkType: 'forbid_min_max',
      },
    ],
    sampleCode: `# 17\na = float(input())\nb = float(input())\nc = float(input())\n# Поиск минимума\nmn = a\nif b < mn:\n    mn = b\nif c < mn:\n    mn = c\n# Поиск максимума\nmx = a\nif b > mx:\n    mx = b\nif c > mx:\n    mx = c\nprint("Min:", mn, "Max:", mx)`,
    testCases: [
      {
        id: '2_17_t1',
        description: 'Числа 3, 7, 2 -> min: 2, max: 7',
        inputs: [3, 7, 2],
        expectedValueDescription: 'min: 2, max: 7',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has2 = nums.includes(2);
          const has7 = nums.includes(7);
          const passed = has2 && has7;
          return {
            passed,
            details: passed ? 'Найдены min 2 и max 7' : 'Ожидались числа 2 и 7',
            expected: '2 и 7',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_17_t2',
        description: 'Числа 10, -5, 4 -> min: -5, max: 10',
        inputs: [10, -5, 4],
        expectedValueDescription: 'min: -5, max: 10',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const hasNeg5 = nums.includes(-5);
          const has10 = nums.includes(10);
          const passed = hasNeg5 && has10;
          return {
            passed,
            details: passed ? 'Найдены min -5 и max 10' : 'Ожидались числа -5 и 10',
            expected: '-5 и 10',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '18',
    section: 'III. Условный оператор и координатная плоскость',
    title: 'Координатная четверть точки (x, y)',
    condition: 'Даны ненулевые координаты точки (x, y). Определить номер координатной четверти (1, 2, 3 или 4), в которой находится данная точка.',
    formulaDescription: 'x>0,y>0: 1; x<0,y>0: 2; x<0,y<0: 3; x>0,y<0: 4',
    sampleCode: `# 18\nx = float(input("x: "))\ny = float(input("y: "))\nif x > 0 and y > 0:\n    print(1)\nelif x < 0 and y > 0:\n    print(2)\nelif x < 0 and y < 0:\n    print(3)\nelse:\n    print(4)`,
    testCases: [
      {
        id: '2_18_t1',
        description: 'Точка (2, 3) -> 1 четверть',
        inputs: [2, 3],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Найдена 1 четверть' : 'Ожидалась 1 четверть',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_18_t2',
        description: 'Точка (-4, 5) -> 2 четверть',
        inputs: [-4, 5],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Найдена 2 четверть' : 'Ожидалась 2 четверть',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_18_t3',
        description: 'Точка (-2, -7) -> 3 четверть',
        inputs: [-2, -7],
        expectedValueDescription: '3',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3);
          return {
            passed,
            details: passed ? 'Найдена 3 четверть' : 'Ожидалась 3 четверть',
            expected: '3',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_18_t4',
        description: 'Точка (5, -1) -> 4 четверть',
        inputs: [5, -1],
        expectedValueDescription: '4',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(4);
          return {
            passed,
            details: passed ? 'Найдена 4 четверть' : 'Ожидалась 4 четверть',
            expected: '4',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },

  // --- БЛОК 4: Оператор выбора (Case / Ветвления) (19 - 25) ---
  {
    id: '19',
    section: 'IV. Оператор выбора (Case / Ветвления)',
    title: 'Название дня недели по номеру (1-7)',
    condition: 'Дано целое число в диапазоне от 1 до 7. Вывести название соответствующего дня недели («понедельник», «вторник», «среда», «четверг», «пятница», «суббота», «воскресенье»).',
    formulaDescription: '1 -> понедельник, 2 -> вторник, ..., 7 -> воскресенье',
    sampleCode: `# 19\nd = int(input("Номер дня: "))\ndays = {1: "понедельник", 2: "вторник", 3: "среда", 4: "четверг", 5: "пятница", 6: "суббота", 7: "воскресенье"}\nprint(days.get(d, "ошибка"))`,
    testCases: [
      {
        id: '2_19_t1',
        description: 'День 1 -> понедельник',
        inputs: [1],
        expectedValueDescription: 'понедельник',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('понедельник');
          return {
            passed,
            details: passed ? 'Выведено «понедельник»' : 'Ожидалось слово «понедельник»',
            expected: 'понедельник',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_19_t2',
        description: 'День 3 -> среда',
        inputs: [3],
        expectedValueDescription: 'среда',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('сред');
          return {
            passed,
            details: passed ? 'Выведено «среда»' : 'Ожидалось слово «среда»',
            expected: 'среда',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_19_t3',
        description: 'День 7 -> воскресенье',
        inputs: [7],
        expectedValueDescription: 'воскресенье',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('воскресень');
          return {
            passed,
            details: passed ? 'Выведено «воскресенье»' : 'Ожидалось слово «воскресенье»',
            expected: 'воскресенье',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '20',
    section: 'IV. Оператор выбора (Case / Ветвления)',
    title: 'Описание школьной оценки (1-5)',
    condition: 'Дано целое число K. Вывести строку-описание оценки, соответствующей числу K (1 — «плохо», 2 — «неудовлетворительно», 3 — «удовлетворительно», 4 — «хорошо», 5 — «отлично»). Если K не лежит в диапазоне 1–5, вывести «ошибка».',
    formulaDescription: '1: плохо, 2: неудовлетворительно, 3: удовлетворительно, 4: хорошо, 5: отлично, иначе: ошибка',
    sampleCode: `# 20\nk = int(input("Оценка: "))\ngrades = {1: "плохо", 2: "неудовлетворительно", 3: "удовлетворительно", 4: "хорошо", 5: "отлично"}\nprint(grades.get(k, "ошибка"))`,
    testCases: [
      {
        id: '2_20_t1',
        description: 'K = 4 -> хорошо',
        inputs: [4],
        expectedValueDescription: 'хорошо',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('хорош');
          return {
            passed,
            details: passed ? 'Выведено «хорошо»' : 'Ожидалось слово «хорошо»',
            expected: 'хорошо',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_20_t2',
        description: 'K = 2 -> неудовлетворительно',
        inputs: [2],
        expectedValueDescription: 'неудовлетворительно',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('неудовлетворит');
          return {
            passed,
            details: passed ? 'Выведено «неудовлетворительно»' : 'Ожидалось «неудовлетворительно»',
            expected: 'неудовлетворительно',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_20_t3',
        description: 'K = 6 -> ошибка',
        inputs: [6],
        expectedValueDescription: 'ошибка',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('ошибк') || s.includes('error');
          return {
            passed,
            details: passed ? 'Выведено сообщение об ошибке' : 'Ожидалось «ошибка»',
            expected: 'ошибка',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '21',
    section: 'IV. Оператор выбора (Case / Ветвления)',
    title: 'Перевод единиц длины в метры',
    condition: 'Единицы длины пронумерованы: 1 — дециметр (0.1 м), 2 — километр (1000 м), 3 — метр (1 м), 4 — миллиметр (0.001 м), 5 — сантиметр (0.01 м). Даны номер единицы длины (целое число 1–5) и длина отрезка L (число). Найти длину отрезка в метрах.',
    formulaDescription: '1: L*0.1, 2: L*1000, 3: L*1, 4: L*0.001, 5: L*0.01',
    sampleCode: `# 21\nunit = int(input("Номер единицы (1-5): "))\nL = float(input("Длина L: "))\nfactors = {1: 0.1, 2: 1000.0, 3: 1.0, 4: 0.001, 5: 0.01}\nres = L * factors.get(unit, 1.0)\nprint("В метрах:", res)`,
    testCases: [
      {
        id: '2_21_t1',
        description: '50 дециметров (unit = 1, L = 50) -> 5 метров',
        inputs: [1, 50],
        expectedValueDescription: '5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(5);
          return {
            passed,
            details: passed ? 'Найдено значение 5 м' : 'Ожидалось число 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_21_t2',
        description: '3.5 километра (unit = 2, L = 3.5) -> 3500 метров',
        inputs: [2, 3.5],
        expectedValueDescription: '3500',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3500);
          return {
            passed,
            details: passed ? 'Найдено значение 3500 м' : 'Ожидалось число 3500',
            expected: '3500',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_21_t3',
        description: '200 сантиметров (unit = 5, L = 200) -> 2 метра',
        inputs: [5, 200],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Найдено значение 2 м' : 'Ожидалось число 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '22',
    section: 'IV. Оператор выбора (Case / Ветвления)',
    title: 'Робот и команды поворота (С, З, Ю, В)',
    condition: 'Робот может перемещаться в четырех направлениях («С» — север, «З» — запад, «Ю» — юг, «В» — восток) и принимать команды: 0 — продолжать движение, 1 — поворот налево, -1 — поворот направо. Дан символ C (исходное направление) и число N (команда). Вывести направление робота после выполнения команды.',
    formulaDescription: 'Направления по кругу: С -> В -> Ю -> З -> С (направо +1, налево -1 или поворот)',
    sampleCode: `# 22\nC = input("Исходное направление (С/З/Ю/В): ").strip().upper()\nN = int(input("Команда (0/1/-1): "))\n# 0 - прямо, 1 - налево, -1 - направо\ndirs = ['С', 'В', 'Ю', 'З']\nidx = dirs.index(C)\nif N == 1:\n    idx = (idx - 1) % 4  # налево (против часовой: С -> З)\nelif N == -1:\n    idx = (idx + 1) % 4  # направо (по часовой: С -> В)\nprint("Конечное направление:", dirs[idx])`,
    testCases: [
      {
        id: '2_22_t1',
        description: 'С (Север) + команда 1 (налево) -> З (Запад)',
        inputs: ['С', 1],
        expectedValueDescription: 'З (или Запад)',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('запад') || /\bз\b/i.test(s) || s.endsWith('з');
          return {
            passed,
            details: passed ? 'Направление Запад (З) определено верно' : 'Ожидалось направление «З» (Запад)',
            expected: 'З (Запад)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_22_t2',
        description: 'В (Восток) + команда -1 (направо) -> Ю (Юг)',
        inputs: ['В', -1],
        expectedValueDescription: 'Ю (или Юг)',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('юг') || /\bю\b/i.test(s) || s.endsWith('ю');
          return {
            passed,
            details: passed ? 'Направление Юг (Ю) определено верно' : 'Ожидалось направление «Ю» (Юг)',
            expected: 'Ю (Юг)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_22_t3',
        description: 'Ю (Юг) + команда 0 (продолжать движение) -> Ю',
        inputs: ['Ю', 0],
        expectedValueDescription: 'Ю',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('юг') || /\bю\b/i.test(s) || s.endsWith('ю');
          return {
            passed,
            details: passed ? 'Направление Юг (Ю) сохранено верно' : 'Ожидалось направление «Ю»',
            expected: 'Ю (Юг)',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '23',
    section: 'IV. Оператор выбора (Case / Ветвления)',
    title: 'Локатор с двумя командами поворота',
    condition: 'Локатор ориентирован на одну из сторон света («С», «З», «Ю», «В»). Ему последовательно подаются две числовые команды: 1 — поворот налево, -1 — поворот направо, 2 — поворот на 180°. Дан символ C (исходная ориентация) и числа N1, N2 (команды). Вывести конечное направление локатора.',
    formulaDescription: 'Поворот налево: -1 по часовой, направо: +1 по часовой, 180°: +2',
    sampleCode: `# 23\nC = input("Ориентация локатора (С/З/Ю/В): ").strip().upper()\nN1 = int(input("Команда 1: "))\nN2 = int(input("Команда 2: "))\ndirs = ['С', 'В', 'Ю', 'З']\nidx = dirs.index(C)\nfor cmd in (N1, N2):\n    if cmd == 1:\n        idx = (idx - 1) % 4\n    elif cmd == -1:\n        idx = (idx + 1) % 4\n    elif cmd == 2:\n        idx = (idx + 2) % 4\nprint("Конечная ориентация:", dirs[idx])`,
    testCases: [
      {
        id: '2_23_t1',
        description: 'Исходное С, команды 1 (налево -> З) и 2 (180° -> В) -> В (Восток)',
        inputs: ['С', 1, 2],
        expectedValueDescription: 'В (Восток)',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('восток') || /\bв\b/i.test(s) || s.endsWith('в');
          return {
            passed,
            details: passed ? 'Направление Восток (В) определено верно' : 'Ожидалось направление «В» (Восток)',
            expected: 'В (Восток)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_23_t2',
        description: 'Исходное В, команды -1 (направо -> Ю) и -1 (направо -> З) -> З (Запад)',
        inputs: ['В', -1, -1],
        expectedValueDescription: 'З (Запад)',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('запад') || /\bз\b/i.test(s) || s.endsWith('з');
          return {
            passed,
            details: passed ? 'Направление Запад (З) определено верно' : 'Ожидалось направление «З» (Запад)',
            expected: 'З (Запад)',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '24',
    section: 'IV. Оператор выбора (Case / Ветвления)',
    title: 'Достоинство и масть карты',
    condition: 'Мастям игральных карт присвоены номера: 1 — пики, 2 — трефы, 3 — бубны, 4 — червы. Достоинствам карт присвоены номера: 6 — шестерка, 7 — семерка, ..., 10 — десятка, 11 — валет, 12 — дама, 13 — король, 14 — туз. Даны два целых числа: достоинство N (6–14) и масть M (1–4). Вывести полное название карты (например, «шестерка пик», «дама червей», «туз бубен»).',
    formulaDescription: 'Сопоставление списков достоинств и мастей',
    sampleCode: `# 24\nN = int(input("Достоинство (6-14): "))\nM = int(input("Масть (1-4): "))\nnames = {\n    6: "шестерка", 7: "семерка", 8: "восьмерка", 9: "девятка", 10: "десятка",\n    11: "валет", 12: "дама", 13: "король", 14: "туз"\n}\nsuits = {1: "пик", 2: "треф", 3: "бубен", 4: "червей"}\nprint(f"{names.get(N, '')} {suits.get(M, '')}")`,
    testCases: [
      {
        id: '2_24_t1',
        description: 'Достоинство 12, масть 4 -> дама червей',
        inputs: [12, 4],
        expectedValueDescription: 'дама червей (или черви)',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const hasDame = s.includes('дам');
          const hasHearts = s.includes('черв');
          const passed = hasDame && hasHearts;
          return {
            passed,
            details: passed ? 'Найдено: дама червей' : 'Ожидалось название «дама червей»',
            expected: 'дама червей',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_24_t2',
        description: 'Достоинство 6, масть 1 -> шестерка пик',
        inputs: [6, 1],
        expectedValueDescription: 'шестерка пик',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const hasSix = s.includes('шестерк');
          const hasSpades = s.includes('пик');
          const passed = hasSix && hasSpades;
          return {
            passed,
            details: passed ? 'Найдено: шестерка пик' : 'Ожидалось название «шестерка пик»',
            expected: 'шестерка пик',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_24_t3',
        description: 'Достоинство 14, масть 3 -> туз бубен',
        inputs: [14, 3],
        expectedValueDescription: 'туз бубен (или буби)',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const hasAce = s.includes('туз');
          const hasDiamonds = s.includes('буб');
          const passed = hasAce && hasDiamonds;
          return {
            passed,
            details: passed ? 'Найдено: туз бубен' : 'Ожидалось название «туз бубен»',
            expected: 'туз бубен',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '25',
    section: 'IV. Оператор выбора (Case / Ветвления)',
    title: 'Согласование возраста от 20 до 69 («год / года / лет»)',
    condition: 'Дано целое число в диапазоне от 20 до 69, определяющее возраст (в годах). Вывести число с правильным грамматическим окончанием: «год», «года» или «лет» (например, «20 лет», «21 год», «22 года», «25 лет»).',
    formulaDescription: 'Последняя цифра 1 -> «год»; 2, 3, 4 -> «года»; 0, 5-9 -> «лет»',
    sampleCode: `# 25\nage = int(input("Возраст (20-69): "))\nlast = age % 10\nif last == 1:\n    word = "год"\nelif last in (2, 3, 4):\n    word = "года"\nelse:\n    word = "лет"\nprint(f"{age} {word}")`,
    testCases: [
      {
        id: '2_25_t1',
        description: 'Возраст 21 -> 21 год',
        inputs: [21],
        expectedValueDescription: '21 год',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('21') && s.includes('год') && !s.includes('года');
          return {
            passed,
            details: passed ? 'Выведено «21 год»' : 'Ожидалось «21 год»',
            expected: '21 год',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_25_t2',
        description: 'Возраст 32 -> 32 года',
        inputs: [32],
        expectedValueDescription: '32 года',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('32') && s.includes('года');
          return {
            passed,
            details: passed ? 'Выведено «32 года»' : 'Ожидалось «32 года»',
            expected: '32 года',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_25_t3',
        description: 'Возраст 45 -> 45 лет',
        inputs: [45],
        expectedValueDescription: '45 лет',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('45') && s.includes('лет');
          return {
            passed,
            details: passed ? 'Выведено «45 лет»' : 'Ожидалось «45 лет»',
            expected: '45 лет',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_25_t4',
        description: 'Возраст 50 -> 50 лет',
        inputs: [50],
        expectedValueDescription: '50 лет',
        validator: (stdout) => {
          const s = normalizeOutput(stdout);
          const passed = s.includes('50') && s.includes('лет');
          return {
            passed,
            details: passed ? 'Выведено «50 лет»' : 'Ожидалось «50 лет»',
            expected: '50 лет',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
];
