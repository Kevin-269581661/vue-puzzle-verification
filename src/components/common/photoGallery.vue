<template>
    <div>
        <div class="ad_mediaMana_wrap">
            <div class="ad_mediaMana_nav clearfix">
                <p>
                    <a href="#">图片库</a>
                </p>
            </div>
            <div class="mediaList_wrap">
                <!--<div class="mediaList_container">-->
                    <el-tabs v-model="activeName" @tab-click="handleClick()">
                        <!--搜索框-->
                        <div v-if="(activeName=='first')||(activeName=='second')">
                            <el-row :gutter="32">
                                <el-col :span="6">
                                    <span>资源名称：</span>
                                    <el-input v-model="searchInfo.resName" size="small" placeholder="请输入资源名称"></el-input>
                                </el-col>
                                <el-col :span="6">
                                    <span>方案名称：</span>
                                    <el-input v-model="searchInfo.apName" size="small" placeholder="请输入方案名称"></el-input>
                                </el-col>
                                <el-col :span="6">
                                    <span>城市区域：</span>
                                    <el-cascader :options="citys" v-model="citySelect" :show-all-levels='false'
                                                 size="small"
                                                 class="plan-select"
                                                 placeholder="选择地区"
                                                 change-on-select filterable>
                                    </el-cascader>
                                </el-col>
                                <el-col :span="6">
                                    <span>行业类型：</span>
                                    <el-cascader :options="bussiness" size="small" class="plan-select" v-model="industryIdArr"
                                                 change-on-select
                                                 @change="handleChange"
                                                 filterable>
                                    </el-cascader>
                                </el-col>
                            </el-row>
                            <el-row :gutter="32">
                                <el-col :span="6">
                                    <span>&nbsp;投 放 面：</span>
                                    <el-select v-model="LabSelect" placeholder="选择投放面" class="plan-select" size="small">
                                        <el-option label="A面" value="A"></el-option>
                                        <el-option label="B面" value="B"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="6">
                                    <span>投放日期：</span>
                                    <el-date-picker size="small" v-model="date" type="daterange" range-separator="-"
                                                    format="yyyy/MM/dd" value-format="yyyy-MM-dd" start-placeholder="投放日期"
                                                    end-placeholder="投放日期">
                                    </el-date-picker>
                                </el-col>
                                <el-col :span="6">
                                    <span>&nbsp;上 下 刊：</span>
                                    <el-select v-model="publish" placeholder="请选择" class="plan-select" size="small">
                                        <el-option label="上刊" value="SK"></el-option>
                                        <el-option label="下刊" value="XK"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="6">
                                    <el-button type="primary" size="small" icon="el-icon-search" class="searchBtn"
                                               @click="searchPic()" :disabled="!isSearch">搜索
                                    </el-button>
                                    <el-button plain size="small" @click="reset()">重置</el-button>
                                    <el-button plain size="small" @click="allDownLoad()">一键导出</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <el-tab-pane label="案例库" name="first">
                            <!-- 图片 -->
                            <photo :imgarr="pageUpImgArr" :show-pic="showPic"></photo>
                            <!--页码-->
                            <div class="pager" v-if="showPic ===3">
                                <el-pagination
                                    v-if="paginationShow"
                                    small background
                                    :current-page.sync="currUpPage"
                                    :page-sizes="[10, 20]"
                                    :page-size="pageUpSize"
                                    layout="sizes, prev, pager, next, jumper"
                                    :total="totalUpNum"
                                    @size-change="sizeChange"
                                    @current-change='changePage'>
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="收藏夹" name="second">
                            <!-- 图片 -->
                            <photo :imgarr="pageDownImgArr" :show-pic="showPic"></photo>
                            <!--页码-->
                            <div class="pager" v-if="showPic ===3">
                                <el-pagination v-if="paginationShow" small background
                                               :current-page.sync="currDownPage"
                                               :page-sizes="[10, 20]"
                                               :page-size="pageDownSize"
                                               layout="sizes, prev, pager, next, jumper"
                                               :total="totalDownNum"
                                               @size-change="sizeChange"
                                               @current-change='changePage'>
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="行业图片" name="three">
                            <order-photo></order-photo>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            <!--</div>-->
        </div>
    </div>
</template>

<script>
    import {api} from "../../api/api.js";
    import photo from './components/photo.vue';
    import orderPhoto from "./components/orderPhoto.vue"
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import industryToText from "../../commonFun/industryToText.js";
    import areaPackage_new from "../../commonFun/areaPackage_new.js";
    import {
        Button,
        Input,
        Table,
        TableColumn,
        Row,
        Tooltip,
        Tabs,
        TabPane,
        Select,
        Option,
        Cascader,
        DatePicker,
        Pagination,
        Message
    } from "element-ui";
    import timeFormat from '../../commonFun/timeFormat.js';

export default {
    name: "PhotoGallery",
    components: {
        elButton: Button,
        elInput: Input,
        elTable: Table,
        elTableColumn: TableColumn,
        elRow: Row,
        elTooltip: Tooltip,
        elTabs: Tabs,
        elTabPane: TabPane,
        elSelect: Select,
        elOption: Option,
        elCascader: Cascader,
        elDatePicker: DatePicker,
        elPagination: Pagination,
        photo,
        orderPhoto,
    },
    data() {
        return {
            // 是否搜索
            isSearch: true,
            // 登录信息
            sessionData:{},
            // 当前页
            paginationShow: true,
            currUpPage: 1,
            currDownPage: 1,
            totalUpNum: 0,
            totalDownNum: 0,
            pageUpSize: 10,
            pageDownSize: 10,
            // 上刊
            pageUpImgArr: [],
            // 下刊
            pageDownImgArr: [],
            //地区搜索
            citys: [],
            citySelect: [],
            //上刊搜索行
            select: "3",
            // keyword: "",
            LabSelect: "",
            date: '',
            industryIdArr: [],
            bussiness: [],
            // tab默认选择第一项
            activeName: "three",
            //是否搜索到图片
            showPic: 1,
            showBtn: false,
            //录单搜索行
            ludan: false,
            ludanSelect: "任务名称",
            // showPic: 3,
            //  录单
            input: "",
            value6: "",
            // 搜索信息
            searchInfo:{
                resName: '',
                apName: '',
            },
            // 上下刊下拉
            publish: 'SK',
        };
    },
    created() {
        this.sessionData = JSON.parse(sessionStorage.getItem('session_data'));
        this.getIndustry();
        this.getAllCity();
        // this.searchFun();
    },
    methods: {
        // 获取城市
        getAllCity(){
            this.citys = areaPackage_new.cityArea();
            console.log(this.citys);
        },
        // 选择行业
        handleChange(val) {
            console.log("industryIdArr---------", val);
            this.industryIdArr = val;
        },
        // 获取所有行业信息
        getIndustry() {
            let arr = JSON.parse(sessionStorage.getItem("industry"));
            this.bussiness = industryToText.cascader(arr);
        },
        // 搜索数据格式化
        searchFormat(type){
            let session = this.sessionData;
            let info = {
                uid: session.uID,
                token: session.token,
                imgType: this.publish, // type,
                pageNum: this.currUpPage,
                pageSize: this.pageUpSize,
                // pageNum: (type =='SK') ? this.currUpPage : this.currDownPage,
                // pageSize: (type =='SK') ? this.pageUpSize : this.pageDownSize,
            };
            let range = this.date;
            let select = this.select;
            // let keyword = this.keyword;
            let lab = this.LabSelect;
            let city = this.citySelect;
            let industry = this.industryIdArr;
            if(select == 1){
                info.selectType = 'ap';
                info.wd = this.searchInfo.apName
            }
            if(select == 3){
                info.selectType = 'res';
                info.wd = this.searchInfo.resName
            }
            // if(keyword){
            //     info.wd = keyword;
            // }
            if(range){
                info.ls = range[0];
                info.le = range[1];
            }
            if(lab){
                info.asLab = lab;
            }
            if(city[1]){
                info.prid = city[1];
            }
            if(city[2]){
                info.rid = city[2];
            }
            if(industry){
                info.iId = industry[1];
            }
            console.log('type---', info);
            return info;
        },
        // 搜索
        searchFun(){
            let upinfo = this.searchFormat();
            this.pageUpImgArr = []
            this.initPage = []
            this.getUpImgInfo(upinfo);
            // if(this.activeName == 'first'){
            //     let upinfo = this.searchFormat('SK');
            //     this.getUpImgInfo(upinfo);
            // }else if(this.activeName == "second"){
            //     let downinfo = this.searchFormat('XK');
            //     this.getDownImgInfo(downinfo);
            // }
        },
        // 获取上/下刊图片数据
        getUpImgInfo(params) {
            let addload = this.$loading({
                lock: true,
                text: '玩命加载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            api.getApi(this.apiVar.Advertisement+"/GetImgList", params)
                .then(res => {
                    if (!res.data.SysCode) {
                        console.log(res.data);
                        let dataInfo = res.data;
                        this.totalUpNum = dataInfo.total;
                        this.currUpPage = dataInfo.pageNum;
                        if(dataInfo.total){
                            for(let data of dataInfo.list){
                                if( (typeof data.pRemarks) == 'string'){
                                    data.pRemarks = JSON.parse(data.pRemarks);
                                }
                            }
                            this.pageUpImgArr = dataInfo.list;
                            console.log('pageup----', this.pageUpImgArr);
                            addload.close();
                            if(this.pageUpImgArr.length){
                                this.showPic = 3;
                            }else{
                                this.showPic = 2;
                                Message.warning('暂无数据');
                            }
                        }else{
                            addload.close();
                            this.showPic = 2;
                            Message.warning('暂无数据');
                        }
                    } else if (res.data.SysCode == 100302) {
                        addload.close();
                        this.loginTimeout();
                    } else {
                        addload.close();
                        this.pageUpImgArr = [];
                        this.showPic = 2;
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    addload.close();
                    console.log(res);
                });
        },
        // 页数大小改变
        sizeChange(pageVal) {
            console.log("pageVal", pageVal);
            this.currUpPage = 1;
            this.pageUpSize = pageVal;
            this.searchFun();
            // if(this.activeName == 'first'){
            //     this.currUpPage = 1;
            //     this.pageUpSize = pageVal;
            //     this.searchFun();
            // }else if(this.activeName == 'second'){
            //     this.currDownPage = 1;
            //     this.pageDownSize = pageVal;
            //     this.searchFun();
            // }
        },
        // 分页功能
        changePage(page) {
            console.log('page----', page);
            this.currUpPage = page;
            this.searchFun();
            // if(this.activeName == 'first'){
            //     this.currUpPage = page;
            //     this.searchFun();
            // }else if(this.activeName == 'second'){
            //     this.currDownPage = page;
            //     this.searchFun();
            // }
        },
        // tabClick
        handleClick() {
            this.reset();
        },
        // 重置
        reset(){
            // this.keyword = '';
            this.LabSelect = '';
            this.date = [];
            this.citySelect = [];
            this.industryIdArr = [];
            this.pageUpImgArr = [];
            this.pageDownImgArr = [];

            this.showPic = 1;
        },
        // 分页初始化
        initPage(){
            this.currUpPage = 1;
            this.pageUpSize = 10;
        },
        // 导出功能
        allDownLoad(){
            Message.warning('此功能尚未开放');
        },
         // 区域二级联动
        getCitys(arr) {
            let cityArr = [];
            for (let data of arr) {
                if (data.pRemarks) {
                    if( (typeof data.pRemarks) == 'string'){
                        data.pRemarks = JSON.parse(data.pRemarks);
                    }
                    let obj = {
                        value: data.pRemarks.city,
                        label: data.pRemarks.city,
                        children: []
                    };
                    if (
                        JSON.stringify(cityArr).indexOf(JSON.stringify(obj)) === -1
                    ) {
                        cityArr.push(obj);
                    }
                }
            }
            for (let item of cityArr) {
                for (let data of arr) {
                    if (data.pRemarks) {
                        let areaObj = {
                            value: data.pRemarks.area,
                            label: data.pRemarks.area
                        };
                        if (data.pRemarks.city == item.value) {
                            // 去重
                            if (
                                JSON.stringify(item.children).indexOf(JSON.stringify(areaObj)) === -1
                            ) {
                                item.children.push(areaObj);
                            }
                        }
                    }
                }
            }
            console.log("cityArr---------------fda", cityArr);
            return cityArr;
        },
        // 搜索图片
        searchPic() {
            this.isSearch = false;
            let timer = setTimeout(()=>{
                this.isSearch = true;
                clearTimeout(timer);
            }, 1000);
            if (
                !this.select &&
                // !this.keyword &&
                !this.LabSelect &&
                !this.date &&
                !this.citySelect.length &&
                !this.industryIdArr.length
            ) {
                Message.warning("请先输入搜索条件");
            } else {
                this.searchFun();
            }
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },

        //筛选
        filterCaseType(value, row) {
            return row.tag === value;
        },
    },

};
</script>

<style scoped>
    /deep/ .el-cascader__label {
        line-height: 32px;
    }

    /*面包屑导航*/
    .ad_mediaMana_wrap {
        margin-bottom: 50px;
    }

    .ad_mediaMana_nav p {
        padding-left: 57px;
        position: absolute;
        left: 0;
        top: 12px;
        font-size: 14px;
        line-height: 18px;
    }

    .ad_mediaMana_nav p a {
        color: #666;
    }

    .ad_mediaMana_nav {
        height: 42px;
        position: relative;
    }

    .ad_mediaMana_nav p a:nth-of-type(1) {
        color: #999;
    }

    /*wrap*/
    .mediaList_wrap {
        width: 92%;
        background: #ffffff;
        border: 1px solid #e6e7e9;
        margin: 0 auto;
    }

    .mediaList_wrap .mediaList_head {
        width: 100%;
        height: 24px;
        padding: 12px 0;
        border-bottom: 1px solid #e6e7e9;
    }

    .mediaList_wrap .mediaList_head h2 {
        font-size: 16px;
        color: #2c313c;
        height: 24px;

        padding-left: 14px;
        font-weight: bold;
    }

 /*   .mediaList_wrap .mediaList_container {
        width: 96%;
        margin: 0 32px;
    }*/

    /*tabs*/
    /deep/ .el-tabs__item {
        font-size: 16px;
        color: #999999;
    }

    /deep/ .el-tabs__item.is-top.is-active {
        font-weight: bold;
        color: #409eff;
    }

    /deep/ .el-tabs__nav {
        height: 49px;
        line-height: 49px;
    }


  /*  /deep/ .plan-select .el-input,
    /deep/ .plan-select .el-input__inner {
        width: 160px;
    }*/

    /deep/ .el-input-group .el-input__suffix {
        right: 5px;
    }

    /*搜索条件*/
    .el-row{
        margin-bottom: 24px;
    }
    .el-row span{
        color: rgba(0,0,0,0.85);
        font-size: 14px;
    }
    .el-row .el-input{
        width: calc(98% - 70px);
    }
    /deep/.el-row .el-cascader.plan-select{
        width: calc(98% - 76px);
    }
    .el-row .el-date-editor{
        width: calc(98% - 70px);
    }
    /deep/.el-row .el-select.plan-select{
        width: calc(98% - 70px);
    }
    ..plan-select .el-input__inner{
        width: 100%;
    }
    /*搜索到的图片列表*/
    .input-with-select /deep/ .el-input__inner {
        font-size: 14px;
        vertical-align: middle;
    }

    /deep/ .el-dialog {
        box-shadow: none;
    }

    .detailBox {
        padding-left: 10px;
        margin-top: 10px;
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 13px;
        display: flex;
        flex-direction: column;
    }

    .detailBox p {
        font-size: 14px;
        color: #333333;
    }

    .detailBox > span {
        font-size: 10px;
        color: #999999;
    }

    .detailBox .icons {
        font-size: 10px;
        color: #999999;
        margin-top: 12px;
        position: relative;
    }

    .icon span {
        float: left;
    }

    .icons img {
        width: 14px;
        height: 14px;
        position: relative;
        top: 2px;
    }

    .icons span + span {
        margin-left: 15px;
    }

    .icons .content p {
        font-size: 10px;
        color: #666666;
    }

    .el-icon-info,
    .el-icon-location {
        font-size: 13px;
    }

    .icons .el-icon-info {
        position: absolute;
        right: 12px;
        top: 2px;
    }

    .infoBox {
        padding: 10px;
    }

    .infoBox i {
        display: inline-block;
        width: 22px;
        height: 22px;
        font-size: 10px;
        color: #ffffff;
        border-radius: 50%;
        background-color: #91acf9;
        font-style: normal;
        text-align: center;
        line-height: 20px;
    }

    .infoBox span {
        font-size: 10px;
        color: #333333;
    }

    .infoBox em {
        font-size: 10px;
        color: #999999;
        margin-left: 20px;
        float: right;
        position: relative;
        top: 5px;
    }

    /*页码*/
    .pager {
        width: 100%;
        margin-top: 20px;
        text-align: right;
    }

    /deep/ .el-pagination.is-background .el-pager li {
        font-weight: normal;
        font-size: 13px;
        background-color: transparent;
    }

    /deep/ .el-select__caret {
        position: relative;
        right: 4px;
    }

    .up-report-bottom {
        text-align: center;
        margin-top: 20px;
    }

    /deep/ .el-pager .number {
        background-color: transparent;
    }

    /deep/ .el-date-editor .el-range-separator {
        line-height: 26px;
    }

    /*筛选*/
    .el-checkbox + .el-checkbox {
        margin-left: 0;
    }

    .typeBox p {
        height: 30px;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        border-top: 1px solid #cccccc;
    }

    /deep/ .el-checkbox__label {
        font-size: 10px;
        color: #8a8a8a;
    }

    /*下拉搜索框*/
    /deep/ .el-input-group__prepend {
        width: 64px;
        background-color: #fff;
    }

    /deep/ .el-input-group--prepend .el-select .el-input__inner {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        width: 104px;
    }

    /deep/ .el-input-group--prepend .el-input__inner {
        width: 185px;
    }

    .el-input {
        border-radius: 4px;
    }

    /*按钮*/
    /deep/ .el-button--default:focus,
    .el-button--default:hover {
        color: #606266;
        border-color: #dcdfe6;
        background-color: #fcfcfc;
    }

    /deep/ .el-tabs__nav-wrap::after {
        height: 1px;
    }
    /*tag颜色覆盖*/
    /deep/ .mediaList_wrap .el-tabs__content{
        padding: 24px 32px;
    }
    /deep/ .mediaList_wrap .el-tabs__header{
        padding: 0 32px;
        margin: 0;
        border-bottom: 1px solid #e4e7ed;
    }

    /deep/ .mediaList_wrap .el-tabs__nav-wrap::after{
        width: 0;
    }

    /deep/ .mediaList_wrap .el-tabs__item.is-active{
        color: #1890FF;
    }

    /deep/ #tab-roadGate{
        margin-left: 18px;
    }
</style>
