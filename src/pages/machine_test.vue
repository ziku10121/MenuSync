<template>
     <q-page>
        <div class="column items-center py-30">
            <q-card class="my-card q-pa-md" flat bordered>    
                <div class="wrap">
                    <!-- Live Camera -->
                    <div v-if="isLive" class="q-mt-xl">
                        <div class="row justify-center">
                            <div class="video">
                                <img :src="imgSrc" width="1080" height="768"/>
                                <div v-if="streaming" class="caption live"><b>LIVE</b></div>
                            </div>
                            <div class="col-12 text-center">
                                {{imgName}}
                            </div>
                            <!-- <div class="col-9">
                                <p class="err" id="errorMessage">{{bgkey}}</p>
                            </div> -->
                        </div>
                        <div class="row items-center justify-center q-mt-lg">
                            <q-btn class="q-mx-md" v-if="!streaming" round @click="startLive();showBack=false" color="primary">
                                <q-icon name="reply" />
                                <q-tooltip v-model="showBack">返回</q-tooltip>
                            </q-btn>
                            <q-btn class="q-mx-md" round color="primary" @click="capture();" :disabled="!streaming">
                                <q-icon name="screenshot_monitor" />
                                <q-tooltip v-model="showCap">截圖</q-tooltip>
                            </q-btn>
                        </div>
                        <div class="row justify-end">
                            <div class="col-auto">
                                <q-btn color="primary" label="偵測" @click="postSetup('detect'); showLoading();"  :disabled="streaming"/>
                            </div>
                        </div>
                    </div>
                    <!-- Menu List -->
                    <div v-else>
                        <div class="q-pt-md" style="position:relative;">
                            <img id="img" style="margin:auto;border:3px solid #2d2d2d" :src="imgSrc" width="100%" height="auto"/>
                            <!-- SUCCESS -->
                            <div v-if="get_detect.status==='ok'">
                                <div class="row items-center q-mt-md q-px-md bg-primary text-white" style="border-radius:10px 10px 0 0;height: 50px;">
                                    <div class="col-auto text-h5">
                                        Detect food result
                                    </div>
                                    <div class="col-auto q-ml-md bg-teal" style="border-radius:5px; padding:5px;">
                                        {{foodType}}種菜名
                                    </div>
                                    <div class="col-auto q-ml-md bg-purple" style="border-radius:5px; padding:5px;">
                                        共計{{foodNum}}道菜
                                    </div>
                                </div>
                                <div style="border: 1px solid rgba(0, 0, 0, 0.12);">
                                    <q-scroll-area :visible="true" style="height: 340px; max-width: 100%;">
                                        <q-card class="row q-pa-sm items-center justify-center" flat>
                                            <!-- card靠左 -->
                                            <div class="row">
                                                <div class="col-2 text-grey-10" v-for="i in 26" :key="i">
                                                    <q-card style="margin:8px;" flat bordered>
                                                        <!-- <q-img src="https://cdn.quasar.dev/img/parallax2.jpg"/> -->
                                                        <q-card-section horizontal class="items-center">
                                                            <q-card-section class="col">
                                                                <div class="q-pb-md text-orange-9">麵類</div>
                                                                <div class="text-h6">客家湯圓</div>
                                                                <div class="text-body">
                                                                    NT$ 40
                                                                </div>
                                                                <a class="text-caption text-red">
                                                                    麵
                                                                </a>
                                                                <a class="text-caption text-red">
                                                                    加量
                                                                </a>
                                                            </q-card-section>
                                                            <q-card-section class="q-pa-none q-pr-md col-auto" style="font-size:20px">
                                                                X1
                                                            </q-card-section>
                                                        </q-card-section>
                                                    </q-card>
                                                </div>
                                                <!-- Mqtt API -->
                                                <!-- <div class="col-2" v-for="(order,index) in get_detect.result" :key="index">
                                                    <q-card style="margin:8px;" flat bordered>
                                                        <q-img src="https://cdn.quasar.dev/img/parallax2.jpg"/>
                                                        <q-card-section horizontal class="items-center">    
                                                            <q-card-section class="col">    
                                                                <div class="q-pb-md text-orange-9">{{order.category_name}}</div>
                                                                <div class="text-h6">{{order.goods_name}}</div>
                                                                <div class="text-body">
                                                                    NT$ {{order.result[i].sale_price}}
                                                                </div>
                                                                <a v-for="(taste,i) in taste_list" :key="order.goods_no+i" class="text-caption text-red">
                                                                    {{taste}}
                                                                </a>
                                                            </q-card-section>
                                                            <q-card-section class="q-pa-none q-pr-md col-auto" style="font-size:20px">
                                                                {{get_detect.result[i].qty}}
                                                            </q-card-section>
                                                        </q-card-section>
                                                    </q-card>
                                                </div> -->
                                            </div>
                                        </q-card>
                                    </q-scroll-area>
                                </div> 
                            </div>
                            <!-- ERROR -->
                            <div v-else>
                                <div class="row items-center q-mt-md q-px-md bg-negative text-white" style="border-radius:10px 10px 0 0;height: 50px;">
                                    <div class="col-auto text-h5">
                                        Error Message
                                    </div>
                                </div>
                                <div style="border: 1px solid rgba(0, 0, 0, 0.12);">
                                    <div class="q-py-lg q-px-sm">
                                        {{get_detect.error_msg}}
                                    </div>
                                </div> 
                            </div>
                            
                        </div>
                        
                        <div class="row q-py-md">
                            <div class="col q-pr-md">
                                <textarea class="full-width text-caption"  style="font-size:16px;height: 100%;" v-model="msg" rows="3" readonly></textarea>
                            </div>
                            <div class="col-auto q-mr-md" v-if="get_detect.status=='ok'">
                                <q-btn color="negative" style="height: 100%;" label="重測" @click="$router.push({path:'capture'});"/>
                            </div>
                            <div class="col-auto">
                                <q-btn color="primary" style="height: 100%;" label="完成" @click="postSetup('confirm')"/>
                            </div>
                        </div>
                    </div>
                </div>
                <errorMsg :err="msgObj.isError" :num="msgObj.num" :msg="msgObj.errormsg" @returnOk="get_error"></errorMsg>
                <successMsg :success="msgObj.isSuccess" :msg="msgObj.successmsg" @returnOk="get_success"></successMsg>
            </q-card>
        </div>
    </q-page>
</template>
<script>
import {Loading,QSpinner} from 'quasar';
import { clearTimeout } from 'timers';
import { apiUrl } from 'app/public/config/config';
import mqtt from 'mqtt';
import confetti from "canvas-confetti";
import errorMsg from '../components/errorMsg.vue';
import successMsg from '../components/successMsg.vue';
export default {
    name:"machineTest",
    components: { errorMsg, successMsg },
    data() {
        return {
            streaming:false,
            loadtimer:null,
            loadingdelay:15,
            //bg key code
            bgkey:'',
            timer:null,


            menu_data:null,
            get_detect:null,
            isLive:false,
            imgSrc:null,
            imgName:null,
            tempImg:null,
            foodType:0,
            foodNum:0,
            msg:'',
            msgObj:{
                isSuccess:false,
                isError:false,
                num:0,
                errormsg:'',
                successmsg:'',
            },
            setupUrl:'',
            showBack:false,
            showCap:false,
        }
    },
    created(){
        //mqtt
        this.subscribe_topic = "menu/#";
        this.$mqtt.subscribe(this.subscribe_topic);
        console.log("subscribe(menu/#)");

        //判斷是否儲存菜單設計資料&&已有detect
        let sessionData = sessionStorage.getItem("menuFormat");
        let sessionDetect = sessionStorage.getItem("detect");
        if (sessionData == undefined || sessionData == null || sessionData == "" ||
        sessionDetect == undefined || sessionDetect == null || sessionDetect == "") {
            //沒有session storage，返回capture page
            this.$router.push({ path: 'capture'});
        }
        this.menu_data = JSON.parse(sessionData);
        
        // init
        this.setupUrl = apiUrl;
        this.init();
    },
    mqtt: {
      "menu/#"(data, topic) {
          if (topic === "menu/from_server/start" && this.isLive) {
            this.get_detect = JSON.parse(data);
            if(this.streaming){
                this.imgSrc = this.get_detect.img_url;
                this.imgName = this.get_detect.img_name;
            }
            // console.log("Img Info:", this.get_detect);
          }

          if (topic === "menu/from_server/detect") {
            this.get_detect = JSON.parse(data);

            console.log('mqtt get_detect:',this.get_detect);
            this.isLive = false;
            // response
            this.imgSrc = this.get_detect.img_url;
            this
            this.msg = JSON.stringify(this.get_detect.msg);
            this.foodType = this.get_detect.result.length;
            // this.get_detect.result.forEach(order => {
            //     this.foodNum += order.qty;
            // });
            this.imgName = this.get_detect.img_name;
            this.hideLoading();
            this.conguration();
          }
      }
    },
    mounted() {
        let self = this;
        if(self.menu_data)self.startLive();
        
        //background key code 
        window.addEventListener('keydown', function(e){ 
            if(self.bgkey=='')self.openKey(5);
            if(e.keyCode>=65&&e.keyCode<=90){
                // console.log(e.key);
                self.bgkey+=e.key;
            }
            if(e.key=='Enter')
            {
                if(self.bgkey==='stoplive'&& self.streaming==true)
                    self.stopLive();
                if(self.bgkey==='startlive'&&self.streaming==false)
                    self.startLive();
                self.clearKey();
            }
        }, false);

        // hover放大功能
        // window.addEventListener('mouseover',function(e){
        //     if( e.target.id != 'img') return;
        //     e.target.style.position = 'absolute';
        //     e.target.style.zIndex = 2;
        //     e.target.style.left = 0;
        //     e.target.style.top = '15px';
        // })
        // window.addEventListener('mouseout',function(e){
        //     if( e.target.id != 'img') return;
        //     e.target.style.removeProperty("position");
        // })
    },
    methods: {
        init(){
            this.get_detect = null;
            this.isLive = true;
            this.imgSrc=null;
            this.imgName=null;
            this.tempImg=null;
            this.foodType = 0;
            this.foodNum = 0;
            this.msg = '';
        },

        startLive(){
            this.streaming = true;
            this.postSetup('start');
        },
        stopLive() {
            this.streaming = false;
            this.postSetup('stop');
        },
        detectLive() {
            this.streaming = false;
            this.postSetup('detect');
        },

        capture(){
            if (this.streaming) {
                this.stopLive();
                this.showCap=false;
            }
            this.tempPhoto();
        },
        tempPhoto(){
            //抓取圖片及隱藏live
            this.tempImg = this.get_detect;
            this.imgSrc = this.tempImg.img_url;
            this.imgName = this.tempImg.img_name;
        },
        postSetup(_cmd){
            let self = this;
            let msg = {command:'',img_name:''};
            msg.command = _cmd;
            if(_cmd=="detect"||_cmd=="confirm")msg.img_name = self.tempImg.img_name;

            fetch(self.setupUrl,{
                method:"POST",
                body:JSON.stringify(msg),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            }).then(res => res.json())
            .catch(err => {
                console.error('Error:', err);
                self.errorMethod(4);
            })
            .then(function (res) {
                if(res.status=="ok"){
                    if(res.command=="confirm")
                    {
                        //回首頁
                        self.$router.push({ name: 'main' });
                    }
                    console.log('api回報：',res);
                    self.hideLoading();
                }else{
                    //error modal
                    self.hideLoading();
                    self.errorMethod(5);
                }
            },window);
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
        hideLoading(){
            let self = this;
            Loading.hide();
            window.clearTimeout(self.loadtimer);
            self.loadtimer = null;
        },
        errorMethod(_errorNum){
            switch (_errorNum) {
                case 1:
                    this.errorText ='抓取時間逾期!!';
                    break;
                case 2:
                    this.errorText ='讀取資料錯誤！！';
                    break;
                default:
                    this.errorText ='操作錯誤！！';
                break;
            }
            this.isError=true;
        },

        get_error(e){
            this.msgObj.isError = e;
        },
        get_success(e){
            this.msgObj.isSuccess = e;
        },
        //--------------- background key code---------------
        openKey(_delay){
            let self =this;this
            this.timer = setTimeout(function(){
                self.clearKey();
            },_delay*1000);
        },
        clearKey(){
            this.bgkey='';
            if(this.timer!=null)window.clearTimeout(this.timer);
        },
        conguration(){
            let duration = 3 * 1000;
            let animationEnd = Date.now() + duration;
            let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            let interval = setInterval(function() {
                let timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }
                let particleCount = 50 * (timeLeft / duration);
                // since particles fall down, start a bit higher than random
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 300);
        }
    },
}
</script>
<style scoped>
    .py-30{
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .my-card{
      width: 1330px;
    }
    .wrap{
        width: 1200px;
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