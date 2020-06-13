<template>
    <div class="mediaDetail">
        <div class="ad_mediaDetail_wrap clearfix">
            <div class="ad_mediaDetail_nav">
                <p><a href="#">媒体管理</a><em> / </em><a href="#">媒体详情</a></p>
            </div>
            <!--媒体信息-->
            <div class="ad_mediaInfo">
                <div class="ad_mediaInfo_head">
                    <div class="u-title">
                        <h2>{{resData.resName}}</h2>
                        <span class="refresh">（更新时间：354天前 <a class="refresh-nav">更新</a>）</span>
                    </div>
                    <div class="ad_mediaInfo_head_btn">
                        <el-button plain size="mini" @click="edit('add')" v-if="haveEdit"
                                   v-qadn-mta-h5="{id: 'a002_b005_c000_d000_bt027_ck03'}">添加媒体</el-button>
                        <el-button plain size="mini" style="color:rgba(0,0,0,0.65)" @click="showResImg">小区全貌</el-button>
                        <el-button type="primary" @click="edit" v-if="haveEdit" size="mini"
                                   v-qadn-mta-h5="{id: 'a002_b005_c000_d000_bt025_ck03'}">编辑</el-button>
                    </div>
                </div>
                <div class="ad_mediaInfoPanel" v-model="resData">
                    <div class="ad_mediaInfoPanel_row">
                        <h3>基本信息</h3>
                        <el-row type="flex" class="row-bg row_box">
                            <el-col :span="6">
                                <label  class="ad_mediaInfoPanel_row_title">资源类型：</label><span>{{resData.cType}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">所属城市：</span><span>{{resData.city}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">所在区域：</span><span>{{resData.cityArea}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">资源别名：</span><span>{{resData.resAlias || '--'}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="ad_mediaInfoPanel_row">
                        <h3>位置信息</h3>
                        <el-row type="flex" class="row-bg row_box" style="margin-bottom: 0">
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">资源地址：</span><span>{{resData.resAddress}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">地址别名：</span><span>{{resData.addressAlias || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">经纬度：</span><span>{{resData.latLng}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">所属商圈：</span><span>{{resData.tradingArea || '&#45;&#45;'}}</span>
                            </el-col>
                        </el-row>
                        <el-row class="row-bg row_box">
                            <el-col :span="6" style="position: relative">
                                <div class="ad_mediaInfoPanel_row_box" style="cursor: pointer" :class="showAllDetail.des ? 'show_all_aetail' : ''"
                                     @click="showDetailFun('des')">
                                    <div class="ad_mediaInfoPanel_row_title">
                                        具体描述：
                                        <div class="showAllText showAllTextDes" v-show="judgeShowBtn.des">
                                            <span style="color: #1890FF">{{showAllDetail.des? '收起' : '... 展开'}} </span>
                                        </div>
                                    </div>
                                    <div class="ad_mediaInfoPanel_row_content ad_mediaInfoPanel_row_content_des">
                                        {{resData.description || '--'}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="6" style="position: relative">
                                <div class="ad_mediaInfoPanel_row_box" style="cursor: pointer" :class="showAllDetail.sfs ? 'show_all_aetail' : ''"
                                     @click="showDetailFun('sfs')">
                                    <div class="ad_mediaInfoPanel_row_title">
                                        周边配套：
                                        <div class="showAllText showAllTextSfs" v-show="judgeShowBtn.sfs">
                                            <span style="color: #1890FF">{{showAllDetail.sfs? '收起' : '... 展开'}} </span>
                                        </div>
                                        <!-- <div class="showAllText" v-show="!showAllDetail.sfs">... <span style="color: #1890FF">展开</span></div>-->
                                    </div>
                                    <div class="ad_mediaInfoPanel_row_content ad_mediaInfoPanel_row_content_sfs">
                                        {{resData.supportingFacilities || '--'}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="6" style="position: relative">
                                <div class="ad_mediaInfoPanel_row_box" style="cursor: pointer"
                                     :class="showAllDetail.tpt ? 'show_all_aetail' : ''" @click="showDetailFun('tpt')">
                                    <div class="ad_mediaInfoPanel_row_title">
                                        交通状况：
                                        <div class="showAllText showAllTextTpt" v-show="judgeShowBtn.tpt">
                                            <span style="color: #1890FF">{{showAllDetail.tpt? '收起' : '... 展开'}} </span>
                                        </div>
                                    </div>
                                    <div class="ad_mediaInfoPanel_row_content ad_mediaInfoPanel_row_content_tpt">
                                        {{resData.transportation || '--'}}
                                    </div>
                                </div>

                            </el-col>
                        </el-row>
                    </div>
                    <div class="ad_mediaInfoPanel_row">
                        <h3>属性信息</h3>
                        <el-row class="row-bg row_box" style="margin-bottom: 0">
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">楼盘价格：</span><span>{{resData.housePrice}}元/平方米</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">{{res_village.hType}}：</span><span>{{resData.houseType}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">{{res_village.hNum}}：</span><span>{{resData.HouseNum}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">楼栋数量：</span><span>{{resData.buildingNum}}</span>
                            </el-col>
                        </el-row>
                        <el-row class="row-bg row_box" style="margin-bottom: 0">
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">建筑类型：</span><span>{{resData.buildingType || '&#45;&#45;'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">{{res_village.joinTime}}：</span><span>{{resData.joinTime || '&#45;&#45;'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">占地面积：</span><span>{{resData.floorSpace || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">建筑面积：</span><span>{{resData.constructionSpace || '--'}}</span>
                            </el-col>
                        </el-row>
                        <el-row class="row-bg row_box" style="margin-bottom: 0">
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">建筑结构：</span><span>{{resData.buildingStructure || '&#45;&#45;'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">容积率：</span><span>{{resData.plotRatio || '&#45;&#45;'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">绿化率：</span><span>{{resData.greenPercentage || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">产权年限：</span><span>{{resData.ownershipPeriod || '--'}}</span>
                            </el-col>
                        </el-row>
                        <el-row class="row-bg row_box">
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">出入口数：</span><span>{{resData.EntryExitNum || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">车位数：</span><span>{{resData.carNumber}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">车流量：</span><span>{{resData.carFlowrate}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">人流量：</span><span>{{resData.peopleFlowrate}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="ad_mediaInfoPanel_row">
                        <h3>物业信息</h3>
                        <el-row type="flex" class="row-bg row_box" style="margin-bottom: 0">
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">开发商：</span><span>{{resData.developer || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">物业公司：</span><span>{{resData.propertyManagement || resData.pmc || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">物业费：</span><span>{{resData.managementFee || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">售楼地址：</span><span>{{resData.salesOfficeAdd || '&#45;&#45;'}}</span>
                            </el-col>
                        </el-row>
                        <el-row class="row-bg row_box">
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">售楼电话：</span><span>{{resData.salesPhoneNumber || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">折扣信息：</span><span>{{resData.discount  || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">预售许可证：</span><span>{{resData.preSalePermit || '--'}}</span>
                            </el-col>
                            <el-col :span="6">
                                <span class="ad_mediaInfoPanel_row_title">产权性质：</span><span>{{resData.ownershipType || '--'}}</span>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <!--媒介载体-->
                <div class="ad_ad">
                    <div v-if="haveEdit && activeMedia === 'first'" class="connect_door">
                        <span class="connect_door_btn" @click="connectDoorFun"
                              v-qadn-mta-h5="{id: 'a002_b005_c000_d000_bt026_ck04'}">设置连排门</span>
                    </div>
                    <el-tabs v-model="activeMedia">
                        <el-tab-pane label="广告门" name="first">
                            <div class="table_wrap">
                                <el-table
                                    v-loading="mediaLoading"
                                    element-loading-text="玩命加载中.."
                                    element-loading-spinner="el-icon-loading"
                                    border
                                    :data="mediaList"
                                    style="width: 100%">
                                    <el-table-column
                                        prop="mTitle"
                                        label="媒体名称"
                                        min-width="8.6%"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="grade"
                                        label="媒体等级"
                                        min-width="7%">
                                        <template slot-scope="scope">
                                            {{scope.row.grade || '--'}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="mType"
                                        label="门体类型"
                                        min-width="7%"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="mState"
                                        label="状态"
                                        min-width="7%">
                                        <template slot-scope="scope">
                                            {{scope.row.mState == 0 ? '禁用' : scope.row.mState == 1 ? '正常' :
                                            scope.row.mState == 2 ? '待安装' : scope.row.mState == 3 ? '待维修' : '已拆除'}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="资产编号"
                                        min-width="10.2%"
                                        :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            {{ scope.row.assetTag || '&#45;&#45;' }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="adSize"
                                        label="广告尺寸"
                                        min-width="7%"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="adViewSize"
                                        label="可视画面"
                                        min-width="7%"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        label="广告限制"
                                        min-width="10%"
                                        class="tar"
                                        :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.notPush || '--' }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="备注"
                                        min-width="12%"
                                        :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            {{ scope.row.mRemark || '--' }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="门禁图片"
                                        min-width="6%">
                                        <template slot-scope="scope">
                                            <div style="color: #108EE9;cursor: pointer;"
                                                 @click="showMediaImg(scope.row.mID)">查看
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="道闸" name="second">
                            <div class="table_wrap">
                                <el-table
                                    border
                                    :data="roadGateList"
                                    style="width: 100%">
                                    <el-table-column
                                        prop="mTitle"
                                        label="媒体名称"
                                        min-width="133"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="mState"
                                        label="状态"
                                        min-width="113"
                                    >
                                        <template slot-scope="scope">
                                            {{scope.row.mState == 0 ? '禁用' : scope.row.mState == 1 ? '正常' :
                                            scope.row.mState == 2 ? '待安装' : scope.row.mState == 3 ? '待维修' : '已拆除'}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="资产编号"
                                        min-width="163"
                                        :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            {{ scope.row.assetTag || '--' }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="picSize"
                                        label="画面尺寸"
                                        min-width="114"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="lightBoxSize"
                                        label="灯箱尺寸"
                                        min-width="114"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        label="广告限制"
                                        min-width="163"
                                        class="tar"
                                        :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            {{ scope.row.notPush || '--' }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="备注"
                                        min-width="196"
                                        :show-overflow-tooltip="true">
                                        <template slot-scope="scope">
                                            {{ scope.row.mRemark || '--' }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        label="门禁图片"
                                        min-width="100"
                                    >
                                        <template slot-scope="scope">
                                            <div style="color: #108EE9;cursor: pointer;"
                                                 @click="showRGImg(scope.row.mID)">查看
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="content_bottom_btn">
                    <el-button plain type="default" @click="goBack">返回</el-button>
                </div>
            </div>
        </div>
        <!--资源图片模态框-->
        <el-dialog
            :visible.sync="ResImgDialogVisible">
            <img class="resImg" :src='ResImgSrc' alt="资源图片">
        </el-dialog>
        <!--媒体图片模态框-->
        <el-dialog
            :visible.sync="mediaImgDialogVisible"
            :title="mediaImgTitle">
            <div class="block mediaImg">
                <el-carousel height="550px">
                    <el-carousel-item v-for="(src,index) in mediaImgSrc" :key="index">
                        <img class="mediaImg" :src='src' alt="媒体图片">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </el-dialog>
        <!--设置连排门-->
        <el-dialog :visible.sync="ConnectDoorDialogVisible" title="连排门设置" custom-class="connectAD">
            <ul>
                <li v-for="(item,index) in connectAdArr" class="connect_door_li">
                    <span class="connect_door_h4">连排门{{AToZList[index].value}}:</span>
                    <el-select v-model="item.selectMIDs" size="small" multiple placeholder="请选择"
                               @change="changeMedia">
                        <el-option
                            v-for="item in item.options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                    <i class="el-icon-remove" @click="delRowSelect(index)"></i>
                </li>
            </ul>
            <div class="add_row_btn" @click="addRowSelect()">+ 添加连排门</div>
            <div slot="footer" class="dialog-footer">
                <el-button plain size="small" @click="ConnectDoorDialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="setConnectAdData" :disabled="isConnectBtn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../api/api'
    import sessFun from '../../commonFun/sessFun.js'
    import {Button, Table, TableColumn, Row, Col, Message} from 'element-ui';

    export default {
        name: "mediaDetail",
        components: {
            elButton: Button,
            elTable: Table,
            elTableColumn: TableColumn,
            elRow: Row,
            elCol: Col
        },
        data() {
            return {
                haveEdit: false,
                mediaLoading: true,
                resID: '',
                resData: {
                    resName: '',
                    cType: '',
                    city: '',
                    cityArea: '',
                    tradingArea: '',
                    houseType: '',
                    EntryExitNum: '',
                    HouseNum: 1,
                    housePrice: 0,
                    buildingNum: 0,
                    joinTime: '',
                    resAddress: '',
                    latLng: '',
                    peopleFlowrate: 0,  //人流量
                    carNumber: 0,        // 车位数
                    carFlowrate: 0,     // 车流量
                    pmc: '',            //所属物业
                    fullViewUrl:'',     // 资源图片
                },
                activeMedia: 'first',
                mediaList: [],       // 广告门媒体
                roadGateList:[],    // 道闸媒体
                res_village: {hType: '楼盘类型', hNum: '住户数量', joinTime: '入住年份'},
                ResImgDialogVisible: false,     // 显示资源图片
                ResImgSrc: '',
                mediaImgDialogVisible: false,
                mediaImgSrc: [],
                mediaImgTitle:'',       // 当前图片的媒体名称
                roadGateImgSrc: [{mid: '', src: ''}],
                mediaImgSrcIndex: 0,
                sessionData: sessFun.getSess(),
                ConnectDoorDialogVisible: false, // 连排门Dialog
                connectAdArr: [],
                connectOptions:[],
                isUpdataConnectAD: true,
                isConnectBtn: false, // 防止多次点击
                showAllDetail: {des:true,sfs:true,tpt:true},
                judgeShowBtn:{des:false,sfs:false,tpt:false},
                AToZList:[
                    {label:'A',value:'A'},
                    {label:'B',value:'B'},
                    {label:'C',value:'C'},
                    {label:'D',value:'D'},
                    {label:'E',value:'E'},
                    {label:'F',value:'F'},
                    {label:'G',value:'G'},
                    {label:'H',value:'H'},
                    {label:'I',value:'I'},
                    {label:'J',value:'J'},
                    {label:'K',value:'K'},
                    {label:'L',value:'L'},
                    {label:'M',value:'M'},
                    {label:'N',value:'N'},
                    {label:'O',value:'O'},
                    {label:'P',value:'P'},
                    {label:'Q',value:'Q'},
                    {label:'R',value:'R'},
                    {label:'S',value:'S'},
                    {label:'T',value:'T'},
                    {label:'U',value:'U'},
                    {label:'V',value:'V'},
                    {label:'W',value:'W'},
                    {label:'X',value:'X'},
                    {label:'Y',value:'Y'},
                    {label:'Z',value:'Z'},
                ],
                selectMedia: [],
            }
        },
        mounted() {
            let nowPath = this.$route.path;
            if (nowPath.indexOf('/operate/') !== -1) {
                this.haveEdit = false
            }
            if (this.sessionData.uType === 'MD') {
                this.haveEdit = true
            } else {
                this.haveEdit = false
            }
            this.getDataFun()
            // MtaH5.clickStat('a002_b005_c000_d000_bt000_sw01')
        },
        methods: {
            // 返回
            goBack() {
                this.$router.push('./mediaList');
            },
            // 编辑
            edit(goto) {
                sessionStorage.setItem('recDetail', JSON.stringify(this.resData))
                sessionStorage.setItem('mediaList', JSON.stringify(this.mediaList))
                sessionStorage.setItem('roadGateList', JSON.stringify(this.roadGateList))
                if (goto === 'add') {
                    this.$router.push('./mediaEdit?add=true')
                } else {
                    this.$router.push('./mediaEdit')
                }
            },
            // 获取资源、媒体信息
            getDataFun() {
                this.mediaImgSrc = []
                this.resID = sessionStorage.getItem('resID')
                let params = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service": "GetResCT",
                    "data": {
                        "resid": this.resID,
                        info: 'y'
                    }
                }
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('mediaDetail', res.data) //fNum楼栋数量 dNum出入数量 hNum住户数量
                    if (res.data.SysCode == 200200) {
                        if (res.data.data === null || res.data.data === '') {
                            sessFun.messageFun('warning', '媒体资源信息为空!')
                        } else {
                            let resData = res.data.data
                            this.resData = {
                                resID: this.resID,
                                cType: '',
                                tradingArea: resData.tradingArea,
                                resName: resData.resName,
                                HouseNum: resData.hNum,
                                EntryExitNum: resData.dNum,
                                buildingNum: resData.fNum,
                                rid: resData.rID,
                                houseType: resData.cType,
                                pmc: resData.resPMC,                       // 物业公司
                                peopleFlowrate: resData.peopleFlow || 0,   // 人流量
                                carNumber: resData.parkSpaceNum || 0,      // 车位数
                                carFlowrate: resData.carFlow || 0,         // 车流量
                                fullViewUrl: resData.fullViewUrl === null ? '' : resData.fullViewUrl,
                                housePrice: (resData.hPrice / 100),
                                joinTime: resData.chDay,
                                resAddress: resData.resAddress,
                                latLng: '',
                                cityId: resData.cityId,
                                city: resData.city,
                                cityArea: resData.district,
                                // 房价网信息
                                resAlias: resData.alias,                                  // 资源别名
                                addressAlias: resData.addressAlias,                          // 地址别名
                                description: resData.description || '',                     // 描述
                                supportingFacilities: resData.supportingFacilities || '',   // 周边配套
                                buildingType: resData.buildingType || '',                   // 建筑类型
                                transportation: resData.transportation || '',               // 交通状况
                                floorSpace: resData.floorSpace || '',                       // 占地面积
                                constructionSpace: resData.constructionSpace || '',         // 建筑面积
                                buildingStructure: resData.buildingStructure || '',        // 建筑结构
                                plotRatio: resData.plotRatio || '',                         // 容积率
                                greenPercentage: resData.greenPercentage || '',             // 绿化率
                                ownershipPeriod: resData.ownershipPeriod || '',             // 产权年限
                                developer: resData.developer || '',                         // 开发商
                                managementFee: resData.managementFee || '',                 // 物业费
                                salesOfficeAdd: resData.salesOfficeAdd || '',               // 售楼地址
                                preSalePermit: resData.preSalePermit || '',                 // 预售许可证
                                ownershipType: resData.ownershipType || '',                 // 产权性质
                                salesPhoneNumber: resData.salesPhoneNumber,                  // 售楼电话
                                discount: resData.discount                                   // 折扣信息
                            }
                            if (resData.resType == '1') {
                                this.resData.cType = '社区'
                                this.res_village = {hType: '楼盘类型', hNum: '住户数量', joinTime: '入住年份'}
                            } else if (resData.resType == '2') {
                                this.resData.cType = '写字楼'
                                this.res_village = {hType: '写字楼楼盘类型', hNum: '办公室数量', joinTime: '建成年份'}
                            }
                            if (resData.latLng.includes(',')) {
                                this.resData.latLng = resData.latLng.replace(/\,/g, ';')
                            } else {
                                this.resData.latLng = resData.latLng
                            }
                            if (this.resData.description.length > 20) {
                                this.showAllDetail.des = false
                                this.judgeShowBtn.des = true
                            }
                            if (this.resData.supportingFacilities.length >= 20) {
                                this.showAllDetail.sfs = false
                                this.judgeShowBtn.sfs = true
                            }
                            if (this.resData.transportation.length > 20) {
                                this.showAllDetail.tpt = false
                                this.judgeShowBtn.tpt = true
                            }
                            console.log('this.resData', this.resData)
                        }
                    } else {
                        sessFun.messageFun('warning', '资源详情获取异常!')
                    }
                }).catch(err => {
                    sessFun.messageFun('warning', '接口异常!')
                });
                let mParams = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service": "GetMediaList",
                    "data": {
                        "resid": this.resID
                    }
                }
                api.postApi_new(this.apiVar.Media, mParams).then(res => {
                    console.log('媒体信息', res.data)
                    if (res.data.SysCode == 200200) {
                        if (res.data.data.length === 0 || res.data.data === '') {
                            sessFun.messageFun('warning', '媒体资源信息为空!')
                        } else {
                            // classified--是否执行媒体分层 1启用 2关闭
                            let MediaList = res.data.data
                            for (let i = 0; i < MediaList.length; i++) {
                                if (MediaList[i].mVehicle === '广告门') {
                                    this.mediaList.push(MediaList[i])
                                } else if (MediaList[i].mVehicle === '道闸') {
                                    this.roadGateList.push(MediaList[i])
                                    // this.roadGateImgSrc.push({mid: MediaList[i].mID, src: ''})
                                }
                            }
                        }
                        this.mediaLoading = false
                    } else {
                        sessFun.messageFun('warning', '媒体详情获取异常!')
                        this.mediaLoading = false
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 点击查看显示该资源的图片
            showResImg() {
                console.log('点击查看资源图片')
                if (this.ResImgSrc !== '') {
                    this.ResImgDialogVisible = true
                } else if (this.resData.fullViewUrl !== '' && this.resData.fullViewUrl !== undefined && this.resData.fullViewUrl !== null) {
                    this.ResImgSrc = this.resData.fullViewUrl
                    this.ResImgDialogVisible = true
                } else {
                    let uid = this.sessionData.uID
                    let params = {
                        uid: uid,
                        token: this.sessionData.token,
                        ptid: this.resID,
                        ptype: 'resType'
                    }
                    api.getApi(this.apiVar.UCAPI + '/GetImg', params).then(res => {
                        console.log('资源图片的信息', res)
                        if (res.data.length === 0) {
                            sessFun.messageFun('warning', '暂时没有该资源的图片!')
                        } else {
                            this.ResImgSrc = res.data[0].pURL
                            this.ResImgDialogVisible = true
                        }
                    }).catch(err => {
                        console.log('error', err)
                        sessFun.messageFun('warning', '获取资源图片异常!')
                    })
                }
            },
            // 点击查看显示该媒体的图片
            showMediaImg(mID) {
                sessFun.messageFun('warning', '该功能暂未开放!')
                console.log('mID', mID)
                console.log('媒体列表', this.mediaList)
                console.log('媒体图片列表', this.mediaImgSrc)
                // for(let i=0;i<this.mediaList.length;i++){
                //     if(this.mediaList[i].mID === mID){
                //         this.mediaImgTitle =  this.mediaList[i].mTitle
                //         // this.mediaImgSrc = this.mediaList[i].mImg.split(',')
                //         if (this.mediaList[i].mImg.includes(';')) {
                //             this.mediaImgSrc = this.mediaList[i].mImg.split(';')
                //         } else {
                //             this.mediaImgSrc = this.mediaList[i].mImg.split(',')
                //         }
                //         this.mediaImgDialogVisible = true
                //     }
                // }
                // console.log('媒体图片列表',this.mediaImgSrc)
            },
            // 点击查看道闸媒体图片
            showRGImg(mID) {
                sessFun.messageFun('warning', '该功能暂未开放!')
                // for(let i=0;i<this.roadGateList.length;i++){
                //     if(this.roadGateList[i].mID === mID){
                //         this.mediaImgTitle =  this.roadGateList[i].mTitle
                //         // this.mediaImgSrc = this.roadGateList[i].mImg.split(',')
                //         if (this.roadGateList[i].mImg.includes(';')) {
                //             this.mediaImgSrc = this.roadGateList[i].mImg.split(';')
                //         } else {
                //             this.mediaImgSrc = this.roadGateList[i].mImg.split(',')
                //         }
                //         this.mediaImgDialogVisible = true
                //     }
                // }
                // console.log('媒体图片列表',this.mediaImgSrc)
            },
            // 设置连排门
            connectDoorFun() {
                this.isConnectBtn = false
                if (this.isUpdataConnectAD) {
                    let arr = []
                    // 下拉选项
                    for (let key of this.mediaList) {
                        arr.push({
                            value: key.mID.toString(),
                            label: key.mTitle + '-' + key.assetTag,
                            disabled: false,
                        })
                    }
                    this.connectOptions = arr
                    console.log('connectOptions', this.connectOptions)
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        resID: this.resID
                    }
                    api.getApi(this.apiVar.Advertisement + '/GetConnRowInfo', params).then(res => {
                        this.ConnectDoorDialogVisible = true
                        this.isUpdataConnectAD = false
                        console.log('获取该资源的连排门信息', res)
                        let resArr = res.data
                        // 初始化连排门-最少一个
                        let connectAdBox = []
                        for (let Rkey of resArr) {
                            let mIDList = Rkey.mIDs.split(',')
                            connectAdBox.push({
                                connID: Rkey.connID,
                                selectMIDs: mIDList,
                                options: JSON.parse(JSON.stringify(this.connectOptions)),
                                index: connectAdBox.length
                            })
                        }
                        connectAdBox.push({
                            connID: '',
                            selectMIDs: [],
                            options: JSON.parse(JSON.stringify(this.connectOptions)),
                            index: connectAdBox.length
                        })
                        this.connectAdArr = connectAdBox
                        this.changeMedia()
                        console.log('this.connectAdArr', this.connectAdArr)

                    })
                } else {
                    this.ConnectDoorDialogVisible = true
                    console.log('********', this.isUpdataConnectAD)
                }
            },
            // 选择广告门
            changeMedia(val) {
                console.log('选择广告门-连排门', val)
                //以选择的mID
                let arr = []
                for (let key of this.connectAdArr) {
                    for (let sKey of key.selectMIDs) {
                        if (!arr.includes(sKey)) {
                            arr.push(sKey)
                        }
                    }
                }
                // console.log('arr------',arr)
                this.selectMedia = arr
                // 非当前选择的连排门下去禁用选项
                for (let key of this.connectAdArr) {
                    for (let sKey of key.options) {
                        if (arr.includes(sKey.value)) {
                            if (key.selectMIDs.includes(sKey.value)) {
                                sKey.disabled = false
                            } else {
                                sKey.disabled = true
                            }
                        } else {
                            sKey.disabled = false
                        }
                    }
                }
                console.log('connectAdArr------', this.connectAdArr)
            },
            // 增加选择行
            addRowSelect() {
                if (this.connectAdArr.length < 26) {
                    for (let key of this.connectOptions) {
                        if (this.selectMedia.includes(key.value)) {
                            key.disabled = true
                        } else {
                            key.disabled = false
                        }
                    }
                    this.connectAdArr.push({
                        connID: '',
                        selectMIDs: [],
                        options: JSON.parse(JSON.stringify(this.connectOptions)),
                        index: this.connectAdArr.length
                    })
                } else {
                    sessFun.messageFun('warning', '暂不支持更多的连排门设置!')
                }

            },
            // 删除选择行
            delRowSelect(index) {
                console.log('删除选择行', index)
                if (this.connectAdArr[index].connID !== '') {
                    this.$confirm('确认删除该连排门信息？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        showClose: false,
                        type: 'warning '
                    }).then(() => {
                        this.delConnectAdInfo(index)
                        sessFun.messageFun('success', '删除成功!')
                    }).catch(() => {
                        sessFun.messageFun('info', '已取消删除!')
                    });
                } else {
                    this.connectAdArr.splice(index, 1)
                    // 删除时解除已被选的媒体禁止选择
                    this.changeMedia()
                }
            },
            // 删除连排门信息
            delConnectAdInfo(index) {
                console.log(this.connectAdArr[index])
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    connIDs: this.connectAdArr[index].connID,
                }
                console.log('删除连排门信息params', params)
                api.postApi(this.apiVar.Advertisement + '/DeleteConnRowInfo', params).then(res => {
                    console.log('删除连排门信息', res)
                    this.connectAdArr.splice(index, 1)
                    this.changeMedia()
                    this.isUpdataConnectAD = true
                })
            },
            // 获取广告门名称及mID以构建设置连排门的数据
            setConnectAdData() {
                console.log('this.connectAdArr', this.connectAdArr)
                this.isConnectBtn = true
                let isGreaterThanOne = true
                let isConnHaveDoor = true       // 已有连排门不能为空
                let arr = []
                for (let key of this.connectAdArr) {
                    let obj = {connID: '', mIDs: ''}
                    if (key.selectMIDs.length > 1) {
                        if (key.connID) {
                            obj.connID = key.connID
                        } else {
                            delete obj.connID
                        }
                        obj.mIDs = key.selectMIDs.join(',')
                        arr.push(obj)
                    } else if (key.selectMIDs.length === 1) {
                        isGreaterThanOne = false
                    } else {
                        if (key.connID) {
                            isConnHaveDoor = false
                        }
                    }
                }
                console.log('arr---', arr)
                if (!isGreaterThanOne) {
                    this.isConnectBtn = false
                    sessFun.messageFun('warning', '同一个连排门最少需要两个广告门!')
                } else if (!arr.length) {
                    sessFun.messageFun('warning', '连排门数据不能为空!')
                    this.isConnectBtn = false
                } else if (!isConnHaveDoor) {
                    sessFun.messageFun('warning', '已存在的连排门不能为空，不需要该连排门可点击删除!')
                    this.isConnectBtn = false
                } else {
                    let connectAdloading = this.$loading({
                        lock: true,
                        text: '玩命加载中..',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    let params = {
                        resID: this.resID,
                        connRowList: arr,
                    }
                    console.log('params', params)
                    api.postApi_json(this.apiVar.Advertisement + '/SaveOrUpdateConnRowInfo?uid=' + this.sessionData.uID
                        + '&token=' + this.sessionData.token, params)
                        .then(res => {
                            console.log('设置连排门res', res)
                            this.isConnectBtn = false
                            this.isUpdataConnectAD = true
                            if (res.data.msg.includes('操作成功')) {
                                sessFun.messageFun('success', res.data.msg)
                                this.ConnectDoorDialogVisible = false
                            } else {
                                sessFun.messageFun('warning', '设置连排门失败!')
                            }
                            connectAdloading.close()
                        })
                }
            },
            showDetailFun(letter) {
                // ad_mediaInfoPanel_row_content_des showAllDetail.des = !showAllDetail.des
                if (letter === 'des') {
                    this.showAllDetail.des = !this.showAllDetail.des
                    setTimeout(() => {
                        let des = document.getElementsByClassName('ad_mediaInfoPanel_row_content_des')[0]
                        let btn = document.getElementsByClassName('showAllTextDes')[0]
                        let top = des.offsetHeight - 20
                        btn.style.top = top + "px"
                        console.log('top', top)
                    }, 10)
                } else if (letter === 'sfs') {
                    this.showAllDetail.sfs = !this.showAllDetail.sfs
                    setTimeout(() => {
                        let des = document.getElementsByClassName('ad_mediaInfoPanel_row_content_sfs')[0]
                        let btn = document.getElementsByClassName('showAllTextSfs')[0]
                        let top = des.offsetHeight - 20
                        btn.style.top = top + "px"
                        console.log('top', top)
                    }, 10)
                } else if (letter === 'tpt') {
                    this.showAllDetail.tpt = !this.showAllDetail.tpt
                    setTimeout(() => {
                        let des = document.getElementsByClassName('ad_mediaInfoPanel_row_content_tpt')[0]
                        let btn = document.getElementsByClassName('showAllTextTpt')[0]
                        let top = des.offsetHeight - 20
                        btn.style.top = top + "px"
                        console.log('top', top)
                    }, 10)
                }
            },
        },
    }
</script>

<style scoped>
    .resImg{
        max-width: 100%;
        width: auto;
        height: 550px;
    }
    /deep/ .el-dialog{
        width: 670px;
    }
    /deep/ .el-dialog__body{
        text-align: center;
    }

    /*媒体信息*/
    .ad_mediaInfo{
        width: 92%;
        background: #FFFFFF;
        border: 1px solid #E6E7E9;
        margin: 0 auto 32px;
        padding-bottom: 24px;
    }

    .ad_mediaInfo_head{
        padding: 32px 0;
        display: flex;
        flex-flow: row;
    }

    .ad_mediaInfo_head .u-title{
        display: flex;
        font-size: 20px;
        color: #2C313C;
        font-weight: bold;
        padding-left: 30px;
        margin-left: 8px;
        height: 24px;
        flex: 1;
    }
    .ad_mediaInfo_head .refresh{
        font-size:14px;
        font-weight:400;
        color:rgba(0,0,0,0.45);
        line-height:28px;
    }
    .ad_mediaInfo_head .refresh-nav{
        color: #1890FF;
        cursor: pointer;
    }
    .ad_mediaInfo_head_btn{
        width: 270px;
        padding-right: 32px;
        text-align: right;
    }
    /deep/ .ad_mediaInfo_head_btn .el-button--mini, .el-button--mini.is-round{
        width: 74px;
        padding: 0;
        text-align: center;
        line-height: 30px;
        font-size:14px;
    }
    .ad_mediaInfo .ad_mediaInfoPanel{
        font-size: 14px;
        color: #666666;
        margin: 0 32px 20px;
    }
    .ad_mediaInfoPanel h3{
        font-size: 16px;
        font-weight:600;
        color: #333333;
        padding-left: 16px;
        height: 42px;
        line-height: 42px;
        background:rgba(245,246,250,1);
    }
    .ad_mediaInfoPanel_row{
        margin-bottom: 20px;
        border-left: 1px solid rgb(245,246,250);
        border-right: 1px solid rgb(245,246,250);
        border-bottom: 1px solid rgb(245,246,250);
    }
    .row_box{
        margin: 16px 0;
        padding-left: 16px;
    }
    .ad_mediaInfoPanel_row span{
        color: #666666;
    }
    .ad_mediaInfoPanel_row .ad_mediaInfoPanel_row_title{
        color: #333333;
    }
    .ad_mediaInfoPanel_row_box{
        position: relative;
        width: 97%;
        display: flex;
    }
    .ad_mediaInfoPanel_row_title{
        width: 70px;
    }

    .ad_mediaInfoPanel_row_content {
        flex: 1;
        display: -webkit-box;
        text-overflow:ellipsis;/*文本溢出时显示省略标记*/
        -webkit-line-clamp: 2;
        overflow: hidden;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        /* autoprefixer: on */
        display: -moz-box;
        -moz-line-clamp: 2;
        max-height: 40px;
    }
    .show_all_aetail .ad_mediaInfoPanel_row_content{
        display: inherit;
        word-break: break-all;
        max-height: none;
        padding: 0 16px 0 0;
    }
    .ad_mediaInfoPanel_row .showAllText{
        position: absolute;
        right: 0;
        top: 18px;
        font-size: 14px;
        background: #fff;
    }
    /*广告*/
    .ad_ad{
        padding-bottom: 30px;
        background: #FFFFFF;
        border: 1px solid #E6E7E9;
        margin: 0 32px 32px;
        position: relative;
    }
    /deep/ .ad_ad .el-tabs__header{
        padding: 0 32px;
        border-bottom: 1px solid #e4e7ed;
    }
    /deep/ .ad_ad .el-tabs__nav-wrap::after{
        width: 0;
    }
    /deep/ .ad_ad .el-tabs__item{
        font-size: 16px;
        color: #666666;
    }
    /deep/ .ad_ad .el-tabs__item.is-active{
        color: #1890FF;
    }

    .ad_ad .table_wrap{
        border-radius: 4px;
        margin: 10px auto 0;
        padding: 0 32px;
    }

    /*按钮*/
    .content_bottom_btn{
        text-align: center;
    }

    /*表格高亮*/
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #ecf5ff;
    }

    .mediaImg img{
        width: auto;
        height: 100%;
    }

    /*连排门按钮*/
    .connect_door{
        position: absolute;
        right: 32px;
        top: 8px;
        z-index: 99;
    }
    .connect_door_btn{
        font-size:14px;
        font-weight:400;
        color:rgba(24,144,255,1);
        cursor: pointer;
    }
    .connect_door_li{
        margin-bottom: 16px;
    }
    .connect_door_li > i{
        color: rgba(255,0,0,0.85);
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
    }
    .connect_door_h4{
        width: 60.5px;
        display: inline-block;
        font-weight:400;
        color:rgba(0,0,0,0.85);
        line-height: 22px;
        margin-bottom: 8px;
    }
    .add_row_btn{
        width: 398px;
        height: 30px;
        border-radius:4px;
        border:1px dashed rgba(24,144,255,1);
        color: rgba(24,144,255,1);
        cursor: pointer;
        text-align: center;
        line-height: 32px;
        margin-left: 65px;
    }

    /deep/ .el-dialog.connectAD{
        width: 535px;
    }

    /deep/ .connectAD .el-dialog__body{
        text-align: left;
        max-height: 218px;
        overflow-y: auto;
        padding: 8px 20px;
    }

    /deep/ .connectAD .el-select.el-select--small{
        width: 400px;
        margin-right: 5px;
    }

    /deep/ .el-dialog.connectAD .el-dialog__body::-webkit-scrollbar{
        width: 4px;
        background: #FAFAFA;
    }

    /deep/ .el-dialog.connectAD .el-dialog__body::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }

    /deep/ .ad_ad .el-table__body-wrapper{
        min-height: auto;
    }

    /*tag标签样式覆盖*/
    /deep/ .el-select .el-tag{
        background:rgba(245,245,245,1);
        border-radius:4px;
        border:1px solid rgba(217,217,217,1);
        color:rgba(0,0,0,0.65);
    }

    /deep/ .el-select .el-tag__close.el-icon-close{
        color:rgba(0,0,0,0.65);
        background: rgba(0,0,0,0);
        font-size: 16px;
        right: -4px;
        line-height: 14px;
    }
</style>
