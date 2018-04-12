---
layout: post
title: Android 蓝牙操作
description: Android 蓝牙操作
keywords: android
categories: android java
---



# 蓝牙设备连接

蓝牙的连接过程

`获取`->`配对`->`连接`

## 权限

首先需要`AndroidManifest.xml`文件中添加操作蓝牙的权限。

```xml
<uses-permissionandroid:name="android.permission.BLUETOOTH" />
```

允许程序连接到已配对的蓝牙设备。

```xml
<uses-permissionandroid:name="android.permission.BLUETOOTH_ADMIN" />
```



## 获取可用蓝牙设备

### 引包

操作蓝牙主要用到的类 `BluetoothAdapter`类，使用时导包

```java
import android.bluetooth.BluetoothAdapter;
```

`BluetoothAdapter` 代表本地设备的蓝牙适配器。

该BluetoothAdapter可以执行基本的蓝牙任务，例如启动设备发现，查询配对的设备列表，使用已知的MAC地址实例化一个BluetoothDevice类，并创建一个BluetoothServerSocket监听来自其他设备的连接请求

### 获取蓝牙适配器

```java
BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter(); 
```

### 判断蓝牙是否开启 并启动蓝牙

```java
if(!mBluetoothAdapter.isEnabled()){  
	//弹出对话框提示用户是后打开  
	Intent enabler = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);  
	startActivityForResult(enabler, REQUEST_ENABLE);  
    //不做提示，直接打开，不建议用下面的方法，有的手机会有问题。  
    // mBluetoothAdapter.enable();  
}  
```

### 获取本地蓝牙信息和已配对设备

连接中的设备不能在搜索回调中获取 

只能在以配对设备中获取

```java
//获取本机蓝牙名称  
String name = mBluetoothAdapter.getName();  
//获取本机蓝牙地址  
String address = mBluetoothAdapter.getAddress();  
Log.d(TAG,"bluetooth name ="+name+" address ="+address);  
//获取已配对蓝牙设备  
Set<BluetoothDevice> devices = mBluetoothAdapter.getBondedDevices();  
Log.d(TAG, "bonded device size ="+devices.size());  
for(BluetoothDevice bonddevice:devices){  
    Log.d(TAG, "bonded device name ="
          +bonddevice.getName()+" address"+bonddevice.getAddress());  
}  
```



### 搜索设备

```java
mBluetoothAdapter.startDiscovery();
```

搜索蓝牙设备，该过程是异步的，通过下面注册广播接受者，可以监听是否搜到设备。

```java
IntentFilter filter = new IntentFilter();  
//发现设备  
filter.addAction(BluetoothDevice.ACTION_FOUND);  
//设备连接状态改变  
filter.addAction(BluetoothDevice.ACTION_BOND_STATE_CHANGED);  
//蓝牙设备状态改变  
filter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);  
registerReceiver(mBluetoothReceiver, filter); 
```

监听扫描结果

通过广播接收者查看扫描到的蓝牙设备，每扫描到一个设备，系统都会发送此广播（`BluetoothDevice.ACTION_FOUNDE`）。

其中参数intent可以获取蓝牙设备`BluetoothDevice`。

```java
private BroadcastReceiver mBluetoothReceiver = new BroadcastReceiver(){  
    @Override  
    public void onReceive(Context context, Intent intent) {  
        String action = intent.getAction();  
        Log.d(TAG,"mBluetoothReceiver action ="+action);  
        if(BluetoothDevice.ACTION_FOUND.equals(action)){//每扫描到一个设备，系统都会发送此广播。  
            //获取蓝牙设备  
            BluetoothDevice scanDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);  
            if(scanDevice == null || scanDevice.getName() == null) return;  
            Log.d(TAG, "name="+scanDevice.getName()+"address="+scanDevice.getAddress());  
            //蓝牙设备名称  
            String name = scanDevice.getName();  
            if(name != null && name.equals(BLUETOOTH_NAME)){  
                //取消扫描  
                mBluetoothAdapter.cancelDiscovery();  
               
            }  
        }else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)){  
			//扫描结束
        }
        else if (BluetoothDevice.ACTION_BOND_STATE_CHANGED.equals(action)) {
            //状态改变时
            BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
            switch (device.getBondState()) {
                case BluetoothDevice.BOND_BONDING://正在配对
                    Log.d("BlueToothTestActivity", "正在配对......");
                    break;
                case BluetoothDevice.BOND_BONDED://配对结束
                    Log.d("BlueToothTestActivity", "完成配对");
                    break;
                case BluetoothDevice.BOND_NONE://取消配对/未配对
                    Log.d("BlueToothTestActivity", "取消配对");
                default:
                    break;
            }
        }  
    }  

}; 
```



### 停止搜索

```java
mBluetoothAdapter.cancelDiscovery();
```



### 设置蓝牙可见性

有时候扫描不到某设备，这是因为该设备对外不可见或者距离远，需要设备该蓝牙可见，这样该才能被搜索到。

可见时间默认值为120s，最多可设置300。

```java
if (mBluetoothAdapter.isEnabled()) {  
    if (mBluetoothAdapter.getScanMode() !=   
           BluetoothAdapter.SCAN_MODE_CONNECTABLE_DISCOVERABLE) {  
        Intent discoverableIntent = new Intent(  
                BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);  
        discoverableIntent.putExtra(  
                BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 120);  
        startActivity(discoverableIntent);  
    }  
} 
```

## 配对

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    btDev.createBond();
}
```



# 服务端

android 蓝牙之间可以通过SDP协议建立连接进行通信，通信方式类似于平常使用socket。

首先创建BluetoothServerSocket ，BluetoothAdapter中提供了两种创建BluetoothServerSocket 方式，如下图所示为创建安全的RFCOMM Bluetooth socket，该连接是安全的需要进行配对。而通过listenUsingInsecureRfcommWithServiceRecord创建的RFCOMM Bluetooth socket是不安全的，连接时不需要进行配对。

其中的uuid需要服务器端和客户端进行统一。

```java
private class AcceptThread extends Thread {  
        // 本地服务器套接字  
        private final BluetoothServerSocket mServerSocket;  
        public AcceptThread() {           
            BluetoothServerSocket tmp = null;  
            // 创建一个新的侦听服务器套接字  
            try {  
                tmp = mAdapter.listenUsingRfcommWithServiceRecord(  
                        SERVICE_NAME, SERVICE_UUID);  
                //tmp = mAdapter.listenUsingInsecureRfcommWithServiceRecord(SERVICE_NAME, SERVICE_UUID);  
            } catch (IOException e) {  
                Log.e(TAG, "listen() failed", e);  
            }  
            mServerSocket = tmp;  
        }  

        public void run() {  
            BluetoothSocket socket = null;  
            // 循环，直到连接成功  
            while (mState != STATE_CONNECTED) {  
                try {  
                    // 这是一个阻塞调用 返回成功的连接  
                    // mServerSocket.close()在另一个线程中调用，可以中止该阻塞  
                    socket = mServerSocket.accept();  
                } catch (IOException e) {  
                    Log.e(TAG, "accept() failed", e);  
                    break;  
                }  
                // 如果连接被接受  
                if (socket != null) {  
                    synchronized (BluetoothChatUtil.this) {  
                        switch (mState) {  
                        case STATE_LISTEN:  
                        case STATE_CONNECTING:  
                            // 正常情况。启动ConnectedThread。  
                            connected(socket, socket.getRemoteDevice());  
                            break;  
                        case STATE_NONE:  
                        case STATE_CONNECTED:  
                            // 没有准备或已连接。新连接终止。  
                            try {  
                                socket.close();  
                            } catch (IOException e) {  
                                Log.e(TAG, "Could not close unwanted socket", e);  
                            }  
                            break;  
                        }  
                    }  
                }  
            }  
            if (D) Log.i(TAG, "END mAcceptThread");  
        }  

        public void cancel() {  
            if (D) Log.d(TAG, "cancel " + this);  
            try {  
                mServerSocket.close();  
            } catch (IOException e) {  
                Log.e(TAG, "close() of server failed", e);  
            }  
        }  
    }  
```



# 客户端

客户端主要用来创建RFCOMM socket，并连接服务端。

先扫描周围的蓝牙设备，如果扫描到指定设备则进行连接。mBlthChatUtil.connect(scanDevice)连接到设备，

连接过程主要在ConnectThread线程中进行，先创建socket，方式有两种，

如下代码中是安全的（createRfcommSocketToServiceRecord）。另一种不安全连接对应的函数是createInsecureRfcommSocketToServiceRecord。

```java
private class ConnectThread extends Thread {  
        private BluetoothSocket mmSocket;  
        private final BluetoothDevice mmDevice;  
        public ConnectThread(BluetoothDevice device) {  
            mmDevice = device;  
            BluetoothSocket tmp = null;  
            // 得到一个bluetoothsocket  
            try {  
                mmSocket = device.createRfcommSocketToServiceRecord  
                        (SERVICE_UUID);  
            } catch (IOException e) {  
                Log.e(TAG, "create() failed", e);  
                mmSocket = null;  
            }  
        }  

        public void run() {  
            Log.i(TAG, "BEGIN mConnectThread");  
            try {   
                // socket 连接,该调用会阻塞，直到连接成功或失败  
                mmSocket.connect();  
            } catch (IOException e) {  
                connectionFailed();  
                try {//关闭这个socket  
                    mmSocket.close();  
                } catch (IOException e2) {  
                    e2.printStackTrace();  
                }  
                return;  
            }  
            // 启动连接线程  
            connected(mmSocket, mmDevice);  
        }  

        public void cancel() {  
            try {  
                mmSocket.close();  
            } catch (IOException e) {  
                Log.e(TAG, "close() of connect socket failed", e);  
            }  
        }  
    }  
```

# 数据传输

客户端与服务端连接成功后都会调用connected(mmSocket, mmDevice)，创建一个ConnectedThread线程（）。

该线程主要用来接收和发送数据。客户端和服务端处理方式一样。该线程通过socket获得输入输出流。

```java
private  InputStream mmInStream = socket.getInputStream();
private  OutputStream mmOutStream =socket.getOutputStream();
```

发送数据

```java
public void write(byte[] buffer) {  
    try {  
        mmOutStream.write(buffer);  
        // 分享发送的信息到Activity  
        mHandler.obtainMessage(MESSAGE_WRITE, -1, -1, buffer)  
                .sendToTarget();  
    } catch (IOException e) {  
        Log.e(TAG, "Exception during write", e);  
    }  
}  
```

接收数据

线程循环进行接收数据。

```java
public void run() {  
    // 监听输入流  
    while (true) {  
        try {  
            byte[] buffer = new byte[1024];  
            // 读取输入流  
            int bytes = mmInStream.read(buffer);  
            // 发送获得的字节的ui activity  
            Message msg = mHandler.obtainMessage(MESSAGE_READ);  
            Bundle bundle = new Bundle();  
            bundle.putByteArray(READ_MSG, buffer);  
            msg.setData(bundle);  
            mHandler.sendMessage(msg);            
        } catch (IOException e) {  
            Log.e(TAG, "disconnected", e);  
                connectionLost();  
                break;  
            }  
        }  
   }  
```



