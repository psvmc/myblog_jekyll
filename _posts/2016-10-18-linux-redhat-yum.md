---

layout: post
title: RedHat上配置Yum
description: RedHat上配置Yum
keywords: linux
category: linux

---

## 前言

刚装好了 RedHat 6 系统，但是使用 `yum` 的时候总是提示 `nothing to do`，并且什么都做不了。  
更换 `yum` 的源就可以解决这个问题。

## 步骤

### 卸载 RedHat 自带的 yum

```bash
rpm -aq | grep yum | xargs rpm -e --nodeps
```

### 下载相关安装包

`http://mirrors.163.com/centos/6/os/x86_64/Packages/`

用的 wget。
需要下载的包列表：

```bash
http://mirrors.163.com/centos/6/os/x86_64/Packages/python-iniparse-0.3.1-2.1.el6.noarch.rpm
http://mirrors.163.com/centos/6/os/x86_64/Packages/yum-metadata-parser-1.1.2-16.el6.x86_64.rpm
http://mirrors.163.com/centos/6/os/x86_64/Packages/yum-3.2.29-69.el6.centos.noarch.rpm
http://mirrors.163.com/centos/6/os/x86_64/Packages/yum-plugin-fastestmirror-1.1.30-30.el6.noarch.rpm
```

### 安装 yum

```bash
rpm -ivh python-iniparse-0.3.1-2.1.el6.noarch.rpm
rpm -ih yum-metadata-parser-1.1.2-16.el6.x86_64.rpm
rpm -ivh yum-3.2.29-69.el6.centos.noarch.rpm yum-plugin-fastestmirror-1.1.30-30.el6.noarch.rpm
```

注意最后两个安装包一定要一块安装，否则会因为相互依赖而安装失败！

### 配置

如果 `/etc/yum.repos.d/rhel-debuginfo.repo` 这个文件存在的话就备份一下：

```bash
mv /etc/yum.repos.d/rhel-debuginfo.repo /etc/yum.repos.d/rhel-debuginfo.repo.bak
```

不存在的话直接创建：

```bash
touch /etc/yum.repos.d/rhel-debuginfo.repo
```

编辑它：

```bash
vi /etc/yum.repos.d/rhel-debuginfo.repo
```

内容如下：

```bash
[base]
name=CentOS-$releasever - Base
baseurl=http://mirrors.163.com/centos/6/os/$basearch/
gpgcheck=1
gpgkey=http://mirrors.163.com/centos/RPM-GPG-KEY-CentOS-6
#released updates
[updates]
name=CentOS-$releasever - Updates
baseurl=http://mirrors.163.com/centos/6/updates/$basearch/
gpgcheck=1
gpgkey=http://mirrors.163.com/centos/RPM-GPG-KEY-CentOS-6
#packages used/produced in the build but not released
#[addons]
#name=CentOS-$releasever - Addons
#baseurl=http://mirrors.163.com/centos/$releasever/addons/$basearch/
#gpgcheck=1
#gpgkey=http://mirrors.163.com/centos/RPM-GPG-KEY-CentOS-6
#additional packages that may be useful
[extras]
name=CentOS-$releasever - Extras
baseurl=http://mirrors.163.com/centos/6/extras/$basearch/
gpgcheck=1
gpgkey=http://mirrors.163.com/centos/RPM-GPG-KEY-CentOS-6
#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-$releasever - Plus
baseurl=http://mirrors.163.com/centos/6/centosplus/$basearch/
gpgcheck=1
enabled=0
```

### 清除原有缓存

```bash
yum clean all
```

重建缓存，以提高搜索安装软件的速度

```bash
yum makecache
```

### 更新yum源

```bash
yum -y update
```