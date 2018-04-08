---
layout: post
title: Android OkGo网络请求库 自定义回调支持带泛型的对象
description: Android OkGo网络请求库 自定义回调支持带泛型的对象
keywords: android
categories: android

---



## 依赖

|名称|引用方式|作用|
|---|---|---|
|[`okhttp-OkGo`](https://github.com/jeasonlzy/okhttp-OkGo)|`compile 'com.lzy.net:okgo:3.0.4'`|HTTP请求|
|[`fastjson`](https://github.com/alibaba/fastjson)|`compile 'com.alibaba:fastjson:1.2.46'`|回调转JSON|

## 自定义回调

ZJJsonCallback

```java
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.view.Window;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.lzy.okgo.callback.AbsCallback;
import com.lzy.okgo.request.base.Request;
import com.saitongedu.saitongplatformpad.config.ApiConfig;
import com.saitongedu.saitongplatformpad.model.ResultVo;
import com.saitongedu.saitongplatformpad.model.TUserBean;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

import okhttp3.Response;
import okhttp3.ResponseBody;

public abstract class ZJJsonCallback<T> extends AbsCallback<T> {

    private ProgressDialog dialog;
    Context mContext = null;
    private Boolean showProgress = true;
    TypeReference<T> type;

    public ZJJsonCallback() {
    }

    public ZJJsonCallback(Activity activity, Boolean showProgress, TypeReference<T> type) {
        this.showProgress = showProgress;
        this.type = type;
        mContext = activity;
        dialog = new ProgressDialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCanceledOnTouchOutside(false);
        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        dialog.setMessage("请求网络中...");
    }

    @Override
    public void onFinish() {
        if (dialog != null && dialog.isShowing()) {
            dialog.dismiss();
        }
    }

    @Override
    public void onStart(Request<T, ? extends Request> request) {
        super.onStart(request);

        if (dialog != null && !dialog.isShowing()) {
            if (this.showProgress) {
                dialog.show();
            }
        }
        // 主要用于在所有请求之前添加公共的请求头或请求参数
        // 例如登录授权的 token
        Object spusermodel = SPUtils.get(mContext, "spusermodel", "");
        if (!"".equals(spusermodel)) {
            TUserBean user = JSON.parseObject(spusermodel.toString(), TUserBean.class);
            request.params("token", user.getToken());
        }

    }
    
    @Override
    public T convertResponse(Response response) throws Throwable {

        if (response.isSuccessful()) {
            String bodyInfo = "";
            //防止OOM
            try {
                ResponseBody body = response.body();
                bodyInfo = inputStream2String(body.byteStream());
                body.close();

                return JSON.parseObject(bodyInfo, type);
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        return null;
    }

    public String inputStream2String(InputStream in) throws IOException {
        StringBuffer out = new StringBuffer();
        byte[] b = new byte[4096];
        for (int n; (n = in.read(b)) != -1; ) {
            out.append(new String(b, 0, n));
        }
        return out.toString();
    }
}
```

ZJStringCallback

```java
import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.view.Window;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.lzy.okgo.callback.AbsCallback;
import com.lzy.okgo.request.base.Request;
import com.saitongedu.saitongplatformpad.model.TUserBean;

import java.io.IOException;
import java.io.InputStream;

import okhttp3.Response;
import okhttp3.ResponseBody;

public abstract class ZJStringCallback extends AbsCallback<String> {

    private ProgressDialog dialog;
    Context mContext = null;
    private Boolean showProgress = true;

    public ZJStringCallback() {
    }

    public ZJStringCallback(Activity activity, Boolean showProgress) {
        this.showProgress = showProgress;
        mContext = activity;
        dialog = new ProgressDialog(activity);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setCanceledOnTouchOutside(false);
        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        dialog.setMessage("请求网络中...");
    }

    @Override
    public void onFinish() {
        if (dialog != null && dialog.isShowing()) {
            dialog.dismiss();
        }
    }

    @Override
    public void onStart(Request<String, ? extends Request> request) {
        super.onStart(request);

        if (dialog != null && !dialog.isShowing()) {
            if (this.showProgress) {
                dialog.show();
            }
        }
        // 主要用于在所有请求之前添加公共的请求头或请求参数
        // 例如登录授权的 token
        Object spusermodel = SPUtils.get(mContext, "spusermodel", "");
        if (!"".equals(spusermodel)) {
            TUserBean user = JSON.parseObject(spusermodel.toString(), TUserBean.class);
            request.params("token", user.getToken());
        }

    }

    /**
     * 该方法是子线程处理，不能做ui相关的工作
     * 主要作用是解析网络返回的 response 对象,生产onSuccess回调中需要的数据对象
     * 这里的解析工作不同的业务逻辑基本都不一样,所以需要自己实现,以下给出的时模板代码,实际使用根据需要修改
     */
    @Override
    public String convertResponse(Response response) throws Throwable {

        if (response.isSuccessful()) {
            String bodyInfo = "";
            //防止OOM
            try {
                ResponseBody body = response.body();
                bodyInfo = inputStream2String(body.byteStream());
                body.close();
                response.close();
                return bodyInfo;
            } catch (Exception e) {
                e.printStackTrace();
            }

        }
        return null;
    }

    public String inputStream2String(InputStream in) throws IOException {
        StringBuffer out = new StringBuffer();
        byte[] b = new byte[4096];
        for (int n; (n = in.read(b)) != -1; ) {
            out.append(new String(b, 0, n));
        }
        return out.toString();
    }
}
```

## 调用方式

JsonCallback

```kotlin
OkGo.post<ResultVo<String>>(ApiConfig.userapi_login)
    .params("loginname", "zhangjian")
    .params("loginpwd", "wangning")
    .params("device", "pad")
    .execute(object : ZJJsonCallback<ResultVo<String>>(
        this,
        true,
        object : TypeReference<ResultVo<String>>(){}
    ) {
        override fun onSuccess(response: Response<ResultVo<String>>) {
            val result = response.body()
            if (result.code == 0) {

            }
        }
    })
```

StringCallback

```kotlin
OkGo.post<String>(ApiConfig.userapi_login)
    .params("loginname", "zhangjian")
    .params("loginpwd", "wangning")
    .params("device", "pad")
    .execute(object : ZJStringCallback(this,true){
        override fun onSuccess(response: Response<String>?) {
            L.i(response!!.body())
        }
    })
```

