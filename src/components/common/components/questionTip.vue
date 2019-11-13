<template>
    <div class="questionTip">
        <!--<i slot="reference" class="el-icon-question" @click="showActions"></i>-->
        <div class="tip-wrap" v-if="isShowTip" @click="hideTip">
            <p>有问题？看这里！</p>
        </div>
        <!--<ul class="tip-ul" v-if="isShowActions">-->
        <!--<li class="tip-list" v-for="(item,index) in actionList" :key="index" @click="showModal(item.value)">{{item.name}}</li>-->
        <!--</ul>-->
        <el-popover
            popper-class="question-pop"
            :visible-arrow="false"
            placement="bottom"
            width="200"
            trigger="click"
        >
            <ul class="tip-ul">
                <li class="tip-list" v-for="(item,index) in actionList" :key="index" @click="showModal(item.value)">
                    {{item.name}}
                </li>
            </ul>
            <i slot="reference" class="el-icon-question" @click="showActions"></i>
        </el-popover>
        <!--问题列表对话框-->
        <el-dialog class="question-dialog" :title="modalInfo.title" :visible.sync="dialogTableVisible" width="35%">
            <ul>
                <li class="modal-list" v-for="(item,index) in modalInfo.question" :key="index"
                    @click="goQuestionPage(item)">
                    {{item.title}}
                </li>
                <li class="modal-list" @click="goQuestionPage">更多{{modalInfo.type}}相关问题……</li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "questionTip",
        data() {
            return {
                isShowTip: false,
                // isShowActions: false,
                actionList: [{name: '媒体相关疑问', value: 1}, {name: '方案相关疑问', value: 2}, {
                    name: '订单相关疑问',
                    value: 3
                }, {name: '账号相关疑问', value: 4}, {name: '其他模块疑问', value: 5}],
                modalInfo: {
                    type: '',
                    title: '',
                    list: [],
                },
                dialogTableVisible: false
            }
        },
        methods: {
            showActions() {
                this.isShowTip = false
                // this.isShowActions = !this.isShowActions
            },
            hideTip() {
                this.isShowTip = false
            },
            showModal(value) {
                // this.isShowActions = false
                this.dialogTableVisible = true
                switch (value) {
                    case 1: {
                        this.modalInfo = {
                            type: '媒体',
                            title: '媒体相关疑问',
                            question: [
                                {
                                    "index": "2-1",
                                    "id": "5",
                                    "path": "媒体操作 > 媒体模块/媒体操作",
                                    "title": "多录的、重复的、录错的媒体资源能否进行删除？",
                                    "answer": "<p>可以删除。可通过【媒体管理】→【操作】→【删除】的步骤对媒体资源进行删除。</br>注意事项：</p><ul><li>目前的删除功能暂不支持删除已被方案或订单使用的点位；</li><li>若是被方案使用的点位，可以从方案中将点位移除，再进行删除操作；</li><li>订单中的点位，即使点位被终止了，也无法对该点位进行删除；</li><ul><br/><img src='../../../../static/images/qna_2.1.1.png' alt=''>"
                                }, {
                                    "index": "2-2",
                                    "id": "16",
                                    "path": "媒体模块 > 新建媒体",
                                    "title": "媒体等级如何进行设置？",
                                    "answer": "<p媒体等级与刊例价相关联。</p><ul><li><p>当刊例价设为“不使用媒体分层”时，创建/编辑媒体资源的时候，将不存在媒体等级这一项选择；</p></br><img src='../../../../static/images/qna_2.2.8_1.png' alt=''></br><img src='../../../../static/images/qna_2.2.8_2.png'></li><li><p>当刊例价设为“采用媒体分层”时，系统会根据刊例价设置中的“媒体级别条件设置”与“媒体分级占比设置”，自动根据小区填写的资源户数、楼盘价格等数据对媒体等级进行分级，也可在创建/编辑媒体资源时，手动进行修改；</p></br><img src='../../../../static/images/qna_2.2.8_3.png' alt=''></br><img src='../../../../static/images/qna_2.2.8_4.png'></br><img src='../../../../static/images/qna_2.2.8_5.png'></li></ul>"
                                },
                                {
                                    "index": "2-2",
                                    "id": "18",
                                    "path": "新建媒体 > 新建媒体",
                                    "title": "为何提示媒体创建失败？",
                                    "answer": "<p>请先检查资源及媒体的必填字段（每个必填字段左侧会有红色“*”号提示）是否已经填写及各个字段是否超过字数限制，具体字段限制如下图：</p></br><table border='1' bordercolor='#000' cellpadding='10px' style='border-collapse:collapse;text-align:center'><tr><td>资源类型</td><td>必填</td></tr><tr><td>资源名称</td><td>限制40个字符，同一所属公司的所有小区里不能有重复</td></tr><tr><td>所属城市</td><td>必填</td></tr><tr><td>所属区域</td><td>必填</td></tr><tr><td>所属商圈</td><td>限制40个字符</td></tr><tr><td>具体地址</td><td>限制70个字符</td></tr><tr><td>楼盘类型</td><td>必填</td></tr><tr><td>出入口数</td><td>限制字数1~20</td></tr><tr><td>楼栋数量</td><td>必填，限制数字1~9999999</td></tr><tr><td>楼栋数量</td><td>必填，限制数字1~9999999</td></tr><tr><td>楼盘价格</td><td>必填，限制数字1~9999999</td></tr><tr><td>入住年份</td><td>必填</td></tr><tr><td>经纬度</td><td>必填，经度只能输入1-180，纬度只能输入0-90</td></tr><tr><td>所属物业</td><td>限制20个字符</td></tr><tr><td>媒介载体</td><td>必填</td></tr><tr><td>媒体名称</td><td>必填，限制40个字符，同一小区里不能有重复</td></tr><tr><td>可投数面</td><td>必填，1-26，但前端只显示A面和B面</td></tr><tr><td>媒体状态</td><td>必填</td></tr><tr><td>资产编号</td><td>必填，限制40个字符，若状态为待安装，则资产编号不填，同一所属公司的所有小区里不能有重复</td></tr><tr><td>媒体类型</td><td>必填，限制20个字符</td></tr><tr><td>广告尺寸</td><td>必填，宽度1~9999999，高度1~9999999</td></tr><tr><td>可视画面</td><td>必填，宽度1~9999999，高度1~9999999</td></tr><tr><td>备注</td><td>限制200个字符</td></tr></table>"
                                }
                            ]
                        }
                        break;
                    }
                    case 2: {
                        this.modalInfo = {
                            type: '方案',
                            title: '方案相关疑问',
                            question: [
                                {
                                    "index": "4-1",
                                    "id": "22",
                                    "path": "方案模块 > 编辑/创建方案",
                                    "title": " 创建/编辑方案时，为什么通过导入小区/点位的方式进行选点会失败？",
                                    "answer": "<p>在使用导入小区/点位的方式进行选点时，提示导入失败的原因主要如下：</p><ul><li>表格内信息输入错误；</li><li>投放排期内点位被占用；</li><li>录入的点位已被禁用；</li><li>excel表里有重复的小区信息</li><li>表格的数据是引用格式，并非实际数值；</li><ul><img src='../../../../static/images/qna_4.1.1.png' alt=''>"
                                },
                                {
                                    "index": "4-1",
                                    "id": "23",
                                    "path": "方案模块 > 编辑/创建方案",
                                    "title": " 创建/编辑方案时，搜索不到点位是什么原因？",
                                    "answer": "<p>当搜索不到点位时，可能是以下原因造成：</p><ul><li>在所选排期内，被预锁的方案或订单占用；</li><li>点位状态非正常；</li><li>筛选条件选错，将点位过滤掉了；</li><ul>"
                                },
                                {
                                    "index": "4-2",
                                    "id": "29",
                                    "path": "方案模块 > 方案操作",
                                    "title": "方案能否删除？",
                                    "answer": "目前方案创建后暂不支持对方案进行删除。"
                                }
                            ]
                        }
                        break;
                    }
                    case 3: {
                        this.modalInfo = {
                            type: '订单',
                            title: '订单相关疑问',
                            question: [
                                {
                                    "index": "5-1",
                                    "id": "35",
                                    "path": "订单模块 > 订单操作",
                                    "title": "订单金额能否修改？",
                                    "answer": "不能，目前的订单金额无法进行修改，因此在发布订单时，建议确定好订单金额数。"
                                },
                                {
                                    "index": "5-1",
                                    "id": "37",
                                    "path": "订单模块 > 订单操作",
                                    "title": "订单能否删除？",
                                    "answer": "订单是交易记录的凭证，目前系统中无法对订单进行删除。"
                                },
                                {
                                    "index": "5-2",
                                    "id": "38",
                                    "path": "订单模块 > 监播报告",
                                    "title": "上/下/换刊报告导出的PPTX为什么打不开或打开是乱码？",
                                    "answer": "目前由于PPT格式的数据问题，系统暂时只支持PPTX格式的监播报告导出，而PPTX针对一些版本的Office会显示数据异常，若点击自动修复处理可能还会出现图片丢失的情况。建议使用WPS软件打开PPTX文件，WPS软件可无损打开PPTX，若客户需要PPT格式的文件，媒介可用WPS打开PPTX文件后，再通过“导出”功能，导出成PPT格式。"
                                },
                                {
                                    "index": "5-2",
                                    "id": "39",
                                    "path": "订单模块 > 监播报告",
                                    "title": "上/下刊报告能否按不同排期进行导出？",
                                    "answer": "不能，目前的上下刊报告暂无分排期导出报告的功能，建议在上传完图片，导出报告后，手动对PPT内容进行修改。"
                                }
                            ]
                        }
                        break;
                    }
                    case 4: {
                        this.modalInfo = {
                            type: '账号',
                            title: '账号相关疑问',
                            question: [
                                {
                                    "index": "7",
                                    "id": "43",
                                    "path": "账号相关",
                                    "title": "账号密码忘了，可否进行重置？",
                                    "answer": "<p>可以进行重置，请联系QADN微信客服，微信号：qadnKeFu。</p></br><img style='width:80%' src='../../../../static/images/qna_2.1.2.png' alt=''>"
                                },
                                {
                                    "index": "7",
                                    "id": "44",
                                    "path": "账号相关",
                                    "title": "如何修改账号密码？",
                                    "answer": "<p>操作步骤：登入账号→触碰右上角登入用户名称→【个人中心】→【密码设置】</p></br><img src='../../../../static/images/qna_7.3_1.png' alt=''></br><img src='../../../../static/images/qna_7.3_2.png' alt=''>"
                                },
                                {
                                    "index": "7",
                                    "id": "45",
                                    "path": "账号相关",
                                    "title": "登入账号时，提示“账号角色权限异常”是什么原因？",
                                    "answer": "这是工程人员权限的账号在电脑系统登入时才会弹出的提示。工程人员账号只可登入微信小程序——亲邻小助手。"
                                }
                            ]
                        }
                        break;
                    }
                    case 5: {
                        this.dialogTableVisible = false
                        this.goQuestionPage()
                    }

                }
            },
            goQuestionPage(item) {
                this.dialogTableVisible = false
                if (item) {
                    let obj = {
                        'fromPage': 'fastMenu',
                        'question': item ? item : '',
                    }
                    sessionStorage.setItem('questionInfo', JSON.stringify(obj))
                }
                if (!this.$route.path.includes('questionAndAnswer')) {
                    //不是消息列表页
                    // console.log(this.$route.path.split('/'));
                    let str = this.$route.path.split('/').length > 2 ? this.$route.path.substring(0, this.$route.path.lastIndexOf('/') + 1) + 'questionAndAnswer' : this.$route.path + '/questionAndAnswer'
                    // console.log(str);
                    this.$router.push(str)
                } else {
                    //是消息列表页 有空可用provide /inject
                    location.reload()
                }
            }
        },
        mounted() {
            let that = this
            this.isShowTip = true;
            setTimeout(() => {
                that.isShowTip = false;
            }, 10000)
        }
    }
</script>

<style scoped>
    .questionTip {
        position: relative;
    }

    .tip-ul {
        text-align: center;
        padding: 4px 0;
        background: rgba(68, 68, 68, 1);
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
    }

    .tip-list {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
        color: rgba(153, 153, 153, 1);
        line-height: 34px;
        cursor: pointer;
    }

    .tip-list:hover {
        color: #fff;
        background: rgba(54, 54, 54, 1);
    }

    .tip-wrap {
        width: 136px;
        height: 36px;
        font-size: 14px;
        text-align: center;
        line-height: 36px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.15);
        color: #666666;
        position: absolute;
        top: 55px;
        left: -53px;
        z-index: 999;
    }

    .tip-wrap::after {
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        left: 59px;
        top: -12px;
        border-width: 6px;
        border-style: solid;
        border-color: transparent transparent #fff transparent;
    }

    /deep/ .el-icon-question {
        cursor: pointer;
    }

    .question-dialog /deep/ .el-dialog__header {
        padding: 0 20px;
        border-bottom: 1px solid #e9e9e9;
    }

    .question-dialog /deep/ .el-dialog__body {
        padding: 16px 24px 24px;
    }

    .modal-list {
        height: 40px;
        line-height: 40px;
        background: rgba(247, 247, 246, 1);
        border-radius: 3px;
        margin-bottom: 12px;
        padding-left: 12px;
        box-sizing: border-box;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.85);
    }

    .modal-list:hover {
        color: #1890ff;
    }

    .modal-list:last-child {
        margin-bottom: 0;
    }

</style>
<style>
    .question-pop {
        width: 124px !important;
        padding: 0 !important;
        border: none !important;
        top: 50px !important;
    }
</style>
