import { LabTask } from '../types';
import { extractNumbers } from './lab1Tasks';

function cleanText(text: string): string {
  return text.trim().replace(/\r\n/g, '\n');
}

export const LAB5_TASKS: LabTask[] = [
  // ==========================================
  // РАЗДЕЛ 1. Обработка строк с помощью методов (1 - 7)
  // ==========================================
  {
    id: '1',
    section: '1. Обработка строк с помощью методов',
    title: 'Количество вхождений строки S0 в строку S',
    condition: 'Даны строки S и S0. Найти количество вхождений строки S0 в строку S.',
    formulaDescription: 'S.count(S0)',
    sampleCode: `# 1\nS = input()\nS0 = input()\nprint(S.count(S0))`,
    testCases: [
      {
        id: '5_1_t1',
        description: 'S = "abracadabra", S0 = "abra" -> 2',
        inputs: ['abracadabra', 'abra'],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Найдено 2 вхождения подстроки' : 'Ожидалось 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_1_t2',
        description: 'S = "hello world", S0 = "test" -> 0',
        inputs: ['hello world', 'test'],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Вхождений нет, выведено 0' : 'Ожидался 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_1_t3',
        description: 'S = "banana", S0 = "an" -> 2',
        inputs: ['banana', 'an'],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Найдено 2 вхождения' : 'Ожидалось 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '2',
    section: '1. Обработка строк с помощью методов',
    title: 'Удалить первое вхождение S0 из S',
    condition: 'Даны строки S и S0. Удалить из строки S первую подстроку, совпадающую с S0. Если совпадающих подстрок нет, то вывести строку S без изменений.',
    formulaDescription: 'S.replace(S0, "", 1)',
    sampleCode: `# 2\nS = input()\nS0 = input()\nprint(S.replace(S0, '', 1))`,
    testCases: [
      {
        id: '5_2_t1',
        description: 'S = "hello world", S0 = "world" -> "hello "',
        inputs: ['hello world', 'world'],
        expectedValueDescription: 'hello ',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('hello') && !t.includes('world');
          return {
            passed,
            details: passed ? 'Первое вхождение успешно удалено' : 'Ожидалась строка без world',
            expected: 'hello ',
            actual: t,
          };
        },
      },
      {
        id: '5_2_t2',
        description: 'S = "banana", S0 = "na" -> "bana"',
        inputs: ['banana', 'na'],
        expectedValueDescription: 'bana',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('bana');
          return {
            passed,
            details: passed ? 'Удалено только первое "na"' : 'Ожидалось "bana"',
            expected: 'bana',
            actual: t,
          };
        },
      },
      {
        id: '5_2_t3',
        description: 'S = "apple", S0 = "pear" -> "apple" (без изменений)',
        inputs: ['apple', 'pear'],
        expectedValueDescription: 'apple',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('apple');
          return {
            passed,
            details: passed ? 'Строка оставлена без изменений' : 'Ожидалось "apple"',
            expected: 'apple',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '3',
    section: '1. Обработка строк с помощью методов',
    title: 'Заменить последнее вхождение S1 на S2',
    condition: 'Даны строки S, S1 и S2. Заменить в строке S последнее вхождение строки S1 на строку S2.',
    formulaDescription: 'S[:pos] + S2 + S[pos+len(S1):]',
    sampleCode: `# 3\nS = input()\nS1 = input()\nS2 = input()\npos = S.rfind(S1)\nif pos != -1:\n    print(S[:pos] + S2 + S[pos+len(S1):])\nelse:\n    print(S)`,
    testCases: [
      {
        id: '5_3_t1',
        description: 'S = "one two one three", S1 = "one", S2 = "zero" -> "one two zero three"',
        inputs: ['one two one three', 'one', 'zero'],
        expectedValueDescription: 'one two zero three',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('one two zero three');
          return {
            passed,
            details: passed ? 'Последнее вхождение заменено' : 'Ожидалось "one two zero three"',
            expected: 'one two zero three',
            actual: t,
          };
        },
      },
      {
        id: '5_3_t2',
        description: 'S = "banana", S1 = "a", S2 = "o" -> "banano"',
        inputs: ['banana', 'a', 'o'],
        expectedValueDescription: 'banano',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('banano');
          return {
            passed,
            details: passed ? 'Последняя буква "a" заменена на "o"' : 'Ожидалось "banano"',
            expected: 'banano',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '4',
    section: '1. Обработка строк с помощью методов',
    title: 'Удвоить каждое вхождение символа C в строку S',
    condition: 'Дан символ C и строка S. Удвоить каждое вхождение символа C в строку S.',
    formulaDescription: 'S.replace(C, C + C)',
    sampleCode: `# 4\nC = input().strip()\nS = input()\nprint(S.replace(C, C + C))`,
    testCases: [
      {
        id: '5_4_t1',
        description: 'C = "a", S = "banana" -> "baanaanaa"',
        inputs: ['a', 'banana'],
        expectedValueDescription: 'baanaanaa',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('baanaanaa');
          return {
            passed,
            details: passed ? 'Символ "a" корректно удвоен' : 'Ожидалось "baanaanaa"',
            expected: 'baanaanaa',
            actual: t,
          };
        },
      },
      {
        id: '5_4_t2',
        description: 'C = "x", S = "hello" -> "hello"',
        inputs: ['x', 'hello'],
        expectedValueDescription: 'hello',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('hello');
          return {
            passed,
            details: passed ? 'Строка без изменений при отсутствии C' : 'Ожидалось "hello"',
            expected: 'hello',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '5',
    section: '1. Обработка строк с помощью методов',
    title: 'Вставить строку S0 перед каждым вхождением символа C',
    condition: 'Дан символ C и строки S, S0. Перед каждым вхождением символа C в строку S вставить строку S0.',
    formulaDescription: 'S.replace(C, S0 + C)',
    sampleCode: `# 5\nC = input().strip()\nS = input()\nS0 = input()\nprint(S.replace(C, S0 + C))`,
    testCases: [
      {
        id: '5_5_t1',
        description: 'C = "x", S = "axbxc", S0 = "123" -> "a123xb123xc"',
        inputs: ['x', 'axbxc', '123'],
        expectedValueDescription: 'a123xb123xc',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('a123xb123xc');
          return {
            passed,
            details: passed ? 'S0 успешно вставлена перед каждым C' : 'Ожидалось "a123xb123xc"',
            expected: 'a123xb123xc',
            actual: t,
          };
        },
      },
      {
        id: '5_5_t2',
        description: 'C = "a", S = "cat", S0 = "!" -> "c!at"',
        inputs: ['a', 'cat', '!'],
        expectedValueDescription: 'c!at',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('c!at');
          return {
            passed,
            details: passed ? 'Символ вставлен перед "a"' : 'Ожидалось "c!at"',
            expected: 'c!at',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '6',
    section: '1. Обработка строк с помощью методов',
    title: 'Преобразовать строку S в строку длины N',
    condition: 'Дано целое число N (> 0) и строка S. Преобразовать строку S в строку длины N следующим образом: если длина строки S больше N, то отбросить первые символы, если длина строки S меньше N, то в ее начало добавить символы «.» (точка).',
    formulaDescription: 'if len(S) > N: S[-N:] else: "." * (N - len(S)) + S',
    sampleCode: `# 6\nN = int(input())\nS = input()\nif len(S) > N:\n    print(S[-N:])\nelse:\n    print('.' * (N - len(S)) + S)`,
    testCases: [
      {
        id: '5_6_t1',
        description: 'N = 5, S = "abcdefgh" -> "defgh"',
        inputs: [5, 'abcdefgh'],
        expectedValueDescription: 'defgh',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('defgh');
          return {
            passed,
            details: passed ? 'Первые символы отброшены' : 'Ожидалось "defgh"',
            expected: 'defgh',
            actual: t,
          };
        },
      },
      {
        id: '5_6_t2',
        description: 'N = 7, S = "cat" -> "....cat"',
        inputs: [7, 'cat'],
        expectedValueDescription: '....cat',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('....cat');
          return {
            passed,
            details: passed ? 'Точки добавлены в начало' : 'Ожидалось "....cat"',
            expected: '....cat',
            actual: t,
          };
        },
      },
      {
        id: '5_6_t3',
        description: 'N = 4, S = "test" -> "test"',
        inputs: [4, 'test'],
        expectedValueDescription: 'test',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('test');
          return {
            passed,
            details: passed ? 'Длина совпадает, строка сохранена' : 'Ожидалось "test"',
            expected: 'test',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '7',
    section: '1. Обработка строк с помощью методов',
    title: 'Первые N1 символов S1 и последние N2 символов S2',
    condition: 'Даны целые положительные числа N1 и N2 и строки S1 и S2. Получить из этих строк новую строку, содержащую первые N1 символов строки S1 и последние N2 символов строки S2.',
    formulaDescription: 'S1[:N1] + S2[-N2:]',
    sampleCode: `# 7\nN1 = int(input())\nN2 = int(input())\nS1 = input()\nS2 = input()\nprint(S1[:N1] + S2[-N2:])`,
    testCases: [
      {
        id: '5_7_t1',
        description: 'N1 = 3, N2 = 4, S1 = "abcdef", S2 = "12345678" -> "abc5678"',
        inputs: [3, 4, 'abcdef', '12345678'],
        expectedValueDescription: 'abc5678',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('abc5678');
          return {
            passed,
            details: passed ? 'Склейка первых N1 и последних N2 верна' : 'Ожидалось "abc5678"',
            expected: 'abc5678',
            actual: t,
          };
        },
      },
      {
        id: '5_7_t2',
        description: 'N1 = 2, N2 = 2, S1 = "hello", S2 = "world" -> "held"',
        inputs: [2, 2, 'hello', 'world'],
        expectedValueDescription: 'held',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('held');
          return {
            passed,
            details: passed ? 'Корректно получено "held"' : 'Ожидалось "held"',
            expected: 'held',
            actual: t,
          };
        },
      },
    ],
  },

  // ==========================================
  // РАЗДЕЛ 2. Анализ и преобразование слов в строке (8 - 14)
  // ==========================================
  {
    id: '8',
    section: '2. Анализ и преобразование слов в строке',
    title: 'Удаление избыточных пробелов между словами',
    condition: 'Дана строка-предложение с избыточными пробелами между словами. Преобразовать ее так, чтобы между словами был ровно один пробел.',
    formulaDescription: '" ".join(S.split())',
    sampleCode: `# 8\nS = input()\nprint(' '.join(S.split()))`,
    testCases: [
      {
        id: '5_8_t1',
        description: '"  Hello    world   from    Python  " -> "Hello world from Python"',
        inputs: ['  Hello    world   from    Python  '],
        expectedValueDescription: 'Hello world from Python',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('Hello world from Python');
          return {
            passed,
            details: passed ? 'Избыточные пробелы удалены' : 'Ожидалось "Hello world from Python"',
            expected: 'Hello world from Python',
            actual: t,
          };
        },
      },
      {
        id: '5_8_t2',
        description: '"Привет   мир" -> "Привет мир"',
        inputs: ['Привет   мир'],
        expectedValueDescription: 'Привет мир',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('Привет мир');
          return {
            passed,
            details: passed ? 'Между словами остался один пробел' : 'Ожидалось "Привет мир"',
            expected: 'Привет мир',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '9',
    section: '2. Анализ и преобразование слов в строке',
    title: 'Количество русских слов в строке',
    condition: 'Дана строка, состоящая из русских слов, разделенных пробелами (одним или несколькими). Найти количество слов в строке.',
    formulaDescription: 'len(S.split())',
    sampleCode: `# 9\nS = input()\nprint(len(S.split()))`,
    testCases: [
      {
        id: '5_9_t1',
        description: '"Привет   мир   и   друзья" -> 4',
        inputs: ['Привет   мир   и   друзья'],
        expectedValueDescription: '4',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(4);
          return {
            passed,
            details: passed ? 'Подсчитано 4 слова' : 'Ожидалось 4',
            expected: '4',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_9_t2',
        description: '"ОдноСлово" -> 1',
        inputs: ['ОдноСлово'],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Подсчитано 1 слово' : 'Ожидалось 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '10',
    section: '2. Анализ и преобразование слов в строке',
    title: 'Количество слов с хотя бы одной буквой «А»',
    condition: 'Дана строка, состоящая из русских слов, набранных заглавными буквами и разделенных пробелами (одним или несколькими). Найти количество слов, которые содержат хотя бы одну букву «А».',
    formulaDescription: 'sum(1 for w in S.split() if "А" in w)',
    sampleCode: `# 10\nS = input()\nwords = S.split()\nprint(sum(1 for w in words if 'А' in w))`,
    testCases: [
      {
        id: '5_10_t1',
        description: '"МАМА МЫЛА РАМУ И ОКНО" -> 3',
        inputs: ['МАМА МЫЛА РАМУ И ОКНО'],
        expectedValueDescription: '3',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3);
          return {
            passed,
            details: passed ? 'Найдено 3 слова с буквой А' : 'Ожидалось 3',
            expected: '3',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_10_t2',
        description: '"ДОМ ЛЕС СОСНА" -> 1',
        inputs: ['ДОМ ЛЕС СОСНА'],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Найдено 1 слово (СОСНА)' : 'Ожидалось 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '11',
    section: '2. Анализ и преобразование слов в строке',
    title: 'Слова, начинающиеся и заканчивающиеся одной буквой',
    condition: 'Дана строка, состоящая из русских слов, набранных заглавными буквами и разделенных пробелами (одним или несколькими). Найти количество слов, которые начинаются и заканчиваются одной и той же буквой.',
    formulaDescription: 'sum(1 for w in S.split() if w[0] == w[-1])',
    sampleCode: `# 11\nS = input()\nwords = S.split()\nprint(sum(1 for w in words if w[0] == w[-1]))`,
    testCases: [
      {
        id: '5_11_t1',
        description: '"ТОПОТ ЗАКАЗ ДОМ ШАЛАШ ДЕД ЛЕС" -> 4',
        inputs: ['ТОПОТ ЗАКАЗ ДОМ ШАЛАШ ДЕД ЛЕС'],
        expectedValueDescription: '4',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(4);
          return {
            passed,
            details: passed ? 'Найдено 4 таких слова (ТОПОТ, ЗАКАЗ, ШАЛАШ, ДЕД)' : 'Ожидалось 4',
            expected: '4',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_11_t2',
        description: '"ОКНО ДВЕРЬ" -> 0',
        inputs: ['ОКНО ДВЕРЬ'],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Слов не найдено, выведено 0' : 'Ожидался 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '12',
    section: '2. Анализ и преобразование слов в строке',
    title: 'Длина самого короткого слова',
    condition: 'Дана строка, состоящая из русских слов, разделенных пробелами (одним или несколькими). Найти длину самого короткого слова.',
    formulaDescription: 'min(len(w) for w in S.split())',
    sampleCode: `# 12\nS = input()\nwords = S.split()\nprint(min(len(w) for w in words))`,
    testCases: [
      {
        id: '5_12_t1',
        description: '"быстрый бурый лис прыгает" -> 3 ("лис")',
        inputs: ['быстрый бурый лис прыгает'],
        expectedValueDescription: '3',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(3);
          return {
            passed,
            details: passed ? 'Длина самого короткого слова 3' : 'Ожидалось 3',
            expected: '3',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_12_t2',
        description: '"а бв где" -> 1',
        inputs: ['а бв где'],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Длина самого короткого слова 1' : 'Ожидалось 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '13',
    section: '2. Анализ и преобразование слов в строке',
    title: 'Замена повторов первой буквы слова на точку',
    condition: 'Дана строка, состоящая из русских слов, набранных заглавными буквами и разделенных пробелами (одним или несколькими). Преобразовать каждое слово в строке, заменив в нем все последующие вхождения его первой буквы на символ «.» (точка). Например, слово «МИНИМУМ» надо преобразовать в «МИНИ.У.». Количество пробелов между словами не изменять.',
    formulaDescription: 'Преобразование повторов первой буквы в каждом слове',
    sampleCode: `# 13\nS = input()\nres = []\nfor part in S.split(' '):\n    if part:\n        ch = part[0]\n        new_w = ch + part[1:].replace(ch, '.')\n        res.append(new_w)\n    else:\n        res.append('')\nprint(' '.join(res))`,
    testCases: [
      {
        id: '5_13_t1',
        description: '"МИНИМУМ" -> "МИНИ.У."',
        inputs: ['МИНИМУМ'],
        expectedValueDescription: 'МИНИ.У.',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('МИНИ.У.');
          return {
            passed,
            details: passed ? 'Слово МИНИМУМ корректно заменено на МИНИ.У.' : 'Ожидалось "МИНИ.У."',
            expected: 'МИНИ.У.',
            actual: t,
          };
        },
      },
      {
        id: '5_13_t2',
        description: '"ТАКТ КОЛОКОЛ" -> "ТАК. КОЛО.О."',
        inputs: ['ТАКТ КОЛОКОЛ'],
        expectedValueDescription: 'ТАК. КОЛО.О.',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('ТАК.') && t.includes('КОЛО.О.');
          return {
            passed,
            details: passed ? 'Повторы первых букв заменены на точки' : 'Ожидалось "ТАК. КОЛО.О."',
            expected: 'ТАК. КОЛО.О.',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '14',
    section: '2. Анализ и преобразование слов в строке',
    title: 'Слова в алфавитном порядке через один пробел',
    condition: 'Дана строка, состоящая из русских слов, набранных заглавными буквами и разделенных пробелами (одним или несколькими). Вывести строку, содержащую эти же слова, разделенные одним пробелом и расположенные в алфавитном порядке.',
    formulaDescription: '" ".join(sorted(S.split()))',
    sampleCode: `# 14\nS = input()\nprint(' '.join(sorted(S.split())))`,
    testCases: [
      {
        id: '5_14_t1',
        description: '"ЯБЛОКО АРБУЗ БАНАН ВИНОГРАД" -> "АРБУЗ БАНАН ВИНОГРАД ЯБЛОКО"',
        inputs: ['ЯБЛОКО АРБУЗ БАНАН ВИНОГРАД'],
        expectedValueDescription: 'АРБУЗ БАНАН ВИНОГРАД ЯБЛОКО',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('АРБУЗ БАНАН ВИНОГРАД ЯБЛОКО');
          return {
            passed,
            details: passed ? 'Слова упорядочены по алфавиту' : 'Ожидался алфавитный порядок',
            expected: 'АРБУЗ БАНАН ВИНОГРАД ЯБЛОКО',
            actual: t,
          };
        },
      },
      {
        id: '5_14_t2',
        description: '"ДЕЛЬФИН АИСТ ВОРОНА" -> "АИСТ ВОРОНА ДЕЛЬФИН"',
        inputs: ['ДЕЛЬФИН АИСТ ВОРОНА'],
        expectedValueDescription: 'АИСТ ВОРОНА ДЕЛЬФИН',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('АИСТ ВОРОНА ДЕЛЬФИН');
          return {
            passed,
            details: passed ? 'Слова отсортированы корректно' : 'Ожидалось "АИСТ ВОРОНА ДЕЛЬФИН"',
            expected: 'АИСТ ВОРОНА ДЕЛЬФИН',
            actual: t,
          };
        },
      },
    ],
  },

  // ==========================================
  // РАЗДЕЛ 3. Другие задания на обработку строк (15 - 23)
  // ==========================================
  {
    id: '15',
    section: '3. Другие задания на обработку строк',
    title: 'Вычисление арифметического выражения цифр с + и –',
    condition: 'Дана строка, изображающая арифметическое выражение вида «<цифра>±<цифра>±…±<цифра>», где на месте знака операции «±» находится символ «+» или «–» (например, «4+7–2–8»). Вывести значение данного выражения (целое число).',
    formulaDescription: 'eval(expression)',
    sampleCode: `# 15\nS = input().replace('–', '-').replace('—', '-')\nprint(eval(S))`,
    testCases: [
      {
        id: '5_15_t1',
        description: '"4+7-2-8" -> 1',
        inputs: ['4+7-2-8'],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Выражение 4+7-2-8 вычислено верно (1)' : 'Ожидался результат 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_15_t2',
        description: '"9-3+4" -> 10',
        inputs: ['9-3+4'],
        expectedValueDescription: '10',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(10);
          return {
            passed,
            details: passed ? 'Выражение 9-3+4 = 10' : 'Ожидалось 10',
            expected: '10',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_15_t3',
        description: '"5" -> 5',
        inputs: ['5'],
        expectedValueDescription: '5',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(5);
          return {
            passed,
            details: passed ? 'Одиночное число 5' : 'Ожидалось 5',
            expected: '5',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '16',
    section: '3. Другие задания на обработку строк',
    title: 'Определение типа символа (digit / lat / rus)',
    condition: 'Дан символ C, изображающий цифру или букву (латинскую или русскую). Если C изображает цифру, то вывести строку «digit», если латинскую букву — вывести строку «lat», если русскую — вывести строку «rus».',
    formulaDescription: 'digit / lat / rus',
    sampleCode: `# 16\nC = input().strip()\nif C.isdigit():\n    print('digit')\nelif ('a' <= C <= 'z') or ('A' <= C <= 'Z'):\n    print('lat')\nelse:\n    print('rus')`,
    testCases: [
      {
        id: '5_16_t1',
        description: 'C = "7" -> "digit"',
        inputs: ['7'],
        expectedValueDescription: 'digit',
        validator: (stdout) => {
          const t = cleanText(stdout).toLowerCase();
          const passed = t.includes('digit');
          return {
            passed,
            details: passed ? 'Цифра определена как digit' : 'Ожидалось "digit"',
            expected: 'digit',
            actual: t,
          };
        },
      },
      {
        id: '5_16_t2',
        description: 'C = "w" -> "lat"',
        inputs: ['w'],
        expectedValueDescription: 'lat',
        validator: (stdout) => {
          const t = cleanText(stdout).toLowerCase();
          const passed = t.includes('lat');
          return {
            passed,
            details: passed ? 'Латинская буква определена как lat' : 'Ожидалось "lat"',
            expected: 'lat',
            actual: t,
          };
        },
      },
      {
        id: '5_16_t3',
        description: 'C = "Я" -> "rus"',
        inputs: ['Я'],
        expectedValueDescription: 'rus',
        validator: (stdout) => {
          const t = cleanText(stdout).toLowerCase();
          const passed = t.includes('rus');
          return {
            passed,
            details: passed ? 'Русская буква определена как rus' : 'Ожидалось "rus"',
            expected: 'rus',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '17',
    section: '3. Другие задания на обработку строк',
    title: 'Тип числа в строке (1 - целое, 2 - вещественное, 0 - не число)',
    condition: 'Дана строка. Если она представляет собой запись целого числа, то вывести 1, если вещественного (с дробной частью) — вывести 2; если строку нельзя преобразовать в число, то вывести 0. Считать, что дробная часть вещественного числа отделяется от его целой части десятичной точкой «.».',
    formulaDescription: '1 (int) / 2 (float) / 0 (не число)',
    sampleCode: `# 17\nS = input().strip()\ntry:\n    val = int(S)\n    print(1)\nexcept ValueError:\n    try:\n        val = float(S)\n        if '.' in S:\n            print(2)\n        else:\n            print(1)\n    except ValueError:\n        print(0)`,
    testCases: [
      {
        id: '5_17_t1',
        description: '"123" -> 1',
        inputs: ['123'],
        expectedValueDescription: '1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(1);
          return {
            passed,
            details: passed ? 'Целое число определено как 1' : 'Ожидалась 1',
            expected: '1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_17_t2',
        description: '"3.14" -> 2',
        inputs: ['3.14'],
        expectedValueDescription: '2',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(2);
          return {
            passed,
            details: passed ? 'Вещественное число определено как 2' : 'Ожидалась 2',
            expected: '2',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_17_t3',
        description: '"abc12" -> 0',
        inputs: ['abc12'],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Некорректная строка определена как 0' : 'Ожидался 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
  {
    id: '18',
    section: '3. Другие задания на обработку строк',
    title: 'Шифрование со смещением на 1 букву (буква «ё» не учитывается)',
    condition: 'Дана строка-предложение на русском языке. Зашифровать ее, выполнив циклическую замену каждой буквы на следующую за ней в алфавите и сохранив при этом регистр букв («А» перейдет в «Б», «а» — в «б», «Б» — в «В», «я» — в «а» и т. д.). Букву «ё» в алфавите не учитывать («е» должна переходить в «ж»). Знаки препинания и пробелы не изменять.',
    formulaDescription: 'Циклический сдвиг на +1 в 32-буквенном русском алфавите',
    sampleCode: `# 18\nS = input()\nup = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"\nlo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"\nres = []\nfor ch in S:\n    if ch in up:\n        res.append(up[(up.index(ch) + 1) % len(up)])\n    elif ch in lo:\n        res.append(lo[(lo.index(ch) + 1) % len(lo)])\n    else:\n        res.append(ch)\nprint(''.join(res))`,
    testCases: [
      {
        id: '5_18_t1',
        description: '"Привет, мир!" -> "Рсйгжу, нйс!"',
        inputs: ['Привет, мир!'],
        expectedValueDescription: 'Рсйгжу, нйс!',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('Рсйгжу, нйс!') || t.includes('рсйгжу');
          return {
            passed,
            details: passed ? 'Шифрование на +1 выполнено корректно' : 'Ожидалось "Рсйгжу, нйс!"',
            expected: 'Рсйгжу, нйс!',
            actual: t,
          };
        },
      },
      {
        id: '5_18_t2',
        description: '"Яблоко" -> "Авмплп"',
        inputs: ['Яблоко'],
        expectedValueDescription: 'Авмплп',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('Авмплп') || t.includes('авмплп');
          return {
            passed,
            details: passed ? 'Циклический переход Я -> А выполнен верно' : 'Ожидалось "Авмплп"',
            expected: 'Авмплп',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '19',
    section: '3. Другие задания на обработку строк',
    title: 'Шифрование со смещением K букв',
    condition: 'Дана строка-предложение на русском языке и число K (0 < K < 10). Зашифровать строку, выполнив циклическую замену каждой буквы на букву того же регистра, расположенную в алфавите на K-й позиции после шифруемой буквы. Букву «ё» в алфавите не учитывать, знаки препинания и пробелы не изменять.',
    formulaDescription: 'Циклический сдвиг на +K в алфавите',
    sampleCode: `# 19\nS = input()\nK = int(input())\nup = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"\nlo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"\nres = []\nfor ch in S:\n    if ch in up:\n        res.append(up[(up.index(ch) + K) % len(up)])\n    elif ch in lo:\n        res.append(lo[(lo.index(ch) + K) % len(lo)])\n    else:\n        res.append(ch)\nprint(''.join(res))`,
    testCases: [
      {
        id: '5_19_t1',
        description: 'S = "Привет!", K = 2 -> "Сткдзф!"',
        inputs: ['Привет!', 2],
        expectedValueDescription: 'Сткдзф!',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('Сткдзф!') || t.includes('сткдзф');
          return {
            passed,
            details: passed ? 'Шифрование со сдвигом K=2 верно' : 'Ожидалось "Сткдзф!"',
            expected: 'Сткдзф!',
            actual: t,
          };
        },
      },
      {
        id: '5_19_t2',
        description: 'S = "Юля", K = 3 -> "Авг"',
        inputs: ['Юля', 3],
        expectedValueDescription: 'Авг',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('Авг') || t.includes('авг');
          return {
            passed,
            details: passed ? 'Сдвиг с переходом через конец алфавита выполнен верно' : 'Ожидалось "Авг"',
            expected: 'Авг',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '20',
    section: '3. Другие задания на обработку строк',
    title: 'Дешифрование предложения со смещением K',
    condition: 'Дано зашифрованное предложение на русском языке (способ шифрования описан в предыдущем задании) и кодовое смещение K (0 < K < 10). Расшифровать предложение.',
    formulaDescription: 'Циклический сдвиг на -K в алфавите',
    sampleCode: `# 20\nS = input()\nK = int(input())\nup = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"\nlo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"\nres = []\nfor ch in S:\n    if ch in up:\n        res.append(up[(up.index(ch) - K) % len(up)])\n    elif ch in lo:\n        res.append(lo[(lo.index(ch) - K) % len(lo)])\n    else:\n        res.append(ch)\nprint(''.join(res))`,
    testCases: [
      {
        id: '5_20_t1',
        description: 'S = "Сткдзф!", K = 2 -> "Привет!"',
        inputs: ['Сткдзф!', 2],
        expectedValueDescription: 'Привет!',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('Привет!') || t.includes('привет');
          return {
            passed,
            details: passed ? 'Строка успешно расшифрована как "Привет!"' : 'Ожидалось "Привет!"',
            expected: 'Привет!',
            actual: t,
          };
        },
      },
      {
        id: '5_20_t2',
        description: 'S = "Авг", K = 3 -> "Юля"',
        inputs: ['Авг', 3],
        expectedValueDescription: 'Юля',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('Юля') || t.includes('юля');
          return {
            passed,
            details: passed ? 'Расшифровка с переходом через край алфавита верна' : 'Ожидалось "Юля"',
            expected: 'Юля',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '21',
    section: '3. Другие задания на обработку строк',
    title: 'Выделение имени файла из полного пути (без расширения)',
    condition: 'Дана строка, содержащая полное имя файла, то есть имя диска, список каталогов (путь), собственно имя и расширение. Выделить из этой строки имя файла (без расширения).',
    formulaDescription: 'os.path.splitext(os.path.basename(path))[0]',
    sampleCode: `# 21\nS = input().strip()\n# разбиваем по слешам\nname_with_ext = S.replace('\\\\', '/').split('/')[-1]\nname_only = name_with_ext.rsplit('.', 1)[0]\nprint(name_only)`,
    testCases: [
      {
        id: '5_21_t1',
        description: '"C:\\\\Users\\\\Student\\\\Documents\\\\lab5.py" -> "lab5"',
        inputs: ['C:\\Users\\Student\\Documents\\lab5.py'],
        expectedValueDescription: 'lab5',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('lab5') && !t.includes('lab5.py');
          return {
            passed,
            details: passed ? 'Имя файла выделено без расширения' : 'Ожидалось "lab5"',
            expected: 'lab5',
            actual: t,
          };
        },
      },
      {
        id: '5_21_t2',
        description: '"/home/user/project/report.docx" -> "report"',
        inputs: ['/home/user/project/report.docx'],
        expectedValueDescription: 'report',
        validator: (stdout) => {
          const t = cleanText(stdout);
          const passed = t.includes('report') && !t.includes('report.docx');
          return {
            passed,
            details: passed ? 'Имя файла выделено корректно' : 'Ожидалось "report"',
            expected: 'report',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '22',
    section: '3. Другие задания на обработку строк',
    title: 'Выделение расширения файла из полного пути (без точки)',
    condition: 'Дана строка, содержащая полное имя файла, то есть имя диска, список каталогов (путь), собственно имя и расширение. Выделить из этой строки расширение файла (без предшествующей точки).',
    formulaDescription: 'S.rsplit(".", 1)[-1]',
    sampleCode: `# 22\nS = input().strip()\nprint(S.rsplit('.', 1)[-1])`,
    testCases: [
      {
        id: '5_22_t1',
        description: '"C:\\\\Users\\\\Student\\\\Documents\\\\lab5.py" -> "py"',
        inputs: ['C:\\Users\\Student\\Documents\\lab5.py'],
        expectedValueDescription: 'py',
        validator: (stdout) => {
          const t = cleanText(stdout).toLowerCase();
          const passed = t.includes('py') && !t.includes('.py');
          return {
            passed,
            details: passed ? 'Расширение "py" выделено без точки' : 'Ожидалось "py"',
            expected: 'py',
            actual: t,
          };
        },
      },
      {
        id: '5_22_t2',
        description: '"archive.tar.gz" -> "gz"',
        inputs: ['archive.tar.gz'],
        expectedValueDescription: 'gz',
        validator: (stdout) => {
          const t = cleanText(stdout).toLowerCase();
          const passed = t.includes('gz');
          return {
            passed,
            details: passed ? 'Расширение выделено верно' : 'Ожидалось "gz"',
            expected: 'gz',
            actual: t,
          };
        },
      },
    ],
  },
  {
    id: '23',
    section: '3. Другие задания на обработку строк',
    title: 'Проверка правильности расстановки скобок (), [], {}',
    condition: 'Дана строка, содержащая латинские буквы и скобки трех видов: «()», «[]», «{}». Если скобки расставлены правильно (то есть каждой открывающей соответствует закрывающая скобка того же вида), то вывести число 0. В противном случае вывести или номер позиции, в которой расположена первая ошибочная скобка, или, если закрывающих скобок не хватает, число –1.',
    formulaDescription: 'Стековый алгоритм проверки скобок (0 - верно, -1 - не хватает закрывающих, иначе индекс ошибки)',
    sampleCode: `# 23\nS = input()\nstack = []\nmatching = {')': '(', ']': '[', '}': '{'}\nerr = None\nfor idx, ch in enumerate(S, 1):\n    if ch in '([{':\n        stack.append((ch, idx))\n    elif ch in ')]}':\n        if not stack or stack[-1][0] != matching[ch]:\n            err = idx\n            break\n        stack.pop()\nif err is not None:\n    print(err)\nelif stack:\n    print(-1)\nelse:\n    print(0)`,
    testCases: [
      {
        id: '5_23_t1',
        description: '"(a+[b*c]-{d/e})" -> 0 (правильная расстановка)',
        inputs: ['(a+[b*c]-{d/e})'],
        expectedValueDescription: '0',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(0);
          return {
            passed,
            details: passed ? 'Скобки расставлены верно (0)' : 'Ожидался 0',
            expected: '0',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_23_t2',
        description: '"(a+[b*c)" -> -1 (не хватает закрывающей)',
        inputs: ['(a+[b*c)'],
        expectedValueDescription: '-1',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(-1);
          return {
            passed,
            details: passed ? 'Обнаружена нехватка закрывающей скобки (-1)' : 'Ожидалось -1',
            expected: '-1',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
      {
        id: '5_23_t3',
        description: '"(a+[b*c})" -> ошибочная скобка на позиции 9 (или 8 при 0-based)',
        inputs: ['(a+[b*c})'],
        expectedValueDescription: '9 или 8',
        validator: (stdout) => {
          const nums = extractNumbers(stdout);
          const passed = nums.includes(9) || nums.includes(8);
          return {
            passed,
            details: passed ? 'Ошибочная закрывающая скобка найдена' : 'Ожидался номер позиции (9 или 8)',
            expected: '9',
            actual: nums.join(', ') || stdout.trim(),
          };
        },
      },
    ],
  },
];
