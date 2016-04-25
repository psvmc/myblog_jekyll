---

layout: post
title: mysql配置
description: mysql配置
keywords: mysql配置
category: mysql

---
## 卸载服务
>查找mysql服务,如果存在卸载服务

	sc query mysql>nul && .\bin\mysqld.exe --remove mysql || echo 服务不存在
## 安装服务
>查找mysql服务，如果不存在安装服务

	sc query mysql>nul && echo 已存在服务 || .\bin\mysqld.exe  --install mysql
## 停止服务
>查找运行中的mysql，如果存在停止服务

	net start|findstr /i /c:"mysql">nul&&net stop mysql||echo 服务已停止
## 启动服务
>查找运行中的mysql，如果存在停止服务

	net start|findstr /i /c:"mysql">nul&&echo 服务已启动||&net start mysql
## 重新注册服务并启动
	@echo off
	echo ---------------------重新安装服务-----------------------
	net start|findstr /i /c:"mysql">nul&&net stop mysql||echo 服务已停止
	sc query mysql>nul && .\bin\mysqld.exe --remove mysql || echo 服务不存在
	sc query mysql>nul && echo 已存在服务 || .\bin\mysqld.exe  --install mysql
	net start mysql
	PAUSE
## 万能吊炸天设置
	@echo off
	echo -------------一键设置MYSQL-----------------------
	echo -						-
	echo -		作者:张剑			-
	echo -						-
	echo -------------------------------------------------
	echo ---------------临时文件创建开始---------------------
	echo use mysql>update.sql
	echo update user set host='%' where user='root' and host='127.0.0.1';>>update.sql
	echo update user set password=password('root') where user='root';>>update.sql
	echo quit>>update.sql
	echo ---------------设置路径-------------------------------
	>temp.bat set /p="set PathTemp=" <nul 
	cd>>temp.bat
	call temp.bat
	set basedir=basedir=%PathTemp%
	set datadir=datadir=%PathTemp%\data
	echo ----------------temp-hack.ini------------------------
	echo [client] >temp-hack.ini
	echo port=3306 >>temp-hack.ini
	echo [mysql] >>temp-hack.ini
	echo default-character-set=utf8 >>temp-hack.ini
	echo [mysqld] >>temp-hack.ini
	echo  skip-grant-tables >>temp-hack.ini
	echo port=3306 >>temp-hack.ini
	echo %basedir% >>temp-hack.ini
	echo %datadir% >>temp-hack.ini
	echo character-set-server=utf8 >>temp-hack.ini
	echo default-storage-engine=INNODB >>temp-hack.ini
	echo sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION" >>temp-hack.ini
	echo max_connections=100 >>temp-hack.ini
	echo query_cache_size=0 >>temp-hack.ini
	echo table_cache=256 >>temp-hack.ini
	echo tmp_table_size=34M >>temp-hack.ini
	echo thread_cache_size=8 >>temp-hack.ini
	echo myisam_max_sort_file_size=100G >>temp-hack.ini
	echo myisam_sort_buffer_size=68M >>temp-hack.ini
	echo key_buffer_size=54M >>temp-hack.ini
	echo read_buffer_size=64K >>temp-hack.ini
	echo read_rnd_buffer_size=256K >>temp-hack.ini
	echo sort_buffer_size=256K >>temp-hack.ini
	echo innodb_additional_mem_pool_size=3M >>temp-hack.ini
	echo innodb_flush_log_at_trx_commit=1 >>temp-hack.ini
	echo innodb_log_buffer_size=2M >>temp-hack.ini
	echo innodb_buffer_pool_size=105M >>temp-hack.ini
	echo innodb_log_file_size=53M >>temp-hack.ini
	echo innodb_thread_concurrency=10 >>temp-hack.ini
	echo ----------------temp.ini------------------------------
	echo [client] >temp.ini
	echo port=3306 >>temp.ini
	echo [mysql] >>temp.ini
	echo default-character-set=utf8 >>temp.ini
	echo [mysqld] >>temp.ini
	echo port=3306 >>temp.ini
	echo %basedir% >>temp.ini
	echo %datadir% >>temp.ini
	echo character-set-server=utf8 >>temp.ini
	echo default-storage-engine=INNODB >>temp.ini
	echo sql-mode="STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION" >>temp.ini
	echo max_connections=100 >>temp.ini
	echo query_cache_size=0 >>temp.ini
	echo table_cache=256 >>temp.ini
	echo tmp_table_size=34M >>temp.ini
	echo thread_cache_size=8 >>temp.ini
	echo myisam_max_sort_file_size=100G >>temp.ini
	echo myisam_sort_buffer_size=68M >>temp.ini
	echo key_buffer_size=54M >>temp.ini
	echo read_buffer_size=64K >>temp.ini
	echo read_rnd_buffer_size=256K >>temp.ini
	echo sort_buffer_size=256K >>temp.ini
	echo innodb_additional_mem_pool_size=3M >>temp.ini
	echo innodb_flush_log_at_trx_commit=1 >>temp.ini
	echo innodb_log_buffer_size=2M >>temp.ini
	echo innodb_buffer_pool_size=105M >>temp.ini
	echo innodb_log_file_size=53M >>temp.ini
	echo innodb_thread_concurrency=10 >>temp.ini
	echo ---------------临时文件创建完毕---------------------
	echo ---------------------重新安装服务-----------------------
	net start|findstr /i /c:"mysql">nul&&net stop mysql||echo 服务已停止
	sc query mysql>nul && .\bin\mysqld.exe --remove mysql || echo 服务不存在
	sc query mysql>nul && echo 已存在服务 || .\bin\mysqld.exe  --install mysql
	echo --------------------更改配置重启------------------------
	if exist my.ini (del my.ini) else echo 文件不存在
	copy temp-hack.ini my.ini
	net start mysql
	echo ----------------修改root密码为root---------------------
	.\bin\mysql -u root <./update.sql
	echo --------------------还原配置重启------------------------
	net stop mysql
	if exist my.ini (del my.ini) else echo 文件不存在
	copy temp.ini my.ini
	net start mysql
	echo ---------------------删除临时文件-----------------------
	if exist update.sql (del update.sql) else echo 文件不存在
	if exist temp.bat (del temp.bat) else echo 文件不存在
	if exist temp.ini (del temp.ini) else echo 文件不存在
	if exist temp-hack.ini (del temp-hack.ini) else echo 文件不存在
	PAUSE







