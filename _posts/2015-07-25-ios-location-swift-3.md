---

layout: post
title: iOS地图开发3-原生封装的调用(swift)
description:  iOS地图开发3(swift)
keywords:  地图
categories: swift ios

---

### 初始化地图
定义可以拖控件连线或者代码定义  

    //设置地图类型
    appMapView.mapType = MKMapType.Standard;
    //是否显示自己位置，设置true会一直定位
    appMapView.showsUserLocation = false;
    //是否允许缩放
    appMapView.zoomEnabled = true;
    //设置中心点
    var pos:CLLocationCoordinate2D = CLLocationCoordinate2D(latitude: 34.8214611335501, longitude: 113.669539617823);
    var viewRegion = MKCoordinateRegionMakeWithDistance(pos,500, 500);//以pos为中心，显示1000米
    appMapView.region = appMapView.regionThatFits(viewRegion);
        
### 定位成功的代理方法中再次设置使用户坐标居中

    var viewRegion = MKCoordinateRegionMakeWithDistance(gcj,500, 500);//以pos为中心，显示2000米
    appMapView.setRegion(appMapView.regionThatFits(viewRegion), animated: false);

其中的gcj和上一步的pos都是`火星坐标`

### 添加大头针
    var point = MKPointAnnotation();
    point.coordinate = gcj;
    point.title = name as String;
    self.appMapView.addAnnotation(point);