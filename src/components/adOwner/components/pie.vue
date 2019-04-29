<template>
    <div>
        <div :id="id" :style="{ height: size.height + 'px' }"></div>
    </div>
</template>
<script>
    export default {
        props:{
            // data:{
            //     default: {},
            //     type: Object
            // },
            data:{
                default: [],
                type: Array
            },
            id:{
                default: 'id1',
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
            drawLineGraph(id, data){
                let _this = this;
                let myChart = document.getElementById(id);
                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },

                    series: [
                        {
                            name: '购车阶段',
                            color: ['#F04864', '#1890FF', '#13C2C2 ', '#2FC25B', '#F0B148'],
                            type: 'pie',
                            radius: ['40%', '55%'],
                            center: ['50%', '50%'],
                            label: {
                                normal: {
                                    show: true,
                                    formatter: function (params) {
                                        return params.name + '\n' + '(' + params.percent + '%)'
                                    },
                                    color: '#2C313C',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                },
                                emphasis: {
                                    show: true,
                                },
                            },

                            labelLine: {
                                normal: {
                                    show: true,
                                    lineStyle: {
                                        color: '#d3d3d3'
                                    }
                                },

                            },
                            data: data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
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
