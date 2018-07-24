---

layout: post
title: 解决Android软键盘在全屏下设置adjustResize无效的问题
description: 解决Android软键盘在全屏下设置adjustResize无效的问题
keywords: android
category: android

---



## 输入法遮挡问题

解决输入法遮挡的问题 基本上有两种

+ `adjustResize` + `ScrollView`
+ `adjustPan`



`adjustPan`会把页面整体上推

`adjustResize`则是缩放可调整页面 所以要和`ScrollView`配合 但是如果界面设成全屏模式就不会生效



## 解决方式

在`非全屏模式(即状态栏不透明)`下，将`activity`的`windowSoftInputMode`的属性设置为：`adjustResize`。同时在`View`的`onSizeChanged(int w, int h, int oldw, int oldh)`里可以得到变化后的尺寸，然后根据前后变化的结果来计算屏幕需要移动的距离。

即添加：

```xml
android:windowSoftInputMode="adjustResize"
```

但是在`全屏模式`下，即使将`activity`的`windowSoftInputMode`的属性设置为：`adjustResize`。

在键盘显示时它未将Activity的Screen向上推动，所以你`Activity`的`view`的根树的尺寸是没有变化的。

在这种情况下，你也就无法得知键盘的尺寸，对根view的作相应的推移。  
全屏下的键盘无法Resize的问题从2.1就已经存在了，直到现在google还未给予解决。

有人已经封装好了该类，你只需引用就OK了，我们来看下这个类。

```java
public class SoftHideKeyBoardUtil {
    public static void assistActivity (Activity activity) {
        new SoftHideKeyBoardUtil(activity);
    }
    private View mChildOfContent;
    private int usableHeightPrevious;
    private FrameLayout.LayoutParams frameLayoutParams;
    //为适应华为小米等手机键盘上方出现黑条或不适配
    private int contentHeight;//获取setContentView本来view的高度
    private boolean isfirst = true;//只用获取一次
    private  int statusBarHeight;//状态栏高度
    private SoftHideKeyBoardUtil(Activity activity) {
   //1､找到Activity的最外层布局控件，它其实是一个DecorView,它所用的控件就是FrameLayout
        FrameLayout content = (FrameLayout) activity.findViewById(android.R.id.content);
        //2､获取到setContentView放进去的View
        mChildOfContent = content.getChildAt(0);
        //3､给Activity的xml布局设置View树监听，当布局有变化，如键盘弹出或收起时，都会回调此监听  
          mChildOfContent.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
        //4､软键盘弹起会使GlobalLayout发生变化
            public void onGlobalLayout() {
            if (isfirst) {
                    contentHeight = mChildOfContent.getHeight();//兼容华为等机型
                    isfirst = false;
                }
                //5､当前布局发生变化时，对Activity的xml布局进行重绘
                possiblyResizeChildOfContent();
            }
        });
        //6､获取到Activity的xml布局的放置参数
        frameLayoutParams = (FrameLayout.LayoutParams) mChildOfContent.getLayoutParams();
    }

    // 获取界面可用高度，如果软键盘弹起后，Activity的xml布局可用高度需要减去键盘高度  
    private void possiblyResizeChildOfContent() {
        //1､获取当前界面可用高度，键盘弹起后，当前界面可用布局会减少键盘的高度
        int usableHeightNow = computeUsableHeight();
        //2､如果当前可用高度和原始值不一样
        if (usableHeightNow != usableHeightPrevious) {
            //3､获取Activity中xml中布局在当前界面显示的高度
            int usableHeightSansKeyboard = mChildOfContent.getRootView().getHeight();
            //4､Activity中xml布局的高度-当前可用高度
            int heightDifference = usableHeightSansKeyboard - usableHeightNow;
            //5､高度差大于屏幕1/4时，说明键盘弹出
            if (heightDifference > (usableHeightSansKeyboard/4)) {
                // 6､键盘弹出了，Activity的xml布局高度应当减去键盘高度
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT){
                    frameLayoutParams.height = usableHeightSansKeyboard - heightDifference + statusBarHeight;
                } else {
                    frameLayoutParams.height = usableHeightSansKeyboard - heightDifference;
                }
            } else {
                frameLayoutParams.height = contentHeight;
            }
            //7､ 重绘Activity的xml布局
            mChildOfContent.requestLayout();
            usableHeightPrevious = usableHeightNow;
        }
    }
    private int computeUsableHeight() {
        Rect r = new Rect();
        mChildOfContent.getWindowVisibleDisplayFrame(r);
        // 全屏模式下：直接返回r.bottom，r.top其实是状态栏的高度
        return (r.bottom - r.top);
    }
}
```


### 使用方法

在你的`Activity`的`onCreate()`方法里调用即可

```java
SoftHideKeyBoardUtil.assistActivity(this);
```

  

> 注意：在`setContentView(R.layout.xxx)`之后调用