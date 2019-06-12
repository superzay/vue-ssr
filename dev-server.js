
//node服务器所需模块
const express = require('express');
var cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const vueRenderer = require('vue-server-renderer')
const path = require('path');

//定义服务器/客户端环境
global.TERMINAL = 'server';

//weback.compiler所需模块
const serverConf = require('./build/webpack.server.conf');
const webpack = require('webpack')
const fs = require('fs')
const Mfs = require('memory-fs')
const axios = require('axios')

function compilerServer(cb) {
	//使用webpack方法，传递webpack.server.conf配置，生成编译器（或者叫打包器）
	const webpackComplier = webpack(serverConf);

	//编译器输出目录设置到内存中
	var mfs = new Mfs();
	webpackComplier.outputFileSystem = mfs;

	//启动编译器，开始打包
	webpackComplier.watch({}, async(error, stats) => {
		if(error) return console.log(error);

		stats = stats.toJson();
		stats.errors.forEach(err => console.log(err))
		stats.warnings.forEach(err => console.log(err))

		// server Bundle 对应的json文件的路径
		let serverBundlePath = path.join(
			serverConf.output.path,
			'vue-ssr-server-bundle.json'
		)

		//读取server Bundle 对应的json文件
		let serverBundle = JSON.parse(mfs.readFileSync(serverBundlePath, "utf-8"))

		//读取 client Bundle 对应的 json文件
		let clientBundle = await axios.get('http://localhost:8080/vue-ssr-client-manifest.json')

		// 读取模板
		let template = fs.readFileSync(path.join(__dirname, './src/index-template.html'), 'utf-8');
		//传递给回调
		cb(serverBundle, clientBundle, template)

	})

}

app.get('*', async(req, res) => {

	res.status(200);
	res.setHeader('Content-Type', 'text/html;charset=utf-8;')
	//调用打包服务函数，并传递进回调函数，处理打包结果
	compilerServer(function(serverBundle, clientBundle, template) {
		//创建bundleRenderer渲染器，传递进serverBundle, clientBundle, template
		let bundleRenderer = vueRenderer.createBundleRenderer(serverBundle, {
			template,
			clientManifest: clientBundle.data,
			runInNewContext: false
		})
		//开始渲染，
		//renderToString方法可以接受一个回调函数为第二个参数（参考server.js）
		//或者返回一个promise对象，使用then回调
		/*bundleRenderer.renderToString({
			url: req.url
		}).then((html) => {
			res.end(html)
		}).catch(err => console.log(err))*/
		//serverBundle可以等价理解为从entry-server.js开始的一个很大的脚本，
		//他会在bundleRenderer.renderToString函数中执行，执行抛出的错误会传递给下面回调函数中的err
		let cookie='';
		Object.keys(req.cookies).forEach((item,index)=>{
			cookie=cookie+item+'='+req.cookies[item]+';';
		});
		
		bundleRenderer.renderToString({
			url: req.url,
			cookie:cookie,//向entry-server.js模块传递cookie,最终会传递给app.js模块，并挂载到vue原型下
		}, (err, html) => {
			if(err) {
				//定义错误处理逻辑
			}
			res.end(html)
		})

	})

})

//启动服务器，监听5000端口
app.listen(5000, () => {
	console.log('启动成功')
})