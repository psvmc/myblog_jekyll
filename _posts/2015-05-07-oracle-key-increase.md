---

layout: post
title: oracle主键自增
description: oracle主键自增
keywords: oracle
category: oracle

---

## 利用SEQUENCE和触发器

例如：表名 user  主键名：userId

	create sequence s_userId increment by 1 start with 1 maxvalue 999999999; 

创建一个基于该表的before insert触发器，在触发器中使用该SEQUENCE     

	create or replace trigger bef_ins_user 
	before insert on user 
	referencing old as old new as new for each row 
	begin 
	new.usrId=s_userId.nextval; 
	end; 