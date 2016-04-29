---

layout: post
title: iOS GCD编程之dispatch
description: GCD编程的核心就是dispatch队列，block的执行最终都会放进某个队列中去进行，它类似NSOperationQueue但更复杂也更强大，并且可以嵌套使用。所以说，结合block实现的GCD，把函数闭包（Closure）的特性发挥得淋漓尽致
keywords: ios
category: ios

---

## 简介

为何使用GCD

GCD提供很多超越传统多线程编程的优势：

+ `易用`: GCD比之thread跟简单易用。  
由于GCD基于work unit而非像thread那样基于运算，所以GCD可以控制诸如等待任务结束、监视文件描述符、周期执行代码以及工作挂起等任务。   
基于block的血统导致它能极为简单得在不同代码作用域之间传递上下文。
+ `效率`: GCD被实现得如此轻量和优雅，使得它在很多地方比之专门创建消耗资源的线程更实用且快速。  
这关系到易用性：导致GCD易用的原因有一部分在于你可以不用担心太多的效率问题而仅仅使用它就行了。
+ `性能`: GCD自动根据系统负载来增减线程数量，这就减少了上下文切换以及增加了计算效率。  

GCD编程的核心就是`dispatch队列`，`block`的执行最终都会放进某个队列中去进行，它类似`NSOperationQueue`但更复杂也更强大，并且可以嵌套使用。所以说，结合`block`实现的`GCD`，把函数`闭包（Closure）`的特性发挥得淋漓尽致

总而言之  就是`dispatch队列` `执行` `block`

block就不用说了  

下面就说一下`dispatch队列`的创建 和 如何执行block

## 队列的创建

dispatch队列的生成有三种方式

+ `dispatch_get_main_queue()`
+ `dispatch_get_global_queue(long identifier, unsigned long flags)`
+ `dispatch_queue_create(const char *label, dispatch_queue_attr_t attr)`


这三种方式又可以分为两大类  

+ 在`主线程`执行block的`dispatch_get_main_queue`  
+ 在`其它线程`执行block的`dispatch_get_global_queue`和`dispatch_queue_create`

也可以分为`串行`和`并行`两大类

下面就详细介绍一下各方法

### 1) 主线程队列 

```objc
dispatch_queue_t mainQueue = dispatch_get_main_queue();
```

获得`主线程`的dispatch队列，它`没有参数`，实际是一个`串行队列`。`无法控制`主线程`dispatch队列的执行继续或中断`。

### 2) 全局队列

```objc
dispatch_queue_t highQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0);
dispatch_queue_t dafaultQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
dispatch_queue_t lowQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_LOW, 0);
dispatch_queue_t backgroundQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0);
```

+ 获得程序进程缺省产生的`并行队列`，可设定优先级来选择`高`>`默认`>`低`>`后台`四个个优先级队列。  
+ 它的第二个参数是系统预留的，现在还没用，以后有用时 值是非0的，所以现在都设置为0 
+ 由于是系统默认生成的，所以`无法调用``dispatch_resume()`和`dispatch_suspend()`来控制执行继续或中断。  
+ 需要注意的是，三个队列不代表三个线程，可能会有更多的线程。并发队列可以根据实际情况来自动产生合理的线程数，也可理解为dispatch队列实现了一个线程池的管理，对于程序逻辑是透明的。  
+ 也就是说它是内置的一个比较NB的`并行队列`，能安装优先级来处理并行block

### 3) 自定义队列

```objc
dispatch_queue_t mySerialQueue = dispatch_queue_create("cn.psvmc.task1", DISPATCH_QUEUE_SERIAL);//串行
dispatch_queue_t myConcurrentQueue = dispatch_queue_create("cn.psvmc.task2", DISPATCH_QUEUE_CONCURRENT);//并行
```

第一个参数是队列的名称，不能重复  
第二个参数来指定队列是`串行(DISPATCH_QUEUE_SERIAL)`还是`并行(DISPATCH_QUEUE_CONCURRENT)` 设置为nil时 为串行

当队列为串行时 队列中的block按照先进先出（FIFO）的顺序去执行，实际上为单线程执行

当队列为并行时，没有固定的顺序，为多线程执行


## 队列执行

### 基本 

`dispatch_async` 和 `dispatch_sync`

```objc
//异步执行block，函数立即返回
dispatch_async(queue, ^{
　　//block具体代码
}); 

//同步执行block，会阻塞当前线程, 直到queue完成了你给的task
//编译器会根据实际情况优化代码，所以有时候你会发现block其实还在当前线程上执行，并没用产生新线程。
dispatch_sync(queue, ^{
　　//block具体代码
}); 
```

实际编程经验告诉我们，尽可能避免使用`dispatch_sync`，嵌套使用时还容易引起程序`死锁`。

#### 死锁例子

+ 死锁例子1

如果`queue1`是一个`串行队列`的话，这段代码立即产生死锁：

```objc
dispatch_sync(queue1, ^{

    dispatch_sync(queue1, ^{
　　　　......
    });
　　......
　});
```

+ 死锁例子2

主线程中执行会死锁

```objc
dispatch_sync(dispatch_get_main_queue(), ^{
　　......
}); 
```

#### 实际应用

那实际运用中，一般可以用`dispatch`这样来写，常见的网络请求数据多线程执行模型：

```objc
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
　　//子线程中开始网络请求数据
　　//更新数据模型
　　dispatch_sync(dispatch_get_main_queue(), ^{
　　　　//在主线程中更新UI代码
　　});
});
```

#### 多线程操作数据库

`dispatch`队列是线程安全的，可以利用串行队列实现锁的功能。比如多线程写同一数据库，需要保持写入的顺序和每次写入的完整性，简单地利用串行队列即可实现：

```objc
dispatch_queue_t queue1 = dispatch_queue_create("com.dispatch.writedb", DISPATCH_QUEUE_SERIAL);

- (void)writeDB:(NSData *)data{
　　dispatch_async(queue1, ^{
　　　　//write database
　　});
} 
```

下一次调用`writeDB:`必须等到上次调用完成后才能进行，保证`writeDB:`方法是线程安全的。

### 重复执行  

`dispatch_apply`

```objc
//重复执行block，需要注意的是这个方法是同步返回，也就是说等到所有block执行完毕才返回，如需异步返回则嵌套在dispatch_async中来使用。
//多个block的运行是否并发或串行执行也依赖queue的是否并发或串行。
void dispatch_apply(size_t iterations, dispatch_queue_t queue, void (^block)(size_t)); 
```

### 随后执行 

`dispatch_barrier_async` 和 `dispatch_barrier_sync`

```objc
//这个函数可以设置同步执行的block，它会等到在它加入队列之前的block执行完毕后，才开始执行。
//在它之后加入队列的block，则等到这个block执行完毕后才开始执行。
void dispatch_barrier_async(dispatch_queue_t queue, dispatch_block_t block); 

//同上，除了它是同步返回函数
void dispatch_barrier_sync(dispatch_queue_t queue, dispatch_block_t block); 
```

### 只执行一次   

`dispatch_once`

```objc
static dispatch_once_t onceToken;
for (int i = 0; i<10; i++) {
    // 一次性执行：
    dispatch_once(&onceToken, ^{
        NSLog(@"dispatch_once:%d",i);
    });
}
```

上面的代码只会执行一次  打印

```objc
dispatch_once:0
```
    
### 延迟执行  

`dispatch_after`

```objc
//延迟执行block
void dispatch_after(dispatch_time_t when, dispatch_queue_t queue, dispatch_block_t block); 
```

例子

```objc
 // 延迟2秒执行：
double delayInSeconds = 2.0;
dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, delayInSeconds * NSEC_PER_SEC);
dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
     // code to be executed on the main queue after delay
});
```

### 调度执行  

`dispatch_set_target_queue`

dispatch队列的一个很有特色的函数：

```objc
void dispatch_set_target_queue(dispatch_object_t object, dispatch_queue_t queue);
```

它会把需要执行的任务对象指定到不同的队列中去处理，这个任务对象可以是`dispatch队列`，也可以是`dispatch源`。而且这个过程可以是动态的，可以实现队列的动态调度管理等等。  
比如说有两个队列`dispatchA`和`dispatchB`，这时把`dispatchA`指派到`dispatchB`：

```objc
dispatch_set_target_queue(dispatchA, dispatchB);
```

那么`dispatchA`上还未运行的`block`会在`dispatchB`上运行。  
这时如果暂停`dispatchA`运行：

```objc
dispatch_suspend(dispatchA);
```

则只会暂停`dispatchA`上原来的`block`的执行，`dispatchB`的`block`则不受影响。  
而如果暂停`dispatchB`的运行，则会暂停`dispatchA`的运行。

这里只简单举个例子，说明dispatch队列运行的灵活性，在实际应用中你会逐步发掘出它的潜力。

`dispatch队列`不支持cancel（取消），没有实现`dispatch_cancel()`函数，不像`NSOperationQueue`，不得不说这是个小小的缺憾。

## 分组执行

我们的应用不是简单的同步也异步的运行，应用经常是混合的  
比如我们要`task1` `task2`都运行完成后才能异步运行`task3` `task4`我们该怎么做呢？这里我们可以引入`group`的概念

```objc
dispatch_queue_t dafaultQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
dispatch_group_t group = dispatch_group_create();

// Add a task to the group
dispatch_group_async(group, dafaultQueue, ^{
    printf("task 1 \n");
});
dispatch_group_async(group, dafaultQueue, ^{
    printf("task 2 \n");
});

//等待之前执行完成
dispatch_group_wait(group, DISPATCH_TIME_FOREVER);
dispatch_release(group);

group = dispatch_group_create();
// Add a task to the group
dispatch_group_async(group, dafaultQueue, ^{
    printf("task 3 \n");
});
dispatch_group_async(group, dafaultQueue, ^{
    printf("task 4 \n");
});

dispatch_group_wait(group, DISPATCH_TIME_FOREVER);
dispatch_release(group);
```

有时候我们也可以为queue定义一个结束函数  

`dispatch_set_finalizer_f` 是在`dispatch_release`时候被调用

```objc
dispatch_queue_t serialQueue = dispatch_queue_create("com.example.CriticalTaskQueue", NULL);
if (serialQueue){
    dispatch_set_context(serialQueue, self);
    dispatch_set_finalizer_f(serialQueue, &myFinalizerFunction);
}
    
dispatch_group_t group = dispatch_group_create();
    
// Add a task to the group
dispatch_group_async(group, serialQueue, ^{
    printf("task 1 \n");
});
    
dispatch_group_async(group, serialQueue, ^{
    printf("task 2 \n");
});

dispatch_group_wait(group, DISPATCH_TIME_FOREVER);  
dispatch_release(group);
dispatch_release(serialQueue);
```

## 不再使用锁(Lock)

用户队列可以用于替代锁来完成同步机制。在传统多线程编程中，你可能有一个对象要被多个线程使用，你需要一个锁来保护这个对象：

```objc
NSLock *lock;
```

访问代码会像这样：

```objc
- (id)something { 
   id localSomething; 
   [lock lock]; 
   localSomething = [[something retain] autorelease]; 
   [lock unlock]; 
   return localSomething; 
} 
 
- (void)setSomething:(id)newSomething { 
   [lock lock]; 
   if(newSomething != something) 
   { 
       [something release]; 
       something = [newSomething retain]; 
       [self updateSomethingCaches]; 
   } 
   [lock unlock]; 
} 
```

使用GCD，可以使用queue来替代：

```objc
dispatch_queue_t queue;
```

要用于同步机制，queue必须是一个用户队列，而非全局队列，所以使用`dispatch_queue_create`初始化一个。  
然后可以用`dispatch_async` 或者 `dispatch_sync`将共享数据的访问代码封装起来：

```objc
- (id)something { 
    __block id localSomething; 
    dispatch_sync(queue, ^{ 
        localSomething = [something retain]; 
    }); 
    return [localSomething autorelease]; 
} 
 
- (void)setSomething:(id)newSomething { 
    dispatch_async(queue, ^{ 
        if(newSomething != something) 
        { 
            [something release]; 
            something = [newSomething retain]; 
            [self updateSomethingCaches]; 
        } 
    }); 
} 
```

值得注意的是`dispatch_queue`是非常轻量级的，所以你可以大用特用，就像你以前使用`lock`一样。

现在你可能要问：“这样很好，但是有意思吗？我就是换了点代码办到了同一件事儿。”

实际上，使用GCD途径有几个好处：

+ **平行计算**: 注意在第二个版本的代码中， `-setSomething:`是怎么使用`dispatch_async`的。调用 `-setSomething:`会立即返回，然后这一大堆工作会在后台执行。如果`updateSomethingCaches`是一个很费时费力的任务，且调用者将要进行一项处理器高负荷任务，那么这样做会很棒。
+ **安全**: 使用GCD，我们就不可能意外写出具有不成对Lock的代码。在常规Lock代码中，我们很可能在解锁之前让代码返回了。使用GCD，队列通常持续运行，你必将归还控制权。
+ **控制**: 使用GCD我们可以挂起和恢复`dispatch_queue`，而这是基于锁的方法所不能实现的。我们还可以将一个用户队列指向另一个`dspatch_queue`，使得这个用户队列继承那个`dspatch_queue`的属性。使用这种方法，队列的优先级可以被调整——通过将该队列指向一个不同的全局队列，若有必要的话，这个队列甚至可以被用来在主线程上执行代码。
+ **集成**: GCD的事件系统与`dspatch_queue`相集成。对象需要使用的任何事件或者计时器都可以从该对象的队列中指向，使得这些句柄可以自动在该队列上执行，从而使得句柄可以与对象自动同步。