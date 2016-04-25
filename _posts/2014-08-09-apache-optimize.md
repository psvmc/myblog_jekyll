---   
   
layout: post   
title: apache调优   
description: apache调优   
keywords: apache调优   
category: apache   
   
---   
## Apache服务器的优化   
上面两节，讲了大量的理论与实际工作中碰到的相关案例，现在就来讲一下在我们第一天和第二天中的ApacheHttp Server + Tomcat这样的架构，怎么来做优化吧。        
   
   
### Linux/UnixLinux系统下Apache 并发数的优化   
Apache Http Server在刚安装完后是没有并发数的控制的，它采用一个默认的值，那么我们的Web Server硬件很好，允许我们撑到1000个并发即VU，而因为我们没有去配置导致我们的WebServer连300个并发都撑不到，你们认为，这是谁的责任？   
Apache Http服务器采用prefork或者是worker两种并发控制模式。        
        
   
#### preforkMPM   
使用多个子进程，每个子进程只有一个线程。        
        
每个进程在某个确定的时间只能维持一个连接。        
        
在大多数平台上，PreforkMPM在效率上要比Worker MPM要高，但是内存使用大得多。        
prefork的无线程设计在某些情况下将比worker更有优势：它可以使用那些没有处理好线程安全的第三方模块，并且对于那些线程调试困难的平台而言，它也更容易调试一些。        
   
#### workerMPM     
使用多个子进程，每个子进程有多个线程。        
每个线程在某个确定的时间只能维持一个连接。        
通常来说，在一个高流量的HTTP服务器上，Worker MPM是个比较好的选择，因为Worker MPM的内存使用比PreforkMPM要低得多。        
但worker MPM也由不完善的地方，如果一个线程崩溃，整个进程就会连同其所有线程一起"死掉".由于线程共享内存空间，所以一个程序在运行时必须被系统识别为"每个线程都是安全的"。        
      
一般来说我们的ApacheHttp Server都是装在Unix/Linux下的，而且是采用源码编译的方式来安装的，我们能够指定在编译时Apache就采用哪种模式，为了明确我们目前的Apache采用的是哪种模式在工作，我们还可以使用httpd –l命令即在Apache的bin目录下执行httpd –l，来确认我们使用的是哪种模式。        
      
这边，我们使用Apache配置语言中的" IfModule"来自动选择模式的配置。        
      
我们的ApacheHttp Server在配完后一般是没有这样的配置的，是需要你手动的添加如下这样的一块内容的，我们来看，在httpd.conf文件中定位到最后一行LoadModule，敲入回车，加入如下内容：   
   
	<IfModule prefork.c>   
	ServerLimit  20000   
	StartServers  5   
	MinSpareServers  5   
	MaxSpareServers  10   
	MaxClients  1000   
	MaxRequestsPerChild 0   
	</IfModule>   
   
上述参数解释：
   
##### ServerLimit     20000   

默认的MaxClient最大是256个线程,如果想设置更大的值，就的加上ServerLimit这个参数。        
20000是ServerLimit这个参数的最大值。        
如果需要更大，则必须编译apache,此前都是不需要重新编译Apache。        
生效前提：必须放在其他指令的前面 
  
##### StartServers  5   

指定服务器启动时建立的子进程数量，prefork默认为5。        
    
##### MinSpareServers  5 
  
指定空闲子进程的最小数量，默认为5。        
如果当前空闲子进程数少于MinSpareServers ，那么Apache将以最大每秒一个的速度产生新的子进程。        
此参数不要设的太大。        
   
##### MaxSpareServers  10   

设置空闲子进程的最大数量，默认为10。        
如果当前有超过MaxSpareServers数量的空闲子进程，那么父进程将杀死多余的子进程。        
此参数不要设的太大。        
如果你将该指令的值设置为比MinSpareServers小，Apache将会自动将其修改成"MinSpareServers+1"。        
   
##### MaxClients  256 
  
限定同一时间客户端最大接入请求的数量(单个进程并发线程数)，默认为256。        
任何超过MaxClients限制的请求都将进入等候队列,一旦一个链接被释放，队列中的请求将得到服务。        
要增大这个值，你必须同时增大ServerLimit。        
   
##### MaxRequestsPerChild10000
   
每个子进程在其生存期内允许伺服的最大请求数量，默认为10000.到达MaxRequestsPerChild的限制后，子进程将会结束。        
如果MaxRequestsPerChild为"0"，子进程将永远不会结束。        
   
将MaxRequestsPerChild设置成非零值有两个好处：    
    
+ 可以防止(偶然的)内存泄漏无限进行，从而耗尽内存。           
+ 给进程一个有限寿命，从而有助于当服务器负载减轻的时候减少活动进程的数量。        
   
#### Prefork.c的工作方式

一个单独的控制进程(父进程)负责产生子进程，这些子进程用于监听请求并作出应答。        
Apache总是试图保持一些备用的(spare)或者是空闲的子进程用于迎接即将到来的请求。        
这样客户端就不需要在得到服务前等候子进程的产生。        
在Unix系统中，父进程通常以root身份运行以便邦定80端口，而Apache产生的子进程通常以一个低特权的用户运行。         
User和Group指令用于设置子进程的低特权用户。        
运行子进程的用户必须要对它所服务的内容有读取的权限，但是对服务内容之外的其他资源必须拥有尽可能少的权限。        
   
在上述的</IfModule>后再加入一个"<IfModule>"如下内容：    
   
	<IfModule prefork.c>   
	ServerLimit  20000   
	StartServers  5   
	MinSpareServers  5   
	MaxSpareServers  10   
	MaxClients  1000   
	MaxRequestsPerChild 0   
	</IfModule>   
	<IfModule worker.c>   
	ServerLimit  50   
	ThreadLimit  200   
	StartServers  5   
	MaxClients  5000   
	MinSpareThreads  25   
	MaxSpareThreads  500   
	ThreadsPerChild  100   
	MaxRequestsPerChild 0   
	</IfModule>   
   
上述参数解释：
   
##### ServerLimit16 
  
服务器允许配置的进程数上限。        
这个指令和ThreadLimit结合使用设置了MaxClients最大允许配置的数值。        
任何在重启期间对这个指令的改变都将被忽略，但对MaxClients的修改却会生效。        
   
##### ThreadLimit64 
  
每个子进程可配置的线程数上限。        
这个指令设置了每个子进程可配置的线程数ThreadsPerChild上限。        
任何在重启期间对这个指令的改变都将被忽略，但对ThreadsPerChild的修改却会生效。        
默认值是"64". 
  
##### StartServers3  
 
服务器启动时建立的子进程数，默认值是"3"。        
   
##### MinSpareThreads75 
  
最小空闲线程数,默认值是"75"。        
这个MPM将基于整个服务器监视空闲线程数。        
如果服务器中总的空闲线程数太少，子进程将产生新的空闲线程。        
   
##### MaxSpareThreads250
   
设置最大空闲线程数。        
默认值是"250"。        
这个MPM将基于整个服务器监视空闲线程数。        
如果服务器中总的空闲线程数太多，子进程将杀死多余的空闲线程。        
MaxSpareThreads的取值范围是有限制的。        
Apache将按照如下限制自动修正你设置的值：worker要求其大于等于MinSpareThreads加上ThreadsPerChild的和  
 
##### MaxClients400   

允许同时伺服的最大接入请求数量(最大线程数量)。        
任何超过MaxClients限制的请求都将进入等候队列。        
默认值是"400",16(ServerLimit)乘以25(ThreadsPerChild)的结果。        
因此要增加MaxClients的时候，你必须同时增加ServerLimit的值。        
   
##### ThreadsPerChild25 
  
每个子进程建立的常驻的执行线程数。        
默认值是25。        
子进程在启动时建立这些线程后就不再建立新的线程了。        
   
##### MaxRequestsPerChild  0 
  
设置每个子进程在其生存期内允许伺服的最大请求数量。        
到达MaxRequestsPerChild的限制后，子进程将会结束。        
如果MaxRequestsPerChild为"0"，子进程将永远不会结束。        
   
将MaxRequestsPerChild设置成非零值有两个好处：      
   
+ 可以防止(偶然的)内存泄漏无限进行，从而耗尽内存。          
+ 给进程一个有限寿命，从而有助于当服务器负载减轻的时候减少活动进程的数量。        
   
注意     
对于KeepAlive链接，只有第一个请求会被计数。        
事实上，它改变了每个子进程限制最大链接数量的行为。        
   
#### Worker.c的工作方式
     
每个进程可以拥有的线程数量是固定的。        
服务器会根据负载情况增加或减少进程数量。        
一个单独的控制进程(父进程)负责子进程的建立。        
每个子进程可以建立ThreadsPerChild数量的服务线程和一个监听线程，该监听线程监听接入请求并将其传递给服务线程处理和应答。        
Apache总是试图维持一个备用(spare)或是空闲的服务线程池。        
这样，客户端无须等待新线程或新进程的建立即可得到处理。        
在Unix中，为了能够绑定80端口，父进程一般都是以root身份启动，随后，Apache以较低权限的用户建立子进程和线程。        
User和Group指令用于设置Apache子进程的权限。        
虽然子进程必须对其提供的内容拥有读权限，但应该尽可能给予它较少的特权。        
另外，除非使用了suexec，否则，这些指令设置的权限将被CGI脚本所继承。        
   
公式：   
ThreadLimit>= ThreadsPerChild   
MaxClients  <= ServerLimit * ThreadsPerChild  必须是ThreadsPerChild的倍数   
MaxSpareThreads>= MinSpareThreads+ThreadsPerChild   
硬限制：   
ServerLimi和ThreadLimit这两个指令决定了活动子进程数量和每个子进程中线程数量的硬限制。        
要想改变这个硬限制必须完全停止服务器然后再启动服务器(直接重启是不行的)。        
   
Apache在编译ServerLimit时内部有一个硬性的限制，你不能超越这个限制。        
   
preforkMPM最大为"ServerLimit200000"      
其它MPM(包括work MPM)最大为"ServerLimit 20000       
Apache在编译ThreadLimit时内部有一个硬性的限制，你不能超越这个限制。        
   
mpm_winnt是"ThreadLimit 15000"   
其它MPM(包括work prefork)为"ThreadLimit 20000        
注意    
使用ServerLimit和ThreadLimit时要特别当心。         
如果将ServerLimit和ThreadLimit设置成一个高出实际需要许多的值，将会有过多的共享内存被分配。         
当设置成超过系统的处理能力，Apache可能无法启动，或者系统将变得不稳定。         
    
### WindowsWindows系统下Apache 并发数的优化 
   
以上是Linux/Unix下的Apache的并发数优化配置，如果我们打入了httpd –l如下显示：    
    
怎么办？
    
##### 步骤一  
  
先修改/path/apache/conf/httpd.conf文件。         
    
httpd.conf    
将“#Includeconf/extra/httpd-mpm.conf"前面的 “#" 去掉，保存。         
   
##### 步骤二 
  
再修改/apache安装目录/conf/extra/httpd-mpm.conf文件。        
   
在mpm_winnt模式下，Apache不使用prefork也不使用work工作模式，切记！   
因此，我们只要找到原文件中：   

	<IfModule mpm_winnt_module>   
	    ThreadsPerChild      150   
	    MaxRequestsPerChild    0   
	</IfModule>   
修改后   

	<IfModule mpm_winnt_module>   
	    ThreadsPerChild      500   
	    MaxRequestsPerChild    5000   
	</IfModule>   
上述参数解释：
   
##### ThreadsPerChild 
  
是指一个进程最多拥有的线程数（Windows版本，貌似不可以开启多个进程),一般100-500就可以，根据服务器的具体性能来决定。        
   
##### MaxRequestsPerChild 
  
是指一个线程最多可以接受的连接数，默认是0，就是不限制的意思，   
0极有可能会导致内存泄露。        
所以，可以根据实际情况，配置一个比较大的值。        
Apache会在几个线程之间进行轮询，找到负载最轻的一个线程来接受新的连接。        
   
注意：   
修改后，一定不要apacherestart，而是先 apache stop 然后再 apache start才可以。        
   
### 启用服务端图片压缩 
  
对于静态的html 文件，在apache 可加载mod_deflate.so 模块，把内容压缩后输出，可节约大量的传输带宽。        
   
打开httpd.conf文件，找到： 
  
	#LoadModule deflate_module modules/mod_deflate.so   
将前面的“#"去掉，变成：   
LoadModule deflate_module modules/mod_deflate.so   
然后在最后一行的LoadModule处，加入如下的几行：  
 
	<IfModule mod_deflate.c>   
	 DeflateCompressionLevel 7   
	 AddOutputFilterByType DEFLATE text/html text/plain text/xml application/x-httpd-php   
	 AddOutputFilter DEFLATE css js   
	</IfModule>  
 
注意：   
默认等级是6，而且9级需要更多的CPU时间，用默认的6级就可以了。        
   
要注意的是,在apache 2.2.15中,我用httpd -l看,居然发现mod_deflat已经内置了，所以其实就不用再在httpd.conf中增加loadmodule了,否则会说出错的  
 
### Apache中将MS办公文档自动关联客户端的MS-Office 
  
我们经常会在web页的一个超链接上点一个指向物理文件的文档，我们一般会得到“保存，另存为，打开"，3个选项，当我们打开的如果是一个MS文档，在选“打开"选项时IE会自动启用客户端上装有的word或者是excel等相关MS办公工具去打开，这个怎么做呢？很简单。        
   
打开httpd.conf，找到：   

    AddType application/x-compress .Z   
    AddType application/x-gzip .gz .tgz  
 
在其后敲入一个回车，加入：   
   
	AddType application/vnd.openxmlformats  docx pptx xlsx doc xls ppt txt  
 
重启Apache服务即可。        
   
### 防止DDOS攻击  
 
DDOS攻击即采用自动点击机器人或者连续点击工具不断的刷新某一个网址或者网页上的按钮，造成网站在一时间收到大量的HTTP请求，进而阻塞网站正常的HTTP通道甚至造成网站瘫痪。          
为了防止这一形式的攻击，我们一般把在一个按钮或者是一个请求在一秒内连续执行如：100次，可以认为是一种攻击（比如说你打开一个网页，点一下提交按钮，然后按住F5键不松开）。        
   
在Linux下的Apache HttpServer安装后会提供一个mod_evasive20的模块，用于防止这一形式的攻击，它的做法是：   
如果认为是一个DDOS攻击，它的防范手段采用如下两种形势：
   
+ 把这个请求相关联的IP，封锁30分钟   
+ 直接把相关的IP踢入黑名单，让其永不翻身  

 
设置：   
在你的Apache的httpd.conf文件中的最后一行“LoadModule"加入如下这句：   
LoadModule evasive20_module   /usr/lib/httpd/modules/mod_evasive20.so   
然后加入下面这几行  
 
	<IfModule mod_evasive20.c>   
	DOSHashTableSize 3097   
	DOSPageCount 15   
	DOSSiteCount 100   
	DOSPageInterval 1   
	DOSSiteInterval 1   
	DOSBlockingPeriod 36000   
	DOSEmailNotify 网站超级管理员@xxx.com   
	DOSLogDir "logs/mod_evasive"   
	</IfModule>   
核心参数解释：  
 
+ DOSHashTableSize3097 记录黑名单的尺寸   
+ DOSPageCount 每个页面被判断为dos攻击的读取次数   
+ DOSSiteCount 每个站点被判断为dos攻击的读取部件(object)的个数   
+ DOSPageInterval 读取页面间隔秒   
+ DOSSiteInterval 读取站点间隔秒   
+ DOSBlockingPeriod 被封时间间隔秒   

注意：   
上述设置是针对Linux/Unix下的Apache Server，相关的Windows下的Apache见如下设置：   
为Windows下的Apache加载mod_evasive模块   

+ 下载附件中的压缩包，解压并拷贝mod_dosevasive22.dll到Apache安装目录下的modules目录（当然也可以是其他目录，需要自己修改路径）。         
+ 修改Apache的配置文件http.conf。        
   
添加以下内容   

	LoadModule dosevasive22_module modules/mod_dosevasive22.dll   
	DOSHashTableSize 3097   
	DOSPageCount 3   
	DOSSiteCount 50   
	DOSPageInterval 1   
	DOSSiteInterval 1   
	DOSBlockingPeriod 10   
	
### Apache中设置URL含中文附件的下载/打开的方法（仅限Linux系统下） 
  
这个话题很有趣，起因是我们在工程中碰到了客户这样的一个需求：   

	<a href="xxx.xxx.xx/xx/xxx/轮胎损坏情况2007-05-05.jpg">损坏部件</a>  
 
看看好像没啥问题，一点这个超链接，因该是在IE中打开一个叫" 轮胎损坏情况2007-05-05.jpg"，嘿嘿，大家自己动手放一个带有中文名的这样的一个图片，看看能否被解析，解析不了。        
   
所以我们就说，真奇怪，我们上传图片都是上传时的图片名经上传组件解析过以后变成一个UUID或者是GUID一类的文件名如：gb19070122abcxd.jpg这样一种英文加数字组合的文件名，这样的文件名，Apache当然是可以解析的，客户坚持一定我上传的图片是中文名（连中文描述都不行），因为，客户说：我们是中国人，当然用中文图片名。        
      
   
没办法，找了半天，找到一篇日文的教程，还好还好，N年前学过一点点日语，照着教程把它啃下来了。        
   
这是一个日本人写的关于在Apache中支持以亚州文字命名文件名的一个“补丁"，叫“mod_encoding"。        
   
相关配置：   

+ 下载完后是一个这样的压缩包：mod_encoding-20021209.tar.gz   
+ 解压后使用：  

```
configure   
make   
make install  
```

</pre> 
在make这一行时，编译出错，报“make: *** [mod_encoding.so] Error 1"这样的错   
原因很明显，是regex.h未包含进来，解决办法也很简单：   
用vi打开mod_encoding.c，   
在#include <httpd.h>那一段的前面加上如下一行：
   
```objc
#include <regex.h>    
```

然后重新make再make install 搞定，CALL！！！   

+  编译后得到一个：mod_encoding.so的文件，然后在httpd.conf文件中加入下面这几行： 

```  
LoadModule encoding_module modules/mod_encoding.so   
Header add MS-Author-Via "DAV"   
<IfModule mod_encoding.c>   
  EncodingEngine    on   
  NormalizeUsername on   
  SetServerEncoding GBK   
  DefaultClientEncoding UTF-8 GBK GB2312   
  AddClientEncoding "(Microsoft .* DAV $)" UTF-8 GBK GB2312   
  AddClientEncoding "Microsoft .* DAV" UTF-8 GBK GB2312   
  AddClientEncoding "Microsoft-WebDAV*" UTF-8 GBK GB2312   
</IfModule>  
``` 

+  重启Apache，搞定，在apache中我们的url可以是中文名的附件了。        
   
###不可忽视的keepalive选项 
  
在Apache 服务器中，KeepAlive是一个布尔值，On 代表打开，Off 代表关闭，这个指令在其他众多的 HTTPD 服务器中都是存在的。        
   
KeepAlive 配置指令决定当处理完用户发起的 HTTP 请求后是否立即关闭 TCP 连接，如果 KeepAlive 设置为On，那么用户完成一次访问后，不会立即断开连接，如果还有请求，那么会继续在这一次 TCP 连接中完成，而不用重复建立新的 TCP 连接和关闭TCP 连接，可以提高用户访问速度。        
   
那么我们考虑3种情况：   

+ 用户浏览一个网页时，除了网页本身外，还引用了多个javascript 文件，多个css 文件，多个图片文件，并且这些文件都在同一个HTTP 服务器上。        
+ 用户浏览一个网页时，除了网页本身外，还引用一个javascript 文件，一个图片文件。        
+ 用户浏览的是一个动态网页，由程序即时生成内容，并且不引用其他内容。        
   
对于上面3中情况，我认为：1 最适合打开 KeepAlive ，2 随意，3 最适合关闭 KeepAlive   
　下面我来分析一下原因。        
   
在 Apache 中，打开和关闭 KeepAlive 功能，服务器端会有什么异同呢？   
先看看理论分析。        
   
打开KeepAlive 后，意味着每次用户完成全部访问后，都要保持一定时间后才关闭会关闭TCP 连接，那么在关闭连接之前，必然会有一个Apache进程对应于该用户而不能处理其他用户，假设KeepAlive 的超时时间为10 秒种，服务器每秒处理 50个独立用户访问，那么系统中 Apache 的总进程数就是 10 * 50 ＝ 500 个，如果一个进程占用 4M 内存，那么总共会消耗 2G内存，所以可以看出，在这种配置中，相当消耗内存，但好处是系统只处理了 50次 TCP 的握手和关闭操作。        
   
    
如果关闭KeepAlive，如果还是每秒50个用户访问，如果用户每次连续的请求数为3个，那么 Apache 的总进程数就是 50 * 3= 150 个，如果还是每个进程占用 4M 内存，那么总的内存消耗为 600M，这种配置能节省大量内存，但是，系统处理了 150 次 TCP的握手和关闭的操作，因此又会多消耗一些 CPU 资源。        
   
再看看实践的观察。        
   
我在一组大量处理动态网页内容的服务器中，起初打开KeepAlive功能，经常观察到用户访问量大时Apache进程数也非常多，系统频繁使用交换内存，系统不稳定，有时负载会出现较大波动。        
关闭了KeepAlive功能后，看到明显的变化是：Apache 的进程数减少了，空闲内存增加了，用于文件系统Cache的内存也增加了，CPU的开销增加了，但是服务更稳定了，系统负载也比较稳定，很少有负载大范围波动的情况，负载有一定程度的降低；变化不明显的是：访问量较少的时候，系统平均负载没有明显变化。        
   
总结一下：   
在内存非常充足的服务器上，不管是否关闭KeepAlive 功能，服务器性能不会有明显变化；   
如果服务器内存较少，或者服务器有非常大量的文件系统访问时，或者主要处理动态网页服务，关闭KeepAlive 后可以节省很多内存，而节省出来的内存用于文件系统Cache，可以提高文件系统访问的性能，并且系统会更加稳定。        
   
##### 补充1  
 
关于是否应该关闭 KeepAlive 选项，我觉得可以基于下面的一个公式来判断。        
   
　　在理想的网络连接状况下，系统的Apache 进程数和内存使用可以用如下公式表达：   
HttpdProcessNumber= KeepAliveTimeout * TotalRequestPerSecond / Average(KeepAliveRequests)   
HttpdUsedMemory= HttpdProcessNumber * MemoryPerHttpdProcess   
　　换成中文意思：   
总Apache进程数 = KeepAliveTimeout * 每秒种HTTP请求数 / 平均KeepAlive请求   
Apache占用内存 = 总Apache进程数 * 平均每进程占用内存数   
　　需要特别说明的是：   
[平均KeepAlive请求] 数，是指每个用户连接上服务器后，持续发出的 HTTP 请求数。        
当 KeepAliveTimeout 等 0或者 KeepAlive 关闭时，KeepAliveTimeout 不参与乘的运算从上面的公式看，如果 [每秒用户请求]多，[KeepAliveTimeout] 的值大，[平均KeepAlive请求] 的值小，都会造成 [Apache进程数] 多和 [内存]多，但是当 [平均KeepAlive请求] 的值越大时，[Apache进程数] 和 [内存] 都是趋向于减少的。        
   
基于上面的公式，我们就可以推算出当 平均KeepAlive请求 <= KeepAliveTimeout 时，关闭 KeepAlive 选项是划算的，否则就可以考虑打开。        
   
##### 补充2  
 
KeepAlive 该参数控制Apache是否允许在一个连接中有多个请求，默认打开。        
但对于大多数论坛类型站点来说，通常设置为off以关闭该支持。        
   
##### 补充3 
  
如果服务器前跑有应用squid服务，或者其它七层设备,KeepAlive On 设定要开启持续长连接   
实际在 前端有squid 的情况下,KeepAlive 很关键。        
记得On。        
   
Keeyalive不能随心所欲设置，而是需要根据实际情况，我们来看一个真实的在我工作中发生的搞笑一次事件：   
当时我已经离开该项目了，该项目的TeamLeader看到了keepalive的概念，他只看到了关闭keeyalive可以节省web服务器的内存，当时我们的web服务器只有4gb内存，而并发请求的量很大，因此他就把这个keepalive设成了off。        
   
然后直接导致脱机客户端（脱机客户端用的是.net然后webservice连接）的“login"每次都显示“出错"。        
   
一查代码才知道，由于这个脱机客户端使用的是webservice访问，.net开发团队在login功能中设了一个超时，30秒，30秒timeout后就认为服务器没有开启，结果呢由于原来的apache设的是keeyalive和timeout 15秒，现在被改成了off，好家伙，根本就没有了这个timeout概念，因此每次.net登录直接被apache弹回来，因为没有了这个timeout的接口了。        
   
由此可见，学东西。        
      
不能一知半解，务必求全面了解哈。        
   
### HostnameLookups设置为off 
  
尽量较少DNS查询的次数。        
如果你使用了任何"Allow fromdomain"或"Denyfrom domain"指令(也就是domain使用的是主机名而不是IP地址)，则代价是要进行两次DNS查询(一次正向和一次反向，以确认没有作假)。        
所以，为了得到最高的性能，应该避免使用这些指令(不用域名而用IP地址也是可以的)。      
> 文章来源
> <a href="http://blog.csdn.net/lifetragedy/article/details/7707455" title="Apache性能调优" target="_blank">csdn</a>  
