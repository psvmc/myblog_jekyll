---

layout: post
title: Freemarker常用方法
description: Freemarker常用方法
keywords: freemarker
category: freemarker

---

## 截取字符串

```java
${record.date?substring(0,7)}
```

## 为null时取空字符串

如果属性可能为null

```java
${name!}
```

如果对象和属性都可能为null

```java
${(user.name)!}
```

不加小括号  如果对象为空就会报错

## if else

if

```
<#if condition> 

</#if> 
```

if-else

```
<#if condition> 

<#else> 

</#if> 
```

if-elseif-else

```
<#if condition> 

<#elseif condition2> 

<#elseif condition3> 

<#else> 

</#if> 
```

## 判断为空

```
<#if user??>
//user不为null
<#else>
//user为null
</#if>
```

```
<#if (user.name)??>
//userl和user.name都不为null
< #else>
//user为null或user.name为null
</#if>
```

## 比较字符串

```
<#if name=="1">

</#if>
```

## html转义

```
${((article.content)!)?html}
```