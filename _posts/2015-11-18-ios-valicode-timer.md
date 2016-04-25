---

layout: post
title: iOS验证码倒计时
description: iOS验证码倒计时的实现
keywords: swift
categories: swift ios

---

### 思路
设置全局的`Timer`对象，全局的`计数`，假设操作的button为`valiButton`，点击后定时执行方法，60秒后重置，并取消`timer`

### 具体代码
```swift
@IBOutlet weak var valiButton: UIButton!
//验证码倒计时
var timer:NSTimer!;
var totalNum:Int = 60;
    
//验证点击事件
@IBAction func valiClick(sender: AnyObject) {
	//防止反复点击，因为定时器1s后才执行
	self.valiButton.enabled = false;
   self.timer = NSTimer.scheduledTimerWithTimeInterval(1, target: self, selector: Selector("timerAction"), userInfo: nil, repeats: true);
}
    
//反复执行的方法
func timerAction(){
   if(self.totalNum > 0){
       self.totalNum -= 1;
       self.valiButton.enabled = false;
       self.valiButton.setTitle("\(self.totalNum)", forState: UIControlState.Disabled);
   }else{
       self.valiButton.enabled = true;
       timer.invalidate();
       totalNum = 60;
   }
}
```
