---

layout: post
title: NSNotificationCenter.addObserverForName的正确打开方式
description: NSNotificationCenter.addObserverForName的正确打开方式
keywords: ios
category: ios

---

## 前言

Apple 在 iOS4 中添加 `addObserverForName` 方法，给予开发者可以在`block`中处理 `Notification` 通知的便捷方法。

但是，在实际应用中，却比原有的 `Selector` 方法更复杂，甚至，一不小心就造成`循环引用`，内存得不到释放。

## 正文

这个方法的使用方法是这样的

```swift
class ViewController: UIViewController {
    weak var nameObserver: NSObjectProtocol?
    override func viewDidLoad() {
        super.viewDidLoad()
        nameObserver = NSNotificationCenter.defaultCenter().addObserverForName("Name", object: nil, queue: NSOperationQueue.mainQueue()) { (_) -> Void in
            print("some one call me!")
        }
    }
}
```

像上面这样使用，真是一点问题都没有！   
但是，如果你要在`block`上使用`self`关键字的话，那就会造成循环引用（其实不算是循环引用，只要你在某个时间点，能把`observer`释放掉，也是OK的），这个`ViewController`永远不会被释放。

```swift
class ViewController: UIViewController {

    weak var nameObserver: NSObjectProtocol?

    deinit {
        print("dealloced") // 析构方法永远不会被执行
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        nameObserver = NSNotificationCenter.defaultCenter().addObserverForName("Name", object: nil, queue: NSOperationQueue.mainQueue()) { (_) -> Void in
            print("some one call me! -- view:\(self.view)")
        }
    }
}
```

解决方法很简单，使用`weak self`就可以了

```swift
class ViewController: UIViewController {

    weak var nameObserver: NSObjectProtocol?

    deinit {
        print("dealloced") // 这样就可以走到析构方法了
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        weak var welf = self
        nameObserver = NSNotificationCenter.defaultCenter().addObserverForName("Name", object: nil, queue: NSOperationQueue.mainQueue()) { (_) -> Void in
            if let welf = welf {
                print("some one call me! -- view:\(welf.view)")
            }
        }
    }
}
```

等等，你以为到这里，就结束了吗？  
要记得，这个 `Observer` 其实还被 `NSNotificationCenter` 引用着，他也是不会释放的，最明显的体现就是，就算你的`ViewController`被释放了，`block`中的代码块仍然会被执行。   

解决方法也很简单。

```swift
class ViewController: UIViewController {

    weak var nameObserver: NSObjectProtocol?

    deinit {
        if let nameObserver = nameObserver {
            NSNotificationCenter.defaultCenter().removeObserver(nameObserver) // 那我们就把它释放掉好了
        }
        print("dealloced") // 这样就可以走到析构方法了
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        weak var welf = self
        nameObserver = NSNotificationCenter.defaultCenter().addObserverForName("Name", object: nil, queue: NSOperationQueue.mainQueue()) { (_) -> Void in
            if let welf = welf {
                print("some one call me! -- view:\(welf.view)")
            }
        }
    }
}
```


本文转载自[简书](http://www.jianshu.com/p/5848b6604033)