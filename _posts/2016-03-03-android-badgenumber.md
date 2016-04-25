---

layout: post
title: Android 设置logo上的badgenumber
description: Android 设置logo上的badgenumber
keywords: android
category: android

---

## 简介

在Android系统中，众所周知**不支持BadgeNumber**，虽然第三方控件**BadgeView**可以实现**应用内的数字提醒**，但对于**系统的图标**，特别是app的logo图标很难实现数字标志，好在**小米**，**三星**，**索尼**手机支持发送**桌面快键提醒数字图标**

## 代码

下面上代码

```java
public class MainActivity extends Activity {
      //必须使用 作为启动页的Activity
      private final static String lancherActivityClassName = Welcome.class.getName();
      
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.common_listview_layout);
	}

	@Override
	protected void onResume() {
		super.onResume();
		sendBadgeNumber();
	}
    
    //设置badgenumber的入口方法
	private void sendBadgeNumber() {
		String number = "35";
		if (TextUtils.isEmpty(number)) {
			number = "";
		} else {
			int numInt = Integer.valueOf(number);
			number = String.valueOf(Math.max(0, Math.min(numInt, 99)));
		}

		if (Build.MANUFACTURER.equalsIgnoreCase("Xiaomi")) {
			sendToXiaoMi(number);
		} else if (Build.MANUFACTURER.equalsIgnoreCase("samsung")) {
			sendToSony(number);
		} else if (Build.MANUFACTURER.toLowerCase().contains("sony")) {
			sendToSamsumg(number);
		} else {
			Toast.makeText(this, "Not Support", Toast.LENGTH_LONG).show();
		}
	}
    
    //设置小米的badgenumber
	private void sendToXiaoMi(String number) {
		try {
			Class miuiNotificationClass = Class.forName("android.app.MiuiNotification");
			Object miuiNotification = miuiNotificationClass.newInstance();
			Field field = miuiNotification.getClass().getDeclaredField("messageCount");
			field.setAccessible(true);
			field.set(miuiNotification, number);// 设置信息数-->这种发送必须是miui 6才行
		} catch (Exception e) {
		    e.printStackTrace();
		    //miui 6之前的版本
    		    Intent localIntent = new Intent("android.intent.action.APPLICATION_MESSAGE_UPDATE");
    		    localIntent.putExtra("android.intent.extra.update_application_component_name",getPackageName() + "/"+ lancherActivityClassName );
    		    localIntent.putExtra("android.intent.extra.update_application_message_text",number);
    		    sendBroadcast(localIntent);
		}

	}
    
    //设置索尼的badgenumber
	private void sendToSony(String number) {
		boolean isShow = true;
		if ("0".equals(number)) {
			isShow = false;
		}
		Intent localIntent = new Intent();
		localIntent.putExtra("com.sonyericsson.home.intent.extra.badge.SHOW_MESSAGE",isShow);//是否显示
		localIntent.setAction("com.sonyericsson.home.action.UPDATE_BADGE");
		localIntent.putExtra("com.sonyericsson.home.intent.extra.badge.ACTIVITY_NAME",lancherActivityClassName );//启动页
		localIntent.putExtra("com.sonyericsson.home.intent.extra.badge.MESSAGE", number);//数字
		localIntent.putExtra("com.sonyericsson.home.intent.extra.badge.PACKAGE_NAME",getPackageName());//包名
		sendBroadcast(localIntent);

		Toast.makeText(this, "Sony," + "isSendOk", Toast.LENGTH_LONG).show();
	}

    //设置三星的badgenumber
	private void sendToSamsumg(String number) 
	{
		Intent localIntent = new Intent("android.intent.action.BADGE_COUNT_UPDATE");
		localIntent.putExtra("badge_count", number);//数字
		localIntent.putExtra("badge_count_package_name", getPackageName());//包名
		localIntent.putExtra("badge_count_class_name",lancherActivityClassName ); //启动页
		sendBroadcast(localIntent);
		Toast.makeText(this, "Samsumg," + "isSendOk", Toast.LENGTH_LONG).show();
	}
}
```

注意**lancherActivityClassName** 必须被配置为 启动页对应得Activity   
也就是包含`<category android:name="android.intent.category.LAUNCHER" />`的Activity

## 对应的XML

```xml
<activity
            android:name="com.sample.activites.Welcome"
            android:configChanges="locale|keyboard|screenSize"
            android:label="@string/app_name"
            android:screenOrientation="portrait" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.CREATE_SHORTCUT" />
            </intent-filter>
</activity>
```