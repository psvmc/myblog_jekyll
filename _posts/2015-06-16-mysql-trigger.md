---

layout: post
title: mysql触发器
description: mysql触发器
keywords: mysql
category: mysql

---

数据库中除了需要定时完成一些任务外，有时我们也想在某些表数据变化时自动执行些操作，这就要用到触发器了
### 基本语法
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

### 触发条件
`INSERT` 型触发器：插入某一行时激活触发器，可能通过 `INSERT`、`LOAD DATA`、`REPLACE` 语句触发；  
`UPDATE` 型触发器：更改某一行时激活触发器，可能通过 `UPDATE` 语句触发；  
`DELETE` 型触发器：删除某一行时激活触发器，可能通过 `DELETE`、`REPLACE` 语句触发。  

### 简单例子
	-- 删除已有同名触发器
	DROP TRIGGER IF EXISTS t_afterupdate_on_sendtask;
	-- 创建新触发器
	CREATE TRIGGER t_afterupdate_on_sendtask 
	AFTER UPDATE ON t_sendtask 
	FOR EACH ROW
	BEGIN
		UPDATE gc_sendtask SET SendFlag = new.SendFlag,SendTime=new.SendTime WHERE TaskID = new.TaskID;
	END;

如上例子就演示了`t_sendtask`表更新后自动更新`gc_sendtask`表的某些字段
### NEW 与 OLD

上述示例中使用了 `NEW` 关键字  
MySQL 中定义了 `NEW` 和 `OLD`，用来表示触发器的所在表中，触发了触发器的那一行数据。
具体：  
在 `INSERT` 型触发器中，`NEW` 用来表示将要（`BEFORE`）或已经（`AFTER`）插入的新数据；  
在 `UPDATE` 型触发器中，`OLD` 用来表示将要或已经被修改的原数据，`NEW` 用来表示将要或已经修改为的新数据；  
在 `DELETE` 型触发器中，`OLD` 用来表示将要或已经被删除的原数据；  
使用方法： `NEW.columnName` （columnName 为相应数据表某一列名）  

### SET
	SET newId=NEW.id;
### 查看触发器
	SHOW TRIGGERS;