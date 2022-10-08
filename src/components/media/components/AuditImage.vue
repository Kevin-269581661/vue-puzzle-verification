<template>
    <div>
        <el-dialog
            title="监播图片详情"
            :visible.sync="dialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            custom-class="custom-dialog-wrapper registration-media"
            :width="832+'px'">
            <div class="audit-title">
                <span>{{`${auditImageData.reportCommunity} （${auditImageData.mediaName}）`}}</span>
                <el-tag :hit="true" :type="auditImageData.auditStatus === 0 ? 'success' : 'warning' ">
                    {{auditImageData.auditStatus === 0 ? '已审核' : '未审核'}}
                </el-tag>
                <el-tag :hit="true" :type="auditImageData.auditResult === 0 ? 'success' : 'danger' ">
                    {{auditImageData.auditResult === 0 ? '合格' : '不合格'}}
                </el-tag>
            </div>
            <div class="audit-info">
                <el-tag type="info" style="color: #000">{{auditImageData.reportArea || '--'}}</el-tag>
                <el-tag type="info" style="color: #000">{{auditImageData.launchFace || '--'}}</el-tag>
                <el-tag type="info" style="color: #000">{{auditImageData.assetNumber || '--'}}</el-tag>
            </div>

            <div class="audit-images" ref="imgRef">
                <div class="audit-img" v-for="(item, index) in auditImageData.imageList" :key="index">
                    <div style="width:384px; height:512px; background-color:skyblue;"></div>
                    <div class="audit-box">
                        <div class="left">
                            <div class="tag" v-if="item.uploadTime">
                                <el-tooltip effect="dark" :content="item.uploadTime" placement="top-end">
                                    <i class="el-icon-date"></i>
                                    <span>上传时间：{{item.uploadTime}}</span>
                                </el-tooltip>
                            </div>
                            <div class="tag" v-else>
                                <i class="el-icon-date"></i>
                                <span>上传时间：--</span>
                            </div>
                            <div class="tag">
                                <i class="el-icon-user"></i>
                                <span>上传人员：{{item.uploader || '--'}}</span>
                            </div>
                        </div>
                        <div class="right">
                            <el-button type="primary" @click="addDialogVisible = true">添加问题</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">关 闭</el-button>
                <el-button @click="toLastOne()">上一个</el-button>
                <el-button @click="toNextOne()" type="primary">下一个</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="添加问题"
            :visible.sync="addDialogVisible"
            width="751px">
            <div class="add-box">
                <div class="add-left">
                    <el-alert
                        style="width:89%; margin:16px; padding:9px 16px;"
                        :closable="false"
                        title="请勾选有问题的地方"
                        type="warning"
                        show-icon>
                    </el-alert>
                    <div class="radio-box">
                        <span>请选择问题类型</span>
                        <el-radio-group v-model="radio" @change="radioChange()">
                            <el-radio label="1">图片/素材不匹配</el-radio>
                            <el-radio label="2">夜景图亮度不满足要求</el-radio>
                            <el-radio label="3">报头日期不匹配</el-radio>
                            <el-radio label="4">绑门/锁门</el-radio>
                            <el-radio label="5">其他</el-radio>
                        </el-radio-group>

                        <span>请简单描述下问题</span>
                        <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="textarea"
                            :disabled="isClose">
                        </el-input>
                    </div>
                </div>
                <div class="add-right"></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addDialogVisible = false">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'auditImage',
    props: {
        dialogVisible: {
            type: Boolean,
            default: () => false,
        },
        auditImageData: {
            type: Object,
            default: () => {}
        }
    },
    data(){
        return {
            radio: '',
            textarea: '',
            isClose: true,
            dialogWidth: 0,
            addDialogVisible: false
        }
    },
    mounted() {
        console.log('auditImage', this.auditImageData);
    },
    methods:{
        radioChange() {
            if(this.radio === '5') {
                this.isClose = false
            } else {
                this.isClose = true
            }
        },
        // 根据传过来的id加减1发送请求
        toLastOne() {
            // const cilentWidth = this.$refs.imgRef.children[0].clientWidth
            console.log('上一个');
        },
        toNextOne() {
            console.log('下一个');
        },
        handleClose () {
            this.$emit("update:dialogVisible", false)
        },
    }
}
</script>

<style lang="scss" scoped>
.audit-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    color: #000;
    margin-bottom: 12px;
}

.audit-images {
    display: flex;
    margin-top: 26px;

    .audit-img {
        margin-right: 24px;
    }

    .audit-box {
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        width: 384px;
        height: 72px;
        margin-top: 16px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        padding: 6px;

        .left {
            .tag {
                line-height: 22px;
                color: #000;
                margin: 2px 8px 2px 0px;
            }
        }
    }
}

.add-box {
    display: flex;
    justify-content: space-around;
    .add-left {
        width: 296px;
        height: 512px;
        background: #FFFFFF;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;

        .radio-box {
            padding: 0px 17px;
            /deep/ .el-radio-group {
                display: flex;
                flex-direction: column;
                .el-radio {
                    margin: 6px 0;
                    font-size: 14px;
                    color: #000;
                }
            }

            span {
                line-height: 40px;
                font-size: 16px;
                color: #000;
                font-weight: 600;
            }

        }
    }

    .add-right {
        width:384px;
        height:512px;
        background-color:skyblue;
    }
}


/deep/ .el-tag {
    font-size: 14px;
    font-weight: normal;
    margin-right: 8px;
    line-height: 25px;
    height: 27px;
}

/deep/ .el-dialog__title {
    font-weight: 600;
    color: #000;
    font-size: 16px;
}
</style>
