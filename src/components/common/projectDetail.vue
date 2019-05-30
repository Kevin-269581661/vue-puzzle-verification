<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">工程管理</a>
            </p>
        </div>
        <div class="comList_wrap">
            <div class="comList_head">
                <h2>上画任务</h2>
            </div>
            <div class="comList_container">
                <el-row>
                    <el-col :span="5">
                        <span>所属线路:</span>
                        <b>{{projectInfo.line}}</b>
                    </el-col>
                    <el-col :span="6">
                        <span>工程人员:</span>
                        <el-select v-model="projectInfo.engineer" placeholder="请选择" size="small">
                            <el-option v-for="item of engineerArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-button size="small">分配</el-button>
                    </el-col>
                    <el-col :span="5">
                        <span>上画状态:</span>
                        <b>{{projectInfo.progress}}</b>
                    </el-col>
                    <el-col :span="5">
                        <span>上画时间:</span>
                        <b>{{projectInfo.photoTime}}</b>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="primary" icon="el-icon-search" @click="download()" size="small">导出清单</el-button>
                    </el-col>
				</el-row>
                <el-row class="car-title">
                    <p>
                        订单:<span>{{projectInfo.orderNum}}</span>
                        小区:<span>{{projectInfo.resNum}}</span>
                        媒体:<span>{{projectInfo.mediaNum}}</span>
                        点位:<span>{{projectInfo.adsNum}}</span>
                        已上画:<span>{{projectInfo.finishNum}}</span>
                    </p>
                </el-row>
                <div class="table_wrap">
                    <div class="" v-for="item in projectOrderList" :key="item.orderId">
                        <el-row>
                            <el-col>
                                <b>订单名:</b>
                                <b>{{item.orderName}}</b>
                            </el-col>
                            <el-col>
                                (包含小区: <b>{{item.resNum}}</b>
                                媒体: <b>{{item.mediaNum}}</b>
                                点位: <b>{{item.adsNum}}</b>
                                已上画: <b>{{item.finishNum}}</b>
                                上画率: <b>{{(item.progress*100).toFixed(2)}}%</b>
                                 )
                            </el-col>
                        </el-row>
                        <el-table border :data="item.asidList">
                            <el-table-column type="index" label="序号" width="60">
                            </el-table-column>
                            <el-table-column prop="resName" label="小区">
                            </el-table-column>
                            <el-table-column prop="mTitle" label="媒体">
                            </el-table-column>
                            <el-table-column prop="asLab" label="投放面">
                            </el-table-column>
                            <el-table-column prop="adSize" label="尺寸">
                            </el-table-column>
                            <el-table-column prop="assetTag" label="资产编号">
                            </el-table-column>
                            <el-table-column prop="mRemark" label="点位备注">
                            </el-table-column>
                            <el-table-column prop="materialUrl" label="素材" width="60">
                            </el-table-column>
                            <el-table-column prop="resAddress" label="详情地址">
                            </el-table-column>
                            <el-table-column prop="state" label="状态">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        MessageBox,
        Message,
    } from "element-ui";
    // 时间控件格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import api from "../../api/api.js";
    export default {
        data(){
            return{
                // 搜索数据
                projectInfo:{
                    line: '线路一',
                    engineer: [],
                    progress: 0.8,
                    photoTime: '2019-06-01',
                    truePhotoTime: '2019-06-02',
                    orderNum: 2,
                    resNum: 34,
                    mediaNum: 45,
                    adsNum: 65,
                    finishNum: 5
                },
                // 城市
                cityArr: [],
                // 线路
                lineArr: [],
                // 工程人员
                engineerArr: [],
                // 订单
                orderArr: [],
                // 表格数据
                projectOrderList: [
                    {
                        orderId: 2,
                        orderName: '鑫苑国际新城1',
                        resNum: 34,
                        mediaNum: 45,
                        adsNum: 67,
                        finishNum: 5,
                        progress: 0.83,
                        asidList: [
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                        ],
                    },
                    {
                        orderId: 1,
                        orderName: '鑫苑国际新城1',
                        resNum: 34,
                        mediaNum: 45,
                        adsNum: 67,
                        finishNum: 5,
                        progress: 0.83,
                        asidList: [
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                        ],
                    },
                ],           
            }
        },
        methods:{
            // 导出excel
            download(){
                let resultArr = [];
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                    const tHeader = ['上画时间', '所属线路', '工程人员', '上画状态', '订单', '资源名称', '媒体', '投放面', '物料尺寸', '资产编号', '点位备注', '素材', '详细地址', '城市', '区域', '实际上刊时间'];
                    const filterVal = ['photoTime', 'line', 'engineer', 'progress', 'orderName', 'resName', 'mTitle', 'asLab', 'adSize', 'assetTag', 'mRemark', 'materialUrl', 'resAddress', 'city', 'rName', 'truePhotoTime'];
                    const list = resultArr;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, name);
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
        },
        mounted(){

        },
    };
</script>
<style scoped>
    /*面包屑导航*/
    .ad_mediaDetail_wrap {
        position: relative;
    }
    .ad_mediaDetail_nav{
        width: 92%;
        margin: 0 auto;
    }
    .ad_mediaDetail_nav p {
        position: absolute;
        left: 0;
        top: 12px;
        font-size: 14px;
        line-height: 18px;
    }

    .ad_mediaDetail_nav p a {
        color: #666;
    }

    .ad_mediaDetail_nav {
        height: 42px;
        position: relative;
    }
    /deep/.comList_container .el-input{
        max-width: 180px;
    }
    /deep/.comList_container .el-row{
        margin-top:24px;
    }

    .comList_wrap {
        width: 92%;
        background: #ffffff;
        border: 1px solid #e6e7e9;
        margin: 0 auto;
    }

    .comList_wrap .comList_head {
        width: 100%;
        height: 24px;
        padding: 12px 0;
        border-bottom: 1px solid #e6e7e9;
    }

    .comList_wrap .comList_head h2 {
        font-size: 16px;
        color: #2c313c;
        height: 24px;
        padding-left: 14px;
        font-weight: bold;
    }

    .comList_wrap .comList_container {
        width: 96%;
        margin: 24px auto;
    }
    .table_wrap{
        margin: 24px auto;
        width: 100%;
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
    /deep/ .el-button [class*=el-icon-]+span, .select-wrap button .el-icon-search{
        position: relative;
        left: -2px;
        top: 0px;
    }

    /deep/ button.el-button.el-button--default.el-button--small:hover {
        color: #666;
        border-color: #d8d8d8;
        background-color: #fff;
    }
    /deep/ .el-dropdown .el-button-group .el-button {
        height: 28px;
        width: 48px;
        font-size: 14px;
        padding: 0;
    }
    /deep/ .el-button-group button {
        float: left !important;
    }

    /deep/ .el-dropdown .el-button-group .el-button:last-child {
        width: 30px;
        position: relative;
        top: 0px;
    }

    .input-with-select /deep/ .el-input__inner {
        font-size: 14px;
        height: 34px;
        vertical-align: middle;
    }
    /deep/ .el-date-editor--daterange.el-input__inner{
        width: 240px;
    }

    /* 各个属性个数等 */
    .car-title {
        background: #E6F7FF;
        border: 1px solid #BAE7FF;
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 5px;
    }

    .car-title h4 {
        font-size: 14px;
        display: inline-block;
    }

    .car-title p {
        font-size: 14px;
        font-weight: normal;
        display: inline-block;
        margin-left: 10px;
    }

    .car-title span {
        font-size: 14px;
        font-weight: normal;
        margin: 0 6px;
        cursor: pointer;
        color: #1890ff;
    }
</style>


