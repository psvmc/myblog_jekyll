---

layout: post
title: maven仓库
description: 常用的maven仓库
keywords: maven
category: maven

---

## 开源中国
	<repository>
		<id>nexus</id>
		<name>local private nexus</name>
		<url>http://maven.oschina.net/content/groups/public/</url>
		<releases>
			<enabled>true</enabled>
		</releases>
		<snapshots>
			<enabled>false</enabled>
		</snapshots>
	</repository>
## sonatype
	<repository>
		<id>oss-sonatype-snapshots</id>
		<name>OSS Sonatype Snapshots Repository</name>
		<url>http://oss.sonatype.org/content/repositories/snapshots</url>
		<releases>
			<enabled>false</enabled>
		</releases>
		<snapshots>
			<enabled>true</enabled>
		</snapshots>
	</repository>
## sun
	<repository>
		<id>sun</id>
		<name>sun</name>
		<url>https://repository.jboss.org/nexus/content/groups/public-jboss/</url>
		<releases>
			<enabled>false</enabled>
		</releases>
		<snapshots>
			<enabled>true</enabled>
		</snapshots>
	</repository>
## alfresco
	<repository>
		<id>alfresco.public</id>
		<name>Alfresco Public Repository</name>
		<url>https://maven.alfresco.com/nexus/content/groups/public</url>
		<releases>
			<enabled>true</enabled>
		</releases>
		<snapshots>
			<enabled>false</enabled>
		</snapshots>
	</repository>
## spring
	<repository>
		<id>springsource-repo</id>
		<name>SpringSource Repository</name>
		<url>http://repo.springsource.org/release</url>
	</repository>
