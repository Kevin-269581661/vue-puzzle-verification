<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p>
                <a href="#" style="color: #999">订单管理</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>订单列表</h2>
            </div>
            <div class="mediaList_container">
                <el-row>
                    <div class="mediaList_handel">
                        <span>
                            <div style="display:inline-block">
                                <el-input placeholder="请输入内容" v-model="searchInfo.keyword" class="input-with-select">
                                    <el-select v-model="searchInfo.select" slot="prepend" placeholder="请选择">
                                        <el-option label="订单名" value="1"></el-option>
                                        <el-option label="客户名" value="2"></el-option>
                                        <el-option label="合同编号" value="3"></el-option>
                                    </el-select>
                                </el-input>
                            </div>
                        </span>
                        <span>
                            <div class="block">
                                <el-date-picker v-model="searchInfo.rangeDate" type="daterange" range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="投放日期" end-placeholder="投放日期">
                                </el-date-picker>
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
                            <div class="block block_box">
                                <el-select v-model="searchInfo.cityWord" placeholder="请选择城市" filterable>
                                    <el-option v-for="item of filterCityData" :key="item.rID" :label="item.text" :value="item.value"></el-option>
                                </el-select>
                            </div>
                        </span>
                        <span>
                            <div class="block block_box">
                                <el-select v-model="searchInfo.status" placeholder="请选择状态">
                                    <el-option v-for="item of stateList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                                </el-select>
                            </div>
                        </span>
                        <span>
                            <el-button type="primary" icon="el-icon-search" @click="search()" :disabled="!isSearch">搜索</el-button>
                        </span>
                        <span>
                            <el-button @click="reset()" :disabled="!isReset">重置</el-button>
                        </span>
                    </div>
                </el-row>
                <div class="table_wrap">
                    <el-table border :data="currentOrder" style="width: 100%" v-loadmore="orderLoadMore" v-loading="loading" element-loading-text="玩命加载中" element-loading-spinner="el-icon-loading" :default-sort="{prop: 'apcTime', order: 'descending'}">
                        <el-table-column label="订单名称" min-width="14.6%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <a href="javascript:void(0);" @click="ToDetail(scope.row)">{{scope.row.apName}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cName" label="客户名称" min-width="10.4%"  show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="bTitle" label="品牌名称" min-width="6.0%" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="apQC" label="合同编号" width="180px">
                        </el-table-column>
                        <el-table-column sortable :sort-method="sortPrice" label="订单总价" width="120px" align="right">
                            <template slot-scope="scope">
                                <span>&yen;{{(scope.row.apTotal)?priceFormat(scope.row.apTotal/100):0}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="投放城市(点位面数，排期)" prop="cityArea" min-width="20.2%">
                            <template slot-scope="scope">
                                <p v-if="isAll" v-for="(item, index) of scope.row.companyList" :key="index" class="city_p">
                                    {{item.asName}} <br>
                                    <span v-for="city of item.cityList" :key="city.city">
                                        {{city.city+'('+city.num+'面,'+formatTime(city.pdStart)+'至'+formatTime(city.pdEnd)+')'}}
                                    </span>
                                </p>
                                <p v-if="!isAll" v-for="item of scope.row.companyList" :key="item.rid" class="city_p">
                                    <span v-for="city of item.cityList" :key="city.city">
                                        {{city.city+'('+city.num+'面,'+formatTime(city.pdStart)+'至'+formatTime(city.pdEnd)+')'}}
                                    </span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column label="发布日期" min-width="7.3%" sortable :sort-by="sortData">
                            <template slot-scope="scope">
                                <span>{{formatTime(scope.row.apcTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="Status" prop="apState" label="状态" min-width="6%" >
                            <template slot-scope="scope">
                                <span>{{ stateToText(scope.row.apState) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100px" v-if="!(role=='OP' || role=='AD')">
                            <template slot-scope="scope">
                                <el-dropdown size="small" split-button trigger="click" placement="bottom-start">操作
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :disabled="(scope.row.apState==0)||(scope.row.apState==5)||(role!='SM') " @click.native.prevent="finishOrder(scope.row)" class="finish">结束订单</el-dropdown-item>
                                        <el-dropdown-item :disabled="(role!='SM')" @click.native.prevent="applyPhoto(scope.row)" class="finish">申请画像</el-dropdown-item>
                                        <el-dropdown-item :disabled="(scope.row.apState==0)||(scope.row.apState==5)||(role!='MD')" @click.native.prevent="changePoint(scope.row.apID)" class="update">更换点位
                                        </el-dropdown-item>
                                        <!-- <el-dropdown-item @click.native.prevent="inputBox1" class="watch">监控备注</el-dropdown-item> -->
                                        <!--<el-dropdown-item disabled="disabled" class="push">推送任务</el-dropdown-item>-->
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>

                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>
                </div>
            </div>
        </div>

        <!-- 画像申请的弹出框开始 -->
		<el-dialog :visible.sync="showPhoto" title="协助客户开通受众画像" center>
			<applyphoto @cancel="cancelApply" @apply="confirmApply" :data="houselist"></applyphoto>
		</el-dialog>
		<!-- 画像申请的弹出框结束 -->
    </div>
</template>

<script>
import { api } from "../../api/api";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";

// 画像申请
import applyphoto from './components/applyPhoto.vue';
import noSearchResult from "./components/noSearchResult.vue";

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
    Option
} from "element-ui";

export default {
    name: "projectList",
    components: {
        applyphoto,
        noSearchResult,
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
        elOption: Option,
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
                // 公司搜索
                company: '',
                // 城市筛选 
                cityWord: '',
                // 状态筛选
                status: '',
            },
            // 公司列表
            companyData: [],
            // 登录信息
            sessionData:{},
            // 每页大小
            pageSize: 15,
            // 当前页
            currPage: 1,
            // 总得页数
            totalPage: 0,

            // 权限城市过滤数组
            filterCityData: [],
            // 角色
            role: "",
            isAll: false,
            //加载中
            loading: true,
            stateList: [
                {text: '已完成', value: 0},
                {text: '未投放', value: 2},
                {text: '投放中', value: 3},
                {text: '强制结束', value: 5}
            ],
            //所有数据
            orderList: [],
            // 表格数据
            currentOrder: [],
            // 滚动加载的下标
            orderListIndex: 0,
            // 是否滚动加载
            loading_point: true,
            isSearch: true,
            isReset: true,
            // 开通画像需要使用的数据
            showPhoto: false,
            houselist:[],
            // 保留点击申请画像当前行
            orderRow: {},
        };
    },
    mounted() {
        // 获取角色
        this.getRole();
        this.getFanCity();
        if(this.isAll){
            this.getCompany();
        }
        // 获得初始数据
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
                api.getApi(this.apiVar.UCAPI + '/GetDirectAscr', info).then(res =>{
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
            }
        },
        // 订单列表--滚动监听
        orderLoadMore(){
            if(this.loading_point){
                this.loading_point = false;
                if(this.currPage <= this.totalPage){
                    this.searchFun();
                }
            }
        },
        // 获取城市
        getFanCity(){
            let info ={
                uid: this.sessionData.uID,
                token: this.sessionData.token
            };
            api.getApi(this.apiVar.Advertisement+'/GetAPDCityNames', info).then(res =>{
                console.log(res.data);
                let arr = res.data;
                let result = [];
                if(!arr.SysCode){
                    for(let data of arr){
                        result.push({
                            rName: data.rName,
                            rID: data.rID,
                            text: data.rName,
                            value: data.rID
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
        // 获取角色
        getRole() {
            this.sessionData= JSON.parse(sessionStorage.getItem("session_data"));
            this.role = this.sessionData.uType;
            let sess = this.sessionData;
            if(sess.ascType==0 || (sess.uType=='MD' && sess.mediaManageLevel==1) || (sess.uType =='BD') && sess.saleManageLevel == 1){
                this.isAll = true;
            }else{
                this.isAll = false;
            }
        },
        // 搜索数据格式化
        searchFormat(){
            let session = this.sessionData;
            let info = {
                uid: session.uID,
                token: session.token,
                pageNum: this.currPage,
                pageSize: this.pageSize
            };
            let { select, keyword, rangeDate, company, cityWord, status } = this.searchInfo;
            info = {
                ...info,
                ...(keyword && (select == '1' && {orderName: keyword}) || (select == '2' && {customerName: keyword}) || (select == '3' && {contractNum: keyword})),
                ...(rangeDate && {beginTime: rangeDate[0], endTime: rangeDate[1]}),
                ...(status!=='' && status>=0 && {state: status}),
                ...(company && {asrID: company}),
                ...(cityWord && {rID: cityWord})
            };
            return info;
        },
        // 滚动加载获取数据(无搜索数据)
        getData(params){
            api.postApi(this.apiVar.Advertisement+'/GetOrderList', params).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    if(!res.data.SysCode){
                        let dataInfo = res.data;
                        this.totalPage = dataInfo.totalPage;
                        let dataArr = dataInfo.orderList;
                        this.currentOrder = this.currentOrder.concat(this.funcData(dataArr));
                        this.loading_point = true;
                        this.currPage++;
                        this.loading = false;
                        if(dataInfo.totalPage == 0){
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
                let tmpObj = '';
                tmpObj = this.setTableData(data);
                result.push(tmpObj);
            }
            return result;
        },
        // 搜索(优化)
        search(){
            let { keyword, rangeDate, company, cityWord, status } = this.searchInfo;            
            this.isSearch = false;
            let timer = setTimeout(()=>{
                this.isSearch = true;
                clearTimeout(timer);
            }, 1000);
            if(keyword || rangeDate || company || cityWord || (status>0 || status===0) ){
                this.currentOrder = [];
                this.loading = true;
                this.loading_point = false;
                this.currPage = 1;
                this.searchFun();
            }else{
                this.$message.warning('请输入搜索条件');
            }
        },
        searchFun(){
            let info = this.searchFormat();
            this.getData(info);
        },
        // 设置表格数据
        setTableData(item){
            let obj = {
                adcID: item.adcID,
                apID: item.apID,
                apName: item.apName ? item.apName : '',
                apQC: item.apQC ? item.apQC : '',
                apState: item.apState ? item.apState : '',
                apTotal: item.apTotal ? item.apTotal : '',
                apcTime: item.apcTime ? item.apcTime : '',
                bTitle: item.bTitle ? item.bTitle : '--',
                cName: item.cName ? item.cName : '',
                realName: item.realName ? item.realName : '',
                companyList: [],
            };
            for(let data of item.companyList){
                let objItem = {
                    asName: data.asName,
                    asrID: data.asrID,
                    cityList: [],
                };
                for(let con of data.cityList){
                    let cityObj = {
                        city: con.city,
                        rID: con.rID,
                        num: con.num,
                        pdEnd: con.pdEnd,
                        pdID: con.pdID,
                        pdStart: con.pdStart
                    };
                    objItem.cityList.push(cityObj);
                }
                obj.companyList.push(objItem);
            }
            return obj;
        },
        // 跳转到详情页面
        ToDetail(row) {
            console.log(row);
            console.log(this.role);
            if(this.role == 'AD' ){
                sessionStorage.setItem("ADorder_apid", row.apID);
                this.$router.push("./ADorderDetail");
            }else{
                sessionStorage.setItem('change_point', 'no');
                sessionStorage.setItem('order_citylist', JSON.stringify(row.companyList));
                sessionStorage.setItem("order_apid", row.apID);
                this.$router.push("./orderDetail");
            }
        },
        // 更换点位
        changePoint(apid) {
            sessionStorage.setItem('change_point', 'yes');
            sessionStorage.setItem("order_apid", apid);
            this.$router.push("./orderDetail");
        },
        // 状态转换成文本
        stateToText(val) {
            let state = [
                { text: "已完成", value: 0 },
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
            return dateFormat.toDate(val, '/');
        },
        // 价格排序
        sortPrice(a, b) {
            return a.apTotal - b.apTotal;
        },
        //日期排序
        sortData(a, b) {
            return dateFormat.toDate(a.apcTime, '') - dateFormat.toDate(b.apcTime, '');
        },
        // 价格加上逗号
        priceFormat(price) {
            return commaFormat.init(price);
        },
        // 结束订单
        finishOrder(row) {
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apid: row.apID,
                act: "E"
            };
            MessageBox.confirm(
                "是否结束<b>" + row.apName + "</b>订单投放？",
                "提示",
                {
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    dangerouslyUseHTMLString: true,
                    type: "warning"
                }
            ).then(() => {
                api.postApi(this.apiVar.Advertisement+"/SetFangan", info)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.SysCode == 300200) {
                            Message.success(res.data.MSG);
                            this.$set(row, "apState", 5);
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
        // 重置
        reset(){
            this.searchInfo = {
                // 搜索的select框
                select: "1",
                // 关键字
                keyword: "",
                // 时间范围
                rangeDate: "",
                // 公司搜索
                company: '',
                // 城市筛选 
                cityWord: '',
                // 状态筛选
                status: '',
            };
            this.currPage = 1;
            this.currentOrder = [];
            this.isReset = false;
            let timer = setTimeout(()=>{
                this.isReset = true;
                clearTimeout(timer);
            }, 1000);
            this.searchFun();
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
        // 申请画像
        applyPhoto(row){
            console.log('row---------', row);
            // this.showPhoto = true;
            this.orderRow = row;
            this.getSetPoint();
        },
        // 获取选点排期
        getSetPoint() {
            // 真实数据
            let uid = this.sessionData.uID;
            let apid = this.orderRow.apID;
            let info = {
                uid: uid,
                token: this.sessionData.token,
                apid: apid
            };
            // uid         int【必填】     当前账户UserID
            // apid        int             公司对应方案apID
            api.getApi(this.apiVar.Advertisement+"/GetAdLaunch", info)
                .then(res => {
                    console.log(res.data);
                    if (!res.data.SysCode) {
                        let result = res.data.adSpaceInfo;
                        for (let data of result) {
                            let time = this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
                            data.timeRange = time;
                            let finishTimeRange = "";
                            if (data.lState == 2) {
                                finishTimeRange = this.formatTime(data.lStar) + "-" + this.formatTime(data.lSetTime);
                            }
                            data.finishTimeRange = finishTimeRange;
                        }
                        console.log('initData-----------', result);
                        let resultArr = this.filterRes(result);
                        console.log('resultaRR---------', resultArr);
                        this.getIsOpenRes(resultArr);
                        // this.loading = false;
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    // this.loading = false;
                    console.log(res);
                });
        },
        // 过滤资源
        filterRes(arr){
            let result_ = [];
            let resIDS = '';
            for(let data of arr){
                if(!resIDS.includes(data.resID)){
                    console.log('data', data.resID);
                    resIDS += data.resID + ",";
                    console.log('resId', resIDS)
                    result_.push(data);
                    console.log('result----------------------------', result_)
                }else{
                    console.log('重复')
                }
            }
            console.log('RESULT---------', result_);
            return result_;
        },
        // 获取是否开通社区
        getIsOpenRes(arr){
            // SelectByApID
            // apId[必填]     关联订单ID
            // uid[必填]      用户ID
            // tooken[必填]   登陆凭证
            let info = {
                apid: this.orderRow.apID,
                uid: this.sessionData.uID,
                tooken: this.sessionData.token,
                apname: this.orderRow.apName
            };
            api.getApi(this.apiVar.QZhike+'/SelectByApID', info).then(res=>{
                console.log(res.data);
                if(res.data){
                    if (res.data.SysCode == 100302) {
                        this.loginTimeout();
                    }
                    let result = res.data;
                    // 过滤后已经申请的社区
                    for(let i = 0; i< arr.length; i++){
                        for(let j = 0; j< result.length; j++){
                            if(arr[i].resID == result[j].resID && (result[j].aiState ==1 || result[j].aiState == 0)){
                                arr.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    }
                    this.houselist = arr;
                    this.houselist.push();
                    if(this.houselist.length){
                        this.showPhoto = true;
                    } else{
                        Message.info('部分社区审核中');
                    }
                }else {
                    Message.warning(res.data.MSG);
                }
            });
        },
        cancelApply() {
            Message.info('取消画像申请');
            this.showPhoto = !this.showPhoto;
        },
        confirmApply(data) {
            console.log('data------', data);
            this.showPhoto = !this.showPhoto;
            for(let obj of data.resData){
                let info = {
                    uname: this.sessionData.realName,
                    apid: this.orderRow.apID,
                    resid: obj.resID,
                    uid: this.sessionData.uID,
                    tooken: this.sessionData.token,
                    gsday: obj.schedules[0],
                    geday: obj.schedules[1],
                    apname: this.orderRow.apName,
                    gid : this.orderRow.adcID,
                    ctlist: data.hoppyType.join(',')
                };
                this.downApi(info);
            }
        },
        // 超管申请画像
        downApi(info){
            // apid[必填]    关联订单ID
            // resid[必填]   社区唯一标识
            // uid[必填]     申请人ID
            // tooken[必填]  登陆凭证
            // gsday[必填]   申请开通的开始时间
            // geday[必填]   申请开通的结束时间
            // ctlist[必填]  消费偏好
            api.getApi(this.apiVar.QZhike+'/AdminSetApply', info).then(res => {
                console.log(res.data)
                if(res.data.SysCode == 700200){
                    Message.success(res.data.MSG);
                    for(let resData of this.houselist){
                        if(resData.resID == this.resid){
                            this.$set(resData, 'aiState', 0);
                            break;
                        }
                    }
                    this.houselist.push();
                } else if (res.data.SysCode == 100302) {
                    this.loginTimeout();
                } else {
                    Message.warning(res.data.MSG);
                }
            });
        },

        //提示框
        inputBox1() {
            Message.warning("该功能尚未完善");
            // MessageBox.prompt("请输入监控备注", "提示", {
            //     confirmButtonText: "确定",
            //     cancelButtonText: "取消",
            //     inputType: "textarea",
            //     inputPattern: /^.{1,100}$/,
            //     inputErrorMessage: "监控备注超过100字,请缩减"
            // })
            //     .then(() => {
            //         Message.success("监控备注输入成功");
            //     })
            //     .catch(() => {
            //         Message.info("取消输入");
            //     });
        }
        //状态
    }
};

$(function() {
    /*window.onresize = function () {
		if ($(window.width >= 1366)) {
			$('.el-table-filter').css({
			left: '1145'
			})
		}
		};*/
    var Status = $(".el-table__row")
        .find("td")
        .text();
    if (Status === "已完成") {
        $(".watch").attr("disabled", "disabled");
    }
});
</script>

<style scoped>
a {
    color: #108ee9;
}

/deep/ .el-textarea__inner {
    height: 134px !important;
    resize: none;
}

/*筛选*/
.el-checkbox + .el-checkbox {
    margin-left: 0;
}

/deep/ .el-checkbox__label {
    font-size: 10px;
    color: #8a8a8a;
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
    /* width: 260px; */
    width: 140px;
    height: 34px;
    line-height: 34px;
}
/deep/ .block_box .el-input__inner{
    width: 150px;
}
/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
    float: left;
    position: relative;
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

.el-button {
    width: 76px;
    height: 34px;
    text-align: center;
    padding: 0;
    margin-left: 2px;
}

/deep/ .el-button [class*=el-icon-]+span, .select-wrap button .el-icon-search{
  position: relative;
  left: -2px;
  top: 0px;
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

/*日期控件*/
.block {
    display: inline-block;
    margin-left: 2px;
}

/deep/ .el-date-editor--daterange.el-input__inner {
    width: 240px;
    height: 34px;
}

/deep/ .el-range-input {
    font-size: 14px;
    padding: 10px 10px;
    height: 32px;
    line-height: 14px;
    box-sizing: border-box;
}

/deep/ .el-date-editor .el-range__icon {
    position: relative;
    top: -3px;
    left: 0;
    margin-right: 2px;
}

/deep/ .el-date-editor .el-range__close-icon {
    position: relative;
    top: -2px;
    left: 3px;
}

/deep/ .el-picker-panel .el-date-range-picker .el-popper {
    left: 335px !important;
}

/deep/ .el-range-editor .el-range-input {
    line-height: 20px;
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
    height: 34px !important;
    border-radius: 4px;
}

/deep/ .el-input__inner {
    height: 34px;
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

/*表格*/
/deep/ .el-date-editor .el-range-separator {
    line-height: 26px;
}

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
/deep/ .el-table td a{
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

/deep/ .el-table .caret-wrapper {
    width: 22px;
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ecf5ff;
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

/*超出省略*/
/deep/ .el-table__row .cell {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 24px;
    display: flex;
    flex-direction: column;
}

/deep/ .el-table__row .cell span {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 24px;
}

/deep/ .el-table__row td:nth-child(7) .cell span {
    width: 87px;
}

/deep/ .el-table__row td:nth-child(3) .cell span {
    width: 70px;
}

/deep/ .el-table__row td:nth-child(2) .cell span {
    width: 130px;
}
/deep/ .el-table__row td:nth-child(1) .cell a {
    width: 195px;
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

/deep/ .el-table-filter__list-item {
    color: #666;
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

/deep/ .el-dropdown .el-button-group .el-button {
    height: 28px;
    width: 48px;
    font-size: 14px;
    padding: 0;
}

/deep/ .el-dropdown .el-button-group .el-button:last-child {
    width: 30px;
  position: relative;
  top: 0px;
}

/deep/ .el-button-group button {
    float: left !important;
}

/deep/ .popper__arrow {
    display: none;
}

.mediaList_handel span {
    float: left !important;
    margin-left: 4px;
}

</style>
