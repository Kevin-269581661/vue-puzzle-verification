<template>
    <div>
        <div class="ad_mediaMana_wrap">
            <div class="ad_mediaMana_nav clearfix">
                <p>
                    <a href="#">图片库</a>
                </p>
            </div>
            <div class="mediaList_wrap">
                <div class="mediaList_container">
                    <el-tabs v-model="activeName" @tab-click="handleClick()">
                        <!--搜索框-->
                        <div class="search-wrap clearfix" v-if="!ludan">
                            <span>
                                <div style="display:inline-block">
                                    <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" size="small">
                                        <el-select v-model="select" slot="prepend" placeholder="请选择">
                                            <el-option label="方案名称" value="1" v-if="(activeName=='first')||(activeName=='second')"></el-option>
                                            <!-- <el-option label="账号名称" value="2"></el-option> -->
                                            <el-option label="资源名称" value="3"></el-option>
                                        </el-select>
                                    </el-input>
                                </div>
                            </span>
                            <el-cascader :options="citys" v-model="citySelect" :show-all-levels='false' size="small" class="plan-select" placeholder="选择地区" change-on-select filterable>
                            </el-cascader>
                            <span v-if="(activeName=='first')||(activeName=='second')">
                                <el-select v-model="LabSelect" placeholder="选择投放面" class="plan-select" size="small">
                                    <el-option label="A面" value="A"></el-option>
                                    <el-option label="B面" value="B"></el-option>
                                </el-select>
                            </span>
                            <el-cascader :options="bussiness" size="small" class="plan-select" v-model="industryIdArr" change-on-select @change="handleChange" v-if="(activeName=='first')||(activeName=='second')" filterable></el-cascader>
                            <span v-if="(activeName=='first')||(activeName=='second')">
                                <div class="block">
                                    <el-date-picker size="small" v-model="date" type="daterange" range-separator="-" format="yyyy/MM/dd" value-format="yyyy-MM-dd" start-placeholder="投放日期" end-placeholder="投放日期">
                                    </el-date-picker>
                                </div>
                            </span>
                            <span>
                                <el-button type="primary" size="small" icon="el-icon-search" class="searchBtn" @click="searchPic()" :disabled="!isSearch">搜索</el-button>
                            </span>
                            <span>
                                <el-button plain size="small" @click="reset()">重置</el-button>
                            </span>
                            <span>
                                <el-button plain size="small" @click="allDownLoad()">一键导出</el-button>
                            </span>
                        </div>
                        <el-tab-pane label="上刊" name="first">
                            <!-- 图片 -->
                            <photo :imgarr="pageUpImgArr" :show-pic="showPic"></photo>
                            <!--页码-->
                            <div class="pager" v-if="showPic ===3">
                                <el-pagination v-if="paginationShow" small background :current-page.sync="currUpPage" :page-sizes="[10, 20]" :page-size="pageUpSize" layout="sizes, prev, pager, next, jumper" :total="totalUpNum" @size-change="sizeChange" @current-change='changePage'>
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="下刊" name="second">
                            <!-- 图片 -->
                            <photo :imgarr="pageDownImgArr" :show-pic="showPic"></photo>
                            <!--页码-->
                            <div class="pager" v-if="showPic ===3">
                                <el-pagination v-if="paginationShow" small background :current-page.sync="currDownPage" :page-sizes="[10, 20]" :page-size="pageDownSize" layout="sizes, prev, pager, next, jumper" :total="totalDownNum" @size-change="sizeChange" @current-change='changePage'>
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="录单" name="fifth">
                            <div class="mediaList_container">
                                <div style="display:inline-block" v-if="ludan">
                                    <span>
                                        <el-input placeholder="请输入内容" v-model="keyword2" class="input-with-select">
                                            <el-select v-model="ludanSelect" slot="prepend" placeholder="请选择">
                                                <el-option label="任务名称" value="1"></el-option>
                                                <el-option label="创建人" value="2"></el-option>
                                            </el-select>
                                        </el-input>
                                    </span>
                                    <span>
                                        <el-button type="primary" icon="el-icon-search">搜索</el-button>
                                    </span>
                                </div>
                                <div class="table_wrap">
                                    <el-table border width="98%" :data="caseList" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
                                        <el-table-column label="任务名称" min-width="18.3%">
                                            <template slot-scope="scope">
                                                <span @click="newPath" style="color: #1890ff;cursor: pointer">{{scope.row.caseName}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="caseType" label="任务类型" min-width="11%" :filters="[{text: '上刊', value: '上刊'}, {text: '下刊', value: '下刊'}]" :filter-method="filterCaseType" :filter-multiple="false">
                                        </el-table-column>
                                        <el-table-column prop="dwNum" label="点位数量" min-width="11%">
                                        </el-table-column>
                                        <el-table-column prop="uploadImg" label="已上传图片" min-width="11%">
                                        </el-table-column>
                                        <el-table-column prop="creater" label="创建人" min-width="11%">
                                        </el-table-column>
                                        <el-table-column prop="account" label="创建账号" min-width="13.8%">
                                        </el-table-column>
                                        <el-table-column prop="createDate" label="创建时间" min-width="11.3%">
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </el-tab-pane> -->
                    </el-tabs>
                </div>
            </div>
            <!-- <div class="bottom-btn">
                <el-button plain>返回</el-button>
            </div> -->
        </div>
    </div>
</template>

<script>
import { api } from "../../api/api.js";
import photo from './components/photo.vue';
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
            keyword: "",
            LabSelect: "",
            date: '',
            industryIdArr: [],
            bussiness: [],
            // tab默认选择第一项
            activeName: "first",
            //是否搜索到图片
            showPic: 1,

            showBtn: false,
            // assetID: `005B201803GZ-X446`,
            // address: `广东广州市天河区黄埔大道中`,
            // keyword2: "",
            //录单搜索行
            ludan: false,
            ludanSelect: "任务名称",

            // showPic: 3,
            //  录单
            input: "",
            value6: "",
            //表格
            caseList: [
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                },
                {
                    caseName: "珠江帝景地产三月份方案",
                    caseType: "上刊",
                    dwNum: "60",
                    uploadImg: "73",
                    creater: "冯少宏",
                    account: "fengshaohong",
                    createDate: "2018.05.26"
                }
            ]
        };
    },
    created() {
        this.sessionData = JSON.parse(sessionStorage.getItem('session_data'));
        this.getIndustry();
        this.getAllCity();
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
                imgType: type,
                pageNum: (type =='SK') ? this.currUpPage : this.currDownPage,
                pageSize: (type =='SK') ? this.pageUpSize : this.pageDownSize,
            };
            let range = this.date;
            let select = this.select;
            let keyword = this.keyword;
            let lab = this.LabSelect;
            let city = this.citySelect;
            let industry = this.industryIdArr;
            if(select == 1){
                info.selectType = 'ap';
            }
            if(select == 3){
                info.selectType = 'res';
            }
            if(keyword){
                info.wd = keyword;
            }
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
        // 搜索分页
        searchFun(){
            if(this.activeName == 'first'){
                let upinfo = this.searchFormat('SK');
                this.getUpImgInfo(upinfo);
            }else if(this.activeName == "second"){
                let downinfo = this.searchFormat('XK');
                this.getDownImgInfo(downinfo);
            }
        },
        // 获取上刊图片数据
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
        // 获取上刊图片数据
        getDownImgInfo(params) {
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
                        this.totalDownNum = dataInfo.total;
                        this.currDownPage = dataInfo.pageNum;
                        for(let data of dataInfo.list){
                            if( (typeof data.pRemarks) == 'string'){
                                data.pRemarks = JSON.parse(data.pRemarks);
                            }
                        }
                        this.pageDownImgArr = dataInfo.list;
                        addload.close();
                        console.log('pageup----', this.pageDownImgArr);
                        if(this.pageDownImgArr.length){
                            this.showPic = 3;
                        }else{
                            this.showPic = 2;
                        }
                    } else if (res.data.SysCode == 100302) {
                        addload.close();
                        this.loginTimeout();
                    } else {
                        addload.close();
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
            if(this.activeName == 'first'){
                this.currUpPage = 1;
                this.pageUpSize = pageVal;
                this.searchFun();
            }else if(this.activeName == 'second'){
                this.currDownPage = 1;
                this.pageDownSize = pageVal;
                this.searchFun();
            }
        },
        // 分页功能
        changePage(page) {
            console.log('page----', page);
            if(this.activeName == 'first'){
                this.currUpPage = page;
                this.searchFun();
            }else if(this.activeName == 'second'){
                this.currDownPage = page;
                this.searchFun();
            }
        },
        // tabClick
        handleClick() {
            this.reset();
        },
        // 重置
        reset(){
            this.keyword = '';
            this.LabSelect = '';
            this.date = [];
            this.citySelect = [];
            this.industryIdArr = [];
            this.pageUpImgArr = [];
            this.pageDownImgArr = [];

            this.showPic = 1;
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
                !this.keyword &&
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
        newPath() {
            this.$router.push("./ludanReport");
        }
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

    .mediaList_wrap .mediaList_container {
        width: 96%;
        margin: 0 32px;
    }

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

/*上刊*/
/deep/ .type-select .el-input,
/deep/ .type-select .el-input__inner {
    width: 95px;
    position: relative;
    top: 0;
    left: -5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 0;
    padding-left: 10px;
}

.searchInput /deep/ .el-input__inner,
.searchInput {
    width: 224px !important;
    position: relative;
    left: -7px;
    top: 0;
    border-left: none !important;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
}

/deep/ .plan-select .el-input,
/deep/ .plan-select .el-input__inner {
    width: 160px;
}
/deep/ .el-input-group .el-input__suffix {
    right: 5px;
}
/*搜索到的图片列表*/
.input-with-select /deep/ .el-input__inner {
    font-size: 14px;
    vertical-align: middle;
}

/deep/ .plan-select .el-input__inner {
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

.pager{
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

/*录单*/
/deep/ .el-table {
    width: 98% !important;
}

.el-input {
    width: 240px;
    border-radius: 4px;
}

/deep/ .el-date-editor .el-range-separator {
    line-height: 26px;
}

/*表格*/
/deep/ .el-date-editor .el-range-separator {
    line-height: 26px;
}

/deep/ .el-table th,
.el-table tr {
    height: 44px;
    padding: 0;
    background-color: #f7f7f7;
}

/deep/ .el-table td {
    padding: 12px 0;
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

/deep/ .el-table .caret-wrapper {
    width: 22px;
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ecf5ff;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    height: 480px;
    overflow-y: scroll;
    overflow-x: hidden;
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

/*超出省略*/
/deep/ .el-table .cell {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/deep/ .el-table .el-table_1_column_3 .cell {
    width: 95px;
}

/*筛选*/
/deep/ .el-table__column-filter-trigger {
    margin-left: 10px;
}

/deep/ .el-table th > .cell.highlight {
    color: #409eff !important;
}

/deep/ div.el-table-filter {
    left: 1106px !important;
}

.bottom-btn {
    text-align: center;
    margin-bottom: 30px;
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

/*日期控件*/
.block {
    display: inline-block;
    margin-left: 2px;
    position: relative;
}

/deep/ .el-range-separator {
    position: relative;
    top: -2px;
}

/deep/ .el-input__inner {
    width: 260px;
}

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
    float: left;
    position: relative;
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

.search-wrap span {
    float: left;
    margin-left: 4px;
}

.mediaList_container .search-wrap span {
    float: left;
    margin-left: 4px;
}

/deep/ .el-cascader {
    line-height: 19px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}

/deep/ .el-tabs__nav-wrap::after {
    height: 1px;
}
.search-wrap /deep/ .el-date-editor--daterange.el-input__inner{
    max-width: 238px;
}
</style>
