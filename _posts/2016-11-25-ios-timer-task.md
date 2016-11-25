---

layout: post
title: iOS 定时任务
description: iOS 定时任务
keywords: ios
categories: ios

---


## 前言

相对于`Android`来说 iOS定时任务用起来还是比较好用的  

具体来说有三种

+ `GCD`方式
+ `NSTimer`
+ `CADisplayLink`

一般都用前两种   
做视图绘制 动画  视频等才用第三种

## 使用方式

### GCD方式

延时执行一次

```objc
double delayInSeconds = 2.0;
dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, delayInSeconds * NSEC_PER_SEC); 
dispatch_after(popTime, dispatch_get_main_queue(), ^(void){ 
    //执行事件
});
```

重复执行

```objc
NSTimeInterval period = 1.0; //设置时间间隔

dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
dispatch_source_t _timer = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, queue);
dispatch_source_set_timer(_timer, dispatch_walltime(NULL, 0), period * NSEC_PER_SEC, 0); //每秒执行

dispatch_source_set_event_handler(_timer, ^{
    //在这里执行事件
});

dispatch_resume(_timer);
```

停止方式

```objc
dispatch_cancel(_timer);
_timer = nil;
```

### NSTimer方式

创建方式

```objc
NSTimer *timer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(action:) userInfo:nil repeats: YES];
```

或者

```objc
NSTimer *timer = [NSTimer timerWithTimeInterval:5 target:self selector:@selector(timerAction) userInfo:nil repeats:YES];
[[NSRunLoop mainRunLoop] addTimer:timer forMode:NSDefaultRunLoopMode];
```

两种方式是等效的 第一种会自动加入到`MainRunloop`的`NSDefaultRunLoopMode`中

停止方式(非循环的可以不掉用)

```objc
[timer invalidate];
```

### CADisplayLink

创建方式

```objc    
self.displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(handleDisplayLink:)];    
[self.displayLink addToRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
```

停止方式

```objc    
[self.displayLink invalidate];  
self.displayLink = nil;
```       

重要属性

+ frameInterval   
`NSInteger`类型的值，用来设置间隔多少帧调用一次`selector`方法，默认值是1，即每帧都调用一次。iOS为`60帧/s` 如果设置为60则 每秒调用一次`selector`方法

+ duration  
`readOnly`的`CFTimeInterval`值，表示两次屏幕刷新之间的时间间隔。需要注意的是，该属性在target的selector被首次调用以后才会被赋值。selector的调用间隔时间计算方式是：`调用间隔时间` = `duration` × `frameInterval`。
 

当把`CADisplayLink`对象`add`到`runloop`中后，`selector`就能被周期性调用，类似于重复的`NSTimer`被启动了；  
执行`invalidate`操作时，`CADisplayLink`对象就会从`runloop`中移除，`selector`调用也随即停止，类似于`NSTimer`的`invalidate`方法。