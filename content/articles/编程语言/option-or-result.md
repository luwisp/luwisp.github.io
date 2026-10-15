---
title: option和result类型
date: 2026-10-13T00:00:00
summary: rust的Option和result
minutes: 10
---


仔细区分一下`Option<T>`和`Result<T,E>`，以及相应一些函数

```rust
enum Option<T> {
	Some(T),
	None
}

enum Result<T,E> {
	Ok(T),
	Err(E)
}
```

常见的情景是调用一些函数，返回了这两个类型，那分别应该怎么处理呢
之前提到的`match` `if let` `if let else`就不多写了
# 相关函数
## unwrap_or
将`Option<T>`类型转换成`T`类型，None用默认值代替
```rust
let x: Option<i32> = None;
let v = x.unwrap_or(10);
```
效果为
```
Some(v) → v
None    → 10
```

### unwrap_or_else
```rust
let v = x.unwrap_or_else(|| expensive());
```
将unwrap默认值转换成一个函数，unwrap_or中同样可以调用函数，但这里的区别在于`unwrap_or_else`会懒执行，即只有对于`x==None`才会执行函数，而`unwrap_or`不是作为值传递的，所以都会调用一次
## ok_or
将Option类型转换为Result类型
常用于把函数返回的Option类型转换为报错信息
```rust
let x: Option<i32> = Some(5);

let y: Result<i32, &str> =
    x.ok_or("没有值");

//Some(5) → Ok(5)
//None    → Err("没有值")
```
### ok_or_else
和上面的unwrap_or_else一样，参数转换为函数，懒加载，其他不变
```rust
name.ok_or_else(|| {
    format!("找不到用户 {}", id)
})?;
```
## get_or_insert
对可变的`Option<T>`类型使用，如果为Some返回T的可变引用，如果为None使用参数中的构造返回可变对象
```rust
let mut x: Option<Vec<i32>> = None;

x.get_or_insert(Vec::new())
    .push(1);
//Some(v) → 返回 &mut v
//None    → 放入 Vec::new()
//          返回 &mut Vec
```
### get_or_insert_with
参数为函数版本
### get_or_insert_default
根据命名习惯，你应该能猜出来是None时调用`Default::default()`方法构造
## or
可对Option/Result类型用，输入输出类型不变
对Option类型如果输入是None那么就会用参数代替，
对Result类型如果输入是Err那么就会用参数代替
```rust
let a: Result<i32, _> = Err("failed");
let b = Ok(20);
let x = a.or(b);

let a = None;
let b = Some(20);
let x = a.or(b);

//e.g. 用于多种配置文件选择，没有则选下一个
let config =
    cli_config
        .or(env_config)
        .or(file_config);
```
