<template>
    <div class="data_analysis">
        <div class="analysis_header">
            <div class="tips">
                <span>数据统计截止至{{toTime}}</span>
                <el-select v-model="selectCity" placeholder="请选择" size="mini" @change="changeCity"
                           :disabled="isCitys">
                    <el-option
                        v-for="item in citys"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-tabs v-model="activeName" @tab-click="tabHandleClick">
                <el-tab-pane label="数据概览" name="first">
                    <data-read :sessionData="sessionData" :selectCity="selectCity" :activeName="activeName"></data-read>
                </el-tab-pane>
                <el-tab-pane label="周报/月报" name="second" v-if="isAllCity">
                    <weekAndMouth-report :sessionData="sessionData" :selectCity="selectCity" :activeName="activeName"></weekAndMouth-report>
                </el-tab-pane>
                <el-tab-pane label="指标查询" name="third">
                    <index-query :sessionData="sessionData" :selectCity="selectCity" :activeName="activeName"></index-query>
                </el-tab-pane>
                <el-tab-pane label="城市对比" name="fouth" v-if="isAllCity">
                    <citys-contrast :sessionData="sessionData" :selectCity="selectCity" :activeName="activeName" :citys="citys"></citys-contrast>
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
    import api from '../../api/api';
    import dataRead from './components/dataRead';
    import weekAndMouthReport from './components/weekAndMouthReport';
    import indexQuery from './components/indexQuery';
    import citysContrast from './components/citysContrast';
    import adsAnalysis from './components/adsAnalysis';
    export default {
        name: "dataAnalysis_",
        data(){
            return{
                sessionData: {},
                // 是否为平台商超管
                isAllCity: true,
                // 是否城市对比
                isCitys: false,
                // 当前tabs
                activeName: 'second',
                // 数据截止时间
                toTime:'2019/07/01',
                citys:[
                    {value: '0', label: '全 国'},
                    {value: '1', label: '北京亲邻众联'},
                    {value: '2', label: '上海多邻网络'},
                    {value: '3', label: '广州亲粤邻'},
                    {value: '4', label: '深圳亲邻交互'},
                    {value: '5', label: '成都亲邻'},
                    {value: '6', label: '重庆亲邻'},
                    {value: '7', label: '天津亲邻众联'}
                ],
                // 当前选择的城市
                selectCity: '0',
            }
        },
        components:{
            dataRead,
            weekAndMouthReport,
            indexQuery,
            citysContrast,
            adsAnalysis,
        },
        created(){
            this.getSessionData()
        },
        mounted(){

        },
        methods:{
            // 获取session数据;根据登录用户的权限设置权限
            getSessionData(){
                this.sessionData = JSON.parse(sessionStorage.getItem('session_data'))
                console.log('用户信息',this.sessionData)
                if (this.sessionData.asrID == '999') {
                    this.isAllCity = true
                } else {
                    let cityArr = [
                        {
                            value: this.sessionData.asrID,
                            label: this.returnAsName(this.sessionData.asName)
                        }
                    ]
                    this.citys =  JSON.parse(JSON.stringify(cityArr))
                    this.currCity = this.citys[0].value
                    this.isAllCity = false
                }
            },
            // tabs切换
            tabHandleClick(val){
                if(val === 'second' && this.selectCity === '0'){
                    this.selectCity = this.citys[1].value
                }
            },
            // 全局选择城市
            changeCity(value){

            },
            // 根据asrrID返回城市名
            returnAsName(asrIDs) {
                for (let key of this.citys) {
                    if (key.value == asrIDs) {
                        return key.label
                    }
                }
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
        width: 108px;
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
</style>
