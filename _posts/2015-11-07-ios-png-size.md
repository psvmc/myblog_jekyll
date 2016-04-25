---

layout: post
title: iOS开发常用的图片大小
description: iOS开发常用的图片大小
keywords: swift
categories: swift ios

---

### 项目中Icon
<table>
	<tr><td>Spotlight-iOS 5,6</td><td>29 x2 x3</td></tr>
	<tr><td>Spotlight-iOS 7-9</td><td>40 x2 x3</td></tr>
	<tr><td>App-iOS 7-9</td><td>60 x2 x3</td></tr>
</table>

### 项目中LaunchImage
<table>
	<tr><td>Retina HD 5.5</td><td>1242 x 2208</td></tr>
	<tr><td>Retina HD 4.7</td><td>750 x 1334</td></tr>
	<tr><td>Landscape Retina HD 5.5</td><td>2208 x 1242</td></tr>
	<tr><td>iOS 7-9 2x</td><td>640 x 960</td></tr>
	<tr><td>iOS 7-9 Retina4</td><td>640 x 1136</td></tr>
</table>

### 提交AppStore－Icon
<table>
	<tr><td>1024 x 1024</td></tr>
</table>

### 提交AppStore－预览图
<table>
	<tr><td>5.5英寸</td><td>1242 x 2208</td></tr>
	<tr><td>4.7英寸</td><td>750 x 1334</td></tr>
	<tr><td>4英寸</td><td>640 x 1136</td></tr>
	<tr><td>3.5英寸</td><td>640 x 960</td></tr>
</table>


### 手机尺寸
<table>
    <tr>
        <th>手机类型</th>
        <th>iPhone 6 Plus</th>
        <th>iPhone 6</th>
        <th>iPhone 5s/iPhone 5s</th>
        <th>iPhone 5s/iPhone 5s</th>
    </tr>

	<tr>
	   <th>倍率</th>
	   <td>@3x</td>
	   <td>@2x</td>
	   <td>@2x</td>
	   <td>@2x</td>
	</tr>
	
	<tr>
	   <th>像素分辨率</th>
	   <td>1242 x 2208 (1125 x 2001) px</td>
	   <td>750 x 1334 px</td>
	   <td>640 x 1136 px</td>
	   <td>640 x 960 px</td>
	</tr>
	
	<tr>
	   <th>逻辑分辨率</th>
	   <td>414 x 736 pt</td>
	   <td>375 x 667 pt</td>
	   <td>320 x 568 pt</td>
	   <td>320 x 480 pt</td>
	</tr>
	
	<tr>
	   <th>屏幕密度</th>
	   <td>401 ppi</td>
	   <td>326 ppi</td>
	   <td>326 ppi</td>
	   <td>326 ppi</td>
	</tr>
	
	<tr>
	   <th>DPI</th>
	   <td>154</td>
	   <td>163</td>
	   <td>163</td>
	   <td>163</td>
	</tr>

</table>

### 常用元素的大小

<table>

	<tr>
	   <th>导航栏(NagationBar)高度</th>
	   <td>44 pt</td>
	</tr>
	
	<tr>
	   <th>状态栏(StatusBar)高度</th>
	   <td>20 pt</td>
	</tr>
	
	<tr>
	   <th>选项卡(TabBar)高度</th>
	   <td>48 pt</td>
	</tr>

</table>

### 疑点

为啥我的iPhone 6P 的截图为 1125 x 2001  

原因：

iPhone 6P 可以设置两种显示模式  

+ 放大模式(1125 x 2001 px)  
+ 默认模式(1242 x 2208 px)

这个模式可以从系统中的`显示与亮度`--> `显示模式`来切换

什么是**放大模式**  

`放大模式`  就是以`iPhone6`的尺寸为基准  用的`@3x`的资源

### 设计怎样切图

具体步骤可以参考 [淘宝的切图方式](http://www.zcool.com.cn/article/ZMTM3NzMy.html)

他的**基本思路**是以`iPhone5S(640 x 1136)`为基准进行标注
以`iPhone 6P(1242x2208)`来切`@3x`的资源

#### 个人建议

不过我建议以`iPhone6P放大模式(1125 x 2001 px)`为基准来标注和切图   
切出来的资源是`@3x`的 再缩小1.5倍就是`@2x`的   
这样做是因为现在**iPhone6**和**iPhone6P**的用户已经很多了，同时也为了降低切图的难度

#### 切图神器

推荐一个切图的神器
[PhotoshopCC新功能 生成图像资源](http://www.xueui.cn/tutorials/photoshop-tutorials/photoshopcc-qietu.html)



