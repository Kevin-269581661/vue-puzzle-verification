<template>
	<div class="ad_mediaDetail_wrap clearfix">
		<div class="ad_mediaDetail_nav ">
			<p class="clearfix">
				<a href="#" style="color: #999">维护管理</a>
			</p>
		</div>
		<div class="mediaList_wrap">
			<div class="mediaList_head">
				<h2>维护列表</h2>
			</div>
			<div class="mediaList_container">
				<el-row>
                    <el-col :span="8">
                        <span>所在公司:</span>
                        <el-select v-model="searchInfo.company" placeholder="请选择公司" @change="getPeople()" filterable>
                            <el-option v-for="item of companyArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <span>资源名称:</span>
                        <el-input v-model="searchInfo.keyword" placeholder="请输入"></el-input>
                    </el-col>
                    <el-col :span="8">
                        <span>处理状态:</span>
                        <el-select v-model="searchInfo.state" placeholder="请选择处理状态">
                            <el-option v-for="item of stateArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
				</el-row>
                <el-row>
                    <el-col :span="8">
                        <span>巡点日期:</span>
                        <el-date-picker class="input-with-select" v-model="searchInfo.date" type="daterange" range-separator="-" format="yyyy/MM/dd" value-format="yyyy/MM/dd" start-placeholder="巡点日期" end-placeholder="巡点日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="8">
                        <span>工程人员:</span>
                        <el-select v-model="searchInfo.engineer" placeholder="请选择工程人员" filterable>
                            <el-option v-for="item of engineerArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary" icon="el-icon-search" @click="search()" :disabled="!isSearch">查询</el-button>
                        <el-button @click="downLoad()">一键导出</el-button>
                        <el-button @click="reset()">重置</el-button>
                    </el-col>
                </el-row>
				<div class="table_wrap">
                    <div class="table_dt">
                        <el-row v-for="(item, index) of currentPlan" :key="item.id" style="border-bottom:1px solid #ebeef5; padding-bottom: 12px;">
                            <el-col :span="6">
                                <dl>
                                    <dt>{{item.resName+'·'+item.mediaName+'·'+item.assetTag}}</dt>
                                    <dd>{{item.city+item.area}}</dd>
                                </dl>
                            </el-col>
                            <el-col :span="4">
                                <dl>
                                    <dd>巡点时间</dd>
                                    <dd>{{item.checkTime}}</dd>
                                </dl>
                            </el-col>
                            <el-col :span="4">
                                <dl>
                                    <dd>上传地点</dd>
                                    <el-tooltip class="item" effect="dark" :content="item.uploadWhere" placement="bottom" v-if="item.uploadWhere && item.uploadWhere.length>15">
                                        <dd class="point_style">{{item.uploadWhere}}</dd>
                                    </el-tooltip>
                                    <dd v-else class="point_style">{{item.uploadWhere}}</dd>
                                </dl>
                            </el-col>
                            <el-col :span="2">
                                <dl>
                                    <dd>工程人员</dd>
                                    <dd>{{item.user}}</dd>
                                </dl>
                            </el-col>
                            <el-col :span="4">
                                <dl>
                                    <dd>反馈问题</dd>
                                    <el-tooltip class="item" effect="dark" :content="item.question" placement="bottom" v-if="item.question&&item.question.length>15">
                                        <dd class="point_style">{{item.question}}</dd>
                                    </el-tooltip>
                                    <dd v-else class="point_style">{{item.question}}</dd>
                                </dl>
                            </el-col>
                            <el-col :span="2" style="line-height:2;">
                                <span :class="item.state==2?'green span_style':'red span_style'">{{item.state==1?'未处理':'已处理'}}</span>
                            </el-col>
                            <el-col :span="2" style="line-height:2;">
                                <span @click="showPhoto(item, index)" class="span_a">照片</span>
                                <span style="color:#D8D8D8;" v-if="item.state==1">|</span>
                                <span @click="toHandle(item)" class="span_a" v-if="item.state==1">处理</span>
                            </el-col>
                        </el-row> 
                    </div>

                    <div class="ad_pagination" v-if="totalNum" >
                        <el-pagination small background 
                            :current-page.sync="currPage" 
                            :page-sizes="[10, 20, 50]" 
                            :page-size="pageSize" 
                            layout="sizes, prev, pager, next, jumper" 
                            :total="totalNum" 
                            @size-change="sizeChange" 
                            @current-change='changePape'>
                        </el-pagination>
                    </div>
				</div>
			</div>
		</div>

        <!-- 照片弹出框 -->
         <el-dialog
            title="巡点照片"
            :visible.sync="isShowImg"
            width="60%">
            <div style="display:flex">
                <p v-for="(item, index) of imgUrls" :key="index" style="margin:0px 10px;text-align: center;">
                    <img :src="item.url" alt="" style="width:360px;height:480px;">
                    <span style="width: 100%;display: inline-block;text-align: center;">
                        <span class="img_span_style">{{item.type==1?'手机拍摄':'相册上传'}}</span>
                    </span>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
            </span>
        </el-dialog>

        <!-- 处理弹出框 -->
        <el-dialog
            title="问题处理"
            :visible.sync="isShowHandle"
            width="30%">
            <div class="loglist_box">
                <log-list :list="logList"></log-list>
            </div>
            <p>原备注：</p>
            <el-input v-model="remark" placeholder="请输入内容" type="textarea"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowHandle = false">取 消</el-button>
                <el-button type="primary" @click="handleRemark()">确 定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
import api from "../../api/api.js";
// 时间控件格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";
import {
    Row,
    Input,
    Button,
    Table,
    TableColumn,
    DatePicker,
    Select,
    Option,
    Message
} from "element-ui";
// 日志组件
import logList from './components/logList.vue'
import timeFormat from '../../commonFun/timeFormat.js';

export default {
    name: "customList",
    components: {
        logList,
        elRow: Row,
        elInput: Input,
        elButton: Button,
        elTable: Table,
        elTableColumn: TableColumn,
        elDatePicker: DatePicker,
        elSelect: Select,
        elOption: Option
    },
    data() {
        return {
            // 公司列表
            companyArr: [],
            pageSize: 10,
            currPage: 1,
            totalPage: 0,
            totalNum: 0,
            // 登录信息
            sessionData:{},
            //加载中
            loading: true,
            // 状态
            stateArr: [
                {
                    label: '已处理',
                    value: 2,
                },
                {
                    label: '未处理',
                    value: 1
                }
            ],
            // 工程人员
            engineerArr:[],
            // 表格数据
            currentPlan: [],
            // 是否滚动加载
            loading_point: true,
            isSearch: true,
            isReset: true,
            // 搜索信息
            searchInfo:{
                city: '',
                area: [],
                keyword: '',
                state: '',
                date: '',
                engineer: '',
            },
            // 处理弹出框
            isShowHandle: false,
            remark: '',
            // 图片弹出框
            isShowImg: false,
            imgUrls: [
                {
                    url: '',
                    type: 1,
                },{
                    url: '',
                    type: 2,
                }
            ],
            // 问题列表
            logList: [],
            logsId: [],
        };
    },
    mounted: function() {
        this.getRole();
        this.getCompany();
        this.searchFun();
    },
    methods: {
        // 公司数据
        getCompany(){
            let sess = this.sessionData;
            let info = {
                "data":{},
                "service":"GetPermissionAscrInfo",
                "token": this.sessionData.token,
                "uid": this.sessionData.uID
            };
            api.postApi_new(this.apiVar.Media, info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    let result = [];
                    for(let data of res.data.data){
                        let obj = {
                            label: data.asName,
                            value: data.asrID,
                        };
                        result.push(obj);
                    }
                    this.companyArr = result;
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
                }
            }).catch(err =>{
                console.log(err);
            });
        },
        // 获取工程人员
        getPeople(){
            let { company } = this.searchInfo;
            if(company){
                this.getComUser(company);
            }
        },
        // 获取公司工程人员
        getComUser(asrID){
            let info = {
                "service":"GetEPByAsrID",
                "token": this.sessionData.token,
                "uid": this.sessionData.uID,
                "data":{
                    "asrID": asrID
                },
            };
            api.postApi_new(this.apiVar.Media, info).then(res =>{
                console.log(res);
                if(res.data.SysCode == 200200){
                    let result = [];
                    for(let data of res.data.data){
                        let obj = {
                            label: data.realName,
                            value: data.uID
                        }
                        result.push(obj);
                    }
                    this.engineerArr = result;
                }else{
                    // Message.warning(res.data.MSG);
                }
            }).catch(err =>{
                console.log(err);
            });
        },
        // 展示图片
        showPhoto(item){
            console.log(item);
            this.imgUrls = item.urls;
            this.isShowImg = true;
        },
        // 处理
        toHandle(item){
            console.log(item);
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                service: "GetUntreatedPatrolPoint",
                data: {
                    mID: item.mID
                }
            };
            api.postApi_new(this.apiVar.Media, info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    this.remark = item.remark||'暂无备注';
                    let result = [];
                    let logsId = [];
                    for(let data of res.data.data){
                        let logInfo = {
                            id: data.id,
                            text: data.feedback,
                            time: data.patrolTime,
                        };
                        logsId.push(data.id);
                        result.push(logInfo);
                    }
                    this.logList = result;
                    this.logsId = logsId;
                    this.isShowHandle = true;
                }
            }).catch(err =>{
                console.log(err);
            });
        },
        // 确认备注
        handleRemark(){
            this.$confirm("确定后将更新媒体备注", "是否继续？", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(res=>{
                console.log(res);
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    service: "SaveFeedbackResult",
                    data: {
                        pids: this.logsId.join(','),
                        result: this.remark,
                    }
                };
                api.postApi_new(this.apiVar.Media, info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        Message.success(res.data.MSG);
                        this.searchFun();
                        this.isShowHandle = false;
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            }).catch(res=>{
                console.log(res);
            })
        },
        // 判断角色是否有新建按钮(销售有)
        getRole() {
            this.sessionData = sessFun.getSess();
            let role = this.sessionData.uType;
            console.log(role);
        },
        // 搜索数据格式化
        searchFormat(){
            let session = this.sessionData;
            let info = {
                uid: session.uID,
                token: session.token,
                service: 'GetPatrolPointList',
                data: {}
            };
            let { company, keyword, state, date, engineer } = this.searchInfo;
            let data = {
                pageNum: this.currPage,
                pageSize: this.pageSize,
            };
            data = {
                ...data,
                ...(company && {asrID: company}),
                ...(keyword && {resName: keyword}),
                ...(state && {status: state}),
                ...(date && {bt: timeFormat.toDate(date[0], '-'), et: timeFormat.toDate(date[1], '-')}),
                ...(engineer && {epID: engineer}),
            };
            info.data = data;
            return info;
        },
        searchFun(){
            if(this.searchInfo.company){
                let info = this.searchFormat();
                this.getData(info);
            }
        },
        // 滚动加载获取数据(无搜索数据)
        getData(params){
            api.postApi_new(this.apiVar.Media, params).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    if(res.data.SysCode == 200200){
                        let dataInfo = res.data.data;
                        this.totalPage = dataInfo.totalPage;
                        let dataArr = dataInfo.list;
                        this.totalNum = dataInfo.total;
                        this.currentPlan = this.funcData(dataArr);
                        if(dataInfo.totalPage == 0){
                            Message.warning('暂无数据');
                        }
                    }else{
                        this.totalNum = 0;
                        Message.warning(res.data.MSG);
                    }
                }
            });
        },
        // 数据处理
        funcData(dataArr){
            let result = [];
            for(let data of dataArr){
                let tmpObj = '';
                tmpObj = this.setTableData(data);
                result.push(tmpObj);
            }
            return result;
        },
        // 搜索(优化)
        search(){
            let { company, keyword, state, date, engineer } = this.searchInfo;
            this.isSearch = false;
            let timer = setTimeout(()=>{
                this.isSearch = true;
                clearTimeout(timer);
            }, 1000);
            if(company){
                this.currentPlan = [];
                this.loading = true;
                this.loading_point = false;
                this.currPage = 1;
                this.searchFun()
            }else{
                this.$message.warning('请先选择公司');
            }
        },
        // 切换页码
        changePape(page){
            this.currPage = page;
            this.searchFun();
        },
        // 每页条数切换
        sizeChange(val){
            this.pageSize = val;
            this.currPage = 1;
            this.searchFun();
        },
        // 设置表格数据
        setTableData(item){
            let obj = {
                id: item.id,
                mID: item.mID,
                resName: item.resName,
                assetTag: item.assetTag,
                mediaName: item.mTitle,
                city: item.prName,
                area: item.rName,
                rid: item.prID,
                checkTime: item.patrolTime,
                uploadWhere: item.patrolPointPics.length? item.patrolPointPics[0].uploadAddress:'',
                user: item.realName,
                question: item.feedback,
                state: item.status,
                remark: item.mRemark,
                urls: []
            };
            if(item.patrolPointPics && item.patrolPointPics.length){
                let arr = [];
                for(let data of item.patrolPointPics){
                    let itemObj = {
                        type: data.uploadType=='camera'? 1: 2,
                        url: data.url,
                        address: data.uploadAddress
                    };
                    arr.push(itemObj);
                }
                obj.urls = arr;
            }
            return obj;
        },
        // 时间格式化
        formatTime(time) {
            return dateFormat.toDate(time);
        },
        // 导出
        downLoad(){
            Message.warning("该功能尚未完善");
        },
        // 重置
        reset(){
            this.searchInfo = {
                area: [],
                keyword: '',
                state: '',
                date: '',
                engineer: ''
            };
            this.currPage = 1;
            console.log(this.searchInfo);
            this.currentPlan = [];
            this.isReset = false;
            let timer = setTimeout(()=>{
                this.isReset = true;
                clearTimeout(timer);
            }, 1000);
        },
        // 新建按钮
        newClient() {
            this.$router.push("./createClient");
        },
        // 查看按钮
        showDetail(data) {
            sessionStorage.setItem("customerId", data.uID);
            this.$router.push("./clientDetail");
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
    }
};
</script>

<style scoped>
/deep/ .mediaList_container .el-row{
    margin-bottom: 15px;
}
/deep/ .mediaList_container .el-row span{
    font-size: 14px;
}

/deep/ .el-date-editor .el-range__icon {
    position: relative;
    top: -3px;
    margin-right: 2px;
}

/deep/ .el-range-separator {
    position: relative;
    top: -3px;
}

/deep/ .el-input__inner {
    max-width: 200px;
    height: 32px;
}
/deep/ .el-date-editor{
    max-width: 300px;
    width: 300px;
}

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
    float: left;
    position: relative;
}

.el-input {
    width: 240px;
    border-radius: 4px;
}

.table_dt{
    padding-top: 12px;
    border-top: 1px solid rgb(235, 238, 245);
}
.table_dt dl dt{
    font-size: 14px;
}
.table_dt dl dd{
    font-size: 14px;
    color:rgba(0,0,0,0.45);
}
/deep/ .mediaList_container .el-select,
/deep/ .mediaList_container .el-input,
/deep/ .mediaList_container .el-input__inner{
    width: 250px;
    max-width: 250px;
}

.red{
    background-color: #FF6E6E;
}
.green{
    background-color: #52C41A;
}
.mediaList_container .el-row .span_style{
    border-radius: 12px;
    color: #fff;
    width: 54px;
    display: inline-block;
    text-align: center;
    font-size: 12px;
}
.span_a{
    color: #1890FF;
    cursor: pointer;
}
.img_span_style{
    border-radius: 12px;
    color: #fff;
    width: 130px;
    display: inline-block;
    text-align: center;
    font-size: 12px;
    background: #979797;
}
.loglist_box{
    height:220px; 
    overflow-x:hidden;
    overflow-y:scroll;
}
.loglist_box::-webkit-scrollbar {
    width: 6px;
    background: #fafafa;
}
.loglist_box::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c1c1c1;
    border-radius: 4px;
}
.point_style{
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
