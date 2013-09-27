


(function(){
	"use strict";
	
var Button = Class.extend.call(cy.Container, {
	name: 'Button',
	cursor: 'pointer',
	contentBmp: null,
	contentLbl: null,
	preventMove: true,
	
	_bmpUp: null,
	_bmpDown: null,
	init: function(up, down, label){
		this.initialize();
		
		this._bmpUp = new cy.Bitmap(up);
		this._bmpDown = new cy.Bitmap(down);
		
		this.contentBmp = new cy.Bitmap(this._bmpUp.image);
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
					o._resetUI('down');
					break;
				case 'pressup':
				case 'rollout':
					o._resetUI('up');
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
	
	// hitTestDraw: function(ctx){
		// var image = this.contentBmp.image,
			// width = image.width,
			// height = image.height;
		// ctx.fillStyle = '#FFF';
		// ctx.fillRect(0, 0, width, height);
	// },
			
	_resetUI: function (state) {
		switch(state){
			case 'up':
				this.contentBmp.image = this._bmpUp.image;
				break;
			case 'down':
				this.contentBmp.image = this._bmpDown.image;
				break;
		}
		
	}

});

cy.Button = Button;

})();