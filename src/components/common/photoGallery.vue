<template>
    <div>
        <div class="ad_mediaMana_wrap">
            <div class="ad_mediaMana_nav clearfix">
                <p>
                    <a href="#">图片库</a>
                </p>
            </div>
            <div class="mediaList_wrap">
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
                                    <el-cascader :options="citys" v-model="searchInfo.citySelect" :show-all-levels='false'
                                                 size="small"
                                                 class="plan-select"
                                                 placeholder="选择地区"
                                                 :clearable="true"
                                                 @change="handleCity"
                                                 change-on-select filterable>
                                    </el-cascader>
                                </el-col>
                                <el-col :span="6">
                                    <span>行业类型：</span>
                                    <el-cascader :options="bussiness" size="small" class="plan-select" v-model="searchInfo.industryIdArr"
                                                 :clearable="true"
                                                 change-on-select
                                                 @change="handleChange"
                                                 filterable>
                                    </el-cascader>
                                </el-col>
                            </el-row>
                            <el-row :gutter="32">
                                <el-col :span="6">
                                    <span style="display: inline-block;width: 70px;text-align: right">投放面：</span>
                                    <el-select v-model="searchInfo.LabSelect" :clearable="true" placeholder="选择投放面" class="plan-select" size="small">
                                        <el-option label="A面" value="A"></el-option>
                                        <el-option label="B面" value="B"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="6">
                                    <span>投放日期：</span>
                                    <el-date-picker size="small" v-model="searchInfo.date" :clearable="true" type="daterange" range-separator="-"
                                                    format="yyyy/MM/dd" value-format="yyyy-MM-dd" start-placeholder="投放日期"
                                                    end-placeholder="投放日期">
                                    </el-date-picker>
                                </el-col>
                                <el-col :span="6">
                                    <span style="display: inline-block;width: 70px;text-align: right">上下刊：</span>
                                    <el-select v-model="searchInfo.publish" placeholder="请选择" class="plan-select" size="small">
                                        <el-option label="上刊" value="SK"></el-option>
                                        <el-option label="下刊" value="XK"></el-option>
                                        <el-option label="换画" value="HH"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="6">
                                    <el-button type="primary" icon="el-icon-search" class="searchBtn"
                                               @click="searchPic()" :disabled="!isSearch">搜索
                                    </el-button>
                                    <el-button plain @click="reset()" :disabled="!isSearch">重置</el-button>
                                    <el-button plain @click="allDownLoad()" v-show="activeName == 'first'">一键导出</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <el-tab-pane label="案例库"
                                     name="first"
                                     v-loading="firstBodyLoading"
                                     element-loading-text="玩命加载中..."
                                     element-loading-spinner="el-icon-loading">
                            <!-- 图片 -->
                            <photo :imgarr="pageUpImgArr" :show-pic="showPic" :publish="searchInfo.publish" @doSomeThing="saveChange"></photo>
                            <!--页码-->
                            <div class="ad_pagination" v-if="showPic ===3">
                                <el-pagination
                                    v-if="paginationShow"
                                    background
                                    :current-page.sync="galleryPageData.pageNum"
                                    :page-sizes="[10, 20, 50]"
                                    :page-size="galleryPageData.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="galleryPageData.totalpageNum"
                                    @size-change="sizeChange"
                                    @current-change='changePage'>
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane v-if="isShowAllTab" label="收藏夹" name="second">
                            <div v-loading="secondBodyLoading"
                                 element-loading-text="玩命加载中..."
                                 element-loading-spinner="el-icon-loading">
                                <!-- 图片 -->
                                <photo :imgarr="collectImgArr" :show-pic="showPic" :tabType = "activeName" @doSomeThing="saveChange"></photo>
                                <!--页码-->
                                <div class="ad_pagination" v-if="showPic ===3">
                                    <el-pagination v-if="paginationShow"
                                                   background
                                                   :current-page.sync="collectPageData.pageNum"
                                                   :page-sizes="[10, 20, 50]"
                                                   :page-size="collectPageData.pageSize"
                                                   layout="total, sizes, prev, pager, next, jumper"
                                                   :total="collectPageData.totalpageNum"
                                                   @size-change="sizeChange"
                                                   @current-change='changePage'>
                                    </el-pagination>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane v-if="isShowOrderPhoto" label="行业图片" name="three">
                            <order-photo></order-photo>
                        </el-tab-pane>
                    </el-tabs>
                </div>
        </div>
    </div>
</template>

<script>
    import {api} from "../../api/api.js";
    import photo from './components/photo.vue';
    import orderPhoto from "./components/orderPhoto.vue";
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
                // 数据loading
                firstBodyLoading: true,
                // 收藏夹load
                secondBodyLoading: true,
                // 是否搜索
                isSearch: false,
                // 是否显示收藏夹
                isShowAllTab: false,
                // 是否显示行业图片
                isShowOrderPhoto: false,
                // 登录信息
                sessionData: {},
                // 当前页
                paginationShow: true,
                // 上刊
                pageUpImgArr: [],
                //地区搜索
                citys: [],
                //上刊搜索行
                select: "3",
                bussiness: [],
                // tab默认选择第一项
                activeName: "first",
                beforActive: 'first',
                //是否搜索到图片
                showPic: 3,
                // 是否显示图片
                showBtn: false,
                // 搜索信息
                searchInfo: {
                    resName: '',            // 资源名称
                    apName: '',             // 方案名称
                    labSelect: '',          // A/B面
                    date: '',               // 搜索日期
                    citySelect: [],         // 地区搜索
                    industryIdArr: [],      // 搜索行业
                    publish: 'SK',          // 上下刊
                },
                // 上下刊下拉
                publish: 'SK',
                // 收藏夹图片列表
                collectImgArr: [],
                // 案例库分页
                galleryPageData: {
                    pageNum: 1,
                    pageSize: 10,
                    totalpageNum: 0
                },
                //  案例库搜索条件
                gallerySelectInfo: {
                    LabSelect: '',
                    date: '',
                    citySelect: [],
                    industryIdArr: [],
                    showPic: 1,
                    apName: '',
                    resName: '',
                    publish: 'SK',
                    pageNum: 1,
                    pageSize: 10,
                    totalpageNum: 0
                },
                // 收藏夹分页
                collectPageData: {
                    pageNum: 1,
                    pageSize: 10,
                    totalpageNum: 0
                },
                // 收藏夹搜索图片
                collectSelectInfo: {
                    LabSelect: '',
                    date: '',
                    citySelect: [],
                    industryIdArr: [],
                    showPic: 1,
                    apName: '',
                    resName: '',
                    publish: 'SK',
                    pageNum: 1,
                    pageSize: 10,
                    totalpageNum: 0
                }
            };
        },
        created() {
            let sourceCollectSelectInfo = JSON.parse(sessionStorage.getItem('collectSelectInfo')) || {};
            let sourceGallerySelectInfo = JSON.parse(sessionStorage.getItem('gallerySelectInfo')) || {};
            let _this = this;
            Object.assign(this.collectSelectInfo, sourceCollectSelectInfo);
            Object.assign(this.gallerySelectInfo, sourceGallerySelectInfo);
            this.searchInfo = JSON.parse(JSON.stringify(this.gallerySelectInfo));
            window.addEventListener("beforeunload", function(e) {
                // e.preventDefault();
                // e.returnValue = "";
                if (_this.activeName == 'first') {
                    sessionStorage.setItem('gallerySelectInfo', JSON.stringify(_this.searchInfo));
                    sessionStorage.setItem('collectSelectInfo', JSON.stringify(_this.collectSelectInfo));
                } else if (_this.activeName == 'second') {
                    sessionStorage.setItem('gallerySelectInfo', JSON.stringify(_this.gallerySelectInfo));
                    sessionStorage.setItem('collectSelectInfo', JSON.stringify(_this.searchInfo));
                }
            });
            this.getSessionData();
            // 行业
            this.getIndustry();
            this.getAllCity();
            this.searchFun();
        },
        methods: {
            getSessionData() {
                this.sessionData = JSON.parse(sessionStorage.getItem('session_data'));
                if (this.sessionData.ascType == 0 && this.sessionData.uType === 'ADN_SM') {
                    this.isShowAllTab = false
                } else {
                    this.isShowAllTab = true
                }
                if (["ADN_MD_COUNTRY", "ADN_MD", "ADN_BD_COUNTRY", "ADN_BD_KA", "ADN_BD"].includes(this.sessionData.uType)) {
                    this.isShowOrderPhoto = true
                } else {
                    this.isShowOrderPhoto = false
                }
            },
            // 获取城市
            getAllCity() {
                this.citys = areaPackage_new.cityArea();
            },
            // 城市下拉改变时，省份不选中
            handleCity(val) {
                if(Array.isArray(val) && val.length == 1) {
                    this.searchInfo.citySelect = []
                }
            },
            // 选择行业
            handleChange(val) {
                this.industryIdArr = val;
            },
            // 获取所有行业信息
            getIndustry() {
                let arr = JSON.parse(sessionStorage.getItem("industry"));
                this.bussiness = industryToText.cascader(arr);
            },
            //tab切换
            handleClick() {
                console.log('tabClick切换', this.activeName)
                if (this.activeName == 'first') {
                    if (this.beforActive === 'second') {
                        this.collectSelectInfo = JSON.parse(JSON.stringify(this.searchInfo))
                    }
                    this.searchInfo = JSON.parse(JSON.stringify(this.gallerySelectInfo))
                    if (this.pageUpImgArr.length <= 0) {
                        let params = this.searchFormat();
                        this.getImgList(params)
                    } else {
                        this.showPic = 3;
                    }
                } else if (this.activeName == 'second') {
                    if (this.beforActive === 'first') {
                        this.gallerySelectInfo = JSON.parse(JSON.stringify(this.searchInfo))
                    }
                    this.searchInfo = JSON.parse(JSON.stringify(this.collectSelectInfo))
                    let collectParams = this.searchFormat();
                    this.getCollectImgList(collectParams)
                } else if (this.activeName == 'three') {
                    if (this.beforActive === 'first') {
                        this.gallerySelectInfo = JSON.parse(JSON.stringify(this.searchInfo))
                    }
                    if (this.beforActive === 'second') {
                        this.collectSelectInfo = JSON.parse(JSON.stringify(this.searchInfo))
                    }
                }
                this.beforActive = this.activeName
            },
            // 重置
            reset() {
                console.log('重置activeName', this.activeName)
                this.resetData(this.searchInfo)
                this.initPage()
                if (this.activeName == 'first') {
                    this.pageUpImgArr = [];
                    this.resetData(this.gallerySelectInfo)
                    let collectParams = this.searchFormat();
                    this.getImgList(collectParams)
                } else if (this.activeName == 'second') {
                    this.collectImgArr = [];
                    this.resetData(this.collectSelectInfo)
                    let collectParams = this.searchFormat();
                    this.getCollectImgList(collectParams)
                }
            },
            // 数据初始化
            resetData(selectInfo) {
                for (let key in selectInfo) {
                    if (key === 'citySelect' || key === 'industryIdArr') {
                        selectInfo[key] = []
                    } else if (key === 'publish') {
                        selectInfo[key] = 'SK'
                    } else {
                        selectInfo[key] = ''
                    }
                }
            },
            // 搜索
            searchFun() {
                if (this.activeName == 'first') {
                    this.galleryPageData.pageNum = 1
                    let upinfo = this.searchFormat();
                    this.pageUpImgArr = []
                    this.getImgList(upinfo);
                } else if (this.activeName == "second") {
                    this.collectPageData.pageNum = 1
                    let collectParams = this.searchFormat();
                    this.collectImgArr = []
                    this.getCollectImgList(collectParams)
                }
            },
            // 搜索数据格式化
            searchFormat() {
                let session = this.sessionData;
                if (this.activeName == 'first') {
                    let info = {
                        uid: session.uID,
                        token: session.token,
                        imgType: this.searchInfo.publish, // type,
                        orderName: this.searchInfo.apName,
                        resourceName: this.searchInfo.resName,
                        asLab: this.searchInfo.LabSelect,
                        prid: '',
                        pageNum: this.galleryPageData.pageNum,
                        pageSize: this.galleryPageData.pageSize,
                    };
                    if (this.searchInfo.date) {
                        info.ls = this.searchInfo.date[0];
                        info.le = this.searchInfo.date[1];
                    }
                    if (this.searchInfo.citySelect[1]) {
                        info.prid = this.searchInfo.citySelect[1];
                    }
                    if (this.searchInfo.citySelect[2]) {
                        info.rid = this.searchInfo.citySelect[2];
                    }
                    if (this.searchInfo.industryIdArr) {
                        info.iId = this.searchInfo.industryIdArr[1];
                    }
                    console.log(this.activeName, 'type---', info);
                    return info;
                } else if (this.activeName == "second") {
                    let info = {
                        uid: session.uID,
                        token: session.token,
                        type: this.searchInfo.publish === "SK" ? 0 : this.searchInfo.publish === "XK" ? 1 : 2,
                        orderName: this.searchInfo.apName,
                        resourceName: this.searchInfo.resName,
                        asLabel: this.searchInfo.LabSelect,
                        pageNo: this.collectPageData.pageNum,
                        pageSize: this.collectPageData.pageSize,
                    };
                    if (this.searchInfo.industryIdArr) {
                        info.industryId = this.searchInfo.industryIdArr[1];
                    }
                    if (this.searchInfo.citySelect[2]) {
                        info.regionId = this.searchInfo.citySelect[2];
                    }
                    if (this.searchInfo.date) {
                        info.startDate = this.searchInfo.date[0];
                        info.endDate = this.searchInfo.date[1];
                    }
                    console.log(this.activeName, 'type---', info);
                    return info;
                }
            },
            // 获取上/下刊图片数据
            getImgList(params){
                this.firstBodyLoading = true
                for (let i in params) {
                    console.log(params[i])
                    if (!params[i]) {
                        delete params[i]
                    }
                }
                api.getApi(this.apiVar.Advertisement + "/GetImgListV2", params).then(res=>{
                    console.log('案例库res',res)
                    if (res.data.SysCode === 200200) {
                        let resData = res.data.data
                        let imgList = []
                        for (let key of resData) {
                            imgList.push({
                                pUrl: key.picUrl,
                                // id: key.id,
                                pID: key.id,
                                userId: key.userId,
                                pUTime: key.publishDate,
                                isCollection: key.isCollection,
                                lId: key.lId,
                                pRemarks: {
                                    plan: key.orderName,
                                    res: key.resourceName,
                                    media: key.mediaName,
                                    city: key.cityName,
                                    asLab: key.asLable,
                                    brand: key.brandName || '--',
                                    username: key.userName,
                                    assettag: key.assetNumber || '--',
                                    address: key.address || '--',
                                },
                            })
                        }
                        if (imgList.length > 0) {
                            this.showPic = 3
                        } else {
                            this.showPic = 1
                        }
                        this.galleryPageData.totalpageNum = res.data.total
                        this.pageUpImgArr = imgList
                    } else {
                        this.messageFun('warning', res.data.MSG)
                        this.showPic = 1
                    }
                    this.firstBodyLoading = false
                    this.isSearch = true;
                }).catch(err=>{
                    console.log('err',err)
                    this.isSearch = true;
                })
            },
            // 获取收藏夹图片列表
            getCollectImgList(params) {
                console.log('获取收藏夹图片列表params', params)
                this.secondBodyLoading = true
                if (!params.orderName) {
                    delete params.orderName
                }
                if (!params.resourceName) {
                    delete params.resourceName
                }
                if (!params.asLabel) {
                    delete params.asLabel
                }
                api.getApi(this.apiVar.Advertisement + '/imageCollection/list', params).then(res => {
                    console.log('收藏夹图片列表res', res);
                    if (res.data.SysCode === 200200) {
                        let resData = res.data.data
                        let imgList = []
                        for (let key of resData) {
                            imgList.push({
                                pUrl: key.picUrl,
                                id: key.id,
                                pID: key.pId,
                                userId: key.userId,
                                pUTime: key.publishDate,
                                isCollection: true,
                                pRemarks: {
                                    plan: key.orderName,
                                    res: key.resourceName,
                                    media: key.mediaName,
                                    city: key.cityName,
                                    asLab: key.asLable,
                                    brand: key.brandName || '--',
                                    username: key.userName,
                                    assettag: key.assetNumber || '--',
                                    address: key.address || '--',
                                },
                            })
                        }
                        if (imgList.length > 0) {
                            this.showPic = 3
                        } else {
                            this.showPic = 1
                        }
                        this.collectPageData.totalpageNum = res.data.total
                        this.collectImgArr = imgList
                    } else {
                        this.messageFun('warning', res.data.MSG)
                        this.showPic = 1
                    }
                    this.secondBodyLoading = false
                    this.isSearch = true;
                }).catch(res => {
                    console.log(res);
                    this.isSearch = true;
                });
            },
            // 保存或取消
            saveChange() {
                if (this.activeName == 'first') {
                    this.collectImgArr = []
                } else if (this.activeName == 'second') {
                    // 最后一页（大于1页）且是最后一张图片
                    if (this.collectImgArr.length <= 1 && this.collectPageData.pageNum > 1) {
                        this.collectPageData.pageNum -= 1
                    }
                    let collectParams = this.searchFormat();
                    this.getCollectImgList(collectParams)
                }
            },
            // 每页的条数
            sizeChange(pageVal) {
                console.log("pageVal", pageVal);
                if (this.activeName === 'first') {
                    // this.galleryPageData.pageNum = 1
                    this.galleryPageData.pageSize = pageVal
                } else if (this.activeName === 'second') {
                    // this.collectPageData.pageNum = 1
                    this.collectPageData.pageSize = pageVal
                }
                this.searchFun();
            },
            // 页数
            changePage(page) {
                console.log('page----', page); //
                if (this.activeName === 'first') {
                    this.galleryPageData.pageNum = page
                    let upinfo = this.searchFormat();
                    this.getImgList(upinfo);
                } else if (this.activeName === 'second') {
                    this.collectPageData.pageNum = page
                    let collectParams = this.searchFormat();
                    this.getCollectImgList(collectParams)
                }
            },
            // 分页初始化
            initPage() {
                if (this.activeName === 'first') {
                    this.galleryPageData.pageNum = 1
                    this.galleryPageData.pageSize = 10
                } else if (this.activeName === 'second') {
                    this.collectPageData.pageNum = 1
                    this.collectPageData.pageSize = 10
                }
            },
            // 导出功能
            allDownLoad() {
                Message.warning('此功能尚未开放');
            },
            // 区域二级联动
            getCitys(arr) {
                let cityArr = [];
                for (let data of arr) {
                    if (data.pRemarks) {
                        if ((typeof data.pRemarks) == 'string') {
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
                let timer = setTimeout(() => {
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
            // 操作提示统一方法
            messageFun(mesType, mes) {
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
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
        width: 92%;
        font-size: 14px;
        line-height: 42px;
        margin: 0 auto;
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
        width: calc(98% - 73px);
    }
    .el-row .el-date-editor{
        width: calc(98% - 70px);
    }
    /deep/.el-row .el-select.plan-select{
        width: calc(98% - 70px);
    }
    .plan-select .el-input__inner{
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
