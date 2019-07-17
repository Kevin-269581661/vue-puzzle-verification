<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p>
                <a href="#" style="color: #999">电视广告</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>方案订单列表</h2>
            </div>
            <div class="mediaList_container">
                <el-row>
                    <div class="mediaList_handel">
                        <span>
                            <div style="display:inline-block">
                                <el-input placeholder="请输入内容" v-model="keyword" size="small" class="input-with-select" @change="initData">
                                    <el-select v-model="select" slot="prepend" placeholder="请选择">
                                        <el-option label="方案名称" value="1"></el-option>
                                        <el-option label="客户名" value="2"></el-option>
                                    </el-select>
                                </el-input>
                            </div>
                        </span>
                        <span>
                            <div class="block">
                                <el-date-picker size="small" v-model="rangeDate" type="daterange" range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="创建日期" end-placeholder="创建日期" @change="initData">
                                </el-date-picker>
                            </div>
                        </span>
                        <span>
                            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                            <el-button plain type="default" @click="newPlan()" v-if='(role == "BD" || role == "MD")'>新建</el-button>
                        </span>
                    </div>
                </el-row>
                <div class="table_wrap">
                    <el-table border :data="currentOrder" style="width: 100%" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading" :default-sort="{prop: 'apcTime', order: 'descending'}">
                        <el-table-column label="方案名称" min-width="14.6%">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.apName" placement="bottom" v-if="scope.row.apName.length>12">
                                    <a href="javascript:void(0);" @click="ToDetail(scope.row.apid)">{{scope.row.apName}}</a>
                                </el-tooltip>
                                <a href="javascript:void(0);" v-else @click="ToDetail(scope.row.apid)">{{scope.row.apName}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column label="客户名称" min-width="10.4%">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.cName" placement="bottom" v-if="scope.row.cName.length>9">
                                    <span title="">{{scope.row.cName}}</span>
                                </el-tooltip>
                                <span v-else title="">{{scope.row.cName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bTitle" label="品牌名称" min-width="6.0%">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.bTitle" placement="bottom" v-if="scope.row.bTitle.length>5">
                                    <span title="">{{scope.row.bTitle||'--'}}</span>
                                </el-tooltip>
                                <span v-else title="">{{scope.row.bTitle||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column sortable :sort-method="sortPrice" label="方案价格" min-width="7.5%" align="right">
                            <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="(scope.row.apTotal)?priceFormat(scope.row.apTotal):0" placement="bottom" v-if="scope.row.apTotal?scope.row.apTotal.toString().length>8:0">
                                    <span>&yen; {{(scope.row.apTotal)?priceFormat(scope.row.apTotal):0}}</span>
                                </el-tooltip>
                                <span v-else>&yen; {{(scope.row.apTotal)?priceFormat(scope.row.apTotal):0}}</span>

                            </template>
                        </el-table-column>
                        <el-table-column prop="realName" label="所有人" min-width="6.1%"  v-if="!(role=='AD')">
                        </el-table-column>
                        <el-table-column label="投放城市(排期)" min-width="20.2%">
                            <template slot-scope="scope">
                                <p v-for="(item, index) of scope.row.cityArea" :key="index">{{item}}({{scope.row.timeRange}})</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建日期" min-width="7.3%" sortable :sort-by="sortData">
                            <template slot-scope="scope">
                                <span>{{formatTime(scope.row.apcTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="Status" prop="apState" label="状态" min-width="6%" :filters="[
                                {text: '进行中', value: 0},
                                {text: '未投放', value: 1},
                                {text: '投放中', value: 2},
                                {text: '已完成', value: 3},
							]" :filter-method="filterStatus" :filter-multiple="false">
                            <template slot-scope="scope">
                                <span>{{stateToText(scope.row.apState)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="7.0%" v-if="!(role=='OP' || role=='AD')">
                            <template slot-scope="scope">
                                <el-dropdown size="small" split-button trigger="click" placement="bottom-start">操作
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native.prevent="finishOrder(scope.row)" class="finish" :disabled="scope.row.apState!=0 ">投放</el-dropdown-item>
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
    </div>
</template>

<script>
import { api } from "../../api/api";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
import sessFun from "../../commonFun/sessFun.js";
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
        elOption: Option
    },
    data() {
        return {
            sessionData: {},
            // 角色
            role: "",
            //加载中
            // loading: true,
            loading: false,
            rangeDate: "",
            keyword: "",
            select: "1",
            //表格
            orderList: [],
            currentOrder: [],
        };
    },
    methods:{

        // 获取角色
        getRole() {
            this.sessionData= sessFun.getSess();
            this.role = this.sessionData.uType;
        },
        // 获取默认数据
        getInitData(){
            // 真实数据
            let info = {

            };
            api.getApi(this.apiVar.QKuyun+'/GetPlanList', info).then(res =>{
                console.log(res.data);
                if(res.data.code == 500200){
                    let result = [];
                    let tmpArr = res.data.data;
                    for(let data of tmpArr){
                        let plan = data.plans;
                        let obj = {
                            apid: plan.plan_id?plan.plan_id:'',
                            apName: plan.plan_name?plan.plan_name:'--',
                            cName: plan.company?plan.company:'',
                            bTitle: plan.brand?plan.brand:'',
                            apTotal: plan.budget?plan.budget:'',
                            realName: plan.sales?plan.sales:'',
                            cityArea: data.cities?data.cities:'',
                            apcTime: plan.create_time?plan.create_time:'',
                            apState: plan.status?plan.status:'',
                            timeRange: plan.begin_date?(dateFormat.toDate(plan.begin_date, '/')+'-'+dateFormat.toDate(plan.end_date, '/')):'',
                        };
                        result.push(obj);
                    }
                    this.orderList = result;
                    this.currentOrder = this.orderList;
                }else{
                    this.$message.warning(res.data.msg);
                }
            });
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
            return a.apcTime < b.apcTime;
        },
        // 价格加上逗号
        priceFormat(price) {
            return commaFormat.init(price);
        },
        // 状态转换成文本
        stateToText(val) {
            let state = [
                { text: "进行中", value: 0 },
                { text: "未投放", value: 1 },
                { text: "投放中", value: 2 },
                { text: "已完成", value: 3 },
            ];
            for (let data of state) {
                if (val == data.value) {
                    return data.text;
                }
            }
        },
        // 投放
        finishOrder(row) {
            this.$message({
                type: 'warning',
                message: '如需投放电视广告请联系全国运营中心',
                duration: 1500,
            });
            return;
            let info = {
                plan_id: row.apid
            };
            MessageBox.confirm(
                "是否对<b>" + row.apName + "</b>方案进行投放？",
                "提示",
                {
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    dangerouslyUseHTMLString: true,
                    type: "warning"
                }
            )
                .then(() => {
                    let loading = this.$loading({
                        lock: true,
                        text: '正在执行...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });

                    api.getApi(this.apiVar.QKuyun+'/LaunchPlan', info).then(res =>{
                        console.log(res.data);
                        loading.close();
                        if(res.data.code == 500200){
                            Message.success(res.data.msg);
                            this.$set(row, 'apState', res.data.data);
                        }else if(res.data.code ==500100 ||  res.data.code ==500500){
                            Message.warning(res.data.msg);
                            MessageBox.confirm(
                                `是否跳转去修改方案？`,
                                "提示",
                                {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning"
                                }
                            )
                                .then(() => {
                                    sessionStorage.setItem("tvOrder_apid", row.apid);
                                    this.$router.push("./advertTV?edit=y");
                                })
                                .catch(() => {
                                    Message.info("已取消操作");
                                });

                        }else{
                            Message.warning(res.data.msg);
                        }
                    });
                })
                .catch(() => {
                    Message.info("已取消操作");
                });
        },
        //筛选
        filterStatus(value, row) {
            let sum = 0;
            for (let data of this.orderList) {
                if (data.apState != value) {
                    sum++;
                }
            }
            //sum和所有数据的长度相同时说明都不匹配
            if (sum == this.orderList.length) {
                Message.warning({
                    message: "筛选数据为空",
                    duration: 1500
                });
            }
            return row.apState == value;
        },
        // 跳转到详情页面
        ToDetail(apid) {
            console.log(apid);
            console.log(this.role);
            sessionStorage.setItem("tvOrder_apid", apid);
            this.$router.push("./tvOrderDetail");

        },
        // 当搜索框为空的时候进行重置显示
        initData() {
            if (!this.rangeDate && !this.keyword) {
                this.currentOrder = JSON.parse(JSON.stringify(this.orderList));
            }
        },
        // 搜索方案
        search() {
            let range = this.rangeDate;
            console.log(range);
            let arr = [];
            let select = this.select;
            let keyword = this.keyword.trim();
            if (range || this.keyword) {
                for (let data of this.orderList) {
                    if (range && keyword) {
                        if (
                            dateFormat.toDate(data.apcTime) >= range[0] &&
                            dateFormat.toDate(data.apcTime) <= range[1]
                        ) {
                            if (data.apName) {
                                if (
                                    select == "1" &&
                                    data.apName.includes(keyword)
                                ) {
                                    arr.push(data);
                                }
                            }
                            if (data.cName) {
                                if (
                                    select == "2" &&
                                    data.cName.includes(keyword)
                                ) {
                                    arr.push(data);
                                }
                            }
                        }
                    } else if (range) {
                        if (
                            dateFormat.toDate(data.apcTime) >= range[0] &&
                            dateFormat.toDate(data.apcTime) <= range[1]
                        ) {
                            arr.push(data);
                        }
                    } else if (keyword) {
                        if (data.apName) {
                            if (
                                select == "1" &&
                                data.apName.includes(keyword)
                            ) {
                                arr.push(data);
                            }
                        }
                        if (data.cName) {
                            if (select == "2" && data.cName.includes(keyword)) {
                                arr.push(data);
                            }
                        }
                    }
                }
                this.currentOrder = arr;
                if (!arr.length) {
                    Message.warning({
                        message: "查询数据为空",
                        duration: 1500
                    });
                }
                console.log("arr----------------", arr);
                return;
            }
            this.currentOrder = JSON.parse(JSON.stringify(this.orderList));
        },
        // 新建
        newPlan(){
            this.$router.push('./advertTV');
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
    },
    mounted() {
        // 获取角色
        this.getRole();
        // 获得初始数据
        this.getInitData();
    }
};
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
    width: 350px;
}

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
    float: left;
    position: relative;
}

.el-input {
    width: 180px;
    border-radius: 4px;
}

.input-with-select /deep/ .el-input__inner {
    font-size: 14px;
    vertical-align: middle;
}

/*日期控件*/
.block {
    display: inline-block;
    margin-left: 2px;
}

/deep/ .el-input__inner {
    width: 300px;
}

/deep/ .el-range-input {
    font-size: 14px;
    padding: 10px 10px;
    line-height: 14px;
    box-sizing: border-box;
}

/deep/ .el-picker-panel .el-date-range-picker .el-popper {
    left: 335px !important;
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

.content_bottom_btn /deep/ .el-button span a {
    color: #606266;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    height: 405px;
}
/deep/ .el-table__row td:nth-child(5) .cell span {
    width: 85px;
}

/deep/ .el-table__row td:nth-child(7) .cell span {
    width: 87px;
}

/deep/ .el-table__row td:nth-child(4) .cell span {
    width: 90px;
}

/deep/ .el-table__row td:nth-child(3) .cell span {
    width: 70px;
}

/deep/ .el-table__row td:nth-child(2) .cell span {
    width: 130px;
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

</style>
