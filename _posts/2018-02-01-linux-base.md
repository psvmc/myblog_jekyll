---
layout: post
title: Linux基本操作
description: Linux基本操作
keywords: 
    - linux
category: linux
---

## 查看系统信息

```bash
cat /etc/redhat-release
```

或

```bash
lsb_release -a
```



## 清屏

```bash
clear
```

 

## 服务开机自启/取消

```bash
chkconfig mysqld on
chkconfig mysqld off
```



## 查看所有服务

```bash
chkconfig
```

查询mysql服务

```bash
chkconfig --list | grep "mysql*"
```



## 创建文件夹

`mkdir abc`

## 修改权限

`chmod 777 ./test`   
`chmod -R 777 ./test`  包含子目录

## 复制

`cp -rf ./foldername ../foldername` 

## 查找 

```bash
whereis mysql
```



## 删除文件

```bash
rm -rf ./a.txt
```

  

- -r 递归删除
- -f 不提示
- -i 交互式删除  

## 移动/重命名

 `重命名`  

```bash
mv 1.txt 2.txt
```

移动

```bash
mv ./1.txt ./2/2.txt
```



## 压缩

```bash
yum install -y zip
zip -r  ./aa.zip ./aa
```



## 分卷压缩  

```bash
yum install -y zip
zip -r -s 100m ./test.zip ./test/
```



## 解压缩 

```bash
yum install -y unzip
unzip -o ./test.zip
```



## 解压tar.xz

这样的格式里层是tar打包方式 外面是xz压缩方式

所以解压可以分步进行

```bash
xz -d ***.tar.xz
tar -xvf ***.tar
```

也可以直接进行

```bash
tar xvJf ***.tar.xz
```

## 查看文件/文件夹大小 

`du -sh /home`

## 查看端口占用  

`lsof -i:8009`


## 查询内存信息
```bash
top -m
```



+ m:按内存占用率排序  

  ```bash
  free -m
  ```

  

## 根据端口查询进程id

```bash
lsof -i:8080
```



## 根据进程名查询进程id

```bash
ps -ef | grep java
```



## 结束PID为1000的进程 

```bash
kill -9 1000
```



## 查询IP地址

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```




## 挂载硬盘

1）查看磁盘分区信息

```bash
fdisk -l
```

2) 假如磁盘为`/dev/vdb` 格式化分区

```bash
mkfs.ext4 /dev/vdb
```

3) 格式化后进行挂载

```bash
mkdir /data
mount /dev/vdb /data
```

4) 开机自动挂载

按照上面配置后开机后并不会自动挂载磁盘。
自动挂载的配置如下

```bash
vim /etc/fstab
```

在文件的最后添加

```bash
/dev/vdb	/data	ext4	defaults	0 0 
```

保存退出 `ESC` `:wq`

5) 查看磁盘的剩余空间

```bash
df -hl
```

## 查看当前的路径

```bash
pwd
```

## 建立软链接

有这样一种情况  
为了便于服务器上我们项目的管理  
我们可能需要修改里面所有的tomcat的配置   
把项目的路径设置在我们的数据文件夹中  
但这样修改起来就比较麻烦 当然我们也可以用软链接 `ln -s`. 
比如

```bash
ln -s /data/webapps01 /usr/share/tomcat7/webapps
```

上面这个例子  
我们可以先把`/usr/share/tomcat7/webapps`复制到`/data/webapps01`  
然后就可以删除 `/usr/share/tomcat7/webapps`了  
通过上面的方式 就相当于 `/usr/share/tomcat7/webapps`其实就是一个快捷方式  
实际链接的路径为`/data/webapps01`


+ 查看哪些是软链接

```bash
ls -l
```


## 常用位置

下面软件的安装位置一般为`yum`安装后的位置

+ `服务位置`:`/etc/init.d/`
+ `apache`:`/etc/httpd/conf/`
+ `nginx`:`/etc/nginx/`
+ `tomcat7`:`/usr/share/tomcat7`
+ `mysql`:`/etc/my.cnf`