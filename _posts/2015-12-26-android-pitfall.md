---

layout: post
title: android开发的那些坑
description: android开发的那些坑
keywords: android
category: android

---

### ListView获取子视图
`ListView`有一个`getChildAt()`方法，参数传的不是子视图的`position`，而是当前显示区域的位置，所以正确的获取`position`位置视图的方法为

```java
int firstVisiblePosition = mListView.getFirstVisiblePosition();
mListView.getChildAt(position - firstVisiblePosition));
```


