# 996Cloud

> 996Cloud——您的云，您的数据，您的方式! 


在使用其他家网盘上，有诸多的限制，想了下自己也有服务器，可以自己做个私有云盘用，于是立了这个项目。

本打算用owncloud 但是无耐php玩不溜，配置繁琐，在加上用不上那么多功能，就决定自己写一个私有云盘使用，顺便也学习了相关技术。


## 演示地址

#### [演示地址](https://dome.cloud.996ico.cn/)

**演示账号：admin 密码：admin**
####大家也可以下载配套App 可以更方便在手机上操作文件（目前仅支持安卓版本，暂不开源）

[App下载地址](http://cloud.996ico.cn/cloudApp/996Cloud.apk)

**功能特点：**
1. 文件上传下载（速度决定你的网速和服务器的带宽、支持断点续传【仅在电脑端】。大文件建议在电脑上传）
2. 文件在线解压、压缩(仅在电脑端)
3. 分享文件，公开分享、私密密码分享（均可以设置失效时长）
3. 图片、视频在线预览
5. 收藏文件，把自己常用的文件进行收藏归类
6. 对文件基本操作（增删改查）
7. 响应式布局，手机浏览器可以正常使用（建议使用好的浏览器，没做兼容处理）
7. 其他功能请大家自行体验

**关于安全不全这事不能是绝对，我也不能保证，当然我会进行持续更新增加安全**

**温馨提示：请事先安装后node环境和mysql，redis以及vue环境**

**本项目开源只为学习方便使用，请勿用作其他用途。如有违法操作后果自负**
### 搭建请先进入/service/config/index.js 配置相关信息
> 相关信息文件有备注，自行查看配置
> 数据库创建并且配置好，表会自动创建

### 开始搭建
``` bash
# 安装依赖
npm install

# 本地运行地址 localhost:3303
npm run serve

# 打包
npm run build
```
### 服务端（进入目录 /service）
``` bash
# 运行
node app.js
# 本地运行地址 localhost:3002
```

### 使用技术

> 前端：vue element-ui vuex

> 后端：node - koa2 - 以及一些自己封装的模块

> 数据库: mysql - redis

> 如果发现有侵权行为，请及时和我联系。

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
