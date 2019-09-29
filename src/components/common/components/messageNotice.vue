<template>
    <div class="bell-wrap">
        <el-popover
            placement="bottom"
            width="360"
            trigger="click">
            <div>
                <h5 class="title">
                    <span>消息({{messageList.unread}}条未读)</span>
                    <span>全部已读</span>
                </h5>
                <ul>
                    <li></li>
                </ul>
            </div>

            <el-badge slot="reference" :value="200" :max="99">
                <i class="el-icon-bell" style="color: #fff;font-size: 20px"></i>
            </el-badge>
        </el-popover>
    </div>
</template>

<script>
    export default {
        props:{
            list: {
                type: Array,
                default: []
            }
        },
        data(){
            return {

            }
        },
        methods:{

        },
    }
</script>

<style scoped>
    .bell-wrap{
        display: inline-block;
        width: 40px;
        height: 40px;
        cursor: pointer;
        text-align: center;
        line-height: 20px;
        float: right;
        padding-top: 20px;
    }
    .bell-wrap:hover{
        background: #363636;
    }
    /deep/ .bell-wrap .el-icon-bell{
        color: #fff;
        font-size: 20px;
    }
</style>
