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
                <div class="point_item" v-for="(item, index) of imageArr" :key="index">
                    <div class="detail_top">
                        <p>{{ item.city+item.rName }}-{{ item.resName }}-{{ item.mTitle }}-{{ item.asLab }}</p>
                        <p class="car_header">
                            <span>
                                <i class="el-icon-date date_fa" type="text"></i>{{ item.assetTag }}</span>
                            <span>
                                <i class="el-icon-date date_fa" type="text"></i>换画日期:{{ item.changePicTime }}</span>
                        </p>
                    </div>
                    <div class="detail_con">
                        <div class="img_box" v-for="(img, imgIndex) of item.photoList" :key="imgIndex">
                            <img class="upload_img_item" :src="img.url">
                            <label class="icon_success">
                                <i class="el-icon-check"></i>
                            </label>
                            <div class="icon_box">
                                <p class="img_box_icon">
                                    <i class="el-icon-search"></i>
                                    <i class="el-icon-star-off"></i>
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
                        <el-upload class="upload_plus" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="true" list-type="picture-card" multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
                <div class="point_item">
                    <div class="detail_top">
                        <p>广州市天河区-东方雅苑-西门-B</p>
                        <p class="car_header">
                            <span>
                                <i class="el-icon-date date_fa" type="text"></i>005B201811GZ-X795</span>
                            <span>
                                <i class="el-icon-date date_fa" type="text"></i>换画日期:2018/03/08</span>
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
                        <el-upload class="upload_plus" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="true" list-type="picture-card" multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
                <div class="point_item">
                    <div class="detail_top">
                        <p>广州市天河区-东方雅苑-西门-B</p>
                        <p class="car_header">
                            <span>
                                <i class="el-icon-date date_fa" type="text"></i>005B201811GZ-X795</span>
                            <span>
                                <i class="el-icon-date date_fa" type="text"></i>换画日期:2018/03/08</span>
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
                                    <i class="el-icon-star-off"></i>
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
                                    <i class="el-icon-star-off"></i>
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
                                    <i class="el-icon-star-off"></i>
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
                        <el-upload class="upload_plus" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="true" list-type="picture-card" multiple>
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
                <div class="point_item">
                    <div class="detail_top">
                        <p>广州市天河区-东方雅苑-西门-B</p>
                        <p class="car_header">
                            <span>
                                <i class="el-icon-date date_fa" type="text"></i>005B201811GZ-X795</span>
                            <span>
                                <i class="el-icon-date date_fa" type="text"></i>换画日期:2018/03/08</span>
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
                                    <i class="el-icon-star-off"></i>
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
                        <el-upload class="upload_plus" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="true" list-type="picture-card" multiple>
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

        <!-- 换画弹出框 -->
        <el-dialog title="选择换画点位" :visible.sync="isShowPic">
            <el-row class="dialog_pic">
                <span>资源名称:</span>
                <el-select v-model="dialogInfo.resName" multiple filterable remote reserve-keyword placeholder="请输入资源名称" :remote-method="remoteMethod" :loading="dialogInfo.loading" size="small">
                    <el-option v-for="item in dialogInfo.resArr" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <span>换画状态:</span>
                <el-select v-model="dialogInfo.picState" placeholder="请选择换画状态" size="small">
                    <el-option v-for="(item, index) of dialogInfo.stateArr" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span>地图中心点:</span>
                <el-select v-model="dialogInfo.mapName" placeholder="请选择地图中心点" size="small">
                    <el-option v-for="(item, index) of dialogInfo.mapArr" :key="index" :label="item.name" :value="item.name"></el-option>
                </el-select>
                <el-button plain @click="searchPoint()">搜索</el-button>
                <el-button plain @click="resetPoint()">重置</el-button>
                <el-button type="primary" @click="showUpload()">换画</el-button>
                <el-button plain>取消换画</el-button>
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
                <el-table-column prop="timeRange" label="排期" min-width="120">
                </el-table-column>
                <el-table-column prop="changePicTime" label="换画日期">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="imgUrl" label="操作" width="80">
                    <template slot-scope="scope">
                        <i class="el-icon-picture" :style="{color:scope.row.imgUrl?'#108DE7':'', margin: '0 10px'}" @click="previewImg(scope.row)" :disabled="!scope.row.imgUrl"></i>
                        <i class="el-icon-delete" :style="{'color':scope.row.imgUrl?'#108DE7':''}" @click="deleteOneImg(scope.row, scope.$index)" :disabled="!scope.row.imgUrl"></i>
                    </template>
                </el-table-column>

                <div slot="empty">
                    <no-search-result></no-search-result>
                </div>
            </el-table>
            <p style="text-align:center;margin-top:20px;">
                <el-button plain size="small">取消</el-button>
                <el-button type="primary" size="small" @click="saveAll()">保存</el-button>
            </p>
        </el-dialog>

        <!-- 编辑换画弹出框 -->
        <el-dialog :visible.sync="isShowEdit" title="编辑换画信息" width="405px">
            <el-row>
                <el-col class="flex_box">
                    <span>
                        <b style="color:#FF0000;">*</b> 换画日期：</span>
                    <el-date-picker size="small" v-model="editInfo.date" value-format="yyyy/MM/dd" format="yyyy/MM/dd" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-col>
                <el-col class="flex_box">
                    <span>换画素材：</span>
                    <el-upload :action="doUpload" :show-file-list='false' class="upload_box">
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
import noSearchResult from "./noSearchResult.vue";
import { api } from "../../../api/api.js";
import timeFormat from '../../../commonFun/timeFormat.js';
import sessFun from '../../../commonFun/sessFun.js';

export default {
    components: {
        noSearchResult
    },
    data() {
        return {
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
                pageSize: 6
            },
            // 图片列表
            // imageArr: [],
            imageArr:[
                {
                    resId: 1,
                    resName: '东方雅苑',
                    mTitle: '西门',
                    asLab: 'B',
                    assetTag: '005B201811GZ-X795',
                    city: '广州市',
                    rName: '天河区',
                    changePicTime: '2019/09/09',
                    photoList: [],
                },
                {
                    resId: 2,
                    resName: '东方雅苑',
                    mTitle: '西门',
                    asLab: 'B',
                    assetTag: '005B201811GZ-X795',
                    city: '广州市',
                    rName: '天河区',
                    changePicTime: '2019/09/09',
                    photoList: [],
                },
            ],
            // 是否展示换画弹框
            isShowPic: false,
            // 弹出框搜索
            dialogInfo: {
                resName: "",
                picState: "",
                mapName: "",
                // 资源名称列表
                loading: false,
                resArr: [],
                // 状态列表
                stateArr: [
                    {
                        label: "全部点位",
                        value: 1
                    },
                    {
                        label: "已指定换画点位",
                        value: 2
                    },
                    {
                        label: "未指定换画点位",
                        value: 3
                    }
                ],
                // 地图中心点列表
                mapArr: [],
            },
            // 弹出框分页信息
            dialogPage:{
                loading_maInfo: false,
                currInfoPage: 1,
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
            pointArr: [
                {
                    resId: 1,
                    resName: "中信西关海二期",
                    mTitle: "保安亭西...",
                    asLab: "B",
                    city: "广州市",
                    rName: "越秀区",
                    map: "",
                    lStar: '2019/09/09',
                    lEnd: '2019/09/10',
                    asID: 1,
                    timeRange: "2019/09/09-2019/09/10",
                    changePicTime: "2019/09/09",
                    remark: "画面不要有折痕...",
                    imgUrl: ""
                },
                {
                    resId: 2,
                    resName: "中信西关海二期",
                    mTitle: "保安亭西...",
                    asLab: "B",
                    city: "广州市",
                    rName: "越秀区",
                    map: "",
                    lStar: '2019/09/09',
                    lEnd: '2019/09/10',
                    asID: 2,
                    timeRange: "2019/09/09-2019/09/10",
                    changePicTime: "2019/09/09",
                    remark: "画面不要有折痕...",
                    imgUrl: ""
                },
                {
                    resId: 3,
                    resName: "中信西关海二期",
                    mTitle: "保安亭西...",
                    asLab: "B",
                    city: "广州市",
                    rName: "越秀区",
                    map: "",
                    lStar: '2019/09/09',
                    lEnd: '2019/09/10',
                    asID: 3,
                    timeRange: "2019/09/09-2019/09/10",
                    changePicTime: "2019/09/09",
                    remark: "画面不要有折痕...",
                    imgUrl: ""
                },
                {
                    resId: 4,
                    resName: "中信西关海二期",
                    mTitle: "保安亭西...",
                    asLab: "B",
                    city: "广州市",
                    rName: "越秀区",
                    map: "",
                    lStar: '2019/09/09',
                    lEnd: '2019/09/10',
                    asID: 4,
                    timeRange: "2019/09/09-2019/09/10",
                    changePicTime: "2019/09/09",
                    remark: "画面不要有折痕...",
                    imgUrl: ""
                }
            ],
            // 勾选的列表
            shoplist: [],
            // 图片放大弹出框
            dialogVisible: false,
            dialogImageUrl: "",
            // 上传图片以及换画日期弹出框
            isShowEdit: false,
            doUpload: "",
            editInfo: {
                date: "",
                url: "",
                remark: ""
            }
        };
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
        /**
         * 换画报告列表
         */
        // 获取城市区域
        getCitys(){
            // this.searchInfo.citys
        },
        // 获取资源列表
        getResArr(){
            // this.searchInfo.resArr
        },
        // 搜索
        search(){
            console.log(this.searchInfo);

        },
        /**
         *  选择换画点位弹出框
         */
        // 物料弹出框滚动加载
        pointLoadMore(){
            if(this.loading_maInfo){
                this.loading_maInfo = false;
                if(this.currInfoPage <= this.totalInfoPage){
                    this.searchInfoFun();
                }
            }
        },
        // 搜索数据格式化
        searchDataFormat(){
            let { resName, picState, mapName } = this.dialogInfo;
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                pageNo: this.currInfoPage,
                pageSize: this.maInfoSize,
                apID: sessionStorage.getItem('order_apid')
            };
            if(resName){
                info.resName = resName;
            }
            if(mapName){
                info.mapCenterName = mapName;
            }
            if(picState){
                info.picState = picState;
            }
            return info;
        },
        searchInfoFun(){
            let info = this.searchDataFormat();
            this.getMaterInfo(info);
        },
        getMaterInfo(params){
            api.postApi(this.apiVar.Advertisement+'/GetAdMaterial', params).then(res =>{
                console.log(res.data);
                if(res.data.total >= 0){
                    let dataInfo = res.data;
                    // 物料信息弹出框的选点信息
                    let dataArr = dataInfo.list;
                    this.pointArr = this.pointArr.concat(this.formatData(dataArr));
                    this.dialogPage = {
                        loading_maInfo: true,
                        currInfoPage: this.dialogPage.currInfoPage++,
                        totalInfoPage: dataInfo.totalPage,
                    };
                    this.SelectioUpdate();
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
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
            let timeRange = timeFormat.toDate(item.lStar, '/') +'-'+ timeFormat.toDate(item.lEnd, '/');
            let timeRange1 = timeFormat.toDate(item.lStar, '/') +'-'+ timeFormat.toDate(item.lSetTime, '/');
            let obj = {
                resName: item.resName,
                mTitle: item.mTitle,
                asLab: item.asLab,
                city: item.city,
                rName: item.rName,
                map: item.mapCenterName,
                timeRange: item.lState==2? timeRange1 : timeRange,
                remark: item.remark?item.remark:'',
                imgUrl: item.picUrl?item.picUrl:'',
                uploadUser: item.uploadUser?item.uploadUser:'',
                resID: item.resID,
                lID: item.lID,
                lStar: item.lStar,
                lEnd: item.lEnd,
                asID: item.asID,
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
                        if(item.asID == row.asID && item.lStar == row.lStar && item.lEnd == row.lEnd){
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
                            if(item.asID == data.asID && item.lStar == data.lStar && item.lEnd == data.lEnd){
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
                if(item.asID == obj.asID && item.lStar == obj.lStar && item.lEnd == obj.lEnd){
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
		SelectioUpdate(){
            for(let item of this.shoplist){
                for(let data of this.pointArr){
                    if(item.asID == data.asID && item.lStar == data.lStar && item.lEnd == data.lEnd){
                        data.remark = item.remark;
                        data.imgUrl = item.imgUrl;
                        this.$refs.multipleTable.toggleRowSelection(data, true);
                    }
                }
            }
		},
        // 获取地图中心点
        getMapArr(){
            // this.dialogInfo.map = '';
        },
        // 资源列表远程搜索
        remoteMethod(query){
            if(query){
                this.dialogInfo.loading = true;
                // this.getResArr(query);
                // this.dialogInfo.resArr = ''
            }else{
                this.dialogInfo.resArr = [];
            }
        },
        // 换画点位搜索
        searchPoint() {
            console.log(this.dialogInfo);
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
                loading_maInfo: false,
                currInfoPage: 1,
                totalInfoPage: 0,
                pointLoading: true,
            };
            this.pointArr = [];
            this.searchInfoFun();
            console.log(this.dialogInfo);
        },
        // 改变页数
        sizeChange(pageVal) {
            this.pageInfo.currPage = 1;
        },
        // 点击页数
        changePage(page) {
            this.pageInfo.currPage = page;
        },
        // 查看图片
        previewImg(row) {
            this.dialogImageUrl = row.imgUrl;
            this.dialogVisible = true;
        },
        // 换画上传图片等
        showUpload() {
            this.isShowEdit = true;
        },
        // 取消
        cancelChange() {
            this.isShowEdit = false;
        },
        confirmChange() {
            this.isShowEdit = false;
            console.log(this.editInfo);
        },
        // 取消
        cancel() {
            this.isShowPic = false;
        },
        // 保存
        saveAll() {
            this.isShowPic = false;
            console.log(this.pointArr);
        }
    },
    mounted(){
        this.sessionData = sessFun.getSess();
        this.searchInfoFun();
    },
};
</script>

<style scoped>
.list_pic {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
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
}
.compare {
    width: 32px;
    display: inline-block;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    color: rgba(0, 0, 0, 0.25);
}
/* 选中 */
.active {
    border: 1px solid rgba(24, 144, 255, 1);
    color: rgba(24, 144, 255, 1);
}
/* 进度条 */
.process {
    min-width: 280px;
}
.process_box {
    min-width: 150px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    display: inline-block;
    margin-left: 16px;
    padding: 0 10px;
    font-size: 12px;
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
    height: 326px;
    margin: 0 10px 16px;
    border: 1px solid rgba(233, 233, 233, 1);
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
.detail_con {
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
.pager {
    height: 32px;
    text-align: right;
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
    align-items: center;
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
    border: 1px solid rgba(0, 0, 0, 0.15);
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
