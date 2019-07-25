<template>
    <div class="data_analysis">
        <div class="analysis_header">
            <div class="tips">
                <span>数据统计截止至{{toTime}}</span>
                <el-select v-model="selectCity" placeholder="请选择" size="mini" @change="changeCity"
                           :disabled="isCitys">
                    <el-option
                        v-for="item in headerCityList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-tabs v-model="activeName" @tab-click="tabHandleClick">
                <el-tab-pane label="数据概览" name="first" v-if="isQinLinCity">
                    <data-read :sessionData="sessionData" :directNameList="directNameList"
                               :selectCity="selectCity" :activeName="activeName"></data-read>
                </el-tab-pane>
                <el-tab-pane label="周报/月报" name="second" v-if="!isAllCity && isQinLinCity">
                    <weekAndMouth-report :sessionData="sessionData" :selectCity="selectCity" :activeName="activeName"></weekAndMouth-report>
                </el-tab-pane>
                <el-tab-pane label="指标查询" name="third">
                    <index-query :sessionData="sessionData" :citys="headerCityList" :selectCity="selectCity" :activeName="activeName"></index-query>
                </el-tab-pane>
                <el-tab-pane label="城市对比" name="fouth" v-if="isAllCity">
                    <citys-contrast :sessionData="sessionData" :selectCity="selectCity" :activeName="activeName"
                                    :citys="headerCityList" :directNameList="directNameList"></citys-contrast>
                </el-tab-pane>
                <el-tab-pane label="点位分析" name="fifth">
                    <ads-analysis :sessionData="sessionData" :selectCity="selectCity" :activeName="activeName"></ads-analysis>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import 'echarts/lib/chart/map';
    import 'echarts/map/js/china.js';
    import sessFun from '../../commonFun/sessFun'
    import api from '../../api/api';
    import timeFormat from '../../commonFun/timeFormat';
    import dataRead from './components/dataRead';
    import weekAndMouthReport from './components/weekAndMouthReport';
    import indexQuery from './components/indexQuery';
    import citysContrast from './components/citysContrast';
    import adsAnalysis from './components/adsAnalysis';
    export default {
        name: "dataAnalysis",
        data(){
            return{
                sessionData: {},
                // 是否为平台商超管
                isAllCity: true,
                // 是否城市对比
                isCitys: false,
                // 是否是直营城市
                isQinLinCity: false,
                // 当前tabs
                activeName: '',
                // 数据截止时间
                toTime:'',
                // 顶部Tab城市选择
                headerCityList: [],
                citys:[
                    // {value: '0', label: '全 国'},
                    {value: '1', label: '北京亲邻众联'},
                    {value: '2', label: '上海多邻网络'},
                    {value: '3', label: '广州亲粤邻'},
                    {value: '4', label: '深圳亲邻交互'},
                    {value: '5', label: '成都亲邻'},
                    {value: '6', label: '重庆亲邻'},
                    {value: '7', label: '天津亲邻众联'},
                    // {value: '1160',label: '天津测试公司'},
                    // {value: '1162', label: '经营报表-测试公司'}
                ],
                // 直营公司名称
                directNameList: [],
                // 当前选择的城市
                selectCity: '0',
                //
                tabContentLoading: true,
            }
        },
        components:{
            dataRead,
            weekAndMouthReport,
            indexQuery,
            citysContrast,
            adsAnalysis,
        },
        created() {
            this.sessionData = sessFun.getSess()
            // this.tabContentLoading = this.$loading({
            //     lock: true,
            //     text: '玩命加载中...',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)'
            // });
        },
        mounted() {
            // this.tabContentLoading.close()
            this.toTime = timeFormat.returnMonthCount(0, '/');
            this.getBasicData()
        },
        methods:{
            // 获取session数据;根据登录用户的权限设置权限
            getBasicData(){
                console.log('用户信息',this.sessionData)
                if (this.sessionData.asrID == '999') {
                    this.getDirectSales()
                } else {
                    let cityArr = [
                        {
                            value: this.sessionData.asrID.toString(),
                            label: this.sessionData.asName
                        }
                    ]
                    this.headerCityList = JSON.parse(JSON.stringify(cityArr))
                    this.selectCity = cityArr[0].value
                    this.isAllCity = false
                    if (this.sessionData.rela === '直营') {
                        this.isQinLinCity = true
                        let timer1 = setTimeout(() => {
                            this.activeName = 'first';
                            clearTimeout(timer1)
                        }, 10)
                    } else {
                        this.activeName = 'third'
                    }
                    console.log('this.headerCityList', this.headerCityList)
                }
            },
            // 登录账户为平台商则去获取直营公司列表
            getDirectSales(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token
                }
                api.getApi(this.apiVar.report + '/api/v2/listDirectList',params).then(res=>{
                    console.log('获取直营公司列表',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        sessFun.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let resData = res.data.data
                        let arr = [{value: '0', label: '全 国'}]
                        let directName = []
                        for (let key of resData) {
                            let asName = this.returnAsName(key.asrId)
                            directName.push(asName || key.name)
                            arr.push({
                                value: key.asrId.toString(),
                                label: asName || key.name
                            })
                        }
                        this.headerCityList = arr
                        this.directNameList = directName
                        this.isAllCity = true
                        this.isQinLinCity = true
                        console.log('headerCityList',this.headerCityList)
                        let timer = setTimeout(() => {
                            this.activeName = 'first';
                            clearTimeout(timer)
                        }, 10)
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                }).catch(err=>{
                    this.messageFun('warning', '直营公司获取异常')
                    this.activeName = 'third'
                })
            },
            // tabs切换
            tabHandleClick(val){

            },
            // 全局选择城市
            changeCity(value){

            },
            // 根据asrrID返回城市名
            returnAsName(asrIDs) {
                // console.log('this.citys',this.citys,'asrIDs',asrIDs)
                for (let key of this.citys) {
                    if (key.value == asrIDs) {
                        return key.label
                    }
                }
                return false
            },
        },
    }
</script>

<style scoped>
    .data_analysis{
        margin: 16px 60px;
        position: relative;
    }

    /*tabs*/
    /deep/ .el-tabs__header{
        height: 54px;
        background: #fff;
    }

    /deep/ .el-tabs__item{
        height: 54px;
        line-height: 54px;
        font-size: 16px;
        color:rgba(0,0,0,0.45);
    }

    /deep/ .el-tabs__item.is-active{
        font-weight:600;
        color:rgba(24,144,255,1);
    }

    /deep/ .el-tabs__nav-wrap{
        padding: 0 24px;
    }

    /*数据截止时间*/
    .tips {
        position: absolute;
        right: 8px;
        top: 12px;
        z-index: 9;
    }
    .tips span {
        font-size: 14px;
        color:rgba(0,0,0,0.45);
        margin-left: 18px;
    }
    .tips /deep/ .el-select.el-select--mini{
        width: 114px;
    }
    .tips /deep/ .el-input__inner{
        background: rgba(0,0,0,0);
        color: #999;
        border: none;
        text-align: center;
        padding-left: 0;
        font-size: 14px;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar{
        width: 6px;
        height: 6px;
        background: #fafafa;
    }

    .data-tab {
        font-size: 12px;
        color: #808080;
        margin-bottom: 10px;
        height: 30px;
    }

    /deep/ .echarts_tooltip_title{
        width: 200px;
        height: 36px;
        display: flex;
        justify-content: space-between;
        padding: 0px 10px;
        align-items: center;
        box-sizing: border-box;
        margin-bottom: -20px;
        color: #808080;
        background-color:#F4F6F6;
        font-size: 12px;
    }

    /deep/ .echarts_tooltip_content{
        display: flex;
        justify-content: space-between;
        padding: 0px 10px;
        box-sizing: border-box;
        align-items: center;
        font-size: 12px;
        color: #2C313C;
        height: 32px;
        line-height: 32px;
    }

    /deep/ .echarts_tooltip_i{
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 5px;
    }

    /deep/ .had_not_data{
        height: 240px;
        text-align: center;
        padding-top: 100px;
    }
</style>
