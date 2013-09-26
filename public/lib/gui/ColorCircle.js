


(function(){
	"use strict";
	
var ColorCircle = Class.extend.call(cy.Shape, {
	name: 'ColorCircle',
	radius: 100,
	color: '#FFFFFF',
	outline: false,
	_drawRadius: null,
	_drawColor: null,
	
	init: function( radius, color ){
		this.radius = radius || this.radius;
		this.color = color || this.color;
		this.reset();
	},
	
	reset: function(){
		if(this._drawColor !== this.color || this._drawRadius !== this.radius){
			this.graphics.clear();
			this.graphics.beginFill(this.color).drawCircle(0,0,this.radius);
			this._drawColor = this.color;
			this._drawRadius = this.radius;
		}
	},
	
	draw: function(ctx){
		this.reset();
		this.Super_draw(ctx);
	},
	
	getMeasuredWidth: function(){
		return 0;
	},
	
	getMeasuredHeight: function(){
		return 0;
	}
});

cy.ColorCircle = ColorCircle;

})();