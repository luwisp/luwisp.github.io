---
title: lec0 交叉编译
date: 2026-08-26
summary: 嵌入式开发第一节课
minutes: 3
---
# 嵌入式和平时的软件开发有什么不同
低功耗 / 轻量、准确、实时、成本

嵌入式设备可以直接在cpu上运行，中间可以没有linux之类的系统

进一步，有些设备在 RTOS——Real-Time Operating System，实时操作系统 上运行。

而树莓派、Jetson、Atlas等设备则有linux系统
# 交叉编译
在一个平台上生成另一个平台可以执行的代码

两个平台各有个名称称呼：
- Host（宿主机）：编辑和编译程序的平台；
- Target（目标机）：开发的目标系统；

Host 编译出来的程序最终在 Target 上运行

# 开发环境

在线仿真平台
- wokwi：https://wokwi.com/
- velxio：https://velxio.dev/
- Cirkit Designer：https://app.cirkitdesigner.com/