<template>
    <div class="clearfix">
        <div class="right-content-wrap">
            <div class="right-title">
                <h1>到访频次: <i>{{bdDay}}-{{edDay}}</i></h1>
            </div>
            <div class="right-content">
                <h1>到访频次占比</h1>
                <div class="percent-wrap">
                    <div class="pie-box">
                        <div class="pies onePie" ref="onePie"></div>
                        <ul>
                            <li>到访一次</li>
                            <li>人数</li>
                            <li>{{priceFormat(oneData[0].value)}}</li>
                        </ul>
                    </div>
                    <div class="pie-box">
                        <div class="pies twoPie" ref="twoPie"></div>
                        <ul>
                            <li>到访二次</li>
                            <li>人数</li>
                            <li>{{priceFormat(twoData[0].value)}}</li>
                        </ul>
                    </div>
                    <div class="pie-box">
                        <div class="pies threePie" ref="threePie"></div>
                        <ul>
                            <li>到访三次</li>
                            <li>人数</li>
                            <li>{{priceFormat(threeData[0].value)}}</li>
                        </ul>
                    </div>
                    <div class="pie-box">
                        <div class="pies fourPie" ref="fourPie"></div>
                        <ul>
                            <li>到访四次<p>及以上</p></li>
                            <li>人数</li>
                            <li>{{priceFormat(fourData[0].value)}}</li>
                        </ul>
                    </div>

                </div>

            </div>

        </div>
    </div>
</template>

<script>
    // 价格格式化
    import commaFormat from "../../commonFun/commaFormat.js";
    import api from "../../api/api.js";
    import timeFormat from '../../commonFun/timeFormat.js'

    export default {
        props: {
            selectRes: {}
        },
        name: "visitFrequency",
        data() {
            return {
                oneData: [
                    {name: '到访一次', value: 300},
                    {name: '其他', value:900},
                ],
                twoData: [
                    {name: '到访二次', value: 300},
                    {name: '其他', value: 900},
                ],
                threeData: [
                    {name: '到访三次', value: 300},
                    {name: '其他', value: 900},
                ],
                fourData: [
                    {name: '到访四次及以上', value: 300},
                    {name: '其他', value:900},
                ],
                bdDay: '2018-08-01',
                edDay: '2018-08-31',
            }
        },

        mounted() {
            let apid = sessionStorage.getItem('AD_apid');
            if(apid){
                this.getThcData();
            }else{
                this.onePie();
                this.twoPie();
                this.threePie();
                this.fourPie();
            }
        },
        watch:{
            selectRes(){
                this.getThcData();
            },
        },
        methods: {
            onePie() {
                let onePie = this.$echarts.init(this.$refs.onePie);
                onePie.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    series: [
                        {
                            name: '到访频次占比',
                            color: ['#0096FA', '#F0F2F5'],
                            type: 'pie',
                            radius: ['30%', '55%'],
                            center: ['50%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    lineStyle: {
                                        color: '#d3d3d3'
                                    }
                                },

                            },
                            data: this.oneData,

                        }

                    ],

                });
                window.addEventListener("resize", function () {
                    onePie.resize();
                });
            },
            twoPie() {
                let twoPie = this.$echarts.init(this.$refs.twoPie);
                twoPie.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },

                    series: [
                        {
                            name: '到访频次占比',
                            color: ['#0096FA', '#F0F2F5'],
                            type: 'pie',
                            radius: ['30%', '55%'],
                            center: ['50%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    lineStyle: {
                                        color: '#d3d3d3'
                                    }
                                },

                            },
                            data: this.twoData,

                        }

                    ],

                });
                window.addEventListener("resize", function () {
                    twoPie.resize();
                });
            },
            threePie() {
                let threePie = this.$echarts.init(this.$refs.threePie);
                threePie.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },

                    series: [
                        {
                            name: '到访频次占比',
                            color: ['#0096FA', '#F0F2F5'],
                            type: 'pie',
                            radius: ['30%', '55%'],
                            center: ['50%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    lineStyle: {
                                        color: '#d3d3d3'
                                    }
                                },

                            },
                            data: this.threeData,

                        }

                    ],

                });
                window.addEventListener("resize", function () {
                    threePie.resize();
                });
            },
            fourPie() {
                let fourPie = this.$echarts.init(this.$refs.fourPie);
                fourPie.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },

                    series: [
                        {
                            name: '到访频次占比',
                            color: ['#0096FA', '#F0F2F5'],
                            type: 'pie',
                            radius: ['30%', '55%'],
                            center: ['50%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true,
                                    lineStyle: {
                                        color: '#d3d3d3'
                                    }
                                },

                            },
                            data: this.fourData,

                        }

                    ],

                });
                window.addEventListener("resize", function () {
                    fourPie.resize();
                });
            },

            //获取数据
            getThcData() {
                let session = JSON.parse(sessionStorage.getItem('session_data'));
                this.bdDay = this.formatTime(this.selectRes.bdsday);
                this.edDay = this.formatTime(this.selectRes.bdday);
                console.log('this.selectResr+++++++', this.selectRes);
                let info = {};
                if (this.selectRes.resID) {
                    info = {
                        apid: sessionStorage.getItem('AD_apid'),
                        resid: this.selectRes.resID,
                        bdday: this.bdDay,
                        bdsday: this.edDay,
                        uid: session.uID,
                        tooken: session.token
                    };
                } else {
                    info = {
                        apid: sessionStorage.getItem('AD_apid'),
                        bdday: this.bdDay,
                        bdsday: this.edDay,
                        uid: session.uID,
                        tooken: session.token
                    };
                }
                api.getApi(this.apiVar.QZhike + '/GetTFre', info).then(res => {
                    console.log('GetTFre返回--', res.data);
                    for (let i in res.data) {
                        if (res.data[i].tFre) {
                            let tFres = res.data[i].tFre.split(',');
                            this.oneData[0].value += parseInt(tFres[0]);
                            this.twoData[0].value += parseInt(tFres[1]);
                            this.threeData[0].value += parseInt(tFres[2]);
                            this.fourData[0].value += parseInt(tFres[3]);
                        }
                    }

                    // arr.push(obj);
                    // console.log('累加数据----', arr);
                    this.oneData[1].value = this.twoData[0].value + this.threeData[0].value + this.fourData[0].value;
                    this.twoData[1].value = this.oneData[0].value + this.threeData[0].value + this.fourData[0].value;
                    this.threeData[1].value = this.oneData[0].value + this.twoData[0].value + this.fourData[0].value;
                    this.fourData[1].value = this.oneData[0].value + this.twoData[0].value + this.threeData[0].value;


                    // let tempArr = [];
                    // for (let i in arr[0]) {
                    //     tempArr.push(arr[0][i])
                    // }
                    // for (let i in tempArr) {
                    //     for (let j in this.pieData) {
                    //         if (i == j) {
                    //             this.pieData[j].value = tempArr[i]
                    //         }
                    //     }
                    // }

                    // console.log('表格数据---', this.detailData)
                    this.onePie();
                    this.twoPie();
                    this.threePie();
                    this.fourPie();
                })
            },
            // 价格加上逗号
            priceFormat(price) {
                // console.log('price', price);
                return commaFormat.format(price);
            },

            // 时间格式规范
            formatTime(val) {
                return timeFormat.toDate(val, "/");
            },
        }

    }
</script>

<style scoped>
    @font-face {
        font-family: DINPro-Medium;
        src: url("fonts/DINPro-Medium.otf"), url("fonts/DINPro-Medium.ttf");
    }

    @font-face {
        font-family: DINPro-Regular;
        src: url("fonts/DINPro-Regular.otf");
    }

    @font-face {
        font-family: DINCond-Bold;
        src: url("fonts/DINCond-Bold.otf");
    }

    .right-content-wrap {
        /*padding-left: 188px;*/
        padding-left: 165px;
        position: relative;
        /*padding-top: 62px;*/
    }

    .right-content-wrap .right-title {
        height: 44px;
        width: 100%;
        background-color: #fff;
        display: flex;
        padding: 12px 24px;
        border-bottom: 1px solid #DEDEDE;
        box-sizing: border-box;
        line-height: 18px;
    }

    .right-content-wrap h1 {
        font-weight: bold;
    }

    .right-content-wrap i {
        font-size: 12px;
        color: #A3A3A3;
        font-weight: normal;
        font-style: normal;
        margin-left: 10px;
    }

    .right-content {
        padding: 24px;
        width: 100%;
        box-sizing: border-box;
        position: relative;
    }

    .percent-wrap {
        width: 100%;
        height: 240px;
        border: 1px solid #dedede;
        background-color: #ffffff;
        display: flex;
        /*padding: 0 40px;*/
        box-sizing: border-box;
        justify-content: space-between;
    }

    .pie-box {
        position: relative;
        flex: 1;
    }

    .percent-wrap .pie-box:last-child {
        flex: 1.2;
    }

    .pie-box ul {
        position: absolute;
        top: 75px;
        right: 0;
    }

    .percent-wrap .pie-box:last-child ul {
        top: 60px;
        right: 15px;
    }

    .pie-box ul li:nth-child(1) {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.65);
        margin-bottom: 12px;
    }

    .pie-box ul li:nth-child(2) {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 8px;
    }

    .pie-box ul li:nth-child(3) {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.85);
    }

    .right-content h1 {
        border: 1px solid #dedede;
        border-bottom: none;
        background-color: #ffffff;
        line-height: 47px;
        padding-left: 16px;
        position: relative;
    }

    .data-title h1 {
        height: 55px;
        /* line-height: 55px; */
        display: flex;
        padding: 7px 20px;
        align-items: center;
        box-sizing: border-box;
        justify-content: space-between;
    }

    .data-title {
        position: relative;
    }

    .data-title button {

        position: absolute;
        right: 10px;
        z-index: 2;
    }

    .pies {
        width: 100%;
        height: 240px;
    }

    /*滚动条*/
    .detailData /deep/ .el-table__body-wrapper {
        height: 336px !important;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .detailData /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 4px;
        background: #fafafa;
    }

    .detailData /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    }

    .detailData /deep/ .el-table__footer {
        font-weight: bold;
    }

    .detailData /deep/ .has-gutter th:nth-child(3) .cell,
    .detailData /deep/ .has-gutter th:nth-child(2) .cell,
    .detailData /deep/ .has-gutter th:nth-child(4) .cell,
    .detailData /deep/ .has-gutter th:nth-child(5) .cell {
        text-align: right;
    }

    .detailData /deep/ .el-table__row td:nth-child(3) .cell,
    .detailData /deep/ .el-table__footer td:nth-child(3) .cell,
    .detailData /deep/ .el-table__row td:nth-child(2) .cell,
    .detailData /deep/ .el-table__footer td:nth-child(2) .cell,
    .detailData /deep/ .el-table__row td:nth-child(4) .cell,
    .detailData /deep/ .el-table__footer td:nth-child(4) .cell,
    .detailData /deep/ .el-table__row td:nth-child(5) .cell,
    .detailData /deep/ .el-table__footer td:nth-child(5) .cell {
        text-align: right;
        padding-right: 25px;
    }
    /*1920*/
    @media all and (min-width: 1900px) {

        .pies {
            width: 25%;
            height: 290px;
        }

        .costType .el-radio-group {
            width: 750px;
        }
    }
</style>
