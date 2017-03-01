#定位项目 命令提示符执行cnpm install
1.安装所有依赖包：npm install
2.执行默认任务：gulp  //包括(css-min,js-lib,js-min,images-min,html-min)，可单独执行
				
				css-min: 压缩css文件
				js-lib:重新拷贝lib中的js插件
				js-min：压缩js文件
				images-min：压缩图片
				html-min：压缩html文件
3.执行版本切换gulp rev; 需要先修改v.js中的版本号
4.有文件删除，需要先执行gulp del 任务