---

layout: post
title: jekyll中URL的设置
description: jekyll中URL的设置
keywords: 
    - jekyll
    - URL
category: jekyll

---

## 配置文件为`_config.yml`
在配置文件中添加配置类似于  
`permalink: /:categories/:year-:month-:day-:title.html` 
 
可用的参数值  

- year	`文章的年份:如2014`
- short_year	`文章的年份,不包含世纪,如:14`
- month	`文章的月份`
- i_month	`文章的月份,去掉前置的0`
- day	`文章的日期`
- i_day	`文章的日期,去掉前置的0`
- categories	`文章的分类,如果文章没分类,生成url时会将其忽略`

## 内置搭配
<table>
<tr>
<td>date</td><td>/:categories/:year/:month/:day/:title.html</td>
</tr>
<tr>
<td>pretty</td><td>/:categories/:year/:month/:day/:title/</td>
</tr>
<tr>
<td>none</td><td>/:categories/:title.html</td>
</tr>
</table>
### 使用方式  
> `permalink: date`  
> `permalink: pretty`  
> `permalink: none`

## 自定义搭配

- /:categories/:year/:month/:day/:title.html `默认的搭配` 
- /:categories/:title.html `最精简的配置`
- /:categories/:year-:month-:day-:title.html `我的配置`
- /:year-:month-:day/:title `也可以不跟html`
 