<template>
    <div class="ad_mediaMana_wrap createPlan">
        <div class="ad_mediaMana_nav clearfix">
            <p><a href="#">方案管理</a><em> / </em><a href="#">创建方案</a></p>
        </div>
        <div class="mediaMana_content_top">
            <div class="content_top_wrap">
                <!--填写客户信息-->
                <div class="step1" v-if="active==0">
                    <div class="createPlan">
                        <el-form :model="planForm" status-icon :rules="planRules" ref="planForm" label-width="100px"
                                 class="demo-ruleForm">
                            <el-form-item label="方案名称：" prop="planName">
                                <el-input v-model="planForm.planName" placeholder="请输入方案名称"></el-input>
                            </el-form-item>
                            <el-form-item label="所属销售：" prop="ownerSales">
                                <el-input v-if="isBD" v-model="planForm.ownerSales" disabled></el-input>
                                <!--BDData.realName-->
                                <el-autocomplete
                                    v-else
                                    v-model="planForm.ownerSales"
                                    :fetch-suggestions="querySearchAsync"
                                    placeholder="请输入账号"
                                >
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="公司名称：" prop="companyName">
                                <el-select v-model="planForm.companyName" @change="GetBrandByCid" placeholder="请选择公司名称">
                                    <el-option
                                        v-for="item in companyName"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="公司品牌：" prop="companyBrand">
                                <el-select v-model="planForm.companyBrand" placeholder="请选择公司品牌">
                                    <el-option
                                        v-for="item in companyBrand"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系人：" prop="ownerBU">
                                <el-select v-model="planForm.ownerBU" placeholder="请选择所属联系人">
                                    <el-option
                                        v-for="item in ownerBU"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="投放城市：" prop="throwCity" ref="planThrowCity">
                                <div v-if="cityOther" v-model="planForm.throwCity">
                                    <el-tag
                                        :key="tag"
                                        v-for="tag in dynamicTags"
                                        closable
                                        :disable-transitions="false"
                                        @close="spliceCity(tag)">
                                        {{tag}}
                                    </el-tag>
                                    <el-cascader
                                        style="width: 140px"
                                        class="inputNewTag"
                                        v-if="inputVisible"
                                        v-model="selectedOptions"
                                        :options="cityOptions"
                                        ref="saveTagInput"
                                        :show-all-levels="false"
                                        size="small"
                                        @change="handleInputConfirm"
                                    >
                                    </el-cascader>
                                    <el-button v-else class="button-new-tag" size="small" @mouseover.native="showInput">
                                        +
                                    </el-button>
                                </div>
                                <el-select v-else v-model="planForm.throwCity" size="small" filterable multiple placeholder="请选择" @remove-tag="removeCity">
                                    <el-option
                                        v-for="item in throwCity"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <!--选择点位-->
                <div class="step2" v-if="active==1">
                    <div>
                        <div class="search-nav">
                            <div class="search-wrap">
                                <div style="margin-right: 0">
                                    <el-select v-model="activeSelect" placeholder="请选择" class="type-select">
                                        <el-option label="方案排斥" value="1"></el-option>
                                    </el-select>
                                    <el-select v-model="activeAdPlan" placeholder="请选择排斥方案" class="reject_select"
                                               @change="selectRejectPlan" filterable :clearable="true">
                                        <el-option v-for="item in rejectAdPlan" :key="item.value" :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </div>
                                <div>
                                    <el-input placeholder="请输入要搜索的内容" v-model="searchInput" class="input-with-select" @change="initData">
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
                                    >
                                    </el-date-picker>
                                </div>
                                <div>
                                    <el-button type="primary" style="background: #1890FF" icon="el-icon-search"
                                               class="searchBtn" @click="searchFun" :disabled="searchBtnAbled">搜索</el-button>
                                </div>
                                <div>
                                    <el-button type="primary" class="map" icon="el-icon-location-outline" @click="mapAD">地图</el-button>
                                </div>
                                <div>
                                    <el-button type="success" class="oneKeyPointBtn importXle" icon="el-icon-upload2" @click="importFanan">导入</el-button>
                                </div>
                                <div>
                                    <el-button class="oneKeyPointBtn" @click="dialogOneKeyPoint = true">一键选点</el-button>
                                </div>
                                <div class="shopcar" @click="dialogVisible()">
                                    <el-badge :value="nowPointNum" class="item">
                                        <img src="../../assets/images/shopCar.png" alt="">
                                    </el-badge>
                                </div>
                            </div>
                        </div>
                        <!--类型区域选择面板-->
                        <div class="dw-panel" v-show="isOccupied">
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
                                <dd v-for="(item, index) in city" :index="index"
                                    :class=" index == activeIndex ? 'active' : ''"
                                    @click="activeCity(item,index)">{{item.rName}}
                                </dd>
                            </dl>
                            <dl class="city-proper" v-for="(list, index) of area" :index="index"
                                v-show=" index == activeIndex">
                                <dd v-for="item of list" :class="item.rName == areaName ? 'active' : ''"
                                    @click="activeArea(item)">{{item.rName}}
                                </dd>
                            </dl>
                            <dl style="border: none">
                                <dt>其它条件：</dt>
                                <dd class="other-dd">
                                    <el-select v-model="mState" placeholder="媒体状态" class="otherSelect" :class="mState !== '' ? 'otherSelectActive' :'' "
                                               @change="mStateChange">
                                        <el-option label="正常" value="1"></el-option>
                                        <el-option label="待安装" value="2"></el-option>
                                    </el-select>
                                    <el-select v-model="limitList" placeholder="广告限制" class="otherSelect adLimitSelect"
                                               :class="limitList.length !== 0 ? 'otherSelectActive' :'' " multiple collapse-tags
                                               @change="activeADLimit"> <!--visible-change-->
                                        <el-option
                                            v-for="item in ADLimit"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="buildValue" :placeholder="recType == '1' ? '楼盘类型' : '写字楼类型'"
                                               :class="buildValue !== '' ? 'otherSelectActive' :'' "
                                               class="otherSelect" @change="tableHeaderFilter_cType">
                                        <el-option v-for="item in buildType" :key="item.buildValue"
                                                   :label="item.buildValue"
                                                   :value="item.buildValue">
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="activeGrade" placeholder="媒体等级" class="otherSelect"
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
                                            <input type="text" class="input"
                                                   v-model="houseNum[0]">
                                            -
                                            <input type="text" class="input"
                                                   v-model="houseNum[1]">
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
                                            <input type="text" class="input"
                                                   v-model="buildPrice[0]">
                                            -
                                            <input type="text" class="input"
                                                   v-model="buildPrice[1]">
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
                                            <input type="text" class="input"
                                                   v-model="liveYear[0]">
                                            -
                                            <input type="text" class="input"
                                                   v-model="liveYear[1]">
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
                                            <input type="text" class="input"
                                                   v-model="peopleFlow[0]">
                                            -
                                            <input type="text" class="input"
                                                   v-model="peopleFlow[1]">
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
                        <div class="filter-condition" v-show="isOccupied">
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
                        <!--表格-->
                        <div class="table_wrap adsTable">
                            <div class="myCheckbox" v-if="isOccupied">
                                <el-checkbox v-model="IsAll" @change="allCheckboxAds"></el-checkbox>
                            </div>
                            <el-table
                                v-loading="loading"
                                element-loading-text="玩命加载中.."
                                element-loading-spinner="el-icon-loading"
                                v-loadmore="loadMore"
                                border
                                :data="planList"
                                :default-sort="{prop: 'mID', order: 'descending'}"
                                @cell-mouse-enter="mouseEnter"
                                @row-click="rowClick"
                                style="width: 100%"
                                class="selectAdsTable"
                                height="480">
                                <el-table-column width="110px" fixed><!-- :render-header="customFieldColumn"-->
                                    <template slot-scope="scope">
                                        <div v-if="isOccupied">
                                            <div class="adDoor" v-if="mediaType === '广告门'">
                                                <el-popover
                                                    v-if="scope.row.box.A"
                                                    placement="top-start"
                                                    width="310"
                                                    trigger="hover">
                                                    <span v-if="scope.row.adlInfo === ''">暂无被禁用的信息</span>
                                                    <ul v-else>
                                                        <li v-for="(item,index) in scope.row.adlInfo" :key="index">
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
                                                    <span v-if="scope.row.adlInfo === ''">暂无被禁用的信息</span>
                                                    <ul v-else>
                                                        <li v-for="(item,index) in scope.row.adlInfo" :key="index">
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
                                    label="资源名称"
                                    min-width="200"
                                    prop="resName"
                                >
                                </el-table-column>
                                <el-table-column
                                    fixed
                                    prop="mediaName"
                                    label="媒体名称"
                                    min-width="140"
                                    class="tar"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="city"
                                    label="城市"
                                    min-width="110"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="origin"
                                    label="区域"
                                    min-width="110"
                                >
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
                                    min-width="140">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.mediaRemark.length <= 6">{{scope.row.mediaRemark || '--' }}</span>
                                        <el-tooltip v-else class="item" effect="dark" :content="scope.row.mediaRemark" placement="bottom-start">
                                            <span>{{scope.row.mediaRemark || '--' }}</span>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="资产编号"
                                    min-width="160">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.assetTag.length <= 14">{{scope.row.assetTag || '--' }}</span>
                                        <el-tooltip v-else class="item" effect="dark" :content="scope.row.assetTag" placement="bottom-start">
                                            <span>{{scope.row.assetTag || '--' }}</span>
                                        </el-tooltip>
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
                                    min-width="130">
                                    <template slot-scope="scope">
                                        <el-tooltip class="item" effect="dark" :content="scope.row.adLimit" placement="bottom-start">
                                            <span>{{scope.row.adLimit || '--' }}</span>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    :label="recType == 1? '楼盘类型':'写字楼类型'"
                                    min-width="100">
                                    <template slot-scope="scope">
                                        <span v-if="recType == 1">{{ scope.row.buildType || '--' }}</span>
                                        <el-tooltip v-else class="item" effect="dark" :content="scope.row.buildType" placement="bottom-start">
                                            <span>{{scope.row.buildType || '--' }}</span>
                                        </el-tooltip>
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
                                    min-width="110">
                                    <template slot-scope="scope">
                                        <span>&yen;{{scope.row.buildPrice}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="buildNum"
                                    label="楼栋数量"
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
                                    :label="recType === 1? '入住年份' : '建成年份'"
                                    min-width="90">
                                </el-table-column>
                                <el-table-column
                                    prop="houseNum"
                                    :label="recType === 1? '小区户数' : '办公室数量'"
                                    min-width="90">
                                </el-table-column>
                                <el-table-column
                                    label="人流量"
                                    min-width="110">
                                    <template slot-scope="scope">
                                        {{ scope.row.peopleFlow || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="车位数"
                                    min-width="110">
                                    <template slot-scope="scope">
                                        {{ scope.row.parkSpaceNum || '--' }}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="车流量"
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
                        </div>
                        <!--购物车-->
                        <el-dialog title="已选点位" :visible.sync="dialogTableVisible">
                            <template slot-scope="scope">
                                <div class="table_wrap car-list" style="margin-top: 60px">
                                    <el-row style="margin-bottom:10px;">
                                        <el-col :span="8">
                                            <el-radio-group v-model="activeName" size="small" @change="handleClick">
                                                <el-radio-button :label="item.type.toString()" v-for="item of typeShopList" :key="item.type">{{item.mVehicle}}</el-radio-button>
                                            </el-radio-group>
                                        </el-col>

                                        <el-col :span="16" style="text-align:right;">
                                            <span class="button_point">
                                                <el-button @click="getMapADList" class="mapBtn" :disabled="mapBtn">获取地图选点</el-button>
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
                                            选3面:<span>{{shopMedia_ADNum.threeNum}}</span>)
                                        </el-col>
                                        <el-col :span="2">
                                            媒体:<span>{{shopMedia_ADNum.mediaNum}}</span>
                                        </el-col>
                                        <el-col :span="6">
                                            点位:<span>{{shopMedia_ADNum.ADNum}}</span>
                                            (A面:<span>{{mediaLevelNum.ANum}}</span>&nbsp;&nbsp;
                                            B面:<span>{{mediaLevelNum.BNum}}</span>)
                                        </el-col>
                                        <el-col :span="5">
                                            A级:<span>{{mediaLevelNum.ALevel}}</span>
                                            B级:<span>{{mediaLevelNum.BLevel}}</span>
                                            C级:<span>{{mediaLevelNum.CLevel}}</span>
                                        </el-col>
                                    </el-row>

                                    <el-table
                                        border
                                        :data="shopShowList"
                                        :default-sort="{prop: 'mID', order: 'descending'}"
                                        :row-class-name="tableRowClassName"
                                        @row-click="shopRowClick"
                                        style="width: 100%">
                                        <el-table-column type="expand">
                                            <template slot-scope="props">
                                                <el-form label-position="left" inline class="demo-table-expand">
                                                    <el-form-item label="商圈：">
                                                        <span>{{ props.row.tradingArea}}</span>
                                                    </el-form-item>
                                                    <el-form-item label="小区户数：">
                                                        <span>{{ props.row.houseNum }}</span>
                                                    </el-form-item>
                                                    <el-form-item label="楼盘价格：">
                                                        <span>&yen;{{ props.row.buildPrice}}</span>
                                                    </el-form-item>
                                                    <el-form-item label="资产编号：">
                                                        <span>{{ props.row.assetTag }}</span>
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
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="资源名称"
                                            min-width="140"
                                            prop="resName">
                                        </el-table-column>
                                        <el-table-column
                                            label="媒体名称"
                                            min-width="130">
                                            <template slot-scope="scope">
                                                <el-tooltip class="item" effect="dark" :content="scope.row.mediaName"
                                                            placement="bottom">
                                                    <span>{{ scope.row.mediaName}}</span>
                                                </el-tooltip>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="city"
                                            label="城市"
                                            min-width="80">
                                        </el-table-column>
                                        <el-table-column
                                            prop="origin"
                                            label="区域"
                                            min-width="80">
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
                                        <el-table-column
                                            label="楼盘类型"
                                            min-width="85">
                                            <template slot-scope="scope">
                                                {{ scope.row.buildType || '--' }}
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
                                        <el-table-column
                                            prop="schedules"
                                            label="排期"
                                            min-width="185">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.schedules}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column min-width="65">
                                            <template slot-scope="scope">
                                                <span>{{scope.row.A_B}}面</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column min-width="50" :render-header="renderHeader">
                                            <template slot-scope="scope">
                                                <span style="cursor: pointer;color: #1890ff"
                                                      @click="deleteRow(scope.row)">
                                                    <i class="el-icon-delete" style="color: #108DE7;font-size: 20px;margin-left: 6px"></i>
                                                </span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <p class="warningInfo">
                                        <span style="background: #fff1f1" class="warningInfoColor"></span>
                                        <span class="warningInfoName">被占点位</span>
                                        <span style="background: rgba(0,153,255,0.2)" class="warningInfoColor"></span>
                                        <span class="warningInfoName">连排门、同行资源回避、同行媒体回避</span>
                                    </p>

                                    <div style="text-align: center;margin-bottom: 10px">
                                        <el-button style="margin-top: 12px;" @click="next" type="primary">下一步
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
                                <h4>{{planForm.planName}}</h4>
                                <p>{{cName}}</p>
                                <p>{{cBand}}</p>
                            </div>
                            <div class="bill-title-right">
                                <ul>
                                    <li><p><em>现金结算：</em><span>￥{{priceFormat(cash)}}</span></p></li>
                                    <li><p><em>资源置换：</em><span>￥{{priceFormat(zyzh)}}</span></p></li>
                                    <li><p><em>其他费用：</em><span>￥{{priceFormat(other)}}</span></p></li>
                                    <li><p><em style="top: 5px">总计：</em><span class="totalPrice">￥{{priceFormat(totalPrice)}}</span>
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
                            <!--<i class="fa fa-check-circle fa-4x" style="color:#67C23A;"></i>-->
                            <h2>创建成功</h2>
                            <p>创建时间：{{dateTime}}</p>
                        </div>
                        <div class="planPanel noShareUl">
                            <ul>
                                <li><em>方案名称：</em>{{planForm.planName}}</li>
                                <li><em>所属客户：</em>{{cName}}</li>
                                <li><em>所属品牌：</em>{{cBand || '--'}}</li>
                                <li class="money"><em>订单金额：</em>￥{{priceFormat(totalPrice)}}</li>
                                <li style="overflow: hidden;text-overflow:ellipsis">
                                    <em>协同选点：</em><span id="shareUrl">{{shareADUrl}}</span>
                                    <el-button @click="copyUrl" class="urlBtn">复制</el-button>
                                    <el-button @click="downLoadFanan()" type="success" class="urlBtn">导出方案</el-button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content_bottom_btn">
            <el-button @click="prev" v-if="active == 1 || active == 2" type="default">上一步</el-button>
            <el-button @click="clearData" v-if="active === 0" type="default">取消</el-button>
            <!-- 空点导出 -->
            <!-- <el-button v-if="active === 0" type="default" @click="downEmpty()">导空点</el-button> -->
            <!-- <el-button v-if="active === 0" type="default" @click="exportExcelData()">导空点</el-button> -->
            <el-button v-if="active === 0" type="default" @click="exportEmpty()">导空点</el-button>

            <el-button style="margin-top: 12px;padding: 12px" @click="next"
                       v-if="active == 0 || active == 1" type="primary">下一步
            </el-button>
            <el-button style="margin-top: 12px;padding: 12px" @click="next"
                       v-if="active == 2" type="primary">创建方案 </el-button>

            <!-- <p v-if="active === 0" style="color: #666;font-size: 14px;margin-top:10px;">备注：导空点功能目前导出的为最近一年的空点</p> -->

            <div class="finishBtn" v-if="active == 3">
                <el-button type="primary" @click="continueCreate">继续创建</el-button>
                <el-button type="default" @click="ToDetail">
                    <!--<router-link to="{path='/orderList'}"></router-link>-->
                    查看方案
                </el-button>
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
                <li v-for="item in beOccupiedAdsData">
                    <p>
                        <span style="color: #333">占点方案：</span>
                        <span v-if="sessionData.uType === 'MD'"><span style="font-weight: bold">{{item.beOccupieApName}}</span> 方案（{{item.lState == 0 ? '预锁': (item.lState == 1 ? '被占' : '强制停止')}}）</span>
                        <span v-else>******</span>
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
        <!-- 导出空位时间弹出框 -->
        <el-dialog
            :visible.sync="showEmptyPoint"
            :modal="false"
            top="35vh"
            width="40%">
            <p>
                <el-radio-group v-model="dateType" >
                    <el-radio label="1" v-if="isShowHalfYear">默认半年日期</el-radio>
                    <el-radio label="2">自定义日期</el-radio>
                </el-radio-group>
            </p>
            <p v-if="dateType == '2'" style="margin-top:10px;">
                <el-date-picker
                    v-model="emptyRange"
                    type="daterange"
                    size="mini"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy/MM/dd"
                    format="yyyy/MM/dd"
                    class="date-select input-with-select"
                >
                </el-date-picker>
            </p>
            <span slot="footer">
                <el-button  size="small" type="primary" @click="downEmptyPoint()">确认</el-button>
            </span>
        </el-dialog>
        <!-- 导出空位弹出框 -->
        <el-dialog
            title="链接地址："
            :visible.sync="showEmpty"
            :modal="false"
            top="35vh"
            width="40%">
            <p id="shareDownUrl">{{downUrl}}</p>
            <p style="text-align:center;margin-top:25px;">
                <el-button type="primary" @click="copyUrlDown()" size='small' style="width: 80px;height: 34px;outline: none;cursor: pointer;">复制链接</el-button>
            </p>
        </el-dialog>
        <!-- 导入方案弹出框 -->
        <el-dialog
            title=""
            :visible.sync="isImport"
            top="20vh"
            width="40%">
            <p class="import_box">
                <span>
                    <b>下载模板:</b>
                    <a href="/template.xlsx" class="el-icon-download aButton" download="方案导入模板.xlsx">下载文件</a>
                </span>
                <span class="import_file fileUploadSpan">
                    <b>选择方案:</b>
                    <el-upload
                        class="upload_file"
                        ref="upload"
                        accept=".xlsx,.xls"
                        :action="doUpload"
                        :show-file-list="false"
                        :http-request="uploadFile"
                        :multiple="false">
                        <el-button icon="el-icon-upload2">
                            上传文件
                        </el-button>
                    </el-upload>
                    <span style="color:#999;">支持扩展名: .xlsx .xls</span>
                </span>
            </p>
            <p>
                <b>方案名称:</b>
                <el-tag
                    v-for="(tag, index) of fileNameTags"
                    :key="index"
                    type="info"
                    closable
                    :disable-transitions="false"
                    @close="tabCloseFun(tag, index)">
                    {{tag}}
                </el-tag>
            </p>
            <p class="upload_box">
                <el-button  size="small" type="primary" @click="submitUpload()">确定上传</el-button>
            </p>
            <p style="color: fuchsia;">
                *提示,读取导入的点位需要时间,请等待,切勿重复上传
            </p>
        </el-dialog>
        <!-- 导入excel点位部分失败弹框 -->
        <el-dialog
            :visible.sync="showUploadFail"
            title="导入excel的点位信息"
            top="20vh"
            width="80%">
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
                <el-table-column prop="schedules" label="排期" min-width="190">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.schedules" placement="bottom">
                            <span>{{scope.row.schedules}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import {
        Input, Dialog, Button, Tabs, TabPane, Table, TableColumn, Cascader, DatePicker,
        Select, Option, Form, FormItem, Steps, Step, Badge, Checkbox, Message, InputNumber
    } from 'element-ui';
    import apQuotation from './components/apQuotation'
    import api from '../../api/api'
    import areaArr from '../../commonFun/areaPackage_new'
    import commaFormat from '../../commonFun/commaFormat'
    // 时间格式化
    import timeFormat from '../../commonFun/timeFormat'
    // 筛选过滤
    import filterFormat from "../../commonFun/filterTableData.js";
    import sheetExcel from "../../commonFun/sheetExcel.js";
    // 方案缓存
    import cacheAdPlan from "../../commonFun/cacheAdPlan"

    export default {
        name: "createPlan",
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
        },
        data() {
            let validateSales = (rule, value, callback) => {
                if (value) {
                    if (this.BDData.uid === '0') {
                        callback(new Error('请输入正确的账号'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            let validateName = (rule, value, callback) => {
                if (value) {
                    if (value.match(/^\s+$/)) {
                        callback(new Error('方案名称不能为空格'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
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
                // 导空点是否展示半年json下载(全国媒介或全国销售有权限下载)
                isShowHalfYear: false,
                // doUpload: 'https://beta.qinlinad.com/advertisement/AnalysisExcelAdBaseInfo',
                doUpload: '/advertisement/AnalysisExcelAdBaseInfo',
                // 空位导出url
                downUrl: '',
                // 是否显示空位导出弹出框
                showEmpty: false,
                showEmptyPoint: false,
                dateType: '1',
                emptyRange: [],
                active: 0,                  // 当前步骤step
                mapADDialog: false,
                loading: true,              //加载中
                dynamicTags: [],
                inputVisible: false,
                inputValue: '',
                selectedOptions: [],
                cityOptions: [],
                cityOther: false,           // 判断是否可选择全国城市
                isBD: true,                 // 判断登录用户是否为销售
                username: '',               // 获取登录用户的userName
                recType: 1,                 // step2  1:社区 2:写字楼
                mediaType: '广告门',         // 媒体类型 广告门、道闸
                shopXY: {x: '', y: ''},     // 动画起始坐标
                shoppingShow: false,        //动画效果的显示隐藏
                selectAll: false,           // 是否全选
                bodyWidth: 1920,
                city: [],                   // step2 城市
                area: [],                   // step2城市下属区域
                activeIndex: 0,             //step2当前选中的城市下标
                activeRName: '',            //step2当前选中的城市名称
                areaName: '全市',            // step2当前选中的区域
                areaRid: '',                // step2当前选中的区域rid
                quotation: [],              // step3 报价单汇总
                quotationObj: {},           // 传递给报价单组件的数据，标示是否来自详情
                totalPrice: 0,              //总价
                remark: '无',               //备注
                cash: 0,                    // 现金结算
                zyzh: 0,                    // 资源置换
                other: 0,                   // 其他费用
                customer: [],               // step1公司客户
                companyName: [],            //step1公司名称
                cName: '',                  // 选中公司名称
                companyBrand: [],           //step1公司品牌
                cBand: '',                  // 选中的品牌
                ownerBU: [],                //step1联系人
                //step1投放城市
                throwCity: [],
                //购物车
                dialogTableVisible: false,
                //选中
                checkAB: true,
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
                    },
                    {
                        value: '被占查询',
                        label: '被占查询'
                    }
                ],
                //默认
                selectValue: '资源名称',
                //楼盘类型
                buildType: [
                    {buildlabel: '高端住宅', buildValue: '高端住宅'},
                    {buildlabel: '中端住宅', buildValue: '中端住宅'},
                    {buildlabel: '普通住宅', buildValue: '普通住宅'},
                    {buildlabel: '单体楼', buildValue: '单体楼'},
                    {buildlabel: '洋房', buildValue: '洋房'},
                    {buildlabel: '商住', buildValue: '商住'}
                ],
                village:[               // 社区
                    {buildlabel: '高端住宅', buildValue: '高端住宅'},
                    {buildlabel: '中端住宅', buildValue: '中端住宅'},
                    {buildlabel: '普通住宅', buildValue: '普通住宅'},
                    {buildlabel: '单体楼', buildValue: '单体楼'},
                    {buildlabel: '洋房', buildValue: '洋房'},
                    {buildlabel: '商住', buildValue: '商住'}
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
                mState: '',                // 媒体状态
                activeGrade: '',           // 媒体等级
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
                //
                industryID: '',     // 所选公司所在的行业
                planRules: {
                    planName: [
                        {validator: validateName, trigger: 'blur'},
                        {required: true, type: 'string', message: '方案名称不能为空', trigger: 'blur'},
                        {max: 30, message: '最多只能输入30个字节', trigger: 'blur'},
                    ],
                    ownerBU: [
                        {required: true, message: '请选择联系人', trigger: 'change'},
                    ],
                    ownerSales: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {validator: validateSales, trigger: 'blur'},
                    ],
                    companyName: [
                        {required: true, message: '请选择公司名称', trigger: 'change'},
                    ],
                    throwCity: [
                        {required: true, message: '请选择投放城市(可多选)', trigger: 'change'},
                    ],
                },
                shopingList: [],            // step2购物车列表
                // 购物车展示的数据
                typeShopList:[],
                activeName: '1',
                // 事件选择
                eventType: '',
                eventList: [],
                // 购物车表格数据
                shopShowList: [],
                planList: [],               //step2可选点位列表
                IsAll: false,               //当前是否为全选状态
                sessionData: '',            // 登录用户的数据
                FAData: {apID:''},          // 创建方后台返回的数据
                timeout: null,
                BDData: {uid: '0', realName: ''},
                HSearch: '',                // 获取传值显示‘清除’、‘确定’按钮
                houseNum: ['', ''],         // 表头搜索住户数量
                buildNum: ['', ''],         // 表头搜索楼栋数量
                buildPrice: ['', ''],       // 表头搜索楼盘价格
                liveYear: ['', ''],         // 表头搜索入住年份
                peopleFlow: ['',''],        // 表头搜索人流量
                carFlow : ['',''],          // 表头搜索车位数
                parkSpaceNum : ['',''],     // 表头搜索车流量
                filterData: {               // 记录判断含有哪些表头的过滤条件
                    hNum:false,
                    bNum:false,
                    bPrice:false,
                    lYear: false,
                    pFlow: false,
                    cFlow: false,
                    pSNum: false
                },
                loadSign: true,                  // table滚轮
                shopMedia_ADNum: {resNum: 0, mediaNum: 0, ADNum: 0, oneNum: 0, twoNum: 0, threeNum: 0},
                ADloading: '',                   // 创建方案、提交选点和报价单时的loading
                areaCity: [],
                activeCityData: {},             // 城市切换的数据，默认为this.city[0]
                loadScroll: true,               // 搜索后不执行滚动加载
                dateTime: '',                   // 获取今天日期
                ADLimit: [                      // step2 广告限制
                    {value: '地产', label: '地产'},
                    {value: '汽车', label: '汽车'},
                    {value: '美容', label: '美容'},
                    {value: '餐饮', label: '餐饮'},
                    {value: '食品', label: '食品'},
                    {value: '金融', label: '金融'},
                    {value: '医学', label: '医学'},
                ],
                limitName: '全部',               // 当前广告限制高亮，默认为全部
                limitList: [],                  // 当前选择的广告限制
                filterCondition: [],            // 当前过滤条件
                commentMediaADNum: [],          // 统计同一城市相同因不同排期而选择相同的asid
                mapADList: [],                  // 地图选择的点位数据
                mapParams: {},                  // 记录当前地图选点时的参数，包括排期、城市名和rid
                mapBtn: true,                   // 获取地图选点数据的按钮，默认不可点击
                getMapLoading: '',              // 获取地图选点时的loading
                // 是否导入方案
                isImport: false,
                // 文件名称列表
                fileNameTags:[],
                // 当前上传文件的数据- 表格
                fileData:[],
                // 所有上传文件的数据 - [{fileName:'',dataArr:[]}]
                TotalFileData:[],
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
                apAicode:'',                  // 方案的协同aicode
                shareADUrl: '',               // 协同选点的url https://beta.qinlinad.com/shareADList?apid=649&aicode=0DDD2685D9D3842ECB0DDC45D79D2131
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
                beOccupiedDialogVisible: false,  // 被占模态框
                beOccupiedNumber: 0,             // 第一次搜索记录时提前保存 planList
                isOccupied: true,                // 被占搜索时隐藏过滤条件
                beOccupiedAdsData: [],           // 当前点击行的被占信息{beOccupieApName:'',lState: '',schedules: ''}
                pageNo: 1,                       // 页码
                totalPage: 1,                    // 总页数
                getAdsParamsData: {},            //　获取点位列表的参数data
                apMinTime: '',                   // 方案创建的开始时间
                ADLimitActiveName: '1',
                isShowAll: false,                // 控制表头显示时的过渡效果
                searchBtnAbled: false,           // 搜索按钮禁止
                isCityPrice: false,              // 判断城市最大价格是否大于2000w
                connectAdDialogVisible: false,   // 连排门模态框
                ActiveConnectADList:{},          // 购物车 - 当前点击行的连排门信息
                mediaLevelNum:{ALevel: 0, BLevel: 0, CLevel: 0,ANum:0,BNum:0},
                saleManageLevel: 0,              // 销售权限 0地方销售 1全国销售
                asrIDList: [],                   // 已选点位里存在的公司及城市
                indexData: '',                   // 首页来源的数据-前置地图选点
                unfinishedData: '',               // 未完成方案信息
                /*方案排斥*/
                activeSelect: '1',                 //
                rejectAdPlan: [],                  // 排斥方案选项
                activeAdPlan: '',                 // 当前选择的方案
                routePath: '',
            };
        },
        mounted() {
            console.log('limitList',this.limitList,'buildValue',this.buildValue)
            this.getsessionData()   // 获取session中的数据
            this.areaCity = areaArr.cityArea()
            this.getADLimit()       // 获取广告限制列表
            // 设置购物车动画起点位置
            this.setShopAnimate()
            // 获取未完成的方案并填充
            this.routePath = this.$route.fullPath
            if (this.routePath.indexOf('unfinishedPlan') !== -1) {
                this.setPlanInfo()
            }
            console.log('this.cityOptions', this.cityOptions)
        },
        directives: {
            loadmore: {
                bind: function (el, binding) {
                    const selectWrap = el.querySelector('.el-table__body-wrapper')
                    selectWrap.addEventListener('scroll', function () {
                        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
                        if (scrollDistance <= 150) {
                            binding.value()
                        }
                    })
                }
            }
        },
        computed: {
            nowPointNum() {
                if(this.dialogTableVisible){
                    this.resetConnectAdData()
                    this.computeConnectAdData()
                }
                // 当购物车点位数大于0时
                if(this.shopingList.length){
                    this.saveApInfo()
                }
                return this.shopingList.length
            },
        },
        methods: {
            //监听table滚动
            loadMore() {
                if (this.loadScroll) {
                    this.loadScroll = false
                    if(this.pageNo <= this.totalPage){
                        this.getAdsParamsData.pageNo = this.pageNo
                        this.getAdList()
                    }
                } else {
                    console.log('此时为搜索出来的数据')
                }
            },
            // 获取浏览器session数据
            getsessionData() {
                this.sessionData = JSON.parse(sessionStorage.getItem('session_data'))
                let sess = this.sessionData;
                if((sess.uType == 'BD' && sess.saleManageLevel == 1) || (sess.uType == 'MD' && sess.mediaManageLevel == 1)){
                    this.isShowHalfYear = true;
                }
                console.log('sessionData', this.sessionData)
                if (this.sessionData.uType === 'BD') {
                    this.BDData.realName = this.sessionData.realName // username
                    this.planForm.ownerSales = this.BDData.realName
                    this.BDData.uid = this.sessionData.uID
                    this.saleManageLevel = this.sessionData.saleManageLevel
                    this.isBD = true
                    this.getCityList()      // 获取权限下的城市列表
                    this.Get_cName()
                } else {
                    this.isBD = false
                }
                this.dateTime = timeFormat.returnDayCount(0,'/')
                let starTime, endTime
                starTime = timeFormat.returnDayCount(1,'/')
                endTime = timeFormat.returnDayCount(14,'/')
                this.dateInput = [starTime, endTime]                // 设置默认时间
                this.beforeDate = [starTime, endTime]
                // 判断是否来至于首页的前置地图选点
                let inputPath = this.$route.fullPath
                if (inputPath.indexOf('from=index') !== -1) {
                    this.setDataByIndex()
                }
                console.log('this.dateInput',this.dateInput)
            },
            // 动态设置购物车动画起点位置
            setShopAnimate(){
                // 注：window.onresize只能在项目内触发1次
                let that = this
                // 实时监控body的宽带。注：修改该方法后要重启项目并重新打开页面
                window.onresize = function windowResize() {
                    // 通过捕获系统的onresize事件触发我们需要执行的事件
                    that.bodyWidth = document.body.offsetWidth
                    that.shopXY.x = that.bodyWidth - 170;
                    shopAnimate.style.right = that.shopXY.x + 'px'
                }
                let Right = document.body.offsetWidth - 835
                this.shopXY.x = Right
                let shopAnimate = document.getElementsByClassName('shopAnimate')[0]
                shopAnimate.style.right = this.shopXY.x + 'px'
            },
            // 跳转来源于首页地图选点-设置部分默认数据
            setDataByIndex(){
                this.indexData = JSON.parse(sessionStorage.getItem('indexData'))
                // this.mapADList = this.indexData.mapADList
                this.dialogTableVisible = true
                if(this.saleManageLevel == 1){
                    this.selectedOptions = [this.indexData.rid.toString().substring(0,4)+ '00',this.indexData.rid]
                    this.throwCity.push({
                        value: this.indexData.rid,
                        label: this.indexData.city
                    })
                    this.dynamicTags.push(this.indexData.city);
                }else{

                }
                this.planForm.throwCity.push(this.indexData.rid)
            },
            // 获取权限下的城市列表
            getCityList(){
                // if (this.saleManageLevel == 1 && this.sessionData.authorCity == '0') {
                //     this.cityOther = true
                //     this.cityOptions = areaArr.province()
                // } else {
                    this.cityOther = false
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token
                    }
                    if(!this.isBD){
                        params.suID = this.BDData.uid
                    }
                    api.getApi(this.Advertisement + '/GetFanganCity', params).then(res => {
                        console.log('获取权限下的城市列表', res.data)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            this.loginTimeout()       // 登录超时
                        } else if(res.data.SysCode === 100200 || res.data.MSG === '该用户暂未分配公司！'){
                            this.messageFun('warning','该用户暂未分配公司')
                        } else {
                            if (res.data !== '' && res.data !== null) {
                                let resData = res.data
                                let cityList = []
                                for (let j = 0; j < resData.length; j++) {
                                    let cityObj = {
                                        label: resData[j].rName,
                                        value: resData[j].rID.toString(),
                                    }
                                    cityList.push(cityObj);
                                }
                                this.throwCity = cityList
                                console.log('cityList', cityList)
                                this.cityOptions = areaArr.province()
                            } else {
                                this.messageFun('warning','城市数据获取异常')
                            }
                        }
                    })
                // }
            },
            // 下一步
            next() {
                console.log('planForm', this.planForm)
                if (this.active === 0) {
                    console.log('this.dynamicTags', this.dynamicTags)
                    this.submitForm('planForm')
                } else if (this.active === 1) {
                    if (this.shopingList.length !== 0) {
                        this.active++
                        this.getAsNameByShopingList()     // 统计购物车中存在了几个公司及城市
                        this.creatTab()                 // 报价单tab
                        this.getBand()                  // 获取公司品牌
                    } else {
                        this.messageFun('warning','请选择点位')
                    }
                } else if (this.active === 2) {
                    this.isCityPrice = false
                    this.vaildCityQuotation()
                    // console.log('this.isCityPrice',this.isCityPrice)
                    if (!this.isCityPrice) {
                        this.ADloading = this.$loading({
                            lock: true,
                            text: '加急创建中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        this.creatAdPlan()    // 创建方案 当前价格大于系统支持的最大价格
                    } else {
                        this.messageFun('warning','单城市总价格大于系统支持的最大价格（2000万）')
                    }

                }
                if (this.active > 3) {
                    this.active = 0;
                }
            },
            // 上一步
            prev() {
                if (this.active < 1) {
                    this.active = 0;
                }else {
                    this.active--;
                }
            },
            // 第一步的取消按钮
            clearData() {
                this.$router.push("./planList");
            },
            // 确认导出空位
            downEmptyPoint(){
                if(this.dateType == '1'){
                    this.exportExcelData();
                }else{
                    if(this.emptyRange.length){
                        this.dateRangeEmpty();
                    }else{
                        this.messageFun('warning','请先选择日期')
                    }
                }
            },
            // 导出时间段的空位
            dateRangeEmpty(){
                let loadingPoint = this.$loading({
                    lock: true,
                    text: '玩命加载中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let rid = this.planForm.throwCity.join(',');
                console.log(this.emptyRange, rid);
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    rIDs: rid,
                    startTime: this.emptyRange[0],
                    endTime: this.emptyRange[1],
                };
                api.postApi(this.Advertisement+'/ExportSpareRes', info).then(res =>{
                    console.log(res.data);
                    if(!res.data.SysCode){
                        if(res.data.length){
                            let returnobj = this.formatData(res.data);
                            let head = [ '省份', '城市', '区域', '资源名称','商圈', '地址', '媒介载体', '楼栋数量', '住户数量', '楼盘价格', '楼盘类型', '入住时间', '车位数', '车流量', '人流量', '广告限制', '点位备注', '媒体数量(面)'];
                            let allHead = head.concat([info.startTime+'-'+info.endTime]);
                            let filename = returnobj.city.join('-')+'-'+ info.startTime+'~'+info.endTime+'空位表';
                            sheetExcel.toDownload(allHead, returnobj.arr, filename);
                        }else{
                            this.messageFun('warning','此城市没有点位')
                        }
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        this.messageFun('warning',res.data.MSG)
                    }
                    loadingPoint.close();
                }).catch(err =>{
                    console.log(err);
                    loadingPoint.close();
                });
            },
            // 导出空点格式化数据
            formatData(arr){
                let returnObj  = {
                    city: [],
                    arr: ''
                };
                let result = [];
                for(let data of arr){
                    let resObj = {
                        sheetName: this.getCityName(data.rID),
                        showList: [],
                    };
                    returnObj.city.push(resObj.sheetName);
                    let dataArr = data.adDoor.concat(data.barrier);
                    for(let item of dataArr){
                        let obj = {
                            province: item.prName|| '--',
                            city: item.crName || '--',
                            rName: item.rName || '--',
                            resName: item.resName || '--',
                            tradingArea: item.tradingArea || '--',
                            resAddress: item.resAddress || '--',
                            mVehicle: item.mVehicle,
                            fNum: item.fNum || '--',
                            hNum: item.hNum || '--',
                            hPrice: item.hPrice/100,
                            cType: item.cType || '--',
                            chDay: item.chDay || '--',
                            carFlow: item.carFlow || '--',
                            parkSpaceNum: item.parkSpaceNum ||'--',
                            peopleFlow: item.peopleFlow || '--',
                            notPush: item.allNotPush || '--',
                            remark: item.allremark || '--',
                            adsNum: item.adsNum || 0,
                            [this.emptyRange[0]+'-'+this.emptyRange[1]]: item.DateInfo.adsNum || 0
                        };
                        resObj.showList.push(obj);
                    }
                    result.push(resObj);
                }
                returnObj.arr = result;
                return returnObj;
            },
            // 获取城市中文名称
            getCityName(rid){
                let str = '';
                for(let data of this.throwCity){
                    if(data.value == rid){
                        str = data.label;
                        break;
                    }
                }
                return str;
            },
            // 导出空位表
            exportEmpty(){
                if(this.planForm.throwCity.length){
                    this.showEmptyPoint = true;
                }else{
                    this.messageFun('warning','请先选择投放城市')
                }
            },
            /*step1*/
            // 导出数据
            exportExcelData: function(){
                // this.planForm.throwCity = [110100, 440100];
                if(this.planForm.throwCity.length){
                    let loadingPoint = this.$loading({
                        lock: true,
                        text: '玩命加载中...',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    let dateArr = [];
                    let self=this;
                    let request_times=self.planForm.throwCity.length; //计算分几次请求
                    let funcs=[]; //Promise.all要用到的参数, 存放每次请求的Promise对象

                    for (let i=0; i<request_times; i++) { // 循环请求次数，构造请求的Promise对象并插入funcs数组
                        let func=new Promise(function(resolve, reject){ //定义Promise并处理请求逻辑
                            let data=[];
                            self.$http.get(
                                'https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/cityRes/'+self.planForm.throwCity[i]+'.json'
                            ).then(function(response){
                                console.log('response----', response.data);
                                if (!response.data.SysCode) {
                                    if(response.data.length){
                                        let dataArr = response.data;
                                        data.push(dataArr);
                                        resolve(data);
                                    }else{
                                        resolve('');
                                    }
                                } else {
                                    resolve('');
                                }
                            }).catch(function(error) {
                                resolve('');
                            });
                        });
                        funcs.push(func);
                    }

                    Promise.all(funcs).then(function(values){ //使用Promise.all调用funcs里面的函数，并合并数据，最后给js-xlsx生成Excel
                        let resultValus = [];
                        for(let val of values){
                            if(val){
                                resultValus.push(val);
                            }
                        }
                        if(resultValus.length){
                            let returnobj = self.hasPointData(resultValus);
                            console.log('returnobj----', returnobj);
                            let date = returnobj.date;
                            let head = [ '省份', '城市', '区域', '资源名称','商圈', '地址', '楼栋数量', '住户数量', '楼盘价格', '楼盘类型', '入住时间', '广告限制', '点位备注', '媒体数量(面)'];
                            let allHead = head.concat(date);
                            let filename = returnobj.filename+'-'+ date[0].substring(0, 10)+'~'+date[date.length-1].substring(11)+'空位表';
                            sheetExcel.toDownload(allHead, returnobj.arr, filename);
                        }else{
                            this.messageFun('warning','此城市没有点位')
                        }
                        loadingPoint.close();
                    });
                }else{
                    this.messageFun('warning','请先选择投放城市')
                }
            },
            // 处理数据
            hasPointData(arr){
                let returnObj = {
                    arr: '',
                    date: '',
                    filename: ''
                };
                let result = [];
                let allDateArr = [];
                let filenameArr = [];
                for(let data of arr){
                    let resObj = {
                        sheetName: data[0][0].crName,
                        showList: [],
                    };
                    filenameArr.push(resObj.sheetName);
                    for(let k = 0, kLen = data.length; k < kLen; k++){
                        for(let item of data[k]){
                            let dateArr = [];
                            let dataStr = [];
                            let obj = {
                                province: item.prName,
                                city: item.crName,
                                rName: item.rName,
                                resName: item.resName,
                                tradingArea: item.tradingArea,
                                resAddress: item.resAddress,
                                fNum: item.fNum,
                                hNum: item.hNum,
                                hPrice: item.hPrice/100,
                                cType: item.cType,
                                chDay: item.chDay,
                                notPush: item.allNotPush || '',
                                remark: item.allremark || '',
                                adsNum: item.adsNum,
                            };
                            let showData = item.DateInfo.sort(this.sortDate);
                            for(let date of showData){
                                dateArr.push(timeFormat.toDate(date.starDate, '/')+'-'+timeFormat.toDate(date.endDate, '/'));
                                dataStr.push(date.adsNum);
                            }
                            let dateObj = this.concatObj(dateArr, dataStr);
                            let resultObj = Object.assign(obj, dateObj);
                            resObj.showList.push(obj);
                            if(k >= kLen-1){
                                allDateArr = dateArr;
                            }
                        }
                    }
                    result.push(resObj);
                }
                returnObj = {
                    arr: result,
                    date: allDateArr,
                    filename: filenameArr.join('-'),
                };
                return returnObj;
            },
            // 键转换为值
            concatObj(dateArr, dataStr){
                let obj = {};
                for(let dateI = 0, dateLen = dateArr.length; dateI < dateLen; dateI++){
                    obj[dateArr[dateI]] =  dataStr[dateI];
                }
                return obj;
            },
            // 时间比较
            sortDate(a, b){
                let aDate = timeFormat.toDate(a.starDate, '');
                let bDate = timeFormat.toDate(b.starDate, '');
                return aDate - bDate;
            },
            // 导入方案弹出框
            importFanan(){
                this.isImport = true;
                this.fileData = [];
                this.fileNameTags = [];
            },
            // 自定义上传
            uploadFile(params){
                this.fileData = [];
                this.fileNameTags = [];
                console.log(params);
                let fileObj = params.file;
                this.fileData.push(fileObj);
                this.fileNameTags.push(params.file.name);
            },
            // 删除tag文件
            tabCloseFun(data, index){
                console.log('file---name', data);
                this.fileNameTags = [];
                this.fileData = [];
            },
            // 确认上传
            submitUpload(){
                if(this.fileData.length){
                    let formData = new FormData();
                    formData.append('file', this.fileData[0]);
                    formData.append('rids', this.planForm.throwCity.join(','));
                    // formData.append('suid', this.BDData.uid);
                    // 上传文件
                    api.postUpload_file(this.doUpload+'?uid='+this.sessionData.uID+'&token='+
                        this.sessionData.token+'&suid='+this.BDData.uid, formData).then(res =>{
                        if(!res.data.SysCode){
                            let importInfo = res.data;
                            this.importInfoData = res.data;
                            if(importInfo.successList.length){
                                this.setShopDataByImport(importInfo.successList);
                            }
                            if(importInfo.errorList.length){
                                this.excelDataUpload = this.checkPointFun(importInfo);
                                this.excelObj = {
                                    successNum: importInfo.successList.length,
                                    failNum: importInfo.errorList.length
                                };
                                this.showUploadFail = true;
                            }
                        }else if(res.data.SysCode == 100302){
                            this.loginTimeout();
                        }else{
                            this.messageFun('warning',res.data.MSG)
                        }
                    }).catch(res =>{
                        console.log(res);
                    });
                }
            },
            // 根据导入方案返回的数据,设置购物车所需要的数据格式
            setShopDataByImport(arr){
                console.log('方案导入返回的数据---', arr);
                // let j = 0
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
                            importInfo.asID = importInfo.asIDs.toString().split(',');
                            this.isHaveDiffPush(importInfo);
                            break;
                        }
                    }
                    // j++
                }
                console.log('this.shopingList1----', this.shopingList);
                Message.success('成功导入'+arr.length+'条数据');
                this.isImport = false;
                this.computeMedia_AD()
                this.judgeByselect()
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
                    };
                    resultarr.push(item);
                }
                return resultarr;
            },
            // 导出有问题的点
            downLoadExcel(){
                let arr = this.questionPoint(this.excelDataUpload, this.importInfoData.successList);
                let allHead = ['资源名称',	'市', '区',	'媒介载体', '媒体名称', '投放面', '资产编号', '投放排期'];
                sheetExcel.toDownload(allHead, arr, this.planForm.planName+'问题点位表');
            },
            // 导入excel后台返回的问题点位
            questionPoint(arr, successArr){
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
                    };
                    resultarr[1].showList.push(obj);
                }
                return resultarr;
            },
            // 第四步的导出方案
            downLoadFanan(){
                let arr = this.excelData(this.shopingList)
                let allHead = ['资源名称',	'市', '区', '商圈',	'资源地址',	'楼盘价格',	'入住年份',	'住户数量',	'出入口', '楼栋数量', '楼盘（写字楼）类型',	'地图中心点', '可选面数' ,'投放排期'];
                let head = ['在线协同选点链接(可地图查看社区)  '+this.shareADUrl, '', '', '', '', '', '', '', '', '', '', '', ''];
                sheetExcel.toDownload(allHead, arr, this.planForm.planName+'点位表', head);
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
            // 导出空位
            downEmpty(){
                console.log('this.planForm.throwCity----', this.planForm.throwCity);
                if(this.planForm.throwCity.length){
                    let  rID = this.planForm.throwCity.join(',');
                    this.downUrl = window.location.origin+'/emptyPoint?rid='+rID;
                    console.log('downUrl-----', this.downUrl);
                    this.showEmpty = true;
                }else{
                    this.messageFun('warning','请先选择投放城市')
                }
            },
            // 复制空位导出链接
            copyUrlDown(){
                let Url = document.getElementById("shareDownUrl").innerText;
                console.log('url', Url)
                let oInput = document.createElement('input');
                oInput.value = Url;
                document.body.appendChild(oInput);
                oInput.select();                // 选择对象
                document.execCommand("Copy"); // 执行浏览器复制命令
                oInput.style.display = 'none';
                this.messageFun('success','复制成功')
            },
            // step1投放城市权限是全国时spliceCity、showInput、handleInputConfirm
            spliceCity(tag) { // step1方案创建,删除选择城市
                if(this.indexData.city.includes(tag)){
                    this.messageFun('warning',tag + '为地图选择所在城市，不可删除')
                    return
                }
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                let city_arr = this.cityOptions
                for (let i = 0; i < city_arr.length; i++) {       // 遍历城市查找城市名对应的rid，用于删除勾选的城市
                    for (let j = 0; j < city_arr[i].children.length; j++) {
                        if (city_arr[i].children[j].label === tag) {
                            let city_rid = city_arr[i].children[j].value
                            for (let n = 0; n < this.planForm.throwCity.length; n++) {
                                if (city_rid === this.planForm.throwCity[n]) {
                                    for (let t = 0; t < this.throwCity.length; t++) {
                                        if (city_rid === this.throwCity[t].value) {
                                            this.throwCity.splice(t, 1)
                                        }
                                    }
                                    this.planForm.throwCity.splice(n, 1)
                                }
                            }
                        }
                    }
                }
            },
            // 非全国，移除城市
            removeCity(val){
                console.log('非全国，移除城市val',val,this.planForm.throwCity)
                if (this.indexData.rid == val) {
                    this.messageFun('warning',this.indexData.city + '为选择的地图点位所在城市，不可删除')
                    this.planForm.throwCity.push(val)
                    this.$refs['planThrowCity'].clearValidate()
                }
            },
            //step1 城市投放
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 选择投放城市
            handleInputConfirm() {
                let inputValue = this.selectedOptions;
                // console.log('********',inputValue)
                if (inputValue) {
                    let cityArr = this.cityOptions
                    for (let i = 0; i < cityArr.length; i++) {
                        if (cityArr[i].value == inputValue[0]) {
                            let childArr = cityArr[i].children
                            for (let j = 0; j < childArr.length; j++) {
                                if (childArr[j].value == inputValue[1]) {
                                    if (this.dynamicTags.indexOf(childArr[j].label) === -1) {
                                        this.dynamicTags.push(childArr[j].label);
                                        this.planForm.throwCity.push(inputValue[1])
                                        let cityObj = {
                                            label: childArr[j].label,
                                            value: inputValue[1],
                                        }
                                        this.throwCity.push(cityObj)
                                        console.log('this.throwCity',this.throwCity)
                                        console.log('this.selectedOptions',this.selectedOptions)
                                        this.inputVisible = false;
                                        this.selectedOptions = [];
                                        break
                                    } else {
                                        this.messageFun('warning','不可以选择重复的城市')
                                    }
                                }
                            }
                            break
                        }
                    }
                }
            },
            // 登录用户为媒介输入销售用户名去获取该销售的信息以便获取接下来的城市、公司、品牌、投放城市等信息
            querySearchAsync(queryString, callback) {
                let uid = this.sessionData.uID
                if (queryString) {
                    let params = {
                        uid: uid,
                        token: this.sessionData.token,
                        sname: queryString
                    }
                    api.postApi(this.UCAPI+'/GetUserName', params).then(res => {
                        console.log('GetUserName', res)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            this.loginTimeout()
                        } else {
                            console.log('媒介销售信息', this.BDData)
                            if (res.data.uID) {
                                this.BDData.uid = res.data.uID
                                this.saleManageLevel = res.data.saleManageLevel || 0
                                console.log('GetUserName数据包', res.data)
                                res.data.value = res.data.realName;
                                this.BDData.realName = res.data.realName
                                this.planForm.ownerSales = res.data.realName
                                // this.BDuWho = res.data.uWho
                                // 重新输入账号时，初始化部分数据
                                this.planForm.companyName = ''
                                this.planForm.companyBrand = ''
                                this.planForm.ownerBU = ''
                                this.planForm.throwCity = []
                                this.dynamicTags = []
                                this.throwCity = []
                                this.getCityList()
                                this.Get_cName()
                                let results = [res.data];
                                clearTimeout(this.timeout)
                                this.timeout = setTimeout(() => {
                                    callback(results);
                                }, 1000 * Math.random());
                            } else {
                                this.BDData.uid = '0'
                                this.messageFun('warning',res.data.MSG)
                            }
                        }

                    });
                }
            },
            //获取公司名称列表MyCustomer
            Get_cName() {
                // 公司信息所在城市
                let params = {
                    uid: this.BDData.uid,
                    token: this.sessionData.token
                }
                api.getApi(this.Advertisement + '/MyCustomer', params).then(res => {
                    console.log('MyCustomer:', res.data)
                    let customerList = res.data
                    this.customer = res.data    //保存所有信息，方便后面的过滤使用
                    let companyList = []      // 公司名称
                    let ownerList = []      // 联系人
                    for (let i = 0; i < customerList.length; i++) {
                        // console.log('公司名称',i,customerList[i].cName)
                        let companyObj = {
                            label: customerList[i].cName,
                            value: customerList[i].cID,
                        }
                        let owner = {
                            label: customerList[i].realName,
                            value: customerList[i].uID,
                        }
                        ownerList.push(owner)
                        if (i == 0) {
                            companyList.push(companyObj)
                        } else if (JSON.stringify(companyList).indexOf(JSON.stringify(companyObj)) === -1) { //判断是否有重复的公司JSON.stringify(companyObj)
                            companyList.push(companyObj)
                        }
                    }
                    this.companyName = companyList  // 公司名称列表
                    this.ownerBU = ownerList // 联系人列表
                })
            },
            // 获取公司品牌
            GetBrandByCid(val) {
                this.planForm.companyBrand = ''
                this.planForm.ownerBU = ''
                console.log('所选公司的ID', val)
                let cidParams = {
                    cid: val,
                    token: this.sessionData.token
                }
                api.getApi(this.Advertisement +'/GetBrand', cidParams).then(res => {
                    console.log('公司品牌', res.data)
                    let CBrand = res.data
                    let BrandList = []
                    for (let i = 0; i < CBrand.length; i++) {
                        let brandObj = {
                            label: CBrand[i].bTitle,
                            value: CBrand[i].bID
                        }
                        BrandList.push(brandObj)
                    }
                    this.companyBrand = BrandList
                })
                // 选择公司后过滤联系人列表customer
                let customerList = this.customer
                let ownerList = []   // 联系人
                for (let j = 0; j < customerList.length; j++) {
                    if (customerList[j].cID == val) {
                        let owner = {
                            label: customerList[j].realName,
                            value: customerList[j].uID,
                        }
                        ownerList.push(owner)
                    }
                }
                this.ownerBU = ownerList
            },
            // 获取公司及品牌
            getBand() {
                for (let n = 0; n < this.companyName.length; n++) {
                    if (this.companyName[n].value === this.planForm.companyName) {
                        this.cName = this.companyName[n].label
                    }
                }
                for (let n = 0; n < this.companyBrand.length; n++) {
                    if (this.companyBrand[n].value === this.planForm.companyBrand) {
                        this.cBand = this.companyBrand[n].label
                    }
                }
            },
            // 表单验证
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('表单验证this.throwCity',this.throwCity)
                        // 初始化
                        this.initStep2Data()
                        this.active++
                        // 设置城市及对应的区域
                        this.getAreaFun()
                        this.getAdsParamsData = {
                            prID: this.city[0].rid,
                            rid: '440100',
                            act: 1,
                            // dateTimeBegin: this.dateInput[0],
                            // dateTimeEnd: this.dateInput[1],
                            resType: this.recType,
                            mVehicle: this.mediaType,
                            pageNo: this.pageNo,
                            pageSize: 50,//
                        }
                        this.getAdList()            // 获取选点列表
                        this.getRejectPlanList()    // 获取排斥方案列表
                        this.getIndustryBycID()     // 根据所选公司获取公司所属行业
                        // 地图选点前置跳转而来，则直接显示购物车及其地图选择的点位
                        if(this.indexData !== ''){
                            this.mapParams = {
                                rid: this.indexData.rid,
                                city: this.indexData.city,
                                ls: this.indexData.dateInput[0],
                                le: this.indexData.dateInput[1]
                            }
                            this.mapBtn = false
                            // this.getMapADList()
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                });
            },
            // 初始化step2的数据
            initStep2Data(){
                this.loadScroll = true
                this.recType = 1
                this.pageNo = 1
                this.planList = []
                this.activeIndex = 0
                this.activeRName = ''            //step2当前选中的城市名称
                this.areaName = '全市'           // step2当前选中的区域
                this.mediaType = '广告门'
                let inputPath = this.$route.fullPath
               if(inputPath.indexOf('unfinishedPlan') !== -1){
                    // this.unfinishedData.planData.throwCity
                   console.log('缓存方案再编辑',this.unfinishedData.planData)
                    let arr = []
                    for(let key of this.shopingList){
                        if(this.unfinishedData.planData.baseInfo.throwCity.includes(key.rid)){
                            arr.push(key)
                        }
                    }
                   this.shopingList = arr
                }else{
                   this.shopingList = []           // 购物车
               }
                this.limitList = []             // 初始化广告限制
                this.filterCondition = []       // 过滤条件tag
                this.mState = ''                // 媒体状态
                this.buildValue = ''            // 楼盘类型
                for(let i in this.filterData){
                    this.filterData[i] = false
                }
                this.IsAll = false
            },
            /*step2*/
            // 获取排斥方案选择列
            getRejectPlanList(){
                let params = {
                    uid:this.sessionData.uID,
                    token: this.sessionData.token,
                    sales_user: this.BDData.uid
                }
                api.getApi(this.Advertisement + '/getSalesProject', params).then(res => {
                    console.log('销售所属方案',res)
                    if (res.data.SysCode == 200200) {
                        let resData =  res.data.data
                        let tempList = []
                        for(let key of resData){
                            tempList.push({
                                value: key.apId,
                                label: key.apName + '--' + key.cname + '--' + key.apcTime
                            })
                        }
                        this.rejectAdPlan = tempList
                    } else if (res.data.SysCode == 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else {
                        this.messageFun('warning',res.data.MSG)
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
                api.postApi_new(this.Media, params).then(res => {
                    console.log('广告限制列表', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if(res.data.SysCode === 200200 ){
                        let limit = res.data.data
                        let limitArr = []
                        for (let i = 0; i < limit.length; i++) {
                            let limitObj = {value: limit[i].nTitle, label: limit[i].nTitle}
                            limitArr.push(limitObj)
                        }
                        this.ADLimit = limitArr
                    }
                })
            },
            // 获取行业id
            getIndustryBycID(){
                for(let key of this.customer){
                    if(key.cID === this.planForm.companyName){
                        this.industryID = key.piID
                        break
                    }
                }
            },
            // 设置城市区域
            getAreaFun() {
                this.area = []
                let throwCityList = this.planForm.throwCity
                let cityArr = []
                for (let j = 0; j < throwCityList.length; j++) {
                    for (let t = 0; t < this.throwCity.length; t++) {
                        if (this.throwCity[t].value === throwCityList[j]) {
                            let cityObj = {rName: this.throwCity[t].label, rid: this.throwCity[t].value}
                            cityArr.push(cityObj)
                        }
                    }
                    if (j >= throwCityList.length - 1) {
                        console.log('cityArr',cityArr)
                        this.city = cityArr
                        this.city.sort(this.compareFun)
                        console.log('this.city ', this.city)
                        this.activeCityData = this.city[0]    // 设置初始选中城市信息
                        this.activeRName = this.activeCityData.rName
                        for (let n = 0; n < this.city.length; n++) {
                            let rid = this.city[n].rid.toString()
                            console.log('投放城市rid', rid)
                            let provinceRid = rid.substring(0, 2) + '0000'
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
                                }
                            }
                        }
                    }
                }
            },
            // 获取广告点位列表
            getAdList() {
                console.log('当前页码',this.pageNo,'当前时间',this.dateInput)
                this.loading = true
                this.getAdsParamsData.dateTimeBegin = this.dateInput[0]
                this.getAdsParamsData.dateTimeEnd = this.dateInput[1]
                this.getAdsParamsData.pageNo = this.pageNo
                this.getAdsParamsData.uid = this.BDData.uid
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
                let timer = setTimeout(() => {        // setTimeout 异步让table出现loading
                    api.postApi_new(this.Media, params).then(res => {
                        console.log('选点列表：', res)
                        if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                            this.loginTimeout()       // 登录超时
                        } else if (res.data.SysCode === 200200) {
                            if (res.data.data.list !== undefined && res.data.data.list.length > 0) {
                                let ADList = res.data.data.list
                                this.setTableDataADDoor(ADList)
                                this.totalPage = res.data.data.totalPage
                                this.pageNo++
                                console.log(' this.pageNo++', this.pageNo)
                                this.judgeByselect()
                                this.searchBtnAbled = false
                            } else {
                                this.planList = []
                            }
                            this.loading = false
                        } else {
                            this.messageFun('warning',res.data.MSG)
                            this.loading = false
                        }
                        this.searchBtnAbled = false
                    })
                    clearTimeout(timer)
                },0)
            },
            // 接口数据转成table
            setTableDataADDoor(ADSdata){
                console.log('接口数据转成table当前时间',this.dateInput)
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
                        mVehicle: key.mVehicle,       // 媒体类型
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
                        mediaLevel: key.grade || '',        // 媒体等级
                        asName: key.asName,                 // 点位所属公司名称
                        asrID: key.asrID,                   // 所属公司id
                        checkBox: {A: false, B: false,ABC:false},
                        box: {A: false, B: false},
                    }
                    // 点位价格
                    if (key.mVehicle === '道闸') {
                        adObj.adPrice = key.asPrice / 100
                    } else {
                        if (key.asPrice) {
                            adObj.adPrice = key.asPrice / 700
                        } else {
                            adObj.adPrice = 0
                        }
                    }
                    // A/B面
                    if (key.asLabs.indexOf('A') === -1) {
                        adObj.box.A = true
                    }
                    if (key.asLabs.indexOf('B') === -1) {
                        adObj.box.B = true
                    }
                    // 点位状态
                    if (key.adlInfo !== null && key.adlInfo !== undefined && key.adlInfo.length > 0) {
                        let arr = []
                        for (let akey of key.adlInfo) {
                            if (akey.asState) {
                                arr.push({
                                    asState: akey.asState
                                })
                            } else {
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
                this.searchBtnAbled = true
                console.log('搜索排期时间', this.dateInput)
                this.areaName = '全市'
                if(this.selectValue === '被占查询'){
                    this.loadScroll = false
                    //    this.isOccupied = false     // 被占搜索时隐藏过滤条件
                    this.beOccupiedGetList()    // 获取被占列表接口
                    this.beOccupiedNumber ++
                }else{
                    this.loadScroll = true
                    this.isOccupied = true      //  || this.dateInput !== this.beforeDate
                    if (this.searchInput !== '' && this.dateInput !== null) {
                        this.setPageNoAndTableData()
                        this.ResOriginSearch()
                    }else if(this.searchInput === '' && this.dateInput !== this.beforeDate && this.dateInput !== null){
                        this.setPageNoAndTableData()
                        this.getAdList()
                        this.beforeDate = this.dateInput
                    }else if(!this.dateInput){
                        this.messageFun('warning','搜索时间不能为空')
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
                    this.setPageNoAndTableData()
                    this.getAdList()
                }
            },
            //  查询被占点位
            beOccupiedGetList(){
                let starTime = this.dateInput[0]
                let endTime = this.dateInput[1]
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    rn: this.searchInput,
                    ls: starTime.split(".").join(""),
                    le: endTime.split(".").join(""),
                }
                console.log('参数',params)
                api.postApi(this.Advertisement + '/GetResAdplanInfo',params).then(res=>{
                    console.log('查询被占点位',res)
                    this.isOccupied = false    // 被占搜索时隐藏过滤条件
                    let dataArr = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时'){
                        this.loginTimeout()
                    }else{
                        if (res.data === '' || res.data === null ||  res.data.length <= 0){
                            this.planList = []
                            this.messageFun('warning','暂无该小区被占信息')
                        }else{
                            let arr = []
                            for(let key of dataArr){
                                let AD_data = {
                                    mID: key.mID,
                                    resType: key.resType,
                                    resID: key.resID,
                                    asIDs: key.asID,
                                    asLabs: key.asLab,
                                    resName: key.resName,
                                    city: key.cityName, //'广州',
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
                    }
                    this.searchBtnAbled = false
                })
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
                    token:this.sessionData.token,
                    uid: this.sessionData.uID,
                    rid: rid,
                    act: 1,
                    ls: this.dateInput[0],
                    le: this.dateInput[1],
                    suID: this.BDData.uid,
                    apId: this.activeAdPlan
                }
                if(params.apId === ''){
                    delete params.apId
                }
                console.log('生成地图MapID参数', params)
                let tempwindow = window.open()
                api.getApi(this.Map +'/GetMapInfo', params).then(res => {
                    console.log('GetMapInfo地图mapid返回的信息', res)
                    if (!res.data.SysCode) {
                        let mapid = res.data.MapID
                        this.mapBtn = false
                        this.dialogVisible()
                        // tempwindow.location = 'https://www.dituwuyou.com/qinlin/embed?mid=FPcrNHyq3xXFZDbqlTyHKA&token=fp3nxsKCYZzOSnU0KosEq0GA1o1qcKh5XLA&mapid=' + mapid
                        tempwindow.location = this.wuYouMap + mapid + '&city=' + this.activeRName + '&flag=' + true
                    } else {
                        tempwindow.close()
                        if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                            this.loginTimeout()       // 登陆超时
                        } else {
                            this.messageFun('warning',res.data.MSG + ',请尝试重新点击')
                        }
                    }
                }).catch(err => {
                    console.log('error', err)
                })
            },
            // 模态框中的确认按钮
            oneKeyPointBtn(item){
                let IsBoolean = false
                this.$refs[item].validate((valid) => {
                    if (valid) {
                        IsBoolean = true
                    } else {
                        return false;
                    }
                })

                if(IsBoolean){
                    if(Number(this.oneKeyPointData.TotalPoint) < Number(this.oneKeyPointData.pointNumByRes)){
                        this.messageFun('warning','每小区选择的个数不能大于点位总量')
                    }else{
                        this.oneKeySelectPoint()
                    }
                }else{
                    this.messageFun('warning','信息填写有误')
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
                    apId: this.activeAdPlan
                }
                if(this.selectValue === '商圈'){
                    params.ta = this.searchInput
                }
                // 过滤地区rID
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
                api.postApi(this.Advertisement + '/AutoSetAdS', params).then(res=>{
                    console.log('一键选点',res.data)
                    IsXhr = true
                    let tempArr = []
                    let resArr = res.data
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    }else if(resArr !== '' && resArr.length > 0){
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
                                mediaName: key.mTitle,
                                buildNum: key.fNum,
                                schedules: this.dateInput[0] + '-' + this.dateInput[1],
                                tradingArea: key.tradingArea,
                                assetTag: key.assetTag,
                                liveYear: key.chDay,
                                adLimit: key.notPush,
                                mapCenter: '',      // 地图中心点name
                                address: key.resAddress || '',
                                dNum: key.dNum || '',       // 出入口数
                                A_B: key.asLab,
                                checkBox: {A: false, B: false,ABC: false},
                                connID: key.connID || '',                   // 连排门id
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
                        this.typeShopList = this.getTypeList();
                        this.computeMedia_AD()
                        this.judgeByselect()
                        if (this.oneKeyPointData.TotalPoint == res.data.length) {
                            this.messageFun('success','成功选择了' + res.data.length + '面')
                        } else {
                            this.messageFun('warning','满足条件的点位不足' + this.oneKeyPointData.TotalPoint + '面,成功选择了' + res.data.length + '面')
                        }
                    }else{
                        this.messageFun('warning','选择失败,暂无匹配点位')
                    }
                    oneKeyPointLoading.close()
                })
                let timer = setTimeout(()=>{
                    if(!IsXhr){
                        this.messageFun('warning','点位选择异常')
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
                if (tab.condition === 'mstate') {           // 媒体状态
                    this.mState = ''
                    this.getAdsParamsData.mState = ''
                }else if(tab.condition === 'grade') {           // 媒体等级
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
                } else if (tab.condition === 'parkSpaceNum') {   // 车位数
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
                console.log('letter',letter,'tagName',tagName)
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
                    this.messageFun('warning','被占查询状态下，无效切换!')
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
                    this.messageFun('warning','数据区间填写有误')
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
                    this.messageFun('warning','数据区间填写有误')
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
                    this.messageFun('warning','数据区间填写有误')
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
                    this.messageFun('warning','数据区间填写有误')
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
                    this.messageFun('warning','数据区间填写有误')
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
                    this.messageFun('warning','数据区间填写有误')
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
            // 根据购物车已有的mID对应AB面判断勾选
            judgeByselect() {
                console.log('judgeByselect')
                if(this.shopingList.length > 0){
                    for (let i = 0; i < this.shopingList.length; i++){
                        this.hadADByshop(this.shopingList[i])
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
                                    this.IsAll = true
                                } else if (shopAD.A_B === 'B') {
                                    key.checkBox.B = true
                                    this.IsAll = true
                                } else if (shopAD.A_B === 'ABC'){
                                    key.checkBox.ABC = true
                                    this.IsAll = true
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
                        console.log('有勾选')
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
                for (let pkey of this.planList) {
                    if(this.mediaType === '广告门'){
                        // 根据是否被占用去打勾
                        if (!pkey.box.A) {
                            pkey.checkBox.A = true
                        }
                        if (!pkey.box.B) {
                            pkey.checkBox.B = true
                        }
                    }else if(this.mediaType === '道闸'){
                        pkey.checkBox.ABC = true
                    }
                }
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
                console.log('取消全选',this.planList)
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
                this.computeMedia_AD()
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
                    this.deleteShopRow(check, 'A')
                }
            },
            changeB(row) {
                let check = row
                if (check.checkBox.B === true) {
                    this.shopShow_hide()
                    this.AddShopingInfo(row, 'B') // 添加到购物车
                } else {                        // A、B都勾选的时候
                    this.deleteShopRow(check, 'B')
                }
            },
            // 道闸点位选择
            changeABC(row){
                if (row.checkBox.ABC === true){
                    let obj = this.setShopingTable(row,'ABC')
                    this.shopShow_hide()
                    this.shopingList.push(obj)
                    this.IsAll = true
                }else{
                    this.deleteShopRow(row, 'ABC')
                }
            },
            // 全选是放进购物车-广告门
            allSelectToShop_adDoor(){
                for (let i = 0; i < this.planList.length; i++) {
                    let info = this.planList[i]
                    for (let j = 0; j < 2; j++) {
                        let selectInfo = this.setShopingTable(info,'')
                        let asLabsArr = selectInfo.asLabs.split(',')
                        let asIDArr = selectInfo.asIDs.split(',')
                        if (j === 0 && !selectInfo.box.A) {
                            selectInfo.A_B = 'A'
                            for (let n = 0; n < asLabsArr.length; n++) {
                                if (asLabsArr[n] === 'A') {
                                    // console.log('A', asIDArr[n])
                                    selectInfo.asID = asIDArr[n]
                                    break
                                }
                            }
                            this.shopingList.push(selectInfo)
                        } else if (j === 1 && !selectInfo.box.B) {
                            selectInfo.A_B = 'B'
                            for (let n = 0; n < asLabsArr.length; n++) {
                                if (asLabsArr[n] === 'B') {
                                    // console.log('B', asIDArr[n])
                                    selectInfo.asID = asIDArr[n]
                                    break
                                }
                            }
                            this.shopingList.push(selectInfo)
                        }
                    }
                }
                console.log('广告门全选时购物车', this.shopingList)
            },
            // 全选是放进购物车-道闸
            allSelectToShop_roadGate(){
                for (let pkey of this.planList){
                    let selectInfo = this.setShopingTable(pkey,'ABC')
                    this.shopingList.push(selectInfo)
                }
                console.log('道闸全选时购物车', this.shopingList)
            },
            // 取消勾时,删除购物车里对应的数据行
            deleteShopRow(row, letter) {
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
            // 购物车-获取地图选择的点位列表
            getMapADList() {
                console.log('触发获取地图选点信息click')
                this.getMapLoading = this.$loading({
                    lock: true,
                    text: '数据获取中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                this.mapBtn = true
                api.getApi(this.Map + '/SendMap', {uid: this.sessionData.uID,token: this.sessionData.token}).then(res => {
                    console.log('地图选点', res)
                    if(res.data.code == '500200'){
                        this.mapADList = res.data.data
                        if(this.mapADList.length > 0){
                            this.setShopDataByMapAD()
                        } else {
                            this.messageFun('warning','数据为空')
                            this.getMapLoading.close()
                        }
                    } else if(res.data.code == '100302' || res.data.MSG === "登陆超时"){
                        this.loginTimeout()
                    } else {
                        this.getMapLoading.close()
                        this.messageFun('warning','数据获取异常')
                    }
                })
            },
            // 根据地图选点返回的数据，设置成购物车所需的数据格式
            setShopDataByMapAD() {
                console.log('执行了setShopDataByMapAD', this.mapADList)
                let mapADList_ = this.mapADList // tempData
                let tempArr = []
                let j = 0
                for (let data of mapADList_) {
                    for (let i = 0; i < 2; i++) {
                        let ADInfo = {
                            mID: data.mID,
                            resType: data.resType,
                            resID: data.resID,
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
                            checkBox: {A: false, B: false,ABC: false},
                            connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                            connID: data.connID || '',        // 连排门id
                            industryInfos: data.industryInfos || [],   // 同行业资源回避
                            mediaLevel: data.grade || '',
                            adPrice: data.mVehicle === '道闸' ? data.asPrice / 100 || 0 : data.asPrice / 700 || 0,
                            asName: data.asName || '',         // 点位所属公司名称
                            asrID: data.asrID,                 // 所属公司id
                        }
                        // 地图中心点名称
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
                            ADInfo.asID = data.asIDs.split(',')
                            if (this.judgeHaveDiffAD(ADInfo,'mapAds')) {
                                tempArr.push(ADInfo)
                                break
                            }
                        }
                    }
                    j++
                }
                console.log('根据地图选点返回的数据，设置成购物车所需的数据格式', tempArr)
                if (this.shopingList.length !== 0) {
                    for (let key of tempArr) {
                        this.shopingList.push(key)
                    }
                } else {
                    this.shopingList = tempArr
                }
                if(this.getMapLoading){
                    this.getMapLoading.close()
                }
                this.messageFun('success','成功获取到' + tempArr.length + '条数据')

                this.typeShopList = this.getTypeList();
                this.getShowList();

                this.computeMedia_AD('mapAD')
                this.judgeByselect()
            },
            // 判断点位是否已存在购物车
            judgeHaveDiffAD(data,SourceType) {
                let ADData = data
                let shopArr = this.shopingList
                let ifBoolea = true
                if (shopArr.length !== 0) {
                    for (let i = 0; i < shopArr.length; i++) {
                        if (ADData.mID === shopArr[i].mID && ADData.A_B === shopArr[i].A_B) {
                            console.log('相同mid,相同面', ADData)
                            let ADScheArr = ADData.schedules.split('-')
                            let shopScheArr = shopArr[i].schedules.split('-')
                            // 全等
                            if (ADScheArr[0] == shopScheArr[0] && ADScheArr[1] == shopScheArr[1]) {
                                if(SourceType === 'mapAds'){
                                    // let centerName = ADData.reference.name ? ADData.reference.name +'-'+  ADData.reference.address :''
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
                                    // if(shopArr[i].mapCenter !== centerName){
                                        if (shopArr[i].mapCenter !== '') {
                                            shopArr[i].mapCenter = shopArr[i].mapCenter + ',' + centerName
                                        } else {
                                            console.log('mapCenter为空')
                                            shopArr[i].mapCenter = centerName
                                        }
                                    // }
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
                    this.messageFun('success','成功移除' + num + '条数据')
                    this.getResultData(arr);

                    this.computeMedia_AD()
                    this.resetPlanList()
                    this.judgeByselect()
                } else {
                    this.messageFun('warning','暂无同行回避点位')
                }
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
                        this.messageFun('success','删除成功')
                        this.resetPlanList()      // 重置planList的勾选
                    }).catch(() => {
                        this.messageFun('info','已取消删除')
                    })
                }else{
                    this.messageFun('warning','无数据可删除')
                }

            },
            // 统计购物车媒体数、面数
            computeMedia_AD(letter) {
                // let shopList = this.shopingList
                // console.log('购物车统计面数媒体数shopList', shopList)
                let shopList = [];
                let currTab = this.activeName;
                console.log('typeShopList----', this.typeShopList);
                shopList = this.typeShopList[currTab-1].asidList;
                console.log('购物车统计面数媒体数shopList', shopList)
                let mediaArr = []
                let mediaAD = []
                let resArr = []
                let resAsidArr = [];
                // ANum：A面数量  BNum：B面数量
                let mediaLevelNum = {ALevel: 0, BLevel: 0, CLevel: 0,ANum:0,BNum:0}
                for(let key of shopList){
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
                    if(!mediaArr.includes(key.mID)){
                        mediaArr.push(key.mID)
                    }else{
                        // console.log('重复媒体',key.mID)
                    }
                    if(!mediaAD.includes(key.asID)){
                        mediaAD.push(key.asID)
                    }else{
                        console.log('重复的点位',key.asID)
                    }
                    if(!resArr.includes(key.resID)){
                        resArr.push(key.resID)
                    }else{
                        // console.log('重复的点位',key.resID)
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
                // console.log('resAsidArr------', resAsidArr);
                this.shopMedia_ADNum.oneNum = this.getResAsidNum(1, resAsidArr);
                this.shopMedia_ADNum.twoNum = this.getResAsidNum(2, resAsidArr);
                this.shopMedia_ADNum.threeNum = this.getResAsidNum(3, resAsidArr);
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

                console.log('shopMedia_ADNum----', this.shopMedia_ADNum);
            },
            // 获取社区选一面两面三名的数据
            getResAsidNum(num, arr){
                let result = arr.filter((item)=>{
                    return item.asidList.length == num;
                });
                return result.length;
            },
            // dialog购物筐的显示全选中后添加都购物车
            dialogVisible() {
                this.dialogTableVisible = true
                // this.computeMedia_AD()            // 统计媒体数量和媒体面数
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
                console.log('type1------', type1);
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
                        // {
                        //     label: '移除被占点位',
                        //     value: 1,
                        // },
                        // {
                        //     label: '移除非客户的选点',
                        //     value: 2,
                        // },
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
                this.eventList = arr;
            },
            // 事件选择
            changeEvent(val){
                console.log('val', val);
                if(this.shopShowList.length){
                    switch (val){
                        case 3:
                            this.removeCommentIndustryAds('res');
                            break;
                        case 4:
                            this.removeCommentIndustryAds('media');
                            break;
                        case 5:
                            this.containNuminRes(1);
                            break;
                        case 6:
                            this.containNuminRes(2);
                            break;
                        case 7:
                            this.removeAllType('A');
                            break;
                        case 8:
                            this.removeAllType('B');
                            break;
                    }
                }else{
                    let active = this.activeName;
                    this.messageFun('warning', `没有${active=='1'?'广告门':'道闸'}数据`);
                }
            },
            // 同资源保留个数
            containNuminRes(num){
                let residArr = [];
                let resultArr = [];
                for(let data of this.shopShowList){
                    if(this.isEnough(data, num, residArr)){
                        residArr.push(data.resID);
                        resultArr.push(data);
                    }
                }
                console.log(resultArr, 'resultArr----')
                let len = this.shopShowList.length;
                if(resultArr.length){
                    this.getResultData(resultArr);
                    if(len != resultArr.length){
                        this.messageFun('success',`成功保留同资源${num}个点位！`);
                    }else{
                        this.messageFun('warning', '暂无同资源可移除的点位！')
                    }
                    this.computeMedia_AD();
                    this.resetPlanList();
                    this.judgeByselect();
                }else{
                    this.messageFun('warning', '暂无同资源可移除的点位！')
                }
            },
            // 移除A/B面
            removeAllType(type){
                let resultArr= this.shopShowList.reduce((groups, item)=>{
                    let groupFound= groups.find(arrItem => item.mID === arrItem.mID);
                    if(groupFound) {
                        if(!JSON.stringify(groupFound.asidList).includes(JSON.stringify(item))) {  //去重
                            groupFound.asidList.push(item);
                        }
                    } else {
                        //不要直接在原来的对象修改，新建对象
                        let newGroup = {
                            mID: item.mID,
                            asidList: [item]
                        }
                        groups.push(newGroup);
                    }
                    return groups;
                    },[]);
                    console.log('resultArr------------das---', resultArr);
                let len = this.shopShowList.length;
                if (resultArr.length > 0) {
                    resultArr = this.isEnoughMedia(type, resultArr);
                    this.getResultData(resultArr);
                    if(len != resultArr.length){
                        this.messageFun('success',`成功移除同门${type}面的点位！`)
                    }else{
                        this.messageFun('warning', '暂无可移除点位')
                    }
                    this.computeMedia_AD();
                    this.resetPlanList();
                    this.judgeByselect();
                } else {
                    this.messageFun('warning', '暂无可移除点位！')
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
            // 判断这个值出现的次数符合预期返回true,否则false
            isEnough(item, time, arr){
                let sum = 0
                for(let data of arr){
                    if(data == item.resID){
                        sum++;
                    }
                }
                if(sum < time){
                    return true;
                }else{
                    return false;
                }
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
            // 根据connID高亮行数据
            tableRowClassName({row}){
                // console.log('row',row)
                if (row.connData.connectResName !== '' || row.connData.commentWorkRes !=='' || row.connData.connectMedia !=='') {
                    return "warning-row-conncet";
                } else {
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
                                if(shopData[i].connData.connectResName === ''){
                                    shopData[i].connData.connectResName = shopData[i].resName
                                    shopData[i].connData.connectMedia = shopData[i].mediaName + '、' + shopData[j].mediaName
                                }else{
                                    if(!shopData[i].connData.connectMedia.includes(shopData[j].mediaName)){
                                        shopData[i].connData.connectMedia += '、'+ shopData[j].mediaName
                                    }
                                }
                                shopData[j].connData.connectResName = shopData[i].connData.connectResName
                                shopData[j].connData.connectMedia = shopData[i].connData.connectMedia
                            }
                        }
                    }
                    //同行业点位回避
                    if (shopData[i].industryInfos !== null && shopData[i].industryInfos.length > 0) {
                        let commentWorkArr = shopData[i].industryInfos
                        for (let key of commentWorkArr) {
                            if (this.industryID === key.piID) {
                                console.log('1')
                                if (shopData[i].connData.commentWorkRes === '') {
                                    shopData[i].connData.commentWorkRes = key.piName
                                } else {
                                    if (!shopData[i].connData.commentWorkRes.includes(key.piName)) {
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
                        key.connData = { connectResName: '',connectMedia: '',commentWorkRes:'',commentworkMedia:''}
                    }
                }
            },
            // 购物车行被点击
            shopRowClick(row, event, column){
                console.log('购物车行被点击row',row,column)
                if(row.connData.connectResName !== '' || row.connData.commentWorkRes !=='' || row.connData.connectMedia !==''){
                    this.ActiveConnectADList = row.connData
                    console.log('this.ActiveConnectADList',this.ActiveConnectADList)
                    this.connectAdDialogVisible = true
                }
            },
            // 添加到购物车
            AddShopingInfo(info, letter) {
                console.log('选中的row信息', info)
                let selectInfo = this.setShopingTable(info,letter)
                let asLabsArr = selectInfo.asLabs.split(',')
                let asIDArr = selectInfo.asIDs.split(',')
                if (letter == 'B') {
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
                this.IsAll = true
            },
            // 选点列表数据到购物车数据
            setShopingTable(info,letter){
                let selectInfo = {
                    rid: info.rid,
                    mID: info.mID,
                    mVehicle: info.mVehicle,
                    asID: info.asIDs.split(','),
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
                    mediaRemark: info.mediaRemark,
                    buildNum: info.buildNum,
                    schedules: info.schedules,
                    tradingArea: info.tradingArea,
                    assetTag: info.assetTag,
                    liveYear: info.liveYear,
                    adLimit: info.adLimit,
                    mapCenter: info.reference || '',      // 地图中心点
                    address: info.address || '',
                    dNum: info.dNum || '',       // 出入口数
                    A_B: letter,
                    checkBox: {A: info.checkBox.A, B: info.checkBox.B,ABC:  info.checkBox.ABC},
                    box: {A:info.box.A !== undefined ? info.box.A : false,B:info.box.B !== undefined ? info.box.B : false},
                    connData: { connectResName: '', connectMedia: '', commentWorkRes:'', commentworkMedia:''},
                    connID: info.connID,                 // 连排门id
                    industryInfos: info.industryInfos,   // 同行业资源回避
                    adPrice: info.adPrice,               // 点位价格
                    mediaLevel: info.mediaLevel,         // 媒体等级
                    asrID: info.asrID,                   // 所属公司id
                    asName: info.asName,                 // 所属公司名称
                }
                return selectInfo
            },
            // 自定义购物车表头-清空
            renderHeader(h, {column}){
                // console.log('********h*******',h,column)
                return h('span', {
                        class: 'clearShopping',
                        on: {
                            click: ()=>{
                                console.log('**************123')
                                this.clearShop()
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
                for (let j = 0; j < this.shopingList.length;) {
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
            //修改动画效果及显示隐藏
            shopShow_hide(all) {
                let R = this.shopXY.x
                let T = this.shopXY.y
                console.log('Right:', R, ',Top:', T)
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
            //行被点击 beOccupiedGetList timeFormat
            rowClick(row, event, column){
                // console.log('row',row,event,column)
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

            /*step3*/
            getAsNameByShopingList(){
                let asrIDs = []
                let isHad = false
                for(let sKey of this.shopingList){
                    isHad = true
                    for (let aKey of asrIDs) {
                        if (aKey.asrID == sKey.asrID && aKey.rid == sKey.rid) {
                            isHad = false
                            break
                        } else {
                            isHad = true
                        }
                    }
                    if(isHad){
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
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
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
            // 创建方案基本信息及投放城市详情(报价单数据提交)
            creatAdPlan(){
                console.log('creatAdPlan',this.quotation)
                let arr = []
                let cityArea = []
                for(let key of this.quotation){
                    cityArea.push({
                        asrID: key.asrID,
                        city: key.city,
                        rid: key.rid
                    })
                    for(let i in key.priceMsg){
                        let minTime = ''
                        let maxTime = ''
                        if (key.priceMsg[i].schedules.length > 0 && key.priceMsg[i].schedules !== '' && key.priceMsg[i].schedules !== null) {
                            let timeList = key.priceMsg[i].schedules.join(',')
                            let schedulesArr = timeFormat.returnTimeArr(timeList,',','-')
                            minTime = schedulesArr[0]
                            maxTime = schedulesArr[schedulesArr.length - 1]
                        } else {
                            minTime = this.dateInput[0]
                            maxTime = this.dateInput[1]
                        }
                        if(this.apMinTime === ''){
                            this.apMinTime = minTime
                        }else{
                            if(this.apMinTime > minTime){
                                this.apMinTime = minTime
                            }
                        }
                        arr.push({
                            "pdRemark": key.priceMsg[i].remark || '',
                            "asrID": key.asrID,
                            "rID": key.rid,
                            "pdDays":  key.priceMsg[i].tfl,
                            "pdFreeNum": key.priceMsg[i].GMDate,                                // 赠送面*天
                            "pdStar": minTime.split(".").join('-'),
                            "pdEnd": maxTime.split(".").join('-'),
                            "pdAdFee": parseInt(key.priceMsg[i].advertyPrice * 100),              // 广告费用
                            "pdNum": key.priceMsg[i].ADNumber,                                   // 点位数
                            "pdAdMake": Number((key.priceMsg[i].makePrice * 100).toFixed(0)),   // 实计制作费用
                            "pdTotal": Number((key.priceMsg[i].cash * 100).toFixed(0)),
                            "pdSendFee": Number((key.priceMsg[i].zyzh * 100).toFixed(0)),
                            "pdOtherFee": Number((key.priceMsg[i].other * 100).toFixed(0)),
                            "pdType": i === 'adDoor' ? 0 : 1
                        })
                    }
                }
                console.log('城市详情',arr,'cityArea',cityArea)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apname: this.planForm.planName,
                    adcid: this.planForm.ownerBU,
                    bid: this.planForm.companyBrand,
                    // rid: this.planForm.throwCity.join(','),
                    suid: this.BDData.uid,
                    detail: JSON.stringify(arr),
                }
                if (this.sessionData.uType === 'BD') {
                    delete params.suid;
                }
                console.log('params',params)
                api.postApi(this.Advertisement + '/CreateAPDBatch', params).then(res=>{
                    console.log('创建方案',res)
                    if(res.data.SysCode == 200200){
                        this.FAData.apID = res.data.Data[0].apID
                        this.PushADBFun(res.data.Data)
                        this.CreateShareADSFun()
                        sessionStorage.setItem("plan_apid", res.data.Data[0].apID)
                        sessionStorage.setItem('cityArea', JSON.stringify(cityArea));
                    }else{
                        this.ADloading.close()
                        this.messageFun('warning','方案创建失败')
                    }
                })
            },
            // 提交方案选点信息 7700 6700
            PushADBFun(data) {
                let ADBData = data
                let shopingArr = this.shopingList
                console.log('shopingArr', shopingArr)
                let cityArr = []
                for (let j = 0; j < ADBData.length; j++) {
                    let cityObj = {city: ADBData[j].city, pdID: ADBData[j].pdID, pdType: ADBData[j].pdType,asrID:ADBData[j].asrID}
                    cityArr.push(cityObj)
                }
                console.log('cityArr', cityArr)
                let pbSetTime = this.timestampToTime(Date.parse(new Date()))    //
                console.log('当前日期时间', pbSetTime)
                let arr = []
                for (let i = 0; i < shopingArr.length; i++) {
                    for (let n = 0; n < cityArr.length; n++) {
                        if (shopingArr[i].city == cityArr[n].city && shopingArr[i].asrID == cityArr[n].asrID) {
                            if(cityArr[n].pdType == 0 && shopingArr[i].mVehicle === '广告门'){
                                arr.push({
                                    asID: shopingArr[i].asID,
                                    pdID: cityArr[n].pdID,
                                    pbStar: shopingArr[i].schedules.split('-')[0],
                                    pbEnd: shopingArr[i].schedules.split('-')[1],
                                    uID: this.sessionData.uID,
                                    pbSetTime: pbSetTime,
                                    mapCenterName: shopingArr[i].mapCenter
                                })
                                break
                            }else if(cityArr[n].pdType == 1 && shopingArr[i].mVehicle === '道闸'){
                                for(let key of shopingArr[i].asID){
                                    arr.push({
                                        asID: key,
                                        pdID: cityArr[n].pdID,
                                        pbStar: shopingArr[i].schedules.split('-')[0],
                                        pbEnd: shopingArr[i].schedules.split('-')[1],
                                        uID: this.sessionData.uID,
                                        pbSetTime: pbSetTime,
                                        mapCenterName: shopingArr[i].mapCenter
                                    })
                                }
                                break
                            }
                        }
                    }
                }
                console.log('PushADBFun的arr', arr)
                let postData = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    abList: arr
                }
                api.postApi_json(this.Advertisement + '/PushADB?uid='+this.sessionData.uID+'&token='+this.sessionData.token,postData).then(res => {
                    console.log('PushADB提交选点', res)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.ADloading.close()
                        this.loginTimeout()
                    } else {
                        if (res.data === '' || res.data === null) {
                            this.messageFun('warning','提交选点失败')
                        } else {
                            this.ADloading.close()
                            this.active = 3
                            if(this.apMinTime <= this.dateTime){
                                this.messageFun('warning','该方案的投放期已经开始，建议立即发布该方案！')
                            }else{
                                this.messageFun('success','投放城市的报价信息提交成功')
                            }
                            // 清除后台缓存
                            let params = {
                                uid: this.sessionData.uID,
                                token: this.sessionData.token
                            }
                            api.postApi(this.Advertisement + '/clearAdPlanBackups',params).then(res=>{
                                console.log('清空缓存的方案',res)
                                if(res.data.SysCode == 200200){
                                    console.log('缓存方案清除成功')
                                }else{

                                }
                            })
                            // 清除前台缓存
                            cacheAdPlan.removeData(this.sessionData.uID)
                        }
                    }
                })
            },
            // 生成协同选点aiCode
            CreateShareADSFun() {
                let urlPath = location.href
                console.log(urlPath)
                let aiInfo = {apname: this.planForm.planName, cname: this.cName, cband: this.cBand}
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    apid: this.FAData.apID,
                    aiinfo: JSON.stringify(aiInfo)
                }
                api.postApi(this.Advertisement+'/CreateShareCode', params).then(res => {
                    console.log('生成协同选点aiCode', res)
                    this.apAicode = res.data.aiCode         // 协同选点 aiCode
                    this.shareADUrl = this.qadnUrl + '/shareADList?apid=' + this.FAData.apID + '&aicode=' + res.data.aiCode
                    this.active = 3
                })
            },
            /*完成*/
            //查看方案
            ToDetail() {
                this.$router.push("./planDetail");
            },
            // 继续创建
            continueCreate() {
                location.reload(false)
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
                this.messageFun('success','复制成功')
            },
            // 公用方法
            // 方案异常时，存储当前方案基本数据及购物车点位等临时信息
            saveApInfo(){
                let planInfo = {
                    uid:this.sessionData.uID,
                    setTime: this.timestampToTime(Date.parse(new Date())),
                    planData: {
                        suid: this.BDData.uid,          // 销售uid,如果是销售自己创建方案则uid与suid相同
                        baseInfo: this.planForm,
                        adsList: this.shopingList,
                        throwCity:this.throwCity,
                        companyBrand: this.companyBrand,
                    }
                }
                console.log('方案异常时，存储当前方案基本数据及购物车点位等临时信息',planInfo)
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    adPlan: JSON.stringify(planInfo)
                }
                api.postApi(this.Advertisement + '/createAdPlanBackups',params).then(res=>{
                    console.log('res创建方案缓存',res)
                    if(res.data.SysCode == 200200){

                    }else{
                        // 后台缓存异常，则前台缓存到localStorage
                        // cacheAdPlan.setData(planInfo)
                    }
                })
                // 同步缓存一份到localStorage
                // if(this.routePath.includes('unfinishedPlan')){
                    cacheAdPlan.setData(planInfo)
                // }
            },
            // 设置方案信息
            setPlanInfo(){
                let returnData = cacheAdPlan.getData(this.sessionData.uID)
                if (returnData) {
                    this.unfinishedData = returnData
                    this.planForm = returnData.planData.baseInfo
                    this.BDData.uid = returnData.planData.suid
                    this.throwCity = returnData.planData.throwCity
                    this.shopingList = returnData.planData.adsList
                    this.companyBrand = returnData.planData.companyBrand
                    if(this.sessionData.uType === 'MD'){
                        this.getCityList()
                        this.Get_cName()
                    }
                    this.active = 1
                    console.log('设置方案信息returnData', returnData)
                    // 设置城市及对应的区域
                    this.getAreaFun()
                    this.getAdsParamsData = {
                        prID: this.city[0].rid,
                        rid: '440100',
                        act: 1,
                        dateTimeBegin: this.dateInput[0],
                        dateTimeEnd: this.dateInput[1],
                        resType: this.recType,
                        mVehicle: this.mediaType,
                        pageNo: this.pageNo,
                        pageSize: 50,
                    }
                    this.getAdList()            // 获取选点列表
                    this.getRejectPlanList()    // 获取排斥方案列表
                    this.getIndustryBycID()     // 根据所选公司获取公司所属行业
                } else {
                    return
                }
            },
            // 时间戳转换成日期格式 2018-06-18 10:33:24
            timestampToTime(timestamp) {
                let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() + ' ';
                let h = (date.getHours() < 10 ? '0'+ date.getHours() : date.getHours())+ ':';
                let m = (date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes())+ ':'; //date.getMinutes() + ':';
                let s = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds();        //date.getSeconds();
                return Y + M + D + h + m + s;
            },
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
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
    /deep/ .el-table__fixed,/deep/ .el-table__fixed-right{
        height: 471px !important;
    }
    /deep/ .el-table__fixed-right{
        right: 5px !important;
    }
    /deep/ .el-table__fixed-right-patch{
        right: 8px !important;
    }
    /deep/ .selectAdsTable .el-table__empty-text{
        left:25%;
    }
    /deep/ .selectAdsTable .el-table_1_column_1{
        text-align: center;
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
    }
    .myCheckbox{
        position: absolute;
        width: 100px;
        height: 42px;
        text-align: center;
        line-height: 42px;
        top:0;
        left: 0;
        z-index: 99;
    }
    .urlBtn {
        padding: 10px;
    }

    .mapBtn {
        width: 110px;
        text-align: center;
        display: inline-block;
        padding: 3px;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        margin-bottom: 5px;
        cursor: pointer;
    }

    /deep/ .el-form--inline .el-form-item {
        margin-right: 7px !important;
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

    /*状态行*/
    /deep/ .el-table .warning-row-conncet {
        background: rgba(0,153,255,0.2)
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

    /*创建方案表单*/
    /deep/ .el-form.demo-ruleForm {
        width: 416px;
        margin: 0 auto;
    }

    .el-input {
        width: 262px;
        height: 34px !important;
        border-radius: 4px;
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

    /deep/ .el-button {
        width: 76px;
        height: 34px;
    }

    /deep/ .date-select.el-input__inner {
        width: 260px;
        position: relative;
        /*left: -6px;*/
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
    /*step2 四个按钮*/
    .searchBtn, .map {
        position: relative;
        /*left: 5px;*/
    }
    .oneKeyPointBtn{
        text-align: center;
        /*margin-left: 6px;*/
        height: 34px;
        padding: 0;
        line-height: 34px;
    }

    /deep/ .el-button.searchBtn span {
        left: -10px;
    }

    .searchBtn.el-button + .el-button {
        margin-left: 0;
    }

    .importXle.el-button--success{
        background: #51E171;
        border-color: #51E171;
        /*margin-left: 11px;*/
    }

    /deep/ .importXle.el-button [class*=el-icon-]+span{
        top:0;
        left: 0;
    }

    /deep/ .map.el-button--primary {
        background: #FF8F49;
        border-color: #FF8F49;
    }

    /deep/ .el-button--primary span {
        position: relative;
        left: -2px;
        top: -2px;
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

    /*按钮*/
    /deep/ .el-button--default:focus, .el-button--default:hover {
        color: #606266;
        border-color: #dcdfe6;
        background-color: #fcfcfc;
    }

    .content_bottom_btn /deep/ .el-button span {
        position: relative;
        top: -2px;
    }

    .content_bottom_btn /deep/ .el-button span a {
        color: #606266;
    }

    .finishBtn /deep/ .el-button span {
        left: -8px;
    }

    .map {
        width: 76px;
        height: 34px;
        border: 1px solid #C2C2C2;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        font-size: 14px;
        /*margin-left: 5px;*/
    }

    /deep/ .searchBtn .el-icon-search,/deep/ .map .el-icon-location-outline {
        position: relative;
        top: -2px;
        left: -9px;
    }

    /deep/ .el-button.map span{
        position: relative;
        left: -10px;
        top: -2px;
    }

    .search-wrap {
        position: relative;
        /*清除浮动*/
        overflow:hidden;
    }

    .search-wrap > div {
        float: left;
        margin-right: 7px;
        /*margin-bottom: 18px;*/
    }
    /*购物车图标*/
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
        /*margin-top: 30px;*/
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
    .otherSelect /deep/ .el-input__inner{
        width: 100px;
        height: 30px;
        padding-left: 10px;
        color: #1890FF;
        border-radius: 0;
        overflow: hidden;
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
        width: 76px;
        height: 30px;
        padding: 0;
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
        height: 22px;
        margin-top: 6px;
        padding: 0;
        font-size: 12px;
        text-align: center;
        line-height: 22px;
        border-radius: 0;

    }
    /deep/ .input-wrap-Btn.el-button--primary span{
        left: 0;
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
    /deep/ .el-tag__close.el-icon-close:hover{
        background: #fff;
    }

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

    /deep/ .el-checkbox + .el-checkbox {
        margin-left: 4px;
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

    /deep/ .car-list .el-table__body-wrapper {
        min-height: 380px;
        max-height: 360px;
    }

    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        height: 440px;
        overflow-y: auto;
        overflow-x: hidden !important;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 6px;
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
        /*height: 680px;*/
    }

    .step2 /deep/ .el-dialog {
        width: 1100px;
        height: 680px;
    }

    .step3 /deep/ .el-dialog {
        width: 388px !important;
    }

    /deep/ .car-list .el-button {
        width: 100px;
    }

    /*购物车列表*/
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
        margin: 0 6px;
        cursor: pointer;
        color: #1890ff;
    }

    /deep/ .car-list .el-table__expanded-cell[class*=cell] {
        padding: 0 46px;
        background-color: #F7F7F7;;
    }

    /*.table_wrap /deep/ .has-gutter th:nth-child(11),*/
    .table_wrap /deep/ .has-gutter th:nth-child(12),
    .table_wrap /deep/ .has-gutter th:nth-child(13),
    .table_wrap /deep/ .has-gutter th:nth-child(17),
    .table_wrap /deep/ .has-gutter th:nth-child(18),
    .table_wrap /deep/ .has-gutter th:nth-child(19),
    .table_wrap /deep/ .has-gutter th:nth-child(20),
        /*.table_wrap /deep/ .el-table__row td:nth-child(11),*/
    .table_wrap /deep/ .el-table__row td:nth-child(12),
    .table_wrap /deep/ .el-table__row td:nth-child(13),
    .table_wrap /deep/ .el-table__row td:nth-child(17),
    .table_wrap /deep/ .el-table__row td:nth-child(18),
    .table_wrap /deep/ .el-table__row td:nth-child(19),
    .table_wrap /deep/ .el-table__row td:nth-child(20){
        text-align: right;
    }

    /deep/ .el-dialog .has-gutter th:nth-child(8),
    /deep/ .el-dialog .has-gutter th:nth-child(9),
    /deep/ .el-dialog .el-table__row td:nth-child(8),
    /deep/ .el-dialog .el-table__row td:nth-child(9) {
        /*text-align: right;*/
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

    /deep/ .el-button.el-button--text span {
        position: relative;
        top: -5px;
    }

    /*确认报价单修改框*/
    /deep/ .el-dialog__body {
        padding: 2px 20px 8px 20px;
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

    .createPlan .type-select  /deep/ .el-input__suffix {
        right: 9px;
    }

    /deep/ .el-input-number.is-controls-right .el-input-number__decrease [class*=el-icon], .el-input-number.is-controls-right .el-input-number__increase [class*=el-icon] {
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

    /deep/ .changeMakePrice .NoClassified /deep/ .el-input-number,
    /deep/ .step3 .NoClassified .is-controls-right .el-input__inner{
        width: 352px;
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
        height: 220px;
        background: #FAFAFA;
        border-radius: 2px;
        padding: 19px 0;
        box-sizing: border-box;
        margin: 0 auto;
    }

    .planPanel ul li {
        padding-left: 207px;
        text-align: left;
        font-size: 14px;
        color: #666666;
        margin-bottom: 10px;
    }

    .planPanel ul li.money {
        margin-bottom: 10px;
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
        height: 245px !important;
    }

    .noShareUl ul li {
        margin-bottom: 15px !important;
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
    .import_box{
        display: flex;
        height: 35px;
        line-height: 35px;
        margin-bottom: 20px;
    }
    .import_box .aButton{
        display: inline-block;
        color: #666;
        height: 26px;
        padding: 3px;
        line-height: 26px;
        border-radius: 4px;
        border: 1px solid #dedede;
    }
    .import_file{
        margin-left: 20px;
    }
    .import_file .upload_file{
        display: inline-block;
    }
    /deep/ .import_file  .el-button{
        width: auto;
        padding: 5px;
    }
    .upload_box{
        text-align: center;
        margin-top: 20px
    }
    /deep/ .upload_box .el-button{
        width: auto;
    }
    /*1440*/
    @media all and (min-width: 1420px) {
        .filter-input input {
            border: 1px solid #C2C2C2;
            border-radius: 4px;
            width: 75px;
            height: 26px;
            outline: none;
            text-indent: 1em;
            font-size: 14px;
            color: #666;
        }
        .input-wrap.focus{
            width: 170px;
        }
        .filter-input .input-wrap .el-button--mini {
            left: 1px;
        }

        .tbody .tr li:nth-of-type(1) {
            width: 3.25%;
        }

        .tbody .tr li:nth-of-type(2) {
            width: 14.15%;
        }

        .tbody .tr li:nth-of-type(3) {
            width: 7.0%;
        }

        .tbody .tr li:nth-of-type(4) {
            width: 7.45%;
        }

        .tbody .tr li:nth-of-type(5) {
            width: 8.8%;
        }

        .tbody .tr li:nth-of-type(6) {
            width: 8.4%;
        }

        .tbody .tr li:nth-of-type(7) {
            width: 8.3%;
        }

        .tbody .tr li:nth-of-type(8) {
            width: 8.35%;
        }

        .tbody .tr li:nth-of-type(9) {
            width: 16.2%;
        }

        .tbody .tr li:nth-of-type(10) {
            width: 227px;
        }
    }

    /*1920*/
    @media all and (min-width: 1900px) {
        .input-wrap.focus{
            width: 234px;
        }
        .mediaMana_content_bottom .content_bottom_btn {
            position: absolute;
            bottom: -66px;
            left: 896px;
        }

        .filter-input input {
            border: 1px solid #C2C2C2;
            border-radius: 4px;
            width: 107px;
            height: 26px;
            outline: none;
            text-indent: 1em;
            font-size: 14px;
            color: #666;
        }

        .filter-input .input-wrap .el-button--mini {
            width: 52px;
            height: 26px;
        }
        .input-wrap /deep/ .el-button--mini span {
            position: relative;
            top: -1px;
            left: -3px;
        }

        .tbody .tr li:nth-of-type(1) {
            width: 2.35%;
        }

        .tbody .tr li:nth-of-type(2) {
            width: 14.15%;
        }

        .tbody .tr li:nth-of-type(3) {
            width: 7.0%;
        }

        .tbody .tr li:nth-of-type(4) {
            width: 7.45%;
        }

        .tbody .tr li:nth-of-type(5) {
            width: 8.8%;
        }

        .tbody .tr li:nth-of-type(6) {
            width: 8.3%;
        }

        .tbody .tr li:nth-of-type(7) {
            width: 8.3%;
        }

        .tbody .tr li:nth-of-type(8) {
            width: 8.35%;
        }

        .tbody .tr li:nth-of-type(9) {
            width: 16.2%;
        }

        .tbody .tr li:nth-of-type(10) {
            width: 331px;
        }
    }
</style>
<style>
    .el-tooltip__popper.is-dark{
        max-width: 200px;
    }
    .other-dd-popper{
        padding: 6px;
    }
</style>
