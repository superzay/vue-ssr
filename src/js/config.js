//基础配置文件config.js

let ENV = process.env.NODE_ENV;
let _BASE_URL = '';
let BASE_URL = '';

//本例开发环境和生产环境采用相同的地址
if(ENV === 'dev') {
	_BASE_URL = 'http://spzay.51vip.biz:80';
} else {
	_BASE_URL = 'http://spzay.51vip.biz:80';
}

BASE_URL = _BASE_URL;
export {
	BASE_URL
}