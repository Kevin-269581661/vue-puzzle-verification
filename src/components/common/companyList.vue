<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">公司管理</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>公司列表</h2>
            </div>
            <div class="mediaList_container">
                <el-row :gutter="32">
                    <el-col class="name_row">
                        <span>公司名称:</span>
                        <el-input v-model="searchInfo.keyword" placeholder="请输入" size="small"></el-input>
                    </el-col>
                    <el-col>
                        <span>公司类型:</span>
                        <el-select v-model="searchInfo.type" placeholder="请选择" size="small">
                            <el-option v-for="item of typeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span>状态:</span>
                        <el-select v-model="searchInfo.state" placeholder="请选择" size="small">
                            <el-option v-for="item of stateArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <el-button type="primary" icon="el-icon-search" @click="search()" :disabled="!isSearch">查询</el-button>
                        <el-button plain @click="reset()">重置</el-button>
                        <el-button plain @click="newCom()" v-if="showNewBtn">新建</el-button>
                    </el-col>
				</el-row>
                <div class="table_wrap">
                    <el-table border :data="companyList"  @sort-change="sortChange" v-loading="loading" 
                        element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                        <el-table-column label="公司名称" min-width="11.8%" prop="name">
                        </el-table-column>
                        <el-table-column prop="type" label="公司类型" min-width="8.1%">
                            <template slot-scope="scope">
                                <span>{{roleToText(scope.row.type)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建日期" min-width="9.8%" sortable="custom">
                            <template slot-scope="scope">
                                <span>{{formatTime(scope.row.createTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="state" label="状态" min-width="8.9%">
                            <template slot-scope="scope">
                                <point-state :state-text="stateToText(scope.row.state).label" :color="stateToText(scope.row.state).color"></point-state>                                                                
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="7.1%">
                            <template slot-scope="scope">
                                <span v-if="scope.row.state ==1" style="color: #108EE9;cursor: pointer;" @click="isForbidden(scope.row)">禁用</span>
                                <span v-if="scope.row.state ==0" style="color: #108EE9;cursor: pointer;" @click="isForbidden(scope.row)">开通</span>
                                <span style="color: #108EE9;cursor: pointer; margin-left:10px;" @click="isEdit(scope.row)">编辑</span>
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
                <el-button plain @click="isShowNew = false">取 消</el-button>
                <el-button type="primary" @click="handleCompany()">确 定</el-button>
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
    import sessFun from "../../commonFun/sessFun.js";
    import api from "../../api/api.js";
    import noSearchResult from "./components/noSearchResult.vue";  
    import pointState from './components/pointState.vue';    
      
    export default {
        components: {
            noSearchResult,
            pointState,
        },
        data(){
            return{
                // 分页信息
                paginationShow: true,
                pageSize: 10,
                pageSizes: [10, 20, 50],
                currPage: 1,
                totalPage: 0,
                totalNum: 0,
                // 登录信息
                sessionData:{},
                // 搜索数据
                searchInfo:{
                    keyword: '',
                    type: '',
                    state: '',
                    // 按照啥排序
                    orderby: '',
                    // 升序降序0/1
                    desc: "",
                },
                isSearch: true,
                isReset: true,
                // 状态
                stateArr: [
                    {
                        label: '正常',
                        value: 1,
                        color: 'rgba(82,196,26,1)'
                    },
                    {
                        label: '禁用',
                        value: -1,
                        color: 'rgba(245,34,45,1)'
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
            }
        },
        methods:{
            // 切换页码
            changePage(page) {
                this.currPage = page;
                console.log('page----', page);
                this.searchFun();
            },
            // 每页条数切换
            sizeChange(val) {
                this.pageSize = val;
                this.currPage = 1;
                this.searchFun();
            },
            // 判断角色是否有新建按钮(系统管理员和超级管理员有)
            getRole() {
                this.sessionData = sessFun.getSess();
                let role = this.sessionData.ascType;
                console.log(role);
                if (role == 0 ) {
                    this.showNewBtn = true;
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
            // 滚动获取列表数据
            getData(params){
                api.getApi(this.apiVar.UCAPI+'/AscrList', params).then(res =>{
                    console.log(res.data);
                    if(!res.data.SysCode){
                        console.log(res.data);
                        let dataInfo = res.data;
                        this.totalNum = dataInfo.count;
                        let dataArr = dataInfo.data;
                        this.companyList = this.funcData(dataArr);
                        this.loading = false;
                        if(dataInfo.totalpage == 0){
                            Message.warning('暂无数据');
                        }
                    }else{
                        Message.warning(res.data.MSG);
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
                let { keyword, type, state, orderby, desc } = this.searchInfo;
                info = {
                    ...info,
                    ...(keyword && {ascName: keyword}),
                    ...(state>=0 && {astate: state}),
                    ...(type>=0 && {asType: type}),
                    ...(orderby && {orderby}),
                    ...(desc!=='' && desc>=0 &&{desc})
                };
                return info;
            },
            // 设置表格数据
            setTableData(item){
                let obj = {
                    asrID: item.asrID || '',
                    name: item.asName || '',
                    state: item.ascState ? item.ascState : '',
                    type: item.ascType>=0 ? item.ascType : '',
                    createTime: item.createTime || '',
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
                if(keyword || (type!=='') || (state!=='')){
                    this.companyList = [];
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
                            api.postApi(this.apiVar.UCAPI+'/SetAscrInfo', info).then(res =>{
                                console.log(res);
                                if(res.data.SysCode == 100200){
                                    Message.success(res.data.MSG);
                                    this.isShowNew = false;
                                    this.reset();
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
                        api.postApi(this.apiVar.UCAPI+'/UpdateAscrInfo', info).then(res =>{
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
                        return data;
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
                        ascState: row.state==1 ? -1: 1
                    };
                    console.log('info----', row.state, info);
                    api.postApi(this.apiVar.UCAPI + "/UpdateAscState", info)
                        .then(res => {
                            console.log(res.data);
                            if (res.data.SysCode == 100200) {
                                Message.success("操作成功");
                                row.state = row.state==1 ? 0 : 1;
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
        },
        mounted(){
            this.getRole();
            this.searchFun();
        },
    };
</script>
<style scoped>
    a{
        color: #108ee9;
    }
    /deep/.el-row span{
        font-size: 14px;
    }
    /deep/.el-col-24{
        width: auto;
    }
    /deep/.el-col-24:not(:last-child){
        min-width: 25%;
    }
    /deep/.el-row .el-select{
        width: calc(98% - 60px);
    }
    /deep/.name_row .el-input{
        width: calc(98% - 60px);        
    }
</style>


