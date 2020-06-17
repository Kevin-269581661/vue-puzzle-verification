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
                <div class="flex_box search_row">
                    <el-input placeholder="请输入内容" v-model="searchInfo.keyword" size="small" class="marginR">
                        <el-select v-model="searchInfo.select" slot="prepend" placeholder="请选择">
                            <el-option label="订单名称" value="1"></el-option>
                            <el-option label="客户名称" value="2"></el-option>
                            <el-option v-if="role !== 'EP'" label="合同编号" value="3"></el-option>
                        </el-select>
                    </el-input>
                    <div style="margin-left: -30px">
                        <el-select size="small" v-model="searchInfo.dateType" placeholder="请选择"
                                   class="date-type-select">
                            <el-option label="上刊日期" value="0"></el-option>
                            <el-option label="下刊日期" value="1"></el-option>
                            <el-option label="发布日期" value="3"></el-option>
                            <el-option label="换画日期" value="2"></el-option>
                        </el-select>
                        <el-date-picker size="small" class="marginR" v-model="searchInfo.rangeDate" type="daterange"
                                        range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        start-placeholder="选择日期" end-placeholder="选择日期">
                        </el-date-picker>
                    </div>

                    <el-select v-model="searchInfo.company" placeholder="请选择所属公司" filterable size="small"
                               class="marginR" v-if="isAll">
                        <el-option v-for="item of companyData" :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="searchInfo.cityWord" placeholder="请选择城市" filterable size="small"
                               class="marginR">
                        <el-option v-for="item of filterCityData" :key="item.rID" :label="item.text"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-select v-model="searchInfo.status" placeholder="请选择状态" size="small" class="marginR">
                        <el-option v-for="item of stateList" :key="item.value" :label="item.text"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="search()" :disabled="!isSearch"
                               class="marginR"
                               v-qadn-mta-h5="{id: 'a006_b000_c000_d000_bt105_ck01'}">搜索
                    </el-button>
                    <el-button plain @click="reset()" :disabled="!isReset" class="marginR"
                               v-qadn-mta-h5="{id: 'a006_b000_c000_d000_bt106_ck02'}">重置
                    </el-button>
                </div>
                <div class="table_wrap">
                    <el-table border :data="currentOrder" style="width: 100%" @sort-change="sortChange"
                              v-loading="loading"
                              element-loading-text="玩命加载中"
                              element-loading-spinner="el-icon-loading"
                              :default-sort="{prop: 'appTime', order: 'descending'}">
                        <el-table-column label="订单名称" min-width="12.6%">
                            <template slot-scope="scope">
                                <span class="u-bk-btn" v-if="scope.row.apSrc!=0">贝壳</span>
                                <span style="color: #108ee9;cursor: pointer" @click="ToDetail(scope.row)">{{scope.row.apName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cName" label="客户名称" min-width="12.6%" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="bTitle" label="品牌名称" min-width="8%" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="apQC" label="合同编号" v-if="role!=='EP'" width="180px">
                        </el-table-column>
                        <el-table-column prop="apTotal" sortable="custom" label="订单总价" width="120px" align="right" v-if="role !== 'EP'">
                            <template slot-scope="scope">
                                <span>&yen;{{(scope.row.apTotal)?priceFormat(scope.row.apTotal/100):0}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="投放城市(点位面数，排期)" prop="cityArea" min-width="25.8%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <div v-if="isAll" v-for="(item, index) of scope.row.companyList" :key="index"
                                     class="city_p">
                                    {{item.asName}}
                                    <p v-for="city of item.cityList" :key="city.city">
                                        {{city.city+'('+city.num+'面,'+formatTime(city.pdStart)+'至'+formatTime(city.pdEnd)+')'}}
                                    </p>
                                </div>
                                <div v-if="!isAll" v-for="item of scope.row.companyList" :key="item.rid+'-'+item.asrID"
                                     class="city_p">
                                    <p v-for="city of item.cityList" :key="city.city">
                                        {{city.city+'('+city.num+'面,'+formatTime(city.pdStart)+'至'+formatTime(city.pdEnd)+')'}}
                                    </p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="realName" label="所有人" min-width="6.1%"
                                         show-overflow-tooltip
                                         :filters="filterRealName"
                                         :filter-method="filterRealNameFun"
                                         :filter-multiple="true"
                                         v-if="role === 'BD' || role === 'EP'"
                        >
                        </el-table-column>
                        <el-table-column prop="skProgress" label="上刊进度" width="100px"
                                         show-overflow-tooltip
                                         v-if="role === 'EP'"
                        >
                        </el-table-column>
                        <el-table-column prop="xkProgress" label="下刊进度" width="100px"
                                         show-overflow-tooltip
                                         v-if="role === 'EP'"
                        >
                        </el-table-column>
                        <el-table-column prop="appTime" label="发布日期" width="120px" sortable="custom"
                                         show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{formatTime(scope.row.appTime)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class="Status" prop="apState" label="状态" min-width="6%" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <point-state :state-text="stateToText(scope.row.apState).text"
                                             :color="stateToText(scope.row.apState).color"></point-state>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="80px" v-if="role!=='OP' && role!=='AD' && role!=='BD' && role!=='EP'">
                            <template slot-scope="scope">
                                <el-dropdown size="small" trigger="click" placement="bottom-start">
                                    <span class="el-dropdown-link">
                                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <!--<el-dropdown-item-->
                                        <!--:disabled="(scope.row.apState==0)||(scope.row.apState==5)||(role!='SM') "-->
                                        <!--@click.native.prevent="finishOrder(scope.row)" class="finish"-->
                                        <!--v-qadn-mta-h5="{id: 'a006_b000_c000_d000_bt108_ck04'}">结束订单-->
                                        <!--</el-dropdown-item>-->
                                        <el-dropdown-item
                                            v-if="!((scope.row.apState==0)||(scope.row.apState==5)||(role!='SM')) "
                                            @click.native.prevent="finishOrder(scope.row)" class="finish"
                                            v-qadn-mta-h5="{id: 'a006_b000_c000_d000_bt108_ck04'}">结束订单
                                        </el-dropdown-item>
                                        <!-- <el-dropdown-item :disabled="(role!='SM')" @click.native.prevent="applyPhoto(scope.row)" class="finish">申请画像</el-dropdown-item> -->
                                        <el-dropdown-item
                                            :disabled="(scope.row.apState==0)||(scope.row.apState==5)||(role!='MD')"
                                            @click.native.prevent="changePoint(scope.row)" class="update"
                                            v-qadn-mta-h5="{id: 'a006_b000_c000_d000_bt107_ck03'}">更换点位
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

        <!-- 画像申请的弹出框开始 -->
        <el-dialog :visible.sync="showPhoto" title="协助客户开通受众画像" center>
            <applyphoto @cancel="cancelApply" @apply="confirmApply" :data="houselist"></applyphoto>
        </el-dialog>
        <!-- 画像申请的弹出框结束 -->
        <!--修改金额弹框-->
        <el-dialog
            title="修改订单金额"
            width="768px"
            top="20vh"
            custom-class="price-dialog-list"
            :visible.sync="changePriceModal"
            :before-close="cancelChangePrice">
            <changeOrderPrice @cancel="cancelChangePrice" @done="doneChangePrice" :changePriceData="changePriceData"></changeOrderPrice>
        </el-dialog>

    </div>
</template>

<script>
    import {MessageBox, Message} from 'element-ui';
    import {api} from "../../api/api";
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    // 价格格式化
    import commaFormat from "../../commonFun/commaFormat.js";
    import sessFun from "../../commonFun/sessFun.js";
    // 画像申请
    import applyphoto from './components/applyPhoto.vue';
    import noSearchResult from "./components/noSearchResult.vue";
    import pointState from './components/pointState.vue';
    import changeOrderPrice from './components/changeOrderPrice.vue';
    // 筛选过滤
    import filterFormat from "../../commonFun/filterTableData.js";
    export default {
        name: "orderList",
        components: {
            applyphoto,
            noSearchResult,
            pointState,
            changeOrderPrice
        },
        data() {
            return {
                //过滤所有人
                filterRealName: [],
                // 搜索数据
                searchInfo: {
                    // 搜索的select框
                    select: "1",
                    // 关键字
                    keyword: "",
                    // 时间范围
                    rangeDate: "",
                    //日期类型
                    dateType: '1',
                    // 公司搜索
                    company: '',
                    // 城市筛选
                    cityWord: '',
                    // 状态筛选
                    status: '',
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
                // 登录信息
                sessionData: {},
                // 权限城市过滤数组
                filterCityData: [],
                // 角色
                role: "BD",
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
                isSearch: true,
                isReset: true,
                // 开通画像需要使用的数据
                showPhoto: false,
                houselist: [],
                // 保留点击申请画像当前行
                orderRow: {},
                //修改订单金额数据
                changePriceModal: false,
                changePriceData: {
                    AdDoorAdPrice: 0,
                    AdDoorMakePrice: 0,
                    BreakAdPrice: 0,
                    BreakMakePrice: 0,
                    orderOldPrice: 0,
                    orderCompanyList: [],
                    priceCurrCompany: 0,
                },
                priceData: '',
                currApid:'',
                handleTime:'',

            };
        },
        created(){
            // 获取角色
            this.getRole();
        },
        mounted() {
            this.getFanCity();
            if (this.isAll) {
                this.getCompany();
            }
            if(this.sessionData.uType =='BD'){
                this.getSubSaleList()
            }
            // 获得初始数据
            this.searchFun();
        },
        methods: {
            //获取下级销售列表
            getSubSaleList() {
                api.getApi(this.apiVar.Advertisement + '/GetSubSaleList').then(res => {
                    console.log(res.data);
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
            // 切换页码
            changePage(page) {
                this.currPage = page;
                console.log('page----', page);
                this.searchFun();
            },
            // 每页条数切换
            sizeChange(val) {
                this.currPage = 1;
                this.pageSize = val;
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
                        } else {
                            Message.warning(res.data.MSG);
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
                            Message.warning(res.data.MSG);
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }
            },
            // 获取城市
            getFanCity() {
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token
                };
                api.getApi(this.apiVar.Advertisement + '/GetAPDCityNames', info).then(res => {
                    console.log(res.data);
                    let arr = res.data;
                    let result = [];
                    if (!arr.SysCode) {
                        for (let data of arr) {
                            result.push({
                                rName: data.rName,
                                rID: data.rID,
                                text: data.rName,
                                value: data.rID
                            });
                        }

                        this.filterCityData = result;
                    } else {
                        Message.warning(res.data.MSG);
                    }
                });
            },
            // 获取角色
            getRole() {
                this.sessionData = sessFun.getSess();
                this.role = this.sessionData.uType;
                let sess = this.sessionData;
                if (sess.ascType == 0 || (sess.uType == 'MD' && sess.mediaManageLevel == 1) || (sess.uType == 'BD') && sess.saleManageLevel == 1) {
                    this.isAll = true;
                } else {
                    this.isAll = false;
                }
            },
            // 搜索数据格式化
            searchFormat() {
                let session = this.sessionData;
                let info = {
                    uid: session.uID,
                    token: session.token,
                    pageNum: this.currPage,
                    pageSize: this.pageSize
                };
                let {select, keyword, rangeDate, company, cityWord, status, orderby, desc, dateType} = this.searchInfo;
                info = {
                    ...info,
                    ...(keyword && (select == '1' && {orderName: keyword}) || (select == '2' && {customerName: keyword}) || (select == '3' && {contractNum: keyword})),
                    ...(rangeDate && {beginTime: rangeDate[0], endTime: rangeDate[1]}),
                    ...(status !== '' && status >= 0 && {state: status}),
                    ...(company && {asrID: company}),
                    ...(cityWord && {rID: cityWord}),
                    ...(orderby && {orderby}),
                    ...(desc !== '' && desc >= 0 && {desc}),
                    ...(rangeDate && {timeType: dateType})
                };
                return info;
            },
            // 滚动加载获取数据(无搜索数据)
            getData(params) {
                api.postApi(this.apiVar.Advertisement + '/GetOrderList', params).then(res => {
                    console.log(res.data);
                    if (!res.data.SysCode) {
                        let dataInfo = res.data;
                        this.totalNum = dataInfo.totalCount;
                        let dataArr = dataInfo.orderList;
                        this.currentOrder = this.funcData(dataArr);
                        this.loading = false;
                        if (dataInfo.totalPage == 0) {
                            Message.warning('暂无数据');
                        }
                    } else {
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
                let {keyword, rangeDate, company, cityWord, status,dateType} = this.searchInfo;
                this.isSearch = false;
                let timer = setTimeout(() => {
                    this.isSearch = true;
                    clearTimeout(timer);
                }, 1000);
                if (keyword || rangeDate || company || cityWord || (status > 0 || status === 0) || dateType) {
                    this.currentOrder = [];
                    this.loading = true;
                    this.currPage = 1;
                    this.searchFun();
                } else {
                    this.$message.warning('请输入搜索条件');
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
            // 设置表格数据
            setTableData(item) {
                let obj = {
                    apSrc:item.src,
                    adcID: item.adcID,
                    apID: item.apID,
                    apName: item.apName || '',
                    apQC: item.apQC || '',
                    apState: item.apState || '',
                    apTotal: item.apTotal || '',
                    appTime: item.appTime || '',
                    bTitle: item.bTitle || '--',
                    cName: item.cName || '',
                    realName: item.realName || '',
                    companyList: [],
                    skProgress: item.skProgress || '',
                    xkProgress: item.xkProgress || ''
                };
                for (let data of item.companyList) {
                    let objItem = {
                        asName: data.asName,
                        asrID: data.asrID,
                        cityList: [],
                    };
                    for (let con of data.cityList) {
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
                if (this.role == 'AD') {
                    sessionStorage.setItem("ADorder_apid", row.apID);
                    sessionStorage.setItem("ADorder_apSrc", row.apSrc);
                    this.$router.push("./ADorderDetail");
                } else {
                    sessionStorage.setItem('change_point', 'no');
                    sessionStorage.setItem('order_citylist', JSON.stringify(row.companyList));
                    sessionStorage.setItem("order_apid", row.apID);
                    sessionStorage.setItem("order_apSrc", row.apSrc);
                    this.$router.push("./orderDetail");
                }
            },
            // 更换点位
            changePoint(row) {
                sessionStorage.setItem('change_point', 'yes');
                sessionStorage.setItem("order_apid", row.apID);
                sessionStorage.setItem('order_citylist', JSON.stringify(row.companyList));
                this.$router.push("./orderDetail");
            },
            // 状态转换成文本
            stateToText(val) {
                let state = [
                    {text: "已完成", value: 0, color: 'rgba(196,203,211,1)'},
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
            // 时间格式规范
            formatTime(val) {
                return dateFormat.toDate(val, '/');
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
                    "结束后，[ <b>" + row.apName + "</b> ] 将结束投放，该订单涉及点位将被释放",
                    "是否确认结束该订单？",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        dangerouslyUseHTMLString: true,
                        type: "warning"
                    }
                ).then(() => {
                    this.currApid = row.apID
                    const loading = this.$loading({
                        lock: true,
                        text: '正在结束订单...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    api.postApi(this.apiVar.Advertisement + "/SetFangan", info)
                        .then(res => {
                            // console.log(res.data);
                            if (res.data.SysCode == 300200) {
                                //结束订单成功
                                loading.close();
                                let price = (row.apTotal) ? this.priceFormat(row.apTotal / 100) : 0
                                MessageBox.confirm(
                                    "现订单金额为 <span style='color: #1890ff'>&yen;" + price + "</span>",
                                    "结束订单成功，是否修改订单金额？",
                                    {
                                        confirmButtonText: "修改",
                                        cancelButtonText: "不修改",
                                        dangerouslyUseHTMLString: true,
                                        type: "success",
                                        closeOnClickModal:false,
                                    }
                                ).then(() => {
                                    this.handleTime = new Date().getTime()

                                    this.getOrderPriceDetail(row.apID)
                                })
                                    .catch(() => {
                                        // Message.info("已取消操作");
                                    });
                                this.$set(row, "apState", 5);
                            }
                            else {
                                loading.close();
                                Message.warning(res.data.MSG);
                            }
                        })
                }).catch(() => {
                    Message.info("已取消操作");
                });
            },
            //获取订单金额详情
            getOrderPriceDetail(apID){
                api.getApi(this.apiVar.Advertisement+"/GetAPD", {apid:apID})
                    .then(res =>{
                        // console.log('test--', res.data);
                        if (!res.data.SysCode) {
                            sessionStorage.setItem('priceData',JSON.stringify(res.data))
                            let priceData = res.data
                            console.log('订单金额',priceData);
                            let obj = {
                                AdDoorAdPrice: 0,
                                AdDoorMakePrice: 0,
                                BreakAdPrice: 0,
                                BreakMakePrice: 0,
                                orderOldPrice: 0,
                                orderCompanyList: [],
                                priceCurrCompany: 0,
                                handleTime:this.handleTime,
                                apID:apID,
                                opType:2
                            }
                            for (let item of priceData) {
                                let isHave = obj.orderCompanyList.some(key=>{
                                    if(item.asrID==key.asrID&&item.rID==key.rID){
                                        //obj.orderCompanyList里是否已有相同的公司和城市
                                        return true
                                    }
                                })
                                if(isHave) {
                                    for(let data of obj.orderCompanyList){
                                        if(item.asrID==data.asrID&&item.rID==data.rID){
                                            let totalPrice = (data.pdAdFee+data.pdAdMake+item.pdAdFee+item.pdAdMake)/100
                                            if(data.pdType==1){
                                                data.BreakAdPrice = data.pdAdFee/100;
                                                data.BreakMakePrice = data.pdAdMake/100;
                                                data.AdDoorAdPrice = item.pdAdFee/100;
                                                data.AdDoorMakePrice = item.pdAdMake/100;
                                            }else{
                                                data.BreakAdPrice = item.pdAdFee/100;
                                                data.BreakMakePrice = item.pdAdMake/100;
                                                data.AdDoorAdPrice = data.pdAdFee/100;
                                                data.AdDoorMakePrice = data.pdAdMake/100;
                                            }
                                            data.orderOldPrice = this.priceFormat(totalPrice)
                                        }
                                    }
                                } else {
                                    let a = {
                                        ...item,
                                        company: item.asName,
                                    }
                                    obj.orderCompanyList.push(a)
                                }

                            }
                            let result = 0
                            for(let data of obj.orderCompanyList){
                                result += data.AdDoorAdPrice+data.AdDoorMakePrice+data.BreakAdPrice+data.BreakMakePrice
                            }
                            console.log(result);
                            obj.orderOldPrice = this.priceFormat(result)
                            obj.AdDoorAdPrice = obj.orderCompanyList[obj.priceCurrCompany].AdDoorAdPrice
                            obj.AdDoorMakePrice = obj.orderCompanyList[obj.priceCurrCompany].AdDoorMakePrice
                            obj.BreakAdPrice = obj.orderCompanyList[obj.priceCurrCompany].BreakAdPrice
                            obj.BreakMakePrice = obj.orderCompanyList[obj.priceCurrCompany].BreakMakePrice

                            console.log(obj);
                            this.changePriceData = obj
                            this.changePriceModal = true
                        } else if (res.data.SysCode == 100302) {
                            this.loginTimeout();
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
            },
            cancelChangePrice() {
                this.changePriceModal = false
                this.changePriceData = {
                    AdDoorAdPrice: 0,
                    AdDoorMakePrice: 0,
                    BreakAdPrice: 0,
                    BreakMakePrice: 0,
                    orderOldPrice: 0,
                    orderCompanyList: [],
                    priceCurrCompany: 0,
                }
                Message.info("已取消操作");
            },
            doneChangePrice() {
                this.changePriceModal = false
                this.changePriceData = {
                    AdDoorAdPrice: 0,
                    AdDoorMakePrice: 0,
                    BreakAdPrice: 0,
                    BreakMakePrice: 0,
                    orderOldPrice: 0,
                    orderCompanyList: [],
                    priceCurrCompany: 0,
                }
                Message.success("修改订单金额成功!");
            },
            // 登录超时
            loginTimeout() {
                this.$message({
                    message: '登录超时或权限异常,请重新登录',
                    type: 'warning'
                })
                this.$router.push('/login')
            },
            // 重置
            reset() {
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
                    dateType:'1',
                };
                this.currPage = 1;
                this.currentOrder = [];
                this.isReset = false;
                let timer = setTimeout(() => {
                    this.isReset = true;
                    clearTimeout(timer);
                }, 1000);
                this.searchFun();
            },
            // 申请画像
            applyPhoto(row) {
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
                api.getApi(this.apiVar.Advertisement + "/GetAdLaunch", info)
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
            filterRes(arr) {
                let result_ = [];
                let resIDS = '';
                for (let data of arr) {
                    if (!resIDS.includes(data.resID)) {
                        console.log('data', data.resID);
                        resIDS += data.resID + ",";
                        console.log('resId', resIDS)
                        result_.push(data);
                        console.log('result----------------------------', result_)
                    } else {
                        console.log('重复')
                    }
                }
                console.log('RESULT---------', result_);
                return result_;
            },
            // 获取是否开通社区
            getIsOpenRes(arr) {
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
                api.getApi(this.apiVar.QZhike + '/SelectByApID', info).then(res => {
                    console.log(res.data);
                    if (res.data) {
                        let result = res.data;
                        // 过滤后已经申请的社区
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = 0; j < result.length; j++) {
                                if (arr[i].resID == result[j].resID && (result[j].aiState == 1 || result[j].aiState == 0)) {
                                    arr.splice(i, 1);
                                    i--;
                                    break;
                                }
                            }
                        }
                        this.houselist = arr;
                        this.houselist.push();
                        if (this.houselist.length) {
                            this.showPhoto = true;
                        } else {
                            sessFun.messageFun('info', '部分社区审核中');
                        }
                    } else {
                        sessFun.messageFun('warning', res.data.MSG);
                    }
                });
            },
            cancelApply() {
                sessFun.messageFun('info', '取消画像申请');
                this.showPhoto = !this.showPhoto;
            },
            confirmApply(data) {
                console.log('data------', data);
                this.showPhoto = !this.showPhoto;
                for (let obj of data.resData) {
                    let info = {
                        uname: this.sessionData.realName,
                        apid: this.orderRow.apID,
                        resid: obj.resID,
                        uid: this.sessionData.uID,
                        tooken: this.sessionData.token,
                        gsday: obj.schedules[0],
                        geday: obj.schedules[1],
                        apname: this.orderRow.apName,
                        gid: this.orderRow.adcID,
                        ctlist: data.hoppyType.join(',')
                    };
                    this.downApi(info);
                }
            },
            // 超管申请画像
            downApi(info) {
                // apid[必填]    关联订单ID
                // resid[必填]   社区唯一标识
                // uid[必填]     申请人ID
                // tooken[必填]  登陆凭证
                // gsday[必填]   申请开通的开始时间
                // geday[必填]   申请开通的结束时间
                // ctlist[必填]  消费偏好
                api.getApi(this.apiVar.QZhike + '/AdminSetApply', info).then(res => {
                    console.log(res.data)
                    if (res.data.SysCode == 700200) {
                        Message.success(res.data.MSG);
                        for (let resData of this.houselist) {
                            if (resData.resID == this.resid) {
                                this.$set(resData, 'aiState', 0);
                                break;
                            }
                        }
                        this.houselist.push();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                });
            },
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

    /deep/ .el-range-separator {
        position: relative;
        top: -2px;
    }

    /deep/ .search_row .el-input__inner {
        width: 140px;
    }

    /deep/ .block_box .el-input__inner {
        width: 150px;
    }

    /deep/ .el-date-editor i,
    /deep/ .el-date-editor input,
    /deep/ .el-date-editor span {
        float: left;
        position: relative;
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

    /*日期控件*/
    .block {
        display: inline-block;
        margin-left: 2px;
    }

    /deep/ .el-date-editor--daterange.el-input__inner {
        width: 240px;
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

    /deep/ .el-table td .cell {
        padding: 2px 10px;
        height: auto;
        line-height: 28px;
    }

</style>
<style>
    .price-dialog /deep/ .el-dialog__body {
        padding: 10px 20px;
    }

    .price-dialog /deep/ .el-dialog__body p {
        margin-bottom: 8px;
    }
    .price-dialog-list .price-dialog .num-input-wrap span {
        top: 2px !important;
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
