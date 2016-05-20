---

layout: post
title: android listview数据加载
description: android listview数据加载
keywords: android listview
categories: android

---


### 大致思想
```java
private List<ZJLoction> searchListData = new ArrayList<ZJLoction>();
private ListView searchListView;
private AddressSearchAdapter searchAdapter;
```

如上面代码所示，定义了三个对象  
`searchListData`是`数据源`  
`searchListView`是`数据显示的地方`  
`searchAdapter`是`连接数据源和展示的桥梁`   
可以这样比喻  
`searchListData`是`货源`   
`searchListView`是`货仓`  
`searchAdapter`是`拉货的车`    
要建立之间的关系就要做如下操作  

```java
searchListView = (ListView)findViewById(R.id.address_list_search);
searchAdapter = new AddressSearchAdapter(mAppContext);
searchListView.setAdapter(searchAdapter);      
```

而要`更新数据` 也就是要通知`拉货的车` 代码如下

```java
searchAdapter.notifyDataSetChanged();
```

### 自定义Adapter

```java
private  class AddressSearchAdapter extends BaseAdapter {

    private final LayoutInflater mInflater;
    private final Context mContext;
    private AddressSearchAdapter(Context context) {
        mContext = context;
        mInflater = LayoutInflater.from(mContext);
    }

    @Override
    public int getCount() {
        return searchListData.size();
    }

    @Override
    public Object getItem(int position) {
        return listData.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        ZJLoction location = searchListData.get(position);
        AddressItem addressItem = null;
        if(convertView == null){
            convertView = mInflater.inflate(R.layout.address_item,null);
            addressItem = new AddressItem(convertView);
            convertView.setTag(addressItem);
        }else{
            addressItem =  (AddressItem)convertView.getTag();
        }
        addressItem.titleView.setText(location.getName());
        addressItem.detailView.setText(location.getAddress());
        return convertView;
    }
}

private  class AddressItem{

    TextView titleView;
    TextView detailView;
    public AddressItem(View convertView) {
        titleView = (TextView)convertView.findViewById(R.id.address_item_title);
        detailView = (TextView)convertView.findViewById(R.id.address_item_detail);
    }
}
```

通过判断`convertView`是否为空来复用



