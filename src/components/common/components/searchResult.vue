<template>
    <div class="search-result">
        <h5>搜索结果</h5>
        <ul>
            <li class="result-li" v-for="(item,index) in searchData" :key="index" @click="chooseQuestion(item)">
                <h6 v-html="item.title"></h6>
                <div class="answer" v-html="item.answer"></div>
                <p class="path">{{item.path}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "searchResult",
        props: {
            searchData: {
                type: Array,
                default: []
            }
        },
        methods:{
            chooseQuestion(item){
                this.$emit("callbackResult", item)
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .search-result {
        padding: 32px;
    }
    .search-result h5{
        color:rgba(0,0,0,0.85);
        font-size: 20px;
        margin-bottom: 24px;
    }
    /deep/ .f-color {
        color: #1890ff;
    }

    .answer {
        width: 100%;
        height: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        overflow: hidden;
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

</style>
