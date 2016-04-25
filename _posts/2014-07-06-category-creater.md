---

layout: post
title: Jekyll目录生成
description: Jekyll目录生成
keywords: 
    - jekyll
    - 目录生成
category: jekyll

---
 
## 使用步骤

### 在显示的地方添加下面的代码 

```html
<div id="category"></div>
```
	
### 添加JS

```js
<script type="text/javascript">
function categoryCreater(articleId){
	 var cateh1="#"+articleId+" h1,";
	 var cateh2="#"+articleId+" h2,";
	 var cateh3="#"+articleId+" h3,";
	 var cateh4="#"+articleId+" h4,";
	 var cateh5="#"+articleId+" h5,";
	 var cateh6="#"+articleId+" h6";
	 $(cateh1+cateh2+cateh3+cateh4+cateh5+cateh6).each(function(i,item){
		 if(i==0){
    		  $("#category").append('<li class="-ml" ><a  href="#-ml">目录</a></li>');  
    	 	 }
        var tag = $(item).get(0).localName;
        $(item).attr("id","-"+i);
        $("#category").append('<li class="-'+tag+'"><a  href="#-'+i+'">'+$(this).text()+'</a></li>');
      });
	    $("#category").css("margin-left",10).css("border-left","3px solid #0088cc").css("padding","10px 30px").css("background","#f6f6f6");
	    $("#category li").css("line-height",1.6);
        $(".-h0").css("margin-left",0);
        $(".-h1").css("margin-left",10);
        $(".-h2").css("margin-left",20);
        $(".-h3").css("margin-left",40);
        $(".-h4").css("margin-left",60);
        $(".-h5").css("margin-left",80);
        $(".-h6").css("margin-left",100);
        $(".-ml").css("margin-left",0).css("font-size","20px");
}
 $(document).ready(function(){
	 categoryCreater('main-article-contant');
 });
</script>
```	

> `注意:`  
> - `js依赖于jquery，一定在调用前添加jquery`  
> - `调用方法时,传入的参数为文档所在div的id`


