<template>
    <div>
        <div>
            <div class="ad_mediaMana_wrap">
                <div class="mediaMana_content_top">
                    <div class="content_top_wrap">
                        <div class="title">
                            <h1>{{Report.apName}}{{Report.ptype=='SK'?'上刊':'下刊'}}报告</h1>
                        </div>
                        <div class="detail">
                            <p>
                                <em>订单名称：</em>
                                <!-- <i>广州探鱼2期</i> -->
                                <i>{{Report.apName}}</i>
                                <em>任务类型：</em>
                                <!-- <i>上刊</i> -->
                                <i>{{Report.ptype}}</i>
                                <em>点位数量：</em>
                                <i>{{Report.totalNum}}</i>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="plan-panel">
                    <div class="sec-wrap box-wrap">
                        <h4>监播图片</h4>
                        <div class="tabs">
                            <button class="active" @click="changeImgType">按资源分</button>
                            <button @click="changeImgType">按图片分</button>
                        </div>
                        <div class="typeOfRec" v-if="isActive">
                            <div>
                                <div class="picBox" v-for="(down, downIndex) of currDownReportArr" :key="down.asID" @mouseenter="showPreImg = downIndex" @mouseleave="showPreImg = null">
                                    <el-carousel :autoplay="false" trigger="click">
                                        <el-carousel-item v-for="(item, index) in down.downImgArr" :key="index" >
                                            <img :src="item.url" alt="">
                                            <!--缩略图-->
                                            <div class="mask-btn" v-if="showPreImg == downIndex ">
                                                <i class="el-icon-search" @click="handlePictureCardPreview(item.url)"></i>
                                            </div>
                                        </el-carousel-item>
                                    </el-carousel>
                                    <div class="pic-title">
                                        <p>小区名称：{{down.pAlt.res}}</p>
                                        <p>门禁名称：{{down.pAlt.media}}</p>
                                        <p>资产编号：{{down.pAlt.assettag}}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- 分页功能 -->
                            <div class="pager">
                                <!-- <el-pagination small background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[5, 10]" :page-size="5" layout=" sizes, prev, pager, next, jumper" :total="30">
                                </el-pagination> -->
                                <el-pagination small background :current-page="currUpPage" :page-sizes="[5, 10]" :page-size="pageUpSize" layout="sizes, prev, pager, next, jumper" :total="downReportArr.length" @size-change="handleUpSizeChange" @current-change='changeUpPage'>
                                </el-pagination>
                            </div>
                        </div>
                        <div class="typeOfPic" v-if="!isActive">
                            <div>
                                <div class="picBox" v-for="(img, index) of currImgInfo" :key="index" @mouseenter="showPreImg = index" @mouseleave="showPreImg = null">
                                    <img :src="img.pURL" alt="">
                                    <!--缩略图-->
                                    <div class="mask-btn" v-if="showPreImg == index ">
                                        <i class="el-icon-search" @click="handlePictureCardPreview(img.pURL)"></i>
                                    </div>
                                    <div class="pic-title">
                                        <p>小区名称：{{img.pAlt.res}}</p>
                                        <p>门禁名称：{{img.pAlt.media}}</p>
                                        <p>资产编号：{{img.pAlt.assettag}}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="pager">
                                <!-- <el-pagination small background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1" :page-sizes="[5, 10]" :page-size="5" layout=" sizes, prev, pager, next, jumper" :total="30">
                                </el-pagination> -->
                                <el-pagination small background :current-page="currDownPage" :page-sizes="[5, 10]" :page-size="pageDownSize" layout="sizes, prev, pager, next, jumper" :total="imgInfo.length" @size-change="handleDownSizeChange" @current-change='changeDownPage'>
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </div>
                <!--缩略图对话框-->
                <el-dialog :visible.sync="dialogVisible">
                    <img style="width: 100%;height: 100%" :src="dialogImageUrl" alt="">
                </el-dialog>

            </div>
        </div>
    </div>

</template>

<script>
import { api } from "../../api/api";
import {
    Dialog,
    Tabs,
    TabPane,
    Table,
    TableColumn,
    Input,
    Button,
    Upload,
    Select,
    Option,
    Checkbox,
    Card,
    Progress,
    Cascader,
    Pagination,
    MessageBox,
    Message,
    Form,
    FormItem,
    Carousel,
    CarouselItem
} from "element-ui";
export default {
    name: "ludanReport",
    components: {
        elDialog: Dialog,
        elTabs: Tabs,
        elTabPane: TabPane,
        elTable: Table,
        elTableColumn: TableColumn,
        elInput: Input,
        elButton: Button,
        elUpload: Upload,
        elSelect: Select,
        elOption: Option,
        elCheckbox: Checkbox,
        elCard: Card,
        elProgress: Progress,
        elCascader: Cascader,
        elPagination: Pagination,
        elForm: Form,
        elFormItem: FormItem,
        elCarousel: Carousel,
        elCarouselItem: CarouselItem
    },
    created(){
        this.getCompanyInfo();
        this.getInitData();
    },
    data() {
        return {
            // 报告头部公司信息
            Report: {},
            // 分页信息
            currUpPage: 1,
            currDownPage: 1,
            pageUpSize: 5,
            pageDownSize: 5,
            //监播图片内容
            isActive: true,
            // 监播图片
            downReportArr: [],
            currDownReportArr: [],
            imgInfo: [],
            currImgInfo: [],
            //缩略图对话框
            dialogVisible: false,
            dialogImageUrl: ""
        };
    },
    methods: {
        // 分页功能
        handleUpSizeChange(pageVal) {
            console.log("pageVal", pageVal);
            this.pageUpSize = pageVal;
            this.changeUpPage(1);
        },
        handleDownSizeChange(pageVal) {
            console.log("pageVal", pageVal);
            this.pageDownSize = pageVal;
            this.changeDownPage(1);
        },
        // 分页功能
        changeUpPage(page) {
            let pageSize = this.pageUpSize;
            let arr = this.downReportArr;
            let total = arr.length;
            let resultArr = [];
            for(let i = (page-1)*pageSize; i < (page*pageSize<total ? page*pageSize : total); i++){
                resultArr.push(arr[i]);
            }
            this.currDownReportArr = [];
            this.currDownReportArr = resultArr;
            console.log("currDownReportArr", this.currDownReportArr);
            console.log("page", page, "pageSize", pageSize);
        },
        // 分页功能
        changeDownPage(page) {
            let pageSize = this.pageDownSize;
            let arr = this.imgInfo;
            let total = arr.length;
            let resultArr = [];
            for(let i = (page-1)*pageSize; i < (page*pageSize<total ? page*pageSize : total); i++){
                resultArr.push(arr[i]);
            }
            this.currImgInfo = [];
            this.currImgInfo = resultArr;
            console.log("currImgInfo", this.currImgInfo);
            console.log("page", page, "pageSize", pageSize);
        },
        // 获取公司信息
        getCompanyInfo() {
            // 真实数据
            let uid = JSON.parse(sessionStorage.getItem("session_data")).uID;
            let apid = sessionStorage.getItem("order_apid");
            let info = {
                uid: uid,
                apid: apid
            };
            // uid         int【必填】     当前账户UserID
            // apid        int             公司对应方案apID
            api.getApi(this.QADN+"/GetFanganInfo", info)
                .then(res => {
                    console.log(res.data);
                    if (!res.data.SysCode) {
                        let result = res.data;
                        this.Report = result;
                    } else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    console.log(res);
                });
        },
        // 投放详情
        getInitData() {
            // 真实数据
            let uid = JSON.parse(sessionStorage.getItem("session_data")).uID;
            let info = {
                uid: uid,
                apid: sessionStorage.getItem("order_apid")
            };
            // uid         int【必填】     当前账户UserID
            // apid        int             公司对应方案apID
            api.getApi(this.QADN+"/GetAdLaunch", info)
                .then(res => {
                    console.log(res.data);
                    if (!res.data.SysCode) {
                        let resArr = res.data;

                        // uid         int【必填】         当前账户UserID
                        // ptype       String【必填】      关联类型
                        // ptid        int                 关联类型对应唯一ID
                        // ptp         String              关联类型区分属性
                        let imginfo = {
                            uid: JSON.parse(sessionStorage.getItem("session_data")).uID,
                            // ptype: "XK",
                            ptype: this.Report.ptype,
                            ptp: sessionStorage.getItem("order_apid")
                        };
                        api.postApi(this.QADN+"/GetImg", imginfo)
                            .then(res => {
                                console.log(res.data);
                                if(!res.data.SysCode){
                                    let downImginfo = res.data;
                                    // 下刊数据(组合图片)
                                    resArr = this.constructImg(resArr, downImginfo);
                                    this.downReportArr = resArr;
                                    this.currDownReportArr = JSON.parse(JSON.stringify(this.downReportArr));
                                    this.changeUpPage(1);
                                    console.log("downimginfo", this.downReportArr);
                                    // 下刊数据(组合图片按图片分)
                                    this.imgInfo = this.initImg(
                                        resArr,
                                        downImginfo
                                    );
                                    this.currImgInfo = JSON.parse(JSON.stringify(this.imgInfo));
                                    this.changeDownPage(1);
                                    console.log('downImgInfo--------', this.imgInfo);
                                } else if(res.data.SysCode == 100302){
                                    this.loginTimeout();
                                } else {
                                    Message.warning(res.data.MSG);
                                }
                            })
                            .catch(res => {
                                console.log(res);
                            });
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    console.log(res);
                });
        },
        // 组合上下刊图片数据
        constructImg(arr, imgArr) {
            for (let data of arr) {
                let img = [];
                for (let item of imgArr) {
                    let alt = JSON.parse(item.pAlt);
                    if (data.resID == alt.resid) {
                        // uid         int【必填】         当前账户UserID
                        // pid         int【必填】         图库pID
                        // palt        String              图片标题
                        // ptype       String              关联类型
                        // ptid        int                 关联类型对应唯一ID
                        // ptp         String              关联类型区分属性
                        img.push({
                            name: item.pID + ".png",
                            url: item.pURL,
                            uid: item.puID,
                            pid: item.pID,
                            palt: item.pAlt,
                            ptype: item.pType,
                            ptid: item.ptID,
                            ptp: item.ptP
                        });
                    }
                }
                data.downImgArr = img;
            }
            return arr;
        },
        // 按照图片分类
        initImg(arr, imgArr) {
            for (let img of imgArr) {
                for (let data of arr) {
                    if (data.asID == img.ptID) {
                        img.resName = data.resName;
                        break;
                    }
                }
            }
            return imgArr;
        },
        // 按照资源还是图片分类
        changeImgType() {
            this.isActive = !this.isActive;
        },
        //缩略图
        handlePictureCardPreview(url) {
            console.log("item", url);
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
    },
    mounted() {
        $(function() {
            $(".tabs")
                .find("button")
                .click(function() {
                    $(this)
                        .addClass("active")
                        .siblings()
                        .removeClass("active");
                });
            // $(".picBox")
            //     .mouseenter(function() {
            //         $(this)
            //             .find(".mask-btn")
            //             .show();
            //     })
            //     .mouseleave(function() {
            //         $(this)
            //             .find(".mask-btn")
            //             .hide();
            //     });
        });
    },
};
</script>

<style scoped>
.ad_mediaMana_wrap {
    width: 100%;
    box-sizing: border-box;
    padding: 0 60px;
    position: relative;
}

.mediaMana_content_top {
    padding: 28px 31px 60px;
    background-color: #fff;
    width: 1247px;
    box-sizing: border-box;
    /*height: 100px;*/
}

.title {
    margin-right: 200px;
}

.title h1 {
    font-size: 28px;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
}

.title h3 {
    font-size: 20px;
    color: #333333;
    font-weight: bold;
    margin-bottom: 12px;
}

/* .detail{
    border-bottom: 1px solid #D8D8D8;
    padding-bottom: 20px;
  }*/

.detail p {
    margin-top: 12px;
}

.detail p em {
    font-size: 14px;
    color: #333333;
    margin-left: 24px;
}

.detail p em:nth-of-type(1) {
    margin-left: 0;
}

.detail p i {
    font-size: 14px;
    color: #2a2a2a;
    font-style: normal;
}

.plan-panel {
    width: 1247px;
    position: relative;

    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 10px;
}

/*监播图片*/
.box-wrap > h4 {
    height: 55px;
    padding-left: 28px;
    border-bottom: 1px solid #e6e7e9;
    font-size: 16px;
    color: rgba(51, 51, 51, 0.85);
    line-height: 55px;
    font-weight: bold;
    background-color: #fff;
}
.tabs {
    padding-left: 24px;
    height: 34px;
    padding-top: 10px;
    background-color: #ffffff;
}
.tabs button {
    width: 88px;
    height: 32px;
    outline: none;
    border: 1px solid #d9d9d9;
    border-radius: 4px 0 0 4px;
    background-color: #fff;
    cursor: pointer;
    float: left;
}
.tabs button + button {
    /*margin-left: 1px;*/
    border-radius: 0 4px 4px 0;
}
.tabs button.active {
    border: 1px solid #1890ff;
    font-weight: bold;
    color: #1890ff;
}
/*图片*/
.box-wrap {
    border: 1px solid #e9e9e9;
    border-radius: 4px;
}
.typeOfRec,
.typeOfPic {
    padding: 15px 24px 30px;
    background: #fff;
}
.picBox {
    width: 220px;
    /*height: 326px;*/
    padding: 4px;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    border-radius: 2px;
    display: inline-block;
    margin-bottom: 22px;
    position: relative;
}
.picBox + .picBox {
    margin-left: 19px;
}
.picBox img {
    width: 210px;
    height: 280px;
    margin-bottom: 4px;
    border-bottom: 1px solid #e9e9e9;
}
.picBox .pic-title {
    font-size: 14px;
    color: #666666;
    /*text-align: center;*/
    margin-top: -12px;
    padding-left: 5px;
    /*line-height: 4px;*/
}
/deep/ .el-carousel__button {
    width: 18px;
}
/deep/ .el-carousel__indicators {
    bottom: 28px;
}
/*发布情况*/
.forth-wrap /deep/ .el-table th,
.el-table tr {
    padding: 6px 0;
}
.forth-wrap /deep/ .el-table .cell {
    padding: 9px 14px;
}
/deep/ .el-table_2_column_13,
/deep/ .el-table_2_column_14,
/deep/ .el-table_2_column_15 {
    text-align: right;
}
.mask-btn {
    display: none;
}
.mask-btn .el-icon-search {
    position: absolute;
    left: 43%;
    top: 40%;
    font-size: 30px;
    color: #fff;
    cursor: pointer;
    z-index: 2;
}

/*页码*/
.pager {
    position: relative;
    height: 32px;
    margin-top: 18px;
    top: -22px;
    right: 0px;
}
/deep/ .el-select .el-input .el-select__caret {
    position: relative;
    left: -9px;
}
/deep/ .el-select {
    top: -4px;
}

/deep/ .btn-prev {
    position: relative;
    top: -4px !important;
}
/deep/ .el-pagination {
    position: absolute;
    right: 0;
    top: 10px;
}

/deep/ .el-pagination.is-background .el-pager li {
    font-weight: normal;
    font-size: 13px;
    background-color: transparent;
}
/deep/ .el-pagination button,
.el-pagination span:not([class*="suffix"]) {
    position: relative;
    top: 0px !important;
    background-color: transparent !important;
}
/deep/ .el-pagination__jump {
    margin-left: 13px;
    position: relative;
    top: -4px;
}

/*1440*/
@media all and (min-width: 1420px) {
    .mediaMana_content_top,
    .plan-panel {
        width: 1320px;
    }
    .picBox + .picBox {
        margin-left: 37px;
    }
}

/*1920*/
@media all and (min-width: 1900px) {
    .mediaMana_content_top,
    .plan-panel {
        width: 1800px;
    }
    .picBox + .picBox[data-v-74e3f71e] {
        margin-left: 118px;
    }
    .typeOfRec[data-v-74e3f71e],
    .typeOfPic[data-v-74e3f71e] {
        padding: 0 103px 30px;
    }
}
</style>
