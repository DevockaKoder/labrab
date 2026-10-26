import { SampleStudentFile } from './sampleSubmissions';

export const SAMPLE_SUBMISSIONS_LAB5: SampleStudentFile[] = [
  {
    fileName: 'Александр Смирнов 1554101 assignsubmission file ТРИС 1 26 Смирнов ЛР5.py',
    studentName: 'Александр Смирнов',
    groupName: 'ТРИС 1 26',
    description: 'Полное решение всех 23 основных заданий лабораторной работы №5 (методы строк)',
    code: `# ТРИС 1 26 Александр Смирнов
# Лабораторная работа №5: Методы строк

# 1
S = input()
S0 = input()
print(S.count(S0))

# 2
S = input()
S0 = input()
print(S.replace(S0, '', 1))

# 3
S = input()
S1 = input()
S2 = input()
pos = S.rfind(S1)
if pos != -1:
    print(S[:pos] + S2 + S[pos+len(S1):])
else:
    print(S)

# 4
C = input().strip()
S = input()
print(S.replace(C, C + C))

# 5
C = input().strip()
S = input()
S0 = input()
print(S.replace(C, S0 + C))

# 6
N = int(input())
S = input()
if len(S) > N:
    print(S[-N:])
else:
    print('.' * (N - len(S)) + S)

# 7
N1 = int(input())
N2 = int(input())
S1 = input()
S2 = input()
print(S1[:N1] + S2[-N2:])

# 8
S = input()
print(' '.join(S.split()))

# 9
S = input()
print(len(S.split()))

# 10
S = input()
words = S.split()
print(sum(1 for w in words if 'А' in w))

# 11
S = input()
words = S.split()
print(sum(1 for w in words if w[0] == w[-1]))

# 12
S = input()
words = S.split()
print(min(len(w) for w in words))

# 13
S = input()
parts = S.split(' ')
res = []
for p in parts:
    if p:
        first = p[0]
        res.append(first + p[1:].replace(first, '.'))
    else:
        res.append('')
print(' '.join(res))

# 14
S = input()
print(' '.join(sorted(S.split())))

# 15
S = input().replace('–', '-').replace('—', '-')
print(eval(S))

# 16
C = input().strip()
if C.isdigit():
    print('digit')
elif ('a' <= C <= 'z') or ('A' <= C <= 'Z'):
    print('lat')
else:
    print('rus')

# 17
S = input().strip()
try:
    int(S)
    print(1)
except ValueError:
    try:
        float(S)
        if '.' in S:
            print(2)
        else:
            print(1)
    except ValueError:
        print(0)

# 18
S = input()
up = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
lo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
res = []
for ch in S:
    if ch in up:
        res.append(up[(up.index(ch) + 1) % len(up)])
    elif ch in lo:
        res.append(lo[(lo.index(ch) + 1) % len(lo)])
    else:
        res.append(ch)
print(''.join(res))

# 19
S = input()
K = int(input())
up = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
lo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
res = []
for ch in S:
    if ch in up:
        res.append(up[(up.index(ch) + K) % len(up)])
    elif ch in lo:
        res.append(lo[(lo.index(ch) + K) % len(lo)])
    else:
        res.append(ch)
print(''.join(res))

# 20
S = input()
K = int(input())
up = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
lo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
res = []
for ch in S:
    if ch in up:
        res.append(up[(up.index(ch) - K) % len(up)])
    elif ch in lo:
        res.append(lo[(lo.index(ch) - K) % len(lo)])
    else:
        res.append(ch)
print(''.join(res))

# 21
S = input().strip().replace('\\\\', '/')
filename = S.split('/')[-1]
print(filename.rsplit('.', 1)[0])

# 22
S = input().strip()
print(S.rsplit('.', 1)[-1])

# 23
S = input()
stack = []
pair = {')': '(', ']': '[', '}': '{'}
err = None
for i, ch in enumerate(S, 1):
    if ch in '([{':
        stack.append((ch, i))
    elif ch in ')]}':
        if not stack or stack[-1][0] != pair[ch]:
            err = i
            break
        stack.pop()
if err is not None:
    print(err)
elif stack:
    print(-1)
else:
    print(0)
`,
  },
  {
    fileName: 'Дарья Васильева 1554102 assignsubmission file ПИ 4 26 Васильева ЛР5.py',
    studentName: 'Дарья Васильева',
    groupName: 'ПИ 4 26',
    description: 'Хорошее решение, но не реализованы задания 20 и 23',
    code: `# ПИ 4 26 Дарья Васильева
# Лабораторная работа №5: Методы строк

# 1
S = input()
S0 = input()
print(S.count(S0))

# 2
S = input()
S0 = input()
print(S.replace(S0, '', 1))

# 3
S = input()
S1 = input()
S2 = input()
p = S.rfind(S1)
if p != -1:
    print(S[:p] + S2 + S[p+len(S1):])
else:
    print(S)

# 4
C = input().strip()
S = input()
print(S.replace(C, C * 2))

# 5
C = input().strip()
S = input()
S0 = input()
print(S.replace(C, S0 + C))

# 6
N = int(input())
S = input()
if len(S) > N:
    print(S[-N:])
else:
    print('.' * (N - len(S)) + S)

# 7
N1 = int(input())
N2 = int(input())
S1 = input()
S2 = input()
print(S1[:N1] + S2[-N2:])

# 8
S = input()
print(' '.join(S.split()))

# 9
S = input()
print(len(S.split()))

# 10
S = input()
print(sum(1 for word in S.split() if 'А' in word))

# 11
S = input()
print(sum(1 for w in S.split() if w[0] == w[-1]))

# 12
S = input()
print(min(len(w) for w in S.split()))

# 13
S = input()
res = []
for word in S.split(' '):
    if word:
        res.append(word[0] + word[1:].replace(word[0], '.'))
    else:
        res.append('')
print(' '.join(res))

# 14
S = input()
print(' '.join(sorted(S.split())))

# 15
S = input().replace('–', '-')
print(eval(S))

# 16
C = input().strip()
if C.isdigit():
    print('digit')
elif ('a' <= C <= 'z') or ('A' <= C <= 'Z'):
    print('lat')
else:
    print('rus')

# 17
S = input().strip()
if S.isdigit() or (S.startswith('-') and S[1:].isdigit()):
    print(1)
elif '.' in S:
    print(2)
else:
    print(0)

# 18
S = input()
alpha_up = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
alpha_lo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
out = []
for c in S:
    if c in alpha_up:
        out.append(alpha_up[(alpha_up.index(c) + 1) % 32])
    elif c in alpha_lo:
        out.append(alpha_lo[(alpha_lo.index(c) + 1) % 32])
    else:
        out.append(c)
print(''.join(out))

# 19
S = input()
K = int(input())
alpha_up = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
alpha_lo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
out = []
for c in S:
    if c in alpha_up:
        out.append(alpha_up[(alpha_up.index(c) + K) % 32])
    elif c in alpha_lo:
        out.append(alpha_lo[(alpha_lo.index(c) + K) % 32])
    else:
        out.append(c)
print(''.join(out))

# 21
S = input().strip().replace('\\\\', '/')
print(S.split('/')[-1].rsplit('.', 1)[0])

# 22
S = input().strip()
print(S.rsplit('.', 1)[-1])
`,
  },
  {
    fileName: 'Максим Орлов 1554103 assignsubmission file ТРП 1 26 Орлов ЛР5.py',
    studentName: 'Максим Орлов',
    groupName: 'ТРП 1 26',
    description: 'Решение с высокой схожестью со Смирновым (проверка антиплагиата)',
    code: `# ТРП 1 26 Максим Орлов
# ЛР 5 Методы строк

# 1
S = input()
S0 = input()
print(S.count(S0))

# 2
S = input()
S0 = input()
print(S.replace(S0, '', 1))

# 3
S = input()
S1 = input()
S2 = input()
pos = S.rfind(S1)
if pos != -1:
    print(S[:pos] + S2 + S[pos+len(S1):])
else:
    print(S)

# 4
C = input().strip()
S = input()
print(S.replace(C, C + C))

# 5
C = input().strip()
S = input()
S0 = input()
print(S.replace(C, S0 + C))

# 6
N = int(input())
S = input()
if len(S) > N:
    print(S[-N:])
else:
    print('.' * (N - len(S)) + S)

# 7
N1 = int(input())
N2 = int(input())
S1 = input()
S2 = input()
print(S1[:N1] + S2[-N2:])

# 8
S = input()
print(' '.join(S.split()))

# 9
S = input()
print(len(S.split()))

# 10
S = input()
words = S.split()
print(sum(1 for w in words if 'А' in w))

# 11
S = input()
words = S.split()
print(sum(1 for w in words if w[0] == w[-1]))

# 12
S = input()
words = S.split()
print(min(len(w) for w in words))

# 13
S = input()
parts = S.split(' ')
res = []
for p in parts:
    if p:
        first = p[0]
        res.append(first + p[1:].replace(first, '.'))
    else:
        res.append('')
print(' '.join(res))

# 14
S = input()
print(' '.join(sorted(S.split())))

# 15
S = input().replace('–', '-').replace('—', '-')
print(eval(S))

# 16
C = input().strip()
if C.isdigit():
    print('digit')
elif ('a' <= C <= 'z') or ('A' <= C <= 'Z'):
    print('lat')
else:
    print('rus')

# 17
S = input().strip()
try:
    int(S)
    print(1)
except ValueError:
    try:
        float(S)
        if '.' in S:
            print(2)
        else:
            print(1)
    except ValueError:
        print(0)

# 18
S = input()
up = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
lo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
res = []
for ch in S:
    if ch in up:
        res.append(up[(up.index(ch) + 1) % len(up)])
    elif ch in lo:
        res.append(lo[(lo.index(ch) + 1) % len(lo)])
    else:
        res.append(ch)
print(''.join(res))

# 19
S = input()
K = int(input())
up = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
lo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
res = []
for ch in S:
    if ch in up:
        res.append(up[(up.index(ch) + K) % len(up)])
    elif ch in lo:
        res.append(lo[(lo.index(ch) + K) % len(lo)])
    else:
        res.append(ch)
print(''.join(res))

# 20
S = input()
K = int(input())
up = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"
lo = "абвгдежзийклмнопрстуфхцчшщъыьэюя"
res = []
for ch in S:
    if ch in up:
        res.append(up[(up.index(ch) - K) % len(up)])
    elif ch in lo:
        res.append(lo[(lo.index(ch) - K) % len(lo)])
    else:
        res.append(ch)
print(''.join(res))

# 21
S = input().strip().replace('\\\\', '/')
filename = S.split('/')[-1]
print(filename.rsplit('.', 1)[0])

# 22
S = input().strip()
print(S.rsplit('.', 1)[-1])

# 23
S = input()
stack = []
pair = {')': '(', ']': '[', '}': '{'}
err = None
for i, ch in enumerate(S, 1):
    if ch in '([{':
        stack.append((ch, i))
    elif ch in ')]}':
        if not stack or stack[-1][0] != pair[ch]:
            err = i
            break
        stack.pop()
if err is not None:
    print(err)
elif stack:
    print(-1)
else:
    print(0)
`,
  },
];
