---

layout: post
title: 我的markdown样式
description: 我的markdown样式
keywords: markdown
category: markdown

---
## 样式

	* {
	    font-family:  "微软雅黑";
	}
	
	html {
	    padding: 0px;
	    margin: 0px;
	    color: #000;
	    background: #fff;
	    -webkit-text-size-adjust: 100%;
	    -ms-text-size-adjust: 100%;
	}
	
	body{
	    padding: 0px 10px;
	    margin: 0px;
	    border: 1px dashed  #0088cc;
	}
	
	hr{
	    margin: 20px 0px;
	    padding: 0px 0px;
	    border:none;
	    border-bottom: 1px dashed  #0088cc;
	}
	
	fieldset,img {
	    border: 0;
	}
	
	ol,ul {
	    list-style: none;
	}
	
	h1,h2,h3,h4,h5,h6 {
	    font-size: 100%;
	    font-weight: 500;
	}
	
	a:link {
	    color: #08c;
	}
	
	a:hover {
	    color: #08c;
	    text-decoration: none;
	}
	
	::-moz-selection {
	    background: #e1e1e8 none repeat scroll 0 0;
	    color: #FF9966;
	}
	
	::selection {
	    background: #e1e1e8 none repeat scroll 0 0;
	    color: #FF9966;
	}
	
	
	 h2 {
	    font-size: 22px;
	    margin: 0px 0px;
	    color: #FF7000;
	}
	
	 h3 {
	    font-size: 18px;
	    margin: 15px 0px;
	    color: #00B9B2;
	}
	
	 h4 {
	    font-size: 16px;
	    margin: 15px 0px;
	    color: #11B8E2;
	}
	
	 h5 {
	    font-size: 14px;
	    margin: 15px 0px;
	    color: #3AD3E0;
	}
	
	 pre {
	    margin: 15px 0px;
	    padding: 13px 20px;
	    background-color: #F4F4F6;
	    clear: both;
	    color: #22272A;
	    overflow: auto;
	    -webkit-border-radius: 2px;
	    -moz-border-radius: 2px;
	    border: 1px solid #eaeaea;
	    border-radius: 3px;
	    font-size: 14px;
	}
	
	 code {
	    background: #f6f6f6;
	    border: 1px solid #d0d0d0;
	    border-radius: 3px 3px;
	    line-height: 1.8;
	    vertical-align: baseline;
	    padding: 2px 5px;
	    margin: 0px 8px;
	    border: 1px solid #eaeaea;
	    border-radius: 3px;
	    font-size: 14px;
	}
	
	 pre code {
	    border: none;
	    margin: 0px 0px;
	    padding: 2px 0px;
	}
	
	 ul {
	    list-style-type: disc;
	    font-size: 14px;
	    line-height: 2.0;
	    margin-bottom: 24px;
	    padding-left: 20px;
	}
	
	 ol {
	    list-style-type: decimal-leading-zero;
	}
	
	 em {
	    font-style: italic;
	}
	
	 strong {
	    font-weight: bold;
	}
	
	 blockquote {
	    padding: 0px 10px;
	    margin: 0px 10px;
	    border-left: 3px solid #0088cc;
	    border-right: 1px solid #0088cc;
	    border-bottom: 1px solid #0088cc;
	    border-top: 1px solid #0088cc;
	    border-radius: 0 3px 3px 0;
	    text-align: left;
	    color: #8d8d8d;
	    font-style: italic;
	}
	
	 blockquote p {
	    color: #39CC74;
	    font-size: 14px;
	}
	
	 img {
	    margin: 20px 0 24px 0;
	    background: #f0f0f0;
	    padding: 4px 4px;
	    border: 1px solid #a8a8a8;
	    display: block;
	    opacity: 0.8;
	}
	
	 img:hover {
	    opacity: 1;
	}
	
	 table {
	    border-collapse: collapse;
	    border-spacing: 0;
	    position: relative;
	    margin-bottom: 1em;
	    color: #4d4d4d;
	}
	
	 table th, table td {
	    padding: 4px 0;
	    border: 1px solid #6db0e6;
	}
	
	 table th {
	    background: #6db0e6;
	    color: #fff;
	}
	th {
	    text-align: inherit;
	}
	
	 table th, table td {
	    text-indent: 6px;
	    padding: 0px 30px;
	    line-height: 2;
	}