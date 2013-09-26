(function(){
var display_p =  createjs.DisplayObject.prototype,
	container_p = createjs.Container.prototype,
	bitmap_p = createjs.Bitmap.prototype,
	dom_p = createjs.DOMElement.prototype,
	movie_p = createjs.MovieClip.prototype;

//用矩阵运算取代 getImageData方式	
var hitPoint = function(o, x, y){
		var stage = App.stage,
			mtx1 = o.getConcatenatedMatrix(),
			mtx2 = new createjs.Matrix2D();
		mtx2.appendTransform(x/stage.scaleX, y/stage.scaleY, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, 0,0);
		mtx1.invert();
		mtx2.invert();
		var w = o.getMeasuredWidth? o.getMeasuredWidth():0,
		 	h = o.getMeasuredHeight? o.getMeasuredHeight():0,
			dx = mtx1.tx-mtx2.tx,
			dy = mtx1.ty-mtx2.ty;
		return !!(dx>=0&&dx<=w&&dy>0&&dy<h);
	};	
	
	display_p.width = 0;
	display_p.height = 0;
	
	container_p._getObjectsUnderPoint = function(x, y, arr, mouse) {
		var ctx = createjs.DisplayObject._hitTestContext;
		var mtx = this._matrix;

		var l = this.children.length;
		for (var i=l-1; i>=0; i--) {
			var child = this.children[i];
			var hitArea = mouse&&child.hitArea;
			if (!child.visible || (!hitArea && !child.isVisible()) || (mouse && !child.mouseEnabled)) { continue; }
			if (child instanceof cy.Panel && child.width !== 0 && child.height !== 0) {
//				child.getConcatenatedMatrix(mtx);				
//				ctx.globalAlpha = mtx.alpha;
//				ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
//				child.hitTestDraw(ctx);
//				var testHit = this._testHit(ctx);
//				if (testHit) {
//					ctx.setTransform(1, 0, 0, 1, 0, 0);
//					ctx.clearRect(0, 0, 2, 2);
//				}
				var testHit = hitPoint(child,x,y);
				if (!testHit && !child.overflow) { continue; }
				var result = child._getObjectsUnderPoint(x, y, arr, mouse);
				if (!result && testHit) { result = child; }
				if (!arr && result) { return result; }
			}
			else if (!hitArea && child instanceof createjs.Container && !(child instanceof cy.Button)) {
				var result = child._getObjectsUnderPoint(x, y, arr, mouse);
				if (!arr && result) { return result; }
			} else {
//				child.getConcatenatedMatrix(mtx);
//				if (hitArea) {
//					mtx.appendTransform(hitArea.x, hitArea.y, hitArea.scaleX, hitArea.scaleY, hitArea.rotation, hitArea.skewX, hitArea.skewY, hitArea.regX, hitArea.regY);
//					mtx.alpha = hitArea.alpha;
//				}
//				ctx.globalAlpha = mtx.alpha;
//				ctx.setTransform(mtx.a,  mtx.b, mtx.c, mtx.d, mtx.tx-x, mtx.ty-y);
//				var target = (hitArea||child);
//				if (target.hitTestDraw) {
//					target.hitTestDraw(ctx);
//				} else {
//					target.draw(ctx);
//				}
//				if (!this._testHit(ctx)) { continue; }
//				ctx.setTransform(1, 0, 0, 1, 0, 0);
//				ctx.clearRect(0, 0, 2, 2);
				if (!hitPoint(child,x,y)) { continue; }
				if (arr) { arr.push(child); }
				else { return (mouse && !this.mouseChildren) ? this : child; }
			}
		}
		return null;
	};	
	container_p.draw = function(ctx, ignoreCache) {
		if (this.DisplayObject_draw(ctx, ignoreCache)) { return true; }
		var list = this.children.slice(0);
		for (var i=0,l=list.length; i<l; i++) {
			var child = list[i];
			if (!child.isVisible() && !child.drawDebug) { continue; }

			ctx.save();
			child.updateContext(ctx);
			child.draw(ctx);
			child.drawDebug && child.drawDebug(ctx);
			ctx.restore();
		}
		return true;
	};
	container_p.removeChildAt = function(index) {
		var l = arguments.length;
		if (l > 1) {
			var a = [];
			for (var i=0; i<l; i++) { a[i] = arguments[i]; }
			a.sort(function(a, b) { return b-a; });
			var good = true;
			for (var i=0; i<l; i++) { good = good && this.removeChildAt(a[i]); }
			return good;
		}
		if (index < 0 || index > this.children.length-1) { return false; }
		var child = this.children[index];
		if (child) { 
			this.removeDOMElement(child);
			child.parent = null; 
		}
		this.children.splice(index, 1);
		return true;
	};
	container_p.removeDOMElement = function( child ){
		if ( child instanceof createjs.DOMElement ){
			child.destroy();
		} else if( child instanceof createjs.Container ){
			var children = child.children;
			children.forEach(function(a, b){
				child.removeDOMElement(a);
			});
		}
	};
	
	bitmap_p.name = 'Bitmap';
	bitmap_p.hitTestDraw = function( ctx ){
		var width, height;
		if (this.sourceRect) {
			width = this.sourceRect.width;
			height = this.sourceRect.height;
		} else {
			width = this.image.width;
			height = this.image.height;
		}
		ctx.fillStyle = '#FFF';
		ctx.fillRect(0, 0, width, height);
	};
	bitmap_p.getMeasuredWidth = function(){
		return this.sourceRect?this.sourceRect.width:this.image.width;
	};
	bitmap_p.getMeasuredHeight = function(){
		return this.sourceRect?this.sourceRect.height:this.image.height;
	};	
		
	dom_p.destroy = function(){
		var element = this.htmlElement,
			parentNode = element.parentNode;
		parentNode && parentNode.removeChild(element);
	};
	dom_p.initialize = function(htmlElement) {
		if( !htmlElement ) return;
		if (typeof(htmlElement)=="string") { htmlElement = document.getElementById(htmlElement); }
		this.DisplayObject_initialize();
		this.mouseEnabled = false;
		this.htmlElement = htmlElement;
	};
	dom_p._tick = function(params) {
		var stage = this.getStage();
		this._addToScreen(stage);
		this._visible = false;
		stage&&stage.on("drawend", this._handleDrawEnd, this, true);
		this.DisplayObject__tick(params);
	};
	dom_p._addToScreen = function(stage){
		var element = this.htmlElement;
		if( !element.parentNode ){
			var style = element.style;
			style.position = "absolute";
			style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
			stage.canvas.parentNode.appendChild(element);
		}
	};
	dom_p.getMeasuredWidth = function(){
		return this.htmlElement.clientWidth;
	};
	dom_p.getMeasuredHeight = function(){
		return this.htmlElement.clientHeight;
	};
		
	movie_p._addManagedChild = function(child, offset) {
		if (child._off) { return; }
		this.addChild(child);

		if (child instanceof createjs.MovieClip) {
			child._synchOffset = offset;
			// TODO: this does not precisely match Flash. Flash loses track of the clip if it is renamed or removed from the timeline, which causes it to reset.
			if (child.mode == createjs.MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) { child._reset(); }
		}
		this._managed[child.id] = 2;
	};
})();
