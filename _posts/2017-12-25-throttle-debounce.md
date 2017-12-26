---

layout: post
title: 开发中使用throttle和debounce
description: 开发中使用throttle和debounce
keywords: ios android js web
categories: 
        - ios
        - android
        - js

---


## 前言

  不管是`WEB`还是`Android`或者是`iOS`开发中 我们都会有这样的问题 

+ 按钮点击时 连续点击只让第一次生效
+ 搜索时文本不断变化导致调用多次接口

上面的两个问题解决后能大大提升用户体验  解决它们就用到了`throttle`和`debounce`

## WEB(JS)

+ [`lodash`](https://lodash.com)[`lodash中文文档`](http://lodashjs.com/docs/)
+ [`Underscore.js`](http://www.css88.com/doc/underscore1.4.2/)
+ [`jQuery throttle/debounce`](http://benalman.com/projects/jquery-throttle-debounce-plugin/)
+ [`RxJS`](https://github.com/Reactive-Extensions/RxJS)


## Android(Java)

主要用到`RxJava`和`RxAndroid`

参见文章:[`Android 中 RxJava 的实际使用`](http://www.psvmc.cn/android-rxjava-2.html)

## iOS(OC/Swift)

+ [`MessageThrottle`](https://github.com/yulingtianxia/MessageThrottle)
+ Swift可以用[`RxSwift`](https://github.com/ReactiveX/RxSwift)

> 如果项目中已经用到 或者想用`RxSwift`的话就选择第二种方式  
如果项目不想引用太多东西 或者项目用的OC 就选择第一种方式

---

> `ReactiveCocoa` vs `RxSwift`?  
> `RxSwift`虽然只支持iOS8之后的系统 但是现在基本只需适配iOS8以后了 所以不用担忧  
> `RxSwift`和`RxJava`以及`RxJS` 语法基本都相似 这真的就是`learn once, apply everywhere.`  
> 所以推荐使用`RxSwift`

### MessageThrottle实例

在OC中使用

```objc
- (void)viewDidLoad {
    [super viewDidLoad];
 
    MTRule *rule = [[MTRule alloc] initWithTarget:self selector:@selector(buttonClick:) durationThreshold:5];
    rule.messageQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    //rule.mode = MTPerformModeFirstly;
    //rule.mode = MTPerformModeLast;
    rule.mode = MTPerformModeDebounce;
    [MTEngine.defaultEngine applyRule:rule];
}

- (IBAction)buttonClick:(UIButton *)sender {
    dispatch_async(dispatch_get_main_queue(), ^{
        self.label.text = [NSString stringWithFormat:@"点击生效的时间: %@", [self getDateTimeStr]];
    });
}

- (NSString *)getDateTimeStr{
    NSDate *date = [NSDate new];
    NSDateFormatter *df = [NSDateFormatter new];
    [df setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    df.timeZone = [NSTimeZone timeZoneForSecondsFromGMT:[NSTimeZone localTimeZone].secondsFromGMT];
    NSString *localDateString = [df stringFromDate:date];
    return localDateString;
}
```

如上例子中 设置的间隔为5秒 可设置的模式有三种

+ rule.mode = MTPerformModeFirstly;
+ rule.mode = MTPerformModeLast;
+ rule.mode = MTPerformModeDebounce;

+ `MTPerformModeFirstly` 如果连续点击按钮 每5s的第一次生效
+ `MTPerformModeLast` 如果连续点击按钮 每5s的最后一次生效
+ `MTPerformModeDebounce` 如果连续点击按钮 则重置计时器 停止点击后5s操作生效

---

Swift实例

```swift
self.usernameTextField.addTarget(self, action: #selector(updatePicImageView), for: UIControlEvents.editingChanged)
    
let rule = MTRule.init(target: self, selector: #selector(updatePicImageView), durationThreshold: 1.2);
rule.messageQueue = DispatchQueue.main;
rule.mode = .debounce;
MTEngine.default.apply(rule);
```

这个和下面用`RxSwift`的示例做了同样的事 可以对比一下

### RxSwift实例

根据用户输入的名字变化 更新头像

```swift
_ = self.usernameTextField.rx.text.orEmpty
    .debounce(1.2, scheduler: MainScheduler.instance)
    .distinctUntilChanged()
    .observeOn(MainScheduler.instance)
    .subscribe(onNext: { (query) in
        self.updatePicImageView();
    })
```

  
