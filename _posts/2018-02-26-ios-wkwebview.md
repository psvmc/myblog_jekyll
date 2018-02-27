---
layout: post
title: 使用WKWebView替换UIWebView
description: 使用WKWebView替换UIWebView
keywords: webview
categories: ios webview js
---



## 代理方法

添加引用

```swift
import WebKit
```

代理 `WKNavigationDelegate`  页面加载状态的回调

代理方法

```swift
func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {

}

func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {

}

func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {

}

func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {

}
```

代理 `WKUIDelegate `  处理JS弹窗的回调

代理方法

```swift
//消息弹窗
func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
	self.showNoticeText(message, time: 1.2)
	completionHandler();
}
//确认弹窗
func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
	completionHandler(true);
}
//输入弹窗
func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
	completionHandler("哈哈");
}
```

## 交互

### Swift调用JS方法

```swift
self.webview.evaluateJavaScript("loadData('123')") { (obj, error) in

}
```

JS中的方法

```js
function loadData(questionid) {
    alert("传递的questionID为:"+questionid);
}
```

### JS调用Swift方法

添加代理`WKScriptMessageHandler`

代理方法

```swift
func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
    if(message.name == "getIOSMessage"){
        if let message_body = message.body as? [String:String]{
            if let name = message_body["name"]{
                self.showNoticeText("JS传过来的数据 name:\(name)", time: 1.2)
            }
        }
    }
}
```

`WKWebView`配置

```swift
let config = WKWebViewConfiguration.init()
config.userContentController = WKUserContentController.init();
config.userContentController.add(self, name: "getIOSMessage");
self.webview = WKWebView.init(frame: CGRect.zero, configuration: config);
self.webview.allowsBackForwardNavigationGestures = true;
self.webview.navigationDelegate = self;
self.webview.uiDelegate = self;
```

JS调用

```js
$("#question_group").click(function () {
    try{
        window.webkit.messageHandlers.getIOSMessage.postMessage({'name': '小明'});
    }catch(e){

    }
});
```

## 进度条

添加进度条

```swift
self.progressView = UIProgressView.init()
self.progressView.progressTintColor = ZJColor.orangeColor;
self.view.addSubview(self.progressView);
self.progressView.snp.makeConstraints { (maker) in
    maker.height.equalTo(2)
    maker.left.top.right.equalToSuperview()
}
```

监听进度变化

```swift
override func viewDidAppear(_ animated: Bool) {
    self.webview.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
}

override func viewDidDisappear(_ animated: Bool) {
    self.removeObserver(self, forKeyPath: "estimatedProgress")
}

override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if(keyPath == "estimatedProgress"){
        if (self.webview.estimatedProgress == 1){
            self.progressView.isHidden = true
        }else{
            self.progressView.isHidden = false
            self.progressView.progress = Float(self.webview.estimatedProgress)
        }
    }
}
```

## 后退键

```swift
func setNavi()  {
    let closeBarButtonItem = UIBarButtonItem(image: UIImage(named:"tk_close"), style: UIBarButtonItemStyle.plain, target: self, action: #selector(leftBarButtonClick));
    let backBarButtonItem = UIBarButtonItem(image: UIImage(named:"tk_back"), style: UIBarButtonItemStyle.plain, target: self, action: #selector(backBarButtonClick));
    if(self.webview != nil && self.webview.canGoBack){
        self.navigationItem.leftBarButtonItems = [closeBarButtonItem,backBarButtonItem];
    }else{
        self.navigationItem.leftBarButtonItems = [closeBarButtonItem];
    }
}

@objc func backBarButtonClick(){
    if(self.webview.canGoBack){
        self.webview.goBack()
    }
}
```

在之前的页面加载完成回调中重新设置导航栏

```swift
func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    self.setNavi()
    //这一行是为了 页面加载完成后 调用js方法 加载数据
    self.webview.evaluateJavaScript("loadData('123')") { (response, error) in

    }
}
```

## 替换页面中的引用的JS/CSS为本地文件

 暂时没有什么好的解决方法  没有像android可以拦截替换的方法