<script>
    import Vue from 'vue';
    import LazyLoad from '../../../commonFun/lazyLoad.js'

    Vue.use(LazyLoad);
    // 时间格式化
    import dateFormat from "../../../commonFun/timeFormat.js";
    import {Tooltip, Dialog} from 'element-ui';
    import api from "../../../api/api"

    export default {
        components: {
            elTooltip: Tooltip,
            elDialog: Dialog,
        },
        props: {
            imgarr: {
                type: Array,
                default: []
            },
            showPic: {
                type: Number,
                default: 1
            },
            isSearch: {
                type: Boolean,
                default: false
            },
            // 上下刊
            publish:{
                type: String,
                default: ''
            },
            // 当前tab
            tabType:{
                type: String,
                default: 'first'
            }
        },
        data() {
            return {
                sessionData: JSON.parse(sessionStorage.getItem('session_data')),
                //缩略图
                dialogImageUrl: "",
                dialogVisible: false,
                //显示预览图蒙版
                showPreImg: null,
                // photoApi: 'http://192.168.1.246/advertisement',
                galleryImgUrl: this.apiVar.qadnUrl + "/advertisement/DownloadImage?picUrl=" ,
                collectImgUrl: this.apiVar.qadnUrl + "/advertisement/DownloadUserImage?id=" ,
            }
        },
        watch:{
            publish(newVal,oldVal){
                console.log('newVal',newVal,'oldVal',oldVal)
                this.publish = newVal
            },
        },
        methods: {
            // 查看图片
            handlePictureCardPreview(item) {
                console.log('imgInfo--------', item);
                this.dialogImageUrl = item.pUrl;
                this.dialogVisible = true;
            },
            // 保存图片
            saveImgFun(item) {
                console.log('保存图片', item)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    lId: item.pRemarks.lid,
                    pId: item.pID,
                    picUrl: item.pUrl,
                    type: this.publish === 'SK' ? 0 : this.publish === 'XK' ? 1 : "",
                }
                if (!params.lId) {
                    this.messageFun('warning', '图片信息异常无法保存！')
                    return
                }
                if (params.type === "") {
                    delete params.type
                }
                console.log('params', params)
                api.postApi(this.apiVar.Advertisement + '/imageCollection/add', params).then(res => {
                    console.log('图片收藏res', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        item.isCollection = true
                        this.$emit('doSomeThing', true)
                        this.messageFun('success', '收藏成功')
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 取消保存
            cancelImgFun(item){
                console.log('取消收藏',item)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    pId: item.pID,
                }
                api.postApi(this.apiVar.Advertisement + '/imageCollection/remove', params).then(res => {
                    console.log('取消收藏res', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        item.isCollection = false
                        this.$emit('doSomeThing', true)
                        this.messageFun('success', '取消成功')
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 下载图片
            downloadImg(item){
                console.log('下载图片item',item)
                let params = {
                    // uid: this.sessionData.uID,
                    // token: this.sessionData.token,
                    // pId: item.pID,
                    picUrl: item.pUrl
                }
                //DownloadImage?picUrl=
                api.getApi_file(this.apiVar.Advertisement + '/DownloadImage',params).then(res=>{
                    console.log('下载图片',res)
                    this.imgUrl = res.data
                    // if (res.data.SysCode === 200200) {
                    //     this.messageFun('success', '下载成功')
                    // } else {
                    //     this.messageFun('warning', res.data.MSG)
                    // }
                })
            },
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
            // 时间格式规范
            formatTime(val) {
                return dateFormat.toDate(val, "/");
            },
            loginTimeout(){
                Message.warning("登录超时,请重新登录");
                this.$router.push("/login");
            },
        },
    }
</script>
<template>
    <div>
        <div class="search-nav">
            <!--未搜索占位图-->
            <div class="tempPic">
                <div class="noFind" v-if="showPic === 1">
                    <img src="../../../assets/images/tempPic.png" alt="">
                    <p style="margin-top: -10px">暂无数据</p>
                </div>
                <!--图片列表-->
                <div class="find clearfix" v-if="showPic === 3">
                    <div class="photoCard" v-for="(img, index) of imgarr" :key="img.pID">
                        <div class="imgBox" @mouseenter="showPreImg = index" @mouseleave="showPreImg = null">
                            <img :src="img.pUrl" alt="" class="smallImg">
                            <!--查看缩略图和下载-->
                            <div class="mask-btn" v-if="showPreImg == index">
                                <p class="mask_icon">
                                    <i v-if="!img.isCollection" class="el-icon-star-off" @click="saveImgFun(img)" ></i>
                                    <i v-if="img.isCollection" class="el-icon-star-on icon_save" @click="cancelImgFun(img)" ></i>
                                    <i class="el-icon-search" @click="handlePictureCardPreview(img)"></i>
                                </p>
                                <p class="mask_a">
                                    <a v-if="tabType === 'first'" :href= "galleryImgUrl + img.pUrl" >下载图片</a>
                                    <a v-else :href= "collectImgUrl + img.id" >下载图片</a>
                                </p>
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
                                        <p>{{img.pRemarks.username + (tabType === 'first' ? "上传" : "收藏")}}</p>
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
        margin-bottom: 2px;
        min-height: 626px;
    }

    .tempPic img {
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
    .cantFind img {
        width: 350px;
        height: 245px;
    }

    .tempPic h4 {
        font-size: 28px;
        color: #666666;
        margin-top: -30px;
        margin-bottom: 7px;
    }

    .photoCard {
        transition: all 0.3s;
        float: left;
        width: 18.8%;
        background: #ffffff;
        border-radius: 2px;
        text-align: left;
        border: 1px solid rgba(0, 0, 0, 0.1);
        margin: 0 0.5% 16px;
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

    .mask_icon {
        text-align: center;
        padding: 22% 0 0;
        letter-spacing: 3px;
    }

    .mask-btn i {
        color: #fff;
        font-size: 26px;
        cursor: pointer;
    }

    .mask-btn i.icon_save {
        color: #FFD517;
    }

    .mask_a {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 16px;
    }

    .mask-btn a {
        display: block;
        background: rgba(24, 144, 255, 1);
        border-radius: 4px;
        width: 100px;
        height: 34px;
        color: #fff;
        line-height: 34px;
        font-size: 14px;
        margin: 0 auto;
    }

    .mask-btn a:hover {
        opacity: 0.9;
    }

    .photoCard .imgBox > img {
        display: inline-block;
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

    .detailBox p {
        font-size: 14px;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .detailBox > span {
        font-size: 10px;
        color: #999999;
        display: inline-block;
        height: 32px;
    }

    .detailBox .icons {
        font-size: 10px;
        color: #999999;
        /*margin-top: 12px;*/
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
        width: 35%;
    }
    .imgPreview /deep/ .el-dialog__body{
        text-align: center;
    }
    /deep/ .imgPreview .el-dialog__body img{
        max-width: 100%;
        width: auto;
        height: 550px;
    }
    @media screen and (max-width: 1440px) {
        /deep/ .imgPreview .el-dialog__body img{
            height: 450px;
        }
    }
  /*  .imgPreview /deep/ .el-dialog {
        max-width: 42%;
    }

    .imgPreview /deep/ .el-dialog__body {
        max-height: 640px;
    }

    .imgPreview /deep/ .el-dialog {
        max-height: 750px;
    }

    .imgPreview /deep/ .el-dialog img {
        width: 100%;
        max-height: 660px;
    }*/
</style>
