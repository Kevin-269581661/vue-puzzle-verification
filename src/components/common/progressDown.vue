<template>
    <div class="down_page">
        <el-progress :width="120" type="circle" :percentage="currper" :status="currper==100?'success':''"></el-progress>
        <p class="text_style">{{currper==100?'生成完成，请在下载工具里查看文件':'正在生成中，请等待…'}}</p>
        <div class="file_style" v-if="currper == 100">
            <img src="../../assets/images/downfile.png" alt="">
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            currper: 20,
        }
    },
    methods:{
        getProcess(){
            console.log(JSON.parse(sessionStorage.getItem('session_data')));
            if(this.currper == 100){
                this.$alert('请在下载工具里查看文件', '文件成功生成', {
                    confirmButtonText: '知道了',
                });
            }
        },
    },
    mounted(){
        this.getProcess();
    },
}
</script>

<style scoped>
.down_page{
    text-align: center;
    padding-top: 25%;
}
.text_style{
    font-size: 14px;
    color: rgba(0,0,0,0.65);
    margin-top: 8px;
}
.file_style{
    position: absolute;
    bottom: 0;
    left: 40px;
}
.file_style img{
    display: inline-block;
    width: 148px;
    height: 84px;
}
</style>
