//http.js文件，自定义封装请求接口，
//此处只是demo，根据自己项目实际情况修改

import Axios from 'axios'

//如果网络是正常的，一律走promise实例的成功回调，具体的业务上的问题(失败或者成功)，在一个对象中指明,成功回调只接收对象和undefined两种值，undefined表示不去执行逻辑
//如果网络故障，则走promise实例的失败回调

//post请求方法
const apiPost = function(url, config) {
	if(config === undefined) {
		config = {}
	} else if(typeof config !== 'object') {
		throw '配置对象类型错误，请输入object'
	}

	config.url = this.BASE_URL + url; //定义路径
	config.method = 'post'; //定义方法类型
	config.timeout = config.timeout || 10000; //定义超时
	config.withCredentials = true; //携带cookie

	//设置content-type
	config.headers = {
		'Content-Type': 'application/json'
	}
	//数据格式处理
	config.transformRequest = [function(data) {
		return JSON.stringify(data);
	}];

	//为服务器端添加cookie
	if(TERMINAL === 'server') {
		config.headers['Cookie'] = this.cookie===undefined?'':this.cookie;
	}
	
	//此处返回的是then方法创建的promise实例
	return Axios(config).then((rs) => {
		//这里，rs.status状态码在2xx范围，走成功回调，其他走失败回到
		//rs.data为接口返回的业务数据，我们一般只返回出去业务数据（即rs.data），不会把整个rs返回
		if(rs.data.code === 401) {
			//如果token过期，重新登录
			if(TERMINAL === 'server') {
				return Promise.reject({
					code: 401,
					message: '未登录或登录失效，请重新登录'
				});

			} else {
				//当前终端为客户端
				// xxxxxx 重新登录逻辑
				//向外返回成功promise,参数undefined
				return Promise.resolve(undefined)
			}

		} else {
			return Promise.resolve(rs.data)
		}
	}, (err) => {
		//返回失败状态和数据
		console.log('ajax出错啦')
		return Promise.reject(err);
	})
}

export {
	apiPost
}