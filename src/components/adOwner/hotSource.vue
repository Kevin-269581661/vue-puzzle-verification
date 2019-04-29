<template>
    <div class="clearfix">
        <div class="right-content-wrap">
            <div class="right-title">
                <h1>热门来源: <i>{{formatTime(bdDay)}}-{{formatTime(edDay)}}</i></h1>
            </div>
            <div class="right-content">
                <div class="style2-wrap">
                    <div class="right-charts-table">
                        <div class="right-charts-left-title">
                            <h1>热门省份来源</h1>
                        </div>
                        <div class="right-charts-left-list">
                            <template>
                                <el-table
                                    :data="province"
                                    style="width: 100%">
                                    <el-table-column
                                        prop="rank"
                                        label="排名"
                                        min-width="15%">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.rank == 1"><img src="../../assets/images/top1.png"
                                                                                  alt=""></span>
                                            <span v-else-if="scope.row.rank == 2"><img
                                                src="../../assets/images/top2.png" alt=""></span>
                                            <span v-else-if="scope.row.rank == 3"><img
                                                src="../../assets/images/top3.png" alt=""></span>
                                            <span v-else>{{scope.row.rank}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="industry"
                                        label="省份"
                                        min-width="40%">
                                    </el-table-column>
                                    <el-table-column
                                        label="占比"
                                        min-width="40%"
                                    >
                                        <template slot-scope="scope">
                                            <div style="display: flex;justify-content: space-around">
                                                <span style="margin-right: 7px">{{scope.row.percent}}%</span>
                                                <el-progress :percentage="scope.row.percent-0"
                                                             color="#1890FF"
                                                             :text-inside="true"
                                                             style="flex: 1;line-height: 21px"></el-progress>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </div>
                    <div class="right-charts-table">
                        <div class="right-charts-left-title">
                            <h1>热门省内城市来源</h1>
                        </div>
                        <div class="right-charts-left-list">
                            <template>
                                <el-table
                                    :data="citys"
                                    style="width: 100%">
                                    <el-table-column
                                        prop="rank"
                                        label="排名"
                                        min-width="15%">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.rank == 1"><img src="../../assets/images/top1.png"
                                                                                  alt=""></span>
                                            <span v-else-if="scope.row.rank == 2"><img
                                                src="../../assets/images/top2.png" alt=""></span>
                                            <span v-else-if="scope.row.rank == 3"><img
                                                src="../../assets/images/top3.png" alt=""></span>
                                            <span v-else>{{scope.row.rank}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="industry"
                                        label="城市"
                                        min-width="40%">
                                    </el-table-column>
                                    <el-table-column
                                        label="占比"
                                        min-width="40%"
                                    >
                                        <template slot-scope="scope">
                                            <div style="display: flex;justify-content: space-around">
                                                <span style="margin-right: 7px">{{scope.row.percent}}%</span>
                                                <el-progress
                                                             :percentage="scope.row.percent-0"
                                                             color="#1890FF"
                                                             :text-inside="true"
                                                             style="flex: 1;line-height: 21px"></el-progress>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </div>
                    <div class="right-charts-table">
                        <div class="right-charts-left-title">
                            <h1>热门市内城区来源</h1>
                        </div>
                        <div class="right-charts-left-list">
                            <template>
                                <el-table
                                    :data="area"
                                    style="width: 100%">
                                    <el-table-column
                                        type="index"
                                        label="排名"
                                        min-width="15%">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.rank == 1"><img src="../../assets/images/top1.png"
                                                                                  alt=""></span>
                                            <span v-else-if="scope.row.rank == 2"><img
                                                src="../../assets/images/top2.png" alt=""></span>
                                            <span v-else-if="scope.row.rank == 3"><img
                                                src="../../assets/images/top3.png" alt=""></span>
                                            <span v-else>{{scope.row.rank}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="industry"
                                        label="城区"
                                        min-width="40%">
                                    </el-table-column>
                                    <el-table-column
                                        label="占比"
                                        min-width="40%"
                                    >
                                        <template slot-scope="scope">
                                            <div style="display: flex;justify-content: space-around">
                                                <span style="margin-right: 7px">{{scope.row.percent}}%</span>
                                                <el-progress
                                                            :percentage="scope.row.percent-0"
                                                             color="#1890FF"
                                                             :text-inside="true"
                                                             style="flex: 1;line-height: 21px"></el-progress>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import dateFormat from "../../commonFun/timeFormat.js";
    import {api} from '../../api/api';

    export default {
        props: {
            selectRes: {}
        },
        name: "hotSource",
        data() {
            return {
                HotRecData: [
                    {
                        rank: 1,
                        industry: '广东省',
                        percent: '98'
                    },
                    {
                        rank: 2,
                        industry: '湖南省',
                        percent: '78'
                    },
                    {
                        rank: 3,
                        industry: '湖北省',
                        percent: '68'
                    },
                    {
                        rank: 4,
                        industry: '北京',
                        percent: '58'
                    },
                    {
                        rank: 5,
                        industry: '四川省',
                        percent: '48'
                    },
                ],
                //省份来源
                province: [
                    {
                        rank: 1,
                        industry: '广东省',
                        percent: '98'
                    },
                    {
                        rank: 2,
                        industry: '湖南省',
                        percent: '78'
                    },
                    {
                        rank: 3,
                        industry: '湖北省',
                        percent: '68'
                    },
                    {
                        rank: 4,
                        industry: '北京',
                        percent: '58'
                    },
                    {
                        rank: 5,
                        industry: '四川省',
                        percent: '48'
                    },
                ],
                //城市来源
                citys: [
                    {
                        rank: 1,
                        industry: '广州市',
                        percent: '88'
                    },
                    {
                        rank: 2,
                        industry: '长沙市',
                        percent: '78'
                    },
                    {
                        rank: 3,
                        industry: '武汉市',
                        percent: '68'
                    },
                    {
                        rank: 4,
                        industry: '上海市',
                        percent: '58'
                    },
                    {
                        rank: 5,
                        industry: '成都市',
                        percent: '48'
                    },
                ],
                //城区来源
                area: [
                    {
                        rank: 1,
                        industry: '海珠区',
                        percent: '88'
                    },
                    {
                        rank: 2,
                        industry: '天心区',
                        percent: '78'
                    },
                    {
                        rank: 3,
                        industry: '武昌区',
                        percent: '68'
                    },
                    {
                        rank: 4,
                        industry: '黄浦区',
                        percent: '58'
                    },
                    {
                        rank: 5,
                        industry: '双流区',
                        percent: '48'
                    },
                ],
                bdDay: '2018-08-01',
                edDay: '2018-08-31',
            }
        },
        methods: {
            //获取信息
            getHotSrcData() {
                let provinceArr = [];
                let areaArr = [];
                let citysArr = [];
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
                api.getApi(this.QZhike + '/GetPene', info).then(res => {
                    console.log('GetPene---', res.data);
                    if (res.data) {
                        if (res.data.SysCode == 100302) {
                            this.$message.warning('登录超时,请重新登录');
                            this.$router.push('/login');
                        }
                        if(res.data[0].pData){
                            let pData = JSON.parse(res.data[0].pData);
                            for (let i = 0;i< pData.length; i++) {
                                let obj1 = {
                                    rank: parseInt(i) + 1,
                                    industry: pData[i].province,
                                    percent: pData[i].ratio == 1 ?(pData[i].ratio * 100):(pData[i].ratio * 100).toFixed(2),
                                };
                                provinceArr.push(obj1);
                            }
                        }

                        if(res.data[0].cData){
                            let cData = JSON.parse(res.data[0].cData);
                            for (let i = 0; i < cData.length; i++) {
                                let obj1 = {
                                    rank: parseInt(i) + 1,
                                    industry: cData[i].city,
                                    percent: cData[i].ratio == 1?(cData[i].ratio * 100):(cData[i].ratio * 100).toFixed(2),
                                };
                                citysArr.push(obj1)
                            }
                        }

                        if(res.data[0].aData){
                            let aData = JSON.parse(res.data[0].aData);
                            for (let i = 0;i < aData.length; i++) {
                                let obj1 = {
                                    rank: parseInt(i) + 1,
                                    industry: aData[i].district,
                                    percent: aData[i].ratio==1?(aData[i].ratio * 100):(aData[i].ratio * 100).toFixed(2),
                                };
                                areaArr.push(obj1)
                            }
                        }

                        this.province = provinceArr;
                        this.citys = citysArr;
                        this.area = areaArr;
                        console.log(this.province.length, this.citys.length, this.area.length);
                        console.log(this.province, this.citys, this.area);
                        if (res.data.SysCode == 100302) {
                            this.$message.warning("登录超时,请重新登录");
                            this.$router.push("/login");
                        }
                    }

                })
            },
            // 时间格式规范
            formatTime(val) {
                return dateFormat.toDate(val, "/");
            },
        },
        mounted() {
            let apid = sessionStorage.getItem('AD_apid');
            if (apid) {
                this.getHotSrcData()
            }
        },
        watch: {
            selectRes() {
                // console.log(this.selectRes);
                this.getHotSrcData()
            },
        },
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
        /* margin-left: 10px; */
    }

    /*列表样式*/
    .style2-wrap {
        padding: 24px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .right-charts-table {
        width: 33%;
        margin-bottom: 24px;
        box-sizing: border-box;
        background-color: #ffffff;
        border: 1px solid #DEDEDE;
    }

    .right-charts-left-title h1 {
        border-bottom: 1px solid #dedede;
        height: 48px;
        line-height: 48px;
        padding-left: 24px;
    }

    .right-charts-left-list {
        padding: 0 24px;
    }

    /deep/ .el-progress-bar__innerText {
        display: none;
    }

    /deep/ .el-table .cell {
        text-align: center;
    }

    /deep/ .el-table .cell img {
        width: 18px;
        height: 24px;
    }

</style>
