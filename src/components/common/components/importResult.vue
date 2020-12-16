<template>
    <div class="import_result">
        <div class="car-title">
            <i class="el-icon-info" style="color: #1890FF;"></i>
            <h4>已成功导入小区<span>{{successRes}}</span>个,问题小区<span>{{errorRes}}</span>个
                <span @click="downLoadExcel()">下载失败小区数据<i class="el-icon-download"></i></span>
            </h4>
        </div>

        <p>
            <el-radio-group v-model="activeType" size="small" class="marin10">
                <el-radio-button :label="1">成功小区</el-radio-button>
                <el-radio-button :label="2">失败小区</el-radio-button>
            </el-radio-group>
            <span>提示：已选择 <b>{{resNum}}</b> 个社区，<b>{{pointNum}}</b> 个点位</span>
        </p>

        <template v-if="activeType == 1">
            <div class="adsTable">
                <div class="myCheckbox">
                    <el-checkbox v-model="isAll" @change="allCheckboxAds"></el-checkbox>
                </div>
                <el-table
                    border
                    :data="successList"
                    style="width: 100%"
                    >
                    <el-table-column width="120px">
                        <template slot-scope="scope">
                            <div class="adDoor" v-if="scope.row.mVehicle === '广告门'">
                                <el-popover
                                    v-if="scope.row.box.A"
                                    placement="top-start"
                                    width="310"
                                    trigger="hover">
                                    <span v-if="scope.row.adlInfo === ''">暂无被禁用的信息</span>
                                    <ul v-else>
                                        <li v-for="(item,index) in scope.row.adlInfo" :key="index">
                                            <div v-if="item.asState">
                                                <p style="margin-bottom: 5px">
                                                    <span style="color: #333">该点位：{{item.asState}}中</span>
                                                </p>
                                            </div>
                                            <div v-else>
                                                <p style="margin-bottom: 5px">
                                                    <span style="color: #333">占点方案：</span>
                                                    <span>
                                                        <span  style="font-weight: bold">{{sessionData.uType === 'MD' ? item.beOccupieApName : '******'}}</span>
                                                        方案（{{item.lState == 0 ? '预锁': (item.lState == 1 ? '被占' : '强制停止')}}）
                                                    </span>
                                                </p>
                                                <p><span style="color: #333">占点排期：</span>{{item.schedules}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <el-checkbox slot="reference" v-model="scope.row.checkBox.A" label="A面"
                                        @change="changeA(scope.row)" :disabled="scope.row.box.A">
                                    </el-checkbox>
                                </el-popover>
                                <el-checkbox v-else v-model="scope.row.checkBox.A" label="A面"
                                    @change="changeA(scope.row)" :disabled="scope.row.box.A">
                                </el-checkbox>
                                <el-popover
                                    v-if="scope.row.box.B"
                                    placement="top-start"
                                    width="310"
                                    trigger="hover">
                                    <span v-if="scope.row.adlInfo === ''">暂无被禁用的信息</span>
                                    <ul v-else>
                                        <li v-for="(item,index) in scope.row.adlInfo" :key="index">
                                            <div v-if="item.asState">
                                                <p style="margin-bottom: 5px">
                                                    <span style="color: #333">该点位：{{item.asState}}中</span>
                                                </p>
                                            </div>
                                            <div v-else>
                                                <p style="margin-bottom: 5px">
                                                    <span style="color: #333">占点方案：</span>
                                                    <span>
                                                        <span  style="font-weight: bold">{{sessionData.uType === 'MD' ? item.beOccupieApName : '******'}}</span>
                                                        方案（{{item.lState == 0 ? '预锁': (item.lState == 1 ? '被占' : '强制停止')}}）
                                                    </span>
                                                </p>
                                                <p><span style="color: #333">占点排期：</span>{{item.schedules}}</p>
                                            </div>
                                        </li>
                                    </ul>
                                    <el-checkbox slot="reference" v-model="scope.row.checkBox.B" label="B面"
                                        @change="changeB(scope.row)" :disabled="scope.row.box.B">
                                    </el-checkbox>
                                </el-popover>
                                <el-checkbox v-else v-model="scope.row.checkBox.B" label="B面"
                                    @change="changeB(scope.row)" :disabled="scope.row.box.B">
                                </el-checkbox>
                            </div>
                            <div class="roadGate" v-else>
                                <el-checkbox v-model="scope.row.checkBox.ABC" label="ABC面" @change="changeABC(scope.row)">
                                </el-checkbox>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="资源名称" min-width="140" prop="resName" >
                    </el-table-column>
                    <el-table-column prop="mediaName" label="媒体名称" min-width="130" >
                    </el-table-column>
                    <el-table-column prop="city" label="城市" min-width="85" >
                    </el-table-column>
                    <el-table-column prop="origin" label="区域" min-width="85" >
                    </el-table-column>
                    <el-table-column prop="assetTag" label="资产编号" min-width="130" >
                    </el-table-column>
                    <el-table-column prop="schedules" label="排期" min-width="160">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.schedules" placement="bottom">
                                <span>{{scope.row.schedules}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <template v-if="customPermission.patrolPermission">
                    <el-table-column prop="feedback" label="巡点问题" min-width="130">
                    </el-table-column>
                    <el-table-column prop="trafficState" label="通行情况" min-width="130">
                    </el-table-column>
                </template>
                <el-table-column prop="failReason" label="失败原因" show-overflow-tooltip>
                </el-table-column>
                </el-table>
            </div>
        </template>
        <template v-if="activeType == 2">
            <el-table
                border
                :data="errorList"
                style="width: 100%"
                >
                <el-table-column label="资源名称" min-width="140" prop="resName" >
                </el-table-column>
                <el-table-column prop="city" label="市" min-width="85" >
                </el-table-column>
                <el-table-column prop="origin" label="区" min-width="85" >
                </el-table-column>
                <el-table-column prop="resAddress" label="详细地址" min-width="85" >
                </el-table-column>
                <el-table-column prop="schedules" label="排期" min-width="160">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.schedules" placement="bottom">
                            <span>{{scope.row.schedules}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="failReason" label="失败原因" show-overflow-tooltip>
                </el-table-column>
            </el-table>
        </template>
        <p class="button_box">
            <el-button @click="cancelImport()" size="small">取 消</el-button>
            <el-button type="primary" @click="confirmImport()" size="small">确 定</el-button>
        </p>
    </div>
</template>

<script>
// 时间格式化
import timeFormat from "../../../commonFun/timeFormat.js";
// excel导出
import sheetExcel from "../../../commonFun/sheetExcel.js";

export default {
    props:{
        importData:{
            type: Object,
            default: {}
        },
        name:{
            type: String,
            default: '方案名称'
        },
        customPermission: {
            type: Object,
            default: ()=>{}
        }
    },
    data(){
        return{
            // 登录信息
            sessionData: {},
            // 成功小区
            successList: [],
            // 失败小区数据
            errorList: [],
            // 勾选的点位数据
            shopList: [],
            // 是否勾选
            isAll: false,
            // 成功小区还是失败小区
            activeType: 1,
            // 成功失败小区个数
            successRes: 0,
            errorRes: 0,
        }
    },
    computed:{
        resNum(){
            let residArr = [];
            for(let data of this.shopList){
                if(!residArr.includes(data.resID)){
                    residArr.push(data.resID);
                }
            }
            return residArr.length;
        },
        pointNum(){
            let asidArr = [];
            for(let data of this.shopList){
                if(!asidArr.includes(data.asID)){
                    asidArr.push(data.asID);
                }
            }
            return asidArr.length;
        },
    },
    created(){
        this.getSessionData();
        console.log('createdd-----1');
        if(this.importData.successList){
            this.initData();
            console.log('createdd-----2');
        }
    },
    watch:{
        importData(){
            console.log('createdd-----3');
            if(this.importData.successList){
                this.initData();
                console.log('createdd-----4');
            }
        },
    },
    methods:{
        getSessionData(){
            this.sessionData = JSON.parse(sessionStorage.getItem('session_data'))
        },
        initData(){
            console.log(this.importData, 'this.importData----da-');
            // this.successList = [];
            // this.errorList = [];
            this.shopList = [];
            // let copyData = JSON.parse(JSON.stringify(this.importData));
            let copyData = Object.assign({}, this.importData);
            this.successList = copyData.successList?this.setTableData(copyData.successList):[];
            this.errorList = copyData.errorList?this.checkPointFun(copyData.errorList):[];
            this.successRes = copyData.successSize;
            this.errorRes = copyData.errorSize;
            this.isAll = false;
            console.log(this.importData, 'this.importData-----');
        },
        // 勾选表格数据格式
        setTableData(arr){
            let result = [];
            let pointSet = new Set();
            for(let [index,key] of arr.entries()) {
                let adObj = {
                    mID: key.mID,
                    resType: key.resType,
                    resID: key.resID,
                    asIDs: key.asIDs,
                    asLabs: key.asLabs,
                    resName: key.resName,
                    city: key.city,
                    rid: key.rID,
                    origin: key.rName,
                    buildType: key.cType,
                    houseNum: key.hNum,
                    buildPrice: (key.hPrice / 100),
                    mediaName: key.mTitle || '',
                    mVehicle: key.mVehicle,       // 媒体类型
                    mediaRemark: key.mRemark || '--',
                    parkSpaceNum: key.parkSpaceNum,
                    carFlow: key.carFlow,
                    peopleFlow : key.peopleFlow,
                    buildNum: key.fNum,
                    schedules: key.pbStar + '-' + key.pbEnd,
                    // schedules: key.startTime + '-' + key.endTime,
                    tradingArea: key.tradingArea || '',
                    assetTag: key.assetTag || '',
                    liveYear: key.chDay,
                    adLimit: key.notPush || '',
                    mState: key.mState === 1 ? '正常' : (key.mState === 2 ? '待安装' : '--'),
                    adSize: key.adSize || '',
                    picSize: key.picSize || '',
                    mapCenter: key.reference || '',      // 地图中心点
                    recommendReason: key.recommendReason || '', //  亲粤邻定制：推荐理由
                    address: key.resAddress || '',
                    dNum: key.dNum || '',               // 出入口数
                    connID: key.connID || '',           // 连排门id
                    industryInfos: key.industryInfos,   // 同行业资源、媒体回避
                    mediaLevel: key.grade || '',        // 媒体等级
                    asName: key.asName,                 // 点位所属公司名称
                    asrID: key.asrID,                   // 所属公司id
                    checkBox: {A: false, B: false, ABC:false},
                    box: {A: false, B: false},          // 被占用，置灰 mVehicle
                    trafficState: key.trafficState || '',
                    feedback: key.feedback || ''
                }
                // A/B面
                if (key.asLabs.indexOf('A') === -1) {
                    adObj.box.A = true;
                }
                if (key.asLabs.indexOf('B') === -1) {
                    adObj.box.B = true;
                }
                // 点位价格
                if (key.mVehicle === '道闸') {
                    adObj.adPrice = key.asPrice / 100;
                } else {
                    // 每个小区默认勾选一个点位
                    if(!pointSet.has(key.resID)) {
                        if(index%2 === 0 && !adObj.box.A) {
                            adObj.checkBox.A = true
                            this.AddShopingInfo(adObj, 'A')
                        } else if(index%2 === 1 && !adObj.box.B) {
                            adObj.checkBox.B = true
                            this.AddShopingInfo(adObj, 'B')
                        }
                    }
                    if (key.asPrice) {
                        adObj.adPrice = key.asPrice / 700;
                    } else {
                        adObj.adPrice = 0;
                    }
                }
                pointSet.add(key.resID)
                if (!!key.adlInfo && key.adlInfo.length > 0) {
                    let arr = [];
                    for (let akey of key.adlInfo) {
                        if(akey.asState){
                            arr.push({
                                asState: akey.asState
                            });
                        }else{
                            let star = timeFormat.toDate(akey.lStar, '/');
                            let end = timeFormat.toDate(akey.lEnd, '/');
                            arr.push({
                                beOccupieApName: akey.apName,
                                schedules: star + '-' + end,
                                lState: akey.lState,
                            });
                        }
                    }
                    adObj.adlInfo = arr;
                } else {
                    adObj.adlInfo = '';
                }
                result.push(adObj);
            }
            return result;
        },
        // 选中A、B面的时候
        changeA(row) {
            let check = row
            if (check.checkBox.A) {
                this.AddShopingInfo(row, 'A');// 添加到购物车
            } else {
                this.deleteShopRow(check, 'A');
            }
        },
        changeB(row) {
            let check = row;
            if (check.checkBox.B === true) {
                this.AddShopingInfo(row, 'B') // 添加到购物车
            } else {
                this.deleteShopRow(check, 'B');
            }
        },
        // 道闸点位选择
        changeABC(row){
            if (row.checkBox.ABC === true){
                let obj = this.setShopingTable(row, 'ABC')
                this.shopList.push(obj);
                this.isAll = true;
            }else{
                this.deleteShopRow(row, 'ABC');
            }
        },
        // 取消勾时,删除购物车里对应的数据行
        deleteShopRow(row, letter) {
            for (let j = 0; j < this.shopList.length; j++) {
                if (this.shopList[j].mID === row.mID && this.shopList[j].A_B === letter && this.shopList[j].schedules === row.schedules) {
                    this.shopList.splice(j, 1);
                    break;
                }
            }
            this.allCheckboxUpdata();
            console.log(this.shopList, 'this.shoplist----');
        },
        // 表头全选
        allCheckboxAds(){
            console.log('allCheckboxAds',this.isAll)
            if(this.isAll){
                this.allSelectAdsBtn();
            }else{
                this.cancleSelectAds();
            }
        },
        // 表头勾选重置
        allCheckboxUpdata(){
            if( this.shopList.length <= 0){
                this.isAll = false
            }else{
                let isCheckBox = false
                for(let key of this.successList){
                    if(key.checkBox.A || key.checkBox.B ||key.checkBox.ABC){
                        isCheckBox = true;
                        break;
                    }
                }
                if(!isCheckBox){
                    this.isAll = false;
                }
            }
        },
        // 全选表格点位
        allSelectAdsBtn() {
            console.log('全选')
            for (let pkey of this.successList) {
                if(pkey.mVehicle === '广告门'){
                    // 根据是否被占用去打勾
                    if (!pkey.box.A) {
                        pkey.checkBox.A = true;
                    }
                    if (!pkey.box.B) {
                        pkey.checkBox.B = true;
                    }
                }else if(pkey.mVehicle === '道闸'){
                    pkey.checkBox.ABC = true;
                }
            }
            this.allSelectToShop();
        },
        // 全选放进购物车
        allSelectToShop(){
            for (let i = 0; i < this.successList.length; i++) {
                let info = this.successList[i];
                if(info.mVehicle === '广告门'){
                    for (let j = 0; j < 2; j++) {
                        let selectInfo = this.setShopingTable(info, '')
                        let asLabsArr = selectInfo.asLabs.split(',')
                        let asIDArr = selectInfo.asIDs.split(',')
                        if (j === 0 && !selectInfo.box.A) {
                            selectInfo.A_B = 'A';
                            for (let n = 0; n < asLabsArr.length; n++) {
                                if (asLabsArr[n] === 'A') {
                                    // console.log('A', asIDArr[n])
                                    selectInfo.asID = asIDArr[n];
                                    break;
                                }
                            }
                            this.shopList.push(selectInfo);
                        } else if (j === 1 && !selectInfo.box.B) {
                            selectInfo.A_B = 'B';
                            for (let n = 0; n < asLabsArr.length; n++) {
                                if (asLabsArr[n] === 'B') {
                                    // console.log('B', asIDArr[n])
                                    selectInfo.asID = asIDArr[n];
                                    break;
                                }
                            }
                            this.shopList.push(selectInfo);
                        }
                    }
                }else if(info.mVehicle === '道闸'){
                    let selectInfo = this.setShopingTable(info, 'ABC');
                    this.shopList.push(selectInfo);
                }
            }
            console.log(this.shopList, 'shoplist-----');
        },
        //取消全选
        cancleSelectAds(){
            console.log('取消全选',this.successList)
            for(let pkey of this.successList){
                if(pkey.checkBox.A || pkey.checkBox.B || pkey.checkBox.ABC){
                    for(let i=0; i< this.shopList.length;){
                        if(pkey.mID === this.shopList[i].mID){
                            if(pkey.checkBox.A && this.shopList[i].A_B === 'A'){
                                this.shopList.splice(i,1);
                                pkey.checkBox.A = false;
                            }else if (pkey.checkBox.B && this.shopList[i].A_B === 'B'){
                                this.shopList.splice(i,1);
                                pkey.checkBox.B = false;
                            }else if (pkey.checkBox.ABC && this.shopList[i].A_B === 'ABC'){
                                this.shopList.splice(i,1);
                                pkey.checkBox.ABC = false;
                            }else{
                                i++;
                            }
                        }else{
                            i++;
                        }
                    }
                }
            }
            console.log(this.shopList, 'shoplist-----');
        },
        // 选点列表数据到购物车数据
        setShopingTable(info, letter){
            let selectInfo = {
                rid: info.rid,
                mID: info.mID,
                mVehicle: info.mVehicle,
                asID: info.asIDs,//.split(','),
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
                mediaRemark: info.mediaRemark,
                buildNum: info.buildNum,
                schedules: info.schedules,
                tradingArea: info.tradingArea,
                assetTag: info.assetTag,
                liveYear: info.liveYear,
                adLimit: info.adLimit,
                mapCenter: info.reference || '',      // 地图中心点
                recommendReason: info.recommendReason || '', //  亲粤邻定制：推荐理由
                address: info.address || '',
                dNum: info.dNum || '',       // 出入口数
                A_B: letter,
                checkBox: {A: info.checkBox.A, B: info.checkBox.B,ABC:  info.checkBox.ABC},
                box: {A:info.box.A !== undefined ? info.box.A : false,B:info.box.B !== undefined ? info.box.B : false},
                connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                connID: info.connID,                 // 连排门id
                industryInfos: info.industryInfos,   // 同行业资源回避
                adPrice: info.adPrice,               // 点位价格
                mediaLevel: info.mediaLevel,         // 媒体等级
                asrID: info.asrID,                   // 所属公司id
                asName: info.asName,                 // 所属公司名称
            }
            return selectInfo
        },
        // 添加到购物车
        AddShopingInfo(info, letter) {
            console.log('选中的row信息', info)
            let selectInfo = this.setShopingTable(info, letter);
            let asLabsArr = selectInfo.asLabs.split(',');
            let asIDArr = selectInfo.asIDs.split(',');
            for (let n = 0; n < asLabsArr.length; n++) {
                if (asLabsArr[n] === letter) {
                    console.log('letter', letter, asIDArr[n]);
                    selectInfo.asID = asIDArr[n];
                    break;
                }
            }
            this.shopList.push(selectInfo);
            console.log('shoplist------', this.shopList);
            this.isAll = true
        },
        // 处理有问题的点
        checkPointFun(errorList){
            let resultarr = [];
            for(let data of errorList){
                let item = {
                    resName: data.resName,
                    city: data.city,
                    origin: data.district,
                    resAddress: data.resAddress,
                    schedules: data.date,
                    failReason: data.failReason,
                };
                resultarr.push(item);
            }
            return resultarr;
        },
        // 导出有问题的点
        downLoadExcel(){
            let arr = this.questionPoint(this.errorList);
            let allHead = ['资源名称',	'市', '区',	'详细地址', '投放排期', '失败原因'];
            sheetExcel.toDownload(allHead, arr, '导入失败小区表'+timeFormat.toDate(new Date(), '-'));
        },
        // 导入excel后台返回的问题点位
        questionPoint(arr){
            let resultarr = [
                {
                    sheetName: '问题点位',
                    showList: [],
                },
            ];
            for(let data of arr){
                let obj = {
                    resName: data.resName,
                    city: data.city,
                    origin: data.origin,
                    resAddress: data.resAddress,
                    schedules: data.schedules,
                    failReason: data.failReason ||'',
                };
                resultarr[0].showList.push(obj);
            }
            return resultarr;
        },
        // 取消导入
        cancelImport(){
            this.$emit("cancel");
        },
        // 确定导入
        confirmImport(){
            this.$emit("confirmImport", this.shopList);
        },
    },
}
</script>

<style scoped>
/* 头部导入成功个数以及失败个数 */
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

/* 表头全勾选 */
.adsTable{
    position: relative;
}
.myCheckbox{
    position: absolute;
    width: 120px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    top:0;
    left: 0;
    z-index: 99;
}

.button_box{
    text-align: right;
    margin-top: 20px;
}
/deep/.import_result .el-table__body-wrapper {
    min-height: 440px;
    max-height: 440px;
}
.marin10{
    margin: 0 20px 10px 0;
}
</style>
