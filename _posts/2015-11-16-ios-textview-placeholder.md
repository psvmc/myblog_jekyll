---

layout: post
title: textview实现placeholder效果
description: textview实现placeholder效果
keywords: swift
categories: swift ios

---

### 思路
两个textView上下重叠，下面的textView(`backgroundText`)的文字设置为placeholder的文字，上面的textView(`inputText`)的背景设置为`透明`，设置上面的textView的代理，输入内容时隐藏下面textView

### 具体代码
```swift
override func viewWillAppear(animated: Bool) {
   if(inputText.delegate == nil){
       inputText.delegate = self;
   }
}
    
override func viewWillDisappear(animated: Bool) {
   if(inputText.delegate != nil){
       inputText.delegate = nil;
   }
}

func textView(textView: UITextView, shouldChangeTextInRange range: NSRange, replacementText text: String) -> Bool {
   if(text != ""){
       self.backgroundText.hidden = true;
   }else{
       if(textView.text.characters.count <= 1){
           self.backgroundText.hidden = false;
       }
   }
   return true;
}
```
