<!-- 换画tab -->
<template>
    <div class="pic_box">
        <div class="list_pic">
            <div class="pic_left">
                <span class="compare">&lt;</span>

                <span class="pain_span">换画1</span>
                <span class="pain_span">换画2</span>
                <span class="pain_span">换画3</span>
                <span class="pain_span">换画33</span>

                <span class="compare">&gt;</span>
            </div>
            <div class="process">
                <el-button type="primary">编辑报告</el-button>
                <span class="process_box">
                    <el-progress :percentage="50" :text-inside="true" :stroke-width="16"></el-progress>
                    3300 / 2600
                </span>
            </div>
        </div>
        <!-- 搜索 -->
        <div class="search_pic">
            <el-row :gutter="32">
                <el-col>
                    <span>媒体类型:</span>
                    <el-select v-model="searchInfo.mediaType" placeholder="请选择媒体类型" size="small">
                        <el-option v-for="item of searchInfo.mediaTypeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <span>城市区域:</span>
                    <el-cascader :options="searchInfo.citys" v-model="searchInfo.city" placeholder="请选择城市区域" filterable size="small"></el-cascader>
                </el-col>
                <el-col>
                    <span>资源名称:</span>
                    <el-select v-model="searchInfo.resName" placeholder="请选择资源名称" size="small">
                        <el-option v-for="item of searchInfo.resArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <span>监播状态:</span>
                    <el-select v-model="searchInfo.status" placeholder="请选择监播状态" size="small">
                        <el-option v-for="item of searchInfo.statusArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>

        <!-- 换画报告 -->
        <div class="imgs_box">
            <div class="imgs_point">
                <div class="point_item">
                    <div class="detail_top">
                        <p>广州市天河区-东方雅苑-西门-B</p>
                        <p class="car_header">
                            <span><i class="el-icon-date date_fa" type="text"></i>005B201811GZ-X795</span>
                            <span><i class="el-icon-date date_fa" type="text"></i>换画日期:2018/03/08</span>
                        </p>
                    </div>
                    <div class="detail_con">
                        <div class="img_box">
                            <img class="upload_img_item" src="../../../assets/images/code.jpg">
                            <label class="icon_success">
                                <i class="el-icon-check"></i>
                            </label>
                            <div class="icon_box">
                                <p class="img_box_icon">
                                    <i class="el-icon-search"></i>
                                    <i class="el-icon-star-off" ></i>
                                    <!-- <i class="el-icon-star-on icon_save"></i> -->
                                    <i class="el-icon-delete"></i>
                                </p>
                            </div>
                        </div>
                        
                        <!-- <el-upload class="upload_plus"
                            :key="index+'-'+currUpPage+'-1'"
                            @click.native="saveId(updata)"
                            :class="{disabled:uploadDisabled(updata.upImgArr)}"
                            :action="doUpload"
                            :http-request="uploadImg"
                            :limit="6"
                            list-type="picture-card"
                            :show-file-list="true"
                            :file-list="updata.upImgArr"
                            :before-upload="beforeAvatarUpload"
                            :before-remove="beforeImgRemove"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-exceed="handleExceed" multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload> -->
                        <el-upload class="upload_plus"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="true"
                            list-type="picture-card"
                            multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
                <div class="point_item">
                    <div class="detail_top">
                        <p>广州市天河区-东方雅苑-西门-B</p>
                        <p class="car_header">
                            <span><i class="el-icon-date date_fa" type="text"></i>005B201811GZ-X795</span>
                            <span><i class="el-icon-date date_fa" type="text"></i>换画日期:2018/03/08</span>
                        </p>
                    </div>
                    <div class="detail_con">
                        
                        <!-- <el-upload class="upload_plus"
                            :key="index+'-'+currUpPage+'-1'"
                            @click.native="saveId(updata)"
                            :class="{disabled:uploadDisabled(updata.upImgArr)}"
                            :action="doUpload"
                            :http-request="uploadImg"
                            :limit="6"
                            list-type="picture-card"
                            :show-file-list="true"
                            :file-list="updata.upImgArr"
                            :before-upload="beforeAvatarUpload"
                            :before-remove="beforeImgRemove"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-exceed="handleExceed" multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload> -->
                        <el-upload class="upload_plus"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="true"
                            list-type="picture-card"
                            multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
                <div class="point_item">
                    <div class="detail_top">
                        <p>广州市天河区-东方雅苑-西门-B</p>
                        <p class="car_header">
                            <span><i class="el-icon-date date_fa" type="text"></i>005B201811GZ-X795</span>
                            <span><i class="el-icon-date date_fa" type="text"></i>换画日期:2018/03/08</span>
                        </p>
                    </div>
                    <div class="detail_con">
                        <div class="img_box">
                            <img class="upload_img_item" src="../../../assets/images/code.jpg">
                            <label class="icon_success">
                                <i class="el-icon-check"></i>
                            </label>
                            <div class="icon_box">
                                <p class="img_box_icon">
                                    <i class="el-icon-search"></i>
                                    <i class="el-icon-star-off" ></i>
                                    <!-- <i class="el-icon-star-on icon_save"></i> -->
                                    <i class="el-icon-delete"></i>
                                </p>
                            </div>
                        </div>
                        <div class="img_box">
                            <img class="upload_img_item" src="../../../assets/images/code.jpg">
                            <label class="icon_success">
                                <i class="el-icon-check"></i>
                            </label>
                            <div class="icon_box">
                                <p class="img_box_icon">
                                    <i class="el-icon-search"></i>
                                    <i class="el-icon-star-off" ></i>
                                    <!-- <i class="el-icon-star-on icon_save"></i> -->
                                    <i class="el-icon-delete"></i>
                                </p>
                            </div>
                        </div>
                        <div class="img_box">
                            <img class="upload_img_item" src="../../../assets/images/code.jpg">
                            <label class="icon_success">
                                <i class="el-icon-check"></i>
                            </label>
                            <div class="icon_box">
                                <p class="img_box_icon">
                                    <i class="el-icon-search"></i>
                                    <i class="el-icon-star-off" ></i>
                                    <!-- <i class="el-icon-star-on icon_save"></i> -->
                                    <i class="el-icon-delete"></i>
                                </p>
                            </div>
                        </div>
                        
                        <!-- <el-upload class="upload_plus"
                            :key="index+'-'+currUpPage+'-1'"
                            @click.native="saveId(updata)"
                            :class="{disabled:uploadDisabled(updata.upImgArr)}"
                            :action="doUpload"
                            :http-request="uploadImg"
                            :limit="6"
                            list-type="picture-card"
                            :show-file-list="true"
                            :file-list="updata.upImgArr"
                            :before-upload="beforeAvatarUpload"
                            :before-remove="beforeImgRemove"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-exceed="handleExceed" multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload> -->
                        <el-upload class="upload_plus"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="true"
                            list-type="picture-card"
                            multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
                <div class="point_item">
                    <div class="detail_top">
                        <p>广州市天河区-东方雅苑-西门-B</p>
                        <p class="car_header">
                            <span><i class="el-icon-date date_fa" type="text"></i>005B201811GZ-X795</span>
                            <span><i class="el-icon-date date_fa" type="text"></i>换画日期:2018/03/08</span>
                        </p>
                    </div>
                    <div class="detail_con">
                        <div class="img_box">
                            <img class="upload_img_item" src="../../../assets/images/code.jpg">
                            <label class="icon_success">
                                <i class="el-icon-check"></i>
                            </label>
                            <div class="icon_box">
                                <p class="img_box_icon">
                                    <i class="el-icon-search"></i>
                                    <i class="el-icon-star-off" ></i>
                                    <!-- <i class="el-icon-star-on icon_save"></i> -->
                                    <i class="el-icon-delete"></i>
                                </p>
                            </div>
                        </div>
                        
                        <!-- <el-upload class="upload_plus"
                            :key="index+'-'+currUpPage+'-1'"
                            @click.native="saveId(updata)"
                            :class="{disabled:uploadDisabled(updata.upImgArr)}"
                            :action="doUpload"
                            :http-request="uploadImg"
                            :limit="6"
                            list-type="picture-card"
                            :show-file-list="true"
                            :file-list="updata.upImgArr"
                            :before-upload="beforeAvatarUpload"
                            :before-remove="beforeImgRemove"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-exceed="handleExceed" multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload> -->
                        <el-upload class="upload_plus"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :show-file-list="true"
                            list-type="picture-card"
                            multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
            </div>
        </div>

        <!-- 分页 -->
        <div class="pager">
            <el-pagination 
                v-if="pageInfo.paginationShow"
                background
                :current-page.sync="pageInfo.currPage"
                :page-sizes="[6, 12]"
                :page-size="pageInfo.pageSize"
                layout="sizes, prev, pager, next, jumper"
                :total="pageInfo.totalNum"
                @size-change="sizeChange"
                @current-change='changePage'>
            </el-pagination>
        </div>

        <!-- 换画弹出框 -->
        <el-dialog
            title="选择换画点位"
            :visible.sync="isShowPic">
            <el-row class="dialog_pic">
                <span>资源名称:</span>
                <el-input v-model="dialogInfo.resName" placeholder="请输入资源名称" size="small"></el-input>
                <span>换画状态:</span>
                <el-select v-model="dialogInfo.picState" placeholder="请选择换画状态" size="small">
                    <el-option v-for="(item, index) of dialogInfo.stateArr" :key="index" :label="item.name" :value="item.name"></el-option>
                </el-select>
                <span>地图中心点:</span>
                <el-select v-model="dialogInfo.mapName" placeholder="请选择地图中心点" size="small">
                    <el-option v-for="(item, index) of dialogInfo.mapArr" :key="index" :label="item.name" :value="item.name"></el-option>
                </el-select>
                <el-button plain>搜索</el-button>
                <el-button plain>重置</el-button>
                <el-button type="primary">换画</el-button>
                <el-button plain>取消换画</el-button>
            </el-row>
            <div class="car-title">
                <i class="el-icon-info" style="color: #1890FF;"></i>
                <!-- <h4>全部点位共 <span>{{remarkNum}}</span> 个 已设置换画点位 <span>{{remarkNum}}</span> 个 -->
                </h4>
            </div>
            <!-- <p style="margin-top:15px;">
                <div class="car-title">
                    <i class="el-icon-info" style="color: #1890FF;"></i>
                    <h4>全部点位共 <span>{{remarkNum}}</span> 个 已设置换画点位 <span>{{remarkNum}}</span> 个
                    </h4>
                </div>
            </p>
            <el-table :data="materInfoArr" border height="450" ref="multipleTable" v-loading="materloading" v-loadmore="materLoadMore" @select="handleSelect" @select-all="handleSelectAll" class="table_mater">
                <el-table-column type="selection" width="41px" scope="scope" >
                </el-table-column>
                </el-table-column>
                <el-table-column prop="resName" label="资源">
                </el-table-column>
                <el-table-column prop="mTitle" label="媒体">
                </el-table-column>
                <el-table-column prop="asLab" label="面" width="60">
                </el-table-column>
                <el-table-column prop="city" label="城市" width="90">
                </el-table-column>
                <el-table-column prop="rName" label="区域" width="90">
                </el-table-column>
                <el-table-column prop="map" label="地图中心点">
                </el-table-column>
                <el-table-column prop="timeRange" label="排期" min-width="120" :filters="filtersData" :filter-method="filterTimeRange">
                </el-table-column>
                <el-table-column prop="map" label="换画日期">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="imgUrl" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button size="small" icon="el-icon-picture" :style="{'color':scope.row.imgUrl?'#108DE7':''}" @click="previewImg(scope.row)" :disabled="!scope.row.imgUrl"></el-button>
                        <el-button size="small" icon="el-icon-delete" :style="{'color':scope.row.imgUrl?'#108DE7':''}" @click="deleteOneImg(scope.row, scope.$index)" :disabled="!scope.row.imgUrl"></el-button>
                    </template>
                </el-table-column>

                <div slot="empty">
                    <no-search-result></no-search-result>
                </div>
            </el-table>
            <p style="text-align:center;margin-top:20px;">
                <el-button plain size="small" @click="saveAll()">取消</el-button>
                <el-button type="primary" size="small" @click="saveAll()">保存</el-button>
            </p> -->
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 搜索信息
            searchInfo:{
                mediaType: '',
                city: [],
                resName: '',
                status: '',
                // 搜索列表数据
                // 媒体类型
                mediaTypeArr: [
                    {
                        label:'广告门',
                        value: 1,
                    },
                    {
                        label: '道闸',
                        value: 2
                    }
                ],
                // 城市区域
                citys: [],
                // 资源列表
                resArr: [],
                // 状态
                statusArr: [
                    {
                        label: '已上传',
                        value: 1,
                    },
                    {
                        label: '未上传',
                        value: 2
                    }
                ],
            },
            // 分页信息
            pageInfo:{
                paginationShow: true,
                currPage: 1,
                totalNum: 0,
                pageSize: 6,
            },
            // 图片列表
            imageArr: [],
            // 是否展示换画弹框
            isShowPic: true,
            // 弹出框搜索
            dialogInfo:{
                resName: '',
                picState: '',
                mapName: '',
                // 状态列表
                stateArr: [],
                // 地图中心点列表
                mapArr: [],
            },
        }
    },
    methods: {
        // 改变页数
        sizeChange(pageVal){
            this.pageInfo.currPage = 1;
        },
        // 点击页数
        changePage(page){
            this.pageInfo.currPage = page;
        },
    },
}
</script>

<style scoped>
.list_pic{
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}
.pain_span{
    display: inline-block;
    height: 32px;
    line-height: 32px;
    text-align: center;
    min-width: 74px;
    border-radius:4px;
    border:1px solid rgba(0,0,0,0.15);
    color:rgba(0,0,0,0.25);
}
.compare{
    width: 32px;
    display: inline-block;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius:4px;
    border:1px solid rgba(0,0,0,0.15);
    color:rgba(0,0,0,0.25);
}
/* 选中 */
.active{
    border:1px solid rgba(24,144,255,1);
    color:rgba(24,144,255,1);
}
/* 进度条 */
.process{
    min-width: 280px;
}
.process_box{
    min-width: 150px;
    height: 32px;
    line-height: 32px;
    border-radius:4px;
    border:1px solid rgba(0,0,0,0.15);
    display: inline-block;
    margin-left: 16px;
    padding: 0 10px;
    font-size: 12px;
}
/deep/.process_box .el-progress{
    display: inline-block;
    width:80px;    
    position: relative;
    right: 0;
    top: 0;
}
/deep/.process_box .el-progress-bar{
    width:80px;
}
/deep/.search_pic .el-row span{
    color: rgba(0,0,0,0.85);
    font-size: 14px;
}
/deep/.search_pic .el-col-24{
    width: auto;
}
/deep/.search_pic .el-col-24{
    min-width: 25%;
}
/deep/.search_pic .el-row .el-select, /deep/.search_pic .el-row .el-cascader{
    width: calc(98% - 60px);
}
/* 报告列表 */
/* .imgs_box{

} */
.imgs_point{
    display: flex;
	justify-content: flex-start;
	align-items: center;
	flex-wrap: wrap;
    margin: 16px -10px;
}
.point_item{
    width: 370px;
    height: 326px;
    margin: 0 10px 16px;
    border: 1px solid rgba(233,233,233,1);
}
/* 详情头部 */
.detail_top{
    height: 56px;
    padding: 9px 16px 0;
    background:rgba(247,247,247,1);
    border-bottom:1px solid rgba(233,233,233,1);
    font-size: 14px;
    color: #666666;
    background: rgba(247, 247, 247, 1);
}
.detail_top p{
    line-height: 20px;
}
.car_header {
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px solid #dedede;
}
.car_header span {
    color: rgba(153, 153, 153, 1);
    line-height: 17px;
}
.date_fa {
    margin-right: 4px;
}
/* 详情内容 */
.detail_con{
    margin: 16px;
    display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
}

.img_box {
    width: 105px;
    height: 105px;

    /* width: 30%; */
    /* margin: 4.2% 1.6% 0 1.6%; */

    margin-bottom: 16px;    
    float: left;
    position: relative;
    overflow: hidden;
}

.upload_img_item {
    width: 100%;
    height: 100%;
}
.icon_success{
    display: block;
    position: absolute;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
    box-shadow: 0 0 1pc 1px rgba(0,0,0,.2)
}
.icon_success i{
    color: #fff;
    font-size: 12px;
    margin-top: 11px;
    transform: rotate(-45deg);
}
.icon_box{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left: 0;
    background: rgba(0,0,0,.5);
    cursor:pointer;
}
.img_box_icon {
    width: 100%;
    margin-top:40%;
    text-align: center;
}
.img_box_icon i{
    color: #fff;
    font-size: 22px;
}
.img_box_icon i.icon_save {
    color: #FFD517;
}
/deep/.detail_con .el-upload--picture-card {
    width: 105px;
    height: 105px;
    line-height: 105px;

    /* width: 30%; */
    /* margin: 4.2% 1.6% 0 1.6%; */
    margin: 0;
    margin-bottom: 16px;

    background: rgba(251, 251, 251, 1);
    border-radius: 4px;
    border: 1px dashed #dedede;
    text-align: center;
}

/deep/.detail_con .el-upload-list--picture-card .el-upload-list__item {
    width: 30%;
    height: 105px;
    margin: 4.2% 1.6% 0 1.6%;
}
/* 分页 */
.pager{
    height: 32px;
    text-align: right
}

/* 弹出框 */
.dialog_pic .el-input{
    width: auto;
}
.car-title {
    background: #E6F7FF;
    border: 1px solid #BAE7FF;
    border-radius: 4px;
    margin-bottom: 10px;
    padding: 5px;
}

.car-title h4 {
    font-size: 14px;
    display: inline-block;
}

.car-title span {
    font-size: 14px;
    font-weight: normal;
    margin: 0 6px;
    cursor: pointer;
    color: #1890ff;
}

/* 图片列表间距 */
@media all and (min-width: 1440px){
    .imgs_point{
        margin: 16px -28px;
    }
    .point_item{
        margin: 0 28px 16px; 
    }
}
@media all and (min-width: 1920px){
    .imgs_point{
        margin: 16px -36px;
    }
    .point_item{
        margin: 0 36px 16px; 
    }
}
</style>
