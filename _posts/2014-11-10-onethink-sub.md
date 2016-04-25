---

layout: post
title: Onethink使用总结
description: Onethink使用总结
keywords: onethink
category: php

---
## 多级菜单
	<think:nav name="nav" tree="true">
		<li>
			<a href="{$nav.url|get_nav_url}">{$nav.title}</a>
			<if condition="is_array($nav['_'])">
			<ul>
				<volist name="nav['_']" id="vo">
				<li>
					<a href="{$vo.url|get_nav_url}">{$vo.title}</a>
				</li>
				</volist>
			</ul>
			</if>
		</li>
	</think:nav>
