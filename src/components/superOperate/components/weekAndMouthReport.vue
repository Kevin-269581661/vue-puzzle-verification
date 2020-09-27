<template>
    <div class="weekA_mouth_report">
        <!--数据概览-->
        <div class="report_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">数据概览</span>
                    <span class="box_card_title_right">
                        统计周期：{{timeList[0]}} - {{timeList[1]}}
                    </span>
                </div>
                <el-row :gutter="16">
                    <el-col :span="12" class="el_col_echarts">
                        <div v-if="isHaveissueReport">
                            <p class="issue_report_title">上刊/空刊/禁用比值</p>
                            <div class="bar_charts el_col_bar" id="issue_report" ref="issueReportBar"
                                 style="height: 320px;width: 100%"
                                 v-loading="issueReportBarLoading"
                                 element-loading-text="玩命加载中..."
                                 element-loading-background="rgba(255, 255, 255)">
                            </div>
                        </div>
                        <div v-else class="had_not_data">
                            <no-search-result ></no-search-result>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="el_col_bar el_col_table">
                            <el-row class="el_row_title">
                                <el-col :span="7" style="padding-left: 16px">序号</el-col>
                                <el-col :span="10" class="text_right">统计项</el-col>
                                <el-col :span="7" class="text_right">数量</el-col>
                            </el-row>
                            <ul class="table_ul">
                                <li class="table_ul_li" v-for="(item,index) in issueReportTableData">
                                    <el-row>
                                        <el-col :span="7" style="padding-left: 16px">{{index+1}}</el-col>
                                        <el-col :span="10" class="text_right">{{item.name}}</el-col>
                                        <el-col :span="7" class="text_right">{{item.value}}</el-col>
                                    </el-row>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <!--本周在线客户列表-->
        <div class="report_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">本周在线客户列表</span>
                    <span class="box_card_title_right">
                        统计：本周在刊订单{{WeekOnLineCount.orderCount}}个；在刊点位{{WeekOnLineCount.adsCount}}面；归属业务员{{WeekOnLineCount.userCount}}个
                    </span>
                </div>
                <div class="week_online_client">
                    <el-table
                        :data="weekOnlineClientData"
                        class="chance_find_table"
                        style="width: 100%"
                        v-loading="weekOnlineClientLoading"
                        element-loading-text="玩命加载中..."
                        element-loading-background="rgba(255, 255, 255)">
                        <el-table-column
                            type="index"
                            width="65"
                            label="序号">
                        </el-table-column>
                        <el-table-column
                            prop="clienter"
                            label="在刊客户"
                            min-width="140"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column
                            prop="content"
                            label="上刊内容"
                            min-width="95">
                        </el-table-column>
                        <el-table-column
                            prop="saler"
                            min-width="80"
                            label="业务员">
                        </el-table-column>
                        <el-table-column
                            prop="issueNum"
                            min-width="80"
                            label="发布数量(面)"
                            align="right">
                        </el-table-column>
                        <el-table-column
                            prop="issueDays"
                            min-width="80"
                            label="发布数量(面·天)"
                            align="right">
                        </el-table-column>
                        <el-table-column
                            prop="period"
                            min-width="125"
                            label="投放周期">
                        </el-table-column>
                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>
                </div>
            </el-card>
        </div>
        <!--发件图标-->
   <!--     <div class="subscriber_icon" @click="subscriberDialogVisible = true">
            <img class="subscriber_icon_position" src="../../../assets/images/position.png" alt="">
        </div>-->
        <el-dialog
            title="订阅报告"
            :visible.sync="subscriberDialogVisible"
            width="456px">
            <div class="subscriber_box">
                <p>收件人/邮箱</p>
                <div class="subscriber_input_box" v-for="(item,index) in recipientData">
                    <el-select v-model="item.recipienter" placeholder="请选择收件人" size="small">
                        <el-option
                            v-for="item in recipientList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="item.emailAaddress" placeholder="请输入邮箱地址" size="small" style="width: 220px;left: 6px"></el-input>
                    <i class="el-icon-remove" @click="delRowSelect(index)"></i>
                </div>
                <div class="recipient_add_btn" @click="addRowSelect">
                    <i class="el-icon-plus"></i> 添加收件人
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="subscriberDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="subscriberDialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../api/api';
    import timeFormat from '../../../commonFun/timeFormat';
    import noSearchResult from "../../../components/common/components/noSearchResult";
    import sessFun from '../../../commonFun/sessFun';
    export default {
        name: "weekAndMouthReport",
        components:{
            noSearchResult
        },
        data(){
            return{
                isGetData: false,
                starTime: '',
                // 自定义颜色
                colorList: ['#2FC25B','#1890FF','#FACC14'],
                timeList:[],
                // 数据概览
                // 头部显示的时间
                showDate:[],
                weekOverviewData: '',
                isHaveissueReport: true,
                // 饼状图
                issueReportBarLoading: true,
                issueReportPieEcharts:'',
                issueReportPieData: {
                    title: ['空刊数(面)', '在刊媒体(面)', '禁用媒体(面)'],
                    data: [
                        {value: 33500, name: '空刊数(面)'},
                        {value: 11700, name: '在刊媒体(面)'},
                        {value: 2170, name: '禁用媒体(面)'}
                    ]
                },
                // 数据概览 - 表格数据
                issueReportTableData: [],
                // 周在线客户
                weekOnlineClientLoading: true,
                weekOnlineClientData:[],
                WeekOnLineCount:{
                    orderCount: 0,
                    adsCount: 0,
                    userCount: 0,
                },
                // 收件人设置
                subscriberDialogVisible: false,
                recipientData: [
                    {recipienter:'',emailAaddress:''}
                ],
                recipientList:[
                    {value: 1,label:'官总'},
                    {value: 2,label:'邱总'},
                ],
                // emailAaddress: '',
            }
        },
        props:{
            sessionData: {
                type: Object,
                required: true,
            },
            selectCity: {
                type: String,
                required: true,
            },
            activeName:{
                type:String,
                required: true
            }
        },
        watch:{
            sessionData(newVal, oldVal) {
                console.log('newVal', newVal, 'oldVal', oldVal)
                this.sessionData = newVal
            },
            selectCity(newVal, oldVal) {
                this.selectCity = newVal
            },
            activeName(newVal, oldVal) {
                this.activeName = newVal
                if (this.activeName === 'second') {
                    if (this.isGetData) {
                        // 图表重新渲染
                        this.initIssueReportBar()
                    } else {
                        // 数据概览
                        this.getIssueReportData();
                        // 本周在线客户列表
                        this.getWeekOnlineUserData()
                        this.getWeekOnLineCount()
                        this.isGetData = true
                    }
                }
            }
        },
        mounted(){
            this.setTime()
            this.echartsListener();
        },
        methods:{
            // 统一监听
            echartsListener(){
                window.addEventListener("resize", ()=> {
                    // 数据总览
                    this.issueReportPieEcharts && this.issueReportPieEcharts.resize();
                });
            },
            // 设置初始时间
            setTime() {
                this.starTime = timeFormat.returnDayCount(0,'/')
                // 七天前日期
                let beforeDate = timeFormat.returnDayCount(-7,'/')
                let date = timeFormat.getWorkWeek('/',beforeDate)
                this.timeList = JSON.parse(JSON.stringify(date))
                console.log('_________',this.timeList)
            },
            // 数据总览接口
            getIssueReportData(){
                this.issueReportBarLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.starTime,
                    // endDate: this.timeList[1],
                    asrIds: this.sessionData.asrID
                }
                console.log('数据总览params',params)
                api.getApi(this.apiVar.report + '/api/v2/getWeekOverview', params).then(res => {
                    console.log('数据总览接口res', res)
                    if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        if (dataObj) {
                            this.weekOverviewData = res.data.data
                            this.setEchartsData(dataObj)
                            this.setIssueReportTableData(dataObj)
                        } else {
                            sessFun.messageFun('warning', '暂无数据!')
                            this.issueReportBarLoading = false
                            this.isHaveissueReport = false
                        }
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                        this.issueReportBarLoading = false
                        this.isHaveissueReport = false
                    }
                })
            },
            // 设置图表数据
            setEchartsData(dataObj){
                let arr = []
                for (let key in dataObj) {
                    if (key === 'unsoldAdsCount') {
                        arr[0] = {value: dataObj[key], name: '空刊数(面)'}
                    } else if (key === 'publishAdsCount') {
                        arr[1] = {value: dataObj[key], name: '在刊媒体(面)'}
                    } else if (key === 'forbiddenAdsCount') {
                        arr[2] = {value: dataObj[key], name: '禁用媒体(面)'}
                    }
                }
                this.issueReportPieData.data = arr
                this.initIssueReportBar();
            },
            // 设置表格数据
            setIssueReportTableData(dataObj) {
                let arr = []
                for (let key in dataObj) {
                    if (key === 'resourceCount') {
                        arr[0] = {value: dataObj[key], name: '社区总数(个)'}
                    } else if (key === 'lightBox') {
                        arr[1] = {value: dataObj[key], name: '灯箱数'}
                    } else if (key === 'totalAdsCount') {
                        arr[2] = {value: dataObj[key], name: '媒体总量(面)'}
                    } else if (key === 'forbiddenAdsCount') {
                        arr[3] = {value: dataObj[key], name: '禁用媒体(面)'}
                    } else if (key === 'publishAdsCount') {
                        arr[4] = {value: dataObj[key], name: '在刊媒体(面)'}
                    } else if (key === 'unsoldAdsCount') {
                        arr[5] = {value: dataObj[key], name: '空刊数(面)'}
                    }
                }
                this.issueReportTableData = arr
                console.log('this.issueReportTableData',this.issueReportTableData)
            },
            // 图表
            initIssueReportBar() {
                if (this.issueReportPieEcharts) {
                    this.issueReportPieEcharts.dispose()
                }
                this.issueReportPieEcharts = this.$echarts.init(this.$refs.issueReportBar)
                let total = 0
                for (let key of this.issueReportPieData.data) {
                    total += key.value
                }
                this.issueReportPieEcharts.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p class="echarts_tooltip_title">' + '<span>' + params.name + '</span>' + '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' + '数值' + '</span>' + params.value + '</p>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: '+ params.color +'"></i>' +
                                '占比' + '</span>' + params.percent + '%' + '</p>'
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                    },
                    legend: {
                        orient: 'vertical',
                        left: '3%',
                        top: "25%",
                        itemGap: 20,
                        icon: 'circle',
                        itemWidth: 8,
                        itemHeight: 8,
                        data: this.issueReportPieData.title,
                        formatter: (name) => {
                            let value;
                            let precent;
                            for (let key of this.issueReportPieData.data) {
                                if (key.name == name) {
                                    precent = (total ? parseFloat((key.value / total) * 100).toFixed(2) : 0 )+ '%'
                                    value = key.value
                                }
                            }
                            let arr = ["{a|" + name + "}", "{b|" + "|}", "{c|" + precent + "}", "{d|" + value + "}"]
                            return arr.join('')
                        },
                        textStyle: {
                            rich: {
                                a: {
                                    fontSize: 14,
                                    color: "rgba(0,0,0,0.65)",
                                    width: 80,
                                },
                                b: {
                                    fontSize: 14,
                                    color: "rgba(0,0,0,0.35)",
                                    padding: 10
                                },
                                c: {
                                    fontSize: 14,
                                    color: "rgba(0,0,0,0.65)",
                                    padding:[0,0,0,10],
                                    width: 60,
                                },
                                d: {
                                    fontSize: 14,
                                    color: "rgba(0,0,0,0.65)",
                                    padding: 8
                                }
                            }
                        }
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '72%',
                            center: ['68%', '50%'],
                            data: this.issueReportPieData.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {
                                    color: (params) => {
                                        //自定义颜色
                                        return this.colorList[params.dataIndex]
                                    }
                                }
                            },
                            label: {
                                show: false
                            },
                        }
                    ]
                })
                this.issueReportBarLoading = false
            },
            // 本周在线统计
            getWeekOnLineCount(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.starTime,
                    asrIds: this.sessionData.asrID
                }
                console.log('本周在线统计params',params)
                api.getApi(this.apiVar.report + '/api/v2/listOnlineCustomCountInfo', params).then(res => {
                    console.log('本周在线统计res', res)
                    if (res.data.SysCode === 200200) {
                        let dataObj = res.data.data
                        this.WeekOnLineCount = {
                            orderCount: dataObj.orderCount,
                            adsCount: dataObj.adsCount,
                            userCount: dataObj.userCount,
                        }
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 本周在线客户列表
            getWeekOnlineUserData(){
                this.weekOnlineClientLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    startDate: this.starTime, //this.timeList[0],
                    // endDate: this.timeList[1],
                    asrIds: this.sessionData.asrID
                }
                console.log('本周在线客户列表params',params)
                api.getApi(this.apiVar.report + '/api/v2/getOnlineCustom', params).then(res => {
                    console.log('本周在线客户res', res)
                    if (res.data.SysCode === 200200) {
                        this.setOnlineCustomData(res.data.data)
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 设置本周在线客户表格数据
            setOnlineCustomData(dataArr){
                let arr = []
                for(let key of dataArr){
                    arr.push({
                        clienter: key.customName,
                        content: key.orderName,
                        saler: key.userName,
                        issueNum: key.adsCount,
                        issueDays: key.adsDayCount,
                        period: key.orderStartDate + '-' + key.orderEndDate
                    })
                }
                this.weekOnlineClientData = arr
                this.weekOnlineClientLoading = false
            },

            // 新增一行收件人
            addRowSelect(){
                this.recipientData.push({
                    recipienter:'',
                    emailAaddress:''
                })
            },
            // 删除一行
            delRowSelect(index){
                this.recipientData.splice(index,1)
            },
        },
    }
</script>

<style scoped>
    /deep/ .el-card__body{
        padding: 24px 32px;
    }

    /deep/ .el-card__header{
        padding: 10px 32px 10px 16px;
        line-height: 32px;
    }

    .report_box{
        margin-bottom: 16px;
    }

    .box_card_title {
        font-size: 16px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(44, 49, 60, 1);
    }

    .el_col_echarts{
        position: relative;
    }

    .weekA_mouth_report .had_not_data{
        height: 220px;
        background: rgba(0, 108, 255, 0.02);
        border: 1px solid rgba(232, 232, 232, 1);
        font-size: 14px;
    }

    .issue_report_title{
        position: absolute;
        top: 24px;
        left: 32px;
        z-index: 99;
        font-size:16px;
        font-weight:600;
        color:rgba(44,49,60,1);
        line-height:24px;
    }

    .box_card_title_right {
        font-size: 14px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        float: right;
    }

    .el_col_bar {
        height: 320px;
        border: 1px solid rgba(232, 232, 232, 1);
        background: rgba(0, 108, 255, 0.02);
    }

    /*  数据概览表格  */
    .el_row_title{
        height: 38px;
        line-height: 38px;
        font-size:14px;
        font-weight:600;
        color:rgba(0,0,0,0.85);
        border-bottom: 1px solid #E8E8E8;
        border-top: 1px solid #E8E8E8;
    }

    .el_col_table{
        height: 272px;
        padding: 24px;
    }

    .table_ul_li{
        height: 38px;
        line-height: 38px;
        border-bottom: 1px solid #E8E8E8;
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
    }

    /*  订阅  */
    .subscriber_icon{
        position: fixed;
        right: 36px;
        top: 185px;
        z-index: 99;
        width: 56px;
        height: 56px;
        cursor: pointer;
    }

    .subscriber_icon_position{
        width: 100%;
        height: 100%;
    }

    .subscriber_box p{
        margin-bottom: 12px;
        color:rgba(0,0,0,0.85);
        font-size: 14px;
    }

    .subscriber_box /deep/ .el-select.el-select--small{
        width: 150px;
    }

    .subscriber_input_box{
        margin-bottom: 16px;
    }

    .subscriber_input_box /deep/ .el-icon-remove{
        color: rgba(255,0,0,0.85);
        font-size: 20px;
        font-weight: 500;
        margin-left: 8px;
        cursor: pointer;
    }

    .recipient_add_btn{
        width: 93%;
        height:30px;
        text-align: center;
        line-height: 30px;
        border-radius:4px;
        cursor:pointer;
        color:rgba(24,144,255,1);
        font-size: 14px;
        border:1px dashed rgba(24,144,255,1);
    }

    .recipient_add_btn i{
        color:rgba(24,144,255,1);
    }

    .chance_find_table /deep/ .el-table__body-wrapper{
        height: 405px;
        overflow-y: auto;
    }

    /deep/ .el-dialog__header{
        padding: 16px 24px;
        color: rgba(0,0,0,0.85);
    }

    /deep/ .el-dialog__body{
        padding: 0 24px 24px;
    }
</style>
