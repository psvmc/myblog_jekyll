---

layout: post
title: Oracle 删除表空间错误
description: Oracle 删除表空间 出现"无法删除用于强制唯一主键的索引"解决方法
keywords: oracle
category: oracle

---

## 解决方案

Oracle删除表空间 出现"无法删除用于强制唯一主键的索引"解决方法

假设表空间为**yidaisong**

1)查询

```
select segment_name,partition_name,tablespace_name from dba_extents where tablespace_name=upper('yidaisong');
```

2)生成更新语句

```
select 'alter table '||owner||'.'||table_name||' drop constraint '||constraint_name||' ;' from dba_constraints where constraint_type in ('U', 'P') and (index_owner, index_name) in (select owner, segment_name from dba_segments where tablespace_name = upper('yidaisong'));
```

3)执行生成的语句

4)删除表空间

```
DROP TABLESPACE yidaisong INCLUDING CONTENTS AND DATAFILES;
```