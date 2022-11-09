<template>
     <q-page>
        <div class="wrap">
            <div class="q-mt-xl">
                <div class="row justify-center">
                    <div style="display:none">
                        <video id="videoInput" width="1080" height="768"></video>
                        <div class="caption">videoInput</div>
                    </div>
                    <div class="video">
                        <canvas id="canvasOutput" width="1080" height="768"></canvas>
                        <div v-if="streaming" class="caption live"><strong>LIVE</strong></div>
                    </div>
                    <img id="image" class="hide" :src="imgSrc"/>
                    <div class="col-9">
                        <p class="err" id="errorMessage">{{bgkey}}</p>
                    </div>
                </div>
                <div class="row items-center justify-center q-mt-lg">
                    <!-- <div class="col-auto q-mx-lg">
                        <q-btn id="startAndStop" @click="fnClick" color="primary" disabled>
                            {{btnText}}
                        </q-btn>
                    </div> -->
                    <div class="col-auto q-mx-lg">
                        <q-btn v-if="!streaming" round @click="startLive();" color="primary">
                            <q-icon name="reply" />
                        </q-btn>
                    </div>
                    <div class="col-auto q-mx-lg">
                        <q-btn round @click="capture(); showLoading();" color="primary" :disabled="!streaming">
                            <!-- <q-tooltip anchor="bottom middle" self="center middle">截圖上傳資料</q-tooltip> -->
                            <q-icon name="screenshot_monitor" />
                        </q-btn>
                    </div>
                </div>
                <div class="row justify-end">
                    <div class="col-auto q-mx-lg">
                        <q-btn @click="GoDetect" color="primary" label="確認" :disabled="streaming"/>
                    </div>
                </div>
            </div>
        </div>
        <q-dialog v-model="isError" persistent >
            <q-card style="width:300px">
                <q-card-section class="row items-center bg-red-8 text-grey-3">
                <q-icon name="warning" class="text-white q-mr-sm" style="font-size: 2rem;" />
                <div class="text-h6">錯誤</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-card-section class="body q-py-lg">
                    {{errorText}}
                </q-card-section>
                <q-card-actions align="right" class="bg-white">
                <q-btn label="OK" v-close-popup/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
import {Loading,QSpinner} from 'quasar';
import { clearTimeout } from 'timers';
export default {
    
    data() {
        return {
            startAndStop:'',
            canvasOutput:'',
            videoInput:'',
            streaming:false,
            utils:'',
            image:'',
            imgSrc:'',
            loadtimer:null,
            loadingdelay:15,
            isError:false,
            errorText:'',
            //bg key code
            bgkey:'',
            timer:null,
        }
    },
    mounted() {
        let self = this;
        // this.startAndStop = document.getElementById('startAndStop');
        this.image = document.getElementById('image');
        this.videoInput = document.getElementById('videoInput');
        this.canvasOutput = document.getElementById('canvasOutput');
        this.canvasContext = this.canvasOutput.getContext('2d');

        this.utils = new window.Utils('errorMessage');
        // self.startAndStop.removeAttribute('disabled');
        this.startLive();  

        //background key code 
        window.addEventListener('keydown', function(e){ 
            if(self.bgkey=='')self.openKey(5);
            if(e.keyCode>=65&&e.keyCode<=90){
                console.log(e.key);
                self.bgkey+=e.key;
            }
            if(e.key=='Enter')
            {
                console.log(self.bgkey==='stopVideo')
                if(self.bgkey==='stoplive'&& self.streaming==true)
                    self.onVideoStopped();
                if(self.bgkey==='startlive'&&self.streaming==false)
                    self.startLive();
                self.clearKey();
            }
        }, false);
    },
    methods: {
        init(){},

        startLive(){
            this.utils.startCamera('auto', this.onVideoStarted, 'videoInput');
        },

        onVideoStarted() {
            this.streaming = true;
            this.videoInput.width = this.videoInput.videoWidth;
            this.videoInput.height = this.videoInput.videoHeight;
            this.fnStart();

            this.canvasOutput.classList.remove('hide');
            this.image.classList.add('hide');
        },
        
        onVideoStopped() {
            this.utils.stopCamera();
            this.streaming = false;
            this.canvasContext.clearRect(0, 0, this.canvasOutput.width, this.canvasOutput.height);
        },
        fnStart(){
            let self = this;
            let video = document.getElementById('videoInput');
            let cv = window.cv;
            let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
            let camera = new cv.VideoCapture(video);

            const FPS = 30;
            function processVideo(){
                try {
                    if (!self.streaming) {
                        // clean and stop.
                        src.delete();
                        return;
                    }
                    let startTime = Date.now();
                    // start processing.
                    camera.read(src);
                    cv.imshow("canvasOutput", src);
                    
                    // schedule the next one.
                    let delay = 1000 / FPS - (Date.now() - startTime);
                    setTimeout(processVideo, delay);
                } catch (err) {
                    self.utils.printError(err);
                }
            }
            // schedule the first one.
            setTimeout(processVideo, 0);
        },
        capture(){
            let b64image = this.canvasOutput.toDataURL();
            this.postImg(b64image);

            sessionStorage.setItem('b64img', b64image);
            if (this.streaming) {
                this.onVideoStopped();
            }
            this.tempPhoto();
        },
        postImg(_b64img){
            let self = this;
            let myFile={map:''}; 
            myFile.map = _b64img.split(',')[1];

            fetch("http://localhost:1880/menu_capture",{
                method: "POST",
                body: JSON.stringify(myFile),
                Headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }).then(res => res.json())
            .catch(err => {
                console.error('Error:', err);
                Loading.hide();
                window.clearTimeout(self.loadtimer);
                self.errorMethod(4);
            })
            .then(function (res) {
                if(res.status=="ok"){
                    if(self.loadtimer){
                        self.imgSrc='http://localhost:8080/MenuTest3.jpg';
                        Loading.hide();
                        window.clearTimeout(self.loadtimer);
                    }
                }else{
                    //error modal
                    Loading.hide();
                    window.clearTimeout(self.loadtimer);
                    self.errorMethod(2);
                }
                console.log(res,self.loadtimer);
            },window);
        },
        tempPhoto(){
            //抓取圖片及隱藏live
            let bInfo = sessionStorage.getItem('b64img');
            this.canvasOutput.classList.add('hide');
            this.image.classList.remove('hide');
            this.imgSrc=bInfo;
        },
        showLoading(){
            this.show({
                spinner: QSpinner,
                spinnerSize: 140,
                message: '照片上傳中，請稍等...',
            })
        },
        show (options) {
            let self = this;
            Loading.show(options)
            self.loadtimer = setTimeout(() => {
                //modal time over
                self.errorMethod(1);
                Loading.hide();
                self.loadtimer=null;
                self.startLive();
            },self.loadingdelay*1000)
        },
        errorMethod(_errorNum, _msg){
            switch (_errorNum) {
                case 1:
                    this.errorText ='timeout(1)';
                    break;
                case 2:
                    this.errorText ='data error(2)';
                    break;
                case 3:
                    this.errorText = "can't find camera(3)";
                    break;
                case 4:
                    this.errorText = "web api error(4)";
                    break;
                case 99:
                    this.errorText = _msg+'(99)';
                    break;
                default:
                    this.errorText ='operation error(0)';
                break;
            }
            this.isError=true;
        },
        GoDetect(){
            // this.$router.push({ name: 'detect', params: { userId: 1 }});
            this.$router.push({ path: 'detect', query: { imgSrc: this.imgSrc }});
        },
        //--------------- background key code---------------
        openKey(_delay){
            let self =this;
            this.timer = setTimeout(function(){
                self.clearKey();
            },_delay*1000);
        },
        clearKey(){
            this.bgkey='';
            clearTimeout(this.timer);
        }
    },
}
</script>
<style scoped>
    
    .wrap{
        width: 1400px;
        margin:auto;
    }
    canvas {
        border: 1px solid black;
    }
    .video{
        position: relative;
    }
    .live{
        background-color: #f00;
        color:#fff;
        font-size: 15px;
        width: 50px;
        text-align: center;
        border-radius: 50px;
        position:absolute;
        top:25px;
        left:25px;
    }
    .row button{
        font-size: 18px;
    }
    .row .q-btn--round{
        font-size: 20px;
    }
    .hide{
        display: none;
    }
</style>