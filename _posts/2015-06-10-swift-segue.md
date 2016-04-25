---

layout: post
title: 自定义转场动画
description: IOS自定义转场动画
keywords: swift,ios
category: ios

---

## 实现思路
自定义转场动画时需要做以下几步   
以下内容假设是从A-->B添加的segue

- 添加两个segue（一个是用于正向转场 ，一个是新页面推出时的反向转场动画）
- 从原view向目标view右键拖动 这是segue的可选项中就会有新添加的两个segue 选择正向的那个转场，也可以选择custom 然后设置segue对应的class
- 反向转场相对就要麻烦些了 反向转场是B-->A 首先在A中重写返回A时调用的方法（不是B中）方法中设置转场调用的动画

## 详细实现

### 正向转场的实现类

	//
	//  PushSegue.swift
	//  signDemo
	//
	//  Created by PSVMC on 15/6/9.
	//  Copyright (c) 2015年 PSVMC. All rights reserved.
	//

	import UIKit

	class CustomPushSegue: UIStoryboardSegue {
	    
	    override func perform() {
	        //原视图
	        var source = self.sourceViewController as! UIViewController;
	        //目标视图
	        var destination = self.destinationViewController as! UIViewController;
	        
	        source.view.addSubview(destination.view);
	        destination.view.frame=source.view.frame;
	        
	        destination.view.frame.origin.x+=320;
	        //destination.view.transform=CGAffineTransformMakeScale(0.1, 0.1)
	        
	        
	        source.view.alpha=CGFloat(1.0)
	        destination.view.alpha=CGFloat(1.0);
	        
	        UIView.animateKeyframesWithDuration(0.3, delay: 0, options: UIViewKeyframeAnimationOptions.CalculationModeCubic, animations: {
	            source.view.frame.origin.x-=320;
	            destination.view.alpha=1.0;
	            destination.view.transform=CGAffineTransformMakeScale(1.0, 1.0)
	            //destination.view.frame.origin.x-=320;
	            }, completion:{(finish) -> Void in
	                source.presentViewController(destination, animated: false, completion: nil)
	            }
	        )
	    }
	}
	
### 反向转场的实现类
	//
	//  CustomPushUnwindSegue.swift
	//  signDemo
	//
	//  Created by PSVMC on 15/6/9.
	//  Copyright (c) 2015年 PSVMC. All rights reserved.
	//

	import UIKit

	class CustomPushUnwindSegue: UIStoryboardSegue {
	    override func perform() {
	        var source = self.sourceViewController as! UIViewController;
	        var destination = self.destinationViewController as! UIViewController;
	        
	        let window = UIApplication.sharedApplication().keyWindow
	        window?.insertSubview(destination.view, aboveSubview: source.view)
	        
	        destination.view.frame=source.view.frame;
	        
	        destination.view.bounds.origin.x-=320;
	        //destination.view.transform=CGAffineTransformMakeScale(0.1, 0.1)
	        //bounds是绝对位置
	        //frame是相对父元素的位置
	        
	        
	        //source.view.bounds.origin.x-=320;
	        source.view.alpha=CGFloat(1.0)
	        destination.view.alpha=CGFloat(1.0);
	        
	        UIView.animateKeyframesWithDuration(0.3, delay: 0, options: UIViewKeyframeAnimationOptions.CalculationModeCubic, animations: {
	            
	            source.view.bounds.origin.x+=320;
	            destination.view.bounds.origin.x+=320;
	            destination.view.alpha=1.0;
	            destination.view.transform=CGAffineTransformMakeScale(1.0, 1.0)
	            //destination.view.frame.origin.x-=320;
	            }, completion:{(finish) -> Void in
	                source.dismissViewControllerAnimated(false, completion: nil);
	            }
	        )
	        
	    }
	}

### 重写反向转场的动画
    override func segueForUnwindingToViewController(toViewController: UIViewController, fromViewController: UIViewController, identifier: String?) -> UIStoryboardSegue {
        if let id = identifier{
            if id == "unwindToLogin" {
                let unwindSegue = CustomPushUnwindSegue(identifier: id, source: fromViewController, destination: toViewController, performHandler: { () -> Void in
                    
                })
                return unwindSegue
            }
        }
        
        return super.segueForUnwindingToViewController(toViewController, fromViewController: fromViewController, identifier: identifier)
    }
