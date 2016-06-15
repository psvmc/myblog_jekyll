---

layout: post
title: iOS开源组件分类总结
description: 之前有一篇总结了一次我常用的组件，但那次是按照语言的不同进行分组的，考虑到Swift和OC可以相互调用,所以这次就按功能来分类,并说明简要的用法
keywords: ios
category: ios

---

## 下拉刷新

### ZJRefreshControl

<table>
    <tr>
    		<td><a href="https://github.com/psvmc/ZJRefreshControl" target="_blank"> ZJRefreshControl </a></td>
    		<td>下拉刷新 加载更多</td>
    		<td>Swift</td>
    </tr>
</table>

调用方式

```swift
//只有下拉刷新
refreshControl = ZJRefreshControl(scrollView: appTableView, refreshBlock: {
        self.dropViewDidBeginRefreshing()
})

//下拉刷新和上拉加载更多
refreshControl = ZJRefreshControl(scrollView: msgTableView,refreshBlock: {
            self.dropViewDidBeginRefreshing();
        },loadmoreBlock: {
            self.dropViewDidBeginLoadmore();
});

//下拉刷新调用的方法
func dropViewDidBeginRefreshing()->Void{
    println("-----刷新数据-----");
    self.delay(1.5, closure: {
        //结束下拉刷新必须调用
      self.refreshControl.endRefreshing();
    });
}

//上拉加载更多调用的方法
func dropViewDidBeginLoadmore()->Void{
    println("-----加载数据-----");
    self.delay(1.5, closure: {
        //结束加载更多必须调用
      self.refreshControl.endLoadingmore();
    });
}

//延迟执行方法
func delay(delay:Double, closure:()->()) {
    dispatch_after(
        dispatch_time(
            DISPATCH_TIME_NOW,
            Int64(delay * Double(NSEC_PER_SEC))
        ),
        dispatch_get_main_queue(), closure)
}
```


## 图片/视频选择

### DNImagePicker

<table>
    <tr>
    		<td><a href="https://github.com/psvmc/DNImagePicker" target="_blank">DNImagePicker</a></td>
    		<td>图片选择</td>
    		<td>Objective-C</td>
    </tr>
</table>

调用方式

```swift

//代理 DNImagePickerControllerDelegate

let imagePicker = DNImagePickerController();
imagePicker.imagePickerDelegate = self;
imagePicker.filterType = DNImagePickerFilterType.Photos;
imagePicker.navigationBar.tintColor = UIColor.whiteColor();
self.presentViewController(imagePicker, animated: true, completion: nil);

//代理方法
func dnImagePickerControllerDidCancel(imagePicker: DNImagePickerController!) {
    imagePicker.dismissViewControllerAnimated(true, completion: nil);
}
    
func dnImagePickerController(imagePicker: DNImagePickerController!, sendImages imageAssets: [AnyObject]!, isFullImage fullImage: Bool) {
    
    if(imageAssets.count > 1){
        self.showNoticeErr("只能选择一张图片", time: 1.2);
    }else{
        let dnasset = imageAssets[0] as! DNAsset;
        DNAsset.getALAsset(dnasset, callback: { (alasset) in
            if(alasset != nil){
                let representation =  alasset.defaultRepresentation()
                let image = UIImage(CGImage:representation.fullResolutionImage().takeUnretainedValue())
                let data = ZJ_ImageUtils.imageCompressJPG(image);
            }
        })
    }
}
```

## 弹出层

### DOAlertController

<table>
    <tr>
    		<td><a href="https://github.com/okmr-d/DOAlertController" target="_blank">DOAlertController</a></td>
    		<td>弹出确认取消的层</td>
    		<td>Swift</td>
    </tr>
</table>

调用方式

```swift
let alertController = DOAlertController(title: "新建文件夹", message: "", preferredStyle: .Alert)
alertController.addTextFieldWithConfigurationHandler { textField in
    textField.placeholder = "请输入文件夹的名称";
}
let cancelAction = DOAlertAction(title: "取消", style: .Cancel, handler: nil)
let okAction = DOAlertAction(title: "确认" ,style: .Default) { action in
    
}
alertController.addAction(cancelAction)
alertController.addAction(okAction)
presentViewController(alertController, animated: true, completion: nil)
```

### Sphere Menu

<table>
    <tr>
    		<td><a href="https://github.com/psvmc/SphereMenuSwift" target="_blank">Sphere Menu</a></td>
    		<td>弹出按钮菜单</td>
    		<td>Swift</td>
    </tr>
</table>

调用方式

```swift
//实现代理 DNImagePickerControllerDelegate

func addMenu() {
    let start = UIImage(named: "start")
    let image1 = UIImage(named: "icon_file_menu_folder")
    let image2 = UIImage(named: "icon_file_menu_img")
    let image3 = UIImage(named: "icon_file_menu_movie")
    let images:[UIImage] = [image1!,image2!,image3!]
    menu = SphereMenu(startPoint: CGPointMake(screenWidth-40, screenHeight-100), startImage: start!, submenuImages:images, tapToDismiss:true)
    menu.delegate = self
    self.view.addSubview(menu)
}

//代理方法
func sphereDidSelected(index: Int) {
    if(index == 0){
        chooseFolder();
    }else if(index == 1){
        chooseImage();
    }else if(index == 2){
        chooseVideo();
    }
    
}

//隐藏菜单
self.menu.hideViewToBottom();

//显示菜单
self.menu.showView();
```


## 侧滑菜单

### RESideMenu

<table>
    <tr>
    		<td><a href="https://github.com/romaonthego/RESideMenu" target="_blank"> RESideMenu </a></td>
    		<td>侧滑菜单</td>
    		<td>Objective-C</td>
    </tr>
</table>

## TableViewCell侧滑

### MGSwipeTableCell

<table>
    <tr>
    		<td><a href="https://github.com/MortimerGoro/MGSwipeTableCell" target="_blank"> MGSwipeTableCell </a></td>
    		<td>TableViewCell侧滑</td>
    		<td>Objective-C</td>
    </tr>
</table>

调用方式

+ 1 引用头文件

```swift
//侧滑按钮
#import "MGSwipeButton.h"
#import "MGSwipeTableCell.h"
```

+ 2 需要侧滑的`tableViewCell`继承`MGSwipeTableCell`

+ 3 `Controller`实现接口`MGSwipeTableCellDelegate`

+ 4 相关代码

```swift
func createRightButtons() -> Array<MGSwipeButton>{
    var buttonArray = Array<MGSwipeButton>();
    let titleArray = [
        "",
        //""
    ];
    let iconArray = [
        UIImage(named: "cell_cross.png"),
        //UIImage(named: "cell_menu.png"),
    ];
    let backgroundColorArray = [
        UIColor(red: 1, green: 102/255, blue: 102/255, alpha: 1),
        //UIColor(red: 104/255, green: 187/255, blue: 248/255, alpha: 1),
    ];
    
    let insets = UIEdgeInsets(top: 0, left: 30, bottom: 0, right: 30);
    
    for i in 0  ..< titleArray.count  {
        let button = MGSwipeButton(title: titleArray[i], icon: iconArray[i], backgroundColor: backgroundColorArray[i],insets: insets);
        buttonArray.append(button);
    }
    
    return buttonArray;
}
    
func swipeTableCell(cell: MGSwipeTableCell!, tappedButtonAtIndex index: Int, direction: MGSwipeDirection, fromExpansion: Bool) -> Bool {
    if(index == 0){
        let indexPath = tableView.indexPathForCell(cell);
        print("点击了\(indexPath)")
    }
    return true;
}
```

+ 5 cell中调用

```swift
cell.rightButtons = createRightButtons();
cell.rightSwipeSettings.transition = MGSwipeTransition.Border;
cell.delegate = self;
```


## 数据库

### SQLiteDB

<table>
    <tr>
    		<td><a href="https://github.com/psvmc/SQLiteDB_Swift" target="_blank"> SQLiteDB </a></td>
    		<td>操作Sqlite数据库</td>
    		<td>Swift</td>
    </tr>
</table>

调用方式

```swift
let db = SQLiteDB.sharedInstance()
let data = db.query("SELECT * FROM customers WHERE name='John'")
let row = data[0]
if let name = row["name"] {
    textLabel.text = name as! String
}
```

## 数据请求

### Swift数据请求常用的三个库

<table>
	<tr>
		<td><a href="https://github.com/Alamofire/Alamofire" target="_blank">Alamofire</a></td>
		<td>网络请求库</td>
		<td>Swift</td>
	</tr>
	
	<tr>
		<td><a href="https://github.com/SwiftyJSON/SwiftyJSON" target="_blank">SwiftyJSON</a></td>
		<td>转JSON</td>
		<td>Swift</td>
	</tr>
	
	<tr>
		<td><a href="https://github.com/psvmc/Alamofire-SwiftyJSON" target="_blank">Alamofire-SwiftyJSON</a></td>
		<td>方便以上两个组件的结合使用</td>
		<td>Swift</td>
	</tr>
</table>

