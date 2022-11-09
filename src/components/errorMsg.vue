<template>
    <q-dialog v-model="isError">
        <q-card style="width:500px">
            <q-card-section class="row items-center bg-red-8 text-grey-3">
                <div class="text-h6">Error</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup @click="closeBtn"/>
            </q-card-section>
            <q-card-section class="text-grey-9 text-center">
                <q-icon class="q-pt-lg" name="error_outline" style="font-size: 80px;" />
                <div id="errorMessage" style="font-size:26px;line-height: 50px;">
                    {{errorText}}
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
        err:Boolean,
        num:Number,
        msg:String,
    },
    data(){
        return{
            isError:null,
            isSuccess:null,
            errorText:'',
        }
    },
    watch:{
        err(){
            this.isError=this.err;
            this.errorMethod(this.num,this.msg);
        }
    },
    methods:{
        errorMethod(_errorNum, _msg) {
            switch (_errorNum) {
                case 1:
                    this.errorText = "Timeout(1)";
                    break;
                case 2:
                    this.errorText = "System error(2)";
                    break;
                case 3:
                    this.errorText = "Can't find camera(3)";
                    break;
                case 4:
                    this.errorText = "Web api error(4)";
                    break;
                case 5:
                    this.errorText = "Data error(5)";
                    break;
                case 6:
                    this.errorText = "Setting data not ready(6)";
                    break;
                case 7:
                    this.errorText = "The detected area must be within 2(7)";
                    break;
                case 8:
                    this.errorText = "Format error(8)";
                    break;
                case 99:
                    this.errorText = _msg+'(99)';
                    break;
                default:
                    this.errorText = "Operation error(0)";
                    break;
            }
        },
        closeBtn(){
            this.$emit('returnOk',false);
        }
    }
}
</script>