
(function() {
    "use strict";
    
var Panel = Class.extend.call(cy.Container, {
	name: 'Panel',
	border: true,
	overflow: true,
	background: null,
	
	init: function( width, height ){
		this.initialize();
    	width>0 && (this.width = width);
    	height>0 && (this.height = height);
	},
	
	isVisible: function() {
		return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
	},
	
	draw: function( ctx, ignoreCache ){
		
		//剪切非溢出的部分
		if (this.width !== 0 && this.height !== 0) {
			if (this.border) {
				ctx.lineWidth = 1;
		        ctx.strokeStyle = '#FFF';
		        ctx.strokeRect(0, 0, this.width, this.height);
			}
			if(!this.overflow){
				ctx.beginPath();
        		ctx.rect(0, 0, this.width, this.height);      	
        		ctx.clip();
        		ctx.closePath();
			}
		}
		this.Super_draw( ctx, ignoreCache );
	},
	
	hitTestDraw: function(ctx){
		var width = this.width,
			height = this.height;
		ctx.fillStyle = '#FFF';
		ctx.fillRect(0, 0, width, height);
	},
	
	getMeasuredWidth: function(){
		return this.width;
	},
	
	getMeasuredHeight: function(){
		return this.height;
	},
	
	add9Background: function(leftTop, centerTop, rightTop, leftMiddle, centerMiddle, rightMiddle, leftBottom, centerBottom, rightBottom){
		if( this.background ) {
			this.removeChild( this.background );
		}
		//利用九宫格拼背景
		var bgCache = document.createElement('canvas'),
			bgCtx = bgCache.getContext('2d'),
			w = this.width,
			h = this.height;
		// IOS上有尺寸控制
		if( w > 2047) w = 2047;
		if( h > 2047) h = 2047;
			
		bgCache.width = w;
		bgCache.height = h;
		
		bgCtx.drawImage(leftTop, 0, 0);
		bgCtx.drawImage(centerTop, leftTop.width, 0, w - leftTop.width - rightTop.width, centerTop.height);
		bgCtx.drawImage(rightTop, w - rightTop.height, 0);
		
		bgCtx.drawImage(leftMiddle, 0, leftTop.height, leftMiddle.width, h - leftTop.height - leftBottom.height);
		bgCtx.drawImage(centerMiddle, leftMiddle.width, centerTop.height, w - leftMiddle.width - rightMiddle.width, h - centerTop.height - centerBottom.height);
		bgCtx.drawImage(rightMiddle, w - rightMiddle.width, rightTop.height, rightMiddle.width, h - rightTop.height - rightBottom.height);
		
		bgCtx.drawImage(leftBottom, 0, h - leftBottom.height);
		bgCtx.drawImage(centerBottom, leftBottom.width, h - centerBottom.height, w - leftBottom.width - rightBottom.width, centerBottom.height);
		bgCtx.drawImage(rightBottom, w - rightBottom.width, h - rightBottom.height);
		
		this.background = new cy.Bitmap(bgCache);
		this.addChildAt(this.background, 0);
	},
	
	add3Background: function(top, middle, bottom){
		if( this.background ) {
			this.removeChild( this.background );
		}
		var bgCache = document.createElement('canvas'),
			bgCtx = bgCache.getContext('2d'),
			w = this.width,
			h = this.height;
		
		if( w > 2047) w = 2047;
		if( h > 2047) h = 2047;
			
		bgCache.width = w;
		bgCache.height = h;
		
		bgCtx.drawImage(top, 0, 0);
		bgCtx.drawImage(middle, 0, top.height, 0, h - top.height - bottom.height);
		bgCtx.drawImage(bottom, 0, h - bottom.height);
		
		this.background = new cy.Bitmap(bgCache);
		this.addChildAt(this.background, 0);
	}
});

cy.Panel = Panel;

})();
