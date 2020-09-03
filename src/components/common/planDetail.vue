<template>
    <div>
        <div class="ad_mediaDetail_wrap clearfix">
            <div class="ad_mediaDetail_nav">
                <p>
                    <a href="#">方案管理</a>
                    <em> / </em>
                    <a href="#">方案详情</a>
                </p>
                <div class="tip">该方案由 {{planDetail.realName}} 创建于 {{planDetail.apcTime}}</div>
            </div>
            <!--资源信息-->
            <div class="mediaList_wrap">
                <div class="content_top_wrap" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                    <div class="plan-title">
                        <h4>
                            <img src="../../assets/images/orderlogo.png" alt="">{{planDetail.apName}}
                        </h4>
                        <div class="handleBtn">
                            <!--<el-button plain>导出</el-button>-->
                            <template v-if="planDetail.apState==1">
                                <el-button type="primary" @click="edit()" v-if="(role=='BD')|| (role=='MD')"
                                           v-qadn-mta-h5="{id: 'a004_b010_c000_d000_bt097_ck03'}">编辑</el-button>
                            </template>
                        </div>
                    </div>
                    <div>
                        <detail :detail="planDetail" v-if="isShow"></detail>

                    </div>
                </div>
            </div>
            <div class="mediaList_wrap margin_16_64">
                <el-tabs v-model="planPanel" @tab-click="handleClick()">
                    <el-tab-pane label="选点排期" name="first">
                        <div class="first-wrap box-wrap">
                            <div class="table_wrap">
                                <el-table border :data="setpointArr" style="width: 100%" :default-sort="{prop: 'recName', order: 'descending'}"  v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <el-form label-position="left" inline class="demo-table-expand">
                                                <el-form-item label="商圈：">
                                                    <span>{{ props.row.tradingArea}}</span>
                                                </el-form-item>
                                                <el-form-item label="楼栋数量：">
                                                    <span>{{ props.row.fNum }}</span>
                                                </el-form-item>
                                                <el-form-item label="资产编号：">
                                                    <span>{{ props.row.assetTag }}</span>
                                                </el-form-item>
                                                <el-form-item label="入住年份：">
                                                    <span>{{ props.row.chDay }}</span>
                                                </el-form-item>
                                                <el-form-item label="广告限制：">
                                                    <span>{{ props.row.notPush }}</span>
                                                </el-form-item>
                                            </el-form>
                                            <el-form v-if="customPermission.patrolPermission" label-position="left" inline class="demo-table-expand">
                                                <el-form-item label="巡点问题：">
                                                    <span class="ellipsis-td">{{ props.row.feedback }}</span>
                                                </el-form-item>
                                                <el-form-item label="通行情况：">
                                                    <span class="ellipsis-td">{{ props.row.trafficState }}</span>
                                                </el-form-item>
                                            </el-form>
                                        </template>
                                    </el-table-column>

                                    <el-table-column label="资源名称" min-width="16.1%" prop="resName">
                                    </el-table-column>
                                    <el-table-column prop="mTitle" label="媒体名称" min-width="10.3%">
                                    </el-table-column>
                                    <el-table-column prop="asLab" label="投放面" min-width="8.8%">
                                    </el-table-column>
                                    <el-table-column prop="city" label="城市" min-width="6%" :filters="filterCityData" :filter-method="filterCity">
                                    </el-table-column>
                                    <el-table-column prop="rName" label="区域" min-width="7.4%" :filters="filtersArea" :filter-method="filterOrigin">
                                    </el-table-column>
                                    <el-table-column prop="cType" label="楼盘类型" min-width="8.8%">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.cType||'--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="hNum" label="小区户数" min-width="6.0%" align="right">
                                        <template slot-scope="scope">
                                            <span>{{priceToFormat(scope.row.hNum)}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="楼盘价格" min-width="9.0%" align="right">
                                        <template slot-scope="scope">
                                            <span>&yen;{{scope.row.hPrice?priceFormat(scope.row.hPrice/100):0}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="timeRange" label="排期" min-width="14.2%" :filters="filtersData" :filter-method="filterTimeRange">
                                        <template slot-scope="scope">
                                            <template v-if="scope.row.lState==2">
                                                <span>{{scope.row.finishTimeRange}}</span>
                                                <el-tooltip placement="top">
                                                    <div slot="content">
                                                        <span>{{scope.row.timeRange}}</span>
                                                    </div>
                                                    <i class="el-icon-question"> </i>
                                                </el-tooltip>
                                            </template>
                                            <span v-else>{{scope.row.timeRange}}</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="报价单" name="second">
                        <ap-quotation @detailInfo="setInfo" :quotationData="quotation" :copydata="copyAsidArr" :shopingList="[]" class="price_quo"></ap-quotation>
                    </el-tab-pane>
                    <el-tab-pane label="物料信息" name="third">
                        <material :material="materialInfo" :daomater="daoInfo" :loading="maLoading" :isOrder="false"></material>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="content_bottom_btn">
                <el-button plain type="default" icon="el-icon-download" class="searchBtn" v-if="planPanel=='first'"
                           v-qadn-mta-h5="{id: 'a004_b010_c002_d000_bt102_ck04'}"
                           @click="export2Excel(planDetail.apName)" :disabled="isDown">导出</el-button>
                <el-button plain class="cancel" @click="goBack()"
                           v-qadn-mta-h5="{id: 'a004_b010_c000_d000_bt098_ck03'}">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { api } from "../../api/api.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";
// 报价单
import apQuotation from './components/apQuotation.vue'
import material from "./components/materialInfo.vue";
import detail from "./components/detailInfo.vue";
import {
    Table,
    TableColumn,
    Tabs,
    TabPane,
    Button,
    Message,
    MessageBox
} from "element-ui";

export default {
    name: "planDetail",
    components: {
        apQuotation,
        material,
        detail,
        elTable: Table,
        elTableColumn: TableColumn,
        elTabs: Tabs,
        elTabPane: TabPane,
        elButton: Button,
    },
    data() {
        return {
            // 登录信息
            sessionData:{},
            isDown: false,
            isShow: true,
            //加载中
            loading: true,
            maLoading: true,
            role: "",
            customPermission: {},
            // 方案详情
            planDetail: {
                AdDoor:{},
                barrier:{},
            },
            // 选点排期
            setpointArr: [],
            copyAsidArr: [],
            // 广告物料信息
            materialInfo:[],
            // 道闸物料信息
            daoInfo:[],
            // 报价单详情
            priceSheet: [],
            quotation: {
                isDetail: true,
                quotation: []
            },
            //物料信息
            // materialInfo: [],
            // 城市过滤结果
            filterCityData: [],
            // 排期时间过滤
            filtersData: [],
            // 地区过滤结果
            filtersArea: [],
            planPanel: "first"
        };
    },
    created() {
        // 获取角色
        this.getRole();
        // 获取选点排期数据
        this.getInitData();
    },
    methods: {
        setInfo(data){
           console.log('defail------data', data);
            this.priceSheet = data;
        },
        // 导出excel
        export2Excel(name) {
            this.isDown = true;
            let resultArr = [];
            for(let data of this.setpointArr){
                let obj = {
                    resName: data.resName,
                    city: data.city,
                    rName: data.rName,
                    mVehicle: data.mVehicle,
                    mTitle: data.mTitle,
                    asLab: data.asLab,
                    timeRange: data.timeRange,
                    finishTimeRange: data.finishTimeRange,
                    assetTag: data.assetTag,
                    tradingArea: data.tradingArea,
                    cType: data.cType,
                    hPrice: data.hPrice/100,
                    hNum: data.hNum == '0' ? '#' : data.hNum,
                    fNum: data.fNum == '0' ? '#' : data.fNum,
                    chDay: data.chDay,
                    adSize: data.mVehicle == "广告门" ? data.adSize: data.picSize,
                    adViewSize: data.mVehicle == "广告门" ? data.adViewSize: data.lightBoxSize,
                    notPush: data.notPush,
                    mRemark: data.mRemark,
                    resAddress: data.resAddress,
                    feedback: data.feedback,
                    trafficState: data.trafficState,
                };
                resultArr.push(obj);
            }
            require.ensure([], () => {
                const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                const tHeader = ['资源名称', '市', '区域', '媒介载体', '媒体名称', '资产编号', '投放面', '投放日期', '终止日期', '商圈', '楼盘类型/写字楼类型', '楼盘价格', '住户数量/办公室数量', '楼栋数量', '入住年份/建成年份', '广告尺寸/画面尺寸', '可视画面/灯箱尺寸', '广告限制', '媒体备注', '详细地址'];
                const filterVal = ['resName', 'city', 'rName', 'mVehicle', 'mTitle', 'assetTag', 'asLab', 'timeRange', 'finishTimeRange', 'tradingArea', 'cType', 'hPrice', 'hNum', 'fNum', 'chDay', 'adSize', 'adViewSize', 'notPush', 'mRemark', 'resAddress'];
                if(this.customPermission.patrolPermission) {
                    tHeader.push('巡点问题', '通行情况');
                    filterVal.push('feedback', 'trafficState')
                }
                const list = resultArr;
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, name);
                this.isDown = false;
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        // tab点击
        handleClick() {
            if (this.planPanel == "first") {
                this.getSetPoint();
                MtaH5.clickStat('a004_b010_c000_d000_bt099_ck09')
            } else if(this.planPanel == "second") {
                MtaH5.clickStat('a004_b010_c000_d000_bt100_ck09')
            } else if(this.planPanel == "third") {
                MtaH5.clickStat('a004_b010_c000_d000_bt101_ck09')
            }
        },
        // 获取选点排期列表数据
        getInitData() {
            this.isShow = false;

            // 真实数据
            let apid = sessionStorage.getItem("plan_apid");
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apid: apid
            };
            // uid         int【必填】     当前账户UserID
            // apid        int             公司对应方案apID
            api.getApi(this.apiVar.Advertisement+"/GetFanganInfo", info)
                .then(res => {
                    console.log('resdata---', res.data);
                    if (res.data.SysCode == 200200) {
                        let info = res.data.data;
                        console.log('info---apTotal', info.apTotal);
                        this.planDetail = {
                            adcID: info.adcID,
                            apID: info.apID,
                            apName: info.apName,
                            apState: info.apState,
                            apTotal: info.apTotal,
                            apcTime: dateFormat.toDateTime(info.apcTime, '/'),
                            bTitle: info.bTitle,
                            cName: info.cName,
                            cuName: info.cuName,
                            pdEnd: info.pdEnd,
                            pdStar: info.pdStar,
                            rID: info.rID,
                            rIDs: info.rIDs,
                            realName: info.realName,
                            pdTotal: this.priceFormat((info.apTotal - info.adOtherFee- info.adSendFee)/100),
                            pdSendFee: this.priceFormat(info.adSendFee/100),
                            pdOtherFee: this.priceFormat(info.adOtherFee/100),
                            Total: this.priceFormat(info.apTotal/100),
                            AdDoor:{
                                pdTotal: this.priceFormat((info.AdDoor.pdTotal - info.AdDoor.adOtherFee- info.AdDoor.adSendFee)/100),
                                pdSendFee: this.priceFormat(info.AdDoor.adSendFee/100),
                                pdOtherFee: this.priceFormat(info.AdDoor.adOtherFee/100),
                            },
                            barrier:{
                                pdTotal: this.priceFormat((info.barrier.pdTotal - info.barrier.adOtherFee- info.barrier.adSendFee)/100),
                                pdSendFee: this.priceFormat(info.barrier.adSendFee/100),
                                pdOtherFee: this.priceFormat(info.barrier.adOtherFee/100),
                            },
                        };
                        console.log('this.plandetail---', this.planDetail);
                        // 选点排期
                        this.getSetPoint();
                    } else{
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    console.log(res);
                });
        },
        // 获取选点排期
        getSetPoint() {
            if(this.setpointArr.length){
                return;
            }
            // 真实数据
            let apid = sessionStorage.getItem("plan_apid");
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apid: apid
            };
            if (this.planDetail.apState == 1) {
                this.funcToInit(this.apiVar.Advertisement+'/GetADB', info, this.planDetail.apState);
            } else {
                this.funcToInit(this.apiVar.Advertisement+'/GetAdLaunch', info, this.planDetail.apState);
            }
        },
        // 请求数据整合
        funcToInit(apiUrl, info, state){
            // uid         int【必填】     当前账户UserID
            // apid        int             公司对应方案apID
            api.getApi(apiUrl, info)
                .then(res => {
                    console.log(res.data);
                    if (!res.data.SysCode) {
                        let initData = res.data;
                        let resInfo = initData.adSpaceInfo;
                        // 城市中文名称
                        for (let data of resInfo) {
                            let time = "";
                            if(state == 1){
                                time = this.formatTime(data.pbStar) + "-" + this.formatTime(data.pbEnd);
                            }else{
                                time = this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
                            }
                            data.timeRange = time;
                            let finishTimeRange = '';
                            if(data.lState == 2){
                                finishTimeRange = this.formatTime(data.lStar)+"-"+this.formatTime(data.lSetTime);
                            }
                            data.finishTimeRange = finishTimeRange;
                        }
                        // 城市筛选过滤
                        this.filterCityData = filterFormat(resInfo, "city");
                        this.filtersArea = filterFormat(resInfo, "rName");
                        this.filtersData = filterFormat(resInfo, "timeRange");
                        // 选点排期
                        this.copyAsidArr = JSON.parse(JSON.stringify(resInfo));
                        this.setpointArr = resInfo;

                        // 广告门物料信息
                        let mInfo = initData.gateMaterialInfo;
                        let materialRes = [];
                        for(let data of mInfo){
                            let str = data.gateMaterialSize.split('-');
                            let obj = {
                                adSize: str[0],
                                adViewSize: str[1],
                                pointNum : data.gateMaterialCount,
                                resolution : "150dpi",
                                colorMode : "CMYK",
                                photoFormat : "JPG/TIF/AI/PSD/CDR",
                            };
                            materialRes.push(obj);
                        }
                        this.materialInfo = materialRes;

                        // 道闸物料信息
                        let InfoTest = initData.roadGateMaterialInfo;
                        let daoRes = [];
                        for(let data of InfoTest){
                            let str = data.roadGateMaterialSize.split('-');
                            let obj = {
                                adSize: str[1],
                                adViewSize: str[0],
                                pointNum : data.roadGateMaterialCount,
                                resolution : "150dpi",
                                colorMode : "CMYK",
                                photoFormat : "JPG/TIF/AI/PSD/CDR",
                            };
                            daoRes.push(obj);
                        }
                        this.daoInfo = daoRes;
                        this.loading = false;
                        this.maLoading = false;

                        this.$nextTick(function () {
                            this.isShow = true;
                        });
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    this.loading = false;
                    this.maLoading = false;
                    console.log(res);
                });
        },
        // 时间格式规范
        formatTime(val) {
            return dateFormat.toDate(val, "/");
        },
        // 价格加上逗号
        priceFormat(price) {
            return commaFormat.init(price);
        },
        priceToFormat(price){
            if(!price) {
                return 0
            }
            return commaFormat.format(price);
        },
        // 返回
        goBack() {
            this.$router.push("./planList");
        },
        // 弹出框修改路径
        changeRoute(){
            MessageBox.confirm(
                `该方案被预锁,请先解除预锁,是否去解锁？`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    this.$router.push("./planList");
                })
                .catch(() => {
                    Message.info("已取消操作");
                });
        },
        // 编辑
        edit() {
            let apid = sessionStorage.getItem("plan_apid");
            let session = this.sessionData;
            let info = {
                uid: session.uID,
                token: session.token,
                apid: apid,
            };
            api.postApi(this.apiVar.Advertisement+"/CheckLock", info).then(res =>{
                console.log(res.data);
                if(!res.data.SysCode){
                    if(!res.data.IsLock){
                        this.$router.push("./editPlan");
                    }else{
                        this.changeRoute();
                    }
                }
            });
        },
        // 获取角色
        getRole() {
            this.sessionData = sessFun.getSess();
            this.role = this.sessionData.uType;
            this.customPermission = this.sessionData.customPermission;
        },
        filterCity(value, row) {
            return row.city === value;
        },
        filterOrigin(value, row) {
            return row.rName === value;
        },
        filterTimeRange(value, row) {
            return row.timeRange === value;
        }
    },
};
</script>

<style scoped>
.ellipsis-td {
    width: 132px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
/*状态行*/
/deep/ .el-table .warning-row {
    background: #fff1f1;
}

/*tabbar*/
/deep/ .el-textarea__inner {
    resize: vertical;
}

/deep/ .el-tabs__nav-wrap::after {
    background-color: transparent;
}

.box-wrap {
    background-color: #fff;
}
.price_quo{
    margin: 8px 32px;
}
/deep/ .el-tabs__nav-scroll {
    padding-left: 28px;
}

.baojiadan /deep/ .el-tabs__nav-scroll {
    padding-left: 0;
}

.box-wrap > h4 {
    height: 55px;
    padding-left: 28px;
    border-bottom: 1px solid #e6e7e9;
    font-size: 16px;
    color: rgba(51, 51, 51, 0.85);
    line-height: 55px;
    font-weight: bold;
}

/deep/ .el-table__column-filter-trigger {
    left: 5px;
}

.table_wrap {
    padding: 8px 32px;
}

/*报价单*/

/deep/ .el-tabs--border-card {
    box-shadow: none;
}

/deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 40px;
}

.panel {
    padding: 10px 24px;
}

.step3 {
    padding: 0 105px;
}

/deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 40px;
}
/deep/ .el-button.el-button--text span {
    position: relative;
    top: -5px;
}

/*详情头部*/
.content_top_wrap {
    padding: 24px 32px;
    background: #ffffff;
    height: 145px;
    position: relative;
}

.plan-title .handleBtn {
    position: absolute;
    right: 28px;
    top: 30px;
}

.plan-title .handleBtn button {
    width: 74px;
    height: 32px;
    font-size: 14px;
    line-height: 9px;
    padding: 0;
}

.plan-title h4 {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    margin-bottom: 22px;
}

.plan-title h4 p {
    display: inline-block;
    font-size: 14px;
    color: #666666;
    font-weight: normal;
    margin-left: 11px;
}

.plan-title h4 p img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 1px;
    cursor: pointer;
}

.plan-title h4 img {
    width: 28px;
    height: 28px;
    position: relative;
    top: 5px;
    margin-right: 16px;
}

/*面包屑导航*/
.tip {
    font-size: 14px;
    color: #999999;
    text-align: right;
    line-height: 36px;
    display: inline-block;
    float: right;
    height: 36px;
}

/*按钮*/
.content_bottom_btn {
    margin: 32px 0;
    width: 100%;
    text-align: center;
}

.content_bottom_btn button {
    width: 80px;
    height: 34px;
    line-height: 34px;
    outline: none;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    background: #ffffff;
    font-size: 14px;
    color: #666666;
}

/deep/ .mediaList_wrap .el-tabs__header{
    border-bottom: 1px solid #e6e7e9;
    height: 53px;
    line-height: 54px;
}
/deep/.mediaList_wrap  .baojiadan .el-tabs__header{
    border-bottom: none;
    height: 38px;
    line-height: 38px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    margin: 0;
}

/deep/ .content_bottom_btn .el-button{
    padding: 0;
}
/deep/ .el-table__expanded-cell[class*=cell] .el-form {
    height: 44px;
    line-height: 44px;
}
/deep/ .el-table__expanded-cell[class*=cell] {
    padding: 0 46px;
    background-color: #F7F7F7;;
}
/deep/ .el-form-item__content{
    line-height: 46px;
}
/deep/ .table_wrap .el-table__body-wrapper{
    min-height: auto;
}
.box-wrap, #pane-second{
    margin-bottom: 32px;
}
</style>
