---

layout: post
title: android Activity生命周期
description: android Activity生命周期
keywords: android
category: android

---

### 调用图

![生命周期](https://raw.githubusercontent.com/psvmc/psvmc.github.io/master/images/android/activity/activity_life.png)


### 使用情境

#### B页面finish后 A页面刷新

这种情况可以重写`A页面`的`onResume()`的方法,因为从`A页面`到`B页面`后`A页面`的状态为`Paused`   
`B页面``finish`后`A页面`的状态就会变成`Running`，就会调用`onResume()`方法    
`B页面`finish前设置全局变量`CommonData.isRefresh = true`  
刷新页面后重置`CommonData.isRefresh = false
`

```
@Overridepublic void onResume() {    super.onResume();    if(CommonData.isRefresh){        onRefresh();        CommonData.isRefresh = false;    }}
```
