<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">工程管理</a>
            </p>
        </div>
        <div class="comList_wrap">
            <div class="comList_head">
                <h2>上画任务</h2>
            </div>
            <div class="comList_container">
                <el-row>
                    <el-col :span="5">
                        <span>城市:</span>
                        <el-select v-model="searchInfo.city" placeholder="请选择" size="small">
                            <el-option v-for="item of cityArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <span>线路:</span>
                        <el-select v-model="searchInfo.line" placeholder="请选择" size="small">
                            <el-option v-for="item of lineArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span>工程人员:</span>
                        <el-select v-model="searchInfo.engineer" placeholder="请选择" size="small">
                            <el-option v-for="item of engineerArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="5">
                        <span>订单:</span>
                        <el-select v-model="searchInfo.order" placeholder="请选择" size="small">
                            <el-option v-for="item of orderArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" icon="el-icon-search" @click="search()" size="small" :disabled="!isSearch">查询</el-button>
                        <el-button @click="reset()" size="small">重置</el-button>
                    </el-col>
				</el-row>
                <el-row>
                    <el-col :span="5">
                        <span>上画时间:</span>
                        <el-radio-group v-model="activeType" size="small">
                            <el-radio-button :label="1">本周</el-radio-button>
                            <el-radio-button :label="2" >本月</el-radio-button>
                            <el-radio-button :label="3">近2周</el-radio-button>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="5">
                        <el-date-picker class="input-with-select" v-model="rangeDate" size="small" type="daterange" range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd" >
                        </el-date-picker>
                    </el-col>
                </el-row>
                <div class="table_wrap">
                    <el-table border :data="projectList" height="450" v-loading="loading" v-loadmore="companyLoadMore"
                        element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                        <el-table-column label="上画时间" min-width="11.8%" prop="photoTime">
                        </el-table-column>
                        <el-table-column prop="lineName" label="所属线路" min-width="8.1%">
                        </el-table-column>
                        <el-table-column prop="order" label="订单" min-width="9.8%" >
                        </el-table-column>
                        <el-table-column prop="size" label="素材(尺寸/数量)" min-width="10.9%">
                        </el-table-column>
                        <el-table-column prop="photoNum" label="上画面数" min-width="8.9%">
                        </el-table-column>
                        <el-table-column prop="mediaNum" label="媒体数" min-width="8.9%">
                        </el-table-column>
                        <el-table-column prop="resNum" label="小区数" min-width="8.9%">
                        </el-table-column>
                        <el-table-column prop="engineer" label="工程人员" min-width="8.9%">
                        </el-table-column>
                        <el-table-column prop="progress" label="上画进度" min-width="8.9%">
                        </el-table-column>
                        <el-table-column label="操作" min-width="7.1%">
                            <template slot-scope="scope">
                                <el-dropdown size="small" split-button trigger="click" placement="bottom-start">操作
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native.prevent="toPhotoDetail(scope.row)">上画清单
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="toAssign(scope.row)">分配人员
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        MessageBox,
        Message,
    } from "element-ui";
    // 时间控件格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import api from "../../api/api.js";
    export default {
        data(){
            return{
                // 登录信息
                sessionData:{},
                // 搜索数据
                searchInfo:{
                    city: '',
                    line: '',
                    engineer: '',
                    order: '',
                },
                isSearch: true,
                isReset: true,
                // 城市
                cityArr: [],
                // 线路
                lineArr: [],
                // 工程人员
                engineerArr: [],
                // 订单
                orderArr: [],
                // 表格数据
                // projectList: [],
                projectList: [
                    {
                        photoId: 1,
                        photoTime: '2018-08-08',
                        line: 1,
                        lineName: '线路一',
                        orderId: 1,
                        order: '订单一',
                        size: '1080*1920',
                        photoNum: 280,
                        mediaNum: 24,
                        resNum: 20,
                        engineer: '工程一',
                        progress: 0.8
                    },
                    {
                        photoId: 1,
                        photoTime: '2018-08-08',
                        line: 1,
                        lineName: '线路一',
                        orderId: 1,
                        order: '订单一',
                        size: '1080*1920',
                        photoNum: 280,
                        mediaNum: 24,
                        resNum: 20,
                        engineer: '工程一',
                        progress: 0.8
                    },
                    {
                        photoId: 1,
                        photoTime: '2018-08-08',
                        line: 1,
                        lineName: '线路一',
                        orderId: 1,
                        order: '订单一',
                        size: '1080*1920',
                        photoNum: 280,
                        mediaNum: 24,
                        resNum: 20,
                        engineer: '工程一',
                        progress: 0.8
                    },
                    {
                        photoId: 1,
                        photoTime: '2018-08-08',
                        line: 1,
                        lineName: '线路一',
                        orderId: 1,
                        order: '订单一',
                        size: '1080*1920',
                        photoNum: 280,
                        mediaNum: 24,
                        resNum: 20,
                        engineer: '工程一',
                        progress: 0.8
                    },
                ],
                loading: false,
                loading_point: true, 
                currPage: 1,
                totalPage: 0,
                pageSize: 15,
                // 本周/本月/近两周
                activeType: 1,
                // 搜索时间段
                rangeDate: []             
            }
        },
        directives: {
            loadmore: {
                bind: function (el, binding) {
                    const selectWrap = el.querySelector('.el-table__body-wrapper')
                    selectWrap.addEventListener('scroll', function () {
                        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
                        // console.log('滚动的距离',scrollDistance)
                        if (scrollDistance <= 100) {
                            binding.value()
                        }
                    })
                }
            }
        },
        methods:{
            // 判断角色是否有新建按钮(系统管理员和超级管理员有)
            getRole() {
                this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
                let role = this.sessionData.ascType;
                console.log(role);
                if (role == 0 ) {
                    this.showNewBtn = true;
                }
            },
            // 公司列表滚动监听
            companyLoadMore(){
                if(this.loading_point){
                    this.loading_point = false;
                    if(this.currPage <= this.totalPage){
                        this.searchFun();
                    }
                }
            },
            searchFun(){
                let info = this.searchFormat();
                this.getData(info);
            },
            // 滚动获取列表数据
            getData(params){
                api.getApi(this.apiVar.UCAPI+'/AscrList', params).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        if(!res.data.SysCode){
                            console.log(res.data);
                            let dataInfo = res.data;
                            this.totalPage = dataInfo.totalpage;
                            let dataArr = dataInfo.data;
                            this.projectList = this.projectList.concat(this.funcData(dataArr));
                            this.loading_point = true;
                            this.currPage++;
                            this.loading = false;
                            if(dataInfo.totalpage == 0){
                                Message.warning('暂无数据');
                            }
                        }else{
                            Message.warning(res.data.MSG);
                        }
                    }
                });
            },
            // 数据处理
            funcData(dataArr){
                console.log('dataArr---', dataArr);
                let result = [];
                for(let data of dataArr){
                    let tmpObj = '';
                    tmpObj = this.setTableData(data);
                    result.push(tmpObj);
                }
                return result;
            },
            // 搜索数据格式化
            searchFormat(){
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    start: this.currPage,
                    pagesize: this.pageSize
                };
                let { keyword, type, state } = this.searchInfo;
                if(keyword){
                    info.ascName = keyword;
                }
                if(state>=0){
                    info.astate = state;
                }
                if(type>=0){
                    info.asType = type;
                }
                return info;
            },
            // 设置表格数据
            setTableData(item){
                let obj = {
                    asrID: item.asrID ? item.asrID : '',
                    name: item.asName ? item.asName : '',
                    state: item.ascState>=0 ? item.ascState : '',
                    type: item.ascType>=0 ? item.ascType : '',
                    createTime: item.createTime ? item.createTime : '',
                };
                return obj;
            },
            // 搜索
            search(){
                let { keyword, type, state } = this.searchInfo;
                this.isSearch = false;
                let timer = setTimeout(()=>{
                    this.isSearch = true;
                    clearTimeout(timer);
                }, 1000);
                if(keyword || (type>=0) || (state>=0)){
                    this.projectList = [];
                    this.loading = true;
                    this.loading_point = false;
                    this.currPage = 1;
                    this.searchFun();
                }else{
                    Message.warning('请输入搜索条件');
                }
            },
            // 重置
            reset(){
                this.searchInfo = {
                    keyword: '',
                    type: '',
                    state: '',
                };
                this.currPage = 1;
                this.projectList = [];
                this.isReset = false;
                let timer = setTimeout(()=>{
                    this.isReset = true;
                    clearTimeout(timer);
                }, 1000);
                this.searchFun();
            },
            //日期排序
            sortData(a, b) {
                return dateFormat.toDate(a.createTime, '') - dateFormat.toDate(b.createTime, '');                            
            },
            // 时间格式化
            formatTime(time) {
                return dateFormat.toDate(time);
            },
            // 上画清单
            toPhotoDetail(item){
                this.$router.push('./projectDetail');
            },
            // 分配人员
            toAssign(item){
                
            },
            loginTimeout() {
                Message.warning("登录超时,请重新登录");
                this.$router.push("/login");
            },
        },
        mounted(){
            // this.getRole();
            // this.searchFun();
        },
    };
</script>
<style scoped>
    /*面包屑导航*/
    .ad_mediaDetail_wrap {
        position: relative;
    }
    .ad_mediaDetail_nav{
        width: 92%;
        margin: 0 auto;
    }
    .ad_mediaDetail_nav p {
        position: absolute;
        left: 0;
        top: 12px;
        font-size: 14px;
        line-height: 18px;
    }

    .ad_mediaDetail_nav p a {
        color: #666;
    }

    .ad_mediaDetail_nav {
        height: 42px;
        position: relative;
    }
    /deep/.comList_container .el-input{
        max-width: 180px;
    }
    /deep/.comList_container .el-row{
        margin-top:24px;
    }

    .comList_wrap {
        width: 92%;
        background: #ffffff;
        border: 1px solid #e6e7e9;
        margin: 0 auto;
    }

    .comList_wrap .comList_head {
        width: 100%;
        height: 24px;
        padding: 12px 0;
        border-bottom: 1px solid #e6e7e9;
    }

    .comList_wrap .comList_head h2 {
        font-size: 16px;
        color: #2c313c;
        height: 24px;
        padding-left: 14px;
        font-weight: bold;
    }

    .comList_wrap .comList_container {
        width: 96%;
        margin: 24px auto;
    }
    .table_wrap{
        margin: 24px auto;
        width: 100%;
    }
    /*表格*/
    /deep/ .el-table th,
    .el-table tr {
        height: 44px;
        padding: 0;
        background-color: #f7f7f7;
    }
    /deep/ .el-table td {
        padding: 8px 0;
        overflow-x: hidden;
        text-overflow: ellipsis;
    }

    /deep/ .el-table--border {
        border-radius: 4px;
    }

    /deep/ .el-table th > .cell {
        font-size: 14px;
        color: #666666;
        font-weight: bold;
    }
    
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 4px;
        background: #fafafa;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    }
    /deep/ .el-button [class*=el-icon-]+span, .select-wrap button .el-icon-search{
        position: relative;
        left: -2px;
        top: 0px;
    }

    /deep/ button.el-button.el-button--default.el-button--small:hover {
        color: #666;
        border-color: #d8d8d8;
        background-color: #fff;
    }
    /deep/ .el-dropdown .el-button-group .el-button {
        height: 28px;
        width: 48px;
        font-size: 14px;
        padding: 0;
    }
    /deep/ .el-button-group button {
        float: left !important;
    }

    /deep/ .el-dropdown .el-button-group .el-button:last-child {
        width: 30px;
        position: relative;
        top: 0px;
    }

    .input-with-select /deep/ .el-input__inner {
        font-size: 14px;
        height: 34px;
        vertical-align: middle;
    }
    /deep/ .el-date-editor--daterange.el-input__inner{
        width: 240px;
    }
</style>


