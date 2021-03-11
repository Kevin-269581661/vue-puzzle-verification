<template>
    <div class="step2 addAds">
        <div>
            <div class="search-nav">
                <div class="flex_box search_row">
                    <!-- <el-select v-model="selectValue" placeholder="请选择" @change="initData" size="small">
                        <el-option v-for="item in typeSelect" :key="item.value" :label="item.value" :value="item.value"></el-option>
                    </el-select>
                    <el-input v-model="searchInput" placeholder="请输入要搜索的内容" @change="initData" size="small" class="searchInput"></el-input> -->
                    <el-input placeholder="请输入要搜索的内容" v-model="searchInput" class="input-with-select" @change="initData" size="small">
                        <el-select slot="prepend" v-model="selectValue" placeholder="请选择" @change="initData" size="small">
                            <!-- <el-option label="资源名称" value="1"></el-option> -->
                            <el-option v-for="item in typeSelect" :key="item.value" :label="item.value" :value="item.value"></el-option>
                        </el-select>
                    </el-input>
                    <el-date-picker v-model="dateInput" type="daterange" start-placeholder="开始日期"  value-format="yyyy/MM/dd" format="yyyy/MM/dd" style="width: 260px;margin-left: 16px" size="small" end-placeholder="结束日期" >
                    </el-date-picker>
                    <el-button style="margin-left: 16px" type="primary" icon="el-icon-search" @click="searchFun" size="small" v-qadn-mta-h5="{id: 'a006_b011_c012_d009_bt152_ck01'}">搜索</el-button>
                </div>
            </div>
            <!--类型区域选择面板-->
            <div class="dw-panel">
                <dl>
                    <dt>资源类型：</dt>
                    <dd :class="recType === 1?'active': ''" @click="activeRecType(1)">社区</dd>
                    <dd :class="recType === 2?'active': ''" @click="activeRecType(2)">写字楼</dd>
                </dl>
                <dl>
                    <dt>媒体类型：</dt><!--mediaType-->
                    <dd :class="mediaType === '广告门'?'active': ''" @click="activeMediaType('广告门')">广告门</dd>
                    <dd :class="mediaType === '道闸'?'active': ''" @click="activeMediaType('道闸')">道闸</dd>
                </dl>
                <dl style="border: none">
                    <dt>城市区域：</dt>
                    <dd v-for="(item, index) in city" :index="index"
                        :class=" index == activeIndex ? 'active' : ''"
                        @click="activeCity(item,index)">{{item.rName}}
                    </dd>
                </dl>
                <dl class="city-proper" v-for="(list, index) of area" :index="index"
                    v-show=" index == activeIndex">
                    <dd v-for="item of list" :class="item.rName == areaName ? 'active' : ''"
                        @click="activeArea(item.rName)">{{item.rName}}
                    </dd>
                </dl>
                <dl style="border: none">
                    <dt>其它条件：</dt>
                    <dd class="other-dd">
                        <el-select v-model="mState" placeholder="媒体状态" class="otherSelect" :class="mState !== '' ? 'otherSelectActive' :'' "
                                   @change="mStateChange">
                            <el-option label="正常" value="1"></el-option>
                            <el-option label="待安装" value="2"></el-option>
                        </el-select>
                        <el-select v-model="limitList" placeholder="广告限制" class="otherSelect adLimitSelect"
                                   :class="limitList.length !== 0 ? 'otherSelectActive' :'' " multiple collapse-tags
                                   @change="activeADLimit"> <!--visible-change-->
                            <el-option
                                v-for="item in ADLimit"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="buildValue" :placeholder="recType == '1' ? '楼盘类型' : '写字楼类型'"
                                   :class="buildValue !== '' ? 'otherSelectActive' :'' "
                                   class="otherSelect" @change="tableHeaderFilter_cType">
                            <el-option v-for="item in buildType" :key="item.buildValue"
                                       :label="item.buildValue"
                                       :value="item.buildValue">
                            </el-option>
                        </el-select>
                        <el-popover
                            placement="bottom-start"
                            width="155"
                            trigger="click"
                            popper-class="other-dd-popper">
                            <div class="input-wrap" :class="HSearch === 'h'? 'focus': ''">
                                <input type="text" class="input" @focus="haveFocus('h')"
                                       v-model="houseNum[0]">
                                -
                                <input type="text" class="input" @focus="haveFocus('h')"
                                       v-model="houseNum[1]">
                                <el-button @click="emptyFun('H')" class="input-wrap-Btn">清 除 </el-button>
                                <el-button type="primary" class="input-wrap-Btn"
                                           @click="tableHeaderFilter_h()" >确 定
                                </el-button>
                            </div>
                            <el-button slot="reference" class="otherBtn"
                                       :class=" filterData.hNum ? 'otherBtnActive' : '' ">
                                住户数量
                            </el-button>
                        </el-popover>
                        <el-popover
                            placement="bottom-start"
                            width="155"
                            trigger="click"
                            popper-class="other-dd-popper">
                            <div class="input-wrap" :class="HSearch === 'p'? 'focus': ''">
                                <input type="text" class="input" @focus="haveFocus('p')"
                                       v-model="buildPrice[0]">
                                -
                                <input type="text" class="input" @focus="haveFocus('p')"
                                       v-model="buildPrice[1]">
                                <el-button @click="emptyFun('P')" class="input-wrap-Btn">清 除 </el-button>
                                <el-button type="primary" class="input-wrap-Btn"
                                           @click="tableHeaderFilter_p()" >确 定
                                </el-button>
                            </div>
                            <el-button slot="reference" class="otherBtn"
                                       :class=" filterData.bPrice ? 'otherBtnActive' : '' ">
                                楼盘价格
                            </el-button>
                        </el-popover>
                        <el-popover
                            v-show="moreFilter"
                            placement="bottom-start"
                            width="155"
                            trigger="click"
                            popper-class="other-dd-popper">
                            <div class="input-wrap" :class="HSearch === 'p'? 'focus': ''">
                                <input type="text" class="input" @focus="haveFocus('y')"
                                       v-model="liveYear[0]">
                                -
                                <input type="text" class="input" @focus="haveFocus('y')"
                                       v-model="liveYear[1]">
                                <el-button @click="emptyFun('Y')" class="input-wrap-Btn">清 除 </el-button>
                                <el-button type="primary" class="input-wrap-Btn"
                                           @click="tableHeaderFilterByLiveYear()" >确 定
                                </el-button>
                            </div>
                            <el-button slot="reference" class="otherBtn"
                                       :class="filterData.lYear ? 'otherBtnActive' : '' ">
                                入住年份
                            </el-button>
                        </el-popover>
                        <el-popover
                            v-show="moreFilter"
                            placement="bottom-start"
                            width="155"
                            trigger="click"
                            popper-class="other-dd-popper">
                            <div class="input-wrap" :class="HSearch === 'PF'? 'focus': ''">
                                <input type="text" class="input" @focus="haveFocus('PF')"
                                       v-model="peopleFlow[0]">
                                -
                                <input type="text" class="input" @focus="haveFocus('PF')"
                                       v-model="peopleFlow[1]">
                                <el-button @click="emptyFun('PF')" class="input-wrap-Btn">清 除 </el-button>
                                <el-button type="primary" class="input-wrap-Btn"
                                           @click="tableHeaderFilterByPeopleFlow()" >确 定
                                </el-button>
                            </div>
                            <el-button slot="reference" class="otherBtn"
                                       :class=" filterData.pFlow ? 'otherBtnActive' : '' ">
                                人流量
                            </el-button>
                        </el-popover>
                        <el-popover
                            v-show="moreFilter"
                            placement="bottom-start"
                            width="155"
                            trigger="click"
                            popper-class="other-dd-popper">
                            <div class="input-wrap" :class="HSearch === 'PSN'? 'focus': ''">
                                <input type="text" class="input" @focus="haveFocus('PSN')"
                                       v-model="carFlow[0]">
                                -
                                <input type="text" class="input" @focus="haveFocus('PSN')"
                                       v-model="carFlow[1]">
                                <el-button @click="emptyFun('PSN')" class="input-wrap-Btn">清 除 </el-button>
                                <el-button type="primary" class="input-wrap-Btn"
                                           @click="tableHeaderFilterByCarFlow()" >确 定
                                </el-button>
                            </div>
                            <el-button slot="reference" class="otherBtn"
                                       :class="filterData.cFlow ? 'otherBtnActive' : '' ">
                                车流量
                            </el-button>
                        </el-popover>
                        <el-popover
                            v-show="moreFilter"
                            placement="bottom-start"
                            width="155"
                            trigger="click"
                            popper-class="other-dd-popper">
                            <div class="input-wrap" :class="HSearch === 'CF'? 'focus': ''">
                                <input type="text" class="input" @focus="haveFocus('CF')"
                                       v-model="parkSpaceNum[0]">
                                -
                                <input type="text" class="input" @focus="haveFocus('CF')"
                                       v-model="parkSpaceNum[1]">
                                <el-button @click="emptyFun('CF')" class="input-wrap-Btn">清 除 </el-button>
                                <el-button type="primary" class="input-wrap-Btn"
                                           @click="tableHeaderFilterByParkSpaceNum()" >确 定
                                </el-button>
                            </div>
                            <el-button slot="reference" class="otherBtn"
                                       :class="filterData.pSNum ? 'otherBtnActive' : '' ">
                                车位数
                            </el-button>
                        </el-popover>
                        <span style="color:#1890FF;" @click="moreFilter = !moreFilter">
                                        {{moreFilter ? '' : '更多'}}
                                        <i v-if="moreFilter" class="el-icon-d-arrow-left" style="color:#1890FF;"></i>
                                        <i v-else class="el-icon-d-arrow-right" style="color:#1890FF;"></i>
                                        {{moreFilter ? '收起' : ''}}
                                    </span>
                    </dd>
                </dl>
            </div>
            <div class="filter-condition" v-show="filterCondition.length>0">
                <el-tag
                    v-for="(tag, index) in filterCondition"
                    :key="index"
                    closable
                    :disable-transitions="false"
                    @close="filterTagCloseFun(tag,index)"
                    :type="tag.type"
                    size="medium">
                    {{tag.name}}
                </el-tag>
            </div>
            <!--提示-->
            <div class="tip">
                <i class="el-icon-info"></i>
                <p>共 <span>{{adsCount}}</span>个点位，已选点位 <span>{{shopingList.length||0}}</span>个</p>
            </div>
            <!--表格-->
            <div class="table_wrap adsTable">
                <div class="myCheckbox">
                    <el-checkbox v-model="IsAll" @change="allCheckboxAds">全选本页</el-checkbox>
                </div>
                <el-table
                    v-loading="loading"
                    element-loading-text="玩命加载中.."
                    element-loading-spinner="el-icon-loading"
                    border
                    :data="planList"
                    :default-sort="{prop: 'mID', order: 'descending'}"
                    style="width: 100%"
                    class="selectAdsTable"
                    height="545">
                    <el-table-column width="110px" fixed>
                        <template slot-scope="scope">
                            <div class="adDoor" v-if="mediaType === '广告门'">
                                <el-checkbox v-model="scope.row.checkBox.A" label="A面"
                                             @change="changeA(scope.row)"
                                             :disabled="scope.row.box.A">
                                </el-checkbox>
                                <el-checkbox v-model="scope.row.checkBox.B" label="B面"
                                             @change="changeB(scope.row)"
                                             :disabled="scope.row.box.B">
                                </el-checkbox>
                            </div>
                            <div class="roadGate" v-else>
                                <el-checkbox v-model="scope.row.checkBox.ABC" label="ABC面"
                                             @change="changeABC(scope.row)">
                                </el-checkbox><!--v-model="scope.row.checkBox.ABC"-->
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed
                        label="资源名称"
                        min-width="200"
                        prop="resName"
                    >
                    </el-table-column>
                    <el-table-column
                        fixed
                        prop="mediaName"
                        label="媒体名称"
                        min-width="140"
                        class="tar"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="city"
                        label="城市"
                        min-width="110"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="origin"
                        label="区域"
                        min-width="110"
                    >
                    </el-table-column>
                    <el-table-column
                        label="商圈"
                        min-width="130">
                        <template slot-scope="scope">
                            {{scope.row.tradingArea || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="媒体备注"
                        min-width="140">
                        <template slot-scope="scope">
                            <span v-if="scope.row.mediaRemark.length <= 6">{{scope.row.mediaRemark || '--' }}</span>
                            <el-tooltip v-else class="item" effect="dark" :content="scope.row.mediaRemark" placement="bottom-start">
                                <span>{{scope.row.mediaRemark || '--' }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="资产编号"
                        min-width="160">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.assetTag" placement="bottom-start">
                                <span>{{scope.row.assetTag || '--' }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="广告限制"
                        min-width="130">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.adLimit" placement="bottom-start">
                                <span>{{scope.row.adLimit || '--' }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="recType == 1? '楼盘类型':'写字楼类型'"
                        min-width="100">
                        <template slot-scope="scope">
                            <span v-if="recType == 1">{{ scope.row.buildType || '--' }}</span>
                            <el-tooltip v-else class="item" effect="dark" :content="scope.row.buildType" placement="bottom-start">
                                <span>{{scope.row.buildType || '--' }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="mState"
                        label="媒体状态"
                        min-width="90"
                        class="tar"
                    >
                    </el-table-column>
                    <el-table-column
                        label="楼盘价格"
                        min-width="110"
                    >
                        <template slot-scope="scope">
                            <span>&yen;{{scope.row.buildPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="buildNum"
                        label="楼栋数量"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        label="广告尺寸"
                        min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.adSize || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="画面尺寸"
                        min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.picSize || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="liveYear"
                        :label="recType === 1? '入住年份' : '建成年份'"
                        min-width="90">
                    </el-table-column>
                    <el-table-column
                        prop="houseNum"
                        :label="recType === 1? '小区户数' : '办公室数量'"
                        min-width="90">
                    </el-table-column>
                    <el-table-column
                        label="人流量"
                        min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.peopleFlow || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="车位数"
                        min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.parkSpaceNum || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="车流量"
                        min-width="110">
                        <template slot-scope="scope">
                            {{ scope.row.carFlow || '--' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        prop="schedules"
                        label="排期"
                        min-width="190"
                    >
                    </el-table-column>
                </el-table>
                <div class="ad_pagination" v-if="total">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="changePage"
                        @size-change="sizeChange"
                        :page-sizes="[10, 20, 50,100,500]"
                        :current-page.sync="pageNo"
                        :page-size="pageSize"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { Message } from 'element-ui';
    import areaArr from '../../../commonFun/areaPackage_new'
    import api from '../../../api/api'
    // 时间格式化
    import timeFormat from "../../../commonFun/timeFormat.js"
    import sessFun from "../../../commonFun/sessFun.js"
    export default {
        name: "addAds",
        data() {
            return {
                loading: true,//加载中
                sessionData:'',           //
                loadScroll: true,           // 搜索后不执行滚动加载
                loadSign: true,            // table滚轮
                beforADTotalList: [],    // step2原始的所有点位列表
                ADTotalList: [],         // step2所有点位列表
                shopingList: [],        // step2购物车列表
                dateTime: '',                // 获取今天日期
                dateInput: [],
                beforeDate: [],           // 时间输入框的前一次时间
                //搜索类型
                typeSelect: [
                    {
                        value: "资源名称",
                        label: "资源名称"
                    },
                    {
                        value: "商圈",
                        label: "商圈"
                    }
                ],
                mStateIndex: 0,               // 切换媒体状态时，如果状态为1(正常)则进行滚动加载，mStateIndex记录下标
                //默认
                selectValue: '资源名称',
                ADLimit: [                      // step2 广告限制
                    // {value: '全部', label: '全部'},
                    {value: '地产', label: '地产'},
                    {value: '汽车', label: '汽车'},
                    {value: '美容', label: '美容'},
                    {value: '餐饮', label: '餐饮'},
                    {value: '食品', label: '食品'},
                    {value: '金融', label: '金融'},
                    {value: '医学', label: '医学'},
                ],
                limitName: '全部',            // 当前广告限制高亮，默认为全部
                limitList: [],                // 当前选择的广告限制
                filterCondition: [], // 当前过滤条件
                noPushIndex: 0,                //切换广告限制时，如果loadscroll为true则进行滚动加载，noPushIndex记录下标
                scroll_notPush: false,        //广告限制的滚动加载
                secondLevelData: [],            // 二级搜索保存的数据
                //楼盘类型
                buildType: [
                    {buildlabel: '高端住宅', buildValue: '高端住宅'},
                    {buildlabel: '普通住宅', buildValue: '普通住宅'},
                    {buildlabel: '单体楼', buildValue: '单体楼'},
                    {buildlabel: '别墅', buildValue: '别墅'},
                    {buildlabel: '洋房', buildValue: '洋房'},
                    {buildlabel: '商住或商用', buildValue: '商住或商用'},
                    {buildlabel: '公共场所', buildValue: '公共场所'}
                ],
                village:[
                    {buildlabel: '高端住宅', buildValue: '高端住宅'},
                    {buildlabel: '普通住宅', buildValue: '普通住宅'},
                    {buildlabel: '单体楼', buildValue: '单体楼'},
                    {buildlabel: '别墅', buildValue: '别墅'},
                    {buildlabel: '洋房', buildValue: '洋房'},
                    {buildlabel: '商住或商用', buildValue: '商住或商用'},
                    {buildlabel: '公共场所', buildValue: '公共场所'}
                ],
                officeBuilding: [           // 写字楼类型
                    {buildValue:'单纯性写字楼',buildlabel:'单纯性写字楼'},
                    {buildValue:'商住型写字楼',buildlabel:'商住型写字楼'},
                    {buildValue:'综合型写字楼',buildlabel:'综合型写字楼'},
                ],
                buildValue: "",
                //搜索框
                searchInput: "",
                planSelect: "",
                firstLevelData: [],             // 一级搜索保存的数据
                //添加点位列表
                planList: [],
                mState:'',
                beforADList_mState: [],       // 保存切换媒体的所有数据--ADList
                IsAdd: false,      //是否已添加点位
                totalPlanList: [],   // step2全部城市的选点列表
                copyPlanList: [],       // 备份planList
                activeCityData: {},          // 城市切换的数据，默认为this.city[0]
                activeIndex: 0,             //step2当前选中的城市下标
                activeRName: '',            //step2当前选中的城市名称
                areaName: '全市',           // step2当前选中的区域
                CityPlanIndex: [],            // 记录每个城市遍历到的下标
                recType: 1,                  // step2  1:社区 0:写字楼
                mediaType: '广告门',          // 媒体类型 广告门、道闸
                city: [],                     // step2 城市
                area: [],                    // step2城市下属区域
                cityOptions: [],
                scroll_mState: false,          // 媒体状态的滚动加载
                FAInfo: '',
                HSearch: '',           // 获取传值显示‘清除’、‘确定’按钮
                houseNum: ['', ''],      // 表头搜索住户数量
                buildNum: ['', ''],      // 表头搜索楼栋数量
                buildPrice: ['', ''],    // 表头搜索楼盘价格
                liveYear: ['', ''],       // 表头搜索入住年份
                peopleFlow: ['',''],       // 表头搜索人流量
                carFlow : ['',''],          // 表头搜索车位数
                parkSpaceNum : ['',''],    // 表头搜索车流量
                filterData: {               // 记录判断含有哪些表头的过滤条件
                    hNum:false,
                    bNum:false,
                    bPrice:false,
                    lYear: false,
                    pFlow: false,
                    cFlow: false,
                    pSNum: false
                },
                moreFilter: false,          // 是否显示全部过滤条件
                pageNo: 1,              // 页码
                total: 1,          // 总页数
                pageSize:20,
                getAdsParamsData: {},    //　获取点位列表的参数data
                apMinTime: '',          // 方案创建的开始时间
                IsAll: false,           //当前是否为全选状态
                sUID: '',               // 该方案销售uid
                currPageAsLength: 0,//当前页面可选的点位总数
                currPageSelect: 0,//当前页面已选择的点位数
                adsCount:0,//总可选点位
            }
        },
        props: {
            IsAddAds: {
                type: Boolean,
                required: true,
            },
        },
        watch: {
            IsAddAds: function(newVal,oldVal){
                console.log('父组件相子组件传值',newVal,oldVal)
                this.activeIndex = 0
                this.getAdsParamsData= {}
                this.IsAdd = newVal
                this.IsAll = false
                this.shopingList = []    // 获取获取方案信息
                this.pageSize = 20;
                this.pageNo = 1;
                // this.resetPlanList()
                this.getInitData()
                // this.getAdList()
            }
        },
        // directives: {
        //     loadmore: {
        //         bind: function (el, binding) {
        //             const selectWrap = el.querySelector('.el-table__body-wrapper')
        //             selectWrap.addEventListener('scroll', function () {
        //                 const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        //                 if (scrollDistance <= 150) {
        //                     binding.value()
        //                 }
        //             })
        //         }
        //     }
        // },
        mounted(){
            console.log('this.IsAdd',this.IsAdd)
            this.sessionData = sessFun.getSess();
            let starTime, endTime
            this.dateTime = timeFormat.returnDayCount(0,'/')
            starTime = timeFormat.returnDayCount(1,'/')
            endTime = timeFormat.returnDayCount(14,'/')
            this.dateInput = [starTime, endTime] // 设置默认时间
            this.beforeDate = [starTime, endTime]

            this.getInitData()    // 获取获取方案信息
            this.getADLimit()       // 获取广告限制列表
        },
        methods:{
            //监听table滚动
            // loadMore() {
            //     if (this.loadScroll) {
            //         this.loadScroll = false
            //         if(this.pageNo <= this.total){
            //             this.getAdsParamsData.pageNo = this.pageNo
            //             this.getAdList()
            //         }
            //     } else {
            //         console.log('此时为搜索出来的数据')
            //     }
            // },
            // 改变每页条数
            sizeChange(pageVal) {
                this.IsAll = false
                this.pageNo = 1;
                this.pageSize = pageVal
                this.getAdList()
            },
            // 改变页数
            changePage(page) {
                this.IsAll = false;
                this.currPageSelect = 0
                this.pageNo = page;
                this.getAdList()
            },
            // step2 获取广告限制列表
            getADLimit() {
                // let uid = this.sessionData.uID
                this.ADLimit = []
                let params = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service":"GetNotPush",
                    "data": {}
                }
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('广告限制列表', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    }  else if(res.data.SysCode === 200200 ){
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
            // 获取选点排期列表数据
            getInitData() {
                // 真实数据
                let uid = JSON.parse(sessionStorage.getItem("session_data")).uID;
                let apid = sessionStorage.getItem("order_apid");
                let params = {
                    uid: uid,
                    token: this.sessionData.token,
                    apid: apid,
                }
                api.getApi(this.apiVar.Advertisement+"/GetFanganInfo", params).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let info = res.data.data;
                        this.FAInfo = info;
                        this.sUID = this.FAInfo.suID
                        this.FAInfo.cityList = this.delCommentCity(this.FAInfo.rIDs.split(','))
                        if (this.sessionData.uType === 'MD' && this.sessionData.mediaManageLevel == '1') {
                            this.setAllCityAndArea(this.FAInfo.cityList)
                        } else {
                            this.getCityList()
                        }
                        this.getAdsParamsData = {
                            prID: this.city[0].rid,
                            rid: '440100',
                            act: 1,
                            dateTimeBegin: this.dateInput[0],
                            dateTimeEnd: this.dateInput[1],
                            resType: this.recType,
                            mVehicle: this.mediaType,
                            pageNo: this.pageNo,
                            pageSize: this.pageSize,
                        }
                        this.getAdList()    // 获取选点列表
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                }).catch(res => {
                    console.log(res);
                });
            },
            // 获取权限下的城市列表 saleManageLevel
            getCityList(){
                let cityArea = JSON.parse(sessionStorage.getItem('order_citylist'))
                console.log('获取权限下的城市列表cityArea',cityArea)
                let cityList = []
                for(let cKey of cityArea){
                    if (cKey.asrID == this.sessionData.asrID) {
                        for(let key of cKey.cityList){
                            cityList.push({
                                label: key.city,
                                value: key.rID,
                            })
                        }
                    }
                }
                this.setCityAndArea(cityList)
            },
            // 设置该方案的销售为全国的城市数组
            setAllCityAndArea(citys){
                let cityArr = citys
                // console.log('城市数组', cityArr)
                let cityList = []
                for (let i = 0; i < cityArr.length; i++) {
                    let CityRid = areaArr.TextToCode(cityArr[i])
                    let cityObj = {rName: cityArr[i], rid: CityRid}
                    cityList.push(cityObj)
                }
                this.city = cityList
                this.city.sort(this.compareFun)
                this.activeCityData = this.city[0]
                this.activeRName = this.activeCityData.rName
                // console.log('构建城市', this.city)
                let areaList = []
                for (let j = 0; j < cityList.length; j++) {
                    let area_Arr = areaArr.findArea(cityList[j].rid)
                    area_Arr.unshift({rid: cityList[j].rid, rName: '全市'})
                    areaList.push(area_Arr)
                }
                this.area = areaList
                // console.log('构建城市区域', this.area)
                this.cityOptions = areaArr.province()
            },
            // 根据方案详情的rIDs，例如: "广州市,深圳市",构建城市区域
            setCityAndArea(cityData) {
                let cityArr = cityData
                // console.log('cityArr',cityArr)
                let cityList = []
                for (let j = 0; j < cityArr.length; j++) {
                    console.log('用户cityArr', cityArr[j])
                    cityList.push({
                        rName: cityArr[j].label,
                        rid: cityArr[j].value
                    })
                }
                cityList = this.filterCity(cityList)
                console.log('cityList',cityList)
                this.city = cityList
                this.city.sort(this.compareFun)             // 排序
                this.activeCityData = this.city[0]        // 设置默认显示可选点城市的信息
                this.activeRName = this.activeCityData.rName
                // console.log('构建城市', this.city)
                let areaList = []
                for (let j = 0; j < cityList.length; j++) {
                    let area_Arr = areaArr.findArea(cityList[j].rid)
                    area_Arr.unshift({rid: cityList[j].rid, rName: '全市'})
                    areaList.push(area_Arr)
                }
                this.area = areaList
                // console.log('构建城市区域', this.area)
                this.cityOptions = areaArr.province()
            },
            delCommentCity(arr){
                // console.log('城市数组去重arr',arr)
                let o = {};
                let new_arr = []
                for (let i = 0; i < arr.length; i++) {
                    let k = arr[i]
                    if (!o[k]) {
                        o[k] = true;
                        new_arr.push(k)
                    }
                }
                return new_arr
            },
            // 根据用户权限与投放城市的交集，显示城市
            filterCity(cityData) {
                let FA_rIDs_arr = this.FAInfo.cityList
                // console.log('FA_rIDs_arr',FA_rIDs_arr,'cityData',cityData)
                let uRID = cityData
                let cityArr = []
                for (let i = 0; i < uRID.length; i++) {
                    for (let j = 0; j < FA_rIDs_arr.length; j++) {
                        if (uRID[i].rName == FA_rIDs_arr[j]) {
                            cityArr.push(uRID[i])
                        }
                    }
                }
                return cityArr
            },
            getAdList() {
                console.log('当前页码', this.pageNo, '当前时间', this.dateInput)
                this.loading = true
                let uid = this.sessionData.uID
                this.getAdsParamsData.dateTimeBegin = this.dateInput[0]
                this.getAdsParamsData.dateTimeEnd = this.dateInput[1]
                this.getAdsParamsData.pageNo = this.pageNo
                this.getAdsParamsData.pageSize = this.pageSize
                this.getAdsParamsData.mVehicle = this.mediaType
                this.getAdsParamsData.uid = this.sUID
                let params = {
                    "uid": uid,
                    "token": this.sessionData.token,
                    "service": "GetAdS",
                    "data": this.getAdsParamsData
                }
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('选点列表：', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登录超时
                    } else if (res.data.SysCode === 200200) {
                        if (res.data.data.list !== undefined && res.data.data.list.length > 0) {
                            this.planList = []
                            let ADList = res.data.data.list
                            this.setTableDataADDoor(ADList)
                            this.total = res.data.data.total
                            this.adsCount = res.data.data.adsCount
                            // this.pageNo++
                            // console.log(' this.pageNo++', this.pageNo)
                            this.judgeByselect()
                        } else {
                            this.planList = []
                        }
                        this.loading = false
                    } else {
                        this.$message.warning(res.data.MSG)
                        this.loading = false
                    }
                })
            },
            // 接口数据转成table
            setTableDataADDoor(ADSdata){
                // console.log(ADSdata);
                // console.log('接口数据转成table当前时间',this.dateInput)
                let i = 0
                for(let key of ADSdata) {
                    let adObj = {
                        mID: key.mID,
                        resType: key.resType,
                        resID: key.resID,
                        asIDs: key.asIDs,
                        asLabs: key.asLabs,
                        resName: key.resName,
                        city: this.city[this.activeIndex].rName,
                        rid: this.city[this.activeIndex].rid,
                        origin: key.rName,
                        buildType: key.cType,
                        houseNum: key.hNum,
                        buildPrice: (key.hPrice / 100),
                        mediaName: key.mTitle,
                        mVehicle: key.mVehicle,       // 媒体类型
                        mediaRemark: key.mRemark || '--',
                        parkSpaceNum: key.parkSpaceNum,
                        carFlow: key.carFlow,
                        peopleFlow : key.peopleFlow,
                        buildNum: key.fNum,
                        schedules: this.dateInput[0] + '-' + this.dateInput[1],
                        tradingArea: key.tradingArea || '',
                        assetTag: key.assetTag || '',
                        liveYear: key.chDay,
                        adLimit: key.notPush || '',
                        mState: key.mState === 1 ? '正常' : (key.mState === 2 ? '待安装' : '--'),
                        adSize: key.adSize || '',
                        picSize: key.picSize || '',
                        checkBox: {A: false, B: false,ABC:false},
                        box: {A: false, B: false},
                        asrID: key.asrID,                   // 所属公司id
                    }
                    if (key.asLabs.indexOf('A') === -1) {
                        adObj.box.A = true
                    }else {
                        //本页可选点位
                        i++;
                    }
                    if (key.asLabs.indexOf('B') === -1) {
                        adObj.box.B = true
                    }else {
                        //本页可选点位
                        i++;
                    }
                    // console.log('adObj',adObj)
                    this.planList.push(adObj)
                }
                console.log('表格数据',this.planList)
                this.currPageAsLength = i
                // this.loading = false
                this.loadScroll = true
            },
            setPageNoAndTableData(){
                this.loadScroll = false
                this.IsAll = false
                this.pageNo = 1
                this.planList = []
            },
            /*功能方法*/
            //step2搜索按钮
            searchFun() {
                console.log('搜索排期时间', this.dateInput)
                this.recType = 1
                this.areaName = '全市'
                this.loadScroll = true
                this.isOccupied = true      //  || this.dateInput !== this.beforeDate
                if (this.searchInput !== '') {
                    this.setPageNoAndTableData()
                    this.ResOriginSearch()
                } else if (this.searchInput === '' && this.dateInput !== this.beforeDate) {
                    this.setPageNoAndTableData()
                    this.getAdList()
                    this.beforeDate = this.dateInput
                }
            },
            // 资源名称\商圈搜索typeSelect
            ResOriginSearch() {
                if (this.selectValue === '资源名称'){
                    this.getAdsParamsData.resName = this.searchInput
                    this.getAdsParamsData.tradingArea = ''
                    this.getAdsParamsData.assetTag = ''
                }else if(this.selectValue === '商圈'){
                    this.getAdsParamsData.tradingArea = this.searchInput
                    this.getAdsParamsData.resName = ''
                    this.getAdsParamsData.assetTag = ''
                }else if(this.selectValue === '资产编号'){
                    this.getAdsParamsData.assetTag = this.searchInput
                    this.getAdsParamsData.tradingArea = ''
                    this.getAdsParamsData.resName = ''
                }
                this.getAdList()
            },
            // 当搜索框为空的时候进行重置显示
            initData(val){
                console.log('搜索框变化的值',val)
                if (!this.searchInput) {
                    this.isOccupied = true
                    this.getAdsParamsData.tradingArea = ''
                    this.getAdsParamsData.assetTag = ''
                    this.getAdsParamsData.resName = ''
                    this.setPageNoAndTableData()
                    this.getAdList()
                }
            },
            // step2, 资源类型切换
            activeRecType(num) {
                this.buildValue = ''
                this.getAdsParamsData.buildType = ''
                if(num == '1'){
                    this.buildType = this.village
                }else if(num == '2'){
                    this.buildType = this.officeBuilding
                }
                this.setPageNoAndTableData()
                this.recType = num
                this.getAdsParamsData.resType = num
                this.getAdList()
            },
            //媒体类型切换
            activeMediaType(mType){
                console.log('媒体类型',mType)
                this.setPageNoAndTableData()
                this.mediaType = mType
                this.getAdsParamsData.mVehicle = mType
                this.getAdList()
            },
            // tab切换城市
            activeCity(item, index) {
                console.log('item',item,'index',index)
                this.activeIndex = index
                this.activeRName = item.rName
                this.activeCityData = item
                this.areaName = '全市'
                this.getAdsParamsData.area = ''
                this.getAdsParamsData.prID = this.city[index].rid
                this.setPageNoAndTableData()
                this.getAdList()
            },
            //  stpe2, 切换区域
            activeArea(rName) {
                this.areaName = rName
                this.setPageNoAndTableData()
                if(this.areaName === '全市'){
                    this.getAdsParamsData.area = ''
                }else{
                    this.getAdsParamsData.area = rName
                }
                this.getAdList()
            },
            // 选点表格头部过滤条件tab删除方法
            filterTagCloseFun(tab,index){
                console.log('tab',tab,'index',index)
                if (tab.condition === 'mstate') {           // 媒体状态
                    this.mState = ''
                    this.getAdsParamsData.mState = ''
                } else if (tab.condition === 'ADLimit'){        // 广告限制
                    this.limitList = []
                    this.getAdsParamsData.adLimit = ''
                } else if (tab.condition === 'cType') {         // 楼盘类型
                    this.buildType = ''
                    this.getAdsParamsData.buildType = ''
                } else if (tab.condition === 'houseNum') {      // 住户数量
                    this.houseNum[0] = ''
                    this.houseNum[1] = ''
                    this.filterData.hNum = false
                    this.getAdsParamsData.houseNumMin = ''
                    this.getAdsParamsData.houseNumMax = ''
                } else if (tab.condition === 'buildPrice') {    // 楼盘价格
                    this.buildPrice[0] = ''
                    this.buildPrice[1] = ''
                    this.filterData.bPrice = false
                    this.getAdsParamsData.hPriceMin = ''
                    this.getAdsParamsData.hPriceMax = ''
                } else if (tab.condition === 'liveYear') {      // 入住年份
                    this.liveYear[0] = ''
                    this.liveYear[1] = ''
                    this.filterData.lYear = false
                    this.getAdsParamsData.liveYearMin = ''
                    this.getAdsParamsData.liveYearMax = ''
                } else if (tab.condition === 'peopleFlow') {    // 人流量
                    this.peopleFlow[0] = ''
                    this.peopleFlow[1] = ''
                    this.filterData.pFlow = false
                    this.getAdsParamsData.peopleFlowMin = ''
                    this.getAdsParamsData.peopleFlowMax = ''
                } else if (tab.condition === 'carFlow') {       // 车流量
                    this.carFlow[0] = ''
                    this.carFlow[1] = ''
                    this.filterData.cFlow = false
                    this.getAdsParamsData.carFlowMin = ''
                    this.getAdsParamsData.carFlowMax = ''
                } else if (tab.condition === 'parkSpaceNum') {      // 车位数
                    this.parkSpaceNum[0] = ''
                    this.parkSpaceNum[1] = ''
                    this.filterData.pSNum = false
                    this.getAdsParamsData.parkSpaceNumMin = ''
                    this.getAdsParamsData.parkSpaceNumMax = ''
                }
                this.filterCondition.splice(index,1)
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 判断是否存在该条件的tag
            isHaveThisTag(letter,tagName){
                console.log('letter',letter,'tagName',tagName)
                let isHave = false
                for(let i in this.filterCondition){
                    if(this.filterCondition[i].condition === letter){
                        isHave = true
                        this.filterCondition[i].name = tagName
                        break
                    }
                }
                if (!isHave) {
                    this.filterCondition.push({
                        name: tagName,
                        type: 'info',
                        condition: letter
                    })
                }
            },
            // 修改搜索中的媒体状态 filterCondition
            mStateChange(state) {
                if(this.selectValue !== '被占查询'){
                    console.log('切换媒体状态',state,this.mState)
                    let stateName = ''
                    if(state === '1'){
                        stateName = '正常'
                    }else{
                        stateName = '待安装'
                    }
                    this.isHaveThisTag('mstate',stateName)
                    if (stateName !== '不限') {
                        this.getAdsParamsData.mState  = state
                    }else{
                        this.getAdsParamsData.mState = ''
                    }
                    this.setPageNoAndTableData()
                    this.getAdList()
                }else{
                    this.$message.warning('被占查询状态下，无效切换!')
                }
            },
            // 广告限制切换
            activeADLimit(limit) {
                console.log('广告限制limit', limit) // 保险,恶俗医疗
                let limitText = limit.join(',')
                let stateName = '广告限制：' + limit.join('/')
                if(limit.length > 0){
                    this.isHaveThisTag('ADLimit',stateName)
                }else{
                    for(let i in this.filterCondition){
                        if(this.filterCondition[i].condition === 'ADLimit'){
                            this.filterCondition.splice(i,1)
                            break
                        }
                    }
                }
                this.getAdsParamsData.adLimit = limitText
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 住户数量过滤
            tableHeaderFilter_h() {
                let tagName = '住户数量:' + this.houseNum[0] + "-" + this.houseNum[1]
                this.isHaveThisTag('houseNum',tagName)
                this.filterData.hNum = true
                this.getAdsParamsData.houseNumMin = this.houseNum[0]
                this.getAdsParamsData.houseNumMax = this.houseNum[1]
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 楼盘价格过滤
            tableHeaderFilter_p() {
                let tagName = '楼盘价格:' + this.buildPrice[0] + "-" + this.buildPrice[1]
                this.isHaveThisTag('buildPrice',tagName)
                this.filterData.bPrice = true
                this.getAdsParamsData.hPriceMin = this.buildPrice[0] * 100
                this.getAdsParamsData.hPriceMax = this.buildPrice[1] * 100
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 年份过滤
            tableHeaderFilterByLiveYear() {
                let tagName = '入住年份:' + this.liveYear[0] + "-" + this.liveYear[1]
                this.isHaveThisTag('liveYear',tagName)
                this.filterData.lYear = true
                this.getAdsParamsData.liveYearMin = this.liveYear[0]
                this.getAdsParamsData.liveYearMax = this.liveYear[1]
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 楼盘类型过滤
            tableHeaderFilter_cType(data) {
                console.log('楼盘类型过滤',data)
                this.isHaveThisTag('cType',data)
                if(data === '全部'){
                    this.getAdsParamsData.buildType = ''
                }else{
                    this.getAdsParamsData.buildType = this.buildValue
                }
                this.setPageNoAndTableData()
                this.getAdList()
            },
            //人流量过滤
            tableHeaderFilterByPeopleFlow(){
                let tagName = '人流量:' + this.peopleFlow[0] + "-" + this.peopleFlow[1]
                this.isHaveThisTag('peopleFlow',tagName)
                this.filterData.pFlow = true
                this.getAdsParamsData.peopleFlowMin = this.peopleFlow[0]
                this.getAdsParamsData.peopleFlowMax = this.peopleFlow[1]
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 车流量过滤
            tableHeaderFilterByCarFlow(){
                let tagName = '车流量:' + this.carFlow[0] + "-" + this.carFlow[1]
                this.isHaveThisTag('carFlow',tagName)
                this.filterData.cFlow = true
                this.getAdsParamsData.carFlowMin = this.carFlow[0]
                this.getAdsParamsData.carFlowMax = this.carFlow[1]
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 车位数过滤
            tableHeaderFilterByParkSpaceNum(){
                let tagName = '车位数:' + this.parkSpaceNum[0] + "-" + this.parkSpaceNum[1]
                this.isHaveThisTag('parkSpaceNum',tagName)
                this.filterData.pSNum = true
                this.getAdsParamsData.parkSpaceNumMin = this.parkSpaceNum[0]
                this.getAdsParamsData.parkSpaceNumMax = this.parkSpaceNum[1]
                this.setPageNoAndTableData()
                this.getAdList()
            },
            emptyFun(letter) {       // 清空
                if (letter === 'H') {
                    this.houseNum = ['', '']
                } else if (letter === 'B') {
                    this.buildNum = ['', '']
                } else if (letter === 'P') {
                    this.buildPrice = ['', '']
                } else if (letter === 'Y') {
                    this.liveYear = ['', '']
                } else if (letter === 'PSN') {
                    this.carFlow = ['', '']
                } else if (letter === 'CF') {
                    this.parkSpaceNum = ['', '']
                } else if (letter === 'PF') {
                    this.peopleFlow = ['', '']
                }
            },
            // 表头过滤中的取消、确认按钮的显示隐藏
            haveFocus(l) {
                this.HSearch = l
                console.log('this.HSearch',this.HSearch )
            },
            // 选中A、B面的时候
            changeA(row) {
                let check = row
                if (check.checkBox.A) {
                    this.AddShopingInfo(row, 'A') // 添加到购物车
                } else {
                    this.IsAll = false
                    this.deleteShopRow(check, 'A')

                }
            },
            changeB(row) {
                let check = row
                if (check.checkBox.B === true) {
                    this.AddShopingInfo(row, 'B') // 添加到购物车
                } else {
                    this.IsAll = false
                    this.deleteShopRow(check, 'B')

                }
            },
            // 道闸点位选择
            changeABC(row){
                if (row.checkBox.ABC === true){
                    let obj = this.setShopingTable(row,'ABC')
                    this.shopingList.push(obj)
                }else{
                    this.deleteShopRow(row, 'ABC')

                }
                this.$emit('ievent',this.shopingList);
                this.IsAll = true
            },
            // 全选是放进购物车-广告门
            allSelectToShop_adDoor(){
                for (let i = 0; i < this.planList.length; i++) {
                    let info = this.planList[i]
                    for (let j = 0; j < 2; j++) {
                        let selectInfo = this.setShopingTable(info,'')
                        let asLabsArr = selectInfo.asLabs.split(',')
                        let asIDArr = selectInfo.asIDs.split(',')
                        if (j === 0 && !selectInfo.box.A) {
                            if (!info.checkBox.A) {
                                info.checkBox.A = true
                                selectInfo.A_B = 'A'
                                for (let n = 0; n < asLabsArr.length; n++) {
                                    if (asLabsArr[n] === 'A') {
                                        console.log('A', asIDArr[n])
                                        selectInfo.asID = asIDArr[n]
                                        break
                                    }
                                }
                                this.currPageSelect++
                                this.shopingList.push(selectInfo)
                            }

                        } else if (j === 1 && !selectInfo.box.B) {
                            if (!info.checkBox.B) {
                                info.checkBox.B = true
                                selectInfo.A_B = 'B'
                                for (let n = 0; n < asLabsArr.length; n++) {
                                    if (asLabsArr[n] === 'B') {
                                        console.log('B', asIDArr[n])
                                        selectInfo.asID = asIDArr[n]
                                        break
                                    }
                                }
                                this.currPageSelect++
                                this.shopingList.push(selectInfo)
                            }

                        }
                    }
                }
                console.log('广告门全选时购物车', this.shopingList)
                this.$emit('ievent',this.shopingList);
            },
            // 全选是放进购物车-道闸
            allSelectToShop_roadGate(){
                for (let pkey of this.planList){
                    if (!pkey.checkBox.ABC) {
                        pkey.checkBox.ABC = true
                        let selectInfo = this.setShopingTable(pkey,'ABC')
                        this.currPageSelect++
                        this.shopingList.push(selectInfo)
                    }

                }
                console.log('道闸全选时购物车', this.shopingList)
                this.$emit('ievent',this.shopingList);
            },
            // 表头全选
            allCheckboxAds(){
                console.log('allCheckboxAds',this.IsAll)
                if(this.IsAll){
                    this.allSelectAdsBtn()
                }else{
                    this.cancleSelectAds()
                }
            },
            // 表头勾选重置
            allCheckboxUpdata(){
                if( this.shopingList.length <= 0){
                    this.IsAll = false
                }else{
                    let isCheckBox = false
                    for(let key of this.planList){
                        if(key.checkBox.A || key.checkBox.B ||key.checkBox.ABC){
                            isCheckBox = true
                            break
                        }
                    }
                    if(!isCheckBox){
                        this.IsAll = false
                    }
                }
            },
            // 全选表格点位
            allSelectAdsBtn() {
                console.log('全选')
                // for (let pkey of this.planList) {
                //     if(this.mediaType === '广告门'){
                //         // 根据是否被占用去打勾
                //         if (!pkey.box.A) {
                //             pkey.checkBox.A = true
                //         }
                //         if (!pkey.box.B) {
                //             pkey.checkBox.B = true
                //         }
                //     }else if(this.mediaType === '道闸'){
                //         pkey.checkBox.ABC = true
                //     }
                // }
                if(this.mediaType === '广告门'){
                    this.allSelectToShop_adDoor()
                }else if(this.mediaType === '道闸'){
                    this.allSelectToShop_roadGate()
                }
                // this.allSelectToShop(selection)
            },
            //取消全选
            cancleSelectAds(){
                console.log('取消全选',this.planList)
                for(let pkey of this.planList){
                    if(pkey.checkBox.A || pkey.checkBox.B || pkey.checkBox.ABC){
                        for(let i=0; i<this.shopingList.length;){
                            if(pkey.mID === this.shopingList[i].mID){
                                if(pkey.checkBox.A && this.shopingList[i].A_B === 'A'){
                                    this.shopingList.splice(i,1)
                                    this.currPageSelect--
                                    pkey.checkBox.A = false
                                }else if (pkey.checkBox.B && this.shopingList[i].A_B === 'B'){
                                    this.shopingList.splice(i,1)
                                    this.currPageSelect--
                                    pkey.checkBox.B = false
                                }else if (pkey.checkBox.ABC && this.shopingList[i].A_B === 'ABC'){
                                    this.shopingList.splice(i,1)
                                    this.currPageSelect--
                                    pkey.checkBox.ABC = false
                                }else{
                                    i++
                                }
                            }else{
                                i++
                            }
                        }
                    }
                }
                // this.computeMedia_AD()
                // this.getBadeNumberByShopList()
                this.$emit('ievent',this.shopingList);
            },
            // 根据购物车已有的mID对应AB面判断勾选
            judgeByselect() {
                // console.log('judgeByselect')
                this.currPageSelect = 0
                if(this.shopingList.length > 0){
                    for (let i = 0; i < this.shopingList.length; i++){
                        this.hadADByshop(this.shopingList[i])
                    }
                    if (this.currPageSelect == this.currPageAsLength) {
                        this.IsAll = true
                    } else {
                        this.IsAll = false
                    }
                }
            },
            // planList的勾选
            hadADByshop(data) {
                let shopAD = data
                for(let key of this.planList){
                    if (key.city === shopAD.city){
                        if (key.mID === shopAD.mID) {
                            let crossIf = this.crossSchedules(shopAD.schedules)
                            if (crossIf) {
                                if (shopAD.A_B === 'A') {
                                    key.checkBox.A = true
                                    this.currPageSelect++
                                } else if (shopAD.A_B === 'B') {
                                    key.checkBox.B = true
                                    this.currPageSelect++
                                } else if (shopAD.A_B === 'ABC'){
                                    key.checkBox.ABC = true
                                    this.currPageSelect++
                                }
                                // if(!this.IsAll){
                                //     this.IsAll = true
                                // }
                                break
                            } else {
                                console.log('排期无交叉且不相等')
                            }
                        }
                    }else{
                        console.log('不同城市')
                    }
                }
            },
            // 重置planList的勾选
            resetPlanList() {
                console.log('重置planList的勾选开始')
                // for (let i = 0; i < this.planList.length; i++) {
                //     if (this.planList[i].checkBox.A || this.planList[i].checkBox.B || this.planList[i].checkBox.ABC) {
                //         console.log('有勾选')
                //         this.planList[i].checkBox.A = false
                //         this.planList[i].checkBox.B = false
                //         this.planList[i].checkBox.ABC = false
                //         // this.$refs.multipleTable.toggleRowSelection(this.planList[i], false)
                //     } else {
                //         // console.log('无勾选')
                //     }
                // }
                console.log('重置planList的勾选结束')
            },
            // 添加到购物车
            AddShopingInfo(info, letter) {
                console.log('选中的row信息', info)
                this.currPageSelect++
                let selectInfo = this.setShopingTable(info,letter)
                let asLabsArr = selectInfo.asLabs.split(',')
                let asIDArr = selectInfo.asIDs.split(',')
                if (letter == 'B') {
                    //  alert('B')
                    for (let n = 0; n < asLabsArr.length; n++) {
                        if (asLabsArr[n] === 'B') {
                            console.log('B', asIDArr[n])
                            selectInfo.asID = asIDArr[n]
                            break
                        }
                    }
                    this.shopingList.push(selectInfo)
                } else if (letter == 'A') {
                    for (let n = 0; n < asLabsArr.length; n++) {
                        if (asLabsArr[n] === 'A') {
                            console.log('A', asIDArr[n])
                            selectInfo.asID = asIDArr[n]
                            break
                        }
                    }
                    this.shopingList.push(selectInfo)
                }
                if (this.currPageSelect == this.currPageAsLength) {
                    this.IsAll = true
                } else {
                    this.IsAll = false
                }
                this.$emit('ievent',this.shopingList);
                // this.IsAll = true
            },
            // 选点列表数据到购物车数据
            setShopingTable(info,letter){
                let selectInfo = {
                    rid: info.rid,
                    mID: info.mID,
                    mVehicle: info.mVehicle,
                    asID: info.asIDs,//info.asIDs.split(','),
                    asIDs: info.asIDs,
                    asLabs: info.asLabs,
                    resName: info.resName,
                    resID: info.resID,
                    city: info.city,
                    origin: info.origin,
                    buildType: info.buildType,
                    houseNum: info.houseNum,
                    buildPrice: info.buildPrice,
                    mediaName: info.mediaName,
                    buildNum: info.buildNum,
                    schedules: info.schedules,
                    tradingArea: info.tradingArea,
                    assetTag: info.assetTag,
                    liveYear: info.liveYear,
                    adLimit: info.adLimit,
                    A_B: letter,
                    checkBox: {A: info.checkBox.A, B: info.checkBox.B,ABC:  info.checkBox.ABC},
                    box: {A:info.box.A,B:info.box.B},
                    asrID: info.asrID,                // 所属公司id
                }
                return selectInfo
            },
            // 取消全选时的购物车删除
            selectAlldelRow(rows) {
                for (let j = 0; j < this.shopingList.length; j++) {
                    if (this.shopingList[j].mID === rows.mID && this.shopingList[j].schedules === rows.schedules) {
                        this.shopingList.splice(j, 1)
                        break
                    }
                }
            },
            // 取消勾时,删除购物车里对应的数据行
            deleteShopRow(row, letter) {
                this.currPageSelect--
                for (let j = 0; j < this.shopingList.length; j++) {
                    if (this.shopingList[j].mID === row.mID && this.shopingList[j].A_B === letter) {
                        let crossIf = this.crossSchedules(this.shopingList[j].schedules)
                        if (crossIf) {
                            this.shopingList.splice(j, 1)
                            break
                        } else {
                            console.log('购物车中不存在相同点位')
                        }
                    }
                }
                this.allCheckboxUpdata()
            },
            /*公用方法*/
            //点位有时间交叉
            crossSchedules(sche) {
                let scheArr = sche.split('-')
                if (this.dateInput[0] == scheArr[0] && this.dateInput[1] == scheArr[1]) {
                    return true
                } else if (this.dateInput[0] < scheArr[0] && this.dateInput[1] >= scheArr[0]) {
                    return true
                } else if (this.dateInput[0] > scheArr[0] && this.dateInput[0] < scheArr[1]) {
                    return true
                } else if (this.dateInput[1] > scheArr[0] && this.dateInput[1] < scheArr[1]) {
                    return true
                } else if (this.dateInput[0] <= scheArr[1] && this.dateInput[1] > scheArr[1]) {
                    return true
                } else {
                    return false
                }
            },
            // 数组排序，城市rid从小到大排
            compareFun(obj1, obj2) {
                let val1 = obj1.rid;
                let val2 = obj2.rid;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            },
        }
    }
</script>

<style scoped>
    .otherSelect /deep/ .el-input__icon {
        line-height: unset;
    }
    /deep/ .el-table__fixed,/deep/ .el-table__fixed-right{
        height: 535px !important;
    }
    /deep/ .el-table__fixed-right{
        right: 6px !important;
    }
    /*/deep/ .el-table__fixed-right-patch{*/
        /*right: 8px !important;*/
    /*}*/
    /deep/ .selectAdsTable .el-table__empty-text{
        left:25%;
    }
    /deep/ .selectAdsTable .el-checkbox__label{
        padding-left: 4px ;
    }
    .adsTable{
        position: relative;
    }
    .myCheckbox{
        position: absolute;
        width: 100px;
        height: 54px;
        text-align: center;
        line-height: 54px;
        top:0;
        left: 0;
        z-index: 99;
    }
    .searchInput /deep/ .el-input__inner,
    .searchInput {
        width: 224px !important;
        position: relative;
        left: -1px;
        top: 0;
        height: 32px;
        border-left: none !important;
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }
    .flex_box /deep/ .el-input-group{
        width: 36%;
    }
    .input-with-select /deep/ .el-input__inner {
        font-size: 14px;
        vertical-align: middle;
        margin-right: 4px;
    }
    /* .search-wrap {
        position: relative;
        height: 34px;
    } */

    .flex_box{
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        position: relative;
    }
    /* /deep/.search_row .el-input__inner {
        width: 240px;
    } */
    /*面板*/
    .dw-panel {
        border: 1px solid #D8D8D8;
        /*margin-top: 30px;*/
        margin-top: 18px;
        padding: 0 18px 0 18px;
    }

    .dw-panel dl {
        border-bottom: 1px dashed #D8D8D8;
        line-height: 40px;
    }

    .dw-panel dt {
        display: inline-block;
        font-size: 14px;
        color: #999999;
        height: 40px;
    }

    .dw-panel .city-proper {
        padding-left: 75px;
        line-height: 34px;
    }

    .dw-panel dd {
        font-size: 14px;
        color: #666666;
        display: inline-block;
        line-height: 22px;
        padding: 3px 10px;
        cursor: pointer;
        margin-left: 6px;
    }

    .dw-panel dd.active {
        color: #1890FF;
        border: 1px solid #1890ff;
    }
    .dw-panel .other-dd{
        padding-left: 0px;
    }
    .otherSelect /deep/ .el-input__inner{
        width: 100px;
        height: 30px;
        padding-left: 10px;
        color: #1890FF;
        border-radius: 0;
        overflow: hidden;
    }
    .adLimitSelect /deep/ .el-select__tags > span{
        width: 68px;
        height: 28px;
        overflow: hidden;
    }
    .otherSelect /deep/ .el-tag{
        background: #fff;
        color: #1890FF;
    }
    .otherSelect /deep/ .el-input__inner:hover{
        color: #1890FF;
        border-color: #1890FF;
    }
    .otherSelectActive /deep/ .el-input__inner{
        border-color: #1890FF;
    }
    .otherSelectActive /deep/ .el-input .el-select__caret{
        color: #1890FF;
    }
    .otherBtn.el-button{
        width: 76px;
        height: 32px;
        padding: 0;
        border-radius: 0;
        color:rgba(0,0,0,0.35);
    }
    .otherBtn.el-button:hover{
        border-color: #1890FF;
    }
    .otherBtnActive.el-button{
        border-color: #1890FF;
        color: #1890FF;
    }
    .input-wrap{
        text-align: center;
    }
    .input-wrap .input{
        width:66px;
        height:26px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        border:1px solid rgba(194,194,194,1);
    }
    .input-wrap .input-wrap-Btn{
        width: 44px;
        height: 22px;
        margin-top: 6px;
        padding: 0;
        font-size: 12px;
        text-align: center;
        line-height: 22px;
        border-radius: 0;

    }
    /deep/ .input-wrap-Btn.el-button--primary span{
        left: 0;
    }
    /*筛选条件*/
    .filter-condition{
        width: 100%;
        height:36px;
        line-height: 36px;
        margin: 5px 0;
        background:rgb(241,241,241);
    }
    .filter-condition /deep/ .el-tag{
        background:rgba(255,255,255,1);
        border:1px solid rgba(0,0,0,0.1);
        color:rgba(0,0,0,0.35);
        margin-left: 10px;
    }
    .filter-condition /deep/ .el-tag:hover{
        color: #1890FF;
        border-color: #1890FF;
    }
    .filter-condition /deep/ .el-tag:hover .el-tag__close.el-icon-close{
        color: #1890FF;
    }
    /deep/ .el-tag__close.el-icon-close:hover{
        background: #fff;
    }

    /*表格*/
    /deep/ .el-table th,
    .el-table tr {
        background: #f7f7f7;
        padding: 7px 0;
    }

    /deep/ .el-table th > .cell {
        color: #666666;
        line-height: 14px;
        font-weight: bold;
    }
    .adDoor .el-checkbox {
        margin-right: 0;
    }
    /deep/ .el-checkbox + .el-checkbox {
        margin-left: 4px;
    }

    /deep/ .el-table__expanded-cell[class*="cell"] {
        padding: 0 44px;
        background-color: #f7f7f7;
    }

    /deep/ .el-table__expanded-cell[class*="cell"] .el-form {
        height: 44px;
        line-height: 44px;
    }

    /deep/ .el-form-item__content {
        line-height: 46px;
    }

    /deep/ .el-form-item__label {
        padding: 0 0 0 12px;
    }

    /deep/ .tar .cell {
        text-align: right !important;
        padding-right: 10px;
    }

    /deep/ .selectAdsTable .el-table__body-wrapper{
        /*min-width: 1744px;*/
        /*max-width: 1744px;*/
        overflow-x: auto !important;
    }
    /deep/ .selectAdsTable .el-checkbox__label{
        padding-left: 4px ;
    }
    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden !important;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background: #fafafa;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    }

    /deep/ .el-form--inline .el-form-item {
        margin-right: 45px;
    }

    /deep/ .el-table_3_column_26,
    /deep/ .el-table_3_column_27,
    /deep/ .el-table_1_column_9,
    .el-table_1_column_18,
    /deep/ .el-table_2_column_19 {
        text-align: right;
    }

    /deep/ .table_wrap.car-list {
        margin-top: 0 !important;
    }

    /*超出省略*/
    /deep/ .el-table .cell {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /deep/ .el-table__row td:nth-child(2) .cell span {
        width: 225px;
    }
    /deep/ .table_wrap .el-table__row td:nth-child(2) .cell span {
        width: 14px;
    }
    /deep/ .plan-select .el-input__inner {
        width: 180px;
        margin-left: -13px;
        height: 34px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
    }
    /deep/ .type-select .el-input__suffix{
        right: 3px;
    }
    /*日期控件*/
    .block {
        display: inline-block;
        margin-left: 2px;
        position: relative;
        /*top: 3px;*/
    }

    /deep/ .el-date-editor .el-range__icon {
        position: relative;
        top: 1px;
        margin-right: 2px;
    }

    /deep/ .el-range-separator {
        position: relative;
        top: -2px;
    }

    /deep/ .el-dialog /deep/ .el-input__inner {
        width: 260px;
        height: 34px;
        line-height: 34px;
    }

    /deep/ .el-range-editor .el-range-input {
        line-height: 20px;
    }

    /deep/ .el-dialog__body {
        padding: 5px 20px 0;

    }
    .imgPreview /deep/ .el-dialog__body{
        height: 640px;
    }
    .imgPreview /deep/ .el-dialog {
        height: 750px;
    }


    /deep/ .el-dialog__body img{
        width: 100%;
        height: 640px;
    }

    /deep/ .el-dialog__footer {
        padding: 20px 20px 20px;
    }

    /deep/ .el-pagination .el-select .el-input .el-input__inner {
        width: 100px;
    }

    /deep/ .el-pagination__editor.el-input .el-input__inner {
        width: 50px;
    }

    /deep/ .el-table__row td:nth-child(8),
    /deep/ .el-table__row td:nth-child(9),
    /deep/ .has-gutter th:nth-child(8),
    /deep/ .has-gutter th:nth-child(9) {
        text-align: left;
    }

    .adsTable /deep/ .has-gutter th:nth-child(12),
    .adsTable /deep/ .has-gutter th:nth-child(13),
    .adsTable /deep/ .has-gutter th:nth-child(17),
    .adsTable /deep/ .has-gutter th:nth-child(18),
    .adsTable /deep/ .has-gutter th:nth-child(19),
    .adsTable /deep/ .has-gutter th:nth-child(20),
        /*.adsTable /deep/ .el-table__row td:nth-child(11),*/
    .adsTable /deep/ .el-table__row td:nth-child(12),
    .adsTable /deep/ .el-table__row td:nth-child(13),
    .adsTable /deep/ .el-table__row td:nth-child(17),
    .adsTable /deep/ .el-table__row td:nth-child(18),
    .adsTable /deep/ .el-table__row td:nth-child(19),
    .adsTable /deep/ .el-table__row td:nth-child(20){
        text-align: right;
    }
    /*提示*/
    .tip {
        width: 100%;
        background: rgba(230, 247, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(145, 213, 255, 1);
        padding: 10px 16px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        margin: 8px 0;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
    }

    .tip span {
        color: #1890FF;
    }

    .tip /deep/ .el-icon-info {
        color: #1890ff;
        margin-right: 8px;
    }
</style>
