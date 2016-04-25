---

layout: post
title: iOS Android音频格式的选择
description: iOS Android音频格式的选择
keywords: ios,android,audio
categories: ios android audio

---

### 可选格式
ios android做音频相关的开发时可选用的格式有 `mp3`,`speex`,`aac`,`amr`,`ilbc`

### 已知应用

`amr`:`微信` `evemote`  

`speex`:`米聊`

### 文件格式大小
`mp3`>`aac`>`amr`/`ilbc`>`speex`

### 各个格式简介

+ `amr`：生成格式`相对较小`，Android原生支持，ios可用第三方库进行编码解码
+ `speex`：生成`文件最小`，Android、ios均需要用第三方库进行编码解码，支持声音的`降噪`等处理
+ `aac`：生成文件`相对较大`，Android，ios均支持，声音质量较好，比mp3文件小
+ `ilbc`：生成`文件较小`，ios 4.3以上支持，Android早期不支持可用第三方库
+ `mp3`：相比`文件最大`，比较流行的格式

### 个人推荐
相比下来，我还是比较推荐用amr格式，网上的教程多，又不像speex一样需要双方都编码解码，生成的文件也较小，比较适合做语音通话


     
