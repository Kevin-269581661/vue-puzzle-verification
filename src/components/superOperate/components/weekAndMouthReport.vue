<template>
    <div class="weekA_mouth_report">
        <!--数据概览-->
        <div class="report_box">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <span class="box_card_title">数据概览</span>
                    <span class="box_card_title_right">
                        统计周期：2019年04月13日 00:00 - 2019年04月19日 23:59
                    </span>
                </div>
                <el-row :gutter="16">
                    <el-col :span="12" class="el_col_echarts">
                        <p class="issue_report_title">上刊/空刊/禁用比值</p>
                        <div class="bar_charts el_col_bar" id="issue_report" ref="issueReportBar" style="height: 320px;width: 100%"></div>
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
                                        <el-col :span="7" class="text_right">{{item.number}}</el-col>
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
                        统计：本周在刊订单10个；在刊点位3893面；归属业务员9个
                    </span>
                </div>
                <div class="week_online_client">
                    <el-table
                        :data="weekOnlineClientData"
                        class="chance_find_table"
                        style="width: 100%">
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
                    </el-table>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import api from '../../../api/api';
    export default {
        name: "weekAndMouthReport",
        data(){
            return{
                // 自定义颜色
                colorList: ['#2FC25B','#1890FF','#FACC14'],
                // 数据概览
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
                issueReportTableData: [
                    {
                        name: '社区总数（个）',
                        number: '1298',
                    },
                    {
                        name: '灯箱数',
                        number: '1298',
                    },
                    {
                        name: '媒体总量（面）',
                        number: '1298',
                    },
                    {
                        name: '禁用媒体（面）',
                        number: '1298',
                    },
                    {
                        name: '在刊媒体（面）',
                        number: '1298',
                    },
                    {
                        name: '空刊数（面）',
                        number: '1298',
                    }
                ],
                // 周在线客户
                weekOnlineClientData:[
                    {
                        index: 1,
                        clienter:'深圳托趣钢琴培训中心',
                        content: '托趣',
                        saler:'朱强',
                        issueNum:'56',
                        issueDays: '156',
                        period: '2018/11/10 - 2019/11/08',
                    },
                    {
                        index: 2,
                        clienter:'深圳市成宏房地产经济有限公司',
                        content: '成宏地产',
                        saler:'朱强',
                        issueNum:'56',
                        issueDays: '156',
                        period: '2018/11/10 - 2019/11/08',
                    },
                    {
                        index: 3,
                        clienter:'深圳托趣钢琴培训中心',
                        content: '托趣',
                        saler:'朱强',
                        issueNum:'56',
                        issueDays: '156',
                        period: '2018/11/10 - 2019/11/08',
                    },
                    {
                        index: 4,
                        clienter:'深圳市梵净瑜伽美容有限公司',
                        content: '托趣',
                        saler:'朱强',
                        issueNum:'56',
                        issueDays: '156',
                        period: '2018/11/10 - 2019/11/08',
                    },
                    {
                        index: 5,
                        clienter:'深圳三合百盛广告传媒有限公司',
                        content: '皖厨（餐饮）',
                        saler:'洪霞',
                        issueNum:'56',
                        issueDays: '156',
                        period: '2018/11/10 - 2019/11/08',
                    },
                    {
                        index: 6,
                        clienter:'深圳平行线传媒有限公司',
                        content: '关键词教育',
                        saler:'张瑶',
                        issueNum:'22',
                        issueDays: '96',
                        period: '2018/11/10 - 2019/11/08',
                    },
                    {
                        index: 7,
                        clienter:'深圳市三酷体育文化有限公司',
                        content: '皖厨（餐饮）',
                        saler:'洪霞',
                        issueNum:'56',
                        issueDays: '156',
                        period: '2018/11/10 - 2019/11/08',
                    },
                ]
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
            sessionData(newVal,oldVal){
                console.log('newVal',newVal,'oldVal',oldVal)
                this.sessionData = newVal
            },
            selectCity(newVal,oldVal){
                this.selectCity = newVal
            },
            activeName(newVal,oldVal){
                this.activeName = newVal
                if(this.activeName === 'second'){
                    // 数据概览
                    this.initIssueReportBar()
                }
            }
        },
        mounted(){
            this.echartsListener();
        },
        methods:{
            // 统一监听
            echartsListener(){
                window.addEventListener("resize", ()=> {
                    // 数据总览
                    this.issueReportPieEcharts.resize();
                });
            },
            initIssueReportBar() {
                this.issueReportPieEcharts = this.$echarts.init(this.$refs.issueReportBar)
                let total = 0
                for (let key of this.issueReportPieData.data) {
                    total += key.value
                }
                this.issueReportPieEcharts.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return '<p style="background-color:#F4F6F6;font-size: 12px; color: #808080; width: 200px;height: 36px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;">' +
                                '<span>' + params.name + '</span>' +
                                '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px; margin-bottom: -20px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' + '数值' + '</span>' + params.value + '</p>' + '<br/>' +
                                '<p style="display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 32px;">' +
                                '<span><i style="display: inline-block; width: 6px; height: 6px; border-radius: 50%;background-color: #4AA6FC;margin-right: 5px"></i>' +
                                '占比' + '</span>' + params.percent + '%' +
                                '</p>'
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
                                    precent = parseFloat((key.value / total) * 100).toFixed(2) + '%'
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
</style>
