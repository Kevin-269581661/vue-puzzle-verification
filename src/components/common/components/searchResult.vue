<template>
    <div class="search-result">
        <h5>搜索结果</h5>
        <ul>
            <li v-for="(item,index) in searchData" :key="index">
                <h6>{{item.title}}</h6>
                <div class="answer" v-html="item.answer"></div>
                <p>{{item.path}}</p>
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
        mounted() {

        }
    }
</script>

<style scoped>
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

</style>
