<!-- 换画tab -->
<template>
    <div class="pic_box" v-loading="pageInfo.loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
        <!-- 上下刊 -->
        <template v-if="type==1 || type == 2">
            <template>
                <el-radio-group v-model="publishSearchInfo.mediaType" size="medium" @change="changeMedia()" class="radio_style">
                    <el-radio-button label="广告门"></el-radio-button>
                    <el-radio-button label="道闸"></el-radio-button>
                </el-radio-group>
                <p style="font-size: 16px;color: red;display:inline-block;float:right;">提示：上传完图片后请点击保存</p>
            </template>

            <div class="up-loader-header">
                <el-cascader :options="publishSearchInfo.citys" v-model="publishSearchInfo.citySelect" @change="searchImgChange()" filterable>
                </el-cascader>
                <el-select placeholder="请选择资源" filterable v-model="publishSearchInfo.allhouse" @change="searchImg()">
                    <el-option v-for="(item, index) of publishSearchInfo.allResource" :key="index" :label="item.resName" :value="item.value"></el-option>
                </el-select>
                <el-select placeholder="请选择监播图" v-model="publishSearchInfo.allPic" @change="searchImg()">
                    <el-option label="已上传" value="2"></el-option>
                    <el-option label="未上传" value="3"></el-option>
                </el-select>
                <div class="progress">
                    <el-progress :percentage="publishNumInfo.percent" :text-inside="true"></el-progress>
                    <span>{{ publishNumInfo.currNum }} / {{ publishNumInfo.totalNum }}</span>
                </div>
            </div>
        </template>
        <!-- 换画报告 -->
        <template v-else>
            <div class="list_pic" v-if="painList.length">
                <div class="pic_left">
                    <el-button icon="el-icon-arrow-left" plain class="compare" @click="toLeft()" :disabled="activePainIndex == 0"></el-button>
                    <div class="pic_content">
                        <span :class="['pain_span', activePainIndex==index ? 'active':'']" v-for="(item, index) of painList" :key="item.id" @click="changePain(index)">{{ item.name }}</span>
                    </div>
                    <el-button icon="el-icon-arrow-right" plain class="compare" @click="toRight()" :disabled="activePainIndex == painList.length-1"></el-button>
                </div>
                <div class="process">
                    <el-button type="primary" @click="editReport()">编辑报告</el-button>
                    <span class="process_box">
                        <el-progress :percentage="publishNumInfo.percent" :text-inside="true" :stroke-width="16"></el-progress>
                        {{ publishNumInfo.currNum }} / {{ publishNumInfo.totalNum}}
                    </span>
                </div>
            </div>
            <!-- 搜索 -->
            <div class="search_pic">
                <el-row :gutter="32">
                    <el-col>
                        <span>媒体类型:</span>
                        <el-select v-model="searchInfo.mediaType" placeholder="请选择媒体类型" @change="search()" size="small">
                            <el-option v-for="item of searchInfo.mediaTypeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span>城市区域:</span>
                        <el-cascader :options="searchInfo.citys" v-model="searchInfo.city" placeholder="请选择城市区域" filterable size="small" @change="painCityChange()"></el-cascader>
                    </el-col>
                    <el-col>
                        <span>资源名称:</span>
                        <el-select v-model="searchInfo.resName" placeholder="请选择资源名称" @change="search()" size="small" filterable>
                            <el-option v-for="item of searchInfo.resArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col>
                        <span>监播状态:</span>
                        <el-select v-model="searchInfo.status" placeholder="请选择监播状态" @change="search()" size="small">
                            <el-option v-for="item of searchInfo.statusArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>
        </template>

        <!-- 图片列表 -->
        <div class="imgs_box">
            <div class="imgs_point">
                <div class="point_item" v-for="(item, index) of imageArr" :key="index">
                    <div class="detail_top">
                        <el-tooltip class="item" effect="dark" :content='item.city+"-"+item.rName+"-"+item.resName+"-"+item.mTitle+"-"+item.asLab' placement="bottom" v-if='(item.city+"-"+item.rName+"-"+item.resName+"-"+item.mTitle+"-"+item.asLab).length>23'>
                            <span>{{wordlimit(item.city+"-"+item.rName+"-"+item.resName+"-"+item.mTitle+"-"+item.asLab, 23)}}</span>
                        </el-tooltip>
                        <span v-else>{{item.city+"-"+item.rName+"-"+item.resName+"-"+item.mTitle+"-"+item.asLab}}</span>
                        <p class="car_header">
                            <el-tooltip class="item" effect="dark" :content="item.assetTag" placement="bottom" v-if="item.assetTag&&item.assetTag.length>10">
                                <span><i class="el-icon-date date_fa" type="text"></i>{{wordlimit(item.assetTag, 10)}}</span>
                            </el-tooltip>
                            <span v-else><i class="el-icon-date date_fa" type="text"></i>{{item.assetTag}}</span>
                            <span v-if="type ==1 || type ==2"><i class="el-icon-date date_fa" type="text"></i>{{item.timeRange}}</span>
                            <span v-if="type==3"><i class="el-icon-date date_fa" type="text"></i>换画日期:{{ item.replaceDate }}</span>
                        </p>
                    </div>
                    <div class="detail_con">
                        <div class="img_box"
                            v-for="(img, imgIndex) of item.photoList"
                            @mouseenter="showPreImg = img.pID"
                            @mouseleave="showPreImg = null"
                            :key="imgIndex">
                            <img class="upload_img_item" :src="img.thumbnailURL">
                            <label class="icon_success">
                                <i class="el-icon-check"></i>
                            </label>
                            <div class="icon_box" v-if="showPreImg === img.pID">
                                <p class="img_box_icon">
                                    <i class="el-icon-search" @click="previewImg(img.pURL)"></i>
                                    <i class="el-icon-star-off" v-if="!img.isCollection" @click="saveImgFun(item, imgIndex)"></i>
                                    <i v-if="img.isCollection" class="el-icon-star-on icon_save" @click="cancelImgFun(item, imgIndex)"></i>
                                    <i class="el-icon-delete" @click="deleteImg(img)"></i>
                                </p>
                            </div>
                        </div>

                        <el-upload class="upload_plus"
                            :key="index+'-'+pageInfo.currPage+'-1'"
                            @click.native="saveId(item)"
                            :class="{disabled:uploadDisabled(item.photoList)}"
                            :action="doUpload"
                            :http-request="uploadImg"
                            :limit="6"
                            list-type="picture-card"
                            :show-file-list="true"
                            :file-list="item.photoList"
                            :before-upload="beforeAvatarUpload"
                            :before-remove="beforeImgRemove"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-exceed="handleExceed" multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
            </div>
        </div>

        <!-- 分页 -->
        <div class="pager">
            <el-pagination v-if="pageInfo.paginationShow" background :current-page.sync="pageInfo.currPage" :page-sizes="[6, 12]" :page-size="pageInfo.pageSize" layout="sizes, prev, pager, next, jumper" :total="pageInfo.totalNum" @size-change="sizeChange" @current-change='changePage'>
            </el-pagination>
        </div>

        <div class="up-report-bottom">
            <el-button plain @click="downloadImg()" :loading="downLoading">导出图片</el-button>
            <el-button type="primary" @click="submitUpload()">保存</el-button>
            <el-button plain @click="showH5()">查看H5</el-button>
            <el-button plain @click="updateReport()" :loading="updateLoading">更新报告</el-button>
        </div>

        <!-- 换画弹出框 -->
        <el-dialog title="选择换画点位" :visible.sync="isShowPic">
            <el-row class="dialog_pic">
                <span>资源名称:</span>
                <el-select v-model="dialogInfo.resName" multiple filterable placeholder="请输入资源名称" size="small">
                    <el-option v-for="item in dialogInfo.resArr" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <span>换画状态:</span>
                <el-select v-model="dialogInfo.picState" placeholder="请选择换画状态" size="small">
                    <el-option v-for="(item, index) of dialogInfo.stateArr" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>地图中心点:</span>
                <el-select v-model="dialogInfo.mapName" placeholder="请选择地图中心点" size="small" filterable>
                    <el-option v-for="(item, index) of dialogInfo.mapArr" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button plain @click="searchPoint()">搜索</el-button>
                <el-button plain @click="resetPoint()">重置</el-button>
                <el-button type="primary" @click="showUpload()">换画</el-button>
                <el-button plain @click="cancelPain()">取消换画</el-button>
            </el-row>
            <div class="car-title">
                <i class="el-icon-info" style="color: #1890FF;"></i>
                <h4>
                    全部点位共
                    <span>{{ pointInfo.pointNum }}</span> 个 已设置换画点位
                    <span>{{ pointInfo.setedNum }}</span> 个
                </h4>
            </div>

            <el-table :data="pointArr" border height="450" ref="multipleTable" v-loading="dialogPage.pointLoading" v-loadmore="pointLoadMore" @select="handleSelect" @select-all="handleSelectAll" class="table_mater">
                <el-table-column type="selection" width="41px" scope="scope">
                </el-table-column>
                <el-table-column prop="resName" label="资源" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="mTitle" label="媒体" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="asLab" label="面" width="60">
                </el-table-column>
                <el-table-column prop="cityName" label="城市" width="90">
                </el-table-column>
                <el-table-column prop="districtName" label="区域" width="90">
                </el-table-column>
                <el-table-column prop="mapCenterInfo" label="地图中心点" align="center" width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{ scope.row.mapCenterInfo || '--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="timeRange" label="排期" min-width="120">
                </el-table-column>
                <el-table-column prop="replaceDate" label="换画日期">
                    <template slot-scope="scope">
                        <span>
                            {{ scope.row.replaceDate || '--'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>
                            {{ scope.row.remark || '--'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="picUrl" label="操作" width="80">
                    <template slot-scope="scope">
                        <i class="el-icon-picture" :style="{color:scope.row.picUrl?'#108DE7':'', margin: '0 10px'}" @click="previewImg(scope.row.picUrl)" :disabled="!scope.row.picUrl"></i>
                        <i class="el-icon-delete" :style="{'color':scope.row.picUrl?'#108DE7':''}" @click="deleteOneImg(scope.row)" :disabled="!scope.row.picUrl"></i>
                    </template>
                </el-table-column>

                <div slot="empty">
                    <no-search-result></no-search-result>
                </div>
            </el-table>
            <p style="text-align:center;margin-top:20px;">
                <el-button plain size="small" @click="cancel()">取消</el-button>
                <el-button type="primary" size="small" @click="saveAll()">保存</el-button>
            </p>
        </el-dialog>

        <!-- 编辑换画弹出框 -->
        <el-dialog :visible.sync="isShowEdit" title="编辑换画信息" width="405px">
            <el-row>
                <el-col class="flex_box">
                    <span>
                        <b style="color:#FF0000;">*</b> 换画日期：
                    </span>
                    <el-date-picker size="small" v-model="editInfo.date" value-format="yyyy/MM/dd" format="yyyy/MM/dd" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-col>
                <el-col class="flex_box imgpain_box">
                    <span>换画素材：</span>
                    <el-upload 
                        :action="doUpload" 
                        list-type="picture-card"
                        :file-list="imgUrl" 
                        :before-upload="beforeUpload"
                        :on-success="onsucess"                 
                        :limit='1'>
                        <span class="upload_border">
                            <i class="el-icon-plus"></i>
                            <span>上传图片</span>
                        </span>
                    </el-upload>
                </el-col>
                <el-col class="flex_box">
                    <span>备注信息：</span>
                    <el-input type="textarea" :rows="2" placeholder="请输入备注信息" v-model="editInfo.remark" :maxlength="100"> </el-input>
                </el-col>
            </el-row>
            <span slot="footer">
                <el-button plain @click="cancelChange()">取 消</el-button>
                <el-button type="primary" @click="confirmChange()">保 存</el-button>
            </span>
        </el-dialog>

        <!-- 图片查看显示 -->
        <el-dialog :visible.sync="dialogVisible" class="imgPreview" top="10vh">
            <img :src="dialogImageUrl" alt="暂无图片" />
        </el-dialog>
    </div>
</template>

<script>
import { api } from "../../../api/api.js";
import noSearchResult from "./noSearchResult.vue";
import timeFormat from '../../../commonFun/timeFormat.js';
import sessFun from '../../../commonFun/sessFun.js';
// 时间格式化
import dateFormat from "../../../commonFun/timeFormat.js";

export default {
    components: {
        noSearchResult
    },
    props:{
        type:{
            type: Number,
            default: 1
        },
        orderDetail:{
            type: Object,
            // default: {},
        },
        fromType:{
            type: Boolean,
        },
    },
    data() {
        return {
            // 上下刊搜索
            publishSearchInfo:{
                // 媒体类型
                mediaType: '广告门',
                // 城市选择
                citySelect: [],
                // 资源选择
                allhouse: '',
                // 监播图选择
                allPic: '',
                // 搜索列表
                // 城市列表
                citys: [],
                // 资源列表
                allResource: [],
            },

            // 上传图片
            addload:'',
            // 所有的图片组合
            uploadImgArr: [],
            // 关联属性数组
            constractArr:[],
            updateLoading: false,
            // 导出订单图片包
            downLoading: false,

            // 上下刊以及换画百分比数量等
            publishNumInfo:{
                percent: 0,
                currNum: 0,
                totalNum: 0,
            },
            // 换画名称列表
            painList: [],
            // 换画当前点击
            activePainIndex: 0,
            // 搜索信息
            searchInfo: {
                mediaType: "",
                city: [],
                resName: "",
                status: "",
                // 搜索列表数据
                // 媒体类型
                mediaTypeArr: [
                    {
                        label: "广告门",
                        value: 1
                    },
                    {
                        label: "道闸",
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
                        label: "已上传",
                        value: 1
                    },
                    {
                        label: "未上传",
                        value: 2
                    }
                ]
            },
            // 分页信息
            pageInfo: {
                paginationShow: true,
                currPage: 1,
                totalNum: 0,
                pageSize: 6,
                loading: true,
            },
            // 图片列表
            imageArr: [],
            //显示预览图蒙版
            showPreImg: null,
            // 是否展示换画弹框
            isShowPic: false,
            // 弹出框搜索
            dialogInfo: {
                resName: [],
                picState: "",
                mapName: "",
                // 资源名称列表
                resArr: [],
                // 状态列表
                stateArr: [
                    {
                        label: "全部换画点位",
                        value: 2
                    },
                    {
                        label: "已指定换画点位",
                        value: 1
                    },
                    {
                        label: "未指定换画点位",
                        value: 0
                    }
                ],
                // 地图中心点列表
                mapArr: [],
            },
            // 弹出框分页信息
            dialogPage:{
                loading_maInfo: false,
                currInfoPage: 1,
                pageSize: 10,
                totalInfoPage: 0,
                // pointLoading: true,
                pointLoading: false,
            },
            // 全部点位以及已设置点位
            pointInfo: {
                pointNum: 0,
                setedNum: 0
            },
            // 换画弹出框点位列表
            pointArr: [],
            // 勾选的列表
            shoplist: [],
            // 图片放大弹出框
            dialogVisible: false,
            dialogImageUrl: "",
            // 上传图片以及换画日期弹出框
            isShowEdit: false,
            // 上传图片地址
            doUpload: "/advertisement/UpLoad",
            // doUpload: "http://192.168.1.239/advertisement/UpLoad",
            imgUrl: [],
            editInfo: {
                date: "",
                url: "",
                remark: ""
            },
            // 时间控件限制范围
            dateRange:{
                beginDate: '',
                endDate: ''
            },
            pickerOptions:{
                disabledDate: (time) => {
                    // return false;
                    let beginDateVal = new Date(this.dateRange.beginDate).getTime()+60*60*24*1000;
                    let endDateVal = new Date(this.dateRange.endDate).getTime()-60*60*24*1000;
                    if (beginDateVal || endDateVal) {
                        return (time.getTime() < beginDateVal) || (time.getTime() > endDateVal);
                    }
                }
            },
        };
    },
    mounted(){
        console.log(this.fromType, 'fromtype----');
        this.sessionData = sessFun.getSess();
        // 获取报告列表
        this.getImgArr();
        // 获取城市区域
        this.getCitys();
        // 获取资源列表
        this.getResArr();
    },
    watch:{
        fromType(newVal, oldVal){
            console.log(newVal, oldVal, 'fromtype---watch---');
            this.getPainList().then(res =>{
                let len = this.painList.length;
                this.activePainIndex = len-1;
                this.dateRange = {
                    beginDate: this.painList[this.activePainIndex].startDate,
                    endDate: this.painList[this.activePainIndex].endDate
                };
                this.search();
                this.editReport();
            });
        },
    },
    directives: {
        loadmore: {
            bind: function (el, binding) {
                const selectWrap = el.querySelector('.el-table__body-wrapper')
                selectWrap.addEventListener('scroll', function () {
                    const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
                    // console.log('滚动的距离',scrollDistance)
                    if (scrollDistance <= 100) {
                        binding.value()
                    }
                })
            }
        }
    },
    methods: {
        // 改变页数
        sizeChange(pageVal) {
            this.pageInfo.loading = true;            
            this.pageInfo.currPage = 1;
            this.pageInfo.pageSize = pageVal;
            this.getImgArr();
        },
        // 点击页数
        changePage(page) {
            this.pageInfo.loading = true;            
            this.pageInfo.currPage = page;
            this.getImgArr();
        },
        // 获取图片列表
        getImgArr(){
            let type = this.type;
            console.log(type, 'type---');
            if(type == 1 || type ==2){
                // 上下刊报告列表
                this.searchFun();
            }else if(type == 3){
                // 获取换画名称列表
                this.getPainList().then(res =>{
                    // 换画报告列表
                    this.search();
                });
            }
        },
        // 获取城市区域
        getCitys(){
            let info = {
                apId: sessionStorage.getItem('order_apid'),
            };
            api.getApi(this.apiVar.replace+"/plan/region", info).then(res =>{
                console.log(res);
                if(res.data.SysCode == 200200){
                    let resArr = res.data.data;
                    let result = this.formatCitys(resArr);
                    this.searchInfo.citys = result;
                    this.publishSearchInfo.citys = result;
                }else{
                    sessFun.messageFun(res.data.MSG);
                }
            });
        },
        formatCitys(arr){
            arr = arr.map(item=>{
                return {
                    ...item,
                    label: item.cityName,
                    value: item.cityId,
                    children: item.districtDtoList.map(data =>{
                        return {
                            ...data,
                            label: data.districtName,
                            value: data.districtId
                        };
                    })
                };
            });
            arr.unshift({
                value: "全部",
                label: "全部"
            });
            return arr;
        },
        // 获取资源列表
        getResArr(cityId='', areaId=''){
            let info = {
                apId: sessionStorage.getItem('order_apid'),
                cityId: cityId,
                districtId: areaId
            };
            console.log(info);
            api.getApi(this.apiVar.replace+'/plan/resInfo', info).then(res =>{
                console.log(res);
                if(res.data.SysCode == 200200){
                    let result = res.data.data.map(item =>{
                        return {
                            ...item,
                            label: item.resName,
                            value: item.resID,
                        };
                    });
                    this.searchInfo.resArr = result;
                    this.publishSearchInfo.allResource = result;
                }else{
                    sessFun.messageFun(res.data.MSG);
                }
            });
        },
        // 修改媒体类型
        changeMedia(){
            this.pageInfo.currPage = 1;
            this.publishSearchInfo = {
                ...this.publishSearchInfo,
                citySelect: [],
                allhouse: '',
                allPic: '',
            };
            this.searchFun();
        },
        searchImgChange(){
            let { citySelect } = this.publishSearchInfo;
            if(citySelect[0] == "全部"){
                this.publishSearchInfo = {
                    ...this.publishSearchInfo,
                    allhouse: '',
                    allPic: '',
                };
            }else{
                let cityId = citySelect[0];
                let areaId = citySelect[1];
                this.getResArr(cityId, areaId);
            }
            this.searchImg();
        },
        // 上下刊搜索图片
        searchImg() {
            let { citySelect, allhouse, allPic } = this.publishSearchInfo;
            if(citySelect.length || allhouse || allPic){
                this.pageInfo.currPage = 1;
                this.searchFun();
            }else{
                sessFun.messageFun('warning', '请输入搜索条件');
            }
        },
        // 上下刊报告
        searchFun(){
            this.pageInfo.paginationShow = false;
            this.pageInfo.loading = true;            
            let info = {};
            if(this.type == 1){
                info = this.searchFormat('SK');
            }else if(this.type == 2){
                info = this.searchFormat('XK');
            }
            this.getImgInfo(info);
            this.$nextTick(function () {
                this.pageInfo.paginationShow = true;
            });
        },
        // 搜索数据格式化
        searchFormat(type){
            let { uID, token } = this.sessionData;
            let { currPage, pageSize } = this.pageInfo;
            let { mediaType, citySelect, allhouse, allPic } = this.publishSearchInfo;
            let info = {
                uid: uID,
                token: token,
                apId: sessionStorage.getItem('order_apid'),
                pType: type,
                pageNum: currPage,
                pageSize: pageSize,
                mVehicle: mediaType,
            };

            if(allPic){
                if(allPic == '2'){
                    info.hasUpload = "true";
                }
                if(allPic == '3'){
                    info.hasUpload = "false";
                }
            }
            if(citySelect.length){
                if(citySelect[0] == '全部'){
                    // this.searchFun();
                }else{
                    info.city = citySelect[0];
                    info.district = citySelect[1];
                }
            }
            if(allhouse){
                info.resid = allhouse;
            }
            console.log('type---', info);
            return info;
        },
        // 上下刊报告列表
        getImgInfo(params){
            api.postApi(this.apiVar.Advertisement+"/GetImg", params)
                .then(res => {
                    if (!res.data.SysCode) {
                        console.log(res.data);
                        let dataInfo = res.data;
                        let percent = dataInfo.totalCount? Number(((dataInfo.hasPhotoCount / dataInfo.totalCount)*100).toFixed(2)) : 0;
                        this.publishNumInfo = {
                            percent: percent,
                            currNum: dataInfo.hasPhotoCount,
                            totalNum: dataInfo.totalCount,
                        };

                        this.pageInfo = {
                            ...this.pageInfo,
                            ...({totalNum: dataInfo.searchCount}),
                        };
                        for(let data of dataInfo.dataList){
                            for(let item of data.photoList){
                                item.name = item.pID+'.png',
                                item.url = item.pURL;
                                item.pID = item.pID;
                                item.isCollection = false
                            }
                            let time = dateFormat.toDate(data.lStar, "/") + "-" +dateFormat.toDate(data.lEnd, "/");
                            data.timeRange = time;
                        }
                        this.imageArr = dataInfo.dataList;
                        this.checkImgStatus();
                        if(dataInfo.totalCount == 0){
                            sessFun.messageFun('warning', '暂无数据');
                        }
                    }else {
                        sessFun.messageFun('warning', res.data.MSG);
                    }
                    this.pageInfo.loading = false;
                })
                .catch(res => {
                    console.log(res);
                    this.pageInfo.loading = false;                    
                });
        },
        // 检查图片是否已收藏
        checkImgStatus(){
            let pIDList = this.returnPIDList();
            if(!pIDList.length){
                return;
            }
            let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                pids: pIDList.join(','),
            }
            console.log('params',params)
            api.getApi(this.apiVar.Advertisement + '/GetUserStatusByPid',params).then(res=>{
                console.log('检测图片收藏状态res',res);
                if (res.data.SysCode === 200200) {
                    this.setImgStatus(res.data.data);
                } else {
                    sessFun.messageFun('warning', res.data.MSG);
                }
            })
        },
        // 返回PIDList
        returnPIDList(){
            let reportList = this.imageArr;
            console.log('reportList',reportList);
            let pIDList = [];
            for(let key of reportList){
                let imgArr = key.photoList;
                for(let imgKey of imgArr){
                    if(imgKey.pID){
                        pIDList.push(imgKey.pID);
                    }
                }
            }
            return pIDList;
        },
        /**
         * 换画报告列表
         */
        // 获取全部换画列表(换画名称以及id)
        getPainList(){
            let promise = new Promise((resolve, reject) =>{
                let info = {
                    apId: sessionStorage.getItem('order_apid')
                };
                api.getApi(this.apiVar.replace+'/report/list', info).then(res =>{
                    console.log(res, 'SysCode---');
                    if(res.data.SysCode == 200200){
                        this.painList = res.data.data.map(item =>{
                            return{
                                ...item,
                                // id: item.replaceRecordId,
                                name: item.replaceRecordName,
                            };
                        });
                    }else{
                        sessFun.messageFun('warning', res.data.MSG);
                    }
                    resolve();
                });
            });
            return promise;
        },
        // 获取换画报告列表
        getData(params){
            api.postApi_json(this.apiVar.replace +"/report/detailInfo", params).then(res =>{
                console.log(res);
                if(res.data.SysCode == 200200){
                    let dataInfo = res.data.data;
                    let percent = dataInfo.totalSize? Number(((dataInfo.businessItem.adsWithReplacePics / dataInfo.totalSize)*100).toFixed(2)) : 0;
                    this.publishNumInfo = {
                        percent: percent,
                        currNum: dataInfo.businessItem.adsWithReplacePics,
                        totalNum: dataInfo.totalSize,
                    };

                    this.pageInfo = {
                        ...this.pageInfo,
                        ...({totalNum: dataInfo.totalSize}),
                    };
                    for(let data of dataInfo.dataList){
                        data.city = data.cityName;
                        data.rName = data.districtName;
                        data.lStar = data.beginDate;
                        data.lEnd = data.endDate;
                        if(data.adPlanPics){
                            for(let item of data.adPlanPics){
                                item.name = item.pID+'.png',
                                item.url = item.picUrl;
                                item.pID = item.pID;
                                item.isCollection = false;
                            }
                        }else{
                            data.adPlanPics = [];
                        }
                        data.photoList = data.adPlanPics;
                    }
                    this.imageArr = dataInfo.dataList;
                    this.checkImgStatus();
                    
                    if(dataInfo.totalSize == 0){
                        // sessFun.messageFun('warning', '暂无数据');
                    }
                }else{
                    sessFun.messageFun('warning', res.data.MSG);
                }
                this.pageInfo.loading = false;                
            });
        },
        // 城市区域变化
        painCityChange(){
            let { city } = this.searchInfo;
            if(city[0] == "全部"){
                this.searchInfo = {
                    ...this.searchInfo,
                    city: [],
                    resName: "",
                    status: "",
                };
            }else{
                let cityId = city[0];
                let areaId = city[1];
                this.getResArr(cityId, areaId);
            }
            this.search();
        },
        // 搜索
        search(){
            this.pageInfo.paginationShow = false; 
            this.pageInfo.loading = true;           
            let info = this.searchPointFormat();
            this.getData(info);
            this.$nextTick(function () {
                this.pageInfo.paginationShow = true;
            });
        },
        // 搜索换画列表条件
        searchPointFormat(){
            console.log(this.painList, this.activePainIndex, 'point--active--');
            let { mediaType, city, resName, status } = this.searchInfo;
            let { currPage, pageSize } = this.pageInfo;
            let info = {
                apId: sessionStorage.getItem('order_apid'),
                replaceRecordId: this.painList.length?this.painList[this.activePainIndex].id: '',
                pageNum: currPage,
                pageSize: pageSize,
                ...( mediaType && { mType: mediaType==1?0:1 }),
                ...( city.length && { districtId: city[1] }),
                ...( resName && { resIds: [resName] }),
                ...( status && { reportStatus: status==1?1:0 })
            };
            return info;
        },
        // 点击左边
        toLeft(){
            if(this.activePainIndex <= 0){
                this.activePainIndex = 0;
            }else{
                this.activePainIndex--;
            }
            this.changePain(this.activePainIndex);
        },
        // 点击右边
        toRight(){
            if(this.activePainIndex < this.painList.length - 1){
                this.activePainIndex++;
            }else{
                this.activePainIndex = this.painList.length -1;
            }
            this.changePain(this.activePainIndex);            
        },
        // 点击换画名称
        changePain(index){
            this.dateRange = {
                beginDate: this.painList[index].startDate,
                endDate: this.painList[index].endDate
            };
            this.pageInfo.currPage = 1;            
            this.searchInfo = {
                ...this.searchInfo,
                city: [],
                resName: "",
                status: "",
            };
            this.activePainIndex = index;
            // 去获取换画列表
            // 换画id
            let painId = this.painList[index].id;
            this.search();
        },
        // 编辑报告
        editReport(){
            this.isShowPic = true;
            this.dialogPage = {
                ...this.dialogPage,
                currInfoPage: 1,
            };
            this.dialogInfo = {
                ...this.dialogInfo,
                resName: [],
                picState: "",
                mapName: "",
            };
            this.shoplist = [];
            this.pointArr = [];
            // 获取资源名称列表
            this.getDialogInfoResArr();
            // 获取地图中心点
            this.getMapArr();
            // 获取表格数据
            this.searchInfoFun();
        },
        /**
         *  选择换画点位弹出框
         */
        // 物料弹出框滚动加载
        pointLoadMore(){
            if(this.dialogPage.loading_maInfo){
                this.dialogPage.loading_maInfo = false;
                if(this.dialogPage.currInfoPage <= this.dialogPage.totalInfoPage){
                    this.searchInfoFun();
                }
            }
        },
        // 搜索数据格式化
        searchDataFormat(){
            let { resName, picState, mapName } = this.dialogInfo;
            let { currInfoPage, pageSize } = this.dialogPage;
            let info = {
                pageNum: currInfoPage,
                pageSize: pageSize,
                apId: sessionStorage.getItem('order_apid'),
                replaceRecordId: this.painList[this.activePainIndex].id,
                ...( resName.length && { resIds: resName }),
                ...( mapName && { mapCenterInfo: mapName }),
                ...( picState>=0 && { replaceStatus: picState==2?'':picState })
            };
            return info;
        },
        searchInfoFun(){
            this.dialogPage.pointLoading = true;
            let info = this.searchDataFormat();
            this.getMaterInfo(info);
        },
        getMaterInfo(params){
            api.postApi_json(this.apiVar.replace+'/report/getAdspaces', params).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    console.log(res.data.data);
                    if(res.data.data.totalSize >= 0){
                        let dataInfo = res.data.data;
                        // 物料信息弹出框的选点信息
                        let dataArr = dataInfo.dataList;
                        this.pointArr = this.pointArr.concat(this.formatData(dataArr));
                        this.dialogPage = {
                            ...this.dialogPage,
                            loading_maInfo: true,
                            totalInfoPage: dataInfo.totalPage,
                        };
                        // 点位数量
                        this.pointInfo = {
                            pointNum: dataInfo.totalSize,
                            setedNum: dataInfo.businessItem?dataInfo.businessItem.adsWithReplacePics:'',
                        };
                        this.dialogPage.currInfoPage++;
                        this.selectioUpdate();
                    }
                }else{
                    sessFun.messageFun('warning', res.data.MSG);
                }
                this.dialogPage.pointLoading = false;
            }).catch(err =>{
                this.dialogPage.pointLoading = false;
            });
        },
        formatData(arr){
            let result = [];
            for(let data of arr){
                let obj = this.setTableData(data);
                result.push(obj);
            }
            return result;
        },
        // 表格数据格式
        setTableData(item){
            let timeRange = item.beginDate +'-'+ item.endDate;
            let obj = {
                ...item,
                id: item.replaceRecordDetailId,
                timeRange: timeRange,
            };
            return obj;
        },
        // 选择一条
        handleSelect(selection, row){
            console.log(selection, row, 'selection ---row ');
            // 选中
            if(this.isHaveFun(selection, row)){
               for(let data of selection){
                    if(!this.isHaveFun(this.shoplist, data)){
                        this.shoplist.push(data);
                    }
                } 
            }else{
                // 取消选中
                if(this.isHaveFun(this.shoplist, row)){
                    this.shoplist = this.shoplist.filter((item) =>{
                        if(item.lID == row.lID){
                            return false;
                        }
                        return true;
                    });
                }
            }
            console.log(this.shoplist, 'one--shoplist');
        },
        // 全选
        handleSelectAll(selection){
            console.log(selection, 'selection-----all');
            if(selection.length){
                for(let data of selection){
                    if(!this.isHaveFun(this.shoplist, data)){
                        this.shoplist.push(data);
                    }
                }
            }else{
                for(let data of this.pointArr){
                    if(this.isHaveFun(this.shoplist, data)){
                        this.shoplist = this.shoplist.filter((item) =>{
                            if(item.lID == data.lID){
                                return false;
                            }
                            return true;
                        });
                    }
                }
            }
            console.log(this.shoplist, 'all--shoplist');            
        },
        // 判断一个对象是否已经在数组中
        isHaveFun(arr, obj){
            let res = arr.filter((item)=>{
                if(item.lID == obj.lID){
                    return true;
                }
                return false;
            });
            if(res.length){
                return true;
            }
            return false;
        },
        // 是否勾选更新
		selectioUpdate(){
            console.log(this.shoplist, this.pointArr, 'arr---point--');
            let timer = setTimeout(() => {
                for(let item of this.shoplist){
                    for(let data of this.pointArr){
                        if(data.lID == item.lID){
                            console.log(item.lID);
                            data.remark = item.remark;
                            data.picUrl = item.picUrl;
                            data.replaceDate = item.replaceDate;
                            this.$refs.multipleTable.toggleRowSelection(data, true);
                        }
                    }
                }
				clearTimeout(timer);
			}, 0);
		},
        // 获取地图中心点
        getMapArr(){
            let info = {
                apId: this.orderDetail.apID
            };
            api.getApi(this.apiVar.replace+'/plan/mapCenterInfo', info).then(res =>{
                console.log(res);
                if(res.data.SysCode == 200200){
                    this.dialogInfo.mapArr = res.data.data && res.data.data.map(item =>{
                        return{
                            ...item,
                            label: item.mapCenterName,
                            value: item.mapCenterName
                        };
                    });
                    console.log(this.dialogInfo.mapArr);
                }else{
                    sessFun.messageFun('warning', res.data.MSG);
                }
            });
        },
        // 获取弹出框资源下拉列表
        getDialogInfoResArr(){
            let info = {
                apId: sessionStorage.getItem('order_apid'),
            };
            api.getApi(this.apiVar.replace+'/plan/resInfo', info).then(res =>{
                console.log(res);
                if(res.data.SysCode == 200200){
                    let result = res.data.data.map(item =>{
                        return {
                            ...item,
                            label: item.resName,
                            value: item.resID,
                        };
                    });
                    this.dialogInfo.resArr = result;
                }else{
                    sessFun.messageFun(res.data.MSG);
                }
            });
        },
        // 换画点位搜索
        searchPoint() {
            console.log(this.dialogInfo);
            this.pointArr = [];
            this.dialogPage = {
                ...this.dialogPage,
                loading_maInfo: false,
                currInfoPage: 1,
                totalInfoPage: 0,
                pointLoading: true,
            };
            this.searchInfoFun();
        },
        // 重置
        resetPoint() {
            let info = {
                resName: "",
                picState: "",
                mapName: ""
            };
            this.dialogInfo = {
                ...this.dialogInfo,
                ...info
            };
            this.dialogPage = {
                ...this.dialogPage,
                loading_maInfo: false,
                currInfoPage: 1,
                totalInfoPage: 0,
                pointLoading: true,
            };
            this.pointArr = [];
            this.searchInfoFun();
            console.log(this.dialogInfo, this.dialogPage);
        },
        // 查看图片
        previewImg(url) {
            this.dialogImageUrl = url;
            this.dialogVisible = true;
        },
        // 删除图片链接
        deleteOneImg(row){
            for(let data of this.pointArr){
                if(data.lID == row.lID){
                    data.picUrl = '';
                    break;
                }
            }
            for(let data of this.shoplist){
                if(data.lID == row.lID){
                    data.picUrl = '';
                    break;
                }
            }
            this.pointArr.push();
            console.log(this.pointArr);
        },
        // 换画上传图片等
        showUpload() {
            if(this.shoplist.length){
                this.isShowEdit = true;
                this.editInfo = {
                    date: "",
                    url: "",
                    remark: ""
                };
            }else{
                sessFun.messageFun('warning', '请先选择需要换画的点位!');
            }
        },
        // 取消
        cancelChange() {
            this.isShowEdit = false;
        },
        // 上传图片之前的格式大小判断
        beforeUpload(file){
            const isJPG = file.type === "image/jpeg" || file.type === "image/png";;
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                sessFun.messageFun('error', '只能上传jpg/png图片!');
            }
            if (!isLt2M) {
                sessFun.messageFun('error', '图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 上传成功
        onsucess(res, file){
            this.imgUrl = [];
            let resImg = {name: '图片1', url: res[0].pURL};
            this.imgUrl = [resImg];
            console.log(this.imgUrl);
        },
        // 保存上传图片
        confirmChange() {
            console.log(this.editInfo);
            let { date, url, remark } = this.editInfo;
            if(date){
                this.isShowEdit = false;
                if(this.imgUrl[0]){
                    this.editInfo.url = this.imgUrl[0].url;
                }
                console.log(this.editInfo, 'editinfo---');
                this.updateData();
            }else{
                sessFun.messageFun('warning', '请选择换画日期!');
            }
        },
        // 更新表格
        updateData(){
            let arr = this.shoplist;
            let { date, url, remark } = this.editInfo;
            let result = arr.map((item, index)=>{
                if(Date.parse(item.beginDate) < Date.parse(date) && Date.parse(item.endDate) > Date.parse(date)){
                    item.replaceDate = date;
                    item.picUrl = url;
                    item.remark = remark;
                }
                return item;
            });
            this.shoplist = result;
            this.selectioUpdate();
        },
        // 取消
        cancel() {
            this.isShowPic = false;
            this.shoplist = [];
            this.search();            
        },
        // 保存
        saveAll() {
            console.log(this.pointArr);
            if(this.shoplist.length){
                let result = [];
                for(let data of this.shoplist){
                    if(data.replaceDate){
                        let obj = {
                            ...data,
                            status: 1,
                            replaceRecordId: this.painList[this.activePainIndex].id                            
                        };
                        result.push(obj);
                    }
                }
                if(result.length){
                    api.postApi_json(this.apiVar.replace+ '/report/saveDetailInfo', result).then(res =>{
                        console.log(res.data);
                        if(res.data.SysCode == 200200){
                            this.isShowPic = false;                            
                            sessFun.messageFun('success', res.data.MSG);
                        }else{
                            sessFun.messageFun('warning', res.data.MSG);
                        }
                        this.search();
                    });
                }else{
                    sessFun.messageFun('warning', '没有需要保存的点');
                }
            }else{
                sessFun.messageFun('warning', '请先勾选选点');
            }
        },
        // 取消换画
        cancelPain(){
            if(this.shoplist.length){
                this.$confirm('确定取消所有换画吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.removePain();
                }).catch(() => {
                    sessFun.messageFun('info', '已取消操作');
                });
            }else{
                sessFun.messageFun('warning', '请先勾选选点');
            }
        },
        // 移除换画
        removePain(){
            let result = [];
            for(let data of this.shoplist){
                if(data.replaceDate){
                    let obj = {
                        ...data,
                        status: 0,
                        picUrl: '',
                        remark: '',
                        replaceDate: '',
                        replaceRecordId: this.painList[this.activePainIndex].id
                    };
                    result.push(obj);
                }
            }
            if(result.length){
                api.postApi_json(this.apiVar.replace+ '/report/saveDetailInfo', result).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        this.isShowPic = false;                        
                        sessFun.messageFun('success', res.data.MSG);
                        this.search();                            
                    }else{
                        sessFun.messageFun('warning', res.data.MSG);
                    }
                });
            }else{
                sessFun.messageFun('warning', '没有需要保存的点');
            }
        },
        // 给上下刊添加图片的收藏状态
        setImgStatus(data){
            console.log('给上下刊添加图片的收藏状态',data)
            let reportList = this.imageArr;
            for (let key of reportList) {
                let imgArr = key.photoList;
                for (let imgKey of imgArr) {
                    for (let pKey of data) {
                        if (pKey.pid == imgKey.pID) {
                            imgKey.isCollection = pKey.isCollection
                            break;
                        }
                    }
                }
            }
            console.log('reportList',reportList,this.pageUpReportArr)
        },
        // 字段截取
        wordlimit(word, num) {
            if(document.body.clientWidth<=1366){
                if (word && (word.length > num)) {
                    return word = word.substr(0, num) + '...';
                }
                return word;
            }else{
                return word;
            }
        },
        // 隐藏上传组件
        uploadDisabled(imgList){
            // console.log(imgList);
            return imgList.length>5;
        },
        // 根据type获取类型
        getTypeToText(){
            let type = '';
            if(this.type == 1){
                type = 'SK';
            }else if(this.type == 2){
                type ='XK';
            }else{
                type = 'HH';
            }
            return type;
        },
        // 上刊图片上传
        submitUpload(){
            let type = this.getTypeToText();
            if(!this.constractArr.length){
                return;
            }
            this.addload = this.$loading({
                lock: true,
                text: '保存数据中,请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            let imgArr = this.uploadImgArr;
            let arr = this.constractArr;
            let funs = [];
            // for(let i = 0; i<arr.length+3; i=i+3){
            //     let end = i+3>arr.length?arr.length:i+3;
            //     let result = arr.slice(i, end);
            //     if(result.length){
            //         let formData = new FormData();
            //         for(let data of imgArr.slice(i, end)){
            //             formData.append('picList', data);
            //         }
            //         formData.append('infos', JSON.stringify(result));    
            //         let pro = this.uploadFun(formData); 
            //         funs.push(pro);
            //     }
            // }
            for(let i = 0; i<arr.length; i++){
                let formData = new FormData();
                formData.append('picList', imgArr[i]);
                formData.append('infos', JSON.stringify([arr[i]]));    
                let pro = this.uploadFun(formData); 
                funs.push(pro);
            }
            Promise.all(funs).then((values)=>{
                console.log(values);
                this.constractArr = [];
                this.uploadImgArr = [];
                let type = this.type;                            
                if(type == 1 || type ==2){
                    // 上下刊报告列表
                    this.searchFun();
                }else if(type == 3){
                    // 换画报告列表
                    this.search();
                }
                this.addload.close();                                
            }).catch((err)=> {
                console.log(err);
            });
        },
        uploadFun(formData, end, arr){
            let promise = new Promise((resolve, reject)=>{
                api.postUpload_file(this.apiVar.replace+'/photo/multipartUpload', formData).then(res =>{
                    console.log(res);
                    if(res.data.SysCode == 200200){
                        resolve(true);
                    }else{
                        sessFun.messageFun('warning', res.data.MSG);
                        reject(false);
                    }
                });  
            });
            return promise;
        },
        // 收藏
        saveImgFun(item,index){
            console.log('保存图片', item,index)
            let type = this.getTypeToText();
            let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                lId: item.lID,
                pId: item.photoList[index].pID,
                picUrl: item.photoList[index].pURL,
                type: type=='SK' ? 0 : type=="XK" ? 1 : 2,
            }
            if (!params.lId) {
                sessFun.messageFun('warning', '图片信息异常无法保存！')
                return
            }
            if (params.type === "") {
                delete params.type
            }
            console.log('params', params)
            api.postApi(this.apiVar.Advertisement + '/imageCollection/add', params).then(res => {
                console.log('图片收藏res', res);
                if (res.data.SysCode === 200200) {
                    item.photoList[index].isCollection = true;
                    sessFun.messageFun('success', '收藏成功')
                } else {
                    sessFun.messageFun('warning', res.data.MSG)
                }
            })
        },
        // 取消收藏
        cancelImgFun(item,index){
            console.log('取消收藏',item,index)
            let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                pId: item.photoList[index].pID,
            }
            api.postApi(this.apiVar.Advertisement + '/imageCollection/remove', params).then(res => {
                console.log('取消收藏res', res);
                if (res.data.SysCode === 200200) {
                    item.photoList[index].isCollection = false;
                    sessFun.messageFun('success', '取消成功')
                } else {
                    sessFun.messageFun('warning', res.data.MSG)
                }
            })
        },
        // 删除已上传的图片
        deleteImg(item){
            console.log('删除item',item)
            if(item.pID){
                this.$confirm('确定移除这张图片吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleRemove(item);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        // 上传图片
        uploadImg(params){
            console.log('parmas---', params);
            var fileObj = params.file;
            this.uploadImgArr.push(fileObj);
            this.constractArr.push(this.upLoadObj);
            console.log(this.constractArr, this.uploadImgArr, 'params----arr');
        },
        // 点击上传图片按钮之时进行储存所需数据(asid, ptp等)
        saveId(row) {
            console.log("row------", row, this.orderDetail);
            let type = this.getTypeToText();
            let palt = this.orderDetail.apName+'-'+row.resName+"-"+row.mTitle+row.asLab;
            let ptp = sessionStorage.getItem("order_apid");
            let account = this.sessionData.username;
            let username = this.sessionData.realName;
            let prk = {
                plan: this.orderDetail.apName ? this.orderDetail.apName : "",
                res: row.resName ? row.resName : "",
                media: row.mTitle ? row.mTitle : "",
                city: row.city ? row.city : "",
                area: row.rName ? row.rName : "",
                asLab: row.asLab ? row.asLab : "",
                lstart: row.lStar ? row.lStar : "",
                lend: row.lEnd ? row.lEnd : "",
                assettag: row.assetTag ? row.assetTag : "",
                brand: this.orderDetail.bTitle ? this.orderDetail.bTitle : "",
                account: account ? account : "",
                username: username ? username : "",
                resid: row.resID ? row.resID : "",
                address: row.resAddress ? row.resAddress : "",
                lid: row.lID ? row.lID : ""
            };
            let obj = {
                pAlt: palt,
                ptID: row.mVehicle=='广告门' ? row.asID: row.mID,
                ptP: ptp,
                pRemarks: JSON.stringify(prk),
                lStart: row.lStar,
                lEnd: row.lEnd,
                resId: row.resID,
                // lId: row.lID ? row.lID : "",
                lId: row.mVehicle=='广告门'?row.lID:(row.lID?row.lID.toString().split(',')[0]:''),
                type: row.mVehicle=='广告门' ?0:1,
                pType: type,
                replaceRecordId: row.replaceRecordId ? row.replaceRecordId :'',
                replaceRecordDetailId: row.replaceRecordDetailId ? row.replaceRecordDetailId :'',
            };
            this.upLoadObj = obj;
        },
        beforeImgRemove(file, fileList){
            if(file.pID){
                return this.$confirm(`确定移除这张图片吗？`);
            }
        },
        // 限制只能上传png,jpeg格式的照片
        beforeAvatarUpload(file) {
            const isIMAGE = file.type === "image/jpeg" || file.type === "image/png";
            const isLt1M = file.size / 1024 / 1024 < 10;

            if (!isIMAGE) {
                sessFun.messageFun('error', "只能上传jpg/png图片!");
            }
            if (!isLt1M) {
                sessFun.messageFun('error', "上传文件大小不能超过 10MB!");
            }
            return isIMAGE&&isLt1M;
        },
        // 超过图片上传个数
        handleExceed(files, fileList) {
            console.log(files, fileList);
            sessFun.messageFun('warning', `当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        // 查看预览图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        //删除照片
        handleRemove(file, fileList) {
            console.log('fdasl--ff', file, fileList);
            if(file.pID){
                let info = {
                    photoId: file.pID,
                    pType: file.pType,
                    replaceRecordId: file.pType == 'HH'?this.painList[this.activePainIndex].id:''
                };
                api.postApi(this.apiVar.replace+'/photo/delete', info).then(res =>{
                    console.log(res.data);
                    // 实时更新进度条
                    if (res.data.SysCode == 200200) {
                        sessFun.messageFun('success', res.data.MSG);
                        let type = this.type;                            
                        if(type == 1 || type ==2){
                            // 上下刊报告列表
                            this.searchFun();
                        }else if(type == 3){
                            // 换画报告列表
                            this.search();
                        }
                    }else {
                        sessFun.messageFun('warning', res.data.MSG);
                    }
                });
            }else{
                let upLoad = this.uploadImgArr;
                for(let i = 0, iLen = upLoad.length; i<iLen; i++ ){
                    if(file.uid == upLoad[i].uid){
                        upLoad.splice(i, 1);
                        this.constractArr.splice(i, 1);
                        break;
                    }
                }
            }
        },
        /**
         * 导出图片包、查看H5.更新报告
         * downtype: 1为导出图片包, 2为导出pdf/ppt/pptx
         */
        // 导出图片包
        downloadImg(){
            if(!this.publishNumInfo.currNum){
                sessFun.messageFun('warning', '暂无图片记录');
                return;
            }
            let type = this.type;
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apId: this.orderDetail.apID,
                type: '',
                apName: this.orderDetail.apName,
                downtype: 1,
            };
            if(type == 1){
                info.type = 0;
            }else if(type == 2){
                info.type = 1;
            }else{
                info.type = 2;                
                info.replaceRecordId = this.painList[this.activePainIndex].id;
            }
            this.downLoading = true;
            const tempPage = window.open('', '_blank');
            api.getApi(this.apiVar.Advertisement+'/DownloadImgPackage', info).then(res =>{
                if(res.data.SysCode == 200200){
                    let routeUrl = this.$router.resolve({
                        path: "/progressDown",
                        query: info,
                    });
                    tempPage.location = routeUrl.href;
                }else{
                    sessFun.messageFun('warning', res.data.MSG);
                }
                this.downLoading = false;
            }).catch(err =>{
                this.downLoading = false;
            });
        },
        // 更新报告
        updateReport(){
            let type = this.getTypeToText();            
            let info = {
                apId: this.orderDetail.apID,
                type: type,
            };
            if(type == 'HH'){
                info.replaceRecordId = this.painList[this.activePainIndex].id;
            }
            this.updateLoading = true;
            api.postApi(this.apiVar.Advertisement+"/UpdateSXReport", info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    sessFun.messageFun('success', res.data.MSG);
                }else{
                    sessFun.messageFun('warning', res.data.MSG);
                }
                this.updateLoading = false;
            }).catch(err =>{
                console.log(err);
                this.updateLoading = false;
            });
        },
        // 查看h5上下刊刊报告按钮
        showH5(){
            let type = this.getTypeToText();
            let id = sessionStorage.getItem('order_apid');

            let tempwindow = window.open();
            if(type == "HH"){
                id =  this.painList[this.activePainIndex].id;
            }
            api.getApi(this.apiVar.UCAPI+'/EncryptNo', {num: id}).then(res =>{
                console.log(res.data);
                tempwindow.location = "/Report?"+type+"="+res.data.EncryptCode;
            }).catch(res =>{
                console.log(res);
            });
        },
    },
};
</script>

<style scoped>
/* 上下刊 */
.radio_style {
    vertical-align: top;
    margin-bottom: 10px;
}
.up-loader-header {
    position: relative;
}

.progress {
    float: right;
}

/deep/ .up-loader-header .el-input__inner {
    height: 32px;
    width: 180px;
}
.progress span {
    position: relative;
    top: 8px;
    left: 0;
    font-size: 14px;
    color: #666666;
}
/deep/ .el-progress-bar__outer {
    height: 16px !important;
}

/deep/ .el-progress-bar {
    width: 100%;
}

/deep/ .el-progress {
    position: absolute;
    line-height: 1;
    width: 43%;
    right: 65px;
    top: 10px;
}

/* 图片列表 */
.list_pic {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}
.pic_left{
    display: flex;
    justify-content: flex-start;
    max-width: 75%;
}
.pic_content{
    display: flex;
    justify-content: flex-start;
    overflow-x: scroll;
    height: 50px;
}
.pain_span {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    text-align: center;
    min-width: 74px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.25);
    margin-right: 8px;
    cursor: pointer;
}
/*!*滚动条*!*/
.pic_content::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;
}

.pic_content::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 0px;
    -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
}

.pic_content::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
    border-radius: 0;
    background: #fafafa;
}
.compare {
    margin-right: 8px;
    width: 32px;
    min-width: 32px;
    display: inline-block;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
}
/* 选中 */
.active {
    border: 1px solid rgba(24, 144, 255, 1);
    color: rgba(24, 144, 255, 1);
}
/* 进度条 */
.process {
    max-width: 25%;
}
.process_box {
    min-width: 150px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-left: 16px;
    padding: 0 10px;
    font-size: 12px;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
}
/deep/.process_box .el-progress {
    display: inline-block;
    width: 80px;
    position: relative;
    right: 0;
    top: 0;
}
/deep/.process_box .el-progress-bar {
    width: 80px;
}
/deep/.search_pic .el-row span {
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
}
/deep/.search_pic .el-col-24 {
    width: auto;
}
/deep/.search_pic .el-col-24 {
    min-width: 25%;
}
/deep/.search_pic .el-row .el-select,
/deep/.search_pic .el-row .el-cascader {
    width: calc(98% - 60px);
}
/* 报告列表 */
/* .imgs_box{

} */
.imgs_point {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    margin: 16px -10px;
}
.point_item {
    width: 370px;
    height: 298px;
    margin: 0 10px 16px;
    border: 1px solid rgba(233, 233, 233, 1);
    overflow: hidden;
}
/* 详情头部 */
.detail_top {
    height: 56px;
    padding: 9px 16px 0;
    background: rgba(247, 247, 247, 1);
    border-bottom: 1px solid rgba(233, 233, 233, 1);
    font-size: 14px;
    color: #666666;
    background: rgba(247, 247, 247, 1);
}
.detail_top p {
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
.detail_con span {
    /* margin: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; */

    position: absolute;
    top: 30px;
    left: 30px;
    font-size: 14px;
    color: #666666;
}
/deep/.img_box .el-upload--picture-card {
    width: 30%;
    height: 105px;
    line-height: 105px;
    margin: 2% 1.6% 0 1.6%;
    background: rgba(251, 251, 251, 1);
    border-radius: 4px;
    border: 1px dashed #dedede;
    text-align: center;
}

/deep/.img_box .el-upload-list--picture-card .el-upload-list__item, 
/deep/.upload_plus .el-upload-list--picture-card .el-upload-list__item{
    width: 30%;
    height: 105px;
    margin: 2% 1.6% 0 1.6%;
}
.img_box {
    /* width: 105px; */
    height: 105px;

    width: 30%;
    margin: 2% 1.6% 0 1.6%;
    
    /* margin-bottom: 16px; */
    float: left;
    position: relative;
    overflow: hidden;
}

.upload_img_item {
    width: 100%;
    height: 100%;
}
.icon_success {
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
    -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
}
.icon_success i {
    color: #fff;
    font-size: 12px;
    margin-top: 11px;
    transform: rotate(-45deg);
}
.icon_box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    cursor: pointer;
}
.img_box_icon {
    width: 100%;
    margin-top: 40%;
    text-align: center;
}
.img_box_icon i {
    color: #fff;
    font-size: 22px;
}
.img_box_icon i.icon_save {
    color: #ffd517;
}
/deep/ .disabled .el-upload--picture-card {
    display: none;
}
/deep/.detail_con .el-upload--picture-card {
    /* width: 105px; */
    height: 105px;
    line-height: 105px;

    width: 30%;
    margin: 2% 1.6% 0 1.6%;
    /* margin: 0;
    margin-bottom: 16px; */

    background: rgba(251, 251, 251, 1);
    border-radius: 4px;
    border: 1px dashed #dedede;
    text-align: center;
    
}

/* 分页 */
.pager {
    height: 32px;
    text-align: right;
}
.up-report-bottom {
    text-align: center;
    margin: 20px;
}

/* 弹出框 */
.dialog_pic .el-input {
    width: auto;
}
.car-title {
    background: #e6f7ff;
    border: 1px solid #bae7ff;
    border-radius: 4px;
    margin: 16px 0;
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
.flex_box {
    display: flex;
    justify-content: flex-start;
    /* align-items: center; */
    margin-bottom: 16px;
}
.flex_box > span {
    width: 82px;
    text-align: right;
}
.flex_box .el-textarea {
    width: 280px;
}
.flex_box .el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 280px;
}
.upload_border {
    width: 104px;
    height: 104px;
    background: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    /* border: 1px solid rgba(0, 0, 0, 0.15); */
    display: flex;
    line-height: 1;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
}
.upload_border .el-icon-plus {
    font-size: 24px;
    color: rgba(0, 0, 0, 0.45);
}
.imgpain_box{
    height: 104px;
    overflow: hidden;
}
/deep/.imgpain_box .el-upload--picture-card{
    border: 1px dashed #dedede;
    width: 104px;
    height: 104px;
    margin: 0;
}
/deep/.imgpain_box .el-upload-list--picture-card .el-upload-list__item{
    width: 104px;
    height: 104px;
}
/deep/.imgpain_box .el-upload-list__item.is-success{
    display: block;
}
/* 图片查看显示 */
.imgPreview /deep/ .el-dialog {
    width: 35%;
}
.imgPreview /deep/ .el-dialog__body {
    text-align: center;
}
/deep/ .imgPreview .el-dialog__body img {
    max-width: 100%;
    width: auto;
    height: 550px;
}
/* 图片列表间距 */
@media all and (min-width: 1440px) {
    .imgs_point {
        margin: 16px -28px;
    }
    .point_item {
        margin: 0 28px 16px;
    }
}
@media all and (min-width: 1920px) {
    .imgs_point {
        margin: 16px -36px;
    }
    .point_item {
        margin: 0 36px 16px;
    }
}
</style>
<style>
.el-tooltip__popper.is-dark{
    max-width: 250px;
    word-break: break-all;
    word-wrap: break-word
}
</style>

