import { LabTask } from '../types';
import { extractNumbers } from './lab1Tasks';

// Helper to normalize Russian text output
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/ё/g, 'е').replace(/[\t\r\n]+/g, ' ').trim();
}

export const LAB3_TASKS: LabTask[] = [
  // ==========================================
  // ГРУППА 1. Цикл с параметром: группа For (1 - 5)
  // ==========================================
  {
    id: '1',
    section: '1. Цикл с параметром: группа For',
    title: 'Квадрат числа через сумму нечетных чисел: N² = 1 + 3 + ... + (2*N - 1)',
    condition: 'Дано целое число N (> 0). Найти квадрат данного числа, используя для его вычисления следующую формулу: N² = 1 + 3 + 5 + … + (2*N – 1). После добавления к сумме каждого слагаемого выводить текущее значение суммы (в результате будут выведены квадраты всех целых чисел от 1 до N).',
    formulaDescription: 'N² = 1 + 3 + 5 + ... + (2*N - 1), с промежуточным выводом сумм',
    sampleCode: `# 1\nN = int(input())\ns = 0\nfor i in range(1, N + 1):\n    s += 2 * i - 1\n    print(s)`,
    astRules: [
      {
        id: 'ast_for_loop_1',
        title: 'Использование цикла for',
        description: 'В решении задачи должен использоваться цикл for',
        checkType: 'require_for_loop',
      },
    ],
    testCases: [
      {
        id: '3_1_t1',
        description: 'N = 5: последовательный вывод квадратов 1, 4, 9, 16, 25',
        inputs: [5],
        expectedValueDescription: '1, 4, 9, 16, 25',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const expectedSeq = [1, 4, 9, 16, 25];
          const hasLast = nums.includes(25);
          const hasSeq = expectedSeq.every((sq) => nums.includes(sq));
          const passed = hasSeq || (hasLast && nums.length >= 3);
          return {
            passed,
            details: passed
              ? 'Квадраты чисел от 1 до N успешно вычислены через сумму нечетных слагаемых'
              : 'Ожидалась последовательность квадратов: 1, 4, 9, 16, 25',
            expected: '1, 4, 9, 16, 25',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_1_t2',
        description: 'N = 3: вывод 1, 4, 9',
        inputs: [3],
        expectedValueDescription: '1, 4, 9',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(9) && (nums.includes(1) || nums.includes(4));
          return {
            passed,
            details: passed
              ? 'Квадраты 1, 4, 9 выведены верно'
              : 'Ожидался вывод квадратов 1, 4, 9',
            expected: '1, 4, 9',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '2',
    section: '1. Цикл с параметром: группа For',
    title: 'Знакочередующееся выражение 1.1 – 1.2 + 1.3 – … (без if)',
    condition: 'Дано целое число N (> 0). Найти значение выражения 1.1 – 1.2 + 1.3 – … (N слагаемых, знаки чередуются). Условный оператор не использовать.',
    formulaDescription: 'S = Σ (-1)^(k-1) * (1.0 + k * 0.1), без использования if',
    sampleCode: `# 2\nN = int(input())\ns = 0.0\nsign = 1.0\nfor i in range(1, N + 1):\n    term = 1.0 + i * 0.1\n    s += sign * term\n    sign = -sign\nprint(round(s, 4))`,
    astRules: [
      {
        id: 'ast_for_loop_2',
        title: 'Использование цикла for',
        description: 'В решении задачи должен использоваться цикл for',
        checkType: 'require_for_loop',
      },
    ],
    testCases: [
      {
        id: '3_2_t1',
        description: 'N = 3: 1.1 - 1.2 + 1.3 = 1.2',
        inputs: [3],
        expectedValueDescription: '1.2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.some((n) => Math.abs(n - 1.2) < 0.05);
          return {
            passed,
            details: passed
              ? 'Значение выражения 1.1 - 1.2 + 1.3 = 1.2 вычислено верно'
              : 'Ожидалось значение 1.2',
            expected: '1.2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_2_t2',
        description: 'N = 4: 1.1 - 1.2 + 1.3 - 1.4 = -0.2',
        inputs: [4],
        expectedValueDescription: '-0.2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.some((n) => Math.abs(n - (-0.2)) < 0.05);
          return {
            passed,
            details: passed
              ? 'Значение для 4 слагаемых (-0.2) вычислено верно'
              : 'Ожидалось значение -0.2',
            expected: '-0.2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '3',
    section: '1. Цикл с параметром: группа For',
    title: 'Рекуррентная последовательность: AK = AK–1 + AK–2 – 2·AK–3',
    condition: 'Дано целое число N (> 2). Последовательность целых чисел AK определяется следующим образом: A1 = 1, A2 = 2, A3 = 3, AK = AK–1 + AK–2 – 2·AK–3, K = 4, 5, … . Вывести элементы A1, A2, …, AN.',
    formulaDescription: 'A1=1, A2=2, A3=3, AK = AK-1 + AK-2 - 2*AK-3',
    sampleCode: `# 3\nN = int(input())\na1, a2, a3 = 1, 2, 3\nprint(a1, a2, a3, end=' ')\nfor k in range(4, N + 1):\n    ak = a3 + a2 - 2 * a1\n    print(ak, end=' ')\n    a1, a2, a3 = a2, a3, ak\nprint()`,
    testCases: [
      {
        id: '3_3_t1',
        description: 'N = 6: элементы 1, 2, 3, 3, 2, -1',
        inputs: [6],
        expectedValueDescription: '1, 2, 3, 3, 2, -1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const expected = [1, 2, 3, 3, 2, -1];
          const hasLast = nums.includes(-1) && nums.includes(3) && nums.includes(2);
          const passed = hasLast || expected.every((val) => nums.includes(val));
          return {
            passed,
            details: passed
              ? 'Элементы рекуррентной последовательности найдены верно'
              : 'Ожидалась последовательность A1..A6: 1, 2, 3, 3, 2, -1',
            expected: '1, 2, 3, 3, 2, -1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_3_t2',
        description: 'N = 4: элементы 1, 2, 3, 3',
        inputs: [4],
        expectedValueDescription: '1, 2, 3, 3',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1) && nums.includes(2) && nums.includes(3);
          return {
            passed,
            details: passed ? 'Элементы A1..A4 выведены верно' : 'Ожидались элементы 1, 2, 3, 3',
            expected: '1, 2, 3, 3',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '4',
    section: '1. Цикл с параметром: группа For',
    title: 'Вывод чисел от A до B с повторением значения',
    condition: 'Даны целые положительные числа A и B (A < B). Вывести все целые числа от A до B включительно; при этом каждое число должно выводиться столько раз, каково его значение (например, число 3 выводится 3 раза).',
    formulaDescription: 'Внешний цикл от A до B, внутренний цикл от 1 до текущего числа',
    sampleCode: `# 4\nA = int(input())\nB = int(input())\nfor i in range(A, B + 1):\n    for _ in range(i):\n        print(i, end=' ')\nprint()`,
    testCases: [
      {
        id: '3_4_t1',
        description: 'A = 2, B = 4: 2 дважды, 3 трижды, 4 четырежды',
        inputs: [2, 4],
        expectedValueDescription: '2 2 3 3 3 4 4 4 4',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const count2 = nums.filter((n) => n === 2).length;
          const count3 = nums.filter((n) => n === 3).length;
          const count4 = nums.filter((n) => n === 4).length;
          const passed = (count2 >= 2 && count3 >= 3 && count4 >= 4) || (nums.includes(2) && nums.includes(3) && nums.includes(4) && nums.length >= 9);
          return {
            passed,
            details: passed
              ? 'Числа от 2 до 4 выведены в соответствии с их значениями'
              : 'Ожидалось: 2 дважды, 3 трижды, 4 четырежды (всего 9 чисел)',
            expected: '2 2 3 3 3 4 4 4 4',
            actual: nums.join(' ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_4_t2',
        description: 'A = 1, B = 2: 1 один раз, 2 два раза',
        inputs: [1, 2],
        expectedValueDescription: '1 2 2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1) && nums.includes(2) && nums.length >= 3;
          return {
            passed,
            details: passed ? 'Числа 1 и 2 выведены верно' : 'Ожидалось: 1 2 2',
            expected: '1 2 2',
            actual: nums.join(' ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '5',
    section: '1. Цикл с параметром: группа For',
    title: 'Вычисление 1 – A + A² – A³ + … + (–1)ⁿ·Aⁿ (без if)',
    condition: 'Дано вещественное число A и целое число N (> 0). Используя один цикл for, найти значение выражения 1 – A + A² – A³ + … + (–1)ⁿ·Aⁿ. Условный оператор не использовать.',
    formulaDescription: 'Сумма геометрической прогрессии с чередующимися знаками, один цикл for, без if',
    sampleCode: `# 5\nA = float(input())\nN = int(input())\ns = 1.0\nterm = 1.0\nfor i in range(1, N + 1):\n    term *= -A\n    s += term\nprint(round(s, 4))`,
    astRules: [
      {
        id: 'ast_for_loop_5',
        title: 'Один цикл for',
        description: 'Используется цикл for',
        checkType: 'require_for_loop',
      },
    ],
    testCases: [
      {
        id: '3_5_t1',
        description: 'A = 2, N = 3: 1 - 2 + 4 - 8 = -5',
        inputs: [2, 3],
        expectedValueDescription: '-5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.some((n) => Math.abs(n - (-5)) < 0.01);
          return {
            passed,
            details: passed
              ? 'Значение выражения 1 - 2 + 4 - 8 = -5 вычислено верно'
              : 'Ожидалось значение -5',
            expected: '-5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_5_t2',
        description: 'A = 2, N = 2: 1 - 2 + 4 = 3',
        inputs: [2, 2],
        expectedValueDescription: '3',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.some((n) => Math.abs(n - 3) < 0.01);
          return {
            passed,
            details: passed ? 'Значение выражения 1 - 2 + 4 = 3 вычислено верно' : 'Ожидалось значение 3',
            expected: '3',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },

  // ==========================================
  // ГРУППА 2. Цикл с условием: группа While (6 - 10)
  // ==========================================
  {
    id: '6',
    section: '2. Цикл с условием: группа While',
    title: 'Двойной факториал N!!',
    condition: 'Дано целое число N (> 0). Найти двойной факториал N: N!! = N·(N–2)·(N–4)·… (последний сомножитель равен 2, если N — четное, и 1, если N — нечетное).',
    formulaDescription: 'N!! = N * (N - 2) * ... (до 1 или 2)',
    sampleCode: `# 6\nN = int(input())\nres = 1\nwhile N > 0:\n    res *= N\n    N -= 2\nprint(res)`,
    astRules: [
      {
        id: 'ast_while_loop_6',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_6_t1',
        description: 'N = 6 (четное): 6!! = 6 * 4 * 2 = 48',
        inputs: [6],
        expectedValueDescription: '48',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(48);
          return {
            passed,
            details: passed ? '6!! = 48 вычислен верно' : 'Ожидалось значение 48',
            expected: '48',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_6_t2',
        description: 'N = 5 (нечетное): 5!! = 5 * 3 * 1 = 15',
        inputs: [5],
        expectedValueDescription: '15',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(15);
          return {
            passed,
            details: passed ? '5!! = 15 вычислен верно' : 'Ожидалось значение 15',
            expected: '15',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '7',
    section: '2. Цикл с условием: группа While',
    title: 'Наименьшее целое K, квадрат которого превосходит N (K² > N, без sqrt)',
    condition: 'Дано целое число N (> 0). Найти наименьшее целое положительное число K, квадрат которого превосходит N: K² > N. Функцию извлечения квадратного корня не использовать.',
    formulaDescription: 'Поиск наименьшего K, такого что K*K > N, с помощью while',
    sampleCode: `# 7\nN = int(input())\nK = 1\nwhile K * K <= N:\n    K += 1\nprint(K)`,
    astRules: [
      {
        id: 'ast_while_loop_7',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_7_t1',
        description: 'N = 25: 5² = 25 (не превосходит), 6² = 36 > 25 -> K = 6',
        inputs: [25],
        expectedValueDescription: '6',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(6);
          return {
            passed,
            details: passed ? 'Для N = 25 наименьшее K = 6 найдено верно' : 'Ожидалось число K = 6',
            expected: '6',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_7_t2',
        description: 'N = 10: 3² = 9 <= 10, 4² = 16 > 10 -> K = 4',
        inputs: [10],
        expectedValueDescription: '4',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(4);
          return {
            passed,
            details: passed ? 'Для N = 10 найдено K = 4' : 'Ожидалось число K = 4',
            expected: '4',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '8',
    section: '2. Цикл с условием: группа While',
    title: 'Наибольшее K, для которого сумма 1 + 2 + … + K <= N, и сумма',
    condition: 'Дано целое число N (> 1). Вывести наибольшее из целых чисел K, для которых сумма 1 + 2 + … + K будет меньше или равна N, и саму эту сумму.',
    formulaDescription: 'Поиск наибольшего K и суммы 1 + 2 + ... + K <= N',
    sampleCode: `# 8\nN = int(input())\nK = 0\ns = 0\nwhile s + (K + 1) <= N:\n    K += 1\n    s += K\nprint(K, s)`,
    astRules: [
      {
        id: 'ast_while_loop_8',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_8_t1',
        description: 'N = 11: при K = 4 сумма 10 <= 11; вывод: K = 4, сумма = 10',
        inputs: [11],
        expectedValueDescription: '4 и 10',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const hasK = nums.includes(4);
          const hasSum = nums.includes(10);
          const passed = hasK && hasSum;
          return {
            passed,
            details: passed ? 'Верно выведены K = 4 и сумма = 10' : 'Ожидались числа 4 (K) и 10 (сумма)',
            expected: '4 10',
            actual: nums.join(' ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_8_t2',
        description: 'N = 6: при K = 3 сумма 1 + 2 + 3 = 6 <= 6; вывод: 3 и 6',
        inputs: [6],
        expectedValueDescription: '3 и 6',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3) && nums.includes(6);
          return {
            passed,
            details: passed ? 'Верно выведены K = 3 и сумма = 6' : 'Ожидались числа 3 и 6',
            expected: '3 6',
            actual: nums.join(' ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '9',
    section: '2. Цикл с условием: группа While',
    title: 'Наибольшее K, для которого 1 + 1/2 + … + 1/K < A, и сумма',
    condition: 'Дано число A (> 1). Вывести наибольшее из целых чисел K, для которых сумма 1 + 1/2 + … + 1/K будет меньше A, и саму эту сумму.',
    formulaDescription: 'Гармонический ряд: поиск наибольшего K и суммы < A',
    sampleCode: `# 9\nA = float(input())\nK = 0\ns = 0.0\nwhile s + 1.0 / (K + 1) < A:\n    K += 1\n    s += 1.0 / K\nprint(K, round(s, 4))`,
    astRules: [
      {
        id: 'ast_while_loop_9',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_9_t1',
        description: 'A = 2.0: K = 3 (сумма 1 + 0.5 + 0.3333 = 1.8333 < 2.0)',
        inputs: [2.0],
        expectedValueDescription: 'K = 3 и сумма ≈ 1.833',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const hasK = nums.includes(3);
          const hasSum = nums.some((n) => Math.abs(n - 1.8333) < 0.05);
          const passed = hasK || hasSum;
          return {
            passed,
            details: passed
              ? 'Наибольшее K = 3 и сумма гармонического ряда найдены верно'
              : 'Ожидалось: K = 3 и сумма ≈ 1.8333',
            expected: '3 1.8333',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '10',
    section: '2. Цикл с условием: группа While',
    title: 'Проверка, является ли число N числом Фибоначчи',
    condition: 'Дано целое число N (> 1). Последовательность чисел Фибоначчи FK определяется следующим образом: F1 = 1, F2 = 1, FK = FK–2 + FK–1, K = 3, 4, … . Проверить, является ли число N числом Фибоначчи. Если является, то вывести True, если нет — вывести False.',
    formulaDescription: 'Последовательность Фибоначчи до достижения или превышения N',
    sampleCode: `# 10\nN = int(input())\nf1, f2 = 1, 1\nwhile f2 < N:\n    f1, f2 = f2, f1 + f2\nprint(f2 == N)`,
    astRules: [
      {
        id: 'ast_while_loop_10',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_10_t1',
        description: 'N = 8 (число Фибоначчи) -> True',
        inputs: [8],
        expectedValueDescription: 'True',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('true') || norm.includes('да') || norm.includes('истина') || stdout.trim() === '1';
          return {
            passed,
            details: passed ? 'Для N = 8 верно выведено True' : 'Ожидался вывод True',
            expected: 'True',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '3_10_t2',
        description: 'N = 10 (не является числом Фибоначчи) -> False',
        inputs: [10],
        expectedValueDescription: 'False',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('false') || norm.includes('нет') || norm.includes('ложь') || stdout.trim() === '0';
          return {
            passed,
            details: passed ? 'Для N = 10 верно выведено False' : 'Ожидался вывод False',
            expected: 'False',
            actual: stdout.trim(),
          };
        },
      },
      {
        id: '3_10_t3',
        description: 'N = 13 (число Фибоначчи) -> True',
        inputs: [13],
        expectedValueDescription: 'True',
        validator: (stdout) => {
          const norm = normalizeText(stdout);
          const passed = norm.includes('true') || norm.includes('да') || norm.includes('истина') || stdout.trim() === '1';
          return {
            passed,
            details: passed ? 'Для N = 13 верно выведено True' : 'Ожидался вывод True',
            expected: 'True',
            actual: stdout.trim(),
          };
        },
      },
    ],
  },

  // ==========================================
  // ГРУППА 3. Однопроходные алгоритмы цикла while (11 - 15)
  // ==========================================
  {
    id: '11',
    section: '3. Однопроходные алгоритмы цикла while',
    title: 'Округление вещественных чисел набора и их сумма',
    condition: 'Дано целое число N и набор из N вещественных чисел. Вывести в том же порядке округленные значения всех чисел из данного набора (как целые числа), а также сумму всех округленных значений. Решается без использования списков.',
    formulaDescription: 'В цикле while считываются N вещественных чисел, выводятся round(x) и накапливается их сумма',
    sampleCode: `# 11\nN = int(input())\ni = 0\ns = 0\nwhile i < N:\n    x = float(input())\n    rx = round(x)\n    print(rx, end=' ')\n    s += rx\n    i += 1\nprint()\nprint(s)`,
    astRules: [
      {
        id: 'ast_while_loop_11',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_11_t1',
        description: 'N = 3, числа [2.3, 4.7, 1.1] -> округленные: [2, 5, 1], сумма: 8',
        inputs: [3, 2.3, 4.7, 1.1],
        expectedValueDescription: '2, 5, 1 и сумма 8',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const hasSum = nums.includes(8);
          const hasRounds = nums.includes(2) && nums.includes(5) && nums.includes(1);
          const passed = hasSum || hasRounds;
          return {
            passed,
            details: passed
              ? 'Округленные значения и их сумма вычислены верно'
              : 'Ожидались округленные числа 2, 5, 1 и сумма 8',
            expected: '2 5 1 (сумма: 8)',
            actual: nums.join(' ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_11_t2',
        description: 'N = 4, числа [1.2, 3.8, 5.1, 2.9] -> округленные: [1, 4, 5, 3], сумма: 13',
        inputs: [4, 1.2, 3.8, 5.1, 2.9],
        expectedValueDescription: '1, 4, 5, 3 и сумма 13',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(13) || (nums.includes(1) && nums.includes(4) && nums.includes(5) && nums.includes(3));
          return {
            passed,
            details: passed ? 'Округленные значения и сумма вычислены верно' : 'Ожидалась сумма 13',
            expected: '1 4 5 3 (сумма: 13)',
            actual: nums.join(' ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '12',
    section: '3. Однопроходные алгоритмы цикла while',
    title: 'Дробные части положительных чисел и их произведение',
    condition: 'Дано целое число N и набор из N положительных вещественных чисел. Вывести в том же порядке дробные части всех чисел из данного набора (как вещественные числа с нулевой целой частью), а также произведение всех дробных частей. Решается без использования списков.',
    formulaDescription: 'В цикле while для каждого положительного числа вычисляется x - int(x), выводится и умножается',
    sampleCode: `# 12\nN = int(input())\ni = 0\nprod = 1.0\nwhile i < N:\n    x = float(input())\n    frac = round(x - int(x), 4)\n    print(frac, end=' ')\n    prod *= frac\n    i += 1\nprint()\nprint(round(prod, 4))`,
    astRules: [
      {
        id: 'ast_while_loop_12',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_12_t1',
        description: 'N = 3, числа [1.5, 2.25, 4.5] -> дробные части: 0.5, 0.25, 0.5; произведение = 0.0625',
        inputs: [3, 1.5, 2.25, 4.5],
        expectedValueDescription: '0.5, 0.25, 0.5 и произведение 0.0625',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const hasProd = nums.some((n) => Math.abs(n - 0.0625) < 0.01);
          const hasFracs = nums.some((n) => Math.abs(n - 0.5) < 0.01) && nums.some((n) => Math.abs(n - 0.25) < 0.01);
          const passed = hasProd || hasFracs;
          return {
            passed,
            details: passed
              ? 'Дробные части и их произведение 0.0625 вычислены верно'
              : 'Ожидались дробные части 0.5, 0.25, 0.5 и произведение 0.0625',
            expected: '0.5 0.25 0.5 (произведение: 0.0625)',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_12_t2',
        description: 'N = 2, числа [3.5, 7.5] -> дробные части: 0.5, 0.5; произведение = 0.25',
        inputs: [2, 3.5, 7.5],
        expectedValueDescription: '0.5, 0.5 и произведение 0.25',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.some((n) => Math.abs(n - 0.25) < 0.01) || nums.filter((n) => Math.abs(n - 0.5) < 0.01).length >= 2;
          return {
            passed,
            details: passed ? 'Дробные части и произведение 0.25 вычислены верно' : 'Ожидалось произведение 0.25',
            expected: '0.5 0.5 (произведение: 0.25)',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '13',
    section: '3. Однопроходные алгоритмы цикла while',
    title: 'Номера нечетных чисел набора и их количество K',
    condition: 'Дано целое число N и набор из N целых чисел. Вывести в том же порядке номера всех нечетных чисел из данного набора и количество K таких чисел. Решается без использования списков.',
    formulaDescription: 'В цикле while от 1 до N проверка x % 2 != 0, вывод индекса позиции и подсчет K',
    sampleCode: `# 13\nN = int(input())\ni = 1\nk = 0\nwhile i <= N:\n    x = int(input())\n    if x % 2 != 0:\n        print(i, end=' ')\n        k += 1\n    i += 1\nprint()\nprint(k)`,
    astRules: [
      {
        id: 'ast_while_loop_13',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_13_t1',
        description: 'N = 4, числа [8, 3, 5, 2] -> номера 2, 3 и количество K = 2',
        inputs: [4, 8, 3, 5, 2],
        expectedValueDescription: 'Номера 2, 3 и количество 2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2) && (nums.includes(3) || nums.length >= 2);
          return {
            passed,
            details: passed
              ? 'Номера нечетных чисел и их количество определены верно'
              : 'Ожидались номера 2, 3 и количество K = 2',
            expected: '2 3 (K = 2)',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_13_t2',
        description: 'N = 5, числа [1, 4, 6, 9, 11] -> номера 1, 4, 5 и количество K = 3',
        inputs: [5, 1, 4, 6, 9, 11],
        expectedValueDescription: 'Номера 1, 4, 5 и количество 3',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3) && (nums.includes(1) || nums.includes(4) || nums.includes(5));
          return {
            passed,
            details: passed ? 'Номера нечетных чисел 1, 4, 5 и K = 3 вычислены верно' : 'Ожидались номера 1, 4, 5 и количество 3',
            expected: '1 4 5 (K = 3)',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '14',
    section: '3. Однопроходные алгоритмы цикла while',
    title: 'Все различные элементы упорядоченного по возрастанию набора',
    condition: 'Дано целое число N и набор из N целых чисел, упорядоченный по возрастанию. Данный набор может содержать одинаковые элементы. Вывести в том же порядке все различные элементы данного набора. Решается без использования списков.',
    formulaDescription: 'Без использования списков: сравнение каждого элемента с предыдущим prev, вывод только при изменении',
    sampleCode: `# 14\nN = int(input())\ni = 0\nprev = None\nwhile i < N:\n    x = int(input())\n    if prev is None or x != prev:\n        print(x, end=' ')\n        prev = x\n    i += 1\nprint()`,
    astRules: [
      {
        id: 'ast_while_loop_14',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_14_t1',
        description: 'N = 6, набор [1, 1, 2, 3, 3, 5] -> различные: 1, 2, 3, 5',
        inputs: [6, 1, 1, 2, 3, 3, 5],
        expectedValueDescription: '1 2 3 5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1) && nums.includes(2) && nums.includes(3) && nums.includes(5);
          return {
            passed,
            details: passed
              ? 'Различные элементы упорядоченного набора (1, 2, 3, 5) найдены верно'
              : 'Ожидались различные элементы: 1 2 3 5',
            expected: '1 2 3 5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_14_t2',
        description: 'N = 5, набор [4, 4, 4, 7, 7] -> различные: 4, 7',
        inputs: [5, 4, 4, 4, 7, 7],
        expectedValueDescription: '4 7',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(4) && nums.includes(7);
          return {
            passed,
            details: passed ? 'Различные элементы 4 и 7 найдены верно' : 'Ожидались элементы 4 7',
            expected: '4 7',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '15',
    section: '3. Однопроходные алгоритмы цикла while',
    title: 'Сумма чисел между последними двумя нулями набора',
    condition: 'Дано целое число N и набор из N целых чисел, содержащий по крайней мере два нуля. Вывести сумму чисел из данного набора, расположенных между последними двумя нулями (если последние нули идут подряд, то вывести 0). Решается без использования списков.',
    formulaDescription: 'Без использования списков: отслеживание нулей и суммы между ними в цикле while',
    sampleCode: `# 15\nN = int(input())\ni = 0\nlast_sum = 0\ncurr_sum = 0\nzeros_count = 0\nwhile i < N:\n    x = int(input())\n    if x == 0:\n        zeros_count += 1\n        if zeros_count >= 2:\n            last_sum = curr_sum\n        curr_sum = 0\n    else:\n        if zeros_count >= 1:\n            curr_sum += x\n    i += 1\nprint(last_sum)`,
    astRules: [
      {
        id: 'ast_while_loop_15',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_15_t1',
        description: 'N = 5, набор [0, 3, 4, 0, 5] -> сумма между нулями: 3 + 4 = 7',
        inputs: [5, 0, 3, 4, 0, 5],
        expectedValueDescription: '7',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(7);
          return {
            passed,
            details: passed ? 'Сумма между последними нулями (7) вычислена верно' : 'Ожидалась сумма 7',
            expected: '7',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_15_t2',
        description: 'N = 6, набор [1, 0, 2, 3, 0, 0] -> последние нули идут подряд -> сумма 0',
        inputs: [6, 1, 0, 2, 3, 0, 0],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Для подряд идущих последних нулей верно выведен 0' : 'Ожидался вывод 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_15_t3',
        description: 'N = 7, набор [0, 10, 0, 5, 6, 0, 2] -> последние два нуля охватывают 5 + 6 = 11',
        inputs: [7, 0, 10, 0, 5, 6, 0, 2],
        expectedValueDescription: '11',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(11);
          return {
            passed,
            details: passed ? 'Сумма между последними двумя нулями (11) вычислена верно' : 'Ожидалась сумма 11',
            expected: '11',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },

  // ==========================================
  // ГРУППА 4. Вложенные циклы while (16 - 20)
  // ==========================================
  {
    id: '16',
    section: '4. Вложенные циклы while',
    title: 'Количество наборов из N элементов, содержащих число 2',
    condition: 'Даны целые числа K, N, а также K наборов целых чисел по N элементов в каждом наборе. Найти количество наборов, содержащих число 2. Если таких наборов нет, то вывести 0. Решается без использования списков.',
    formulaDescription: 'Внешний while по k от 0 до K, внутренний while по n от 0 до N, флаг наличия двойки в наборе',
    sampleCode: `# 16\nK = int(input())\nN = int(input())\ncount_sets = 0\nk_idx = 0\nwhile k_idx < K:\n    n_idx = 0\n    has_two = False\n    while n_idx < N:\n        val = int(input())\n        if val == 2:\n            has_two = True\n        n_idx += 1\n    if has_two:\n        count_sets += 1\n    k_idx += 1\nprint(count_sets)`,
    astRules: [
      {
        id: 'ast_while_loop_16',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_16_t1',
        description: 'K = 2, N = 3; набор 1: [1, 2, 3], набор 2: [4, 5, 6] -> 1 набор содержит 2',
        inputs: [2, 3, 1, 2, 3, 4, 5, 6],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Количество наборов с двойкой (1) вычислено верно' : 'Ожидалось число 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_16_t2',
        description: 'K = 3, N = 2; наборы [2, 7], [3, 2], [1, 9] -> 2 набора содержат 2',
        inputs: [3, 2, 2, 7, 3, 2, 1, 9],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Количество наборов с двойкой (2) вычислено верно' : 'Ожидалось число 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_16_t3',
        description: 'K = 2, N = 2; наборы [5, 8], [9, 3] -> нет двоек -> 0',
        inputs: [2, 2, 5, 8, 9, 3],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'При отсутствии двоек верно выведен 0' : 'Ожидалось число 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '17',
    section: '4. Вложенные циклы while',
    title: 'Номер последнего элемента, равного 2, для каждого набора',
    condition: 'Даны целые числа K, N, а также K наборов целых чисел по N элементов в каждом наборе. Для каждого набора вывести номер его последнего элемента, равного 2, или число 0, если в данном наборе нет двоек. Решается без использования списков.',
    formulaDescription: 'Вложенные циклы while: для каждого набора сохраняется номер (1..N) последней встреченной двойки',
    sampleCode: `# 17\nK = int(input())\nN = int(input())\nk_idx = 0\nwhile k_idx < K:\n    n_idx = 1\n    last_two = 0\n    while n_idx <= N:\n        val = int(input())\n        if val == 2:\n            last_two = n_idx\n        n_idx += 1\n    print(last_two)\n    k_idx += 1`,
    astRules: [
      {
        id: 'ast_while_loop_17',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_17_t1',
        description: 'K = 2, N = 4; набор 1: [2, 5, 2, 1] -> посл. 2 на поз. 3; набор 2: [1, 3, 4, 6] -> 0. Вывод: 3, 0',
        inputs: [2, 4, 2, 5, 2, 1, 1, 3, 4, 6],
        expectedValueDescription: '3 и 0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3) && nums.includes(0);
          return {
            passed,
            details: passed ? 'Номера последних двоек (3 и 0) найдены верно' : 'Ожидались числа 3 и 0',
            expected: '3 0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_17_t2',
        description: 'K = 2, N = 3; набор 1: [2, 1, 1] -> 1; набор 2: [2, 2, 2] -> 3. Вывод: 1, 3',
        inputs: [2, 3, 2, 1, 1, 2, 2, 2],
        expectedValueDescription: '1 и 3',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1) && nums.includes(3);
          return {
            passed,
            details: passed ? 'Номера последних двоек (1 и 3) найдены верно' : 'Ожидались числа 1 и 3',
            expected: '1 3',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '18',
    section: '4. Вложенные циклы while',
    title: 'Количество элементов в K наборах и общее количество (признак 0)',
    condition: 'Дано целое число K, а также K наборов ненулевых целых чисел. Признаком завершения каждого набора является число 0. Для каждого набора вывести количество его элементов. Вывести также общее количество элементов во всех наборах. Решается без использования списков.',
    formulaDescription: 'Внешний while по K наборам, внутренний while до нуля, подсчет длины каждого и суммарной длины',
    sampleCode: `# 18\nK = int(input())\ntotal_count = 0\nk_idx = 0\nwhile k_idx < K:\n    count_in_set = 0\n    val = int(input())\n    while val != 0:\n        count_in_set += 1\n        val = int(input())\n    print(count_in_set)\n    total_count += count_in_set\n    k_idx += 1\nprint(total_count)`,
    astRules: [
      {
        id: 'ast_while_loop_18',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_18_t1',
        description: 'K = 2; набор 1: [5, 7, 3, 0] (3 эл.), набор 2: [9, 2, 0] (2 эл.) -> 3, 2, общее 5',
        inputs: [2, 5, 7, 3, 0, 9, 2, 0],
        expectedValueDescription: '3, 2 и общее 5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(5) && (nums.includes(3) || nums.includes(2));
          return {
            passed,
            details: passed ? 'Количество элементов наборов (3, 2) и общее (5) вычислены верно' : 'Ожидались числа 3, 2 и общее 5',
            expected: '3 2 5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_18_t2',
        description: 'K = 3; наборы [1, 0] (1), [2, 3, 0] (2), [4, 5, 6, 0] (3) -> 1, 2, 3, общее 6',
        inputs: [3, 1, 0, 2, 3, 0, 4, 5, 6, 0],
        expectedValueDescription: '1, 2, 3 и общее 6',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(6) && nums.includes(1) && nums.includes(2) && nums.includes(3);
          return {
            passed,
            details: passed ? 'Количество элементов по наборам и общее (6) найдены верно' : 'Ожидались числа 1, 2, 3 и общее 6',
            expected: '1 2 3 6',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '19',
    section: '4. Вложенные циклы while',
    title: 'Количество наборов с возрастающими элементами (окончание 0)',
    condition: 'Дано целое число K, а также K наборов ненулевых целых чисел. Каждый набор содержит не менее двух элементов, признаком его завершения является число 0. Найти количество наборов, элементы которых возрастают. Решается без использования списков.',
    formulaDescription: 'Вложенные while: проверка строгого возрастания curr > prev в цикле до 0, подсчет возрастающих наборов',
    sampleCode: `# 19\nK = int(input())\nincreasing_sets = 0\nk_idx = 0\nwhile k_idx < K:\n    is_inc = True\n    prev = int(input())\n    curr = int(input())\n    while curr != 0:\n        if curr <= prev:\n            is_inc = False\n        prev = curr\n        curr = int(input())\n    if is_inc:\n        increasing_sets += 1\n    k_idx += 1\nprint(increasing_sets)`,
    astRules: [
      {
        id: 'ast_while_loop_19',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_19_t1',
        description: 'K = 2; набор 1: [1, 3, 5, 0] (возрастает), набор 2: [4, 2, 6, 0] (не возрастает) -> 1',
        inputs: [2, 1, 3, 5, 0, 4, 2, 6, 0],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Количество возрастающих наборов (1) вычислено верно' : 'Ожидалось число 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_19_t2',
        description: 'K = 3; наборы [2, 5, 8, 10, 0] (возрастает), [1, 4, 9, 0] (возрастает), [5, 5, 6, 0] (не строго) -> 2',
        inputs: [3, 2, 5, 8, 10, 0, 1, 4, 9, 0, 5, 5, 6, 0],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Количество возрастающих наборов (2) вычислено верно' : 'Ожидалось число 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_19_t3',
        description: 'K = 2; наборы [10, 8, 0], [5, 4, 3, 0] -> оба убывают -> 0',
        inputs: [2, 10, 8, 0, 5, 4, 3, 0],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'При отсутствии возрастающих наборов верно выведен 0' : 'Ожидалось число 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '20',
    section: '4. Вложенные циклы while',
    title: 'Анализ монотонности наборов: 1 (возрастает), -1 (убывает), 0 (иначе)',
    condition: 'Дано целое число K, а также K наборов ненулевых целых чисел. Каждый набор содержит не менее двух элементов, признаком его завершения является число 0. Для каждого набора выполнить следующее действие: если элементы набора возрастают, то вывести 1; если элементы набора убывают, то вывести –1; если элементы набора не возрастают и не убывают, то вывести 0. Решается без использования списков.',
    formulaDescription: 'Вложенные циклы while: флаги is_inc и is_dec для каждого набора, вывод 1, -1 или 0',
    sampleCode: `# 20\nK = int(input())\nk_idx = 0\nwhile k_idx < K:\n    is_inc = True\n    is_dec = True\n    prev = int(input())\n    curr = int(input())\n    while curr != 0:\n        if curr <= prev:\n            is_inc = False\n        if curr >= prev:\n            is_dec = False\n        prev = curr\n        curr = int(input())\n    if is_inc:\n        print(1)\n    elif is_dec:\n        print(-1)\n    else:\n        print(0)\n    k_idx += 1`,
    astRules: [
      {
        id: 'ast_while_loop_20',
        title: 'Использование цикла while',
        description: 'В решении задачи должен использоваться цикл while',
        checkType: 'require_while_loop',
      },
    ],
    testCases: [
      {
        id: '3_20_t1',
        description: 'K = 3; наборы [1, 3, 7, 0] (возр -> 1), [9, 5, 2, 0] (убыв -> -1), [1, 5, 3, 0] (иначе -> 0) -> 1, -1, 0',
        inputs: [3, 1, 3, 7, 0, 9, 5, 2, 0, 1, 5, 3, 0],
        expectedValueDescription: '1, -1, 0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1) && nums.includes(-1) && nums.includes(0);
          return {
            passed,
            details: passed
              ? 'Статусы монотонности наборов (1, -1, 0) вычислены верно'
              : 'Ожидались значения 1, -1, 0 для каждого набора',
            expected: '1 -1 0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '3_20_t2',
        description: 'K = 2; наборы [8, 4, 1, 0] (убыв -> -1), [2, 4, 6, 0] (возр -> 1) -> -1, 1',
        inputs: [2, 8, 4, 1, 0, 2, 4, 6, 0],
        expectedValueDescription: '-1 и 1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(-1) && nums.includes(1);
          return {
            passed,
            details: passed ? 'Статусы монотонности (-1 и 1) вычислены верно' : 'Ожидались значения -1 и 1',
            expected: '-1 1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
];

