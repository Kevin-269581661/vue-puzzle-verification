<template>
    <div class="data_read">
        <div class="data_read_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <div>
                        <span class="box_card_title">数据总览</span>
                        <el-popover
                            placement="right"
                            width="240"
                            trigger="hover">
                        <span class="popover_span">
                            <em>社区：</em> 截止昨日全城市的社区总数<br>
                            <em>广告门：</em>截止昨天该城市社区广告门总数<br>
                            <em>上刊率：</em>截止昨天该城市点位上刊率<br>
                            <em>订单：</em>截止昨天城市订单总数<br>
                            <em>现金总额：</em>截止该城市订单实际支付金额总和<br>
                            <em>客单价：</em>现金总额/订单<br>
                            <em>广告主：</em>截止昨天城市成交的广告主总数
                        </span>
                            <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                        </el-popover>
                        <div class="box_card_title_right right_date_select total_data_date">
                            <month-range :clearable="false" :defaultDate="dateRange" @changRange="CreatDateChange"></month-range>
                        </div>
                    </div>
                </div>
                <div class="data_kind" :class="isAllCity ? 'data_kind_all_city' : ''">
                    <div class="data_box" :class="basicTotalType === '社区' ? 'box_active' : ''"
                         @click="totalActiveFun('社区')">
                        <h4>社区总数</h4>
                        <p>{{basicTotalData.resourceCount}}</p>
                    </div>
                    <div class="data_box" :class="basicTotalType === '广告门' ? 'box_active' : ''"
                         @click="totalActiveFun('广告门')">
                        <h4>媒体总数</h4>
                        <p>{{basicTotalData.advertDoorCount}}</p>
                    </div>
                    <div class="data_box" :class="basicTotalType === '广告主' ? 'box_active' : ''"
                         @click="totalActiveFun('广告主')">
                        <h4>广告主</h4>
                        <p>{{basicTotalData.advertisementCount}}</p>
                    </div>
                    <div class="data_box" :class="basicTotalType === '订单' ? 'box_active' : ''"
                         @click="totalActiveFun('订单')">
                        <h4>订单</h4>
                        <countTo
                            style="padding-right: 8px; font-size: 20px; color:rgba(44,49,60,1); font-weight: 500;"
                            :startVal="0"
                            :endVal="basicTotalData.orderCount || 0"
                            :duration="1000"
                            :decimals='0'
                        ></countTo>
                        <!-- <p>{{basicTotalData.orderCount}}</p> -->
                    </div>
                    <div class="data_box" :class="basicTotalType === '销售额' ? 'box_active' : ''"
                         @click="totalActiveFun('销售额')">
                        <h4>销售额</h4>
                        <countTo
                            style="padding-right: 8px; font-size: 20px; color:rgba(44,49,60,1); font-weight: 500;"
                            :startVal="0"
                            :endVal="basicTotalData.sale || 0"
                            :duration="500"
                            :decimals='0'
                            prefix="¥"
                        ></countTo>
                    </div>
                    <div class="data_box" :class="basicTotalType === '客单价' ? 'box_active' : ''"
                         @click="totalActiveFun('客单价')">
                        <h4>客单价</h4>
                        <countTo
                            style="padding-right: 8px; font-size: 20px; color:rgba(44,49,60,1); font-weight: 500;"
                            :startVal="0"
                            :endVal="basicTotalData.orderSale || 0"
                            :duration="500"
                            :decimals='0'
                            prefix="¥"
                        ></countTo>
                    </div>
                    <div class="data_box" :class="basicTotalType === '上刊率' ? 'box_active' : ''"
                         @click="totalActiveFun('上刊率')">
                        <h4>上刊率</h4>
                        <countTo
                            style="padding-right: 8px; font-size: 20px; color:rgba(44,49,60,1); font-weight: 500;"
                            :startVal="0"
                            :endVal="basicTotalData.publishRate || 0"
                            :duration="500"
                            :decimals='0'
                            suffix="%"
                        ></countTo>
                        <!-- <p>{{basicTotalData.publishRate}}%</p> -->
                    </div>
                </div>
                <div class="charts_warp"
                     v-if="isAllCity"
                     v-loading="totalDataBarLoading"
                     element-loading-text="玩命加载中..."
                     element-loading-background="rgba(255, 255, 255)">
                    <div class="bar_charts" id="total_data_read" ref="totalDataBar" style="height: 354px;width: 100%"></div>
                </div>
            </el-card>
        </div>
        <!--当天概况-->
        <div class="data_read_box">
            <el-card  class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">当天概况</span>
                    <span class="box_card_title_right" style="float: right; padding: 3px 0">数据更新至{{toDay}}</span>
                </div>
                <ul class="toDay_data_ul">
                    <li class="data_li">生成订单：{{basicToDayData.orderCount}}个</li>
                    <li class="data_li">预锁方案：{{basicToDayData.lockPlanCount}}个</li>
                    <li class="data_li">新建方案：{{basicToDayData.newPlanCount}}个</li>
                    <li class="data_li">导出空点：{{basicToDayData.exportLeisureCount || 0}}个</li>
                    <li class="data_li">上画点位：{{basicToDayData.publishPointCount || 0}}个</li>
                    <li class="data_li">录入小区：{{basicToDayData.newResourceCount}}个</li>
                    <li class="data_li">录入媒体：{{basicToDayData.newMediaCount}}个</li>
                    <li class="data_li">禁用点位：{{basicToDayData.forbiddenPointCount || 0}}个</li>
                </ul>
                <el-row :gutter="16">
                    <el-col :span="12">
                        <div class="bar_charts el_col_bar" id="toDay_precept"  ref="toDayPreceptBar"
                             style="height: 328px;width: 100%"
                             v-loading="toDayPreceptBarLoading"
                             element-loading-text="玩命加载中..."
                             element-loading-background="rgba(255, 255, 255)">
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="el_col_bar">
                            <ul class="table_ul">
                                <li class="table_ul_li">
                                    <el-row class="el_row_title">
                                        <el-col :span="5" style="padding-left: 8px">行为</el-col>
                                        <el-col :span="4" class="text_right">数量</el-col>
                                        <el-col :span="7" class="text_right">涉及点位(面)</el-col>
                                        <el-col :span="7" class="text_right">点位数(面·周)</el-col>
                                    </el-row>
                                </li>
                                <li class="table_ul_li" v-for="(item,index) in totalTableList">
                                    <el-row>
                                        <el-col :span="5" style="padding-left: 8px">{{item.name}}</el-col>
                                        <el-col :span="4" class="text_right">{{item.number}}</el-col>
                                        <el-col :span="7" class="text_right">{{item.ads}}</el-col>
                                        <el-col :span="7" class="text_right">{{item.adsWeek}}</el-col>
                                    </el-row>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <!--广告销售-->
        <div class="data_read_box">
            <el-card  class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">广告销售</span>
                    <div class="box_card_title_right right_date_select ad_sale_date">
                        <el-date-picker
                            v-model="adSaleMonth"
                            type="month"
                            size="small"
                            value-format="yyyy/MM"
                            format="yyyy/MM"
                            placeholder="选择月"
                            :clearable="false"
                            @change="adSaleChange">
                            <!--:picker-options="adSaleOptionsStar"-->
                        </el-date-picker>
                    </div>
                </div>
                <ul class="toDay_data_ul">
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">点位总量(面·周)</h3>
                        <p class="ad_sale_li_num">{{adSaleHeaderData.pointCount || 0}}</p>
                        <p class="ad_sale_li_text">较上个月
                            <i class="el-icon-back" v-show="adSaleHeaderData.comparePoint !== 0 && adSaleHeaderData.comparePoint !== '--'"
                               :class="adSaleHeaderData.comparePoint < 0 ? 'ad_sale_bottom_icon' : 'ad_sale_top_icon'"></i>
                            <span>{{returnAbs(adSaleHeaderData.comparePoint)}}%</span>
                        </p>
                    </li>
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">月均上刊率</h3>
                        <p class="ad_sale_li_num">{{adSaleHeaderData.monthPublishRate || 0}}%</p>
                        <p class="ad_sale_li_text">较上个月
                            <i class="el-icon-back" v-show="adSaleHeaderData.compareMonthPublish !== 0 && adSaleHeaderData.compareMonthPublish !== '--'"
                               :class="adSaleHeaderData.compareMonthPublish < 0 ? 'ad_sale_bottom_icon' : 'ad_sale_top_icon'"></i>
                            <span>{{returnAbs(adSaleHeaderData.compareMonthPublish)}}%</span>
                        </p>
                    </li>
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">当前禁用媒体数量(面)</h3>
                        <p class="ad_sale_li_num">{{adSaleHeaderData.forbiddenMediaCount || 0}}</p>
                        <p class="ad_sale_li_text"> 较上个月
                            <i class="el-icon-back" v-show="adSaleHeaderData.compareMedia !== 0 && adSaleHeaderData.compareMedia !== '--'"
                               :class="adSaleHeaderData.compareMedia < 0 ? 'ad_sale_bottom_icon' : 'ad_sale_top_icon'"></i>
                            <span>{{returnAbs(adSaleHeaderData.compareMedia)}}%</span>
                        </p>
                    </li>
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">成交订单</h3>
                        <p class="ad_sale_li_num">{{adSaleHeaderData.orderCount}}</p>
                        <p class="ad_sale_li_text"> 较上个月
                            <i class="el-icon-back" v-show="adSaleHeaderData.compareOrder !== 0 && adSaleHeaderData.compareOrder !== '--'"
                               :class="adSaleHeaderData.compareOrder < 0 ? 'ad_sale_bottom_icon' : 'ad_sale_top_icon'"></i>
                            <span>{{returnAbs(adSaleHeaderData.compareOrder)}}%</span>
                        </p>
                    </li>
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">账面销售额</h3>
                        <p class="ad_sale_li_num">¥ {{priceFormat(adSaleHeaderData.sale)}}</p>
                        <p class="ad_sale_li_text"> 较上个月
                            <i class="el-icon-back" v-show="adSaleHeaderData.compareSale !== 0 && adSaleHeaderData.compareSale !== '--'"
                               :class="adSaleHeaderData.compareSale < 0 ? 'ad_sale_bottom_icon' : 'ad_sale_top_icon'"></i>
                            <span>{{returnAbs(adSaleHeaderData.compareSale)}}%</span>
                        </p>
                    </li>
                </ul>
                <el-row :gutter="16">
                    <el-col :span="12">
                        <div class="bar_charts el_col_bar" id="ad_sale_ads" ref="adSaleBar"
                             style="height: 328px;width: 100%"
                             v-loading="adSaleBarLoading"
                             element-loading-text="玩命加载中..."
                             element-loading-background="rgba(255, 255, 255)"></div>
                    </el-col>
                    <el-col :span="12" class="el_col_charts">
                        <div class="select_box">
                            <el-select v-model="adSaleActiveWeek" size="small" placeholder="请选择" @change="adSaleChangeWeek">
                                <el-option
                                    v-for="item in adSaleWeekSelectList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="el_col_bar"
                             v-loading="adSalePieLoading"
                             element-loading-text="玩命加载中..."
                             element-loading-background="rgba(255, 255, 255)">
                            <div class="bar_charts" id="ad_sale_media" ref="adSalePie" style="height: 328px;width: 100%"></div>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <!--广告库存-->
        <div class="data_read_box">
            <el-card  class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">广告库存</span>
                    <span class="box_card_title_right" style="float: right; padding: 3px 0">数据更新至{{toDay}}</span>
                </div>
                <el-row :gutter="16">
                    <el-col :span="12" class="el_col_charts">
                        <div class="select_box">
                            <el-select v-model="adInventoriedType" size="small" placeholder="请选择" @change="getAdInventoriedData">
                                <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <p class="price_box">
                            ¥ {{priceFormat(adInventoriedDate.estimateSale) || 0}}
                            <el-popover
                                placement="top"
                                trigger="hover">
                                <div class="popover_span">
                                    假设单价为¥1000面/周
                                </div>
                                <span slot="reference">估算销售额 <i class="el-icon-warning-outline"></i></span>
                            </el-popover>
                        </p>
                        <div class="el_col_bar"
                            v-loading="adInventoriedLoading"
                            element-loading-text="玩命加载中..."
                            element-loading-background="rgba(255, 255, 255)">
                            <div class="bar_charts" id="ad_inventoried" ref="adInventoriedPie" style="height: 328px;width: 100%"></div>
                        </div>
                    </el-col>
                    <el-col :span="12" class="el_col_charts">
                        <div class="select_box">
                            <el-select v-model="adInventoryType" size="small" placeholder="请选择" @change="getAdInventoryData">
                                <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <p class="price_box">
                            ¥ {{priceFormat(adInventoryDate.estimateSale) || 0}}
                            <el-popover
                                placement="top"
                                trigger="hover">
                                <div class="popover_span">
                                    假设单价为¥1000面/周
                                </div>
                                <span slot="reference">估算销售额 <i class="el-icon-warning-outline"></i></span>
                            </el-popover>
                        </p>
                        <div class="el_col_bar"
                             v-loading="adInventoryLoading"
                             element-loading-text="玩命加载中..."
                             element-loading-background="rgba(255, 255, 255)">
                            <div class="bar_charts" id="ad_inventory_future" ref="adInventoryPie" style="height: 328px;width: 100%"></div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" class="ad_inventory_bottom ad_inventory_bottom_left">
                        过去：{{adInventoriedDate.starDate}} ~ {{adInventoriedDate.endDate}} 合计 {{adInventoriedDate.weekNum}}周
                    </el-col>
                    <el-col :span="12" class="ad_inventory_bottom ad_inventory_bottom_right">
                        未来：{{adInventoryDate.starDate}} ~ {{adInventoryDate.endDate}} 合计{{adInventoryDate.weekNum - adInventoriedDate.weekNum}}周
                    </el-col>
                </el-row>
            </el-card>
        </div>
    </div>
</template>

<script>
    import api from '../../../api/api';
    import commaFormat from '../../../commonFun/commaFormat';
    import timeFormat from '../../../commonFun/timeFormat';
    import sessFun from '../../../commonFun/sessFun';
    import countTo from "vue-count-to";
    import monthRange from '../../common/components/monthRange.vue';
    export default {
        name: "dataRead",
        components:{
            countTo,
            monthRange
        },
        data(){
            return{
                // directNameList:['北京亲邻众联','上海多邻网络','广州亲粤邻','深圳亲邻交互','成都亲邻','重庆亲邻','天津亲邻众联'],
                // 自定义颜色
                colorList: ['#2FC25B','#1890FF','#FACC14','#36cbcb'],
                isAllCity: true,
                toDay: '',
                timeData:{
                    maxYear: '',
                },
                isGetData: false,
                // 前一次-全局选择的城市
                oldSelectCity: '0',
                basicTotalType: '社区',
                // 数据总览
                basicTotalData: {
                    resourceCount: 0,
                    advertDoorCount: 0,
                    orderCount: 0,
                    sale: 0,
                    orderSale: 0,
                    advertisementCount: 0,
                    publishRate: 0,
                },
                totalDataBarLoading: true,
                // 接口原数据
                basicTotalBarData:[],
                // 数据总览 - 柱状图数据
                basicTotalBarDataShow:[],
                // 选择的月份区间
                dateRange: [],
                totalDataBarEcharts: '',
                // 当天概况头部基础数据
                basicToDayData:{
                    orderCount: 0,
                    lockPlanCount: 0,
                    newPlanCount: 0,
                    exportLeisureCount: 0,
                    publishPointCount: 0,
                    newResourceCount: 0,
                    newMediaCount: 0,
                    forbiddenPointCount: 0,
                },
                // 图表
                toDayPreceptBarLoading: true,
                toDayPreceptBarEcharts: '',
                // 当天概况 - 表格数据
                totalTableList: [
                    {
                        name:'新建方案',
                        number: 0,
                        ads: 0,
                        adsWeek: 0,
                    },
                    {
                        name:'预锁方案',
                        number: 0,
                        ads: 0,
                        adsWeek: 0,
                    },
                    {
                        name:'发布订单',
                        number: 0,
                        ads: 0,
                        adsWeek: 0,
                    },
                ],
                // 当天概况 - 柱状图 数据
                toDayPreceptBarData: [
                    ['product', '方案/订单数(个)', '点位数(面)', '点位数(面·周)'],
                    ['新建方案', 0, 0, 0],
                    ['预锁方案', 0, 0, 0],
                    ['生成订单', 0, 0, 0],
                ],
                /*  广告销售  */
                adSaleMonth: '',
                AdSaleHeadData:{},
                adSaleHeaderData:{
                    pointCount: 0,
                    monthPublishRate: 0,
                    forbiddenMediaCount: 0,
                    orderCount: 0,
                    sale: 0
                },
                // 图表接口原数据
                adSaleList:'',
                adSaleBarEcharts: '',
                // 广告销售 - 柱状图数据
                adSaleBarLoading: true,
                adSaleData: {
                    weekList:[],
                    beenSold: [],
                    unSold: [],
                    adsDisabled: [],
                    publishRate: [],
                    totalNum: 0,
                },
                // 广告销售 - 饼状图
                adSalePieLoading: true,     // 加载状态
                mediaSaleData:{
                    title: ['空刊数(面)','在刊媒体(面)','禁用媒体(面)'],
                    data:[
                        {value:0, name:'空刊数(面)'},
                        {value:0, name:'在刊媒体(面)'},
                        {value:0, name:'禁用媒体(面)'},
                    ]
                },
                // 下拉选中
                adSaleActiveWeek: '0',
                // 下拉选项 - 周
                adSaleWeekSelectList: [],
                // 广告库存
                typeList:[
                    {
                        value:'0',
                        label:'按面/天'
                    },
                    {
                        value:'1',
                        label:'按面/周'
                    }
                ],
                // 左侧
                adInventoriedLoading: true,
                adInventoriedPieEcharts: '',
                beenWeekOfSurfaceData: {
                    title:['已售','过期','禁用'],
                    data:[
                        {value:2350, name:'已售'},
                        {value:2170, name:'过期'},
                        {value:334, name:'禁用'},
                    ]
                },
                adInventoriedDate:{ starDate: '',endDate: '',weekNum: 0},
                adInventoriedType: '1',
                // 右侧
                adInventoryLoading: true,
                // 未来
                adInventoryPieEcharts: '',
                futureWeekOfSurfaceData: {
                    title:['已售','可售'],
                    data:[
                        {value:0, name:'已售'},
                        {value:0, name:'可售'},
                    ]
                },
                adInventoryDate: {starDate: '', endDate: '', weekNum: 0},
                adInventoryType: '1',
                // 机会挖掘
                // chanceFindPieLoading: true,
                // 用户总数
                // chanceFindUserNum: 0,
                // chanceFindDate: [],
                // 机会挖掘 - 饼状图
                // chanceFindPieEcharts: '',
                /* chanceFindPieData: {
                    title: ['初购客户', '复购客户', '未合作','沉默客户'],
                    data: [
                        {value: 0, name: '生成方案'},
                        {value: 0, name: '生成订单'},
                        {value: 0, name: '未合作'},
                        {value: 0, name: '沉默客户'}
                    ]
                }, */
                // 机会挖掘表格
                // chanceFindTable:[],
                // chanceFindTableLoading: true,
                // 饼状图的lengt的itemStyle富文本
                itemStyle: {
                    rich:{
                        a:{
                            fontSize:14,
                            color:"rgba(0,0,0,0.65)",
                            width: 38,
                        },
                        b:{
                            fontSize:14,
                            color:"rgba(0,0,0,0.35)",
                            padding:10
                        },
                        c:{
                            fontSize:14,
                            color:"rgba(0,0,0,0.65)",
                            padding: 8
                        },
                        d:{
                            fontSize:14,
                            color:"rgba(0,0,0,0.65)",
                            padding: 8
                        }
                    }
                },
                totalDataOptionsStar: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.parse('2015/01/01') || time.getTime() > Date.parse(this.timeData.maxYear)
                    }
                },
            }
        },
        props:{
            sessionData: {
                type: Object,
                required: true,
            },
            selectCity: {
                type: String,
                required: true,
            },
            activeName:{
                type:String,
                required: true
            },
            directNameList:{
                type: Array,
                required: true,
            },
            headerCityList:{
                type: Array,
                required: true,
            }
        },
        watch: {
            sessionData(newVal, oldVal) {
                console.log('newVal', newVal, 'oldVal', oldVal)
                this.sessionData = newVal
            },
            selectCity(newVal, oldVal) {
                this.selectCity = newVal
                if (this.selectCity === '0') {
                    this.isAllCity = true
                } else {
                    this.isAllCity = false
                }
                if (this.activeName === 'first') {
                    this.getDataRead();
                } else {
                    if (this.selectCity != this.oldSelectCity) {
                        this.isGetData = false
                    } else {
                        this.isGetData = true
                    }
                }
            },
            activeName(newVal, oldVal) {
                console.log('数据概览newVal', newVal, 'oldVal', oldVal)
                // this.activeName = newVal
                if (!this.isGetData) {
                    console.log('统一调用接口', this.isGetData)
                    // 统一调用接口
                    this.getDataRead()
                    // this.isGetData = true
                } else {
                    // 数据总览
                    this.initTotalDataBar();
                    // 当天概况
                    this.initToDayPreceptBar();
                    // 广告销售 - 柱状图
                    this.initAdSaleBar();
                    // 广告销售  - 饼状图
                    this.initAdSalePie();
                    // 广告库存 - 左侧
                    this.initAdInventoriedPie();
                    // 广告库存 - 右侧
                    this.initAdInventoryPie();
                    // 机会挖掘
                    // this.initChanceFindPie();
                }
            }
        },
        mounted(){
            if (this.sessionData.ascType > 0) {
                this.isAllCity = false
            } else {
                this.isAllCity = true
            }
            this.echartsListener();
            this.setTime();
        },
        methods:{
            // 统一调用接口
            getDataRead(){
                // 数据总览
                this.getTotalData();
                // 当天概况
                this.getToDayHeaderData();
                this.getToDayPreceptData();
                // 广告销售 - 顶部数据接口
                this.getAdSaleHeaderData();
                // 广告销售 - 饼状图
                this.getAdSaleData();
                // 广告库存 - 左侧
                this.getAdInventoriedData();
                // 广告库存 - 右侧
                this.getAdInventoryData();
                this.oldSelectCity = this.selectCity
                this.adSaleActiveWeek = '0'
                this.isGetData = true
            },
            // 统一监听
            echartsListener(){
                window.addEventListener("resize", ()=> {
                    // 数据总览
                    this.totalDataBarEcharts && this.totalDataBarEcharts.resize();
                    // 当天概况
                    this.toDayPreceptBarEcharts && this.toDayPreceptBarEcharts.resize();
                    // 广告销售
                    this.adSaleBarEcharts && this.adSaleBarEcharts.resize();
                    this.adSalePieEcharts && this.adSalePieEcharts.resize();
                    // 广告库存
                    this.adInventoriedPieEcharts && this.adInventoriedPieEcharts.resize();
                    this.adInventoryPieEcharts && this.adInventoryPieEcharts.resize();
                    // 机会挖掘
                    // this.chanceFindPieEcharts && this.chanceFindPieEcharts.resize();
                });
            },
            // 设置初始时间
            setTime() {
                let endTime = timeFormat.returnMonthCount(0,'/');
                this.adSaleMonth = endTime.substring(0,7);
                this.toDay = endTime;
                this.dateRange = [new Date(), new Date()];
                // 设置机会挖掘默认时间
                // let starTime = timeFormat.returnDayCount(-30,'/')
                // this.chanceFindDate = [starTime, endTime]
                // console.log('starTime',starTime,'endTime',endTime)
                this.timeData.maxYear = timeFormat.getSpecifiedDateStr(this.toDay,-12)
            },
            /*  数据总量  */
            CreatDateChange(params, dateRange) {
                this.dateRange = dateRange
                this.getTotalData()
            },
            // 点击的数据类型
            totalActiveFun(type) {
                if (this.isAllCity) {
                    this.basicTotalType = type
                    this.setTotalDataBar()
                }
            },
            // 数据总览-接口
            getTotalData(){
                console.log('this.dateRange', this.dateRange)
                this.totalDataBarLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: timeFormat.beginOfMonth(this.dateRange[0]),
                    endDate: timeFormat.endOfMonth(this.dateRange[1]),
                    asrIds: this.returnAsrID()
                }
                api.getApi(this.apiVar.report + '/api/v2/getOverview', params).then(res => {
                    console.log('数据总总览-表头接口', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        this.basicTotalData = {
                            resourceCount: dataObj.resourceCount,
                            advertDoorCount: dataObj.advertDoorCount,
                            orderCount: dataObj.orderCount,
                            sale: dataObj.sale,
                            orderSale: dataObj.orderSale,
                            advertisementCount: dataObj.advertisementCount,
                            publishRate: dataObj.publishRate ?  Math.floor(dataObj.publishRate * 10000)/100 : 0,
                        }
                        this.basicTotalBarData = JSON.parse(JSON.stringify(dataObj.asrList))
                        console.log('basicTotalData',this.basicTotalData)
                        this.setTotalDataBar()
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 设置显示
            setTotalDataBar(){
                this.totalDataBarLoading = true
                let arr = []
                for (let key of this.basicTotalBarData) {
                    switch (this.basicTotalType) {
                        case '社区':
                            arr.push(key.resourceCount)
                            break;
                        case '广告门':
                            arr.push(key.advertDoorCount)
                            break;
                        case '上刊率':
                            arr.push(key.publishRate ? Math.floor(key.publishRate * 10000) / 100 : 0)
                            break;
                        case '订单':
                            arr.push(key.orderCount)
                            break;
                        case '销售额':
                            arr.push(key.sale)
                            break;
                        case '客单价':
                            arr.push(key.orderSale)
                            break;
                        case '广告主':
                            arr.push(key.advertisementCount)
                            break;
                    }
                }
                this.basicTotalBarDataShow = arr
                console.log('this.basicTotalBarDataShow', this.basicTotalBarDataShow)
                this.initTotalDataBar()
            },
            // 数据总览 头部柱状图
            initTotalDataBar(){
                if(!this.isAllCity){
                    return
                }
                if(this.totalDataBarEcharts){
                    this.totalDataBarEcharts.dispose()
                }
                this.totalDataBarEcharts = echarts.init(this.$refs.totalDataBar);
                this.totalDataBarEcharts.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                            shadowStyle: {
                                shadowColor: '#f5f5f5'
                            }
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: (params)=> {
                            let val = 0
                            if (this.basicTotalType === '上刊率') {
                                val = params[0].data + '%'
                            } else if (this.basicTotalType === '销售额' || this.basicTotalType === '客单价') {
                                val = this.priceFormat(params[0].data)
                            } else {
                                val = params[0].data
                            }
                            return '<p class="echarts_tooltip_title">' + '<span>' + params[0].name + '</span>' + '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + this.basicTotalType +
                                '</span>' + val + '</p>'
                        },
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        x: 100,     //控制x轴文字与底部的距离
                        y2: 200,    // y2可以控制倾斜的文字与最右边的距离，放置倾斜的文字超过显示区域
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.directNameList,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                //坐标轴线条相关设置(颜色等)
                                lineStyle: {
                                    color: "#E8E8E8"
                                }
                            },
                            axisLabel: {
                                //坐标轴刻度标签
                                margin: 7, //刻度标签与轴线之间的距离
                                interval: 0,    //强制文字产生间隔
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C" //坐标轴刻度文字的颜色
                                },
                                formatter: function(val) {
                                    let strs = val.split(''); //字符串数组
                                    let str = ''
                                    for(let i = 0, s; s = strs[i++];) { //遍历字符串数组
                                        str += s;
                                        if(!(i % 8)) str += '\n'; //按需要求余
                                    }
                                    return str
                                }
                            },
                        }
                    ],
                    yAxis: this.basicTotalType === 'rate' ?
                        [
                            {          //纵轴标尺固定
                                type: 'value',
                                // scale: true,
                                max: 100,
                                min: 0,
                                boundaryGap: [0.2, 0.2],
                                axisLine: {
                                    //坐标轴线条相关设置(颜色等)
                                    lineStyle: {
                                        color: "#E8E8E8"
                                    }
                                },
                                axisLabel: {
                                    formatter: '{value}%',
                                    //坐标轴刻度标签
                                    margin: 7, //刻度标签与轴线之间的距离
                                    textStyle: {
                                        fontFamily: "DINPro-Regular",
                                        color: "#2C313C" //坐标轴刻度文字的颜色
                                    }
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: "#E8E8E8",
                                        type: "dashed"
                                    }
                                }
                            }
                        ]:
                        [
                            {
                                type: 'value',
                                axisLine: {
                                    //坐标轴线条相关设置(颜色等)
                                    lineStyle: {
                                        color: "#E8E8E8"
                                    }
                                },
                                axisLabel: {
                                    //坐标轴刻度标签
                                    margin: 7, //刻度标签与轴线之间的距离
                                    textStyle: {
                                        fontFamily: "DINPro-Regular",
                                        color: "#2C313C" //坐标轴刻度文字的颜色
                                    }
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: "#E8E8E8",
                                        type: "dashed"
                                    }
                                }
                            }
                        ],
                    series: [
                        {
                            color: '#4AA6FC',
                            name: '',
                            type: 'bar',
                            barWidth: '18%',
                            data: this.basicTotalBarDataShow
                        }
                    ]
                });
                this.totalDataBarLoading = false
            },
            /*  当天概况  */
            getToDayHeaderData(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.toDay,
                    endDate: timeFormat.returnDayCount(1,'/'),
                    asrIds: this.returnAsrID()
                }
                api.getApi(this.apiVar.report + '/api/v2/getSurvey', params).then(res => {
                    console.log('当天概况-表头接口', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        this.basicToDayData = {
                                orderCount: dataObj.orderCount,
                                lockPlanCount: dataObj.lockPlanCount,
                                newPlanCount: dataObj.newPlanCount,
                                exportLeisureCount: dataObj.exportLeisureCount,
                                publishPointCount: dataObj.publishPointCount,
                                newResourceCount: dataObj.newResourceCount,
                                newMediaCount: dataObj.newMediaCount,
                                forbiddenPointCount: dataObj.forbiddenPointCount,
                        }
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 柱状图接口
            getToDayPreceptData(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.toDay,
                    endDate: timeFormat.returnDayCount(1,'/'),
                    asrIds: this.returnAsrID()
                }
                api.getApi(this.apiVar.report + '/api/v2/getBehaviorInfo', params).then(res => {
                    console.log('当天概况-图表接口', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        this.setToDatyPreceptData(dataObj)
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 设置数据
            setToDatyPreceptData(dataObj){
                let tableList = []
                let barArr = []
                for (let key in dataObj) {
                    // 右侧图表
                    // x轴刻度名称、方案订单数、点位数、点位面周
                    barArr = ['', dataObj[key].count, dataObj[key].adsCount, dataObj[key].adsWeekCount]
                    // 左侧list
                    let obj = {
                        name: '',
                        number: dataObj[key].count,
                        ads: dataObj[key].adsCount,
                        adsWeek: dataObj[key].adsWeekCount,
                    }
                    if (key === 'createPlanInfo') {
                        barArr[0] = '创建方案'
                        this.toDayPreceptBarData[1] = barArr
                        obj.name = '创建方案'
                    } else if (key === 'lockPlanInfo') {
                        barArr[0] = '预锁方案'
                        this.toDayPreceptBarData[2] = barArr
                        obj.name = '预锁方案'
                    } else if (key === 'orderInfo') {
                        barArr[0] = '生成订单'
                        this.toDayPreceptBarData[3] = barArr
                        obj.name = '生成订单'
                    }
                    tableList.push(obj)
                }
                this.totalTableList = tableList
                console.log('tableList',tableList,'toDayPreceptBarData',this.toDayPreceptBarData)
                this.initToDayPreceptBar()
            },
            initToDayPreceptBar(){
                if(this.toDayPreceptBarEcharts){
                    this.toDayPreceptBarEcharts.dispose()
                }
                this.toDayPreceptBarEcharts = echarts.init(this.$refs.toDayPreceptBar);
                console.log('toDayPreceptBarEcharts',this.toDayPreceptBarEcharts)
                this.toDayPreceptBarEcharts.setOption({
                    legend: {
                        top: 'bottom',
                        left: 'center',
                        // data: ['方案/订单数(个)','点位数(面)','点位数(面·周)']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {              // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow',         // 默认为直线，可选为：'line' | 'shadow'
                            shadowStyle: {
                                shadowColor: '#f5f5f5'
                            }
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: function (params) {
                            let title = '';
                            let arr = [];
                            for (let i = 0; i < params.length; i++) {
                                title = '<p class="echarts_tooltip_title">' +
                                    '<span>' +  params[i].name + '</span>' + '<span>' + '数值' + '</span>' + '</p>' + '<br/>'
                                let data = '<p class="echarts_tooltip_content">' +
                                    '<span>'+ '<i class="echarts_tooltip_i" style="background:'+ params[i].color +'">' + '</i>' +
                                    params[i].seriesName + '</span>' + params[i].value[params[i].seriesIndex + 1] + '</p>'
                                arr.push(data)
                            }
                            let tooltip = arr.join('')
                            return title + tooltip
                        },
                    },
                    dataset: {
                        source: this.toDayPreceptBarData
                    },
                    grid: {
                        top: '10%',
                        left: '5%',
                        right: '5%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLine: {
                                //坐标轴线条相关设置(颜色等)
                                lineStyle: {
                                    color: "#E8E8E8"
                                }
                            },
                            axisLabel: {
                                //坐标轴刻度标签
                                margin: 7, //刻度标签与轴线之间的距离
                                interval: 0,    //强制文字产生间隔
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C" //坐标轴刻度文字的颜色
                                }
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            // type: 'log',
                            // type: 'category',
                            axisLine: {
                                show:false,
                                //坐标轴线条相关设置(颜色等)
                                lineStyle: {
                                    color: "#E8E8E8"
                                }
                            },
                            axisLabel: {
                                show:false,
                                //坐标轴刻度标签
                                margin: 7, //刻度标签与轴线之间的距离
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C" //坐标轴刻度文字的颜色
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: "#E8E8E8",
                                    type: "dashed"
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            barWidth: '15%',
                            itemStyle: {
                                normal:{
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#999',
                                            fontSize: 12
                                        }
                                    },
                                    color: '#FAD237'
                                },
                            }
                        },
                        {
                            type: 'bar',
                            barWidth: '15%',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#999',
                                            fontSize: 12
                                        }
                                    },
                                    color: '#4DCA73'
                                }
                            }
                        },
                        {
                            type: 'bar',
                            barWidth: '15%',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,
                                        position: 'top',
                                        textStyle: {
                                            color: '#999',
                                            fontSize: 12
                                        }
                                    },
                                    color: '#399FFF'
                                }
                            }
                        }
                    ]
                })
                this.toDayPreceptBarLoading = false
            },
            /*  广告销售  */
            // 月份选择
            adSaleChange() {
                console.log('this.adSaleMonth', this.adSaleMonth)
                this.adSaleActiveWeek = '0'
                this.getAdSaleHeaderData()
                this.getAdSaleData()
            },
            // 周选择
            adSaleChangeWeek() {
                console.log('周选择this.adSaleActiveWeek', this.adSaleActiveWeek)
                this.setAdSalePieData(this.adSaleList[this.adSaleActiveWeek])
            },
            // 顶部接口
            getAdSaleHeaderData(){
                let monthDayNum = timeFormat.getCurrMonthDays(this.adSaleMonth + '/01')
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.adSaleMonth + '/01',
                    endDate: this.adSaleMonth + '/' + monthDayNum,
                    asrIds: this.returnAsrID()
                }
                api.getApi(this.apiVar.report + '/api/v2/getAdvertSales', params).then(res => {
                    console.log('广告销售-顶部数据接口res', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        this.setAdSaleHeaderData(dataObj)
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 设置头部数据
            setAdSaleHeaderData(dataObj) {
                let {curMonthInfo,preMonthInfo} = dataObj
                this.adSaleHeaderData = {
                    // 点位总量(面·周)
                    pointCount: curMonthInfo.pointCount,
                    comparePoint: preMonthInfo.pointCount ? this.keepTwoDecimal((curMonthInfo.pointCount - preMonthInfo.pointCount) / preMonthInfo.pointCount * 100) : '--',
                    // 月均上刊率
                    monthPublishRate: curMonthInfo.monthPublishRate ? Math.floor(curMonthInfo.monthPublishRate * 10000) / 100 : 0,
                    compareMonthPublish:  preMonthInfo.monthPublishRate ? this.keepTwoDecimal((curMonthInfo.monthPublishRate - preMonthInfo.monthPublishRate) / preMonthInfo.monthPublishRate * 100) : '--',
                    // 当前禁用媒体数量(面)
                    forbiddenMediaCount: curMonthInfo.forbiddenAdsCount,
                    compareMedia:  preMonthInfo.forbiddenAdsCount ? this.keepTwoDecimal((curMonthInfo.forbiddenAdsCount - preMonthInfo.forbiddenAdsCount) / preMonthInfo.forbiddenAdsCount * 100) : '--',
                    // 成交订单
                    orderCount: curMonthInfo.orderCount,
                    compareOrder: preMonthInfo.orderCount ? this.keepTwoDecimal((curMonthInfo.orderCount - preMonthInfo.orderCount) / preMonthInfo.orderCount * 100) : '--',
                    // 账面销售额
                    sale: curMonthInfo.sale,
                    compareSale: preMonthInfo.sale ? this.keepTwoDecimal((curMonthInfo.sale - preMonthInfo.sale) / preMonthInfo.sale * 100) : '--',
                }
                console.log('this.adSaleHeaderData',this.adSaleHeaderData)
            },
            getAdSaleData(){
                this.adSaleBarLoading = true
                this.adSalePieLoading = true
                let monthDayNum = timeFormat.getCurrMonthDays(this.adSaleMonth + '-01')
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.adSaleMonth + '/01',
                    endDate: this.adSaleMonth + '/' + monthDayNum,
                    asrIds: this.returnAsrID()
                }
                api.getApi(this.apiVar.report + '/api/v2/getAdsInfoByWeek', params).then(res => {
                    console.log('广告销售-左侧数据接口res', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        this.adSaleList = res.data.data
                        this.setAdSalePieData(this.adSaleList[0])
                        this.adSaleWeekSelectList = this.setWeekSelectList(this.adSaleList)
                        this.setAdSaleBarData()
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 设置广告销售图表数据
            setAdSaleBarData(){
                console.log('设置广告销售图表数据',this.adSaleList)
                let weekList = []
                for (let key of this.adSaleWeekSelectList) {
                    weekList.push(key.label+ '('+ key.time)
                }
                let beenSold = []
                let unSold = []
                let adsDisabled = []
                let publishRate = []
                let totalNum = 0
                for (let aKey of this.adSaleList) {
                    let sum = aKey.soldAdsCount + aKey.unsoldAdsCount + (aKey.forbiddenAdsCount || 0)
                    if(sum > totalNum){
                        totalNum = sum
                    }
                    beenSold.push(aKey.soldAdsCount)
                    unSold.push(aKey.unsoldAdsCount)
                    adsDisabled.push(aKey.forbiddenAdsCount || 0)
                    publishRate.push(Math.floor(aKey.publishRate * 10000) / 100)
                }
                // 周
                this.adSaleData.weekList = JSON.parse(JSON.stringify(weekList))
                // 已售
                this.adSaleData.beenSold = JSON.parse(JSON.stringify(beenSold))
                // 未售点位
                this.adSaleData.unSold = JSON.parse(JSON.stringify(unSold))
                // 禁用点位
                this.adSaleData.adsDisabled = JSON.parse(JSON.stringify(adsDisabled))
                // 上刊率
                this.adSaleData.publishRate = publishRate
                // this.adSaleData.totalNum = parseInt(totalNum * 1.4)
                // 设置最大值
                totalNum = parseInt(totalNum * 1.5).toString()
                let maxNum = totalNum.substring(0, 2)
                for (let i = 0; i < totalNum.length - 2; i++) {
                    maxNum += '0'
                }
                this.adSaleData.totalNum = maxNum
                console.log('左侧柱状图',this.adSaleData,totalNum,maxNum)
                this.initAdSaleBar();
            },
            // 设置右侧饼状图数据
            setAdSalePieData(obj){
                this.adSalePieLoading = true
                let pieArr = []
                for (let key in obj) {
                    if (key == 'unsoldAdsCount') {
                        pieArr[0] = {value: obj[key] || 0, name: '空刊数(面)'}
                    } else if (key == 'soldAdsCount') {
                        pieArr[1] = {value: obj[key] || 0, name: '在刊媒体(面)'}
                    } else if (key == 'forbiddenAdsCount') {
                        pieArr[2] = {value: obj[key] || 0, name: '禁用媒体(面)'}
                    }
                }
                console.log('pieArr',pieArr)
                this.mediaSaleData.data = pieArr
                this.initAdSalePie()
            },
            // 广告销售 - 左侧柱状图
            initAdSaleBar() {
                if(this.adSaleBarEcharts){
                    this.adSaleBarEcharts.dispose()
                }
                this.adSaleBarEcharts = echarts.init(this.$refs.adSaleBar);
                let option =  {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                            shadowStyle: {
                                shadowColor: '#f5f5f5'
                            }
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: function (params) {
                            let title = '';
                            let arr = [];
                            let total = params[1].value + params[2].value + params[3].value
                            for (let i = 0; i < params.length; i++) {
                                title = '<p class="echarts_tooltip_title">' +
                                    '<span>' +  params[i].name + '</span>' + '<span>' + '数值' + '</span>' + '</p>' + '<br/>'
                                let data = '<p class="echarts_tooltip_content">' +
                                    '<span>'+ '<i class="echarts_tooltip_i" style="background:'+ params[i].color +'">' + '</i>' +
                                    params[i].seriesName + '</span>' +  (params[i].seriesName === '周在刊率' ? (params[i].value + '%') : params[i].seriesName === "合计" ? total : params[i].value)+ '</p>'
                                arr.push(data)
                            }
                            let tooltip = arr.join('')
                            return title + tooltip
                        },
                    },
                    grid: {
                        top: '8%',
                        left: '5%',
                        right: '5%',
                        bottom: '13%',
                        containLabel: true
                    },
                    legend: {
                        bottom: '3%',
                        left: 'center',
                        data: ['禁用点位','已售点位','未售点位','周在刊率']
                    },
                    xAxis: {
                        type: 'category',
                        data: this.adSaleData.weekList,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            //坐标轴刻度标签
                            margin: 7, //刻度标签与轴线之间的距离
                            interval: 0,    //强制文字产生间隔
                            textStyle: {
                                fontFamily: "DINPro-Regular",
                                color: "#2C313C" //坐标轴刻度文字的颜色
                            },
                            formatter: function(val) {
                                // 字符串数组
                                let strs = val.split('(');
                                let str = strs[0] + '\n' + strs[1]
                                return str
                            }
                        },
                    },
                    yAxis: [
                        {
                            type: 'value',
                            max: this.adSaleData.totalNum,
                            interval: Math.ceil(this.adSaleData.totalNum / 5),
                            splitNumber: 5,
                            axisLine: {
                                // show:false,
                                //坐标轴线条相关设置(颜色等)
                                lineStyle: {
                                    color: "#E8E8E8"
                                }
                            },
                            axisLabel: {
                                // show:false,
                                //坐标轴刻度标签
                                margin: 7, //刻度标签与轴线之间的距离
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C" //坐标轴刻度文字的颜色
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: "#E8E8E8",
                                    type: "dashed"
                                }
                            }
                        },
                        {
                            type: 'value',
                            min: -400,
                            max: 100,
                            interval: 100,
                            splitNumber: 5,
                            show:false,
                            axisLine: {
                                //坐标轴线条相关设置(颜色等)
                                show:false,
                                lineStyle: {
                                    color: "rgba(0,0,0,0)"
                                }
                            },
                            axisLabel: {
                                show:false,
                                //坐标轴刻度标签
                                margin: 7, //刻度标签与轴线之间的距离
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C" //坐标轴刻度文字的颜色
                                },
                                formatter: '{value} %'
                            },
                            splitLine: {
                                show: false,
                            }
                        }
                    ],
                    series: [
                        {
                            name:'周在刊率',
                            type:'line',
                            yAxisIndex: 1,
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,//是否展示
                                        textStyle: {
                                            color: '#666',
                                            fontSize: 12
                                        },
                                        formatter: (params)=>{
                                            return params.value + '%'
                                        }
                                    },
                                    color: '#1890FF'
                                },
                            },
                            data: this.adSaleData.publishRate
                        },
                        {
                            name:'禁用点位',
                            type:'bar',
                            barWidth: '30%',
                            stack:'xxx',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,//是否展示
                                        formatter: (num) => {
                                            if (this.adSaleData.totalNum) {
                                                if ((num.value / this.adSaleData.totalNum) < 0.029) {
                                                    return ''
                                                }
                                            }
                                        }
                                    },
                                    color: this.colorList[2]
                                }
                            },
                            data: this.adSaleData.adsDisabled
                        },
                        {
                            name:'已售点位',
                            type:'bar',
                            barWidth: '30%',
                            stack:'xxx',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,//是否展示
                                        formatter: (num) => {
                                            if (this.adSaleData.totalNum) {
                                                if ((num.value / this.adSaleData.totalNum) < 0.029) {
                                                    return ''
                                                }
                                            }
                                        }
                                    },
                                    color: this.colorList[1]
                                }
                            },
                            data: this.adSaleData.beenSold
                        },
                        {
                            name:'未售点位',
                            type:'bar',
                            barWidth: '30%',
                            stack:'xxx',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,// 是否展示
                                        formatter: (num) => {
                                            if (this.adSaleData.totalNum) {
                                                if ((num.value / this.adSaleData.totalNum) < 0.029) {
                                                    return ''
                                                }
                                            }
                                        }
                                    },
                                    color: this.colorList[0]
                                }
                            },
                            data: this.adSaleData.unSold
                        },
                        {
                            name:'合计',
                            type:'bar',
                            stack:'xxx',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: '#666'
                                    },
                                    formatter:''
                                }
                            },
                            //思路一：给series集合末尾多加一栏用于展示合计，但是值都是0；
                            // 缺点：必须根据xAxis的data生成一组为空的数据，且tooltip不能加trigger: 'axis',这个条件，不然会展示合计：0
                            data:[0,0,0,0,0,0]
                        }
                    ]
                };
                let series = option["series"];
                let totalFun = function (params) {
                    let total = 0;
                    for (let i = 1, l = series.length; i < l; i++) {
                        total += series[i].data[params.dataIndex]
                    }
                    return total
                }
                // 加载页面时候替换最后一个series的formatter
                series[series.length-1]["label"]["normal"]["formatter"] = totalFun
                // 使用刚指定的配置项和数据显示图表。
                this.adSaleBarEcharts.setOption(option);
                this.adSaleBarLoading = false
            },
            // 广告销售 - 右侧饼状图
            initAdSalePie() {
                if(this.adSalePieEcharts){
                    this.adSalePieEcharts.dispose()
                }
                this.adSalePieEcharts = echarts.init(this.$refs.adSalePie)
                let total = 0
                for(let key of this.mediaSaleData.data){
                    total += key.value
                }
                console.log('total',total)
                this.adSalePieEcharts.setOption({
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p class="echarts_tooltip_title">' + '<span>' + params.name + '</span>' + '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' + '数值' + '</span>' + params.value + '</p>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' +
                                '占比' + '</span>' + params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    legend: {
                        orient: 'vertical',
                        left: '3%',
                        top:"30%",
                        itemGap: 20,
                        icon:'circle',
                        itemWidth: 8,
                        itemHeight: 8,
                        data: this.mediaSaleData.title,
                        formatter: (name)=> {
                            let value;
                            let precent;
                            for(let key of this.mediaSaleData.data){
                                if (key.name == name) {
                                    precent = (total ? parseFloat((key.value / total) * 100).toFixed(2) : 0) + '%'
                                    value = key.value
                                }
                            }
                            let arr = ["{a|" + name + "}","{b|"+"|}","{c|" + precent + "}","{d|" + value + "}"]
                            return arr.join('')
                        },
                        textStyle: {
                            rich:{
                                a:{
                                    fontSize:14,
                                    color:"rgba(0,0,0,0.65)",
                                    width: 80,
                                },
                                b:{
                                    fontSize:14,
                                    color:"rgba(0,0,0,0.35)",
                                    padding:10
                                },
                                c:{
                                    fontSize:14,
                                    color:"rgba(0,0,0,0.65)",
                                    padding: 8
                                },
                                d:{
                                    fontSize:14,
                                    color:"rgba(0,0,0,0.65)",
                                    padding: 8
                                }
                            }
                        }
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius : '72%',
                            center: ['68%', '50%'],
                            data: this.mediaSaleData.data,
                            label: {
                                show: false,
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal:{
                                    color: (params)=>{
                                        //自定义颜色
                                        return this.colorList[params.dataIndex]
                                    }
                                }
                            }
                        }
                    ]
                });
                this.adSalePieLoading = false
            },
            /*  广告库存  */
            // 左侧 - 过去
            getAdInventoriedData(){
                this.adInventoriedLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.toDay,
                    type: this.adInventoriedType,
                    asrIds: this.returnAsrID()
                }
                api.getApi(this.apiVar.report + '/api/v2/getAdsInventoryInfo', params).then(res => {
                    console.log('广告库存数据接口 - 过去', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        let arr = []
                        for(let key in dataObj){
                            // 确保以 已售-过期-禁用 的顺序
                            if (key === 'soldAds') {
                                arr[0] = {value: dataObj[key], name: '已售'}
                            } else if (key === 'unsoldAds') {
                                arr[1] = {value: dataObj[key], name: '过期'}
                            } else if (key === 'forbiddenAds') {
                                arr[2] = {value: dataObj[key] || 0, name: '禁用'}
                            }
                        }
                        this.beenWeekOfSurfaceData.data = JSON.parse(JSON.stringify(arr))
                        this.adInventoriedDate = {
                            starDate: dataObj.startDate,
                            endDate: dataObj.endDate,
                            weekNum: this.returnRankingWeekOnYear(this.toDay),
                            estimateSale: dataObj.estimateSale,
                        }
                        this.initAdInventoriedPie();
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 右侧 - 未来
            getAdInventoryData(){
                this.adInventoryLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: timeFormat.returnDayCount(1,'/'),
                    // endDate: this.toDay.substring(0,4) + '-12-31',
                    type: this.adInventoryType,
                    asrIds: this.returnAsrID()
                }
                api.getApi(this.apiVar.report + '/api/v2/getAdsFutureInventoryInfo', params).then(res => {
                    console.log('广告库存数据接口 - 未来', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        let arr = []
                        for (let key in dataObj) {
                            // 确保以 已售-可售 的顺序
                            if (key === 'soldAds') {
                                arr[0] = {value: dataObj[key], name: '已售'}
                            } else if (key === 'unsoldAds') {
                                arr[1] = {value: dataObj[key], name: '可售'}
                            }
                        }
                        this.futureWeekOfSurfaceData.data = JSON.parse(JSON.stringify(arr))
                        this.adInventoryDate = {
                            starDate: dataObj.startDate,
                            endDate: dataObj.endDate,
                            weekNum: this.returnRankingWeekOnYear(dataObj.endDate),
                            estimateSale: dataObj.estimateSale,
                        }
                        this.initAdInventoryPie();
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 广告库存 - 左侧
            initAdInventoriedPie(){
                if(this.adInventoriedPieEcharts){
                    this.adInventoriedPieEcharts.dispose()
                }
                this.adInventoriedPieEcharts = echarts.init(this.$refs.adInventoriedPie)
                let total = 0
                for(let key of this.beenWeekOfSurfaceData.data){
                    total += key.value
                }
                this.adInventoriedPieEcharts.setOption({
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p class="echarts_tooltip_title">' + '<span>' + params.name + '</span>' + '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' + '数值' + '</span>' + params.value + '</p>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' +
                                '占比' + '</span>' + params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    legend: {
                        orient: 'vertical',
                        left: '3%',
                        top:"25%",
                        itemGap: 20,
                        icon:'circle',
                        itemWidth: 8,
                        itemHeight: 8,
                        data: this.beenWeekOfSurfaceData.title,
                        formatter: (name)=> {
                            let value;
                            let precent;
                            for(let key of this.beenWeekOfSurfaceData.data){
                                if (key.name == name) {
                                    precent = (total ? parseFloat((key.value / total) * 100).toFixed(2) : 0) + '%'
                                    value = key.value
                                }
                            }
                            let arr = ["{a|" + name + "}","{b|"+"|}","{c|" + precent + "}","{d|" + value + "}"]
                            return arr.join('')
                        },
                        textStyle: this.itemStyle
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius : '72%',
                            center: ['68%', '50%'],
                            data: this.beenWeekOfSurfaceData.data,
                            label: {
                                show: false,
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal:{
                                    color: (params)=>{
                                        //自定义颜色
                                        return this.colorList[params.dataIndex]
                                    }
                                }
                            }
                        }
                    ]
                })
                this.adInventoriedLoading = false
            },
            // 广告库存 - 右侧
            initAdInventoryPie(){
                if(this.adInventoryPieEcharts){
                    this.adInventoryPieEcharts.dispose()
                }
                this.adInventoryPieEcharts = echarts.init(this.$refs.adInventoryPie)
                let total = 0
                for(let key of this.futureWeekOfSurfaceData.data){
                    total += key.value
                }
                console.log('total',total)
                this.adInventoryPieEcharts.setOption({
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p class="echarts_tooltip_title">' + '<span>' + params.name + '</span>' + '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' + '数值' + '</span>' + params.value + '</p>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' +
                                '占比' + '</span>' + params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    legend: {
                        orient: 'vertical',
                        left: '3%',
                        top:"35%",
                        itemGap: 20,
                        icon:'circle',
                        itemWidth: 8,
                        itemHeight: 8,
                        data: this.futureWeekOfSurfaceData.title,
                        formatter: (name)=> {
                            let value;
                            let precent;
                            for (let key of this.futureWeekOfSurfaceData.data) {
                                if (key.name == name) {
                                    precent = (total ? parseFloat((key.value / total) * 100).toFixed(2) : 0)+ '%'
                                    value = key.value
                                }
                            }
                            let arr = ["{a|" + name + "}","{b|"+"|}","{c|" + precent + "}","{d|" + value + "}"]
                            return arr.join('')
                        },
                        textStyle: this.itemStyle
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius : '72%',
                            center: ['68%', '50%'],
                            data: this.futureWeekOfSurfaceData.data,
                            label: {
                                show: false,
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal:{
                                    color: (params)=>{
                                        //自定义颜色
                                        let colorList = ['#2FC25B','#1890FF']
                                        return colorList[params.dataIndex]
                                    }
                                }
                            }
                        }
                    ]
                })
                this.adInventoryLoading = false
            },
            setChanceFindTabelData(dataList) {
                let arr = []
                for (let key of dataList) {
                    arr.push({
                        name: key.customerName,
                        cooperation: key.orderCount ? key.orderCount : '无订单',
                        status: key.cooperativeName,
                        time: key.createTime,
                        saler: key.userName,
                        bTitle: key.bTitle||''
                    })
                }
                this.chanceFindTable = arr
            },
            // 饼状图
            /* initChanceFindPie() {
                if (this.chanceFindPieEcharts) {
                    this.chanceFindPieEcharts.dispose()
                }
                this.chanceFindPieEcharts = echarts.init(this.$refs.chanceFindPie)
                let total = 0
                for (let key of this.chanceFindPieData.data) {
                    total += key.value
                }
                this.chanceFindPieEcharts.setOption({
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p class="echarts_tooltip_title">' + '<span>' + params.name + '</span>' + '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' + '数值' + '</span>' + params.value + '</p>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' +
                                '占比' + '</span>' + params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    legend: {
                        orient: 'vertical',
                        left: '3%',
                        top:"25%",
                        itemGap: 20,
                        icon:'circle',
                        itemWidth: 8,
                        itemHeight: 8,
                        data: this.chanceFindPieData.title,
                        formatter: (name)=> {
                            let value;
                            let precent;
                            for(let key of this.chanceFindPieData.data){
                                if (key.name == name) {
                                    precent = total ? (parseFloat((key.value / total) * 100).toFixed(2) + '%') : '0%'
                                    value = key.value
                                }
                            }
                            let arr = ["{a|" + name + "}","{b|"+"|}","{c|" + precent + "}","{d|" + value + "}"]
                            return arr.join('')
                        },
                        textStyle: {
                            rich:{
                                a:{
                                    fontSize:14,
                                    color:"rgba(0,0,0,0.65)",
                                    width: 60,
                                },
                                b:{
                                    fontSize:14,
                                    color:"rgba(0,0,0,0.35)",
                                    padding:10
                                },
                                c:{
                                    fontSize:14,
                                    color:"rgba(0,0,0,0.65)",
                                    padding: 8
                                },
                                d:{
                                    fontSize:14,
                                    color:"rgba(0,0,0,0.65)",
                                    padding: 8
                                }
                            }
                        }
                    },
                    series : [
                        {
                            name: '',
                            type: 'pie',
                            radius : '72%',
                            center: ['68%', '50%'],
                            data: this.chanceFindPieData.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal:{
                                    color: (params)=>{
                                        //自定义颜色
                                        return this.colorList[params.dataIndex]
                                    }
                                }
                            },
                            label: {
                                show:false
                            },
                            // 线条
                            // labelLine: {
                            //     normal: {
                            //         show: false
                            //     }
                            // },
                        }
                    ]
                })
                this.chanceFindPieLoading = false
            }, */
            // 设置周下拉选项
            setWeekSelectList(list){
                console.log('list',list)
                let weeks = []
                let month = (new Date(this.returnFormatDate(list[1].startDate))).getMonth() + 1;
                for (let i = 0; i < list.length; i++) {
                    weeks.push({
                        value: i.toString(),
                        label: month + '月第' + (i + 1) + '周',
                        time: list[i].startDate.substring(5,10) + '-' +list[i].endDate.substring(5,10),
                    })
                }
                console.log('weeks',weeks)
                return weeks
            },
            // 根据权限公司返回 asrIDs
            returnAsrID() {
                if (this.selectCity == '0') {
                    let asrIDs = []
                    for (let key of this.headerCityList) {
                        if (key.value !== '0') {
                            asrIDs.push(key.value)
                        }
                    }
                    return asrIDs.join(',')
                } else {
                    return this.selectCity
                }
            },
            // 价格加上逗号-整数
            priceFormat(price) {
                if (price) {
                    price = commaFormat.format(price.toFixed(0))
                    return price
                } else {
                    return 0
                }
            },
            // 保留两位小数
            keepTwoDecimal(num){
                if (!num && num !== 0) {
                    return 0;
                }
                let result = parseFloat(num);
                result = Math.round(num * 100) / 100;
                return result;
            },
            // 返回数的绝对值
            returnAbs(num) {
                if (typeof num === 'number' && !isNaN(num)) {
                    return Math.abs(num)
                } else {
                    return num
                }
            },
            // 指定日期为今年的第几周
            returnRankingWeekOnYear(date){
                date = this.returnFormatDate(date)
                let day1 = new Date(date);
                let day2 = new Date(date);
                day2.setMonth(0);
                day2.setDate(1);
                let rq = day1 - day2;
                let dayNum = Math.ceil(rq/(24*60*60*1000));
                let rankingWeek = Math.ceil(dayNum/7);
                console.log('dayNum',dayNum,'rankingWeek',rankingWeek)
                return rankingWeek
            },
            // 日期格式在new Date()前全部转换成yyyy/mm/dd格式 - 主要为了兼容safari
            returnFormatDate(date) {
                return date.toString().replace(/[-\.]/g, "/")
            },
        }
    }
</script>

<style scoped>
    .data_read_box{
        margin-bottom: 16px;
    }

    /deep/ .el-card__body{
        padding: 32px;
    }

    /deep/ .el-card__header{
        padding: 10px 32px 10px 16px;
        line-height: 32px;
    }

    .box_card_title{
        font-size:16px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(44,49,60,1);
    }

    .box_card_title_right{
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.45);
        float: right;
    }

    .right_date_select{
        width: 240px;
    }

    .total_data_date{
        width: 380px;
    }

    .ad_sale_date{
        width: 180px;
    }

    .right_date_select /deep/ .el-date-editor{
        width: 100%;
    }

    /*表头数据格*/
    .data_kind{
        display: flex;
        margin-bottom: 16px;
        border-radius: 3px;
    }

    .data_box{
        flex: 1;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        height: 70px;
        justify-content: space-around;
        background:rgba(0,108,255,0.02);
        border:1px solid rgba(232,232,232,1);
        margin-left: 16px;
        text-align: right;
    }

    .data_kind_all_city .data_box{
        cursor: pointer;
    }

    .data_kind_all_city .data_box:hover{
        border:1px solid rgba(24,144,255,1);
    }

    .data_kind_all_city .box_active:hover{
        border:2px solid rgba(24,144,255,1);
    }

    .data_box:first-child{
        margin-left: 0;
    }

    .data_box h4{
        height: 35px;
        line-height: 35px;
        padding-right: 8px;
        color:rgba(0,0,0,0.65);
        font-size: 14px;
    }

    .data_box p{
        padding-right: 8px;
        font-size: 20px;
        color:rgba(44,49,60,1);
        font-weight: 500;
    }

    .data_kind_all_city .box_active{
        border:2px solid rgba(24,144,255,1);
    }

    .data_kind_all_city .data_box.box_active h4,.data_kind_all_city .data_box.box_active p{
        color:rgba(24,144,255,1);
    }

    /*图表*/
    .charts_warp{
        background:rgba(0,108,255,0.02);
    }

    /*当天数据*/
    .toDay_data_ul{
        display: flex;
        margin-bottom: 16px;
    }

    .data_li{
        flex: 1;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        justify-content: space-around;
        height: 38px;
        line-height: 38px;
        background:rgba(0,108,255,0.02);
        border:1px solid rgba(232,232,232,1);
        margin-left: 16px;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
        text-align: center;
    }

    .data_li:first-child{
        margin-left: 0;
    }

    .el_col_bar{
        /*width: 100%;*/
        height: 328px;
        border:1px solid rgba(232,232,232,1);
        background: rgba(0,108,255,0.02);
    }

    .table_ul{
        margin: 24px 24px 16px;
        border-top: 1px solid #E8E8E8;
    }

    .table_ul_li{
        height: 70px;
        line-height: 70px;
        border-bottom: 1px solid #E8E8E8;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
    }

    .el_row_title{
        font-size:14px;
        font-weight:600;
        color:rgba(0,0,0,0.85);
    }

    .text_right{
        text-align: right;
    }

    /*  广告销售  */
    .ad_sale_li{
        flex: 1;
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        justify-content: space-around;
        height: 94px;
        line-height: 28px;
        background:rgba(0,108,255,0.02);
        border:1px solid rgba(232,232,232,1);
        margin-left: 16px;
        padding: 8px 16px;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
    }

    .ad_sale_li:first-child{
        margin-left: 0;
    }

    .ad_sale_li_num{
        font-size:20px;
        font-family:DINPro-Medium;
        font-weight:500;
        color:rgba(44,49,60,1);
    }

    .ad_sale_li_text{
        color:rgba(0,0,0,0.45);
    }

    .ad_sale_top_icon{
        font-size: 14px;
        color: #DE1010;
        transform: rotate(90deg);
    }

    .ad_sale_bottom_icon{
        font-size: 14px;
        color:rgba(82,196,26,1);
        transform: rotate(-90deg);
    }

    /*下拉*/
    .el_col_charts{
        position: relative;
    }

    .select_box{
        width: 112px;
        position: absolute;
        top: 24px;
        left: 32px;
        z-index: 99;
    }

    .select_box /deep/ .el-input__inner{
        height: 32px;
        line-height: 32px;
    }

    /*广告库存*/
    .price_box{
        position: absolute;
        bottom: 24px;
        left: 24px;
        z-index: 99;
        font-size:24px;
        font-weight:500;
        color:rgba(0,0,0,0.85);
    }
    .price_box > span{
        position: relative;
        top: -2px;
        display: inline-block;
        font-size:12px;
        font-weight:400;
        color: rgba(24,144,255,1);
        padding: 2px 6px;
        border-radius: 3px;
        border: 1px solid rgba(24,144,255,1);
        background:rgba(230,247,255,1);
        vertical-align: middle;
    }

    .ad_inventory_bottom{
        height: 38px;
        margin-top: 16px;
        line-height: 38px;
        text-align: center;
        font-size:14px;
        font-weight:400;
    }

    .ad_inventory_bottom_left{
        /*background:rgba(0,0,0,0.05);*/
        color:rgba(0,0,0,0.65);
        background: linear-gradient(
            -45deg,
            #E6E6E6 0,
            #E6E6E6 8%,
            rgba(0,0,0,0.05) 8%,
            rgba(0,0,0,0.05) 16%,
            rgba(0,0,0,0.05) 16%,
            rgba(0,0,0,0.05) 24%,
            #E6E6E6 24%,
            #E6E6E6 32%,
            rgba(0,0,0,0.05) 32%,
            rgba(0,0,0,0.05) 40%,
            rgba(0,0,0,0.05) 40%,
            rgba(0,0,0,0.05) 48%,
            #E6E6E6 48%,
            #E6E6E6 56%,
            rgba(0,0,0,0.05) 56%,
            rgba(0,0,0,0.05) 64%,
            rgba(0,0,0,0.05) 64%,
            rgba(0,0,0,0.05) 72%,
            #E6E6E6 72%,
            #E6E6E6 80%,
            rgba(0,0,0,0.05) 80%,
            rgba(0,0,0,0.05) 88%,
            rgba(0,0,0,0.05) 88%,
            rgba(0,0,0,0.05) 96%,
            rgba(0,0,0,0.05)
        );
        background-size: 50px 50px
    }

    .ad_inventory_bottom_right{
        background:rgba(57,159,255,1);
        color: #fff;
    }

    /*  机会挖掘  */
    .el_col_echarts{
        position: relative;
    }

    .echarts_title{
        position: absolute;
        top: 32px;
        left: 32px;
        font-size:16px;
        font-weight:600;
        color:rgba(44,49,60,1);
        line-height:24px;
    }

    .el_col_table {
        padding: 24px;
        height: 272px;
    }

    .data_read /deep/ .el-table {
        border-top: 1px solid #E8E8E8;
        background: rgba(0,0,0,0);
    }

    .data_read /deep/ .el-table th,.data_read /deep/ .el-table tr{
        background:rgba(0,0,0,0);
    }

    /* .chance_find_table /deep/ .el-table__body-wrapper,.chance_find_table /deep/ .el-table__empty-block{
        height: 218px;
        min-height: 218px;
        overflow-y: auto;
        position: relative;
    }

    .chance_find_table /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background: #fafafa;
    } */

    /* .chance_find_table /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb { */
        /*滚动条里面小方块*/
        /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    } */

</style>
