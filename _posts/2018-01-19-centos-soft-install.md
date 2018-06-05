---
layout: post
title: CentOS服务器部署(yum)
description: CentOS服务器常用软件安装(yum)
keywords: yum
categories: linux yum

---

## 查看已挂载磁盘空间大小

```bash
df -h
```



## 挂载磁盘

1）查看磁盘分区信息

```bash
fdisk -l
```

出现类似

```
磁盘 /dev/vdb：1073.7 GB, 1073741824000 字节，2097152000 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
```

2) 假如磁盘为`/dev/vdb` 格式化分区

```
mkfs.ext4 /dev/vdb
```

3) 格式化后进行挂载

```
mkdir /data
mount /dev/vdb /data
```

4) 开机自动挂载

按照上面配置后开机后并不会自动挂载磁盘。 自动挂载的配置如下

```
vim /etc/fstab
```

在文件的最后添加

```
/dev/vdb    /data    ext4    defaults    0    0 
```

保存退出 `ESC` `:wq`

5) 查看磁盘的剩余空间

```
df -hl
```



## 设置阿里yum镜像

### 1) 备份

```bash
 mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```



### 2) 下载新的CentOS-Base.repo 到/etc/yum.repos.d/



+ CentOS 5

  ```bash
  wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-5.repo
  ```

   

+ CentOS 6

  ```bash
  wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
  ```

  

+ CentOS 7

  ```bash
  wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
  ```

  

### 3) 生成缓存

```
yum makecache
```



## 配置时间同步

### 1. 安装chrony（时间同步客户端）

ubuntu/debian:

```bash
apt-get install chrony
```
Centos/redhat/alios:

```bash
yum install chrony
```

### 2. 删除默认Server

```bash
sed -i "/server/d" /etc/chrony.conf
```

### 3. 打开/etc/chrony.conf，新增一行

```bash
vim /etc/chrony.conf
```

添加

```bash
server ntp.aliyun.com iburst
```

### 4. 重启chrony

```bash
systemctl restart chronyd
```

或者

```bash
service chronyd restart
```



### 5. 查看是否正常

```bash
chronyc tracking
```



## Docker

### 安装Docker

搜索

```bash
yum search docker
```

安装

```bash
yum install -y docker
```

启动

```bash
systemctl start docker
```

查看版本

```bash
docker version
```

### 设置镜像保存位置

假设新路径为`/data/tools/docker`

#### 方案一 修改默认存放路径(推荐)

1) 修改配置

指定镜像和容器存放路径的参数是`--graph=/var/lib/docker`

但是不同系统下配置的位置不同

- CentOS7

  修改`docker.service`文件，使用`--graph`参数指定存储位置

  ```bash
  sudo vim /usr/lib/systemd/system/docker.service
  ```

  文本内容：`ExecStart=/usr/bin/dockerd`下面添加如下内容：

  ```bash
  --graph /data/tools/docker
  ```

  ![](https://ws1.sinaimg.cn/large/006tKfTcly1fs0fk21l5dj30hq07hgmv.jpg)

- CentOS6 

  位置 `/etc/sysconfig/docker` 添加下面这行

  ```bash
  OPTIONS=--graph="/data/tools/docker"--selinux-enabled -H fd://
  ```

  

- Ubuntu

  位置`/etc/default/docker`添加下面这行

  ```bash
  OPTIONS=--graph="/root/data/docker" -H fd://
  ```

  或者

  ```bash
  DOCKER_OPTS="-g /root/data/docker"
  ```

  

2) 修改完成后重载配置文件

```bash
sudo systemctl daemon-reload
```

3) 重启docker服务

```bash
sudo systemctl  restart docker.service
```

4) 查看信息

```bash
docker info
```

出现一下则证明成功了

```bash
Docker Root Dir: /data/tools/docker
```



#### 方案二 设置软连接(不推荐)

1.首先停掉Docker服务：

```bash
sudo systemctl stop docker
```

或者

```bash
service docker stop
```

2.对之前的数据做个文件备份

```bash
tar czvf /mnt/docker-backup.tar /var/lib/docker
```

3.然后迁移整个/var/lib/docker目录到目的路径：

```bash
mv /var/lib/docker /data/tools/docker
```

4.建立symlink软链接

```bash
ln -s /data/tools/docker /var/lib/docker
```

5.确认文件夹类型为symlink 类型

```bash
ls -al /var/lib/docker
```

6.启动Docker

这时候启动Docker时发现存储目录依旧是/var/lib/docker，但是实际上是存储在数据盘的，你可以在数据盘上看到容量变化。

```bash
sudo systemctl start docker
```



### 下载镜像

具体[`参见`](http://www.psvmc.cn/article/docker-dockerfile.html)

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/psvmc/oraclejdk-tomcat8
```





## 查看开机启动服务

```bash
chkconfig --list
```

## 查看应用位置

```bash
whereis nginx
```

## 连接Linux

```bash
ssh root@112.112.112.112
```

`root` 为用户名  
`112.112.112.112`为服务器ip

## 重启系统

`reboot`

## JDK  

用wget下载   

```bash
wget -O jdk-8u162-linux-x64.rpm http://download.oracle.com/otn-pub/java/jdk/8u162-b12/0da788060d494f5095bf8624735fa2f1/jdk-8u162-linux-x64.rpm?AuthParam=1517389632_ef9de4e09806f227ffd96a6d7422c3d6 
```

更改文件权限

```bash
chmod 755 jdk-8u162-linux-x64.rpm
```

安装  

```bash
rpm -ivh jdk-8u162-linux-x64.rpm
```

安装后的路径为`/usr/java/jdk1.8.0_162`

删除文件  

```bash
rm  jdk-8u162-linux-x64.rpm
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
export JAVA_HOME=/usr/java/jdk1.8.0_162  
export PATH=$JAVA_HOME/bin:$PATH   
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar  
```

配置立即生效

```bash
source /etc/profile
```

## Tomcat6/7(yum方式)

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

`service tomcat7 start `  

设为开机启动   

`chkconfig tomcat7 on`  

默认的tomcat文件夹路径  

`/usr/share/tomcat7`  



## Tomcat8(非yum方式)

(1)下载

下载地址不能用的话从[`http://tomcat.apache.org/`](http://tomcat.apache.org/)获取新地址

```bash
wget http://mirrors.hust.edu.cn/apache/tomcat/tomcat-8/v8.5.30/bin/apache-tomcat-8.5.30.tar.gz
```

(2)安装

```bash
tar -xzvf apache-tomcat-8.5.30.tar.gz
mv apache-tomcat-8.5.30 /opt/tomcat8
```

运行

```bash
cd /opt/tomcat8/bin
./startup.sh  
```

(3)配置

在生产环境用 root 是不安全的，所以

```bash
useradd -s /sbin/nologin tomcat
chown -R tomcat:tomcat /opt/tomcat8
```

为 service，和操作系统一起启动

```bash
cd /opt/tomcat8/bin
tar -xzvf commons-daemon-native.tar.gz
cd commons-daemon-1.1.0-native-src/unix/
./configure 
make
cp jsvc ../..
cd ../..
```

错误1

```bash
configure: error: no acceptable C compiler found in $PATH
```

解决1

```bash
yum -y install gcc
```

打开daemon.sh

```bash
vim daemon.sh
```

正文最开始也就是注释的下面增加下边五行内容

```bash
# chkconfig: 2345 10 90 
# description: Starts and Stops the Tomcat daemon. 

JAVA_HOME=/usr/java/jdk1.8.0_162
CATALINA_HOME=/opt/tomcat8
CATALINA_OPTS="-Xms512m -Xmx1024m -XX:PermSize=128m -XX:MaxPermSize=256m" 
```

配置防止日志中文乱码

找到`JAVA_OPTS=` 修改为

```bash
JAVA_OPTS="$JAVA_OPTS -Dfile.encoding=UTF8 -Dsun.jnu.encoding=UTF8"
```

保存并退出

```bash
:wq
```

增加到 service

```bash
cp daemon.sh /etc/init.d/tomcat8
chkconfig --add tomcat8
```

开机启动

````bash
chkconfig tomcat8 on
````

检查

```bash
chkconfig --list|grep tomcat8
```

启动服务

```bash
service tomcat8 start
```

删除服务

```bash
service tomcat8 stop
chkconfig tomcat8 off
chkconfig --del tomcat8
rm -rf /etc/init.d/tomcat8
```



防火墙添加信任规则

打开文件

```bash
vim /etc/sysconfig/iptables
```

添加规则

```
-A INPUT -m state --state NEW -m tcp -p tcp --dport 8080 -j ACCEPT
```

重启防火墙

```
service iptables restart 
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

设为开机启动  `chkconfig mysqld on` 

+ 设置表名不区分大小写

修改 `/etc/my.cnf`  
在`[mysqld]`节点下,加入一行：`lower_case_table_names=1`  

+ 设置编码

在`[mysqld]`节点下,加入一行：`character_set_server = utf8` 

+ 设置连接数

在`[mysqld]`节点下,加入一行：`max_connections = 1000`

+ 重启  

```bash
service mysqld restart
```

### 防火墙添加信任规则

打开文件

```bash
vim /etc/sysconfig/iptables
```

添加规则

```
-A INPUT -m state --state NEW -m tcp -p tcp --dport 3306 -j ACCEPT
```

重启防火墙

```
service iptables restart 
```

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

```xml
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

配置文件路径`/etc/nginx/`

### Nginx无可用源

#### 使用第三方的yum源

nginx位于第三方的yum源里面，而不在centos官方yum源里面

解决方法：

安装epel(Extra Packages for Enterprise Linux)

1）下载

下载地址可以去官方网站 `http://fedoraproject.org/wiki/EPEL`

centos5.x,cpu是`x86_64`，下载的是  

```bash
wget http://dl.fedoraproject.org/pub/epel/5/x86_64/epel-release-5-4.noarch.rpm
```

如果是centos6.x,cpu是`x86_64` 则应该下载   

```bash
wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
```

2）安装epel

```bash
rpm -ivh epel-release-6-8.noarch.rpm
```

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



## 防火墙(Centos6)

### 常用命令

+ 查看已生效的规则  
  `iptables -L -n`
+ 配置保存  
  `service iptables save`   
+ 防火墙启动   
  `service iptables start` 
+ 防火墙关闭  
  `service iptables stop`
+ 防火墙重启  
  `service iptables restart` 
+ 防火墙开机启动   
  `chkconfig iptables on`  

### 防火墙配置

防火墙的配置可以`输入命令`，也可以直接`修改配置文件` 

+ 修改配置是重启后能继续生效的  
+ 输入命令则在下次重启后不再生效  
  但可以把生效的配置写入配置文件`service iptables save`  
  这样下次重启依旧会生效。

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
-A INPUT -p tcp -m state --state NEW -m tcp --dport 11211 -j ACCEPT 
COMMIT
# Completed on Sun Apr  3 11:34:02 2016
```
修改好后调用`service iptables restart`就可以了

千万不要用`service iptables save`  
一旦你这么干了你刚才的修改内容就白做了。。。  

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



