<template>
    <div>
        <el-dialog
            title="监播图片详情"
            :visible.sync="dialogVisible"
            @open="getImageDetails()"
            :show-close="false"
            :close-on-click-modal="false"
            custom-class="custom-dialog-wrapper registration-media"
            :width="imgsWidth">
            <div class="audit-title">
                <span>{{`${auditImageData.resName} （${auditImageData.mediaName}）`}}</span>
                <el-tag :hit="true" :type="auditImageData.auditStatus === 0 ? 'success' : 'warning' ">
                    {{auditImageData.auditStatus === 0 ? '未审核' : '已审核'}}
                </el-tag>
                <el-tag :hit="true" :type="auditImageData.auditResult === 0 ? 'success' : 'danger' ">
                    {{auditImageData.auditResult === 0 ? '不合格' : '合格'}}
                </el-tag>
            </div>
            <div class="audit-info">
                <el-tag type="info" style="color: #000">{{auditImageData.districtName || '--'}}</el-tag>
                <el-tag type="info" style="color: #000">{{`${auditImageData.asLab}面` || '--'}}</el-tag>
                <el-tag type="info" style="color: #000">{{auditImageData.assetTag || '--'}}</el-tag>
            </div>

            <div class="audit-box">
                <div class="audit-img" v-for="(item, index) in imageDetails.slice((currentPage-1)*pageSize, currentPage*pageSize)" :key="index">
                    <img style="" @click="toOpenImage(item.pURL)" :src="item.thumbnailURL">
                    <div class="audit-detail">
                        <div class="left">
                            <div class="tag" >
                                <i class="el-icon-date"></i>
                                <span>上传时间:&nbsp;</span>
                                <el-tooltip v-if="item.pUTime" effect="dark" :content="item.pUTime" placement="top-end" :open-delay="1500">
                                    <span>{{item.pUTime}}</span>
                                </el-tooltip>
                                <span v-else>--</span>
                            </div>
                            <div class="tag">
                                <i class="el-icon-user"></i>
                                <span>上传人员:&nbsp;</span>
                                <span>{{item.realname || '--'}}</span>
                            </div>
                        </div>
                        <div class="right">
                            <el-button type="primary" @click="addProblem(item.imgUrl)">添加问题</el-button>
                        </div>
                    </div>
                </div>
            </div>

            <el-pagination
                background
                layout="prev, pager, next"
                :current-page.sync="currentPage"
                :page-size.sync="pageSize"
                :hide-on-single-page="imgListLength > 4 ? false : true"
                :total="imgListLength"
                style="text-align: right">
            </el-pagination>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">关 闭</el-button>
                <el-button @click="toLastOne()">上一个</el-button>
                <el-button @click="toNextOne()" type="primary">下一个</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="添加问题"
            :visible.sync="addProblemVisible"
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
                            :autosize="{ minRows: 2, maxRows: 6}"
                            v-model="textarea"
                            :disabled="isClose">
                        </el-input>
                    </div>
                </div>
                <img class="add-right" :src="imgUrl">
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toResetProblem()">取 消</el-button>
                <el-button type="primary" @click="toSubmitProblem()">提 交</el-button>
            </span>
        </el-dialog>

        <div class="image-box">
            <el-dialog
                :visible.sync="imageVisible"
                :close-on-click-modal="true"
                :show-close="false"
                width="605px">
                <img :src="imgUrl">
            </el-dialog>
        </div>
    </div>
</template>

<script>
import api from '../../../api/api.js'
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
            currentPage: 1,
            pageSize: 4,

            radio: '',
            textarea: '',
            isClose: true,
            isHide: true,
            dialogWidth: 0,
            imageVisible: false,
            addProblemVisible: false,
            imgUrl: '',
            imageDetails: []
        }
    },
    computed: {
        imgListLength() {
            console.log(this.imageDetails.length);
            return this.imageDetails.length || 0
        },
        imgsWidth() {
            const length = this.imageDetails.length
            if(length && length > 4) {
                return '1560px'
            } else {
                return (length*384+24) + 'px'
            }
        }
    },
    methods:{
        getImageDetails() {
            // console.log('auditImageData', this.auditImageData);
            api.getApi('/addsp/api/v1/audit/imageDetails', {
                lID: this.auditImageData.lID
            })
            .then((res) => {
                if(res.data.SysCode === 200200) {
                    const resData = res.data.data
                    this.imageDetails  = resData || []
                    console.log('imageDetails', this.imageDetails);
                } else {
                    this.$message({
                        type: "warning",
                        message: res.data.MSG || "监播照片详情数据获取异常！",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        },
        // 点击提交问题
        toSubmitProblem() {
            if(this.radio === '') {
                this.$confirm('未选择问题类型，请选择后重新提交', '提交失败', {
                    showCancelButton: false,
                    showClose: false,
                    confirmButtonText: '好 的',
                    type: 'error'
                })
            } else if(this.radio === '5' && this.textarea === '') {
                this.$confirm('未描述具体问题，请填写后重新提交', '提交失败', {
                    showCancelButton: false,
                    showClose: false,
                    confirmButtonText: '好 的',
                    type: 'error'
                })
            } else {
                this.$message({
                    showClose: false,
                    message: '添加问题成功',
                    type: 'success'
                });
                this.toResetProblem()
            }
        },
        // 重置添加问题
        toResetProblem() {
            this.addProblemVisible = false
            this.radio = ''
            this.textarea = ''
        },
        // 点击添加问题
        addProblem(imgUrl) {
            this.imgUrl = imgUrl
            this.addProblemVisible = true
        },
        // 控制文本框是否禁用
        radioChange() {
            if(this.radio === '5') {
                this.isClose = false
            } else {
                this.isClose = true
            }
        },

        // 根据传过来的id加减1发送请求
        toLastOne() {
            // this.$emit('toLastId', this.auditImageData.id)
            console.log('上一个');
        },
        toNextOne() {
            // this.$emit('toNextId', this.auditImageData.id)
            console.log('下一个');
        },
        handleClose () {
            this.$emit("update:dialogVisible", false)
        },
        toOpenImage(imgUrl) {
            this.imgUrl = imgUrl
            this.imageVisible = true
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

.audit-box {
    display: flex;
    justify-content: space-between;
    margin: 24px 0;

    .audit-img {
        > img {
            width: 360px;
            height: 480px;
        }
    }

    .audit-detail {
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        width: 360px;
        height: 72px;
        margin-top: 8px;
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
    justify-content: flex-start;
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
        margin-left: 23px;
    }
}


/deep/ .el-tag {
    font-size: 12px;
    font-weight: normal;
    margin-right: 8px;
    line-height: 25px;
    height: 27px;
}

/deep/ .el-dialog__title {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
}

/deep/ .el-dialog__body {
    padding: 30px 24px;
}

.image-box {
    img {
        width: 564px;
        height: 752px;
    }
    /deep/ .el-dialog__header {
        display: none;
    }
    /deep/ .el-dialog__body {
        padding: 30px 20px;
    }
}
</style>
