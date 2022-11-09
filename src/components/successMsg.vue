<template>
    <q-dialog v-model="isSuccess">
        <q-card style="width:500px">
            <q-card-section class="row items-center bg-green-8 text-grey-3">
                <div class="text-h6">{{successText}}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup @click="closeBtn"/>
            </q-card-section>
            <q-card-section class="text-grey-9 text-center">
                <q-icon class="q-pt-lg" name="o_check_circle" style="font-size: 80px;" />
                <div style="font-size:28px;line-height: 50px;">
                    {{successText}} Success!
                </div>
            </q-card-section>
                <q-card-actions align="right" class="bg-white">
                <q-btn label="OK" v-close-popup @click="closeBtn"/>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script>
export default {
    name: "errorMsg",
    props:{
        success:Boolean,
        msg:String,
    },
    data(){
        return{
            isSuccess:null,
            successText:'',
        }
    },
    watch:{
        success(){
            this.isSuccess = this.success;
            this.successText = this.msg;
        }
    },
    mounted() {
        // console.log('msgsuccess');
    },
    methods:{
        closeBtn(){
            this.$emit('returnOk',false);
        }
    }
}
</script>