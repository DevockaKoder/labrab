import { SampleStudentFile } from './sampleSubmissions';

export const SAMPLE_SUBMISSIONS_LAB3: SampleStudentFile[] = [
  {
    fileName: 'Лабораторная_3_Волков.py',
    studentName: 'Волков Д.С.',
    groupName: 'ТРП-1-22',
    description: 'Полное решение всех 20 заданий лабораторной работы №3 (for, while, однопроходные, вложенные)',
    code: `# ТРП-1-22 Волков Д.С.
# Лабораторная работа 3: Циклы for и while

# 1
N = int(input())
s = 0
for i in range(1, N + 1):
    s += 2 * i - 1
    print(s)

# 2
N = int(input())
s = 0.0
sign = 1.0
for i in range(1, N + 1):
    s += sign * (1.0 + i * 0.1)
    sign = -sign
print(round(s, 4))

# 3
N = int(input())
a1, a2, a3 = 1, 2, 3
print(a1, a2, a3, end=' ')
for k in range(4, N + 1):
    ak = a3 + a2 - 2 * a1
    print(ak, end=' ')
    a1, a2, a3 = a2, a3, ak
print()

# 4
A = int(input())
B = int(input())
for i in range(A, B + 1):
    for _ in range(i):
        print(i, end=' ')
print()

# 5
A = float(input())
N = int(input())
s = 1.0
term = 1.0
for i in range(1, N + 1):
    term *= -A
    s += term
print(round(s, 4))

# 6
N = int(input())
res = 1
while N > 0:
    res *= N
    N -= 2
print(res)

# 7
N = int(input())
K = 1
while K * K <= N:
    K += 1
print(K)

# 8
N = int(input())
K = 0
s = 0
while s + (K + 1) <= N:
    K += 1
    s += K
print(K, s)

# 9
A = float(input())
K = 0
s = 0.0
while s + 1.0 / (K + 1) < A:
    K += 1
    s += 1.0 / K
print(K, round(s, 4))

# 10
N = int(input())
f1, f2 = 1, 1
while f2 < N:
    f1, f2 = f2, f1 + f2
print(f2 == N)

# 11
N = int(input())
i = 0
s = 0
while i < N:
    x = float(input())
    rx = round(x)
    print(rx, end=' ')
    s += rx
    i += 1
print()
print(s)

# 12
N = int(input())
i = 0
prod = 1.0
while i < N:
    x = float(input())
    frac = round(x - int(x), 4)
    print(frac, end=' ')
    prod *= frac
    i += 1
print()
print(round(prod, 4))

# 13
N = int(input())
i = 1
k = 0
while i <= N:
    x = int(input())
    if x % 2 != 0:
        print(i, end=' ')
        k += 1
    i += 1
print()
print(k)

# 14
N = int(input())
i = 0
prev = None
while i < N:
    x = int(input())
    if prev is None or x != prev:
        print(x, end=' ')
        prev = x
    i += 1
print()

# 15
N = int(input())
i = 0
last_sum = 0
curr_sum = 0
zeros = 0
while i < N:
    x = int(input())
    if x == 0:
        zeros += 1
        if zeros >= 2:
            last_sum = curr_sum
        curr_sum = 0
    else:
        if zeros >= 1:
            curr_sum += x
    i += 1
print(last_sum)

# 16
K = int(input())
N = int(input())
count_sets = 0
k_idx = 0
while k_idx < K:
    n_idx = 0
    has_two = False
    while n_idx < N:
        val = int(input())
        if val == 2:
            has_two = True
        n_idx += 1
    if has_two:
        count_sets += 1
    k_idx += 1
print(count_sets)

# 17
K = int(input())
N = int(input())
k_idx = 0
while k_idx < K:
    n_idx = 1
    last_two = 0
    while n_idx <= N:
        val = int(input())
        if val == 2:
            last_two = n_idx
        n_idx += 1
    print(last_two)
    k_idx += 1

# 18
K = int(input())
total_count = 0
k_idx = 0
while k_idx < K:
    count_in_set = 0
    val = int(input())
    while val != 0:
        count_in_set += 1
        val = int(input())
    print(count_in_set)
    total_count += count_in_set
    k_idx += 1
print(total_count)

# 19
K = int(input())
increasing_sets = 0
k_idx = 0
while k_idx < K:
    is_inc = True
    prev = int(input())
    curr = int(input())
    while curr != 0:
        if curr <= prev:
            is_inc = False
        prev = curr
        curr = int(input())
    if is_inc:
        increasing_sets += 1
    k_idx += 1
print(increasing_sets)

# 20
K = int(input())
k_idx = 0
while k_idx < K:
    is_inc = True
    is_dec = True
    prev = int(input())
    curr = int(input())
    while curr != 0:
        if curr <= prev:
            is_inc = False
        if curr >= prev:
            is_dec = False
        prev = curr
        curr = int(input())
    if is_inc:
        print(1)
    elif is_dec:
        print(-1)
    else:
        print(0)
    k_idx += 1
`,
  },

  {
    fileName: 'Лабораторная_3_Кузнецова.py',
    studentName: 'Кузнецова Е.В.',
    groupName: 'ТРП-1-22',
    description: 'Альтернативная авторская реализация 20 заданий с собственными именами переменных',
    code: `# ТРП-1-22 Кузнецова Е.В.
# Лабораторная работа 3

# 1
n = int(input())
cur = 0
for k in range(1, n + 1):
    cur += 2 * k - 1
    print(cur)

# 2
n = int(input())
res = 0.0
p = 1
for k in range(1, n + 1):
    res += p * (1.0 + k * 0.1)
    p = -p
print(round(res, 3))

# 3
n = int(input())
a1 = 1
a2 = 2
a3 = 3
print(a1, a2, a3, end=' ')
for idx in range(4, n + 1):
    cur = a3 + a2 - 2 * a1
    print(cur, end=' ')
    a1 = a2
    a2 = a3
    a3 = cur
print()

# 4
a = int(input())
b = int(input())
for val in range(a, b + 1):
    for c in range(val):
        print(val, end=' ')
print()

# 5
a = float(input())
n = int(input())
total = 1.0
mul = 1.0
for j in range(1, n + 1):
    mul *= -a
    total += mul
print(round(total, 4))

# 6
n = int(input())
ans = 1
while n >= 1:
    ans *= n
    n -= 2
print(ans)

# 7
n = int(input())
k = 1
while k * k <= n:
    k += 1
print(k)

# 8
n = int(input())
k = 1
acc = 1
while acc + (k + 1) <= n:
    k += 1
    acc += k
print(k, acc)

# 9
a = float(input())
k = 1
acc = 1.0
while acc + 1.0 / (k + 1) < a:
    k += 1
    acc += 1.0 / k
print(k, round(acc, 4))

# 10
n = int(input())
a, b = 1, 1
while b < n:
    a, b = b, a + b
print(b == n)

# Задача 11
n = int(input())
cnt = 0
total_rnd = 0
while cnt < n:
    v = float(input())
    r = round(v)
    print(r, end=' ')
    total_rnd += r
    cnt += 1
print()
print(total_rnd)

# Задание 12.
n = int(input())
idx = 0
res_prod = 1.0
while idx < n:
    val = float(input())
    rem = round(val - int(val), 4)
    print(rem, end=' ')
    res_prod *= rem
    idx += 1
print()
print(round(res_prod, 4))

# Task 13:
n = int(input())
pos = 1
odds = 0
while pos <= n:
    val = int(input())
    if val % 2 != 0:
        print(pos, end=' ')
        odds += 1
    pos += 1
print()
print(odds)

# 14. Различные элементы
n = int(input())
step = 0
last_seen = None
while step < n:
    curr_v = int(input())
    if last_seen is None or curr_v != last_seen:
        print(curr_v, end=' ')
        last_seen = curr_v
    step += 1
print()

# 15 - сумма между последними двумя нулями
n = int(input())
step = 0
accum = 0
final_sum = 0
z_found = 0
while step < n:
    item = int(input())
    if item == 0:
        z_found += 1
        if z_found >= 2:
            final_sum = accum
        accum = 0
    else:
        if z_found >= 1:
            accum += item
    step += 1
print(final_sum)

# № 16
k = int(input())
n = int(input())
good_sets = 0
k_cur = 0
while k_cur < k:
    n_cur = 0
    got_two = False
    while n_cur < n:
        num = int(input())
        if num == 2:
            got_two = True
        n_cur += 1
    if got_two:
        good_sets += 1
    k_cur += 1
print(good_sets)

# 17)
k = int(input())
n = int(input())
k_cur = 0
while k_cur < k:
    n_cur = 1
    last_two_pos = 0
    while n_cur <= n:
        elem = int(input())
        if elem == 2:
            last_two_pos = n_cur
        n_cur += 1
    print(last_two_pos)
    k_cur += 1

# 18. Количество
k = int(input())
total_len = 0
k_cur = 0
while k_cur < k:
    sub_count = 0
    val = int(input())
    while val != 0:
        sub_count += 1
        val = int(input())
    print(sub_count)
    total_len += sub_count
    k_cur += 1
print(total_len)

# Задание № 19
k = int(input())
inc_count = 0
k_cur = 0
while k_cur < k:
    p = int(input())
    c = int(input())
    is_increasing = True
    while c != 0:
        if c <= p:
            is_increasing = False
        p = c
        c = int(input())
    if is_increasing:
        inc_count += 1
    k_cur += 1
print(inc_count)

# Задача 20:
k = int(input())
k_cur = 0
while k_cur < k:
    p = int(input())
    c = int(input())
    up = True
    down = True
    while c != 0:
        if c <= p:
            up = False
        if c >= p:
            down = False
        p = c
        c = int(input())
    if up:
        print(1)
    elif down:
        print(-1)
    else:
        print(0)
    k_cur += 1
`,
  },

];
