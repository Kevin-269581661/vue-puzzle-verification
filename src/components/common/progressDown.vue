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
import api from "../../api/api.js";

export default {
    data(){
        return{
            currper: 0,
            myInterval: '',
        }
    },
    methods:{
        // 导出订单图片包
        getProcess(){
            let tempwindow = '';
            api.getApi(this.apiVar.Advertisement+'/DownloadImgPackage', this.$route.query).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    let resinfo = res.data.data;
                    this.currper = parseInt(Number(resinfo.rate));
                    if(this.currper == 100){
                        clearInterval(this.myInterval);
                        // tempwindow = window.open();
                        // tempwindow.location = resinfo.url;
                        // setTimeout(()=>{tempwindow.close()}, 2000);

                        let downloadElement = document.createElement('a');
                        let href = resinfo.url;
                        downloadElement.href = href;
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载
                        document.body.removeChild(downloadElement); //下载完成移除元素
                        this.$alert('请在下载工具里查看文件', '文件成功生成', {
                            confirmButtonText: '知道了',
                        });
                    }
                }else{
                    clearInterval(this.myInterval);
                }
            }).catch(res =>{
                console.log(res);
                clearInterval(this.myInterval);                
            });
        },
        // 导出ppt/pdf
        getPPTProcess(){
            api.getApi(this.apiVar.Advertisement+'/GetReportExportProgress', this.$route.query).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    let resinfo = res.data.data;
                    this.currper = parseInt(Number(resinfo.rate));
                    if(resinfo.code == 200){
                        if(resinfo.finish == 1){
                            clearInterval(this.myInterval);
                            // let tempwindow = window.open();
                            // tempwindow.location = resinfo.cosUrl;
                            let downloadElement = document.createElement('a');
                            let href = resinfo.cosUrl;
                            downloadElement.href = href;
                            document.body.appendChild(downloadElement);
                            downloadElement.click(); //点击下载
                            document.body.removeChild(downloadElement); //下载完成移除元素
                            this.$alert('请在下载工具里查看文件', '文件成功生成', {
                                confirmButtonText: '知道了',
                            });
                        }
                    }else{
                        clearInterval(this.myInterval);
                        this.$message.warning(resinfo.msg);                        
                    }
                }else{
                    clearInterval(this.myInterval);
                }
            }).catch(res =>{
                console.log(res);
                clearInterval(this.myInterval);                
            });
        },
    },
    created(){
        if(this.$route.query.downtype == 1){
            this.getProcess();
        }else if(this.$route.query.downtype == 2){
            this.getPPTProcess();
        }
    },
    mounted(){
        this.myInterval = setInterval(() => {
            setTimeout(() => {
                console.log('downtype--', this.$route.query.downtype);
                //调用接口的方法
                if(this.$route.query.downtype == 1){
                    this.getProcess();
                }else if(this.$route.query.downtype == 2){
                    this.getPPTProcess();
                }
            }, 1)
        }, 5000);
    },
    destroyed(){
        clearInterval(this.myInterval)
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
