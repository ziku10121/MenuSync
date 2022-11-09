<template>
  <q-page>
    <div class="column items-center py-30">
      <q-card class="my-card q-pa-md" flat bordered>
        <div class="wrap">
          <div class="column items-center">
            <div class="col">
              <div>
                <div class="row q-pt-sm">
                  <div class="col-6">
                    <div class="row q-px-md q-mt-md items-center">
                      <div class="col-auto q-pr-md">
                        <div class=" title">格數設定<small>(系統帶入)</small></div>
                      </div>
                      <div class="col-auto">
                        <q-btn flat round @click="isHelp=true">
                          <q-tooltip anchor="top right" self="top middle">
                            幫助!
                          </q-tooltip>
                          <q-icon name="help_outline" class="text-dark" style="font-size: 2rem;" />
                        </q-btn>   
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row q-mb-md items-center">
                  <div class="col-2 q-px-md">
                  <q-input outlined v-model="typeNum" type="number" label="種類選項" disable readonly/>
                  </div>
                  <div class="col-2 q-pr-md">
                    <q-input outlined v-model="leftNum" type="number" label="左圖總筆數" disable readonly/>
                  </div>
                  <div class="col-2 q-pr-md">
                    <q-input outlined v-model="rightNum" type="number" label="右圖總筆數" disable readonly/>
                  </div>
                  <div class="col">
                    <div class="row q-pa-md items-center">
                      <div class="col-auto">
                        <q-btn class="q-mr-md" size="18px" color="blue-8" @click="reset" :disabled="!isResetShow">
                          <div>重設標示</div>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div class="row items-end">
                  <div class="col-auto">
                    <div class="annotator">
                      <v-annotator :drawing="drawing" :inertia="inertia" :minSize="minSize" :grid="grid" @select="selectRect" >
                        <img id="image" draggable="false" :src="imgSrc"/>
                        <!-- 為了讓rect可以有碰圖失焦效果 -->
                        <!-- <rect class="rect stroke" slot="annotation" x="467" y="175" width="237" height="887" /> -->
                        <!-- <rect class="rect stroke" slot="annotation" x="1211" y="177" width="237" height="887" /> -->
                        <!-- <rect class="stroke" slot="drawing" fill="transparent" stroke-dasharray="all"/> -->
                        <rect slot="annotation" v-for="(offset,index) in offsetList" :key="index" :x="offset.x" :y="offset.y" 
                        class="rect stroke" width="175" height="100" />
                      </v-annotator>
                    
                      <div class="detect1">
                        <div class="item" v-for="i in leftNum*typeNum" :key="i"></div>
                      </div>
                      <div class="detect2">
                        <div class="item" v-for="i in leftNum*typeNum" :key="i"></div>
                      </div>
                    </div>
                  </div>
                  <div class="col q-pl-md pb-10">
                    <q-btn v-if="isDetect" color="blue-8" size="18px" style="width:105px;height:65px;" @click="doPreview" :disabled="!isDetectShow">偵測</q-btn>
                    <q-btn v-if="isSendData" color="blue-8" size="18px" style="width:105px;height:65px;" @click="doInfo" :disabled="!isSendDataShow">資料傳送{{time}}</q-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <q-dialog v-model="isHelp">
            <q-card style="width: 700px; max-width: 80vw;" class="bg-dark text-white">
              <q-card-section class="row items-center">
                <q-icon name="help" class="text-white q-mr-sm" style="font-size: 2rem;" />
                <div class="text-h6">操作說明</div>
              </q-card-section>
              <q-card-section class="body q-pt-md bg-grey-1 text-dark">
                <p class="text-body"><strong>Step1.</strong>&nbsp;&nbsp;讀取JSON檔案。</p>
                <p class="text-body"><strong>Step2.</strong>&nbsp;&nbsp;在圖片中左鍵產生標示並選取需偵測範圍。</p>
                <p class="text-body"><strong>Step3.</strong>&nbsp;&nbsp;確認圖片中已選取2個標示後，進行偵測。</p>
                <p class="text-body"><strong>Step4.</strong>&nbsp;&nbsp;確認偵測內容，並進行資料傳送。</p>
              </q-card-section>

              <q-card-actions align="right" class="bg-grey-1 text-dark">
                <q-btn flat label="OK" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <errorMsg :err="msgObj.isError" :num="msgObj.num" :msg="msgObj.errormsg" @returnOk="get_error"></errorMsg>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { apiUrl } from '../../public/config/config';
import VueAnnotator from "vue-annotator";
import detectFormat from "../../public/config/template";
import errorMsg from '../components/errorMsg.vue';

export default {
  components: {
    "v-annotator": VueAnnotator,
    errorMsg,
  },
  data(){
    return{
      menuJson:{},
      ori_margin:{},
      ori_tdSize:{},
      typeNum:'',
      leftNum:'',
      rightNum:'',
      file:null,
      selectObj:null,
      imgSrc:'',
      time:'',
      delaytime:3,
      
      //Annotator Setting
      drawing: false,
      minSize: [20, 20],
      grid: [0, 0],
      inertia: true,
      offsetList:[],
      //rect
      left_boxWidth:0,
      left_boxHeight:0,
      right_boxWidth:0,
      right_boxHeight:0,
  
      //button
      isResetShow:false,
      isDetect:true,
      isDetectShow:false,
      isSendData:false,
      isSendDataShow:false,
      isHelp:true,
      msgObj:{
        isError:false,
        num:0,
        errormsg:'',
      },
      setupUrl:'',
    }
  },
  mounted(){
    document.addEventListener('keydown', this.inputKeyDown ,false) //偵測按下按鍵的行為
    document.addEventListener('mousedown', this.addRect ,false)    //偵測滑鼠往下壓的行為
    document.addEventListener('mouseup', this.confirmRectNum ,false) //偵測滑鼠往上放的行為
  },
  created() {
    // init
    this.setupUrl = apiUrl;
    console.log('api:',this.setupUrl);
    //取得辨識圖片
    this.getParam();
    //取得格數設定
    this.getMenuSetting();
    
    this.reset();
  },
  methods:{
    getParam(){
      let url = window.location.search.substring(1); 
      if(url=='')this.$router.go(-1);
      let params = new URLSearchParams(url);
      this.imgSrc = params.get("url");
    },
    getMenuSetting(){
      //判斷是否儲存菜單設計資料
      let sessionData = sessionStorage.getItem("menuFormat");
      if (sessionData == undefined || sessionData == null || sessionData == "") {
        //沒有session storage，返回capture page
        this.$router.push({ path: 'capture'});
      }
      this.menuJson = JSON.parse(sessionData);

      //進行讀取動作
      this.typeNum = parseInt(this.menuJson.qty) + this.menuJson.taste.length;
      this.leftNum = this.menuJson.menu1.length;
      this.rightNum = this.menuJson.menu2.length;
      this.ori_margin = this.menuJson.margin;
      this.ori_tdSize = this.menuJson.tdSize;
      this.menuJsonProcess();
    },
    addRect (event) {
      if(event.which!='1'|| event.target.nodeName !='IMG'|| !this.isDetect) return;

      if(this.typeNum==''||this.leftNum==''||this.rightNum=='')this.errorMethod(6);
      let offset ={};
      offset.x=event.offsetX;
      offset.y=event.offsetY;
      this.offsetList.push(offset);
    },
    selectRect(event){
      this.selectObj = event.node;
      // console.log('select',this.selectObj);
    },
    confirmRectNum(){
      let rect = document.querySelector(".foreground");
      let rectNum =0;
      //avoid rect is null 
      if(rect == null) return;

      rect.childNodes.forEach(item=>{
        if(item.nodeName=='rect')rectNum++;
      })
      if(rectNum!=0){this.isResetShow=true; }
      rectNum==2 ? this.isDetectShow=true : this.isDetectShow=false;
      if(rectNum>2){
        this.removeRect('last');
        this.errorMethod(7);
      }
    },
    reset(){
      // this.drawing=true;
      this.removeRect('all');
      this.confirmRectNum();
      const root = document.documentElement;

      root.style.setProperty('--left_xmargin','0px');
      root.style.setProperty('--left_ymargin','0px');
      root.style.setProperty('--right_xmargin','0px');
      root.style.setProperty('--right_ymargin','0px');
      root.style.setProperty('--left_BubbleWidth','20px');
      root.style.setProperty('--left_BubbleHeight','20px');
      root.style.setProperty('--right_BubbleWidth','20px');
      root.style.setProperty('--right_BubbleHeight','20px');
      root.style.setProperty('--left_x','0px');
      root.style.setProperty('--left_y','0px');
      root.style.setProperty('--right_x','0px');
      root.style.setProperty('--right_y','0px');
      root.style.setProperty('--left_width','0px');
      root.style.setProperty('--left_height','0px');
      root.style.setProperty('--right_width','0px');
      root.style.setProperty('--right_height','0px');

      this.isDetect = true;
      this.isSendData = false;
    },
    inputKeyDown(event){
      //Delete Key
      if(event.keyCode==46){
        let g = null;
        if(this.selectObj ==null || this.selectObj.parentNode == null) return;
        
        this.selectObj.parentNode.childNodes.forEach(item=>{
          if(item.nodeName==="g") g=item;
        });
        if(g == null) return;
        
        g.remove();
        this.selectObj.remove();
      }
    },
    removeRect(_type){
      //remove type: first, last, all
      let rect = document.querySelector(".foreground");
      //avoid rect is null 
      if(rect == null) return;

      if(rect.childNodes<1)return;
      if(_type=='first'){
        rect.removeChild(rect.firstChild);
      }
      if(_type=='last'){
        rect.removeChild(rect.lastChild);
      }
      if(_type=='all'){
        while (rect.firstChild) {
          rect.firstChild.remove();
        }
      }
    },
    doPreview(){
      const rect = document.querySelectorAll(".rect");
      let tempRect=[];
      //篩選Rect順序
      if(rect[0].x.baseVal.value<rect[1].x.baseVal.value){
        tempRect.push(rect[0]);
        tempRect.push(rect[1]);
      }else{
        tempRect.push(rect[1]);
        tempRect.push(rect[0]);
      }
      //畫出偵測點
      for(let i=0;i<tempRect.length;i++){
        const root = document.documentElement;

        let tdWidth = tempRect[i].width.baseVal.value/this.typeNum;
        let tdHeight = tempRect[i].height.baseVal.value/this.leftNum;
        let xmargin =  (tdWidth/this.ori_tdSize.width)*this.ori_margin.x;
        let ymargin = (tdHeight/this.ori_tdSize.height)*this.ori_margin.y;
        let BubbleWidth = tdWidth - xmargin;
        let BubbleHeight = tdHeight - ymargin;
        
        i==0?this.left_boxWidth=Math.round(tdWidth*100)/100:this.right_boxWidth=Math.round(tdWidth*100)/100;
        i==0?this.left_boxHeight=Math.round(tdHeight*100)/100:this.right_boxHeight=Math.round(tdHeight*100)/100;
        root.style.setProperty(i==0?'--left_xmargin':'--right_xmargin',(Math.round((xmargin/2)*100)/100)+'px');  //bubble的margin
        root.style.setProperty(i==0?'--left_ymargin':'--right_ymargin',(Math.round((ymargin/2)*100)/100)+'px');
        root.style.setProperty(i==0?'--left_BubbleWidth':'--right_BubbleWidth',(Math.round(BubbleWidth*100)/100)+'px');
        root.style.setProperty(i==0?'--left_BubbleHeight':'--right_BubbleHeight',(Math.round(BubbleHeight*100)/100)+'px');
        root.style.setProperty(i==0?'--left_x':'--right_x',tempRect[i].x.baseVal.value+'px');
        root.style.setProperty(i==0?'--left_y':'--right_y',tempRect[i].y.baseVal.value+'px');
        root.style.setProperty(i==0?'--left_width':'--right_width',tempRect[i].width.baseVal.value+'px');
        root.style.setProperty(i==0?'--left_height':'--right_height',tempRect[i].height.baseVal.value+'px');
      }
      this.removeRect('all');
      this.confirmRectNum();
      this.isDetect = false;
      this.isSendData = true;

      this.waitAniBtn(this.isDetectShow,this.delaytime);
    },

    doInfo(){
      let data = {};
      //----------------製作 Detect JSON----------------
      data.detect = this.detectJsonProcess();
      //----------------製作 Menu JSON----------------
      data.menuList = this.menuJsonProcess();
      //post setup api 後node-red處理傳送至python
      data.command = 'template';
      this.postSetup(data);

      this.reset();
    },
    detectJsonProcess(){
      let tempDetect = JSON.parse(JSON.stringify(detectFormat));
      const image = document.getElementById("image");
      const root = getComputedStyle(document.documentElement);
      let qNosArr=[];
      
      //photo Size
      tempDetect.Dimensions.push(image.width);
      tempDetect.Dimensions.push(image.height);

      tempDetect.BubbleDimensions.push(parseFloat(root.getPropertyValue('--left_BubbleWidth')));
      tempDetect.BubbleDimensions.push(parseFloat(root.getPropertyValue('--right_BubbleHeight')));
      //MCQBlock1
      tempDetect.QBlocks.MCQBlock1.qType='QTYPE_MCQ'+this.typeNum;
      tempDetect.QBlocks.MCQBlock1.orig.push(Math.round(parseInt(root.getPropertyValue('--left_x'))+
      parseInt(root.getPropertyValue('--left_xmargin'))));
      tempDetect.QBlocks.MCQBlock1.orig.push(Math.round(parseInt(root.getPropertyValue('--left_y'))+
      parseInt(root.getPropertyValue('--left_ymargin'))));
      
      for(let i=0; i<this.leftNum; i++){
        qNosArr.push('q'+(i+1));
      }
      tempDetect.QBlocks.MCQBlock1.qNos[0].push(qNosArr);
      tempDetect.QBlocks.MCQBlock1.gaps.push(this.left_boxWidth);
      tempDetect.QBlocks.MCQBlock1.gaps.push(this.left_boxHeight);
      //MCQBlock2
      tempDetect.QBlocks.MCQBlock2.qType='QTYPE_MCQ'+this.typeNum;
      tempDetect.QBlocks.MCQBlock2.orig.push(Math.round(parseInt(root.getPropertyValue('--right_x'))+
      parseInt(root.getPropertyValue('--right_xmargin'))));
      tempDetect.QBlocks.MCQBlock2.orig.push(Math.round(parseInt(root.getPropertyValue('--right_y'))+
      parseInt(root.getPropertyValue('--right_ymargin'))));
      
      qNosArr=[];
      for(let i=0; i<this.rightNum; i++){
        qNosArr.push('q'+(this.leftNum.length+(i+1)));
      }
      tempDetect.QBlocks.MCQBlock2.qNos[0].push(qNosArr);
      tempDetect.QBlocks.MCQBlock2.gaps.push(this.right_boxWidth);
      tempDetect.QBlocks.MCQBlock2.gaps.push(this.right_boxHeight);

      return tempDetect;
    },
    menuJsonProcess(){
      let tempMenu ={};
      let menu1 = JSON.parse(JSON.stringify(this.menuJson.menu1));
      let menu2 = JSON.parse(JSON.stringify(this.menuJson.menu2));
      tempMenu.qty = JSON.parse(JSON.stringify(this.menuJson.qty));
      tempMenu.taste = JSON.parse(JSON.stringify(this.menuJson.taste));
      
      //Menu key
      menu1.forEach((item,index)=>{
        item.detection_key = 'q'+(index+1);
        delete item.ori_taste;
        delete item.showTaste;
      });
      menu2.forEach((item,index)=>{
        item.detection_key = 'q'+(menu1.length+(index+1));
        delete item.ori_taste;
        delete item.showTaste;
      });
      tempMenu.menu = menu1.concat(menu2);
      //qty ordertype key
      tempMenu.ordertype=[];
      for(let i=0; i<tempMenu.qty; i++){
        tempMenu.ordertype.push((i+1).toString());
      }
      for(let i=0; i<tempMenu.taste.length; i++){
        tempMenu.ordertype.push(tempMenu.taste[i]);
      }

      return tempMenu;
    },
    postSetup(_data){
      let self = this;
      let msg = {};
      msg = _data;

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
          if(res.status=="ok" && res.command=="template"){
            //next machineTest page
            sessionStorage.setItem('detect',"complete");
            self.$router.push({path:'machineTest'});
          }else{
            //error modal
            self.errorMethod(5);
          }
      })
    },

    waitAniBtn(_btnshow,_delay){
      let self =this;
      self.isSendDataShow=false;
      self.time='('+_delay+')';
      var timerCount = setInterval(function timer() {
        _delay--;
        self.time='('+_delay+')';
        if (_delay == 0) 
        {
          self.time='';
          self.isSendDataShow=true;
          clearInterval(timerCount);
        } 
      }, 1000);
    },

    errorMethod(_errorNum, _msg){
      this.msgObj.isError = true;
      this.msgObj.num = _errorNum;
      this.msgObj.errormsg = _msg;
    },

    get_error(e){
      this.msgObj.isError = e;
    },
  }
};
</script>
<style>
  :root{
    --left_xmargin: 0px;
    --left_ymargin: 0px;
    --right_xmargin:0px;
    --right_ymargin:0px;
    --left_BubbleWidth: 20px;
    --left_BubbleHeight: 20px;
    --right_BubbleWidth: 20px;
    --right_BubbleHeight: 20px;
    --left_x:0px;
    --left_y:0px;
    --right_x:0px;
    --right_y:0px;
    --left_width:0px;
    --left_height:0px;
    --right_width:0px;
    --right_height:0px;
  }
  .py-30{
    padding-top: 30px;
    padding-bottom: 30px;
  }
  .pb-10{
    padding-bottom: 10px;
  }
  .my-card{
    width: 1330px;
  }
  .wrap{
    width: 1200px;
    margin:auto;
  }
  .svg_select_points {
    stroke-width: 1;
    fill: black;
    stroke-dasharray: 10 10;
    stroke: black;
    stroke-opacity: 0.8;
    pointer-events: none; /* This ons is needed if you want to deselect or drag the shape*/
  }
  .svg_select_boundingRect {
    display: none;
  }
  .title{
    font-size: 20px;
  }
  .checkBox{
    color: green;
    font-size: 30px;
    border: 2px solid green;
    border-radius: 5px;
    position: absolute;
    right:0;
    bottom:0;
  }
  .checkBox:hover{
    color: #3fd63f;
    border-color: #3fd63f;
  }
  .stroke {
    fill:rgba(42, 192, 42, 0.2);
    stroke: rgb(42, 192, 42);
    stroke-width: 3px;
  }
  .stroke:hover {
    fill:rgba(0, 243, 0, 0.1);
    stroke: rgb(0, 243, 0);
    stroke-width: 3px;
  }
  .annotator{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .detect1{
    width: var(--left_width);
    height: var(--left_height);
    top:var(--left_y);
    left:var(--left_x);
    background-color: #fa0;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content:space-between;
    align-content:space-between;
    opacity: 0.2;
  }
  .detect1 .item{
    width: var(--left_BubbleWidth);
    height: var(--left_BubbleHeight);
    background-color: #f00;
    margin:var(--left_ymargin) var(--left_xmargin);
  }
  .detect2{
    width: var(--right_width);
    height: var(--right_height);
    top:var(--right_y);
    left:var(--right_x);
    background-color: #fa0;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content:space-between;
    align-content:space-between;
    opacity: 0.2;
  }
  .detect2 .item{
    width: var(--right_BubbleWidth);
    height: var(--right_BubbleHeight);
    background-color: #f00;
    margin:var(--right_ymargin) var(--right_xmargin);
  }

  .q-dialog .body{
    font-size:16px;
  }
</style>