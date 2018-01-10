---

layout: post
title: Mysql 查看表注释或字段注释
description: Mysql 查看表注释或字段注释
keywords: mysql
categories: 
        - mysql
        - db

---

## 查看所有表的注释

```sql
SELECT
table_name 表名,
table_comment 表说明
FROM
information_schema.TABLES
WHERE
table_schema = '数据库名'
ORDER BY
table_name
```

## 查询所有表及字段的注释

```sql
SELECT
a.table_name 表名,
a.table_comment 表说明,
b.COLUMN_NAME 字段名,
b.column_comment 字段说明,
b.column_type 字段类型,
b.column_key 约束
FROM
information_schema. TABLES a
LEFT JOIN information_schema. COLUMNS b ON a.table_name = b.TABLE_NAME
WHERE
a.table_schema = '数据库名'
ORDER BY
a.table_name
```

## 查询某表的所有字段的注释

```sql
select 
COLUMN_NAME 字段名,
column_comment 字段说明,
column_type 字段类型,
column_key 约束 from information_schema.columns 
where table_schema = '数据库名'
and table_name = '表名' ; 
```

或者

```
show full columns from 表名;
```

## 查看表生成的DDL

注意表名不加单引号

```sql
show create table 表名;
```


## 新建表以及添加表和字段的注释

```sql
create table t_user(
	ID INT(19) primary key auto_increment  comment '主键',
	NAME VARCHAR(300) comment '姓名',
	CREATE_TIME date comment '创建时间'
)comment  = '用户信息表';
```

## 修改表/字段的注释

修改表注释

```sql
alter table t_user comment  = '修改后的表注释信息(用户信息表)';
```

修改字段注释

```sql
alter table t_user modify column id int comment '主键ID';
```

