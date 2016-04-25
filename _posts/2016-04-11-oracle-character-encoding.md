---

layout: post
title: Oracle修改编码
description: Oracle修改编码
keywords: oracle
category: oracle

---

## 数据库迁移注意事项

迁移数据库的时候一定要注意 安装数据库的**编码一定要与原数据库保持一致**

## 查看数据库的编码

```sql
select * from v$nls_parameters where parameter = 'NLS_CHARACTERSET';
```

安装Oracle时默认的编码就是`ZHS16GBK`  
如果安装时选了别的编码  怎样把编码改回来呢
下面就说一下怎样把数据库编码改回`ZHS16GBK`

## 修改数据库编码

在CMD中运行以下命令

```
sqlplus /nolog 

SQL>connect sys/oracle as sysdba
SQL>shutdown immediate;
SQL> startup mount;
SQL> alter system enable restricted session;
SQL> alter system set job_queue_processes=0;
SQL> alter database open;
SQL> alter database character set internal_use ZHS16GBK;
SQL> shutdown immediate;
SQL> startup
```

这样数据库的编码就会改回默认的`ZHS16GBK`编码了