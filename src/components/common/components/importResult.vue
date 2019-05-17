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
                    <el-table-column width="110px">
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
    props:{
        importData:{
            type: Object,
            default: {}
        },
    },
    data(){
        return{
            successList: [],
            errorList: [],
            isAll: false,
        }
    },
    created(){
        this.successList = this.importData.successList;
        this.errorList = this.importData.successList;
    },
    methods:{
        // 选中A、B面的时候
        changeA(row) {
            let check = row
            if (check.checkBox.A) {
                this.AddShopingInfo(row, 'A') // 添加到购物车
            } else {                         
                this.deleteShopRow(check, 'A')
            }
        },
        changeB(row) {
            let check = row
            if (check.checkBox.B === true) {
                this.AddShopingInfo(row, 'B') // 添加到购物车
            } else {                       
                this.deleteShopRow(check, 'B')
            }
        },
        // 道闸点位选择
        changeABC(row){
            if (row.checkBox.ABC === true){
                let obj = this.setShopingTable(row,'ABC')
                this.shopingList.push(obj)
                this.isAll = true
            }else{
                this.deleteShopRow(row, 'ABC')
            }
        },
        // 取消勾时,删除购物车里对应的数据行
        deleteShopRow(row, letter) {
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
        // 表头全选
        allCheckboxAds(){
            console.log('allCheckboxAds',this.isAll)
            if(this.isAll){
                this.allSelectAdsBtn()
            }else{
                this.cancleSelectAds()
            }
        },
        // 表头勾选重置
        allCheckboxUpdata(){
            if( this.shopingList.length <= 0){
                this.isAll = false
            }else{
                let isCheckBox = false
                for(let key of this.planList){
                    if(key.checkBox.A || key.checkBox.B ||key.checkBox.ABC){
                        isCheckBox = true
                        break
                    }
                }
                if(!isCheckBox){
                    this.isAll = false
                }
            }
        },
        // 全选表格点位
        allSelectAdsBtn() {
            console.log('全选')
            for (let pkey of this.planList) {
                if(this.mediaType === '广告门'){
                    // 根据是否被占用去打勾
                    if (!pkey.box.A) {
                        pkey.checkBox.A = true
                    }
                    if (!pkey.box.B) {
                        pkey.checkBox.B = true
                    }
                }else if(this.mediaType === '道闸'){
                    pkey.checkBox.ABC = true
                }
            }
            if(this.mediaType === '广告门'){
                this.allSelectToShop_adDoor()
            }else if(this.mediaType === '道闸'){
                this.allSelectToShop_roadGate()
            }
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
                                pkey.checkBox.A = false
                            }else if (pkey.checkBox.B && this.shopingList[i].A_B === 'B'){
                                this.shopingList.splice(i,1)
                                pkey.checkBox.B = false
                            }else if (pkey.checkBox.ABC && this.shopingList[i].A_B === 'ABC'){
                                this.shopingList.splice(i,1)
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
            this.computeMedia_AD()
        },
        // 选点列表数据到购物车数据
        setShopingTable(info,letter){
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
            let selectInfo = this.setShopingTable(info,letter)
            let asLabsArr = selectInfo.asLabs.split(',')
            let asIDArr = selectInfo.asIDs.split(',')
            if (letter == 'B') {
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
            this.isAll = true
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
    width: 100px;
    height: 42px;
    text-align: center;
    line-height: 42px;
    top:0;
    left: 0;
    z-index: 99;
}
</style>
