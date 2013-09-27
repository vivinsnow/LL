


(function(){
	"use strict";
	
var DragBox = Class.extend.call(cy.Container, {
	name: 'DragBox',
	dragItem: null,
	copyItem: null,
	copyRegX: 0,
	copyRegY: 0,
	init: function(){
		this.initialize();
		this.dropItems = [];
		var o = this, endX, endY;
		this.addEventListener('pressmove',function(e){
			// 有可拖拽对象被选中
			if( o.dragItem ){
				// 创建对象的副本
				if( !o.copyItem ) {
					o.copyItem = o.dragItem.clone('true');
					o.copyItem.regX = o.copyRegX;
					o.copyItem.regY = o.copyRegY;
					App.stage.addChild( o.copyItem );
				}
				// 更新副本的坐标
				endX = e.stageX;
				endY = e.stageY;
				o.copyItem.x = endX / App.stage.scaleX;
				o.copyItem.y = endY / App.stage.scaleY;
			}
		});
		this.addEventListener('pressup',function(){
			// 存在拖拽产生的副本时
			if( o.copyItem ){
				App.stage.removeChild( o.copyItem );
				// 检测  drop 事件
				o.testDropItem(o._getObjectsUnderPoint(endX, endY));
				o.copyItem = null;	
			}
			// 清除对象引用
			o.dragItem = null;
		});
	},
	addDragItem: function(item){
		var o = this;
		item.addEventListener('mousedown',function(e){
			// 确定拖拽对象
			o.dragItem = item;
			// 确定副本的锚点
			var mtx = item.getConcatenatedMatrix(),
				x = e.stageX / App.stage.scaleX,
				y = e.stageY / App.stage.scaleY;
			o.copyRegX = x - mtx.tx / mtx.a;
			o.copyRegY = y - mtx.ty / mtx.d;
		});
	},
	addDropItem: function(item, handleDrop){
		this.dropItems.push(item);
		handleDrop && item.addEventListener('drop', handleDrop);
	},
	testDropItem: function( result ){
		var o = this, target, event;
		this.dropItems.forEach(function(a, b){
			target = result;
			// 冒泡检测
			while( target ){
				if( target === a ){
					event = new cy.Event('drop');
					event.dragTarget = o.dragItem;
					target.dispatchEvent(event);
					target = null;
				} else {
					target = target.parent;
				}
			}
		});
	}
	
});

cy.DragBox = DragBox;

})();