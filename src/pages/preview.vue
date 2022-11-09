<template>
  <q-page class="column items-center justify-start">
    <div class="py-30">
      <div class="viewContainer" v-if="data.menu1.length!=0">
        <div class="row q-pt-md q-px-md items-center menuInfo">
          <div class="col-auto">
            <img class="logo" style="max-width:220px;max-height: 110px;" :src="data.b64img"/>
          </div>
          <div class="col">
          </div>
        </div>
        <div class="row q-pt-sm q-pb-md q-px-md menuBtn">
          <div class="col-auto">
            <q-btn @click="$router.go(-1)">
              <q-icon name="reply" />
              <div>返回</div>
            </q-btn>
          </div>
          <div class="col"></div>
          <div class="col-auto">
            <q-btn class="q-mr-md" @click="saveFile">
              <q-icon class="q-pr-xs" name="file_download" />
              <div>下載</div>
            </q-btn>
            <q-btn class="q-mr-none" @click="printBtn">
              <q-icon class="q-pr-xs" name="print" />
              <div>列印</div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="my-card new-page">
        <table>
          <thead>
            <tr>
              <td v-for="col in columns"
              :class="col.class" 
              :style="col.style" :key="col.goods_no">{{col.label}}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data.menu1" class="text-center" :key="row.goods_no">
              <td class="no-print font_goodsNo">{{row.goods_no}}</td>
              <td class="text-left font_category">{{row.new_cat}}</td>
              <td class="text-left font_name">{{row.goods_name}}</td>
              <td class="font_price">{{row.sale_price}}</td>
              <!-- 份量 -->
              <td v-for="i in parseInt(data.qty)" class="box-border no-padding" :key="i">
                <q-btn :style="{ width: boxW+'px', height: boxH+'px'}"
                outline color="black" size="6px" />
              </td>
              <!-- 口味 -->
              <q-td v-for="taste in data.taste" :key="taste.taste_name" class="box-border no-padding">
                <q-btn v-if="data.setting.isTaste && isRenderTaste(row.realtaste, taste)" outline :style="{ width: boxW+'px', height: boxH+'px'}" 
                color="black" size="6px" />
              </q-td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="view2Container" v-if="data.menu1.length!=0">
        <div class="row q-pa-md items-center menuInfo">
          <div class="col-auto">
            <img  class="logo" style="width:320px;max-height: 120px;" src=""/>
          </div>
          <div class="col">
          </div>
          <!-- 內用外帶桌號 -->
          <!-- <div class="col-4 orderType">
            <div class="row">
              <div class="col-auto justify-end">
                <div class="row q-pb-md">
                  <div class="col">
                    <q-btn outline style="width:25px;height:25px;" color="black"/>
                    <label style="font-size:16px;letter-spacing: 1px;">&nbsp;&nbsp;外帶</label>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <q-btn outline style="width:25px;height:25px;" color="grey-9"/>
                    <label style="font-size:16px;letter-spacing: 1px;">&nbsp;&nbsp;內用&nbsp;&nbsp;桌號&nbsp;</label>
                  </div>
                </div>
              </div>
              <div class="col">
                <q-btn outline style="width:100%;height:100%;" color="black"/>
              </div>
            </div>
          </div> -->
        </div>
        <div class="row q-pa-md menuBtn">
          <div class="col-auto">
            <q-btn @click="$router.go(-1)">
              <q-icon name="reply" />
              <div>返回</div>
            </q-btn>
          </div>
          <div class="col"></div>
          <div class="col-auto">
            <q-btn class="q-mr-md" @click="saveFile">
              <q-icon class="q-pr-xs" name="file_download" />
              <div>下載</div>
            </q-btn>
            <q-btn class="q-mr-none" @click="printBtn">
              <q-icon class="q-pr-xs" name="print" />
              <div>列印</div>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="my-card">
        <table>
          <thead>
            <tr>
              <td v-for="col in columns"
              class="no-view"
              :class="col.class" 
              :style="col.style" :key="col.goods_no">{{col.label}}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data.menu2" class="text-center" :key="row.goods_no">
              <td class="no-print font_goodsNo">{{row.goods_no}}</td>
              <td class="text-left font_category">{{row.new_cat}}</td>
              <td class="text-left font_name">{{row.goods_name}}</td>
              <td class="font_price">{{row.sale_price}}</td>
              <!-- 份量 -->
              <td v-for="i in parseInt(data.qty)" class="box-border no-padding" :key="i">
                <q-btn :style="{ width: boxW+'px', height: boxH+'px'}" 
                outline color="black" size="6px" />
              </td>
              <!-- 口味 -->
              <q-td v-for="taste in data.taste" :key="taste.taste_name" class="box-border no-padding">
                <q-btn v-if="data.setting.isTaste && isRenderTaste(row.realtaste, taste)" outline :style="{ width: boxW+'px', height: boxH+'px'}" 
                color="black" size="6px" />
              </q-td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="btngroup">
        <div class="column">
          <q-btn class="col q-mb-md bg-primary text-white" size="18px" @click="doMenuFormat">
            <div>下一步</div>
          </q-btn>
          <q-btn class="col q-mb-md bg-red-14 text-white" size="18px" @click="$router.push({ name: 'main' });">
            <div>結束</div>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>  
</template>

<script>
import { saveAs } from 'file-saver';

export default {
  name: "Preview",
  data() {
    return {
      columns: [
        {
          name: 'goods_no',
          required: true,
          label: '菜號',
          field: row => row.goods_no,
          class: 'no-print',
          style: 'width: 20px',
        },
        {
          name: 'new_cat',
          label: '類別',
          field: 'new_cat',
          class: 'yes-print',
          style: 'width: 85px; ',
        },
        {
          name: 'goods_name',
          label: '菜名',
          field: 'goods_name',
          class: 'yes-print',
          style: '',
        },
        {
          name: 'sale_price',
          label: '價錢',
          field: 'sale_price',
          class: 'yes-print',
          style: 'width: 70px;',
        }
      ],
      data: {
      },
      fileObj: null,
      boxW:0,
      boxH:0,
    }
  },
  created() {
    let sessionData = sessionStorage.getItem("menuFormat");
    
    if (sessionData == undefined || sessionData == null|| sessionData == null) {
      this.$router.push({ path: 'makeMenu' });
    }
    this.data = JSON.parse(sessionData);
      console.log('menu data', this.data);
    
    window.addEventListener('afterprint', (event) => {
      console.log('After print');
    });
    window.addEventListener('beforeprint', (event) => {
      console.log('Before print');
    });
  },
  mounted() {
    if (this.data == undefined || this.data == null) return;
    this.previewProcess(this.data);
    
    //設定print時是否雙頁面
    const root = document.documentElement;
    
    if(this.data.menu2.length>0)
      root.style.setProperty('--viewOrderType','none');
    
    let lngAll = this.data.menu1.length+this.data.menu2.length;
    if(lngAll>50){
      root.style.setProperty('--fontName','18px');
      root.style.setProperty('--fontPrice','18px');
      root.style.setProperty('--fontCategory','18px');
    }else if(lngAll>=40&&lngAll<50){
      root.style.setProperty('--fontName','22px');
      root.style.setProperty('--fontPrice','20px');
      root.style.setProperty('--fontCategory','20px');
    }else if(lngAll<40){
      root.style.setProperty('--fontName','24px');
      root.style.setProperty('--fontPrice','24px');
    }
      
  },
  beforeDestroy() {
    // clearInterval(this.intervalId);
  },
  methods: {
    previewProcess(_data) {
      if (_data == null || _data == undefined) return;
      // 1260-30-40-150.
      let height = Math.ceil(1050/_data.menu1.length)+'px';
      const root = document.documentElement;
      root.style.setProperty('--viewHeight',height);
      //份量
        if (_data.qty != null && _data.qty != undefined) {
          for (let i = 0; i < _data.qty; i++) {
            let obj = {};
            obj.name = (i + 1).toString();
            obj.label = _data.setting.qtyType=="0" ? (i + 1).toString() : '份量';
            obj.field = (i + 1).toString();
            obj.class = 'yes-print';
            this.columns.push(obj);
          }
        }
      
      //口味
      if (_data.setting.isTaste && _data.taste != null && _data.taste != undefined) {
        for (let i = 0; i < _data.taste.length; i++) {
          let obj = {};
          obj.name = _data.taste[i].taste_name.toString();
          obj.label = _data.taste[i].taste_name.toString();
          obj.field = _data.taste[i].taste_name.toString();
          obj.class = 'yes-print';
          this.columns.push(obj);
        }
      }

      //button
      this.boxW = 50 * (this.data.boxSize.width/100);
      this.boxH = parseInt(height) * (this.data.boxSize.height/100);
    },
    isRenderTaste(_realtaste, _taste) {
      for (let i = 0; i < _realtaste.length; i++) {
        if (_realtaste[i].taste_no == _taste.taste_no)
          return true;
      }
      return false;
    },
    printBtn() {
      window.print();  
    },
    saveFile() {
      this.updateData();
      
      let size = this.data.menu1.length + this.data.menu2.length;
      let dataStr = JSON.stringify(this.data);
      let FileSaver = require('file-saver');
      let blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
      FileSaver.saveAs(blob, "myMenu"+size+".json");
    },
    updateData(){
      //margin ＆ boxSize
      let td = document.querySelector("tbody tr .box-border");
      this.data.margin={};
      this.data.tdSize={};
      this.data.tdSize.width = td.offsetWidth;
      this.data.tdSize.height = td.offsetHeight;
      this.data.margin.x = (td.offsetWidth - this.boxW) / 2;
      this.data.margin.y = Math.round(((td.offsetHeight - this.boxH) / 2)* 100) / 100;
    },
    doMenuFormat(){
      this.updateData();
      sessionStorage.setItem('menuFormat',JSON.stringify(this.data));
      this.$router.push({ path: 'capture' });
    },
  },
}
</script>
<style scoped>
  :root{
    --viewOrderType:block;
    --viewHeight:36px;
    --fontName:18px;
    --fontPrice:18px;
    --fontCategory:18px;
  }
  .py-30{
    padding-top: 30px;
    padding-bottom: 30px;
  }
  img{
    vertical-align: middle;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    color:#1f1f1f;
    font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  table, th, td {
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
  table tbody td{
    padding: 4px 8px;
    height: var(--viewHeight);
  }
  thead td{
    word-wrap:break-word;
    text-align: center;
  }
  .box-border{
    text-align: center;
    width: 50px;
  }
  .font_goodsNo{
    font-size:13px;
    width: 20px;
  }
  .font_category{
    width: 85px;
    color:#00f;
    font-weight: bold;
  }
  .font_name{
    font-size:18px; 
  }
  .font_price{
    font-size:18px; 
    font-style: italic;
    width: 80px;
  }
  
  .no-view{
    display:none
  }
  .viewContainer{
    border: 2px solid rgba(0, 0, 0, 0.12); 
    border-radius:15px 15px 0 0;
    border-bottom: 0px!important;
  }
  .view2Container{
    display: none;
  } 

  .text-center{
    text-align: center;
  }
  .text-left{
    text-align: left;
  }
  .text-right{
    text-align: right;
  }

  .btngroup{
    position:fixed;
    right: calc(50% - (480px + 50px));
    bottom:0;
  }

  @page {
    /* size: portrait; 直向 */
    /* size: landscape; 橫向 */
    /* size: A5; */
    /* size: B4 portrait;  */
    margin:20px 30px 0px 30px;
  }
  @media print {
    .no-print {
      display: none;
    }
    .yes-print{
      display: table-cell;
    }
    .py-30{
      /* 阻擋原先padding */
      padding-top:0;
      padding-bottom: 0;
    }
    .q-pt-md{
      /* 阻擋原先padding */
      padding-top:0;
    }
    .q-pa-md{
      /* 阻擋原先padding */
      padding-top:0;
      padding-bottom: 0;
    }

    img{
      max-height: 110px;
    }

    table{
      margin:0;
      padding: 0;
    }
    thead{
      display: table-row-group;
    }
    tr{
      min-height: 36px;
      max-height: 70px;
    }
    .new-page{
      page-break-after: always; 
    }
    .font_category{
      font-size: var(--fontCategory);
      width:100px;
    }
    .font_name{
      font-size:var(--fontName); 
    }
    .font_price{
      font-size:var(--fontPrice); 
    }
    .q-table__top {
      display: none;
    }

    h1,h2,h3,h4,h5,h6 {
      page-break-inside: avoid;
      page-break-after: avoid;
    }

    .menuInfo{
      margin: 10px 0;
      height: 110px;
    }
    .menuBtn{
      display: none;
    }
    .viewContainer{
      border: 0px;
    }
    .viewContainer img{
      border-radius: 10px;
    } 
    .viewContainer .orderType{
      display: var(--viewOrderType);
    }
    .view2Container{
      display: block;
    }
    .view2Container .logo{
      display: none;
    }
  }
</style>
<style lang="sass" scoped>
  .my-card
    width: 100%
    width: 860px
    font-size: 16px
</style>
