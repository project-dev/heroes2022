'use strict';

/**
 * オーディオ管理オブジェクト
 */
let dglAudio ;

/**
 * オーディオライブラリの初期化
 */
function dglAudioInitalize(){
    dglAudio = {
        /**
         * 初期化を行うトリガーとなるイベントの名称
         */
        audioInitEventName:typeof frontBuffer.ontouchend !== 'undefined' ? 'touchend' : 'mousedown',

        /**
         * AudioContext
         */
        context:undefined,

        /**
         * 指定したURLから読み込んだオーディオデータ
         */
        audioResponce:{},

        /**
         * デコードされたオーディオバッファ
         */
        audioBufferes:{},

        /**
         * 状態
         * true:再生中
         * false:停止中                                            
         */
        state:{},

        /**
         * playBGM()で生成された現在再生中のsourece
         */
        curBGMSource:null,

        /**
         * 初期化済みかどうか
         */
        initalized:false,

        /**
         * 初期化イベント
         */
        onInitalize:()=>{
            LOG.debug("Web Audio Initalize strat");
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            dglAudio.context = new window.AudioContext();
            dglAudio.playSound("silent", false);
            LOG.debug("Web Audio Initalize end");
            frontBuffer.removeEventListener(dglAudio.audioInitEventName, dglAudio.onInitalize);
        },

        /**
         * 初期化する
         */
        initalize:()=>{
            if(dglAudio.initalized){
                LOG.log("Audio Initalized");
                return;
            }
            dglAudio.initalized = true;
        },

        /**
         * 音声ファイルを読み込み、フレームワークに登録する
         * @param name {string} 登録名称
         * @param url {string} 読み込み対象のファイルのURL
         */
        loadSound:async (name, url)=>{
            var request = new XMLHttpRequest();
            LOG.debug("loadSound : " + name);
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
        
            // Decode asynchronously
            request.onload = ()=>{
                if(request.response instanceof ArrayBuffer){
                    dglAudio.audioResponce[name] = request.response;
                }else{
                    LOG.warn(url + " is not ArrayBuffer.");
                }
            }
            request.send();
        },

        /**
         * 音声を再生する
         * @param name {string} 登録名称
         * @param isLoop {boolean} ループ再生するか指定する
         */
        playSound:(name, isLoop) =>{
            if(!dglAudio.context){
                LOG.warn("playSound : audio context is undefined");
                return;
            }
            if(!dglAudio.audioBufferes[name]){
                if(!dglAudio.audioResponce[name]){
                    LOG.warn("playSound : unknow " + name);
                    return;
                }

                // 読み込んだバッファをオーディオバッファにデコードする
                dglAudio.context.decodeAudioData(dglAudio.audioResponce[name]).then(function(buffer) {
                    dglAudio.audioBufferes[name] = buffer;
                    dglAudio.state[name]=false;
                    LOG.debug("playSound : load success " + name);
                }).catch(function(){
                    LOG.error("playSound : load error " + name);
                });
                // 読み込んだバッファの解放
                dglAudio.audioResponce[name] = undefined;
            }

            LOG.debug("play " + name);
            var source = dglAudio.context.createBufferSource();
            source.buffer = dglAudio.audioBufferes[name];
            source.connect(dglAudio.context.destination);
            source.loop = isLoop;
            source.start(0);
            dglAudio.state[name] = true;
            source.addEventListener("ended", function(){
                dglAudio.state[name] = false;
                LOG.debug("playSound : " + name + "end");
            });
        },

        /**
         * BGMを再生する。
         * @param name {string} 登録名称
         */
        playBGM:(name)=>{
            if(!dglAudio.context){
                LOG.debug("playBGM : audio context is undefined");
                return;
            }
            if(!dglAudio.audioBufferes[name]){
                if(!dglAudio.audioResponce[name]){
                    LOG.error("playBGM : unknow " + name);
                    return;
                }
                dglAudio.context.decodeAudioData(dglAudio.audioResponce[name]).then(function(buffer) {
                    dglAudio.audioBufferes[name] = buffer;
                    dglAudio.state[name]=false;
                    LOG.debug("playBGM : load success " + name);
                }).catch(function(){
                    LOG.error("playBGM : load error " + name);
                });
            }
            if(dglAudio.curBGMSource){
                dglAudio.curBGMSource.stop();
            }
            dglAudio.curBGMSource = dglAudio.context.createBufferSource();
            dglAudio.curBGMSource.buffer = dglAudio.audioBufferes[name];
            dglAudio.curBGMSource.connect(dglAudio.context.destination);
            dglAudio.curBGMSource.loop = true;
            dglAudio.curBGMSource.start(0);
            dglAudio.state[name] = true;
            dglAudio.curBGMSource.addEventListener("ended", function(){
                dglAudio.state[name] = false;
                LOG.debug("playBGM : " + name + " end");
            });
        },

        /**
         * BGMを停止する
         */
        stopBGM:()=>{
            if(!dglAudio.context){
                LOG.debug("playBGM : audio context is undefined");
                return;
            }
            if(dglAudio.curBGMSource){
                dglAudio.curBGMSource.stop();
            }
        }
                
    };

    // 初期化ようにタッチまたはマウスのボタン押下イベントに登録
    frontBuffer.addEventListener(dglAudio.audioInitEventName, dglAudio.onInitalize);
}
