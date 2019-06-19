<template>
    <div class="mobile_container">
        <mt-spinner color="#26a2ff" type="triple-bounce" v-show="mtLoading" class="mtSpinner"></mt-spinner>
        <div v-show="!mtLoading">
            <header class="mobile_head">
                <h2 class="mobile_head_apTitle">
                    <span>{{FAData.apName}}</span>
                    <div class="selectCity">
                        <el-select v-model="activeCity" placeholder="请选择" size="mini" @change="changeCity">
                            <el-option
                                v-for="(item,index) in throwCity"
                                :key="index"
                                :label="item.rName"
                                :value="item.cityAsName">
                            </el-option>
                        </el-select>
                    </div>
                </h2>
                <p class="head_p">公司名称：{{FAData.cName}}</p>
                <p class="head_p">品牌名称：{{FAData.cBand}}</p>
            </header>
            <div class="mobile_list">
                <div class="list_box"
                     v-infinite-scroll="loadMore"
                     :infinite-scroll-disabled="loading_m"
                     infinite-scroll-distance= '30'
                     infinite-scroll-immediate-check="false"
                >
                    <div class="child_box" v-for="info of showData">
                        <ul>
                            <li class="box_li li_title">{{info.resName}}
                                <i class="el-icon-more" style="color:#A0A0A0" @click="resIndfo(info.resID)"></i>
                            </li>
                            <li class="box_li">排期: {{info.schedules}}<span class="box_li_inteval">|</span>可选面数：{{info.selectableMax}}面</li>
                            <li class="box_li">
                                <span class="li_span">{{info.city}} {{info.origin}}</span>
                                <span class="li_span">{{info.buildingType}}</span>
                                <span class="li_span" style="margin-right: 0">&yen;{{info.buildPrice}}/m<sup>2</sup></span>
                            </li>
                            <li class="box_li box_li_select" v-if="editing && activeIsLevel">
                                <span class="box_li_level_title">A级面数</span>
                                <mt-button type="default" :class="info.selectedNum.A > 0 ? '' : 'box_li_show_level_num'" size="small" @click="showSelectNum(info,'A')">
                                    {{info.selectedNum.A || '可选'+info.levelNum.A+'面'}}
                                    <i class="el-icon-caret-bottom" style="color: #D8D8D8"></i>
                                </mt-button>
                            </li>
                            <li class="box_li box_li_select" v-if="editing && activeIsLevel">
                                <span class="box_li_level_title">B级面数</span>
                                <mt-button type="default" :class="info.selectedNum.B > 0 ? '' : 'box_li_show_level_num'" size="small" @click="showSelectNum(info,'B')">
                                    {{info.selectedNum.B || '可选'+info.levelNum.B+'面'}}
                                    <i class="el-icon-caret-bottom" style="color: #D8D8D8"></i>
                                </mt-button>
                            </li>
                            <li class="box_li box_li_select" v-if="editing && activeIsLevel">
                                <span class="box_li_level_title">C级面数</span>
                                <mt-button type="default" :class="info.selectedNum.C > 0 ? '' : 'box_li_show_level_num'" size="small" @click="showSelectNum(info,'C')">
                                    {{info.selectedNum.C || '可选'+info.levelNum.C+'面'}}
                                    <i class="el-icon-caret-bottom" style="color: #D8D8D8"></i>
                                </mt-button>
                            </li>
                            <li class="box_li" v-if="editing && !activeIsLevel">
                                <div class="box_li_addMinus">
                                    <el-input-number
                                        v-model="info.selectedNum"
                                        size="mini"
                                        @change="addMinusFun(info)"
                                        :min="0"
                                        :max="info.selectableMax">
                                    </el-input-number>
                                </div>
                            </li>
                            <li class="box_li box_li_select" v-if="editing && info.roadGateTotal > 0">
                                <span class="box_li_level_title">道闸面数</span>
                                <mt-button type="default" :class="info.selectedRoadGateNum > 0 ? '' : 'box_li_show_level_num'" size="small" @click="showSelectNum(info,'RoadGate')">
                                    {{info.selectedRoadGateNum || '可选'+ info.roadGateTotal +'面'}}
                                    <i class="el-icon-caret-bottom" style="color: #D8D8D8"></i>
                                </mt-button>
                            </li>
                        </ul>
                    </div>
                    <p class="bottomText_p" v-show="bottomText">Copyright &copy;2018 亲邻科技线上产品</p>
                    <!--   <p class="bottomText_p" v-show="bottomText">
                           -&#45;&#45;&#45;&#45; 我也是有底线的人 -&#45;&#45;&#45;&#45;
                       </p>-->
                </div>
                <div class="mobile_list_selectPoint" v-if="editing" @click="searchMedia">一键选点</div>
            </div>
            <footer v-if="editing">
                <el-checkbox v-model="allAD" @change="selectAllAD"></el-checkbox>
                <span>已选择 {{resMediaAdsNum.resNum}} 个小区，{{resMediaAdsNum.ADNum}} 面广告</span>
                <span class="footerBtn">
                    <button @click="submitFun_m">提 交</button>
                </span>
            </footer>
            <!--资源详情-->
            <mt-popup
                v-model="isMessage"
                popup-transition="popup-fade"
                style="background: none">
                <div class="resMessage" v-show="isMessage">
                    <div class="message_box">
                        <h3>{{mediaInfo.resName}}</h3>
                        <h3 style="color: #666666;font-weight:normal;font-size: 1rem;margin-bottom: 1.3rem">{{mediaInfo.mediaName}}</h3>
                        <ul>
                            <li class="mbox_li">城市 <span></span><b>{{mediaInfo.city}}</b></li> <!--span为虚线-->
                            <li class="mbox_li">区域 <span></span><b>{{mediaInfo.origin}}</b></li>
                            <!--<li class="mbox_li">媒体类型 <span></span><b>{{mediaInfo.mVehicle}}</b></li>-->
                            <li class="mbox_li">楼盘类型<span></span><b>{{mediaInfo.buildingType}}</b></li>
                            <li class="mbox_li">楼盘价格<span></span><b>¥{{mediaInfo.buildPrice}}/m²</b></li>
                            <li class="mbox_li">商圈<span></span><b>{{mediaInfo.tradingArea}}</b></li>
                            <li class="mbox_li">楼栋数量<span></span><b>{{mediaInfo.fNum}}</b></li>
                            <!--<li class="mbox_li">资产编号<span></span><b>{{mediaInfo.assetTag}}</b></li>-->
                            <!--<li class="mbox_li">广告尺寸<span></span><b>{{mediaInfo.adSize}}</b></li>-->
                            <li class="mbox_li">入住年份<span></span><b>{{mediaInfo.chDay}}</b></li>
                            <li class="mbox_li">小区户数<span></span><b>{{mediaInfo.houseNum}}</b></li>
                            <!--<li class="mbox_li">广告限制<span></span><b>{{mediaInfo.adLimit}}</b></li>-->
                        </ul>
                    </div>
                    <div class="resMessage_Btn">
                        <i class="el-icon-error" style="font-size: 2.5rem;color: #fff" @click="isMessage = false"></i>
                    </div>
                </div>
            </mt-popup>
            <!--面数选择List-->
            <mt-actionsheet
                :actions="selectedList"
                v-model="sheetVisible">
            </mt-actionsheet>
            <!--媒体分层-一键选点-->
            <mt-popup
                v-model="oneKeyPopupVisible"
                popup-transition="popup-fade"
                style="background: none">
                <div class="onekey_box">
                    <div class="onekey_box_main">
                        <h3 style="margin-bottom: 0.75rem">请选择需求面数</h3>
                        <ul>
                            <li class="onekey_box_main_li">
                                <span class="onekey_box_main_li_title">A级面数</span>
                                <input type="text" :placeholder="'可选' + haveLevelNum.A + '面'" :disabled="!haveLevelNum.A" v-model="selectLevelNum.A">
                            </li>
                            <li class="onekey_box_main_li">
                                <span class="onekey_box_main_li_title">B级面数</span>
                                <input type="text" :placeholder="'可选' + haveLevelNum.B + '面'" :disabled="!haveLevelNum.B" v-model="selectLevelNum.B">
                            </li>
                            <li class="onekey_box_main_li">
                                <span class="onekey_box_main_li_title">C级面数</span>
                                <input type="text" :placeholder="'可选' + haveLevelNum.C + '面'" :disabled="!haveLevelNum.C" v-model="selectLevelNum.C">
                            </li>
                        </ul>
                    </div>
                    <div class="onekey_box_footer">
                        <mt-button size="normal" class="button_left" @click="oneKeyPopupVisible = false">取消</mt-button>
                        <mt-button size="normal" class="button_right" @click="validateOneKey">确认</mt-button>
                    </div>
                </div>
            </mt-popup>
        </div>
    </div>
</template>

<script>
    import api from '../../api/api'
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import {MessageBox, Popup, InfiniteScroll } from 'mint-ui';

    export default {
        name: "shareADList_mobile",
        data() {
            return {
                mtLoading:true,         // 显示加载状态
                cName: '',
                bName: '',
                FAData:{apName:'',cName:'',cBand:''}, // 中信西关海三月份投放
                showData: [],           // 显示的列表
                listData: [],           // 装换后的数据
                loadMoreIndex: 0,
                isMessage: false,        // 媒体详情消息框
                urlParams: '',           // url参数
                apid: '',                // 方案id
                aicode: '',              //  获取方案点位列表的密钥
                isPC: true,             // 默认为PC端页面
                shareADSData: '',
                mediaInfo: {             // 媒体详情
                    resName: '',
                    mID: '',
                    city: '',
                    fNum: '',
                    houseNum: '',
                    mediaName: '',
                    chDay: '',
                    adLimit: '',
                    assetTag: '',
                    origin: '',
                    buildType: '',
                    adSize: '',
                    tradingArea: '',
                    buildPrice: '',
                },
                editing: true,          // 数据可编辑
                shopMedia_ADNum: {resNum: 0, mediaNum: 0, ADNum: 0},      // 媒体面数、点位面数
                allAD: false,            // 全选按钮
                loading_m: false,
                bottomText: false,      // 判断滚动加载是否完成
                throwCity: [],          // 投放城市
                activeCity: '',         //当前城市
                resMediaAdsNum:{resTotalNum: 0,mediaTotalNum: 0,ADTotalNum:0,resNum:0,ADNum:0},     // 统计数据
                selectNum: 0,
                sheetVisible: false,
                selectedList:[
                    // {name:1,method: this.checkNum},
                    // {name:0,method: this.checkNum},
                ],
                activeIsLevel: true,          // 当前城市是否执行媒体分层
                activeResData: '',            //当前点击的资源数据
                activeLevel: '',              // 当前要选择的等级
                oneKeyPopupVisible: false,    // 一键选点的弹出框
                haveLevelNum: {A: 0, B: 0, C: 0},
                selectLevelNum: {A: '', B: '', C: ''},
                isRoadGate: false,
            }
        },
        components: {
            mtPopup: Popup,
        },
        created() {
            console.log('创建Create')
            this.browserRedirect()
        },
        mounted() {
            if (!this.isPC) {
                this.getUrl();      // 获取地址栏信息
                this.getApInfo();      // 判断方案信息
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
            // 获取url其中的apid和aicode
            getUrl() {
                this.urlParams = location.search
                this.apid = (this.urlParams.split("=")[1]).split('&')[0]
                this.aicode = this.urlParams.split("=")[2]
                console.log('urlParams', this.urlParams, 'apid', this.apid)
            },
            // 获取方案信息
            getApInfo() {
                api.getApi(this.apiVar.Advertisement+'/GetShareADS', {aicode: this.aicode}).then(res => {
                    console.log('GetShareADS', res)
                    if (res.data !== '' && !res.data.SysCode) {
                        this.shareADSData = res.data
                        let aiInfo = JSON.parse(res.data.aiInfo)
                        this.FAData = {apName: aiInfo.apname, cName: aiInfo.cname, cBand: aiInfo.cband}
                        // console.log('aisTime', this.shareADSData.aisTime)
                        if (this.shareADSData.aiIP === undefined || this.shareADSData.aiIP === '' || this.shareADSData.asIDList === undefined) {
                            this.editing = true    // 数据可编辑
                            // this.key = 1
                        } else {
                            this.editing = false      // 数据只读
                            // this.key = 2
                        }
                        this.getADList()
                    } else {
                        this.mtLoading = false
                        if (res.data.SysCode === 300404 || res.data.MSG === '该Code不存在') {
                            this.$router.push("/*");
                        } else {
                            this.$message({
                                message: '无法获取到数据',
                                type: 'warning',
                                customClass: 'Mes_mobile',
                            })
                        }
                    }
                })
            },
            //切换城市
            changeCity(){
                console.log('当前城市',this.activeCity)
                let cityAsName = this.activeCity.split('-')
                for(let key of this.listData){
                    if(key.rName === cityAsName[0] && key.asName == cityAsName[1]){
                        this.activeIsLevel = key.isLevel
                        this.showData = key.adsArr
                        break
                    }
                }
                console.log('this.activeIsLevel',this.activeIsLevel)
                this.firstShowData()
            },
            // 获取该方案原始数据
            getADList() {
                api.getApi(this.apiVar.Advertisement + '/GetMapADB', {apid: this.apid}).then(res => {
                    console.log('获取协同选点列表', res)
                    if (res.data.code === 300200 || res.data.msg === 'success'){
                        if (JSON.stringify(res.data.data) === "{}") {
                            this.$message({
                                message: '暂无数据',
                                type: 'warning',
                                customClass: 'Mes_mobile',
                            })
                        } else{  let resArr =  res.data.data.result
                            let tableArr = []
                            let cityAsNameList = []
                            let i = 0
                            for (let key of resArr) {
                                let arr = []
                                let maxSelectNum = ''
                                if(key.classified === 1){
                                    maxSelectNum = {A: 0, B: 0, C: 0}
                                }else{
                                    maxSelectNum = 0
                                }
                                for (let rKey of key.data) {
                                    if (key.classified == 1) {
                                        maxSelectNum.A += (rKey.A || 0)
                                        maxSelectNum.B += (rKey.B || 0)
                                        maxSelectNum.C += (rKey.C || 0)
                                    } else {
                                        maxSelectNum += ((rKey.adDoorTotal || 0) + (rKey.roadGateTotal || 0))
                                    }
                                    let time = this.formatTime(rKey.pbStar) + "-" + this.formatTime(rKey.pbEnd);
                                    arr.push({
                                        rID: rKey.rID,
                                        asName: rKey.asName,                // 点位所属公司名称
                                        city: rKey.city,
                                        resID: rKey.resID,
                                        resMapID: rKey.resMapID,             // 资源mapID
                                        resName: rKey.resName,
                                        address: rKey.resAddress || '',
                                        chDay: rKey.chDay,                   // 建成年份
                                        fNum: rKey.fNum || '',
                                        houseNum: rKey.hNum || '',
                                        buildPrice: rKey.hPrice / 100 || '',
                                        schedules: time,
                                        origin: rKey.rName || '',
                                        buildingType: rKey.cType || '',
                                        selectableMax: (rKey.adDoorTotal || 0) + (rKey.roadGateTotal || 0),
                                        roadGateTotal: rKey.roadGateTotal,
                                        adDoorTotal: rKey.adDoorTotal,
                                        levelNum: key.classified == '1' ? {A: rKey.A || 0, B: rKey.B || 0, C: rKey.C || 0} : rKey.adDoorTotal,
                                        selectedNum: key.classified == '1' ? {A: 0, B: 0, C: 0} : 0,
                                        selectedRoadGateNum: 0
                                    })
                                }
                                tableArr.push({
                                    index: i,
                                    asName: key.asName,
                                    rName: key.city,
                                    maxSelectNum: maxSelectNum,
                                    isLevel: key.classified == 1 ? true : false,
                                    adsArr: arr
                                })
                                cityAsNameList.push({
                                    asName: key.asName,
                                    rName: key.city,
                                    cityAsName: key.city + '-' + key.asName,
                                })
                                i++
                            }
                            this.listData = tableArr
                            this.throwCity = cityAsNameList
                            this.activeCity =  cityAsNameList[0].cityAsName
                            console.log('this.activeCity ',this.activeCity,this.throwCity)
                            this.activeIsLevel =  tableArr[0].isLevel
                            // 列表的初始化
                            this.firstShowData()
                            this.computeNumber()
                        }
                    } else {
                        this.mtLoading = false
                        this.$message({
                            message: res.data.MSG,
                            type: 'warning',
                            customClass: 'Mes_mobile',
                        })
                    }
                })
            },
            // 统计总面数和资源数
            computeNumber(){
                // let resArr = []
                // let adsArr = []
                // let adsNum = 0
                // for(let key of this.listData){
                //     for(let akey of key.adsArr){
                //         if(!resArr.includes(akey.resID)){
                //             resArr.push(akey.resID)
                //         } else {
                //             // console.log('重复的资源',akey.resID,akey.resName)
                //         }
                //         if(!adsArr.includes(akey.mID)){
                //             adsArr.push(akey.mID)
                //             adsNum += akey.selectableMax
                //         } else {
                //             // console.log('重复的面',akey.mID)
                //         }
                //     }
                // }
                // this.resMediaAdsNum.resTotalNum = resArr.length
                // this.resMediaAdsNum.ADTotalNum = adsNum
            },
            // 列表的初始化- 判断是否需要滚动加载
            firstShowData(){
                console.log('初始化列表',this.listData)
                let cityAsName = this.activeCity.split('-')
                let listData = []
                for (let key of this.listData) {
                    if (key.rName === cityAsName[0] && key.asName == cityAsName[1]) {
                        listData = key.adsArr
                        break
                    }
                }
                if(listData.length <= 20){
                    // console.log('当前城市数据少于20')
                    this.showData = listData
                    this.loadMoreIndex = listData.length
                    this.bottomText = true
                } else {
                    let tempData = []
                    for (let i = 0; i < listData.length; i++) {
                        if (i < 20) {
                            tempData.push(listData[i])
                        } else {
                            this.loadMoreIndex = i
                            break
                        }
                    }
                    this.showData = tempData
                }
                this.mtLoading = false
            },
            // 根据resID获取媒体详情
            resIndfo(resID) {
                let temp_resID = resID
                let ADList = []
                let cityAsName = this.activeCity.split('-')
                for (let key of this.listData) {
                    if (key.rName === cityAsName[0] && key.asName === cityAsName[1]) {
                        ADList = key.adsArr
                        break
                    }
                }
                for (let data of ADList) {
                    if (data.resID === temp_resID) {
                        this.mediaInfo = {
                            rID: data.rID,
                            // mID: data.mID,
                            resName: data.resName,
                            city: data.city,
                            origin: data.origin,
                            buildingType: data.buildingType,
                            houseNum: data.houseNum,
                            // mVehicle: data.mVehicle,
                            buildPrice: data.buildPrice,
                            // mediaName: data.mediaName,
                            fNum: data.fNum,
                            tradingArea: data.tradingArea || '空',
                            chDay: data.chDay,
                            adSize: data.adSize || '',
                        }
                        break
                    }
                }
                this.isMessage = true
            },
            // 搜索
            searchMedia() {
                let cityAsName = this.activeCity.split('-')
                if (this.activeIsLevel) {
                    this.oneKeyPopupVisible = true
                    let haveNum = {A: 0, B: 0, C: 0}
                    for (let lkey of this.listData){
                        if(lkey.rName === cityAsName[0] && lkey.asName === cityAsName[1]){
                            for(let akey of lkey.adsArr){
                                haveNum.A += akey.levelNum.A - akey.selectedNum.A
                                haveNum.B += akey.levelNum.B - akey.selectedNum.B
                                haveNum.C += akey.levelNum.C - akey.selectedNum.C
                            }
                            break
                        }
                    }
                    this.haveLevelNum = haveNum
                    console.log('this.haveLevelNum',this.haveLevelNum)
                }else{
                    MessageBox({
                        $type:'prompt',
                        title:'请输入需求面数',
                        message:' ',
                        closeOnClickModal:false,   //点击model背景层不关闭MessageBox
                        showCancelButton:true,   //不显示取消按钮
                        inputValue: '0',
                        showInput:true,
                        inputPattern: /^[0-9]+$/,    //正则条件
                        inputErrorMessage:'请输入正确的值'
                    }).then(({ value, action }) => {
                        // console.log('',this.inputErrorMessage)
                        console.log(value,action)
                        console.log('一键选点', this.listData, this.activeCity)
                        let cityTotalNum = 0
                        let selectNum = 0
                        let cityAsName = this.activeCity.split('-')
                        for (let lkey of this.listData) {
                            if(lkey.rName === cityAsName[0] && lkey.asName === cityAsName[1]){
                                for(let akey of lkey.adsArr){
                                    cityTotalNum += akey.selectableMax
                                    selectNum += akey.selectedNum
                                }
                            }
                        }
                        let num = cityTotalNum - selectNum
                        if (num >= value) {
                            this.selectNum = value
                            this.oneKeySelectPoint([],0,0)
                            this.computeMedia_AD()      // 统计媒体数、面数
                            console.log('this.showData',this.showData)
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '该城市可选面数为' + num + '面,不足' + value + '面',
                                customClass: 'Mes_mobile',
                            })
                            // this.searchMedia()
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消',
                            customClass: 'Mes_mobile',
                        })
                    });
                }
            },
            // 校验一键选点的数值是否符合要求
            validateOneKey(){
                if(this.selectLevelNum.A || this.selectLevelNum.B || this.selectLevelNum.C){
                    console.log(this.selectLevelNum,typeof(this.selectLevelNum.A))
                    let isBool = {A: true,B: true,C: true}
                    let reg = /^[0-9]+$/ ;
                    for(let i in this.selectLevelNum){
                        if (!(reg.test(this.selectLevelNum[i]))) {
                            if(this.selectLevelNum[i] !== ''){
                                isBool[i] = false
                            }
                        }
                    }
                    console.log('isBool',isBool)
                    if(isBool.A && isBool.B && isBool.C){
                        if (this.selectLevelNum.A <= this.haveLevelNum.A &&
                            this.selectLevelNum.B <= this.haveLevelNum.B &&
                            this.selectLevelNum.C <= this.haveLevelNum.C) {
                            console.log('满足面数',)
                            this.isLevelOnekeySelect([], {A: 0, B: 0, C: 0}, 0)
                            this.oneKeyPopupVisible = false
                            this.computeMedia_AD()
                            // this.hadADBySelectedNum()
                        } else {
                            this.messageFun('warning', '该城市可选面数为:A级' + this.haveLevelNum.A + '面、B级' + this.haveLevelNum.B +
                                '面、C级' + this.haveLevelNum.C + '面,不满足:A级' + this.selectLevelNum.A || 0 + '面、B级' +
                                this.selectLevelNum.B || 0 + '面、C级' + this.selectLevelNum.C || 0 + '面')
                        }
                    }else{
                        this.messageFun('warning','需求面数只能为正整数')
                    }
                }else{
                    this.messageFun('warning','需求面数不能为空')
                }
            },
            // 执行媒体分层的一键选择
            isLevelOnekeySelect(arr,MediaNum,time){
                console.log('媒体分层',arr, MediaNum)
                let cityAsName = this.activeCity.split('-')
                for(let lkey of this.listData){
                    if(lkey.rName === cityAsName[0] && lkey.asName === cityAsName[1]){
                        for (let skey of lkey.adsArr){
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
                    }
                }
                console.log('this.selectLevelNum',this.selectLevelNum)
                if (this.selectLevelNum.A > MediaNum.A || this.selectLevelNum.B > MediaNum.B || this.selectLevelNum.C > MediaNum.C) {
                    time++
                    this.isLevelOnekeySelect(arr, MediaNum, time)
                }
            },
            // 一键选择
            oneKeySelectPoint(arr,MediaNum,time){
                console.log('一键选择', arr, MediaNum)
                let cityAsName = this.activeCity.split('-')
                for (let lkey of this.listData){
                    if(lkey.rName === cityAsName[0] && lkey.asName === cityAsName[1]){
                        for (let skey of lkey.adsArr) {
                            if (MediaNum < this.selectNum) {
                                if (time === 0) {
                                    if (!arr.includes(skey.resID)) {
                                        arr.push(skey.resID)
                                        if (skey.selectableMax > skey.selectedNum) {
                                            skey.selectedNum++
                                            MediaNum++
                                        }
                                    }
                                } else {
                                    if (arr.includes(skey.resID)) {
                                        if (skey.selectableMax > skey.selectedNum) {
                                            skey.selectedNum++
                                            MediaNum++
                                        }
                                    }
                                }
                            } else {
                                return false
                            }
                        }
                        break
                    }
                }
                if (MediaNum < this.selectNum) {
                    time++
                    this.oneKeySelectPoint(arr, MediaNum, time)
                }
            },
            // 媒体分层 - 选择ABC级面数
            showSelectNum(info,level) {
                console.log('info',info,'level',level)
                let arr = []
                if(level === 'RoadGate'){
                    this.isRoadGate = true
                    for (let i = 0; i <= info.roadGateTotal; i++) {
                        arr.unshift({
                            name: i,
                            method: this.checkNum
                        })
                    }
                }else{
                    this.isRoadGate = false
                    for (let i = 0; i <= info.levelNum[level]; i++) {
                        arr.unshift({
                            name: i,
                            method: this.checkNum
                        })
                    }
                }
                console.log('arr',arr)
                this.selectedList = arr
                this.activeResData = info
                this.activeLevel = level
                this.sheetVisible = true
            },
            checkNum(val){
                console.log('val',val,this.activeCity)
                let cityAsName = this.activeCity.split('-')
                for(let key of this.listData){
                    if(key.rName == cityAsName[0] && key.asName === cityAsName[1]){
                        for(let akey of key.adsArr){
                            if(akey.resID === this.activeResData.resID && akey.schedules === this.activeResData.schedules){
                                if(this.isRoadGate){
                                    akey.selectedRoadGateNum = val.name
                                }else{
                                    akey.selectedNum[this.activeLevel] = val.name
                                }

                                break
                            }
                        }
                    }
                }
                let timer = setTimeout(()=>{
                    this.computeMedia_AD()
                    clearTimeout(timer)
                },200)
            },
            // 加减
            addMinusFun(info){
                // console.log('info',info)
                this.computeMedia_AD()
            },
            // 全选
            selectAllAD(val) {
                // console.log('val', val)
                if (val === true) {
                    for(let key of this.listData){
                        for(let akey of key.adsArr){
                            if (key.isLevel) {
                                akey.selectedNum.A = akey.levelNum.A
                                akey.selectedNum.B = akey.levelNum.B
                                akey.selectedNum.C = akey.levelNum.C
                                akey.selectedRoadGateNum = akey.roadGateTotal
                            } else {
                                akey.selectedNum = akey.adDoorTotal
                                akey.selectedRoadGateNum = akey.roadGateTotal
                            }
                        }
                    }
                    this.computeMedia_AD()      // 统计媒体数、面数
                } else {
                    this.resetPlanList()
                    this.resMediaAdsNum.resNum = 0
                    this.resMediaAdsNum.ADNum = 0
                }
            },
            // 重置listData的选择数量
            resetPlanList() {
                // console.log('重置选择数量开始')
                for(let key of this.listData){
                    for(let akey of key.adsArr){
                        if(this.activeIsLevel){
                            akey.selectedNum.A = 0
                            akey.selectedNum.B = 0
                            akey.selectedNum.C = 0
                            akey.selectedRoadGateNum = 0
                        }else{
                            akey.selectedNum = 0
                            akey.selectedRoadGateNum = 0
                        }
                    }
                }
                // console.log('重置选择数量结束')
            },
            // 统计购物车媒体数、面数
            computeMedia_AD() {
                console.log('统计购物车媒体数、面数',this.listData)
                let resArr = []
                let adsNum = 0
                for(let key of this.listData){
                    for(let akey of key.adsArr){
                        if(key.isLevel){ // this.activeIsLevel
                            if (!resArr.includes(akey.resID)){
                                if(akey.selectedNum.A || akey.selectedNum.B || akey.selectedNum.C || akey.selectedRoadGateNum){
                                    resArr.push(akey.resID)
                                }
                            }
                            adsNum += akey.selectedNum.A + akey.selectedNum.B + akey.selectedNum.C + akey.selectedRoadGateNum
                        }else{
                            console.log('')
                            if (!resArr.includes(akey.resID) && akey.selectedNum) {
                                resArr.push(akey.resID)
                                adsNum += akey.selectedNum + akey.selectedRoadGateNum
                            }
                        }
                    }
                }
                // console.log('统计已选中的资源数、面数',resArr,adsArr,adsNum)
                this.resMediaAdsNum.resNum = resArr.length
                this.resMediaAdsNum.ADNum = adsNum
                if(this.resMediaAdsNum.ADNum >= this.resMediaAdsNum.ADTotalNum){
                    this.allAD = true
                }else{
                    this.allAD = false
                }
            },
            // 提交前判断是否有勾选
            returnIsSelect(){
                for (let key of this.listData) {
                    console.log('key',key)
                    for (let aKey of key.adsArr) {
                        if (key.isLevel) {
                            if (aKey.selectedNum.A > 0 || aKey.selectedNum.B > 0 || aKey.selectedNum.C > 0 || aKey.selectedRoadGateNum > 0) {
                                console.log('提交前判断是否有勾选',aKey)
                                return true
                            }
                        } else {
                            if (aKey.selectedNum > 0 || aKey.selectedRoadGateNum > 0) {
                                console.log('提交前判断是否有勾选',aKey)
                                return true
                            }
                        }
                    }
                }
                return false
            },
            // 提交按钮
            submitFun_m() {
                let isBool = this.returnIsSelect()
                if (!isBool) { // this.resMediaAdsNum.ADNum <= 0
                    this.$message({
                        message: '请选择点位后再提交！',
                        type: 'warning',
                        customClass: 'Mes_mobile',
                    })
                } else {
                    MessageBox.confirm('该页面仅能提交一次，请确认无误后提交。提交后，您的方案选点信息将同步到亲邻选点系统', '提交点位信息').then(action => {
                        // console.log('点击了确认', action)
                        this.PushShareADSFun()
                        this.editing = false
                    }).catch(() => {
                        console.log('点击了取消')
                    })
                }

            },
            // 反馈协同选点列表
            PushShareADSFun() {
                console.log('反馈协同选点列表',this.ADList)
                let params = {aiCode: this.aicode, asIDList: []}
                for(let key of this.listData){
                    for(let aKey of key.adsArr){
                        if (key.isLevel) {
                            if (aKey.selectedNum.A > 0 || aKey.selectedNum.B > 0 || aKey.selectedNum.C > 0 || aKey.selectedRoadGateNum > 0){
                                params.asIDList.push({
                                    classified: key.isLevel ? '1' : '0',
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
                            if (aKey.selectedNum > 0 || aKey.selectedRoadGateNum > 0) {
                                params.asIDList.push({
                                    classified: key.isLevel ? '1' : '0',
                                    resID: aKey.resID,
                                    selectedAdDoor: aKey.selectedNum,
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
                            type: 'success',
                            customClass: 'Mes_mobile',
                        })
                        this.reading = false
                    } else {
                        this.$message({
                            message: '选点信息提交失败！(点位已被提交过或方案已发布)',
                            type: 'warning',
                            customClass: 'Mes_mobile',
                        })
                    }
                })
            },
            // 时间格式规范
            formatTime(val) {
                return dateFormat.toDate(val, "/")
            },
            // 滚动加载
            loadMore() {
                console.log('下标',this.loadMoreIndex)
                let index = this.loadMoreIndex
                let listData = []
                let cityAsName = this.activeCity.split('-')
                for (let key of this.listData) {
                    if (key.rName === cityAsName[0] && key.asName === cityAsName[1]) {
                        listData = key.adsArr
                        break
                    }
                }
                if (this.loadMoreIndex < listData.length) {
                    this.loading_m = true;
                    for (let i = 0; i < 10; i++) {
                        if (listData[index + i] !== undefined && listData[index + i] !== null) {
                            this.showData.push(listData[index + i])
                        }
                    }
                    this.loading_m = false
                    this.loadMoreIndex += 10
                    console.log('滚动加载', this.showData)
                } else {
                    this.loading_m = false;
                    this.bottomText = true
                }
            },
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType,
                    customClass: 'Mes_mobile',
                })
            },
        }
    }
</script>

<style scoped>
    .mobile_container {
        /*background: #F0F0F0;*/
        font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
    }
    .mtSpinner{
        position: fixed;
        top: 50%;
        left: 45%;
    }
    .mobile_head {
        padding: 1.3rem;
        height: 10.84rem;
        color: #fff;
        background: -webkit-linear-gradient(left, #0DACF3, #3D8CFF); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(right,#0DACF3, #3D8CFF); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(right,#0DACF3, #3D8CFF); /* Firefox 3.6 - 15 */
        background: linear-gradient(to right,#0DACF3, #3D8CFF); /* 标准的语法 */
        border-radius: 100% 100% 100% 100%/ 1% 1% 20% 20%;
        /*background-image: linear-gradient(132deg, #0DACF3 0%, #3D8CFF 100%);*/
    }
    .mobile_head_apTitle > span{
        font-size: 1.31rem;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        width: 77%;
    }
    .selectCity{
        float: right;
        width: 21%;
    }
    .selectCity /deep/ .el-input__inner{
        padding: 0 0.99rem 0 0.31rem;
        color: #fff;
        background: rgba(0,0,0,0);
        border: 1px solid #fff;
    }
    .selectCity /deep/ .el-select .el-input.is-focus .el-input__inner{
        border-color: #fff;
    }
    .selectCity /deep/ .el-select .el-input .el-select__caret{
        color: #fff;
    }
    .selectCity /deep/ .el-input__suffix{
        right: 0;
    }
    .selectCity /deep/ .el-input__icon{
        width: 1.32rem;
    }
    .head_p {
        margin-top: 0.5rem;
        font-size: 0.75rem;
    }

    .mobile_list {
        position: absolute;
        width: 100%;
        top: 7rem;
    }

    .list_box {
        margin: 0.5rem 0.25rem 3.5rem;
        padding: 0.5rem;
    }

    .child_box {
        /*height: 7.54rem;*/
        background: #fff;
        border-radius: 0.6rem;
        margin-bottom: 0.8rem;
        padding: 1rem 1rem 0.5rem;
        font-size: 0.75rem;
        box-shadow:0 0.125rem 1.5rem 0 rgba(0,0,0,0.1)
    }

    .box_li {
        margin-bottom: 0.75rem;
        color: #666666;
    }

    .box_li.li_title {
        font-size: 1rem;
        color: #484848;
        font-weight: 500;
        margin-bottom: 0.4rem;
        font-family: "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", sans-serif;
    }
    /*选择面数*/
    .box_li_select{
        position: relative;
    }
    .box_li_select /deep/ .mint-button--small{
        width: 100%;
        text-align: right;
    }
    .box_li_level_title{
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        z-index: 9;
    }
    /deep/ .box_li_show_level_num{
        color: #cccccc;
    }
    .box_li_inteval{
        color: #D8D8D8;
        display: inline-block;
        margin: 0 0.5rem;
    }
    .li_title i {
        display: inline-block;
        float: right;
    }

    .box_li_addMinus /deep/ .el-input-number--mini{
        width: 6.79rem;
    }
    .li_span {
        display: inline-block;
        padding: 0.2rem;
        background: #F8F8F9;
        border-radius: 4px;
        margin-right: 0.6rem;
        color: #999999;
    }
    .bottomText_p{
        text-align: center;
        color: #999999;
        font-size: 0.75rem;
        margin-bottom: 0.31rem;
    }
    .mobile_list_selectPoint{
        position: fixed;
        bottom: 4.5rem ;
        right: 0.7rem;
        width: 2.375rem;
        height:2.375rem;
        font-size: 0.875rem;
        padding: 0.5rem;
        text-align: center;
        color: #fff;
        border-radius: 50%;
        background:linear-gradient(130deg,rgba(37,171,246,1) 0%,rgba(16,142,233,1) 100%);
        box-shadow:0 0.25rem 0.75rem 0 rgba(0,0,0,0.2);
    }
    footer {
        position: fixed;
        bottom: 0;
        background: #fff;
        height: 2rem;
        z-index: 100;
        width: 100vw;
        padding: 0.8rem;
        font-size: 0.75rem;
        color: #666666;
        line-height: 2rem;
        border-top: 1px solid #F0F0F0;
    }

    .footerBtn {
        position: fixed;
        right: 0.8rem;
        bottom: 0.6rem;
    }
    .footerBtn>button{
        width: 5.75rem;
        height: 2.5rem;
        font-size: 1rem;
        border-radius: 1.25rem;
        background: #108EE9;
        border: none;
        color: #fff;
        line-height: 2.5rem;
        background:linear-gradient(130deg,rgba(37,171,246,1) 0%,rgba(16,142,233,1) 100%);
        background: -webkit-linear-gradient(130deg,rgba(37,171,246,1) 0%,rgba(16,142,233,1) 100%); /* Safari 5.1 - 6.0 */
        background: -moz-linear-gradient(130deg,rgba(37,171,246,1) 0%,rgba(16,142,233,1) 100%); /* Firefox 3.6 - 15 */
    }
    /*资源详情*/
    .resMessage {
        font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
    }

    .resMessage_Btn {
        padding-top: 0.5rem;
        text-align: center;
        background: rgb(128, 128, 128);
    }

    .message_box {
        width: 76vw;
        background: rgba(255, 255, 255, 0.97);
        border-radius: 0.88rem;
        padding: 1.1rem 1.5rem 1rem;
    }

    .message_box h3 {
        text-align: center;
        font-size: 1.2rem;
        margin-bottom: 0.4rem;
        color: #484848;
        font-weight: bold;
    }

    .mbox_li {
        position: relative;
        margin-bottom: 0.7rem;
        font-size: 0.88rem;
        color: rgba(153, 153, 153, 0.85);
    }

    .mbox_li span {
        position: absolute;
        display: inline-block;
        width: 55vw;
        top: 0.6rem;
        margin-left: 0.6rem;
        border-bottom: 1px dashed #a3a3a3;
        z-index: 101;
    }

    .mbox_li b {
        position: absolute;
        display: inline-block;
        padding-left: 0.4rem;
        right: 0;
        color: rgba(52, 52, 52, 0.85);
        background: #fff;
        z-index: 111;
        font-weight: normal;
    }
    /*一键选点弹出框*/
    .onekey_box{
        width: 66vw;
        border-radius: 0.4rem;
        background: #fff;
    }
    .onekey_box_main{
        text-align: center;
        padding: 1.325rem 1.85rem 1rem 1.35rem ;
    }
    .onekey_box_main_li{
        position: relative;
        font-size: 0.8125rem;
    }
    .onekey_box_main .onekey_box_main_li input{
        width: 100%;
        height: 2.25rem;
        margin-bottom: 0.75rem;
        border-radius: 0.25rem;
        border:1px solid rgba(216,216,216,1);
        text-align: right;
        padding-right: 0.5rem;
        outline: none;
    }
    .onekey_box_main_li_title{
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        color: #666666;
    }
    .onekey_box_footer{
        border-top: 1px solid #DDDDDD;
        display: flex;
    }
    .onekey_box_footer .mint-button{
        background: #fff;
        border: none;
    }
    .onekey_box_footer .mint-button.button_left{
        width: 49%;
        border-right: 1px solid #dddddd;
        color: #000;
    }
    .onekey_box_footer .button_right{
        flex: 1;
        color:rgba(16,142,233,1);
    }

    /deep/ .el-checkbox__inner{
        border-radius: 50%;
        width: 1.187rem;
        height: 1.178rem;
    }
    /deep/ .el-checkbox__inner::after{
        left: 6px;
        height: 9px;
        top:2px
    }
</style>
<style>
    .Mes_mobile {
        min-width: 15.5rem;
        z-index: 2005 !important;
    }

    .mint-msgbox-message {
        line-height: 1.5rem !important;
    }
    .mint-msgbox{
        border-radius: 7px;
    }
    .mint-msgbox-input input{
        width: 96%;
    }
    .mint-msgbox-btns button{
        font-size: 1.125rem;
    }
</style>
