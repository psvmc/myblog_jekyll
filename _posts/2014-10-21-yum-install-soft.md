---

layout: post
title: linux用yum安装软件
description: linux用yum安装软件
keywords: yum
category: linux

---

## 安装php5.4
+ 添加源   
`wget -q -O - http://www.atomicorp.com/installers/atomic | sh`
+ 安装  
`yum install php php-cli php-gd php-mysql php-eaccelerator php-zend-optimizer  php-pear php-snmp php-bcmath php-mcrypt php-mhash php-soap php-xml php-xmlrpc`
+ 查询版本  
`yum info php | grep Version` 