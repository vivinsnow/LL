


(function(){
	"use strict";
	
var Button = Class.extend.call(cy.Container, {
	name: 'Button',
	cursor: 'pointer',
	contentBmp: null,
	contentLbl: null,
	preventMove: true,
	init: function(up, down, label){
		this.initialize();
		
		up = new cy.Bitmap(up);
		down = new cy.Bitmap(down);
		
		this.contentBmp = new cy.Bitmap(up.image);
		this.addChild(this.contentBmp);
		
		if( label ){
			text.textAlign = 'center';
			this.contentLbl = label;
			this.addChild(this.contentLbl);
		}
		
		var o = this;
		var handleEvent = function(evt){
			switch (evt.type) {
				case 'mousedown':
					o._resetUI(down.image);
					break;
				case 'pressup':
				case 'rollout':
					o._resetUI(up.image);
					break;
			}
		};
		
		this.addEventListener('mousedown', handleEvent);
		this.addEventListener('pressup', handleEvent);
		this.addEventListener('rollout', handleEvent);
	},
	
	setValue: function( value ){
		this.contentLbl.text = value;
	},
	
	getValue: function(){
		return this.contentLbl.text;
	},
	
	getMeasuredWidth: function(){
		return this.contentBmp.image.width;
	},
	
	getMeasuredHeight: function(){
		return this.contentBmp.image.height;
	},
	
	hitTestDraw: function(ctx){
		var image = this.contentBmp.image,
			width = image.width,
			height = image.height;
		ctx.fillStyle = '#FFF';
		ctx.fillRect(0, 0, width, height);
	},
			
	_resetUI: function(image){
		this.contentBmp.image = image;
	}

});

cy.Button = Button;

})();