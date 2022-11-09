<template>
  <q-page>
    <div class="column items-center py-30">
      <q-card class="my-card q-pa-md" flat bordered>
        <!-- File -->
        <q-card-section>
          <div class="row items-center">
            <div class="q-pr-sm col-1">
              載入舊檔:
            </div>
            <div class="col-3">
              <q-file color="black"
                v-model="json_file"
                label="Json"
                accept=".json" 
                filled
                @input ="upLoadFile($event)"
                >
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop/>
                </template>
              </q-file>
            </div>
          </div>
        </q-card-section>
        <!-- Image -->
        <q-card-section>
          <div class="row items-start">
            <div class="q-pr-sm q-pt-md col-1">
              Logo圖片:
            </div>
            <div class="col-auto">
              <q-file class="upload_file"
                color="black" 
                label="Image" 
                accept=".png,.jpeg,.jpg,.gif" 
                filled
                @input ="upLoadImage($event)"
                :input-style="{height:'115px', width:'220px'}"
                >
                <template v-slot:prepend >
                  <q-icon v-if="!logo_b64string" class="upload_icon" name="cloud_upload" @click.stop/>
                  <img v-if="logo_b64string" class="upload_img" :src="logo_b64string"/>
                </template>
                <template v-slot:append >
                  <q-icon v-if="logo_b64string" class="upload_del" name="o_cancel" @click="rmUploadImg"/>
                </template>
              </q-file>
            </div>
          </div>
          <div class="row">
            <div class="col-1"></div>
            <div class="col-auto">
              <small>僅限於png、jpeg、jpg、gif格式，建議圖片：110*220。</small>
            </div>
          </div>
        </q-card-section>
        <!-- Setting -->
        <q-card-section>
          <div class="row items-center"> 
            <div class="q-pr-sm col-1">
              設定:
            </div>
            <div class="col">
              <div class="q-gutter-sm">
                <q-btn-toggle
                    v-model="qtyType"
                    class="my-custom-toggle"
                    no-caps
                    rounded
                    toggle-color="primary"
                    color="white"
                    text-color="primary"
                    :options="[
                      {label: '塗卡', value: '0'},
                      {label: '數字', value: '1'}
                    ]"
                  />
                <q-checkbox v-model="isSize" label="大小"/>
                <q-checkbox v-model="isTaste" label="品味"/>
              </div>
            </div>
          </div>
        </q-card-section>
        <!-- Qty -->
        <q-card-section v-if="qtyType==0">
          <div class="row items-center">
            <div class="q-pr-sm col-1">
              份量:
            </div>
            <div class="col">
              <q-btn-toggle toggle-color="primary" push glossy v-model="qty" :options="[
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
              ]"/>
            </div>
          </div>
        </q-card-section>
        <!-- Size -->
        <q-card-section class="q-pt-sm" v-if="isSize">
          <div class="row items-center">
            <div class="col-1 q-pr-sm">
              大小:
            </div>
            <div class="col-4">
              <q-badge>
                寬: {{ width }} %(20 to 70)
              </q-badge>
              <q-slider class="slider q-pa-none" v-model="width" markers snap :step="10" :min="20" :max="70" />
            </div>
            <div class="col-4">
              <q-badge>
                高: {{ height }} %(20 to 60)
              </q-badge>
              <q-slider class="slider q-pa-none" v-model="height" markers snap :step="10" :min="20" :max="60" />
            </div>
            <div class="col">
              <div class="row">
                <p class="col-auto text-grey-9" style="font-size:14px">預覽：</p>
                <div class="col-auto q-ml-sm" style="border:1px solid #4e4e4e; height:36px; width:50px;">
                  <div class="row items-center justify-center" style="height:100%">
                    <q-btn outline color="primary" :style="{ width:  width+'%', height: height+'%' }"/>
                  </div>
                </div>
                <q-tooltip anchor="bottom middle" self="top middle">
                  <div class="text-body2">表格欄位裡的塗卡大小。</div>
                </q-tooltip>
              </div>
            </div>
          </div>
        </q-card-section>
        <!-- Taste -->
        <q-card-section v-if="isTaste">
          <div class="q-my-xs">品味:</div>
          <div class="row">
            <div>
              <q-badge class="col q-mx-xs" style="font-size: 15px;"
                :color="groupsWithTastes[0].items.length > maxTastes ? 'red' : 'green'">
                已選擇 ( {{ groupsWithTastes[0].items.length }} / {{ maxTastes }})
              </q-badge>
            </div>
          </div>
          <div class="row q-mt-sm" v-drag-and-drop="options">
            <q-card v-for="group in groupsWithTastes" :key="group.id" :id="group.id" class="col q-mx-xs q-xy-sm">
              <q-list class="app-custom-list" bordered separator :data-id="group.id" style="height:100%"
                @added="added($event, group)" @removed="removed($event, group)" @reordered="reordered($event, group)">
                <q-item class="app-item q-px-none" v-for="item in group.items" :key="item.id" :data-id="item.taste_no">
                  <q-item-section avatar>
                    <q-icon name="menu" class="q-mx-sm text-grey-9" />
                  </q-item-section>
                  <q-item-section class="q-mx-sm text-grey-9">{{ item.taste_name }}</q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </q-card-section>
        <!-- Order -->
        <q-card-section>
          <div class="q-my-xs">菜單:</div>
          <div class="row">
            <div>
              <q-badge class="col q-mx-xs" style="font-size: 15px;"
                :color="(groupsWithOrders[0].items.length > maxOrders || groupsWithOrders[0].items.length == 0) ? 'red' : 'green'">
                已選擇 ( {{ groupsWithOrders[0].items.length }} / {{ maxOrders }})
              </q-badge>
            </div>
          </div>
          <div class="row" v-drag-and-drop="options">
            <q-card class="col q-mx-xs q-xy-sm" v-for="group in groupsWithOrders" :key="group.id" :id="group.id">
              <q-list class="app-custom-list" style="height:100%" bordered separator :data-id="group.id"
                @added="add2($event, group)" @removed="remove2($event, group)" @reordered="reordere2($event, group)">
                <q-item class="app-item q-px-none" v-for="item in group.items" :key="item.id" :data-id="item.goods_no">
                  <q-item-section avatar>
                    <q-icon name="menu" class="col-1 q-mx-sm text-grey-9" />
                  </q-item-section>
                  <q-item-section class="col-1 text-start text-red-8">{{ item.category_name }}</q-item-section>
                  <q-item-section class="col-3 text-start text-grey-9" v-if="group.id == 'order_show'">
                    {{ item.goods_name }}</q-item-section>
                  <q-item-section v-else class="col text-left text-grey-9">{{ item.goods_name }}</q-item-section>
                  <q-item-section class="col-2 text-grey-8 text-italic">NT${{ item.sale_price }}</q-item-section>
                  <q-item-section class="col q-mr-sm text-right" v-if="group.id == 'order_show'">
                    <div class="q-gutter-sm" v-if="groupsWithTastes[0].items.length > 0">
                      {{ item.taste }}
                      <q-checkbox v-for="taste in groupsWithTastes[0].items" :key="taste.id" size="xs"
                        v-model="item.showTaste" :label="taste.taste_name" :val="taste.taste_no" disable />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </q-card-section>
        <!-- Make Btn -->
        <div class="row justify-end q-mt-sm">
          <q-btn class="mr-20" size="16px" color="negative" label="返回" @click="$router.push({name:'main'})"  />
          <q-btn class="mr-20" size="16px" color="primary" label="製作菜單" @click="makeMenu"  />
        </div>
        <!--
        //Menu Test 
        <div class="row q-pa-md">
          <textarea class="full-width text-caption" rows="5">{{ menuString }}</textarea>
        </div> -->
      </q-card>
    </div>
    <ErrorMsg :err="msgObj.isError" :num="msgObj.num" :msg="msgObj.errormsg" @returnOk="get_error"></ErrorMsg>
    <!-- <q-checkbox v-model="isError" label="error"/> -->
  </q-page>
</template>

<script>
import mqtt from 'mqtt';
import { SessionStorage } from 'quasar';
import ErrorMsg from '../components/errorMsg.vue';
export default {
    name: "Processing",
    components: { ErrorMsg },
    data() {
      return {
          menuObj: {},
          menuString: "",
          isSize: true,
          isTaste: true,
          qtyType: 0,
          qty: 0,
          width: 20,
          height: 20,
          maxTastes: 3,
          maxOrders: 60,
          pageMaxOrders: 20,
          columns: [
              {
                  name: "name",
                  required: true,
                  label: "Dessert (100g serving)",
                  align: "left",
                  field: row => row.name,
                  format: val => `${val}`,
                  sortable: true
              },
              { name: "calories", align: "center", label: "Calories", field: "calories", sortable: true },
              { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
              { name: "carbs", label: "Carbs (g)", field: "carbs" },
              { name: "protein", label: "Protein (g)", field: "protein" },
              { name: "sodium", label: "Sodium (mg)", field: "sodium" },
              { name: "calcium", label: "Calcium (%)", field: "calcium", sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
              { name: "iron", label: "Iron (%)", field: "iron", sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
          ],
          groupsWithTastes: [
              {
                  id: "taste_show",
                  items: []
              },
              {
                  id: "taste_hidden",
                  items: []
              }
          ],
          groupsWithOrders: [
              {
                  id: "order_show",
                  items: []
              },
              {
                  id: "order_hidden",
                  items: []
              }
          ],
          options: {
              multipleDropzonesItemsDraggingEnabled: false,
              dropzoneSelector: ".q-list",
              draggableSelector: ".q-item"
          },
          json_file: null,
          logo_b64string: "",
          msgObj:{
            isSuccess:false,
            isError:false,
            num:0,
            errormsg:'',
            successmsg:'',
          }
      };
    },
    created() {
        this.init();
        // Subscribe mqtt
        this.subscribe_topic = "menu/#";
        this.$mqtt.subscribe(this.subscribe_topic);
        this.$mqtt.publish('menu/from_page/get_menu', "get_menu");
    },
    mqtt: {
      "menu/#"(data, topic) {
          if (topic === "menu/from_server/get_menu") {
              this.get_settings = JSON.parse(data);
              this.menu = this.get_settings.menu;
              this.tastes = this.get_settings.tastes;
              console.log("this.get_settings", this.get_settings);
              this.initMenu();
          }
      }
    },
    mounted() {
        console.log("make menu mounted");
    },
    computed: {
      CanMake: function () {
          return ((this.groupsWithTastes[0].items.length <= this.maxTastes) || !this.isTaste)
              && (this.groupsWithOrders[0].items.length <= this.maxOrders)
              && (0 < this.groupsWithOrders[0].items.length);
      },
      TasteHeight: function () {
          let selectItems = this.groupsWithTastes[0].items.length > 0 ? this.groupsWithTastes[0].items.length : 0;
          let unSelectItems = this.groupsWithTastes[1].items.length ? this.groupsWithTastes[1].items.length : 0;
          return (selectItems > unSelectItems) ? selectItems * 70 : unSelectItems * 70;
      },
      OrderHeight: function () {
          let selectItems = this.groupsWithOrders[0].items.length > 0 ? this.groupsWithOrders[0].items.length : 0;
          let unSelectItems = this.groupsWithOrders[1].items.length ? this.groupsWithOrders[1].items.length : 0;
          return (selectItems > unSelectItems) ? selectItems * 70 : unSelectItems * 70;
      }
    },
    watch: {
      qtyType() {
          if (this.qtyType == "1")
              this.qty = "1";
          else
              this.qty = this.qty;
      }
    },
    methods: {
      init() {
          //init
          this.qty = "2";
          this.qtyType = "0";
      },
      initMenu() {
          this.groupsWithTastes[0].items = JSON.parse(JSON.stringify(this.tastes));
          this.menu.forEach(_item => {
              _item.showTaste = [];
              _item.ori_taste.forEach(_taste => {
                  _item.showTaste.push(_taste.taste_no);
              });
          });
          this.groupsWithOrders[0].items = JSON.parse(JSON.stringify(this.menu));
      },
      added(event, group) {
        if(this.json_file)this.rmUploadFile();
          const newItems = this.groupsWithTastes.map((group) => group.items)
              .reduce((prev, curr) => [...prev, ...curr], [])
              .filter((item) => event.detail.ids.map(Number).indexOf(parseInt(item.taste_no)) >= 0);
          group.items.splice(event.detail.index, 0, ...newItems);
      },
      removed(event, group) {
          group.items = group.items
              .filter((item) => event.detail.ids.map(Number).indexOf(parseInt(item.taste_no)) < 0);
          // console.log(group.items);
      },
      reordered(event, group) {
          const reorderedItems = group.items.filter((item) => event.detail.ids.map(Number).indexOf(parseInt(item.taste_no)) >= 0);
          const newItems = group.items
              .filter((item) => event.detail.ids.map(Number).indexOf(parseInt(item.taste_no)) < 0);
          newItems.splice(event.detail.index, 0, ...reorderedItems);
          group.items = newItems;
      },
      add2(event, group) {
        if(this.json_file)this.rmUploadFile();
          const newItems = this.groupsWithOrders.map((group) => group.items)
              .reduce((prev, curr) => [...prev, ...curr], [])
              .filter((item) => event.detail.ids.map(Number).indexOf(parseInt(item.goods_no)) >= 0);
          group.items.splice(event.detail.index, 0, ...newItems);
          // order_hidden_color
          if (event.target.getAttribute("data-id") == "order_hidden") {
              // console.log('yes');
              let item = event.detail.items[0];
              // console.log('items', event.detail.items[0]);
          }
          else {
              // console.log('no');
          }
      },
      remove2(event, group) {
          group.items = group.items
              .filter((item) => event.detail.ids.map(Number).indexOf(parseInt(item.goods_no)) < 0);
      },
      reordere2(event, group) {
          const reorderedItems = group.items.filter((item) => event.detail.ids.map(Number).indexOf(parseInt(item.goods_no)) >= 0);
          const newItems = group.items
              .filter((item) => event.detail.ids.map(Number).indexOf(parseInt(item.goods_no)) < 0);
          newItems.splice(event.detail.index, 0, ...reorderedItems);
          group.items = newItems;
      },
      makeMenu() {
          this.menuObj.setting = {};
          this.menuObj.qty = this.qty;
          if (this.logo_b64string) {
            this.menuObj.b64img=this.logo_b64string;
          }else{
            this.menuObj.b64img = '';
          }
          if (this.isSize) {
              this.menuObj.boxSize = {};
              this.menuObj.boxSize.width = this.width;
              this.menuObj.boxSize.height = this.height;
          }
          if (this.isTaste) {
              this.menuObj.taste = this.groupsWithTastes[0].items;
              this.menuObj.noTaste = this.groupsWithTastes[1].items;
          }
          this.menuObj.menu1 = [];
          this.menuObj.menu2 = [];
          this.menuObj.noMenu = this.groupsWithOrders[1].items;
          //Setting
          this.menuObj.setting.qtyType = this.qtyType;
          this.menuObj.setting.isSize = this.isSize;
          this.menuObj.setting.isTaste = this.isTaste;
          //Taste
          if (this.isTaste) {
              //判斷菜單原有品味.並排除設定品味
              this.groupsWithOrders[0].items.forEach(_order => {
                  _order.realtaste = [];
                  this.menuObj.taste.forEach(_taste => {
                      //以設定品味做排序
                      _order.ori_taste.forEach(_datataste => {
                          //判斷菜單的口味是否可顯示
                          if (_datataste.taste_no == _taste.taste_no) {
                              _order.realtaste.push(_datataste);
                          }
                      });
                  });
              });
          }
          //Divide Menu Data into two Table Datas
          if (this.groupsWithOrders[0].items.length <= this.pageMaxOrders) { //Menu Data small pageMaxOrders
              this.menuObj.menu1 = this.groupsWithOrders[0].items;
          }
          else {
              let lng = this.groupsWithOrders[0].items.length;
              let menulng = (lng % 2 == 0 && (lng / 2) <= this.maxOrders / 2) ? lng / 2 : parseInt(lng / 2) + 1;
              // console.log(menulng, lng);
              for (let i = 0; i < menulng; i++) {
                  this.menuObj.menu1.push(this.groupsWithOrders[0].items[i]);
              }
              for (let i = menulng; i < lng; i++) {
                  this.menuObj.menu2.push(this.groupsWithOrders[0].items[i]);
              }
          }
          this.menuString = JSON.stringify(this.menuObj);
          sessionStorage.setItem("menuFormat", this.menuString);
          //順利到preview頁面
          this.$router.push({ path: 'preview' });
      },
      confirmFile(_name) {
          let fileTypes = ["json"];
          let extension = _name.split(".").pop().toLowerCase();
          if (fileTypes.indexOf(extension) === -1) {
              alert("放入資料格式錯誤！");
              return false;
          }
          return true;
      },
      upLoadFile(event) {
          let self = this;
          if (!self.confirmFile(event.name))return;

          let reader = new FileReader();
          reader.readAsText(event, "utf-8");
          reader.onload = function () {
              let data = JSON.parse(reader.result);
              if (typeof data.qty === "undefined") {
                  self.json_file = null;
                  self.errorMethod(5);
                  return;
              }
              //進行讀取動作
              self.qtyType = data.setting.qtyType;
              self.isSize = data.setting.isSize;
              self.isTaste = data.setting.isTaste;
              self.qty = data.qty;
              if (data.b64img!='')self.logo_b64string = data.b64img;
              if (self.isSize) {
                  self.width = data.boxSize.width;
                  self.height = data.boxSize.height;
              }
              if (self.isTaste) {
                  self.groupsWithTastes[0].items = data.taste;
                  self.groupsWithTastes[1].items = data.noTaste;
              }
              self.groupsWithOrders[0].items = JSON.parse(JSON.stringify(data.menu1));
              if (data.menu2.length != 0) {
                  data.menu2.forEach(_order => {
                      self.groupsWithOrders[0].items.push(_order);
                  });
              }
              self.groupsWithOrders[1].items = data.noMenu;
          };
      },
      upLoadImage(event) {
        let reader = new FileReader();
        let self = this;
        reader.readAsDataURL(event);
        reader.onload = function () {
            let base64;
            base64 = reader.result;
            self.logo_b64string = base64;
        };
      },
      rmUploadFile(){
        this.json_file = null;
      },  
      rmUploadImg(){
        this.logo_b64string = '';
        if(this.json_file)this.rmUploadFile();
      },
      errorMethod(_errorNum, _msg){
        this.msgObj.isError = true;
        this.msgObj.num = _errorNum;
        this.msgObj.errormsg = _msg;
      },
      get_error(e){
        this.msgObj.isError = e;
      },
    },
    beforeDestroy() {
      // clearInterval(this.intervalId);
    },
}
</script>

<style scoped>
    
.my-card{
  width: 100%;
  width: 1330px;
  font-size: 20px;
}

.py-30{
  padding-top: 30px;
  padding-bottom: 30px;
}
.mr-20{
  margin-right: 20px;
}

.slider {
  width: 90%;
}

.q-item__section {
  font-size: 16px;
}

.app-custom-list {
  min-width: 10rem;
  margin-top: 0 !important;
}

.upload_file{
  position: relative;
}
.upload_icon{
  position: absolute;
  font-weight: bold;
  font-size: 180%;
  left: 0;
  width: 100%;
  top: 40%;
}
.upload_img{
  position: absolute;
  left: 20px;
  top: 20%;
  height: 110px;
  width: 220px;
  opacity: .8;
}

#taste_hidden {
  opacity: 0.5;
}

#order_hidden {
  opacity: 0.5;
}

.app-item[aria-grabbed="true"] {
  background: #BBDEFB;
  color: #fff;
}

.item-dropzone-area {
  height: 6rem;
  background: #fa0;
  opacity: 0.8;
  animation-duration: 0.5s;
  animation-name: nodeInserted;
  margin-left: 0.6rem;
  margin-right: 0.6rem;
}

@keyframes nodeInserted {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 0.8;
  }
}

.q-table thead{
  text-align: center !important;
}
</style>
