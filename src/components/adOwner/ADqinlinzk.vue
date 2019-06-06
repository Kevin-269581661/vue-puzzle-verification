<template>
    <div class="ad_mediaDetail_wrap clearfix ADqinlinzk">
      <!--  <el-tabs v-model="activeName" @tab-click="handleClick" tab-position="left" class="tabs">
            <el-tab-pane label="总览" name="first" class="tab-pane">
                <el-menu :default-openeds="opens" :default-active="nowIndex" class="el-menu-vertical-demo" @open="handleOpen"
                         @close="handleClose" background-color="#444444" text-color="#BBBBBB" active-text-color="#FFFFFF"
                         unique-opened>
                    <template v-for="(val, index) in navList">
                        <el-menu-item v-if="!val.childs" :index="val.index" :key="index" class="fir-item">
                            <i :class="val.icon"></i>
                            <a href="javascript:void(0)" @click="showCom(val.index)">{{val.name}}</a>
                            &lt;!&ndash; <a :href="val.link">{{ val.name }}</a> &ndash;&gt;
                        </el-menu-item>
                        <el-submenu v-else :index="index.toString()" :key="index">
                            <template slot="title">
                                <i :class="val.icon"></i>{{ val.name }}
                            </template>
                            <template v-for="(value, key) in val.childs">
                                <el-menu-item :index="value.index" :key="key" class="sec-item">
                                    <i :class="value.icon"></i>
                                    &lt;!&ndash; <a :href="value.link">{{ value.name }}</a> &ndash;&gt;
                                    <a href="javascript:void(0)"  @click="showCom(value.index)">{{value.name}}</a>
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                </el-menu>

                &lt;!&ndash; <el-menu default-openeds="['1','2','3','4']" default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#444444" text-color="#BBBBBB" active-text-color="#FFFFFF">
                            <el-menu-item index="1">
                                <i class="el-icon-document"></i>
                                <span slot="title">整体概览</span>
                            </el-menu-item>
                            <el-submenu index="2">
                                <template slot="title">
                                    <i class="el-icon-location"></i>
                                    <span slot="title">人流管理</span>
                                </template>
                                <el-menu-item index="2-1" class="sec-item">
                                    <a href="/adOwner/totalView">人流趋势</a>
                                </el-menu-item>
                                <el-menu-item index="2-2" class="sec-item">居民访客</el-menu-item>
                                <el-menu-item index="2-3" class="sec-item">访问时段</el-menu-item>
                            </el-submenu>
                            <el-submenu index="3">
                                <template slot="title">
                                    <i class="el-icon-location"></i>
                                    <span slot="title">住户洞察</span>
                                </template>
                                <el-menu-item index="3-1" class="sec-item">住户属性</el-menu-item>
                                <el-menu-item index="3-2" class="sec-item">消费偏好</el-menu-item>
                            </el-submenu>
                        </el-menu> &ndash;&gt;
            </el-tab-pane>
            <el-tab-pane label="社区" name="second" class="tab-pane community-tab">

                &lt;!&ndash; <el-menu default-openeds="['1','2','3','4']" default-active="2-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#444444" text-color="#BBBBBB" active-text-color="#FFFFFF">
                            <el-menu-item index="1">
                                <i class="el-icon-document"></i>
                                <span slot="title">整体概览</span>
                            </el-menu-item>
                            <el-submenu index="2">
                                <template slot="title">
                                    <i class="el-icon-location"></i>
                                    <span slot="title">人流管理</span>
                                </template>
                                <el-menu-item index="2-1" class="sec-item">人流趋势</el-menu-item>
                                <el-menu-item index="2-2" class="sec-item">居民访客</el-menu-item>
                                <el-menu-item index="2-3" class="sec-item">访问时段</el-menu-item>
                            </el-submenu>
                            <el-submenu index="3">
                                <template slot="title">
                                    <i class="el-icon-location"></i>
                                    <span slot="title">住户洞察</span>
                                </template>
                                <el-menu-item index="3-1" class="sec-item">住户属性</el-menu-item>
                                <el-menu-item index="3-2" class="sec-item">消费偏好</el-menu-item>
                            </el-submenu>

                        </el-menu> &ndash;&gt;
            </el-tab-pane>
        </el-tabs>-->
        <div class="tabs">
            <el-menu :default-openeds="opens" :default-active="nowIndex" class="el-menu-vertical-demo" @open="handleOpen"
                     @close="handleClose" background-color="#444444" text-color="#BBBBBB" active-text-color="#FFFFFF"
                     unique-opened>
                <template v-for="(val, index) in navList">
                    <el-menu-item v-if="!val.childs" :index="val.index" :key="val.index" class="fir-item community">
                        <el-select v-model="community" filterable placeholder="请输入名称搜索" @change="selectCom()" @focus="clearValue" @blur="fillValue" @keyup.enter.native="enter" no-match-text="">
                            <el-option-group
                                v-for="(group, comIndex) in communityChooes"
                                :key="comIndex"
                                :label="group.label">
                                <el-option
                                    v-for="(item, communitIndex) in group.communitys"
                                    :key="communitIndex"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-menu-item>
                    <el-menu-item v-if="!val.childs" :index="val.index" :key="index" class="fir-item">
                        <i :class="val.icon"></i>
                        <!-- <a :href="val.link">{{ val.name }}</a> -->
                        <a href="javascript:void(0)" @click="showCom(val.index)">{{val.name}}</a>
                    </el-menu-item>
                    <el-submenu v-else :index="index.toString()" :key="index">
                        <template slot="title">
                            <i :class="val.icon"></i>{{ val.name }}
                        </template>
                        <template v-for="(value, key) in val.childs">
                            <el-menu-item :index="value.index" :key="key" class="sec-item">
                                <i :class="value.icon"></i>
                                <!-- <a :href="value.link">{{ value.name }}</a> -->
                                <a href="javascript:void(0)" @click="showCom(value.index)">{{value.name}}</a>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
            </el-menu>
        </div>
        <div class="left_content">
            <keep-alive>
                <component :is="comName" :selectRes="selectRes"></component>
            </keep-alive>
        </div>
    </div>
</template>

<script>
    import { api } from '../../api/api';
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import sessFun from "../../commonFun/sessFun.js";
    import accessPeriod from './accessPeriod.vue';
    import costPreferences from './costPreferences.vue';
    import residentAttr from './residentAttr.vue';
    import resVisitors from './resVisitors.vue';
    import trafficTrend from './trafficTrends.vue';
    import totalView from './totalView.vue';
    import visitFrequency from './visitFrequency.vue';
    import hotSource from './hotSource.vue';
    import { Message } from 'element-ui';
    export default {
        name: "qinlinzk",
        components:{
            accessPeriod,
            costPreferences,
            residentAttr,
            resVisitors,
            trafficTrend,
            totalView,
            visitFrequency,
            hotSource,
        },
        data() {
            return {
                // 登录信息
                sessionData:{},
                noMatchText: '智邻数图为亲邻科技与百度共同打造的社区画像大数据产品，若您需要开通其他社区画像，请联系当地商务或发送邮件至 xyqiu@qinlinkeji.com',
                // activeName: "first",
                activeName: "second",
                nowIndex: 'totalView',
                comName: '',
                opens: ['1','2','3','4'],
                navList: [
                    {
                        name: "整体概览",
                        link: "/superOperate/totalView",
                        index: 'totalView',
                        icon: "el-icon-document"
                    },
                    {
                        name: "人流管理",
                        childs: [
                            {
                                name: "人流趋势",
                                link: "/superOperate/trafficTrend",
                                index: 'trafficTrend',
                            },
                            // {
                            //     name: "到访频次",
                            //     link: "/superOperate/visitFrequency",
                            //     index: 'visitFrequency'
                            // },
                            {
                                name: "访问时段",
                                link: "/superOperate/accessPeriod",
                                index: 'accessPeriod'
                            },
                            {
                                name: "热门来源",
                                link: "/superOperate/hotSource",
                                index: 'hotSource'
                            }
                        ],
                        icon: "el-icon-location"
                    },
                    {
                        name: "住户洞察",
                        childs: [
                            {
                                name: "住户属性",
                                link: "/superOperate/residentAttr",
                                index: 'residentAttr'
                            },
                            {
                                name: "消费偏好",
                                link: "/superOperate/costPreferences",
                                index: 'costPreferences'
                            }
                        ],
                        icon: "el-icon-view"
                    }
                ],
                //社区选择
                communityChooes: [{
                    label: '可直接搜索小区名哦',
                    communitys: [],
                }],
                community: '',
                // 选中的资源数据
                selectRes: {},
            }

        },
        created(){
            this.sessionData = sessFun.getSess();
            this.getInitData();
            this.showCom('totalView');
        },
        methods: {
            getInitData(){
                // let arr =[
                //     {
                //         resName: "东华苑",
                //         resID: 228,
                //         bdday:  'Aug 14, 2018',
                //         bdsday: 'Aug 11, 2018'
                //     },
                //     {
                //         resName: "越秀公园",
                //         resID: 229,
                //         bdday:  'Aug 18, 2018',
                //         bdsday: 'Aug 1, 2018'
                //     }
                // ];
                // let result = [];
                // for(let data of arr){
                //     let item = {
                //         label: data.resName,
                //         value: data.resID,
                //         bdsday: data.bdsday,
                //         bdday: data.bdday,
                //         resID: data.resID
                //     }
                //     result.push(item);
                // }
                // console.log('reslult', result);
                // this.communityChooes[0].communitys = result;
                // this.community = result[0].resID;
                // this.getTabInitData();

                // apid[必填]      关联订单ID
                // uid[必填]       用户唯一标识
                // tooken[必填]    登陆凭证
                let sessionData = this.sessionData;
                let info = {
                    apid: sessionStorage.getItem('AD_apid'),
                    uid: sessionData.uID,
                    tooken: sessionData.token,
                    aitime: dateFormat.toDateTime(sessionStorage.getItem('aiTime'))
                };
                api.getApi(this.apiVar.QZhike+'/GetComm', info).then(res=>{
                    console.log(res.data);
                    // if(res.data){}
                    if(res.data.length){
                        let result = [];
                        for(let data of res.data){
                            let item = {
                                label: data.resName,
                                value: data.resID,
                                resCity: data.resCity,
                                resCounty: data.resCounty,
                                resName: data.resName,
                                gEDay: data.gEDay,
                                gSDay: data.gSDay,
                                resID: data.resID
                            };
                            result.push(item);
                        }
                        console.log('result----------', result);
                        this.communityChooes[0].communitys = result;
                        this.community = result[0].resID;
                        this.getTabInitData();
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout();
                    } else if(res.data.SysCode == 700400){
                        console.log(res.data.MSG)
                    }
                    else {
                        Message.warning(res.data.MSG);
                    }
                });

            },
            compareTime(arr, sField, eField){
                return dateFormat.compareTime(arr, sField, eField);
            },
            // 时间格式规范
            formatTime(val) {
                return dateFormat.toDate(val, "/");
            },
            // 选择小区
            selectCom(){
                console.log('this.community', this.community);
                for(let data of this.communityChooes[0].communitys){
                    if(data.resID == this.community){
                        data.bdsday = this.formatTime(data.gSDay);
                        data.bdday = this.formatTime(data.gEDay);
                        console.log(data);
                        this.selectRes = data;
                        break;
                    }
                }
            },
            clearValue(){
                this.community = '';
            },
            fillValue(){
                if(!this.community){
                    console.log(this.communityChooes[0].communitys[0].value);
                    this.community = this.communityChooes[0].communitys[0].value;
                }
            },
            enter(value){
                let query = value.target.value;
                let str = JSON.stringify(this.communityChooes[0].communitys);
                if(!str.includes(query)){
                    this.$alert(this.noMatchText, '提示信息', {
                        confirmButtonText: '确定'
                    });
                }
            },
            getTabInitData(){
                if(this.activeName == 'first'){
                    let arr = this.communityChooes[0].communitys;
                    let obj = this.compareTime(arr, 'gSDay', 'gEDay');
                    let info = {
                        bdsday: obj.startTime,
                        bdday: obj.endTime,
                    };
                    this.selectRes = info;
                    this.showCom('totalView');
                }else{
                    for(let data of this.communityChooes[0].communitys){
                        if(data.resID == this.community){
                            console.log(data);
                            data.bdsday = this.formatTime(data.gSDay);
                            data.bdday = this.formatTime(data.gEDay);
                            this.selectRes = data;
                            break;
                        }
                    }
                    this.showCom('totalView');
                }
            },
            showCom(name){
                console.log('name-------------', name);
                this.comName = name;
            },


            handleClick() {
                console.log(this.activeName);
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
        },
        // watch:{
        //     activeName(){
        //         this.getTabInitData();
        //     },
        // },
    };
</script>

<style scoped>
    /*.ad_mediaDetail_wrap{*/
        /*padding-top: 60px;*/
    /*}*/
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        position: absolute;
        /*left: 42px;*/
        /*top: 60px;*/
        height: 90%;
        /*min-width: 146px;*/
        width: 165px;
        border-top: 1px solid #666161;
    }

    /deep/ .el-tabs__item {
        padding: 0 8px;
    }

    /deep/ .el-tabs__active-bar {
        background-color: #ffffff;
    }

    /deep/ .el-tabs__item.is-active {
        color: #ffffff;
        background-color: #3a3a3a !important;
    }

    /deep/ .el-tabs__item {
        color: #bbbbbb;
    }

    /deep/ .el-tabs__nav-scroll {
        margin-right: 2px;
        border-right: 1px solid #616161;
    }

    /deep/ .el-menu-item,
    /deep/ .el-submenu__title {
        height: 40px;
        line-height: 38px;
    }

    /deep/ .el-menu-item.is-active {
        background-color: #3a3a3a !important;
    }
    /deep/ li.el-menu-item.fir-item.is-active a{
        color: #fff;
    }

    /deep/ li.el-menu-item,
    /deep/ .el-submenu__title {
        padding-left: 8px !important;
        font-size: 14px;
    }

    /deep/ li.el-menu-item.sec-item {
        padding-left: 37px !important;
        font-size: 12px;
        height: 36px;
        line-height: 36px;
    }

    /deep/ li.el-menu-item.fir-item {
        padding-left: 9px !important;
    }

    /deep/ li.el-menu-item.fir-item a {
        font-size: 14px;
        color: #bbbbbb;
    }

    /deep/ li.el-menu-item.sec-item a {
        font-size: 12px;
        color: #BBBBBB;
    }

    /deep/ .el-menu-item.is-active a {
        color: #ffffff;
        font-size: 14px;
    }

    /deep/ li.el-menu-item.sec-item.is-active a {
        color: #ffffff;
        font-size: 12px;
    }

    /deep/ .el-menu-item [class^=el-icon-] {
        margin-right: 0;
    }

    /deep/ .el-submenu .el-menu-item {
        min-width: 136px;
    }

    .tabs {
        /*width: 189px;*/
        width: 165px;
        position: absolute;
        left: 0;
        top: 60px;
        background: #444;
        height: 100%;
        padding-top: 60px;
        margin-top: -60px;
        box-sizing: border-box;
        z-index: 99;

    }
    /deep/ .el-tabs--left .el-tabs__header.is-left{
        margin-right: 0;
        border-top: 1px solid #666161;
    }
    /deep/ .el-tabs__nav-wrap:after{
        background-color: #444 !important;
    }

    .tabs /deep/ .el-tabs--left .el-tabs__active-bar.is-left, /deep/ .el-tabs--left .el-tabs__nav-wrap.is-left:after{
        right: 42px;
        left: 0;
    }

    /*小区选择*/
    .tabs /deep/ .el-input--suffix .el-input__inner,/deep/ .el-menu-item.is-active /deep/ .el-input--suffix .el-input__inner{
        width: 143px;
        height: 40px;
        padding-right: 30px;
        background: #444444;
        border: none;
        color: #ffffff;
        border-bottom: 1px dashed #585858;
        padding-bottom: 1px;
    }
    /deep/ li.el-menu-item.fir-item.community {
        padding: 0px !important;
    }
    /deep/  li.el-menu-item.community.is-active{
        background-color: #444;
    }
    /deep/ .el-select-group__title{
        padding: 0 10px;
    }


    /*1440*/
    @media all and (min-width: 1420px) {
    }

    /*1920*/
    @media all and (min-width: 1900px) {
    }
</style>
<style>
    .ADqinlinzk .tabs .el-tabs__item {
        padding: 0 8px;
    }

    .ADqinlinzk .tabs .el-tabs__active-bar {
        background-color: #ffffff;
    }

    .ADqinlinzk .tabs .el-tabs__item.is-active {
        color: #ffffff;
        background-color: #3a3a3a !important;
    }

    .ADqinlinzk .tabs .el-tabs__item {
        color: #bbbbbb;
    }

    .ADqinlinzk .tabs .el-tabs__nav-scroll {
        border-top: 1px solid #666161;
        margin-right: 2px;
        border-right: 1px solid #666161;
    }

   .ADqinlinzk .tabs .el-menu-item,
   .ADqinlinzk .tabs .el-submenu__title {
        height: 40px;
        line-height: 38px;
    }

    .ADqinlinzk .tabs .el-menu-item.is-active {
        background-color: #3a3a3a !important;
    }
    .ADqinlinzk .tabs li.el-menu-item.fir-item.is-active a{
        color: #fff;
    }

    .ADqinlinzk .tabs li.el-menu-item,
    .ADqinlinzk .tabs .el-submenu__title {
        padding-left: 8px !important;
        font-size: 14px;
    }

    .ADqinlinzk .tabs li.el-menu-item.sec-item {
        padding-left: 37px !important;
        font-size: 12px;
        height: 36px;
        line-height: 36px;
    }

    .ADqinlinzk .tabs li.el-menu-item.fir-item {
        padding-left: 9px !important;
    }

    .ADqinlinzk .tabs li.el-menu-item.fir-item a {
        font-size: 14px;
        color: #bbbbbb;
        width: 100px;
        height: 41px;
        position: absolute;
        top: 0px;
        left: 0px;
        padding-left: 36px;
    }

    .ADqinlinzk .tabs li.el-menu-item.sec-item a {
        font-size: 12px;
        color: #BBBBBB;
        width: 100px;
        height: 41px;
        position: absolute;
        top: 0px;
        left: 0px;
        padding-left: 36px;
    }

    .ADqinlinzk .tabs .el-menu-item.is-active a {
        color: #ffffff;
        font-size: 14px;
    }

    .ADqinlinzk .tabs li.el-menu-item.sec-item.is-active a {
        color: #ffffff;
        font-size: 12px;
    }

    .ADqinlinzk .tabs .el-menu-item [class^=el-icon-] {
        margin-right: 0;
    }

    .ADqinlinzk .tabs .el-submenu .el-menu-item {
        min-width: 136px;
    }

    .ADqinlinzk .tabs .el-input--suffix .el-input__inner,  .ADqinlinzk .el-menu-item.is-active .el-input--suffix .el-input__inner{
        width: 165px;
        height: 40px;
        text-align: center;
        padding-right: 30px;
        background: #444444;
        border: none;
        color: #ffffff;
        border-bottom: 1px dashed #585858;
        padding-bottom: 1px;
    }
    .ADqinlinzk .tabs  li.el-menu-item.fir-item.community {
        padding: 0px !important;
    }
    .ADqinlinzk .tabs   li.el-menu-item.community.is-active{
        background-color: #444;
    }
    .ADqinlinzk .tabs  .el-select-group__title{
        padding: 0 10px;
    }
    .ADqinlinzk.ad_mediaDetail_wrap .el-tabs--left .el-tabs__active-bar.is-left, .ad_mediaDetail_wrap .el-tabs--left .el-tabs__nav-wrap.is-left:after{
        right: 42px;
        left: 0;
    }
    .el-select-dropdown .el-select-dropdown__empty{
        width: 160px !important;
    }
</style>
