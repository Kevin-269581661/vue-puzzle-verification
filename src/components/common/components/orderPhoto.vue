<template>
    <div class="orderPhoto"
         v-loading="imgLoading"
         element-loading-text="玩命加载中..."
         element-loading-spinner="el-icon-loading">
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
                <el-button type="primary" icon="el-icon-search" class="searchBtn"
                           @click="searchFun()" :disabled="!isSearch">搜索
                </el-button>
                <el-button plain @click="reset()">重置</el-button>
            </el-col>
            <el-col :span="12" class="el_col_upload_btn">
                <el-button v-if="isShowBtn" type="primary" @click="uploadFun()" :disabled="!isSearch">上传图片</el-button>
                <!--<el-button plain size="small" @click="photoDownLoad()">一键导出</el-button>-->
            </el-col>
        </el-row>
        <div>
            <div class="photo_list clearfix" :class="showPic === 1 ? 'no_data' : ''">
                <div class="noFind" v-show="showPic === 1">
                    <img src="../../../assets/images/tempPic.png" alt="">
                    <p style="margin-top: -10px;color: #666">暂无数据</p>
                </div>
                <div class="photo_card"
                     v-show="showPic === 2"
                     v-for="(item,index) in imgList"
                     :key="index"
                     @mouseenter="showPreImg = index"
                     @mouseleave="showPreImg = null">
                    <img :src="item.url" :alt="item.title">
                    <div class="mask_bottom">
                        <p class="mask_title">{{item.name || '--'}}</p>
                        <p class="mask_title">由 {{item.userName}} 于 {{item.createTime}} 上传</p>
                        <p class="mask_title">行业: {{item.topIndustryName || '--'}} / {{item.industryName || '--'}} </p>
                    </div>
                    <!--查看缩略图和下载-->
                    <div class="mask-btn" v-if="showPreImg == index">
                        <p class="mask_icon">
                            <i class="el-icon-search" @click="handlePictureCardPreview(item)"></i>
                            <i class="el-icon-edit-outline" @click="editImgInfo(item)" v-show="sessionData.uID == item.userId"></i>
                            <i class="el-icon-delete" @click="deletImg(item)" v-show="sessionData.uID == item.userId"></i>
                        </p>
                        <p class="mask_a">
                            <a :href= "imgUrl + item.id" >下载图片</a>
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
                    :page-sizes="[10, 20, 50]"
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
                <el-button plain @click="UploadVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadIndustryImg">确 定</el-button>
            </span>
        </el-dialog>
        <!--图片编辑-->
        <el-dialog
            title="编辑图片信息"
            :visible.sync="editPhotoDialogVisible"
            :close-on-click-modal="false"
            custom-class="edit_photo_dialog"
            width="398px">
            <ul class="edit_photo_ul">
                <li>
                    <span>图片名称：</span>
                    <el-input v-model="editPhotoInfo.name" size="small" placeholder="请输入内容" style="width: 267px"></el-input>
                </li>
                <li>
                    <span>所属行业：</span>
                    <el-cascader :options="bussiness" size="small" class="plan-select" v-model="editPhotoInfo.industry"
                                 change-on-select
                                 @change="UploadIndustryChange"
                                 filterable>
                    </el-cascader>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="editPhotoDialogVisible = false">取 消</el-button>
                <el-button size="mini" type="primary" style="margin-left: 35px" @click="editImgFun">
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {Image} from 'element-ui';
    import industryToText from "../../../commonFun/industryToText.js";
    import sessFun from "../../../commonFun/sessFun"
    import api from "../../../api/api"
    export default {
        name: "orderPhoto",
        components:{
            elImage: Image,
        },
        data(){
            return{
                sessionData: '',
                // 图片加载
                imgLoading: true,
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
                imgUrl: this.apiVar.qadnUrl + "/advertisement/DownloadCompanyImage?id=" ,
                // 编辑图片
                editPhotoDialogVisible: false,
                editPhotoInfo: {
                    name:'',
                    industry: [],
                    id:''
                }
            }
        },
        mounted(){
            this.getSessionData()
            this.getIndustry()
            this.getIndustryImgList()
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
            getIndustryImgList() {
                this.imgLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    pageNo: this.pageData.pageNum,
                    pageSize: this.pageData.pageSize,
                    industryId: this.industryIdArr[1],
                }
                if (!params.industryId) {
                    delete params.industryId
                }
                api.getApi(this.apiVar.Advertisement + '/image/listCompanyImage', params).then(res => {
                    console.log('图片列表res', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        this.setImgList(res.data.data)
                        this.pageData.totalSize = res.data.total
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                    this.imgLoading = false
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
                            industry: [key.topIndustryId,key.industryId],
                            industryName: key.industryName,
                            topIndustryName: key.topIndustryName,
                            userId: key.userId,
                            name: key.name
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
                    this.uploadUrl = res.data
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
                    return
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
            // 编辑图片
            editImgInfo(item) {
                this.editPhotoInfo = JSON.parse(JSON.stringify(item))
                this.editPhotoDialogVisible = true
            },
            // 图片删除
            deletImg(item){
                console.log('item',item)
                this.$confirm('确定要删除该图片吗, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let submitLoading = this.$loading({
                        lock: true,
                        text: '删除中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        id: item.id
                    }
                    api.postApi(this.apiVar.Advertisement + '/image/remove', params).then(res => {
                        console.log('删除图片res', res)
                        if (res.data.SysCode === 200200) {
                            // 最后一页（大于1页）且是最后一张图片
                            if (this.imgList.length <= 1 && this.pageData.pageNum > 1) {
                                this.pageData.pageNum -= 1
                            }
                            this.getIndustryImgList()
                            sessFun.messageFun('success', '删除成功')
                        } else {
                            sessFun.messageFun('warning', res.data.MSG)
                        }
                        submitLoading.close()
                    }).catch(err => {
                        sessFun.messageFun('warning', '删除异常！')
                        submitLoading.close()
                    })
                }).catch(() => {
                    sessFun.messageFun('info','已取消删除')
                })
            },
            // 图片信息编辑
            editImgFun() {
                console.log('图片信息编辑',this.editPhotoInfo)
                if(!this.editPhotoInfo.name) {
                    sessFun.messageFun('warning', '请输入图片名称！')
                } else if (this.editPhotoInfo.industry.length < 2 || !this.editPhotoInfo.industry[0] || !this.editPhotoInfo.industry[1]) {
                    sessFun.messageFun('warning', '请选择行业！')
                } else {
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        id: this.editPhotoInfo.id,
                        industryId: this.editPhotoInfo.industry[1],
                        name: this.editPhotoInfo.name
                    }
                    api.postApi(this.apiVar.Advertisement + '/image/updateIndustry',params).then(res=>{
                        console.log('修改图片关联行业res',res)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            this.loginTimeout()
                        } else if (res.data.SysCode === 200200) {
                            this.messageFun('success', '修改成功')
                            this.editPhotoDialogVisible = false
                            let industryNames = this.getIndustryNamebyId(this.editPhotoInfo.industry)
                            console.log('industryNames',industryNames)
                            for(let key of this.imgList) {
                                if(key.id === this.editPhotoInfo.id) {
                                    key.name = this.editPhotoInfo.name
                                    key.industry = this.editPhotoInfo.industry
                                    key.industryName = industryNames[0]
                                    key.topIndustryName = industryNames[1]
                                }
                            }
                        } else {
                            this.messageFun('warning', res.data.MSG)
                        }
                    })
                }
            },
            // 根据id获取行业的名称
            getIndustryNamebyId(idList) {
                let industryNames = []
                for (let key of this.bussiness) {
                    if (key.iID == idList[0]) {
                        industryNames.push(key.label)
                        for (let cKey of key.children) {
                            if (cKey.iID == idList[1]) {
                                industryNames.push(cKey.label)
                                break
                            }
                        }
                        break
                    }
                }
                return industryNames
            },
            // 查看图片
            handlePictureCardPreview(item) {
                console.log('imgInfo--------', item);
                this.dialogImageUrl = item.url;
                this.dialogVisible = true;
            },
            // 分页
            changePage(val){
                console.log('当前页',val)
                this.pageData.pageNum = val
                this.getIndustryImgList()
            },
            // 每页的条数
            changeSize(val){
                console.log('每页的条数',val)
                this.pageData.pageSize = val
                this.getIndustryImgList()
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
        min-height: 622px;
    }

    .photo_list.no_data{
        min-height: 412px;
    }

    /*图片*/
    .photo_card{
        width: 19%;
        height:0;
        padding-bottom: 25%;
        position: relative;
        margin: 0 .9% 16px 0;
        float: left;
        text-align: center;
        /*cursor: pointer;*/
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: 2px;
    }

    .photo_card:nth-child(5n+1){
        margin-right: 0;
    }

    .photo_card img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
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

    .industry_read /deep/ .el-input__suffix{
        display: none;
    }

    .industry_read /deep/ .el-cascader__label span{
        color: #c0c4cc;
    }

    .photo_card .mask-btn {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.2);
        text-align: left;
        margin: 0 auto;
        color: #fff;
    }

    /*图片蒙层*/
    .mask_bottom{
        width: 100%;
        position: absolute;
        bottom: 0;
        text-align: left;
        padding: 8px 0 4px;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.5));
        background: -ms-linear-gradient(to bottom, rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.5));
        background: -o-linear-gradient(to bottom, rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.5));
        background: -moz-linear-gradient(to bottom, rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.5));
        background: -webkit-linear-gradient(to bottom, rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.5));
    }

    .mask_title{
        font-size:12px;
        padding: 2px 8px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .mask_icon{
        text-align: center;
        padding: 30% 0 0;
    }

    .mask_icon i{
        color: #fff;
        font-size: 26px;
        cursor: pointer;
    }

    .mask_a{
        width: 100%;
        text-align: center;
        margin-top: 40px;
    }

    .mask-btn a {
        display: block;
        background: rgba(24,144,255,1);
        border-radius: 4px;
        width: 100px;
        height: 34px;
        color: #fff;
        line-height: 34px;
        font-size: 14px;
        margin: 0 auto;
    }

    .mask-btn a:hover{
        opacity: 0.9;
    }

    /*分页*/
    .ad_pagination{
        margin: 0 0 16px 0;
    }

    /*大图*/
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

    /*编辑弹出框*/
    .edit_photo_ul li:nth-child(1){
        margin-bottom: 12px;
    }
</style>
