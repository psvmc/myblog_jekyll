---
layout: post
title: 国内常用静态资源 CDN 公共库加速服务
description: 国内常用静态资源 CDN 公共库加速服务
keywords: js 静态
categories: js

---

## 常用静态资源库



+ [`七牛云存储开放静态文件`](http://staticfile.org/) 速度较快
+ [`百度静态资源公共库`](http://cdn.code.baidu.com/) 搜索方便
+ [`360前端静态资源库`](https://cdn.baomitu.com) 支持Google字体的静态库 推荐
+ [`腾讯静态公共库`](http://libs.qq.com)
+ [`BootCDN`](http://www.bootcdn.cn)
+ [`新浪云计算公共库`](http://lib.sinaapp.com/) 不推荐
+ [`又拍云JS库`](http://jscdn.upai.com/) 库少 不推荐



当然，用别人的 CDN 都是不保险的，所以建议在 CDN 读取失败的时候从自己服务器提供

```html
<script src="//cdn.staticfile.org/jquery/1.8.3/jquery.min.js"></script>
<script>
   if (!window.jQuery) {
    var script = document.createElement('script');
    script.src = "/js/jquery.min.js";
    document.body.appendChild(script);
}
</script>
```



