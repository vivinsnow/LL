


(function(){
	"use strict";
	
var ColorRectangle = Class.extend.call(cy.Shape, {
	name: 'ColorRectangle',
	width: 300,
	height: 300,
	color: '#FFFFFF',
	outline: false,
	_drawColor: null,
	_drawWidth: null,
	_drawHeight: null,
	
	init: function( width, height, color ){
		this.width = width || this.width;
		this.height = height || this.height;
		this.color = color || this.color;
		this.reset();
	},
	
	reset: function(){
		if(this._drawColor !== this.color || this._drawWidth !== this.width || this._drawHeight !== this.height){
			this.graphics.clear();
			this.graphics.beginFill(this.color).drawRect(0,0,this.width,this.height);
			this._drawColor = this.color;
			this._drawWidth = this.width;
			this._drawHeight = this.height;
		}
	},
	
	draw: function(ctx){
		this.reset();
		this.Super_draw(ctx);
	},
	
	getMeasuredWidth: function(){
		return this.width;
	},
	
	getMeasuredHeight: function(){
		return this.height;
	}
	
});

cy.ColorRectangle = ColorRectangle;

})();