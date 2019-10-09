<template>
    <div class="bell-wrap">
        <el-popover
            placement="bottom"
            width="340"
            class="popper"
            trigger="click">
            <div>
                <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
                    <!--<el-tab-pane :label="'全部('+messageList.allTxt+')'" name="all"></el-tab-pane>-->
                    <!--<el-tab-pane :label="'未读('+messageList.unread+')'" name="unread"></el-tab-pane>-->
                <!--</el-tabs>-->
                <div class="tab-pane">
                    <span @click="handleClick('all')" :class="activeName=='all'?'active':''">全部({{messageList.allTxt}})</span>
                    <span @click="handleClick('unread')" :class="activeName=='unread'?'active':''">未读({{messageList.unread}})</span>
                </div>
                <ul class="list-wrap" ref="scrollBox">
                    <li v-for="(item,index) in messageList.list" :class="messageList.readStatus==1?'readed':''"
                        @click="read(item)">
                        <img v-if="item.messageType=='0'" src="../../../assets/images/media.png" alt="">
                        <img v-if="item.messageType=='2'" src="../../../assets/images/order.png" alt="">
                        <img v-if="item.messageType=='1'" src="../../../assets/images/editor.png" alt="">
                        <div class="content">
                            <h5>{{item.title}}</h5>
                            <p><span>{{item.messagePart1}}</span>{{item.messagePart2}}</p>
                            <span>{{timeFormat(item.createTime*1)}}</span>
                        </div>
                        <div class="read-mask" v-if="item.status!=1"></div>
                    </li>

                </ul>
                <div class="messagelist-btn" @click="goMessageList">
                    消息列表
                </div>
            </div>
            <el-badge slot="reference" :value="messageList.unread" :max="99">
                <i class="el-icon-bell" style="color: #fff;font-size: 20px"></i>
            </el-badge>
        </el-popover>
    </div>
</template>

<script>
    import api from "../../../api/api.js";
    import timeFormat from '../../../commonFun/timeFormat'

    export default {
        data() {
            return {
                activeName:'all',
                page:1,
                messageList: {
                    unread: 1,
                    allTxt:1,
                    list: [
                        {
                            messageType: '0',
                            title: '媒体禁用',
                            messagePart1: '中信西关海北门',
                            messagePart2: '已被xx禁用',
                            createTime: '1569750591000',
                            status:0,
                        },
                    ]
                },
                sessionData:'',
                system:'http://192.168.1.239:8021/system/message',
            }
        },
        methods: {
            timeFormat(createTime) {
                return timeFormat.timestampFormat(createTime)
            },
            //列表滚动到底部
            scrollFn(){
                this.$refs.scrollBox.addEventListener('scroll',()=>{
                    if(this.$refs.scrollBox.scrollTop+this.$refs.scrollBox.clientHeight==this.$refs.scrollBox.scrollHeight){
                        console.log('到底了');
                        this.page++;
                        this.getMessageList()
                    }
                })
            },
            //切换全部和已读
            handleClick(type) {
                this.activeName = type
                this.getMessageList()
            },
            ///获取消息列表
            getMessageList(){
                let info = {
                    pageSize:10,
                    pageNum:this.page,
                };
                if(this.activeName=='unread'){
                    info.hasRead = 0
                }
                // api.getApi(this.apiVar.system + '/list',info).then(res => {
                api.getApi(this.system + '/list',info).then(res => {
                    if (res.data.SysCode == 200200) {
                        this.messageList.list = res.data.data.dataList
                    }
                })
            },
            //查询全部和未读条数
            getUnreadCount() {
                // api.getApi(this.apiVar.system + '/unreadCount').then(res => {
                api.getApi(this.system + '/unreadCount').then(res => {
                    if (res.data.SysCode == 200200) {
                       this.messageList.unread = res.data.data.unreadCount
                       this.messageList.allTxt = res.data.data.hasReadCount
                    }
                })
            },
            //单个已读跳转
            read(item) {
                let messageId = item.messageId

                // api.postApi(this.apiVar.system + '/readMessage', {messageId: messageId}).then(res => {
                api.postApi(this.system + '/readMessage', {messageId: messageId}).then(res => {
                    if (res.data.SysCode == 200200) {
                        //操作成功
                        item.status = 0
                    }
                })
            },
            //全部已读
            readAll() {
                // api.postApi(this.apiVar.system + '/readAllMessage').then(res => {
                api.postApi(this.system + '/readAllMessage').then(res => {
                    if (res.data.SysCode == 200200) {
                        //操作成功
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
            },
            //跳转消息列表
            goMessageList(){
                this.$router.push('/messageList')
            }
        },
        mounted(){
            this.getUnreadCount()
            this.scrollFn()
            this.getMessageList()

        }
    }
</script>

<style scoped>
    .bell-wrap {
        display: inline-block;
        cursor: pointer;
        text-align: center;
        line-height: 20px;
        float: right;
        padding-top: 20px;
    }

    /deep/ .el-popover {
        padding: 0 !important;
    }

    /deep/ .bell-wrap .el-icon-bell {
        color: #fff;
        font-size: 20px;
    }
    .list-wrap{
        height: 450px;
        overflow-y: scroll;
        padding: 0 12px;
    }
    /*!*滚动条*!*/
    .list-wrap::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    }

    .list-wrap::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 0px;
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }

    .list-wrap::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
        border-radius: 0;
        background: #fafafa;
    }

    .list-wrap li {
        display: flex;
        padding: 10px 12px;
        box-sizing: border-box;
        border-bottom: 1px solid #E8E8E8;
        cursor: pointer;
        position: relative;
    }
    .list-wrap .read-mask{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.45);
    }

    .list-wrap li:last-child {
        border: none;
    }

    .list-wrap li img {
        width: 44px;
        height: 44px;
        margin-right: 14px;
    }

    .list-wrap li h5 {
        font-size: 16px;
        font-weight: 600;
        color: rgba(82, 82, 83, 1);
        margin-bottom: 4px;
    }

    .list-wrap li p {
        font-size: 14px;
        color: rgba(82, 82, 83, 1);
        margin-bottom: 4px;
    }

    .list-wrap li p span {
        font-size: 14px;
        font-weight: bold;
        color: rgba(82, 82, 83, 1);
        margin-bottom: 4px;
        margin-right: 5px;
    }

    .list-wrap li span {
        color: rgba(0, 0, 0, 0.45);
    }

    .title {
        height: 30px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #E8E8E8;
    }

    .title span:first-child {
        color: rgba(82, 82, 83, 1);
    }

    .title span:last-child {
        color: #1890FF;
        cursor: pointer;
    }
    /deep/ .el-tabs__nav-scroll{
        display: flex;
        justify-content: space-around;
    }
    .messagelist-btn{
        text-align: center;
        color: #108EE9;
        cursor: pointer;
        border-top: 1px solid #E8E8E8;
        padding-top: 12px;
    }
    .tab-pane{
        position: relative;
        border-bottom: 1px solid #E8E8E8;
        font-size: 14px;
        color: #525253;
        display: flex;
        justify-content: space-around;
        padding: 0 12px;
    }
    .tab-pane span{
        display: inline-block;
        width: 80px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        cursor: pointer;
    }
    .tab-pane span.active{
        border-bottom: 2px solid #1890FF;
        color: #1890ff;
    }


</style>
