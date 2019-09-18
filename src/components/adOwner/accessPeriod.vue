<script>
    import echarts from 'echarts';
    import api from "../../api/api.js";
    import timeFormat from '../../commonFun/timeFormat.js'
    import commaFormat from '../../commonFun/commaFormat.js'
    import sessFun from '../../commonFun/sessFun.js'

    export default {
        props:{
            selectRes:{}
        },
        data() {
            return {
                // 登录信息
                sessionData:{},
                date: '',
                allTrendData: [
                    {Tid: 1, time: '00:00', human_tra: 4545},
                    {Tid: 2, time: '01:00', human_tra: 12315},
                    {Tid: 3, time: '02:00', human_tra: 7845},
                    {Tid: 4, time: '03:00', human_tra: 7956},
                    {Tid: 5, time: '04:00', human_tra: 79646},
                    {Tid: 6, time: '05:00', human_tra: 4545},
                    {Tid: 7, time: '06:00', human_tra: 12315},
                    {Tid: 8, time: '07:00', human_tra: 7845},
                    {Tid: 9, time: '08:00', human_tra: 7956},
                    {Tid: 10, time: '09:00', human_tra: 7964},
                    {Tid: 11, time: '10:00', human_tra: 79646},
                    {Tid: 12, time: '11:00', human_tra: 12315},
                    {Tid: 13, time: '12:00', human_tra: 7845},
                    {Tid: 14, time: '13:00', human_tra: 7956},
                    {Tid: 15, time: '14:00', human_tra: 79646},
                    {Tid: 16, time: '15:00', human_tra: 4545},
                    {Tid: 17, time: '16:00', human_tra: 12315},
                    {Tid: 18, time: '17:00', human_tra: 7845},
                    {Tid: 19, time: '18:00', human_tra: 7956},
                    {Tid: 20, time: '19:00', human_tra: 79646},
                    {Tid: 21, time: '20:00', human_tra: 79646},
                    {Tid: 22, time: '21:00', human_tra: 79646},
                    {Tid: 23, time: '22:00', human_tra: 79646},
                    {Tid: 24, time: '23:00', human_tra: 79646},
                ],
                data1:  [120, 200, 150, 80, 70, 110, 130,120, 200, 150, 80, 70, 110, 130,120, 200, 150, 80, 70, 110, 130,240,120,90],
                bdDay: '2018-08-01',
                edDay: '2018-08-31',
            }
        },
        methods: {
            changeDate(date) {
                console.log(date);
            },
            setTrend() {
                let accessPeriod = echarts.init(this.$refs.accessPeriod);
                let dataAxis = ['00-01', '01-02', '02-03', '03-04', '04-05', '05-06', '06-07', '07-08', '08-09', '09-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'];
                let data1 = this.data1;
                let option = {
                    color: ['#3398DB'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params) {
                            // console.log(params[0]);
                            let title = '';
                            let arr = [];
                            let Hstyle = 'background-color:#F4F6F6;font-size: 12px; width: 200px;height: 30px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;';
                            let bStyle = "display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 25px;";
                            let sstyle = "display: inline-block;width: 6px; height: 6px; border-radius: 50%;margin-right: 5px;";
                            for (let i = 0; i < params.length; i++) {
                                title = `<p style="${Hstyle}"><span>数据(${params[i].name})</span><span>数量</span></p><br/>`;
                                let data = `<p style="${bStyle}"><span><i style="${sstyle};background:${params[i].color}" ></i>${params[i].seriesName}</span>${params[i].value}</p>`;
                                arr.push(data);
                            }
                            let tooltip = arr.join('');
                            return title + tooltip
                        },
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#dedede',
                        borderWidth: 1,
                        padding: 0,
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: dataAxis,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            splitLine: {
                                lineStyle: {
                                    color: "#E8E8E8",
                                    type: "dashed"
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '人流量',
                            type: 'bar',
                            barWidth: '45%',
                            yAxis: 1,
                            itemStyle: {normal: {color: '#4AA6FC'}},
                            data: data1
                        }
                    ]
                };
                accessPeriod.setOption(option);
                window.addEventListener("resize", function () {
                    accessPeriod.resize();
                });
            },
            //获取数据
            getThcData() {
                let barArr = [];
                let session = this.sessionData;
                this.bdDay = this.formatTime(this.selectRes.bdsday);
                this.edDay = this.formatTime(this.selectRes.bdday);
                console.log('this.selectResr+++++++', this.selectRes);
                let info = {};
                if(this.selectRes.resID){
                    info = {
                        apid: sessionStorage.getItem('AD_apid'),
                        resid: this.selectRes.resID,
                        bdday:  this.bdDay,
                        bdsday:  this.edDay,
                        uid: session.uID,
                        tooken: session.token
                    };
                }else{
                    info = {
                        apid: sessionStorage.getItem('AD_apid'),
                        bdday:  this.bdDay,
                        bdsday:  this.edDay,
                        uid: session.uID,
                        tooken: session.token
                    };
                }
                let arr = [];
                let obj = {A:0, B:0, C:0, D:0,E:0,F:0,G:0,H:0,I:0,J:0,K:0,L:0,M:0,N:0,O:0,P:0,Q:0,R:0,S:0,T:0,U:0,V:0,W:0,X:0,};
                api.getApi(this.apiVar.QZhike + '/GetThc', info).then(res => {
                    console.log('getThc返回--', res.data);
                    if(res.data){
                        for (let i in res.data) {
                            if(res.data[i].tHC){
                                let tHCs = res.data[i].tHC.split(',');
                                obj.A+=parseInt(tHCs[0])
                                obj.B+=parseInt(tHCs[1])
                                obj.C+=parseInt(tHCs[2])
                                obj.D+=parseInt(tHCs[3])
                                obj.E+=parseInt(tHCs[4])
                                obj.F+=parseInt(tHCs[5])
                                obj.G+=parseInt(tHCs[6])
                                obj.H+=parseInt(tHCs[7])
                                obj.I+=parseInt(tHCs[8])
                                obj.J+=parseInt(tHCs[9])
                                obj.K+=parseInt(tHCs[10])
                                obj.L+=parseInt(tHCs[11])
                                obj.M+=parseInt(tHCs[12])
                                obj.N+=parseInt(tHCs[13])
                                obj.O+=parseInt(tHCs[14])
                                obj.P+=parseInt(tHCs[15])
                                obj.Q+=parseInt(tHCs[16])
                                obj.R+=parseInt(tHCs[17])
                                obj.S+=parseInt(tHCs[18])
                                obj.T+=parseInt(tHCs[19])
                                obj.U+=parseInt(tHCs[20])
                                obj.V+=parseInt(tHCs[21])
                                obj.W+=parseInt(tHCs[22])
                                obj.X+=parseInt(tHCs[23])
                            }
                        }
                        arr.push(obj);
                        console.log('thcs---', arr);
                        for(let i in arr[0]){
                            barArr.push(arr[0][i])
                        }
                        this.data1 = barArr;
                        console.log('this.data1----', this.data1)
                        let allTrendData = this.allTrendData;
                        for (let i in this.data1) {
                            for (let j in allTrendData) {
                                if (i == j) {
                                    allTrendData[j].human_tra = this.data1[i]
                                    break
                                }
                            }
                        }
                        console.log('数据', allTrendData);
                        this.setTrend();
                    }

                })
            },
            // 导出excel
            export2Excel() {
                let name = '总览-访问时段';
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                    const tHeader = ['时间', '人流量'];
                    const filterVal = ['time', 'human_tra'];
                    const list = this.allTrendData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, name);
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => (j=='hPrice')?(v[j]/100):v[j]))
            },
            // 时间格式规范
            formatTime(val) {
                return timeFormat.toDate(val, "/");
            },
        },
        mounted() {
            let apid = sessionStorage.getItem('AD_apid');
            this.sessionData = sessFun.getSess();
            if(apid){
                // this.getComm();
                // this.areaMap();
                this.getThcData();
            }else{
                this.setTrend();
            }

        },
        watch:{
            selectRes(){
                this.getThcData();
            },
        },
    }
</script>
<template>
    <div>
        <div class="top">
            <h2>访问时段: <span>{{bdDay}}-{{edDay}}</span></h2>
            <!-- <h2>访问时段：
                <el-date-picker size="small" v-model="date" type="daterange" range-separator="-" format="yyyy/MM/dd" value-format="yyyy/MM/dd" @change="changeDate">
                </el-date-picker>
            </h2> -->
        </div>
        <div class="contain">
            <div class="trend_con">
                <div class="trend_top">
                    <h2>趋势图</h2>
                </div>
                <div id="accessPeriod" ref="accessPeriod" style="width: 100%;height: 380px;padding:10px 0px;"></div>
            </div>
            <div class="detail_data">
                <div class="detail_top">
                    <h2>详细数据
                        <el-button type="default" size="mini" class="button_type" @click="export2Excel()">下载数据<i
                            class="el-icon-download el-icon--left"></i></el-button>
                    </h2>
                </div>
                <div class="table_box">
                    <el-table :data="allTrendData" show-summary border style="width: 100%">
                        <el-table-column prop="time" label="时间">
                        </el-table-column>
                        <el-table-column prop="human_tra" label="人流量" sortable>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>

    .top:after {
        clear: both;
        content: " ";
        display: table;
    }

    .top {
        /*padding-left: 210px;*/
        padding-left: 190px;
        background: #fff;
        height: 44px;
        display: flex;
        width: 100%;
        box-sizing: border-box;
        line-height: 44px;
        border-bottom: 1px solid #dedede;
    }

    .top h2, .trend_top h2, .detail_top h2 {
        color: #2C313C;
        font-size: 16px;
        font-weight: bold;
    }

    .top h2 span {
        font-size: 12px;
        color: #A3A3A3;
        letter-spacing: 0;
        font-weight: normal;
    }

    .contain {
        /*margin-left: 189px;*/
        margin-left: 165px;
        /* width: 80%; */
        display: flex;
        /*margin-right: 30px;*/
        padding: 24px;
        justify-content: space-between;
    }

    .trend_con {
        /*margin: 20px auto;*/
        /* padding: 20px auto; */
        width: 70%;
        background: #fff;
        border: 1px solid #dedede;
    }

    .detail_data {
        /*margin: 20px auto;*/
        margin-left: 20px;
        /* padding: 20px; */
        width: 28.5%;
        background: #fff;
        border: 1px solid #dedede;
    }

    .trend_top, .detail_top {
        /*padding-left: 20px;*/
        border-bottom: 1px solid #dedede;
    }

    .trend_top h2, .detail_top h2 {
        height: 55px;
        /* line-height: 55px; */
        display: flex;
        padding: 7px 20px;
        align-items: center;
        box-sizing: border-box;
        justify-content: space-between;
    }

    .table_box {
        padding: 20px;
    }

    .left_content {
        padding-top: 60px;
    }

    /*表格*/
    /deep/ .el-table th,
    .el-table tr {
        height: 44px;
        padding: 0;
        background-color: #f7f7f7;
    }

    /deep/ .el-table td {
        padding: 8px 0;
        overflow-x: hidden;
        text-overflow: ellipsis;
    }

    .table_box /deep/ .el-table td:nth-of-type(2),
    .table_box /deep/ .has-gutter th:nth-of-type(2) {
        text-align: right;
    }

    /deep/ .el-table--border {
        border-radius: 4px;
    }

    /deep/ .el-table th > .cell {
        font-size: 14px;
        color: #666666;
        font-weight: bold;
    }

    /deep/ .el-table .caret-wrapper {
        width: 22px;
    }

    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #ecf5ff;
    }

    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        height: 320px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 4px;
        background: #fafafa;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    }

    /*超出省略*/
    /deep/ .el-table .cell {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 20px;
    }

    /*筛选*/
    /deep/ .el-table__column-filter-trigger {
        margin-left: 10px;
    }

    /deep/ .el-table th > .cell.highlight {
        color: #409eff !important;
    }

    /deep/ div.el-table-filter {
        left: 1106px !important;
    }

    .button_type {
        /*float: right;*/
        margin: 6px;
    }
</style>

