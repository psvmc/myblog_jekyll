---
layout: post
title: Java项目转Maven Web项目
description: Java项目转Maven Web项目
keywords: maven
categories: maven

---



## 处理步骤

+ 1、右键项目,选择`Project Facets`,点击`Convert to faceted from` 。

+ 2、更改`Dynamic Web Module`的`Version`为`2.5`(3.0为Java7的,Tomcat6不支持)。 

  如果提示错误,可能需要在`Java Compiler`设置`Compiler compliance level` 为`1.6` 。

  或者需要在此窗口的`Java`的`Version`改成`1.6`。

+ 3、点击下面的`Further configuration available…`，弹出`Modify Faceted Project`窗口 此处是设置`web`。

  xml文件的路径,输入`src/main/webapp`.

  `Generate web.xml deployment descriptor`自动生成`web.xml`文件,已有项目就不要勾选。点击OK。

+ 4、`项目右键`->`Configure` -> `Convert to Maven Project`。已经是`Maven`项目可以跳过这一步。

+ 5、设置部署程序集(`Web Deployment Assembly`)

+ 6、在右键项目打开此窗口、在左侧列表中会出现一个`Deployment Assembly`,点击进去后。

+ 7、删除`test`的两项,因为`test`是测试使用,并不需要部署。

+ 8、设置将Maven的jar包发布到lib下。 `Add` -> `Java Build Path Entries` -> `Maven Dependencies` -> `Finish` 

  完成后有以下 就可以了: 

  | Source              | Deploy Path      |
  | ------------------- | ---------------- |
  | /src/main/java      | /WEB-INF/classes |
  | /src/main/resources | /WEB-INF/classes |
  | /src/main/webapp    | /                |
  | Maven Dependencies  | /WEB-INF/lib     |

  