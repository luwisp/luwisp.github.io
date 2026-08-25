---
title: x86 AT&T 汇编与伪指令笔记
date: 2026-03-25
summary: 汇总 AT&T 汇编语法、寄存器、系统调用、寻址方式、ABI 与常用伪指令。
minutes: 14
---

先写一个helloworld吧
```asm
.global _start
_start:
mov $1, %rax
mov $1, %rdi
mov $msg, %rsi
mov $13, %rdx
syscall

mov $60, %rax
xor %rdi, %rdi
syscall
msg:
.ascii "Hello, AT&T!\n"
```
然后编译运行
```bash
as hello.s -o hello.o
ld hello.o -o hello
./hello
```
也可以用gcc
```
gcc hello.s  -o hello
```

## 寄存器
下面R开头的是64位，E开头是32位，中间的16位，H结尾的是低16位的高8位，L结尾的是低8位
并且同一行其实是同一个寄存器不同名称和对应的位
- AX (RAX EAX AX AH AL) 累加器，函数返回值
- BX (RBX EBX BX BH BL) 基址寄存器（历史用途）
- CX (RCX ECX CX CH CL) 计数器（循环、字符串指令）
- DX (RDX EDX DX DH DL) I/O、乘除法高位、系统调用参数
- SI (RSI ESI SI SIH SIL) 字符串源指针
- DI (RDI EDI DI DIH DIL) 字符串目的指针
- BP (RBP EBP BP BPH BPL) 帧指针(当前函数栈基)
- SP (RSP ESP SP SPH SPL) 栈指针(栈顶)
- IP(instruct pointer) (RIP EIP IP --- ---) 指令指针寄存器

## 系统调用
> LINUX x86
- RAX syscall number
- RDI 1st argument
- RSI 2nd argument
- RDX 3rd argument
### 一些系统调用

| 名称    | 用途   | 调用号 | RDI | RSI   | RDX |     |
| ----- | ---- | --- | --- | ----- | --- | --- |
| write | ...  | 1   | fd号 | buf地址 | 字节数 |     |
| exit  | 退出程序 | 60  | 提出码 | ---   | --- |     |

## 优化技巧
- 将某个寄存器置0
    xor %rdx %rdx 比 mov $0 , %rdx 少一字节

# 伪指令
## 基础数据声明
| 类型 | 大小(字节) | 例子 | 其他 |
| --- | -------- | ---|  ----- |
| byte | 1 | .byte 12 , 0x1 | --- |
| word | 2 | .word 12 | 在rsicv是4字节 |
| long | 4 | .long 1256 | --- |
| quad | 8 | --- | 类似ricv的dword |

## 字符串
| 类型 | 大小(字节) | 例子 | 其他 |
| --- | -------- | ---|  ----- |
| ascii | 参数 | .ascii "hello\0"|  不自动在结尾加\0 |
| asciz/string | 参数 | .string "hello" | --- |

## 空间分配
| 类型 | 大小(字节) | 例子 | 其他 |
| --- | -------- | ---|  ----- |
| space | 参数 | .space 3 | 不一定为0 |
| zero | 参数 | .zero 5 | --- |

## 对齐
- align N

    将当前位置对齐到 $2^N$ 字节边界

    例如 .align 3 → 对齐到 8 字节

## 地址与符号

### .globl
### .type
声明符号类型

e.g.
```
.type main , @function
.type msg, @object
```
### .size
声明符号大小，用于编译器

e.g.
```
main:
    ...
    ret
.size main, .-main

msg:
    .asciz "hello"
.size msg, 6


```

### in .bss

.comm name, size, alignment

声明全局未初始化变量 ， 大小size ，对齐alignment

.lcomm name , size

声明局部未初始化变量 ， 大小size

### .section

- .text   代码
- .bss    未初始化数据
- .rodata 只读数据
- .data   初始化数据

.section .text

# 比例变址寻址 SIB addressing
```
disp(base, index, scale)
```
disp：立即数偏移（可以省略）
(如果disp是symbol,则为symbol_addr−section_base),不能说寄存器

base：基址寄存器（可以省略）

index：变址寄存器（可以省略）

scale：比例因子，只能是 1, 2, 4, 8，不能是寄存器

```
address = disp + base + index*scale
```

e.g.
```
movl a(,%rcx,4), %eax # 访问int数组元素a[i]

# 访问 struct S { int x; int arr[10]; } s; 中的 s.arr[i]
movl 4(%rbx,%rcx,4), %eax

```
# RIP‑relative

```
symbol(%rip)
```
相当于symbol_addr−next_instruction_addr + rip


# caller save 和callee save
下面是一些caller save 和callee save相关的寄存器

```
.global foo
.type foo, @function

foo:
    # -------------------------
    # callee-saved: rbx rbp r12 r13 r14 r15
    # -------------------------
    push %rbx
    push %rbp
    push %r12
    push %r13
    push %r14
    push %r15

    mov %rsp, %rbp

    # -------------------------
    # caller-saved: rax rcx rdx rsi rdi r8 r9 r10 r11
    # 这里模拟 caller 保存它们（一般 caller 在调用前保存）
    # -------------------------
    sub $64, %rsp
    mov %rax,  0(%rsp)
    mov %rcx,  8(%rsp)
    mov %rdx, 16(%rsp)
    mov %rsi, 24(%rsp)
    mov %rdi, 32(%rsp)
    mov %r8,  40(%rsp)
    mov %r9,  48(%rsp)
    mov %r10, 56(%rsp)
    mov %r11, 64(%rsp)

    # -------------------------
    # 做点计算：返回 x + 100
    # x 在 rdi
    # -------------------------
    mov %rdi, %rax
    add $100, %rax

    # -------------------------
    # 恢复 caller-saved（模拟 caller 的行为）
    # -------------------------
    mov  0(%rsp), %rax
    mov  8(%rsp), %rcx
    mov 16(%rsp), %rdx
    mov 24(%rsp), %rsi
    mov 32(%rsp), %rdi
    mov 40(%rsp), %r8
    mov 48(%rsp), %r9
    mov 56(%rsp), %r10
    mov 64(%rsp), %r11
    add $64, %rsp

    # -------------------------
    # 恢复 callee-saved
    # -------------------------
    pop %r15
    pop %r14
    pop %r13
    pop %r12
    pop %rbp
    pop %rbx

    ret
```

# ABI 规定
## 函数调用
|参数	|寄存器|
|------| --- |
|1	|%rdi|
|2	|%rsi|
|3	|%rdx|
|4	|%rcx|
|5	|%r8|
|6	|%r9|
返回值 %rax
## 栈对齐
要求在进入函数时 %rsp % 16 == 0,
同时 call 指令会往栈里塞8字节返回地址，所以在call之前 %rsp % 16 == 8
jmp就不会动rsp
# 一些指令
### lea
lea \<address\> \<reg\>

将address 放进reg

### mov
mov \<address\> \<reg\>

将address指向的内容放进reg

### add
add \<reg/con\> \<reg\>

a + b -> b
### push
push \<reg/con\>

将值入栈，同时rsp自减
### pop
push \<reg\>

将栈顶值弹出到寄存器，同时rsp自增




>参考以下文章：(https://horbyn.github.io/2022/05/28/trans-2/)
