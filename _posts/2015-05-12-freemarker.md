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

