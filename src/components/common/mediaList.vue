<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p><a href="#" style="color: #999">媒体管理</a></p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>媒体列表</h2>
            </div>
            <div class="mediaList_container">
                <div class="handel_ul">
                    <li class="handel_ul_li handel_ul_li_select">
                        <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select"
                                  size="small" @change="initData">
                            <el-select v-model="selectInfo" slot="prepend" placeholder="请选择">
                                <el-option
                                    v-for="item in SelOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-input>
                    </li>
                    <li class="handel_ul_li handel_ul_li_city">
                        <el-cascader
                            v-if="cityOther"
                            :options="cityOptions"
                            v-model="selectedOptions"
                            separator="-"
                            :show-all-levels="false"
                            placeholder="请选择城市"
                            filterable
                            size="small"
                            style="width: 100%"
                            clearable
                            @change="handleChange">
                        </el-cascader>
                    </li>
                    <li class="handel_ul_li handel_ul_li_area">
                        <el-select v-model="selectRName" placeholder="请选择区域" :clearable="true"
                                   style="width: 100%" size="small" @change="getRegion">
                            <el-option v-for="item in regionOpt"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </li>
                    <li class="handel_ul_li handel_ul_li_btn">
                        <el-button type="primary" icon="el-icon-search" @click="searchFun" :disabled="searchBtnAbled">搜索</el-button>
                        <el-button plain @click="clearSearch">重置</el-button>
                        <el-button plain @click="newMedia" v-if="showNewBtn">新建</el-button>
                        <el-button plain @click="importMedia" v-if="showImportBtn">导入媒体</el-button>
                        <el-button plain @click="maintain" v-if="!showImportBtn">维护管理</el-button>
                    </li>
                    <li class="handel_ul_li push_map_btn">
                        <el-button plain @click="showPushMap" v-if="showImportBtn">推送地图</el-button>
                    </li>
                </div>
                <div class="table_wrap">
                    <el-table
                        v-loading="loading"
                        element-loading-text="拼命加载中..."
                        element-loading-spinner="el-icon-loading"
                        border
                        :data="currentPlan"
                        style="width: 100%"
                        @filter-change="filterChange"
                        :default-sort="{prop: 'resName', order: 'descending'}">
                        <el-table-column
                            label="资源名称"
                            min-width="10.2%"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
								<span @click="mediaDetail(scope.row)"
                                      style="color: #108ee9;cursor: pointer">
									{{scope.row.resName}}
								</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            column-key="rtName"
                            prop="rtName"
                            label="资源类型"
                            min-width="8%"
                            :filters="[
							{ text: '社区', value: '1' },
							{ text: '写字楼', value: '2' },
							]"
                            :filter-multiple="false">
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
                            prop="rName"
                            label="区域"
                            min-width="7%"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{scope.row.rName || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="tradingArea"
                            label="商圈"
                            min-width="8%"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{scope.row.tradingArea || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="mVehicle"
                            label="媒体类型"
                            min-width="7.4%"
                            :show-overflow-tooltip="true"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="mTitle"
                            label="媒体名称"
                            min-width="8.2%"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{scope.row.mTitle || '--' }}</span>
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
                            prop="pNum"
                            label="可投面数"
                            min-width="6.1%"
                            class="tar"
                        >
                        </el-table-column>
                        <el-table-column
                            column-key="mState"
                            prop="mState"
                            label="媒体状态"
                            min-width="8%"
                            :filters="[
                                { text: '禁用', value: '0' },
                                { text: '正常', value: '1' },
                                { text: '待安装', value: '2' },
                                { text: '待维修', value: '3' },
							]"
                            :filter-multiple="false">
                            <template  slot-scope="scope">
                                <span v-if="scope.row.mState == 1 && scope.row.mVehicle === '广告门' && scope.row.pNum > 1" >
                                    <el-tooltip class="item" effect="dark" placement="left-start">
                                        <div slot="content">
                                            A面:{{scope.row.asState.A == '1' ? '正常' : '禁用'}}  B面:{{scope.row.asState.B == '1' ? '正常' : '禁用'}}
                                        </div>
                                         <point-state :state-text="stateToText(scope.row.mState).text" :color="stateToText(scope.row.mState).color"></point-state>
                                    </el-tooltip>
                                </span>
                                <point-state v-else :state-text="stateToText(scope.row.mState).text" :color="stateToText(scope.row.mState).color"></point-state>
                                <!--<span v-if="scope.row.mState === '正常' && scope.row.mVehicle === '广告门' && scope.row.pNum > 1">-->
                                    <!--<el-tooltip class="item" effect="dark" placement="left-start">-->
                                        <!--<div slot="content">-->
                                            <!--A面:{{scope.row.asState.A == '1' ? '正常' : '禁用'}}  B面:{{scope.row.asState.B == '1' ? '正常' : '禁用'}}-->
                                        <!--</div>-->
                                        <!--<point-state :state-text="scope.row.mState" :color="stateToText(scope.row.mState).color"></point-state>-->
                                    <!--</el-tooltip>-->
                                <!--</span>-->
                                <!--<point-state v-else :state-text="scope.row.mState" :color="stateToText(scope.row.mState).color"></point-state>-->
                            </template>
                        </el-table-column>
                        <el-table-column
                            v-if="showNewBtn"
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
                                        <el-dropdown-item command="0"
                                            @click.native.prevent="changeState('0',scope.$index, scope.row)"
                                            :disabled="scope.row.mState == '0'">禁用</el-dropdown-item>
                                        <el-dropdown-item command="1"
                                            @click.native.prevent="changeState('1',scope.$index, scope.row)">
                                            正常
                                        </el-dropdown-item>
                                        <el-dropdown-item command="2"
                                            @click.native.prevent="changeState('2',scope.$index, scope.row)"
                                            :disabled="scope.row.mState === '2'">待安装</el-dropdown-item>
                                        <el-dropdown-item command="3"
                                            @click.native.prevent="changeState('3',scope.$index, scope.row)"
                                            :disabled="scope.row.mState === '3'">待维修</el-dropdown-item>
                                        <el-dropdown-item command="4"
                                                          @click.native.prevent="changeState('4',scope.$index, scope.row)"
                                                          :disabled="scope.row.mState === '4'">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>
                </div>
                <div class="ad_pagination">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="changePage"
                        @size-change="changeSize"
                        :page-sizes="[10, 20, 50]"
                        :current-page.sync="pageData.pageNum"
                        :page-size="pageData.pageSize"
                        :total="pageData.totalSize">
                    </el-pagination>
                </div>
            </div>
            <!--媒体禁用、启用-->
            <el-dialog
                :title="isDisabled ? '禁用媒体' : '启用媒体'"
                :visible.sync="mStateDialogVisible"
                :close-on-click-modal="false"
                custom-class="mStatueDialog">
                <div>
                    <el-checkbox v-model="mediaState.allState"  @change="stateChange('all')">全部</el-checkbox>
                    <el-checkbox v-model="mediaState.AState"
                                 :disabled="mediaState.ADisable"
                                 @change="stateChange('A')">A面</el-checkbox>
                    <el-checkbox v-model="mediaState.BState"
                                 :disabled="mediaState.BDisable"
                                 @change="stateChange('B')">B面</el-checkbox>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" @click="mStateDialogVisible = false">取 消</el-button>
                    <el-button size="mini" type="primary" style="margin-left: 35px" @click="submitMediaState">确 定</el-button>
                </span>
            </el-dialog>
            <!--媒体导入模态框-->
            <el-dialog
                title="媒体导入"
                :visible.sync="ImportDialogVisible"
                :close-on-click-modal="false"
                custom-class="Import_dialog"
                top="30vh"
                width="300px">
                <ul class="import_ul">
                    <li>
                        <el-select v-model="importAsrID" size="small" filterable :loading="importSelectLoading" placeholder="请选择所属公司">
                            <el-option
                                v-for="(item,index) in companyList"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </li>
                    <li>
                        <el-upload
                            class="upload_file"
                            ref="upload"
                            accept=".xlsx,.xls"
                            :action="doUpload"
                            :show-file-list="true"
                            :file-list="fileData"
                            :http-request="uploadFile"
                            :on-remove="fileRemove"
                            :multiple="false">
                            <a :href ='this.apiVar.qadnUrl + "/importTemplate/mediaTemplate.xlsx"'
                               class="el-icon-download aButton" download="媒体导入模板.xlsx" @click="dowmLoadFun">下载模板</a>
                            <el-button plain icon="el-icon-upload2" class="el_upload_btn">上传文件</el-button>
                        </el-upload>
                    </li>
                </ul>
                <div slot="footer" class="">
                    <el-button @click="ImportDialogVisible = false">取 消</el-button>
                    <el-button type="primary"  @click="submitUpload">导 入</el-button>
                </div>
            </el-dialog>
            <!--导入失败的媒体列表-->
            <el-dialog
                :visible.sync="showUploadFail"
                :close-on-click-modal="false"
                title="导入媒体失败信息"
                custom-class="error_media"
                top="20vh"
                width="60%">
                <div class="car-title">
                    <i class="el-icon-info" style="color: #1890FF;"></i>
                    <h4>已成功导入媒体<span>{{excelObj.successNum}}</span>个,问题媒体<span>{{excelObj.failNum}}</span>个
                        <span @click="downLoadExcel()">下载表格<i class="el-icon-download"></i></span>
                    </h4>
                </div>
                <el-table
                    border
                    :data="excelDataUpload"
                    style="width: 100%" >
                    <el-table-column  prop="resID" label="resID" min-width="55" >
                    </el-table-column>
                    <el-table-column prop="resName" label="资源名称" min-width="80" >
                    </el-table-column>
                    <el-table-column prop="city" label="市区" min-width="80" >
                    </el-table-column>
                    <el-table-column prop="mtitle" label="媒体名称" min-width="85" >
                    </el-table-column>
                    <el-table-column prop="assetTag" label="资产编号" min-width="85" >
                    </el-table-column>
                    <el-table-column prop="errorMsg" label="失败信息" min-width="90" >
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.errorMsg" placement="bottom-start">
                                <span>{{scope.row.errorMsg || '--' }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
            <!--推送地图-->
            <el-dialog
                title="推送地图"
                :visible.sync="pushMapDialogVisible"
                :close-on-click-modal="false"
                custom-class="Import_dialog"
                :show-close="false"
                top="30vh"
                width="448px">
                <div class="push_map_box">
                    <div>
                        <span>推送日期：</span>
                        <el-date-picker
                            v-model="selectDay"
                            size="small"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy/MM/dd"
                            format="yyyy/MM/dd"
                            :picker-options="dayOptionsSelect">
                        </el-date-picker>
                    </div>
                    <p class="push_map_box_p" v-show="isShowTag">
                        <i class="el-icon-warning" style="color:#FAAD14"></i>
                        请选择推送的日期，将当日新增的媒体推送至地图
                        <i class="el-icon-close" @click="hideTag()"></i>
                    </p>
                </div>
                <div slot="footer" class="">
                    <el-button @click="pushMapDialogVisible = false">取 消</el-button>
                    <el-button type="primary"  @click="submitPushMap">确 认</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import api from '../../api/api'
    import areaPackageNew from '../../commonFun/areaPackage_new'
    import areaToTextNew from '../../commonFun/areaToText_new'
    import sessFun from "../../commonFun/sessFun.js";
    import noSearchResult from "./components/noSearchResult.vue";
    import pointState from './components/pointState.vue';
    import timeFormat from '../../commonFun/timeFormat';

    import {
        Form,
        FormItem,
        Table,
        TableColumn,
        Dropdown,
        DropdownMenu,
        DropdownItem,
        Input,
        Row,
        Button,
        Tooltip,
        MessageBox,
        Message,
        Select,
        Option
    } from 'element-ui';

    export default {
        name: "mediaList",
        components: {
            noSearchResult,
            pointState,
            elForm: Form,
            elFormItem: FormItem,
            elTable: Table,
            elTableColumn: TableColumn,
            elDropdown: Dropdown,
            elDropdownMenu: DropdownMenu,
            elDropdownItem: DropdownItem,
            elInput: Input,
            elRow: Row,
            elButton: Button,
            elTooltip: Tooltip,
            elSelect: Select,
            elOption: Option,
        },
        data() {
            return {
                //加载中
                loading: true,
                loadSign: true,
                // 页码及条数
                pageData:{
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                },
                role: '',
                showNewBtn: false,   // 新建按钮
                haveDetail: true,
                //搜索框和下拉列表
                keyword: '',
                selectInfo: '1',
                SelOptions: [
                    {
                        value: '1',
                        label: '资源名称'
                    }, {
                        value: '2',
                        label: '商圈'
                    }
                ],
                resType: '',                    // 搜索的资源类型
                mState: '',                     // 搜索的媒体状态
                planList: [],                   //  table的所有数据
                currentPlan: [],                // 显示在table中的数据
                cityOther: true,                // 默认显示全国省份城市
                cityOptions: [],                //城市数组
                selectedOptions: [],            // 当前选择的城市rid数组
                regionOpt: [],                  // 地区
                selectRName: '',                // 当前选择的区域rid
                cityArea:{cName:'',rName:''},   // 当前选择的城市名称和区域名称
                loadScroll: true,
                provinceCity: [],               //省份及其地级市
                timeID: '',                     // 计时器
                cityRid: '',                    // 搜索前置条件为城市时,转换成rid
                sessionData: '',
                pageNo: 1,                      // 页数
                totalPage: 1,                   // 总页数
                searchBtnAbled:false,           // 搜索按钮禁止
                mStatusDialogVisible: false,    // 媒体状态修改模态框
                normalToDisabled: true,         //  是否为正常转禁用
                doorState: {mState: false, adState: ''},  // 广告门单面禁用：媒体状态、点位状态
                // 修改媒体状态时的行数据
                rowData: {
                    asState: {
                        A: false,
                        B: false
                    }
                },
                rowIndex: '',                   // 修改媒体状态时的行下标
                selectState: '',                // 修改到媒体状态
                ImportDialogVisible: false,     // 媒体导入弹出框
                importAsrID: '',                // 导入媒体时所选择的公司id
                importSelectLoading: true,      // 公司下拉选项
                companyList: [],                // SA媒体导入时获取的公司列表
                doUpload: this.apiVar.qadnUrl + '/mediaService/media/MediaInfoImport',
                fileData:[],                            // 当前上传文件的数据- 表格
                excelDataUpload:[],                     // 导入excel之后返回的数组
                showUploadFail: false,                  // 导入失败的媒体弹出框
                excelObj:{successNum: 0, failNum: 0},   // 导入excel之后返回的失败成功点数
                ImportLoading: '',                      // 导入excel提交loading
                showImportBtn: false,                   // SA才显示导入媒体按钮
                pushMapDialogVisible: false,            // 推送地图弹出框
                isShowTag: true,
                selectDay: [],                          // 选择的时间
                canSelectDayTime:[],                    // 限制选择区间
                dayOptionsSelect: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.parse(this.canSelectDayTime[0]) || time.getTime() > Date.parse(this.canSelectDayTime[1])
                    }
                },
                // 媒体状态禁用、启用弹出框
                mStateDialogVisible: false,
                // 媒体状态
                mediaState: {
                    allState: false,
                    AState: false,
                    BState: false,
                    ADisable: false,
                    BDisable: false,
                },
                // 标识启用（true）还是禁用(false)
                isDisabled: false,
            }
        },
        mounted: function () {
            // 判断角色确定是否有操作这一列
            this.sessionData = sessFun.getSess();
            this.role = this.sessionData.uType
            if (this.sessionData.uType === 'MD') {
                this.showNewBtn = true
            } else {
                this.showNewBtn = false
            }
            if (this.sessionData.uType === 'SA') {
                this.showImportBtn = true
            } else {
                this.showImportBtn = false
            }
            this.getData();
            let endTime = timeFormat.returnDayCount(0,'/');
            let startTime = timeFormat.returnDayCount(-180,'/');
            this.canSelectDayTime = [startTime,endTime]
            console.log('canSelectDayTime',this.canSelectDayTime)
        },
        methods: {
            // 状态转换
            stateToText(state){
                let arr = [
                    {
                        text: '正常',
                        value: 1,
                        color: 'rgba(82,196,26,1)',
                    },
                    {
                        text: '待安装',
                        value: 2,
                        color: 'rgba(196,203,211,1)',
                    },
                    {
                        text: '待维修',
                        value: 3,
                        color: 'rgba(250,173,20,1)',
                    },
                    {
                        text: '禁用',
                        value: 0,
                        color: 'rgba(245,34,45,1)',
                    },
                ];
                for(let data of arr){
                    if(data.value == state){
                        return data;
                    }
                }
            },
            //新建跳转
            newMedia() {
                this.$router.push('./mediaInput');
            },
            // 维护管理
            maintain() {
                this.$router.push('./maintainList');
            },
            // 推送地图
            showPushMap() {
                this.pushMapDialogVisible = true
            },
            // 确认推送
            submitPushMap() {
                this.pushMapDialogVisible = true
                if (this.selectDay.length && this.selectDay.length >= 2) {
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        service: "SynchronizeMediaToDTWYAction",
                        data: {
                            startDate: this.selectDay[0],
                            endDate: this.selectDay[1],
                        }
                    }
                    console.log('params',params)
                    api.postApi_new(this.apiVar.Media, params).then(res => {
                        console.log('确认推送接口', res)
                        if (res.data.SysCode === 200200) {
                            sessFun.messageFun('success', '推送成功')
                        } else if (res.data.SysCode === 100302) {
                            sessFun.loginTimeout()
                        } else {
                            sessFun.messageFun('warning', '推送失败')
                        }
                    })
                } else {
                    sessFun.messageFun('warning', '请选择日期')
                }
            },
            hideTag(){
                this.isShowTag = false;
            },
            filterChange(filters){
                console.log('filters',filters)
                for (let key in filters) {
                    if (key === 'rtName') {
                        if (filters[key].length) {
                            this.resType = filters[key][0]
                        } else {
                            this.resType = ''
                        }
                    } else if (key === 'mState') {
                        if (filters[key].length) {
                            this.mState = filters[key][0]
                        } else {
                            this.mState = ''
                        }
                    }
                }
                this.pageData.pageNum = 1
                this.getData()
            },
            // 分页
            changePage(val){
                console.log('当前页',val)
                this.pageData.pageNum = val
                this.getData()
            },
            // 每页的条数
            changeSize(val){
                console.log('每页的条数',val)
                this.pageData.pageNum = 1
                this.pageData.pageSize = val
                this.getData()
            },
            // 获取媒体列表
            getData() {
                this.loading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    service: "GetRMList",
                    data: {
                        pageNo: this.pageData.pageNum,
                        pageSize: this.pageData.pageSize,
                        cityName: this.cityArea.cName,
                        regionName: this.cityArea.rName,
                        resType: this.resType,
                        mState: this.mState,
                    }
                }
                if (this.selectInfo === '1') {
                    params.data.resName = this.keyword
                } else if (this.selectInfo === '2') {
                    params.data.tradeArea = this.keyword
                }
                for(let i in params.data){
                    if(params.data[i] === ''){
                        delete params.data[i]
                    }
                }
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('资源媒体列表：', res)
                    this.pageData.totalSize = res.data.data.total
                    let RMList = res.data.data.list;
                    if ( res.data.SysCode == 200200) {
                        if (RMList) {
                            let mediaList = []
                            for(let key of RMList) {
                                mediaList.push(key)
                            }
                            this.currentPlan = mediaList
                            console.log('currentPlan',this.currentPlan)
                            //正在加载
                            this.loading = false;
                        } else {
                            Message.warning({
                                message: '数据为空',
                                duration: 1500
                            });
                        }
                    } else if (res.data.SysCode == 100302){
                        this.loginTimeout()
                    }else {
                        Message({
                            type: 'warning',
                            message: res.data.MSG
                        })
                    }
                    this.searchBtnAbled = false
                })
                this.setCityAreaByUWho()
            },
            // 设置可搜索的区域
            setCityAreaByUWho(){
                this.cityOther = true
                this.cityOptions = areaPackageNew.province()
            },
            // 根据市级城市rid，获取它的下属区、县
            handleChange(value) {
                console.log('handleChange', value)
                this.regionOpt = []
                this.selectRName = ''
                this.cityArea.rName = ''
                if (value.length) {
                    let cityRID = value[1]
                    let regionArr = areaPackageNew.findArea(cityRID)
                    this.cityArea.cName = areaToTextNew.toTextCity(value[1])
                    console.log('获取选中城市的区域', regionArr, 'this.cityArea', this.cityArea)
                    let region = []
                    for(let key of regionArr){
                        region.push({
                            label: key.rName,
                            value: key.rID
                        })
                    }
                    this.regionOpt = region
                    console.log('this.regionOpt', this.regionOpt, 'selectedOptions', this.selectedOptions)
                } else {
                    this.cityArea.cName = ''
                }
            },
            //获取区域
            getRegion(val){
                console.log('获取区域val', val, this.regionOpt)
                if (val) {
                    for (let key of this.regionOpt) {
                        if (key.value == val) {
                            this.cityArea.rName = key.label
                        }
                    }
                } else {
                    this.cityArea.rName = ''
                }
                console.log('选择的区域为',this.cityArea)
            },
            // 勾选禁用/启用媒体状态
            stateChange(temp){
                console.log('temp',temp,this.mediaState)
                switch (temp) {
                    case 'all':
                        // 全选
                        if(this.mediaState.allState) {
                            this.mediaState.AState = true
                            this.mediaState.BState = true
                        } else {
                            this.mediaState.ADisable ? '' : this.mediaState.AState = false
                            this.mediaState.BDisable ? '' : this.mediaState.BState = false
                        }
                        break;
                    case 'A':
                        // 选择A
                        if(this.mediaState.AState) {
                            // 如果B已勾选
                            if(this.mediaState.BState) {
                                this.mediaState.allState = true
                            }
                        } else {
                            this.mediaState.allState = false
                        }
                        break;
                    case 'B':
                        // 选择B
                        if(this.mediaState.BState) {
                            // 如果A已勾选
                            if(this.mediaState.AState) {
                                this.mediaState.allState = true
                            }
                        } else {
                            this.mediaState.allState = false
                        }
                        break;
                    default: sessFun.messageFun('waring','勾选异常！');break;
                }
            },
            // 正常->禁用 / 禁用->正常
            submitMediaState() {
                if (this.mediaState.allState || this.mediaState.AState || this.mediaState.BState) {
                    let stateName = this.return_mState(this.selectState)
                    if (this.mediaState.allState) {
                        this.setRowMediaStatus(stateName, this.selectState, 'all')
                    } else {
                        this.setRowMediaStatus(stateName, this.selectState, 'one')
                    }
                } else {
                    sessFun.messageFun('waring', '请选择类型!')
                }
            },
            // 下拉选择状态
            changeState(selectState, index, rows) {
                console.log('选择的状态', selectState)
                console.log('行内容', rows)
                this.rowIndex = index
                this.rowData = rows
                this.selectState = selectState
                let stateName = this.return_mState(selectState)
                // 初始化
                for (let i in this.mediaState) {
                    this.mediaState[i] = false
                }
                if (rows.mState == selectState) {
                    if(rows.mState == 1 && (rows.asState.A == '0' || !rows.asState.B == '0')) {
                        this.mStateDialogVisible = true
                        this.judgeAsState(rows)
                    } else {
                        sessFun.messageFun('waring','当前状态已是' + stateName)
                    }

                } else if (selectState == '0' && rows.mState == '1') {
                    // 正常转禁用
                    this.isDisabled = true
                    this.mStateDialogVisible = true
                    // 判断是否为已禁用
                    this.judgeAsState(rows)
                } else if (selectState == '1' && rows.mState == '0') {
                    // 禁用转正常
                    this.isDisabled = false
                    this.mStateDialogVisible = true
                } else if(selectState == '4'){
                  // 删除
                    this.judgeResHaveMediaNum()
                    // this.deleteMedia()
                } else {
                    this.setRowMediaStatus(stateName,selectState)
                }
            },
            // 判断单面禁用状态
            judgeAsState(row) {
                if(row.asState.A == '0') {
                    this.mediaState.AState = true
                    this.mediaState.ADisable = true
                } else {
                    this.mediaState.AState = false
                    this.mediaState.ADisable = false
                }
                // B面
                if(row.asState.B == '0') {
                    this.mediaState.BState = true
                    this.mediaState.BDisable = true
                } else {
                    this.mediaState.BState = false
                    this.mediaState.BDisable = false
                }
            },
            // 判断当前删除的媒体所在小区是否只有一个媒体
            judgeResHaveMediaNum(){
                let judgeLoading = this.$loading({
                    lock: true,
                    text: '',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    "service":"CountMediaByResinfoIdAction",
                    "data":{
                        "resId": this.rowData.resID
                    }
                }
                api.postApi_new(this.apiVar.Media,params).then(res=>{
                    if (res.data.SysCode === 200200 || res.data.MSG === '操作成功') {
                        let isOneMore = false
                        if(res.data.data && res.data.data == 1) {
                            isOneMore = true
                        } else {
                            isOneMore = false
                        }
                        // 删除
                        this.deleteMedia(isOneMore)
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                    }
                    judgeLoading.close()
                }).catch(err=>{
                    judgeLoading.close()
                })
            },
            // 删除媒体
            deleteMedia(flag) {
                let text = '媒体被删除后将不可恢复!'
                if (flag) {
                    text = '媒体和资源连同被删除，不可恢复!'
                }
                this.$confirm(text, '确定要删除该媒体吗?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    customClass: 'delete_media_confirm'
                }).then(() => {
                    let submitLoading = this.$loading({
                        lock: true,
                        text: '删除中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        "service":"DelMediaAction",
                        "data":{
                            "mId": this.rowData.mID,
                            "resId": this.rowData.resID
                        }
                    }
                    console.log('删除params', params)
                    api.postApi_new(this.apiVar.Media, params).then(res => {
                        console.log('res', res)
                        if (res.data.SysCode === 200200 || res.data.MSG === '操作成功') {
                            sessFun.messageFun('success','删除成功！')
                            this.getData()
                        } else {
                            sessFun.messageFun('warning',res.data.MSG)
                        }
                        submitLoading.close()
                    }).catch(err=>{
                        sessFun.messageFun('warning','删除异常！')
                        submitLoading.close()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    })
                })
            },
            // 二次确认按钮
            setRowMediaStatus(stateName,selectState,letter) {
                console.log('stateName',stateName,'selectState',selectState)
                let info = ''
                if (letter === 'one') {
                    let A_B = this.mediaState.AState ? 'A' : 'B'
                    info = '你确定更改媒体' + A_B + '面的状态为<b>' + stateName + '</b>吗?'
                } else {
                    info = '你确定更改媒体状态为<b>' + stateName + '</b>吗?'
                }
                MessageBox.confirm(info, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    console.log('-----------',selectState)
                    this.setStatusApi(selectState,letter)
                }).catch(() => {
                    sessFun.messageFun('info','已取消操作')
                })
            },
            // 设置媒体状态接口
            setStatusApi(state,letter){
                let uid = this.sessionData.uID
                let mid = this.rowData.mID
                let submitLoading =  this.$loading({
                    lock: true,
                    text: '修改中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                //确定
                let params = {
                    "uid": uid,
                    "token":  this.sessionData.token,
                    "service":"CtrlMedia",
                    "data": {
                        "uid": uid,
                        "mid": mid,
                        "mstate": state
                    }
                }
                if(letter === 'one') {
                    params.data.mstate = this.isDisabled ? '1' : '0'     // 单面禁用媒体状态还是正常（1）
                    params.data.asLabs = this.mediaState.AState ? 'A' : 'B'
                    params.data.asState = this.isDisabled ? '0' : '1'
                }
                console.log('params',params)
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('修改状态：', res)
                    if (res.data.SysCode === 200200 || res.data.MSG === '操作成功') {
                        sessFun.messageFun('success','成功更改状态')
                        if(letter === 'one') {
                            if(this.isDisabled) {
                                // 单面正常转禁用
                                this.rowData.asState[params.data.asLabs] = state
                            } else {
                                // 单面禁用转正常
                                this.rowData.asState[params.data.asLabs] = state
                                this.rowData.mState = state
                            }
                        } else {
                            this.rowData.asState.A = state
                            this.rowData.asState.B = state
                            this.rowData.mState = state
                        }
                        this.mStateDialogVisible = false
                        console.log('当前行', this.currentPlan[this.rowIndex])
                    } else if (res.data.SysCode === 200302 || res.data.MSG === '广告位已被占用') {
                        sessFun.messageFun('warning',res.data.MSG)
                    } else if (res.data.SysCode == 100302) {
                        sessFun.loginTimeout()
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                    }
                    submitLoading.close()
                })
            },
            return_mState(mState){
                if (mState == '1') {
                    return '正常'
                } else if (mState == '0') {
                    return '禁用'
                } else if (mState == '2') {
                    return '待安装'
                } else if (mState == '3') {
                    return '待维修'
                }else{
                    return ''
                }
            },
            return_mStateNum(mState){
                if (mState == '正常') {
                    return '1';
                } else if (mState == '禁用') {
                    return '0';
                } else if (mState == '待安装') {
                    return '2';
                } else if (mState == '待维修') {
                    return '3';
                } else {
                    return '';
                }
            },
            // 跳转到媒体详情界面
            mediaDetail(data) {
                this.$router.push('./mediaDetail');
                sessionStorage.setItem("resID", data.resID);
            },
            // 当搜索框为空的时候进行重置显示
            initData(val) {
                console.log('搜索框变化的值', val)
                if (!this.keyword) {
                    this.setPageNoAndTableData()
                    this.getData({"pageNo": this.pageNo,"pageSize":50})
                }
            },
            // 搜索按钮
            searchFun() {
                this.searchBtnAbled = true
                if ((this.keyword === '' || this.keyword === null) && this.cityArea.cName === '') {
                    Message.warning({
                        message: '请先输入搜索条件',
                        duration: 1000
                    })
                    this.searchBtnAbled = false
                } else {
                    this.pageData.pageNum = 1
                    this.getData()

                }
            },
            // 重置搜索
            clearSearch(){
                this.keyword = ''
                this.selectedOptions = []
                this.selectRName = ''
                this.regionOpt = [];
                this.pageData.pageNum = 1
                this.pageData.pageSize = 10
                this.cityArea = {cName:'',rName:''}
                this.getData()
            },
            // 导入媒体 companyList
            importMedia(){
                if(!this.companyList.length){
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                    }
                    api.getApi(this.apiVar.UCAPI + '/getCompany', params).then(res=>{
                        console.log('公司列表',res)
                        if (res.data.SysCode == 200200) {
                            let tempList = []
                            for (let key of res.data.data) {
                                if (key.asrID != '999') {
                                    tempList.push({
                                        value: key.asrID,
                                        label: key.asName
                                    })
                                }
                            }
                            this.companyList = tempList.concat()
                            this.importSelectLoading = false
                        } else if (res.data.SysCode == 100302) {
                            this.loginTimeout()
                        } else {
                            this.$message.warning(res.data.MSG);
                        }
                    })
                }
                this.ImportDialogVisible = true
            },
            // 自定义上传
            uploadFile(params){
                this.fileData = []
                console.log(params)
                let fileObj = params.file
                this.fileData.push(fileObj)
            },
            // 文件删除
            fileRemove(file, fileList){
                console.log(file, fileList);
                this.fileData = fileList
            },
            // 导入模版下载
            dowmLoadFun(event){
                // 阻止冒泡事件
                event.stopPropagation();
            },
            // 确认上传
            submitUpload(){
                console.log('this.importAsrID',this.importAsrID,this.fileData)
                if(!this.importAsrID){
                    this.$message.warning('请选择所属企业')
                    return
                }
                if(this.fileData.length){
                    this.ImportLoading = this.$loading({
                        lock: true,
                        text: '上传中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })
                    let formData = new FormData();
                    formData.append('file', this.fileData[0]);
                    // 上传文件
                    api.postUpload_file(this.doUpload+'?uid='+this.sessionData.uID+'&token='+
                        this.sessionData.token + '&asrID=' + this.importAsrID, formData).then(res =>{
                        console.log('导入媒体', res)
                        if (!res.data.SysCode) {
                            let resData = res.data
                            // this.$message.success('成功导入条数据');
                            if (resData.errorList.length) {
                                console.log('导入失败媒体', resData.errorList)
                                this.setErrorMediaTable(resData.errorList)
                                this.excelObj = {
                                    successNum: resData.mediaCount,
                                    failNum: resData.errorList.length
                                }
                            }
                            if(resData.mediaCount > 0){
                                this.$message.success('成功导入' + resData.mediaCount + '条数据') // mediaCount resCount
                                // this.setPageNoAndTableData()
                                this.pageData.pageNum = 1
                                this.getData()
                            }
                            this.ImportDialogVisible = false
                            this.fileData = []
                            this.importAsrID = ''
                        } else if (res.data.SysCode == 100302) {
                            this.loginTimeout()
                        } else {
                            this.$message.warning(res.data.MSG)
                        }
                        this.ImportLoading.close()
                    }).catch(res => {
                        console.log(res)
                    })
                }else{
                    this.$message.warning('请上传文件！')
                }
            },
            // 导入失败的媒体
            setErrorMediaTable(errorList){
                let resultarr = []
                for (let data of errorList) { // mvehicle
                    resultarr.push({
                        errorMsg: data.msg,
                        resID: data.resInfo.resID,
                        resName: data.resInfo.resName,
                        city: data.resInfo.rid,
                        mtitle: data.resInfo.mtitle,
                        mvehicle: data.resInfo.mvehicle,
                        assetTag: data.resInfo.assetTag
                    })
                }
                this.excelDataUpload = resultarr
                this.showUploadFail = true
            },
            // 导出有问题的点
            downLoadExcel(){
                let resultarr = [];
                for(let data of this.excelDataUpload){
                    let obj = {
                        errorMsg:data.errorMsg,
                        resID: data.resID,
                        resName: data.resName,
                        rID: data.city,
                        mtitle: data.mtitle,
                        // mvehicle: data.mvehicle,
                        assetTag: data.assetTag
                    };
                    resultarr.push(obj);
                }
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                    const tHeader = ['resID','资源名称','市区','媒体名称','资产编号','失败信息'];
                    const filterVal = ['resID', 'resName', 'rID', 'mtitle','assetTag','errorMsg'];
                    const list = resultarr;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, '问题媒体表');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            // 登录超时
            loginTimeout() {
                this.$message({
                    message: '登录超时或权限异常,请重新登录',
                    type: 'warning'
                })
                this.$router.push('/login')
            },
        }
    }

</script>

<style scoped>

    /deep/ .el-table-filter{
        height: 400px !important;
        overflow-y:auto !important;
    }

    a {
        color: #108EE9;
    }

    .input-with-select /deep/ .el-input__inner {
        font-size: 14px;
        line-height: 32px;
    }

    /deep/ .el-table th > .cell.highlight {
        color: #409EFF !important;
    }

    /deep/ .el-tooltip__popper.is-light {
        color: #666666 !important;
        border: 1px solid #666666 !important;
    }

    /deep/ .el-table-filter {
        height: 180px;
    }

    /*过滤条件样式*/
    .handel_ul{
        list-style:none;
        overflow: hidden;
    }
    .handel_ul_li{
        float: left;
        margin-right: 8px;
    }
    .handel_ul_li_select{
        width: 23.5%;
    }
    .handel_ul_li_city{
        width: 15%;
    }
    .handel_ul_li_area{
        width: 15%;
    }
    .handel_ul_li_btn{
        width: 32%;
    }
    .push_map_btn{
        width: 10%;
        float: right;
        text-align: right;
        margin-right: 0
    }
    /*下拉搜索框*/
    /deep/ .el-input-group__prepend {
        width: 64px;
        position: relative;
        background-color: #fff;
    }

    /deep/ .el-input-group--prepend .el-select {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        min-height: 530px;
        overflow-y: auto;
    }

    /deep/ .error_media .el-table__body-wrapper{
        min-height: 420px;
    }

    /*筛选*/
    /deep/ .el-table__column-filter-trigger {
        margin-left: 6px;
        line-height: 0px;
        overflow-y: hidden;
    }

    /deep/ .el-table th > .cell.highlight {
        color: #409EFF !important;
    }

    /deep/ div.el-table-filter {
        left: 1106px !important;
    }

    /*操作*/
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    /*提示框*/
    /deep/ .el-message {
        top: 65px;
        padding: 7px 15px 7px 20px;
    }

    .content_bottom_btn /deep/ .el-button span {
        position: relative;
        top: -2px;
    }

    .content_bottom_btn /deep/ .el-button span a {
        color: #606266;
    }

    /deep/ .mStatueDialog{
        width: 285px;
    }
    /deep/ .mStatueDialog h4{
        margin: 12px 0;
    }
    /deep/ .mStatueDialog .el-dialog__body{
        padding: 0 20px 10px;
    }
    /deep/ .el-checkbox__inner{
        /*border-radius: 50%;*/
    }
    /*导入媒体*/
    .upload_file{
        display: inline-block;
        /*display: none;*/
    }
    .upload_file .el_upload_btn{
        /*display: none;*/
    }
    .import_ul li{
        margin-bottom: 16px;
    }
    .import_ul /deep/ .el-select{
        width: 100%;
    }
    .import_ul /deep/ .el-button{
        width: 126px;
    }
    .import_ul .aButton{
        width: 124px;
        height: 29px;
        /*padding: 3px;*/
        line-height: 31px;
        text-align: center;
        display: inline-block;
        color: #666;
        margin-right: 3px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
    }
    .aButton:hover{
        border: 1px solid #409EFF;
        color: #409EFF;
    }

    /deep/ .Import_dialog .el-dialog__body{
        padding: 15px 20px 10px;
    }

    /deep/ .el-upload-list__item{
        width: 259px
    }

    /*导入失败媒体*/
    /deep/ .error_media .el-dialog__body{
        padding: 10px 20px 20px;
    }

    .car-title {
        background: #E6F7FF;
        border: 1px solid #BAE7FF;
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 5px;
    }

    .car-title h4 {
        font-size: 14px;
        display: inline-block;
    }

    .car-title span {
        font-size: 14px;
        font-weight: normal;
        margin: 0 6px;
        cursor: pointer;
        color: #1890ff;
    }

    /*  推送地图  */
    .push_map_box /deep/ .el-select.el-select--small{
        width: 333px;
    }
    .push_map_box /deep/ .el-date-editor{
        width: 333px;
    }

    .push_map_box_p{
        height:32px;
        background:rgba(255,251,230,1);
        border-radius:4px;
        border:1px solid rgba(255,229,143,1);
        line-height: 32px;
        padding:  0 16px;
        margin-top: 16px;
    }

    .push_map_box_p /deep/ .el-icon-close{
        cursor: pointer;
        margin-left: 24px;
    }
</style>

<style>
    .delete_media_confirm .el-message-box__header{
        /*padding-left: 48px;*/
    }
    .delete_media_confirm .el-message-box__title{
        font-size: 16px;
        font-weight: 600;
    }
</style>
