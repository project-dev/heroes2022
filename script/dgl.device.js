'use strict';

/**
 * デバイス関連管理オブジェクト
 */
let dglDevice;

/**
 * デバイス関連管理オブジェクトの初期化
 * dglInitalizeから呼び出される
 * @param {*} parentElement 親エレメント
 */
function dglDeviceInitalize(parentElement){
    // デバイス関係の情報
    dglDevice = {

        /**
         * マウス情報
         */
        mouse:{
            /**
             * バックバッファ状のマウスのX座標
             */
            x:-1,
            
            /**
             * バックバッファ状のマウスのY座標
             */
            y:-1,
            
            /**
             * イベント情報
             */
            event:null,

            /**
             * MouseEventをdglDevice.mouse.eventに設定する
             */
            setEvent:(stateName, e)=>{
                dglDevice.mouse.event = {
                    stateName:stateName,
                    altKey:e.altKey,
                    button:e.button,
                    buttons:e.buttons,
                    clientX:e.clientX,
                    clientY:e.clientY,
                    ctrlKey:e.ctrlKey,
                    metaKey:e.metaKey,
                    movementX:e.movementX,
                    movementY:e.movementY,
                    offsetX:e.offsetX,
                    offsetY:e.offsetY,
                    pageX:e.pageX,
                    pageY:e.pageY,
                    region:e.region,
                    relatedTarget:e.relatedTarget,
                    screenX:e.screenX,
                    screenY:e.screenY,
                    shiftKey:e.shiftKey,
                    rotation:e.rotation,
                    scale:e.scale
                };

                // マウスの座標をバックバッファ状の座標に変換する
                convertMousePosition(e);
            },
        },

        /**
         * タッチ情報
         */
        touch:{
            event:null,
            setEvent:(stateName, e)=>{
                dglDevice.touch.event = {
                    stateName:stateName,
                    altKey:e.altKey,
                    changedTouches:e.changedTouches,
                    ctrlKey:e.ctrlKey,
                    metaKey:e.metaKey,
                    shiftKey:e.shiftKey,
                    targetTouches:e.targetTouches,
                    touches:e.touches,

                };
            },
        },

        /**
         * キー情報
         */
        key:{
            event:null,
            setEvent:(stateName, e)=>{
            }
        },

        /**
         * ゲームパッド情報
         */
        pad:{},
        reset:()=>{
            dglDevice.mouse.event = null;
            dglDevice.touch.event = null;
        }
    };

    if(!parentElement){
        parentElement = document.getElementsByTagName("body").item(0);
    }

    // -------------------------------------------------
 	// mouse event
    // -------------------------------------------------
    // クリック
    parentElement.addEventListener("click", function(e){
        dglDevice.mouse.setEvent("click", e);
	});

    // ダブルクリック
	parentElement.addEventListener("dblclick", function(e){
        dglDevice.mouse.setEvent("dbclick", e);
	});
   
    // マウス移動
    parentElement.addEventListener("mousemove", function(e){
        dglDevice.mouse.setEvent("move", e);
	});

    // -------------------------------------------------
	// key event
    // -------------------------------------------------
    
    // キーダウン
    parentElement.addEventListener("keydown", function(e){
		dglDevice.key.setEvent("keydown", e);
	});

    // キーアップ
	parentElement.addEventListener("keyup", function(e){
		dglDevice.key.setEvent("keyup", e);
	});

    // -------------------------------------------------
	// touch event
    // -------------------------------------------------

    // タッチ開始
    document.body.addEventListener("touchstart", function(e){
        dglDevice.touch.setEvent("touchstart", e);
	});

	// タッチ移動
	document.body.addEventListener("touchmove", function(e){
        dglDevice.touch.setEvent("touchmove", e);
	});

	// タッチ終了
	document.body.addEventListener("touchend", function(e){
        dglDevice.touch.setEvent("touchend", e);
	});

    // -------------------------------------------------
	// game pad event
    // -------------------------------------------------

    // ゲームパッド接続
    window.addEventListener("gamepadconnected", function(e){
//		var pad = e.gamepad;
//		mainObj.GamePad[e.gamepad.index] = pad;
//		console.log("connected : index = " +pad.index + " / id = " + pad.id + " / mapping : " + pad.mapping);

	});

	// ゲームパッド切断
	window.addEventListener("gamepaddisconnected", function(e){
//		console.log("disconnect : index = " + e.gamepad.index + " / id = " + pad.id + " / mapping : " + pad.mapping);
//		delete mainObj.GamePad[e.gamepad.index];
	});

}


/**
 * マウスの座標をバックバッファに変換する
 * @param {event} mouseEvent 
 */
 function convertMousePosition(mouseEvent){
	var mousex = mouseEvent.pageX;
	var mousey = mouseEvent.pageY;

	var bgw = backBuffer.width;
	var bgh = backBuffer.height;

	var w = frontBuffer.width;
	var h = frontBuffer.height;

	if(dglMain.displayInfo.target == "device"){
		mousex = mousex - frontBuffer.getBoundingClientRect().x;
		mousey = mousey - frontBuffer.getBoundingClientRect().y;
	}else{
		var x = Math.floor((w - bgw * dglMain.displayInfo.scale) / 2);
		var y = Math.floor((h - bgh * dglMain.displayInfo.scale) / 2);
		
		if(
			x <= mousex && mousex <= x + Math.floor(bgw * dglMain.displayInfo.scale)
		&&	y <= mousey && mousey <= y + Math.floor(bgh * dglMain.displayInfo.scale)
		){
			// 範囲内
			mousex = Math.floor((mousex - x) / dglMain.displayInfo.scale);
			mousey = Math.floor((mousey - y) / dglMain.displayInfo.scale);
        }else{
            // 範囲外の場合、前回の位置を再利用
            mousex = dglDevice.mouse.x;
            mousey = dglDevice.mouse.y;
        }
	}
    dglDevice.mouse.x = mousex;
    dglDevice.mouse.y = mousey;
}

/**
 * タッチの座標をバックバッファに変換する
 * @param {event} touchEvent 
 */
 function convertTouchPosition(touchEvent){
	var mousex = mouseEvent.pageX;
	var mousey = mouseEvent.pageY;

	var bgw = backBuffer.width;
	var bgh = backBuffer.height;

	var w = frontBuffer.width;
	var h = frontBuffer.height;

    if(touchEvent.changedTouches){
        if(dglMain.displayInfo.target == "device"){
//            dglDevice.touch.changedTouches
        }

    }

    if(touchEvent.targetTouches){
        touchEvent.targetTouches.forEach(touch =>{
        });
    }

    if(touchEvent.touches){
        
    }

    if(dglMain.displayInfo.target == "device"){
		mousex = mousex - frontBuffer.getBoundingClientRect().x;
		mousey = mousey - frontBuffer.getBoundingClientRect().y;
	}else{
		var x = Math.floor((w - bgw * dglMain.displayInfo.scale) / 2);
		var y = Math.floor((h - bgh * dglMain.displayInfo.scale) / 2);
		
		if(
			x <= mousex && mousex <= x + Math.floor(bgw * dglMain.displayInfo.scale)
		&&	y <= mousey && mousey <= y + Math.floor(bgh * dglMain.displayInfo.scale)
		){
			// 範囲内
			mousex = Math.floor((mousex - x) / dglMain.displayInfo.scale);
			mousey = Math.floor((mousey - y) / dglMain.displayInfo.scale);
        }else{
            // 範囲外の場合、前回の位置を再利用
            mousex = dglDevice.mouse.x;
            mousey = dglDevice.mouse.y;
        }
	}
    dglDevice.mouse.x = mousex;
    dglDevice.mouse.y = mousey;


	//if(this.isDispDebugInfo){
	//	console.log("mx : " + mousex + "/my : " + mousey);
	//}
}
