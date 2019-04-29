<template>
    <div>
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
                <template slot="title">
                    <h3>合同1.《增加点位补充协议模板》下载</h3>
                </template>
                <div><p>
                    <a href="https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/contract/%E5%A2%9E%E5%8A%A0%E7%82%B9%E4%BD%8D%E8%A1%A5%E5%85%85%E5%8D%8F%E8%AE%AE%E6%A8%A1%E6%9D%BF.docx" download="增加点位补充协议模板.docx">点击下载 《增加点位补充协议模板》</a></p></div>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    <h3>合同2.《广告发布合同模板(亲邻为乙方)》下载</h3>
                </template>
                <div><p>
                    <a href="https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/contract/%E5%B9%BF%E5%91%8A%E5%8F%91%E5%B8%83%E5%90%88%E5%90%8C%E6%A8%A1%E6%9D%BF%EF%BC%88%E4%BA%B2%E9%82%BB%E4%B8%BA%E4%B9%99%E6%96%B9%EF%BC%89.doc" download="广告发布合同模板（亲邻为乙方.doc">点击下载 《广告发布合同模板(亲邻为乙方)》</a></p></div>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template slot="title">
                    <h3>合同3.《广告发布年框合同模板(亲邻为乙方)》下载</h3>
                </template>
                <div><p>
                    <a href="https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/contract/%E5%B9%BF%E5%91%8A%E5%8F%91%E5%B8%83%E5%B9%B4%E6%A1%86%E5%90%88%E5%90%8C%E6%A8%A1%E6%9D%BF%EF%BC%88%E4%BA%B2%E9%82%BB%E4%B8%BA%E4%B9%99%E6%96%B9%EF%BC%89.doc" download="广告发布年框合同模板（亲邻为乙方.doc">点击下载 《广告发布年框合同模板(亲邻为乙方)》</a></p></div>
            </el-collapse-item>
            <el-collapse-item name="4">
                <template slot="title">
                    <h3>合同4.《换画补充协议模板》下载</h3>
                </template>
                <div><p>
                    <a href="https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/contract/%E6%8D%A2%E7%94%BB%E8%A1%A5%E5%85%85%E5%8D%8F%E8%AE%AE%E6%A8%A1%E6%9D%BF.docx" download="换画补充协议模板.docx">点击下载 《换画补充协议模板》</a></p></div>
            </el-collapse-item>
            <el-collapse-item name="5">
                <template slot="title">
                    <h3>合同5.《未签署合同时情形下广告发布确认单及验收单2019.3.12》下载</h3>
                </template>
                <div><p>
                    <a href="https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/contract/%E6%9C%AA%E7%AD%BE%E7%BD%B2%E5%90%88%E5%90%8C%E6%97%B6%E6%83%85%E5%BD%A2%E4%B8%8B%E5%B9%BF%E5%91%8A%E5%8F%91%E5%B8%83%E7%A1%AE%E8%AE%A4%E5%8D%95%E5%8F%8A%E9%AA%8C%E6%94%B6%E5%8D%952019.3.12.doc" download="未签署合同时情形下广告发布确认单及验收单2019.3.12.doc">点击下载 《未签署合同时情形下广告发布确认单及验收单2019.3.12》</a></p></div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    export default {
        name: "tvQNA",
        data() {
            return {
                keyword:'',
                activeNames: 1
            }
        },
        methods:{
            handleChange() {

            },
        }
    }
</script>

<style scoped>
    h3 {
        color: #000;
        font-size: 18px;
        font-weight: bold;
        text-align: left;
        padding-left: 20px;
    }

    p {
        text-align: left;
        padding: 10px 22px;
        font-size: 16px;
    }
    img {
        width: 90%;
    }
    a{
        color: #4aa6fc;
    }
    a:hover{
        border-bottom: 1px solid #4aa6fc;
    }

</style>
<style>
    .el-main {
        background: #f5f6fa;
        padding-bottom: 120px;
    }

</style>
