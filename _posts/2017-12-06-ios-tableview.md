---

layout: post
title: iOS UITableView的使用
description: iOS UITableView的使用
keywords: ios
category: ios

---

## 代理

添加代理 `UITableViewDelegate,UITableViewDataSource`

## 数据

```swift
var tableData = [
        ["image":"lm_user","text":"账号"],
        ["image":"lm_photo","text":"相册"],
        ["image":"lm_star","text":"收藏"],
        ["image":"lm_file","text":"文件"],
        ["image":"lm_setting","text":"设置"],
        ["image":"lm_SIP","text":"SIP"]
    ]
```

## Cell类

```swift
class LeftMenuCell: UITableViewCell {

    @IBOutlet weak var leftImageView: UIImageView!
    @IBOutlet weak var rightLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
    }
    
    func setItemData(itemData:[String:String])  {
        leftImageView.image = UIImage.init(named: itemData["image"]!);
        rightLabel.text = itemData["text"];
    }
    
}
```

## 初始化

初始化及代理方法

```swift
func initTableView(){
    //设置分割线样式
    self.tableView.separatorStyle = .none;
    self.tableView.register(UINib.init(nibName: "LeftMenuCell", bundle: nil), forCellReuseIdentifier: "LeftMenuCell");
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
}
    
func numberOfSections(in tableView: UITableView) -> Int {
    return 1;
}
    
func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return self.tableData.count;
}
    
func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
    return 0.1;
}
    
func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
    return 0.1;
}
    
func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
    return UIView();
}
    
func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
    return UIView();
}
    
func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
    return 60;
}
    
func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let itemData  = self.tableData[indexPath.row];
    let  cell = tableView.dequeueReusableCell(withIdentifier: "LeftMenuCell", for: indexPath) as! LeftMenuCell;
    cell.setItemData(itemData: itemData);
    return cell;
}
    
func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    let itemData = self.tableData[indexPath.row];
    ZJFunc.unselectCell(tableView: tableView);
}
```

## Cell自动高度

[参见文章：iOS 设置tableViewCell的高度](http://www.psvmc.cn/ios-tableviewcell-height.html)

## 代码中使用到的工具类

```swift
import UIKit
class ZJFunc{
    
    ///延迟执行方法
    static func delay(delay:Double, closure:@escaping ()->()) {
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + delay) {
            closure();
        }
    }
    
    ///异步调用方法
    static func async(block:@escaping ()->(),callBack:@escaping()->()){
        DispatchQueue(label: NSDate().description).async {
            block();
            DispatchQueue.main.async {
                callBack();
            }
        }
    }
    
    ///取消选中的tablecell
    static func unselectCell(tableView: UITableView)->Void{
        delay(delay: 0.1) {
            if(tableView.indexPathForSelectedRow != nil){
                tableView.deselectRow(at: tableView.indexPathForSelectedRow!, animated: true);
            }
        }
    }
    
    ///打电话
    static func phone(phone:String,viewController:UIViewController)->Void{
        let str = "tel:\(phone)";
        let callWebView = UIWebView();
        viewController.view.addSubview(callWebView);
        callWebView.loadRequest(URLRequest(url:URL(string:str)!))
    }
    
    ///发短信
    static func msg(phone:String)->Void{
        let str = "sms:\(phone)";
        UIApplication.shared.openURL(URL(string:str)!);
    }
    ///获取随机正整数
    static func randomNum(num:Int)->Int{
        let randomNum = Int(arc4random_uniform(UInt32(num)));
        return randomNum;
    }
    
    ///距离scrollView底部的距离
    static func scrollViewSpaceToButtom(scrollView: UIScrollView)->CGFloat{
        let offset = scrollView.contentOffset;
        let bounds = scrollView.bounds;
        let size = scrollView.contentSize;
        let inset = scrollView.contentInset;
        let currentOffset = offset.y + bounds.size.height - inset.bottom;
        let maximumOffset = size.height;
        
        //当currentOffset与maximumOffset的值相等时，说明scrollview已经滑到底部了。也可以根据这两个值的差来让他做点其他的什么事情
        let space = maximumOffset-currentOffset;
        return space;
    }
    
    ///判断系统是否大于某版本号
    static func isVersion(version:String)-> Bool{
        switch UIDevice.current.systemVersion.compare(version, options: NSString.CompareOptions.numeric) {
        case .orderedSame, .orderedDescending:
            return true;
        case .orderedAscending:
            return false;
        }
    }
    
    ///Cell抖动动画
    static func animateView(view: UIView) {
        let animation = CAKeyframeAnimation()
        animation.keyPath = "position.x"
        animation.values =  [0, 20, -20, 10, 0]
        animation.keyTimes = [
            NSNumber(value:0),
            NSNumber(value:1.0 / 6.0),
            NSNumber(value:3 / 6.0),
            NSNumber(value:5.0 / 6.0),
            NSNumber(value:1)
        ]
        animation.duration = 0.35
        animation.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseOut)
        animation.isAdditive = true
        view.layer.add(animation, forKey: "shake")
    }
    
    
    static func animateViewY(view: UIView) {
        let animation = CAKeyframeAnimation()
        animation.keyPath = "position.y"
        animation.values =  [0, 10, 0, 5, 0]
        animation.keyTimes = [
            NSNumber(value:0),
            NSNumber(value:1.0 / 6.0),
            NSNumber(value:3 / 6.0),
            NSNumber(value:5.0 / 6.0),
            NSNumber(value:1)
        ]
        animation.duration = 0.35
        animation.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseInEaseOut)
        animation.isAdditive = true
        view.layer.add(animation, forKey: "shake")
    }
    
    static func animateViewBgColor(view: UIView) {
        let animation = CABasicAnimation()
        animation.keyPath = "backgroundColor"
        animation.fromValue = view.layer.backgroundColor;
        animation.toValue = UIColor.groupTableViewBackground.cgColor;
        
        animation.duration = 0.33
        animation.fillMode = kCAFillModeBoth
        view.layer.add(animation, forKey: nil)
        
        let animation2 = CABasicAnimation()
        animation2.keyPath = "cornerRadius"
        animation2.fromValue = view.layer.cornerRadius;
        animation2.toValue = view.frame.width/8;
        animation2.duration = 0.33
        animation2.fillMode = kCAFillModeBoth
        view.layer.add(animation2, forKey: nil)
    }
}
```