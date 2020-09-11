# 小程序直播demo

## 项目说明

本项目为直播带货场景化demo，其中包含了腾讯云即时通信IM SDK以及直播带货场景化SDK im-live-sells(TLS)的使用例子，调用关系如下

`小程序demo > TLS SDK> IM SDK> > Serverless > Mysql`

## 线上体验地址

 <img src="https://main.qcloudimg.com/raw/17a62d60c914556479f2c188641fb2f0.png" width = "200" height = "200" alt="图片名称" align=center />

## 项目配置

### 概述

主要有以下几部分需要配置，需要自行搭建云函数服务，预计耗时1-2小时：

- IM
- 小程序
- Mysql
- Serverless

### IM配置

- 创建即时通信 IM 应用，记录sdkappid，后续使用
- 创建直播群 (AVChatRoom)，`记录群id`，后续使用

### 小程序配置

- 在小程序开发者工具创建项目，目录指向client/，使用自己申请的小程序appid或测试号
- 打开client/src/commom/const.js，填入上面提到IM的sdkappid，HOST先不填，后面补上

```javascript
export default {
    HOST: "",
    IMSDKAPPID: 123456789
}
```

- 设置，`不校验合法域名、web-view、TLS版本及HTTPS证书`
- 此时接口还无法调通，需要继续设置mysql和serverless
- 在小程序目录下打开终端，执行依赖安装

```javascript
//安装依赖
npm i
//开发环境启动
npm run dev
//生产环境启动
npm run build
```

### Mysql配置

开通腾讯云Mysql实例，创建表`anchor`、`follow`、`gift`、`like`、`room`、`send_gift`、`user`

执行sql/all.sql，生成表结构及数据，并修改room表的`im_id`为IM配置时创建的`群id`


### Serverless配置

- 开通腾讯云函数
- 创建云函数
  - 把server文件夹里的云函数代码录入，可以手工录入，也可以在VSCode里安装插件录入，上传需要安装依赖，参考<https://cloud.tencent.com/document/product/583/37511>
  - 录入云函数依赖的环境变量，DB配置可以只录入测试环境，现在测试环境跑通。觉得手动录入比较慢，可以在线调用脚本加速，参考<https://console.cloud.tencent.com/api/explorer?Product=scf&Version=2018-04-16&Action=UpdateFunctionConfiguration&SignVersion=>
  - 所属网络和所属子网，与Mysqy保持一致

|环境变量|说明|
|:------|:-----:|
|DB_PROD_HOST| 生产db的host，即ip|
|DB_PROD_USER| 生产db的用户名|
|DB_PROD_PORT| 生产db的端口号|
|DB_PROD_PASSWORD| 生产db的密码|
|DB_PROD_DATABASE| 生产db的库名|
|appid| 小程序appid|
|appsecrete| 小程序的appsecrete|
|DB_TEST_DATABASE| 测试db的库名|
|sdkAppId| im的sdkAppId|
|sdkSecret| im的sdkSecret|
|DB_TEST_PASSWORD| 测试db的密码|
|DB_TEST_USER| 测试db的用户名|
|DB_TEST_HOST| 测试db的host，即ip|
|DB_TEST_PORT| 测试db的端口号|

- 录入API网关触发器
  - 创建触发器，选择API网关触发器
  - 选择使用已有的API服务，后续录入的触发器使用同一个API服务（这样服务域名可以保持一致）
  - 其他选项默认，保存之后出现访问路径如：

  ``` text
  https://service-xxxx-123456.gz.apigw.tencentcs.com/release/getRoomList
  ```

  - 在浏览器打开访问路径，看是否正常返回数据
  - 回到小程序的client/src/commom/const.js文件，把访问路径前缀填入HOST，如:

  ``` text
  https://service-xxxx-123456.gz.apigw.tencentcs.com/release
  ```

## 运行

刷新小程序，接口能跑通，就能看到页面效果

## 相关地址

- IM文档：<https://cloud.tencent.com/document/product/269/42440>
- 小程序直播SDK文档：<https://cloud.tencent.com/document/product/269/44527>