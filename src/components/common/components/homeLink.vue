<template>
    <div>
        <el-row class="row_style">
            <el-col v-for="item of link" :key="item.link" :span="24/link.length" class="col_style">
                <div :style="item.children?'margin:24px;':'margin:20px;'">
                    <h2 style="cursor:pointer;" @click="toLink(item.link)">
                        <img :src="item.imgurl" alt="" class="img_box"><br>
                        <span class="link_big">{{item.title}}</span>
                    </h2>
                    <!--<span class="desc" :style="item.children?'min-height: 44px;':''">{{item.desc}}</span>-->
                </div>
                <template v-if="item.children">
                    <el-row class="chil_row">
                        <el-col :span="12" v-for="(data, index) of item.children" :key="index" class="link_chil">
                            <span v-if="data.title === '--'" style="color: rgba(0,0,0,0.45)">{{data.title}}</span>
                            <span v-else-if="data.title === '地图选点'" class="link_chil_map" @click="showMapModel">{{data.title}}</span>
                            <span v-else-if="data.title === '导出空位'" class="link_chil_map" @click="isOpenDownload=true">{{data.title}}</span>
                            <a v-else :href="data.link" class="link">{{data.title}}</a>
                        </el-col>
                    </el-row>
                </template>
            </el-col>
        </el-row>
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
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button @click="mapDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="getMapInfo">确 定</el-button>
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
        }
    },
    mounted(){
        this.getsessionData()
    },
    methods:{
        toLink(link){
            this.$router.push(link);
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
                    } else if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else {
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
        // 获取mapid并打开地图选点新窗口
        getMapInfo(){
            console.log('选择的城市',this.mapCity,'选择的时间段',this.dateInput)
            if(!this.dateInput.length){
                this.messageFun('warning','请选择时间')
                return
            }
            if(this.mapCity === ''){
                this.messageFun('warning','请选择城市')
                return
            }
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
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        this.loginTimeout()       // 登陆超时
                    } else {
                        this.$message({
                            message: res.data.MSG + ',请尝试重新点击',
                            type: 'warning'
                        })
                    }
                }
            }).catch(err => {
                console.log('error', err)
            })
        },
        // 判断是否已提交地图选择点位,并跳转到创建方案页面
        getMapAdsAndGotoPlan(){
            api.getApi(this.apiVar.Map + '/checkMapSelect',{uid: this.sessionData.uID,token: this.sessionData.token}).then(res =>{
                console.log('用户是否选点的接口', res)
                if(res.data.SysCode == '200200'){
                    let resData = res.data.data
                    if (resData.isSelect) {
                        this.confirmVisible = false
                        let indexData = {
                            dateInput: this.dateInput,
                            rid: this.mapCity.toString(),
                            city: this.mapCityName,
                        }
                        sessionStorage.setItem('indexData', JSON.stringify(indexData));
                        this.$router.push('./sale/createPlan?from=index');
                    }else{
                        this.messageFun('warning','您在地图未提交点位')
                    }
                }else if(res.data.code == '100302' || res.data.MSG === "登陆超时"){
                    this.loginTimeout()
                }else{
                    this.messageFun('warning',res.data.MSG)
                }
            })
        },
        // 操作提示统一方法
        messageFun(mesType,mes){
            this.$message({
                message: mes,
                type: mesType,
                showClose: true,
            })
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

<style scoped>
.row_style{
    background: #fff;
}
.col_style{
    border-right: 1px solid #ececec;
    /* padding: 24px; */
}
.col_style h2{
    text-align: center;
}
.col_style:last-child{
    border: none;
}
.img_box{
    display: inline-block;
    margin: 0 auto 7px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    vertical-align: middle;
}
.link{
    font-size:12px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,0,0,0.45);
    display: inline-block;
}
.link:hover{
    color: #1890FF;
}
.desc{
    margin-top: 10px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,0,0,0.45);
    line-height:22px;
    display: inline-block;
}
.link_chil{
    text-align: center;
    border-right: 1px solid #ececec;
}
.link_chil:last-child{
    border: none;
}
.link_big{
    font-size:16px;
    font-family:PingFangSC-Medium;
    font-weight:500;
    font-weight: bold;
    margin-left: 8px;
    color:rgba(0,0,0,0.85);
}
.link_big:hover{
    color: #1890FF;
}
.chil_row{
    margin-top:8px;
    border-top: 1px solid #ececec;
    padding: 10px 0;
}
/* 地图选点 */
  .link_chil_map {
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        cursor: pointer;
    }

    .link_chil_map:hover {
        color: #1890FF;
    }

    /deep/ .date-select.el-input__inner,/deep/ .el-select{
        width: 296px;
    }
    .map_ul li{
        margin-bottom: 16px;
    }
</style>
