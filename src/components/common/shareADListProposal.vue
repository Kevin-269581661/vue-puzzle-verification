<template>
    <div>
        <div v-if="isPC">
            <div>
                <header class="share_index_header">
                    <div class="logo_img">
                        <img src="../../assets/images/logo.png" alt="qinlink">
                    </div>
                </header>
            </div>
            <div class="content">
                <div class="content_head">
                    <h2>方案名称: {{FAData.apName}}</h2>
                    <p>公司名称: {{FAData.cName}}</p>
                    <p>品牌名称: {{FAData.cBand}}</p>
                </div>
                <div class="content_main">
                    <el-tabs v-model="activeName" @tab-click="switchTabs">
                        <el-tab-pane label="列表模式" name="first">
                            <div style="border-bottom: 2px dashed #e4e7ed;margin-bottom: 10px">
                                <span class="city_radio"
                                      :class="activeRadio.asName === item.asName && activeRadio.rName === item.rName ? 'active_radio' : ''"
                                      v-for="(item,index) of cityAsNameList"
                                      :key="index"
                                      @click="changeCity(item)">
                                    {{item.rName}}
                                </span>
                            </div>
                            <!-- <div class="searchBox" v-if="reading">
                                <div v-if="activeIsLevel" class="cityLevelMedia">
                                    <h4 style="font-weight: bold;line-height: 32px">输入您需要的面数:</h4>
                                    A级媒体:<el-input-number v-model="selectLevelNum.A"  size="small" controls-position="right"
                                                          :step="1" :min="0" :max="99999" @keyup.enter.native="keyupFun($event)" @blur="changeNeedNum">
                                </el-input-number>
                                    B级媒体:<el-input-number v-model="selectLevelNum.B"  size="small" controls-position="right"
                                                          :step="1" :min="0" :max="99999" @keyup.enter.native="keyupFun($event)" @blur="changeNeedNum">
                                </el-input-number>
                                    C级媒体:<el-input-number v-model="selectLevelNum.C"  size="small" controls-position="right"
                                                          :step="1" :min="0" :max="99999" @keyup.enter.native="keyupFun($event)" @blur="changeNeedNum">
                                </el-input-number>
                                    <el-button size="small" type="primary" @click="searchMedia">执行</el-button>
                                    <el-button size="small" @click="cancelSearch">取消</el-button>
                                </div>
                                <div v-else>
                                    需求面数:<el-input-number v-model="selectNum"  size="small" controls-position="right"
                                                          :step="1" :min="1" :max="99999" @keyup.enter.native="keyupFun($event)" @blur="changeNeedNum">
                                </el-input-number>
                                    <el-button size="small" type="primary" @click="searchMedia">执行</el-button>
                                    <el-button size="small" @click="cancelSearch">取消</el-button>
                                </div>
                            </div> -->
                            <div class="car-title">
                                <i class="el-icon-info" style="color: #1890FF;"></i>
                                <h4 v-if="reading">
                                    可选择面数<span>{{resMediaAdsNum.ADTotalNum}}</span>面（<span>{{resMediaAdsNum.resTotalNum}}</span>个资源数）,
                                    已选择面数:<span>{{resMediaAdsNum.ADNum}}</span>面（<span>{{resMediaAdsNum.resNum}}</span>个资源数）
                                </h4>
                                <h4 v-else>
                                    可选择面数<span>{{resMediaAdsNum.ADTotalNum}}</span>面（<span>{{resMediaAdsNum.resTotalNum}}</span>个资源数）
                                </h4>
                            </div>
                            <el-table
                                :key="key"
                                v-loading="loading"
                                element-loading-text="玩命加载中.."
                                element-loading-spinner="el-icon-loading"
                                @select="handleSelect"
                                @select-all="handleSelectAll"
                                ref="multipleTable"
                                border
                                :data="showResList"
                                :select-on-indeterminate='false'
                                style="width: 100%"
                                class="shareTable">
                                <el-table-column
                                    type="selection"
                                    width="40px"
                                    v-if="reading">
                                </el-table-column>
                                <el-table-column
                                    label="资源名称"
                                    show-overflow-tooltip
                                    min-width="110">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.resName || '--' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="城市"
                                    show-overflow-tooltip
                                    min-width="100">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.cityName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="区域"
                                    show-overflow-tooltip
                                    min-width="100">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.districtName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="cType"
                                    label="楼盘类型"
                                    min-width="85">
                                </el-table-column>
                                <el-table-column
                                    label="楼盘价格"
                                    min-width="85">
                                    <template slot-scope="scope">
                                        <span>&yen;{{scope.row.hPrice}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="fNum"
                                    label="楼栋数量"
                                    min-width="80">
                                </el-table-column>
                                <el-table-column
                                    prop="hNum"
                                    label="住户数量"
                                    min-width="80">
                                </el-table-column>
                                <el-table-column
                                    prop="chDay"
                                    label="建成年份"
                                    min-width="80">
                                </el-table-column>
                                <el-table-column
                                    prop="schedule"
                                    label="排期"
                                    min-width="180"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="actualMediaCnt"
                                    label="媒体数量(门)"
                                    min-width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="actualAdsCnt"
                                    label="可投数量(面)"
                                    min-width="100">
                                </el-table-column>
                                <el-table-column
                                label="计划投放数(面)"
                                min-width="130"
                                align="center"
                                >
                                    <template slot-scope="scope">
                                        <el-input-number style="width: 80px" size="mini" :min="scope.row.actualAdsCnt?1:0" :max="scope.row.actualAdsCnt||0" v-model="scope.row.planAdsCnt" @change="updatePlanAdsCnt(scope.row)"></el-input-number>
                                    </template>
                                </el-table-column>
                                <!-- <el-table-column
                                    label="已选A级面数"
                                    min-width="105"
                                    v-if="reading && activeIsLevel">
                                    <template slot-scope="scope">
                                        <div class="addMinus">
                                            <span>{{scope.row.levelNum.A}}</span>
                                            <el-input-number v-model="scope.row.selectedNum.A"
                                                             controls-position="right"
                                                             size="mini"
                                                             @change="addMinusFun(scope.row)"
                                                             :min="0"
                                                             :max="scope.row.levelNum.A">
                                            </el-input-number>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="已选B级面数"
                                    min-width="105"
                                    v-if="reading && activeIsLevel">
                                    <template slot-scope="scope">
                                        <div class="addMinus">
                                            <span>{{scope.row.levelNum.B}}</span>
                                            <el-input-number v-model="scope.row.selectedNum.B"
                                                             controls-position="right"
                                                             size="mini"
                                                             @change="addMinusFun(scope.row)"
                                                             :min="0"
                                                             :max="scope.row.levelNum.B">
                                            </el-input-number>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="已选C级面数"
                                    min-width="105"
                                    v-if="reading && activeIsLevel">
                                    <template slot-scope="scope">
                                        <div class="addMinus">
                                            <span>{{scope.row.levelNum.C}}</span>
                                            <el-input-number v-model="scope.row.selectedNum.C"
                                                             controls-position="right"
                                                             size="mini"
                                                             @change="addMinusFun(scope.row)"
                                                             :min="0"
                                                             :max="scope.row.levelNum.C">
                                            </el-input-number>
                                        </div>
                                    </template>
                                </el-table-column> -->
                                <!-- <el-table-column
                                    prop="roadGateTotal"
                                    label="道闸可选"
                                    min-width="90"
                                    v-if="reading">
                                    <template slot-scope="scope">
                                        <div class="addMinus">
                                            <span>{{scope.row.roadGateTotal}}</span>
                                            <el-input-number v-model="scope.row.selectedRoadGateNum"
                                                             controls-position="right"
                                                             size="mini"
                                                             @change="addMinusFun(scope.row)"
                                                             :min="0"
                                                             :max="scope.row.roadGateTotal">
                                            </el-input-number>
                                        </div>
                                    </template>
                                </el-table-column> -->
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="地图模式" name="second">
                            <share-ad-map :mapADList="showResList" :mapCity="activeCity" :tableSelects="tableSelects"
                                          :activeName="activeName" :reading="reading"
                                          @mapSelectRes="getMapSelect"></share-ad-map>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div style="text-align: center;margin: 15px 0" v-show="activeName === 'first'">
                    <el-button type="primary" style="border-radius: 4px;" @click="submitFun" v-show="reading">
                        提交
                    </el-button>
                </div>
                <!--尾部-->
                <div class="ad_index_footer clearfix">
                    <p><img src="../../assets/images/home_icon.png" alt="">
                        Copyright &copy;{{newDate}} 亲邻科技线上产品部
                    </p>
                </div>
            </div>
        </div>
        <div v-else>
            <share-mobile></share-mobile>
        </div>
    </div>
</template>

<script>
    import api from '../../api/api'
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import shareMobile from "./shareADList_mobile"
    import shareAdMap from "./map/shareHelpADMap"

    export default {
        name: "shareADListProposal",
        data() {
            return {
                newDate: new Date().getFullYear(),
                isPC: true,
                loading: false,               // 数据加载
                activeName: 'first',
                ADList: [],             // 接口总数据
                showResList: [],         // 显示的table数据
                checkADList: [],        // 选择了的点位面
                shopMedia_ADNum: {resNum: 0, mediaNum: 0, ADNum: 0},      // 媒体面数、点位面数
                resMediaAdsNum:{resTotalNum: 0,mediaTotalNum: 0,ADTotalNum:0,resNum:0,ADNum:0},
                urlParams: '',          // url地址
                apID: '',               // 方案id
                aiCode: '',             // 获取密钥
                shareADSData: '',       // {FAName:'',cName:'',rmk:''}
                FAData: {},
                reading: true,          // 编辑列表
                key: 1,
                webLoading: '',
                iframeSrc: '',          // 无忧地图地址
                activeCity: {},      // 当前城市
                activeIsLevel: true, // 当前城市是否执行媒体分层
                selectNum: 1,       // 所选吗，面数
                selectLevelNum: {A: 0, B: 0, C: 0},
                activeSelectNum: 0,     // 当前城市最大可选面数
                activeRadio: {asName:'北京公司',rName:'北京市'},
                cityAsNameList: [
                    {asName: '北京公司',rName: '北京市'},
                ],
                // 地图选中的资源
                mapResList: [],
                // 是否变动
                isChangeMapSelect: false,
                tableSelects: []
            }
        },
        components: {
            shareMobile: shareMobile,
            shareAdMap: shareAdMap
        },
        created() {
            console.log('创建Create:', this.shopMedia_ADNum)
            this.browserRedirect()
        },
        mounted() {
            if (this.isPC === true) {
                this.webLoading = this.$loading({
                    lock: true,
                    text: '正在加载...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                this.urlParams = location.search
                this.apID = (this.urlParams.split("=")[1]).split('&')[0]
                this.aiCode = this.urlParams.split("=")[2]
                console.log('urlParams', this.urlParams, 'apid', this.apID)
                this.getFAInfo()    // 获取方案信息
            } else {
                // this.Msg = {apid:this.apid,aicode:this.aicode}
            }
        },
        methods: {
            // 判断是移动端还是PC端
            browserRedirect() {
                let userAgentInfo = navigator.userAgent;
                let Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
                console.log('userAgentInfo', userAgentInfo)
                for (let v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        console.log('移动端页面')
                        this.isPC = false
                        return
                    }
                }
                console.log('PC端页面')
            },
            // 切换tabs
            switchTabs(tab, event) {
                console.log(tab, event)
                if (tab.name === 'second') {
                    this.listToMap()
                } else {
                    // 无忧地图选择点位同步到列表
                    if (this.isChangeMapSelect) {
                        this.resetPlanList()
                        this.mapToList()
                    }
                }
            },
            getFAInfo() {
                api.getApi('/addsp/proposal/share/getFangInfo', {aiCode: this.aiCode}).then(res => {
                    console.log('GetShareADS', res)
                    if (res.data.SysCode == 200200) {
                        this.shareADSData = res.data.data
                        this.FAData = {apName: this.shareADSData.apName, cName: this.shareADSData.cName, cBand: this.shareADSData.bTitle}
                        if (this.shareADSData.aiIP === undefined || this.shareADSData.aiIP === '' || this.shareADSData.asIDList === undefined) {
                            console.log('数据可选择')
                            this.reading = true    // 数据可编辑
                            this.key = 1
                        } else {
                            console.log('数据不可选择')
                            this.reading = false      // 数据只读
                            this.key = 2
                        }
                        // 获取小区列表
                        this.getResList()
                    } else {
                        this.webLoading.close()
                        this.$message({
                            message: res.data.MSG,
                            type: 'warning'
                        })
                    }
                })
            },
            //切换城市
            changeCity(val){
                console.log('当前公司城市',val,this.ADList)
                this.activeRadio = val
                console.log('当前城市',this.activeRadio,this.ADList)
                let adsArr = []
                for(let key of this.ADList){
                    if(key.rName === this.activeRadio.rName && key.asName === this.activeRadio.asName){
                        this.activeIsLevel = key.isLevel
                        this.showResList = key.adsArr
                        break
                    }
                }
                console.log('当前列表数据', this.activeIsLevel)
                let timer = setTimeout(()=>{
                    // this.showResList = adsArr.concat()
                    this.hadADBySelectedNum()
                    this.computeNumber()
                    this.computeMedia_AD()
                    clearTimeout(timer)
                },100)
            },
            // 获取原始数据
            getResList() {
                api.getApi('/addsp/proposal/share/getResList', {apID: this.apID}).then(res => {
                    console.log('获取协同选点列表', res)
                    if(res.data.SysCode == 200200) {
                        this.showResList = res.data.data
                        // this.computeNumber()
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                }).finally(()=>{
                    this.webLoading.close()
                })
            },
            // 统计总面数和资源数
            computeNumber(){
                let resArr = []
                let adsArr = []
                let adsNum = 0
                for (let key of this.showResList) {
                    if (!resArr.includes(key.resID)) {
                        resArr.push(key.resID)
                    }
                    if (!adsArr.includes(key.mID)) {
                        adsNum += key.selectableMax
                    }
                }
                this.resMediaAdsNum.resTotalNum = resArr.length
                this.resMediaAdsNum.ADTotalNum = adsNum
                console.log('统计面数和资源数',resArr,adsArr)
            },
            //
            keyupFun(ev){
                let e = ev || window.ev;
                console.log('触发了键盘', e)
                // this.selectNum = this.selectNum.toFixed(0)
                if (e.keyCode === 13) {
                    this.searchMedia()
                }
            },
            changeNeedNum(val){
                // console.log('val',val)
                let timer = setTimeout(()=>{
                    if(this.selectNum){
                        let isBool = Number.isInteger(this.selectNum)
                        if(!isBool){
                            this.selectNum = parseInt(this.selectNum)
                        }
                        // console.log('this.selectNum',this.selectNum)
                    }
                    clearTimeout(timer)
                },10)
            },
            // 搜索
            searchMedia() {
                if(this.activeIsLevel){         // 执行媒体分层的一键选点 selectLevelNum
                    console.log('媒体分层 - 一键选点', this.selectLevelNum, this.showResList)
                    for(let i in this.selectLevelNum){
                        if(!this.selectLevelNum[i]){
                            this.selectLevelNum[i] = 0
                        }
                    }
                    if(this.selectLevelNum.A || this.selectLevelNum.B || this.selectLevelNum.C){
                        let isBoolA = Number.isInteger(this.selectLevelNum.A)
                        let isBoolB = Number.isInteger(this.selectLevelNum.B)
                        let isBoolC = Number.isInteger(this.selectLevelNum.C)
                        console.log('isBoolA',isBoolA,'isBoolB',isBoolB,'isBoolC',isBoolC)
                        if(isBoolA && isBoolB && isBoolC){
                            let haveNum = {A: 0, B: 0, C: 0}
                            for (let skey of this.showResList) {
                                haveNum.A += skey.levelNum.A - skey.selectedNum.A
                                haveNum.B += skey.levelNum.B - skey.selectedNum.B
                                haveNum.C += skey.levelNum.C - skey.selectedNum.C
                            }
                            console.log('haveNum',haveNum)
                            if (this.selectLevelNum.A <= haveNum.A && this.selectLevelNum.B <= haveNum.B && this.selectLevelNum.C <= haveNum.C) {
                                console.log('满足面数',)
                                this.isLevelOnekeySelect([], {A: 0, B: 0, C: 0}, 0)
                                this.hadADBySelectedNum()
                            } else {
                                this.messageFun('warning', '该城市可选面数为:A级' + haveNum.A + '面、B级' + haveNum.B + '面、C级' + haveNum.C +
                                    '面,不满足:A级' + this.selectLevelNum.A + '面、B级' + this.selectLevelNum.B + '面、C级' + this.selectLevelNum.C + '面')
                            }
                        }else{
                            this.messageFun('warning','需求面数只能为正整数')
                        }
                    }else{
                        this.messageFun('warning','需求面数不能为空')
                    }
                }else{                         // 1.3885
                    console.log('一键选点搜索', this.selectNum, this.showResList)
                    if(this.selectNum){
                        let isBool = Number.isInteger(this.selectNum)
                        if(isBool){
                            let cityTotalNum = 0
                            // 广告门已选面数
                            let selectNum = 0
                            // 道闸已选面数
                            let selectedRGNum = 0
                            for (let skey of this.showResList) {
                                cityTotalNum += skey.selectableMax
                                selectNum += skey.noLevelSelectedNum
                                selectedRGNum += skey.selectedRoadGateNum
                            }
                            let num = cityTotalNum - selectNum - selectedRGNum
                            console.log('num', num)
                            if (num >= this.selectNum) {
                                console.log('满足面数',)
                                this.oneKeySelectPoint([],0,0)
                                this.hadADBySelectedNum()
                                this.computeMedia_AD()      // 统计媒体数、面数
                                console.log('this.showResList',this.showResList)
                            } else {
                                this.messageFun('warning','该城市可选面数为' + num + '面,不足' + this.selectNum + '面')
                            }
                        }else{
                            this.messageFun('warning','需求面数只能为正整数')
                        }
                    }else{
                        this.messageFun('warning','需求面数不能为空')
                    }
                }
            },
            // 执行媒体分层的一键选择
            isLevelOnekeySelect(arr,MediaNum,time){
                console.log('媒体分层',arr, MediaNum)
                for(let skey of this.showResList){
                    if(this.selectLevelNum.A > MediaNum.A || this.selectLevelNum.B > MediaNum.B || this.selectLevelNum.C > MediaNum.C){
                        let isTrue = false
                        if(time === 0){
                            if(!arr.includes(skey.resID)){
                                arr.push(skey.resID)
                                isTrue = true
                            }
                        }else{
                            isTrue = true
                        }
                        if(isTrue){
                            if(this.selectLevelNum.A > MediaNum.A && skey.levelNum.A > skey.selectedNum.A){
                                MediaNum.A++
                                skey.selectedNum.A++
                            }
                            if(this.selectLevelNum.B > MediaNum.B && skey.levelNum.B > skey.selectedNum.B){
                                MediaNum.B++
                                skey.selectedNum.B++
                            }
                            if(this.selectLevelNum.C > MediaNum.C && skey.levelNum.C > skey.selectedNum.C){
                                MediaNum.C++
                                skey.selectedNum.C++
                            }
                        }
                    }else{
                        return false
                    }
                }
                console.log('this.selectLevelNum',this.selectLevelNum)
                if (this.selectLevelNum.A > MediaNum.A || this.selectLevelNum.B > MediaNum.B || this.selectLevelNum.C > MediaNum.C) {
                    time++
                    this.isLevelOnekeySelect(arr, MediaNum, time)
                }
            },
            // 无分层的一键选择
            oneKeySelectPoint(arr,MediaNum,time){
                console.log('一键选择', arr, MediaNum)
                for (let skey of this.showResList) {
                    if (MediaNum < this.selectNum) {
                        if (time === 0) {
                            if (!arr.includes(skey.resID)) {
                                arr.push(skey.resID)
                                if (skey.selectableMax > skey.noLevelSelectedNum) {
                                    skey.noLevelSelectedNum++
                                    MediaNum++
                                }
                            }
                        } else {
                            if (arr.includes(skey.resID)) {
                                if (skey.selectableMax > skey.noLevelSelectedNum) {
                                    skey.noLevelSelectedNum++
                                    MediaNum++
                                }
                            }
                        }
                    } else {
                        return false
                    }
                }
                if (MediaNum < this.selectNum) {
                    time++
                    this.oneKeySelectPoint(arr, MediaNum, time)
                }
            },
            // 取消
            cancelSearch(){
                if(this.activeIsLevel){
                    for(let i in this.selectLevelNum){
                        this.selectLevelNum[i] = 0
                    }
                }else{
                    this.selectNum = 1
                }
            },
            // 加减
            addMinusFun(row){
                console.log('row',row)
                if(this.activeIsLevel){
                    if(row.selectedNum.A <= 0 && row.selectedNum.B <= 0 && row.selectedNum.C <= 0 && row.selectedRoadGateNum <= 0){
                        this.$refs.multipleTable.toggleRowSelection(row, false)
                    }else{
                        this.$refs.multipleTable.toggleRowSelection(row, true)
                    }
                }else{
                    if(row.noLevelSelectedNum <= 0 && row.selectedRoadGateNum <= 0){
                        this.$refs.multipleTable.toggleRowSelection(row, false)
                    }else{
                        this.$refs.multipleTable.toggleRowSelection(row, true)
                    }
                }
                this.computeMedia_AD()
            },
            // 行选中
            handleSelect(selection, row) {
                console.log('selection',selection,'row',row)
                if (this.activeIsLevel) {
                    if (row.selectedNum.A <= 0 && row.selectedNum.B <= 0 && row.selectedNum.C <= 0 && row.selectedRoadGateNum <= 0) {
                        if (row.selectedNum.A < row.levelNum.A) {
                            row.selectedNum.A++
                        } else if (row.selectedNum.B < row.levelNum.B) {
                            row.selectedNum.B++
                        } else if (row.selectedNum.C < row.levelNum.C) {
                            row.selectedNum.C++
                        } else if (row.selectedRoadGateNum < row.roadGateTotal) {
                            row.selectedRoadGateNum++
                        }
                    } else {
                        row.selectedNum.A = 0
                        row.selectedNum.B = 0
                        row.selectedNum.C = 0
                        row.selectedRoadGateNum = 0
                    }
                } else {
                    if(row.noLevelSelectedNum <= 0 && row.selectedRoadGateNum <= 0){
                        if(row.noLevelSelectedNum < row.adDoorTotal){
                            row.noLevelSelectedNum++
                        }else if(row.selectedRoadGateNum < row.roadGateTotal){
                            row.selectedRoadGateNum++
                        }
                    }else{
                        row.noLevelSelectedNum = 0
                        row.selectedRoadGateNum = 0
                    }
                }

                this.computeMedia_AD()
            },
            // 全选中
            handleSelectAll(selection) {
                console.log('全选中selection', selection)
                if (selection.length) {
                    for (let key of selection) {
                        if (this.activeIsLevel) {
                            key.selectedNum.A = key.levelNum.A
                            key.selectedNum.B = key.levelNum.B
                            key.selectedNum.C = key.levelNum.C
                            key.selectedRoadGateNum = key.roadGateTotal
                        } else {
                            key.noLevelSelectedNum = key.adDoorTotal
                            key.selectedRoadGateNum = key.roadGateTotal
                        }
                    }
                } else {
                    this.resetPlanList()
                }
                this.computeMedia_AD()      // 统计媒体数、面数
            },
            // 重置ADList的勾选
            resetPlanList() {
                console.log('重置ADList的勾选开始',this.activeIsLevel)
                for (let key of this.showResList) {
                    if (this.activeIsLevel) {
                        for (let i in key.selectedNum) {
                            key.selectedNum[i] = 0
                        }
                        key.selectedRoadGateNum = 0
                    } else {
                        key.noLevelSelectedNum = 0
                        key.selectedRoadGateNum = 0
                    }
                    this.$refs.multipleTable.toggleRowSelection(key, false)
                }
                console.log('重置ADList的勾选结束')
            },
            // 根据selectedNum是否大于零进行勾选
            hadADBySelectedNum() {
                console.log('切换时确保勾选')
                let timer = setTimeout(() => {
                    for (let key of this.showResList) {
                        // if (key.selectedNum) {
                        //     console.log('selectedNum不为0', key)
                        //     this.$refs.multipleTable.toggleRowSelection(key, true)
                        // }
                        if (this.activeIsLevel) {
                            if (key.selectedNum.A <= 0 && key.selectedNum.B <= 0 && key.selectedNum.C <= 0) {
                                this.$refs.multipleTable.toggleRowSelection(key, false)
                            } else {
                                this.$refs.multipleTable.toggleRowSelection(key, true)
                            }
                        } else {
                            if (key.noLevelSelectedNum <= 0) {
                                this.$refs.multipleTable.toggleRowSelection(key, false)
                            } else {
                                this.$refs.multipleTable.toggleRowSelection(key, true)
                            }
                        }
                    }
                    clearTimeout(timer)
                }, 10)
            },
            // 统计已选中的资源数、面数
            computeMedia_AD() {
                console.log('统计已选中的资源数、面数',this.activeRadio,this.showResList,this.activeIsLevel)
                let resArr = []
                let adsArr = []
                let adsNum = 0
                for (let key of this.showResList) {
                    if (this.activeIsLevel){
                        if (!resArr.includes(key.resID)){
                            if(key.selectedNum.A || key.selectedNum.B || key.selectedNum.C || key.selectedRoadGateNum){
                                resArr.push(key.resID)
                            }
                        }
                        adsNum += key.selectedNum.A + key.selectedNum.B + key.selectedNum.C + key.selectedRoadGateNum
                    } else {
                        if (!resArr.includes(key.resID) && key.noLevelSelectedNum) {
                            resArr.push(key.resID)
                            adsNum += key.noLevelSelectedNum + key.selectedRoadGateNum
                        }
                    }
                }
                console.log('统计已选中的资源数、面数',resArr,adsArr,adsNum)
                this.resMediaAdsNum.resNum = resArr.length
                this.resMediaAdsNum.ADNum = adsNum
            },
            // 地图选择到资源
            getMapSelect(...data) {
                  console.log('地图选择到资源---',data)
                this.mapResList = data[0]
                this.isChangeMapSelect = true
            },
            // 地图同步到列表
            mapToList() {
                console.log('地图同步到列表---',this.mapResList,this.ADList)
                for (let mapKey of this.mapResList) {
                    for (let adkey of this.ADList) {
                        for (let keyArr of adkey.adsArr) {
                            if (mapKey.resID == keyArr.resID) {
                                if (this.activeIsLevel) {
                                    console.log('----',keyArr)
                                    if (keyArr.selectedNum.A <= 0 && keyArr.selectedNum.B <= 0 && keyArr.selectedNum.C <= 0) {
                                        if (keyArr.selectedNum.A < keyArr.levelNum.A) {
                                            keyArr.selectedNum.A++
                                            this.$refs.multipleTable.toggleRowSelection(keyArr, true)
                                        } else if (keyArr.selectedNum.B < keyArr.levelNum.B) {
                                            keyArr.selectedNum.B++
                                            this.$refs.multipleTable.toggleRowSelection(keyArr, true)
                                        } else if (keyArr.selectedNum.C < keyArr.levelNum.C) {
                                            keyArr.selectedNum.C++
                                            this.$refs.multipleTable.toggleRowSelection(keyArr, true)
                                        }
                                    }
                                } else {
                                    if (keyArr.noLevelSelectedNum <= 0) {
                                        keyArr.noLevelSelectedNum++
                                        this.$refs.multipleTable.toggleRowSelection(keyArr, true)
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            },
            // 提交列表选择的点位给无忧地图 activeRadio
            listToMap() {
                console.log('this.ADList',this.ADList)
                let arr = []
                let AllADData = this.ADList
                for(let cityADList of AllADData){
                    if(cityADList.rName === this.activeRadio.rName && cityADList.asName === this.activeRadio.asName){
                        for(let ckey of cityADList.adsArr){
                            if(this.activeIsLevel){
                                if(ckey.selectedNum.A > 0 || ckey.selectedNum.B > 0 || ckey.selectedNum.C > 0){
                                    if (!arr.length){
                                        arr.push(ckey.resID)
                                    }else{
                                        let isHad = false
                                        for (let pkey of arr){
                                            if (pkey === ckey.resID){
                                                isHad = true
                                                break
                                            }
                                        }
                                        if (!isHad){
                                            arr.push(ckey.resID)
                                        }else{
                                            console.log('重复的资源1', ckey)
                                        }
                                    }
                                }
                            } else {
                                if (ckey.noLevelSelectedNum > 0) {
                                    if (!arr.length) {
                                        arr.push(ckey.resID)
                                    } else {
                                        let isHad = false
                                        for (let pkey of arr) {
                                            if (pkey === ckey.resID) {
                                                isHad = true
                                                break
                                            }
                                        }
                                        if (!isHad) {
                                            arr.push(ckey.resID)
                                        } else {
                                            console.log('重复的资源2', ckey)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                console.log('提交列表到地图',arr)
                this.tableSelects = arr
            },
            // 提交前判断是否有勾选
            returnIsSelect(){
                for (let key of this.ADList) {
                    console.log('key',key)
                    for (let aKey of key.adsArr) {
                        if (key.isLevel) {
                            if (aKey.selectedNum.A > 0 || aKey.selectedNum.B > 0 || aKey.selectedNum.C > 0 || aKey.selectedRoadGateNum > 0) {
                                console.log('提交前判断是否有勾选',aKey)
                                return true
                            }
                        } else {
                            if (aKey.noLevelSelectedNum > 0 || aKey.selectedRoadGateNum > 0) {
                                console.log('提交前判断是否有勾选',aKey)
                                return true
                            }
                        }
                    }
                }
                return false
            },
            // 选点提交
            submitFun() {
                let isBool = this.returnIsSelect()
                if (!isBool) { // this.resMediaAdsNum.ADNum <= 0
                    this.$message({
                        message: '请选择点位后再提交！',
                        type: 'warning',
                    })
                } else {
                    this.$confirm('该页面仅能提交一次，请确认无误后提交\n' +
                        ',提交成功后，您的方案选点信息将同步到亲邻选点系统', '是否确定提交选点信息', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        customClass: 'shareADSBtn'
                    }).then(() => {
                        this.PushShareADSFun()
                        this.reading = !this.reading    // 数据可编辑
                        if (this.key === 1) {
                            this.key = 2;
                        } else {
                            this.key = 1
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        })
                    })
                }
            },
            // 反馈协同选点列表
            PushShareADSFun() {
                console.log('反馈协同选点列表',this.ADList)
                let params = {aiCode: this.aiCode, asIDList: []}
                for(let key of this.ADList){
                    for(let aKey of key.adsArr){
                        if (key.isLevel) {
                            if (aKey.selectedNum.A > 0 || aKey.selectedNum.B > 0 || aKey.selectedNum.C > 0 || aKey.selectedRoadGateNum > 0){
                                params.asIDList.push({
                                    classified: key.isLevel ? '1' : '2',
                                    resID: aKey.resID,
                                    A: aKey.selectedNum.A,
                                    B: aKey.selectedNum.B,
                                    C: aKey.selectedNum.C,
                                    selectedRoadGateNum: aKey.selectedRoadGateNum,
                                    // selectedMax: aKey.selectableMax,
                                    schedules: aKey.schedules,
                                })
                            }
                        } else {
                            if (aKey.noLevelSelectedNum > 0 || aKey.selectedRoadGateNum > 0) {
                                params.asIDList.push({
                                    classified: key.isLevel ? '1' : '2',
                                    resID: aKey.resID,
                                    selectedAdDoor: aKey.noLevelSelectedNum,
                                    selectedRoadGateNum: aKey.selectedRoadGateNum,
                                    // selectedMax: aKey.selectableMax,
                                    schedules: aKey.schedules,
                                })
                            }
                        }
                    }
                }
                console.log('反馈协同选点列表params',params)
                api.postApi_json(this.apiVar.Advertisement + '/PushShareADS', JSON.stringify(params)).then(res =>{
                    console.log('协同选点列表的提交', res)
                    if (res.data.SysCode == '300200' || res.data.msg === '操作成功') {
                        this.$message({
                            message: '选点成功，如需更改请联系您的业务经理！',
                            type: 'success'
                        })
                        this.reading = false
                    } else {
                        this.$message({
                            message: '选点信息提交失败！(点位已被提交过或方案已发布)',
                            type: 'warning'
                        })
                    }
                })
            },
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType
                })
            },
            // 时间格式规范
            formatTime(val) {
                return dateFormat.toDate(val, "/")
            },
        }
    }
</script>
<style lang="scss" scoped>
    /deep/ .el-badge__content.is-fixed.is-dot {
        left: -15px;
        top: 5px;
        background: #FF6868;
        width: 5px;
        height: 5px;
    }
    .share_index_header {
        width: 100%;
        background: #444;
        height: 60px;
    }

    .logo_img {
        padding: 14px 0 0 38px;
    }
    .logo_img img {
        width: 103px;
    }

    .content {
        width: 91%;
        margin: 0 auto;
    }

    .content_head {
        margin-top: 25px;
        height: 90px;
        background: #fff;
        padding: 17px 15px;
        border: 1px solid rgba(232,232,232,1);
    }

    .content_head h2 {
        font-family: PingFangSC-Medium;
        font-weight: bold;
        font-size: 20px;
        color: rgba(0,0,0,0.85);
        line-height: 28px;
        margin-bottom: 10px;
    }

    .content_head p {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        margin-bottom: 6px;
    }

    .content_main {
        margin-top: 24px;
        background: #fff;
        padding: 0;
        border: 1px solid rgba(232,232,232,1);
    }
    .content_main /deep/ .el-tabs__content{
        padding: 0 24px 24px;
    }

    .content_main /deep/ .el-tabs__nav-wrap{
        padding: 0 24px;
    }

    .content_main /deep/ .el-tabs__nav{
        height: 48px;
        line-height: 48px;
    }

    .car-title {
        background: #E6F7FF;
        border: 1px solid #BAE7FF;
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 5px;
    }

    .car-title h4 {
        font-size: 14px;
        display: inline-block;
        color: #444;
    }

    .car-title p {
        font-size: 14px;
        font-weight: normal;
        display: inline-block;
        margin-left: 10px;
    }

    .car-title span {
        font-size: 14px;
        font-weight: normal;
        margin: 0 6px;
        cursor: pointer;
        color: #1890ff;
    }

    /deep/ .el-tabs__item{
        font-size: 16px;
    }

    /deep/ .el-tabs__item.is-active {
        color: #1890FF;
    }

    /deep/ .el-table th{
        background: #f7f7f7;
    }

    /deep/ .el-table th > .cell {
        color: #666666;
        line-height: 14px;
        font-weight: bold;

    }

    /deep/ .el-table__row td{
        line-height: 48px;
        font-size: 14px;
        padding: 8px 0;
    }

    /deep/ .el-checkbox + .el-checkbox {
        margin-left: 10px;
    }

    /deep/ .el-table__expanded-cell[class*=cell] {
        padding: 0 86px;
        background-color: #F7F7F7;;
    }

    .el-table__expanded-cell[class*=cell] .el-form{
        height: 44px;
        line-height: 44px;
    }

    /deep/ .el-form-item__content {
        line-height: 46px;
    }

    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        height: 440px;
        overflow-y: auto;
        overflow-x:auto;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 4px;
        height: 8px;
        background: #FAFAFA;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }

    /deep/ .el-table td .cell {
        height: 30px;
        line-height: 30px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /deep/ .el-table__row .cell span{
        overflow-x: initial;
    }

    .searchBox{
        margin-bottom: 10px;
        font-size: 14px;
        color: #666666;
    }
    .searchBox /deep/ .el-input-number--small{
        width: 162px;
        margin: 0 10px 0 5px;
    }

    /*城市按钮*/
    .city_radio{
        display: inline-block;
        width: 68px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 12px;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 10px 3px 0;
        color: #606266;
        border: 1px solid #dcdfe6;
    }
    .active_radio{
        background: #409EFF;
        color: #fff;
    }

    .addMinus{
        position: relative;
    }

    .addMinus /deep/ .el-input-number.is-controls-right .el-input__inner{
        padding-left: 5px;
        padding-right: 32px;
    }

    .addMinus /deep/ .el-input-number--mini{
        width: 90%;
    }

    .shareTable /deep/ .has-gutter th:nth-child(7),
    .shareTable /deep/ .has-gutter th:nth-child(6),
    .shareTable /deep/ .has-gutter th:nth-child(5),
    .shareTable /deep/ .el-table__row td:nth-child(7),
    .shareTable /deep/ .el-table__row td:nth-child(5),
    .shareTable /deep/ .el-table__row td:nth-child(6) {
        text-align: right;
    }

    .shareTable /deep/ .has-gutter th:nth-child(10),
    .shareTable /deep/ .has-gutter th:nth-child(11),
    .shareTable /deep/ .has-gutter th:nth-child(12),
    .shareTable /deep/ .has-gutter th:nth-child(13),
    .shareTable /deep/ .el-table__row td:nth-child(10),
    .shareTable /deep/ .el-table__row td:nth-child(11),
    .shareTable /deep/ .el-table__row td:nth-child(12),
    .shareTable /deep/ .el-table__row td:nth-child(13){
        text-align: center;
    }

    .shareTable {
        /deep/ .el-input-number--mini {
            .el-input__inner {
                height: 28px;
                padding-left: 28px;
                padding-right: 28px;
            }
            .el-input-number__decrease, .el-input-number__increase {
                width: 26px;
            }
        }
    }


    @media all and (min-width: 1900px){
        /deep/ .el-table__body-wrapper{
            overflow-x: hidden;
        }
    }
</style>
<style>
    .shareADSBtn>.el-message-box__content>.el-icon-warning{
        top:33%
    }
    .shareADSBtn>.el-message-box__content>.el-message-box__message{
        padding-left:0;
    }
    .shareADSBtn>.el-message-box__content>.el-message-box__message>p{
        text-indent: 30px;
    }
</style>
