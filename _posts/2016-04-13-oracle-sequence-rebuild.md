---

layout: post
title: Oracle 序列重建
description: Oracle 序列重建
keywords: oracle
category: oracle

---

## 简介

在导出数据的时候 数据库会先导出序列  再导出表数据 就会导致表中的id大于序列的值 导致新插入数据时 报唯一约束错误

这时候我们可以重建序列 具体步骤为

+ 1 生成创建序列语句    
+ 2 生成删除序列语句    
+ 3 执行删除序列语句  
+ 4 执行创建序列语句  

### 生成创建序列语句

注意修改语句中的`username`

```sql
SELECT ' create sequence username.' || SEQUENCE_NAME ||   
       ' minvalue ' || MIN_VALUE ||   
       ' maxvalue ' || MAX_VALUE ||   
       ' start with ' || LAST_NUMBER ||   
       ' increment by ' || INCREMENT_BY ||   
       ' cache ' || CACHE_SIZE || ' ;'  
FROM USER_SEQUENCES; 
```

这里说一下 如果序列设置`nocache` 那么上面获取的`CACHE_SIZE`就会为0  执行创建语句时会报 `cache` 必须`大于1`的错误  所以可以在导出时设置个值

```sql
SELECT ' create sequence username.' || SEQUENCE_NAME ||   
       ' minvalue ' || MIN_VALUE ||   
       ' maxvalue ' || MAX_VALUE ||   
       ' start with ' || LAST_NUMBER ||   
       ' increment by ' || INCREMENT_BY ||   
       ' cache 10;'  
FROM USER_SEQUENCES; 
```

或者用这个SQL(跟上面结果一样)

```sql
select dbms_metadata.get_ddl('SEQUENCE',u.object_name) from user_objects u where object_type='SEQUENCE';
```

同理要想查询创建表的语句可以这样写

```sql
select dbms_metadata.get_ddl('TABLE',u.object_name) from user_objects u where object_type='TABLE';
```

上面的那个查询建表语句的效率不高  下面这个会高一点

```sql
-- 全查
select dbms_metadata.get_ddl('TABLE',TABLE_NAME,user) from user_tables where table_name=&tab;
```

```sql
-- 查询某个表
select dbms_metadata.get_ddl('TABLE',TABLE_NAME,user) from user_tables where table_name=&tab;
```

关于cache

一般情况下都建议使用`cache` 如果要`保证生成的id必须是连续的`则设置`nocache`

### 生成删除序列语句

```sql
SELECT ' drop sequence username.' || SEQUENCE_NAME ||';' FROM USER_SEQUENCES; 
```

### 怎样方便的得到生成的sql语句

我使用的工具是`Oracle SQL Developer`

上面的两步都可以在查询结果中生成一堆的sql语句 怎样把他们获取呢 一行一行复制实在是太慢了  

我们可以在`查询结果`上 `右键` --> `导出`   
`格式`选择`text`  
`左定界符`和`右定界符`都`设置为空`   
设置导出文件位置   
`下一步` --> `完成`

得到的文件中**第一行是没用的**  删掉即可

