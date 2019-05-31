<script>
import echarts from 'echarts';
import { api } from '../../api/api';
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import { Message } from 'element-ui';

export default {
    props:{
        selectRes:{}
    },
    data(){
        return{
            date: '',
            allTrendData:[
                {
                    bdDay:"Aug 11, 2018",
                    bdID:2,
                    bdSDay:"Aug 11, 2018",
                    resID:228,
                    startDay:"2018/08/11",
                    totalCount:"2369"
                },
                {
                    bdDay:"Aug 12, 2018",
                    bdID:2,
                    bdSDay:"Aug 11, 2018",
                    resID:228,
                    startDay:"2018/08/12",
                    totalCount:"2369"
                },
                {
                    bdDay:"Aug 13, 2018",
                    bdID:2,
                    bdSDay:"Aug 11, 2018",
                    resID:228,
                    startDay:"2018/08/13",
                    totalCount:"2588"
                },
                {
                    bdDay:"Aug 14, 2018",
                    bdID:2,
                    bdSDay:"Aug 11, 2018",
                    resID:228,
                    startDay:"2018/08/14",
                    totalCount:"2569"
                }
            ],
            trendData: {
                timeArea: ["2018/08/11", "2018/08/12", "2018/08/13", "2018/08/14"],
                dataArr: [2369, 2369, 2588, 2569],
            }
        }
    },
    methods:{
        changeDate(date){
            console.log(date);
        },
        setTrend(){
            let humanTrend = echarts.init(this.$refs.humanTrend);
            let NewDataAxis = this.trendData.timeArea;
            let NewData = this.trendData.dataArr;
            let option = {
                color: ['#3398DB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function (params) {
                        let title = '';
                        let arr = [];
                        let Hstyle = 'background-color:#F4F6F6;font-size: 12px; width: 200px;height: 30px; display: flex; justify-content: space-between;padding: 0px 10px; align-items: center;box-sizing: border-box;margin-bottom: -20px;';
                        let bStyle = "display: flex; justify-content: space-between;padding: 0px 10px; box-sizing: border-box; align-items: center; font-size: 12px;color: #2C313C;height: 25px;";
                        let sstyle = "display: inline-block;width: 6px; height: 6px; border-radius: 50%;margin-right: 5px;";
                        for (let i = 0; i < params.length; i++) {
                            title = `<p style="${Hstyle}"><span>城市(${params[i].name})</span><span>数据</span></p><br/>`;
                            let data = `<p style="${bStyle}"><span><i style="${sstyle};background:${params[i].color}" ></i>${params[i].seriesName}</span>${params[i].value}</p>`;
                            if(i==2){
                                data = `<p style="${bStyle}"><span><i style="${sstyle};background:${params[i].color}" ></i>${params[i].seriesName}</span>${params[i].value/10}%</p>`;
                            }
                            arr.push(data);
                        }
                        let tooltip = arr.join('');
                        return title+tooltip
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
                    data:['人流量'],
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : NewDataAxis,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type: 'value',
                        name: '',
                        position: 'left',
                        show: true,
                        splitLine: {
                            lineStyle: {
                                color: "#E8E8E8",
                                type: "dashed"
                            }
                        }
                    },
                ],
                series : [
                    {
                        name:'人流量',
                        type:'line',
                        yAxis: 1,
                        itemStyle:{
                            normal:{
                                color:'#4AA6FC',
                            }
                        },
                        data:NewData
                    },
                ]
            };
            humanTrend.setOption(option);
            window.addEventListener("resize", function () {
                humanTrend.resize();
            });
        },
        getInitData(){
            // GetToTalCountInfo
            // resid[必填]        社区唯一标识
            // bdday[必填]        开始时间
            // bdsday[必填]       结束时间
            // uid[必填]          用户唯一标识
            // tooken[必填]       登陆凭证
            let session = JSON.parse(sessionStorage.getItem('session_data'));
            let startTime = dateFormat.toDate(this.selectRes.bdsday, '-');
            let endTime = dateFormat.toDate(this.selectRes.bdday, '-');
            console.log('this.selectResr+++++++', this.selectRes);
            let info = {};
            if(this.selectRes.resID){
                info = {
                    apid: sessionStorage.getItem('AD_apid'),
                    resid: this.selectRes.resID,
                    bdday: startTime,
                    bdsday: endTime,
                    uid: session.uID,
                    tooken: session.token
                };
            }else{
                info = {
                    apid: sessionStorage.getItem('AD_apid'),
                    bdday: startTime,
                    bdsday: endTime,
                    uid: session.uID,
                    tooken: session.token
                };
            }
            api.getApi(this.apiVar.QZhike+'/GetToTalCountInfo', info).then(res=>{
                console.log(res);
                if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }
                if(res.data.length){
                    let arr = res.data[0].totalCount.split(',');
                    let result = this.funcInit(arr);
                    this.allTrendData = result.resultArr;
                    this.trendData.timeArea = result.timeArea;
                    this.trendData.dataArr = result.dataArr;
                }
                this.setTrend();
            });
        },
        // 数据处理
        funcInit(arr){
            let result = {
                resultArr: [],
                timeArea: [],
                dataArr: []
            };
            result.timeArea = dateFormat.getDayAll(this.selectRes.bdsday, this.selectRes.bdday);
            for(let i = 0; i < arr.length; i++ ){
                arr[i] = parseInt(arr[i]);
                result.resultArr.push({
                    bdSDay: result.timeArea[0],
                    bdDay: result.timeArea[i],
                    totalCount: arr[i],
                    startDay: result.timeArea[i]
                });
            }
            result.dataArr = arr;
            console.log(result);
            return result;
        },
        // 导出excel
        export2Excel(name) {
            console.log('this.all', this.allTrendData);
            require.ensure([], () => {
                const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                const tHeader = ['时间', '人流量'];
                const filterVal = ['startDay', 'totalCount'];
                const list = this.allTrendData;
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, name);
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v =>
                filterVal.map(j => v[j])
            );
        },
        loginTimeout() {
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
        // 时间格式规范
        formatTime(val) {
            return dateFormat.toDate(val, "/");
        },
    },
    mounted(){
        console.log('selectRes-----------', this.selectRes);
        let apid = sessionStorage.getItem('AD_apid');
        if(apid){
            this.getInitData();
        }else{
            this.setTrend();
        }
    },
    watch:{
        selectRes(){
            console.log(this.selectRes);
            this.getInitData();
        },
    },
}
</script>
<template>
    <div>
        <div class="top">
            <h2>人流趋势: <span>{{formatTime(selectRes.bdsday)+'-'+formatTime(selectRes.bdday)}}</span></h2>
        </div>
        <div class="contain">
            <div class="trend_con">
                <div class="trend_top">
                    <h2>趋势图</h2>
                </div>
                <div id="humanTrend" ref="humanTrend" style="width: 100%;height: 380px;padding:10px 0px;"></div>
            </div>
            <div class="detail_data">
                <div class="detail_top">
                    <h2>详细数据
                        <el-button type="default" size="mini" class="button_type" @click="export2Excel('人流趋势')">导出数据<i class="el-icon-download el-icon--left"></i></el-button>
                    </h2>
                </div>
                <div class="table_box">
                    <el-table :data="allTrendData" style="width: 100%" border>
                        <el-table-column label="时间" prop="startDay"></el-table-column>
                        <el-table-column prop="totalCount" label="人流量" sortable>
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
.top h2, .trend_top h2, .detail_top h2{
    color: #2C313C;
    font-size: 16px;
    font-weight: bold;
}
.top h2 span{
    font-size: 12px;
    color: #A3A3A3;
    letter-spacing: 0;
    font-weight: normal;
}
.contain{
    /*margin-left: 210px;*/
    margin-left: 190px;
    /* width: 80%; */
    display: flex;
    margin-right: 30px;
}
.trend_con{
    margin: 20px auto;
    width: 70%;
    /* padding: 20px auto; */
    background: #fff;
    border: 1px solid #dedede;
}
.detail_data{
    margin: 20px auto;
    margin-left: 20px;
    width: 28.5%;
    /* padding: 20px; */
    background: #fff;
    border: 1px solid #dedede;
}
.trend_top, .detail_top{
    padding-left: 20px;
    border-bottom: 1px solid #dedede;
}
.trend_top h2, .detail_top h2{
    height: 40px;
    line-height: 40px;
}
.table_box{
    padding: 20px;
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

/deep/ .el-table__row td:nth-child(2),
/deep/ .has-gutter th:nth-child(2) {
    text-align: right;
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

.button_type{
    float: right;
    padding: 6px;
    margin: 6px;
}
</style>

