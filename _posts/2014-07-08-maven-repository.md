---

layout: post
title: maven仓库
description: 常用的maven仓库
keywords: maven
category: maven

---

## 阿里云

```xml
<repository>
    <id>maven-ali</id>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <releases>
        <enabled>true</enabled>
    </releases>
    <snapshots>
        <enabled>true</enabled>
        <updatePolicy>always</updatePolicy>
        <checksumPolicy>fail</checksumPolicy>
    </snapshots>
</repository>
```
	

## sonatype

```xml
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
```

## sun

```xml
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
```


## alfresco

```xml
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
```
	

## spring

```xml
<repository>
	<id>springsource-repo</id>
	<name>SpringSource Repository</name>
	<url>http://repo.springsource.org/release</url>
</repository>
```
