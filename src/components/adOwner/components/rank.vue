<template>
    <div>
        <div class="right-charts-left-list">
            <template>
                <el-table
                    :data="item.arr"
                    style="width: 100%">
                    <el-table-column
                        label="排名"
                        min-width="18%">
                        <template slot-scope="scope">
                            <span v-if="scope.$index == 0"><img src="../../../assets/images/top1.png" alt=""></span>
                            <span v-else-if="scope.$index == 1"><img src="../../../assets/images/top2.png" alt=""></span>
                            <span v-else-if="scope.$index == 2"><img src="../../../assets/images/top3.png" alt=""></span>
                            <span v-else>{{scope.$index+1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="tag"
                        :label="labelText"
                        min-width="40%">
                    </el-table-column>
                    <el-table-column
                        label="占比"
                        min-width="42%"
                    >
                        <template slot-scope="scope">
                            <div style="display: flex;justify-content: space-around">
                                <span>{{(scope.row.ratio*100).toFixed(2)}}%</span>
                                <el-progress :percentage="(scope.row.ratio*100).toFixed(2)-0" :text-inside="true" color="#1890FF" style="width:55%;line-height:21px"></el-progress>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </div>
    </div>
</template>
<script>
    export default {
        props:{
            data:{
                type: Object,
                default: {}
            },
            labelText:{
                type: String,
                default: '行业'
            }
        },
        data(){
            return{
                item:{},
            }
        },
        created(){
            this.item = this.data;

        },
        watch:{
            data(){
                this.item = this.data;
            },
        },
    }
</script>
<style scoped>
    .right-content-wrap h1 {
        font-weight: bold;
    }
    .right-charts-left-title h1 {
        border-bottom: 1px solid #dedede;
        height: 48px;
        line-height: 48px;
        padding-left: 24px;
    }

    .right-charts-left-list {
        padding: 0 24px;
    }

    /deep/ .el-progress-bar__innerText {
        display: none;
    }

    /deep/ .el-table .cell {
        text-align: center;
    }

    /deep/ .el-table .cell img {
        width: 18px;
        height: 24px;
    }
    .right-charts-left-list  /deep/ .el-table .has-gutter th:last-of-type .cell{
        padding-left: 45px ;
    }
</style>

