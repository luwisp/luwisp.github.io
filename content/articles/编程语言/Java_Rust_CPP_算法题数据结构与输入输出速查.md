---
title: Java / Rust / C++ 算法题：数据结构与输入输出速查
date: 2026-10-09T00:00:00
summary: 刷题速查
minutes: 50
---

> 排列方式：**一个知识点 → Java / Rust / C++**。示例以 **Java 17+、Rust stable、C++17** 为基准。
>
> 默认：Java 已 `import java.util.*;`、`import java.io.*;`；Rust 按示例引入 `use`；C++ 已 `#include <bits/stdc++.h>` 和 `using namespace std;`（后两者适合算法竞赛，非可移植工程写法）。
>
> 以下 `v`、`q`、`mp` 等变量除非另有声明，均指本节示例中声明的对象。访问空容器的元素前应先检查是否为空。

## 0. 类型和容器速查

| 功能            | Java                                         | Rust                | C++                                 |
| ------------- | -------------------------------------------- | ------------------- | ----------------------------------- |
| 固定长度数组        | `int[]`                                      | `[i32; N]`          | `int a[N]`（N 为编译期常量）、`array<int,N>` |
| 动态数组 / vector | `ArrayList<Integer>`                         | `Vec<i32>`          | `vector<int>`                       |
| 栈             | `ArrayDeque<Integer>` / `ArrayList<Integer>` | `Vec<i32>`          | `vector<int>` / `stack<int>`        |
| 普通队列          | `ArrayDeque<Integer>`                        | `VecDeque<i32>`     | `queue<int>`                        |
| 双端队列          | `ArrayDeque<Integer>`                        | `VecDeque<i32>`     | `deque<int>`                        |
| 优先队列（堆）       | `PriorityQueue<Integer>`                     | `BinaryHeap<i32>`   | `priority_queue<int>`               |
| 哈希集合          | `HashSet<Integer>`                           | `HashSet<i32>`      | `unordered_set<int>`                |
| 哈希映射          | `HashMap<Integer,Integer>`                   | `HashMap<i32,i32>`  | `unordered_map<int,int>`            |
| 有序集合          | `TreeSet<Integer>`                           | `BTreeSet<i32>`     | `set<int>`                          |
| 有序映射          | `TreeMap<Integer,Integer>`                   | `BTreeMap<i32,i32>` | `map<int,int>`                      |
| 字符串           | `String` / `StringBuilder`                   | `String` / `&str`   | `string`                            |

**基本数字类型**Java `int`（32 位）、`long`（64 位）；Rust `i32`、`i64`、`usize`（索引）；C++ `int`（通常 32 位）、`long long`（至少 64 位）、`size_t`（索引）。竞赛中求和可能溢出 `int/i32`，必要时使用 64 位。

## 1. 普通数组（固定长度）、二维数组

### Java

```java
int[] a = new int[5];            // 全部默认 0
int[] b = {3, 1, 4};
int n = a.length;                 // 属性，不是 length()
a[0] = 10;
Arrays.fill(a, -1);              // 填充
Arrays.sort(b);                  // 升序，原地排序
int[] copy = Arrays.copyOf(b, b.length);
int[][] grid = new int[3][4];    // 3 行 4 列，默认 0
int[][] ragged = new int[3][];   // 不规则二维数组
```

- 基本类型数组不能直接使用 `Comparator` 排序；对象数组（如 `Integer[]`）可以。
- 二维数组实际上是“数组的数组”；`grid.length` 是行数，`grid[i].length` 是第 `i` 行列数。

### Rust

```rust
let mut a = [0i32; 5];           // 长度固定
let b = [3, 1, 4];
let n = a.len();
a[0] = 10;
a.fill(-1);
let mut c = b;
c.sort();                        // 升序
let grid = [[0i32; 4]; 3];       // 3 × 4
```

- `[T; N]` 的长度 `N` 是类型的一部分；需要运行时决定长度时使用 `Vec<T>`。
- 对于非 `Copy` 的元素，数组重复初始化可能需要 `std::array::from_fn`。

### C++

```cpp
int a[5]{};                      // 零初始化
int b[] = {3, 1, 4};
int n = sizeof(a) / sizeof(a[0]); // 只对当前作用域中的原生数组适用
a[0] = 10;
fill(a, a + 5, -1);
sort(b, b + 3);
array<int, 5> c{};               // std::array，c.size()
int grid[3][4]{};
```

- **不要写 `int a[n]`（当 `n` 是运行时变量）**：变长数组不是标准 C++17，使用 `vector<int> a(n)`。
- 把原生数组传给函数后通常退化为指针，无法用 `sizeof` 求原数组长度。

## 2. 动态数组（vector / ArrayList / Vec）

### Java：`ArrayList<T>`

```java
ArrayList<Integer> v = new ArrayList<>();
v.add(3);                        // 尾部追加，均摊 O(1)
v.add(0, 8);                     // 索引 0 插入，O(n)
int x = v.get(0);                // 按索引读取，O(1)
v.set(0, 5);                     // 覆盖
v.remove(v.size() - 1);          // 删除末尾，返回删除值，O(1)
v.remove(0);                     // 删除索引 0，O(n)
boolean has = v.contains(5);     // O(n)
int n = v.size();
boolean empty = v.isEmpty();
v.clear();
Collections.sort(v);             // 升序
v.sort(Collections.reverseOrder()); // 降序
Collections.reverse(v);          // 逆序，不是排序
```

- `ArrayList<Integer>` 存装箱类型 `Integer`，不是 `int`。
- `remove(1)` 删除 **下标 1**，不是数值 1；按值删除用 `v.remove(Integer.valueOf(1))`。
- Java `List` 有 `subList(l, r)`（左闭右开），返回**视图**；若要独立副本：`new ArrayList<>(v.subList(l, r))`。

### Rust：`Vec<T>`

```rust
let mut v = vec![3, 1, 4];
let zeros = vec![0i32; 5];
v.push(9);                       // 末尾添加，均摊 O(1)
let x = v[0];                    // 越界会 panic
let maybe = v.get(100);         // Option<&T>，越界是 None
v[0] = 8;
let last = v.pop();              // Option<T>，空时 None
v.insert(1, 7);                 // O(n)
let removed = v.remove(0);       // O(n)
let n = v.len();
let empty = v.is_empty();
v.sort();                        // 升序
v.sort_unstable();               // 不稳定排序，通常更省开销
v.reverse();
v.clear();
let part = &v[1..3];             // 切片，左闭右开（需有效下标）
```

- `v.contains(&8)` 查找，O(n)；`v.iter()` 迭代借用，`v.iter_mut()` 可修改。
- `v.retain(|&x| x > 0)` 仅保留满足条件的元素，O(n)。

### C++：`vector<T>`

```cpp
vector<int> v = {3, 1, 4};
vector<int> zeros(5, 0);
v.push_back(9);                 // 尾部添加，均摊 O(1)
v.emplace_back(10);             // 原地构造；对 int 效果类似 push_back
int x = v[0];                   // 不检查边界
int y = v.at(0);                // 检查越界（抛异常）
v[0] = 8;
int last = v.back();            // 先确认非空
v.pop_back();                   // 删除末尾，返回 void
v.insert(v.begin() + 1, 7);     // O(n)
v.erase(v.begin());             // O(n)
int n = (int)v.size();
bool empty = v.empty();
sort(v.begin(), v.end());
reverse(v.begin(), v.end());
v.clear();
```

- `v.front()` / `v.back()` 是首尾元素，`v.begin()` / `v.end()` 是迭代器。
- `v.erase(remove(v.begin(), v.end(), 7), v.end());`：删除所有等于 7 的元素（C++17 常用写法）。

## 3. 栈（LIFO）

三种语言都可以直接用动态数组当栈。末尾入栈/出栈均摊 O(1)。Java 的 `ArrayList`、Rust 的 `Vec`、C++ 的 `vector` 都能实现；不必为了“栈”单独选专用容器。

### Java

```java
// 方案 A：ArrayList 直接当栈
ArrayList<Integer> st = new ArrayList<>();
st.add(10);                              // push
st.add(20);
int top = st.get(st.size() - 1);        // top/peek
int popped = st.remove(st.size() - 1);  // pop，返回元素

// 方案 B：通常更推荐 ArrayDeque
Deque<Integer> s = new ArrayDeque<>();
s.push(10);        // 入栈
s.push(20);
int t = s.peek();  // 看栈顶；空时 null
int p = s.pop();   // 弹出；空时抛异常
```

- `Stack<T>` 是旧类，算法题更常用 `ArrayDeque<T>`；`ArrayDeque` 不允许放 `null`。

### Rust

```rust
let mut st: Vec<i32> = Vec::new();
st.push(10);
st.push(20);
let top = st.last();   // Option<&i32>
let popped = st.pop(); // Option<i32>，空时 None
```

- `Vec<T>` 就是 Rust 最自然的栈实现。

### C++

```cpp
// 方案 A：vector 直接当栈
vector<int> st;
st.push_back(10);
st.push_back(20);
int top = st.back();
st.pop_back();            // 不返回弹出的值

// 方案 B：容器适配器 stack
stack<int> s;
s.push(10);
int t = s.top();
s.pop();
bool empty = s.empty();
```

- **注意差异：**Java `ArrayDeque.pop()` 返回元素；Rust `Vec.pop()` 返回 `Option<T>`；C++ `vector.pop_back()` 和 `stack.pop()` 都**不返回**元素。

## 4. 普通队列（FIFO）

### Java：`ArrayDeque`

```java
Queue<Integer> q = new ArrayDeque<>();
q.offer(1);                 // 尾部入队；通常成功返回 true
q.offer(2);
Integer head = q.peek();    // 查看队头；空时 null
Integer removed = q.poll(); // 队头出队；空时 null
int n = q.size();
```

- `add/remove/element` 遇到相应失败情况通常抛异常；算法题习惯 `offer/poll/peek`。

### Rust：`VecDeque`

```rust
use std::collections::VecDeque;
let mut q = VecDeque::new();
q.push_back(1);
q.push_back(2);
let head = q.front();       // Option<&i32>
let removed = q.pop_front(); // Option<i32>
let n = q.len();
```

### C++：`queue`

```cpp
queue<int> q;
q.push(1);
q.push(2);
int head = q.front();      // 先检查非空
q.pop();                   // 不返回元素
int n = (int)q.size();
```

- 三者的入队、出队、取队头通常均摊 O(1)。

## 5. 双向队列（deque）

### Java：`ArrayDeque`

```java
Deque<Integer> d = new ArrayDeque<>();
d.offerFirst(1);          // 头部插入
d.offerLast(2);           // 尾部插入
Integer a = d.peekFirst(); // 查看头部
Integer b = d.peekLast();  // 查看尾部
Integer x = d.pollFirst(); // 头部弹出
Integer y = d.pollLast();  // 尾部弹出
```

- 也有 `addFirst/addLast/removeFirst/removeLast/getFirst/getLast`；空时 `poll/peek` 返回 `null`，`remove/get` 抛异常。
- `ArrayDeque` **没有按下标随机访问**的方法。

### Rust：`VecDeque`

```rust
use std::collections::VecDeque;
let mut d = VecDeque::new();
d.push_front(1);
d.push_back(2);
let a = d.front();          // Option<&T>
let b = d.back();
let x = d.pop_front();      // Option<T>
let y = d.pop_back();
let maybe = d.get(0);       // 支持 O(1) 下标访问
```

### C++：`deque`

```cpp
deque<int> d;
d.push_front(1);
d.push_back(2);
int a = d.front();
int b = d.back();
d.pop_front();
d.pop_back();
int x = d[0];              // 支持 O(1) 下标访问
```

- 三者头尾插入/删除通常为 O(1)；中间插入并非 O(1)。单调队列常用 deque。

## 6. 优先队列 / 堆（priority queue）

**堆只保证堆顶是最大/最小值，不保证整体有序。**插入、弹出 O(log n)，查看堆顶 O(1)。

### Java：`PriorityQueue`，默认**小根堆**

```java
PriorityQueue<Integer> minH = new PriorityQueue<>();
minH.offer(5);
minH.offer(2);
int smallest = minH.peek();  // 2
int removed = minH.poll();   // 2

PriorityQueue<Integer> maxH =
    new PriorityQueue<>(Comparator.reverseOrder());
maxH.offer(5);
maxH.offer(2);
int largest = maxH.peek();   // 5

// 按 int[0] 升序（避免 a[0] - b[0] 溢出）
PriorityQueue<int[]> pq =
    new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
```

- `peek/poll` 空时为 `null`；不能假设直接遍历 `PriorityQueue` 就是排序结果。

### Rust：`BinaryHeap`，默认**大根堆**

```rust
use std::collections::BinaryHeap;
use std::cmp::Reverse;

let mut max_h = BinaryHeap::new();
max_h.push(5);
max_h.push(2);
let largest = max_h.peek();  // Some(&5)
let popped = max_h.pop();    // Some(5)

let mut min_h = BinaryHeap::new();
min_h.push(Reverse(5));
min_h.push(Reverse(2));
let smallest = min_h.pop().map(|Reverse(x)| x); // Some(2)
```

- 多关键字可推入 `(priority, id)` 元组，按字典序比较；小根堆可包装 `Reverse((priority, id))`。

### C++：`priority_queue`，默认**大根堆**

```cpp
priority_queue<int> maxH;
maxH.push(5);
maxH.push(2);
int largest = maxH.top();
maxH.pop();                 // 不返回元素

priority_queue<int, vector<int>, greater<int>> minH;
minH.push(5);
minH.push(2);
int smallest = minH.top();

// pair 默认按 first 再 second 比较
priority_queue<pair<int,int>, vector<pair<int,int>>,
               greater<pair<int,int>>> pairsMin;
```

- `top()` 要先确保非空。Dijkstra 中常用“小根堆 + 放入重复状态 + 弹出时跳过过期状态”；三种语言的这些堆都不直接提供通用的 decrease-key。

## 7. HashSet：不重复元素集合（无序）

### Java

```java
HashSet<Integer> s = new HashSet<>();
s.add(3);                     // 返回是否是新插入
boolean has = s.contains(3);
s.remove(3);                  // 返回是否成功删除
int n = s.size();
for (int x : s) { /* ... */ }
```

### Rust

```rust
use std::collections::HashSet;
let mut s: HashSet<i32> = HashSet::new();
s.insert(3);                  // bool：此前不存在时 true
let has = s.contains(&3);
s.remove(&3);                  // bool
let n = s.len();
for &x in &s { /* ... */ }
```

### C++

```cpp
unordered_set<int> s;
s.insert(3);
bool has = s.count(3) > 0;    // C++17 常用
s.erase(3);                   // 返回被删除个数（0 或 1）
int n = (int)s.size();
for (int x : s) { /* ... */ }
```

- 平均插入/删除/查询 O(1)，最坏情况可能退化；**都不保证遍历顺序**。

## 8. HashMap：键值对映射 / 频率统计（无序）

### Java：`HashMap<K,V>`

```java
Map<String, Integer> mp = new HashMap<>();
mp.put("a", 2);
Integer v = mp.get("a");              // 不存在时 null
int cnt = mp.getOrDefault("z", 0);
boolean has = mp.containsKey("a");
mp.remove("a");
mp.merge("x", 1, Integer::sum);        // 词频 +1
mp.computeIfAbsent("k", k -> 0);       // 不存在时生成值
for (Map.Entry<String, Integer> e : mp.entrySet()) {
    String key = e.getKey();
    int value = e.getValue();
}
```

- 频率统计常用 `mp.put(x, mp.getOrDefault(x, 0) + 1)`。
- `get` 返回 `null` 不能单独区分“无键”和“键对应 null”，需要 `containsKey`（算法题一般不存 null）。

### Rust：`HashMap<K,V>`

```rust
use std::collections::HashMap;
let mut mp: HashMap<String, i32> = HashMap::new();
mp.insert("a".to_string(), 2);
let v = mp.get("a");                  // Option<&i32>
let has = mp.contains_key("a");
mp.remove("a");                       // Option<i32>
*mp.entry("x".to_string()).or_insert(0) += 1;
for (key, value) in &mp { /* &String, &i32 */ }
```

- 简单计数也可以 `HashMap<i32, i32>`；键必须满足 `Eq + Hash`。
- `entry(key).or_insert(default)` 返回可变引用，可以直接更新。
- `or_default`可以替代上面那个`or_insert(default)`

### C++：`unordered_map<K,V>`

```cpp
unordered_map<string, int> mp;
mp["a"] = 2;
int cnt = mp.count("z") ? mp.at("z") : 0;
bool has = mp.count("a") > 0;
mp.erase("a");
mp["x"]++;                            // 频率 +1
for (const auto& [key, value] : mp) { /* ... */ }
```

- **陷阱：**`mp[key]` 在键不存在时会自动插入默认值（对于 `int` 是 0）；只想查找、不修改用 `find`、`count` 或 `at`（`at` 找不到会抛异常）。

## 9. 有序 Map：按键排序 / 查找前驱后继

### Java：`TreeMap`

```java
TreeMap<Integer, String> mp = new TreeMap<>();
mp.put(10, "a");
mp.put(20, "b");
mp.get(10);
mp.remove(10);
Integer low = mp.floorKey(15);        // <= 15 的最大键，或 null
Integer high = mp.ceilingKey(15);     // >= 15 的最小键，或 null
Integer smaller = mp.lowerKey(20);    // < 20
Integer larger = mp.higherKey(20);    // > 20
// 非空时 firstKey() / lastKey()
```

### Rust：`BTreeMap`

```rust
use std::collections::BTreeMap;
let mut mp = BTreeMap::new();
mp.insert(10, "a");
mp.insert(20, "b");
let v = mp.get(&10);
mp.remove(&10);
let floor = mp.range(..=15).next_back(); // Option<(&K, &V)>
let ceil = mp.range(15..).next();        // Option<(&K, &V)>
let first = mp.first_key_value();
let last = mp.last_key_value();
```

### C++：`map`

```cpp
map<int, string> mp;
mp[10] = "a";
mp[20] = "b";
auto it = mp.lower_bound(15);   // 第一个 >= 15 的迭代器
auto jt = mp.upper_bound(15);   // 第一个 > 15 的迭代器
if (it != mp.end()) { /* it->first, it->second */ }
// 前驱 (<15)：
if (it != mp.begin()) {
    auto prevIt = prev(it);
    // prevIt->first
}
```

- 三者按键有序，插入/删除/查询一般 O(log n)。C++ `map[key]` 也会在缺失时插入默认值。

## 10. 有序 Set：排序、前驱后继

### Java：`TreeSet`

```java
TreeSet<Integer> s = new TreeSet<>();
s.add(10);
s.add(20);
s.contains(10);
s.remove(10);
Integer a = s.floor(15);       // <= 15
Integer b = s.ceiling(15);     // >= 15
Integer c = s.lower(20);       // < 20
Integer d = s.higher(20);      // > 20
// 非空时 first()、last()；pollFirst()、pollLast() 会弹出
```

### Rust：`BTreeSet`

```rust
use std::collections::BTreeSet;
let mut s = BTreeSet::new();
s.insert(10);
s.insert(20);
s.contains(&10);
s.remove(&10);
let floor = s.range(..=15).next_back(); // Option<&i32>
let ceil = s.range(15..).next();        // Option<&i32>
let first = s.first();
let last = s.last();
```

### C++：`set`

```cpp
set<int> s = {10, 20};
s.insert(30);
bool has = s.count(10) > 0;
s.erase(10);
auto it = s.lower_bound(15);    // 第一个 >= 15
auto jt = s.upper_bound(15);    // 第一个 > 15
if (it != s.end()) { int x = *it; }
if (it != s.begin()) { int floor = *prev(it); } // < 15 的最大值
```

- 如果允许重复键：Java 用 `TreeMap<T,Integer>` 自己维护计数；Rust 用 `BTreeMap<T,usize>`；C++ 直接 `multiset<T>`。

## 11. 字符串与字符序列

### Java

```java
String s = "abc def";
int n = s.length();
char c = s.charAt(0);
String part = s.substring(1, 4);      // [1, 4)
boolean has = s.contains("bc");
int pos = s.indexOf('d');             // 找不到 -1
String[] pieces = s.split(",");      // 参数为正则表达式
String replaced = s.replace("a", "x");
String reversed = new StringBuilder(s).reverse().toString();
StringBuilder sb = new StringBuilder();
sb.append("ab").append(123);
sb.setCharAt(0, 'A');
sb.deleteCharAt(sb.length() - 1);
String result = sb.toString();
```

- `String` 不可变，循环里大量拼接用 `StringBuilder`。
- 比较内容用 `s1.equals(s2)`，不要用 `==`；`char` 是 UTF-16 代码单元，不总是完整 Unicode 字符。

### Rust

```rust
let s = String::from("abc def");
let n = s.len();                    // UTF-8 字节数，不一定是字符数
let c = s.chars().next();          // Option<char>
let part = &s[1..4];               // 字节区间且必须位于 UTF-8 边界
let has = s.contains("bc");
let pos = s.find('d');             // Option<usize>（字节偏移）
let pieces: Vec<&str> = s.split(',').collect();
let replaced = s.replace("a", "x");
let reversed: String = s.chars().rev().collect();
let mut t = String::from("ab");
t.push('c');
t.push_str("def");
t.pop();                         // 删除末尾一个 char
```

- `String` **不能** `s[0]` 按下标取字符；纯 ASCII 可用 `s.as_bytes()[0]`，一般 Unicode 用 `.chars()`。
- `String` 持有所有权，`&str` 是字符串切片；`s.len()` 统计字节，`s.chars().count()` 统计 Unicode 标量值。

### C++

```cpp
string s = "abc def";
int n = (int)s.size();
char c = s[0];
string part = s.substr(1, 3);   // (起始位置, 长度)，不是结束位置
bool has = s.find("bc") != string::npos;
size_t pos = s.find('d');       // 找不到 string::npos
s += "xyz";
s.push_back('!');
s.pop_back();
reverse(s.begin(), s.end());
string num = to_string(123);
int x = stoi("123");
long long y = stoll("1234567890123");
```

- `s[i]` 获取一个 `char`（对 UTF-8 非 ASCII 文本通常只是其中一个字节）。

## 12. 排序、比较器、二分查找

### Java

```java
int[] a = {4, 1, 3};
Arrays.sort(a);
int pos = Arrays.binarySearch(a, 3); // 找到返回某个匹配索引
// 没找到返回 -(插入位置) - 1；插入位置为 lower_bound

Integer[] b = {4, 1, 3};
Arrays.sort(b, Comparator.reverseOrder());

int[][] pairs = {{2, 5}, {1, 8}, {2, 3}};
Arrays.sort(pairs, (x, y) -> {
    int c = Integer.compare(x[0], y[0]);
    return c != 0 ? c : Integer.compare(x[1], y[1]);
});
```

- 对已排序的 `List<T>` 可使用 `Collections.binarySearch(list, key)`；都要求先满足相应的升序排序规则。
- Java 没有直接对应 C++ `lower_bound` 的独立通用方法，需利用 `binarySearch` 结果或自己写二分（有重复元素时 `binarySearch` 不保证返回第一个）。

### Rust

```rust
let mut a = vec![4, 1, 3];
a.sort();
let found = a.binary_search(&3);  // Result<usize, usize>
let lb = a.partition_point(|&x| x < 3);  // 首个 >= 3
let ub = a.partition_point(|&x| x <= 3); // 首个 > 3

a.sort_by(|x, y| y.cmp(x));       // 降序
let mut pairs = vec![(2, 5), (1, 8), (2, 3)];
pairs.sort();                    // 元组按字典序排序
```

- `binary_search` 在找到重复元素时不保证返回首个；`partition_point` 适合查左右边界。

### C++

```cpp
vector<int> a = {4, 1, 3};
sort(a.begin(), a.end());
auto it = lower_bound(a.begin(), a.end(), 3); // 首个 >= 3
auto jt = upper_bound(a.begin(), a.end(), 3); // 首个 > 3
int lb = (int)(it - a.begin());
bool has = binary_search(a.begin(), a.end(), 3);
sort(a.begin(), a.end(), greater<int>());     // 降序
vector<pair<int,int>> pairs = {{2,5}, {1,8}, {2,3}};
sort(pairs.begin(), pairs.end());             // 按 first 再 second
```

- `lower_bound/upper_bound` 对有序随机访问序列的查找为 O(log n)；传入的序列必须按对应比较规则已排序。

## 13. 二元组、多维动态数组、邻接表

### Java

```java
int[][] points = {{1, 2}, {3, 4}};       // 简单二元组可用 int[2]
List<List<Integer>> g = new ArrayList<>();
int n = 5;
for (int i = 0; i < n; i++) g.add(new ArrayList<>());
g.get(0).add(1);                        // 邻接表：0 -> 1
int[][] grid = new int[3][4];
```

- Java 没有统一的内建 `Pair` 类；竞赛中 `int[]`、自定义 `record Pair(int x,int y) {}`（Java 16+）都常见。

### Rust

```rust
let p = (1i32, 2i32);
let x = p.0;
let mut g: Vec<Vec<usize>> = vec![Vec::new(); 5];
g[0].push(1);
let grid = vec![vec![0i32; 4]; 3];
```

### C++

```cpp
pair<int,int> p = {1, 2};
int x = p.first;
vector<vector<int>> g(5);
g[0].push_back(1);
vector<vector<int>> grid(3, vector<int>(4, 0));
```

---

# 输入与输出

## 14. 标准输入：读取空格、Tab、换行分隔的数字/单词

假设输入：

```text
3
10   20  30
```

### Java：`Scanner` 简单，但较慢

```java
Scanner sc = new Scanner(System.in);
int n = sc.nextInt();
int a = sc.nextInt(); // 10
int b = sc.nextInt(); // 20
int c = sc.nextInt(); // 30
String word = sc.next();
```

- `Scanner` 的 `nextInt/next/nextLong` 默认跳过空格、Tab、换行等空白，**不关心一行里有几个数**。
- 数据量大时更推荐 `BufferedReader + StringTokenizer` 或文末快速输入模板。

### Rust：一次读入 + `split_whitespace()`

```rust
use std::io::{self, Read};
let mut input = String::new();
io::stdin().read_to_string(&mut input).unwrap();
let mut it = input.split_whitespace();
let n: usize = it.next().unwrap().parse().unwrap();
let a: i32 = it.next().unwrap().parse().unwrap();
let b: i32 = it.next().unwrap().parse().unwrap();
let c: i32 = it.next().unwrap().parse().unwrap();
```

- `split_whitespace` 自动忽略连续空白和换行，竞赛中很好用。全部读入会占用与输入规模相当的内存。

### C++：`cin >>`

```cpp
int n, a, b, c;
cin >> n >> a >> b >> c;
string word;
cin >> word; // 只读到下一个空白位置
```

- `cin >>` 自动跳过连续空白（空格、Tab、换行等），与 Rust `split_whitespace` / Java `Scanner.next` 类似。

## 15. 读取完整的一行（保留中间的空格）

假设输入一行：`hello   world`。这与按空白读取单词不同。

### Java

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
String line = br.readLine();       // 不含结尾换行；EOF 返回 null
String[] pieces = line.trim().split("\\s+"); // 按连续空白切分
// 如果需要保留开头/结尾空格：不要 trim()
```

- `Scanner.nextLine()` 也可以读整行，但紧接在 `nextInt()` 后可能读到该数字后剩下的空行；一般尽量**不要混用**，或先处理残留换行。

### Rust

```rust
use std::io;
let mut line = String::new();
io::stdin().read_line(&mut line).unwrap(); // 一般包含结尾 \n
let line = line.trim_end_matches(&['\r', '\n'][..]); // 只去掉行尾换行
let pieces: Vec<&str> = line.split_whitespace().collect();
```

- `read_line` 追加到 `String`，在循环重复使用时先调用 `line.clear()`。
- 只读一行不需要把整个输入一次读入。

### C++

```cpp
string line;
getline(cin, line);         // 读取整行，不包含 '\n'
istringstream iss(line);
string word;
while (iss >> word) {       // 将本行按空白拆成单词
    // ...   
}
```

- **混用 `cin >> n` 和 `getline`：**`cin >> n; cin.ignore(numeric_limits<streamsize>::max(), '\n'); getline(cin, line);`，先丢弃当前行的剩余内容。
- 也可 `getline(cin >> ws, line)` 跳过开头全部空白，但**会丢失下一行原本的前导空格**；要保留空白时不要这样用。

## 16. 自定义分隔符（逗号、冒号、单个空格）

示例行：`12,34,56`

### Java

```java
String line = "12,34,56";
String[] fields = line.split(",");
int x = Integer.parseInt(fields[0]);
String[] ws = "1   2\t3".trim().split("\\s+");
String[] keepEmpty = "a,,b,".split(",", -1); // 保留末尾空字段
```

- `String.split()` 参数是**正则**，例如字面量 `.` 要写 `split("\\.")`。
- `split(" ")` 只按一个空格切，而 `split("\\s+")` 按连续空白切。

### Rust

```rust
let line = "12,34,56";
let nums: Vec<i32> = line.split(',')
    .map(|s| s.parse::<i32>().unwrap())
    .collect();
let fields: Vec<&str> = "a,,b,".split(',').collect(); // 保留空字段
let ws: Vec<&str> = "1   2\t3".split_whitespace().collect();
```

- `split(' ')` 会产生空字段；`split_whitespace()` 不会。

### C++

```cpp
string line = "12,34,56";
istringstream iss(line);
string field;
vector<int> nums;
while (getline(iss, field, ',')) {
    nums.push_back(stoi(field));
}
```

- `getline(stream, field, ',')` 可以指定单字符分隔符；若可能有空字段，先检查 `field.empty()` 再 `stoi`。
- `getline` 对末尾分隔符的空字段处理与 Java/Rust 不完全一样，若必须精确保留末尾空字段需要额外处理。

## 17. 读到 EOF / 多组测试数据

### Java

```java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
String line;
while ((line = br.readLine()) != null) {
    if (line.isBlank()) continue;
    // 处理一行
}
```

- 用文末 `FastScanner` 模板则是 `while ((token = fs.next()) != null)`。

### Rust

```rust
use std::io::{self, BufRead};
for line in io::stdin().lock().lines() {
    let line = line.unwrap();
    // 处理一行
}
```

- 已全部读入并分词时：`while let Some(token) = it.next() { ... }`。

### C++

```cpp
int x;
while (cin >> x) {           // 直到输入结束或解析失败
    // ...
}
// 按行读到 EOF：while (getline(cin, line)) { ... }
```

- 已知组数 `T` 时，三种语言都可以先读 `T`，再循环 `T` 次；不用依赖 EOF。

## 18. 输出：正常打印和格式控制

常见需求：保留 3 位小数、整数补零至 5 位、宽度 8 右对齐、十六进制输出。

### Java：`printf` / `String.format`

```java
System.out.println("hello");
System.out.print(123);
System.out.printf("%.3f%n", 3.1415926); // 3.142（依赖 Locale 的小数符号）
System.out.printf("%05d%n", 42);       // 00042
System.out.printf("%8d%n", 42);       // 右对齐，宽度 8
System.out.printf("%-8s|%n", "hi");  // 左对齐
System.out.printf("%x%n", 255);       // ff
String str = String.format("%d:%s", 7, "ok");
// 需要稳定使用 '.' 作为小数点：
System.out.printf(Locale.US, "%.3f%n", 3.1415926);
```

- 常见格式：`%d` 整数、`%f` 浮点、`%s` 字符串、`%c` 字符、`%x` 十六进制、`%n` 平台换行。
- 大量输出可用 `StringBuilder` 汇总，再 `System.out.print(sb)`；注意输出体量可能很大。

### Rust：`println!` / `format!` / `write!`

```rust
println!("hello");
print!("{}", 123);
println!("{:.3}", 3.1415926); // 3.142
println!("{:05}", 42);        // 00042
println!("{:>8}", 42);        // 右对齐，宽度 8
println!("{:<8}|", "hi");    // 左对齐
println!("{:x}", 255);        // ff
println!("{:b}", 10);         // 1010
println!("{:?}", vec![1, 2]); // 调试格式 [1, 2]
let str = format!("{}:{}", 7, "ok");
```

- `{}` 通过 `Display` 格式化；`{:?}` 是 `Debug` 格式。
- 大量输出：`use std::io::{self, Write}; let mut out = io::BufWriter::new(io::stdout().lock()); writeln!(out, "{}", 123).unwrap();`。

### C++：`cout` / `<iomanip>` / `printf`

```cpp
cout << "hello\n";
cout << fixed << setprecision(3) << 3.1415926 << '\n'; // 3.142
cout << setfill('0') << setw(5) << 42 << '\n';          // 00042
cout << setfill(' ') << setw(8) << 42 << '\n';          // 右对齐
cout << left << setw(8) << "hi" << '|' << '\n';        // 左对齐
cout << right << hex << 255 << dec << '\n';            // ff，再恢复十进制
printf("%.3f %05d\n", 3.1415926, 42);                 // C 风格也能用
```

- `fixed`、`setprecision`、`setfill`、`left/right`、`hex/dec` 等**状态可持续**；`setw` 通常只对下一个字段生效。
- `endl` 会刷新缓冲区，普通竞赛输出通常优先 `'\n'`。

## 19. 输入输出性能

### Java

- `Scanner` 最方便但常较慢；大输入使用 `BufferedReader + StringTokenizer` 或字节缓冲输入。
- 输出很多时用 `StringBuilder` / `BufferedWriter` / `PrintWriter`。

### Rust

- `read_to_string` + `split_whitespace` 简洁、通常足够快；超大数据也可写字节扫描器。
- 大量输出用 `BufWriter`，避免每次单独加锁、刷新。

### C++

```cpp
ios::sync_with_stdio(false);
cin.tie(nullptr);
```

- 放在输入前；关闭同步后，不建议混用 `cin/cout` 与 `scanf/printf`。
- 使用 `\n` 而不是频繁 `endl`。

## 20. 文件输入输出（本地调试 / 有文件要求的题）

### Java

```java
// Java 17+；使用 UTF-8
try (BufferedReader br = java.nio.file.Files.newBufferedReader(
         java.nio.file.Path.of("input.txt"), java.nio.charset.StandardCharsets.UTF_8);
     BufferedWriter bw = java.nio.file.Files.newBufferedWriter(
         java.nio.file.Path.of("output.txt"), java.nio.charset.StandardCharsets.UTF_8)) {
    String line = br.readLine();
    bw.write(line == null ? "" : line);
    bw.newLine();
}
```

### Rust

```rust
use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::fs::File;

let text = fs::read_to_string("input.txt").unwrap();
let file = File::open("input.txt").unwrap();
let reader = BufReader::new(file);
for line in reader.lines() { let _line = line.unwrap(); }
let mut out = File::create("output.txt").unwrap();
writeln!(out, "{}", text.len()).unwrap();
```

### C++

```cpp
ifstream fin("input.txt");
ofstream fout("output.txt");
int x;
if (fin >> x) {
    fout << x << '\n';
}
// 也可 getline(fin, line)
```

- 在线评测一般读标准输入、写标准输出。文件流主要用于明确要求的文件题或本地测试。

## 21. ASCII 码、大小写、字符与数字互转

ASCII 中：`'0'..'9'` 为 48..57；`'A'..'Z'` 为 65..90；`'a'..'z'` 为 97..122。**大小写字母相差 32；数字字符与数字相差 `'0'`。**以下字符运算主要针对 ASCII。

### Java

```java
char c = 'A';
int ascii = (int)c;                   // 65（char 的 UTF-16 数值）
char ch = (char)65;                   // 'A'
char low = Character.toLowerCase(c); // 'a'
char up = Character.toUpperCase('b');
boolean digit = Character.isDigit('5');
boolean letter = Character.isLetter('A');
int digitVal = '7' - '0';             // 7，仅针对 ASCII 数字
char digitChar = (char)('0' + 7);     // '7'
int num = Integer.parseInt("123");
String s = String.valueOf(123);
String lowered = "HeLLo".toLowerCase(Locale.ROOT);
```

- `Character.isDigit/isLetter` **包含 Unicode 字符**，如果只想判断 ASCII：`c >= '0' && c <= '9'` 或 `c >= 'A' && c <= 'Z'`。
- 对 ASCII `char`，大写转小写可写 `(char)(c - 'A' + 'a')`，但须先判断 `c` 在 `'A'..'Z'`。

### Rust

```rust
let c = 'A';
let code = c as u32;             // 65，Unicode 标量值
let ch = char::from(b'A');       // 'A'
let low = c.to_ascii_lowercase(); // 'a'
let up = 'b'.to_ascii_uppercase();
let digit = '5'.is_ascii_digit();
let letter = 'A'.is_ascii_alphabetic();
let val = ('7' as u8 - b'0') as i32; // 7
let digit_char = char::from(b'0' + 7);
let num: i32 = "123".parse().unwrap();
let s = 123.to_string();
let lowered = "HeLLo".to_ascii_lowercase();
```

- Rust 的 `char` 是 Unicode 标量值、`u8` 是字节。纯 ASCII 字符串常用 `s.bytes()`；一般文本用 `s.chars()`。
- Unicode 大小写映射可能不止一个字符，针对 ASCII 题优先 `to_ascii_lowercase/to_ascii_uppercase`。

### C++

```cpp
char c = 'A';
int ascii = (unsigned char)c;          // ASCII 情况为 65
char ch = (char)65;                    // 'A'
char low = (char)tolower((unsigned char)c); // 'a'
char up = (char)toupper((unsigned char)'b');
bool digit = isdigit((unsigned char)'5');
bool letter = isalpha((unsigned char)'A');
int val = '7' - '0';                  // 7
char digitChar = '0' + 7;            // '7'
int num = stoi("123");
string s = to_string(123);
```

- `<cctype>` 的 `tolower/toupper/isdigit/isalpha` 接受 `EOF` 或可表示为 `unsigned char` 的值，所以传 `char` 时宜先转 `unsigned char`，防止负值引发未定义行为。
- `tolower` 的具体字符分类受当前 C locale 影响；只处理 ASCII 时可直接做区间判断。

## 22. 常见字符编码、按字节遍历与易错点

### Java

```java
byte[] bytes = "ABC".getBytes(java.nio.charset.StandardCharsets.US_ASCII);
for (byte b : bytes) { System.out.println(b & 0xff); }
for (char ch : "ABC".toCharArray()) { /* ... */ }
```

- Java `charAt(i)` 对 ASCII 很方便；处理非 BMP Unicode 字符时需要考虑代理项，可用 `codePoints()`。

### Rust

```rust
for b in "ABC".bytes() { /* u8: 65, 66, 67 */ }
for ch in "ABC".chars() { /* char: 'A', 'B', 'C' */ }
```

- 非 ASCII 文本中，一个字符可能占多个 UTF-8 字节；不能把 `bytes()` 当作普适“按字符遍历”。

### C++

```cpp
for (unsigned char b : string("ABC")) { /* 数值 65, 66, 67 */ }
for (char ch : string("ABC")) { /* ... */ }
```

- `std::string` 按字节存储，默认不会自动把 UTF-8 解码成 Unicode 字符。

---

# 可直接复制的算法题主函数模板

## 23. Java：`BufferedReader + StringTokenizer` 快速读整数

```java
import java.io.*;
import java.util.*;

public class Main {
    static class FastScanner {
        private final BufferedReader br =
            new BufferedReader(new InputStreamReader(System.in));
        private StringTokenizer st;

        String next() throws IOException {
            while (st == null || !st.hasMoreTokens()) {
                String line = br.readLine();
                if (line == null) return null; // EOF
                st = new StringTokenizer(line);
            }
            return st.nextToken();
        }
        int nextInt() throws IOException { return Integer.parseInt(next()); }
        long nextLong() throws IOException { return Long.parseLong(next()); }
    }

    public static void main(String[] args) throws Exception {
        FastScanner fs = new FastScanner();
        int n = fs.nextInt();
        long sum = 0;
        for (int i = 0; i < n; i++) sum += fs.nextInt();
        System.out.println(sum);
    }
}
```

> 这个模板按**空白分词**，不适用于需要保留整行空格的输入。在线评测一般类名必须为 `Main`。

## 24. Rust：一次读入 + 迭代器

```rust
use std::io::{self, Read};

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut it = input.split_whitespace();

    let n: usize = it.next().unwrap().parse().unwrap();
    let mut sum = 0i64;
    for _ in 0..n {
        let x: i64 = it.next().unwrap().parse().unwrap();
        sum += x;
    }
    println!("{}", sum);
}
```

> 对 UTF-8 文本输入非常方便；遇到超大数据或极致性能需求时再考虑字节扫描器。

## 25. C++：快读配置 + `cin`

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    long long sum = 0;
    for (int i = 0; i < n; ++i) {
        long long x;
        cin >> x;
        sum += x;
    }
    cout << sum << '\n';
    return 0;
}
```

---

## 26. 常见操作复杂度（平均/均摊情形）

| 操作 | 典型复杂度 | 备注 |
|---|---:|---|
| 数组 / 动态数组按下标访问 | O(1) | Java `ArrayList`、Rust `Vec`、C++ `vector` |
| 动态数组尾部追加 / 弹出 | 均摊 O(1) | 扩容时单次可能 O(n) |
| 动态数组中间插入 / 删除 | O(n) | 需要移动元素 |
| 栈 push / pop / top | O(1)（通常/均摊） | 用上述栈实现 |
| 普通队列入队 / 出队 | O(1)（通常/均摊） | 以双端队列实现 |
| 双端队列头尾插入 / 删除 | O(1)（通常/均摊） | 不等于任意位置 O(1) |
| 哈希 Set / Map 查找、插入、删除 | 平均 O(1) | 最坏可能退化 |
| 有序 Set / Map 查找、插入、删除 | O(log n) | 平衡树 / B 树 |
| 优先队列入堆 / 出堆 | O(log n) | 查堆顶 O(1) |
| 普通数组排序 | O(n log n)（一般情况） | 具体最坏界取决于语言与排序实现 |
| 有序数组二分查找 | O(log n) | 需要满足排序/划分前提 |

## 27. 最容易搞混的 10 点

1. **三种语言都能用动态数组当栈：**Java `ArrayList.add/remove(size-1)`；Rust `Vec.push/pop`；C++ `vector.push_back/pop_back`。
2. **堆默认方向不同：**Java `PriorityQueue` 默认小根堆；Rust `BinaryHeap` 和 C++ `priority_queue` 默认大根堆。
3. **C++ 的 `pop()` 不返回元素**，Java 队列的 `poll()` 返回元素，Rust 的 `pop()` 返回 `Option<T>`。
4. **Java `remove(int)` 在 `ArrayList<Integer>` 中按索引删**，不是按数值删。
5. **Rust `Vec` 可索引，`String` 不能按整数索引。**
6. **哈希表遍历不保证顺序**；需要有序用 `TreeMap / BTreeMap / map`。
7. **C++ 的 `mp[key]` 可能新建键**；Java 的 `mp.get(key)` 不会。
8. **读取整行与读取单词不同**：Java `readLine`、Rust `read_line`、C++ `getline` 保留行内空格。
9. **Java `split` 是正则表达式**；`split("\\s+")` 才是按连续空白切分。
10. **数组越界表现不同**：Java 抛异常、Rust 通常 panic、C++ `operator[]` 越界是未定义行为（不保证报错）。

> 学习顺序建议：先熟练“动态数组 → 栈/队列/deque → HashMap/HashSet → 堆 → 排序二分 → 标准输入输出”，再看有序树容器和文件流。大多数基础算法题已经足够。
