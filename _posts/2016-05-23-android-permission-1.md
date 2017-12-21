---

layout: post
title: Android6 新的权限机制
description: 有没有这样一种情况，明明配置了需要的权限，但是运行时却没有权限，要是这样的话，你一定用的是android6及以上，app的编译版本是23，就是因为Android的权限机制变了
keywords: android
category: android

---

## 概要

android的权限系统一直是首要的安全概念，因为这些权限只在安装的时候被询问一次。  
一旦安装了，app可以在用户毫不知晓的情况下访问权限内的所有东西。  
难怪一些坏蛋利用这个缺陷恶意收集用户数据用来做坏事了！  

android小组也知道这事儿。7年了！权限系统终于被重新设计了。  
在**android6.0棉花糖**，**app将不会在安装的时候授予权限**。取而代之的是，**app不得不在运行时一个一个询问用户授予权限**。

注意**权限询问对话框不会自己弹出来**。**开发者不得不自己调用**。如果开发者要调用的一些函数需要某权限而用户又拒绝授权的话，函数将抛出异常直接导致程序崩溃。

那么问题就来了怎样解决呢

这个新的运行时权限仅当我们设置`targetSdkVersion to 23`（这意味着你已经在23上测试通过了）才起作用，当然还要是M系统的手机。app在6.0之前的设备依然使用旧的权限系统。

所以我们可以设置**targetSdkVersion为22**  

但这样毕竟不是好的方式  我们还是好好学学新版的权限这样使用

## 正文

新版的权限可以分为两大类`普通权限`和`运行时权限`
  
+ `运行时权限`需要`询问用户`
+ `普通权限`只要在`AndroidManifest.xml`中声明就好了，安装应用时会自动赋予

### 普通权限

`普通权限`包含以下权限

```java
android.permission.ACCESS_LOCATION_EXTRA_COMMANDS
android.permission.ACCESS_NETWORK_STATE
android.permission.ACCESS_NOTIFICATION_POLICY
android.permission.ACCESS_WIFI_STATE
android.permission.ACCESS_WIMAX_STATE
android.permission.BLUETOOTH
android.permission.BLUETOOTH_ADMIN
android.permission.BROADCAST_STICKY
android.permission.CHANGE_NETWORK_STATE
android.permission.CHANGE_WIFI_MULTICAST_STATE
android.permission.CHANGE_WIFI_STATE
android.permission.CHANGE_WIMAX_STATE
android.permission.DISABLE_KEYGUARD
android.permission.EXPAND_STATUS_BAR
android.permission.FLASHLIGHT
android.permission.GET_ACCOUNTS
android.permission.GET_PACKAGE_SIZE
android.permission.INTERNET
android.permission.KILL_BACKGROUND_PROCESSES
android.permission.MODIFY_AUDIO_SETTINGS
android.permission.NFC
android.permission.READ_SYNC_SETTINGS
android.permission.READ_SYNC_STATS
android.permission.RECEIVE_BOOT_COMPLETED
android.permission.REORDER_TASKS
android.permission.REQUEST_INSTALL_PACKAGES
android.permission.SET_TIME_ZONE
android.permission.SET_WALLPAPER
android.permission.SET_WALLPAPER_HINTS
android.permission.SUBSCRIBED_FEEDS_READ
android.permission.TRANSMIT_IR
android.permission.USE_FINGERPRINT
android.permission.VIBRATE
android.permission.WAKE_LOCK
android.permission.WRITE_SYNC_SETTINGS
com.android.alarm.permission.SET_ALARM
com.android.launcher.permission.INSTALL_SHORTCUT
com.android.launcher.permission.UNINSTALL_SHORTCUT
```

### 运行时权限

<table>

<tr><th>权限组</th><th>权限</th></tr>
<tr>
    <td>android.permission-group.CALENDAR</td>
    <td>
        <ul>
            <li>android.permission.READ_CALENDAR</li>
            <li>android.permission.WRITE_CALENDAR</li>
        </ul>    
    </td>
</tr>
<tr>
    <td>android.permission-group.CAMERA</td>
    <td>
        <ul>
            <li>android.permission.CAMERA</li>
        </ul>    
    </td>
</tr>
<tr>
    <td>android.permission-group.CONTACTS</td>
    <td>
        <ul>
            <li>android.permission.READ_CONTACTS</li>
            <li>android.permission.WRITE_CONTACTS</li>
            <li>android.permission.GET_ACCOUNTS</li>
        </ul>    
    </td>
</tr>
<tr>
    <td>android.permission-group.LOCATION</td>
    <td>
        <ul>
            <li>android.permission.ACCESS_FINE_LOCATION</li>
            <li>android.permission.ACCESS_COARSE_LOCATION</li>
        </ul>    
    </td>
</tr>
<tr>
    <td>android.permission-group.MICROPHONE</td>
    <td>
        <ul>
            <li>android.permission.RECORD_AUDIO</li>
        </ul>    
    </td>
</tr>
<tr>
    <td>android.permission-group.PHONE</td>
    <td>
        <ul>
            <li>android.permission.READ_PHONE_STATE</li>
            <li>android.permission.CALL_PHONE</li>
            <li>android.permission.READ_CALL_LOG</li>
            <li>android.permission.WRITE_CALL_LOG</li>
            <li>com.android.voicemail.permission.ADD_VOICEMAIL</li>
            <li>android.permission.USE_SIP</li>
            <li>android.permission.PROCESS_OUTGOING_CALLS</li>
        </ul>    
    </td>
</tr>
<tr>
    <td>android.permission-group.SENSORS</td>
    <td>
        <ul>
            <li>android.permission.BODY_SENSORS</li>
        </ul>    
    </td>
</tr>
<tr>
    <td>android.permission-group.SMS</td>
    <td>
        <ul>
            <li>android.permission.SEND_SMS</li>
            <li>android.permission.RECEIVE_SMS</li>
            <li>android.permission.READ_SMS</li>
            <li>android.permission.RECEIVE_WAP_PUSH</li>
            <li>android.permission.RECEIVE_MMS</li>
            <li>android.permission.READ_CELL_BROADCASTS</li>
        </ul>    
    </td>
</tr>
<tr>
    <td>android.permission-group.STORAGE</td>
    <td>
        <ul>
            <li>android.permission.READ_EXTERNAL_STORAGE</li>
            <li>android.permission.WRITE_EXTERNAL_STORAGE</li>
        </ul>    
    </td>
</tr>

</table>

从上图中我们可以看到 权限都被分了组  
同一组的任何一个权限被授权了，其他权限也自动被授权。例如，一旦`WRITE_CONTACTS`被授权了，app也有`READ_CONTACTS`和`GET_ACCOUNTS`权限了。

是时候让我们的app支持新权限模型了，从设置`compileSdkVersion` and `targetSdkVersion` 为 `23`开始吧.

```java
android {
    compileSdkVersion 23
    //...
 
    defaultConfig {
        //...
        targetSdkVersion 23
        //...
    }
}
```

## 请求单个权限

假如我们要添加联系人

```java
//添加联系人的方法
private void insertDummyContact() {

}
```

下一步像以前一样在`AndroidManifest.xml`添加声明权限。

```xml
<uses-permission android:name="android.permission.WRITE_CONTACTS"/>
```

光是这样的话还是没有权限，所以我们要询问用户授权

定义全局变量

```java
final private int REQUEST_CODE_ASK_PERMISSIONS = 123;
```

```java
private void insertDummyContactWrapper() {
    if (Build.VERSION.SDK_INT >= 23) {
        int hasWriteContactsPermission = checkSelfPermission(Manifest.permission.WRITE_CONTACTS);
        if (hasWriteContactsPermission != PackageManager.PERMISSION_GRANTED) {
            //未赋与权限  请求权限
            requestPermissions(new String[]{Manifest.permission.WRITE_CONTACTS}, REQUEST_CODE_ASK_PERMISSIONS);
            return;
        }else{
            //已赋予权限
            insertDummyContact();
        }
    }else{
        //低于Android6.0
        insertDummyContact();
    }
}
```

如果已有权限，`insertDummyContact()`会执行。  
否则，`requestPermissions`被执行来弹出请求授权对话框
不论用户同意还是拒绝，activity的`onRequestPermissionsResult`会被回调来通知结果(通过第三个参数: grantResults) 

如下：

```java
@Override
public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    switch (requestCode) {
        case REQUEST_CODE_ASK_PERMISSIONS:
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // 已授权
                insertDummyContact();
            } else {
                // 未授权成功
                Toast.makeText(MainActivity.this, "通讯录没有写入权限", Toast.LENGTH_SHORT).show();
            }
            break;
        default:
            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
```

### 处理 用户点击了“不再提醒”的情况

如果用户拒绝某授权。下一次弹框，用户会有一个“不再提醒”的选项的来防止app以后继续请求授权。   
如果这个选项在拒绝授权前被用户勾选了。下次为这个权限请求`requestPermissions`时，对话框就不弹出来了，结果就是，app啥都不干。   
这将是很差的用户体验，用户做了操作却得不到响应。这种情况需要好好处理一下。  
在请求`requestPermissions`前，我们通过activity的`shouldShowRequestPermissionRationale`方法来检查是否需要弹出请求权限的提示对话框

+ 1. 第一次请求权限时，用户拒绝了，下一次：`shouldShowRequestPermissionRationale()`  返回 `true`，应该显示一些为什么需要这个权限的说明
+ 2. 第二次请求权限时，用户拒绝了，并选择了“不在提醒”的选项时：`shouldShowRequestPermissionRationale()`  返回 `false`
+ 3. 设备的策略`禁止`当前应用获取这个权限的授权：`shouldShowRequestPermissionRationale()`  返回 `false` 


代码如下：

```java
private void insertDummyContactWrapper() {
    if (Build.VERSION.SDK_INT >= 23) {
        int hasWriteContactsPermission = checkSelfPermission(Manifest.permission.WRITE_CONTACTS);
        if (hasWriteContactsPermission != PackageManager.PERMISSION_GRANTED) {
            //用户彻底禁用了权限
            if (!shouldShowRequestPermissionRationale(Manifest.permission.WRITE_CONTACTS)) {
                showMessageOKCancel("请从系统设置中开启访问通讯录的权限",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                if (Build.VERSION.SDK_INT >= 23) {
                                    requestPermissions(new String[]{Manifest.permission.WRITE_CONTACTS},
                                            REQUEST_CODE_ASK_PERMISSIONS);
                                }
                            }
                        });
            } else {
                //用户没有彻底禁用了权限 请求权限
                requestPermissions(new String[]{Manifest.permission.WRITE_CONTACTS}, REQUEST_CODE_ASK_PERMISSIONS);
            }

        } else {
            insertDummyContact();
        }
    } else {
        insertDummyContact();
    }
}

private void showMessageOKCancel(String message, DialogInterface.OnClickListener okListener) {
    new AlertDialog.Builder(IMChatActivity.this)
            .setMessage(message)
            .setPositiveButton("确认", okListener)
            .setNegativeButton("取消", null)
            .create()
            .show();
}
```

当一个权限第一次被请求和用户标记过不再提醒的时候,我们写的对话框被展示。
最后一种情况，`onRequestPermissionsResult` 会收到`PERMISSION_DENIED` ，系统询问对话框不展示。

## 一次请求多个权限

当然了有时候需要好多权限，可以用上面方法一次请求多个权限。  
不要忘了为每个权限检查“不再提醒”的设置。   
修改后的代码：

添加全局常量

```java
final private int REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS = 124;
```

```java
private void insertDummyContactWrapper() {
    if (Build.VERSION.SDK_INT >= 23) {
        //应用尚未赋予的权限 并且选择了不再提醒
        List<String> permissionsNeeded = new ArrayList<String>();
        //应用尚未赋予的权限
        final List<String> permissionsList = new ArrayList<String>();

        if (!addPermission(permissionsList, Manifest.permission.ACCESS_FINE_LOCATION)) {
            permissionsNeeded.add("GPS");
        }

        if (!addPermission(permissionsList, Manifest.permission.READ_CONTACTS)) {
            permissionsNeeded.add("读取通讯录");
        }

        if (!addPermission(permissionsList, Manifest.permission.WRITE_CONTACTS)) {
            permissionsNeeded.add("写入通讯录");
        }

        if (permissionsList.size() > 0) {
            if (permissionsNeeded.size() > 0) {
                String message = "应用需要以下权限,请手动打开：" + permissionsNeeded.get(0);
                for (int i = 1; i < permissionsNeeded.size(); i++) {
                    message += ", " + permissionsNeeded.get(i);
                }
                showMessageOKCancel(message,
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                if (Build.VERSION.SDK_INT >= 23) {
                                    requestPermissions(permissionsList.toArray(new String[permissionsList.size()]), REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
                                }
                            }
                        });
                return;
            }
            requestPermissions(permissionsList.toArray(new String[permissionsList.size()]), REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS);
            return;
        }

        insertDummyContact();
    } else {
        insertDummyContact();
    }
}

private boolean addPermission(List<String> permissionsList, String permission) {
    if (Build.VERSION.SDK_INT >= 23) {
        if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
            permissionsList.add(permission);
            if (!shouldShowRequestPermissionRationale(permission)) {
                return false;
            }
        }
        return true;
    }
    return true;
}

private void showMessageOKCancel(String message, DialogInterface.OnClickListener okListener) {
    new AlertDialog.Builder(IMChatActivity.this)
            .setMessage(message)
            .setPositiveButton("确认", okListener)
            .setNegativeButton("取消", null)
            .create()
            .show();
}

@Override
public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    switch (requestCode) {
        case REQUEST_CODE_ASK_MULTIPLE_PERMISSIONS: {
            Map<String, Integer> perms = new HashMap<String, Integer>();
            // Initial
            perms.put(Manifest.permission.ACCESS_FINE_LOCATION, PackageManager.PERMISSION_GRANTED);
            perms.put(Manifest.permission.READ_CONTACTS, PackageManager.PERMISSION_GRANTED);
            perms.put(Manifest.permission.WRITE_CONTACTS, PackageManager.PERMISSION_GRANTED);
            // Fill with results
            for (int i = 0; i < permissions.length; i++) {
                perms.put(permissions[i], grantResults[i]);
            }

            if (perms.get(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                    && perms.get(Manifest.permission.READ_CONTACTS) == PackageManager.PERMISSION_GRANTED
                    && perms.get(Manifest.permission.WRITE_CONTACTS) == PackageManager.PERMISSION_GRANTED) {
                // 拥有所有权限
                insertDummyContact();
            } else {
                // 没有权限
                Toast.makeText(IMChatActivity.this, "没有赋予某些权限", Toast.LENGTH_SHORT).show();
            }
        }
        break;
        default:
            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
```


## 用兼容库来做兼容(非必需)

以上代码是通过`判断SDK的版本`来调用不同的方法来兼容不同的版本。当然也可以使用`兼容包`。

我建议用v4兼容库，已对这个做过兼容，用这个方法代替：

+ ContextCompat.checkSelfPermission()  
被授权函数返回`PERMISSION_GRANTED`，否则返回`PERMISSION_DENIED` ，在所有版本都是如此。
+ ActivityCompat.requestPermissions()  
这个方法在M之前版本调用，OnRequestPermissionsResultCallback 直接被调用，带着正确的 PERMISSION_GRANTED或者 PERMISSION_DENIED 。
+ ActivityCompat.shouldShowRequestPermissionRationale()  
在M之前版本调用，永远返回false。  
用v4包的这三方法，完美兼容所有版本！这个方法需要额外的参数，Context or Activity。  

别的就没啥特别的了。下面是代码：

```java
private void insertDummyContactWrapper() {
    //这行改变
    int hasWriteContactsPermission = ContextCompat.checkSelfPermission(MainActivity.this,Manifest.permission.WRITE_CONTACTS);
    if (hasWriteContactsPermission != PackageManager.PERMISSION_GRANTED) {
        //这行改变
        if (!ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this,Manifest.permission.WRITE_CONTACTS)) {
            showMessageOKCancel("必须允许访问通讯录",
                    new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            //这行改变
                            ActivityCompat.requestPermissions(
                                    MainActivity.this,
                                    new String[] {Manifest.permission.WRITE_CONTACTS},
                                    REQUEST_CODE_ASK_PERMISSIONS
                                    );
                        }
                    });
            return;
        }
        ActivityCompat.requestPermissions(MainActivity.this,
                new String[] {Manifest.permission.WRITE_CONTACTS},
                REQUEST_CODE_ASK_PERMISSIONS);
        return;
    }
    insertDummyContact();
}
```


> 我们也可以在`Fragment`中使用，用v13兼容包:  
> `FragmentCompat.requestPermissions()`   
> `FragmentCompat.shouldShowRequestPermissionRationale()`。


## 第三方库简化代码

以上代码真尼玛复杂。  
为解决这事，有许多第三方库已经问世了。  

项目没用`Rxjava` 建议用 [`hotchemi’s PermissionsDispatcher`](https://github.com/hotchemi/PermissionsDispatcher)。

如果项目用了`Rxjava` 更建议用[`RxPermissions`](https://github.com/tbruyelle/RxPermissions)

简单实例

添加依赖

```
compile 'io.reactivex.rxjava2:rxjava:2.0.5'
compile 'io.reactivex.rxjava2:rxandroid:2.0.1'
compile 'com.tbruyelle.rxpermissions2:rxpermissions:0.9.4@aar'
```

代码

```java
private void questAllPersission(){
    RxPermissions rxPermissions = new RxPermissions(this);
    rxPermissions
            .request(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE)
            .subscribe(granted -> {
                if (granted) {
                    Toast.makeText(LoginActivity.this, "授权成功", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(LoginActivity.this, "授权失败 软件将不能正常使用", Toast.LENGTH_SHORT).show();
                }
            });
}
```

## 结论建议

我相信你对新权限模型已经有了清晰的认识。我相信你也意识到了问题的严峻。  

但是你没得选择。新运行时权限已经在棉花糖中被使用了。我们没有退路。我们现在唯一能做的就是保证app适配新权限模型.  

欣慰的是只有少数权限需要运行时权限模型。  
大多数常用的权限，例如，网络访问，属于**普通权限** 在安装时自动会授权，当然你要声明，以后无需检查。因此，只有少部分代码你需要修改。

两个建议： 

+ 1.严肃对待新权限模型
+ 2.如果你代码没支持新权限，不要设置**targetSdkVersion 23**。尤其是当你在Studio新建工程时，不要忘了修改！



