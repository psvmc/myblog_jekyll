---

layout: post
title: iOS 引导页实现方式
description: iOS 引导页实现方式
keywords: ios
category: ios

---

## 简述

主要利用`UICollectionView`和`UIPageControl`配合来实现

## 代码

添加代理

```swift
UICollectionViewDataSource,UICollectionViewDelegateFlowLayout
```

配置

```swift
@IBOutlet weak var collectionView: UICollectionView!
    
@IBOutlet weak var pageControl: UIPageControl!
    
var colletcionData:[String] = ["yindao1","yindao2","yindao3","yindao4"];
    
override func viewDidLoad() {
    super.viewDidLoad()

    self.initCollectionView();
    self.initPageControl();
}
    
func initCollectionView(){
    self.collectionView.register(UINib.init(nibName: "WelcomeCell", bundle: nil), forCellWithReuseIdentifier: "WelcomeCell");
    self.collectionView.showsHorizontalScrollIndicator = false;
    self.collectionView.showsVerticalScrollIndicator = false;
    self.collectionView.backgroundColor = UIColor.clear;
    self.collectionView.isScrollEnabled = true;
    
    let flowLayout = UICollectionViewFlowLayout();
    flowLayout.scrollDirection = UICollectionViewScrollDirection.horizontal;
    flowLayout.minimumInteritemSpacing = 0;
    flowLayout.minimumLineSpacing = 0;
    self.collectionView.collectionViewLayout = flowLayout;
    self.collectionView.isPagingEnabled = true;
    self.collectionView.dataSource = self;
    self.collectionView.delegate = self;
}
    
func initPageControl(){
    self.pageControl.numberOfPages = self.colletcionData.count;
    self.pageControl.currentPage = 0;
    self.pageControl.setValue(UIImage.init(named: "pageControl1"), forKey: "_pageImage")
    self.pageControl.setValue(UIImage.init(named: "pageControl2"), forKey: "_currentPageImage")
}

func numberOfSections(in collectionView: UICollectionView) -> Int {
    return 1;
}
    
func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return colletcionData.count;
}
    
func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let itemdata = colletcionData[indexPath.row];
    let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "WelcomeCell", for: indexPath) as! WelcomeCell;
    cell.inImageView.image = UIImage.init(named: itemdata)
    return  cell;
}
    
func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
    return CGSize(width: self.collectionView.frame.width, height: self.collectionView.frame.height);
}
    
func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
    //点击最后一张图 跳转到登录页面
    if(indexPath.row == (self.colletcionData.count-1)){
        ZJUserDefaults.setValue("false", forKey: "isFirstLoad");
        let loginViewController = LoginViewController();
        AppDelegate.appDelegate?.window?.rootViewController = loginViewController;
    }
}
    
func scrollViewDidScroll(_ scrollView: UIScrollView) {
    let pageWidth = self.collectionView.frame.width;
    let currPage = Int(floor((scrollView.contentOffset.x - pageWidth/2)/pageWidth) + 1);
    self.pageControl.currentPage = currPage;
    if(currPage == self.colletcionData.count - 1){
        self.pageControl.isHidden = true;
    }else{
        self.pageControl.isHidden = false;
    }
}
```

用到的Cell

```swift
import UIKit

class WelcomeCell: UICollectionViewCell {
    @IBOutlet weak var inImageView: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
}
```

## 设置状态栏

```swift
//设置状态栏为白色
override var preferredStatusBarStyle: UIStatusBarStyle{
    return UIStatusBarStyle.lightContent;
}
    
override var prefersStatusBarHidden: Bool{
    return false;
}
    
override var preferredStatusBarUpdateAnimation: UIStatusBarAnimation{
    return UIStatusBarAnimation.slide
}
```

## 获取View的所有属性

主要用在修改一些组件的默认样式  
这里用于获取`UIPageControl`的属性 修改原来的点为自己的图片

```swift
func runtime() {
    // 利用runtime 遍历出pageControl的所有属性
    var count : UInt32 = 0
    let ivars = class_copyIvarList(UIPageControl.self, &count)
    for i in 0..<count {
        let ivar = ivars?[Int(i)]
        let name = ivar_getName(ivar!)
        print(String(cString: name!))
    }
}
```