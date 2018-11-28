---
layout: post
title: Mac上Vue基本语法
description: Mac上Vue基本语法
keywords: vue
categories: vue

---



## 取值

### 文本

```html
<span>Message: {{ msg }}</span>
```



### 表达式

```bash
{{ number + 1 }}
{{ ok ? 'YES' : 'NO' }}
{{ message.split('').reverse().join('') }}
<div v-bind:id="'list-' + id"></div>
```



### html

双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，你需要使用 `v-html` 指令：

```html
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```



## 事件

```html
<button type="button" v-on:click="loginAction()">登录</button>
```



## 循环

### 遍历数字

```html
<li v-for="(item,index) in 10"">{{item}}</li>
```

> 编历一个数字时item的值是从1 始的。
> 编历一个指定数字也就是相当编历一个从1到指定数字的数组。
>
> 所以上面这个例子的item是1-10，index是0-9



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

