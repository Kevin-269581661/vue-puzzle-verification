<template>
    <div class="list-wrap">
        <el-radio-group v-model="checked" @change="radioChange">
            <el-radio-button label="应用市场"></el-radio-button>
            <el-radio-button label="公告通知"></el-radio-button>
        </el-radio-group>
        <el-carousel ref="carousel" :autoplay="false" :loop="true" arrow="never" indicator-position="none" class="carousel-box"  :height="height" @change='carouselChange'>
            <el-carousel-item class="flex-v">
                <img class="index-banner" alt="" src="/static/images/appBanner.png" @click="goToPage({link: 'https://apps.qinlinad.com/OKR.html', name: 'OKR'})" />
                <ul class="app-list">
                    <li class="app-item" v-for="(item, index) in appCenter" @click="goToPage(item)" :key="index">
                        <div class="item-left">
                            <img :src="item.imgUrl" alt="">
                        </div>
                        <div class="item-right">
                            <span class="app-name">{{item.title}}</span>
                            <!-- <el-tooltip popper-class="desc-tooltip" effect="dark" :content="item.desc" v-model="item.descTooltip"> -->
                                <p class="app-desc" :title="item.desc">{{item.desc}}</p>
                            <!-- </el-tooltip> -->
                        </div>
                    </li>
                </ul>
            </el-carousel-item>
            <el-carousel-item class="flex-v">
                <img class="index-banner" alt="" src="/static/images/noticeBanner.png" />
                <ul class="app-list">
                    <li class="app-item" v-for="(item, index) in tableSource" :key="index">
                        <div style="position: relative; width: 100%;" @click="catDetail(item)">
                            <div class="notice-head">
                                <span class="notice-title">{{item.title || ''}}</span>
                                <span class="notice-date">{{item.createTime.split(' ')[0] || ''}}</span>
                            </div>
                            <div class="notice-content">
                                {{item.content || ''}}
                                <!-- <span class="notice-cat" @click="catDetail(item)">查看</span> -->
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
                checked: '应用市场',
                tableSource: [],
                dialogVisible: false,
                currentRow: {}
            }
        },
        methods: {
            catDetail(item) {
                this.currentRow = item;
                this.dialogVisible = true
            },
            goToPage(item) {
                this.$emit('goToPage', item)
            },
            radioChange(val) {
                if(val === '公告通知') {
                    this.$refs.carousel.setActiveItem(1)
                } else {
                    this.$refs.carousel.setActiveItem(0)
                }
            },
            carouselChange(val) {
                if(val == 1 && this.checked == '应用市场') {
                    this.checked = '公告通知'
                } else if(val == 0 && this.checked == '公告通知') {
                    this.checked = '应用市场'
                }
            },
            getNoticeList() {
                let sessionData = sessFun.getSess();
                api.getApi(this.apiVar.Advertisement+'/GetSystemNotice', {
                    uid: sessionData.uID,
                    token: sessionData.token,
                    pageNum: 1,
                    pagesize: 100
                }).then(res =>{
                    if(!res.data.SysCode){
                        let dataInfo = res.data;
                        // this.totalNum = dataInfo.count;
                        this.tableSource = dataInfo || [];
                        // this.tableSource = this.tableSource.concat(dataInfo || []);
                    }else{
                        this.$message.warning(res.data.MSG);
                    }
                });
            }
        },
        mounted() {
            this.getNoticeList()
        }
    }
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    width: 4px;
    background: #fafafa;
}
::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    background: #fafafa;
    border-radius: 4px;
}
.flex-v {
    display: flex; 
    flex-direction: column;
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
    padding: 16px 24px 0;
    box-sizing: border-box;
    /deep/ .el-radio-button__inner {
        padding: 8px 16px
    }
    .carousel-box {
        width: 100%;
        height: inherit;
        padding: 16px 0 0;
        overflow: hidden;
        .index-banner {
            width: 100%;
            padding: 0 0 8px;
            box-sizing: border-box;
            cursor: pointer;
        }
        .app-list:hover {
            overflow-y: auto;
        }
        .app-list {
            overflow-y: hidden;
            overflow-x: hidden;
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
                .item-left {
                    img {
                        width: 48px;
                        height: 48px;
                        margin-right: 12px;
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
        }
    }
}
</style>
