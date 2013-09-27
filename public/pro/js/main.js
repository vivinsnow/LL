
window.addEventListener('DOMContentLoaded', function(){
	cy.App.create({
		fps: 60,
		width: 640,
		height: 960,//'device-height',
		
		showFPS: true,
		scaleToFit: true,
		enableMouseOver: false,
		crossOriginAllow: false,
		
		server: 'ws://127.0.0.1:8000/',
		manifest: [
			{ src: 'js/TestScene.js' },
			
			{ src:'img/wf/wf1_0.png', id:'wf0'},
			{ src:'img/wf/wf1_1.png', id:'wf1'},
			{ src:'img/wf/wf1_2.png', id:'wf2'},
			{ src:'img/wf/wf1_3.png', id:'wf3'},
			{ src:'img/wf/wf1_4.png', id:'wf4'},
			{ src:'img/wf/wf1_5.png', id:'wf5'},
			{ src:'img/wf/wf1_6.png', id:'wf6'},
			{ src:'img/wf/wf1_7.png', id:'wf7'},
			{ src:'img/wf/wf1_8.png', id:'wf8'},
			
			{ src: 'img/guoxiang.png'},
			{ src: 'img/home_bg.png'},
			
			// { src: 'img/home_btn_1.png'},
			// { src: 'img/home_btn_2.png'},
			// { src: 'img/team_btn_1.png'},
			// { src: 'img/team_btn_2.png'},
			// { src: 'img/area_btn_1.png'},
			// { src: 'img/area_btn_2.png'},
			// { src: 'img/shop_btn_1.png'},
			// { src: 'img/shop_btn_2.png'},
			// { src: 'img/bag_btn_1.png'},
			// { src: 'img/bag_btn_2.png'},
			// { src: 'img/other_btn_1.png'},
			// { src: 'img/other_btn_2.png'},
			
			{ src: 'img/item_bg_1.png'},
			{ src: 'img/item_bg_2.png'},
			{ src: 'img/fight_btn_1.png'},
			{ src: 'img/fight_btn_2.png'},
			
			{ src: 'img/bg_1.png'},
			{ src: 'img/head_bg_1.png'},
			{ src: 'img/head_bg_2.png'},
			{ src: 'img/head_bg_3.png'},
			{ src: 'img/notice_bg.png'},
			{ src: 'img/icon_frame.png'},
			{ src: 'img/battle_bg.png'},
			{ src: 'img/battle_bg_2.png'},
			

			{ src: 'img/bottom_bg.png'},
			{ src: 'img/area_title_1.png'}
		],

		loadComplete: function(){
			
			App.runScene(new scene.HomeScene());
			
		}
	});
});
