import { LabTask } from '../types';
import { extractNumbers } from './lab1Tasks';

// Helper to normalize text output
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/ё/g, 'е').replace(/[\t\r\n]+/g, ' ').trim();
}

// Helper to check boolean output (True / False / 1 / 0 / Да / Нет)
function checkBooleanOutput(stdout: string, expected: boolean) {
  const norm = normalizeText(stdout);
  const words = norm.split(/[^a-zа-я0-9]+/);

  const hasTrue = words.includes('true') || words.includes('истина') || words.includes('да');
  const hasFalse = words.includes('false') || words.includes('ложь') || words.includes('нет');

  let passed = false;
  if (expected) {
    passed = (hasTrue && !hasFalse) || (norm.includes('true') && !norm.includes('false'));
    if (!passed) {
      const nums = extractNumbers(stdout);
      if (nums.includes(1) && !nums.includes(0)) passed = true;
    }
  } else {
    passed = (hasFalse && !hasTrue) || (norm.includes('false') && !norm.includes('true'));
    if (!passed) {
      const nums = extractNumbers(stdout);
      if (nums.includes(0) && !nums.includes(1)) passed = true;
    }
  }

  return {
    passed,
    details: passed
      ? `Значение ${expected ? 'True' : 'False'} выведено верно`
      : `Ожидалось ${expected ? 'True' : 'False'}, получено: "${stdout.trim()}"`,
    expected: expected ? 'True' : 'False',
    actual: stdout.trim() || 'нет вывода',
  };
}

export const LAB2_TASKS: LabTask[] = [
  // --- БЛОК 1: Задачи для самостоятельного выполнения. Числа, целые и вещественные (1 - 13) ---
  {
    id: '1',
    section: 'I. Числа, целые и вещественные',
    title: 'Расстояние в метрах (L // 100)',
    condition: 'Дано расстояние L в сантиметрах. Используя операцию деления нацело, найти количество полных метров в нем (1 метр = 100 см).',
    formulaDescription: 'meters = L // 100',
    sampleCode: `# 1\nL = int(input("Введите расстояние в см: "))\nmeters = L // 100\nprint("Полных метров:", meters)`,
    testCases: [
      {
        id: '2_1_t1',
        description: 'L = 450 см -> 4 м',
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
        description: 'L = 99 см -> 0 м',
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
        description: 'L = 1250 см -> 12 м',
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
    section: 'I. Числа, целые и вещественные',
    title: 'Размер файла в килобайтах (B // 1024)',
    condition: 'Дан размер файла в байтах. Используя операцию деления нацело, найти количество полных килобайтов, которые занимает данный файл (1 килобайт = 1024 байта).',
    formulaDescription: 'kb = B // 1024',
    sampleCode: `# 2\nB = int(input("Размер в байтах: "))\nkb = B // 1024\nprint("Полных килобайт:", kb)`,
    testCases: [
      {
        id: '2_2_t1',
        description: 'B = 2048 байт -> 2 Кб',
        inputs: [2048],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Найдено значение 2' : 'Ожидалось число 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_2_t2',
        description: 'B = 1000 байт -> 0 Кб',
        inputs: [1000],
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
        id: '2_2_t3',
        description: 'B = 5500 байт -> 5 Кб',
        inputs: [5500],
        expectedValueDescription: '5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(5);
          return {
            passed,
            details: passed ? 'Найдено значение 5' : 'Ожидалось число 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '3',
    section: 'I. Числа, целые и вещественные',
    title: 'Часы и минуты по числу минут n с начала суток',
    condition: 'Дано число n (вводится пользователем). С начала суток прошло n минут. Определите, сколько часов и минут будут показывать электронные часы в этот момент. Программа должна вывести два числа: количество часов (от 0 до 23) и количество минут (от 0 до 59). Учтите, что число n может быть больше, чем количество минут в сутках.',
    formulaDescription: 'h = (n // 60) % 24, m = n % 60',
    sampleCode: `# 3\nn = int(input("Минут: "))\nh = (n // 60) % 24\nm = n % 60\nprint(h, m)`,
    testCases: [
      {
        id: '2_3_t1',
        description: 'n = 150 мин -> 2 часа 30 минут',
        inputs: [150],
        expectedValueDescription: '2 и 30',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has2 = nums.includes(2);
          const has30 = nums.includes(30);
          const passed = (has2 && has30) || /0?2[:\s]+30/.test(stdout);
          return {
            passed,
            details: passed ? 'Найдены часы (2) и минуты (30)' : 'Ожидались числа 2 и 30',
            expected: '2 и 30',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_3_t2',
        description: 'n = 1441 мин (больше суток: 1440 мин в сутках) -> 0 ч 1 мин',
        inputs: [1441],
        expectedValueDescription: '0 и 1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has0 = nums.includes(0);
          const has1 = nums.includes(1);
          const passed = (has0 && has1) || /0?0[:\s]+0?1/.test(stdout);
          return {
            passed,
            details: passed ? 'Найдены часы (0) и минуты (1)' : 'Ожидались числа 0 и 1',
            expected: '0 и 1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '4',
    section: 'I. Числа, целые и вещественные',
    title: 'Вывод нечетного числа из двух введенных',
    condition: 'Пользователь вводит 2 числа. Определить и вывести на экран нечетное число.',
    formulaDescription: 'if a % 2 != 0: print(a) elif b % 2 != 0: print(b)',
    sampleCode: `# 4\na = int(input("Число 1: "))\nb = int(input("Число 2: "))\nif a % 2 != 0:\n    print(a)\nelif b % 2 != 0:\n    print(b)`,
    testCases: [
      {
        id: '2_4_t1',
        description: 'Ввод 4 и 7 -> нечетное 7',
        inputs: [4, 7],
        expectedValueDescription: '7',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(7);
          return {
            passed,
            details: passed ? 'Нечетное число 7 найдено в выводе' : 'Ожидалось нечетное число 7',
            expected: '7',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_4_t2',
        description: 'Ввод 13 и 8 -> нечетное 13',
        inputs: [13, 8],
        expectedValueDescription: '13',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(13);
          return {
            passed,
            details: passed ? 'Нечетное число 13 найдено в выводе' : 'Ожидалось нечетное число 13',
            expected: '13',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '5',
    section: 'I. Числа, целые и вещественные',
    title: 'Замена чисел m и n большим или нулями',
    condition: 'Даны целые числа m, n. Если числа не равны, то заменить каждое из них одним и тем же числом, равным большему из исходных, а если равны, то заменить числа нулями.',
    formulaDescription: 'if m != n: m = n = max(m, n) else: m = n = 0',
    sampleCode: `# 5\nm = int(input("m: "))\nn = int(input("n: "))\nif m != n:\n    m = n = max(m, n)\nelse:\n    m = n = 0\nprint(m, n)`,
    testCases: [
      {
        id: '2_5_t1',
        description: 'm = 5, n = 8 (не равны) -> оба 8',
        inputs: [5, 8],
        expectedValueDescription: '8 8',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(8);
          return {
            passed,
            details: passed ? 'Значение 8 найдено в выводе' : 'Ожидалось большее число 8',
            expected: '8',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_5_t2',
        description: 'm = 10, n = 10 (равны) -> оба 0',
        inputs: [10, 10],
        expectedValueDescription: '0 0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Значение 0 найдено в выводе' : 'Ожидался 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '6',
    section: 'I. Числа, целые и вещественные',
    title: 'Преобразование числа (+1, -2 или 10)',
    condition: 'Дано целое число. Если оно является положительным, то прибавить к нему 1; если отрицательным, то вычесть из него 2; если нулевым, то заменить его на 10. Вывести полученное число.',
    formulaDescription: 'if x > 0: x + 1 elif x < 0: x - 2 else: 10',
    sampleCode: `# 6\nx = int(input("Число: "))\nif x > 0:\n    res = x + 1\nelif x < 0:\n    res = x - 2\nelse:\n    res = 10\nprint(res)`,
    testCases: [
      {
        id: '2_6_t1',
        description: 'Ввод 5 (положительное) -> 6',
        inputs: [5],
        expectedValueDescription: '6',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(6);
          return {
            passed,
            details: passed ? 'Результат 6 получен' : 'Ожидалось 6 (5+1)',
            expected: '6',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_6_t2',
        description: 'Ввод -4 (отрицательное) -> -6',
        inputs: [-4],
        expectedValueDescription: '-6',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(-6);
          return {
            passed,
            details: passed ? 'Результат -6 получен' : 'Ожидалось -6 (-4-2)',
            expected: '-6',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_6_t3',
        description: 'Ввод 0 -> 10',
        inputs: [0],
        expectedValueDescription: '10',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(10);
          return {
            passed,
            details: passed ? 'Результат 10 получен' : 'Ожидалось 10',
            expected: '10',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '7',
    section: 'I. Числа, целые и вещественные',
    title: 'Трехзначное число справа налево',
    condition: 'Дано трехзначное число. Вывести число, полученное при прочтении исходного числа справа налево.',
    formulaDescription: 'c = n % 10, b = (n // 10) % 10, a = n // 100; c*100 + b*10 + a',
    sampleCode: `# 7\nn = int(input("Трехзначное число: "))\na = n // 100\nb = (n // 10) % 10\nc = n % 10\nrev = c * 100 + b * 10 + a\nprint("Перевернутое:", rev)`,
    testCases: [
      {
        id: '2_7_t1',
        description: 'Число 123 -> 321',
        inputs: [123],
        expectedValueDescription: '321',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(321) || stdout.includes('321');
          return {
            passed,
            details: passed ? 'Найдено число 321' : 'Ожидалось 321',
            expected: '321',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_7_t2',
        description: 'Число 750 -> 57 (или 057)',
        inputs: [750],
        expectedValueDescription: '57 или 057',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(57) || stdout.includes('57') || stdout.includes('057');
          return {
            passed,
            details: passed ? 'Найдено перевернутое число' : 'Ожидалось 57',
            expected: '57 (или 057)',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '8',
    section: 'I. Числа, целые и вещественные',
    title: 'Наибольшее число перестановкой цифр',
    condition: 'В данном трехзначном числе переставьте цифры так, чтобы новое число оказалось наибольшим из возможных.',
    formulaDescription: 'Выделяем цифры, находим max, min, mid, и формируем max*100 + mid*10 + min',
    sampleCode: `# 8\nn = int(input("Трехзначное число: "))\na = n // 100\nb = (n // 10) % 10\nc = n % 10\nmx = max(a, b, c)\nmn = min(a, b, c)\nmid = a + b + c - mx - mn\nres = mx * 100 + mid * 10 + mn\nprint(res)`,
    testCases: [
      {
        id: '2_8_t1',
        description: 'Число 153 -> 531',
        inputs: [153],
        expectedValueDescription: '531',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(531) || stdout.includes('531');
          return {
            passed,
            details: passed ? 'Найдено число 531' : 'Ожидалось 531',
            expected: '531',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_8_t2',
        description: 'Число 204 -> 420',
        inputs: [204],
        expectedValueDescription: '420',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(420) || stdout.includes('420');
          return {
            passed,
            details: passed ? 'Найдено число 420' : 'Ожидалось 420',
            expected: '420',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '9',
    section: 'I. Числа, целые и вещественные',
    title: 'Количество цифр в числе n',
    condition: 'Дано целое число n. Сколько цифр в числе n?',
    formulaDescription: 'Подсчет количества цифр делением на 10 или через логарифм/строку',
    sampleCode: `# 9\nn = abs(int(input("n: ")))\ncount = 1 if n == 0 else 0\nwhile n > 0:\n    count += 1\n    n //= 10\nprint("Цифр:", count)`,
    testCases: [
      {
        id: '2_9_t1',
        description: 'Число 12345 -> 5 цифр',
        inputs: [12345],
        expectedValueDescription: '5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(5);
          return {
            passed,
            details: passed ? 'Найдено 5 цифр' : 'Ожидалось число 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_9_t2',
        description: 'Число 7 -> 1 цифра',
        inputs: [7],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Найдена 1 цифра' : 'Ожидалось число 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '10',
    section: 'I. Числа, целые и вещественные',
    title: 'Все числа до 200 с суммой цифр равной 13',
    condition: 'Найти все целые числа до 200, сумма чисел (цифр) которых равна 13.',
    formulaDescription: 'Перебор чисел 1..200: сумма цифр a//100 + (a//10)%10 + a%10 == 13',
    sampleCode: `# 10\nfor x in range(1, 201):\n    s = (x // 100) + ((x // 10) % 10) + (x % 10)\n    if s == 13:\n        print(x)`,
    testCases: [
      {
        id: '2_10_t1',
        description: 'Числа до 200 с суммой цифр 13 (49, 58, 67, 76, 85, 94, 139, 148, 157, 166, 175, 184, 193)',
        inputs: [],
        expectedValueDescription: 'Числа 49, 58, 67, 76, 85, 94, 139...',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const expectedSamples = [49, 58, 67, 76, 85, 94, 139, 148, 157, 166, 175, 184, 193];
          const foundCount = expectedSamples.filter((n) => nums.includes(n)).length;
          const passed = foundCount >= 5;
          return {
            passed,
            details: passed
              ? `Найдено ${foundCount} требуемых чисел с суммой цифр 13`
              : 'Не найдены числа с суммой цифр 13 (например 49, 58, 67, 139)',
            expected: '49, 58, 67, ..., 193',
            actual: nums.slice(0, 15).join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '11',
    section: 'I. Числа, целые и вещественные',
    title: 'Игра «Угадай число от 1 до n» за k попыток',
    condition: 'Компьютер загадывает число от 1 до n. У пользователя k попыток отгадать. После каждой неудачной попытки компьютер сообщает меньше или больше загаданное число. В конце игры текст с результатом (или “Вы угадали”, или “Попытки закончились”).',
    formulaDescription: 'secret = random.randint(1, n), цикл while попытки <= k',
    sampleCode: `# 11\nimport random\nn = int(input("n: "))\nk = int(input("Попыток k: "))\nsecret = random.randint(1, n)\nwon = False\nfor _ in range(k):\n    guess = int(input("Попытка: "))\n    if guess == secret:\n        print("Вы угадали")\n        won = True\n        break\n    elif guess < secret:\n        print("Больше")\n    else:\n        print("Меньше")\nif not won:\n    print("Попытки закончились")`,
    testCases: [
      {
        id: '2_11_t1',
        description: 'n = 5, k = 2, попытки 1, 2',
        inputs: [5, 2, 1, 2],
        expectedValueDescription: '«Вы угадали» или «Попытки закончились»',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const hasWin = norm.includes('угадал');
          const hasOver = norm.includes('закончились') || norm.includes('исчерпаны') || norm.includes('конец');
          const hasHint = norm.includes('больше') || norm.includes('меньше');
          const passed = hasWin || hasOver || hasHint;
          return {
            passed,
            details: passed
              ? 'Логика игры (угадывание / подсказки больше-меньше) отработала верно'
              : 'Ожидались сообщения «больше», «меньше», «Вы угадали» или «Попытки закончились»',
            expected: 'Вы угадали / Попытки закончились',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '12',
    section: 'I. Числа, целые и вещественные',
    title: 'Количество всех счастливых комбинаций билетов (55251)',
    condition: 'Номера старых троллейбусных билетов представляли собой шестизначные числа (номер первого билета начинается с цифры 000001). Счастливым считается тот билет, у которого сумма первых цифр равна сумме трех последних цифр. Например, билет 627 294 считается счастливым, так как 6 + 2 + 7 = 2 + 9 + 4 = 15. Найдите количество всех счастливых комбинаций.',
    formulaDescription: 'Подсчет счастливых билетов (55251 или 55252)',
    sampleCode: `# 12\ncount = 0\nfor a in range(10):\n    for b in range(10):\n        for c in range(10):\n            for d in range(10):\n                for e in range(10):\n                    for f in range(10):\n                        if a + b + c == d + e + f:\n                            count += 1\n# Если без 000000: count - 1 = 55251\nprint("счастливых билетов:", count - 1 if count == 55252 else count)`,
    testCases: [
      {
        id: '2_12_t1',
        description: 'Поиск всех счастливых шестизначных комбинаций',
        inputs: [],
        expectedValueDescription: '55251 (или 55252)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const isHappy = nums.includes(55251) || nums.includes(55252) || stdout.includes('55251') || stdout.includes('55252');
          return {
            passed: isHappy,
            details: isHappy
              ? 'Верно найдено число счастливых билетов (55251)'
              : 'Ожидалось число 55251 (или 55252)',
            expected: '55251',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '13',
    section: 'I. Числа, целые и вещественные',
    title: 'Числа, равные сумме факториалов своих цифр (факторионы: 145)',
    condition: 'Б. Кордемский указывает одно интересное число 145, которое равно сумме факториалов своих цифр: 145 = 1! + 4! + 5!. Он пишет, что неизвестно, есть ли еще такие числа, удовлетворяющие названному условию. Найдите все такие числа.',
    formulaDescription: 'Числа-факторионы: 1, 2, 145, 40585',
    sampleCode: `# 13\nimport math\nfor n in range(1, 50000):\n    s = sum(math.factorial(int(d)) for d in str(n))\n    if s == n:\n        print(n)`,
    testCases: [
      {
        id: '2_13_t1',
        description: 'Поиск чисел равных сумме факториалов цифр (145)',
        inputs: [],
        expectedValueDescription: '145 (а также 1, 2, 40585)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(145) || stdout.includes('145');
          return {
            passed,
            details: passed
              ? 'Число 145 (факторион) успешно найдено в выводе'
              : 'В выводе не найдено число 145',
            expected: '145',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },

  // --- БЛОК 2: Задачи для самостоятельного выполнения. Проверка условия (14 - 25) ---
  {
    id: '14',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Проверка: «Число A является положительным»',
    condition: 'Дано целое число A. Проверить истинность высказывания: «Число A является положительным». Вывести True, если истинно, и False в противном случае.',
    formulaDescription: 'A > 0',
    sampleCode: `# 14\nA = int(input("A: "))\nprint(A > 0)`,
    testCases: [
      {
        id: '2_14_t1',
        description: 'A = 5 -> True',
        inputs: [5],
        expectedValueDescription: 'True',
        validator: (stdout) => checkBooleanOutput(stdout, true),
      },
      {
        id: '2_14_t2',
        description: 'A = -3 -> False',
        inputs: [-3],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
      {
        id: '2_14_t3',
        description: 'A = 0 -> False',
        inputs: [0],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
    ],
  },
  {
    id: '15',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Проверка: «Хотя бы одно из чисел A, B, C положительное»',
    condition: 'Даны три целых числа: A, B, C. Проверить истинность высказывания: «Хотя бы одно из чисел A, B, C положительное». Вывести True или False.',
    formulaDescription: 'A > 0 or B > 0 or C > 0',
    sampleCode: `# 15\nA = int(input("A: "))\nB = int(input("B: "))\nC = int(input("C: "))\nprint(A > 0 or B > 0 or C > 0)`,
    testCases: [
      {
        id: '2_15_t1',
        description: 'A = -2, B = 0, C = 5 -> True',
        inputs: [-2, 0, 5],
        expectedValueDescription: 'True',
        validator: (stdout) => checkBooleanOutput(stdout, true),
      },
      {
        id: '2_15_t2',
        description: 'A = -1, B = -4, C = -6 -> False',
        inputs: [-1, -4, -6],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
      {
        id: '2_15_t3',
        description: 'A = 3, B = 4, C = 5 -> True',
        inputs: [3, 4, 5],
        expectedValueDescription: 'True',
        validator: (stdout) => checkBooleanOutput(stdout, true),
      },
    ],
  },
  {
    id: '16',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Проверка: «Ровно одно из чисел A, B, C положительное»',
    condition: 'Даны три целых числа: A, B, C. Проверить истинность высказывания: «Ровно одно из чисел A, B, C положительное». Вывести True или False.',
    formulaDescription: '(A > 0) + (B > 0) + (C > 0) == 1',
    sampleCode: `# 16\nA = int(input("A: "))\nB = int(input("B: "))\nC = int(input("C: "))\ncount = (A > 0) + (B > 0) + (C > 0)\nprint(count == 1)`,
    testCases: [
      {
        id: '2_16_t1',
        description: 'A = -5, B = 4, C = -2 (только B > 0) -> True',
        inputs: [-5, 4, -2],
        expectedValueDescription: 'True',
        validator: (stdout) => checkBooleanOutput(stdout, true),
      },
      {
        id: '2_16_t2',
        description: 'A = 1, B = 2, C = -3 (два положительных) -> False',
        inputs: [1, 2, -3],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
      {
        id: '2_16_t3',
        description: 'A = -1, B = -2, C = -3 (ноль положительных) -> False',
        inputs: [-1, -2, -3],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
    ],
  },
  {
    id: '17',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Шахматные поля одинакового цвета',
    condition: 'Даны координаты двух различных полей шахматной доски x1, y1, x2, y2 (целые числа, лежащие в диапазоне 1–8). Проверить истинность высказывания: «Данные поля имеют одинаковый цвет». Вывести True или False.',
    formulaDescription: '(x1 + y1) % 2 == (x2 + y2) % 2',
    sampleCode: `# 17\nx1 = int(input("x1: "))\ny1 = int(input("y1: "))\nx2 = int(input("x2: "))\ny2 = int(input("y2: "))\nprint((x1 + y1) % 2 == (x2 + y2) % 2)`,
    testCases: [
      {
        id: '2_17_t1',
        description: '(1, 1) и (2, 2) -> одинаковый цвет (True)',
        inputs: [1, 1, 2, 2],
        expectedValueDescription: 'True',
        validator: (stdout) => checkBooleanOutput(stdout, true),
      },
      {
        id: '2_17_t2',
        description: '(1, 1) и (1, 2) -> разный цвет (False)',
        inputs: [1, 1, 1, 2],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
      {
        id: '2_17_t3',
        description: '(2, 3) и (4, 5) -> одинаковый цвет (True)',
        inputs: [2, 3, 4, 5],
        expectedValueDescription: 'True',
        validator: (stdout) => checkBooleanOutput(stdout, true),
      },
    ],
  },
  {
    id: '18',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Ход коня на шахматной доске',
    condition: 'Даны координаты двух различных полей шахматной доски x1, y1, x2, y2 (целые числа, лежащие в диапазоне 1–8). Проверить истинность высказывания: «Конь за один ход может перейти с одного поля на другое». Вывести True или False.',
    formulaDescription: 'dx = abs(x1 - x2), dy = abs(y1 - y2); (dx==1 and dy==2) or (dx==2 and dy==1)',
    sampleCode: `# 18\nx1 = int(input("x1: "))\ny1 = int(input("y1: "))\nx2 = int(input("x2: "))\ny2 = int(input("y2: "))\ndx = abs(x1 - x2)\ndy = abs(y1 - y2)\nprint((dx == 1 and dy == 2) or (dx == 2 and dy == 1))`,
    testCases: [
      {
        id: '2_18_t1',
        description: '(1, 1) -> (2, 3) (ход коня: dx=1, dy=2) -> True',
        inputs: [1, 1, 2, 3],
        expectedValueDescription: 'True',
        validator: (stdout) => checkBooleanOutput(stdout, true),
      },
      {
        id: '2_18_t2',
        description: '(1, 1) -> (3, 2) (ход коня: dx=2, dy=1) -> True',
        inputs: [1, 1, 3, 2],
        expectedValueDescription: 'True',
        validator: (stdout) => checkBooleanOutput(stdout, true),
      },
      {
        id: '2_18_t3',
        description: '(1, 1) -> (2, 2) (не ход коня) -> False',
        inputs: [1, 1, 2, 2],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
    ],
  },
  {
    id: '19',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Проверка: «Данное число является четным двузначным»',
    condition: 'Дано целое положительное число. Проверить истинность высказывания: «Данное число является четным двузначным». Вывести True или False.',
    formulaDescription: '10 <= n <= 99 and n % 2 == 0',
    sampleCode: `# 19\nn = int(input("Число: "))\nprint(10 <= n <= 99 and n % 2 == 0)`,
    testCases: [
      {
        id: '2_19_t1',
        description: 'n = 24 -> True (четное двузначное)',
        inputs: [24],
        expectedValueDescription: 'True',
        validator: (stdout) => checkBooleanOutput(stdout, true),
      },
      {
        id: '2_19_t2',
        description: 'n = 25 -> False (нечетное)',
        inputs: [25],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
      {
        id: '2_19_t3',
        description: 'n = 8 -> False (однозначное)',
        inputs: [8],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
      {
        id: '2_19_t4',
        description: 'n = 102 -> False (трехзначное)',
        inputs: [102],
        expectedValueDescription: 'False',
        validator: (stdout) => checkBooleanOutput(stdout, false),
      },
    ],
  },
  {
    id: '20',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Строка-описание числа 100–999 словами',
    condition: 'Дано целое число в диапазоне 100–999. Вывести строку-описание данного числа, например: 256 – «двести пятьдесят шесть», 814 – «восемьсот четырнадцать».',
    formulaDescription: 'Формирование названия сотен, десятков и единиц',
    sampleCode: `# 20\nn = int(input("Число 100-999: "))\nhund = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"]\ntens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"]\nteens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"]\nones = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"]\n\nh = n // 100\nrem = n % 100\nwords = [hund[h]]\nif 10 <= rem <= 19:\n    words.append(teens[rem - 10])\nelse:\n    if rem // 10 > 0: words.append(tens[rem // 10])\n    if rem % 10 > 0: words.append(ones[rem % 10])\nprint(" ".join(words))`,
    testCases: [
      {
        id: '2_20_t1',
        description: 'Число 256 -> «двести пятьдесят шесть»',
        inputs: [256],
        expectedValueDescription: 'двести пятьдесят шесть',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const has200 = norm.includes('двест');
          const has50 = norm.includes('пятьдесят');
          const has6 = norm.includes('шест');
          const passed = has200 && has50 && has6;
          return {
            passed,
            details: passed ? 'Описание числа 256 составлено верно' : 'Ожидалось «двести пятьдесят шесть»',
            expected: 'двести пятьдесят шесть',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_20_t2',
        description: 'Число 814 -> «восемьсот четырнадцать»',
        inputs: [814],
        expectedValueDescription: 'восемьсот четырнадцать',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const has800 = norm.includes('восемьсот');
          const has14 = norm.includes('четырнадцат');
          const passed = has800 && has14;
          return {
            passed,
            details: passed ? 'Описание числа 814 составлено верно' : 'Ожидалось «восемьсот четырнадцать»',
            expected: 'восемьсот четырнадцать',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_20_t3',
        description: 'Число 100 -> «сто»',
        inputs: [100],
        expectedValueDescription: 'сто',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('сто');
          return {
            passed,
            details: passed ? 'Найдено слово «сто»' : 'Ожидалось «сто»',
            expected: 'сто',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '21',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'День недели для K-го дня года (1=воскресенье, 1 января=понедельник)',
    condition: 'Дни недели пронумерованы следующим образом: 1 – воскресенье, 2 – понедельник, 3 – вторник, …, 7 – суббота. Дано целое число K, лежащее в диапазоне 1–365. Определить номер дня недели для K-го дня года, если известно, что в этом году 1 января было понедельником.',
    formulaDescription: 'day = K % 7 + 1',
    sampleCode: `# 21\nK = int(input("K: "))\nday = K % 7 + 1\nprint(day)`,
    testCases: [
      {
        id: '2_21_t1',
        description: 'K = 1 (1 января) -> 2 (понедельник)',
        inputs: [1],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'День недели 2 (понедельник) найден' : 'Ожидался номер 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_21_t2',
        description: 'K = 2 (2 января) -> 3 (вторник)',
        inputs: [2],
        expectedValueDescription: '3',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3);
          return {
            passed,
            details: passed ? 'День недели 3 (вторник) найден' : 'Ожидался номер 3',
            expected: '3',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_21_t3',
        description: 'K = 7 (7 января) -> 1 (воскресенье)',
        inputs: [7],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'День недели 1 (воскресенье) найден' : 'Ожидался номер 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '22',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'День недели для K-го дня года со стартовым днем N',
    condition: 'Дни недели пронумерованы следующим образом: 1 – понедельник, 2 – вторник, …, 6 – суббота, 7 – воскресенье. Дано целое число K, лежащее в диапазоне 1–365, и целое число N, лежащее в диапазоне 1–7. Определить номер дня недели для K-го дня года, если известно, что в этом году 1 января было днем недели с номером N.',
    formulaDescription: 'day = (N + K - 2) % 7 + 1',
    sampleCode: `# 22\nK = int(input("K: "))\nN = int(input("N (1 января): "))\nday = (N + K - 2) % 7 + 1\nprint(day)`,
    testCases: [
      {
        id: '2_22_t1',
        description: 'K = 1, N = 1 (1 января - понедельник) -> 1',
        inputs: [1, 1],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'День недели 1 определен' : 'Ожидался 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_22_t2',
        description: 'K = 2, N = 1 (2 января) -> 2 (вторник)',
        inputs: [2, 1],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'День недели 2 определен' : 'Ожидался 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2_22_t3',
        description: 'K = 8, N = 1 (8 января) -> 1 (понедельник)',
        inputs: [8, 1],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'День недели 1 определен' : 'Ожидался 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '23',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Направление движения робота после команды (С, З, Ю, В)',
    condition: 'Робот может перемещаться в четырех направлениях («С» – север, «З» – запад, «Ю» – юг, «В» – восток) и принимать три цифровые команды: 0 – продолжать движение, 1 – поворот налево, –1 – поворот направо. Дан символ N – исходное направление робота и целое число K – посланная ему команда. Вывести направление робота после выполнения полученной команды.',
    formulaDescription: 'dirs = ["С", "З", "Ю", "В"], новая позиция = (idx + K) % 4',
    sampleCode: `# 23\nN = input("Направление (С, З, Ю, В): ").strip().upper()\nK = int(input("Команда (0, 1, -1): "))\ndirs = ["С", "З", "Ю", "В"]\nidx = dirs.index(N)\nnew_dir = dirs[(idx + K) % 4]\nprint(new_dir)`,
    testCases: [
      {
        id: '2_23_t1',
        description: 'Исходное «С», поворот налево (1) -> «З» (запад)',
        inputs: ['С', 1],
        expectedValueDescription: 'З (запад)',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('з') || norm.includes('запад');
          return {
            passed,
            details: passed ? 'Направление «З» определено верно' : 'Ожидалось «З» (запад)',
            expected: 'З (запад)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_23_t2',
        description: 'Исходное «С», поворот направо (-1) -> «В» (восток)',
        inputs: ['С', -1],
        expectedValueDescription: 'В (восток)',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('в') || norm.includes('восток');
          return {
            passed,
            details: passed ? 'Направление «В» определено верно' : 'Ожидалось «В» (восток)',
            expected: 'В (восток)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_23_t3',
        description: 'Исходное «Ю», продолжить движение (0) -> «Ю» (юг)',
        inputs: ['Ю', 0],
        expectedValueDescription: 'Ю (юг)',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('ю') || norm.includes('юг');
          return {
            passed,
            details: passed ? 'Направление «Ю» определено верно' : 'Ожидалось «Ю» (юг)',
            expected: 'Ю (юг)',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '24',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Ориентация локатора после двух команд K1 и K2',
    condition: 'Локатор ориентирован на одну из сторон света («С» – север, «З» – запад, «Ю» – юг, «В» – восток) и может принимать три цифровые команды поворота: 1 – поворот налево, –1 – поворот направо, 2 – поворот на 180°. Дан символ N – исходная ориентация локатора и целые числа K1 и K2 – две посланные команды. Вывести ориентацию локатора после выполнения данных команд.',
    formulaDescription: 'dirs = ["С", "З", "Ю", "В"], сдвиг = (idx + K1 + K2) % 4',
    sampleCode: `# 24\nN = input("Ориентация (С, З, Ю, В): ").strip().upper()\nK1 = int(input("Команда 1: "))\nK2 = int(input("Команда 2: "))\ndirs = ["С", "З", "Ю", "В"]\nidx = dirs.index(N)\nres = dirs[(idx + K1 + K2) % 4]\nprint(res)`,
    testCases: [
      {
        id: '2_24_t1',
        description: 'Исходное «С», команды 1 и 1 (два поворота налево = 180°) -> «Ю» (юг)',
        inputs: ['С', 1, 1],
        expectedValueDescription: 'Ю (юг)',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('ю') || norm.includes('юг');
          return {
            passed,
            details: passed ? 'Ориентация «Ю» определена верно' : 'Ожидалось «Ю»',
            expected: 'Ю (юг)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_24_t2',
        description: 'Исходное «С», команды 1 и -1 (налево и направо) -> «С» (север)',
        inputs: ['С', 1, -1],
        expectedValueDescription: 'С (север)',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('с') || norm.includes('север');
          return {
            passed,
            details: passed ? 'Ориентация «С» определена верно' : 'Ожидалось «С»',
            expected: 'С (север)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_24_t3',
        description: 'Исходное «В», команды 2 и 1 (180° и налево) -> «Ю» (юг)',
        inputs: ['В', 2, 1],
        expectedValueDescription: 'Ю (юг)',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('ю') || norm.includes('юг');
          return {
            passed,
            details: passed ? 'Ориентация «Ю» определена верно' : 'Ожидалось «Ю»',
            expected: 'Ю (юг)',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '25',
    section: 'II. Проверка условия (if-elif-else, логические выражения)',
    title: 'Восточный 60-летний календарь (1984 — год зеленой крысы)',
    condition: 'В восточном календаре принят 60-летний цикл, состоящий из 12-летних подциклов, обозначаемых названиями цвета: зеленый, красный, желтый, белый и черный. В каждом подцикле годы носят названия животных: крысы, коровы, тигра, зайца, дракона, змеи, лошади, овцы, обезьяны, курицы, собаки и свиньи. По номеру года определить его название, если 1984 год – начало цикла: «год зеленой крысы».',
    formulaDescription: 'color = colors[((year - 1984) % 60) // 12], animal = animals[(year - 1984) % 12]',
    sampleCode: `# 25\nyear = int(input("Год: "))\ncolors = ["зеленой", "красной", "желтой", "белой", "черной"]\nanimals = ["крысы", "коровы", "тигра", "зайца", "дракона", "змеи", "лошади", "овцы", "обезьяны", "курицы", "собаки", "свиньи"]\noffset = (year - 1984) % 60\nc_idx = offset // 12\na_idx = offset % 12\nprint(f"год {colors[c_idx]} {animals[a_idx]}")`,
    testCases: [
      {
        id: '2_25_t1',
        description: '1984 год -> «год зеленой крысы»',
        inputs: [1984],
        expectedValueDescription: 'год зеленой крысы',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const hasGreen = norm.includes('зелен');
          const hasRat = norm.includes('крыс');
          const passed = hasGreen && hasRat;
          return {
            passed,
            details: passed ? 'Название 1984 года (зеленая крыса) определено верно' : 'Ожидалось «год зеленой крысы»',
            expected: 'год зеленой крысы',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_25_t2',
        description: '1985 год -> «год зеленой коровы» (или быка)',
        inputs: [1985],
        expectedValueDescription: 'год зеленой коровы',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const hasGreen = norm.includes('зелен');
          const hasCow = norm.includes('коров') || norm.includes('бык');
          const passed = hasGreen && hasCow;
          return {
            passed,
            details: passed ? 'Название 1985 года (зеленая корова/бык) определено верно' : 'Ожидалось «год зеленой коровы»',
            expected: 'год зеленой коровы (или быка)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2_25_t3',
        description: '1996 год -> «год красной крысы» (второй 12-летний подцикл: 1984+12)',
        inputs: [1996],
        expectedValueDescription: 'год красной крысы',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const hasRed = norm.includes('красн');
          const hasRat = norm.includes('крыс');
          const passed = hasRed && hasRat;
          return {
            passed,
            details: passed ? 'Название 1996 года определено верно' : 'Ожидалось «год красной крысы»',
            expected: 'год красной крысы',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },
];
