

(function() {
    "use strict";

var Viewport = Class.extend({
	width: 0,
	height: 0,
	winWidth: 0,
	winHeight: 0,
	zoomX: 1,
	zoomY: 1,
	resetCount: 0,
	lastResetTime: 0,
	handleResize: null,
	init : function( width, height, scaleToFit, scope ){
		var body = cy.$( document.body ),
			system = cy.UserAgent.system,
			isMobile = !!cy.UserAgent.mobile,
			isPad =  system.ipad,
			iPhone = system.iphone || system.ipod,
			maxWidth = scope.maxWidth,
			maxHeight = scope.maxHeight;
			
        if( isMobile && !isPad ) {
            document.getElementById('viewport').content = 'width='+width+',user-scalable=no,target-densitydpi=high-dpi';  
		}

        var screen = document.getElementById( 'gameScreen' ),
            canvas = document.getElementById( 'gameCanvas' ),
            w, h;

        maxWidth = maxWidth? maxWidth : 10000;
        maxHeight = maxHeight? maxHeight: 10000;
       
		var o = this, scr = cy.$( screen );		
		scr.css('transformOrigin', '50% 0%');

		this.handleResize = function(){
			// iPhone和iPod下浏览器的隐藏地址栏策略
			if( isMobile && iPhone ){
				body.css( 'minHeight', (window.innerHeight+200) + 'px');
				scr.css('top', '1px');
				window.scrollTo(0, 1);
			} else {
				window.scrollTo(0, 0);
			}
			
			// 重新调整宽高
			o.width  = w = width  === 'device-width' ? (window.innerWidth > maxWidth ? maxWidth : window.innerWidth ): width;
        	o.height = h = height === 'device-height'? (window.innerHeight > maxHeight ? maxHeight : window.innerHeight ): height;
			o.winWidth = window.innerWidth;
			o.winHeight = window.innerHeight;
        	
			// 缩放以适应屏幕
			if( scaleToFit ) {
				var scaleX = window.innerWidth / w,
                    scaleY = window.innerHeight / h,
                    scaleM = scaleX > scaleY ? scaleY : scaleX;
				if( isMobile && !isPad ){
					// 像素拉伸铺满屏幕，会失真
					h = window.innerHeight;
					o.zoomX = 1;
					o.zoomY = scaleY;
				} else{
					h = window.innerHeight;
					w = w*scaleY;
					o.zoomX = o.zoomY = scaleY;
				}
			}
			// 修正元素
			if( canvas.width !== w ) {
				canvas.width = w;
				screen.style.width = w + 'px';
				screen.style.marginLeft = -w/2 + 'px';
			}
        	if( canvas.height !== h ) {
        		canvas.height = h;
        		screen.style.height = h + 'px';
        	}
			// 场景适应
			// var currentScene = Scene.currentScene;
			// if(  currentScene ) {
				// currentScene.width = w;
				// currentScene.height = h;
				// currentScene.resize && currentScene.resize();
			// }
		};	
		this.handleResize();
	},
	
	//检测是否有输入框获取焦点，在移动上表现为键盘弹出
	testInputFocus: function( ){
		var input = document.querySelectorAll('input'),
			area = document.querySelectorAll('textarea');
		for(var i=0,l=input.length; i<l; i++){
			if( input[i].state === 'focus'){
				return true;
			}
		}
		for(var i=0,l=area.length; i<l; i++){
			if( area[i].state === 'focus' ){
				return true;
			}
		}	
		return false;
	}
});
	
cy.Viewport = Viewport;
	
})();