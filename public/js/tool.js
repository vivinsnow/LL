
var displayObjs = {};
var viewData = {};
var current = null;
var setting = {
		view: {
			dblClickExpand: false,
			showLine: true,
			selectedMulti: false
		},
		data: {
			simpleData: {
				enable:true,
				idKey: "id",
				pIdKey: "pId",
				rootPId: ""
			}
		},
		callback: {
			beforeClick: function(treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj("tree");
				var obj = displayObjs[treeNode.title] || displayObjs[treeNode.name];
				if(obj.root){
					App.clearStage();
					App.stage.addChild(obj);
				}
				selectObj(obj);
			}
		}
	};

function selectObj( obj ){
	if(current !== obj)	{
		if(current) current.drawDebug = null;
		current = obj;
		drawDebug(obj);
		showParam(obj);
	}
}

function makeTree(obj){
	if(obj.children){
		if(obj.children.length === 0) return 'parent';
		var arr = [];
		obj.children.forEach(function(aa, bb){
			var node = {
				name: aa.name,
				title: aa.id
			};
			var tree = makeTree(aa);
			if(tree) {
				if(tree === 'parent'){
					node.isParent = true;
				} else {
					node.children = tree;
				}	
			}
			arr.push(node);
		});
		return arr;
	} else {
		return false;
	}
	
	return null;
}

function refreshTree(){
	var zNodes = [];
	for(var name in viewData){
		var a = viewData[name];
		var node = {
			name: name,
			title: ''
		};
		var tree = makeTree(a);
		if(tree) {
			if(tree === 'parent'){
				node.isParent = true;
			} else {
				node.children = tree;
			}	
		}
		zNodes.push(node);
	}
	var t = $("#tree");
	t = $.fn.zTree.init(t, setting, zNodes);
	var zTree = $.fn.zTree.getZTreeObj("tree");
}

function drawDebug(obj){
	obj.drawDebug = function(ctx){
		var w = this.getMeasuredWidth(),
			h = this.getMeasuredHeight();
		ctx.fillStyle = 'rgba(77,255,255,0.1)';
		ctx.fillRect(0, 0, w, h);
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'rgb(255,255,0)';
		ctx.strokeRect(0, 0, w, h);
	};
}

function play(){
	cy.App.create({
		fps: 60,
		width: 640,
		height: 960,
		
		showFPS: true,
		scaleToFit: false,
		enableMouseOver: false,
		crossOriginAllow: false
	});
	var dragTarget,
		startX = 0,
		startY = 0,
		baseX = 0,
		baseY = 0;
	App.stage.on('mousedown',function(e){
		dragTarget = e.target;
		selectObj(dragTarget);
		baseX = dragTarget.x;
		baseY = dragTarget.y;
		startX = e.stageX;
		startY = e.stageY;
	});
	App.stage.on('pressmove',function(e){
		dragTarget.x = (e.stageX-startX)/App.stage.scaleX + baseX;
		dragTarget.y = (e.stageY-startY)/App.stage.scaleY + baseY;
	});
	App.stage.on('pressup',function(e){
		showParam(dragTarget);
		dragTarget = null;
	});
}

function showParam(obj){
	$('.param_x input').val(obj.x);
	$('.param_y input').val(obj.y);
	$('.param_w input').val(obj.width);
	$('.param_h input').val(obj.height);
	$('.param_regX input').val(obj.regX);
	$('.param_regY input').val(obj.regY);
	$('.param_scaleX input').val(obj.scaleX);
	$('.param_scaleY input').val(obj.scaleY);
	$('.param_alpha input').val(obj.alpha);
	$('.param_rotation input').val(obj.rotation);

	if(obj instanceof cy.Bitmap){
		$('.private_bitmap').show();
		var src = obj.image.src;
		$('.param_image_url a').attr('href', src);
		$('.param_image_url a').html(src.substring(location.search.length, src.length-1));
	}else{
		$('.private_bitmap').hide();
	}
	if(obj instanceof cy.Label){
		$('.private_label').show();
		$('.param_color input').val(obj.color);
		$('.param_font_size input').val(obj.fontSize);
		$('.param_font_family input').val(obj.fontFamily);
		$('.param_text textarea').val(obj.text);
	}else{
		$('.private_label').hide();
	}
	if(obj instanceof cy.Panel){
		$('.private_panel').show();
		$('.param_overflow input')[0].checked = obj.overflow;
	}else{
		$('.private_panel').hide();
	}
	if(obj instanceof cy.ColorRectangle){
		$('.private_colorrect').show();
		$('.param_colorrect input').val(obj.color);	
	}else {
		$('.private_colorrect').hide();
	}
}

function parseData(data){
	if(data.name){
		var obj;
		if(data.up){
			obj = new cy[data.name](data.up, data.down);
		}
		else if(data.image){
			obj = new cy[data.name](data.image);
		}else if(data.text){
			obj = new cy[data.name](data.text);
		}else{
			obj = new cy[data.name]();
		}
		console.log(data.name, obj);
		obj.x = data.x;
		obj.y = data.y;
		obj.width = data.width;
		obj.height = data.height;
		
		if(data.children){
			data.children.forEach(function(a,i){
				var r = parseData(a);
				obj.addChild(r);
			});
		}
		displayObjs[obj.id] = obj;
		return obj;
	}
}


function importData(data){
	viewData = {};
	displayObjs = {};
	App.clearStage();
	current = null;
	
	var first = false;
	for(var name in data){
		var a = data[name];
		viewData[name] = parseData(a);
		viewData[name].root = true;
		if(!first){
			first = viewData[name];
		}
		displayObjs[name] = viewData[name];
	}
	App.stage.addChild(viewData[name]);
	selectObj(first);
	refreshTree();
}

function fillData(obj){
	var result = {
		name: obj.name,
		x: obj.x, 
		y: obj.y,
		width: obj.width,
		height: obj.height
	};
	if(obj.image){
		result.image = obj.image.src;
	}
	if(obj.contentBmp){
		result.up = obj._bmpUp.image.src;
		result.down = obj._bmpDown.image.src;
	}
	if(obj.text){
		result.text = obj.text;
	}
	var children = obj.children;
	if(children && !obj.contentBmp){
		result.children = [];
		children.forEach(function(a,b){
			result.children.push(fillData(a));
		});
	}
	return result;
}

$(function(){
	play();
	
	$('#create_view').bind('click', function(){
		var viewName = prompt('请输入视图名称:');
		if(viewName){
			var obj = new cy.Panel(500, 500);
			obj.root = true;
			viewData[viewName] = obj;
			displayObjs[viewName] = obj;
			App.clearStage();
			App.stage.addChild(obj);
			selectObj(obj);
			refreshTree();
		}
	});

	$('.view_panel').bind('click', function(e){
	
	});

	$('.view_panel').bind('mouseover', function(e){

	});
	
	$('.tool_panel').bind('click', function(e){
		if(e.target.name){
			var obj = current;
			if(obj && (obj instanceof cy.Panel || obj instanceof cy.Scene)){
				var child;
				switch(e.target.name){
					case 'Scene':
						child = new cy.Scene();
						break;
					case 'Panel':
						child = new cy.Panel(300, 300);
						break;
					case 'Label':
						child = new cy.Label('Hello World');
						break;
					case 'Bitmap':
						child = new cy.Bitmap('/public/img/unknown.png');
						break;
					case 'Button':
						child = new cy.Button('/public/img/btn_up.png','/public/img/btn_down.png');
						break;
					case 'TextField':
						child = new cy.TextField();
						break;
					case 'TextArea':
						child = new cy.TextArea();
						break;
					case 'Scroller':
						child = new cy.Scroller(300,300);
						break;					
					case 'ColorCircle':
						child = new cy.ColorCircle();
						break;	
					case 'ColorRectangle':
						child = new cy.ColorRectangle();
						break;
				}
				if (child) {
					obj.addChild(child);
					displayObjs[child.id] = child;
					selectObj(child);
					refreshTree();
				}
			}
		}
	});
	
	$('.param_del').bind('click', function(){
		if(current && !current.root){
			var parent = current.parent;
			parent.removeChild(current);
			delete displayObjs[current.id];
			selectObj(parent);
			refreshTree();
		}
	});
	
	$('.param_panel').bind('change', function(e){
		var name = e.target.name,
			val = e.target.value;
		if (name === 'overflow'){
			current[name] = e.target.checked;
		}
		else if (name === 'image') {
			
		} 
		else if (current[name] != val) {
			if(name==='text' || name==='color' || name==='outline'|| name==='fontFamily'){
				current[name] = val;
			}else{
				current[name] = parseFloat(val);
			}
			if(name==='fontFamily' || name==='fontSize'){
				current.setFont();
			}
		}
	});
	$('#import').bind('click', function(e){
		
		$.ajax({
			url: '/import-data',
			type: 'GET',
			dataType: 'json',
		}).done(function(data){
			console.log(data);
			importData(data);
		});
	});
	
	$('#export').bind('click', function(){
		var d = {};
		for(var name in viewData){
			var a = viewData[name];
			d[name] = fillData(a);
		}
		$.ajax({
			url: '/export-data',
			type: 'POST',
			dataType: 'json',
			data: {
				content:JSON.stringify(d)
			}
		}).done(function(data){
			alert('导出成功');
		});
	});
	$('.param_change_image').bind('click', function(){
		$.ajax({
			url: '/get-image-list',
			type: 'GET',
			dataType: 'json',
			data:{
				
			}
		}).done(function(data){
			$('.img_list_panel').show();
			var html = '';
			data && data.forEach(function(a,i){
				if(a.indexOf('.png')>-1 || a.indexOf('.jpg')>-1)
				html += '<img src="'+ a +'" class="img_item">';
			});
			$('.img_list_panel .content').html(html);
			imgScroll.refresh();
		});
	});
	$('.img_list_panel').bind('click', function(e){
		if(imgScroll.moved) return;
		imgScroll.refresh();
		var target = e.target;
		if(target.src){
			current.image = new Image();
			current.image.src = target.src;
			showParam(current);
			$('.img_list_panel').hide();
		}
		
	});
	$('.param_upload_image').bind('click', function(e){
		
		
	});
	var imgScroll = new IScroll('.img_list_panel');
});

