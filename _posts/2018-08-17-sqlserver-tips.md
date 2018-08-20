---
layout: post
title: SqlServer常用操作
description: SqlServer常用操作
keywords: sqlserver
categories: sqlserver

---



## 脱机失败

错误提示

>  sqlserver数据库脱机时发生异常：由于无法在数据库 'xxx' 上放置锁，ALTER DATABASE 失败。请稍后再试。 ALTER DATABASE 语句失败

 解决办法：

通过如下指令，获取当前DB的Session，然后将对应的SPID Kill掉，之后再执行ALTER DATABASE 语句。

```bash
EXEC sp_who2;
KILL <SPID>;
```

