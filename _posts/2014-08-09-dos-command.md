---

layout: post
title: DOS常用命令
description: DOS常用命令,批处理
keywords: DOS常用命令,批处理
category: DOS

---
## 文件操作

### 判断文件是否存在
	if exist update.sql (del update.sql) else echo 文件不存在
### 写入文件（重写式）
	echo abc>1.txt
### 写入文件（追加式）
	echo abc>>1.txt
### 写入文件不换行
	>>1.txt set /p="11111" <nul 
### 写入当前路径到文件
	cd>>1.txt
### 判断文件中是否有某个字符串
	@echo off
	@color 0a 
	findstr "123" a.txt >nul&&echo 找到||echo 没有找到
	pause
### 获取当前文件名
	@echo off&title 获取批处理文件的自身信息&mode con: cols=60 lines=40&color 3e 
	echo -------------------------------------------------------- 
	echo 获取批处理文件自身的完整路径(有引号可防止空格路径): 
	echo %0 
	echo -------------------------------------------------------- 
	echo 获取批处理文件自身的完整路径，并去掉首尾的引号: 
	echo %~0 
	echo -------------------------------------------------------- 
	echo 获取批处理文件自身的文件名及后缀名: 
	echo %~nx0 
	echo -------------------------------------------------------- 
	echo 获取批处理文件自身的文件名: 
	echo %~n0 
	echo -------------------------------------------------------- 
	echo 获取批处理文件自身的后缀名: 
	echo %~x0 
	echo -------------------------------------------------------- 
	echo 获取批处理文件自身的完整路径，不含文件名: 
	echo %~dp0 
	echo -------------------------------------------------------- 
	echo 获取批处理文件自身的盘符: 
	echo %~d0 
	echo -------------------------------------------------------- 
	echo 获取批处理文件自身的大小(byte): 
	echo %~z0 
	echo -------------------------------------------------------- 
	echo 获取批处理文件自身的修改时间: 
	echo %~t0 
	echo --------------------------------------------------------
	PAUSE
## 服务
### 启动服务
	net start mysql
### 停止服务
	net stop mysql
### 添加用户
	net user root(用户名) 123（密码）/add 
### 删除用户
	net user 用户名 / del
### 查询某个服务是否启动
	net start|findstr /i /c:"mysql">nul&&net stop mysql||echo 服务已停止
### 查询服务是否存在
	sc query mysql>nul && .\bin\mysqld.exe --remove mysql || echo 服务不存在
## 操作
### 选择操作
	@echo off
	@color 0a 
	:begin
	echo -------------------------------------------
	echo 0:重新选择
	echo 1:启动服务
	echo 2:停止服务
	echo q:退出
	echo -------------------------------------------
	set /p a=请输入要进行的操作的编号，按回车确认
	echo 你输入的是：%a%
	set thisfilepath=%0
	findstr ":choose%a%" "%thisfilepath%" >nul&&goto choose%a%||goto choose0
	pause
	:choose1
	echo 启动服务
	goto choose0
	:choose2
	echo 停止服务
	goto choose0
	:chooseq
	exit
	:choose0
	pause
	cls
	goto begin









