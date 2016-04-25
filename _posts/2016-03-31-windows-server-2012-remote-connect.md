---

layout: post
title: 远程连接Windows Server 2012
description: 远程连接Windows Server 2012
keywords: windows
category: windows

---

## 远程连接

### mac客户端

MAC远程连接Windows客户端[下载地址](https://www.microsoft.com/zh-CN/download/details.aspx?id=18140)

### 安装服务器后注意事项

+ 1）打开防火墙（不要为了省事就关闭防火墙）  
+ 2）添加入站规则 添加3389(远程连接的端口)信任
+ 3) 开启远程连接

这时候windows下远程连接能连，mac下不能连解决方法

+ 点击`开始` > `运行`
+ 键入`gpedit.msc`
+ 在左侧栏中，展开`计算机配置` -> `管理模板` -> `Windows组件` -> `远程桌面服务` -> `远程桌面会话主机` -> `安全`
+ 设置`远程（RDP）连接要求使用指定安全层`为`已启用`，并选择`安全层`为`RDP`。
+ 设置`使用网络级身份验证要求进行远程连接用户身份验证`为`已禁用`。
+ 关闭组策略编辑器并重新启动计算机使更改生效。