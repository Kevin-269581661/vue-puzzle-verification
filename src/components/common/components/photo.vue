<script>
import Vue from 'vue';
import LazyLoad from '../../../commonFun/lazyLoad.js'
Vue.use(LazyLoad);
// 时间格式化
import dateFormat from "../../../commonFun/timeFormat.js";
import { Tooltip, Dialog } from 'element-ui';
export default {
    components:{
        elTooltip: Tooltip,
        elDialog: Dialog,
    },
    props:{
        imgarr:{
            type: Array,
            default:[]
        },
        showPic:{
            type: Number,
            default: 1
        },
        isSearch:{
            type: Boolean,
            default: false
        },
    },
    data(){
        return {
            //缩略图
            dialogImageUrl: "",
            dialogVisible: false,
            //显示预览图蒙版
            showPreImg: null,
        }
    },
    methods:{
        // 查看图片
        handlePictureCardPreview(item) {
            console.log('imgInfo--------', item);
            this.dialogImageUrl = item.pUrl;
            this.dialogVisible = true;
        },
        // 时间格式规范
        formatTime(val) {
            return dateFormat.toDate(val, "/");
        },
    },
}
</script>
<template>
    <div>
        <div v-if="isSearch">
            <div class="tempPic">
                <div class="noFind" v-if="showPic === 1">
                    <img src="../../../assets/images/tempPic.png" alt="">
                    <p style="margin-top: -10px">请先输入筛选条件搜索你所需要的图片</p>
                </div>
                <div class="cantFind" v-if="showPic === 2">
                    <img src="../../../assets/images/noPic.png" alt="">
                    <h4>无匹配结果</h4>
                    <p>可以尝试扩大搜索范围重新搜索哦</p>
                </div>
                <!--图片列表-->
                <div class="find clearfix" v-if="showPic === 3">
                    <div class="photoCard" v-for="(img, index) of imgarr" :key="img.pID">
                        <div class="imgBox" @mouseenter="showPreImg = index" @mouseleave="showPreImg = null">
                            <img :src="img.pUrl" alt="" class="smallImg">
                            <div class="mask-btn" v-if="showPreImg == index">
                                <i class="el-icon-search" @click="handlePictureCardPreview(img)"></i>
                                <a :href="img.pUrl" :download="formatTime(img.pUTime)+'下刊'+img.city+img.area+img.res+img.assettag+'.png'">下载图片</a>
                            </div>
                        </div>
                        <div class="detailBox detailBox1">
                            <p>{{img.res}} - {{img.mTitle}}</p>
                            <div class="icons">
                                <span class="el-icon-location">{{img.city}}</span>
                                <el-tooltip placement="bottom" effect="light">
                                    <span class="el-icon-info"></span>
                                    <div slot="content" class="content">
                                        <p>{{img.name}}上传</p>
                                        <p>{{img.assettag}}</p>
                                        <p>{{img.address}}</p>
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="search-nav" v-else>
            <!--未搜索占位图-->
            <div class="tempPic">
                <div class="noFind" v-if="showPic === 1">
                    <img src="../../../assets/images/tempPic.png" alt="">
                    <p style="margin-top: -10px">请先输入筛选条件搜索你所需要的图片</p>
                </div>
                <div class="cantFind" v-if="showPic === 2">
                    <img src="../../../assets/images/noPic.png" alt="">
                    <h4>无匹配结果</h4>
                    <p>可以尝试扩大搜索范围重新搜索哦</p>
                </div>
                <!--图片列表-->
                <div class="find clearfix" v-if="showPic === 3">
                    <div class="photoCard" v-for="(img, index) of imgarr" :key="img.pID">
                        <div class="imgBox" @mouseenter="showPreImg = index" @mouseleave="showPreImg = null">
                            <img :src="img.pUrl" alt="" class="smallImg">
                            <!-- <img v-lazyload="img.pURL" alt="" class="smallImg"> -->
                            <!--查看缩略图和下载-->
                            <div class="mask-btn" v-if="showPreImg == index">
                                <i class="el-icon-search" @click="handlePictureCardPreview(img)"></i>
                                <a :href="img.pUrl" :download="formatTime(img.pUTime)+'下刊'+img.pRemarks.account+img.pRemarks.city+img.pRemarks.area+img.pRemarks.res+img.pRemarks.assettag+'.png'">下载图片</a>
                            </div>
                        </div>
                        <div class="detailBox">
                            <p>{{img.pRemarks.plan}}</p>
                            <!-- <span>华南碧桂园二期-东门</span> -->
                            <span>{{img.pRemarks.res}}-{{img.pRemarks.media}}</span>
                            <div class="icons">
                                <span class="el-icon-location">{{img.pRemarks.city}}</span>
                                <span>
                                    <i class="fa fa-file-text"></i>
                                    {{img.pRemarks.asLab}}面
                                </span>
                                <el-tooltip placement="bottom" effect="light">
                                    <span class="el-icon-info"></span>
                                    <div slot="content" class="content">
                                        <p>{{img.pRemarks.username}}上传</p>
                                        <p>{{img.pRemarks.assettag}}</p>
                                        <p>{{img.pRemarks.address}}</p>
                                    </div>
                                </el-tooltip>
                            </div>
                        </div>
                        <div class="infoBox">
                            <i>{{img.pRemarks.username.substr(-1)}}</i>
                            <span>{{img.pRemarks.brand}}</span>
                            <em>{{formatTime(img.pUTime)}}</em>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--缩略图对话框-->
        <el-dialog :visible.sync="dialogVisible" class="imgPreview">
            <img :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<style scoped>
.tempPic {
    text-align: left;
    margin-bottom: 50px;
}


.tempPic img {
    /* width: 350px;
    height: 245px; */
    width: 100%;
    height: auto;
}

.tempPic p {
    font-size: 16px;
    color: #666666;
}

.noFind,
.cantFind {
    margin-top: 87px;
    margin-bottom: 70px;
}
.noFind,
.cantFind {
    margin-top: 87px;
    margin-bottom: 70px;
    text-align: center;
}
.noFind img,
.cantFind img{
    width: 350px;
    height: 245px;
}
.tempPic h4 {
    font-size: 28px;
    color: #666666;
    margin-top: -30px;
    margin-bottom: 7px;
}

.find {
    /* position: relative; */
    /* display: flex;
    flex-wrap: wrap; */
    /*justify-content: space-around;*/
}

.find .photoCard {
    /* margin-right: 20px; */
    /* margin-right: 6px; */
}

.photoCard {
    transition: all 0.3s;
    float: left;
    width: 18%;
    /*height: 307px;*/
    background: #ffffff;
    /*box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.20);*/
    border-radius: 2px;
    text-align: left;
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin: 0.9%;
}

.photoCard .imgBox {
    width: 100%;
    height: 160px;
    position: relative;
    overflow: hidden;
}

.imgBox .mask-btn {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    text-align: center;
    margin: 0 auto;
}

.mask-btn .el-icon-search {
    color: #fff;
    font-size: 26px;
    /* line-height: 176px; */
    cursor: pointer;
    margin-top: 45px;
}

.mask-btn a {
    /* position: absolute;
    bottom: 18px;
    left: 63px; */
    display: block;
    background: #1890ff;
    border-radius: 4px;
    width: 100px;
    height: 34px;
    color: #fff;
    text-align: center;
    line-height: 34px;
    font-size: 14px;
    margin: 12px auto;
}

.photoCard .imgBox > img {
    display: inline-block;
    /* width: 100%; */
    /* height: 100%; */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
}

.detailBox {
    padding-left: 10px;
    margin-top: 10px;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 13px;
    display: flex;
    flex-direction: column;
}
.detailBox1{
    border-bottom: none;
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
.imgPreview /deep/ .el-dialog{
    max-width: 42%;
}
.imgPreview /deep/ .el-dialog__body{
    max-height: 640px;
}
.imgPreview /deep/ .el-dialog {
    max-height: 750px;
}
.imgPreview /deep/ .el-dialog img{
    width: 100%;
    max-height: 660px;
}
</style>
