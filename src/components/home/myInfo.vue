<template>
<div class="ad_mediaDetail_wrap clearfix">
    <div class="ad_mediaDetail_nav ">
        <p class="clearfix">
            <a href="#" style="color: #999">个人中心</a>
        </p>
    </div>
    <div class="questionAndAnswer">
        <el-container>
            <el-aside width="200px">
                <el-menu
                    default-active="1"
                    class="el-menu-vertical-demo QNAmenu">
                    <el-menu-item index="1" @click="showCom('userInfo')">
                        <span slot="title">
                            基本资料
                        </span>
                    </el-menu-item>
                    <el-menu-item index="2" @click="showCom('setPass')">
                        <span slot="title">
                            密码设置
                        </span>
                    </el-menu-item>
                    <el-menu-item index="3" @click="showCom('wxUnbind')">
                        <span slot="title">
                            微信解绑
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
</div>
</template>

<script>
    import userInfo from './userInfo';
    import setPass from './changePwd';
    import wxUnbind from './wxUnbind'

    export default {
        name: "questionAndAnswer",
        components: {
            userInfo,
            setPass,
            wxUnbind
        },
        data() {
            return {
                activeNames: '1',
                comName: '',
            }
        },
        mounted() {
            this.showCom('userInfo')
        },
        methods: {
            showCom(name) {
                console.log('name-------------', name);
                this.comName = name;
            },
        }

    }
</script>

<style lang="scss" scoped>
    .questionAndAnswer {
        width: 92%;
        margin: 0 auto;
        position: relative;
    }

    .el-aside {
        color: #333;
    }

    .el-main {
        color: #333;
        text-align: center;
        padding: 0px;
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

    .questionAndAnswer .el-container {
        width: 100%;
        height: 100%;
        padding: 24px 0;
        background: #fff;
    }

    .el-menu {
        height: 100%;
    }
    .questionAndAnswer /deep/ .el-menu-item.is-active{
        background-color: #e9f7fe;
        border-right: 2px solid #1890ff;
    }
    /deep/ .el-menu-item, .el-submenu__title{
        height: 48px;
        line-height: 48px;
    }
    /deep/ .myInfo_box{
        padding: 16px 32px;
        text-align: left;
        min-height: 179px;
        background: #fff;
    }
</style>
