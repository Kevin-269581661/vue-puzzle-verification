<template>
    <div class="list-wrap">
        <el-radio-group v-model="checked" @change="radioChange">
            <el-badge :value="messageUnread" :max="99" class="item">
                <el-radio-button label="0">消息通知</el-radio-button>
            </el-badge>
            <el-radio-button label="1">应用市场</el-radio-button>
            <el-radio-button label="2">公告通知</el-radio-button>
        </el-radio-group>
        <el-carousel ref="carousel" :autoplay="false" :loop="false" arrow="never" indicator-position="none" class="carousel-box"  :height="height" @change='carouselChange'>
            <el-carousel-item class="flex-v">
                <ul class="app-list message-list" v-infinite-scroll="getMessageList" infinite-scroll-delay="800" infinite-scroll-distance="50">
                    <li class="app-item" v-for="(item, index) in messageList" :key="index">
                        <div class="app-item__wrap" @click="readed(item)">
                            <div class="notice-head">
                                <span class="notice-title">{{item.title || ''}}</span>
                            </div>
                            <div class="notice-content" v-html="item.messagePart1 || ''"></div>
                            <div class="time-distance">{{timestampFormat(item.createTime)}}</div>
                            <div v-if="item.status==0" class="dot-badge"></div>
                        </div>
                    </li>
                </ul>
                <div class="btn-group__bottom">
                    <span class="btn-item" @click="readAll">一键已读</span>
                    <div class="divide-vertical"></div>
                    <span class="btn-item" @click="goMessageList">消息列表</span>
                </div>
            </el-carousel-item>
            <el-carousel-item class="flex-v">
                <img class="index-banner" alt="" src="/static/images/appBanner.png" @click="goToPage({link: 'https://apps.qinlinad.com/OKR.html', name: 'OKR'})" />
                <ul class="app-list">
                    <li class="app-item" v-for="(item, index) in appCenter" @click="goToPage(item)" :key="index">
                        <div class="item-left">
                            <img :src="item.imgUrl" alt="">
                        </div>
                        <div class="item-right">
                            <span class="app-name">{{item.title}}</span>
                                <p class="app-desc" :title="item.desc">{{item.desc}}</p>
                        </div>
                    </li>
                </ul>
            </el-carousel-item>
            <el-carousel-item class="flex-v">
                <img class="index-banner" alt="" src="/static/images/noticeBanner.png" />
                <ul class="app-list">
                    <li class="app-item" v-for="(item, index) in tableSource" :key="index">
                        <div @click="catDetail(item)">
                            <div class="notice-head">
                                <span class="notice-title">{{item.title || ''}}</span>
                                <span class="notice-date">{{item.createTime.split(' ')[0] || ''}}</span>
                            </div>
                            <div class="notice-content">
                                {{item.content || ''}}
                            </div>
                        </div>
                    </li>
                </ul>
            </el-carousel-item>
        </el-carousel>
        <!-- 查看公告 -->
        <el-dialog
            :visible.sync="dialogVisible"
            :show-close="false"
            width="30%"
            custom-class="notice-dialog">
            <span class="content">{{currentRow.content || ''}}</span>
            <div slot="title">
                <span class="title">{{currentRow.title || ''}}</span>
                <div class="date">{{currentRow.createTime || ''}}</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="dialogVisible = false">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import sessFun from '../../../commonFun/sessFun.js';
    import timeFormat from '../../../commonFun/timeFormat'
    import {api} from '../../../api/api';
    export default {
        name: "messageAndApp",
        props: {
            appCenter:{
                type: [Object, String, Array],
                default: ()=>{}
            },
            height: {
                type: String,
                default: 'inherit'
            }
        },
        data() {
            return {
                checked: '0',
                tableSource: [],
                dialogVisible: false,
                currentRow: {},
                messagePageNum: 1,
                messageTotalPage: 1,
                messageList: [],
                messageUnread: 0
            }
        },
        mounted() {
            this.getUnreadCount()
            this.getNoticeList()
        },
        methods: {
            timestampFormat(createTime) {
                return timeFormat.timestampFormat(createTime)
            },
            catDetail(item) {
                this.currentRow = item;
                this.dialogVisible = true
            },
            goToPage(item) {
                this.$emit('goToPage', item)
            },
            radioChange(val) {
                this.$refs.carousel.setActiveItem(val)
            },
            carouselChange(val) {
                this.checked = val
            },
            // 消息通知
            getMessageList() {
                if(this.messageTotalPage<this.messagePageNum) return
                let info = {
                    pageSize: 10,
                    pageNum: this.messagePageNum,
                };
                api.getApi(this.apiVar.system + '/list', info).then(res => {
                    if (res.data.SysCode == 200200) {
                        this.messageList = this.messageList.concat(res.data.data.dataList||[])
                        this.messagePageNum++
                        this.messageTotalPage = res.data.data.totalPage||0
                    }
                })
            },
            // 查询全部和未读条数
            getUnreadCount() {
                api.getApi(this.apiVar.system + '/unreadCount').then(res => {
                    if (res.data.SysCode == 200200) {
                        this.messageUnread = res.data.data.unreadCount||0
                    }
                })
            },
            // 单个已读
            readed(item) {
                api.postApi(this.apiVar.system + '/readMessage', {messageId: item.messageId}).then(res => {
                    if (res.data.SysCode == 200200) {
                        item.status = 1
                        setTimeout(() => {
                            this.getUnreadCount()
                        }, 500)
                    }
                })
            },
            // 全部已读
            readAll() {
                api.postApi(this.apiVar.system + '/readAllMessage').then(res => {
                    if (res.data.SysCode == 200200) {
                        for(let data of this.messageList){
                            data.status =1
                        }
                        this.getUnreadCount()
                    } else {
                        this.$message.warning(res.data.MSG);
                    }
                })
            },
            // 跳转消息列表
            goMessageList() {
                if (this.$route.path.includes('/f_develop')) {
                    this.$router.push('/f_develop/messageList')
                } else {
                    this.$router.push('/messageList')
                }
            },
            // 公告通知
            getNoticeList() {
                let sessionData = sessFun.getSess();
                api.getApi(this.apiVar.Advertisement+'/GetSystemNotice', {
                    uid: sessionData.uID,
                    token: sessionData.token,
                    pageNum: 1,
                    pagesize: 100
                }).then(res =>{
                    if(!res.data.SysCode){
                        this.tableSource = res.data || [];
                    }else{
                        this.$message.warning(res.data.MSG);
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    display: none;
}
:hover::-webkit-scrollbar {
    display: block;
}
::-webkit-scrollbar {
    width: 4px;
    background: #fafafa;
}
::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    background: #fafafa;
    border-radius: 4px;
}
.flex-v {
    display: flex; 
    flex-direction: column;
    .btn-group__bottom {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: stretch;
        justify-content: space-evenly;
        background: #fff;
        box-sizing: border-box;
        height: 48px;
        border-radius: 0px 0px 4px 4px;
        border-top: 1px solid #E8E8E8;
        font-size: 14px;
        color: #1890FF;
        .divide-vertical {
            width: 1px;
            height: 100%;
            background: rgba(0, 0, 0, 0.1);
        }
        .btn-item {
            width: 100%;
            line-height: 48px;
            text-align: center;
            cursor: pointer;
        }

    }
}
/deep/ .notice-dialog {
    .el-dialog__header {
        padding: 16px 24px 6px;
        .title {
            height: 24px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            line-height: 24px;
        }
        .date {
            float: right;
            height: 24px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.45);
            line-height: 24px;
        }
    }
    .el-dialog__body {
        padding: 6px 24px 14px;
    }
    .content {
        height: 200px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 20px;
    }
}
.list-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 16px 0 0 0;
    box-sizing: border-box;
    /deep/ .el-radio-button__inner {
        padding: 8px 16px
    }
    /deep/ .el-badge__content.is-fixed {
        z-index: 9;
    }
    .carousel-box {
        width: 100%;
        height: inherit;
        padding: 16px 0 0;
        overflow: hidden;
        .index-banner {
            width: 100%;
            padding: 0 24px 8px;
            box-sizing: border-box;
            cursor: pointer;
        }
        /* .app-list:hover {
            overflow-y: auto;
        } */
        .message-list {
            padding-left: 21px !important;
            padding-bottom: 48px !important;
        }
        .app-list {
            overflow-y: scroll;
            overflow-x: hidden;
            padding: 0 24px;
            .app-item:last-child {
                border-bottom: none;
            }
            .app-item {
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                padding: 12px 0;
                margin: 0;
                border-bottom: 1px solid #E9E9E9;
                cursor: pointer;
                .dot-badge {
                    position: absolute;
                    left: -3px;
                    top: 0;
                    box-sizing: border-box;
                    width: 8px;
                    height: 8px;
                    border-radius: 4px;
                    border: 1px solid #FFFFFF;
                    background: #FF4949;
                }
                .time-distance {
                    margin-top: 40x;
                    line-height: 22px;
                    font-size: 12px;
                    color: rgba(0, 0, 0, 0.45);
                }
                .item-left {
                    img {
                        width: 48px;
                        height: 48px;
                        margin-right: 15px;
                        border-radius: 8px;
                    }
                }
                .item-right {
                    display: flex;
                    flex-direction: column;
                    width: calc(100% - 60px);
                    .app-name {
                        margin-top: 2px;
                        line-height: 24px;
                        font-size: 16px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: rgba(0, 0, 0, 0.85);
                    }
                    .app-desc {
                        margin-top: 2px;
                        overflow: hidden;
                        white-space: nowrap;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: rgba(0, 0, 0, 0.65);
                        line-height: 18px;
                        text-overflow: ellipsis;
                    }
                }
                .notice-head {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .notice-title {
                    font-size: 16px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: rgba(0, 0, 0, 0.85);
                    line-height: 24px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .notice-date {
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.45);
                    line-height: 24px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .notice-content {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    display: -webkit-box;
                    margin-top: 6px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.65);
                    line-height: 18px;
                }
                .notice-cat {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #1890FF;
                    line-height: 18px;
                }
            }
            .app-item__wrap {
                position: relative;
                width: 100%;
                margin-left: 3px;
            }
        }
    }
}
</style>
