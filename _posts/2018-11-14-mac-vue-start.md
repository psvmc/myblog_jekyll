---
layout: post
title: Mac上Vue启程
description: Mac上Vue启程
keywords: mac vue
categories: mac vue

---



## 前言

vue.js有著名的全家桶系列，包含了vue-router，vuex， vue-resource，再加上构建工具vue-cli，就是一个完整的vue项目的核心构成。



安装的顺序如下 `Node.js` =>`webpack`=>`vue-cli`

具体的作用 

+ nodejs 就是为了安装其它的

+ webpack 作用如下图

  ![20181114154217556379466.png](http://image.psvmc.cn/20181114154217556379466.png)

+ vue-cli 这个构建工具大大降低了webpack的使用难度，支持热更新，有webpack-dev-server的支持，相当于启动了一个请求服务器，给你搭建了一个测试环境，只关注开发就OK



## Node.js

下载安装就行了[下载网址](https://nodejs.org/en/download/)

或者

用brew安装 先安装brew

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

替换及重置Homebrew默认源

```bash
//替换brew.git:
cd "$(brew --repo)"
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git

//替换homebrew-core.git:
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
```

安装Node.js

```bash
brew install nodejs
```

macOS 10.14 报错 **chown: /usr/local: Operation not permitted**解决方法  卸载重新安装

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
```

重新安装

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

查看node版本

```bash
node -v
```



安装后就可以用npm命令了

cnpm就是npm的国内淘宝镜像 所有npm的命令 直接换成cnpm就行了

```bash
sudo npm install -g cnpm --registry=https://registry.npm.taobao.org
```



也可以直接指定node.js的镜像地址  就不用使用cnpm也能使用淘宝镜像

```bash
//设置镜像地址
npm config set registry https://registry.npm.taobao.org
//验证是否设置成功
npm config get registry
```



查看已安装的包

```bash
npm list --depth 0
```

+ `--depth 0` 是只显示第一层级的包 如果是1的话就会显示两个层级



## Webpack

webpack 4.X 开始，需要安装 webpack-cli 依赖

```bash
sudo cnpm install -g webpack webpack-cli
```

查看安装状态

```bash
webpack -v
```



## Vue-cli

安装

```bash
sudo cnpm install --global vue-cli
```

验证是否成功 查看版本

```bash
vue -V
```



## 初始化项目

进入要新建项目的目录

输入以下命令

```bash
vue init webpack demo001
```

输入命令后，会跳出几个选项让你回答：

- Project name (baoge)： 

  -----项目名称，直接回车，按照括号中默认名字（注意这里的名字不能有大写字母）

- Project description (A Vue.js project)： 

  ----项目描述，也可直接点击回车，使用默认名字

- Author ()：

   ----作者，输入你的大名

- Runtime + Compiler: recommended for most users 

  运行加编译，既然已经说了推荐，就选它了
  Runtime-only: about 6KB lighter min+gzip, but templates (or any Vue-specificHTML) are ONLY allowed in .vue files - render functions are required elsewhere 

  仅运行时，已经有推荐了就选择第一个了

- Install vue-router? (Y/n) 

  是否安装vue-router，这是官方的路由，大多数情况下都使用，这里就输入“y”后回车即可。

- Use ESLint to lint your code? (Y/n) 

  是否使用ESLint管理代码，ESLint是个代码风格管理工具，是用来统一代码风格的，一般项目中都会使用。
  接下来也是选择题Pick an ESLint preset (Use arrow keys) 选择一个ESLint预设，编写vue项目时的代码风格，直接n回车

- Setup unit tests with Karma + Mocha? (Y/n) 

  是否安装单元测试，我选择安装n回车

- Setup e2e tests with Nightwatch(Y/n)? 

  是否安装e2e测试 ，我选择安装n回车

进入项目目录

```bash
cd demo001
```

运行

```bash
npm run dev
```

运行后自动打开浏览器

config=>index.js

```bash
autoOpenBrowser: true,
```

打包生成项目

```bash
npm run build
```



## 常用包

### axios

[`axios文档`](https://www.kancloud.cn/yunye/axios/234845)

```bash
cnpm install axios
```



### babel

> `vue-cli`创建的项目本身已经配置了`babel`，无需额外配置 不同再看下面的



可以将ES6代码转化为ES5代码，从而在现有环境执行，这意味着，你可以现在就用ES6编写程序，而不用担心现有环境是否支持

**为什么不安装在全局**

如果安装在全局，那意味着项目要运行，全局环境必须有bable，也就是说项目产生了对环境的依赖。另一方面，这样做也无法支持不同项目使用不同版本的babel。

安装步骤

进入项目根目录

安装

```bash
cnpm install babel-cli --save-dev
```

设置转码规则

```bash
cnpm install babel-preset-es2015 --save-dev
```

创建配置文件 基本格式是这样的

```bash
{
    "presets":[],
    "plugins":[]
}
```

添加es2015如下

```bash
{
    "presets":["es2015"]
}
```



### es6-promise/babel-polyfill

Babel 默认只转换新的 JavaScript 句法，而不转换新的 API，

比如 `Iterator`、`Generator`、`Set`、`Map`、`Proxy`、`Reflect`、`Symbol`、`Promise` 等全局对象，以及一些定义在全局对象上的方法（比如 `Object.assign`）都不会转码。

Babel 默认不转码的 API 非常多，详细清单可以查看 [definitions.js](https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-runtime/src/definitions.js) 文件。

axios 是基于 Promise 来实现的，IE 和低版本的设备不支持 `Promise`。



#### 方案一 使用 es6-promise

```bash
npm install es6-promise -S

// 在 main.js 首行引入即可
require("es6-promise").polyfill()
```

这样，就已经可以解决你的问题了。

因为我的项目中是有对 `axios` 进行封装的，而且我也不喜欢在 `main.js` 中来做这个操作，所以我将这个操作移到了 `api.js` 这个文件的开头。（`api.js` 的用途是用来对 axios 进行封装），所以我的是下面这样。

```bash
// api.js
require("es6-promise").polyfill()
import axios from 'axios'
```

当然，你也可以使用 import 的方式：

```bash
// request.js
import 'es6-promise/auto'
import axios from 'axios'
```

ok，现在问题解决了【IE和低版本的安卓设备都没问题了】



#### 方案二 使用 babel-polyfill

[**babel-polyfill文档**](https://babeljs.io/docs/en/babel-polyfill/)

```bash
npm install babel-polyfill -S

// 在 main.js 首行引入即可
import "babel-polyfill"
```

因为我的项目中是有对 `axios` 进行封装的，而且我也不喜欢在 `main.js` 中来做这个操作，所以我将这个操作移到了 `api.js` 这个文件的开头。（`api.js` 的用途是用来对 `axios` 进行封装），所以我的是下面这样:

```bash
// api.js
import 'babel-polyfill'
import axios from 'axios'
```

--------

或者 `build`=>`webpack.base.config.js`中修改`entry`属性

```bash
module.exports = {
  entry: ["babel-polyfill", "./src/main.js"],
};
```



### Vuex

[`Vuex文档`](https://vuex.vuejs.org/zh/installation.html)

安装

```bash
npm install vuex --save
```

使用

```bash
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

Vuex 依赖 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)。如果你支持的浏览器并没有实现 Promise (比如 IE)，那么你可以使用一个 polyfill 的库，例如 [es6-promise](https://github.com/stefanpenner/es6-promise)。

```bash
npm install vuex --save
npm install es6-promise --save
```

使用

```bash
import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```



## SEO方案

常用的解决方案有三种：

1. 页面预渲染
2. 服务端渲染
3. 路由采用h5 history模式

而应用到的技术也是有很多，大体上我总结了四个，也是比较常用的：

+ ssr,vue官方文档给出的服务器渲染方案，这是一套完整的构建vue服务端渲染应用的指南，具体[参考网站](https://cn.vuejs.org/v2/guide/ssr.html)

+ vue-meta-info，这个是针对单页面的meta SEO的另一种思路，[参考网站](https://zhuanlan.zhihu.com/p/29148760)

+ nuxt 简单易用，[参考网站](https://zh.nuxtjs.org/guide/installation)

+ phantomjs 页面预渲染，具体[参考网站]([http://phantomjs.org](http://phantomjs.org)) 



而市场上依靠vue做出来的唱功案例还是很多的：

+  [bilibili](https://www.bilibili.com)
+ [手机搜狐网](http://m.sohu.com) 
+ [掘金](https://juejin.im/timeline)
+ [element](http://element.eleme.io/#/en-US) 
+ [奇趣百科](http://qiqu.uc.cn)
+ [异乡好居](https://m.uhouzz.com/apartments)



那么他们是如何做优化的呢？我们通过分析，总结以下几点

+ 1) bilibili做了基本的seo优化，比如

  TDK描叙详细。

  提升网页加载速度：对外联css,以及js使用了延迟加载以及dns-prefetch，preload。

  外联较多，关键词排名高。

+ 2) 掘金网站使用了[vue-meta-info](https://github.com/muwoo/vue-meta-info) 管理网站的meta，应该配合使用了[prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) 对SEO进行了优化

+ 3) Element在logo上加了首页的地址，并且只有logo是放在h1标签中。

+ 4) 有一些流量不太高的网站 比如
  [Marshall University](http://www.marshall.edu) 做了seo社会化分享优化，在meta信息中出现了`property="og:title"`这种新东西；

  [大疆招聘](https://we.dji.com/zh-CN/campus) 使用了[**Nuxt**](https://zh.nuxtjs.org/guide/installation)


