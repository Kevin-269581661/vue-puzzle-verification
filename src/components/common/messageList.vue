<template>
    <div class="ad_mediaDetail_wrap clearfix message-list">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">消息通知</a>
            </p>
        </div>
        <div class="list-wrap">
            <h5>消息列表</h5>
            <div class="table-wrap">
                <el-row class="input-wrap">
                    <el-col :span="7">
                        <span>消息类型:</span>
                        <el-select v-model="searchInfo.messageType" placeholder="请选择消息类型" clearable>
                            <el-option v-for="item of typeArr" :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        <span>消息日期:</span>
                        <el-date-picker class="input-with-select" v-model="searchInfo.date" type="daterange"
                                        range-separator="-" format="yyyy/MM/dd" value-format="yyyy/MM/dd"
                                        start-placeholder="消息日期" end-placeholder="消息日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="7">
                        <span>消息内容:</span>
                        <el-input v-model="searchInfo.info" placeholder="请输入消息内容"></el-input>
                    </el-col>
                    <el-col :span="3" style="text-align: right">
                        <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                        <el-button @click="reset()">重置</el-button>
                    </el-col>
                </el-row>
                <ul class="mess-ul">
                    <li class="mess-li" v-for="(item,index) in messageList" :key="index">
                        <div>
                            <h6>
                                {{item.title}} <span :class="item.status==0?'unread':'read'">{{item.status==0?'未读':'已读'}}</span>
                            </h6>
                            <a v-if="item.status==0" href="javascript:;" @click="read(item)">标记已读</a>
                        </div>
                        <p>
                            <span v-html="item.messagePart1"></span>
                            <span>{{timeFormat(item.createTime*1)}}</span>
                        </p>

                    </li>
                </ul>
                <div class="ad_pagination" v-if="totalSize">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="changePage"
                        @size-change="sizeChange"
                        :page-sizes="[10, 20, 50]"
                        :current-page.sync="currPage"
                        :page-size="pageSize"
                        :total="totalSize">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "../../api/api.js";
    import timeFormat from '../../commonFun/timeFormat'
    export default {
        name: "messageList",
        data() {
            return {
                currPage: 1,
                pageSize: 10,
                totalSize: 0,
                searchInfo: {
                    messageType: '',
                    date: '',
                    info: '',
                },
                typeArr: [
                    {
                        label: '媒体通知',
                        value: 0,
                    },
                    {
                        label: '方案通知',
                        value: 1
                    },
                    {
                        label: '订单通知',
                        value: 2
                    }
                ],
                messageList: [],
                // system:'http://192.168.1.239:8021/system/message',
            }

        },
        methods: {
            timeFormat(createTime) {
                return timeFormat.timestampFormat(createTime)
            },
            search() {
                console.log(this.searchInfo);
                let info = {
                    pageNum: this.currPage,
                    pageSize: this.pageSize,
                };
                if(this.searchInfo.info!=''){
                    info.keyword = this.searchInfo.info
                }
                if (this.searchInfo.messageType !== '') {
                    info.messageType = this.searchInfo.messageType
                }
                if(this.searchInfo.date!=null&&this.searchInfo.date.length>1){
                    info.startTime = new Date(this.searchInfo.date[0]).getTime()
                    info.endTime = new Date(this.searchInfo.date[1]).getTime()
                }
                console.log(info);
                api.getApi(this.apiVar.system + '/list',info).then(res => {
                    if (res.data.SysCode == 200200) {
                        this.totalSize = res.data.data.totalSize
                        this.messageList = res.data.data.dataList
                    }
                    console.log(this.messageList);
                })
            },
            reset() {
                let obj = {
                    messageType: '',
                    date: '',
                    info: '',
                }
                this.searchInfo = obj
                this.search()
            },
            // 分页
            changePage(val) {
                // console.log('当前页',val)
                this.currPage = val
                this.search();
            },
            // 每页条数切换
            sizeChange(val) {
                this.pageSize = val;
                this.currPage = 1;
                this.search();
            },
            //标记已读
            read(item) {
                let messageId = item.messageId
                api.postApi(this.apiVar.system + '/readMessage', {messageId: messageId}).then(res => {
                // api.postApi(this.system + '/readMessage', {messageId: messageId}).then(res => {
                    if (res.data.SysCode == 200200) {
                        //操作成功
                        item.status = 1
                    }
                })
            },
        },
        mounted() {
            this.search()
        }
    }
</script>

<style scoped>
    .list-wrap {
        background: #fff;
        margin: 0 64px;
        border: 1px solid rgba(230, 231, 233, 1)
    }

    .list-wrap h5 {
        height: 55px;
        width: 100%;
        font-size: 16px;
        padding: 0 16px;
        line-height: 55px;
        font-weight: 600;
        color: rgba(44, 49, 60, 1);
        border-bottom: 1px solid #E9E9E9;
        box-sizing: border-box;
    }

    .table-wrap {
        padding: 24px 32px;
        width: 100%;
        box-sizing: border-box;
    }

    /deep/ .input-wrap .el-input, /deep/ .input-wrap .el-input__inner, /deep/ .input-wrap .el-range-editor.el-input__inner {
        height: 32px;
        width: 240px;
    }

    /deep/ .input-wrap .el-date-editor .el-range__icon, /deep/ .input-wrap .el-date-editor .el-range-separator {
        line-height: 26px;
    }

    /deep/ .el-button {
        min-width: 74px;
    }

    .table-wrap span {
        color: rgba(0, 0, 0, 0.85);
    }
    .table-wrap /deep/ .el-date-editor .el-range__close-icon{
        line-height: 26px;
    }

    .mess-ul {
        margin-top: 16px;
    }

    .mess-li {
        border-radius: 4px 4px 0px 0px;
        border: 1px solid #E8E8E8;
        margin-bottom: 16px;
    }

    .mess-li > div {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        height: 54px;
        padding: 15px 24px;
        box-sizing: border-box;
        background: rgba(250, 250, 250, 1);
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .mess-li > div h6 {
        font-weight: bold;
    }

    .mess-li > div a {
        color: rgba(24, 144, 255, 1);
        font-size: 14px;
    }

    .mess-li>div span {
        font-size: 12px;
        display: inline-block;
        width: 32px;
        text-align: center;
        height: 16px;

        font-weight: lighter;
    }

    .mess-li .unread {
        color: #fff;
        background: #1890FF;
    }

    .mess-li .read {
        background: #E8E8E8;
        color: rgba(0, 0, 0, 0.25);
    }

    .mess-li p {
        font-size: 14px;
        padding: 15px 25px;
        color: rgba(0, 0, 0, 0.65);
        display: flex;
        justify-content: space-between;
    }
    .mess-li p span:first-child /deep/ b{
        font-weight: normal;
    }
    .mess-li p span:last-child{
        color:rgba(0,0,0,0.45);
    }
    /deep/ .el-select .el-input .el-select__caret{
        line-height: 30px;
    }

    @media screen and (max-width: 1420px) {

        /deep/ .el-button {
            min-width: 62px;
        }
    }

</style>
