<template>
  <div>
    <div class="ad_index_container">
        <!-- <home-top :user-info="userInfo" :data-arr="dataArr" :honor-img="companyHonor"></home-top> -->
        <div class="index-top-row">
            <div class="left-layout">
                <personal-info :cityRank='cityRank' :user-info="userInfo" :honor-img="companyHonor" :linkArr="linkArrNew"></personal-info>
                <div class="card-group">
                    <el-row :gutter="24" style="margin-bottom: 24px;">
                        <el-col :span="8"><chart-card :cardData="cardData1"></chart-card></el-col>
                        <el-col :span="8"><chart-card :cardData="cardData2"></chart-card></el-col>
                        <el-col :span="8"><chart-card :cardData="cardData3"></chart-card></el-col>
                    </el-row>
                    <el-row :gutter="24">
                        <el-col :span="8"><chart-card :cardData="cardDataOther1"></chart-card></el-col>
                        <el-col :span="8"><chart-card :cardData="cardDataOther2"></chart-card></el-col>
                        <el-col :span="8"><chart-card :cardData="cardDataOther3"></chart-card></el-col>
                    </el-row>
                </div>
            </div>
            <!-- 消息推送和应用市场 -->
            <div class="right-board">
                <message-and-app :appCenter="appCenter" @goToPage="goToPage"></message-and-app>
            </div>
        </div>
        <el-row :gutter="24" class="index-row">
            <!-- 资源库存 -->
            <el-col :span="12">
                <index-custom-card>
                    <template slot="head">
                        资源库存&nbsp
                        <el-tooltip popper-class="amount-tooltip" effect="dark" content="Top center" placement="top">
                            <ul slot="content">
                                <li style="line-height: 20px;">
                                    数据更新至昨日
                                </li>
                                <li style="line-height: 20px;">
                                    历史库存：统计今年1月1日起至昨日的总点位面周数
                                </li>
                                <li style="line-height: 20px;">
                                    未来库存：统计今日起至年底12月31日的总点位面周数
                                </li>
                                <li style="line-height: 20px;">
                                    已售资源：指统计周期内售卖出去的面*周数
                                </li>
                                <li style="line-height: 20px;">
                                    过期资源：指统计周期内可投放却未售卖出去的面*周数
                                </li>
                                <li style="line-height: 20px;">
                                    维修资源：指统计周期内处于维修状态而未售卖的面*周数
                                </li>
                                <li style="line-height: 20px;">
                                    禁用资源：指统计周期内处于禁用状态而未售卖的面*周数
                                </li>
                            </ul>
                            <img class="quesition-icon" src="../../assets/images/question_icon.png" />
                        </el-tooltip>
                    </template>
                    <template slot="content">
                        <div class="stock-chart">
                            <el-popover
                                popper-class="index-custom-popper"
                                class="progress"
                                placement="top-start"
                                :visible-arrow="false"
                                width="200"
                                trigger="hover">
                                <div class="tip-box">
                                    <div class="pop-title">
                                        <em>{{(resStock.past.preStartDate||'')+'~'+(resStock.past.preEndDate||'')}}</em>
                                    </div>
                                    <ul>
                                        <li class="pop-item">
                                            <em>已售</em>
                                            <span class="align-right">{{resStock.past.onPubStock}}面周</span>
                                            <span class="tip-rate">{{resStock.past.onPubStockRate}}%</span>
                                        </li>
                                        <li class="pop-item">
                                            <em>过期</em>
                                            <span class="align-right">{{resStock.past.overdueStock}}面周</span>
                                            <span class="tip-rate">{{resStock.past.overdueStockRate}}%</span>
                                        </li>
                                        <li class="pop-item">
                                            <em>维修</em>
                                            <span class="align-right">{{resStock.past.repairStock}}面周</span>
                                            <span class="tip-rate">{{resStock.past.repairStockRate}}%</span>
                                        </li>
                                        <li class="pop-item">
                                            <em>禁用</em>
                                            <span class="align-right">{{resStock.past.banStock}}面周</span>
                                            <span class="tip-rate">{{resStock.past.banStockRate}}%</span>
                                        </li>
                                    </ul>
                                </div>
                                <div slot="reference">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :width="600*resStock.currentMonthPercent" height="320" class="capsule-left">
                                        <defs>
                                            <linearGradient id="blue1" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" style="stop-color:#6DB9FF;stop-opacity:1" />
                                                <stop offset="100%" style="stop-color:#1890FF;stop-opacity:1" />
                                            </linearGradient>
                                        </defs>
                                        <g :transform="'translate(0, ' + (100-(resStock.past.onPubStockRate||0)*1-(resStock.past.overdueStockRate||0)*1)*3.2 +')'">
                                            <g fill="#FABF14" transform="translate(-175 0)">
                                                <path :d="'M 0 0 Q 87.5 23, 175 0 T 350 0 T 525 0 T 700 0 T 875 0 T 1050 0 T 1225 0 T 1400 0 V ' + (resStock.past.overdueStockRate||100)*3.2 + ' H 0 V 0'" transform="translate(-38.232284367796474, 0)"></path>
                                                <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-700" dur="1.5s" repeatCount="indefinite"></animateTransform>
                                            </g>
                                            <g fill="#FAAD14">
                                                <path :d="'M 0 0 Q 87.5 23, 175 0 T 350 0 T 525 0 T 700 0 T 875 0 T 1050 0 T 1225 0 T 1400 0 V ' + (resStock.past.overdueStockRate||100)*3.2 + ' H 0 V 0'" transform="translate(-38.232284367796474, 0)"></path>
                                                <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-350" dur="3s" repeatCount="indefinite"></animateTransform>
                                            </g>
                                            <text :x="300*resStock.currentMonthPercent+10" :y="(resStock.past.overdueStockRate||100)*1.6+10" fill="#fff" >{{resStock.past.overdueStockRate||'0.00'}}%</text>
                                            <text :x="300*resStock.currentMonthPercent+10" :y="(resStock.past.overdueStockRate||100)*1.6+30" fill="#fff" >过期</text>
                                        </g>
                                        <g v-if="resStock.past.overdueStockRate*1 > 0" :transform="'translate(0, ' + (100-(resStock.past.onPubStockRate||0)*1)*3.2 +')'" fill="url(#blue1)">
                                            <path d="M 0 0 H 600 V 320 H 0 V 0"></path>
                                            <text :x="300*resStock.currentMonthPercent+10" :y="((100-resStock.past.onPubStockRate)||100)*1.6+10" fill="#fff" >{{resStock.past.onPubStockRate||'0.00'}}%</text>
                                            <text :x="300*resStock.currentMonthPercent+10" :y="((100-resStock.past.onPubStockRate)||100)*1.6+30" fill="#fff" >已售</text>
                                        </g>
                                        <g v-else>
                                            <g fill="#B2DAFF" transform="translate(-175 0)">
                                                <path d="M 0 0 Q 87.5 23, 175 0 T 350 0 T 525 0 T 700 0 T 875 0 T 1050 0 T 1225 0 T 1400 0 V 320 H 0 V 0"></path>
                                                <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-700" dur="1.5s" repeatCount="indefinite"></animateTransform>
                                            </g>
                                            <g fill="url(#blue2)">
                                                <path d="M 0 0 Q 87.5 23, 175 0 T 350 0 T 525 0 T 700 0 T 875 0 T 1050 0 T 1225 0 T 1400 0 V 320 H 0 V 0"></path>
                                                <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-350" dur="3s" repeatCount="indefinite"></animateTransform>
                                            </g>
                                            <text x="150" y="155" fill="#fff" >{{resStock.past.onPubStockRate||'0.00'}}%</text>
                                            <text x="150" y="175" fill="#fff" >已售</text>  
                                        </g>
                                    </svg>
                                </div>
                            </el-popover>
                            
                            <el-popover
                                popper-class="index-custom-popper"
                                class="progress"
                                placement="right-start"
                                :visible-arrow="false"
                                width="200"
                                trigger="hover">
                                <div class="tip-box">
                                    <div class="pop-title">
                                        <em>{{resStock.next.futureStartDate+'-'+resStock.next.futureEndDate}}</em>
                                    </div>
                                    <ul>
                                        <li class="pop-item">
                                            <em>已售</em>
                                            <span class="align-right">{{resStock.next.futureOnPubStock}}面周</span>
                                            <span class="tip-rate">{{resStock.next.futureOnPubStockRate}}%</span>
                                        </li>
                                        <li class="pop-item">
                                            <em>未售</em>
                                            <span class="align-right">{{resStock.next.futureUnsoldStock}}面周</span>
                                            <span class="tip-rate">{{resStock.next.futureUnsoldStockRate}}%</span>
                                        </li>
                                    </ul>
                                </div>
                                <div slot="reference" style="position: relative;">
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :width="600*(1-resStock.currentMonthPercent*1)" height="320" class="capsule-right">
                                        <defs>
                                            <linearGradient id="blue2" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" style="stop-color:#6DB9FF;stop-opacity:1" />
                                                <stop offset="100%" style="stop-color:#1890FF;stop-opacity:1" />
                                            </linearGradient>
                                        </defs>
                                        <g :transform="'translate(0, ' + ((resStock.next.futureUnsoldStockRate||0)*1||100)*3.2 +')'">
                                            <g fill="#B2DAFF" transform="translate(-175 0)">
                                                <path d="M 0 0 Q 87.5 23, 175 0 T 350 0 T 525 0 T 700 0 T 875 0 T 1050 0 T 1225 0 T 1400 0 V 320 H 0 V 0"></path>
                                                <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-700" dur="1.5s" repeatCount="indefinite"></animateTransform>
                                            </g>
                                            <!-- <g fill="#6DB9FF">
                                                <path d="M 0 0 Q 87.5 23, 175 0 T 350 0 T 525 0 T 700 0 T 875 0 T 1050 0 T 1225 0 V 320 H 0 V 0" transform="translate(-38.232284367796474, 0)"></path>
                                                <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-340" dur="2s" repeatCount="indefinite"></animateTransform>
                                            </g> -->
                                            <g fill="url(#blue2)">
                                                <path d="M 0 0 Q 87.5 23, 175 0 T 350 0 T 525 0 T 700 0 T 875 0 T 1050 0 T 1225 0 T 1400 0 V 320 H 0 V 0"></path>
                                                <animateTransform attributeName="transform" attributeType="XML" type="translate" from="0" to="-350" dur="3s" repeatCount="indefinite"></animateTransform>
                                            </g>
                                        </g>
                                    </svg>
                                    <div v-if="resStock.next.futureUnsoldStockRate*1<100" class="next-text">
                                        <span>已售</span>
                                        <span>{{resStock.next.futureOnPubStockRate||'0.00'}}%</span>
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                        <div class="coordinate-line">
                            <div v-for="item in 12" class="sub-line">
                                <span class="sub-text">{{item + '月'}}</span>
                            </div>
                        </div>
                        <div v-if="sessionData.asrID != '999'" class="bottom-box">
                            贵司共浪费了价值  <span class="avtive"> ¥{{resStock.overduePrice | moneyFormat('¥')}} </span>  的资源，多于全国 <span class="avtive"> {{resStock.unsoldRank}}% </span> 的公司，太可惜了
                        </div>
                    </template>
                </index-custom-card>
            </el-col>
            <el-col :span="12">
                <index-custom-card>
                    <template slot="head">
                        业绩排行
                        <div class="date-interval">
                            <span :class="{'active': dateInterval === 1}" @click="getRankList('dateInterval', 1)">全年</span>
                            <span :class="{'active': dateInterval === 2}" @click="getRankList('dateInterval', 2)">本季</span>
                            <span :class="{'active': dateInterval === 3}" @click="getRankList('dateInterval', 3)">本月</span>
                        </div>
                        <el-radio-group v-model="isBehind" size="small" class="achievement-radio-group" @change="getRankList">
                            <el-radio-button :label="false">领先</el-radio-button>
                            <el-radio-button v-if="sessionData.ascType > 0" :label="true">落后</el-radio-button>
                        </el-radio-group>
                    </template>
                    <template slot="content">
                        <ul class="item-list">
                            <li class="item" v-for="(rankItem, index) in rankListArr" :key="index">
                                <span :title="rankItem.realName" class="label">{{rankItem.realName}}</span>
                                <el-popover
                                    v-if="sessionData.ascType > 0"
                                    popper-class="index-custom-popper"
                                    class="progress"
                                    placement="top"
                                    :visible-arrow="false"
                                    width="200"
                                    trigger="hover"
                                >
                                    <div class="pop-box">
                                        <div class="pop-title">
                                            <em>{{rankItem.realName}}</em>
                                            <span class="target-btn" @click="setTarget(rankItem)">设置目标</span>
                                        </div>
                                        <ul>
                                            <li class="pop-item">
                                                <em>业绩目标：</em>
                                                <span class="item-right">{{rankItem.targetPrice | moneyFormat('¥')}}</span>
                                            </li>
                                            <li class="pop-item">
                                                <em>销售金额：</em>
                                                <span class="item-right">{{rankItem.totalPrice | moneyFormat('¥')}}</span>
                                            </li>
                                            <li class="pop-item">
                                                <em>完成进度：</em>
                                                <span class="item-right">{{rankItem.finshProcess || 0}}%</span>
                                            </li>
                                        </ul>
                                    </div><mini-progress :target="rankItem.targetProcess" :percentage="rankItem.finshProcess" :value="rankItem.totalPrice | moneyFormat('¥')" slot="reference" :height="'20px'" :color="'rgba(24, 144, 255, 1)'"></mini-progress>
                                </el-popover>
                                <mini-progress v-else :percentage="rankItem.finshProcess" :value="rankItem.totalPrice | moneyFormat('¥')" :height="'20px'" :color="'rgba(24, 144, 255, 1)'"></mini-progress>
                            </li>
                        </ul>
                    </template>
                </index-custom-card>
            </el-col>
        </el-row>
        <el-row class="index-row">
            <!-- 机会挖掘 -->
            <index-custom-card :height="'auto'">
                <template slot="head">
                    机会挖掘&nbsp
                    <el-tooltip popper-class="amount-tooltip" effect="dark" content="Top center" placement="top">
                        <ul slot="content">
                            <li style="line-height: 20px;">
                                数据统计至昨日
                            </li>
                            <li style="line-height: 20px;">
                                沉默：指没有订单投放且最后一次方案创建时间≥30天的客户数
                            </li>
                            <li style="line-height: 20px;">
                                活跃：指统计当前有订单正在投放或投放订单完成后的30天内的客户数
                            </li>
                            <li style="line-height: 20px;">
                                初购：指该客户录入进系统后，有且仅合作过一个订单
                            </li>
                            <li style="line-height: 20px;">
                                复购：指该客户录入进系统后，至少合作过2个及以上的订单
                            </li>
                            <li style="line-height: 20px;">
                                未合作：指该客户录入进系统后，从未合作发布过订单
                            </li>
                        </ul>
                        <img class="quesition-icon" src="../../assets/images/question_icon.png" />
                    </el-tooltip>
                </template>
                <template slot="content">
                    <el-row :gutter="24" class="index-row" style="align-items: flex-start; padding: 33px 24px; margin: 0; ">
                        <el-col :span="10">
                            <nest-pie-chart container="nestPie" :sourceData="nestPieData" @activeData="activeData"></nest-pie-chart>
                            <div v-if="sessionData.asrID != '999'" class="bottom-box" style="width: calc(41.66% - 48px);">
                                贵公司<span class="avtive"> {{extendData[0]}} </span>位沉默客户待挖掘，多于全国<span class="avtive"> {{extendData[1]+'%'}} </span>的公司，请加把劲！
                            </div>
                        </el-col>
                        <el-col :span="14" style="align-self: flex-start;">
                            <el-table
                                v-loading="clientLoading"
                                :data="showClientArr"
                                max-height="500"
                                class="client-table"
                                style="border: 1px solid #e8e8e8;"
                            >
                                <el-table-column
                                    label="客户"
                                    width="230">
                                    <template slot-scope="scope">
                                        <!-- <span @click="routePage(scope.row)" style="color: #1890FF; cursor: pointer;">{{scope.row.cName}}</span> -->
                                        <span>{{scope.row.cName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    sortable
                                    prop="daydiffer"
                                    label="沉默天数"
                                    width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="price"
                                    label="合作金额"
                                    sortable
                                >
                                    <template slot-scope="scope">
                                        <el-popover
                                            popper-class="index-custom-popper"
                                            class="progress"
                                            placement="top"
                                            :visible-arrow="false"
                                            :border="true"
                                            width="200"
                                            trigger="hover"
                                        >
                                            <div class="pop-box">
                                                <ul>
                                                    <li class="pop-item">
                                                        <em>所属销售：</em>
                                                        <span>{{scope.row.saleNames || ''}}</span>
                                                    </li>
                                                    <li class="pop-item">
                                                        <em>合作金额：</em>
                                                        <span>{{scope.row.price | moneyFormat('¥')}}</span>
                                                    </li>
                                                </ul>
                                                <div class="pop-title">
                                                    <span class="bottom-btn" @click="unfollow(scope.row)">不再关注</span>
                                                </div>
                                            </div>
                                            <mini-progress slot="reference" :target="0" :percentage="scope.row.priceRate" :value="scope.row.price | moneyFormat('¥')" :height="'20px'" :color="clientColor"></mini-progress>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </template>
            </index-custom-card>
        </el-row>
        <div class="SM_order_price">
            <div class="order_price_date" v-if="isRetailCompany">
                <template v-if="activeTabsName == 'price'">
                    <el-radio-group v-model="amountForm.periodType" size="mini" @change="switchpPeriodType" class="radio-period-type">
                        <el-radio-button label="compareWeek">按周</el-radio-button>
                        <el-radio-button label="compareMonth">按月</el-radio-button>
                    </el-radio-group>
                    <template v-if="amountForm.periodType=='compareWeek'">
                        <el-date-picker
                            ref="weekSource"
                            v-model="amountForm.compareWeek.compareSourceDate"
                            type="week"
                            size="mini"
                            :clearable="false"
                            format="yyyy 第 WW 周"
                            placeholder="选择周"
                            :picker-options="priceDateWeek"
                            @change="changeMonthToCompare('start')">
                        </el-date-picker>
                        <el-checkbox v-model="turnoverCompare" @change="compareRadio">对比</el-checkbox>
                        <el-date-picker
                            ref="weekTarget"
                            v-model="amountForm.compareWeek.compareTargetDate"
                            type="week"
                            size="mini"
                            :clearable="false"
                            format="yyyy 第 WW 周"
                            placeholder="选择周"
                            :picker-options="priceDateWeek"
                            @change="changeMonthToCompare('end')">
                        </el-date-picker>
                    </template>
                    <template v-else>
                        <el-date-picker
                            v-model="amountForm.compareMonth.compareSourceDate"
                            type="month"
                            size="mini"
                            value-format="yyyy-MM"
                            format="yyyy-MM"
                            :clearable="false"
                            placeholder="选择月"
                            :picker-options="priceDate"
                            @change="changeMonthToCompare('start')">
                        </el-date-picker>
                        <el-checkbox v-model="turnoverCompare" @change="compareRadio">对比</el-checkbox>
                        <el-date-picker
                            v-model="amountForm.compareMonth.compareTargetDate"
                            type="month"
                            size="mini"
                            value-format="yyyy-MM"
                            format="yyyy-MM"
                            placeholder="选择月"
                            :picker-options="priceDate"
                            @change="changeMonthToCompare('end')">
                        </el-date-picker>
                    </template>
                </template>
                <template v-if="activeTabsName == 'order'">
                    <el-date-picker
                            v-model="DateMonth[0]"
                            type="month"
                            size="mini"
                            value-format="yyyy-MM"
                            format="yyyy-MM"
                            :clearable="false"
                            placeholder="选择月"
                            :picker-options="priceDate"
                            @change="changeMonthToCompare('start')">
                        </el-date-picker>
                        <el-checkbox v-model="turnoverCompare" @change="compareRadio">对比</el-checkbox>
                        <el-date-picker
                            v-model="DateMonth[1]"
                            type="month"
                            size="mini"
                            value-format="yyyy-MM"
                            format="yyyy-MM"
                            placeholder="选择月"
                            :picker-options="priceDate"
                            @change="changeMonthToCompare('end')">
                        </el-date-picker>
                </template>
            </div>
            <el-tabs style="height: 643px;border: 1px solid #e5e6e9;" v-model="activeTabsName" @tab-click="tabHandleClick">
                <el-tab-pane label="点位分布" name="pointDistribution">
                    <point-distribution :isPlatformSM="isPlatform"  mapContainer="mapContainer1" :hasMpvgl="hasMpvgl" :actived="activeTabsName === 'pointDistribution'"></point-distribution>
                </el-tab-pane>
                <el-tab-pane label="点位上刊率" name="pointPublication">
                    <publish-rate mapContainer="mapContainer2" :hasMpvgl="hasMpvgl" :actived="activeTabsName === 'pointPublication'"></publish-rate>
                </el-tab-pane>
                <el-tab-pane v-if="isRetailCompany" label="成交金额" name="price">
                    <div style="margin-top: 8px">
                        <el-radio-group v-model="radioAmount" size="mini" @change="switchRadioAmount">
                            <el-radio-button label="签约额"></el-radio-button>
                            <el-radio-button label="执行额"></el-radio-button>
                        </el-radio-group>
                        <el-tooltip popper-class="amount-tooltip" effect="dark" content="Top center" placement="top">
                            <ul slot="content">
                                <li style="line-height: 20px;">
                                    签约额：均为合同金额，未扣除总部收益部分
                                </li>
                                <li style="line-height: 20px;">
                                    全国单发单执行额：该执行额不以实际订单金额统计，而以拆单时的方案金额以公式计算获得
                                </li>
                                <li style="line-height: 20px;">
                                    按周统计：指每周六至下周五为一个周
                                </li>
                                <li style="line-height: 20px;">
                                    按月统计：指从1号至自然月底
                                </li>
                            </ul>
                            <img class="quesition-icon" src="../../assets/images/question_icon.png" />
                        </el-tooltip>
                    </div>
                   <div id="price_bar_box"
                        v-loading="priceBoxLoading"
                        element-loading-text="玩命加载中.."
                        element-loading-spinner="el-icon-loading">
                       <div class="turnover_charts" id="turnoverBar" ref="turnoverDataBar" style="width:100%;"> </div>
                   </div>
                </el-tab-pane>
                <el-tab-pane v-if="isRetailCompany" label="订单数" name="order">
                    <div id="order_bar_box">
                        <div class="order_charts" id="orderBar" ref="orderDataBar"> </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
        <div class="monthly_ranking" v-show="isMonthlyRanking">
            <div class="monthly_ranking_box">
                <div class="monthly_ranking_title">
                    <img src="../../assets/images/index/SM.png" alt="">
                </div>
                <div class="monthly_ranking_content">
                    <el-row>
                        <el-col :span="8">
                            <div class="monthly_ranking_city monthly_ranking_content_first">
                                <div id="first_box">
                                    <img src="../../assets/images/index/left-star.png" alt="" class="monthly_ranking_img_top_left">
                                    <img src="../../assets/images/index/right-star.png" alt="" class="monthly_ranking_img_top_right">
                                    <img src="../../assets/images/index/left.png" alt="" class="monthly_ranking_img_left">
                                    <!--showCityRankingImg-->
                                    <!--<img src="../../assets/images/index/beijing.png" alt="" class="monthly_ranking_img_meiddle">-->
                                    <img :src="showCityRankingImg[0].url" alt="" class="monthly_ranking_img_meiddle">
                                    <img src="../../assets/images/index/right.png" alt="" class="monthly_ranking_img_right">
                                    <img src="../../assets/images/index/name.png" alt="" class="monthly_ranking_img_bottom">
                                    <span class="monthly_ranking_city_name city_name_left">{{showCityRankingImg[0].city}}</span>
                                    <span class="ranking_num first_ranking_num">第{{showCityRankingImg[0].ranking}}名</span>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="monthly_ranking_city monthly_ranking_content_second">
                                <img id="second_top_left" src="../../assets/images/index/left-star.png" alt="" class="monthly_ranking_img_top_left">
                                <img id="second_top_right" src="../../assets/images/index/right-star.png" alt="" class="monthly_ranking_img_top_right">
                                <img id="second_img_left" src="../../assets/images/index/left.png" alt="" class="monthly_ranking_img_left">
                                <img id="meiddle" :src="showCityRankingImg[1].url" alt="" class="monthly_ranking_img_meiddle">
                                <img id="second_img_right" src="../../assets/images/index/right.png" alt="" class="monthly_ranking_img_right">
                                <img id="second_img_name" src="../../assets/images/index/name.png" alt="" class="monthly_ranking_img_bottom">
                                <span id="second_city_name" class="monthly_ranking_city_name city_name_meiddle">{{showCityRankingImg[1].city}}</span>
                                <span class="ranking_num second_ranking_num">第{{showCityRankingImg[1].ranking}}名</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="monthly_ranking_city monthly_ranking_content_three">
                                <div id="three_box">
                                    <img src="../../assets/images/index/left-star.png" alt="" class="monthly_ranking_img_top_left">
                                    <img src="../../assets/images/index/right-star.png" alt="" class="monthly_ranking_img_top_right">
                                    <img src="../../assets/images/index/left.png" alt="" class="monthly_ranking_img_left">
                                    <img :src="showCityRankingImg[2].url" alt="" class="monthly_ranking_img_meiddle">
                                    <img src="../../assets/images/index/right.png" alt="" class="monthly_ranking_img_right">
                                    <img src="../../assets/images/index/name.png" alt="" class="monthly_ranking_img_bottom">
                                    <span class="monthly_ranking_city_name city_name_right">{{showCityRankingImg[2].city}}</span>
                                    <span class="ranking_num three_ranking_num">第{{showCityRankingImg[2].ranking}}名</span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="monthly_ranking_bottom">
                        <div class="monthly_ranking_bottom_btn" @click="isMonthlyRanking = !isMonthlyRanking">继续努力</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 设置业绩目标 -->
        <el-dialog :width="'288px'" :show-close="false" :visible.sync="showSetTarget" custom-class="target-dialog">
            <span slot="title">设置{{currentEditSale.realName || ''}}业绩目标</span>
            <el-form>
                <el-form-item>
                    <el-input-number size="small" :precision="2" :controls="false" :min="0" v-model="targetVaule">
                        <template slot="prepend">¥</template>
                    </el-input-number >
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showSetTarget = false">取 消</el-button>
                <el-button type="primary" @click="setTarget(null)">保 存</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
    // import homeTop from '../common/components/homeTop.vue';

    import personalInfo from '../common/components/personalInfo.vue';
    import messageAndApp from '../common/components/messageAndApp.vue';
    import chartCard from '../common/components/chartCard.vue';
    import indexCustomCard from '../common/components/indexCustomCard.vue';
    import miniProgress from '../common/components/miniProgress.vue';
    import liquidChart from '../common/components/liquidChart.vue';
    import nestPieChart from '../common/components/nestPieChart.vue';
    import pointDistribution from '../common/components/pointDistribution.vue';
    import publishRate from '../common/components/publishRate.vue';
    import moment from "moment";

    import homeLink from '../common/components/homeLink.vue';
    import timeFormat from '../../commonFun/timeFormat'
    import commaFormat from '../../commonFun/commaFormat'
    import sessFun from '../../commonFun/sessFun.js'
    import api from "../../api/api";
    import indexIsDateFirst from '../../commonFun/indexIsDateFirst.js';
    import appCenter from '../../commonFun/json/appCenter.json';
    export default {
        name: "admin_index",
        components: {
            // homeTop,
            homeLink,

            personalInfo,
            messageAndApp,
            chartCard,
            miniProgress,
            indexCustomCard,
            liquidChart,
            nestPieChart,
            pointDistribution,
            publishRate
        },
        data() {
            return {
                hasMpvgl: false,
                nowMonth: '',
                sessionData: '',
                isPlatform: false,      // 根据帐号所属公司id判断是否是否为平台商
                // 表头登录账户信息
                userInfo: {
                    userName: '',
                    greetings: '祝您开心每一天!',
                    avator: require('../../assets/images/index/headimg.png'),
                },
                dataArr: [
                    {
                        name: '当月激活客户数',
                        data: 0
                    },
                    {
                        name: '当月订单数',
                        data: 0
                    },
                    {
                        name: '当月成交金额',
                        data: '0'
                    },
                ],
                // 常用功能，按超管、媒介、销售分组
                linkArrNew: [
                    {
                        imgurl: require('../../assets/images/map.png'),
                        title: '地图选点',
                        link: '',
                    },
                    {
                        imgurl: require('../../assets/images/acount.png'),
                        title: '账号管理',
                        link: './superOperate/accountList',
                    },
                    {
                        imgurl: require('../../assets/images/img.png'),
                        title: '图片库',
                        link: './superOperate/photoGallery',
                    },
                    {
                        imgurl: require('../../assets/images/adPrice.png'),
                        title: '刊例价',
                        link: './superOperate/publishPriceList'
                    }
                ],
                isRetailCompany: false,     // 判断是否为7大直营公司或平台商
                listDirectList: [],         // 直营城市公司列表
                activeTabsName: 'pointDistribution',
                // 金额图表的echarts
                DateMonth: ['2019-03',''],
                turnoverEcharts: '',
                // 金额图表数据
                priceBoxLoading: false,     // 金额总数图标loading
                turnoverDataShow: {
                    cityName: [],
                    sourceData: {
                        dateMonth: '',
                        nativeContractPrice: [],
                        nativeExecutePrice: [],
                        nationwideContractPrice: [],
                        nationwideExecutePrice: [],
                        nonNativeExecutePrice: []
                    },
                    compareData: {
                        dateMonth: '',
                        nativeContractPrice: [],
                        nativeExecutePrice: [],
                        nationwideContractPrice: [],
                        nationwideExecutePrice: [],
                        nonNativeExecutePrice: []
                    },
                    turnoverTitle: ['订单金额']
                },
                turnoverDateMonth: ['2019-03', ''],
                // 订单数柱状图echarts
                orderEcharts: '',
                // 订单柱状图数据
                orderDataShow: {
                    priceData: [],
                    cityName: [],
                    compareDataByDate: [],
                    turnoverTitle: ['订单金额']
                },
                // 订单月份title
                orderDateMonth: ['201903', ''],
                // 是否对比
                turnoverCompare: false,
                // 跑道价格
                // runwayLoading: true,    // 业绩跑到loading
                // maxPrice: 550000000,     // 跑道价格最大值，单位分
                runwayPrice: [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550],
                // 跑道图片
                // runwayImg: [],
                // 销售当月销售金额
                salePrice: [430, 290, 220, 195, 160, 110, 45, 20],
                // 销售排行
                // performanceVisible: false,
                // 排行表格
                // tableData: [],
                isMonthlyRanking: false,
                // 当前城市排名
                cityRank: '',
                // 弹窗显示的城市排名
                showCityRankingImg:[
                    {city:'',ranking: 0,url: ''},
                    {city:'',ranking: 0,url: ''},
                    {city:'',ranking: 0,url: ''}
                ],
                // 当前日期是否为当月1号
                isOneDay: false,
                // 时间限制
                priceDate:{
                    disabledDate:(time) =>{
                        return time.getTime() > Date.now()
                    }
                },
                priceDateWeek: {
                    disabledDate:(time) =>{
                        let tempWeekSort = [0, 1, 2, 3, 4, 5, 6],
                        // 以周六为一周的开始，求当天与本周六的相隔天数
                        rangeWithSaturday = tempWeekSort[(new Date().getDay() + 1)%7] ;
                        // 超过上周五置灰
                        return time.getTime() > (new Date().getTime() - 3600*24*(rangeWithSaturday+1)*1000)
                    },
                    firstDayOfWeek: 6
                },
                // 各城市对应荣誉图片地址
                honorImg:[
                    {
                        asrID: '6',
                        title: '本地销售',
                        url: require('../../assets/images/index/saler.png'),
                        urlFalse:require('../../assets/images/index/sale-1.png')
                    },
                    {
                        asrID: '6',
                        title: '新增用户',
                        url: require('../../assets/images/index/newUser.png'),
                        urlFalse:require('../../assets/images/index/user-1.png')
                    },
                    {
                        asrID: '4',
                        title: '全国销售',
                        url: require('../../assets/images/index/allSaler.png'),
                        urlFalse:require('../../assets/images/index/allSale-1.png')
                    },
                    {
                        asrID: '6',
                        title: '财务管理',
                        url: require('../../assets/images/index/money.png'),
                        urlFalse:require('../../assets/images/index/money-1.png')
                    },
                    {
                        asrID: '1',
                        title: '社区发展',
                        url: require('../../assets/images/index/comDev.png'),
                        urlFalse:require('../../assets/images/index/comDev-1.png')
                    },
                    {
                        asrID: '2',
                        title: '飞跃进步',
                        url: require('../../assets/images/index/progress.png'),
                        urlFalse:require('../../assets/images/index/advance-1.png')
                    }
                ],
                //登录用户所在公司的荣誉
                companyHonor:[],
                // 应用中心
                appCenter: '',
                isSlideDown: true,
                radioAmount: '签约额',
                amountForm: {
                    periodType: 'compareMonth',
                    compareMonth: {
                        compareSourceDate: '',
                        compareTargetDate: ''
                    },
                    compareWeek: {
                        compareSourceDate: '',
                        compareTargetDate: ''
                    }
                },
                
                cardData1: {
                    title: '本年销售额',
                    tip: '数据截止至昨日，销售额数据来源为统计周期内发布的订单金额总和',
                    value: 0,
                    valueAlias: '新增销售额',
                    prefix: '¥',
                    comment: '数据统计截止至昨天',
                    compare: 0,
                    trendLabel: '同比去年',
                    data: []
                },
                cardData2: {
                    title: '本年订单数',
                    tip: '数据截止至昨日，订单总数数数据来源为统计周期内发布的订单数量总和',
                    value: 0,
                    valueAlias: '新增订单数',
                    comment: '数据统计截止至昨天',
                    compare: 0,
                    trendLabel: '同比去年',
                    data: []
                },
                cardData3: {
                    title: '总客户数',
                    tip: '数据截止至昨日，客户数数据来源为统计周期内新建的客户数总和',
                    value: 0,
                    valueAlias: '新增客户数',
                    comment: '数据统计截止至昨天',
                    compare: 0,
                    trendLabel: '同比去年',
                    data: []
                },
                cardDataOther1: {
                    type: 'stackBar',
                    title: '媒体总数',
                    tip: '数据截止至昨日，媒体总数数据来源为统计周期内新增的各类型媒体数量总和',
                    value: 0,
                    comment: '数据统计截止至昨天',
                    compare: 0,
                    trendLabel: '同比去年',
                    data: []
                },
                cardDataOther2: {
                    type: 'bar',
                    title: '社区总数',
                    tip: '数据截止至昨日，社区总数数据来源为统计周期内新增的社区数量总和',
                    value: 0,
                    valueAlias: '新增小区数',
                    comment: '数据统计截止至昨天',
                    compare: 0,
                    trendLabel: '同比去年',
                    data: []
                },
                cardDataOther3: {
                    type: 'bar',
                    title: '昨日上刊率',
                    tip: '数据截止至昨日，上刊率计算公式为统计周期内周一至周日点位投放总面*天与该时间内可投放总面*天的百分比',
                    value: 0,
                    valueAlias: '上刊率(%)',
                    suffix: '%',
                    comment: '数据统计截止至昨天',
                    compare: 0,
                    trendLabel: '周环比',
                    decimals: 2,
                    data: []
                },
                dateInterval: 1,
                isBehind: false,
                showSetTarget: false,
                targetVaule: 0,
                // 当前被设置目标的销售
                currentEditSale: {},
                // 业绩排行列表
                rankListArr: [],
                // 机会挖掘表格
                clientArr: [],
                clientLoading: true,
                clientColor: 'rgb(250, 173, 20)',
                filterClientObj: {activeStatus: 0},
                extendData: ['0', '0'],
                // 机会挖掘嵌套饼图数据
                nestPieData: [],
                // 媒体概况饼图数据
                ringData: [],
                // 资源库存数据
                resStock: {past: {}, next: {}, currentMonthPercent: 0.5},
            }
        },
        beforeCreate() {
            var glSript = document.createElement('script');
            glSript.type = 'text/javascript';
            glSript.src = 'https://api.map.baidu.com/api?type=webgl&v=1.0&ak=OuaBKFQpjyuK6a2BvVW7qbNagMkSAKqI&callback=init';
            document.body.appendChild(glSript);
            glSript.onload = ()=>{
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "/static/mapvgl.min.js";
                document.body.appendChild(script);
                script.onload = ()=>{
                    this.hasMpvgl = true
                }
            }
        },
        mounted() {
            // 获取session中的数据,并进行权限判断
            this.getsessionData()
            // 超级运营顶部内容详情
            this.getHeaderData()
            // 根据所属公司权限调用接口
            this.getDataByAsrID()
            // 实时监听body宽度变化
            document.body.addEventListener("resize", () => {
               this.realTimeChangeEcharteWidth()
            });
            //用户中心
            this.appCenter = appCenter
            this.uploadEvent(1)
            this.allReportApi()
            this.getRankList()
            let timer = setTimeout(()=>{
                this.getSMCustomerActiveReport()
                clearTimeout(timer)
            }, 1500)
        },
        computed: {
            showClientArr() {
                let tempArr = this.clientArr.filter(item=>{
                    // console.log('this.filterClientObj.apCnt', this.filterClientObj.apCnt)
                    if(this.filterClientObj.apCnt >= 0) {
                        if(this.filterClientObj.apCnt == 2) {
                            return (item.apCnt >= this.filterClientObj.apCnt) && (item.activeStatus === this.filterClientObj.activeStatus)
                        } else {
                            return (item.apCnt === this.filterClientObj.apCnt) && (item.activeStatus === this.filterClientObj.activeStatus)
                        }
                    } else {
                        return item.activeStatus === this.filterClientObj.activeStatus
                    }
                })
                this.clientLoading = false;
                return tempArr.slice(0, 10);
            }
        },
        methods: {
            // 环图点击事件更改客户表格数据
            activeData(viewData, ev) {
                // console.log('tempElement', ev.data.color)
                this.clientColor = ev.data.color;
                this.clientLoading = true;
                if(viewData.view == 'out') {
                    // 展示饼图外层子集数据
                    const tempArr = viewData.name.split('-');
                    switch(tempArr[0]) {
                        case '初购':
                            this.filterClientObj = {
                                apCnt: 1,
                                activeStatus: tempArr[1] == '活跃' ? 1 : 0
                            }
                            break;
                        case '复购':
                            this.filterClientObj = {
                                apCnt: 2,
                                activeStatus: tempArr[1] == '活跃' ? 1 : 0
                            }
                            break;
                        case '未合作':
                            this.filterClientObj = {
                                apCnt: 0,
                                activeStatus: tempArr[1] == '活跃' ? 1 : 0
                            }
                            break;
                            
                    }
                } else {
                    // 展示饼图内层数据，即默认或活跃的客户
                    if(viewData.type == '活跃') {
                        this.filterClientObj = {
                            activeStatus: 1
                        }
                    } else {
                        this.filterClientObj = {
                            activeStatus: 0
                        }
                    }
                }
                // console.log('viewData', viewData, this.filterClientObj)
            },
            // 首页报表接口
            allReportApi() {
                // 管理员的本年销售额和本年订单数卡片 /report /homepage/getSMAdPlanCardReport
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token
                }
                api.getApi(this.apiVar.report + '/homepage/getSMAdPlanCardReport',params).then(res=>{
                    if (res.data.SysCode === 200200) {
                        let temp = res.data.data;
                        Object.assign(this.cardData1, {
                            value: temp.totalAdPlanPrice,
                            compare: temp.planPriceIncrRate
                        })
                        Object.assign(this.cardData2, {
                            value: temp.totalAdPlanCnt,
                            compare: temp.planCntIncrRate
                        })
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                }).catch(err=>{
                    console.log('err', err)
                }).finally(_=>{
                })
                // 管理员的客户数，媒体数和社区数卡片 /report /homepage/getSMResAndCustomCardReport
                api.getApi(this.apiVar.report + '/homepage/getSMResAndCustomCardReport',params).then(res=>{
                    if (res.data.SysCode === 200200) {
                        let temp = res.data.data;
                        Object.assign(this.cardData3, {
                            value: temp.totalCustomerCnt,
                            compare: temp.customerIncrRate
                        })
                        Object.assign(this.cardDataOther1, {
                            value: temp.totalMediaCnt,
                            compare: temp.mediaIncrRate
                        })
                        Object.assign(this.cardDataOther2, {
                            value: temp.totalResCnt,
                            compare: temp.resIncrRate
                        })
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                }).catch(err=>{
                    console.log('err', err)
                }).finally(_=>{
                })
                // 管理员的上刊率卡片 /report /homepage/getSMOnPubRateReport
                api.getApi(this.apiVar.report + '/homepage/getSMOnPubRateReport',params).then(res=>{
                    if (res.data.SysCode === 200200) {
                        let temp = res.data.data;
                        Object.assign(this.cardDataOther3, {
                            value: temp.onPubRate*1,
                            compare: temp.incrOnPubRate
                        })
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                }).catch(err=>{
                    console.log('err', err)
                }).finally(_=>{
                })
                // 管理员的所有卡片过去十三周的数据 /report /homepage/getSMOnPubRateReport
                api.getApi(this.apiVar.report + '/homepage/getSMWeekCardReport',params).then(res=>{
                    if (res.data.SysCode === 200200 && Array.isArray(res.data.data)) {
                        let temp = res.data.data;
                        let tempcCardData1 = [],
                            tempcCardData2 = [],
                            tempcCardData3 = [],
                            tempcCardDataOther1 = [],
                            tempcCardDataOther2 = [],
                            tempcCardDataOther3 = [];
                        temp.forEach((item, index)=>{
                            let commonObj = {
                                dateStr: `第${index+1}周`,
                                week: item.weekStarDate + '~' + item.weekEndDate
                            }
                            tempcCardData1.push({
                                ...commonObj,
                                value: item.weekPlanPrice || 0
                            })
                            tempcCardData2.push({
                                ...commonObj,
                                value: item.weekPlanCnt || 0
                            })
                            tempcCardData3.push({
                                ...commonObj,
                                value: item.weekCustomerCnt || 0
                            })
                            tempcCardDataOther1.push({
                                ...commonObj,
                                name: '新增道闸',
                                value: item.weekBarrierCnt || 0
                            })
                            tempcCardDataOther1.push({
                                ...commonObj,
                                name: '新增广告门',
                                value: item.weekDoorCnt || 0
                            })
                            tempcCardDataOther2.push({
                                ...commonObj,
                                name: '新增小区数',
                                value: item.weekResCnt || 0
                            })
                            tempcCardDataOther3.push({
                                ...commonObj,
                                name: '上刊率',
                                value: (item.weekOnPubRate || 0)*1
                            })
                        })
                        Object.assign(this.cardData1, {
                            data: tempcCardData1,
                        })
                        Object.assign(this.cardData2, {
                            data: tempcCardData2,
                        })
                        Object.assign(this.cardData3, {
                            data: tempcCardData3,
                        })
                        Object.assign(this.cardDataOther1, {
                            data: tempcCardDataOther1,
                        })
                        Object.assign(this.cardDataOther2, {
                            data: tempcCardDataOther2,
                        })
                        Object.assign(this.cardDataOther3, {
                            data: tempcCardDataOther3,
                        })
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                }).catch(err=>{
                    console.log('err', err)
                }).finally(_=>{
                    
                })
                // 资源库存数据
                api.getApi(this.apiVar.report + '/homepage/getSMResStockReport',params).then(res=>{
                    if (res.data.SysCode === 200200) {
                        let temp = res.data.data,
                            past = {
                                preStartDate: temp.preStartDate,  //历史开始时间
                                preEndDate: temp.preEndDate,	 //历史结束时间
                                onPubStock: temp.onPubStock,     //历史已售库存面周数
                                overdueStock: temp.overdueStock,		//过期资源面周数
                                repairStock: temp.repairStock,		//历史维修的库存
                                banStock: temp.banStock,			//历史禁止的库存
                                onPubStockRate: temp.onPubStockRate || 0,	//历史已售库存的百分比
                                overdueStockRate: temp.overdueStockRate || 0, //历史过期库存的百分比
                                repairStockRate: temp.repairStockRate || 0,   //历史维修库存的百分比
                                banStockRate: temp.banStockRate || 0, 	//历史禁止库存的百分比
                            },
                            next = {
                                futureStartDate: temp.futureStartDate,	//未来开始时间
                                futureEndDate: temp.futureEndDate,		//未来结束时间
                                futureOnPubStock: temp.futureOnPubStock,  //未来已售库存面周数
                                futureUnsoldStock: temp.futureUnsoldStock, //未来未售库存面周数
                                futureOnPubStockRate: temp.futureOnPubStockRate||0, //未来已售库存百分比
                                futureUnsoldStockRate: temp.futureUnsoldStockRate||0, //未来未售库存百分比
                            };
                        this.resStock = {
                            past,
                            next,
                            overduePrice: temp.overduePrice,
                            unsoldRank: temp.unsoldRank,
                            currentMonthPercent: (new Date().getMonth()+1)/13
                        }
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                }).catch(err=>{
                    console.log('err', err)
                }).finally(_=>{
                })
            },
            getSMCustomerActiveReport() {
                // 管理员的活跃客户报表 /report /homepage/getSMCustomerActiveReport
                api.getApi(this.apiVar.report + '/homepage/getSMCustomerActiveReport', {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                }).then(res=>{
                    if (res.data.SysCode === 200200) {
                        let temp = res.data.data;
                        // 图标源数据name值要唯一
                        this.nestPieData = [
                            { value: temp.activeFirstCnt, type: "活跃", name: "初购-活跃" },
                            { value: temp.activeSecondCnt, type: "活跃", name: "复购-活跃" },
                            { value: temp.silentFirstCnt, type: "沉默", name: "初购-沉默" },
                            { value: temp.silentSecondCnt, type: "沉默", name: "复购-沉默" },
                            { value: temp.noCooperation, type: "沉默", name: "未合作-沉默" }
                        ];
                        //0-沉默  1-活跃
                        this.clientArr = temp.customerPriceList;
                        this.extendData = [temp.silentCnt||0, temp.silenetCustomerRank||0]
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                }).catch(err=>{
                    console.log('err', err)
                }).finally(_=>{
                    
                })
            },
            // 管理员的业绩排行 /report /homepage/getSMAchievementReport
            getRankList(field, val) {
                // 日期区间切换等
                if(field) {this[field] = val}
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    limit: 10,
                    dateType: this.dateInterval
                }
                if (this.isBehind == false) {
                    params.orderType = 1    // 倒序传1
                }
                api.getApi(this.apiVar.report + '/homepage/getSMAchievementReport', params).then(res=>{
                    if (res.data.SysCode === 200200) {
                        let temp = res.data.data;
                        this.rankListArr = temp.userList.filter(item=>item.totalPrice>0)
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                }).catch(err=>{
                    console.log('err', err)
                }).finally(_=>{
                })
            },
            // 跳转到客户列表页面
            /* routePage(row) {
                console.log('row', row)
                return
                sessionStorage.setItem("customerId", row.cID);
                this.$router.push("./superOperate/clientDetail");
            }, */
            // 取消关注客户所在公司
            unfollow(row) {
                this.$confirm('确定不再关注该客户了吗?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        if(row.cID !=='' || row.cID !== undefined || row.cID !== null) {
                            let params = {
                                uid: this.sessionData.uID,
                                token: this.sessionData.token,
                                cID: row.cID
                            }
                            // console.log('设置销售目标参数',params)
                            api.postApi(this.apiVar.report + '/homepage/addIgnoreCustomer', params).then(res=>{
                                if(res.data.SysCode === 200200 || res.data.MSG === "操作成功"){
                                    this.messageFun('success',res.data.MSG)
                                    this.getSMCustomerActiveReport()
                                }else{
                                    this.messageFun('warning',res.data.MSG)
                                }
                            })
                        }
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            },
            // 设置业绩目标
            setTarget(row) {
                console.log('row', row)
                if(row) {
                    this.showSetTarget = true;
                    this.currentEditSale = row;
                    return
                }
                this.showSetTarget = false;
                if(this.targetVaule === ''){
                    this.messageFun('warning','目标金额不能为空！')
                    return
                }
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    target: Number(this.targetVaule),
                    suID: this.currentEditSale.uID,
                }
                // console.log('设置销售目标参数',params)
                api.postApi(this.apiVar.report + '/SaveOrUpdateUserTarget', params).then(res=>{
                    console.log('设置销售目标',res)
                    if(res.data.SysCode === 200200 || res.data.MSG === "操作成功"){
                        this.messageFun('success',res.data.MSG)
                        this.getRankList()
                    }else{
                        this.messageFun('warning',res.data.MSG)
                    }
                })
            },
            // 获取浏览器session数据及权限设置
            getsessionData() {
                this.sessionData = sessFun.getSess();
                if (this.sessionData.asrID === '999') {
                    this.isPlatform = true
                } else {
                    this.isPlatform = false
                }
                let companyList = ['999','1','2','3','4','5','6','7']
                for (let key of companyList) {
                    if (key == this.sessionData.asrID) {
                        this.isRetailCompany = true
                        break
                    }
                }
                this.userInfo.avator = this.sessionData.headPic || require('../../assets/images/index/headimg.png')
                this.userInfo.role = this.sessionData.uType;
                this.userInfo.userName = this.sessionData.realName
                this.userInfo.endTime = timeFormat.returnDayCount(-1,'-')
                // 本季度荣誉
                if(this.isRetailCompany) {
                    for(let key of this.honorImg){
                        if (key.asrID == this.sessionData.asrID) {
                            this.companyHonor.push({
                                asrID: key.asrID,
                                url: key.url,
                                title: key.title,
                                flag: true
                            })
                        } else {
                            this.companyHonor.push({
                                asrID: key.asrID,
                                url: key.urlFalse,
                                title: key.title,
                                flag: false
                            })
                        }
                    }
                }
            },
            // 根据所属公司权限调用接口
            getDataByAsrID(){
                if (this.isRetailCompany) {
                    // 直营公司收入排名(超级运营排行弹窗) GetPdIncomeCount
                    // let nowDate = timeFormat.toDate(new Date(), '/');
                    // if(indexIsDateFirst.getIsFirst(this.sessionData.uID, nowDate)){
                        this.getPdIncomeCountByID()
                    // }
                    // 获取月订单数及订单金额总数
                    let endTime = timeFormat.returnMonthCount(0, '-')
                    // 判断当前日期是否为每月的1号
                    let nowDay = endTime.substring(8, 10)
                    // console.log('endTime', endTime, nowDay)
                    // 今天为当月1号则获取上一个月份的数据
                    if (nowDay == '01') {
                        this.isOneDay = true
                        this.nowMonth = timeFormat.returnMonthCount(1, '-').substring(0, 7)
                    } else {
                        // 记录当前的月份 eg：2020-09
                        this.isOneDay = false
                        this.nowMonth = endTime.substring(0, 7)
                    }
                    // console.log('this.nowMonth', this.nowMonth)
                    //　订单金额初始化日期
                    this.turnoverDateMonth = [this.nowMonth]
                    this.amountForm.compareMonth.compareSourceDate = this.nowMonth
                    // 获取上周六为默认周选时间,周六到周五为一周
                    let tempWeekSort = [0, 1, 2, 3, 4, 5, 6],
                        rangeWithSaturday = tempWeekSort[(new Date().getDay() + 1)%7] ;
                    this.amountForm.compareWeek.compareSourceDate = new Date(new Date(new Date().getTime() - 3600*24*(7+rangeWithSaturday)*1000))
                    //　订单数量初始化日期
                    this.orderDateMonth = [this.nowMonth]
                    // 表头日期
                    this.DateMonth = [this.nowMonth]
                    // 成交金额接口
                    this.getDirectSales()
                    this.setOrderCountData(this.nowMonth, false)
                }
                // 是否平台商
                // if (this.isPlatform) {
                    // 业绩排行
                    // this.setBDonRunway()
                // }
            },
            // 获取直营公司列表
            getDirectSales(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token
                }
                api.getApi(this.apiVar.report + '/api/v2/listDirectList',params).then(res=>{
                    if (res.data.SysCode === 200200) {
                        this.listDirectList = res.data.data;
                        this.setOrderIncomeData()
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                }).catch(err=>{
                    console.log('err', err)
                })
            },
            // 动态修改图表的宽度
            realTimeChangeEcharteWidth(){
                if (this.activeTabsName === 'order' || this.activeTabsName === 'price') {
                    let width = document.getElementsByClassName('SM_order_price')[0].offsetWidth
                    document.getElementById('orderBar').style.width = width + 'px'
                    document.getElementById('turnoverBar').style.width = width + 'px'
                    this.orderEcharts.resize()
                    this.turnoverEcharts.resize()
                }
                /* if (this.isPlatform){
                    销售头像在跑道前进的位置
                    this.locationOnRunway()
                } */
            },
            // 直营公司收入排名(超级运营排行弹窗)
            getPdIncomeCountByID(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token
                }
                api.getApi(this.apiVar.report + '/GetPdIncomeCount',params).then(res=>{
                    // console.log('直营公司收入排名',res)
                    let dataArr = res.data.data
                    if(res.data.SysCode == 200200 && Array.isArray(dataArr) && dataArr.length > 2){
                        dataArr.sort((a, b)=>{
                            return b.total - a.total;
                        })
                        let tempArr = [
                            {city:'北京',asrID: '1',url: require('../../assets/images/index/beijing.png')},
                            {city:'上海',asrID: '2',url: require('../../assets/images/index/shanghai.png')},
                            {city:'广州',asrID: '3',url: require('../../assets/images/index/guangzhou.png')},
                            {city:'深圳',asrID: '4',url: require('../../assets/images/index/shenzhen.png')},
                            {city:'成都',asrID: '5',url: require('../../assets/images/index/chengdu.png')},
                            {city:'重庆',asrID: '6',url: require('../../assets/images/index/chongqing.png')},
                            {city:'天津',asrID: '7',url: require('../../assets/images/index/tianjing.png')}
                        ]
                        let indexArr = [1, 0, 2];
                        for (let i = 0; i < dataArr.length; i++) {
                            if (this.sessionData.asrID == dataArr[i].asrId) {
                                this.cityRank = i*1 + 1
                                if(i === dataArr.length - 1) {
                                    indexArr = [dataArr.length - 3, dataArr.length - 1, dataArr.length - 2]
                                } else if(i > 0){
                                    indexArr = [i - 1, i, i + 1]
                                }
                                break
                            }
                        }
                        indexArr.forEach((item, index)=>{
                            let temp = this.showCityRankingImg[index]
                            temp.city = tempArr[dataArr[item].asrId-1].city
                            temp.ranking = item*1+1
                            temp.url = tempArr[item].url
                        })
                        if(indexIsDateFirst.getIsFirst(this.sessionData.uID, timeFormat.toDate(new Date(), '/'))){
                            this.animateFun()
                        }
                    } else {
                        this.messageFun('warning','城市月季排行暂无数据')
                    }
                })
            },
            // 根据公司id返回城市名称及图片地址 rankingImg
            // returnCityData(asrID) {
            //     for(let key of this.rankingImg){
            //         if(asrID == key.asrID){
            //             return {city: key.city, url: key.url}
            //         }
            //     }
            // },
            //超级运营顶部内容详情
            getHeaderData(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token
                }
                api.getApi(this.apiVar.report + '/GetSMOverview',params).then(res=>{
                    // console.log('超级运营顶部内容详情',res)
                    let resData = res.data.data;
                    if(res.data.SysCode == 200200 && resData ){
                        this.dataArr[0].data = resData.companyCount
                        this.dataArr[1].data = resData.apCount
                        this.dataArr[2].data = Math.floor(resData.pdTotal / 100)
                    } else {
                        this.messageFun('warning','暂无数据')
                    }
                })
            },
            // 图表tabs切换
            tabHandleClick(tab, event){
                this.activeTabsName = tab.name
                if (this.activeTabsName === 'price'){
                    this.DateMonth = this.turnoverDateMonth.concat()
                    this.realTimeChangeEcharteWidth()
                }else if (this.activeTabsName === 'order'){
                    this.DateMonth = this.orderDateMonth.concat()
                    this.realTimeChangeEcharteWidth()
                }
            },
            // 对比checkbox
            compareRadio() {
                if(this.amountForm.periodType == 'compareWeek') {
                    if (this.turnoverCompare) {
                        // 判断是否勾选
                        this.changeMonthToCompare('end')
                    } else {
                        this.turnoverDataShow.compareData = []
                        this.amountForm.compareWeek.compareTargetDate = ''
                        this.setTurnoverBar()
                    }
                } else {
                    // 按月
                    if (this.turnoverCompare) {
                        // 判断是否勾选
                        this.changeMonthToCompare('end')
                    } else if(this.activeTabsName == 'order') {
                        this.DateMonth[1] = ''
                        this.orderDateMonth[1] = ''
                        this.orderDataShow.compareDataByDate = []
                        this.setOrderBar()
                    } else {
                        this.turnoverDataShow.compareData = []
                        this.amountForm.compareMonth.compareTargetDate = ''
                        this.setTurnoverBar()
                    }
                }
            },
            // 成交金额/订单数 - 月份对比方法
            changeMonthToCompare(comefrom) {
                if (this.activeTabsName === 'price') {
                    let tempPeriodType = this.amountForm.periodType,
                        tempCompareSourceDate = this.amountForm[tempPeriodType].compareSourceDate,
                        tempCompareTargetDate = this.amountForm[tempPeriodType].compareTargetDate;
                    // 周对比时，返回的时间戳不一定是用户所点击的那天
                    if (tempCompareSourceDate == tempCompareTargetDate || (this.amountForm.periodType == 'compareWeek' && this.$refs.weekSource.displayValue == this.$refs.weekTarget.displayValue)) {
                        tempCompareSourceDate && tempCompareTargetDate && this.messageFun('warning', '请选择不一样的时间进行对比')
                    } else if(this.turnoverCompare && tempCompareSourceDate && tempCompareTargetDate || comefrom == 'start') {
                        this.setOrderIncomeData()
                    }
                } else if (this.activeTabsName === 'order'){
                    if (comefrom === 'start'){
                        if (this.DateMonth[0] == this.DateMonth[1]) {
                            this.messageFun('warning', '请选择不一样的月份')
                            this.DateMonth  = this.orderDateMonth.concat()
                        } else {
                            this.setOrderCountData(this.DateMonth[0], false)
                            this.orderDateMonth = this.DateMonth.concat()
                        }
                    }else if (comefrom === 'end'){
                        // 是否已勾选对比
                        if (this.turnoverCompare) {
                            // 判断是否两边月份是否为空
                            if (this.DateMonth[0] && this.DateMonth[1]) {
                                if (this.DateMonth[0] == this.DateMonth[1]) {
                                    this.messageFun('warning', '请选择不一样的月份')
                                    this.DateMonth[1] = timeFormat.returnMonthCount(0, '-')
                                } else {
                                    // let endTime = this.returnDate(this.DateMonth[1])
                                    this.setOrderCountData(this.DateMonth[1], true)
                                    this.orderDateMonth = this.DateMonth.concat()
                                }
                            }
                        } else {
                            // this.messageFun('warning','请勾选对比')
                        }
                    }
                }
            },
            // 成交金额接口 GetOrderIncomeByMonth
            setOrderIncomeData(){
                let portraitInfo = this.listDirectList || [],
                    startDate = this.amountForm.compareMonth.compareSourceDate,
                    endDate = this.amountForm.compareMonth.compareTargetDate,
                    apiUrl = '/report/api/v1/getMonthAscrPrice',
                    params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        startDate: startDate + '-01',
                        endDate: (this.turnoverCompare && endDate) ? (endDate + '-01') : '',
                        asrIds: portraitInfo.map(item=>item.asrId).join(',') || '1,2,3,4,5,6,7'
                    };
                if(this.amountForm.periodType == 'compareWeek') {
                    params.startDate = timeFormat.toDate(new Date(Date.parse(this.amountForm.compareWeek.compareSourceDate) + 3600*24*7*1000)),
                    params.endDate = this.amountForm.compareWeek.compareTargetDate && this.turnoverCompare ? timeFormat.toDate(new Date(Date.parse(this.amountForm.compareWeek.compareTargetDate) + 3600*24*7*1000)) : '',
                    apiUrl = '/report/api/v1/getWeekAscrPrice'
                }
                api.getApi(apiUrl, params).then(res=>{
                    if(res.data.SysCode == 200200){
                        let resData = res.data.data
                        // 将数据转成柱形图所需数组格式
                        let cityName = [],
                            sourceData = {
                                dateMonth: params.startDate || '',
                                nativeContractPrice: [],
                                nativeExecutePrice: [],
                                nativeNationwideExecutePrice: [],
                                nationwideContractPrice: [],
                                nationwideExecutePrice: [],
                                nationwideBillExecutePrice: []
                            },
                            compareData = {
                                dateMonth: params.endDate || '',
                                nativeContractPrice: [],
                                nativeExecutePrice: [],
                                nativeNationwideExecutePrice: [],
                                nationwideContractPrice: [],
                                nationwideExecutePrice: [],
                                nationwideBillExecutePrice: []
                            },
                            beginDateIndex = this.amountForm.periodType == 'compareWeek' ? params.startDate : params.startDate.slice(0,7),
                            endDateIndex = this.amountForm.periodType == 'compareWeek' ? params.endDate : params.endDate.slice(0,7);
                        (resData[beginDateIndex] || []).forEach(item=>{
                            cityName.push(item.name.substring(0, item.name.length-6))
                            // cityName.push(item.name.replace(/(?<=邻).+/, ''));
                            sourceData.nativeContractPrice.push(item.nativeContractPrice);
                            sourceData.nativeExecutePrice.push(item.nativeExecutePrice);
                            sourceData.nativeNationwideExecutePrice.push(item.nativeNationwideExecutePrice);
                            sourceData.nationwideContractPrice.push(item.nationwideContractPrice);
                            sourceData.nationwideExecutePrice.push(item.nationwideExecutePrice);
                            sourceData.nationwideBillExecutePrice.push(item.nationwideBillExecutePrice || 0);
                        });
                        (resData[endDateIndex] || []).forEach(item=>{
                            compareData.nativeContractPrice.push(item.nativeContractPrice);
                            compareData.nativeExecutePrice.push(item.nativeExecutePrice);
                            compareData.nativeNationwideExecutePrice.push(item.nativeNationwideExecutePrice);
                            compareData.nationwideContractPrice.push(item.nationwideContractPrice);
                            compareData.nationwideExecutePrice.push(item.nationwideExecutePrice);
                            compareData.nationwideBillExecutePrice.push(item.nationwideBillExecutePrice || 0);
                        })
                        this.turnoverDataShow = {
                            cityName: cityName.length > 0 ? cityName : portraitInfo.map(item=>item.name.substring(0, item.name.length-6)),
                            sourceData: sourceData,
                            compareData: compareData,
                        };
                        // console.log('this.turnoverDataShow',this.turnoverDataShow)
                        // 销售金额柱状图
                        this.setTurnoverBar()
                        this.priceBoxLoading = false
                    } else {
                        this.messageFun('warning','暂无数据')
                    }
                })
            },
            // 按周或者按月
            switchpPeriodType(val) {
                this.changeMonthToCompare('start')
            },
            // 切换签约额和执行额（单选）
            switchRadioAmount(val) {
                this.setTurnoverBar()
            },
            // 获取订单数量总量增量 GetOrderCountByMonth
            setOrderCountData(endTime,isCompare){
                // console.log('订单数量endTime',endTime)
                let starTimeSub = endTime.substring(0,7) + '-01'
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    // asrIDs: this.returnAsrID(this.sessionData.asrID),
                    onStart: starTimeSub,
                    onEnd: this.returnDate(endTime),
                }
                // console.log('获取订单数量总量接口参数',params)
                api.getApi(this.apiVar.report + '/GetOrderCountByMonth',params).then(res=>{
                    // console.log('订单总数接口',res)
                    if(res.data.SysCode == 200200 && res.data.data){
                        let dataArr = res.data.data
                        let priceData = []
                        let cityName = []
                        let compareDataByDate = []
                        for (let key of dataArr) {
                            if (isCompare) {
                                compareDataByDate.push(key.orderInfo[0].increment)
                            } else {
                                cityName.push(key.asName.substring(0,key.asName.length-6))
                                priceData.push(key.orderInfo[0].increment)
                            }
                        }
                        if (isCompare) {
                            this.orderDataShow.compareDataByDate = compareDataByDate
                        } else {
                            this.orderDataShow.cityName = cityName
                            this.orderDataShow.priceData = priceData
                        }
                        // 订单数柱状图
                        this.setOrderBar()
                    } else {
                        this.messageFun('warning','暂无数据')
                    }
                })
            },
            // 金额图表
            setTurnoverBar() {
                this.turnoverEcharts = this.$echarts.init(this.$refs.turnoverDataBar);
                let that = this
                // 第二个参数为true,不会和之前的option合并
                this.turnoverEcharts.setOption({
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
                            let eleStr = '',
                                tempDateLabel = '<span>' + '时间' + '</span>';
                            if((that.radioAmount === '执行额' && params.length == 8) || (that.radioAmount === '签约额' && params.length == 4)) {
                                let paramsHalfLen = params.length / 2;
                                eleStr = '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 320px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                    '<span>' + '类目' + '</span>' + 
                                    tempDateLabel + 
                                    '<span>' + (that.radioAmount || '') +'</span>' + 
                                    '</p>' + '<br/>';
                                params.forEach((item, index)=>{
                                    let dateMonthStr = ''
                                    if(that.amountForm.periodType == 'compareWeek') {
                                        dateMonthStr = paramsHalfLen < index+1 ? that.$refs.weekTarget.displayValue : that.$refs.weekSource.displayValue;
                                    } else {
                                        dateMonthStr = paramsHalfLen < index+1 ? that.amountForm.compareMonth.compareTargetDate : that.amountForm.compareMonth.compareSourceDate;
                                    }
                                    dateMonthStr = '<span style="flex-grow: 1;">' + dateMonthStr + '</span>';
                                    eleStr += '<p style="display: flex; justify-content: space-between; padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                              '<span style="width: 130px; white-space: nowrap;"><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: ' + item.color + ';margin-right: 5px"></i>' + item.seriesName + '</span>' + 
                                              dateMonthStr + 
                                              that.priceFormat(item.data) + '</p>';
                                })
                            } else {
                                eleStr = '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                    '<span>' + '类目' + '</span>' + '<span>' + (that.radioAmount || '') +
                                    '</span>' + '</p>' + '<br/>';
                                params.forEach(item=>{
                                    eleStr += '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' + 
                                    '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: ' + item.color + ';margin-right: 5px"></i>' + item.seriesName + '</span>' + that.priceFormat(item.data) + '</p>';
                                })
                            }
                            return eleStr;
                        },
                    },
                    legend: {
                        top: 'bottom',
                        left: 'center',
                        icon: 'circle',
                        itemHeight: 8,
                        itemWidth: 8,
                        data: that.radioAmount === '签约额' ? ['本地单签约额', '全国单签约额'] : ['本地单执行额', '本地全国单执行额', '全国单接单执行额', '全国单发单执行额']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '7%',
                        x: 100,     //控制x轴文字与底部的距离
                        y2: 200,    // y2可以控制倾斜的文字与最右边的距离，放置倾斜的文字超过显示区域
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.turnoverDataShow.cityName,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                //坐标轴刻度标签
                                margin: 7, //刻度标签与轴线之间的距离
                                interval: 0,    //强制文字产生间隔
                                // rotate: 25,     //文字逆时针旋转25°
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
                    series: that.radioAmount === '签约额' ?
                    [
                        {
                            color: 'rgba(24, 144, 255, 1)',
                            name: '本地单签约额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.sourceData.nativeContractPrice,
                        },
                        {
                            color: 'rgba(255, 145, 24, 1)',
                            name: '全国单签约额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.sourceData.nationwideContractPrice,
                        },
                        {
                            color: 'rgba(24, 144, 255, 0.35)',
                            name: '本地单签约额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.compareData.nativeContractPrice,
                        },
                        {
                            color: 'rgba(255, 145, 24, 0.35)',
                            name: '全国单签约额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.compareData.nationwideContractPrice,
                        }
                    ]
                    :
                    [
                        {
                            color: 'rgba(24, 144, 255, 1)',
                            name: '本地单执行额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.sourceData.nativeExecutePrice,
                        },
                        {
                            color: 'rgba(19, 194, 194, 1)',
                            name: '本地全国单执行额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.sourceData.nativeNationwideExecutePrice,
                        },
                        {
                            color: 'rgba(250, 140, 22, 1)',
                            name: '全国单接单执行额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.sourceData.nationwideExecutePrice,
                        },
                        {
                            color: 'rgba(82, 196, 26, 1)',
                            name: '全国单发单执行额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.sourceData.nationwideBillExecutePrice,
                        },
                        {
                            color: 'rgba(24, 144, 255, 0.35)',
                            name: '本地单执行额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.compareData.nativeExecutePrice,
                        },
                        {
                            color: 'rgba(19, 194, 194, 0.35)',
                            name: '本地全国单执行额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.compareData.nativeNationwideExecutePrice,
                        },
                        {
                            color: 'rgba(250, 140, 22, 0.35)',
                            name: '全国单接单执行额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.compareData.nationwideExecutePrice,
                        },
                        {
                            color: 'rgba(82, 196, 26, 0.35)',
                            name: '全国单发单执行额',
                            type: 'bar',
                            barWidth: '5%',
                            data: this.turnoverDataShow.compareData.nationwideBillExecutePrice,
                        }
                    ]
                }, true);
                window.addEventListener("resize", ()=> {
                    this.turnoverEcharts.resize();
                })
            },
            // 订单数柱状图
            setOrderBar() {
                this.orderEcharts = this.$echarts.init(this.$refs.orderDataBar);
                this.orderEcharts.setOption({
                    title: {
                        text: '订单数',
                        textStyle: {      // 主标题
                            "fontSize": 14,
                            "fontWeight": 'bolder',
                            "color": '#000'
                        },
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
                            if (params.length >= 2) {
                                return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                    '<span>' + '时间' + '</span>' + '<span>' + '数值' +
                                    '</span>' + '</p>' + '<br/>' +
                                    '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                    '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params[0].seriesName + '</span>' + params[0].data + '</p>' + '</br>' +
                                    '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-top: -20px">' +
                                    '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #BDDEFD;margin-right: 5px"></i>' + params[1].seriesName + '</span>' + params[1].data + '</p>'
                            } else {
                                return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                    '<span>' + '时间' + '</span>' + '<span>' + '数值' +
                                    '</span>' + '</p>' + '<br/>' +
                                    '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; ">' +
                                    '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + params[0].seriesName + '</span>' + params[0].data + '</p>'
                            }
                        },
                    },
                    legend: {
                        top: 'bottom',
                        left: 'center',
                        data: this.orderDateMonth
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '7%',
                        x: 100,     //控制x轴文字与底部的距离
                        y2: 200,    // y2可以控制倾斜的文字与最右边的距离，放置倾斜的文字超过显示区域
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.orderDataShow.cityName,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                //坐标轴刻度标签
                                margin: 7, //刻度标签与轴线之间的距离
                                interval: 0,    //强制文字产生间隔
                                // rotate: 25,     //文字逆时针旋转25°
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
                            name: this.orderDateMonth[0],
                            type: 'bar',
                            barWidth: '10%',
                            data: this.orderDataShow.priceData,
                        },
                        {
                            color: '#BDDEFD',
                            name: this.orderDateMonth[1],
                            type: 'bar',
                            barWidth: '10%',
                            data: this.orderDataShow.compareDataByDate,
                        }
                    ]
                }, true);
            },
            // 设置销售目标 SaveOrUpdateUserTarget
            setSalerTarget(row){
                console.log('行数据',row)
                if(row.inputValue === ''){
                    this.messageFun('warning','目标金额不能为空！')
                    return
                }else if(!Number(row.inputValue) || Number(row.inputValue) < 0){
                    this.messageFun('warning','请输入数字金额（正数）！')
                    return
                }
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    target: Number(row.inputValue) * 10000 * 100,
                    suID: row.uID,
                }
                // console.log('设置销售目标参数',params)
                api.postApi(this.apiVar.report + '/SaveOrUpdateUserTarget', params).then(res=>{
                    console.log('设置销售目标',res)
                    if(res.data.SysCode === 200200 || res.data.MSG === "操作成功"){
                        this.messageFun('success',res.data.MSG)
                        row.setBtn = false
                        row.targetAmount = params.target / 100
                        row.progressBar = row.targetAmount ? Number(((row.salesAmount / row.targetAmount ) * 100).toFixed(0)) : 0
                    }else{
                        this.messageFun('warning',res.data.MSG)
                    }
                })
            },
            // 开场动画
            animateFun(){
                this.isMonthlyRanking = true
                // 头部主标题
                $(".monthly_ranking_title").animate({
                    top: '-10px',
                    opacity: 1,
                }, 400, ()=> {
                    $(".monthly_ranking_title").animate({
                        top: '0px',
                    }, 150)
                })
                // 中间主图
                let time1 = setTimeout(()=>{
                    $("#meiddle").animate({
                        left: '47px',
                        height: '162px',
                        width: '162px',
                    }, 400, ()=> {
                        $("#meiddle").animate({
                            height: '152px',
                            width: '152px',
                        }, 150, ()=> {
                            // 左边喇叭
                            document.getElementById('second_img_left').style.display = 'block'
                            $("#second_img_left").animate({
                                left: '0px'
                            },200,)
                            // 右边喇叭
                            document.getElementById('second_img_right').style.display = 'block'
                            $("#second_img_right").animate({
                                right: '-3px'
                            },200,()=>{
                                // 底下城市名称背景图
                                document.getElementById('second_img_name').style.display = 'block'
                                $("#second_img_name").animate({
                                    top: '114px'
                                },200,()=>{
                                    // 左边花
                                    document.getElementById('second_top_left').style.display = 'block'
                                    $("#second_top_left").animate({
                                        top: '-20px'
                                    },200,()=>{
                                        // 右边花
                                        document.getElementById('second_top_right').style.display = 'block'
                                        $("#second_top_right").animate({
                                            top: '-22px'
                                        },200)
                                    })
                                })
                                // 底下城市名称
                                document.getElementById('second_city_name').style.display = 'block'
                                $("#second_city_name").animate({
                                    top: '115px'
                                },200,()=>{
                                    //  底部名次
                                    $(".second_ranking_num").animate({
                                        bottom: '-25px',
                                        opacity: 1
                                    },100)
                                })
                            })
                        })
                    })
                    clearTimeout(time1)
                },550)
                // 左边动画 first_box three_box
                let time2 = setTimeout(()=>{
                    // 左边动画
                    document.getElementById('first_box').style.display = 'block'
                    $("#first_box").animate({
                        bottom: '20px'
                    }, 300, () => {
                        $("#first_box").animate({
                            bottom: '0px'
                        }, 100,)
                    })
                    // 右边动画
                    document.getElementById('three_box').style.display = 'block'
                    $("#three_box").animate({
                        bottom: '20px'
                    }, 300, () => {
                        $("#three_box").animate({
                            bottom: '0px'
                        }, 100, () => {
                            // 底部按钮
                            $(".monthly_ranking_bottom_btn").animate({
                                bottom: '0px',
                                opacity: 1
                            },150)
                           // 左边名次
                            $(".first_ranking_num").animate({
                                bottom: '-3px',
                                opacity: 1
                            },150)
                            // 右边名次
                            $(".three_ranking_num").animate({
                                bottom: '-3px',
                                opacity: 1
                            },150)
                        })
                    })
                    clearTimeout(time2)
                },1750)
            },
            // 根据权限公司返回 asrIDs
            returnAsrID(asrID){
                if (asrID == '999') {
                    return '1,2,3,4,5,6,7'
                } else {
                    return asrID
                }
            },
            // 判断是否为当前月份并返回 年-月-日
            returnDate(time){
                if (this.nowMonth == time) {
                    let monthDay = timeFormat.returnMonthCount(0, '-')
                    if (this.isOneDay) {
                        // 返回前一天
                        return timeFormat.returnDayCount(-1, '-')
                    } else {
                        return monthDay
                    }
                } else {
                    let dateList = time.split('-')
                    let dayNum = new Date(Number(dateList[0]), Number(dateList[1]), 0);
                    // console.log(dateList,'判断是否为当前月份并返回', dayNum.getDate());
                    return time + '-' + dayNum.getDate()
                }
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
            // 数据大到小排序
            // compareSort(property) {
            //     return function (a, b) {
            //         let value1 = a[property];
            //         let value2 = b[property];
            //         return value2 - value1;
            //     }
            // },
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
            // 应用中心的展开和收起
            slideAppCenterItem() {
                this.isSlideDown = !this.isSlideDown
                if(!this.isSlideDown){
                    this.uploadEvent(1)
                }

            },
            // 应用中心跳转
            goToPage(item) {
                if (item) {
                    this.uploadEvent(2,item.name)
                    item.descTooltip = false
                    window.open(item.link, '_blank')
                } else {
                    this.uploadEvent(2,'home')
                    window.open('https://apps.qinlinad.com', '_blank')
                }
            },
            getUuid() {
                let s = [];
                let hexDigits = "0123456789abcdef";
                for (let i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";
                let uuid = s.join("");
                return uuid;
            },
            // 用户中心事件上报 1展示2点击
            uploadEvent(type,name){
                this.$nextTick(function() {
                    //用户中心渲染完成
                    // console.log('用户中心渲染完成')
                    let params = []
                    if(type==1){
                        //展现
                        for(let i=0;i<this.appCenter.length;i++){
                            if(this.isSlideDown){
                                if(i<8){
                                    let obj = {
                                        "userId":this.sessionData.uID,
                                        "behaviorTime":timeFormat.toDateTime(new Date()),
                                        "componentName":this.appCenter[i].name,
                                        "requestId":this.getUuid(),
                                        "type":type
                                    }
                                    params.push(obj)
                                }
                            }else{
                                if(i>7){
                                    let obj = {
                                        "userId":this.sessionData.uID,
                                        "behaviorTime":timeFormat.toDateTime(new Date()),
                                        "componentName":this.appCenter[i].name,
                                        "requestId":this.getUuid(),
                                        "type":type
                                    }
                                    params.push(obj)
                                }
                            }
                        }
                    }else{
                        //点击
                        let obj = {
                            "userId":this.sessionData.uID,
                            "behaviorTime":timeFormat.toDateTime(new Date()),
                            "componentName":name,
                            "requestId":this.getUuid(),
                            "type":type
                        }
                        params.push(obj)
                    }
                    api.postApi(this.apiVar.UCAPI+'/UserStaticReport',{userStatics:JSON.stringify(params)}).then(res=>{
                        // console.log('UserStaticReport---',res.data);
                    })
                });
            }
        }
    };

</script>

<style>
.amount-tooltip {
    max-width: unset !important;
}
.index-custom-popper {
    min-height: 92px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 0px 10px 0px rgba(174, 174, 174, 0.65);
    border-radius: 2px;
    padding: 8px;
}
</style>
<style scoped lang="scss">
/** 新增*/
    .next-text {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 38px;
    }
    .capsule {
        position: absolute;
        left: 0;
        box-sizing: border-box; border: 1px solid #E9E9E9; -moz-border-radius:160px 0 0 160px;-webkit-border-radius:160px 0 0 160px;border-radius:160px;width:auto;height:320px;
    }
    .capsule-right{box-sizing: border-box; border: 1px solid #E9E9E9; -moz-border-radius:0 160px 160px 0;-webkit-border-radius:0 160px 160px 0;border-radius:0 160px 160px 0;width:auto;height:320px;}
    
    .capsule-left {
        box-sizing: border-box; border: 1px solid #E9E9E9; -moz-border-radius:160px 0 0 160px;-webkit-border-radius:160px 0 0 160px;border-radius:160px 0 0 160px;width:auto;height:320px;
    }
    .index-top-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 24px;
        .left-layout {
            display: flex;
            flex: 1;
            width: 75%;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            margin-right: 24px;
            .card-group {
                position: relative;
                height: 428px;
                width: 100%;
                margin-top: 24px;
            }
        }
        .right-board {
            width: calc(25% - 24px);
            height: 582px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid #E6E7E9;
        }
    }
    /deep/ .client-table .el-table__body {
        width: inherit !important;
    }
    /deep/ .el-table__body-wrapper {
        overflow-y: hidden;
        overflow-x: hidden;
    }
    /deep/ .el-table__body-wrapper:hover {
        overflow-y: auto;
        overflow-x: hidden;
    }
    .index-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
        & > div {
            // flex: 1;
        }
        .date-interval {
            margin: 0 24px 0 auto;
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.45);
            line-height: 20px;
            cursor: pointer;
            span {
                margin: 0 8px;
            }
            .active {
                font-weight: 600;
                color: rgba(24, 144, 255, 1);
            }
        }
        .achievement-radio-group {
            /deep/ .el-radio-button__inner {
                width: 88px;
                font-size: 14px;
            }
        }
        .item-list {
            height: 100%;
            padding: 16px 24px;
            box-sizing: border-box;
            .item {
                display: flex;
                align-items: center;
                padding: 9px 0;
                .progress {
                    flex: 1;
                    cursor: pointer;
                }
                .label {
                    width: 56px;
                    height: 20px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-right: 8px;
                    line-height: 20px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: rgba(0, 0, 0, 0.65);
                }
            }
        }
    }
    .bottom-box {
        position: absolute;
        height: 48px;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0 24px 32px;
        line-height: 48px;
        text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
        background: #F8F8F8;
        border-radius: 2px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.85);
        .avtive {
            font-weight: 600;
            color: #1890FF;
        }
    }
    .stock-chart {
        display: flex; 
        justify-content: center;
        width: 600px;
        height: 320px;
        margin: 36px auto;
        box-sizing: border-box;
        border: 1px solid #E9E9E9; 
        -moz-border-radius:160px;
        -webkit-border-radius:160px;
        border-radius:160px;
        overflow: hidden;
    }
    .coordinate-line {
        width: 550px;
        height: 1px;
        position: relative;
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        margin: 17px auto;
        padding: 0 25px;
        background: #E8E8E8;
        .sub-line {
            position: relative;
            width: 1px;
            height: 6px;
            background: #E8E8E8;
            .sub-text {
                position: absolute;
                display: block;
                transform: translateX(-50%);
                margin-top: 4px;
                line-height: 22px;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.45);
                white-space: nowrap;
            }
        }
    }
    .tip-box {
        border-radius: 2px;
        line-height: 16px;
        font-size: 12px;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        .pop-title {
            display: flex;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(216, 216, 216, .65);
            color: rgba(0, 0, 0, 0.85);
            .target-btn {
                margin: 0 0 2px auto;
                color: rgba(24, 144, 255, 1);
                cursor: pointer;
            }
            .bottom-btn {
                width: 64px;
                height: 24px;
                line-height: 24px;
                margin: 8px auto 2px auto;
                border: 1px solid #1890FF;
                border-radius: 2px;
                text-align: center;
                font-size: 12px;
                color: rgba(24, 144, 255, 1);
                cursor: pointer;
            }
        }
        ul {
            padding-top: 3px;
        }
        .pop-item {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            color: rgba(0, 0, 0, 0.65);
            .align-right {
                margin: 0 16px 0 auto;
            }
            .tip-rate {
                width: 45px;
            }
        }
    }
    .pop-box {
        border-radius: 2px;
        line-height: 16px;
        font-size: 12px;
        font-weight: 400;
        font-family: PingFangSC-Regular, PingFang SC;
        .pop-title {
            display: flex;
            color: rgba(0, 0, 0, 0.85);
            .target-btn {
                margin: 0 0 2px auto;
                color: rgba(24, 144, 255, 1);
                cursor: pointer;
            }
            .bottom-btn {
                width: 64px;
                height: 24px;
                line-height: 24px;
                margin: 8px auto 2px auto;
                border: 1px solid #1890FF;
                border-radius: 2px;
                text-align: center;
                font-size: 12px;
                color: rgba(24, 144, 255, 1);
                cursor: pointer;
            }
        }
        .pop-item {
            display: flex;
            // justify-content: space-between;
            margin: 2px 0;
            color: rgba(0, 0, 0, 0.65);
            .item-right {
                margin-left: 4px;
            }
        }
    }

    /deep/ .target-dialog {
        .el-dialog__header {
            height: 24px;
            padding: 16px 24px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            line-height: 24px;
        }
        .el-dialog__body {
            padding: 0 24px 24px;
            .el-form-item {
                margin: 0;
                .el-form-item__content {
                    line-height: unset;
                    .el-input-number--small {
                        width: 100%;
                        .el-input-group__prepend {
                            padding: 0 12px;
                        }
                        .el-input__inner {
                            text-align: left;
                        }
                    }
                }
            }
        }
        .el-dialog__footer {
            padding: 0 24px 24px;
        }
        .el-input-number .el-input {
            display: inline-table;
        }
    }
 /**新增 */
    .ad_index_container{
        margin: 24px 60px;
        height: auto;
    }
    /*常用模块*/
    .platFrom_use_module{
        width: 100%;
    }
    .use_module{
        width: 66%;
    }
    .h2_style{
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(0,0,0,0.85);
        background: #fff;
        font-size: 16px;
        font-weight: bold;
        height: 52px;
        line-height: 52px;
        padding-left: 24px;
        border-bottom: 1px solid #ececec;
    }
    /*勋章墙*/
    .loglist_box{
        padding: 10px 24px 0;
        height:138px;
        overflow-x:hidden;
        overflow-y:auto;
    }
    .loglist_box::-webkit-scrollbar {
        width: 4px;
        background: #fafafa;
    }
    .loglist_box::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        background: #c1c1c1;
        border-radius: 4px;
    }
    .info_box img{
        margin-right: 8px;
        width: 51px;
        height: 59px;
    }
    .nothing_info{
        color: rgba(0,0,0,0.85);
    }
    .SM_order_price{
        background: #fff;
        margin-bottom: 40px;
        position: relative;
    }
    /deep/ .SM_order_price .el-tabs__nav-scroll{
        padding-left: 40px;
        line-height: 52px;
        font-size:16px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(24,144,255,1);
    }
    /deep/ .SM_order_price .el-tabs__item{
        font-size:16px;
    }
    /deep/ .SM_order_price .el-tabs__content{
        padding: 9px 24px 24px 24px;
        height: calc(100% - 67px);
        box-sizing: border-box;
        .el-tab-pane {
            height: 100%;
        }
    }

    /deep/ .question-popover2 {
        width: 352px;
        height: 54px;
        background: rgba(0, 0, 0, 0.75);
        box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
    }

    .quesition-icon {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        vertical-align: middle;
        filter: brightness(0.75);
    }

    .turnover_charts {
        height: 507px;
    }
    .order_charts{
        height: 543px;
    }
    /deep/ .el-tabs__nav-wrap::after{
        height: 1px;
    }
    /*时间组件*/
    .order_price_date{
        position: absolute;
        right: 32px;
        top:12px;
        z-index: 99;
    }
    .order_price_date /deep/ .el-picker-panel.el-date-picker.el-popper {
        position: absolute;
    }
    /deep/ .order_price_date .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width: 140px;
    }
    /* 按周或按月单选 */
    .radio-period-type {
        margin-right: 20px;
    }
    /*业绩跑道*/
    .SM_results_runway{
        height: 608px;
        width: 100%;
        background: #fff;
        border: 1px solid #e5e6e9;
    }
    .results_runway_title{
        font-family:PingFangSC-Medium;
        height: 56px;
        line-height: 56px;
        border-bottom: 1px solid #E9E9E9;
    }
    .results_runway_title_h2{
        width: 60%;
        float: left;
        padding-left: 40px;
        font-size:16px;
        font-weight:600;
        color:rgba(0,0,0,0.85);
    }
    .results_runway_title_box{
        position: relative;
    }
    .results_runway_title_trophy{
        width: 14px;
        height: 14px;
        position: absolute;
        top: 22px;
        right: 76px;
    }
    .results_runway_main{
        padding: 24px 50px 24px 24px;
        position: relative;
    }
    .results_runway_destination{
        position: absolute;
        right: 20px;
        top: 23px;
        z-index: 99;
    }
    .results_runway_destination img{
        height: 498px;
        width: auto;
    }
    .runway_price{
        text-align: center;
        font-size:16px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .runway_conten{
        margin-top: 15px;
        background:rgba(180,89,89,1);
        color: #fff;
        font-size:28px;
    }
    .runway_conten_tr{
        border-bottom: 1px solid #fff;
    }
    .runway_conten_td{
        height: 50px;
        line-height: 50px;
    }
    .runway_td_1,.runway_td_21{
        text-align: center;
        border-top: 1px solid #fff;
        transform:rotate(90deg);
        -ms-transform:rotate(90deg); 	/* IE 9 */
        -moz-transform:rotate(90deg); 	/* Firefox */
        -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
        -o-transform:rotate(90deg);
    }
    .runway_td_21{
        border-bottom: 1px dashed #fff;
    }
    .saler_img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: 7px;
        position: relative;
        box-shadow:0px 2px 4px 0px rgba(0,0,0,0.3);
        border:2px solid rgba(255,255,255,1)
    }
    /*业绩排行弹出框*/
    /deep/ .el-dialog__body{
        padding-top: 10px;
    }
    /deep/ .el-dialog__title{
        font-size:16px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(48,49,51,1);
    }
    .performance_table{
        border: 1px solid rgb(233,233,233);
    }
    .performance_table_btn{
        color: #1890FF;
        font-size:14px;
        cursor: pointer;
    }
    /deep/ .performance_table .el-table__body-wrapper{
        overflow-y: auto;
        overflow-x: hidden;
    }
    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background: #FAFAFA;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }
    /deep/ .performance_table .el-table thead th{
        background: #E9E9E9;
        color:rgba(0,0,0,0.65);
        font-size:14px;
        font-weight: bold;
    }
    /deep/ .performance_table .el-table td, .el-table th{
        padding: 8px 0;
        color:rgba(0,0,0,0.65);
    }
    .performance_table /deep/ .el-table__row td:nth-child(3),
    .performance_table /deep/ .el-table__row td:nth-child(4){
        text-align: right;
    }
    .performance_table /deep/ .has-gutter th:nth-child(3),
    .performance_table /deep/ .has-gutter th:nth-child(4){
        text-align: right;
    }
    /*进度条*/
    /deep/ .el-progress__text{
        color:rgba(0,0,0,0.65);
        font-size:14px;
    }
    /deep/ .el-progress-bar{
        width: 95%;
    }

    /*设置销售目标金额*/
    .performance_table_set_box{
        margin-bottom: 12px;
        position: relative;
    }
    .performance_table_set_box h3{
        font-size:15px;
        font-weight:600;
        color:rgba(0,0,0,0.85);
        margin-bottom: 12px;
    }
    .performance_table_set_box_rmb{
        position: absolute;
        font-size: 14px;
        top:40px;
        left: 3px;
        color: rgba(0,0,0,0.45);
    }
    .performance_table_set_box_unit{
        position: absolute;
        font-size: 14px;
        top:40px;
        right: 3px;
        color: rgba(0,0,0,0.45);
    }
    /*城市月季排行*/
    .monthly_ranking{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 998;
        background:rgba(0,0,0,0.3);
    }
    .monthly_ranking_box{
        width: 720px;
        margin: 190px auto;
        height: 470px;
        /*border: 1px solid #fff;*/
    }
    .monthly_ranking_title{
        position: relative;
        margin: 0 auto;
        text-align: center;
        top:70px;
        opacity: 0;
    }
    .monthly_ranking_title img{
        width: 389px;
        height: 152px;
    }
    .monthly_ranking_city{
        position: relative;
        margin-top: 32px;
        height: 160px;
    }
    /*顶部花*/
    .monthly_ranking_img_top_left,.monthly_ranking_img_top_right{
        position: absolute;
        z-index: 999;
    }
    .monthly_ranking_img_left{
        position: absolute;
        left: 0;
    }
    .monthly_ranking_img_meiddle{
        position: absolute;
        left: 47px;
        width: 126px;
        height: 126px;
        z-index: 1000;
    }
    .monthly_ranking_img_right{
        position: absolute;
        right: 8%;
    }
    /*底部名次*/
    .ranking_num{
        position: absolute;
        color: #fff;
        letter-spacing: 8px;
        font-size: 18px;
        /*display: none;*/
    }
    .monthly_ranking_img_bottom{
        position: absolute;
        z-index: 1001;
        top: 90px;
        width: 142px;
        left: 40px;
    }
    .monthly_ranking_city_name{
        position: absolute;
        z-index: 1001;
        color: #fff;
        font-size:18px;
        font-weight: bold;
        letter-spacing:5px;
    }
    /*左边城市名称*/
    .city_name_left{
        bottom: 45px;
        left: 88px;
    }
    /*左边*/
    #first_box{
        display: none;
        position: absolute;
        height: 160px;
        width: 100%;
        bottom: -120px;
    }
    .monthly_ranking_content_first .monthly_ranking_img_top_left{
        top:-26px;
        left: 53px;
    }
    .monthly_ranking_content_first .monthly_ranking_img_top_right{
        right: 66px;
        top: -27px;
    }
    .first_ranking_num{
        /*bottom: -3px;*/
        bottom: -30px;
        left: 75px;
        opacity:0 ;
    }
    /*中间*/
    .monthly_ranking_content_second .monthly_ranking_img_meiddle{
        left: 100px;
        width: 0;
        height: 0
    }
    .monthly_ranking_content_second .monthly_ranking_img_left{
        display: none;
        left: 40px;
    }
    .monthly_ranking_content_second .monthly_ranking_img_right{
        right: 30px;
        top: 1px;
        display: none;
    }
    .monthly_ranking_content_second .monthly_ranking_img_bottom{
        top: 180px;
        display: none;
        left: 53px;
    }
    .city_name_meiddle{
        left: 103px;
        top: 180px;
        display: none;
    }
    .monthly_ranking_content_second .monthly_ranking_img_top_left{
        left: 58px;
        display: none;
        top: -50px;
    }
    .monthly_ranking_content_second .monthly_ranking_img_top_right{
        right: 45px;
        top: -50px;
        display: none;
    }
    .second_ranking_num{
        bottom: -50px;
        left: 88px;
        opacity: 0;
    }
    /*右边*/
    #three_box{
        display: none;
        position: absolute;
        height: 160px;
        width: 100%;
        bottom: -120px;
    }
    .monthly_ranking_content_three .monthly_ranking_img_top_left{
        top:-22px;
        left: 75px;
    }
    .monthly_ranking_content_three .monthly_ranking_img_top_right{
        right: 40px;
        top: -28px;
    }
    .monthly_ranking_content_three .monthly_ranking_img_meiddle{
        left: 30%;
    }
    .monthly_ranking_content_three .monthly_ranking_img_left{
        left: 25px;
        top: 0
    }
    .monthly_ranking_content_three .monthly_ranking_img_right{
        right: -3px;
    }
    .monthly_ranking_content_three .monthly_ranking_img_bottom{
        left: 64px;
    }
    .monthly_ranking_bottom{
        color: #FFD424;
        text-align: center;
        margin-top: 48px;
    }
    .monthly_ranking_bottom_btn{
        position: relative;
        margin: 0 auto;
        width: 102px;
        height: 34px;
        line-height: 34px;
        background: #F25A5A;
        border-radius: 3px;
        cursor: pointer;
        z-index: 999;
        bottom: -50px;
        opacity: 0;
    }
    .city_name_right{
        bottom: 45px;
        left: 114px;
    }
    .three_ranking_num{
        bottom: -30px;
        left: 100px;
        opacity: 0;
    }
    @media screen and (min-width: 1440px){
        .turnover_charts,.order_charts{
            width: 1270px;
        }
    }
    @media screen and (min-width: 1900px){
        .turnover_charts,.order_charts{
            width: 1700px;
        }
    }
</style>
