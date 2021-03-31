<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix" v-if="!isNation">
                <a href="#" style="color: #999">方案管理</a><em> / </em><a href="#">方案列表</a></p>
            <p v-else><a href="#">方案管理</a></p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>方案列表</h2>
            </div>
            <div class="mediaList_container">
                <div class="flex_box search_row">
                    <el-input placeholder="请输入内容" v-model="searchInfo.keyword" size="small" class="marginR">
                        <el-select v-model="searchInfo.select" slot="prepend" placeholder="请选择">
                            <el-option label="方案名称" value="1"></el-option>
                            <el-option label="客户名称" value="2"></el-option>
                            <el-option label="品牌名称" value="3"></el-option>
                        </el-select>
                    </el-input>
                    <div style="margin-left: -30px">
                        <el-select size="small" v-model="searchInfo.dateType" placeholder="请选择"
                                   class="date-type-select">
                            <el-option label="上刊日期" value="0"></el-option>
                            <el-option label="下刊日期" value="1"></el-option>
                            <el-option label="创建日期" value="2"></el-option>
                            <!--<el-option label="换画日期" value="2"></el-option>-->
                        </el-select>
                        <el-date-picker size="small" class="marginR" v-model="searchInfo.rangeDate" type="daterange"
                                        range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        start-placeholder="选择日期" end-placeholder="选择日期">
                        </el-date-picker>
                    </div>
                    <el-select v-model="searchInfo.status" placeholder="请选择状态" size="small" class="marginR">
                        <el-option v-for="item of stateList" :key="item.value" :label="item.text"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="searchInfo.company" placeholder="请选择所属公司" filterable size="small" v-if="isAll"
                               class="marginR">
                        <el-option v-for="item of companyData" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="searchInfo.cityWord" placeholder="请选择投放城市" filterable size="small"
                               class="marginR">
                        <el-option v-for="item of filterCityData" :key="item.rID" :label="item.text"
                                   :value="item.text"></el-option>
                    </el-select>
                    <el-select v-model="searchInfo.Lock" placeholder="是否预锁" size="small" class="marginR">
                        <el-option label="已预锁" value="2"></el-option>
                        <el-option label="未预锁" value="1"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="search()" :disabled="!isSearch"
                               v-qadn-mta-h5="{id: 'a004_b000_c000_d000_bt038_ck01'}" class="marginR">搜索
                    </el-button>
                    <el-button plain @click="reset()" :disabled="!isReset" class="marginR"
                               v-qadn-mta-h5="{id: 'a004_b000_c000_d000_bt039_ck02'}">重置
                    </el-button>
                    <template v-if="showNewBtn || !isNation">
                        <el-button plain v-if="showNewBtn" @click="addOne()" class="marginR"
                                   v-qadn-mta-h5="{id: 'a004_b000_c000_d000_bt040_ck03'}">新建
                        </el-button>
                        <el-button plain v-if="showNewBtn" @click="isOpenDownload=true" class="marginR"
                                   v-qadn-mta-h5="{id: 'a004_b000_c000_d000_bt041_ck04'}">导空位
                        </el-button>
                        <el-button plain @click="exportRes" v-if="isShowExportBtn">资源导出</el-button>
                        <!--<el-button plain v-if="!isNation" @click="goToDiaPlate" class="marginR"
                                   v-qadn-mta-h5="{id: 'a004_b000_c000_d000_bt042_ck03'}">点位表盘
                        </el-button>-->
                    </template>
                </div>
                <div class="table_wrap">
                    <el-table border :data="currentPlan" style="width: 100%" @sort-change="sortChange"
                              v-loading="loading" element-loading-text="玩命加载中.."
                              element-loading-spinner="el-icon-loading">
                        <el-table-column prop="apName" label="方案名称" min-width="14.9%">
                            <template slot-scope="scope">
                                <span class="u-bk-btn" v-if="scope.row.apSrc!=0">贝壳</span>
                                <span style="color: #108ee9;cursor: pointer" @click="ToDetail(scope.row)">{{scope.row.apName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cName" label="客户名称" min-width="12.6%" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="bTitle" label="品牌名称" min-width="7.6%" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="apTotal" label="方案价格" sortable="custom" width="120px" align="right">
                            <template slot-scope="scope">
                                <span v-if="scope.row.apState == '-1'">--</span>
                                <span v-else>&yen;{{scope.row.apTotal?priceFormat(scope.row.apTotal/100):0}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="realName" label="所有人" min-width="6.1%" v-if="!(role=='AD')&&role!='BD'"
                                         show-overflow-tooltip
                                        >
                        </el-table-column>
                        <el-table-column prop="realName" label="所有人" min-width="6.1%" v-if="role=='BD'"
                                         show-overflow-tooltip
                                         :filters="filterRealName"
                                         :filter-method="filterRealNameFun"
                                         :filter-multiple="true">
                        </el-table-column>

                        <el-table-column label="投放城市(点位面数,排期)"
                                         prop="cityArea"
                                         min-width="25.8%">
                            <template slot-scope="scope">
                                <template v-if="isAll">
                                    <div v-for="(item, index) of scope.row.cityArea" :key="index"
                                        class="city_p">
                                        <el-tooltip class="item" effect="dark"
                                                    :content="item.asName+' '+item.city+'('+item.num+'面,'+formatTime(item.pdStar)+'至'+formatTime(item.pdEnd)+')'"
                                                    placement="top">
                                            <div>
                                                <span v-if="item.isshow">{{item.asName}}</span>
                                                <p>
                                                    {{item.city+'('+item.num+'面,'+formatTime(item.pdStar)+'至'+formatTime(item.pdEnd)+')'}}</p>
                                            </div>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" :content="'距离解锁还剩'+item.RemainDay+'天'"
                                                    placement="top">
                                                <span v-show="item.RemainDay" class="lock-icon">
                                                <!--预锁:剩<b :style="item.RemainDay<=3?'color:red;':''">{{item.RemainDay}}</b>天-->
                                                <b :class="item.RemainDay<=3?'red':'blue'">{{item.RemainDay}}</b>
                                                </span>
                                        </el-tooltip>
                                    </div>
                                </template>
                                <template v-else>
                                    <div v-for="item of scope.row.cityArea" :key="item.rid+'-'+item.asrID"
                                        class="city_p">
                                        <el-tooltip class="item" effect="dark"
                                                    :content="item.asName+' '+item.city+'('+item.num+'面,'+formatTime(item.pdStar)+'至'+formatTime(item.pdEnd)+')'"
                                                    placement="top">
                                            <p v-if="item.apState == '-1'">
                                                {{item.city+'('+'--面,'+formatTime(item.pdStar)+'至'+formatTime(item.pdEnd)+')'}}</p>
                                            <p v-else>
                                                {{item.city+'('+item.num+'面,'+formatTime(item.pdStar)+'至'+formatTime(item.pdEnd)+')'}}</p>
                                        </el-tooltip>
                                        <el-tooltip class="item" effect="dark" :content="'距离解锁还剩'+item.RemainDay+'天'"
                                                    placement="top">
                                            <span v-show="item.RemainDay" class="lock-icon">
                                            <!--预锁:剩<b :style="item.RemainDay<=3?'color:red;':''">{{item.RemainDay}}</b>天-->
                                            <b :class="item.RemainDay<=3?'red':'blue'">{{item.RemainDay}}</b>
                                            </span>
                                        </el-tooltip>
                                        <!--<i v-if="item.RemainDay>=0" class="fa fa-lock fa-lg" style="color:#999;"></i>-->
                                        <!--<i v-else></i>-->
                                    </div>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="apcTime" label="创建日期" width="100px" sortable="custom"
                                         show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{formatTime(scope.row.apcTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="tac" prop="apState" label="状态" min-width="6.1%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <point-state :state-text="stateToText(scope.row.apState).text"
                                             :color="stateToText(scope.row.apState).color"></point-state>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100px" v-if="!(role=='OP' || role=='AD')">
                            <template slot-scope="scope">
                                <el-dropdown size="small" trigger="click" placement="bottom-start">
                                    <span class="el-dropdown-link">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native.prevent="addPoint(scope.row)"
                                                          :disabled="isDisable || scope.row.apState !== -1"
                                                          v-qadn-mta-h5="{id: 'a004_b000_c000_d000_bt043_ck04'}">配点
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="preload(scope.row)"
                                                          :disabled="isDisable||(scope.row.apState!==1|| (scope.row.apState==1 && !scope.row.canLock))"
                                                          v-qadn-mta-h5="{id: 'a004_b000_c000_d000_bt043_ck04'}">预锁
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="release(scope.row)"
                                                          :disabled="isDisable||(scope.row.apState!==1|| ( scope.row.apState!=1 &&  scope.row.apControlLevel !== 1))"
                                                          v-qadn-mta-h5="{id: 'a004_b000_c000_d000_bt044_ck04'}">发布
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="clearLock(scope.row)"
                                                          :disabled="isDisable||(scope.row.apState!==1|| (scope.row.apState==1 && !scope.row.unLock))"
                                                          v-qadn-mta-h5="{id: 'a004_b000_c000_d000_bt045_ck04'}">解除预锁
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="splitAdPlan(scope.row)"
                                                          v-if="scope.row.apControlLevel === 2 && sessionData.uType === 'BD'">
                                            拆单
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>

                    <div class="ad_pagination">
                        <p>注：<span>3</span>表示预锁天数</p>
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
        <!-- 预锁公司 -->
        <el-dialog :title="isLock?'请选择预锁公司':'请选择解锁公司'" :visible.sync="dialogVisible" width="35%" center>
            <el-checkbox-group v-model="cityChoose">
                <template v-if="isLock">
                    <el-checkbox :label="item.asrID" v-for="item of cityList" :key="item.rid" border
                                :disabled="item.RemainDay>=0" size="mini">{{item.asName}}
                    </el-checkbox>
                </template>
                <template v-else>
                    <el-checkbox :label="item.asrID" v-for="item of cityList" :key="item.rid" border
                                :disabled="item.RemainDay==undefined || item.RemainDay==null" size="mini">{{item.asName}}
                    </el-checkbox>
                </template>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="cancelLock">取 消</el-button>
                <el-button type="primary" @click="confirmLock">确 定</el-button>
            </span>
        </el-dialog>
        <!--存在异常未完成的方案-->
        <el-dialog title="您有一个新方案未完成保存，是否继续编辑？"
                   :visible.sync="unfinishedDialogVisible"
                   width="400px"
                   custom-class="unfinished_plan_dialog"
                   :close-on-click-modal="false">
            <div>
                <ul>
                    <li class="unfinished_plan_li">
                        <span>方案名称:</span>
                        <span>{{planInfo.planName}}</span>
                    </li>
                    <li class="unfinished_plan_li">
                        <span>所属销售:</span>
                        <span>{{planInfo.ownerSales}}</span>
                    </li>
                    <li class="unfinished_plan_li">
                        <span>创建时间:</span>
                        <span>{{planInfo.cleatTime}}</span>
                    </li>
                    <li class="unfinished_plan_li">
                        <span v-if="IsSevenBD">
                            <span>已选小区:</span>
                            <span>{{planInfo.adsNum}} 个</span>
                        </span>
                        <span v-else>
                             <span>已选点位:</span>
                             <span>{{planInfo.adsNum}} 面</span>
                        </span>
                        
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="cancelEdit">放 弃</el-button>
                <el-button type="primary" @click="continueEdit">继续编辑</el-button>
            </span>
        </el-dialog>

        <!-- 导出空点 -->
        <el-dialog title="空位导出" :visible.sync="isOpenDownload" width="30%">
            <download-vacancy @cancelClick="isOpenDownload = false"></download-vacancy>
        </el-dialog>

        <!--发布方案-->
        <el-dialog
            title="发布方案"
            :visible.sync="publishPlanDialog"
            :close-on-click-modal="false"
            custom-class="publish_dialog"
            :show-close="false"
            width="368px">
            <span class="comment">完善以下信息后提交，即可完成发布</span>
            <el-form label-position="top">
                <el-form-item label="合同编号" label-width="80px">
                    <el-input size="small" v-model="this.QCinfo"></el-input>
                </el-form-item>
                <el-form-item label="订单类型" label-width="80px">
                    <el-select v-model="planType" size="small" placeholder="请选择活动区域">
                        <el-option label="常规" value="0"></el-option>
                        <el-option label="续刊" value="1"></el-option>
                        <el-option label="补刊" value="2"></el-option>
                        <el-option label="空刊" value="3"></el-option>
                        <el-option label="赠送" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="planType==1||planType==2" :label="`${['常规','续刊', '补刊', '空刊', '赠送'][planType]}订单`" label-width="80px">
                    <el-select
                        v-model="relatedApId"
                        size="small"
                        :placeholder="`请选择${['常规','续刊', '补刊', '空刊', '赠送'][planType]}的订单`"
                        filterable
                        :clearable="true"
                    >
                        <el-option
                        v-for="item in apList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="publishPlanDialog = false">取 消</el-button>
                <el-button type="primary" @click="commitRelease">确 定</el-button>
            </div>
        </el-dialog>

        <!--周边小区导出-->
        <el-dialog
            :title="`资源导出(`+ exportResStep +`/3)` "
            :visible.sync="isResExport"
            :close-on-click-modal="false"
            custom-class="Import_dialog"
            :show-close="false"
            width="472px">
            <p class="info_box" v-show="isShowExportTag">
                <i class="el-icon-warning" style="color:#1890FF"></i>
                {{exportResStep === 1 ? '第一步：填写导出的基本参数' : exportResStep === 2 ?
                '第二步：下载模板，指定周边越多，需要导出时间越长' : '第三步：上传填写好的表格，并点击提交'}}
                <!--                    <i class="el-icon-close" @click="isShowExportTag = false"></i>-->
            </p>
            <ul class="export_ul" v-show="exportResStep === 1">
                <li>
                    <span>匹配城市：</span>
                    <el-select size="small" v-model="exportInfo.citys" filterable placeholder="请选择城市" @change="exportCityFun">
                        <el-option v-for="(key,index) in exportRescityList"
                                   :key="index"
                                   :label="key.label"
                                   :value="key.value">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <span>匹配范围：</span>
                    <el-input size="small" class="radius_input" placeholder="请输入半径距离"
                              v-model="exportInfo.radius">
                        <template slot="append">米</template>
                    </el-input>
                </li>
                <li>
                    <span>导出模板：</span>
                    <el-select v-model="exportInfo.type" size="small" filterable placeholder="请选择导出类型">
                        <el-option label="模板A：1小区/1门店(有距离)" value="1"></el-option>
                        <el-option label="模板B：1小区/多门店(无距离)" value="2"></el-option>
                    </el-select>
                </li>
            </ul>
            <div class="export_step_box" v-show="exportResStep === 2">
                <img src="../../assets/images/export.png" alt="">
                《QADN-数据导入-模板》
                <a :href ='apiVar.qadnUrl + "/importTemplate/broundData.xlsx"'
                   download="数据导入模板.xlsx" class="downloag_btn">点击下载<i class="el-icon-download"></i></a>
            </div>
            <div v-show="exportResStep === 3">
                <el-upload
                    ref="exportRes"
                    class="upload-demo"
                    drag
                    :action="exportAction"
                    :file-list="exportFileData"
                    :show-file-list="true"
                    :http-request="exportUploadFile"
                    :on-remove="exportFileRemove"
                    :multiple="false">
                    <img src="../../assets/images/export.png" alt="">
                    <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
                </el-upload>
            </div>
            <div slot="footer">
                <el-button size="small" plain @click="isResExport = false">取 消</el-button>
                <el-button size="small" plain v-show="exportResStep > 1"
                           @click="exportResStep > 1 ? exportResStep-- : exportResStep = 1">上一步</el-button>
                <el-button size="small" type="primary"  @click="nextExportRes" :loading="isBroundImport">
                    {{isBroundImport ? '导出中..' : exportResStep >= 3 ? '确定' : '下一步'}}
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import api from "../../api/api.js";
    // 价格格式化
    import commaFormat from "../../commonFun/commaFormat.js";
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import sessFun from "../../commonFun/sessFun.js";
    // 方案缓存
    import cacheAdPlan from "../../commonFun/cacheAdPlan"
    import downloadVacancy from "../../components/common/components/vacancyDownload.vue"
    import noSearchResult from "./components/noSearchResult.vue";
    import pointState from './components/pointState.vue';
    // 筛选过滤
    import filterFormat from "../../commonFun/filterTableData.js";

    import {
        Button,
        CheckboxGroup,
        Checkbox,
        Input,
        Dropdown,
        DropdownItem,
        DropdownMenu,
        Row,
        Table,
        TableColumn,
        DatePicker,
        Tooltip,
        Dialog,
        MessageBox,
        Message,
        Select,
        Option,
        Loading
    } from "element-ui";
    import timeFormat from '../../commonFun/timeFormat.js';

    export default {
        name: "projectList",
        components: {
            downloadVacancy,
            noSearchResult,
            pointState,
            elButton: Button,
            elCheckboxGroup: CheckboxGroup,
            elCheckbox: Checkbox,
            elInput: Input,
            elDropdown: Dropdown,
            elDropdownItem: DropdownItem,
            elDropdownMenu: DropdownMenu,
            elRow: Row,
            elTable: Table,
            elTableColumn: TableColumn,
            elDatePicker: DatePicker,
            elTooltip: Tooltip,
            elDialog: Dialog,
            elSelect: Select,
            elOption: Option
        },

        data() {
            return {
                // 搜索数据
                searchInfo: {
                    // 搜索的select框
                    select: "1",
                    // 关键字
                    keyword: "",
                    // 时间范围
                    rangeDate: "",
                    //日期类型
                    dateType: '0',
                    // 状态筛选
                    status: '',
                    // 公司搜索
                    company: '',
                    // 城市筛选
                    cityWord: '',
                    // 是否预锁
                    Lock: '',
                    // 按照啥排序
                    orderby: '',
                    // 升序降序0/1
                    desc: "",

                },
                // 公司列表
                companyData: [],
                // 分页信息
                paginationShow: true,
                pageSize: 10,
                pageSizes: [10, 20, 50],
                currPage: 1,
                totalPage: 0,
                totalNum: 0,
                isAll: false,
                Ctrlloading: false,
                // 登录信息、
                sessionData: {},
                // 合同编号
                QCinfo: '',
                // 登录者角色
                role: "",
                //   判断是否有发布，预锁解锁等功能
                isDisable: true,
                isShowExportBtn: false, //资源导出按钮
                //加载中
                loading: true,
                currentItem: {},
                // 解锁还是预锁
                isLock: false,
                // 预锁弹出框
                dialogVisible: false,
                // 选择要预锁的城市
                cityChoose: [],
                // 预锁的城市列表
                cityList: [],
                // 状态列表
                stateList: [
                    {text: '已完成', value: 0},
                    {text: '进行中', value: 1},
                    {text: '未投放', value: 2},
                    {text: '投放中', value: 3},
                    {text: '强制结束', value: 5}
                ],
                // 根据角色判断是否显示新建按钮
                showNewBtn: true,
                isSearch: true,
                isReset: true,
                // 表格数据
                currentPlan: [],
                //过滤所有人
                filterRealName: [],
                // 权限城市过滤数组
                filterCityData: [],
                // 未完成方案提示
                unfinishedDialogVisible: false,
                // 未完成方案
                planInfo: '',
                // 继续编辑未完成方案跳转时的loading
                continueEditLoading: '',
                // 空位导出
                isOpenDownload: false,
                // 判断是否为全国媒介
                isNation: true,
                isSale: false,//销售权限
                // 资源导出
                exportRescityList: [],
                isResExport: false,
                // 当前步骤
                exportAction: '/advertisement/GetCenterPointRes',
                exportResStep: 1,
                exportInfo:{
                    citys: [],
                    cityName: '',
                    radius: '',
                    type: '',
                },
                // 导出时到提示标签
                isShowExportTag: true,
                // 请求参数
                exportParams: {cityId: '',asrId:'',type:'',radius:''},
                // 上传的文件
                exportFileData: [],
                // 导出中
                isBroundImport: false,
                publishPlanDialog: false,
                planType: '0',
                relatedApId: null,
                apList: [],
                IsSevenBD:false
            };
        },
        created() {
            this.getSessionData();
            this.getRole();
            this.getFanCity();
            if (this.isAll) {
                this.getCompany();
            }
            this.searchFun();
            if (this.isSale) {
                this.getSubSaleList()
            };
            this.getCity()
            
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
                console.log('val----', val);
                this.pageSize = val;
                this.currPage = 1;
                this.searchFun();
            },
            // 获取公司
            getCompany() {
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                };
                if (sess.ascType == 0) {
                    api.getApi(this.apiVar.UCAPI + '/GetDirectAscr', info).then(res => {
                        console.log(res);
                        if (!res.data.SysCode) {
                            let result = [];
                            for (let data of res.data) {
                                let obj = {
                                    label: data.asName,
                                    value: data.asrID,
                                };
                                result.push(obj);
                            }
                            this.companyData = result;
                        } else if(res.data.SysCode == 100403) {
                            console.error('获取投放城市', res.data.MSG)
                        } else {
                            this.messageFun('warning', res.data.MSG);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    api.getApi(this.apiVar.UCAPI + '/ShowAscr', info).then(res => {
                        console.log(res);
                        if (!res.data.SysCode) {
                            let result = [];
                            for (let data of res.data) {
                                let obj = {
                                    label: data.asName,
                                    value: data.asrID,
                                };
                                result.push(obj);
                            }
                            this.companyData = result;
                        } else {
                            this.messageFun('warning', res.data.MSG);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            },
            // 滚动加载获取数据(无搜索数据)
            getData(params) {
                api.getApi(this.apiVar.Advertisement + '/GetProposal', params).then(res => {
                    if (!res.data.SysCode) {
                        let dataInfo = res.data;
                        this.totalNum = dataInfo.total;
                        this.currentPlan = this.funcData(dataInfo.list);
                        this.loading = false;
                        if (dataInfo.totalpage == 0) {
                            this.messageFun('warning', '暂无数据');
                        }
                    } else {
                        this.messageFun('warning', res.data.MSG);
                    }
                });
            },
            //获取下级销售列表
            getSubSaleList() {
                api.getApi(this.apiVar.Advertisement + '/GetSubSaleList').then(res => {
                    if (res.data.SysCode == 200200) {
                        this.filterRealName = filterFormat(res.data.data, "realName",'uID');

                    } else {
                        this.messageFun('warning', res.data.MSG);
                    }
                });
            },
            filterRealNameFun(value, row) {
                return row.realName === value;
            },
            // 数据处理
            funcData(dataArr) {
                let result = [];
                for (let data of dataArr) {
                    let tmpObj = {};
                    tmpObj = this.setTableData(data);
                    result.push(tmpObj);
                }
                console.log('result: ', result);
                return result;
            },
            // 获取session数据
            getSessionData() {
                this.sessionData = sessFun.getSess();
                let sess = this.sessionData;
                if (sess.ascType == 0 || (sess.uType == 'MD' && sess.mediaManageLevel == 1) || (sess.uType == 'BD') && sess.saleManageLevel == 1) {
                    this.isAll = true;
                } else {
                    this.isAll = false;
                }
            },
            // 获取城市
            getFanCity() {
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                };
                api.getApi(this.apiVar.Advertisement + '/GetAPDCityNames', info).then(res => {
                    let arr = res.data;
                    let result = [];
                    if (!arr.SysCode) {
                        for (let data of arr) {
                            result.push({
                                rName: data.rName,
                                rID: data.rID,
                                text: data.rName,
                                value: data.rName
                            });
                        }
                        this.filterCityData = result;
                    } else {
                        this.messageFun('warning', res.data.MSG);
                    }
                });
            },
            // 判断角色是否有新建按钮(媒介和销售有)
            getRole() {
                let role = this.sessionData.uType;
                this.role = role;
                this.IsSevenBD = (['1', '2', '3', '4', '5', '6', '7'].includes(this.sessionData.asrID) && this.sessionData.uType=='BD')
                console.log(role);
                if (role == "MD") {
                    this.isDisable = false;
                    if (this.sessionData.mediaManageLevel == 0) {
                        this.isNation = false
                    }
                }
                if (role == 'BD') {
                    this.isSale = true
                }
                if (role != "BD" && role != "MD") {
                    this.showNewBtn = false;
                }
                if (role == "BD" || role == "SM") {
                    this.isDisable = true;
                }
                if (role == "BD" && (this.sessionData.saleManageLevel === 0 || this.sessionData.saleManageLevel === 1)) {
                    this.isNation = false
                }
                if(this.sessionData.rela == "直营"){
                    this.isShowExportBtn = true
                }else{
                    this.isShowExportBtn = false
                }
            },
            // 状态转换成文本
            stateToText(val) {
                let state = [
                    {text: "已完成", value: 0, color: 'rgba(196,203,211,1)'},
                    {text: "未配点", value: -1, color: 'rgba(250, 173, 20, 1)'},
                    {text: "进行中", value: 1, color: 'rgba(113, 213, 217, 1)'},
                    {text: "未投放", value: 2, color: 'rgba(82,196,26,1)'},
                    {text: "投放中", value: 3, color: 'rgba(24,144,255,1)'},
                    {text: "强制结束", value: 5, color: 'rgba(245,34,45,1)'}
                ];
                for (let data of state) {
                    if (val == data.value) {
                        return data;
                    }
                }
            },
            // 时间格式规范预锁
            formatTime(val) {
                return dateFormat.toDate(val, '/');
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
            // 价格时间排序(请求后台接口进行排序)
            sortChange(column) {
                console.log('columm---', column);
                if (column.order == "ascending") {
                    this.searchInfo.orderby = column.prop;
                    this.searchInfo.desc = 0;
                } else if (column.order == "descending") {
                    this.searchInfo.orderby = column.prop;
                    this.searchInfo.desc = 1;
                }
                this.currPage = 1;
                this.searchFun();
            },
            routeSelect() {
                if(['1', '2', '3', '4', '5', '6', '7'].includes(this.sessionData.asrID)) {
                    // 直营
                    if(this.sessionData.uType=='BD') {
                        this.$router.push("./createPlan")
                    } else {
                        this.$router.push("./createPlanOld")
                    }
                } else {
                    // 加盟
                    this.$router.push("./createPlanOld")
                }
            },
            //新增意向方案查询意向方案草稿箱
            getProposalAdBackUp(params){
                api.getApi(this.apiVar.AddspProposal + '/getAdBackUp', params).then(res => {
                    console.log('获取意向方案缓存', res)
                    this.continueEditLoading.close()
                    if (res.data.SysCode == 200200) {
                        console.log('获取意向方案缓存成功', res.data)
                        let data = res.data.data
                        if (JSON.stringify(data) === '{}' || !data) {
                            this.$router.push("./createPlan")
                        } else {
                            // let planInfo = JSON.parse(data)
                            this.showProposalCookeAdPlan(data)
                            // 缓存到localStorage
                            // data.uiD = params.uid
                            // cacheAdPlan.setData(data)
                        }
                    } else {
                        // 后台返回异常则查看前台是否有缓存
                        let returnData = cacheAdPlan.getData(this.sessionData.uID)
                        if (returnData) {
                            this.showCookeAdPlan(returnData)
                        } else {
                            this.routeSelect()
                        }
                    }
                }).catch(err => {
                    console.log('err', err)
                    this.continueEditLoading.close()
                    if (this.$route.path.includes('planList')) {
                        this.routeSelect()
                    }
                })
            },
            // 新建方案
            addOne() {
                this.continueEditLoading = this.$loading({
                    lock: true,
                    text: '正在查询是否有未完成的方案',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                });
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token
                }
                if(this.IsSevenBD){
                    this.getProposalAdBackUp(params)
                }else{
                    api.getApi(this.apiVar.Advertisement + '/getAdPlanBackups', params).then(res => {
                            console.log('获取方案缓存', res)
                            this.continueEditLoading.close()
                            if (res.data.SysCode == 200200) {
                                console.log('获取缓存成功', res.data)
                                if (JSON.stringify(res.data.data) === '{}') {
                                    this.routeSelect()
                                } else {
                                    let planInfo = JSON.parse(res.data.data)
                                    this.showCookeAdPlan(planInfo)
                                    // 缓存到localStorage
                                    cacheAdPlan.setData(planInfo)
                                }
                            } else {
                                // 后台返回异常则查看前台是否有缓存
                                let returnData = cacheAdPlan.getData(this.sessionData.uID)
                                if (returnData) {
                                    this.showCookeAdPlan(returnData)
                                } else {
                                    this.routeSelect()
                                }
                            }
                        }).catch(err => {
                            console.log('err', err)
                            this.continueEditLoading.close()
                            if (this.$route.path.includes('planList')) {
                                this.routeSelect()
                            }
                        })
                }
               
            },
            // 点位表盘
            goToDiaPlate() {
                console.log('this.$router', this.$router)
                this.$router.push('./adsDialPlate')
            },
            //显示意向方案缓存信息
            showProposalCookeAdPlan(adPlan){
                this.planInfo = {
                    planName: adPlan.apName,
                    ownerSales: adPlan.saleRealName,
                    cleatTime: adPlan.lSetTime,
                    adsNum: adPlan.resList.length
                }
                this.unfinishedDialogVisible = true

            },
            // 显示缓存方案的信息
            showCookeAdPlan(adPlan) {
                // this.planForm.realNamesName
                let ownerSales = (this.sessionData.uType === 'MD' && adPlan.planData.baseInfo.realNamesName) ?
                    adPlan.planData.baseInfo.realNamesName : adPlan.planData.baseInfo.ownerSales
                this.planInfo = {
                    planName: adPlan.planData.baseInfo.planName,
                    ownerSales: ownerSales,
                    cleatTime: adPlan.setTime,
                    adsNum: adPlan.planData.adsList.length
                }
                this.unfinishedDialogVisible = true
            },
            // 删除
            deleteOne(row) {
                console.log(row);
            },
            // 随机生成合同编号编码格式： 合同编码固定[QC],日期[20180328],省份[44],城市[01],等几份合同[001](随机数)
            getContractNo(rid) {
                let date = new Date();
                let result = "QC";
                result = result + dateFormat.toDate(date, "");
                result = result + rid.toString().substring(0, 4);
                result = result + "00" + Math.round(Math.random() * 9);
                return result;
            },
            // 获取方案列表
            getPlanList(apID, suID) {
                return new Promise((resolve, reject)=>{
                    let params = {
                        uid:this.sessionData.uID,
                        token: this.sessionData.token,
                        sales_user: suID
                    }
                    api.getApi(this.apiVar.Advertisement + '/getSalesProject', params).then(res => {
                        console.log('销售所属方案',res)
                        if (res.data.SysCode == 200200) {
                            let resData =  res.data.data
                            let tempList = []
                            for(let key of resData){
                                if(apID != key.apId){
                                    tempList.push({
                                        value: key.apId,
                                        label: key.apName + '--' + key.cname + '--' + (key.pdStar||'') + '-' + (key.pdEnd||'')
                                    })
                                }
                            }
                            this.apList = tempList
                            resolve()
                        } else {
                            sessFun.messageFun('warning',res.data.MSG)
                        }
                    })
                })
            },
            // 发布
            release(row) {
                // 1)	全国媒介可发布全部销售的方案
                // 2)	地方媒介只能发布只选择了该所属公司点位的方案

                this.QCinfo = '';
                // 真实数据
                this.currentItem = row;
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apid: row.apID
                };
                let dataArr = row.cityArea;
                let sess = this.sessionData;
                let isRelease = false;
                if (sess.uType == 'MD' && (sess.mediaManageLevel == 1)) {
                    isRelease = true;
                } else {
                    let num = 0;
                    for (let data of dataArr) {
                        if (data.asrID == sess.asrID) {
                            num++;
                        }
                    }
                    if (num == dataArr.length) {
                        isRelease = true;
                    }
                }
                if (isRelease) {
                    // uid         int【必填】     当前账户UserID
                    // apid        int             公司对应方案apID
                    api.getApi(this.apiVar.Advertisement + "/GetFanganInfo", info)
                        .then(res => {
                            console.log(res.data);
                            if (res.data.SysCode == 200200) {
                                let text = res.data.data;
                                if (text.apQC) {
                                    this.QCinfo = text.apQC;
                                } else {
                                    this.QCinfo = this.getContractNo(text.rID);
                                }
                                this.getPlanList(text.apID, text.suID).then((resolve)=> {
                                    this.publishPlanDialog = true
                                })
                                /* MessageBox.prompt("合同编号:", {
                                    confirmButtonText: "是",
                                    cancelButtonText: "否",
                                    inputPattern: /^[^\u4e00-\u9fa5]{0,}$/,
                                    inputErrorMessage: "只能输入数字,字母,字符",
                                    inputValue: this.QCinfo
                                })
                                .then(() => {
                                    this.Ctrlloading = Loading.service(
                                        {
                                            text: "请耐心等待...",
                                            spinner: "el-icon-loading",
                                            background: "rgba(0, 0, 0, 0.7)"
                                        }
                                    );
                                    // 保存合同编号
                                    this.saveContractNo(this.QCinfo, this.planType, this.relatedApId);
                                }).catch(() => {
                                    Message.info('已取消操作');
                                }); */
                            } else {
                                this.messageFun('warning', res.data.MSG);
                            }
                        })
                } else {
                    this.messageFun('warning', '您没有权限发布该方案');
                }
            },
            // 提交
            commitRelease() {
                this.Ctrlloading = Loading.service(
                    {
                        text: "请耐心等待...",
                        spinner: "el-icon-loading",
                        background: "rgba(0, 0, 0, 0.7)"
                    }
                );
                // 保存合同编号
                this.saveContractNo(this.QCinfo, this.planType, this.relatedApId);
            },
            // 保存合同编号
            saveContractNo(contractNo, planType, relatedApId) {
                // uid         int【必填】     当前账户UserID
                // apid        int【必填】     方案apID
                // qc          String【必填】  方案合同编号
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apid: this.currentItem.apID,
                };
                info.qc = contractNo;
                info.planType = planType;
                if(planType==1||planType==2) {
                    if(!relatedApId) {
                        this.messageFun('warning', `请选择${['常规','续刊', '补刊', '空刊', '赠送'][planType]}的订单`);
                        this.Ctrlloading.close();
                        return
                    }
                    info.relatedApId = relatedApId

                }
                api.postApi(this.apiVar.Advertisement + "/SetAdPlan", info)
                    .then(res => {
                        console.log(res);
                        if (res.data.SysCode == 300200) {
                            // 查看是否被锁
                            api.postApi(this.apiVar.Advertisement + "/CheckLock", info).then(res => {
                                console.log(res.data);
                                if (!res.data.SysCode) {
                                    if (!res.data.IsLock) {
                                        this.releaseFun();
                                    } else {
                                        this.messageFun('warning', "该方案被预锁,请先解除预锁");
                                        this.Ctrlloading.close();
                                    }
                                }
                            });
                        } else {
                            this.messageFun('warning', res.data.MSG);
                            this.Ctrlloading.close();
                        }
                    })
                    .catch(res => {
                        console.log(res);
                        this.Ctrlloading.close();
                    });
            },
            releaseFun() {
                let reseleInfo = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apid: this.currentItem.apID,
                    qc: this.QCinfo,
                    act: 'R'
                };
                this.releaseFangan(reseleInfo);
            },
            // 发布方案(优化后的接口)
            releaseFangan(info) {
                api.postApi(this.apiVar.Advertisement + '/SetFangan', info).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 300200) {
                        this.messageFun('success', res.data.MSG);
                        for (let data of this.currentPlan) {
                            if (data.apID == this.currentItem.apID) {
                                this.$set(data, "apState", 2);
                                break;
                            }
                        }
                        this.publishPlanDialog = false
                    } else if (res.data.SysCode == 300500) {
                        if (res.data.asList) {
                            // 存在点位被占，是否立即去方案详情修改？
                            this.changeRoute();
                        } else {
                            this.messageFun('warning', res.data.MSG);
                        }
                    } else {
                        this.messageFun('warning', res.data.MSG);
                    }
                    this.Ctrlloading.close();
                }).catch(res => {
                    this.Ctrlloading.close();
                });
            },
            // 跳转到详情页面
            ToDetail(row) {
                sessionStorage.setItem("plan_apid", row.apID);
                sessionStorage.setItem('cityArea', JSON.stringify(row.cityArea));
                if(row.apState == -1) {
                    // 未配点意向方案详情
                    this.$router.push("./planEmptyPointDetail");
                } else if(row.planMode == 1) {
                    // 已配点意向方案
                    this.$router.push("./planDetail");
                } else {
                    this.$router.push("./planDetail");
                }
            },
            // 跳转到编辑页面
            ToEdit(row) {
                sessionStorage.setItem("plan_apid", row.apID);
                sessionStorage.setItem('cityArea', JSON.stringify(row.cityArea));
                console.log('roweedit', row)
                if(row.planMode == 1) {
                    // 意向方案
                    this.$router.push("./editPlan");
                } else {
                    // 非意向方案
                    this.$router.push("./editPlanOld");
                }
            },
            // 比较两个时间大小
            compareTime(arr, sField, eField) {
                return dateFormat.compareTime(arr, sField, eField);
            },
            // 意向方案配点（直营媒介配点）
            addPoint(row) {
                if(this.sessionData.uType == 'MD' && ['1', '2', '3', '4', '5', '6', '7'].includes(this.sessionData.asrID)) {
                    this.ToEdit(row);
                } else {
                    this.$message.warning('暂无权限！');
                }
            },
            //预锁
            preload(row) {
                this.$confirm('<p>锁定后，方案中的点位将被占用</p>', '是否确认锁定该方案的点位', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.currentItem = row;
                    let startObj = this.compareTime(row.cityArea, 'pdStar', 'pdEnd');
                    let date = timeFormat.toDate(new Date(), '/');
                    if (startObj.startTime <= date) {
                        this.messageFun('warning', '开始投放时间已经早于当前时间,请直接发布！');
                        return;
                    }
                    this.cityList = this.getCityList(row.cityArea);
                    if (this.cityList.length) {
                        this.cityChoose = [];
                        this.isLock = true;

                    } else {
                        this.messageFun('warning', '方案权限城市内您没有可以预锁的城市');
                    }
                    if (this.isNation) {
                        this.dialogVisible = true;
                    } else {
                        //地方媒介
                        this.Ctrlloading = Loading.service(
                            {
                                text: "请耐心等待...",
                                spinner: "el-icon-loading",
                                background: "rgba(0, 0, 0, 0.7)"
                            }
                        );
                        if (this.isLock) {
                            this.LockCity(this.cityList, 'L');
                        } else {
                            this.noLockCity(this.cityList);
                        }
                        this.dialogVisible = false;
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });

            },
            // 获取权限城市内的城市,进行勾选
            getCityList(arr) {
                // 1)	全国媒介可发布全部销售的方案
                // 2)	地方媒介只能发布只选择了该所属公司点位的方案
                // 1)	全国媒介可预锁全部的方案
                // 2)	地方媒介只能预锁方案中投放至该公司的部分
                let sess = this.sessionData;
                let resultArr = [];
                if (sess.uType == 'MD' && (sess.mediaManageLevel == 1)) {
                    resultArr = arr;
                } else {
                    for (let data of arr) {
                        if (data.asrID == sess.asrID) {
                            resultArr.push(data);
                        }
                    }
                }
                let asrIDs = [];
                let resultInfo = [];
                for (let com of resultArr) {
                    if (!asrIDs.join(',').includes(com.asrID)) {
                        asrIDs.push(com.asrID);
                        resultInfo.push(com);
                    }
                }
                return resultInfo;
            },
            // 解除预锁
            clearLock(row) {
                this.$confirm('<p>解锁后，方案中的点位将被释放</p>', '是否确认解锁该方案的点位', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    this.cityChoose = [];
                    this.isLock = false;
                    this.currentItem = row;
                    this.cityList = this.getCityList(row.cityArea);
                    if (this.isNation) {
                        this.dialogVisible = true;
                    } else {
                        //地方媒介
                        this.Ctrlloading = Loading.service(
                            {
                                text: "请耐心等待...",
                                spinner: "el-icon-loading",
                                background: "rgba(0, 0, 0, 0.7)"
                            }
                        );
                        if (this.isLock) {
                            this.LockCity(this.cityList, 'L');
                        } else {
                            this.noLockCity(this.cityList);
                        }
                        this.dialogVisible = false;
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });

            },
            // 检查当前拆分方案是否有点位被删除
            checkPoin(row) {
                let params = {
                    apID: row.apID
                }
                return new Promise((resolve, reject) => {
                    api.getApi(this.apiVar.Advertisement + '/BeforeSplitAdPlanCheck', params).then(res => {
                        console.log('检查点位是否被占用', res)
                        if (res.data.SysCode === 200200) {
                            resolve(true)
                        } else if (res.data.SysCode === 200500) {
                            this.$confirm(`${res.data.data}`, '确认拆单', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                // 方案拆单
                                resolve(true)
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消拆单'
                                });
                                resolve(false)
                            });
                        } else {
                            sessFun.messageFun('warning', res.data.MSG || '检查占用点位异常')
                            resolve(false)
                        }
                    })
                }).catch(() => resolve(false))
            },
            // KA方案拆分
            splitAdPlan(row) {
                if(row.planMode == 1) {
                    // 意向方案
                    api.postApi('/addsp/proposal/splitAdPlan', {apID: row.apID}).then(res => {
                        console.log('方案拆分res', res)
                        if (res.data.SysCode === 200200) {
                            sessFun.messageFun('success', '拆分成功')
                            this.searchFun()
                        } else {
                            sessFun.messageFun('warning', res.data.MSG || '方案异常')
                        }
                    })
                } else {
                    this.checkPoin(row).then(res=>{
                        if(res === true) {
                            api.getApi(this.apiVar.Advertisement + '/SplitAdPlan', {apID: row.apID}).then(res => {
                                console.log('方案拆分res', res)
                                if (res.data.SysCode === 200200) {
                                    sessFun.messageFun('success', '拆分成功')
                                    this.searchFun()
                                } else {
                                    sessFun.messageFun('warning', res.data.MSG || '方案异常')
                                }
                            })
                            
                        }
                    }).catch(error=> {

                    })
                }
            },
            cancelLock() {
                this.dialogVisible = false;
                Message.info("已取消操作");
            },
            // 确定预锁
            confirmLock() {
                console.log(this.cityChoose);
                if (this.cityChoose.length) {
                    this.Ctrlloading = Loading.service(
                        {
                            text: "请耐心等待...",
                            spinner: "el-icon-loading",
                            background: "rgba(0, 0, 0, 0.7)"
                        }
                    );
                    let arr = [];
                    for (let select of this.cityChoose) {
                        for (let data of this.cityList) {
                            if (data.asrID == select) {
                                arr.push(data);
                                break;
                            }
                        }
                    }

                    if (this.isLock) {
                        this.LockCity(arr, 'L');
                    } else {
                        this.noLockCity(arr);
                    }
                    this.dialogVisible = false;
                } else {
                    if (this.isLock) {
                        this.messageFun('warning', '请选择预锁公司！');
                    } else {
                        this.messageFun('warning', '请选择解锁公司！');
                    }
                }
            },
            // 预锁
            LockCity(arr, act) {
                console.log('lockcity----', arr);
                let asrIDs = [];
                for (let data of arr) {
                    asrIDs.push(data.asrID);
                }
                let apid = arr[0].apID;
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    act: act,
                    apid: apid,
                    asrIDs: asrIDs.join(',')
                };
                console.log(info);
                api.postApi(this.apiVar.Advertisement + '/SetFangan', info).then(res => {
                    if (res.data.SysCode == 300200) {
                        this.searchFun();
                        this.messageFun('success', res.data.MSG);

                    } else if (res.data.SysCode == 300500) {
                        if (res.data.asList) {
                            // 存在点位被占，是否立即去方案详情修改？
                            this.changeRoute();
                        } else {
                            this.messageFun('warning', res.data.MSG);
                        }
                    } else {
                        this.messageFun('warning', res.data.MSG);
                    }
                    this.Ctrlloading.close();
                }).catch(err => {
                    console.log(err);
                    this.Ctrlloading.close();
                });
            },
            // 解锁
            noLockCity(arr) {
                let asrIDs = [];
                for (let data of arr) {
                    asrIDs.push(data.asrID);
                }
                let apid = arr[0].apID;
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apId: apid,
                    asrIDs: asrIDs
                };
                console.log(info);
                api.postApi(this.apiVar.Advertisement + '/ClFangan', info).then(res => {
                    console.log(res.data);
                    this.Ctrlloading.close();
                    this.searchFun();
                    this.messageFun('success', res.data.MSG);
                }).catch(err => {
                    console.log(err);
                    this.Ctrlloading.close();
                });
            },
            // 7天以上显示7天,否则显示相隔天数
            countDay(time) {
                let dayA = Math.abs(timeFormat.getDayBetween(time, new Date()));
                console.log('dayA-----', dayA);
                let RemainDay = dayA > 7 ? 7 : dayA;
                return RemainDay;
            },
            // 弹出框修改路径
            changeRoute() {
                MessageBox.confirm(
                    `存在点位被占，是否修改方案？`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                    .then(() => {
                        this.ToEdit(this.currentItem);
                    })
                    .catch(() => {
                        Message.info("已取消操作");
                    });
            },
            // 搜索（优化）
            search() {
                let {keyword, rangeDate, status, company, cityWord, Lock, dateType} = this.searchInfo;
                this.isSearch = false;
                let timer = setTimeout(() => {
                    this.isSearch = true;
                    clearTimeout(timer);
                }, 1000);
                if (keyword || rangeDate || (status === 0 || status > 0) || company || cityWord || Lock || dateType) {
                    this.currentPlan = [];
                    this.loading = true;
                    this.currPage = 1;
                    this.searchFun();

                } else {
                    this.messageFun('warning', '请输入搜索条件');
                }
            },
            searchFun() {
                this.paginationShow = false;
                this.loading = true;
                let info = this.searchFormat();
                this.getData(info);
                this.$nextTick(function () {
                    this.paginationShow = true;
                });
            },
            // 搜索数据格式化
            searchFormat() {
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    start: this.currPage,
                    pagesize: this.pageSize
                };
                let {select, keyword, rangeDate, status, company, cityWord, Lock, orderby, desc, dateType} = this.searchInfo;
                info = {
                    ...info,
                    ...(keyword && {keywordType: select, keyword}),
                    ...(rangeDate && {starttime: rangeDate[0], andtime: rangeDate[1]}),
                    ...(status !== '' && status >= 0 && {apstate: status}),
                    ...(company && {asrID: company}),
                    ...(cityWord && {rname: cityWord}),
                    ...(Lock && {onyusuo: Lock}),
                    ...(orderby && {orderby}),
                    ...(desc !== '' && desc >= 0 && {desc}),
                    ...(rangeDate && {timeType: dateType})
                };
                return info;
            },
            // 设置表格数据
            setTableData(item) {
                let obj = {
                    apSrc:item.src,
                    adcID: item.adcID,
                    apID: item.apID,
                    apName: item.apName || '',
                    apState: item.apState || '',
                    planMode: item.planMode || 0,
                    apTotal: item.apTotal || '',
                    apcTime: item.apcTime || '',
                    bTitle: item.bTitle || '--',
                    cName: item.cName || '',
                    realName: item.realName || '',
                    cityArea: [],
                    // isKA: item.isKA,     // 1：ka销售方案，不可发布及预锁
                    apControlLevel: item.apControlLevel   // 1:可预锁、发布 2：可拆单、不可预锁和发布 3.表示KA销售单已拆，不可（拆单、预锁、发布）
                };
                item.details.sort((a, b) => {
                    return a.asrID - b.asrID;
                });
                let asrIDarr = [];
                obj.canLock = item.details.some(function (item, index) {
                    return !item.RemainDay;
                })
                obj.unLock = item.details.some(function (item, index) {
                    return item.RemainDay;
                })
                // console.log(obj.canLock); //false表示不能再预锁
                // console.log(obj.unLock); //true 表示可解锁
                for (let data of item.details) {
                    data.apState=item.apState //新增字段,判断是否是意向方案,点位面数显示为--
                    if (asrIDarr.includes(data.asrID)) {
                        data.isshow = 0;
                    } else {
                        asrIDarr.push(data.asrID);
                        data.isshow = 1;
                    }

                }
                obj.cityArea = item.details;
                return obj;
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            // 重置
            reset() {
                this.searchInfo = {
                    select: "1",
                    keyword: "",
                    rangeDate: "",
                    status: '',
                    company: '',
                    cityWord: '',
                    Lock: '',
                    dateType: '0',
                };

                this.currPage = 1;
                this.currentPlan = [];
                this.isReset = false;
                let timer = setTimeout(() => {
                    this.isReset = true;
                    clearTimeout(timer);
                }, 1000);
                this.searchFun();
            },
            // 操作提示统一方法
            messageFun(mesType, mes) {
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
            //清除意向方案缓存
            clearProposalAdPlanBackups(params){
                api.postApi(this.apiVar.AddspProposal + '/cleanAdBackUp', params).then(res => {
                        console.log('清空意向方案缓存的方案', res)
                        if (res.data.SysCode == 200200) {
                            console.log('缓存意向方案清除成功')
                        } else {
                            console.log('缓存意向方案清除失败')
                        }
                    })
                    cacheAdPlan.removeData(this.sessionData.uID)
                    this.routeSelect()
            },
            // 放弃继续编辑
            cancelEdit() {
                this.$confirm('放弃后将清除该方案信息!', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showClose: false,
                    type: 'warning '
                }).then(() => {
                    this.unfinishedDialogVisible = false
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token
                    }
                    if(this.IsSevenBD){
                        this.clearProposalAdPlanBackups(params)
                    }else{
                        api.postApi(this.apiVar.Advertisement + '/clearAdPlanBackups', params).then(res => {
                        console.log('清空缓存的方案', res)
                        if (res.data.SysCode == 200200) {
                            console.log('缓存方案清除成功')
                        } else {

                        }
                    })
                    cacheAdPlan.removeData(this.sessionData.uID)
                    this.routeSelect()
                    }
                   
                }).catch(() => {
                    Message.info('取消成功')
                })
            },
            // 继续创建
            continueEdit() {
                this.continueEditLoading = this.$loading({
                    lock: true,
                    text: '方案数据获取中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                });
                if(this.IsSevenBD){
                    this.$router.push("./createPlan?unfinishedPlan");
                }else{
                    this.$router.push("./createPlanOld?unfinishedPlan");
                }
               
                this.unfinishedDialogVisible = false
            },
            /**
             * 周边小区导出
             * */
            // 获取权限城市
            getCity() {
                let info = {
                    "token": this.sessionData.token,
                    "uid": this.sessionData.uID
                };
                api.postApi(this.apiVar.Advertisement + '/GetAuthorCity', {}).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 300200) {
                        this.exportRescityList = res.data.data.map(item=>{
                            return {
                                label: item.rName,
                                value: item.rID.toString()
                            }
                        })
                    } else {
                        sessFun.messageFun('warning',res.data.MSG || '城市下拉获取异常')
                    }
                });
            },
            exportRes() {
                // 数据初始化
                this.exportResStep = 1
                this.exportInfo = {
                    citys: [],
                    cityName: '',
                    radius: '',
                    type: '',
                }
                this.exportFileData = []
                this.isResExport = true
            },
            exportCityFun(val) {
                console.log('val',val)
                if (val.length) {
                    for(let key of this.exportRescityList) {
                        if(key.value == val) {
                            this.exportInfo.cityName = key.label
                        }
                    }
                }
            },
            exportUploadFile(params) {
                this.exportFileData = [];
                let fileObj = params.file;
                this.exportFileData.push(fileObj);
                console.log('上传周边',params);
            },
            // 文件删除
            exportFileRemove(file, fileList){
                console.log(file, fileList);
                this.exportFileData = fileList
            },
            //周边小区导出下一步
            nextExportRes() {
                if (this.exportResStep === 1) {
                    if (!this.exportInfo.citys.length) {
                        sessFun.messageFun('warning', '请选择城市')
                        return
                    }
                    if (!this.exportInfo.radius) {
                        sessFun.messageFun('warning', '请填写半径范围')
                        return
                    } else {
                        if (!(/(^[1-9]\d*$)/.test(this.exportInfo.radius)) || this.exportInfo.radius > 3000) {
                            sessFun.messageFun('warning','请输入1~3000的整数')
                            return;
                        }
                    }
                    if(!this.exportInfo.type) {
                        sessFun.messageFun('warning', '请选择类型')
                        return
                    }
                    this.exportResStep += 1
                    console.log('exportInfo',this.exportInfo)
                } else if (this.exportResStep < 3) {
                    this.exportResStep += 1
                } else {
                    console.log('exportFileData',this.exportFileData)
                    this.isBroundImport = true
                    if(this.exportFileData.length) {
                        sessFun.messageFun('warning','导出excel可能需要一分钟甚至更长时间!')
                        this.exportParams = {
                            radius: this.exportInfo.radius,
                            cityId: this.exportInfo.citys,
                            asrId: this.sessionData.asrID,
                            type: this.exportInfo.type
                        }
                        console.log(this.exportParams)
                        this.importBroundRes()
                    } else {
                        sessFun.messageFun('warning', '请先上传文件！')
                        this.isBroundImport = false
                    }
                }
            },
            // 导出周边小区
            importBroundRes() {
                let formData = new FormData();
                formData.append('file', this.exportFileData[0]);
                formData.append('radius', this.exportInfo.radius);
                formData.append('cityId', this.exportInfo.citys);
                formData.append('asrId', this.sessionData.asrID);
                formData.append('type', this.exportInfo.type);
                // 上传文件
                api.postExportFile(this.exportAction, formData, 'blob').then(res => {
                    console.log('导出周边小区',res,res.data.type)
                    if(res.data.type === 'text/html') {
                        let reader = new FileReader();
                        reader.readAsText(res.data, 'utf-8');
                        reader.onload =  ()=> {
                            let resData = JSON.parse(reader.result);
                            console.log('data',resData)
                            sessFun.messageFun('warning', resData.MSG || '导出异常！')
                        }
                    } else {
                        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
                        let downloadElement = document.createElement('a');
                        let href = window.URL.createObjectURL(blob); //创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = this.exportInfo.cityName + '.xlsx'  //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click();
                        document.body.removeChild(downloadElement);         //下载完成移除元素
                        window.URL.revokeObjectURL(href);                   //释放掉blob对象
                        this.isResExport = false
                        sessFun.messageFun('success','导出成功')
                    }
                    this.isBroundImport = false
                }).catch(res => {
                    console.log(res);
                });
            },
        },
        beforeDestroy() {
            if (this.continueEditLoading) {
                this.continueEditLoading.close()
            }
        }
    };
</script>
<style lang="scss" scoped>
    a {
        color: #108ee9;
    }

    /*筛选*/
    /deep/ .el-checkbox-group .el-checkbox + .el-checkbox {
        margin-left: 0;
    }

    .date-type-select {
        position: relative;
        left: 30px;
        z-index: 9;
        width: 104px;
    }

    .date-type-select /deep/ .el-input__inner {
        width: 104px !important;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        color: rgb(144, 147, 153);
    }

    .date-type-select /deep/ .el-input.is-focus .el-input__inner {
        border-color: #dcdfe6
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

    /deep/ .min_input .el-input-group--prepend .el-input__inner {
        width: 110px;
    }

    .el-input {
        width: 290px;
        border-radius: 4px;
    }

    .flex_box {
        display: flex;
        flex-wrap: wrap;
    }

    .marginR {
        margin-right: 6px;
        margin-bottom: 16px;
    }

    /deep/ .el-date-editor .el-range-separator {
        font-size: 14px;
    }

    /*日期控件*/
    .block {
        display: inline-block;
        margin-left: 2px;
        position: relative;
    }

    /deep/ .el-range-separator {
        position: relative;
        top: -2px;
    }

    /deep/ .search_row .el-input__inner {
        width: 185px;
    }

    /deep/ .el-date-editor {
        width: 245px;
    }

    /deep/ .el-date-editor i,
    /deep/ .el-date-editor input,
    /deep/ .el-date-editor span {
        float: left;
        position: relative;
    }

    /*锁*/
    .fa.fa-lock.fa-lg,
    .fa.fa-unlock.fa-lg {
        font-size: 16px;
        color: #d8d8d8 !important;
        position: relative;
        top: -1px;
    }

    /*操作*/
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .mediaList_wrap .mediaList_container .table_wrap {
        margin: 0 auto 16px;
    }

    .el-button + .el-button {
        margin-left: 0;
    }

    .table_wrap .city_p span {
        float: none !important;
    }

    .table_wrap .city_p {
        position: relative;
    }

    .table_wrap .city_p .lock-icon {
        position: absolute;
        right: -10px;
        top: 0px;

    }

    .table_wrap .city_p .lock-icon b {
        display: inline-block;
        padding: 0 4px;
        font-size: 12px;
        height: 16px;
        line-height: 16px;
        text-align: center;
    }

    .table_wrap .city_p .lock-icon b.blue {
        color: #1890FF;
        background: rgba(230, 247, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(145, 213, 255, 1);
    }

    .table_wrap .city_p .lock-icon b.red {
        color: #FA541C;
        background: rgba(255, 242, 232, 1);
        border-radius: 2px;
        border: 1px solid rgba(255, 187, 150, 1);
    }

    /deep/ .el-date-editor--daterange.el-input__inner {
        width: 240px;
    }

    .el-dialog__footer span {
        float: none !important;
    }

    /deep/ .el-table td .cell {
        padding: 2px 10px;
        height: auto;
        line-height: 28px;
    }

    /*未完成方案*/
    /deep/ .unfinished_plan_dialog .el-dialog__header {
        padding: 20px 20px;
        border-bottom: 1px solid #E8E8E8;
    }

    /deep/ .unfinished_plan_dialog .el-dialog__title {
        font-size: 15px;
    }

    /deep/ .unfinished_plan_dialog .el-dialog__body {
        padding: 10px 20px;
    }

    /deep/ .unfinished_plan_dialog .el-dialog__title {
        font-weight: bold;
    }

    .unfinished_plan_li {
        line-height: 28px;
    }

    .ad_pagination {
        display: flex;
        justify-content: space-between;
    }

    .ad_pagination p {
        color: rgba(0, 0, 0, 0.65);
        font-size: 12px;
    }

    .ad_pagination span {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: rgba(230, 247, 255, 1);
        border-radius: 2px;
        border: 1px solid rgba(145, 213, 255, 1);
        text-align: center;
        color: #1890ff;
        margin-right: 5px;
    }

    /*资源导出*/
    .export_step_box{
        border: 1px solid rgba(218,218,218,1);
        padding: 12px 18px;
        color: rgba(102,102,102,1);
        font-size: 15px;
        position: relative;
    }

    .export_ul .el-select{
        width: 82%;
    }

    .radius_input.el-input-group{
        width: 82%;
    }

    .export_ul li{
        margin-bottom: 16px;
    }

    .export_ul li:last-child{
        margin-bottom: 0;
    }

    .export_ul li>span{
        width: 70px;
        text-align: right;
        display: inline-block;
    }

    .info_box {
        height:32px;
        background:rgba(230, 247, 255, 1);
        border-radius:4px;
        border:1px solid rgba(145,213,255,1);
        line-height: 32px;
        padding:  0 16px;
        position: relative;
        font-weight:400;
        font-size: 14px;
        color:rgba(0,0,0,0.65);
        margin-bottom: 16px;
    }

    .info_box /deep/ .el-icon-close{
        cursor: pointer;
        margin-left: 24px;
        position: absolute;
        top: 9px;
        right: 8px;
    }

    .export_step_box img{
        width: 24px;
        height: 27px;
        vertical-align: middle;
    }

    .downloag_btn{
        position: absolute;
        right: 18px;
        top: 14px;
        cursor: pointer;
        color:rgba(102,102,102,1);
    }
    /deep/ .publish_dialog {
        .el-dialog__header {
            padding: 16px 24px 6px;
        }
        .el-dialog__body {
            padding: 0 24px 14px;
            .comment {
                display: block;
                color: rgba(0, 0, 0, 0.45);
                line-height: 24px;
                margin-bottom: 16px;
            }
            .el-form-item {
                margin-bottom: 12px;
            }
            .el-form-item__label {
                padding-bottom: 4px;
                line-height: 24px;
            }
            .el-input--small, .el-select--small {
                width: 100%;
            }

        }
    }
    /deep/ .Import_dialog .el-upload-list__item{
        width: 100%;
    }

    /deep/ .Import_dialog .el-upload-dragger{
        padding-top: 9%;
        width: 424px;
        height: 135px;
        background: rgba(0, 0, 0, 0.06);
    }

    /deep/ .Import_dialog .el-upload-dragger img{
        width: 28px;
        height: 30px;
    }
    .u-bk-btn{
        padding: 0 3px;
        width:30px;
        height:16px;
        background:rgba(24,144,255,1);
        border-radius:2px;
        color: #fff;
        font-size: 12px;
    }
</style>

