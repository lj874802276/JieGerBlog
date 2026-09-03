---
title: 本地MySQL8.0 安装 + 宝塔5.7双库共存完整笔记
published: 2026-09-02
description: Windows + 宝塔面板 + 双数据库同时运行
tags:
  - 数据库
  - mysql
  - 宝塔
category: 技术
draft: false
comment: true
image: /covers/ben-di-mysql8-0-an-zhuang-bao-ta-5-7-shuang-ku-gong-cun-wan-zheng-bi-ji-1788438251461.webp
---

## 一、安装前说明

- 本机已安装：宝塔 MySQL 5.7
- 本次安装：MySQL 8.0.36
- 端口方案：宝塔 5.7 改端口，MySQL 8.0 默认 `3306`
- 目标：两个数据库同时运行、互不冲突

## 二、MySQL 8.0 安装图文步骤（逐页操作）

1. **选择安装类型**
   选择 `Server Only`（仅安装服务端，最纯净），点击 `Next`。
2. **安装依赖（VC++ 运行库）**
   点击 `Execute`，等待自动安装完成，点击 `Next`。
3. **端口与运行模式【关键】**
   - Config Type：`Development Computer`（开发模式，不影响功能）
   - Port：`3306`（默认）
   - 勾选：`TCP/IP`、`Open Windows Firewall ports`
   - 不勾选：`Named Pipe`、`Shared Memory`
   - 点击 `Next`
4. **认证方式【必选，否则老工具连不上】**
   选择 `Use Legacy Authentication Method`（保留 5.x 兼容），点击 `Next`。
5. **设置 root 密码**
   输入自定义密码、重复密码，无需新建用户，点击 `Next`。
6. **Windows 服务配置**
   - Service Name：`MySQL80`（默认）
   - 勾选：开机自启
   - 运行账户：`Standard System Account`
   - 点击 `Next`
7. **权限配置**
   保持默认第一项，点击 `Next`。
8. **执行安装**
   点击 `Execute`，等待全部打勾，点击 `Finish` 完成。

## 三、MySQL 8.0 环境变量配置

默认路径：

```
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

配置步骤：

1. 此电脑 → 属性 → 高级系统设置 → 环境变量
2. 系统变量 → Path → 编辑
3. 新建 → 粘贴上面路径
4. 保存
5. 生效方式：关闭所有 CMD，重新打开

## 四、双数据库登录命令

```bash
# 登录 MySQL 8.0
mysql -u root -p -P3306

# 登录宝塔 MySQL 5.7（端口改成你自定义的）
mysql -u root -p -P你修改的端口
```

## 五、Navicat 连接双数据库

**MySQL 8.0**

- 主机：`127.0.0.1`
- 端口：`3306`
- 用户名：`root`
- 密码：安装时设置的密码

**宝塔 MySQL 5.7**

- 主机：`127.0.0.1`
- 端口：你修改后的端口
- 用户名：`root`
- 密码：宝塔数据库密码

## 六、常用命令

```sql
select version();    -- 查看版本
show databases;      -- 查看数据库
exit;                -- 退出
```

## 七、重要注意事项

- 两个数据库端口不能一样，否则冲突
- 必须选兼容认证模式，否则 Navicat 连不上
- Development 模式不影响功能，只是省内存
- 环境变量配置后必须重启 CMD
- 两个数据库完全独立，数据不互通
