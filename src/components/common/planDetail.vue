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
                            <el-tooltip v-if="role=='MD' && planDetail.lockStatus==1" effect="dark" content="从今天起重新预锁七天" placement="top">
                                <el-button @click="reLock">预 锁</el-button>
                            </el-tooltip>
                            <!-- apState：0已完成；1进行中；2未投放；3投放中；5强制结束；-1待配点 -->
                            <template v-if="planDetail.apState==1">
                                <!-- planMode：0普通 1意向 -->
                                <el-button v-if="customPermission.proposalPermission == 1 && planDetail.planMode==1" plain class="handleBtn--plain" @click="createShareCode">协同选点</el-button>
                                <el-button v-if="customPermission.proposalPermission == 1 && planDetail.planMode==1" plain class="handleBtn--plain" @click="setPlanPrice">设置金额</el-button>
                                <el-button v-if="customPermission.proposalPermission == 1 && planDetail.planMode==1 && role=='BD'" plain class="handleBtn--plain" @click="matchRes">配点</el-button>
                                <!-- 1:普通销售编辑非意向方案2:权限销售编辑意向小区3:媒介编辑所有方案 -->
                                <el-button type="primary" @click="edit()" 
                                    v-if="(role=='BD' && customPermission.proposalPermission == 0 && planDetail.planMode!=1) 
                                    || 
                                    (role=='BD' && customPermission.proposalPermission == 1 && planDetail.planMode==1) 
                                    || 
                                    (role=='MD')"
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
                                <el-table border :data="currentPagination" style="width: 100%" max-height="500"> :default-sort="{prop: 'recName', order: 'descending'}"  v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
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
                                                <el-form-item v-if="sessionData.mediaManageLevel == 1 || sessionData.saleManageLevel == 2" label="归属公司：">
                                                    <span class="ellipsis-td">{{ props.row.asName||'' }}</span>
                                                </el-form-item>
                                            </el-form>
                                            <el-form v-if="customPermission.patrolPermission" label-position="left" inline class="demo-table-expand">
                                                <el-form-item label="巡点问题：">
                                                    <span class="ellipsis-td">{{ props.row.remark }}</span>
                                                </el-form-item>
                                                <el-form-item label="通行情况：">
                                                    <span class="ellipsis-td">{{ props.row.trafficState }}</span>
                                                </el-form-item>
                                                <el-form-item label="通电情况：" v-if="customPermission.patrolPermission==2">
                                                    <span class="ellipsis-td">{{ props.row.electrifyState }}</span>
                                                </el-form-item>
                                            </el-form>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="资源名称" min-width="16.1%" prop="resName" show-overflow-tooltip>
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
                                <el-pagination
                                    background
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="currentPage"
                                    :page-sizes="[50, 100, 200, 300]"
                                    :page-size="pageSize"
                                    style="text-align: right; margin-top: 10px;"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="totalNum">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane v-if="planDetail.planMode==0" label="报价单" name="second">
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
            <el-dialog title="设置方案金额" :visible.sync="settlementFormVisible" width="368px" custom-class="settlement-dialog" :show-close="false" :close-on-click-modal="false" :close-on-press-escap="false" :before-close="resetSettlement">
                <el-form ref="settlementForm" :model="settlementForm" :rules="settlementFormRules">
                    <el-form-item label="点位单价：" prop="unitPrice" :label-width="formLabelWidth">
                        <el-input v-model.number="settlementForm.unitPrice" size="small" maxlength="7">
                            <template slot="append">元/面·周</template>
                        </el-input>
                    </el-form-item>
                    <div class="form__line"></div>
                    <el-form-item label="现金结算：" prop="cash" :label-width="formLabelWidth">
                        <el-input v-model.number="settlementForm.cash" size="small" maxlength="7">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="置换结算：" prop="displace" :label-width="formLabelWidth">
                        <el-input v-model.number="settlementForm.displace" size="small" maxlength="7">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="其它结算：" prop="other" :label-width="formLabelWidth">
                        <el-input v-model.number="settlementForm.other" size="small" maxlength="7">
                            <template slot="append">元</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="方案总价：" :label-width="formLabelWidth">
                        <span class="form-item__price">{{(isNaN(settlementForm.cash)?0:settlementForm.cash*1)+(isNaN(settlementForm.displace)?0:settlementForm.displace*1)+(isNaN(settlementForm.other)?0:settlementForm.other*1)}} 元</span>
                    </el-form-item>
                    <div class="form__line"></div>
                    <el-form-item label="金额备注：" prop="settlementRemark" :label-width="formLabelWidth">
                        <el-input type="textarea" placeholder="请输入备注" v-model="settlementForm.settlementRemark" size="small"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetSettlement(()=>settlementFormVisible = false)">取 消</el-button>
                    <el-button type="primary" @click="setPlanPrice('settlementForm')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <!--智能配点-->
        <add-point :dialogVisible="addPointDialogVisible" :showMatchResult="showMatchResult" :apID="planDetail.apID" :rejectAdPlan="rejectAdPlan" :ADLimit="ADLimit" :customPermission="customPermission" @closeAddPoint="addPointDialogVisible=false" @openAddPoint="addPointDialogVisible=true" @merge2ShopList="BDSaveMatchToPlan"></add-point>
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
import addPoint from './components/addPoint.vue';
import {
    // Table,
    // TableColumn,
    // Tabs,
    // TabPane,
    // Button,
    Message,
    MessageBox
} from "element-ui";

export default {
    name: "planDetail",
    components: {
        apQuotation,
        material,
        detail,
        addPoint
        // elTable: Table,
        // elTableColumn: TableColumn,
        // elTabs: Tabs,
        // elTabPane: TabPane,
        // elButton: Button,
    },
    data() {
        let validatPrice = (rule, value, callback) => {
            if (value) {
                let reg = /^\d{1,}$/;
                if (!reg.test(value)) {
                    callback(new Error("请输入正整数"));
                } else if (value > 9999999) {
                    callback(new Error("预算不能大于9,999,999"));
                } else {
                    callback();
                }
            } else {
                callback();
                // this.$refs["customerBudgetRef"].clearValidate()
            }
        };
        return {
            // 登录信息
            sessionData:{},
            addPointDialogVisible: false,
            rejectAdPlan: [],                  // 排斥方案选项
            showMatchResult: false,
            ADLimit: [                      // step2 广告限制
                {value: '地产', label: '地产'},
                {value: '汽车', label: '汽车'},
                {value: '美容', label: '美容'},
                {value: '餐饮', label: '餐饮'},
                {value: '食品', label: '食品'},
                {value: '金融', label: '金融'},
                {value: '医学', label: '医学'},
            ],
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
            // 城市过滤结果
            filterCityData: [],
            // 排期时间过滤
            filtersData: [],
            // 地区过滤结果
            filtersArea: [],
            planPanel: "first",
            // 分页时页面条目数量
            pageSize: 100,
            currentPage: 1,
            totalNum: 0,
            // 设置方案金额
            formLabelWidth: '70px',
            settlementFormVisible: false,
            settlementForm: {
                unitPrice: 0,
                cash: 0,
                displace: 0,
                other: 0,
                settlementRemark: ''
            },
            settlementFormRules: {
                unitPrice: [{ validator: validatPrice, trigger: "blur" }],
                cash: [{ validator: validatPrice, trigger: "blur" }],
                displace: [{ validator: validatPrice, trigger: "blur" }],
                other: [{ validator: validatPrice, trigger: "blur" }]
            }
        };
    },
    created() {
        // 获取角色
        this.getRole();
        // 获取选点排期数据
        this.getInitData();
        this.getADLimit()       // 获取广告限制列表
    },
    computed: {
        currentPagination() {
            this.totalNum = this.setpointArr.length;
            return this.setpointArr.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize);
        }
    },
    methods: {
        handleSizeChange(val) {
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        setInfo(data){
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
                    remark: data.remark,
                    trafficState: data.trafficState||'',
                    electrifyState: data.electrifyState||'',
                    asName: data.asName
                };
                resultArr.push(obj);
            }
            require.ensure([], () => {
                const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                const tHeader = ['资源名称', '市', '区域', '媒介载体', '媒体名称', '资产编号', '投放面', '投放日期', '终止日期', '商圈', '楼盘类型/写字楼类型', '楼盘价格', '住户数量/办公室数量', '楼栋数量', '入住年份/建成年份', '广告尺寸', '可视画面', '广告限制', '媒体备注', '详细地址'];
                const filterVal = ['resName', 'city', 'rName', 'mVehicle', 'mTitle', 'assetTag', 'asLab', 'timeRange', 'finishTimeRange', 'tradingArea', 'cType', 'hPrice', 'hNum', 'fNum', 'chDay', 'adSize', 'adViewSize', 'notPush', 'mRemark', 'resAddress'];
                if((this.sessionData.uType == 'MD' && this.sessionData.mediaManageLevel == 1) || (this.sessionData.uType == 'BD' && this.sessionData.saleManageLevel == 2)) {
                    tHeader.push('归属公司')
                    filterVal.push('asName');
                }
                switch (this.customPermission.patrolPermission) {
                    case 1:
                        tHeader.push('巡点问题', '通行情况');
                        filterVal.push('remark', 'trafficState');
                        break;
                    case 2:
                        tHeader.push('巡点问题', '通行情况', '通电情况');
                        filterVal.push('remark', 'trafficState', 'electrifyState');
                        break;
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
        getInitData(updateDetail=false) {
            this.isShow = updateDetail;
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
                    if (res.data.SysCode == 200200) {
                        let info = res.data.data;
                        this.planDetail = {
                            adcID: info.adcID,
                            apID: info.apID,
                            apName: info.apName,
                            apState: info.apState,
                            planMode: info.planMode,
                            lockStatus: info.lockStatus,
                            apTotal: info.apTotal,
                            apcTime: dateFormat.toDateTime(info.apcTime, '/'),
                            bTitle: info.bTitle,
                            cName: info.cName,
                            cuName: info.cuName,
                            cityList: info.cityList||[],
                            customerDemand: info.customerDemand||'',
                            pdEnd: info.pdEnd,
                            pdStar: info.pdStar,
                            rID: info.rID,
                            rIDs: info.rIDs,
                            realName: info.realName,
                            remark: info.remark,
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
                        // 选点排期
                        !updateDetail && this.getSetPoint();
                        this.getRejectPlanList(res.data.data.suID)
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
                // apState: 1 方案并未转成订单
                this.funcToInit(this.apiVar.Advertisement+'/GetADB', info, this.planDetail.apState);
            } else {
                this.funcToInit(this.apiVar.Advertisement+'/GetAdLaunch', info, this.planDetail.apState);
            }
        },
        getADLimit() {
            this.ADLimit = []
            let params = {
                "uid": this.sessionData.uID,
                "token": this.sessionData.token,
                "service":"GetNotPush",
                "data": {}
            }
            api.postApi_new(this.apiVar.Media, params).then(res => {
                console.log('广告限制列表', res)
                if(res.data.SysCode === 200200 ){
                    let limit = res.data.data
                    let limitArr = []
                    for (let i = 0; i < limit.length; i++) {
                        let limitObj = {value: limit[i].nTitle, label: limit[i].nTitle}
                        limitArr.push(limitObj)
                    }
                    this.ADLimit = limitArr
                }
            })
        },
        // 获取排斥方案选择列
        getRejectPlanList(suID){
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
                        if(this.apid != key.apId){
                            tempList.push({
                                value: key.apId,
                                label: key.apName + '（' + key.cname + ' · ' + key.apcTime + '）'
                            })
                        }
                    }
                    this.rejectAdPlan = tempList
                } else {
                    sessFun.messageFun('warning',res.data.MSG)
                }
            })
        },
        // 请求数据整合
        funcToInit(apiUrl, info, state){
            // uid         int【必填】     当前账户UserID
            // apid        int             公司对应方案apID
            api.getApi(apiUrl, info)
                .then(res => {
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
        // 重新预锁
        reLock() {
            this.$confirm('是否确定对该方案重新进行预锁？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 方案详情的预锁重置
                api.postApi(this.apiVar.Advertisement+"/ResetFangLock", {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apid: sessionStorage.getItem("plan_apid")
                }).then(res =>{
                    if(!res.data.SysCode){
                        console.log('res.data', res.data)
                    } else {
                        Message.success('重新预锁成功！');
                    }
                });
            }).catch(() => {})
        },
        /**
         * @description: 生成协同选点链接
         * @param {*}
         * @return {*}
         */        
        createShareCode() {
            api.postApi('/addsp/proposal/share/createShareCode', {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apID: this.planDetail.apID
            }).then((res) => {
                if (res.data.SysCode === 200200) {
                    // let Url = this.apiVar.qadnUrl + '/shareADList?apid=' + res.data.data.apID + '&aicode=' + res.data.data.aiCode;
                    let Url = `${window.location.protocol}//${window.location.host}/shareADListProposal?apid=${res.data.data.apID}&aicode=${res.data.data.aiCode}`;
                    console.log('url', Url);
                    let oInput = document.createElement('input');
                    oInput.value = Url;
                    document.body.appendChild(oInput);
                    oInput.select();                // 选择对象
                    document.execCommand("Copy"); // 执行浏览器复制命令
                    oInput.style.display = 'none';
                    sessFun.messageFun("success", '协同选点链接复制成功，马上分享');    
                } else {
                    sessFun.messageFun("warning", res.data.MSG);
                }
            });
        },
        /**
         * @description: 设置方案金额
         * @param {*}
         * @return {*}
         */
        setPlanPrice(formName) {
            if(this.settlementFormVisible) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('success---', this.settlementForm)
                        let params = {
                            uid: this.sessionData.uID,
                            token: this.sessionData.token,
                            apID: this.planDetail.apID,
                            adsWeekFee: this.settlementForm.unitPrice*100,
                            cashFee: this.settlementForm.cash*100,
                            sendFee: this.settlementForm.displace*100,
                            otherFee: this.settlementForm.other*100,
                            remark: this.settlementForm.settlementRemark||''
                        }
                        api.postApi('/addsp/proposal/updatePlanMoney', params).then((res) => {
                            if (res.data.SysCode === 200200) {
                                this.settlementFormVisible = false
                                this.getInitData(true)
                                console.log("金额结算成功");
                            } else {
                                sessFun.messageFun("warning", "金额结算失败");
                            }
                        });
                    } else {
                        console.warn('valid---')
                        return false;
                    }
                });
            } else {
                // 表单弹框显示
                this.settlementFormVisible = true
            }
        },
        // 销售配点
        matchRes() {
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apid: this.planDetail.apID,
            };
            api.postApi(this.apiVar.Advertisement+"/CheckLock", info).then(async res =>{
                if(!res.data.SysCode){
                    if(!res.data.IsLock){
                        if(this.planDetail.apState!==-1) {
                            // 方案已配点，显示上次配点结果
                            this.showMatchResult = true
                            this.$nextTick(()=>{
                                // 重置显示参数，方便下次触发watch
                                this.showMatchResult = false
                            })
                        } else {
                            // 方案未配点
                            this.addPointDialogVisible = true
                        }
                    } else{
                        this.changeRoute();
                    }
                }
            });
        },
        // 替换方案中的点位
        BDSaveMatchToPlan() {
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apID: this.planDetail.apID
            };
            api.postApi("/addsp/match/UpdatePlan", info).then((res) => {
                if (res.data.SysCode === 200200) {
                    // this.getInitData();
                    location.reload(false)
                    sessFun.messageFun("success", '保存配点成功！');
                } else {
                    sessFun.messageFun("warning", res.data.MSG);
                }
            });
        },
        // 
        resetSettlement(done) {
            if(this.$refs.settlementForm) {
                this.$refs.settlementForm.resetFields()
                done()
            }
            // this.$refs[formName].resetFields()
            // this.settlementFormVisible = false
        },
        //清空草稿箱数据
        clearDrafts(apid) {
            let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apID: apid
            };
            return new Promise(resolve=>{
                api.postApi(this.apiVar.CleanAdBackUp, params).then((res) => {
                    if (res.data.SysCode === 200200) {
                        console.log("清除草稿箱成功");
                        resolve(1)
                    } else {
                        sessFun.messageFun("warning", "清除草稿箱失败");
                    }
                });
            })
        },
        // 编辑
        edit() {
            let apid = sessionStorage.getItem("plan_apid");
            sessionStorage.setItem("planDetail",JSON.stringify(this.planDetail))
            let session = this.sessionData;
            let info = {
                uid: session.uID,
                token: session.token,
                apid: apid,
            };
            api.postApi(this.apiVar.Advertisement+"/CheckLock", info).then(async res =>{
                if(!res.data.SysCode){
                    if(!res.data.IsLock){
                        // 意向方案
                        if(this.planDetail.planMode == 1) {
                            if(this.role=='BD') {
                                // 编辑意向小区
                                (await this.clearDrafts(apid)) && this.$router.push("./editEmptyPointPlan");
                            } else {
                                this.$router.push("./editPlan");
                            }
                        } else {
                            // 非意向方案
                            this.$router.push("./editPlanOld");
                        }
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

<style lang="scss" scoped>
.ellipsis-td {
    width: 132px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
/* 设置方案金额 */
/deep/ .settlement-dialog {
    .el-form-item {
        padding: 8px 0;
        margin: 0;
    }
    .form__line {
        margin: 16px 0;
        height: 1px;
        background: #E9E9E9;
    }
    .el-form-item__content {
        line-height: unset;
    }
    .form-item__price {
        line-height: 32px;
    }
    .el-dialog__header {
        padding: 16px 24px;
    }
    .el-dialog__body {
        padding: 0 24px;
    }
    .el-dialog__footer {
        padding: 16px 24px 24px;
    }
    .el-form-item__label {
        padding: 0;
        line-height: 32px;
    }
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
    .handleBtn--plain {
        color: #000000A6;
    }
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
    float: right;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    text-align: right;
    color: #999999;
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
#pane-second{
    margin-bottom: 32px;
}
</style>
