<template>
    <div>
        <!--地图标签-->
        <div id="qinlinMap" ref="qinlinMap" style=""></div>
        <!--左侧搜索-->
        <div class="left_search_box">
            <el-input placeholder="请输入内容" v-model="selectName"
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
            <div class="search_body" v-show="searchResList.length">
                <ul class="search_ul">
                    <li class="search_li" v-for="(item,index) in searchResList" :key="index">
                        <p class="li_name">
                            {{item.resName}}
                            <span class="li_name_span" @click="checkBoxFun(item)">
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
        </div>
        <!--顶部过滤条件-->
        <div class="top_filter_box">
            <!--区域-->
            <el-select v-model="selectArea" size="small" placeholder="请选择"
                       style="width: 128px"
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
            <el-select v-model="bType" size="small" placeholder="楼盘类型"
                       style="width: 128px"
                       @change="filterBuildType">
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
                       <li v-for="key of priceList" @click="selectNum(key)">{{key}}</li>
                    </ul>
                    <div class="input_wrap">
                        <input type="text" class="filter_input" v-model="buildPrice[0]">
                        -
                        <input type="text" class="filter_input" v-model="buildPrice[1]">
                    </div>
                    <div class="popover_footer_btn">
                        <el-button @click="emptyFun('Price')" class="popover_btn">清 除</el-button>
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
                        <li v-for="key of houseList" @click="selectNum(key)">{{key}}</li>
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
                        <li v-for="key of liveYearList" @click="selectNum(key)">{{key}}</li>
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
            <el-select placeholder="广告限制" size="small" style="width: 128px"
                       multiple
                       collapse-tags
                       v-model="selectLimits"
                       @remove-tag="filterResFun"
                       @change="filterADLimit">
                <el-option
                    v-for="item in ADLimit"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!--所在商圈-->
            <el-select placeholder="所在商圈" size="small" style="width: 128px"
                       multiple
                       collapse-tags
                       v-model="selectTradingArea"
                       @remove-tag="filterResFun"
                       @change="filterTradingArea">
                <el-option
                    v-for="item in tradingAreaList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button size="small" @click="clearFilter">清空条件</el-button>
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
                <span><i class="el-icon-share"></i> 分享</span>
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
                markerIcon: require('../../assets/images/markerIcon.png'),
                dateTime:[],
                // 当前显示到小区数据
                resInfo:[],
                // 搜索的资源列表
                searchResList: [],
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
                houseList:['50 - 99','100 - 199','200 - 499','500 - 999'],
                // 楼栋价格
                buildPrice:['',''],
                // 楼盘价格li
                priceList:['5000 - 9999','10000 - 20000','20000 - 30000','30000 - 40000'],
                // 入住年份
                liveYear: ['',''],
                // 入住年份li
                liveYearList:['1990 - 1999','2000 - 2005','2006 - 2010','2011 - 2019'],
                // 搜索人流量
                peopleFlow: ['',''],
                // 广告限制
                selectLimits:[],
                // 所在商圈
                tradingAreaList:[],
                // 选择到商圈
                selectTradingArea: '',
            }
        },
        mounted() {
            let starTime, endTime
            starTime = timeFormat.returnDayCount(1,'/')
            endTime = timeFormat.returnDayCount(14,'/')
            this.dateTime = [starTime, endTime]                // 设置默认时间
            this.getAreaList();
            // 获取广告限制列表
            this.getADLimit();
            window.onload = this.initMap()
            // 获取小区数据
            this.getResList()
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
            // 初始化地图
            initMap() {
                console.log('初始化地图----')
                // 创建Map实例
                this.resMap = new BMap.Map("qinlinMap");
                console.log('resMap',this.resMap)
                // 初始化地图,设置中心点坐标和地图级别
                this.resMap.centerAndZoom(new BMap.Point(113.36133,23.13129), 11);
                // 设置地图显示的城市 此项是必须设置的
                this.resMap.setCurrentCity("广州市");
                //开启鼠标滚轮缩放
                this.resMap.enableScrollWheelZoom(true);
                // 监听点击地图
                this.resMap.addEventListener("click", () => {
                    console.log('---')
                    this.isShowMediaInfo = false
                });
                //
                // this.creatMarker()
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
                this.resMap.clearOverlays()
                let params = {
                    startTime: this.dateTime[0],
                    endTime: this.dateTime[1],
                    cityId: '440100',
                    resName: '',
                    districtId: this.selectArea.join(','),
                    cType: this.bType,
                    minhPrice: this.buildPrice[0] * 100,
                    maxhPrice: this.buildPrice[1] * 100,
                    minhNum: this.houseNum[0],
                    maxhNum: this.houseNum[1],
                    minchDay: this.liveYear[0],
                    maxchDay: this.liveYear[1],
                    tradingArea: this.tradingArea,
                    adLimit: '',
                    mType: '',
                    mVehicle: '',
                    grade: ''
                }
                for(let i in params) {
                    if(!params[i]) {
                        delete params[i]
                    }
                }
                api.getApi(this.apiVar.mapApi + '/resList',params).then(res=>{
                    if(res.data.SysCode === 200200) {
                        this.resInfo = res.data.data
                        this.creatMarker()
                        this.judgeByselect()
                        console.log('resInfo',this.resInfo)
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                        // this.resInfo = JSON.parse(JSON.stringify(resData))
                    }
                }).catch(err=>{
                    console.log('err',err)
                    sessFun.messageFun('warning','小区数据接口异常')
                    // this.resInfo = JSON.parse(JSON.stringify(resData))
                    // this.creatMarker()
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
                    if(i < 500) {
                        let point = new BMap.Point(key.lng, key.lat);
                        let myIcon = new BMap.Icon(this.markerIcon, new BMap.Size(20,33),{
                            anchor: new BMap.Size(10, 33)
                        });
                        let marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                        let label = new BMap.Label(key.resName,{offset:new BMap.Size(20,5)});
                        label.setStyle({
                            borderRadius: "3px"
                        });
                        marker.setLabel(label);
                        marker.setTop(true);
                        this.resMap.addOverlay(marker);              // 将标注添加到地图中*/
                        marker.addEventListener("click",()=>{
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
                if(!this.selectName) {
                    sessFun.messageFun('warning','请输入关键字！')
                    return
                }
                if(this.activeSearchKind) {
                    // 亲邻社区搜索
                    this.searchResList = this.resInfo.filter((item,index) => {
                        if (item.resName.includes(this.selectName)) {
                            return item
                        }
                    })
                } else {
                    // 在线搜索
                    // this.onlineSearchFun()
                }
            },
            // 全选
            selectAllFun(){
                for(let key of this.searchResList) {
                    if(!key.isSelect) {
                        key.isSelect = true
                        this.selectResList.push(key)
                    }
                }
                console.log('全选',this.selectResList)
            },
            // 勾选/取消
            checkBoxFun(item) {
                console.log('item',item)
                if(item.isSelect) {
                    // 取消选定
                    if (this.activeSearchKind == '1') {
                        this.deleteRes(item)
                    } else if(this.activeSearchKind == '2'){
                        item.isSelect = false
                        for (let i = 0; i < this.selectOnlineList.length; i++) {
                            if (this.selectOnlineList[i].id === item.id) {
                                this.selectOnlineList.splice(i, 1)
                                break
                            }
                        }
                        this.deleteCircle(item.id)
                    }
                } else {
                    // 选定
                    if(this.activeSearchKind == '1') {
                        let point = new BMap.Point(item.lng, item.lat);
                        // 圈起标识
                        this.createCircle(item.resID,point)
                        item.isSelect = true
                        // 添加到选中列表
                        this.pushSelectList(item)
                    } else if(this.activeSearchKind == '2') {
                        // 圈起标识
                        this.createCircle(item.id,item.point)
                        item.isSelect = true
                        this.selectOnlineList.push(item)
                    }
                }
            },
            // 添加到选中列表
            pushSelectList(item) {
                this.selectResList.push(item)
            },
            // 画圆标识选中状态
            createCircle(id,point){
                console.log('id,point',id,point)
                let opts = {
                    position : point,    // 指定文本标注所在的地理位置
                    offset   : new BMap.Size(-24, -48)    //设置文本偏移量
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
            /**
             *  顶部过滤条件
             * */
            filterResFun() {

            },
            //
            selectNum() {

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
                    // this.filterResFun()
                    this.getResList()
                }
            },
            // 广告限制
            filterADLimit(limit) {
                console.log('广告限制limit', limit) //
                if (limit.length > 0) {
                    this.filterResFun()
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
            //人流量过滤
            filterPeopleFlow() {
                if (this.peopleFlow[0] == '' || this.peopleFlow[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误')
                } else {
                    this.filterData.pFlow = true
                    this.filterResFun()
                }
            },
            // 所在商圈
            filterTradingArea() {
                if(this.selectTradingArea) {
                    this.filterResFun()
                    // this.filterData.tradingArea = true
                } else {
                    // this.filterData.tradingArea = false
                }
            },
            emptyFun(letter) {       // 清空
                if (letter === 'house') {
                    this.houseNum = ['', '']
                } else if (letter === 'B') {
                    this.buildNum = ['', '']
                } else if (letter === 'Price') {
                    this.buildPrice = ['', '']
                } else if (letter === 'liveYear') {
                    this.liveYear = ['', '']
                } else if (letter === 'PSN') {
                    this.carFlow = ['', '']
                } else if (letter === 'CF') {
                    this.parkSpaceNum = ['', '']
                } else if (letter === 'peopleFlow') {
                    this.peopleFlow = ['', '']
                }
            },
            // 清空条件
            clearFilter() {

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
            // 导出exc
            exportExcel(){

            },
            // 选定提交点位
            pushMapRes(){

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

    /*顶部过滤条件*/
    .top_filter_box{
        position: fixed;
        top:80px;
        right: 16px;
        height: 42px;
    }

    .top_filter_box /deep/ .el-button{
        line-height: 30px;
    }

    .input_wrap{
        padding: 0 8px 8px;
        border-bottom: 1px solid #E8E8E8;
    }

    .input_wrap .filter_input{
        /*width:58px;*/
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
        width: 128px;
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
    .res_info_window{
        /*position: relative;*/
    }

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
