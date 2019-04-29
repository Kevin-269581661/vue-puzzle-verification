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
            progress:50,
            carOwn: 30,
            eduction: [
                {value:35, name:'高中及以下'},
                {value:40, name:'大专'},
                {value:25, name:'本科以上'}
            ],
            expense: [
                {value:33, name:'高'},
                {value:40, name:'中'},
                {value:27, name:'低'},
            ],
            year: {
                label: ['18岁以下', '18-24岁', '25-34岁', '35-44岁', '45-54岁', '55-64岁', '65岁以上'],
                dataValue: [11, 10, 25, 29, 20, 4, 1]
            },
            home: [
                {value:33, name:'学生'},
                {value:40, name:'家有小孩'},
                {value:11, name:'其他'},
            ],
            profess: {
                label: ['生产操作人员', '文职人员', '专业技术人员', '管理者和企业主', '个体经营者', '服务人员'],
                dataValue: [12, 16, 36, 28, 20, 11]
            },
        }
    },
    methods:{
        setTrend(){
            let ageTrend = echarts.init(this.$refs.ageTrend);
            let dataAxis = this.year.label;
            let data1 = this.year.dataValue;
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
        professTrend(){
            let professTrend = echarts.init(this.$refs.professTrend);
            let dataAxis = this.profess.label;
            let data1 = this.profess.dataValue;
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
            professTrend.setOption(option);
            window.addEventListener("resize", function () {
                professTrend.resize();
            });
        },
        educationTrend(){
            let education = echarts.init(this.$refs.education);
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)",
                    confine: true
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data:[]
                    // data:['本科及以上', '大专', '高中及以下', '其他']
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['40%', '55%'],
                        color: [
                            "#1890FF",
                            "#13C2C2",
                            "#2FC25B",
                            "#F04864"
                        ],
                        // label: {
                        //     normal: {
                        //         formatter: '{c}\n{b|{b}}',
                        //         rich: {
                        //             b: {
                        //                 fontSize: 12,
                        //                 lineHeight: 23,
                        //             },
                        //         }
                        //     }
                        // },
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
                        data: this.eduction
                    }
                ]
            };

            education.setOption(option);
            window.addEventListener("resize", function () {
                education.resize();
            });
        },
        expenseTrend(){
            let expense = echarts.init(this.$refs.expense);
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: [],
                    // data:['高', '中', '低']
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['40%', '55%'],
                        color: [
                            "#1890FF",
                            // "#13C2C2",
                            "#2FC25B",
                            "#F04864"
                        ],
                        // label: {
                        //     normal: {
                        //         formatter: '{c}\n{b|{b}}',
                        //         rich: {
                        //             b: {
                        //                 fontSize: 12,
                        //                 lineHeight: 23,
                        //             },
                        //         }
                        //     }
                        // },
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    return params.name + '\n' + '(' + params.percent + '%)'
                                },
                                color: '#2C313C',
                                align: 'center',
                                verticalAlign: 'middle'
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
                        data:this.expense
                    }
                ]
            };
            expense.setOption(option);
            window.addEventListener("resize", function () {
                expense.resize();
            });
        },
        homeTrend(){
            let home = echarts.init(this.$refs.home);
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: [],
                    // data:['高', '中', '低']
                },
                series: [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius: ['40%', '55%'],
                        color: [
                            "#1890FF",
                            // "#13C2C2",
                            "#2FC25B",
                            "#F04864"
                        ],
                        // label: {
                        //     normal: {
                        //         formatter: '{c}\n{b|{b}}',
                        //         rich: {
                        //             b: {
                        //                 fontSize: 12,
                        //                 lineHeight: 23,
                        //             },
                        //         }
                        //     }
                        // },
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    return params.name + '\n' + '(' + params.percent + '%)'
                                },
                                color: '#2C313C',
                                align: 'center',
                                verticalAlign: 'middle'
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
                        data:this.home
                    }
                ]
            };
            home.setOption(option);
            window.addEventListener("resize", function () {
                home.resize();
            });
        },
        getInitData(){
            // GetTPPT
            // resid[必填]        社区唯一标识
            // bdday[必填]        开始时间
            // bdsday[必填]       结束时间
            // uid[必填]          用户唯一标识
            // tooken[必填]       登陆凭证

            let dataALL = [
                {
                    resName: "清河文苑",
                    tPPT: '{"1":[{"tag":"男","ratio":0.5832},{"tag":"女","ratio":0.4168}],"2":[{"tag":"18岁以下","ratio":0.0403},{"tag":"18-24岁","ratio":0.2739},{"tag":"25-34岁","ratio":0.3441},{"tag":"35-44岁","ratio":0.2012},{"tag":"45-54岁","ratio":0.122},{"tag":"55-64岁","ratio":0.0162},{"tag":"65岁以上","ratio":0.0023}],"3":[{"tag":"高中及以下","ratio":0.4408},{"tag":"大专","ratio":0.2849},{"tag":"本科及以上","ratio":0.2743}],"5":[{"tag":"高","ratio":0.3815},{"tag":"中","ratio":0.3306},{"tag":"低","ratio":0.2879}],"8":[{"tag":"已婚","ratio":0.5474},{"tag":"未婚","ratio":0.4526}],"9":[{"tag":"学生","ratio":0.0505},{"tag":"家有小孩","ratio":0.0999}]}',
                    mallID: 1,
                    bdDay: "Aug 11, 2018",
                    resID: 12291,
                    resCounty: "南海区",
                    resCity: "佛山市"
                },
                {
                    resName: "清河文苑",
                    tPPT: '{"1":[{"tag":"男","ratio":0.5832},{"tag":"女","ratio":0.4168}],"2":[{"tag":"18岁以下","ratio":0.0403},{"tag":"18-24岁","ratio":0.2739},{"tag":"25-34岁","ratio":0.3441},{"tag":"35-44岁","ratio":0.2012},{"tag":"45-54岁","ratio":0.122},{"tag":"55-64岁","ratio":0.0162},{"tag":"65岁以上","ratio":0.0023}],"3":[{"tag":"高中及以下","ratio":0.4408},{"tag":"大专","ratio":0.2849},{"tag":"本科及以上","ratio":0.2743}],"5":[{"tag":"高","ratio":0.3815},{"tag":"中","ratio":0.3306},{"tag":"低","ratio":0.2879}],"8":[{"tag":"已婚","ratio":0.5474},{"tag":"未婚","ratio":0.4526}],"9":[{"tag":"学生","ratio":0.0505},{"tag":"家有小孩","ratio":0.0999}]}',
                    mallID: 1,
                    bdDay: "Aug 24, 2018",
                    resID: 12291,
                    resCounty: "南海区",
                    resCity: "佛山市"
                }
            ];
            let session = JSON.parse(sessionStorage.getItem('session_data'));
            let startTime = this.formatTime(this.selectRes.bdsday);
            let endTime = this.formatTime(this.selectRes.bdday);
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

            // let arr = dataALL;
            // let ininInfo = [];
            // for(let data of arr){
            //     let initData = JSON.parse(data.tPPT);
            //     let init = initData['1'].concat(initData['2']).concat(initData['3']).concat(initData['5']);
            //     ininInfo.push(init);

            // }
            // let allData = this.manaGeDataInit(ininInfo);
            // this.progress = ((allData[0].value)*100).toFixed(2);
            // this.year.dataValue = [allData[2].value, allData[3].value, allData[4].value, allData[5].value, allData[6].value, allData[7].value, allData[8].value]
            // this.eduction = [allData[9], allData[10], allData[11]];
            // this.expense = [allData[12], allData[13], allData[14]];
            // this.setTrend();
            // this.professTrend();
            // this.educationTrend();
            // this.expenseTrend();


            api.getApi(this.QZhike+'/GetTPPT', info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }
                if(res.data.length){
                    let arr = res.data;
                    let ininInfo = [];
                    for(let data of arr){
                        let initData = JSON.parse(data.tPPT);
                        let init = initData['1'].concat(initData['2']).concat(initData['3']).concat(initData['5']).concat(initData['8']).concat(initData['9']);
                        ininInfo.push(init);
                    }
                    console.log(ininInfo);
                    let allData = this.manaGeDataInit(ininInfo);
                    this.progress = ((allData[0].value)*100).toFixed(2);
                    this.year.dataValue = [allData[2].value, allData[3].value, allData[4].value, allData[5].value, allData[6].value, allData[7].value, allData[8].value]
                    this.eduction = [allData[9], allData[10], allData[11]];
                    this.expense = [allData[12], allData[13], allData[14]];
                    this.carOwn = ((allData[15].value)*100).toFixed(2);
                    let other = {
                        name: '其他',
                        value: (1-allData[17].value-allData[18].value).toFixed(4)
                    }
                    this.home = [allData[17], allData[18], other];
                }
                this.setTrend();
                // this.professTrend();
                this.educationTrend();
                this.expenseTrend();
                this.homeTrend();
            });
        },
        manaGeDataInit(dataArr){
            let allNum = {
                A:0,
                B:0,
                C:0,
                D:0,
                E:0,
                F:0,
                G:0,
                H:0,
                I:0,
                J:0,
                K:0,
                L:0,
                M:0,
                N:0,
                O:0,
                R:0,
                S:0,
                T:0,
                U:0
            };
            for(let data of dataArr){
                allNum.A+=data[0].ratio;
                allNum.B+=data[1].ratio;
                allNum.C+=data[2].ratio;
                allNum.D+=data[3].ratio;
                allNum.E+=data[4].ratio;
                allNum.F+=data[5].ratio;
                allNum.G+=data[6].ratio;
                allNum.H+=data[7].ratio;
                allNum.I+=data[8].ratio;
                allNum.J+=data[9].ratio;
                allNum.K+=data[10].ratio;
                allNum.L+=data[11].ratio;
                allNum.M+=data[12].ratio;
                allNum.N+=data[13].ratio;
                allNum.O+=data[14].ratio;
                allNum.R+=data[15].ratio;
                allNum.S+=data[16].ratio;
                allNum.T+=data[17].ratio;
                allNum.U+=data[18].ratio;
            }
            let dataInfo = [
                {name: '男', value: 0},
                {name: '女', value: 0},

                {name: '18岁以下', value: 0},
                {name: '18-24岁', value: 0},
                {name: '25-34岁', value: 0},
                {name: '35-44岁', value: 0},
                {name: '45-54岁', value: 0},
                {name: '55-64岁', value: 0},
                {name: '65岁以上', value: 0},

                {name: '高中及以下', value: 0},
                {name: '大专', value: 0},
                {name: '本科及以上', value: 0},

                {name: '高', value: 0},
                {name: '中', value: 0},
                {name: '低', value: 0},

                {name: '已婚', value: 0},
                {name: '未婚', value: 0},

                {name: '学生', value: 0},
                {name: '家有小孩', value: 0},
            ];
            console.log('dataArr', dataArr);
            let len = dataArr.length;
            for(let i=0;i< dataInfo.length; i++){
                dataInfo[0].value = (allNum.A/len).toFixed(4);
                dataInfo[1].value = (allNum.B/len).toFixed(4);
                dataInfo[2].value = (allNum.C/len).toFixed(4);
                dataInfo[3].value = (allNum.D/len).toFixed(4);
                dataInfo[4].value = (allNum.E/len).toFixed(4);
                dataInfo[5].value = (allNum.F/len).toFixed(4);
                dataInfo[6].value = (allNum.G/len).toFixed(4);
                dataInfo[7].value = (allNum.H/len).toFixed(4);
                dataInfo[8].value = (allNum.I/len).toFixed(4);
                dataInfo[9].value = (allNum.J/len).toFixed(4);
                dataInfo[10].value = (allNum.K/len).toFixed(4);
                dataInfo[11].value = (allNum.L/len).toFixed(4);
                dataInfo[12].value = (allNum.M/len).toFixed(4);
                dataInfo[13].value = (allNum.N/len).toFixed(4);
                dataInfo[14].value = (allNum.O/len).toFixed(4);
                dataInfo[15].value = (allNum.R/len).toFixed(4);
                dataInfo[16].value = (allNum.S/len).toFixed(4);
                dataInfo[17].value = (allNum.T/len).toFixed(4);
                dataInfo[18].value = (allNum.U/len).toFixed(4);
            }
            console.log(dataInfo);
            return dataInfo;
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
        // this.getInitData();
        let apid = sessionStorage.getItem('AD_apid');
        if(apid){
            this.getInitData();
        }else{
            this.setTrend();
        }
        // this.setTrend();
        // this.professTrend();
        // this.educationTrend();
        // this.expenseTrend();
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
            <h2>住户属性: <span class="date">{{formatTime(selectRes.bdsday)+'-'+formatTime(selectRes.bdday)}}</span>
            </h2>
        </div>
        <div class="contain">
            <!-- 头部 -->
            <div class="contain_top">
                <div class="con_left">
                    <h2>性别比例</h2>
                    <div class="percent">
                        <p class="img_box"><span>男</span><img src="../../assets/images/boy.png" alt="" ></p>
                        <div class="progressContainer">
                            <div class="progress" :style="{width:progress+'%'}">
                                <b :style="{left:progress+'%'}">{{progress}}%</b>
                            </div>
                        </div>
                        <p class="img_box girl"><img src="../../assets/images/girl.png" alt="" ><span>女</span></p>
                    </div>
                </div>
                <div class="con_right">
                    <h2>婚姻情况</h2>
                    <div class="car_info">
                        <p class="car_box car1"><img src="../../assets/images/lucky.png" alt="" ></p>
                        <p class="text_box"><span>{{carOwn}}%</span> : <span>{{(100-carOwn).toFixed(2)}}%</span></p>
                        <p class="car_box"><img src="../../assets/images/unluck.png" alt="" ></p>
                    </div>
                </div>
            </div>
            <!-- 中部 -->
            <div class="contain_mid">
                <div class="con_left">
                    <h2>年龄分布</h2>
                    <div id="ageTrend" ref="ageTrend" style="width: 100%;height: 280px;padding:10px 0px;"></div>
                </div>
                <div class="con_right">
                    <h2>学历分布</h2>
                    <div id="education" ref="education" style="width: 100%;height: 280px;padding:10px 0px;"></div>
                </div>
            </div>
            <!-- 尾部 -->
            <div class="contain_foot">
                <div class="con_left">
                    <div style="display:flex">
                        <div style="width:50%">
                            <h2>消费水平</h2>
                            <div id="expense" ref="expense" style="width: 100%;height: 280px;padding:10px 0px;"></div>
                        </div>
                        <div style="width:50%">
                            <h2>家庭情况</h2>
                            <div id="home" ref="home" style="width: 100%;height: 280px;padding:10px 0px;"></div>
                        </div>
                    </div>
                    <!-- <h2>职业分布</h2> -->
                    <!-- <div id="professTrend" ref="professTrend" style="width: 100%;height: 280px;padding:10px 0px;"></div> -->
                </div>
                <!-- <div class="con_right">
                    <h2>消费水平</h2>
                    <div id="expense" ref="expense" style="width: 100%;height: 280px;padding:10px 0px;"></div>
                </div> -->
            </div>
        </div>
    </div>
</template>
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
    .top h2{
        color: #2C313C;
        font-size: 16px;
        font-weight: bold;
    }
    .top .date{
        font-size: 12px;
        color: #A3A3A3;
        letter-spacing: 0;
        font-weight: normal;
    }
    .types{
        margin-left: 20px;
    }
    .contain{
        /*margin-left: 210px;*/
        margin-left: 190px;
        /* width: 80%; */
        margin-right: 30px;
    }
    .contain_top{
        height: 156px;
        /* margin-top: 20px; */
        margin: 22px auto;
        display: flex;
    }
    .con_left{
        width: 65%;
        height: 100%;
        margin-right: 30px;
        overflow: hidden;
        background: #fff;
        border: 1px solid #dedede;
    }
    .con_left h2, .con_right h2{
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding-left: 20px;
        border-bottom: 1px solid #dedede;
        color: #2C313C;
        font-size: 16px;
        font-weight: bold;
    }
    .con_right{
        width: 33%;
        height: 100%;
        overflow: hidden;
        background: #fff;
        border: 1px solid #dedede;
    }
    .contain_mid, .contain_foot{
        height: 336px;
        /* border: 1px solid #dedede; */
        margin: 30px auto;
        display: flex;
        /* background: #fff; */
    }

    .percent{
        height: 116px;
        line-height: 116px;
        margin: 0 40px;
        display: flex;
    }
    .img_box{
        margin: 0;
        padding: 0;
    }
    .img_box span{
        margin-right: 10px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #2C313C;
        letter-spacing: 0;
    }
    .img_box img{
        width: 22px;
        height: 45px;
        vertical-align: middle;
    }
    .girl{
        margin-left: 10px;
    }
    .girl span{
        margin-left: 10px;
    }
    /* 进度条 */
    div.progressContainer{
        position: relative;
        height: 6px;
        width: 80%;
        border-radius: 2px;
        background-color: #32C06C;
        margin-left: 2%;
        margin-top: 60px;
    }
    div.progress{
        background-color: #70C1FF;
        border-radius: 2px;
        height:6px;
        line-height: 6px;
    }
    .progress b{
        /* color:#70C1FF; */
        font-weight: 100;
        font-size: 12px;
        position: absolute;
        /* left:40%;  */
        top: -15px;
        font-size: 12px;
        color: #2C313C;
    }
    /* 私家车拥有情况 */
    .car_info{
        height: 116px;
        line-height: 116px;
        /* margin: 0 20px; */
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .car_box{
        margin: 0;
        padding: 0;
    }
    .car_box img{
        /* width: 55px;
        height: 45px; */
        width: 60px;
        height: 60px;
        vertical-align: middle;
        display: inline-block;
    }
    .car1 img{
        width: 65px;
        height: 65px;
    }
    .text_box{
        font-family: DINCondensed-Bold;
        font-size: 24px;
        color: #515151;
        letter-spacing: 0;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .text_box span{
        font-size: 28px;
        margin: 0 10px;
        font-family: DINCond-Bold;
    }
</style>

