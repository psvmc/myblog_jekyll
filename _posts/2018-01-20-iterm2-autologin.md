---

layout: post
title: iTerm2设置自动登录
description: iTerm2设置自动登录
keywords: 
    - centos
categories: 
        - centos
        - iterm

---

## 下载地址

+ [`iTerm2`](http://www.iterm2.com/)系统终端增强版



该软件有个小问题：复制粘贴时如果缩放窗口会导致粘贴的内容错乱  

解决方式：  



![20180121151654529428877.jpg](http://image.psvmc.cn/20180121151654529428877.jpg)



![20180121151654541579314.jpg](http://image.psvmc.cn/20180121151654541579314.jpg)

其实就是让窗口`底部全屏`了  这样就不能缩放了

##  配置文件

```bash
#!/usr/bin/expect

set timeout 30
spawn ssh -p 22 [lindex $argv 0]@[lindex $argv 1]
expect {
    "(yes/no)?"
    {send "yes\n";exp_continue}
    "password:"
    {send "[lindex $argv 2]\n"}
}
interact 
```

把配置文件命名为`login.exp` 放在`/usr/local/bin`目录下   

设置访问权限 

```
chmod 777 /usr/local/bin/login.exp
```

如下图设置

![5a62db3fb27da.jpg](https://i.loli.net/2018/01/20/5a62db3fb27da.jpg)



