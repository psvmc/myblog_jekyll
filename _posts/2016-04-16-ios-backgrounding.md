---

layout: post
title: iOS 后台任务
description: iOS 后台任务
keywords: ios
category: ios

---

## 前言

iOS的后台任务总共可分为两大类

一种是只针对某种类型的后台模式

另一种是请求系统给予额外的后台时间

> 无论上面的那种模式 一旦程序进入后台后 都无法处理远程的推送信息  
> 不知道滴滴打车后台播单是如何实现的

## 后台模式

允许app在后台仍然运行的情况仅限于以下几种：

+ 1.播放音频文件（playing audio）
+ 2.获取定位更新（getting location updates）
+ 3.杂志app中下载新的期刊（downloading new issues for newsstand apps）
+ 4.VoIP 呼叫（handing VoIP calls）

这几种模式都要在配置文件中配置相应得配置

如 后台播放音频文件 就要添加以下配置  步骤如下

+ 点击项目    
+ 点击`info`   
+ 点击`+`   
+ 在出现的列表中，选择`Required Background Modes` 
+ Xcode将会在该条目下创建一个数组，并含有一个空条目。  
点击该子条目右侧，并选择`App plays audio` 

> 并且所有你选择的后台模式 程序中必须用到  并且不能用于其它用途 否则会审核不通过   

### 1) 播放音频文件

仅当你的app是真的提供给用户音频播放功能，你才能使用音频后台模式。  
若我们抱有侥幸心理，为了获得CPU更多时间而利用该模式`播放一段无声的音频`，`apple将会拒绝此类app`。  
同样的当语音播放完毕之后程序同样会挂起

播放无声音频的代码

```swift
func playAudio(){
    let audioSession = AVAudioSession.sharedInstance();
    do{
        try audioSession.setCategory(AVAudioSessionCategoryPlayback)
    }catch{
    
    }
    
    let mainBundle = NSBundle.mainBundle();
    let filePath = mainBundle.pathForResource("空音乐", ofType: "mp3");
    let fileData = NSData(contentsOfFile: filePath!);
    do{
        self.audioPlayer = try AVAudioPlayer(data: fileData!);
        self.audioPlayer?.numberOfLoops = -1;
        if(self.audioPlayer!.prepareToPlay() && self.audioPlayer!.play()){
            ZJLog.printLog("开始播放");
        }else{
            ZJLog.printLog("播放失败");
        }
    }catch{
    
    }
}
```

调用上面无限循环的音频后可以发现后台任务的剩余时间一直都是无限的

### 2) 获取定位更新

一般来说只要进入后台时 是在获取定位 定位只要不停止 就会一直在后台运行  

需要提醒的是：仅当你的app确实能够根据后台定位来提供有益于用户的价值，才可使用该模式。否则，你用了该模式，但对apple看来，用户毫无获益，你的app将会被拒。有时apple也会要求你在app添加一段警告，即告知用户你的app会增加电池的使用量。

### 3) 杂志app中下载新的期刊

同样下载完成后 程序就会挂起

### 4) VoIP 呼叫

最后一个是一个强大的后台模式，它允许你的APP在后台时运行任意代码。它没有时长限制。
更重要的，app若崩溃或者重启设备，APP仍然自动在后台运行。


## 请求额外的后台时间

[代码示例](https://github.com/psvmc/BackgroundTaskDemo_Swift)

当应用退出后台时  依旧会有几秒的后台运行时间  然后再挂起   
但是我们可以像系统申请额外的时间  这个额外的时间不是固定的  
我在测试时就只获取了3分钟的时间

申请额外的时间的代码如下

```swift
//启动后台任务
if(UIDevice.currentDevice().multitaskingSupported){
    ZJLog.printLog("启动后台任务");
    self.backgroundTask = UIApplication.sharedApplication().beginBackgroundTaskWithExpirationHandler({
        ZJLog.printLog("后台任务到期");
        UIApplication.sharedApplication().endBackgroundTask(self.backgroundTask);
        self.backgroundTask = UIBackgroundTaskInvalid;
    })
 
}
```

取消额外时间代码

```swift
//终止后台任务
UIApplication.sharedApplication().endBackgroundTask(self.backgroundTask);
self.backgroundTask = UIBackgroundTaskInvalid;
```

一般情况下   
我们可以在`applicationWillResignActive` 程序将要挂起方法中来申请额外的后台时间  
可以在`applicationDidBecomeActive` 程序激活后方法中来取消额外的后台时间  

正所谓有借有还 所以每一次我们申请额外的时间  我们都要取消一次  
如果我们连续申请两次 只取消一次的话 程序依旧不会挂起


例子中 我用了一个循环事件 来判断程序是否在后台执行 以及剩余的后台时间是多少

```swift
var timer:NSTimer?;
var backgroundTask = UIBackgroundTaskInvalid;

func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
    self.timer = NSTimer.scheduledTimerWithTimeInterval(2, target: self, selector: #selector(AppDelegate.backgroundTimeAction), userInfo: nil, repeats: true);
    return true
}

func applicationWillResignActive(application: UIApplication) {
    ZJLog.printLog("程序挂起");
    
    //方式1
    //启动后台任务
    if(UIDevice.currentDevice().multitaskingSupported){
        ZJLog.printLog("启动后台任务");
        self.backgroundTask = UIApplication.sharedApplication().beginBackgroundTaskWithExpirationHandler({
            ZJLog.printLog("后台任务到期");
            UIApplication.sharedApplication().endBackgroundTask(self.backgroundTask);
            self.backgroundTask = UIBackgroundTaskInvalid;
        })
 
    }
}
    
func backgroundTimeAction(){
    let backgroundTimeRemaining = UIApplication.sharedApplication().backgroundTimeRemaining;
    if(backgroundTimeRemaining == DBL_MAX){
        ZJLog.printLog("backgroundTimeRemaining:Undetermined");
    }else{
        ZJLog.printLog("backgroundTimeRemaining:\(backgroundTimeRemaining)");
    }
    
}
func applicationDidBecomeActive(application: UIApplication) {
    ZJLog.printLog("程序激活");
    
    //终止后台任务
    UIApplication.sharedApplication().endBackgroundTask(self.backgroundTask);
    self.backgroundTask = UIBackgroundTaskInvalid;
    ZJLog.printLog("终止后台任务");
}
```