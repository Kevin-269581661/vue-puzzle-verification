<template>
    <div class="index_query">
        <div class="index_query_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">关键数据总量趋势</span>
                    <el-popover
                        placement="right"
                        width="280"
                        trigger="hover">
                        <div class="popover_span">
                            <em></em>社区：查询月份内截止每个月的社区总量<br>
                            广告门：查询月份内截止每个月的广告门总量<br>
                            上刊率：查询月份第一个月为当月上刊率，第二个月份起为查询月份第一个月至该月份的总体上刊率<br>
                            订单：查询月份内截止每个月的订单总量<br>
                            现金总额：查询月份内截止每个月的现金金额总量<br>
                            客单价：现金总额/订单<br>
                            广告主：查询月份内截止每个月成交的广告主总量<br></div>
                        <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                    </el-popover>
                </div>
                <div>
                    <div class="data-tab">
                        <span>数据：</span>
                        <el-radio-group v-model="allkeydatakind" size="mini"
                                        @change="keydataRadio(allkeydatakind,'all')"
                                        :disabled="isReskeyDataKind">
                            <el-radio-button label="社区数"></el-radio-button>
                            <el-radio-button label="广告门数"></el-radio-button>
                            <el-radio-button label="点位数"></el-radio-button>
                            <el-radio-button label="上刊率"></el-radio-button>
                            <el-radio-button label="订单数"></el-radio-button>
                            <el-radio-button label="订单总额"></el-radio-button>
                            <el-radio-button label="广告主数"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="data-tab">
                        <span>时间：</span>
                        <el-radio-group v-model="allkeyDataTime" size="mini"
                                        @change="RadioTime(allkeyDataTime,'all',allkeyDataDate)">
                            <el-radio-button label="最近半年"></el-radio-button>
                            <el-radio-button label="最近三个月"></el-radio-button>
                        </el-radio-group>
                        <div class="date_picker_box">
                            <el-date-picker
                                v-model="allkeyDataDate[0]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月"
                                :picker-options="allkeyOptionsStar"
                                :clearable="false"
                                @change="analysisChangeMonth('trend','all','0')">
                            </el-date-picker>
                            至
                            <el-date-picker
                                v-model="allkeyDataDate[1]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月"
                                :picker-options="allkeyOptionsEnd"
                                :clearable="false"
                                @change="analysisChangeMonth('trend','all','1')">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="keyDataChart"
                         v-loading="keyDataLineLoading"
                         element-loading-text="玩命加载中..."
                         element-loading-background="rgba(255, 255, 255)">
                        <div class="charts2" id="keyDataLine" ref="keyDataLine"
                             style="width: 100%;height: 350px"></div>
                    </div>
                </div>
            </el-card>
        </div>
        <!--关键数据增量对比-->
        <div class="index_query_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">关键数据增量对比</span>
                    <el-popover
                        placement="right"
                        width="280"
                        trigger="hover">
                        <div class="popover_span">社区：城市 每个月新增的社区数量<br>
                            广告门：城市 每个月新增的广告门数量<br>
                            上刊率：城市每个月的上刊率<br>
                            订单：城市 每个月新增的订单数量<br>
                            现金总额：城市 每个月新增的订单的现金总额累计和<br>
                            客单价：现金总额/订单<br>
                            广告主：城市每个月新增的成交的广告主数量
                        </div>
                        <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                    </el-popover>
                </div>
                <div>
                    <div class="data-tab">
                        <span>数据：</span>
                        <el-radio-group v-model="addkeyDataKind" size="mini"
                                        @change="keydataRadio(addkeyDataKind,'add')"
                                        :disabled="isAddkeyDataKind">
                            <el-radio-button label="社区数"></el-radio-button>
                            <el-radio-button label="广告门数"></el-radio-button>
                            <el-radio-button label="点位数"></el-radio-button>
                            <el-radio-button label="上刊率"></el-radio-button>
                            <el-radio-button label="订单数"></el-radio-button>
                            <el-radio-button label="订单总额"></el-radio-button>
                            <el-radio-button label="广告主数"></el-radio-button>
                        </el-radio-group>

                    </div>
                    <div class="data-tab">
                        <span>时间：</span>
                        <el-radio-group v-model="addkeyDataTime" size="mini"
                                        @change="RadioTime(addkeyDataTime,'add',addkeyDataDate)">
                            <el-radio-button label="最近半年"></el-radio-button>
                            <el-radio-button label="最近三个月"></el-radio-button>
                        </el-radio-group>
                        <div class="date_picker_box">
                            <el-date-picker
                                v-model="addkeyDataDate[0]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月"
                                :picker-options="addKeyOptionsStar"
                                :clearable="false"
                                @change="analysisChangeMonth('trend','add','0')">
                            </el-date-picker>
                            至
                            <el-date-picker
                                v-model="addkeyDataDate[1]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月"
                                :picker-options="addKeyOptionsEnd"
                                :clearable="false"
                                @change="analysisChangeMonth('trend','add','1')">
                            </el-date-picker>
                        </div>
                        <el-checkbox v-model="dateCompare" @change="compareRadio">对比</el-checkbox>
                        <div class="date_picker_box" v-if="dateCompare">
                            <el-date-picker
                                v-model="addkeyCompareDate[0]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月"
                                :picker-options="addkeyCompareOptionsStar"
                                @change="addKeyDataChangeMonthCompare">
                            </el-date-picker>
                            至
                            <el-date-picker
                                v-model="addkeyCompareDate[1]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月"
                                :picker-options="addkeyCompareOptionsEnd"
                                @change="addKeyDataChangeMonthCompare">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="keyDataChart"
                         v-loading="keyDataBarLoading"
                         element-loading-text="玩命加载中..."
                         element-loading-background="rgba(255, 255, 255)">
                        <div class="charts2" id="keyDataBar" ref="keyDataBar"
                             style="width: 100%;height: 350px">
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <!--行业订单总量趋势-->
        <div class="index_query_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">行业订单总量趋势</span>
                    <el-popover
                        placement="right"
                        width="380"
                        trigger="hover">
                        <div class="popover_span">订单金额：该行业的广告主在查询月份内截止每月的订单现金金额总数<br>
                            订单数量：该行业的广告主在查询月份内截止每月的订单总数<br>
                            广告主数：该行业的广告主在查询月份内截止每月成交的广告主数量<br></div>
                        <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                    </el-popover>
                </div>
                <div>
                    <div class="data-tab Bradio">
                        <span>行业：</span>
                        <el-select filterable v-model="selectIndustry" multiple
                                   :multiple-limit=5
                                   placeholder="请选择"
                                   size="small" @change="IOrderChange">
                            <el-option
                                v-for="item in industryData"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="data-tab timeSelect">
                        <span>时间：</span>
                        <el-radio-group v-model="TOrderTime" size="mini" @change="RadioTime(TOrderTime,'TOrder')">
                            <el-radio-button label="最近半年"></el-radio-button>
                            <el-radio-button label="最近三个月"></el-radio-button>
                        </el-radio-group>
                        <div class="date_picker_box">
                            <el-date-picker
                                v-model="TOrderDate[0]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月"
                                :picker-options="orderDataOptionsStar"
                                @change="orderChangeMonth('0')">
                            </el-date-picker>
                            至
                            <el-date-picker
                                v-model="TOrderDate[1]"
                                type="month"
                                size="mini"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择结束月份"
                                :picker-options="orderDataOptionsEnd"
                                @change="orderChangeMonth('1')">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="data-tab">
                        <span> 数据：</span>
                        <el-radio-group v-model="TOrderTitleRadio" size="mini" @change="totleOrderRadio">
                            <el-radio-button label="订单金额"></el-radio-button>
                            <el-radio-button label="订单数量"></el-radio-button>
                            <el-radio-button label="广告主数"></el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div class="busOrderChart">
                    <div class="charts2" id="busOrderLine" ref="orderLine"
                         style="width: 100%;height: 350px"></div>
                </div>
            </el-card>
        </div>
        <!--行业订单占比-->
        <div class="index_query_box order_scale">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">行业订单占比</span>
                    <el-popover
                        placement="right"
                        width="410"
                        trigger="hover">
                        <div class="popover_span">订单金额：各行业的广告主截止昨日的订单现金金额总和/全部订单现金总和<br>
                            订单数量：各行业的广告主截止昨日的订单总数/全部订单数总数<br>
                            广告主：各行业的广告主截止昨日的广告主总数/全部广告主数<br></div>
                        <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                    </el-popover>
                </div>
                <div>
                    <div class="data-tab">
                        <span>数据： </span>
                        <el-radio-group v-model="orderScale" size="mini" @change="IOrderRadio">
                            <el-radio-button label="订单金额"></el-radio-button>
                            <el-radio-button label="订单数量"></el-radio-button>
                            <el-radio-button label="广告主数"></el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <el-row>
                    <el-col :span="12" style="position: relative">
                        <div class="charts1" id="allOrderPie" ref="allOrderPie"
                             style="width: 100%;height: 350px"></div>
                        <div class="order_pie_title">
                            <p>{{orderScale}}</p>
                            <h3>
                                {{orderScale === '订单金额' ? ('¥' + priceFormat(IOrderTotalShow)) : IOrderTotalShow}}</h3>
                            <!--<h3 v-show="orderScale === '订单数量' || orderScale === '广告主数'">-->
                                <!--{{IOrderTotalShow}}</h3>-->
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-table :data="IOrderData" border height="380" style="width: 100%;"
                                  class="IOrder-table">
                            <el-table-column label="序号" width="50" type="index">
                            </el-table-column>
                            <el-table-column prop="iName" label="行业" min-width="161">
                            </el-table-column>
                            <el-table-column label="订单总额" min-width="161" align="right">
                                <template slot-scope="scope">
                                    &yen;{{priceFormat((scope.row.orderTotal/100))}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="apCount" label="订单数" min-width="105" align="right">
                            </el-table-column>
                            <el-table-column prop="comCount" label="广告主" min-width="105" align="right">
                            </el-table-column>
                            <div slot="empty">
                                <no-search-result></no-search-result>
                            </div>
                        </el-table>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <!--入驻物业排行-->
        <div class="index_query_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">入驻物业排行</span>
                    <el-popover
                        placement="right"
                        width="220"
                        trigger="hover">
                        <div class="popover_span">
                            社区数量：截止昨日物业全部社区数<br>
                            广告门数量：截止昨日物业全部广告门数
                        </div>
                        <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                    </el-popover>
                    <div class="all" @click="PropertyRankTableVisible = true">全部>></div>
                </div>
                <div>
                    <div class="data-tab">
                        <span> 数据： </span>
                        <el-radio-group v-model="PMCDataTitle" size="mini" @change="resPMCRadio">
                            <el-radio-button label="社区数量"></el-radio-button>
                            <el-radio-button label="点位数量"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="data-tab">
                        <span>时间：</span>
                        <el-radio-group v-model="resPMCTime" size="mini"
                                        @change="RadioTime(resPMCTime,'resPMC')">
                            <el-radio-button label="最近半年"></el-radio-button>
                            <el-radio-button label="最近三个月"></el-radio-button>
                            <el-radio-button label="全部"></el-radio-button>
                        </el-radio-group>
                        <div class="date_picker_box date_picker">
                            <el-date-picker
                                size="mini"
                                v-model="resPMCDate"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                @change="analysisChangeTime('resPMC')"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="keyDataChart" v-if="isHavePropertyRankData">
                        <div class="charts2" id="PropertyRank" ref="PropertyRank"
                             style="width: 100%;height: 350px"></div>
                    </div>
                    <div v-else class="had_not_data">
                        <no-search-result ></no-search-result>
                    </div>
                </div>
            </el-card>
        </div>
        <!--广告主排行-->
        <div class="index_query_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">广告主排行</span>
                    <el-popover
                        placement="right"
                        width="325"
                        trigger="hover">
                        <div class="popover_span">订单金额：各个广告主截止在查询年月内新增的订单现金总数<br>
                            订单数：各个广告主截止在查询年月内新增的订单数
                        </div>
                        <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                    </el-popover>
                    <div class="all" @click="adOwnerRankTableVisible = true">全部>></div>
                </div>
                <div>
                    <div class="data-tab">
                        <span>数据：</span>
                        <el-radio-group v-model="adOwnerDataTitle" size="mini" @change="adOwnerRadio">
                            <el-radio-button label="订单金额"></el-radio-button>
                            <el-radio-button label="订单数量"></el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="data-tab">
                        <span>时间：</span>
                        <el-radio-group v-model="adOwnerTime" size="mini" @change="RadioTime(adOwnerTime,'adOwner')">
                            <el-radio-button label="最近半年"></el-radio-button>
                            <el-radio-button label="最近三个月"></el-radio-button>
                            <el-radio-button label="全部"></el-radio-button>
                        </el-radio-group>
                        <div class="date_picker_box date_picker">
                            <el-date-picker
                                size="mini"
                                v-model="adOwnerDate"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                @change="analysisChangeTime('adOwner')"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="keyDataChart" v-if="isHaveAdOwnerRank">
                        <div class="charts2" id="adOwnerRank" ref="adOwnerRank"
                             style="width: 100%;height: 350px" ></div>
                    </div>
                    <div v-else class="had_not_data">
                        <no-search-result ></no-search-result>
                    </div>
                </div>
            </el-card>
        </div>
        <!--销售业绩排行-->
        <div class="index_query_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">销售业绩排行</span>
                    <el-popover
                        placement="right"
                        width="320"
                        trigger="hover">
                        <div class="popover_span">订单金额：该销售在查询年月内新增的订单的 现金金额总和<br>
                            订单数：该销售在查询年月内新增的订单的 订单数
                        </div>
                        <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                    </el-popover>
                    <div class="all" @click="salesRankTableVisible = true">全部>></div>
                </div>
                <div>
                    <div class="data-tab">
                        <span>数据：</span>
                        <el-radio-group v-model="salesDataTitle" size="mini"
                                        @change="salesRankRadio">
                            <el-radio-button label="销售金额"></el-radio-button>
                            <el-radio-button label="销售单数"></el-radio-button>
                        </el-radio-group>

                    </div>
                    <div class="data-tab">
                        <span>时间：</span>
                        <el-radio-group v-model="salesRankTime" size="mini"
                                        @change="RadioTime(salesRankTime,'salesRank')">
                            <el-radio-button label="最近半年"></el-radio-button>
                            <el-radio-button label="最近三个月"></el-radio-button>
                            <el-radio-button label="全部"></el-radio-button>
                        </el-radio-group>
                        <div class="date_picker_box date_picker">
                            <el-date-picker
                                size="mini"
                                v-model="salesRankDate"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                @change="analysisChangeTime('salesRank')"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="keyDataChart chart_data_box" v-if="isHaveSalesRank">
                        <div class="charts2" id="salesRank" ref="salesRank"
                             style="width: 100%;height: 350px"></div>
                    </div>
                    <div v-else class="had_not_data">
                        <no-search-result ></no-search-result>
                    </div>
                </div>
            </el-card>
        </div>
        <!--入驻物业排行表格-->
        <el-dialog title="入驻物业总排行" :visible.sync="PropertyRankTableVisible">
            <div class="table-wrap" style="width: 100%">
                <el-table :data="ResPMCRankData" height="430px" border
                          style="width: 100%">
                    <el-table-column property="rank"
                                     type="index"
                                     label="排名"
                                     width="50">
                    </el-table-column>
                    <el-table-column property="resPMC"
                                     label="物业"
                                     min-width="40%">
                    </el-table-column>
                    <el-table-column property="resCount"
                                     label="社区"
                                     min-width="20%"
                                     sortable
                                     align="right">
                    </el-table-column>
                    <el-table-column property="mCount"
                                     label="广告点位"
                                     min-width="20%"
                                     sortable
                                     align="right">
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!--广告主排行表格-->
        <el-dialog title="广告主总排行" :visible.sync="adOwnerRankTableVisible">
            <div class="table-wrap" style="width: 100%">
                <el-table :data="adOwnerRankTable" height="430px" border
                          style="width: 100%">
                    <el-table-column
                        type="index"
                        label="排名"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        property="cName"
                        label="广告主"
                        min-width="45%">
                    </el-table-column>
                    <el-table-column property="price" label="金额" min-width="25%"
                                     sortable
                                     align="right">
                        <template slot-scope="scope">
                            &yen;{{priceFormat(scope.row.totalSum / 100)}}
                        </template>
                    </el-table-column>
                    <el-table-column property="apCount" label="数量" min-width="20%"
                                     sortable
                                     align="right">
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!--销售业绩排行表格-->
        <el-dialog title="销售业绩总排行" :visible.sync="salesRankTableVisible">
            <div class="table-wrap" style="width: 100%">
                <el-table :data="salesRankData" height="430px" border
                          class="sales-rank-table">
                    <el-table-column property="rank" type="index" label="排名"
                                     width="50"></el-table-column>
                    <el-table-column property="realName" label="销售"
                                     min-width="35%"></el-table-column>
                    <el-table-column property="totalSum" label="金额" min-width="35%"
                                     sortable
                                     align="right">
                        <template slot-scope="scope">
                            &yen;{{priceFormat(scope.row.totalSum / 100)}}
                        </template>
                    </el-table-column>
                    <el-table-column property="apCount" label="数量" min-width="20%"
                                     sortable
                                     align="right">
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../api/api';
    import timeFormat from '../../../commonFun/timeFormat';
    import industry from '../../../commonFun/industryToText';
    import commaFormat from '../../../commonFun/commaFormat';
    import noSearchResult from "../../../components/common/components/noSearchResult";
    import sessFun from '../../../commonFun/sessFun';
    export default {
        name: "indexQuery",
        components:{
            noSearchResult
        },
        data() {
            return {
                isGetData: false,
                // 前一次-全局选择的城市
                oldSelectCity: '0',
                // 当前月份日期
                nowMonth: '',
                // 数据截止时间
                toTime: '',
                // 所属行业
                industryData: [],
                //关键数据总量趋势
                allkeydatakind: '社区数',
                allkeyDataDate: [],
                isReskeyDataKind: true,
                allkeyDataTime: '最近半年',
                // 关键数据总量loading
                keyDataLineLoading: true,
                // 关键数据总量echart
                keyDataLineEchart: '',
                // 关键数据总量
                CountOfTotalData: {
                    res: [],
                    media: [],
                    ads: [],
                    timeData: [],
                    Rate: [],
                    order: [],
                    orderPrice: [],
                    adOwner: []
                },
                CountOfTotalDataShow: {numData: [], timeData: []},
                //关键数据增量对比
                CountOfIncreData: {
                    res: [],
                    media: [],
                    ads: [],
                    Rate: [],
                    order: [],
                    orderPrice: [],
                    adOwner: [],
                    timeData: [],
                    increData: [],
                },
                // 关键数据增量echart
                KeyDataBarEchart: '',
                // 关键数据增量对比
                CountOfIncreDataShow: {dateCompare: [], AddData: [], AddDataCP: [], TitleDate: []},
                addkeyDataKind: '社区数',
                // 数据加载时按钮禁用
                isAddkeyDataKind: true,
                // 默认的快捷时间按钮
                addkeyDataTime: '最近半年',
                // 关键数据增量对比时间
                addkeyDataDate: [],
                // 对比时间
                addkeyCompareDate: [],
                // 对比的checkBox
                dateCompare: false,
                // 关键数据增量loading
                keyDataBarLoading: true,
                /*   行业订单总量趋势   */
                colorArr: ['#975fe4', '#3aa0ff', '#36cbcb', '#4dcb73', '#fad337', '#f2637b', '#6081FF', '#FE752A'],
                busOrderLineEchart: '',
                selectIndustry: [],
                beforeSelectIndustry: [],
                TOrderDate: [],
                TOrderTime: '最近半年',
                // 订单类型
                TOrderTitleRadio: '订单金额',
                //行业订单总量趋势折线图X
                totalOrderDate: [],
                // 显示数据
                totalOrderDataShow: [],
                // 折线标题
                totalOrderTitleShow: [],
                // 行业订单总量趋势 -订单金额
                totalOrderPrice: [],
                // 行业订单总量趋势 -订单数量
                totalOrderNumber: [],
                // 行业订单总量趋势 -广告主数
                totalOrderAdOwner: [],
                /*  行业订单占比  */
                allOrderPieEcharts: '',
                orderScale: '订单金额',
                // 行业订单占比-总数据汇总
                IOrderTotal: {orderTotal: 0, apCount: 0, comCount: 0},
                // 行业订单占比-要显示的总数据
                IOrderTotalShow: 0,
                //饼图数据
                IOrderData: [],
                //表格数据
                orderTable: [],
                IOrderTotalArr: [{data: []}, {legendData: []}],   // 行业订单占比-订单金额
                IOrderApCount: [{data: []}, {legendData: []}],    // 行业订单占比-订单数量
                IOrderComCount: [{data: []}, {legendData: []}],   // 行业订单占比-广告主数
                IOrderDataShow: [{data: []}, {legendData: []}],
                /*  入驻物业排行  */
                isHavePropertyRankData: true,
                PropertyRankEchart: '',
                PMCDataTitle: '社区数量',
                resPMCDate: [],
                resPMCTime: '最近半年',
                PropertyRankTableVisible: false,
                ResPMCRankData: [],        // 入驻物业排行 - 数据
                ResPMCShowData: [],        // 入驻物业排行 - 显示数据
                ResPMCResCount: [],        // 入驻物业排行 - 社区数
                ResPMCMCount: [],          // 入驻物业排行 - 点位数
                ResPMCName: [],            // 入驻物业排行 - 物业名称
                PropertyRankTable: [],
                /*  广告主排行  */
                isHaveAdOwnerRank: true,
                adOwnerRankEcharts: '',
                adOwnerDataTitle: '订单金额',
                adOwnerDate: [],
                adOwnerTime: '最近半年',
                AdOwnerData: [],
                AdOwnerName: [],            // 广告主排位名称
                AdOwnerTotalSum: [],        // 广告主排行-订单金额
                AdOwnerApCount: [],         // 广告主排行- 订单数量
                AdOwnerShowData: [],        // 广告主排行 - 显示的柱状数据
                adOwnerRankTableVisible: false,
                adOwnerRankTable: [],
                /*  销售业绩排行  */
                isHaveSalesRank: true,
                salesRankEcharts: '',
                salesDataTitle: '销售金额',
                salesRankDate: [],
                salesRankTime: '最近半年',
                salesRankData: [],            // 销售业绩排行数据
                salesRankName: [],            // 销售业绩排行名称
                salesRankTotalSum: [],        // 销售业绩排行-金额
                salesRankApCount: [],         // 销售业绩排行-单数
                salesRankShowData: [],        // 销售业绩排行 - 显示的柱状数据
                salesRankTableVisible: false,
                salesRankTable: [],
                // 结束时间与开始时间的验证 - 返回true即为禁止
                // 关键数据总量趋势
                allkeyOptionsStar: {
                    disabledDate: (time) => {
                        return time.getTime() > Date.parse(this.allkeyDataDate[1])
                    }
                },
                allkeyOptionsEnd: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.parse(this.allkeyDataDate[0])
                    }
                },
                // 关键数据增量对比
                addKeyOptionsStar: {
                    disabledDate: (time) => {
                        return time.getTime() > Date.parse(this.addkeyDataDate[1])
                    }
                },
                addKeyOptionsEnd: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.parse(this.addkeyDataDate[0])
                    }
                },
                addkeyCompareOptionsStar: {
                    disabledDate: (time) => {
                        return time.getTime() > Date.parse(this.addkeyCompareDate[1])
                    }
                },
                addkeyCompareOptionsEnd: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.parse(this.addkeyCompareDate[0])
                    }
                },
                // 订单总量趋势
                orderDataOptionsStar: {
                    disabledDate: (time) => {
                        return time.getTime() > Date.parse(this.TOrderDate[1])
                    }
                },
                orderDataOptionsEnd: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.parse(this.TOrderDate[0])
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
            citys:{
                type:Array,
                required: true
            },
        },
        watch:{
            sessionData(newVal,oldVal){
                this.sessionData = newVal
            },
            selectCity(newVal,oldVal){
                this.selectCity = newVal
                if (this.activeName === 'third') {
                    this.getIndexQueryData()
                } else {
                    // if(this.selectCity != this.oldSelectCity){
                    //     this.isGetData = false
                    // } else {
                    //     this.isGetData = true
                    // }
                }
            },
            activeName(newVal,oldVal){
                console.log('指标查询activeName',newVal,'oldVal',oldVal)
                this.activeName = newVal
                // 关键数据总量/增量趋势 - 社区接口
                if(this.activeName === 'third'){
                    if (!this.isGetData) {
                        // 统一调用接口
                        this.getIndexQueryData()
                    } else {
                        // 总量/增量 - 社区
                        this.keyDataLine()
                        this.keyDataBar()
                        // 行业订单总总量趋势
                        this.busOrderLine()
                        // 行业订单占比
                        this.allOrderPie()
                        // 入驻物业排行
                        this.PropertyRank()
                        // 广告主排行
                        this.adOwnerRank()
                        // 销售业绩排行
                        this.salesRank()
                    }
                }
            }
        },
        mounted(){
            let industryData = JSON.parse(sessionStorage.getItem('industry'));
            this.industryData = industry.getFirstLevel(industryData);
            // console.log('industryData',this.industryData)
            if (this.industryData && this.industryData.length) {
                this.selectIndustry = [this.industryData[0].value]
                this.beforeSelectIndustry = [this.industryData[0].value]
            }
            this.setTime();
            this.echartsListener();
        },
        methods:{
            // 设置初始时间
            setTime() {
                let starTime = timeFormat.returnMonthCount(5,'-');
                let endTime = timeFormat.returnMonthCount(0,'-');
                let starTimeSub = starTime.substring(0,7);
                let endTimeSub = endTime.substring(0,7);
                this.nowMonth = endTimeSub;
                this.toTime = endTime;
                this.allkeyDataDate = [starTimeSub, endTimeSub];     // 关键数据总量趋势
                this.addkeyDataDate = [starTimeSub, endTimeSub];     // 关键数据增量趋势
                this.TOrderDate = [starTimeSub,endTimeSub];          // 行业订单总量趋势
                this.resPMCDate = [starTime, endTime];               // 入驻物业排行
                this.adOwnerDate = [starTime, endTime];              // 广告主排行
                this.salesRankDate = [starTime, endTime];            // 销售业绩排行
            },
            // 统一监听
            echartsListener(){
                window.addEventListener("resize", ()=> {
                    // 关键数据总量
                    this.keyDataLineEchart.resize();
                    // 关键数据增量
                    this.KeyDataBarEchart.resize();
                    // 行业订单总量
                    this.busOrderLineEchart.resize();
                    // 行业订单占比
                    this.allOrderPieEcharts.resize();
                    // 入驻物业
                    this.PropertyRankEchart.resize();
                    // 广告主
                    this.adOwnerRankEcharts.resize();
                    // 销售业绩
                    this.salesRankEcharts.resize();
                });
            },
            // 统一调用接口
            getIndexQueryData(){
                this.initActiveData()
                // 总量/增量 - 社区
                this.getAllResData('allAndAdd')
                // 行业订单总总量趋势 - 接口
                this.initIOrderData()
                if (this.industryData[0]) {
                    this.getIOrderData(this.industryData[0].value)
                }
                // 行业订单占比
                this.getIOrderTotalData()
                // 入驻物业排行
                this.getResPMCRankData()
                // 广告主排行
                this.getAdOwnerData()
                // 销售业绩排行
                this.getSalesRankData()
                this.oldSelectCity = this.selectCity
                this.isGetData = true
            },
            initActiveData(){
                // 总量/增量
                this.allkeydatakind = '社区数'
                this.addkeyDataKind = '社区数'
                // 行业订单总总量趋势
                if (this.industryData[0]) {
                    this.selectIndustry = [this.industryData[0].value]
                }
                this.TOrderTitleRadio = '订单金额'
                // 行业订单占比
                this.orderScale = '订单金额'
                // 入驻物业排行
                this.PMCDataTitle = '社区数量'
                // 广告主排行
                this.adOwnerDataTitle = '订单金额'
                // 销售业绩排行
                this.salesDataTitle = '销售金额'
            },
            // 关键数据总量趋势 - Radio
            keydataRadio(val,temp){
                if (temp === 'add') {
                    this.isAddkeyDataKind = true
                    this.keyDataBarLoading = true
                } else if (temp === 'all') {
                    this.isReskeyDataKind = true
                    this.keyDataLineLoading = true
                }
                switch (val) {
                    case '社区数':
                        this.getAllResData(temp);
                        break;
                    case '广告门数':
                        this.getAllMediaData(temp);
                        break;
                    case '点位数':
                        this.getAllAdsData(temp);
                        break;
                    case '上刊率':
                        this.getAllRateData(temp);
                        break;
                    case '订单数':
                        this.getAllOrderData(temp);
                        break;
                    case '订单总额':
                        this.getAllOrderPriceData(temp);
                        break;
                    case '广告主数':
                        this.getAllAdOwnerData(temp);
                        break;
                    default:
                        console.log('切换异常', this.allkeydatakind);
                }
            },
            // 选择月份
            analysisChangeMonth(String,temp,index){
                if (String === 'trend') {
                    if (this.allkeyDataDate[0] > this.allkeyDataDate[1]) {
                        sessFun.messageFun('warning', '结束时间小于开始时间!')
                    } else {
                        let starT = ''
                        let endT = ''
                        if (temp === 'all') {
                            console.log('总量趋势')
                            let compareLen = this.isMonthLength(this.allkeyDataDate)
                            if (compareLen > 5) {
                                if (index === '0') {
                                    starT = this.allkeyDataDate[0]
                                    endT = timeFormat.getSpecifiedDateStr(this.allkeyDataDate[0], -5).substring(0, 7)
                                } else if (index === '1') {
                                    starT = timeFormat.getSpecifiedDateStr(this.allkeyDataDate[1], 5).substring(0, 7)
                                    endT = this.allkeyDataDate[1]
                                }
                                this.allkeyDataDate = [starT, endT]
                                sessFun.messageFun('warning', '月份跨度不能大于六个月!')
                            }
                            this.allkeyDataTime = '其它'
                            this.keydataRadio(this.allkeydatakind, temp)
                        } else if (temp === 'add') {
                            console.log('增量趋势')
                            let compareLen = this.isMonthLength(this.addkeyDataDate)
                            if (compareLen > 5) {
                                if (index === '0') {
                                    starT = this.addkeyDataDate[0]
                                    endT = timeFormat.getSpecifiedDateStr(this.addkeyDataDate[0], -5).substring(0, 7)
                                } else if (index === '1') {
                                    starT = timeFormat.getSpecifiedDateStr(this.addkeyDataDate[1], 5).substring(0, 7)
                                    endT = this.addkeyDataDate[1]
                                }
                                this.addkeyDataDate = [starT, endT]
                                sessFun.messageFun('warning', '月份跨度不能大于六个月!')
                            }
                            this.addkeyDataTime = '其它'
                            this.keydataRadio(this.addkeyDataKind, temp)
                        }
                    }
                }
            },
            // 时间切换（三个月、半年、全部） TOrderTime
            RadioTime(val, string){
                console.log('val',val,'string',string)
                let String = ''
                let starTime = ''
                let endTime = timeFormat.returnMonthCount(0,'-')
                if (val === '最近三个月') {
                    starTime = timeFormat.returnMonthCount(2,'-')
                } else if (val === '最近半年') {
                    starTime = timeFormat.returnMonthCount(5,'-')
                } else if (val === '全部') {
                    String = 'allTime'
                }
                switch (string) {
                    case 'all':
                        // 关键数据总量
                        this.allkeyDataDate = [starTime.substring(0,7),endTime.substring(0,7)]
                        this.keydataRadio(this.allkeydatakind,string)
                        break;
                    case 'add':
                        // 关键数据增量
                        this.addkeyDataDate = [starTime.substring(0,7),endTime.substring(0,7)]
                        this.dateCompare = false
                        this.CountOfIncreDataShow.dateCompare = this.CountOfIncreData.timeData
                        this.CountOfIncreDataShow.AddDataCP = []
                        let dateTime = this.changeTime(this.addkeyDataDate[0]) + '-' + this.changeTime(this.addkeyDataDate[1])
                        this.CountOfIncreDataShow.TitleDate = [dateTime]
                        console.log('dateTime',dateTime,this.addkeyDataDate)
                        this.keydataRadio(this.addkeyDataKind,string)
                        break;
                    case 'TOrder':
                        // 行业订单
                        this.TOrderDate = [starTime.substring(0,7),endTime.substring(0,7)]
                        this.initIOrderData()
                        for(let key of this.selectIndustry){
                            this.getIOrderData(key)
                        }
                        break;
                    case 'adOwner':
                        // 广告主排行
                        this.adOwnerDate = [starTime, endTime]
                        this.getAdOwnerData(String)
                        break;
                    case 'salesRank':
                        // 销售业绩排行
                        this.salesRankDate = [starTime, endTime]
                        this.getSalesRankData(String)
                        break;
                    case 'resPMC':
                        // 入驻物业排行
                        this.resPMCDate = [starTime, endTime]
                        this.getResPMCRankData(String)
                        break;
                    default:
                        console.log('时间切换异常',string);
                }
            },
            // 关键数据总量/增量趋势 - 社区接口
            getAllResData(temp) {
                let dateList = this.returnKeyDate(temp)
                console.log('dateList',dateList)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(),
                    onStart: this.returnDate(dateList[0], 'start'),
                    onEnd: this.returnDate(dateList[1])
                }
                console.log('关键数据总量/增量趋势 - params',params)
                api.getApi(this.apiVar.Count + '/GetResCountOfTotalAndIncrement', params).then(res => {
                    console.log('社区数据', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        if (dataArr.length > 0) {
                            // 总量
                            this.CountOfTotalData.res = []
                            this.CountOfTotalData.timeData = []
                            // 增量
                            this.CountOfIncreData.res = []
                            if (temp === 'allAndAdd') {
                                // 设置关键数据总量
                                this.setAllKeyDataShow(dataArr)
                                // 设置关键数据增量
                                this.setAddKeyDataShow(dataArr, params)
                            } else if (temp === 'all') {
                                this.setAllKeyDataShow(dataArr)
                            } else if (temp === 'add') {
                                this.setAddKeyDataShow(dataArr, params)
                            }
                        } else {
                            sessFun.messageFun('warning', '社区总量趋势,在该时段暂无数据!')
                        }
                    }
                })
            },
            // 关键数据总量/增量趋势 - 广告门接口
            getAllMediaData(temp) {
                let dateList = this.returnKeyDate(temp)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(),
                    onStart: this.returnDate( dateList[0], 'start'),
                    onEnd: this.returnDate( dateList[1])
                }
                api.getApi(this.apiVar.Count + '/GetMediaCountOfTotalAndIncrement', params).then(res => {
                    console.log('广告门总量趋势', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.media = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.media = []
                        if (temp === 'allAndAdd') {
                            // 设置关键数据总量
                            this.setAllKeyDataShow(dataArr)
                            // 设置关键数据增量
                            this.setAddKeyDataShow(dataArr, params)
                        } else if (temp === 'all') {
                            this.setAllKeyDataShow(dataArr)
                        } else if (temp === 'add') {
                            this.setAddKeyDataShow(dataArr, params)
                        }
                    }
                })
            },
            // 关键数据总量/增量趋势 - 点位数接口
            getAllAdsData(temp) {
                let dateList = this.returnKeyDate(temp)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(),
                    onStart: this.returnDate( dateList[0], 'start'),
                    onEnd: this.returnDate( dateList[1])
                }
                api.getApi(this.apiVar.Count + '/GetAdSpaceCountOfTotalAndIncrement', params).then(res => {
                    console.log('点位数总量趋势', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        this.CountOfTotalData.ads = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.ads = []
                        let dataArr = res.data
                        if (temp === 'allAndAdd') {
                            // 设置关键数据总量
                            this.setAllKeyDataShow(dataArr)
                            // 设置关键数据增量
                            this.setAddKeyDataShow(dataArr, params)
                        } else if (temp === 'all') {
                            this.setAllKeyDataShow(dataArr)
                        } else if (temp === 'add') {
                            this.setAddKeyDataShow(dataArr, params)
                        }
                    }
                })
            },
            // 关键数据总量/增量趋势 - 上刊率接口
            getAllRateData(temp){
                let dateList = this.returnKeyDate(temp)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(),
                    onStart: this.returnDate( dateList[0], 'start'),
                    onEnd: this.returnDate( dateList[1])
                }
                api.getApi(this.apiVar.Count + '/GetPublicationRateTotalAndIncrement', params).then(res=>{
                    console.log('上刊率总量趋势',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.Rate = []
                        this.CountOfIncreData.Rate = []
                        if (temp === 'allAndAdd') {
                            // 设置关键数据总量
                            this.setAllKeyDataShow(dataArr)
                            // 设置关键数据增量
                            this.setAddKeyDataShow(dataArr, params)
                        } else if (temp === 'all') {
                            this.setAllKeyDataShow(dataArr)
                        } else if (temp === 'add') {
                            this.setAddKeyDataShow(dataArr, params)
                        }
                    }
                })
            },
            // 关键数据总量/增量趋势 - 订单接口
            getAllOrderData(temp){
                let dateList = this.returnKeyDate(temp)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(),
                    onStart: this.returnDate( dateList[0], 'start'),
                    onEnd: this.returnDate( dateList[1])
                }
                api.getApi(this.apiVar.Count + '/GetOrderTotalAndIncrement', params).then(res=>{
                    console.log('订单总量/增量趋势',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.order = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.order = []
                        if (temp === 'allAndAdd') {
                            // 设置关键数据总量
                            this.setAllKeyDataShow(dataArr)
                            // 设置关键数据增量
                            this.setAddKeyDataShow(dataArr, params)
                        } else if (temp === 'all') {
                            this.setAllKeyDataShow(dataArr)
                        } else if (temp === 'add') {
                            this.setAddKeyDataShow(dataArr, params)
                        }
                    }
                })
            },
            // 关键数据总量/增量趋势 - 订单总额接口
            getAllOrderPriceData(temp){
                let dateList = this.returnKeyDate(temp)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(),
                    onStart: this.returnDate( dateList[0], 'start'),
                    onEnd: this.returnDate( dateList[1])
                }
                api.getApi(this.apiVar.Count + '/GetOrderIncomeTotalAndIncrement', params).then(res=>{
                    console.log('订单总额/增量趋势',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.orderPrice = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.orderPrice = []
                        if (temp === 'allAndAdd') {
                            // 设置关键数据总量
                            this.setAllKeyDataShow(dataArr)
                            // 设置关键数据增量
                            this.setAddKeyDataShow(dataArr, params)
                        } else if (temp === 'all') {
                            this.setAllKeyDataShow(dataArr)
                        } else if (temp === 'add') {
                            this.setAddKeyDataShow(dataArr, params)
                        }
                    }
                })
            },
            // 关键数据总量/增量趋势 - 广告主数接口
            getAllAdOwnerData(temp){
                let dateList = this.returnKeyDate(temp)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(),
                    onStart: this.returnDate( dateList[0], 'start'),
                    onEnd: this.returnDate( dateList[1])
                }
                api.getApi(this.apiVar.Count + '/GetAdOwnerTotalAndIncrement', params).then(res=>{
                    console.log('广告主总数/增量趋势',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.adOwner = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.adOwner = []
                        if (temp === 'allAndAdd') {
                            // 设置关键数据总量
                            this.setAllKeyDataShow(dataArr)
                            // 设置关键数据增量
                            this.setAddKeyDataShow(dataArr, params)
                        } else if (temp === 'all') {
                            this.setAllKeyDataShow(dataArr)
                        } else if (temp === 'add') {
                            this.setAddKeyDataShow(dataArr, params)
                        }
                    }
                })
            },
            // 判断使用时间--总量/增量
            returnKeyDate(temp){
                if (temp === 'allAndAdd' || temp === 'all'){
                    return this.allkeyDataDate
                } else if(temp === 'add'){
                    return this.addkeyDataDate
                }
            },
            // 关键数据总量趋势 - 数据展示
            setAllKeyDataShow(dataArr){
                this.CountOfTotalData.timeData = []
                let totalData = []
                for(let key of dataArr){
                    if (this.allkeydatakind === '上刊率') {
                        totalData.push(Math.floor(key.totalPublicationRate * 10000)/100)
                    } else if(this.allkeydatakind === '订单总额') {
                        totalData.push((key.total / 100).toFixed(2) || 0)
                    } else {
                        totalData.push(key.total)
                    }
                    this.CountOfTotalData.timeData.push(key.month)
                }
                switch (this.allkeydatakind) {
                    case '社区数':
                        this.CountOfTotalData.res = totalData
                        break;
                    case '广告门数':
                        this.CountOfTotalData.media = totalData
                        break;
                    case '点位数':
                        this.CountOfTotalData.ads = totalData
                        break;
                    case '上刊率':
                        this.CountOfTotalData.Rate = totalData
                        break;
                    case '订单数':
                        this.CountOfTotalData.order = totalData
                        break;
                    case '订单总额':
                        this.CountOfTotalData.orderPrice = totalData
                        break;
                    case '广告主数':
                        this.CountOfTotalData.adOwner = totalData
                        break;
                    default:
                        console.log('总量显示异常', this.allkeydatakind);
                }
                // 关键数据总量
                this.CountOfTotalDataShow.numData = totalData
                this.CountOfTotalDataShow.timeData = this.CountOfTotalData.timeData.concat()
                this.keyDataLine()
            },
            // 关键数据增量趋势 - 数据展示
            setAddKeyDataShow(dataArr,params) {
                let addData = []
                this.CountOfIncreData.timeData = []
                for (let key of dataArr) {
                    if (this.addkeyDataKind === '上刊率') {
                        addData.push(Math.floor(key.publicationRate * 10000) / 100)
                    } else if (this.addkeyDataKind === '订单总额') {
                        addData.push((key.increment / 100).toFixed(0) || 0)
                    } else {
                        addData.push(key.increment)
                    }
                    this.CountOfIncreData.timeData.push(key.month)
                }
                switch (this.addkeyDataKind) {
                    case '社区数':
                        this.CountOfIncreData.res = addData
                        break;
                    case '广告门数':
                        this.CountOfIncreData.media = addData
                        break;
                    case '点位数':
                        this.CountOfIncreData.ads = addData
                        break;
                    case '上刊率':
                        this.CountOfIncreData.Rate = addData
                        break;
                    case '订单数':
                        this.CountOfIncreData.order = addData
                        break;
                    case '订单总额':
                        this.CountOfIncreData.orderPrice = addData
                        break;
                    case '广告主数':
                        this.CountOfIncreData.adOwner = addData
                        break;
                    default:
                        console.log('增量显示异常', this.addkeyDataKind);
                }
                // 关键数据增量显示
                this.CountOfIncreDataShow.AddData = addData
                this.CountOfIncreDataShow.dateCompare =this.CountOfIncreData.timeData.concat()
                let dateTime = this.changeTime(params.onStart.substring(0, 7)) + '-' + this.changeTime(params.onEnd.substring(0, 7))
                this.CountOfIncreDataShow.TitleDate = [dateTime]
                if (this.dateCompare && this.addkeyCompareDate[0] && this.addkeyCompareDate[1]) {
                    this.addKeyDataChangeMonthCompare('init')
                } else {
                    this.keyDataBar()
                }
                console.log('关键数据增量显示',this.CountOfIncreDataShow)
            },
            // 关键数据增量对比 - radio月份对比
            compareRadio() {
                if (this.dateCompare) {
                    this.addKeyDataChangeMonthCompare()
                } else {
                    this.CountOfIncreDataShow.dateCompare = this.CountOfIncreData.timeData
                    this.CountOfIncreDataShow.AddDataCP = []
                    let dateTime = this.changeTime(this.addkeyDataDate[0]) + '-' + this.changeTime(this.addkeyDataDate[1])
                    this.CountOfIncreDataShow.TitleDate = [dateTime]
                    if (this.addkeyDataKind === '社区数') {
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.res
                    } else if (this.addkeyDataKind === '广告门数') {
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.media
                    } else if (this.addkeyDataKind === '点位数') {
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.ads
                    } else if (this.addkeyDataKind === '上刊率') {
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.Rate
                    } else if (this.addkeyDataKind === '订单数') {
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.order
                    } else if (this.addkeyDataKind === '订单总额') {
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.orderPrice
                    } else if (this.addkeyDataKind === '广告主数') {
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.adOwner
                    }
                    console.log('关键数据增量对比 - radio月份对比',this.CountOfIncreDataShow)
                    this.keyDataBar()
                }
            },
            // 关键数据增量对比 - 月份对比
            addKeyDataChangeMonthCompare(temp){
                console.log('关键数据增量对比 - 月份对比',this.addkeyCompareDate)
                if(this.addkeyCompareDate[0] && this.addkeyCompareDate[1]){
                    let compareLen = this.isMonthLength(this.addkeyCompareDate)
                    // 比较两对比月份间隔是否相等
                    let Len = this.isMonthLength(this.addkeyDataDate)
                    if (Len !== compareLen) {
                        sessFun.messageFun('warning', '请选择相同的月份数量!')
                        if (temp === 'init') {
                            this.keyDataBar()
                        }
                    } else {
                        let onStart = this.addkeyCompareDate[0]
                        let onEnd = this.addkeyCompareDate[1]
                        let params = {
                            uid: this.sessionData.uID,
                            token: this.sessionData.token,
                            onStart: this.returnDate(onStart, 'start'),
                            onEnd: this.returnDate(onEnd),
                            asrIDs: this.returnAsrID()
                        }
                        let url = this.isKeyDataKind(this.addkeyDataKind)
                        api.getApi(this.apiVar.Count + url, params).then(res => {
                            console.log('关键数据增量月份对比', res)
                            let dataArr = res.data
                            if (this.addkeyDataKind === '订单总额') {
                                this.setKetDataMonthCompare(dataArr, 'price')
                            } else if (this.addkeyDataKind === '上刊率') {
                                this.setKetDataMonthCompare(dataArr, 'rate')
                            } else {
                                this.setKetDataMonthCompare(dataArr)
                            }

                        })
                    }
                } else {
                    console.log('时间段还未选择完成',)
                }
            },
            //设置关键数据增量月份对比数据
            setKetDataMonthCompare(data,String){
                let AddData = []
                let monthList = []
                for(let key of data){
                    if(String === 'price'){
                        AddData.push((key.increment/100).toFixed(0) || 0)
                    }else if(String === 'rate'){
                        AddData.push(Math.floor(key.publicationRate * 10000)/100)
                    }else{
                        AddData.push(key.increment)
                    }
                    monthList.push(key.month)
                }
                let showTime = this.CountOfTotalDataShow.timeData
                let tempDate = []
                for (let i = 0; i < showTime.length; i++) {
                    tempDate.push(this.changeTime(showTime[i]) + '对比' + this.changeTime(monthList[i]))
                }
                this.CountOfIncreDataShow.AddDataCP = AddData
                this.CountOfIncreDataShow.dateCompare = tempDate
                let starT = this.changeTime(this.addkeyDataDate[0]) + '-' + this.changeTime(this.addkeyDataDate[1])
                let endT = this.changeTime(this.addkeyCompareDate[0]) + '-' + this.changeTime(this.addkeyCompareDate[1])
                let timeArr = [starT,endT]
                this.CountOfIncreDataShow.TitleDate = timeArr
                console.log('月份对比数据TitleDate',this.CountOfIncreDataShow.TitleDate)
                console.log('月份对比数据timeArr',timeArr)
                this.keyDataBar()
            },
            // 判断社区、媒体、点位
            isKeyDataKind(val){
                let url = ''
                switch (val) {
                    case '社区数':
                        url = '/GetResCountOfTotalAndIncrement'
                        break;
                    case '广告门数':
                        url = '/GetMediaCountOfTotalAndIncrement'
                        break;
                    case '点位数':
                        url = '/GetAdSpaceCountOfTotalAndIncrement'
                        break;
                    case '上刊率':
                        url = '/GetPublicationRateTotalAndIncrement'
                        break;
                    case '订单数':
                        url = '/GetOrderTotalAndIncrement'
                        break;
                    case '订单总额':
                        url = '/GetOrderIncomeTotalAndIncrement'
                        break;
                    case '广告主数':
                        url = '/GetAdOwnerTotalAndIncrement'
                        break;
                    default:
                        console.log('切换异常', this.allkeydatakind);
                }
                return url
            },
            // 关键数据总量趋势 折线图
            keyDataLine() {
                if(this.keyDataLineEchart){
                    this.keyDataLineEchart.dispose()
                }
                this.keyDataLineEchart = this.$echarts.init(this.$refs.keyDataLine)
                let that = this
                this.keyDataLineEchart.setOption({
                    tooltip: {
                        //提示框
                        trigger: "axis", //触发类型(坐标轴触发)
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#4AA6FC'
                            }
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: function (params) {
                            return '<p class="echarts_tooltip_title"><span>' + '时间' + '</span>' + '<span>' + '数值' + '</span></p>' + '<br/>' +
                            '<p class="echarts_tooltip_content">' +
                            '<span>' + params[0].name + '</span>' + (that.allkeydatakind === '上刊率' ? params[0].value + '%' : params[0].value) + '</p>'
                        },
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "14%",
                        containLabel: true
                    },
                    xAxis: {
                        type: "category",
                        boundaryGap: false, // 坐标的刻度是否在中间
                        data: this.CountOfTotalDataShow.timeData,
                        axisLine: {
                            // 坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            // 坐标轴刻度标签
                            margin: 10, // 刻度标签与轴线之间的距离
                            textStyle: {
                                fontFamily: "DINPro-Regular",
                                color: "#2C313C" // 坐标轴刻度文字的颜色
                            }
                        },
                    },
                    yAxis: this.allkeydatakind === '上刊率' ?
                        [
                            {          //纵轴标尺固定
                                type: 'value',
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
                            data: this.CountOfTotalDataShow.numData,
                            type: "line",
                            color: "rgba(58,160,255,0.3)",
                            smooth: false,
                            areaStyle: {}, // 区域填充样式
                            itemStyle: {
                                normal: {
                                    lineStyle: {
                                        width: 2, //折线宽度
                                        color: "#1890ff" //折线颜色
                                    }
                                }
                            }
                        }
                    ]
                });
                this.isReskeyDataKind = false
                this.keyDataLineLoading = false
            },
            // 关键数据增量对比 柱状图
            keyDataBar() {
                if(this.KeyDataBarEchart){
                    this.KeyDataBarEchart.dispose()
                }
                this.KeyDataBarEchart = this.$echarts.init(this.$refs.keyDataBar);
                console.log('KeyDataBarEchart',this.addkeyDataKind)
                let that = this
                this.KeyDataBarEchart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {             // 坐标轴指示器，坐标轴触发有效
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
                            if (params.length >= 2) {
                                return '<p class="echarts_tooltip_title"><span>' + '时间' + '</span>' + '<span>' + '数值' + '</span></p>' + '<br/>' +
                                    '<p class="echarts_tooltip_content">' +
                                    '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC;"></i>' + params[0].name.substr(0, 7) + '</span>' + (that.addkeyDataKind === '上刊率' ? params[0].data + '%' : params[0].data)  + '</p>' +
                                    '<p class="echarts_tooltip_content">' +
                                    '<span><i class="echarts_tooltip_i" style="background-color: #BDDEFD;"></i>' + params[0].name.slice(9) + '</span>' + (that.addkeyDataKind === '上刊率' ? params[1].data + '%' : params[1].data)  + '</p>'
                            } else {
                                return '<p class="echarts_tooltip_title""><span>' + '时间' + '</span>' + '<span>' + '数值' + '</span></p>' + '<br/>' +
                                    '<p class="echarts_tooltip_content">' +
                                    '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params[0].name.substr(0, 7) + '</span>' + (that.addkeyDataKind === '上刊率' ? params[0].value + '%' : params[0].value) + '</p>'
                            }
                        },
                    },
                    legend: {
                        left: 'center',
                        data: this.CountOfIncreDataShow.TitleDate,
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.CountOfIncreDataShow.dateCompare,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                //坐标轴刻度标签
                                margin: 7, //刻度标签与轴线之间的距离
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C" //坐标轴刻度文字的颜色
                                }
                            },
                            axisLine: {
                                //坐标轴线条相关设置(颜色等)
                                lineStyle: {
                                    color: "#E8E8E8"
                                }
                            },
                        }
                    ],
                    yAxis: this.addkeyDataKind === '上刊率' ?
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
                            name: this.CountOfIncreDataShow.TitleDate[0],
                            type: 'bar',
                            barWidth: '10%',
                            data: this.CountOfIncreDataShow.AddData,
                        },
                        {
                            color: '#BDDEFD',
                            name: this.CountOfIncreDataShow.TitleDate[1],
                            type: 'bar',
                            barWidth: '10%',
                            data: this.CountOfIncreDataShow.AddDataCP,
                        }
                    ]
                });
                this.isAddkeyDataKind = false
                this.keyDataBarLoading = false
            },

            /*行业订单总量趋势*/
            initIOrderData(){
                this.totalOrderTitleShow = []
                this.totalOrderPrice = []                        //  订单金额
                this.totalOrderNumber = []                       //  订单数量
                this.totalOrderAdOwner = []                      //  广告主数
            },
            // 行业订单总量趋势 - 行业选择
            IOrderChange() {
                if (this.selectIndustry.length > 0) {
                    let industryData = this.selectIndustry
                    let beforeIndustryData = this.beforeSelectIndustry
                    let industryDataShow = this.totalOrderDataShow
                    console.log('一级行业',this.industryData,'折线数据',this.totalOrderDataShow)
                    if (beforeIndustryData.length > industryData.length) {
                        // console.log('行业减少了',)
                        for (let BData of beforeIndustryData) {
                            let isFind = industryData.some(item =>{
                                if(item == BData){
                                    return true
                                }
                            })
                            if (!isFind) {
                                // 删除数据
                                for (let showData of industryDataShow) {
                                    if (showData.iid === BData) {
                                        showData.data = []
                                        // 删除标题
                                        for (let i = 0; i < this.totalOrderTitleShow.length; i++) {
                                            if (showData.name === this.totalOrderTitleShow[i]) {
                                                this.totalOrderTitleShow.splice(i, 1)
                                                break
                                            }
                                        }
                                        this.busOrderLine()
                                        this.DelAllOrderData(showData.name)
                                        break
                                    }
                                }
                                break
                            }
                        }
                    } else {
                        // console.log('行业增加了',)
                        this.TOrderTitleRadio = '订单金额'
                        this.getIOrderData(industryData[industryData.length - 1])
                    }
                    this.beforeSelectIndustry = industryData.concat()
                } else {
                    sessFun.messageFun('warning', '行业不能为空!')
                    this.selectIndustry = this.beforeSelectIndustry.concat()
                }
            },
            // 行业订单总量趋势 - 删除原数据
            DelAllOrderData(orderName){
                for(let i=0; i<this.totalOrderPrice.length;i++){
                    if(this.totalOrderPrice[i].name === orderName){
                        console.log('行业订单总量趋势 - 删除原数据',this.totalOrderPrice[i])
                        this.totalOrderPrice.splice(i,1)
                        this.totalOrderNumber.splice(i,1)
                        this.totalOrderAdOwner.splice(i,1)
                        break
                    }
                }
                console.log(orderName,'删除原数据-',this.totalOrderPrice,this.totalOrderNumber,this.totalOrderAdOwner)
            },
            // 行业订单总量趋势 - 选择月份
            orderChangeMonth(index){
                if (this.TOrderDate[0] > this.TOrderDate[1]) {
                    sessFun.messageFun('warning', '结束时间小于开始时间!')
                } else {
                    let starT = ''
                    let endT = ''
                    let compareLen = this.isMonthLength(this.TOrderDate)
                    if (compareLen > 5) {
                        if(index === '0'){
                            starT =  this.TOrderDate[0]
                            endT = timeFormat.getSpecifiedDateStr(this.TOrderDate[0],-5).substring(0,7)
                        }else if(index === '1'){
                            starT = timeFormat.getSpecifiedDateStr(this.TOrderDate[1],5).substring(0,7)
                            endT = this.TOrderDate[1]
                        }
                        this.TOrderDate = [starT,endT]
                        sessFun.messageFun('warning', '月份跨度不能大于六个月!')
                    }
                    this.TOrderTime = '其它'
                    // console.log('行业订单总量趋势 - 选择月份',this.card5Industry)
                    this.initIOrderData()
                    for (let i = 0; i < this.selectIndustry.length; i++) {
                        this.getIOrderData(this.selectIndustry[i])
                    }

                }
            },
            // 行业订单总量趋势 - Radio
            totleOrderRadio(val){
                console.log('行业订单总量趋势 - Radio',val)
                if (val === '订单金额'){
                    this.totalOrderDataShow =  this.totalOrderPrice.concat()           //  折线数据
                }else if (val === '订单数量'){
                    this.totalOrderDataShow =  this.totalOrderNumber.concat()           //  折线数据
                }else if (val === '广告主数'){
                    this.totalOrderDataShow =  this.totalOrderAdOwner.concat()           //  折线数据
                }
                this.busOrderLine()
            },
            // 行业订单总量趋势 - 接口
            getIOrderData(val){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    iid: val,
                    istart: this.TOrderDate[0],
                    iend: this.TOrderDate[1],
                    asrIDs: this.returnAsrID()
                }
                api.getApi(this.apiVar.Count + '/GetIOrder', params).then(res =>{
                    console.log(params,'行业订单总量趋势 - 接口',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()
                    } else {
                        let dataArr = res.data
                        if (dataArr.length > 0) {
                            let orderPrice = {name: dataArr[0].iName,iid: val, type: 'line', data: []}
                            let orderNumber = {name: dataArr[0].iName,iid: val, type: 'line', data: []}
                            let orderAdOwner = {name: dataArr[0].iName,iid: val, type: 'line', data: []}
                            let orderMonths = []
                            for (let OKey of dataArr) {
                                if (!OKey.orderTotal) {
                                    orderPrice.data.push(0)
                                } else {
                                    orderPrice.data.push((OKey.orderTotal / 100).toFixed(0))
                                }
                                orderNumber.data.push(OKey.apCount)
                                orderAdOwner.data.push(OKey.comCount)
                                orderMonths.push(OKey.moth)
                            }
                            this.totalOrderPrice.push(orderPrice)                         //  订单金额
                            this.totalOrderNumber.push(orderNumber)                       //  订单数量
                            this.totalOrderAdOwner.push(orderAdOwner)                     //  广告主数
                            this.totleOrderRadio(this.TOrderTitleRadio)
                            // this.totalOrderDataShow = this.totalOrderPrice.concat()       //  折线数据
                            this.totalOrderTitleShow.push(orderPrice.name)                //  折线标题
                            console.log('行业订单总量趋势', this.totalOrderPrice, this.totalOrderNumber, this.totalOrderAdOwner)
                            this.totalOrderDate = orderMonths
                            this.busOrderLine()
                        } else {
                            sessFun.messageFun('warning','行业订单总量趋势,在该时段暂无数据')
                        }
                    }
                })
            },
            // 行业订单总量趋势 折线图
            busOrderLine() {
                if(this.busOrderLineEchart){
                    this.busOrderLineEchart.dispose()
                }
                this.busOrderLineEchart = this.$echarts.init(this.$refs.orderLine);
                this.busOrderLineEchart.setOption({
                    color: this.colorArr,
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            let title = '';
                            let arr = [];
                            for (let i = 0; i < params.length; i++) {
                                title = '<p class="echarts_tooltip_title"><span>' + '行业(' + params[i].name + ')' + '</span>' + '<span>' + '数量' + '</span></p>' + '<br/>'
                                let data = '<p class="echarts_tooltip_content">' +
                                    '<span><i class="echarts_tooltip_i" style="background: '+ params[i].color +'"></i>' + params[i].seriesName + '</span>' + params[i].value + '</p>'
                                arr.push(data)
                            }
                            let tooltip = arr.join('');
                            return title + tooltip
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
                        data: this.totalOrderTitleShow
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.totalOrderDate,
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
                    },
                    yAxis: {
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
                    },
                    series: this.totalOrderDataShow,
                });
            },
            /*  行业订单占比  */
            //行业订单-radio
            IOrderRadio(val) {
                console.log(val, this.IOrderTotal)
                if (val === '订单金额') {
                    this.IOrderDataShow[0].data = this.IOrderTotalArr[0].data
                    this.IOrderDataShow[1].legendData = this.IOrderTotalArr[1].legendData
                    this.IOrderTotalShow = this.IOrderTotal.orderTotal
                } else if (val === '订单数量') {
                    this.IOrderDataShow[0].data = this.IOrderApCount[0].data
                    this.IOrderDataShow[1].legendData = this.IOrderApCount[1].legendData
                    this.IOrderTotalShow = Number(this.IOrderTotal.apCount)
                } else if (val === '广告主数') {
                    this.IOrderDataShow[0].data = this.IOrderComCount[0].data
                    this.IOrderDataShow[1].legendData = this.IOrderComCount[1].legendData
                    this.IOrderTotalShow = Number(this.IOrderTotal.comCount)
                }
                this.allOrderPie()
            },
            //行业订单占比 - 接口
            getIOrderTotalData() {
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID()
                }
                api.getApi(this.apiVar.Count + '/GetAllIOrder', params).then(res => {
                    console.log('行业订单占比', res)
                    let dataArr = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    } else {
                        if (dataArr.length > 0) {
                            this.IOrderTotalArr = [{data: []}, {legendData: []}],// 行业订单占比-订单金额
                                this.IOrderApCount = [{data: []}, {legendData: []}],// 行业订单占比-订单数量
                                this.IOrderComCount = [{data: []}, {legendData: []}],// 行业订单占比-广告主数
                                this.IOrderTotal = {orderTotal: 0, apCount: 0, comCount: 0}
                            dataArr.sort(this.compareSort('orderTotal'))
                            this.IOrderData = dataArr
                            console.log('行业订单占比 - 接口', this.IOrderData)
                            let otherTotal = 0
                            let otherApCount = 0
                            let otherComCount = 0
                            for (let i = 0; i < dataArr.length; i++) {
                                this.IOrderTotal.orderTotal += Number((dataArr[i].orderTotal / 100).toFixed(0))
                                this.IOrderTotal.apCount += dataArr[i].apCount
                                this.IOrderTotal.comCount += dataArr[i].comCount
                                if (i <= 4) {
                                    let tempTotal = {
                                        value: (dataArr[i].orderTotal / 100).toFixed(0),
                                        name: dataArr[i].iName
                                    }
                                    this.IOrderTotalArr[0].data.push(tempTotal)
                                    this.IOrderTotalArr[1].legendData.push(tempTotal.name)

                                    let tempApCount = {value: dataArr[i].apCount, name: dataArr[i].iName}
                                    this.IOrderApCount[0].data.push(tempApCount)
                                    this.IOrderApCount[1].legendData.push(tempApCount.name)

                                    let tempComCount = {value: dataArr[i].comCount, name: dataArr[i].iName}
                                    this.IOrderComCount[0].data.push(tempComCount)
                                    this.IOrderComCount[1].legendData.push(tempComCount.name)
                                } else {
                                    otherTotal += Number((dataArr[i].orderTotal / 100).toFixed(0))
                                    otherApCount += dataArr[i].apCount
                                    otherComCount += dataArr[i].comCount
                                }
                            }
                            // 订单金额
                            this.IOrderTotalArr[0].data.push({value: otherTotal, name: '其它'})
                            this.IOrderTotalArr[1].legendData.push({value: otherTotal, name: '其它'})
                            // 订单数量
                            this.IOrderApCount[0].data.push({value: otherApCount, name: '其它'})
                            this.IOrderApCount[1].legendData.push({value: otherApCount, name: '其它'})
                            // 广告主数
                            this.IOrderComCount[0].data.push({value: otherComCount, name: '其它'})
                            this.IOrderComCount[1].legendData.push({value: otherComCount, name: '其它'})
                            // 默认显示订单金额
                            this.IOrderTotalShow = this.IOrderTotal.orderTotal
                            this.IOrderDataShow[0].data = this.IOrderTotalArr[0].data
                            this.IOrderDataShow[1].legendData = this.IOrderTotalArr[1].legendData
                            this.allOrderPie()
                        } else {
                            console.log('行业订单占比,暂无数据')
                        }
                    }
                })
            },
            // 行业订单占比 饼图
            allOrderPie() {
                if(this.allOrderPieEcharts){
                    this.allOrderPieEcharts.dispose()
                }
                this.allOrderPieEcharts = this.$echarts.init(this.$refs.allOrderPie);
                let that = this
                this.allOrderPieEcharts.setOption({
                    tooltip: {
                        trigger: "item",
                        formatter: function (params) {
                            return '<p class="echarts_tooltip_title"><span>' + params.name + '</span></p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' + params.seriesName + '</span>' + params.value + '</p>' +
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
                        icon: "circle",
                        itemWidth: 8,
                        itemHeight: 8,
                        // padding: 18,
                        itemGap: 25,
                        align: "left",
                        orient: "vertical",
                        left: "60%",
                        top: "20%",
                        bottom: 20,
                        x: "right",
                        textStyle: {
                            fontSize: "14",
                            fontFamily: "DINPro-Regular",
                        },
                        data: this.IOrderDataShow[1].legendData,
                        formatter: function (params) {
                            for (let i = 0; i < that.IOrderDataShow[0].data.length; i++) {
                                if (that.IOrderDataShow[0].data[i].name == params) {
                                    if (params.length === 2) {
                                        return (params + "             |      " + Math.round(that.IOrderDataShow[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%");
                                    } else if (params.length === 3 || params === '3C数码') {
                                        return (params + "        |      " + Math.round(that.IOrderDataShow[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%")
                                    } else if (params.length === 4 && params !== '3C数码') {
                                        return (params + "      |      " + Math.round(that.IOrderDataShow[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%")
                                    } else if(params.length === 5){
                                        return (params + "  |      " + Math.round(that.IOrderDataShow[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%")
                                    }else {
                                        return (params + " |      " + Math.round(that.IOrderDataShow[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%");
                                    }
                                }
                            }
                        }
                    },
                    series: [
                        {
                            center: ["28%", "50%"],
                            name: this.orderScale,
                            type: "pie",
                            radius: ["50%", "70%"],
                            color: [
                                "#8543E0",
                                "#1890FF",
                                "#13C2C2",
                                "#2FC25B",
                                "#FACC14",
                                "#F04864",
                                "#8543E0"
                            ],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: "center",
                                    formatter: "{a}\n{b}: ￥{c}"
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: "20",
                                        fontWeight: "bold",
                                        color: "#000"
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: this.IOrderDataShow[0].data
                        }
                    ]
                });
            },
            /*  入驻物业排行  */
            // 入驻物业排行 - 按钮切换
            resPMCRadio(val) {
                if (val === '社区数量') {
                    this.ResPMCShowData = this.ResPMCResCount
                } else if (val === '点位数量') {
                    this.ResPMCShowData = this.ResPMCMCount
                }
                this.PropertyRank()
            },
            // 入驻物业排行 - 接口
            getResPMCRankData(Sting) {
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    istart: this.resPMCDate[0],
                    iend: this.resPMCDate[1],
                    asrIDs: this.returnAsrID()
                }
                if(Sting === 'allTime'){
                    delete(params.istart)
                    delete(params.iend)
                }
                api.getApi(this.apiVar.Count + '/GetResPMC', params).then(res => {
                    console.log('销售业绩排行', res)
                    let ResPMCdata = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    }else {
                        if (ResPMCdata.length > 0) {
                            this.isHavePropertyRankData = true
                            this.ResPMCResCount = []
                            this.ResPMCMCount = []
                            this.ResPMCName = []
                            ResPMCdata.sort(this.compareSort('resCount'))
                            this.ResPMCRankData = ResPMCdata
                            for (let i = 0; i < ResPMCdata.length; i++) {
                                if (i <= 8) {
                                    this.ResPMCResCount.push(ResPMCdata[i].resCount)
                                    this.ResPMCMCount.push(ResPMCdata[i].mCount)
                                    this.ResPMCName.push(ResPMCdata[i].resPMC)
                                } else {
                                    break
                                }
                            }
                            if (this.PMCDataTitle === '社区数量') {
                                this.ResPMCShowData = this.ResPMCResCount
                            } else if (this.PMCDataTitle === '点位数量') {
                                this.ResPMCShowData = this.ResPMCMCount
                            }
                            // 手动异步渲染确保在有无数据的显示隐藏之间的切换可以正常显示
                            let timer = setTimeout(()=>{
                                this.PropertyRank()
                                clearTimeout(timer)
                            },10)
                        } else {
                            this.isHavePropertyRankData = false
                        }
                    }
                })
            },
            // 入驻物业排行 - 柱状图
            PropertyRank() {
                if (this.ResPMCShowData.length) {
                    if (this.PropertyRankEchart) {
                        this.PropertyRankEchart.dispose()
                    }
                    this.PropertyRankEchart = this.$echarts.init(this.$refs.PropertyRank);
                    this.PropertyRankEchart.setOption({
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
                                return '<p class="echarts_tooltip_title"><span>' + params[0].name + '</span></p>' + '<br/>' +
                                    '<p class="echarts_tooltip_content">' +
                                    '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params[0].seriesName + '</span>' + params[0].data + '</p>'
                            },
                        },
                        grid: {
                            top: '10%',
                            left: '3%',
                            right: '4%',
                            bottom: '2%',
                            x: 10,     //控制x轴文字与底部的距离
                            y2: 200,    // y2可以控制倾斜的文字与最右边的距离，放置倾斜的文字超过显示区域
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: this.ResPMCName,
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
                                    // rotate: 25,     //文字逆时针旋转25°
                                    textStyle: {
                                        fontFamily: "DINPro-Regular",
                                        color: "#2C313C" //坐标轴刻度文字的颜色
                                    },
                                    formatter: function(val) {
                                        let strs = val.split(''); //字符串数组
                                        let str = ''
                                        for(let i = 0, s; s = strs[i++];) { //遍历字符串数组
                                            str += s;
                                            if(!(i % 9)) str += '\n'; //按需要求余
                                        }
                                        return str
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
                                name: this.PMCDataTitle === '社区数量'? '小区数' : '点位数',
                                type: 'bar',
                                barWidth: '15%',
                                data: this.ResPMCShowData
                            }
                        ]
                    });
                }
            },
            /*  广告主排行  */
            // 时间选择
            analysisChangeTime(val) {
                if (val === 'adOwner') {
                    this.adOwnerTime = '其它'
                    this.getAdOwnerData()
                } else if (val === 'salesRank') {
                    this.salesRankTime = '其它'
                    this.getSalesRankData()
                } else if (val === 'resPMC') {
                    this.resPMCTime = '其它'
                    this.getResPMCRankData()
                }
            },
            // 按钮切换
            adOwnerRadio(val) {
                console.log('adOwnerDataTitle', this.adOwnerDataTitle)
                if (val === '订单金额') {
                    this.AdOwnerShowData = this.AdOwnerTotalSum
                } else if (val === '订单数量') {
                    this.AdOwnerShowData = this.AdOwnerApCount
                }
                this.adOwnerRank()
            },
            //广告主排行 - 接口
            getAdOwnerData(Sting) {
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    istart: this.adOwnerDate[0],
                    iend: this.adOwnerDate[1],
                    asrIDs: this.returnAsrID()
                }
                if (Sting === 'allTime') {
                    delete(params.istart)
                    delete(params.iend)
                }
                api.getApi(this.apiVar.Count + '/GetCOrder', params).then(res => {
                    console.log('广告主排行 ', res)
                    let dataArr = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    }else {
                        if (dataArr.length > 0) {
                            this.isHaveAdOwnerRank = true
                            dataArr.sort(this.compareSort('totalSum'))
                            this.AdOwnerData = dataArr
                            this.adOwnerRankTable = this.AdOwnerData
                            let name = []
                            let TotalSum = []
                            let ApCount = []
                            for (let i = 0; i < dataArr.length; i++) {
                                if (i <= 7) {
                                    name.push(dataArr[i].cName)
                                    TotalSum.push((dataArr[i].totalSum / 100).toFixed(0))
                                    ApCount.push(dataArr[i].apCount)
                                }
                            }
                            this.AdOwnerName = name
                            this.AdOwnerTotalSum = TotalSum
                            this.AdOwnerApCount = ApCount
                            console.log('名称', this.AdOwnerName, '金额', this.AdOwnerTotalSum, '订单数量', this.AdOwnerApCount)
                            if (this.adOwnerDataTitle === '订单金额') {
                                this.AdOwnerShowData = this.AdOwnerTotalSum
                            } else if (this.salesDataTitle === '订单数量') {
                                this.AdOwnerShowData = this.AdOwnerApCount
                            }
                            let timer = setTimeout(()=>{
                                this.adOwnerRank()
                                clearTimeout(timer)
                            },10)
                        } else {
                            this.isHaveAdOwnerRank = false
                            console.log('22222222',this.isHaveAdOwnerRank)
                        }
                    }
                })
            },
            // 广告主排行 柱状图
            adOwnerRank() {
                if(this.AdOwnerShowData.length){
                    if(this.adOwnerRankEcharts){
                        this.adOwnerRankEcharts.dispose()
                    }
                    this.adOwnerRankEcharts = this.$echarts.init(this.$refs.adOwnerRank);
                    this.adOwnerRankEcharts.setOption({
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {             // 坐标轴指示器，坐标轴触发有效
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
                                return '<p class="echarts_tooltip_title"><span>' + params[0].name + '</span></p>' + '<br/>' +
                                    '<p class="echarts_tooltip_content">' +
                                    '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC;"></i>' + params[0].seriesName + '</span>' + params[0].data + '</p>'
                            },
                        },
                        grid: {
                            top: '10%',
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
                                data: this.AdOwnerName,
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
                                    // rotate: 25,     //文字逆时针旋转45°
                                    textStyle: {
                                        fontFamily: "DINPro-Regular",
                                        color: "#2C313C", //坐标轴刻度文字的颜色
                                        align: "center",
                                    },
                                    formatter: function(val) {
                                        let strs = val.split(''); //字符串数组
                                        let str = ''
                                        for(let i = 0, s; s = strs[i++];) { //遍历字符串数组
                                            str += s;
                                            if(!(i % 9)) str += '\n'; //按需要求余
                                        }
                                        return str
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
                                name: this.adOwnerDataTitle,
                                type: 'bar',
                                barWidth: '15%',
                                data: this.AdOwnerShowData
                            }
                        ]
                    });
                }
            },

            /*  销售业绩排行  */
            // radio
            salesRankRadio(val) {
                // console.log(val)
                if (val === '销售金额') {
                    this.salesRankShowData = this.salesRankTotalSum
                } else if (val === '销售单数') {
                    this.salesRankShowData = this.salesRankApCount
                }
                this.salesRank()
            },
            // 销售业绩排行-接口
            getSalesRankData(Sting) {
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    istart: this.salesRankDate[0],
                    iend: this.salesRankDate[1],
                    asrIDs: this.returnAsrID()
                }

                if (Sting === 'allTime') {
                    delete(params.istart)
                    delete(params.iend)
                }
                api.getApi(this.apiVar.Count + '/GetSOrder', params).then(res => {
                    console.log(params,'销售业绩排行', res)
                    let dataArr =  res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()       // 登录超时
                    }else {
                        if (dataArr.length > 0) {
                            this.isHaveSalesRank = true
                            this.salesRankName = []
                            this.salesRankTotalSum = []
                            this.salesRankApCount = []
                            dataArr.sort(this.compareSort('totalSum'))
                            this.salesRankData = dataArr
                            for (let i = 0; i < dataArr.length; i++) {
                                if (i <= 8) {
                                    this.salesRankName.push(dataArr[i].realName)
                                    this.salesRankTotalSum.push((dataArr[i].totalSum / 100).toFixed(0))
                                    this.salesRankApCount.push(dataArr[i].apCount)
                                } else {
                                    break
                                }
                            }
                            if (this.salesDataTitle === '销售金额') {
                                this.salesRankShowData = this.salesRankTotalSum
                            } else if (this.salesDataTitle === '销售单数') {
                                this.salesRankShowData = this.salesRankApCount
                            }
                            let timer = setTimeout(() => {
                                this.salesRank()
                                clearTimeout(timer)
                            }, 10)
                        } else {
                            this.isHaveSalesRank = false
                        }
                    }
                })
            },
            // 销售业绩排行 柱状图
            salesRank() {
                console.log('this.isHaveSalesRank',this.isHaveSalesRank)
                if(this.salesRankShowData.length){
                    if(this.salesRankEcharts){
                        this.salesRankEcharts.dispose()
                    }
                    this.salesRankEcharts = this.$echarts.init(this.$refs.salesRank);
                    this.salesRankEcharts.setOption({
                        noDataLoadingOption: {
                            text: '暂无数据',
                            effect: 'bubble',
                            effectOption:
                                {
                                    effect:
                                        {
                                            n: 0
                                        }
                                }
                        },
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
                                return '<p class="echarts_tooltip_title"><span>' + params[0].name + '</span></p>' + '<br/>' +
                                    '<p class="echarts_tooltip_content">' +
                                    '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC;"></i>' +
                                    params[0].seriesName + '</span>' + params[0].data + '</p>'
                            },
                        },
                        grid: {
                            top:'10%',
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: this.salesRankName,
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
                                }
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
                                name: this.salesDataTitle,//或销售单数
                                type: 'bar',
                                barWidth: '15%',
                                data: this.salesRankShowData //[8000, 7502, 6650, 5134, 4390, 3330, 2220, 1111, 999]
                            }
                        ],
                    });
                }
            },

            /*  公用方法  */
            // 时间格式转换
            changeTime(stringTime){
                return stringTime.replace(/-/g, '/');
            },
            // 判断时间跨度
            isMonthLength(dataTime){
                let compareYear1 = dataTime[0].substr(0, 4)
                let compareYear2 = dataTime[1].substr(0, 4)
                let compareMonth1 = dataTime[0].substr(5, 2)
                let compareMonth2 = dataTime[1].substr(5, 2)
                let compareLen = (compareYear2 - compareYear1) * 12 + (compareMonth2 - compareMonth1)
                return compareLen
            },
            // 根据权限公司返回 asrIDs
            returnAsrID(){
                if (this.selectCity == '0'){
                    let asrIDs = []
                    for (let key of this.citys) {
                        if(key.value !== '0'){
                            asrIDs.push(key.value)
                        }
                    }
                    return asrIDs.join(',')//'1,2,3,4,5,6,7'
                }else{
                    return this.selectCity
                }
            },
            // 判断是否为当前月份并返回 年-月-日
            returnDate(time,kind){
                let dateList = time.split('-')
                console.log('time',time,'kind',kind,'this.nowMonth',this.nowMonth,'dateList',dateList)
                if (kind === 'start') {
                    return time + '-01'
                } else {
                    if (this.nowMonth == time) {
                        return timeFormat.returnMonthCount(0, '-')
                    } else {
                        // let dateList = time.split('-')
                        let dayNum = new Date(Number(dateList[0]), Number(dateList[1]), 0);
                        console.log('判断是否为当前月份并返回', dayNum.getDate());
                        return time + '-' + dayNum.getDate()
                    }
                }
            },
            // 数据大到小排序
            compareSort(property) {
                console.log('数据大到小排序',property)
                return function (a, b) {
                    let value1 = a[property];
                    let value2 = b[property];
                    return value2 - value1;
                }
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
        }
    }
</script>

<style scoped>
    .index_query_box{
        margin-bottom: 16px;
    }

    /*关键数据展示*/
    .data-tab {
        font-size: 12px;
        color: #808080;
        margin-bottom: 10px;
        height: 30px;
    }

    .date_picker_box{
        display: inline-block;
        vertical-align: middle;
    }

    .popover_span{
        color: #999;
        font-size: 12px;
    }

    .box_card_title{
        font-size:16px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(44,49,60,1);
    }

    .Bradio /deep/ .el-input--small .el-input__inner{
        width: 460px;
    }

    .index_query /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 150px;
    }

    /*行业订单占比*/
    .order_scale {
        position: relative;
    }

    .order_scale .order_pie_title {
        position: absolute;
        z-index: 9;
        top: 42%;
        left: 18%;
        width: 142px;
        height: 70px;
        text-align: center;
        box-sizing: border-box;
    }

    .order_pie_title p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        /*text-align: center;*/
    }

    .order_pie_title h3 {
        font-size: 18px;
        color: rgba(0, 0, 0, 0.85);
        font-family: "DINPro-Regular", "PingFangSC-Regular", "Microsoft YaHei";
    }

    /deep/ .el-table__body-wrapper, .el-table__empty-block{
        min-height: inherit;
    }

    /*  入驻物业排行  */
    /deep/ .el-card__header{
        position: relative;
    }

    .all {
        position: absolute;
        right: 24px;
        top: 20px;
        font-size: 12px;
        color: #4AA6FC;
        cursor: pointer;
    }

    .date_picker /deep/ .el-range-editor--mini.el-input__inner{
        width: 230px;
    }

    @media all and (min-width: 1900px) {
        .order_scale .order_pie_title{
            left: 20.5%;
        }
    }
</style>
