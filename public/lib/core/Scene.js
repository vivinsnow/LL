
(function() {
    "use strict";
    
var Scene = Class.extend.call(cy.Container, {
	name: 'Scene',
	init: function(){
		this.initialize();
		this.width = App.viewport.width;
		this.height = App.viewport.height;
	},
	enter: function( parent, index ){
		if( typeof( index ) === 'number') {
			parent.addChildAt( this, 0 );
		} else {
			parent.addChild( this );
		}
	},
	exit: function(){
		var parent = this.parent;
		parent && parent.removeChild(this);
	}
	
});

cy.Scene = Scene;

})();