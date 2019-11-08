<template>
    <div class="map_index">
<!--        <remote-js src="https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js"></remote-js>-->
        <remote-js src="https://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js"></remote-js>
        <remote-js src="https://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js"></remote-js>
        <!--地图标签-->
        <div v-loading="mapLoading"
             element-loading-text="玩命加载中.."
             element-loading-spinner="el-icon-loading"
             id="qinlinMap" ref="qinlinMap">
        </div>
        <!--左侧搜索-->
        <div class="left_search_box">
            <el-input placeholder="请输入内容" v-model="selectName" v-show="!isOnlineSearch && !isMouseSearch && !isMultiPoint"
                      @keydown.native="searchDown($event)"
                      class="input-with-select"
                      clearable
                      @clear="clearInputSearch"
                      size="small">
                <el-select v-model="activeSearchKind" slot="prepend" placeholder="请选择">
                    <el-option
                        v-for="item in selOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <i slot="suffix" class="el-input__icon el-icon-search" @click="searchFun"></i>
            </el-input>
            <div class="search_body" v-show="(searchResList.length && activeSearchKind == '1') || isOnlineSearch">
                <div class="search_result_btn" v-show="isOnlineSearch || isMouseSearch || isMultiPoint">
                    <h4 class="result_title">框选结果</h4>
                    <div class="result_btn_box">
                        <span @click="setOnlineSearch" v-show="!isMouseSearch">设置</span>
                        <span @click="clearSearch">取消</span>
                    </div>
                </div>
                <ul class="search_ul">
                    <li class="search_li" v-for="(item,index) in searchResList" :key="index">
                        <p class="li_name">
                            {{item.resName}}
                            <span class="li_name_span" :class="item.isSelect ? 'li_name_span_active' : ''" @click="checkBoxFun(item)">
                                <i v-show="item.isSelect" class="el-icon-minus"></i>
                                <i v-show="!item.isSelect" class="el-icon-plus"></i>
                                {{item.isSelect ? '取消' : '添加'}}
                            </span>
                        </p>
                        <p class="li_address">{{item.resAddress || '--'}}</p>
                        <p>
                            <span class="li_p_span">{{item.districtName}}</span>
                            <span class="li_p_span">{{item.hNum || '--'}}户</span>
                            <span class="li_p_span">&yen;{{item.hPrice / 100}}/m<sup>2</sup></span>
                            <span class="li_p_span" style="margin-right: 0">{{item.chDay}}年</span>
                        </p>
                    </li>
                </ul>
                <div class="search_bottom_btn">
                    <el-button plain size="small" @click="selectAllFun">添加全部</el-button>
                </div>
            </div>
            <div class="search_body" v-show="(activeSearchKind == '2' && !isOnlineSearch) && (searchOnlineLoading || searchOnlineList.length)"
                 v-loading="searchOnlineLoading"
                 element-loading-text="玩命加载中.."
                 element-loading-spinner="el-icon-loading">
                <ul class="search_ul">
                    <li class="search_li" v-for="(item,index) in searchOnlineList" :key="index">
                        <p class="li_name li_name_online">
                            {{item.title}}
                            <el-checkbox v-model="item.isSelect" @change="onlineCheckBox(item)"></el-checkbox>
                        </p>
                        <p class="li_address">{{item.address}}</p>
                    </li>
                </ul>
                <div class="search_bottom_btn">
                    <el-checkbox v-model="isAllSelectOnline" @change="onlineSelectAll()" :disabled="isActiveASOL"></el-checkbox>
                    <span class="online_search_span"> 全选<span style="color:#1890FF"> {{searchOnlineList.length}}</span> 个</span>
                    <el-button plain size="small" class="online_search_btn" @click="canceAllOnline">取消</el-button>
                    <el-button size="small" type="primary" class="online_search_btn" @click="onlineConfirm">确定</el-button>
                </div>
            </div>
        </div>
        <!--顶部过滤条件-->
        <div class="top_filter_box">
            <!--区域-->
            <el-select v-model="selectArea" size="small" placeholder="请选择"
                       collapse-tags
                       multiple
                       clearable
                       @change="filterArea">
                <el-option
                    v-for="item in areaList"
                    :key="item.rID"
                    :label="item.rName"
                    :value="item.rID">
                </el-option>
            </el-select>
            <!--楼盘类型-->
            <el-select v-model="bType" size="small" placeholder="楼盘类型" clearable @change="filterBuildType">
                <el-option v-for="item in buildTypeList" :key="item.buildValue"
                           :label="item.buildValue"
                           :value="item.buildValue">
                </el-option>
            </el-select>
            <!--楼盘价格-->
            <el-popover
                placement="bottom-start"
                width="150"
                trigger="click"
                v-model="popoverShow.bPrice"
                popper-class="filter-popper">
                <div class="popover_body">
                    <ul class="filter_ul">
                       <li v-for="key of priceList" @click="selectNum(key,'price')">{{key}}</li>
                    </ul>
                    <div class="input_wrap">
                        <input type="text" class="filter_input" v-model="buildPrice[0]">
                        -
                        <input type="text" class="filter_input" v-model="buildPrice[1]">
                    </div>
                    <div class="popover_footer_btn">
                        <el-button plain @click="emptyFun('bPrice')" class="popover_btn">清 除</el-button>
                        <el-button type="primary" class="popover_btn" @click="filterBuildPrice()" >确 定</el-button>
                    </div>
                </div>
                <el-button plain slot="reference" class="otherBtn top_btn" :class="filterData.bPrice ? 'filter_btn' : ''">
                    {{filterData.bPrice ? ('¥' + buildPrice[0] + '-¥' + buildPrice[1]) : '楼盘价格'}}
                    <i class="el-icon-arrow-down icon_arrow" v-show="!popoverShow.bPrice"></i>
                    <i class="el-icon-arrow-up icon_arrow" v-show="popoverShow.bPrice"></i>
                </el-button>
            </el-popover>
            <!--住户数量-->
            <el-popover
                placement="bottom-start"
                width="150"
                trigger="click"
                v-model="popoverShow.hNum"
                popper-class="filter-popper">
                <div class="popover_body">
                    <ul class="filter_ul">
                        <li v-for="key of houseList" @click="selectNum(key,'house')">{{key}}</li>
                    </ul>
                    <div class="input_wrap">
                        <input type="text" class="filter_input" v-model="houseNum[0]">
                        -
                        <input type="text" class="filter_input" v-model="houseNum[1]">
                    </div>
                    <div class="popover_footer_btn">
                        <el-button plain @click="emptyFun('house')" class="popover_btn">清 除</el-button>
                        <el-button type="primary" class="popover_btn" @click="filterHouseNum()" >确 定</el-button>
                    </div>
                </div>
                <el-button plain slot="reference" class="otherBtn top_btn" :class="filterData.hNum ? 'filter_btn' : ''">
                    {{filterData.hNum ? (houseNum[0] + '户-' + houseNum[1]) + '户' : '住户数量'}}
                    <i class="el-icon-arrow-down icon_arrow" v-show="!popoverShow.hNum"></i>
                    <i class="el-icon-arrow-up icon_arrow" v-show="popoverShow.hNum"></i>
                </el-button>
            </el-popover>
            <!--入住年份-->
            <el-popover
                placement="bottom-start"
                width="150"
                trigger="click"
                v-model="popoverShow.lYear"
                popper-class="filter-popper">
                <div class="popover_body">
                    <ul class="filter_ul">
                        <li v-for="key of liveYearList" @click="selectNum(key,'year')">{{key}}</li>
                    </ul>
                    <div class="input_wrap">
                        <input type="text" class="filter_input" v-model="liveYear[0]">
                        -
                        <input type="text" class="filter_input" v-model="liveYear[1]">
                    </div>
                    <div class="popover_footer_btn">
                        <el-button plain @click="emptyFun('liveYear')" class="popover_btn">清 除 </el-button>
                        <el-button type="primary" class="popover_btn" @click="filterLiveYear()" >
                            确 定
                        </el-button>
                    </div>
                </div>
                <el-button plain slot="reference" class="otherBtn top_btn" :class="filterData.lYear ? 'filter_btn' : ''">
                    {{filterData.lYear ? (liveYear[0] + '-' + liveYear[1]) : '入住年份'}}
                    <i class="el-icon-arrow-down icon_arrow" v-show="!popoverShow.lYear"></i>
                    <i class="el-icon-arrow-up icon_arrow" v-show="popoverShow.lYear"></i>
                </el-button>
            </el-popover>
            <!--广告限制-->
            <el-select placeholder="广告限制" size="small" multiple v-show="showMore"
                       collapse-tags
                       v-model="selectLimits"
                       @change="filterADLimit">
                <el-option
                    v-for="item in ADLimit"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!--所在商圈-->
            <el-select placeholder="所在商圈" size="small"v-model="selectTradingArea" v-show="showMore"
                       @change="filterTradingArea">
                <el-option
                    v-for="item in tradingAreaList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!--媒体类型-->
            <el-select placeholder="媒体类型" size="small" v-model="selectDoorType" v-show="showMore"
                       @change="filterDoorType">
                <el-option
                    v-for="item in doorTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!--媒介载体-->
            <el-select placeholder="媒介载体" size="small" v-model="selectMediaType"v-show="showMore"
                       @change="filterMediaType">
                <el-option label="广告门" value="广告门"></el-option>
                <el-option label="道闸" value="道闸"></el-option>
            </el-select>
            <!--媒体等级-->
            <el-select placeholder="媒体等级" size="small" v-model="selectMediaLevel" v-show="showMore"
                       @change="filterMediaLevel">
                <el-option label="A级" value="A"></el-option>
                <el-option label="B级" value="B"></el-option>
                <el-option label="C级" value="C"></el-option>
            </el-select>
            <el-button size="small" plain @click="showMore = !showMore" class="top_filter_btn">
                {{showMore ? '收起' : '更多'}}
                <i :class="showMore ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right'"></i>
            </el-button>
            <el-button size="small" plain @click="clearFilter" class="top_filter_btn">清空条件</el-button>
        </div>
        <!--底部左侧选中-->
        <div class="bottom_left_active">
            <div class="bottom_left_header">
                <span class="active_num">
                    已添加<span style="color:rgba(24, 144, 255, 1)"> {{selectResList.length}} </span>个资源
                </span>
                <span class="active_arrow" :class="showSelectList ? '' : 'active_arrow_hide'" @click="showSelectList = !showSelectList">
                    <i class="el-icon-d-arrow-left"></i>
                    {{showSelectList ? '收起' : '展开'}}
                </span>
            </div>
            <ul class="active_ul" v-show="showSelectList">
                <li class="active_li" v-for="(item,index) in selectResList" :key="index">
                    <p class="active_li_resName">{{item.resName}}</p>
                    <i class="el-icon-delete" @click="deleteRes(item)"></i>
                </li>
            </ul>
            <div class="active_bottom_btn">
                <span @click="resShare" v-if="isCommit"><i class="el-icon-share"></i>分享</span>
                <span @click="exportExcel"><i class="el-icon-download"></i>下载</span>
                <span @click="deleteAll"><i class="el-icon-delete"></i>清空</span>
                <el-button type="primary" size="small" @click="pushMapRes" v-if="isCommit">选定</el-button>
            </div>
        </div>
        <!--底部右侧鼠标绘制-->
        <div class="bottom_right_control">
            <!--比例尺-->
            <ul class="scale_control">
                <li class="li_map_zoom">
                    <span>{{scale}}</span>
                    <div class="zoom_scale"></div>
                </li>
                <li class="li_btn" @click="setMapZoom('minus')">
                    <i class="el-icon-minus"></i>
                </li>
                <li class="li_btn" @click="setMapZoom('add')">
                    <i class="el-icon-plus"></i>
                </li>
            </ul>
            <!--鼠标绘制-->
            <ul class="mouse_control">
                <li class="mouse_control_li">
                    <el-popover
                        placement="top"
                        title=""
                        width="74"
                        popper-class="mouse_polyline"
                        trigger="hover">
                        <div class="mouse_polyline_body">
                            <p @click="drawingMouse('polyline')">手动测距</p>
                            <p @click="selfMotionDistance">自动测距</p>
                        </div>
                        <img slot="reference" src="../../assets/images/map/scale.png" alt="">
                    </el-popover>

                </li>
                <li class="mouse_control_li" @click="drawingMouse('circle')">
                    <img src="../../assets/images/map/circle.png" alt="">
                </li>
                <li class="mouse_control_li" @click="drawingMouse('polygon')">
                    <img src="../../assets/images/map/polygon.png" alt="">
                </li>
                <li class="mouse_control_li" @click="drawingMouse('morePoint')">
                    <img src="../../assets/images/map/overlay.png" alt="">
                </li>
            </ul>
        </div>
        <!--标注info框-->
        <div class="res_info_window" ref="resInfoWindow" v-show="isShowInfo">
            <div class="res_info_header">
                <h3>{{ showResInfo.resName}}</h3>
                <p>{{ showResInfo.resAddress || '--'}}</p>
            </div>
            <ul class="res_info_content">
                <li class="res_info_content_li">
                    <span class="content_li_title">商圈:</span>
                    <span>{{showResInfo.tradingArea || '--'}}</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">楼栋数量:</span>
                    <span>{{showResInfo.fNum || '--'}}</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">住户数量:</span>
                    <span>{{showResInfo.hNum || '--'}}</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">楼盘价格:</span>
                    <span>¥{{showResInfo.hPrice / 100 || '--'}}/㎡</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">楼盘类型:</span>
                    <span>{{showResInfo.cType || '--'}}</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">入住时间:</span>
                    <span>{{showResInfo.chDay || '--'}}年</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">人流量:</span>
                    <span>{{showResInfo.peopleFlow || 0}}/人次/天</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">广告限制:</span>
                    <span>{{showResInfo.adLimit || '--'}}</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">点位备注:</span>
                    <span>{{showResInfo.mRemark || '--'}}</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">车流量:</span>
                    <span>{{showResInfo.carFlowrate || 0}}</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">车位数:</span>
                    <span>{{showResInfo.parkSpaceNum || 0}}</span></li>
                <li class="res_info_content_li">
                    <span class="content_li_title">出入口数:</span>
                    <span>{{showResInfo.dNum || '--'}}</span></li>
            </ul>
            <div class="res_info_footer">
                <img src="../../assets/images/map/adDoor.png" alt="" @click="getMediaListByResID">
                <el-button size="small" type="primary" @click="addResFun(showResInfo)">
                    {{showResInfo.isSelect ? '取消待选' : '加入待选'}}
                </el-button>
            </div>
        </div>
        <!--框选条件-->
        <el-dialog
            title="框选条件"
            :visible.sync="searchDialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            width="360px"
            custom-class="map_dialog">
            <div class="around_search_body">
                <p>
                    <span class="p_span">框选方式：</span>
                    <el-radio v-model="aroundSearchInfo.searchRadio" :label="1">辐射圈并集</el-radio>
                    <el-radio v-model="aroundSearchInfo.searchRadio" :label="2">辐射圈交集</el-radio>
                </p>
                <p>
                    <span class="p_span">框选范围：</span>
                    <el-slider class="p_slider" v-model="aroundSearchInfo.searchRadius"></el-slider>
                    <el-input class="radius_input" placeholder="请输入半径" size="small"
                              @change="changeInput"
                              v-model="aroundSearchInfo.searchRadius"></el-input>
                    <span>km</span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button plain size="small" @click="searchDialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="searchAround" :loading="searchLoading">
                    {{searchLoading ? '搜索中' : '确 定'}}
                </el-button>
            </div>
        </el-dialog>
        <!--小区提交成功-->
        <el-dialog
            title="提示"
            width="30%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            :visible.sync="mapDialogVisible">
            <span>点位选择成功，请在购物车模块点击相应的位置获取地图选择的点位数据！</span>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="closeWin">确 定</el-button>
            </div>
        </el-dialog>
        <!--资源的媒体数据-->
        <el-dialog
            :title="showResInfo.resName"
            width="270px"
            :visible.sync="medieDialogVisible"
            custom-class="media_list_dialog">
            <div>
                <ul class="media_list_body">
                    <li class="list_li" v-for="key of mediaList">
                        <div class="li_header">
                            <h4>{{key.mTitle}}</h4>
                            <img src="../../assets/images/map/mstate_1.png" alt="">
                            <i class="el-icon-picture-outline" @click="showMediaImg(key)"></i>
                        </div>
                        <p class="li_p">{{key.assetTag}}</p>
                        <p class="li_p">
                            <span>{{key.grade || '--'}}级</span>
                            <span>{{key.mType || '--'}}</span>
                            <span>{{key.adSize || key.picSize}}</span>
                        </p>
                    </li>
                </ul>
            </div>
        </el-dialog>
        <!--媒体门禁图片-->
        <el-dialog
            title="门禁图片"
            width="340px"
            :visible.sync="medieImgDialogVisible">
            <div>
                <el-carousel height="370px">
                    <el-carousel-item v-for="(key,index) in activeMediaPhotos" :key="index">
                        <img :src="key" alt="">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </el-dialog>
        <!--复制分享链接-->
        <el-dialog
            title="分享地图"
            width="320px"
            :visible.sync="copyDialogVisible"
            custom-class="copy_dialog">
            <div>
                <p class="copy_url" style="word-wrap:break-word">{{shareUrl}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="copyUrl">复制</el-button>
            </div>
        </el-dialog>
        <!--多点辐射/叠加分析-->
        <el-dialog
            title="多点辐射"
            width="600px"
            custom-class="map_dialog"
            :visible.sync="isMoreCenterPointVisible">
            <div class="map_dialog_body">
                <p>
                    <span class="p_span">框选方式：</span>
                    <el-radio v-model="aroundSearchInfo.searchRadio" :label="1">辐射圈并集</el-radio>
                    <el-radio v-model="aroundSearchInfo.searchRadio" :label="2">辐射圈交集</el-radio>
                </p>
                <ul>
                    <li class="map_dialog_li clearfix" v-for="(item,index) in moreRadiationInfo">
                        <span class="p_span map_li_p">辐射圈{{index+1}}：</span>
                        <el-select
                            v-model="item.searchValue"
                            multiple
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            size="small"
                            :remote-method="remoteMethod"
                            :loading="loadingMore"
                            class="more_radiation_select"
                            @focus="moreRadiationIndex = index">
                            <el-option
                                v-for="item in item.searchOptions"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <el-input size="small" class="search_radius_input" placeholder="请输入半径距离"
                                  v-model="item.searchRadius" @focus="moreRadiationIndex = index">
                            <template slot="append">km</template>
                        </el-input>
                        <div class="del_icon" @click="delRowSelect(index)">
                            <i class="el-icon-remove"></i>
                        </div>
                    </li>
                </ul>
                <div class="add_row_btn" @click="addMoreRow">+ 添加辐射圈</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="setMoreRadiation" :loading="isMoreRadiation">
                    {{isMoreRadiation ? '检索中.' : '确 定'}}</el-button>
                <el-button plain size="small" @click="isMoreCenterPointVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import areaPackage from "../../commonFun/areaPackage_new";
    import sessFun from "../../commonFun/sessFun";
    import timeFormat from "../../commonFun/timeFormat"
    import api from "../../api/api"
    export default {
        name: "qinLinMap",
        components:{
            'remote-js': {
                render(createElement) {
                    return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});
                },
                props: {
                    src: { type: String, required: true },
                },
            },
        },
        data() {
            return{
                // 路由参数
                routeQuery:{},
                // 获取资源到参数
                adListParams: {},
                // 登录信息
                sessionData: sessFun.getSess(),
                // 判断来源
                isShare: false,
                // 当前地图资源是否可提交
                isCommit: false,
                // 地图实例
                resMap: '',
                markerIcon: require('../../assets/images/map/markerIcon.png'),
                resMarkers: [],
                // 时间排期
                dateTime:[],
                // 地图loading
                mapLoading: true,
                //比例尺
                scale: '5公里',
                // 当前显示到小区数据
                resInfo:[],
                // 搜索到关键词
                selectName: '',
                // 搜索类型 1->亲邻社区，2->在线结果
                activeSearchKind: '1',
                selOptions: [
                    {
                        value: '1',
                        label: '亲邻社区'
                    }, {
                        value: '2',
                        label: '在线结果'
                    }
                ],
                // 选择的亲邻社区列表
                selectResList: [],
                // 搜索的资源列表
                searchResList: [],
                /* 在线搜索 */
                // 在线搜索到list
                searchOnlineList:[],
                // 在线搜索点
                onlineMarkers:[],
                // 在线搜索是否全选状态
                isAllSelectOnline: false,
                // 正在在线全选中
                isActiveASOL: false,
                // 在线搜索输入范围
                searchDialogVisible: false,
                // 搜索中
                searchOnlineLoading: false,
                // 在线搜索勾选到值
                selectOnlineList: [],
                // 周边搜索条件
                aroundSearchInfo:{
                    searchRadio:  1,
                    searchRadius: 1,
                },
                // 周边搜索中
                searchLoading: false,
                // 标识在线搜索结果状态
                isOnlineSearch: false,
                // 收起/展开
                showSelectList: true,
                // 是否显示小区详情
                isShowInfo: false,
                // 被点击的资源标注信息
                showResInfo:{},
                /*顶部过滤条件*/
                popoverShow:{
                    hNum: false,
                    bPrice: false,
                    lYear: false
                },
                // 记录判断含有哪些表头的过滤条件
                filterData: {
                    hNum:false,
                    bNum:false,
                    bPrice:false,
                    lYear: false,
                },
                // 显示更多过滤条件
                showMore: false,
                // 区域下拉
                areaList: [],
                // 选择到区域
                selectArea: [],
                // 楼盘类型
                bType:[],
                // 楼盘类型下拉
                buildTypeList: [
                    {buildlabel: '高端住宅', buildValue: '高端住宅'},
                    {buildlabel: '中端住宅', buildValue: '中端住宅'},
                    {buildlabel: '普通住宅', buildValue: '普通住宅'},
                    {buildlabel: '单体楼', buildValue: '单体楼'},
                    {buildlabel: '别墅', buildValue: '别墅'},
                    {buildlabel: '洋房', buildValue: '洋房'},
                    {buildlabel: '商住', buildValue: '商住'}
                ],
                // 广告限制
                ADLimit: [],
                // 住户数量
                houseNum: ['', ''],
                // 住户数量li
                houseList:['50-99','100-199','200-499','500-999'],
                // 楼栋价格
                buildPrice:['',''],
                // 楼盘价格li
                priceList:['5000-9999','10000-20000','20000-30000','30000-40000'],
                // 入住年份
                liveYear: ['',''],
                // 入住年份li
                liveYearList:['1990-1999','2000-2005','2006-2010','2011-2019'],
                // 搜索人流量
                peopleFlow: ['',''],
                // 广告限制
                selectLimits:[],
                // 所在商圈
                tradingAreaList:[],
                // 选择到商圈
                selectTradingArea: '',
                // 媒体类型
                doorTypeList: [],
                // 选择到媒体类型
                selectDoorType: '',
                // 媒介载体
                selectMediaType: '',
                // 媒体等级
                selectMediaLevel: '',
                /* 鼠标绘制 */
                drawingManager: '',
                // 标识鼠标画线状态
                isMouseLine: false,
                // 标识画线时点击的次数
                mouseLineStep: 0,
                // 点击时到点坐标arr
                LinePoints:[],
                // 鼠标移动时到label
                mapLabel: null,
                // 记录上一段线的距离
                twoPointsLength: 0,
                // 鼠标绘制到对象
                mouseoverlay: '',
                // 鼠标绘制结果状态
                isMouseSearch: false,
                // 自动测距的线条覆盖物
                selfMotionPolylines: [],
                // 小区资源提交成功
                mapDialogVisible: false,
                // 小区媒体列表弹出框
                medieDialogVisible: false,
                // 媒体list(门)
                mediaList: [],
                // 媒体图片
                activeMediaPhotos: [],
                medieImgDialogVisible: false,
                // 复制分享链接
                copyDialogVisible: false,
                shareUrl: '',
                // 多点辐射(叠加分析)
                isMoreCenterPointVisible: false,
                // 标识当前模式为多点辐射
                isMultiPoint: false,
                isMoreRadiation: false,
                // 多点辐射信息
                moreRadiationInfo: [
                    {
                        searchOptions: [],  // 多点辐射下拉选择
                        searchValue:'',     // 下拉选中
                        searchRadius: 1,    // 辐射半径
                    }
                ],
                // 当前点击的行
                moreRadiationIndex: 0,
                // 检索中
                loadingMore: true,
            }
        },
        mounted() {
            this.getSessionData()
            window.onload = this.initMap()
            if(this.$route.path.includes('shareRes')) {
                this.isShare = true
                this.getShareResList()
            } else {
                this.isShare = false
                // 获取小区数据
                this.getResList();
                // 获取商圈list
                this.getTradingArea();
                // 获取媒体类型(门类型)
                this.getDoorType();
                // 获取广告限制列表
                this.getADLimit();
            }
            this.getAreaList();
        },
        methods:{
            // 获取缓存数据
            getSessionData() {
                console.log('----',this.$route.query)
                this.adListParams = JSON.parse(localStorage.getItem('mapParams'))
                this.routeQuery = this.$route.query
                // 判断是否是超管访问，超管无提交资源权限
                if(this.routeQuery.flag === 'true') {
                    this.isCommit = true
                } else {
                    this.isCommit = false
                }
            },
            // 城市区域
            getAreaList() {
                this.areaList = areaPackage.findArea(this.adListParams.rid)
            },
            // 获取广告限制列表
            getADLimit() {
                let params = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service": "GetNotPush",
                    "data": {}
                }
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('广告限制列表', res)
                    if (res.data.SysCode === 200200) {
                        let limits = res.data.data
                        let limitArr = []
                        for (let key of limits) {
                            limitArr.push({
                                value: key.nTitle,
                                label: key.nTitle
                            })
                        }
                        this.ADLimit = limitArr
                    } else {
                        sessFun.messageFun('warning', '广告限制获取异常！')
                    }
                })
            },
            // 获取商圈
            getTradingArea() {
                let params = {
                    cityId: '440100'
                }
                api.getApi(this.apiVar.mapApi + '/tradingAreaList',params).then(res=>{
                    if (res.data.SysCode === 200200) {
                        this.tradingAreaList = res.data.data.map((item)=>{
                            return {
                                value: item,
                                label: item
                            }
                        })
                    } else {
                        sessFun.messageFun('warning', '商圈数据获取异常！')
                    }
                })
            },
            // 获取媒体类型(门类型)list
            getDoorType() {
                api.getApi(this.apiVar.mapApi + '/mediaType',{}).then(res=>{
                    if (res.data.SysCode === 200200) {
                        this.doorTypeList = res.data.data.map((item)=>{
                            return {
                                value: item,
                                label: item
                            }
                        })
                    } else {
                        sessFun.messageFun('warning', '商圈数据获取异常！')
                    }
                })
            },
            // 初始化地图
            initMap() {
                console.log('初始化地图----')
                // 创建Map实例
                this.resMap = new BMap.Map("qinlinMap", {enableMapClick:false});
                console.log('resMap',this.resMap)
                // 设置地图显示的城市 此项是必须设置的
                this.resMap.setCurrentCity(this.$route.query.city);
                // 初始化地图,设置中心点坐标和地图级别
                this.resMap.centerAndZoom(this.$route.query.city, 11);
                //开启鼠标滚轮缩放
                this.resMap.enableScrollWheelZoom(true);
                let mapStyleJson = [
                    {
                        "featureType": "land",
                        "elementType": "geometry.stroke",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "point",
                        "elementType": "geometry.stroke",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "building",
                        "elementType": "geometry.stroke",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                ]
                this.resMap.setMapStyle({styleJson: mapStyleJson })
                let that = this
                // 监听点击地图
                this.resMap.addEventListener("click", (e) => {
                    console.log('监听点击地图---',e.point)
                    if(this.isMouseLine) {
                        if(!this.mouseLineStep) {
                            this.resMap.addEventListener("mousemove",that.mapMouseMove,false)
                        }
                        this.LinePoints.push(e.point)
                        this.drawingLine(e.point)
                        this.mouseLineStep++
                    }
                });
                // 监听地图缩放
                this.resMap.addEventListener('zoomend',(e) => {
                    this.setMapZoom()
                })
                // 监听地图移动
                this.resMap.addEventListener('moveend',(e) => {
                    this.pointInBounds()
                })
            },
            // 城市边界
            displayBoundary() {
                let json;
                console.log('areaList',this.areaList)
                for(let key of this.areaList) {
                    json = {color : "#F1627A",name : key.rName}
                    this.getBoundary(json);
                }
            },
            // 边界覆盖物
            getBoundary(json) {
                let _Boundary = new BMap.Boundary();
                _Boundary.get(json.name, (rs)=> {               // 获取行政区域
                    let count = rs.boundaries.length;           // 行政区域的点有多少个
                    for (let i = 0; i < count; i++) {
                        let ply = new BMap.Polygon(rs.boundaries[0], {
                            strokeWeight: 2,
                            strokeOpacity: 1,
                            strokeColor: json.color,
                            fillColor: json.color,      // 控制覆盖物的颜色
                            fillOpacity: 0.000001       // 控制覆盖物的透明度
                        }); //建立多边形覆盖物
                        this.resMap.addOverlay(ply);    // 添加覆盖物
                    }
                });
            },
            // 获取小区数据
            getResList() {
                this.mapLoading = true
                let params = {
                    startTime: this.adListParams.ls,
                    endTime: this.adListParams.le,
                    cityId: this.adListParams.rid,
                    suID: this.adListParams.suID,             // 销售uid
                    resName: '',
                    districtId: this.selectArea.join(','),    // 区域
                    cType: this.bType,                        // 楼盘类型
                    minhPrice: this.buildPrice[0] * 100,
                    maxhPrice: this.buildPrice[1] * 100,
                    minhNum: this.houseNum[0],
                    maxhNum: this.houseNum[1],
                    minchDay: this.liveYear[0],
                    maxchDay: this.liveYear[1],
                    tradingArea: this.tradingArea,
                    adLimit: this.selectLimits.join(','),
                    mType: this.selectDoorType,
                    mVehicle: this.selectMediaType,
                    grade: this.selectMediaLevel
                }
                if(this.sessionData.uType === 'SM') {
                    delete params.suID
                }
                for(let i in params) {
                    if(!params[i]) {
                        delete params[i]
                    }
                }
                api.getApi(this.apiVar.mapApi + '/resList',params).then(res=>{
                    this.resMap.clearOverlays()
                    if(res.data.SysCode === 200200) {
                        this.resInfo = res.data.data
                        this.creatMarker()
                        this.judgeByselect()
                        console.log('resInfo',this.resInfo)
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                    }
                    // 城市边界
                    this.displayBoundary()
                    // 初始化鼠标绘制
                    this.initMouseDrawing()
                    this.mapLoading = false
                }).catch(err=>{
                    console.log('err',err)
                    this.mapLoading = false
                    sessFun.messageFun('warning','小区数据接口异常')
                })
            },
            // 根据购物车已有的resID判断勾选
            judgeByselect() {
                for (let key of this.selectResList) {
                    for (let rKey of this.resInfo) {
                        if (key.resID === rKey.resID) {
                            let point = new BMap.Point(key.lng, key.lat);
                            // 圈起标识
                            this.createCircle(key.resID,point)
                            rKey.isSelect = true
                            break
                        }
                    }
                }
                console.log('selectResList',this.selectResList)
            },
            // 创建标注
            creatMarker() {
                // let markerList = [];
                // let myIcon = new BMap.Icon(this.markerIcon, new BMap.Size(16,16),{
                //     anchor: new BMap.Size(8, 8)
                // });
                // for (let key of this.resInfo) {
                //     let point = new BMap.Point(key.lng, key.lat);
                //     let marker = new BMap.Marker(point, {icon: myIcon});  // 创建标注
                //     let label = new BMap.Label(key.resName, {offset: new BMap.Size(4,-18)});
                //     label.setStyle({
                //         borderRadius: "3px",
                //         boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.15)',
                //         border: 'none',
                //         background: 'rgba(255,255,255,1)',
                //         color: 'rgba(0,0,0,0.85)',
                //         padding: '3px 8px',
                //     });
                //     marker.setLabel(label);
                //     marker.setTop(true);
                //     label.addEventListener("click",()=>{
                //         this.showInfo(key,point)
                //     });
                //     markerList.push(marker);
                // }
                // // 点位聚合
                // let markerClusterer = new BMapLib.MarkerClusterer(this.resMap, {markers:markerList})
                // // 聚合计算时网格的像素大小，默认60
                // markerClusterer.setGridSize(60)
                // // 获取单个聚合的最小数量
                // markerClusterer.setMinClusterSize(5)
                // // 设置聚合的最大缩放级别
                // markerClusterer.setMaxZoom(17)
                // this.markers = markerList
                // console.log('markerClusterer',markerClusterer, markerClusterer.getMarkers())

                let i = 0
                let markerList = [];
                let myIcon = new BMap.Icon(this.markerIcon, new BMap.Size(16,16),{
                    anchor: new BMap.Size(8, 8)
                });
                for(let key of this.resInfo) {
                    this.$set(key, "isSelect", false);
                    let point = new BMap.Point(key.lng, key.lat);
                    let marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                    let label = this.setMarkerLabel(key.resName)
                    marker.setLabel(label);
                    marker.setTop(true);
                    marker.inCircleNum = 0
                    this.resMap.addOverlay(marker);              // 将标注添加到地图中
                    label.addEventListener("click",()=>{
                        this.showInfo(key,point)
                    });
                    if(i < 1000) {
                        marker.show()
                    } else {
                        marker.hide()
                    }
                    i++
                    markerList.push(marker)
                }
                this.resMarkers = markerList
            },
            // 设置标注到label
            setMarkerLabel(labelName) {
                let label = new BMap.Label(labelName,{offset:new BMap.Size(4,-18)});
                label.setStyle({
                    borderRadius: "3px",
                    boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.15)',
                    border: 'none',
                    background: 'rgba(255,255,255,1)',
                    color: 'rgba(0,0,0,0.85)',
                    padding: '3px 8px',
                });
                return label
            },
            // 显示详
            showInfo(info,point){
                this.showResInfo = info
                let content = this.$refs.resInfoWindow
                let opts = {
                    width: 180,             // 信息窗口宽度
                    height: 320,              // 信息窗口高度
                    title: "",              // 信息窗口标题
                    enableMessage: false    //设置允许信息窗发送短息
                }
                let infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
                this.resMap.openInfoWindow(infoWindow,point);        //开启信息窗口
                console.log('显示详情-----',info)
                this.isShowInfo = true
            },
            // 详情里选定按钮
            addResFun(item) {
                this.checkBoxFun(this.showResInfo)
            },
            // 获取指定资源到媒体列表
            getMediaListByResID() {
                console.log('获取指定资源到媒体列表-----')
                this.medieDialogVisible = true
                let params = {
                    "resID": this.showResInfo.resID
                }
                if(this.isShare) {
                    params.shareCode = this.routeQuery.code
                }
                api.getApi(this.apiVar.mapApi + '/mediaByResID',params).then(res=>{
                    if (res.data.SysCode == 200200) {
                        this.mediaList = res.data.data.map(item=>{
                            if (item.mState === 1) {
                                item.stateUrl = require('../../assets/images/map/mstate_1.png')
                            } else if (item.mState === 2) {
                                item.stateUrl = require('../../assets/images/map/mstate_2.png')
                            } else if (item.mState === 3) {
                                item.stateUrl = require('../../assets/images/map/mstate_3.png')
                            }
                            return item
                        })
                    } else {
                        sessFun.messageFun('warning', '媒体详情获取异常!')
                    }
                }).catch(err=>{
                    sessFun.messageFun('warning', '接口异常!')
                })
            },
            // 媒体图片
            showMediaImg(item) {
                console.log('媒体图片item----',item)
                this.activeMediaPhotos = item.photoList || []
                this.medieImgDialogVisible = true
            },
            /**
             * 鼠标绘制
             * */
            // 初始化鼠标绘制
            initMouseDrawing(){
                if(!this.drawingManager){
                    // 鼠标绘制控件
                    let styleOptions = {
                        strokeColor:'rgba(24,144,255,1)',   //边线颜色。
                        fillColor: 'rgba(24,144,255,0.15)', //填充颜色。当参数为空时，圆形将没有填充效果。
                        strokeWeight: 2,                    //边线的宽度，以像素为单位。
                        strokeOpacity: 1,                   //边线透明度，取值范围0 - 1。
                        fillOpacity: 1,                     //填充的透明度，取值范围0 - 1。
                        strokeStyle: 'solid',               //边线的样式，solid或dashed。
                    }
                    //实例化鼠标绘制工具
                    this.drawingManager = new BMapLib.DrawingManager(this.resMap, {
                        isOpen: false, //是否开启绘制模式
                        enableDrawingTool: false, //是否显示工具栏
                        drawingToolOptions: {
                            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                            offset: new BMap.Size(5, 5), //偏离值
                            drawingModes : [
                                // BMAP_DRAWING_MARKER,     // 画点
                                BMAP_DRAWING_CIRCLE,        // 画圆
                                BMAP_DRAWING_POLYLINE,      // 画线
                                BMAP_DRAWING_POLYGON,       // 画多边形
                                BMAP_DRAWING_RECTANGLE      // 画矩形
                            ]
                        },
                        circleOptions: styleOptions,    // 圆的样式
                        polylineOptions: styleOptions,  // 线的样式
                        polygonOptions: styleOptions,   // 多边形的样式
                        rectangleOptions: styleOptions  // 矩形的样式
                    });
                    let that = this
                    //添加鼠标绘制工具监听事件，用于获取绘制结果
                    this.drawingManager.addEventListener("overlaycomplete", function(e) {
                        console.log(e.drawingMode);
                        console.log(e.overlay);
                        console.log(e.calculate);
                        console.log(e.label);
                        that.mouseoverlay =  e.overlay
                        that.drawingManager.close()
                        if(e.drawingMode === 'circle') {
                            that.showResInPolygon('circle',e.overlay)
                        } else if(e.drawingMode === 'polygon') {
                            console.log('画多边形',overlay,e.overlay.getPath());
                            that.polygonPoint = e.overlay.getPath()
                            that.showResInPolygon('polygon',e.overlay)
                        } else if(e.drawingMode === 'polyline') {
                            that.isMouseLine = false
                            that.resMap.removeEventListener('mousemove',that.mapMouseMove,false)
                            that.mouseLineStep = 0
                            that.resMap.removeOverlay(that.mapLabel)
                            console.log('解除监听！')
                            console.log('画直线',overlay);
                        }
                    });
                }
            },
            // 打开绘制类型
            drawingMouse(temp) {
                this.deleteDrawingOverlay()
                if (temp === 'circle') {
                    this.drawingManager.open()
                    // this.drawingManager.enableCalculate()
                    this.drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
                } else if (temp === 'polygon') {
                    this.drawingManager.open()
                    this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
                } else if (temp === 'polyline') {
                    this.drawingManager.open()
                    // this.drawingManager.enableCalculate()
                    this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
                    this.isMouseLine = true
                } else if (temp === 'morePoint') {
                    this.isMoreCenterPointVisible = true
                } else {
                    sessFun.messageFun('warning', '点击异常！')
                }
            },
            // 画线时打点
            drawingLine(point) {
                console.log('画线时打点----')
                let myIcon = new BMap.Icon(this.markerIcon, new BMap.Size(16,16),{
                    anchor: new BMap.Size(8, 8)
                });
                let marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                let labelText = ''
                if(this.mouseLineStep < 1) {
                    labelText = '起点'
                    this.twoPointsLength = 0
                } else {
                    let beginPoint = this.LinePoints[this.mouseLineStep - 1] //
                    let radius= this.resMap.getDistance(beginPoint,point)/1000
                    labelText = (Number(this.twoPointsLength) + radius).toFixed(2) + '公里'
                    this.twoPointsLength += radius
                }
                console.log('twoPointsLength----',this.twoPointsLength)
                let label = new BMap.Label(labelText,{offset:new BMap.Size(-20,-16)});
                label.setStyle({
                    borderRadius: "3px",
                    boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.15)',
                    border: "1px solid #ccc",
                    background: 'rgba(255,255,255,1)',
                    color: 'rgba(0,0,0,0.85)',
                    padding: '2px 4px'
                });
                marker.setLabel(label);
                this.resMap.addOverlay(marker);              // 将标注添加到地图中
            },
            mapMouseMove(ev) {
                if(this.isMouseLine && this.mouseLineStep) {
                    console.log('鼠标移动----e',ev.point)
                    this.resMap.removeOverlay(this.mapLabel)
                    let radius= this.resMap.getDistance(this.LinePoints[0], ev.point) /1000 + this.twoPointsLength;
                    //添加文字标签
                    let opts = {
                        position: ev.point,                 // 指定文本标注所在的地理位置（当前鼠标的位置）
                        offset: new BMap.Size(0, 0)         //设置文本偏移量
                    }
                    this.mapLabel = new BMap.Label("当前距离："+ radius.toFixed(2) +"公里", opts);  // 创建文本标注对象
                    this.mapLabel.setStyle({
                        border:"1px solid #ccc",
                        maxWidth: "none ",
                    });
                    this.resMap.addOverlay(this.mapLabel);//添加label
                } else {
                    console.log('-----e')
                }
            },
            // 匹配多边形内的点位
            isInsidePolygon(pt, poly) {
                for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
                    ((poly[i].lat <= pt.lat && pt.lat < poly[j].lat) || (poly[j].lat <= pt.lat && pt.lat < poly[i].lat)) &&
                    (pt.lng < (poly[j].lng - poly[i].lng) * (pt.lat - poly[i].lat) / (poly[j].lat - poly[i].lat) + poly[i].lng) &&
                    (c = !c);
                return c;
            },
            // 显示多边形内的点位
            showResInPolygon(temp, overlay) {
                console.time('显示多边形')
                console.log('resMarkers', this.resMarkers)
                for (let akey of this.resMarkers) {
                    let isShow = ''
                    if (temp === 'circle') {
                        isShow = BMapLib.GeoUtils.isPointInCircle(akey.point, overlay)
                    } else if (temp === 'polygon') {
                        isShow = BMapLib.GeoUtils.isPointInPolygon(akey.point, overlay)
                    }
                    if (!isShow) {
                        akey.hide()
                    } else {
                        for (let key of this.resInfo) {
                            if (akey.getLabel().content === key.resName) {
                                let flag = this.searchResList.some((item, index) => {
                                    if (key.resID === item.resID) {
                                        return true
                                    }
                                })
                                if (!flag) {
                                    this.searchResList.push(key)
                                }
                                break
                            }
                        }
                    }
                }
                this.isMouseSearch = true
                console.timeEnd('显示多边形')
            },
            // 清除上一次的绘制
            deleteDrawingOverlay() {
                let allOverlay = this.resMap.getOverlays();
                for (let akey of allOverlay) {
                    if (akey.toString() == "[object Circle]" || akey.toString() == "[object Polygon]") {
                        // this.resMap.removeOverlay(akey);
                        // break;
                    } else if(!akey.isVisible()){
                        akey.show()
                    } else {

                    }
                }
                this.resMap.removeOverlay(this.mouseoverlay)
                this.searchResList = []
            },
            // 地图缩放
            setMapZoom(temp) {
                if(temp === 'add') {
                    this.resMap.zoomIn()
                } else if(temp === 'minus'){
                    this.resMap.zoomOut()
                }
                let scaleArr = ['20米','50米','100米','200米','500米','1公里','2公里','5公里','10公里','20公里','25公里','50公里','100公里','200公里','500公里','1000公里','2000公里','5000公里','10000公里']
                let mapLevel = [19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]
                let index = mapLevel.indexOf(this.resMap.getZoom())
                this.scale = scaleArr[index]
                if(index <= 6) {
                    this.pointInBounds()
                }
                console.log('当前地图缩放等级---',this.resMap.getZoom(),this.scale)
            },
            // 判断点是否在视野内
            pointInBounds() {
                console.log('判断点是否在视野内------',this.resMap.getZoom())
                if(!this.isMouseSearch && !this.isOnlineSearch && this.resMap.getZoom() >= 14) {
                    let bound = this.resMap.getBounds();// 地图可视区域
                    for (let key of this.resMarkers) {
                        if (bound.containsPoint(key.point) == true && !key.isVisible()) {
                            key.show()
                        }
                    }
                }
            },
            // 自动测距
            selfMotionDistance() {
                console.log('自动测距------')
                console.time('自动测距')
                let isMapCenter = false
                for (let key of this.searchResList) {
                    if (key.mapCenter) {
                        isMapCenter = true
                        let point = new BMap.Point(key.lng, key.lat);
                        for (let mkey of key.mapCenter) {
                            let distance = Math.floor(this.resMap.getDistance(point, mkey.point))
                            let polyline = new BMap.Polyline(
                                [
                                    point,
                                    mkey.point
                                ],
                                {strokeColor: "#1890FF", strokeWeight: 1, strokeOpacity: 1,strokeStyle:'dashed'}
                            );
                            //添加折线
                            this.resMap.addOverlay(polyline);
                            this.selfMotionPolylines.push(polyline);
                            // 更换标注的label
                            for (let rkey of this.resMarkers) {
                                if (rkey.point.lng == key.lng && rkey.point.lat == key.lat) {
                                    let labelName = key.resName + '(' + distance + '米)'
                                    rkey.getLabel().setContent(labelName)
                                }
                            }
                        }
                    }
                }
                if(!isMapCenter) {
                    sessFun.messageFun('warning','请先进行周边选点再进行自动测距！')
                }
                console.timeEnd('自动测距')
            },
            // 多点辐射
            remoteMethod(query) {
                if (query !== '') {
                    let resultArray = []
                    this.loadingMore = true;
                    let options = {
                        onSearchComplete:  (results) =>{
                            console.log('2results',results)
                            // 判断状态是否正确
                            if (local.getStatus() == 0){
                                console.log(results.getPoi);
                                for (let i = 0; i < results.getCurrentNumPois(); i++) {
                                    //在当前页面下获取页面中的内容
                                    resultArray.push({
                                        id: results.getPoi(i).uid,
                                        title: results.getPoi(i).title,
                                        address: results.getPoi(i).address,
                                        city: results.getPoi(i).city,
                                        province: results.getPoi(i).province,
                                        point: results.getPoi(i).point,
                                    })
                                }
                                this.loadingMore = false
                                this.moreRadiationInfo[this.moreRadiationIndex].searchOptions = JSON.parse(JSON.stringify(resultArray))
                                console.log('resultArray',resultArray,this.moreRadiationIndex)
                            } else {
                                console.log('没有搜索到该关键词！')
                            }
                        },
                        pageCapacity: 100
                    };
                    let local = new BMap.LocalSearch(this.resMap,options)
                    local.search(this.$route.query.city + query)
                } else {
                    this.loadingMore = false;
                }
            },
            // 添加一行
            addMoreRow() {
                this.moreRadiationInfo.push({
                    searchOptions: [],
                    searchValue:'',
                    searchRadius: 1,
                })
            },
            // 删除一行
            delRowSelect(index) {
                this.moreRadiationInfo.splice(index, 1)
            },
            // 构建需要提交的辐射点
            setCenterInfos(val) {
                let arr = []
                let index = 1
                for(let key of this.moreRadiationInfo) {
                    for(let optionsKey of key.searchOptions) {
                        if(key.searchValue.includes(optionsKey.id)) {
                            arr.push({
                                "name": optionsKey.title,
                                "address":optionsKey.address,
                                "lng": optionsKey.point.lng,
                                "lat":  optionsKey.point.lat,
                                "radius": key.searchRadius,
                                "group": index
                            })
                        }
                    }
                    index++
                }
                console.log('选择辐射点arr',arr)
                return arr
            },
            // 多点辐射
            setMoreRadiation() {
                this.isMoreRadiation = true
                let params = {
                    "startTime": this.adListParams.ls,
                    "endTime": this.adListParams.le,
                    "type": this.aroundSearchInfo.searchRadio,
                    "cityId": this.adListParams.rid,
                    "centerInfoList": this.setCenterInfos()
                }
                console.log('params',params)
                api.postApi_json(this.apiVar.mapApi + '/multiPointAnalyze',params).then(res=>{
                    console.log('多点辐射res',res)
                    if(res.data.SysCode === 200200) {
                        this.searchResList = []
                        this.resMap.clearOverlays()
                        this.resInfo = res.data.data.map(item =>{
                            this.$set(item, "isSelect", false);
                            item.mapCenter = item.centerList.map(key =>{
                                return {
                                    centerAddress: key.address || '',
                                    city: key.city || '',
                                    point: new BMap.Point(key.lng, key.lat),
                                    centerName: key.name || ''
                                }
                            })
                            this.searchResList.push(item)
                            return item
                        })
                        this.creatMarker()
                        // this.searchResList = JSON.parse(JSON.stringify(this.resInfo))
                        this.isMultiPoint = true
                        this.activeSearchKind = '1'
                        console.log('resInfo',this.resInfo)
                        // 辐射点打点、画圆
                        this.setMultiPointMarker(params.centerInfoList)
                        this.isMoreCenterPointVisible = false
                    } else {
                        sessFun.messageFun('warning', res.data.MSG || '接口异常')
                    }
                    this.isMoreRadiation = false
                })
            },
            // 辐射点打点、画圆
            setMultiPointMarker(centerInfoList) {
                let colors = ['rgba(255, 190, 0, 1)','rgba(24, 144, 255, 1)','rgba(241, 98, 122, 1)',
                    'rgba(255, 108, 66, 1)','rgba(72, 203, 255, 0.75)','rgba(77, 203, 115, 1)']
                for(let key of centerInfoList) {
                    let point = new BMap.Point(key.lng, key.lat)
                    let circle = new BMap.Circle(point, key.radius * 1000, {
                        strokeColor: colors[key.group % 6], //'rgba(24,144,255,1)',
                        fillColor: '',//'rgba(24,144,255,0.15)',
                        strokeWeight: 2,
                        fillOpacity: 1,
                        strokeOpacity: 1
                    });
                    this.resMap.addOverlay(circle);
                    let myIcon = new BMap.Icon(require('../../assets/images/map/onlineIcon.png'), new BMap.Size(32,32),{
                        anchor: new BMap.Size(16, 16)
                    });
                    let marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                    marker.setTop(true);
                    this.resMap.addOverlay(marker);                     // 将标注添加到地图中
                    this.onlineMarkers.push(marker)
                    marker.addEventListener("click", () => {
                        console.log('辐射点打点、画圆')
                        let content =
                            "<div>" +
                            "<p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>"
                            + key.name + "</p>" +
                            "<p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>" +
                            "地址:" + key.address + "</p>" +
                            "</div>";
                        // 信息窗口
                        let opts = {
                            width: 0,
                            height: 0,
                            title: "",
                            enableMessage: false    //设置允许信息窗发送短息
                        }
                        let infoWindow = new BMap.InfoWindow(content, opts);    // 创建信息窗口对象
                        this.resMap.openInfoWindow(infoWindow, point);      //开启信息窗口
                    });
                }
            },
            /**
            *  左侧搜索
            **/
            // enter键
            searchDown(ev){
                console.log('回车----')
                let e = ev || window.ev;
                if (e.keyCode === 13) {
                    this.searchFun()
                }
            },
            // 清空搜索
            clearInputSearch() {
                console.log('清空搜索',this.activeSearchKind)
                if(this.activeSearchKind == '1') {
                    this.searchResList = []
                } else if (this.activeSearchKind == '2') {
                    for(let key of this.onlineMarkers) {
                        this.resMap.removeOverlay(key)
                    }
                    this.searchOnlineList = []
                }
            },
            // 搜索
            searchFun() {
                console.log('在线搜索----',this.activeSearchKind)
                if(!this.selectName) {
                    sessFun.messageFun('warning','请输入关键字！')
                    return
                }
                if(this.activeSearchKind == '1') {
                    // 亲邻社区搜索
                    this.searchResList = this.resInfo.filter((item,index) => {
                        if (item.resName.includes(this.selectName)) {
                            return item
                        }
                    })
                    if(this.searchResList.length <= 0) {
                        sessFun.messageFun('warning','搜索不到相关的亲邻资源，请换一个搜索姿势o')
                    }
                } else {
                    // 在线搜索
                    this.onlineSearchFun()
                }
            },
            // 在线搜索
            onlineSearchFun(){
                this.searchOnlineLoading = true
                console.log('在线搜索----')
                let resultArray = []
                let options = {
                    onSearchComplete: (results) => {
                        // 判断状态是否正确
                        if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                            let totalResults = results.getNumPois();
                            let totalPages = results.getNumPages();
                            let currPage = results.getPageIndex();// 获取当前是第几页数据
                            for (let i = 0; i < results.getCurrentNumPois(); i++) {
                                //在当前页面下获取页面中的内容
                                resultArray.push({
                                    id: results.getPoi(i).uid,
                                    title: results.getPoi(i).title,
                                    address: results.getPoi(i).address,
                                    city: results.getPoi(i).city,
                                    province: results.getPoi(i).province,
                                    point: results.getPoi(i).point,
                                })
                            }
                            if (currPage < totalPages - 1) {
                                // 遍历到最后一页之后不再进行下一页搜索，此时，已经获取到全部的搜索结果
                                local.gotoPage(results.getPageIndex() + 1);
                            } else {
                                this.searchOnlineList = resultArray
                                this.onlineResultsMarker()
                                console.log("全部结果有：", resultArray, "------原本搜索结果有：", totalResults);
                            }
                        } else {
                            sessFun.messageFun('warning','检索异常')
                        }
                    },
                    pageCapacity: 50
                };
                let local = new BMap.LocalSearch(this.resMap, options);
                local.search(this.selectName);
            },
            // 在线结果打点
            onlineResultsMarker() {
                this.onlineMarkers = []
                let i = 0
                for (let key of this.searchOnlineList) {
                    if (i < 100) {
                        let myIcon = new BMap.Icon(require('../../assets/images/map/onlineIcon.png'), new BMap.Size(32,32),{
                            anchor: new BMap.Size(16, 16)
                        });
                        let marker = new BMap.Marker(key.point,{icon:myIcon});  // 创建标注
                        marker.setTop(true);
                        this.onlineMarkers.push(marker)
                        this.resMap.addOverlay(marker);            // 将标注添加到地图中
                        marker.addEventListener("click", () => {
                            let content =
                                "<div>" +
                                "<p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>"
                                + key.title + "</p>" +
                                "<p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>" +
                                "地址:" + key.address + "</p>" +
                                "</div>";
                            // 信息窗口
                            let opts = {
                                width: 0,
                                height: 0,
                                title: "",
                                enableMessage: false    //设置允许信息窗发送短息
                            }
                            let infoWindow = new BMap.InfoWindow(content, opts);    // 创建信息窗口对象
                            this.resMap.openInfoWindow(infoWindow, key.point);      //开启信息窗口
                        });
                    } else {
                        break
                    }
                    i++
                }
                this.searchOnlineLoading = false
            },
            // 亲邻社区全选
            selectAllFun(){
                for(let key of this.searchResList) {
                    if(!key.isSelect) {
                        key.isSelect = true
                        this.selectResList.push(key)
                        this.createCircle(key.resID, new BMap.Point(key.lng, key.lat))
                        this.judgeMarkerShow(key.lng,key.lat)
                    }
                }
                console.log('全选',this.selectResList,this.resMarkers[0].point.lng)
            },
            // 判断marker是否隐藏
            judgeMarkerShow(lng,lat) {
                // console.log('lng,lat',lng,lat)
                for(let key of this.resMarkers) {
                    if(key.point.lng == lng && key.point.lat == lat) {
                        key.show()
                        break
                    }
                }
            },
            // 在线全选
            onlineSelectAll() {
                console.time('在线全选耗时')
                this.isActiveASOL = true
                let timer = setTimeout(()=>{
                    this.isActiveASOL = false
                    clearTimeout(timer)
                },500)
                if(this.isAllSelectOnline) {
                    for(let key of this.searchOnlineList) {
                        if(!key.isSelect) {
                            key.isSelect = true
                            this.onlineCheckBox(key)
                        }
                    }
                } else {
                    this.canceAllOnline()
                }
                console.timeEnd('在线全选耗时')
            },
            // 取消在线选择
            canceAllOnline() {
                for(let key of this.searchOnlineList) {
                    if(key.isSelect) {
                        key.isSelect = false
                        this.onlineCheckBox(key)
                    }
                }
            },
            // 勾选/取消
            checkBoxFun(item) {
                console.log('亲邻item', item)
                if (item.isSelect) {
                    // 取消选定
                    this.deleteRes(item)
                } else {
                    // 选定
                    let point = new BMap.Point(item.lng, item.lat);
                    // 圈起标识
                    this.createCircle(item.resID, point)
                    this.judgeMarkerShow(item.lng, item.lat)
                    item.isSelect = true
                    // 添加到选中列表
                    this.pushSelectList(item)
                }
            },
            // 添加到选中列表
            pushSelectList(item) {
                this.selectResList.push(item)
            },
            // 在线勾选/取消
            onlineCheckBox(item) {
                console.log('在线item', item)
                for(let key of this.onlineMarkers) {
                    if(key.point.lat  === item.point.lat && key.point.lng  === item.point.lng) {
                        let onlineIcon =  ''
                        if(item.isSelect) {
                            onlineIcon = require('../../assets/images/map/isActiveIcon.png')
                        } else {
                            onlineIcon = require('../../assets/images/map/onlineIcon.png')
                        }
                        let myIcon = new BMap.Icon(
                            onlineIcon,
                            new BMap.Size(32, 32),
                            {
                                anchor: new BMap.Size(16, 16),
                                imageSize: new BMap.Size(32, 32),    // 引用图片实际大小
                            });
                        key.setIcon(myIcon)
                    }
                }
            },
            // 画圆标识选中状态
            createCircle(id,point){
                // console.log('id,point',id,point)
                let opts = {
                    position : point,    // 指定文本标注所在的地理位置
                    offset   : new BMap.Size(-12, -9)    //设置文本偏移量
                }
                let label = new BMap.Label(id, opts);  // 创建文本标注对象
                label.setStyle({
                    color : "rgba(0,0,0,0)",
                    fontSize : "12px",
                    height : "12px",
                    width: "20px",
                    background: 'rgba(0,0,0,0)',
                    border: "1px solid rgba(255,0,0,0.85)",
                    borderRadius: "50%"
                });
                this.resMap.addOverlay(label);
            },
            // 删除覆盖物
            deleteCircle(id) {
                let allOverlay = this.resMap.getOverlays();
                console.log('allOverlay',allOverlay)
                for (let i = 0; i < allOverlay.length; i++) {
                    if (allOverlay[i].content == id) {
                        this.resMap.removeOverlay(allOverlay[i]);
                        break;
                    }
                }
            },
            // 在线搜索确定
            onlineConfirm() {
                this.selectOnlineList = this.searchOnlineList.filter(item=>{
                    if(item.isSelect) {
                        return item
                    }
                })
                if(this.searchOnlineList.length) {
                    this.searchDialogVisible = true
                    this.searchLoading = false
                } else {
                    sessFun.messageFun('warning','请勾选信息')
                }
            },
            changeInput() {
                this.aroundSearchInfo.searchRadius = Number(this.aroundSearchInfo.searchRadius)
            },
            // 周边搜索
            searchAround() {
                console.log('---------周边搜索------开始---------')
                console.log('this.selectOnlineList',this.selectOnlineList)
                this.searchLoading = true
                let timer = setTimeout(()=>{
                    this.searchResList = []
                    let radius = this.aroundSearchInfo.searchRadius * 1000
                    for (let key of this.selectOnlineList) {
                        let circle = new BMap.Circle(key.point, radius, {
                            strokeColor: 'rgba(24,144,255,1)',
                            fillColor: 'rgba(24,144,255,0.15)',
                            strokeWeight: 2,
                            fillOpacity: 1,
                            strokeOpacity: 1
                        });
                        this.resMap.addOverlay(circle);
                        if(this.aroundSearchInfo.searchRadio == 1) {
                            this.showResInCircle(key, radius)
                        } else if (this.aroundSearchInfo.searchRadio == 2) {
                            this.ShowIntersectionInCircle(key, radius)
                        }
                        this.searchDialogVisible = false
                        this.isOnlineSearch = true
                    }
                    if(this.aroundSearchInfo.searchRadio == 2) {
                        // 计算交集
                        this.computeINtersection()
                    }
                    console.log('---------周边搜索------结束---------')
                    this.searchLoading = false
                    clearTimeout(timer)
                },10)
            },
            // 并集显示圆半径内的小区
            showResInCircle(data,radius) {
                console.time('圆半径内小区')
                let point = data.point
                for (let rkey of this.resMarkers) {
                    let distance = this.resMap.getDistance(point, rkey.point)
                    if (distance > radius) {
                        // 多个圆时
                        rkey.inCircleNum ? rkey.show() : rkey.hide()
                    } else {
                        rkey.inCircleNum++
                        rkey.show()
                        // 标注marker匹配亲邻小区
                        for(let key of this.resInfo) {
                            // if(rkey.getLabel().content === key.resName) {
                            if(rkey.point.lng == key.lng && rkey.point.lat == key.lat) {
                                // 判断是否已存在左侧结果列表
                                let flag = this.searchResList.some((item, index) => {
                                    if (key.resID === item.resID) {
                                        return true
                                    }
                                })
                                let centerInfo = {
                                    centerAddress: data.address || '',
                                    city: data.city || '',
                                    point: data.point || '',
                                    centerName: data.title || ''
                                }
                                if (flag) {
                                    // 多中心点保存
                                    key.mapCenter ? key.mapCenter.push(centerInfo) : key.mapCenter = [centerInfo]
                                } else {
                                    key.mapCenter = [centerInfo]
                                    this.searchResList.push(key)
                                }
                                break
                            }
                        }
                    }
                }
                console.timeEnd('圆半径内小区')
            },
            // 交集显示圆半径内的小区 this.onlineMarkers
            ShowIntersectionInCircle(data,radius) {
                console.time('交集圆半径内小区')
                let point = data.point
                for (let rkey of this.resMarkers) {
                    let distance = this.resMap.getDistance(point, rkey.point)
                    if (distance > radius) {
                        // 多个圆时
                        rkey.inCircleNum ? rkey.show() : rkey.hide()
                    } else {
                        rkey.inCircleNum++
                        let centerInfo = {
                            centerAddress: data.address || '',
                            city: data.city || '',
                            point: data.point || '',
                            centerName: data.title || ''
                        }
                        rkey.mapCenter ? rkey.mapCenter.push(centerInfo) : rkey.mapCenter = [centerInfo]
                        rkey.show()
                    }
                }
                //
                console.timeEnd('交集圆半径内小区')
            },
            // 计算交集
            computeINtersection() {
                for (let rkey of this.resMarkers) {
                    if(rkey.inCircleNum >= 2) {
                        rkey.show()
                        // 标注marker匹配亲邻小区
                        for(let key of this.resInfo) {
                            // if(rkey.getLabel().content === key.resName) {
                            if(rkey.point.lng == key.lng && rkey.point.lat == key.lat) {
                                // 判断是否已存在左侧结果列表
                                let flag = this.searchResList.some((item, index) => {
                                    if (key.resID === item.resID) {
                                        return true
                                    }
                                })
                                if (flag) {
                                    // 多中心点保存
                                    key.mapCenter = JSON.parse(JSON.stringify(rkey.mapCenter))
                                } else {
                                    key.mapCenter = JSON.parse(JSON.stringify(rkey.mapCenter))
                                    this.searchResList.push(key)
                                }
                                break
                            }
                        }
                    } else {
                        rkey.hide()
                    }
                }
            },
            // 重新设置在线搜索
            setOnlineSearch() {
                this.searchDialogVisible = true
                // 移除
                let allOverlay = this.resMap.getOverlays();
                for (let akey of allOverlay) {
                    if (akey.toString() == "[object Circle]" || akey.toString() == "[object Polygon]" || akey.toString() == "[object Polyline]") {
                        this.resMap.removeOverlay(akey);
                    }
                }
                this.initResMarkers()
                this.selfMotionPolylines = []
            },
            // 取消在线搜索
            clearSearch() {
                if(this.isMouseSearch) {
                    // 取消鼠标画圆
                    this.deleteDrawingOverlay()
                } else if(this.isMultiPoint){
                    this.isMultiPoint = false
                    this.transfersFun()
                    this.searchResList = []
                } else {
                    // 周边搜索
                    this.isOnlineSearch = false
                    let allOverlay = this.resMap.getOverlays();
                    for (let akey of allOverlay) {
                        if (akey.toString() == "[object Circle]" || akey.toString() == "[object Polygon]" || akey.toString() == "[object Polyline]") {
                            this.resMap.removeOverlay(akey);
                        }
                    }
                    this.initResMarkers()
                    // 移除
                    for (let key of this.selectOnlineList) {
                        this.deleteCircle(key.id)
                    }
                    this.selfMotionPolylines = []
                }

            },
            // 恢复打点原始状态
            initResMarkers() {
                // console.time('恢复打点原始状态')
                let i = 0
                for (let key of this.resMarkers) {
                    if (i < 1000) {
                        key.show()
                    } else {
                        key.hide()
                    }
                    // 移除标识marker在圆内到标识
                    if(key.inCircleNum) {
                        key.inCircleNum = 0
                        // 判断是否存在被自动测距修改过到label
                        let labelName = key.getLabel().content
                        if(labelName.includes('(') && labelName.includes(')')) {
                            labelName = labelName.split('(')[0]
                            key.getLabel().setContent(labelName)
                        }
                    }
                    if (key.mapCenter) {
                        key.mapCenter = ''
                    }
                    i++
                }
                // console.timeEnd('恢复打点原始状态')
            },
            //
            /**
             *  顶部过滤条件
             * */
            // 中转判断
            transfersFun() {
                if(this.isShare) {
                    this.getShareResList()
                } else {
                    this.getResList()
                }
            },
            selectNum(item,temp) {
                console.log('item,temp',item,temp)
                let datas = item.split('-')
                console.log(datas)
                if(temp === 'price') {
                    this.buildPrice = datas
                    this.filterData.bPrice = true
                    this.popoverShow.bPrice = false
                } else if (temp === 'house') {
                    this.houseNum = datas
                    this.filterData.hNum = true
                    this.popoverShow.hNum = false
                } else if (temp === 'year') {
                    this.liveYear = datas
                    this.filterData.lYear = true
                    this.popoverShow.lYear = false
                }
                this.transfersFun()
            },
            // 区域
            filterArea() {
                console.log('区域',this.selectArea)
                this.transfersFun()
            },
            // 楼盘类型
            filterBuildType() {
                console.log('楼盘类型---',this.bType)
                // if(this.bType) {
                    this.transfersFun()
                // }
            },
            // 广告限制
            filterADLimit(limit) {
                console.log('广告限制limit', limit) //
                if (limit && limit.length) {
                    this.transfersFun()
                }
            },
            // 住户数量过滤
            filterHouseNum() {
                if (this.houseNum[0] == '' || this.houseNum[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误')
                } else {
                    this.filterData.hNum = true
                    for(let i in this.houseNum){
                        this.houseNum[i] = Number(this.houseNum[i])
                    }
                    this.transfersFun()
                    this.popoverShow.hNum = false
                }
            },
            // 楼盘价格过滤
            filterBuildPrice() {
                if (this.buildPrice[0] == '' || this.buildPrice[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误')
                } else {
                    for(let i in this.buildPrice){
                        Number(this.buildPrice[i])
                    }
                    this.filterData.bPrice = true
                    this.transfersFun()
                    this.popoverShow.bPrice = false
                }
            },
            // 年份过滤
            filterLiveYear() {
                if (this.liveYear[0] == '' || this.liveYear[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误')
                } else {
                    this.filterData.lYear = true
                    this.transfersFun()
                    this.popoverShow.lYear = false
                }
            },
            // 所在商圈
            filterTradingArea() {
                if(this.selectTradingArea) {
                    this.transfersFun()
                }
            },
            // 媒体类型（消防门、钣金门等）
            filterDoorType() {
                if(this.selectDoorType) {
                    this.transfersFun()
                }
            },
            // 媒介载体
            filterMediaType () {
                if(this.selectMediaType) {
                    this.transfersFun()
                }
            },
            // 媒体等级
            filterMediaLevel () {
                if(this.selectMediaLevel) {
                    this.transfersFun()
                }
            },
            // 清空
            emptyFun(letter) {
                if (letter === 'house') {
                    this.houseNum = ['', '']
                    this.filterData.hNum = false
                } else if (letter === 'bPrice') {
                    this.buildPrice = ['', '']
                    this.filterData.bPrice = false
                } else if (letter === 'liveYear') {
                    this.liveYear = ['', '']
                    this.filterData.lYear = false
                }
            },
            // 清空条件
            clearFilter() {
                this.houseNum = ['', '']
                this.buildNum = ['', '']
                this.buildPrice = ['', '']
                this.liveYear = ['', '']
                this.selectDoorType = ''
                this.selectMediaType = ''
                this.selectMediaLevel = ''
                this.selectLimits = []
                this.selectArea = []
                this.transfersFun()
            },
            /**
             *  左下选中框
             **/
            // 删除选中社区
            deleteRes(item) {
                this.deleteCircle(item.resID)
                item.isSelect = false
                for (let i = 0; i < this.selectResList.length; i++) {
                    if (this.selectResList[i].resID === item.resID) {
                        this.selectResList.splice(i, 1)
                        break
                    }
                }
            },
            // 删除全部
            deleteAll() {
                for (let key of this.selectResList) {
                    key.isSelect = false
                    this.deleteCircle(key.resID)
                }
                this.selectResList = []
            },
            // 选定提交小区资源ID
            pushMapRes(){
                console.log('selectResList',this.selectResList)
                if (!this.selectResList.length) {
                    sessFun.messageFun('warning','请选择小区')
                    return
                }
                let arr = this.selectResList.map(item=>{
                    return {
                        resID: item.resID,
                        centerInfo:item.mapCenter || []
                    }
                })
                let params = {
                    startTime: this.adListParams.ls,
                    endTime: this.adListParams.le,
                    resIDList: arr,
                }
                console.log('选定提交小区资源IDparams',params)
                api.postApi_json(this.apiVar.mapApi + '/adsList',params).then(res=>{
                    console.log('res',res)
                    if(res.data.SysCode === 200200) {
                        localStorage.setItem('qinlinMapCode',res.data.data)
                        this.mapDialogVisible = true
                    } else {
                        sessFun.messageFun('warning', res.data.MSG || '小区提交失败')
                    }
                }).catch(err=>{
                    sessFun.messageFun('warning','小区提交异常')
                })
            },
            // 关闭窗口
            closeWin() {
                try {
                    this.mapDialogVisible = false
                    window.opener = window;
                    let win = window.open("","_self");
                    win.close();
                    //frame的时候
                    top.close();
                } catch (e) {
                    sessFun.messageFun('warning', '自动关闭窗口异常，请手动关闭当前窗口')
                }
            },
            // 导出exc
            exportExcel(){
                if(this.selectResList.length) {
                    let time = timeFormat.toDateTime(new Date(), '').split(' ')
                    let timeString = time[0] + time[1].split(':').join('')
                    let name = '资源列表' + timeString
                    let resultArr = [];
                    for(let data of this.selectResList) {
                        let obj = {
                            resName: data.resName,
                            city: this.routeQuery.city,
                            rName: data.districtName,
                            resAddress: data.address,
                            tradingArea: data.tradingArea,
                            fNum: data.fNum == '0' ? '#' : data.fNum,
                            hNum: data.hNum == '0' ? '#' : data.hNum,
                            cType: data.cType,
                            hPrice: data.hPrice / 100,
                            chDay: data.chDay || '',
                            notPush: data.adLimit || '',
                            mRemark: data.mRemark || '',
                            mediaNum: data.mediaCount || '',
                        };
                        resultArr.push(obj);
                    }
                    require.ensure([], () => {
                        const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                        const tHeader = ['资源名称', '市', '区域', '详细地址','商圈','楼栋数量', '住户数量/办公室数量','楼盘价格','楼盘类型/写字楼类型','入住年份/建成年份','广告限制','媒体备注', '媒体数量（门）'];
                        const filterVal = ['resName', 'city', 'rName', 'resAddress','tradingArea', 'fNum',  'hNum',  'hPrice','cType', 'chDay','notPush', 'mRemark','mediaNum'];
                        const list = resultArr;
                        const data = this.formatJson(filterVal, list);
                        export_json_to_excel(tHeader, data, name);
                        this.isDown = false;
                    })
                } else {
                    sessFun.messageFun('warning','请选择社区')
                }
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            // 获取分享资源
            getShareResList() {
                let params = {
                    shareCode: this.routeQuery.code,
                    districtId: this.selectArea.join(','),    // 区域
                    cType: this.bType,                        // 楼盘类型
                    minhPrice: this.buildPrice[0] * 100,
                    maxhPrice: this.buildPrice[1] * 100,
                    minhNum: this.houseNum[0],
                    maxhNum: this.houseNum[1],
                    minchDay: this.liveYear[0],
                    maxchDay: this.liveYear[1],
                    tradingArea: this.tradingArea,
                    adLimit: this.selectLimits.join(','),
                    mType: this.selectDoorType,
                    mVehicle: this.selectMediaType,
                    grade: this.selectMediaLevel
                }
                for(let i in params) {
                    if(!params[i]) {
                        delete params[i]
                    }
                }
                api.postApi(this.apiVar.mapApi + '/shareAdsInfo',params).then(res=>{
                    console.log('分享list',res)
                    if(res.data.SysCode === 200200) {
                        this.resInfo = res.data.data.resList
                        this.creatMarker()
                        this.setLimitsDoorTypeAndTradingArea(res.data.data)
                    } else {
                        sessFun.messageFun('warning','数据获取异常')
                    }
                    // 城市边界
                    this.displayBoundary()
                    this.mapLoading = false
                })
            },
            // 分享时设置广告限制、商圈、门体类型
            setLimitsDoorTypeAndTradingArea(data) {
                this.ADLimit = data.adLimits.map((item)=>{
                    return {
                        value: item,
                        label: item
                    }
                })
                this.tradingAreaList = data.tradingAreas.map((item)=>{
                    return {
                        value: item,
                        label: item
                    }
                })
                this.doorTypeList = data.mTypes.map((item)=>{
                    return {
                        value: item,
                        label: item
                    }
                })
            },
            // 分享
            resShare() {
                if(!this.selectResList.length) {
                    sessFun.messageFun('warning','请选择小区')
                    return
                }
                let arr = this.selectResList.map(item=>{
                    return item.resID
                })
                let params = {
                    resIDs: arr.join(',')
                }
                console.log('分享arr',arr)
                api.postApi(this.apiVar.mapApi + '/shareCode',params).then(res=>{
                    console.log('res分享',res)
                    if(res.data.SysCode === 200200) { // ADResourcesMap/shareRes
                        // this.shareUrl = this.apiVar.qadnUrl + '/test/shareRes?city='+ this.routeQuery.city +'&code=' + res.data.data
                        this.shareUrl = this.apiVar.qadnUrl + '/ADResourcesMap/shareRes?city='+ this.routeQuery.city +'&code=' + res.data.data
                        this.copyDialogVisible = true
                        console.log('shareUrl',this.shareUrl)
                    } else {
                        sessFun.messageFun('warning',res.data.MSG || '分享异常')
                    }
                })
            },
            // 复制分享链接
            copyUrl() {
                let oInput = document.createElement('input');
                oInput.value = this.shareUrl;
                document.body.appendChild(oInput);
                oInput.select();                    // 选择对象
                document.execCommand("Copy");       // 执行浏览器复制命令
                oInput.style.display = 'none';
                sessFun.messageFun('success','复制成功')
                this.copyDialogVisible = false
            },
        },
    }
</script>

<style scoped>
    #qinlinMap {
        position: fixed !important;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 1;
    }

    /* 左侧搜索 */
    .left_search_box {
        position: fixed;
        width: 288px;
        top: 20px;
        left: 32px;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.12);
    }

    /deep/ .el-input__inner{
        border: none;
        border-left: 1px solid rgba(232,232,232,1);
    }

    /deep/ .el-input-group__prepend {
        width: 64px;
        background: #fff;
        border: none;
    }

    .search_body {
        background: #fff;
        margin-top: 8px;
        box-shadow:0 0 8px 0 rgba(0,0,0,0.12);
        padding: 3px;
        border-radius: 4px;
    }

    .search_result_btn{
        display: flex;
        height: 32px;
        border-bottom: 1px solid rgba(232,232,232,1);
        line-height: 32px;
        font-size:14px;
        padding: 0 12px;
    }

    .result_title {
        width: 88px;
    }

    .result_btn_box {
        flex: 1;
        text-align: right;
        color:rgba(24,144,255,1);
    }

    .result_btn_box span {
        cursor: pointer;
        display: inline-block;
        margin-left: 4px;
    }

    .result_btn_box span:hover {
        color:rgba(24,144,255,0.9);
    }

    .search_ul {
        height: 408px;
        overflow-y: auto;
    }

    .search_li {
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        padding: 12px;
    }

    .li_name {
        font-size: 15px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        position: relative;
        padding-right: 48px;
    }

    .li_name_span{
        position: absolute;
        right: 0;
        top: -1px;
        display: inline-block;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color:rgba(24,144,255,1);
        border-radius:2px;
        border:1px solid rgba(24,144,255,1);
        padding: 2px 3px;
        cursor: pointer;
    }

    .li_name_span:hover{
        color:rgba(24,144,255,0.8);
        border:1px solid rgba(24,144,255,0.8);
    }

    .li_name_span_active{
        color: #D9D9D9;
        border:1px solid rgba(217,217,217,1)
    }

    .li_name_span_active:hover{
        color: #999;
        border:1px solid #999;
    }

    .li_address {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        line-height: 26px;
        margin-bottom: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .li_p_span {
        display: inline-block;
        padding: 2px 6px;
        background:rgba(0,0,0,0.06);
        border-radius: 2px;
        margin-right: 6px;
        color:rgba(0,0,0,0.35);
        font-size: 12px;
    }

    .search_bottom_btn {
        text-align: center;
        padding: 8px 0;
        border-top:1px solid rgba(232,232,232,1)
    }

    .search_bottom_btn /deep/ .el-button.online_search_btn{
        min-width: 72px;
        margin-left: 0;
    }

    /*在线搜索*/
    .li_name_online{
        position: relative;
    }

    .li_name_online /deep/ .el-checkbox{
        position: absolute;
        right: 4px;
        top: 0;
    }

    .online_search_span{
        color:rgba(0,0,0,0.85);
        font-size: 14px;
        display: inline-block;
        margin-right: 8px;
    }

    /deep/ .map_dialog .el-dialog__body{
        padding: 8px 20px 0;
    }

    .around_search_body p{
        display: flex;
        margin-bottom:16px;
    }

    .p_span{
        width: 74px;
    }

    .p_slider{
        flex: 1;
        -webkit-box-flex: 1;
        -ms-flex: 1;
    }

    .p_slider /deep/ .el-slider__runway{
        margin: 6px 0;
    }

    .radius_input{
        width: 48px;
        height: 28px;
        margin: 0 4px;
        top: -4px;
    }

    /deep/ .radius_input.el-input--small .el-input__inner{
        height: 28px;
        line-height: 28px;
        padding: 0 6px;
        border: 1px solid rgba(232,232,232,1);
    }


    /*顶部过滤条件*/
    .top_filter_box{
        position: fixed;
        top:20px;
        right: 16px;
        height: 42px;
        max-width: 905px;
    }

    .top_filter_box /deep/ .el-button{
        line-height: 30px;
    }

    .top_filter_box /deep/ .el-select{
        width: 145px;
        margin-bottom: 8px;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.12)
    }

    .top_filter_box /deep/ .el-input__inner{
        color: rgba(0,0,0,0.85);
        border: 1px solid #fff;
        font-size: 14px;
    }

    .input_wrap{
        padding: 8px 8px 8px;
        border-bottom: 1px solid #E8E8E8;
    }

    .input_wrap .filter_input{
        width: 42%;
        height:24px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        border:1px solid rgba(194,194,194,1);
        text-align: center;
    }

    .popover_footer_btn{
        padding: 0 8px 8px;
    }

    .el-button.popover_btn{
        width: 43%;
        min-width: 40px;
        height: 26px;
        margin-top: 8px;
        padding: 0;
        font-size: 12px;
        text-align: center;
        line-height: 22px;
        border-radius: 4px;
    }

    .el-button.popover_btn + .el-button{
        float: right;
        margin-left: 0;
    }

    /deep/ .otherBtn.el-button{
        border-radius: 4px;
        color:rgba(0,0,0,0.35);
        min-width: 110px;
        width: 145px;
        margin-bottom: 8px;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.12);
        border: none;
    }

    /deep/ .otherBtn.el-button:hover{
        border-color: #c0c4cc;
        /*color: #1890FF;*/
    }

    .top_btn{
        position: relative;
        text-align: left;
        padding: 0 30px 0 15px;
    }

    .top_btn /deep/ .icon_arrow{
        position: absolute;
        right: 12px;
        top: 8px;
    }

    /deep/ .filter_btn span{
        color:rgba(0,0,0,0.85);
        font-size: 14px;
    }

    .filter_ul{
        padding-top: 8px;
    }

    .filter_ul li{
        line-height: 28px;
        cursor: pointer;
        color:rgba(0,0,0,0.65);
        padding: 0 8px;
    }

    .filter_ul li:hover{
        background:rgba(230,247,255,1);
    }

    .border_p{
        margin: 8px 0;
        border-top: 1px solid #E8E8E8;
    }

    .top_filter_box /deep/ .el-select__tags{
        max-width: 110px !important;
    }

    .top_filter_box /deep/ .el-button.top_filter_btn{
        min-width: 72px;
        margin-left: 0;
        border: none;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.12);
    }

    /*  底部选中 */
    .bottom_left_active{
        position: fixed;
        bottom: 24px;
        left: 32px;
        width: 288px;
        background: #fff;
        border-radius: 4px;
        font-size: 14px;
        color: #333;
        z-index: 99;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.12);
    }

    .bottom_left_header {
        line-height: 32px;
        display: flex;
        padding: 0 16px;
        color:rgba(0,0,0,0.85);
        border-bottom: 1px solid rgba(232,232,232,1);
        font-weight: 600;
    }

    .active_num {
        flex: 1
    }

    .active_arrow {
        width: 50px;
        text-align: center;
        cursor: pointer;
        color:rgba(0,0,0,0.35);
        font-size: 12px;
    }

    .active_arrow .el-icon-d-arrow-left {
        transform: rotate(-90deg);
    }

    .active_arrow_hide .el-icon-d-arrow-left{
        transform: rotate(90deg);
    }

    .active_ul {
        height: 140px;
        overflow-y: auto;
        padding-top: 4px;
    }

    .active_li {
        display: flex;
        line-height: 28px;
        padding: 0 16px;
        color:rgba(0,0,0,0.85)
    }

    .active_li_resName {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .active_li .el-icon-delete {
        width: 24px;
        line-height: 24px;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
        color: rgba(0,0,0,0.45);
    }

    .active_bottom_btn {
        padding: 0 8px;
        font-weight:400;
        color:rgba(0,0,0,0.65);
        font-size: 14px;
        height: 48px;
        line-height: 48px;
        border-top:1px solid rgba(232,232,232,1);
    }

    .active_bottom_btn /deep/ .el-button{
        margin-left: 32px;
        min-width: 64px;
    }

    .active_bottom_btn span{
        margin-left: 8px;
        cursor:pointer;
    }

    .active_bottom_btn span:hover{
        color:rgba(24,144,255,1);
    }

    .active_bottom_btn i{
        color:rgba(0,0,0,0.45)
    }

    /*分享复制*/
    /deep/ .copy_dialog .el-dialog__body{
        padding: 8px 18px;
    }

    /* 标注info框 */
    .res_info_header{
        padding: 0 0 8px 0;
        border-bottom: 1px solid rgba(232,232,232,1);
        margin-bottom: 8px;
    }

    .res_info_header h3{
        font-weight:600;
        color:rgba(0,0,0,0.85);
        font-size: 18px;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .res_info_header p{
        font-weight:400;
        color:rgba(0,0,0,0.65);
        font-size: 12px;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .res_info_content{
        max-height: 213px;
        overflow-y: auto;
        margin-bottom: 8px;
        border-bottom: 1px solid rgba(232,232,232,1);
    }

    .res_info_content_li{
        font-weight:400;
        color:rgba(0,0,0,0.85);
        font-size: 12px;
        line-height: 26px;
        /*height: 26px;*/
    }

    .res_info_content_li span{
        color:rgba(0,0,0,0.65);
        /*display: inline-block;*/
        /*margin-left: 16px;*/
    }

    .res_info_content_li .content_li_title{
        display: inline-block;
        width: 72px;
        color:rgba(0,0,0,0.85);
    }

    .res_info_footer {
        text-align: right;
        position: relative;
    }

    .res_info_footer img{
        width: 18px;
        height: 21px;
        position: absolute;
        left: 0;
        top:6px;
        cursor: pointer;
    }

    .info_window_left{
        position: absolute;
        right: -236px;
        top: 0;
        height: 320px;
        width: 220px;
        background: #fff;
    }

    /*底部右侧控件*/
    .bottom_right_control{
        position: fixed;
        bottom: 16px;
        right: 24px;
        width: 265px;
    }

    .scale_control {
        width: 48%;
        height: 20px;
        background: #fff;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.12);
        border-radius:4px;
        float: right;
        padding: 6px 0;
    }

    .scale_control li {
        float: left;
        text-align: center;
        color:rgba(0,0,0,0.65);
        font-size: 12px;
        border-right: 1px solid #E8E8E8;
    }

    .scale_control li:last-child{
        border-right: none;
    }

    .li_map_zoom {
        width: 44%;
        height: 20px;
    }

    .zoom_scale {
        height: 8px;
        margin: 0 10%;
        border-bottom: 1px solid rgba(0,0,0,0.5);
        border-left: 1px solid rgba(0,0,0,0.5);
        border-right: 1px solid rgba(0,0,0,0.5);
        position: relative;
        top: -4px;
    }

    .scale_control .li_btn {
        width: 26%;
        line-height: 20px;
        font-size: 16px;
        color:rgba(0,0,0,0.85);
        cursor: pointer;
    }

    .mouse_control {
        width: 48%;
        height: 32px;
        float: left;
        margin-right: 2%;
        background: #fff;
        box-shadow:0px 0px 8px 0px rgba(0,0,0,0.12);
        border-radius:4px;
    }

    .mouse_control_li{
        float: left;
        width: 25%;
        text-align: center;
        line-height: 34px;
        cursor: pointer;
    }

    .mouse_control_li:hover{
        background:rgba(24,144,255,0.1);
    }

    .mouse_control_li:after{
        content: "";
        color: #d9d9d9;
        position: relative;
        left: 8px;
        border-right: 1px solid #E8E8E8;
    }

    .mouse_control_li:last-child:after{
        content: "";
        border-right: none;
    }

    .mouse_control_li img {
        width: 16px;
        height: 16px;
    }

    .mouse_polyline_body p{
        padding: 0 16px;
        cursor: pointer;
        font-size: 14px;
        line-height: 28px;
        text-align: center;
        font-weight:400;
        color:rgba(0,0,0,0.65);
    }

    .mouse_polyline_body p:hover{
        background:rgba(24,144,255,0.1);
    }

    /*媒体列表*/
    /deep/ .media_list_dialog .el-dialog__title{
        font-weight: 600;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    /deep/ .media_list_dialog .el-dialog__body {
        padding: 0;
    }

    /deep/ .media_list_dialog .el-dialog__header{
        padding: 12px 18px;
    }

    /deep/ .media_list_dialog .el-dialog__headerbtn{
        top: 12px
    }

    .media_list_body {
        height: auto;
        overflow-y: auto;
        max-height: 340px;
        border-top: 1px solid rgba(232,232,232,1);
    }

    .list_li {
        border-bottom: 1px solid rgba(232,232,232,1);
        line-height: 24px;
        padding: 6px 18px;
    }

    .li_header {
        position: relative;
    }

    .li_header h4 {
        display: inline-block;
        font-size: 16px;
        font-weight: 600;
        color:rgba(0,0,0,0.85);
        margin-right: 4px;
    }

    .li_header img {
        width: 28px;
        height: 14px;
        position: absolute;
        top: 5px;
        /*vertical-align: middle;*/
    }

    .li_header /deep/ .el-icon-picture-outline {
        float: right;
        margin-top: 6px;
        font-size: 16px;
        cursor:pointer;
        color: rgba(0,0,0,0.45);
    }

    .li_p{
        font-size: 14px;
        color:rgba(0,0,0,0.85);
        margin-bottom: 4px;
    }

    .li_p span {
        display: inline-block;
        padding: 0 6px;
        background:rgba(0,0,0,0.06);
        border-radius:2px;
        font-size: 12px;
        color:rgba(0,0,0,0.35);
        margin: 0 4px 0 0;
    }

    /*媒体图片*/
    /deep/.el-dialog__body{
        padding: 16px;
    }

    /*多点辐射*/
    .map_dialog_body ul{
        margin: 16px 0;
    }

    .map_dialog_li{
        margin-bottom: 16px;
    }

    .map_li_p{
        display: inline-block;
        float: left;
    }

    .more_radiation_select{
        float: left;
        margin-right: 14px;
    }

    .map_dialog_li /deep/ .el-input__inner{
        border: 1px solid rgba(232,232,232,1);
        width: 338px;
    }

    /deep/ .search_radius_input{
        float: left;
        width: 50px;
    }

    .map_dialog_li /deep/ .search_radius_input .el-input__inner{
        width: 50px;
    }

    /deep/ .search_radius_input .el-input-group__append{
        padding:  0 10px;
    }

    .del_icon{
        float: right;
        width: 42px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
    }

    .del_icon > i{
        color: rgba(255,0,0,0.85);
        font-size: 20px;
        font-weight: 500;
    }

    .add_row_btn{
        width: 442px;
        height: 30px;
        border-radius:4px;
        border:1px dashed rgba(0,0,0,0.15);
        color: rgba(24,144,255,1);
        cursor: pointer;
        font-size: 14px;
        text-align: center;
        line-height: 32px;
        margin-left: 74px;
    }

    .add_row_btn:hover{
        border:1px dashed rgba(24,144,255,1);
    }

    ::-webkit-scrollbar {
        width: 4px;
        height: 8px;
        background: #FAFAFA;
    }

    ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background:rgba(216,216,216,1);
        border-radius: 2px;
    }
</style>
<style>
    .el-popover.filter-popper,
    .el-popover.mouse_polyline{
        padding: 0;
    }
</style>
