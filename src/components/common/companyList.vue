<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">公司管理</a>
            </p>
        </div>
        <div class="comList_wrap">
            <div class="comList_head">
                <h2>公司列表</h2>
            </div>
            <div class="comList_container">
                <el-row>
                    <el-col :span="6">
                        <span>公司名称:</span>
                        <el-input v-model="searchInfo.keyword" placeholder="请输入" size="small"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <span>公司类型:</span>
                        <el-select v-model="searchInfo.type" placeholder="请选择" size="small">
                            <el-option v-for="item of typeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span>状态:</span>
                        <el-select v-model="searchInfo.state" placeholder="请选择" size="small">
                            <el-option v-for="item of stateArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search" @click="search()" size="small" :disabled="!isSearch">查询</el-button>
                        <el-button @click="reset()" size="small">重置</el-button>
                        <el-button @click="newCom()" size="small" v-if="showNewBtn">新建</el-button>
                    </el-col>
				</el-row>
                <div class="table_wrap">
                    <el-table border :data="companyList" height="450" v-loading="loading" v-loadmore="companyLoadMore"
                        element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                        <el-table-column label="公司名称" min-width="11.8%" prop="name">
                        </el-table-column>
                        <el-table-column prop="type" label="公司类型" min-width="8.1%">
                            <template slot-scope="scope">
                                <span>{{roleToText(scope.row.type)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建日期" min-width="9.8%" sortable :sort-by="sortData">
                            <template slot-scope="scope">
                                <span>{{formatTime(scope.row.createTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="state" label="状态" min-width="8.9%">
                            <template slot-scope="scope">
                                <span>{{stateToText(scope.row.state)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="7.1%">
                            <template slot-scope="scope">
                                <span v-if="scope.row.state ==1" style="color: #108EE9;cursor: pointer;" @click="isForbidden(scope.row)">禁用</span>
                                <span v-if="scope.row.state ==0" style="color: #108EE9;cursor: pointer;" @click="isForbidden(scope.row)">开通</span>
                                <span style="color: #108EE9;cursor: pointer; margin-left:10px;" @click="isEdit(scope.row)">编辑</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <!-- 新建/编辑弹出框 -->
        <el-dialog
            title=""
            :visible.sync="isShowNew"
            width="30%">
            <p style="margin-bottom:20px;">
                <span>公司名称:</span>
                <el-input v-model.trim="companyInfo.keyword" placeholder="请输入" size="small" style="max-width:200px;"></el-input>
            </p>
            <p>
                <span>公司类型:</span>
                <el-select v-model="companyInfo.type" placeholder="请选择" size="small" style="max-width:200px;">
                    <el-option v-for="item of typeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowNew = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleCompany()" size="small">确 定</el-button>
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
    export default {
        data(){
            return{
                // 登录信息
                sessionData:{},
                // 搜索数据
                searchInfo:{
                    keyword: '',
                    type: '',
                    state: '',
                },
                isSearch: true,
                isReset: true,
                // 状态
                stateArr: [
                    {
                        label: '正常',
                        value: 1,
                    },
                    {
                        label: '禁用',
                        value: 0
                    }
                ],
                // 公司类型
                typeArr: [
                    {
                        label: '平台商',
                        value: 0,
                    },
                    {
                        label: '媒体主',
                        value: 1
                    }
                ],
                // 表格数据
                companyList: [],
                // 新增公司信息
                companyInfo:{
                    keyword: '',
                    type: 1
                },
                isShowNew: false,
                // 是否可新建公司
                showNewBtn: false,
                // 编辑或新建
                isAdd: false,
                loading: true,
                loading_point: true, 
                currPage: 1,
                totalPage: 0,
                pageSize: 15,               
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
                api.getApi(this.UCAPI+'/AscrList', params).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        if(!res.data.SysCode){
                            console.log(res.data);
                            let dataInfo = res.data;
                            this.totalPage = dataInfo.totalpage;
                            let dataArr = dataInfo.data;
                            this.companyList = this.companyList.concat(this.funcData(dataArr));
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
                    this.companyList = [];
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
                this.companyList = [];
                this.isReset = false;
                let timer = setTimeout(()=>{
                    this.isReset = true;
                    clearTimeout(timer);
                }, 1000);
                this.searchFun();
            },
            // 新建
            newCom(){
                this.companyInfo.keyword = '';
                this.isAdd = true;
                this.isShowNew = true;
            },
            // 确认修改或新增
            handleCompany(){
                console.log(this.companyInfo);
                // 新增
                if(this.companyInfo.keyword){
                    if(this.isAdd){
                            let { keyword, type } = this.companyInfo;
                            let info = {
                                uid: this.sessionData.uID,
                                token: this.sessionData.token,
                                asName: keyword,
                                ascType: type,
                            };
                            api.postApi(this.UCAPI+'/SetAscrInfo', info).then(res =>{
                                console.log(res);
                                if(res.data.SysCode == 100200){
                                    Message.success(res.data.MSG);
                                    this.isShowNew = false;
                                    this.reset();
                                }else if(res.data.SysCode == 100302){
                                    this.loginTimeout();
                                }else{
                                    Message.warning(res.data.MSG);
                                }
                            }).catch(err =>{
                                console.log(err);
                            });
                    }else{
                        // 编辑
                        let { keyword, type, asrID } = this.companyInfo;
                        let info = {
                            uid: this.sessionData.uID,
                            token: this.sessionData.token,
                            asrID: asrID,
                            asName: keyword,
                            ascType: type,
                        };
                        api.postApi(this.UCAPI+'/UpdateAscrInfo', info).then(res =>{
                            console.log(res);
                            if(res.data.SysCode == 100200){
                                Message.success(res.data.MSG);
                                this.isShowNew = false;
                                for(let data of this.companyList){
                                    if(data.asrID == info.asrID){
                                        data.name = info.asName;
                                        data.type = info.ascType;
                                        break;
                                    }
                                }
                            }else if(res.data.SysCode == 100302){
                                this.loginTimeout();
                            }else{
                                Message.warning(res.data.MSG);
                            }
                        }).catch(err =>{
                            console.log(err);
                        });
                    }
                }else{
                    Message.warning('公司名称不能为空');
                }
            },
            //日期排序
            sortData(a, b) {
                return dateFormat.toDate(a.createTime, '') - dateFormat.toDate(b.createTime, '');                            
            },
            // 时间格式化
            formatTime(time) {
                return dateFormat.toDate(time);
            },
            // 角色格式化
            roleToText(type) {
                for (let data of this.typeArr) {
                    if (data.value == type) {
                        return data.label;
                    }
                }
            },
            // 状态转换
            stateToText(state) {
                for (let data of this.stateArr) {
                    if (data.value == state) {
                        return data.label;
                    }
                }
            },
            // 开通或者禁用：
            isForbidden(row) {
                console.log(row);
                MessageBox.confirm(
                    `是否${row.state==1 ? "禁用" : "开通"}该角色?`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                ).then(() => {
                    let info = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        asrID: row.asrID,
                        ascState: row.state==1 ? 0: 1
                    };
                    console.log('info----', row.state, info);
                    api.postApi(this.UCAPI + "/UpdateAscState", info)
                        .then(res => {
                            console.log(res.data);
                            if (res.data.SysCode == 100200) {
                                Message.success("操作成功");
                                row.state = row.state==1 ? 0 : 1;
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
            // 编辑
            isEdit(row){
                console.log(row);
                this.isShowNew = true;
                this.isAdd = false;
                this.companyInfo = {
                    keyword: row.name,
                    type: row.type-0,
                    asrID: row.asrID,
                };
            },
            loginTimeout() {
                Message.warning("登录超时,请重新登录");
                this.$router.push("/login");
            },
        },
        mounted(){
            this.getRole();
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
    /deep/.comList_container .el-input{
        max-width: 180px;
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
    a{
        color: #108ee9;
    }
    /deep/ .el-button [class*=el-icon-]+span, .select-wrap button .el-icon-search{
        position: relative;
        left: -2px;
        top: 0px;
    }
</style>


