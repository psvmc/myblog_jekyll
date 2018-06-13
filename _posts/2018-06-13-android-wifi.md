---
layout: post
title: Android开发中Wi-Fi处理
description: Android开发中Wi-Fi处理
keywords: android
categories: android

---



## 相关知识

### 涉及到的权限

这里需要说明的是

- `android.permission.ACCESS_FINE_LOCATION`这个权限在Android6.0以上是必须的 

  因为在Android6.0以上必须开启位置获取位置权限 才能获取WI-FI列表 否则列表会为空

- `android.permission.WRITE_SECURE_SETTINGS`这个权限在Android6.0以上是系统权限 

  普通应用是无法获取的  所以其实不用引 如果APP定制的Android系统在6.0以下可以引  用来修改配置

```bash
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/> 
<uses-permission android:name="android.permission.WRITE_SECURE_SETTINGS"/>
```



### 涉及到的类

- **WifiManager** 入口类，Wifi相关的所有操作均通过此类

- **WifiConfiguration** 进行热点连接时，通过该类为热点创建一个配置，并由WifiManager以此配置生成一个networkId，后开始连接；

  此外，也用于表示一个已连接的热点在本地的记录

- **WifiInfo** 表示当前的wifi网络连接信息

- **ScanResult** 扫描到的热点信息类，每一个对象代表一个扫描到的热点，其中包括若干该热点信息



### 相关属性及概念

- networkId——连接某个wifi热点时，系统会为该热点生成一个networkId，在同一设备上，不同热点的networkId是唯一的，通常情况下为大于0的整数，在某些设备上，恢复出厂后连接的第一个热点networkId为0
- ssid——wifi热点名称，可重复
- bssid——类似于mac地址，但并不是路由器的mac地址，与ssid一起可作为热点的唯一标识，同时该属性每个热点唯一不重复
- 亲属热点——（本文设定概念）ssid相同，但bssid不同的所有热点，互为亲属热点，android设备会将ssid相同的所有亲属热点当做一个热点进行处理

**ScanResult** 和 **WifiInfo** 中的ssid是有差异的 

+ **WifiInfo**中的ssid是包括了双引号的，如`"CCMC"`
+ **ScanResult**中的ssid是不包括双引号的，如`CCMC`



### 热点加密类型

目前，常见及需要处理的热点，包括以下3大类：

- open——开放型网络，即无加密，可直接连接
- wep——采用wep加密类型的热点，已过时，不安全，容易被破解，目前使用率已不足10%
- wpa/wpa2——目前使用最广泛，相对最安全，破解难度最大的加密类型

wps（wifi protected setup）：是为了进一步增强wpa热点及简化连接过程的技术，不属于加密类型。



获取加密类型的方法

```kotlin
var capabilities = scanResult!!.capabilities.toLowerCase()
var encryptType = ZJWifiUtil.TYPE_NO_PWD
if (capabilities.contains("wpa")) {
	encryptType = ZJWifiUtil.TYPE_WPA
} else if (capabilities.contains("wep")) {
	encryptType = ZJWifiUtil.TYPE_WEP
} else {
	encryptType = ZJWifiUtil.TYPE_NO_PWD
}
```



### 涉及到的广播

- **WifiManager.WIFI_STATE_CHANGED_ACTION** ——wifi开关变化广播
- **WifiManager.SCAN_RESULTS_AVAILABLE_ACTION** ——热点扫描结果通知广播
- **WifiManager.SUPPLICANT_STATE_CHANGED_ACTION** ——热点连接结果通知广播
- **WifiManager.NETWORK_STATE_CHANGED_ACTION** ——网络状态变化广播（与上一广播协同完成连接过程通知）



## 开发细节

### 1 获取WifiManager实例

```java
wifiManager = (WifiManager) context
                    .getSystemService(Context.WIFI_SERVICE);
```

### 2 打开及关闭wifi

```java
wifiManager.setWifiEnabled(true)
```

true表示打开wifi开关，false表示关闭，该方法的返回值仅代表操作是否成功，不代表wifi状态的变化； 
通过监听广播`WifiManager.WIFI_STATE_CHANGED_ACTION` ，来判断真正的wifi开关变化,该广播带有一个int型的值来表示wifi状态：

```java
int wifistate = intent.getIntExtra(
					WifiManager.EXTRA_WIFI_STATE,
                	WifiManager.WIFI_STATE_DISABLED
                );
switch (wifistate) {
    case WifiManager.WIFI_STATE_DISABLED:
        //wifi已关闭
        break;
    case WifiManager.WIFI_STATE_ENABLED:
        //wifi已打开
        break;
    case WifiManager.WIFI_STATE_ENABLING:
        //wifi正在打开
        break;
    default:
        break;
}
```

可以看到，该操作其实是一个异步操作，一般耗时在1~3秒之间。

### 3 周围热点扫描

收到WI-FI已打开的广播后 开始扫描

```java
wifiManager.startScan()
```

以上方法为开始扫描的接口，其返回值代表操作是否成功，扫描结果通过另外一个接口获取：

```java
List<ScanResult> results = wifiManager.getScanResults();
```

一般在主动调用startScan之后，大概2秒左右，会收到`WifiManager.SCAN_RESULTS_AVAILABLE_ACTION)`广播通知，该广播包括一个boolean型的额外参数：

```java
boolean isScanned = intent.getBooleanExtra(WifiManager.EXTRA_RESULTS_UPDATED, true);
```

上面的值表示，扫描结果是否已可用，若可用，则可以使用getScanResults获取结果，在结果没有就绪之前，会返回null。

**一般系统本身会调用startScan接口，而该操作相对比较耗电，因此在应用中要酌情使用，并不需要频繁调用。**

### 4 获取已连接过的热点

所有已经连接过的热点，都会存在本地一个文件中,一般路径为/data/misc/wifi/wpa_supplicant.conf(查看需root）,而在程序中获取则通过以下接口：

```java
List<WifiConfiguration> configurations = wifiManager.getConfiguredNetworks();
```

获取到的WiFiConfiguration对象中，只有ssid和networkId是一定有的，可以用于直接连接该热点，其他信息如bssid，密钥等信息基本都是空的。（如何直接连接热点，下文叙述）

### 5 获取当前wifi连接信息

```java
WifiInfo info = wifiManager.getConnectionInfo();
```

该对象代表当前已连接的热点，信息，无连接时返回null； 
 该对象可获取包括ssid，bssid，networkId等信息，而ssid是包括了双引号的，如“CCMC”，在之前的扫描结果ScanResult中，ssid并不带双引号。

### 6 连接指定热点

连接一个未连接过的热点时，需3步： 
 1）创建一个配置：WifiConfiguration

```java
public WifiConfiguration createConfiguration(AccessPoint ap) {
    String SSID = ap.getSsid();
    WifiConfiguration config = new WifiConfiguration();
    config.SSID = "\"" + SSID + "\"";

    String encryptionType = ap.getEncryptionType();
    String password = ap.getPassword();
    if (encryptionType.contains("wep")) {
        /**
         * special handling according to password length is a must for wep
         */
        int i = password.length();
        if (((i == 10 || (i == 26) || (i == 58))) && (password.matches("[0-9A-Fa-f]*"))) {
            config.wepKeys[0] = password;
        } else {
            config.wepKeys[0] = "\"" + password + "\"";
        }
        config.allowedAuthAlgorithms
                .set(WifiConfiguration.AuthAlgorithm.SHARED);
        config.allowedAuthAlgorithms.set(WifiConfiguration.AuthAlgorithm.OPEN);
        config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE);
        config.wepTxKeyIndex = 0;
    } else if (encryptionType.contains("wpa")) {
        config.preSharedKey = "\"" + password + "\"";
        config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
    } else {
        config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE);
    }
    return config;
}
```


 2）生成一个networkId

```java
WifiConfiguration config = createConfiguration(ap);

/**
 * networkId is bigger than 0 in most time, 0 in few time and smaller than 0 in no time
 */
int networkId = networkId = wifiManager.addNetwork(config);123456
```

**一般情况下，对一个已经连接过的热点（本地有连接记录），进行以上操作时，在api21及以上会返回一个小于0的networkId，此时，进行下一步连接是没有意义的，获得一个小于0的networkId已经表示连接失败。**

3）开始连接

```java
wifiManager.enableNetwork(networkId, true)
```

对于已经连接过的热点，通过小项4 中的方式，获取到该热点的networkId之后，可直接进行第三步的连接，无需1）2）； 
 若有必要进行12步（如尝试一个新密码，因为即使使用了错误的密码连接，系统还是会为本次连接生成一个本地记录），则必须在一开始，将本地记录remove掉，remove操作将在下文介绍。

**连接结果通过两个广播反馈：**

+ **WifiManager.NETWORK_STATE_CHANGED_ACTION**
+ **WifiManager.SUPPLICANT_STATE_CHANGED_ACTION**

其中，密码错误的结果通知需通过第二个广播判断：

```java
int error = intent.getIntExtra(WifiManager.EXTRA_SUPPLICANT_ERROR, 0);
if (WifiManager.ERROR_AUTHENTICATING == error) {
    //密码错误,认证失败
}
```

其他结果均通过第一个广播接收：

```java
if (intent.getAction().equals(WifiManager.NETWORK_STATE_CHANGED_ACTION)) {
    NetworkInfo info = intent.getParcelableExtra(WifiManager.EXTRA_NETWORK_INFO);
    if (null != info) {
        NetworkInfo.DetailedState state = info.getDetailedState();
    }
}
```

```java
public enum DetailedState {
        /** Ready to start data connection setup. */
        IDLE,
        /** Searching for an available access point. */
        SCANNING,
        /** Currently setting up data connection. */
        CONNECTING,
        /** Network link established, performing authentication. */
        AUTHENTICATING,
        /** Awaiting response from DHCP server in order to assign IP address information. */
        OBTAINING_IPADDR,
        /** IP traffic should be available. */
        CONNECTED,
        /** IP traffic is suspended */
        SUSPENDED,
        /** Currently tearing down data connection. */
        DISCONNECTING,
        /** IP traffic not available. */
        DISCONNECTED,
        /** Attempt to connect failed. */
        FAILED,
        /** Access to this network is blocked. */
        BLOCKED,
        /** Link has poor connectivity. */
        VERIFYING_POOR_LINK,
        /** Checking if network is a captive portal */
        CAPTIVE_PORTAL_CHECK
    }
```

### 7 断开当前wifi连接

```java
wifiManager.disconnect()
```

以上接口返回值代表当前操作是否成功，操作的最终结果，会在两个广播中有所反馈： 

+ WifiManager.SUPPLICANT_STATE_CHANGED_ACTION 
+ WifiManager.NETWORK_STATE_CHANGED_ACTION

并且断开成功的广播会发送若干次。

### 8 遗忘一个已连接过的热点

```java
boolean isRemoved = wifiManager.removeNetwork(networkId)
```

返回值代表操作是否成功，该操作在api21以上的系统中，成功率在10%以下，在api21以下，基本都可以成功； 
 可以通过反复进行此操作来提高成功率，但效果不大。



## 实战

### 工具类

```kotlin
import android.content.Context;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;

import java.util.List;

public class ZJWifiUtil {
    //密码类型
    public static final int TYPE_NO_PWD = 1;
    public static final int TYPE_WEP = 2;
    public static final int TYPE_WPA = 3;
    // 定义WifiManager对象
    private WifiManager mWifiManager;

    // 构造器
    public ZJWifiUtil(Context context) {
        // 取得WifiManager对象
        mWifiManager = (WifiManager) context
            .getSystemService(Context.WIFI_SERVICE);
    }

    // 打开WIFI
    public void openWifi() {
        if (!mWifiManager.isWifiEnabled()) {
            mWifiManager.setWifiEnabled(true);
        }
    }

    /**
     * 获取已连接的WIFI
     *
     * @return
     */
    public WifiInfo getConnectWifi() {
        return mWifiManager.getConnectionInfo();
    }


    // 添加一个网络并连接
    public void addNetwork(WifiConfiguration wcg) {
        int wcgID = mWifiManager.addNetwork(wcg);
        boolean b = mWifiManager.enableNetwork(wcgID, true);
    }

    // 断开指定ID的网络
    public void disconnectWifi(int netId) {
        mWifiManager.disableNetwork(netId);
        mWifiManager.disconnect();
    }

    public void removeWifi(int netId) {
        disconnectWifi(netId);
        boolean isSucess = false;
        while (!isSucess) {
            isSucess = mWifiManager.removeNetwork(netId);
        }
    }


    public void removeWifi(String ssid) {
        WifiConfiguration tempConfig = this.isExsits(ssid);
        if (tempConfig != null) {
            disconnectWifi(tempConfig.networkId);
            boolean isSucess = false;
            while (!isSucess) {
                isSucess = mWifiManager.removeNetwork(tempConfig.networkId);
            }
        }
    }

    //创建WifiConfiguration对象
    public WifiConfiguration createWifiInfo(String ssid, String password, int type) {
        WifiConfiguration config = new WifiConfiguration();
        config.allowedAuthAlgorithms.clear();
        config.allowedGroupCiphers.clear();
        config.allowedKeyManagement.clear();
        config.allowedPairwiseCiphers.clear();
        config.allowedProtocols.clear();
        config.SSID = "\"" + ssid + "\"";

        WifiConfiguration tempConfig = this.isExsits(ssid);
        if (tempConfig != null) {
            boolean isSucess = false;
            while (!isSucess) {
                isSucess = mWifiManager.removeNetwork(tempConfig.networkId);
            }
        }
        if (type == TYPE_NO_PWD) {
            config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE);
        } else if (type == TYPE_WEP) {
            config.hiddenSSID = true;

            int i = password.length();
            if (((i == 10 || (i == 26) || (i == 58))) && (password.matches("[0-9A-Fa-f]*"))) {
                config.wepKeys[0] = password;
            } else {
                config.wepKeys[0] = "\"" + password + "\"";
            }
            config.allowedAuthAlgorithms.set(WifiConfiguration.AuthAlgorithm.SHARED);
            config.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);
            config.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);
            config.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.WEP40);
            config.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.WEP104);
            config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.NONE);
            config.wepTxKeyIndex = 0;
        } else if (type == TYPE_WPA) {
            config.preSharedKey = "\"" + password + "\"";
            config.hiddenSSID = true;
            config.allowedAuthAlgorithms.set(WifiConfiguration.AuthAlgorithm.OPEN);
            config.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.TKIP);
            config.allowedKeyManagement.set(WifiConfiguration.KeyMgmt.WPA_PSK);
            config.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.TKIP);
            config.allowedGroupCiphers.set(WifiConfiguration.GroupCipher.CCMP);
            config.allowedPairwiseCiphers.set(WifiConfiguration.PairwiseCipher.CCMP);
            config.status = WifiConfiguration.Status.ENABLED;
        }
        return config;

    }

    //判断以保存列表中是否有当前ssid的WiFi
    public WifiConfiguration isExsits(String ssid) {
        List<WifiConfiguration> existingConfigs = mWifiManager.getConfiguredNetworks();
        if (existingConfigs != null && existingConfigs.size() > 0) {
            for (WifiConfiguration existingConfig : existingConfigs) {
                if (existingConfig.SSID.equals("\"" + ssid + "\"")) {
                    return existingConfig;
                }
            }
        }
        return null;
    }

    public static boolean isOpen(ScanResult result) {
        String capabilities = result.capabilities.toLowerCase();
        boolean isOpen = true;
        if (capabilities.contains("wpa")) {
            isOpen = false;
        } else if (capabilities.contains("wep")) {
            isOpen = false;
        }
        return isOpen;
    }

    public void connect(WifiConfiguration config) {
        int wcgID = mWifiManager.addNetwork(config);
        mWifiManager.enableNetwork(wcgID, true);
    }

    public void connect(String ssid, String password, int type) {
        WifiConfiguration wifiConfiguration = createWifiInfo(ssid, password, type);
        connect(wifiConfiguration);
    }
}
```





### 获取Wi-Fi列表

全局变量

```kotlin
private var mListAdapter: SWifiAdapter? = null
private val mDatas = ArrayList<ScanResult>()
private var wifiMap = LinkedHashMap<String, ScanResult>()
var lastSize = 0;
```

这里之所以定义了一个`wifiMap` 是因为获取的`ScanResult`的列表中 会有相同SSID的WI-FI 使用Map来过滤掉



在接收到WI-FI打开的广播后 扫描WI-FI

```kotlin
var locManager = mContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
if (!locManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
    // 未打开位置开关，可能导致定位失败或定位不准，提示用户或做相应处理
    Toasty.warning(mContext, "自Android 6.0开始需要打开位置才可以搜索到WIFI设备").show()
} else {
    //开始扫描
    wifiMap.clear()
    lastSize = 0
    mDatas.removeAll(mDatas)
    reloadData()
    mWifiManager!!.startScan()
}
```



刷新列表

````kotlin
private fun reloadData() {
    if (isNetCardFriendly()) {
        var wifiList = mWifiManager!!.getScanResults();
        if (wifiList.size > lastSize) {
            for (item in wifiList) {
                if (wifiMap.get(item.SSID) == null) {
                    wifiMap.put(item.SSID, item)
                    mDatas.add(item)
                }
            }
            lastSize = wifiList.size
        }

        for (item in mDatas) {
            if (mWifiManager!!.connectionInfo.ssid.contains(item.SSID)) {
                mDatas.remove(item)
                mDatas.add(0, item)
                break
            }
        }
        mListAdapter?.notifyDataSetChanged()
    } else {
        mDatas.removeAll(mDatas)
        mListAdapter?.notifyDataSetChanged()
    }
}
````

### 添加广播接收

```kotlin
var receiver = object : BroadcastReceiver() {
    override fun onReceive(p0: Context?, mIntent: Intent?) {
        val action = mIntent?.action

        when (action) {
            WifiManager.SCAN_RESULTS_AVAILABLE_ACTION -> {
                reloadData()
                L.i("搜索结果可用")
            }
            WifiManager.NETWORK_STATE_CHANGED_ACTION -> {
                val parcelableExtra = mIntent
                    .getParcelableExtra<Parcelable>(WifiManager.EXTRA_NETWORK_INFO)
                val wifiInfo = mIntent
                    .getParcelableExtra<WifiInfo>(WifiManager.EXTRA_WIFI_INFO)
                if (null != parcelableExtra) {
                    val networkInfo = parcelableExtra as NetworkInfo
                    val state = networkInfo.state
                    var stateDetail = networkInfo.detailedState

                    if (wifiInfo != null) {
                        L.i(wifiInfo.ssid)

                    }
                    L.i("state:${state} ---  stateDetail:${stateDetail}")
                    when (state) {
                        NetworkInfo.State.DISCONNECTED -> {
                            L.i("连接断开")
                            Toasty.info(mContext, "连接断开").show()
                        }

                        NetworkInfo.State.CONNECTED -> {
                            L.i("已连接")
                            Toasty.info(mContext, "已连接").show()
                        }

                        else -> {
                            when (stateDetail) {
                                NetworkInfo.DetailedState.CONNECTING -> {
                                    L.i("连接中...")
                                    Toasty.info(mContext, "连接中...").show()
                                }

                                NetworkInfo.DetailedState.AUTHENTICATING -> {
                                    L.i("认证中...")
                                    Toasty.info(mContext, "认证中...").show()
                                }

                                NetworkInfo.DetailedState.OBTAINING_IPADDR -> {
                                    L.i("正在获取IP地址...")
                                    Toasty.info(mContext, "正在获取IP地址...").show()
                                }

                                NetworkInfo.DetailedState.FAILED -> {
                                    L.i("连接失败")
                                    Toasty.info(mContext, "连接失败").show()
                                }
                            }
                        }
                    }
                }
                reloadData()
            }

            WifiManager.WIFI_STATE_CHANGED_ACTION -> {
                var wifiState = mIntent.getIntExtra(
                    WifiManager.EXTRA_WIFI_STATE,
                    WifiManager.WIFI_STATE_DISABLED
                )
                when (wifiState) {
                    WifiManager.WIFI_STATE_DISABLED -> {
                        L.i("WI-FI已关闭")
                        wifi_switch.isChecked = false
                    }

                    WifiManager.WIFI_STATE_ENABLED -> {
                        L.i("WI-FI已打开")
                        wifi_switch.isChecked = true
                        var locManager = mContext
                            .getSystemService(Context.LOCATION_SERVICE) as LocationManager
                        if (!locManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                            Toasty.warning(
                                mContext,
                                "自Android 6.0开始需要打开位置权限才可以搜索到WIFI设备"
                            ).show()
                        } else {
                            //开始扫描
                            wifiMap.clear()
                            lastSize = 0
                            mDatas.removeAll(mDatas)
                            reloadData()
                            mWifiManager!!.startScan()
                        }
                    }

                    WifiManager.WIFI_STATE_ENABLING -> {
                        L.i("WI-FI打开中...")
                    }
                }
            }

        }
    }

}


override fun onStart() {
    super.onStart()
    val filter = IntentFilter()
    filter.addAction(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION)
    filter.addAction(WifiManager.NETWORK_STATE_CHANGED_ACTION)
    filter.addAction(WifiManager.WIFI_STATE_CHANGED_ACTION)
    registerReceiver(receiver, filter)
}

override fun onStop() {
    unregisterReceiver(receiver)
    super.onStop()
}
```

