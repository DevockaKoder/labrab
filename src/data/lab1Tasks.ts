import { LabTask } from '../types';

// Helper to extract numbers from output
export function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d+(?:[.,]\d+)?(?:[eE][+-]?\d+)?/g);
  if (!matches) return [];
  return matches.map((m) => parseFloat(m.replace(',', '.'))).filter((n) => !isNaN(n));
}

// Helper to compare float arrays with tolerance
export function areNumbersClose(actual: number[], expected: number[], tolerance = 0.05): boolean {
  if (actual.length !== expected.length) return false;
  return actual.every((val, idx) => Math.abs(val - expected[idx]) <= tolerance);
}

export const LAB1_TASKS: LabTask[] = [
  // --- БЛОК 1: Линейные алгоритмы ---
  {
    id: '1.1',
    section: 'I. Линейный алгоритм',
    title: 'Вычисление y = 7x + 5 (Образец)',
    condition: 'Составить алгоритм вычисления значения функции y = 7x + 5, значение x вводится с клавиатуры.',
    formulaDescription: 'y = 7 * x + 5',
    isSample: true,
    sampleCode: `# 1.1\nprint("1.1 Составить алгоритм вычисления значения функции")\nx = int(input("Введите число: "))\ny = 7 * x + 5\nprint("Ответ: y =", y)`,
    testCases: [
      {
        id: '1.1_t1',
        description: 'x = 5 (из образца)',
        inputs: [5],
        expectedValueDescription: 'y = 40',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has40 = nums.includes(40);
          return {
            passed: has40,
            details: has40 ? 'Значение 40 найдено в выводе' : 'В выводе не найдено число 40',
            expected: '40',
            actual: nums.join(', ') || 'нет чисел',
          };
        },
      },
      {
        id: '1.1_t2',
        description: 'x = 0',
        inputs: [0],
        expectedValueDescription: 'y = 5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has5 = nums.includes(5);
          return {
            passed: has5,
            details: has5 ? 'Значение 5 найдено в выводе' : 'В выводе не найдено число 5',
            expected: '5',
            actual: nums.join(', ') || 'нет чисел',
          };
        },
      },
      {
        id: '1.1_t3',
        description: 'x = -2',
        inputs: [-2],
        expectedValueDescription: 'y = -9',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const hasNeg9 = nums.includes(-9);
          return {
            passed: hasNeg9,
            details: hasNeg9 ? 'Значение -9 найдено в выводе' : 'В выводе не найдено число -9',
            expected: '-9',
            actual: nums.join(', ') || 'нет чисел',
          };
        },
      },
    ],
  },
  {
    id: '1.2',
    section: 'I. Линейный алгоритм',
    title: 'Длина окружности',
    condition: 'Составить алгоритм вычисления длины окружности, если известен ее радиус, радиус окружности вводится пользователем.',
    formulaDescription: 'C = 2 * π * r (используя math.pi или 3.14)',
    sampleCode: `import math\n# 1.2\nr = float(input("Радиус: "))\nc = 2 * math.pi * r\nprint("Длина окружности:", c)`,
    testCases: [
      {
        id: '1.2_t1',
        description: 'Радиус r = 5',
        inputs: [5],
        expectedValueDescription: '≈ 31.416 (2 * π * 5)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 31.4159) < 0.1 || Math.abs(n - 31.4) < 0.2);
          return {
            passed: found,
            details: found ? 'Длина окружности ~31.41... вычислена верно' : 'Ожидалось число около 31.4159',
            expected: '≈ 31.4159',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '1.2_t2',
        description: 'Радиус r = 1',
        inputs: [1],
        expectedValueDescription: '≈ 6.283',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 6.283) < 0.05);
          return {
            passed: found,
            details: found ? 'Верно (~6.28)' : 'Ожидалось число около 6.283',
            expected: '≈ 6.283',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '1.3',
    section: 'I. Линейный алгоритм',
    title: 'Периметр прямоугольного треугольника',
    condition: 'Составить алгоритм вычисления периметра прямоугольного треугольника, если известны его катеты, катеты вводятся пользователем.',
    formulaDescription: 'P = a + b + sqrt(a² + b²)',
    sampleCode: `import math\n# 1.3\na = float(input("Катет 1: "))\nb = float(input("Катет 2: "))\np = a + b + math.sqrt(a**2 + b**2)\nprint("Периметр:", p)`,
    testCases: [
      {
        id: '1.3_t1',
        description: 'Катеты a = 3, b = 4',
        inputs: [3, 4],
        expectedValueDescription: 'P = 12 (3 + 4 + 5)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 12) < 0.05);
          return {
            passed: found,
            details: found ? 'Периметр 12 найден' : 'Ожидалось число 12',
            expected: '12',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '1.3_t2',
        description: 'Катеты a = 6, b = 8',
        inputs: [6, 8],
        expectedValueDescription: 'P = 24 (6 + 8 + 10)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 24) < 0.05);
          return {
            passed: found,
            details: found ? 'Периметр 24 найден' : 'Ожидалось число 24',
            expected: '24',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '1.4',
    section: 'I. Линейный алгоритм',
    title: 'Периметр равнобедренной трапеции',
    condition: 'Составить алгоритм вычисления периметра равнобедренной трапеции, если известны ее основания и высота, основания и высота вводятся пользователем.',
    formulaDescription: 'c = sqrt(h² + ((|a - b|)/2)²), P = a + b + 2*c',
    sampleCode: `import math\n# 1.4\na = float(input("Основание a: "))\nb = float(input("Основание b: "))\nh = float(input("Высота h: "))\nc = math.sqrt(h**2 + ((abs(a - b) / 2) ** 2))\np = a + b + 2 * c\nprint("Периметр трапеции:", p)`,
    testCases: [
      {
        id: '1.4_t1',
        description: 'Основания 10 и 4, высота 4',
        inputs: [10, 4, 4],
        expectedValueDescription: 'P = 24 (боковая сторона = 5, 10 + 4 + 2*5)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 24) < 0.1);
          return {
            passed: found,
            details: found ? 'Периметр 24 вычислен верно' : 'Ожидалось число 24',
            expected: '24',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '1.4_t2',
        description: 'Основания 16 и 4, высота 8',
        inputs: [16, 4, 8],
        expectedValueDescription: 'P = 40 (боковая сторона = 10, 16 + 4 + 20)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 40) < 0.1);
          return {
            passed: found,
            details: found ? 'Периметр 40 вычислен верно' : 'Ожидалось число 40',
            expected: '40',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '1.5',
    section: 'I. Линейный алгоритм',
    title: 'Расстояние между точками на плоскости',
    condition: 'Найти расстояние между точками на плоскости с заданными координатами (x1, y1) и (x2, y2) (вычисляется через формулу гипотенузы).',
    formulaDescription: 'd = sqrt((x2 - x1)² + (y2 - y1)²)',
    sampleCode: `import math\n# 1.5\nx1 = float(input("x1: "))\ny1 = float(input("y1: "))\nx2 = float(input("x2: "))\ny2 = float(input("y2: "))\nd = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)\nprint("Расстояние:", d)`,
    testCases: [
      {
        id: '1.5_t1',
        description: '(0, 0) и (3, 4)',
        inputs: [0, 0, 3, 4],
        expectedValueDescription: 'd = 5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 5) < 0.05);
          return {
            passed: found,
            details: found ? 'Расстояние 5 найдено' : 'Ожидалось число 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '1.5_t2',
        description: '(1, 2) и (4, 6)',
        inputs: [1, 2, 4, 6],
        expectedValueDescription: 'd = 5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 5) < 0.05);
          return {
            passed: found,
            details: found ? 'Расстояние 5 найдено' : 'Ожидалось число 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },

  // --- БЛОК 2: Условный алгоритм ---
  {
    id: '2.1',
    section: 'II. Условный алгоритм. Конструкция if',
    title: 'Большее из двух вещественных чисел (Образец)',
    condition: 'Составить алгоритм решения задачи для определения большего из двух вещественных чисел (не используя функцию min или max).',
    isSample: true,
    astRules: [
      {
        id: 'forbid_min_max_2_1',
        title: 'Запрет min() и max()',
        description: 'В решении запрещено использовать встроенные функции min() и max()',
        checkType: 'forbid_min_max',
      },
    ],
    sampleCode: `# 2.1\na = float(input("a: "))\nq = float(input("q: "))\nif a > q:\n    print(a)\nelif a < q:\n    print(q)\nelse:\n    print("Числа равны")`,
    testCases: [
      {
        id: '2.1_t1',
        description: 'Числа 8.5 и 3.2',
        inputs: [8.5, 3.2],
        expectedValueDescription: '8.5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 8.5) < 0.01);
          return {
            passed: found,
            details: found ? 'Выведено 8.5' : 'В выводе нет числа 8.5',
            expected: '8.5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2.1_t2',
        description: 'Числа 4.1 и 9.7',
        inputs: [4.1, 9.7],
        expectedValueDescription: '9.7',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 9.7) < 0.01);
          return {
            passed: found,
            details: found ? 'Выведено 9.7' : 'В выводе нет числа 9.7',
            expected: '9.7',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '2.2',
    section: 'II. Условный алгоритм. Конструкция if',
    title: 'Меньшее из трех целых чисел',
    condition: 'Составить алгоритм решения задачи для определения меньшего из трех целых чисел (не используя функцию min или max).',
    astRules: [
      {
        id: 'forbid_min_max_2_2',
        title: 'Запрет min() и max()',
        description: 'В решении запрещено использовать встроенные функции min() и max()',
        checkType: 'forbid_min_max',
      },
    ],
    sampleCode: `# 2.2\na = int(input())\nb = int(input())\nc = int(input())\nif a <= b and a <= c:\n    print(a)\nelif b <= a and b <= c:\n    print(b)\nelse:\n    print(c)`,
    testCases: [
      {
        id: '2.2_t1',
        description: 'Числа 10, 4, 7',
        inputs: [10, 4, 7],
        expectedValueDescription: '4',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.includes(4);
          return {
            passed: found,
            details: found ? 'Выведено наименьшее число 4' : 'Ожидалось 4',
            expected: '4',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2.2_t2',
        description: 'Числа -5, -1, -8',
        inputs: [-5, -1, -8],
        expectedValueDescription: '-8',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.includes(-8);
          return {
            passed: found,
            details: found ? 'Выведено наименьшее число -8' : 'Ожидалось -8',
            expected: '-8',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '2.3',
    section: 'II. Условный алгоритм. Конструкция if',
    title: 'Среднее из трех разных чисел',
    condition: 'Вводятся три разных числа. Найти, какое из них является средним (больше одного, но меньше другого, не используя функцию min или max).',
    astRules: [
      {
        id: 'forbid_min_max_2_3',
        title: 'Запрет min() и max()',
        description: 'В решении запрещено использовать встроенные функции min() и max()',
        checkType: 'forbid_min_max',
      },
    ],
    sampleCode: `# 2.3\na = float(input())\nb = float(input())\nc = float(input())\nif (b < a < c) or (c < a < b):\n    print(a)\nelif (a < b < c) or (c < b < a):\n    print(b)\nelse:\n    print(c)`,
    testCases: [
      {
        id: '2.3_t1',
        description: 'Числа 15, 3, 9',
        inputs: [15, 3, 9],
        expectedValueDescription: '9',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.includes(9);
          return {
            passed: found,
            details: found ? 'Выведено среднее число 9' : 'Ожидалось 9',
            expected: '9',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2.3_t2',
        description: 'Числа 100, 50, 75',
        inputs: [100, 50, 75],
        expectedValueDescription: '75',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.includes(75);
          return {
            passed: found,
            details: found ? 'Выведено среднее число 75' : 'Ожидалось 75',
            expected: '75',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '2.4',
    section: 'II. Условный алгоритм. Конструкция if',
    title: 'Кусочная функция по графику',
    condition: 'Для данного x вычислить значение кусочной функции: y = 1/(x²) при x <= -1; прямая y = -x при -1 < x <= 0; парабола y = x² при 0 < x <= 2; y = 4 при x > 2.',
    formulaDescription: 'x <= -1: 1/x²; -1 < x <= 0: -x; 0 < x <= 2: x²; x > 2: 4',
    sampleCode: `# 2.4\nx = float(input())\nif x <= -1:\n    y = 1 / (x**2)\nelif -1 < x <= 0:\n    y = -x\nelif 0 < x <= 2:\n    y = x**2\nelse:\n    y = 4\nprint(y)`,
    testCases: [
      {
        id: '2.4_t1',
        description: 'x = -2 (ветка 1/x²)',
        inputs: [-2],
        expectedValueDescription: 'y = 0.25 (1/4)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 0.25) < 0.05);
          return {
            passed: found,
            details: found ? 'Значение 0.25 найдено' : 'Ожидалось 0.25',
            expected: '0.25',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2.4_t2',
        description: 'x = 1 (ветка x²)',
        inputs: [1],
        expectedValueDescription: 'y = 1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.includes(1);
          return {
            passed: found,
            details: found ? 'Значение 1 найдено' : 'Ожидалось 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2.4_t3',
        description: 'x = 5 (ветка y = 4)',
        inputs: [5],
        expectedValueDescription: 'y = 4',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.includes(4);
          return {
            passed: found,
            details: found ? 'Значение 4 найдено' : 'Ожидалось 4',
            expected: '4',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '2.5',
    section: 'II. Условный алгоритм. Конструкция if',
    title: 'Вычисление u = 3z² - 2z + 5',
    condition: 'Даны x, y. Вычислить u = 3z² - 2z + 5, где z = sqrt(x²+y²) если x+y < 2; 2xy если x+y == 3 или x+y == 8; x - y если x+y >= 10; 2x + 3y в остальных случаях.',
    formulaDescription: 'u = 3*z² - 2*z + 5',
    sampleCode: `import math\n# 2.5\nx = float(input())\ny = float(input())\ns = x + y\nif s < 2:\n    z = math.sqrt(x**2 + y**2)\nelif s == 3 or s == 8:\n    z = 2 * x * y\nelif s >= 10:\n    z = x - y\nelse:\n    z = 2 * x + 3 * y\nu = 3 * (z**2) - 2 * z + 5\nprint(u)`,
    testCases: [
      {
        id: '2.5_t1',
        description: 'x = 0, y = 1 (x+y=1 < 2 -> z = 1 -> u = 3(1) - 2(1) + 5 = 6)',
        inputs: [0, 1],
        expectedValueDescription: 'u = 6',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 6) < 0.1);
          return {
            passed: found,
            details: found ? 'u = 6 верно' : 'Ожидалось 6',
            expected: '6',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2.5_t2',
        description: 'x = 1, y = 2 (x+y=3 -> z = 2*1*2=4 -> u = 3*16 - 2*4 + 5 = 45)',
        inputs: [1, 2],
        expectedValueDescription: 'u = 45',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 45) < 0.1);
          return {
            passed: found,
            details: found ? 'u = 45 верно' : 'Ожидалось 45',
            expected: '45',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '2.5_t3',
        description: 'x = 6, y = 4 (x+y=10 >= 10 -> z = 6-4=2 -> u = 3*4 - 4 + 5 = 13)',
        inputs: [6, 4],
        expectedValueDescription: 'u = 13',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 13) < 0.1);
          return {
            passed: found,
            details: found ? 'u = 13 верно' : 'Ожидалось 13',
            expected: '13',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '2.6',
    section: 'II. Условный алгоритм. Конструкция if',
    title: 'Определение четверти координатной плоскости',
    condition: 'Определить четверть координатной плоскости, которой принадлежит точка. Координаты точки ввести с клавиатуры.',
    formulaDescription: 'I (x>0, y>0), II (x<0, y>0), III (x<0, y<0), IV (x>0, y<0)',
    sampleCode: `# 2.6\nx = float(input())\ny = float(input())\nif x > 0 and y > 0:\n    print(1)\nelif x < 0 and y > 0:\n    print(2)\nelif x < 0 and y < 0:\n    print(3)\nelif x > 0 and y < 0:\n    print(4)\nelse:\n    print("На оси")`,
    testCases: [
      {
        id: '2.6_t1',
        description: 'Точка (5, 3) -> 1 четверть',
        inputs: [5, 3],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const text = stdout.toLowerCase();
          const passed = text.includes('1') || text.includes('i');
          return {
            passed,
            details: passed ? 'Четверть 1 определена' : 'Ожидалась 1 четверть',
            expected: '1 (или I)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2.6_t2',
        description: 'Точка (-4, 2) -> 2 четверть',
        inputs: [-4, 2],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const text = stdout.toLowerCase();
          const passed = text.includes('2') || text.includes('ii');
          return {
            passed,
            details: passed ? 'Четверть 2 определена' : 'Ожидалась 2 четверть',
            expected: '2 (или II)',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '2.6_t3',
        description: 'Точка (4, -2) -> 4 четверть',
        inputs: [4, -2],
        expectedValueDescription: '4',
        validator: (stdout) => {
          const text = stdout.toLowerCase();
          const passed = text.includes('4') || text.includes('iv');
          return {
            passed,
            details: passed ? 'Четверть 4 определена' : 'Ожидалась 4 четверть',
            expected: '4 (или IV)',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },

  // --- БЛОК 3: Цикл for ---
  {
    id: '3.1',
    section: 'III. Цикл с параметром (For)',
    title: 'Вывод чисел 1..15 (Образец)',
    condition: 'Составить алгоритм вывода значений следующих чисел: 1, 2, 3 …, 15.',
    isSample: true,
    astRules: [
      {
        id: 'require_for_3_1',
        title: 'Обязателен цикл for',
        description: 'Задание из блока For должно использовать цикл for',
        checkType: 'require_for_loop',
      },
    ],
    sampleCode: `# 3.1\nfor i in range(1, 16):\n    print(i)`,
    testCases: [
      {
        id: '3.1_t1',
        description: 'Последовательность 1..15',
        inputs: [],
        expectedValueDescription: 'Числа 1, 2, ..., 15',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const expected = Array.from({ length: 15 }, (_, i) => i + 1);
          const hasAll = expected.every((n) => nums.includes(n));
          return {
            passed: hasAll,
            details: hasAll ? 'Все числа 1..15 присутствуют' : 'Не найдены все числа 1..15',
            expected: '1, 2, ..., 15',
            actual: nums.slice(0, 18).join(', '),
          };
        },
      },
    ],
  },
  {
    id: '3.2',
    section: 'III. Цикл с параметром (For)',
    title: 'Вывод четных чисел 2, 4, ..., 20 (Образец)',
    condition: 'Составить алгоритм вывода значений следующих чисел: 2, 4, …, 20.',
    isSample: true,
    astRules: [
      {
        id: 'require_for_3_2',
        title: 'Обязателен цикл for',
        description: 'Задание из блока For должно использовать цикл for',
        checkType: 'require_for_loop',
      },
    ],
    sampleCode: `# 3.2\nfor i in range(2, 21, 2):\n    print(i, end=' ')`,
    testCases: [
      {
        id: '3.2_t1',
        description: 'Четные числа 2..20',
        inputs: [],
        expectedValueDescription: '2, 4, 6, 8, 10, 12, 14, 16, 18, 20',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const expected = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
          const hasAll = expected.every((n) => nums.includes(n));
          return {
            passed: hasAll,
            details: hasAll ? 'Все четные 2..20 присутствуют' : 'Не найдены числа 2, 4..20',
            expected: '2, 4, ..., 20',
            actual: nums.slice(0, 12).join(', '),
          };
        },
      },
    ],
  },
  {
    id: '3.3',
    section: 'III. Цикл с параметром (For)',
    title: 'Таблица перевода долларов в рубли (1..20 $)',
    condition: 'Составить алгоритм вывода таблицы перевода 1, 2,... 20 долларов США в рубли по текущему курсу (значение курса вводится пользователем, ответ выдается столбцом, например, 1 $ = 65 руб.).',
    astRules: [
      {
        id: 'require_for_3_3',
        title: 'Обязателен цикл for',
        description: 'Задание должно использовать цикл for',
        checkType: 'require_for_loop',
      },
    ],
    sampleCode: `# 3.3\nrate = float(input("Курс доллара: "))\nfor d in range(1, 21):\n    print(f"{d} $ = {d * rate} руб.")`,
    testCases: [
      {
        id: '3.3_t1',
        description: 'Курс 65 руб./$',
        inputs: [65],
        expectedValueDescription: '1 $ = 65 ... 20 $ = 1300',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has65 = nums.includes(65);
          const has1300 = nums.includes(1300);
          const passed = has65 && has1300;
          return {
            passed,
            details: passed ? 'Таблица содержит правильные значения (65..1300)' : 'Не найдены контрольные значения 65 и 1300',
            expected: '1 $ = 65, ..., 20 $ = 1300',
            actual: nums.slice(0, 10).join(', ') + (nums.length > 10 ? '...' : ''),
          };
        },
      },
    ],
  },
  {
    id: '3.4',
    section: 'III. Цикл с параметром (For)',
    title: 'Таблица стоимости 2..10 кг конфет',
    condition: 'Составить таблицу (для разделения строк таблицы использовать знак подчеркивания \'_\', а для разделения столбцов таблицы знак вертикальной полоски \'|\') вывода стоимости 2, 3, …, 10 кг конфет (цена 1 кг конфет вводится пользователем).',
    astRules: [
      {
        id: 'require_for_3_4',
        title: 'Обязателен цикл for',
        description: 'Задание должно использовать цикл for',
        checkType: 'require_for_loop',
      },
    ],
    sampleCode: `# 3.4\nprice = float(input("Цена за 1 кг: "))\nfor kg in range(2, 11):\n    print(f"{kg} кг | {kg * price} руб.")\n    print("_" * 20)`,
    testCases: [
      {
        id: '3.4_t1',
        description: 'Цена 100 руб/кг. Разделители "_" и "|"',
        inputs: [100],
        expectedValueDescription: 'Стоимости 200, 300, ..., 1000 и символы "|" и "_"',
        validator: (stdout) => {
          const hasPipe = stdout.includes('|');
          const hasUnderscore = stdout.includes('_');
          const nums = extractNumbers(stdout);
          const has200 = nums.includes(200);
          const has1000 = nums.includes(1000);
          const passed = has200 && has1000 && (hasPipe || hasUnderscore);
          return {
            passed,
            details: passed
              ? 'Таблица цен сформирована с разделителями'
              : 'Проверьте расчет стоимости и наличие символов "|" и "_"',
            expected: '200..1000 с "|" и "_"',
            actual: stdout.slice(0, 100) + (stdout.length > 100 ? '...' : ''),
          };
        },
      },
    ],
  },
  {
    id: '3.5',
    section: 'III. Цикл с параметром (For)',
    title: 'Вычисление суммы S = Σ (1 / k⁵) от k=1 до n',
    condition: 'Дано натуральное число n. Вычислите сумму S = Σ_{k=1}^n (1 / k^5).',
    formulaDescription: 'S = 1/1^5 + 1/2^5 + ... + 1/n^5',
    astRules: [
      {
        id: 'require_for_3_5',
        title: 'Обязателен цикл for',
        description: 'Задание должно использовать цикл for',
        checkType: 'require_for_loop',
      },
    ],
    sampleCode: `# 3.5\nn = int(input("n: "))\ns = 0\nfor k in range(1, n + 1):\n    s += 1 / (k ** 5)\nprint("S =", s)`,
    testCases: [
      {
        id: '3.5_t1',
        description: 'n = 1 -> S = 1.0',
        inputs: [1],
        expectedValueDescription: '1.0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 1.0) < 0.01);
          return {
            passed: found,
            details: found ? 'S = 1 найдено' : 'Ожидалось 1.0',
            expected: '1.0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3.5_t2',
        description: 'n = 2 -> S = 1 + 1/32 = 1.03125',
        inputs: [2],
        expectedValueDescription: '≈ 1.03125',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 1.03125) < 0.005);
          return {
            passed: found,
            details: found ? 'S ≈ 1.03125 вычислено верно' : 'Ожидалось 1.03125',
            expected: '≈ 1.03125',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '3.6',
    section: 'III. Цикл с параметром (For)',
    title: 'Вычисление суммы S = Σ ((2k - 1) / (k + 1)) от k=1 до n',
    condition: 'Дано натуральное число n. Составьте алгоритм для вычисления суммы S = Σ_{k=1}^n (2k - 1) / (k + 1).',
    formulaDescription: 'S = Σ_{k=1}^n (2k - 1) / (k + 1)',
    astRules: [
      {
        id: 'require_for_3_6',
        title: 'Обязателен цикл for',
        description: 'Задание должно использовать цикл for',
        checkType: 'require_for_loop',
      },
    ],
    sampleCode: `# 3.6\nn = int(input("n: "))\ns = 0\nfor k in range(1, n + 1):\n    s += (2 * k - 1) / (k + 1)\nprint("S =", s)`,
    testCases: [
      {
        id: '3.6_t1',
        description: 'n = 1 -> S = (2*1 - 1) / (1 + 1) = 0.5',
        inputs: [1],
        expectedValueDescription: '0.5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 0.5) < 0.02);
          return {
            passed: found,
            details: found ? 'S = 0.5 верно' : 'Ожидалось 0.5',
            expected: '0.5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3.6_t2',
        description: 'n = 2 -> S = 0.5 + 3/3 = 1.5',
        inputs: [2],
        expectedValueDescription: '1.5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 1.5) < 0.02);
          return {
            passed: found,
            details: found ? 'S = 1.5 верно' : 'Ожидалось 1.5',
            expected: '1.5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '3.7',
    section: 'III. Цикл с параметром (For)',
    title: 'Вычисление произведения P = Π (1 + 1/k) от k=1 до n',
    condition: 'Дано натуральное число n. Вычислите произведение n множителей: P = Π_{k=1}^n (1 + 1/k). Заметим, что теоретически P = n + 1.',
    formulaDescription: 'P = (1 + 1/1)*(1 + 1/2)*...*(1 + 1/n) = n + 1',
    astRules: [
      {
        id: 'require_for_3_7',
        title: 'Обязателен цикл for',
        description: 'Задание должно использовать цикл for',
        checkType: 'require_for_loop',
      },
    ],
    sampleCode: `# 3.7\nn = int(input("n: "))\np = 1\nfor k in range(1, n + 1):\n    p *= (1 + 1 / k)\nprint("P =", p)`,
    testCases: [
      {
        id: '3.7_t1',
        description: 'n = 3 -> P = (2) * (1.5) * (4/3) = 4.0',
        inputs: [3],
        expectedValueDescription: '4.0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 4.0) < 0.05);
          return {
            passed: found,
            details: found ? 'P = 4.0 верно' : 'Ожидалось 4.0',
            expected: '4.0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3.7_t2',
        description: 'n = 5 -> P = 6.0',
        inputs: [5],
        expectedValueDescription: '6.0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.some((n) => Math.abs(n - 6.0) < 0.05);
          return {
            passed: found,
            details: found ? 'P = 6.0 верно' : 'Ожидалось 6.0',
            expected: '6.0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },

  // --- БЛОК 4: Цикл while ---
  {
    id: '4.1',
    section: 'IV. Цикл с условием (While)',
    title: 'Числа между A и B по возрастанию (Образец)',
    condition: 'Даны два целых числа A и B (A < B). Составить алгоритм вывода всех целых чисел, расположенных между ними (не включая сами числа), по возрастанию.',
    isSample: true,
    astRules: [
      {
        id: 'require_while_4_1',
        title: 'Обязателен цикл while',
        description: 'Задание из блока While должно использовать цикл while',
        checkType: 'require_while_loop',
      },
    ],
    sampleCode: `# 4.1\na = int(input("A: "))\nb = int(input("B: "))\nwhile a < b - 1:\n    a += 1\n    print(a)`,
    testCases: [
      {
        id: '4.1_t1',
        description: 'A = 3, B = 8 (из образца)',
        inputs: [3, 8],
        expectedValueDescription: '4, 5, 6, 7',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const expected = [4, 5, 6, 7];
          const passed = expected.every((n) => nums.includes(n)) && !nums.includes(3) && !nums.includes(8);
          return {
            passed,
            details: passed ? 'Выведены числа 4, 5, 6, 7' : 'Ожидались только 4, 5, 6, 7',
            expected: '4, 5, 6, 7',
            actual: nums.join(', '),
          };
        },
      },
    ],
  },
  {
    id: '4.2',
    section: 'IV. Цикл с условием (While)',
    title: 'Числа между A и B по убыванию',
    condition: 'Даны два целых числа A и B (A < B). Составить алгоритм вывода всех целых чисел, расположенных между данными числами (не включая сами эти числа), в порядке их убывания.',
    astRules: [
      {
        id: 'require_while_4_2',
        title: 'Обязателен цикл while',
        description: 'Задание должно использовать цикл while',
        checkType: 'require_while_loop',
      },
    ],
    sampleCode: `# 4.2\na = int(input("A: "))\nb = int(input("B: "))\ncurr = b - 1\nwhile curr > a:\n    print(curr)\n    curr -= 1`,
    testCases: [
      {
        id: '4.2_t1',
        description: 'A = 3, B = 8 -> 7, 6, 5, 4 по убыванию',
        inputs: [3, 8],
        expectedValueDescription: '7, 6, 5, 4 (по убыванию)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const expected = [7, 6, 5, 4];
          const hasOrder = nums.join(' ').includes(expected.join(' ')) ||
            (expected.every((n) => nums.includes(n)) && nums.indexOf(7) < nums.indexOf(4));
          return {
            passed: hasOrder,
            details: hasOrder ? 'Числа 7, 6, 5, 4 выведены по убыванию' : 'Ожидались 7, 6, 5, 4 по убыванию',
            expected: '7, 6, 5, 4',
            actual: nums.join(', '),
          };
        },
      },
      {
        id: '4.2_t2',
        description: 'A = 10, B = 14 -> 13, 12, 11',
        inputs: [10, 14],
        expectedValueDescription: '13, 12, 11',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = [13, 12, 11].every((n) => nums.includes(n));
          return {
            passed,
            details: passed ? 'Выведено 13, 12, 11' : 'Ожидались 13, 12, 11',
            expected: '13, 12, 11',
            actual: nums.join(', '),
          };
        },
      },
    ],
  },
  {
    id: '4.3',
    section: 'IV. Цикл с условием (While)',
    title: 'Все числа меньше натурального N',
    condition: 'Дано натуральное число N. Составить алгоритм получения всех чисел, меньше N.',
    astRules: [
      {
        id: 'require_while_4_3',
        title: 'Обязателен цикл while',
        description: 'Задание должно использовать цикл while',
        checkType: 'require_while_loop',
      },
    ],
    sampleCode: `# 4.3\nn = int(input("N: "))\ni = 1\nwhile i < n:\n    print(i)\n    i += 1`,
    testCases: [
      {
        id: '4.3_t1',
        description: 'N = 6 -> числа меньше 6 (1, 2, 3, 4, 5)',
        inputs: [6],
        expectedValueDescription: '1, 2, 3, 4, 5 (или с 0 до 5)',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const has1to5 = [1, 2, 3, 4, 5].every((n) => nums.includes(n)) && !nums.includes(6);
          return {
            passed: has1to5,
            details: has1to5 ? 'Числа меньше 6 получены верно' : 'Не найдены все числа 1..5',
            expected: '1, 2, 3, 4, 5',
            actual: nums.join(', '),
          };
        },
      },
    ],
  },
  {
    id: '4.4',
    section: 'IV. Цикл с условием (While)',
    title: 'Первое натуральное число, квадрат которого больше n',
    condition: 'Дано число n. Составить алгоритм поиска первого натурального числа, квадрат которого больше n.',
    astRules: [
      {
        id: 'require_while_4_4',
        title: 'Обязателен цикл while',
        description: 'Задание должно использовать цикл while',
        checkType: 'require_while_loop',
      },
    ],
    sampleCode: `# 4.4\nn = float(input("n: "))\nk = 1\nwhile k**2 <= n:\n    k += 1\nprint(k)`,
    testCases: [
      {
        id: '4.4_t1',
        description: 'n = 20 -> k = 5 (4²=16 <= 20, 5²=25 > 20)',
        inputs: [20],
        expectedValueDescription: '5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.includes(5);
          return {
            passed: found,
            details: found ? 'Ответ 5 найден' : 'Ожидалось число 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '4.4_t2',
        description: 'n = 49 -> k = 8 (7²=49, 8²=64 > 49)',
        inputs: [49],
        expectedValueDescription: '8',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.includes(8);
          return {
            passed: found,
            details: found ? 'Ответ 8 найден' : 'Ожидалось число 8',
            expected: '8',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '4.5',
    section: 'IV. Цикл с условием (While)',
    title: 'Сумма нечетных чисел от 1 до 99',
    condition: 'Определить сумму всех нечетных чисел от 1 до 99 (используя цикл while).',
    formulaDescription: '1 + 3 + 5 + ... + 99 = 2500',
    astRules: [
      {
        id: 'require_while_4_5',
        title: 'Обязателен цикл while',
        description: 'Задание должно использовать цикл while',
        checkType: 'require_while_loop',
      },
    ],
    sampleCode: `# 4.5\ns = 0\ni = 1\nwhile i <= 99:\n    s += i\n    i += 2\nprint("Сумма =", s)`,
    testCases: [
      {
        id: '4.5_t1',
        description: 'Сумма 1..99 нечетных чисел',
        inputs: [],
        expectedValueDescription: '2500',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const found = nums.includes(2500);
          return {
            passed: found,
            details: found ? 'Сумма 2500 найдена' : 'Ожидалось число 2500',
            expected: '2500',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
];
