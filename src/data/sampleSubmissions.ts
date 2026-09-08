export interface SampleStudentFile {
  fileName: string;
  studentName: string;
  groupName: string;
  code: string;
  description: string;
}

export const SAMPLE_SUBMISSIONS: SampleStudentFile[] = [
  {
    fileName: 'Практика_1_Иванов.py',
    studentName: 'Иванов И.И.',
    groupName: 'ТРП-1-22',
    description: 'Оригинальная работа, решены все блоки заданий',
    code: `# ТРП-1-22, Иванов И.И.
import math

# 1.1
print("1.1 Составить алгоритм вычисления значения функции")
x = int(input("Введите число: "))
y = 7 * x + 5
print("Ответ: y =", y)

# 1.2
r = float(input("Радиус: "))
c = 2 * math.pi * r
print("Длина окружности =", c)

# 1.3
a = float(input("Катет a: "))
b = float(input("Катет b: "))
hyp = math.sqrt(a**2 + b**2)
p = a + b + hyp
print("Периметр =", p)

# 1.4
a = float(input("Основание 1: "))
b = float(input("Основание 2: "))
h = float(input("Высота: "))
side = math.sqrt(h**2 + ((abs(a - b) / 2) ** 2))
p_trap = a + b + 2 * side
print("Периметр равнобедренной трапеции =", p_trap)

# 1.5
x1 = float(input("x1: "))
y1 = float(input("y1: "))
x2 = float(input("x2: "))
y2 = float(input("y2: "))
dist = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
print("Расстояние между точками =", dist)

# 2.1
val1 = float(input("Число 1: "))
val2 = float(input("Число 2: "))
if val1 > val2:
    print(val1)
elif val2 > val1:
    print(val2)
else:
    print("Числа равны")

# 2.2
n1 = int(input())
n2 = int(input())
n3 = int(input())
if n1 <= n2 and n1 <= n3:
    print(n1)
elif n2 <= n1 and n2 <= n3:
    print(n2)
else:
    print(n3)

# 2.3
a = float(input())
b = float(input())
c = float(input())
if (b < a < c) or (c < a < b):
    print(a)
elif (a < b < c) or (c < b < a):
    print(b)
else:
    print(c)

# 2.4
x = float(input("x: "))
if x <= -1:
    res = 1 / (x**2)
elif -1 < x <= 0:
    res = -x
elif 0 < x <= 2:
    res = x**2
else:
    res = 4
print("y =", res)

# 2.5
x = float(input())
y = float(input())
sum_xy = x + y
if sum_xy < 2:
    z = math.sqrt(x**2 + y**2)
elif sum_xy == 3 or sum_xy == 8:
    z = 2 * x * y
elif sum_xy >= 10:
    z = x - y
else:
    z = 2 * x + 3 * y
u = 3 * (z**2) - 2 * z + 5
print("u =", u)

# 2.6
px = float(input())
py = float(input())
if px > 0 and py > 0:
    print(1)
elif px < 0 and py > 0:
    print(2)
elif px < 0 and py < 0:
    print(3)
elif px > 0 and py < 0:
    print(4)
else:
    print("Точка на оси координат")

# 3.1
for i in range(1, 16):
    print(i)

# 3.2
for i in range(2, 21, 2):
    print(i, end=" ")
print()

# 3.3
rate = float(input("Курс: "))
for d in range(1, 21):
    print(f"{d} $ = {d * rate} руб.")

# 3.4
price = float(input("Цена: "))
for kg in range(2, 11):
    print(f"{kg} кг | {kg * price} руб.")
    print("_" * 15)

# 3.5
n = int(input("n: "))
s = 0.0
for k in range(1, n + 1):
    s += 1 / (k ** 5)
print("S =", s)

# 3.6
n = int(input("n: "))
s = 0.0
for k in range(1, n + 1):
    s += (2 * k - 1) / (k + 1)
print("S =", s)

# 3.7
n = int(input("n: "))
p = 1.0
for k in range(1, n + 1):
    p *= (1 + 1 / k)
print("P =", p)

# 4.1
a = int(input("A: "))
b = int(input("B: "))
cur = a + 1
while cur < b:
    print(cur)
    cur += 1

# 4.2
a = int(input("A: "))
b = int(input("B: "))
cur = b - 1
while cur > a:
    print(cur)
    cur -= 1

# 4.3
n = int(input("N: "))
num = 1
while num < n:
    print(num)
    num += 1

# 4.4
n = float(input("n: "))
k = 1
while k**2 <= n:
    k += 1
print(k)

# 4.5
total = 0
num = 1
while num <= 99:
    total += num
    num += 2
print("Сумма нечетных чисел =", total)
`,
  },
  {
    fileName: 'Петров_Лаба1_вар3.py',
    studentName: 'Петров П.П.',
    groupName: 'ТРП-1-22',
    description: 'Списал у Иванова: переименовал переменные и поменял текст принтов',
    code: `# ТРП-1-22, Петров П.П.
import math

# 1.1
# Вычисление функции
arg_x = int(input("Введите число x: "))
res_y = 7 * arg_x + 5
print("Результат вычисления: ", res_y)

# 1.2
radius_val = float(input("r: "))
circ_len = 2 * math.pi * radius_val
print("Длина:", circ_len)

# 1.3
cat1 = float(input("a: "))
cat2 = float(input("b: "))
hypotenuse = math.sqrt(cat1**2 + cat2**2)
perim = cat1 + cat2 + hypotenuse
print("Ответ периметр:", perim)

# 1.4
base1 = float(input("Основание a: "))
base2 = float(input("Основание b: "))
height = float(input("Высота h: "))
lateral_side = math.sqrt(height**2 + ((abs(base1 - base2) / 2) ** 2))
trap_perim = base1 + base2 + 2 * lateral_side
print("Ответ:", trap_perim)

# 1.5
point_x1 = float(input())
point_y1 = float(input())
point_x2 = float(input())
point_y2 = float(input())
distance_val = math.sqrt((point_x2 - point_x1)**2 + (point_y2 - point_y1)**2)
print("Расстояние равно:", distance_val)

# 2.1
first_num = float(input())
second_num = float(input())
if first_num > second_num:
    print(first_num)
elif second_num > first_num:
    print(second_num)
else:
    print("Числа равны")

# 2.2
item_a = int(input())
item_b = int(input())
item_c = int(input())
if item_a <= item_b and item_a <= item_c:
    print(item_a)
elif item_b <= item_a and item_b <= item_c:
    print(item_b)
else:
    print(item_c)

# 2.3
v1 = float(input())
v2 = float(input())
v3 = float(input())
if (v2 < v1 < v3) or (v3 < v1 < v2):
    print(v1)
elif (v1 < v2 < v3) or (v3 < v2 < v1):
    print(v2)
else:
    print(v3)

# 2.4
param_x = float(input())
if param_x <= -1:
    func_y = 1 / (param_x**2)
elif -1 < param_x <= 0:
    func_y = -param_x
elif 0 < param_x <= 2:
    func_y = param_x**2
else:
    func_y = 4
print("Итог:", func_y)

# 2.5
arg_x = float(input())
arg_y = float(input())
s_val = arg_x + arg_y
if s_val < 2:
    var_z = math.sqrt(arg_x**2 + arg_y**2)
elif s_val == 3 or s_val == 8:
    var_z = 2 * arg_x * arg_y
elif s_val >= 10:
    var_z = arg_x - arg_y
else:
    var_z = 2 * arg_x + 3 * arg_y
out_u = 3 * (var_z**2) - 2 * var_z + 5
print("u =", out_u)

# 2.6
coord_x = float(input())
coord_y = float(input())
if coord_x > 0 and coord_y > 0:
    print(1)
elif coord_x < 0 and coord_y > 0:
    print(2)
elif coord_x < 0 and coord_y < 0:
    print(3)
elif coord_x > 0 and coord_y < 0:
    print(4)
else:
    print("На границе четвертей")

# 3.1
for val in range(1, 16):
    print(val)

# 3.2
for item in range(2, 21, 2):
    print(item, end=" ")
print()

# 3.3
curr_rate = float(input())
for dollars in range(1, 21):
    print(f"{dollars} $ = {dollars * curr_rate} руб.")

# 3.4
candy_cost = float(input())
for weight_kg in range(2, 11):
    print(f"{weight_kg} кг | {weight_kg * candy_cost} руб.")
    print("_" * 15)

# 3.5
limit_n = int(input())
summa = 0.0
for step_k in range(1, limit_n + 1):
    summa += 1 / (step_k ** 5)
print("S =", summa)

# 3.6
limit_n = int(input())
summa = 0.0
for step_k in range(1, limit_n + 1):
    summa += (2 * step_k - 1) / (step_k + 1)
print("S =", summa)

# 3.7
limit_n = int(input())
proizv = 1.0
for step_k in range(1, limit_n + 1):
    proizv *= (1 + 1 / step_k)
print("P =", proizv)

# 4.1
bound_a = int(input())
bound_b = int(input())
iter_val = bound_a + 1
while iter_val < bound_b:
    print(iter_val)
    iter_val += 1

# 4.2
bound_a = int(input())
bound_b = int(input())
iter_val = bound_b - 1
while iter_val > bound_a:
    print(iter_val)
    iter_val -= 1

# 4.3
val_n = int(input())
c_i = 1
while c_i < val_n:
    print(c_i)
    c_i += 1

# 4.4
num_val = float(input())
m = 1
while m**2 <= num_val:
    m += 1
print(m)

# 4.5
odd_sum = 0
j = 1
while j <= 99:
    odd_sum += j
    j += 2
print("Сумма нечетных =", odd_sum)
`,
  },
  {
    fileName: 'Сидорова_ЛР1.py',
    studentName: 'Сидорова А.В.',
    groupName: 'ТРП-1-22',
    description: 'Самостоятельное решение с ошибкой в задаче 2.2 (использовала min) и 2.4',
    code: `# ТРП-1-22, Сидорова А.В.
import math

# 1.1
x = int(input())
print(7 * x + 5)

# 1.2
r = float(input())
print(2 * 3.14159265 * r)

# 1.3
k1 = float(input())
k2 = float(input())
p = k1 + k2 + (k1**2 + k2**2)**0.5
print("P =", p)

# 1.4
a = float(input())
b = float(input())
h = float(input())
c = (h**2 + ((a - b) / 2)**2)**0.5
print("Периметр:", a + b + 2 * c)

# 1.5
x1 = float(input())
y1 = float(input())
x2 = float(input())
y2 = float(input())
print("d =", ((x2 - x1)**2 + (y2 - y1)**2)**0.5)

# 2.1
x = float(input())
y = float(input())
if x > y:
    print(x)
else:
    print(y)

# 2.2
# ОШИБКА: студентка использовала запрещенную функцию min()!
a = int(input())
b = int(input())
c = int(input())
print(min(a, b, c))

# 2.3
a = float(input())
b = float(input())
c = float(input())
arr = [a, b, c]
arr.sort()
print(arr[1])

# 2.4
# ОШИБКА в логике веток
x = float(input())
if x <= -1:
    print(1 / x**2)
elif x <= 2:
    print(x**2)
else:
    print(4)

# 2.5
x = float(input())
y = float(input())
s = x + y
if s < 2:
    z = (x**2 + y**2)**0.5
elif s in (3, 8):
    z = 2 * x * y
elif s >= 10:
    z = x - y
else:
    z = 2 * x + 3 * y
print(3 * z**2 - 2 * z + 5)

# 2.6
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

# 3.1
for x in range(1, 16):
    print(x)

# 3.2
for x in range(2, 21, 2):
    print(x)

# 3.3
usd = float(input())
for i in range(1, 21):
    print(i, "$ =", i * usd, "руб.")

# 3.4
cost = float(input())
for i in range(2, 11):
    print(f"{i} кг | {i * cost} руб.")
    print("___________________")

# 3.5
n = int(input())
ans = sum(1 / (k**5) for k in range(1, n + 1))
print(ans)

# 3.6
n = int(input())
ans = sum((2*k - 1) / (k + 1) for k in range(1, n + 1))
print(ans)

# 3.7
n = int(input())
ans = 1
for k in range(1, n + 1):
    ans *= (1 + 1/k)
print(ans)

# 4.1
a = int(input())
b = int(input())
while a + 1 < b:
    a += 1
    print(a)

# 4.2
a = int(input())
b = int(input())
b -= 1
while b > a:
    print(b)
    b -= 1

# 4.3
n = int(input())
i = 1
while i < n:
    print(i)
    i += 1

# 4.4
n = float(input())
k = 1
while k * k <= n:
    k += 1
print(k)

# 4.5
total = 0
k = 1
while k <= 99:
    total += k
    k += 2
print(total)
`,
  },
  {
    fileName: 'Нейронов_К_А_ИИ_ChatGPT.py',
    studentName: 'Нейронов К.А.',
    groupName: 'ТРП-1-22',
    description: 'Код сгенерирован ChatGPT: аннотации типов (type hints), докстринги, try-except, if __name__ == "__main__"',
    code: `# ТРП-1-22, Нейронов К.А.
"""
Laboratory Work No. 1: Introduction to Python & IDLE
Generated with automated assistant patterns.
"""
import math
import sys
from typing import Union

def calculate_linear_function(x: float) -> float:
    """
    Computes the linear function y = 7x + 5.
    :param x: Input argument
    :return: Computed y value
    """
    return 7.0 * x + 5.0

# 1.1
# Step 1: Input reading with type safety
try:
    val_x = float(input("Enter x: "))
    print(calculate_linear_function(val_x))
except ValueError:
    pass

# 1.2
# Calculate circle length with mathematical constant
try:
    r: float = float(input())
    circle_length: float = 2.0 * math.pi * r
    print(circle_length)
except ValueError:
    pass

# 1.3
# Right triangle perimeter calculation
cathetus_a: float = float(input())
cathetus_b: float = float(input())
hypotenuse: float = math.hypot(cathetus_a, cathetus_b)
triangle_perimeter: float = cathetus_a + cathetus_b + hypotenuse
print("Perimeter:", triangle_perimeter)

# 1.4
base_a: float = float(input())
base_b: float = float(input())
height_h: float = float(input())
leg: float = math.sqrt(height_h**2 + ((abs(base_a - base_b) / 2.0)**2))
print("Trapezoid perimeter:", base_a + base_b + 2.0 * leg)

# 1.5
point_x1: float = float(input())
point_y1: float = float(input())
point_x2: float = float(input())
point_y2: float = float(input())
euclidean_distance: float = math.dist((point_x1, point_y1), (point_x2, point_y2))
print(euclidean_distance)

# 2.1
num_a: float = float(input())
num_b: float = float(input())
if num_a > num_b:
    print(num_a)
elif num_b > num_a:
    print(num_b)
else:
    print("Numbers are equal")

# 2.2
val1: int = int(input())
val2: int = int(input())
val3: int = int(input())
if val1 <= val2 and val1 <= val3:
    print(val1)
elif val2 <= val1 and val2 <= val3:
    print(val2)
else:
    print(val3)

# 2.3
v1: float = float(input())
v2: float = float(input())
v3: float = float(input())
if (v2 < v1 < v3) or (v3 < v1 < v2):
    print(v1)
elif (v1 < v2 < v3) or (v3 < v2 < v1):
    print(v2)
else:
    print(v3)

# 2.4
piecewise_x: float = float(input())
if piecewise_x <= -1.0:
    res_val: float = 1.0 / (piecewise_x**2)
elif -1.0 < piecewise_x <= 0.0:
    res_val = -piecewise_x
elif 0.0 < piecewise_x <= 2.0:
    res_val = piecewise_x**2
else:
    res_val = 4.0
print("y =", res_val)

# 2.5
z_x: float = float(input())
z_y: float = float(input())
sum_val: float = z_x + z_y
if sum_val < 2.0:
    z_intermediate = math.sqrt(z_x**2 + z_y**2)
elif sum_val in (3.0, 8.0):
    z_intermediate = 2.0 * z_x * z_y
elif sum_val >= 10.0:
    z_intermediate = z_x - z_y
else:
    z_intermediate = 2.0 * z_x + 3.0 * z_y
final_u: float = 3.0 * (z_intermediate**2) - 2.0 * z_intermediate + 5.0
print("u =", final_u)

# 2.6
coord_px: float = float(input())
coord_py: float = float(input())
if coord_px > 0 and coord_py > 0:
    print(1)
elif coord_px < 0 and coord_py > 0:
    print(2)
elif coord_px < 0 and coord_py < 0:
    print(3)
elif coord_px > 0 and coord_py < 0:
    print(4)
else:
    print("On axis")

# 3.1
for val in range(1, 16):
    print(val)

# 3.2
for ev in range(2, 21, 2):
    print(ev, end=" ")
print()

# 3.3
exchange_rate: float = float(input())
for d in range(1, 21):
    print(f"{d} $ = {d * exchange_rate} руб.")

# 3.4
unit_price: float = float(input())
for w in range(2, 11):
    print(f"{w} кг | {w * unit_price} руб.")
    print("_" * 15)

# 3.5
# Functional comprehension over-engineering:
limit_n: int = int(input())
series_sum: float = 0.0
for k in range(1, limit_n + 1):
    series_sum += 1.0 / (k**5)
print("S =", series_sum)

# 3.6
limit_n2: int = int(input())
series_sum2: float = 0.0
for k in range(1, limit_n2 + 1):
    series_sum2 += (2.0 * k - 1.0) / (k + 1.0)
print("S =", series_sum2)

# 3.7
limit_n3: int = int(input())
prod_accum: float = 1.0
for k in range(1, limit_n3 + 1):
    prod_accum *= (1.0 + 1.0 / k)
print("P =", prod_accum)

# 4.1
range_start: int = int(input())
range_end: int = int(input())
curr_idx: int = range_start + 1
while curr_idx < range_end:
    print(curr_idx)
    curr_idx += 1

# 4.2
range_start2: int = int(input())
range_end2: int = int(input())
curr_idx2: int = range_end2 - 1
while curr_idx2 > range_start2:
    print(curr_idx2)
    curr_idx2 -= 1

# 4.3
ceil_limit: int = int(input())
counter: int = 1
while counter < ceil_limit:
    print(counter)
    counter += 1

# 4.4
search_n: float = float(input())
candidate_k: int = 1
while candidate_k**2 <= search_n:
    candidate_k += 1
print(candidate_k)

# 4.5
odd_accumulator: int = 0
cur_odd: int = 1
while cur_odd <= 99:
    odd_accumulator += cur_odd
    cur_odd += 2
print(odd_accumulator)

if __name__ == '__main__':
    # Entrypoint marker
    pass
`,
  },
];
