
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , handler = require('./routes/handler')
  , http = require('http')
  , path = require('path')
  , mongo = require('connect-mongo');

var app = express();

app.configure(function(){
  	app.set('port', 3000);
  	app.set('view engine', 'ejs');
  	app.set('views', __dirname + '/views');
  	
    app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser(
		{ uploadDir: './uploads' } //图片上传配置
	));
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(app.router);
	app.use(
		express['static'](path.join(__dirname, ''))
	);
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/get-image-list', handler.getImageList);
app.post('/file-upload', handler.fileUpload);
app.get('/import-data', handler.importData);
app.post('/export-data', handler.exportData);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
