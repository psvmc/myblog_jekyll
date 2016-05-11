---

layout: post
title: Mac上用MyEclipse创建Maven Web项目
description: 之前一直在windows上用MyEclipse上进行基于Maven的Web开发，现在用Mac下的MyEclipse进行开发，发现到处都是坑，坑爹的MyEclipse
keywords: java
category: java

---

## 操作步骤

假如我们的项目叫做 `MyDemo`

### 1）创建项目

`右键`   
--> `New`   
--> `Project`   
--> 搜索`Maven Project`  
--> 设置存放位置   
--> 选择项目类型为 `maven-archetype-webapp`  
--> 设置项目信息 `Group ID` 写 公司域名 如 `cn.psvmc` 
    `Artifact Id` 写项目名 如`MyDemo`  
--> `Finish`

### 2) 配置

如果是第一次用maven 构建时间会有点长构建完成后  
项目名称会是这个样子`MyDemo Maven Webapp` 要想重命名就立刻重命名，以后再重命名的话**可能会失败**  
我们重命名为 `MyDemo`

在`MyDemo/src/main` 文件夹下 新建 `java文件夹`  

`项目上右键` --> `刷新` --> `项目上右键` --> `New` --> `SourceFolder`--> 选择刚建的`java文件夹` --> `Finish`

### 3) 坑

`项目右键` --> `Properties`

搜索`Java Build Path`点开  
在`Libraries选项卡`中修改用到的`jre`  
`Add Library` --> `JRE System Library` --> `Alternate JRE`选择相应的JRE  或者 `Installed JREs`来添加已安装的其它版本  
我这里用的1.6版本  

重新切到`Source选项卡`  
选择`MyDemo/src/main/java`展开 --> 选择 `Output folder` --> `Edit` --> 选择第二项 输入 `target/classes` --> `OK`  

这是其它的配置也就变了 所以只配置这一个就好了  

---

搜索`Java Compiler`点开 设置编译等级为 `1.6` 

---

搜索`Project Facets`点开  

设置 `Dynamic Web Module` 为 `2.5`  
设置 `Java` 为 `1.6` 

发现并不能设置 说的是`Dynamic Web Module 2.5` 必须是`Java1.5`以上 但明明就是啊  没办法只能直接修改配置的文件了

打开项目的`web.xml`，改之前：

```xml
<!DOCTYPE web-app PUBLIC  
 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"  
 "http://java.sun.com/dtd/web-app_2_3.dtd" >  
  
<web-app>  
  <display-name>Archetype Created Web Application</display-name>  
</web-app> 
```

改后

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<web-app version="2.5"  
    xmlns="http://java.sun.com/xml/ns/javaee"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee  
    http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">       
  <display-name>Archetype Created Web Application</display-name>  
</web-app>
```
---

找到项目的根目录  

里面有一个`.settings`的隐藏文件夹 打开  

---

打开`org.eclipse.jdt.core.prefs`

把`1.4`改成`1.6`

```
eclipse.preferences.version=1  
org.eclipse.jdt.core.compiler.codegen.inlineJsrBytecode=enabled  
org.eclipse.jdt.core.compiler.codegen.targetPlatform=1.6  
org.eclipse.jdt.core.compiler.compliance=1.6  
org.eclipse.jdt.core.compiler.problem.assertIdentifier=error  
org.eclipse.jdt.core.compiler.problem.enumIdentifier=error  
org.eclipse.jdt.core.compiler.problem.forbiddenReference=warning  
org.eclipse.jdt.core.compiler.source=1.6 
```

---

打开`org.eclipse.wst.common.component`

把`project-version="1.5.0"`改成`project-version="1.6.0"`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project-modules id="moduleCoreId" project-version="1.6.0">
    <wb-module deploy-name="MyDemo">
        <wb-resource deploy-path="/" source-path="/src/main/webapp"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/src/main/resources"/>
        <wb-resource deploy-path="/WEB-INF/classes" source-path="/src/main/java"/>
        <property name="context-root" value="/MyDemo"/>
        <property name="java-output-path" value="/MyDemo/src/main/webapp/WEB-INF/classes"/>
    </wb-module>
</project-modules>
```

---

打开`org.eclipse.wst.common.project.facet.core.xml`

把`<installed facet="java" version="1.4"/>`  
改成`<installed facet="java" version="1.6"/>`  

把`<installed facet="jst.web" version="2.3"/>`  
改成  `<installed facet="jst.web" version="2.5"/>`

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<faceted-project>  
  <fixed facet="wst.jsdt.web"/>  
  <installed facet="java" version="1.6"/>  
  <installed facet="jst.web" version="2.5"/>  
  <installed facet="wst.jsdt.web" version="1.0"/>  
</faceted-project>  
```

这样就大功告成了




