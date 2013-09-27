

(function() {
    "use strict";

var App = Class.extend({
	viewport: null,
	resource: null,
	
	stage: null,
	currentScene: null,
	
	init: function ( config ){
        this.viewport = new cy.Viewport( config.width, config.height, !!config.scaleToFit, {
			maxWidth: config.maxWidth || false,
			maxHeight: config.maxHeight || false,
			minWidth: config.minWidth || false,
			minHeight: config.minHeight || false
		});
        this.resource = new cy.Resource( !!config.crossOriginAllow );
        this.resource.initLoad( config.manifest, config.loadComplete);
		this.initStage( config.fps, !!config.showFPS, !!config.enableMouseOver);
    },
	
	getRes: function(name){
        return this.resource.getImage(name);
    },

    initStage: function ( fps, showFPS, enableMouseOver) {
        var screen = document.getElementById('gameScreen'),
			canvas = document.getElementById('gameCanvas'),
            stage = new cy.Stage( canvas ),
			viewport = this.viewport,
			isMobile = !!cy.UserAgent.mobile,
			gameFPS = cy.$('<div id="gameFPS"></div>'),
			o = this,
			startTime = 0;
			
        gameFPS.appendTo(screen);
		stage.autoClear = true;
		cy.Ticker.useRAF = true;
        cy.Ticker.setFPS( fps || 30 );
        cy.Ticker.addEventListener('tick', function(e){
            startTime = new Date().getTime();
			if( window.innerWidth !== viewport.winWidth || window.innerHeight !== viewport.winHeight){
				if((startTime - viewport.lastResetTime) > 1000){
					//当有输入框获得焦点时，即键盘弹出时不作调整
					if( !viewport.testInputFocus() ){
						viewport.handleResize && viewport.handleResize();
						viewport.lastResetTime = startTime;
						viewport.resetCount++;
						o.resetStage();
					}
				}
			}
            stage.update(e);
			if( showFPS ) {
				gameFPS.html( Math.floor(cy.Ticker.getMeasuredFPS()) + ' / ' + 
                               (new Date().getTime() - startTime)  /*+ '<br />' + 
							   viewport.zoomX + ' / ' + viewport.zoomY + '<br />' +
							   viewport.winWidth + ' / ' + viewport.winHeight+'<br />' +
							   window.innerWidth + ' / ' + window.innerHeight+'<br />' +
							   viewport.resetCount*/); 
			}
        });

        if( isMobile ) {
            cy.Touch.enable( stage, true );
        }
		if( enableMouseOver ) {
            stage.enableMouseOver( 10 );
        }
        this.stage = stage;
		this.resetStage();
    },
	
	resetStage: function(){
		var viewport = this.viewport;
		this.stage.scaleX = viewport.zoomX;
		this.stage.scaleY = viewport.zoomY;
	},

	clearStage: function(){
		this.stage.children = [];
	},
	
	runScene: function(scene, transition){
		var lastScene = this.currentScene, stage = this.stage;
		if (lastScene !== scene) {
			this.currentScene = scene;
			transition = transition || '';
			switch (transition) {
				case 'fadeIn':
					scene.alpha = 0;
					scene.enter(stage);
					scene.mouseEnabled = false;
					if (lastScene) {
						lastScene.mouseEnabled = false;
					}
					cy.Tween.get(scene).to({
						alpha: 1
					}, 300).call(function(){
						if (lastScene) {
							lastScene.exit();
							lastScene.mouseEnabled = true;
						}
						scene.mouseEnabled = true;
					});
					break;
				case 'fadeOut':
					scene.enter(stage, 0);
					if (lastScene) {
						scene.mouseEnabled = false;
						lastScene.mouseEnabled = false;
						cy.Tween.get(lastScene).to({
							alpha: 0
						}, 300).call(function(){
							lastScene.exit();
							lastScene.alpha = 1;
							lastScene.mouseEnabled = true;
							scene.mouseEnabled = true;
						});
					}
					break;
				case 'popOut':
					scene.x = scene.regX = this.viewport.width / 2;
					scene.y = scene.regY = this.viewport.height / 2;
					scene.scaleX = scene.scaleY = 0.5;
					scene.enter(stage);
					scene.mouseEnabled = false;
					if (lastScene) {
						lastScene.mouseEnabled = false;
					}
					cy.Tween.get(scene).to({
						scaleX: 1,
						scaleY: 1,
					}, 300).call(function(){
						if (lastScene) {
							lastScene.exit();
							lastScene.mouseEnabled = true;
						}
						scene.x = scene.y = scene.regX = scene.regY = 0;
						scene.mouseEnabled = true;
					});
					break;
				case 'fallDown':
					scene.y = -this.viewport.height;
					scene.enter(stage);
					scene.mouseEnabled = false;
					if (lastScene) {
						lastScene.mouseEnabled = false;
					}
					cy.Tween.get(scene).to({
						y: 0
					}, 300).call(function(){
						if (lastScene) {
							lastScene.exit();
							lastScene.mouseEnabled = true;
						}
						scene.mouseEnabled = true;
					});
					break;
				default:
					scene.enter(stage);
					lastScene && lastScene.exit();
					break;
			}
		}
	}
});

App.create = function(config){
	if(!window.App){
		window.App = new App(config);
	}
	return window.App;
};

cy.App = App;

})();