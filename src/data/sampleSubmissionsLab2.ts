import { SampleStudentFile } from './sampleSubmissions';

export const SAMPLE_SUBMISSIONS_LAB2: SampleStudentFile[] = [
  {
    fileName: 'Лабораторная_2_Смирнов.py',
    studentName: 'Смирнов А.В.',
    groupName: 'ТРП-1-22',
    description: 'Полная работа, решены все 25 заданий без ошибок',
    code: `# ТРП-1-22, Смирнов А.В.
# Лабораторная работа №2. Числовые типы данных и ветвления

# 1
L = int(input("1. Сантиметры: "))
print("Полных метров:", L // 100)

# 2
M = int(input("2. Килограммы: "))
print("Полных тонн:", M // 1000)

# 3
b = int(input("3. Байт: "))
print("Килобайт:", b // 1024)

# 4
n = int(input("4. Двузначное число: "))
print("Десятки:", n // 10, "Единицы:", n % 10)

# 5
n = int(input("5. Двузначное число: "))
print("Сумма:", (n // 10) + (n % 10))
print("Произведение:", (n // 10) * (n % 10))

# 6
n = int(input("6. Двузначное число: "))
print("Перестановка:", (n % 10) * 10 + (n // 10))

# 7
n = int(input("7. Трехзначное число: "))
print("Сотни:", n // 100)

# 8
n = int(input("8. Трехзначное число: "))
a = n // 100
b = (n // 10) % 10
c = n % 10
print("Сумма:", a + b + c)
print("Произведение:", a * b * c)

# 9
n = int(input("9. Трехзначное число: "))
a = n // 100
b = (n // 10) % 10
c = n % 10
print("Перевернутое:", c * 100 + b * 10 + a)

# 10
n = int(input("10. Трехзначное число: "))
a = n // 100
rem = n % 100
print("Результат:", rem * 10 + a)

# 11
N = int(input("11. Секунды: "))
print("Полных часов:", N // 3600)

# 12
N = int(input("12. Секунды: "))
print("Минут с начала часа:", (N % 3600) // 60)
print("Секунд с начала минуты:", N % 60)

# 13
N = int(input("13. Секунды: "))
h = (N // 3600) % 24
m = (N % 3600) // 60
s = N % 60
print(f"{h:02d}:{m:02d}:{s:02d}")

# 14
K = int(input("14. День года: "))
print("День недели:", (K - 1) % 7 + 1)

# 15
K = int(input("15. День года: "))
D = int(input("День недели 1 января (1-7): "))
print("День недели:", (D + K - 2) % 7 + 1)

# 16
num = int(input("16. Число: "))
if num > 0:
    res = num + 1
elif num < 0:
    res = num - 2
else:
    res = 10
print("Результат:", res)

# 17
x = float(input("17. x: "))
y = float(input("y: "))
z = float(input("z: "))
mn = x
if y < mn:
    mn = y
if z < mn:
    mn = z
mx = x
if y > mx:
    mx = y
if z > mx:
    mx = z
print("Min:", mn, "Max:", mx)

# 18
x = float(input("18. x: "))
y = float(input("y: "))
if x > 0 and y > 0:
    print(1)
elif x < 0 and y > 0:
    print(2)
elif x < 0 and y < 0:
    print(3)
else:
    print(4)

# 19
d = int(input("19. Номер дня: "))
days = {1: "понедельник", 2: "вторник", 3: "среда", 4: "четверг", 5: "пятница", 6: "суббота", 7: "воскресенье"}
print(days.get(d, "ошибка"))

# 20
k = int(input("20. Оценка: "))
grades = {1: "плохо", 2: "неудовлетворительно", 3: "удовлетворительно", 4: "хорошо", 5: "отлично"}
print(grades.get(k, "ошибка"))

# 21
u = int(input("21. Единица: "))
l = float(input("Длина: "))
factors = {1: 0.1, 2: 1000.0, 3: 1.0, 4: 0.001, 5: 0.01}
print("В метрах:", l * factors.get(u, 1.0))

# 22
c = input("22. Направление: ").strip().upper()
cmd = int(input("Команда: "))
dirs = ['С', 'В', 'Ю', 'З']
idx = dirs.index(c)
if cmd == 1:
    idx = (idx - 1) % 4
elif cmd == -1:
    idx = (idx + 1) % 4
print("Направление:", dirs[idx])

# 23
c = input("23. Локатор: ").strip().upper()
c1 = int(input("Команда 1: "))
c2 = int(input("Команда 2: "))
dirs = ['С', 'В', 'Ю', 'З']
idx = dirs.index(c)
for turn in (c1, c2):
    if turn == 1:
        idx = (idx - 1) % 4
    elif turn == -1:
        idx = (idx + 1) % 4
    elif turn == 2:
        idx = (idx + 2) % 4
print("Ориентация:", dirs[idx])

# 24
rank = int(input("24. Номер карты: "))
suit = int(input("Номер масти: "))
names = {6: "шестерка", 7: "семерка", 8: "восьмерка", 9: "девятка", 10: "десятка", 11: "валет", 12: "дама", 13: "король", 14: "туз"}
suits = {1: "пик", 2: "треф", 3: "бубен", 4: "червей"}
print(f"{names.get(rank, '')} {suits.get(suit, '')}")

# 25
age = int(input("25. Возраст: "))
last = age % 10
if last == 1:
    w = "год"
elif last in (2, 3, 4):
    w = "года"
else:
    w = "лет"
print(f"{age} {w}")
`,
  },
  {
    fileName: 'Лабораторная_2_Кузнецов.py',
    studentName: 'Кузнецов Д.С.',
    groupName: 'ТРП-1-22',
    description: 'Работа с несколькими ошибками (нарушение min/max в №17, пропущено №23)',
    code: `# ТРП-1-22, Кузнецов Д.С.
# Лабораторная №2

# 1
l = int(input())
print(l // 100)

# 2
m = int(input())
print(m // 1000)

# 3
b = int(input())
print(b // 1024)

# 4
n = int(input())
print(n // 10, n % 10)

# 5
n = int(input())
print("Сумма:", n // 10 + n % 10)
print("Произведение:", (n // 10) * (n % 10))

# 6
n = int(input())
print((n % 10) * 10 + (n // 10))

# 7
n = int(input())
print(n // 100)

# 8
n = int(input())
print(n // 100 + (n // 10) % 10 + n % 10)
print((n // 100) * ((n // 10) % 10) * (n % 10))

# 9
n = int(input())
print((n % 10) * 100 + ((n // 10) % 10) * 10 + n // 100)

# 10
n = int(input())
print((n % 100) * 10 + n // 100)

# 11
N = int(input())
print(N // 3600)

# 12
N = int(input())
print((N % 3600) // 60, N % 60)

# 13
N = int(input())
print(f"{N // 3600 % 24:02d}:{N % 3600 // 60:02d}:{N % 60:02d}")

# 14
k = int(input())
print((k - 1) % 7 + 1)

# 15
k = int(input())
d = int(input())
print((d + k - 2) % 7 + 1)

# 16
n = int(input())
if n > 0:
    print(n + 1)
elif n < 0:
    print(n - 2)
else:
    print(10)

# 17
# Ошибка: использовал запрещенные функции min() и max()
a = float(input())
b = float(input())
c = float(input())
print("Min:", min(a, b, c), "Max:", max(a, b, c))

# 18
x = float(input())
y = float(input())
if x > 0 and y > 0:
    print(1)
elif x < 0 and y > 0:
    print(2)
elif x < 0 and y < 0:
    print(3)
else:
    print(4)

# 19
d = int(input())
days = {1: "понедельник", 2: "вторник", 3: "среда", 4: "четверг", 5: "пятница", 6: "суббота", 7: "воскресенье"}
print(days[d])

# 20
k = int(input())
g = {1: "плохо", 2: "неудовлетворительно", 3: "удовлетворительно", 4: "хорошо", 5: "отлично"}
print(g.get(k, "ошибка"))

# 21
u = int(input())
l = float(input())
t = {1: 0.1, 2: 1000, 3: 1, 4: 0.001, 5: 0.01}
print(l * t[u])

# 22
c = input().strip()
cmd = int(input())
dirs = ['С', 'В', 'Ю', 'З']
idx = dirs.index(c)
if cmd == 1:
    idx = (idx - 1) % 4
elif cmd == -1:
    idx = (idx + 1) % 4
print(dirs[idx])

# 23 задание пропущено

# 24
n = int(input())
m = int(input())
names = {6: "шестерка", 7: "семерка", 8: "восьмерка", 9: "девятка", 10: "десятка", 11: "валет", 12: "дама", 13: "король", 14: "туз"}
suits = {1: "пик", 2: "треф", 3: "бубен", 4: "червей"}
print(names[n], suits[m])

# 25
age = int(input())
last = age % 10
if last == 1:
    print(age, "год")
elif last in [2, 3, 4]:
    print(age, "года")
else:
    print(age, "лет")
`,
  },
  {
    fileName: 'Лабораторная_2_Васильев_зацикливание.py',
    studentName: 'Васильев И.О.',
    groupName: 'ТРП-1-22',
    description: 'Тест защиты: случайный бесконечный while-цикл (№16) и спам print (№17)',
    code: `# ТРП-1-22, Васильев И.О.
# Лабораторная работа №2

# 1
l = int(input())
print(l // 100)

# 2
m = int(input())
print(m // 1000)

# 3
b = int(input())
print(b // 1024)

# 4
n = int(input())
print(n // 10, n % 10)

# 5
n = int(input())
print(n // 10 + n % 10, (n // 10) * (n % 10))

# 6
n = int(input())
print((n % 10) * 10 + n // 10)

# 7
n = int(input())
print(n // 100)

# 8
n = int(input())
print((n // 100) + (n // 10 % 10) + (n % 10))

# 9
n = int(input())
print((n % 10) * 100 + (n // 10 % 10) * 10 + (n // 100))

# 10
n = int(input())
print((n % 100) * 10 + n // 100)

# 11
n = int(input())
print(n // 3600)

# 12
n = int(input())
print((n % 3600) // 60, n % 60)

# 13
n = int(input())
print(f"{n // 3600:02d}:{(n % 3600) // 60:02d}:{n % 60:02d}")

# 14
k = int(input())
print((k - 1) % 7 + 1)

# 15
k = int(input())
d = int(input())
print((d + k - 2) % 7 + 1)

# 16
n = int(input())
# Студент случайно сделал бесконечный цикл (забыл изменить переменную)
while n > 0:
    pass
if n > 0:
    print(n + 1)
else:
    print(n - 2)

# 17
# Студент забыл инкремент и устроил бесконечный цикл print()
a = float(input())
b = float(input())
c = float(input())
cnt = 0
while cnt < 10:
    print("test", a, b, c)

# 18
x = float(input())
y = float(input())
if x > 0 and y > 0:
    print(1)
elif x < 0 and y > 0:
    print(2)
elif x < 0 and y < 0:
    print(3)
else:
    print(4)

# 19
d = int(input())
days = {1: "понедельник", 2: "вторник", 3: "среда", 4: "четверг", 5: "пятница", 6: "суббота", 7: "воскресенье"}
print(days.get(d, "ошибка"))

# 20
k = int(input())
marks = {1: "плохо", 2: "неудовлетворительно", 3: "удовлетворительно", 4: "хорошо", 5: "отлично"}
print(marks.get(k, "ошибка"))

# 21
u = int(input())
l = float(input())
units = {1: 0.1, 2: 1000, 3: 1, 4: 0.001, 5: 0.01}
print(l * units.get(u, 1))

# 22
c = input().strip()
cmd = int(input())
dirs = ['С', 'В', 'Ю', 'З']
idx = dirs.index(c)
if cmd == 1:
    idx = (idx - 1) % 4
elif cmd == -1:
    idx = (idx + 1) % 4
print(dirs[idx])

# 23
c = input().strip()
d = int(input())
dirs = ['С', 'З', 'Ю', 'В']
idx = dirs.index(c)
idx = (idx + d) % 4
print(dirs[idx])

# 24
n = int(input())
m = int(input())
ranks = {6: "шестерка", 7: "семерка", 8: "восьмерка", 9: "девятка", 10: "десятка", 11: "валет", 12: "дама", 13: "король", 14: "туз"}
suits = {1: "пик", 2: "треф", 3: "бубен", 4: "червей"}
print(ranks.get(n, ""), suits.get(m, ""))

# 25
age = int(input())
last = age % 10
last2 = age % 100
if 11 <= last2 <= 14:
    print(age, "лет")
elif last == 1:
    print(age, "год")
elif 2 <= last <= 4:
    print(age, "года")
else:
    print(age, "лет")
`,
  },
];
