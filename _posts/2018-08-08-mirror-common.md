---
layout: post
title: 开发常用的各种镜像站
description: 开发常用的各种镜像站
keywords: android,maven,镜像
categories: android java maven

---



## Android镜像

### 方式一 修改 hosts 文件

 在使用 `Android SDK Manager` 的时候，主要会连接到两个地址 `dl.google.com` 和  `dl-ssl.google.com`，

可以发现这两个地址都是无法正常访问的，如何解决呢？

我们可以通过修改 hosts  文件，将上面的地址定向到能正常访问的 Google 服务器。

我们可以使用[`站长工具的超级 ping`](http://ping.chinaz.com/) 来查找可用IP。

打开地址：http://ping.chinaz.com/，分别测试 `dl.google.com` 和 `dl-ssl.google.com` 的IP地址，

将获取到的IP写入以下文件

+ Win `C:\Windows\System32\drivers\etc\hosts`

+ Mac `/private/etc/hosts`

### 方式二 使用国内镜像源

+ [mirrors.neusoft.edu.cn:80](mirrors.neusoft.edu.cn:80)  //东软信息学院



## Maven镜像

### 可用镜像

阿里云的镜像站（首推，新站，速度暴快）

```xml
<mirror>
    <id>nexus-aliyun</id>
    <name>Nexus aliyun</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
```

maven官方运维的2号仓库

```xml
<mirror>
    <id>repo2</id>
    <name>Mirror from Maven Repo2</name>
    <url>http://repo2.maven.org/maven2/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
```

maven在UK架设的仓库（有时候速度会比官方2号仓库快）

```xml
<mirror>
    <id>ui</id>
    <name>Mirror from UK</name>
    <url>http://uk.maven.org/maven2/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
```

JBoss的仓库

```xml
<mirror>
    <id>jboss-public-repository-group</id>
    <mirrorOf>central</mirrorOf>
    <name>JBoss Public Repository Group</name>
    <url>http://repository.jboss.org/nexus/content/groups/public</url>
</mirror>
```

### 使用方式

修改`${maven.home}/conf`或者`${user.home}/.m2`文件夹下的`settings.xml`文件，

在`<mirrors>`标签下加入上述内容即可。如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <?xml version="1.0" encoding="UTF-8"?>
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <mirrors>
            <!-- 阿里云仓库 -->
            <mirror>
                <id>alimaven</id>
                <mirrorOf>central</mirrorOf>
                <name>aliyun maven</name>
                <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
            </mirror>
            <!-- 中央仓库1 -->
            <mirror>
                <id>repo1</id>
                <mirrorOf>central</mirrorOf>
                <name>Human Readable Name for this Mirror.</name>
                <url>http://repo1.maven.org/maven2/</url>
            </mirror>
            <!-- 中央仓库2 -->
            <mirror>
                <id>repo2</id>
                <mirrorOf>central</mirrorOf>
                <name>Human Readable Name for this Mirror.</name>
                <url>http://repo2.maven.org/maven2/</url>
            </mirror>
        </mirrors>
    </settings>
</settings>
```



## Maven仓库

 阿里云

```xml
<repository>
    <id>maven-ali</id>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <releases>
        <enabled>true</enabled>
    </releases>
    <snapshots>
        <enabled>true</enabled>
        <updatePolicy>always</updatePolicy>
        <checksumPolicy>fail</checksumPolicy>
    </snapshots>
</repository>
```

sonatype

```xml
<repository>
	<id>oss-sonatype-snapshots</id>
	<name>OSS Sonatype Snapshots Repository</name>
	<url>http://oss.sonatype.org/content/repositories/snapshots</url>
	<releases>
		<enabled>false</enabled>
	</releases>
	<snapshots>
		<enabled>true</enabled>
	</snapshots>
</repository>
```

sun

```xml
<repository>
	<id>sun</id>
	<name>sun</name>
	<url>https://repository.jboss.org/nexus/content/groups/public-jboss/</url>
	<releases>
		<enabled>false</enabled>
	</releases>
	<snapshots>
		<enabled>true</enabled>
	</snapshots>
</repository>
```

alfresco

```xml
<repository>
	<id>alfresco.public</id>
	<name>Alfresco Public Repository</name>
	<url>https://maven.alfresco.com/nexus/content/groups/public</url>
	<releases>
		<enabled>true</enabled>
	</releases>
	<snapshots>
		<enabled>false</enabled>
	</snapshots>
</repository>
```

spring

```xml
<repository>
	<id>springsource-repo</id>
	<name>SpringSource Repository</name>
	<url>http://repo.springsource.org/release</url>
</repository>

```



## Ruby镜像

[`RubyGems 镜像`](https://ruby.taobao.org/)

```bash
$ gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
$ gem sources -l
*** CURRENT SOURCES ***

https://gems.ruby-china.org
# 请确保只有 gems.ruby-china.org
$ gem install rails
```



## Flutter国内镜像

```bash
git clone -b beta https://github.com/flutter/flutter.git
export PUB_HOSTED_URL=https://pub.flutter-io.cn //国内用户需要设置
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn //国内用户需要设置
export PATH=`pwd`/flutter/bin:$PATH
```

