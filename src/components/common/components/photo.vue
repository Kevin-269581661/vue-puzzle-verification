<script>
    import Vue from 'vue';
    import LazyLoad from '../../../commonFun/lazyLoad.js'

    Vue.use(LazyLoad);
    // 时间格式化
    import dateFormat from "../../../commonFun/timeFormat.js";
    import {Tooltip, Dialog} from 'element-ui';
    import api from "../../../api/api"
    import timeFormat from "../../../commonFun/timeFormat";
    import sessFun from "../../../commonFun/sessFun"

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
            },
            // 缩放比例
            isActive:{
                type: Boolean,
                default: false
            },
        },
        data(props) {
            return {
                sessionData: '',
                //缩略图
                dialogImageUrl: "",
                dialogVisible: false,
                //显示预览图蒙版
                showPreImg: null,
                secondShowPreImg: false,
                // 下拉是否隐藏
                selectIsVisible: false,
                galleryImgUrl: this.apiVar.qadnUrl + "/advertisement/DownloadImage?picUrl=" ,
                collectImgUrl: this.apiVar.qadnUrl + "/advertisement/DownloadUserImage?id=" ,
                isShowCollect: true,
                // 标签水印
                watermarkDialog: false,
                // 当前选择的水印标签
                activeMark: '',
                activeImgInfo: {
                    city: '',
                    time: '',
                    resName: '',
                    week: '',
                    url: ''
                },
                isActive: props.isActive
            }
        },
        watch:{
            publish(newVal,oldVal){
                console.log('newVal',newVal,'oldVal',oldVal)
                this.publish = newVal
            },
        },
        mounted(){
            this.getSessionData();
        },
        methods: {
            getSessionData(){
                this.sessionData = JSON.parse(sessionStorage.getItem('session_data'));
                if(this.sessionData.ascType == 0){
                    this.isShowCollect = false
                }else{
                    this.isShowCollect = true
                }
            },
            // 查看图片
            handlePictureCardPreview(item) {
                console.log('imgInfo--------', item);
                this.dialogImageUrl = item.pUrl;
                this.dialogVisible = true;
            },
            // 保存图片
            saveImgFun(item) {
                console.log('保存图片', item)
                let lID = ''
                if (this.tabType === 'first') {
                    lID = item.lId //item.adsInfo ? item.adsInfo.lID : ''
                } else {
                    lID = item.pRemarks.lid
                }
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    lId: lID,
                    pId: item.pID,
                    picUrl: item.pUrl,
                    type: this.publish === 'SK' ? 0 : this.publish === 'XK' ? 1 : 2,
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
                    if (res.data.SysCode === 200200) {
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
                    if (res.data.SysCode === 200200) {
                        item.isCollection = false
                        this.$emit('doSomeThing', true)
                        this.messageFun('success', '取消成功')
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 鼠标移入
            mouseenterFun(imgInfo,index){
                this.showPreImg = index
                this.secondShowPreImg = true
                this.activeImgInfo = {
                    city: imgInfo.pRemarks.city,
                    time: imgInfo.pUTime,
                    resName: imgInfo.resName || imgInfo.pRemarks.res,
                    week: timeFormat.returnWeekByDate(imgInfo.pUTime),
                    url: imgInfo.pUrl
                }
                console.log('activeImgInfo',this.activeImgInfo,imgInfo)
            },
            // 鼠标移出
            mouseleaveFun() {
                if(this.selectIsVisible) {
                    this.secondShowPreImg = false
                } else {
                    this.showPreImg = null
                }

            },
            // 下拉是否显示
            visibleChange(val){
                this.selectIsVisible = val
                if (!val && !this.secondShowPreImg) {
                    this.showPreImg = null
                }
            },
            // 选着水印
            selectMark(val){
                console.log('val',val)
                if(val === 'b') {
                    this.watermarkDialog = true
                    this.activeMark = 2
                }
            },
            // 选择图片类型
            selectImgMark(index){
                this.activeMark = index
                console.log('activeMark',this.activeMark)
            },
            // 下载水印图片
            downloadImgWatermark(){
                console.log('activeImgInfo',this.activeImgInfo)
                if(this.activeMark) {
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        position: this.activeMark,         // 2:TOP_CENTER 6:BOTTOM_RIGHT 7:BOTTOM_LEFT
                        watermark: this.activeImgInfo.time + ' · ' + this.activeImgInfo.week + ',' + this.activeImgInfo.city + ' · ' + this.activeImgInfo.resName ,
                        picUrl: this.activeImgInfo.url
                    }
                    let urlArr = this.activeImgInfo.url.split('/')
                    api.getApi_file(this.apiVar.Advertisement + '/DownloadImageWatermark', params).then(res=>{
                    // api.getApi_file('http://192.168.1.247:8002/advertisement/DownloadImageWatermark', params).then(res=>{
                        console.log('res',res)
                        let blob = new Blob([res.data], {type: 'application/ms-download;charset=utf-8'});
                        let downloadElement = document.createElement('a');
                        let href = window.URL.createObjectURL(blob);    //创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = urlArr[urlArr.length-1]//res.headers['Content-Disposition'].split('=')[1]; //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click();                        //点击下载
                        document.body.removeChild(downloadElement);     //下载完成移除元素
                        window.URL.revokeObjectURL(href);               //释放掉blob对象
                        sessFun.messageFun('success','下载成功')
                        this.watermarkDialog = false
                    })
                } else {
                    sessFun.messageFun('warning','请点击选择水印类型')
                }

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
                    <div class="photoCard" :class="{active: isActive}" v-for="(img, index) of imgarr" :key="img.pID">
                        <div class="imgBox" @mouseenter="showPreImg = index" @mouseleave="showPreImg = null">
                            <img :src="img.pUrl" alt="" class="smallImg">
                            <!--查看缩略图和下载-->
                            <div class="mask-btn" v-if="showPreImg == index">
                                <p class="mask_icon">
                                    <span v-if="isShowCollect">
                                        <i v-if="!img.isCollection" class="el-icon-star-off" @click="saveImgFun(img)" ></i>
                                        <i v-else-if="img.isCollection" class="el-icon-star-on icon_save" @click="cancelImgFun(img)" ></i>
                                    </span>
                                    <i class="el-icon-search" @click="handlePictureCardPreview(img)"></i>
                                </p>
                                <p class="mask_a">
                                    <a v-if="tabType === 'first'" :href= "galleryImgUrl + img.pUrl" >下载图片</a>
                                    <a v-else :href= "collectImgUrl + img.id" >下载图片</a>
                                </p>
                            </div>
                        </div>
                        <div class="detailBox">
                            <p>{{img.pRemarks.plan || '--'}}</p>
                            <!-- <span>华南碧桂园二期-东门</span> -->
                            <span>{{img.pRemarks.res}}-{{img.pRemarks.media}}</span>
                            <div class="icons">
                                <span class="el-icon-location">{{img.pRemarks.city}}</span>
                                <span>
                                    <i class="fa fa-file-text"></i>
                                    {{img.pRemarks.asLab}}
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
                            <i>{{(img.pRemarks.username || '').substr(-1)}}</i>
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
        <!--选择水印标签-->
        <el-dialog
            title="标签水印"
            :visible.sync="watermarkDialog"
            width="720px">
            <el-row :gutter="16">
                <el-col :span="8" v-for="(item,index) in [2,7,6]" :key="index" @click.native="selectImgMark(item)">
                    <div class="img_box">
                        <div class="img_box_mark"
                             :class="index === 0 ? 'img_box_mark_0' : index === 1 ? 'img_box_mark_1' : 'img_box_mark_2'">
                            <p class="">{{activeImgInfo.time + ' · ' + activeImgInfo.week}}</p>
                            <p>{{activeImgInfo.city + ' · ' + activeImgInfo.resName}}</p>
                        </div>
                        <p class="active_Mark" v-show="activeMark === item">
                            <i class="el-icon-circle-check"></i>
                        </p>
                        <img :src="activeImgInfo.url" alt="" />
                    </div>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="watermarkDialog = false">取 消</el-button>
                <el-button type="primary" @click="downloadImgWatermark()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
    .tempPic {
        text-align: left;
        margin-bottom: 2px;
        min-height: 626px;
    }

    .tempPic > div.find {
      display: flex;
      flex-wrap: wrap;
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
        width: 280px;
        background: #ffffff;
        border-radius: 2px;
        text-align: left;
        border: 1px solid rgba(0, 0, 0, 0.1);
        margin: 0 0.5% 16px;
        position: relative;
    }

    .photoCard .imgBox {
        width: 100%;
        height: 373px;
        position: relative;
    }
    .photoCard .imgBox img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .active .imgBox{
        height: 210px;
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
        font-size: 24px;
        cursor: pointer;
    }

    .mask-btn i.icon_save {
        color: #FFD517;
    }

    .mask-btn .mask_a i.el-icon--right{
        font-size: 14px;
    }

    .mask_a {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 16px;
    }

    .mask_a a{
        width: 64px;
        padding: 6px 8px;
        border-radius: 4px;
        color: #fff;
        background: #409eff;
        font-size: 14px;
    }

    .mask_a a:hover{
        background: #66b1ff;
    }

    /deep/ .dropdown_a{
        color: rgb(96, 98, 102);
    }

    /deep/ .dropdown_a:hover{
        color: #66b1ff;
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

    /* 水印 */
    /deep/ .el-dialog__body{
        padding: 8px 16px;
    }
    .img_box{
        height: 280px;
        border: 1px solid #D9D9D9;
        border-radius:4px;
        position: relative;
        cursor:pointer;
    }
    .img_box img{
        width: 100%;
        height: 100%;
    }

    .img_box_mark{
        position: absolute;
        width: 100%;
        height: 42px;
        background:linear-gradient(180deg,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0) 100%);
        opacity:0.8;
        color: #fff;
        font-size: 12px;
    }

    .img_box_mark_0{
        top: 0;
        left: 0;
        padding-top: 16px;
        text-align: center;
    }

    .img_box_mark_1{
        bottom: 0;
        left: 0;
        text-align: left;
        text-indent: 10px;
        padding: 8px 0;
    }

    .img_box_mark_2{
        bottom: 0;
        left: 0;
        padding: 8px 0;
        text-align: right;
    }

    .img_box_mark p{
        line-height: 18px;
    }

    .img_box_mark.img_box_mark_2 p{
        padding-right: 10px;
    }

    .active_Mark{
        position: absolute;
        top: 40%;
        text-align: center;
        width: 100%;
    }

    .active_Mark i{
        font-size: 42px;
        color: #4DCB73;
    }
</style>
