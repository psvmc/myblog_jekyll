---

layout: post
title: iOS UICollectionView的用法
description: iOS UICollectionView的用法
keywords: ios
category: ios

---

## 使用自定义布局

### 继承

`UICollectionViewDataSource`,`UICollectionViewDelegate`

### 自定义布局

```swift
import UIKit
class MainLayout : UICollectionViewLayout {
    
    // 内容区域总大小，不是可见区域
    override func collectionViewContentSize() -> CGSize {
        return CGSizeMake(
            collectionView!.bounds.size.width,
            320
        )
    }
    
    // 所有单元格位置属性
    override func layoutAttributesForElementsInRect(rect: CGRect) -> [UICollectionViewLayoutAttributes]? {
        var attributesArray = [UICollectionViewLayoutAttributes]()
        let cellCount = self.collectionView!.numberOfItemsInSection(0)
        for i in 0..<cellCount {
            let indexPath =  NSIndexPath(forItem:i, inSection:0)
            let attributes =  self.layoutAttributesForItemAtIndexPath(indexPath)
            attributesArray.append(attributes!)
        }
        return attributesArray
    }
    
    // 这个方法返回每个单元格的位置和大小
    override func layoutAttributesForItemAtIndexPath(indexPath: NSIndexPath) -> UICollectionViewLayoutAttributes? {
        //当前单元格布局属性
        let attribute =  UICollectionViewLayoutAttributes(forCellWithIndexPath:indexPath)
        //当前行的Y坐标
        let topSpace:CGFloat = 10;
        let space:CGFloat = 6;
        let leftSpace:CGFloat = 10;
        let itemWidth:CGFloat = (collectionView!.bounds.size.width - leftSpace*2 - space)/2;
        var itemHeight:CGFloat = 214;
        var itemHeight2:CGFloat = 104;
        if(ZJ_SysUtils.getDeviceType() == ZJ_SysUtils.DeviceType.iPhone6){
            itemHeight2 = itemHeight2 * 1.3;
            itemHeight = itemHeight2 * 2 + space;
        }
        let rightX:CGFloat =  leftSpace + itemWidth + space;
        let right1Y = topSpace;
        let right2Y = topSpace + itemHeight2 + space;
        let right3Y = topSpace + itemHeight + space;
        
        let item = indexPath.item;
        if (item == 0) {
            attribute.frame = CGRectMake(leftSpace, right1Y, itemWidth, itemHeight)
        } else if (item == 1) {
            attribute.frame = CGRectMake(rightX, right1Y, itemWidth, itemHeight2)
        } else if (item == 2) {
            attribute.frame = CGRectMake(rightX, right2Y, itemWidth, itemHeight2)
        } else if (item == 3) {
            attribute.frame = CGRectMake(leftSpace, right3Y, itemWidth, itemHeight2)
        } else if (item == 4) {
            attribute.frame = CGRectMake(rightX, right3Y, itemWidth, itemHeight2)
        }
        return attribute
    }
}
```

### 设置

```swift
collectionView.registerNib(UINib.init(nibName: "MainBigCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "mainBigCollCell");
collectionView.registerNib(UINib.init(nibName: "MainSmallCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "mainSmallCollCell");
collectionView.collectionViewLayout = MainLayout();
collectionView.dataSource = self;
collectionView.delegate = self;
```

### 代理方法

```swift
func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
    return 1;
}
    
func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return 5;
}
    
func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
    
}
    
func collectionView(collectionView: UICollectionView, didSelectItemAtIndexPath indexPath: NSIndexPath) {

}
```

## 使用流式布局

### 继承

`UICollectionViewDataSource`,`UICollectionViewDelegateFlowLayout`

### 设置

Swift

```swift
self.collectionView.registerNib(UINib.init(nibName: "YuyinCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "YuyinCollectionViewCell");
self.collectionView.showsHorizontalScrollIndicator = false;
self.collectionView.showsVerticalScrollIndicator = false;
self.collectionView.backgroundColor = UIColor.clearColor();
self.collectionView.scrollEnabled = false;
let flowLayout = UICollectionViewFlowLayout();
flowLayout.scrollDirection = UICollectionViewScrollDirection.Horizontal;
flowLayout.minimumInteritemSpacing = 0;
flowLayout.minimumLineSpacing = 0;
self.collectionView.collectionViewLayout = flowLayout;
self.collectionView.dataSource = self;
self.collectionView.delegate = self;
```

OC

```objc
@property (weak, nonatomic) IBOutlet UIPageControl *pageControl;
@property (strong, nonatomic) NSMutableArray<NSMutableArray<OrderPicModel *> *> *tableData;
```

```objc
[self.collectionView registerNib:[UINib nibWithNibName:@"OrderPicsCollectionViewCell" bundle:nil] forCellWithReuseIdentifier:@"OrderPicsCollectionViewCell"];
self.collectionView.showsHorizontalScrollIndicator = false;
self.collectionView.showsVerticalScrollIndicator = false;
self.collectionView.scrollEnabled = true;
self.collectionView.pagingEnabled = true;
    
UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc]init];
flowLayout.scrollDirection = UICollectionViewScrollDirectionHorizontal;
flowLayout.minimumInteritemSpacing = 0;
flowLayout.minimumLineSpacing = 0;
self.collectionView.collectionViewLayout = flowLayout;
self.collectionView.dataSource = self;
self.collectionView.delegate = self;
```

### 代理方法

Swift

```swift
func numberOfSectionsInCollectionView(collectionView: UICollectionView) -> Int {
    return 1;
}
    
func collectionView(collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return 5;
}
    
func collectionView(collectionView: UICollectionView, cellForItemAtIndexPath indexPath: NSIndexPath) -> UICollectionViewCell {
    let cell = collectionView.dequeueReusableCellWithReuseIdentifier("YuyinCollectionViewCell", forIndexPath: indexPath) as! YuyinCollectionViewCell;
    return  cell;
}
    
func collectionView(collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAtIndexPath indexPath: NSIndexPath) -> CGSize {
    return CGSizeMake(self.collectionView.frame.width, self.collectionView.frame.height);
}
```

OC

```objc
-(NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView{
    return self.tableData.count;
}

-(NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    return self.tableData[section].count;
}


-(UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    OrderPicModel *model = self.tableData[indexPath.section][indexPath.row];
    OrderPicsCollectionViewCell *picCell = [collectionView dequeueReusableCellWithReuseIdentifier:@"OrderPicsCollectionViewCell" forIndexPath:indexPath];
    picCell.imageView.image = [UIImage imageNamed:model.imageUrl];
    return picCell;
}

-(CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath{
    return CGSizeMake(self.collectionView.frame.size.width, self.collectionView.frame.size.height);
}

- (void)collectionView:(UICollectionView *)collectionView
  didEndDisplayingCell:(UICollectionViewCell *)cell
    forItemAtIndexPath:(NSIndexPath *)indexPath {
    // 获取当前显示的cell的下标
    NSIndexPath *firstIndexPath = [[self.collectionView indexPathsForVisibleItems] firstObject];
    // 赋值给记录当前坐标的变量
    self.pageControl.currentPage = firstIndexPath.row;
}
```

## 设置Header或Footer

### 生成头

我这里用的`xib`，对应的`class`文件如下

```swift
class QuestionBookHeader: UICollectionReusableView {
    @IBOutlet weak var titleLabel: UILabel!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    } 
}
```

### 注册

```swift
self.collectionView.registerNib(UINib(nibName: "QuestionBookHeader", bundle: nil), forSupplementaryViewOfKind: UICollectionElementKindSectionHeader, withReuseIdentifier: "QuestionBookHeader")
```

### 代理方法

```swift
//返回自定义HeadView或者FootView，我这里以headview为例
func collectionView(collectionView: UICollectionView, viewForSupplementaryElementOfKind kind: String, atIndexPath indexPath: NSIndexPath) -> UICollectionReusableView{
    
    let header = collectionView.dequeueReusableSupplementaryViewOfKind(UICollectionElementKindSectionHeader, withReuseIdentifier: "QuestionBookHeader", forIndexPath: indexPath) as! QuestionBookHeader;
    if(indexPath.section == 0){
        header.titleLabel.text = "我的分类"
    }else{
        header.titleLabel.text = "推荐分类"
    }
    
    return header
}
```