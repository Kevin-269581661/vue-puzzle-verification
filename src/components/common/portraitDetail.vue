<template>
    <!--画像详情-->
    <div class="portrait-detail-wrap">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">亲邻智邻</a>
            </p>
            <div class="portrait_header_select">
                <el-dropdown @command="selectAsrIdFun">
                    <p class="el-dropdown-link">
                        {{currCompany.asrName}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </p>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in companyList" :key="index" :command="item">
                            {{item.asrName}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
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
                            <label class="community_info_label">城市：</label><span>{{resData.rname || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">区域：</label><span>{{resData.pname || '--'}}</span>
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
                            <label class="community_info_label">资源类型：</label>
                            <span v-if="resData.resType == 1">社区</span>
                            <span v-if="resData.resType == 2">写字楼</span>
                            <span v-if="resData.resType == 3">街道</span>
                            <span v-if="resData.resType == 4">地铁</span>
                            <span v-if="resData.resType == 5">学校</span>
                            <span v-if="resData.resType == 6">寺庙</span>
                            <span v-if="resData.resType == 7">户外路牌</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">楼盘类型：</label><span>{{resData.ctype || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label
                                class="community_info_label">楼盘价格：</label><span>¥{{resData.hprice/100 || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">入住年份：</label><span>{{resData.chDay || '--'}}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="community_info_row">
                    <h6 class="community_info_h6">社区信息</h6>
                    <el-row>
                        <el-col :span="6">
                            <label
                                class="community_info_label">楼栋数量：</label><span>{{resData.fnum || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">住户数量：</label><span>{{resData.hnum || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">媒体数量：</label><span>{{resData.mediaCount || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">点位数量：</label><span>{{resData.asCount || '--'}}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="tab-wrap">
            <el-tabs v-model="activeName" @tab-click="callChartsFn">
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
                        <div class="title">
                            <el-select v-model="tagSelect" placeholder="请选择" @change = 'changeTagSelect'>
                                <el-option label="同区对比" value="同区对比"></el-option>
                                <el-option label="同城对比" value="同城对比"></el-option>
                            </el-select>
                        </div>
                        <ul class="tags-ul">
                            <li v-for="item in hobbyTags" @click="chooseFirstTag(item)" class="tags-li"
                                :class="currTag1.value == item.value?'active':''">{{item.label}}
                            </li>
                        </ul>
                    </div>
                    <div class="charts-wrap" v-show="currTag1.childer">
                        <div class="title">
                            <h5>{{currTag1.label}}消费偏好</h5>
                        </div>
                        <div class="tag1-chart">
                            <div ref="tag2chart" style="width: 100%;height: 394px"></div>
                        </div>
                    </div>
                    <div class="charts-wrap" v-show="tag2List.length>0">
                        <div class="title">
                            <el-tabs v-model="tag2_active_name" @tab-click="changeSecondTag">
                                <el-tab-pane v-for="(item,index) in tag2List" :key="index" :label="item.label"
                                             :name="item.label"></el-tab-pane>
                            </el-tabs>

                        </div>
                        <div class="tag2-chart" ref="chartWrapWidth">
                            <div ref="tag3chart" style="width: 100%;height: 394px"></div>
                        </div>
                    </div>
                    <div class="charts-wrap" v-show="tag3List.length>0">
                        <div class="title">
                            <el-tabs v-model="tag3_active_name" @tab-click="changeThirdTag">
                                <el-tab-pane v-for="(item,index) in tag3List" :key="index" :label="item.label"
                                             :name="item.label"></el-tab-pane>
                            </el-tabs>
                        </div>

                        <div class="tag2-chart">
                            <div id="tag4chart" ref="tag4chart" style="width: 100%;height: 394px"></div>
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
                // 默认选择的公司
                currCompany: '',
                companyList: [],
                activeName: 'first',
                tagSelect: '同区对比',
                //图表legend
                tagLegendData:['单小区人群', '同区人群'],
                tag2_active_name: '',
                tag3_active_name: '',
                // tag4_active_name:'',
                currTag1: {childer: ''},
                currTag2: {childer: ''},
                currTag3: {childer: ''},
                tag2List: [],
                tag3List: [],
                // currTag4: '',
                resData: {},
                incomeList: [{rank: 1, income: '2499元及以下', percent: 28}],//月收入排行
                sexChart: '',//性别情况
                ageChart: '',//年龄情况
                eduChart: '',//教育水平
                spendChart: '',//消费水平
                assetsChart: '',//资产状况
                lifeChart: '',//人生阶段
                jobChart: '',//工作行业
                tag2chart: '',//二级标签
                tag3chart: '',//三级标签
                tag4chart: '',//四级标签
                tags: [],//词云
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
                currTagsChartsData: {
                    tag2_data: {
                        x: ['购车阶段', '汽车档次', '新能源汽车', '汽车车型'],
                        y1: [43.3, 83.1, 86.4, 72.4, 86.4, 72.4],
                        y2: [83.1, 73.4, 65.2, 53.9, 65.2, 53.9]
                    },
                    tag3_data: {
                        x: ['购车阶段2', '汽车档次2', '新能源汽车2', '汽车车型2'],
                        y1: [63.3, 33.1, 86.4, 72.4, 86.4, 72.4],
                        y2: [83.1, 43.4, 75.2, 43.9, 65.2, 53.9]
                    },
                    tag4_data: {
                        x: ['购车阶段4', '汽车档次4', '新能源汽车4', '汽车车型4'],
                        y1: [63.3, 33.1, 86.4, 72.4, 86.4, 72.4],
                        y2: [83.1, 43.4, 75.2, 43.9, 65.2, 53.9]
                    }

                },
                resId: '',
            }
        },
        methods: {
            // 平台商公司列表
            getCompanyList() {
                let portraitInfo = JSON.parse(sessionStorage.getItem('portraitInfo'))
                console.log(portraitInfo);
                // 选中的公司
                this.currCompany = portraitInfo[0]
                let arr = []
                for (let key of portraitInfo) {
                    arr.push({
                        asrId: key.asrId,
                        asrName: key.asrName,
                    })
                }
                this.companyList = arr
                console.log('companyList', this.companyList)
            },
            // 选择公司
            selectAsrIdFun(item) {
                this.currCompany = item
            },
            //性别情况
            sexChartFn() {
                this.sexChart = this.$echarts.init(this.$refs.sexChart)
                this.sexChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                        formatter: (params) => {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
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
                            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                            shadowStyle: {
                                shadowColor: '#f5f5f5'
                            }
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: (params) => {
                            return '<p class="echarts_tooltip_title">'
                                + '<span>' + '年龄分布' + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params[0].name +
                                '</span>' + params[0].data + '%' + '</p>'
                        },
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
                            },
                            formatter: '{value}%',
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
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                        formatter: (params) => {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
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
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                        formatter: (params) => {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
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
                        backgroundColor: '#FFFFFF',
                        textStyle: {
                            color: '#2C313C'
                        },
                        borderColor: '#ddd',
                        borderWidth: 1,
                        padding: 0,
                        formatter: (params) => {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params.seriesName + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params.name + '</span>' +
                                params.percent + '%' + '</p>'
                        },
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
                            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                            shadowStyle: {
                                shadowColor: '#f5f5f5'
                            }
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: (params) => {
                            return '<p class="echarts_tooltip_title">'
                                + '<span>' + '人生阶段' + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params[0].name +
                                '</span>' + params[0].data + '%' + '</p>'
                        },
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
                            },
                            formatter: '{value}%',
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
                            type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                            shadowStyle: {
                                shadowColor: '#f5f5f5'
                            }
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: (params) => {
                            return '<p class="echarts_tooltip_title">'
                                + '<span>' + '工作行业' + '</span>' +
                                '<span>' + '数据' + '</span>' +
                                '</p>' + '<br/>' +
                                '<p class="echarts_tooltip_content">' +
                                '<span><i class="echarts_tooltip_i" style="background-color: #4AA6FC"></i>' + params[0].name +
                                '</span>' + params[0].data + '%' + '</p>'
                        },
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
                            },
                            formatter: '{value}%',
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
                let wordList = this.tags.map(item=>{
                    let obj = {
                        text:item.tagName,
                        size:16+Math.ceil(item.rate*100),
                    }
                    return obj
                });
                console.log(wordList);
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
                    if (this.activeName == 'first') {
                        this.$nextTick(function () {
                            //人群
                            this.sexChart.resize();
                            this.ageChart.resize();
                            this.eduChart.resize();
                            this.spendChart.resize();
                            this.assetsChart.resize();
                            this.lifeChart.resize();
                            this.jobChart.resize();
                        })
                    } else {
                        this.$nextTick(function () {
                            //偏好
                            this.tag2chart.resize();
                            this.tag3chart.resize();
                            this.tag4chart.resize();
                        })
                    }
                });
            },
            //同区域或同城筛选
            changeTagSelect(item){
                this.tagLegendData = item=='同区对比'?['单小区人群', '同区人群']:['单小区人群', '同城人群']
                this.callChartsFn()
            },
            //截取前12个
            sliceArr(obj) {
                if (obj.childer.length > 0) {
                    let temp = obj.childer.slice(0, 12)
                    obj.childer = temp
                }
                return obj
            },
            //获取有下级的标签tabs
            getJuniorTabs(arr) {
                let temp = []
                for (let data of arr) {
                    if (data.childer && data.childer.length > 0) {
                        temp.push(data)
                    }
                }
                return temp
            },
            //二级标签柱状图
            tag2chartFn() {
                this.tag2chart = this.$echarts.init(this.$refs.tag2chart)
                this.tag2chart.setOption({
                    legend: {
                        left: 'center',
                        bottom: 20,
                        itemWidth: 10,
                        itemHeight: 10,
                        data: this.tag2LegendData
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: params => {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params[0].name + '</span>' +
                                '<span>数据</span>' +
                                '</p>' +
                                '<div class="echarts_tooltip_content_style2">' +
                                '<p><span><i class="echarts_tooltip_i" style="background-color: #1890FF"></i>'+params[0].seriesName+'</span>' +'<span>'+params[0].value + '%</span>' + '</p>' +
                                '<p><span><i class="echarts_tooltip_i" style="background-color: #4DCB73"></i>'+params[1].seriesName+'</span>' +'<span>'+params[1].value + '%</span>' + '</p>' + '</div>'
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
                        data: this.currTagsChartsData.tag2_data.x
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
                        {
                            type: 'bar',
                            barWidth: '18%',
                            color: '#1890FF',
                            name: this.tagLegendData[0],
                            data: this.currTagsChartsData.tag2_data.y1
                        },
                        {
                            type: 'bar',
                            barWidth: '18%',
                            color: '#4DCB73',
                            name: this.tagLegendData[1],
                            data: this.currTagsChartsData.tag2_data.y2
                        },
                    ]
                })
            },
            //三级标签柱状图
            tag3chartFn() {
                this.tag3chart = this.$echarts.init(this.$refs.tag3chart)
                this.tag3chart.setOption({
                    legend: {
                        left: 'center',
                        bottom: 20,
                        itemWidth: 10,
                        itemHeight: 10,
                        data: this.tag3LegendData
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: params => {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params[0].name + '</span>' +
                                '<span>数据</span>' +
                                '</p>' +
                                '<div class="echarts_tooltip_content_style2">' +
                                '<p><span><i class="echarts_tooltip_i" style="background-color: #1890FF"></i>'+params[0].seriesName+'</span>' +'<span>'+params[0].value + '%</span>' + '</p>' +
                                '<p><span><i class="echarts_tooltip_i" style="background-color: #4DCB73"></i>'+params[1].seriesName+'</span>' +'<span>'+params[1].value + '%</span>' + '</p>' + '</div>'
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
                        data: this.currTagsChartsData.tag3_data.x
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
                        {
                            type: 'bar',
                            barWidth: '18%',
                            color: '#1890FF',
                            name: this.tagLegendData[0],
                            data: this.currTagsChartsData.tag3_data.y1
                        },
                        {
                            type: 'bar',
                            barWidth: '18%',
                            color: '#4DCB73',
                            name: this.tagLegendData[1],
                            data: this.currTagsChartsData.tag3_data.y2
                        },
                    ]
                })
            },
            //四级标签柱状图
            tag4chartFn() {
                let tag4chart = document.getElementById("tag4chart")
                tag4chart.style.width = this.$refs.chartWrapWidth.offsetWidth + "px";
                this.tag4chart = this.$echarts.init(this.$refs.tag4chart)
                this.tag4chart.setOption({
                    legend: {
                        left: 'center',
                        bottom: 20,
                        itemWidth: 10,
                        itemHeight: 10,
                        data: this.tag4LegendData
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        backgroundColor: '#FFFFFF',
                        padding: 0,
                        borderColor: '#dddddd',
                        borderWidth: 1,
                        formatter: params => {
                            return '<p class="echarts_tooltip_title">' +
                                '<span>' + params[0].name + '</span>' +
                                '<span>数据</span>' +
                                '</p>' +
                                '<div class="echarts_tooltip_content_style2">' +
                                '<p><span><i class="echarts_tooltip_i" style="background-color: #1890FF"></i>'+params[0].seriesName+'</span>' +'<span>'+params[0].value + '%</span>' + '</p>' +
                                '<p><span><i class="echarts_tooltip_i" style="background-color: #4DCB73"></i>'+params[1].seriesName+'</span>' +'<span>'+params[1].value + '%</span>' + '</p>' + '</div>'
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
                        data: this.currTagsChartsData.tag4_data.x
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            interval: 'auto',
                            formatter: '{value} %',
                            color: '#A0A4AA',
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
                        {
                            type: 'bar',
                            barMaxWidth: '10%',
                            color: '#1890FF',
                            name: this.tagLegendData[0],
                            data: this.currTagsChartsData.tag4_data.y1
                        },
                        {
                            type: 'bar',
                            barMaxWidth: '10%',
                            color: '#4DCB73',
                            name: this.tagLegendData[1],
                            data: this.currTagsChartsData.tag4_data.y2
                        },
                    ]
                })
            },
            //调用图表方法
            callChartsFn() {
                if (this.activeName == 'first') {
                    this.$nextTick(function () {
                        //人群
                        this.sexChartFn()
                        this.ageChartFn()
                        this.eduChartFn()
                        this.spendChartFn()
                        this.assetsChartFn()
                        this.lifeChartFn()
                        this.jobChartFn()
                        this.getWordCloud()
                    })
                } else {
                    this.$nextTick(function () {
                        //偏好
                        this.tag2chartFn()
                        this.tag3chartFn()
                        this.tag4chartFn()
                    })
                }

            },
            //获取偏好画像标签
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
                        //设置各级菜单的tab和x轴y轴数据
                        if (this.currTag1.childer) {
                            //最多12个
                            this.sliceArr(this.currTag1)
                            //二级菜单的tabs和二级菜单图表的数据
                            this.tag2List = this.getJuniorTabs(this.currTag1.childer)
                            this.currTagsChartsData.tag2_data.x = this.currTag1.childer.map(item => {
                                return item.label
                            })
                        }
                        if (this.tag2List.length > 0) {
                            //当前选中的二级菜单
                            this.currTag2 = this.tag2List[0];
                            this.tag2_active_name = this.tag2List[0].label;
                            this.sliceArr(this.currTag2)
                            this.tag3List = this.getJuniorTabs(this.currTag2.childer)
                            this.currTagsChartsData.tag3_data.x = this.currTag2.childer.map(item => {
                                return item.label
                            })
                        }
                        if (this.tag3List.length > 0) {
                            this.currTag3 = this.tag3List.childer[0]
                            this.tag3_active_name = this.tag3List[0].label;
                            this.sliceArr(this.currTag3)
                            this.currTagsChartsData.tag4_data.x = this.currTag3.childer.map(item => {
                                return item.label
                            })
                        }
                        this.callChartsFn()

                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            },
            //选择一级标签
            chooseFirstTag(item) {
                this.currTag1 = item
                //一级下有二级
                if (item.childer) {
                    this.sliceArr(item)
                    this.tag2List = this.getJuniorTabs(item.childer)
                    this.currTagsChartsData.tag2_data.x = item.childer.map(item => {
                        return item.label
                    });
                    this.tag2chartFn()
                    //this.tag2List.length>0 => 二级下有三级
                    if (this.tag2List.length > 0) {
                        this.currTag2 = this.tag2List[0]
                        this.tag2_active_name = this.tag2List[0].label
                        this.tag3List = this.getJuniorTabs(this.tag2List[0].childer)
                        this.sliceArr(this.tag2List[0])
                        this.currTagsChartsData.tag3_data.x = this.tag2List[0].childer.map(item => {
                            return item.label
                        });
                        this.tag3chartFn()
                    }
                    //三级下有四级
                    if (this.tag3List.length > 0) {
                        this.currTag2 = this.tag3List[0]
                        this.sliceArr(this.tag3List[0])
                        this.tag3_active_name = this.tag3List[0].label
                        this.currTagsChartsData.tag4_data.x = this.tag3List[0].childer.map(item => {
                            return item.label
                        });
                        this.tag4chartFn()
                    }
                } else {
                    this.tag2List = []
                    this.tag3List = []
                }
            },
            changeSecondTag(tab, event) {
                // console.log(this.currTag1,this.currTag2);
                for (let data of this.tag2List) {
                    if (data.label == tab.name) {
                        this.currTag2 = data
                        this.sliceArr(data)
                        this.currTagsChartsData.tag3_data.x = data.childer.map(item => {
                            return item.label
                        })
                        this.tag3List = this.getJuniorTabs(data.childer)
                        this.tag3chartFn()
                    }
                }
                if (this.tag3List.length > 0) {
                    this.currTag3 = this.tag3List[0]
                    this.tag3_active_name = this.tag3List[0].label
                    this.currTagsChartsData.tag4_data.x = this.tag3List[0].childer.map(item => {
                        return item.label
                    })
                    this.tag4chartFn()
                }

            },
            changeThirdTag(tab, event) {
                console.log(this.tag3List);
                for (let data of this.tag3List) {
                    if (data.label == tab.name) {
                        this.currTag3 = data
                        this.sliceArr(data)
                        this.currTagsChartsData.tag4_data.x = data.childer.map(item => {
                            return item.label
                        })
                        this.tag4chartFn()
                    }
                }

            },
            getParams() {
                this.resId = this.$route.query.resId
                this.getCommunityInfo()
                this.getChartsData()
            },
            //获取小区信息
            getCommunityInfo() {
                api.getApi(this.apiVar.portrait + 'resInfo/getResInfoByResId', {resId: this.resId}).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        this.resData = res.data.data
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            },
            //获取图表数据
            getChartsData() {
                this.sexData = '';
                this.ageData = {};
                this.eduData = '';
                this.spendData = '';
                this.assetsData = '';
                this.lifeData = {};
                this.jobData = {};
                this.incomeList = [];
                api.getApi(this.apiVar.portrait + 'portrait/getPortraitInfo', {resId: this.resId}).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let result = res.data.data
                        //性别
                        this.sexData = [...result.sexList].map(item => {
                            let obj = {
                                name: item.tagName,
                                value: item.userCnt
                            }
                            return obj
                        });
                        //年龄
                        this.ageData.x = [...result.ageList].map(item => {
                            return item.tagName
                        })
                        this.ageData.y = [...result.ageList].map(item => {
                            return (item.rate * 100).toFixed(2) * 1
                        })
                        //教育水平
                        this.eduData = [...result.educationList].map(item => {
                            let obj = {
                                name: item.tagName,
                                value: item.userCnt
                            }
                            return obj
                        });
                        //消费水平
                        this.spendData = [...result.buyList].map(item => {
                            let obj = {
                                name: item.tagName,
                                value: item.userCnt
                            }
                            return obj
                        });
                        //月收入
                        result.inComeList.sort((a, b) => {
                            return b.userCnt - a.userCnt
                        })
                        this.incomeList = [...result.inComeList].map((item, index) => {
                            let obj = {rank: index + 1, income: item.tagName, percent: (item.rate * 100).toFixed(2) * 1}
                            return obj
                        })
                        //资产情况
                        this.assetsData = [...result.haveCarList].map(item => {
                            let obj = {
                                name: item.tagName,
                                value: item.userCnt
                            }
                            return obj
                        });
                        //人生阶段
                        this.lifeData.x = [...result.liftList].map(item => {
                            return item.tagName
                        })
                        this.lifeData.y = [...result.liftList].map(item => {
                            return (item.rate * 100).toFixed(2) * 1
                        })
                        //工作行业
                        this.jobData.x = [...result.jobList].map(item => {
                            return item.tagName
                        })
                        this.jobData.y = [...result.jobList].map(item => {
                            return (item.rate * 100).toFixed(2) * 1
                        })
                        //行业词云
                        this.tags = [...result.industryList]
                    } else {
                        this.$message.warning(res.data.MSG);
                    }
                })
            }

        },
        mounted() {
            this.getParams();
            this.getCompanyList();
            this.getTags();
            this.echartsListener();
        }
    }
</script>

<style scoped>
    .ad_mediaDetail_nav {
        position: relative;
    }

    .portrait_header_select {
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
    }

    .portrait_header_select /deep/ .el-dropdown-link {
        background: rgba(0, 0, 0, 0);
        color: #999;
        border: none;
        text-align: center;
        padding-left: 0;
        font-size: 14px;
    }

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
        border: 1px solid #E6E7E9;
    }
    .tags .title{
        padding: 8px 16px;
        border-bottom: 1px solid #E6E7E9;
    }
    .tags .title /deep/ .el-input--suffix .el-input__inner {
        width: 112px;
        height: 32px;
        font-size: 14px;
    }
    .tags-ul {
        display: flex;
        flex-wrap: wrap;
        padding: 16px 24px 0px;
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

    .tab-wrap .charts-wrap /deep/ .el-tabs__content {
        padding-top: 0;
    }

    .tab-wrap .charts-wrap /deep/ .el-tabs__nav-wrap {
        border: none;
    }

    .tab-wrap .charts-wrap /deep/ .el-tabs__nav-wrap::after {
        height: 1px;
    }

    .charts-wrap {
        background: #fff;
        border: 1px solid #E6E7E9;
        margin-top: 24px;
    }

    .charts-wrap .title {
        font-size: 16px;
        color: #2C313C;
        border-bottom: 1px solid #E6E7E9;
        height: 48px;
        line-height: 48px;
        padding: 0 16px;
        box-sizing: border-box;

        display: flex;
        justify-content: space-between;
    }

    .charts-wrap .title h5 {
        font-weight: 600;
    }




    /* echarts的tooltip样式 */
    /deep/ .echarts_tooltip_title {
        min-width: 180px;
        height: 36px;
        display: flex;
        justify-content: space-between;
        padding: 0px 10px;
        align-items: center;
        box-sizing: border-box;
        margin-bottom: -20px;
        color: #808080;
        background-color: #F4F6F6;
        font-size: 12px;
    }

    /deep/ .echarts_tooltip_content {
        display: flex;
        justify-content: space-between;
        padding: 0px 10px;
        box-sizing: border-box;
        align-items: center;
        font-size: 12px;
        color: #2C313C;
        height: 32px;
        line-height: 32px;
    }
    /deep/ .echarts_tooltip_content_style2{
        color: #2C313C;
        font-size: 12px;
        margin-top: 20px;
        padding: 0px 10px;
        box-sizing: border-box;
    }
    /deep/ .echarts_tooltip_content_style2 p{
        width: 100%;
        line-height: 24px;
        display: flex;
        justify-content: space-between;
    }

    /deep/ .echarts_tooltip_i {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 5px;
    }

</style>

