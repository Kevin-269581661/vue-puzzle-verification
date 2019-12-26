<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#">工程管理</a>
                <em> / </em>
                <a href="#">上画统计</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>上画统计</h2>
            </div>
            <div class="mediaList_container">
                <el-row :gutter="16">
                    <el-col :span="7">
                        <span class="search_title">统计时间:</span>
                        <el-date-picker
                            v-model="searchInfo.countDate"
                            :clearable="false"
                            type="daterange"
                            size="small"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy/MM/dd"
                            format="yyyy/MM/dd">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="7">
                        <span class="search_title">工程人员:</span>
                        <el-select v-model="searchInfo.EPID" placeholder="请选择" size="small" clearable filterable>
                            <el-option v-for="item of engineerArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" @click="searchFun()">搜索</el-button>
                        <el-button plain @click="reset()">重置</el-button>
                    </el-col>
                    <el-col :span="4" style="text-align: right">
                        <!--<el-button type="primary" @click="importList()" :loading="activeDownload">-->
                            <!--{{activeDownload ? '导出中' : '导出'}}</el-button>-->
                        <el-dropdown>
                        <el-button plain>
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item  @click.native.prevent="importList()">导出</el-dropdown-item>
                        </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
                <div class="table_box">
                    <el-table border :data="paintedCountList" v-loading="tableLoading"
                              element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                        <el-table-column prop="userName" label="工程人员" min-width="11.8%" >
                        </el-table-column>
                        <el-table-column prop="orderCount" label="订单数" min-width="8.1%" align="right" sortable>
                        </el-table-column>
                        <el-table-column prop="resourceCount" label="小区数" min-width="10.8%" align="right" sortable>
                        </el-table-column>
                        <el-table-column prop="publishAdsCount" label="上刊点位" min-width="8.9%" align="right" sortable>
                        </el-table-column>
                        <el-table-column prop="publishPhotoCount" label="上刊张数" min-width="8.9%" align="right" sortable>
                        </el-table-column>
                        <el-table-column prop="unPublishAdsCount" label="下刊点位" min-width="8.9%" align="right" sortable>
                        </el-table-column>
                        <el-table-column prop="unPublishPhotoCount" label="下刊张数" min-width="8.9%" align="right" sortable>
                        </el-table-column>
                        <el-table-column prop="replaceAdsCount" label="换画点位" min-width="8.9%" align="right" sortable>
                        </el-table-column>
                        <el-table-column prop="replacePhotoCount" label="换画张数" min-width="8.9%" align="right" sortable>
                        </el-table-column>
                        <el-table-column prop="patrolCount" label="巡点次数" min-width="8.9%" align="right" sortable>
                        </el-table-column>
                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>
                </div>
                <div class="ad_pagination">
                    <el-pagination
                        background
                        @size-change="changeSize"
                        @current-change="changePage"
                        :current-page.sync="pageData.currPage"
                        :page-sizes="pageSizes"
                        :page-size="pageData.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageData.totalNum">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import sessFun from "../../commonFun/sessFun";
    import api from "../../api/api"
    import noSearchResult from "./components/noSearchResult";
    import timeFormat from "../../commonFun/timeFormat";

    export default {
        name: "paintedCount",
        data() {
            return {
                sessionData: sessFun.getSess(),
                dateTime:[],
                // 搜索条件
                searchInfo:{
                    countDate: [],
                    EPID: ''
                },
                // 工程人员list
                engineerArr: [],
                // 表格数据
                paintedCountList:[],
                // 表格loading
                tableLoading: true,
                orderArr: [],
                // 分页
                pageData:{
                    pageSize: 10,
                    currPage: 1,
                    totalNum: 0,
                },
                pageSizes: [10, 20, 50],
                // 是否下载中
                activeDownload: false,
            }
        },
        components:{
            noSearchResult,
        },
        mounted() {
            let starTime = timeFormat.returnDayCount(-14,'/')
            let endTime = timeFormat.returnDayCount(0,'/')
            this.dateTime = [starTime,endTime]
            this.searchInfo.countDate = this.dateTime.concat()
            this.getData();
            this.getEngineer();
        },
        methods:{
            // 工程人员列表
            getEngineer(){
                let sess = this.sessionData;
                let params = {
                    uid: sess.uID,
                    token: sess.token,
                    service: "GetEPByAsrID",
                    data: {
                        asrID: sess.asrID,
                    }
                };
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    // console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        this.engineerArr = res.data.data.map(item => {
                            return {
                                value: item.uID,
                                label: item.realName
                            }
                        });
                    } else {
                        sessFun.messageFun('warning', res.data.MSG);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 搜索
            searchFun() {
                if(!this.tableLoading) {
                    let {countDate, EPID} = this.searchInfo;
                    if (countDate || countDate[0] || EPID) {
                        this.resetSearchData()
                        this.getData();
                    } else {
                        sessFun.messageFun('warning', '请输入搜索条件');
                    }
                }
            },
            // 重置
            reset() {
                this.searchInfo = {
                    countDate: this.dateTime.concat(),
                    EPID: ''
                }
                this.resetSearchData()
                this.getData();
            },
            // 重置部分数据
            resetSearchData() {
                this.paintedCountList = [];
                this.pageData = {
                    pageSize: 10,
                    currPage: 1,
                    totalNum: 0
                }
                this.tableLoading = true;
            },
            // 切换页码
            changePage(page) {
                this.pageData.currPage = page;
                console.log('page----', page);
                this.getData();
            },
            // 每页条数切换
            changeSize(val) {
                this.pageData.pageSize = val;
                this.pageData.currPage = 1;
                this.getData();
            },
            // 获取上画统计list
            getData() {
                if(!this.searchInfo.countDate){
                    sessFun.messageFun('warning','请选择时间!')
                    return
                }
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    pageNo: this.pageData.currPage,
                    pageSize: this.pageData.pageSize,
                    startDate: this.searchInfo.countDate[0],
                    endDate: this.searchInfo.countDate[1],
                    userId: this.searchInfo.EPID,                     // 工程人员uID
                }
                for (let i in params) {
                    if (!params[i]) {
                        delete params[i]
                    }
                }
                api.getApi(this.apiVar.report + '/publish/list',params).then(res=>{
                    console.log('上画统计list',res)
                    if (res.data.SysCode == 200200) {
                        let resData = res.data
                        this.pageData.totalNum = resData.total
                        this.paintedCountList = resData.data.map(item => {
                            return {
                                "userName": item.userName,
                                "userId": item.userId,
                                "orderCount": item.orderCount,
                                "resourceCount": item.resourceCount,
                                "publishAdsCount": item.publishAdsCount,
                                "publishPhotoCount": item.publishPhotoCount,
                                "unPublishAdsCount": item.unPublishAdsCount,
                                "unPublishPhotoCount": item.unPublishPhotoCount,
                                "replaceAdsCount": item.replaceAdsCount,
                                "replacePhotoCount": item.replacePhotoCount,
                                "patrolCount": item.patrolCount,
                            }
                        });
                        console.log('paintedCountList',this.paintedCountList)
                    } else {
                        sessFun.messageFun('warning', res.data.MSG);
                    }
                    this.tableLoading = false
                }).catch(err=>{
                    sessFun.messageFun('warning', '上画统计接口异常！');
                    this.tableLoading = false
                })
            },
            // 导出
            importList() {
                if(!this.searchInfo.countDate){
                    sessFun.messageFun('warning','请选择时间!')
                    return
                }
                this.activeDownload = true
                // sessFun.messageFun('warning','导出excel可能需要一分钟甚至更长时间!')
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.searchInfo.countDate[0],
                    endDate: this.searchInfo.countDate[1],
                    userId: this.searchInfo.EPID,                     // 工程人员uID
                }
                for (let i in params) {
                    if (!params[i]) {
                        delete params[i]
                    }
                }
                api.getApi_file(this.apiVar.report + '/publish/export', params).then(res => {
                    console.log('导出res', JSON.stringify(res))
                    // console.log('导出headers',res.headers);
                    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
                    let time = timeFormat.toDateTime(new Date(), '').split(' ')
                    let timeString = time[0] + time[1].split(':').join('')
                    if (navigator.msSaveBlob) {
                        // 兼容IE 如果存在msSaveBlob则启用IE自带的下载器
                        let fileName =  '上画统计' + timeString + '.xls'
                        try {
                            window.navigator.msSaveBlob(blob, fileName)
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        let downloadElement = document.createElement('a');
                        downloadElement.target = "_blank"; // 针对 ie模式 的浏览器
                        let href = window.URL.createObjectURL(blob);    //创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = '上画统计' + timeString + '.xls'// res.headers['content-disposition'].split('=')[1]; //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click();                        //点击下载
                        document.body.removeChild(downloadElement);     //下载完成移除元素
                        window.URL.revokeObjectURL(href);               //释放掉blob对象
                    }
                    this.activeDownload = false
                }).catch(error => {
                    sessFun.messageFun('warning','导出接口异常！')
                    console.log('error',error)
                    this.activeDownload = false
                })
            },
        },
    }
</script>

<style scoped>

    .search_title{
        color: rgba(0, 0, 0, 0.85);
        font-size: 15px;
    }

    /deep/ .el-row .el-date-editor{
        width: calc(100% - 70px);
    }

    /deep/.el-row .el-select{
        width: calc(100% - 70px);
    }

    .table_box{
        margin: 16px 0;
    }

    /depp/ .el-table__body-wrapper{
        overflow-y: unset;
    }
</style>
