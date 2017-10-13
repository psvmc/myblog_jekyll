---

layout: post
title: oracle主键自增
description: oracle主键自增
keywords: oracle
category: oracle

---

## 利用SEQUENCE和触发器

例如：表名:`TBOOK`  主键名:`BOOKID`

+ 创建序列

```
create sequence SEQ_BOOK increment by 1 start with 1 maxvalue 999999999; 
```

+ 创建触发器

创建一个基于该表的`before insert触发器`，在触发器中使用该SEQUENCE     
	
```	
create or replace trigger TBOOK_TRIGGER       
before insert on TBOOK       
for each row       
begin       
select SEQ_BOOK.nextval into :new.BOOKID from dual;      
end;
``` 