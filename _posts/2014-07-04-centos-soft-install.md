---

layout: post
title: CentOS服务器部署
description: CentOS服务器部署
keywords: CentOS,服务器部署
category: linux

---

## 查看开机启动服务

`chkconfig --list`

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
`wget -c -P /root/Downloads --no-check-certificate --no-cookie --header "Cookie: s_nr=1420682671945; s_cc=true; oraclelicense=accept-securebackup-cookie; gpw_e24=http%3A%2F%2Fwww.oracle.com%2Ftechnetwork%2Fjava%2Fjavase%2Fdownloads%2Fjdk7-downloads-1880260.html;s_sq=%5B%5BB%5D%5D" http://download.oracle.com/otn-pub/java/jdk/7u71-b14/jdk-7u71-linux-x64.rpm`  
 
更改文件权限       
`chmod 755 jdk-7u71-linux-x64.rpm`   
安装     
`rpm -ivh jdk-7u71-linux-x64.rpm`  
删除文件    
`rm  jdk-7u71-linux-x64.rpm`  

配置java-home  
查询java版本 java -version  如果版本不对则配置java-home  
 
打开文件/etc/profile    
在profile文件末尾加入：       

```
export JAVA_HOME=/usr/java/jdk1.7.0_71  
export PATH=$JAVA_HOME/bin:$PATH   
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar  
```

上述配置环境`JAVA_HOME`需要重启生效  
重启命令

```
reboot
```
     
## Mysql

安装mysql
      
`yum install mysql mysql-server mysql-devel `     

启动mysql   
 
`service mysqld start `  
   
设置mysql密码    

	mysql
	mysql>; USE mysql;   
	mysql>; UPDATE user SET Password=PASSWORD('123456') WHERE user='root';   
	mysql>; FLUSH PRIVILEGES;
  
设置允许远程登录      

	mysql -u root -p   
	Enter Password: <your new password>   
	mysql>GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;   
	mysql>FLUSH   PRIVILEGES;   
 
设为开机启动  
    
`chkconfig mysqld on ` 

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

## Nginx无可用源

### 使用第三方的yum源

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

### 添加官方源

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

## Tomcat

安装tomcat  

`yum -y install tomcat6` 
  
启动tomcat  

`service tomcat6 start `  

设为开机启动   

`chkconfig tomcat6 on`  
 
默认的tomcat文件夹路径  

`/usr/share/tomcat6`  

配置(tomcat/conf/server.xml)

```
<Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">  
	</Host>  
<Host name="www.aa.com"  appBase="webapps" unpackWARs="true" autoDeploy="true">  
    <Alias>www.aa.com</Alias>  
    <Context path="" docBase="/data/webapps/aa" debug="0"/>  
</Host>  
<Host name="www.bb.com"  appBase="webapps" unpackWARs="true" autoDeploy="true">  
    <Alias>www.bb.com</Alias>  
    <Context path="" docBase="/data/webapps/bb" debug="0"/>  
</Host>  
```

## 非yum方式

(1)下载

下载地址不能用的话从`http://tomcat.apache.org/`获取新地址

`wget http://mirror.bit.edu.cn/apache/tomcat/tomcat-7/v7.0.29/bin/apache-tomcat-7.0.29.tar.gz`

(2)安装

```
# tar -xzvf apache-tomcat-7.0.29.tar.gz
# mv apache-tomcat-7.0.29 /opt/tomcat7
```

运行

```
# cd /opt/tomcat7/bin
# ./startup.sh  
```
  
(3)配置

在生产环境用 root 是不安全的，所以

```
# useradd -s /sbin/nologin tomcat7
# chown -R tomcat:tomcat /opt/tomcat7
```


做为 service，和操作系统一起启动

```
# cd /opt/tomcat7/bin
# tar -xzvf commons-daemon-native.tar.gz
# cd commons-daemon-1.0.10-native-src/unix
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

JAVA_HOME=/usr/java/jdk1.7.0_71
CATALINA_HOME=/opt/tomcat7
CATALINA_OPTS="-Xms512m -Xmx1024m -XX:PermSize=128m -XX:MaxPermSize=256m" 
```

保存并退出

```
:wq
```

增加到 service

```
# cp daemon.sh /etc/init.d/tomcat
# chkconfig --add tomcat7
```

检查

```
# chkconfig --list|grep tomcat7
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
# service iptables restart 
```

启动服务

```
service tomcat7 start
```


## 防火墙

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

防火墙的配置可以输入命令，也可以直接修改配置  
但是修改配置是重启后能继续生效的  
输入命令则在下次重启后不再生效  
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

修改完了怎么办？  
这里很多人会想到`service iptables save`指令，但是一旦你这么干了你刚才的修改内容就白做了。。。  
   
具体方法是：  
  
修改好后调用`service iptables restart`就可以了
   
因为`service iptables save`会把生效中的配置写入到`/etc/sysconfig/iptables`中  
那么你的`/etc/sysconfig/iptables` 配置就回滚到上次启动服务的配置了，这点必须注意！！！  

#### 输入命令法

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
 
