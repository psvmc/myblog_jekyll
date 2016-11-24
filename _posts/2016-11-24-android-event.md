---

layout: post
title: Android点击视图外部,隐藏键盘 及 事件传递机制
description: Android点击视图外部,隐藏键盘 及 事件传递机制(dispatchTouchEvent、onInterceptTouchEvent、onTouchEvent)
keywords: android
categories: android

---


## 前言

在做IM的时候当用户点击输入框外的区域应该隐藏 输入法键盘 或者 其他操作区域  

先放上一段代码 放在`Activity`中 所有的`EditText`外点击都会隐藏键盘

```java
@Override
public boolean dispatchTouchEvent(MotionEvent event) {
   if (event.getAction() == MotionEvent.ACTION_DOWN) {
       View v = getCurrentFocus();
       if ( v instanceof EditText) {
           Rect outRect = new Rect();
           v.getGlobalVisibleRect(outRect);
           if (!outRect.contains((int)event.getRawX(), (int)event.getRawY())) {
               v.clearFocus();
               InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
               imm.hideSoftInputFromWindow(v.getWindowToken(), 0);
           }
       }
   }
   return super.dispatchTouchEvent( event );
}
```

有时候 我们在`Activity`中添加`onTouchEvent`方法  然后点击视图 但是就是不触发事件 这是为什么呢 这就要说一下Android的事件机制了

## 事件机制

Android和事件有关的方法有三个  

+ `dispatchTouchEvent` 接受上级消息
+ `onInterceptTouchEvent` 决策向下级分发还是自身处理
+ `onTouchEvent` 自身处理逻辑

Android的分发逻辑和处理逻辑是相反的  

`dispatchTouchEvent` --> 

+ `分发`是从`父View`到`子View`  
+ `处理`是从`子View`到`父View`

同一个View中三个方法的执行顺序   

`dispatchTouchEvent` --> `onInterceptTouchEvent` --> `onTouchEvent`


+ 1) `dispatchTouchEvent`（默认返回值是`true`）

如果返回值：`false`  
不接受动作序列中的后续事件 

+ 2) `onInterceptTouchEvent`（默认返回值是`false`）

如果返回值：`true`  
就不再向`子View`分发 当前View处理 

+ 3) `onTouchEvent`（默认返回值是`false`）

如果返回值：`true`  
就不再触发`父View` 的`onTouchEvent`

### 示例

假如`AView`中包含`BView` BView中包含`CView`

如果点击`CView`   
如果`BView` 的 `onInterceptTouchEvent` 返回`true`  
那么就`CView`的`onTouchEvent`就不会触发    
会触发`BView`的`onTouchEvent`    
如果`BView`的`onTouchEvent`返回`false`    
那么`AView`的`onTouchEvent`也会触发    
如果`BView`的`onTouchEvent`返回`true`    
那么`AView`的`onTouchEvent`就不会触发  
