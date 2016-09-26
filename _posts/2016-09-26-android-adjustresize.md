---

layout: post
title: 解决Android软键盘在全屏下设置adjustResize无效的问题
description: 解决Android软键盘在全屏下设置adjustResize无效的问题
keywords: android
category: android

---

## 输入法遮挡问题

在非全屏模式下，将`activity`的`windowSoftInputMode`的属性设置为：`adjustResize`。同时在`View`的`onSizeChanged(int w, int h, int oldw, int oldh)`里可以得到变化后的尺寸，然后根据前后变化的结果来计算屏幕需要移动的距离。

即添加：

```
android:windowSoftInputMode="adjustResize"
```

但是在全屏模式下，即使将`activity`的`windowSoftInputMode`的属性设置为：adjustResize。在键盘显示时它未将Activity的Screen向上推动，所以你`Activity`的`view`的根树的尺寸是没有变化的。在这种情况下，你也就无法得知键盘的尺寸，对根view的作相应的推移。  
全屏下的键盘无法Resize的问题从2.1就已经存在了，直到现在google还未给予解决。

如果你想了解android 软键盘普通情况下显示与隐藏的问题，你可以了解这篇博客android 软键盘的显示与隐藏问题的研究，它可以帮助你解决在非全屏下，软键盘的显示时，你不能很好地控制布局的问题。

感谢Ricardo提供的轮子，他在stackoverflow找到了解决方案。  
有人已经封装好了该类，你只需引用就OK了，我们来看下这个类。

```java
import android.app.Activity;
import android.graphics.Rect;
import android.view.View;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;
   
public class AndroidBug5497Workaround {
  
    // For more information, see https://code.google.com/p/android/issues/detail?id=5497
    // To use this class, simply invoke assistActivity() on an Activity that already has its content view set.
  
    public static void assistActivity (Activity activity) {
        new AndroidBug5497Workaround(activity);
    }
  
    private View mChildOfContent;
    private int usableHeightPrevious;
    private FrameLayout.LayoutParams frameLayoutParams;
  
    private AndroidBug5497Workaround(Activity activity) {
        FrameLayout content = (FrameLayout) activity.findViewById(android.R.id.content);
        mChildOfContent = content.getChildAt(0);
        mChildOfContent.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
            public void onGlobalLayout() {
                possiblyResizeChildOfContent();
            }
        });
        frameLayoutParams = (FrameLayout.LayoutParams) mChildOfContent.getLayoutParams();
    }
  
    private void possiblyResizeChildOfContent() {
        int usableHeightNow = computeUsableHeight();
        if (usableHeightNow != usableHeightPrevious) {
            int usableHeightSansKeyboard = mChildOfContent.getRootView().getHeight();
            int heightDifference = usableHeightSansKeyboard - usableHeightNow;
            if (heightDifference > (usableHeightSansKeyboard/4)) {
                // keyboard probably just became visible
                frameLayoutParams.height = usableHeightSansKeyboard - heightDifference;
            } else {
                // keyboard probably just became hidden
                frameLayoutParams.height = usableHeightSansKeyboard;
            }
            mChildOfContent.requestLayout();
            usableHeightPrevious = usableHeightNow;
        }
    }
  
    private int computeUsableHeight() {
        Rect r = new Rect();
        mChildOfContent.getWindowVisibleDisplayFrame(r);
        return (r.bottom - r.top);
    }
  
}
```


### 使用方法

在你的`Activity`的o`nCreate()`方法里调用

```java
AndroidBug5497Workaround.assistActivity(this);
```

即可。  
注意：在`setContentView(R.layout.xxx)`之后调用。