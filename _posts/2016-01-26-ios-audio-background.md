---

layout: post
title: iOS后台播放声音
description: iOS后台播放声音
keywords: ios
category: ios

---

### 设置后台播放

1.Info.plist添加配置

```xml
<key>UIBackgroundModes</key>
<array>
	<string>audio</string>
</array>
```

---

或者在项目的图形化配置界面的Info项添加如下  
`Required background modes` 类型为 `Array`   
添加子项`App plays audio or streams audio/video using AirPlay`


2.添加代码

```swift
let session = AVAudioSession.sharedInstance();
do{
    try session.setActive(true)
    try session.setCategory(AVAudioSessionCategoryPlayback)
}catch{ 
}
```

### 后台一直播放音乐

上面的代码虽然可以实现后台播放，但是只要播放完毕还是会进入挂起状态，语音播放就停了  
一个比较原始的解决方法是用另一个播放器不停播放空音乐就行了，虽然方法很原始，但是有些地方只能这样解决  

```swift
//定义全局变量
var backgroundPlayer:AVAudioPlayer?;

//后台播放音乐方法
func playBackgroundMusic(){
    let musicPath = NSBundle.mainBundle().pathForResource("空音乐", ofType: "mp3");
    let musicUrl = NSURL(fileURLWithPath: musicPath!);
    do{
        self.backgroundPlayer = try AVAudioPlayer(contentsOfURL: musicUrl);
        backgroundPlayer!.prepareToPlay();
        backgroundPlayer!.volume = 1;
        backgroundPlayer!.numberOfLoops = -1;
        backgroundPlayer!.play();
    }catch{
        print(error);
    }
}
```