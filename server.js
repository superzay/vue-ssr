const express = require('express');
var cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const fs = require('fs')
const path = require('path')
const vueRenderer = require('vue-server-renderer')

//定义服务器/客户端环境
global.TERMINAL = 'server';

//获取客户端和服务端打包文件经过处理生成的2个json文件
//此处我们使用vueRenderer.createBundleRenderer()方法生成的bundleRenderer渲染器
//正常如果使用vueRenderer.createRenderer()方法生成的render渲染器，则只需要服务端原始打包文件
//然后构造出的只是路由对应的html结构，而非整个页面。完整的html页面还需要自己手动构造，比较麻烦，参考官方文档和相关视频
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const template = fs.readFileSync(path.resolve(__dirname, './src/index-template.html'), 'utf-8')

// 创建渲染器
const bundleRenderer = vueRenderer.createBundleRenderer(serverBundle, {
	runInNewContext: false, // 推荐
	template: template, // 模板html文件
	clientManifest: clientManifest, // client manifest
})

//定义静态资源目录,实际部署时，进行相应调整
app.use('/static', express.static(__dirname + '/dist/static'));

//定义路由响应
app.get('*', async(req, res) => {
	let cookie = '';
	Object.keys(req.cookies).forEach((item, index) => {
		cookie = cookie + item + '=' + req.cookies[item] + ';';
	});
	let context = {
		url: req.url,
		cookie: cookie //向entry-server.js模块传递cookie,最终会传递给app.js模块，并挂载到vue原型下
	}
	//bundleRenderer.renderToString（）方法调用后，会执行severBundle的逻辑
	//serverBundle抛出的错误会传递给下面回调函数中的err
	//传递进路由信息，使用渲染器生成最终html文件，
	//renderToString函数也可以返回一个promise对象，使用then回调的写法
	//serverBundle可以等价理解为从entry-server.js开始的一个很大的脚本，
	//他会在bundleRenderer.renderToString函数中执行，执行抛出的错误会传递给下面回调函数中的err
	bundleRenderer.renderToString(context, (err, html) => {
		if(err) {
			//根据实际需求定义
			res.end('出错了')
		} else {
			res.end(html)
		}
	})

});

app.listen(80, () => {
	console.log('启动成功,监听端口80')
})