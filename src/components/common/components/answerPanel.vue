<template>
    <div class="answer-panel">
        <div class="title">
            <h5 v-html="answerData.title"></h5>
            <el-button @click="backToList">返回</el-button>
        </div>
        <div class="answer" v-html="answerData.answer"></div>
    </div>
</template>

<script>
    export default {
        name: "answerPanel",
        props: {
            answerData: {
                type: Object,
                default: {}
            },

        },
        data(){
            return{
                componentType:0
            }

        },
        methods: {
            backToList() {
                let type = JSON.parse(sessionStorage.getItem('questionInfo')).fromPage
                this.componentType = type=='search'?3:1
                this.$emit("callbackComponentType", this.componentType)
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .answer-panel {
        padding: 32px;
    }

    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }

    .title h5 {
        color: rgba(0, 0, 0, 0.85);
        font-size: 20px;
        font-weight: bold;
    }

    .title button {
        width: 74px;
        height: 32px;
    }

    .answer {
        font-size: 15px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
    }
    .answer /deep/ p{
        margin-bottom: 12px;
    }
    .answer /deep/ ul{
        list-style: unset;
    }
    .answer /deep/ img{
        max-width: 100%;
    }
    .answer /deep/ table{
        width: 100%;
    }
    .answer /deep/ tr{
        height: 40px;
    }
    .answer /deep/ a{
        color: #1890ff;
    }
    .answer /deep/ video{
        width: 100%;
    }
    .answer /deep/ video:focus{
        outline: none;
    }
    .answer /deep/ ul li{
        line-height: 24px;
    }


    /*!*滚动条*!*/
    .answer::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    }

    .answer::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 4px;
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }

    .answer::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
        border-radius: 0;
        background: #fafafa;
    }
</style>
