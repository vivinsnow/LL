
(function(){
	"use strict";
	
var TextArea = Class.extend.call(cy.DOMElement, {
	name: 'TextArea',

	init: function( className ){
		var element = document.createElement('textarea');
		element.className = className;
		element.state = 'blur';
		element.onfocus = element.onblur = cy.TextField._handleFocusOrBlur;
		this.initialize( element );
	},

	focus: function(){
		this.htmlElement.focus();
	},
	
	blur: function(){
		this.htmlElement.blur();
	},
	
	getValue: function(){
		return this.htmlElement.value;
	},
	
	setValue: function(val){
		this.htmlElement.value = val;
	},
	
	setMaxLength: function( len ){
		this.htmlElement.maxLength = len;
	}
});

cy.TextArea = TextArea;

})();