<template>
    <div class="bell-wrap">
        <el-popover
            placement="bottom"
            width="360"
            class="popper"
            trigger="click">
            <div>
                <h5 class="title">
                    <span>消息({{messageList.unread}}条未读)</span>
                    <span>全部已读</span>
                </h5>
                <ul class="list-wrap">
                    <li v-for="(item,index) in messageList.list" :class="messageList.readStatus==1?'readed':''">
                        <img v-if="item.messageType=='media'" src="../../../assets/images/media.png" alt="">
                        <img v-if="item.messageType=='order'" src="../../../assets/images/order.png" alt="">
                        <img v-if="item.messageType=='plan'" src="../../../assets/images/editor.png" alt="">
                        <div class="content">
                            <h5>{{item.title}}</h5>
                            <p><span>{{item.messagePart1}}</span>{{item.messagePart2}}</p>
                            <span>{{timeFormat(item.time*1)}}</span>
                        </div>
                    </li>
                </ul>
            </div>

            <el-badge slot="reference" :value="200" :max="99">
                <i class="el-icon-bell" style="color: #fff;font-size: 20px"></i>
            </el-badge>
        </el-popover>
    </div>
</template>

<script>
    import timeFormat from '../../../commonFun/timeFormat'
    export default {
        props:{
            messageList: {
                type: Object,
                default: {
                    unread:1,
                    list:[
                        {
                            messageType:'media',
                            title:'媒体禁用',
                            messagePart1:'中信西关海北门',
                            messagePart2:'已被xx禁用',
                            time:'1569750591000'
                        },
                        {
                            messageType:'plan',
                            title:'媒体禁用',
                            messagePart1:'中信西关海北门',
                            messagePart2:'已被xx禁用',
                            time:'1569750591000'
                        },
                        {
                            messageType:'order',
                            title:'媒体禁用',
                            messagePart1:'中信西关海北门',
                            messagePart2:'已被xx禁用',
                            time:'1569750591000'
                        }
                    ]
                }
            }
        },
        data(){
            return {
                timeFormat(time){
                    return timeFormat.timestampFormat(time)
                }
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
   /deep/ .el-popover{
        padding: 0 !important;
    }
    /deep/ .bell-wrap .el-icon-bell{
        color: #fff;
        font-size: 20px;
    }
    .list-wrap li{
        display: flex;
        padding: 10px 12px;
        box-sizing: border-box;
        border-bottom: 1px solid #E8E8E8;
        cursor: pointer;
    }
    .list-wrap li:last-child{
        border: none;
    }
    .list-wrap li img{
        width: 44px;
        height: 44px;
        margin-right: 14px;
    }
    .list-wrap li h5{
        font-size: 16px;
        font-weight: 600;
        color:rgba(82,82,83,1);
        margin-bottom: 4px;
    }
    .list-wrap li p{
        font-size: 14px;
        color:rgba(82,82,83,1);
        margin-bottom: 4px;
    }
    .list-wrap li p span{
        font-size: 14px;
        font-weight: bold;
        color:rgba(82,82,83,1);
        margin-bottom: 4px;
        margin-right: 5px;
    }
    .list-wrap li span{
        color:rgba(0,0,0,0.45);
    }
    .title{
        height: 30px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #E8E8E8;
    }
    .title span:first-child{
        color:rgba(82,82,83,1);
    }
    .title span:last-child{
        color:#1890FF;
        cursor: pointer;
    }

</style>
