---
layout: post
title: Vue基本语法
description: Vue基本语法
keywords: vue
categories: vue

---



## 刷新时不显示模版

当vue需要加载数据多或者网络慢时，加载数据时候会先出现vue模板（例如item.name），用户体验特别不好 

解决方法有如下几种： 

1、可以通过VUE内置的指令**v-cloak**解决这个问题（推荐） 具体实现：

CSS中添加样式

```css
[v-cloak]{ display: none; }
```

页面要渲染的额部分添加**v-cloak**


	<ul v-cloak v-for="item in items">
		<li>{{ item.name \}\}</li>
	</ul>




2、可以在需要编译的元素前后加上

```html
<template></template>
```

 关于`<template>`  [`详解`](http://www.zhangxinxu.com/wordpress/2014/07/hello-html5-template-tag/) 



## 取值

### 文本

	<span>Message: {{ msg }}</span>

### 表达式

	{{ number + 1 }}
	{{ ok ? 'YES' : 'NO' }}
	{{ message.split('').reverse().join('') }}



### html

双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，你需要使用 `v-html` 指令：

```html
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```


## 计算属性



```js
data: {
    num1: 10,
    num2:2
},
computed: {
    sum: function () {
        return this.num1+this.num2;
    }
}
```

如上 计算属性`sum`的值就会为3

**computed**特点：

1. **computed**计算的性能更高,它会把计算的值缓存起来，如果**data**中的属性不变,**computed**就不会再次计算，而**methods**中每次都要重新计算
2. **watch**主要用于监控vue实例的变化，它监控的变量当然必须在**data**里面声明才可以，它可以监控一个变量，也可以是一个对象



## 取值处理

JS中：

```js
var user_vue = new Vue({
    el: ".user",
    data: {
        loginuser: {username:"我的名称比较长"}
    },
    filters: {
        nameFilter(name) {
            if (name.length > 4) {
                name = name.substring(0, 4);
            }
            return name;
        }
    }
});
```

取值方式：

	{{loginuser.username|nameFilter}}



## 样式


```bash
v-bind:class="{ unclickable: page == 1 }"
```



## 事件

```html
<button type="button" v-on:click="loginAction()">登录</button>
```



## 循环

### 遍历数字


	<li v-for="(item,index) in 10">{{item}}</li>


> 编历一个数字时item的值是从1 始的。
> 编历一个指定数字也就是相当编历一个从1到指定数字的数组。
>
> 所以上面这个例子的item是1-10，index是0-9



### 遍历对象数组

数据

```js
data:{
    items:[
        {text:"第一组"}，
        {text:"第二组"}，
        {text:"第三组"}，
    ]
}
```

页面


	<li v-for="item in items">{{item.text}}</li>
	
	<li v-for="(item, index) in items">
		{{ index }} - {{ item.text }}
	</li>



## 组件化

示例

```javascript
Vue.component('zj-page', {
    props: ["showpage", "currpage", "pages"],
    computed: {
        showPageArr: function () {
            var halfshow = parseInt(this.showpage / 2);
            var tempbegin = this.currpage - halfshow + 1;
            var tempend = this.currpage + halfshow;
            if (tempbegin < 1) {
                tempend = tempend - tempbegin + 1;
                tempbegin = 1;
                if (tempend > this.pages) {
                    tempend = this.pages;
                }
            } else if (tempend > this.pages) {
                tempbegin = this.pages - this.showpage + 1;
                tempend = this.pages;
                if (tempbegin < 1) {
                    tempbegin = 1;
                }
            }

            var arr = [];
            for (var i = tempbegin; i <= tempend; i++) {
                arr.push(i);
            }
            return arr;
        }
    },

    methods: {
        num_click: function (num) {
            this.currpage = num;
        },
        last_click: function () {
            if (this.currpage > 1) {
                this.currpage -= 1;
            }
        },
        next_click: function () {
            if (this.currpage < this.pages) {
                this.currpage += 1;
            }
        },
        begin_click: function () {
            this.currpage = 1;
        },
        end_click: function () {
            this.currpage = this.pages;
        }
    },
    watch: {
        currpage(newValue, oldValue) {
            this.$emit('gotopage', newValue, oldValue);
        }
    },
    template: `
    <div class="paging">
        <span class="first_page" v-bind:class="{ unclickable: currpage == 1 }" v-on:click="begin_click()">首页</span>
        <span class="prev_page" v-bind:class="{ unclickable: currpage == 1 }" v-on:click="last_click()">上一页</span>
        <span v-bind:class="{ pitch_on: item == currpage }" class="pagination" v-for="(item,index) in showPageArr" v-on:click="num_click(item)">{{ item }} </span>
        <span class="next_page" v-bind:class="{ unclickable: currpage == pages }" v-on:click="next_click()">下一页</span>
        <span class="last_page" v-bind:class="{ unclickable: currpage == pages }" v-on:click="end_click()">末页</span>
    </div>
`
});
```

使用方法

```html
<zj-page v-bind:showpage="showpage" v-bind:currpage="currpage" v-bind:pages="pages" v-on:gotopage="gotopage"></zj-page>
```

JS代码

```js
new Vue({
    el: ".prepare_main",
    data: {
        showpage: 10,
        currpage: 1,
        pages: 20
    },
    methods: {
        gotopage: function (newpage, oldpage) {
            console.info("跳转到：" + newpage + " 原页：" + oldpage);
        }
    }
});
```



### 属性传递

子组件中定义

```bash
props: ["showpage", "currpage", "pages"]
```

父组件中传递

```bash
v-bind:showpage="showpage"
```



### 方法传递

子组件中调用

```bash
this.$emit('gotopage', newValue, oldValue);
```

父组件中传递

```bash
v-on:gotopage="gotopage"
```



## 生命周期

![20181129154348621112493.png](http://image.psvmc.cn/20181129154348621112493.png)

beforeCreate

> 在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。

created

> 实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。

beforeMount

> 在挂载开始之前被调用：相关的 render 函数首次被调用。

mounted

> el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。
>
> Ajax请求数据在此阶段

beforeUpdate

> 数据更新时调用，发生在虚拟 DOM 重新渲染和打补丁之前。 你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程。

updated

> 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
>
> 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。
>
> 该钩子在服务器端渲染期间不被调用。

beforeDestroy

> 实例销毁之前调用。在这一步，实例仍然完全可用。

destroyed

> Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。 该钩子在服务器端渲染期间不被调用。