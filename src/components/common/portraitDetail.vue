<template>
    <!--画像详情-->
    <div class="portrait-detail-wrap">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">亲邻智邻</a>
            </p>
            <el-dropdown trigger="click">
                <p class="el-dropdown-link">
                    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </p>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                    <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="top-content-wrap">
            <div class="title">
                <img src="../../assets/images/resLogo.svg" alt="">
                <h5>{{resData.resName}}</h5>
            </div>
            <div class="community_main_info">
                <div class="community_info_row">
                    <h6 class="community_info_h6">位置信息</h6>
                    <el-row>
                        <el-col :span="6">
                            <label class="community_info_label">城市：</label><span>{{resData.city || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">区域：</label><span>{{resData.cityArea || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">商圈：</label><span>{{resData.tradingArea || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">详细地址：</label><span>{{resData.resAddress}}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="community_info_row">
                    <h6 class="community_info_h6">社区类型</h6>
                    <el-row>
                        <el-col :span="6">
                            <label class="community_info_label">资源类型：</label><span>{{resData.resType == 1 ? '社区' : '写字楼'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">楼盘类型：</label><span>{{resData.houseType || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label
                                class="community_info_label">楼盘价格：</label><span>¥{{resData.floorPrice || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">入住年份：</label><span>{{resData.joinTime || '--'}}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="community_info_row">
                    <h6 class="community_info_h6">社区信息</h6>
                    <el-row>
                        <el-col :span="6">
                            <label
                                class="community_info_label">楼栋数量：</label><span>{{resData.buildingNum || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">住户数量：</label><span>{{resData.HouseNum || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">媒体数量：</label><span>{{resData.mediaNum || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">点位数量：</label><span>{{resData.adsNum || '--'}}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="tab-wrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="人群画像" name="first">
                    <div class="part part1">
                        <div class="flex1">
                            <h6>性别情况</h6>
                            <div class="chart-wrap">
                                <div class="sex-chart" ref="sexChart" style="width: 100%;height: 100%"></div>
                            </div>
                        </div>
                        <div class="flex2">
                            <h6>年龄分布</h6>
                            <div class="chart-wrap">
                                <div class="age-chart" ref="ageChart" style="width: 100%;height: 100%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="part part2">
                        <div class="flex1">
                            <h6>教育水平</h6>
                            <div class="chart-wrap">
                                <div class="sex-chart" ref="eduChart" style="width: 100%;height: 100%"></div>
                            </div>
                        </div>
                        <div class="flex1">
                            <h6>消费水平</h6>
                            <div class="chart-wrap">
                                <div class="sex-chart" ref="spendChart" style="width: 100%;height: 100%"></div>
                            </div>
                        </div>
                        <div class="flex1 last-flex">
                            <h6>月收入水平</h6>
                            <div class="table-wrap">
                                <el-table
                                    max-height="352"
                                    :data="incomeList"
                                    style="width: 100%">
                                    <el-table-column prop="rank" label="排名" min-width="50">
                                    </el-table-column>
                                    <el-table-column prop="income" label="月收入" min-width="80">
                                    </el-table-column>
                                    <el-table-column prop="percent" label="占比" min-width="80">
                                        <template slot-scope="scope">
                                            <el-progress :percentage="scope.row.percent"></el-progress>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                    <div class="part part1">
                        <div class="flex1">
                            <h6>资产状况</h6>
                            <div class="chart-wrap">
                                <div class="sex-chart" ref="assetsChart" style="width: 100%;height: 100%"></div>
                            </div>
                        </div>
                        <div class="flex2">
                            <h6>人生阶段</h6>
                            <div class="chart-wrap">
                                <div class="age-chart" ref="lifeChart" style="width: 100%;height: 100%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="part part1">
                        <div class="flex1">
                            <h6>行业词云</h6>
                            <div class="chart-wrap">
                                <div class="word-cloud-box" ref='wordCloudBox'></div>
                            </div>
                        </div>
                        <div class="flex2">
                            <h6>工作行业</h6>
                            <div class="chart-wrap">
                                <div class="age-chart" ref="jobChart" style="width: 100%;height: 100%"></div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="偏好画像" name="second">
                    <div class="tags">
                        <ul class="tags-ul">
                            <li v-for="item in hobbyTags" @click="chooseFirstTag(item)" class="tags-li"
                                :class="currTag1.value == item.value?'active':''">{{item.label}}
                            </li>
                        </ul>
                    </div>
                    <div class="charts-wrap">
                        <h5>{{currTag1.label}}消费偏好</h5>
                        <div class="tag1-chart">
                            <div ref="tag1chart" style="width: 100%;height: 394px"></div>
                        </div>
                    </div>
                    <div class="charts-wrap" v-if="currTag1.childer!=null">
                        <el-tabs v-model="currTag2.label" @tab-click="handleClick">
                            <el-tab-pane v-for="(item,index) in currTag1.childer" :key="index" :label="item.label" :name="item.label"></el-tab-pane>
                        </el-tabs>
                        <div class="tag2-chart">
                            <div ref="tag2chart" style="width: 100%;height: 394px"></div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>

<script>
    import myCloud from '../../commonFun/myCloud.js'
    import api from "../../api/api.js";

    export default {
        name: "portraitDetail",
        data() {
            return {
                activeName: 'second',
                currTag1: '',
                currTag2: '',
                currTag3: '',
                currTag4: '',
                resData: {
                    resName: '中信西关海花苑',
                    resType: '1',
                    city: '',
                    cityArea: '',
                    tradingArea: '',
                    houseType: '',
                    floorPrice: '',
                    HouseNum: 0,
                    buildingNum: 0,
                    joinTime: '',
                    resAddress: '',
                    mediaNum: 0,
                    adsNum: 0
                },
                incomeList: [{rank: 1, income: '2499元及以下', percent: 28}],//月收入排行
                sexChart: '',//性别情况
                ageChart: '',//年龄情况
                eduChart: '',//教育水平
                spendChart: '',//消费水平
                assetsChart: '',//资产状况
                lifeChart: '',//人生阶段
                jobChart: '',//工作行业
                tags: [
                    {text: 'vue', size: 14},
                    {text: 'html', size: 24},
                    {text: 'js', size: 34},
                    {text: 'vue', size: 24},
                    {text: 'html', size: 15},
                    {text: 'js', size: 26},
                    {text: 'vue', size: 17},
                    {text: 'html', size: 28},
                    {text: 'js', size: 19}, {text: 'vue', size: 20},
                    {text: 'html', size: 30},
                    {text: 'js', size: 21},
                    {text: 'vue', size: 12},
                    {text: 'html', size: 13},
                    {text: 'js', size: 14},
                    {text: 'vue', size: 15},
                    {text: 'html', size: 16},
                    {text: 'js', size: 17},
                    {text: 'vue', size: 18},
                    {text: 'html', size: 19},
                    {text: 'js', size: 20},
                    {text: 'vue', size: 21},
                    {text: 'html', size: 22},
                    {text: 'js', size: 23},
                    {text: 'vue', size: 24},
                    {text: 'html', size: 25},
                    {text: 'js', size: 26},
                ],//词云
                sexData: [
                    {value: 335, name: '男'},
                    {value: 310, name: '女'},
                ],
                ageData: {
                    x: ['15岁以下', '16-25岁', '26-35岁', '36-45岁', '46-55岁', '56岁以上', '未知'],
                    y: [120, 200, 150, 80, 70, 110, 130]
                },
                eduData: [
                    {value: 335, name: '本科及以上'},
                    {value: 310, name: '大专'},
                    {value: 310, name: '高中及以下'},
                ],
                spendData: [
                    {value: 335, name: '高'},
                    {value: 310, name: '中'},
                    {value: 310, name: '低'},
                ],
                assetsData: [
                    {value: 335, name: '有车'},
                    {value: 310, name: '无车'},
                ],
                lifeData: {
                    x: ['初中生', '高中生', '大学生', '研究生', '孕期', '育儿阶段', '家有孕妇', '家有0-1岁小孩', '家有1-3岁小孩', '家有3-6岁小孩', '家有小学生', '家有初中生', '家有高中生'],
                    y: [120, 200, 150, 80, 70, 110, 130, 120, 200, 150, 80, 70, 110]
                },
                jobData: {x: ['服务人员', '个体经营者', '管理者和企业主', '专业技术人员', '文职人员', '生产操作人员'], y: [120, 200, 150, 80, 70, 110]},
                hobbyTags: '',
                currTagsData:{
                    first_tag_data:{x:['购车阶段', '汽车档次', '新能源汽车', '汽车车型'],y1:[43.3, 83.1, 86.4, 72.4],y2:[83.1, 73.4, 65.2, 53.9]},
                    second_tag_data:{x:['购车阶段2', '汽车档次2', '新能源汽车2', '汽车车型2'],y1:[63.3, 33.1, 86.4, 72.4],y2:[83.1, 43.4, 75.2, 43.9]}
                }

            }
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
                // this.getTags()

            },
            //性别情况
            sexChartFn() {
                this.sexChart = this.$echarts.init(this.$refs.sexChart)
                this.sexChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        left: 'center',
                        bottom: 10,
                        data: ['男', '女'],
                        icon: 'circle',
                        itemWidth: 9,
                        itemHeight: 9
                    },
                    series: [
                        {
                            name: '性别情况',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            center: ['50%', '45%'],
                            color: ['#1890FF', '#F1627A'],
                            label: {
                                formatter: '{d}%'
                            },
                            data: this.sexData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            },
            //年龄分布
            ageChartFn() {
                this.ageChart = this.$echarts.init(this.$refs.ageChart)
                this.ageChart.setOption({
                    color: ['#1890FF'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            //坐标轴刻度标签
                            margin: 7, //刻度标签与轴线之间的距离
                            interval: 0,    //强制文字产生间隔
                            textStyle: {
                                fontFamily: "DINPro-Regular",
                                color: "#2C313C" //坐标轴刻度文字的颜色
                            }
                        },
                        data: this.ageData.x
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            //坐标轴刻度标签
                            margin: 7, //刻度标签与轴线之间的距离
                            textStyle: {
                                fontFamily: "DINPro-Regular",
                                color: "#2C313C" //坐标轴刻度文字的颜色
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#E8E8E8",
                                type: "dashed"
                            }
                        }
                    },
                    series: [{
                        data: this.ageData.y,
                        type: 'bar',
                        barWidth: '18%',
                    }]
                })
            },
            //教育水平
            eduChartFn() {
                this.eduChart = this.$echarts.init(this.$refs.eduChart)
                this.eduChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        left: 'center',
                        bottom: 10,
                        data: ['本科及以上', '大专', '高中及以下'],
                        icon: 'circle',
                        itemWidth: 9,
                        itemHeight: 9
                    },
                    series: [
                        {
                            name: '教育水平',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            center: ['50%', '45%'],
                            color: ['#1890FF', '#F1627A', '#4DCB73'],
                            label: {
                                formatter: '{d}%'
                            },
                            data: this.eduData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            },
            //消费水平
            spendChartFn() {
                this.spendChart = this.$echarts.init(this.$refs.spendChart)
                this.spendChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        left: 'center',
                        bottom: 10,
                        data: ['高', '中', '低'],
                        icon: 'circle',
                        itemWidth: 9,
                        itemHeight: 9
                    },
                    series: [
                        {
                            name: '消费水平',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            center: ['50%', '45%'],
                            color: ['#1890FF', '#F1627A', '#4DCB73'],
                            label: {
                                formatter: '{d}%'
                            },
                            data: this.spendData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            },
            //资产状况
            assetsChartFn() {
                this.assetsChart = this.$echarts.init(this.$refs.assetsChart)
                this.assetsChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        left: 'center',
                        bottom: 10,
                        data: ['有车', '无车'],
                        icon: 'circle',
                        itemWidth: 9,
                        itemHeight: 9
                    },
                    series: [
                        {
                            name: '资产状况',
                            type: 'pie',
                            radius: ['40%', '60%'],
                            center: ['50%', '45%'],
                            color: ['#1890FF', '#F1627A'],
                            label: {
                                formatter: '{d}%'
                            },
                            data: this.assetsData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })
            },
            //人生阶段
            lifeChartFn() {
                this.lifeChart = this.$echarts.init(this.$refs.lifeChart)
                this.lifeChart.setOption({
                    color: ['#1890FF'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grad: {
                        x: 25,
                        y: 45,
                        x2: 5,
                        y2: 20,
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            //坐标轴刻度标签
                            margin: 7, //刻度标签与轴线之间的距离
                            interval: 0,    //强制文字产生间隔
                            textStyle: {
                                fontFamily: "DINPro-Regular",
                                color: "#2C313C" //坐标轴刻度文字的颜色
                            },
                            rotate: 30
                        },
                        data: this.lifeData.x
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            //坐标轴刻度标签
                            margin: 7, //刻度标签与轴线之间的距离
                            textStyle: {
                                fontFamily: "DINPro-Regular",
                                color: "#2C313C" //坐标轴刻度文字的颜色
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#E8E8E8",
                                type: "dashed"
                            }
                        }
                    },
                    series: [{
                        data: this.lifeData.y,
                        type: 'bar',
                        barWidth: '18%',
                    }]
                })
            },
            //工作行业
            jobChartFn() {
                this.jobChart = this.$echarts.init(this.$refs.jobChart)
                this.jobChart.setOption({
                    color: ['#1890FF'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            //坐标轴刻度标签
                            margin: 7, //刻度标签与轴线之间的距离
                            interval: 0,    //强制文字产生间隔
                            textStyle: {
                                fontFamily: "DINPro-Regular",
                                color: "#2C313C" //坐标轴刻度文字的颜色
                            }
                        },
                        data: this.jobData.x
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            //坐标轴刻度标签
                            margin: 7, //刻度标签与轴线之间的距离
                            textStyle: {
                                fontFamily: "DINPro-Regular",
                                color: "#2C313C" //坐标轴刻度文字的颜色
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#E8E8E8",
                                type: "dashed"
                            }
                        }
                    },
                    series: [{
                        data: this.jobData.y,
                        type: 'bar',
                        barWidth: '18%',
                    }]
                })
            },
            //行业词云
            getWordCloud() {
                let wordList = this.tags;
                let wordOption = {
                    wordList,
                    size: [324, 240],  // 盒子的宽高
                    svgElement: this.$refs.wordCloudBox  //使用ref选择节点
                };
                myCloud(wordOption, this.getArticleList)
            },
            //点击词云回调
            getArticleList() {
                console.log('窝窝头，一块钱四个，嘿嘿！');
            },
            // 统一监听
            echartsListener() {
                window.addEventListener("resize", () => {
                    this.sexChart.resize();
                    this.ageChart.resize();
                    this.eduChart.resize();
                    this.spendChart.resize();
                    this.assetsChart.resize();
                    this.lifeChart.resize();
                    this.jobChart.resize();
                });
            },
            //获取偏好画像标签
            //获取标签数据
            getTags(parentId) {
                let info = ''
                info = {
                    type: 1,
                    loadChilder: 1,
                    parentId: parentId ? parentId : 0,
                }
                api.getApi(this.apiVar.portrait + 'label/getLabels', info).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        this.hobbyTags = res.data.data
                        this.currTag1 = this.hobbyTags[0]
                        if(this.currTag1.childer){
                            this.currTag2 = this.currTag1.childer[0]
                            if(this.currTag2.childer){
                                this.currTag3 = this.currTag2.childer[0]
                                if(this.currTag3.childer){
                                    this.currTag4 = this.currTag3.childer[0]
                                }
                            }
                        }


                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            },
            //选择一级标签
            chooseFirstTag(item) {
                this.currTag1 = item
            },
            //一级标签柱状图
            tag1chartFn() {
                let tag1chart = this.$echarts.init(this.$refs.tag1chart)
                tag1chart.setOption({
                    legend: {
                        left: 'center',
                        bottom: 20,
                        itemWidth: 10,
                        itemHeight: 10,
                        data: ['单小区人群', '同区域人群']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: params => {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params[0].name + '</span>' +
                                '</p>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #1890FF"></i>' + params[0].seriesName + '</span>：' + params[0].value + '%' +'<br/>' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4DCB73"></i>' + params[1].seriesName + '</span>：' + params[1].value + '%' +'</p>'
                        }
                    },
                    grid: {x: 80, y: 40, x2: 80, y2: 80,},//图表位置
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            color: '#2C313C'
                        },
                        data: this.currTagsData.first_tag_data.x
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %',
                            color: '#A0A4AA'
                        },
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#fff"
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#E8E8E8",
                                type: "dashed"
                            }
                        },
                        show: true
                    },
                    series: [
                        {type: 'bar', barWidth: '18%', color: '#1890FF', name: '单小区人群', data: this.currTagsData.first_tag_data.y1},
                        {type: 'bar', barWidth: '18%', color: '#4DCB73', name: '同区域人群', data: this.currTagsData.first_tag_data.y2},
                    ]
                })
            },
            //二级标签柱状图
            tag2chartFn(){
                let tag2chart = this.$echarts.init(this.$refs.tag2chart)
                tag2chart.setOption({
                    legend: {
                        left: 'center',
                        bottom: 20,
                        itemWidth: 10,
                        itemHeight: 10,
                        data: ['单小区人群', '同区域人群']
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: params => {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params[0].name + '</span>' +
                                '</p>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #1890FF"></i>' + params[0].seriesName + '</span>：' + params[0].value + '%' +'<br/>' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4DCB73"></i>' + params[1].seriesName + '</span>：' + params[1].value + '%' +'</p>'
                        }
                    },
                    grid: {x: 80, y: 40, x2: 80, y2: 80,},//图表位置
                    xAxis: {
                        type: 'category',
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#E8E8E8"
                            }
                        },
                        axisLabel: {
                            color: '#2C313C'
                        },
                        data: this.currTagsData.second_tag_data.x
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %',
                            color: '#A0A4AA'
                        },
                        axisLine: {
                            //坐标轴线条相关设置(颜色等)
                            lineStyle: {
                                color: "#fff"
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#E8E8E8",
                                type: "dashed"
                            }
                        },
                        show: true
                    },
                    series: [
                        {type: 'bar', barWidth: '18%', color: '#1890FF', name: '单小区人群', data: this.currTagsData.second_tag_data.y1},
                        {type: 'bar', barWidth: '18%', color: '#4DCB73', name: '同区域人群', data: this.currTagsData.second_tag_data.y2},
                    ]
                })
            },
            //调用
            callChartsFn(){
                setTimeout(() => {
                    //人群
                    this.sexChartFn()
                    this.ageChartFn()
                    this.eduChartFn()
                    this.spendChartFn()
                    this.assetsChartFn()
                    this.lifeChartFn()
                    this.jobChartFn()
                    this.echartsListener();
                    this.getWordCloud()
                    //偏好
                    this.tag1chartFn()
                    this.tag2chartFn()
                }, 20)
            }
        },
        mounted() {
            this.callChartsFn()
            this.getTags()

        }
    }
</script>

<style scoped>
    .el-dropdown-link {
        cursor: pointer;
    }

    .ad_mediaDetail_nav {
        display: flex;
        justify-content: space-between;
    }

    .top-content-wrap {
        margin: 0 64px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 231, 233, 1);
        padding: 32px;
    }

    .tab-wrap {
        margin: 24px 64px;
        background: #fff;
    }

    .tab-wrap /deep/ .el-tabs__nav-wrap {
        padding: 0 14px;
        border: 1px solid rgba(230, 231, 233, 1);
    }

    .tab-wrap /deep/ .el-tabs__header {
        margin-bottom: 0;
    }

    .tab-wrap /deep/ .el-tabs__content {
        background: #f5f6fa;
        padding-top: 24px;
    }

    .tab-wrap /deep/ .el-tabs__item {
        color: rgba(0, 0, 0, 0.45);
    }

    .tab-wrap /deep/ .el-tabs__item.is-active {
        color: #409EFF;
    }

    .top-content-wrap .title {
        display: flex;
        align-items: center;
    }

    .top-content-wrap .title h5 {
        margin-left: 12px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
    }

    .community_main_info {
        padding: 16px 0 0 44px;
    }

    .community_info_row {
        font-size: 14px;
        margin-bottom: 24px;
    }

    .community_info_row h6 {
        margin-bottom: 10px;
    }

    .community_info_row span {
        color: #666666;
    }

    .community_info_row .community_info_label {
        color: #333333;
    }

    .part .flex2 {
        flex: 2;
    }

    .part .flex1 {
        /*flex: 1;*/
        margin-right: 24px;
        width: 400px;
        height: 400px;
    }

    .chart-wrap, .table-wrap {
        height: 352px;
    }

    .part .last-flex {
        margin-right: 0;
        flex: 1;
    }

    .part {
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
    }

    .part > div h6 {
        color: rgba(44, 49, 60, 1);
        font-size: 16px;
        line-height: 48px;
        padding: 0 16px;
        border-bottom: 1px solid rgba(230, 231, 233, 1);
        box-sizing: border-box;
    }

    .part > div {
        border: 1px solid rgba(230, 231, 233, 1);
        background: #fff;
    }

    .part .part1 .table-wrap {
        padding: 0 24px;
    }

    .table-wrap {
        padding: 0 16px;
    }

    /deep/ .table-wrap .el-table th {
        background-color: #fff;
    }

    .table-wrap /deep/ .el-progress.el-progress--line {
        line-height: 32px;
    }

    .word-cloud-box {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tags {
        background: #fff;
        padding: 16px 24px 4px;
    }

    .tags-ul {
        display: flex;
        flex-wrap: wrap;
    }

    .tags-li {
        font-size: 14px;
        min-width: 76px;
        height: 26px;
        line-height: 26px;
        color: rgba(0, 0, 0, 0.35);
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(194, 194, 194, 1);
        margin-right: 8px;
        margin-bottom: 12px;
        cursor: pointer;
        padding: 0 10px;
        box-sizing: border-box;
    }

    .tags-li.active {
        border: 1px solid #1890FF;
        color: #1890FF;
    }
    .tab-wrap .charts-wrap /deep/ .el-tabs__content{
        padding-top: 0;
    }
    .tab-wrap .charts-wrap /deep/ .el-tabs__nav-wrap{
        border: none;
    }
    .tab-wrap .charts-wrap /deep/ .el-tabs__nav-wrap::after{
        height: 1px;
    }

    .charts-wrap {
        background: #fff;
        border: 1px solid #E6E7E9;
        margin-top: 24px;
    }


    .charts-wrap h5 {
        font-size: 16px;
        color: #2C313C;
        border-bottom: 1px solid #E6E7E9;
        height: 48px;
        line-height: 48px;
        padding-left: 16px;
        box-sizing: border-box;
        font-weight: 600;
    }
    /deep/ .echarts_tooltip_i {
        display: inline-block;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        margin-right: 5px;
    }
</style>

