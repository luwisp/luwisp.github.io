---
title: Waydroid 安装与 ARM 兼容层配置
date: 2026-03-25
summary: 记录 Fedora 上手动安装 Waydroid 镜像、修复 SELinux 标签并配置 ARM 应用兼容层的过程。
minutes: 4
---

[Waydroid 官方文档](https://docs.waydro.id/)
不得不说，linux上安装还是太折腾了（

我的安装流程

先用
```
sudo dnf install waydroid
```
然后上官网手动下载image文件，
放到
```
/etc/waydroid-extra/images/
```
然后进行初始化
```
waydroid init -f
```
之后遇到了一个se-linux的问题

sudo restorecon -Rv /var/lib/waydroid
自动把所有 Waydroid 文件恢复到正确的 SELinux 标签

由于我是手动放image文件的，再把相应的标签修复一下
sudo semanage fcontext -a -t waydroid_data_t "/etc/waydroid-extra(/.*)?"
sudo restorecon -Rv /etc/waydroid-extra

安装完成后，由于waydroid是容器而不是虚拟机，所以x86上不能跑arm的安卓app

所以要安装一个arm的兼容层

首先下载waydroid_script
```
git clone https://github.com/casualsnek/waydroid_script
```

这里先创建一个虚拟环境，我用的fedora上的python版本太新会报错
```
conda create -n waydroid python=3.10
pip install -r requirements.txt
```
等下要用root权限运行python,而root下python和普通用户python不是一个，所以先获取目前python目录，再在sudo 里用绝对路径运行
```
which python3
sudo /home/luorong/.conda/envs/waydroid/bin/python3 main.py install libhoudini
```
这里有两个可以选择安装的，另一个是libndk，但是在我的电脑上有问题，所以用libhoudini

之后用waydroid session stop暂停waydroid再启动即可

但话又说回来，waydroid还是挺占内存的，在里面跑个网易云音乐就有3-4g了
