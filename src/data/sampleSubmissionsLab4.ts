import { SampleStudentFile } from './sampleSubmissions';

export const SAMPLE_SUBMISSIONS_LAB4: SampleStudentFile[] = [
  {
    fileName: 'Михаил Романов 1553012 assignsubmission file ТРИС 1 26 Романов ЛР4.py',
    studentName: 'Михаил Романов',
    groupName: 'ТРИС 1 26',
    description: 'Отличное решение всех 25 основных заданий лабораторной работы №4 (строки, срезы, ord/chr)',
    code: `# ТРИС 1 26 Михаил Романов
# Лабораторная работа №4: Базовые типы данных – строки

# 1
C = input().strip()
print(ord(C[0]))

# 2
N = int(input())
for i in range(N):
    print(chr(ord('z') - i), end='')
print()

# 3
c = input().strip()[0]
print(chr(ord(c) - 1), chr(ord(c) + 1))

# 4
N = int(input())
C = input().strip()[0]
print(C * N)

# 5
S = input().strip()
print(' '.join(S))

# 6
S = input().strip()
N = int(input())
print(('*' * N).join(S))

# 7
S = input().strip()
print(ord(S[0]), ord(S[-1]))

# 8
S = input().strip()
print(S[::-1])

# 9
S = input().strip()
copy_s = S[:]
print(copy_s)

# 10
S = input().strip()
print(S[4])

# 11
S = input().strip()
print(S[-1])

# 12
S = input().strip()
print(S[:5])

# 13
S = input().strip()
print(S[-5:])

# 14
S = input().strip()
print(S[3:8])

# 15
S = input().strip()
print(S[-8:-3])

# 16
S = input().strip()
print(S[::2])

# 17
S = input().strip()
print(S[::-2])

# 18
S = input().strip()
print(S[-4:-9:-1])

# 19
S = input().strip()
print(sum(1 for c in S if c.isdigit()))

# 20
S = input().strip()
print(sum(1 for c in S if 'A' <= c <= 'Z'))

# 21
S = input().strip()
print(''.join(c.lower() if 'A' <= c <= 'Z' else c for c in S))

# 22
S = input().strip()
print(S.swapcase())

# 23
S = input().strip()
print(sum(int(c) for c in S if c.isdigit()))

# 24
S = input().strip()
s = 0
for ch in S:
    if ch.isdigit():
        s += int(ch)
print(s)

# 25
S = input().strip()
print(str(int(S, 2)))
`,
  },
  {
    fileName: 'Алина Соколова 1553140 assignsubmission file ПИ 4 26 Соколова ЛБ4.py',
    studentName: 'Алина Соколова',
    groupName: 'ПИ 4 26',
    description: 'Хорошая работа, допущены мелкие ошибки в индексах срезов (задания 14, 18, 22)',
    code: `# ПИ 4 26 Алина Соколова
# Лабораторная работа 4: Строки

# 1
c = input().strip()
print(ord(c[0]))

# 2
n = int(input())
res = [chr(ord('z') - i) for i in range(n)]
print(''.join(res))

# 3
c = input().strip()
print(chr(ord(c) - 1), chr(ord(c) + 1))

# 4
n = int(input())
c = input().strip()
print(c * n)

# 5
s = input().strip()
print(' '.join(list(s)))

# 6
s = input().strip()
n = int(input())
stars = '*' * n
print(stars.join(s))

# 7
s = input().strip()
print(ord(s[0]), ord(s[-1]))

# 8
s = input().strip()
print(s[::-1])

# 9
s = input().strip()
print(s[:])

# 10
s = input().strip()
print(s[4])

# 11
s = input().strip()
print(s[-1])

# 12
s = input().strip()
print(s[:5])

# 13
s = input().strip()
print(s[-5:])

# 14
# Ошибка: неверный конец диапазона
s = input().strip()
print(s[3:4])

# 15
s = input().strip()
print(s[-8:-3])

# 16
s = input().strip()
print(s[::2])

# 17
s = input().strip()
print(s[::-2])

# 18
# Ошибка: пропущен шаг -1
s = input().strip()
print(s[-4:-9])

# 19
s = input().strip()
print(len([c for c in s if c.isdigit()]))

# 20
s = input().strip()
print(sum(1 for c in s if c.isupper() and c.isascii()))

# 21
s = input().strip()
print(s.lower())

# 22
# Ошибка: применила только upper вместо swapcase
s = input().strip()
print(s.upper())

# 23
s = input().strip()
print(sum(int(x) for x in s if x.isdigit()))

# 24
s = input().strip()
print(sum(int(x) for x in s if x.isdigit()))

# 25
s = input().strip()
print(int(s, 2))
`,
  },
  {
    fileName: 'Денис Кузнецов 1553255 assignsubmission file ТРП 1 26 Кузнецов ЛР4.py',
    studentName: 'Денис Кузнецов',
    groupName: 'ТРП 1 26',
    description: 'Работа выполнена частично, пропущены срезы от конца строки и двоичный перевод',
    code: `# ТРП 1 26 Кузнецов Денис
# Лаб 4: Строки

# 1
print(ord(input().strip()[0]))

# 2
N = int(input())
for i in range(N):
    print(chr(122 - i), end='')
print()

# 3
c = input().strip()[0]
print(chr(ord(c) - 1), chr(ord(c) + 1))

# 4
N = int(input())
c = input().strip()
print(c * N)

# 5
s = input().strip()
print(' '.join(s))

# 6
s = input().strip()
n = int(input())
print(('*' * n).join(s))

# 7
s = input().strip()
print(ord(s[0]), ord(s[-1]))

# 8
s = input().strip()
print(s[::-1])

# 9
s = input().strip()
print(s[:])

# 10
s = input().strip()
print(s[4])

# 11
s = input().strip()
print(s[-1])

# 12
s = input().strip()
print(s[:5])

# 13
s = input().strip()
print(s[-5:])

# 19
s = input().strip()
print(sum(1 for x in s if x.isdigit()))

# 20
s = input().strip()
print(sum(1 for x in s if x in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'))

# 21
s = input().strip()
print(''.join(x.lower() if x in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' else x for x in s))

# 23
s = input().strip()
print(sum(int(x) for x in s))
`,
  },
];
