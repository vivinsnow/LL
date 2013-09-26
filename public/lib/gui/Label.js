


(function(){
	"use strict";
	
var Label = Class.extend.call(cy.Text, {
	name: 'Label',
	fontSize: 30,
	fontFamily: '微软雅黑',
	infill: true,
	color: '#FFFFFF',
	outline: false,
	init: function( text, params ){
		params = params || {};
		this.setFont(params.fontSize, params.fontSize);
		this.outline = params.outline;
		this.initialize( text, this.font, this.color );
	},
	
	setFont: function(size, family){
		size && (this.fontSize = size);
		family && (this.fontFamily = size);
		this.font = this.fontSize+'px '+this.fontFamily;
	},
	
	hitTestDraw: function(ctx){
		var width = this.getMeasuredWidth(),
			height = this.getMeasuredHeight();		
		ctx.fillStyle = '#FFF';
		ctx.fillRect(0, 0, width, height);
	},
	
	_drawTextLine: function(ctx, text, y) {	
		if (this.infill) { 
			ctx.fillStyle = this.color;
			ctx.fillText(text, 0, y, this.maxWidth||0xFFFF); 
		}
		if (this.outline) {
			ctx.strokeStyle = this.outline;
			ctx.strokeText(text, 0, y, this.maxWidth||0xFFFF); 
		}
	}
});

cy.Label = Label;

})();