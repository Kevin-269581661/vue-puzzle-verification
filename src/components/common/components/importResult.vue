<template>
    <div>
        <div class="car-title">
            <i class="el-icon-info" style="color: #1890FF;"></i>
            <h4>已成功导入点位<span>{{successList.length}}</span>个,问题点位<span>{{errorList.length}}</span>个
                <span @click="downLoadExcel()">下载表格<i class="el-icon-download"></i></span>
            </h4>
        </div>

        <el-tabs>
            <el-tab-pane label="成功小区" class="adsTable">
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
                                <el-checkbox v-model="scope.row.checkBox.A" label="A面"
                                    @change="changeA(scope.row)" :disabled="scope.row.box.A">
                                </el-checkbox>
                                <el-checkbox v-model="scope.row.checkBox.B" label="B面"
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
                    <el-table-column prop="schedules" label="排期" min-width="190">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.schedules" placement="bottom">
                                <span>{{scope.row.schedules}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="失败小区">
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
                    <el-table-column prop="mediaName" label="媒体名称" min-width="130" >
                    </el-table-column>
                    <el-table-column min-width="70" label="投放面">
                        <template slot-scope="scope">
                            <span>{{scope.row.asLab}}面</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="assetTag" label="资产编号" min-width="130" >
                    </el-table-column>
                    <el-table-column prop="schedules" label="排期" min-width="190">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.schedules" placement="bottom">
                                <span>{{scope.row.schedules}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    // props:{
    //     importData:{
    //         type: Object,
    //         default: {}
    //     },
    // },
    data(){
        return{
            // successList: [],
            // errorList: [],
            successList: [
                {
                    adSize: "1480*885",
                    adlInfo: null,
                    asIDs: "677115,677116",
                    asLabs: "A,B",
                    asName: "北京亲邻众联科技有限公司",
                    asPrice: 380000,
                    asStates: "1,1",
                    asrID: "1",
                    assetTag: "NBJ01826",
                    cType: "高端住宅",
                    carFlow: null,
                    chDay: "2003年",
                    connID: null,
                    dNum: 11,
                    fNum: 6,
                    grade: "C",
                    hNum: 2000,
                    hPrice: 10000000,
                    industryInfos: null,
                    mID: 110101000018,
                    mRemark: null,
                    mState: 1,
                    mTitle: "10号楼南门西",
                    mVehicle: "广告门",
                    notPush: null,
                    parkSpaceNum: null,
                    peopleFlow: null,
                    picSize: null,
                    rName: "东城区",
                    resAddress: "北京市东城区西花市南里东区",
                    resID: 38366,
                    resMapID: 3199750,
                    resName: "新景家园",
                    resType: 1,
                    tradingArea: "崇文门片区",
                },
                {
                    adSize: "1480*885",
                    adlInfo: null,
                    asIDs: "677131",
                    asLabs: "A",
                    asName: "北京亲邻众联科技有限公司",
                    asPrice: 380000,
                    asStates: "1",
                    asrID: "1",
                    assetTag: "NBJ01830",
                    cType: "高端住宅",
                    carFlow: null,
                    chDay: "2003年",
                    connID: null,
                    dNum: 11,
                    fNum: 6,
                    grade: "C",
                    hNum: 2000,
                    hPrice: 10000000,
                    industryInfos: null,
                    mID: 110101000026,
                    mRemark: null,
                    mState: 1,
                    mTitle: "西九东门",
                    mVehicle: "广告门",
                    notPush: null,
                    parkSpaceNum: null,
                    peopleFlow: null,
                    picSize: null,
                    rName: "东城区",
                    resAddress: "北京市东城区西花市南里东区",
                    resID: 38366,
                    resMapID: 3199750,
                    resName: "新景家园",
                    resType: 1,
                    tradingArea: "崇文门片区",
                },
                {
                    adSize: null,
                    adlInfo: null,
                    asIDs: "709536,709537,709538",
                    asLabs: "A,B,C",
                    asName: "北京亲邻众联科技有限公司",
                    asPrice: 980000,
                    asStates: "1,1,1",
                    asrID: "1",
                    assetTag: "AS54485748784",
                    cType: "中端住宅",
                    carFlow: 800,
                    chDay: "2005",
                    connID: null,
                    dNum: 3,
                    fNum: 6,
                    grade: null,
                    hNum: 50,
                    hPrice: 8885900,
                    industryInfos: null,
                    mID: 110101000077,
                    mRemark: "AS54485748784",
                    mState: 1,
                    mTitle: "道闸+3",
                    mVehicle: "道闸",
                    notPush: "健身、恶俗医疗",
                    parkSpaceNum: 600,
                    peopleFlow: 2000,
                    picSize: "2558*2558",
                    rName: "东城区",
                    resAddress: "中山大道55555号",
                    resID: 45896,
                    resMapID: 3201094,
                    resName: "测试道闸资源",
                    resType: 1,
                    tradingArea: "三元里",
                },
                {
                    adSize: null,
                    adlInfo: null,
                    asIDs: "709539,709540,709541",
                    asLabs: "A,B,C",
                    asName: "北京亲邻众联科技有限公司",
                    asPrice: 980000,
                    asStates: "1,1,1",
                    asrID: "1",
                    assetTag: "AS54485748784",
                    cType: "中端住宅",
                    carFlow: 800,
                    chDay: "2005",
                    connID: null,
                    dNum: 3,
                    fNum: 6,
                    grade: null,
                    hNum: 50,
                    hPrice: 8885900,
                    industryInfos: null,
                    mID: 110101000078,
                    mRemark: "",
                    mState: 1,
                    mTitle: "道闸+4",
                    mVehicle: "道闸",
                    notPush: "健身、恶俗医疗",
                    parkSpaceNum: 600,
                    peopleFlow: 2000,
                    picSize: "1558*1854",
                    rName: "东城区",
                    resAddress: "中山大道55555号",
                    resID: 45896,
                    resMapID: 3201094,
                    resName: "测试道闸资源",
                    resType: 1,
                    tradingArea: "三元里",
                }
            ],
            errorList: [],
            shopList: [],
            isAll: false,
        }
    },
    created(){
        // this.successList = this.importData.successList;
        // this.errorList = this.importData.successList;
        // console.log('successList---errror', this.successList, this.errorList);
        this.successList = this.setTableData(this.successList);
        console.log('success----', this.successList);
    },
    methods:{
        // 勾选表格数据格式
        setTableData(arr){
            let result = [];
            for(let key of arr) {
                let adObj = {
                    mID: key.mID,
                    resType: key.resType,
                    resID: key.resID,
                    asIDs: key.asIDs,
                    asLabs: key.asLabs,
                    resName: key.resName,
                    city: key.rName,
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
                    tradingArea: key.tradingArea || '',
                    assetTag: key.assetTag || '',
                    liveYear: key.chDay,
                    adLimit: key.notPush || '',
                    mState: key.mState === 1 ? '正常' : (key.mState === 2 ? '待安装' : '--'),
                    adSize: key.adSize || '',
                    picSize: key.picSize || '',
                    mapCenter: key.reference || '',      // 地图中心点
                    address: key.resAddress || '',
                    dNum: key.dNum || '',               // 出入口数
                    connID: key.connID || '',           // 连排门id
                    industryInfos: key.industryInfos,   // 同行业资源、媒体回避
                    mediaLevel: key.grade || '',        // 媒体等级
                    asName: key.asName,                 // 点位所属公司名称
                    asrID: key.asrID,                   // 所属公司id
                    checkBox: {A: false, B: false,ABC:false},
                    box: {A: false, B: false},
                }
                // 点位价格
                if (key.mVehicle === '道闸') {
                    adObj.adPrice = key.asPrice / 100
                } else {
                    if (key.asPrice) {
                        adObj.adPrice = key.asPrice / 700
                    } else {
                        adObj.adPrice = 0
                    }
                }
                // A/B面
                if (key.asLabs.indexOf('A') === -1) {
                    adObj.box.A = true
                }
                if (key.asLabs.indexOf('B') === -1) {
                    adObj.box.B = true
                }
                result.push(adObj)
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
                asID: info.asIDs.split(','),
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
        // 导出有问题的点
        downLoadExcel(){
            let arr = this.questionPoint(this.excelDataUpload, this.importInfoData.successList);
            let allHead = ['资源名称',	'市', '区',	'媒介载体', '媒体名称', '投放面', '资产编号', '投放排期'];
            sheetExcel.toDownload(allHead, arr, this.planForm.planName+'问题点位表');
        },
        // 导入excel后台返回的问题点位
        questionPoint(arr, successArr){
            let resultarr = [
                {
                    sheetName: '问题点位',
                    showList: [],
                },
                {
                    sheetName: '正常点位',
                    showList: [],
                }
            ];
            for(let data of arr){
                let obj = {
                    resName: data.resName,
                    city: data.city,
                    origin: data.origin,
                    mVehicle: data.mVehicle,
                    mediaName: data.mediaName,
                    asLab: data.asLab,
                    assetTag: data.assetTag,
                    schedules: data.schedules,
                };
                resultarr[0].showList.push(obj);
            }
            for(let data of successArr){
                let info = data.adSInfo;
                let obj = {
                    resName: info.resName,
                    city: info.prName,
                    origin: info.rName,
                    mVehicle: info.mVehicle,
                    mediaName: info.mTitle,
                    asLab: info.asLab,
                    assetTag: info.assetTag,
                    schedules: timeFormat.toDate(data.pbStar, '.')+'-'+timeFormat.toDate(data.pbEnd, '.'),
                };
                resultarr[1].showList.push(obj);
            }
            return resultarr;
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
    margin-top: 5px;
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
</style>
