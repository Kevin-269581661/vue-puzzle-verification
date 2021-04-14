<template>
    <div class="ad_mediaMana_wrap">
        <div class="ad_mediaMana_nav clearfix">
            <p><a href="#">方案管理</a><em> / </em><a href="#">编辑方案</a></p>
        </div>
        <div class="mediaMana_content_top">
            <div class="content_top_wrap">
                <!--填写客户信息-->
                <div class="step1" v-if="active==0"></div>
                <!--选择点位-->
                <div class="step2" v-if="active==1">
                    <div>
                        <div class="search-nav">
                            <div class="search-wrap">
                                <div style="margin-right: 0" v-show="isOccupied">
                                    <el-select v-model="activeSelect" placeholder="请选择" class="type-select" size="small">
                                        <el-option label="方案排斥" value="1"></el-option>
                                    </el-select>
                                    <el-select v-model="activeAdPlan" placeholder="请选择排斥方案" class="reject_select" size="small"
                                               @change="selectRejectPlan" filterable :clearable="true">
                                        <el-option v-for="item in rejectAdPlan" :key="item.value" :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </div>
                                <div>
                                    <el-input placeholder="请输入要搜索的内容" v-model="searchInput" class="input-with-select" @change="initData" size="small">
                                        <el-select v-model="selectValue" slot="prepend" class="type-select" @change="initData">
                                            <el-option v-for="item in typeSelect" :key="item.value" :label="item.value"
                                                       :value="item.value"></el-option>
                                        </el-select>
                                    </el-input>
                                </div>
                                <div>
                                    <el-date-picker
                                        v-model="dateInput"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy/MM/dd"
                                        format="yyyy/MM/dd"
                                        class="date-select input-with-select"
                                        :picker-options="pickerOptions"
                                    >
                                    </el-date-picker>
                                </div>
                                <div>
                                    <el-button type="primary" style="background: #1890FF" icon="el-icon-search"
                                               class="searchBtn" @click="searchFun" :disabled="searchBtnAbled"
                                               v-qadn-mta-h5="{id: 'a004_b008_c000_d000_bt049_ck01'}">搜索
                                    </el-button>
                                </div>
                                <div class="shopcar" @click="dialogVisible()">
                                    <el-badge :value="nowPointNum" class="item">
                                        <img src="../../assets/images/shopCar.png" alt="">
                                    </el-badge>
                                </div>
                            </div>
                            <el-row class="button_row">
                                <el-col>
                                    <el-button type="primary" class="map" icon="el-icon-location-outline"
                                               @click="setMapParams"
                                               v-qadn-mta-h5="{id: 'a004_b008_c000_d000_bt050_ck03'}">地图
                                    </el-button>
                                    <el-dropdown>
                                        <el-button type="success" class="importXle">
                                            导入<i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native.prevent="importFanan('res')"
                                                              v-qadn-mta-h5="{id: 'a004_b008_c000_d000_bt051_ck04'}">导入小区</el-dropdown-item>
                                            <el-dropdown-item @click.native.prevent="importFanan('ads')"
                                                              v-qadn-mta-h5="{id: 'a004_b008_c000_d000_bt052_ck04'}">导入点位</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                    <el-button type="primary" @click="importFanan('copy')"
                                               v-qadn-mta-h5="{id: 'a004_b008_c000_d000_bt054_ck04'}">复制方案</el-button>
                                    <el-button plain @click="dialogOneKeyPoint = true"
                                               v-qadn-mta-h5="{id: 'a004_b008_c000_d000_bt055_ck04'}">一键选点</el-button>
                                </el-col>
                            </el-row>
                        </div>
                        <!--类型区域选择面板-->
                        <div class="dw-panel"  v-show="isOccupied">
                            <dl>
                                <dt>资源类型：</dt>
                                <dd :class="recType === 1?'active': ''" @click="activeRecType(1)">社区</dd>
                                <dd :class="recType === 2?'active': ''" @click="activeRecType(2)">写字楼</dd>
                            </dl>
                            <dl>
                                <dt>媒体类型：</dt>
                                <dd :class="mediaType === '广告门'?'active': ''" @click="activeMediaType('广告门')">广告门</dd>
                                <dd :class="mediaType === '道闸'?'active': ''" @click="activeMediaType('道闸')">道闸</dd>
                            </dl>
                            <dl style="border: none">
                                <dt>城市区域：</dt>
                                <dd v-for="(item, index) in city" :key="index"
                                    :class=" index == activeIndex ? 'active' : ''"
                                    @click="activeCity(item,index)">{{item.rName}}
                                </dd>
                            </dl>
                            <dl class="city-proper" v-for="(list, index) of area" :key="index"
                                v-show=" index == activeIndex">
                                <dd v-for="(item, itemIndex) of list" :class="item.rName == areaName ? 'active' : ''"
                                    @click="activeArea(item)" :key="itemIndex">{{item.rName}}
                                </dd>
                            </dl>
                            <dl style="border: none">
                                <dt>其它条件：</dt>
                                <dd class="other-dd">
                                    <el-select v-model="mState" placeholder="媒体状态" class="otherSelect" :class="mState !== '' ? 'otherSelectActive' :'' "
                                        size="small"
                                        @change="mStateChange">
                                        <el-option label="正常" value="1"></el-option>
                                        <el-option label="待安装" value="2"></el-option>
                                    </el-select>
                                    <el-select v-model="limitList" placeholder="广告限制" class="otherSelect adLimitSelect"
                                        size="small"
                                        :class="limitList.length !== 0 ? 'otherSelectActive' :'' " multiple collapse-tags
                                        @change="activeADLimit">
                                        <el-option
                                            v-for="item in ADLimit"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="buildValue" :placeholder="recType == '1' ? '楼盘类型' : '写字楼类型'"
                                        size="small"
                                        :class="buildValue !== '' ? 'otherSelectActive' :'' "
                                        class="otherSelect" @change="tableHeaderFilter_cType">
                                        <el-option v-for="item in buildType" :key="item.buildValue"
                                                   :label="item.buildValue"
                                                   :value="item.buildValue">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="activeGrade" placeholder="媒体等级" class="otherSelect"
                                        size="small"
                                        @change="gradeChange" :class=" activeGrade !== '' ? 'otherSelectActive' :''">
                                        <el-option label="A级" value="A"></el-option>
                                        <el-option label="B级" value="B"></el-option>
                                        <el-option label="C级" value="C"></el-option>
                                    </el-select>
                                    <el-popover
                                        placement="bottom-start"
                                        width="155"
                                        trigger="click"
                                        popper-class="other-dd-popper">
                                        <div class="input-wrap" :class="HSearch === 'h'? 'focus': ''">
                                            <input type="text" class="input" v-model="houseNum[0]">
                                            -
                                            <input type="text" class="input" v-model="houseNum[1]">
                                            <el-button @click="emptyFun('H')" class="input-wrap-Btn">清 除 </el-button>
                                            <el-button type="primary" class="input-wrap-Btn"
                                                       @click="tableHeaderFilter_h()" >确 定
                                            </el-button>
                                        </div>
                                        <el-button slot="reference" class="otherBtn"
                                                   :class=" filterData.hNum ? 'otherBtnActive' : '' ">
                                            住户数量
                                        </el-button>
                                    </el-popover>
                                    <el-popover
                                        placement="bottom-start"
                                        width="155"
                                        trigger="click"
                                        popper-class="other-dd-popper">
                                        <div class="input-wrap" :class="HSearch === 'p'? 'focus': ''">
                                            <input type="text" class="input" v-model="buildPrice[0]">
                                            -
                                            <input type="text" class="input" v-model="buildPrice[1]">
                                            <el-button @click="emptyFun('P')" class="input-wrap-Btn">清 除 </el-button>
                                            <el-button type="primary" class="input-wrap-Btn"
                                                       @click="tableHeaderFilter_p()" >确 定
                                            </el-button>
                                        </div>
                                        <el-button slot="reference" class="otherBtn"
                                                   :class=" filterData.bPrice ? 'otherBtnActive' : '' ">
                                            楼盘价格
                                        </el-button>
                                    </el-popover>
                                    <el-popover
                                        placement="bottom-start"
                                        width="155"
                                        trigger="click"
                                        popper-class="other-dd-popper">
                                        <div class="input-wrap" :class="HSearch === 'p'? 'focus': ''">
                                            <input type="text" class="input" v-model="liveYear[0]">
                                            -
                                            <input type="text" class="input" v-model="liveYear[1]">
                                            <el-button @click="emptyFun('Y')" class="input-wrap-Btn">清 除 </el-button>
                                            <el-button type="primary" class="input-wrap-Btn"
                                                       @click="tableHeaderFilterByLiveYear()" >确 定
                                            </el-button>
                                        </div>
                                        <el-button slot="reference" class="otherBtn"
                                                   :class="filterData.lYear ? 'otherBtnActive' : '' ">
                                            入住年份
                                        </el-button>
                                    </el-popover>
                                    <el-popover
                                        placement="bottom-start"
                                        width="155"
                                        trigger="click"
                                        popper-class="other-dd-popper">
                                        <div class="input-wrap" :class="HSearch === 'PF'? 'focus': ''">
                                            <input type="text" class="input" v-model="peopleFlow[0]">
                                            -
                                            <input type="text" class="input" v-model="peopleFlow[1]">
                                            <el-button @click="emptyFun('PF')" class="input-wrap-Btn">清 除 </el-button>
                                            <el-button type="primary" class="input-wrap-Btn"
                                                       @click="tableHeaderFilterByPeopleFlow()" >确 定
                                            </el-button>
                                        </div>
                                        <el-button slot="reference" class="otherBtn"
                                                   :class=" filterData.pFlow ? 'otherBtnActive' : '' ">
                                            人流量
                                        </el-button>
                                    </el-popover>
                                    <el-popover
                                        placement="bottom-start"
                                        width="155"
                                        trigger="click"
                                        popper-class="other-dd-popper">
                                        <div class="input-wrap" :class="HSearch === 'PSN'? 'focus': ''">
                                            <input type="text" class="input" v-model="carFlow[0]">
                                            -
                                            <input type="text" class="input" v-model="carFlow[1]">
                                            <el-button @click="emptyFun('PSN')" class="input-wrap-Btn">清 除 </el-button>
                                            <el-button type="primary" class="input-wrap-Btn"
                                                       @click="tableHeaderFilterByCarFlow()" >确 定
                                            </el-button>
                                        </div>
                                        <el-button slot="reference" class="otherBtn"
                                                   :class="filterData.cFlow ? 'otherBtnActive' : '' ">
                                            车流量
                                        </el-button>
                                    </el-popover>
                                    <el-popover
                                        placement="bottom-start"
                                        width="155"
                                        trigger="click"
                                        popper-class="other-dd-popper">
                                        <div class="input-wrap" :class="HSearch === 'CF'? 'focus': ''">
                                            <input type="text" class="input" v-model="parkSpaceNum[0]">
                                            -
                                            <input type="text" class="input" v-model="parkSpaceNum[1]">
                                            <el-button @click="emptyFun('CF')" class="input-wrap-Btn">清 除 </el-button>
                                            <el-button type="primary" class="input-wrap-Btn"
                                                       @click="tableHeaderFilterByParkSpaceNum()" >确 定
                                            </el-button>
                                        </div>
                                        <el-button slot="reference" class="otherBtn"
                                                   :class="filterData.pSNum ? 'otherBtnActive' : '' ">
                                            车位数
                                        </el-button>
                                    </el-popover>
                                </dd>
                            </dl>
                        </div>
                        <div class="filter-condition" v-show="isOccupied&&filterCondition.length>0">
                            <el-tag
                                v-for="(tag, index) in filterCondition"
                                :key="index"
                                closable
                                :disable-transitions="false"
                                @close="filterTagCloseFun(tag,index)"
                                :type="tag.type"
                                size="medium">
                                {{tag.name}}
                            </el-tag>
                        </div>
                        <!--提示-->
                        <div class="tip">
                            <i class="el-icon-info"></i>
                            <p>共 <span>{{adsCount}}</span> 个点位，已选点位 <span>{{nowPointNum>0?nowPointNum:0}}</span> 个</p>
                        </div>
                        <!--表格-->
                        <div class="table_wrap adsTable">
                            <div class="myCheckbox" v-if="isOccupied">
                                <el-checkbox v-model="IsAll" @change="allCheckboxAds">全选本页</el-checkbox>
                            </div>
                            <el-table
                                v-loading="loading"
                                element-loading-text="玩命加载中..."
                                element-loading-spinner="el-icon-loading"
                                border
                                :data="planList"
                                :default-sort="{prop: 'mID', order: 'descending'}"
                                @cell-mouse-enter="mouseEnter"
                                @row-click="rowClick"
                                style="width: 100%"
                                class="selectAdsTable"
                                height="595">
                                <el-table-column
                                    fixed
                                    width="110px"
                                    class-name="el-table-column-checkbox">
                                    <template slot-scope="scope">
                                        <div v-if="isOccupied">
                                            <div class="adDoor" v-if="mediaType === '广告门'">
                                                <el-popover
                                                    v-if="scope.row.box.A"
                                                    placement="top-start"
                                                    width="310"
                                                    trigger="hover">
                                                    <span v-if="scope.row.adlInfo === ''">暂无被占信息</span>
                                                    <ul v-else>
                                                        <li v-for="(item, itemIndex) in scope.row.adlInfo" :key="itemIndex">
                                                            <div v-if="item.asState">
                                                                <p style="margin-bottom: 5px">
                                                                    <span style="color: #333">该点位：{{item.asState}}中</span>
                                                                </p>
                                                            </div>
                                                            <div v-else>
                                                                <p style="margin-bottom: 5px">
                                                                    <span style="color: #333">占点方案：</span>
                                                                    <span>
                                                              <span  style="font-weight: bold">{{sessionData.uType === 'MD' ? item.beOccupieApName : '******'}}</span>
                                                              方案（{{item.lState == 0 ? '预锁': (item.lState == 1 ? '被占' : '强制停止')}}）
                                                          </span>
                                                                </p>
                                                                <p><span style="color: #333">占点排期：</span>{{item.schedules}}</p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <el-checkbox slot="reference" v-model="scope.row.checkBox.A" label="A面"
                                                                 @change="changeA(scope.row)"
                                                                 :disabled="scope.row.box.A">
                                                    </el-checkbox>
                                                </el-popover>
                                                <el-checkbox v-else v-model="scope.row.checkBox.A" label="A面"
                                                             @change="changeA(scope.row)"
                                                             :disabled="scope.row.box.A">
                                                </el-checkbox>
                                                <el-popover
                                                    v-if="scope.row.box.B"
                                                    placement="top-start"
                                                    width="310"
                                                    trigger="hover">
                                                    <span v-if="scope.row.adlInfo === ''">暂无被占信息</span>
                                                    <ul v-else>
                                                        <li v-for="(item, adlInfoIndex) in scope.row.adlInfo" :key="adlInfoIndex">
                                                            <div v-if="item.asState">
                                                                <p style="margin-bottom: 5px">
                                                                    <span style="color: #333">该点位：{{item.asState}}中</span>
                                                                </p>
                                                            </div>
                                                            <div v-else>
                                                                <p style="margin-bottom: 5px">
                                                                    <span style="color: #333">占点方案：</span>
                                                                    <span>
                                                              <span  style="font-weight: bold">{{sessionData.uType === 'MD' ? item.beOccupieApName : '******'}}</span>
                                                              方案（{{item.lState == 0 ? '预锁': (item.lState == 1 ? '被占' : '强制停止')}}）
                                                          </span>
                                                                </p>
                                                                <p><span style="color: #333">占点排期：</span>{{item.schedules}}</p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                    <el-checkbox slot="reference" v-model="scope.row.checkBox.B" label="B面"
                                                                 @change="changeB(scope.row)"
                                                                 :disabled="scope.row.box.B">
                                                    </el-checkbox>
                                                </el-popover>
                                                <el-checkbox v-else v-model="scope.row.checkBox.B" label="B面"
                                                             @change="changeB(scope.row)"
                                                             :disabled="scope.row.box.B">
                                                </el-checkbox>
                                            </div>
                                            <div class="roadGate" v-else>
                                                <el-checkbox v-model="scope.row.checkBox.ABC" label="ABC面"
                                                             @change="changeABC(scope.row)">
                                                </el-checkbox>
                                            </div>
                                        </div>
                                        <div v-else>
                                            {{scope.row.asLabs}}面
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    fixed
                                    class-name="el-table-column-resName"
                                    label="资源名称"
                                    width="200"
                                    prop="resName">
                                </el-table-column>
                                <el-table-column
                                    fixed
                                    class-name="el-table-column-mediaName"
                                    prop="mediaName"
                                    label="媒体名称"
                                    width="140"
                                    :show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column
                                    prop="city"
                                    label="城市"
                                    min-width="110">
                                </el-table-column>
                                <el-table-column
                                    prop="origin"
                                    label="区域"
                                    min-width="110">
                                </el-table-column>
                                <el-table-column
                                    label="商圈"
                                    min-width="130">
                                    <template slot-scope="scope">
                                        {{scope.row.tradingArea || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="媒体备注"
                                    min-width="140"
                                    prop="mediaRemark"
                                    class-name="el-table-column-mediaRemark"
                                    :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.mediaRemark || '--' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="巡点问题"
                                    align="right"
                                    min-width="110"
                                    show-overflow-tooltip
                                    v-if="customPermission.patrolPermission">
                                    <template slot-scope="scope">
                                        {{ scope.row.remark || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="通行情况"
                                    align="right"
                                    min-width="110"
                                    v-if="customPermission.patrolPermission">
                                    <template slot-scope="scope">
                                        {{ scope.row.trafficState || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="通电情况"
                                    align="right"
                                    min-width="110"
                                    v-if="customPermission.patrolPermission==2">
                                    <template slot-scope="scope">
                                        {{ scope.row.electrifyState || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="资产编号"
                                    min-width="160"
                                    prop="assetTag"
                                    :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.assetTag || '--' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="媒体等级"
                                    min-width="120"
                                    prop="mediaLevel">
                                    <template slot-scope="scope">
                                        {{scope.row.mediaLevel !== '' ? scope.row.mediaLevel + '级' : '--'}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="广告限制"
                                    min-width="130"
                                    prop="adLimit"
                                    :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.adLimit || '--' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    :label="recType == 1? '楼盘类型':'写字楼类型'"
                                    min-width="100"
                                    prop="buildType"
                                    :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.buildType || '--' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="mState"
                                    label="媒体状态"
                                    min-width="90"
                                    class="tar">
                                </el-table-column>
                                <el-table-column
                                    label="楼盘价格"
                                    align="right"
                                    min-width="110">
                                    <template slot-scope="scope">
                                        <span>&yen;{{scope.row.buildPrice}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="buildNum"
                                    label="楼栋数量"
                                    align="right"
                                    min-width="100">
                                </el-table-column>
                                <el-table-column
                                    label="广告尺寸"
                                    min-width="110">
                                    <template slot-scope="scope">
                                        {{ scope.row.adSize || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="画面尺寸"
                                    min-width="110">
                                    <template slot-scope="scope">
                                        {{ scope.row.picSize || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="liveYear"
                                    align="right"
                                    :label="recType === 1? '入住年份' : '建成年份'"
                                    min-width="90">
                                </el-table-column>
                                <el-table-column
                                    prop="houseNum"
                                    align="right"
                                    :label="recType === 1? '小区户数' : '办公室数量'"
                                    min-width="90">
                                </el-table-column>
                                <el-table-column
                                    label="人流量"
                                    align="right"
                                    min-width="110">
                                    <template slot-scope="scope">
                                        {{ scope.row.peopleFlow || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="车位数"
                                    align="right"
                                    min-width="110">
                                    <template slot-scope="scope">
                                        {{ scope.row.parkSpaceNum || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="车流量"
                                    align="right"
                                    min-width="110">
                                    <template slot-scope="scope">
                                        {{ scope.row.carFlow || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    prop="schedules"
                                    label="排期"
                                    min-width="190">
                                </el-table-column>
                            </el-table>
                            <div class="ad_pagination" v-if="total">
                                <el-pagination
                                    background
                                    layout="total, sizes, prev, pager, next, jumper"
                                    @current-change="changePage"
                                    @size-change="sizeChange"
                                    :page-sizes="[10, 20, 50,100,500]"
                                    :current-page.sync="pageNo"
                                    :page-size="pageSize"
                                    :total="total">
                                </el-pagination>
                            </div>
                        </div>
                        <!--购物车-->
                        <el-dialog title="已选点位" :visible.sync="dialogTableVisible"
                                   :close-on-click-modal="false"
                                   :close-on-press-escape="false"
                                   :before-close="shopingBeforeClose"
                                   custom-class="custom-dialog-wrapper shop-cart-wrapper">
                            <template>
                                <div class="table_wrap car-list" style="margin-top: 60px"
                                    v-loading="shopLoading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                                    <div class="table_box shopcar_box">
                                        <el-row class="top-row">
                                            <el-col :span="8">
                                                <el-radio-group v-model="activeName" size="small" @change="handleClick">
                                                    <el-radio-button :label="item.type.toString()" v-for="item of typeShopList" :key="item.type">{{item.mVehicle}}</el-radio-button>
                                                </el-radio-group>
                                            </el-col>

                                            <el-col :span="16" style="text-align:right;">
                                                <span class="button_point">
                                                    <el-button @click="getMapADList" size="small" class="mapBtn" :disabled="mapBtn"
                                                               v-qadn-mta-h5="{id: 'a004_b008_c001_d001_bt061_ck05'}">获取地图选点</el-button>
                                                    <el-button plain @click="getShareADList" size="small" class="mapBtn"
                                                               v-qadn-mta-h5="{id: 'a004_b008_c001_d001_bt062_ck05'}">更新客户选点</el-button>
                                                </span>
                                                <el-select v-model="eventType" placeholder="快捷配点" filterable @change="changeEvent">
                                                    <el-option v-for="item of eventList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                                </el-select>
                                            </el-col>
                                        </el-row>
                                        <el-row class="car-title">
                                            <el-col :span="9">
                                                <img src="../../assets/images/statistics.png" alt="" style="vertical-align: text-top;">
                                                社区:<span>{{shopMedia_ADNum.resNum}}</span>
                                                (选1面:<span>{{shopMedia_ADNum.oneNum}}</span>&nbsp;&nbsp;
                                                选2面:<span>{{shopMedia_ADNum.twoNum}}</span>&nbsp;&nbsp;
                                                选3面:<span>{{shopMedia_ADNum.threeNum}}</span>&nbsp;&nbsp;
                                                选更多:<span>{{shopMedia_ADNum.moreNum}}</span>)
                                            </el-col>
                                            <el-col :span="2">
                                                媒体:<span>{{shopMedia_ADNum.mediaNum}}</span>
                                            </el-col>
                                            <el-col :span="6">
                                                点位:<span>{{shopMedia_ADNum.ADNum}}</span>
                                                (A面:<span>{{mediaLevelNum.ANum}}</span>&nbsp;&nbsp;
                                                B面:<span>{{mediaLevelNum.BNum}}</span>)
                                            </el-col>
                                            <el-col :span="5" v-if="mediaLevelNum.ALevel || mediaLevelNum.BLevel || mediaLevelNum.CLevel">
                                                A级:<span>{{mediaLevelNum.ALevel}}</span>
                                                B级:<span>{{mediaLevelNum.BLevel}}</span>
                                                C级:<span>{{mediaLevelNum.CLevel}}</span>
                                            </el-col>
                                            <el-col :span="2">被占点位:<span style="color:#FF7958;">{{ADLockNum}}</span></el-col>
                                        </el-row>
                                        <span class="change_scheduling" @click="changeAdsSchedule"
                                              v-qadn-mta-h5="{id: activeName == 1 ? 'a004_b008_c001_d001_bt060_ck04' : 'a004_b008_c001_d002_bt075_ck04'}">
                                            更换排期
                                        </span>
                                        <el-table
                                            v-loading="shopLoading"
                                            element-loading-text="加载中"
                                            element-loading-spinner="el-icon-loading"
                                            border
                                            :row-class-name="tableRowClassName"
                                            :highlight-current-row="true"
                                            :data="currentPagination"
                                            @row-click="shopRowClick"
                                            style="width: 100%"
                                            id="shopCarTable">
                                            <el-table-column type="expand">
                                                <template slot-scope="props">
                                                    <el-form label-position="left" inline class="demo-table-expand">
                                                        <el-form-item label="商圈：">
                                                            <div class="shopList_adLimit" style="width: 80px;">
                                                                <span class="shopList_adLimit">{{ props.row.tradingArea}}</span>
                                                            </div>
                                                        </el-form-item>
                                                        <el-form-item label="小区户数：">
                                                            <span>{{ props.row.houseNum}}</span>
                                                        </el-form-item>
                                                        <el-form-item label="楼盘价格：">
                                                            <span>&yen;{{ props.row.buildPrice}}</span>
                                                        </el-form-item>
                                                        <el-form-item label="资产编号：">
                                                            <div class="shopList_adLimit" style="width: 80px;">
                                                                <span>{{ props.row.assetTag }}</span>
                                                            </div>
                                                        </el-form-item>
                                                        <el-form-item label="入住年份：">
                                                            <span>{{ props.row.liveYear }}</span>
                                                        </el-form-item>
                                                        <el-form-item label="广告限制：">
                                                            <div class="shopList_adLimit">
                                                                <span>{{ props.row.adLimit }}</span>
                                                            </div>
                                                        </el-form-item>
                                                    </el-form>
                                                    <el-form v-if="customPermission.patrolPermission" label-position="left" inline class="demo-table-expand">
                                                        <el-form-item label="巡点问题：">
                                                            <span class="shopList_adLimit">{{ props.row.remark }}</span>
                                                        </el-form-item>
                                                        <el-form-item label="通行情况：">
                                                            <span class="shopList_adLimit">{{ props.row.trafficState || '--' }}</span>
                                                        </el-form-item>
                                                        <el-form-item label="通电情况：" v-if="customPermission.patrolPermission==2">
                                                            <span class="shopList_adLimit">{{ props.row.electrifyState || '--' }}</span>
                                                        </el-form-item>
                                                    </el-form>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="资源名称"
                                                min-width="140">
                                                <template slot-scope="scope">
                                                    <el-badge is-dot class="item" v-show="scope.row.share">
                                                        <span>{{scope.row.resName}}</span>
                                                    </el-badge>
                                                    <span v-show="!scope.row.share">{{scope.row.resName}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="city" label="城市" min-width="80">
                                            </el-table-column>
                                            <el-table-column prop="origin" label="区域" min-width="80">
                                            </el-table-column>
                                            <el-table-column
                                                prop="buildType"
                                                label="楼盘类型"
                                                min-width="85">
                                            </el-table-column>
                                            <el-table-column
                                                prop="schedules"
                                                label="排期"
                                                min-width="185">
                                                <template slot-scope="scope">
                                                    <span :class="scope.row.changeError ? 'change_defeat_schedules' : ''">{{scope.row.schedules}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="scope"
                                                label="地图中心点"
                                                min-width="105">
                                                <template slot-scope="scope">
                                                    <el-tooltip v-if="scope.row.mapCenter"
                                                                :content="scope.row.mapCenter"
                                                                placement="bottom-start"
                                                                :visible-arrow="false">
                                                        <span>{{scope.row.mapCenter || '--' }}</span>
                                                    </el-tooltip>
                                                    <span v-else> {{ scope.row.mapCenter || '--' }} </span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="mediaName" label="媒体名称" min-width="130" class="tar">
                                                <template slot-scope="scope">
                                                    <el-tooltip v-if="scope.row.mediaName.length >= 5" class="item" effect="dark" :content="scope.row.mediaName" placement="bottom-start">
                                                        <span>{{scope.row.mediaName}}</span>
                                                    </el-tooltip>
                                                    <span v-else> {{ scope.row.mediaName}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="mediaLevel"
                                                label="媒体等级"
                                                min-width="85">
                                                <template slot-scope="scope">
                                                    {{scope.row.mediaLevel !== '' ? scope.row.mediaLevel + '级' : '--'}}
                                                </template>
                                            </el-table-column>
                                            <el-table-column min-width="65px" label="投放面">
                                                <template slot-scope="scope">
                                                    <span>{{scope.row.A_B}}面</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column min-width="54px" :render-header="renderHeader">
                                                <template slot-scope="scope">
                                                    <span style="cursor: pointer;color: #1890ff"
                                                        @click="deleteRow(scope.row)"
                                                          v-qadn-mta-h5="{id: activeName == 1 ? 'a004_b008_c001_d001_bt058_ck04' : 'a004_b008_c001_d002_bt073_ck04'}">
                                                        <i class="el-icon-delete" style="color: #108DE7;font-size: 20px;margin-left: 7px"></i>
                                                    </span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <div class="row-table-bottom">
                                            <p class="warningInfo">
                                                <span style="background: rgba(255,0,0,0.08)" class="warningInfoColor"></span>
                                                <span class="warningInfoName">被占点位</span>
                                                <span style="background: rgba(255,199,0,0.10)" class="warningInfoColor"></span>
                                                <span class="warningInfoName">连排门、同行资源回避、同行媒体回避</span>
                                            </p>
                                            <el-pagination
                                                background
                                                @size-change="handleSizeChange"
                                                @current-change="handleCurrentChange"
                                                :current-page="currentPage"
                                                :page-sizes="[10, 20, 50,100,500]"
                                                :page-size="cartPageSize"
                                                class="cart-pagination"
                                                layout="total, sizes, prev, pager, next, jumper"
                                                :total="totalNum">
                                            </el-pagination>
                                        </div>
                                    </div>

                                    <div class="shop-cart-footer">
                                        <el-button @click="goBack" type="default"
                                                   v-qadn-mta-h5="{id: 'a004_b008_c001_d001_bt071_ck08'}">返回
                                        </el-button>
                                        <el-button @click="next" type="primary"
                                                   v-qadn-mta-h5="{id: 'a004_b008_c001_d001_bt072_ck03'}">下一步
                                        </el-button>
                                    </div>
                                </div>
                            </template>
                        </el-dialog>
                    </div>
                </div>
                <div class="step3" v-if="active==2">
                    <div class="confirmBox">
                        <div class="bill-title">
                            <div class="bill-title-left">
                                <h4>{{planName}}</h4>
                                <p>{{cName}}</p>
                                <p>{{cBand}}</p>
                            </div>
                            <div class="bill-title-right">
                                <ul>
                                    <li><p><em>现金结算：</em><span>¥{{priceFormat(cash)}}</span></p></li>
                                    <li><p><em>资源置换：</em><span>¥{{priceFormat(zyzh)}}</span></p></li>
                                    <li><p><em>其他费用：</em><span>¥{{priceFormat(other)}}</span></p></li>
                                    <li><p><em style="top: 5px">总计：</em><span class="totalPrice">¥{{priceFormat(totalPrice)}}</span>
                                    </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="panel">
                            <ap-quotation :quotationData="quotationObj" :shopingList="shopingList" @APQuotationArr="APQuotationArr" :copydata="[]"></ap-quotation>
                        </div>
                    </div>
                </div>
                <div class="step4" v-if="active==3">
                    <div class="createSuccess">
                        <div class="successIcon">
                            <img src="../../assets/images/createSuccess.png" alt="">
                            <h2>编辑成功</h2>
                            <p>编辑时间：{{dateTime}}</p>
                        </div>
                        <div class="planPanel" :class="!workInSync ? 'noShareUl': ''">
                            <ul>
                                <li><em>方案名称：</em>{{planName}}</li>
                                <li><em>所属客户：</em>{{cName}}</li>
                                <li><em>所属品牌：</em>{{cBand || '--'}}</li>
                                <li class="money"><em>订单金额：</em>¥{{priceFormat(totalPrice)}}</li>
                                <li v-show="workInSync" style="overflow: hidden;text-overflow:ellipsis">
                                    <em>协同选点：</em><span id="shareUrl">{{shareADUrl}}</span>
                                    <el-button @click="copyUrl" class="urlBtn">复制</el-button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content_bottom_btn">
            <el-button plain @click="prev" v-if="active == 2" type="default"
                       v-qadn-mta-h5="{id: 'a004_b009_c000_d000_bt088_ck03'}">上一步</el-button>
            <el-button plain @click="goBack" v-if="active == 1" type="default"
                       v-qadn-mta-h5="{id: 'a004_b007_c000_d000_bt047_ck03'}">取消</el-button>
            <el-button @click="next" v-if="active == 0 || active == 1" type="primary"
                       v-qadn-mta-h5="{id: active == 0 ? 'a004_b007_c000_d000_bt046_ck03' : 'a004_b008_c000_d000_bt057_ck03'}">
                下一步
            </el-button>
            <el-button @click="next" v-if="active == 2" type="primary"
                       v-qadn-mta-h5="{id: 'a004_b009_c000_d000_bt089_ck03'}">创建方案 </el-button>
            <el-button plain @click="next('workInSync')" v-if="active == 2"
                       v-qadn-mta-h5="{id: 'a004_b009_c000_d000_bt090_ck03'}">协同选点</el-button>
            <div class="finishBtn" v-if="active == 3">
                <el-button type="default" @click="continueCreate">继续创建</el-button>
                <el-button plain type="default" @click="ToDetail">查看方案</el-button>
                <el-button @click="downLoadFanan()" type="primary">导出方案</el-button>
            </div>
        </div>
        <!--添加商品到购物车的动画效果-->
        <div class="shopAnimate" v-show="shoppingShow">
            <img src="../../assets/images/select.png" alt="">
        </div>
        <div class="shopAnimateAll" v-show="selectAll">
            <img src="../../assets/images/allselect.png" alt="">
        </div>
        <!--查询被占模态框-->
        <el-dialog
            title="被占信息"
            :visible.sync="beOccupiedDialogVisible"
            :modal="false"
            top="30vh"
            width="30%">
            <ul>
                <li v-for="(item, index) in beOccupiedAdsData" :key="index">
                    <p>
                        <span style="color: #333">占点方案：</span>
                        <span v-if="sessionData.uType === 'MD'"><span style="font-weight: bold">{{item.beOccupieApName}}</span> 方案（{{item.lState == 0 ? '预锁': (item.lState == 1 ? '被占' : '强制停止')}}）</span>
                        <span v-else style="font-weight: bold">******</span>
                    </p>
                    <p><span style="color: #333">占点排期：</span>{{item.schedules}}</p>
                </li>
            </ul>
        </el-dialog>
        <!--连排门信息模态框-->
        <el-dialog
            title="信息提示"
            :visible.sync="connectAdDialogVisible"
            :modal="false"
            top="30vh"
            width="30%">
            <ul>
                <li v-show="ActiveConnectADList.connectResName !== ''">
                    <p>
                        <span style="color: #333">资源名称：</span>
                        <span  style="font-weight: bold">{{ActiveConnectADList.connectResName}}</span>
                    </p>
                    <p>
                        <span style="color: #333">媒体名称（连排门）：</span>
                        <span  style="font-weight: bold">{{ActiveConnectADList.connectMedia}}为连排门</span>
                    </p>
                </li>
                <li v-show="ActiveConnectADList.commentWorkRes !== ''">
                    <p>
                        <span>同行资源回避：该社区已有同行广告主投放</span>
                        <span  style="font-weight: bold">({{ActiveConnectADList.commentWorkRes}})</span>
                    </p>
                </li>
                <li v-show="ActiveConnectADList.commentworkMedia !== ''">
                    <p>
                        <span>同行媒体回避：{{ActiveConnectADList.asLab}}点已有同行广告主投放</span>
                        <span  style="font-weight: bold">({{ActiveConnectADList.commentworkMedia}})</span>
                    </p>
                </li>
            </ul>
        </el-dialog>
        <!--一键选点模态框-->
        <el-dialog
            title="一键选点"
            :visible.sync="dialogOneKeyPoint"
            width="410px"
            style="margin-top: 20vh;">
            <div class="onKeyPointFrom">
                <el-form
                    ref="oneKeyPointData"
                    :model="oneKeyPointData"
                    label-width="85px"
                    :rules="oneKeyPointDataRules">
                    <el-form-item label="点位总量: "  prop="TotalPoint">
                        <el-input v-model="oneKeyPointData.TotalPoint"></el-input>
                    </el-form-item>
                    <el-form-item label="每小区选: "  prop="pointNumByRes">
                        <el-input v-model="oneKeyPointData.pointNumByRes"></el-input>
                    </el-form-item>
                    <el-form-item label="A面占比: " prop="A_cale" class="ABcaleItem">
                        <div class="ABcalePercent">
                            <el-input v-model="oneKeyPointData.A_cale"></el-input>
                            <span class="percent">%</span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="OneKeyPoint_footer">
            <el-button @click="dialogOneKeyPoint = false">取 消</el-button>
            <el-button type="primary" @click="oneKeyPointBtn('oneKeyPointData')" class="OneKeyPoint_footerBtn">一键选点</el-button>
          </span>
        </el-dialog>
        <!-- 导入方案弹出框 -->
        <el-dialog
            class="import_fanan"
            :title="importType=='1'?'小区导入':'点位导入'"
            :visible.sync="isImport"
            top="30vh"
            width="360px">
            <el-row>
                <el-col>
                    <el-upload
                        class="upload_file"
                        ref="upload"
                        accept=".xlsx,.xls"
                        :action="doUpload"
                        :show-file-list="true"
                        :file-list="fileData"
                        :http-request="uploadFile"
                        :on-remove="fileRemove"
                        :multiple="false">
                        <template v-if="customPermission.pptPermission && customPermission.pptPermission.gzqylPermission == '1'">
                            <a v-if="importType=='1'" :href ='this.apiVar.qadnUrl + "/importTemplate/广州亲粤邻小区导入定制模板.xlsx"' download="小区导入模板.xlsx" @click="dowmLoadFun" class="el-icon-download aButton">下载模板</a>
                            <a v-if="importType=='2'" :href ='this.apiVar.qadnUrl + "/importTemplate/广州亲粤邻点位导入定制模板.xlsx"' download="点位导入模板.xlsx" @click="dowmLoadFun" class="el-icon-download aButton">下载模板</a>
                        </template>
                        <template v-else>
                            <a v-if="importType=='1'" :href ='this.apiVar.qadnUrl + "/importTemplate/resTemplate.xlsx"' download="小区导入模板.xlsx" @click="dowmLoadFun" class="el-icon-download aButton">下载模板</a>
                            <a v-if="importType=='2'" :href ='this.apiVar.qadnUrl + "/importTemplate/adsTemplate.xlsx"' download="点位导入模板.xlsx" @click="dowmLoadFun" class="el-icon-download aButton">下载模板</a>
                        </template>
                        <el-button plain icon="el-icon-upload2" size="small" class="fileButton">上传文件</el-button>
                    </el-upload>
                </el-col>
            </el-row>
            <el-row v-if="importType=='2' && isShowTag" class="warning_box">
                <el-col :span="2">
                    <i class="el-icon-warning" style="color:#FAAD14"></i>
                </el-col>
                <el-col :span="20" >
                    若需导入钼媒人群包进行选点，请在表格中填入正确的钼媒点位ID
                </el-col>
                <el-col :span="2">
                    <i class="el-icon-close" @click="hideTag()"></i>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button plain size="small" @click="isImport = false">取 消</el-button>
                <el-button size="small" type="primary" @click="submitUpload()">导 入</el-button>
            </span>
        </el-dialog>
        <!-- 导入excel点位部分失败弹框 -->
        <el-dialog
            :visible.sync="showUploadFail"
            title="导入excel的点位信息"
            top="20vh"
            width="80%">
            <template v-if="importType =='1'">
                <import-result :importData="importInfoData" :name="planForm.planName" :customPermission="customPermission" @cancel="cancelImport" @confirmImport="confirmImport"></import-result>
            </template>
            <template v-if="importType == '2'">
                <div class="car-title">
                    <i class="el-icon-info" style="color: #1890FF;"></i>
                    <h4>已成功导入点位<span>{{excelObj.successNum}}</span>个,问题点位<span>{{excelObj.failNum}}</span>个
                        <span @click="downLoadExcel()">下载表格<i class="el-icon-download"></i></span>
                    </h4>
                </div>
                <el-table
                    border
                    :data="excelDataUpload"
                    style="width: 100%"
                >
                    <el-table-column label="资源名称" min-width="140" prop="resName" >
                    </el-table-column>
                    <el-table-column prop="city" label="市" min-width="85" >
                    </el-table-column>
                    <el-table-column prop="origin" label="区" min-width="85" >
                    </el-table-column>
                    <el-table-column prop="mediaName" label="媒体名称" min-width="130" >
                    </el-table-column>
                    <el-table-column min-width="70" label="投放面">
                        <template slot-scope="scope">
                            <span>{{scope.row.asLab}}面</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="assetTag" label="资产编号" min-width="130" >
                    </el-table-column>
                    <el-table-column prop="schedules" label="排期" min-width="160">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.schedules" placement="bottom">
                                <span>{{scope.row.schedules}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="failReason" label="失败原因" min-width="130" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </template>
        </el-dialog>
        <!--更换排期模态框-->
        <el-dialog
            title="更换排期"
            :visible.sync="isChangedScheduled"
            top="20vh"
            width="54%">
            <div class="scheduled_box">
                <ul>
                    <li v-for="(item,index) in cityAdsScheduled" :key="index">
                        <el-row>
                            <el-col :span="2"><span>{{item.city}}</span></el-col>
                            <el-col :span="2"><span>{{item.adsNum}}面</span></el-col>
                            <el-col :span="8"><span>原排期：{{item.oldTime}}</span></el-col>
                            <el-col :span="2">
                                <div style="width: 34px;height: 32px;overflow: hidden">
                                    <el-date-picker
                                        v-model="changeDateTemp"
                                        @change="selectScheduled(index)"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        value-format="yyyy/MM/dd"
                                        format="yyyy/MM/dd"
                                        class="date-select-scheduled"
                                        :picker-options="pickerOptions"
                                    >
                                    </el-date-picker>
                                </div>
                            </el-col>
                            <el-col :span="9">
                                <span>
                                    新排期：{{item.newTime || '--'}}
                                    <i v-show="item.newTime" class="el-icon-circle-close-outline"
                                       @click="deleteScheduled(index)"></i>
                                </span>
                            </el-col>
                        </el-row>
                    </li>
                </ul>
            </div>
            <div slot="footer" class="changed_scheduled_footer">
                <el-button @click="isChangedScheduled = false">取 消</el-button>
                <el-button type="primary" @click="postAdsScheduled"
                           class="changed_scheduled_footer_btn">确 定</el-button>
            </div>
        </el-dialog>
        <!--更换排期存在失败是的弹出框-->
        <el-dialog
            title="提示"
            :visible.sync="showdefead"
            top="20vh"
            width="340px">
            <div class="defead_scheduled_box">
                <h3>
                    <span style="font-weight: bold;font-size: 14px">{{showErrorData.success}}面更换排期成功，{{showErrorData.error}}面排期被占</span>
                </h3>
                <ul>
                    <li v-for="(item,index) in showErrorData.errorList" :key="index">
                        {{item.city}}:{{item.schedules}}
                        <el-tooltip class="item" effect="dark" placement="right-start">
                            <div slot="content">
                                <span v-for="(key,otherIndex) of item.otherArr" :key="otherIndex">
                                    {{key.resName + '-' + key.mediaName + '-' + key.asLab + '面'}}
                                </span>
                            </div>
                            <span class="defead_ads_num"> {{item.adsNum}} </span>
                        </el-tooltip>
                    </li>
                </ul>
            </div>
            <div slot="footer" class="defead_scheduled_footer">
                <el-button type="primary" @click="showdefead = false"
                           class="defead_scheduled_footer_btn">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 复制方案弹出框 -->
        <el-dialog
            :visible.sync="isCopy"
            title="复制方案"
            width="450px"
            >
            <el-select v-model="orderName" size="small"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteGetOrder"
                :loading="loadingOrder"
            >
                <el-option v-for="item of orderArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="isCopy = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirmCopy()">确 定</el-button>
            </span>
        </el-dialog>
        <!--地图选择（1无忧地图、2亲邻地图）-->
        <el-dialog
            :visible.sync="isMapKind"
            title="地图选择"
            width="450px">
            <p>
                <span class="p_span">地图类型：</span>
                <el-radio v-model="selectMapKind" :label="1">旧版地图</el-radio>
                <el-radio v-model="selectMapKind" :label="2">新版地图</el-radio>
            </p>
            <div slot="footer" class="dialog-footer">
                <el-button plain size="small" @click="isMapKind = false">取 消</el-button>
                <el-button size="small" type="primary" @click="selectMap" >确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        Input, Dialog, Button, Tabs, TabPane, Table, TableColumn, Cascader, DatePicker,
        Select, Option, Form, FormItem, Steps, Step, Badge, Checkbox, Message, InputNumber
    } from 'element-ui';
    import api from '../../api/api'
    import areaArr from '../../commonFun/areaPackage_new'
    import commaFormat from '../../commonFun/commaFormat'
    import sessFun from '../../commonFun/sessFun.js'
    // 时间格式化
    import timeFormat from "../../commonFun/timeFormat.js";
    import apQuotation from './components/apQuotation'
    // 筛选过滤
    import filterFormat from "../../commonFun/filterTableData.js";
    import sheetExcel from "../../commonFun/sheetExcel.js";
    // 方案导入结果
    import importResult from './components/importResult.vue'

    export default {
        name: "editPlanOld",
        components: {
            elInput: Input,
            elDialog: Dialog,
            elButton: Button,
            elTabs: Tabs,
            elTabPane: TabPane,
            elTable: Table,
            elTableColumn: TableColumn,
            elCascader: Cascader,
            elDatePicker: DatePicker,
            elSelect: Select,
            elOption: Option,
            elForm: Form,
            elFormItem: FormItem,
            elSteps: Steps,
            elStep: Step,
            elBadge: Badge,
            elCheckbox: Checkbox,
            elInputNumber: InputNumber,
            apQuotation,
            importResult,
        },
        data() {
            let validateNum = (rule, value, callback) => {
                let reg = /^[0-9]+$/ ;
                if (!(reg.test(value))) {
                    callback(new Error('只能输入整数值'));
                } else {
                    if (value < 1) {
                        callback(new Error('点位数不能为0'));
                    } else {
                        callback();
                    }
                }
            };
            let validateCale = (rule, value, callback) =>{
                let reg = /^\d+(\.\d+)?$/
                if (value !== '' && !(reg.test(value))) {
                    callback(new Error('只能输入数字'));
                } else {
                    if (value < 0 || value > 100) {
                        callback(new Error('只能输入数字(0-100)'));
                    } else {
                        callback();
                    }
                }
            }
            return {
                // doUpload: 'https://beta.qinlinad.com/Advertisement/AnalysisExcelAdBaseInfo',
                doUpload: '/advertisement/AnalysisExcelAdBaseInfo',
                shopLoading: true,  // 购物车加载中
                loading: true,//加载中
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                selectedOptions: [],
                cityOptions: [],
                cityOther: false,             // 判断是否要选择全国其他城市
                isBD: true,                   // 判断登录用户是否为销售
                username: '',                 // 获取登录用户的userName
                resType: ['社区', '写字楼'],   // step2 资源类型
                recType: 1,                  // step2  1:社区 0:写字楼
                shopXY: {x: '', y: ''},      // 动画起始坐标
                shoppingShow: false,         //动画效果的显示隐藏
                selectAll: false,            // 是否全选
                bodyWidth: 1920,
                city: [],                  // step2 城市
                area: [],                  // step2城市下属区域
                activeIndex: 0,            //step2当前选中的城市下标
                activeRName: '',           //step2当前选中的城市名称
                areaName: '全市',           // step2当前选中的区域
                areaRid: '',               // step2当前选中的区域rid
                quotation: [],             // step3 报价单汇总
                quotationObj: {},          // 传递给报价单组件的数据，标示是否来自详情
                CSMList: [],               // 城市不同排期的所有面数
                totalPrice: 0,             //总价
                remark: '无',              //备注
                cash: 0,                   // 现金结算
                zyzh: 0,                   // 资源置换
                other: 0,                  // 其他费用
                customer: [],              // step1公司客户
                companyName: [],           //step1公司名称
                planName: '',              // 方案名称
                cName: '',                 // 选中公司名称
                companyBrand: [],          //step1公司品牌
                cBand: '空',               // 选中的品牌
                ownerBU: [],               //step1联系人
                throwCity: [],             //step1投放城市
                dialogTableVisible: true,  //购物车

                //搜索类型
                typeSelect: [
                    {
                        value: '资源名称',
                        label: '资源名称'
                    }, {
                        value: '商圈',
                        label: '商圈'
                    }, {
                        value: '资产编号',
                        label: '资产编号'
                    },{
                        value: '被占查询',
                        label: '被占查询'
                    }],
                //默认
                selectValue: '资源名称',
                //楼盘类型
                buildType: [
                    {buildlabel: '高端住宅', buildValue: '高端住宅'},
                    {buildlabel: '普通住宅', buildValue: '普通住宅'},
                    {buildlabel: '单体楼', buildValue: '单体楼'},
                    {buildlabel: '别墅', buildValue: '别墅'},
                    {buildlabel: '洋房', buildValue: '洋房'},
                    {buildlabel: '商住或商用', buildValue: '商住或商用'},
                    {buildlabel: '公共场所', buildValue: '公共场所'}
                ],
                village:[
                    {buildlabel: '高端住宅', buildValue: '高端住宅'},
                    {buildlabel: '普通住宅', buildValue: '普通住宅'},
                    {buildlabel: '单体楼', buildValue: '单体楼'},
                    {buildlabel: '别墅', buildValue: '别墅'},
                    {buildlabel: '洋房', buildValue: '洋房'},
                    {buildlabel: '商住或商用', buildValue: '商住或商用'},
                    {buildlabel: '公共场所', buildValue: '公共场所'}
                ],
                officeBuilding: [           // 写字楼类型
                    {buildValue:'单纯性写字楼',buildlabel:'单纯性写字楼'},
                    {buildValue:'商住型写字楼',buildlabel:'商住型写字楼'},
                    {buildValue:'综合型写字楼',buildlabel:'综合型写字楼'},
                    {buildValue:'工业园区',buildlabel:'工业园区'},
                ],
                buildValue: '',
                //搜索框
                searchInput: '',
                planSelect: '',
                mState: '',                //媒体状态
                activeGrade: '',           // 媒体等级
                active: 1,                  //步骤
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() <= Date.now();
                    }
                },
                dateInput: [],            // 时间输入框
                beforeDate: [],           // 时间输入框的前一次时间
                //setp1创建方案表单
                planForm: {
                    planName: '',
                    ownerSales: '',   // 所属销售
                    companyName: '',
                    companyBrand: '',
                    throwCity: [],
                    ownerBU: '',    // 所属联系人
                    planRemark: '',
                },
                industryID: '',     // 所选公司所在的行业
                shopingList: [],        // step2购物车列表
                // 购物车展示的数据
                typeShopList:[],
                activeName: '1',
                // 事件选择
                eventType: '',
                eventList: [],
                // 购物车表格数据
                shopShowList: [],
                planList: [],            //step2可选点位列表
                sessionData: '',    // 登录用户的数据
                FAData: '',            // 创建方后台返回的数据
                timeout: null,
                BDData: {uid: 0, realName: ''},
                backupsList: [],         //  表头搜索过后的备份
                HSearch: '',           // 获取传值显示‘清除’、‘确定’按钮
                houseNum: ['', ''],      // 表头搜索住户数量
                buildNum: ['', ''],      // 表头搜索楼栋数量
                buildPrice: ['', ''],    // 表头搜索楼盘价格
                liveYear: ['', ''],       // 表头搜索入住年份
                peopleFlow: ['',''],       // 表头搜索人流量
                carFlow : ['',''],          // 表头搜索车位数
                parkSpaceNum : ['',''],    // 表头搜索车流量
                filterData: {               // 记录判断含有哪些表头的过滤条件
                    hNum:false,
                    bNum:false,
                    bPrice:false,
                    lYear: false,
                    pFlow: false,
                    cFlow: false,
                    pSNum: false
                },
                loadSign: true,            // table滚轮
                shopMedia_ADNum: {resNum: 0, mediaNum: 0, ADNum: 0, oneNum: 0, twoNum: 0, threeNum: 0, moreNum: 0},
                ADloading: '',                 // 创建方案、提交选点和报价单时的loading
                computeAuotation: '',         // 计算报价单时的loading
                areaCity: [],
                CityPlanIndex: [],            // 记录每个城市遍历到的下标
                activeCityData: {},          // 城市切换的数据，默认为this.city[0]
                loadScroll: true,           // 搜索后不执行滚动加载
                dateTime: '',                // 获取今天日期
                firstLevelSearch: false,   // 一级搜索
                firstLevelData: [],             // 一级搜索保存的数据
                ADLimit: [                      // step2 广告限制
                    {value: '地产', label: '地产'},
                    {value: '汽车', label: '汽车'},
                    {value: '美容', label: '美容'},
                    {value: '餐饮', label: '餐饮'},
                    {value: '食品', label: '食品'},
                    {value: '金融', label: '金融'},
                    {value: '医学', label: '医学'},
                ],
                limitName: '全部',            // 当前广告限制高亮，默认为全部
                limitList: [],                // 当前选择的广告限制
                filterCondition: [], // 当前过滤条件
                FAInfo: {},
                ADchangerReaPrice: true,     // 广告费修改验证
                totalChangeCash: true,       // 修改制作费现金输入验证
                totalChangeZyzh: true,       // 修改制作费资源置换输入验证
                totalChangeOther: true,       // 修改制作费其他费用输入验证
                commentMediaADNum: [],        // 统计同一城市相同因不同排期而选择相同的asid
                mStateIndex: 0,               // 切换媒体状态时，如果状态为1(正常)则进行滚动加载，mStateIndex记录下标
                editApid: '',                  // 编辑方案的id
                editApRemark: [],              // 编辑方案之前的备注信息，[{rid:440100,remark:''}]
                // ADLockNum: 0,                  // 被锁点位的数量
                mapADList: [],                 // 地图选择的点位数据
                mapParams: {},                  // 记录当前地图选点时的参数，包括排期、城市名和rid
                mapBtn: true,                   // 获取地图选点数据的按钮，默认不可点击
                getMapLoading: false,           // 获取地图选点时的loading

                // 是否导入方案
                isImport: false,
                importType: '',
                isShowTag: true,
                // 当前上传文件的数据- 表格
                fileData:[],
                // 导入excel部分失败弹出框
                showUploadFail: false,
                // 导入excel之后返回的失败成功点数
                excelObj:{
                    successNum: 0,
                    failNum: 0,
                },
                // excel导入返回来的数据
                importInfoData: {},
                // 导入excel之后返回的数组
                excelDataUpload:[],
                // 复制方案
                isCopy: false,
                // 搜索方案时的loading
                loadingOrder: false,
                // 搜索方案名称
                orderName: '',
                // 返回的订单列表
                orderArr: [],
                shareADUrl: '',                // 协同选点url地址
                workInSync: false,              // 是否点击协同选点按钮
                dialogOneKeyPoint: false,    // 一键选点模态框
                oneKeyPointData:{
                    TotalPoint: '',
                    pointNumByRes: '',
                    A_cale: 0,
                    B_cale: 0,
                },                              // 一键选点的参数
                oneKeyPointDataRules: {
                    TotalPoint: [
                        {required: true, message: '点位数不能为空', trigger: 'blur'},
                        {validator: validateNum, trigger: 'blur'},
                    ],
                    pointNumByRes:[
                        {required: true, message: '不能为空', trigger: 'blur'},
                        {validator: validateNum, trigger: 'blur'},
                    ],
                    A_cale:[
                        {required: true, message: 'A面占比不能为空', trigger: 'blur'},
                        {validator: validateCale, trigger: 'blur'},
                    ]
                },
                apid: '',                        // 编辑方案的id
                aiCode: '',                        // 获取协同选点列表的密钥
                shareADSData: {},                 //协同选点的数据包括选点列表
                beOccupiedDialogVisible: false, // 被占模态框
                beOccupiedNumber: 0,             // 第一次搜索记录时提前保存 planList
                isOccupied: true,                // 被占搜索时隐藏过滤条件
                beOccupiedAdsData: [], // 当前点击行的被占信息{beOccupieApName:'',lState: '',schedules: ''}
                shopDelRowClick: false,
                pageNo: 1,                       // 页码
                total: 1,                    // 总页数
                pageSize: 20,                    //每页条数
                getAdsParamsData: {},    //　获取点位列表的参数data
                mediaType: '广告门',   //
                pdidList: [],           // 方案对应的dpid
                IsAll: false,           //当前是否为全选状态
                isShowAll: false,       // 控制表头显示时的过渡效果
                searchBtnAbled: false,  // 搜索按钮禁止
                isCityPrice: false,     // 判断城市最大价格是否大于2000w
                connectAdDialogVisible: false, // 连排门模态框
                ActiveConnectADList:{}, // 购物车 - 当前点击行的连排门信息
                isChangedScheduled: false,       // 购物车-一键更换排期模态框
                cityAdsScheduled:[               // 统计购物车数据点位排期，按城市及排期分开
                    // {city:'广州市',adsNum: 100,oldTime:'2019/01/01-2019/02/01',newTime:'2019/02/11-2019/03/02'},
                ],
                changeDateTemp: '',
                showdefead: false,              // 显示更换排期时失败的list
                showErrorData:{success:0,error:0,errorList:[]},
                mediaLevelNum:{ALevel: 0, BLevel: 0, CLevel: 0,ANum:0,BNum:0},
                asrIDList: [],                 // 已选点位里存在的公司及城市
                saleManageLevel: 0,            // 销售权限 0地方销售 1全国销售
                /*方案排斥*/
                activeSelect: '1',                 //
                rejectAdPlan: [],                  // 排斥方案选项
                activeAdPlan: '',                 // 当前选择的方案
                routePath: '',
                // 方案是否创建中，防多次点击创建-节流
                creating: false,
                // 地图类型
                isMapKind: false,
                selectMapKind: 2,
                // 当前选择的地图类型
                ActiveMapType: 2,
                // 亲邻地图
                mapAdsList:[],
                currPageSelect:0,
                currPageAsLength:0,
                adsCount:0,//总可选点位
                customPermission: {},  //巡点权限
                // 购物车分页时页面条目数量
                cartPageSize: 10,
                currentPage: 1,
                totalNum: 0
            };
        },
        mounted() {
            this.getsessionData()   // 获取session中的数据
            this.getSetPoint()      //获取选点排期数据
            this.areaCity = areaArr.cityArea()
            this.getADLimit()       // 获取广告限制列表
            // 注：window.onresize只能在项目内触发1次
            let that = this;
            window.onresize = function windowResize() {    // 实时监控body的宽带。注：修改该方法后要重启项目并重新打开页面
                // 通过捕获系统的onresize事件触发我们需要执行的事件
                that.bodyWidth = document.body.offsetWidth;
                that.shopXY.x = that.bodyWidth - 170;
                shopAnimate.style.right = that.shopXY.x + 'px'
            };
            let Right = document.body.offsetWidth - 835
            this.shopXY.x = Right
            let shopAnimate = document.getElementsByClassName('shopAnimate')[0]
            shopAnimate.style.right = this.shopXY.x + 'px'
            console.log('this.cityOptions', this.cityOptions)
        },
        // directives: {
        //     loadmore: {
        //         bind: function (el, binding) {
        //             const selectWrap = el.querySelector('.el-table__body-wrapper')
        //             selectWrap.addEventListener('scroll', function () {
        //                 const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        //                 if (scrollDistance <= 150) {
        //                     binding.value()
        //                 }
        //             })
        //         }
        //     },
        // },
        computed: {
            nowPointNum() {
                if(this.dialogTableVisible){
                    console.log('*********computed*********')
                    this.resetConnectAdData()
                    this.computeConnectAdData()
                }
                return this.shopingList.length
            },
            ADLockNum(){
                let num = 0;
                if(this.dialogTableVisible){
                    for (let data of this.shopShowList) {
                        if(data.lState !== undefined && data.lState.length > 0){
                            num++;
                        }
                    }
                    return num;
                }
                return num;
            },
            currentPagination() {
                this.totalNum = this.shopShowList.length;
                return this.shopShowList.slice((this.currentPage-1)*this.cartPageSize, this.currentPage*this.cartPageSize);
            }
        },
        methods: {
            handleSizeChange(val) {
                this.cartPageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            // 导入方案弹出框
            importFanan(type){
                if(type == 'res'){
                    this.importType = '1';
                    this.doUpload = '/advertisement/AdPlanResImport'
                }else if(type == 'ads'){
                    this.importType = '2';
                    this.doUpload = '/advertisement/AnalysisExcelAdBaseInfo';
                }else if(type == 'copy'){
                    this.orderName = '';
                    this.orderArr = [];
                    this.isCopy = true;
                    return;
                }
                this.isImport = true;
                this.fileData = [];
                this.importInfoData = {};
            },
            // 自定义上传
            uploadFile(params){
                this.fileData = [];
                console.log(params);
                let fileObj = params.file;
                this.fileData.push(fileObj);
            },
            // 文件删除
            fileRemove(file, fileList){
                console.log(file, fileList);
                this.fileData = fileList
            },
            // 导入模版下载
            dowmLoadFun(event){
                // 阻止冒泡事件
                event.stopPropagation();
            },
            hideTag(){
                this.isShowTag = false;
            },
            // 确认上传
            submitUpload(){
                if (this.fileData.length) {
                    let ridsArr = [];
                    for (let data of this.city) {
                        ridsArr.push(data.rid);
                    }
                    let rids = ridsArr.join(',');
                    let sess = this.sessionData;
                    let info = `?uid=${sess.uID}&token=${sess.token}&suId=${this.BDData.uid}&rids=${rids}&excludedApId=${this.activeAdPlan ? this.activeAdPlan : ''}&asrIDs=${this.BDData.asrIDs}`;
                    let formData = new FormData();
                    formData.append('file', this.fileData[0]);
                    if (this.importType == '2') {
                        this.adsImport(formData, info);
                    } else {
                        this.resImport(formData, info);
                    }
                } else {
                    sessFun.messageFun('warning', '请先上传文件');
                }
            },
            // 点位导入
            adsImport(formData, info) {
                // 上传文件
                api.postUpload_file(this.doUpload + info, formData).then(res => {
                    if (!res.data.SysCode) {
                        let importInfo = res.data;
                        this.importInfoData = res.data;
                        if (importInfo.successList.length) {
                            this.setShopDataByImport(importInfo.successList);
                        }
                        console.log('importInfo.errorList.length', importInfo.errorList.length);
                        if (importInfo.errorList.length) {
                            this.excelDataUpload = this.checkPointFun(importInfo);
                            this.excelObj = {
                                successNum: importInfo.successList.length,
                                failNum: importInfo.errorList.length
                            };
                            this.showUploadFail = true;
                        }
                    } else {
                        sessFun.messageFun('warning', res.data.MSG)
                    }
                }).catch(res => {
                    console.log(res);
                });
            },
            // 小区导入
            resImport(formData, info){
                let Loading = this.$loading({
                    lock: true,
                    text: '快马加鞭选点中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                // 上传文件
                api.postUpload_file(this.doUpload+info, formData).then(res =>{
                    if(res.data.SysCode == 200200) {
                        let importInfo = res.data.data;
                        this.importInfoData = importInfo;
                        this.showUploadFail = true;
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                    }
                    Loading.close();
                }).catch(res =>{
                    console.log(res);
                    Loading.close();
                });
            },
            // 取消导入
            cancelImport(){
                this.showUploadFail = false;
                this.isImport = false;
            },
            // 确定导入
            confirmImport(arr){
                this.showUploadFail = false;
                console.log('import----data---', arr);
                for(let info of arr){
                    if(info.mVehicle == '广告门'){
                        this.isHaveDiffPush(info);
                    }else if(info.mVehicle =='道闸'){
                        this.isHaveDiffPush(info);
                    }
                }
                this.isImport = false;
                // this.dialogTableVisible = true;
                this.judgeByselect();
                this.dialogVisible();
                console.log('inport----data----shoplist', this.shopingList);
            },
            // 根据导入方案返回的数据,设置购物车所需要的数据格式
            setShopDataByImport(arr){
                console.log('方案导入返回的数据---', arr);
                for(let data of arr){
                    let info = data.adSInfo;
                    for(let i = 0; i<2; i++){
                        let importInfo = {
                            mID: info.mID,
                            resType: info.resType,
                            resID: info.resID,
                            asID: '',
                            asIDs: info.asID,
                            asLabs: info.asLab,
                            resName: info.resName,
                            city: info.prName,
                            rid: info.prID,
                            origin: info.rName,
                            buildType: info.cType,
                            houseNum: info.hNum,
                            buildPrice: (info.hPrice / 100),
                            mediaName: info.mTitle || '',
                            mVehicle: info.mVehicle,
                            buildNum: info.fNum,
                            schedules: timeFormat.toDate(data.pbStar, '/') + '-' + timeFormat.toDate(data.pbEnd, '/'),
                            tradingArea: info.tradingArea,
                            assetTag: info.assetTag,
                            liveYear: info.chDay,
                            mediaRemark: info.mRemark || '--',
                            mapCenter: info.reference || '--',      // 地图中心点
                            address: info.resAddress || '',
                            dNum: info.dNum || '',       // 出入口数
                            adLimit: info.notPush || '',
                            checkBox: {A: false, B: false, ABC: false},
                            connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                            connID: info.connID || '',        // 连排门id
                            industryInfos: info.industryInfos || [],   // 同行业资源回避
                            mediaLevel: info.grade || '',
                            adPrice: info.mVehicle === '道闸' ? info.asPrice / 100 || 0 : info.asPrice / 700 || 0,
                            asName: info.asName || '',         // 点位所属公司名称
                            asrID: info.asrID,                 // 所属公司id
                        };
                        if (this.customPermission.pptPermission && this.customPermission.pptPermission.gzqylPermission == '1') {
                            importInfo.recommendReason = data.recommendReason;  //  亲粤邻定制：推荐理由
                        }
                        if(info.mVehicle == '广告门'){
                            let asLabsArr = importInfo.asLabs.split(',');
                            let asIDArr = importInfo.asIDs.toString().split(',');
                            for (let n = 0; n < asLabsArr.length; n++) {
                                if (i === 0 && asLabsArr[n] === 'A') {
                                    importInfo.checkBox.A = true;
                                    importInfo.A_B = 'A';
                                    importInfo.asID = asIDArr[n];
                                    this.isHaveDiffPush(importInfo);
                                    break;
                                } else if (i === 1 && asLabsArr[n] === 'B') {
                                    importInfo.checkBox.B = true;
                                    importInfo.A_B = 'B';
                                    importInfo.asID = asIDArr[n];
                                    this.isHaveDiffPush(importInfo);
                                    break;
                                }
                            }
                        }else if(info.mVehicle =='道闸'){
                            importInfo.checkBox.ABC = true;
                            importInfo.A_B = 'ABC';
                            // importInfo.asID = importInfo.asIDs.toString().split(',');
                            importInfo.asID = info.asID
                            this.isHaveDiffPush(importInfo);
                            break;
                        }
                    }
                }
                console.log('this.shopingList----', this.shopingList);
                sessFun.messageFun('success','成功导入'+arr.length+'条数据')
                this.isImport = false;
                this.computeMedia_AD();
                this.judgeByselect();
            },
            // 判断点位是否已存在购物车(同点位同排期去重、同点位排期交叉则合并、同点位排期联系则合并)
            isHaveDiffPush(obj){
                console.log('obj----', obj, this.shopingList);
                let ADData = obj;
                let shopArr = this.shopingList;
                let sameMidArr = [];
                let resultArr = [];
                for(let k = 0, kLen = shopArr.length; k<shopArr.length;){
                    if (ADData.mID === shopArr[k].mID && ADData.A_B === shopArr[k].A_B) {
                        sameMidArr.push(shopArr[k]);
                        shopArr.splice(k, 1);
                    }else{
                        k++;
                    }
                }
                console.log('sameMidArr-----1111', sameMidArr, this.shopingList, shopArr);
                for(let data of sameMidArr){
                    let ADScheArr = ADData.schedules.split('-');
                    let shopScheArr = data.schedules.split('-');
                    if (ADScheArr[0] < shopScheArr[0] && shopScheArr[0] <= ADScheArr[1] && ADScheArr[1] < shopScheArr[1]) {
                        // 左相交(购物车相交选点)
                        ADData.schedules = ADScheArr[0] + '-' + shopScheArr[1];
                    } else if (shopScheArr[0] <= ADScheArr[0] && ADScheArr[1] <= shopScheArr[1]) {
                        ADData.schedules = shopScheArr[0] + '-' + shopScheArr[1];
                        // 购物车包含选点
                    }else if (shopScheArr[0] < ADScheArr[0] && ADScheArr[0] <= shopScheArr[1] && shopScheArr[1] < ADScheArr[1]) {
                        // 右相交(购物车相交选点)
                        ADData.schedules = shopScheArr[0] + '-' + ADScheArr[1];
                    } else if (ADScheArr[0] <= shopScheArr[0] && shopScheArr[1] <= ADScheArr[1]) {
                        // 购物车被选点包含
                        ADData.schedules = ADScheArr[0] + '-' + ADScheArr[1];
                    }else {
                        let timeArr = [ADScheArr[0], ADScheArr[1], shopScheArr[0], shopScheArr[1]];
                        timeArr.sort((a, b)=>{
                            return Date.parse(a) - Date.parse(b);
                        });
                        if(Date.parse(timeArr[2]) - Date.parse(timeArr[1]) == 86400000){
                            ADData.schedules = timeArr[0] + '-' + timeArr[3];
                        }else{
                            resultArr.push(data);
                        }
                    }
                }
                console.log('resultArr----ADData----', resultArr, ADData);
                resultArr.push(ADData);
                console.log('resultArr*****', resultArr, this.shopingList);
                this.shopingList = this.shopingList.concat(resultArr);
            },
            // 处理有问题的点
            checkPointFun(obj){
                let resultarr = [];
                for(let data of obj.errorList){
                    let item = {
                        resName: data.resName,
                        city: data.city,
                        origin: data.district,
                        mVehicle: data.mVehicle,
                        mediaName: data.mTitle,
                        asLab: data.asLab,
                        assetTag: data.assetTag,
                        schedules: data.date,
                        pointId: data.pointId,
                        failReason: data.failReason
                    };
                    resultarr.push(item);
                }
                return resultarr;
            },
            // 导出有问题的点
            downLoadExcel(){
                let arr = this.questionPoint(this.excelDataUpload, this.importInfoData.successList);
                let allHead = ['资源名称',	'市', '区', '媒介载体',	'媒体名称', '投放面', '资产编号', '投放排期', '钼媒点位ID', '失败原因'];
                sheetExcel.toDownload(allHead, arr, this.planForm.planName+'问题点位表');
            },
            // 导入excel后台返回的问题点位
            questionPoint(arr, successArr){
                console.log('arr-----', arr);
                let resultarr = [
                    {
                        sheetName: '问题点位',
                        showList: [],
                    },
                    {
                        sheetName: '正常点位',
                        showList: [],
                    }
                ];
                for(let data of arr){
                    let obj = {
                        resName: data.resName,
                        city: data.city,
                        origin: data.origin,
                        mVehicle: data.mVehicle,
                        mediaName: data.mediaName,
                        asLab: data.asLab,
                        assetTag: data.assetTag,
                        schedules: data.schedules,
                        pointId: data.pointId,
                        failReason: data.failReason
                    };
                    resultarr[0].showList.push(obj);
                }
                for(let data of successArr){
                    let info = data.adSInfo;
                    let obj = {
                        resName: info.resName,
                        city: info.prName,
                        origin: info.rName,
                        mVehicle: info.mVehicle,
                        mediaName: info.mTitle,
                        asLab: info.asLab,
                        assetTag: info.assetTag,
                        schedules: timeFormat.toDate(data.pbStar, '.')+'-'+timeFormat.toDate(data.pbEnd, '.'),
                        pointId: data.pointId,
                    };
                    resultarr[1].showList.push(obj);
                }
                return resultarr;
            },
            // 获取订单
            remoteGetOrder(query){
                if (query !== '') {
                    let ridsArr = [];
                    for(let data of this.city){
                        ridsArr.push(data.rid);
                    }
                    let rids =  ridsArr.join(',');
                    let sess = this.sessionData;
                    let info = {
                        uid: sess.uID,
                        token: sess.token,
                        apName: query,
                        suId: this.BDData.uid,
                        rIds: rids,
                    };
                    this.loadingOrder = true;
                    api.getApi(this.apiVar.Advertisement + "/GetSaleAdPlan", info).then(res => {
                        console.log(res.data);
                        this.loadingOrder = false;
                        if (res.data.SysCode == 200200) {
                            this.orderArr = res.data.data.map(item => {
                                return {
                                    label: item.apName,
                                    value: item.apID
                                };
                            });
                        } else {
                            sessFun.messageFun('warning', res.data.MSG)
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    this.orderArr = [];
                }
            },
            // 确定复制
            confirmCopy(){
                if(this.orderName){
                    let ridsArr = [];
                    for(let data of this.city){
                        ridsArr.push(data.rid);
                    }
                    let rids =  ridsArr.join(',');
                    let sess = this.sessionData;
                    let info = {
                        uid: sess.uID,
                        token: sess.token,
                        apId: this.orderName,
                        startTime: this.dateInput[0],
                        endTime: this.dateInput[1],
                        rIds: rids
                    };
                    api.getApi(this.apiVar.Advertisement + "/GetAdsFromCopiedAdPlan", info).then(res => {
                        console.log(res.data);
                        if (res.data.SysCode == 200200) {
                            let resinfo = res.data.data;
                            let result = [];
                            for (let data of resinfo) {
                                result.push(this.setCopyData(data));
                            }
                            console.log('result----', result);
                            for (let item of result) {
                                this.isHaveDiffPush(item);
                            }
                            this.judgeByselect();
                        } else {
                            sessFun.messageFun('warning', res.data.MSG)
                        }
                        this.isCopy = false;
                    }).catch(err => {
                        console.log(err);
                        this.isCopy = false;
                    });
                } else {
                    Message.warning('请先选择要复制的方案');
                }
            },
            // 构建复制方案数据格式
            setCopyData(info){
                let checkBox = {A: false, B: false,ABC:false}
                if (info.asLab === 'A') {
                    checkBox.A = true
                } else if (info.asLab === 'B') {
                    checkBox.B = true
                } else if (info.asLab === 'ABC') {
                    checkBox.ABC = true
                }
                let importInfo = {
                    mID: info.mID,
                    resType: info.resType,
                    resID: info.resID,
                    // asID: '',
                    asID: info.asID,
                    asIDs: info.asID,
                    asLabs: info.asLab,
                    resName: info.resName,
                    city: info.city,
                    rid: info.rID,
                    origin: info.rName,
                    buildType: info.cType,
                    houseNum: info.hNum,
                    buildPrice: (info.hPrice / 100),
                    mediaName: info.mTitle || '',
                    mVehicle: info.mVehicle,
                    buildNum: info.fNum,
                    schedules: this.dateInput[0] + '-' + this.dateInput[1],
                    tradingArea: info.tradingArea,
                    assetTag: info.assetTag,
                    liveYear: info.chDay,
                    mediaRemark: info.mRemark || '--',
                    mapCenter: info.reference || '--',      // 地图中心点
                    address: info.resAddress || '',
                    dNum: info.dNum || '',       // 出入口数
                    adLimit: info.notPush || '',
                    A_B: info.asLab,
                    checkBox: checkBox,
                    connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                    connID: info.connID || '',        // 连排门id
                    industryInfos: info.industryInfos || [],   // 同行业资源回避
                    mediaLevel: info.grade || '',
                    adPrice: info.mVehicle === '道闸' ? info.asPrice / 100 || 0 : info.asPrice / 700 || 0,
                    asName: info.asName || '',         // 点位所属公司名称
                    asrID: info.asrID,                 // 所属公司id,
                    lState: info.adlInfo ? info.adlInfo : '',   // 是否被占
                };
                // if(info.mVehicle === '道闸'){
                //     importInfo.asID = info.asIDs.split(',')
                // }else if(info.mVehicle === '广告门'){
                //     importInfo.asID = info.asID
                // }
                return importInfo;
            },
            // 第四步的导出方案
            downLoadFanan(){
                console.log('this.shopingList---', this.shopingList);
                let arr = this.excelData(this.shopingList)
                let allHead = ['资源名称', '市', '区',	'商圈', '资源地址',	'楼盘价格',	'入住年份',	'住户数量',	'出入口', '楼栋数量', '楼盘（写字楼）类型',	'地图中心点', '可选面数' ,'投放排期'];
                if((this.sessionData.uType == 'MD' && this.sessionData.mediaManageLevel == 1) || (this.sessionData.uType == 'BD' && this.sessionData.saleManageLevel == 2)) {
                    allHead.push('归属公司')
                }
                /* if(this.customPermission.patrolPermission) {
                    allHead.push('巡点问题', '通行情况');
                } */
                switch (this.customPermission.patrolPermission) {
                    case 1:
                        allHead.push('巡点问题', '通行情况');
                        break;
                    case 2:
                        allHead.push('巡点问题', '通行情况', '通电情况');
                        break;
                }
                if(this.shareADUrl){
                    let head = ['在线协同选点链接(可地图查看社区)  '+this.shareADUrl, '', '', '', '', '', '', '', '', '', '', '', ''];
                    sheetExcel.toDownload(allHead, arr, this.planForm.planName+'点位表', head);
                }else{
                    sheetExcel.toDownload(allHead, arr, this.planForm.planName+'点位表');
                }
            },
            // 处理数据
            excelData(arr){
                console.log('arrr------excelData', arr);
                let dateArr = [];
                let filtersData = filterFormat(arr, "schedules");
                for(let item of filtersData){
                    console.log(item);
                    let dateObj = {
                        sheetName: item.value,
                        showList: [],
                        resIDArr: [],
                    };
                    dateArr.push(dateObj);
                }
                for(let data of arr){
                    let obj = {
                        resID: data.resID,
                        resName: data.resName,
                        city: data.city,
                        rName: data.origin,
                        tradingArea: data.tradingArea,
                        resAddress: data.address,
                        hPrice: data.buildPrice,
                        chDay: data.liveYear,
                        hNum: data.houseNum,
                        dNum: data.dNum,
                        fNum: data.buildNum,
                        cType: data.buildType,
                        map: data.mapCenter,
                        adsNum: 1,
                        timeRange: '',
                    };
                    if((this.sessionData.uType == 'MD' && this.sessionData.mediaManageLevel == 1) || (this.sessionData.uType == 'BD' && this.sessionData.saleManageLevel == 2)) {
                        obj.asName = data.asName
                    }
                    // 巡点权限
                    if(this.customPermission) {
                        switch (this.customPermission.patrolPermission) {
                            case 1:
                                obj.remark = data.remark
                                obj.trafficState = data.trafficState
                                break;
                            case 2:
                                obj.remark = data.remark
                                obj.trafficState = data.trafficState
                                obj.electrifyState = data.electrifyState;
                                break;
                        }
                    }
                    for(let date of dateArr){
                        if(data.schedules == date.sheetName){
                            if(date.resIDArr.includes(data.resID)){
                                for(let item of date.showList){
                                    if(item.resID == data.resID){
                                        item.adsNum++;
                                        break;
                                    }
                                }
                            }else{
                                obj.timeRange = date.sheetName;
                                date.resIDArr.push(data.resID);
                                date.showList.push(obj);
                            }
                            break;
                        }
                    }
                }
                for(let data of dateArr){
                    for(let obj of data.showList){
                        delete obj.resID;
                    }
                    data.sheetName = data.sheetName.replace(/[/]/g, '.');
                }
                console.log('datearrr-----', dateArr);
                return dateArr;
            },
            // 分页
            changePage(val) {
                // console.log('当前页',val)
                this.currPageSelect = 0
                this.IsAll = false
                this.pageNo = val
                this.getAdsParamsData.pageNo = this.pageNo
                this.getAdList()
            },
            // 每页条数切换
            sizeChange(val) {
                this.IsAll = false
                this.pageSize = val;
                this.pageNo = 1;
                this.getAdsParamsData.pageNo = this.pageNo
                this.getAdsParamsData.pageSize = this.pageSize
                this.getAdList()
            },
            // //监听table滚动
            // loadMore() {
            //     if (this.loadScroll) {
            //         this.loadScroll = false
            //         if(this.pageNo <= this.total){
            //             this.getAdsParamsData.pageNo = this.pageNo
            //             this.getAdList()
            //         }
            //     } else {
            //         console.log('此时为搜索出来的数据')
            //     }
            // },
            // 获取浏览器session数据
            getsessionData() {
                this.sessionData = sessFun.getSess();
                this.customPermission = this.sessionData.customPermission;
                if (this.sessionData.uType === 'BD') {
                    this.BDData.realName = this.sessionData.username //sessionStorage.getItem('username')
                    this.planForm.ownerSales = this.BDData.realName
                    this.BDData.uid = this.sessionData.uID
                    this.saleManageLevel = this.sessionData.saleManageLevel
                    this.isBD = true
                } else {
                    this.isBD = false
                }
                let starTime, endTime
                this.dateTime = timeFormat.returnDayCount(0,'/')
                starTime = timeFormat.returnDayCount(1,'/')
                endTime = timeFormat.returnDayCount(14,'/')
                this.dateInput = [starTime, endTime] // 设置默认时间
                this.beforeDate = [starTime, endTime]
            },
            // 获取排斥方案选择列
            getRejectPlanList(){
                let params = {
                    uid:this.sessionData.uID,
                    token: this.sessionData.token,
                    sales_user: this.BDData.uid
                }
                api.getApi(this.apiVar.Advertisement + '/getSalesProject', params).then(res => {
                    console.log('销售所属方案',res)
                    if (res.data.SysCode == 200200) {
                        let resData =  res.data.data
                        let tempList = []
                        for(let key of resData){
                            if(this.apid != key.apId){
                                tempList.push({
                                    value: key.apId,
                                    label: key.apName + '--' + key.cname + '--' + key.apcTime
                                })
                            }
                        }
                        this.rejectAdPlan = tempList
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                    }
                })
            },
            // step2 获取广告限制列表
            getADLimit() {
                this.ADLimit = []
                let params = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service":"GetNotPush",
                    "data": {}
                }
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('广告限制列表', res)
                    if(res.data.SysCode === 200200 ){
                        let limit = res.data.data
                        let limitArr = []
                        // let firstObj = {value: '全部', label: '全部'}
                        // limitArr.push(firstObj)
                        for (let i = 0; i < limit.length; i++) {
                            let limitObj = {value: limit[i].nTitle, label: limit[i].nTitle}
                            limitArr.push(limitObj)
                        }
                        this.ADLimit = limitArr
                    }
                })
            },
            // 获取广告点位列表
            getAdList() {
                console.log('当前页码',this.pageNo,'当前时间',this.dateInput)
                this.loading = true
                this.getAdsParamsData.dateTimeBegin = this.dateInput[0]
                this.getAdsParamsData.dateTimeEnd = this.dateInput[1]
                this.getAdsParamsData.pageNo = this.pageNo
                this.getAdsParamsData.uid = this.BDData.uid
                this.getAdsParamsData.asrIDs = this.BDData.asrIDs || ''
                for(let i in this.getAdsParamsData){
                    if(this.getAdsParamsData[i] === ''){
                        delete this.getAdsParamsData[i]
                    }
                }
                let params = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service": "GetAdS",
                    "data":  this.getAdsParamsData
                }
                api.postApi_new(this.apiVar.Media, params).then(res => {
                    console.log('选点列表：', res)
                    if (res.data.SysCode === 200200) {
                        if(res.data.data.list !== undefined && res.data.data.list.length > 0){
                            this.planList = []
                            let ADList = res.data.data.list
                            this.setTableDataADDoor(ADList)
                            this.total = res.data.data.total
                            this.adsCount = res.data.data.adsCount
                            // this.pageNo++
                            // console.log(' this.pageNo++', this.pageNo)
                            this.judgeByselect()
                            this.searchBtnAbled = false
                        }else{
                            this.planList = []
                        }
                        this.loading = false
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                        this.loading = false
                    }
                    this.searchBtnAbled = false
                })
            },
            // 接口数据转成table
            setTableDataADDoor(ADSdata){
                console.log('接口数据转成table当前时间',this.dateInput)
                let i = 0
                for(let key of ADSdata) {
                    let adObj = {
                        mID: key.mID,
                        resType: key.resType,
                        resID: key.resID,
                        asIDs: key.asIDs,
                        asLabs: key.asLabs,
                        resName: key.resName,
                        city: this.city[this.activeIndex].rName,
                        rid: this.city[this.activeIndex].rid,
                        origin: key.rName,
                        buildType: key.cType,
                        houseNum: key.hNum,
                        buildPrice: (key.hPrice / 100),
                        mediaName: key.mTitle || '',
                        mVehicle: key.mVehicle,             // 媒体类型
                        mediaRemark: key.mRemark || '--',
                        parkSpaceNum: key.parkSpaceNum,
                        carFlow: key.carFlow,
                        peopleFlow : key.peopleFlow,
                        buildNum: key.fNum,
                        schedules: this.dateInput[0] + '-' + this.dateInput[1],
                        tradingArea: key.tradingArea || '',
                        assetTag: key.assetTag || '',
                        liveYear: key.chDay,
                        adLimit: key.notPush || '',
                        mState: key.mState === 1 ? '正常' : (key.mState === 2 ? '待安装' : '--'),
                        adSize: key.adSize || '',
                        picSize: key.picSize || '',
                        mapCenter: key.reference || '',      // 地图中心点
                        address: key.resAddress || '',
                        dNum: key.dNum || '',               // 出入口数
                        connID: key.connID || '',           // 连排门id
                        industryInfos: key.industryInfos,   // 同行业资源、媒体回避
                        mediaLevel: key.grade || '',
                        asName: key.asName || '',                 // 点位所属公司名称
                        asrID: key.asrID,                         // 所属公司id
                        checkBox: {A: false, B: false,ABC:false},
                        box: {A: false, B: false},
                        remark: key.remark,
                        trafficState: key.trafficState,
                        electrifyState: key.electrifyState
                    }
                    if (key.mVehicle === '道闸') {
                        adObj.adPrice = key.asPrice / 100
                    } else {
                        if (key.asPrice) {
                            adObj.adPrice = key.asPrice / 700
                        } else {
                            if (key.grade === 'A') {
                                adObj.adPrice = 3080 / 7
                            } else if (key.grade === 'B') {
                                adObj.adPrice = 2380 / 7
                            } else if (key.grade === 'C') {
                                adObj.adPrice = 1800 / 7
                            } else {
                                adObj.adPrice = 0
                            }
                        }
                    }
                    if (key.asLabs.indexOf('A') === -1) {
                        adObj.box.A = true
                    }else {
                        //本页可选点位
                        i++;
                    }
                    if (key.asLabs.indexOf('B') === -1) {
                        adObj.box.B = true
                    }else {
                        //本页可选点位
                        i++;
                    }
                    if (key.adlInfo !== null && key.adlInfo !== undefined && key.adlInfo.length > 0) {
                        let arr = []
                        for (let akey of key.adlInfo) {
                            if(akey.asState){
                                arr.push({
                                    asState: akey.asState
                                })
                            }else{
                                let star = timeFormat.toDate(akey.lStar, '/')
                                let end = timeFormat.toDate(akey.lEnd, '/')
                                arr.push({
                                    beOccupieApName: akey.apName,
                                    schedules: star + '-' + end,
                                    lState: akey.lState,
                                })
                            }
                        }
                        adObj.adlInfo = arr
                    } else {
                        adObj.adlInfo = ''
                    }
                    this.planList.push(adObj)
                }
                console.log('表格数据',this.planList)
                this.currPageAsLength = i
                this.loadScroll = true
            },
            setPageNoAndTableData(){
                this.loadScroll = false
                this.IsAll = false
                this.HSearch = ''
                this.pageNo = 1
                this.planList = []
            },
            // 方案排斥选择
            selectRejectPlan(val){
                console.log('方案排斥选择',val,this.activeAdPlan)
                this.getAdsParamsData.apId = this.activeAdPlan
                this.setPageNoAndTableData()
                this.getAdList()
            },
            //step2搜索按钮
            searchFun() {
                console.log('搜索排期时间', this.dateInput)
                this.searchBtnAbled = true
                // this.recType = 1
                this.areaName = '全市'
                if (this.selectValue === '被占查询') {
                    this.loadScroll = false
                    this.beOccupiedGetList()    // 获取被占列表接口
                    this.beOccupiedNumber++
                } else {
                    this.loadScroll = true
                    this.isOccupied = true      //  || this.dateInput !== this.beforeDate
                    if (this.searchInput !== '' && this.dateInput !== null) {
                        this.setPageNoAndTableData()
                        this.ResOriginSearch()
                    } else if (this.searchInput === '' && this.dateInput !== this.beforeDate && this.dateInput !== null) {
                        this.setPageNoAndTableData()
                        this.getAdList()
                        this.beforeDate = this.dateInput
                    }else if(!this.dateInput){
                        sessFun.messageFun('warning','搜索时间不能为空!')
                        this.searchBtnAbled = false
                    }else{
                        this.searchBtnAbled = false
                    }
                }

            },
            // 资源名称\商圈搜索typeSelect
            ResOriginSearch() {
                if (this.selectValue === '资源名称'){
                    this.getAdsParamsData.resName = this.searchInput
                    this.getAdsParamsData.tradingArea = ''
                    this.getAdsParamsData.assetTag = ''
                }else if(this.selectValue === '商圈'){
                    this.getAdsParamsData.tradingArea = this.searchInput
                    this.getAdsParamsData.resName = ''
                    this.getAdsParamsData.assetTag = ''
                }else if(this.selectValue === '资产编号'){
                    this.getAdsParamsData.assetTag = this.searchInput
                    this.getAdsParamsData.tradingArea = ''
                    this.getAdsParamsData.resName = ''
                }
                this.getAdList()
            },
            // 当搜索框为空的时候进行重置显示
            initData(val){
                console.log('搜索框变化的值',val)
                if (!this.searchInput && this.selectValue !== '被占查询') {
                    this.isOccupied = true
                    this.getAdsParamsData.tradingArea = ''
                    this.getAdsParamsData.assetTag = ''
                    this.getAdsParamsData.resName = ''
                    this.pickerOptions = {
                        disabledDate(time) {
                            return time.getTime() <= Date.now();
                        }
                    }
                    // 明天的日期（/分割）
                    let tomorrow = timeFormat.returnDayCount(1, '/')
                    if(this.dateInput[0] < tomorrow) {
                        if(this.dateInput[1] < tomorrow) {
                            // 日期范围只选择了当天
                            this.dateInput = [tomorrow, tomorrow]
                        } else {
                            this.dateInput.splice(0,1,tomorrow)
                        }
                    }
                    this.setPageNoAndTableData()
                    this.getAdList()
                } else if(this.selectValue == '被占查询') {
                    this.pickerOptions = {
                        disabledDate(time) {
                            return time.getTime() <= Date.now()-1000*3600*24;
                        }
                    }
                }
            },
            // 判断地图权限
            judgeMapSelect() {
                this.isMapKind = true
                // if (this.sessionData.rela == '直营') {
                //     this.isMapKind = true
                // } else {
                //     this.mapAD()
                // }
            },
            // 选择地图类型
            selectMap() {
                if (this.selectMapKind == 1) {
                    this.mapAD();
                    this.ActiveMapType = 1
                } else if (this.selectMapKind == 2) {
                    this.setMapParams();
                    localStorage.removeItem('qinlinMapCode');
                    this.ActiveMapType = 2
                }
                this.isMapKind = false
            },
            //step2地图选点
            mapAD() {
                console.log('地图选点提交的rid', this.activeCityData)
                let rid = this.activeCityData.rid
                this.mapParams = {
                    rid: rid,
                    city: this.activeCityData.rName,
                    ls: this.dateInput[0],
                    le: this.dateInput[1]
                }
                let params = {
                    uid: this.sessionData.uID,
                    token:this.sessionData.token,
                    rid: rid,
                    act: 1,
                    ls: this.dateInput[0],
                    le: this.dateInput[1],
                    suID: this.BDData.uid,
                    apId: this.activeAdPlan
                }
                if (params.apId === '') {
                    delete params.apId
                }
                console.log('生成地图MapID参数', params)
                let tempwindow = window.open()
                api.getApi(this.apiVar.Map + '/GetMapInfo', params).then(res => {
                    console.log('GetMapInfo地图mapid返回的信息', res)
                    if (!res.data.SysCode) {
                        let mapid = res.data.MapID
                        this.dialogTableVisible = true
                        this.computeMedia_AD()
                        this.mapBtn = false
                        tempwindow.location = this.apiVar.wuYouMap + mapid + '&city=' + this.activeRName + '&flag=' + true
                    } else {
                        tempwindow.close()
                        sessFun.messageFun('warning', res.data.MSG + ',请尝试重新点击')
                    }
                }).catch(err => {
                    console.log('error', err)
                })
            },
            // 设置地图选点参数
            setMapParams() {
                localStorage.removeItem('qinlinMapCode');
                this.ActiveMapType = 2;
                this.mapParams = {
                    rid: this.activeCityData.rid,
                    city: this.activeCityData.rName,
                    ls: this.dateInput[0],
                    le: this.dateInput[1],
                };
                localStorage.setItem('mapParams',JSON.stringify({
                    rid: this.activeCityData.rid,
                    ls: this.dateInput[0],
                    le: this.dateInput[1],
                    suID: this.BDData.uid,
                    asrIDs: this.BDData.asrIDs.split(',')
                }));
                let url = '';
                if(window.location.hostname == 'localhost') {
                    url = window.location.host + '/ADResourceMap/chooseRes?city=' + this.mapParams.city + '&flag=' + true
                } else {
                    url = this.apiVar.qadnUrl + '/ADResourceMap/chooseRes?city=' + this.mapParams.city + '&flag=' + true
                };
                window.open(url);
                this.mapBtn = false;
                this.dialogVisible()
            },
            // 模态框中的确认按钮
            oneKeyPointBtn(item){
                let IsBoolean = false
                this.$refs[item].validate((valid) => {
                    if (valid) {
                        IsBoolean = true
                    } else {
                        console.log('error submit!!')
                        return false;
                    }
                })

                if(IsBoolean){
                    console.log('一键选点',this.oneKeyPointData)
                    if(Number(this.oneKeyPointData.TotalPoint) < Number(this.oneKeyPointData.pointNumByRes)){
                        sessFun.messageFun('warning','每小区选择的个数不能大于点位总量')
                    }else{
                        this.oneKeySelectPoint()
                    }

                }else{
                    sessFun.messageFun('warning','信息填写有误')
                }

            },
            //一键选点
            oneKeySelectPoint(){
                console.log('一键选点')
                let oneKeyPointLoading = this.$loading({
                    lock: true,
                    text: '快马加鞭选点中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let IsXhr = false
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    vehicle:'AdGate',
                    act: 1,
                    ls: this.dateInput[0].replace(/\./g, '/'),
                    le: this.dateInput[1].replace(/\./g, '/'),
                    rid: this.city[this.activeIndex].rid,
                    total: this.oneKeyPointData.TotalPoint,
                    everyResNumber: this.oneKeyPointData.pointNumByRes,
                    labAPercent: this.oneKeyPointData.A_cale,
                    rt:  this.recType,
                    rhn: this.houseNum[0],
                    shn: this.houseNum[1],
                    shp: this.buildPrice[0] * 100,
                    bhp: this.buildPrice[1] * 100,
                    suid: this.BDData.uid,
                    apId: this.activeAdPlan,
                    asrIDs: this.BDData.asrIDs || ''
                }
                if(this.selectValue === '商圈'){
                    params.ta = this.searchInput
                }
                // 过滤地区rID
                console.log(this.areaName,'areaRid',this.areaRid)
                if(this.areaName !== '全市'){
                    params.qrid = this.areaRid
                }
                // 限制广告不能投放类型 ,分割
                if(this.limitList.length > 0){
                    params.adLimit = this.limitList.join(',')
                }
                for(let i in params){
                    if(i !== 'labAPercent' && (params[i] === '' || params[i] === undefined || params[i] == 0)){
                        delete params[i]
                    }
                }
                api.postApi(this.apiVar.Advertisement + '/AutoSetAdS', params).then(res=>{
                    console.log('一键选点',res.data)
                    IsXhr = true
                    let tempArr = []
                    let resArr = res.data
                    if(resArr !== '' && resArr.length > 0){
                        for(let key of res.data){
                            let selectInfo = {
                                rid: this.city[this.activeIndex].rid,
                                mID: key.mID,
                                mVehicle: key.mVehicle,
                                asID: key.asID,
                                asIDs: key.asID,
                                asLabs: key.asLab,
                                resName: key.resName,
                                resID: key.resID,
                                city: this.city[this.activeIndex].rName,
                                origin: key.rName,
                                buildType: key.cType,
                                houseNum: key.hNum,
                                buildPrice: key.hPrice/100,
                                mediaName: key.mTitle || '',
                                trafficState: key.trafficState||'',
                                electrifyState: key.electrifyState||'',
                                remark: key.remark ? key.remark : '',
                                buildNum: key.fNum,
                                schedules: this.dateInput[0] + '-' + this.dateInput[1],
                                tradingArea: key.tradingArea,
                                assetTag: key.assetTag,
                                liveYear: key.chDay,
                                adLimit: key.notPush,
                                mapCenter: key.reference || '',      // 地图中心点
                                address: key.resAddress || '',
                                dNum: key.dNum || '',       // 出入口数
                                A_B: key.asLab,
                                checkBox: {A: false, B: false,ABC: false},
                                connID: key.connID || '',
                                connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                                industryInfos : key.industryInfos || [],
                                mediaLevel: key.grade || '',
                                adPrice: key.mVehicle === '道闸' ? key.asPrice / 100 || 0 : key.asPrice / 700 || 0,
                                asName: key.asName || '',         // 点位所属公司名称
                                asrID: key.asrID,                 // 所属公司id
                            }
                            if(selectInfo.asLabs === 'A'){
                                selectInfo.checkBox.A = true
                            }else if(selectInfo.asLabs === 'B'){
                                selectInfo.checkBox.B = true
                            }
                            if (this.judgeHaveDiffAD(selectInfo)) {
                                console.log('1')
                                tempArr.push(selectInfo)
                                // break
                            }
                        }
                        if (this.shopingList.length !== 0) {
                            for (let key of tempArr) {
                                this.shopingList.push(key)
                            }
                        } else {
                            this.shopingList = tempArr
                        }
                        this.dialogOneKeyPoint = false
                        this.computeMedia_AD()
                        this.judgeByselect()
                        if(this.oneKeyPointData.TotalPoint == res.data.length){
                            sessFun.messageFun('success','成功选择了'+ res.data.length +'面')
                        }else{
                            sessFun.messageFun('warning','满足条件的点位不足'+this.oneKeyPointData.TotalPoint+'面,成功选择了'+ res.data.length +'面')
                        }

                    }else{
                        sessFun.messageFun('warning','选择失败')
                    }
                    oneKeyPointLoading.close()
                })
                let timer = setTimeout(()=>{
                    if(!IsXhr){
                        // console.log('取消一键选点')
                        sessFun.messageFun('warning','点位选择异常')
                        oneKeyPointLoading.close()
                    }else{
                        // console.log('一键选点已成功')
                    }
                    clearTimeout(timer)
                },1000*65)
            },
            // step2, 资源类型切换
            activeRecType(num) {
                this.buildValue = ''
                this.getAdsParamsData.buildType = ''
                if(num == '1'){
                    this.buildType = this.village
                }else if(num == '2'){
                    this.buildType = this.officeBuilding
                }
                this.setPageNoAndTableData()
                this.recType = num
                this.getAdsParamsData.resType = num
                this.getAdList()
            },
            //媒体类型切换
            activeMediaType(mType){
                console.log('媒体类型',mType)
                this.setPageNoAndTableData()
                this.mediaType = mType
                this.getAdsParamsData.mVehicle = mType
                this.getAdList()
            },
            // 设置城市区域
            getAreaFun() {
                this.area = []
                let throwCityList = this.planForm.throwCity
                // console.log('****************', throwCityList)
                // console.log('________--------', this.throwCity)
                let cityArr = []
                for (let j = 0; j < throwCityList.length; j++) {
                    for (let t = 0; t < this.throwCity.length; t++) {
                        if (this.throwCity[t].value === throwCityList[j]) {
                            let cityObj = {rName: this.throwCity[t].label, rid: this.throwCity[t].value}
                            cityArr.push(cityObj)
                        }
                    }
                    if (j >= throwCityList.length - 1) {
                        this.city = cityArr
                        this.city.sort(this.compareFun)
                        console.log('this.city ', this.city)
                        this.activeCityData = this.city[0]    // 设置初始选中城市信息
                        for (let n = 0; n < this.city.length; n++) {
                            let rid = this.city[n].rid
                            console.log('投放城市rid', rid)
                            let provinceRid = rid.substring(0, 2) + '0000'
                            // alert(provinceRid)
                            let city_arr = this.areaCity
                            let areaArr = []
                            console.log('this.cityOptions', this.areaCity)
                            for (let i = 0; i < city_arr.length; i++) {       // 遍历城市查找城市名对应的rid，用于删除勾选的城市
                                if (city_arr[i].value == provinceRid) {
                                    let child = city_arr[i].children
                                    for (let j = 0; j < child.length; j++) {
                                        if (child[j].value == rid) {
                                            let areaChild = child[j].children
                                            // console.log('区区区',areaChild)
                                            for (let n = 0; n < areaChild.length; n++) {
                                                if (n === 0) {
                                                    let allArea = {
                                                        rID: rid,
                                                        rName: '全市'
                                                    }
                                                    areaArr.push(allArea)
                                                }
                                                let myArea = {rID: areaChild[n].value, rName: areaChild[n].label}
                                                areaArr.push(myArea)
                                                if (n >= areaChild.length - 1) {
                                                    console.log('areaArr', areaArr)
                                                    this.area.push(areaArr)
                                                    this.area.sort(this.compareArea)
                                                }
                                            }
                                        }
                                    }
                                }
                                if (i >= city_arr.length - 1) {
                                    console.log('this.area', this.area)
                                    // this.area = areaArr
                                }
                            }
                        }
                    }
                }
            },
            // tab切换城市
            activeCity(item, index) {
                console.log('item',item,'index',index)
                this.activeIndex = index
                this.activeRName = item.rName
                this.activeCityData = item
                this.areaName = '全市'
                this.getAdsParamsData.area = ''
                this.getAdsParamsData.prID = this.city[index].rid
                this.setPageNoAndTableData()
                this.getAdList()
            },
            //  stpe2, 切换区域
            activeArea(item) {
                this.areaName = item.rName
                this.areaRid = item.rID
                this.setPageNoAndTableData()
                if(this.areaName === '全市'){
                    this.getAdsParamsData.area = ''
                }else{
                    this.getAdsParamsData.area = item.rName
                }
                this.getAdList()
            },
            // 选点表格头部过滤条件tab删除方法
            filterTagCloseFun(tab,index){
                console.log('tab',tab,'index',index)
                if (tab.condition === 'mstate') {              // 媒体状态
                    this.mState = ''
                    this.getAdsParamsData.mState = ''
                } else if(tab.condition === 'grade') {           // 媒体等级
                    this.activeGrade = ''
                    this.getAdsParamsData.grade = ''
                }else if (tab.condition === 'ADLimit'){        // 广告限制
                    this.limitList = []
                    this.getAdsParamsData.adLimit = ''
                } else if (tab.condition === 'cType') {         // 楼盘类型
                    this.buildValue = ''
                    this.getAdsParamsData.buildType = ''
                } else if (tab.condition === 'houseNum') {      // 住户数量
                    this.houseNum[0] = ''
                    this.houseNum[1] = ''
                    this.filterData.hNum = false
                    this.getAdsParamsData.houseNumMin = ''
                    this.getAdsParamsData.houseNumMax = ''
                } else if (tab.condition === 'buildPrice') {    // 楼盘价格
                    this.buildPrice[0] = ''
                    this.buildPrice[1] = ''
                    this.filterData.bPrice = false
                    this.getAdsParamsData.hPriceMin = ''
                    this.getAdsParamsData.hPriceMax = ''
                } else if (tab.condition === 'liveYear') {      // 入住年份
                    this.liveYear[0] = ''
                    this.liveYear[1] = ''
                    this.filterData.lYear = false
                    this.getAdsParamsData.liveYearMin = ''
                    this.getAdsParamsData.liveYearMax = ''
                } else if (tab.condition === 'peopleFlow') {    // 人流量
                    this.peopleFlow[0] = ''
                    this.peopleFlow[1] = ''
                    this.filterData.pFlow = false
                    this.getAdsParamsData.peopleFlowMin = ''
                    this.getAdsParamsData.peopleFlowMax = ''
                } else if (tab.condition === 'carFlow') {       // 车流量
                    this.carFlow[0] = ''
                    this.carFlow[1] = ''
                    this.filterData.cFlow = false
                    this.getAdsParamsData.carFlowMin = ''
                    this.getAdsParamsData.carFlowMax = ''
                } else if (tab.condition === 'parkSpaceNum') {      // 车位数
                    this.parkSpaceNum[0] = ''
                    this.parkSpaceNum[1] = ''
                    this.filterData.pSNum = false
                    this.getAdsParamsData.parkSpaceNumMin = ''
                    this.getAdsParamsData.parkSpaceNumMax = ''
                }
                this.filterCondition.splice(index,1)
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 判断是否存在该条件的tag
            isHaveThisTag(letter,tagName){
                let isHave = false
                for(let i in this.filterCondition){
                    if(this.filterCondition[i].condition === letter){
                        isHave = true
                        this.filterCondition[i].name = tagName
                        break
                    }
                }
                if (!isHave) {
                    this.filterCondition.push({
                        name: tagName,
                        type: 'info',
                        condition: letter
                    })
                }
            },
            // 修改搜索中的媒体状态 filterCondition
            mStateChange(state) {
                if(this.selectValue !== '被占查询'){
                    console.log('切换媒体状态',state,this.mState)
                    let stateName = ''
                    if(state === '1'){
                        stateName = '正常'
                    }else{
                        stateName = '待安装'
                    }
                    this.isHaveThisTag('mstate',stateName)
                    if (stateName !== '不限') {
                        this.getAdsParamsData.mState  = state
                    }else{
                        this.getAdsParamsData.mState = ''
                    }
                    this.setPageNoAndTableData()
                    this.getAdList()
                }else{
                    sessFun.messageFun('warning','被占查询状态下，无效切换!')
                }
            },
            // 媒体等级过滤
            gradeChange(data){
                console.log('媒体等级过滤',data)
                this.isHaveThisTag('grade',data+'级')
                this.getAdsParamsData.grade = this.activeGrade
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 广告限制切换
            activeADLimit(limit) {
                console.log('广告限制limit', limit) // 保险,恶俗医疗
                let limitText = limit.join(',')
                let stateName = '广告限制：' + limit.join('/')
                if(limit.length > 0){
                    this.isHaveThisTag('ADLimit',stateName)
                }else{
                    for(let i in this.filterCondition){
                        if(this.filterCondition[i].condition === 'ADLimit'){
                            this.filterCondition.splice(i,1)
                            break
                        }
                    }
                }
                this.getAdsParamsData.adLimit = limitText
                this.setPageNoAndTableData()
                this.getAdList()
            },
            // 住户数量过滤
            tableHeaderFilter_h() {
                if (this.houseNum[0] == '' || this.houseNum[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误!')
                } else {
                    let tagName = '住户数量:' + this.houseNum[0] + "-" + this.houseNum[1]
                    this.isHaveThisTag('houseNum', tagName)
                    this.filterData.hNum = true
                    this.getAdsParamsData.houseNumMin = this.houseNum[0]
                    this.getAdsParamsData.houseNumMax = this.houseNum[1]
                    this.setPageNoAndTableData()
                    this.getAdList()
                }
            },
            // 楼盘价格过滤
            tableHeaderFilter_p() {
                if (this.buildPrice[0] == '' || this.buildPrice[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误!')
                } else {
                    let tagName = '楼盘价格:' + this.buildPrice[0] + "-" + this.buildPrice[1]
                    this.isHaveThisTag('buildPrice', tagName)
                    this.filterData.bPrice = true
                    this.getAdsParamsData.hPriceMin = this.buildPrice[0] * 100
                    this.getAdsParamsData.hPriceMax = this.buildPrice[1] * 100
                    this.setPageNoAndTableData()
                    this.getAdList()
                }
            },
            // 年份过滤
            tableHeaderFilterByLiveYear() {
                if (this.liveYear[0] == '' || this.liveYear[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误!')
                } else {
                    let tagName = '入住年份:' + this.liveYear[0] + "-" + this.liveYear[1]
                    this.isHaveThisTag('liveYear', tagName)
                    this.filterData.lYear = true
                    this.getAdsParamsData.liveYearMin = this.liveYear[0]
                    this.getAdsParamsData.liveYearMax = this.liveYear[1]
                    this.setPageNoAndTableData()
                    this.getAdList()
                }
            },
            // 楼盘类型过滤
            tableHeaderFilter_cType(data) {
                console.log('楼盘类型过滤',data)
                this.isHaveThisTag('cType',data)
                if(data === '全部'){
                    this.getAdsParamsData.buildType = ''
                }else{
                    this.getAdsParamsData.buildType = this.buildValue
                }
                this.setPageNoAndTableData()
                this.getAdList()
            },
            //人流量过滤
            tableHeaderFilterByPeopleFlow() {
                if (this.peopleFlow[0] == '' || this.peopleFlow[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误!')
                } else {
                    let tagName = '人流量:' + this.peopleFlow[0] + "-" + this.peopleFlow[1]
                    this.isHaveThisTag('peopleFlow', tagName)
                    this.filterData.pFlow = true
                    this.getAdsParamsData.peopleFlowMin = this.peopleFlow[0]
                    this.getAdsParamsData.peopleFlowMax = this.peopleFlow[1]
                    this.setPageNoAndTableData()
                    this.getAdList()
                }
            },
            // 车流量过滤
            tableHeaderFilterByCarFlow() {
                if (this.carFlow[0] == '' || this.carFlow[1] == '') {
                    sessFun.messageFun('warning','数据区间填写有误!')
                } else {
                    let tagName = '车流量:' + this.carFlow[0] + "-" + this.carFlow[1]
                    this.isHaveThisTag('carFlow', tagName)
                    this.filterData.cFlow = true
                    this.getAdsParamsData.carFlowMin = this.carFlow[0]
                    this.getAdsParamsData.carFlowMax = this.carFlow[1]
                    this.setPageNoAndTableData()
                    this.getAdList()
                }
            },
            // 车位数过滤
            tableHeaderFilterByParkSpaceNum(){
                if(this.parkSpaceNum[0] == '' || this.parkSpaceNum[1]){
                    sessFun.messageFun('warning','数据区间填写有误!')
                }else{
                    let tagName = '车位数:' + this.parkSpaceNum[0] + "-" + this.parkSpaceNum[1]
                    this.isHaveThisTag('parkSpaceNum',tagName)
                    this.filterData.pSNum = true
                    this.getAdsParamsData.parkSpaceNumMin = this.parkSpaceNum[0]
                    this.getAdsParamsData.parkSpaceNumMax = this.parkSpaceNum[1]
                    this.setPageNoAndTableData()
                    this.getAdList()
                }
            },
            emptyFun(letter) {       // 清空
                if (letter === 'H') {
                    this.houseNum = ['', '']
                } else if (letter === 'B') {
                    this.buildNum = ['', '']
                } else if (letter === 'P') {
                    this.buildPrice = ['', '']
                } else if (letter === 'Y') {
                    this.liveYear = ['', '']
                } else if (letter === 'PSN') {
                    this.carFlow = ['', '']
                } else if (letter === 'CF') {
                    this.parkSpaceNum = ['', '']
                } else if (letter === 'PF') {
                    this.peopleFlow = ['', '']
                }
            },
            // 表头全选
            allCheckboxAds(){
                console.log('allCheckboxAds',this.IsAll)
                if(this.IsAll){
                    this.allSelectAdsBtn()
                }else{
                    this.cancleSelectAds()
                }
            },
            // 表头勾选重置
            allCheckboxUpdata(){
                if( this.shopingList.length <= 0){
                    this.IsAll = false
                }else{
                    let isCheckBox = false
                    for(let key of this.planList){
                        if(key.checkBox.A || key.checkBox.B ||key.checkBox.ABC){
                            isCheckBox = true
                            break
                        }
                    }
                    if(!isCheckBox){
                        this.IsAll = false
                    }
                }
            },
            // 全选表格点位
            allSelectAdsBtn() {
                console.log('全选')

                if(this.mediaType === '广告门'){
                    this.allSelectToShop_adDoor()
                }else if(this.mediaType === '道闸'){
                    this.allSelectToShop_roadGate()
                }
                this.shopShow_hide('all')
                // this.allSelectToShop(selection)
            },
            //取消全选
            cancleSelectAds(){
                console.log('取消全选',this.planList,this.currPageSelect)
                for(let pkey of this.planList){
                    if(pkey.checkBox.A || pkey.checkBox.B || pkey.checkBox.ABC){
                        for(let i=0; i<this.shopingList.length;){
                            if(pkey.mID === this.shopingList[i].mID){
                                if(pkey.checkBox.A && this.shopingList[i].A_B === 'A'){
                                    this.shopingList.splice(i,1)
                                    pkey.checkBox.A = false
                                }else if (pkey.checkBox.B && this.shopingList[i].A_B === 'B'){
                                    this.shopingList.splice(i,1)
                                    pkey.checkBox.B = false
                                }else if (pkey.checkBox.ABC && this.shopingList[i].A_B === 'ABC'){
                                    this.shopingList.splice(i,1)
                                    pkey.checkBox.ABC = false
                                }else{
                                    i++
                                }
                            }else{
                                i++
                            }
                        }
                    }
                }
                this.currPageSelect = 0
                // this.computeMedia_AD()
            },
            // 全选时放进购物车-广告门
            allSelectToShop_adDoor(){
                for (let i = 0; i < this.planList.length; i++) {
                    let info = this.planList[i]
                    for (let j = 0; j < 2; j++) {
                        let selectInfo = this.setShopingTable(info,'')
                        let asLabsArr = selectInfo.asLabs.split(',')
                        let asIDArr = selectInfo.asIDs.split(',')
                        if (j === 0 && !selectInfo.box.A) {
                            if(!info.checkBox.A) {
                                selectInfo.A_B = 'A'
                                info.checkBox.A = true
                                for (let n = 0; n < asLabsArr.length; n++) {
                                    if (asLabsArr[n] === 'A') {
                                        console.log('A', asIDArr[n])
                                        selectInfo.asID = asIDArr[n]
                                        break
                                    }
                                }
                                this.currPageSelect++
                                this.shopingList.push(selectInfo)
                            }

                        } else if (j === 1 && !selectInfo.box.B) {
                            if(!info.checkBox.B) {
                                selectInfo.A_B = 'B'
                                info.checkBox.B = true
                                for (let n = 0; n < asLabsArr.length; n++) {
                                    if (asLabsArr[n] === 'B') {
                                        console.log('B', asIDArr[n])
                                        selectInfo.asID = asIDArr[n]
                                        break
                                    }
                                }
                                this.currPageSelect++
                                this.shopingList.push(selectInfo)
                            }

                        }
                    }
                }
                console.log('广告门全选时购物车', this.shopingList)
            },
            // 全选时放进购物车-道闸
            allSelectToShop_roadGate(){
                for (let pkey of this.planList){
                    if(!pkey.checkBox.ABC) {
                        pkey.checkBox.ABC = true
                        let selectInfo = this.setShopingTable(pkey,'ABC')
                        this.currPageSelect++
                        this.shopingList.push(selectInfo)
                    }
                    }

                console.log('道闸全选时购物车', this.shopingList)
            },
            // 根据购物车已有的mID对应AB面判断勾选
            judgeByselect() {
                console.log('judgeByselect',this.planList)
                this.currPageSelect = 0
                if (this.shopingList.length > 0) {
                    for (let i = 0; i < this.shopingList.length; i++) {
                        this.hadADByshop(this.shopingList[i])
                    }
                    if (this.currPageSelect == this.currPageAsLength) {
                        this.IsAll = true
                    } else {
                        this.IsAll = false
                    }
                }
            },
            // planList的勾选
            hadADByshop(data) {
                let shopAD = data
                if(this.activeRName === shopAD.city){
                    for(let key of this.planList){
                        if (key.mID === shopAD.mID) {
                            let crossIf = this.crossSchedules(shopAD.schedules)
                            if (crossIf) {
                                if (shopAD.A_B === 'A') {
                                    key.checkBox.A = true
                                    this.currPageSelect++
                                } else if (shopAD.A_B === 'B') {
                                    key.checkBox.B = true
                                    this.currPageSelect++
                                } else if (shopAD.A_B === 'ABC'){
                                    key.checkBox.ABC = true
                                    this.currPageSelect++
                                }
                                break
                            } else {
                                console.log('排期无交叉且不相等')
                            }
                        }
                    }
                }else{
                    console.log('不同城市')
                }
            },
            // 重置planList的勾选
            resetPlanList() {
                console.log('重置planList的勾选开始')
                for (let i = 0; i < this.planList.length; i++) {
                    if (this.planList[i].checkBox.A || this.planList[i].checkBox.B || this.planList[i].checkBox.ABC) {
                        // console.log('有勾选')
                        this.planList[i].checkBox.A = false
                        this.planList[i].checkBox.B = false
                        this.planList[i].checkBox.ABC = false
                        // this.$refs.multipleTable.toggleRowSelection(this.planList[i], false)
                    } else {
                        console.log('无勾选')
                    }
                }
                console.log('重置planList的勾选结束')
            },
            //点位有时间交叉
            crossSchedules(sche) {
                let scheArr = sche.split('-')
                if (this.dateInput[0] == scheArr[0] && this.dateInput[1] == scheArr[1]) {
                    return true
                } else if (this.dateInput[0] < scheArr[0] && this.dateInput[1] >= scheArr[0]) {
                    return true
                } else if (this.dateInput[0] > scheArr[0] && this.dateInput[0] < scheArr[1]) {
                    return true
                } else if (this.dateInput[1] > scheArr[0] && this.dateInput[1] < scheArr[1]) {
                    return true
                } else if (this.dateInput[0] <= scheArr[1] && this.dateInput[1] > scheArr[1]) {
                    return true
                } else {
                    return false
                }
            },
            //获取mouseEnter屏幕时的坐标像素
            mouseEnter(row, column, cell, event) {
                let e = event || window.event;
                this.shopXY.y = e.clientY
            },
            // 选中A、B面的时候
            changeA(row) {
                let check = row
                if (check.checkBox.A) {
                    this.shopShow_hide()      // 动画效果
                    this.AddShopingInfo(row, 'A') // 添加到购物车

                } else {                          // A、B都勾选的时候
                    this.IsAll = false
                    this.deleteShopRow(check, 'A')
                }
            },
            changeB(row) {
                let check = row
                if (check.checkBox.B === true) {
                    this.shopShow_hide()
                    this.AddShopingInfo(row, 'B') // 添加到购物车
                } else {
                    this.IsAll = false
                    this.deleteShopRow(check, 'B')
                }
            },
            // 道闸点位选择
            changeABC(row){
                if (row.checkBox.ABC === true){
                    let obj = this.setShopingTable(row,'ABC')
                    this.shopShow_hide()
                    this.shopingList.push(obj)
                    // this.IsAll = true
                }else{
                    this.IsAll = false
                    this.deleteShopRow(row, 'ABC')
                }
            },
            //行被点击 beOccupiedGetList
            rowClick(row, event, column){
                console.log('row',row,event,column)
                if(!this.isOccupied){
                    let star = timeFormat.toDate(row.lStar,'/')
                    let end = timeFormat.toDate(row.lEnd,'/')
                    let arr = []
                    arr.push({
                        beOccupieApName: row.apName,
                        schedules: star + '-' +end,
                        lState: row.lState,
                    })
                    this.beOccupiedAdsData = arr
                    this.beOccupiedDialogVisible = true
                }
            },
            // 当前行是否高亮
            tableRowClassName({row}) {
                if (row.lState !== undefined && row.lState.length > 0) {
                    return "warning-row";
                } else if (row.connData.connectResName !== '' || row.connData.commentWorkRes !=='' || row.connData.connectMedia !=='') {
                    return "warning-row-conncet";
                }else {
                    return "";
                }
            },
            // 打开购物车则计算连排门信息
            computeConnectAdData(){
                let date1=new Date();
                console.log('this.industryID',this.industryID)
                let shopData = this.shopingList
                let shopDataLength = shopData.length
                for (let i = 0; i < shopDataLength; i++) {
                    //连排门设置
                    if(i < shopDataLength - 1){
                        for (let j = i + 1; j < shopDataLength; j++) {
                            if (shopData[i].connID !== '' && shopData[i].mID !== shopData[j].mID && shopData[i].connID === shopData[j].connID) {
                                if (shopData[i].connData.connectResName === '') {
                                    shopData[i].connData.connectResName = shopData[i].resName
                                    shopData[i].connData.connectMedia = shopData[i].mediaName + '、' + shopData[j].mediaName
                                } else {
                                    if (!shopData[i].connData.connectMedia.includes(shopData[j].mediaName)) {
                                        shopData[i].connData.connectMedia += '、' + shopData[j].mediaName
                                    }
                                }
                                shopData[j].connData.connectResName = shopData[i].connData.connectResName
                                shopData[j].connData.connectMedia = shopData[i].connData.connectMedia
                            }
                        }
                    }
                    //同行业点位回避
                    if(shopData[i].industryInfos !== null && shopData[i].industryInfos.length > 0){
                        let commentWorkArr = shopData[i].industryInfos
                        for(let key of commentWorkArr){
                            if(this.industryID === key.piID){
                                console.log('1')
                                if(shopData[i].connData.commentWorkRes === ''){
                                    shopData[i].connData.commentWorkRes = key.piName
                                }else{
                                    if(!shopData[i].connData.commentWorkRes.includes(key.piName)){
                                        shopData[i].connData.commentWorkRes += '、' + key.piName
                                    }
                                }
                                if (shopData[i].mID == key.mID) {
                                    if (shopData[i].connData.commentworkMedia === '') {
                                        shopData[i].connData.commentworkMedia = key.piName
                                    } else {
                                        if (!shopData[i].connData.commentworkMedia.includes(key.piName)) {
                                            shopData[i].connData.commentworkMedia += '、' + key.piName
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                let date2 = new Date();
                let haomiao = date2.getTime() - date1.getTime();
                console.log('打开购物车则计算连排门信息',this.shopingList,haomiao/(1000*60))
            },
            // 重置购物车连排门信息
            resetConnectAdData(){
                for(let key of this.shopingList){
                    if(key.connData){
                        key.connData = { connectResName: '',connectMedia: '',commentWorkRes:'',commentworkMedia:'',}
                    }
                }
            },
            // 购物车行被点击
            shopRowClick(row, event, column){
                console.log('购物车行被点击row',row,column)
                if (row.lState !== undefined && row.lState.length > 0) {
                    let dataArr = row.lState
                    console.log('row.asID', row.asID)
                    let arr = []
                    for(let key of dataArr){
                        let star = timeFormat.toDate(key.lStar, '/')
                        let end = timeFormat.toDate(key.lEnd, '/')
                        arr.push({
                            beOccupieApName: key.apName,
                            schedules: star + '-' + end,
                            lState: key.lState,
                        })
                    }
                    this.beOccupiedAdsData = arr
                    console.log('this.beOccupiedAdsData', this.beOccupiedAdsData)
                    if (!this.shopDelRowClick) {
                        this.beOccupiedDialogVisible = true
                    } else {
                        this.shopDelRowClick = false
                    }
                }else if(row.connData.connectResName !== '' || row.connData.commentWorkRes !=='' || row.connData.connectMedia !==''){
                    this.ActiveConnectADList = row.connData
                    console.log('this.ActiveConnectADList',this.ActiveConnectADList)
                    this.connectAdDialogVisible = true
                }
            },
            // 下一步
            next(letter) {
                if (this.active === 0) {
                    this.submitForm('planForm')
                    this.shopingList = []
                    this.limitName = '全部'       // 初始化广告限制
                } else if (this.active === 1) {
                    if (this.shopingList.length !== 0) {
                        this.getFA_remark()         // 获取原投放城市详情的备注信息，再去this.creatTab()、 this.getShopingCityName() 、this.computeCityDiffAsIdNum() 、this.quotationFun()
                    } else {
                        sessFun.messageFun('warning','请选择点位')
                    }
                } else if (this.active === 2) {
                    // 防多次点击创建
                    if (!this.creating) {
                        this.creating = true
                        let timer = setTimeout(() => {
                            this.creating = false
                            this.isCityPrice = false
                            this.vaildCityQuotation()
                            if (!this.isCityPrice) {
                                if (letter === 'workInSync') {
                                    this.workInSync = true
                                }
                                this.ADloading = this.$loading({
                                    lock: true,
                                    text: '加急创建中...',
                                    spinner: 'el-icon-loading',
                                    background: 'rgba(0, 0, 0, 0.7)'
                                })
                                this.UpdateAdPlanFun() // 创建方案
                            } else {
                                sessFun.messageFun('warning', '单城市总价格大于系统支持的最大价格（2000万）')
                            }
                            clearTimeout(timer)
                        }, 500)
                    }
                }
                if (this.active > 3) {
                    this.active = 0;
                }
            },
            // 上一步
            prev() {
                if (this.active < 1) {
                    this.active = 0
                }else {
                    this.active--
                }
            },
            // 表单验证
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.active++;
                        this.mediaType = '广告门'
                        this.getAreaFun()
                        this.getAdList()    // 获取选点列表
                    } else {
                        return false;
                    }
                });
            },
            // 提交前校验单城市报价单价格是否大于2000w
            vaildCityQuotation(){
                for(let key of this.quotation){
                    for(let i in key.priceMsg){
                        // console.log('提交前校验单城市报价单价格是否大于2000w',key.priceMsg[i].total)
                        if(key.priceMsg[i].total > 20000000){
                            this.isCityPrice = true
                            break
                        }
                    }
                }
            },
            // 设置提交的详情数据
            setDetailData() {
                console.log('creatAdPlan', this.quotation)
                let cityDetailList = []
                for (let key of this.quotation) {
                    for (let i in key.priceMsg) {
                        let minTime = ''
                        let maxTime = ''
                        if (key.priceMsg[i].schedules && key.priceMsg[i].schedules.length > 0) {
                            // 排期整合，获取最小最大的日期
                            let timeList = key.priceMsg[i].schedules.join(',')
                            let schedulesArr = timeFormat.returnTimeArr(timeList,',','-')
                            minTime = schedulesArr[0]
                            maxTime = schedulesArr[schedulesArr.length - 1]
                        } else {
                            minTime = timeFormat.returnDayCount(1,'/')
                            maxTime = timeFormat.returnDayCount(14,'/')
                        }
                        if (this.apMinTime === '') {
                            this.apMinTime = minTime
                        } else {
                            if (this.apMinTime > minTime) {
                                this.apMinTime = minTime
                            }
                        }
                        let pdid = this.getpdidByCityAndMType(i,key.city,key.asrID)
                        console.log('pdid',pdid)
                        cityDetailList.push({
                            "pdID": pdid ? pdid : '',
                            "pdRemark": key.priceMsg[i].remark || '',
                            "rID": key.rid,
                            "city": key.city,
                            "asrID": key.asrID,
                            "pdDays":  key.priceMsg[i].tfl,
                            "pdFreeNum": key.priceMsg[i].GMDate,                                  // 赠送面*天
                            "pdStar": minTime,
                            "pdEnd": maxTime,
                            "pdAdFee": parseInt(key.priceMsg[i].advertyPrice * 100),              // 广告费用
                            "pdNum": key.priceMsg[i].ADNumber,                                    // 点位数
                            "pdAdMake": Number((key.priceMsg[i].makePrice * 100).toFixed(0)),     // 实计制作费用
                            "pdTotal": Number((key.priceMsg[i].cash * 100).toFixed(0)),
                            "pdSendFee": Number((key.priceMsg[i].zyzh * 100).toFixed(0)),
                            "pdOtherFee": Number((key.priceMsg[i].other * 100).toFixed(0)),
                            "pdType": i === 'adDoor' ? 0 : 1,
                            "abList": [],
                        })
                    }
                }
                // console.log('城市详情',cityDetailList)
                console.log('购物车数据',this.shopingList)
                // 点位与城市详情关联
                let pbSetTime = this.timestampToTime(Date.parse(new Date()))
                for (let key of this.shopingList) {
                    for (let detailKey of cityDetailList) {
                        if (key.city === detailKey.city && key.asrID == detailKey.asrID) {
                            let adsData = {
                                asID: key.asID,
                                pdID: detailKey.pdID,
                                pbStar: key.schedules.split('-')[0],
                                pbEnd: key.schedules.split('-')[1],
                                uID: this.sessionData.uID,
                                pbSetTime: pbSetTime,
                                resID: key.resID,
                                mapCenterName: key.mapCenter,
                            }
                            if (this.customPermission.pptPermission && this.customPermission.pptPermission.gzqylPermission == '1') {
                                adsData.recommendReason = key.recommendReason || '';  //  亲粤邻定制：推荐理由
                            }
                            if (key.mVehicle === '广告门' && detailKey.pdType === 0) {
                                detailKey.abList.push(adsData)
                                break
                            } else if (key.mVehicle === '道闸' && detailKey.pdType === 1) {
                                detailKey.abList.push(adsData)
                                break
                            }
                        }
                    }
                }
                console.log('城市详情cityDetailList',cityDetailList)
                return cityDetailList
            },
            // 编辑方案
            UpdateAdPlanFun(){
                let detail = this.setDetailData()
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apId: this.apid,
                    detail: JSON.stringify(detail),
                }
                console.log('params',params)
                api.postApi(this.apiVar.Advertisement + '/UpdateAdPlan', params).then(res => {
                    console.log('编辑方案', res)
                    this.ADloading.close()
                    if (res.data.SysCode === 200200) {
                        this.active = 3
                        if (this.workInSync) {
                            this.CreateShareADSFun()
                        }
                        if (this.apMinTime <= this.dateTime) {
                            sessFun.messageFun('warning', '该方案的投放期已经开始，建议立即发布该方案！')
                        } else {
                            sessFun.messageFun('success', '方案编辑成功')
                        }
                    } else {
                        sessFun.messageFun('warning', res.data.MSG || '方案异常')
                    }
                }).catch(err=>{
                    sessFun.messageFun('warning','接口异常')
                })
            },
            // 根据城市和公司id返回pdid
            getpdidByCityAndMType(mType, city, asrID) {
                console.log('this.pdidList', this.pdidList, mType, city, asrID)
                for (let key of this.pdidList) {
                    if (mType === 'adDoor' && key.pdType == 0 && key.city === city && asrID == key.asrID) {
                        return key.pdID
                    } else if (mType === 'roadGate' && key.pdType == 1 && key.city === city && asrID == key.asrID) {
                        return key.pdID
                    }
                }
                return false
            },
            // 生成协同链接
            CreateShareADSFun() {
                let urlPath = location.href
                console.log(urlPath)
                let aiInfo = {apname: this.planName, cname: this.cName, cband: this.cBand}
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apid: this.editApid,
                    aiinfo: JSON.stringify(aiInfo)
                }
                api.postApi(this.apiVar.Advertisement+'/CreateShareCode', params).then(res => {
                    console.log('生成协同选点aiCode', res)
                    this.shareADUrl = this.apiVar.qadnUrl + '/shareADList?apid=' + this.editApid + '&aicode=' + res.data.aiCode
                    this.active = 3
                })
            },
            // 继续创建
            continueCreate() {
                this.$router.push("./createPlanOld");
            },
            //复制协同选点的url
            copyUrl() {
                let Url = document.getElementById("shareUrl").innerText;
                console.log('url', Url)
                let oInput = document.createElement('input');
                oInput.value = Url;
                document.body.appendChild(oInput);
                oInput.select();                // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.style.display = 'none';
                sessFun.messageFun('success','复制成功')
            },
            // step3 获取方案的各投放城市的原备注信息
            getFA_remark() {
                let uid = this.sessionData.uID
                let params = {
                    uid: uid,
                    token: this.sessionData.token,
                    apid: this.editApid
                }
                console.log('用户uid', uid, ',方案id', this.editApid)
                api.getApi(this.apiVar.Advertisement + '/GetAPD', params).then(res => {
                    console.log('获取pdid', res)
                    this.active++
                    let APDData = res.data
                    this.pdidList = res.data
                    if (APDData.length !== 0) {
                        let arr = []
                        for (let i = 0; i < APDData.length; i++) {
                            if (APDData[i].pdRemark === undefined || APDData[i].pdRemark === null) {
                                APDData[i].pdRemark = ''
                            }
                            let obj = {rid: APDData[i].rID, remark: APDData[i].pdRemark}
                            arr.push(obj)
                        }
                        this.editApRemark = arr
                    } else {
                        console.log('获取的pdid为空')
                    }
                    this.getAsNameByShopingList()     // 统计购物车中存在了几个公司及城市
                    this.creatTab()                 // 报价单tab
                    this.getBand()                  // 获取公司品牌
                })
            },
            // step3
            getAsNameByShopingList(){
                console.log('this.shopingList',this.shopingList)
                let asrIDs = []
                let isHad = false
                for(let sKey of this.shopingList){
                    isHad = true
                    for (let aKey of asrIDs) {
                        if (aKey.asrID == sKey.asrID && aKey.city == sKey.city) {
                            isHad = false
                            break
                        } else {
                            isHad = true
                        }
                    }
                    if(isHad){
                        console.log('sKey',sKey)
                        asrIDs.push({
                            asrID: sKey.asrID,
                            asName: sKey.asName,
                            rid: sKey.rid,
                            city: sKey.city
                        })
                    }
                }
                console.log('统计购物车中存在了几个公司及城市asrIDs',asrIDs)
                this.asrIDList = asrIDs.concat()
            },
            // 创建报价单结构
            creatTab() {
                let quotationArr = []
                for (let key of this.asrIDList) {
                    let quotationObj = {
                        city: key.city,
                        rid: key.rid,
                        asrID: key.asrID,
                        asName: key.asName,
                        priceMsg:{
                            adDoor:{
                                schedules: [],                // 排期
                                GMDate: 0,                   // 赠送面.天
                                LevelGMDate: {A: 0, B: 0, C: 0},     // 赠送面.天
                                discount: '100',            // 广告费折扣
                                advertyPrice: 0,            // 广告费
                                ADNumber: 0,                // 广告画数量
                                makeDiscount: '100',        // 制作费折扣
                                MPrice: 100.00,             // 制作费单价
                                reaPrice: 0,                // 广告费每次修改前的价格
                                oldPrice: 0,                //  广告费初始价格
                                MReaPrice: 0,              // 制作费原价
                                makePrice: 0,           // 制作费
                                ADPrice: 0,             // 刊例价(面/周)
                                tfl: 0,                    //投放量
                                cash: 0,               // 现金结算
                                zyzh: 0,                   // 资源置换
                                other: 0,                  // 其他费用
                                total: 0,
                                remark: '',                 //备注信息
                            },
                            roadGate:{
                                schedules: [],                // 排期
                                GMDate: 0,                   // 赠送面.天
                                discount: '100',           // 广告费折扣
                                advertyPrice: 0,             // 广告费
                                ADNumber: 0,                 // 广告画数量
                                makeDiscount: '100',      // 制作费折扣
                                MPrice: 300.00,                // 制作费单价
                                reaPrice: 0,                // 广告费每次修改前的价格
                                oldPrice: 0,                 //  广告费初始价格
                                MReaPrice: 0,              // 制作费原价
                                makePrice: 0,              // 制作费
                                ADPrice: 0,                // 刊例价(面/周)
                                tfl: 0,                    //投放量
                                cash: 0,                   // 现金结算
                                zyzh: 0,                   // 资源置换
                                other: 0,                  // 其他费用
                                total: 0,
                            },
                        },
                    }
                    quotationArr.push(quotationObj)
                }
                this.quotation = quotationArr
                console.log('创建报价单', this.quotation)
                this.quotationObj = {quotation:this.quotation,isDetail:false}
            },
            //计算总价格
            computeTotal() {
                // console.log('计算总价格',this.quotation)
                this.totalPrice = 0
                this.cash = 0
                this.other = 0
                this.zyzh = 0
                for (let key of this.quotation) {
                    for (let i in key.priceMsg) {
                        this.totalPrice += key.priceMsg[i].total
                        this.cash = (Number(this.cash) + Number(key.priceMsg[i].cash))
                        this.other = (Number(this.other) + Number(key.priceMsg[i].other))
                        this.zyzh = (Number(this.zyzh) + Number(key.priceMsg[i].zyzh))
                    }
                }
                if (this.other == 0 && this.zyzh == 0) {
                    this.totalPrice = this.cash
                }
            },
            // dialog购物筐的显示全选中后添加都购物车
            dialogVisible() {
                this.computeConnectAdData()
                this.dialogTableVisible = true;
                this.eventType = "";
                this.typeShopList = this.getTypeList();
                this.handleClick();
            },
            // 组合typeShopList
            getTypeList(){
                console.log('--------', this.shopingList);
                let arr = [
                    {
                        type: 1,
                        mVehicle: "广告门",
                        asidList: [],
                    },
                    {
                        type: 2,
                        mVehicle: '道闸',
                        asidList: [],
                    }
                ];
                let type1 = [];
                let type2 = [];
                for(let data of this.shopingList){
                    if(data.mVehicle == '广告门'){
                        type1.push(data);
                    }else if(data.mVehicle == '道闸'){
                        type2.push(data);
                    }
                }
                arr[0].asidList = type1;
                arr[1].asidList = type2;
                return arr;
            },
            // 切换tab
            handleClick(){
                console.log('this.activeName----', this.activeName, this.typeShopList);
                this.eventType = '';
                this.getShowList();
                this.getEventList();
                this.computeMedia_AD();
            },
            // 设置购物车表格数据
            getShowList(){
                let currTab = this.activeName;
                let arr = this.typeShopList[currTab-1].asidList;
                this.shopShowList = arr;
            },
            // 获取事件
            getEventList(){
                let arr = [
                    {
                        label: '移除被占点位',
                        value: 1,
                    },
                    {
                        label: '移除非客户的选点',
                        value: 2,
                    },
                    {
                        label: '移除同行已选小区',
                        value: 3,
                    },
                    {
                        label: '同资源保留1个点位',
                        value: 5,
                    },
                    {
                        label: '同资源保留2个点位',
                        value: 6,
                    },
                ];
                let currTab = this.activeName;
                if(currTab == 1){
                    let temp = [
                        {
                            label: '移除同行已选点位',
                            value: 4,
                        },
                        {
                            label: '移除同媒体A面',
                            value: 7,
                        },
                        {
                            label: '移除同媒体B面',
                            value: 8,
                        },
                    ];
                    arr = arr.concat(temp);
                }else if(currTab == 2){
                    arr = arr;
                }
                arr.sort((a, b)=>{
                    return a.value - b.value;
                });
                this.eventList = arr;
            },
            // 事件选择
            changeEvent(val){
                console.log('val', val);
                if(this.shopShowList.length){
                    switch (val){
                        case 1:
                            this.clearADLock();
                            this.MtaStatFun('a004_b008_c001_d001_bt063_ck04','a004_b008_c001_d002_bt078_ck04');
                            break;
                        case 2:
                            this.removeNoShareAD();
                            this.MtaStatFun('a004_b008_c001_d001_bt064_ck04','a004_b008_c001_d002_bt079_ck04');
                            break;
                        case 3:
                            this.removeCommentIndustryAds('res');
                            this.MtaStatFun('a004_b008_c001_d001_bt065_ck04','a004_b008_c001_d002_bt080_ck04');
                            break;
                        case 4:
                            this.removeCommentIndustryAds('media');
                            this.MtaStatFun('a004_b008_c001_d001_bt066_ck04','a004_b008_c001_d002_bt081_ck04');
                            break;
                        case 5:
                            this.containNuminRes(1);
                            this.MtaStatFun('a004_b008_c001_d001_bt067_ck04','a004_b008_c001_d002_bt082_ck04');
                            break;
                        case 6:
                            this.containNuminRes(2);
                            this.MtaStatFun('a004_b008_c001_d001_bt068_ck04','a004_b008_c001_d002_bt083_ck04');
                            break;
                        case 7:
                            this.removeAllType('A');
                            this.MtaStatFun('a004_b008_c001_d001_bt069_ck04','a004_b008_c001_d002_bt084_ck04');
                            break;
                        case 8:
                            this.removeAllType('B');
                            this.MtaStatFun('a004_b008_c001_d001_bt070_ck04','a004_b008_c001_d002_bt085_ck04');
                            break;
                    }
                }else{
                    let active = this.activeName;
                    sessFun.messageFun('warning', `没有${active=='1'?'广告门':'道闸'}数据`);
                }
            },
            // 同资源保留个数
            containNuminRes(num){
                let resultArr = this.funToArr(this.shopShowList, 'resID');
                resultArr = this.resRandomNum(resultArr, num);
                let len = this.shopShowList.length;
                if(resultArr.length){
                    this.getResultData(resultArr);
                    if(len != resultArr.length){
                        sessFun.messageFun('success',`成功保留同资源${num}个点位！`);
                    }else{
                        sessFun.messageFun('warning', '暂无同资源可移除的点位！')
                    }
                    this.computeMedia_AD();
                    this.resetPlanList();
                    this.judgeByselect();
                }else{
                    sessFun.messageFun('warning', '暂无同资源可移除的点位！')
                }
            },
            // 随机保留num个数点位
            resRandomNum(arr, num){
                let result = [];
                for(let data of arr){
                    if(num > 1){
                        let randomArr = [];
                        let max = data.asidList.length;
                        if(num >= max){
                            result = result.concat(data.asidList);
                        }else{
                            randomArr = this.randomFun([], num, data.asidList.length);
                            for(let item of randomArr){
                                result.push(data.asidList[item]);
                            }
                        }
                    }else{
                        let randomNum = parseInt(Math.random()*(data.asidList.length), 10);
                        result.push(data.asidList[randomNum]);
                    }
                }
                return result;
            },
            // 递归获取不同的随机数
            randomFun(arr, num, max){
                if(arr.length < num){
                    let randomNum = parseInt(Math.random()*(max), 10);
                    if(!arr.includes(randomNum)){
                        arr.push(randomNum);
                    }
                    return this.randomFun(arr, num, max);
                }else{
                    return arr;
                }
            },
            // 分组数据
            funToArr(arr, condition){
                let resultArr= arr.reduce((groups, item)=>{
                    let groupFound= groups.find(arrItem => item[condition] === arrItem[condition]);
                    if(groupFound) {
                        if(!JSON.stringify(groupFound.asidList).includes(JSON.stringify(item))) {  //去重
                            groupFound.asidList.push(item);
                        }
                    } else {
                        //不要直接在原来的对象修改，新建对象
                        let newGroup = {
                            [condition]: item[condition],
                            asidList: [item]
                        }
                        groups.push(newGroup);
                    }
                    return groups;
                },[]);
                return resultArr;
            },
            // 移除A/B面
            removeAllType(type){
                let resultArr = this.funToArr(this.shopShowList, 'mID');
                console.log('resultArr------------das---', resultArr);
                let len = this.shopShowList.length;
                if (resultArr.length > 0) {
                    resultArr = this.isEnoughMedia(type, resultArr);
                    this.getResultData(resultArr);
                    if(len != resultArr.length){
                        sessFun.messageFun('success',`成功移除同门${type}面的点位！`)
                    }else{
                        sessFun.messageFun('warning', '暂无可移除点位')
                    }
                    this.computeMedia_AD();
                    this.resetPlanList();
                    this.judgeByselect();
                } else {
                    sessFun.messageFun('warning', '暂无可移除点位！')
                }
            },
            // 同一媒体是否有a/b面
            isEnoughMedia(type, arr){
                let resultArr = [];
                for(let data of arr){
                    let result = [];
                    if(data.asidList.length > 1){
                        result = data.asidList.filter((item)=>{
                            return (item.A_B != type);
                        });
                    }else{
                        result = data.asidList;
                    }
                    resultArr = resultArr.concat(result);
                }
                return resultArr;
            },
            getResultData(resultArr){
                let other = [];
                for(let data of this.typeShopList){
                    if(this.activeName != data.type){
                        other = other.concat(data.asidList);
                    }else{
                        data.asidList = resultArr;
                    }
                }
                this.shopingList = other.concat(resultArr);
                this.shopShowList = resultArr;
            },
            //设置报价单
            APQuotationArr(...data){
                console.log('回传报价单:',data);// data为包含传过来所有数据的数组，第一个元素是对象，第二个元素是字符串
                this.quotation = data[0]
                let isBool = true
                for(let key of this.quotation){
                    console.log(key.noBoolClassified)
                    if(key.noBoolClassified){
                        this.active--
                        isBool = false
                        break
                    }
                }
                if(isBool){
                    this.computeTotal()
                }
            },
            // 添加到购物车
            AddShopingInfo(info, letter) {
                console.log('选中的row信息', info)
                this.currPageSelect++
                let selectInfo = this.setShopingTable(info,letter)
                // console.log('selectInfo',selectInfo)
                let asLabsArr = selectInfo.asLabs.split(',')
                let asIDArr = selectInfo.asIDs.split(',')
                if (letter == 'B') {
                    //  alert('B')
                    for (let n = 0; n < asLabsArr.length; n++) {
                        if (asLabsArr[n] === 'B') {
                            console.log('B', asIDArr[n])
                            selectInfo.asID = asIDArr[n]
                            break
                        }
                    }
                    this.shopingList.push(selectInfo)
                } else if (letter == 'A') {
                    for (let n = 0; n < asLabsArr.length; n++) {
                        if (asLabsArr[n] === 'A') {
                            console.log('A', asIDArr[n])
                            selectInfo.asID = asIDArr[n]
                            break
                        }
                    }
                    this.shopingList.push(selectInfo)
                }
                if (this.currPageSelect == this.currPageAsLength) {
                    this.IsAll = true
                } else {
                    this.IsAll = false
                }
                // this.IsAll = true
                console.log('shopingList', this.shopingList,this.currPageSelect)
            },
            // 选点列表数据到购物车数据
            setShopingTable(info,letter){
                let selectInfo = {
                    rid: info.rid,
                    mID: info.mID,
                    mVehicle: info.mVehicle,
                    asID: info.asIDs,// info.asIDs.split(','),
                    asIDs: info.asIDs,
                    asLabs: info.asLabs,
                    resName: info.resName,
                    resID: info.resID,
                    city: info.city,
                    origin: info.origin,
                    buildType: info.buildType,
                    houseNum: info.houseNum,
                    buildPrice: info.buildPrice,
                    mediaName: info.mediaName,
                    buildNum: info.buildNum,
                    schedules: info.schedules,
                    tradingArea: info.tradingArea,
                    assetTag: info.assetTag,
                    liveYear: info.liveYear,
                    adLimit: info.adLimit,
                    mapCenter: info.reference ||'',      // 地图中心点名称
                    reference: info.reference ||'',
                    address: info.address || '',
                    dNum: info.dNum || '',              // 出入口数
                    A_B: letter,
                    checkBox: {A: info.checkBox.A, B: info.checkBox.B,ABC:  info.checkBox.ABC},
                    box: {A:info.box.A,B:info.box.B},
                    connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                    connID: info.connID,        // 连排门id
                    industryInfos: info.industryInfos,   // 同行业资源回避
                    adPrice: info.adPrice,               // 点位价格
                    mediaLevel: info.mediaLevel,        // 媒体等级
                    asrID: info.asrID,                // 所属公司id
                    asName: info.asName,                // 所属公司名称
                    asName: info.asName,
                    remark: info.remark,
                    trafficState: info.trafficState || '',
                    electrifyState: info.electrifyState || '',
                }
                return selectInfo
            },
            // 自定义购物车表头-清空
            renderHeader(h, {column}){
                // console.log('********h*******',h,column)
                return h('span', {
                        class: 'clearShopping',
                        on: {
                            click: (event)=>{
                                // console.log('**************123',event)
                                this.clearShop()
                                // （广告门，道闸）
                                this.MtaStatFun('a004_b008_c001_d001_bt059_ck04','a004_b008_c001_d002_bt074_ck04')
                            }
                        }
                    },[
                        h('span','清空')
                    ]
                )
            },
            // 购物车删除行
            deleteRow(rows) {
                console.log('购物车删除行', rows)
                console.log('删除行id', rows.mID)
                if (this.planList.length > 0 && rows.city === this.planList[0].city){
                    for (let i = 0; i < this.planList.length; i++) {
                        if (rows.mID === this.planList[i].mID) {
                            if (rows.A_B === 'A') {
                                this.planList[i].checkBox.A = false
                            } else if (rows.A_B === 'B') {
                                this.planList[i].checkBox.B = false
                            } else if (rows.A_B === 'ABC') {
                                this.planList[i].checkBox.ABC = false
                            }
                        }
                    }
                }
                // for (let j = 0,len=this.shopShowList.length; j < len;) {
                //     if (this.shopShowList[j].mID === rows.mID && this.shopShowList[j].A_B == rows.A_B && this.shopShowList[j].schedules === rows.schedules) {
                //         this.shopShowList.splice(j, 1);
                //         break
                //     } else {
                //         j++
                //     }
                // }
                for (let j = 0,len=this.shopingList.length; j < len;) {
                    if (this.shopingList[j].mID === rows.mID && this.shopingList[j].A_B == rows.A_B && this.shopingList[j].schedules === rows.schedules) {
                        this.shopingList.splice(j, 1)
                        break
                    } else {
                        j++
                    }
                }
                this.typeShopList = this.getTypeList();
                this.getShowList();
                this.computeMedia_AD()
                this.allCheckboxUpdata()
                event.stopPropagation()
            },
            // 取消勾时,删除购物车里对应的数据行
            deleteShopRow(row, letter) {
                this.currPageSelect--
                for (let j = 0; j < this.shopingList.length; j++) {
                    if (this.shopingList[j].mID === row.mID && this.shopingList[j].A_B === letter) {
                        let crossIf = this.crossSchedules(this.shopingList[j].schedules)
                        if (crossIf) {
                            this.shopingList.splice(j, 1)
                            break
                        } else {
                            console.log('购物车中不存在相同点位')
                        }
                    }
                }
                this.allCheckboxUpdata()
            },
            //修改动画效果及显示隐藏
            shopShow_hide(all) {
                let R = this.shopXY.x
                let T = this.shopXY.y
                let shopAnimate = document.getElementsByClassName('shopAnimate')[0]
                let animateAll = document.getElementsByClassName('shopAnimateAll')[0]

                shopAnimate.style.top = this.shopXY.y + 'px'
                shopAnimate.style.right = this.shopXY.x + 'px'

                animateAll.style.top = this.shopXY.y + 'px'
                animateAll.style.right = (this.shopXY.x - 140) + 'px'
                let that = this
                if (all === 'all') {
                    this.selectAll = true
                    $(".shopAnimateAll").animate({
                        right: '37px',
                        top: '77px',
                        width: '18px',
                        height: '18px'
                    }, 700, function () {
                        $(".shopAnimateAll").css({'top': T, 'right': R, width: '790px', height: '386px'})
                        that.selectAll = false
                    })
                } else {
                    this.shoppingShow = true
                    $(".shopAnimate").animate({
                        right: '37px',
                        top: '77px',
                        width: '18px',
                        height: '18px'
                    }, 700, function () {
                        $(".shopAnimate").css({'top': T, 'right': R, width: '650px', height: '49px'})
                        that.shoppingShow = false
                    })
                }
            },
            //计算天数差的函数，通用
            DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2002.12.18格式
                let aDate, oDate1, oDate2, iDays
                aDate = sDate1.split(".")
                oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])    //转换为12-18-2002格式
                aDate = sDate2.split(".")
                oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
                iDays = Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24
                return iDays
            },
            // 数组排序，城市rid从小到大排
            compareFun(obj1, obj2) {
                let val1 = obj1.rid;
                let val2 = obj2.rid;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            },
            // 数组排序，城市区域按rid从小到大排
            compareArea(obj1, obj2) {
                let val1 = obj1[0].rID;
                let val2 = obj2[0].rID;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            },
            // 购物车- 获取协同选点的数据
            getShareADList() {
                if (this.shareADSData.aiCode !== undefined && this.shareADSData.aiCode !== null) {
                    let time = timeFormat.toDateTime(this.shareADSData.aisTime, ".") || ''
                    sessFun.messageFun('warning','未更新选点，上次提交时间为' + time)
                } else {
                    let ShareLoading = this.$loading({
                        lock: true,
                        text: '数据获取中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        apid: this.apid
                    }
                    api.getApi(this.apiVar.Advertisement+'/GetaiCode', params).then(res => {
                        console.log('获取aicode', res)
                        if (res.data.SysCode == 300200) {
                            this.aiCode = res.data.aiCode
                            api.getApi(this.apiVar.Advertisement+'/GetShareADS', {aicode: this.aiCode}).then(res => {
                                console.log('getshareAds数据', res)
                                if (res.data !== '' &&  !res.data.SysCode && res.data.asIDList !== undefined && res.data.aiIP !== undefined) {
                                    this.shareADSData = res.data
                                    this.compareShopData_shareData()

                                    this.typeShopList = this.getTypeList();
                                    this.getShowList();
                                } else {
                                    // 未更新选点
                                    sessFun.messageFun('warning','暂无数据可获取')
                                }
                                ShareLoading.close()
                            })
                        } else {
                            ShareLoading.close()
                            sessFun.messageFun('warning','暂无数据可获取')
                        }
                    })
                }
            },
            // 判断购物车中哪些点位是协同选点的
            compareShopData_shareData() {
                let shopData = this.shopingList
                let shareData = JSON.parse(this.shareADSData.asIDList)
                console.log('shopData', shopData)
                console.log('协同选择的点位', shareData)
                let shareNum = 0
                for (let AsData of shareData) {
                    // shareNum += AsData.selectedNum
                    for (let SData of shopData) {
                        AsData.schedules  = AsData.schedules.replace(/\./g, '/')
                        if(AsData.mType === '道闸'){
                            if(AsData.mID == SData.mID && AsData.schedules === SData.schedules){
                                shareNum++
                                this.$set(SData, "share", true);
                                break
                            }
                        } else {
                            if (AsData.mID == SData.mID && AsData.schedules === SData.schedules) {
                                for (let akey of AsData.asID) {
                                    if (akey.asID == SData.asIDs) {
                                        shareNum++
                                        this.$set(SData, "share", true);
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
                let time = timeFormat.toDateTime(this.shareADSData.aisTime, "-") //this.shareADSData.aisTime
                sessFun.messageFun('success','更新选点共' + shareNum + '面(带小红点),上次提交时间:' + time)
            },
            // 购物车-获取地图选择的点位列表
            getMapADList() {
                console.log('触发获取地图选点信息click');
                if (this.ActiveMapType === 1) {
                    this.getMapLoading = this.$loading({
                        lock: true,
                        text: '数据获取中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    this.mapBtn = true;
                    api.getApi(this.apiVar.Map+'/SendMap', {uid: this.sessionData.uID,token: this.sessionData.token}).then(res => {
                        console.log('地图选点', res);
                        if(res.data.code == '500200'){
                            this.mapADList = res.data.data
                            if(this.mapADList.length > 0){
                                this.setShopDataByMapAD()
                            } else {
                                sessFun.messageFun('warning','数据为空');
                                this.getMapLoading.close()
                            }
                        } else {
                            this.getMapLoading.close();
                            sessFun.messageFun('warning','数据获取异常')
                        }
                    })
                } else if (this.ActiveMapType === 2) {
                    // 亲邻地图
                    this.getMapLoading = this.$loading({
                        lock: true,
                        text: '数据获取中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    api.getApi(this.apiVar.mapApi + '/adsListByUid', {asrIDs: this.BDData.asrIDs, suID: this.BDData.uid}).then(res=>{
                        console.log('res-----',res);
                        if(res.data.SysCode === 200200) {
                            this.mapAdsList = res.data.data;
                            this.setMapAdsListInShopCar();
                            localStorage.removeItem('qinlinMapCode')
                        } else {
                            this.getMapLoading.close();
                            sessFun.messageFun('warning',res.data.MSG || '数据获取异常')
                        }
                    }).catch(err =>{
                        this.getMapLoading.close();
                        sessFun.messageFun('warning', '数据接口异常')
                    })
                }
            },
            // 根据地图选点返回的数据，设置成购物车所需的数据格式 （无忧地图）
            setShopDataByMapAD() {
                console.log('执行了setShopDataByMapAD', this.mapADList)
                let mapADList_ = this.mapADList
                let tempArr = []
                for (let data of mapADList_) {
                    for (let i = 0; i < 2; i++) {
                        let ADInfo = {
                            resID: data.resID,
                            mID: data.mID,
                            resType: data.resType,
                            asID: '',
                            asIDs: data.asIDs,
                            asLabs: data.asLabs,
                            resName: data.resName,
                            city: this.mapParams.city,
                            rid: this.mapParams.rid,
                            origin: data.rName,
                            buildType: data.cType,
                            houseNum: data.hNum,
                            buildPrice: (data.hPrice / 100),
                            mediaName: data.mTitle || '',
                            mVehicle: data.mVehicle,
                            buildNum: data.fNum,
                            schedules: this.mapParams.ls + '-' + this.mapParams.le,
                            tradingArea: data.tradingArea,
                            assetTag: data.assetTag,
                            liveYear: data.chDay,
                            mapCenter: '',
                            // mapCenter: data.reference.name ? data.reference.name +'-'+  data.reference.address :'' ,      // 地图中心点名称
                            reference: data.reference ||'',
                            address: data.resAddress || '',
                            dNum: data.dNum || '',              // 出入口数
                            adLimit: data.notPush || '',
                            checkBox: {A: false, B: false},
                            connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                            connID: data.connID || '',        // 连排门id
                            industryInfos: data.industryInfos || [],   // 同行业资源回避
                            mediaLevel: data.grade || '',
                            adPrice: data.mVehicle === '道闸' ? data.asPrice / 100 || 0 : data.asPrice / 700 || 0,
                            asName: data.asName || '',         // 点位所属公司名称
                            asrID: data.asrID,                 // 所属公司id
                        }
                        if (data.reference !== '-' && data.reference !== '' && data.reference !== undefined && data.reference !== null) {
                            for (let key of data.reference) {
                                ADInfo.mapCenter += key.name + '-' + key.address + ','
                            }
                        } else {
                            ADInfo.mapCenter = ''
                        }
                        if(data.mVehicle === '广告门'){
                            let asLabsArr = ADInfo.asLabs.split(',')
                            let asIDArr = ADInfo.asIDs.split(',')
                            for (let n = 0; n < asLabsArr.length; n++) {
                                if (i === 0 && asLabsArr[n] === 'A') {
                                    ADInfo.checkBox.A = true
                                    ADInfo.A_B = 'A'
                                    ADInfo.asID = asIDArr[n]
                                    if (this.judgeHaveDiffAD(ADInfo,'mapAds')) {
                                        tempArr.push(ADInfo)
                                        break
                                    }
                                } else if (i === 1 && asLabsArr[n] === 'B') {
                                    ADInfo.checkBox.B = true
                                    ADInfo.A_B = 'B'
                                    ADInfo.asID = asIDArr[n]
                                    if (this.judgeHaveDiffAD(ADInfo,'mapAds')) {
                                        tempArr.push(ADInfo)
                                        break
                                    }
                                }
                            }
                        } else if(data.mVehicle === '道闸') {
                            ADInfo.checkBox.ABC = true
                            ADInfo.A_B = 'ABC'
                            ADInfo.asID = data.asIDs //data.asIDs.split(',')
                            if (this.judgeHaveDiffAD(ADInfo,'mapAds')) {
                                tempArr.push(ADInfo)
                                break
                            }
                        }
                    }
                }
                console.log('根据地图选点返回的数据，设置成购物车所需的数据格式', tempArr)
                if (this.shopingList.length !== 0) {
                    for (let key of tempArr) {
                        this.shopingList.push(key)
                    }
                } else {
                    this.shopingList = tempArr
                }
                this.getMapLoading.close()
                sessFun.messageFun('success','成功获取到' + tempArr.length + '条数据')

                this.typeShopList = this.getTypeList();
                this.getShowList();

                this.computeMedia_AD('mapAD')
                this.judgeByselect()
            },
            // 判断点位是否已存在购物车 （无忧地图）
            judgeHaveDiffAD(data,SourceType) {
                let ADData = data
                let shopArr = this.shopingList
                let ifBoolea = true
                // console.log('点位是否已存在购物车',ADData)
                if (shopArr.length !== 0) {
                    for (let i = 0; i < shopArr.length; i++) {
                        if (ADData.mID === shopArr[i].mID && ADData.A_B === shopArr[i].A_B) {
                            console.log('相同mid,相同面', ADData)
                            let ADScheArr = ADData.schedules.split('-')
                            let shopScheArr = shopArr[i].schedules.split('-')
                            // 全等
                            if (ADScheArr[0] == shopScheArr[0] && ADScheArr[1] == shopScheArr[1]) {
                                if(SourceType === 'mapAds'){
                                    let centerName = ''
                                    if (ADData.reference !== '-' && ADData.reference !== '' && ADData.reference !== undefined
                                        && ADData.reference !== null) {
                                        for (let key of ADData.reference) {
                                            let keyCenter = key.name + '-' + key.address
                                            if(!shopArr[i].mapCenter.includes(keyCenter)){
                                                centerName += keyCenter + ','
                                            }
                                        }
                                    }
                                    if (shopArr[i].mapCenter !== '') {
                                        shopArr[i].mapCenter = shopArr[i].mapCenter + centerName
                                    } else {
                                        console.log('mapCenter为空')
                                        shopArr[i].mapCenter = centerName
                                    }
                                }
                                ifBoolea = false
                                break
                                // 左相交
                            }else if(ADScheArr[0] < shopScheArr[0] && ADScheArr[1] >=  shopScheArr[0] && ADScheArr[1] <= shopScheArr[1]){
                                ifBoolea = false
                                break
                                // 被包含
                            }else if(ADScheArr[0] >= shopScheArr[0] && ADScheArr[1] <= shopScheArr[1]){
                                ifBoolea = false
                                break
                                // 右相交
                            }else if(ADScheArr[0] >= shopScheArr[0] && ADScheArr[0] <= shopScheArr[1] && ADScheArr[1] > shopScheArr[1]){
                                ifBoolea = false
                                break
                                // 包含
                            }else if(ADScheArr[0] < shopScheArr[0] && ADScheArr[1] > shopScheArr[1]){
                                ifBoolea = false
                                break
                            }else{
                                console.log('else')
                                ifBoolea = true
                            }
                        }
                    }
                } else {
                    return ifBoolea
                }
                return ifBoolea
            },
            // 根据地图选点返回的数据，设置成购物车所需的数据格式（亲邻地图）
            setMapAdsListInShopCar() {
                let tempArr = [];
                for(let key of this.mapAdsList) {
                    let adInfo = {
                        mID: key.mID,
                        resType: key.resType,
                        resID: key.resID,
                        asID: key.asID,
                        asIDs: key.asID,
                        asLabs: key.asLab,
                        A_B: key.asLab,
                        resName: key.resName,
                        city:  this.activeCityData.rName,
                        rid:  this.activeCityData.rid,
                        origin: key.rName,
                        buildType: key.cType,
                        houseNum: key.hNum,
                        buildPrice: (key.hPrice / 100),
                        mediaName: key.mTitle || '',
                        mVehicle: key.mVehicle,
                        buildNum: key.fNum,
                        // schedules: this.dateInput[0] + '-' + this.dateInput[1],
                        schedules: key.startDate + '-' + key.endDate,
                        remark: key.remark || "",
                        trafficState: key.trafficState || "",
                        electrifyState: key.electrifyState || "",
                        tradingArea: key.tradingArea,
                        assetTag: key.assetTag,
                        liveYear: key.chDay,
                        mapCenter: '',  // 地图中心点名称
                        reference: key.centerInfos,
                        address: key.resAddress || '',
                        dNum: key.dNum || '',              // 出入口数
                        adLimit: key.notPush || '',
                        checkBox: {A: false, B: false,ABC: false},
                        connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                        connID: key.connID || '',        // 连排门id
                        industryInfos: key.industryInfos || [],   // 同行业资源回避
                        mediaLevel: key.grade || '',
                        adPrice: key.mVehicle === '道闸' ? key.asPrice / 100 || 0 : key.asPrice / 700 || 0,
                        asName: key.asName || '',         // 点位所属公司名称
                        asrID: key.asrID,                 // 所属公司id
                    };
                    if(key.centerInfos && key.centerInfos.length) {
                        for(let item of key.centerInfos) {
                            adInfo.mapCenter += item.centerName + '-' + item.centerAddress + '-' + item.distance + '米,'
                        }
                    }
                    if(this.qinLinJudgeHaveDiffAD(adInfo,'mapAds')) {
                        tempArr.push(adInfo)
                    }
                }
                console.log('根据地图选点返回的数据，设置成购物车所需的数据格式', tempArr);
                if (this.shopingList.length !== 0) {
                    for (let key of tempArr) {
                        this.shopingList.push(key)
                    }
                } else {
                    this.shopingList = JSON.parse(JSON.stringify(tempArr))
                }
                this.getMapLoading.close()
                sessFun.messageFun('success','成功获取到' + tempArr.length + '条数据');
                this.mapBtn = true;
                this.typeShopList = this.getTypeList();
                this.getShowList();
                this.computeMedia_AD('mapAD');
                this.judgeByselect()
            },
            // 判断点位是否已存在购物车（亲邻地图）
            qinLinJudgeHaveDiffAD(data,SourceType) {
                let ADData = data;
                let shopArr = this.shopingList;
                let ifBoolea = true;
                if (shopArr.length !== 0) {
                    for (let i = 0; i < shopArr.length; i++) {
                        if (ADData.mID === shopArr[i].mID && ADData.A_B === shopArr[i].A_B) {
                            console.log('相同mid,相同面', ADData);
                            let ADScheArr = ADData.schedules.split('-');
                            let shopScheArr = shopArr[i].schedules.split('-');
                            // 全等
                            if (ADScheArr[0] == shopScheArr[0] && ADScheArr[1] == shopScheArr[1]) {
                                if(SourceType === 'mapAds'){
                                    let centerName = '';
                                    if(ADData.reference && ADData.reference.length) {
                                        for (let key of ADData.reference) {
                                            let keyCenter = key.centerName + '-' + key.centerAddress + '-' + key.distance + '米';
                                            if(!shopArr[i].mapCenter.includes(keyCenter)){
                                                centerName += keyCenter + ','
                                            }
                                        }
                                    }
                                    if (shopArr[i].mapCenter !== '') {
                                        shopArr[i].mapCenter = shopArr[i].mapCenter + centerName
                                    } else {
                                        shopArr[i].mapCenter = centerName
                                    }
                                }
                                ifBoolea = false;
                                break
                                // 左相交
                            }else if(ADScheArr[0] < shopScheArr[0] && ADScheArr[1] >=  shopScheArr[0] && ADScheArr[1] <= shopScheArr[1]){
                                ifBoolea = false;
                                break
                                // 被包含
                            }else if(ADScheArr[0] >= shopScheArr[0] && ADScheArr[1] <= shopScheArr[1]){
                                ifBoolea = false;
                                break
                                // 右相交
                            }else if(ADScheArr[0] >= shopScheArr[0] && ADScheArr[0] <= shopScheArr[1] && ADScheArr[1] > shopScheArr[1]){
                                ifBoolea = false;
                                break
                                // 包含
                            }else if(ADScheArr[0] < shopScheArr[0] && ADScheArr[1] > shopScheArr[1]){
                                ifBoolea = false;
                                break
                            }else{
                                console.log('else');
                                ifBoolea = true
                            }
                        }
                    }
                } else {
                    return ifBoolea
                }
                return ifBoolea
            },
            // 移除同行资源点位
            removeCommentIndustryAds(letter){
                let shopingData = this.shopShowList
                let arr = []
                let num = 0     // 记录移除个数
                for (let i = 0; i < shopingData.length; i++) {
                    if (shopingData[i].connData.commentWorkRes !== '' || shopingData[i].connData.commentworkMedia !== '') {
                        if (letter === 'media') { // 移除同行媒体点位
                            if (shopingData[i].connData.commentworkMedia !== '') {
                                console.log(i,'移除同行媒体点位',shopingData[i])
                                num++
                            } else {
                                arr.push(shopingData[i])
                            }
                        } else {
                            num++
                        }
                    } else {
                        arr.push(shopingData[i])
                    }
                }
                if (num > 0) {
                    sessFun.messageFun('success','成功移除' + num + '条数据')

                    this.getResultData(arr);

                    this.computeMedia_AD()
                    this.resetPlanList()
                    this.judgeByselect()
                } else {
                    sessFun.messageFun('warning','暂无同行回避点位!')
                }
            },
            // 更换排期
            changeAdsSchedule(){
                console.log('更换排期')
                this.isChangedScheduled = !this.isChangedScheduled
                let arr = []
                let isHad = true
                // 统计购物车数据点位排期，按城市及排期分开
                // for(let key of this.shopingList){
                for(let key of this.shopShowList){
                    isHad = false
                    for(let aKey of arr){
                        if(aKey.city === key.city && aKey.oldTime === key.schedules){
                            isHad = true
                            aKey.adsNum++
                            aKey.adsArr.push({
                                asID: key.asID,
                                mVehicle: key.mVehicle,
                                schedules: key.schedules
                            })
                            break
                        }
                    }
                    if(!isHad){
                        arr.push({
                            city: key.city,
                            adsNum: 1,
                            oldTime: key.schedules,
                            newTime: '',
                            adsArr: [{
                                asID: key.asID,
                                mVehicle: key.mVehicle,
                                schedules: key.schedules
                            }],
                        })
                    }
                }
                console.log('更换排期列表arr',arr)
                this.cityAdsScheduled = arr
            },
            // 触发时间选择控件
            selectScheduled(index){
                console.log('触发时间下标index',index,this.changeDateTemp)
                this.cityAdsScheduled[index].newTime = this.changeDateTemp[0] + '-' + this.changeDateTemp[1]
                this.changeDateTemp = ''
            },
            // 删除当前选择的排期
            deleteScheduled(index){
                console.log('删除排期下标',index)
                this.cityAdsScheduled[index].newTime = ''
            },
            // 提交后台判断新排期是否被占
            postAdsScheduled(){
                console.log('提交后台判断新排期是否被占',this.cityAdsScheduled)
                let arr = []
                for (let key of this.cityAdsScheduled) {
                    for (let aKey of key.adsArr) {
                        arr.push({
                            asID: aKey.asID,
                            st: key.newTime.split('-')[0],
                            et: key.newTime.split('-')[1],
                            schedules: key.oldTime                  // 原排期
                        })
                    }
                }
                console.log('arr',arr)
                for (let i = 0; i < arr.length;) {
                    if (arr[i].st && arr[i].et) {
                        i++
                    } else {
                        arr.splice(i, 1)
                    }
                }
                if(arr.length <= 0){
                    sessFun.messageFun('warning','请选择新的排期!')
                    return
                }
                let params = {
                    asList: arr
                }
                api.postApi_json(this.apiVar.Advertisement + '/ChangeAdPlanSchedule?uid=' +
                    this.sessionData.uID + '&token=' + this.sessionData.token, params).then(res => {
                    console.log('提交点位新排期', res)
                    if (res.data === '' || res.data === null) {
                        sessFun.messageFun('warning', '更换排期失败')
                    } else {
                        let adsData = res.data
                        if (adsData.errorList.length <= 0 && adsData.successList.length > 0) {
                            sessFun.messageFun('success', '更换排期成功')
                            this.setSuccessScheduled(adsData.successList)
                        } else {
                            if (adsData.successList.length > 0) {
                                this.showErrorData.success = adsData.successList.length
                                this.showErrorData.error = adsData.errorList.length
                                this.setSuccessScheduled(adsData.successList)
                                this.setErrorScheduled(adsData.errorList)
                            } else {
                                this.showErrorData.error = adsData.errorList.length
                                this.setErrorScheduled(adsData.errorList)
                            }
                        }
                    }
                    this.isChangedScheduled = false
                })
            },
            // 更换成功的点位 ADLockNum
            setSuccessScheduled(adsList){
                for(let aKey of adsList){
                    for(let sKey of this.shopingList){
                        if (aKey.mVehicle === '道闸') {
                            if(aKey.mID == sKey.mID  && aKey.schedules === sKey.schedules){
                                sKey.schedules = aKey.st + '-' + aKey.et
                                // 异常之前一键更换排期失败的标示
                                if(sKey.changeError){
                                    delete sKey.changeError
                                }
                                // 若更换排期的点位排期是被占的则异常被占标示
                                if(sKey.lState !== undefined && sKey.lState.length > 0){
                                    // this.ADLockNum--
                                    delete sKey.lState
                                }
                                break
                            }
                        } else {
                            if (aKey.asID == sKey.asID && aKey.schedules === sKey.schedules) {
                                sKey.schedules = aKey.st + '-' + aKey.et
                                if(sKey.changeError){
                                    delete sKey.changeError
                                }
                                // 若更换排期的点位排期是被占的则异常被占标示
                                if(sKey.lState !== undefined && sKey.lState.length > 0){
                                    // this.ADLockNum--
                                    delete sKey.lState
                                }
                                break
                            }
                        }
                    }
                }
                this.mergeSchedules(this.shopingList)
            },
            // 更换失败的点位
            setErrorScheduled(adsList){
                let date1=new Date();
                let errorArr = []
                let successArr = []
                let isError = false
                for (let sKey of this.shopingList) {
                    isError = false
                    for (let aKey of adsList) {
                        if (aKey.mVehicle === '道闸' && aKey.schedules == sKey.schedules) {
                            if(sKey.mID === aKey.mID){
                                isError = true
                                sKey.changeError = true
                                errorArr.push(sKey)
                                break
                            }
                        } else {    // 广告门
                            if (aKey.asID == sKey.asID && aKey.schedules == sKey.schedules) {
                                isError = true
                                sKey.changeError = true
                                errorArr.push(sKey)
                                break
                            }
                        }
                    }
                    if(!isError){
                        successArr.push(sKey)
                    }
                }
                console.log('不成功的点位errorArr', errorArr, 'successArr', successArr)
                // errorArr分城市排期面数
                let errorLi = []
                let isHad = false
                for(let eKey of errorArr){
                    isHad = false
                    for(let lKey of errorLi){
                        if(eKey.city === lKey.city && eKey.schedules === lKey.schedules){
                            isHad = true
                            lKey.adsNum++
                            lKey.otherArr.push({
                                resName: eKey.resName,
                                mediaName: eKey.mediaName,
                                asLab: eKey.asLabs
                            })
                        }
                    }
                    if(!isHad){
                        errorLi.push({
                            city: eKey.city,
                            schedules: eKey.schedules,
                            adsNum: 1,
                            otherArr: [{
                                resName: eKey.resName,
                                mediaName: eKey.mediaName,
                                asLab: eKey.asLabs
                            }]
                        })
                    }
                }
                console.log('errorLi',errorLi)
                // 更换不成功的排期在前，成功的放后面
                for (let key of successArr) {
                    errorArr.push(key)
                }
                let date2 = new Date()
                let haomiao = date2.getTime() - date1.getTime()
                console.log('errorArr',errorArr,haomiao/(1000*60))
                this.showErrorData.errorList = errorLi
                this.mergeSchedules(errorArr)
                this.showdefead = true
            },
            // 一键更换排期-同一点位排期相交则合并
            mergeSchedules(dataArr){
                console.log('mergeSchedules开始')
                let newArr = []
                let ishad = false
                for (let sKey of dataArr) {
                    ishad = false
                    if (sKey.changeError) {
                        ishad = false
                    } else {
                        for (let nKey of newArr) {
                            if (!sKey.changeError && nKey.asID == sKey.asID) {
                                ishad = true
                                console.log('1','sKey',sKey,'nKey',nKey)
                                let newArrSchedules = nKey.schedules.split('-')
                                let listSchedules = sKey.schedules.split('-')
                                if (newArrSchedules[0] < listSchedules[0] && listSchedules[0] <= newArrSchedules[1] && newArrSchedules[1] < listSchedules[1]) {
                                    // 左相交(购物车相交选点)
                                    nKey.schedules = newArrSchedules[0] + '-' + listSchedules[1];
                                    break
                                } else if (listSchedules[0] <= newArrSchedules[0] && newArrSchedules[1] <= listSchedules[1]) {
                                    nKey.schedules = listSchedules[0] + '-' + listSchedules[1];
                                    break
                                    // 购物车包含选点
                                }else if (listSchedules[0] < newArrSchedules[0] && newArrSchedules[0] <= listSchedules[1] && listSchedules[1] < newArrSchedules[1]) {
                                    // 右相交(购物车相交选点)
                                    nKey.schedules = listSchedules[0] + '-' + newArrSchedules[1];
                                    break
                                } else if (newArrSchedules[0] <= listSchedules[0] && listSchedules[1] <= newArrSchedules[1]) {
                                    // 购物车被选点包含
                                    nKey.schedules = newArrSchedules[0] + '-' + newArrSchedules[1];
                                    break
                                } else {
                                    let timeArr = [newArrSchedules[0], newArrSchedules[1], listSchedules[0], listSchedules[1]];
                                    timeArr.sort((a, b)=>{
                                        return Date.parse(a) - Date.parse(b);
                                    });
                                    if(Date.parse(timeArr[2]) - Date.parse(timeArr[1]) == 86400000){
                                        // ishad = true
                                        nKey.schedules = timeArr[0] + '-' + timeArr[3]
                                        break
                                    }else{
                                        console.log('3')
                                        ishad = false
                                    }
                                }
                            }
                        }
                    }
                    if(!ishad){
                        newArr.push(sKey)
                    }
                }
                console.log('newArr',newArr)
                this.shopingList = newArr.concat()
                this.typeShopList = this.getTypeList();
                this.getShowList();
            },
            // 清空购物车
            clearShop() {
                if(this.shopingList.length > 0){
                    this.$confirm('此操作将删除已选的所有数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let arr = [];
                        this.getResultData(arr);
                        this.allCheckboxUpdata()
                        this.computeMedia_AD()
                        sessFun.messageFun('success','删除成功')
                        // this.ADLockNum = 0
                        this.resetPlanList()      // 重置planList的勾选
                    }).catch(() => {
                        sessFun.messageFun('info','已取消删除')
                    });
                }else{
                    sessFun.messageFun('warning','无数据可删除')
                }

            },
            // 清空被占的点位
            clearADLock() {
                //this.shopingList
                this.$confirm('移除所有被占点位!', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    showClose: false,
                    type: 'warning '
                }).then(() => {
                    let list = this.shopingList
                    let haveADLock = false
                    for (let i = 0; i < list.length;) {
                        if (list[i].lState !== undefined && list[i].lState.length > 0) {
                            list.splice(i, 1)
                            haveADLock = true
                        } else {
                            i++
                        }
                    }
                    this.typeShopList = this.getTypeList();
                    this.getShowList();

                    if (haveADLock) {
                        sessFun.messageFun('success','移除成功')
                        this.computeMedia_AD()
                    } else {
                        sessFun.messageFun('warning','暂无被占点位')
                    }
                }).catch(() => {
                    this.eventType = '';
                    sessFun.messageFun('info','取消成功')
                })
                // this.ADLockNum = 0
                this.resetPlanList()
            },
            // 删除非客户选点
            removeNoShareAD() {
                if(this.shareADSData.asIDList !== undefined){
                    let shareData = JSON.parse(this.shareADSData.asIDList)
                    if(shareData.length > 0){
                        this.$confirm('确认移除非客户选点？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            showClose: false,
                            type: 'warning '
                        }).then(() => {
                            let shopData = this.shopingList
                            console.log('shopData',this.shopingList)
                            for (let j = 0; j < shopData.length;) {
                                if(shopData[j].share === true){
                                    j++
                                }else{
                                    this.shopingList.splice(j, 1)
                                }
                            }
                            this.typeShopList = this.getTypeList();
                            this.getShowList();
                            this.computeMedia_AD()
                            sessFun.messageFun('success','删除成功')
                        }).catch(() => {
                            this.eventType = '';
                            sessFun.messageFun('info','已取消删除')
                        });
                        this.resetPlanList()
                    }else{
                        sessFun.messageFun('warning','没有客户选点信息')
                    }
                }else{
                    sessFun.messageFun('warning','请先获取客户选择的点位，再移除非客户选择的点位')
                }

            },
            // 统计购物车媒体数、面数
            computeMedia_AD(letter) {
                // let shopList = this.shopingList
                let shopList = [];
                let currTab = this.activeName;
                shopList = this.typeShopList[currTab-1].asidList;
                console.log('购物车统计面数媒体数shopList', shopList)
                let mediaArr = []
                let mediaAD = []
                let resArr = []
                let resAsidArr = [];
                // ANum：A面数量  BNum：B面数量
                let mediaLevelNum = {ALevel: 0, BLevel: 0, CLevel: 0,ANum:0,BNum:0}
                for (let key of shopList) {
                    if(key.mVehicle === '广告门'){
                        // 等级ABC
                        if(key.mediaLevel === 'A'){
                            mediaLevelNum.ALevel++
                        }else if(key.mediaLevel === 'B'){
                            mediaLevelNum.BLevel++
                        }else if(key.mediaLevel === 'C'){
                            mediaLevelNum.CLevel++
                        }
                        // A\B面
                        if(key.A_B === 'A'){
                            mediaLevelNum.ANum++
                        }else if(key.A_B === 'B'){
                            mediaLevelNum.BNum++
                        }
                    }
                    if (!mediaArr.includes(key.mID)) {
                        mediaArr.push(key.mID)
                    } else {
                        // console.log('重复媒体',key.mID)
                    }
                    if (!mediaAD.includes(key.asID)) {
                        mediaAD.push(key.asID)
                    } else {
                        // console.log('重复的点位',key.asID)
                    }
                    if (!resArr.includes(key.resID)) {
                        resArr.push(key.resID)
                    }
                    // 计算各个社区面数
                    let isHad = false;
                    for(let data of resAsidArr){
                        if(data.resID == key.resID){
                            isHad = true;
                            if(!data.asidList.includes(key.asID)){
                                data.asidList.push(key.asID);
                            }
                        }
                    }
                    if(!isHad){
                        let obj = {
                            resID: key.resID,
                            asidList: [key.asID],
                        };
                        resAsidArr.push(obj);
                    }
                }
                console.log('resAsidArr------', resAsidArr);
                this.shopMedia_ADNum.oneNum = this.getResAsidNum(1, resAsidArr);
                this.shopMedia_ADNum.twoNum = this.getResAsidNum(2, resAsidArr);
                this.shopMedia_ADNum.threeNum = this.getResAsidNum(3, resAsidArr);
                this.shopMedia_ADNum.moreNum = resAsidArr.length - this.shopMedia_ADNum.oneNum - this.shopMedia_ADNum.twoNum - this.shopMedia_ADNum.threeNum;
                if (letter === 'mapAD') {
                    let stepMNum = 1
                    let stepADNum = 2
                    if (mediaArr.length - this.shopMedia_ADNum.mediaNum > 500) {
                        stepMNum = Math.round((mediaArr.length - this.shopMedia_ADNum.mediaNum) / 50)
                        stepADNum = Math.round((mediaAD.length - this.shopMedia_ADNum.ADNum) / 100)
                    }
                    let that = this
                    let timer = setInterval(function () {
                        if (that.shopMedia_ADNum.mediaNum < mediaArr.length) {
                            that.shopMedia_ADNum.mediaNum += stepMNum
                        }
                        if (that.shopMedia_ADNum.ADNum < mediaAD.length) {
                            that.shopMedia_ADNum.ADNum += stepADNum
                        }
                        if (that.shopMedia_ADNum.mediaNum >= mediaArr.length - 1 && that.shopMedia_ADNum.ADNum >= mediaAD.length - 1) {
                            that.shopMedia_ADNum.mediaNum = mediaArr.length
                            that.shopMedia_ADNum.ADNum = mediaAD.length
                            that.shopMedia_ADNum.resNum = resArr.length
                            clearInterval(timer)
                        }
                    }, 1)
                } else {
                    this.shopMedia_ADNum.mediaNum = mediaArr.length
                    this.shopMedia_ADNum.ADNum = mediaAD.length
                    this.shopMedia_ADNum.resNum = resArr.length
                }
                this.mediaLevelNum = mediaLevelNum
                console.log('mediaLevelNum-----', this.mediaLevelNum);
            },
            // 获取社区选一面两面三名的数据
            getResAsidNum(num, arr){
                let result = arr.filter((item)=>{
                    return item.asidList.length == num;
                });
                return result.length;
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
            // 获取品牌
            getBand() {
                for (let n = 0; n < this.companyBrand.length; n++) {
                    if (this.companyBrand[n].value === this.planForm.companyBrand) {
                        this.cBand = this.companyBrand[n].label
                    }
                }
            },
            // 时间格式规范
            formatTime(val) {
                return timeFormat.toDate(val, "/");
            },
            //取消编辑返回列表
            goBack() {
                this.$router.go(-1)
            },
            //根据编辑方案的apid获取选点排期
            getSetPoint() {
                // 真实数据
                let uid = this.sessionData.uID
                this.apid = sessionStorage.getItem("plan_apid")
                let params = {
                    uid : uid,
                    token: this.sessionData.token,
                    apid: this.apid
                }
                api.getApi(this.apiVar.Advertisement + "/GetADB", params).then(res => {
                    console.log('选点排期数据', res.data);
                    if (!res.data.SysCode) {
                        let resultArr = res.data.adSpaceInfo
                        let shopList = []
                        if (resultArr.length !== 0) {
                            let LockNum = 0
                            for (let data of resultArr) {
                                let time = this.formatTime(data.pbStar) + "-" + this.formatTime(data.pbEnd);
                                this.$set(data, "schedules", time);
                                let checkBox = {A: false, B: false,ABC:false}
                                if (data.asLab === 'A') {
                                    checkBox.A = true
                                } else if (data.asLab === 'B') {
                                    checkBox.B = true
                                } else if (data.asLab === 'ABC') {
                                    checkBox.ABC = true
                                }
                                if(data.IsLock.length > 0){
                                    LockNum += 1
                                }
                                let selectInfo = {
                                    // asID: '',
                                    pbStar: data.pbStar,
                                    pbEnd: data.pbEnd,
                                    // rid: data.rID.toString().substring(0, 4) + '00', //
                                    rid: data.cityId ? data.cityId : (data.rID.toString().substring(0, 4) + '00') ,
                                    resID: data.resID,
                                    mID: data.mID,
                                    asIDs: data.asID,
                                    asID: data.asID,
                                    asLabs: data.asLab,
                                    lState: data.IsLock ? data.IsLock : '',   // 是否被占
                                    resName: data.resName,
                                    city: data.city,
                                    origin: data.rName,
                                    buildType: data.cType || '--',
                                    houseNum: data.hNum,
                                    buildPrice: data.hPrice / 100,
                                    mediaName: data.mTitle || '',
                                    remark: data.remark || '',
                                    trafficState: data.trafficState || '',
                                    electrifyState: data.electrifyState || '',
                                    mVehicle: data.mVehicle,
                                    buildNum: data.fNum,
                                    schedules: data.schedules,
                                    tradingArea: data.tradingArea || '',
                                    assetTag: data.assetTag || '',
                                    liveYear: data.chDay,
                                    adLimit: data.adLimit || '',
                                    mapCenter: data.mapCenterName || '',     // 地图中心点名称
                                    reference: data.reference || '',         // 地图中心点data
                                    address: data.resAddress || '',
                                    dNum: data.dNum || '',       // 出入口数
                                    A_B: data.asLab,//data.A_B,
                                    checkBox: {A:checkBox.A, B:checkBox.B, ABC:checkBox.ABC},
                                    connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                                    connID: data.connID || '',        // 连排门id
                                    industryInfos: data.industryInfos || [],
                                    mediaLevel: data.grade || '',
                                    asName: data.asName || '',        // 点位所属公司名称
                                    asrID: data.asrID,                // 所属公司id
                                }
                                if (data.mVehicle === '道闸') {
                                    selectInfo.adPrice = data.asPrice / 100
                                } else {
                                    if (data.asPrice) {
                                        selectInfo.adPrice = data.asPrice / 700
                                    } else {
                                        if (data.grade === 'A') {
                                            selectInfo.adPrice = 3080 / 7
                                        } else if (data.grade === 'B') {
                                            selectInfo.adPrice = 2380 / 7
                                        } else if (data.grade === 'C') {
                                            selectInfo.adPrice = 1800 / 7
                                        } else {
                                            selectInfo.adPrice = 1900 / 7
                                        }
                                    }
                                }
                                if(selectInfo.mediaName === ''){
                                    console.log('+++++++++++',selectInfo.resName)
                                }
                                shopList.push(selectInfo)
                            }
                            console.log('shoplist---------',shopList);
                            // this.ADLockNum = LockNum        // 被占点位的个数
                            this.shopingList = shopList;
                            // console.log('购物车列表数据', this.shopingList)
                        } else {
                            this.shopingList = []
                        }
                        this.shopLoading = false
                        // this.computeMedia_AD()            // 统计购物车媒体数和面数
                        this.FanganInfoByApid()           //获取方案详情
                        this.dialogVisible();
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                    }
                }).catch(res => {
                    console.log(res);
                })
            },
            // 根据编辑方案的apid获取该方案的详情
            FanganInfoByApid() {
                let uid = this.sessionData.uID
                this.editApid = sessionStorage.getItem("plan_apid");
                let params = {
                    uid: uid,
                    token: this.sessionData.token,
                    apid: this.editApid,
                }
                api.getApi(this.apiVar.Advertisement + "/GetFanganInfo", params).then(res => {
                    console.log('方案详情', res.data);
                    if (res.data.SysCode == 200200) {
                        this.FAInfo = res.data.data
                        this.planName = this.FAInfo.apName
                        this.cName = this.FAInfo.cName
                        this.cBand = this.FAInfo.bTitle
                        this.industryID = this.FAInfo.piID
                        this.BDData.uid = this.FAInfo.suID || ''
                        this.BDData.asrIDs = this.FAInfo.asrIDs || ''
                        this.FAInfo.cityList = this.delCommentCity(this.FAInfo.rIDs.split(','))
                        if ((this.sessionData.uType === 'BD' && (this.sessionData.saleManageLevel == '1' || this.sessionData.saleManageLevel == '2'))
                            ||(this.sessionData.uType === 'MD' && this.sessionData.mediaManageLevel == '1')) {
                            this.setAllCityAndArea(this.FAInfo.cityList)
                        } else {
                            // this.setCityAndArea(this.FAInfo.cityList)
                            this.getCityList()
                        }
                        this.computeConnectAdData()
                        this.getAdsParamsData = {
                            prID: this.city[0].rid,
                            rid: '440100',
                            act: 1,
                            dateTimeBegin: this.dateInput[0],
                            dateTimeEnd: this.dateInput[1],
                            resType: this.recType,
                            mVehicle: this.mediaType,
                            pageNo: this.pageNo,
                            pageSize: this.pageSize,
                        }
                        this.getAdList()    // 获取选点列表
                        this.getRejectPlanList()    // 获取排斥方案列表
                    } else {
                        sessFun.messageFun('warning',res.data.MSG)
                    }
                })
            },
            // 设置该方案的销售为全国的城市数组
            setAllCityAndArea(citys){
                let cityArr = citys
                // console.log('城市数组', cityArr)
                let cityList = []
                for (let i = 0; i < cityArr.length; i++) {
                    let CityRid = areaArr.TextToCode(cityArr[i])
                    let cityObj = {rName: cityArr[i], rid: CityRid}
                    cityList.push(cityObj)
                }
                this.city = cityList
                this.city.sort(this.compareFun)
                this.activeCityData = this.city[0]
                this.activeRName = this.activeCityData.rName
                // console.log('构建城市', this.city)
                let areaList = []
                for (let j = 0; j < cityList.length; j++) {
                    let area_Arr = areaArr.findArea(cityList[j].rid)
                    area_Arr.unshift({rid: cityList[j].rid, rName: '全市'})
                    areaList.push(area_Arr)
                }
                this.area = areaList
                // console.log('构建城市区域', this.area)
                this.cityOptions = areaArr.province()
            },
            // 根据方案详情的rIDs，例如: "广州市,深圳市",构建城市区域
            setCityAndArea(cityData) {
                let cityArr = cityData
                // console.log('cityArr',cityArr)
                let cityList = []
                for (let j = 0; j < cityArr.length; j++) {
                    console.log('用户cityArr', cityArr[j])
                    cityList.push({
                        rName: cityArr[j].label,
                        rid: cityArr[j].value
                    })
                }
                cityList = this.filterCity(cityList)
                console.log('cityList',cityList)
                this.city = cityList
                this.city.sort(this.compareFun)             // 排序
                this.activeCityData = this.city[0]        // 设置默认显示可选点城市的信息
                this.activeRName = this.activeCityData.rName
                // console.log('构建城市', this.city)
                let areaList = []
                for (let j = 0; j < cityList.length; j++) {
                    let area_Arr = areaArr.findArea(cityList[j].rid)
                    area_Arr.unshift({rid: cityList[j].rid, rName: '全市'})
                    areaList.push(area_Arr)
                }
                this.area = areaList
                // console.log('构建城市区域', this.area)
                this.cityOptions = areaArr.province()
            },
            // 获取权限下的城市列表 saleManageLevel
            getCityList(){
                let cityArea = JSON.parse(sessionStorage.getItem('cityArea'))
                console.log('获取权限下的城市列表cityArea',cityArea)
                let cityList = []
                for(let cKey of cityArea){
                    if (cKey.asrID == this.sessionData.asrID) {
                        cityList.push({
                            label: cKey.city,
                            value: cKey.rid,
                        })
                    }
                }
                this.setCityAndArea(cityList)
            },
            // 根据用户权限与投放城市的交集，显示城市
            filterCity(cityData) {
                let FA_rIDs_arr = this.FAInfo.cityList
                let uRID = cityData
                let cityArr = []
                for (let i = 0; i < uRID.length; i++) {
                    for (let j = 0; j < FA_rIDs_arr.length; j++) {
                        if (uRID[i].rName == FA_rIDs_arr[j]) {
                            cityArr.push(uRID[i])
                        }
                    }
                }
                return cityArr
            },
            // 购物车关闭前校验是否还有被占点位
            shopingBeforeClose() {
                for (let j = 0; j < this.shopingList.length; j++) {
                    if (this.shopingList[j].lState !== undefined && this.shopingList[j].lState.length > 0) {
                        sessFun.messageFun('warning','请先删除完被占点位再进行其它操作')
                        break;
                    }
                    if (j >= this.shopingList.length - 1) {
                        console.log('退出购物车')
                        this.dialogTableVisible = !this.dialogTableVisible
                        this.judgeByselect()    // 勾选已经选择的A、B面
                    }
                }
                if (this.shopingList.length === 0) {
                    this.dialogTableVisible = !this.dialogTableVisible
                }
                this.computeMedia_AD()
            },
            // 编辑成功后查看方案
            ToDetail() {
                this.$router.push("./planDetail");
            },
            //城市数组去重
            delCommentCity(arr){
                // 使用es6的set数据结构特性
                let new_arr =  [...new Set(arr)]
                return new_arr
                //利用空对象来记录新数组中已经存储过的元素
                // let o = {};
                // let new_arr = []
                // for (let i = 0; i < arr.length; i++) {
                //     let k = arr[i]
                //     if (!o[k]) {
                //         o[k] = true;
                //         new_arr.push(k)
                //     }
                // }
                // return new_arr
            },
            // 时间戳转换成日期格式 2018-06-18 10:33:24
            timestampToTime(timestamp) {
                let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() + ' ';
                let h = date.getHours() + ':';
                let m = date.getMinutes() + ':';
                let s = date.getSeconds();
                return Y + M + D + h + m + s;
            },
            //  查询被占点位 shopRowClick
            beOccupiedGetList(){
                let starTime = this.dateInput[0]
                let endTime = this.dateInput[1]
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    rn: this.searchInput,
                    ls: starTime.split(".").join(""),
                    le: endTime.split(".").join(""),
                    cityIds: this.city.map(_=>_.rid),
                    saleId: this.BDData.uid,
                    asrIDs: this.BDData.asrIDs
                }
                console.log('参数', params) //planList
                api.postApi(this.apiVar.Advertisement + '/GetResAdplanInfo', params).then(res => {
                    console.log('查询被占点位', res)
                    this.isOccupied = false    // 被占搜索时隐藏过滤条件
                    let dataArr = res.data
                    this.planList = []
                    if (res.data === '' || res.data === null || res.data.length <= 0) {
                        sessFun.messageFun('warning', '暂无该小区被占信息')
                    } else {
                        let arr = []
                        for (let key of dataArr) {
                            let AD_data = {
                                mID: key.mID,
                                resType: key.resType,
                                resID: key.resID,
                                asIDs: key.asID,
                                asLabs: key.asLab,
                                resName: key.resName,
                                city: key.cityName,
                                origin: key.quName,
                                buildType: key.cType,
                                houseNum: key.hNum,
                                buildPrice: (key.hPrice / 100),
                                mediaName: key.mTitle,
                                buildNum: key.fNum,
                                schedules: this.dateInput[0] + '-' + this.dateInput[1],
                                tradingArea: key.tradingArea || '',
                                assetTag: key.assetTag || '',
                                liveYear: key.chDay,
                                adLimit: key.notPush || '',
                                mediaRemark: key.mRemark || '--',
                                mState: key.mState === 1 ? '正常' : (key.mState === 2 ? '待安装' : ''),
                                adSize: key.adSize || '',
                                apName: key.apName,         // 被占方案名称
                                lStar: key.lStar,           // 被占排期lStar，lEnd
                                lEnd: key.lEnd,
                                lState: key.lState,          //点位状态 1被占，2强制停止  0 锁点
                                mediaLevel: key.grade || '',
                            }
                            arr.push(AD_data)
                        }
                        this.planList = arr
                    }

                    this.searchBtnAbled = false
                })
            },
            // 事件埋点(无法使用模板指令时)--广告门，道闸
            MtaStatFun(mtaStatIdAdDoor,mtaStatIdRoadGate) {
                if(this.activeName == 1) {
                    MtaH5.clickStat(mtaStatIdAdDoor)
                } else if(this.activeName == 2) {
                    MtaH5.clickStat(mtaStatIdRoadGate)
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/component.scss';
    /deep/ .el-table__fixed,/deep/ .el-table__fixed-right{
        height: 584px !important;
    }
    /deep/ .el-table__fixed-right{
        right: 4px !important;
    }
    /deep/ .el-table__fixed-right-patch{
        right: 8px !important;
    }
    /deep/ .selectAdsTable .el-table__empty-text{
        left:25%;
    }
    /deep/ .el-loading-mask{
        z-index: 990;
    }
    /deep/ .el-step__main{
        height: 20px;
    }
    .adsTable{
        position: relative;
        margin-top: 5px;
        .adDoor {
            display: flex;
            justify-content: space-between;
        }
    }
    .myCheckbox{
        position: absolute;
        width: 100px;
        height: 54px;
        text-align: center;
        line-height: 54px;
        top:0;
        left: 0;
        z-index: 99;
    }
    .mapBtn {
        display: inline-block;
        min-width: 110px;
        text-align: center;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        font-size: 14px;
        vertical-align: bottom;
        color: rgba(0, 0, 0, 0.65);
        cursor: pointer;
    }

    .button_row{
        margin-top: 12px;
    }
    /deep/ .el-form--inline .el-form-item {
        margin-right: 7px !important;
    }

    .row-table-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
        margin-bottom: 24px;
    }
    /*购物车提示信息*/
    .warningInfoColor{
        display: inline-block;
        height: 16px;
        width: 16px;
        border-radius: 4px;
        vertical-align: middle;
    }

    .warningInfo .warningInfoName{
        color: #333;
        font-size: 12px;
    }
    /* 购物车表格分页 */
    .cart-pagination /deep/ .el-input__inner{
        width: 100%;
    }
    /*状态行*/
    /deep/ .el-table .warning-row {
        background: rgba(255,0,0,0.08);
    }

    /deep/ .el-table .warning-row-conncet {
        background: rgba(255,199,0,0.10)
    }
    .shopList_adLimit{
        width: 132px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    /deep/ .el-input__inner:hover {
        border-color: #dcdfe6;
    }

    /deep/ .el-select .el-input.is-focus .el-input__inner {
        border-color: #dcdfe6;
    }

    .inputNewTag /deep/ .el-input__inner {
        width: 140px !important;
    }

    .input-with-select /deep/ .el-input__inner {
        font-size: 14px;
        padding: 10px 10px;
        height: 34px;
        line-height: 14px;
    }

    /deep/ .el-input__inner {
        font-size: 14px;
        line-height: 14px;
        width: 300px;
        height: 34px;
    }
    .shopAnimate, .shopAnimateAll {
        position: fixed;
        top: 574px;
        right: 170px;
        width: auto;
        height: auto;
        color: #fff;
        z-index: 1000;
    }

    /*面包屑导航*/
    .ad_mediaMana_nav {
        position: relative;
        height: 0;
    }

    .ad_mediaMana_nav p {
        padding-left: 57px;
        position: absolute;
        left: 0;
        top: 12px;
        font-size: 14px;
        line-height: 18px;
    }

    .ad_mediaMana_nav p em {
        font-size: 14px;
        color: #D9D9D9;
        line-height: 18px;
    }

    .ad_mediaMana_nav p a {
        color: #666;
    }

    .ad_mediaMana_nav p a:nth-of-type(1) {
        color: #999;
    }

    .ad_mediaMana_wrap {
        margin-bottom: 145px;
        position: relative;
    }

    .mediaMana_content_top {
        padding: 42px 60px 0 60px;
    }

    .content_top_wrap, .content_bottom_wrap {
        background: #FFFFFF;
        border: 1px solid #DEDEDE;
        padding: 20px 18px 40px 18px;
    }

    .content_top_wrap .content_top_head {
        width: 100%;
        height: 35px;
        border-bottom: 1px solid #DEDEDE;
    }

    .content_bottom_wrap .content_bottom_head {
        width: 100%;
        height: 35px;
        border-bottom: 1px solid #DEDEDE;
    }

    .content_top_wrap .content_top_head h2, .content_bottom_wrap .content_bottom_head h2 {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #2C313C;
        font-weight: bold;
        padding-left: 16px;
        height: 24px;

        margin-top: 8px;
    }

    .content_top_wrap .content_top_form_wrap, .content_bottom_wrap .content_bottom_form_wrap {
        padding: 18px;
    }

    /*按钮*/
    .content_bottom_btn {
        width: 100%;
        position: absolute;
        bottom: -100px;
        margin-bottom: 22px;
        text-align: center;
    }

    .content_bottom_btn button {
        width: 80px;
        height: 34px;
        outline: none;
        cursor: pointer;
    }

    .content_bottom_btn button.create {
        background: #108EE9;
        border-radius: 4px;
        font-size: 14px;
        border: none;
        color: #ffffff;
    }

    .content_bottom_btn button.cancel {
        background: #ffffff;
        font-size: 14px;
        color: #666666;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        margin-left: 10px;
    }

    /*下一步按钮*/
    /deep/ .map.el-button--primary {
        background: #FF7721;
        border-color: #FF7721;
    }

    /*创建方案表单*/

    /deep/ .el-form.demo-ruleForm {
        width: 416px;
        margin: 0 auto;
    }

    /deep/ .el-textarea__inner {
        width: 260px;
        height: 80px;
        resize: vertical;
    }

    /*选择点位*/
    /deep/ .type-select .el-input, /deep/ .type-select .el-input__inner {
        width: 95px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        padding-right: 0;
    }

    /deep/ .type-select .el-input__inner{
        padding-left: 10px;
        color: rgb(144, 147, 153);
    }

    /*方案排斥*/
    /deep/ .reject_select{
        left: -6px;
    }
    /deep/ .reject_select .el-input,/deep/ .reject_select .el-input__inner{
        width: 185px;
        border-top-left-radius: 0;
    }

    /deep/ .date-select.el-input__inner {
        width: 260px;
        position: relative;
    }

    /*日期*/
    /*日期控件*/
    .block {
        display: inline-block;
        margin-left: 2px;
        position: relative;
    }

    /deep/ .el-date-editor .el-range__icon {
        position: relative;
        top: -3px;
        margin-right: 2px;
    }

    /deep/ .el-range-separator {
        position: relative;
        top: -2px;
    }

    /deep/ .el-input__inner {
        width: 260px;
        height: 34px;
        line-height: 34px;
    }

    /deep/ .el-date-editor i, /deep/ .el-date-editor input, /deep/ .el-date-editor span {
        float: left;
        position: relative;
    }

    /deep/ .el-range-editor .el-range-input {
        line-height: 20px;
    }

    /deep/ .el-dialog__header {
        font-weight: 700;
    }

    .importXle.el-button--success{
        background: #51E171;
        border-color: #51E171;
    }

    /deep/ .map.el-button--primary {
        background: #FF8F49;
        border-color: #FF8F49;
    }

    /*下拉搜索框*/
    /deep/ .el-input-group__prepend {
        width: 64px;
        background-color: #fff;
    }

    /deep/ .el-input-group--prepend .el-select .el-input__inner {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;

        width: 104px;
    }

    /deep/ .el-input-group--prepend .el-input__inner {
        width: 185px;
    }

    .el-input {
        width: 262px;
        height: 34px !important;
        border-radius: 4px;
    }

    /deep/ .el-input__inner {
        height: 34px;
    }

    .content_bottom_btn /deep/ .el-button span a {
        color: #606266;
    }

    .search-wrap {
        position: relative;
        /*清除浮动*/
        overflow:hidden;
    }

    .search-wrap > div {
        float: left;
        margin-right: 7px;
    }

    .shopcar {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        position: fixed;
        right: 29px;
        top: 75px;
        z-index: 998;
    }

    /deep/ .shopcar .el-badge__content.is-fixed {
        position: absolute;
        top: 10px;
        right: 25px;
    }

    .shopcar img {
        width: 59px;
        height: 59px;
        border-radius: 50%;
    }

    /*面板*/
    .dw-panel {
        border: 1px solid #D8D8D8;
        margin-top: 18px;
        padding: 0 18px 0 18px;
    }

    .dw-panel dl {
        border-bottom: 1px dashed #D8D8D8;
        line-height: 40px;
    }

    .dw-panel dt {
        display: inline-block;
        font-size: 14px;
        color: #999999;
        height: 40px;
    }

    .dw-panel .city-proper {
        padding-left: 75px;
        line-height: 34px;
    }

    .dw-panel dd {
        font-size: 14px;
        color: #666666;
        display: inline-block;
        line-height: 22px;
        padding: 3px 10px;
        cursor: pointer;
        margin-left: 6px;
    }

    .dw-panel dd.active {
        color: #1890FF;
        border: 1px solid #1890ff;
    }
    .dw-panel .other-dd{
        padding-left: 0px;
    }
    .otherSelect {
        /deep/ .el-input__inner{
            width: 135px;
            height: 30px;
            padding-left: 10px;
            color: #1890FF;
            border-radius: 0;
            overflow: hidden;
        }
        /deep/ .el-select__tags-text {
            display: inline-block;
            max-width: 30px;
            overflow: hidden;
            // text-overflow: ellipsis;
        }
        /deep/ .el-tag__close.el-icon-close {
            right: -5px;
            top: -5px;
        }

    }
    .adLimitSelect /deep/ .el-select__tags > span{
        width: 68px;
        height: 28px;
        overflow: hidden;
    }
    .otherSelect /deep/ .el-tag{
        background: #fff;
        color: #1890FF;
    }
    .otherSelect /deep/ .el-input__inner:hover{
        color: #1890FF;
        border-color: #1890FF;
    }
    .otherSelectActive /deep/ .el-input__inner{
        border-color: #1890FF;
    }
    .otherSelectActive /deep/ .el-input .el-select__caret{
        color: #1890FF;
    }
    .otherBtn.el-button{
        border-radius: 0;
        color:rgba(0,0,0,0.35);
    }
    .otherBtn.el-button:hover{
        border-color: #1890FF;
    }
    .otherBtnActive.el-button{
        border-color: #1890FF;
        color: #1890FF;
    }
    .input-wrap{
        text-align: center;
    }
    .input-wrap .input{
        width:66px;
        height:26px;
        background:rgba(255,255,255,1);
        border-radius:4px;
        border:1px solid rgba(194,194,194,1);
    }
    .input-wrap .input-wrap-Btn{
        width: 44px;
        min-width: 72px;
        height: 22px;
        margin-top: 6px;
        padding: 0;
        font-size: 12px;
        text-align: center;
        line-height: 22px;
        border-radius: 0;

    }

    /*筛选条件*/
    .filter-condition{
        width: 100%;
        height:36px;
        line-height: 36px;
        margin: 5px 0 0;
        background:rgb(241,241,241);
    }
    .filter-condition /deep/ .el-tag{
        background:rgba(255,255,255,1);
        border:1px solid rgba(0,0,0,0.1);
        color:rgba(0,0,0,0.35);
        margin-left: 10px;
    }
    .filter-condition /deep/ .el-tag:hover{
        color: #1890FF;
        border-color: #1890FF;
    }
    .filter-condition /deep/ .el-tag:hover .el-tag__close.el-icon-close{
        color: #1890FF;
    }
    /* /deep/ .el-tag__close.el-icon-close:hover{
        background: #fff;
    } */

    /*表格*/
    /deep/ .el-table th, .el-table tr {
        background: #F7F7F7;
        padding: 10px 0;
    }

    /deep/ .el-table th > .cell {
        color: #666666;
        line-height: 14px;
        font-weight: bold;
    }

    /deep/ .el-table-column-checkbox .el-checkbox {
        margin-right: 0;
    }

    /deep/ .el-table__expanded-cell[class*=cell] {
        padding: 0 86px;
        background-color: #F7F7F7;;
    }

    /deep/ .el-table__expanded-cell[class*=cell] .el-form {
        height: 44px;
        line-height: 44px;
    }

    /deep/ .el-form-item__content {
        line-height: 46px;
    }

    /deep/ .el-form-item__label {
        padding: 0 0 0 12px;
    }

    /deep/ .selectAdsTable .el-table__body-wrapper{
        overflow-x: auto !important;
    }
    /deep/ .selectAdsTable .el-checkbox__label{
        padding-left: 4px ;
    }

    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        height: 440px;
        overflow-y: scroll;
        overflow-x: hidden !important;
    }
    /deep/ .car-list .el-table__body-wrapper {
        min-height: 382px;
        max-height: 402px;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 4px;
        height: 8px;
        background: #FAFAFA;

    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }

    /deep/ .el-form--inline .el-form-item {
        margin-right: 45px;
    }

    /deep/ .el-dialog {
        width: 1000px;
    }

    .step2 /deep/ .el-dialog {
        width: 1100px;
        height: 746px;
    }

    .step3 /deep/ .el-dialog {
        width: 388px !important;
    }

    /*购物车列表*/
    /deep/ .shop-cart-wrapper {
        .shopcar_box {
            padding: 24px 24px 0;
        }
        .top-row {
            margin-bottom:10px;
            .el-input__icon {
                height: 32px;
                line-height: 32px;
            }
            .el-input__inner {
                height: 32px;
                line-height: 32px;
            }
        }
        .shop-cart-footer {
            padding-top: 10px;
            text-align: center;
            border-top: 1px solid rgba(233, 233, 233, 1);
        }
        .el-dialog__body {
            padding: 0;
            border-bottom: none;
        }
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

    .car-title p {
        font-size: 14px;
        font-weight: normal;
        display: inline-block;
        margin-left: 10px;
    }

    .car-title span {
        font-size: 14px;
        font-weight: normal;
        margin: 0 4px;
        cursor: pointer;
        color: #1890ff;
    }

    /deep/ .car-list .el-table__expanded-cell[class*=cell] {
        padding: 0 46px;
        background-color: #F7F7F7;;
    }

    /deep/ .table_wrap.car-list {
        margin-top: 0 !important;
    }

    /*超出省略*/
    /deep/ .el-table .cell {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    /deep/ .el-table__row .cell span{
        overflow-x: initial;
    }
    /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #ecf5ff;
    }

    /*确认报价单*/
    .step3 {
        padding: 0 105px;
    }

    .bill-title {
        width: 100%;
        height: 181px;
        box-sizing: border-box;
        border: 1px solid #D8D8D8;
        margin-bottom: 10px;
        padding: 22px 60px;
    }

    .bill-title h4 {
        font-size: 18px;
        color: #333333;
        font-weight: bold;
        margin-bottom: 12px;
    }

    .bill-title p {
        margin-bottom: 12px;
        font-size: 14px;
        color: #666666;
    }

    .bill-title-left {
        float: left;
    }

    .bill-title-right {
        float: right;
    }

    .bill-title-right {
        font-size: 14px;
        color: #666666;
    }

    .bill-title-right p {
        text-align: right;
        position: relative;
    }

    .bill-title-right em {
        float: right;
        position: absolute;
        right: 225px;
        top: 0;
        width: 100px;
    }

    .bill-title-right .totalPrice {
        font-size: 22px;
        color: #333333;
        font-weight: bold;
    }

    /deep/ .el-tabs--border-card > .el-tabs__content {
        padding: 40px;
    }

    .tab-info h4 {
        width: 100%;
        background: #FAFAFA;
        border-radius: 2px;
        font-size: 16px;
        color: #333333;
        height: 34px;
        line-height: 34px;
        padding-left: 20px;
        font-weight: bold;
    }

    .tab-info p {
        margin-bottom: 40px;
        margin-top: 20px;
        margin-left: 20px;
        font-size: 14px;
        color: #666666;
    }

    /*确认报价单修改框*/
    /deep/ .el-dialog__body {
        padding: 2px 20px 8px 20px;
    }
    /deep/ .step3 .el-input {
        /*width: 348px;*/
    }

    /deep/ .step3 .el-input__inner, /deep/ .step3 .el-textarea__inner {
        width: 348px;
    }

    /*广告费修改-赠送面天*/
    /deep/ .step3 .is-controls-right .el-input__inner{
        width: 304px;
    }

    /*计数器*/
    /deep/ .el-input-number__decrease, /deep/ .el-input-number__increase {
        background-color: transparent !important;
    }

    /deep/ .el-icon-arrow-down {
        position: relative;
        top: 1px;
    }

    /deep/ .el-input-number .el-input__suffix {
        right: 42px !important;
    }

    /deep/ .el-input__suffix {
        right: 7px;
    }
    /deep/ .type-select .el-input__suffix{
        right: 4px;
    }
    /deep/ .el-input-number.is-controls-right .el-input-number__decrease [class*=el-icon],
    .el-input-number.is-controls-right .el-input-number__increase [class*=el-icon] {
        position: relative;
        top: 2px;
    }

    /deep/ .el-input-number {
        width: 304px;
        margin-bottom: 5px;
    }

    /deep/ .el-table th > .cell.highlight {
        color: #409EFF !important;
    }

    .changeMakePrice .el-input__inner {
        width: 352px;
        height: 34px;
        margin-top: 6px;
    }

    /deep/ .el-input-number.is-controls-right .el-input__inner {
        text-align: left;
    }

    /deep/ .el-tabs--border-card {
        box-shadow: none;
        border: 1px solid #D8D8D8;
    }

    /*完成创建*/
    .successIcon img {
        width: 72px;
    }

    .successIcon h2 {
        font-size: 24px;
        color: #333333;
        margin-top: 24px;
        margin-bottom: 8px;
        font-weight: bold;
    }

    .successIcon p {
        font-size: 14px;
        color: #999999;
        margin-bottom: 16px;
    }

    .planPanel, .successIcon {
        text-align: center;
    }

    .planPanel {
        width: 557px;
        // height: 220px;
        background: #FAFAFA;
        border-radius: 2px;
        padding: 19px 0;
        box-sizing: border-box;
        margin: 0 auto;
    }

    .planPanel ul li {
        padding-left: 206px;
        line-height: 26px;
        text-align: left;
        font-size: 14px;
        color: #666666;
        margin-bottom: 10px;
    }

    .planPanel ul li.money {
        margin-bottom: 0 !important;
        font-size: 20px;
        color: #666666;
    }

    .planPanel ul li em {
        font-size: 14px;
        color: #333333;
    }

    .planPanel ul .money i {
        font-style: normal;
        font-size: 12px;
        color: #666666;
    }

    .noShareUl {
        // height: 198px !important;
    }

    .noShareUl ul li {
        margin-bottom: 12px !important;
    }
    /*一键选点*/
    /deep/ .onKeyPointFrom .el-form-item__content{
        margin-left: 88px !important;
    }
    .ABcaleItem {
        display: inline-block;
    }

    /deep/ .ABcaleItem .el-input__inner {

        width: 119px;
    }

    /deep/ .rmb .el-input__inner {
        padding-left: 30px;
    }

    /deep/ .ABcaleItem .el-input {
        width: 118px;
    }

    /deep/ .ABcaleItem.el-form-item {
        min-width: 227px;
        max-width: 227px;
    }

    .ABcalePercent{
        position: relative;
    }
    .ABcalePercent .percent{
        position: absolute;
        top:0;
        right: 28px;
    }
    .BcaleItem .ABcalePercent .percent{
        right: 10px;
    }
    .el-dialog__footer{
        text-align: center;
    }
    .OneKeyPoint_footer button{
        padding: 0;
        line-height: 34px;
    }
    /deep/ .clearShopping{
        cursor: pointer;
        color: #1890ff;
        font-size: 14px;
    }

    /* 方案导入 */
    .import_fanan a{
        color: #606266;
    }
    .import_fanan .fileButton{
        width: 126px;
    }

    .upload_file{
        display: inline-block;
    }
    .warning_box{
        margin-top: 20px;
        background:rgba(255,251,230,1);
        border-radius:4px;
        border:1px solid rgba(255,229,143,1);
        color:rgba(0,0,0,0.65);
        padding: 0 5px;
    }
    .upload_file .aButton{
        width: 124px;
        height: 29px;
        line-height: 31px;
        text-align: center;
        display: inline-block;
        color: #666;
        margin-right: 3px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
    }
    .aButton:hover{
        border: 1px solid #409EFF;
        color: #409EFF;
    }
    /*一键更换排期*/
    .table_box{
        position: relative;
    }
    /deep/ .shopcar_box .el-tabs__item{
        height: 38px;
    }
    .button_point{
        text-align: right;
    }
    .change_scheduling{
        color: #1890ff;
        font-size: 14px;
        position: absolute;
        top: 113px;
        right: 468px;
        z-index: 10;
        line-height: 45px;
        cursor: pointer;
    }
    .scheduled_box{
        line-height: 35px;
        color: #333;
    }
    /deep/ .scheduled_box .el-icon-date{
        font-size: 30px;
        color: #333;
        cursor:pointer;
    }
    /deep/ .scheduled_box .date-select-scheduled{
        border:none;
    }
    /deep/ .date-select-scheduled .el-range__icon{
        margin-right: 3px;
    }
    /deep/ .scheduled_box .el-icon-circle-close-outline{
        cursor:pointer;
        font-size: 22px;
        position: relative;
        top:3px;
        color: #FF8F49;
    }
    .change_defeat_schedules{
        color: red;
    }
    .defead_scheduled_box ul{
        max-height: 160px;
        overflow-y: auto;
    }
    .defead_scheduled_box ul::-webkit-scrollbar{
        width: 6px;
        background: #FAFAFA;
    }
    .defead_scheduled_box ul::-webkit-scrollbar-thumb{
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }
    /deep/ .defead_scheduled_box .el-icon-warning{
        font-size: 28px;
        color: #e6a23c;
    }
    .defead_scheduled_box h3 span{
        position: relative;
        top: -5px;
    }
    .defead_scheduled_box{

    }
    .defead_scheduled_box ul li{
        margin-bottom: 10px;
    }
    .defead_ads_num{
        display: inline-block;
        width: 24px;
        height: 24px;
        background: #D6D6D6;
        color: #000;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
    }
    .defead_scheduled_footer_btn{
        width: 55px;
        height: 30px;
        padding: 9px 12px;
    }
    /*safari下表头错位*/
    /deep/ .el-table .el-table-column-checkbox .cell{
        width: 110px;
    }
    /deep/ .el-table .el-table-column-resName .cell{
        width: 200px;
    }
    /deep/ .el-table .el-table-column-mediaName .cell{
        width: 140px;
    }
    /deep/ .el-table .el-table-column-mediaRemark .cell{
        width: 140px;
    }

    /deep/ .el-badge__content.is-fixed.is-dot {
        left: -15px;
        top: 5px;
        background: #FF6868;
        width: 5px;
        height: 5px;
    }
    /deep/ .el-pagination__sizes .el-input__inner{
        height: 28px;
    }
    .ad_pagination /deep/ .el-pagination__sizes .el-input__inner{
        width: 100px;
    }
    .ad_pagination /deep/ .el-pagination__editor.el-input .el-input__inner{
        width: 45px;
    }
    /*提示*/
    .tip{
        width: 100%;
        background:rgba(230,247,255,1);
        border-radius:4px;
        border:1px solid rgba(145,213,255,1);
        padding: 10px 16px ;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        margin: 8px 0;
        font-size: 14px;
        color:rgba(0,0,0,0.65);
    }
    .tip span{
        color: #1890FF;
    }
    .tip /deep/ .el-icon-info{
        color: #1890ff;
        margin-right: 8px;
    }
</style>
