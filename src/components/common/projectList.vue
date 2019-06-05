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
            <el-row class="fix_date">
                <el-col>
                    <el-date-picker class="input-with-select" v-model="searchInfo.rangeDate" @change="changeDate()" align="right" size="small" type="daterange" range-separator="-" format="yyyy/MM/dd" value-format="yyyy/MM/dd" >
                    </el-date-picker>
                </el-col>
            </el-row>
            <div class="project_container">
                <el-row :gutter="32">
                    <el-col>
                        <span>所属线路:</span>
                        <el-select v-model="searchInfo.line" placeholder="请选择" size="small">
                            <el-option v-for="item of lineArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span>工程人员:</span>
                        <el-select v-model="searchInfo.engineer" placeholder="请选择" size="small">
                            <el-option v-for="item of engineerArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span>订单名称:</span>
                        <el-select v-model="searchInfo.order" size="small"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="remoteGetOrder"
                            :loading="loadingOrder"
                        >
                            <el-option v-for="item of orderArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <el-button type="primary" @click="search()" size="small" :disabled="!isSearch">查询</el-button>
                        <el-button @click="reset()" size="small">重置</el-button>
                    </el-col>
                </el-row>
                
                <div class="table_wrap">
                    <el-table border :data="projectList" height="450" v-loading="loading" 
                        element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                        <el-table-column label="上画时间" min-width="11.8%" prop="photoTime">
                        </el-table-column>
                        <el-table-column prop="lineName" label="所属线路" min-width="8.1%">
                        </el-table-column>
                        <el-table-column prop="order" label="订单" min-width="9.8%" >
                        </el-table-column>
                        <!-- <el-table-column prop="size" label="素材(尺寸/数量)" min-width="10.9%">
                        </el-table-column> -->
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
                                <el-dropdown size="small" trigger="click" placement="bottom-start">
                                    <span class="el-dropdown-link">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native.prevent="toPhotoDetail(scope.row)">上画清单
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="toAssign(scope.row)">分配人员
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="toSizeDetail(scope.row)">素材明细
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <!-- 分配人员弹出框 -->
        <el-dialog title="分配上画人员"
            :visible.sync="isShowDistri"
            custom-class="size_detail_dialog"            
            width="400px">
            <el-select v-model="currEngineer" placeholder="请选择" size="small" multiple>
                <el-option v-for="item of engineerArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDistri = false" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmDistribute" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 素材明细弹出框 -->
        <el-dialog title="素材明细"
            :visible.sync="isShowSize"
            custom-class="size_detail_dialog"
            width="540px">
            <el-table border :data="sizeList" height="450">
                <el-table-column prop="materialSize" label="广告尺寸" >
                </el-table-column>
                <el-table-column prop="materialCount" label="数量">
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowSize = false" size="small">关 闭</el-button>
            </span>
        </el-dialog>
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
    import timeFormat from '../../commonFun/timeFormat.js';
    import sessFun from '../../commonFun/sessFun.js';
    export default {
        data(){
            return{
                // 登录信息
                sessionData:{},
                // 本周/本月/近两周
                // activeType: 1,
                // 搜索数据
                searchInfo:{
                    line: '',
                    engineer: '',
                    order: '',
                    // 搜索时间段
                    rangeDate: '',
                },
                isSearch: true,
                isReset: true,
                // 线路
                lineArr: [],
                // 工程人员
                engineerArr: [],
                isShowDistri: false,
                currEngineer: [],
                // 当前任务
                currTaskId: '',
                // 订单
                orderArr: [],
                // 素材明细
                sizeList: [],
                isShowSize: false,
                // 表格数据
                projectList: [],
                loadingOrder: false,
                loading: false,
                currPage: 1,
                totalPage: 0,
                pageSize: 15,         
            }
        },
        methods:{
            changeDateType(){
                // let active = this.activeType;
                let result = {};
                result = timeFormat.returnDayRange(7, new Date());
                // if(active == 1){
                //     result = timeFormat.returnDayRange(7, new Date());
                // }else if(active == 2){
                //     result = timeFormat.returnDayRange(14, new Date());
                // }else{
                //     result = timeFormat.returnDayRange(timeFormat.getCurrMonthDays(new Date()), new Date());
                // }
                this.searchInfo.rangeDate = [result.startTime, result.endTime];
            },
            changeDate(){
                console.log(this.searchInfo.rangeDate);
                this.searchFun();
            },
            // 线路列表
            getLine(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                };
                api.getApi(this.apiVar.engineer+"/list", info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        this.lineArr = res.data.data.map(item =>{
                            return {
                                label: item.lineName,
                                value: item.lineId,
                            };
                        });
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            },
            // 工程人员列表
            getEngineer(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    service: "GetEPByAsrID",
                    data: {
                        asrID: sess.asrID,
                    }
                };
                api.postApi_new(this.apiVar.Media, info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        this.engineerArr = res.data.data.map(item =>{
                            return {
                                value: item.uID,
                                label: item.realName
                            }
                        });
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            },
            // 获取订单
            remoteGetOrder(query){
                if (query !== '') {
                    let sess = this.sessionData;
                    let info = {
                        uid: sess.uID,
                        token: sess.token,
                        apName: query,
                    };
                    this.loadingOrder = true;
                    api.getApi(this.apiVar.publishPaintTask+"/orderList", info).then(res =>{
                        console.log(res.data);
                        this.loadingOrder = false;
                        this.orderArr = res.data.data.map(item => {
                            return {
                                label: item.apName,
                                value: item.apID
                            };
                        });
                    }).catch(err =>{
                        console.log(err);
                    });
                } else {
                    this.orderArr = [];
                }
            },
            searchFun(){
                let info = this.searchFormat();
                this.getData(info);
            },
            // 滚动获取列表数据
            getData(params){
                api.getApi(this.apiVar.publishPaintTask+'/list', params).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        if(res.data.SysCode == 200200){
                            console.log(res.data);
                            let dataInfo = res.data;
                            this.totalPage = dataInfo.totalpage;
                            let dataArr = dataInfo.data;
                            this.projectList = this.funcData(dataArr);
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
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    pageNo: this.currPage,
                    pageSize: this.pageSize
                };
                let { line, engineer, order, rangeDate } = this.searchInfo;
                if(line){
                    info.lineId = line;
                }
                if(engineer){
                    info.userId = engineer;
                }
                if(order){
                    info.orderId = order;
                }
                if(rangeDate){
                    if(rangeDate.length){
                        info.startDate = rangeDate[0];
                        info.endDate = rangeDate[1];
                    }
                }
                return info;
            },
            // 设置表格数据
            setTableData(item){
                let obj = {
                    photoId: item.publishId,
                    photoTime: item.publishDate,
                    line: item.lineId,
                    lineName: item.lineName,
                    orderId: item.orderId,
                    order: item.orderName,
                    size: item.material,
                    photoNum: item.publishPaintCount,
                    mediaNum: item.mediaCount,
                    resNum: item.resourceCount,
                    engineerArr: [],
                    engineer: "",
                    progress: item.publishProgress
                };
                obj.engineer = item.engineerMember.map(data =>{
                    return data.userName;
                }).join('/');
                obj.engineerArr = item.engineerMember.map(data =>{
                    return {
                        label: data.userName,
                        value: data.userId,
                    };
                });
                return obj;
            },
            // 搜索
            search(){
                let { line, engineer, order, rangeDate } = this.searchInfo;
                this.isSearch = false;
                let timer = setTimeout(()=>{
                    this.isSearch = true;
                    clearTimeout(timer);
                }, 1000);
                if(line || engineer || order || rangeDate){
                    this.projectList = [];
                    this.loading = true;
                    this.currPage = 1;
                    this.searchFun();
                }else{
                    Message.warning('请输入搜索条件');
                }
            },
            // 重置
            reset(){
                this.searchInfo = {
                    line: '',
                    engineer: '',
                    order: '',
                    // 搜索时间段
                    rangeDate: '',
                };
                this.changeDateType();
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
                sessionStorage.setItem('taskId', item.photoId);
                this.$router.push('./projectDetail');
            },
            // 分配人员
            toAssign(item){
                console.log(item);
                this.currEngineer = item.engineerArr.map(data=> {
                    return data.value
                });
                this.currTaskId = item.photoId;
                this.isShowDistri = true;
            },
            // 素材明细
            toSizeDetail(item){
                this.sizeList = item.size;
                this.isShowSize = true;
            },
            // 确认分配工程人员
            confirmDistribute(){
                console.log(this.currEngineer);
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    taskId: this.currTaskId,
                    userIds: this.currEngineer.join(','),
                };
                api.postApi(this.apiVar.publishPaintTask+"/setEngineerUser", info).then(res =>{
                    if(res.data.SysCode == 200200){
                        let updateArr = this.engineerArr.filter(ele=>{
                            return this.currEngineer.includes(ele.value)
                        });
                        this.projectList = this.projectList.map(t =>{
                            if(t.photoId == this.currTaskId){
                                t.engineerArr = updateArr;
                                t.engineer = updateArr.map(data =>{
                                    return data.label;
                                }).join('/');
                            }
                            return t;
                        });
                        Message.success(res.data.MSG);
                        this.isShowDistri = false;
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                });
            },
            loginTimeout() {
                Message.warning("登录超时,请重新登录");
                this.$router.push("/login");
            },
        },
        mounted(){
            this.changeDateType();
            this.sessionData = sessFun.getSess();
            this.getEngineer();
            this.getLine();
            this.searchFun();
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
    /deep/.project_container .el-input{
        width: 100%;
    }
    /deep/.project_container .el-row{
        margin-top:24px;
    }

    .comList_wrap {
        width: 92%;
        background: #ffffff;
        border: 1px solid #e6e7e9;
        margin: 0 auto;
        position: relative;
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
    .fix_date{
        position: absolute;
        right: 32px;
        top: 8px;
    }

    .comList_wrap .project_container {
        margin: 24px 32px;
    }
    .table_wrap{
        margin: 24px auto;
        width: 100%;
    }
    /*表格*/
    /deep/.project_container .el-table th{
        padding: 0;
        background-color: #f7f7f7;
    }
    
    /deep/.project_container .el-table tr {
        height: 54px;
    }
    /deep/.project_container .el-table td {
        padding: 8px 0;
        overflow-x: hidden;
        text-overflow: ellipsis;
    }

    /deep/.project_container .el-table--border {
        border-radius: 4px;
    }

    /deep/.project_container .el-table th > .cell {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0,0,0,0.85);
        height: 22px;
        line-height: 22px;
    }
    /deep/.project_container .el-table .cell {
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,0.65);
    }
    /* 操作 */
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .el-dropdown-menu{
        margin: 0;
    }
    .el-popper[x-placement^=bottom]{
        margin-top: 0;
    }
    /deep/ .popper__arrow {
        display: none;
    }

    .input-with-select /deep/ .el-input__inner {
        font-size: 14px;
        height: 34px;
        vertical-align: middle;
    }
    /deep/ .el-date-editor--daterange.el-input__inner{
        width: 240px;
        min-width: 240px;
    }

    .el-row span{
        color: rgba(0,0,0,0.85);
        font-size: 14px;
    }
    .el-col-24{
        width: auto;
    }
    .el-col-24:not(:last-child){
        min-width: 25%;
    }
    .el-row .el-select{
        width: calc(98% - 60px);
    }
    .el-button+.el-button{
        margin-left: 8px;
    }
    /deep/ .size_detail_dialog .el-dialog__header{
        font-weight: bold;
        padding: 16px;
        border-bottom: 1px solid #E8E8E8;
    }
    /deep/ .size_detail_dialog .el-dialog__footer{
        border-top: 1px solid #E8E8E8;
        padding: 16px;
    }
</style>


