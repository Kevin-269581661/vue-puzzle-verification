<template>
    <div class="mediaDetail">
        <div class="ad_mediaDetail_wrap clearfix">
            <div class="ad_mediaDetail_nav">
                <p><a href="#">媒体管理</a><em> / </em><a href="#">媒体详情</a></p>
            </div>
            <!--媒体信息-->
            <div class="ad_mediaInfo">
                <div class="ad_mediaInfo_head">
                    <h2>{{resData.resName}}</h2>
                    <div class="ad_mediaInfo_head_btn">
                        <el-button size="mini" style="color:rgba(0,0,0,0.65)" @click="showResImg" >小区全貌</el-button>
                        <el-button type="primary" @click="edit" v-if="haveEdit" size="mini">编辑</el-button>
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
                                <span class="ad_mediaInfoPanel_row_title">资源别名：</span><span>{{resData.resAlias}}</span>
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
                                <span class="ad_mediaInfoPanel_row_title">地址别名：</span><span>{{resData.addressAlias ||  '--'}}</span>
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
                                <span class="ad_mediaInfoPanel_row_title">出入口数：</span><span>{{resData.EntryExitNum}}</span>
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
                                <span class="ad_mediaInfoPanel_row_title">物业公司：</span><span>{{resData.propertyManagement || resData.pmc}}</span>
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
                    <el-tabs v-model="activeMedia">
                        <el-tab-pane label="广告门" name="first">
                            <div class="ad_adPanel">
                                <div>
                                    <el-button  size="small" type="primary" class="ad_adPanelBtn"
                                                v-if="haveEdit" @click="connectDoorFun">设置连排门</el-button>
                                    <el-button size="small" type="primary" class="ad_adPanel_add"
                                               @click="edit('add')">添加媒体</el-button>
                                </div>
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
                                            min-width="7%" >
                                            <template slot-scope="scope">
                                                {{scope.row.mState == 1 ? '正常' : scope.row.mState == 2 ? '待安装' : scope.row.mState == 0 ? '禁用' : '待维修'}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="资产编号"
                                            min-width="10.2%">
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
                                            class="tar">
                                            <template slot-scope="scope">
                                                <!-- {{ scope.row.notPush || '&#45;&#45;' }}-->
                                                <el-tooltip v-if="scope.row.notPush" class="item" effect="dark" :content="scope.row.notPush"
                                                            placement="bottom">
                                                    <span>{{ scope.row.notPush}}</span>
                                                </el-tooltip>
                                                <span v-else>{{ scope.row.notPush || '--' }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="备注"
                                            min-width="12%">
                                            <template slot-scope="scope">
                                                {{ scope.row.mRemark || '--' }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="门禁图片"
                                            min-width="6%">
                                            <template slot-scope="scope">
                                                <div style="color: #108EE9;cursor: pointer;" @click="showMediaImg(scope.row.mID)">查看</div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="道闸" name="second">
                            <div class="ad_adPanel">
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
                                                {{scope.row.mState == 1 ? '正常' : scope.row.mState == 2 ? '待安装' : scope.row.mState == 0 ? '禁用' : '待维修'}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="资产编号"
                                            min-width="163"
                                        >
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
                                        >
                                            <template slot-scope="scope">
                                                {{ scope.row.notPush || '--' }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="备注"
                                            min-width="196"
                                        >
                                            <template slot-scope="scope">
                                                <div class="tableRemark">
                                                    {{ scope.row.mRemark || '--' }}
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="门禁图片"
                                            min-width="100"
                                        >
                                            <template slot-scope="scope">
                                                <div style="color: #108EE9;cursor: pointer;" @click="showRGImg(scope.row.mID)">查看</div>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="content_bottom_btn">
                    <el-button type="default" @click="goBack">返回</el-button>
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
        <!--连排门模态框-->
        <el-dialog :visible.sync="ConnectDoorDialogVisible" title="连排门设置" custom-class="connectAD">
            <div class="" v-for="(optionArr,index) in connectAdBox" :key="index" style="margin-bottom: 10px">
                <el-select v-model="selectAdName[index].mIDs.val0" size="small" placeholder="请选择"  @change="changefirst(optionArr.num0,index,0)">
                    <el-option
                        v-for="item in optionArr.num0"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="selectAdName[index].mIDs.val1" size="small" placeholder="请选择" @change="changefirst(optionArr.num1,index,1)">
                    <el-option
                        v-for="item in optionArr.num1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="selectAdName[index].mIDs.val2" size="small" placeholder="请选择"  @change="changefirst(optionArr.num2,index,2)">
                    <el-option
                        v-for="item in optionArr.num2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="selectAdName[index].mIDs.val3" size="small" placeholder="请选择"  @change="changefirst(optionArr.num3,index,3)">
                    <el-option
                        v-for="item in optionArr.num3"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <i v-if="index === 0" class="el-icon-circle-plus-outline" style="font-size: 22px;color: #108DE7;cursor: pointer" @click="addRowSelect"></i>
                <i v-else class="el-icon-delete" style="font-size: 22px;color: #108DE7;cursor: pointer" @click="delRowSelect(index)"></i>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="ConnectDoorDialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="setConnectAdData" :disabled="isConnectBtn">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../api/api'
    import areaToText_new from '../../commonFun/areaToText_new'
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
                connectAdBox:[
                    {
                        num0:[],
                        num1:[],
                        num2:[],
                        num3:[]
                    },
                ],
                ConnectAdArr: [],
                selectAdName:[{connID:'',mIDs: {val0:'',val1:'',val2:'',val3:''}}],    // 当前选择的媒体名称
                isUpdataConnectAD: true,
                isConnectBtn: false, // 防止多次点击
                showAllDetail: {des:true,sfs:true,tpt:true},
                judgeShowBtn:{des:false,sfs:false,tpt:false}
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
                if(goto === 'add'){
                    this.$router.push('./mediaEdit?add=true')
                }else{
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
                    "service":"GetResCT",
                    "data": {
                        "resid": this.resID,
                        info: 'y'
                    }
                }
                api.postApi_new(this.apiVar.Media, params ).then(res => {
                    console.log('mediaDetail', res.data) //fNum楼栋数量 dNum出入数量 hNum住户数量
                    if(res.data.SysCode == 200200){
                        if (res.data.data === null || res.data.data === '') {
                            Message({
                                type: 'warning',
                                message: '媒体资源信息为空'
                            })
                        } else {
                            let resData = res.data.data
                            let cityArea = areaToText_new.toTextCityArea(resData.rID)
                            this.resData = {
                                resID:this.resID,
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
                                fullViewUrl: resData.fullViewUrl === null ?  '' : resData.fullViewUrl,
                                housePrice: (resData.hPrice / 100),
                                joinTime: resData.chDay,
                                resAddress: resData.resAddress,
                                latLng: '',
                                city: cityArea.city,
                                cityArea: cityArea.area,
                                // 房价网信息
                                resAlias: resData.alias,                                  // 资源别名
                                addressAlias: resData.addressAlias,                          // 地址别名
                                description: resData.description || '',                     // 描述
                                supportingFacilities: resData.supportingFacilities || '',   // 周边配套
                                buildingType: resData.buildingType || '',                   // 建筑类型
                                transportation: resData.transportation || '',               // 交通状况
                                floorSpace: resData.floorSpace || '',                       // 占地面积
                                constructionSpace: resData.constructionSpace || '',         // 建筑面积
                                buildingStructure : resData.buildingStructure || '',        // 建筑结构
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
                            if(this.resData.description.length > 20){
                                this.showAllDetail.des = false
                                this.judgeShowBtn.des = true
                            }
                            if(this.resData.supportingFacilities.length >= 20){
                                this.showAllDetail.sfs = false
                                this.judgeShowBtn.sfs = true
                            }
                            if(this.resData.transportation.length > 20){
                                this.showAllDetail.tpt = false
                                this.judgeShowBtn.tpt = true
                            }
                            console.log('this.resData', this.resData)
                        }
                    } else if (res.data.SysCode == 100302){
                        this.loginTimeout()
                    } else {
                        Message({
                            type: 'warning',
                            message: '资源详情获取异常'
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
                let mParams = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service":"GetMediaList",
                    "data": {
                        "resid": this.resID
                    }
                }
                api.postApi_new(this.apiVar.Media, mParams).then(res => {
                    console.log('媒体信息', res.data)
                    if(res.data.SysCode == 200200){
                        if (res.data.data.length === 0 || res.data.data === '') {
                            Message({
                                type: 'warning',
                                message: '媒体资源信息为空'
                            })
                        }else{
                            // classified--是否执行媒体分层 1启用 2关闭
                            let MediaList = res.data.data
                            for (let i = 0; i < MediaList.length; i++) {
                                if(MediaList[i].mVehicle === '广告门'){
                                    this.mediaList.push(MediaList[i])
                                }else if(MediaList[i].mVehicle === '道闸'){
                                    this.roadGateList.push(MediaList[i])
                                    // this.roadGateImgSrc.push({mid: MediaList[i].mID, src: ''})
                                }
                            }
                        }
                        this.mediaLoading = false
                    }else if (res.data.SysCode == 100302){
                        this.loginTimeout()
                    }else{
                        Message({
                            type: 'warning',
                            message: '媒体详情获取异常'
                        });
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
                } else if(this.resData.fullViewUrl !== '' && this.resData.fullViewUrl !== undefined && this.resData.fullViewUrl !== null ) {
                    this.ResImgSrc = this.resData.fullViewUrl
                    this.ResImgDialogVisible = true
                }else {
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
                            this.$message({
                                message: '暂时没有该资源的图片！',
                                type: 'warning'
                            })
                        } else {
                            this.ResImgSrc = res.data[0].pURL
                            this.ResImgDialogVisible = true
                        }
                    }).catch(err => {
                        console.log('error', err)
                        this.$message({
                            message: '获取资源图片异常',
                            type: 'warning'
                        })
                    })
                }
            },
            // 点击查看显示该媒体的图片
            showMediaImg(mID) {
                this.$message.warning('该功能暂未开放！');
                console.log('mID',mID)
                console.log('媒体列表',this.mediaList)
                console.log('媒体图片列表',this.mediaImgSrc)
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
            showRGImg(mID){
                this.$message.warning('该功能暂未开放！');
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
            connectDoorFun(){
                console.log(this.ConnectAdArr)
                this.isConnectBtn = false
                if(this.isUpdataConnectAD){
                    this.selectAdName = [{connID:'',mIDs: {val0:'',val1:'',val2:'',val3:''}}]
                    this.connectAdBox = [ {num0:[],num1:[],num2:[],num3:[]},]
                    let arr = []
                    for(let key of this.mediaList){
                        arr.push({
                            value: key.mID,
                            label: key.mTitle +'-'+ key.assetTag
                        })
                    }
                    this.ConnectAdArr = arr
                    this.connectAdBox[0].num0 = arr
                    console.log( this.connectAdBox,'arr',arr)
                    let params ={
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        resID: this.resID
                    }
                    api.getApi(this.apiVar.Advertisement + '/GetConnRowInfo',params).then(res=>{
                        this.ConnectDoorDialogVisible = true
                        this.isUpdataConnectAD = false
                        console.log('获取该资源的连排门信息',res)
                        let resArr = res.data
                        for(let Rkey of resArr){
                            let mIDList = Rkey.mIDs.split(',')
                            let connectAdObj = {connID:'',mIDs:{}}
                            let selectConnectAdObj = {}
                            connectAdObj.connID = Rkey.connID
                            arr = this.ConnectAdArr
                            for (let i = 0; i < 4; i++) {
                                connectAdObj.mIDs['val' + i] = Number(mIDList[i]) || ''
                                if(i === 0){
                                    selectConnectAdObj['num'+ i] = this.ConnectAdArr
                                }else{
                                    let optionArr = []
                                    if(mIDList[i-1]){
                                        for (let key of  arr) {
                                            if(key.value != mIDList[i-1]){
                                                optionArr.push(key)
                                            }else{
                                                // console.log('1111+++++++++')
                                            }
                                        }
                                    }
                                    arr = optionArr
                                    selectConnectAdObj['num'+ i] = optionArr
                                }
                            }
                            console.log('connectAdObj',connectAdObj,'selectConnectAdObj',selectConnectAdObj)
                            this.selectAdName.push(connectAdObj)
                            this.connectAdBox.push(selectConnectAdObj)
                        }
                    })
                }else{
                    this.ConnectDoorDialogVisible = true
                    console.log('********',this.isUpdataConnectAD)
                }
            },
            // select
            changefirst(arr,rowIndex,index){
                console.log('arr',arr,'index',index)
                let optionArr = []
                let val = ''
                switch (index){
                    case 0:
                        val = this.selectAdName[rowIndex].mIDs.val0
                        this.selectAdName[rowIndex].mIDs.val1 = ''
                        this.selectAdName[rowIndex].mIDs.val2 = ''
                        this.selectAdName[rowIndex].mIDs.val3 = ''
                        break;
                    case 1:
                        val = this.selectAdName[rowIndex].mIDs.val1
                        this.selectAdName[rowIndex].mIDs.val2 = ''
                        this.selectAdName[rowIndex].mIDs.val3 = ''
                        break;
                    case 2:
                        val = this.selectAdName[rowIndex].mIDs.val2
                        this.selectAdName[rowIndex].mIDs.val3 = ''
                        break;
                    case 3:
                        val = this.selectAdName[rowIndex].mIDs.val3
                        break;
                    default: console.log('default')
                }
                // console.log('val', val)
                for (let key of arr) {
                    if (key.value !== val) {
                        optionArr.push(key)
                    }
                }
                console.log('optionArr',optionArr,'this.selectAdName',this.selectAdName)
                this.connectAdBox[rowIndex]['num' + (index + 1)] = optionArr
            },
            // 增加选择行
            addRowSelect(){
                this.connectAdBox.unshift({
                    num0: this.ConnectAdArr,
                    num1:[],
                    num2:[],
                    num3:[],
                })
                this.selectAdName.unshift({connID:'',mIDs:{val0:'',val1:'',val2:'',val3:''}})
            },
            // 删除选择行
            delRowSelect(index){
                console.log('删除选择行',this.selectAdName[index])
                if(this.selectAdName[index].connID !== ''){
                    this.$confirm('确认删除该连排门信息？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        showClose: false,
                        type: 'warning '
                    }).then(() => {
                        this.delConnectAdInfo(index)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }else{
                    this.connectAdBox.splice(index,1)
                    this.selectAdName.splice(index,1)
                }
            },
            // 删除连排门信息
            delConnectAdInfo(index){
                console.log(this.selectAdName[index])
                let params ={
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    connIDs: this.selectAdName[index].connID,
                }
                console.log('删除连排门信息params',params)
                api.postApi(this.apiVar.Advertisement + '/DeleteConnRowInfo',params).then(res=>{
                    console.log('删除连排门信息',res)
                    this.connectAdBox.splice(index,1)
                    this.selectAdName.splice(index,1)
                    this.isUpdataConnectAD = true
                })
            },
            // 获取广告门名称及mID以构建设置连排门的数据
            setConnectAdData(){
                console.log('this.selectAdName',this.selectAdName)
                this.isConnectBtn = true
                let arr = []
                let judgeMIDDiff = []    // 把所有的mid都放到一个数组里，然后判断长度是否大于一，是否有重复的mid
                let isGreaterThanOne = true
                for(let Akey of this.selectAdName){
                    let obj = {connID:'',mIDs:''}
                    for (let key in Akey) {
                        console.log('key', key, Akey[key])
                        if (key === 'mIDs') {
                            let rowMIDNum = 0 // 判断行数据是否大于1
                            for (let mkey in Akey[key]) {
                                if (Akey[key][mkey] !== '') {
                                    rowMIDNum++
                                    judgeMIDDiff.push(Akey[key][mkey])

                                    if (obj.mIDs === '') {
                                        obj.mIDs = Akey[key][mkey]
                                    } else {
                                        obj.mIDs += ',' + Akey[key][mkey]
                                    }
                                } else {

                                }
                            }
                            console.log('rowMIDNum',rowMIDNum)
                            if(rowMIDNum === 1){
                                isGreaterThanOne = false
                                break
                            }
                        } else {
                            obj.connID = Akey[key]
                        }
                    }
                    if (obj.connID === '') {
                        delete obj.connID
                    }
                    if (obj.mIDs !== '') {
                        arr.push(obj)
                    }
                }
                let isHaveCommentMID = false
                let hash = {};  // 判断数组是否有重复元素
                for (let i in judgeMIDDiff) {
                    if (hash[judgeMIDDiff[i]]) {
                        isHaveCommentMID = true
                        break
                    }
                    hash[judgeMIDDiff[i]] = true
                }
                console.log('arr', arr, 'judgeMIDDiff', judgeMIDDiff)
                if (!isGreaterThanOne) {
                    this.$message.warning('同一个连排门最少需要两个广告门')
                    this.isConnectBtn = false
                } else if (isHaveCommentMID) {
                    this.$message.warning('同一广告门不能同时存在于两个连排门中')
                    this.isConnectBtn = false
                } else if (arr.length === 0) {
                    this.isConnectBtn = false
                    this.$message.warning('连排门数据不能为空')
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
                    console.log('params',params)
                    api.postApi_json(this.apiVar.Advertisement + '/SaveOrUpdateConnRowInfo?uid='+ this.sessionData.uID +'&token='+ this.sessionData.token, params)
                        .then(res => {
                            console.log('设置连排门res', res)
                            this.isConnectBtn = false
                            this.isUpdataConnectAD = true
                            if(res.data.msg.includes('操作成功')){
                                this.$message.success(res.data.msg)
                                this.ConnectDoorDialogVisible = false
                            } else {
                                this.$message.warning('设置连排门失败')
                            }
                            connectAdloading.close()
                        })
                }
            },
            showDetailFun(letter){
                // ad_mediaInfoPanel_row_content_des showAllDetail.des = !showAllDetail.des
                if(letter === 'des'){
                    this.showAllDetail.des = !this.showAllDetail.des
                    setTimeout(()=>{
                        let des = document.getElementsByClassName('ad_mediaInfoPanel_row_content_des')[0]
                        let btn = document.getElementsByClassName('showAllTextDes')[0]
                        let top = des.offsetHeight - 20
                        btn.style.top = top + "px"
                        console.log('top',top)
                    },10)
                }else if(letter === 'sfs'){
                    this.showAllDetail.sfs = !this.showAllDetail.sfs
                    setTimeout(()=>{
                        let des = document.getElementsByClassName('ad_mediaInfoPanel_row_content_sfs')[0]
                        let btn = document.getElementsByClassName('showAllTextSfs')[0]
                        let top = des.offsetHeight - 20
                        btn.style.top = top + "px"
                        console.log('top',top)
                    },10)
                }else if(letter === 'tpt'){
                    this.showAllDetail.tpt = !this.showAllDetail.tpt
                    setTimeout(()=>{
                        let des = document.getElementsByClassName('ad_mediaInfoPanel_row_content_tpt')[0]
                        let btn = document.getElementsByClassName('showAllTextTpt')[0]
                        let top = des.offsetHeight - 20
                        btn.style.top = top + "px"
                        console.log('top',top)
                    },10)
                }
            },
            // 登录超时
            loginTimeout() {
                this.$message({
                    message: '登录超时或权限异常,请重新登录',
                    type: 'warning'
                })
                this.$router.push('/login')
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

    .ad_mediaInfo_head h2{
        font-size: 20px;
        color: #2C313C;
        font-weight: bold;
        padding-left: 30px;
        height: 24px;
        flex: 1;
    }
    .ad_mediaInfo_head_btn{
        width: 180px;
        padding-right: 20px;
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
        /*left: 227px;*/
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
    .ad_ad .ad_adHeader{
        width: 100%;
        height: 24px;
        border-bottom: 1px solid #DEDEDE;
        padding: 12px 0;
    }
    .ad_ad .ad_adHeader .ad_tab{
        padding-left: 16px;
        height: 24px;
    }
    .ad_ad .ad_adHeader .ad_tab .curr_ad{
        color:#108DE7 ;
        border-bottom: 3px solid #108DE7;
    }

    .ad_ad .ad_adHeader .ad_tab li{
        float: left;
        height: 33px;
        line-height: 24px;
        font-size: 16px;
        color: #999999;
        cursor: pointer;

    }

    .ad_adPanelBtn{
        margin-left: 32px;
    }

    /*   .ad_adPanel_add{
           font-size: 14px;
       }*/

    .ad_ad .ad_adPanel .table_wrap{
        border-radius: 4px;
        margin: 10px auto 0;
        padding: 0 32px;
    }

    .ad_ad .ad_adPanel .adPanel_table{
        /*去掉间距*/
        height: 40px;
        line-height: 40px;
        text-align: center;
        width:1210px;
        font-size: 14px;
        color: #666666;
        margin: 0 auto;
        border-radius: 4px;
        /*允许设置列宽*/
        table-layout: fixed;
    }

    .ad_ad .ad_adPanel .adPanel_table th{
        background-color: #f8f8f8;
        border-bottom: 1px solid #E2E2E2;
        border-right: 1px solid #E2E2E2;
        font-size: 14px;
        color: #666666;
        font-weight: bold;
        text-indent: 14px;
        box-sizing: border-box;
    }
    .ad_ad .ad_adPanel .adPanel_table td{
        border-right: 1px solid #E2E2E2;
        text-indent: 14px;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-bottom: 1px solid #E2E2E2;
    }
    .ad_ad .ad_adPanel .adPanel_table tr:last-child td{
        border-bottom:  none;
    }

    .ad_ad .ad_adPanel .adPanel_table td .dot{
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #FE7A38;
        margin-right: 6px;
    }

    /*按钮*/
    .content_bottom_btn{
        text-align: center;
    }
    /*表格高亮*/
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #ecf5ff;
    }
    .ad_index_footer{
        bottom: -140px;
    }
    .tableRemark{
        max-height: 68px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .tableRemark::-webkit-scrollbar {
        width: 4px;
        background: #FAFAFA;
    }
    .tableRemark::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }
    .mediaImg img{
        width: auto;
        height: 100%;
    }
    /deep/ .el-dialog__header{
        text-align: center;
    }
    /deep/ .el-dialog.connectAD{
        width: 680px;
    }
    /deep/ .connectAD .el-dialog__body{
        text-align: left;
        max-height: 200px;
        overflow-y: auto;
        padding: 15px 20px 10px;
    }
    /deep/ .connectAD .el-select.el-select--small{
        width: 140px;
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
</style>
