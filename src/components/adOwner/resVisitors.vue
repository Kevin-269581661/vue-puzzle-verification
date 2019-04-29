<script>
import echarts from 'echarts';
export default {
    data(){
        return{
            date: '',
            allTrendData:[
                {Tid: 1, time: '2018/06/03',  visitor: 4545, visitor_tra: 12.55, resident: 1226, resident_tra: 12.02},
                {Tid: 2, time: '2018/06/04',  visitor: 4544, visitor_tra: 12.78, resident: 1223, resident_tra: 12.07},
                {Tid: 3, time: '2018/06/05',  visitor: 4546, visitor_tra: 12.45, resident: 1224, resident_tra: 12.03},
                {Tid: 4, time: '2018/06/06',  visitor: 4547, visitor_tra: 12.54, resident: 1228, resident_tra: 12.05},
                {Tid: 5, time: '2018/06/07',  visitor: 4548, visitor_tra: 12.89, resident: 1227, resident_tra: 12.06},
                {Tid: 5, time: '2018/06/07',  visitor: 4548, visitor_tra: 12.89, resident: 1227, resident_tra: 12.06},
                {Tid: 5, time: '2018/06/07',  visitor: 4548, visitor_tra: 12.89, resident: 1227, resident_tra: 12.06},
                {Tid: 5, time: '2018/06/07',  visitor: 4548, visitor_tra: 12.89, resident: 1227, resident_tra: 12.06},
                {Tid: 5, time: '2018/06/07',  visitor: 4548, visitor_tra: 12.89, resident: 1227, resident_tra: 12.06},
            ],
        }
    },
    methods:{
        changeDate(date){
            console.log(date);
        },
        setTrend(){
            let resVistors = echarts.init(this.$refs.resVistors);
            let dataAxis = ['2017/10/01','2017/10/09','2017/10/13','2017/10/17', '2017/10/21', '2017/10/25', '2017/10/29'];
            let data1 = [120, 132, 101, 134, 90, 230, 210];
            let data2 = [220, 182, 191, 234, 290, 330, 310];
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
                            title = `<p style="${Hstyle}"><span>数据(${params[i].name})</span><span>数量</span></p><br/>`;
                            let data = `<p style="${bStyle}"><span><i style="${sstyle};background:${params[i].color}" ></i>${params[i].seriesName}</span>${params[i].value}</p>`;
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
                    data:['居民','访客'],
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
                        data : dataAxis,
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
                        splitLine: {
                            lineStyle: {
                                color: "#E8E8E8",
                                type: "dashed"
                            }
                        }
                    },
                    {
                        type: 'value',
                        name: '',
                        min: 0,
                        max: 500,
                        position: 'right',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %'
                        },
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
                        name:'居民',
                        type:'line',
                        yAxis: 1,
                        itemStyle:{normal:{color:'#7ED321'}},
                        data:data1
                    },
                    {
                        name:'访客',
                        type:'line',
                        yAxisIndex: 1,
                        itemStyle:{normal:{color:'#F5A623'}},
                        data:data2
                    }
                ]
            };
            window.addEventListener('resize', function(){
                resVistors.resize();
            });
            resVistors.setOption(option);
        },
    },
    mounted(){
        this.setTrend();
    },
}
</script>
<template>
    <div>
        <div class="top">
            <h2>居民访客：<span>2018/04/12-2018/09/12</span></h2>
            <!-- <h2>居民访客：
                <el-date-picker size="small" v-model="date" type="daterange" range-separator="-" format="yyyy/MM/dd" value-format="yyyy/MM/dd" @change="changeDate">
                </el-date-picker>
            </h2> -->
        </div>
        <div class="contain">
            <div class="trend_con">
                <div class="trend_top">
                    <h2>趋势图</h2>
                </div>
                <div id="resVistors" ref="resVistors" style="width: 100%;height: 380px;padding:10px 0px;"></div>
            </div>
            <div class="detail_data">
                <div class="detail_top">
                    <h2>详细数据</h2>
                </div>
                <div class="table_box">
                    <el-table :data="allTrendData" show-summary border style="width: 100%">
                        <el-table-column prop="time" label="时间">
                        </el-table-column>
                        <el-table-column prop="visitor" label="访客" sortable>
                        </el-table-column>
                        <el-table-column prop="visitor_tra" label="访客比例" sortable>
                            <template slot-scope="scope">
                                <span>{{scope.row.visitor_tra}}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="resident" label="居民" sortable>
                        </el-table-column>
                        <el-table-column prop="resident_tra" label="居民比例" sortable>
                            <template slot-scope="scope">
                                <span>{{scope.row.resident_tra}}%</span>
                            </template>
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
    padding-left: 170px;
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
    margin-left: 145px;
    /* width: 80%; */
    margin-right: 30px;
}
.trend_con{
    margin: 20px auto;
    /* padding: 20px auto; */
    background: #fff;
    border: 1px solid #dedede;
}
.detail_data{
    margin: 20px auto;
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
/deep/ .el-table__row td:nth-child(3),
/deep/ .el-table__row td:nth-child(4),
/deep/ .el-table__row td:nth-child(5),
/deep/ .has-gutter th:nth-child(2),
/deep/ .has-gutter th:nth-child(3),
/deep/ .has-gutter th:nth-child(4),
/deep/ .has-gutter th:nth-child(5){
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
</style>

