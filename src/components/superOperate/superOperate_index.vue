<template>
  <div>
    <div class="ad_index_container">
        <!-- <home-top :user-info="userInfo" :data-arr="dataArr" :honor-img="companyHonor"></home-top> -->
        <personal-info :user-info="userInfo" :honor-img="companyHonor"></personal-info>
        <div style="margin:24px 0;display:flex">
            <!--isPlatform-->
            <div :class="isPlatform ? 'use_module' : 'platFrom_use_module'" style="border: 1px solid #e5e6e9;">
                <h2 class="h2_style">常用模块</h2>
                <home-link :link="linkArr"></home-link>
            </div>
            <div v-if="isPlatform" style="width:33%; margin-left:24px;background:#fff;border: 1px solid #e5e6e9;">
                <h2 class="h2_style">勋章墙</h2>
                <div class="loglist_box">
                    <div class="info_box">
                        <img v-for="(key,index) of companyHonor" :src="key.url" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="app-center-item" id="appCenter">
            <!--isPlatform-->
            <h2 class="h2_style"><span @click="goToPage()">应用中心 <i class="el-icon-arrow-right"></i></span></h2>
            <ul :style="{height:isSlideDown?'254px':'510px'}">
                <li v-for="item in appCenter" @click="goToPage(item)">
                    <div class="item-left">
                        <img :src="item.imgUrl" alt="">
                    </div>
                    <div class="item-right">
                        <h5>{{item.title}}</h5>
                        <el-tooltip popper-class="desc-tooltip" effect="dark" :content="item.desc" placement="top" v-model="item.descTooltip">
                            <p>{{item.desc}}</p>
                        </el-tooltip>
                    </div>
                </li>
            </ul>
            <div class="slide" @click="slideAppCenterItem">
                <span class="down" v-if="isSlideDown">展开 <i class="el-icon-d-arrow-left"></i> </span>
                <span class="up" v-else>收起 <i class="el-icon-d-arrow-left"></i> </span>
            </div>
        </div>
        <div class="SM_order_price" v-if="isRetailCompany">
            <div class="order_price_date">
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
            <el-tabs style="height: 480px;border: 1px solid #e5e6e9;" v-model="activeTabsName" @tab-click="tabHandleClick">
                <el-tab-pane label="成交金额" name="price">
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
                       <div class="turnover_charts" id="turnoverBar" ref="turnoverDataBar" style="width:100%;height:360px;"> </div>
                   </div>
                </el-tab-pane>
                <el-tab-pane label="订单数" name="order">
                    <div id="order_bar_box">
                        <div class="order_charts" id="orderBar" ref="orderDataBar"> </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div class="SM_results_runway" v-if="isPlatform">
            <div class="results_runway_title">
                <h2 class="results_runway_title_h2">业务员业绩跑道</h2>
                <div class="results_runway_title_box">
                    <el-button size="small" @click="performanceVisible = !performanceVisible">设置目标</el-button>
                    <img class="results_runway_title_trophy" src="../../assets/images/trophy.png" alt="">
                </div>
            </div>
            <div class="results_runway_main"
                 v-loading="runwayLoading"
                 element-loading-text="玩命加载中.."
                 element-loading-spinner="el-icon-loading">
                <div class="results_runway_destination">
                    <img src="../../assets/images/groupEnd.png" alt="">
                </div>
                  <div class="runway_head">
                      <el-row>
                          <el-col :span="2" v-for="(item,index) of runwayPrice" :key="index">
                              <div class="runway_price">{{item}}<span v-if="index !== 0">万</span></div>
                          </el-col>
                      </el-row>
                  </div>
                  <div class="runway_conten">
                      <el-row class="runway_conten_tr" v-for="(key,index) of runwayImg" :key="index">
                          <el-col :span="1">
                              <div class="runway_conten_td runway_td_1">{{index+1}}</div>
                          </el-col>
                          <el-col :span="21">
                              <div class="runway_conten_td runway_td_2">
                                  <el-tooltip class="item" effect="dark" :content="key.realName" placement="bottom-start">
                                      <img :src="key.headPic" alt="" class="saler_img" :id="'saler_img'+index">
                                  </el-tooltip>
                              </div>
                          </el-col>
                          <el-col :span="1">
                              <div class="runway_conten_td runway_td_21">{{index+1}}</div>
                          </el-col>
                          <el-col :span="1">
                              <div class="runway_conten_td">

                              </div>
                          </el-col>
                      </el-row>
                  </div>
            </div>
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
        <el-dialog
          title="业绩排名"
          :visible.sync="performanceVisible"
          width="820px">
          <div class="performance_table">
              <el-table
                  :data="tableData"
                  style="width: 100%"
                  height="480">
                  <el-table-column
                      prop="ranking"
                      label="排名"
                      width="50">
                  </el-table-column>
                  <el-table-column
                      prop="name"
                      label="姓名"
                      width="105">
                  </el-table-column>
                  <el-table-column
                      prop="salesAmount"
                      label="销售金额"
                      width="115">
                      <template slot-scope="scope">
                          ¥{{priceFormat(scope.row.salesAmount)}}
                      </template>
                  </el-table-column>
                  <el-table-column
                      prop="targetAmount"
                      label="目标销售金额"
                      width="120">
                      <template slot-scope="scope">
                          ¥{{priceFormat(scope.row.targetAmount)}}
                      </template>
                  </el-table-column>
                  <el-table-column
                      prop="progressBar"
                      label="进度">
                      <template slot-scope="scope">
                          <el-progress :percentage="scope.row.progressBar" color="#1890FF"></el-progress>
                      </template>
                  </el-table-column>
                  <el-table-column
                      prop="setBtn"
                      label="操作"
                      width="90">
                      <template slot-scope="scope">
                          <el-popover
                              placement="top"
                              width="290"
                              trigger="click"
                              v-model="scope.row.setBtn">
                              <div class="performance_table_set_box">
                                  <h3>请输入该销售目标销售金额</h3>
                                  <el-input size="small" v-model="scope.row.inputValue"></el-input>
                                  <span class="performance_table_set_box_rmb">￥</span>
                                  <span class="performance_table_set_box_unit">万</span>
                              </div>
                              <div style="text-align: right; margin: 0">
                                  <el-button size="mini" @click="scope.row.setBtn = false">取消</el-button>
                                  <el-button type="primary" size="mini" @click="setSalerTarget(scope.row)">确定</el-button>
                              </div>
                              <span slot="reference" class="performance_table_btn" @click="scope.row.setBtn = !scope.row.setBtn">设置目标</span>
                          </el-popover>
                      </template>
                  </el-table-column>
              </el-table>
          </div>
      </el-dialog>
  </div>
</template>

<script>
    import homeTop from '../common/components/homeTop.vue';

    import personalInfo from '../common/components/personalInfo.vue';
    
    import homeLink from '../common/components/homeLink.vue';
    import timeFormat from '../../commonFun/timeFormat'
    import commaFormat from '../../commonFun/commaFormat'
    import sessFun from '../../commonFun/sessFun.js'
    import api from "../../api/api";
    import indexIsDateFirst from '../../commonFun/indexIsDateFirst.js';
    import appCenter from '../../commonFun/json/appCenter.json';

    export default {
        name: "admin_index",
        data() {
            return {
                nowMonth: '',
                sessionData: '',
                isPlatform: false,      // 根据帐号所属公司id判断是否是否为平台商
                // 表头登录账户信息
                userInfo: {
                    username: '',
                    greetings: '祝您开心每一天!',
                    duty: '',
                    dep: '',
                    phone: '13570491551',
                    avator: require('../../assets/images/index/headimg.png'),
                    endTime: '',
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
                // 常用模块数据
                linkTemp: [
                    {
                        imgurl: require('../../assets/images/media.png'),
                        title: '媒体管理',
                        desc: '媒体管理模块，您可在此模块中查添加、编辑媒体',
                        link: './superOperate/mediaList',
                        children: [
                            {
                                title: '媒体列表',
                                link: './superOperate/mediaList',
                            },
                            {
                                title: '--',
                                link: '',
                            }
                        ],
                    },
                    {
                        imgurl: require('../../assets/images/group.png'),
                        title: '客户管理',
                        desc: '客户管理模块，您可在此模块中查看、新建客户',
                        link: './superOperate/clientList',
                        children: [
                            {
                                title: '客户列表',
                                link: './superOperate/clientList',
                            },
                            {
                                title: '--',
                                link: '',
                            }
                        ],
                    },
                    {
                        imgurl: require('../../assets/images/editor.png'),
                        title: '方案管理',
                        desc: '方案管理模块，您可在此模块中查看、新建方案',
                        link: './superOperate/planList',
                        children: [
                            {
                                title: '方案列表',
                                link: './superOperate/planList',
                            },
                            {
                                title: '地图选点',
                                link: '',
                            }
                        ],
                    },
                    {
                        imgurl: require('../../assets/images/order.png'),
                        title: '订单管理',
                        desc: '订单管理模块，您可在此模块查看订单，中止订单',
                        link: './superOperate/orderList',
                        children: [
                            {
                                title: '订单列表',
                                link: './superOperate/orderList'
                            },
                            {
                                title: '--',
                                link: '',
                            }
                        ]
                    },
                    {
                        imgurl: require('../../assets/images/manage.png'),
                        title: '经营分析',
                        desc: '经营报表模块，您可在此模块查阅各类经营数据',
                        link: './superOperate/dataAnalysis',
                        children: [
                            {
                                title: '--',
                                link: ''
                            },
                            {
                                title: '--',
                                link: '',
                            }
                        ]
                    },
                    {
                        imgurl: require('../../assets/images/price.png'),
                        title: '刊例价',
                        desc: '刊例价模块，您可在此模块查看、修改城市刊例价',
                        link: './superOperate/publishPriceList',
                        children: [
                            {
                                title: '刊例价列表',
                                link: './superOperate/publishPriceList'
                            },
                            {
                                title: '--',
                                link: '',
                            }
                        ]
                    },
                ],
                linkArr: [],
                isRetailCompany: false,     // 判断是否为7大直营公司或平台商
                listDirectList: [],         // 直营城市公司列表
                activeTabsName: 'price',
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
                runwayLoading: true,    // 业绩跑到loading
                maxPrice: 550000000,     // 跑道价格最大值，单位分
                runwayPrice: [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550],
                // 跑道图片
                runwayImg: [],
                // 销售当月销售金额
                salePrice: [430, 290, 220, 195, 160, 110, 45, 20],
                // 销售排行
                performanceVisible: false,
                // 排行表格
                tableData: [],
                isMonthlyRanking: false,
                rankingImg:[
                    {city:'北京',asrID: '1',url: require('../../assets/images/index/beijing.png')},
                    {city:'上海',asrID: '2',url: require('../../assets/images/index/shanghai.png')},
                    {city:'广州',asrID: '3',url: require('../../assets/images/index/guangzhou.png')},
                    {city:'深圳',asrID: '4',url: require('../../assets/images/index/shenzhen.png')},
                    {city:'成都',asrID: '5',url: require('../../assets/images/index/chengdu.png')},
                    {city:'重庆',asrID: '6',url: require('../../assets/images/index/chongqing.png')},
                    {city:'天津',asrID: '7',url: require('../../assets/images/index/tianjing.png')}
                ],
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
                }
            }
        },
        components: {
            homeTop,
            homeLink,

            personalInfo
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
        },
        methods: {
            // 获取浏览器session数据及权限设置
            getsessionData() {
                this.sessionData = sessFun.getSess();
                if (this.sessionData.asrID === '999') {
                    this.isPlatform = false
                    // this.linkArr = JSON.parse(JSON.stringify(this.linkTemp))
                } else {
                    this.isPlatform = true
                }
                // 根据不同的登录用户构建不同的常用模块
                for (let key of this.linkTemp) {
                    if (this.sessionData.asrID === '999') {
                        delete key.children
                        this.linkArr.push(key)
                    } else {
                        if (key.title === '方案管理' || key.title === '订单管理' || key.title === '经营分析') {
                            this.linkArr.push(key)
                        }
                    }
                }
                let companyList = ['999','1','2','3','4','5','6','7']
                for (let key of companyList) {
                    if (key == this.sessionData.asrID) {
                        this.isRetailCompany = true
                        break
                    }
                }
                this.userInfo.avator = this.sessionData.headPic || require('../../assets/images/index/headimg.png')
                this.userInfo.username = this.sessionData.realName
                this.userInfo.dep = this.sessionData.division
                this.userInfo.duty = this.sessionData.asName
                this.userInfo.phone = this.sessionData.phone
                this.userInfo.endTime = timeFormat.returnDayCount(-1,'-')
                // 本季度荣誉
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
            },
            // 根据所属公司权限调用接口
            getDataByAsrID(){
                if (this.isRetailCompany) {
                    // 直营公司收入排名(超级运营排行弹窗) GetPdIncomeCount
                    let nowDate = timeFormat.toDate(new Date(), '/');
                    if(indexIsDateFirst.getIsFirst(this.sessionData.uID, nowDate)){
                        this.getPdIncomeCountByID()
                    }
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
                if (this.isPlatform) {
                    // 业绩排行
                    this.setBDonRunway()
                }
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
                let width = 0
                let bar_box = ''
                if (this.activeTabsName === 'order') {
                    // bar_box = document.getElementById('order_bar_box') SM_order_price
                    bar_box = document.getElementsByClassName('SM_order_price')[0]
                    let order = document.getElementById('orderBar')
                    width = bar_box.offsetWidth
                    order.style.width = width + 'px'
                    this.orderEcharts.resize()
                }
                if (this.isPlatform){
                    // 销售头像在跑道前进的位置
                    this.locationOnRunway()
                }
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
                    if(res.data.SysCode == 200200 && Array.isArray(dataArr) && dataArr.length > 0){
                        dataArr.sort(this.compareSort('total'))
                        let first = ''
                        let second = ''
                        let three = ''
                        if (this.isPlatform) {
                            for (let i = 0; i < dataArr.length; i++) {
                                if (this.sessionData.asrID == dataArr[i].asrID) { // this.sessionData.asrID
                                    if (i === 0) {
                                        first = 1
                                        second = 0
                                        three = 2
                                    } else if (i === dataArr.length - 1) {
                                        first = dataArr.length - 3
                                        second = dataArr.length - 1
                                        three = dataArr.length - 2
                                    } else {
                                        first = i - 1
                                        second = i
                                        three = i + 1
                                    }
                                    break
                                }
                            }
                        } else {
                            first = 1
                            second = 0
                            three = 2
                        }
                        // console.log('first',first,'second',second,'three',three)
                        // 第一个
                        let cityFirst = this.returnCityData(dataArr[first].asrID)
                        this.showCityRankingImg[0].city = cityFirst.city
                        this.showCityRankingImg[0].ranking = first + 1
                        this.showCityRankingImg[0].url = cityFirst.url
                        // 第二个
                        let citySecond = this.returnCityData(dataArr[second].asrID)
                        this.showCityRankingImg[1].city = citySecond.city
                        this.showCityRankingImg[1].ranking = second + 1
                        this.showCityRankingImg[1].url = citySecond.url
                        // 第三个
                        let cityThree = this.returnCityData(dataArr[three].asrID)
                        this.showCityRankingImg[2].city = cityThree.city
                        this.showCityRankingImg[2].ranking = three + 1
                        this.showCityRankingImg[2].url = cityThree.url
                        this.animateFun()
                    } else {
                        this.messageFun('warning','城市月季排行暂无数据')
                    }
                })
            },
            // 根据公司id返回城市名称及图片地址 rankingImg
            returnCityData(asrID) {
                for(let key of this.rankingImg){
                    if(asrID == key.asrID){
                        return {city: key.city, url: key.url}
                    }
                }
            },
            //超级运营顶部内容详情
            getHeaderData(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token
                }
                api.getApi(this.apiVar.report + '/GetSMOverview',params).then(res=>{
                    console.log('超级运营顶部内容详情',res)
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
                }else{
                    this.DateMonth = this.orderDateMonth.concat()
                }
                this.realTimeChangeEcharteWidth()
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
                        console.log('this.turnoverDataShow',this.turnoverDataShow)
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
                    console.log('订单总数接口',res)
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
                            // console.log(params)
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
            // 获取业绩排行 GetAchievementRankList
            setBDonRunway(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    asrIDs: this.returnAsrID(this.sessionData.asrID),
                }
                // console.log('获取业绩排行参数',params)
                api.getApi(this.apiVar.report + '/GetAchievementRankList', params).then(res => {
                    console.log('业绩排行接口', res)
                    let dataArr = res.data.data;
                    if(res.data.SysCode == 200200 && res.data.data){
                        let tempArr = []
                        let tableList = []
                        let i = 0
                        let maxPrice = 0
                        for(let key of dataArr){
                            if(key.target > maxPrice){
                                maxPrice = key.target
                            }
                            tableList.push({
                                ranking: i+1,
                                name: key.realName,
                                salesAmount: Math.floor(key.pdTotal / 100),
                                targetAmount: Math.floor(key.target / 100) || 0,
                                progressBar: key.target ? Number(((key.pdTotal / key.target) * 100).toFixed(2)) : 0,
                                inputValue: '',
                                setBtn: false,
                                uID: key.uID,
                            })
                            if(i < 8){
                                tempArr.push({
                                    headPic: key.headPic || require('../../assets/images/index/headimg.png'),
                                    pdTotal: Math.floor(key.pdTotal / 100),
                                    realName: key.realName,
                                    target: Math.floor(key.target / 100),
                                    uID: key.uID,
                                })
                            }
                            i++
                        }
                        if(maxPrice > 0){
                            this.maxPrice = maxPrice
                        }
                        this.setRunwayPrice(this.maxPrice)
                        for(let i = tempArr.length; i < 8;i++){
                            tempArr.push({
                                headPic:'',
                                pdTotal:'',
                                realName: '',
                                target: 0,
                                uID: '',
                            })
                        }
                        this.runwayImg = tempArr
                        // console.log('业绩排行接口tempArr',tempArr)
                        let timer = setTimeout(()=>{
                            this.locationOnRunway()
                            clearTimeout(timer)
                        },100)
                        this.tableData = tableList
                        this.runwayLoading = false
                    } else {
                        this.messageFun('warning','暂无数据')
                    }
                })
            },
            // 根据设置的最大目标销售额动态改变跑道的价格间隔 runwayPrice
            setRunwayPrice(maxPrice){
                let colPrice = parseInt(maxPrice / 11/ 100 / 10000)    // 分层十一格，分单位再除以100、10000转换成单位万元
                let priceList = [0]
                for(let i=1; i < 11; i++){
                    priceList.push(colPrice * i)
                }
                priceList.push(parseInt(maxPrice / 100 / 10000))
                this.runwayPrice = priceList
                console.log('根据设置的最大目标销售额动态改变跑道的价格间隔',priceList)
            },
            // 根据销售金额占比总金额计算偏移位置 runway_td_2 runwayPrice salePrice
            locationOnRunway() {
                // 获取跑道长度
                let runwayLength = document.getElementsByClassName('runway_conten')[0].offsetWidth
                // 跑道的最大金额
                let maxPrice = this.runwayPrice[this.runwayPrice.length - 1]
                // 偏移位置
                let locationArr = []
                // 跑道图片元素
                for (let i in this.runwayImg) {
                    let salerImg = document.getElementById('saler_img' + i)
                    locationArr.push(this.runwayImg[i].pdTotal / maxPrice / 10000)
                    let percent = this.runwayImg[i].pdTotal / maxPrice / 10000
                    if(percent >= 1){
                        salerImg.style.left =  0.88 * runwayLength + 'px'
                    }else{
                        salerImg.style.left = 0.88 * percent  * runwayLength + 'px'
                    }
                }
                // console.log('locationArr',locationArr)
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
                        if(params.target > this.maxPrice){
                            this.maxPrice = params.target
                            this.setRunwayPrice(this.maxPrice)
                        }
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
            compareSort(property) {
                return function (a, b) {
                    let value1 = a[property];
                    let value2 = b[property];
                    return value2 - value1;
                }
            },
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
                    console.log(params)
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
</style>
<style scoped>
    .ad_index_container{
        margin: 24px 64px;
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
        padding: 0 40px 20px 40px;
    }

    /deep/ .question-popover2 {
        width: 352px;
        height: 54px;
        background: rgba(0, 0, 0, 0.75);
        box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
    }

    .quesition-icon {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        vertical-align: middle;
        filter: brightness(0.75);
    }

    .turnover_charts,.order_charts{
        /*width: 1200px;*/
        height: 360px;
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
