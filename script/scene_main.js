function scene_main_register(){
    let scene = createSceneObject("main");
    scene.onInitalize = (sceneObject)=>{
        sceneObject.score = 0;
    }

    let mapObj = createDGLObject("main", "map");
    let baseX = Math.floor(Math.random() * (backBuffer.width / 16)) * 16;
    let baseY = (Math.floor(Math.random() * (backBuffer.height / 16 - 1)) + 1) * 16;
    mapObj.initalize = (dglObj, sceneObject)=>{
        dglObj.partical = [];
        dglObj.target = [
            {
                x:baseX,
                y:baseY,
                count:0,
                puttblno:3,
            },
        ];

    }
    mapObj.main = (dglObj, sceneObject)=>{
        pngBackBuffer.fillRect(pngBackBuffer, 0, 0, pngBackBuffer.width, pngBackBuffer.height, 1);

        // 背景
        if("images01" in dglMain.imageMap){
            for(let y = 0; y < pngBackBuffer.height; y+=8){
                for(let x = 0; x <= pngBackBuffer.width; x+=8){
                    putSpritePNG(1, 0, x, y);
                }
            }
        }

        // ピコっとやる
        if(dglDevice.pointer.event){
            for(let key in dglDevice.pointer.event){
                if("pointerdown" == dglDevice.pointer.event[key].stateName){
                    dglAudio.playSound("piko01");
                    dglObj.partical[dglObj.partical.length] = {
                        x:dglDevice.pointer.event[key].x,
                        y:dglDevice.pointer.event[key].y,
                        count:0,
                    };

                    for(let k = 0; k < dglObj.target.length; k++){
                        if(dglObj.target[k].puttblno == 3){
                            let sx = dglObj.target[k].x;
                            let ex = sx + 16;
                            let sy = dglObj.target[k].y;
                            let ey = sy + 16;
                            let px = dglDevice.pointer.event[key].x;
                            let py = dglDevice.pointer.event[key].y;
                            if(sx <= px && px <= ex && sy <= py && py <= ey){
                                dglObj.target[k].puttblno = 4;
                                sceneObject.score++;
                            }
                        }
                    }
                }
            }
        }

        // 当たったアクション
        for(let i = dglObj.partical.length -1 ; i >= 0; i-- ){
            let element = dglObj.partical[i];
            let ptn = Math.floor(element.count / 3);
            try{
                putSpritePNG(2, ptn, element.x - 8, element.y - 8);
                element.count++;
                if(element.count >= 3 * 3){
                    element.count = 0;
                    dglObj.partical.splice(i);
                }
            }catch(e){
                LOG.error("ptnno " + ptn);
                LOG.error(e);
            }
        }

        for(let j = 0; j < dglObj.target.length; j++){
            let ptn = Math.floor(dglObj.target[j].count / 8);
            putSpritePNG(dglObj.target[j].puttblno, ptn, dglObj.target[j].x, dglObj.target[j].y);

            dglObj.target[j].count++;
            if(dglObj.target[j].count > 8 * 8){
                let baseX = Math.floor(Math.random() * (backBuffer.width / 16)) * 16;
                let baseY = (Math.floor(Math.random() * (backBuffer.height / 16 - 1)) + 1) * 16;
                dglObj.target[j].x = baseX;
                dglObj.target[j].y = baseY;
                dglObj.target[j].count = 0;
                dglObj.target[j].puttblno = 3;
            }
        }

        // タイマー表示

        // スコア表示
        putSpritePNG(90, 0, 0, 0);

        let scoreText = ("0000" + sceneObject.score).slice(-4);
        let scoreLength = scoreText.length;
        for(let scIdx = 0; scIdx < scoreLength; scIdx++){
            let scoreUnit = scoreText.substring(scIdx,scIdx+1);
            putSpritePNG(91, scoreUnit, 32 + scIdx * 6, 0);
        }
    }
}