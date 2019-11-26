<template>
    <div class="third-wrap box-wrap">
        <div class="table_wrap">
            <p class="search-row">
                <el-button type="primary" size="small" @click="uploadMater()" v-show="isOrder"
                           v-qadn-mta-h5="{id: 'a006_b011_c008_d000_bt123_ck04'}">添加上画信息
                </el-button>
            </p>
            <el-radio-group v-model="mediaType" size="medium">
                <el-radio-button label="广告门"></el-radio-button>
                <el-radio-button label="道闸"></el-radio-button>
            </el-radio-group>
            <!-- 广告门 -->
            <el-table :data="material" border style="margin-top:16px;" v-if="mediaType=='广告门'" v-loading="loading"
                      element-loading-text="玩命加载中.." class="table-wrap">
                <el-table-column label="序号" min-width="5.9%">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="adSize" label="广告尺寸" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="adViewSize" label="可视画面" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="resolution" label="分辨率" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="colorMode" label="颜色模式" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="photoFormat" label="文件格式" min-width="17.6%">
                </el-table-column>
                <el-table-column prop="pointNum" label="点位面数" min-width="12.7%" align="right">
                </el-table-column>
            </el-table>

            <el-table :data="daomater" border style="margin-top:16px;" v-loading="loading"
                      element-loading-text="玩命加载中.." v-else>
                <el-table-column label="序号" min-width="5.9%">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="adSize" label="画面尺寸" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="adViewSize" label="灯箱尺寸" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="resolution" label="分辨率" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="colorMode" label="颜色模式" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="photoFormat" label="文件格式" min-width="17.6%">
                </el-table-column>
                <el-table-column prop="pointNum" label="点位面数" min-width="12.7%" align="right">
                </el-table-column>
            </el-table>
        </div>

        <!-- 上传上画素材、备注弹框 -->
        <el-dialog
            title="画面备注信息"
            :visible.sync="showPhotoRemark">
            <div style="display: flex;justify-content: space-between;align-items: center">
                <div class="inline_dialog">
                    <p><span>资源名称：</span>
                        <el-input v-model="resNameSec" placeholder="请输入资源名称" size="small"></el-input>
                    </p>
                    <p><span>地图中心点：</span>
                        <el-select v-model="mapName" placeholder="请选择地图中心点" size="small">
                            <el-option v-for="(item, index) of mapArr" :key="index" :label="item.name"
                                       :value="item.name"></el-option>
                        </el-select>
                    </p>
                    <el-button size="small" plain @click="searchInfo()" :disabled="!isSearch"
                               v-qadn-mta-h5="{id: 'a006_b011_c008_d005_bt124_ck01'}">搜索
                    </el-button>
                    <el-button plain size="small" @click="resetInfo()" :disabled="!isReset"
                               v-qadn-mta-h5="{id: 'a006_b011_c008_d005_bt125_ck02'}">重置
                    </el-button>
                </div>
                <div>
                    <el-dropdown class="dropdown_a">
                        <el-button type="primary">
                            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown" class="dropdown-menu">
                            <el-dropdown-item v-qadn-mta-h5="{id: 'a006_b011_c008_d005_bt126_ck04'}"
                                              @click.native="openAllPic()">
                                添加画像
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="openAllRemark()"
                                              v-qadn-mta-h5="{id: 'a006_b011_c008_d005_bt127_ck04'}">
                                添加备注
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="deleteMaterInfo('all')">
                                删除物料信息
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
            <div class="car-title">
                <i class="el-icon-info" style="color: #1890FF;margin-right: 5px"></i>
                <h4>
                    已保存物料信息的点位数量有<span>{{hasMaterialCount}}</span> 个 当前选择的点位<span>{{selectList.length}}</span>个
                </h4>
            </div>
            <el-table :data="materInfoArr" border height="535" ref="multipleTable" v-loading="materloading"
                      @select="handleSelect" @select-all="handleSelectAll"
                      class="table_mater">
                <el-table-column type="selection" width="41px" scope="scope">
                </el-table-column>
                <el-table-column prop="imgUrl" label="" width="50" class="change-pic-icon">
                    <template slot-scope="scope">
                        <img v-if="scope.row.imgUrl" @click="previewImg(scope.row)"
                             src="../../../assets/images/changePic_3.png" alt="">
                        <img v-else src="../../../assets/images/changePic_2.png" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="resName" label="资源名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="mTitle" label="媒体名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="asLab" label="面" width="50">
                </el-table-column>
                <el-table-column prop="city" label="城市" width="90">
                </el-table-column>
                <el-table-column prop="rName" label="区域" width="90">
                </el-table-column>
                <el-table-column prop="map" label="地图中心点" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.map||'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="timeRange" label="排期" min-width="120" :filters="filtersData"
                                 :filter-method="filterTimeRange">
                </el-table-column>
                <el-table-column prop="remark" label="上画备注" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.remark||'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="60">
                    <!--<template slot-scope="scope">-->
                    <!--<i class="el-icon-picture" :style="{color:scope.row.imgUrl?'#108DE7':'', margin: '0 10px'}" @click="previewImg(scope.row)" :disabled="!scope.row.imgUrl"></i>-->
                    <!--<i class="el-icon-delete" :style="{color:scope.row.imgUrl?'#108DE7':''}" @click="deleteMaterInfo(scope.row, scope.$index)" :disabled="!scope.row.imgUrl"></i>-->
                    <!--</template>-->
                    <template slot-scope="scope">
                        <span style="color: #1890ff;cursor: pointer" @click="showMaterDetail(scope.row)">编辑</span>
                    </template>

                </el-table-column>

                <div slot="empty">
                    <no-search-result></no-search-result>
                </div>
            </el-table>
            <div class="ad_pagination" v-if="total">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="changePage"
                    @size-change="sizeChange"
                    :page-sizes="[10, 20, 50,100,500]"
                    :current-page.sync="currInfoPage"
                    :page-size="maInfoSize"
                    :total="total">
                </el-pagination>
            </div>
            <p style="text-align:center;margin-top:20px;">
                <el-button plain @click="showPhotoRemark = false" size="small">取消</el-button>
                <el-button type="primary" size="small" @click="saveAll()">保存</el-button>
            </p>
        </el-dialog>
        <!--编辑物料弹出框-->
        <el-dialog
            title="编辑物料"
            :visible.sync="MaterDetailModal"
            custom-class="change-pic-detail-modal"
            :close-on-click-modal="false"
            :show-close="false"
            width="448px">
            <div class="change-pic-detail-info">
                <div>
                    <h5>
                        {{MaterDetailInfo.resName}}-{{MaterDetailInfo.mTitle}}-{{MaterDetailInfo.asLab}}面
                        <span v-if="MaterDetailInfo.remark||MaterDetailInfo.imgUrl" class="a">已添加</span>
                        <span v-else class="b">未添加</span>
                    </h5>
                    <p>地址：{{MaterDetailInfo.resAddress}}</p>
                    <p>排期：{{MaterDetailInfo.timeRange}}</p>
                </div>
                <div class="divide"></div>
                <el-row>
                    <el-col class="flex_box imgpain_box tal">
                        <span>物料素材：</span>
                        <el-upload
                            :action="doUpload"
                            list-type="picture-card"
                            :file-list="uploadimgUrl"
                            :on-success="materImgSuccess"
                            :before-upload="materImgBeforeUpload"
                            :on-remove="delectImg"
                            :limit='1'>
                        <span class="upload_border">
                            <i class="el-icon-plus"></i>
                            <span>上传物料</span>
                        </span>
                        </el-upload>
                    </el-col>
                    <el-col class="flex_box remark-box">
                        <span>备注信息：</span>
                        <el-input type="textarea" :rows="2" placeholder="请输入备注信息" v-model="oneEditInfo.remark"
                                  :maxlength="100"></el-input>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button plain @click="handleCloseChangeOneMater">取 消</el-button>

                <!--<el-button style="padding: 0 10px" plain v-if="MaterDetailInfo.remark||MaterDetailInfo.imgUrl" @click="deleteMaterInfo('one')">-->
                <!--删除物料信息-->
                <!--</el-button>-->
                <el-button type="primary" v-if="!(MaterDetailInfo.remark||MaterDetailInfo.imgUrl)"
                           @click="changeOneMater('submit')">提 交
                </el-button>
                <el-button type="primary" v-if="MaterDetailInfo.remark||MaterDetailInfo.imgUrl"
                           @click="changeOneMater('save')">保 存
                </el-button>
                <!--<el-button plain @click="handleCloseChangeOneMater">关 闭</el-button>-->


            </div>
        </el-dialog>
        <!-- 添加备注弹出框 -->
        <el-dialog
            title="批量添加备注信息"
            width="348px"
            :close-on-click-modal="false"
            :show-close="false"
            :visible.sync="showAllRemark">
            <el-input type="textarea" :rows="2" placeholder="请输入备注信息" v-model="remarkInfo" :maxlength="100"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button plain @click="showAllRemark = false" size="small">取消</el-button>
                <el-button type="primary" @click="saveAllRemark()" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加画像弹出框 -->
        <el-dialog
            title="批量添加物料画面"
            width="20%"
            :close-on-click-modal="false"
            :show-close="false"
            custom-class="all-pic-dialog"
            :visible.sync="showAllPic">
            <div class="imgpain_box">
                <el-upload
                    :action="doUpload"
                    list-type="picture-card"
                    :file-list="uploadimgUrl"
                    :on-success="materImgSuccess"
                    :before-upload="materImgBeforeUpload"
                    :limit='1'>
                <span class="upload_border">
                    <i class="el-icon-plus"></i>
                    <span>上传物料</span>
                </span>
                </el-upload>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button plain @click="cancleUploadAllPic" size="small">取消</el-button>
                <el-button type="primary" @click="comfirmUploadAllPic" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 图片查看显示 -->
        <el-dialog :visible.sync="dialogVisible" class="imgPreview" top="10vh">
            <img :src="dialogImageUrl" alt="暂无图片"/>
        </el-dialog>
    </div>
</template>

<script>
    import {Table, TableColumn, Message} from 'element-ui';
    import {api} from "../../../api/api.js";
    import noSearchResult from "../components/noSearchResult.vue";
    // 筛选过滤
    import filterFormat from "../../../commonFun/filterTableData.js";
    import sessFun from '../../../commonFun/sessFun.js';
    // 时间格式化
    import dateFormat from "../../../commonFun/timeFormat.js";

    export default {
        components: {
            noSearchResult,
            elTable: Table,
            elTableColumn: TableColumn,
        },
        props: {
            material: {
                type: Array,
                default: []
            },
            daomater: {
                type: Array,
                default: []
            },
            loading: {
                type: Boolean,
                default: true
            },
            isOrder: {
                type: Boolean,
                default: false
            }
        },
        computed: {},
        data() {
            return {
                //图片预览
                dialogVisible: false,
                dialogImageUrl: '',
                mediaType: '广告门',
                sessionData: '',
                // 排期时间过滤
                filtersData: [],
                // 上传图片地址
                doUpload: "/advertisement/UpLoad",
                // doUpload: "http://192.168.1.239/advertisement/UpLoad",
                uploadimgUrl: [],
                // 是否显示上传素材弹框
                showPhotoRemark: false,
                // 是否显示上画备注弹框
                showAllRemark: false,
                // 备注信息内容
                remarkInfo: '',
                showAllPic: false,
                // 物料资源名称搜索
                resNameSec: '',
                // 地图中心点选择
                mapName: '',
                // 地图中心点数组:
                mapArr: [],
                // loading
                materloading: true,
                // 物料信息弹出框的选点信息
                materInfoArr: [],
                currInfoPage: 1,
                maInfoSize: 10,
                total: 1,
                loading_maInfo: false,
                // 有操作的数据
                shoplist: [],
                //勾选的数据
                selectList: [],
                isSearch: true,
                isReset: true,
                MaterDetailInfo: {
                    picUrl: '',
                    remark: '',
                },//当前行
                MaterDetailModal: false,
                // selectNum:0,//勾选的个数
                hasMaterialCount: 0,//已备注的数量
                oneEditInfo: {remark: '',imgUrl:''}
            }
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
        created() {
            console.log('material-----', this.material);
            console.log('material-----', this.daomater);
            this.sessionData = sessFun.getSess();
            this.materialInfo = this.material;
            this.daomaterInfo = this.daomater;
        },
        methods: {

            // 排期筛选
            filterTimeRange(value, row) {
                return row.timeRange === value;
            },
            // 获取地图中心点
            getMapCenter() {
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apID: sessionStorage.getItem('order_apid'),
                    queryType: 0,
                };
                api.getApi(this.apiVar.Advertisement + '/GetAdMaterial', params).then(res => {
                    console.log('res.data-----', res.data);
                    if (!res.data.SysCode && res.data.length) {
                        for (let data of res.data) {
                            let obj = {
                                name: data
                            };
                            this.mapArr.push(obj);
                        }
                    }
                });
            },
            // 物料信息上传上画弹出框
            uploadMater() {
                this.showPhotoRemark = true;
                this.shoplist = [];
                this.currInfoPage = 1;
                this.maInfoSize = 10
                this.materInfoArr = [];
                this.mapArr = [];
                // this.selectNum = 0
                this.selectList = []
                this.searchInfoFun();
                this.getMapCenter();
            },
            // // 物料弹出框滚动加载
            // materLoadMore() {
            //     if (this.loading_maInfo) {
            //         this.loading_maInfo = false;
            //         if (this.currInfoPage <= this.total) {
            //             this.searchInfoFun();
            //         }
            //     }
            // },
            // 改变每页条数
            sizeChange(pageVal) {
                this.currInfoPage = 1;
                this.maInfoSize = pageVal;
                this.searchInfoFun();
            },
            // 改变页数
            changePage(page) {
                this.currInfoPage = page;
                this.searchInfoFun();
            },
            searchInfoFun() {
                let info = this.searchDataFormat();
                this.getMaterInfo(info);
            },
            getMaterInfo(params) {
                api.postApi(this.apiVar.Advertisement + '/GetAdMaterial', params).then(res => {
                    console.log('列表', res.data);
                    if (res.data.list.length >= 0) {
                        this.materInfoArr = []
                        let dataInfo = res.data;
                        // 物料信息弹出框的选点信息
                        this.total = res.data.total;
                        this.hasMaterialCount = res.data.hasMaterialCount
                        let dataArr = dataInfo.list;
                        // console.log(dataArr, 'datearr--');
                        this.materInfoArr = this.formatData(dataArr);
                        console.log(this.materInfoArr, 'materinfoarr----');
                        this.loading_maInfo = true;
                        // this.currInfoPage++;
                        this.SelectioUpdate();
                        this.filtersData = filterFormat(dataArr, "timeRange");
                    } else {
                        Message.warning(res.data.MSG);
                    }
                    this.materloading = false;
                }).catch(err => {
                    this.materloading = false;
                });
            },
            // 搜索数据格式化
            searchDataFormat() {
                let res = this.resNameSec;
                let map = this.mapName;
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    pageNo: this.currInfoPage,
                    pageSize: this.maInfoSize,
                    apID: sessionStorage.getItem('order_apid')
                };
                if (res) {
                    info.resName = res;
                }
                if (map) {
                    info.mapCenterName = map;
                }
                return info;
            },
            // 物料信息弹出框搜索
            searchInfo() {
                console.log(this.resNameSec, this.mapName, this.materInfoArr);
                if (this.resNameSec || this.mapName) {
                    this.isSearch = false;
                    let timer = setTimeout(() => {
                        this.isSearch = true;
                        clearTimeout(timer);
                    }, 1000);
                    this.materInfoArr = [];
                    this.loading_maInfo = false;
                    this.materloading = true;
                    this.currInfoPage = 1;
                    this.searchInfoFun();
                } else {
                    Message.warning('请输入搜索条件');
                }
            },
            formatData(arr) {
                let result = [];
                for (let data of arr) {
                    let obj = this.setTableData(data);
                    result.push(obj);
                }
                return result;
            },
            // 表格数据格式
            setTableData(item) {
                let timeRange = dateFormat.toDate(item.lStar, '/') + '-' + dateFormat.toDate(item.lEnd, '/');
                let timeRange1 = dateFormat.toDate(item.lStar, '/') + '-' + dateFormat.toDate(item.lSetTime, '/');
                let obj = {
                    resID: item.resID,
                    lID: item.lID,
                    lStar: item.lStar,
                    lEnd: item.lEnd,
                    asID: item.asID,
                    resName: item.resName,
                    mTitle: item.mTitle,
                    asLab: item.asLab,
                    city: item.city,
                    rName: item.rName,
                    map: item.mapCenterName,
                    timeRange: item.lState == 2 ? timeRange1 : timeRange,
                    changePicTime: '',
                    remark: item.remark || '',
                    imgUrl: item.picUrl || '',
                    uploadUser: item.uploadUser || '',
                    isSelect: false,
                    resAddress: item.resAddress || '--',
                    isAdd: !!(item.remark || item.imgUrl),//是否已添加物料信息
                };
                return obj;
            },
            // 物料信息弹出框重置
            resetInfo() {
                this.mapName = '';
                this.resNameSec = '';
                this.materInfoArr = [];
                this.loading_maInfo = false;
                this.materloading = true;
                this.currInfoPage = 1;
                this.isReset = false;
                let timer = setTimeout(() => {
                    this.isReset = true;
                    clearTimeout(timer);
                }, 1000);
                this.searchInfoFun();
            },
            // 打开备注框
            openAllRemark() {
                if (!this.selectList.length) {
                    Message.warning('请先勾选需要备注的选点');
                    return;
                }
                // console.log(this.selectList);
                this.remarkInfo = '';
                this.showAllRemark = true;
            },
            //打开批量修改图片
            openAllPic() {
                if (!this.selectList.length) {
                    Message.warning('请先勾选需要修改物料的选点');
                    return;
                }
                this.uploadimgUrl = []
                this.showAllPic = true;
            },
            // 上传图片之前的格式大小判断
            materImgBeforeUpload(file) {
                const isJPG = file.type === "image/jpeg" || file.type === "image/png";
                ;
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    Message.error('只能上传jpg/png图片!');
                }
                if (!isLt2M) {
                    Message.error('图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            // 上传图片成功后、
            materImgSuccess(res, file) {
                console.log('res----file----', res, file);
                this.uploadimgUrl = []
                let resImg = {name: '图片1', url: res[0].pURL};
                this.uploadimgUrl = [resImg];
                console.log(this.uploadimgUrl);
            },
            //删除图片
            delectImg(res, file) {
                this.uploadimgUrl = [];
                this.oneEditInfo.imgUrl = '';
                for (let data of this.materInfoArr) {
                    if (data.asID == this.MaterDetailInfo.asID && data.lStar == this.MaterDetailInfo.lStar && data.lEnd == this.MaterDetailInfo.lEnd) {
                        data.imgUrl = '';
                        data.uploadUser = this.sessionData.uID;
                        // this.selectNum=0
                        this.$refs.multipleTable.toggleRowSelection(data, false);
                        break;
                    }
                }

                // console.log('删除图片', this.MaterDetailInfo);
            },
            //取消批量上传图片
            cancleUploadAllPic() {
                // this.uploadimgUrl = []
                this.showAllPic = false
            },
            //确定批量上传图片
            comfirmUploadAllPic() {
                this.showAllPic = false
                for (let data of this.shoplist) {
                    data.imgUrl = this.uploadimgUrl[0].url;
                }
                for (let data of this.materInfoArr) {
                    for (let item of this.selectList) {
                        if (data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd) {
                            data.imgUrl = item.imgUrl;
                            data.uploadUser = this.sessionData.uID;
                            // this.selectNum=0
                            this.$refs.multipleTable.toggleRowSelection(data, false);
                            break;
                        }
                    }
                }
                this.selectList = []
                this.uploadimgUrl = []
            },
            // 勾选一条
            handleSelect(selection, row) {
                console.log(selection, row, 'selection ---row ');
                // 选中
                if (this.isHaveFun(selection, row)) {
                    for (let data of selection) {
                        if (!this.isHaveFun(this.selectList, data)) {
                            // this.selectNum++
                            this.selectList.push(data);
                        }
                        if (!this.isHaveFun(this.shoplist, data)) {
                            this.shoplist.push(data);
                        }
                    }
                } else {
                    // 取消选中

                    if (this.isHaveFun(this.selectList, row)) {
                        this.selectList = this.selectList.filter((item) => {
                            if (row.asID == item.asID && row.lStar == item.lStar && row.lEnd == item.lEnd) {
                                // this.selectNum--
                                return false;
                            }
                            return true;
                        });
                    }
                    if (this.isHaveFun(this.shoplist, row)) {
                        this.shoplist = this.shoplist.filter((item) => {
                            if (row.asID == item.asID && row.lStar == item.lStar && row.lEnd == item.lEnd) {
                                return false;
                            }
                            return true;
                        });
                    }
                }

                console.log(this.selectList, this.shoplist, 'one--selectList');
            },
            // 全选
            handleSelectAll(selection) {
                console.log(selection, 'selection-----all');
                if (selection.length) {
                    for (let data of selection) {
                        if (!this.isHaveFun(this.selectList, data)) {
                            // this.selectNum++
                            this.selectList.push(data);
                        }
                        if (!this.isHaveFun(this.shoplist, data)) {
                            this.shoplist.push(data);
                        }
                    }
                } else {
                    for (let data of this.materInfoArr) {
                        if (this.isHaveFun(this.selectList, data)) {
                            this.selectList = this.selectList.filter((item) => {
                                if (data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd) {
                                    // this.selectNum--
                                    return false;
                                }
                                return true;
                            });
                        }
                        if (this.isHaveFun(this.shoplist, data)) {
                            this.shoplist = this.shoplist.filter((item) => {
                                if (data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd) {
                                    return false;
                                }
                                return true;
                            });
                        }

                    }
                }

                console.log(this.selectList, this.shoplist, 'all--selectList');
            },
            // 是否勾选更新
            SelectioUpdate() {
                console.log(this.selectList, this.shoplist);
                let timer = setTimeout(() => {
                    for (let item of this.selectList) {
                        for (let data of this.materInfoArr) {
                            if (data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd) {
                                // console.log(data);
                                this.$refs.multipleTable.toggleRowSelection(data, true);
                            }
                        }
                    }
                    for (let item of this.shoplist) {
                        for (let data of this.materInfoArr) {
                            if (data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd) {
                                data.remark = item.remark;
                                data.imgUrl = item.imgUrl;
                                data.replaceDate = item.replaceDate;
                            }
                        }
                    }
                    clearTimeout(timer);
                }, 0)
            },
            // 保存备注
            saveAllRemark() {
                this.showAllRemark = false;
                console.log('this.remarkInfo---', this.remarkInfo, this.selectList);
                for (let data of this.shoplist) {
                    data.remark = this.remarkInfo;
                }
                for (let data of this.materInfoArr) {
                    for (let item of this.shoplist) {
                        if (data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd) {
                            data.remark = item.remark;
                            // this.selectNum=0
                            //取消选中
                            this.$refs.multipleTable.toggleRowSelection(data, false);
                        }
                    }
                }
                this.selectList = []
                // console.log(this.materInfoArr, this.selectList);
            },
            // 查看图片
            previewImg(file) {
                console.log(file);
                this.dialogImageUrl = file.imgUrl;
                this.dialogVisible = true;
            },
            // 删除物料信息
            deleteMaterInfo(type) {
                if (type == 'all') {
                    if (!this.selectList.length) {
                        Message.warning('请先勾选需要删除物料信息的点位');
                        return;
                    }
                    this.$confirm('确认删除后，所选的物料信息将被清空', '是否确认批量删除物料信息', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        for (let data of this.materInfoArr) {
                            for (let item of this.selectList) {
                                if (data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd) {
                                    data.imgUrl = '';
                                    data.remark = '';
                                    // this.selectNum=0
                                    //取消选中
                                    this.$refs.multipleTable.toggleRowSelection(data, false);
                                    break;
                                }
                            }
                        }
                    }).catch(() => {
                    });
                } else {
                    this.$confirm('确认删除后，所选的物料信息将被清空', '是否确认删除物料信息', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        for (let data of this.materInfoArr) {
                            if (data.asID == this.MaterDetailInfo.asID && data.lStar == this.MaterDetailInfo.lStar && data.lEnd == this.MaterDetailInfo.lEnd) {
                                data.imgUrl = '';
                                data.remark = '';
                                // this.selectNum--
                                this.$refs.multipleTable.toggleRowSelection(data, false);
                                this.MaterDetailModal = false
                                break;
                            }

                        }
                    }).catch(() => {
                    });
                }


            },
            //修改单个物料信息-提交
            changeOneMater(type) {
                this.oneEditInfo.imgUrl = this.uploadimgUrl[0] ? this.uploadimgUrl[0].url : ''
                if (type == 'submit' && !this.oneEditInfo.remark && !this.oneEditInfo.imgUrl) {
                    Message.warning('请上传物料素材或填写备注信息再提交！');
                } else {
                    for (let data of this.materInfoArr) {
                        if (data.asID == this.MaterDetailInfo.asID && data.lStar == this.MaterDetailInfo.lStar && data.lEnd == this.MaterDetailInfo.lEnd) {
                            data.imgUrl = this.oneEditInfo.imgUrl;
                            data.remark = this.oneEditInfo.remark;
                            // this.selectNum--

                            this.$refs.multipleTable.toggleRowSelection(data, false);
                            if (this.isHaveFun(this.selectList, data)) {
                                this.selectList = this.selectList.filter((item) => {
                                    if (data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd) {
                                        // this.selectNum--
                                        return false;
                                    }
                                    return true;
                                });
                            }
                            break;
                        }
                    }
                    this.MaterDetailModal = false
                }


            },
            //取消编辑单个物料信息
            handleCloseChangeOneMater() {
                this.MaterDetailModal = false
                this.MaterDetailInfo = {
                    ...this.MaterDetailInfo,
                    picUrl: '',
                    remark: '',
                }

                // this.shoplist = this.shoplist.filter((item) => {
                //     if (item.asID == this.MaterDetailInfo.asID && item.lStar == this.MaterDetailInfo.lStar && item.lEnd == this.MaterDetailInfo.lEnd) {
                //         //不返回该项
                //         return false;
                //     }
                //     return true;
                // });
            },
            //显示物料详情弹框
            showMaterDetail(item) {

                console.log('单条信息', item);
                // console.log(this.shoplist);
                this.MaterDetailModal = true
                this.MaterDetailInfo = {...item}
                this.oneEditInfo.remark = item.remark ? item.remark : ''
                this.oneEditInfo.imgUrl = item.imgUrl ? item.imgUrl : ''

                if (!this.isHaveFun(this.shoplist, item)) {
                    this.shoplist.push(item);
                }
                if (item.imgUrl) {
                    let resImg = {name: '图片1', url: item.imgUrl};
                    this.uploadimgUrl = [resImg];

                } else {
                    this.uploadimgUrl = []
                }
            },
            // 保存所有信息
            saveAll() {
                console.log('this.materInfoArr---', this.materInfoArr);
                let result = [];
                for (let data of this.shoplist) {
                    let obj = {
                        "lID": data.lID,
                        "picUrl": data.imgUrl ? data.imgUrl : '',
                        "remark": data.remark ? data.remark : '',
                        "uploadUser": data.uploadUser ? data.uploadUser : this.sessionData.uID
                    };
                    result.push(obj);
                }
                if (result.length) {
                    let info = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        adMaterails: JSON.stringify(result),
                    };
                    api.postApi(this.apiVar.Advertisement + '/AddAdMaterial', info).then(res => {
                        console.log(res.data);
                        if (res.data.SysCode == 200200) {
                            Message.success(res.data.MSG);
                            this.showPhotoRemark = false
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    });
                } else {
                    Message.warning('没有需要保存的点');
                }
            },
            // 判断一个对象是否已经在数组中
            isHaveFun(arr, item) {
                let res = arr.filter((data) => {
                    if (data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd) {
                        return true;
                    }
                    return false;
                });
                if (res.length) {
                    return true;
                }
                return false;
            },
        },
    }
</script>

<style scoped>
    .box-wrap {
        background-color: #fff;
    }

    /deep/ .el-tabs__nav-scroll {
        padding-left: 28px;
    }

    .box-wrap > h4 {
        height: 55px;
        padding-left: 28px;
        border-bottom: 1px solid #e6e7e9;
        font-size: 16px;
        color: rgba(51, 51, 51, 0.85);
        line-height: 55px;
        font-weight: bold;
    }

    .table_wrap {
        margin: 0px 32px;
    }

    /deep/ .el-table th > .cell {
        font-weight: bold;
    }

    /* 弹出框样式 */
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

    /* 搜索 */
    .search-row {
        margin-bottom: 10px;
    }

    .search-row /deep/ .el-button {
        padding: 0 10px;
    }

    .inline_dialog {
        display: flex;
        align-items: center;
    }

    .inline_dialog > p {
        margin-right: 16px;
    }

    .inline_dialog /deep/ .el-button {
        margin-right: 5px;
    }

    .dropdown_a /deep/ .el-button {
        width: 94px;
    }

    .dropdown-menu /deep/ .el-dropdown-menu__item {
        padding: 0 12px;
        width: 84px;
    }

    .table_mater /deep/ .gutter {
        width: 8px;
    }

    .table_mater img {
        width: 20px;
        height: 20px;
        position: relative;
        left: 4px;
        top: 6px;
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

    .upload_border {
        width: 104px;
        height: 104px;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 4px;
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

    .imgpain_box {
        height: 104px;
        overflow: hidden;
        display: flex;
        justify-content: center;
    }

    .imgpain_box.tal {
        justify-content: left;
    }

    /deep/ .imgpain_box .el-upload--picture-card {
        border: 1px dashed #dedede;
        width: 104px;
        height: 104px;
        margin: 0;
    }

    /deep/ .imgpain_box .el-upload-list--picture-card .el-upload-list__item {
        width: 104px;
        height: 104px;
    }

    /deep/ .imgpain_box .el-upload-list__item.is-success {
        display: block;
    }

    /*物料详情弹框*/
    .change-pic-detail-info h5 {
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 6px;

    }

    .change-pic-detail-info h5 span {
        display: inline-block;
        width: 44px;
        height: 18px;
        background: rgba(0, 0, 0, 0.15);
        border-radius: 2px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        text-align: center;
        line-height: 18px;
    }

    .change-pic-detail-info h5 span.a {
        background: rgba(230, 247, 255, 1);
        border: 1px solid rgba(145, 213, 255, 1);
        color: #1890FF;
    }

    .change-pic-detail-info p {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        margin-bottom: 6px;
    }

    .change-pic-detail-info .divide {
        width: 100%;
        height: 1px;
        background: rgba(216, 216, 216, 1);
        margin: 24px 0;
    }

    .remark-box {
        display: flex;
        margin-top: 16px;
    }

    .remark-box span {
        width: 86px;
    }

</style>

<style>
    .all-pic-dialog .el-dialog__body, .all-pic-dialog .el-dialog__footer {
        text-align: center;
        padding-bottom: 20px;
    }

    .change-pic-detail-modal /deep/ .el-dialog__body {
        padding: 5px 24px;
    }
</style>
