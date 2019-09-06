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
                    <el-col :span="6">
                        <span>资源名称:</span>
                        <el-input v-model="searchInfo.keyword" placeholder="请输入资源名称"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <span>资产编号:</span>
                        <el-input v-model="searchInfo.keyword" placeholder="请输入资产编号"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <span>所在区域:</span>
                        <el-input v-model="searchInfo.keyword" placeholder="请输入所在区域"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <span>维护类型:</span>
                        <el-select v-model="searchInfo.type" placeholder="请选择维护类型" filterable>
                            <el-option v-for="item of typeArr" :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="6">
                        <span>维护状态:</span>
                        <el-select v-model="searchInfo.state" placeholder="请选择维护状态">
                            <el-option v-for="item of stateArr" :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span style="padding-left: 13px">提交者:</span>
                        <el-select v-model="searchInfo.engineer" placeholder="请选择提交者" filterable>
                            <el-option v-for="item of engineerArr" :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <span>巡点日期:</span>
                        <el-date-picker class="input-with-select" v-model="searchInfo.date" type="daterange"
                                        range-separator="-" format="yyyy/MM/dd" value-format="yyyy/MM/dd"
                                        start-placeholder="巡点日期" end-placeholder="巡点日期">
                        </el-date-picker>
                    </el-col>

                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-search" @click="search()" :disabled="!isSearch">搜索
                        </el-button>

                        <el-button @click="reset()">重置</el-button>
                        <!--<el-button @click="downLoad()">一键导出</el-button>-->
                    </el-col>
                </el-row>

            </div>
            <div class="table_wrap">
                <div class="table_dt">
                    <!-- <el-row v-for="(item, index) of currentPlan" :key="item.id" style="border-bottom:1px solid #ebeef5; padding-bottom: 12px;">
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
                     </el-row> -->
                    <el-table
                        v-loading="loading"
                        element-loading-text="拼命加载中..."
                        element-loading-spinner="el-icon-loading"
                        border
                        :data="currentPlan"
                        style="width: 100%">
                        <el-table-column
                            label="维护类型"
                            min-width="10.2%"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{scope.row.mtType}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            column-key="rtName"
                            prop="rtName"
                            label="资源"
                            min-width="8%">
                        </el-table-column>
                        <el-table-column
                            prop="city"
                            label="城市"
                            min-width="7%"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{scope.row.city || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="area"
                            label="区域"
                            min-width="7%"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{scope.row.area || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="mediaName"
                            label="媒体名称"
                            min-width="8%"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{scope.row.mediaName || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="assetTag"
                            label="资产编号"
                            min-width="12%"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.assetTag || '--' }}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="issueRecord"
                            label="问题记录"
                            min-width="6.1%"
                            class="tar"
                        >
                        </el-table-column>
                        <el-table-column
                            column-key="mState"
                            prop="mState"
                            label="状态"
                            min-width="8%">
                            <template slot-scope="scope">
                                <point-state :state-text="scope.row.mState"
                                             :color="stateToText(scope.row.mState).color"></point-state>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="100"
                        >
                            <template slot-scope="scope">
                                <el-dropdown size="small" trigger="click" placement="bottom-start"
                                             :hide-on-click="true">
                                    <span class="el-dropdown-link">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native.prevent="showPhoto(scope.row)"
                                                          v-if="scope.row.mtType=='巡点'">照片
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="toHandle(scope.row)"
                                                          v-if="scope.row.mtType=='巡点'">处理
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="showHistory(scope.row)">历史记录
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>

                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>
                </div>
                <div class="ad_pagination" v-if="pageData.totalSize">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="changePage"
                        @size-change="sizeChange"
                        :page-sizes="[10, 20, 50]"
                        :current-page.sync="pageData.pageNum"
                        :page-size="pageData.pageSize"
                        :total="pageData.totalSize">
                    </el-pagination>
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
            :title="handleModalTitle"
            :visible.sync="isShowHandle"
            width="30%">
            <div class="block">
                <span>处理日期：</span>
                <el-date-picker
                    v-model="maintainForm.date"
                    type="date"
                    placeholder="请选择出现时间">
                </el-date-picker>
            </div>
            <div class="remark">
                <span>{{handleModalTitle=='维修处理'?"处理说明":"媒体备注"}}：</span>
                <el-input type="textarea" v-model="maintainForm.reamrk" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请填处理说明"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowHandle = false">取 消</el-button>
                <el-button type="primary" @click="handleRemark()">确 定</el-button>
            </span>
        </el-dialog>
        <!--历史记录弹出框-->
        <el-dialog
            class="logList-wrap"
            title="历史记录"
            :visible.sync="isShowHistory"
            width="30%">
            <div class="loglist_box">
                <div class="title">
                    <p>{{logList.rtName}}</p>
                    <p>{{logList.mTitle}}({{logList.assetTag}})</p>
                </div>

                <log-list :list="logList.list"></log-list>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowHistory = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from "../../api/api.js";
    // 时间控件格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import sessFun from "../../commonFun/sessFun.js";
    import pointState from './components/pointState.vue';
    import {
        Row,
        Input,
        Button,
        Table,
        TableColumn,
        DatePicker,
        Select,
        Option,
        Message,
        Dropdown,
        DropdownMenu,
        DropdownItem,
    } from "element-ui";
    // 日志组件
    import logList from './components/logList.vue'
    import timeFormat from '../../commonFun/timeFormat.js';

    export default {
        name: "customList",
        components: {
            logList,
            pointState,
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
                pageData: {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 50,
                },
                // 登录信息
                sessionData: {},
                //加载中
                loading: false,
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
                // 类型
                typeArr: [
                    {
                        label: '巡点',
                        value: 1,
                    },
                    {
                        label: '待维修',
                        value: 2
                    },
                    {
                        label: '拆除',
                        value: 3
                    }
                ],
                // 工程人员
                engineerArr: [],
                // 表格数据
                currentPlan: [{
                    mState: '已处理',
                    mtType: '巡点',
                    rtName: '资源',
                    city: '城市',
                    area: '区域',
                    mediaName: '媒体名称',
                    assetTag: '资产编号',
                    issueRecord: '问题记录',
                }],
                //处理对话框
                maintainForm:{
                    date:'',
                    reamrk:'',
                },
                // 是否滚动加载
                loading_point: true,
                isSearch: true,
                isReset: true,
                // 搜索信息
                searchInfo: {
                    city: '',
                    area: [],
                    keyword: '',
                    state: '',
                    date: '',
                    engineer: '',
                },
                // 处理弹出框
                isShowHandle: false,
                handleModalTitle: '',
                //历史记录弹出框
                isShowHistory: false,
                remark: '',
                // 图片弹出框
                isShowImg: false,
                imgUrls: [
                    {
                        url: '',
                        type: 1,
                    }, {
                        url: '',
                        type: 2,
                    }
                ],
                // 问题列表
                logList: {
                    rtName: '中心西关海',
                    mTitle: '西南门',
                    assetTag: '005B201903GZ-X919',
                    list: [
                        {
                            id: 1,
                            time: '2019/08/30 20:32:56',
                            text: '这是一条很长很长的巡点记录，这是一条很长很长的巡点记录，这是一条很长很长的巡点记录。',
                            address: '广州市越秀区广州大道中307号福利新天地中心',
                            type: '巡点',
                        },
                        {
                            id: 2,
                            time: '2019/08/30 20:32:56',
                            text: '这是一条很长很长的巡点记录',
                            address: '广州市越秀区广州大道中307号福利新天地中心',
                            type: '待维修',
                        },
                        {
                            id: 3,
                            time: '2019/08/30 20:32:56',
                            text: '这是一条很长很长的巡点记录',
                            address: '广州市越秀区广州大道中307号福利新天地中心',
                            type: '拆除',
                        }
                    ]
                },
                logsId: [],
                multipleSelection: '',//选中的表格数据
            };
        },
        mounted: function () {
            this.getRole();
            this.getCompany();
            this.searchFun();
        },
        methods: {
            // 状态转换
            stateToText(state) {
                let arr = [
                    {
                        text: '已处理',
                        color: 'rgba(82,196,26,1)',
                    },
                    {
                        text: '未处理',
                        color: 'rgba(250,173,20,1)',
                    },

                ];
                for (let data of arr) {
                    if (data.text === state) {
                        return data;
                    }
                }
            },
            //表格方法
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                console.log(val)
                this.multipleSelection = val;
            },

            // 公司数据
            getCompany() {
                let sess = this.sessionData;
                let info = {
                    "data": {},
                    "service": "GetPermissionAscrInfo",
                    "token": this.sessionData.token,
                    "uid": this.sessionData.uID
                };
                api.postApi_new(this.apiVar.Media, info).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let result = [];
                        for (let data of res.data.data) {
                            let obj = {
                                label: data.asName,
                                value: data.asrID,
                            };
                            result.push(obj);
                        }
                        this.companyArr = result;
                    } else {
                        Message.warning(res.data.MSG);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // // 获取工程人员
            // getPeople() {
            //     let {company} = this.searchInfo;
            //     if (company) {
            //         this.getComUser(company);
            //     }
            // },
            // 获取公司工程人员
            getComUser(asrID) {
                let info = {
                    "service": "GetEPByAsrID",
                    "token": this.sessionData.token,
                    "uid": this.sessionData.uID,
                    "data": {
                        "asrID": asrID
                    },
                };
                api.postApi_new(this.apiVar.Media, info).then(res => {
                    console.log(res);
                    if (res.data.SysCode == 200200) {
                        let result = [];
                        for (let data of res.data.data) {
                            let obj = {
                                label: data.realName,
                                value: data.uID
                            }
                            result.push(obj);
                        }
                        this.engineerArr = result;
                    } else {
                        // Message.warning(res.data.MSG);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 展示图片
            showPhoto(item) {
                console.log(item);
                this.imgUrls = item.urls;
                this.isShowImg = true;
            },
            //历史记录
            showHistory(item) {
                console.log(item)
                this.isShowHistory = true
            },
            // 处理
            toHandle(item) {
                console.log(item);
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    service: "GetUntreatedPatrolPoint",
                    data: {
                        mID: item.mID
                    }
                };
                this.isShowHandle = true;
                this.handleModalTitle = item.mtType == '巡点' ? '巡点处理' : '维修处理'
                // api.postApi_new(this.apiVar.Media, info).then(res => {
                //     console.log(res.data);
                //     if (res.data.SysCode == 200200) {
                //         this.remark = item.remark || '暂无备注';
                //         let result = [];
                //         let logsId = [];
                //         for (let data of res.data.data) {
                //             let logInfo = {
                //                 id: data.id,
                //                 text: data.feedback,
                //                 time: data.patrolTime,
                //             };
                //             logsId.push(data.id);
                //             result.push(logInfo);
                //         }
                //         this.logList = result;
                //         this.logsId = logsId;
                //         this.isShowHandle = true;
                //     }
                // }).catch(err => {
                //     console.log(err);
                // });
            },
            // 确认备注
            handleRemark() {
                this.$confirm("确定后将更新媒体备注", "是否继续？", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(res => {
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
                    api.postApi_new(this.apiVar.Media, info).then(res => {
                        console.log(res.data);
                        if (res.data.SysCode == 200200) {
                            Message.success(res.data.MSG);
                            this.searchFun();
                            this.isShowHandle = false;
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(res => {
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
            searchFormat() {
                let session = this.sessionData;
                let info = {
                    uid: session.uID,
                    token: session.token,
                    service: 'GetPatrolPointList',
                    data: {}
                };
                let {company, keyword, state, date, engineer} = this.searchInfo;
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
            searchFun() {
                if (this.searchInfo.company) {
                    let info = this.searchFormat();
                    this.getData(info);
                }
            },
            // 滚动加载获取数据(无搜索数据)
            getData(params) {
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let dataInfo = res.data.data;
                        this.totalPage = dataInfo.totalPage;
                        let dataArr = dataInfo.list;
                        this.totalNum = dataInfo.total;
                        this.currentPlan = this.funcData(dataArr);
                        if (dataInfo.totalPage == 0) {
                            Message.warning('暂无数据');
                        }
                    } else {
                        this.totalNum = 0;
                        Message.warning(res.data.MSG);
                    }
                });
            },
            // 数据处理
            funcData(dataArr) {
                let result = [];
                for (let data of dataArr) {
                    let tmpObj = '';
                    tmpObj = this.setTableData(data);
                    result.push(tmpObj);
                }
                return result;
            },
            // 搜索(优化)
            search() {
                let {company, keyword, state, date, engineer} = this.searchInfo;
                this.isSearch = false;
                let timer = setTimeout(() => {
                    this.isSearch = true;
                    clearTimeout(timer);
                }, 1000);
                if (company) {
                    this.currentPlan = [];
                    this.loading = true;
                    this.loading_point = false;
                    this.currPage = 1;
                    this.searchFun()
                } else {
                    this.$message.warning('请先选择公司');
                }
            },
            // 分页
            changePage(val) {
                // console.log('当前页',val)
                this.pageData.pageNum = val
                this.getData()
            },
            // 每页条数切换
            sizeChange(val) {
                this.pageSize = val;
                this.currPage = 1;
                this.searchFun();
            },
            // 设置表格数据
            setTableData(item) {
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
                    uploadWhere: item.patrolPointPics.length ? item.patrolPointPics[0].uploadAddress : '',
                    user: item.realName,
                    question: item.feedback,
                    state: item.status,
                    remark: item.mRemark,
                    urls: []
                };
                if (item.patrolPointPics && item.patrolPointPics.length) {
                    let arr = [];
                    for (let data of item.patrolPointPics) {
                        let itemObj = {
                            type: data.uploadType == 'camera' ? 1 : 2,
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
            downLoad() {
                Message.warning("该功能尚未完善");
            },
            // 重置
            reset() {
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
                let timer = setTimeout(() => {
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
        }
    };
</script>

<style scoped>
    .table_wrap {
        margin: 24px 32px;
    }

    /deep/ .mediaList_container .el-row {
        margin-bottom: 15px;
    }

    /deep/ .mediaList_container .el-row span {
        font-size: 14px;
    }

    .table_dt dl dt {
        font-size: 14px;
    }

    .table_dt dl dd {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
    }

    /deep/ .mediaList_container .el-select,
    /deep/ .mediaList_container .el-input,
    /deep/ .mediaList_container .el-input__inner {
        width: 202px;
        max-width: 202px;
        height: 32px;
    }

    /deep/ .table_dt .el-table__row .cell span {
        overflow: hidden;
    }

    .red {
        background-color: #FF6E6E;
    }

    .green {
        background-color: #52C41A;
    }

    .mediaList_container .el-row .span_style {
        border-radius: 12px;
        color: #fff;
        width: 54px;
        display: inline-block;
        text-align: center;
        font-size: 12px;
    }

    .span_a {
        color: #1890FF;
        cursor: pointer;
    }

    .img_span_style {
        border-radius: 12px;
        color: #fff;
        width: 130px;
        display: inline-block;
        text-align: center;
        font-size: 12px;
        background: #979797;
    }

    .loglist_box .title {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        padding: 8px 12px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 16px;
    }
    .loglist_box .title p:last-child{
        font-size: 14px;
        margin-top: 2px;
    }
    /deep/ .logList-wrap .el-dialog__body {
        padding: 6px 20px 30px;
    }

    /deep/ .logList-wrap .el-dialog__title {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
    }

    .point_style {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /deep/ .el-dropdown-link {
        cursor: pointer;
        color: #108ee9;
    }
    .block,.remark{
        display: flex;
        align-items: center;
    }
    .remark{
        margin-top: 16px;
    }
    /deep/ .block  .el-date-editor.el-input__inner,/deep/ .block .el-input--prefix .el-input__inner{
        height: 32px;
        width: 300px;
    }
    /deep/ .block .el-input__prefix, .el-input__suffix{
        top: -3px;
    }
    /deep/ .remark .el-textarea__inner{
        width: 300px;
        height: 74px;
        resize: none;
    }
    /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
        min-width: 300px;
    }
    /deep/.remark .el-textarea{
        width: 300px;
    }
    /deep/.ad_mediaDetail_wrap .el-date-editor .el-range__icon{
        position: relative;
        top: -3px;
    }
    /deep/.ad_mediaDetail_wrap .el-date-editor .el-range-separator{
        line-height: 25px;
    }
</style>
