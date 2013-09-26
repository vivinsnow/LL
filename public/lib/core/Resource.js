
(function() {
    "use strict";

var Resource = Class.extend({
	_preload: null,
    _asynload: null,
	crossOriginAllow: false,
	
	init: function ( crossOriginAllow ){
        this.crossOriginAllow = crossOriginAllow;
    },
	
	getImage: function(name){
        var img = this._preload.getResult(name);
        return img? img : name;
    },

    initLoad: function( manifest, loadComplete ){
        var o = this,
            preload = new cy.LoadQueue( this.crossOriginAllow );
        preload.installPlugin( cy.Sound );
        preload.addEventListener( 'fileload', function( e ){
            var item = e.item,
                result = e.result;
            if (item.type === cy.LoadQueue.JAVASCRIPT) {
                if( o.crossOriginAllow ) {
                     document.head.appendChild( result );
                     document.head.removeChild( result );
                }
            }
            else if (item.type === cy.LoadQueue.CSS) {
                document.head.AppendChild( result );
            }      
        });

        var handleComplete = function(){
            preload.removeEventListener( 'complete', handleComplete );
            var logo = cy.$('#gameLogo');
            logo.animate( { opacity: 0 }, 800, null, 2000,
				function(){
                	logo.remove();
                    loadComplete();
                    cy.$(document.body).css('background','#000');
            	}
			);
        };
        
        preload.addEventListener( 'complete', handleComplete );
        preload.loadManifest(manifest);
	
		this._preload = preload;
    },

    asynLoad: function( manifest, loadComplete ){

    },

    clearAsynRes: function(){

    }
});

cy.Resource = Resource;

})();