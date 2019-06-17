<template>
    <div class="questionAndAnswer">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">Q&A</a>
            </p>
        </div>
        <el-container>
            <el-aside width="200px">
                <el-menu
                    default-active="1"
                    class="el-menu-vertical-demo QNAmenu"
                    @open="handleOpen"
                    @close="handleClose">
                    <el-menu-item index="1" @click="showCom('mediaQNA')">
                        <span slot="title">
                            媒体模块
                        </span>
                    </el-menu-item>
                    <el-menu-item index="2" @click="showCom('clientQNA')">
                        <span slot="title">
                             客户模块
                        </span>
                    </el-menu-item>
                    <el-menu-item index="3" @click="showCom('planQNA')">
                        <span slot="title">
                            方案模块
                        </span>
                    </el-menu-item>
                    <el-menu-item index="4" @click="showCom('orderQNA')">
                        <span slot="title">
                             订单模块
                        </span>
                    </el-menu-item>
                    <el-menu-item index="5" @click="showCom('tvQNA')">
                        <span slot="title">
                             电视广告
                        </span>
                    </el-menu-item>
                    <el-menu-item index="6" @click="showCom('wordQNA')">
                        <span slot="title">
                            合同下载
                        </span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <keep-alive>
                    <component :is="comName"></component>
                </keep-alive>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import mediaQNA from './components/mediaQNA'
    import clientQNA from './components/clientQNA'
    import planQNA from './components/planQNA'
    import orderQNA from './components/orderQNA'
    import tvQNA from './components/tvQNA'
    import wordQNA from './components/wordQNA'

    export default {
        name: "questionAndAnswer",
        components: {
            mediaQNA,
            clientQNA,
            planQNA,
            orderQNA,
            tvQNA,
            wordQNA,
        },
        data() {
            return {
                activeNames: '1',
                comName: '',
            }
        },
        mounted() {
            this.showCom('mediaQNA')
        },
        methods: {
            showCom(name) {
                console.log('name-------------', name);
                this.comName = name;
            },
            handleChange() {

            },
            handleOpen(){

            },
            handleClose(){

            }
        }

    }
</script>

<style scoped>
    .questionAndAnswer {
        position: absolute;
        width: 100%;
        bottom: 60px;
        top: 60px;

    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
    }

    .el-main {
        background-color: #fff;
        color: #333;
        text-align: center;
        padding: 0 20px 20px 20px;
    }

    .QNAmenu span {
        color: #303133;
    }

    .QNAmenu .is-active span {
        color: #108aff;
        width: 100%;
        height: 100%;
        display: inline-block;
    }

    .el-aside {
        background: #ffffff;
    }

    .questionAndAnswer .el-container {
        width: 100%;
        height: 100%;
        padding: 0 60px 42px 60px;
    }

    .el-menu {
        height: 100%;
    }
    .questionAndAnswer /deep/ .el-menu-item.is-active{
        background-color: #e9f7fe;
        border-right: 2px solid #1890ff;
    }
    .ad_mediaDetail_nav p {
        padding-left: 60px;
        position: absolute;
        left: 0;
        top: 12px;
        font-size: 14px;
        line-height: 18px;
    }

    .ad_mediaDetail_nav p a {
        color: #666;
    }

    .ad_mediaDetail_nav {
        height: 42px;
        position: relative;
    }

</style>
<style>
    .questionAndAnswer .el-collapse{
        border-top: none;
    }
</style>
