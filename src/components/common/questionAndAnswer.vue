<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav">
            <p>
                <a href="#" style="color: #999">常见问题</a>
            </p>
        </div>
        <el-container>
            <el-aside class="qna-aside" width="280px">
              <!--  <el-menu
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
                </el-menu>-->
                <el-input
                    placeholder="请输入问题关键词"
                    suffix-icon="el-icon-search"
                    v-model="keyword">
                </el-input>
                <el-menu
                    default-active="1"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose">
                    <el-menu-item index="1">
                        <span slot="title">QADN概述</span>
                    </el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">
                            <span>导航一</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="2-1">选项1</el-menu-item>
                            <el-menu-item index="2-2">选项2</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <!--<keep-alive>-->
                    <!--<component :is="comName"></component>-->
                <!--</keep-alive>-->
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
                keyword:'',
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
    .ad_mediaDetail_wrap {
        position: absolute;
        width: 100%;
        bottom: 60px;
        top: 60px;

    }

    .el-aside {
        background: #ffffff;
        color: #333;
        text-align: left;
        padding: 16px;
        box-sizing: border-box;
    }


    /*!*滚动条*!*/
    .qna-aside::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    }

    .qna-aside::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 4px;
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }

    .qna-aside::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
        border-radius: 0;
        background: #fafafa;
    }
    .qna-aside /deep/ .el-input{
        margin-bottom: 10px;
    }


    .el-menu {
        height: 100%;
        border-right: none;
        font-size: 14px;
        color:rgba(0,0,0,0.65);
    }
    .qna-aside /deep/ .el-menu-item.is-active{
        background-color: #e9f7fe;
        border-right: 2px solid #1890ff;
    }
    /deep/ .el-menu-item, .el-submenu__title{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
    }
    .qna-aside /deep/ .el-submenu__title{
        font-size: 14px;
        height: 40px;
        line-height: 40px;
    }
    .qna-aside /deep/ .el-menu-item:focus, .el-menu-item:hover{
        background: #fff;
        color: #409EFF;
    }
    .qna-aside /deep/ .el-submenu.is-active .el-submenu__title i{
        color: rgba(0,0,0,0.5);
    }
    .el-main {
        background-color: #fff;
        color: #333;
        text-align: center;
        padding: 0 20px 20px 20px;
    }

    .ad_mediaDetail_wrap .el-container {
        width: 100%;
        height: 100%;
        padding: 0 60px 42px 60px;
    }
</style>
<style>
    .ad_mediaDetail_wrap .el-collapse{
        border-top: none;
    }
</style>
