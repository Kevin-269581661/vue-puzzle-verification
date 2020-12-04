<template>
    <div>
        <div class="nav-cell" v-for="(item, index) of link" :key="index" @click="navFun(item)">
            <img class="cell-img" :src="item.imgurl" alt="" >
            <a class="cell-text">{{item.title}}</a>
        </div>
        <!-- 地图选点选择条件弹出框 -->
        <el-dialog
            title="地图选点"
            :visible.sync="mapDialogVisible"
            :close-on-click-modal="false"
            width="420px">
            <ul class="map_ul">
                <li>
                    <span>投放时间：</span>
                    <el-date-picker
                        v-model="dateInput"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy/MM/dd"
                        format="yyyy/MM/dd"
                        class="date-select input-with-select">
                    </el-date-picker>
                </li>
                <li>
                    <span>投放城市：</span>
                    <el-select v-model="mapCity" filterable :loading="citySelectLoading" placeholder="请选择"
                               @change="changeCity">
                        <el-option
                            v-for="(item,index) in cityList"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
<!--                <li>-->
<!--                    <span>地图类型：</span>-->
<!--                    <el-radio v-model="ActiveMapType" :label="2">新版地图</el-radio>-->
<!--                    <el-radio v-model="ActiveMapType" :label="1">旧版地图</el-radio>-->
<!--                </li>-->
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button @click="mapDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmMap">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 销售确认已提交地图点位框 -->
        <el-dialog
            title="提示"
            :visible.sync="confirmVisible"
            :close-on-click-modal="false"
            width="30%">
            <div>
                是否已提交地图点位？
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="confirmVisible = false">取 消</el-button>
                <el-button type="primary" @click="getMapAdsAndGotoPlan">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 导出空点 -->
        <el-dialog title="空位导出" :visible.sync="isOpenDownload" width="30%">
            <download-vacancy @cancelClick="isOpenDownload = false"></download-vacancy>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../api/api'
    import downloadVacancy from "../../../components/common/components/vacancyDownload.vue"
    import sessFun from "../../../commonFun/sessFun.js";
    export default {
        props:{
            link:{
                type: Array,
                default: []
            }
        },
        components:{
            downloadVacancy,
        },
        data(){
            return{
                sessionData: '',
                showMapBtn: false,
                mapBtn: false,
                mapDialogVisible:false,
                cityList: [
                    // {value:'110100',label:'北京市'},
                    // {value:'440100',label:'广州市'},
                ],
                mapCity: '',        // 选择城市的rid
                mapCityName:'',     // 选择城市名称
                dateInput: '',      // 选择的时间区间
                citySelectLoading: true,   // 城市下拉选项loading
                // 确认销售地图选点是否已提交
                confirmVisible: false,
                // 空位导出
                isOpenDownload: false,
                // 地图类型
                isMapKind: false,
                ActiveMapType: 2,
            }
        },
        mounted(){
            this.getsessionData()
        },
        methods:{
            navFun(item) {
                if(item.title === '地图选点') {
                    this.showMapModel()
                } else if(item.title === '导出空位') {
                    this.isOpenDownload=true
                } else {
                    windows.location.href=item.link
                }
            },
            // 获取登录用户信息
            getsessionData() {
                this.sessionData = sessFun.getSess();
            },
            // 显示map条件选择框
            showMapModel(){
                if (!this.cityList.length) {
                    let params = {
                        uid: this.sessionData.uID,
                        service: "GetRMCity",
                        token: this.sessionData.token
                    }
                    api.postApi_new(this.apiVar.Media, params).then(res=>{
                        console.log('res',res)
                        if (res.data.SysCode === 200200) {
                            let resData = []
                            for(let key of res.data.data){
                                resData.push({
                                    value: key.rID,
                                    label: key.cityName
                                })
                            }
                            this.cityList = resData
                            this.citySelectLoading = false
                        }else {
                            this.$message.warning(res.data.MSG)
                        }
                    })
                } else {
                    this.citySelectLoading = false
                }
                this.mapDialogVisible = true
            },
            // 选择城市
            changeCity(val){
                console.log('val',val) // mapCityName
                for(let key of this.cityList){
                    if(key.value == this.mapCity){
                        this.mapCityName = key.label
                        break
                    }
                }
            },
            confirmMap() {
                console.log('选择的城市',this.mapCity,'选择的时间段',this.dateInput)
                if(!this.dateInput.length){
                    this.messageFun('warning','请选择时间')
                    return
                }
                if(this.mapCity === ''){
                    this.messageFun('warning','请选择城市')
                    return
                }
                console.log('ActiveMapType',this.ActiveMapType);
                this.setMapParams();
                this.ActiveMapType = 2
                // if(this.ActiveMapType == 1) {
                //     this.getMapInfo()
                // } else if(this.ActiveMapType == 2){
                //     this.setMapParams()
                // }
            },
            // 获取mapid并打开地图选点新窗口
            getMapInfo(){
                let params = {
                    token: this.sessionData.token,
                    uid: this.sessionData.uID,
                    rid: this.mapCity,
                    act: 1,
                    ls: this.dateInput[0],
                    le: this.dateInput[1],
                }
                let tempwindow = window.open()
                if (this.sessionData.uType === 'BD') {
                    params.suID = this.sessionData.uID
                }
                api.getApi(this.apiVar.Map + '/GetMapInfo', params).then(res=>{
                    console.log(this.apiVar.wuYouMap,'GetMapInfo地图mapid返回的信息', res)
                    if (!res.data.SysCode) {
                        let mapid = res.data.MapID
                        if (this.sessionData.uType === 'BD') {
                            tempwindow.location = this.apiVar.wuYouMap + mapid + '&city=' + this.mapCityName + '&flag=' + true
                            this.confirmVisible = true
                        } else if (this.sessionData.uType === 'SM') {
                            tempwindow.location = this.apiVar.wuYouMap + mapid + '&city=' + this.mapCityName + '&flag=' + false
                        } else {
                            console.log('1**************1')
                        }
                        this.mapDialogVisible = false
                    } else {
                        tempwindow.close()
                        this.$message({
                            message: res.data.MSG + ',请尝试重新点击',
                            type: 'warning'
                        })
                    }
                }).catch(err => {
                    console.log('error', err)
                })
            },
            // 设置地图选点参数
            setMapParams() {
                this.mapParams = {
                    rid: this.mapCity,
                    city:  this.mapCityName,
                    ls: this.dateInput[0],
                    le: this.dateInput[1],
                };

                let url = '';
                if(window.location.hostname == 'localhost') {
                    url = window.location.host + '/ADResourceMap/chooseRes?city=' + this.mapParams.city
                } else {
                    url = this.apiVar.qadnUrl + '/ADResourceMap/chooseRes?city=' + this.mapParams.city
                }
                // 角色
                if (this.sessionData.uType === 'BD') {
                    url = url + '&flag=' + true;
                    this.confirmVisible = true;
                    localStorage.removeItem('qinlinMapCode');
                    localStorage.setItem('mapParams', JSON.stringify({
                        rid: this.mapParams.rid,
                        ls: this.dateInput[0],
                        le: this.dateInput[1],
                        suID: this.sessionData.uID,
                    }));
                } else if (this.sessionData.uType === 'SM') {
                    url = url + '&flag=' + false
                    localStorage.removeItem('qinlinMapCode');
                    localStorage.setItem('mapParams', JSON.stringify({
                        rid: this.mapParams.rid,
                        ls: this.dateInput[0],
                        le: this.dateInput[1],
                        suID: this.sessionData.uID,
                    }));
                }
                this.mapDialogVisible = false;
                window.open(url);

            },
            // 判断是否已提交地图选择点位,并跳转到创建方案页面
            getMapAdsAndGotoPlan(){
                let indexData = {
                    dateInput: this.dateInput,
                    rid: this.mapCity.toString(),
                    city: this.mapCityName,
                    activeMapType: this.ActiveMapType
                }
                if (this.ActiveMapType === 1) {
                    api.getApi(this.apiVar.Map + '/checkMapSelect',{uid: this.sessionData.uID,token: this.sessionData.token}).then(res =>{
                        console.log('用户是否选点的接口', res)
                        if(res.data.SysCode == '200200'){
                            let resData = res.data.data
                            if (resData.isSelect) {
                                this.confirmVisible = false
                                sessionStorage.setItem('indexData', JSON.stringify(indexData));
                                this.$router.push('./sale/createPlan?from=index');
                            }else{
                                this.messageFun('warning','您在地图未提交点位')
                            }
                        }else{
                            this.messageFun('warning',res.data.MSG)
                        }
                    })
                } else {
                    api.getApi(this.apiVar.mapApi + '/checkAdsCacheExist').then(res=>{
                        if(res.data.SysCode == 200200) {
                            let resData = res.data.data;
                            if (resData === 1) {
                                this.confirmVisible = false;
                                sessionStorage.setItem('indexData', JSON.stringify(indexData));
                                this.$router.push('./sale/createPlan?from=index');
                            }else{
                                this.messageFun('warning','您在地图未提交点位')
                            }
                        } else {
                            this.messageFun('warning',res.data.MSG)
                        }
                    })
                    // let code = localStorage.getItem(`qinlinMapCode`)
                    // if(code) {
                    //     this.confirmVisible = false;
                    //     sessionStorage.setItem('indexData', JSON.stringify(indexData));
                    //     this.$router.push('./sale/createPlan?from=index');
                    // } else {
                    //     sessFun.messageFun('warning','您在地图未提交点位')
                    // }
                }

            },
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
        },
    }
</script>

<style scoped lang="scss">
    .nav-cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-flow: column nowrap;
        width: 72px;
        height: 72px;
        margin: 0 12px;
        background: rgba(248, 248, 248, 1);
        border-radius: 8px;
        cursor: pointer;
        &:hover {
            background: rgba(24, 144, 255, 0.06);
        }
        .cell-img {
            width: 18px;
            height: 18px;
            margin-top: 16px;
            // background:rgba(24, 144, 255, 1);

        }
        .cell-text {
            margin-bottom: 12px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            line-height: 17px;
        }
    }

    /deep/ .date-select.el-input__inner,/deep/ .el-select{
        width: 296px;
    }
    .map_ul li{
        margin-bottom: 16px;
    }
</style>
