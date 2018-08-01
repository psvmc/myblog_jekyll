---
layout: post
title: Mysql安装注意点
description: Mysql安装注意点
keywords: mysql linux
categories: 
        - mysql
        - linux

---





## 设置阿里yum镜像

### (1) 备份

```bash
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```

### (2) 查看系统版本

```bash
cat /etc/redhat-release
```

###  (3) 下载

下载新的CentOS-Base.repo 到/etc/yum.repos.d/

+ CentOS 7

  ```bash
  wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
  ```

+ CentOS 6

  ```bash
  wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
  ```

+ CentOS 5

  ```bash
  wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-5.repo
  ```


### (4) 生成缓存

```
yum makecache
```

## 安装

Step1: 检测系统是否自带安装MySQL

```bash
yum list installed | grep mysql
```

Step2: 删除系统自带的mysql及其依赖 命令：

```bash
yum -y remove mysql-libs.x86_64
```

Step3: 给CentOS添加rpm源

```bash
wget -i http://dev.mysql.com/get/mysql57-community-release-el7-7.noarch.rpm
yum -y install mysql57-community-release-el7-7.noarch.rpm
yum repolist enabled | grep mysql
```

Step4:安装mysql 服务器 命令：

```bash
yum install -y mysql-community-server
```

Step5: 启动mysql 命令:

```bash
service mysqld start
```

Step6: 查看mysql是否自启动,并且设置开启自启动 命令:

```bash
chkconfig --list | grep mysqld
chkconfig mysqld on
```

## 配置

(1): 配置修改: 表名/编码/连接数/数据包大小

设置表名不区分大小写/字符编码/连接数

修改 `/etc/my.cnf`  

```bash
vim /etc/my.cnf
```

添加以下的4行

```bash
[mysqld]
lower_case_table_names=1
character_set_server = utf8
max_connections = 1000
max_allowed_packet = 100M
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES
```

重启  

```bash
service mysqld restart
```

(2): 修改密码

```bash
vi /etc/my.cnf
```

在`[mysqld]`的段中加上一句：`skip-grant-tables`
例如：

```bash
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
skip-grant-tables
```

保存并且退出vi。

重启

```bash
service mysqld restart
```

5.1

```mysql
mysql
mysql> use mysql;
mysql> UPDATE user SET Password = PASSWORD('newpass') WHERE user = 'root';
```

5.7

```bash
mysql
mysql> use mysql;
mysql> update user set authentication_string=password('123456') where user='root';
```

(3): 设置允许远程登录 

```bash
mysql -u root -p   
Enter Password: <your new password>   
mysql> set global validate_password_policy=0;
mysql> SET PASSWORD = PASSWORD('你的密码');
mysql> ALTER USER 'root'@'%' PASSWORD EXPIRE NEVER;
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '你的密码' WITH GRANT OPTION;   
mysql> FLUSH PRIVILEGES; 
mysql> quit
```



You must reset your password using ALTER USER statement before executing this statement

```mysql
SET PASSWORD = PASSWORD('your new password');
ALTER USER 'root'@'%' PASSWORD EXPIRE NEVER;
flush privileges;
```



Your password does not satisfy the current policy requirements

```mysql
set global validate_password_policy=0;
```



## 卸载

```bash
chkconfig mysqld off
service mysqld stop
yum remove mysql-community-server
```



## 数据库文件存储位置

```mysql
show global variables like "%datadir%";
```



## 防火墙添加信任规则

打开文件

```bash
vim /etc/sysconfig/iptables
```

添加规则

```basic
-A INPUT -m state --state NEW -m tcp -p tcp --dport 3306 -j ACCEPT
```

重启防火墙

```bash
service iptables restart 
```

## 常见问题

### 启动失败

```bash
[root@root ~]# /etc/init.d/mysqld start
Starting mysqld (via systemctl):  Job for mysqld.service failed because the control process exited with error code. See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

解决方式

```bash
mkdir -p /var/run/mysqld/
chown mysql.mysql /var/run/mysqld/
```


### 长时间未访问 断开

mysql有一个连接超时时间的概念。。。查询此项目的数据库的连接超时时间为28800秒，即为8小时。。

```bash
mysql> show global variables like 'wait_timeout';
 +---------------+-------+
 | Variable_name | Value |
 +---------------+-------+
 | wait_timeout  | 28800 |
 +---------------+-------+
 1 row in set
```



于是不难得知，肯定是由于项目长时间没有请求数据库，数据库过了8小时和这个连接超时时间之后，就会断开连接。。

而我们的项目使用的是c3p0的连接池，，过了8小时后，连接池中的连接已经被mysql断开了，即连接失效。。

但是c3p0认为此连接却依然有效，此时当我们发请求请求数据库中的数据时,由于连接失效，并不能去连接数据库操纵数据，所以服务器会抛出一个500的错误

问题的原因已经找到，那我们该怎么解决呢？？

其实解决起来很简单的。。

先说第一种办法吧，就是将数据库的连接超时时间设置大一点，

```bash
msyql> set global wait_timeout=1814400;
msyql> set global interactive_timeout=1814400;
```

当然这种办法我并不推荐，，这个办法不太好，弊端太多了 比如占用数据库资源，关键是这种办法并不能彻底根治mysql连接断开这种情况

所以我推荐第二种办法:设置c3p0隔多少时间自动检测与数据库的连接，如果断开则自动重连

```xml
<bean id="pooledDataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">  
    <property name="jdbcUrl" value="${jdbc.jdbcUrl}"></property>  
    <property name="driverClass" value="${jdbc.driverClass}"></property>  
    <property name="user" value="${jdbc.user}"></property>  
    <property name="password" value="${jdbc.password}"></property>  
	//下面两个属性就是设置c3p0隔28800秒自动检测与数据库的连接（28800也是mysql的默认的连接超时时间）  
    <property name="testConnectionOnCheckin" value="true"></property>  
    <property name="idleConnectionTestPeriod" value="28800"></property>  
</bean> 
```

