---

layout: post
title: iOS地图开发1-定位(swift)
description:  iOS地图开发1(swift)
keywords:  定位
categories: swift ios

---

### 概述

关于ios中地图定位相关的开发可以分两块，一块为调用ios的定位获取GPS坐标以及坐标-->地址，地址-->坐标，另一块就是调用苹果对地图的封装，也可以调用高德或者百度地图的SDK，不过引用将近10M的库，但是功能上要比直接调用系统封装的要强大的多，所以我建议app里基本上只要求定位与地图上显示的，就直接用原生的封装，自定义较多的，比如设置定位点覆盖物的图标就引用第三方的


### 坐标系

因为gps，高德，百度用的坐标系都是不一样的所以开发上就要注意得到的到底是哪个坐标系，以及坐标系之间的转换，三种标准如下所说：

+ `WGS-84`：是国际标准，`GPS坐标`（Google Earth使用、或者GPS模块）
+ `GCJ-02`：中国坐标偏移标准(又称火星坐标)，`国内的Google Map`、`高德`、`腾讯`使用
+ `BD-09`： 百度坐标偏移标准，`Baidu Map`使用

#### 坐标之间的关系 
 
GCJ02是在WGS84的基础上进行偏移得到的  
BD09是在GCJ02的基础上又一次处理得到的

可以相互转换的关系
WGS84 <---> GCJ02 <---> BD09  
以上的转化关系都可以找到计算公式进行转换但是一下的两种没有
WGS84 ---> BD09   BD09 ---> WGS84就只能间接转换 转换后的偏移会有点大
具体的转换代码下文给出

### 具体代码

（1）实现代理`CLLocationManagerDelegate`    
（2）定义全局变量地址管理与坐标解析  

        let locationManager:CLLocationManager = CLLocationManager()
        let geocoder:CLGeocoder = CLGeocoder();
        
（3）初始化设置

        locationManager.delegate = self
        //精确到10米,距离过滤器，定义了设备移动后获得位置信息的最小距离
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        
        //十米定位一次
        locationManager.distanceFilter=10.0;
        if((UIDevice.currentDevice().systemVersion as NSString).doubleValue>8.0){
            locationManager.requestAlwaysAuthorization()
        }
（4）实现代理的两个方法

    func locationManager(manager: CLLocationManager!, didUpdateLocations locations: [AnyObject]!) {
        showNoticeWait(text: "地图解析中...");
        if(locations.count>0){
            var location:CLLocation = locations[locations.count-1] as! CLLocation
            if (location.horizontalAccuracy > 0) {
                self.locationManager.stopUpdatingLocation()
                var latitude=location.coordinate.latitude;
                var longitude=location.coordinate.longitude
                var gcj=ZJ_MapKits().transformFromWGSToGCJ(CLLocationCoordinate2D(latitude: latitude, longitude: longitude))
                geocoder.reverseGeocodeLocation(CLLocation(latitude: gcj.latitude, longitude: gcj.longitude), completionHandler: {
                    (placemarks,error)->Void in
                    if(nil != error){
                        if((error as NSError).code == 2){
                            self.showNoticeErr("地址获取失败！", time: 1.2);
                        }
                        
                    }else if(nil != placemarks && placemarks.count > 0){
                        var place:CLPlacemark = placemarks[0] as! CLPlacemark;
                        var name = place.name as NSString;
                        println(place.country);             //国家
                        println(place.administrativeArea);  //省
                        println(place.locality);            //市
                        println(place.subLocality);         // 区
                        println(place.thoroughfare);       // 街道
                        println(place.subThoroughfare); // 子街道
                        println(place.name);
                    }
                });
                //这是设置超时时间
                ZJ_Func.delay(10, closure: {
                    if(self.geocoder.geocoding){
                        self.geocoder.cancelGeocode();
                        self.showNoticeErr("地址解析超时！", time: 1.2);
                    }
                });
            }
        }
        
    }
    
    func locationManager(manager: CLLocationManager!, didFailWithError error: NSError!) {
        println(error)
        
    }
    
（5）注意点  

+  解析地址是传入的坐标不是GPS定位的坐标，而是火星坐标
+  ios8必须在配置文件上配置定位提示语的字段，info.plist中添加`NSLocationAlwaysUsageDescription`，否则是不会进行定位的，也不会调用代理方法




