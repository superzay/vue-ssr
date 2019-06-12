# 基于vue-cli单页应用的完整ssr服务端渲染案例

#### 介绍
基于vue-cli单页应用的完整ssr服务端渲染案例，包含数据请求，接口验证，开发环境配置，生产环境部署

#### 致谢
本案例参考自奋飞同学的https://blog.csdn.net/ligang2585116/article/details/78533793 文档，并在此基础上进行修改扩充得到，在此表示感谢

#### 在线演示地址
http://47.110.129.207:8088


#### 使用说明

1. 克隆仓库至本地
2. 进入项目根目录，安装项目依赖，npm install
3. 修改node_modules\vue-loader\lib\template-compiler\index.js文件，找到prettier.format(code, { semi: false, parser: 'babylon' })改为prettier.format(code, { semi: false, parser: 'babel' })
3. 项目中附有完整的搭建过程和相关说明文档，请务必先了解文档
4. 有问题可联系qq369457642讨论交流

