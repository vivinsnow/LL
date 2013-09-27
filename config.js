var config = {
	// rootDir: 'D:/Apache Tomcat 7/webapps/LL',
	rootDir: '/Users/kdhg/Desktop/Chen\ Rui/LL',
	imgDir: '/public/img/',
	jsDir: '',
	projectDir: '',
	exportDir:'/public/js/',
	exportName:'views'
};

exports.get = function(name){
	return config[name];
};
