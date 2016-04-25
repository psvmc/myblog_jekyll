---

layout: post
title: Oracle ora-12505 监听程序当前无法识别sid
description: Oracle ora-12505 监听程序当前无法识别sid
keywords: oracle
category: oracle

---

## 修改listener文件

文件路径类似于  
`D:\Oracle\product\11.2.0\dbhome_1\NETWORK\ADMIN`  
找到`listener文件`

## 配置修改

配置修改为如下配置:

```SID_LIST_LISTENER =  (SID_LIST =    (SID_DESC =      (SID_NAME = CLRExtProc)      (ORACLE_HOME = D:\Oracle\product\11.2.0\dbhome_1)      (PROGRAM = extproc)      (ENVS = "EXTPROC_DLLS=ONLY:D:\Oracle\product\11.2.0\dbhome_1\bin\oraclr11.dll")    )    (SID_DESC =      (GLOBAL_DBNAME = orcl)      (SID_NAME = orcl)      (ORACLE_HOME = D:\Oracle\product\11.2.0\dbhome_1)      (ENVS = "EXTPROC_DLLS=ONLY:D:\Oracle\product\11.2.0\dbhome_1\bin\oraclr11.dll")    )  )LISTENER =  (DESCRIPTION_LIST =    (DESCRIPTION =      (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.0.111)(PORT = 1521))    )  )ADR_BASE_LISTENER = D:\Oracle
```

也就是`SID_LIST`中添加`SID_DESC`  
`GLOBAL_DBNAME`设置为`orcl`  
`SID_NAME`设置为`orcl`

## 重启监听服务

启动`OracleOraDb11g_home1TNSListener`服务