<template>
    <div class="search-result">
        <h5>搜索结果</h5>
        <ul v-if="searchData.list.length>0">
            <li class="result-li" v-for="(item,index) in searchData.list" :key="index" @click="chooseQuestion(item.title)">
                <h6 v-html="item.title"></h6>
                <div class="answer" v-html="item.answer"></div>
                <p class="path">{{item.path}}</p>
            </li>
        </ul>
        <div class="not-found" v-else>
            <img src="../../../assets/images/nofound.png" alt="">
            <p>没找到“{{searchData.keyword}}”相关的问题</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "searchResult",
        props: {
            searchData: {
                type: Object,
                default: {}
            }
        },
        methods:{
            chooseQuestion(title){
                this.$emit("callbackResult", title)
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .search-result {
        padding: 32px;
        height: 100%;
        box-sizing: border-box;
    }
    .search-result h5{
        color:rgba(0,0,0,0.85);
        font-size: 20px;
        margin-bottom: 24px;
    }
    /deep/ .f-color {
        color: #1890ff;
        font-weight: inherit;
    }

    .answer {
        width: 100%;
        height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
    }
    .answer /deep/ a{
        color:rgba(0,0,0,0.85);
    }
    .result-li{
        background:rgba(247,247,246,1);
        margin-bottom: 16px;
        padding: 9px 12px;
        box-sizing: border-box;
    }
    .result-li h6{
        color: #333;
        font-size: 16px;
        margin-bottom: 4px;
        cursor: pointer;
        font-weight: bold;
    }
    .result-li h6:hover{
        color: #1890ff;
    }
    .result-li .answer{
        color:rgba(0,0,0,0.65);
        font-size: 14px;
        margin-bottom: 6px;
    }
    .result-li .path{
        font-size: 12px;
        color:rgba(0,0,0,0.25);
    }
    .not-found{
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .not-found img{
        width: 152px;
        height: 104px;
        margin-bottom: 16px;
    }
    .not-found p{
        color:rgba(0,0,0,0.25);
        font-size: 14px;
    }

</style>
