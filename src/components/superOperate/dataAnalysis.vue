<template>
    <div class="wrap data-analysis">
        <div>
            <div class="tabs">
                <div class="tips">
                    <span>数据统计截止至{{toTime}}</span><!--2018年9月13日-->
                    <el-select v-model="currCity" placeholder="请选择" size="mini" @change="changeCity"
                               :disabled="isCitys">
                        <el-option
                            v-for="item in citys"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <el-tabs v-model="activeName" @tab-click="tabHandleClick">
                    <el-tab-pane label="经营概况" name="first">
                        <div class="data-cards">
                            <!--数据总览-->
                            <div class="card card1">
                                <el-card class="box-card" shadow="never">
                                    <div slot="header" class="clearfix">
                                        <span>经营总览
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
                                                  <i slot="reference" class="el-icon-question"
                                                     style="color: #dfdfdf"></i>
                                              </el-popover>
                                        </span>
                                    </div>
                                    <div class="data-wrap">
                                        <div class="data-txt">
                                            <div>社区
                                                <p>{{RMHeadAllData.res}}</p>
                                            </div>
                                            <div>广告门
                                                <p>{{RMHeadAllData.media}}</p>
                                            </div>
                                            <div>上刊率(2019)
                                                <p>{{RMHeadAllData.SK}}%</p>
                                            </div><!--当月上刊率-->
                                            <div>订单(2019)
                                                <p>{{RMHeadAllData.order}}</p>
                                            </div>
                                            <div>现金总额(2019)
                                                <p>&yen;{{priceFormat(RMHeadAllData.cash)}}</p>
                                            </div>
                                            <div>客单价(2019)
                                                <p>&yen;{{priceFormat(RMHeadAllData.price)}}</p>
                                            </div>
                                            <div>广告主
                                                <p>{{RMHeadAllData.customer}}</p>
                                            </div>
                                        </div>
                                        <div class="data-charts all-data-charts"
                                             v-loading="allDataLoading"
                                             element-loading-text="玩命加载中.."
                                             element-loading-spinner="el-icon-loading">
                                            <div class="pie-wrap">
                                                <div id="pieID" class="charts2" ref="allDataPie"
                                                     style="width: 1200px;height: 350px"></div>
                                                <p>社区</p>
                                                <p>广告门</p>
                                                <p>点位</p>
                                                <p>上刊率</p>
                                            </div>
                                            <div class="all-data-charts-city" v-if="selectCityList.length > 1">
                                                <el-select v-model="activeCity" size="mini" placeholder="请选择" @change="changeAsNameCity">
                                                    <el-option
                                                        v-for="item in selectCityList"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                            <div class="more" @click="showCityDataTable"
                                                 v-if="currCity == '0'">全部
                                            </div>
                                            <el-dialog title="城市数据总览" :visible.sync="cityDataTableVisible">
                                                <div class="table-wrap" style="width: 100%">
                                                    <el-table :data="RMAllData" border height="430px"
                                                              class="all-city-data-table-12">
                                                        <el-table-column
                                                            property="city" label="区域" min-width="36%"
                                                        >
                                                        </el-table-column>
                                                        <el-table-column property="countRes" label="社区数" min-width="20%"
                                                                         sortable
                                                                         :sort-orders="[2,1]">

                                                        </el-table-column>
                                                        <el-table-column property="countMedia" label="广告门数"
                                                                         min-width="27%" sortable
                                                                         :sort-orders="[2,1]">

                                                        </el-table-column>
                                                        <el-table-column property="countAds" label="点位数" min-width="27%"
                                                                         sortable
                                                                         :sort-orders="[2,1]">

                                                        </el-table-column>
                                                        <el-table-column label="上刊率" min-width="20%" sortable
                                                                         :sort-method="sortUpPercent">
                                                            <template slot-scope="scope">
                                                                {{scope.row.upPercent}}％
                                                            </template>
                                                        </el-table-column>
                                                    </el-table>
                                                </div>
                                            </el-dialog>
                                            <!--<div class="bottom-data"></div>-->
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <!--关键数据展示-->
                            <!--关键数据总量趋势-->
                            <div class="card card3">
                                <el-card class="box-card" shadow="never">
                                    <div slot="header" class="clearfix">
                                        <span>关键数据总量趋势
                                        <el-popover
                                            placement="right"
                                            width="280"
                                            trigger="hover">
                                            <span class="popover_span">
                                                <em></em>社区：查询月份内截止每个月的社区总量<br>
                                                广告门：查询月份内截止每个月的广告门总量<br>
                                                上刊率：查询月份第一个月为当月上刊率，第二个月份起为查询月份第一个月至该月份的总体上刊率<br>
                                                订单：查询月份内截止每个月的订单总量<br>
                                                现金总额：查询月份内截止每个月的现金金额总量<br>
                                                客单价：现金总额/订单<br>
                                                广告主：查询月份内截止每个月成交的广告主总量<br></span>
                                              <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                                            </el-popover>
                                        </span>
                                    </div>
                                    <div>
                                        <div class="data-tab">
                                            <span>数据：</span>
                                            <el-radio-group v-model="allkeydatakind" size="mini"
                                                            @change="card3TabsRadio(allkeydatakind,'card3',allkeyDataDate)"
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
                                            <span>
                                                <el-radio-group v-model="allkeyDataTime" size="mini"
                                                                @change="RadioTime(allkeyDataTime,'card3',allkeyDataDate)">
                                                  <el-radio-button label="最近半年"></el-radio-button>
                                                  <el-radio-button label="最近三个月"></el-radio-button>
                                                </el-radio-group>
                                            </span>
                                            <span style="margin-left: 10px">
                                              <div class="block">
                                                  <el-date-picker
                                                      v-model="allkeyDataDate[0]"
                                                      type="month"
                                                      size="mini"
                                                      value-format="yyyy-MM"
                                                      format="yyyy-MM"
                                                      placeholder="选择月"
                                                      :picker-options="card3POptionsStar"
                                                      @change="analysisChangeMonth('trend','card3','0')">
                                                  </el-date-picker>
                                                  至
                                                  <el-date-picker
                                                      v-model="allkeyDataDate[1]"
                                                      type="month"
                                                      size="mini"
                                                      value-format="yyyy-MM"
                                                      format="yyyy-MM"
                                                      placeholder="选择月"
                                                      :picker-options="card3POptionsEnd"
                                                      @change="analysisChangeMonth('trend','card3','1')">
                                                  </el-date-picker>
                                              </div>
                                            </span>
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
                            <div class="card card4">
                                <el-card class="box-card" shadow="never">
                                    <div slot="header" class="clearfix">
                                        <span>关键数据增量对比
                                            <el-popover
                                                placement="right"
                                                width="280"
                                                trigger="hover">
                                                <span class="popover_span">社区：城市 每个月新增的社区数量<br>
                                                    广告门：城市 每个月新增的广告门数量<br>
                                                    上刊率：城市每个月的上刊率<br>
                                                    订单：城市 每个月新增的订单数量<br>
                                                    现金总额：城市 每个月新增的订单的现金总额累计和<br>
                                                    客单价：现金总额/订单<br>
                                                    广告主：城市每个月新增的成交的广告主数量</span>
                                                <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                                            </el-popover>
                                        </span>
                                    </div>
                                    <div>
                                        <div class="data-tab">
                                            <span> 数据： </span>
                                            <span>
                                                <el-radio-group v-model="addkeyDataKind" size="mini"
                                                                @change="card3TabsRadio(addkeyDataKind,'card4',addkeyDataDate)"
                                                                :disabled="isAddkeyDataKind">
                                                    <el-radio-button label="社区数"></el-radio-button>
                                                    <el-radio-button label="广告门数"></el-radio-button>
                                                    <el-radio-button label="点位数"></el-radio-button>
                                                    <el-radio-button label="上刊率"></el-radio-button>
                                                    <el-radio-button label="订单数"></el-radio-button>
                                                    <el-radio-button label="订单总额"></el-radio-button>
                                                    <el-radio-button label="广告主数"></el-radio-button>
                                                </el-radio-group>
                                            </span>
                                        </div>
                                        <div class="data-tab">
                                            <span>时间：</span>
                                            <span>
                                                <el-radio-group v-model="addkeyDataTime" size="mini"
                                                                @change="RadioTime(addkeyDataTime,'card4',addkeyDataDate)">
                                                  <el-radio-button label="最近半年"></el-radio-button>
                                                  <el-radio-button label="最近三个月"></el-radio-button>
                                                </el-radio-group>
                                            </span>
                                            <span style="margin-left: 10px">
                                                <div class="block">
                                                     <el-date-picker
                                                         v-model="addkeyDataDate[0]"
                                                         type="month"
                                                         size="mini"
                                                         value-format="yyyy-MM"
                                                         format="yyyy-MM"
                                                         placeholder="选择月"
                                                         :picker-options="card4POptionsStar1"
                                                         @change="analysisChangeMonth('trend','card4','0')">
                                                      </el-date-picker>
                                                      至
                                                      <el-date-picker
                                                          v-model="addkeyDataDate[1]"
                                                          type="month"
                                                          size="mini"
                                                          value-format="yyyy-MM"
                                                          format="yyyy-MM"
                                                          placeholder="选择月"
                                                          :picker-options="card4POptionsEnd1"
                                                          @change="analysisChangeMonth('trend','card4','1')">
                                                      </el-date-picker>
                                                </div>
                                                <el-checkbox v-model="dateCompare" @change="card4Radio">对比</el-checkbox>
                                                <div class="block" v-if="dateCompare">
                                                    <el-date-picker
                                                        v-model="card4Date2[0]"
                                                        type="month"
                                                        size="mini"
                                                        value-format="yyyy-MM"
                                                        format="yyyy-MM"
                                                        placeholder="选择月"
                                                        :picker-options="card4POptionsStar2"
                                                        @change="card4ChangeMonth_CP">
                                                      </el-date-picker>
                                                      至
                                                      <el-date-picker
                                                          v-model="card4Date2[1]"
                                                          type="month"
                                                          size="mini"
                                                          value-format="yyyy-MM"
                                                          format="yyyy-MM"
                                                          placeholder="选择月"
                                                          :picker-options="card4POptionsEnd2"
                                                          @change="card4ChangeMonth_CP">
                                                      </el-date-picker>
                                                </div>
                                            </span>
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
                            <div class="card card5">
                                <el-card class="box-card" shadow="never">
                                    <div slot="header" class="clearfix">
                                        <span>行业订单总量趋势
                                            <el-popover
                                                placement="right"
                                                width="380"
                                                trigger="hover">
                                                <span class="popover_span">订单金额：该行业的广告主在查询月份内截止每月的订单现金金额总数<br>
                                                    订单数量：该行业的广告主在查询月份内截止每月的订单总数<br>
                                                    广告主数：该行业的广告主在查询月份内截止每月成交的广告主数量<br></span>
                                                <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                                            </el-popover>
                                        </span>
                                    </div>
                                    <div>
                                        <div class="data-tab Bradio">
                                            <span> 行业：</span>
                                            <span>
                                                 <el-select filterable v-model="card5Industry" multiple
                                                            :multiple-limit=5
                                                            placeholder="请选择"
                                                            size="small" @change="IOrderChange">
                                                            <el-option
                                                                v-for="item in session_industryData"
                                                                :key="item.value"
                                                                :value="item.value"
                                                                :label="item.label">
                                                            </el-option>
                                                 </el-select>
                                              </span>
                                        </div>
                                        <div class="data-tab timeSelect">
                                            <span>时间：</span>
                                            <span>
                                                 <el-radio-group v-model="TOrderTime" size="mini"
                                                                 @change="RadioTime(TOrderTime,'TOrder')"><!--TOrder-->
                                                     <el-radio-button label="最近半年"></el-radio-button>
                                                     <el-radio-button label="最近三个月"></el-radio-button>
                                                 </el-radio-group>
                                             </span>
                                            <span style="margin-left: 10px">
                                                  <div class="block">
                                                      <el-date-picker
                                                          v-model="TOrderDate[0]"
                                                          type="month"
                                                          size="mini"
                                                          value-format="yyyy-MM"
                                                          format="yyyy-MM"
                                                          placeholder="选择月"
                                                          :picker-options="card4POptionsStar1"
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
                                                          :picker-options="card5POptionsEnd"
                                                          @change="orderChangeMonth('1')">
                                                      </el-date-picker>
                                                    </div>
                                             </span>
                                        </div>
                                        <div class="data-tab">
                                            <span> 数据：</span>
                                            <span>
                                                 <el-radio-group v-model="TOrderTitleRadio" size="mini" @change="totleOrderRadio">
                                                     <el-radio-button label="订单金额"></el-radio-button>
                                                     <el-radio-button label="订单数量"></el-radio-button>
                                                     <el-radio-button label="广告主数"></el-radio-button>
                                                 </el-radio-group>
                                             </span>
                                        </div>
                                    </div>
                                    <div class="busOrderChart">
                                        <div class="charts2" id="busOrderLine" ref="busOrderLine"
                                             style="width: 100%;height: 350px"></div>
                                    </div>
                                </el-card>
                            </div>
                            <!--行业订单占比-->
                            <div class="card card6">
                                <el-card class="box-card" shadow="never">
                                    <div slot="header" class="clearfix">
                                        <span>行业订单占比
                                        <el-popover
                                            placement="right"
                                            width="410"
                                            trigger="hover">
                                            <span class="popover_span">订单金额：各行业的广告主截止昨日的订单现金金额总和/全部订单现金总和<br>
                                                订单数量：各行业的广告主截止昨日的订单总数/全部订单数总数<br>
                                                广告主：各行业的广告主截止昨日的广告主总数/全部广告主数<br></span>
                                              <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                                            </el-popover>
                                        </span>
                                    </div>
                                    <div>
                                        <div class="data-tab">
                                            <span>数据：
                                            </span>
                                            <span>
                                                <el-radio-group v-model="card6data" size="mini" @change="IOrderRadio">
                                                  <el-radio-button label="订单金额"></el-radio-button>
                                                  <el-radio-button label="订单数量"></el-radio-button>
                                                  <el-radio-button label="广告主数"></el-radio-button>
                                                </el-radio-group>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="wrap-box">
                                        <div class="allOrderChart">
                                            <div class="charts1" id="allOrderPie" ref="allOrderPie"
                                                 style="width: 600px;height: 350px"></div>
                                            <div class="title">
                                                <p>{{card6data}}</p>
                                                <h3 v-show="card6data === '订单金额'">¥
                                                    {{priceFormat(IOrderTotalShow)}}</h3>
                                                <h3 v-show="card6data === '订单数量' || card6data === '广告主数'">
                                                    {{IOrderTotalShow}}</h3>
                                            </div>
                                        </div>
                                        <div class="table-wrap" style="width:52.5%">
                                            <el-table :data="IOrderData" border height="380" style="width: 100%;"
                                                      class="IOrder-table">
                                                <el-table-column label="序号" width="50" type="index">
                                                </el-table-column>
                                                <el-table-column prop="iName" label="行业" min-width="161">
                                                </el-table-column>
                                                <el-table-column label="订单总额" min-width="161">
                                                    <template slot-scope="scope">
                                                        &yen;{{priceFormat((scope.row.orderTotal/100))}}
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="apCount" label="订单数" min-width="105">
                                                </el-table-column>
                                                <el-table-column prop="comCount" label="广告主" min-width="105">
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <!--入驻物业排行-->
                            <div class="card card7">
                                <el-card class="box-card" shadow="never">
                                    <div slot="header" class="clearfix">
                                        <span>入驻物业排行
                                            <el-popover
                                                placement="right"
                                                width="220"
                                                trigger="hover">
                                                <span class="popover_span">社区数量：截止昨日物业全部社区数<br>
                                                    广告门数量：截止昨日物业全部广告门数</span>
                                                <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                                            </el-popover>
                                        </span>
                                        <div class="all" @click="PropertyRankTableVisible = true">全部>></div>
                                        <el-dialog title="入驻物业总排行" :visible.sync="PropertyRankTableVisible">
                                            <div class="table-wrap" style="width: 100%">
                                                <el-table :data="ResPMCRankData" height="430px" border
                                                          class="into-property-rank">
                                                    <el-table-column property="rank"
                                                                     type="index"
                                                                     label="排名"
                                                                     width="50"></el-table-column>
                                                    <el-table-column property="resPMC" label="物业"
                                                                     min-width="40%"></el-table-column>
                                                    <el-table-column property="resCount" label="社区" min-width="20%"
                                                                     sortable
                                                                     :sort-orders="[2,1]"></el-table-column>
                                                    <el-table-column property="mCount" label="广告点位" min-width="20%"
                                                                     sortable
                                                                     :sort-orders="[2,1]"></el-table-column>
                                                </el-table>
                                            </div>
                                        </el-dialog>
                                    </div>
                                    <div>
                                        <div class="data-tab">
                                            <span> 数据： </span>
                                            <span>
                                                 <el-radio-group v-model="PMCDataTitle" size="mini" @change="resPMCRadio">
                                                     <el-radio-button label="社区数量"></el-radio-button>
                                                     <el-radio-button label="点位数量"></el-radio-button>
                                                 </el-radio-group>
                                             </span>
                                        </div>
                                        <div class="data-tab">
                                            <span>时间：</span>
                                            <span><el-radio-group v-model="resPMCTime" size="mini"
                                                                  @change="RadioTime(resPMCTime,'resPMC')">
                                                    <el-radio-button label="最近半年"></el-radio-button>
                                                    <el-radio-button label="最近三个月"></el-radio-button>
                                                    <el-radio-button label="全部"></el-radio-button>
                                                  </el-radio-group></span>
                                            <span style="margin-left: 10px">
                                                <div class="block">
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
                                            </span>
                                        </div>
                                        <div class="keyDataChart">
                                            <div class="charts2" id="PropertyRank" ref="PropertyRank"
                                                 style="width: 100%;height: 350px"></div>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <!--广告主排行-->
                            <div class="card card8">
                                <el-card class="box-card" shadow="never">
                                    <div slot="header" class="clearfix">
                                        <span>广告主排行
                                          <el-popover
                                              placement="right"
                                              width="325"
                                              trigger="hover">
                                              <span class="popover_span">订单金额：各个广告主截止在查询年月内新增的订单现金总数<br>
                                                订单数：各个广告主截止在查询年月内新增的订单数</span>
                                              <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                                          </el-popover>
                                        </span>
                                        <div class="all" @click="adOwnerRankTableVisible = true">全部>></div>
                                        <el-dialog title="广告主总排行" :visible.sync="adOwnerRankTableVisible">
                                            <div class="table-wrap" style="width: 100%">
                                                <el-table :data="adOwnerRankTable" height="430px" border
                                                          class="ad-owner-rank-table">
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
                                                                     :sort-orders="[2,1]">
                                                        <template slot-scope="scope">
                                                            &yen;{{priceFormat(scope.row.totalSum / 100)}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column property="apCount" label="数量" min-width="20%"
                                                                     sortable
                                                                     :sort-orders="[2,1]"></el-table-column>
                                                </el-table>
                                            </div>
                                        </el-dialog>
                                    </div>
                                    <div>
                                        <div class="data-tab">
                                            <span>数据：</span>
                                            <span>
                                                <el-radio-group v-model="adOwnerDataTitle" size="mini" @change="adOwnerRadio">
                                                  <el-radio-button label="订单金额"></el-radio-button>
                                                  <el-radio-button label="订单数量"></el-radio-button>
                                                </el-radio-group>
                                            </span>
                                        </div>
                                        <div class="data-tab">
                                            <span>时间：</span>
                                            <span>
                                                <el-radio-group v-model="adOwnerTime" size="mini" @change="RadioTime(adOwnerTime,'adOwner')">
                                                  <el-radio-button label="最近半年"></el-radio-button>
                                                  <el-radio-button label="最近三个月"></el-radio-button>
                                                  <el-radio-button label="全部"></el-radio-button>
                                                </el-radio-group>
                                            </span>
                                            <span style="margin-left: 10px">
                                                <div class="block">
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
                                            </span>
                                        </div>
                                        <div class="keyDataChart">
                                            <div class="charts2" id="adOwnerRank" ref="adOwnerRank"
                                                 style="width: 100%;height: 350px"></div>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                            <!--销售业绩排行-->
                            <div class="card card9">
                                <el-card class="box-card" shadow="never">
                                    <div slot="header" class="clearfix">
                                        <span>销售业绩排行
                                        <el-popover
                                            placement="right"
                                            width="320"
                                            trigger="hover">
                                            <span class="popover_span">订单金额：该销售在查询年月内新增的订单的 现金金额总和<br>
                                                订单数：该销售在查询年月内新增的订单的 订单数</span>
                                              <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                                            </el-popover>
                                        </span>
                                        <div class="all" @click="salesRankTableVisible = true">全部>></div>
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
                                                                     :sort-orders="[2,1]">
                                                        <template slot-scope="scope">
                                                            &yen;{{priceFormat(scope.row.totalSum / 100)}}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column property="apCount" label="数量" min-width="20%"
                                                                     sortable
                                                                     :sort-orders="[2,1]">
                                                    </el-table-column>
                                                </el-table>
                                            </div>
                                        </el-dialog>
                                    </div>
                                    <div>
                                        <div class="data-tab">
                                            <span> 数据：</span>
                                            <span>
                                                <el-radio-group v-model="salesDataTitle" size="mini"
                                                                @change="salesRankRadio">
                                                    <el-radio-button label="销售金额"></el-radio-button>
                                                    <el-radio-button label="销售单数"></el-radio-button>
                                                </el-radio-group>
                                            </span>
                                        </div>
                                        <div class="data-tab">
                                            <span>时间：</span>
                                            <span>
                                                <el-radio-group v-model="salesRankTime" size="mini"
                                                                @change="RadioTime(salesRankTime,'salesRank')">
                                                    <el-radio-button label="最近半年"></el-radio-button>
                                                    <el-radio-button label="最近三个月"></el-radio-button>
                                                    <el-radio-button label="全部"></el-radio-button>
                                                </el-radio-group>
                                            </span>
                                            <span style="margin-left: 10px">
                                                <div class="block">
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
                                            </span>
                                        </div>
                                        <div class="keyDataChart">
                                            <div class="charts2" id="salesRank" ref="salesRank"
                                                 style="width: 100%;height: 350px"></div>
                                        </div>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="城市对比" name="second" v-if="isAllCity">
                        <!--城市数据展示-->
                        <div class="card sec-card1">
                            <el-card class="box-card" shadow="never">
                                <div slot="header" class="clearfix">
                                    <span>城市数据展示</span>
                                </div>
                                <div class="cityData-wrap">
                                    <div class="chinaMapChart">
                                        <div class="charts1" id="chinaMap" ref="chinaMap"
                                             style="width:600px;height: 400px"></div>
                                    </div>
                                    <div class="all-data-table">
                                        <el-table
                                            class="cityBattle-table"
                                            :data="cityCompareTable"
                                            :key="cityCompareTableKey"
                                            border
                                            height="420"
                                            style="width: 100%">
                                            <el-table-column
                                                type="index"
                                                fixed
                                                label="序号"
                                                width="50">
                                            </el-table-column>
                                            <el-table-column
                                                fixed
                                                prop="city"
                                                label="城市"
                                                min-width="140">
                                                <template slot-scope="scope">
                                                    <el-tooltip :content="scope.row.city"
                                                                placement="bottom-start"
                                                                :visible-arrow="false">
                                                        <span>{{scope.row.city || '--' }}</span>
                                                    </el-tooltip>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="countRes"
                                                label="社区数"
                                                sortable
                                                :sort-orders="[2,1]"
                                                min-width="90">
                                            </el-table-column>
                                            <el-table-column
                                                prop="countMedia"
                                                label="广告门数"
                                                sortable
                                                :sort-orders="[2,1]"
                                                min-width="120">
                                            </el-table-column>
                                            <el-table-column
                                                prop="countAds"
                                                label="点位数"
                                                sortable
                                                :sort-orders="[2,1]"
                                                min-width="90">
                                            </el-table-column>
                                            <el-table-column
                                                label="上刊率(2019)"
                                                sortable
                                                :sort-method="sortUpPercent"
                                                min-width="115">
                                                <template slot-scope="scope">
                                                    <span>{{scope.row.upPercent}}%</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="广告主数"
                                                sortable
                                                :sort-orders="[2,1]"
                                                min-width="120">
                                                <template slot-scope="scope">
                                                    <span>{{scope.row.adOwners}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="orders"
                                                label="订单数"
                                                sortable
                                                :sort-orders="[2,1]"
                                                min-width="90">
                                            </el-table-column>
                                            <el-table-column
                                                prop="totalPrice"
                                                label="订单总额"
                                                sortable
                                                :sort-orders="[2,1]"
                                                min-width="130">
                                                <template slot-scope="scope">
                                                    <span>&yen;{{priceFormat(scope.row.totalPrice)}}</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <!--城市数据对比-->
                        <div class="card sec-card2">
                            <el-card class="box-card" shadow="never">
                                <div slot="header" class="clearfix">
                                    <span>城市数据对比</span>
                                </div>
                                <div>
                                    <div class="data-tab">
                                        <span> 数据：</span>
                                        <span>
                                            <el-radio-group v-model="cityBattleTitle"
                                                            :disabled="isCityBattleRadio"
                                                            size="mini"
                                                            @change="cityBattleRadio">
                                                <el-radio-button label="社区数"></el-radio-button>
                                                <el-radio-button label="广告门数"></el-radio-button>
                                                <el-radio-button label="点位数"></el-radio-button>
                                                <el-radio-button label="上刊率"></el-radio-button>
                                                <el-radio-button label="订单数"></el-radio-button>
                                                <el-radio-button label="订单总额"></el-radio-button>
                                                <el-radio-button label="广告主数"></el-radio-button>
                                            </el-radio-group>
                                        </span>
                                    </div>
                                    <div class="data-tab">
                                        <span> 时间：</span>
                                        <span>
                                            <el-radio-group v-model="cityBattleTime" size="mini"
                                                            @change="RadioTime(cityBattleTime,'cityBattle')">
                                                <el-radio-button label="最近半年"></el-radio-button>
                                                <el-radio-button label="最近三个月"></el-radio-button>
                                            </el-radio-group>
                                         </span>
                                        <span style="margin-left: 10px">
                                            <div class="block sec-card2-eldata">
                                                <el-date-picker
                                                    v-model="secCard2time[0]"
                                                    type="month"
                                                    size="mini"
                                                    value-format="yyyy-MM"
                                                    format="yyyy-MM"
                                                    placeholder="选择月"
                                                    :picker-options="secCard2POptionsStar"
                                                    @change="cityRateChangeTime('cityBattle','0')">
                                                </el-date-picker>
                                                至
                                                <el-date-picker
                                                    v-model="secCard2time[1]"
                                                    type="month"
                                                    size="mini"
                                                    value-format="yyyy-MM"
                                                    format="yyyy-MM"
                                                    placeholder="选择月"
                                                    :picker-options="secCard2POptionsEnd"
                                                    @change="cityRateChangeTime('cityBattle','1')">
                                                </el-date-picker>
                                            </div>
                                        </span>
                                    </div>
                                    <div class="data-tab cityDX">
                                        <span>城市：</span>
                                        <span>
                                              <el-select filterable v-model="selectCity" multiple collapse-tags :multiple-limit=8 placeholder="请选择"
                                                         size="mini" @change="selectCities"><el-option
                                                  v-for="item in cities"
                                                  :key="item"
                                                  :value="item">
                                              </el-option>
                                              </el-select>
                                          </span>
                                    </div>
                                </div>
                                <div class="cityBattleChart"
                                     v-loading="cityBattleLoading"
                                     element-loading-text="玩命加载中..."
                                     element-loading-background="rgba(255, 255, 255)">
                                    <div class="charts2" id="cityBattleLine" ref="cityBattleLine"
                                         style="width:100%;height: 450px">
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <!--城市上刊率对比-->
                        <div class="card sec-card3">
                            <el-card class="box-card" shadow="never">
                                <div slot="header" class="clearfix">
                                    <span>城市上刊率对比</span>
                                </div>
                                <div>
                                    <div class="data-tab">
                                        <span> 时间： </span>
                                        <span>
                                            <el-radio-group v-model="cityRateCompareTime" size="mini"
                                                            @change="RadioTime(cityRateCompareTime,'cityRate')">
                                                <el-radio-button label="最近半年"></el-radio-button>
                                                <el-radio-button label="最近三个月"></el-radio-button>
                                            </el-radio-group>
                                         </span>
                                        <span style="margin-left: 10px">
                                            <div class="block sec-card2-eldata">
                                                <el-date-picker
                                                    size="mini"
                                                    v-model="cityRateCompareDate"
                                                    type="daterange"
                                                    value-format="yyyy-MM-dd"
                                                    range-separator="至"
                                                    start-placeholder="开始日期"
                                                    end-placeholder="结束日期"
                                                    @change="cityRateChangeTime('cityRate')">
                                                </el-date-picker>
                                            </div>
                                        </span>
                                    </div>
                                    <div class="data-tab cityDX">
                                        <span> 城市： </span>
                                        <span>
                                            <el-select filterable v-model="cityRateCompareShowData.name" multiple :multiple-limit=8
                                                       placeholder="请选择"
                                                       collapse-tags
                                                       size="mini"
                                                       @change="cityRateSelect">
                                                <el-option v-for="item in cityRateCompare" :key="item" :value="item"></el-option>
                                            </el-select>
                                        </span>
                                    </div>
                                </div>
                                <div class="cityBattleChart"
                                     v-loading="cityPercentBattleLoading"
                                     element-loading-text="玩命加载中..."
                                     element-loading-background="rgba(255, 255, 255)">
                                    <div class="charts2" id="cityPercentBattleBar" ref="cityPercentBattleBar"
                                         style="width:100%;height: 450px"></div>
                                </div>
                            </el-card>
                        </div>
                        <!--城市关键数据对比-->
                        <div class="card sec-card4">
                            <el-card class="box-card" shadow="never">
                                <div slot="header" class="clearfix">
                                    <span>城市关键数据对比</span>
                                </div>
                                <div>
                                    <div class="data-tab">
                                        <span> 时间： </span>
                                        <span>
                                            <el-radio-group v-model="cityKeyDataTime" size="mini"
                                                            @change="RadioTime(cityKeyDataTime,'cityKey')">
                                                <el-radio-button label="最近半年"></el-radio-button>
                                                <el-radio-button label="最近三个月"></el-radio-button>
                                            </el-radio-group>
                                         </span>
                                        <span style="margin-left: 10px">
                                            <div class="block sec-card2-eldata"><el-date-picker
                                                size="mini"
                                                v-model="cityKeyDataDate"
                                                type="daterange"
                                                value-format="yyyy-MM-dd"
                                                @change="cityRateChangeTime('cityKey')"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                            </el-date-picker>
                                            </div>
                                        </span>
                                    </div>
                                    <div class="data-tab cityDX">
                                        <span> 城市： </span>
                                        <span>
                                            <el-select v-model="selectCompareCityData" filterable multiple :multiple-limit=7 placeholder="请选择"
                                                       size="mini" collapse-tags @change="cityKeySelect">
                                                <el-option
                                                    v-for="item in cities"
                                                    :key="item"
                                                    :value="item">
                                                </el-option>
                                            </el-select>
                                        </span>
                                    </div>
                                    <div class="data-charts cityKeyData-charts">
                                        <div class="pie-wrap">
                                            <div class="charts" ref="keyDataPie2"
                                                 style="width: 1200px;height: 600px"></div>
                                            <p>社区</p>
                                            <p>广告门</p>
                                            <p>点位</p>
                                            <p>订单</p>
                                            <p>订单总额</p>
                                            <p>广告主</p>
                                        </div>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="点位分析" name="third">
                        <div class="card thr-card1">
                            <el-card class="box-card" shadow="never">
                                <div slot="header" class="clearfix" style="position: relative">
                                    <span class="header-title">点位使用概况</span>
                                    <div class="data-tab header-select">
                                        <span style="margin-right: 10px">
                                            <el-select v-model="pointSelect" placeholder="请选择" size="mini" @change="adsSelectDate">
                                                <el-option value="自然天"></el-option><el-option value="自然月"></el-option>
                                            </el-select>
                                        </span>
                                        <span>
                                            <div class="block" v-show="pointSelect === '自然天'">
                                                <el-date-picker
                                                    v-model="pointDate"
                                                    size="mini"
                                                    type="daterange"
                                                    value-format="yyyy-MM-dd"
                                                    range-separator="至"
                                                    start-placeholder="开始日期"
                                                    end-placeholder="结束日期"
                                                    :clearable=false
                                                    @change="adsChangeDate">
                                                </el-date-picker>
                                            </div>
                                            <div class="block block_month" v-show="pointSelect === '自然月'">
                                                <el-date-picker
                                                    v-model="pointDate[0]"
                                                    type="month"
                                                    size="mini"
                                                    value-format="yyyy-MM"
                                                    format="yyyy-MM"
                                                    placeholder="选择月"
                                                    :picker-options="pointDateOptionsStar"
                                                    @change="adsChangeDate">
                                                </el-date-picker>
                                                    至
                                                <el-date-picker
                                                    v-model="pointDate[1]"
                                                    type="month"
                                                    size="mini"
                                                    value-format="yyyy-MM"
                                                    format="yyyy-MM"
                                                    placeholder="选择月"
                                                    :picker-options="pointDateOptionsEnd"
                                                    @change="adsChangeDate">
                                                </el-date-picker>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                <div class="pointData-wrap" v-model="adsUserData"
                                     v-loading="pointDataLoading"
                                     element-loading-text="玩命加载中..."
                                     element-loading-background="rgba(255, 255, 255)">
                                    <div class="left-data">
                                        <div class="line1">
                                            <dl>
                                                <dt>总点位数</dt>
                                                <dd>{{adsUserData.totalAdSpaceInfoCount.toLocaleString()}}</dd>
                                                <!--.toLocaleString()-->
                                                <!-- <dd>{{priceFormat(adsUserData.totalAdSpaceInfoCount)}}</dd>-->
                                            </dl>
                                            <dl>
                                                <dt>A面上刊率</dt>
                                                <dd>{{adsUserData.publicationRateOfA}}%</dd>
                                            </dl>
                                            <dl>
                                                <dt>B面上刊率</dt>
                                                <dd>{{adsUserData.publicationRateOfB}}%</dd>
                                            </dl>
                                        </div>
                                        <div class="line2">
                                            <dl>
                                                <dt>方案点位数</dt>
                                                <dd>{{adsUserData.planSpotCount.toLocaleString()}}</dd>
                                                <!--.toLocaleString()-->
                                            </dl>
                                            <dl>
                                                <dt>方案数</dt>
                                                <dd>{{adsUserData.planCount}}</dd>
                                            </dl>
                                        </div>
                                        <div class="line3">
                                            <dl>
                                                <dt>订单点位数</dt>
                                                <dd>{{adsUserData.orderSpotCount.toLocaleString()}}</dd>
                                                <!--.toLocaleString()-->
                                            </dl>
                                            <dl>
                                                <dt>订单数</dt>
                                                <dd>{{adsUserData.orderCount}}</dd>
                                                <!--<dd>{{priceFormat(adsUserData.orderCount)}}</dd>-->
                                            </dl>
                                            <dl>
                                                <dt>成交单价</dt>
                                                <dd>{{priceFormat(adsUserData.orderUnitPrice)}}</dd>
                                            </dl>
                                        </div>
                                    </div>
                                    <div class="right-chart">
                                        <img src="../../assets/images/dataAnalysis-ld.png" alt="">
                                        <div class="translate-txt">
                                            <!--总点位数 ——> 方案点位数 -->
                                            <div class="translate1">转化率：{{adsUserData.allToPlanConversionRate}}%</div>
                                            <!--方案点位数 ——> 订单点位数 -->
                                            <div class="translate2">转化率：{{adsUserData.planToOrderConversionRate}}%</div>
                                            <!-- 总点位数 ——> 方案点位数 -->
                                            <div class="translate3">转化率：{{adsUserData.allToOrderConversionRate}}%</div>
                                        </div>
                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div class="card thr-card2">
                            <div>
                                <div class="thr-tabs">
                                    <el-tabs v-model="thirdActiveName" type="card">
                                        <el-tab-pane label="社区上刊率" name="first">
                                            <div class="point-percent">
                                                <div class="select-wrap">
                                                    <span>
                                                        <el-select v-model="resSelectVal" placeholder="请选择">
                                                            <el-option value="社区名称"></el-option>
                                                        </el-select>
                                                    </span>
                                                    <span style="margin-right: 6px">
                                                        <el-input v-model="resInputVal" placeholder="请输入内容" class="s-input"
                                                                  @change="initData('res')">
                                                        </el-input>
                                                    </span>
                                                    <span style="margin-right: 6px">
                                                        <el-button type="primary" icon="el-icon-search" @click="searchFun('res')">搜索</el-button>
                                                    </span>
                                                    <span>
                                                        <el-button plain @click="exportExcel_res">导出</el-button>
                                                    </span>
                                                </div>
                                                <div class="select-wrap select2">
                                                    <div class="data-tab">
                                                        <span>上刊率查询范围：</span>
                                                        <span>
                                                            <el-radio-group v-model="poiSearchTime" size="mini"
                                                                            @change="RadioTime(poiSearchTime,'resRate')"><el-radio-button label="最近半年"></el-radio-button><el-radio-button label="最近三个月"></el-radio-button>
                                                            </el-radio-group>
                                                        </span>
                                                        <span style="margin-left: 10px">
                                                            <div class="block">
                                                                <el-date-picker
                                                                    size="mini"
                                                                    v-model="resSearchDate"
                                                                    type="daterange"
                                                                    value-format="yyyy-MM-dd"
                                                                    format="yyyy-MM-dd"
                                                                    range-separator="至"
                                                                    start-placeholder="开始日期"
                                                                    end-placeholder="结束日期"
                                                                    @change="CreatDateChange('res','search')">
                                                                </el-date-picker>
                                                            </div>
                                                        </span>
                                                        <span style="position: relative; top: 4px; margin-left: 10px">社区创建日期：</span>
                                                        <span>
                                                            <div class="block">
                                                                <el-date-picker
                                                                    size="mini"
                                                                    v-model="resCreatDate"
                                                                    type="daterange"
                                                                    value-format="yyyy-MM-dd"
                                                                    format="yyyy-MM-dd"
                                                                    range-separator="至"
                                                                    start-placeholder="开始日期"
                                                                    end-placeholder="结束日期"
                                                                    @change="CreatDateChange('res','create')">
                                                                </el-date-picker>
                                                            </div>
                                                        </span>
                                                        <span style="position: relative; top: 4px; margin-left: 10px">上刊率：</span>
                                                        <span>
                                                            <div class="upPercent-wrap"><div class="input-wrap">
                                                                <el-input v-model="pUpMin" placeholder="0" @focus="cinputFocus = true" @blur='resBlur'>
                                                                    <em slot="suffix" style="position: relative;top: 3px">%</em>
                                                                </el-input>
                                                                <span style="margin: 0 6px;position: relative;top: 3px">-</span>
                                                                <el-input v-model="pUpMax" placeholder="100" @focus="cinputFocus = true" @blur='resBlur'>
                                                                    <em slot="suffix" style="position: relative;top: 2px">%</em>
                                                                </el-input>
                                                            </div><div class="upPercent-wrap-mask" v-show="cinputFocus">
                                                                <el-button type="text" @click="pClear">清除</el-button>
                                                                <el-button plain class="confirm" @click="pConfirm">确定</el-button>
                                                            </div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="table-wrap table-wrap2">
                                                    <el-table
                                                        v-loading="resLoading"
                                                        element-loading-text="玩命加载中.."
                                                        element-loading-spinner="el-icon-loading"
                                                        v-loadmore="resLoadMore"
                                                        class="CUP-table PUP-table"
                                                        :data="resRateList"
                                                        border
                                                        style="width: 100%"
                                                        height="390"
                                                    >
                                                        <el-table-column
                                                            type="index"
                                                            label="序号"
                                                            width="50">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="city"
                                                            label="城市"
                                                            min-width="10%">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="area"
                                                            label="区域"
                                                            min-width="10%">
                                                        </el-table-column>
                                                        <!--  :filters="[{ text: '天河区', value: '天河区' }, { text: '越秀区', value:'越秀区' }]"
                                                        :filter-method="filterArea"-->
                                                        <el-table-column
                                                            prop="resName"
                                                            label="社区名称"
                                                            min-width="18%">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="upPercent"
                                                            label="上刊率"
                                                            sortable
                                                            :sort-method="sortUpPercent"
                                                            :sort-orders="[2,1]"
                                                            min-width="10%">
                                                            <template slot-scope="scope">
                                                                <span>{{scope.row.upPercent}}%</span>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="price"
                                                            label="投放金额"
                                                            sortable
                                                            :sort-orders="sortResPrice"
                                                            min-width="10%">
                                                            <template slot-scope="scope">
                                                                <span>&yen;{{scope.row.price}}</span>
                                                                <!-- <span>&yen;{{priceFormat(scope.row.price)}}</span>-->
                                                            </template>
                                                        </el-table-column>
                                                    </el-table>
                                                </div>
                                            </div>
                                        </el-tab-pane>
                                        <el-tab-pane label="点位上刊率" name="second">
                                            <div class="community-percent">
                                                <div class="select-wrap">
                                                    <span>
                                                        <el-select v-model="adsSelectVal" placeholder="请选择">
                                                            <el-option value="社区名称"></el-option>
                                                        </el-select>
                                                    </span>
                                                    <span style="margin-right: 6px">
                                                        <el-input v-model="adsInputVal" placeholder="请输入内容" class="s-input"
                                                                  @change="initData('ads')">
                                                        </el-input>
                                                    </span>
                                                    <span style="margin-right: 6px">
                                                         <el-button type="primary" icon="el-icon-search" @click="searchFun('ads')">搜索</el-button>
                                                    </span>
                                                    <span>
                                                        <el-button plain @click="exportExcel_ads">导出</el-button>
                                                    </span>
                                                </div>
                                                <div class="select-wrap select2">
                                                    <div class="data-tab">
                                                        <span> 上刊率查询范围：</span>
                                                        <span>
                                                                 <el-radio-group v-model="comSearchTime" size="mini"
                                                                                 @change="RadioTime(comSearchTime,'adsRate')">
                                                                 <el-radio-button label="最近半年"></el-radio-button>
                                                                   <el-radio-button label="最近三个月"></el-radio-button>
                                                                 </el-radio-group>
                                                            </span>
                                                        <span style="margin-left: 10px">
                                                             <div class="block">
                                                                 <el-date-picker
                                                                     size="mini"
                                                                     v-model="adsSearchDate"
                                                                     type="daterange"
                                                                     value-format="yyyy-MM-dd"
                                                                     format="yyyy-MM-dd"
                                                                     range-separator="至"
                                                                     start-placeholder="开始日期"
                                                                     end-placeholder="结束日期"
                                                                     @change="CreatDateChange('ads','search')">
                                                                 </el-date-picker>
                                                            </div>
                                                        </span>
                                                        <span style="position: relative; top: 4px; margin-left: 10px">点位创建日期：</span>
                                                        <span>
                                                            <div class="block">
                                                                <el-date-picker
                                                                    size="mini"
                                                                    v-model="adsCreatDate"
                                                                    type="daterange"
                                                                    value-format="yyyy-MM-dd"
                                                                    format="yyyy-MM-dd"
                                                                    range-separator="至"
                                                                    start-placeholder="开始日期"
                                                                    end-placeholder="结束日期"
                                                                    @change="CreatDateChange('ads','create')">
                                                                </el-date-picker>
                                                            </div>
                                                        </span>
                                                        <span style="position: relative; top: 4px; margin-left: 10px">上刊率：</span>
                                                        <span>
                                                            <div class="upPercent-wrap">
                                                                <div class="input-wrap">
                                                                    <el-input v-model="cUpMin" placeholder="" @focus="cinputFocus = true" @blur='adsBlur'>
                                                                        <em slot="suffix" style="position: relative;top: 3px">%</em>
                                                                    </el-input>
                                                                    <span style="margin: 0 6px;position: relative;top: 3px">-</span>
                                                                    <el-input v-model="cUpMax" placeholder="" @focus="cinputFocus = true" @blur='adsBlur'>
                                                                        <em slot="suffix" style="position: relative;top: 2px">%</em>
                                                                    </el-input>
                                                                </div>
                                                                <div class="upPercent-wrap-mask" v-if="cinputFocus">
                                                                    <el-button type="text" @click="cClear">清除</el-button>
                                                                    <el-button plain class="confirm" @click="cConfirm">确定</el-button>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="table-wrap table-wrap2">
                                                    <el-table
                                                        v-loading="adsLoading"
                                                        element-loading-text="玩命加载中.."
                                                        element-loading-spinner="el-icon-loading"
                                                        v-loadmore="adsLoadMore"
                                                        class="CUP-table"
                                                        :data="adsRateList"
                                                        border
                                                        style="width: 100%"
                                                        height="390">
                                                        <el-table-column
                                                            type="index"
                                                            label="序号"
                                                            width="50">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="city"
                                                            label="城市"
                                                            min-width="10%">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="area"
                                                            label="区域"
                                                            :filters="[{ text: '天河区', value: '天河区' }, { text: '越秀区', value:'越秀区' }]"
                                                            :filter-method="filterArea"
                                                            min-width="10%">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="resName"
                                                            label="社区名称"
                                                            min-width="18%">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="adDoorName"
                                                            label="广告门名称"
                                                            min-width="10%">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="adNo"
                                                            label="广告编号"
                                                            :filters="[{ text: 'A', value: 'A' }, { text: 'B', value: 'B' }]"
                                                            :filter-method="filterAdNo"
                                                            min-width="8%">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="createTime"
                                                            label="点位创建日期"
                                                            sortable
                                                            min-width="20%">
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="upPercent"
                                                            label="上刊率"
                                                            sortable
                                                            :sort-method="sortUpPercent"
                                                            min-width="10%">
                                                            <template slot-scope="scope">
                                                                <span>{{scope.row.upPercent}}%</span>
                                                            </template>
                                                        </el-table-column>
                                                        <el-table-column
                                                            prop="price"
                                                            label="投放金额"
                                                            sortable
                                                            :sort-orders="sortResPrice"
                                                            min-width="10%">
                                                            <template slot-scope="scope">
                                                                <span>&yen;{{scope.row.price}}</span>
                                                                <!--<span>&yen;{{priceFormat(scope.row.price)}}</span>-->
                                                            </template>
                                                        </el-table-column>
                                                    </el-table>
                                                </div>
                                            </div>
                                        </el-tab-pane>
                                    </el-tabs>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import 'echarts/lib/chart/map'
    import 'echarts/map/js/china.js'
    import commaFormat from '../../commonFun/commaFormat'
    import industry from '../../commonFun/industryToText'
    import timeFormat from '../../commonFun/timeFormat'
    import api from '../../api/api'

    export default {
        name: "dataAnalysis",
        data() {
            return {
                AnalysisLoading:'',     // 首屏loading
                isCitys: false,
                isAllCity: true,
                toTime:'',          // 数据截止时间
                //数据概况
                activeName: 'first',
                beforeActiveName: 'first',
                citys: [
                    {value: '0', label: ' 全国'},
                    {value: '1', label: '北京亲邻众联科技有限公司'},
                    {value: '2', label: '上海多邻网络科技有限公司'},
                    {value: '3', label: '广州市亲粤邻网络科技有限公司'},
                    {value: '4', label: '深圳亲邻交互科技有限公司'},
                    {value: '5', label: '成都亲邻科技有限公司'},
                    {value: '6', label: '重庆市亲邻科技有限公司'},
                    {value: '7', label: '天津亲邻众联科技有限公司'}
                    // {value: '0', label: ' 全国'},
                    // {value: '110100', label: '北京市'},
                    // {value: '310100', label: '上海市'},
                    // {value: '440100', label: '广州市'},
                    // {value: '440300', label: '深圳市'},
                    // {value: '510100', label: '成都市'},
                    // {value: '500100', label: '重庆市'},
                ],
                currCity: '0',
                beforCurrCityL: '0',
                allDataLoading: true,
                activeCity: '',             // 单公司有多城市时当前选中的城市-表头数据总览
                selectCityList: [],         // 单公司有多城市时的城市list
                //数据总览   如果选中全国就是北上广深渝川津，如果选中城市就是市区
                beforeAllData: [],
                RMAllData: [],              // 数据概况
                RMAllName: [],              // 数据概况 - 饼状图城市名或区
                RMPieRESData: [],          // 数据概况 - 饼状图社区数据
                RMPieAdsData: [],          // 数据概况 - 饼状图点位数据
                RMPieMediaData: [],        // 数据概况 - 饼状图媒体数据
                RMPieRateData:[],           // 数据概况 - 饼状图上刊率
                cityKeyData: {res:[],ads:[],media:[],order:[],totalPrice:[],adOwner:[]},
                cityResKeyData:[],          // 城市关键数据对比 - 饼状图社区数据
                cityAdsKeyData:[],          // 城市关键数据对比 - 饼状图点位数据
                cityMediaKeyData:[],          // 城市关键数据对比 - 饼状图媒体数据
                RMPieOrderData: [],        // 城市关键数据对比 - 饼状图订单数据
                RMPieTotalPriceData: [],  // 城市关键数据对比 - 饼状图订单总额数据
                RMPieAdOwnersData: [],     // 城市关键数据对比 - 饼状图广告主数据
                RMHeadAllData: {res: 0, media: 0, ads: 0, SK: 0, order: 0, cash: 0, price: 0, customer: 0},         // 数据概况 - 头部显示的总数据
                otherCitySK: '',        // 非六个城市里的上刊率
                PieData: '',
                allDataKind: {
                    res: 237502,
                    media: 332666,
                    SK: '66.7%',
                    order: 43200,
                    cash: 219020003,
                    price: 2333,
                    customer: 666
                },
                cityDataTableVisible: false,
                //关键数据总量趋势
                allkeydatakind: '社区数',
                isReskeyDataKind: true,
                allkeyDataTime: '最近半年',
                //关键数据总量折线图Y轴
                card3Ydata: [520, 632, 901, 634, 890, 930, 1020],
                CountOfTotalData: {
                    res: [],
                    media: [],
                    ads: [],
                    timeData: [],
                    Rate:[],
                    order:[],
                    orderPrice: [],
                    adOwner: []
                },    // 关键数据总量趋势
                keyDataLineEchart: '',        // 关键数据总量echart
                CountOfTotalDataShow: {numData: [], timeData: []},
                allkeyDataDate: [],
                card3DateMin: '2018-04',
                //关键数据增量对比
                CountOfIncreData: {
                    res: [],
                    media: [],
                    ads: [],
                    Rate: [],
                    order:[],
                    orderPrice:[],
                    adOwner: [],
                    timeData: [],
                    increData: [],
                },
                CountOfIncreDataShow: {dateCompare: [], AddData: [], AddDataCP: [], TitleDate: []},
                addkeyDataKind: '社区数',
                isAddkeyDataKind: true,
                keyDataBar:'',
                addkeyDataTime: '最近半年',
                addkeyDataDate: [],
                card4Date2: [],
                dateCompare: false,
                //行业订单总量趋势
                card5Industry: [1],
                beforeCard5business: [1],
                TOrderDate: [],
                TOrderTime: '最近半年',
                //数据
                TOrderTitleRadio: '订单金额',
                //行业订单总量趋势折线图X
                totalOrderDate: [], //"2018/04","2017/05","2017/06","2017/07","2017/08","2018/09"
                totalOrderDataShow: [],
                totalOrderTitleShow:[],                             // 行业订单总量趋势 - 折线标题 ；'房地产','3C数码','医疗保健'
                totalOrderData_orderPrice: [],                      // 行业订单总量趋势 -订单金额
                totalOrderData_orderNumber: [],                      // 行业订单总量趋势 -订单数量
                totalOrderData_orderAdOwner: [],                      // 行业订单总量趋势 -广告主数
                //行业订单占比
                card6data: '订单金额',
                IOrderTotal: {orderTotal: 0, apCount: 0, comCount: 0}, // 行业订单占比-总数据汇总
                IOrderTotalShow: 0,           // 行业订单占比-要显示的总数据
                //饼图数据
                IOrderData: [],
                //表格数据
                orderTable: [],
                IOrderTotalArr: [{data: []}, {legendData: []}],// 行业订单占比-订单金额
                IOrderApCount: [{data: []}, {legendData: []}],// 行业订单占比-订单数量
                IOrderComCount: [{data: []}, {legendData: []}],// 行业订单占比-广告主数
                IOrderDataShow: [{data: []}, {legendData: []}],
                //入驻物业排行
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
                // 广告主排行
                adOwnerDataTitle: '订单金额',
                adOwnerDate: [],  // new Date() - 3600 * 1000 * 24 * 180, new Date()
                adOwnerTime: '最近半年',
                AdOwnerData: [],
                AdOwnerName: [],         // 广告主排位名称
                AdOwnerTotalSum: [],     // 广告主排行-订单金额
                AdOwnerApCount: [],      // 广告主排行- 订单数量
                AdOwnerShowData: [],      // 广告主排行 - 显示的柱状数据
                adOwnerRankTableVisible: false,
                adOwnerRankTable: [],
                //销售业绩排行
                salesDataTitle: '销售金额',
                salesRankDate: [],
                salesRankTime: '最近半年',
                card9Xdate: ['', '', '', '', '', '', '', '', ''],
                salesRankData: [],         // 销售业绩排行数据
                salesRankName: [],        // 销售业绩排行名称
                salesRankTotalSum: [],    // 销售业绩排行-金额
                salesRankApCount: [],     // 销售业绩排行-单数
                salesRankShowData: [],     // 销售业绩排行 - 显示的柱状数据
                salesRankTableVisible: false,
                salesRankTable: [],
                //城市对比
                //全国数据表格
                cityCompareTable:[],
                cityCompareTableKey: 1, // 表格的key值
                chinaMapData: [
                    {name: '广东', value: 0},
                    {name: '北京', value: 0},
                    {name: '天津', value: 0},
                    {name: '上海', value: 0},
                    {name: '广西', value: 0},
                    {name: '湖南', value: 0},
                    {name: '重庆', value: 0},
                    {name: '四川', value: 0},
                    {name: '江西', value: 0},
                    {name: '山西', value: 0},
                    {name: '湖北', value: 0},
                    {name: '安徽', value: 0},
                    {name: '福建', value: 0},
                    {name: '浙江', value: 0},
                    {name: '河南', value: 0},
                    {name: '河北', value: 0},
                    {name: '陕西', value: 0},
                    {name: '贵州', value: 0},
                    {name: '香港', value: 0},
                    {name: '江苏', value: 0},
                    {name: '山东', value: 0},
                    {name: '辽宁', value: 0},
                    {name: '吉林', value: 0},
                    {name: '黑龙江', value: 0},
                    {name: '青海', value: 0},
                    {name: '甘肃', value: 0},
                    {name: '内蒙古', value: 0},
                    {name: '海南', value: 0},
                    {name: '云南', value: 0},
                    {name: '宁夏', value: 0},
                    {name: '新疆', value: 0},
                    {name: '西藏', value: 0},
                    {name: '台湾', value: 0}
                ],
                chinaMapDataMax: 10000,
                citysData_orderPriceAdOwners: [],   // 表格数据
                orderPriceAdOwnersSteps:0,          // 请求步数
                //城市数据对比button
                cityBattleTitle: '社区数',
                cityBattleTime: '最近半年',
                isCityBattleRadio: true,        // 数据获取时按钮禁用 isReskeyDataKind
                secCard2time: [],
                beforeSecCard2time: [], // secCard2time前一个时间段
                selectCity: [
                    '北京亲邻众联科技有限公司',
                    '上海多邻网络科技有限公司',
                    '广州市亲粤邻网络科技有限公司',
                    '深圳亲邻交互科技有限公司',
                    '成都亲邻科技有限公司',
                    '重庆市亲邻科技有限公司',
                    '天津亲邻众联科技有限公司'
                ],
                cities: [
                    '北京亲邻众联科技有限公司',
                    '上海多邻网络科技有限公司',
                    '广州市亲粤邻网络科技有限公司',
                    '深圳亲邻交互科技有限公司',
                    '成都亲邻科技有限公司',
                    '重庆市亲邻科技有限公司',
                    '天津亲邻众联科技有限公司'
                ],
                //城市上刊率对比
                cityPercentBattleLoading: true,// 城市上刊率对比loading
                cityBattleLoading: true,       // 城市数据对比loading
                cityRateCompareDate: [],
                BeforeCityRateCompareDate: [],
                cityRateCompareTime: '最近半年',
                cityRateCompare: '',
                cityRateCompareData:[],         //  六大城市上刊率 - 数据
                cityRateCompareShowData:{name:[],value:[]},     //  城市上刊率 - 显示
                beforeCityRate: [
                    '北京亲邻众联',
                    '上海多邻网络',
                    '广州市亲粤邻网络',
                    '深圳亲邻交互',
                    '成都亲邻',
                    '重庆市亲邻',
                    '天津亲邻众'
                ],
                //城市关键数据对比
                cityKeyDataDate: [],
                cityKeyDataTime: '最近半年',
                selectCompareCityData: [
                    '北京亲邻众联科技有限公司',
                    '上海多邻网络科技有限公司',
                    '广州市亲粤邻网络科技有限公司',
                    '深圳亲邻交互科技有限公司',
                    '成都亲邻科技有限公司',
                    '重庆市亲邻科技有限公司',
                    '天津亲邻众联科技有限公司'
                ],
                beforeCityKey:[
                    '北京亲邻众联科技有限公司',
                    '上海多邻网络科技有限公司',
                    '广州市亲粤邻网络科技有限公司',
                    '深圳亲邻交互科技有限公司',
                    '成都亲邻科技有限公司',
                    '重庆市亲邻科技有限公司',
                    '天津亲邻众联科技有限公司'
                ],
                CityBattleData: [],   // 城市关键数据对比 - 广告主数据
                cityBattlePieStep: 0,   // 城市关键数据对比 - 步数
                citykeyData: [
                    {name: '北京', value: 5335},
                    {name: '上海', value: 3410},
                    {name: '深圳', value: 7234},
                    {name: '广州', value: 2234},
                    {name: '成都', value: 3234},
                    {name: '重庆', value: 4234},
                    {name: '天津', value: 4234},
                ],

                // 点位分析
                pointDataLoading: true, // 点位使用概况loading
                adsUserData: {
                    totalAdSpaceInfoCount:0,
                    planToOrderConversionRate:0,
                    planCount:0,
                    orderCount:0,
                    orderUnitPrice:0,
                    publicationRateOfA:0,
                    publicationRateOfB:0,
                    orderSpotCount:0,
                    planSpotCount: 0,
                    allToPlanConversionRate: 0,
                    allToOrderConversionRate: 0,
                },
                thirdActiveName: 'first',
                pointSelect: '自然天',
                comSearchTime: '最近半年',
                adsCreatDate: [],
                adsSearchDate: [],
                pointDate: [],
                pointDate_day:[],
                adsSelectVal: '社区名称',
                adsInputVal: '',
                cUpMin: '',
                cUpMax: '',
                cinputFocus: false,
                // 社区上刊率表格
                resRateData:[],           // 社区上刊率接口原数据 - 切换城市或全国时会变更
                adsRateData: [],          // 点位上刊率接口原数据 - 切换城市或全国时会变更
                adsRateListIndex: 0,
                adsRateList: [],
                adsPageNum: 1,      // 当前页数
                adsTotalPage: 1,    // 总页数
                adsPageSize: 50,
                loading_ads: true, // 点位上刊率列表 - 滚动加载
                // 点位上刊率
                poiSearchTime: '最近半年',
                resSearchDate: [],   // 社区上刊率列表 - 时间段
                resCreatDate:[],    // 社区上刊率列表 - 社区创建时间
                resPageSize: 50,    // 每页条数
                resPageNum: 1,      // 当前页数
                resTotalPage: 1,    // 总页数
                resInputVal: '',
                pUpMin: '',
                pUpMax: '',
                resLoading: true,
                adsLoading: true,
                resSelectVal: '社区名称',
                beforeResRateList: [],  // 搜索前的resRateList
                resRateListIndxe:0,
                resRateList: [],
                loading_res: true,     // 社区上刊率列表 - 滚动加载
                colorArr: ['#975fe4', '#3aa0ff', '#36cbcb', '#4dcb73', '#fad337', '#f2637b', '#6081FF', '#FE752A'],
                colortest: 'red',
                //图表数据
                //城市数据对比
                cityBattleLineSeries: [],
                cityBattleLineSeriesShow: [
                    {
                        name: '北京亲邻众联科技有限公司',
                        type: 'line',
                        // data: [17220, 23432, 34031, 44354, 55490, 64630]
                        data:[]
                    },
                    {
                        name: '上海多邻网络科技有限公司',
                        type: 'line',
                        data:[]
                        // data: [11210, 21812, 32491, 44334, 54190, 69330]
                    },
                    {
                        name: '广州市亲粤邻网络科技有限公司',
                        type: 'line',
                        data:[]
                        // data: [15140, 25132, 31401, 24154, 45190, 66330]
                    },
                    {
                        name: '深圳亲邻交互科技有限公司',
                        type: 'line',
                        data:[]
                        // data: [13220, 34332, 33031, 45534, 43690, 63830]
                    },
                    {
                        name: '成都亲邻科技有限公司',
                        type: 'line',
                        data:[]
                        // data: [8250, 39432, 39041, 49534, 58290, 69330]
                    },
                    {
                        name: '重庆市亲邻科技有限公司',
                        type: 'line',
                        data:[]
                        // data: [11250, 4432, 39041, 49534, 51290, 69330]
                    },
                    {
                        name: '天津亲邻众联科技有限公司',
                        type: 'line',
                        data:[]
                        // data: [11250, 4432, 39041, 49534, 51290, 69330]
                    }
                ],
                cityBattleLineTime: [],
                cityBattleLineStep: 0,
                beforeCityBLSShow: [ // 记录变化前城市个数，用来判断城市是增加还是减少
                    '北京亲邻众联科技有限公司',
                    '上海多邻网络科技有限公司',
                    '广州市亲粤邻网络科技有限公司',
                    '深圳亲邻交互科技有限公司',
                    '成都亲邻科技有限公司',
                    '重庆市亲邻科技有限公司',
                    '天津亲邻众联科技有限公司'
                ],
                session_userData: '',     // session里的用户数据
                session_industryData: [   // session里的行业数据
                    {label: "3C数码" ,value: 1},
                    {label: "家具建材" ,value: 37},
                    {label: "丽人" ,value: 55},
                    {label: "教育培训" ,value: 78},
                    {label: "餐饮美食" ,value: 136},
                    {label: "母婴儿童" ,value: 147},
                ],
                nowMonth: '',               // 当前月份日期
                keyDataLineLoading: true,   // 关键数据总量loading
                keyDataBarLoading: true,    // 关键数据增量loading
                // 结束时间与开始时间的验证 - 返回true即为禁止
                // 关键数据总量趋势
                card3POptionsStar:{
                    disabledDate:(time) =>{
                        return time.getTime() > Date.parse(this.allkeyDataDate[1]) //|| time.getTime() > Date.now();
                    }
                },
                card3POptionsEnd: {
                    disabledDate: (time) => {
                        return    time.getTime() < Date.parse(this.allkeyDataDate[0]) //|| time.getTime() > Date.now();
                    }
                },
                // 关键数据增量对比
                card4POptionsStar1:{
                    disabledDate:(time) =>{
                        return time.getTime() > Date.parse(this.addkeyDataDate[1]) //|| time.getTime() > Date.now();
                    }
                },
                card4POptionsEnd1:{
                    disabledDate:(time) =>{
                        return  time.getTime() < Date.parse(this.addkeyDataDate[0]) //|| time.getTime() > Date.now();
                    }
                },
                card4POptionsStar2:{
                    disabledDate:(time) =>{
                        return time.getTime() > Date.parse(this.card4Date2[1]) //|| time.getTime() > Date.now();
                    }
                },
                card4POptionsEnd2:{
                    disabledDate:(time) =>{
                        return  time.getTime() < Date.parse(this.card4Date2[0]) //|| time.getTime() > Date.now(); secCard2POptionsStar
                    }
                },
                // 订单总量趋势
                card5POptionsStar:{
                    disabledDate:(time) =>{
                        return  time.getTime() > Date.parse(this.TOrderDate[1]) //|| time.getTime() > Date.now(); secCard2POptionsStar
                    }
                },
                card5POptionsEnd:{
                    disabledDate:(time) =>{
                        return  time.getTime() < Date.parse(this.TOrderDate[0]) //|| time.getTime() > Date.now(); secCard2POptionsStar
                    }
                },
                // 城市数据对比
                secCard2POptionsStar:{
                    disabledDate:(time) =>{
                        return time.getTime() > Date.parse(this.secCard2time[1]) //|| time.getTime() > Date.now();
                    }
                },
                secCard2POptionsEnd:{
                    disabledDate:(time) =>{
                        return  time.getTime() < Date.parse(this.secCard2time[0]) //|| time.getTime() > Date.now();
                    }
                },
                // 点位使用概况
                pointDateOptionsStar:{
                    disabledDate:(time) =>{
                        return time.getTime() > Date.parse(this.pointDate[1])
                    }
                },
                pointDateOptionsEnd:{
                    disabledDate:(time) =>{
                        return  time.getTime() < Date.parse(this.pointDate[0])
                    }
                }
            }
        },
        mounted() {
            this.AnalysisLoading = this.$loading({
                lock: true,
                text: '拼命加载中...',
                spinner: '数据加载中...',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            this.getSessionData()  // 获取登录帐号信息
            this.setTime()          // 设置初始时间段
            // 数据概况 - 接口
            this.getAllDateSurvey()
            // 关键数据 - 接口
            let params = {}
            let onStart = this.allkeyDataDate[0]
            let onEnd = this.allkeyDataDate[1]
            console.log(' this.allkeyDataDate', this.allkeyDataDate)
            params = {
                uid: this.session_userData.uID,
                asrIDs: this.returnAsrID(),
                onStart: this.returnDate(onStart, 'start'),  //onStart,
                onEnd: this.returnDate(onEnd)       // onEnd
            }
            // // 关键数据总量/增量趋势 - 社区接口
            this.getAllResData('card',params)
            // 行业订单总总量趋势 - 接口
            this.getIOrderData(1)
            // 行业订单占比
            this.getIOrderTotalData()
            // 广告主排行
            this.getAdOwnerData()
            // 销售业绩排行
            this.getSalesRankData()
            // 物业社区数量接口
            this.getResPMCRankData()
        },
        directives: {
            loadmore: {
                bind: function (el, binding) {
                    const selectWrap = el.querySelector('.el-table__body-wrapper')
                    selectWrap.addEventListener('scroll', function () {
                        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
                        if (scrollDistance <= 100) {
                            binding.value()
                        }
                    })
                }
            }
        },
        methods: {
            // 获取session数据;根据登录用户的权限设置权限
            getSessionData() {
                this.session_userData = JSON.parse(sessionStorage.getItem('session_data'))
                let industryData = JSON.parse(sessionStorage.getItem('industry'))
                this.session_industryData = industry.getFirstLevel(industryData)
                console.log('用户信息',this.session_userData,'一级行业：',this.session_industryData)
                if(this.session_userData.asrID == '999'){
                    this.isAllCity = true
                }else{
                    this.citys = [
                        {
                            value: this.session_userData.asrID,
                            label: this.session_userData.asName
                        },
                    ]
                    this.currCity = this.citys[0].value
                    this.isAllCity = false
                }
            },
            //选择城市
            changeCity(value) {
                this.currCity = value//this.citys[index]
                // console.log(this.currCity, '选择城市', value)
                if (this.activeName === 'first') {
                    // console.log('数据概况')
                    this.getAllDateSurvey()          // 数据概况
                    // 关键数据总量/增量趋势
                    // 关键数据 - 接口
                    let params = {}
                    let onStart = this.allkeyDataDate[0]
                    let onEnd = this.allkeyDataDate[1]
                    if (this.currCity === '0') {
                        params = {
                            uid: this.session_userData.uID,
                            onStart: onStart,
                            onEnd: onEnd
                        }
                    } else {
                        params = {
                            uid: this.session_userData.uID,
                            asrIDs: this.currCity,
                            onStart: onStart,
                            onEnd: onEnd
                        }
                    }
                    this.allkeydatakind = '社区数'
                    this.addkeyDataKind = '社区数'
                    this.getAllResData('card',params)
                    // 重置增量对比按钮为false
                    this.dateCompare = false
                    this.CountOfIncreDataShow.AddDataCP = []
                    // this.card4Radio()
                    // 行业订单总总量趋势
                    this.card5Industry = [1]
                    this.TOrderTitleRadio = '订单金额'
                    this.getIOrderData(1,'change')
                    // 行业订单占比
                    this.card6data = '订单金额'
                    this.getIOrderTotalData()
                    // 广告主排行
                    this.adOwnerDataTitle = '订单金额'
                    this.getAdOwnerData()
                    // 销售业绩排行
                    this.salesDataTitle = '销售金额'
                    this.getSalesRankData()
                    // 入驻物业排行
                    this.PMCDataTitle = '社区数量'
                    this.getResPMCRankData()
                }else if (this.activeName === 'third') {
                    // console.log('点位分析')
                    this.GetUserAdsInfo('自然天')
                    if(this.currCity == '0'){
                        this.getResRateFun()
                        this.getAdsRateFun()
                    }else{
                        this.resRateList = []
                        this.adsRateList = []
                        this.filterRateDataByCity() // 根据城市过滤数据
                    }
                }
            },
            // tabs切换
            tabHandleClick(tab, event) {
                // console.log('tabs切换', tab.name)
                this.isCitys = false
                this.activeName = tab.name
                if (this.activeName === 'first') {
                    if(this.beforeActiveName === 'second'){
                        this.currCity = this.beforCurrCityL
                    }
                    this.changeCity(this.currCity)
                } else if (this.activeName === 'second') {
                    // if (this.cityCompareTableKey === 1) {// 变化城市对比中table的key值
                    //     this.cityCompareTableKey = 2
                    // } else {
                    //     this.cityCompareTableKey = 1
                    // }
                    this.isCitys = true
                    this.beforCurrCityL = this.currCity
                    this.currCity = '0'
                    this.setCityCompare()
                    this.getCityDataShow()              // 城市数据展示
                    this.cityBattleRadio()              // 城市数据对比
                    // //this.forCityData('社区数')
                    this.GetCompareCityRate()           // 城市上刊率对比
                    this.forCityKeyData('tab')          // 城市关键数据对比  - 订单、广告主、订单总额
                    this.getCityKeyData_resMediaAds()   // 城市关键数据对比 - 社区、点位、媒体
                } else if (this.activeName === 'third') {
                    if (this.beforeActiveName === 'second') {
                        this.currCity = this.beforCurrCityL
                    }
                    this.GetUserAdsInfo('自然天')
                    this.getResRateFun()
                    this.getAdsRateFun()
                    // }
                }
                this.beforeActiveName = this.activeName
            },
            // 设置初始时间
            setTime() {
                // toTime
                let starTime = timeFormat.returnMonthCount(5,'-') //this.GetDateStr(5)
                let endTime = timeFormat.returnMonthCount(0,'-')  //this.GetDateStr(0)
                let starTimeSub = starTime.substring(0,7)
                let endTimeSub = endTime.substring(0,7)
                this.nowMonth = endTimeSub
                this.toTime = endTime
                this.allkeyDataDate = [starTimeSub, endTimeSub]     // 关键数据总量趋势
                this.addkeyDataDate = [starTimeSub, endTimeSub]     // 关键数据增量趋势
                this.TOrderDate = [starTimeSub,endTimeSub]
                this.adOwnerDate = [starTime, endTime]              // 广告主排行
                this.salesRankDate = [starTime, endTime]           // 销售业绩排行
                this.resPMCDate = [starTime, endTime]               // 入驻物业排行
                this.secCard2time = [starTimeSub,endTimeSub]        //  城市数据对比
                this.beforeSecCard2time = this.secCard2time.concat()
                this.cityRateCompareDate = [starTime,endTime]     // 城市上刊率对比
                this.BeforeCityRateCompareDate = this.cityRateCompareDate.concat()
                this.cityKeyDataDate = [starTime,endTime]          // 城市关键数据对比
                this.pointDate = [starTime,endTime]               // 点位使用概况
                this.resSearchDate = [starTime,endTime]          // 社区上刊率列表
                this.adsSearchDate = [starTime,endTime]           // 点位上刊率列表
                // console.log('starTime', starTime, 'endTime', endTime, 'this.toTime', this.toTime)
            },
            // 时间选择
            analysisChangeTime(val) {
                // console.log(val, '修改日期', this.adOwnerDate)
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
            //选择月份
            analysisChangeMonth(String,card,index) {
                // this.card3DateMin = this.allkeyDataDate[0]
                if(String === 'trend'){
                    if (this.allkeyDataDate[0] > this.allkeyDataDate[1]) {
                        this.$message({
                            type: 'warning',
                            message: '结束时间小于开始时间'
                        })
                    }else{
                        let starT = ''
                        let endT = ''
                        if(card === 'card3'){
                            // console.log('analysisChangeMonth选择月份', this.allkeyDataDate)
                            let compareLen = this.isMonthLength(this.allkeyDataDate)
                            if (compareLen > 5) {
                                // this.secCard2time = this.beforeSecCard2time.concat()
                                if(index === '0'){
                                    starT =  this.allkeyDataDate[0]
                                    endT = this.GetSpecifiedDateStr(this.allkeyDataDate[0],-5).substring(0,7)
                                }else if(index === '1'){
                                    starT = this.GetSpecifiedDateStr(this.allkeyDataDate[1],5).substring(0,7)
                                    endT = this.allkeyDataDate[1]
                                }
                                this.allkeyDataDate = [starT,endT]
                                // console.log(starT,endT,'校验完后的时间',this.allkeyDataDate)
                                this.$message({
                                    type: 'warning',
                                    message: '月份跨度不能大于六个月'
                                })
                            }
                            this.allkeyDataTime = '其它'
                            this.card3TabsRadio(this.allkeydatakind,card,this.allkeyDataDate)
                            // console.log('总量趋势')
                        }else if(card === 'card4'){
                            let compareLen = this.isMonthLength(this.addkeyDataDate)
                            if (compareLen > 5) {
                                // this.secCard2time = this.beforeSecCard2time.concat()
                                if(index === '0'){
                                    starT =  this.addkeyDataDate[0]
                                    endT = this.GetSpecifiedDateStr(this.addkeyDataDate[0],-5).substring(0,7)
                                }else if(index === '1'){
                                    starT = this.GetSpecifiedDateStr(this.addkeyDataDate[1],5).substring(0,7)
                                    endT = this.addkeyDataDate[1]
                                }
                                this.addkeyDataDate = [starT,endT]
                                // console.log(starT,endT,'校验完后的时间',this.addkeyDataDate)
                                this.$message({
                                    type: 'warning',
                                    message: '月份跨度不能大于六个月'
                                })
                            }
                            this.addkeyDataTime = '其它'
                            this.card3TabsRadio(this.addkeyDataKind,card,this.addkeyDataDate)
                            // console.log('增量趋势')
                        }
                    }
                }
            },
            // 行业订单总量趋势 - 选择月份
            orderChangeMonth(index){
                if (this.TOrderDate[0] > this.TOrderDate[1]) {
                    this.$message({
                        type: 'warning',
                        message: '结束时间小于开始时间'
                    })
                }else{
                    let starT = ''
                    let endT = ''
                    let compareLen = this.isMonthLength(this.TOrderDate)
                    if (compareLen > 5) {
                        // this.secCard2time = this.beforeSecCard2time.concat()
                        if(index === '0'){
                            starT =  this.TOrderDate[0]
                            endT = this.GetSpecifiedDateStr(this.TOrderDate[0],-5).substring(0,7)
                        }else if(index === '1'){
                            starT = this.GetSpecifiedDateStr(this.TOrderDate[1],5).substring(0,7)
                            endT = this.TOrderDate[1]
                        }
                        this.TOrderDate = [starT,endT]
                        // console.log(starT,endT,'校验完后的时间',this.TOrderDate)
                        this.$message({
                            type: 'warning',
                            message: '月份跨度不能大于六个月'
                        })
                    }
                    this.TOrderTime = '其它'
                    // console.log('行业订单总量趋势 - 选择月份',this.card5Industry)
                    for(let i=0;i<this.card5Industry.length;i++){
                        this.getIOrderData(this.card5Industry[i],'change')
                    }

                }
            },
            // 获取当前时间并计算N月前的日期
            GetDateStr(AddMonthCount) {
                let dd = new Date();
                dd.setMonth(dd.getMonth() - AddMonthCount);
                let Y = dd.getFullYear();
                let M = (dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1)
                let D = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()
                return Y + '-' + M + '-' + D
            },
            // 数据大到小排序
            compareFun(obj1, obj2) {
                let val1 = obj1.totalSum;
                let val2 = obj2.totalSum;
                if (val1 < val2) {
                    return 1;
                } else if (val1 > val2) {
                    return -1;
                } else {
                    return 0;
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
            // 时间切换（三个月、半年、全部） TOrderTime
            RadioTime(val, string) {
                // console.log('时间Radio', val, string)
                let String = ''
                let starTime = ''
                let endTime = timeFormat.returnMonthCount(0,'-') //this.GetDateStr(0)
                if (val === '最近三个月') {
                    starTime = timeFormat.returnMonthCount(2,'-') //this.GetDateStr(2)
                } else if (val === '最近半年') {
                    starTime = timeFormat.returnMonthCount(5,'-') //this.GetDateStr(5)
                } else if (val === '全部') {
                    String = 'allTime'
                }
                switch (string) {
                    case 'card3':
                        this.allkeyDataDate = [starTime.substring(0,7),endTime.substring(0,7)]
                        this.card3TabsRadio(this.allkeydatakind,string,this.allkeyDataDate)
                        break;
                    case 'card4':
                        this.addkeyDataDate = [starTime.substring(0,7),endTime.substring(0,7)]
                        this.dateCompare = false
                        this.CountOfIncreDataShow.dateCompare = this.CountOfIncreData.timeData
                        this.CountOfIncreDataShow.AddDataCP = []
                        let dateTime = this.changeTime(this.addkeyDataDate[0]) + '-' + this.changeTime(this.addkeyDataDate[1])
                        this.CountOfIncreDataShow.TitleDate = [dateTime]
                        this.card3TabsRadio(this.addkeyDataKind,string,this.addkeyDataDate)
                        break;
                    case 'TOrder':
                        this.TOrderDate = [starTime.substring(0,7),endTime.substring(0,7)]
                        this.totalOrderData_orderPrice = []                //  订单金额
                        this.totalOrderData_orderNumber = []               //  订单数量
                        this.totalOrderData_orderAdOwner = []              //  广告主数
                        this.totalOrderTitleShow = []
                        for(let i=0;i<this.card5Industry.length;i++){
                            this.getIOrderData(this.card5Industry[i])
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
                    case 'cityBattle':
                        // 城市数据对比
                        this.secCard2time = [starTime.substring(0,7), endTime.substring(0,7)]
                        this.beforeSecCard2time = this.secCard2time.concat()
                        this.forCityData(this.cityBattleTitle)
                        break;
                    case 'cityRate':
                        // 城市上刊率对比
                        this.cityRateCompareDate = [starTime, endTime]
                        this.BeforeCityRateCompareDate = this.cityRateCompareDate.concat()
                        this.GetCompareCityRate()
                        break;
                    case 'cityKey':
                        this.cityKeyDataDate = [starTime, endTime]
                        this.forCityKeyData('enty')
                        // 城市关键数据对比 - 社区、点位、媒体
                        this.getCityKeyData_resMediaAds()
                        break;
                    case 'resRate':
                        this.resLoading = true
                        this.resSearchDate = [starTime, endTime]
                        this.setPageNoAndTableDataRes()
                        this.getResRateFun()
                        break;
                    case 'adsRate':
                        this.adsLoading = true
                        this.adsSearchDate = [starTime, endTime]
                        this.setPageNoAndTableDataAds()
                        this.getAdsRateFun()
                    default:
                        console.log('时间切换');
                }
            },
            // 关键数据总量趋势 - Radio
            card3TabsRadio(val,card,timeArr) {
                let onStart = this.returnDate(timeArr[0],'start')
                let onEnd = this.returnDate(timeArr[1])
                let params = {
                    uid: this.session_userData.uID,
                    asrIDs: this.returnAsrID(),
                    onStart: onStart,
                    onEnd: onEnd,
                }
                if (card === 'card4') {
                    this.isAddkeyDataKind = true
                    this.keyDataBarLoading = true
                } else if (card === 'card3') {
                    this.isReskeyDataKind = true
                    this.keyDataLineLoading = true
                }
                // console.log('关键数据总量/增量趋势 - params',params)
                switch (val) {
                    case '社区数':
                        this.getAllResData(card,params);
                        break;
                    case '广告门数':
                        this.getAllMediaData(card,params);
                        break;
                    case '点位数':
                        this.getAllAdsData(card,params);
                        break;
                    case '上刊率':
                        this.getAllRateData(card,params);
                        break;
                    case '订单数':
                        this.getAllOrderData(card,params);
                        break;
                    case '订单总额':
                        this.getAllOrderPriceData(card,params);
                        break;
                    case '广告主数':
                        this.getAllAdOwnerData(card,params);
                        break;
                    default:
                        console.log('切换异常', this.allkeydatakind);
                }
            },
            // 行业订单总量趋势 - Radio
            totleOrderRadio(val){ // TOrderTitleRadio
                console.log('行业订单总量趋势 - Radio',val)
                if (val === '订单金额'){
                    this.totalOrderDataShow =  this.totalOrderData_orderPrice.concat()           //  折线数据
                }else if (val === '订单数量'){
                    this.totalOrderDataShow =  this.totalOrderData_orderNumber.concat()           //  折线数据
                }else if (val === '广告主数'){
                    this.totalOrderDataShow =  this.totalOrderData_orderAdOwner.concat()           //  折线数据
                }
                this.busOrderLine()
            },
            // 行业订单总量趋势 - 行业选择
            IOrderChange(){
                // console.log('行业订单select',this.card5Industry)
                if(this.card5Industry.length > 0){
                    let industryData = this.card5Industry
                    let beforeIndustryData = this.beforeCard5business
                    let industryArr = this.session_industryData
                    let industryDataShow = this.totalOrderDataShow
                    // console.log('一级行业',this.session_industryData,'折线数据',this.totalOrderDataShow)
                    if( beforeIndustryData.length > industryData.length){
                        // console.log('行业减少了',)
                        let iid = 0
                        for(let BData of beforeIndustryData){
                            let isFind = true
                            for(let IData of industryData){
                                if(IData == BData){
                                    isFind = false
                                    break
                                }
                            }
                            if(isFind){
                                iid = BData
                                for(let SData of industryArr){
                                    if(SData.value == iid){
                                        // console.log('行业',SData)
                                        for(let showData of industryDataShow){
                                            if(showData.name === SData.label){
                                                showData.data = []
                                                for(let i=0;i< this.totalOrderTitleShow.length;i++){
                                                    if(showData.name === this.totalOrderTitleShow[i]){
                                                        this.totalOrderTitleShow.splice(i,1)
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
                                break
                            }
                        }
                    }else{
                        // console.log('行业增加了',)
                        this.TOrderTitleRadio = '订单金额'
                        this.getIOrderData(industryData[industryData.length - 1])
                    }
                    this.beforeCard5business = industryData.concat()
                }else{
                    this.$message({
                        type: 'warning',
                        message:'行业不能为空'
                    })
                    this.card5Industry = this.beforeCard5business.concat()
                }
            },
            // 行业订单总量趋势 - 删除原数据
            DelAllOrderData(orderName){
                for(let i=0; i<this.totalOrderData_orderPrice.length;i++){
                    if(this.totalOrderData_orderPrice[i].name === orderName){
                        console.log('行业订单总量趋势 - 删除原数据',this.totalOrderData_orderPrice[i])
                        this.totalOrderData_orderPrice.splice(i,1)
                        this.totalOrderData_orderNumber.splice(i,1)
                        this.totalOrderData_orderAdOwner.splice(i,1)
                        break
                    }
                }
                console.log(orderName,'删除原数据-',this.totalOrderData_orderPrice,this.totalOrderData_orderNumber,this.totalOrderData_orderAdOwner)
                // this.busOrderLine()
            },
            // 入驻物业排行 - 按钮切换
            resPMCRadio(val) {
                // console.log(val)
                if (val === '社区数量') {
                    this.ResPMCShowData = this.ResPMCResCount
                } else if (val === '点位数量') {
                    this.ResPMCShowData = this.ResPMCMCount
                }
                this.PropertyRank()
            },
            //adOwnerRadio 广告主排行 - 按钮切换
            adOwnerRadio(val) {
                // console.log(val)
                console.log('adOwnerDataTitle', this.adOwnerDataTitle)
                if (val === '订单金额') {
                    this.AdOwnerShowData = this.AdOwnerTotalSum
                    // console.log('切换为订单金额')
                } else if (val === '订单数量') {
                    this.AdOwnerShowData = this.AdOwnerApCount
                    // console.log('切换为订单数据')
                }
                this.adOwnerRank()
            },
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
            //销售业绩排行-radio
            salesRankRadio(val) {
                // console.log(val)
                if (val === '销售金额') {
                    this.salesRankShowData = this.salesRankTotalSum
                } else if (val === '销售单数') {
                    this.salesRankShowData = this.salesRankApCount
                }
                this.salesRank()
            },
            // 关键数据增量对比 - radio月份对比
            card4Radio() {
                if (this.dateCompare) {
                    this.card4ChangeMonth_CP()
                } else {
                    this.CountOfIncreDataShow.dateCompare = this.CountOfIncreData.timeData
                    this.CountOfIncreDataShow.AddDataCP = []
                    let dateTime = this.changeTime(this.addkeyDataDate[0]) + '-' + this.changeTime(this.addkeyDataDate[1])
                    this.CountOfIncreDataShow.TitleDate = [dateTime]
                    if(this.addkeyDataKind === '社区数'){
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.res
                    }else if(this.addkeyDataKind === '广告门数'){
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.media
                    }else if(this.addkeyDataKind === '点位数'){
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.ads
                    }else if(this.addkeyDataKind === '上刊率'){
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.Rate
                    }else if(this.addkeyDataKind === '订单数'){
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.order
                    }else if(this.addkeyDataKind === '订单总额'){
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.orderPrice
                    }else if(this.addkeyDataKind === '广告主数'){
                        this.CountOfIncreDataShow.AddData = this.CountOfIncreData.adOwner
                    }
                    // console.log('关键数据增量对比 - radio月份对比',this.CountOfIncreDataShow)
                    this.keyDateBar()
                }
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
            // 关键数据增量对比 - 月份对比
            card4ChangeMonth_CP(){
                // console.log('关键数据增量对比 - 月份对比',this.card4Date2)
                if((this.card4Date2[0] !== null && this.card4Date2[0] !== undefined) && (this.card4Date2[1] !== null && this.card4Date2[1] !== undefined)){
                    let compareLen = this.isMonthLength(this.card4Date2)
                    // 比较两对比月份间隔是否相等
                    let Len = this.isMonthLength(this.addkeyDataDate)
                    // console.log(Len,'时间段已选择完成',compareLen)
                    if(Len !== compareLen){
                        this.$message({
                            type: 'warning',
                            message: '请选择相同的月份数量',
                        })
                    }else{
                        let onStart = this.card4Date2[0]
                        let onEnd = this.card4Date2[1]
                        let params = {
                            uid: this.session_userData.uID,
                            token: this.session_userData.token,
                            onStart: this.returnDate(onStart,'start'), //onStart,
                            onEnd: this.returnDate(onEnd), //onEnd,
                            asrIDs: this.returnAsrID()
                        }
                        let url = this.isKeyDataKind(this.addkeyDataKind)
                        api.getApi(this.Count + url, params).then(res=>{
                            console.log('关键数据增量月份对比',res)
                            let dataArr = res.data
                            if(this.addkeyDataKind === '订单总额'){
                                this.setKetDataMonthCompare(dataArr,'price')
                            }else if(this.addkeyDataKind === '上刊率'){
                                this.setKetDataMonthCompare(dataArr,'rate')
                            }else{
                                this.setKetDataMonthCompare(dataArr)
                            }

                        })
                    }
                }else{
                    console.log('时间段还未选择完成',)
                }
                // console.log('开始时间',this.card4Date2[0],'结束时间',this.card4Date2[1])
            },
            //设置关键数据增量月份对比数据
            setKetDataMonthCompare(data,String){
                let AddData = []
                let monthList = []
                for(let key of data){
                    if(String === 'price'){
                        AddData.push((key.increment/100).toFixed(0) || 0)
                    }else if(String === 'rate'){
                        AddData.push(key.publicationRate)
                    }else{
                        AddData.push(key.increment)
                    }
                    monthList.push(key.month)
                }
                let showTime = this.CountOfTotalDataShow.timeData
                // console.log('showTime',showTime)
                let tempDate = []
                for (let i = 0; i < showTime.length; i++) {
                    tempDate.push(this.changeTime(showTime[i]) + '对比' + this.changeTime(monthList[i]))
                }
                // console.log('tempDate',tempDate)
                this.CountOfIncreDataShow.AddDataCP = AddData
                this.CountOfIncreDataShow.dateCompare = tempDate
                let starT = this.changeTime(this.addkeyDataDate[0]) + '-' + this.changeTime(this.addkeyDataDate[1])
                let endT = this.changeTime(this.card4Date2[0]) + '-' + this.changeTime(this.card4Date2[1])
                let timeArr = [starT,endT]
                this.CountOfIncreDataShow.TitleDate = timeArr //['2018/03-2018/08', '2017/03-2017/08'] // '2018/03-2018/08', '2017/03-2017/08'
                console.log('月份对比数据TitleDate',this.CountOfIncreDataShow.TitleDate)
                console.log('月份对比数据timeArr',timeArr)
                this.keyDateBar()
            },
            // 表头显示全部城市表格数据
            showCityDataTable() {
                for (let RMKey of this.RMAllData) {
                    for (let rkey of this.RMPieRateData) {
                        if (rkey.name == RMKey.city) {
                            RMKey.upPercent = rkey.value
                            break
                        }
                    }
                }
                this.cityDataTableVisible = true
            },
            // 单公司有多个城市
            changeAsNameCity(val){
                console.log('val',val,'this.beforeAllData',this.beforeAllData)
                this.activeCity = val
                let cityListRes = this.beforeAllData.adsInfo.asrList[0].cityList
                let cityListRate = this.beforeAllData.publicationRateInfo[0].cityList
                //环状图表(上刊率)
                for (let key of cityListRate) {
                    if (key.cityName === val) {
                        this.setHeadDataSKPie(key.areaList.sort(this.compareSort('publishRate')))
                        break
                    }
                }
                // 环状图表 (社区、广告门、点位)
                for(let key of cityListRes){
                    if(key.rName === val){
                        this.setHeadDataPie(key.detailInfos.sort(this.compareSort('countRes')))
                        break
                    }
                }
            },
            // 概况相关汇总数据接口
            getAllDateSurvey(){
                this.allDataLoading = true
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    asrIDs: this.returnAsrID()
                }
                api.getApi(this.Count + '/GetSurvey', params).then(res=>{
                    console.log('概况相关汇总数据接口',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.allDataLoading = false
                        this.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.beforeAllData = JSON.parse(JSON.stringify(dataArr))
                        let headData = {
                            res: dataArr.adsInfo.countRes,
                            media: dataArr.adsInfo.countMedia,
                            ads: dataArr.adsInfo.countAdS,
                            order: dataArr.adPlanInfo.apCount,
                            cash: dataArr.adPlanInfo.totalSum / 100,
                            price: dataArr.adPlanInfo.totalSum ? (dataArr.adPlanInfo.totalSum / (dataArr.adPlanInfo.apCount * 100)).toFixed(2) : 0,
                            SK: 0,
                            customer: 0
                        }
                        // 统计全时段的广告主数
                        for(let cKey of dataArr.countATC){
                            headData.customer += cKey.countcID
                            // headData.order += cKey.apCount
                            // headData.cash += cKey.totalSum
                        }
                        // headData.price =  headData.order ? (headData.cash / (headData.order * 100)).toFixed(2) : 0
                        if (this.currCity === '0'){
                            console.log('全国',this.currCity)
                            // 表头上刊率及环状上刊率图表
                            headData.SK = this.setHeadDataSKPie(dataArr.publicationRateInfo)
                            // 环状图表 (社区、广告门、点位)
                            this.setHeadDataPie(dataArr.adsInfo.asrList)
                        }else{
                            console.log('非全国',this.currCity)
                            // 表头上刊率
                            headData.SK = dataArr.publicationRateInfo[0].publishRate * 100 ?
                                (dataArr.publicationRateInfo[0].publishRate * 100).toFixed(2) : 0
                            //环状图表(上刊率)
                            this.setHeadDataSKPie(dataArr.publicationRateInfo[0].cityList[0].areaList.sort(this.compareSort('publishRate')))
                            // 环状图表 (社区、广告门、点位)
                            this.setHeadDataPie(dataArr.adsInfo.asrList[0].cityList[0].detailInfos.sort(this.compareSort('countRes')))
                            // 单公司有多城市时的城市list
                            let cityArr = []
                            for(let key of dataArr.adsInfo.asrList[0].cityList){
                                cityArr.push({
                                    value: key.rName,
                                    label: key.rName,
                                })
                            }
                            this.activeCity = cityArr[0].value
                            this.selectCityList = cityArr
                        }
                        this.RMHeadAllData = headData
                        console.log('this.RMHeadAllData',this.RMHeadAllData)
                        this.AnalysisLoading.close()
                    }
                    this.allDataLoading = false
                }).catch(err => {
                    console.log('概况相关汇总数据接口error')
                    this.allDataLoading = false
                });
            },
            // 设置表头的环状图表 (社区、广告门、点位)
            setHeadDataPie(setData){
                console.log('设置表头的环状图表 (社区、广告门、点位)',setData)
                let i = 0
                // 全部按钮的表格
                let RMAllDataTable = []
                let resArr = []
                let mediaArr = []
                let adsArr = []
                let nameArr = []
                // 其它数据
                let otherData = {res: 0, media: 0, ads: 0}
                for (let key of setData){
                    let tempObj = {
                        countRes: key.countRes || 0,
                        countAds: key.countAdS || 0,
                        city: key.asName || key.rName,
                        countMedia: key.countMedia || 0,
                        upPercent: 0,
                        adOwners: 0,
                        orders: 0,
                        totalPrice: 0,
                        asrID: key.asrID
                    }
                    RMAllDataTable.push(tempObj)
                    if (i < 7) {
                        resArr.push({name: tempObj.city, value: tempObj.countRes})         // 饼状图- 社区
                        mediaArr.push({name: tempObj.city, value: tempObj.countMedia})     // 饼状图- 媒体
                        adsArr.push({name: tempObj.city, value: tempObj.countAds})         // 饼状图- 点位
                        nameArr.push(tempObj.city)       // 饼状图 - 城市\区名称
                    } else {
                        otherData.res += key.countRes
                        otherData.media += key.countMedia
                        otherData.ads += key.countAdS
                    }
                    i++
                }
                if (i >= 8) {
                    resArr.push({value: otherData.res, name: '其它'})
                    mediaArr.push({value: otherData.media, name: '其它'})
                    adsArr.push({value: otherData.ads, name: '其它'})
                    nameArr.push('其它')
                }
                // 饼状图
                this.RMPieRESData = resArr
                this.RMPieMediaData = mediaArr
                this.RMPieAdsData = adsArr
                this.RMAllName = nameArr
                this.RMAllDataPie()
                // 表格数据
                this.RMAllData = RMAllDataTable
                if(this.currCity == '0'){
                    this.cityCompareTable = RMAllDataTable
                }
                console.log('this.RMPieMediaData媒体',this.RMPieMediaData,'this.RMPieAdsData点位',this.RMPieAdsData)
                console.log('this.RMAllName',this.RMAllName,'RMAllDataTable',RMAllDataTable)
            },
            //设置表头的环状图表 (上刊率)
            setHeadDataSKPie(setData){
                console.log('设置表头的环状图表 (上刊率)',setData)
                // 统计表头上刊率及环状图表上刊率
                let i = 0
                let rateArr = []
                let otherRate = 0
                let totalPublishRate = 0
                for(let key of setData){
                    totalPublishRate += key.publishRate
                    if(i < 7){
                        rateArr.push({name: key.asName || key.areaName, value: Math.floor(key.publishRate * 10000) / 100})
                    }else{
                        otherRate += key.publishRate
                    }
                    i++
                }
                if(otherRate > 0){
                    rateArr.push(
                        {
                            name: '其它',
                            value: Math.floor(otherRate * 10000 / (setData.length - 6)) / 100
                        }
                    )
                }
                console.log('rateArr',rateArr) // asrID
                this.RMPieRateData = rateArr
                if (this.currCity === '0'){
                    return (totalPublishRate * 100 / setData.length).toFixed(2)
                }
            },
            // 关键数据总量/增量趋势 - 社区接口
            getAllResData(card,params) {
                // console.log('关键数据总量/增量趋势 - params',params)
                params.token = this.session_userData.token
                api.getApi(this.Count + '/GetResCountOfTotalAndIncrement', params).then(res => {
                    console.log('社区总量趋势', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    } else{
                        let dataArr = res.data
                        if(dataArr.length > 0){
                            this.CountOfTotalData.res = []
                            this.CountOfTotalData.timeData = []
                            this.CountOfIncreData.res = []
                            for (let i = 0; i < dataArr.length; i++) {
                                // 总量数据
                                this.CountOfTotalData.res.push(dataArr[i].total)
                                this.CountOfTotalData.timeData.push(dataArr[i].month)
                                // 增量数据
                                this.CountOfIncreData.res.push(dataArr[i].increment)

                            }
                            this.AllkeyDataShowFun(card,params,this.CountOfTotalData.res,this.CountOfIncreData.res)
                        }else{
                            this.$message({
                                message: '社区总量趋势,在该时段暂无数据',
                                type: 'warning'
                            })
                        }
                    }
                    this.AnalysisLoading.close()
                })
            },
            // 关键数据总量/增量趋势 - 广告门接口 this.session_userData.token
            getAllMediaData(card,params) {
                params.token = this.session_userData.token
                api.getApi(this.Count + '/GetMediaCountOfTotalAndIncrement', params).then(res => {
                    console.log('广告门总量趋势', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.media = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.media = []
                        for (let i = 0; i < dataArr.length; i++) {
                            // 总量数据
                            this.CountOfTotalData.media.push(dataArr[i].total)
                            this.CountOfTotalData.timeData.push(dataArr[i].month)
                            // 增量数据
                            this.CountOfIncreData.media.push(dataArr[i].increment)
                        }
                        this.AllkeyDataShowFun(card, params, this.CountOfTotalData.media, this.CountOfIncreData.media)
                    }
                })
            },
            // 关键数据总量/增量趋势 - 点位数接口
            getAllAdsData(card,params) {
                params.token = this.session_userData.token
                api.getApi(this.Count + '/GetAdSpaceCountOfTotalAndIncrement', params).then(res => {
                    console.log('点位数总量趋势', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    } else {
                        this.CountOfTotalData.ads = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.ads = []
                        let dataArr = res.data
                        for (let i = 0; i < dataArr.length; i++) {
                            // 总量数据
                            this.CountOfTotalData.ads.push(dataArr[i].total)
                            this.CountOfTotalData.timeData.push(dataArr[i].month)
                            // 增量数据
                            this.CountOfIncreData.ads.push(dataArr[i].increment)
                        }
                        this.AllkeyDataShowFun(card, params, this.CountOfTotalData.ads, this.CountOfIncreData.ads)
                    }
                })
            },
            // 关键数据总量/增量趋势 - 上刊率接口
            getAllRateData(card,params){
                params.token = this.session_userData.token
                api.getApi(this.Count + '/GetPublicationRateTotalAndIncrement', params).then(res=>{
                    console.log('上刊率总量趋势',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.Rate = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.Rate = []
                        for (let i = 0; i < dataArr.length; i++) {
                            // 总量数据
                            this.CountOfTotalData.Rate.push(dataArr[i].totalPublicationRate)
                            this.CountOfTotalData.timeData.push(dataArr[i].month)
                            // 增量数据
                            this.CountOfIncreData.Rate.push(Math.floor(dataArr[i].publicationRate * 10000)/100)
                        }
                        this.AllkeyDataShowFun(card, params, this.CountOfTotalData.Rate, this.CountOfIncreData.Rate)
                    }
                })
            },
            // 关键数据总量/增量趋势 - 订单接口
            getAllOrderData(card,params){
                params.token = this.session_userData.token
                api.getApi(this.Count + '/GetOrderTotalAndIncrement', params).then(res=>{
                    console.log('订单总量/增量趋势',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.order = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.order = []
                        for (let i = 0; i < dataArr.length; i++) {
                            // 总量数据
                            this.CountOfTotalData.order.push(dataArr[i].total)
                            this.CountOfTotalData.timeData.push(dataArr[i].month)
                            // 增量数据
                            this.CountOfIncreData.order.push(dataArr[i].increment)
                        }
                        this.AllkeyDataShowFun(card, params, this.CountOfTotalData.order, this.CountOfIncreData.order)
                    }
                })
            },
            // 关键数据总量/增量趋势 - 订单总额接口
            getAllOrderPriceData(card,params){
                params.token = this.session_userData.token
                api.getApi(this.Count + '/GetOrderIncomeTotalAndIncrement', params).then(res=>{
                    console.log('订单总额/增量趋势',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.orderPrice = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.orderPrice = []
                        for (let i = 0; i < dataArr.length; i++) {
                            // 总量数据
                            this.CountOfTotalData.orderPrice.push((dataArr[i].total / 100).toFixed(0))
                            this.CountOfTotalData.timeData.push(dataArr[i].month)
                            // 增量数据
                            this.CountOfIncreData.orderPrice.push((dataArr[i].increment / 100).toFixed(0))
                        }
                        this.AllkeyDataShowFun(card, params, this.CountOfTotalData.orderPrice, this.CountOfIncreData.orderPrice)
                    }
                })
            },
            // 关键数据总量/增量趋势 - 广告主数接口
            getAllAdOwnerData(card,params){
                params.token = this.session_userData.token
                api.getApi(this.Count + '/GetAdOwnerTotalAndIncrement', params).then(res=>{
                    console.log('广告主总数/增量趋势',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    } else {
                        let dataArr = res.data
                        this.CountOfTotalData.adOwner = []
                        this.CountOfTotalData.timeData = []
                        this.CountOfIncreData.adOwner = []
                        for (let i = 0; i < dataArr.length; i++) {
                            // 总量数据
                            this.CountOfTotalData.adOwner.push(dataArr[i].total)
                            this.CountOfTotalData.timeData.push(dataArr[i].month)
                            // 增量数据
                            this.CountOfIncreData.adOwner.push(dataArr[i].increment)
                        }
                        this.AllkeyDataShowFun(card, params, this.CountOfTotalData.adOwner, this.CountOfIncreData.adOwner)
                    }
                })
            },
            // 关键数据总量/增量趋势 - 数据展示 this.addkeyDataDate[0]
            AllkeyDataShowFun(card,params,allData,addData){
                // 总量数据显示
                let tempArr = []
                for(let key of allData){
                    if (this.allkeydatakind === '上刊率') {
                        tempArr.push(key * 100)
                    } else {
                        tempArr.push(key)
                    }
                }
                // 关键数据总量
                this.CountOfTotalDataShow.numData = tempArr //allData
                this.CountOfTotalDataShow.timeData = this.CountOfTotalData.timeData.concat()
                // 关键数据增量显示
                this.CountOfIncreData.timeData = this.CountOfTotalData.timeData.concat()
                this.CountOfIncreDataShow.dateCompare = this.CountOfIncreData.timeData.concat()
                this.CountOfIncreDataShow.AddData = addData  //this.CountOfIncreData.res.concat()
                let dateTime = this.changeTime(params.onStart.substring(0,7)) + '-' + this.changeTime(params.onEnd.substring(0,7))
                this.CountOfIncreDataShow.TitleDate = [dateTime]
                console.log('this.CountOfTotalData',this.CountOfTotalData)
                console.log('关键数据增量Title',this.CountOfIncreDataShow)
                console.log('CountOfTotalDataShow',this.CountOfTotalDataShow)
                if(card === 'card3'){
                    this.keyDataLine()
                }else if(card === 'card4'){
                    if (this.dateCompare && (this.card4Date2[0] !== null && this.card4Date2[0] !== undefined) && (this.card4Date2[1] !== null && this.card4Date2[1] !== undefined)) {
                        this.card4ChangeMonth_CP()
                    }else{
                        this.keyDateBar()
                    }
                }else{
                    this.keyDataLine()
                    if (this.dateCompare && (this.card4Date2[0] !== null && this.card4Date2[0] !== undefined) && (this.card4Date2[1] !== null && this.card4Date2[1] !== undefined)) {
                        this.card4ChangeMonth_CP()
                    } else {
                        this.keyDateBar()
                    }
                }
            },
            // 行业订单总量趋势 - 接口
            getIOrderData(val,String){
                if(String === 'change'){
                    this.totalOrderTitleShow = []
                    this.totalOrderData_orderPrice = []                        //  订单金额
                    this.totalOrderData_orderNumber = []                       //  订单数量
                    this.totalOrderData_orderAdOwner = []                      //  广告主
                }
                let tStart = this.TOrderDate[0]
                let tEnd = this.TOrderDate[1]
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    iid: val,
                    istart: tStart,
                    iend: tEnd,
                    asrIDs: this.returnAsrID()
                }
                api.getApi(this.Count + '/GetIOrder', params).then(res =>{
                    console.log(params,'行业订单总量趋势 - 接口',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()
                    } else {
                        let dataArr = res.data
                        if(dataArr.length > 0){
                            let orderName = ''
                            for(let key of this.session_industryData){
                                if(key.value == val){
                                    orderName = key.label
                                    break
                                }
                            }
                            let orderPrice = {name: orderName,type: 'line',data:[]}
                            let orderNumber = {name: orderName,type: 'line',data:[]}
                            let orderAdOwner = {name: orderName,type: 'line',data:[]}
                            let orderMonths = []
                            for(let OKey of dataArr){
                                if(OKey.orderTotal !== undefined){
                                    orderPrice.data.push((OKey.orderTotal / 100).toFixed(0))
                                }else{
                                    orderPrice.data.push(0)
                                }
                                orderNumber.data.push(OKey.apCount)
                                orderAdOwner.data.push(OKey.comCount)
                                orderMonths.push(OKey.moth)
                            }
                            this.totalOrderData_orderPrice.push(orderPrice)                         //  订单金额
                            this.totalOrderData_orderNumber.push(orderNumber)                       //  订单数量
                            this.totalOrderData_orderAdOwner.push(orderAdOwner)                     //  广告主数
                            this.totalOrderDataShow =  this.totalOrderData_orderPrice.concat()    //  折线数据
                            this.totalOrderTitleShow.push(orderPrice.name)                          //  折线标题
                            console.log('行业订单总量趋势',this.totalOrderData_orderPrice,this.totalOrderData_orderNumber,this.totalOrderData_orderAdOwner)
                            this.totalOrderDate = orderMonths
                            this.busOrderLine()
                        }else{
                            this.$message({
                                message: '行业订单总量趋势,在该时段暂无数据',
                                type: 'warning'
                            })
                        }
                    }
                })
            },
            //行业订单占比 - 接口
            getIOrderTotalData() {
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    asrIDs: this.returnAsrID()
                }
                api.getApi(this.Count + '/GetAllIOrder', params).then(res => {
                    console.log('行业订单占比', res)
                    let dataArr = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    }else{
                        if(dataArr.length > 0){
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
                                    let tempTotal = {value: (dataArr[i].orderTotal / 100).toFixed(0), name: dataArr[i].iName}
                                    this.IOrderTotalArr[0].data.push(tempTotal)
                                    this.IOrderTotalArr[1].legendData.push(tempTotal.name)

                                    let tempApCount = {value: dataArr[i].apCount, name: dataArr[i].iName}
                                    this.IOrderApCount[0].data.push(tempApCount)
                                    this.IOrderApCount[1].legendData.push(tempApCount.name)

                                    let tempComCount = {value: dataArr[i].comCount, name: dataArr[i].iName}
                                    this.IOrderComCount[0].data.push(tempComCount)
                                    this.IOrderComCount[1].legendData.push(tempComCount.name)
                                    // IOrderApCount IOrderComCount
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

                            // console.log('this.IOrderTotal',this.IOrderTotal)
                            this.IOrderTotalShow = this.IOrderTotal.orderTotal
                            this.IOrderDataShow[0].data = this.IOrderTotalArr[0].data
                            this.IOrderDataShow[1].legendData = this.IOrderTotalArr[1].legendData
                            this.allOrderPie()
                        }else{
                            this.$message({
                                message: '行业订单占比,暂无数据',
                                type: 'warning'
                            })
                        }
                    }
                })
            },
            // 入驻物业排行 - 接口
            getResPMCRankData(Sting) {
                // console.log('时间段', this.resPMCDate)
                let tStart = this.resPMCDate[0] //this.splitTimeString(this.resPMCDate[0])
                let tEnd = this.resPMCDate[1] //this.splitTimeString(this.resPMCDate[1])
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    istart: tStart,
                    iend: tEnd,
                    asrIDs: this.returnAsrID()
                }
                if(Sting === 'allTime'){
                    delete(params.istart)
                    delete(params.iend)
                }
                api.getApi(this.Count + '/GetResPMC', params).then(res => {
                    console.log('销售业绩排行', res)
                    let ResPMCdata = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    }else {
                        if (ResPMCdata.length > 0) {
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
                            this.PropertyRank()
                        } else {
                            this.$message.warning('入驻物业排行在该时段暂无数据！');
                        }
                    }
                })
            },
            //广告主排行 - 接口
            getAdOwnerData(Sting) {
                let params = {}
                let tStart = this.adOwnerDate[0]
                let tEnd = this.adOwnerDate[1]
                params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    istart: tStart,
                    iend: tEnd,
                    asrIDs: this.returnAsrID()
                }
                if (Sting === 'allTime') {
                    delete(params.istart)
                    delete(params.iend)
                }
                // console.log('接口参数', params)
                api.getApi(this.Count + '/GetCOrder', params).then(res => {
                    console.log('广告主排行 ', res)
                    let dataArr = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    }else {
                        if (dataArr.length > 0) {
                            dataArr.sort(this.compareFun)
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
                            // this.AdOwnerShowData = this.AdOwnerTotalSum
                            this.adOwnerRank()
                        } else {
                            this.$message.warning('广告主排行在该时段暂无数据！');
                        }
                    }
                })
            },
            // 销售业绩排行-接口
            getSalesRankData(Sting) {
                let params = {}
                // console.log('时间段this.salesRankDate', this.salesRankDate)
                let tStart = this.salesRankDate[0] //this.splitTimeString(this.salesRankDate[0])
                let tEnd = this.salesRankDate[1] //this.splitTimeString(this.salesRankDate[1])
                params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    istart: tStart,
                    iend: tEnd,
                    asrIDs: this.returnAsrID()
                }

                if (Sting === 'allTime') {
                    delete(params.istart)
                    delete(params.iend)
                }
                api.getApi(this.Count + '/GetSOrder', params).then(res => {
                    console.log(params,'销售业绩排行', res)
                    let dataArr =  res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    }else {
                        if (dataArr.length > 0) {
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
                            // this.salesRank()
                        } else {
                            this.$message.warning('销售业绩排行暂无数据！');
                        }
                        this.salesRank()
                    }
                })
            },
            //图表
            //数据总览 饼图 全国
            RMAllDataPie() {
                // let PieData = this.$echarts.init(this.$refs.allDataPie);
                this.PieData = this.$echarts.init(this.$refs.allDataPie);
                // console.log('this.PieData', PieData)
                this.PieData.setOption({
                    color: ['#975fe4', '#3aa0ff', '#36cbcb', '#4dcb73', '#fad337', '#f2637b', '#6081FF', '#FE752A'],
                    tooltip: {
                        trigger: 'item',
                        // formatter: "{a} <br/>{b}: {c} ({d}%)",
                        formatter: function (params) {
                            // console.log('params',params)
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' + '<span>' + '数据' +
                                '</span>' + '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-bottom: -20px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params.seriesName + '</span>' + params.value + ((params.seriesName === '上刊率') ? '%': '')+'</p>' + '<br/>' +
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
                        orient: 'horizontal',
                        data: this.RMAllName,
                        left: "center",
                        bottom: 10,
                        itemWidth: 8,
                        itemHeight: 8,
                        itemGap: 24
                    },
                    series: [
                        {
                            name: '社区',
                            type: "pie",
                            center: ["15%", "50%"],
                            radius: ["42%", "55%"],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: this.RMPieRESData
                        },
                        {
                            name: '广告门',
                            type: "pie",
                            center: ["38%", "50%"],
                            radius: ["42%", "55%"],
                            color: this.colorArr,
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
                            data: this.RMPieMediaData
                        },
                        {
                            name: '点位',
                            type: "pie",
                            center: ["62%", "50%"],
                            radius: ["42%", "55%"],
                            color: this.colorArr,
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
                            data: this.RMPieAdsData
                        },
                        {
                            name: '上刊率',
                            type: "pie",
                            center: ["85%", "50%"],
                            radius: ["42%", "55%"],
                            color: this.colorArr,
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
                            data: this.RMPieRateData
                        }
                    ]
                });
                window.addEventListener("resize", ()=> {
                    this.PieData.resize();
                });
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
                            if(that.allkeydatakind !== '上刊率'){
                                return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                    '<span>' + '时间' + '</span>' + '<span>' + '数值' +
                                    '</span>' + '</p>' + '<br/>' +
                                    '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                    '<span>' + params[0].name + '</span>' + params[0].value + '</p>'
                            }else{
                                return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                    '<span>' + '时间' + '</span>' + '<span>' + '数值' +
                                    '</span>' + '</p>' + '<br/>' +
                                    '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                    '<span>' + params[0].name + '</span>' + (Math.floor(params[0].value * 100)/100) + '%'+'</p>'
                            }

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
                                    // formatter:function(val){
                                    //     return val*100 + '%'
                                    // },
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
                window.addEventListener("resize", ()=> {
                    this.keyDataLineEchart.resize();
                });
                this.isReskeyDataKind = false
                this.keyDataLineLoading = false
            },
            // 关键数据增量对比 柱状图
            keyDateBar() {
                if(this.keyDataBar){
                    this.keyDataBar.dispose()
                }
                this.keyDataBar = this.$echarts.init(this.$refs.keyDataBar);
                console.log('this.addkeyDataKind，keyDateBar',this.addkeyDataKind)
                this.keyDataBar.setOption({
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
                            if (params.length >= 2) {
                                return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                    '<span>' + '时间' + '</span>' + '<span>' + '数值' +
                                    '</span>' + '</p>' + '<br/>' +
                                    '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                    '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params[0].name.substr(0, 7) + '</span>' + params[0].data + '</p>' + '</br>' +
                                    '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-top: -20px">' +
                                    '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #BDDEFD;margin-right: 5px"></i>' + params[0].name.slice(9) + '</span>' + params[1].data + '</p>'
                            } else {
                                return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                    '<span>' + '时间' + '</span>' + '<span>' + '数值' +
                                    '</span>' + '</p>' + '<br/>' +
                                    '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                    '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params[0].name.substr(0, 7) + '</span>' + params[0].data + '</p>'
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
                window.addEventListener("resize", ()=> {
                    this.keyDataBar.resize();
                });
                this.isAddkeyDataKind = false
                this.keyDataBarLoading = false
            },
            // 行业订单总量趋势 折线图
            busOrderLine() {
                // console.log('行业订单总量趋势折线图busOrderLine',this.totalOrderDataShow)
                let busOrderLine = this.$echarts.init(this.$refs.busOrderLine);
                busOrderLine.setOption({
                    color: this.colorArr,
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            let title = '';
                            let arr = [];
                            for (let i = 0; i < params.length; i++) {
                                title = '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                    '<span>' + '行业(' + params[i].name + ')' + '</span>' + '<span>' + '数量' +
                                    '</span>' + '</p>' + '<br/>'
                                let data = '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 25px ">' +
                                    '<span><i style="display: inline-block;width: 6px; height: 6px; border-radius: 50%;margin-right: 5px;" :style="{background:params[i].color}"></i>' + params[i].seriesName + '</span>' + params[i].value + '</p>'
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
                    series: this.totalOrderDataShow
                });
                window.addEventListener("resize", function () {
                    busOrderLine.resize();
                })
            },
            // 行业订单占比 饼图
            allOrderPie() {
                let allOrderPie = this.$echarts.init(this.$refs.allOrderPie);
                let that = this
                let option1 = {
                    tooltip: {
                        trigger: "item",
                        // formatter: "{b}: {c} ({d}%)"
                        formatter: function (params) {
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' +
                                // '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-bottom: -20px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params.seriesName + '</span>' + params.value + '</p>' + '<br/>' +
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
                            fontFamily: "DINPro-Regular"
                        },
                        data: this.IOrderDataShow[1].legendData,
                        formatter: function (params) {
                            for (let i = 0; i < option1.series[0].data.length; i++) {
                                if (option1.series[0].data[i].name == params) {
                                    if (params.length === 2) {
                                        return (params + "             |      " + Math.round(option1.series[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%");
                                    } else if (params.length === 3) {
                                        return (params + "         |      " + Math.round(option1.series[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%")
                                    } else if (params.length === 4 && params !== '3C数码') {
                                        return (params + "     |      " + Math.round(option1.series[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%")
                                    } else if(params === '3C数码'){
                                        return (params + "        |      " + Math.round(option1.series[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%")
                                    } else if(params.length === 5){
                                        return (params + " |      " + Math.round(option1.series[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%")
                                    }else {
                                        return (params + " |      " + Math.round(option1.series[0].data[i].value / that.IOrderTotalShow * 10000) / 100.00 + "%");
                                    }
                                }
                            }
                        }
                    },
                    series: [
                        {
                            center: ["33%", "50%"],
                            name: this.card6data,
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
                };
                allOrderPie.setOption(option1);
                window.addEventListener("resize", function () {
                    allOrderPie.resize();
                });
            },
            // 入驻物业排行 柱状图
            PropertyRank() {
                let PropertyRank = this.$echarts.init(this.$refs.PropertyRank);
                PropertyRank.setOption({
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
                                // '<span>' + '数量' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params[0].seriesName + '</span>' + params[0].data + '</p>'

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
                                rotate: 25,     //文字逆时针旋转25°
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
                            name: this.PMCDataTitle === '社区数量'? '小区数' : '点位数',
                            type: 'bar',
                            barWidth: '15%',
                            data: this.ResPMCShowData
                        }
                    ]
                });
                window.addEventListener("resize", function () {
                    PropertyRank.resize();
                });
            },
            // 广告主排行 柱状图
            adOwnerRank() {
                // console.log('广告主排行')
                let adOwnerRank = this.$echarts.init(this.$refs.adOwnerRank);
                adOwnerRank.setOption({
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
                                // '<span>' + '数量' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params[0].seriesName + '</span>' + params[0].data + '</p>'

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
                                rotate: 25,     //文字逆时针旋转45°
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C", //坐标轴刻度文字的颜色
                                    // align: "center",
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
                window.addEventListener("resize", function () {
                    adOwnerRank.resize();
                });
            },
            // 销售业绩排行 柱状图
            salesRank() {
                if(this.salesRankShowData.length > 0){
                    let salesRank = this.$echarts.init(this.$refs.salesRank);
                    salesRank.setOption({
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
                                    // '<span>' + '数量' + '</span>' +
                                    '</p>' + '<br/>' +
                                    '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                    '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params[0].seriesName + '</span>' + params[0].data + '</p>'

                            },
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
                    window.addEventListener("resize", function () {
                        salesRank.resize();
                    });
                }else{

                }
            },

            // 城市对比-接口
            // 设置城市对比表格
            setCityCompare(){
                // this.beforeAllData.countATC
                console.log('this.beforeAllData.countATC',this.beforeAllData.countATC,'this.cityCompareTable',this.cityCompareTable)
                for (let bKey of this.beforeAllData.countATC) {
                    for (let cKey of this.cityCompareTable) {
                        if(bKey.asrID == cKey.asrID){
                            cKey.adOwners = bKey.countcID
                            cKey.orders = bKey.apCount
                            cKey.totalPrice = bKey.totalSum
                            break
                        }
                    }
                }
                for(let pKey of this.beforeAllData.publicationRateInfo){
                    for (let cKey of this.cityCompareTable){
                        if(pKey.asrID == cKey.asrID){
                            cKey.upPercent = Math.floor(pKey.publishRate * 10000) / 100
                            break
                        }
                    }
                }
            },
            // 城市数据对比
            cityBattleRadio(){
                // console.log('城市数据对比',this.cityBattleTitle)
                this.isCityBattleRadio = true
                if(this.selectCity.length < 6){
                    this.selectCity = [
                        '北京亲邻众联科技有限公司',
                        '上海多邻网络科技有限公司',
                        '广州市亲粤邻网络科技有限公司',
                        '深圳亲邻交互科技有限公司',
                        '成都亲邻科技有限公司',
                        '重庆市亲邻科技有限公司',
                        '天津亲邻众联科技有限公司'
                    ]
                }
                let stringName = this.cityBattleTitle
                this.forCityData(stringName)
            },
            // 循环调用城市数据接口 cityBattleTitle行业订单占比
            forCityData(name) {
                this.cityBattleLoading = true
                this.cityBattleLineSeries = []
                this.cityBattleLineStep = 0
                let cityArr = ['1', '2', '3', '4', '5', '6','7']
                // console.log('name',name)
                for (let i = 0; i < cityArr.length; i++) {
                    if(name === '社区数'){
                        this.GetCityTotalAndIncrement(cityArr[i],'/GetResCountOfTotalAndIncrement');
                    }else if(name === '广告门数'){
                        this.GetCityTotalAndIncrement(cityArr[i], '/GetMediaCountOfTotalAndIncrement');
                    }else if(name === '点位数'){
                        this.GetCityTotalAndIncrement(cityArr[i], '/GetAdSpaceCountOfTotalAndIncrement');
                    }else if(name === '上刊率'){
                        this.GetCityTotalAndIncrement(cityArr[i], '/GetPublicationRateTotalAndIncrement','rate');
                    }else if(name === '订单数'){
                        this.GetCityTotalAndIncrement(cityArr[i], '/GetOrderTotalAndIncrement');
                    }else if(name === '订单总额'){
                        this.GetCityTotalAndIncrement(cityArr[i], '/GetOrderIncomeTotalAndIncrement','price');
                    }else if(name === '广告主数'){
                        this.GetCityTotalAndIncrement(cityArr[i], '/GetAdOwnerTotalAndIncrement');
                    }
                }
            },
            // 城市关键数据对比 - 接口 （社区、广告门、点位）
            getCityKeyData_resMediaAds(){
                let tStart = this.cityKeyDataDate[0] //this.splitTimeString(this.cityKeyDataDate[0])
                let tEnd = this.cityKeyDataDate[1] //this.splitTimeString(this.cityKeyDataDate[1])
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    asrIDs: this.returnAsrID(),
                    istart: tStart,
                    iend: tEnd
                }
                api.getApi(this.Count + '/GetRM', params).then(res=>{
                    console.log('城市关键数据对比 - 接口 （社区、广告门、点位）',res)
                    let dataArr = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    }else{
                        this.cityResKeyData = []
                        this.cityAdsKeyData = []
                        this.cityMediaKeyData = []
                        if(res.data.length > 0){
                            // this.selectCompareCityData = ['北京市', '上海市', '广州市', '深圳市', '重庆市', '成都市','天津市']
                            for (let key of dataArr) {
                                let cityName = this.returnAsName(key.asrID)
                                let RESData = {name: cityName, value: key.countRES}
                                let MediaData = {name: cityName, value: key.countMedia}
                                let ADsData = {name: cityName, value: key.countAds}
                                this.cityResKeyData.push(RESData)               // 饼状图- 社区
                                this.cityAdsKeyData.push(ADsData)             // 饼状图- 媒体
                                this.cityMediaKeyData.push(MediaData)             // 饼状图- 点位
                            }
                            this.cityKeyData.res = this.cityResKeyData.concat()
                            this.cityKeyData.ads = this.cityAdsKeyData.concat()
                            this.cityKeyData.media = this.cityMediaKeyData.concat()
                            console.log('城市关键数据对比',this.cityResKeyData, this.cityAdsKeyData, this.cityMediaKeyData)
                            this.keyDataPie2()
                        }else{
                            this.$message.warning('城市关键数据对比（社区、广告门、点位）,在该时段暂无数据！');
                        }
                    }
                })
            },
            forCityKeyData(){
                this.cityBattlePieStep = 0
                let cityArr = ['1', '2', '3', '4', '5', '6','7']
                for (let i = 0; i < cityArr.length; i++){
                    this.getCityBattleData(cityArr[i], i);
                }
            },
            // 城市数据展示 - 接口
            getCityDataShow(){
                console.log('地图getCityDataShow',this.cityCompareTable)
                this.cityCompareTable = this.cityCompareTable.sort(this.compareSort('countRes'))
                this.chinaMapDataMax = this.cityCompareTable[0].countRes
                for(let cityKey of this.cityCompareTable){
                    this.setChinaMapData(cityKey)
                }
                this.chinaMap()
            },
            //城市关键数据对比  - 接口
            getCityBattleData(data, i) {
                this.CityBattleData = []
                let tStart = this.cityKeyDataDate[0] //this.splitTimeString(this.cityKeyDataDate[0])
                let tEnd = this.cityKeyDataDate[1] //this.splitTimeString(this.cityKeyDataDate[1])
                let params = {uid: this.session_userData.uID,token: this.session_userData.token, asrIDs: data, istart: tStart, iend: tEnd}
                // console.log('各城市参数', params)
                api.getApi(this.Count + '/GetCOrder', params).then(res => {
                    console.log(data,'城市数据展示res', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    }else{
                        let COrderData = res.data
                        let tempObj = {asrID: params.asrIDs, totalSum: 0, apCount: 0, adOwners: COrderData.length,}
                        for (let key of COrderData) {
                            tempObj.totalSum += Number((key.totalSum / 100).toFixed(0))
                            tempObj.apCount += key.apCount
                        }
                        console.log('tempObj',tempObj)
                        this.cityBattlePieStep++
                        this.CityBattleData.push(tempObj)
                        if (this.cityBattlePieStep >= 6) {
                            console.log(this.cityBattlePieStep,'++++++++城市关键数据对比  - 接口',this.CityBattleData)
                            // let that = this
                            let timer = setTimeout( ()=> {
                                this.setCityBattle()
                                clearTimeout(timer)
                            }, 1000)
                        }
                    }
                })
            },
            // 设置城市数据展示 - 广告主数据
            setCityBattle() {
                let cityData = this.CityBattleData
                console.log('设置城市数据展示', cityData)
                this.RMPieOrderData = []
                this.RMPieTotalPriceData = []
                this.RMPieAdOwnersData = []
                for (let RMData of cityData){
                    this.RMPieOrderData.push({
                        name: this.returnAsName(RMData.asrID),
                        value: RMData.apCount
                    })
                    this.RMPieTotalPriceData.push({
                        name: this.returnAsName(RMData.asrID),
                        value: RMData.totalSum
                    })
                    this.RMPieAdOwnersData.push({
                        name: this.returnAsName(RMData.asrID),
                        value: RMData.adOwners})
                }
                this.cityKeyData.order = this.RMPieOrderData.concat()
                this.cityKeyData.totalPrice = this.RMPieTotalPriceData.concat()
                this.cityKeyData.adOwner = this.RMPieAdOwnersData.concat()
                console.log('城市数据展示:', '订单', this.RMPieOrderData, '总额', this.RMPieTotalPriceData, '广告主数', this.RMPieAdOwnersData)
                this.keyDataPie2()
            },
            // 设置中国地图数据
            setChinaMapData(RMData){
                console.log('设置中国地图数据',RMData)
                for (let Ckey of this.chinaMapData) {
                    if (RMData.city.includes('北京') && Ckey.name === '北京') {
                        Ckey.value = RMData.countRes
                        break
                    } else if (RMData.city.includes('上海') && Ckey.name === '上海') {
                        Ckey.value = RMData.countRes
                        break
                    } else if (RMData.city.includes('广州') && Ckey.name === '广东') {
                        Ckey.value += RMData.countRes
                        break
                    } else if (RMData.city.includes('深圳') && Ckey.name === '广东') {
                        Ckey.value += RMData.countRes
                        break
                    } else if (RMData.city.includes('重庆') && Ckey.name === '重庆') {
                        Ckey.value = RMData.countRes
                        break
                    } else if (RMData.city.includes('成都') && Ckey.name === '四川') {
                        Ckey.value = RMData.countRes
                        break
                    }else if (RMData.city.includes('天津') && Ckey.name === '天津') {
                        Ckey.value = RMData.countRes
                        break
                    }
                }
            },
            // 城市数据对比 - 接口
            GetCityTotalAndIncrement(asrID,u,String){
                let onStart = this.returnDate(this.secCard2time[0],'start')
                let onEnd = this.returnDate(this.secCard2time[1])
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    asrIDs: asrID,
                    onStart: onStart,
                    onEnd: onEnd
                }
                let url = u
                // console.log(url,'城市数据对比社区接口 - params',params)
                api.getApi(this.Count + url, params).then(res=>{
                    console.log('asrID',asrID,'城市数据对比社区接口 - 接口', res)
                    let ResCount = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    }else{
                        if(ResCount === ''){
                            this.$message({
                                type:'warning',
                                message:'该时间段暂无数据'
                            })
                        }
                        this.cityBattleLineStep++
                        // console.log('步数',this.cityBattleLineStep)
                        let tempObj = {asrID: asrID, name: this.returnAsName(asrID), data: []}
                        let timeArr = []
                        if(String === 'rate'){
                            for(let res of ResCount){
                                tempObj.data.push(res.totalPublicationRate * 100)
                                timeArr.push(res.month)
                            }
                        }else{
                            for(let res of ResCount){
                                if(String === 'price'){
                                    tempObj.data.push((res.total/100).toFixed(0))
                                }else{
                                    tempObj.data.push(res.total)
                                }
                                timeArr.push(res.month)
                            }
                        }
                        this.cityBattleLineSeries.push(tempObj)
                        if (this.cityBattleLineStep >= 6) {
                            this.cityBattleLineTime = timeArr
                            this.cityBattleLineSeries = this.cityBattleLineSeries.sort(this.compareSort('asrID'))
                            for (let keyData of this.cityBattleLineSeries) {
                                for (let showData of this.cityBattleLineSeriesShow) {
                                    if (keyData.name === showData.name) {
                                        showData.data = keyData.data
                                        break
                                    }
                                }
                            }
                            console.log(this.cityBattleLineSeries,'城市数据对比社区接口',this.cityBattleLineSeriesShow)
                            console.log('城市数据对比社区接口月份',this.cityBattleLineTime)
                            this.cityBattleLine()
                        }
                        // this.cityBattleLoading = false
                        this.isCityBattleRadio = false
                    }
                })
            },
            // 城市上刊率对比 - 接口
            GetCompareCityRate(){
                this.cityPercentBattleLoading = true
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    asrIDs: this.returnAsrID(),
                    onStart:this.cityRateCompareDate[0],
                    onEnd:this.cityRateCompareDate[1]
                }
                api.getApi(this.Count + '/GetPublicationRateByCityCompare', params).then(res=>{
                    console.log('城市上刊率对比',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    }else{
                        let dataArr = res.data
                        if(dataArr.length > 0){
                            this.cityRateCompareData = dataArr
                            let rateList = []
                            let cityList = []
                            for(let val of dataArr){
                                rateList.push(Math.round(val.publicationRate * 10000)/100)
                                cityList.push(val.asName.substring(0,val.asName.length-6))
                            }
                            this.cityRateCompareShowData.name = cityList
                            this.cityRateCompare = cityList
                            this.cityRateCompareShowData.value = rateList
                            console.log('城市上刊率对比',this.cityRateCompareShowData)
                            this.cityPercentBattleBar()
                        }else{
                            this.$message.warning('城市上刊率对比,在该时段暂无数据！');
                        }
                    }
                    this.cityPercentBattleLoading = false
                })
            },
            chinaMap() {
                let chinaMap = this.$echarts.init(this.$refs.chinaMap);
                chinaMap.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            if (params.name) {
                                return params.seriesName + '<br/>' + params.name + ' : ' + params.value;
                            }
                        }
                    },
                    visualMap: {
                        type: 'continuous',
                        min: 0,
                        max: this.chinaMapDataMax,
                        text: ['高', '低'],
                        realtime: false, //拖拽手柄时实时更新
                        calculable: false, //是否显示手柄
                        color: ['#3887e0', '#6a9ce3', '#92bdee', '#c7ddf6', '#ebf3fc']
                    },
                    series: [
                        {
                            name: '社区数',
                            type: 'map',
                            mapType: 'china',
                            roam: false, //是否可以放大缩小
                            itemStyle: {
                                emphasis: {label: {show: true}},
                                borderColor: '#f7f7f7',
                                areaColor: '#e6e6e6'
                            },
                            data: this.chinaMapData
                        }
                    ]
                });
                window.addEventListener("resize", function () {
                    chinaMap.resize();
                })
            },
            // 城市数据对比  折线图
            cityBattleLine() {
                let cityBattleLine = this.$echarts.init(this.$refs.cityBattleLine);
                console.log('城市数据对比折线图this.cityBattleTitle',this.cityBattleTitle)
                let that = this
                cityBattleLine.setOption(
                    {
                        color: this.colorArr,
                        tooltip: {
                            trigger: 'axis',
                            formatter: function (params) {
                                let title = '';
                                let arr = [];
                                for (let i = 0; i < params.length; i++) {
                                    title = '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 255px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                        '<span>' + '城市(' + params[i].name + ')' + '</span>' + '<span>' + '数值' +
                                        '</span>' + '</p>' + '<br/>'
                                    let val = ''
                                    if(that.cityBattleTitle === '上刊率'){
                                        val =  (Math.floor(params[i].value * 100)/ 100)  + '%'
                                    }else{
                                        val =  params[i].value
                                    }
                                    let data = '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 25px ">' +
                                        '<span><i style="display: inline-block;width: 6px; height: 6px; border-radius: 50%;margin-right: 5px;" :style="{background:params[i].color}"></i>' + params[i].seriesName + '</span>' + val + '</p>'
                                    arr.push(data)
                                }
                                let tooltip = arr.join('')
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
                            data: this.selectCity
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
                            data: this.cityBattleLineTime,
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
                                formatter: that.cityBattleTitle === '上刊率' ? '{value}%' : '{value}',
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
                        series: this.cityBattleLineSeriesShow
                    },
                );
                let timer = setTimeout(()=>{
                    this.cityBattleLoading = false
                    clearTimeout(timer)
                },200)

            },
            // 城市上刊率对比  柱状图
            cityPercentBattleBar() {
                let cityPercentBattleBar = this.$echarts.init(this.$refs.cityPercentBattleBar);
                cityPercentBattleBar.setOption({
                    color: ['#4AA6FC'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: function (params) {
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params[0].name + '</span>' +
                                // '<span>' + '数量' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params[0].seriesName + '</span>' + params[0].data + '%' + '</p>'

                        },
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
                            data:  this.cityRateCompareShowData.name, //this.selectCity2,
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
                                textStyle: {
                                    fontFamily: "DINPro-Regular",
                                    color: "#2C313C" //坐标轴刻度文字的颜色
                                }
                            },
                        }
                    ],
                    yAxis: [
                        {
                            min: 0,
                            max: 100,
                            axisLabel: {
                                formatter: function (value) {
                                    // console.log('城市上刊率对比',value)
                                    let texts = [];
                                    if (value == 0) {
                                        texts.push('0%');
                                    }
                                    else if (value <= 20) {
                                        texts.push('20%');
                                    }
                                    else if (value <= 40) {
                                        texts.push('40%');
                                    }
                                    else if (value <= 60) {
                                        texts.push('60%');
                                    }
                                    else if (value <= 80) {
                                        texts.push('80%');
                                    }
                                    else {
                                        texts.push('100%')
                                    }
                                    return texts;
                                },
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
                            name: '上刊率',
                            type: 'bar',
                            barWidth: '20%',
                            data: this.cityRateCompareShowData.value //[10, 52, 50, 74, 59, 63]
                        }
                    ]
                });
                window.addEventListener("resize", function () {
                    cityPercentBattleBar.resize();
                });
                this.cityPercentBattleLoading = false
            },
            // 城市关键数据对比  饼图
            keyDataPie2() {
                let keyDataPie2 = this.$echarts.init(this.$refs.keyDataPie2);
                keyDataPie2.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-bottom: -20px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params.seriesName + '</span>' + params.value + '</p>' + '<br/>' +
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
                        orient: 'horizontal',
                        x: 'left',
                        data: this.selectCompareCityData,//this.RMAllName,
                        left: "center",
                        top: "0",
                        itemWidth: 8,
                        itemHeight: 8,
                        itemGap: 24
                    },
                    series: [
                        {
                            name: '社区',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['20%', '25%'],
                            color: this.colorArr,
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
                            data: this.cityResKeyData, //this.RMPieRESData,
                        },
                        {
                            name: '广告门',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['50%', '25%'],
                            color: this.colorArr,
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
                            data: this.cityMediaKeyData,//this.RMPieMediaData,
                        },
                        {
                            name: '点位',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['80%', '25%'],
                            color: this.colorArr,
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
                            data: this.cityAdsKeyData,//this.RMPieAdsData,
                        },
                        {
                            name: '订单',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['20%', '80%'],
                            color: this.colorArr,
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
                            data: this.RMPieOrderData,
                        },
                        {
                            name: '订单总额',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['50%', '80%'],
                            color: this.colorArr,
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
                            data: this.RMPieTotalPriceData,
                        },
                        {
                            name: '广告主',
                            type: "pie",
                            radius: ["25%", "35%"],
                            center: ['80%', '80%'],
                            color: this.colorArr,
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
                            data: this.RMPieAdOwnersData,
                        }
                    ]
                });
                window.addEventListener("resize", function () {
                    keyDataPie2.resize();
                });
            },
            // 城市数据对比 - 城市选择和charts关联
            selectCities(res) {
                // console.log(res)
                if(res.length > 0){
                    let beforeData = this.beforeCityBLSShow
                    let showData = this.cityBattleLineSeriesShow
                    let RawData = this.cityBattleLineSeries   // 原始数据
                    // console.log('beforeData', beforeData, 'showData', showData)
                    if (beforeData.length > res.length) {
                        // console.log('删除了')
                        for (let i of this.cityBattleLineSeriesShow) {
                            if (res.indexOf(i.name) == -1) {
                                // console.log('------', i.name)
                                i.data = []
                            }
                        }
                    } else {
                        // console.log('增加了')
                        let key = this.compareCityFun(beforeData, res, RawData)
                        // console.log('返回值', key)
                        if (key !== false) {
                            for (let CShow of this.cityBattleLineSeriesShow) {
                                if (CShow.name === key.name) {
                                    CShow.data = key.data
                                }
                            }
                        }
                    }
                    console.log('series---', this.cityBattleLineSeriesShow)
                    this.beforeCityBLSShow = res
                    this.cityBattleLine()
                }else{
                    this.selectCity = this.beforeCityBLSShow
                    this.$message({
                        type:'warning',
                        message:'城市不能为空'
                    })
                }
            },
            // 城市上刊率对比 - 城市选择
            cityRateSelect(res){
                console.log('城市上刊率对比 - 城市选择',res)
                if(res.length > 0){
                    let beforCity = this.beforeCityRate
                    let RateData = this.cityRateCompareData
                    if (beforCity.length > res.length){
                        for (let i = 0; i < beforCity.length; i++) {
                            if (res.indexOf(beforCity[i]) === -1){
                                this.cityRateCompareShowData.value.splice(i,1)
                            }
                        }
                    }else{
                        console.log('增加了',res[res.length-1],this.cityRateCompareData)
                        let addCity = res[res.length-1]
                        for(let val of RateData){
                            if(val.asName.includes(addCity)){
                                this.cityRateCompareShowData.value.push(Math.round(val.publicationRate * 10000)/100)
                                break
                            }
                        }
                    }
                    this.beforeCityRate = res
                    this.cityPercentBattleBar()
                }else{
                    this.cityRateCompareShowData.name = this.beforeCityRate
                    this.$message({
                        type:'warning',
                        message:'城市不能为空'
                    })
                }
            },
            // 城市关键数据对比 - 城市选择
            cityKeySelect(res){
                if(res.length > 0){
                    let beforCity = this.beforeCityKey // selectCompareCityData
                    let keyData = this.cityKeyData
                    console.log(beforCity,'城市关键数据对比 - 城市选择',keyData,res)
                    if (beforCity.length > res.length){
                        for (let i = 0; i < beforCity.length; i++) {
                            if (res.indexOf(beforCity[i]) === -1){
                                // console.log('减少了',beforCity[i])
                                for(let j=0; j<this.cityResKeyData.length;j++){
                                    if(this.cityResKeyData[j].name === beforCity[i]){
                                        this.cityResKeyData.splice(j,1)
                                        this.cityAdsKeyData.splice(j,1)
                                        this.cityMediaKeyData.splice(j,1)
                                        break
                                    }
                                }
                                for(let n=0;n<this.RMPieOrderData.length;n++){
                                    if(this.RMPieOrderData[n].name === beforCity[i]){
                                        this.RMPieOrderData.splice(n,1)
                                        this.RMPieTotalPriceData.splice(n,1)
                                        this.RMPieAdOwnersData.splice(n,1)
                                        break
                                    }
                                }
                                break
                            }
                        }
                    }else{ // {res:[],ads:[],media:[],order:[],totalPrice:[],adOwner:[]},
                        // console.log('增加了',res[res.length-1])
                        let addCity = res[res.length-1]
                        let i = 0
                        for(let kData in keyData){
                            console.log('kData',kData)
                            for(let val of keyData[kData]){
                                if(val.name === addCity){
                                    let tempObj = {name: addCity, value: val.value}
                                    if(kData === 'res'){
                                        this.cityResKeyData.push(tempObj)
                                        break
                                    }else if(kData === 'ads'){
                                        this.cityAdsKeyData.push(tempObj)
                                        break
                                    }else if(kData === 'media'){
                                        this.cityMediaKeyData.push(tempObj)
                                        break
                                    }else if(kData === 'order'){
                                        this.RMPieOrderData.push(tempObj)
                                        break
                                    }else if(kData === 'totalPrice'){
                                        this.RMPieTotalPriceData.push(tempObj)
                                        break
                                    }else if(kData === 'adOwner'){
                                        this.RMPieAdOwnersData.push(tempObj)
                                        break
                                    }
                                }
                            }
                            i++
                        }
                    }
                    this.beforeCityKey = res
                    console.log(this.cityResKeyData,this.cityAdsKeyData,this.cityMediaKeyData,'城市关键数据对比 - 城市选择',this.RMPieAdOwnersData,this.RMPieTotalPriceData,this.RMPieOrderData)
                    this.keyDataPie2()
                }else{
                    this.selectCompareCityData = this.beforeCityKey
                    this.$message({
                        type:'warning',
                        message:'城市不能为空'
                    })
                }
            },
            compareCityFun(BData, SData, RData) {
                // console.log(BData, SData, '判断增加了哪个城市', RData)
                for (let Skey of SData) {
                    for (let j = 0; j < BData.length; j++) {
                        if (Skey === BData[j]) {
                            break
                        }
                        if (j >= BData.length - 1) {
                            // console.log('11111111111',Skey)
                            for (let Rkey of RData) {
                                if (Rkey.name === Skey) {
                                    // console.log(Skey,'222222222222',Rkey)
                                    return Rkey
                                }
                            }
                        }
                    }
                }
                return false
            },
            // 城市对比上刊率 - 日期选择 cityKeyDataDate
            cityRateChangeTime(String,index){
                let starT = ''
                let endT = ''
                if(String === 'cityBattle'){
                    // console.log('城市数据对比 - 日期选择', this.secCard2time)
                    let compareLen = this.isMonthLength(this.secCard2time)
                    if (compareLen > 5) {
                        // this.secCard2time = this.beforeSecCard2time.concat()
                        if(index === '0'){
                            starT =  this.secCard2time[0]
                            endT = this.GetSpecifiedDateStr(this.secCard2time[0],-5).substring(0,7)
                        }else if(index === '1'){
                            starT = this.GetSpecifiedDateStr(this.secCard2time[1],5).substring(0,7)
                            endT = this.secCard2time[1]
                        }
                        this.secCard2time = [starT,endT]
                        // console.log(starT,endT,'校验完后的时间',this.secCard2time)
                        this.$message({
                            type: 'warning',
                            message: '月份跨度不能大于六个月'
                        })
                    }
                    this.cityBattleTime = '其它'
                    this.forCityData(this.cityBattleTitle)
                }else if(String === 'cityRate'){
                    // console.log('城市对比上刊率 - 日期选择',this.cityRateCompareDate)
                    let compareLen = this.isMonthLength(this.cityRateCompareDate)
                    if(compareLen > 5){
                        starT =  this.cityRateCompareDate[0]
                        endT = this.GetSpecifiedDateStr(this.cityRateCompareDate[0],-5)
                        this.cityRateCompareDate = [starT,endT]
                        this.$message({
                            type:'warning',
                            message:'时间跨度不能大于六个月'
                        })
                    }
                    // console.log(starT,endT,'校验完后的时间',this.cityRateCompareDate)
                    this.cityRateCompareTime = '其它'
                    this.GetCompareCityRate()
                }else if(String === 'cityKey'){
                    // console.log('城市关键数据对比 - 日期选择',this.cityKeyDataDate)
                    let compareLen = this.isMonthLength(this.cityKeyDataDate)
                    if(compareLen > 5){
                        starT =  this.cityKeyDataDate[0]
                        endT = this.GetSpecifiedDateStr(this.cityKeyDataDate[0],-5)
                        this.cityKeyDataDate = [starT,endT]
                        this.$message({
                            type:'warning',
                            message:'时间跨度不能大于六个月'
                        })
                    }
                    this.cityKeyDataTime = '其它'
                    this.forCityKeyData('enty')
                    this.getCityKeyData_resMediaAds()
                }
            },
            // 选择行业
            chooseBusiness(index) {
                this.currBusiness = this.businessArr[index];
            },
            // 点位分析
            //点位使用概况
            GetUserAdsInfo(val){
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    onStart: this.pointDate[0],
                    onEnd: this.pointDate[1],
                    dateType: 'day',
                    asrIDs: this.returnAsrID(), //this.currCity,
                }
                if(val === 'day'){
                    params.dateType = 'day'
                }else if(val === 'month'){
                    params.dateType = 'month'
                }
                api.getApi(this.Count + '/GetSpotUsedInfo', params).then(res => {
                    console.log('参数', params, '点位使用概况', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()
                    } else {
                        let adsData = res.data
                        this.adsUserData = {
                            totalAdSpaceInfoCount: adsData.totalAdSpaceInfoCount || 0,
                            planToOrderConversionRate: adsData.planToOrderConversionRate !== undefined ? (adsData.planToOrderConversionRate * 100).toFixed(2) : 0,
                            planCount: adsData.planCount || 0,
                            orderCount: adsData.orderCount || 0,
                            orderUnitPrice: (adsData.orderUnitPrice / 100) || 0,
                            publicationRateOfA: adsData.publicationRateOfA !== undefined ? (adsData.publicationRateOfA * 100).toFixed(2) : 0,
                            publicationRateOfB:  adsData.publicationRateOfB !== undefined ? (adsData.publicationRateOfB * 100).toFixed(2) : 0,
                            orderSpotCount: adsData.orderSpotCount || 0,
                            planSpotCount: adsData.planSpotCount || 0,
                            allToPlanConversionRate: adsData.allToPlanConversionRate !== undefined ? (adsData.allToPlanConversionRate * 100).toFixed(2) : 0,
                            allToOrderConversionRate: adsData.allToOrderConversionRate !== undefined ? (adsData.allToOrderConversionRate * 100).toFixed(2) : 0,
                        }
                        console.log('点位使用概况', this.adsUserData)
                        this.pointDataLoading = false          // 点位使用概况loading
                    }
                }).catch(err=>{
                   console.log('点位使用概况error')
                })
            },
            // 点位使用概况 - 自然天/自然月 选择
            adsSelectDate(){
                // console.log('pointSelect',this.pointSelect)
                if(this.pointSelect === '自然月'){
                    this.pointDate_day = this.pointDate.concat()
                    let TStart = this.pointDate[0].substring(0,7)
                    let TEnd = this.pointDate[1].substring(0,7)
                    this.pointDate = [TStart,TEnd]
                    this.GetUserAdsInfo('month')
                }else if(this.pointSelect === '自然天'){
                    this.pointDate = this.pointDate_day.concat()
                    this.GetUserAdsInfo('day')
                }
                // console.log('点位使用概况 - 自然天/自然月 选择',this.pointDate)
            },
            // 点位使用概况 - 日期选择
            adsChangeDate(){
                // console.log('点位使用概况 - 日期选择',this.pointDate)
                if(this.pointSelect === '自然月'){
                    if((this.pointDate[0] !== null && this.pointDate[0] !== undefined)
                        &&(this.pointDate[1] !== null && this.pointDate[1] !== undefined)){
                        this.GetUserAdsInfo('month')
                    }
                }else if(this.pointSelect === '自然天'){
                    this.GetUserAdsInfo('day')
                }
            },
            // 社区社区列表 - 接口 this.setPageNoAndTableDataRes()
            getResRateFun(){
                console.log('resPageNum',this.resPageNum)
                let params = {
                    uid:this.session_userData.uID,
                    token: this.session_userData.token,
                    onStart: this.resSearchDate[0],
                    onEnd: this.resSearchDate[1],
                    createStar: this.resCreatDate[0],
                    createEnd: this.resCreatDate[1],
                    wd: this.resInputVal,
                    asrIDs: this.returnAsrID(), //this.currCity,
                    maxPercent: this.pUpMax,
                    minPercent: this.pUpMin,
                    pageSize: this.resPageSize,
                    pageNum: this.resPageNum
                }
                for(let i in params){
                    if(params[i] === '' || params[i] === undefined){
                        delete params[i]
                    }
                }
                api.postApi(this.Count + '/GetResPublicationRate',params).then(res=> {
                    console.log('社区社区列表-接口', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()
                    }else{
                        if(res.data.list.length > 0){
                            console.log('res.data.list',res.data.list)
                            this.resTotalPage = res.data.totalPage
                            this.resPageNum++
                            this.setResTableData(res.data.list)
                            this.loading_res = true
                        }else{
                            this.$message.warning('社区社区列表,在该时段暂无数据！');
                        }
                        this.resLoading = false
                    }
                })
            },
            setResTableData(Arr){
                for(let key of Arr){
                    this.resRateList.push({
                        city: key.prName,
                        area: key.rName,
                        resName: key.resName,
                        upPercent: (key.publicationRate* 100).toFixed(2),
                        price: key.publicationPrice / 100
                    })
                }
                console.log('resRateList',this.resRateList)
            },
            // 点位社区列表 - 接口
            getAdsRateFun(){
                console.log('点位总页数',this.adsTotalPage,'当前页数',this.adsPageNum)
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    onStart: this.adsSearchDate[0],
                    onEnd: this.adsSearchDate[1],
                    createStar: this.adsCreatDate[0],
                    createEnd: this.adsCreatDate[1],
                    wd: this.adsInputVal,
                    asrIDs: this.returnAsrID(), //this.currCity,
                    maxPercent: this.cUpMax,
                    minPercent: this.cUpMin,
                    pageSize: this.adsPageSize,
                    pageNum: this.adsPageNum,
                }
                for(let i in params){
                    if(params[i] === '' || params[i] === undefined){
                        delete params[i]
                    }
                }
                api.postApi(this.Count + '/GetSpotPublicationRate',params).then(res=>{
                    console.log('点位社区列表 - 接口',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()
                    }else {
                        if(res.data.list.length > 0){
                            this.adsTotalPage = res.data.totalPage
                            this.adsPageNum++
                            this.setAdsTableData(res.data.list)
                            this.loading_ads = true
                        }else{
                            this.$message.warning('点位社区列表,在该时段暂无数据！');
                        }
                        this.adsLoading = false
                    }
                })
            },
            // 设置点位上刊率表格数据
            setAdsTableData(AData){
                for(let key of AData){
                    this.adsRateList.push({
                        city: key.prName,
                        area: key.rName,
                        resName: key.resName,
                        upPercent: (key.publicationRate * 100).toFixed(2),
                        price: key.publicationPrice/100,
                        createTime: timeFormat.toDate(key.mJoinTime,'/'),
                        adDoorName: key.mTitle,
                        adNo: key.asLab,
                    })
                }
                console.log('adsRateList',this.adsRateList)
            },
            // 点位分析 - 功能方法
            // 城市切换过滤
            filterRateDataByCity(){
                this.setPageNoAndTableDataRes()
                this.loading_res = false
                this.getResRateFun()
                this.loading_ads = false
                this.setPageNoAndTableDataAds()
                this.getAdsRateFun()
            },
            // 创建社区时间 - changes
            CreatDateChange(val1,val2){
                console.log('----------------',val1)
                if(val1 === 'res'){
                    if(!this.resCreatDate){
                        this.resCreatDate = []
                    }
                    this.pUpMin = ''
                    this.pUpMax = ''
                    this.setPageNoAndTableDataRes()
                    this.getResRateFun()
                }else if(val1 === 'ads'){
                    if(!this.adsCreatDate){
                        this.adsCreatDate = []
                    }
                    this.cUpMin = '';
                    this.cUpMax = '';
                    this.setPageNoAndTableDataAds()
                    this.getAdsRateFun()
                }
            },
            // 滚动加载
            // 社区社区上刊率 - 滚动监听
            resLoadMore(){
                if(this.loading_res){
                    this.loading_res = false
                    if(this.resTotalPage >= this.resPageNum){
                        this.resLoading = true
                        this.getResRateFun()
                    }else{
                        console.log('已无数据')
                    }
                }else{
                    // console.log('else资源发生了滚动')
                }
            },
            // 点位上刊率 - 滚动监听
            adsLoadMore(){
                if(this.loading_ads){
                    this.loading_ads = false
                    if(this.adsTotalPage >= this.adsPageNum){
                        this.adsLoading = true
                        this.getAdsRateFun()
                    }else{
                        console.log('点位已无数据')
                    }
                }else{
                    console.log('点位else')
                }
            },
            // 点位分析-搜索
            searchFun(val){
                console.log('点位分析-搜索',val,this.adsInputVal)
                if(val === 'res'){
                    if(this.resSelectVal === '社区名称') {
                        if (this.resInputVal === '') {
                            this.$message({
                                type: 'warning',
                                message: '搜索内容为空',
                            })
                        } else {
                            this.setPageNoAndTableDataRes()
                            this.getResRateFun()
                        }
                    }
                }else if(val === 'ads'){
                    if(this.adsSelectVal === '社区名称'){
                        if(this.adsInputVal === ''){
                            this.$message({
                                type: 'warning',
                                message: '搜索内容为空',
                            })
                        }else{
                            this.setPageNoAndTableDataAds()
                            this.getAdsRateFun()
                        }
                    }
                }
            },
            // 点位分析-搜索框置空
            initData(val){
                // console.log('搜索框变化的值',val)
                if(val === 'res'){
                    if (!this.resInputVal){
                        this.setPageNoAndTableDataRes()
                        this.getResRateFun()
                    }
                }  else if(val === 'ads'){
                    if (!this.adsInputVal){
                        this.setPageNoAndTableDataAds()
                        this.getAdsRateFun()
                    }
                }
            },
            //点位上刊率
            adsBlur(){
                if(this.cUpMin === '' && this.cUpMax === ''){
                    this.cinputFocus = false
                    this.setPageNoAndTableDataAds()
                    this.getAdsRateFun()
                }else{
                    console.log('点位不隐藏')
                }
            },
            //点位，清除
            cClear() {
                // console.log('点位上刊率过滤清除清除')
                this.cUpMin = '';
                this.cUpMax = '';
                this.setPageNoAndTableDataAds()
                this.getAdsRateFun()
            },
            //点位，上刊率确定
            cConfirm() {
                // alert('12312')
                if(this.cUpMin !== '' && this.cUpMax !== ''){
                    if(this.cUpMin >= this.cUpMax){
                        this.$message({
                            type:'warning',
                            message: '请填写正确的区间'
                        })
                    }else{
                        this.setPageNoAndTableDataAds()
                        this.getAdsRateFun()
                        this.cinputFocus = false
                    }
                }
            },
            // 社区上刊率
            resBlur(){
                // console.log('失去焦点')
                if(this.pUpMin === '' && this.pUpMax === ''){
                    this.cinputFocus = false
                    this.setPageNoAndTableDataAds()
                    this.getAdsRateFun()
                }else{
                    console.log('不隐藏')
                }
            },
            // 社区 - 清除
            pClear() {
                // console.log('资源社区上刊率过滤清除')
                this.pUpMin = ''
                this.pUpMax = ''
                this.setPageNoAndTableDataRes()
                this.getResRateFun()
            },
            //社区 - 确定
            pConfirm() {
                // console.log('社区上刊率')
                if(this.pUpMin !== '' && this.pUpMax !== ''){
                    if(this.pUpMin >= this.pUpMax){
                        this.$message({
                            type:'warning',
                            message: '请填写正确的区间'
                        })
                    }else{
                        this.setPageNoAndTableDataRes()
                        this.getResRateFun()
                        console.log('区间',this.pUpMin,'-',this.pUpMax)
                        this.cinputFocus = false
                    }
                }
            },
            // 资源社区上刊率部分数据初始化
            setPageNoAndTableDataRes(){
                this.loading_res = false
                this.resLoading = true
                this.resRateList = []
                this.resPageNum = 1
            },
            // 点位上刊率部分数据初始化
            setPageNoAndTableDataAds(){
                this.loading_ads = false
                this.adsLoading = true
                this.adsRateList = []
                this.adsPageNum = 1
            },
            // 资源社区表格导出
            exportExcel_res(){
                this.$message.warning('导出excel可能需要一分钟甚至更长时间')
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    onStart: this.resSearchDate[0],
                    onEnd: this.resSearchDate[1],
                    asrIDs: this.returnAsrID(),// this.currCity,
                    wd: this.resInputVal,
                    maxPercent: this.pUpMax,
                    minPercent: this.pUpMin,
                }
                for(let i in params){
                    if(params[i] === '' || params[i] === undefined){
                        delete params[i]
                    }
                }
                api.getApi_file(this.Count + '/ExportResPublicationRate'
                    , params).then(res=>{
                    console.log('社区上刊率导出',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()
                    } else {
                        // console.log('社区上刊率导出',res.headers);
                        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
                        let downloadElement = document.createElement('a');
                        let href = window.URL.createObjectURL(blob); //创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = res.headers['content-disposition'].split('=')[1]; //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载
                        document.body.removeChild(downloadElement); //下载完成移除元素
                        window.URL.revokeObjectURL(href); //释放掉blob对象
                    }
                })
            },
            // 点位表格导出
            exportExcel_ads(){
                let params = {
                    uid: this.session_userData.uID,
                    token: this.session_userData.token,
                    onStart: this.adsSearchDate[0],
                    onEnd: this.adsSearchDate[1],
                    asrIDs: this.returnAsrID(),//this.currCity,
                    wd: this.adsInputVal,
                    maxPercent: this.cUpMax,
                    minPercent: this.cUpMin,
                }
                for(let i in params){
                    if(params[i] === '' || params[i] === undefined){
                        delete params[i]
                    }
                }
                api.getApi_file(this.Count + '/ExportSpotPublicationRate',params).then(res=>{
                    console.log('点位上刊率导出',res.headers)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()
                    } else{
                        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
                        let downloadElement = document.createElement('a');
                        let href = window.URL.createObjectURL(blob); //创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = res.headers['content-disposition'].split('=')[1]; //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载
                        document.body.removeChild(downloadElement); //下载完成移除元素
                        window.URL.revokeObjectURL(href); //释放掉blob对象
                    }
                })
            },
            formatJson(filterVal, jsonData) {
                // return jsonData.map(v => filterVal.map(j => (j=='price')?(v[j]/100):v[j]))
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            //表格筛选
            filterAdNo(value, row) {
                return row.adNo === value
            },
            filterArea(value, row) {
                return row.area === value
            },
            //表格排序
            sortUpPercent(a, b) {
                return b.upPercent - a.upPercent
            },
            //
            sortResPrice(a, b){
                return b.price - a.price
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
            // 时间字符切割
            splitTimeString(time) {
                return time.split("-").join("");
            },
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
            // 获取指定时间并计算N月前/后的日期
            GetSpecifiedDateStr(specifiedDate,AddMonthCount) {
                let dd = new Date(specifiedDate);
                dd.setMonth(dd.getMonth() - AddMonthCount);
                let Y = dd.getFullYear();
                let M = (dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1)
                let D = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()
                return Y + '-' + M + '-' + D
            },
            // 根据权限公司返回 asrIDs
            returnAsrID(){
                if (this.currCity == '0'){
                    return '1,2,3,4,5,6,7'
                }else{
                    return this.currCity
                }
            },
            // 根据asrrID返回城市名
            returnAsName(asrIDs){
                for(let key of this.citys){
                    if(key.value == asrIDs){
                        return key.label
                    }
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
            // 登录超时
            loginTimeout() {
                this.AnalysisLoading.close()
                this.$message({
                    message: '登录超时或权限异常,请重新登录',
                    type: 'warning'
                })
                this.$router.push('/login')
            },
        }
    }
</script>

<style scoped>
    /*字体*/
    @font-face {
        font-family: DINPro-Medium;
        src: url("fonts/DINPro-Medium.otf"), url("fonts/DINPro-Medium.ttf");
    }

    @font-face {
        font-family: DINPro-Regular;
        src: url("fonts/DINPro-Regular.otf");
    }

    .wrap {
        padding: 0 60px;
    }

    .popover_span{
        color: #999;
        font-size: 12px;
    }

    .tips {
        position: absolute;
        right: 70px;
        top: 70px;
        z-index: 9;
    }

    .tips span {
        font-size: 12px;
        color: #999999;
        margin-left: 18px;
    }

    .card {
        margin-bottom: 20px;
    }

    /*数据总览*/
    .data-txt {
        display: flex;
        justify-content: space-around;
        border-bottom: 1px solid #F0F0F0;
        padding-bottom: 23px;
    }

    .data-txt div {
        text-align: right;
        font-size: 14px;
        color: #616161;
        padding-right: 14px;
    }

    .data-txt div p {
        margin-top: 16px;
        font-size: 20px;
        color: #2C313C;
        font-weight: bold;
        font-family: "DINPro-Regular", "PingFangSC-Regular", "Microsoft YaHei";
        border-right: 1px solid #F0F0F0;
        padding-right: 14px;
        margin-right: -14px;
    }

    /*饼状图*/
    .charts {
        width: 200px;
        height: 200px;
    }

    .data-charts {
        display: flex;
        justify-content: space-around;
        /*margin-bottom: 40px;*/
    }

    .pie-wrap {
        position: relative;
    }

    .pie-wrap p {
        font-weight: bold;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-size: 16px;
        color: #333333;
    }

    .all-data-charts .pie-wrap p:nth-of-type(1) {
        left: 15%;
    }

    .all-data-charts .pie-wrap p:nth-of-type(2) {
        left: 38%;
    }

    .all-data-charts .pie-wrap p:nth-of-type(3) {
        left: 62%;
    }

    .all-data-charts .pie-wrap p:nth-of-type(4) {
        left: 85%;
    }

    .noAllcity .pie-wrap p:nth-of-type(1){
        left: 20%;
    }
    .noAllcity .pie-wrap p:nth-of-type(2) {
        left: 50%;
    }

    .noAllcity .pie-wrap p:nth-of-type(3) {
        left: 80%;
    }

    .data-wrap, .data-charts {
        position: relative;
    }

    .data-charts .all-data-charts-city{
        position: absolute;
        left: 10px;
        top: 15px;
    }

    /deep/ .all-data-charts-city .el-select.el-select--mini{
        width: 98px;
    }

    .data-charts .more {
        position: absolute;
        right: 10px;
        top: 15px;
        font-size: 12px;
        color: #4AA6FC;
        cursor: pointer;
    }

    /*  .bottom-data {
          position: absolute;
          bottom: -30px;
          left: 23%;
      }

      .bottom-data ul li {
          float: left;
          margin-right: 24px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
      }

      .bottom-data ul li .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
      }*/

    /*关键数据展示*/
    .data-tab {
        font-size: 12px;
        color: #808080;
        margin-bottom: 10px;
        height: 30px;
    }

    .data-title {
        width: 79%;
        margin-left: 19%;
        display: flex;
        font-size: 14px;
        color: #616161;
        margin-bottom: 17px;
        box-sizing: border-box;
        justify-content: space-between;
        margin-top: 30px;

    }

    .data-title div {
        text-align: right;
    }

    .month-data {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #616161;
        border-bottom: 1px solid #F0F0F0;
        padding-bottom: 23px;
        margin-bottom: 20px;
    }

    .month-data ol, .month-data ul {
        border-right: 1px solid #F0F0F0;
        padding-right: 25px;
    }

    .month-data ol li {
        padding-left: 36px;
        margin-top: 10px;
    }

    .month-data ul li {
        margin-top: 10px;
        text-align: right;
    }

    .month-data ul li i {
        font-family: "DINPro-Medium", "PingFangSC-Regular", "Microsoft YaHei";
        font-style: normal;
        font-size: 13px;
        position: relative;
        top: -2px;
        right: 2px;
    }

    i.up {
        color: #DE1010;
    }

    i.down {
        color: #17B726;
    }

    /*关键数据总量趋势*/
    .data-tab span {
        float: left;
    }

    .data-tab span:first-child {
        position: relative;
        top: 5px;
    }

    .block {
        display: inline-block;
    }

    .card6 {
        position: relative;
    }

    .card6 .title {
        position: absolute;
        z-index: 2;
        top: 49%;
        left: 10%;
        width: 200px;
        height: 70px;
        box-sizing: border-box;
        /*width: 100%;*/
    }

    .card6 .title p {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        text-align: center;
    }

    .card6 .title h3 {
        font-size: 18px;
        color: rgba(0, 0, 0, 0.85);
        text-align: center;
        font-family: "DINPro-Regular", "PingFangSC-Regular", "Microsoft YaHei";
    }

    .card6 .wrap-box {
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    .allOrderChart {
        width: 47%;
    }

    .table-wrap {
        width: 100%;
        /*border: 1px solid #dedede;*/
        margin-bottom: 30px;
    }
    .table-wrap .el-table{
        width: 100%;
    }

    .all {
        position: absolute;
        right: 15px;
        top: 20px;
        font-size: 12px;
        color: #4AA6FC;
        cursor: pointer;
    }

    /*城市对比*/
    .cityData-wrap {
        width: 100%;
        display: flex;
    }

    .chinaMapChart {
        width: 50%;
    }

    .all-data-table {
        width: 50%;
    }

    /*城市关键数据对比*/
    .cityKeyData-charts {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .cityKeyData-charts .pie-wrap p:nth-of-type(1) {
        left: 20%;
        top: 25%;
    }

    .cityKeyData-charts .pie-wrap p:nth-of-type(2) {
        left: 50%;
        top: 25%;
    }

    .cityKeyData-charts .pie-wrap p:nth-of-type(3) {
        left: 80%;
        top: 25%;
    }

    .cityKeyData-charts .pie-wrap p:nth-of-type(4) {
        left: 20%;
        top: 80%;
    }

    .cityKeyData-charts .pie-wrap p:nth-of-type(5) {
        left: 50%;
        top: 80%;
    }

    .cityKeyData-charts .pie-wrap p:nth-of-type(6) {
        left: 80%;
        top: 80%;
    }

    /*点位分析*/
    .thr-tabs {
        width: 100%;
        background-color: #ffffff;
    }

    /*点位使用概况*/
    .header-select {
        position: absolute;
        right: 0;
        top: 0;
    }

    .pointData-wrap {
        display: flex;
        justify-content: space-between;
    }

    .left-data {
        width: 75%;
    }

    .left-data > div {
        width: 100%;
        height: 75px;
        padding-top: 17px;
        box-sizing: border-box;
        border-bottom: 1px solid #F0F0F0;
    }

    .left-data > div:last-child {
        border-bottom: none;
    }

    .left-data dl {
        float: left;
        /*margin-right: 64px;*/
        text-align: left;
        width: 118px;
    }

    .left-data dl dt {
        /*float: left;*/
        display: block;
        font-size: 12px;
        color: #666666;
    }

    .left-data dl dd {
        font-size: 20px;
        color: #2C313C;
        font-family: DINPro-Regular, PingFangSC-Regular, Microsoft YaHei;
    }

    .right-chart {
        margin-right: 45px;
        position: relative;
    }

    .right-chart img {
        width: 299px;
    }

    .translate-txt {
        width: 120%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .translate-txt div {
        position: absolute;
        font-size: 12px;
        color: #666666;
    }

    .translate1 {
        top: 24%;
        left: 52%;
    }

    .translate2 {
        top: 66%;
        left: 46%;
    }

    .translate3 {
        top: 45%;
        left: 65%;
    }

    .select-wrap {
        height: 34px;
        margin-bottom: 16px;
    }

    .select-wrap span {
        float: left;
    }

    /*社区上刊率和点位上刊率*/
    .community-percent, .point-percent {
        padding: 16px;
        margin-bottom: 40px;
        /*height: 300px;*/
    }

    .s-input {
        position: relative;
        left: -1px;
    }

    .select-wrap button {
        width: 76px;
        height: 34px;
    }

    .upPercent-wrap {
        display: flex;
        justify-content: space-around;
        position: relative;
    }

    .input-wrap {
        display: flex;
        justify-content: space-around;
        position: relative;
        z-index: 9;
    }

    .upPercent-wrap-mask {
        width: 105%;
        height: 70px;
        top: -3px;
        left: -5px;
        position: absolute;
        border: 1px solid #C2C2C2;
        border-radius: 4px;
        z-index: 8;
        background: #fff;
    }

    .upPercent-wrap-mask button {
        width: 44px;
        height: 24px;
        position: absolute;
        bottom: 5px;
        left: 10px;
    }

    .upPercent-wrap-mask button:last-child {
        left: 60%;
        bottom: 0;
    }

    .upPercent-wrap-mask button:last-child span {
        position: relative;
        top: 0px;
        left: -5px;
        font-size: 14px;
        color: #2C313C;
    }

    .table-wrap2 {
        width: 100%;
        border: none;
    }
    /*超出省略 all-city-data-table-12*/
    /deep/ .el-table .cell{
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    /*1440*/
    @media all and (min-width: 1420px) {
        .card6 .title {
            left: 9.5%;

            /*width: 100%;*/
        }
    }

    /*1920*/
    @media all and (min-width: 1900px) {
        .charts2 {
            width: 1700px !important;
        }

        .charts1 {
            width: 850px !important;
        }

        .data-title {
            width: 81%;
            margin-left: 18%;
        }

        .bottom-data {
            left: 30%;
        }

        .card6 .title {
            left: 11.5%;
        }

        .cityKeyData-charts .charts {
            width: 1700px !important;
        }

        .left-data dl {
            float: left;
            text-align: left;
            width: 218px;
        }
    }
</style>

<style>
    .tips .el-select.el-select--mini{
        width: 139px;
    }
    .tips .el-input__inner{
        background: rgba(0,0,0,0);
        color: #999;
        border: none;
        text-align: center;
    }

    .wrap .el-tabs__nav-wrap {
        width: 100%;
    }

    .wrap .el-tabs__item {
        font-size: 16px;
        color: #999999;
    }

    .wrap .el-tabs__item.is-active {
        color: #108EE9;
    }

    .wrap .el-dropdown {
        cursor: pointer;
    }

    .data-analysis .el-card__header span:nth-child(1) {
        font-size: 16px;
        color: #2C313C;
        font-weight: bold;
    }

    .card3 .el-range-editor--mini.el-input__inner {
        width: 338px;
    }

    /*关键数据增量对比*/
    .card4 .el-range-editor--mini.el-input__inner {
        width: 220px;
    }

    .data-analysis .el-checkbox__input.is-checked + .el-checkbox__label {
        /*font-size: 12px;*/
        /*padding-left: 5px;*/
    }

    .data-analysis .el-button-group .el-button:first-child {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }

    .data-analysis .el-button-group button {
        float: left;
    }

    .data-analysis .el-button-group .el-button:last-child {
        line-height: 10px;
        position: relative;
        top: -1px;
    }

    .card5 .el-range-editor--mini.el-input__inner {
        width: 292px;
    }

    .timeSelect .el-dropdown-menu--mini .el-dropdown-menu__item {
        padding: 0 20px;
    }

    /*行业订单占比*/
    .spe1 .el-input__inner {
        width: 86px;
    }

    thead th {
        font-size: 14px;
        color: #2C313C;
        font-weight: bold;
        background: #F7F7F7;
        text-align: center;
    }

    .data-analysis .el-table__row {
        font-size: 14px;
        color: #2C313C;
        text-align: center;
    }

    .card7 .el-range-editor--mini.el-input__inner,
    .card8 .el-range-editor--mini.el-input__inner,
    .card9 .el-range-editor--mini.el-input__inner {
        width: 230px;
    }

    .data-analysis .el-card__header {
        position: relative;
    }

    .data-analysis .el-dialog__body {
        padding: 20px 20px;
    }

    /*滚动条*/
    .all-data-table .el-table__body-wrapper {
        overflow-y: hidden;
        overflow-x: scroll;
    }

    .all-data-table .el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background: #fafafa;
    }

    .el-table__body-wrapper {
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .data-analysis .el-table__body-wrapper::-webkit-scrollbar {
        width: 4px;
        background: #fafafa;
    }

    .el-table__body-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    }

    .data-analysis .el-table__fixed-right::before, .el-table__fixed::before {
        height: 0px;
    }

    .sec-card2-eldata .el-range-editor--mini.el-input__inner {
        width: 337px;
    }

    /*城市数据对比*/
    .data-analysis .el-select-group {
        display: flex;
        width: 466px;
        flex-wrap: wrap;
        padding-left: 33px;
        box-sizing: border-box;
    }

    .data-analysis .el-select-dropdown__item.selected::after {
        display: none;
    }

    .data-analysis .el-select-dropdown__item {
        padding: 0 10px;
    }

    .data-analysis .el-select-group__wrap:not(:last-of-type) {
        padding-bottom: 15px;
    }

    .cityDX .el-input--mini .el-input__inner {
        width: 507px;
    }

    .header-select .el-input__inner {
        width: 90px;
    }

    .header-select .el-range-editor--mini.el-input__inner {
        width: 225px !important;
    }
    .header-select .block.block_month .el-input__inner {
        width: 110px;
    }
    .data-analysis .block_month .el-date-editor.el-input{
        width: 110px;
    }
    .data-analysis .el-card__body {
        padding: 20px 40px;
    }

    .select-wrap .el-select .el-input__inner {
        width: 105px !important;
        height: 34px;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
    }

    .select-wrap .el-input .el-input__inner {
        width: 224px;
        height: 34px;
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }

    .select-wrap button .el-icon-search {
        position: relative;
        left: -10px;
        top: -3px;
    }

    .el-button [class*=el-icon-] + span {
        position: relative;
        left: -10px;
        top: -3px;
    }

    .select-wrap .el-button span {
        position: relative;
        top: -2px;
    }

    .select2 .el-range-editor--mini.el-input__inner {
        width: 220px;
    }

    .upPercent-wrap .el-input .el-input__inner {
        width: 66px;
        height: 26px;
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .CUP-table .el-table__row td:nth-of-type(8),
    .CUP-table .el-table__row td:nth-of-type(9),
    .CUP-table .has-gutter th:nth-of-type(8),
    .CUP-table .has-gutter th:nth-of-type(9) {
        text-align: right;
        padding-right: 10px;
    }

    .PUP-table .el-table__row td:nth-of-type(6),
    .PUP-table .el-table__row td:nth-of-type(7),
    .PUP-table .has-gutter th:nth-of-type(6),
    .PUP-table .has-gutter th:nth-of-type(7) {
        text-align: right;
        padding-right: 10px;
    }

    /*行业订单占比表格 IOrderTable*/
    /*.IOrder-table .has-gutter th:nth-of-type(3),*/
    .IOrder-table .has-gutter th:nth-of-type(4),
    .IOrder-table .has-gutter th:nth-of-type(5),
        /*.IOrder-table .el-table__row td:nth-of-type(3),*/
    .IOrder-table .el-table__row td:nth-of-type(4),
    .IOrder-table .el-table__row td:nth-of-type(5){
        text-align: right;
        padding-right: 10px;
    }

    .cityBattle-table .el-table__row td:nth-of-type(3),
    .cityBattle-table .el-table__row td:nth-of-type(4),
    .cityBattle-table .el-table__row td:nth-of-type(5),
    .cityBattle-table .el-table__row td:nth-of-type(6),
    .cityBattle-table .el-table__row td:nth-of-type(7),
    .cityBattle-table .el-table__row td:nth-of-type(8),
    .cityBattle-table .el-table__row td:nth-of-type(9) {
        text-align: right;
        padding-right: 10px;
    }

    .cityBattle-table .has-gutter th:nth-of-type(6),
    .cityBattle-table .has-gutter th:nth-of-type(7),
    .cityBattle-table .has-gutter th:nth-of-type(3),
    .cityBattle-table .has-gutter th:nth-of-type(4),
    .cityBattle-table .has-gutter th:nth-of-type(5),
    .cityBattle-table .has-gutter th:nth-of-type(8),
    .cityBattle-table .has-gutter th:nth-of-type(9) {
        text-align: right;
    }

    /*城市数据总览表格*/
    .all-city-data-table .has-gutter th:nth-of-type(2),
    .all-city-data-table .has-gutter th:nth-of-type(3),
    .all-city-data-table .has-gutter th:nth-of-type(4),
    .all-city-data-table .has-gutter th:nth-of-type(5),
    .all-city-data-table .el-table__row td:nth-of-type(2),
    .all-city-data-table .el-table__row td:nth-of-type(3),
    .all-city-data-table .el-table__row td:nth-of-type(4),
    .all-city-data-table .el-table__row td:nth-of-type(5) {
        text-align: right;
        padding-right: 10px;
    }

    /*入驻物业总排行表格*/

    .into-property-rank .has-gutter th:nth-of-type(3),
    .into-property-rank .has-gutter th:nth-of-type(4),
    .into-property-rank .el-table__row td:nth-of-type(3),
    .into-property-rank .el-table__row td:nth-of-type(4) {
        text-align: right;
        padding-right: 10px;
    }

    /*广告主总排行表格*/
    .ad-owner-rank-table .has-gutter th:nth-of-type(3),
    .ad-owner-rank-table .has-gutter th:nth-of-type(4),
    .ad-owner-rank-table .el-table__row td:nth-of-type(4),
    .ad-owner-rank-table .el-table__row td:nth-of-type(3) {
        text-align: right;
        padding-right: 10px;
    }

    /*销售业绩总排行表格*/
    .sales-rank-table .has-gutter th:nth-of-type(3),
    .sales-rank-table .has-gutter th:nth-of-type(4),
    .sales-rank-table .el-table__row td:nth-of-type(3),
    .sales-rank-table .el-table__row td:nth-of-type(4) {
        text-align: right;
        padding-right: 10px;
    }

    .upPercent-wrap-mask .el-button.confirm span {
        left: -11px;
        top: -6px;
    }

    .CUP-table .el-table__row td {
        text-align: left;
    }

    .data-analysis .el-table__row td {
        text-align: left;
    }

    .data-analysis .el-table th {
        background-color: #f7f7f7;
    }

    .data-analysis .Bradio .el-checkbox-button:last-child .el-checkbox-button__inner {
        border-radius: 0 0 0 0;
    }

    .data-analysis .el-select-group .el-select-dropdown__item {
        padding-left: 10px;
    }

    .data-analysis .el-select-dropdown__list .el-select-group__wrap:nth-of-type(1) .el-select-group {
        display: none;
    }

    .data-analysis .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 150px;
    }
    .Bradio .el-input--small .el-input__inner{
        width: 460px;
    }
    .all-data-table .el-table__fixed-right:before, .all-data-table .el-table__fixed:before{
        background-color:#fff;
    }
    /*强制兼容safari表头错位bug*/
    .el-table__fixed-header-wrapper thead tr th.el-table_5_column_31{
        width: 140px;
    }
    .el-table__fixed-header-wrapper thead tr th.el-table_5_column_32{
        width: 90px;
    }
    .el-table__fixed-header-wrapper thead tr th.el-table_5_column_33{
        width: 120px;
    }
    .el-table__fixed-header-wrapper thead tr th.el-table_5_column_34{
        width: 90px;
    }

    /*.el-table .el-table__header-wrapper thead.has-gutter tr th.el-table_5_column_31{*/
        /*width: 140px;*/
    /*}*/
    .el-table .el-table__header-wrapper thead.has-gutter tr th.el-table_5_column_31 .cell{
        width: 140px;
    }

    /*.el-table .el-table__body-wrapper .el-table__body tbody tr.el-table__row td.el-table_5_column_31{*/
        /*width: 140px;*/
    /*}*/
    .el-table .el-table__body-wrapper .el-table__body tbody tr.el-table__row td.el-table_5_column_31 .cell{
        width: 140px;
        margin: 0;
    }
    /*1920*/
    @media all and (min-width: 1920px) {
        /*滚动条*/
        .all-data-table .el-table__body-wrapper {
            overflow-y: hidden;
            overflow-x: scroll;
        }
    }
</style>

