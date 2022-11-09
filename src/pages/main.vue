<template>
    <q-page>
        <div class="column items-center justify-center vh-100">
            <q-card class="my-card q-pa-xl" flat bordered> 
                <div class="wrap">
                    <div class="text-center text-grey-10 text-h2" style="font-weight: 700;">MenuSync</div>
                    <div class="row items-center justify-center btn-group">
                        <div class="col-3">
                            <q-card class="btn text-grey-10 text-h5 text-center pa-20" @click="$router.push({path:'makeMenu'})" flat bordered>
                                <q-icon name="restaurant_menu"/>
                                <div class="txt">製作菜單</div>
                            </q-card>
                        </div>
                    </div>
                    <div class="row items-center justify-center btn-group">
                        <div class="col-3">
                            <q-card class="btn text-grey-10 text-h5 text-center pa-20" @click="$router.push({path:'capture'})" flat bordered> 
                                <q-icon name="settings"/>
                                <div class="txt">偵測設定</div>
                            </q-card>
                        </div>
                    </div>
                </div>
            </q-card>
        </div>
    </q-page>
</template>
<script>
import { SessionStorage } from 'quasar';
export default {
    created() {
        sessionStorage.clear();  
    },
}
</script>
<style scoped>
    .vh-100{
        height:100vh;
    }
    .pa-20{
        padding:20px;
    }
    .my-card{
      width: 1330px;
    }
    .wrap{
        width: 1200px;
        margin:auto;
    }
    .btn-group{
        margin-top:50px;
    }
    .btn{
        cursor: pointer;
        background-color:#e0e0e0;
    }
    .btn:hover{
        background-color: #bdbdbd;
    }
    .q-card .q-icon{
        font-size: 100px;
        margin:20px 0;
    }
    .q-card .txt{
        letter-spacing: 10px;
    }
    
</style>