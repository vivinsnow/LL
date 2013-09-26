
var fs = require('fs'),
path = require('path'),
config = require('../config.js');

//通信协议入口
exports.init = function(req, res) {
	handler.call(req, res);
};

exports.getImageList = function(req, res){
	var imgDir = config.get('imgDir'),
		dir = config.get('rootDir') + config.get('imgDir');
	fs.readdir(dir, function(err, files){
		if(err) console.log(err);
		if(files){
			files.forEach(function(a, i){
				files[i] = imgDir+a;
			});
		}
		res.send(JSON.stringify(files));
	});
};

exports.importData = function(req, res){
	var filePath = config.get('rootDir') + config.get('exportDir') + config.get('exportName');

	fs.readFile(filePath+'.json','UTF-8',function(err, data){
		if(err) console.log(err);
		res.send(data);		
	});
};

exports.exportData = function(req, res){
	var filePath = config.get('rootDir') + config.get('exportDir') + config.get('exportName');

	fs.writeFile(filePath+'.json',req.body.content,'UTF-8',function(err){
		if(err) console.log(err);
				
	});
	fs.writeFile(filePath+'.js','var views = '+req.body.content+';','UTF-8',function(err){
		if(err) console.log(err);
	});
	
};

//上传文件接口
exports.fileUpload = function(req, res) {
	// 获得文件的临时路径
	var thumbnail = req.files.thumbnail;
	var tmp_path = thumbnail.path;
	var savepath = req.body.path || './public/img/', 
		_msg = '';
	fs.exists(savepath, function(exists) {
		if (!exists) {
			fs.unlink(tmp_path, function() {
			   res.render('file-upload', { title: '上传目录不存在' });
			});
			return;
		}
		// 指定文件上传后的目录 - 示例为"images"目录。 
		var target_path = savepath + thumbnail.name;
//		if (req.files.thumbnail.type.indexOf('image/') < 0) {
//			fs.unlink(tmp_path, function() {
//			   res.render('file-upload', { title: '只能上传图片文件哦~亲' });
//			});
//			return;
//		}
		fs.stat(target_path, function(err, stat) {
//			if (stat) {
//				return res.render('file-upload', { title: '文件已经存在不能重复上传' });
//			}
//			if (_thumbnail.size > 1024 * 1024) {
//				return res.render('file-upload', { title: '单个文件不能超过150KB' });
//			}
			// 移动文件
			fs.rename(tmp_path, target_path, function(err) {
			  // 删除临时文件夹文件, 
			  fs.unlink(tmp_path, function() {
			  	 if (err) {
				   return res.render('file-upload', { title: err });
				 }
			     res.render('file-upload', { title: '文件上传成功' });
			  });
			});
		});
	});
};