---

layout: post
title: Mac OS 上设置 JAVA_HOME
description: Mac OS 上设置 JAVA_HOME
keywords: mac
category: mac

---

## 设置JAVA_HOME

由于需要，前几天在 OS X 上安装了 Oracle 的 Java 7。安装之后，发现由于我原来设置的 JAVA_HOME 为 `/Library/Java/Home` ，导致我使用的还是原来苹果提供的 Java 6 而不是刚安装的 Java 7。

网上查了一下，发现网上普遍存在一种不太好的硬编码方式，比如以下这些：

```
JAVA_HOME=/Library/Java/Home
JAVA_HOME=/System/Library/Frameworks/JavaVM.framework/Versions/CurrentJDK/Home
JAVA_HOME=/System/Library/Frameworks/JavaVM.framework/Home
```

上面的几个目录其实是等价的链接关系，都指向的是苹果提供的 Java 6
`/System/Library/Frameworks/JavaVM.framework/Versions/` 下有多个不同版本的目录，但它们链接的都是 CurrentJDK 目录。总之，这些Java都是苹果提供的Java，Oracle 或 OpenJDK 提供的 Java 不在此目录中。

因为不同的 Java 版本和不同的 Java 实现可能安装在了不同的目录下，所以使用硬编码的目录会有如下缺点：   
安装或升级新的 Java 后需要重新设置 `JAVA_HOME`（尤其是带版本号的目录）   
无法适应不同的 Java 实现（Apple和Oracle的）

一点历史：过去 Mac 上的 Java 都是由 Apple 自己提供的，只支持到 Java 6，并且OS X 10.7 开始系统并不自带（而是可选安装）。后来 Apple 加入 OpenJDK 继续支持 Java 6，而 Java 7 将由 Oracle 负责提供。  

根据苹果的官方说明，Mac OS X 10.5 及以后的版本应该使用 `/usr/libexec/java_home` 命令来确定 `JAVA_HOME` ，而在此之前的版本由于没有这个命令，则应该使用固定的 `/Library/Java/Home` 目录。

最佳方式是：

```
export JAVA_HOME=`/usr/libexec/java_home`
```

另外，你还可以这样用，来选择不同的Java版本：

```
export JAVA_HOME=`/usr/libexec/java_home -v 1.6`;
或者
export JAVA_HOME=`/usr/libexec/java_home -v 1.7`;
或者
export JAVA_HOME=`/usr/libexec/java_home -v 1.8`;
```

查询设置的JAVA_HOME

```
echo $JAVA_HOME
```