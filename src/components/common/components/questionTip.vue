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
                <li class="modal-list" v-for="(item,index) in modalInfo.question" :key="index" @click="goQuestionPage(item)">
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
                            question:[
                                {
                                    "index":"2-1",
                                    "id":"5",
                                    "path":"媒体操作 > 媒体模块/媒体操作",
                                    "title":"多录的、重复的、录错的媒体资源能否进行删除？",
                                    "answer":"<p>可以删除。可通过【媒体管理】→【操作】→【删除】的步骤对媒体资源进行删除。</br>注意事项：</p><ul><li>目前的删除功能暂不支持删除已被方案或订单使用的点位；</li><li>若是被方案使用的点位，可以从方案中将点位移除，再进行删除操作；</li><li>订单中的点位，即使点位被终止了，也无法对该点位进行删除；</li><ul><br/><img src='../../../../static/images/qna_2.1.1.png' alt=''>"
                                },
                            ]
                        }
                        break;
                    }
                    case 2: {
                        this.modalInfo = {
                            type: '方案',
                            title: '方案相关疑问',
                            question:[
                                {
                                    "id":"5",
                                    "path":"媒体操作 > 媒体模块/媒体操作",
                                    "title":"多录的、重复的、录错的媒体资源能否进行删除？",
                                    "answer":"<p>可以删除。可通过【媒体管理】→【操作】→【删除】的步骤对媒体资源进行删除。</br>注意事项：</p><ul><li>目前的删除功能暂不支持删除已被方案或订单使用的点位；</li><li>若是被方案使用的点位，可以从方案中将点位移除，再进行删除操作；</li><li>订单中的点位，即使点位被终止了，也无法对该点位进行删除；</li><ul><br/><img src='../../../../static/images/qna_2.1.1.png' alt=''>"
                                },
                            ]
                        }
                        break;
                    }
                    case 3: {
                        this.modalInfo = {
                            type: '订单',
                            title: '订单相关疑问',
                            question:[
                                {
                                    "id":"5",
                                    "path":"媒体操作 > 媒体模块/媒体操作",
                                    "title":"多录的、重复的、录错的媒体资源能否进行删除？",
                                    "answer":"<p>可以删除。可通过【媒体管理】→【操作】→【删除】的步骤对媒体资源进行删除。</br>注意事项：</p><ul><li>目前的删除功能暂不支持删除已被方案或订单使用的点位；</li><li>若是被方案使用的点位，可以从方案中将点位移除，再进行删除操作；</li><li>订单中的点位，即使点位被终止了，也无法对该点位进行删除；</li><ul><br/><img src='../../../../static/images/qna_2.1.1.png' alt=''>"
                                },
                            ]
                        }
                        break;
                    }
                    case 4: {
                        this.modalInfo = {
                            type: '账号',
                            title: '账号相关疑问',
                            question:[
                                {
                                    "id":"5",
                                    "path":"媒体操作 > 媒体模块/媒体操作",
                                    "title":"多录的、重复的、录错的媒体资源能否进行删除？",
                                    "answer":"<p>可以删除。可通过【媒体管理】→【操作】→【删除】的步骤对媒体资源进行删除。</br>注意事项：</p><ul><li>目前的删除功能暂不支持删除已被方案或订单使用的点位；</li><li>若是被方案使用的点位，可以从方案中将点位移除，再进行删除操作；</li><li>订单中的点位，即使点位被终止了，也无法对该点位进行删除；</li><ul><br/><img src='../../../../static/images/qna_2.1.1.png' alt=''>"
                                },
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
                if(item){
                    let obj ={
                        'fromPage':'fastMenu',
                        'question':item?item:'',
                    }
                    sessionStorage.setItem('questionInfo',JSON.stringify(obj))
                }
                if (!this.$route.path.includes('questionAndAnswer')) {
                    //不是消息列表页
                    // console.log(this.$route.path.split('/'));
                    let str = this.$route.path.split('/').length > 2 ? this.$route.path.substring(0, this.$route.path.lastIndexOf('/') + 1) + 'questionAndAnswer' : this.$route.path + '/questionAndAnswer'
                    // console.log(str);
                    this.$router.push(str)
                }else{
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
    .question-pop{
        width: 124px !important;
        padding: 0 !important;
        border: none !important;
        top: 50px !important;
    }
</style>
