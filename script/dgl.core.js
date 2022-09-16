'use strict';

/**
 * DGLのメインオブジェクト
 */
let dglMain;

/**
 * デバッグモードの設定
 */
let debugMode = true;

/**
 * 画面モードの定義
 */
const displayModeList = {
    // Family Computer / NES
     "fc" :{"width":256, "height":224}
    // Gameboy
    ,"gb" :{"width":160, "height":144}
    // Gameboy ADVANCE
    ,"gba":{"width":240, "height":160}
    // Nintendo DS
    ,"ds" :{"width":256, "height":192}
    // Nintendo 3DS
    ,"3ds":{"width":400, "height":240}
    // Playstation Portable
    ,"psp":{"width":480, "height":272}
    // Playstation Vita
    ,"psv":{"width":960, "height":544}
    // Device Size
    ,"device":{"width":null, "height":null}
};

/**
 * フロントバッファ。CANVASタグ
 */
let frontBuffer;

/**
 * フロントバッファのコンテキスト
 */
let frontCtx;

/**
 * バックバッファ。CANVASタグ
 */
let backBuffer;
 
/**
 * バックバッファのコンテキスト
 */
let backCtx;

/**
 * PNGライブラリのバックバッファ
 */
let pngBackBuffer;

/**
 * DGLの初期化を行います
 * @param {element} parentElement 親要素。指定しない場合、自動的にbodyタグを親とする
 * @param {string} displayModeName 画面モードの定義の名称
 */
function dglInitalize(parentElement, displayModeName){

    if(!(displayModeName in displayModeList)){
        var msg = createErrorMessage('displayModeName "' + displayModeName + '" does not exist.');
        throw msg;
    }

    // メインのオブジェクトを生成する
    // ToDo:メンバは後で整理する(大変そう)
    dglMain = {
        /**
         * シーンを管理するためのマップ
         */        
        sceneMap : {},

        /**
         * イメージを管理するためのマップ
         */
        imageMap : {},

        /**
         * 表示に関する情報
         */
        displayInfo:{
            /**
             * 画面モード。displayModeListに定義された名称を指定
             */
            target : displayModeName,

            /**
             * 指定した画面モードの幅
             */
            width:displayModeList[displayModeName].width,

            /**
             * 指定した画面モードの高さ
             */
            height:displayModeList[displayModeName].height,

            /**
             * バックバッファをフロントバッファに表示する際の倍率
             */
            scale:1,

            /**
             * バックバッファをフロントバッファに表示する際のX座標
             */
            outX:0,

            /**
             * バックバッファをフロントバッファに表示する際のY座標
             */
            outY:0,

            /**
             * フロントバッファの背景のスタイル
             */
            frontBufferBackgroundStyle:"rgba(255, 255, 255, 1)",

            /**
             * バックバッファの背景のスタイル
             */
            backgroundStyle:"rgba(0, 0, 255, 1)",
        },

        /**
         * 現在のシーンの情報
         */
        scene:{
            /**
             * 現在のシーン名称
             */
            name:"",

            /**
             * シーン変更中かどうか
             */
            changing:false,
        },

        /**
         * FPS管理情報
         */
        fps:{
            counter:0,
            basetime : 0,
            framerate : 0,
        },

        /**
         * PNHライブラリの情報
         */
        png:{
            /**
             * PNGライブラリを使用するかどうか
             */ 
            isUse:true,

            /**
             * 現在のパレット
             */
            palette:[],

            /**
             * 透過色パレット番号リスト
             */
            trans:[],

            /**
             * システムパレット
             */
            systemPalette:[],
        },

        /**
         * メイン処理
         */
        mainFunction: ()=>{

            try{
                if(!backBuffer || !backBuffer.getContext){
                    return;
                }
    
                var bgw = backBuffer.width;
                var bgh = backBuffer.height;
            
                var w = frontBuffer.width;
                var h = frontBuffer.height;
    
                setSmooth(frontCtx,false);
                setSmooth(backCtx,false);
                backCtx.textBaseline = "top";
                frontCtx.textBaseline = "top";
    
                // とりあえずクリア
                clearCanvas(frontCtx, w, h, dglMain.displayInfo.frontBufferBackgroundStyle);
    
                // とりあえずクリア
                clearCanvas(backCtx, bgw, bgh, dglMain.displayInfo.backgroundStyle);
    
                pngBackBuffer.palette = dglMain.png.systemPalette;
                pngBackBuffer.defaultPalette = dglMain.png.systemPalette;
                pngBackBuffer.trans = dglMain.png.trans;
    
                // シーンの処理
                if(dglMain.scene.name in dglMain.sceneMap){
                    // シーンの処理
                    var sceneObject = dglMain.sceneMap[dglMain.scene.name];
    
                    if("sceneMain" in sceneObject){
                        // シーンの処理を呼び出す
                        sceneObject.sceneMain(sceneObject);
                    }
                }
    
                // ここでスマホ判定して、スマホの場合は強制ランドスケープ表示させる
                var dispW = w;
                var dispH = h;
        
                // PNGのキャンバスを転送する
                if(pngBackBuffer && dglMain.png.isUse){
                    pngBackBuffer.drawContext(backCtx, pngBackBuffer, 0, 0, 0, 0);
                }
    
                // デバッグ用のポインタ描画
                if(debugMode){
                    backCtx.beginPath();
                    backCtx.fillStyle = 'rgba(255, 255, 255)';
                    backCtx.arc( dglDevice.mouse.x, dglDevice.mouse.y, 2, 0 * Math.PI / 180, 360 * Math.PI / 180, false ) ;
                    backCtx.fill() ;
                }
    
                if(dglMain.displayInfo.target == "device"){
                    // デバイス指定の場合はそのまま出力する
                    frontCtx.drawImage( backBuffer, 0, 0, bgw, bgh);
                }else{
                    if(dispW > dispH){
                        // 高さに合わせる
                        dglMain.displayInfo.scale = Math.floor((dispH / bgh) * 10) / 10;
                    }else{
                        // 幅に合わせる
                        dglMain.displayInfo.scale = Math.floor((dispW / bgw) * 10)/ 10;
                    }
            
                    // 拡大後のサイズを計算して、収まるかを確認
                    // 確認後、収まらない場合は、再計算
                    if(Math.floor(bgw * dglMain.displayInfo.scale) > dispW){
                        // 横がはみ出るので再計算
                        dglMain.displayInfo.scale = Math.floor((dispW / bgw) * 10)/ 10;
                    }else if(Math.floor(bgh * dglMain.displayInfo.scale) > dispH){
                        // 縦がはみ出るので再計算
                        dglMain.displayInfo.scale = Math.floor((dispH / bgh) * 10) / 10;
                    }
            
                    dglMain.displayInfo.outX = Math.floor((dispW - bgw * dglMain.displayInfo.scale) / 2);
                    dglMain.displayInfo.outY = Math.floor((dispH - bgh * dglMain.displayInfo.scale) / 2);
    
                    // 画像サイズの半分だけずらして画像を描画する
                    frontCtx.drawImage( backBuffer, dglMain.displayInfo.outX, dglMain.displayInfo.outY, bgw * dglMain.displayInfo.scale, bgh * dglMain.displayInfo.scale );
                }
        
                dglMain.fps.counter++;
                var now = new Date();
                if(now - dglMain.fps.basetime >= 1000){
                    dglMain.fps.framerate = (dglMain.fps.counter * 1000) / (now - dglMain.fps.basetime);
                    dglMain.fps.fpscount = 0;
                    dglMain.fps.basetime = new Date();
                }
    
                // デバッグ情報
                if(debugMode){
                       
                    // デバッグ情報の描画
                    frontCtx.beginPath();
                    frontCtx.font = "20px PixelMplus10";
                    frontCtx.fillStyle = 'rgba(255,255,255,1)';
    
                    var padMsg;
                    var padMsgSize;
                    var btnInfoX = 0;
                    var btnInfoY = 0;
                    
                    padMsg = "FPS      : " + (Math.round(dglMain.fps.framerate * 100) / 100);
                    btnInfoX = 0;
                    btnInfoY = 0;
                    textOut(frontCtx, padMsg, btnInfoX, btnInfoY);
        
                    padMsg = "is phone : " + isPhone();
                    btnInfoX = 0;
                    btnInfoY += 22;
                    textOut(frontCtx, padMsg, btnInfoX, btnInfoY);
    
                    padMsg = "mouse    : x=" + dglDevice.mouse.x + ", y=" + dglDevice.mouse.y;
                    btnInfoX = 0;
                    btnInfoY += 22;
                    textOut(frontCtx, padMsg, btnInfoX, btnInfoY);

                    var stateText = dglDevice.mouse.event ? dglDevice.mouse.event.stateName : "";
                    padMsg = "           state=" + stateText;
                    btnInfoX = 0;
                    btnInfoY += 22;
                    textOut(frontCtx, padMsg, btnInfoX, btnInfoY);

                    padMsg = "touch    : ";
                    btnInfoX = 0;
                    btnInfoY += 22;
                    textOut(frontCtx, padMsg, btnInfoX, btnInfoY);

                    var stateText = dglDevice.touch.event ? dglDevice.touch.event.stateName : "";
                    padMsg = "           state=" + stateText;
                    btnInfoX = 0;
                    btnInfoY += 22;
                    textOut(frontCtx, padMsg, btnInfoX, btnInfoY);
                }
    
            }finally{
                // ここでデバイスの情報はリセット
                if(dglDevice.reset){
                    dglDevice.reset();                
                }
                window.requestAnimationFrame (dglMain.mainFunction);
            }
        },
    }

    // フロントバッファとバックバッファの生成
    frontBuffer = document.createElement("canvas");
    backBuffer = document.createElement("canvas");
    frontBuffer.id = "frontbuffer";
    backBuffer.id = "backbuffer";

    // PNG用バックバッファ生成
    pngBackBuffer = createCanvas(displayModeList[displayModeName].width, displayModeList[displayModeName].height);

    // 生成したcanvasを追加する
    if(parentElement){
        LOG.debug("buffer parent is " + parentElement.tagName);
    }else{
        LOG.debug("buffer parent is Body");
        parentElement = document.getElementsByTagName("body").item(0);
    }
    parentElement.appendChild(frontBuffer);
    parentElement.appendChild(backBuffer);

    // 念のためチェック
    if (!frontBuffer.getContext){
        var msg = createErrorMessage('unsupport getContext');
        throw msg;
    }

    // contextの取得
    frontCtx = frontBuffer.getContext('2d');
    backCtx = backBuffer.getContext('2d');

    // バックバッファのサイズ指定
    backBuffer.width = displayModeList[displayModeName].width;
    backBuffer.height = displayModeList[displayModeName].height;
    

    // キャンバスをリサイズ
    dglResize();

    // ウィンドウのリサイズ
    window.addEventListener("resize", function(e){
		dglResize();
	});

    // 他のライブラリの初期化をおこなう
    dglDeviceInitalize();
    dglAudioInitalize(parentElement);

    // 処理を開始する
    window.requestAnimationFrame (dglMain.mainFunction);

}

/**
 * キャンバスをクリアする
 * @param {context} ctx 
 * @param {int} w 
 * @param {int} h 
 * @param {text} style 
 */
function clearCanvas(ctx, w, h, style){
    ctx.beginPath();
    ctx.fillStyle = style;
    ctx.fillRect(0, 0, w, h);
    ctx.fill();
}

/**
 * 文字の出力
 * @param {*} ctx 
 * @param {*} text 
 * @param {*} x 
 * @param {*} y 
 * @param {*} style 
 */
function textOut(ctx, text, x, y){
    ctx.beginPath();
    ctx.font = "20px PixelMplus10";
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillText(text, x,     y);
    ctx.fillText(text, x + 1, y);
    ctx.fillText(text, x + 2, y);

    ctx.fillText(text, x,     y + 1);
    ctx.fillText(text, x + 1, y + 1);
    ctx.fillText(text, x + 2, y + 1);

    ctx.fillText(text, x,     y + 2);
    ctx.fillText(text, x + 1, y + 2);
    ctx.fillText(text, x + 2, y + 2);

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillText(text, x + 1, y + 1);
}

/**
 * スムーズ系のフラグせっとぃ
 * @param {*} ctx 
 * @param {*} flag 
 */
function setSmooth(ctx, flag){
	ctx.imageSmoothingEnabled = flag;
	ctx.mozImageSmoothingEnabled = flag;
	ctx.webkitImageSmoothingEnabled = flag;
}

/**
 * キャンバスのリサイズ
 */
function dglResize(){
	var parentElm = frontBuffer.parentElement;
	if(dglMain.displayInfo.target == "device"){
        // 画面モードがデバイスの場合
		if(frontBuffer){
			frontBuffer.width = parentElm.clientWidth;
			frontBuffer.height = parentElm.clientHeight;
//			this._initalize = true;
		}

		if(backBuffer){
			backBuffer.width = document.body.clientWidth;
			backBuffer.height = document.body.clientHeight;
//			this._initalize = true;
		}
	}else{
		if(frontBuffer){
			frontBuffer.width = parentElm.clientWidth;
			frontBuffer.height = parentElm.clientHeight;
//			this._initalize = true;
		}
	}
}

/**
 * シーンオブジェクトを生成します。
 * 生成されたシーンは自動的に登録されます。
 * @param {string} sceneName シーン名
 * @returns 
 */
function createSceneObject(sceneName){
    if(!dglMain){
        var msg = createErrorMessage('Call dglInitalize to initialize.');
        throw msg;
    }

    var scebeObject = {
        dglObjectList:[],
        sceneMain:(sceneObject)=>{
            sceneObject.dglObjectList.forEach(dglObj =>{
                dglObj.main(sceneObject);
            });
        },
    };

    dglMain.sceneMap[sceneName] = scebeObject;
    return scebeObject;
}

/**
 * 指定したシーンにDGLオブジェクトを生成して登録します。
 * @param {string} sceneName 登録先のシーン名
 * @param {string} dglObjectName DGLオブジェクトの名称
 * @returns 
 */
function createDGLObject(sceneName, dglObjectName){
    if(!dglMain){
        var msg = createErrorMessage('Call dglInitalize to initialize.');
        throw msg;
    }

    if(!dglMain.sceneMap[sceneName]){
        var msg = createErrorMessage(sceneName + ' is not registered in the scene.');
        throw msg;
    }
    var dglObject = {
        main:(sceneObject)=>{
        }
    };
    dglMain.sceneMap[sceneName].dglObjectList.push(dglObject);
    return dglObject;
}
