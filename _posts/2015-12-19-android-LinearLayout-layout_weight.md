---

layout: post
title: LinearLayout中的layout_weight属性
description: LinearLayout中的layout_weight属性
keywords: layout_weight android
category: android

---

`LinearLayout`中`layout_weight`可是个好东西，但是很多人却弄不懂原理，其实知道他的计算公式一切都简单多了

以下只说水平方向的  
计算公式  

```java
View的实际宽度 ＝ View的设置宽度 ＋ 剩余宽度＊权重比
```

是不是还不明白 举个例子你就明白了

假如LinearLayout中有两个TextView textView1和textView2  
`LinearLayout`的宽度是400
`textView1`的`content宽度`为100  
`textView2`的`content宽度`为150 

### 示例一
`textView1`的宽度是`match_parent`   
`textView2`的宽度是`match_parent`  
`textView1`的`layout_weight`是2    
`textView2`的`layout_weight`是3  

那么  
`textView1`的设置宽度就是400   
`textView2`的设置宽度也是400  
剩余宽度为`LinearLayout`的宽度-textView1的宽度-textView2的宽度 ＝ -400
`textView1`的权重比为2/5   
`textView2`的权重比为3/5
所以  
`textView1`的实际宽度为`400+(-400)*2/5=240`   
`textView2`的实际宽度为`400+(-400)*3/5=160 ` 
所以`textView2`的权重高但实际宽度却较小

### 示例2
`textView1`的宽度是`wrap_content`   
`textView2`的宽度是`wrap_content`  
`textView1`的`layout_weight`是1    
`textView2`的`layout_weight`是4  

那么  
`textView1`的设置宽度就是100   
`textView2`的设置宽度也是150  
剩余宽度为`LinearLayout`的宽度-textView1的宽度-textView2的宽度 ＝ 150
`textView1`的权重比为1/5   
`textView2`的权重比为4/5
所以  
`textView1`的实际宽度为`100+(150)*1/5=130`   
`textView2`的实际宽度为`150+(150)*4/5=270`  

### 按比例分
根据以上两个例子  
所以要想`textView1`分2/5  `textView2`分3/5
只需要把  
`textView1`设置`layout_weight`是2    
`textView2`设置`layout_weight`是3  
`textView1`的宽度设置为0   
`textView2`的宽度设置为0 就可以了
