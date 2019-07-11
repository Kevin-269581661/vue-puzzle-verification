<script src="../../../../../ntr/NTR/pages/login/login.js"></script>
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
                            <el-date-picker
                                v-model="totalDataYear"
                                type="year"
                                size="small"
                                value-format="yyyy"
                                format="yyyy"
                                placeholder="选择年"
                                @change="changeYear">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <div class="data_kind">
                    <div class="data_box box_active">
                        <h4>社区</h4>
                        <p>{{basicTotalData.resourceCount}}</p>
                    </div>
                    <div class="data_box">
                        <h4>广告门</h4>
                        <p>{{basicTotalData.advertDoorCount}}</p>
                    </div>
                    <div class="data_box">
                        <h4>年上刊率</h4>
                        <p>{{basicTotalData.publishRate}}%</p>
                    </div>
                    <div class="data_box">
                        <h4>订单</h4>
                        <p>{{basicTotalData.orderCount}}</p>
                    </div>
                    <div class="data_box">
                        <h4>销售额</h4>
                        <p>￥{{priceFormat(basicTotalData.sale)}}</p>
                    </div>
                    <div class="data_box">
                        <h4>客单价</h4>
                        <p>￥{{priceFormat(basicTotalData.orderSale)}}</p>
                    </div>
                    <div class="data_box">
                        <h4>广告主</h4>
                        <p>{{basicTotalData.advertisementCount}}</p>
                    </div>
                </div>
                <div class="charts_warp">
                    <div class="bar_charts" id="total_data_read" ref="totalDataBar" style="height: 354px;width: 100%"></div>
                </div>
            </el-card>
        </div>
        <!--当天概况-->
        <div class="data_read_box">
            <el-card  class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">当天概况</span>
                    <span class="box_card_title_right" style="float: right; padding: 3px 0">数据更新至 2019年04月13日 00:00</span>
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
                        <div class="bar_charts el_col_bar" id="toDay_precept" ref="toDayPreceptBar" style="height: 328px;width: 100%"></div>
                    </el-col>
                    <el-col :span="12">
                        <div class="el_col_bar">
                            <ul class="table_ul">
                                <li class="table_ul_li">
                                    <el-row class="el_row_title">
                                        <el-col :span="5" style="padding-left: 8px">行为</el-col>
                                        <el-col :span="4" class="text_right">数量</el-col>
                                        <el-col :span="7" class="text_right">涉及点位（面）</el-col>
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
                            value-format="yyyy-MM"
                            format="yyyy-MM"
                            placeholder="选择月"
                            @change="adSaleChange">
                        </el-date-picker>
                    </div>
                </div>
                <ul class="toDay_data_ul">
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">点位总量(面·周)</h3>
                        <!--<p class="ad_sale_li_num">5,204*4=20,816</p>-->
                        <p class="ad_sale_li_num">{{adSaleHeaderData.pointCount || 0}}</p>
                        <p class="ad_sale_li_text">
                            较上个月 <i class="el-icon-top ad_sale_top_icon"></i>
                            <span>9.66%</span>
                        </p>
                    </li>
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">月均上刊率</h3>
                        <p class="ad_sale_li_num">{{adSaleHeaderData.monthPublishRate || 0}}%</p>
                        <p class="ad_sale_li_text">
                            较上个月 <i class="el-icon-top ad_sale_top_icon"></i>
                            <span>9.66%</span>
                        </p>
                    </li>
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">当前禁用媒体数量(面)</h3>
                        <p class="ad_sale_li_num">{{adSaleHeaderData.forbiddenMediaCount || 0}}</p>
                        <p class="ad_sale_li_text">
                            较上个月 <i class="el-icon-bottom ad_sale_bottom_icon"></i>
                            <span>25.66%</span>
                        </p>
                    </li>
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">成交订单</h3>
                        <p class="ad_sale_li_num">{{adSaleHeaderData.orderCount}}</p>
                        <p class="ad_sale_li_text"> 较上个月
                            <i class="el-icon-bottom ad_sale_bottom_icon"></i>
                            <span>9.66%</span>
                        </p>
                    </li>
                    <li class="ad_sale_li">
                        <h3 class="ad_sale_li_title">账面销售额</h3>
                        <p class="ad_sale_li_num">¥ {{priceFormat(adSaleHeaderData.sale)}}</p>
                        <p class="ad_sale_li_text"> 较上个月
                            <i class="el-icon-top ad_sale_top_icon"></i>
                            <span>9.66%</span>
                        </p>
                    </li>
                </ul>
                <el-row :gutter="16">
                    <el-col :span="12"
                            v-loading="adSaleBarLoading"
                            element-loading-text="玩命加载中..."
                            element-loading-background="rgba(255, 255, 255)">
                        <div class="bar_charts el_col_bar" id="ad_sale_ads" ref="adSaleBar" style="height: 328px;width: 100%"></div>
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
                    <span class="box_card_title_right" style="float: right; padding: 3px 0">数据更新至 2019年07月13日 12:00</span>
                </div>
                <el-row :gutter="16">
                    <el-col :span="12" class="el_col_charts"
                            v-loading="adInventoriedLoading"
                            element-loading-text="玩命加载中..."
                            element-loading-background="rgba(255, 255, 255)">
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
                            ¥ {{adInventoriedDate.estimateSale || 0}}
                            <el-popover
                                placement="top"
                                trigger="hover">
                                <div class="popover_span">
                                    假设单价为¥1000面/周
                                </div>
                                <span slot="reference">估算销售额 <i class="el-icon-warning-outline"></i></span>
                            </el-popover>
                        </p>
                        <div class="bar_charts el_col_bar" id="ad_inventoried" ref="adInventoriedPie" style="height: 328px;width: 100%"></div>
                    </el-col>
                    <el-col :span="12" class="el_col_charts"
                            v-loading="adInventoryLoading"
                            element-loading-text="玩命加载中..."
                            element-loading-background="rgba(255, 255, 255)">
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
                            ¥ {{adInventoryDate.estimateSale || 0}}
                            <el-popover
                                placement="top"
                                trigger="hover">
                                <div class="popover_span">
                                    假设单价为¥1000面/周
                                </div>
                                <span slot="reference">估算销售额 <i class="el-icon-warning-outline"></i></span>
                            </el-popover>
                        </p>
                        <div class="el_col_bar">
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
        <!--机会挖掘-->
        <div class="data_read_box">
            <el-card  class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">机会挖掘</span>
                    <div class="box_card_title_right right_date_select">
                        <el-date-picker
                            v-model="chanceFindDate"
                            size="small"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <el-row :gutter="16">
                    <el-col :span="12" class="el_col_echarts">
                        <p class="echarts_title">用户总量：1398个</p>
                        <div class="bar_charts el_col_bar" id="chance_find" ref="chanceFindPie" style="height: 320px;width: 100%"></div>
                    </el-col>
                    <el-col :span="12">
                        <div class="el_col_bar el_col_table">
                            <el-table
                                :data="chanceFindTable"
                                class="chance_find_table"
                                style="width: 100%">
                                <el-table-column
                                    prop="name"
                                    label="客户名称"
                                    min-width="125"
                                    :show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column
                                    prop="cooperation"
                                    label="合作情况"
                                    min-width="90">
                                </el-table-column>
                                <el-table-column
                                    prop="status"
                                    min-width="90"
                                    label="最新状态">
                                </el-table-column>
                                <el-table-column
                                    prop="time"
                                    min-width="90"
                                    label="更新时间">
                                </el-table-column>
                                <el-table-column
                                    prop="saler"
                                    label="所属销售">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.saler || '--'}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
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
    export default {
        name: "dataRead",
        data(){
            return{
                cityList:['北京亲邻众联','上海多邻网络','广州亲粤邻','深圳亲邻交互','成都亲邻','重庆亲邻','天津亲邻众联'],
                // 自定义颜色
                colorList: ['#2FC25B','#1890FF','#FACC14'],
                toDay: '',
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
                // 选择的年份
                totalDataYear: '',
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
                toDayPreceptBarEcharts: '',
                // 当天概况表格数据
                totalTableList: [
                    {
                        name:'新建方案',
                        number: 8,
                        ads: 600,
                        adsWeek: 890,
                    },
                    {
                        name:'预锁方案',
                        number: 8,
                        ads: 600,
                        adsWeek: 890,
                    },
                    {
                        name:'发布订单',
                        number: 6,
                        ads: 500,
                        adsWeek: 800,
                    },
                ],
                /*  广告销售  */
                adSaleMonth: '',
                //
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
                    weekList:['5月第1周', '5月第2周', '5月第3周', '5月第4周', '5月第5周'],
                    beenSold: [325, 340, 400, 350, 390],
                    unSold: [435, 446, 443, 459, 460],
                    adsDisabled: [25, 26, 20, 10, 32]
                },
                // 广告销售 - 饼状图
                adSalePieLoading: true,     // 加载状态
                mediaSaleData:{
                    title: ['空刊数(面)','在刊媒体(面)','禁用媒体(面)'],
                    data:[
                        {value:335, name:'空刊数(面)'},
                        {value:310, name:'在刊媒体(面)'},
                        {value:234, name:'禁用媒体(面)'},
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
                activeWeek: '',
                weekSelectList:[
                    {
                        value:'0',
                        label:'7月第1周'
                    },
                    {
                        value:'1',
                        label:'7月第2周'
                    },
                    {
                        value:'2',
                        label:'7月第3周'
                    },
                    {
                        value:'3',
                        label:'7月第4周'
                    },
                    {
                        value:'4',
                        label:'7月第5周'
                    },
                ],
                adInventoryPieEcharts: '',
                futureWeekOfSurfaceData: {
                    title:['已售','可售'],
                    data:[
                        {value:1350, name:'已售'},
                        {value:3170, name:'可售'},
                    ]
                },
                adInventoryDate: { starDate: '', endDate: '', weekNum: 0},
                adInventoryType: '1',
                // 机会挖掘
                chanceFindDate: '',
                chanceFindPieEcharts: '',
                chanceFindPieData: {
                    title: ['生成方案', '生成订单', '未合作'],
                    data: [
                        {value: 3350, name: '生成方案'},
                        {value: 1170, name: '生成订单'},
                        {value: 2170, name: '未合作'}
                    ]
                },
                // 机会挖掘表格
                chanceFindTable:[
                    {
                        name:'亲邻科技广州分公司',
                        cooperation: '无订单',
                        status: '生成方案',
                        time: '2018/06/28',
                        saler:'林晓'
                    },
                    {
                        name:'亲邻科技广州分公司',
                        cooperation: '无订单',
                        status: '生成方案',
                        time: '2018/06/28',
                        saler:''
                    },
                    {
                        name:'亲邻科技广州分公司',
                        cooperation: '无订单',
                        status: '生成方案',
                        time: '2018/06/28',
                        saler:'林晓'
                    },
                    {
                        name:'亲邻科技广州分公司',
                        cooperation: '无订单',
                        status: '生成方案',
                        time: '2018/06/28',
                        saler: '林晓'
                    },
                    {
                        name:'亲邻科技广州分公司',
                        cooperation: '无订单',
                        status: '生成方案',
                        time: '2018/06/28',
                        saler: '林晓'
                    },
                    {
                        name:'亲邻科技广州分公司',
                        cooperation: '无订单',
                        status: '生成方案',
                        time: '2018/06/28',
                        saler: '林晓'
                    },
                ],

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
                }
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
            }
        },
        watch:{
            sessionData(newVal,oldVal){
                console.log('newVal',newVal,'oldVal',oldVal)
                this.sessionData = newVal
            },
            selectCity(newVal,oldVal){
                this.selectCity = newVal
            },
            activeName(newVal,oldVal){
                this.activeName = newVal
                if(this.activeName === 'first'){
                    // 数据总览
                    this.initTotalDataBar();
                    // 当天概况
                    this.initToDayPreceptBar()
                    // 广告销售 - 柱状图
                    this.initAdSaleBar()
                    // 广告销售  - 饼状图
                    this.initAdSalePie()
                    // 广告库存 - 左侧
                    this.initAdInventoriedPie()
                    // 广告库存 - 右侧
                    this.initAdInventoryPie()
                    // 机会挖掘
                    this.initChanceFindPie()
                }
            }
        },
        mounted(){
            this.echartsListener();
            this.setTime()
            // 数据总览
            this.getTotalData();
            this.initTotalDataBar();
            // 当天概况
            this.getToDayHeaderData();
            this.initToDayPreceptBar();
            // 广告销售 - 顶部数据接口
            this.getAdSaleHeaderData();
            // 图表数据接口
            this.getAdSaleData();
            // 广告销售 - 柱状图
            // this.initAdSaleBar();
            // 广告销售  - 饼状图
            // this.initAdSalePie();
            // 广告库存 - 左侧
            this.getAdInventoriedData();
            // this.initAdInventoriedPie();
            // 广告库存 - 右侧
            this.getAdInventoryData();
            // this.initAdInventoryPie();
            // 机会挖掘
            this.initChanceFindPie();
        },
        methods:{
            // 统一监听
            echartsListener(){
                window.addEventListener("resize", ()=> {
                    // 数据总览
                    this.totalDataBarEcharts.resize();
                    // 当天概况
                    this.toDayPreceptBarEcharts.resize();
                    // 广告销售
                    this.adSaleBarEcharts.resize();
                    this.adSalePieEcharts.resize();
                    // 广告库存
                    this.adInventoriedPieEcharts.resize();
                    this.adInventoryPieEcharts.resize();
                    // 机会挖掘
                    this.chanceFindPieEcharts.resize();
                });
            },
            // 设置初始时间
            setTime() {
                let endTime = timeFormat.returnMonthCount(0,'-');
                this.adSaleMonth = endTime.substring(0,7);
                this.toDay = endTime;
                this.totalDataYear = endTime.substring(0,4);
                console.log('endTime',endTime)
            },
            /*  数据总量  */
            changeYear(val){
                console.log('选择的年份',val)
                this.getTotalData()
            },
            // 表头接口
            getTotalData(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.totalDataYear + '-01-01',
                    endDate: this.totalDataYear + '-12-31',
                }
                if (this.selectCity !== '0') {
                    params.asrId = this.returnAsrID()
                }
                console.log('params', params)
                api.getApi(this.apiVar.report + '/api/v2/getOverview', params).then(res => {
                    console.log('数据总总览-表头接口', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
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
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 数据总览 头部柱状图
            initTotalDataBar(){
                if(this.totalDataBarEcharts){
                    this.totalDataBarEcharts.dispose()
                }
                this.totalDataBarEcharts = this.$echarts.init(this.$refs.totalDataBar);
                // console.log('totalDataBar',this.totalDataBar)
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
                        formatter: function (params) {
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params[0].name + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params[0].name + '</span>' + params[0].data + '</p>'

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
                            data: this.cityList,
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
                            barWidth: '25%',
                            data: [1400, 2000, 2300, 4000, 4600,1800,3600]
                        }
                    ]
                });
            },
            /*  当天概况  */
            getToDayHeaderData(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.toDay,
                    endDate: this.toDay,
                }
                if (this.selectCity !== '0') {
                    params.asrId = this.returnAsrID()
                }
                console.log('当天概况params', params)
                api.getApi(this.apiVar.report + '/api/v2/getSurvey', params).then(res => {
                    console.log('当天概况-表头接口', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
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
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            initToDayPreceptBar(){
                if(this.toDayPreceptBarEcharts){
                    this.toDayPreceptBarEcharts.dispose()
                }
                this.toDayPreceptBarEcharts = this.$echarts.init(this.$refs.toDayPreceptBar);
                console.log('toDayPreceptBarEcharts',this.toDayPreceptBarEcharts)
                this.toDayPreceptBarEcharts.setOption({
                    legend: {
                        top: 'bottom',
                        left: 'center',
                        // data: ['方案/订单数(个)','点位数(面)','点位数(面·周)']
                    },
                    tooltip: {
                        // trigger: 'axis',
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
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' + '<span>' + '数量' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params.seriesName + '</span>' + params.data[params.dataIndex + 1] + '</p>'

                        },
                    },
                    dataset: {
                        source: [
                            ['product', '方案/订单数(个)', '点位数(面)', '点位数(面·周)'],
                            ['新建方案', 38, 288, 520],
                            ['预锁方案', 30, 200, 448],
                            ['生成订单', 20, 180, 368],
                        ]
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
            },
            /*  广告销售  */
            // 月份选择
            adSaleChange(){
                console.log('this.adSaleMonth',this.adSaleMonth)
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
                let monthDayNum = timeFormat.getCurrMonthDays(this.adSaleMonth)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.adSaleMonth + '-01',
                    endDate: this.adSaleMonth + '-' + monthDayNum,
                }
                if (this.selectCity !== '0') {
                    params.asrId = this.returnAsrID()
                }
                api.getApi(this.apiVar.report + '/api/v2/getAdvertSales', params).then(res => {
                    console.log('广告销售-顶部数据接口', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        this.adSaleHeaderData = {
                            pointCount: dataObj.pointCount,
                            monthPublishRate: dataObj.monthPublishRate ?  Math.floor(dataObj.monthPublishRate * 10000)/100 : 0,
                            forbiddenMediaCount: dataObj.forbiddenMediaCount,
                            orderCount: dataObj.orderCount,
                            sale: dataObj.sale
                        }
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            getAdSaleData(){
                this.adSaleBarLoading = true
                this.adSalePieLoading = true
                let monthDayNum = timeFormat.getCurrMonthDays(this.adSaleMonth)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.adSaleMonth + '-01',
                    endDate: this.adSaleMonth + '-' + monthDayNum,
                }
                if (this.selectCity !== '0') {
                    params.asrId = this.returnAsrID()
                }
                api.getApi(this.apiVar.report + '/api/v2/getAdsInfoByWeek', params).then(res => {
                    console.log('广告销售-顶部数据接口', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        this.adSaleList = res.data.data
                        this.setAdSalePieData(this.adSaleList[0])
                        this.adSaleWeekSelectList = this.setWeekSelectList(this.adSaleList)
                        this.setAdSaleBarData()
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 设置广告销售图表数据
            setAdSaleBarData(){
                console.log('设置广告销售图表数据',this.adSaleList)
                let weekList = []
                for(let key of this.adSaleWeekSelectList){
                    weekList.push(key.label)
                }
                let beenSold = []
                let unSold = []
                let adsDisabled = []
                for(let aKey of this.adSaleList){
                    beenSold.push(aKey.soldAdsCount)
                    unSold.push(aKey.unsoldAdsCount)
                    adsDisabled.push(aKey.forbiddenAdsCount)
                }
                this.adSaleData.weekList = JSON.parse(JSON.stringify(weekList))
                this.adSaleData.beenSold = JSON.parse(JSON.stringify(beenSold))
                this.adSaleData.unSold = JSON.parse(JSON.stringify(unSold))
                this.adSaleData.adsDisabled = JSON.parse(JSON.stringify(adsDisabled))
                console.log('左侧柱状图',this.adSaleData)
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
                console.log('广告销售')
                if(this.adSaleBarEcharts){
                    this.adSaleBarEcharts.dispose()
                }
                this.adSaleBarEcharts = this.$echarts.init(this.$refs.adSaleBar);
                let option =  {
                    tooltip: {
                        // trigger: 'axis',
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
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' + '<span>' + '数量' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params.seriesName + '</span>' + params.data + '</p>'

                        },
                    },
                    grid: {
                        top: '10%',
                        left: '5%',
                        right: '5%',
                        bottom: '13%',
                        containLabel: true
                    },
                    legend: {
                        bottom: '3%',
                        left: 'center',
                        data: ['禁用点位','已售点位','未售点位']
                    },
                    xAxis: [
                        {
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
                                }
                            },
                        }
                    ],
                    yAxis: {
                        type: 'value',
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
                    series: [
                        {
                            name:'禁用点位',
                            type:'bar',
                            barWidth: '35%',
                            stack:'xxx',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,//是否展示
                                    },
                                    color: '#FAD237'
                                }
                            },
                            data: this.adSaleData.adsDisabled
                        },
                        {
                            name:'已售点位',
                            type:'bar',
                            barWidth: '35%',
                            stack:'xxx',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,//是否展示
                                    },
                                    color: '#1890FF'
                                }
                            },
                            data: this.adSaleData.beenSold
                        },
                        {
                            name:'未售点位',
                            type:'bar',
                            barWidth: '35%',
                            stack:'xxx',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true,//是否展示
                                    },
                                    color: '#4DCA73'
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
                            data:[0,0,0,0,0]
                        }
                    ]
                };

                let series = option["series"];
                let totalFun = function (params) {
                    let total =0;
                    for(let i= 0,l=series.length;i<l;i++){
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
                this.adSalePieEcharts = this.$echarts.init(this.$refs.adSalePie)
                let total = 0
                for(let key of this.mediaSaleData.data){
                    total += key.value
                }
                console.log('total',total)
                this.adSalePieEcharts.setOption({
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-bottom: -20px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + '数值' + '</span>' + params.value + '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' +
                                '占比' + '</span>' + params.percent + '%' +
                                '</p>'
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
                            for (let i = 0; i < this.mediaSaleData.data.length; i++) {
                                if (this.mediaSaleData.data[i].name == name) {
                                    precent = parseFloat((this.mediaSaleData.data[i].value / total) * 100).toFixed(2) + '%'
                                    value = this.mediaSaleData.data[i].value
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
                    startDate: this.toDay.substring(0,4) + '-01-01',
                    endDate: this.toDay,
                    type: this.adInventoriedType
                }
                if (this.selectCity !== '0') {
                    params.asrId = this.returnAsrID()
                }
                console.log('广告库存params - 过去',params)
                api.getApi(this.apiVar.report + '/api/v2/getAdsInventoryInfo', params).then(res => {
                    console.log('广告库存数据接口 - 过去', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
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
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 右侧 - 未来
            getAdInventoryData(){
                this.adInventoryLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: timeFormat.returnDayCount(1,'-'),
                    endDate: this.toDay.substring(0,4) + '-12-31',
                    type: this.adInventoryType
                }
                if (this.selectCity !== '0') {
                    params.asrId = this.returnAsrID()
                }
                console.log('广告库存params - 未来',params)
                api.getApi(this.apiVar.report + '/api/v2/getAdsInventoryInfo', params).then(res => {
                    console.log('广告库存数据接口 - 过去', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        let arr = []
                        for(let key in dataObj){
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
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 广告库存 - 左侧
            initAdInventoriedPie(){
                if(this.adInventoriedPieEcharts){
                    this.adInventoriedPieEcharts.dispose()
                }
                this.adInventoriedPieEcharts = this.$echarts.init(this.$refs.adInventoriedPie)
                let total = 0
                for(let key of this.beenWeekOfSurfaceData.data){
                    total += key.value
                }
                this.adInventoriedPieEcharts.setOption({
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-bottom: -20px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + '数值' + '</span>' + params.value + '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' +
                                '占比' + '</span>' + params.percent + '%' +
                                '</p>'
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
                                    precent = parseFloat((key.value / total) * 100).toFixed(2) + '%'
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
                this.adInventoryPieEcharts = this.$echarts.init(this.$refs.adInventoryPie)
                let total = 0
                for(let key of this.futureWeekOfSurfaceData.data){
                    total += key.value
                }
                console.log('total',total)
                this.adInventoryPieEcharts.setOption({
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-bottom: -20px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + '数值' + '</span>' + params.value + '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' +
                                '占比' + '</span>' + params.percent + '%' +
                                '</p>'
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
                                    precent = parseFloat((key.value / total) * 100).toFixed(2) + '%'
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
            // 机会挖掘
            initChanceFindPie() {
                if(this.chanceFindPieEcharts){
                    this.chanceFindPieEcharts.dispose()
                }
                this.chanceFindPieEcharts = this.$echarts.init(this.$refs.chanceFindPie)
                let total = 0
                for(let key of this.chanceFindPieData.data){
                    total += key.value
                }
                this.chanceFindPieEcharts.setOption({
                    tooltip : {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-bottom: -20px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + '数值' + '</span>' + params.value + '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' +
                                '占比' + '</span>' + params.percent + '%' +
                                '</p>'
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
                                    precent = parseFloat((key.value / total) * 100).toFixed(2) + '%'
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
            },
            // 设置周下拉选项
            setWeekSelectList(list){
                let weeks = []
                let month = (new Date(list[1].startDate)).getMonth()+1;
                for (let i = 0; i < list.length; i++) {
                    weeks.push({
                        value: i.toString(),
                        label: month + '月第' + (i + 1) + '周'
                    })
                }
                console.log('weeks',weeks)
                return weeks
            },
            // 根据权限公司返回 asrIDs
            returnAsrID(){
                if (this.selectCity == '0'){
                    return '1,2,3,4,5,6,7'
                }else{
                    return this.selectCity
                }
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
            // 指定日期为今年的第几周
            returnRankingWeekOnYear(date){
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
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
            loginTimeout(){
                this.messageFun('warning',"登录超时,请重新登录");
                this.$router.push("/login");
            },
        },

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
        width: 120px;
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
        cursor: pointer;
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

    .box_active{
        border:2px solid rgba(24,144,255,1);
    }

    .data_box.box_active h4,.data_box.box_active p{
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
    }

    .ad_sale_bottom_icon{
        font-size: 14px;
        color:rgba(82,196,26,1);
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

    .chance_find_table /deep/ .el-table__body-wrapper{
        height: 218px;
        min-height: 218px;
        overflow-y: auto;
        position: relative;
    }

    .chance_find_table /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background: #fafafa;
    }

    .chance_find_table /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    }
</style>
