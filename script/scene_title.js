function scene_title_register(){
    // シーンの登録
    createSceneObject("title");
    createDGLObject("title", "logo").main = (dglObj, sceneObject)=>{

        let titleX = (pngBackBuffer.width - 184) / 2;
        let titleY = (pngBackBuffer.height - 40) / 2;

        putSpritePNG(0, 0, titleX, titleY);

        if(dglDevice.pointer.event){
            for(let key in dglDevice.pointer.event){
                if("pointerdown" == dglDevice.pointer.event[key].stateName){
                    sceneChange("main");
                    break;
                }
            }
        }
    }
}