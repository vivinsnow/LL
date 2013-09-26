


(function() {
    "use strict";
    
var Scroller = cy.Panel.extend({
	name: 'Scroller',
	content: null,
	moved: false,
	overflow : false,
	
	_started: false,
	_startX: 0,
	_startY: 0,
	_contentX: 0,
	_contentY: 0,
	_scrollX: true,
	_scrollY: true,
	_startTime: 0,
	_dx: 0,
	_dy: 0,
	_contentTween: null,
	_scrollXTween: null,
	_scrollYTween: null,
	
	setContent: function(content){
		this.content && this.removeChild(this.content);
		this.content = content;
		
		this.addChild(content);
		if(content.width <= this.width) this._scrollX = false;
		if(content.height <= this.height) this._scrollY = false;
		
		if (this._scrollY) {
			this.scrollBarY = new cy.Shape();
			this.scrollBarY.height = this.height*this.height/this.content.height;
			this.scrollBarY.graphics.beginStroke('rgba(255,255,255,1)').beginFill('rgba(0,0,0,0.6)').drawRoundRect(0, 0, 8, this.scrollBarY.height, 4).endStroke();
			this.scrollBarY.x = this.width-8;
			this.scrollBarY.k = (this.height-this.scrollBarY.height)/(this.content.height-this.height);
			this.scrollBarY.cache(0, 0, 8, this.scrollBarY.height);
			this.scrollBarY.mouseEnabled = false;
			this.addChild(this.scrollBarY);
		}
		
		var o = this, mtx = null;
		this.addEventListener('mousedown', function(e){
			o._startX = e.stageX;
			o._startY = e.stageY;
			o._contentX = o.content.x;
			o._contentY = o.content.y;
			o._dx = 0;
			o._dy = 0;
			o._startTime = new Date().getTime();
			mtx = o.getConcatenatedMatrix();
			if( !e.target.preventMove ) {
				o._started = true;
			};
			if( o._contentTween ){
				o._contentTween.setPaused(true);
				o._contentTween = null;
			}
			if( o._scrollYTween ){
				o._scrollYTween.setPaused(true);
				o._scrollYTween = null;
			}
		});
		this.addEventListener('pressmove', function(e){
			if( o._started ) {
				var dx = ( e.stageX - o._startX ) / mtx.a,
					dy = (e.stageY - o._startY ) / mtx.d,
					ex = o._contentX + dx,
					ey = o._contentY + dy;
				// 超出边界时 添加弹力效果
				if( ex<(o.width-o.content.width) ){
					ex = (ex - (o.width-o.content.width))*0.4 + (o.width-o.content.width);
				}else if( ex > 0 ){
					ex = ex*0.4;
				}
				if( ey<(o.height-o.content.height) ){
					ey = (ey - (o.height-o.content.height))*0.4 +(o.height-o.content.height);
				}else if( ey > 0 ){
					ey = ey*0.4;
				}
				if( o._scrollX ) {
					o._dx = dx;
					o.content.x = ex;
					if( Math.abs(dx) > 3 ) o.moved = true;
				}
				if( o._scrollY ) {
					o._dy = dy;
					o.content.y = ey;
					o.scrollBarY.y = -o.scopeValue(ey,o.height-o.content.height,0)*o.scrollBarY.k;
					if( Math.abs(dy) > 3 ) o.moved = true;
				}
			}
		});
		this.addEventListener('pressup', function(){
			if( o.moved ) {
				var dTime = (new Date().getTime()) - o._startTime;
				// 超出边界时 返回边界位置
				var endX, endY, config = {};
				if(o.content.x<(o.width-o.content.width)){
					endX = (o.width-o.content.width);
				}else if(o.content.x > 0){
					endX = 0;
				}
				if(o.content.y<(o.height-o.content.height)){
					endY = (o.height-o.content.height);
				}else if(o.content.y > 0){
					endY = 0;
				}
				if( endX !== undefined ){
					config.x = endX;
				}
				if( endY !== undefined ){
					config.y = endY;
				}
				if(('x' in config) || ('y' in config)){
					o._contentTween = cy.Tween.get(o.content).to(config, 200);
				}else{
					if( o.moved ){
						/*
						//惯性，乱写的，先这么用着
						var mut = 80000/(dTime*dTime),
							endPos = o.scopeContentPosition(o.content.x + o._dx*mut, 
															o.content.y + o._dy*mut);
						o._contentTween = cy.Tween.get(o.content).to(
							endPos, 600, cy.Ease.circOut);
						if(o.scrollBarY){
							o._scrollYTween = cy.Tween.get(o.scrollBarY).to({
								y: -endPos.y * o.scrollBarY.k
							}, 600, cy.Ease.circOut);
						}*/
						/*减速运动*/
						var v = o._dy/dTime,
							a = 0.002,
							t = Math.abs(v/a),
							s = a*Math.abs(v) + a*t*t/2,
							endPos = o.scopeContentPosition(o.content.x + o._dx, 
														o.content.y + (v<0?-1:1)*s),
							delay = t*(1-endPos.fixY/s);
						// console.log(s, endPos.fixY, delay);
						o._contentTween = cy.Tween.get(o.content).to(
							endPos, delay, cy.Ease.circOut);
						if(o.scrollBarY){
							o._scrollYTween = cy.Tween.get(o.scrollBarY).to({
								y: -endPos.y * o.scrollBarY.k
							}, delay, cy.Ease.circOut);
						}
					}
				}
				o.moved = false;
			}
			o._started = false;
		});
	},
	scopeContentPosition:function(x,y){
		var endX, endY, o = this;
		if( x<(o.width-o.content.width) ){
			endX = (o.width-o.content.width);
		}else if(x > 0){
			endX = 0;
		}else {
			endX = x;
		}
		if( y<(o.height-o.content.height) ){
			endY = (o.height-o.content.height);
		}else if(y > 0){
			endY = 0;
		}else{
			endY = y;
		}
		return {
			x: endX, y: endY, fixX: Math.abs(endX-x), fixY: Math.abs(endY-y)
		};
	},
	scopeValue: function(val, min, max){
		if(val < min){
			val = min;
		} else if(val > max){
			val = max;
		}
		return val;
	}
});

cy.Scroller = Scroller;

})();