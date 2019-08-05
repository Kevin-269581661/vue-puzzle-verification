<template>
    <div class="ads_analysis">
        <div class="ads_analysis_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix" style="position: relative">
                    <span class="box_card_title">点位使用概况</span>
                    <div class="data_tab header_select">
                        <el-select v-model="pointSelect" placeholder="请选择" size="mini" @change="adsSelectDate">
                            <el-option value="自然天"></el-option>
                            <el-option value="自然月"></el-option>
                        </el-select>
                        <div class="date_picker_box" v-show="pointSelect === '自然天'">
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
                        <div class="date_picker_month_box" v-show="pointSelect === '自然月'">
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
                                <dd>{{adsUserData.totalAdSpaceInfoCount}}</dd>
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
                                <dd>{{adsUserData.planSpotCount}}</dd>
                            </dl>
                            <dl>
                                <dt>方案数</dt>
                                <dd>{{adsUserData.planCount}}</dd>
                            </dl>
                        </div>
                        <div class="line3">
                            <dl>
                                <dt>订单点位数</dt>
                                <dd>{{adsUserData.orderSpotCount}}</dd>
                            </dl>
                            <dl>
                                <dt>订单数</dt>
                                <dd>{{adsUserData.orderCount}}</dd>
                            </dl>
                            <dl>
                                <dt>成交单价</dt>
                                <dd>{{priceFormat(adsUserData.orderUnitPrice)}}</dd>
                            </dl>
                        </div>
                    </div>
                    <div class="right-chart">
                        <img src="../../../assets/images/dataAnalysis-ld.png" alt="">
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
        <div class="ads_analysis_box">
            <div class="thr-tabs">
                <el-tabs v-model="thirdActiveName" type="card" @tab-click="handleClick()">
                    <el-tab-pane label="社区上刊率" name="first">
                        <div class="point_percent">
                            <div class="select_input">
                                <el-input class="input-with-select" size="small" placeholder="请输入内容"
                                          v-model="resInputVal"
                                          @change="initData('res')">
                                    <el-select v-model="resSelectVal" slot="prepend" placeholder="请选择">
                                        <el-option value="社区名称" label="社区名称"></el-option>
                                    </el-select>
                                </el-input>
                                <el-button type="primary" icon="el-icon-search" @click="searchFun('res')">搜索</el-button>
                                <el-button plain @click="exportExcel_res">导出</el-button>
                            </div>
                            <div class="data_tab">
                                <span class="data_tab_title">上刊率查询范围：</span>
                                <el-radio-group v-model="poiSearchTime" size="mini"
                                                @change="RadioTime(poiSearchTime,'resRate')">
                                    <el-radio-button label="最近半年"></el-radio-button>
                                    <el-radio-button label="最近三个月"></el-radio-button>
                                </el-radio-group>
                                <div class="date_picker_box">
                                    <el-date-picker
                                        size="mini"
                                        v-model="resSearchDate"
                                        type="daterange"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy-MM-dd"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :clearable="false"
                                        @change="CreatDateChange('res','search')">
                                    </el-date-picker>
                                </div>
                                <span class="data_tab_title">社区创建日期：</span>
                                <div class="date_picker_box">
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
                                <span class="data_tab_title">上刊率：</span>
                                <div class="upPercent-wrap">
                                    <div class="input-wrap">
                                        <el-input v-model="pUpMin" placeholder="0" @focus="cinputFocus = true"
                                                  @blur='resBlur'>
                                            <em slot="suffix" style="position: relative;top: 3px">%</em>
                                        </el-input>
                                        <span style="color: #999">-</span>
                                        <el-input v-model="pUpMax" placeholder="100" @focus="cinputFocus = true"
                                                  @blur='resBlur'>
                                            <em slot="suffix" style="position: relative;top: 2px">%</em>
                                        </el-input>
                                    </div>
                                    <div class="upPercent-wrap-mask" v-if="cinputFocus">
                                        <el-button type="text" @click="pClear">清除</el-button>
                                        <el-button plain class="confirm" @click="pConfirm">确定</el-button>
                                    </div>
                                </div>
                            </div>
                            <div class="table_wrap">
                                <el-table
                                    v-loading="resLoading"
                                    element-loading-text="玩命加载中.."
                                    element-loading-spinner="el-icon-loading"
                                    v-loadmore="resLoadMore"
                                    :data="resRateList"
                                    border
                                    :key="resTableKey"
                                    style="width: 100%">
                                    <el-table-column
                                        type="index"
                                        label="序号"
                                        width="50px">
                                    </el-table-column>
                                    <el-table-column
                                        prop="city"
                                        label="城市"
                                        min-width="18%">
                                    </el-table-column>
                                    <el-table-column
                                        prop="area"
                                        label="区域"
                                        min-width="18%">
                                    </el-table-column>
                                    <el-table-column
                                        prop="resName"
                                        label="社区名称"
                                        min-width="26%">
                                    </el-table-column>
                                    <el-table-column
                                        prop="upPercent"
                                        label="上刊率"
                                        sortable
                                        :sort-method="sortUpPercent"
                                        min-width="18%"
                                        align="right">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.upPercent || '--'}}%</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="price"
                                        label="投放金额"
                                        sortable
                                        :sort-method="sortResPrice"
                                        min-width="18%"
                                        align="right">
                                        <template slot-scope="scope">
                                            <span>&yen;{{scope.row.price || '--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <div slot="empty">
                                        <no-search-result></no-search-result>
                                    </div>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="点位上刊率" name="second">
                        <div class="community-percent">
                            <div class="select_input">
                                <el-input class="input-with-select" size="small" placeholder="请输入内容"
                                          v-model="adsInputVal"
                                          @change="initData('ads')">
                                    <el-select v-model="adsSelectVal" slot="prepend" placeholder="请选择">
                                        <el-option value="社区名称" label="社区名称"></el-option>
                                    </el-select>
                                </el-input>
                                <el-button type="primary" icon="el-icon-search" @click="searchFun('ads')">搜索</el-button>
                                <el-button plain @click="exportExcel_ads">导出</el-button>
                            </div>
                            <div class="select-wrap">
                                <div class="data_tab">
                                    <span class="data_tab_title"> 上刊率查询范围：</span>
                                    <el-radio-group v-model="comSearchTime" size="mini"
                                                    @change="RadioTime(comSearchTime,'adsRate')">
                                        <el-radio-button label="最近半年"></el-radio-button>
                                        <el-radio-button label="最近三个月"></el-radio-button>
                                    </el-radio-group>
                                    <div class="date_picker_box">
                                        <el-date-picker
                                            size="mini"
                                            v-model="adsSearchDate"
                                            type="daterange"
                                            value-format="yyyy-MM-dd"
                                            format="yyyy-MM-dd"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            :clearable="false"
                                            @change="CreatDateChange('ads','search')">
                                        </el-date-picker>
                                    </div>
                                    <span class="data_tab_title">点位创建日期：</span>
                                    <div class="date_picker_box">
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
                                    <span class="data_tab_title">上刊率：</span>
                                    <div class="upPercent-wrap">
                                        <div class="input-wrap">
                                            <el-input v-model="cUpMin" placeholder="" @focus="cinputFocus = true"
                                                      @blur='adsBlur'>
                                                <em slot="suffix" style="position: relative;top: 3px">%</em>
                                            </el-input>
                                            <span style="margin: 0 6px;position: relative;top: 3px">-</span>
                                            <el-input v-model="cUpMax" placeholder="" @focus="cinputFocus = true"
                                                      @blur='adsBlur'>
                                                <em slot="suffix" style="position: relative;top: 2px">%</em>
                                            </el-input>
                                        </div>
                                        <div class="upPercent-wrap-mask" v-if="cinputFocus">
                                            <el-button type="text" @click="cClear">清除</el-button>
                                            <el-button plain class="confirm" @click="cConfirm">确定</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="table_wrap">
                                <el-table
                                    v-loading="adsLoading"
                                    element-loading-text="玩命加载中.."
                                    element-loading-spinner="el-icon-loading"
                                    v-loadmore="adsLoadMore"
                                    :data="adsRateList"
                                    :key="adsTableKey"
                                    border
                                    style="width: 100%">
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
                                        :filters="areaList"
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
                                        :filters="[{ text: 'A', value: 'A' }, { text: 'B', value: 'B' }, { text: 'ABC', value: 'ABC' }]"
                                        :filter-method="filterAdNo"
                                        min-width="10%">
                                    </el-table-column>
                                    <el-table-column
                                        prop="createTime"
                                        label="点位创建日期"
                                        sortable
                                        min-width="20%">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.createTime || '--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="upPercent"
                                        label="上刊率"
                                        sortable
                                        :sort-method="sortUpPercent"
                                        min-width="10%"
                                        align="right">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.upPercent || '--'}}%</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="price"
                                        label="投放金额"
                                        sortable
                                        :sort-method="sortResPrice"
                                        min-width="10%"
                                        align="right">
                                        <template slot-scope="scope">
                                            <span>&yen;{{scope.row.price || '--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <div slot="empty">
                                        <no-search-result></no-search-result>
                                    </div>
                                </el-table>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../../api/api';
    import commaFormat from '../../../commonFun/commaFormat';
    import timeFormat from '../../../commonFun/timeFormat';
    import noSearchResult from "../../../components/common/components/noSearchResult";
    import sessFun from '../../../commonFun/sessFun';
    export default {
        name: "adsAnalysis",
        components:{
            noSearchResult
        },
        data(){
            return{
                // 判断是否已获取过数据
                isGetData: false,
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
                pointDateDay:[],
                adsSelectVal: '社区名称',
                adsInputVal: '',
                cUpMin: '',
                cUpMax: '',
                cinputFocus: false,
                // 社区上刊率表格
                adsRateList: [],
                adsTableKey: 1,     // 点位上刊表格
                adsPageNum: 1,      // 当前页数
                adsTotalPage: 1,    // 总页数
                adsPageSize: 50,
                loadingMoreAds: true, // 点位上刊率列表 - 滚动加载
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
                areaList: [],
                resTableKey: 1,
                loadingRes: true,     // 社区上刊率列表 - 滚动加载
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
        watch: {
            sessionData(newVal, oldVal) {
                console.log('newVal', newVal, 'oldVal', oldVal)
                this.sessionData = newVal
            },
            selectCity(newVal, oldVal) {
                this.selectCity = newVal
                this.pointSelect = '自然天'
                this.pointDate = this.pointDateDay.concat()
                this.setPageNoAndTableDataRes()
                this.setPageNoAndTableDataAds()
                if (this.activeName === 'fifth') {
                    this.getAdsAnalysisData()
                }
            },
            activeName(newVal,oldVal){
                this.activeName = newVal
                // 关键数据总量/增量趋势 - 社区接口
                if (this.activeName === 'fifth') {
                    if (!this.adsRateList.length || !this.resRateList.length) {
                        this.getAdsAnalysisData()
                    } else {
                        console.log('已获取过数据')
                    }
                }
            }
        },
        directives: {
            loadmore: {
                bind: function (el, binding) {
                    const selectWrap = el.querySelector('.el-table__body-wrapper')
                    selectWrap.addEventListener('scroll', function () {
                        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
                        if (scrollDistance <= 100) {
                            console.log('1')
                            binding.value()
                        }
                    })
                }
            }
        },
        mounted(){
            this.setTime()
        },
        methods:{
            // 设置初始时间
            setTime() {
                let starTime = timeFormat.returnMonthCount(5,'-')
                let endTime = timeFormat.returnMonthCount(0,'-')
                this.pointDate = [starTime,endTime]               // 点位使用概况
                this.pointDateDay = this.pointDate.concat()
                this.resSearchDate = [starTime,endTime]          // 社区上刊率列表
                this.adsSearchDate = [starTime,endTime]           // 点位上刊率列表
            },
            // 统一调用接口
            getAdsAnalysisData(){
                this.GetUserAdsInfo('自然天')
                this.getResRateFun()
                this.getAdsRateFun()
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
            // 点位使用概况 - 自然天/自然月 选择
            adsSelectDate(){
                // console.log('pointSelect',this.pointSelect)
                if(this.pointSelect === '自然月'){
                    this.pointDateDay = this.pointDate.concat()
                    let TStart = this.pointDate[0].substring(0,7)
                    let TEnd = this.pointDate[1].substring(0,7)
                    this.pointDate = [TStart,TEnd]
                    this.GetUserAdsInfo('month')
                }else if(this.pointSelect === '自然天'){
                    this.pointDate = this.pointDateDay.concat()
                    this.GetUserAdsInfo('day')
                }
            },
            //点位使用概况
            GetUserAdsInfo(val){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
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
                api.getApi(this.apiVar.Count + '/GetSpotUsedInfo', params).then(res => {
                    console.log('参数', params, '点位使用概况', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()
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
            // 社区社区列表 - 接口
            getResRateFun(){
                console.log('resPageNum',this.resPageNum,this.pUpMin)
                let params = {
                    uid:this.sessionData.uID,
                    token: this.sessionData.token,
                    onStart: this.resSearchDate[0],
                    onEnd: this.resSearchDate[1],
                    createStar: this.resCreatDate[0],
                    createEnd: this.resCreatDate[1],
                    wd: this.resInputVal,
                    asrIDs: this.returnAsrID(), //this.currCity,
                    maxPercent:isNaN(Number(this.pUpMax)) ? '' : this.pUpMax,
                    minPercent: isNaN(Number(this.pUpMin)) ? '' : this.pUpMin,
                    pageSize: this.resPageSize,
                    pageNum: this.resPageNum
                }
                for(let i in params){
                    if(params[i] === '' || params[i] === undefined){
                        delete params[i]
                    }
                }
                api.postApi(this.apiVar.Count + '/GetResPublicationRateV2',params).then(res=> {
                    console.log('社区社区列表-接口', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()
                    } else {
                        if (res.data.list.length > 0) {
                            console.log('res.data.list', res.data.list)
                            this.resTotalPage = res.data.totalPage
                            this.resPageNum++
                            this.setResTableData(res.data.list)
                            this.loadingRes = true
                        } else {
                            sessFun.messageFun('warning', '社区社区列表,在该时段暂无数据!')
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
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    onStart: this.adsSearchDate[0],
                    onEnd: this.adsSearchDate[1],
                    createStar: this.adsCreatDate[0],
                    createEnd: this.adsCreatDate[1],
                    wd: this.adsInputVal,
                    asrIDs: this.returnAsrID(),
                    maxPercent: isNaN(Number(this.cUpMax)) ? '' : this.cUpMax,//this.cUpMax,
                    minPercent: isNaN(Number(this.cUpMin)) ? '' : this.cUpMin,//this.cUpMin,
                    pageSize: this.adsPageSize,
                    pageNum: this.adsPageNum,
                }
                for(let i in params){
                    if(params[i] === '' || params[i] === undefined){
                        delete params[i]
                    }
                }
                api.postApi(this.apiVar.Count + '/GetSpotPublicationRateV2',params).then(res=>{
                    console.log('点位社区列表 - 接口',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()
                    }else {
                        if(res.data.list.length > 0){
                            this.adsTotalPage = res.data.totalPage
                            this.adsPageNum++
                            this.setAdsTableData(res.data.list)
                            this.loadingMoreAds = true
                        }else{
                            // this.$message.warning('点位社区列表,在该时段暂无数据！');
                            sessFun.messageFun('warning','点位社区列表,在该时段暂无数据！')
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
                    this.setAreaList(key.rName)
                }
                console.log('adsRateList',this.adsRateList,this.areaList)
            },
            // 设置下拉区域过滤选项
            setAreaList(val){
                // this.areaList
                let result = this.areaList.some(item=>{
                    if(item.value == val){
                        return true
                    }
                })
                // console.log('result',result)
                if(!result){
                    this.areaList.push({
                        text: val,
                        value: val
                    })
                }
            },
            // 点位分析 - 功能方法
            // 城市切换过滤
            filterRateDataByCity(){
                this.setPageNoAndTableDataRes()
                this.loadingRes = false
                this.getResRateFun()
                this.loadingMoreAds = false
                this.setPageNoAndTableDataAds()
                this.getAdsRateFun()
            },
            // 创建社区时间 - changes
            CreatDateChange(val){
                console.log('----------------', val)
                if (val === 'res') {
                    if (!this.resCreatDate) {
                        this.resCreatDate = []
                    }
                    this.pUpMin = ''
                    this.pUpMax = ''
                    this.setPageNoAndTableDataRes()
                    this.getResRateFun()
                } else if (val === 'ads') {
                    if (!this.adsCreatDate) {
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
            resLoadMore() {
                if (this.loadingRes) {
                    this.loadingRes = false
                    if (this.resTotalPage >= this.resPageNum) {
                        this.resLoading = true
                        this.getResRateFun()
                    } else {
                        console.log('已无数据')
                    }
                } else {
                    // console.log('else资源发生了滚动')
                }
            },
            // 点位上刊率 - 滚动监听
            adsLoadMore(){
                console.log('点位上刊率 - 滚动监听',this.loadingMoreAds)
                if (this.loadingMoreAds) {
                    this.loadingMoreAds = false
                    if (this.adsTotalPage >= this.adsPageNum) {
                        this.adsLoading = true
                        this.getAdsRateFun()
                    } else {
                        console.log('点位已无数据')
                    }
                } else {
                    this.handleClick()
                    console.log('点位else')
                }
            },
            // 点位分析-搜索
            searchFun(val){
                console.log('点位分析-搜索',val,this.adsInputVal)
                if(val === 'res'){
                    if(this.resSelectVal === '社区名称') {
                        if (this.resInputVal === '') {
                            sessFun.messageFun('warning','搜索内容为空!')
                        } else {
                            this.setPageNoAndTableDataRes()
                            this.getResRateFun()
                        }
                    }
                }else if(val === 'ads'){
                    if(this.adsSelectVal === '社区名称'){
                        if(this.adsInputVal === ''){
                            sessFun.messageFun('warning','搜索内容为空!')
                        }else{
                            this.setPageNoAndTableDataAds()
                            this.getAdsRateFun()
                        }
                    }
                }
            },
            handleClick(){
                console.log('val',this.thirdActiveName)
                if (this.thirdActiveName === 'first') {
                    this.resTableKey = this.resTableKey === 1 ? 2 : 1
                } else if (this.thirdActiveName === 'second') {
                    // this.adsTableKey = this.adsTableKey === 1 ? 2 : 1
                    // ++this.adsTableKey
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
                if(this.cUpMin !== '' && this.cUpMax !== ''){
                    let isMin = Number(this.cUpMin)
                    let isMax = Number(this.cUpMax)
                    if (isNaN(isMin) || isNaN(isMax) || isMin >= isMax) {
                        sessFun.messageFun('warning','请填写正确的区间!')
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
                if (this.pUpMin === '' && this.pUpMax === '') {
                    this.cinputFocus = false
                    this.setPageNoAndTableDataAds()
                    this.getAdsRateFun()
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
                console.log('社区上刊率',this.pUpMin,this.pUpMax)
                if (this.pUpMin !== '' && this.pUpMax !== '') {
                    let isMin = Number(this.pUpMin)
                    let isMax = Number(this.pUpMax)
                    // console.log('isMin',isMin,'isMax',isMax)
                    if (isNaN(isMin) || isNaN(isMax) || isMin >= isMax) {
                        sessFun.messageFun('warning','请填写正确的区间!')
                    } else {
                        this.setPageNoAndTableDataRes()
                        this.getResRateFun()
                        console.log('区间', this.pUpMin, '-', this.pUpMax)
                        this.cinputFocus = false
                    }
                }
            },
            // 资源社区上刊率部分数据初始化
            setPageNoAndTableDataRes(){
                this.loadingRes = false
                this.resLoading = true
                this.resRateList = []
                this.resPageNum = 1
            },
            // 点位上刊率部分数据初始化
            setPageNoAndTableDataAds(){
                this.loadingMoreAds = false
                this.adsLoading = true
                this.adsRateList = []
                this.areaList = []
                this.adsPageNum = 1
            },
            // 资源社区表格导出
            exportExcel_res(){
                sessFun.messageFun('warning','导出excel可能需要一分钟甚至更长时间!')
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    onStart: this.resSearchDate[0],
                    onEnd: this.resSearchDate[1],
                    asrIDs: this.returnAsrID(),// this.currCity,
                    wd: this.resInputVal,
                    maxPercent: isNaN(Number(this.pUpMax)) ? '' : this.pUpMax,
                    minPercent: isNaN(Number(this.pUpMin)) ? '' : this.pUpMin,
                }
                for(let i in params){
                    if(params[i] === '' || params[i] === undefined){
                        delete params[i]
                    }
                }
                api.getApi_file(this.apiVar.Count + '/ExportResPublicationRate'
                    , params).then(res=>{
                    console.log('社区上刊率导出',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()
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
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
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
                api.getApi_file(this.apiVar.Count + '/ExportSpotPublicationRate',params).then(res=>{
                    console.log('点位上刊率导出',res.headers)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()
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
            // 根据权限公司返回 asrIDs
            returnAsrID(){
                if (this.selectCity == '0'){
                    return '1,2,3,4,5,6,7'
                }else{
                    return this.selectCity
                }
            },
            validateNum(value) {
                let reg = /^\d+(\.\d+)?$/
                if (value !== '' && !(reg.test(value))) {
                    return true
                } else {
                    return false
                }
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
        },
    }
</script>

<style scoped>
    /*点位分析*/
    .ads_analysis_box{
        margin-bottom: 16px;
    }

    .ads_analysis_box /deep/ .el-card__body{
        padding: 24px 32px;
    }

    /*点位使用概况*/
    .box_card_title{
        font-size:16px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(44,49,60,1);
    }

    .header_select {
        position: absolute;
        right: 0;
        top: 0;
    }

    .header_select /deep/ .el-input__inner{
        width: 90px;
    }

    .date_picker_box,.date_picker_month_box{
        display: inline-block;
    }

    .date_picker_month_box{
        font-size: 12px;
        color: #666;
    }

    .date_picker_box /deep/ .el-range-editor--mini.el-input__inner{
        width: 225px;
    }

    .date_picker_month_box /deep/ .el-date-editor.el-input{
        width: 110px;
    }

    .date_picker_month_box /deep/ .el-input__inner{
        width: 110px;
    }

    .pointData-wrap{
        display: flex;
        justify-content: space-between;
    }
    /*左边*/
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
        text-align: left;
        width: 118px;
    }

    .left-data dl dt {
        display: block;
        font-size: 12px;
        color: #666666;
    }

    .left-data dl dd {
        font-size: 20px;
        color: #2C313C;
        font-family: DINPro-Regular, PingFangSC-Regular, Microsoft YaHei;
    }
    /*右边*/
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

    /* 社区/点位上刊率 */
    .ads_analysis_box /deep/ .el-tabs__nav-wrap {
        width: 100%;
        padding: 0;
    }

    .ads_analysis_box /deep/ .el-tabs__item {
        height: 40px;
        line-height: 40px;
    }

    .ads_analysis_box /deep/ .el-tabs__header{
        height: 40px;
        background: #fff;
    }

    .thr-tabs {
        width: 100%;
        background-color: #ffffff;
    }

    /*社区上刊率和点位上刊率*/
    .community-percent, .point_percent {
        padding: 16px 24px;
        margin-bottom: 40px;
    }

    .select_input{
        margin-bottom: 16px;
    }

    /deep/ .input-with-select {
        width: 288px;
        height: 32px;
    }

    /*下拉搜索框*/
    /deep/ .el-input-group__prepend {
        width: 64px;
        position: relative;
        background-color: #fff;
    }

    /deep/ .el-input-group--prepend .el-select {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .data_tab{
        margin-bottom: 16px;
    }

    .data_tab_title{
        font-size: 12px;
        color: #808080;
    }

    .upPercent-wrap {
        position: relative;
        display: inline-block;
    }

    .input-wrap {
        position: relative;
        z-index: 9;
    }

    .upPercent-wrap /deep/ .el-input{
        width: 66px;
    }

    .upPercent-wrap /deep/ .el-input .el-input__inner {
        width: 100%;
        height: 26px;
        border-bottom-left-radius: 4px;
        border-top-left-radius: 4px;
        padding-left: 10px;
        padding-right: 10px;
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

    .upPercent-wrap-mask /deep/ .el-button {
        width: 44px;
        min-width: 44px;
        height: 24px;
        line-height: 24px;
        position: absolute;
        bottom: 5px;
        left: 10px;
    }

    .upPercent-wrap-mask button:last-child {
        left: 60%;
    }

    .upPercent-wrap-mask button:last-child span {
        position: relative;
        top: 0px;
        left: -5px;
        font-size: 14px;
        color: #2C313C;
    }

    /*表格*/
    .ads_analysis /deep/ .el-table__body-wrapper{
        overflow-y: auto;
        min-height: 371px;
        height: 371px;
    }
</style>
