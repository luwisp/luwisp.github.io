---
title: rust基础语法
date: 2026-07-07T00:00:00
summary: rust基础语法
minutes: 10
---

# 基本语法

## 基本类型
i8, i16, i32, i64, i128 , signed integer types
u8, u16, u32, u64, u128 , unsigned integer types
f32, f64 , floating-point types
bool , boolean type


```
let a:i32 = 1;
let a:&str = "hello";
let mut a:String = String::new();
```

## 函数
有点像javascript和python的混合版本
```rust
fn f(a:i32,b:i32)->i32{
	return a+b;
}
```
有个特殊的语法，可以达到类似lambda函数的样子

对于上面那个函数，可以进行简化

返回最后一条语句的值，不用写return和;
```
fn f(a:i32,b:i32)->i32{a+b}
```
又或者有这样的函数
```rust
fn f(a:i32) -> i32 {
	a -= 5;
	if a > 5 {
		a-5
	} else {
		a
	}
}
```
## 控制流
if-else:
```rust
if a == 5 {

}else if b != 1 {

}else{
}

let a = if b==1 {1} else {2};
```
while:
```rust
while a!=0 {
	a-=1;
}
```
loop,相当于while true,不过可以有返回值：
```rust
let a = loop{
	b--;
	if b==0 {break 1;}
};
```
for循环，不过更像python的
```rust

for x in (0..5) {
}

for x in (0..5).rev() {
}

for x in (0..5).step_by(2) {
}

let mut arr = [1,2,3];

for x in arr{
}

for x in &mut arr {
	*x *= 2;
}

for (i,x) in arr.iter().enumerate() {
}
```
> 范围表达式 （0..5）

| 语法      | 含义         | 示例               |
| ------- | ---------- | ---------------- |
| `0..5`  | 左闭右开       | 0, 1, 2, 3, 4    |
| `0..=5` | 左闭右闭       | 0, 1, 2, 3, 4, 5 |
| `..5`   | 小于 5       | 常用于切片            |
| `..=5`  | 小于等于 5     | 常用于切片            |
| `3..`   | 从 3 开始，无上界 |                  |
| `..`    | 整个范围       | 常用于切片            |


match,类似加强版的switch,见下方


# 字符串
String是可修改的、有所有权的字符串
而&str是指向字符串的指针，但指向内容不是可修改的
```rust
//返回String类型

let a = String::new()      //
String.from("abc") //参数可以是&str或String
format!("{}",1)    //

//&str

"abc";
let b = &String::new();
fn response(input: &str) {}//传入函数通常以&str形式
let c = a.as
```
## 字符串操作
### starts_with

### strip_prefix

> 字符串的下标切片
> 类似python, 对于字符串let s = “abc”， 
> s[2..] 是"c"
> s[1..2]是"bc"
> 但是它是按字节索引的，对于中文字符串，一个中文可能占几个字节

## 字符串在match
有点像java的switch,但是可以额外加些条件判断
```rust
match input{
	"hello" =>{},
	"\help" =>{},
	command if command.startswith("\") =>{},
	_ => {}
}
```

# enum类型
```rust
enum TYPE{
	A,
	B(String)
}
```
和c不同，enum里可以有内容，比如上面B里面有个String
## enum在match
```rust
let a = TYPE::B("abc");
match a{
	TYPE::A => {},
	TYPE::B(message) => {print!(message)}
}
```
## enum神秘语法1 if let
```rust
let a = TYPE::B("abc");
if let B(text) = a {
	println!(text)
}
```
如果a是类型B,进入if,同时提取出a里的String到text
否则不进入if

> Option类型：是enum的一种，类似
> `enum Option<T>{Some(T),None}`
> 常与这里的语法配合

> Result<T, E> 用于错误处理的一种enum类型
> 分为Ok(T),和Err(E)
## enum神秘语法2 let else
```rust
let a = TYPE::B("abc");
let B(text) = a else {
	return
}
```
如果a是类型B,不进入if
否则进入if

## enum与derive
`#[derive(...)]` 的作用是：让 Rust 编译器自动帮你生成某些常用能力的代码。
```rust
#[derive(Debug)]
enum TYPE{
	A,
	B(String)
}

let a = TYPE::B("abc");
println!("{:?}",a); //TYPE: B("abc")
```
这里{:?}调用的是Debug方法，只有实现该方法才能通过这个输出，而`#[derive(DEBUG)]`可以自动实现这个方法

>如果说{:?}使用“调试显示模块”Debug打印，那么{}使用的是“用户显示模块”打印，即要求实现Display

>另外，{:#?}是pretty debug,输出格式比{:?}整齐一些

# struct类型
```rust
struct A{
	a:u32,
	b:String
}

impl A{
	fn new()->A{
		A{1,"32".to_string()}
	}
	fn compute(&self)->i32{
		self.a+1
	}
	fn change(&mut self){
		self.b = format!("{}",self.a)
	}
}
```
不多说，看上面的代码

# 类型转换
## into
这个是rust的自动类型转换trait， 不过要求对应类实现该trait
> 这个是后面放进来的, trait的定义在后面的笔记
```rust
pub trait Into<T> {
    fn into(self) -> T;
}
```
使用这个时要求rust能推导出T是什么类型
```rust
let a: String = "hello".into();
let b: String = String::from("hello");
let c: String = "hello".to_string();

let a: i64 = 42i32.into(); // 安全扩大整数范围
let b: u8 = 300i32.try_into().unwrap_or(255);
// 300 超出了 u8 的范围，因此得到 255
let c = 300i32 as u8;
// 截断为 44
```
自己实现一个可以用into的类：
```rust
struct User {
    name: String,
}

impl From<&str> for User {
    fn from(value: &str) -> Self {
        Self {
            name: value.to_string(),
        }
    }
}

fn main() {
    let user: User = "Alice".into();
}
```

| 方法             | 用途                  | 可能失败          |
| -------------- | ------------------- | ------------- |
| `.into()`      | 基于 `Into` trait 的转换 | 否             |
| `T::from()`    | 基于 `From` trait 的转换 | 否             |
| `.try_into()`  | 可能失败的类型转换           | 是，返回 `Result` |
| `.as`          | 内置类型转换，如数值、指针转换     | 不返回错误，但可能截断   |
| `.to_string()` | 转换为 `String`        | 否             |

# 终端IO操作

## 输入
## 输出
```
io::
```

## 依赖：DefaultEditor

