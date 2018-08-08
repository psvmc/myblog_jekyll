---
layout: post
title: Mysql触发器
description: Mysql触发器
keywords: mysql
category: mysql

---

数据库中除了需要定时完成一些任务外，有时我们也想在某些表数据变化时自动执行些操作，这就要用到触发器了
## 基本语法

	-- 删除已有同名触发器
	DROP TRIGGER IF EXISTS trigger_name;
	-- 创建新触发器
	CREATE TRIGGER trigger_name 
	trigger_time trigger_event 
	ON tbl_name 
	FOR EACH ROW
	BEGIN
		trigger_stmt;
	END;

其中：  
`trigger_name`：标识触发器名称，用户自行指定；  
`trigger_time`：标识触发时机，取值为 `BEFORE` 或 `AFTER`；  
`trigger_event`：标识触发事件，取值为 `INSERT`、`UPDATE` 或 `DELETE`；  
`tbl_name`：标识建立触发器的表名，即在哪张表上建立触发器；  
`trigger_stmt`：触发器程序体，可以是一句SQL语句，或者用 `BEGIN` 和 `END` 包含的多条语句。  

## 触发条件

`INSERT` 型触发器：插入某一行时激活触发器，可能通过 `INSERT`、`LOAD DATA`、`REPLACE` 语句触发；  
`UPDATE` 型触发器：更改某一行时激活触发器，可能通过 `UPDATE` 语句触发；  
`DELETE` 型触发器：删除某一行时激活触发器，可能通过 `DELETE`、`REPLACE` 语句触发。  

## 简单例子

如果设置 或定义变量 要按照一下的格式写



比如修改数据前 修改要插入的数据

```mysql
delimiter $$
DROP TRIGGER IF EXISTS t_a_stage_group_score_before_insert$$
create trigger t_a_stage_group_score_before_insert
 before insert on a_stage_group_score
 FOR EACH ROW
 BEGIN 
	SET NEW.`avgscorepre` = (select avgscorenext from a_stage_group_score where schoolid=NEW.schoolid and groupid=NEW.groupid and subjectid=NEW.subjectid ORDER BY examtime desc limit 0,1);
 END; $$
delimiter ; 
```

## 定义变量

 mysql存储过程中，定义变量有两种方式：

+ 1.使用set或select直接赋值，变量名以 @ 开头.

   例如:

  ```mysql
  set @var=1;
  ```

  可以在一个会话的任何地方声明，作用域是整个会话，称为会话变量。

+ 2.以 DECLARE 关键字声明的变量，只能在存储过程中使用，称为存储过程变量，例如：

  ```mysql
  DECLARE max_rank INT DEFAULT 0;  
  set max_rank = (select max(rank) from user );  
  ```

  主要用在存储过程中，或者是给存储传参数中。

 两者的区别是：

 在调用存储过程时，以DECLARE声明的变量都会被初始化为 NULL。而会话变量（即@开头的变量）则不会被再初始化，在一个会话内，只须初始化一次，之后在会话内都是对上一次计算的结果，就相当于在是这个会话内的全局变量。

 在存储过程中，使用动态语句，预处理时，动态内容必须赋给一个会话变量。
 例：

```mysql
set @v_sql= sqltext;
 PREPARE stmt FROM @v_sql;  
 EXECUTE stmt;     
 DEALLOCATE PREPARE stmt;
```



## NEW 与 OLD

上述示例中使用了 `NEW` 关键字  
MySQL 中定义了 `NEW` 和 `OLD`，用来表示触发器的所在表中，触发了触发器的那一行数据。
具体：  
在 `INSERT` 型触发器中，`NEW` 用来表示将要（`BEFORE`）或已经（`AFTER`）插入的新数据；  
在 `UPDATE` 型触发器中，`OLD` 用来表示将要或已经被修改的原数据，`NEW` 用来表示将要或已经修改为的新数据；  
在 `DELETE` 型触发器中，`OLD` 用来表示将要或已经被删除的原数据；  
使用方法： `NEW.columnName` （columnName 为相应数据表某一列名）  



## if else

```mysql
declare stu_grade float;  
select grade into stu_grade from grade where student_no=stu_no and course_no=cour_no;  
if stu_grade>=90 then 
    select stu_grade,'A';  
elseif stu_grade<90 and stu_grade>=80 then 
    select stu_grade,'B';  
else 
    select stu_grade,'C';  
end if; 
```



## 查看触发器

```mysql
SHOW TRIGGERS;
```

