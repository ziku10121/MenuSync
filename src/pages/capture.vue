<template>
    <q-page>
        <div class="column items-center py-30">
            <q-card class="my-card q-pa-md" flat bordered> 
                <div class="wrap">
                    <div class="q-mt-xl">
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
                            <div class="col-auto">
                                <q-btn class="q-mx-md" v-if="!streaming" round @click="startLive();showBack=false" color="primary">
                                    <q-icon name="reply" />
                                    <q-tooltip v-model="showBack">返回</q-tooltip>
                                </q-btn>
                                <q-btn class="q-mx-md" round color="primary" @click="capture();" :disabled="!streaming">
                                    <q-icon name="screenshot_monitor" />
                                    <q-tooltip v-model="showCap">截圖</q-tooltip>
                                </q-btn>
                            </div>
                        </div>
                        <div class="row justify-end">
                            <div class="col-auto">
                                <q-btn color="primary" label="確認" @click="postSetup('confirm')"  :disabled="streaming"/>
                            </div>
                        </div>
                    </div>
                </div>
                <q-dialog v-model="isUpload" persistent>
                    <q-card style="width:450px">
                        <q-card-section class="row between bg-primary text-grey-3">
                            <div class="col text-h6">Menu File</div>
                                <q-icon name="help_outline" style="font-size: 2rem;cursor: pointer;" >
                                <q-tooltip anchor="top middle" self="bottom middle" content-style="font-size: 16px">
                                    Please put the menu JSON data.<br/>
                                    The cancel button is to make the menu page, and the OK button is to get the menu JSON data.
                                </q-tooltip>
                            </q-icon>
                            <q-space />
                        </q-card-section>
                        <q-card-section class="body q-py-xl">
                            <div class="column items-center">
                                <div class="col">
                                    <input type="file" id="upfile" accept=".json" style="display:none;" @change="upLoadFile"/>
                                    <button id="button" class="upload_btn" onclick="document.getElementById('upfile').click()">
                                        <div class="column items-center">
                                            <q-icon v-if="!json_file" class="upload_icon" name="o_file_upload"/>
                                            <label v-if="!json_file" style="font-size:14px;font-weight:700;">Upload</label>
                                            <q-icon v-else class="upload_icon" name="o_insert_drive_file" style="color:black;position:relative;">
                                                <span>JSON</span>
                                                <q-icon name="cancel" @click="rmFile($event)"/>
                                            </q-icon>
                                        </div>
                                    </button>
                                </div>
                                <div v-if="json_file" class="col">
                                    {{json_file.name}}
                                </div>
                            </div>
                        </q-card-section>
                        <q-card-actions align="right" class="bg-white q-pb-md q-pr-md">
                            <q-btn label="cancel" @click="$router.push({ path: 'makeMenu' });" v-close-popup/>
                            <q-btn label="ok" @click="saveStorage"/>
                        </q-card-actions>
                    </q-card>
                </q-dialog>
                <errorMsg :err="msgObj.isError" :num="msgObj.num" :msg="msgObj.errormsg" @returnOk="get_error"></errorMsg>
                <successMsg :success="msgObj.isSuccess" :msg="msgObj.successmsg" @returnOk="get_success"></successMsg> 
            </q-card>
        </div>
    </q-page>
</template>
<script>
import {Loading,QSpinner,SessionStorage} from 'quasar';
import { clearTimeout } from 'timers';
import { apiUrl } from '../../public/config/config';
import mqtt from 'mqtt';
import errorMsg from '../components/errorMsg.vue';
import successMsg from '../components/successMsg.vue';
export default {
    name: "Capture",
    components: { errorMsg, successMsg },
    data() {
        return {
            streaming:false,
            loadtimer:null,
            loadingdelay:15,
            //bg key code
            bgkey:'',
            timer:null,
            //upload file
            isUpload:false,
            json_file:null,

            menu_data:null,
            get_img:null,
            imgSrc:null,
            imgName:null,
            tempImg:null,
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
        //清除偵測判斷storage
        sessionStorage.removeItem('detect');
        //判斷是否儲存菜單設計資料
        let sessionData = sessionStorage.getItem("menuFormat");
        if (sessionData == undefined || sessionData == null || sessionData == "") {
            this.isUpload = true;
        }
        // init
        this.setupUrl = apiUrl;
        this.menu_data = JSON.parse(sessionData);

        console.log('api:',this.setupUrl);
        console.log('capture menu data:', this.menu_data);
    },
    mqtt: {
      "menu/#"(data, topic) {
          if (topic === "menu/from_server/start") {
            this.get_img = JSON.parse(data);
            if(this.streaming){
                this.imgSrc = this.get_img.img_url;
                this.imgName = this.get_img.img_name;
            }
            // console.log("Img Info:", this.get_img);
          }
      }
    },
    mounted(){
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
    },
    methods: {
        init(){},

        //upload file
        confirmFile(_file) {
            if(_file==null)return false;
            
            let fileTypes = ["json"];
            let name = _file.name;
            let extension = name.split(".").pop().toLowerCase();
            if (fileTypes.indexOf(extension) === -1)return false;

            return true;
        },
        upLoadFile(){
            let upfile = document.getElementById("upfile");
            this.json_file = upfile.files[0];
        },
        rmFile(event){
            //阻止冒泡事件
            event.stopPropagation();
            document.getElementById("upfile").value = "";
            this.json_file=null;
            this.menu_data=null;
        },
        saveStorage(){
            let self = this;
            if (!self.confirmFile(self.json_file)){
                self.json_file=null;
                self.errorMethod(8);
                return;
            };
            let reader = new FileReader();
            reader.readAsText(self.json_file,'utf-8');
            reader.onload = function(){
                let data = JSON.parse(reader.result);
                
                //unsave(use qty judge)
                if (typeof data.qty === "undefined") {
                    self.json_file=null;
                    self.errorMethod(5);
                    return;
                }
                //save
                self.isUpload=false;
                self.successMethod('Upload');
                self.menu_data = JSON.stringify(data);
                sessionStorage.setItem('menuFormat',self.menu_data);
                self.startLive();
                console.log('capture menu data:', self.menu_data);
            };
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
            this.tempImg = this.get_img;
            this.imgSrc = this.tempImg.img_url;
            this.imgName = this.tempImg.img_name;
        },
        postSetup(_cmd){
            let self = this;
            let msg = {command:'',img_name:''};
            msg.command = _cmd;
            if(_cmd=="confirm")msg.img_name=self.tempImg.img_name;
            fetch(self.setupUrl,{
                method:"POST",
                body:JSON.stringify(msg),
                headers:{
                    'Content-Type':'application/json',
                },
            }).then(res => res.json())
            .catch(err => {
                console.error('Error:', err);
                self.errorMethod(4);
            })
            .then(function(res){
                if(res.status=="ok"){
                    if(res.command=="confirm")
                    {
                        let imgInfo={
                            url:'',
                            name:'',
                        }
                        imgInfo.url = res.img_url;
                        imgInfo.name = res.img_name;
                        self.hideLoading();
                        self.goDetect(imgInfo);
                    }
                }else{
                    //error modal
                    self.hideLoading();
                    self.errorMethod(5);
                }
            })
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
        errorMethod(_errorNum, _msg){
            this.msgObj.isError = true;
            this.msgObj.num = _errorNum;
            this.msgObj.errormsg = _msg;
        },
        successMethod(_msg){
            this.msgObj.isSuccess = true;
            this.msgObj.successmsg=_msg;
        },

        get_error(e){
            this.msgObj.isError = e;
        },
        get_success(e){
            this.msgObj.isSuccess = e;
        },

        goDetect(_info){
            // this.$router.push({ name: 'detect', params: { userId: 1 }});
            this.$router.push({ path: 'detect', query: _info});
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
            if(this.timer!=null)window.clearTimeout(this.timer);
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
    .upload_file{
        position: relative;
    }
    .upload_icon{
        font-size:100px;
        display: block;
    }
    .upload_icon span{
        width:50px;
        height:18px;
        font-size:14px;
        color:#fff;
        background-color: black;
        border-radius: 5px;
        border:3px solid black;
        position:absolute;
        top:50%;
        right:0;
    }
    .upload_icon .q-icon{
        font-size: 30px;
        color:red;
        position: absolute;
        right:-20px;
        top:-20px;
        z-index:3;
    }
    .upload_btn{
        color:#888888;
        width:150px;
        height:150px;
        cursor: pointer;
        border: none;
        background-image: repeating-linear-gradient(0deg, #888888, #888888 10px, transparent 10px, transparent 20px, #888888 20px), repeating-linear-gradient(90deg, #888888, #888888 10px, transparent 10px, transparent 20px, #888888 20px), repeating-linear-gradient(180deg, #888888, #888888 10px, transparent 10px, transparent 20px, #888888 20px), repeating-linear-gradient(270deg, #888888, #888888 10px, transparent 10px, transparent 20px, #888888 20px);
        background-size: 3px 100%, 100% 3px, 3px 100% , 100% 3px;
        background-position: 0 0, 0 0, 100% 0, 0 100%;
        background-repeat: no-repeat;
        margin-bottom: 10px;
    }
    .upload_btn:hover{
        color:#616161;
        background-image: repeating-linear-gradient(0deg, #616161, #616161 10px, transparent 10px, transparent 20px, #616161 20px), 
                          repeating-linear-gradient(90deg, #616161, #616161 10px, transparent 10px, transparent 20px, #616161 20px),
                          repeating-linear-gradient(180deg, #616161, #616161 10px, transparent 10px, transparent 20px, #616161 20px),
                          repeating-linear-gradient(270deg, #616161, #616161 10px, transparent 10px, transparent 20px, #616161 20px);
        background-size: 3px 100%, 100% 3px, 3px 100% , 100% 3px;
        background-position: 0 0, 0 0, 100% 0, 0 100%;
    }
</style>