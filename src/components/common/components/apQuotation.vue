<template>
    <div class="apQuotation"
         v-loading="computeLoading"
         element-loading-text="拼命计算中..."
         element-loading-background="rgb(250, 250, 250)">
        <el-tabs type="border-card">
            <el-tab-pane v-for="(item,index) in quotation" :label="item.asName + '-'+ item.city" :key="index" :index="index" v-model="quotation">
                <div class="media_price">
                    <div v-for="(mediaTypeItem, mediaTypeKey) in item.priceMsg" :key="mediaTypeKey" class="ad_section AdvertDoor">
                        <el-row>
                            <el-col :span="6">
                                <h4 style="text-align: left;padding-left: 16px">媒介载体</h4>
                                <div class="ad_SM">
                                    <div>
                                        <img class="ad_door" src="../../../../static/images/adDoor.png"/>
                                    </div>
                                    <div class="ad_SM_info">
                                        <h5>排期</h5>
                                        <ul class="SM_info_ul">
                                            <li v-for="(itemSM,indexSM) in mediaTypeItem.SM" :key="indexSM">{{itemSM}}</li>
                                        </ul>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="18">
                                <el-row class="AdvertDoor_price">
                                    <el-col :span="5">
                                        <h4>广告刊例价</h4>
                                        <p v-if="item.classified == 1" style="line-height: 18px;font-size: 12px">
                                            A级：¥{{item.levelPrice.A}}/面/周 <br>
                                            B级：¥{{item.levelPrice.B}}/面/周 <br>
                                            C级：¥{{item.levelPrice.C}}/面/周 <br>
                                        </p>
                                        <p v-else>¥{{mediaTypeItem.ADPrice}}/面/周</p>
                                        <h4>制作费单价</h4>
                                        <p>¥{{mediaTypeItem.MPrice}}/面</p>
                                        <h4>现金金额</h4>
                                        <p>¥ {{mediaTypeItem.cash}}</p>
                                    </el-col>
                                    <el-col :span="6">
                                        <h4>投放量/赠送</h4>
                                        <p>{{mediaTypeItem.tfl}}(面·天)/{{mediaTypeItem.GMDate}}(面·天)</p>
                                        <h4>广告面数</h4>
                                        <p>{{mediaTypeItem.ADNumber}}面</p>
                                        <h4>置换金额</h4>
                                        <p>¥ {{mediaTypeItem.zyzh}}</p>
                                    </el-col>
                                    <el-col :span="5">
                                        <h4>
                                            广告费折扣
                                            <el-popover
                                                v-if="item.classified == 1 && item.premium == 1"
                                                placement="top"
                                                width="240"
                                                trigger="hover">
                                                <span class="popover_span">
                                                    该城市A级点位超过<strong>{{item.mediaClassifiedPremium.execAPercent}}%</strong>
                                                    时，则折扣下限为<strong>{{item.mediaClassifiedPremium.discountA}}%</strong><br>
                                                    该城市B级点位超过<strong>{{item.mediaClassifiedPremium.execBPercent}}%</strong>
                                                    时，则折扣下限为<strong>{{item.mediaClassifiedPremium.discountB}}%</strong><br>
                                                </span>
                                                <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                                            </el-popover>
                                        </h4>
                                        <p>{{returnTwoFloat(mediaTypeItem.discount)}}%</p>
                                        <h4>制作费折扣</h4>
                                        <p>{{mediaTypeItem.makeDiscount}}%</p>
                                        <h4>其他金额</h4>
                                        <p>¥{{mediaTypeItem.other}}</p>
                                    </el-col>
                                    <el-col :span="5">
                                        <h4>
                                            广告费
                                            <el-popover
                                                v-if="item.classified == 1 && item.premium == 1"
                                                placement="top"
                                                width="240"
                                                trigger="hover">
                                                <span class="popover_span">
                                                    该城市的全部点位为A面时，广告费将自动溢价<strong>{{item.mediaClassifiedPremium.onlyAPremium}}%</strong><br>
                                                </span>
                                                <i slot="reference" class="el-icon-question" style="color: #dfdfdf"></i>
                                            </el-popover>
                                        </h4>
                                        <p>¥ {{mediaTypeItem.advertyPrice}}</p>
                                        <h4>制作费</h4>
                                        <p>¥ {{mediaTypeItem.makePrice}}</p>
                                        <h4>小计</h4>
                                        <p>¥{{mediaTypeItem.total}}</p>
                                    </el-col>
                                    <el-col :span="3">
                                        <template v-if="isDetail">
                                            <h4></h4>
                                            <p class="changeICon"></p>
                                            <h4></h4>
                                            <p class="changeICon"></p>
                                            <h4></h4>
                                            <p class="changeICon"></p>
                                        </template>
                                        <template v-else>
                                            <h4></h4>
                                            <p class="changeICon" @click="changePrice('AD', mediaTypeKey, item, mediaTypeItem)"
                                               >
                                                <i class="el-icon-edit-outline"></i></p>
                                            <h4></h4>
                                            <p class="changeICon" @click="changePrice('M', mediaTypeKey, item, mediaTypeItem)"
                                               >
                                                <i class="el-icon-edit-outline"></i></p>
                                            <h4></h4>
                                            <p class="changeICon" @click="changePrice('TP', mediaTypeKey, item, mediaTypeItem)"
                                               >
                                                <i class="el-icon-edit-outline"></i></p>
                                        </template>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <p class="remark">备注：{{mediaTypeItem.remark}}</p><!--置换物品为线上商城单价为100元的购物卡-->
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!--修改广告费-->
        <el-dialog
            title="修改广告费"
            :visible.sync="changeAD"
            width="30%">
            <div class="changeMakePrice">
                <div>
                    <div v-if="cityPriceData.classified === 1">
                        <p>赠送(面·天)</p>
                        <span class="change_make_price_level">A级：</span>
                        <el-input-number v-model="ADchanger.AGMDate" :min='0' :max="activeLevelNum.AMax" controls-position="right" @change="GMDateChange('A')">
                        </el-input-number>
                        <span class="change_make_price_level">B级：</span>
                        <el-input-number v-model="ADchanger.BGMDate" :min='0' :max="activeLevelNum.BMax" controls-position="right" @change="GMDateChange('B')">
                        </el-input-number>
                        <span class="change_make_price_level">C级：</span>
                        <el-input-number v-model="ADchanger.CGMDate" :min='0' :max="activeLevelNum.CMax" controls-position="right" @change="GMDateChange('C')">
                        </el-input-number>
                    </div>
                    <div v-else class="NoClassified">
                        <p>赠送(面·天)</p>
                        <el-input-number v-model="ADchanger.totalGMDate" :min='0' :max="MaxGMDate" controls-position="right" @change="GMDateChange()">
                        </el-input-number>
                    </div>
                </div>
                <p style="margin-top: 12px">
                    广告费
                    <span v-if="cityPriceData.classified === 1">
                        (A级:{{ADchanger.levelNum.ALevel || 0}}面、B级:{{ADchanger.levelNum.BLevel || 0}}面、C级:{{ADchanger.levelNum.Clevel || 0}}面)
                    </span>
                </p>
                <el-input v-model="ADchanger.reaPrice" placeholder="请输入内容" @change="checkInput(ADchanger.reaPrice,'AD')"
                          :clearable="true"></el-input>
                <p style="color: red;font-size: 12px" v-if="ADchanger.isAllA">*溢价后的广告费为：{{ADchanger.advertyPrice}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
               <el-button @click="changeAD = false">取 消</el-button>
               <el-button type="primary" @click="handleClose('AD')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改制作费-->
        <el-dialog
            title="修改制作费"
            :visible.sync="changeMake"
            width="30%">
            <div class="changeMakePrice">
                <p>制作费</p>
                <el-input v-model="makeChange.MReaPrice" placeholder="请输入内容"
                          @change="checkInput(makeChange.MReaPrice,'M')"
                          :clearable="true"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeMake = false">取 消</el-button>
                <el-button type="primary" @click="handleClose('M')">确 定</el-button>
            </div>
        </el-dialog>
        <!--修改结算方式-->
        <el-dialog
            title="修改结算方式"
            :visible.sync="changeBill"
            width="30%">
            <div class="changeBill">
                <h4>¥{{totalChange.total}}</h4>
                <p>现金结算</p>
                <el-input v-model="totalChange.cash" placeholder="请输入内容" @change="checkCash"
                          :clearable="true"></el-input>
                <p>资源置换</p>
                <el-input v-model="totalChange.zyzh" placeholder="请输入内容" @change="checkZyzh"
                          :clearable="true"></el-input>
                <p>其他费用</p>
                <el-input v-model="totalChange.other" placeholder="请输入内容" @change="checkOther"
                          :clearable="true"></el-input>
                <p>结算备注</p>
                <el-input v-model="totalChange.remark" type="textarea"></el-input>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeBill = false">取 消</el-button>
                <el-button type="primary" @click="handleClose('TP')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import commaFormat from '../../../commonFun/commaFormat'
    import api from '../../../api/api'
    // 时间格式化
    import dateFormat from "../../../commonFun/timeFormat.js";
    // 转换时间
    import dayToWeek from "../../../commonFun/dayToWeek.js";
    import sessFun from "../../../commonFun/sessFun.js";
    export default {
        name: "apQuotation",
        data(){
            return{
                infoDetail:{},
                quotation:[
                    // {
                    //     city:'北京市',
                    //     rid: '110100',
                    //     classified: 1,                   // 媒体分层 1执行 2不执行
                    //     premium: 0                       // 0不执行 1执行
                    //     mediaClassifiedPremium: '',      // 溢价信息
                    //     levelPrice: {A: 0, B: 0, C: 0}   // 执行媒体分层时各等级媒体价格
                    //     priceMsg:{
                    //         [mediaTypeId]:{
                    //             schedules: '',                // 排期
                    //             GMDate: 0,                   // 赠送面.天
                    //             discount: '100',           // 广告费折扣
                    //             advertyPrice: 3800,        // 广告费
                    //             ADNumber: 1,               // 广告画数量
                    //             makeDiscount: '100%',      // 制作费折扣
                    //             MPrice: 100.00,              // 制作费单价
                    //             reaPrice: 0,                // 广告费每次修改前的价格
                    //             oldPrice: 0,                //  广告费初始价格
                    //             MReaPrice: 0,              // 制作费原价
                    //             makePrice: 100,           // 制作费
                    //             ADPrice: 1900,             // 刊例价(面/周)
                    //             tfl: 14,                    //投放量
                    //             cash: 3900,               // 现金结算
                    //             zyzh: 0,                   // 资源置换
                    //             other: 0,                  // 其他费用
                    //             total: 0,
                    //             remark: '', //备注信息
                    //             isAllA: true,               // 是否全为A面
                    //     }
                    // },
                ],
                changeAD: false,
                changeMake: false,
                changeBill: false,
                ADchanger: {        // 广告费修改
                    rid: '',
                    totalGMDate: 0,
                    AGMDate: 0,
                    BGMDate:0,
                    CGMDate:0,
                    reaPrice: 0,
                    kind:'',
                    discount: 0,
                    advertyPrice: 0,
                    isAllA: false,      // 是否全为A面
                    levelNum: {},
                },
                beforeADGMDate:{AGMDate:0,BGMDate:0,CGMDate:0,totalGMDate:0},                                      //
                makeChange: {rid: '', MReaPrice: 0,kind:''},            // 制作费修改
                totalChange: {rid: '', cash: 0, zyzh: 0, other: 0, total: 0, remark: '',kind:''},   // 合计费用修改
                ADchangerReaPrice: true,        // 广告费修改验证
                totalChangeCash: true,          // 修改制作费现金输入验证
                totalChangeZyzh: true,          // 修改制作费资源置换输入验证
                totalChangeOther: true,         // 修改制作费其他费用输入验证
                priceInfo:{},                   // 当前修改的信息
                cityPriceData: {},              // 当前修改的城市价格信息
                premiumData:'',                 // 溢价信息
                MaxGMDate: 0,                   // 最大赠送面天
                isDetail: true,                 // 标示来源-创建、详情等
                sessionData: sessFun.getSess(),
                ADPriceList: [],                // 城市刊例价
                CSMList: [],                    // 城市不同排期的所有面数
                commentMediaADNum: [],        // 统计同一城市相同因不同排期而选择相同的asid
                cityADLevelNum: [],           // 各城市不同等级媒体可赠送的最大面天数
                activeLevelNum: {city: '', AMax: 0, BMax: 0, CMax: 0},           // 当前弹出框的赠送面天限制
                ridString: '',               // 获取个城市rid,以,隔开
                planData: '',                // 报价详情
                computeLoading: true,        // 计算loading
            }
        },
        props: {
            quotationData: {
                type: Object,
                required: true,
            },
            shopingList: {
                type: Array,
                required: true,
            },
            copydata:{
                type: Array,
                default: []
            },
            isorder:{
                type: Boolean,
                default: false
            }
        },
        watch: {
            quotationData: function(newVal, oldVal){
                this.quotation = JSON.parse(JSON.stringify(newVal.quotation))
                this.isDetail = newVal.isDetail
                this.getADPriceByUID()
            },
            copydata(){
                if(this.quotationData.isDetail){
                    if(this.ADPriceList.length){
                        this.setQuotateData()
                    }
                }
            },
            infoDetail(){
                this.$emit('detailInfo', this.infoDetail);
            },
        },
        mounted(){
            console.log('数据',this.quotationData)
            if(this.quotationData.quotation !== undefined){
                this.quotation = JSON.parse(JSON.stringify(this.quotationData.quotation))
                console.log('mounted',this.quotation)
                this.isDetail = this.quotationData.isDetail
                this.judgeIsDetail()
            }
        },
        methods:{
            // 判断来源
            judgeIsDetail(){
                this.ridString = ''
                if(this.isDetail){  // 详情 asrID
                    this.getPriceData()
                }else{  // 创建或编辑
                    for (let key of this.quotation) {
                        this.ridString = this.ridString + key.asrID + ','
                    }
                    this.getADPriceByUID()
                }
            },
            getADPriceByUID(){
                this.ridString = this.ridString.substring(0, this.ridString.length - 1)
                let params = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service": "GetAdPriceByAsrIDs",
                    "data": {
                        "asrIDs": this.ridString
                    }
                }
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('刊例价信息', res)
                    let ADPriceList = res.data
                    if (ADPriceList.SysCode === 100302 || ADPriceList.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if (res.data.SysCode === 200200 || res.data.MSG === "成功") {
                        this.ADPriceList = ADPriceList.data
                        if (!this.isDetail) {
                            console.log('来源于创建或编辑')
                            this.getComSchedulNum()
                        } else {
                            this.computeLoading = false
                            this.setQuotateData()
                        }
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            },
            getPriceData(){
                let apid = sessionStorage.getItem("plan_apid");
                if(this.isorder){
                    apid = sessionStorage.getItem("order_apid");
                }
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apid: apid
                };
                api.getApi(this.apiVar.Advertisement+"/GetAPD", info)
                    .then(res =>{
                        if (!res.data.SysCode) {
                            let plandata = res.data;
                            this.planData = res.data
                            sessionStorage.setItem('priceData',JSON.stringify(res.data))
                            for (let data of plandata) {
                                if(!this.ridString.includes(data.asrID)){
                                    this.ridString += data.asrID + ','
                                }
                            }
                            this.getADPriceByUID()
                        } else if (res.data.SysCode == 100302) {
                            this.loginTimeout();
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
            },
            // 详情报价单(订单/方案) this.planData this.ADPriceList
            setQuotateData() {
                let plandata = this.planData
                let adPrice = this.ADPriceList;
                let detailInfo = [];
                for (let data of plandata) {
                    // 按媒体类型分组
                    let obj = {
                        apID: data.apID,
                        pdID: data.pdID,
                        mediaTypeId: data.mediaTypeId,
                        city: data.city,
                        rID: data.rID,
                        asrID: data.asrID,
                        asName: data.asName
                    };
                    detailInfo.push(obj);
                }
                this.infoDetail = detailInfo;
                let tempMap = {};
                for (let planItem of plandata) {
                    // 以rid 和 asrID 为主键分组
                    let tempKey = planItem.rID + ';' + planItem.asrID;
                    if(tempMap.tempKey) {
                        tempMap.tempKey.priceMsg[planItem.mediaTypeId] = this.formatData(planItem);
                    } else {
                        tempMap.tempKey = {
                            city: planItem.city,
                            rid: planItem.rID,
                            rID: planItem.rID,
                            asrID: planItem.asrID,
                            asName: planItem.asName || '',
                            priceMsg: {
                                [planItem.mediaTypeId]: this.formatData(planItem)
                            }
                        };
                    }
                }
                // 城市公司为一条数据
                let arr = Object.entries(tempMap).map(([key, value]) => value);
                console.log('报价单arr-----', arr)
                // 为每一条添加刊例价,广告费折扣百分比，制作费折扣百分比
                // console.log('城市刊例价adPrice',adPrice)
                for (let ta of arr) {
                    // let rid = ta.rid.toString().substring(0, 4) + '00';
                    for (let adKey of adPrice){
                        if (adKey.city == ta.city && adKey.asrID == ta.asrID){
                            // 是否执行媒体分层 classified：1执行 2不执行
                            ta.classified = adKey.classified
                            // 是否执行溢价计算 premium：0不执行 1执行
                            ta.premium = adKey.mediaClassifiedCondition ? adKey.mediaClassifiedCondition.premium : 0
                            ta.mediaClassifiedPremium = adKey.mediaClassifiedCondition ? adKey.mediaClassifiedCondition.mediaClassifiedPremium : ''
                            ta.levelPrice = {A: adKey.gradeA / 100, B: adKey.gradeB / 100, C: adKey.gradeC / 100}
                            // 获取指定城市下所有点位的广告费
                            let adsPriceData =  this.getAllADSPrice(ta.city,ta.asrID)
                            if (adsPriceData) {
                                for (let key in ta.priceMsg) {
                                    ta.priceMsg[key] = this.discountData(ta.priceMsg[key], adKey, adsPriceData);
                                }
                            } else {
                                console.log('点位暂无数据')
                            }
                        }
                    }
                }
                console.log('报价单', arr);
                if (this.copydata.length) {
                    let asidRes = this.getSchedules(this.copydata);
                    // 整合排期信息并且渲染页面
                    this.setSchedules(arr, asidRes);
                }
                this.quotation = arr;
            },
            discountData(data, cityPriceInfo, adsPrice){
                data.adPrice = cityPriceInfo.adPrice / 100 // 刊例价(面/周)
                let realPrice = Math.floor(adsPrice.adDoor * 100) / 100                  // 无折扣原价
                let discount = 100
                if(cityPriceInfo.classified == 1 && cityPriceInfo.mediaClassifiedCondition &&cityPriceInfo.mediaClassifiedCondition.premium == 1 && adsPrice.isAllA){
                    // 溢价计算反推
                    let noPremiumPrice =  data.pdAdFee / 100 / (1 + cityPriceInfo.mediaClassifiedCondition.mediaClassifiedPremium.onlyAPremium / 100)
                    discount = Math.floor((noPremiumPrice / realPrice ) * 10000 ) / 100
                }else{
                    discount = Math.floor((data.pdAdFee / 100 / realPrice ) * 10000 ) / 100
                }
                let ADMakeDiscount = data.pdNum ? Math.floor(data.pdAdMake/100 /(100 * data.pdNum) * 10000) / 100 : 100;
                data.discount = isNaN(discount)? 0: (discount).toFixed(2); // 广告费折扣百分比
                data.makeDiscount = isNaN(ADMakeDiscount)? 0: (ADMakeDiscount).toFixed(2); // 制作费折扣百分比
                data.ADPrice = data.adPrice ? this.priceFormat(data.adPrice) : 0
                return data;
            },
            // 获取指定城市下所有点位的广告费
            getAllADSPrice(cityName,asrID){
                if(this.copydata.length){
                    let priceData = {city: cityName,adDoor: 0, isAllA: true}
                    for(let key of this.copydata){
                        if(key.city == cityName && key.asrID == asrID){
                            let dayNum = 0
                            if(key.pbEnd){
                                dayNum = this.DateDiff(key.pbEnd, key.pbStar,'-') + 1
                            }else{
                                dayNum = this.DateDiff(key.lEnd, key.lStar,'-') + 1
                            }
                            if(key.asLab !== 'A'){
                                priceData.isAllA = false
                            }
                            priceData.adDoor += (key.asPrice / 700) * dayNum
                        }
                    }
                    return priceData
                } else {
                    return false
                }

            },
            dayToweeks(days){
                return dayToWeek.toWeeks(days)
            },
            dateToDays(start, end){
                return dayToWeek.toDays(start, end);
            },
            // 获取过滤选点排期以便在报价单一栏显示排期信息
            getSchedules(asidArr) {
                // 组装数据
                let result = [];
                if (!result.length) {
                    let obj = {};
                    obj.asrID = asidArr[0].asrID;
                    obj.city = asidArr[0].city;
                    obj.rID = asidArr[0].rID;
                    obj.mediaTypeName = asidArr[0].mediaTypeName;
                    obj.asidlist = "";
                    obj.mNum = "";
                    obj.ds = dateFormat.toDate(asidArr[0].lStar);
                    obj.de = dateFormat.toDate(asidArr[0].lEnd);
                    if (asidArr[0].pbStar) {
                        obj.ds = dateFormat.toDate(asidArr[0].pbStar);
                        obj.de = dateFormat.toDate(asidArr[0].pbEnd);
                    }
                    result.push(obj);
                }
                // 组合asid
                for (let res of result) {
                    let asIDs = "";
                    let mNum = 0;
                    for (let init of asidArr) {
                        let start = dateFormat.toDate(init.lStar);
                        let end = dateFormat.toDate(init.lEnd);
                        if (init.pbStar) {
                            start = dateFormat.toDate(init.pbStar);
                            end = dateFormat.toDate(init.pbEnd);
                        }
                        // let resRID = res.rID.toString().substring(0, 4);
                        // let dataRID = init.rID.toString().substring(0, 4);
                        let resObj = {
                            asrID: init.asrID,
                            city: init.city,
                            rID: init.rID,
                            mediaTypeName: init.mediaTypeName,
                            ds: start,
                            de: end,
                            asidlist: "",
                            mNum: ""
                        };
                        // if (resRID == dataRID && res.ds == start && res.de == end
                        //     && res.mediaTypeName == init.mediaTypeName && res.asrID == init.asrID) {
                        if (res.city == init.city && res.ds == start && res.de == end
                            && res.mediaTypeName == init.mediaTypeName && res.asrID == init.asrID) {
                            if (asIDs === "") {
                                asIDs = init.asID.toString();
                                mNum = 1;
                            } else {
                                asIDs = asIDs + "," + init.asID;
                                mNum++;
                            }
                        } else {
                            let door = 1;
                            for (let data of result) {
                                // let dataR = data.rID.toString().substring(0, 4);
                                // let initR = init.rID.toString().substring(0, 4);
                                if (
                                    data.city == init.city &&
                                    data.ds == start &&
                                    data.de == end &&
                                    data.mediaTypeName == init.mediaTypeName
                                    && data.asrID == init.asrID
                                ) {
                                    door = 0;
                                }
                            }
                            if (door) {
                                result.push(resObj);
                            }
                        }
                    }
                    res.asidlist = asIDs;
                    res.mNum = mNum;
                }
                console.log('result',result)
                return result;
            },
            // 整合排期信息
            setSchedules(arr, asidRes) {
                console.log('setSchedules--', arr, asidRes)
                for (let arrData of arr) {
                    let obj = {
                        mediaTypeName: '',
                        schedules: [],
                        SM: [],
                        schedul:[],
                    };
                    for (let asid of asidRes) {
                        let ds = dateFormat.toDate(asid.ds, "/");
                        let de = dateFormat.toDate(asid.de, "/");
                        let days = this.dateToDays(ds, de);
                        let weekDay = this.dayToweeks(days);
                        let weekDays = '';
                        if(days < 7){
                            weekDays = weekDay.day+'天';
                        }else if((weekDay.day ==0) && (weekDay.week != 0)){
                            weekDays = weekDay.week+'周';
                        }else{
                            weekDays = weekDay.week +'周'+weekDay.day+'天';
                        }
                        if (arrData.city == asid.city && arrData.asrID == asid.asrID) {
                            obj.SM.push(ds + "-" + de +"("+ weekDays+',共'+ asid.mNum + "面)");
                            obj.schedules.push(ds+'-'+de);
                            let schedul = this.DateDiff(ds, de,'/') + 1
                            let mNum = asid.mNum;
                            obj.schedul.push({
                                schedul: schedul,
                                mNum: mNum
                            });
                        }
                    }
                    for (const [mediaTypeKey, value] of Object.entries(arrData.priceMsg)) {
                        arrData.priceMsg[mediaTypeKey].SM = obj.SM;
                        arrData.priceMsg[mediaTypeKey].schedules = obj.schedules;
                        arrData.priceMsg[mediaTypeKey].schedul = obj.schedul;
                    }
                }

                return arr;
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
            formatData(data){
                let obj = {
                    rID: data.rID,
                    // 组合好的排期信息
                    SM: [],
                    // 排期
                    schedules: [],
                    // 赠送面.天
                    GMDate: data.pdFreeNum,
                    // 广告费折扣
                    discount: '',
                    // 广告费
                    advertyPrice: this.priceFormat(data.pdAdFee / 100),
                    pdAdFee: data.pdAdFee,
                    // 广告画数量
                    ADNumber: data.pdNum,
                    pdNum: data.pdNum,
                    // 制作费折扣
                    makeDiscount: 100,
                    // 制作费单价
                    MPrice: 100.00,
                    // 广告费每次修改前的价格
                    reaPrice: 0,
                    //  广告费初始价格
                    oldPrice: 0,
                    // 制作费原价
                    MReaPrice: this.priceFormat(data.pdAdMake / 100),
                    // 制作费
                    makePrice: this.priceFormat(data.pdAdMake / 100),
                    pdAdMake: data.pdAdMake,
                    // 刊例价(面/周)
                    ADPrice: 0,
                    adPrice: 0,
                    //投放量
                    tfl: data.pdDays,
                    pdDays: data.pdDays,
                    // 现金结算
                    cash: this.priceFormat(data.pdTotal / 100),
                    // 资源置换
                    zyzh: this.priceFormat(data.pdSendFee / 100),
                    // 其他费用
                    other: this.priceFormat(data.pdOtherFee / 100),
                    total: 0,
                    // 备注
                    remark: data.pdRemark,
                };
                obj.total = this.priceFormat((data.pdTotal + data.pdSendFee + data.pdOtherFee) / 100);
                return obj;
            },
            // 判断是否有刊例价
            judgeCityHavePrice(){
                let arr = []
                console.log('报价单',this.quotation)
                for (let qkey of this.quotation) {
                    for (let QPKey in qkey.priceMsg) {
                        let obj = {
                            city:qkey.city,
                            rid: qkey.rid,
                            mKind: QPKey,
                            price: '',
                            ADNumber: qkey.priceMsg[QPKey].ADNumber,
                            classified:'',      // 是否执行媒体分层 1执行 2,不执行
                        }
                        for(let ADPkey of this.ADPriceList){
                            if(ADPkey.rid == qkey.rid){
                                qkey.classified = ADPkey.classified
                                obj.price = ADPkey.adPrice
                                qkey.priceMsg[QPKey].levelPrice = {
                                    A: ADPkey.gradeA,
                                    B: ADPkey.gradeB,
                                    C: ADPkey.gradec
                                }
                            }
                        }
                        arr.push(obj)
                    }
                }
                console.log('判断是否有刊例价',arr)
                let cityNames = ''
                for(let key of arr){
                    if(key.ADNumber > 0 && key.price === ''){
                        cityNames += key.city + ','
                    }
                }
                if(cityNames !== ''){
                    this.$message({
                        type: 'warning',
                        message: cityNames + '暂无刊例价，请使用管理员账号设置该城市的刊例价' ,
                        duration: 4000
                    })
                }
            },
            // 从购物车列表获取排期
            getComSchedulNum(){
                console.log('购物车点位', this.shopingList, this.quotation)
                for (let qKey of this.quotation) {
                    for (let sKey of this.shopingList) {
                        if (sKey.city === qKey.city && sKey.asrID == qKey.asrID) {
                            for (const mediaTypeKey in qKey.priceMsg) {
                                if (Object.hasOwnProperty.call(qKey.priceMsg, mediaTypeKey)) {
                                    let item = qKey.priceMsg[mediaTypeKey];
                                    if (item.schedules.length <= 0) {
                                        item.schedules.push(sKey.schedules)
                                    } else {
                                        if (!item.schedules.includes(sKey.schedules)) {
                                            item.schedules.push(sKey.schedules)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                console.log('this.quotation',this.quotation)
                this.getPM_numByCityList()      // 各城市的不同排期的所有面数
                this.computeCityDiffAsIdNum()   // 获取不同城市里相同点位的个数
                this.computCityPrice()
            },
            // 根据购物车列表城市获取不同排期的所有面数及不同等级点位的面天数
            getPM_numByCityList() {
                this.CSMList = []
                let arr = []
                for (let key of this.quotation) {
                    let q_schedulesArr = key.priceMsg
                    for (let qsKey in q_schedulesArr){
                        let mkind = qsKey || '--'
                        for(let qsmkey of q_schedulesArr[qsKey].schedules){
                            let schedulesList = qsmkey.split('-')
                            let dayNum = this.DateDiff(schedulesList[0], schedulesList[1],'/') + 1
                            console.log(qsmkey, '排期天数', dayNum)
                            let weekAndDay = ''
                            if (dayNum < 7) {
                                weekAndDay = dayNum + '天'
                            } else if (dayNum % 7 === 0 && dayNum >= 7) {
                                weekAndDay = (dayNum / 7) + '周'
                            } else {
                                weekAndDay = parseInt(dayNum / 7) + '周' + (dayNum % 7) + '天'
                            }
                            arr.push({
                                city: key.city,
                                asrID: key.asrID,
                                schedules: qsmkey,
                                SM: qsmkey  + '(' + weekAndDay,
                                mKind: mkind,
                                mNum: 0,
                                diffmNum:0,
                                adLevelNum: {ALevel: 0,BLevel: 0,Clevel:0},
                                isAllA: true,       // 点位是否全为A面
                            })
                        }
                    }
                }
                console.log('arr', arr)
                // 统计购物车中不同等级点位的面天数
                let cityADDoorLevelNum = []
                for(let skey of this.shopingList){
                    for(let akey of arr){
                        if (skey.city === akey.city && skey.schedules == akey.schedules
                            && skey.mediaTypeId === akey.mKind && skey.asrID == akey.asrID) {
                            akey.mNum++
                        }
                        // 判断是否全为A面
                        if(skey.city === akey.city && skey.A_B !== 'A'){
                            akey.isAllA = false
                        }
                        // 计算广告门各等级的数量
                        if(skey.mediaTypeId === akey.mKind
                            && skey.city === akey.city && skey.asrID == akey.asrID){
                            if (skey.mediaLevel === 'A') {
                                akey.adLevelNum.ALevel++
                            } else if (skey.mediaLevel === 'B') {
                                akey.adLevelNum.BLevel++
                            } else if (skey.mediaLevel === 'C') {
                                akey.adLevelNum.Clevel++
                            }
                        }
                    }
                    // 获取广告门点位等级的面天数
                    let ishadCity = false
                    let schedulesList = skey.schedules.split('-')
                    let dayNum = this.DateDiff(schedulesList[0], schedulesList[1],'/') + 1
                    for(let key of cityADDoorLevelNum){
                        if(key.city === skey.city && key.asrID == skey.asrID){
                            if(skey.mediaLevel === 'A'){
                                key.A += dayNum
                            }else if(skey.mediaLevel === 'B'){
                                key.B += dayNum
                            }else if(skey.mediaLevel === 'C'){
                                key.C += dayNum
                            }
                            ishadCity = true
                            break
                        }
                    }
                    if(!ishadCity){
                        let ADLevelObj = {city: skey.city, asrID: skey.asrID,A: 0, B: 0, C: 0,percent:0}
                        if (skey.mediaLevel === 'A') {
                            ADLevelObj.A = dayNum
                        } else if (skey.mediaLevel === 'B') {
                            ADLevelObj.B = dayNum
                        } else if (skey.mediaLevel === 'C') {
                            ADLevelObj.C = dayNum
                        }
                        cityADDoorLevelNum.push(ADLevelObj)
                    }
                }
                console.log('统计购物车中不同等级点位的面天数',cityADDoorLevelNum)
                this.cityADLevelNum = cityADDoorLevelNum
                for (let akey of arr) {
                    let IsHad = false
                    for (let ckey of this.CSMList) {
                        if (ckey.city === akey.city && ckey.asrID == akey.asrID) {
                            if (ckey.mKind == akey.mKind) {
                                IsHad = true
                                ckey.SM.push(akey.SM + ',' + akey.mNum + '面)')
                                ckey.mNum += akey.mNum
                                break
                            }
                        }
                    }
                    if (!IsHad) {
                        this.CSMList.push({
                            city: akey.city,
                            asrID: akey.asrID,
                            mKind: akey.mKind,
                            mNum: akey.mNum,
                            SM: [akey.SM + ',' + akey.mNum + '面) '],
                            adLevelNum: akey.adLevelNum,                 // 媒体各等级数
                            isAllA: akey.isAllA
                        })
                    }
                }
                console.log('城市不同排期的所有面数', JSON.stringify(this.CSMList))
                for (let qkey of this.quotation){
                    for(let ckey of this.CSMList){
                        // debugger
                        if(qkey.city === ckey.city && qkey.asrID == ckey.asrID){
                            for (const mediaTypeKey in qkey.priceMsg) {
                                if (Object.hasOwnProperty.call(qkey.priceMsg, mediaTypeKey)) {
                                    let item = qkey.priceMsg[mediaTypeKey];
                                    item.SM = ckey.SM
                                    item.ADNumber += ckey.mNum
                                    item.adLevelNum = ckey.adLevelNum        // 记录广告门各等级数量，方便计算A级占比并计算溢价
                                    item.isAllA = ckey.isAllA
                                }
                            }
                        }
                    }
                }

                console.log('报价单统计排期段内的面数',this.quotation)
            },
            // 统计购物车中相同城市不同排期的同一asids个数
            computeCityDiffAsIdNum() {
                console.log('统计购物车中相同城市不同排期的同一asids个数', this.quotation, this.shopingList)
                let mediaAD = []
                for(let qkey of this.quotation){
                    let mediaTypeDoorNumObj = {}
                    for (let i in qkey.priceMsg) {
                        for(let skey of this.shopingList){
                            if(qkey.asrID == skey.asrID && qkey.city === skey.city){
                                if(mediaTypeDoorNumObj[i]) {
                                    if(mediaTypeDoorNumObj[i].diffAD_door.includes(skey.asID)) {
                                        mediaTypeDoorNumObj[i].doorNum += 1
                                    } else {
                                        mediaTypeDoorNumObj[i].diffAD_door.push(skey.asID)
                                    }
                                } else {
                                    mediaTypeDoorNumObj[i] = {
                                        doorNum: 0,
                                        diffAD_door: [skey.asID]
                                    }
                                }
                            }
                        }
                    }
                    let obj = {rid: qkey.rid, asrID: qkey.asrID, mediaTypeDoorNumObj}
                    mediaAD.push(obj)
                }
                this.commentMediaADNum = mediaAD
                console.log('this.commentMediaADNum', this.commentMediaADNum)
            },
            // step3 报价单 - 媒体分层 adPrice
            computCityPrice() {
                let cityName = ''   // 无刊例价的城市
                let cityPrice = []
                for (let key of this.shopingList) {
                    let schedulesList = key.schedules.split('-')
                    let dayNum = this.DateDiff(schedulesList[0], schedulesList[1], '/') + 1
                    // console.log(schedulesList, '媒体分层-排期天数', dayNum)
                    let adsPrice = ''
                    adsPrice = key.adPrice * dayNum
                    if(!adsPrice){
                        console.log(key.adPrice, dayNum, 'adsPrice', adsPrice)
                    }
                    let isHadCity = false
                    for (let CPKey of cityPrice) {
                        if (CPKey.cityName === key.city && CPKey.asrID == key.asrID && CPKey.mediaTypeId == key.mediaTypeId) {
                            isHadCity = true
                            CPKey.adDoorDateNum += dayNum
                            CPKey.adDoorTotolPrice += adsPrice
                            CPKey.adDoorNum++
                            break
                        }
                    }
                    if (!isHadCity) {
                        let priceObj = this.returnCityADPriceDataByRID(key.city,key.asrID)
                        console.log('priceObj',priceObj)
                        if(!priceObj.isBool){
                            cityName += key.city + '、'
                        }
                        let priceData = {
                            cityName: key.city,
                            asrID: key.asrID,
                            asName: key.asName,
                            mediaTypeId: key.mediaTypeId,
                            classified: priceObj.classified,     // 是否媒体分层
                            premium: priceObj.premium,           // 是否溢价
                            mediaClassifiedPremium: priceObj.mediaClassifiedPremium,    // 溢价信息
                            adDoorPrice: priceObj.adDoor,
                            levelPrice: priceObj.levelPrice,
                            // roadGatePrice: priceObj.roadGate,
                            adDoorDateNum: 0,
                            // roadGateDateNum:0,
                            adDoorTotolPrice: 0,
                            // roadGateTotalPrice: 0,
                            adDoorNum: 0,
                            // roadGateNum: 0,
                        }
                        priceData.adDoorNum = 1
                        priceData.adDoorDateNum = dayNum
                        priceData.adDoorTotolPrice = adsPrice
                        cityPrice.push(priceData)
                    }
                }
                if(cityName !== ''){
                    cityName = cityName.substring(0, cityName.length - 1)
                    this.$message({
                        type: 'warning',
                        message: cityName + '暂无刊例价，请使用管理员账号设置该城市的刊例价',
                        duration: 4000
                    })
                }
                console.log('媒体分层-报价计算', cityPrice)
                this.isBoolPremium(cityPrice)
            },
            // 根据城市rid返回城市刊例价
            returnCityADPriceDataByRID(cName,asrID){
                console.log('根据城市rid返回城市刊例价',cName,asrID)
                for(let key of this.ADPriceList){
                    if(key.city === cName && key.asrID == asrID){
                        return {
                            adDoor: key.adPrice / 100,
                            // roadGate: key.barrierPrice / 100,
                            classified: key.classified,         // 是否媒体分层
                            levelPrice: {A: key.gradeA / 100,B: key.gradeB / 100,C: key.gradeC / 100},
                            premium: key.mediaClassifiedCondition ? key.mediaClassifiedCondition.premium : 0,                                  // 是否执行溢价
                            mediaClassifiedPremium: key.mediaClassifiedCondition ? key.mediaClassifiedCondition.mediaClassifiedPremium : '',    // 溢价信息
                            isBool:true,     // 是否找到该城市价格信息
                        }
                    }
                }
                return {
                    adDoor: 0,
                    // roadGate: 0,
                    classified: 2,
                    levelPrice: {A: 0,B: 0,C: 0},
                    premium: 0,
                    mediaClassifiedPremium: '',
                    isBool: false
                }
            },
            //  判断是否执行溢价并且该城市下只选择了A面（广告门）
            isBoolPremium(cityPrice){
                let isBool = true
                let cityName = ''
                let Premium = 0
                let i = 0
                for (let CKey of cityPrice) {
                    i = 0
                    for (let QKey of this.quotation) {
                        if (CKey.cityName === QKey.city){
                            for (let QPKey in QKey.priceMsg){
                                if(CKey.classified == 1 && CKey.premium === 1){   // 执行媒体分层
                                    if(QKey.priceMsg[QPKey].isAllA){   // 全是A面点位时执行溢价计算
                                        isBool = false
                                        cityName += QKey.city + '、'
                                        Premium = CKey.mediaClassifiedPremium.onlyAPremium
                                        break
                                    }
                                }
                            }
                        }
                        i++
                    }
                }
                cityName = cityName.substring(0, cityName.length - 1)
                if(!isBool){
                    this.$confirm(cityName + '选中点位全为A面，广告费将自动溢价'+ Premium + '%，是否继续？', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '返回',
                        type: 'warning'
                    }).then(() => {
                        this.quotation[i-1].noBoolClassified = false
                        this.computeQuotation(cityPrice)
                    }).catch(() => {
                        this.quotation[i-1].noBoolClassified = true
                        this.$emit('APQuotationArr', this.quotation)
                    });
                }else{
                    this.computeQuotation(cityPrice)
                }

            },
            computeQuotation(cityPrice){
                console.log('this.quotation',this.quotation, cityPrice)
                for (let CKey of cityPrice) {
                    for (let QKey of this.quotation) {
                        if (CKey.cityName === QKey.city && CKey.asrID == QKey.asrID) {
                            QKey.classified = CKey.classified   // 是否分层
                            QKey.levelPrice = CKey.levelPrice
                            QKey.premium = CKey.premium         // 是否溢价
                            QKey.mediaClassifiedPremium = CKey.mediaClassifiedPremium     // 溢价信息
                            for (let QPKey in QKey.priceMsg) {
                                let commentNum = 0
                                commentNum = this.returnCommentADNum(QKey.rid, QKey.asrID, QPKey)
                                // 广告费计算
                                QKey.priceMsg[QPKey].ADPrice = CKey.adDoorPrice
                                QKey.priceMsg[QPKey].tfl = CKey.adDoorDateNum                // 投放量(面·天)
                                // 广告费总价
                                QKey.priceMsg[QPKey].reaPrice = CKey.adDoorTotolPrice.toFixed(2)
                                let premiumPrice = 0
                                if(CKey.classified == 1 && CKey.premium === 1){             // 执行媒体分层且执行溢价
                                    if(QKey.priceMsg[QPKey].isAllA){                        // 全是A面媒体时执行溢价计算
                                        premiumPrice = QKey.priceMsg[QPKey].reaPrice * (CKey.mediaClassifiedPremium.onlyAPremium / 100)
                                    }
                                }
                                // 显示的广告费
                                QKey.priceMsg[QPKey].advertyPrice = Number(QKey.priceMsg[QPKey].reaPrice ? (Number(QKey.priceMsg[QPKey].reaPrice) + premiumPrice).toFixed(2) : premiumPrice.toFixed(2))
                                QKey.priceMsg[QPKey].discount = 100                             // 广告费折扣百分比
                                // 制作费计算
                                QKey.priceMsg[QPKey].ADNumber = CKey.adDoorNum - commentNum 
                                console.log('制作费计算--', CKey.adDoorNum, commentNum, QKey.priceMsg[QPKey].ADNumber)

                                QKey.priceMsg[QPKey].oldPrice = QKey.priceMsg[QPKey].reaPrice                       // 保存最初计算的价格
                                // 制作费 = 广告画数量 * 制作费单价 MPrice
                                QKey.priceMsg[QPKey].MReaPrice = QKey.priceMsg[QPKey].ADNumber * QKey.priceMsg[QPKey].MPrice
                                QKey.priceMsg[QPKey].makePrice = QKey.priceMsg[QPKey].MReaPrice
                                QKey.priceMsg[QPKey].makeDiscount = 100                     // 广告费折扣百分比
                                // 现金总额
                                QKey.priceMsg[QPKey].total = Number(commaFormat.noComma(QKey.priceMsg[QPKey].advertyPrice)) + Number(commaFormat.noComma(QKey.priceMsg[QPKey].makePrice))
                                QKey.priceMsg[QPKey].cash = QKey.priceMsg[QPKey].total
                            }
                            break
                        }
                    }
                }
                console.log('媒体分层 - quotation', this.quotation)
                this.computeLoading = false
                this.$emit('APQuotationArr', this.quotation)

            },
            // 根据对应的城市及媒体类型返回重复的点位数
            returnCommentADNum(rid, asrID, mediaTypeId){
                let adNum = 0
                for (let CMADNKey of this.commentMediaADNum) {
                    if (rid === CMADNKey.rid && asrID == CMADNKey.asrID) {
                        adNum = CMADNKey.mediaTypeDoorNumObj[mediaTypeId].doorNum
                    }
                }
                return adNum
            },
            // 判断当前天数是否小于等于31、15
            /* judgeDayNum(schedul,mNum,adPrice){
                adPrice = adPrice || 0
                if (schedul <= 15) {
                    return mNum * (adPrice / 2)
                }else if (schedul > 15 && schedul <= 31) {
                    return mNum * adPrice
                }
            }, */
            //修改赠送面天时
            GMDateChange(letter){
                console.log('等级',letter,'赠送面天',this.ADchanger,this.cityPriceData)
                if(this.cityPriceData.classified == 1){
                    let levelPrice = this.cityPriceData.levelPrice
                    console.log('levelPrice',levelPrice)
                    let GMDatePrice = this.ADchanger.AGMDate * levelPrice.A / 7
                        + this.ADchanger.BGMDate * levelPrice.B / 7
                        + this.ADchanger.CGMDate * levelPrice.C / 7
                    this.ADchanger.reaPrice = (this.priceInfo.reaPrice - GMDatePrice).toFixed(2)
                    this.ADchanger.advertyPrice = this.returnPremiumPrice(
                        this.ADchanger.isAllA,
                        this.ADchanger.reaPrice,
                        this.cityPriceData.mediaClassifiedPremium.onlyAPremium)
                    this.ADchanger.totalGMDate = this.ADchanger.AGMDate + this.ADchanger.BGMDate + this.ADchanger.CGMDate
                }else{
                    let APrice = this.priceInfo.ADPrice / 7
                    let GMDatePrice = this.ADchanger.totalGMDate * APrice
                    this.ADchanger.reaPrice = (this.priceInfo.reaPrice - GMDatePrice).toFixed(2)
                    this.ADchanger.advertyPrice = this.ADchanger.reaPrice
                }
            },
            //修改折扣率
            discoundChange(val){
                console.log('val',val)
            },
            // 点击修改-填充相应的价格 mediaTypeKey, item, mediaTypeItem
            changePrice(letter,kind,cityData,info){
                this.priceInfo = JSON.parse(JSON.stringify(info))
                this.cityPriceData = cityData
                console.log('info',this.priceInfo,'cityData',cityData)
                if (letter === 'AD') {             // 广告费
                    if(cityData.classified === 1){
                        for (let key of this.cityADLevelNum) {
                            if (key.city === cityData.city) {
                                this.activeLevelNum = {
                                    city: cityData.city,
                                    AMax: key.A,
                                    BMax: key.B,
                                    CMax: key.C
                                }
                                break
                            }
                        }
                        this.ADchanger.levelNum = info.adLevelNum
                        // A、B、C媒体等级赠送的面天数
                        this.ADchanger.AGMDate = info.LevelGMDate.A
                        this.ADchanger.BGMDate = info.LevelGMDate.B
                        this.ADchanger.CGMDate = info.LevelGMDate.C
                        if(cityData.premium === 1){
                            this.ADchanger.isAllA = info.isAllA                                         // 判断是否执行溢价
                        }
                    }
                    this.ADchanger.totalGMDate = info.GMDate
                    this.ADchanger.kind = kind              // 记录媒体类型
                    this.ADchanger.rid = cityData.rid       // 记录城市
                    this.ADchanger.reaPrice = Math.floor(info.reaPrice * 100) / 100             // 溢价前的价格
                    this.ADchanger.advertyPrice = Math.floor(info.advertyPrice * 100) / 100     // 溢价后显示的广告费
                    this.ADchanger.discount = info.discount * 1
                    this.MaxGMDate = info.tfl                                                   //　最大赠送面天
                    this.changeAD = true
                } else if (letter === 'M') {        // 制作费
                    this.changeMake = true
                    this.makeChange.kind = kind
                    this.makeChange.rid = cityData.rid
                    this.makeChange.MReaPrice = info.makePrice
                } else if (letter === 'TP') {
                    this.changeBill = true
                    this.totalChange.rid = cityData.rid
                    this.totalChange.kind = kind
                    this.totalChange.cash = commaFormat.noComma(info.cash)
                    this.totalChange.zyzh = commaFormat.noComma(info.zyzh)
                    this.totalChange.other = commaFormat.noComma(info.other)
                    this.totalChange.total = commaFormat.noComma(info.total)
                    this.totalChange.remark = info.remark
                }
            },
            // 判断是否溢价，并返回价格
            returnPremiumPrice(isBool,reaPrice,onlyAPremium){
                if (isBool) {
                    let premiumPrice = reaPrice * onlyAPremium / 100
                    return Number(reaPrice) + premiumPrice
                } else {
                    return reaPrice
                }
            },
            //确认修改
            handleClose(letter) {
                // 'AD'为广告费修改，'M'为制作费修改, 'SM'为修改结算方式
                let QArr = this.quotation
                console.log('确认修改',QArr,'this.ADchanger',this.ADchanger,this.priceInfo)
                if (letter === 'AD') {              // 广告费修改
                    if(!this.ADchanger.totalGMDate && this.ADchanger.totalGMDate !== 0) {
                        this.$message({
                            message: '赠送天数不能为空',
                            type: 'warning'
                        });
                        return
                    }
                    let IsChange = false
                    if (Number(this.ADchanger.reaPrice) > Number(this.priceInfo.oldPrice)) {
                        this.ADchanger.reaPrice = this.priceInfo.oldPrice
                        this.$message({
                            message: '大于原价格',
                            type: 'warning'
                        });
                    } else {
                        this.priceInfo.GMDate = this.ADchanger.totalGMDate
                        this.priceInfo.LevelGMDate = {
                            A: this.ADchanger.AGMDate,
                            B: this.ADchanger.BGMDate,
                            C: this.ADchanger.CGMDate
                        }
                        this.priceInfo.reaPrice = this.ADchanger.reaPrice
                        this.priceInfo.advertyPrice = this.returnPremiumPrice(
                            this.ADchanger.isAllA,
                            this.ADchanger.reaPrice,
                            this.cityPriceData.mediaClassifiedPremium.onlyAPremium)
                        // 折扣百分比
                        this.priceInfo.discount = this.priceInfo.oldPrice ? ((this.priceInfo.reaPrice / this.priceInfo.oldPrice) * 100).toFixed(4) : 100
                        console.log('折扣百分比',this.priceInfo.discount)
                        // 费用总额
                        this.priceInfo.total = Number(commaFormat.noComma(this.priceInfo.advertyPrice)) + Number(commaFormat.noComma(this.priceInfo.makePrice))
                        this.priceInfo.cash = this.priceInfo.total
                        IsChange = true
                    }
                    if(IsChange){
                        // 判断是否执行溢价，限定溢价 cityPriceData mediaClassifiedPremium
                        console.log('this.cityPriceData',this.cityPriceData,this.priceInfo)
                        let isMinDiscount = {A:false,B:false}
                        let classifiedPremium = this.cityPriceData.mediaClassifiedPremium
                        if (this.cityPriceData.classified == 1 && this.cityPriceData.premium === 1) {
                            let scaleA = (this.priceInfo.adLevelNum.ALevel / this.priceInfo.ADNumber) * 100         // A等级占比
                            let scaleB = (this.priceInfo.adLevelNum.BLevel / this.priceInfo.ADNumber) * 100         // B等级占比
                            console.log('scaleA', scaleA, ':', classifiedPremium.execAPercent, 'scaleB', scaleB, ':', classifiedPremium.execBPercent)
                            console.log('this.priceInfo.discount', this.priceInfo.discount, 'classifiedPremium.discountA', classifiedPremium.discountA)
                            if (scaleA >= classifiedPremium.execAPercent) { // execAPercent
                                if (this.priceInfo.discount < classifiedPremium.discountA) {
                                    isMinDiscount.A = true
                                }
                            } else if (scaleB >= classifiedPremium.execBPercent) {
                                if (this.priceInfo.discount < classifiedPremium.discountB) {
                                    isMinDiscount.B = true
                                }
                            }
                        }
                        console.log('isMinDiscount',isMinDiscount)
                        if(isMinDiscount.A){
                            this.$message.warning('A级面数占比大于'+ classifiedPremium.execAPercent +
                                '%，折扣不能低于'+ classifiedPremium.discountA +'%')
                            this.ADchanger.reaPrice = this.priceInfo.oldPrice
                        }else if(isMinDiscount.B){
                            this.$message.warning('B级面数占比大于'+ classifiedPremium.execBPercent + '%，折扣不能低于'+ classifiedPremium.discountB +'%')
                            this.ADchanger.reaPrice = this.priceInfo.oldPrice
                        }else{
                            for (let key of QArr) {
                                if (key.rid === this.ADchanger.rid) {
                                    for (let i in key.priceMsg) {
                                        if (this.ADchanger.kind == i) {
                                            key.priceMsg[i] = this.priceInfo
                                        }
                                    }
                                }
                            }
                            this.hideBox()
                        }
                    }
                } else if (letter === 'M') {         // 制作费修改
                    console.log('this.makeChange',this.makeChange)
                    for (let i = 0; i < QArr.length; i++) {
                        let tempObj = ''
                        console.log('this.makeChange.kind--', this.makeChange.kind)
                        tempObj = QArr[i].priceMsg[this.makeChange.kind]
                        if (QArr[i].rid === this.makeChange.rid) {
                            if (this.makeChange.MReaPrice > tempObj.MReaPrice) {
                                this.$message({
                                    message: '大于原价格',
                                    type: 'warning'
                                });
                            } else {
                                tempObj.makeDiscount = Math.round(Number(this.makeChange.MReaPrice) / tempObj.MReaPrice * 10000) / 100.00 // 制作费折扣百分比
                                tempObj.makePrice = this.makeChange.MReaPrice
                                this.hideBox()
                            }
                            tempObj.total = Number(commaFormat.noComma(tempObj.advertyPrice)) + Number(commaFormat.noComma(tempObj.makePrice))
                            tempObj.cash = tempObj.total
                        }
                    }
                } else if (letter === 'TP') {     // 修改结算方式
                    console.log('this.totalChange',this.totalChange)
                    if (this.totalChangeCash && this.totalChangeZyzh && this.totalChangeOther) {
                        let total = Number(this.totalChange.other) + Number(this.totalChange.zyzh) + Number(this.totalChange.cash)
                        console.log('total', total, this.totalChange.total)
                        if (total > this.totalChange.total) {
                            this.$message({
                                message: '大于总价格',
                                type: 'warning'
                            })
                        } else {
                            this.totalChange.other = this.totalChange.total - (Number(this.totalChange.zyzh) + Number(this.totalChange.cash))
                            this.priceInfo.cash = Number(this.totalChange.cash)
                            this.priceInfo.zyzh = Number(this.totalChange.zyzh)
                            this.priceInfo.other = Number(this.totalChange.other)
                            this.priceInfo.remark = this.totalChange.remark
                            for (let key of QArr) {
                                if (key.rid === this.totalChange.rid) {
                                    for (let i in key.priceMsg) {
                                        if (this.totalChange.kind == i) {
                                            key.priceMsg[i] = this.priceInfo
                                        }
                                    }
                                }
                            }
                            this.hideBox()
                        }
                    } else {
                        if (!this.totalChangeCash) {
                            this.checkCash(this.totalChange.cash)
                        } else if (!this.totalChangeZyzh) {
                            this.checkZyzh(this.totalChange.zyzh)
                        } else if (!this.totalChangeOther) {
                            this.checkOther(this.totalChange.other)
                        }
                    }
                }
                this.$emit('APQuotationArr', this.quotation)
            },
            // 修改广告费和制作费的验证
            checkInput(value,letter) {
                console.log('priceInfo',this.priceInfo)
                let reg = /[^\d\.]/g;
                if (value) {
                    if (new RegExp(reg).test(value)) {
                        this.$message({
                            message: '请输入正确的数字',
                            type: 'warning'
                        })
                        if(letter === 'AD'){
                            this.ADchanger.reaPrice = this.priceInfo.GMDate
                            this.ADchanger.reaPrice = Math.floor(this.priceInfo.advertyPrice * 100) / 100
                        }else if(letter === 'M'){
                            this.makeChange.MReaPrice = this.priceInfo.makePrice
                        }
                    }
                }
                console.log('checkInput', this.ADchangerReaPrice)
            },
            // 隐藏弹出框
            hideBox() {
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                this.changeBill = false;
                this.changeMake = false;
                this.changeAD = false;
            },
            // 修改结算方式的验证checkCash、checkZyzh、checkOther
            checkCash(val) {
                let reg = /[^\d\.]/g
                if (val) {
                    if (new RegExp(reg).test(val)) {
                        this.$message({
                            message: '现金金额只能为数字',
                            type: 'warning'
                        })
                        this.totalChangeCash = false
                    } else {
                        this.totalChangeCash = true
                    }
                }
            },
            checkZyzh(val) {
                let reg = /[^\d\.]/g
                if (val) {
                    if (new RegExp(reg).test(val)) {
                        this.$message({
                            message: '请输入数字.',
                            type: 'warning'
                        })
                        this.totalChangeZyzh = false
                    } else {
                        this.totalChangeZyzh = true
                    }
                }
            },
            checkOther(val) {
                let reg = /[^\d\.]/g
                if (val) {
                    if (new RegExp(reg).test(val)) {
                        this.$message({
                            message: '请输入数字..',
                            type: 'warning'
                        })
                        this.totalChangeOther = false
                    } else {
                        this.totalChangeOther = true
                    }
                }
            },
            //计算天数差的函数，通用
            DateDiff(sDate1, sDate2,subString) {    //sDate1和sDate2是2002/12/18格式 11500 9500 9000 7700 7000 5150
                let aDate, oDate1, oDate2, iDays
                aDate = sDate1.split(subString)
                oDate1 = new Date(aDate[1] + subString + aDate[2] + subString + aDate[0])    //转换为12-18-2002格式
                aDate = sDate2.split(subString)
                oDate2 = new Date(aDate[1] + subString + aDate[2] + subString + aDate[0])
                iDays = Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24
                return iDays
            },
            // 返回两位小数
            returnTwoFloat(num) {
                console.log('num',typeof(num),num)
                if (!num) {
                    return  num || 0
                } else if(!isFinite(num)){
                    return 0
                } else {
                    return Number(num).toFixed(2)
                }
            },
            // 登录超时
            loginTimeout() {
                this.$message({
                    message: '登录超时或权限异常,请重新登录',
                    type: 'warning'
                })
                this.$router.push('/login')
            },
        },
    }
</script>

<style scoped lang="scss">
    strong{
        font-weight: bold;
    }
    /*覆盖组件样式*/
    /deep/ .el-tabs--border-card > .el-tabs__content{
        padding: 24px 32px;
    }
    .el-icon-edit-outline{
        color: #1890FF;
        font-size: 16px;
    }
    /*广告门*/
    .ad_section{
        margin-bottom: 24px;
    }
    .ad_section h4{
        font-size:14px;
        color:rgba(0,0,0,0.78);
        height:54px;
        line-height: 54px;
        background: #FAFAFA;
        text-align: right;
        font-weight: bold;
        border-bottom: 1px solid #E8E8E8;
    }
    .ad_SM{
        height: 244px;
        text-align: center;
        padding: 30px 10px 0;
        border-right: 1px solid #E8E8E8;
        border-bottom: 1px solid #E8E8E8;
    }
    .ad_SM span{
        font-size:14px;
        color:rgba(153,153,153,1);
    }
    .ad_door{
        width:58px;
        height:74px;
        border-radius:3px;
    }
    .ad_SM_info{
        color:rgba(0,0,0,0.65);
        padding-top: 30px;
    }
    .ad_SM_info h5{
        font-size:14px;
        color:rgba(0,0,0,0.85);
        margin-bottom: 10px;
    }
    .ad_SM_info ul li{
        background:rgba(240,240,240,1);
        height: 20px;
        font-size:12px;
        margin-bottom: 10px;
        border-radius:4px;
    }
    .AdvertDoor_price p{
        font-size:14px;
        color:rgba(0,0,0,0.65);
        text-align: right;
        height: 54px;
        line-height: 54px;
        border-bottom: 1px solid #E8E8E8;
    }
    .AdvertDoor_price .changeICon{
        cursor: pointer;
        text-align: center;
    }
    .remark{
        font-size:14px;
        color:rgba(0,0,0,0.65);
        height: 54px;
        line-height: 54px;
        background:rgba(250,250,250,1);
        padding-left: 32px;
    }
    .change_make_price_level{
        display: inline-block;
        width: 38px;
    }
    /*道闸*/
    .ad_rodeGare{
        width: 105px;
        height: 40px;
    }
    .SM_info_ul{
        height: 102px;
        overflow-y: auto;
    }
    .SM_info_ul::-webkit-scrollbar {
        width: 6px;
        background: #FAFAFA;
    }
    .SM_info_ul::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }
</style>
