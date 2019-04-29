<template>
    <div>
        <div :id="id" :style="{ height: size.height + 'px' }"></div>
    </div>
</template>
<script>
    export default {
        props:{
            data:{
                default: [],
                type: Array
            },
            name: {
                default: [],
                type: Array
            },
            id:{
                default: 'idbar',
                type: String
            },
            // 自定义大小
            size: {
                default: function(){
                    return {
                        width: 350,
                        height: 350
                    }
                },
                type: Object
            },
        },
        data(){
            return{
                ChartLineGraph: null,
            }
        },
        methods:{
            expenseTrend(){
                let ageTrend = this.$echarts.init(document.getElementById(this.id));
                let dataAxis = this.name;
                let data1 = this.data;
                let option = {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                            return title+tooltip
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
                            type : 'value',
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
                        }
                    ],
                    series : [
                        {
                            name:'社区人流',
                            type:'bar',
                            barWidth: '16%',
                            yAxis: 1,
                            itemStyle:{normal:{color:'#4AA6FC'}},
                            data:data1
                        }
                    ]
                };
                ageTrend.setOption(option);
                window.addEventListener("resize", function () {
                    ageTrend.resize();
                });
            },
        },
        mounted(){
            this.expenseTrend();
        },
        watch:{
            data(){
                this.expenseTrend();
            },
        },

        methods:{
            drawLineGraph(id, data){
                let _this = this;
                let myChart = document.getElementById(id);
                let dataAxis = this.name;
                let data1 = this.data;
                let option = {
                    color: ['#3398DB'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
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
                            return title+tooltip
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
                            type : 'value',
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
                        }
                    ],
                    series : [
                        {
                            name:'社区人流',
                            type:'bar',
                            barWidth: '16%',
                            yAxis: 1,
                            itemStyle:{normal:{color:'#4AA6FC'}},
                            data:data1
                        }
                    ]
                };
                this.ChartLineGraph = this.$echarts.init(myChart);
                this.ChartLineGraph.setOption(option);
                this.ChartLineGraph.resize();
                window.addEventListener('resize', function(){
                    _this.ChartLineGraph.resize();
                });
            },
        },
        beforeDestroy(){
            if(this.ChartLineGraph){
                this.ChartLineGraph.clear();
            }
        },
        mounted(){
            this.drawLineGraph(this.id, this.data);
        },
        watch:{
            data:{
                handler(newVal, oldVal){
                    this.drawLineGraph(this.id, newVal);
                },
                deep: true
            },
        },
    }
</script>
<style scoped>
</style>

