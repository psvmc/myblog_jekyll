---

layout: post
title: linphone-sdk新版本适配
description: linphone-sdk新版本适配
keywords: ios
category: ios

---



## 废弃方法替换


```objc
LINPHONE_PUBLIC LINPHONE_DEPRECATED int linphone_core_get_default_proxy(LinphoneCore *lc, LinphoneProxyConfig **config);
替换为
LINPHONE_PUBLIC LinphoneProxyConfig * linphone_core_get_default_proxy_config(LinphoneCore *lc);
```


```objc
LINPHONE_PUBLIC LINPHONE_DEPRECATED LinphoneStatus linphone_core_decline_call(LinphoneCore *lc, LinphoneCall * call, LinphoneReason reason);
替换为
LINPHONE_PUBLIC LinphoneStatus linphone_call_decline(LinphoneCall * call, LinphoneReason reason);
```

```objc
LINPHONE_PUBLIC LINPHONE_DEPRECATED const char *linphone_proxy_config_get_identity(const LinphoneProxyConfig *cfg);
替换为
LINPHONE_PUBLIC const LinphoneAddress *linphone_proxy_config_get_identity_address(const LinphoneProxyConfig *cfg);
```

```objc
ms_init();
替换为
ms_factory_new();
ms_factory_new_with_voip();
```