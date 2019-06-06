<template>
    <div class="ad_main">
        <div class="ad_breadcrumb">
            <p><a href="#">方案管理</a><em> / </em><a href="#">点位表盘</a></p>
        </div>
        <div class="mediaList_wrap">
            <el-tabs v-model="activeTabName" @tab-click="handleClick">
                <el-tab-pane label="广告门" name="adDoor">
                    <div class="tab_conten">
                        <el-row :gutter="32" class="tab_conten_row">
                            <el-col :span="6">
                                <span class="search_label">资源名称:</span>
                                <el-input v-model="resName" size="small" placeholder="请输入内容"></el-input>
                            </el-col>
                            <el-col :span="6">
                                <span class="search_label">城市区域:</span>
                                <el-input v-model="resName" size="small" placeholder="请输入内容"></el-input>
                            </el-col>
                            <el-col :span="7">
                                <span class="search_label">查询范围:</span>
                             <!--   <el-date-picker
                                    v-model="dateInput"
                                    type="date"
                                    size="small"
                                    placeholder="选择日期">
                                </el-date-picker>-->
                                  <el-date-picker
                                    v-model="dateInput"
                                    type="daterange"
                                    size="small"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy/MM/dd"
                                    format="yyyy/MM/dd"
                                    class="date-select"
                                >
                                </el-date-picker>
                            </el-col>
                            <el-col :span="5">
                                <el-button type="primary" :disabled="searchBtnAbled" @click="searchFun">搜索</el-button>
                                <el-button @click="clearSearch">重置</el-button>
                            </el-col>
                        </el-row>
                        <div class="table_wrap">
                            <el-table
                                v-loading="tableLoading"
                                element-loading-text="拼命加载中..."
                                element-loading-spinner="el-icon-loading"
                                :data="adsTableList"
                                style="width: 100%">
                                <el-table-column
                                    prop="resName"
                                    label="资源名称"
                                    min-width="120">
                                </el-table-column>
                                <el-table-column
                                    prop="mediaName"
                                    label="媒体名称"
                                    min-width="120">
                                </el-table-column>
                                <el-table-column
                                    prop="districtName"
                                    label="区域"
                                    min-width="120">
                                </el-table-column>
                                <el-table-column
                                    prop="asLab"
                                    label="投方面"
                                    min-width="90">
                                </el-table-column>
                                <el-table-column
                                    v-for="(item,index) in tableHeader"
                                    :prop="item.dayOfMonth"
                                    :key="index"
                                    width="55"
                                    :label="item.dayOfMonth + item.dayOfWeek">
                                    <template slot-scope="scope">
                                        <div class="color_chunk color_chunk_3" v-if="scope.row[item.dayOfMonth].status === -1"></div>
                                        <el-tooltip placement="bottom" v-else>
                                            <div slot="content">
                                                {{scope.row.occupyingPlanList[scope.row[item.dayOfMonth].adPlanIndex].apName}}
                                            </div>
                                            <div class="color_chunk"
                                                 :class="scope.row[item.dayOfMonth].status== 0 ? 'color_chunk_0' : scope.row[item.dayOfMonth].status == 1 ? 'color_chunk_1' : 'color_chunk_3'">
                                            </div>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="道闸" name="roadGate">
                    道闸
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import api from '../../api/api'
    // 时间格式化
    import timeFormat from '../../commonFun/timeFormat'
    export default {
        name: "adsDialPlate",
        data() {
            return {
                sessionData:'',
                // 页码及条数
                pageData:{
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                },
                tableLoading: false,
                activeTabName: 'adDoor',
                resName: '',
                dateInput:'',
                searchBtnAbled: false,
                adsTableList: [],
                tableHeader:[]
            }
        },
        mounted(){
            this.getSessionData()
            this.getTableData()
        },
        methods:{
            getSessionData(){
                this.sessionData = JSON.parse(sessionStorage.getItem('session_data'))
                let starTime, endTime
                starTime = timeFormat.returnDayCount(0,'/')
                endTime = timeFormat.returnDayCount(30,'/')
                this.dateInput = [starTime, endTime]                // 设置默认时间
            },
            // tab切换
            handleClick(){

            },
            // 获取表盘数据
            getTableData(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    pageNum: this.pageData.pageNum,
                    pageSize: this.pageData.pageSize,
                    mVehicle: '广告门',
                    startTime: this.dateInput[0],
                    endTime: this.dateInput[1],
                }
                api.getApi(this.apiVar.Advertisement + '/VisualizeAds',params).then(res=>{
                    console.log('点位表盘列表',res)
                    if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                        this.setTableData(res.data.data)
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout()
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 设置表格数据
            setTableData(tableData){
                this.tableHeader = tableData.tableHeader
                let arr = []
                if (tableData.adsList.length) {
                    for (let key of tableData.adsList) {
                        let obj = {
                            resName: key.resName,
                            mID: key.mID,
                            mediaName: key.mediaName,
                            asID: key.asID,
                            cityName: key.cityName,
                            districtName: key.districtName,
                            asLab: key.asLab,
                            occupyingPlanList: key.occupyingPlanList
                        }
                        for (let oKey of key.occupyInfos) {
                            obj[oKey.dayOfMonth] = oKey
                        }
                        arr.push(obj)
                    }
                    this.adsTableList = arr.concat()
                    console.log('adsTableList',this.adsTableList)
                }
            },
            // 搜索
            searchFun(){
                console.log('this.dateInput',this.dateInput)
                this.getTableData()
            },
            // 重置搜索
            clearSearch(){

            },
        },
    }
</script>

<style scoped>
    /*面包屑*/
    .ad_breadcrumb{
        height: 42px;
        line-height: 42px;
        font-size: 14px;
        color: rgb(153,153,153);
        width: 100%;
    }

    .ad_breadcrumb p{
        width: 92%;
        margin: 0 auto;
    }

    .ad_breadcrumb p a{
        color: #999;
    }

    .mediaList_wrap{

    }

    /*tag颜色覆盖*/
    /deep/ .mediaList_wrap .el-tabs__header{
        padding: 0 20px;
        margin: 0;
        border-bottom: 1px solid #e4e7ed;
    }

    /deep/ .mediaList_wrap .el-tabs__nav-wrap::after{
        width: 0;
    }

    /deep/ .mediaList_wrap .el-tabs__item{
        width: 68px;
        height: 54px;
        line-height: 54px;
        padding: 0;
        text-align: center;
        font-size: 16px;
        color: #666666;
    }

    /deep/ .mediaList_wrap .el-tabs__item.is-active{
        color: #1890FF;
    }

    /deep/ #tab-roadGate{
        margin-left: 18px;
    }

    /deep/ .el-tabs__active-bar{
        width: 68px !important;
    }

    .tab_conten{
        padding: 24px;
    }

    /*搜索块*/
    .search_label{
        font-size: 14px;
        color: #666;
        display: inline-block;
    }

    /deep/ .el-input{
        width: calc(100% - 67px);
    }
    /deep/ .el-date-editor{
        width: calc(100% - 67px);
    }
    .table_wrap{
        margin-top: 16px;
    }
    /*方块颜色*/
    .color_chunk{
        width: 32px;
        height: 32px;
        background: #EBEDF0;
        border-radius: 3px
    }
    .color_chunk_0{
        background: #FF9061;
    }
    .color_chunk_1{
        background: #FFE281;
    }
    /deep/ th.el-table-column-daytime .cell{
        font-size: 12px;
        line-height: 18px;
    }

    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        /*height: 440px;*/
        overflow-y: auto;
        overflow-x: auto;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background: #FAFAFA;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }
</style>
