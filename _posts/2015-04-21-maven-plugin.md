---

layout: post
title: maven常用的插件
description: maven常用的插件
keywords: maven
category: maven

---

## 编译
	<plugin>
		<groupId>org.apache.maven.plugins</groupId>
		<artifactId>maven-compiler-plugin</artifactId>
		<configuration>
			<source>1.6</source>
			<target>1.6</target>
		</configuration>
	</plugin>

## 打war包
	<plugin>
		<groupId>org.apache.maven.plugins</groupId>
		<artifactId>maven-war-plugin</artifactId>
		<version>2.1.1</version>
		<configuration>
			<warName>guancheng</warName>
		</configuration>
	</plugin>

## tomcat
	<plugin>
		<groupId>org.apache.tomcat.maven</groupId>
		<artifactId>tomcat7-maven-plugin</artifactId>
		<version>2.1</version>
		<configuration>
			<path>/</path>
			<port>8080</port>
			<uriEncoding>UTF-8</uriEncoding>
		</configuration>
	</plugin>