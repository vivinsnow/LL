

(function(){

window.group = {
	MainMenu: cy.Panel.extend({
		init: function(){
			this.Super_init();
			this.addChild(new cy.Bitmap(App.getRes('img/bottom_bg.png')));
			this.homeBtn = new cy.Button(App.getRes('img/home_btn_1.png'), App.getRes('img/home_btn_2.png'));
			this.teamBtn = new cy.Button(App.getRes('img/team_btn_1.png'), App.getRes('img/team_btn_2.png'));
			this.areaBtn = new cy.Button(App.getRes('img/area_btn_1.png'), App.getRes('img/area_btn_2.png'));
			this.bagBtn  = new cy.Button(App.getRes('img/bag_btn_1.png'), App.getRes('img/bag_btn_2.png'));
			this.shopBtn = new cy.Button(App.getRes('img/shop_btn_1.png'), App.getRes('img/shop_btn_2.png'));
			this.otherBtn = new cy.Button(App.getRes('img/other_btn_1.png'), App.getRes('img/other_btn_2.png'));
			
			var idx = 0, gap = 640/6;
			this.homeBtn.x = gap*idx++;
			this.teamBtn.x = gap*idx++;
			this.areaBtn.x = gap*idx++;
			this.bagBtn.x = gap*idx++;
			this.shopBtn.x = gap*idx++;
			this.otherBtn.x = gap*idx++;
			this.homeBtn.y = 
			this.teamBtn.y = 
			this.areaBtn.y = 
			this.bagBtn.y = 
			this.shopBtn.y = 
			this.otherBtn.y = 10;
			this.addChild(this.homeBtn,
					this.teamBtn,
					this.areaBtn,
					this.bagBtn,
					this.shopBtn,
					this.otherBtn);
					
		}
	}),
	NoticeMarquee: cy.Panel.extend({
		_queue: null,
		init: function(){
			this.Super_init();
			this._queue = [];
			this.addChild(new cy.Bitmap(App.getRes('img/notice_bg.png')));
			this.innerPanel = new cy.Panel(600, 36);
			this.innerPanel.x = 20;
			this.innerPanel.y = 14;
			this.innerPanel.overflow = false;
			this.innerPanel.border = true;
			this.addChild(this.innerPanel);
			this.showMsg('欢迎来到魔兽世界，游戏目前处于测试阶段，欢迎提出宝贵意见!!!');
		},
		showMsg: function(txt){
			var txt = new cy.Label(txt),
				width = txt.getMeasuredWidth();
			txt.color = 'white';
			txt.cache(0,0,width,30);
			this.innerPanel.addChild(txt);
			txt.x = 600;
			cy.Tween.get(txt, {loop:true}).wait(1000).to({
				x: 600
			}).to({
				x: -width
			}, (width+600)*15);
		}
	}),
	PlayerInfo: cy.Panel.extend({
		init: function(){
			this.Super_init();
			this.addChild(new cy.Bitmap(App.getRes('img/head_bg_3.png')));
		}
	}),
	
	AreaPanel: cy.Panel.extend({
		scroller: null,
		init:function(){
			this.Super_init(640,790);
			var head = new cy.Bitmap(App.getRes('img/area_title_1.png'));
			// head.y = 5;
			this.scroller = new cy.Scroller(640,854);
			var shape = new cy.Shape();
			shape.graphics.beginFill('rgba(61,38,24,0.9)').drawRect(0,0,640,600);
			// this.scroller.x = 8;
//			shape.y = this.scroller.y = 190;
			this.addChild(this.scroller);
//			this.addChild(shape, head, this.scroller);
			this.initContent();
		},
		initContent: function(){
			var panel = new cy.Panel(640, (352+36)*10);
			var child;
			for(var i=0;i<10;i++){
				child = this.getItem(i);
				panel.addChild(child);
			}
			this.scroller.setContent(panel);
		},
		getItem: function(idx){
			var item = new cy.Panel(),
				bg = new cy.Panel(),
				bg1 = new cy.Bitmap(App.getRes('img/item_bg_2.png')),
				bg2 = new cy.Bitmap(App.getRes('img/item_bg_1.png')),
				bg3 = new cy.Bitmap(App.getRes('img/item_bg_2.png'));
			bg3.scaleY = -1;
			bg2.y = 22;
			bg3.regY = 16;
			bg3.y = 352+28;
			bg.addChild(bg2, bg1, bg3);
			
			
			var icon = new cy.Bitmap(App.getRes('img/duanyu.png'));
			icon.x = 30;
			icon.y = 55;
			var title = new cy.Label('易容术',{fontSize:35, outline:'#FD8'});
			var txt = new cy.Label('咱们是大名鼎鼎的的“北乔峰”和“南慕容”，快点投降吧！\r西夏一品堂人刚刚从这边过去，快追！！！',{fontSize:22});
			title.x = 
			txt.x = 136;
			title.y = 50;
			txt.y = 92;
			var fightBtn = new cy.Button(App.getRes('img/fight_btn_1.png'), App.getRes('img/fight_btn_2.png'));
			fightBtn.x = (640-150)/2;
			fightBtn.y = 200;
			var o = this;
			fightBtn.on('click', function(){
				App.runScene(new scene.BattleScene(), 'fallDown');
			});
			
			bg.addChild(title,txt);
			bg.cache(0,0,640,352+36);
			item.y = idx*(352+36);
			item.addChild(bg, icon, fightBtn);
			return item;
		}
	}),
	
	TeamPanel: cy.Panel.extend({
		init: function(){
			this.Super_init(640, 790);
			var head = new cy.Bitmap(App.getRes('img/bg_1.png'));
			head.sourceRect = {
				x:0, y:0, width:640, height:790
			};
			this.bg = new cy.Panel();
			this.bg.addChild(head);
			this.dragBox = new cy.DragBox();
			this.addChild(this.bg, this.dragBox);
			this.arr = ['img/ouyang.png', 'img/duanyu.png', 'img/murong.png', 'img/skill_1.png', 'img/skill_2.png'];
			var c,	o = this, ondrop = function(e){
				var drag = e.dragTarget,
					drop = e.currentTarget;
					
				if(drag === drop ) return;
				var x1 = drag.x,
					y1 = drag.y,
					x2 = drop.x,
					y2 = drop.y;
					
				o.dragBox.swapChildren(drag, o.dragBox.children[19]);
				o.dragBox.swapChildren(drop, o.dragBox.children[18]);
				cy.Tween.get(drag).to({
					x:x2, y:y2
				},200);
				cy.Tween.get(drop).to({
					x:x1, y:y1
				},200);

			};
			for(var i = 0; i< 20; i++){
				c = this.getItem(i);
				this.dragBox.addChild(c);
				this.dragBox.addDragItem(c);
				this.dragBox.addDropItem(c, ondrop);
			}
			this.bg.cache(0,0,this.width, this.height);
		},
		
		getItem: function(i){
			var frame = new cy.Bitmap(App.getRes('img/icon_frame.png')),
				item = new cy.Bitmap(App.getRes(this.arr[i%5]));
			frame.x = item.x = i%4*160 + 25;
			frame.y = item.y = Math.floor(i/4)*160+15;
			this.bg.addChild(frame);
			return item;
		}
		
	}),
	
	ChatPanel: cy.Panel.extend({
		init: function(){
			this.Super_init();
			var input = new cy.TextField('input'),
				area = new cy.TextArea('area'),
				shape = new cy.Shape(),
				btn = new cy.Button(App.getRes('img/baocun_btn_1.png'), App.getRes('img/baocun_btn_2.png'));
			shape.graphics.beginFill('#F00').drawRect(0,0,640,700);
			this.addChild(shape, input, btn, area);
			input.y = 20;
			input.x = 150;
			btn.x = 500;
			btn.y = 12;
			area.x = 50;
			area.y = 620;
			this.on('click', function(){
				input.blur();
			});
			// area.setMaxLength(20);
			
			var o = this;
			btn.on('click', function(){
				var value = input.getValue();
				input.setValue('');
				area.setValue( area.getValue() + value);
			});
			
		}
	}),
	
	MoviePlayer: Class.extend({
		round:0,
		init: function(screen, data){
			this.screen = screen;
			this.left = new cy.Panel();
			this.right = new cy.Panel();
			this.left.addChild(new cy.Bitmap(App.getRes('img/guoxiang.png')));
			this.right.addChild(new cy.Bitmap(App.getRes('img/tianboguan.png')));
			this.data = data;
			this.nextRound();
		},
		nextRound: function(){
			if(this.mc) {
				this.screen.removeChild(this.mc);
				this.mc = null;
			}
			this.mc = new cy.MovieClip(null, 0, false, {start:0});
			this.screen.addChild(this.mc);
			this.playMovie(this.mc, (this.round%2===0?'leftSide':'rightSide'), Math.random()>0.5?'shizihou':'attak');
			this.round++;
		},
		playMovie: function(mc, atkSide, name){
			var atk = atkSide==='leftSide'?this.left:this.right,
				def = atkSide==='leftSide'?this.right:this.left,
				adapt = atkSide==='leftSide'?true:false,
				empty = new cy.DisplayObject();
			
			var	sheet = new cy.SpriteSheet({
					images:[
						App.getRes('img/atk_1_1.png'),
						App.getRes('img/atk_1_2.png'),
						App.getRes('img/atk_1_3.png')
					],
					frames:[
						[0,0,406,244,0,85,144],
						[0,0,320,288,1,29,-13],
						[0,0,339,129,2,127,-64]
					],
					animations:{
						run: [0, 2, false, 0.15]
					}
				}),
				eff = new cy.Sprite(sheet, 'run');
			
			adapt && (eff.scaleX = -1);
		
			var o = this, children = movie[name].children, t, p;
			children.forEach(function(a, b){
				if(a.type === 'atkTarget'){
					t = cy.Tween.get( atk );
					a.frames && a.frames.forEach(function(aa, bb){
						if(aa.length === 2){
							t.to(o.adpatData(aa[0], adapt), aa[1]);
						}else{
							t.wait(aa[0]);
						}
					});
					o.addTween(t);
				}else if(a.type === 'defTarget'){
					t = cy.Tween.get( def );
					a.frames && a.frames.forEach(function(aa, bb){
						if(aa.length === 2){
							t.to(o.adpatData(aa[0], adapt), aa[1]);
						}else{
							t.wait(aa[0]);
						}
					});
					o.addTween(t);
				}else if(a.type === 'effect'){
					if(a.parent === 'atkTarget'){
						p = atk;
					}else if(a.parent === 'defTarget'){
						p = def;
					}
					a.lighter && (eff.compositeOperation = 'lighter');
					eff.x = adapt?p.regX*2-a.x : a.x;
					eff.y = a.y;
					t = cy.Tween.get( empty );
					o.addTween(t.wait(a.start).call(function(){
						p.addChild(eff);
					}).wait(a.end-a.start).call(function(){
						p.removeChild(eff);
					}));
				}else if(a.type === 'image'){
					var img = new cy.Bitmap(App.getRes(a.url));
					t = cy.Tween.get( img );
					a.frames && a.frames.forEach(function(aa, bb){
						if(aa.length === 2){
							t.to(o.adpatData(aa[0], adapt, a.mirror), aa[1]);
						}else{
							t.wait(aa[0]);
						}
					});
					a.lighter && (img.compositeOperation = 'lighter');
					o.addTween(t);
				}
			});
			this.addTween(this.createTween(mc).wait(movie[name].end).call(function(){
				o.nextRound();
			}));
		},
		
		adpatData: function(data,adapt,mirror){
			if(adapt){
				var result = {}, reg = /x|rotation/g;
				for( var name in data ){
					if(reg.test(name)){
						result[name] = -data[name];
					} else if(mirror&&(!adapt)&&name==='scaleX'){
						result.scaleX = -data[name];
					} else {
						result[name] = data[name];
					}
				}
				return result;
			} else {
				return data;
			}
			
		},
		addTween: function(tween){
			this.mc && this.mc.timeline.addTween(tween);
		},
		removeTween: function(tween){
			this.mc && this.mc.timeline.removeTween(tween);
		},
		createTween: function(target){
			return cy.Tween.get(target);
		}
	})
};

var movie = {
'attak': {
	end: 60,
	name: '普通攻击',
	children:[
		{  type:'defTarget', start: 0, name: '守方',
			frames:[
				[ { x: -150, y:-20, regX: 130, regY: 165 }, 0],
				[ 18 ],
				[ { x: -160, y: 0, regX: 130, regY: 165 }, 2],
				[ { x: -150, y:-20, regX: 130, regY: 165 }, 2]
			]},
		{  type:'atkTarget', start:0, name: '攻方',
			frames:[
				[ { x: 150, y:-20, regX: 130, regY: 165 }, 0],
				[ { y: -70 }, 4],
				[ { x: 171, y: -97, rotation: 20 }, 4 ],
				[ { x: 141, y: -77, rotation: -30 }, 4 ],
				[ { x: 150, y: -20, rotation: 0 }, 4 ]
			]},
		{  type: 'effect', name: '普通攻击特效', lighter: true, mirror: true,
			start: 12, end: 27, parent: 'atkTarget', x:-30, y:30 
			}
	]
},	
'shizihou':{
	end: 200,
	name:'狮子吼',
	children:[
		{  type:'defTarget', start: 0, name: '守方',
			frames:[
				[ { x: -150, y:-20, regX: 130, regY: 165 }, 0],
				[ 65 ],
				[ { x: -158 }, 2], [ { x: -150 }, 2], [ { x: -142 }, 2], [ { x: -150 }, 2],
				[ { x: -158 }, 2], [ { x: -150 }, 2], [ { x: -142 }, 2], [ { x: -150 }, 2],
				[ { x: -158 }, 2], [ { x: -150 }, 2], [ { x: -142 }, 2], [ { x: -150 }, 2]
			]},
		{  type:'atkTarget', start:0, name: '攻方',
			frames:[
				[ { x: 150, y:-20, regX: 130, regY: 165 }, 0],
				[ { scaleX: 0.625, scaleY:0.625 }, 48],
				[ 8 ],
				[ { scaleX: 1.375, scaleY:1.375 }, 6],
				[ { scaleX: 1.125, scaleY:1.125 }, 4],
				[ { scaleX: 1, scaleY:1 }, 4],
				[ { scaleX: 1.0625, scaleY:1.0625 }, 4]
			]},
		{  type: 'image', name: '狮子吼', url: 'img/shizihou.png', lighter: true,
			frames:[
				[ { x: 150, y:-42, regX: 252/2, regY: 291/2, alpha:0 }, 0],
				[ 65 ],
				[ { alpha: 1 }, 0],
				[ { y:-22, scaleX: 1.75, scaleY: 1.75 },2],
				[ { scaleX: 2, scaleY: 2 }, 2],
				[ { scaleX: 1.5, scaleY: 1.5 },2 ],
				[ { scaleX: 2.125, scaleY: 2.125 }, 4],
				[ { scaleX: 1.5625, scaleY: 1.5625 }, 2],
				[ 30 ],
				[ { alpha: 0 }, 16],
			]},
		{  type: 'image', name: '吸血', url: 'img/xixue_1.png', lighter: true,
			frames:[
				[ { x: 150, y:-42, regX: 250, regY: 250 }, 0],
				[ { scaleX: 0.25, scaleY: 0.25 }, 48],
				[ { alpha: 0 }, 2]
			]},
		{  type: 'image', name: '聚气', url: 'img/juqi_1.png', lighter: true,
			frames:[
				[ { x: 150, y:62, regX: 296/2, regY: 286/2 , alpha:0 }, 0],
				[ 64 ],
				[ { alpha: 1 }, 0],
				[ { scaleX: 5.75, scaleY: 5.75 }, 4],
				[ { alpha: 0 }, 4]
			]},
		{  type: 'image', name: '对掌', url: 'img/duizhang_1.png', lighter: true,
			frames:[
				[ { x: 146, y:-18, regX: 117/2, regY: 108/2 , alpha:0, scaleX: 9.875, scaleY: 9.875}, 0],
				[ 14 ],
				[ { alpha: 1 }, 4 ],
				[ {  scaleX: 0.675, scaleY: 0.675 }, 34],
				[ { alpha: 0 }, 4]
			]},
		{  type: 'image', name: '格挡', url: 'img/gedang_2.png', lighter: true, mirror: true,
			frames:[
				[ { x: 158, y:6, regX: 409/2, regY: 417/2 , alpha:0 }, 0],
				[ 66 ],
				[ { alpha: 1 }, 0],
				[ { scaleX: 0.91176470588235, scaleY: 0.91176470588235 }, 4],
				[ { scaleX: 4.125, scaleY: 4.125 }, 4],
				[ { alpha: 0 }, 2]
			]},
		{  type: 'image', name: '格挡', url: 'img/gedang_2.png', lighter: true, mirror: true,
			frames:[
				[ { x: 158, y:6, regX: 409/2, regY: 417/2 , alpha:0 }, 0],
				[ 70 ],
				[ { alpha: 1 }, 0],
				[ { scaleX: 0.91176470588235, scaleY: 0.91176470588235 }, 4],
				[ { scaleX: 4.125, scaleY: 4.125 }, 4],
				[ { alpha: 0 }, 2]
			]},
		{  type: 'image', name: '格挡', url: 'img/gedang_2.png', lighter: true, mirror: true,
			frames:[
				[ { x: 158, y:6, regX: 409/2, regY: 417/2 , alpha:0 }, 0],
				[ 74 ],
				[ { alpha: 1 }, 0],
				[ { scaleX: 0.91176470588235, scaleY: 0.91176470588235 }, 4],
				[ { scaleX: 4.125, scaleY: 4.125 }, 4],
				[ { alpha: 0 }, 2]
			]},
		
	]
}		
};

window.scene = {
	
	HomeScene: cy.Scene.extend({
		init: function(){
			this.Super_init();
			this.homeBg = new cy.Bitmap(App.getRes('img/home_bg.png'));
			this.homeBg.y = -35;
			this.noticeMarquee = new group.NoticeMarquee();
			this.playerInfo = new group.PlayerInfo();
			this.playerInfo.y = 68;
			this.mainMenu = new group.MainMenu();
			this.mainMenu.y = this.height - 103;
			
			this.addChild(this.homeBg, this.noticeMarquee, this.playerInfo, this.mainMenu);
			
			var menu = this.mainMenu,
				o = this;
			menu.homeBtn.on('click', function(){
				o.removeAll();
			});
			menu.teamBtn.on('click', function(){
				if(!o.teamPanel){
					o.removeAll();
					o.showTeamList();
				}
			});
			menu.areaBtn.on('click', function(){
				if(!o.areaPanel){
					o.removeAll();
					o.showAreaList();
				}
			});
			menu.bagBtn.on('click', function(){
				if(!o.scl){
					o.removeAll();
					o.showScroller();
				}
			});
			menu.shopBtn.on('click', function(){

			});
			menu.otherBtn.on('click', function(){
				if(!o.chatPanel){
					o.removeAll();
					o.showChatPanel();
				}
			});
		},
		removeAll: function(){
			if(this.areaPanel){
				this.removeChild(this.areaPanel);
				this.areaPanel = null;
			}
			if(this.teamPanel){
				this.removeChild(this.teamPanel);
				this.teamPanel = null;
			}
			if(this.chatPanel){
				this.removeChild(this.chatPanel);
				this.chatPanel = null;
			}
			if(this.scl){
				this.removeChild(this.scl);
				this.scl = null;
			}
		},
		showScroller: function(){
			var htmls = '';
			for(var i=0;i<10;i++){
				htmls += [
					'<div style="position:relative; width:640px; height:'+352+'px;background:url(img/item_bg_1.png);margin-top:18px;">',
						'<img style="left:30px;top:55px" src="img/duanyu.png">',
						'<div style="font-size:22px;left:136px;top:92px;">咱们是大名鼎鼎的的“北乔峰”和“南慕容”，快点投降吧！<br />西夏一品堂人刚刚从这边过去，快追！！！</div>',
						'<button style="left:245px;top:200px;width:150px;height:65px;background:url(img/fight_btn_1.png);"></button>',
					'</div>',
				].join('');
			}
			this.scl = new cy.UIScroller([
				'<div style="width:640px;height:854px;overflow:hidden;">',
					'<div style="width:640px; height:'+(352+18)*10+'px;">',
					htmls,
					'</div>',
				'</div>'
			].join(''));
			this.scl.getChild(0, 0, 2).bind('click', function(){ App.runScene(new scene.HomeScene()); });
			this.addChild(this.scl);
			var o = this;
			setTimeout(function(){
				o.scl.refresh();
			}, 200);
					
		},
		showAreaList:function(){
			this.areaPanel = new group.AreaPanel();
//			this.areaPanel.y = 68;
			this.addChild(this.areaPanel);
		},
		showTeamList:function(){
			this.teamPanel = new group.TeamPanel();
			this.teamPanel.y = 68;
			this.addChild(this.teamPanel);
		},
		showChatPanel: function(){
			this.chatPanel = new group.ChatPanel();
			this.addChild(this.chatPanel);
		}
	}),
	
	BattleScene: cy.Scene.extend({
		init: function(){
			this.Super_init();
			var bg = new cy.Panel(),
				bg1 = new cy.Bitmap(App.getRes('img/battle_bg_2.png')),
				bg2 = new cy.Bitmap(App.getRes('img/battle_bg_2.png')),
				title1 = new  cy.Bitmap(App.getRes('img/team_title_1.png')),
				title2 = new  cy.Bitmap(App.getRes('img/team_title_2.png'));
			bg2.scaleY = -1;
			bg2.regY = bg2.image.height;
			bg2.y = bg2.image.height-1;
			title2.x = 640 - 185;
			bg.addChild(bg1, bg2, title1, title2);
			var movieScreen = new cy.Panel();
			movieScreen.x = this.width/2;
			movieScreen.y = this.height/2;
 			this.addChild(bg, movieScreen);
 			this.moviePlayer = new group.MoviePlayer(movieScreen);
 			movieScreen.on('click', function(){
 				App.runScene(new scene.HomeScene());
 			});
		}
	}),
	
	TestScene: cy.Scene.extend({
		init: function(){
			this.Super_init();
			this.addChild(new group.AreaPanel());
		}
	})
};

})();
