<template>
    <div class="orderPhoto">
        <el-row :gutter="32">
            <el-col :span="6">
                <span>行业类型:</span>
                <el-cascader :options="bussiness" size="small" class="plan-select" v-model="industryIdArr"
                             change-on-select
                             :clearable="true"
                             @change="handleChange"
                             filterable>
                </el-cascader>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" size="small" icon="el-icon-search" class="searchBtn"
                           @click="searchFun()" :disabled="!isSearch">搜索
                </el-button>
                <el-button plain size="small" @click="reset()">重置</el-button>
            </el-col>
            <el-col :span="12" class="el_col_upload_btn">
                <el-button v-if="isShowBtn" type="primary" size="small" @click="uploadFun()" :disabled="!isSearch">上传图片</el-button>
                <!--<el-button plain size="small" @click="photoDownLoad()">一键导出</el-button>-->
            </el-col>
        </el-row>
        <div>
            <div class="photo_list clearfix" :class="isShowBtn ? '' : 'photo_list_bd'">
                <div class="noFind" v-show="showPic === 1">
                    <img src="../../../assets/images/tempPic.png" alt="">
                    <p style="margin-top: -10px">暂无数据</p>
                </div>
                <div class="photo_card"
                     v-show="showPic === 2"
                     v-for="(item,index) in imgList"
                     :key="index"
                     @mouseenter="showPreImg = index"
                     @mouseleave="showPreImg = null">
                    <img :src="item.url" :alt="item.title">
                    <p class="card_select" v-if="isShowBtn">
                        <el-cascader :options="bussiness" size="small" class="plan-select" v-model="item.industry"
                                     change-on-select
                                     @change="imgIndustryChange(item)"
                                     filterable>
                        </el-cascader>
                    </p>
                    <!--查看缩略图和下载-->
                    <div class="mask-btn" v-if="showPreImg == index"><!--showPreImg == index-->
                        <p class="mask_title">由 {{item.userName}} 于 {{item.createTime}} 上传</p>
                        <p class="mask_icon">
                            <i class="el-icon-search" @click="handlePictureCardPreview(item)"></i>
                        </p>
                        <p class="mask_a">
                           <!-- <a :href="item.url" @click="downloadImg" :download="item.userName + item.createTime + '.png'">下载图片</a>-->
                            <a :href= "imgUrl + item.url" >下载图片</a>
                        </p>
                    </div>
                </div>
            </div>
            <div class="ad_pagination">
                <el-pagination
                    v-show="showPic === 2"
                    background
                    layout="total,sizes, prev, pager, next, jumper"
                    @current-change="changePage"
                    @size-change="changeSize"
                    :page-sizes="[10, 20]"
                    :current-page.sync="pageData.pageNum"
                    :page-size="pageData.pageSize"
                    :total="pageData.totalSize">
                </el-pagination>
            </div>
        </div>
        <!--缩略图对话框-->
        <el-dialog :visible.sync="dialogVisible" title="行业图片" class="imgPreview">
            <img :src="dialogImageUrl" alt="">
        </el-dialog>
        <!--上传图片-->
        <el-dialog
            :visible.sync="UploadVisible"
            title="上传图片"
            class="upload_dialog"
            width="324px">
            <div class="upload_dialog_body">
                <p class="upload_p">
                    <el-cascader :options="bussiness" size="small" class="plan-select" v-model="industryImg"
                                 change-on-select
                                 @change="UploadIndustryChange"
                                 filterable>
                    </el-cascader>
                </p>
                <p class="upload_img">
                    <el-upload
                        :action="doUpload"
                        list-type="picture-card"
                        :file-list="uploadImg"
                        :limit = '1'
                        :on-success="downSuccess"
                        :on-preview="pictureCardPreview"
                        :before-upload="beforeUpload"
                        :on-remove="removeImg">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="UploadVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadIndustryImg">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {Image} from 'element-ui';
    import industryToText from "../../../commonFun/industryToText.js";
    import api from "../../../api/api"
    export default {
        name: "orderPhoto",
        components:{
            elImage: Image,
        },
        data(){
            return{
                sessionData: '',
                showPic: 1,
                isShowBtn: false,
                // 页码及条数
                pageData:{
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                },
                isSearch: true,
                bussiness: [],
                industryIdArr: [],
                imgList: [],
                //显示预览图蒙版
                showPreImg: null,
                // 图片上的行业选择
                imgIndustry:[],
                dialogVisible: false,
                dialogImageUrl: '',
                // 上传图片
                doUpload: this.apiVar.qadnUrl + '/advertisement/image/upload',     //http://192.168.1.239/
                UploadVisible: false,
                uploadUrl: '',
                // 上传图片的信息
                uploadImg: [],           // 显示已上传的图片
                // 上传图片关联的行业
                industryImg:[],
                imgUrl: this.apiVar.qadnUrl + "/advertisement/DownloadImage?picUrl=" ,
            }
        },
        mounted(){
            this.getSessionData()
            this.getIndustry()
            this.getIndustryImgList()
            // this.deletImg()
        },
        methods:{
            getSessionData(){
                this.sessionData = JSON.parse(sessionStorage.getItem('session_data'));
                if(this.sessionData.uType === 'MD'){
                    this.isShowBtn = true
                }else{
                    this.isShowBtn = false
                }
            },
            // 获取所有行业信息
            getIndustry() {
                let arr = JSON.parse(sessionStorage.getItem("industry"));
                this.bussiness = industryToText.cascader(arr);
                console.log('获取所有行业信息',this.bussiness)
            },
            //获取图片列表
            getIndustryImgList(){
              let params = {
                  uid: this.sessionData.uID,
                  token: this.sessionData.token,
                  pageNo: this.pageData.pageNum,
                  pageSize: this.pageData.pageSize,
                  industryId: this.industryIdArr[1],
              }
              if(!params.industryId){
                  delete params.industryId
              }
              api.getApi(this.apiVar.Advertisement + '/image/listCompanyImage', params).then(res=>{
                  console.log('图片列表res',res)
                  if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                      this.loginTimeout()
                  } else if (res.data.SysCode === 200200) {
                      this.setImgList(res.data.data)
                      this.pageData.totalSize = res.data.total
                  } else {
                      this.messageFun('warning', res.data.MSG)
                  }
              })
            },
            //
            setImgList(data){
                if(!data || data.length <= 0){
                    this.showPic = 1
                    return
                }else{
                    let tempList = []
                    for(let key of data){
                        tempList.push({
                            id: key.id,
                            createTime: key.createTime,
                            url: key.picUrl,
                            userName: key.userName,
                            // topIndustryId: key.topIndustryId,
                            // industryId: key.industryId,
                            industry: [key.topIndustryId,key.industryId]
                        })
                    }
                    this.imgList = tempList
                    this.showPic = 2
                }
            },
            // 选择行业
            handleChange(val){
                console.log('val',val)
            },
            // 搜索
            searchFun(){
                console.log('industryIdArr',this.industryIdArr)
                this.pageData.pageNum = 1
                this.pageData.pageSize = 10
                this.getIndustryImgList()
            },
            // 重置
            reset(){
                this.industryIdArr = []
                this.pageData.pageSize = 10
                this.pageData.pageNum = 1
                this.getIndustryImgList()
            },
            // 图片上传
            uploadFun(){
                this.UploadVisible = true
            },
            // 图片上传时的行业选择
            UploadIndustryChange(val){
                console.log('图片上传时的行业选择',val)
            },
            // 资源图片上传前验证格式和大小
            beforeUpload(file) {
                const isJPG = file.type === "image/jpeg" || file.type === "image/png";
                const isLt10M = file.size / 1024 / 1024 < 10;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                }
                if (!isLt10M) {
                    this.$message.error('上传图片大小不能超过 10MB!');
                }
                return isJPG && isLt10M;
            },
            // 资源图片上传成功
            downSuccess(res) {
                console.log('上传行业图片', res)
                if(res.SysCode === 200200){
                    // this.uploadUrl = res.data
                    console.log('this.uploadUrl',this.uploadUrl)
                }
            },
            // 删除原资源图片，进行重新选择
            removeImg(file, fileList) {
                console.log('删除或修改了资源图片', file, fileList)
                this.uploadUrl = []
            },
            // 资源图片放大
            pictureCardPreview(file) {
                console.log('行业图片放大',file)
                this.dialogVisible = true
                this.dialogImageUrl = file.url
            },
            // 确认上传
            uploadIndustryImg(){
                if(this.industryImg.length <= 1){
                    this.messageFun('warning','请选择行业!')
                }
                if(this.uploadUrl.length <= 0){
                    this.messageFun('warning','请上传图片!')
                    return
                }
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    industryId: this.industryImg[1],
                    picUrls: this.uploadUrl[0]
                }
                console.log('params',params)
                api.postApi(this.apiVar.Advertisement + '/image/save',params).then(res=>{
                    console.log('上传图片res',res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        this.getIndustryImgList()
                        this.uploadImg = []
                        this.industryImg = []
                        this.UploadVisible = false
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 图片导出
            photoDownLoad(){

            },
            // 图片删除
            deletImg(){
                // let params = {
                //     uid:this.sessionData.uID,
                //     token:this.sessionData.token,
                //     id: 4
                // }
                // api.postApi(this.apiVar.Advertisement + '/image/remove',params).then(res=>{
                //     console.log('删除图片res',res)
                // })
            },
            // 图片上的行业选择
            imgIndustryChange(val){
                console.log('图片的底部的行业选择',val)
                if(val.industry.length >= 2){
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        id: val.id,
                        industryId: val.industry[1]
                    }
                    api.postApi(this.apiVar.Advertisement + '/image/updateIndustry',params).then(res=>{
                        console.log('修改图片关联行业res',res)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            this.loginTimeout()
                        } else if (res.data.SysCode === 200200) {
                            this.messageFun('success', '修改成功')
                        } else {
                            this.messageFun('warning', res.data.MSG)
                        }
                    })
                }
            },
            // 查看图片
            handlePictureCardPreview(item) {
                console.log('imgInfo--------', item);
                this.dialogImageUrl = item.url;
                this.dialogVisible = true;
            },
            // 下载图片
            downloadImg(item){
                console.log('下载图片item',item)
                let params = {
                    // uid: this.sessionData.uID,
                    // token: this.sessionData.token,
                    // pId: item.pID,
                    picUrl: item.url
                }
                //DownloadImage?picUrl=
                api.getApi_file(this.apiVar.Advertisement + '/DownloadImage',params).then(res=>{
                    console.log('下载图片',res)
                    if (res.data.SysCode === 200200) {
                        this.messageFun('success', '下载成功')
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 分页
            changePage(val){
                console.log('当前页',val)
                this.pageData.pageNum = val
                this.getTableData()
            },
            // 每页的条数
            changeSize(val){
                console.log('每页的条数',val)
                this.pageData.pageSize = val
                this.getTableData()
                // this.setFixedTableHieght()
            },
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
            loginTimeout(){
                this.messageFun('warning',"登录超时,请重新登录");
                this.$router.push("/login");
            },
        }
    }
</script>

<style scoped>
    .orderPhoto .el-row {
        margin-bottom: 24px;
    }

    .el-row span {
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
    }

    .orderPhoto /deep/ .el-cascader {
        width: calc(98% - 76px);
    }

    .el_col_upload_btn {
        text-align: right;
    }

    .noFind,
    .cantFind {
        margin-top: 180px;
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

    .photo_list{
        min-height: 641px;
    }

    /*图片*/
    .photo_card{
        width: 19%;
        height:0;
        padding-bottom: 28%;
        position: relative;
        margin: 0 .9% 24px 0;
        float: left;
        text-align: center;
        cursor: pointer;
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 2px;
    }

    .photo_list_bd .photo_card{
        padding-bottom: 25%;
    }

    .photo_card:nth-child(5n+1){
        margin-right: 0;
    }
    /*,/deep/ .photo_card .industry_photo*/
    .photo_card img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 88%;
    }
    .photo_list_bd .photo_card img{
        height: 100%;
    }
    /*图片的行业下拉选择*/
    .card_select{
        position: absolute;
        bottom: 3.8%;
        width: 100%;
        height: 24px;
    }
    .card_select /deep/ .el-cascader{
        width: 85%;
    }
    .card_select /deep/ .el-input__inner{
        height: 24px;
        border:1px solid rgba(145,213,255,1);
        background:rgba(230,247,255,1);

    }
    .card_select /deep/ .el-cascader__label,
    .card_select /deep/ .el-cascader__label span,
    .card_select /deep/ .el-input__icon{
        color:rgba(24,144,255,1);
    }
    .photo_card .mask-btn {
        width: 100%;
        height: 88%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.2);
        text-align: left;
        margin: 0 auto;
        color: #fff;
        /*padding: 14px 8px;*/
    }
    /*图片蒙层*/
    .mask_title{
        font-size:12px;
        padding: 14px 8px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
    }
    .mask_icon{
        text-align: center;
        padding: 30% 0 0;
    }
    .mask-btn .el-icon-search {
        color: #fff;
        font-size: 26px;
        cursor: pointer;
        /*margin-top: 45px;*/
    }
    .mask_a{
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 16px;
    }
    .mask-btn a {
        display: block;
        background: rgba(24,144,255,1);
        border-radius: 4px;
        width: 100px;
        height: 34px;
        color: #fff;
        /*text-align: center;*/
        line-height: 34px;
        font-size: 14px;
        margin: 0 auto;
    }
    .mask-btn a:hover{
        opacity: 0.9;
    }
    /*分页*/
    .ad_pagination{
        margin: 16px 0;
    }
    /*大图*/
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
    /*上传图片*/
    .upload_p{
        margin-bottom: 16px;
    }

    /deep/ .upload_p .el-cascader{
        width: 100%;
    }

    .upload_img{
        height: 104px;
        overflow: hidden;
    }

    .upload_dialog_body /deep/ .el-upload--picture-card{
        width: 100%;
        height: 104px;
        line-height: 104px;
    }
    .upload_dialog_body /deep/ .el-upload--picture-card i{
        /*position: absolute;*/
        /*top: 49%;*/
        /*left: 45%;*/
    }
    /*上传成功*/
    /deep/ .el-upload-list--picture-card .el-upload-list__item{
        width: 100%;
        height: 104px;
        text-align: center;
    }
    /deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail{
        width: auto;
        height: 100%;
    }
    /*弹出框*/
    /deep/ .el-dialog__header{
        padding: 24px 24px 16px;
    }

    /deep/ .el-dialog__body{
        padding: 0 24px 24px;
    }

    .upload_img /deep/ .el-progress-circle{
        width: 104px !important;
        height: 104px !important;
    }
    .upload_img /deep/ .el-progress__text{
        width: 104px !important;
    }
</style>
