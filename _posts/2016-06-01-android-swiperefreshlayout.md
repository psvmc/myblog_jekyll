---

layout: post
title: Android 自带的下拉刷新SwipeRefreshLayout
description: Android v4包中的SwipeRefreshLayout效果还是不错的 推荐大家使用
keywords: android
category: android

---

## 概要

试了很多第三方的下拉刷新不是效果不好看 就是有bug，最后还是决定用官方的下拉刷新，但是官方的默认不支持进入页面立即刷新，所以我们可以用官方的并对其扩展

## 官方原版的用法

XML

```xml
<android.support.v4.widget.SwipeRefreshLayout
    android:id="@+id/id_swipe_ly"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <ListView
        android:id="@+id/file_list"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:divider="@color/zj_qianhuise"
        android:dividerHeight="1px">
    </ListView>
</android.support.v4.widget.SwipeRefreshLayout>
```

代码中

```java
//定义变量
private SwipeRefreshLayout mSwipeLayout;
```

实现`SwipeRefreshLayout.OnRefreshListener`接口  
添加回调方法

```java
@Override
public void onRefresh() {
    loadData();
}
```

初始化

```java
//下拉刷新
mSwipeLayout = (SwipeRefreshLayout) parentView.findViewById(R.id.id_swipe_ly);
mSwipeLayout.setOnRefreshListener(this);
//设置加载动画背景颜色
mSwipeLayout.setProgressBackgroundColorSchemeColor(getResources().getColor(android.R.color.background_light));
//设置进度动画的颜色
mSwipeLayout.setColorSchemeResources(android.R.color.holo_blue_bright, android.R.color.holo_green_light, android.R.color.holo_orange_light, android.R.color.holo_red_light);
```

如上`loadData()`来加载数据，加载结束后记得调用下面的方法停止刷新动画

```java
mSwipeLayout.setRefreshing(false);
```

###  进入页面立即刷新

但是我们想做到一进页面就立刻刷新，并有刷新动画怎么办

首先添加一个类

```java
public class AutoSwipeRefreshLayout extends SwipeRefreshLayout {

    public AutoSwipeRefreshLayout(Context context) {
        super(context);
    }

    public AutoSwipeRefreshLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    /**
     * 自动刷新
     */
    public void autoRefresh() {
        try {
            Field mCircleView = SwipeRefreshLayout.class.getDeclaredField("mCircleView");
            mCircleView.setAccessible(true);
            View progress = (View) mCircleView.get(this);
            progress.setVisibility(VISIBLE);

            Method setRefreshing = SwipeRefreshLayout.class.getDeclaredMethod("setRefreshing", boolean.class, boolean.class);
            setRefreshing.setAccessible(true);
            setRefreshing.invoke(this, true, true);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

然后XML改为

```xml
<cn.psvmc.swiperefreshlayout.AutoSwipeRefreshLayout
    android:id="@+id/id_swipe_ly"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <ListView
        android:id="@+id/file_list"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:divider="@color/zj_qianhuise"
        android:dividerHeight="1px">
    </ListView>
</cn.psvmc.swiperefreshlayout.AutoSwipeRefreshLayout>
```

对应的java代码中的`SwipeRefreshLayout` 都换成 `AutoSwipeRefreshLayout`

页面加载后调用`mSwipeLayout.autoRefresh()`就可以了

但是立即执行`mSwipeLayout.autoRefresh()`在效果上不是很流畅  所以我用了消息机制 延迟发送消息 就好了

```java
//定义消息常量
interface ZJHandlerStatus {
    int endrefresh = 0;
    int endDialog = 1;
    int reloadData = 1;
    int autoRefresh = 2;
}

//消息处理
Handler myHandler = new Handler() {
    public void handleMessage(Message msg) {
        switch (msg.what) {
            case ZJHandlerStatus.endrefresh:
                mSwipeLayout.setRefreshing(false);
                break;
            case ZJHandlerStatus.reloadData:
                fileAdapter.notifyDataSetChanged();
                break;
            case ZJHandlerStatus.autoRefresh:
                mSwipeLayout.autoRefresh();
                break;
        }
        super.handleMessage(msg);
    }
};

//发送消息
Message message = new Message();
message.what = ZJHandlerStatus.autoRefresh;
myHandler.sendMessageAtTime(message, SystemClock.uptimeMillis() + 600);
```
