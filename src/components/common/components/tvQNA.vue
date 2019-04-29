<template>
    <div>
        <!-- <div style="margin-bottom: 40px">
             <el-input
                 placeholder="请输入内容"
                 prefix-icon="el-icon-search"
                 v-model="keyword">
             </el-input>
         </div>-->
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
                <template slot="title">
                    <h3>Q1.什么是电视广告？</h3>
                </template>
                <div>
                    <P>A1：电视广告是一种以电视为媒体的广告，有沉浸式电视生态广告及终端生态广告，如下图：</P>
                    <p style="padding-left: 59px">1.沉浸式电视生态广告：</p>
                    <p><img src="../../../assets/images/tvQNA_img1.jpg" alt=""></p>
                    <p><img src="../../../assets/images/tvQNA_img2.jpg" alt=""></p>
                    <p><img src="../../../assets/images/tvQNA_img3.jpg" alt=""></p>
                    <p><img src="../../../assets/images/tvQNA_img4.jpg" alt=""></p>
                    <p style="padding-left: 59px">2.电视终端生态广告：开机视频广告全频/选点接目banner/待机静态画面全屏</p>
                    <p><img src="../../../assets/images/tvQNA_img5.jpg" alt=""></p>
                </div>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    <h3>Q2.接入电视广告的目的是什么？</h3>
                </template>
                <div>
                    <p>A2：为抢占客户更多的广告预算，特意加入了电视广告模式，主要用于如下两种场景：</p>
                    <p style="padding-left: 59px">1.补充亲邻未覆盖区域，加大满足客户覆盖需求的可能；</p>
                    <p style="padding-left: 59px">2. 讲好线上线下联投的故事，抢占客户更多的投放预算。</p>
                </div>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template slot="title">
                    <h3>Q3.如何投放电视广告？</h3>
                </template>
                <div><p>A3：为了让业务员更熟悉电视广告，如有需求时，请联系全国运营中心协助方案制作和投放；全国运营中心。</p></div>
            </el-collapse-item>
            <el-collapse-item name="4">
                <template slot="title">
                    <h3>Q4.电视广告通案下载</h3>
                </template>
                <div><p>A4：<!--<a href="ApplicationForm.doc" download="申请表">点击并下载申请表</a>-->
                    <a href="/qinlinADcase.pdf" download="亲邻同源跨屏联投通案.pdf">点击下载 亲邻同源跨屏联投通案</a></p></div>
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
