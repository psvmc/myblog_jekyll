---

layout: post
title: sqlite使用简介
description: sqlite使用简介
keywords: sqlite,数据库
categories: sqlite

---

### 数据类型

#### 5种数据类型  

+ NULL: 表示该值为NULL值。
+ INTEGER: 无符号整型值。
+ REAL: 浮点值。
+ TEXT: 文本字符串，存储使用的编码方式为UTF-8、UTF-16BE、UTF-16LE。
+ BLOB: 存储Blob数据，该类型数据和输入数据完全相同。

但是创建表的时候也可以写成以下的数据类型，sqlite有一个匹配的原则，并且`不用指定字段的长度`



布尔数据类型： 
 
    SQLite并没有提供专门的布尔存储类型，取而代之的是存储整型1表示true，0表示false。
    
日期和时间数据类型：    

	推荐使用text类型保存，因为sqlite内置的时间处理函数传入的都是字符串  
	和布尔类型一样，SQLite也同样没有提供专门的日期时间存储类型，而是以TEXT、REAL和INTEGER类型分别不同的格式表示该类型，如：
	TEXT: "YYYY-MM-DD HH:MM:SS.SSS"
	REAL: 以Julian日期格式存储
	INTEGER: 以Unix时间形式保存数据值，即从1970-01-01 00:00:00到当前时间所流经的秒数。



#### 匹配原则

##### 决定字段亲缘性的规则

字段的亲缘性是根据该字段在声明时被定义的类型来决定的，具体的规则可以参照以下列表。需要注意的是以下列表的顺序，即如果某一字段类型同时符合两种亲缘性，那么排在前面的规则将先产生作用。

    1). 如果类型字符串中包含"INT"，那么该字段的亲缘类型是INTEGER。
    2). 如果类型字符串中包含"CHAR"、"CLOB"或"TEXT"，那么该字段的亲缘类型是TEXT，如VARCHAR。
    3). 如果类型字符串中包含"BLOB"，那么该字段的亲缘类型是NONE。
    4). 如果类型字符串中包含"REAL"、"FLOA"或"DOUB"，那么该字段的亲缘类型是REAL。
    5). 其余情况下，字段的亲缘类型为NUMERIC。


##### 具体示例

<table>
<tr><th>声明类型</th><th>亲缘类型</th><th>应用规则</th></tr>
<tr>
	<td>
		INT<br/>
		INTEGER<br/>
		TINYINT<br/>
		SMALLINT<br/>
		MEDIUMINT<br/>
		BIGINT<br/>
		UNSIGNED BIG INT<br/>
		INT2<br/>
		INT8<br/>
	</td>
	<td>
		INTEGER
	</td>
	<td>
		1
	</td>
</tr>
<tr>
	<td>
		CHARACTER(20)<br/>
		VARCHAR(255)<br/>
		VARYING CHARACTER(255)<br/>
		NCHAR(55)<br/>
		NATIVE CHARACTER(70)<br/>
		NVARCHAR(100)<br/>
		TEXT<br/>
		CLOB<br/>
	</td>
	<td>
		TEXT
	</td>
	<td>
		2
	</td>
</tr>
<tr>
	<td>
		BLOB<br/>
	</td>
	<td>
		NONE
	</td>
	<td>
		3
	</td>
</tr>
<tr>
	<td>
		REAL<br/>
		DOUBLE<br/>
		DOUBLE PRECISION<br/>
		FLOAT<br/>
	</td>
	<td>
		REAL
	</td>
	<td>
		4
	</td>
</tr>
<tr>
	<td>
		NUMERIC<br/>
		DECIMAL(10,5)<br/>
		BOOLEAN<br/>
		DATE<br/>
		DATETIME<br/>
	</td>
	<td>
		NUMERIC
	</td>
	<td>
		5
	</td>
</tr>

</table>

### limit分页

sql中的limit与mysql的不同  
limit 20 offset 0  
上面的例子表示取20条数据，跳过0条  
相当于mysql中的limit(0,10)

### 比较表达式

在SQLite3中支持的比较表达式有：`"="`, `"=="`, `"<"`, `"<="`, `">"`, `">="`, `"!="`, `"<>"`, `"IN"`, `"NOT IN"`, `"BETWEEN"`, `"IS"` and `"IS NOT"`。  

    数据的比较结果主要依赖于操作数的存储方式，其规则为：
    
    1). 存储方式为NULL的数值小于其它存储类型的值。
    2). 存储方式为INTEGER和REAL的数值小于TEXT或BLOB类型的值，如果同为INTEGER或REAL，则基于数值规则进行比较。
    3). 存储方式为TEXT的数值小于BLOB类型的值，如果同为TEXT，则基于文本规则(ASCII值)进行比较。
    4). 如果是两个BLOB类型的数值进行比较，其结果为C运行时函数memcmp()的结果。


### 操作符

所有的数学操作符(+, -, *, /, %, <<, >>, &, and |)在执行之前都会先将操作数转换为NUMERIC存储类型，即使在转换过程中可能会造成数据信息的丢失。此外，如果其中一个操作数为NULL，那么它们的结果亦为NULL。在数学操作符中，如果其中一个操作数看上去并不像数值类型，那么它们结果为0或0.0。

### 内置函数

#### 核心函数

<table>
<tr><th>函数</th><th>说明</th></tr>
<tr>
	<td>abs(X)</td>
	<td>
	该函数返回数值参数X的绝对值，如果X为NULL，则返回NULL，如果X为不能转换成数值的字符串，则返回0，如果X值超出Integer的上限，则抛出"Integer Overflow"的异常。
	</td>
</tr>
<tr>
	<td>changes()</td>
	<td>
	该函数返回最近执行的INSERT、UPDATE和DELETE语句所影响的数据行数。我们也可以通过执行C/C++函数sqlite3_changes()得到相同的结果。
	</td>
</tr>
<tr>
	<td>coalesce(X,Y,...)</td>
	<td>
	返回函数参数中第一个非NULL的参数，如果参数都是NULL，则返回NULL。该函数至少2个参数。
	</td>
</tr>
<tr>
	<td>ifnull(X,Y)</td>
	<td>
	该函数等同于两个参数的coalesce()函数，即返回第一个不为NULL的函数参数，如果两个均为NULL，则返回NULL。
	</td>
</tr>
<tr>
	<td>length(X)</td>
	<td>
	如果参数X为字符串，则返回字符的数量，如果为数值，则返回该参数的字符串表示形式的长度，如果为NULL，则返回NULL。
	</td>
</tr>
<tr>
	<td>lower(X)</td>
	<td>
	返回函数参数X的小写形式，缺省情况下，该函数只能应用于ASCII字符。
	</td>
</tr>
<tr>
	<td>ltrim(X[,Y])</td>
	<td>
	如果没有可选参数Y，该函数将移除参数X左侧的所有空格符。如果有参数Y，则移除X左侧的任意在Y中出现的字符。最后返回移除后的字符串。
	</td>
</tr>
<tr>
	<td>max(X,Y,...)</td>
	<td>
	返回函数参数中的最大值，如果有任何一个参数为NULL，则返回NULL。
	</td>
</tr>
<tr>
	<td>min(X,Y,...)</td>
	<td>
	返回函数参数中的最小值，如果有任何一个参数为NULL，则返回NULL。
	</td>
</tr>
<tr>
	<td>nullif(X,Y)</td>
	<td>
	如果函数参数相同，返回NULL，否则返回第一个参数。　
	</td>
</tr>

<tr>
	<td>random()</td>
	<td>
	返回整型的伪随机数。　
	</td>
</tr>
<tr>
	<td>replace(X,Y,Z)</td>
	<td>
	将字符串类型的函数参数X中所有子字符串Y替换为字符串Z，最后返回替换后的字符串，源字符串X保持不变。　
	</td>
</tr>
<tr>
	<td>round(X[,Y])</td>
	<td>
	返回数值参数X被四舍五入到Y刻度的值，如果参数Y不存在，缺省参数值为0。　
	</td>
</tr>
<tr>
	<td>rtrim(X[,Y])</td>
	<td>
	如果没有可选参数Y，该函数将移除参数X右侧的所有空格符。如果有参数Y，则移除X右侧的任意在Y中出现的字符。最后返回移除后的字符串。　
	</td>
</tr>

<tr>
	<td>substr(X,Y[,Z])</td>
	<td>
	返回函数参数X的子字符串，从第Y位开始(X中的第一个字符位置为1)截取Z长度的字符，如果忽略Z参数，则取第Y个字符后面的所有字符。如果Z的值为负数，则从第Y位开始，向左截取abs(Z)个字符。如果Y值为负数，则从X字符串的尾部开始计数到第abs(Y)的位置开始。　
	</td>
</tr>

<tr>
	<td>total_changes()</td>
	<td>
	该函数返回自从该连接被打开时起，INSERT、UPDATE和DELETE语句总共影响的行数。我们也可以通过C/C++接口函数sqlite3_total_changes()得到相同的结果。　
	</td>
</tr>
<tr>
	<td>trim(x[,y])</td>
	<td>
	如果没有可选参数Y，该函数将移除参数X两侧的所有空格符。如果有参数Y，则移除X两侧的任意在Y中出现的字符。最后返回移除后的字符串。　
	</td>
</tr>
<tr>
	<td>upper(X)</td>
	<td>
	返回函数参数X的大写形式，缺省情况下，该函数只能应用于ASCII字符。　
	</td>
</tr>
<tr>
	<td>typeof(X)</td>
	<td>
	返回函数参数数据类型的字符串表示形式，如"Integer、text、real、null"等。　
	</td>
</tr>

</table>

#### 聚合函数

SQLite中支持的聚合函数在很多其他的关系型数据库中也同样支持，因此我们这里将只是给出每个聚集函数的简要说明，而不在给出更多的示例了。这里还需要进一步说明的是，对于所有聚合函数而言，distinct关键字可以作为函数参数字段的前置属性，以便在进行计算时忽略到所有重复的字段值，如count(distinct x)。
<table>
	<tr><th>函数</th><th>说明</th></tr>
	<tr>
		<td>avg(x)</td>
		<td>
		该函数返回在同一组内参数字段的平均值。对于不能转换为数字值的String和BLOB类型的字段值，如'HELLO'，SQLite会将其视为0。avg函数的结果总是浮点型，唯一的例外是所有的字段值均为NULL，那样该函数的结果也为NULL。
		</td>
	</tr>
	<tr>
		<td>count(x|*)</td>
		<td>
		count(x)函数返回在同一组内，x字段中值不等于NULL的行数。count(*)函数返回在同一组内的数据行数。
		</td>
	</tr>
	<tr>
		<td>group_concat(x[,y])</td>
		<td>	
		该函数返回一个字符串，该字符串将会连接所有非NULL的x值。该函数的y参数将作为每个x值之间的分隔符，如果在调用时忽略该参数，在连接时将使用缺省分隔符","。再有就是各个字符串之间的连接顺序是不确定的。　
		</td>
	</tr>　
	<tr>
		<td>max(x)</td>
		<td>	
		该函数返回同一组内的x字段的最大值，如果该字段的所有值均为NULL，该函数也返回NULL。
		</td>
	</tr>
	<tr>
		<td>min(x)</td>
		<td>
		该函数返回同一组内的x字段的最小值，如果该字段的所有值均为NULL，该函数也返回NULL。
		</td>
	</tr>
	<tr>
		<td>sum(x)</td>
		<td>	
		该 函数返回同一组内的x字段值的总和，如果字段值均为NULL，该函数也返回NULL。如果所有的x字段值均为整型或者NULL，该函数返回整型值，否则就 返回浮点型数值。最后需要指出的是，如果所有的数据值均为整型，一旦结果超过上限时将会抛出"integer overflow"的异常。
		</td>
	</tr>
	<tr>
		<td>total(x)</td>
		<td>	
		该函数不属于标准SQL，其功能和sum基本相同，只是计算结果比sum更为合理。比如当所有字段值均为NULL时，和sum不同的是，该函数返回0.0。再有就是该函数始终返回浮点型数值。该函数始终都不会抛出异常。
		</td>
	</tr>
</table>

#### 日期和时间函数


    SQLite主要支持以下四种与日期和时间相关的函数，如：
    1). date(timestring, modifier, modifier, ...)
    2). time(timestring, modifier, modifier, ...)
    3). datetime(timestring, modifier, modifier, ...)
    4). strftime(format, timestring, modifier, modifier, ...)
    以上所有四个函数都接受一个时间字符串作为参数，其后再跟有0个或多个修改符。其中strftime()函数还接受一个格式字符串作为其第一个参数。strftime()和C运行时库中的同名函数完全相同。至于其他三个函数，date函数的缺省格式为："YYYY-MM-DD"，time函数的缺省格式为："HH:MM:SS"，datetime函数的缺省格式为："YYYY-MM-DD HH:MM:SS"。   
    
     
##### strftime函数的格式信息：

<table>
	<tr><th>格式</th><th>说明</th></tr>
	<tr><td>%d</td><td>	day of month: 00</td></tr>
	<tr><td>%f</td><td>	fractional seconds: SS.SSS</td></tr>
	<tr><td>%H</td><td>	hour: 00-24</td></tr>
	<tr><td>%j</td><td>	day of year: 001-366</td></tr>
	<tr><td>%J</td><td>	Julian day number</td></tr>
	<tr><td>%m</td><td>	month: 01-12</td></tr>
	<tr><td>%M</td><td>	minute: 00-59</td></tr>
	<tr><td>%s</td><td>	seconds since 1970-01-01</td></tr>
	<tr><td>%S</td><td>	seconds: 00-59</td></tr>
	<tr><td>%w</td><td>	day of week 0-6 with Sunday==0</td></tr>
	<tr><td>%W</td><td>	week of year: 00-53</td></tr>
	<tr><td>%Y</td><td>	year: 0000-9999</td></tr>
	<tr><td>%%</td><td>	%</td></tr>
</table>
    需要额外指出的是，其余三个时间函数均可用strftime来表示，如：
    date(...)         strftime('%Y-%m-%d', ...)
    time(...)         strftime('%H:%M:%S', ...)
    datetime(...)     strftime('%Y-%m-%d %H:%M:%S', ...) 
    
##### 时间字符串的格式：

    见如下列表：
    1). YYYY-MM-DD
    2). YYYY-MM-DD HH:MM
    3). YYYY-MM-DD HH:MM:SS
    4). YYYY-MM-DD HH:MM:SS.SSS
    5). HH:MM
    6). HH:MM:SS
    7). HH:MM:SS.SSS
    8). now
    
    5)到7)中只是包含了时间部分，SQLite将假设日期为2000-01-01。
    8)表示当前时间。
    
##### 修改符：

    见如下列表：
    1).  NNN days
    2).  NNN hours
    3).  NNN minutes
    4).  NNN.NNNN seconds
    5).  NNN months
    6).  NNN years
    7).  start of month
    8).  start of year
    9).  start of day
    10). weekday N     
    
    1)到6)将只是简单的加减指定数量的日期或时间值，如果NNN的值为负数，则减，否则加。  
    7)到9)则将时间串中的指定日期部分设置到当前月、年或日的开始。  
    10)则将日期前进到下一个星期N，其中星期日为0。注：修改符的顺序极为重要，SQLite将会按照从左到右的顺序依次执行修改符。


##### 示例：

    --返回当前日期。
    sqlite> SELECT date('now');  
    2012-01-15    
    --返回当前月的最后一天。
    sqlite> SELECT date('now','start of month','1 month','-1 day');
    2012-01-31
    --返回从1970-01-01 00:00:00到当前时间所流经的秒数。
    sqlite> SELECT strftime('%s','now');
    1326641166    
    --返回当前年中10月份的第一个星期二是日期。
    sqlite> SELECT date('now','start of year','+9 months','weekday 2');
    2012-10-02   