<template>
    <div class="bell-wrap">
        <el-popover
            placement="bottom"
            v-model="showPopover"
            width="340"
            popper-class="message-popper"
            trigger="click"
            :loading="loading"
        >
            <div>
                <div class="tab-pane">
                    <span @click="handleClick('all')"
                          :class="activeName=='all'?'active':''">全部({{messageList.allTxt}})</span>
                    <span @click="handleClick('unread')" :class="activeName=='unread'?'active':''">未读({{messageList.unread}})</span>
                </div>
                <ul class="list-wrap" ref="scrollBox">
                    <li v-if="activeName=='all'" v-for="(item,index) in messageList.list" :key="index"
                        :class="messageList.readStatus==1?'readed':''"
                        @click="read(item)">
                        <img v-if="item.messageType=='0'" src="../../../assets/images/media.png" alt="">
                        <img v-if="item.messageType=='2'" src="../../../assets/images/order.png" alt="">
                        <img v-if="item.messageType=='1'" src="../../../assets/images/editor.png" alt="">
                        <div class="content" style="text-align: left;cursor: pointer">
                            <h5>{{item.title}}</h5>
                            <p v-html="item.messagePart1" style="text-align: left"></p>
                            <span>{{timeFormat(item.createTime*1)}}</span>
                        </div>
                        <div class="read-mask" v-if="item.status!=0"></div>
                    </li>
                    <li v-if="activeName=='unread'" v-for="(item,index) in messageList.unreadlist" :key="index"
                        :class="messageList.readStatus==1?'readed':''"
                        @click="read(item)">
                        <img v-if="item.messageType=='0'" src="../../../assets/images/media.png" alt="">
                        <img v-if="item.messageType=='2'" src="../../../assets/images/order.png" alt="">
                        <img v-if="item.messageType=='1'" src="../../../assets/images/editor.png" alt="">
                        <div class="content" style="text-align: left;cursor: pointer">
                            <h5>{{item.title}}</h5>
                            <p v-html="item.messagePart1" style="text-align: left"></p>
                            <span>{{timeFormat(item.createTime*1)}}</span>
                        </div>
                        <div class="read-mask" v-if="item.status!=0"></div>
                    </li>

                </ul>
                <div class="messagelist-btn">
                    <span @click="readAll">一键已读</span>
                    <span @click="goMessageList">消息列表</span>
                </div>
            </div>
            <el-badge v-if="messageList.unread>0"  slot="reference" :value="messageList.unread" :max="99" >
                <i class="el-icon-bell" style="color: #fff;font-size: 20px" @click="showPop"></i>
            </el-badge>
            <i v-else slot="reference" class="el-icon-bell" style="color: #fff;font-size: 20px" @click="showPop"></i>
        </el-popover>
    </div>
</template>

<script>
    import api from "../../../api/api.js";
    import timeFormat from '../../../commonFun/timeFormat'

    export default {
        data() {
            return {
                activeName: 'all',
                page: 1,
                maxPage: 0,
                messageList: {
                    unread: 0,
                    allTxt: 0,
                    list: [],
                    unreadlist: []
                },
                sessionData: '',
                // system: 'http://192.168.1.239:8021/system/message',
                showPopover: false,
                loading:true,
            }
        },
        methods: {
            showPop(){
              this.showPopover = !this.showPopover
            },
            timeFormat(createTime) {
                return timeFormat.timestampFormat(createTime)
            },
            //列表滚动到底部
            scrollFn() {
                this.$refs.scrollBox.addEventListener('scroll', () => {
                    if (this.$refs.scrollBox.scrollTop + this.$refs.scrollBox.clientHeight == this.$refs.scrollBox.scrollHeight) {
                        // console.log('到底了');
                        if (this.page < this.maxPage) {
                            this.page++;
                            this.getMessageList()
                        }

                    }
                })
            },
            //切换全部和已读
            handleClick(type) {
                let that = this
                this.page = 1
                this.activeName = type
                this.messageList.list = []
                this.messageList.unreadlist = []
                setTimeout(function () {
                    that.getUnreadCount()
                    that.getMessageList()
                }, 50)
            },
            ///获取消息列表
            getMessageList() {
                let info = {
                    pageSize: 10,
                    pageNum: this.page,
                };
                if (this.activeName == 'unread') {
                    info.hasRead = 0
                }
                api.getApi(this.apiVar.system + '/list', info).then(res => {
                    // api.getApi(this.system + '/list', info).then(res => {
                    if (res.data.SysCode == 200200) {
                        this.maxPage = res.data.data.totalPage
                        if (res.data.data.dataList.length > 0) {
                            for (let data of res.data.data.dataList) {
                                if (this.activeName == 'unread') {
                                    this.messageList.unreadlist.push(data)
                                } else {
                                    this.messageList.list.push(data)
                                }
                            }
                            this.loading = false
                        }
                    }
                })
            },
            //查询全部和未读条数
            getUnreadCount() {
                api.getApi(this.apiVar.system + '/unreadCount').then(res => {
                    // api.getApi(this.system + '/unreadCount').then(res => {
                    if (res.data.SysCode == 200200) {
                        this.messageList.unread = res.data.data.unreadCount
                        this.messageList.allTxt = res.data.data.hasReadCount + res.data.data.unreadCount
                    }
                })
            },
            //单个已读
            read(item) {
                let messageId = item.messageId
                let that = this
                api.postApi(this.apiVar.system + '/readMessage', {messageId: messageId}).then(res => {
                    // api.postApi(this.system + '/readMessage', {messageId: messageId}).then(res => {
                    if (res.data.SysCode == 200200) {
                        this.page = 1
                        that.messageList.list = []
                        that.messageList.unreadlist = []
                        //操作成功
                        // item.status = 1
                        setTimeout(() => {

                            that.getUnreadCount()
                            that.getMessageList()
                        }, 500)
                    }
                })
            },
            //全部已读
            readAll() {
                let that = this
                this.loading = true
                api.postApi(this.apiVar.system + '/readAllMessage').then(res => {
                    if (res.data.SysCode == 200200) {
                        //操作成功
                        this.page = 1
                        // that.messageList.list = []
                        for(let data of that.messageList.list){
                            data.status =1
                        }
                        that.messageList.unreadlist = []
                        setTimeout(() => {
                            that.getUnreadCount()
                            that.getMessageList()
                        }, 1000)
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
            },
            //跳转消息列表
            goMessageList() {
                this.showPopover = false
                if (this.$route.path.includes('media/messageList') || this.$route.path.includes('sale/messageList')) {
                    //已是消息列表页
                } else if (this.$route.path.includes('/media') || this.$route.path.includes('/sale')) {
                    if (this.$route.path.includes('sale')) {
                        this.$router.push('/sale/messageList')
                    } else {
                        this.$router.push('/media/messageList')
                    }
                } else {
                    this.$router.push('./messageList')

                }


            }
        },
        mounted() {
            this.getUnreadCount()
            this.scrollFn()
            this.messageList.list = []
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

    .list-wrap {
        height: 430px;
        overflow-y: scroll;

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
        box-sizing: border-box;
        border-bottom: 1px solid #E8E8E8;
        /*cursor: pointer;*/
        position: relative;
        padding: 10px 24px;
    }

    .list-wrap .read-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.45);
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
        font-size: 12px;
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

    /deep/ .el-tabs__nav-scroll {
        display: flex;
        justify-content: space-around;
    }

    .messagelist-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #108EE9;
        cursor: pointer;
        border-top: 1px solid #E8E8E8;
        height: 48px;
    }
    .messagelist-btn span{
        line-height: 48px;
        text-align: center;
        width: 50%;
    }
    .messagelist-btn span:first-child {
        border-right: 1px solid #E8E8E8;
    }

    .tab-pane {
        position: relative;
        border-bottom: 1px solid #E8E8E8;
        font-size: 14px;
        color: #525253;
        display: flex;
        justify-content: space-around;
        padding: 0 12px;
    }

    .tab-pane span {
        display: inline-block;
        width: 80px;
        height: 46px;
        line-height: 46px;
        text-align: center;
        cursor: pointer;
    }

    .tab-pane span.active {
        border-bottom: 2px solid #1890FF;
        color: #1890ff;
    }


</style>
<style>
    .message-popper {
        padding: 0 !important;
        position: absolute !important;
        top: 42px !important;
        right: 5%;
        /*left: 1055px !important;*/
    }
    .message-popper .el-popper[x-placement^=bottom] .popper__arrow{
        left: 49% !important;
    }

</style>
