---

layout: post
title: android调用百度地图
description: android调用百度地图
keywords: android baidumap
categories: android

---


### 初始化地图

```java
//设置地图
mMapView = (MapView) findViewById(R.id.bmapsView); //获取地图控件引用
mBaiduMap = mMapView.getMap();
//普通地图
mBaiduMap.setMapType(BaiduMap.MAP_TYPE_NORMAL);
mBaiduMap.setMyLocationEnabled(true);//// 开启定位图层
mMapView.showZoomControls(false);
mMapView.showScaleControl(false);
//设置地图当前坐标位置
mBaiduMap.clear();//清除地图之前的覆盖物
LatLng cenpt = new LatLng(34.752242, 113.666634);
MapStatus mMapStatus = new MapStatus.Builder()
        .target(cenpt)
        .zoom(18)
        .build();
MapStatusUpdate mMapStatusUpdate = MapStatusUpdateFactory.newMapStatus(mMapStatus);
mBaiduMap.setMapStatus(mMapStatusUpdate);
```

### 监听地图状态变化

```java
//初始化状态监听
private void initStatus(){
    BaiduMap.OnMapStatusChangeListener statusChangeListener = new BaiduMap.OnMapStatusChangeListener() {
        /**
         * 手势操作地图，设置地图状态等操作导致地图状态开始改变。
         * @param status 地图状态改变开始时的地图状态
         */
        public void onMapStatusChangeStart(MapStatus status){
            Log.i("info", "onMapStatusChangeStart ");
        }
        /**
         * 地图状态变化中
         * @param status 当前地图状态
         */
        public void onMapStatusChange(MapStatus status){
            Log.i("info", "onMapStatusChange ");
        }
        /**
         * 地图状态改变结束
         * @param status 地图状态改变结束后的地图状态
         */
        public void onMapStatusChangeFinish(MapStatus status){
            LatLng centerLatLng = mBaiduMap.getMapStatus().target;
            //地址反向解析
            mSearch.reverseGeoCode(new ReverseGeoCodeOption().location(centerLatLng));

        }
    };

    mBaiduMap.setOnMapStatusChangeListener(statusChangeListener);

}
```

### 定位

#### 初始化定位

```java
//初始化定位
private void initLocation() {
    mLocationClient = new LocationClient(this.getApplicationContext());
    LocationClientOption option = new LocationClientOption();
    option.setLocationMode(tempMode);//可选，默认高精度，设置定位模式，高精度，低功耗，仅设备
    option.setCoorType(tempcoor);//可选，默认gcj02，设置返回的定位结果坐标系，
    option.setScanSpan(scanSpan);//可选，默认0，即仅定位一次，设置发起定位请求的间隔需要大于等于1000ms才是有效的
    option.setIsNeedAddress(true);//可选，设置是否需要地址信息，默认不需要
    option.setOpenGps(true);//可选，默认false,设置是否使用gps
    option.setLocationNotify(true);//可选，默认false，设置是否当gps有效时按照1S1次频率输出GPS结果
    option.setIgnoreKillProcess(true);//可选，默认true，定位SDK内部是一个SERVICE，并放到了独立进程，设置是否在stop的时候杀死这个进程，默认不杀死
    mLocationClient.setLocOption(option);
    mLocationClient.registerLocationListener(new BDLocationListener() {
        @Override
        public void onReceiveLocation(BDLocation bdLocation) {
            Log.i("loc", "地址获取成功 ");
            userLoc.setCity("郑州市");
            LatLng userlatLng = new LatLng(bdLocation.getLatitude(), bdLocation.getLongitude());
            userLoc.setLatLng(userlatLng);
            userLoc.setAddress(bdLocation.getAddrStr());
            userLoc.setName("我的位置");
            MapStatus mMapStatus = new MapStatus.Builder()
                    .target(userlatLng)
                    .zoom(18)
                    .build();
            MapStatusUpdate mMapStatusUpdate = MapStatusUpdateFactory.newMapStatus(mMapStatus);
            mBaiduMap.setMapStatus(mMapStatusUpdate);
            mSearch.reverseGeoCode(new ReverseGeoCodeOption().location(userlatLng));
        }
    });
}
```

#### 启动定位

```java
mLocationClient.start();//定位SDK start之后会默认发起一次定位请求，开发者无须判断isstart并主动调用request
mLocationClient.requestLocation();
```

### 获取坐标点的附近的poi

#### 初始化

```java
private void initSearch(){
    mSearch = GeoCoder.newInstance();
    OnGetGeoCoderResultListener listener = new OnGetGeoCoderResultListener() {
        public void onGetGeoCodeResult(GeoCodeResult result) {
            if (result == null || result.error != SearchResult.ERRORNO.NO_ERROR) {
                //没有检索到结果
            }
            //获取地理编码结果
        }

        @Override
        public void onGetReverseGeoCodeResult(ReverseGeoCodeResult result) {
            if (result == null || result.error != SearchResult.ERRORNO.NO_ERROR) {
                //没有找到检索结果
            }else{
                List<PoiInfo> poiList = result.getPoiList();
                listData.removeAll(listData);
                for (int i = 0; i <poiList.size() ; i++) {
                    PoiInfo poi = poiList.get(i);
                    ZJLoction loc  = new ZJLoction();
                    loc.setAddress(poi.address);
                    loc.setName(poi.name);
                    loc.setLatLng(poi.location);
                    loc.setCity(poi.city);
                    listData.add(loc);

                }
                mAdapter.notifyDataSetChanged();

            }
            //获取反向地理编码结果
        }
    };

    mSearch.setOnGetGeoCodeResultListener(listener);

}
```

#### 调用

```java
mSearch.reverseGeoCode(new ReverseGeoCodeOption().location(userlatLng));
```

### 关键字搜索

#### 初始化
```java
private void initPoiSearch(){
    mPoiSearch = PoiSearch.newInstance();
    OnGetPoiSearchResultListener poiListener = new OnGetPoiSearchResultListener(){
        public void onGetPoiResult(PoiResult result){
            //获取POI检索结果

            List<PoiInfo> poiList = result.getAllPoi();
            searchListData.removeAll(searchListData);
            if(poiList != null){
                for (int i = 0; i <poiList.size() ; i++) {
                    PoiInfo poi = poiList.get(i);
                    ZJLoction loc  = new ZJLoction();
                    loc.setAddress(poi.address);
                    loc.setName(poi.name);
                    loc.setLatLng(poi.location);
                    loc.setCity(poi.city);
                    searchListData.add(loc);

                }
            }

            searchAdapter.notifyDataSetChanged();
        }
        public void onGetPoiDetailResult(PoiDetailResult result){
            //获取Place详情页检索结果
        }
    };
    mPoiSearch.setOnGetPoiSearchResultListener(poiListener);
}
```

#### 调用

```java
mPoiSearch.searchInCity((new PoiCitySearchOption())
        .city("郑州")
        .keyword("学校")
        .pageNum(20));
```

### 关键字建议

#### 初始化

```java
private void initSuggestSearch(){
    mSuggestionSearch = SuggestionSearch.newInstance();
    OnGetSuggestionResultListener listener = new OnGetSuggestionResultListener() {
        public void onGetSuggestionResult(SuggestionResult res) {
            if (res == null || res.getAllSuggestions() == null) {
                return;
                //未找到相关结果
            }else{
                List<SuggestionResult.SuggestionInfo> suggestList = res.getAllSuggestions();

            }
            //获取在线建议检索结果
        }
    };
    mSuggestionSearch.setOnGetSuggestionResultListener(listener);
}
```


