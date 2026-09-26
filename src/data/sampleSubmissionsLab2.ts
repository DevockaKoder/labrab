import { SampleStudentFile } from './sampleSubmissions';

export const SAMPLE_SUBMISSIONS_LAB2: SampleStudentFile[] = [
  {
    fileName: 'Лабораторная_2_Смирнов.py',
    studentName: 'Смирнов А.В.',
    groupName: 'ТРП-1-22',
    description: 'Полная работа, верно решены все 25 заданий по методичке',
    code: `# ТРП-1-22, Смирнов А.В.
# Лабораторная работа №2. Числа, целые и вещественные. Проверка условия
import math
import random

# 1
L = int(input("1. Сантиметры: "))
print("Полных метров:", L // 100)

# 2
b = int(input("2. Байт: "))
print("Килобайт:", b // 1024)

# 3
n = int(input("3. Минут с начала суток: "))
h = (n // 60) % 24
m = n % 60
print(f"Часы: {h}, минуты: {m}")

# 4
a = int(input("4. Число 1: "))
b = int(input("Число 2: "))
if a % 2 != 0:
    print("Нечетное:", a)
elif b % 2 != 0:
    print("Нечетное:", b)

# 5
m = int(input("5. m: "))
n = int(input("n: "))
if m != n:
    m = n = max(m, n)
else:
    m = n = 0
print("Результат:", m, n)

# 6
num = int(input("6. Число: "))
if num > 0:
    res = num + 1
elif num < 0:
    res = num - 2
else:
    res = 10
print("Результат:", res)

# 7
n = int(input("7. Трехзначное число: "))
a = n // 100
b = (n // 10) % 10
c = n % 10
rev = c * 100 + b * 10 + a
print("Справа налево:", rev)

# 8
n = int(input("8. Трехзначное число: "))
a = n // 100
b = (n // 10) % 10
c = n % 10
mx = max(a, b, c)
mn = min(a, b, c)
mid = a + b + c - mx - mn
print("Наибольшее число:", mx * 100 + mid * 10 + mn)

# 9
n = abs(int(input("9. Число n: ")))
count = 1 if n == 0 else 0
temp = n
while temp > 0:
    count += 1
    temp //= 10
print("Количество цифр:", count)

# 10
print("10. Числа до 200 с суммой цифр 13:")
for x in range(1, 201):
    s = (x // 100) + ((x // 10) % 10) + (x % 10)
    if s == 13:
        print(x)

# 11
n = int(input("11. Максимум диапазона n: "))
k = int(input("Попыток k: "))
secret = random.randint(1, n)
won = False
for _ in range(k):
    guess = int(input("Попытка: "))
    if guess == secret:
        print("Вы угадали")
        won = True
        break
    elif guess < secret:
        print("Больше")
    else:
        print("Меньше")
if not won:
    print("Попытки закончились")

# 12
print("12. Поиск счастливых билетов:")
count = 0
for a in range(10):
    for b in range(10):
        for c in range(10):
            for d in range(10):
                for e in range(10):
                    for f in range(10):
                        if a + b + c == d + e + f:
                            count += 1
# Без билета 000000
ans = count - 1 if count == 55252 else count
print("счастливых билетов:", ans)

# 13
print("13. Числа, равные сумме факториалов цифр:")
facts = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880]
for x in range(1, 50000):
    t = x
    s = 0
    while t > 0:
        s += facts[t % 10]
        t //= 10
    if s == x:
        print(x)

# 14
A = int(input("14. A: "))
print(A > 0)

# 15
A = int(input("15. A: "))
B = int(input("B: "))
C = int(input("C: "))
print(A > 0 or B > 0 or C > 0)

# 16
A = int(input("16. A: "))
B = int(input("B: "))
C = int(input("C: "))
print((A > 0) + (B > 0) + (C > 0) == 1)

# 17
x1 = int(input("17. x1: "))
y1 = int(input("y1: "))
x2 = int(input("x2: "))
y2 = int(input("y2: "))
print((x1 + y1) % 2 == (x2 + y2) % 2)

# 18
x1 = int(input("18. x1: "))
y1 = int(input("y1: "))
x2 = int(input("x2: "))
y2 = int(input("y2: "))
dx = abs(x1 - x2)
dy = abs(y1 - y2)
print((dx == 1 and dy == 2) or (dx == 2 and dy == 1))

# 19
num = int(input("19. Число: "))
print(10 <= num <= 99 and num % 2 == 0)

# 20
n = int(input("20. Число 100-999: "))
hund = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"]
tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"]
teens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"]
ones = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"]
h = n // 100
rem = n % 100
res = [hund[h]]
if 10 <= rem <= 19:
    res.append(teens[rem - 10])
else:
    if rem // 10 > 0: res.append(tens[rem // 10])
    if rem % 10 > 0: res.append(ones[rem % 10])
print(" ".join(res))

# 21
K = int(input("21. День года K: "))
print("День недели:", K % 7 + 1)

# 22
K = int(input("22. День года K: "))
N = int(input("1 января день недели N: "))
print("День недели:", (N + K - 2) % 7 + 1)

# 23
N_dir = input("23. Направление (С, З, Ю, В): ").strip().upper()
K = int(input("Команда (0, 1, -1): "))
dirs = ["С", "З", "Ю", "В"]
idx = dirs.index(N_dir)
print("Новое направление:", dirs[(idx + K) % 4])

# 24
N_loc = input("24. Ориентация (С, З, Ю, В): ").strip().upper()
K1 = int(input("Команда 1: "))
K2 = int(input("Команда 2: "))
dirs = ["С", "З", "Ю", "В"]
idx = dirs.index(N_loc)
print("Итоговая ориентация:", dirs[(idx + K1 + K2) % 4])

# 25
year = int(input("25. Год: "))
colors = ["зеленой", "красной", "желтой", "белой", "черной"]
animals = ["крысы", "коровы", "тигра", "зайца", "дракона", "змеи", "лошади", "овцы", "обезьяны", "курицы", "собаки", "свиньи"]
offset = (year - 1984) % 60
print(f"год {colors[offset // 12]} {animals[offset % 12]}")
`,
  },
  {
    fileName: 'Лабораторная_2_Кузнецов.py',
    studentName: 'Кузнецов Д.М.',
    groupName: 'ТРП-1-22',
    description: 'Сдача с нумерацией 1.1..1.25 (как в 1-й лабораторной)',
    code: `# ТРП-1-22, Кузнецов Д.М.
# Лабораторная 2
import math
import random

# 1.1
L = int(input())
print(L // 100)

# 1.2
b = int(input())
print(b // 1024)

# 1.3
n = int(input())
print((n // 60) % 24, n % 60)

# 1.4
x = int(input())
y = int(input())
if x % 2 != 0:
    print(x)
elif y % 2 != 0:
    print(y)

# 1.5
m = int(input())
n = int(input())
if m != n:
    m = n = max(m, n)
else:
    m = n = 0
print(m, n)

# 1.6
x = int(input())
if x > 0:
    print(x + 1)
elif x < 0:
    print(x - 2)
else:
    print(10)

# 1.7
n = int(input())
a = n // 100
b = (n // 10) % 10
c = n % 10
print(c * 100 + b * 10 + a)

# 1.8
n = int(input())
a = n // 100
b = (n // 10) % 10
c = n % 10
mx = max(a, b, c)
mn = min(a, b, c)
mid = a + b + c - mx - mn
print(mx * 100 + mid * 10 + mn)

# 1.9
n = abs(int(input()))
c = 0
if n == 0:
    c = 1
while n > 0:
    c += 1
    n //= 10
print(c)

# 1.10
for i in range(1, 201):
    if (i // 100) + ((i // 10) % 10) + (i % 10) == 13:
        print(i)

# 1.11
n = int(input())
k = int(input())
sec = random.randint(1, n)
for _ in range(k):
    g = int(input())
    if g == sec:
        print("Вы угадали")
        break
    elif g < sec:
        print("Больше")
    else:
        print("Меньше")
else:
    print("Попытки закончились")

# 1.12
# 12 Найдите количество всех счастливых комбинаций
ans = 0
for i in range(1000000):
    s1 = (i // 100000) + ((i // 10000) % 10) + ((i // 1000) % 10)
    s2 = ((i // 100) % 10) + ((i // 10) % 10) + (i % 10)
    if s1 == s2:
        ans += 1
if ans == 55252:
    ans -= 1
print("счастливых билетов:", ans)

# 1.13
for i in range(1, 50000):
    t = i
    s = 0
    while t > 0:
        s += math.factorial(t % 10)
        t //= 10
    if s == i:
        print(i)

# 1.14
A = int(input())
print(A > 0)

# 1.15
A = int(input())
B = int(input())
C = int(input())
print(A > 0 or B > 0 or C > 0)

# 1.16
A = int(input())
B = int(input())
C = int(input())
print((A > 0) + (B > 0) + (C > 0) == 1)

# 1.17
x1 = int(input())
y1 = int(input())
x2 = int(input())
y2 = int(input())
print((x1 + y1) % 2 == (x2 + y2) % 2)

# 1.18
x1 = int(input())
y1 = int(input())
x2 = int(input())
y2 = int(input())
print((abs(x1 - x2) == 1 and abs(y1 - y2) == 2) or (abs(x1 - x2) == 2 and abs(y1 - y2) == 1))

# 1.19
n = int(input())
print(10 <= n <= 99 and n % 2 == 0)

# 1.20
n = int(input())
h = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"]
t = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"]
te = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"]
o = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"]
rem = n % 100
res = h[n // 100]
if 10 <= rem <= 19:
    res += " " + te[rem - 10]
else:
    if rem // 10 > 0: res += " " + t[rem // 10]
    if rem % 10 > 0: res += " " + o[rem % 10]
print(res.strip())

# 1.21
K = int(input())
print(K % 7 + 1)

# 1.22
K = int(input())
N = int(input())
print((N + K - 2) % 7 + 1)

# 1.23
N = input().strip()
K = int(input())
d = ["С", "З", "Ю", "В"]
print(d[(d.index(N) + K) % 4])

# 1.24
N = input().strip()
K1 = int(input())
K2 = int(input())
d = ["С", "З", "Ю", "В"]
print(d[(d.index(N) + K1 + K2) % 4])

# 1.25
y = int(input())
c = ["зеленой", "красной", "желтой", "белой", "черной"]
a = ["крысы", "коровы", "тигра", "зайца", "дракона", "змеи", "лошади", "овцы", "обезьяны", "курицы", "собаки", "свиньи"]
print(f"год {c[((y - 1984) % 60) // 12]} {a[(y - 1984) % 12]}")
`,
  },
];
