'use strict';

/**
 * ログオブジェクト
 */
const LOG = {
    /**
     * デバッグモード 
     */
    isDebug:false,

    /**
     * 一般ログを出力
     */
    log : (logText)=>{
        console.log( getDateTimeString(new Date())  + " : [INFO ] : " + logText);
    },

    /**
     * デバッグログを出力
     */
    debug : (logText)=>{
        if(!LOG.isDebug){
            return;
        }
        console.log( getDateTimeString(new Date())   + " : [DEBUG] : " + logText);
    },

    /**
     * 警告ログを出力
     */
    warn : (logText)=>{
        console.warn( getDateTimeString(new Date())  + " : [WARN ] : " + logText);
    },

    /**
     * エラーログを出力
     */
    error : (logText)=>{
        console.error( getDateTimeString(new Date()) + " : [ERROR] :" + logText );
    }
}

/**
 * エラーメッセージを生成
 * @param { string } msg 
 * @returns 
 */
 function createErrorMessage(msg){
    return "[ERROR] : DGLError - " + msg;
}

/**
 * スマホかどうかの簡易チェック
 * @returns true:スマホ / false:スマホ以外
 */
function isPhone(){
	// 判定方法はここを参照した
	// https://www.site-convert.com/archives/2188

	if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
		// スマホ
		return true;
	} else {
		// PC
		return false;
	}
}

/**
 * 日時を文字列(yyyy/mm/dd hh-mi-ss)に変換する
 * @param {Date} datetime 
 * @returns 
 */
function getDateTimeString(datetime){
    var yyyy = datetime.getFullYear();
    var mm = ('0' + (datetime.getMonth() + 1)).slice(-2);
    var dd = ('0' + datetime.getDate()).slice(-2);
    var hh = ('0' + datetime.getHours()).slice(-2);
    var mi = ('0' + datetime.getMinutes()).slice(-2);
    var ss = ('0' + datetime.getSeconds()).slice(-2);
    
    return yyyy+ "/" + mm + "/" + dd + " " + hh + ":" + mi + ":" + ss;
}
