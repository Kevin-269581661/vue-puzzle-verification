<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">方案管理</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>方案列表</h2>
            </div>
            <div class="mediaList_container">
                <el-row>
                    <div class="mediaList_handel">
                        <span>
                            <div style="display:inline-block" class="min_input">
                                <el-input placeholder="请输入内容" v-model="searchInfo.keyword" class="input-with-select">
                                    <el-select v-model="searchInfo.select" slot="prepend" placeholder="请选择">
                                        <el-option label="方案名称" value="1"></el-option>
                                        <el-option label="客户名称" value="2"></el-option>
                                        <el-option label="品牌名称" value="3"></el-option>
                                    </el-select>
                                </el-input>
                            </div>
                        </span>
                        <span>
                            <div class="block">
                                <el-date-picker class="input-with-select" v-model="searchInfo.rangeDate" type="daterange" range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="投放日期" end-placeholder="投放日期">
                                </el-date-picker>
                            </div>
                        </span>
                        <span>
                            <div class="block">
                                <el-select v-model="searchInfo.status" placeholder="请选择状态">
                                    <el-option v-for="item of stateList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                                </el-select>
                            </div>
                        </span>
                        <span v-if="isAll">
                            <div class="block">
                                <el-select v-model="searchInfo.company" placeholder="请选择所属公司" filterable >
                                    <el-option v-for="item of companyData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </div>
                        </span>
                        <span>
                            <div class="block">
                                <el-select v-model="searchInfo.cityWord" placeholder="请选择投放城市" filterable>
                                    <el-option v-for="item of filterCityData" :key="item.rID" :label="item.text" :value="item.text"></el-option>
                                </el-select>
                            </div>
                        </span>
                        <span>
                            <div class="block">
                                <el-select v-model="searchInfo.Lock" placeholder="是否预锁">
                                    <el-option label="已预锁" value="2"></el-option>
                                    <el-option label="未预锁" value="1"></el-option>
                                </el-select>
                            </div>
                        </span>
                        <span>
                            <el-button type="primary" icon="el-icon-search" @click="search()" :disabled="!isSearch">搜索</el-button>
                        </span>
                        <span>
                            <el-button @click="reset()" :disabled="!isReset">重置</el-button>
                        </span>
                        <span>
                            <el-button plain v-if="showNewBtn" @click="addOne()">新建</el-button>
                        </span>
                        <span>
                            <el-button plain v-if="showNewBtn" @click="isOpenDownload=true">导空位</el-button>
                        </span>
                    </div>
                </el-row>
                <div class="table_wrap">
                    <el-table border :data="currentPlan" style="width: 100%" v-loadmore="pointLoadMore" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                        <el-table-column label="方案名称" min-width="14.9%">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.apName" placement="bottom" v-if="scope.row.apName.length>15">
                                    <a href="javascript:void(0);" @click="ToDetail(scope.row)">{{scope.row.apName}}</a>
                                </el-tooltip>
                                <a href="javascript:void(0);" @click="ToDetail(scope.row)" v-else>{{scope.row.apName}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cName" label="客户名称" min-width="12.6%">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.cName" placement="bottom" v-if="scope.row.cName.length>9">
                                    <span title="">{{scope.row.cName}}</span>
                                </el-tooltip>
                                <span v-else title="">{{scope.row.cName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bTitle" label="品牌名称" min-width="6.6%">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.bTitle" placement="bottom" v-if="scope.row.bTitle.length>4">
                                    <span>{{scope.row.bTitle||'--'}}</span>
                                </el-tooltip>
                                <span v-else>{{scope.row.bTitle||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="方案价格" sortable :sort-method="sortPrice" class="tar" min-width="8.3%">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.apTotal?priceFormat(scope.row.apTotal/100):0" placement="bottom" v-if="scope.row.apTotal?scope.row.apTotal.toString().length>8:0">
                                    <span>&yen; {{scope.row.apTotal?priceFormat(scope.row.apTotal/100):0}}</span>
                                </el-tooltip>
                                <span v-else>&yen; {{scope.row.apTotal?priceFormat(scope.row.apTotal/100):0}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="realName" label="所有人" min-width="6.1%"  v-if="!(role=='AD')">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.realName" placement="bottom">
                                    <span>{{scope.row.realName}}</span>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                        <el-table-column label="投放城市(点位面数,排期)"
                            prop="cityArea"
                            min-width="25.8%" >
                            <template slot-scope="scope">
                                <p v-if="isAll" v-for="(item, index) of scope.row.cityArea" :key="index" class="city_p">
                                    <template v-if="item.isshow">
                                        <span v-if="item.isshow">{{item.asName}}</span>
                                        <span v-show="item.RemainDay">
                                             预锁:剩<b :style="item.RemainDay<=3?'color:red;':''">{{item.RemainDay}}</b>天
                                        </span>
                                        <i v-if="item.RemainDay>=0" class="fa fa-lock fa-lg" style="color:#999;"></i>
                                        <i v-else></i>
                                        <br>
                                    </template>
                                    {{item.city+'('+item.num+'面,'+formatTime(item.pdStar)+'至'+formatTime(item.pdEnd)+')'}}
                                </p>
                                <p v-if="!isAll" v-for="item of scope.row.cityArea" :key="item.rid" class="city_p">
                                    {{item.city+'('+item.num+'面,'+formatTime(item.pdStar)+'至'+formatTime(item.pdEnd)+')'}}
                                    <span v-show="item.RemainDay"> 预锁:剩<b :style="item.RemainDay<=3?'color:red;':''">{{item.RemainDay}}</b>天</span>
                                    <i v-if="item.RemainDay>=0" class="fa fa-lock fa-lg" style="color:#999;"></i>
                                    <i v-else></i>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建日期" min-width="8.3%" sortable :sort-by="sortData">
                            <template slot-scope="scope">
                                <span>{{formatTime(scope.row.apcTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="tac" prop="apState" label="状态" min-width="6.1%">
                            <template slot-scope="scope">
                                <span>{{ stateToText(scope.row.apState) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="8.4%" v-if="!(role=='OP' || role=='AD')">
                            <template slot-scope="scope">
                                <el-dropdown size="small" split-button trigger="click" placement="bottom-start">操作
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native.prevent="preload(scope.row)" :disabled="isDisable||(scope.row.apState!=1)">预锁
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="release(scope.row)" :disabled="isDisable||(scope.row.apState!=1)">发布
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native.prevent="clearLock(scope.row)" :disabled="isDisable||(scope.row.apState!=1)">解除预锁
                                        </el-dropdown-item>
                                        <!-- <el-dropdown-item @click="deleteOne(scope.row)" :disabled="scope.row.apState!=1">删除
                                        </el-dropdown-item>-->
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <el-dialog :title="isLock?'请选择预锁公司':'请选择解锁公司'" :visible.sync="dialogVisible" width="30%" center>
                    <el-checkbox-group v-model="cityChoose">
                        <el-checkbox v-if="isLock" :label="item.asrID" v-for="item of cityList" :key="item.rid" border :disabled="item.RemainDay>=0" size="mini">{{item.asName}}</el-checkbox>
                        <el-checkbox v-if="!isLock" :label="item.asrID" v-for="item of cityList" :key="item.rid" border :disabled="item.RemainDay==undefined || item.RemainDay==null" size="mini">{{item.asName}}</el-checkbox>
                    </el-checkbox-group>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="cancelLock">取 消</el-button>
                        <el-button type="primary" @click="confirmLock">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
        <!--存在异常未完成的方案-->
        <el-dialog title="您有一个新方案未完成保存，是否继续编辑？"
                   :visible.sync="unfinishedDialogVisible"
                   width="400px"
                   custom-class="unfinished_plan_dialog"
                   :close-on-click-modal="false"
                   :show-close="false">
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
                        <span>已选点位:</span>
                        <span>{{planInfo.adsNum}} 面</span>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">放 弃</el-button>
                <el-button type="primary" @click="continueEdit">继续编辑</el-button>
            </span>
        </el-dialog>

        <!-- 导出空点 -->
        <el-dialog title="空位导出" :visible.sync="isOpenDownload" width="30%">
            <download-vacancy></download-vacancy>
        </el-dialog>
    </div>
</template>

<script>
import api from "../../api/api.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
// 方案缓存
import cacheAdPlan from "../../commonFun/cacheAdPlan"
import downloadVacancy from "../../components/common/components/vacancyDownload.vue"
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
                // 状态筛选
                status: '',
                // 公司搜索
                company: '',
                // 城市筛选
                cityWord: '',
                // 是否预锁
                Lock: '',
            },
            // 公司列表
            companyData: [],
            isAll: false,
            // 列表数据
            pageSize: 15,
            currPage: 1,
            totalPage: 0,
            Ctrlloading: false,
            // 登录信息、
            sessionData: {},
            // 合同编号
            QCinfo: '',
            // 登录者角色
            role: "",
            //   判断是否有发布，预锁解锁等功能
            isDisable: true,
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
                { text: '已完成', value: 0 },
                { text: '进行中', value: 1 },
                { text: '未投放', value: 2 },
                { text: '投放中', value: 3 },
                { text: '强制结束', value: 5 }
            ],
            // 根据角色判断是否显示新建按钮
            showNewBtn: true,
            // 滚动加载
            loading_point: true,
            isSearch: true,
            isReset: true,
            // 表格数据
            currentPlan: [],
            // 权限城市过滤数组
            filterCityData: [],
            // 未完成方案提示
            unfinishedDialogVisible: false,
            // 未完成方案
            planInfo: '',
            // 继续编辑未完成方案跳转时的loading
            continueEditLoading:'',
            // 空位导出
            isOpenDownload: false,
        };
    },
    created() {
        this.getSessionData();
        this.getRole();
        this.getFanCity();
        if(this.isAll){
            this.getCompany();
        }
        this.searchFun();
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
    methods: {
        // 获取公司
        getCompany(){
            let sess = this.sessionData;
            let info = {
                uid: sess.uID,
                token: sess.token,
            };
            if(sess.ascType==0){
                api.getApi(this.UCAPI + '/GetDirectAscr', info).then(res =>{
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
            }else{
                api.getApi(this.UCAPI + '/ShowAscr', info).then(res =>{
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
            }
        },
        // 方案列表--滚动监听
        pointLoadMore(){
            if(this.loading_point){
                this.loading_point = false;
                if(this.currPage <= this.totalPage){
                    this.searchFun();
                }
            }
        },
        // 滚动加载获取数据(无搜索数据)
        getData(params){
            api.getApi(this.Advertisement+'/GetProposal', params).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    if(!res.data.SysCode){
                        let dataInfo = res.data;
                        this.totalPage = dataInfo.totalPage;
                        let dataArr = dataInfo.list;
                        this.currentPlan = this.currentPlan.concat(this.funcData(dataArr));
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
            let result = [];
            for(let data of dataArr){
                let tmpObj = {};
                tmpObj = this.setTableData(data);
                result.push(tmpObj);
            }
            return result;
        },
        // 获取session数据
        getSessionData() {
            this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
            let sess = this.sessionData;
            if(sess.ascType==0 || (sess.uType=='MD' && sess.mediaManageLevel==1) || (sess.uType =='BD') && sess.saleManageLevel == 1){
                this.isAll = true;
            }else{
                this.isAll = false;
            }
        },
        // 获取城市
        getFanCity(){
            let info ={
                uid: this.sessionData.uID,
                token: this.sessionData.token,
            };
            api.getApi(this.Advertisement+'/GetAPDCityNames', info).then(res =>{
                console.log(res.data);
                let arr = res.data;
                let result = [];
                if(!arr.SysCode){
                    for(let data of arr){
                        result.push({
                            rName: data.rName,
                            rID: data.rID,
                            text: data.rName,
                            value: data.rName
                        });
                    }
                    this.filterCityData = result;
                } else if (res.data.SysCode == 100302) {
                    this.loginTimeout();
                } else {
                    Message.warning(res.data.MSG);
                }
            });
        },
        // 判断角色是否有新建按钮(媒介和销售有)
        getRole() {
            let role = this.sessionData.uType;
            this.role = role;
            console.log(role);
            if (role == "MD") {
                this.isDisable = false;
            }
            if (role != "BD" && role != "MD") {
                this.showNewBtn = false;
            }
            if (role == "BD" || role == "SM") {
                this.isDisable = true;
            }
        },
        // 状态转换成文本
        stateToText(val) {
            let state = [
                { text: "已完成", value: 0 },
                { text: "进行中", value: 1 },
                { text: "未投放", value: 2 },
                { text: "投放中", value: 3 },
                { text: "强制结束", value: 5 }
            ];
            for (let data of state) {
                if (val == data.value) {
                    return data.text;
                }
            }
        },
        // 时间格式规范
        formatTime(val) {
            return dateFormat.toDate(val);
        },
        // 价格加上逗号
        priceFormat(price) {
            return commaFormat.init(price);
        },
        // 价格排序
        sortPrice(a, b) {
            return a.apTotal - b.apTotal;
        },
        //日期排序
        sortData(a, b) {
            return dateFormat.toDate(a.apcTime, '') - dateFormat.toDate(b.apcTime, '');
        },
        // 新建方案
        addOne() {
            let params = {
                uid:this.sessionData.uID,
                token:this.sessionData.token
            }
            api.getApi(this.Advertisement + '/getAdPlanBackups',params).then(res=>{
                console.log('获取方案缓存',res)
                if (res.data.SysCode == 200200) {
                    console.log('获取缓存成功',res.data)
                    if(JSON.stringify(res.data.data) === '{}'){
                        this.$router.push("./createPlan");
                    }else{
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
                        this.$router.push("./createPlan");
                    }
                }
            })
        },
        // 显示缓存方案的信息
        showCookeAdPlan(adPlan){
            this.planInfo = {
                planName: adPlan.planData.baseInfo.planName,
                ownerSales: adPlan.planData.baseInfo.ownerSales,
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
            result = result + "00" + Math.round(Math.random() * 10);
            return result;
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
            if(sess.uType == 'MD' && (sess.mediaManageLevel == 1)){
                isRelease = true;
            }else{
                let num = 0;
                for(let data of dataArr){
                    if(data.asrID == sess.asrID){
                        num++;
                    }
                }
                if(num == dataArr.length){
                    isRelease = true;
                }
            }
            if(isRelease){
                // uid         int【必填】     当前账户UserID
                // apid        int             公司对应方案apID
                api.getApi(this.Advertisement+"/GetFanganInfo", info)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.SysCode == 200200) {
                            let text = res.data.data;
                            if(text.apQC){
                                this.QCinfo = text.apQC;
                            }else{
                                this.QCinfo = this.getContractNo(text.rID);
                            }
                            MessageBox.prompt("合同编号:", {
                                confirmButtonText: "是",
                                cancelButtonText: "否",
                                inputPattern: /^[^\u4e00-\u9fa5]{0,}$/,
                                inputErrorMessage: "只能输入数字,字母,字符",
                                inputValue: this.QCinfo
                            }).then(() => {
                                this.Ctrlloading = Loading.service(
                                    {
                                        text: "请耐心等待...",
                                        spinner: "el-icon-loading",
                                        background: "rgba(0, 0, 0, 0.7)"
                                    }
                                );
                                // 保存合同编号
                                this.saveContractNo(this.QCinfo);
                            }).catch(() => {
                                Message.info('已取消操作');
                            });
                        } else if(res.data.SysCode == 100302){
                            this.loginTimeout();
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
            }else{
                Message.warning('您没有权限发布该方案');
            }
        },
        // 保存合同编号
        saveContractNo(contractNo) {
            // uid         int【必填】     当前账户UserID
            // apid        int【必填】     方案apID
            // qc          String【必填】  方案合同编号
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apid: this.currentItem.apID,
            };
            info.qc = contractNo;
            api.postApi(this.Advertisement+"/SetAdPlan", info)
                .then(res => {
                    console.log(res);
                    if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else if(res.data.SysCode == 300200){
                        // 查看是否被锁
                        api.postApi(this.Advertisement+"/CheckLock", info).then(res =>{
                            console.log(res.data);
                            if(!res.data.SysCode){
                                if(!res.data.IsLock){
                                    this.releaseFun();
                                }else{
                                    Message.warning("该方案被预锁,请先解除预锁");
                                    this.Ctrlloading.close();
                                }
                            }
                        });
                    }else{
                        Message.warning(res.data.MSG);
                        this.Ctrlloading.close();
                    }
                })
                .catch(res => {
                    console.log(res);
                    this.Ctrlloading.close();
                });
        },
        releaseFun(){
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
        releaseFangan(info){
            api.postApi(this.Advertisement+'/SetFangan', info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 300200){
                    Message.success(res.data.MSG);
                    for (let data of this.currentPlan) {
                        if (data.apID == this.currentItem.apID) {
                            this.$set(data, "apState", 2);
                            break;
                        }
                    }
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else if(res.data.SysCode == 300500){
                    if(res.data.asList){
                        // 存在点位被占，是否立即去方案详情修改？
                        this.changeRoute();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }else{
                    Message.warning(res.data.MSG);
                }
                this.Ctrlloading.close();
            }).catch(res =>{
                this.Ctrlloading.close();
            });
        },
        // 跳转到详情页面
        ToDetail(row) {
            console.log(row.apID);
            sessionStorage.setItem("plan_apid", row.apID);
            sessionStorage.setItem('cityArea', JSON.stringify(row.cityArea));
            this.$router.push("./planDetail");
        },
        // 跳转到编辑页面
        ToEdit(row) {
            console.log(row);
            sessionStorage.setItem("plan_apid", row.apID);
            sessionStorage.setItem('cityArea', JSON.stringify(row.cityArea));
            this.$router.push("./editPlan");
        },
        // 比较两个时间大小
        compareTime(arr, sField, eField){
            return dateFormat.compareTime(arr, sField, eField);
        },
        //预锁
        preload(row) {
            console.log('row-----', row);
            this.currentItem = row;

            let startObj = this.compareTime(row.cityArea, 'pdStar', 'pdEnd');
            let date = timeFormat.toDate(new Date(), '/');
            if(startObj.startTime<=date){
                Message.warning('开始投放时间已经早于当前时间,请直接发布！');
                return;
            }
            this.cityList = this.getCityList(row.cityArea);
            if(this.cityList.length){
                this.cityChoose = [];
                this.isLock = true;
                this.dialogVisible = true;
            }else{
                Message.warning('方案权限城市内您没有可以预锁的城市');
            }
        },
        // 获取权限城市内的城市,进行勾选
        getCityList(arr){
            // 1)	全国媒介可发布全部销售的方案
            // 2)	地方媒介只能发布只选择了该所属公司点位的方案
            // 1)	全国媒介可预锁全部的方案
            // 2)	地方媒介只能预锁方案中投放至该公司的部分
            let sess = this.sessionData;
            let resultArr = [];
            if(sess.uType == 'MD' && (sess.mediaManageLevel == 1)){
                resultArr = arr;
            }else{
                for(let data of arr){
                    if(data.asrID == sess.asrID){
                        resultArr.push(data);
                    }
                }
            }
            let asrIDs = [];
            let resultInfo = [];
            for(let com of resultArr){
                if(!asrIDs.join(',').includes(com.asrID)){
                    asrIDs.push(com.asrID);
                    resultInfo.push(com);
                }
            }
            return resultInfo;
        },
        // 解除预锁
        clearLock(row) {
            this.cityChoose = [];
            this.isLock = false;
            this.dialogVisible = true;
            this.currentItem = row;
            this.cityList = this.getCityList(row.cityArea);
        },
        cancelLock() {
            this.dialogVisible = false;
            Message.info("已取消操作");
        },
        // 确定预锁
        confirmLock() {
            console.log(this.cityChoose);
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
        },
        // 预锁
        LockCity(arr, act){
            console.log('lockcity----',arr);
            let asrIDs = [];
            for(let data of arr){
                asrIDs.push(data.asrID);
            }
            let apid = arr[0].apID;
            let info ={
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                act: act,
                apid: apid,
                asrIDs: asrIDs.join(',')
            };
            console.log(info);
            api.postApi(this.Advertisement+'/SetFangan', info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 300200){
                    for (let plandata of this.currentPlan) {
                        if (plandata.apID == this.currentItem.apID) {
                            for(let item of plandata.cityArea){
                                if(info.asrIDs.includes(item.asrID)){
                                    for(let ridItem of arr){
                                        if(ridItem.asrID == item.asrID){
                                            let RemainDay = this.countDay(ridItem.pdStar);
                                            item.RemainDay = RemainDay;
                                            this.$set(item, 'RemainDay', RemainDay);
                                            break;
                                        }
                                    }
                                }
                            }
                            break;
                        }
                    }
                    this.currentPlan.push();
                    Message.success(res.data.MSG);

                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else if(res.data.SysCode == 300500){
                    if(res.data.asList){
                        // 存在点位被占，是否立即去方案详情修改？
                        this.changeRoute();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }else{
                    Message.warning(res.data.MSG);
                }
                this.Ctrlloading.close();
            }).catch(err =>{
                console.log(err);
                this.Ctrlloading.close();
            });
        },
        // 解锁
        noLockCity(arr){
            let asrIDs = [];
            for(let data of arr){
                asrIDs.push(data.asrID);
            }
            let apid = arr[0].apID;
            let info ={
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apId: apid,
                asrIDs: asrIDs
            };
            console.log(info);
            api.postApi(this.Advertisement+'/ClFangan', info).then(res =>{
                console.log(res.data);
                this.Ctrlloading.close();
                if(res.data.SysCode == 300200){
                    for (let plandata of this.currentPlan) {
                        if (plandata.apID == this.currentItem.apID) {
                            for(let item of plandata.cityArea){
                                if(info.asrIDs.includes(item.asrID)){
                                    delete item.RemainDay;
                                }
                            }
                            break;
                        }
                    }
                    this.currentPlan.push();
                }
                Message.success(res.data.MSG);
            }).catch(err =>{
                console.log(err);
                this.Ctrlloading.close();
            });
        },
        // 7天以上显示7天,否则显示相隔天数
        countDay(time){
            let dayA = Math.abs(timeFormat.getDayBetween(time, new Date()));
            console.log('dayA-----', dayA);
            let RemainDay = dayA>7?7:dayA;
            return RemainDay;
        },
        // 弹出框修改路径
        changeRoute(){
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
        search(){
            let { keyword, rangeDate, status, company, cityWord, Lock } = this.searchInfo;
            this.isSearch = false;
            let timer = setTimeout(()=>{
                this.isSearch = true;
                clearTimeout(timer);
            }, 1000);
            if(
                keyword || rangeDate || (status===0 || status>0) || company || cityWord || Lock
            ){
                this.currentPlan = [];
                this.loading = true;
                this.loading_point = false;
                this.currPage  = 1;
                this.searchFun();

            }else{
                Message.warning('请输入搜索条件');
            }
        },
        searchFun(){
            let info = this.searchFormat();
            this.getData(info);
        },
        // 搜索数据格式化
        searchFormat(){
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                start: this.currPage,
                pagesize: this.pageSize
            };
            let { select, keyword, rangeDate, status, company, cityWord, Lock } = this.searchInfo;
            if(keyword){
                info.keywordType = select;
                info.keyword = keyword;
            }
            if(rangeDate){
                info.starttime = rangeDate[0];
                info.andtime = rangeDate[1];
            }
            if((status!=='') && status>=0){
                info.apstate = status;
            }
            if(company){
                info.asrID = company;
            }
            if(cityWord){
                info.rname = cityWord;
            }
            if(Lock){
                info.onyusuo = Lock;
            }
            return info;
        },
        // 设置表格数据
        setTableData(item){
            let obj = {
                adcID: item.adcID,
                apID: item.apID,
                apName: item.apName ? item.apName : '',
                apState: item.apState ? item.apState : '',
                apTotal: item.apTotal ? item.apTotal : '',
                apcTime: item.apcTime ? item.apcTime : '',
                bTitle: item.bTitle ? item.bTitle : '',
                cName: item.cName ? item.cName : '',
                realName: item.realName ? item.realName : '',
                cityArea: [],
            };
            item.details.sort((a, b)=>{
                return a.asrID - b.asrID;
            });
            let asrIDarr = [];
            for(let data of item.details){
                if(asrIDarr.includes(data.asrID)){
                    data.isshow = 0;
                }else{
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
        reset(){
            this.searchInfo = {
                select: "1",
                keyword: "",
                rangeDate: "",
                status: '',
                company: '',
                cityWord: '',
                Lock: '',
            };

            this.currPage = 1;
            this.currentPlan = [];
            this.isReset = false;
            let timer = setTimeout(()=>{
                this.isReset = true;
                clearTimeout(timer);
            }, 1000);
            this.searchFun();
        },
        // 是否预锁搜索
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
        // 放弃继续编辑
        cancelEdit(){

            this.$confirm('放弃后将清除该方案信息及点位!', '提示', {
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
                api.postApi(this.Advertisement + '/clearAdPlanBackups',params).then(res=>{
                    console.log('清空缓存的方案',res)
                    if (res.data.SysCode == 200200) {
                        console.log('缓存方案清除成功')
                    } else {

                    }
                })
                cacheAdPlan.removeData(this.sessionData.uID)
                this.$router.push("./createPlan");
            }).catch(() => {
                Message.info('取消成功')
            })
        },
        // 继续创建
        continueEdit(){
            this.continueEditLoading = this.$loading({
                lock: true,
                text: '方案数据获取中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.5)'
            });
            this.$router.push("./createPlan?unfinishedPlan");
            this.unfinishedDialogVisible = false
        },
    },
    beforeDestroy() {
        if(this.continueEditLoading){
            this.continueEditLoading.close()
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
    height: 34px !important;
    border-radius: 4px;
}

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

    /*wrap*/
    .mediaList_wrap {
        width: 92%;
        background: #ffffff;
        border: 1px solid #e6e7e9;
        margin: 0 auto;
    }

    .mediaList_wrap .mediaList_head {
        width: 100%;
        height: 24px;
        padding: 12px 0;
        border-bottom: 1px solid #e6e7e9;
    }

    .mediaList_wrap .mediaList_head h2 {
        font-size: 16px;
        color: #2c313c;
        height: 24px;

        padding-left: 14px;
        font-weight: bold;
    }

    .mediaList_wrap .mediaList_container {
        width: 96%;
        margin: 24px auto;
    }

.el-input {
    width: 180px;
    height: 34px !important;
    border-radius: 4px;
}

/deep/ .el-button {
    width: 76px;
    height: 34px;
    text-align: center;
    padding: 0;
    position: relative;
    left: 0;
    margin-left: 2px;
}
/deep/ .el-button [class*=el-icon-]+span, .select-wrap button .el-icon-search{
  position: relative;
  left: -2px;
  top: 0px;
}


/deep/ .el-button + .el-button {
    margin-left: 0;
}

.mediaList_wrap .mediaList_container .table_wrap {
    margin: 24px auto;
    border-radius: 4px;
}

.input-with-select /deep/ .el-input__inner {
    font-size: 14px;
    height: 34px;
    vertical-align: middle;
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

/deep/ .el-date-editor .el-range__icon {
    position: relative;
    top: -3px;
    margin-right: 2px;
}

/deep/ .el-range-separator {
    position: relative;
    top: -2px;
}

/deep/ .el-input__inner {
    width: 140px;
    height: 34px;
    line-height: 34px;
}
/deep/ .el-date-editor{
    width: 245px;
}
/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
    float: left;
    position: relative;
}

/deep/ .el-range-editor .el-range-input {
    line-height: 20px;
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

/deep/ .el-table td .cell {
    display: flex;
    flex-direction: column;
}

/deep/ .el-table--border {
    border-radius: 4px;
}

/deep/ .el-table th > .cell {
    font-size: 14px;
    color: #666666;
    font-weight: bold;
}

/deep/ .el-table .caret-wrapper {
    width: 22px;
}

/deep/ thead th:nth-child(4) .cell {
    text-align: right !important;
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ecf5ff;
}

/deep/ .el-table__column-filter-trigger {
    display: inline-block;
    line-height: 15px;
    cursor: pointer;
    overflow-y: hidden;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    height: 405px;
    overflow-y: scroll;
    overflow-x: hidden;
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

/deep/ .el-table-filter__list-item {
    color: rgb(102, 102, 102);
}

/*超出省略*/
/deep/ .el-table .cell {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/deep/ .el-table .cell span {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/deep/ .el-table .cell a {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/deep/ .el-table__row td:nth-child(4) {
    text-align: right;
}

/deep/ .el-table__row td:nth-child(4) .cell span {
    width: 90px;
}

/deep/ .el-table__row td:nth-child(7) .cell span {
    width: 85px;
}

/deep/ .el-table__row td:nth-child(3) .cell span {
    width: 62px;
}

/deep/ .el-table__row td:nth-child(2) .cell span {
    width: 148px;
}

/deep/ .el-table__row td:nth-child(1) .cell a {
    width: 180px;
}

/*筛选*/
/deep/ .el-table__column-filter-trigger {
    margin-left: 10px;
}

/deep/ .el-table th > .cell.highlight {
    color: #409eff !important;
}

/deep/ div.el-table-filter {
    left: 1106px !important;
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
/deep/ .el-button--mini,
.el-button--small {
    font-size: 14px !important;
}

/deep/ .el-button .el-button--primary .el-button--mini {
    width: 51px;
}

/deep/ .el-dropdown-menu--mini .el-dropdown-menu__item {
    width: 65px;
}

/deep/ button.el-button.el-button--default.el-button--small:hover {
    color: #666;
    border-color: #d8d8d8;
    background-color: #fff;
}

.tar {
    text-align: right !important;
    padding-right: 10px;
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

/deep/ .popper__arrow {
    display: none;
}

/*按钮*/
/deep/ .el-button--default:focus,
.el-button--default:hover {
    color: #606266;
    border-color: #dcdfe6;
    background-color: #fcfcfc;
}

.content_bottom_btn /deep/ .el-button span {
    position: relative;
    top: -2px;
}

.content_bottom_btn /deep/ .el-button span a {
    color: #606266;
}

.mediaList_container span {
    float: left !important;
    margin-left: 2px;
}
.table_wrap .city_p span{
    float: none !important;
}
/deep/ .el-date-editor--daterange.el-input__inner{
    width: 240px;
}

.el-dialog__footer span {
    float: none !important;
}
    /*未完成方案*/
    /deep/ .unfinished_plan_dialog .el-dialog__header{
        padding: 20px 20px;
        border-bottom: 1px solid #E8E8E8;
    }
    /deep/ .unfinished_plan_dialog .el-dialog__title{
        font-size: 15px;
    }
    /deep/ .unfinished_plan_dialog .el-dialog__body{
        padding: 10px 20px;
    }
    /deep/ .unfinished_plan_dialog .el-dialog__title{
        font-weight: bold;
    }
    .unfinished_plan_li{
        line-height: 28px;
    }
</style>

