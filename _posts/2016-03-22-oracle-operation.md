---

layout: post
title: Oracle常用操作
description: Oracle常用操作
keywords: oracle
category: oracle

---

## 表和用户

以下操作均在`sqlplus`下执行

### 查询所有表空间

`select tablespace_name from dba_data_files;`

### 查看当前用户的缺省表空间

`select username,default_tablespace from user_users;`

### 查看当前用户的角色

`select * from user_role_privs;`

### 创建表空间

`create tablespace yidaisongtest datafile 'D:\oracle\oradata\yidaisongtest.dbf' size 50m autoextend on;`

注意`D:\oracle\oradata\`路径必须存在

### 创建用户

`CREATE USER yidaisongtest IDENTIFIED BY yidaisongtest DEFAULT TABLESPACE yidaisongtest TEMPORARY TABLESPACE temp;`

### 分配权限

`GRANT CONNECT,RESOURCE,dba TO yidaisongtest;` 

### 删除表空间

`DROP TABLESPACE yidaisongtest INCLUDING CONTENTS AND DATAFILES;`

### 更新用户默认表空间

`ALTER USER yidaisongtest DEFAULT TABLESPACE yidaisongtest;`

### 修改表空间名

`alter tablespace  yidaisongtest rename to yidaisong;`

## 导入导出

推荐**Oracle10G及以上** 用**expdp和impdp**方式 各种优点 下面再说

### exp和imp方式

以下均在`cmd`中运行  或者直接运行 `exp.exe` 和 `imp.exe`

#### 数据导出(EXP方式)

+ 1) 将数据库TEST完全导出，用户名system 密码manager 导出到D:\daochu.dmp中  
`exp system/manager@TEST file=d:\daochu.dmp full=y`
+ 2) 将数据库中system用户与sys用户的表导出    
`exp system/manager@TEST file=d:\daochu.dmp owner=(system，sys)`    
+ 3) 将数据库中的表table1 、table2导出    
`exp system/manager@TEST file=d:\daochu.dmp tables=(table1，table2)`  
+ 4) 将数据库中的表table1中的字段filed1以"00"打头的数据导出    
`exp system/manager@TEST file=d:\daochu.dmp tables=(table1) query=\" where filed1 like '00%'\"`  

上面是常用的导出， 用`winzip`把`dmp`文件可以很好的压缩。
不过在上面命令后面 加上 `compress=y`  就可以了

#### Oracle11G不能导出空表的解决方法

+ 第一种解决办法

在创建数据库之前，先将数据库`segment`属性进行修改，SQL语句如下：

`alter system set  deferred_segment_creation=false;`

含义如下：`deferred_segment_creation`，含义是段延迟创建，默认是`true`。  
如果这个参数设置为`true`，你新建了一个表T1，并且没有向其中插入数据，那么这个表不会立即分配`extent`，也就是不占数据空间，只有当你insert数据后才分配空间。  
这样可以节省少量的空间。  
设置`deferred_segment_creation` 参数为`FALSE`后，无论是空表还是非空表，都分配`segment`。  
需要注意的是，该值设置后`只对后面新增的表产生作用`，对之前建立的空表不起作用，在修改后需要重新启动数据库参数才能生效

+ 第二种解决办法

先查一下哪些表是空的，然后使用`ALLOCATE EXTENT`为数据库对象分配`Extent`，SQL如下：

查询空表：

`select table_name from user_tables where NUM_ROWS=0;`

生成修改语句：

`select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0;`

执行生成修改语句的SQL后会生成一堆的ALTER的SQL语句，   
`执行生成的语句后`，  
再`进行exp数据导出`，就可以导出所有数据了！

+ 第三种方法

使用**EXPDP**进行数据导出

#### 数据的导入(IMP方式)

+ 1) 将`D:\daochu.dmp` 中的数据导入 TEST数据库中。
`imp system/manager@TEST  file=d:\daochu.dmp`  
上面可能有点问题，因为有的表已经存在，然后它就报错，对该表就不进行导入。
在后面加上 `ignore=y` 就可以了。

+ 2) 将d:\daochu.dmp中的表table1 导入
`imp system/manager@TEST  file=d:\daochu.dmp  tables=(table1)`

基本上上面的导入导出够用了。不少情况我是将表彻底删除，然后导入。


### expdp和impdp方式

#### 关于expdp和impdp  
   
使用EXPDP和IMPDP时应该注意的事项：

+ Oracle10G以上版本（包含Oracle10G）才有该功能
+ **EXP和IMP**是客户端工具程序，它们既可以在**客户端**使用，也可以在**服务端**使用。  
+ **EXPDP和IMPDP**是服务端的工具程序，他们**只能在ORACLE服务端使用**，不能在客户端使用。
+ **IMP只适用于EXP导出的文件**，不适用于EXPDP导出文件；**IMPDP只适用于EXPDP导出的文件**，而不适用于EXP导出文件。
+ IMPDP导入可以**更换表空间**
+ **EXP**方式在Oracle11G上不能导出空表 **EXPDP**可以导出空表


expdp或impdp命令时，可暂不指出用户名/密码@实例名 as 身份，  
然后根据提示再输入，如：

`expdp schemas=scott dumpfile=expdp.dmp DIRECTORY=dpdata1`

#### 具体步骤

所有的**expdp和impdp**命令都是**在CMD中运行**的，并且**命令的结尾不要加分号**  


##### 一、创建逻辑目录

该命令不会在操作系统创建真正的目录，最好以system等管理员创建。

`create directory mydpdata as 'D:\Oracle\mydpdata';`

##### 二、查看管理理员目录

（同时查看操作系统是否存在，因为Oracle并不关心该目录是否存在，如果不存在，则出错）

`select * from dba_directories;`

##### 三、权限赋予

给scott用户赋予在指定目录的操作权限，最好以system等管理员赋予。

`grant read,write on directory mydpdata to scott;`

##### 四、导出数据

1)按用户导

`expdp scott/tiger@orcl schemas=scott dumpfile=expdp.dmp DIRECTORY=mydpdata`

2)并行进程parallel

`expdp scott/tiger@orcl directory=mydpdata dumpfile=scott3.dmp parallel=40 job_name=scott3`

3)按表名导

`expdp scott/tiger@orcl TABLES=emp,dept dumpfile=expdp.dmp DIRECTORY=mydpdata`

4)按查询条件导

`expdp scott/tiger@orcl directory=mydpdata dumpfile=expdp.dmp Tables=emp query='WHERE deptno=20'`

5)按表空间导

如果导出的表空间中没有建表是会报错的

`expdp system/manager DIRECTORY=mydpdata DUMPFILE=tablespace.dmp TABLESPACES=temp,example`

6)导整个数据库

`expdp system/manager DIRECTORY=mydpdata DUMPFILE=full.dmp FULL=y`

##### 五、还原数据

1)导入到指定用户下

`impdp scott/tiger DIRECTORY=mydpdata DUMPFILE=expdp.dmp SCHEMAS=scott`

2)改变表的owner

`impdp system/manager DIRECTORY=mydpdata DUMPFILE=expdp.dmp TABLES=scott.dept REMAP_SCHEMA=scott:system`

3)导入表空间

`impdp system/manager DIRECTORY=mydpdata DUMPFILE=tablespace.dmp TABLESPACES=example`

4)导入数据库

`impdb system/manager DIRECTORY=mydpdata DUMPFILE=full.dmp FULL=y`

5)追加数据

`impdp system/manager DIRECTORY=mydpdata DUMPFILE=expdp.dmp SCHEMAS=system TABLE_EXISTS_ACTION`

### 表空间不同的导入方法

#### 方式1:imp方式

用文本编辑器打开 替换`表空间A`全部替换成`表空间B`  再进行导入

用`notepad++`打开导出的`dmp`文件  
查找所有的`TABLESPACE "表空间A"`  
替换为`TABLESPACE "表空间B"`就行了

#### 方式2:impdp方式

`impdp 用户名/密码 DIRECTORY=mydpdata DUMPFILE=beifen.dmp TABLESPACES=表空间名 remap_schema=源用户名:新用户名 remap_tablespace=源表空间:新表空间`

例如

`impdp yidaisongtest/yidaisongtest DIRECTORY=mydpdata DUMPFILE=yidaisong0323.dmp TABLESPACES=yidaisong remap_schema=yidaisong:yidaisongtest remap_tablespace=yidaisong:yidaisongtest`

数据泵impdp参数：

+ 1.REMAP_DATAFILE  
    该选项用于将源数据文件名转变为目标数据文件名
    
    `REMAP_DATAFILE=source_datafie:target_datafile` 

+ 2.REMAP_SCHEMA    
    该选项用于将源方案的所有对象装载到目标方案中.就是用户名   
    
    `REMAP_SCHEMA=source_schema:target_schema`

+ 3.REMAP_TABLESPACE  
    将源表空间的所有对象导入到目标表空间中
    
    `REMAP_TABLESPACE=source_tablespace:target:tablespace` 

+ 4.REUSE_DATAFILES  
    该选项指定建立表空间时是否覆盖已存在的数据文件.默认为N
    
    `REUSE_DATAFIELS={Y | N}` 

+ 5.SKIP_UNUSABLE_INDEXES  
    指定导入是是否跳过不可使用的索引,默认为N
 
+ 6.sqlfile  参数允许创建DDL 脚本文件  

    `impdp scott/tiger directory=dump_scott dumpfile=a1.dmp sqlfile=c.sql`  
    
    默认放在directory下，因此不要指定绝对路径
 
+ 7.STREAMS_CONFIGURATION  
    指定是否导入流元数据(Stream Matadata),默认值为Y. 

+ 8.TABLE_EXISTS_ACTION  
    该选项用于指定当表已经存在时导入作业要执行的操作,默认为SKIP 
      
    `TABBLE_EXISTS_ACTION={SKIP | APPEND | TRUNCATE | REPLACE }`  
     
    当设置该选项为SKIP时,导入作业会跳过已存在表处理下一个对象;  
    当设置为APPEND时,会追加数据;  
    当设置为TRUNCATE时,导入作业会截断表,然后为其追加新数据;  
    当设置为REPLACE时,导入作业会删除已存在表,重建表并追加数据;     

    注意,TRUNCATE选项不适用与簇表和NETWORK_LINK选项  
    
#### 方式3:修改表空间方式

假设原数据文件的位置为`D:\oracle\a.dbf`

1、使表空间zerone离线

`alter tablespace zerone offline;`

2、修改表空间名

`alter tablespace  zerone rename to zerone_test;`
 
3、复制数据文件到新的目录

复制`D:\oracle\a.dbf`到`D:\oracle\b.dbf`

4、rename修改表空间数据文件为新的位置，并修改控制文件

`alter tablespace zerone_test rename datafile 'D:\oracle\a.dbf' to 'D:\oracle\b.dbf'`;

5、online表空间

`alter tablespace zerone_test online`;

6、检查

`select name from v$datafile`;

设想

假如有一个**表空间a** 对应的数据文件为 **a.dbf**  
我们又建一个**表空间b** 对应的数据文件为 **b.dbf**  
我们想让**表空间b**中的数据及表结构与表**空间a**一样  
我们把**表空间b**设为**离线状态** 删除数据文件b.dbf  
复制a.dbf为b.dbf  
在设置**表空间b**为**在线状态** 发现失败了  
事实证明**直接换文件是不可行的**

### oracle 10g 和11g的互相导入和导出    

+ 1) 可以用10g的client连接11个导出11g的数据库，即可导入10g   
+ 2)用expdp,impdp  
如：
在11g服务器上，使用`expdp`命令备份数据

`EXPDP USERID='SYS/cuc2009@cuc as sysdba' schemas=sybj directory=DATA_PUMP_DIR dumpfile=aa.dmp logfile=aa.log version=10.2.0.1.0`


在10g服务器上，使用impdp命令恢复数据

准备工作：  
1.建库2.建表空间3.建用户并授权4.将aa.dmp拷贝到10g的dpdump目录下  

`IMPDP USERID='SYS/cuc2009@cucf as sysdba' schemas=sybj directory=mydpdata dumpfile=aa.dmp logfile=aa.log version=10.2.0.1.0`


## 冷备份还原

关掉数据库  
把数据文件`D:\oracle\a.dbf`拷贝到别的位置  

还原时再拷过来就行了

缺点只能对同一个Oracle中进行备份还原  
其他Oracle中环境不一样，会失败


## Windows server 2012 安装Oracle错误

在 `Windows server 2012` 上安装`Oracle 11G`老是最后报一个错误  导致没发远程连接数据库，原因就是系统没安装`.NET Framework 3.5`

安装方法 见[百度经验](http://jingyan.baidu.com/article/14bd256e26b714bb6d26128a.html)


## 查询数据库字符编码

```
select userenv('language') from dual;
```
