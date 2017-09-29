---

layout: post
title: CentOS服务器部署(yum)
description: CentOS服务器常用软件安装(yum)
keywords: 
    - yum
category: linux

---

## 查看开机启动服务

`chkconfig --list`

## 查看应用位置

`whereis nginx`

## 连接Linux

```
ssh root@112.112.112.112
```

`root` 为用户名  
`112.112.112.112`为服务器ip


## 重启系统

`reboot`

## JDK  
 
用wget下载   

```bash
wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u144-b01/090f390dda5b47b9b721c7dfaa008135/jdk-8u144-linux-x64.rpm
``` 
 
更改文件权限
       
```bash
chmod 755 jdk-8u144-linux-x64.rpm
```   

安装  
   
```bash
rpm -ivh jdk-8u144-linux-x64.rpm
```

安装后的路径为`/usr/java/jdk1.8.0_144`
 
删除文件  
  
```bash
rm  jdk-8u144-linux-x64.rpm
```  

查询java版本 `java -version`

查看java-home

```bash
echo $JAVA_HOME
```

为空的话要配置`java-home`   否则无法配置`Tomcat`为服务
   
打开文件`/etc/profile`  
  
在`profile`文件末尾加入：       

```bash
export JAVA_HOME=/usr/java/jdk1.8.0_144  
export PATH=$JAVA_HOME/bin:$PATH   
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar  
```

上述配置环境`JAVA_HOME`需要重启生效  
重启命令

```bash
reboot
```
     
## Mysql

安装mysql
      
`yum install mysql mysql-server mysql-devel `     

启动mysql   
 
`service mysqld start `  
   
设置mysql密码    

```bash
mysql
mysql>; USE mysql;   
mysql>; UPDATE user SET Password=PASSWORD('123456') WHERE user='root';   
mysql>; FLUSH PRIVILEGES;
```
  
设置允许远程登录      

```bash
mysql -u root -p   
Enter Password: <your new password>   
mysql>GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;   
mysql>FLUSH PRIVILEGES; 
```  
 
设为开机启动  
    
`chkconfig mysqld on ` 

设置表名不区分大小写

+ 修改 `/etc/my.cnf`
+ 在`[mysqld]`节点下,加入一行：`lower_case_table_names=1`
+ 重启MySQL即可 `service mysqld restart`

## Apache 
  
安装Apache    
 
`yum install httpd httpd-devel`  

卸载  
  
`yum -y remove httpd*`  

启动apache  

`service httpd start`   

设为开机启动  
 
`chkconfig httpd on`  

重新加载配置

`service httpd reload`

查看版本

`httpd -v`
  
配置 文件位置`/etc/httpd/conf/httpd.conf`  

设置虚拟主机目录  
在文件的最后添加  

```
Listen 9999  
NameVirtualHost *:9999  
<VirtualHost *:9999>  
	ServerName localhost:9999  
	DocumentRoot "/data/staticFile"  
</VirtualHost> 
```

## Nginx

安装 

`yum install nginx`


卸载  
  
`yum -y remove nginx*`  

启动

`service nginx start`

停止

`service nginx stop`

设为开机启动  
 
`chkconfig nginx on`  

重新加载配置

`service nginx reload`

查看版本

`nginx -v`

### Nginx无可用源

#### 使用第三方的yum源

nginx位于第三方的yum源里面，而不在centos官方yum源里面

解决方法：
 
安装epel(Extra Packages for Enterprise Linux)

1）下载

下载地址可以去官方网站 `http://fedoraproject.org/wiki/EPEL`

centos5.x,cpu是`x86_64`，所以我下载的是  
`wget http://dl.fedoraproject.org/pub/epel/5/x86_64/epel-release-5-4.noarch.rpm`

如果是centos6.x,cpu是`x86_64` 则应该下载   
`wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm`
       
2）安装epel

`rpm -ivh epel-release-5-4.noarch.rpm`

再次执行 `yum install nginx`,则会提示安装成功了

#### 添加官方源

使用上面的方法是可以安装  但是版本只有1.0.15，那要用yum安装新版本的源怎么办  
我们可以添加官方源

1) `cd /etc/yum.repos.d/`

2) `vim nginx.repo`

3) 填写如下文件内容 

```
[nginx] 
name=nginx repo 
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/ 
gpgcheck=0 
enabled=1
```

4) 保存退出 `Esc` -> `:wq`

5) 查看可用版本 `yum list nginx`

6) 安装 `yum install nginx`

7) 查看安装版本 `nginx -v`

## Tomcat(yum方式)

Tomcat7

```bash
rpm -Uvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm  
#这个是jpackage依赖的包要先装
yum -y install yum-priorities                                   
rpm -Uvh http://mirrors.dotsrc.org/jpackage/6.0/generic/free/RPMS/jpackage-release-6-3.jpp6.noarch.rpm  

#安装tomcat7
yum -y --nogpgcheck install tomcat7 tomcat7-webapps tomcat7-admin-webapps tomcat-native   
```
  
启动tomcat  

`service tomcat6 start `  

设为开机启动   

`chkconfig tomcat6 on`  
 
默认的tomcat文件夹路径  

`/usr/share/tomcat6`  


## Tomcat(非yum方式)

(1)下载

下载地址不能用的话从`http://tomcat.apache.org/`获取新地址

`wget https://mirrors.tuna.tsinghua.edu.cn/apache/tomcat/tomcat-8/v8.5.20/bin/apache-tomcat-8.5.20.tar.gz`

(2)安装

```
# tar -xzvf apache-tomcat-8.5.20.tar.gz
# mv apache-tomcat-8.5.20 /opt/tomcat8_1
```

运行

```
# cd /opt/tomcat8_1/bin
# ./startup.sh  
```
  
(3)配置

在生产环境用 root 是不安全的，所以

```
# useradd -s /sbin/nologin tomcat
# chown -R tomcat:tomcat /opt/tomcat8_1
```


做为 service，和操作系统一起启动

```
# cd /opt/tomcat8_1/bin
# tar -xzvf commons-daemon-native.tar.gz
# cd commons-daemon-1.0.15-native-src/unix/
# ./configure 
# make
# cp jsvc ../..
# cd ../..
```

打开daemon.sh

```
vim daemon.sh
```

正文最开始也就是注释的下面增加下边五行内容

```
# chkconfig: 2345 10 90 
# description: Starts and Stops the Tomcat daemon. 

JAVA_HOME=/usr/java/jdk1.8.0_144
CATALINA_HOME=/opt/tomcat8_1
CATALINA_OPTS="-Xms512m -Xmx1024m -XX:PermSize=128m -XX:MaxPermSize=256m" 
```

配置防止日志中文乱码

找到`JAVA_OPTS=` 修改为

```
JAVA_OPTS="$JAVA_OPTS -Dfile.encoding=UTF8 -Dsun.jnu.encoding=UTF8"
```

保存并退出

```
:wq
```

增加到 service

```
# cp daemon.sh /etc/init.d/tomcat8_1
# chkconfig --add tomcat8_1
```

检查

```
# chkconfig --list|grep tomcat8_1
```

启动服务

```
service tomcat8_1 start
```

防火墙添加信任规则

打开文件

```
# vim /etc/sysconfig/iptables
```
添加规则

```
-A INPUT -m state --state NEW -m tcp -p tcp --dport 8080 -j ACCEPT
```
重启防火墙

```
service iptables restart 
```

## 防火墙(Centos6)

### 查看已生效的规则

`iptables -L -n`

### 配置保存  

`service iptables save`   
 
### 防火墙启动
  
`service iptables start` 

### 防火墙关闭
  
`service iptables stop`

### 防火墙重启
  
`service iptables restart` 
  
### 防火墙开机启动 
 
`chkconfig iptables on`  

### 修改配置

防火墙的配置可以`输入命令`，也可以直接`修改配置文件` 
 
+ 修改配置是重启后能继续生效的  
+ 输入命令则在下次重启后不再生效  
但可以把生效的配置写入配置文件`service iptables save`  
这样下次重启依旧会生效

#### 修改配置文件法

文件路径`/etc/sysconfig/iptables`(可能不存在,自己新建个就行)

我的配置

```
# Generated by iptables-save v1.4.7 on Sun Apr  3 11:34:02 2016
*filter
:INPUT ACCEPT [19:1399]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [10:1400]
-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT 
-A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT 
-A INPUT -p tcp -m state --state NEW -m tcp --dport 8080 -j ACCEPT 
-A INPUT -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT 
COMMIT
# Completed on Sun Apr  3 11:34:02 2016
```
修改好后调用`service iptables restart`就可以了

千万不要用`service iptables save`  
一旦你这么干了你刚才的修改内容就白做了。。。  
   
因为`service iptables save`会把生效中的配置写入到`/etc/sysconfig/iptables`中  
那么你的`/etc/sysconfig/iptables` 配置就回滚到上次启动服务的配置了，这点必须注意！！！  

#### 二 输入命令法

输入命令则在下次重启后不再生效  
但可以把生效的配置写入配置文件`service iptables save`  
这样下次重启依旧会生效

##### 端口允许  

```
iptables -A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT   
iptables -A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT   
iptables -A INPUT -p tcp -m state --state NEW -m tcp --dport 8080 -j ACCEPT   
iptables -A INPUT -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT  
```

##### 端口转发  

`iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080 `  

## 安装php5.4
+ 添加源   
`wget -q -O - http://www.atomicorp.com/installers/atomic | sh`
+ 安装  
`yum install php php-cli php-gd php-mysql php-eaccelerator php-zend-optimizer  php-pear php-snmp php-bcmath php-mcrypt php-mhash php-soap php-xml php-xmlrpc`
+ 查询版本  
`yum info php | grep Version` 

## 服务器安全软件(安装其一)

### 安全狗

下载并安装

```
wget http://down.safedog.cn/safedog_linux64.tar.gz
tar xzvf safedog_linux64.tar.gz
cd safedog_an_linux64_2.8.19005/
chmod +x *.py
./install.py
```

上一步中安装时缺少组件安装

+ Need system command 'locate' to install safedog for linux.    
	`yum install -y mlocate`
+ Need system command 'lsof' to install safedog for linux.   
	`yum install -y lsof`
+ Need system command 'dmidecode' to install safedog for linux.
	`yum install -y dmidecode`
+ Need system command 'lspci' to install safedog for linux.   
	`yum install -y pciutils`


登录账号(暂时登不了)

```
sdcloud -u 服云帐号
```

进入操作界面

```
sdui
```

### 悬镜

[悬镜服务器端](http://www.xmirror.cn/page/prodon)

一键安装

```bash
wget -O install.sh http://dl.xmirror.cn/a/install.sh && sh install.sh
```


 
