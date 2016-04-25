---

layout: post
title: 服务器备份至百度云
description: 服务器备份至百度云
keywords: vps
categories: linux

---
## 安装
+ 下载文件  
`wget https://github.com/oott123/bpcs_uploader/zipball/master`
+ 解压  
`unzip master`
+ 重命名文件夹  
`mv oott123-bpcs_uploader-3a75324 psvmc`
+ 进入目录  
`cd psvmc`
+ 设置权限  
`chmod +x bpcs_uploader.php`
+ 运行  
`./bpcs_uploader.php quickinit`
+ 询问是否继续 输入y 回车
+ 打开浏览器访问网址  
`https://openapi.baidu.com/device`
+ 输入提示的用户码 授权成功
+ 返回ssh工具 回车

## 常用命令
+ 查询容量  
`./bpcs_uploader.php quota`
+ 上传文件  
`./bpcs_uploader.php upload [path_local] [path_remote]`  
> 路径格式：  
> foo/bar/file.ext（路径中一定要包括文件名） 上传后，能在百度网盘/我的应用数据/应用名/foo/bar下找到一个叫file.ext的文件。

+ 下载文件  
`./bpcs_uploader.php download [path_local] [path_remote]`  
+ 删除文件   
`./bpcs_uploader.php delete [path_remote]`
+ 离线下载   
`./bpcs_uploader.php fetch [path_remote] [path_to_fetch]`
 
