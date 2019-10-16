<template>
    <div>
        <!--地图标签-->
        <div id="qinlinMap" ref="qinlinMap" style=""></div>
        <!--左侧搜索-->
        <div class="left_search_box">
            <el-input placeholder="请输入内容" v-model="selectName" v-show="!isOnlineSearch"
                      @keydown.native="searchDown($event)"
                      class="input-with-select"
                      clearable
                      size="small">
                <el-select v-model="activeSearchKind" slot="prepend" placeholder="请选择">
                    <el-option
                        v-for="item in selOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchFun"></i>
            </el-input>
            <div class="search_body" v-show="(searchResList.length && activeSearchKind == '1') || isOnlineSearch">
                <div class="search_result_btn" v-show="isOnlineSearch">
                    <h4 class="result_title">框选结果</h4>
                    <div class="result_btn_box">
                        <span @click="setOnlineSearch">设置</span>
                        <span @click="clearSearch">取消</span>
                    </div>
                </div>
                <ul class="search_ul">
                    <li class="search_li" v-for="(item,index) in searchResList" :key="index">
                        <p class="li_name">
                            {{item.resName}}
                            <span class="li_name_span" :class="item.isSelect ? 'li_name_span_active' : ''" @click="checkBoxFun(item)">
                                <i v-show="item.isSelect" class="el-icon-minus"></i>
                                <i v-show="!item.isSelect" class="el-icon-plus"></i>
                                {{item.isSelect ? '取消' : '添加'}}
                            </span>
                        </p>
                        <p class="li_address">{{item.address || '宝安区后端利达路3号'}}</p>
                        <p>
                            <span class="li_p_span">{{item.districtName}}</span>
                            <span class="li_p_span">{{item.hNum}}</span>
                            <span class="li_p_span">&yen;{{item.hPrice / 100}}/m<sup>2</sup></span>
                            <span class="li_p_span" style="margin-right: 0">{{item.chDay}}年</span>
                        </p>
                    </li>
                </ul>
                <div class="search_bottom_btn">
                    <el-button plain size="small" @click="selectAllFun">添加全部</el-button>
                </div>
            </div>
            <div class="search_body" v-show="activeSearchKind == '2' && !isOnlineSearch"
                 v-loading="searchOnlineLoading"
                 element-loading-text="玩命加载中.."
                 element-loading-spinner="el-icon-loading">
                <ul class="search_ul">
                    <li class="search_li" v-for="(item,index) in searchOnlineList" :key="index">
                        <p class="li_name li_name_online">
                            {{item.title}}
                            <el-checkbox v-model="item.isSelect" @change="onlineCheckBox(item)"></el-checkbox>
                        </p>
                        <p class="li_address">{{item.address}}</p>
                    </li>
                </ul>
                <div class="search_bottom_btn">
                    <el-checkbox v-model="isAllSelectOnline" @change="onlineSelectAll()"></el-checkbox>
                    <span class="online_search_span"> 全选<span style="color:#1890FF"> {{searchOnlineList.length}}</span> 个</span>
                    <el-button plain size="small" class="online_search_btn" @click="canceAllOnline">取消</el-button>
                    <el-button size="small" type="primary" class="online_search_btn" @click="onlineConfirm">确定</el-button>
                </div>
            </div>
        </div>
        <!--顶部过滤条件-->
        <div class="top_filter_box">
            <!--区域-->
            <el-select v-model="selectArea" size="small" placeholder="请选择"
                       collapse-tags
                       multiple
                       clearable
                       @change="filterArea">
                <el-option
                    v-for="item in areaList"
                    :key="item.rID"
                    :label="item.rName"
                    :value="item.rID">
                </el-option>
            </el-select>
            <!--楼盘类型-->
            <el-select v-model="bType" size="small" placeholder="楼盘类型" @change="filterBuildType">
                <el-option v-for="item in buildTypeList" :key="item.buildValue"
                           :label="item.buildValue"
                           :value="item.buildValue">
                </el-option>
            </el-select>
            <!--楼盘价格-->
            <el-popover
                placement="bottom-start"
                width="150"
                trigger="click"
                popper-class="filter-popper">
                <div class="popover_body">
                    <ul class="filter_ul">
                       <li v-for="key of priceList" @click="selectNum(key,'price')">{{key}}</li>
                    </ul>
                    <div class="input_wrap">
                        <input type="text" class="filter_input" v-model="buildPrice[0]">
                        -
                        <input type="text" class="filter_input" v-model="buildPrice[1]">
                    </div>
                    <div class="popover_footer_btn">
                        <el-button @click="emptyFun('price')" class="popover_btn">清 除</el-button>
                        <el-button type="primary" class="popover_btn" @click="filterBuildPrice()" >确 定</el-button>
                    </div>
                </div>
                <el-button plain slot="reference" class="otherBtn">
                    {{filterData.bPrice ? ('¥' + buildPrice[0] + '-¥' + buildPrice[1]) : '楼盘价格'}}
                </el-button>
            </el-popover>
            <!--住户数量-->
            <el-popover
                placement="bottom-start"
                width="150"
                trigger="click"
                popper-class="filter-popper">
                <div class="popover_body">
                    <ul class="filter_ul">
                        <li v-for="key of houseList" @click="selectNum(key,'house')">{{key}}</li>
                    </ul>
                    <div class="input_wrap">
                        <input type="text" class="filter_input" v-model="houseNum[0]">
                        -
                        <input type="text" class="filter_input" v-model="houseNum[1]">
                    </div>
                    <div class="popover_footer_btn">
                        <el-button @click="emptyFun('house')" class="popover_btn">清 除</el-button>
                        <el-button type="primary" class="popover_btn" @click="filterHouseNum()" >确 定</el-button>
                    </div>
                </div>
                <el-button plain slot="reference" class="otherBtn">
                    {{filterData.hNum ? (houseNum[0] + '户-' + houseNum[1]) + '户' : '住户数量'}}
                </el-button>
            </el-popover>
            <!--入住年份-->
            <el-popover
                placement="bottom-start"
                width="150"
                trigger="click"
                popper-class="filter-popper">
                <div class="popover_body">
                    <ul class="filter_ul">
                        <li v-for="key of liveYearList" @click="selectNum(key,'year')">{{key}}</li>
                    </ul>
                    <div class="input_wrap">
                        <input type="text" class="filter_input" v-model="liveYear[0]">
                        -
                        <input type="text" class="filter_input" v-model="liveYear[1]">
                    </div>
                    <div class="popover_footer_btn">
                        <el-button @click="emptyFun('liveYear')" class="popover_btn">清 除 </el-button>
                        <el-button type="primary" class="popover_btn" @click="filterLiveYear()" >
                            确 定
                        </el-button>
                    </div>
                </div>
                <el-button plain slot="reference" class="otherBtn">
                    入住年份
                </el-button>
            </el-popover>
            <!--广告限制-->
            <el-select placeholder="广告限制" size="small" multiple v-show="showMore"
                       collapse-tags
                       v-model="selectLimits"
                       @change="filterADLimit">
                <el-option
                    v-for="item in ADLimit"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!--所在商圈-->
            <el-select placeholder="所在商圈" size="small"v-model="selectTradingArea" v-show="showMore"
                       @change="filterTradingArea">
                <el-option
                    v-for="item in tradingAreaList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!--媒体类型-->
            <el-select placeholder="媒体类型" size="small" v-model="selectDoorType" v-show="showMore"
                       @change="filterDoorType">
                <el-option
                    v-for="item in doorTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!--媒介载体-->
            <el-select placeholder="媒介载体" size="small" v-model="selectMediaType"v-show="showMore"
                       @change="filterMediaType">
                <el-option label="广告门" value="广告门"></el-option>
                <el-option label="道闸" value="道闸"></el-option>
            </el-select>
            <!--媒体等级-->
            <el-select placeholder="媒体等级" size="small" v-model="selectMediaLevel" v-show="showMore"
                       @change="filterMediaLevel">
                <el-option label="A级" value="A"></el-option>
                <el-option label="B级" value="B"></el-option>
                <el-option label="C级" value="C"></el-option>
            </el-select>
            <el-button size="small" plain @click="showMore = !showMore" class="top_filter_btn">
                {{showMore ? '收起' : '更多'}}
                <i :class="showMore ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>
            </el-button>
            <el-button size="small" plain @click="clearFilter" class="top_filter_btn">清空条件</el-button>
        </div>
        <!--底部左侧选中-->
        <div class="bottom_left_active">
            <div class="bottom_left_header">
                <span class="active_num">
                    已添加<span style="color:rgba(24, 144, 255, 1)"> {{selectResList.length}} </span>个资源
                </span>
                <span class="active_arrow" :class="showSelectList ? '' : 'active_arrow_hide'" @click="showSelectList = !showSelectList">
                    <i class="el-icon-d-arrow-left"></i>
                    {{showSelectList ? '收起' : '展开'}}
                </span>
            </div>
            <ul class="active_ul" v-show="showSelectList">
                <li class="active_li" v-for="(item,index) in selectResList" :key="index">
                    <p class="active_li_resName">{{item.resName}}</p>
                    <i class="el-icon-delete" @click="deleteRes(item)"></i>
                </li>
            </ul>
            <div class="active_bottom_btn">
                <span><i class="el-icon-share"></i>分享</span>
                <span><i class="el-icon-download" @click="exportExcel"></i>下载</span>
                <span @click="deleteAll"><i class="el-icon-delete"></i>清空</span>
            </div>
        </div>
        <!--标注info框-->
        <div class="res_info_window" ref="resInfoWindow" v-show="isShowInfo">
            <div class="res_info_header">
                <h3>{{ showResInfo.resName}}</h3>
                <p>{{ showResInfo.address || '宝安区后端利达路3号'}}</p>
            </div>
            <ul class="res_info_content">
                <li class="res_info_content_li">商圈:<span>{{showResInfo.tradingArea || '--'}}</span></li>
                <li class="res_info_content_li">楼栋数量:<span>{{showResInfo.buildingNum || '--'}}</span></li>
                <li class="res_info_content_li">住户数量:<span>{{showResInfo.hNum || '--'}}</span></li>
                <li class="res_info_content_li">楼盘价格:<span>¥{{showResInfo.hPrice / 100 || '--'}}/㎡</span></li>
                <li class="res_info_content_li">楼盘类型:<span>{{showResInfo.hType || '--'}}</span></li>
                <li class="res_info_content_li">入住时间:<span>{{showResInfo.chDay || '--'}}年</span></li>
                <li class="res_info_content_li">人流量:<span>{{showResInfo.peopleFlow || 0}}/人次/天</span></li>
                <li class="res_info_content_li">广告限制:<span>{{showResInfo.notPush || '--'}}</span></li>
                <li class="res_info_content_li">点位备注:<span>{{showResInfo.notPush || '--'}}</span></li>
                <li class="res_info_content_li">车流量:<span>{{showResInfo.carFlowrate || 0}}</span></li>
                <li class="res_info_content_li">车位数:<span>{{showResInfo.carNumber || 0}}</span></li>
                <li class="res_info_content_li">出入口数:<span>{{showResInfo.EntryExitNum || '--'}}</span></li>
            </ul>
            <div class="res_info_footer">
                <el-button type="primary" @click="addResFun(showResInfo)">
                    {{showResInfo.isSelect ? '取消待选' : '加入待选'}}
                </el-button>
            </div>
            <div class="info_window_left">
                左侧广告门
            </div>
        </div>
        <!--框选条件-->
        <el-dialog
            title="框选条件"
            :visible.sync="searchDialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            width="360px"
            custom-class="map_dialog">
            <div class="around_search_body">
                <p>
                    <span class="p_span">框选方式：</span>
                    <el-radio v-model="aroundSearchInfo.searchRadio" :label="1">辐射圈并集</el-radio></p>
                <p>
                    <span class="p_span">框选范围：</span>
                    <el-slider class="p_slider" v-model="aroundSearchInfo.searchRadius"></el-slider>
                    <el-input class="radius_input" placeholder="请输入半径" size="small"
                              @change="changeInput"
                              v-model="aroundSearchInfo.searchRadius"></el-input>
                    <span>km</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button plain size="small" @click="searchDialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="searchAround">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import resData from "../../commonFun/json/guangzhouAds"
    import areaPackage from "../../commonFun/areaPackage_new";
    import sessFun from "../../commonFun/sessFun";
    import timeFormat from "../../commonFun/timeFormat"
    import api from "../../api/api"
    export default {
        name: "qinLinMap",
        data() {
            return{
                sessionData: sessFun.getSess(),
                resMap: '',
                markerIcon: require('../../assets/images/map/markerIcon.png'),
                dateTime:[],
                // 当前显示到小区数据
                resInfo:[],
                // 搜索到关键词
                selectName: '',
                // 搜索类型 1->亲邻社区，2->在线结果
                activeSearchKind: '1',
                selOptions: [
                    {
                        value: '1',
                        label: '亲邻社区'
                    }, {
                        value: '2',
                        label: '在线结果'
                    }
                ],
                // 选择的亲邻社区列表
                selectResList: [],
                // 搜索的资源列表
                searchResList: [],
                /* 在线搜索 */
                // 在线搜索到list
                searchOnlineList:[],
                // 在线搜索是否全选状态
                isAllSelectOnline: false,
                // 在线搜索输入范围
                searchDialogVisible: false,
                // 搜索中
                searchOnlineLoading: false,
                // 在线搜索勾选到值
                selectOnlineList: [],
                // 周边搜索条件
                aroundSearchInfo:{
                    searchRadio:  1,
                    searchRadius: 1,
                },
                // 标识在线搜索结果状态
                isOnlineSearch: false,
                // 收起/展开
                showSelectList: true,
                // 是否显示小区详情
                isShowInfo: false,
                // 被点击的资源标注信息
                showResInfo:{},
                /*顶部过滤条件*/
                // 记录判断含有哪些表头的过滤条件
                filterData: {
                    hNum:false,
                    bNum:false,
                    bPrice:false,
                    lYear: false,
                    pFlow: false,
                    cFlow: false,
                    pSNum: false,
                },
                // 显示更多过滤条件
                showMore: false,
                // 区域下拉
                areaList: [],
                // 选择到区域
                selectArea: [],
                // 楼盘类型
                bType:[],
                // 楼盘类型下拉
                buildTypeList: [
                    {buildlabel: '高端住宅', buildValue: '高端住宅'},
                    {buildlabel: '中端住宅', buildValue: '中端住宅'},
                    {buildlabel: '普通住宅', buildValue: '普通住宅'},
                    {buildlabel: '单体楼', buildValue: '单体楼'},
                    {buildlabel: '别墅', buildValue: '别墅'},
                    {buildlabel: '洋房', buildValue: '洋房'},
                    {buildlabel: '商住', buildValue: '商住'}
                ],
                // 广告限制
                ADLimit: [],
                // 住户数量
                houseNum: ['', ''],
                // 住户数量li
                houseList:['50-99','100-199','200-499','500-999'],
                // 楼栋价格
                buildPrice:['',''],
                // 楼盘价格li
                priceList:['5000-9999','10000-20000','20000-30000','30000-40000'],
                // 入住年份
                liveYear: ['',''],
                // 入住年份li
                liveYearList:['1990-1999','2000-2005','2006-2010','2011-2019'],
                // 搜索人流量
                peopleFlow: ['',''],
                // 广告限制
                selectLimits:[],
                // 所在商圈
                tradingAreaList:[],
                // 选择到商圈
                selectTradingArea: '',
                // 媒体类型
                doorTypeList: [],
                // 选择到媒体类型
                selectDoorType: '',
                // 媒介载体
                selectMediaType: '',
                // 媒体等级
                selectMediaLevel: '',
            }
        },
        mounted() {
            let starTime, endTime
            starTime = timeFormat.returnDayCount(1,'/')
            endTime = timeFormat.returnDayCount(14,'/')
            this.dateTime = [starTime, endTime]                // 设置默认时间
            this.getAreaList();
            window.onload = this.initMap()
            // 获取小区数据
            this.getResList()
            // 获取商圈list
            this.getTradingArea()
            // 获取媒体类型(门类型)
            this.getDoorType()
            // 获取广告限制列表
            this.getADLimit();
        },
        methods:{
            // 城市区域
            getAreaList() {
                this.areaList = areaPackage.findArea('440100')
            },
            // 获取广告限制列表
            getADLimit() {
                let params = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service": "GetNotPush",
                    "data": {}
                }
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('广告限制列表', res)
                    if (res.data.SysCode === 200200) {
                        let limits = res.data.data
                        let limitArr = []
                        for (let key of limits) {
                            limitArr.push({
                                value: key.nTitle,
                                label: key.nTitle
                            })
                        }
                        this.ADLimit = limitArr
                    } else {
                        sessFun.messageFun('warning', '广告限制获取异常！')
                    }
                })
            },
            // 获取商圈
            getTradingArea() {
                let params = {
                    cityId: '440100'
                }
                api.getApi(this.apiVar.mapApi + '/tradingAreaList',params).then(res=>{
                    if (res.data.SysCode === 200200) {
                        this.tradingAreaList = res.data.data.map((item)=>{
                            return {
                                value: item,
                                label: item
                            }
                        })
                    } else {
                        sessFun.messageFun('warning', '商圈数据获取异常！')
                    }
                })
            },
            // 获取媒体类型(门类型)list
            getDoorType() {
                api.getApi(this.apiVar.mapApi + '/mediaType',{}).then(res=>{
                    if (res.data.SysCode === 200200) {
                        this.doorTypeList = res.data.data.map((item)=>{
                            return {
                                value: item,
                                label: item
                            }
                        })
                    } else {
                        sessFun.messageFun('warning', '商圈数据获取异常！')
                    }
                })
            },
            // 初始化地图
            initMap() {
                console.log('初始化地图----')
                // 创建Map实例
                this.resMap = new BMap.Map("qinlinMap", {enableMapClick:false});
                console.log('resMap',this.resMap)
                // 初始化地图,设置中心点坐标和地图级别
                this.resMap.centerAndZoom(new BMap.Point(113.36133,23.13129), 12);//11
                // 设置地图显示的城市 此项是必须设置的
                this.resMap.setCurrentCity("广州市");
                //开启鼠标滚轮缩放
                this.resMap.enableScrollWheelZoom(true);
                let myStyleJson = [
                    {
                        "featureType": "land",
                        "elementType": "geometry.stroke",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "point",
                        "elementType": "geometry.stroke",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "building",
                        "elementType": "geometry.stroke",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                ]
                this.resMap.setMapStyle({styleJson: myStyleJson })
                // 监听点击地图
                this.resMap.addEventListener("click", () => {
                    console.log('监听点击地图---')
                    this.isShowMediaInfo = false
                });
                // 初始化鼠标绘制
                // this.initMouseDrawing()
                // 城市边界
                this.displayBoundary()
            },
            // 城市边界
            displayBoundary() {
                let json;
                console.log('areaList',this.areaList)
                for(let key of this.areaList) {
                    json = {color : "#F1627A",name : key.rName}
                    this.getBoundary(json);
                }
            },
            // 边界覆盖物
            getBoundary(json) {
                let _Boundary = new BMap.Boundary();
                // let that = this
                _Boundary.get(json.name, (rs)=> {               // 获取行政区域
                    let count = rs.boundaries.length;           // 行政区域的点有多少个
                    for (let i = 0; i < count; i++) {
                        let ply = new BMap.Polygon(rs.boundaries[0], {
                            strokeWeight: 2,
                            strokeOpacity: 1,
                            strokeColor: json.color,
                            fillColor: json.color,      // 控制覆盖物的颜色
                            fillOpacity: 0.000001       // 控制覆盖物的透明度
                        }); //建立多边形覆盖物
                        this.resMap.addOverlay(ply);    // 添加覆盖物
                    }
                });
            },
            // 获取小区数据
            getResList() {
                let params = {
                    startTime: this.dateTime[0],
                    endTime: this.dateTime[1],
                    cityId: '440100',
                    suID: this.sessionData.uID,             // 销售uid
                    resName: '',
                    districtId: this.selectArea.join(','),  // 区域
                    cType: this.bType,                      // 楼盘类型
                    minhPrice: this.buildPrice[0] * 100,
                    maxhPrice: this.buildPrice[1] * 100,
                    minhNum: this.houseNum[0],
                    maxhNum: this.houseNum[1],
                    minchDay: this.liveYear[0],
                    maxchDay: this.liveYear[1],
                    tradingArea: this.tradingArea,
                    adLimit: this.selectLimits.join(','),
                    mType: this.selectDoorType,
                    mVehicle: this.selectMediaType,
                    grade: this.selectMediaLevel
                }
                for(let i in params) {
                    if(!params[i]) {
                        delete params[i]
                    }
                }
                api.getApi(this.apiVar.mapApi + '/resList',params).then(res=>{
                    this.resMap.clearOverlays()
                    if(res.data.SysCode === 200200) {
                        this.resInfo = res.data.data
                        this.creatMarker()
                        this.judgeByselect()
                        console.log('resInfo',this.resInfo)
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                    }
                }).catch(err=>{
                    console.log('err',err)
                    sessFun.messageFun('warning','小区数据接口异常')
                })
            },
            // 根据购物车已有的resID判断勾选
            judgeByselect() {
                for (let key of this.selectResList) {
                    for (let rKey of this.resInfo) {
                        if (key.resID === rKey.resID) {
                            let point = new BMap.Point(key.lng, key.lat);
                            // 圈起标识
                            this.createCircle(key.resID,point)
                            rKey.isSelect = true
                            break
                        }
                    }
                }
                console.log('selectResList',this.selectResList)
            },
            // 创建标注
            creatMarker() {
                let i = 0
                for(let key of this.resInfo) {
                    this.$set(key, "isSelect", false);
                    if(i < 1000) {
                        let point = new BMap.Point(key.lng, key.lat);
                        let myIcon = new BMap.Icon(this.markerIcon, new BMap.Size(16,16),{
                            anchor: new BMap.Size(8, 8)
                        });
                        let marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                        let label = new BMap.Label(key.resName,{offset:new BMap.Size(-20,-16)});
                        label.setStyle({
                            borderRadius: "3px",
                            boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.15)',
                            border: 'none',
                            background: 'rgba(255,255,255,1)',
                            color: 'rgba(0,0,0,0.85)',
                            padding: '2px 4px'
                        });
                        marker.setLabel(label);
                        marker.setTop(true);
                        this.resMap.addOverlay(marker);              // 将标注添加到地图中
                        label.addEventListener("click",()=>{
                            this.showInfo(key,point)
                        });
                    } else {
                        break
                    }
                    i++
                }
            },
            // 显示详情
            showInfo(info,point){
                this.showResInfo = info
                let content = this.$refs.resInfoWindow
                let opts = {
                    width: 180,             // 信息窗口宽度
                    height: 320,              // 信息窗口高度
                    title: "",              // 信息窗口标题
                    enableMessage: false    //设置允许信息窗发送短息
                }
                let infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
                this.resMap.openInfoWindow(infoWindow,point);        //开启信息窗口
                console.log('-----',content.parentNode)
                this.isShowInfo = true
            },
            // 详情里选定按钮
            addResFun(item) {
                this.checkBoxFun(this.showResInfo)
            },
            /**
            *  左侧搜索
            **/
            // enter键
            searchDown(ev){
                console.log('回车----')
                let e = ev || window.ev;
                if (e.keyCode === 13) {
                    this.searchFun()
                }
            },
            // 搜索
            searchFun() {
                console.log('在线搜索----',this.activeSearchKind)
                if(!this.selectName) {
                    sessFun.messageFun('warning','请输入关键字！')
                    return
                }
                if(this.activeSearchKind == '1') {
                    // 亲邻社区搜索
                    this.searchResList = this.resInfo.filter((item,index) => {
                        if (item.resName.includes(this.selectName)) {
                            return item
                        }
                    })
                } else {
                    // 在线搜索
                    this.onlineSearchFun()
                }
            },
            // 在线搜索
            onlineSearchFun(){
                this.searchOnlineLoading = true
                console.log('在线搜索----')
                let resultArray = []
                let options = {
                    onSearchComplete: (results) => {
                        // 判断状态是否正确
                        if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                            let totalResults = results.getNumPois();
                            let totalPages = results.getNumPages();
                            let currPage = results.getPageIndex();// 获取当前是第几页数据
                            for (let i = 0; i < results.getCurrentNumPois(); i++) {
                                //在当前页面下获取页面中的内容
                                resultArray.push({
                                    id: results.getPoi(i).uid,
                                    title: results.getPoi(i).title,
                                    address: results.getPoi(i).address,
                                    city: results.getPoi(i).city,
                                    province: results.getPoi(i).province,
                                    point: results.getPoi(i).point,
                                })
                            }
                            if (currPage < totalPages - 1) {
                                // 遍历到最后一页之后不再进行下一页搜索，此时，已经获取到全部的搜索结果
                                local.gotoPage(results.getPageIndex() + 1);
                            } else {
                                this.searchOnlineList = resultArray
                                this.onlineResultsMarker()
                                console.log("全部结果有：", resultArray, "------原本搜索结果有：", totalResults);
                            }
                        }
                    },
                    pageCapacity: 50
                };
                let local = new BMap.LocalSearch(this.resMap, options);
                local.search(this.selectName);
            },
            // 在线结果打点
            onlineResultsMarker() {
                let i = 0
                for (let key of this.searchOnlineList) {
                    if (i < 100) {
                        let myIcon = new BMap.Icon(require('../../assets/images/map/onlineIcon.png'), new BMap.Size(32,32),{
                            anchor: new BMap.Size(16, 16)
                        });
                        let marker = new BMap.Marker(key.point,{icon:myIcon});  // 创建标注
                        marker.setTop(true);
                        this.resMap.addOverlay(marker);            // 将标注添加到地图中
                        marker.addEventListener("click", () => {
                            let content =
                                "<div>" +
                                "<p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>"
                                + key.title + "</p>" +
                                "<p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>" +
                                "地址:" + key.address + "</p>" +
                                "</div>";
                            // 信息窗口
                            let opts = {
                                width: 0,
                                height: 0,
                                title: "",
                                enableMessage: false    //设置允许信息窗发送短息
                            }
                            let infoWindow = new BMap.InfoWindow(content, opts);    // 创建信息窗口对象
                            this.resMap.openInfoWindow(infoWindow, key.point);      //开启信息窗口
                        });
                    } else {
                        break
                    }
                    i++
                }
                this.searchOnlineLoading = false
            },
            // 亲邻社区全选
            selectAllFun(){
                for(let key of this.searchResList) {
                    if(!key.isSelect) {
                        key.isSelect = true
                        this.selectResList.push(key)
                    }
                }
                console.log('全选',this.selectResList)
            },
            // 在线全选
            onlineSelectAll() {
                if(this.isAllSelectOnline) {
                    for(let key of this.searchOnlineList) {
                        key.isSelect = true
                    }
                } else {
                    this.canceAllOnline()
                }

            },
            // 取消在线选择
            canceAllOnline() {
                for(let key of this.searchOnlineList) {
                    key.isSelect = false
                }
            },
            // 勾选/取消
            checkBoxFun(item) {
                console.log('亲邻item', item)
                if (item.isSelect) {
                    // 取消选定
                    this.deleteRes(item)
                } else {
                    // 选定
                    let point = new BMap.Point(item.lng, item.lat);
                    // 圈起标识
                    this.createCircle(item.resID, point)
                    item.isSelect = true
                    // 添加到选中列表
                    this.pushSelectList(item)
                }
            },
            // 添加到选中列表
            pushSelectList(item) {
                this.selectResList.push(item)
            },
            // 在线勾选/取消
            onlineCheckBox(item) {
                console.log('在线item', item)
                if(item.isSelect) {
                    // 圈起标识
                    this.createCircle(item.id,item.point)
                } else {
                    this.deleteCircle(item.id)
                }
            },
            // 画圆标识选中状态
            createCircle(id,point){
                console.log('id,point',id,point)
                let opts = {
                    position : point,    // 指定文本标注所在的地理位置
                    offset   : new BMap.Size(-28, -32)    //设置文本偏移量
                }
                let label = new BMap.Label(id, opts);  // 创建文本标注对象
                label.setStyle({
                    color : "rgba(0,0,0,0)",
                    fontSize : "12px",
                    height : "48px",
                    width: "48px",
                    background: 'rgba(0,0,0,0)',
                    border: "3px solid #1890FF",
                    borderRadius: "50%"
                });
                this.resMap.addOverlay(label);
                console.log('label',label,label.content)
            },
            // 删除覆盖物
            deleteCircle(id) {
                let allOverlay = this.resMap.getOverlays();
                console.log('allOverlay',allOverlay)
                for (let i = 0; i < allOverlay.length; i++) {
                    if (allOverlay[i].content == id) {
                        this.resMap.removeOverlay(allOverlay[i]);
                        break;
                    }
                }
            },
            // 在线搜索确定
            onlineConfirm() {
                this.selectOnlineList = this.searchOnlineList.filter(item=>{
                    if(item.isSelect) {
                        return item
                    }
                })
                if(this.searchOnlineList.length) {
                    this.searchDialogVisible = true
                } else {
                    sessFun.messageFun('warning','请勾选信息')
                }
            },
            changeInput() {
                this.aroundSearchInfo.searchRadius = Number(this.aroundSearchInfo.searchRadius)
            },
            // 周边搜索
            searchAround() {
                console.log('this.selectOnlineList',this.selectOnlineList)
                let radius = this.aroundSearchInfo.searchRadius * 1000
                for (let key of this.selectOnlineList) {
                    let circle = new BMap.Circle(key.point, radius, {
                        strokeColor: 'rgba(24,144,255,1)',
                        fillColor: 'rgba(24,144,255,0.15)',
                        strokeWeight: 2,
                        fillOpacity: 1,
                        strokeOpacity: 1
                    });
                    this.resMap.addOverlay(circle);
                    this.showResInCircle(key, radius)
                    this.searchDialogVisible = false
                    this.isOnlineSearch = true
                }
            },
            // 显示圆半径内的小区
            showResInCircle(data,radius) {
                let date1 = new Date();
                let point = data.point
                let allOverlay = this.resMap.getOverlays();
                for(let key of this.resInfo) {
                    for (let akey of allOverlay) {
                        if( akey.toString() == "[object Marker]" &&
                            akey.getLabel() &&
                            akey.getLabel().content === key.resName) {
                            let point2 = new BMap.Point(key.lng, key.lat);
                            let distance = this.resMap.getDistance(point, point2)
                            // 是否在半径内
                            if (distance > radius) {
                                // 多个圆时
                                key.show ? akey.show() : akey.hide()
                            } else {
                                key.show = true
                                akey.show()
                                let flag = this.searchResList.some((item, index) => {
                                    if (key.resID === item.resID) {
                                        return true
                                    }
                                })
                                let centerInfo = {
                                    address: data.address,
                                    city: data.city,
                                    point: data.point,
                                    title: data.title
                                }
                                if (flag) {
                                    key.mapCenter.push(centerInfo)
                                } else {
                                    key.mapCenter = [centerInfo]
                                    this.searchResList.push(key)
                                }
                            }
                            break
                        }
                    }
                }
                let date2 = new Date();
                let haomiao = date2.getTime() - date1.getTime();
                console.log('用时',haomiao/(1000*60))
            },
            // 重新设置在线搜索
            setOnlineSearch() {
                this.searchDialogVisible = true
                // 移除
                let allOverlay = this.resMap.getOverlays();
                for (let akey of allOverlay) {
                    if (akey.toString() == "[object Circle]" || akey.toString() == "[object Polygon]") {
                        this.resMap.removeOverlay(akey);
                    }
                }
            },
            // 取消在线搜索
            clearSearch() {
                this.isOnlineSearch = false
                let allOverlay = this.resMap.getOverlays();
                for (let akey of allOverlay) {
                    akey.show()
                }
                // 移除
                for (let key of this.selectOnlineList) {
                    this.deleteCircle(key.id)
                }
            },
            /**
             *  顶部过滤条件
             * */
            selectNum(item,temp) {
                console.log('item,temp',item,temp)
                let datas = item.split('-')
                console.log(datas)
                if(temp === 'price') {
                    this.buildPrice = datas
                } else if (temp === 'house') {
                    this.houseNum = datas
                } else if (temp === 'year') {
                    this.liveYear = datas
                }
                this.getResList()
            },
            // 区域
            filterArea() {
                console.log('区域',this.selectArea)
                if (this.selectArea && this.selectArea.length) {
                    // this.filterResFun()
                    this.getResList()
                }
            },
            // 楼盘类型
            filterBuildType() {
                if(this.bType) {
                    this.getResList()
                }
            },
            // 广告限制
            filterADLimit(limit) {
                console.log('广告限制limit', limit) //
                if (limit && limit.length) {
                    this.getResList()
                }
            },
            // 住户数量过滤
            filterHouseNum() {
                if (this.houseNum[0] == '' || this.houseNum[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误')
                } else {
                    this.filterData.hNum = true
                    for(let i in this.houseNum){
                        this.houseNum[i] = Number(this.houseNum[i])
                    }
                    // this.filterResFun()
                    this.getResList()
                }
            },
            // 楼盘价格过滤
            filterBuildPrice(){
                if (this.buildPrice[0] == '' || this.buildPrice[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误')
                } else {
                    for(let i in this.buildPrice){
                        Number(this.buildPrice[i])
                    }
                    this.filterData.bPrice = true
                    this.getResList()
                    // this.filterResFun()
                }
            },
            // 年份过滤
            filterLiveYear() {
                if (this.liveYear[0] == '' || this.liveYear[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误')
                } else {
                    this.filterData.lYear = true
                    this.getResList()
                    // this.filterResFun()
                }
            },
            // 所在商圈
            filterTradingArea() {
                if(this.selectTradingArea) {
                    this.getResList()
                }
            },
            // 媒体类型（消防门、钣金门等）
            filterDoorType() {
                if(this.selectDoorType) {
                    this.getResList()
                }
            },
            // 媒介载体
            filterMediaType () {
                if(this.selectMediaType) {
                    this.getResList()
                }
            },
            // 媒体等级
            filterMediaLevel () {
                if(this.selectMediaLevel) {
                    this.getResList()
                }
            },
            // 清空
            emptyFun(letter) {
                if (letter === 'house') {
                    this.houseNum = ['', '']
                } else if (letter === 'price') {
                    this.buildPrice = ['', '']
                } else if (letter === 'liveYear') {
                    this.liveYear = ['', '']
                }
            },
            // 清空条件
            clearFilter() {
                this.houseNum = ['', '']
                this.buildNum = ['', '']
                this.buildPrice = ['', '']
                this.liveYear = ['', '']
                this.selectDoorType = ''
                this.selectMediaType = ''
                this.selectMediaLevel = ''
                this.selectLimits = []
                this.selectArea = []
                this.getResList()
            },
            /**
             *  左下选中框
             **/
            // 删除选中社区
            deleteRes(item) {
                this.deleteCircle(item.resID)
                item.isSelect = false
                for (let i = 0; i < this.selectResList.length; i++) {
                    if (this.selectResList[i].resID === item.resID) {
                        this.selectResList.splice(i, 1)
                        break
                    }
                }
            },
            // 删除全部
            deleteAll() {
                for (let key of this.selectResList) {
                    key.isSelect = false
                    this.deleteCircle(key.resID)
                }
                this.selectResList = []
            },
            // 选定提交点位
            pushMapRes(){

            },
            // 导出exc
            exportExcel(){
                if(this.selectResList.length) {
                    let resultArr = [];
                    for(let data of this.selectResList) {
                        let obj = {
                            resName: data.resName,
                            city: data.city,
                            rName: data.rName,
                            resAddress: data.resAddress,
                            tradingArea: data.tradingArea,
                            fNum: data.fNum == '0' ? '#' : data.fNum,
                            hNum: data.hNum == '0' ? '#' : data.hNum,
                            cType: data.cType,
                            hPrice: data.hPrice / 100,
                            chDay: data.chDay || '',
                            notPush: data.notPush || '',
                            mRemark: data.mRemark || '',
                            mediaNum: data.mediaNum || '',
                        };
                        resultArr.push(obj);
                    }
                    require.ensure([], () => {
                        const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                        const tHeader = ['资源名称', '市', '区域', '详细地址','商圈','楼栋数量', '住户数量/办公室数量','楼盘价格','楼盘类型/写字楼类型','入住年份/建成年份','广告限制','媒体备注', '媒体数量（门）'];
                        const filterVal = ['resName', 'city', 'rName', 'resAddress','tradingArea', 'fNum',  'hNum',  'hPrice','cType', 'chDay','notPush', 'mRemark','mediaNum'];
                        const list = resultArr;
                        const data = this.formatJson(filterVal, list);
                        export_json_to_excel(tHeader, data, name);
                        this.isDown = false;
                    })
                } else {
                    sessFun.messageFun('warning','请选择社区')
                }
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
        },
    }
</script>

<style scoped>
    #qinlinMap {
        position: fixed !important;
        top: 60px;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 1;
    }

    /* 左侧搜索 */
    .left_search_box {
        position: fixed;
        width: 288px;
        top: 80px;
        left: 32px;
    }

    /deep/ .el-input-group__prepend {
        width: 64px;
        background: #fff;
    }

    .search_body {
        background: #fff;
        margin-top: 8px;
    }

    .search_result_btn{
        display: flex;
        height: 32px;
        border-bottom: 1px solid rgba(232,232,232,1);
        line-height: 32px;
        font-size:14px;
        padding: 0 12px;
    }

    .result_title {
        width: 88px;
    }

    .result_btn_box {
        flex: 1;
        text-align: right;
        color:rgba(24,144,255,1);
    }

    .result_btn_box span {
        cursor: pointer;
        display: inline-block;
        margin-left: 4px;
    }

    .result_btn_box span:hover {
        color:rgba(24,144,255,0.9);
    }

    .search_ul {
        height: 384px;
        overflow-y: auto;
    }

    .search_li {
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        padding: 12px;
    }

    .li_name {
        font-size: 15px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        position: relative;
    }

    .li_name_span{
        position: absolute;
        right: 0;
        top: -1px;
        display: inline-block;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color:rgba(24,144,255,1);
        border-radius:2px;
        border:1px solid rgba(24,144,255,1);
        padding: 2px 3px;
        cursor: pointer;
    }

    .li_name_span:hover{
        color:rgba(24,144,255,0.8);
        border:1px solid rgba(24,144,255,0.8);
    }

    .li_name_span_active{
        color: #D9D9D9;
        border:1px solid rgba(217,217,217,1)
    }

    .li_name_span_active:hover{
        color: #999;
        border:1px solid #999;
    }

    .li_address {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        line-height: 26px;
    }

    .li_p_span {
        display: inline-block;
        padding: 4px;
        background:rgba(0,0,0,0.06);
        border-radius: 2px;
        margin-right: 6px;
        color:rgba(0,0,0,0.35);
        font-size: 12px;
    }

    .search_bottom_btn {
        text-align: center;
        padding: 10px 0;
    }

    /*在线搜索*/
    .li_name_online{
        position: relative;
    }

    .li_name_online /deep/ .el-checkbox{
        position: absolute;
        right: 4px;
        top: 0;
    }

    .online_search_span{
        color:rgba(0,0,0,0.85);
        font-size: 14px;
        display: inline-block;
        margin-right: 8px;
    }

    /deep/ .map_dialog .el-dialog__body{
        padding: 8px 20px 0;
    }

    .around_search_body p{
        display: flex;
        margin-bottom:16px;
    }

    .p_span{
        width: 74px;
    }

    .p_slider{
        flex: 1;
        -webkit-box-flex: 1;
        -ms-flex: 1;
    }

    .p_slider /deep/ .el-slider__runway{
        margin: 6px 0;
    }

    .radius_input{
        width: 48px;
        height: 28px;
        margin: 0 4px;
        top: -4px;
    }

    /deep/ .radius_input.el-input--small .el-input__inner{
        height: 28px;
        line-height: 28px;
        padding: 0 6px;
    }


    /*顶部过滤条件*/
    .top_filter_box{
        position: fixed;
        top:80px;
        right: 16px;
        height: 42px;
        max-width: 905px;
    }

    .top_filter_box /deep/ .el-button{
        line-height: 30px;
    }

    .top_filter_box /deep/ .el-select{
        width: 145px;
        margin-bottom: 8px;
    }

    .input_wrap{
        padding: 0 8px 8px;
        border-bottom: 1px solid #E8E8E8;
    }

    .input_wrap .filter_input{
        width: 42%;
        height:24px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        border:1px solid rgba(194,194,194,1);
    }

    .popover_footer_btn{
        padding: 0 8px 8px;
    }

    .el-button.popover_btn{
        width: 43%;
        min-width: 40px;
        height: 24px;
        margin-top: 6px;
        padding: 0;
        font-size: 12px;
        text-align: center;
        line-height: 22px;
        border-radius: 0;
    }

    .el-button.popover_btn + .el-button{
        float: right;
        margin-left: 0;
    }

    /deep/ .otherBtn.el-button{
        border-radius: 0;
        color:rgba(0,0,0,0.35);
        min-width: 110px;
        width: 145px;
        margin-bottom: 8px;
    }

    /deep/ .otherBtn.el-button:hover{
        border-color: #1890FF;
        color: #1890FF;
    }

    .filter_ul li{
        line-height: 28px;
        cursor: pointer;
        color:rgba(0,0,0,0.65);
        padding: 0 8px;
    }

    .filter_ul li:hover{
        background:rgba(230,247,255,1);
    }

    .border_p{
        margin: 8px 0;
        border-top: 1px solid #E8E8E8;
    }

    .top_filter_box /deep/ .el-select__tags{
        max-width: 110px !important;
    }

    .top_filter_box /deep/ .el-button.top_filter_btn,/deep/ .el-button.online_search_btn{
        min-width: 74px;
        margin-left: 0;
    }

    /*  底部选中 */
    .bottom_left_active{
        position: fixed;
        bottom: 24px;
        left: 32px;
        width: 288px;
        background: #fff;
        border-radius: 4px;
        font-size: 14px;
        color: #333;
        z-index: 99;
    }

    .bottom_left_header {
        line-height: 32px;
        display: flex;
        padding: 0 8px;
        color:rgba(0,0,0,0.85);
        border-bottom: 1px solid #D9D9D9;
        font-weight: 600;
    }

    .active_num {
        flex: 1
    }

    .active_arrow {
        width: 50px;
        text-align: center;
        cursor: pointer;
        color:rgba(0,0,0,0.35);
        font-size: 12px;
    }

    .active_arrow .el-icon-d-arrow-left {
        transform: rotate(-90deg);
    }

    .active_arrow_hide .el-icon-d-arrow-left{
        transform: rotate(90deg);
    }

    .active_ul {
        height: 140px;
        overflow-y: auto;

    }

    .active_li {
        display: flex;
        line-height: 24px;
        padding: 0 8px;
    }

    .active_li_resName {
        flex: 1;
    }

    .active_li .el-icon-delete {
        width: 24px;
        line-height: 24px;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
    }

    .active_bottom_btn{
        padding: 0 8px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        border-top:1px solid rgba(216,216,216,1);
    }

    .active_bottom_btn span{
        margin-left: 8px;
        cursor:pointer;
    }

    /* 标注info框 */

    .res_info_header{
        padding: 0 0 8px 0;
        border-bottom: 1px solid rgba(232,232,232,1);
        margin-bottom: 8px;
    }

    .res_info_header h3{
        font-weight:500;
        color:rgba(0,0,0,0.85);
        font-size: 18px;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .res_info_header p{
        font-weight:400;
        color:rgba(0,0,0,0.65);
        font-size: 12px;
        line-height: 20px;
    }

    .res_info_content{
        max-height: 218px;
        overflow-y: auto;
        margin-bottom: 8px;
        /*overflow-x: hidden;*/
    }

    .res_info_content_li{
        font-weight:400;
        color:rgba(0,0,0,0.85);
        font-size: 12px;
        line-height: 26px;
        height: 26px;
    }

    .res_info_content_li span{
        color:rgba(0,0,0,0.65);
        display: inline-block;
        margin-left: 16px;
    }

    .res_info_footer {
        text-align: right;
    }

    .info_window_left{
        position: absolute;
        right: -236px;
        top: 0;
        height: 320px;
        width: 220px;
        background: #fff;
    }

    ::-webkit-scrollbar {
        width: 4px;
        height: 8px;
        background: #FAFAFA;
    }

    ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background:rgba(216,216,216,1);
        border-radius: 2px;
    }
</style>
<style>
    .el-popover.filter-popper{
        padding: 0;
    }
</style>
