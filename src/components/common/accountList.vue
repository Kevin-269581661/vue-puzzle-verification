<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">账号管理</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>账号列表</h2>
            </div>
            <div class="mediaList_container">
                <el-row class="search_row">
                    <el-col>
                        <el-input placeholder="请输入内容" v-model="searchInfo.keyword" class="input-with-select">
                            <el-select v-model="searchInfo.select" slot="prepend" placeholder="请选择">
                                <el-option label="姓名" value="1"></el-option>
                                <el-option label="账号" value="2"></el-option>
                            </el-select>
                        </el-input>
                        <el-select v-model="searchInfo.role" placeholder="请选择账号角色">
                            <el-option v-for="item of roleList" :key="item.value" :label="item.text" :value="item.value" ></el-option>
                        </el-select>
                        <el-select v-model="searchInfo.company" placeholder="请选择所属公司" filterable v-if="sessionData.ascType==0">
                            <el-option v-for="item of companyData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-select v-model="searchInfo.state" placeholder="请选择状态">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="禁用" value="0"></el-option>
                        </el-select>
                        <el-button type="primary" icon="el-icon-search" @click="search()" :loading="isSearch">搜索</el-button>
                        <el-button plain @click="reset()" :disabled="!isReset">重置</el-button>
                        <el-button plain @click="newAccount()" v-if="showNewBtn">新建</el-button>
                    </el-col>
                </el-row>
                <div class="table_wrap">
                    <el-table border :data="currAccount" style="width: 100%"  @sort-change="sortChange" v-loading="loading"
                              element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading"
                              :default-sort="{prop: 'joinTime', order: 'descending'}">
                        <el-table-column label="账号" min-width="11.8%">
                            <template slot-scope="scope">
                                <a href="javascript:void(0);" @click="ToEdit(scope.row)">{{scope.row.sName}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="realName" label="姓名" min-width="7.8%" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="company" label="所属公司" min-width="14.2%" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="uType" label="账号角色" min-width="8.1%">
                            <template slot-scope="scope">
                                <span>{{roleToText(scope.row.uType)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="puName" label="上级" min-width="7.8%">
                        </el-table-column>
                        <el-table-column prop="joinTime" label="创建日期" min-width="9.8%" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{formatTime(scope.row.joinTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="uState" label="状态" min-width="8.9%">
                            <template slot-scope="scope">
                                <point-state :state-text="stateToText(scope.row.uState).text" :color="stateToText(scope.row.uState).color"></point-state>                                
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" min-width="7.1%">
                            <template slot-scope="scope">
                                <span v-if="scope.row.uState ==1" style="color: #108EE9;cursor: pointer;" @click="isForbidden(scope.row)">禁用</span>
                                <span v-if="scope.row.uState ==0" style="color: #108EE9;cursor: pointer;" @click="isForbidden(scope.row)">开通</span>
                            </template>
                        </el-table-column>

                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>

                    <div class="ad_pagination">
                        <el-pagination
                            background
                            v-if="paginationShow"
                            @size-change="sizeChange"
                            @current-change="changePage"
                            :current-page.sync="currPage"
                            :page-sizes="pageSizes"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalNum">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        Row,
        Input,
        Button,
        Table,
        TableColumn,
        MessageBox,
        Message,
        Select,
        Option,
        Loading
    } from "element-ui";
    import {api} from "../../api/api";
    // 时间控件格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import sessFun from "../../commonFun/sessFun.js";
    // 角色转换为中文
    import uTypeToText from "../../commonFun/uTypeToText.js";
    import noSearchResult from "./components/noSearchResult.vue";
    import pointState from './components/pointState.vue';    

    export default {
        name: "customList",
        components: {
            noSearchResult,
            pointState,
            elRow: Row,
            elInput: Input,
            elButton: Button,
            elTable: Table,
            elTableColumn: TableColumn,
            elSelect: Select,
            elOption: Option,
        },
        data() {
            return {
                // 分页信息
                paginationShow: true,
                pageSize: 10,
                pageSizes: [10, 20, 50],
                currPage: 1,
                totalPage: 0,
                totalNum: 0,
                // 登录信息
                sessionData:{},
                //加载中
                loading: true,
                searchInfo:{
                    keyword: "",
                    select: "1",
                    role: '',
                    state: '',
                    company: '',
                    // 按照啥排序
                    orderby: '',
                    // 升序降序0/1
                    desc: "",
                },
                showNewBtn: true,
                companyData: [],
                // 表格数据
                currAccount: [],
                isSearch: true,
                isReset: true,
                roleList: [
                    {text: '系统管理员', value: 'SA'},
                    {text: '超级管理员', value: 'SM'},
                    {text: '运营', value: 'OP'},
                    {text: '媒介', value: 'MD'},
                    {text: '销售', value: 'BD'},
                    // {text: '广告主', value: 'AD'},
                    {text: '工程人员', value: 'EP'}
                ],
            };
        },
        created() {
            this.getRole();
            if(this.sessionData.ascType==0){
                this.getCompany();
            }
            this.searchFun();
        },
        methods: {
            // 切换页码
            changePage(page) {
                this.currPage = page;
                console.log('page----', page);
                this.searchFun();
            },
            // 每页条数切换
            sizeChange(val) {
                this.pageSize = val;
                if (this.currPage == 1) {
                    this.searchFun();
                }
                this.currPage = 1;
            },
            // 获取公司
            getCompany(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                };
                api.getApi(this.apiVar.UCAPI + '/ShowAscr', info).then(res =>{
                    console.log(res);
                    if(!res.data.SysCode){
                        let result = [];
                        for(let data of res.data){
                            let obj = {
                                label: data.asName,
                                value: data.asrID,
                            };
                            result.push(obj);
                        }
                        this.companyData = result;
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            },
            // 判断角色是否有新建按钮(系统管理员和超级管理员有)
            getRole() {
                this.sessionData = sessFun.getSess();
                let role = this.sessionData.uType;
                console.log(role);
                if (role != "SA" && role != "SM") {
                    this.showNewBtn = false;
                }
            },
            searchFun(){
                this.paginationShow = false;
                this.loading = true;
                let info = this.searchFormat();
                this.getData(info);
                this.$nextTick(function () {
                    this.paginationShow = true;
                });
            },
            // 滚动加载数据列表
            getData(params){
                api.getApi(this.apiVar.UCAPI+'/GetUserList', params).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        if(!res.data.SysCode){
                            let dataInfo = res.data;
                            this.totalNum = dataInfo.count;
                            let dataArr = dataInfo.data;
                            this.currAccount = this.funcData(dataArr);
                            this.loading = false;
                            this.isSearch = false;
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
                console.log(dataArr);
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
                let { keyword, role, state, select, company, orderby, desc } = this.searchInfo;
                info = {
                    ...info,
                    ...(keyword && {keywordType: select, keyword}),
                    ...(state && {ustate: state}),
                    ...(role && {uType: role}),
                    ...(company && {asrID: company}),
                    ...(orderby && {orderby}),
                    ...(desc!=='' && desc>=0 &&{desc})
                };
                return info;
            },
            // 设置表格数据
            setTableData(item){
                let obj = {
                    uID: item.uID ? item.uID : '',
                    sName: item.sName ? item.sName : '',
                    realName: item.realName ? item.realName:'--',
                    company: item.asName ? item.asName : '--', 
                    asrID: item.asrID ? item.asrID : '', 
                    uType: item.uType ? item.uType : '',
                    puName: item.puName ? item.puName : '--',
                    joinTime: item.joinTime ? item.joinTime : '',
                    uState: item.uState ? item.uState : '',
                    position: item.position ? item.position : '',
                    phone: item.phone ? item.phone : '',
                    division: item.division ? item.division : '',
                    puID: item.puID ? item.puID : '',
                    rID: item.rID ? item.rID : '',
                };
                return obj;
            },
            // 时间排序(请求后台接口进行排序)
            sortChange(column){
                console.log('columm---', column);
                if(column.order == "ascending"){
                    this.searchInfo.orderby = column.prop;
                    this.searchInfo.desc = 0;
                }else if(column.order == "descending"){
                    this.searchInfo.orderby = column.prop;
                    this.searchInfo.desc = 1;
                }
                this.currPage = 1;
                this.searchFun();
            },
            // 时间格式化
            formatTime(time) {
                return dateFormat.toDate(time, '/');
            },
            // 角色格式化
            roleToText(role) {
                return uTypeToText.toText(role);
            },
            // 状态转换
            stateToText(status) {
                let statusText = [
                    {text: "正常", status: 1, color: 'rgba(82,196,26,1)'},
                    {text: "禁用", status: 0, color: 'rgba(245,34,45,1)'}
                ];
                for (let data of statusText) {
                    if (data.status == status) {
                        return data;
                    }
                }
            },
            // 搜索优化
            search(){
                let { keyword, role, state, company } = this.searchInfo;                
                // this.isSearch = false;
                // let timer = setTimeout(()=>{
                //     this.isSearch = true;
                //     clearTimeout(timer);
                // }, 1000);
                if(keyword || role || state || company){
                    this.currAccount = [];
                    this.loading = true;
                    this.currPage = 1;
                    this.searchFun();
                    this.isSearch = true;
                }else{
                    Message.warning('请输入搜索条件');
                }
            },
            // 重置
            reset(){
                this.searchInfo = {
                    select: "1",
                    keyword: '',
                    role: '',
                    state: '',
                    company: ''
                };
                this.currPage = 1;
                this.currAccount = [];
                this.isReset = false;
                let timer = setTimeout(()=>{
                    this.isReset = true;
                    clearTimeout(timer);
                }, 1000);
                this.searchFun();
            },
            // 新建
            newAccount() {
                this.$router.push("./createAccount");
            },
            // 开通或者禁用：
            isForbidden(row) {
                console.log(row);
                MessageBox.confirm(
                    `是否${row.uState ? "禁用" : "开通"}该角色?`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                    .then(() => {
                        let info = {
                            uid: this.sessionData.uID,
                            token: this.sessionData.token,
                            toid: row.uID,
                            ustate: row.uState ? 0 : 1
                        };
                        api.postApi(this.apiVar.UCAPI + "/CtrlUser", info)
                            .then(res => {
                                console.log(res.data);
                                if (res.data.SysCode == 200200) {
                                    Message.success(res.data.MSG);
                                    row.uState = row.uState ? 0 : 1;
                                } else if (res.data.SysCode == 100302) {
                                    this.loginTimeout();
                                } else {
                                    Message.warning(res.data.MSG);
                                }
                            })
                            .catch(res => {
                                console.log(res);
                            });
                    })
                    .catch(() => {
                        Message.info("已取消操作");
                    });
            },
            ToEdit(row) {
                console.log(row);
                sessionStorage.setItem("userId", row.uID);
                this.$router.push("./createAccount?edit=y");
            },
            loginTimeout() {
                Message.warning("登录超时,请重新登录");
                this.$router.push("/login");
            }
        }
    };
</script>
<style scoped>
    a {
        color: #108ee9;
    }

    /*筛选*/
    .el-checkbox + .el-checkbox {
        margin-left: 0;
    }

    .input-with-select /deep/ .el-input__inner {
        font-size: 14px;
        height: 34px;
        line-height: 34px;
    }

    /deep/ .plan-select .el-input__inner {
        font-size: 14px;
        height: 34px;
        line-height: 34px;
    }

    .typeBox p {
        height: 30px;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        border-top: 1px solid #cccccc;
    }

    /deep/ .el-checkbox__label {
        font-size: 10px;
        color: #8a8a8a;
    }

    /*日期控件*/
    .block {
        display: inline-block;
        position: relative;
        top: 0;
    }

    /deep/.search_row .el-input__inner {
        width: 180px;
        height: 34px;
    }

    .el-input {
        width: 180px;
        border-radius: 4px;
    }

    /deep/ .el-date-editor .el-range-separator {
        line-height: 26px;
    }

    /*下拉搜索框*/
    /deep/ .el-input-group__prepend {
        width: 64px;
        background-color: #fff;
    }

    /deep/ .el-input-group--prepend .el-select .el-input__inner {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        width: 104px;
    }

    /deep/ .el-input-group--prepend .el-input__inner {
        width: 185px;
    }

    .el-input {
        border-radius: 4px;
    }

</style>
