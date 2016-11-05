---

layout: post
title: iOS UITableView 滑动到底部加载更多数据
description: iOS UITableView 滑动到底部加载更多数据
keywords: ios
category: ios

---

## 前言

很多APP都是滑动到底部时点击加载更多才会加载数据，这样用户体验就会有间断感，所以我们想用户看到最后时自动加载数据 怎么做呢

有人会说用一下的这个方法

```objc
- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath{

}
```

这种方法`没法实现`的 这种方法确实能判断滑动到最后  但是加载数据时 这个方法又回被调用 造成无限循环 所以不建议使用 

这里我使用的是这个方法

```objc
- (void)scrollViewDidScroll:(UIScrollView *)scrollView{

}
```

## 具体代码

定义一个全局变量  
`@property(nonatomic)bool isLoading;`  
来标示是否正在加载数据  
然后根据滑动的高度做判断 看是否滑动到了底部

```objc
- (void)scrollViewDidScroll:(UIScrollView *)scrollView{
    CGPoint offset = scrollView.contentOffset;
    CGRect bounds = scrollView.bounds;
    CGSize size = scrollView.contentSize;
    UIEdgeInsets inset = scrollView.contentInset;
    CGFloat scrollViewHeight = bounds.size.height;
    CGFloat currentOffset = offset.y + scrollViewHeight - inset.bottom;
    CGFloat maximumOffset = size.height;
    
    CGFloat minSpace = 5;
    CGFloat maxSpace = 10;
    bool isNeedLoadMore = false;
    //上拉加载更多
    //tableview 的 content的高度 小于 tableview的高度
    if(scrollViewHeight>=maximumOffset){
        CGFloat space = currentOffset - scrollViewHeight;
        if(space>minSpace && space <maxSpace){
            isNeedLoadMore = true;
        }
    }else{
        //当currentOffset与maximumOffset的值相差很小时，说明scrollview已经滑到底部了。
        CGFloat space = currentOffset - maximumOffset;
        if(space>minSpace && space <maxSpace){
            isNeedLoadMore = true;
        }
    }
    
    if(!self.isLoading && isNeedLoadMore){
        self.isLoading = true;
        NSLog(@"-->加载更多数据");
        [self loadMore];
    }
}
```

但是有这样一个问题  如果已经确认没有更多数据的时候 我们会在`加载更多`的方法里直接设置`self.isLoading = false;`  
但是由于视图动画还在滑动就会反复触发`加载更多`的方法  
解决方法就是延迟设置`self.isLoading = false;`   

```objc
[SVProgressHUD showErrorWithStatus:@"没有更多数据了"];
dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
  [SVProgressHUD dismiss];
  self.isLoading = false;
});
```

这样就能确保不会多次加载了