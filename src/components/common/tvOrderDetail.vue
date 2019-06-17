<template>
    <div class="mediaDetail">
        <div class="ad_mediaMana_wrap clearfix">
            <div class="ad_mediaMana_nav">
                <p>
                    <a href="#">电视广告</a>
                    <em> / </em>
                    <a href="#">方案详情</a>
                </p>
                <div class="tip">该方案由 {{planDetail.realName}} 创建于 {{planDetail.create_time}}</div>
            </div>
            <!--资源信息-->
            <div class="mediaMana_content_top">
                <div class="content_top_wrap" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                    <div class="plan-title">
                        <h4>
                            <img src="../../assets/images/orderlogo.png" alt="">{{planDetail.apName}}
                        </h4>
                        <div class="handleBtn">
                            <el-button type="primary" @click="edit()" v-if="(role=='BD')|| (role=='MD')" :disabled="planDetail.apState!=0">编辑</el-button>
                            <el-button @click="changState()" :disabled="planDetail.apState!=0" >投放</el-button>
                        </div>
                    </div>
                    <div>
                        <div class="plan-detail">
                            <div class="plan-detail-left">
                                <ul>
                                    <li>
                                        <span>公司名称:</span>
                                        <em>{{planDetail.cName}}</em>
                                    </li>
                                    <li>
                                        <span>联系人:</span>
                                        <em>{{planDetail.cuName}}</em>
                                    </li>
                                    <li>
                                        <span>投放城市:</span>
                                        <!-- <em>{{filter(planDetail.rIDs)}}</em> -->
                                        <em>{{planDetail.rIDs}}</em>
                                    </li>
                                    <li>
                                        <span>公司品牌:</span>
                                        <em>{{planDetail.bTitle}}</em>
                                    </li>
                                    <li>
                                        <span>所属销售:</span>
                                        <em>{{planDetail.realName}}</em>
                                    </li>
                                    <li>
                                        <span>起止日期:</span>
                                        <em>{{planDetail.startEndTime}}</em>
                                    </li>
                                </ul>
                            </div>
                            <div class="plan-detail-right">
                                <dl>
                                    <dt>状态</dt>
                                    <dd>{{stateToText(planDetail.apState)}}</dd>
                                </dl>
                                <dl>
                                    <dt>方案金额</dt>
                                    <dd>¥ {{priceFormat(planDetail.Total)}}</dd>
                                </dl>
                            </div>
                        </div>
                        <div class="plan-panel">
                            <el-tabs v-model="planPanel" @tab-click="handleClick()">
                                <el-tab-pane label="报价单" name="first">
                                    <div class="first-wrap box-wrap">
                                        <h4>报价单</h4>

                                        <div class="table_wrap price_box">
                                            <el-table border :data="setpointArr" style="width: 100%" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                                                <el-table-column prop="city" label="城市" min-width="6%">
                                                </el-table-column>
                                                <el-table-column prop="resNum" label="社区数量" min-width="7.4%">
                                                </el-table-column>
                                                <el-table-column prop="totalDay" label="合计面·天" min-width="8.8%">
                                                    <template slot-scope="scope">
                                                        <span>{{scope.row.totalDay||'--'}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="adPrice" label="刊例价/周" min-width="6.0%" class="tar">
                                                    <template slot-scope="scope">
                                                        <span>{{scope.row.adPrice || 1000}}</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column label="折扣" min-width="9.0%">
                                                    <template slot-scope="scope">
                                                        <span>{{(scope.row.count).toFixed(2)}}%</span>
                                                    </template>
                                                </el-table-column>
                                                <el-table-column prop="price" label="金额" min-width="9.2%">
                                                    <template slot-scope="scope">
                                                        <span>&yen;{{scope.row.price?priceFormat(scope.row.price):0}}</span>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="物料信息" name="second">
                                    <div class="first-wrap box-wrap">
                                        <h4>物料信息</h4>

                                        <div class="table_wrap">
                                            <el-table :data="materialMsgTableData" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px" class="materialMsgFrom">
                                                <el-table-column prop="material" label="素材类型" width="100">
                                                </el-table-column>
                                                <el-table-column prop="adsize" label="尺寸">
                                                </el-table-column>
                                                <el-table-column prop="type" label="格式">
                                                </el-table-column>
                                                <el-table-column prop="limitsize"  label="大小限制">
                                                </el-table-column>
                                                <el-table-column prop="fileName" label="文件">
                                                    <template slot-scope="scope">
                                                        <a :href="scope.row.fileName.url" target="_blank" :download="scope.row.fileName.url">{{scope.row.fileName.name}}</a>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                        </div>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="投放效果" name="third" v-if="planDetail.apState && (dateArr.length)">
                                    <div class="first-wrap box-wrap">
                                        <h4>投放效果
                                            <el-select v-model="resValue" placeholder="请选择" size="small" style="margin-left:30px;font-weight:normal;" @change="changeChart">
                                                <el-option v-for="item in resList" :key="item.value" :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </h4>

                                        <div class="table_wrap">
                                            <div class="charts-wrap">
                                                <div id="clientLine" ref="clientLine" style="width:100%;height:300px;"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="first-wrap box-wrap num_box">
                                        <h4>社区曝光量
                                            <el-input placeholder="输入小区名称进行搜索" size="small" v-model="keywordRes" style="font-weight:normal;" @change="initData()">
                                                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchRes()" style="cursor:pointer;"></i>
                                            </el-input>
                                        </h4>

                                        <div class="table_wrap areanum_box" v-if="dateArr.length">
                                            <el-table :data="currAreaNum" border style="width: 100%" height="300" ref="singleTable" @row-click="rowClick" highlight-current-row @current-change="handleCurrentChange">
                                                <el-table-column fixed prop="resName" label="社区名称" width="150">
                                                </el-table-column>
                                                <template v-for="(item, index) of dateArr">
                                                    <el-table-column :label="item" :key="index" v-if="index>=0&&index<dateArr.length">
                                                        <template slot-scope="scope">
                                                            <span :key="scope.$index+'-'+index">{{scope.row.dateData[index].show_count}}</span>
                                                        </template>
                                                    </el-table-column>
                                                </template>
                                            </el-table>
                                        </div>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                            <div class="content_bottom_btn">
                                <el-button class="cancel" @click="goBack()">返回</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mediaMana_content_bottom clearfix">
                <div class="content_bottom_wrap">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api } from "../../api/api.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import {
    Table,
    TableColumn,
    Tabs,
    TabPane,
    Button,
    Message,
    MessageBox
} from "element-ui";
import timeFormat from '../../commonFun/timeFormat.js';

export default {
    name: "planDetail",
    components: {
        elTable: Table,
        elTableColumn: TableColumn,
        elTabs: Tabs,
        elTabPane: TabPane,
        elButton: Button,
    },
    data() {
        return {
            // 社区绑定值
            resValue: '',
            // 社区列表
            resList:[],
            // 表格当前点击行
            currentRow: '',
            // 社区曝光量关键字
            keywordRes: '',
            //加载中
            // loading: true,
            loading: false,
            role: "",
            // 方案详情
            planDetail: {
                apName: '',
                cName: '',
                cuName:'',
                rIDs: '',
                bTitle: '',
                realName: '',
                startEndTime: '',
                create_time: '',
                apState: 1,
                Total: 0
            },
            // 报价单
            setpointArr: [],
            // 物料信息
            materialMsgTableData: [
                {
                    typeIndex: 1,
                    material: '图片素材',
                    adsize: '400x218',
                    type: 'png/jpg/gif/webp',
                    limitsize: '300kb',
                    fileName: {
                        name: '',
                        url: ''},
                }, {
                    typeIndex: 2,
                    material: '图片素材',
                    adsize: '440x300',
                    type: 'png/jpg/gif/webp',
                    limitsize: '1M',
                    fileName: {
                        name: '',
                        url: ''},
                }, {
                    typeIndex: 3,
                    material: '图片素材',
                    adsize: '440x500',
                    type: 'png/jpg/gif/webp',
                    limitsize: '1M',
                    fileName: {
                        name: '',
                        url: ''},
                }, {
                    typeIndex: 4,
                    material: '图片素材',
                    adsize: '400x500',
                    type: 'png/jpg',
                    limitsize: '300kb',
                    fileName: {
                        name: '',
                        url: ''},
                },{
                    typeIndex: 5,
                    material: '图片素材',
                    adsize: '1000x300',
                    type: 'png/jpg/gif/webp',
                    limitsize: '1M',
                    fileName: {
                        name: '',
                        url: ''},
                },{
                    typeIndex: 6,
                    material: '图片素材',
                    adsize: '1920*1080',
                    type: 'png/jpg',
                    limitsize: '500kb',
                    fileName: {
                        name: '',
                        url: ''},
                },{
                    typeIndex: 7,
                    material: '视频素材',
                    adsize: '1920*1080',
                    type: 'mp4',
                    limitsize: '10M',
                    fileName: {
                        name: '',
                        url: ''},
                }, {
                    typeIndex: 8,
                    material: '视频素材',
                    adsize: '1920*1080',
                    type: 'mp4',
                    limitsize: '20M',
                    fileName: {
                        name: '',
                        url: ''},
                }
                ],
            // 社区曝光量
            areaNum:[],
            currAreaNum:[],
            dateArr:[],
            planPanel: "first",
            //客户量
            clientLineData:{
                // xData:['2018/08/22','2018/08/19','2018/08/19','2018/08/19','2018/08/19','2018/08/19','2018/08/19'],
                // yData:[120, 132, 101, 134, 90, 230, 210]
                xData:[],
                yData:[]
            },
        };
    },
    methods: {
        // 社区数
        getContructRes(){
            let res = [];
            for(let data of this.areaNum){
                let obj = {
                    resName: data.resName,
                    resId: data.resId,
                    value: data.resName,
                    label: data.resName,
                    dateData: data.dateData
                };
                res.push(obj);
            }
            this.resList = res;
        },
        // tab点击
        handleClick() {
            if (this.planPanel == "first") {

            }else if(this.planPanel == "third"){
                // this.clientLine();
                console.log(this.clientLineData);
                let timer = setTimeout(() => {
                    this.clientLine();
                    clearTimeout(timer);
                }, 0);
            }
        },
        // 获取详情数据
        getInitData() {
            // 真实数据
            let apid = sessionStorage.getItem("tvOrder_apid");
            let info = {
                plan_id: apid
            };

            api.getApi(this.apiVar.QKuyun+'/GetPlanDetail', info).then(res =>{
                console.log(res.data);
                if(res.data.code == 500200){
                    let result = res.data.data;
                    // let result = dataObj;
                    let setpointArr = result.planDetailSummaries;
                    let materialInfo = result.plansAttachments;
                    let areaNum = result.planDetails;
                    let setArr = [];
                    let materArr = [];
                    let areaArr = [];

                    areaNum.push({
                        "id": -1,
                        "city": "--",
                        "district": "--",
                        "community": "合计",
                        show: result.show

                    });
                    // 头部信息
                    let detailObj = {
                        apName: result.plan_name,
                        cName: result.company,
                        cuName: result.contacts,
                        rIDs: result.cities,
                        bTitle: result.brand,
                        realName: result.sales,
                        startEndTime: timeFormat.toDate(result.begin_date, '/')+'-'+timeFormat.toDate(result.end_date, '/'),
                        apState: result.status,
                        create_time: timeFormat.toDate(result.create_time),
                        Total: result.budget
                    };
                    this.planDetail = detailObj;

                    // 报价单
                    let citys = [];
                    for(let item of setpointArr){
                        citys.push(item.city);
                        let setObj = {
                            city: item.city,
                            resNum: item.community_count,
                            totalDay: item.duration,
                            adPrice: item.discount,
                            count: item.discount,
                            price: item.total
                        };
                        setArr.push(setObj);
                    }
                    this.setpointArr = setArr;
                    this.$set(this.planDetail, 'rIDs', citys.join(','));
                    // 物料信息
                    for(let item of materialInfo){
                        for(let data of this.materialMsgTableData){
                            if(item.type == data.typeIndex){
                                // scope.row.fileName.url.includes('http')?scope.row.fileName.name:scope.row.fileName.url
                                this.$set(data.fileName, 'name', item.url.includes('http')?item.file_name:item.url);
                                this.$set(data.fileName, 'url', item.url);
                                break;
                            }
                        }
                    }
                    console.log(this.materialMsgTableData);
                    if(areaNum[0].show){
                        for(let data of areaNum[0].show){
                            this.dateArr.push(timeFormat.toDate(data.date, '/'));
                        }
                    }
                    // 曝光信息
                    for(let data of areaNum){
                        let tmp ={
                            resId: data.id,
                            resName: data.community,
                            dateData: data.show,
                        };
                        areaArr.push(tmp);
                    }
                    this.areaNum = areaArr;
                    this.currAreaNum = areaArr;
                    console.log(this.dateArr);
                    console.log(areaArr);

                    console.log('result.show-----', result.show)
                    if(result.show){
                        let yData = [];
                        let xData = [];
                        for(let data of result.show){
                            xData.push(data.date);
                            yData.push(data.show_count);
                        }
                        this.clientLineData = {
                            xData: xData,
                            yData: yData
                        }
                        // this.clientLine();
                    }
                    console.log('areaNum-----', this.areaNum);
                    this.getContructRes();
                    this.getCityPrice();
                }
            });

        },
        //获取城市价格列表
        getCityPrice(){
            let params = {}
            // console.log('获取城市价格列表',)
            api.getApi(this.apiVar.QKuyun + '/GetAdPrice',params).then(res=>{
                console.log('获取城市价格列表',res)
                let dataArr = res.data.data;
                for(let data of this.setpointArr){
                    for(let item of dataArr){
                        if(item.city.includes(data.city) || item.city == data.city){
                            this.$set(data, 'adPrice', item.price);
                            break;
                        }
                    }
                }
            })
        },
        // 表格合并行
        getSpanArr(data) {
            for (let i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0
                } else {
                    // 判断当前元素与上一个元素是否相同
                    if (data[i].material === data[i - 1].material) {
                        this.spanArr[this.pos] += 1;
                        this.spanArr.push(0);
                    } else {
                        this.spanArr.push(1);
                        this.pos = i;
                    }
                }
            }
        },
        /*通过给table传入span-method方法可以实现合并行或列，方法的参数是一个对象，里面包含当前行row、
        当前列column、当前行号rowIndex、当前列号columnIndex四个属性。该函数可以返回一个包含两个元素的数组，
        第一个元素代表rowspan，第二个元素代表colspan。 也可以返回一个键名为rowspan和colspan的对象。*/
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            // console.log(this.spanArr);
            // console.log('row',row,'column',column,'rowIndex',rowIndex,'columnIndex',columnIndex)
            if (columnIndex === 0) {
                const _row = this.spanArr[rowIndex];
                const _col = _row > 0 ? 1 : 0;
                return {
                    rowspan: _row,
                    colspan: _col
                }
            }
        },
        // 状态转换成文本
        stateToText(val) {
            let state = [
                { text: "进行中", value: 0 },
                { text: "未投放", value: 1 },
                { text: "投放中", value: 2 },
                { text: "已完成", value: 3 },
            ];
            for (let data of state) {
                if (val == data.value) {
                    return data.text;
                }
            }
        },
        // 时间格式规范
        formatTime(val) {
            return dateFormat.toDate(val, ".");
        },
        // 价格加上逗号
        priceFormat(price) {
            // console.log('price', price);
            return commaFormat.init(price);
        },
        setCurrent(row) {
            this.$refs.singleTable.setCurrentRow(row);
        },
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        // 点击曝光量表格的某一行
        rowClick(row, event, column){
            console.log(row, event, column);
            console.log(row.resId, row.resName);
            // this.getIndex=row.index
            this.setCurrent(row);
            this.resValue = row.resName;
            // this.funcToyData(row.dateData);

            this.changeChart();
            // console.log(this.resValue);
        },
        funcToyData(arr){
            let result = [];
            for(let data of arr){
                result.push(data.show_count);
            }
            console.log('ydata---', result);
            return result;
        },
        // 返回
        goBack() {
            this.$router.push("./tvOrderList");
        },
        // 编辑
        edit() {
            this.$router.push("./advertTV?edit=y");
        },
        // 投放
        changState(){
            console.log('投放');
            this.$message({
                type: 'warning',
                message: '如需投放电视广告请联系全国运营中心',
                duration: 1500,
            });
            return;
            // 投放接口
            let info = {
                plan_id: sessionStorage.getItem("tvOrder_apid")
            };
            MessageBox.confirm(
                "是否对<b>" + this.planDetail.apName + "</b>方案进行投放？",
                "提示",
                {
                    confirmButtonText: "是",
                    cancelButtonText: "否",
                    dangerouslyUseHTMLString: true,
                    type: "warning"
                }
            )
                .then(() => {
                    let loading = this.$loading({
                        lock: true,
                        text: '正在执行...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    api.getApi(this.apiVar.QKuyun+'/LaunchPlan', info).then(res =>{
                        console.log(res.data);
                        loading.close();
                        if(res.data.code == 500200){
                            this.planDetail.apState = res.data.data;
                            Message.success(res.data.msg);
                        }else if(res.data.code ==500100 || res.data.code ==500500){
                            Message.warning(res.data.msg);
                            MessageBox.confirm(
                                `是否跳转去修改方案？`,
                                "提示",
                                {
                                    confirmButtonText: "确定",
                                    cancelButtonText: "取消",
                                    type: "warning"
                                }
                            )
                                .then(() => {
                                    this.$router.push("./advertTV?edit=y");
                                })
                                .catch(() => {
                                    Message.info("已取消操作");
                                });
                        }else{
                            Message.warning(res.data.msg);
                        }
                    });
                })
                .catch(() => {
                    Message.info("已取消操作");
                });
        },
        // 改变社区展示图表
        changeChart(){
            console.log(this.resValue);
            for(let data of this.areaNum){
                if(data.resName == this.resValue){
                    this.setCurrent(data);
                    this.clientLineData.xData = this.dateArr;
                    this.clientLineData.yData = this.funcToyData(data.dateData);
                    break;
                }
            }
            this.getChartData();
            console.log('change_resValue----', this.resValue);
        },
        // 获取图表数据
        getChartData(){
            console.log('get some chartData----');
            this.clientLine();
        },
        initData(){
            if (!this.keywordRes) {
                this.currAreaNum = JSON.parse(JSON.stringify(this.areaNum));
            }
        },
        // 社区曝光量搜索
        searchRes(){
            console.log(this.keywordRes);
            console.log(this.resList);
            if(this.keywordRes){
                let result = [];
                this.currAreaNum = [];
                for(let data of this.areaNum){
                    if(data.resName.includes(this.keywordRes)){
                        console.log(data);
                        result.push(data);
                    }
                }
                this.currAreaNum = result;
                console.log(this.currAreaNum);
            }
        },
        // 获取角色
        getRole() {
            this.role = JSON.parse(
                sessionStorage.getItem("session_data")
            ).uType;
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
        // 客户数
        clientLine() {
            let clientLine = this.$echarts.init(this.$refs.clientLine);
            // alert(1);
            clientLine.setOption({
                color: ["#92bdee"],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross",
                        label: {
                            backgroundColor: "#4AA6FC"
                        }
                    }
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        boundaryGap: false,
                        data: this.clientLineData.xData,
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
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "value",
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
                    }
                ],
                series: [
                    {
                        name: "交易额",
                        type: "line",
                        stack: "总量",
                        smooth: true,
                        areaStyle: { normal: {} },
                        itemStyle: {
                            normal: {
                                lineStyle: {
                                    width: 2, //折线宽度
                                    color: "#1890ff" //折线颜色
                                }
                            }
                        },
                        data: this.clientLineData.yData
                    }
                ]
            });
            window.addEventListener("resize", function () {
                clientLine.resize();
            });
        },
    },
    mounted(){
        // 获取角色
        this.getRole();
        // 获取选点排期数据
        this.getInitData();

        this.spanArr = []
        this.getSpanArr(this.materialMsgTableData)
        // this.clientLine();
    },
};
</script>

<style scoped>
/*状态行*/
/deep/ .el-table .warning-row {
    background: #fff1f1;
}

/*tabbar*/
/deep/ .el-textarea__inner {
    resize: vertical;
}

/deep/ .el-tabs__nav-wrap::after {
    background-color: transparent;
}

.box-wrap {
    border: 1px solid #e6e7e9;
    background-color: #fff;
}
.num_box{
    margin-top: 15px;
}

.plan-detail {
    font-size: 14px;
    color: #333333;
    padding-left: 41px;
}

.plan-detail-left {
    float: left;
    width: 78%;
}

.plan-detail-left ul {
    width: 100%;
    float: left;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.plan-detail-left ul li {
    float: left;
    width: 280px;
    margin-bottom: 12px;
}

.plan-detail-left ul li em {
    font-size: 14px;
    color: #666666;
}

.plan-detail-right {
    display: flex;
    justify-content: space-between;
    width: 21%;
    float: right;
}

.plan-detail-right dl {
    float: left;
    text-align: right;
}

.plan-detail-right dt {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
}

.plan-detail-right dd {
    margin-top: 4px;
    display: inline-block;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
}
/*1920*/
@media all and (min-width: 1900px) {
    .plan-detail-left ul li {
        width: 400px;
    }

    .plan-detail-right {
        width: 15%;
    }
}

.plan-panel {
    position: absolute;
    /* top: 225px; */
    top: 155px;
    width: 100%;
    left: 0;
}

/deep/ .el-tabs__nav-scroll {
    padding-left: 28px;
}

.baojiadan /deep/ .el-tabs__nav-scroll {
    padding-left: 0;
}

.box-wrap > h4 {
    height: 55px;
    padding-left: 28px;
    border-bottom: 1px solid #e6e7e9;
    font-size: 16px;
    color: rgba(51, 51, 51, 0.85);
    line-height: 55px;
    font-weight: bold;
}

/deep/ .el-table__column-filter-trigger {
    left: 5px;
}

/*选点排期*/
/deep/ .el-checkbox + .el-checkbox {
    margin-left: 10px;
}

/deep/ .el-table__expanded-cell[class*="cell"] {
    padding: 0 46px;
    background-color: #f7f7f7;
}

/deep/ .el-table__expanded-cell[class*="cell"] .el-form {
    height: 44px;
    line-height: 44px;
}

/deep/ .el-form-item__content {
    line-height: 46px;
}

/deep/ .el-form-item__label {
    padding: 0 0 0 12px;
}

.table_wrap {
    padding: 28px;
    width: 96%;
}
  /*滚动条*/
.areanum_box{
    width: 96%;
}
.charts-wrap{
    width: 100%;
}
/*折线图客户量*/
#clientLine{
    /* width: 83%; */
    width: 100%;
    height: 300px;
}
/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ecf5ff;
}

/deep/ .el-tabs__item.is-active {
    font-weight: bold;
}

.searchBtn {
    position: relative;
    /*top: 3px;*/
    /*left: -3px;*/
}

/deep/ .searchBtn .el-icon-search {
    position: relative;
    top: -2px;
    left: -9px !important;
}

/deep/ .el-button.searchBtn span {
    position: relative;
    left: -5px;
    top: -2px;
}
/deep/ .el-button {
    /*width: 76px;*/
    height: 34px;
    margin-left: 2px;
}
/*报价单*/

/deep/ .el-tabs--border-card {
    box-shadow: none;
}

/deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 40px;
}

.panel {
    padding: 20px;
}

.step3 {
    padding: 0 105px;
}

.bill-title {
    width: 100%;
    height: 181px;
    box-sizing: border-box;
    border: 1px solid #d8d8d8;
    margin-bottom: 10px;
    padding: 22px 60px;
}

.bill-title h4 {
    font-size: 18px;
    color: #333333;
    font-weight: bold;
    margin-bottom: 12px;
}

.bill-title p {
    margin-bottom: 12px;
    font-size: 14px;
    color: #666666;
}

.bill-title-left {
    float: left;
}

.bill-title-right {
    float: right;
    font-size: 14px;
    color: #666666;
}

.bill-title-right p {
    text-align: right;
    position: relative;
}

.bill-title-right em {
    float: right;
    position: absolute;
    right: 225px;
    top: 0;
    width: 100px;
}

.bill-title-right .totalPrice {
    font-size: 22px;
    color: #333333;
}

/deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 40px;
}

.tab-info h4 {
    width: 100%;
    background: #fafafa;
    border-radius: 2px;
    font-size: 16px;
    color: #333333;
    height: 34px;
    line-height: 34px;
    padding-left: 20px;
    font-weight: bold;
}

.tab-info p {
    margin-bottom: 40px;
    margin-top: 20px;
    margin-left: 20px;
    font-size: 14px;
    color: #666666;
}

.price {
    width: 100%;
    height: 300px;
}

.price-left {
    box-sizing: border-box;
    padding-right: 66px;
    width: 49%;
    float: left;
    border-right: 2px dashed #d8d8d8;
}

.price-right {
    width: 49%;
    float: right;
    padding-left: 66px;
    box-sizing: border-box;
}

.tab-info .price h4 {
    width: 90%;
}

.tab-info .price h4 button {
    width: 50px;
    height: 24px;
    background: #e6f1fc;
    border: 1px solid #a3d0fd;
    border-radius: 4px;
    float: right;
    font-size: 12px;
    color: #1989fa;
    position: relative;
    top: 5px;
    right: 10px;
    outline: none;
}

/deep/ .el-button.el-button--text span {
    position: relative;
    top: -5px;
}

.price ul li {
    font-size: 14px;
    color: #666666;
    border-bottom: 1px solid #d8d8d8;
    height: 50px;
    line-height: 50px;
    margin-left: 19px;
    margin-right: 28px;
}

.price ul li:last-child {
    text-align: right;
    border-bottom: none;
    font-size: 18px;
    color: #333333;
    font-weight: bold;
}

.price ul li span {
    float: right;
}

.bottom {
    width: 100%;
    height: 181px;
    background: #fafafa;
    box-sizing: border-box;
    padding: 21px;
}

.tab-info .bottom p {
    margin: 0;
    font-size: 14px;
    color: #666666;
}

.bottom .remark {
    display: inline-block;
    width: 60%;
    height: 105px;
}

.bottom .bill-title-right li {
    font-size: 18px;
    color: #666666;
    margin-bottom: 8px;
}

.bottom .bill-title-right li em {
    font-size: 14px;
    color: #666666;
}

.bottom-detail {
    border-bottom: 2px dashed #d8d8d8;
}

.bottom-fin {
    margin-top: 15px;
}

.bottom-fin p {
    float: right;
}

.bottom-fin span {
    font-size: 22px;
    color: #333333;
    font-weight: bold;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    height: 480px;
}

/*详情头部*/
.content_top_wrap {
    padding: 34px 28px;
    background: #ffffff;
    border: 1px solid #dedede;
    /* height: 195px; */
    height: 125px;
    position: relative;
}

.plan-title .handleBtn {
    position: absolute;
    right: 28px;
    top: 30px;
}

.plan-title .handleBtn button {
    width: 74px;
    height: 32px;
    font-size: 14px;
    line-height: 9px;
    padding: 0;
}

.plan-title h4 {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    margin-bottom: 22px;
}

.plan-title h4 p {
    display: inline-block;
    font-size: 14px;
    color: #666666;
    font-weight: normal;
    margin-left: 11px;
}

.plan-title h4 p img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 1px;
    cursor: pointer;
}

.plan-title h4 img {
    width: 28px;
    height: 28px;
    position: relative;
    top: 5px;
    margin-right: 16px;
}

/*面包屑导航*/
.tip {
    position: absolute;
    right: 88px;
    font-size: 14px;
    color: #999999;
    top: 12px;
}

/*资源信息*/
.mediaMana_content_top {
    padding: 8px 60px 0 60px;
}

.mediaMana_content_bottom {
    padding: 11px 60px;
}

.content_bottom_wrap {
    height: 612px;
    margin-top: 178px;
}

/*按钮*/
.content_bottom_btn {
    margin-top: 20px;
    width: 100%;
    text-align: center;
}

.content_bottom_btn button {
    width: 80px;
    height: 34px;
    outline: none;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    background: #ffffff;
    font-size: 14px;
    color: #666666;
}

/*1440*/
@media all and (min-width: 1420px) {
    .tab-info .price h4 {
        width: 92%;
    }

    .up-loader-Imgpanel + .up-loader-Imgpanel {
        margin-left: 39px;
    }

    .up-loader-Imgpanel:nth-child(4) {
        margin-left: 0;
    }
}

/*1920*/
@media all and (min-width: 1900px) {
    .tab-info .price h4 {
        width: 94%;
    }
    .up-loader-Imgpanel + .up-loader-Imgpanel {
        margin-left: 54px;
    }

    .up-loader-Imgpanel:nth-child(5) {
        margin-left: 0;
    }
}
</style>
<style>
.num_box .el-input{
    width: 200px;
    margin-left:30px;
}
.num_box /deep/.el-input__inner{
    width: 200px;
    display: inline-block;
}
</style>
