---
layout: post
title: Jsoup抓去网页数据
description: Jsoup抓去网页数据
keywords: java jsoup
categories: java jsoup

---



## 获取Session

```java
Connection.Response res = Jsoup.connect("http://www.example.com/login.php")
.data("username", "myUsername", "password", "myPassword")
.method(Method.POST)
.execute();

Document doc = res.parse();
//这儿的SESSIONID需要根据要登录的目标网站设置的session Cookie名字而定
String sessionId = res.cookie("SESSIONID");
Document objectDoc = Jsoup.connect("http://www.example.com/otherPage")
.cookie("SESSIONID", sessionId)
.get();
```



## 爬取数据

```java
String baseUrl = urlStr.substring(0, urlStr.indexOf("JobInfo.aspx"));
URL url = null;
try {
    url = new URL(urlStr);
} catch (MalformedURLException e) {
    return null;
}
Document doc = null;
try {
    doc = Jsoup.parse(url, 5000);
} catch (IOException e) {
    return null;
}
Element jobDemand = doc.getElementById("jobDemand");
Element cmpyAddress1 = doc.getElementById("cmpyAddress1");

try {
    //获取某ID的元素
    doc.getElementById("comemial").text().replace("邮箱：", "");
    //获取Tag内的文字
    cmpyAddress1.getElementsByTag("a").get(0).text();
    //获取Tag的属性
    cmpyAddress1.getElementsByTag("a").get(0).attr("href");
    //获取包含某文字的元素
    cmpyAddress1.getElementsContainingOwnText("企业性质").get(0).getElementsByTag("span").get(1).text();
    //获取某样式的元素
    doc.getElementsByClass("tjobName").get(0).text();
    //返回元素节点之后的兄弟元素节点
    doc.getElementsContainingOwnText("职位描述")
        .get(0)
        .nextElementSibling()
        .getElementsByTag("p")
        .get(0)
        .html();
} catch (Exception e) {
    return null;
}
```

