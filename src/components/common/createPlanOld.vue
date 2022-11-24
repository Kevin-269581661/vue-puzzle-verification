<template>
  <div class="ad_mediaMana_wrap createPlan">
    <div class="ad_mediaMana_nav clearfix">
      <p><a href="#">方案管理</a><em> / </em><a href="#">创建方案</a></p>
    </div>
    <div class="mediaMana_content_top">
      <div class="content_top_wrap">
        <!--填写客户信息-->
        <div class="step1" v-if="active == 0">
          <div class="createPlan">
            <el-form
              :model="planForm"
              status-icon
              :rules="planRules"
              ref="planForm"
              label-width="110px"
              class="demo-ruleForm"
            >
              <el-form-item label="方案名称：" prop="planName">
                <el-input
                  v-model="planForm.planName"
                  placeholder="请输入方案名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="所属销售：" prop="ownerSales">
                <el-input
                  v-if="isBD"
                  v-model="planForm.ownerSales"
                  disabled
                ></el-input>
                <el-select
                  v-model="planForm.ownerSales"
                  v-else
                  filterable
                  remote
                  clearable
                  placeholder="请输入关键词"
                  :remote-method="querySearchAsync"
                  :loading="salerListLoading"
                  :highlight-first-item="true"
                  @change="changeSaler"
                >
                  <el-option
                    v-for="item in salerList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="公司名称：" prop="companyName">
                <el-select
                  v-model="planForm.companyName"
                  @change="GetBrandByCid"
                  placeholder="请选择公司名称"
                  filterable
                >
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
                <el-select
                  v-model="planForm.companyBrand"
                  placeholder="请选择公司品牌"
                  filterable
                >
                  <el-option
                    v-for="item in companyBrand"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系人：" prop="ownerBU">
                <el-select
                  v-model="planForm.ownerBU"
                  placeholder="请选择所属联系人"
                  filterable
                >
                  <el-option
                    v-for="item in ownerBU"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="投放城市："
                prop="throwCity"
                ref="planThrowCity"
              >
                <div v-if="cityOther">
                  <el-tag
                    :key="tag"
                    v-for="tag in dynamicTags"
                    closable
                    :disable-transitions="false"
                    @close="spliceCity(tag)"
                  >
                    {{ tag }}
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
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @mouseover.native="showInput"
                  >
                    +
                  </el-button>
                </div>
                <el-select
                  v-else
                  v-model="planForm.throwCity"
                  size="small"
                  filterable
                  multiple
                  placeholder="请选择"
                  @remove-tag="removeCity"
                >
                  <el-option
                    v-for="item in throwCity"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="isPay && BDData.uType === 'ADN_BD'"
                label="关联商机："
                prop="opportunityId"
              >
                <el-select
                  v-model="planForm.opportunityId"
                  size="small"
                  filterable
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in opportunityList"
                    :key="item.opportunityId"
                    :label="item.opportunityName"
                    :value="item.opportunityId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="isPay && BDData.uType === 'ADN_BD'"
                label="意向投放媒体："
                prop="customerMediaType"
              >
                <el-select
                  v-model="planForm.customerMediaType"
                  size="small"
                  filterable
                  clearable
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in customerMediaTypeList"
                    :key="item.customerMediaType"
                    :label="item.customerMediaTypeName"
                    :value="item.customerMediaType"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="BDData.uType == 'ADN_BD_KA'"
                label="归属公司："
                prop="pointOfAsrIDs"
                ref="planPointOfAsrIDs"
              >
                <el-select
                  v-model="planForm.pointOfAsrIDs"
                  size="small"
                  filterable
                  multiple
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in pointOfAsrIDs"
                    :key="item.asrID * 1"
                    :label="item.asName"
                    :value="item.asrID * 1"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!--选择点位-->
        <div class="step2" v-if="active == 1">
          <div>
            <div class="search-nav">
              <div class="search-wrap">
                <div style="margin-right: 0" v-show="isOccupied">
                  <el-select
                    v-model="activeSelect"
                    placeholder="请选择"
                    class="type-select"
                    size="small"
                  >
                    <el-option label="方案排斥" value="1"></el-option>
                  </el-select>
                  <el-select
                    v-model="activeAdPlan"
                    placeholder="请选择排斥方案"
                    class="reject_select"
                    @change="selectRejectPlan"
                    filterable
                    :clearable="true"
                    size="small"
                  >
                    <el-option
                      v-for="item in rejectAdPlan"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <div>
                  <el-input
                    placeholder="请输入要搜索的内容"
                    v-model="searchInput"
                    class="input-with-select"
                    size="small"
                    @change="initData"
                  >
                    <el-select
                      v-model="selectValue"
                      slot="prepend"
                      class="type-select"
                      @change="initData"
                    >
                      <el-option
                        v-for="item in typeSelect"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value"
                      ></el-option>
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
                    size="small"
                    :picker-options="pickerOptions"
                  >
                  </el-date-picker>
                </div>
                <div>
                  <el-button
                    type="primary"
                    style="background: #1890ff"
                    icon="el-icon-search"
                    class="searchBtn"
                    @click="searchFun"
                    :disabled="searchBtnAbled"
                    >搜索
                  </el-button>
                </div>
                <div class="shopcar" @click="dialogVisible()">
                  <el-badge :value="nowPointNum" class="item">
                    <img src="../../assets/images/shopCar.png" alt="" />
                  </el-badge>
                </div>
              </div>
              <el-row class="button_row">
                <el-col>
                  <el-button
                    type="primary"
                    class="map"
                    icon="el-icon-location-outline"
                    @click="setMapParams"
                    >地图
                  </el-button>
                  <el-dropdown>
                    <el-button type="success" class="importXle">
                      导入<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native.prevent="importFanan('res')"
                      >
                        导入小区
                      </el-dropdown-item>
                      <el-dropdown-item
                        @click.native.prevent="importFanan('ads')"
                      >
                        导入点位
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button type="primary" @click="importFanan('copy')"
                    >复制方案
                  </el-button>
                  <el-button plain @click="dialogOneKeyPoint = true"
                    >一键选点
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <!--类型区域选择面板-->
            <div class="dw-panel" v-show="isOccupied">
              <dl>
                <dt>媒体类型：</dt>
                <dd
                  v-for="(item, index) in mediaTypeObjectArr"
                  :key="index"
                  :class="currentMediaType === item.id ? 'active' : ''"
                  @click="activeMediaType(item.id)"
                >
                  {{ item.name || "--" }}
                </dd>
              </dl>
              <dl style="border: none">
                <dt>城市区域：</dt>
                <dd
                  v-for="(item, index) in city"
                  :key="index"
                  :class="index == activeIndex ? 'active' : ''"
                  @click="activeCity(item, index)"
                >
                  {{ item.rName }}
                </dd>
              </dl>
              <dl
                class="city-proper"
                v-for="(list, index) of area"
                :key="index"
                v-show="index == activeIndex"
              >
                <dd
                  v-for="(item, itemIndex) of list"
                  :class="item.rName == areaName ? 'active' : ''"
                  @click="activeArea(item)"
                  :key="itemIndex"
                >
                  {{ item.rName }}
                </dd>
              </dl>

              <dl>
                <dt>设备型号：</dt>
                <dd
                  v-for="(item, index) in mTypeList"
                  :key="index"
                  :class="mediaMType === item.dictValue ? 'active' : ''"
                  @click="activeMtype(item.dictValue)"
                >
                  {{ item.dictDesc }}
                </dd>
              </dl>

              <dl>
                <dt>安装位置：</dt>
                <dd
                  v-for="(item, index) in sites"
                  :key="index"
                  :class="site === item.dictValue ? 'active' : ''"
                  @click="activeSite(item.dictValue)"
                >
                  {{ item.dictDesc }}
                </dd>
              </dl>

              <dl>
                <dt>位置朝向：</dt>
                <dd
                  v-for="(item, index) in siteOrientations"
                  :key="index"
                  :class="siteOrientation === item.dictValue ? 'active' : ''"
                  @click="activeSiteOrientation(item.dictValue)"
                >
                  {{ item.dictDesc }}
                </dd>
              </dl>

              <dl style="border: none">
                <dt>其它条件：</dt>
                <dd class="other-dd">
                  <el-select
                    v-model="limitList"
                    placeholder="广告限制"
                    class="otherSelect adLimitSelect"
                    :class="limitList.length !== 0 ? 'otherSelectActive' : ''"
                    multiple
                    collapse-tags
                    size="small"
                    @change="activeADLimit"
                  >
                    <el-option
                      v-for="item in ADLimit"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-model="buildValue"
                    placeholder="楼盘类型"
                    :class="buildValue !== '' ? 'otherSelectActive' : ''"
                    size="small"
                    class="otherSelect"
                    @change="tableHeaderFilter_cType"
                  >
                    <el-option
                      v-for="item in buildType"
                      :key="item.buildValue"
                      :label="item.buildValue"
                      :value="item.buildValue"
                    >
                    </el-option>
                  </el-select>
                  <el-select
                    v-model="activeGrade"
                    placeholder="媒体等级"
                    class="otherSelect"
                    @change="gradeChange"
                    size="small"
                    :class="activeGrade !== '' ? 'otherSelectActive' : ''"
                  >
                    <el-option label="A级" value="A"></el-option>
                    <el-option label="B级" value="B"></el-option>
                    <el-option label="C级" value="C"></el-option>
                  </el-select>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'h' ? 'focus' : ''"
                    >
                      <input type="text" class="input" v-model="houseNum[0]" />
                      -
                      <input type="text" class="input" v-model="houseNum[1]" />
                      <el-button @click="emptyFun('H')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilter_h()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.hNum ? 'otherBtnActive' : ''"
                    >
                      住户数量
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'p' ? 'focus' : ''"
                    >
                      <input
                        type="text"
                        class="input"
                        v-model="buildPrice[0]"
                      />
                      -
                      <input
                        type="text"
                        class="input"
                        v-model="buildPrice[1]"
                      />
                      <el-button @click="emptyFun('P')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilter_p()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.bPrice ? 'otherBtnActive' : ''"
                    >
                      楼盘价格
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'p' ? 'focus' : ''"
                    >
                      <input type="text" class="input" v-model="liveYear[0]" />
                      -
                      <input type="text" class="input" v-model="liveYear[1]" />
                      <el-button @click="emptyFun('Y')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilterByLiveYear()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.lYear ? 'otherBtnActive' : ''"
                    >
                      入住年份
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'PF' ? 'focus' : ''"
                    >
                      <input
                        type="text"
                        class="input"
                        v-model="peopleFlow[0]"
                      />
                      -
                      <input
                        type="text"
                        class="input"
                        v-model="peopleFlow[1]"
                      />
                      <el-button @click="emptyFun('PF')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilterByPeopleFlow()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.pFlow ? 'otherBtnActive' : ''"
                    >
                      人流量
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'PSN' ? 'focus' : ''"
                    >
                      <input type="text" class="input" v-model="carFlow[0]" />
                      -
                      <input type="text" class="input" v-model="carFlow[1]" />
                      <el-button @click="emptyFun('PSN')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilterByCarFlow()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.cFlow ? 'otherBtnActive' : ''"
                    >
                      车流量
                    </el-button>
                  </el-popover>
                  <el-popover
                    placement="bottom-start"
                    width="155"
                    trigger="click"
                    popper-class="other-dd-popper"
                  >
                    <div
                      class="input-wrap"
                      :class="HSearch === 'CF' ? 'focus' : ''"
                    >
                      <input
                        type="text"
                        class="input"
                        v-model="parkSpaceNum[0]"
                      />
                      -
                      <input
                        type="text"
                        class="input"
                        v-model="parkSpaceNum[1]"
                      />
                      <el-button @click="emptyFun('CF')" class="input-wrap-Btn"
                        >清 除</el-button
                      >
                      <el-button
                        type="primary"
                        class="input-wrap-Btn"
                        @click="tableHeaderFilterByParkSpaceNum()"
                        >确 定
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      class="otherBtn"
                      :class="filterData.pSNum ? 'otherBtnActive' : ''"
                    >
                      车位数
                    </el-button>
                  </el-popover>
                </dd>
              </dl>
            </div>
            <div
              class="filter-condition"
              v-show="isOccupied && filterCondition.length > 0"
            >
              <el-tag
                v-for="(tag, index) in filterCondition"
                :key="index"
                closable
                :disable-transitions="false"
                @close="filterTagCloseFun(tag, index)"
                :type="tag.type"
                size="medium"
              >
                {{ tag.name }}
              </el-tag>
            </div>
            <!-- 表格控件 -->
            <div class="table-set">
              <el-radio-group
                v-model="getAdsParamsData.chooseType"
                class="chooseType-radio"
              >
                <el-radio-button
                  v-for="item in tabChooseTypeList"
                  :label="item.label"
                  :key="item.label"
                  >{{ item.name }}</el-radio-button
                >
              </el-radio-group>

              <TableSetting
                refresh
                space
                filter
                :columns="currentColumn"
                cacheKey="editPlan"
                @filterColumn="filterColumn"
                @refreshTable="refreshTable"
                @spaceSetting="spaceSetting"
              >
              </TableSetting>
            </div>

            <!--提示-->
            <div class="tip">
              <i class="el-icon-info"></i>
              <p>
                共 <span>{{ adsCount }}</span> 个点位，已选点位
                <span>{{ nowPointNum > 0 ? nowPointNum : 0 }}</span> 个
              </p>
            </div>
            <!--表格-->
            <div class="table_wrap adsTable">
              <div
                class="myCheckbox"
                v-if="isOccupied && getAdsParamsData.chooseType === 0"
              >
                <el-checkbox v-model="IsAll" @change="allCheckboxAds"
                  >全选本页</el-checkbox
                >
              </div>
              <div
                class="myCheckbox pointNum"
                v-if="getAdsParamsData.chooseType !== 0"
              >
                点位数量
              </div>
              <el-table
                v-loading="loading"
                element-loading-text="玩命加载中.."
                element-loading-spinner="el-icon-loading"
                border
                :data="planList"
                :default-sort="{ prop: 'mID', order: 'descending' }"
                @cell-mouse-enter="mouseEnter"
                @row-click="rowClick"
                style="width: 100%"
                class="selectAdsTable"
                height="595"
                :size="rowSpace"
                :key="itemKey"
              >
                <el-table-column
                  class-name="el-table-column-checkbox"
                  width="180"
                  :show-overflow-tooltip="getAdsParamsData.chooseType === 0"
                  fixed="left"
                >
                  <template slot-scope="scope">
                    <div
                      v-if="getAdsParamsData.chooseType !== 0"
                      class="pointCount-box"
                    >
                      <el-input-number
                        v-model="scope.row.pointCount"
                        :min="0"
                        :max="scope.row.actualAdsCnt"
                        size="mini"
                        class="pointCount-input"
                        @change="
                          (currentValue, oldValue) =>
                            handlePointCountChange(
                              currentValue,
                              oldValue,
                              scope.row
                            )
                        "
                      >
                      </el-input-number>
                    </div>
                    <template v-else>
                      <div
                        v-if="isOccupied && getAdsParamsData.chooseType === 0"
                        class="space-group"
                      >
                        <div
                          v-for="(adSpaceItem, adSpaceIndex) in scope.row
                            .adsList"
                          :key="adSpaceIndex"
                          class="space-item"
                        >
                          <!-- 点位状态和点位售卖状态确定是否可选 -->
                          <el-checkbox
                            v-if="adSpaceItem.checkFlag"
                            v-model="adSpaceItem.checkBox"
                            :label="adSpaceItem.asLab || '--'"
                            @change="changeCheckBox(scope.row, adSpaceItem)"
                          >
                          </el-checkbox>
                          <el-popover
                            v-else
                            placement="top-start"
                            width="310"
                            trigger="hover"
                          >
                            <span v-if="scope.row.adlInfo === ''"
                              >暂无被占信息</span
                            >
                            <ul v-else>
                              <li
                                v-for="(item, itemIndex) in scope.row.adlInfo"
                                :key="itemIndex"
                              >
                                <template v-if="item.lState == null">
                                  <p style="margin-bottom: 5px">
                                    <span style="color: #333"
                                      >该点位：{{ item.asState }}中</span
                                    >
                                  </p>
                                  <div style="margin-bottom: 5px">
                                    <span style="color: #333">状态原因：</span>
                                    <span
                                      style="color: #333"
                                      v-for="(u, i) in item.unSaleableReason"
                                      :key="i"
                                    >
                                      <template
                                        v-if="item.unSaleableReason.length > 1"
                                        >{{ i + 1 }}.</template
                                      >
                                      {{ u }}
                                    </span>
                                  </div>
                                </template>
                                <template v-else>
                                  <p style="margin-bottom: 5px">
                                    <span style="color: #333">占点方案：</span>
                                    <span>
                                      <span style="font-weight: bold">
                                        {{
                                          ["ADN_MD_COUNTRY", "ADN_MD"].includes(
                                            sessionData.uType
                                          )
                                            ? item.beOccupieApName
                                            : "******"
                                        }}
                                      </span>
                                      方案（{{
                                        item.lState == 0
                                          ? "预锁"
                                          : item.lState == 1
                                          ? "被占"
                                          : "强制停止"
                                      }}）
                                    </span>
                                  </p>
                                  <p style="margin-bottom: 5px">
                                    <span style="color: #333">占点排期：</span
                                    >{{ item.schedules }}
                                  </p>
                                </template>
                              </li>
                            </ul>
                            <el-checkbox
                              slot="reference"
                              v-model="adSpaceItem.checkBox"
                              :label="adSpaceItem.asLab || '--'"
                              :disabled="true"
                            >
                            </el-checkbox>
                          </el-popover>
                        </div>
                      </div>
                      <div v-else>
                        {{ scope.row.asLabs }}
                      </div>
                    </template>
                  </template>
                </el-table-column>

                <template v-for="item in currentColumn">
                  <template v-if="item.label === '资源名称'">
                    <el-table-column
                      class-name="el-table-column-resName"
                      v-if="item.isChecked"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '媒体名称'">
                    <el-table-column
                      class-name="el-table-column-mediaName"
                      v-if="item.isChecked && getAdsParamsData.chooseType === 0"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '楼栋号'">
                    <el-table-column
                      class-name="el-table-column-mediaName"
                      v-if="
                        item.isChecked &&
                        (getAdsParamsData.chooseType === 1 ||
                          getAdsParamsData.chooseType === 2)
                      "
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                    </el-table-column>
                  </template>
                  <template v-else-if="item.label === '单元号'">
                    <el-table-column
                      class-name="el-table-column-mediaName"
                      v-if="item.isChecked && getAdsParamsData.chooseType === 1"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '商圈'">
                    <el-table-column
                      v-if="item.isChecked"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.tradingArea || "--" }}
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '媒体备注'">
                    <el-table-column
                      class-name="el-table-column-mediaRemark"
                      v-if="item.isChecked && getAdsParamsData.chooseType === 0"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.mediaRemark || "--" }}</span>
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '巡点问题'">
                    <el-table-column
                      align="right"
                      v-if="
                        item.isChecked &&
                        customPermission.patrolPermission &&
                        getAdsParamsData.chooseType === 0
                      "
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.remark || "--" }}
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '通行情况'">
                    <el-table-column
                      align="right"
                      v-if="
                        item.isChecked &&
                        customPermission.patrolPermission &&
                        getAdsParamsData.chooseType === 0
                      "
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.trafficState || "--" }}
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '通电情况'">
                    <el-table-column
                      align="right"
                      v-if="
                        item.isChecked &&
                        customPermission.patrolPermission == 2 &&
                        getAdsParamsData.chooseType === 0
                      "
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.electrifyState || "--" }}
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '资产编号'">
                    <el-table-column
                      v-if="item.isChecked && getAdsParamsData.chooseType === 0"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.assetTag || "--" }}</span>
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '媒体等级'">
                    <el-table-column
                      v-if="item.isChecked && getAdsParamsData.chooseType === 0"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        {{
                          scope.row.mediaLevel !== ""
                            ? scope.row.mediaLevel + "级"
                            : "--"
                        }}
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '广告限制'">
                    <el-table-column
                      v-if="item.isChecked"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.adLimit || "--" }}</span>
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '楼盘类型'">
                    <el-table-column
                      v-if="item.isChecked"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.buildType || "--" }}</span>
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '媒体状态'">
                    <el-table-column
                      class="tar"
                      v-if="item.isChecked && getAdsParamsData.chooseType === 0"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '楼盘价格'">
                    <el-table-column
                      align="right"
                      v-if="item.isChecked"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        <span>&yen;{{ scope.row.buildPrice }}</span>
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '人流量'">
                    <el-table-column
                      v-if="item.isChecked"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.peopleFlow || "--" }}
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '车位数'">
                    <el-table-column
                      align="right"
                      v-if="item.isChecked"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.parkSpaceNum || "--" }}
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '车流量'">
                    <el-table-column
                      align="right"
                      v-if="item.isChecked"
                      :label="item.label"
                      :width="item.width"
                      :prop="item.prop"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                      <template slot-scope="scope">
                        {{ scope.row.carFlow || "--" }}
                      </template>
                    </el-table-column>
                  </template>

                  <template v-else-if="item.label === '排期'">
                    <el-table-column
                      v-if="item.isChecked"
                      :label="item.label"
                      :width="item.width"
                      :prop="item.prop"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix"
                      align="center"
                    >
                    </el-table-column>
                  </template>

                  <template v-else>
                    <el-table-column
                      v-if="item.isChecked"
                      :label="item.label"
                      :prop="item.prop"
                      :width="item.width"
                      :show-overflow-tooltip="item.showTooltip"
                      :fixed="item.fix === 'left' ? true : false"
                    >
                    </el-table-column>
                  </template>
                </template>
              </el-table>
              <div class="ad_pagination" v-if="total">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  @current-change="changePage"
                  @size-change="sizeChange"
                  :page-sizes="[10, 20, 50, 100, 500]"
                  :current-page.sync="pageNo"
                  :page-size="pageSize"
                  :total="total"
                >
                </el-pagination>
              </div>
            </div>
            <!--购物车-->
            <el-dialog
              title="已选点位"
              :visible.sync="dialogTableVisible"
              custom-class="custom-dialog-wrapper shop-cart-wrapper"
            >
              <div class="table_wrap car-list" style="margin-top: 60px">
                <div class="table_box shopcar_box">
                  <el-row class="top-row">
                    <el-col :span="8">
                      <el-radio-group
                        v-model="activeName"
                        size="small"
                        @change="handleClick"
                      >
                        <el-radio-button
                          :label="index + ''"
                          v-for="(item, index) in typeShopList"
                          :key="index"
                          >{{ item.mediaTypeName }}</el-radio-button
                        >
                      </el-radio-group>
                    </el-col>

                    <el-col :span="16" style="text-align: right">
                      <span class="button_point">
                        <el-button
                          plain
                          @click="getMapADList"
                          size="small"
                          class="mapBtn"
                          :disabled="mapBtn"
                          >获取地图选点</el-button
                        >
                      </span>
                      <el-dropdown size="small" type="primary">
                        <el-button type="primary" style="padding: 0 8px">
                          快捷配点<i
                            class="el-icon-arrow-down el-icon--right"
                          ></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-for="item of eventList"
                            :key="item.value"
                            @click.native.prevent="changeEvent(item.value)"
                            >{{ item.label }}</el-dropdown-item
                          >
                          <el-dropdown-item
                            v-for="(spaceItem, spaceKey) in adSpaceStatistics"
                            :key="spaceKey"
                            @click.native.prevent="removeAllType(spaceKey)"
                            >{{ `移除同媒体${spaceKey}` }}</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                  <el-row class="car-title">
                    <i class="el-icon-info"></i>
                    小区:<span>{{ shopMedia_ADNum.resNum }}</span
                    >(选1面:<span>{{ shopMedia_ADNum.oneNum }}</span>
                    选2面:<span>{{ shopMedia_ADNum.twoNum }}</span> 选3面:<span
                      >{{ shopMedia_ADNum.threeNum }}</span
                    >
                    选更多:<span>{{ shopMedia_ADNum.moreNum }}</span
                    >)
                    <div class="divide-border"></div>
                    媒体:<span>{{ shopMedia_ADNum.mediaNum }}</span>
                    <div class="divide-border"></div>
                    点位:<span>{{ shopMedia_ADNum.ADNum }}</span
                    >(<span
                      v-for="(spaceItem, spaceKey) in adSpaceStatistics"
                      :key="spaceKey"
                    >
                      {{ spaceKey }}:<span>{{ spaceItem || 0 }}</span></span
                    >)
                    <div class="divide-border"></div>
                    A级:<span>{{ mediaLevelNum.ALevel }}</span> B级:<span>{{
                      mediaLevelNum.BLevel
                    }}</span>
                    C级:<span>{{ mediaLevelNum.CLevel }}</span>
                  </el-row>
                  <el-table
                    border
                    :data="currentPagination"
                    :default-sort="{ prop: 'mID', order: 'descending' }"
                    :row-class-name="tableRowClassName"
                    @row-click="shopRowClick"
                    style="width: 100%"
                  >
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form
                          label-position="left"
                          inline
                          class="demo-table-expand"
                        >
                          <el-form-item label="商圈：">
                            <div class="shopList_adLimit" style="width: 80px">
                              <span>{{ props.row.tradingArea }}</span>
                            </div>
                          </el-form-item>
                          <el-form-item label="小区户数：">
                            <span>{{ props.row.houseNum }}</span>
                          </el-form-item>
                          <el-form-item label="楼盘价格：">
                            <span>&yen;{{ props.row.buildPrice }}</span>
                          </el-form-item>
                          <el-form-item label="资产编号：">
                            <div class="shopList_adLimit" style="width: 80px">
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
                        <el-form
                          v-if="customPermission.patrolPermission"
                          label-position="left"
                          inline
                          class="demo-table-expand"
                        >
                          <el-form-item label="巡点问题：">
                            <div class="shopList_adLimit">
                              <span>{{ props.row.remark }}</span>
                            </div>
                          </el-form-item>
                          <el-form-item label="通行情况：">
                            <div class="shopList_adLimit">
                              <span>{{ props.row.trafficState }}</span>
                            </div>
                          </el-form-item>
                          <el-form-item
                            label="通电情况："
                            v-if="customPermission.patrolPermission == 2"
                          >
                            <div class="shopList_adLimit">
                              <span>{{ props.row.electrifyState }}</span>
                            </div>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="资源名称"
                      min-width="140"
                      prop="resName"
                      show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column label="媒体名称" min-width="130">
                      <template slot-scope="scope">
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="scope.row.mediaName"
                          placement="bottom"
                        >
                          <span>{{ scope.row.mediaName }}</span>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                    <el-table-column prop="city" label="城市" min-width="80">
                    </el-table-column>
                    <el-table-column prop="origin" label="区域" min-width="80">
                    </el-table-column>
                    <el-table-column
                      prop="scope"
                      label="地图中心点"
                      min-width="105"
                    >
                      <template slot-scope="scope">
                        <el-tooltip
                          v-if="scope.row.mapCenter"
                          :content="scope.row.mapCenter"
                          placement="bottom-start"
                          :visible-arrow="false"
                        >
                          <span>{{ scope.row.mapCenter || "--" }}</span>
                        </el-tooltip>
                        <span v-else> {{ scope.row.mapCenter || "--" }} </span>
                      </template>
                    </el-table-column>
                    <el-table-column label="楼盘类型" min-width="85">
                      <template slot-scope="scope">
                        {{ scope.row.buildType || "--" }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="mediaLevel"
                      label="媒体等级"
                      min-width="85"
                    >
                      <template slot-scope="scope">
                        {{
                          scope.row.mediaLevel !== ""
                            ? scope.row.mediaLevel + "级"
                            : "--"
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="schedules"
                      label="排期"
                      min-width="185"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.schedules }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column min-width="65" label="投放面">
                      <template slot-scope="scope">
                        <span>{{ scope.row.asLab || "--" }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      min-width="50"
                      :render-header="renderHeader"
                    >
                      <template slot-scope="scope">
                        <span
                          style="cursor: pointer; color: #1890ff"
                          @click="deleteRow(scope.row)"
                        >
                          <i
                            class="el-icon-delete"
                            style="
                              color: #108de7;
                              font-size: 20px;
                              margin-left: 6px;
                            "
                          ></i>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div class="row-table-bottom">
                    <p class="warningInfo">
                      <span
                        style="background: #ffc1be"
                        class="warningInfoColor"
                      ></span>
                      <span class="warningInfoName">被占点位</span>
                      <span
                        style="background: #ffe093"
                        class="warningInfoColor"
                      ></span>
                      <span class="warningInfoName"
                        >连排门、同行资源回避、同行媒体回避</span
                      >
                    </p>
                    <el-pagination
                      background
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[10, 20, 50, 100, 500]"
                      :page-size="cartPageSize"
                      :pager-count="5"
                      class="cart-pagination"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="totalNum"
                    >
                    </el-pagination>
                  </div>
                </div>

                <div class="shop-cart-footer">
                  <el-button @click="next" type="primary">下一步 </el-button>
                </div>
              </div>
            </el-dialog>
          </div>
        </div>
        <div class="step4" v-if="active == 3">
          <div class="createSuccess">
            <div class="successIcon">
              <img src="../../assets/images/createSuccess.png" alt="" />
              <h2>创建成功</h2>
              <p>创建时间：{{ dateTime }}</p>
            </div>
            <div class="planPanel noShareUl">
              <ul>
                <li><em>方案名称：</em>{{ planForm.planName }}</li>
                <li><em>所属客户：</em>{{ cName }}</li>
                <li><em>所属品牌：</em>{{ cBand || "--" }}</li>
                <!-- <li class="money"><em>订单金额：</em>¥{{priceFormat(totalPrice)}}</li> -->
                <li
                  style="
                    display: flex;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  <em>协同选点：</em
                  ><span id="shareUrl" class="plan-url">{{ shareADUrl }}</span>
                  <span @click="copyUrl" class="urlBtn">复制</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_bottom_btn">
      <el-button
        plain
        @click="prev"
        v-if="active == 1 || active == 2"
        type="default"
        >上一步
      </el-button>
      <el-button plain @click="clearData" v-if="active === 0" type="default"
        >取消
      </el-button>
      <el-button @click="next" v-if="active == 0 || active == 1" type="primary">
        下一步
      </el-button>
      <el-button @click="next" v-if="active == 2" type="primary"
        >创建方案
      </el-button>
      <div class="finishBtn" v-if="active == 3">
        <el-button type="default" @click="continueCreate">继续创建</el-button>
        <el-button plain type="default" @click="ToDetail"> 查看方案 </el-button>
        <el-button @click="downLoadFanan()" type="primary">导出方案</el-button>
      </div>
    </div>
    <!--添加商品到购物车的动画效果-->
    <div class="shopAnimate" v-show="shoppingShow">
      <img src="../../assets/images/select.png" alt="" />
    </div>
    <div class="shopAnimateAll" v-show="selectAll">
      <img src="../../assets/images/allselect.png" alt="" />
    </div>
    <!--查询被占模态框-->
    <el-dialog
      title="被占信息"
      :visible.sync="beOccupiedDialogVisible"
      :modal="false"
      top="30vh"
      width="30%"
    >
      <ul>
        <li v-for="(item, index) in beOccupiedAdsData" :key="index">
          <p>
            <span style="color: #333">占点方案：</span>
            <span
              v-if="['ADN_MD_COUNTRY', 'ADN_MD'].includes(sessionData.uType)"
              ><span style="font-weight: bold">{{ item.beOccupieApName }}</span>
              方案（{{
                item.lState == 0
                  ? "预锁"
                  : item.lState == 1
                  ? "被占"
                  : "强制停止"
              }}）</span
            >
            <span v-else>******</span>
          </p>
          <p><span style="color: #333">占点排期：</span>{{ item.schedules }}</p>
        </li>
      </ul>
    </el-dialog>
    <!--连排门信息模态框-->
    <el-dialog
      title="信息提示"
      :visible.sync="connectAdDialogVisible"
      :modal="false"
      top="30vh"
      width="30%"
    >
      <ul>
        <li v-show="ActiveConnectADList.connectResName !== ''">
          <p>
            <span style="color: #333">资源名称：</span>
            <span style="font-weight: bold">{{
              ActiveConnectADList.connectResName
            }}</span>
          </p>
          <p>
            <span style="color: #333">媒体名称（连排门）：</span>
            <span style="font-weight: bold"
              >{{ ActiveConnectADList.connectMedia }}为连排门</span
            >
          </p>
        </li>
        <li v-show="ActiveConnectADList.commentWorkRes !== ''">
          <p>
            <span>同行资源回避：该社区已有同行广告主投放</span>
            <span style="font-weight: bold"
              >({{ ActiveConnectADList.commentWorkRes }})</span
            >
          </p>
        </li>
        <li v-show="ActiveConnectADList.commentworkMedia !== ''">
          <p>
            <span
              >同行媒体回避：{{
                ActiveConnectADList.asLab
              }}点已有同行广告主投放</span
            >
            <span style="font-weight: bold"
              >({{ ActiveConnectADList.commentworkMedia }})</span
            >
          </p>
        </li>
      </ul>
    </el-dialog>
    <!--一键选点模态框-->
    <el-dialog
      title="一键选点"
      :visible.sync="dialogOneKeyPoint"
      width="410px"
      style="margin-top: 20vh"
    >
      <div class="onKeyPointFrom">
        <el-form
          ref="oneKeyPointData"
          :model="oneKeyPointData"
          label-width="85px"
          :rules="oneKeyPointDataRules"
        >
          <el-form-item label="点位总量: " prop="TotalPoint">
            <el-input v-model="oneKeyPointData.TotalPoint"></el-input>
          </el-form-item>
          <el-form-item label="每小区选: " prop="pointNumByRes">
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
        <el-button plain @click="dialogOneKeyPoint = false">取 消</el-button>
        <el-button type="primary" @click="oneKeyPointBtn('oneKeyPointData')"
          >一键选点</el-button
        >
      </span>
    </el-dialog>
    <!-- 导入方案弹出框 -->
    <el-dialog
      class="import_fanan"
      :title="importType == '1' ? '小区导入' : '点位导入'"
      :visible.sync="isImport"
      top="30vh"
      width="360px"
    >
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
            :multiple="false"
          >
            <a
              v-if="
                importType == '1' &&
                customPermission.pptPermission &&
                customPermission.pptPermission.gzqylPermission == '1'
              "
              :href="
                this.apiVar.qadnUrl +
                '/importTemplate/广州亲粤邻小区导入定制模板_new.xlsx'
              "
              download="小区导入模板.xlsx"
              @click="dowmLoadFun"
              class="el-icon-download aButton"
              >下载模板</a
            >
            <a
              v-else-if="importType == '1'"
              :href="
                this.apiVar.qadnUrl + '/importTemplate/resTemplate_new.xlsx'
              "
              download="小区导入模板.xlsx"
              @click="dowmLoadFun"
              class="el-icon-download aButton"
              >下载模板</a
            >

            <a
              v-if="
                importType == '2' &&
                customPermission.pptPermission &&
                customPermission.pptPermission.gzqylPermission == '1'
              "
              :href="
                this.apiVar.qadnUrl +
                '/importTemplate/广州亲粤邻点位导入定制模板_new.xlsx'
              "
              download="点位导入模板.xlsx"
              @click="dowmLoadFun"
              class="el-icon-download aButton"
              >下载模板</a
            >
            <a
              v-else-if="importType == '2'"
              :href="
                this.apiVar.qadnUrl + '/importTemplate/adsTemplate_new.xlsx'
              "
              download="点位导入模板.xlsx"
              @click="dowmLoadFun"
              class="el-icon-download aButton"
              >下载模板</a
            >
            <el-button
              plain
              icon="el-icon-upload2"
              size="small"
              class="fileButton"
              >上传文件</el-button
            >
          </el-upload>
        </el-col>
      </el-row>
      <el-row v-if="importType == '2' && isShowTag" class="warning_box">
        <el-col :span="2">
          <i class="el-icon-warning" style="color: #faad14"></i>
        </el-col>
        <el-col :span="20">
          若需导入钼媒人群包进行选点，请在表格中填入正确的钼媒点位ID
        </el-col>
        <el-col :span="2">
          <i class="el-icon-close" @click="hideTag()"></i>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button plain size="small" @click="isImport = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="submitUpload()"
          >导 入</el-button
        >
      </span>
    </el-dialog>
    <!-- 导入excel点位部分失败弹框 -->
    <el-dialog
      :visible.sync="showUploadFail"
      title="导入excel的点位信息"
      top="20vh"
      width="80%"
    >
      <template v-if="importType == '1'">
        <import-result
          :importData="importInfoData"
          :name="planForm.planName"
          :customPermission="customPermission"
          :isPointSetting="isPointSetting"
          @cancel="cancelImport"
          @confirmImport="confirmImport"
          @handlePointSetting="handlePointSetting"
        ></import-result>
      </template>
      <template v-if="importType == '2'">
        <div class="car-title">
          <i class="el-icon-info"></i>
          <h4>
            已成功导入点位<span>{{ excelObj.successNum }}</span
            >个,问题点位<span>{{ excelObj.failNum }}</span
            >个
            <span @click="downLoadExcel()"
              >下载表格<i class="el-icon-download"></i
            ></span>
          </h4>
        </div>
        <el-table border :data="excelDataUpload" style="width: 100%">
          <el-table-column label="资源名称" min-width="140" prop="resName">
          </el-table-column>
          <el-table-column prop="city" label="市" min-width="85">
          </el-table-column>
          <el-table-column prop="origin" label="区" min-width="85">
          </el-table-column>
          <el-table-column prop="mediaName" label="媒体名称" min-width="130">
          </el-table-column>
          <el-table-column min-width="70" label="投放面">
            <template slot-scope="scope">
              <span>{{ scope.row.asLab }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="assetTag" label="资产编号" min-width="130">
          </el-table-column>
          <el-table-column prop="schedules" label="排期" min-width="160">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.schedules"
                placement="bottom"
              >
                <span>{{ scope.row.schedules }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="failReason"
            label="失败原因"
            min-width="130"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
    <!-- 复制方案弹出框 -->
    <el-dialog :visible.sync="isCopy" title="复制方案" width="450px">
      <el-select
        v-model="orderName"
        size="small"
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteGetOrder"
        :loading="loadingOrder"
      >
        <el-option
          v-for="item of orderArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button plain size="small" @click="isCopy = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmCopy()"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 导入小区弹窗 -->
    <PointSetting
      :visible.sync="pointSettingShow"
      :rejectAdPlan="rejectAdPlan"
      :mTypeList="mTypeList"
      :sites="sites"
      :matchKeys="pointMatchKeys"
      @handleDetails="handlePointDetails"
    >
    </PointSetting>
    <PointTable
      :visible.sync="pointTableShow"
      :importData="adResMatch"
      @savePoint="savePoint"
      @resetPoint="resetPoint"
    >
    </PointTable>
  </div>
</template>

<script>
import {
  Input,
  Dialog,
  Button,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Cascader,
  DatePicker,
  Select,
  Option,
  Form,
  FormItem,
  Steps,
  Step,
  Badge,
  Checkbox,
  Message,
  InputNumber,
  Radio,
} from "element-ui";
import api from "../../api/api";
import areaArr from "../../commonFun/areaPackage_new";
import commaFormat from "../../commonFun/commaFormat";
import sessFun from "../../commonFun/sessFun.js";
// 时间格式化
import timeFormat from "../../commonFun/timeFormat";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
import sheetExcel from "../../commonFun/sheetExcel.js";
// 方案缓存
import cacheAdPlan from "../../commonFun/cacheAdPlan";
// 方案导入结果
import importResult from "./components/importResult.vue";

// 表格控件
import TableSetting from "./components/TableSetting";

// 导入小区设置
import PointSetting from "./components/tempComp/pointSetting.vue";
import PointTable from "./components/tempComp/pointTable.vue";

export default {
  name: "createPlanOld",
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
    importResult,
    TableSetting,
    PointSetting,
    PointTable,
  },
  data() {
    let validateSales = (rule, value, callback) => {
      if (value) {
        if (this.BDData.uid === "0") {
          callback(new Error("请输入正确的账号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validateName = (rule, value, callback) => {
      if (value) {
        if (value.match(/\s/)) {
          callback(new Error("方案名称不能带有空格"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validateNum = (rule, value, callback) => {
      let reg = /^[0-9]+$/;
      if (!reg.test(value)) {
        callback(new Error("只能输入整数值"));
      } else {
        if (value < 1) {
          callback(new Error("点位数不能为0"));
        } else {
          callback();
        }
      }
    };
    let validateCale = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value !== "" && !reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        if (value < 0 || value > 100) {
          callback(new Error("只能输入数字(0-100)"));
        } else {
          callback();
        }
      }
    };
    return {
      isPay: 0,
      cacheAsrID: "", //缓存的公司id
      // doUpload: 'https://beta.qinlinad.com/Advertisement/AnalysisExcelAdBaseInfo',
      doUpload: "/advertisement/AnalysisExcelAdBaseInfo",
      active: 0, // 当前步骤step
      mapADDialog: false,
      loading: true, //加载中
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      selectedOptions: [],
      cityOptions: [],
      // 判断是否可选择全国城市
      cityOther: false,
      // 判断登录用户是否为销售
      isBD: true,
      // 媒体类型 广告门、道闸
      currentMediaType: "",
      // 动画起始坐标
      shopXY: { x: "", y: "" },
      //动画效果的显示隐藏
      shoppingShow: false,
      // 是否全选
      selectAll: false,
      bodyWidth: 1920,
      // 媒体类型数组
      mediaTypeObjectArr: [],
      city: [], // step2 城市
      area: [], // step2城市下属区域
      activeIndex: 0, //step2当前选中的城市下标
      activeRName: "", //step2当前选中的城市名称
      areaName: "全市", // step2当前选中的区域
      areaRid: "", // step2当前选中的区域rid
      totalPrice: 0, //总价
      remark: "无", //备注
      cash: 0, // 现金结算
      zyzh: 0, // 资源置换
      other: 0, // 其他费用
      customer: [], // step1公司客户
      companyName: [], //step1公司名称
      cName: "", // 选中公司名称
      companyBrand: [], //step1公司品牌
      cBand: "", // 选中的品牌
      ownerBU: [], //step1联系人
      //step1投放城市
      throwCity: [],
      //购物车
      dialogTableVisible: false,
      //搜索类型
      typeSelect: [
        {
          value: "资源名称",
          label: "资源名称",
        },
        {
          value: "商圈",
          label: "商圈",
        },
        {
          value: "资产编号",
          label: "资产编号",
        },
        {
          value: "被占查询",
          label: "被占查询",
        },
      ],
      //默认
      selectValue: "资源名称",
      //楼盘类型
      buildType: [
        { buildlabel: "住宅", buildValue: "住宅" },
        { buildlabel: "写字楼", buildValue: "写字楼" },
        { buildlabel: "别墅", buildValue: "别墅" },
        { buildlabel: "商住楼", buildValue: "商住楼" },
        { buildlabel: "公共场所", buildValue: "公共场所" },
      ],
      village: [
        // 社区
        { buildlabel: "高端住宅", buildValue: "高端住宅" },
        { buildlabel: "普通住宅", buildValue: "普通住宅" },
        { buildlabel: "单体楼", buildValue: "单体楼" },
        { buildlabel: "别墅", buildValue: "别墅" },
        { buildlabel: "洋房", buildValue: "洋房" },
        { buildlabel: "商住或商用", buildValue: "商住或商用" },
        { buildlabel: "公共场所", buildValue: "公共场所" },
      ],
      officeBuilding: [
        // 写字楼类型
        { buildValue: "单纯性写字楼", buildlabel: "单纯性写字楼" },
        { buildValue: "商住型写字楼", buildlabel: "商住型写字楼" },
        { buildValue: "综合型写字楼", buildlabel: "综合型写字楼" },
        { buildValue: "工业园区", buildlabel: "工业园区" },
      ],
      buildValue: "",
      //搜索框
      searchInput: "",
      planSelect: "",
      activeGrade: "", // 媒体等级
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
      },
      dateInput: [], // 时间输入框
      beforeDate: [], // 时间输入框的前一次时间
      //setp1创建方案表单
      planForm: {
        planName: "",
        ownerSales: "", // 所属销售
        companyName: "",
        companyBrand: "",
        throwCity: [],
        ownerBU: "", // 所属联系人
        planRemark: "",
        pointOfAsrIDs: [], // 点位所属公司id组合，根据城市联动
        opportunityId: undefined, // 关联商机
        customerMediaType: undefined, // 关联商机
      },
      pointOfAsrIDs: [],
      // 本地客户商机列表
      opportunityList: [],
      // 销售crm的媒体类型列表
      customerMediaTypeList: [],
      // 媒介选择所属销售列表
      salerList: [],
      // 获取销售选项loading
      salerListLoading: false,
      //
      industryID: "", // 所选公司所在的行业
      planRules: {
        planName: [
          { validator: validateName, trigger: "blur" },
          {
            required: true,
            type: "string",
            message: "方案名称不能为空",
            trigger: "blur",
          },
          { max: 30, message: "最多只能输入30个字节", trigger: "blur" },
        ],
        ownerBU: [
          { required: true, message: "请选择联系人", trigger: "change" },
        ],
        ownerSales: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { validator: validateSales, trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "请选择公司名称", trigger: "change" },
        ],
        companyBrand: [
          { required: true, message: "请选择公司品牌", trigger: "change" },
        ],
        throwCity: [
          {
            required: true,
            message: "请选择投放城市(可多选)",
            trigger: "change",
          },
        ],
        pointOfAsrIDs: [
          {
            required: true,
            message: "请选择归属公司(可多选)",
            trigger: "blur",
          },
        ],
        /* opportunityId: [
          {
            required: true,
            message: "请选择关联商机",
            trigger: "blur",
          },
        ], */
        customerMediaType: [
          {
            required: true,
            message: "请选择媒体类型",
            trigger: "blur",
          },
        ],
      },
      shopingList: [], // step2购物车列表
      // 购物车展示的数据
      typeShopList: [],
      activeName: "0",
      eventList: [],
      // 购物车表格数据
      shopShowList: [],
      planList: [], //step2可选点位列表
      IsAll: false, //当前是否为全选状态
      sessionData: "", // 登录用户的数据
      FAData: { apID: "" }, // 创建方后台返回的数据
      timeout: null,
      BDData: { uid: "0", realName: "", uType: "" },
      HSearch: "", // 获取传值显示‘清除’、‘确定’按钮
      houseNum: ["", ""], // 表头搜索住户数量
      buildNum: ["", ""], // 表头搜索楼栋数量
      buildPrice: ["", ""], // 表头搜索楼盘价格
      liveYear: ["", ""], // 表头搜索入住年份
      peopleFlow: ["", ""], // 表头搜索人流量
      carFlow: ["", ""], // 表头搜索车位数
      parkSpaceNum: ["", ""], // 表头搜索车流量
      filterData: {
        // 记录判断含有哪些表头的过滤条件
        hNum: false,
        bNum: false,
        bPrice: false,
        lYear: false,
        pFlow: false,
        cFlow: false,
        pSNum: false,
      },
      loadSign: true, // table滚轮
      shopMedia_ADNum: {
        resNum: 0,
        mediaNum: 0,
        ADNum: 0,
        oneNum: 0,
        twoNum: 0,
        threeNum: 0,
        moreNum: 0,
      },
      ADloading: "", // 创建方案、提交选点和报价单时的loading
      areaCity: [],
      activeCityData: {}, // 城市切换的数据，默认为this.city[0]
      dateTime: "", // 获取今天日期
      ADLimit: [
        // step2 广告限制
        { value: "地产", label: "地产" },
      ],
      limitName: "全部", // 当前广告限制高亮，默认为全部
      limitList: [], // 当前选择的广告限制
      filterCondition: [], // 当前过滤条件
      commentMediaADNum: [], // 统计同一城市相同因不同排期而选择相同的asid
      mapADList: [], // 地图选择的点位数据
      mapParams: {}, // 记录当前地图选点时的参数，包括排期、城市名和rid
      mapBtn: true, // 获取地图选点数据的按钮，默认不可点击
      getMapLoading: "", // 获取地图选点时的loading
      // 是否导入方案
      isImport: false,
      importType: "",
      isShowTag: true,
      // 当前上传文件的数据- 表格
      fileData: [],
      // 导入excel部分失败弹出框
      showUploadFail: false,
      // 导入excel之后返回的失败成功点数
      excelObj: {
        successNum: 0,
        failNum: 0,
      },
      // excel导入返回来的数据
      importInfoData: {},
      // 导入excel之后返回的数组
      excelDataUpload: [],
      // 复制方案
      isCopy: false,
      // 搜索方案时的loading
      loadingOrder: false,
      // 搜索方案名称
      orderName: "",
      // 返回的订单列表
      orderArr: [],
      apAicode: "", // 方案的协同aicode
      shareADUrl: "", // 协同选点的url https://beta.qinlinad.com/shareADList?apid=649&aicode=0DDD2685D9D3842ECB0DDC45D79D2131
      dialogOneKeyPoint: false, // 一键选点模态框
      oneKeyPointData: {
        TotalPoint: "",
        pointNumByRes: "",
        A_cale: 0,
        B_cale: 0,
      }, // 一键选点的参数
      oneKeyPointDataRules: {
        TotalPoint: [
          { required: true, message: "点位数不能为空", trigger: "blur" },
          { validator: validateNum, trigger: "blur" },
        ],
        pointNumByRes: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: validateNum, trigger: "blur" },
        ],
        A_cale: [
          { required: true, message: "A面占比不能为空", trigger: "blur" },
          { validator: validateCale, trigger: "blur" },
        ],
      },
      beOccupiedDialogVisible: false, // 被占模态框
      beOccupiedNumber: 0, // 第一次搜索记录时提前保存 planList
      isOccupied: true, // 被占搜索时隐藏过滤条件
      beOccupiedAdsData: [], // 当前点击行的被占信息{beOccupieApName:'',lState: '',schedules: ''}
      shopDelRowClick: false,
      pageNo: 1, // 页码
      total: 1, // 总页数
      pageSize: 20, //每页条数
      getAdsParamsData: {
        chooseType: 0,
      }, //　获取点位列表的参数data
      apMinTime: "", // 方案创建的开始时间
      ADLimitActiveName: "1",
      isShowAll: false, // 控制表头显示时的过渡效果
      searchBtnAbled: false, // 搜索按钮禁止
      //   isCityPrice: false, // 判断城市最大价格是否大于2000w
      connectAdDialogVisible: false, // 连排门模态框
      ActiveConnectADList: {}, // 购物车 - 当前点击行的连排门信息
      mediaLevelNum: { ALevel: 0, BLevel: 0, CLevel: 0, ANum: 0, BNum: 0 },
      adSpaceStatistics: {},
      indexData: "", // 首页来源的数据-前置地图选点
      unfinishedData: "", // 未完成方案信息
      /*方案排斥*/
      activeSelect: "1", //
      rejectAdPlan: [], // 排斥方案选项
      activeAdPlan: "", // 当前选择的方案
      routePath: "",
      isSelect: false, // 判断是否已经选择过点位
      // 方案是否创建中，防多次点击创建-节流
      creating: false,
      // 地图类型
      ActiveMapType: 2,
      // 亲邻地图
      mapAdsList: [],
      currPageAsLength: 0, //当前页面可选的点位总数
      currPageSelect: 0, //当前页面已选择的点位数
      adsCount: 0, //总可选点位
      // 定制权限
      customPermission: {},
      // 购物车分页时页面条目数量
      cartPageSize: 500,
      currentPage: 1,
      totalNum: 0,

      // 表头数据
      currentColumn: [
        {
          id: 1,
          label: "资源名称",
          prop: "resName",
          width: "200",
          isChecked: true,
          fix: "not",
          showTooltip: true,
        },
        {
          id: 2,
          label: "媒体名称",
          prop: "mediaName",
          width: "140",
          isChecked: true,
          fix: "left",
          showTooltip: true,
        },
        {
          id: new Date().getDate(),
          label: "楼栋号",
          prop: "buildingName",
          width: "140",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: new Date().getDate(),
          label: "单元号",
          prop: "unitName",
          width: "140",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 3,
          label: "城市",
          prop: "city",
          width: "110",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 4,
          label: "区域",
          prop: "origin",
          width: "110",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 6,
          label: "商圈",
          prop: "tradingArea",
          width: "120",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 7,
          label: "媒体备注",
          prop: "mediaRemark",
          width: "140",
          isChecked: true,
          fix: "not",
          showTooltip: true,
        },
        {
          id: 8,
          label: "巡点问题",
          prop: "remark",
          width: "110",
          isChecked: true,
          fix: "not",
          showTooltip: true,
        },
        {
          id: 9,
          label: "通行情况",
          prop: "trafficState",
          width: "110",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 10,
          label: "通电情况",
          prop: "electrifyState",
          width: "110",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 11,
          label: "资产编号",
          prop: "assetTag",
          width: "160",
          isChecked: true,
          fix: "not",
          showTooltip: true,
        },
        {
          id: 12,
          label: "媒体等级",
          prop: "mediaLevel",
          width: "120",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 13,
          label: "广告限制",
          prop: "adLimit",
          width: "130",
          isChecked: true,
          fix: "not",
          showTooltip: true,
        },
        {
          id: 14,
          label: "楼盘类型",
          prop: "buildType",
          width: "100",
          isChecked: true,
          fix: "not",
          showTooltip: true,
        },
        {
          id: 15,
          label: "媒体状态",
          prop: "mState",
          width: "100",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 16,
          label: "楼盘价格",
          prop: "buildPrice",
          width: "110",
          isChecked: true,
          showTooltip: false,
          fix: "not",
        },
        {
          id: 17,
          label: "楼栋数量",
          prop: "buildNum",
          width: "100",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: new Date().getDate(),
          label: "单元数量",
          prop: "unitCount",
          width: "100",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 18,
          label: "入住年份",
          prop: "liveYear",
          width: "90",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 19,
          label: "小区户数",
          prop: "houseNum",
          width: "90",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 20,
          label: "人流量",
          prop: "peopleFlow",
          width: "110",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 21,
          label: "车位数",
          prop: "parkSpaceNum",
          width: "90",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 22,
          label: "车流量",
          prop: "carFlow",
          width: "110",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 23,
          label: "车位数",
          prop: "parkSpaceNum",
          width: "90",
          isChecked: true,
          fix: "not",
          showTooltip: false,
        },
        {
          id: 24,
          label: "排期",
          prop: "schedules",
          width: "190",
          isChecked: true,
          fix: "right",
          showTooltip: false,
        },
      ],
      itemKey: "",
      rowSpace: "",

      tabChooseTypeList: [
        {
          label: 0,
          name: "点位",
        },
        {
          label: 1,
          name: "单元",
        },
        {
          label: 2,
          name: "楼栋",
        },
        {
          label: 3,
          name: "小区",
        },
      ],

      // 设备型号
      mTypeList: [],
      mediaMType: "",

      // 安装位置
      sites: [],
      site: "",

      // 位置朝向
      siteOrientations: [
        {
          id: 1,
          name: "内",
        },
        {
          id: 2,
          name: "外",
        },
      ],
      siteOrientation: "",

      pointCountType: "",

      // 楼栋数量map
      buildingIdMap: {},
      // 单元数量map
      unitIdMap: {},
      // 小区数量map
      resIDMap: {},
      // 小区导入设置弹窗
      pointSettingShow: false,

      // 是否要配点
      isPointSetting: false,
      // 配点匹配数据
      pointMatchKeys: {},
      // 配点成功数据
      adResMatch: {},
      pointTableShow: false,
    };
  },
  created() {
    this.getsessionData(); // 获取session中的数据
    this.requestIsPay();
    this.getCustomerMediaTypeList();
  },
  mounted() {
    this.areaCity = areaArr.cityArea();
    this.getADLimit(); // 获取广告限制列表
    // 设置购物车动画起点位置
    this.setShopAnimate();
    // 获取未完成的方案并填充
    this.routePath = this.$route.fullPath;
    if (this.routePath.indexOf("unfinishedPlan") !== -1) {
      this.setPlanInfo();
    }
    // console.log("this.cityOptions", this.cityOptions);
  },
  watch: {
    "planForm.throwCity": {
      handler: function () {
        this.planForm.pointOfAsrIDs = [];
        this.pointOfAsrIDs = [];
        if (this.planForm.throwCity.length == 0) return;
        this.getPointOfAsr();
      },
    },

    "planForm.companyBrand": {
      handler: function () {
        this.planForm.opportunityId = undefined;
        this.opportunityList = [];
        if (
          !this.planForm.companyBrand &&
          typeof this.planForm.companyBrand !== "number"
        )
          return;
        this.getOpportunityList();
      },
    },

    "getAdsParamsData.chooseType": {
      handler(nVal) {
        if (nVal === 1 || nVal === 2 || nVal === 3) {
          const index = this.currentColumn.findIndex((item) => {
            return item.prop === "mediaName";
          });
          this.currentColumn.splice(index, 1);
        }
        let pointCountType = "";
        if (nVal === 1) {
          pointCountType = "unitId";
        } else if (nVal === 2) {
          pointCountType = "buildingId";
        } else if (nVal === 3) {
          pointCountType = "resID";
        }
        this.pointCountType = pointCountType;
        this.getAdList();
      },
    },
  },
  computed: {
    nowPointNum() {
      if (this.dialogTableVisible) {
        this.resetConnectAdData();
        this.computeConnectAdData();
      }
      // 当购物车点位数大于0时
      if (this.shopingList.length || this.isSelect) {
        this.saveApInfo();
      }
      return this.shopingList.length;
    },
    currentPagination() {
      this.totalNum = this.shopShowList.length;
      return this.shopShowList.slice(
        (this.currentPage - 1) * this.cartPageSize,
        this.currentPage * this.cartPageSize
      );
    },
  },
  methods: {
    requestIsPay() {
      api
        .getApi("/addsp/api/v1/company/isPay", {
          asrID: this.sessionData.asrID,
        })
        .then((res) => {
          if (res.data.SysCode === 200200 && res.data.data === true) {
            this.isPay = 1;
          }
        });
    },
    handleSizeChange(val) {
      this.cartPageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 分页
    changePage(val) {
      this.currPageSelect = 0;
      this.IsAll = false;
      this.pageNo = val;
      this.getAdList();
    },
    // 每页条数切换
    sizeChange(val) {
      this.IsAll = false;
      this.pageSize = val;
      this.pageNo = 1;
      this.getAdList();
    },
    // 获取浏览器session数据
    getsessionData() {
      this.sessionData = sessFun.getSess();
      let sess = this.sessionData;
      this.customPermission = sess.customPermission;
      if (["ADN_BD_KA", "ADN_BD"].includes(this.sessionData.uType)) {
        this.BDData.realName = sess.realName; // username
        this.planForm.ownerSales = this.BDData.realName;
        this.BDData.uid = sess.uID;
        this.BDData.uType = sess.uType;
        this.BDData.asrID = sess.asrID;
        this.isBD = true;
        this.getCityList(); // 获取权限下的城市列表
        this.Get_cName();
      } else {
        this.isBD = false;
      }
      this.dateTime = timeFormat.returnDayCount(0, "/");
      let starTime, endTime;
      starTime = timeFormat.returnDayCount(1, "/");
      endTime = timeFormat.returnDayCount(14, "/");
      this.dateInput = [starTime, endTime]; // 设置默认时间
      this.beforeDate = [starTime, endTime];
      // 判断是否来至于首页的前置地图选点
      let inputPath = this.$route.fullPath;
      if (inputPath.indexOf("from=index") !== -1) {
        this.setDataByIndex();
      }
      //   console.log("this.dateInput", this.dateInput);
    },
    // 动态设置购物车动画起点位置
    setShopAnimate() {
      // 注：window.onresize只能在项目内触发1次
      let that = this;
      // 实时监控body的宽带。注：修改该方法后要重启项目并重新打开页面
      window.onresize = function windowResize() {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        that.bodyWidth = document.body.offsetWidth;
        that.shopXY.x = that.bodyWidth - 170;
        shopAnimate.style.right = that.shopXY.x + "px";
      };
      let Right = document.body.offsetWidth - 835;
      this.shopXY.x = Right;
      let shopAnimate = document.getElementsByClassName("shopAnimate")[0];
      shopAnimate.style.right = this.shopXY.x + "px";
    },
    // 跳转来源于首页地图选点-设置部分默认数据
    setDataByIndex() {
      this.indexData = JSON.parse(sessionStorage.getItem("indexData"));
      this.ActiveMapType = this.indexData.activeMapType;
      this.dialogTableVisible = true;
      this.planForm.throwCity.push(this.indexData.rid);
    },
    // 获取权限下的城市列表
    getCityList() {
      this.cityOther = false;
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      if (!this.isBD) {
        params.suID = this.BDData.uid;
      }
      api
        .getApi(this.apiVar.Advertisement + "/GetFanganCity", params)
        .then((res) => {
          if (
            res.data.SysCode === 100200 ||
            res.data.MSG === "该用户暂未分配公司！"
          ) {
            sessFun.messageFun("warning", res.data.MSG);
          } else {
            if (res.data !== "" && res.data !== null) {
              let resData = res.data;
              let cityList = [];
              for (let j = 0; j < resData.length; j++) {
                let cityObj = {
                  label: resData[j].rName,
                  value: resData[j].rID.toString(),
                };
                cityList.push(cityObj);
              }
              this.throwCity = cityList;
              this.cityOptions = areaArr.province();
            } else {
              sessFun.messageFun("warning", "城市数据获取异常");
            }
          }
        });
    },
    // 获取所选权限城市下的点位所属公司
    getPointOfAsr() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        suID: this.BDData.uid,
        cityIds: this.planForm.throwCity.join(","),
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetCityAscrList", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.pointOfAsrIDs = res.data.data;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    },
    // 获取本地客户商机列表
    getOpportunityList() {
      let params = {
        brandId: this.planForm.companyBrand,
        saleId: this.BDData.uid,
      };
      api
        .getApi("/addsp/api/v1/adPlan/listLocalOpportunity", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.opportunityList = res.data.data || [];
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    },
    // 获取销售crm的媒体类型列表
    getCustomerMediaTypeList() {
      api.getApi("/addsp/api/v1/adPlan/listCustomerMediaType").then((res) => {
        if (res.data.SysCode === 200200) {
          this.customerMediaTypeList = res.data.data || [];
        } else {
          sessFun.messageFun("warning", res.data.MSG);
        }
      });
    },
    // 下一步
    next() {
      if (this.active === 0) {
        this.initMediaTag();
        this.submitForm("planForm");
      } else if (this.active === 1) {
        if (this.shopingList.length !== 0) {
          this.getBand(); // 获取公司品牌
          // 防多次点击创建
          if (!this.creating) {
            this.creating = true;
            let timer = setTimeout(() => {
              this.creating = false;
              this.ADloading = this.$loading({
                lock: true,
                text: "加急创建中...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
              });
              this.creatAdPlan();
              clearTimeout(timer);
            }, 500);
          }
        } else {
          return sessFun.messageFun("warning", "请选择点位");
        }
      }
    },
    // 上一步
    prev() {
      if (this.active < 1) {
        this.active = 0;
      } else {
        this.active--;
      }
    },
    // 第一步的取消按钮
    clearData() {
      this.$router.push("./planList");
    },
    // 获取城市中文名称
    getCityName(rid) {
      let str = "";
      for (let data of this.throwCity) {
        if (data.value == rid) {
          str = data.label;
          break;
        }
      }
      return str;
    },
    // 导入方案弹出框
    importFanan(type) {
      // 小区
      if (type == "res") {
        this.importType = "1";
        this.doUpload = "/advertisement/AdPlanResImport";
        const mediaItem = this.mediaTypeObjectArr.find(item => item.id === this.currentMediaType)
        if (mediaItem.name === '单元门禁灯箱') {
          this.isPointSetting = true
        } else {
          this.isPointSetting = false
        }
      }
      // 点位
      else if (type == "ads") {
        this.importType = "2";
        this.doUpload = "/advertisement/AnalysisExcelAdBaseInfo";
      } else if (type == "copy") {
        this.orderName = "";
        this.orderArr = [];
        this.isCopy = true;
        return;
      }
      this.isImport = true;
      this.fileData = [];
      this.importInfoData = {};
    },
    // 自定义上传
    uploadFile(params) {
      this.fileData = [];
      //   console.log(params);
      let fileObj = params.file;
      this.fileData.push(fileObj);
    },
    // 文件删除
    fileRemove(file, fileList) {
      //   console.log(file, fileList);
      this.fileData = fileList;
    },
    // 导入模版下载
    dowmLoadFun(event) {
      // 阻止冒泡事件
      event.stopPropagation();
    },
    hideTag() {
      this.isShowTag = false;
    },
    // 确认上传
    submitUpload() {
      if (this.fileData.length) {
        let rids = this.planForm.throwCity.join(",");
        let sess = this.sessionData;
        let info = `?uid=${sess.uID}&token=${sess.token}&suId=${
          this.BDData.uid
        }&rids=${rids}&excludedApId=${
          this.activeAdPlan ? this.activeAdPlan : ""
        }&asrIDs=${this.planForm.pointOfAsrIDs.join(",")}`;
        let formData = new FormData();
        formData.append("file", this.fileData[0]);
        if (this.importType == "2") {
          this.adsImport(formData, info);
        } else {
          this.resImport(formData, info);
        }
      } else {
        sessFun.messageFun("warning", "请先上传文件");
      }
    },
    // 点位导入
    adsImport(formData, info) {
      // 上传文件
      api
        .postUpload_file(this.doUpload + info, formData)
        .then((res) => {
          if (!res.data.SysCode) {
            let importInfo = res.data;
            // console.log("importInfo", importInfo);
            this.importInfoData = res.data;
            if (importInfo.successList.length) {
              this.setShopDataByImport(importInfo.successList);
            }
            // console.log(
            //   "importInfo.errorList.length",
            //   importInfo.errorList.length
            // );
            if (importInfo.errorList.length) {
              this.excelDataUpload = this.checkPointFun(importInfo);
              this.excelObj = {
                successNum: importInfo.successList.length,
                failNum: importInfo.errorList.length,
              };
              this.showUploadFail = true;
            }
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        })
        .catch((res) => {
          //   console.log(res);
        });
    },
    // 小区导入
    resImport(formData, info) {
      let Loading = this.$loading({
        lock: true,
        text: "快马加鞭选点中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 上传文件
      api
        .postUpload_file(this.doUpload + info, formData)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let importInfo = res.data.data;
            this.importInfoData = importInfo;
            // 配点匹配数据
            this.pointMatchKeys = {
                matchMediaCacheKey: importInfo.successSpaceKey, //导入媒体缓存
                matchResCacheKey: importInfo.successResKey //导入小区媒体
            }
            this.showUploadFail = true;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          Loading.close();
        })
        .catch((res) => {
          //   console.log(res);
          Loading.close();
        });
    },
    // 取消导入
    cancelImport() {
      this.showUploadFail = false;
      this.isImport = false;
    },
    // 确定导入
    confirmImport(arr) {
      this.showUploadFail = false;
      for (let info of arr) {
        this.isHaveDiffPush(info);
      }
      this.isImport = false;
      this.judgeByselect();
      this.dialogVisible();
    },
    // 根据导入方案返回的数据,设置购物车所需要的数据格式
    setShopDataByImport(arr) {
      console.log("方案导入返回的数据---", arr);
      for (let data of arr) {
        let info = data.adSInfo;
        for (let i = 0; i < 2; i++) {
          let importInfo = {
            mID: info.mID,
            resType: info.resType,
            resID: info.resID,
            asID: info.asID,
            asLab: info.asLab,
            resName: info.resName,
            city: info.prName,
            rid: info.prID,
            origin: info.rName,
            buildType: info.cType,
            houseNum: info.hNum,
            buildPrice: info.hPrice / 100,
            mediaName: info.mTitle || "",
            mediaTypeName: info.mediaTypeName,
            mediaTypeId: info.mediaTypeId,
            buildNum: info.fNum,
            schedules:
              timeFormat.toDate(data.pbStar, "/") +
              "-" +
              timeFormat.toDate(data.pbEnd, "/"),
            tradingArea: info.tradingArea,
            assetTag: info.assetTag,
            liveYear: info.chDay,
            mediaRemark: info.mRemark || "--",
            mapCenter: info.reference || "--", // 地图中心点
            address: info.resAddress || "",
            dNum: info.dNum || "", // 出入口数
            adLimit: info.notPush || "",
            connData: {
              connectResName: "",
              connectMedia: "",
              commentWorkRes: "",
              commentworkMedia: "",
            },
            connID: info.connID || "", // 连排门id
            industryInfos: info.industryInfos || [], // 同行业资源回避
            mediaLevel: info.grade || "",
            adPrice: (info.asPrice || 0) / 700,
            asName: info.asName || "", // 点位所属公司名称
            asrID: info.asrID, // 所属公司id
            province: info.province,
            notPush: info.notPush,
            parkSpaceNum: info.parkSpaceNum,
            peopleFlow: info.peopleFlow,
            carFlow: info.carFlow,
          };
          if (
            this.customPermission.pptPermission &&
            this.customPermission.pptPermission.gzqylPermission == "1"
          ) {
            importInfo.recommendReason = data.recommendReason; //  亲粤邻定制：推荐理由
          }
          this.isHaveDiffPush(importInfo);
        }
      }
      sessFun.messageFun("success", "成功导入" + arr.length + "条数据");
      this.isImport = false;
      this.computeMedia_AD();
      this.judgeByselect();
    },
    // 判断点位是否已存在购物车(同点位同排期去重、同点位排期交叉则合并、同点位排期联系则合并)
    isHaveDiffPush(obj) {
      let ADData = obj;
      let shopArr = this.shopingList;
      let sameMidArr = [];
      let resultArr = [];
      for (let k = 0, kLen = shopArr.length; k < shopArr.length; ) {
        if (ADData.mID === shopArr[k].mID && ADData.asID === shopArr[k].asID) {
          sameMidArr.push(shopArr[k]);
          shopArr.splice(k, 1);
        } else {
          k++;
        }
      }
      for (let data of sameMidArr) {
        let ADScheArr = ADData.schedules.split("-");
        let shopScheArr = data.schedules.split("-");
        if (
          ADScheArr[0] < shopScheArr[0] &&
          shopScheArr[0] <= ADScheArr[1] &&
          ADScheArr[1] < shopScheArr[1]
        ) {
          // 左相交(购物车相交选点)
          ADData.schedules = ADScheArr[0] + "-" + shopScheArr[1];
        } else if (
          shopScheArr[0] <= ADScheArr[0] &&
          ADScheArr[1] <= shopScheArr[1]
        ) {
          ADData.schedules = shopScheArr[0] + "-" + shopScheArr[1];
          // 购物车包含选点
        } else if (
          shopScheArr[0] < ADScheArr[0] &&
          ADScheArr[0] <= shopScheArr[1] &&
          shopScheArr[1] < ADScheArr[1]
        ) {
          // 右相交(购物车相交选点)
          ADData.schedules = shopScheArr[0] + "-" + ADScheArr[1];
        } else if (
          ADScheArr[0] <= shopScheArr[0] &&
          shopScheArr[1] <= ADScheArr[1]
        ) {
          // 购物车被选点包含
          ADData.schedules = ADScheArr[0] + "-" + ADScheArr[1];
        } else {
          let timeArr = [
            ADScheArr[0],
            ADScheArr[1],
            shopScheArr[0],
            shopScheArr[1],
          ];
          timeArr.sort((a, b) => {
            return Date.parse(a) - Date.parse(b);
          });
          if (Date.parse(timeArr[2]) - Date.parse(timeArr[1]) == 86400000) {
            ADData.schedules = timeArr[0] + "-" + timeArr[3];
          } else {
            resultArr.push(data);
          }
        }
      }
      resultArr.push(ADData);
      this.shopingList = this.shopingList.concat(resultArr);
    },
    // 处理有问题的点
    checkPointFun(obj) {
      let resultarr = [];
      for (let data of obj.errorList) {
        let item = {
          resName: data.resName,
          province: data.province,
          city: data.city,
          origin: data.district,
          resAddress: data.resAddress,
          mediaTypeName: data.mediaTypeName,
          mediaName: data.mTitle,
          assetTag: data.assetTag,
          asLab: data.asLab,
          schedules: data.date,
          pointId: data.pointId,
          failReason: data.failReason,
        };
        resultarr.push(item);
      }
      return resultarr;
    },
    // 导出有问题的点
    downLoadExcel() {
      let arr = this.questionPoint(
        this.excelDataUpload,
        this.importInfoData.successList
      );
      let allHead = [
        "资源名称",
        "省份",
        "城市",
        "区域",
        "详细地址",
        "媒介载体",
        "媒体名称",
        "资产编号",
        "投放面",
        "投放排期",
        "钼媒点位ID",
        "失败原因",
      ];
      sheetExcel.toDownload(
        allHead,
        arr,
        this.planForm.planName + "问题点位表"
      );
    },
    // 导入excel后台返回的问题点位
    questionPoint(arr, successArr) {
      //   console.log("导出excel");
      let resultarr = [
        {
          sheetName: "问题点位",
          showList: [],
        },
        {
          sheetName: "正常点位",
          showList: [],
        },
      ];
      for (let data of arr) {
        let obj = {
          resName: data.resName,
          province: data.province,
          city: data.city,
          origin: data.origin,
          resAddress: data.resAddress,
          mediaTypeName: data.mediaTypeName,
          mediaName: data.mediaName,
          assetTag: data.assetTag,
          asLab: data.asLab,
          schedules: data.schedules,
          pointId: data.pointId,
          failReason: data.failReason,
        };
        resultarr[0].showList.push(obj);
      }
      for (let data of successArr) {
        let info = data.adSInfo;
        let obj = {
          resName: info.resName,
          province: info.province,
          city: info.prName,
          origin: info.rName,
          resAddress: info.resAddress,
          mediaTypeName: info.mediaTypeName,
          mediaName: info.mTitle,
          assetTag: info.assetTag,
          asLab: info.asLab,
          schedules:
            timeFormat.toDate(data.pbStar, ".") +
            "-" +
            timeFormat.toDate(data.pbEnd, "."),
          pointId: info.pointId,
          failReason: null,
        };
        resultarr[1].showList.push(obj);
      }
      return resultarr;
    },
    // 获取订单
    remoteGetOrder(query) {
      if (query !== "") {
        let sess = this.sessionData;
        let info = {
          uid: sess.uID,
          token: sess.token,
          apName: query,
          suId: this.BDData.uid,
          rIds: this.planForm.throwCity.join(","),
        };
        this.loadingOrder = true;
        api
          .getApi(this.apiVar.Advertisement + "/GetSaleAdPlan", info)
          .then((res) => {
            console.log(res.data);
            this.loadingOrder = false;
            if (res.data.SysCode == 200200) {
              this.orderArr = res.data.data.map((item) => {
                return {
                  label: item.apName,
                  value: item.apID,
                };
              });
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            // console.log(err);
          });
      } else {
        this.orderArr = [];
      }
    },
    // 确定复制
    confirmCopy() {
      if (this.orderName) {
        let sess = this.sessionData;
        let info = {
          uid: sess.uID,
          token: sess.token,
          apId: this.orderName,
          startTime: this.dateInput[0],
          endTime: this.dateInput[1],
          rIds: this.planForm.throwCity.join(","),
        };
        api
          .getApi(this.apiVar.Advertisement + "/GetAdsFromCopiedAdPlan", info)
          .then((res) => {
            // console.log(res.data);
            if (res.data.SysCode == 200200) {
              let resinfo = res.data.data;
              let result = [];
              for (let data of resinfo) {
                result.push(this.setCopyData(data));
              }
              console.log("result----", result);
              for (let item of result) {
                this.isHaveDiffPush(item);
              }
              this.judgeByselect();
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
            this.isCopy = false;
          })
          .catch((err) => {
            // console.log(err);
            this.isCopy = false;
          });
      } else {
        sessFun.messageFun("warning", "请先选择要复制的方案");
      }
    },
    // 构建复制方案数据格式
    setCopyData(info) {
      let importInfo = {
        mID: info.mID,
        resType: info.resType,
        resID: info.resID,
        asID: info.asID,
        asLab: info.asLab,
        resName: info.resName,
        city: info.city,
        rid: info.rID,
        origin: info.rName,
        buildType: info.cType,
        houseNum: info.hNum,
        buildPrice: info.hPrice / 100,
        mediaName: info.mTitle || "",
        mediaTypeName: info.mediaTypeName,
        mediaTypeId: info.mediaTypeId,
        buildNum: info.fNum,
        schedules: this.dateInput[0] + "-" + this.dateInput[1],
        tradingArea: info.tradingArea,
        assetTag: info.assetTag,
        liveYear: info.chDay,
        mediaRemark: info.mRemark || "--",
        mapCenter: info.reference || "--", // 地图中心点
        address: info.resAddress || "",
        dNum: info.dNum || "", // 出入口数
        adLimit: info.notPush || "",
        connData: {
          connectResName: "",
          connectMedia: "",
          commentWorkRes: "",
          commentworkMedia: "",
        },
        connID: info.connID || "", // 连排门id
        industryInfos: info.industryInfos || [], // 同行业资源回避
        mediaLevel: info.grade || "",
        adPrice: (info.asPrice || 0) / 700,
        asName: info.asName || "", // 点位所属公司名称
        asrID: info.asrID, // 所属公司id,
        lState: info.adlInfo ? info.adlInfo : "", // 是否被占
        province: info.province,
        notPush: info.notPush,
        parkSpaceNum: info.parkSpaceNum,
        peopleFlow: info.peopleFlow,
        carFlow: info.carFlow,
      };
      return importInfo;
    },
    // 第四步的导出方案
    downLoadFanan() {
      console.log(this.shopingList, "this.shopingList");
      let arr = this.excelData(this.shopingList);
      let allHead = [
        "省份",
        "城市",
        "区域",
        "街道",
        "商圈",
        "资源名称",
        "详细地址",
        "楼栋数量",
        "单元数量",
        "楼盘类型",
        "楼盘价格",
        "住户数量",
        "入住年份",
        "广告限制",
        "媒体面数",
        "资源别名",
        "楼盘介绍",
        "周边配套",
        "出入口数",
        "入住率",
        "配套电梯",
        "车位数",
        "媒体类型",
        "媒体备注",
        "经度",
        "纬度",
        "车流量",
        "人流量",
        "地图中心点",
        "投放排期",
      ];
      let head = [
        "在线协同选点链接(可地图查看社区)  " + this.shareADUrl,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ];

      switch (this.customPermission.patrolPermission) {
        case 1:
          allHead.push("巡点问题", "通行情况");
          break;
        case 2:
          allHead.push("巡点问题", "通行情况", "通电情况");
          break;
      }

      if (
        this.sessionData.uType == "ADN_MD_COUNTRY" ||
        this.sessionData.uType == "ADN_BD_KA"
      ) {
        allHead.push("归属公司");
      }

      sheetExcel.toDownload(
        allHead,
        arr,
        this.planForm.planName + "点位表",
        head
      );
    },
    // 处理数据
    excelData(arr) {
      console.log("arrr------excelData", arr);
      let dateArr = [];
      let filtersData = filterFormat(arr, "schedules");
      for (let item of filtersData) {
        let dateObj = {
          sheetName: item.value,
          showList: [],
          resIDArr: [],
        };
        dateArr.push(dateObj);
      }

      let mIDArr = [];

      for (let data of arr) {
        let obj = {
          province: data.province, //省份
          city: data.city, //城市
          rName: data.origin, //区域
          street: data.street, // 街道
          tradingArea: data.tradingArea, //商圈
          resName: data.resName, //资源名称
          resAddress: data.address, //详细地址
          fNum: data.buildNum, //楼栋数量
          unitCount: data.unitCount, //单元数量
          cType: data.buildType, //楼盘类型
          hPrice: data.buildPrice, //楼盘价格
          hNum: data.houseNum, //住户数量
          chDay: data.liveYear, //入住年份
          notPush: data.notPush, //广告限制
          adsNum: 1, // 媒体面数
          resAlias: data.alias, //资源别名
          description: data.description, // 楼盘介绍
          supportingFacilities: data.supportingFacilities, // 周边配套
          dNum: data.dNum, // 出入口数
          liveRate: data.liveRate, // 入住率
          liftType: data.liftType, // 配套电梯
          parkSpaceNum: data.parkSpaceNum, //车位数
          mediaTypeName: data.mediaTypeName, // 媒体类型
          mRemark: data.mRemark, // 媒体备注
          lat: data.lng, // 经度
          lng: data.lat, // 纬度
          carFlow: data.carFlow, //车流量
          peopleFlow: data.peopleFlow, //人流量
          map: data.mapCenter, //地图中心点
          timeRange: "", //投放排期
          resID: data.resID,
          mID: data.mID,
        };

        let mIDitem = mIDArr.find((item) => {
          return item.resID == data.resID;
        });

        // 如果该资源存在
        if (mIDitem) {
          if (!mIDitem.mID.includes(data.mID)) {
            // 不存在mID
            mIDitem.mID.push(data.mID);
          }
        } else {
          // 如果该资源不存在
          mIDArr.push({
            resID: data.resID,
            mID: [data.mID],
          });
        }

        // 巡点权限(1：亲粤邻 2：北京)
        if (this.customPermission) {
          switch (this.customPermission.patrolPermission) {
            case 1:
              obj.remark = data.remark;
              obj.trafficState = data.trafficState;
              break;
            case 2:
              obj.remark = data.remark;
              obj.trafficState = data.trafficState;
              obj.allElectrifyState = data.allElectrifyState;
              break;
          }
        }

        if (
          this.sessionData.uType == "ADN_MD_COUNTRY" ||
          this.sessionData.uType == "ADN_BD_KA"
        ) {
          obj.asName = data.asName;
        }

        for (let date of dateArr) {
          if (data.schedules == date.sheetName) {
            if (date.resIDArr.includes(data.resID)) {
              for (let item of date.showList) {
                if (item.resID == data.resID) {
                  item.adsNum++;
                  break;
                }
              }
            } else {
              obj.timeRange = date.sheetName;
              date.resIDArr.push(data.resID);
              date.showList.push(obj);
            }
            break;
          }
        }
      }
      // 获取媒体数量
      //   for (let dateArrItem of dateArr) {
      //     for (let showListItem of dateArrItem.showList) {
      //       for (let mIDitem of mIDArr) {
      //         if (showListItem.resID == mIDitem.resID) {
      //           showListItem.actualMediaCnt = mIDitem.mID.length;
      //         }
      //       }
      //     }
      //   }

      for (let data of dateArr) {
        for (let obj of data.showList) {
          delete obj.resID;
          delete obj.mID;
        }
        data.sheetName = data.sheetName.replace(/[/]/g, ".");
      }

      console.log("datearrr-----", dateArr);
      return dateArr;
    },
    // step1投放城市权限是全国时spliceCity、showInput、handleInputConfirm
    spliceCity(tag) {
      // step1方案创建,删除选择城市
      if (this.indexData.city.includes(tag)) {
        sessFun.messageFun("warning", tag + "为地图选择所在城市，不可删除");
        return;
      }
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      let city_arr = this.cityOptions;
      for (let i = 0; i < city_arr.length; i++) {
        // 遍历城市查找城市名对应的rid，用于删除勾选的城市
        for (let j = 0; j < city_arr[i].children.length; j++) {
          if (city_arr[i].children[j].label === tag) {
            let city_rid = city_arr[i].children[j].value;
            for (let n = 0; n < this.planForm.throwCity.length; n++) {
              if (city_rid === this.planForm.throwCity[n]) {
                for (let t = 0; t < this.throwCity.length; t++) {
                  if (city_rid === this.throwCity[t].value) {
                    this.throwCity.splice(t, 1);
                    break;
                  }
                }
                this.planForm.throwCity.splice(n, 1);
                break;
              }
            }
          }
        }
      }
    },
    // 非全国，移除城市
    removeCity(val) {
      //   console.log("非全国，移除城市val", val, this.planForm.throwCity);
      if (this.indexData.rid == val) {
        sessFun.messageFun(
          "warning",
          this.indexData.city + "为选择的地图点位所在城市，不可删除"
        );
        this.planForm.throwCity.push(val);
        this.$refs["planThrowCity"].clearValidate();
      }
    },
    //step1 城市投放
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 选择投放城市
    handleInputConfirm() {
      let inputValue = this.selectedOptions;
      // console.log('********',inputValue)
      if (inputValue) {
        let cityArr = this.cityOptions;
        for (let i = 0; i < cityArr.length; i++) {
          if (cityArr[i].value == inputValue[0]) {
            let childArr = cityArr[i].children;
            for (let j = 0; j < childArr.length; j++) {
              if (childArr[j].value == inputValue[1]) {
                if (this.dynamicTags.indexOf(childArr[j].label) === -1) {
                  this.dynamicTags.push(childArr[j].label);
                  this.planForm.throwCity.push(inputValue[1]);
                  let cityObj = {
                    label: childArr[j].label,
                    value: inputValue[1],
                  };
                  this.throwCity.push(cityObj);
                  console.log("this.throwCity", this.throwCity);
                  console.log("this.selectedOptions", this.selectedOptions);
                  this.inputVisible = false;
                  this.selectedOptions = [];
                  break;
                } else {
                  sessFun.messageFun("warning", "不可以选择重复的城市");
                }
              }
            }
            break;
          }
        }
      }
    },
    // 选择所属销售
    changeSaler(val) {
      //   console.log("选择所属销售", val);
      // 重新输入账号时，初始化部分数据
      this.planForm.companyName = "";
      this.planForm.companyBrand = "";
      this.planForm.ownerBU = "";
      this.planForm.throwCity = [];
      this.dynamicTags = [];
      this.throwCity = [];
      this.$refs["planForm"].clearValidate();
      if (val) {
        for (let key of this.salerList) {
          if (key.value == val) {
            this.planForm.realNamesName = key.label;
            this.BDData.uType = key.uType;
            this.BDData.asrID = key.asrID;
            break;
          }
        }
        this.BDData.uid = val;
        this.getCityList();
        this.Get_cName();
      } else {
      }
    },
    // 登录用户为媒介输入销售用户名去获取该销售的信息以便获取接下来的城市、公司、品牌、投放城市等信息
    querySearchAsync(query) {
      if (query !== "") {
        this.salerListLoading = true;
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          keyword: query,
        };
        api
          .postApi(this.apiVar.UCAPI + "/findBDUserByKeyword", params)
          .then((res) => {
            if (res.data.SysCode === 200200) {
              let arr = [];
              for (let key of res.data.data) {
                arr.push({
                  label: key.realName + "(" + key.sName + ")",
                  value: key.uID,
                  uType: key.uType,
                  asrID: key.asrID,
                });
              }
              this.salerList = arr;
            } else {
              this.salerList = [];
            }
            this.salerListLoading = false;
          });
      } else {
        this.salerList = [];
        this.salerListLoading = false;
      }
    },
    Get_cName() {
      let params = {
        uid: this.BDData.uid,
        token: this.sessionData.token,
      };
      return api
        .getApi(this.apiVar.Advertisement + "/MyCustomer", params)
        .then((res) => {
          console.log("MyCustomer:", res.data);
          let customerList = res.data;
          this.customer = res.data; //保存所有信息，方便后面的过滤使用
          let companyList = []; // 公司名称
          let ownerList = []; // 联系人
          for (let i = 0; i < customerList.length; i++) {
            let companyObj = {
              label: customerList[i].cName,
              value: customerList[i].cID,
            };
            let owner = {
              label: customerList[i].realName,
              value: customerList[i].uID,
            };
            ownerList.push(owner);
            if (i == 0) {
              companyList.push(companyObj);
            } else if (
              JSON.stringify(companyList).indexOf(
                JSON.stringify(companyObj)
              ) === -1
            ) {
              //判断是否有重复的公司JSON.stringify(companyObj)
              companyList.push(companyObj);
            }
          }
          this.companyName = companyList; // 公司名称列表
          this.ownerBU = ownerList; // 联系人列表
        });
    },
    // 获取公司品牌
    GetBrandByCid(val) {
      this.planForm.companyBrand = "";
      this.planForm.ownerBU = "";
      //   console.log("所选公司的ID", val);
      let cidParams = {
        cid: val,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetBrand", cidParams)
        .then((res) => {
          //   console.log("公司品牌", res.data);
          if (res.data.SysCode === 200200) {
            let CBrand = res.data.data;
            let BrandList = [];
            for (let key of CBrand) {
              BrandList.push({
                label: key.bTitle,
                value: key.bID,
              });
            }
            this.companyBrand = BrandList;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
      // 选择公司后过滤联系人列表customer
      let customerList = this.customer;
      let ownerList = []; // 联系人
      for (let j = 0; j < customerList.length; j++) {
        if (customerList[j].cID == val) {
          let owner = {
            label: customerList[j].realName,
            value: customerList[j].uID,
          };
          ownerList.push(owner);
        }
      }
      this.ownerBU = ownerList;
    },
    // 获取公司及品牌
    getBand() {
      for (let n = 0; n < this.companyName.length; n++) {
        if (this.companyName[n].value === this.planForm.companyName) {
          this.cName = this.companyName[n].label;
        }
      }
      for (let n = 0; n < this.companyBrand.length; n++) {
        if (this.companyBrand[n].value === this.planForm.companyBrand) {
          this.cBand = this.companyBrand[n].label;
        }
      }
    },
    // 表单验证
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //   console.log("表单验证this.throwCity", this.throwCity);
          // 初始化
          this.initStep2Data();
          this.active++;
          // 设置城市及对应的区域
          this.getAreaFun();
          this.getRejectPlanList(); // 获取排斥方案列表
          this.getIndustryBycID(); // 根据所选公司获取公司所属行业
          // 地图选点前置跳转而来，则直接显示购物车及其地图选择的点位
          if (this.indexData !== "") {
            this.mapParams = {
              rid: this.indexData.rid,
              city: this.indexData.city,
              ls: this.indexData.dateInput[0],
              le: this.indexData.dateInput[1],
            };
            this.mapBtn = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 初始化step2的数据
    initStep2Data() {
      this.pageNo = 1;
      this.planList = [];
      this.activeIndex = 0;
      this.activeRName = ""; //step2当前选中的城市名称
      this.areaName = "全市"; // step2当前选中的区域
      let inputPath = this.$route.fullPath;
      if (inputPath.indexOf("unfinishedPlan") !== -1) {
        console.log("缓存方案再编辑", this.shopingList);
        let arr = [];
        for (let key of this.shopingList) {
          if (
            this.unfinishedData.planData.baseInfo.throwCity.includes(key.rid)
          ) {
            arr.push(key);
          }
        }
        this.shopingList = arr;
        this.initPointCounts(arr);
      } else {
        this.shopingList = []; // 购物车
      }
      this.limitList = []; // 初始化广告限制
      this.filterCondition = []; // 过滤条件tag
      this.buildValue = ""; // 楼盘类型
      for (let i in this.filterData) {
        this.filterData[i] = false;
      }
      this.IsAll = false;
      this.getMediaTypesByCompany();
    },
    // 根据公司id获取媒体类型
    getMediaTypesByCompany() {
      let selectedAsrIds = this.planForm.pointOfAsrIDs.join(",");
      if (!selectedAsrIds) {
        selectedAsrIds = this.BDData.asrID
          ? this.BDData.asrID + ""
          : this.cacheAsrID;
      }
      api
        .getApi("/addsp/api/v1/company/mediaTypes", {
          companyIds: selectedAsrIds,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.mediaTypeObjectArr = res.data.data || [];
            if (this.mediaTypeObjectArr.length) {
              this.activeMediaType(this.mediaTypeObjectArr[0].id);
              // 获取选点列表
              this.getAdList();
            }
          } else {
            sessFun.messageFun("warning", res.data.MSG || "媒体类型获取失败！");
          }
        });
    },
    /*step2*/
    // 获取排斥方案选择列
    getRejectPlanList() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        sales_user: this.BDData.uid,
      };
      api
        .getApi(this.apiVar.Advertisement + "/getSalesProject", params)
        .then((res) => {
          //   console.log("销售所属方案", res);
          if (res.data.SysCode == 200200) {
            let resData = res.data.data;
            let tempList = [];
            for (let key of resData) {
              tempList.push({
                value: key.apId,
                label: key.apName + "--" + key.cname + "--" + key.apcTime,
              });
            }
            this.rejectAdPlan = tempList;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    },
    // step2 获取广告限制列表
    getADLimit() {
      this.ADLimit = [];
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetNotPush",
        data: {},
      };
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        // console.log("广告限制列表", res);
        if (res.data.SysCode === 200200) {
          let limit = res.data.data;
          let limitArr = [];
          for (let i = 0; i < limit.length; i++) {
            let limitObj = { value: limit[i].nTitle, label: limit[i].nTitle };
            limitArr.push(limitObj);
          }
          this.ADLimit = limitArr;
        }
      });
    },
    // 获取行业id
    getIndustryBycID() {
      for (let key of this.customer) {
        if (key.cID === this.planForm.companyName) {
          this.industryID = key.piID;
          break;
        }
      }
    },
    // 设置城市区域
    getAreaFun() {
      this.area = [];
      let throwCityList = this.planForm.throwCity;
      let cityArr = [];
      for (let j = 0; j < throwCityList.length; j++) {
        for (let t = 0; t < this.throwCity.length; t++) {
          if (this.throwCity[t].value === throwCityList[j]) {
            let cityObj = {
              rName: this.throwCity[t].label,
              rid: this.throwCity[t].value,
            };
            cityArr.push(cityObj);
          }
        }
        if (j >= throwCityList.length - 1) {
          //   console.log("cityArr", cityArr);
          this.city = cityArr;
          this.city.sort(this.compareFun);
          //   console.log("this.city ", this.city);
          this.activeCityData = this.city[0]; // 设置初始选中城市信息
          this.activeRName = this.activeCityData.rName;
          for (let n = 0; n < this.city.length; n++) {
            let rid = this.city[n].rid.toString();
            // console.log("投放城市rid", rid);
            let provinceRid = rid.substring(0, 2) + "0000";
            let city_arr = this.areaCity;
            let areaArr = [];
            // console.log("this.cityOptions", this.areaCity);
            for (let i = 0; i < city_arr.length; i++) {
              // 遍历城市查找城市名对应的rid，用于删除勾选的城市
              if (city_arr[i].value == provinceRid) {
                let child = city_arr[i].children;
                for (let j = 0; j < child.length; j++) {
                  if (child[j].value == rid) {
                    let areaChild = child[j].children;
                    // console.log('区区区',areaChild)
                    for (let n = 0; n < areaChild.length; n++) {
                      if (n === 0) {
                        let allArea = {
                          rID: rid,
                          rName: "全市",
                        };
                        areaArr.push(allArea);
                      }
                      let myArea = {
                        rID: areaChild[n].value,
                        rName: areaChild[n].label,
                      };
                      areaArr.push(myArea);
                      if (n >= areaChild.length - 1) {
                        console.log("areaArr", areaArr);
                        this.area.push(areaArr);
                        this.area.sort(this.compareArea);
                      }
                    }
                  }
                }
              }
              //   if (i >= city_arr.length - 1) {
              //     console.log("this.area", this.area);
              //   }
            }
          }
        }
      }
    },
    // 获取广告点位列表
    getAdList() {
      if (!this.currentMediaType) {
        this.$message.warning("媒体类型不能为空！");
        return;
      }
      this.loading = true;
      (this.getAdsParamsData.prID = this.city[this.activeIndex].rid),
        (this.getAdsParamsData.act = 1),
        (this.getAdsParamsData.mediaTypeId = this.currentMediaType),
        (this.getAdsParamsData.dateTimeBegin = this.dateInput[0]);
      this.getAdsParamsData.dateTimeEnd = this.dateInput[1];
      this.getAdsParamsData.pageNo = this.pageNo;
      this.getAdsParamsData.pageSize = this.pageSize;
      this.getAdsParamsData.uid = this.BDData.uid;
      this.getAdsParamsData.asrIDs = this.planForm.pointOfAsrIDs.join(",");
      this.getAdsParamsData.mType = this.mediaMType || "";
      this.getAdsParamsData.site = this.site || "";
      this.getAdsParamsData.siteOrientation = this.siteOrientation || "";
      for (let i in this.getAdsParamsData) {
        if (
          this.getAdsParamsData[i] === "" ||
          this.getAdsParamsData[i] === null ||
          this.getAdsParamsData[i] === undefined
        ) {
          delete this.getAdsParamsData[i];
        }
      }
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetAdS",
        data: this.getAdsParamsData,
      };
      let timer = setTimeout(() => {
        // setTimeout 异步让table出现loading
        api.postApi_new(this.apiVar.Media, params).then((res) => {
          if (res.data.SysCode === 200200) {
            this.planList = [];
            if (Array.isArray(res.data.data.list)) {
              this.setTableDataADDoor(res.data.data.list);
              this.total = res.data.data.total;
              this.adsCount = res.data.data.adsCount;
              this.judgeByselect();
              this.searchBtnAbled = false;
            } else {
              this.total = 0;
              this.adsCount = 0;
            }
            this.loading = false;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
            this.loading = false;
          }
          this.searchBtnAbled = false;
        });
        clearTimeout(timer);
      }, 0);
    },
    // 接口数据转成table
    setTableDataADDoor(ADSdata, isGetDataADDoor = false) {
      let i = 0;
      let list = [];
      for (let key of ADSdata) {
        let adObj = {
          mID: key.mID,
          resType: key.resType,
          resID: key.resID,
          province: key.province, //省份
          city: key.city, //城市
          origin: key.rName, //区域
          street: key.street, //街道
          tradingArea: key.tradingArea || "", //商圈
          resName: key.resName, // 资源名称
          address: key.resAddress || "", //详细地址
          houseNum: key.hNum, //楼栋数量
          liveYear: key.chDay, //入住年份
          notPush: key.notPush, //广告限制
          unitCount: key.unitCount,
          adsList: key.adsList || [], // 所属公司id
          alias: key.alias, //资源别名
          description: key.description, //楼盘介绍
          supportingFacilities: key.supportingFacilities, //周边配套
          dNum: key.dNum || "", //出入口数
          liveRate: key.liveRate, //入住率
          liftType: key.liftType, //配套电梯
          parkSpaceNum: key.parkSpaceNum, //车位数
          mediaTypeName: key.mediaTypeName, // 媒体类型
          mRemark: key.mRemark, //备注
          lng: key.lng, //经度
          lat: key.lat, //纬度
          carFlow: key.carFlow, //车流量
          peopleFlow: key.peopleFlow, //人流量
          mapCenter: key.reference || "", // 地图中心点
          rid: this.city[this.activeIndex].rid,
          buildType: key.cType,
          buildPrice: key.hPrice / 100,
          mediaName: key.mTitle || "",
          mediaTypeId: key.mediaTypeId, // 媒体类型
          mediaRemark: key.mRemark || "--",
          buildNum: key.fNum,
          schedules: this.dateInput[0] + "-" + this.dateInput[1],
          assetTag: key.assetTag || "",
          adLimit: key.notPush || "",
          mState:
            key.mState === 1 ? "正常" : key.mState === 2 ? "待安装" : "--",
          adSize: key.adSize || "",
          // picSize: key.picSize || "",
          connID: key.connID || "", // 连排门id
          industryInfos: key.industryInfos, // 同行业资源、媒体回避
          mediaLevel: key.grade || "",
          asName: key.asName || "", // 点位所属公司名称
          asrID: key.asrID,
          remark: key.remark,
          trafficState: key.trafficState,
          electrifyState: key.electrifyState,
          unitId: key.unitId, // 单元ID
          buildingId: key.buildingId, // 楼栋ID
          actualAdsCnt: key.actualAdsCnt, // 最多可添加点位数量
          asID: key.asID,
          asLab: key.asLab,
          buildingName: key.buildingName,
          unitName: key.unitName,
        };
        if (this.getAdsParamsData.chooseType !== 0) {
          adObj.pointCount =
            this[`${this.pointCountType}Map`][key[this.pointCountType]] || 0;
        }

        if (key.asPrice !== null && key.asPrice !== undefined) {
          adObj.adPrice = key.asPrice / 700;
        } else {
          if (key.grade === "A") {
            adObj.adPrice = 3080 / 7;
          } else if (key.grade === "B") {
            adObj.adPrice = 2380 / 7;
          } else if (key.grade === "C") {
            adObj.adPrice = 1800 / 7;
          } else {
            adObj.adPrice = 0;
          }
        }
        adObj.adsList.forEach((adSpace) => {
          adSpace.checkBox = false;
          //本页可选点位
          if (adSpace.checkFlag) i += 1;
        });
        if (
          key.adlInfo !== null &&
          key.adlInfo !== undefined &&
          key.adlInfo.length > 0
        ) {
          let arr = [];
          for (let akey of key.adlInfo) {
            let star = timeFormat.toDate(akey.lStar, "/");
            let end = timeFormat.toDate(akey.lEnd, "/");
            arr.push({
              asState: akey.asState,
              schedules: star + "-" + end,
              lState: akey.lState,
              unSaleableReason: JSON.parse(akey.unSaleableReason || "[]"),
              beOccupieApName: akey.apName,
            });
          }
          adObj.adlInfo = arr;
        } else {
          adObj.adlInfo = "";
        }
        if (!isGetDataADDoor) {
          this.planList.push(adObj);
        } else {
          list.push(adObj);
        }
      }
      if (!isGetDataADDoor) {
        this.currPageAsLength = i;
        this.loadScroll = true;
      }
      return list;
    },
    setPageNoAndTableData() {
      this.IsAll = false;
      this.HSearch = "";
      this.pageNo = 1;
      this.planList = [];
    },
    // 方案排斥选择
    selectRejectPlan(val) {
      this.getAdsParamsData.apId = this.activeAdPlan;
      this.setPageNoAndTableData();
      this.getAdList();
    },
    //step2搜索按钮
    searchFun() {
      this.searchBtnAbled = true;
      //   console.log("搜索排期时间", this.dateInput);
      this.areaName = "全市";
      if (this.selectValue === "被占查询") {
        this.beOccupiedGetList(); // 获取被占列表接口
        this.beOccupiedNumber++;
      } else {
        this.isOccupied = true; //  || this.dateInput !== this.beforeDate
        if (this.searchInput !== "" && this.dateInput !== null) {
          this.setPageNoAndTableData();
          this.ResOriginSearch();
        } else if (
          this.searchInput === "" &&
          this.dateInput !== this.beforeDate &&
          this.dateInput !== null
        ) {
          this.setPageNoAndTableData();
          this.getAdList();
          this.beforeDate = this.dateInput;
        } else if (!this.dateInput) {
          sessFun.messageFun("warning", "搜索时间不能为空！");
          this.searchBtnAbled = false;
        } else {
          this.searchBtnAbled = false;
        }
      }
    },
    // 资源名称\商圈搜索typeSelect
    ResOriginSearch() {
      if (this.selectValue === "资源名称") {
        this.getAdsParamsData.resName = this.searchInput;
        this.getAdsParamsData.tradingArea = "";
        this.getAdsParamsData.assetTag = "";
      } else if (this.selectValue === "商圈") {
        this.getAdsParamsData.tradingArea = this.searchInput;
        this.getAdsParamsData.resName = "";
        this.getAdsParamsData.assetTag = "";
      } else if (this.selectValue === "资产编号") {
        this.getAdsParamsData.assetTag = this.searchInput;
        this.getAdsParamsData.tradingArea = "";
        this.getAdsParamsData.resName = "";
      }
      this.getAdList();
    },
    // 当搜索框为空的时候进行重置显示
    initData(val) {
      //   console.log("搜索框变化的值", val);
      if (!this.searchInput && this.selectValue !== "被占查询") {
        this.isOccupied = true;
        this.getAdsParamsData.tradingArea = "";
        this.getAdsParamsData.assetTag = "";
        this.getAdsParamsData.resName = "";
        this.setPageNoAndTableData();
        this.getAdList();
      }
      if (this.selectValue == "被占查询") {
        // 被占查询可以选择当天
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() <= Date.now() - 1000 * 3600 * 24;
          },
        };
      } else {
        // 只能选择今天之后的日期
        this.pickerOptions = {
          disabledDate(time) {
            return time.getTime() <= Date.now();
          },
        };
        // 明天的日期（/分割）
        let tomorrow = timeFormat.returnDayCount(1, "/");
        if (this.dateInput[0] < tomorrow) {
          if (this.dateInput[1] < tomorrow) {
            // 日期范围只选择了当天
            this.dateInput = [tomorrow, tomorrow];
          } else {
            this.dateInput.splice(0, 1, tomorrow);
          }
        }
      }
    },
    //  查询被占点位
    beOccupiedGetList() {
      if (!(Array.isArray(this.dateInput) && this.dateInput.length === 2)) {
        sessFun.messageFun("warning", "搜索时间不能为空！");
        this.searchBtnAbled = false;
        return;
      }
      let starTime = this.dateInput[0];
      let endTime = this.dateInput[1];
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        rn: this.searchInput,
        ls: starTime.split(".").join(""),
        le: endTime.split(".").join(""),
        cityIds: this.city.map((_) => _.rid),
        saleId: this.BDData.uid,
        asrIDs: this.BDData.asrIDs,
      };
      api
        .postApi(this.apiVar.Advertisement + "/GetResAdplanInfo", params)
        .then((res) => {
          this.isOccupied = false; // 被占搜索时隐藏过滤条件
          let dataArr = res.data;
          this.planList = [];
          if (res.data === "" || res.data === null || res.data.length <= 0) {
            sessFun.messageFun("warning", "暂无该小区被占信息");
          } else {
            let arr = [];
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
                buildPrice: key.hPrice / 100,
                mediaName: key.mTitle,
                buildNum: key.fNum,
                schedules: this.dateInput[0] + "-" + this.dateInput[1],
                tradingArea: key.tradingArea || "",
                assetTag: key.assetTag || "",
                liveYear: key.chDay,
                adLimit: key.notPush || "",
                mediaRemark: key.mRemark || "--",
                mState:
                  key.mState === 1 ? "正常" : key.mState === 2 ? "待安装" : "",
                adSize: key.adSize || "",
                apName: key.apName, // 被占方案名称
                lStar: key.lStar, // 被占排期lStar，lEnd
                lEnd: key.lEnd,
                lState: key.lState, //点位状态 1被占，2强制停止  0 锁点
                mediaLevel: key.grade || "",
                province: key.province,
                notPush: key.notPush,
                parkSpaceNum: key.parkSpaceNum,
                peopleFlow: key.peopleFlow,
                carFlow: key.carFlow,
                unitId: key.unitId, // 单元ID
                buildingId: key.buildingId, // 楼栋ID
                actualAdsCnt: key.actualAdsCnt, // 最多可添加点位数量
              };
              if (this.getAdsParamsData.chooseType !== 0) {
                adObj.pointCount = this.shopingCarHasPoint(
                  this.pointCountType,
                  key[this.pointCountType]
                )
                  ? this[`${this.pointCountType}Map`][key[this.pointCountType]]
                  : 0;
              }
              arr.push(AD_data);
            }
            this.planList = arr;
          }
          this.searchBtnAbled = false;
        });
    },
    // 设置地图选点参数
    setMapParams() {
      localStorage.removeItem("qinlinMapCode");
      this.ActiveMapType = 2;
      this.mapParams = {
        rid: this.activeCityData.rid,
        city: this.activeCityData.rName,
        ls: this.dateInput[0],
        le: this.dateInput[1],
      };
      let _asrIDs = null;
      if (
        this.planForm.pointOfAsrIDs &&
        this.planForm.pointOfAsrIDs.length > 0
      ) {
        _asrIDs = this.planForm.pointOfAsrIDs;
      } else {
        _asrIDs = this.BDData.asrID
          ? this.BDData.asrID.split(" ")
          : this.cacheAsrID.split(",");
      }
      localStorage.setItem(
        "mapParams",
        JSON.stringify({
          rid: this.activeCityData.rid,
          ls: this.dateInput[0],
          le: this.dateInput[1],
          adSystemId: [this.industryID],
          suID: this.BDData.uid,
          asrIDs: _asrIDs,
        })
      );
      let url = `${window.location.protocol}//${
        window.location.host
      }/ADResourceMap/chooseRes?city=${
        this.mapParams.city
      }&flag=true&timeRange=${String(this.dateInput)}`;
      /* if(window.location.hostname == 'localhost') {
                    url = window.location.host + '/ADResourceMap/chooseRes?city=' + this.mapParams.city + '&flag=' + true
                } else {
                    url = this.apiVar.qadnUrl + '/ADResourceMap/chooseRes?city=' + this.mapParams.city + '&flag=' + true
                } */
      window.open(url);
      this.mapBtn = false;
      this.dialogVisible();
    },
    // 模态框中的确认按钮
    oneKeyPointBtn(item) {
      let IsBoolean = false;
      this.$refs[item].validate((valid) => {
        if (valid) {
          IsBoolean = true;
        } else {
          return false;
        }
      });

      if (IsBoolean) {
        if (
          Number(this.oneKeyPointData.TotalPoint) <
          Number(this.oneKeyPointData.pointNumByRes)
        ) {
          sessFun.messageFun("warning", "每小区选择的个数不能大于点位总量");
        } else {
          this.oneKeySelectPoint();
        }
      } else {
        sessFun.messageFun("warning", "信息填写有误");
      }
    },
    //一键选点
    oneKeySelectPoint() {
      //   console.log("一键选点");
      let oneKeyPointLoading = this.$loading({
        lock: true,
        text: "快马加鞭选点中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let IsXhr = false;
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        vehicle: "AdGate",
        act: 1,
        ls: this.dateInput[0].replace(/\./g, "/"),
        le: this.dateInput[1].replace(/\./g, "/"),
        rid: this.city[this.activeIndex].rid,
        total: this.oneKeyPointData.TotalPoint,
        everyResNumber: this.oneKeyPointData.pointNumByRes,
        labAPercent: this.oneKeyPointData.A_cale,
        rhn: this.houseNum[0],
        shn: this.houseNum[1],
        shp: this.buildPrice[0] * 100,
        bhp: this.buildPrice[1] * 100,
        suid: this.BDData.uid,
        asrIDs: this.planForm.pointOfAsrIDs.join(","),
        apId: this.activeAdPlan,
      };
      if (this.selectValue === "商圈") {
        params.ta = this.searchInput;
      }
      // 过滤地区rID
      if (this.areaName !== "全市") {
        params.qrid = this.areaRid;
      }
      // 限制广告不能投放类型 ,分割
      if (this.limitList.length > 0) {
        params.adLimit = this.limitList.join(",");
      }
      for (let i in params) {
        if (
          i !== "labAPercent" &&
          (params[i] === "" || params[i] === undefined || params[i] == 0)
        ) {
          delete params[i];
        }
      }
      api
        .postApi(this.apiVar.Advertisement + "/AutoSetAdS", params)
        .then((res) => {
          console.log("一键选点", res.data);
          IsXhr = true;
          let tempArr = [];
          let resArr = res.data;
          if (resArr !== "" && resArr.length > 0) {
            for (let key of res.data) {
              let selectInfo = {
                rid: this.city[this.activeIndex].rid,
                mID: key.mID,
                mediaTypeName: key.mediaTypeName,
                mediaTypeId: key.mediaTypeId,
                asID: key.asID,
                asLab: key.asLab,
                resName: key.resName,
                resID: key.resID,
                city: key.city,
                origin: key.rName,
                buildType: key.cType,
                houseNum: key.hNum,
                buildPrice: key.hPrice / 100,
                mediaName: key.mTitle || "",
                remark: key.remark || "--", // 巡点定制
                trafficState: key.trafficState || "--", // 巡点定制
                electrifyState: key.electrifyState || "--", // 巡点定制
                buildNum: key.fNum,
                schedules: this.dateInput[0] + "-" + this.dateInput[1],
                tradingArea: key.tradingArea,
                assetTag: key.assetTag,
                liveYear: key.chDay,
                adLimit: key.notPush,
                mapCenter: "", // 地图中心点name
                address: key.resAddress || "",
                dNum: key.dNum || "", // 出入口数
                connID: key.connID || "", // 连排门id
                connData: {
                  connectResName: "",
                  connectMedia: "",
                  commentWorkRes: "",
                  commentworkMedia: "",
                },
                industryInfos: key.industryInfos || [],
                mediaLevel: key.grade || "",
                adPrice: (key.asPrice || 0) / 700,
                asName: key.asName || "", // 点位所属公司名称
                asrID: key.asrID, // 所属公司id
                province: key.province,
                notPush: key.notPush,
                unitCount: key.unitCount,
                parkSpaceNum: key.parkSpaceNum,
                peopleFlow: key.peopleFlow,
                carFlow: key.carFlow,
              };
              if (this.qinLinJudgeHaveDiffAD(selectInfo)) {
                tempArr.push(selectInfo);
              }
            }
            if (this.shopingList.length !== 0) {
              for (let key of tempArr) {
                this.shopingList.push(key);
              }
            } else {
              this.shopingList = tempArr;
            }
            this.dialogOneKeyPoint = false;
            this.typeShopList = this.getTypeList();
            this.computeMedia_AD();
            this.judgeByselect();
            if (this.oneKeyPointData.TotalPoint == res.data.length) {
              sessFun.messageFun(
                "success",
                "成功选择了" + res.data.length + "面"
              );
            } else {
              sessFun.messageFun(
                "warning",
                "满足条件的点位不足" +
                  this.oneKeyPointData.TotalPoint +
                  "面,成功选择了" +
                  res.data.length +
                  "面"
              );
            }
          } else {
            sessFun.messageFun("warning", "选择失败,暂无匹配点位");
          }
          oneKeyPointLoading.close();
        });
      let timer = setTimeout(() => {
        if (!IsXhr) {
          sessFun.messageFun("warning", "点位选择异常");
          oneKeyPointLoading.close();
        } else {
          // console.log('一键选点已成功')
        }
        clearTimeout(timer);
      }, 1000 * 65);
    },
    //媒体类型切换
    activeMediaType(mType) {
      //   console.log("媒体类型", mType);
      this.setPageNoAndTableData();
      this.currentMediaType = mType;
      this.getAdList();
    },
    // tab切换城市
    activeCity(item, index) {
      //   console.log("item", item, "index", index);
      this.activeIndex = index;
      this.activeRName = item.rName;
      this.activeCityData = item;
      this.areaName = "全市";
      this.getAdsParamsData.area = "";
      this.setPageNoAndTableData();
      this.getAdList();
    },
    //  stpe2, 切换区域
    activeArea(item) {
      this.areaName = item.rName;
      this.areaRid = item.rID;
      this.setPageNoAndTableData();
      if (this.areaName === "全市") {
        this.getAdsParamsData.area = "";
      } else {
        this.getAdsParamsData.area = item.rName;
      }
      this.getAdList();
    },
    // 选点表格头部过滤条件tab删除方法
    filterTagCloseFun(tab, index) {
      //   console.log("tab", tab, "index", index);
      if (tab.condition === "mstate") {
        // 媒体状态
        this.getAdsParamsData.mState = "";
      } else if (tab.condition === "grade") {
        // 媒体等级
        this.activeGrade = "";
        this.getAdsParamsData.grade = "";
      } else if (tab.condition === "ADLimit") {
        // 广告限制
        this.limitList = [];
        this.getAdsParamsData.adLimit = "";
      } else if (tab.condition === "cType") {
        // 楼盘类型
        this.buildValue = "";
        this.getAdsParamsData.buildType = "";
      } else if (tab.condition === "houseNum") {
        // 住户数量
        this.houseNum[0] = "";
        this.houseNum[1] = "";
        this.filterData.hNum = false;
        this.getAdsParamsData.houseNumMin = "";
        this.getAdsParamsData.houseNumMax = "";
      } else if (tab.condition === "buildPrice") {
        // 楼盘价格
        this.buildPrice[0] = "";
        this.buildPrice[1] = "";
        this.filterData.bPrice = false;
        this.getAdsParamsData.hPriceMin = "";
        this.getAdsParamsData.hPriceMax = "";
      } else if (tab.condition === "liveYear") {
        // 入住年份
        this.liveYear[0] = "";
        this.liveYear[1] = "";
        this.filterData.lYear = false;
        this.getAdsParamsData.liveYearMin = "";
        this.getAdsParamsData.liveYearMax = "";
      } else if (tab.condition === "peopleFlow") {
        // 人流量
        this.peopleFlow[0] = "";
        this.peopleFlow[1] = "";
        this.filterData.pFlow = false;
        this.getAdsParamsData.peopleFlowMin = "";
        this.getAdsParamsData.peopleFlowMax = "";
      } else if (tab.condition === "carFlow") {
        // 车流量
        this.carFlow[0] = "";
        this.carFlow[1] = "";
        this.filterData.cFlow = false;
        this.getAdsParamsData.carFlowMin = "";
        this.getAdsParamsData.carFlowMax = "";
      } else if (tab.condition === "parkSpaceNum") {
        // 车位数
        this.parkSpaceNum[0] = "";
        this.parkSpaceNum[1] = "";
        this.filterData.pSNum = false;
        this.getAdsParamsData.parkSpaceNumMin = "";
        this.getAdsParamsData.parkSpaceNumMax = "";
      }
      this.filterCondition.splice(index, 1);
      this.setPageNoAndTableData();
      this.getAdList();
    },
    // 判断是否存在该条件的tag
    isHaveThisTag(letter, tagName) {
      //   console.log("letter", letter, "tagName", tagName);
      let isHave = false;
      for (let i in this.filterCondition) {
        if (this.filterCondition[i].condition === letter) {
          isHave = true;
          this.filterCondition[i].name = tagName;
          break;
        }
      }
      if (!isHave) {
        this.filterCondition.push({
          name: tagName,
          type: "info",
          condition: letter,
        });
      }
    },
    // 修改搜索中的媒体状态 filterCondition
    mStateChange(state) {
      if (this.selectValue !== "被占查询") {
        let stateName = "";
        if (state === "1") {
          stateName = "正常";
        } else {
          stateName = "待安装";
        }
        this.isHaveThisTag("mstate", stateName);
        if (stateName !== "不限") {
          this.getAdsParamsData.mState = state;
        } else {
          this.getAdsParamsData.mState = "";
        }
        this.setPageNoAndTableData();
        this.getAdList();
      } else {
        sessFun.messageFun("warning", "被占查询状态下，无效切换!");
      }
    },
    // 媒体等级过滤
    gradeChange(data) {
      //   console.log("媒体等级过滤", data);
      this.isHaveThisTag("grade", data + "级");
      this.getAdsParamsData.grade = this.activeGrade;
      this.setPageNoAndTableData();
      this.getAdList();
    },
    // 广告限制切换
    activeADLimit(limit) {
      //   console.log("广告限制limit", limit); // 保险,恶俗医疗
      let limitText = limit.join(",");
      let stateName = "广告限制：" + limit.join("/");
      if (limit.length > 0) {
        this.isHaveThisTag("ADLimit", stateName);
      } else {
        for (let i in this.filterCondition) {
          if (this.filterCondition[i].condition === "ADLimit") {
            this.filterCondition.splice(i, 1);
            break;
          }
        }
      }
      this.getAdsParamsData.adLimit = limitText;
      this.setPageNoAndTableData();
      this.getAdList();
    },
    // 住户数量过滤
    tableHeaderFilter_h() {
      if (this.houseNum[0] == "" || this.houseNum[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName = "住户数量:" + this.houseNum[0] + "-" + this.houseNum[1];
        this.isHaveThisTag("houseNum", tagName);
        this.filterData.hNum = true;
        this.getAdsParamsData.houseNumMin = this.houseNum[0];
        this.getAdsParamsData.houseNumMax = this.houseNum[1];
        this.setPageNoAndTableData();
        this.getAdList();
      }
    },
    // 楼盘价格过滤
    tableHeaderFilter_p() {
      if (this.buildPrice[0] == "" || this.buildPrice[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName =
          "楼盘价格:" + this.buildPrice[0] + "-" + this.buildPrice[1];
        this.isHaveThisTag("buildPrice", tagName);
        this.filterData.bPrice = true;
        this.getAdsParamsData.hPriceMin = this.buildPrice[0] * 100;
        this.getAdsParamsData.hPriceMax = this.buildPrice[1] * 100;
        this.setPageNoAndTableData();
        this.getAdList();
      }
    },
    // 年份过滤
    tableHeaderFilterByLiveYear() {
      if (this.liveYear[0] == "" || this.liveYear[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName = "入住年份:" + this.liveYear[0] + "-" + this.liveYear[1];
        this.isHaveThisTag("liveYear", tagName);
        this.filterData.lYear = true;
        this.getAdsParamsData.liveYearMin = this.liveYear[0];
        this.getAdsParamsData.liveYearMax = this.liveYear[1];
        this.setPageNoAndTableData();
        this.getAdList();
      }
    },
    // 楼盘类型过滤
    tableHeaderFilter_cType(data) {
      //   console.log("楼盘类型过滤", data);
      this.isHaveThisTag("cType", data);
      if (data === "全部") {
        this.getAdsParamsData.buildType = "";
      } else {
        this.getAdsParamsData.buildType = this.buildValue;
      }
      this.setPageNoAndTableData();
      this.getAdList();
    },
    //人流量过滤
    tableHeaderFilterByPeopleFlow() {
      if (this.peopleFlow[0] == "" || this.peopleFlow[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName = "人流量:" + this.peopleFlow[0] + "-" + this.peopleFlow[1];
        this.isHaveThisTag("peopleFlow", tagName);
        this.filterData.pFlow = true;
        this.getAdsParamsData.peopleFlowMin = this.peopleFlow[0];
        this.getAdsParamsData.peopleFlowMax = this.peopleFlow[1];
        this.setPageNoAndTableData();
        this.getAdList();
      }
    },
    // 车流量过滤
    tableHeaderFilterByCarFlow() {
      if (this.carFlow[0] == "" || this.carFlow[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName = "车流量:" + this.carFlow[0] + "-" + this.carFlow[1];
        this.isHaveThisTag("carFlow", tagName);
        this.filterData.cFlow = true;
        this.getAdsParamsData.carFlowMin = this.carFlow[0];
        this.getAdsParamsData.carFlowMax = this.carFlow[1];
        this.setPageNoAndTableData();
        this.getAdList();
      }
    },
    // 车位数过滤
    tableHeaderFilterByParkSpaceNum() {
      if (this.parkSpaceNum[0] == "" || this.parkSpaceNum[1]) {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName =
          "车位数:" + this.parkSpaceNum[0] + "-" + this.parkSpaceNum[1];
        this.isHaveThisTag("parkSpaceNum", tagName);
        this.filterData.pSNum = true;
        this.getAdsParamsData.parkSpaceNumMin = this.parkSpaceNum[0];
        this.getAdsParamsData.parkSpaceNumMax = this.parkSpaceNum[1];
        this.setPageNoAndTableData();
        this.getAdList();
      }
    },
    emptyFun(letter) {
      // 清空
      if (letter === "H") {
        this.houseNum = ["", ""];
      } else if (letter === "B") {
        this.buildNum = ["", ""];
      } else if (letter === "P") {
        this.buildPrice = ["", ""];
      } else if (letter === "Y") {
        this.liveYear = ["", ""];
      } else if (letter === "PSN") {
        this.carFlow = ["", ""];
      } else if (letter === "CF") {
        this.parkSpaceNum = ["", ""];
      } else if (letter === "PF") {
        this.peopleFlow = ["", ""];
      }
    },
    // 根据购物车已有的mID对应AB面判断勾选
    judgeByselect() {
      this.currPageSelect = 0;
      if (this.shopingList.length > 0) {
        for (let i = 0; i < this.shopingList.length; i++) {
          this.hadADByshop(this.shopingList[i]);
        }
        if (this.currPageSelect == this.currPageAsLength) {
          this.IsAll = true;
        } else {
          this.IsAll = false;
        }
      }
    },
    // planList的勾选
    hadADByshop(data) {
      let shopAD = data;
      if (this.activeRName === shopAD.city) {
        for (let sourceRow of this.planList) {
          if (
            sourceRow.mID === shopAD.mID &&
            this.crossSchedules(shopAD.schedules)
          ) {
            for (
              let adSpaceKey = 0;
              adSpaceKey < sourceRow.adsList.length;
              adSpaceKey++
            ) {
              if (sourceRow.adsList[adSpaceKey].asID === shopAD.asID) {
                if (this.crossSchedules(shopAD.schedules)) {
                  sourceRow.adsList[adSpaceKey].checkBox = true;
                  this.currPageSelect++;
                }
                break;
              }
            }
            break;
          }
        }
      } else {
        // console.log("不同城市");
      }
    },
    // 重置planList的勾选
    resetPlanList() {
      for (let i = 0; i < this.planList.length; i++) {
        this.planList[i].adsList.forEach((item) => (item.checkBox = false));
        this.planList[i].pointCount = 0;
      }
    },
    //点位有时间交叉
    crossSchedules(sche) {
      let scheArr = sche.split("-");
      if (this.dateInput[0] <= scheArr[1] && this.dateInput[1] >= scheArr[0]) {
        return true;
      } else {
        return false;
      }
    },
    // 表头全选
    allCheckboxAds() {
      if (this.IsAll) {
        this.allSelectAdsBtn();
      } else {
        this.cancleSelectAds();
      }
    },
    // 表头勾选重置
    allCheckboxUpdata() {
      if (this.shopingList.length <= 0) {
        this.IsAll = false;
      } else {
        let isCheckBox = false;
        for (let key of this.planList) {
          if (key.checkBox) {
            isCheckBox = true;
            break;
          }
        }
        if (!isCheckBox) {
          this.IsAll = false;
        }
      }
    },
    // 全选表格点位
    allSelectAdsBtn() {
      this.allSelectToShop();
      this.shopShow_hide("all");
    },
    //取消全选
    cancleSelectAds() {
      for (let mediaItem of this.planList) {
        (mediaItem.adsList || []).forEach((adSpaceItem) => {
          if (adSpaceItem.checkFlag && adSpaceItem.checkBox) {
            for (let i = 0; i < this.shopingList.length; ) {
              if (adSpaceItem.asID === this.shopingList[i].asID) {
                this.shopingList.splice(i, 1);
                adSpaceItem.checkBox = false;
              } else {
                i += 1;
              }
            }
          }
        });
      }
      this.currPageSelect = 0;
    },
    //获取mouseEnter屏幕时的坐标像素
    mouseEnter(row, column, cell, event) {
      let e = event || window.event;
      this.shopXY.y = e.clientY;
    },
    // 选中A、B面的时候
    changeCheckBox(row, adSpaceItem) {
      if (adSpaceItem.checkBox) {
        this.shopShow_hide(); // 动画效果
        this.AddShopingInfo(row, adSpaceItem); // 添加到购物车
        this.addAdspaceToshopCart(row);
      } else {
        // A、B都勾选的时候
        this.IsAll = false;
        this.deleteShopRow(adSpaceItem);
      }
    },
    // 全选是放进购物车-广告门
    allSelectToShop() {
      let planListLength = this.planList.length;
      for (let i = 0; i < planListLength; i++) {
        let mediaInfo = this.planList[i];
        (mediaInfo.adsList || []).forEach((adSpaceItem) => {
          if (adSpaceItem.checkFlag && !adSpaceItem.checkBox) {
            adSpaceItem.checkBox = true;
            let selectInfo = this.setShopingTable(mediaInfo, adSpaceItem);
            this.currPageSelect++;
            this.shopingList.push(selectInfo);
          }
        });
      }
    },
    // 取消勾时,删除购物车里对应的数据行
    deleteShopRow(row) {
      this.currPageSelect--;
      let shopingListLength = this.shopingList.length;
      for (let j = 0; j < shopingListLength; j++) {
        if (this.shopingList[j].asID === row.asID) {
          let crossIf = this.crossSchedules(this.shopingList[j].schedules);
          if (crossIf) {
            this.shopingList.splice(j, 1);
            break;
          } else {
            // console.log("购物车中不存在相同点位");
          }
        }
      }
      this.allCheckboxUpdata();
    },
    // 购物车-获取地图选择的点位列表（亲邻地图）
    getMapADList() {
      //   console.log("触发获取地图选点信息click");
      this.getMapLoading = this.$loading({
        lock: true,
        text: "数据获取中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      api
        .getApi(this.apiVar.mapApi + "/adsListByUid", {
          asrIDs: this.planForm.pointOfAsrIDs.join(","),
          suID: this.BDData.uid,
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.mapAdsList = res.data.data;
            this.setMapAdsListInShopCar();
            localStorage.removeItem("qinlinMapCode");
          } else {
            this.getMapLoading.close();
            sessFun.messageFun("warning", res.data.MSG || "数据获取异常");
          }
        })
        .catch((err) => {
          this.getMapLoading.close();
          sessFun.messageFun("warning", "数据接口异常");
        });
    },
    // 根据地图选点返回的数据，设置成购物车所需的数据格式（亲邻地图）
    setMapAdsListInShopCar() {
      let tempArr = [];
      for (let key of this.mapAdsList) {
        let adInfo = {
          mID: key.mID,
          resType: key.resType,
          resID: key.resID,
          asID: key.asID,
          asLab: key.asLab,
          resName: key.resName,
          city: this.activeCityData.rName,
          rid: this.activeCityData.rid,
          origin: key.rName,
          buildType: key.cType,
          houseNum: key.hNum,
          buildPrice: key.hPrice / 100,
          mediaName: key.mTitle || "",
          mediaTypeName: key.mediaTypeName,
          mediaTypeId: key.mediaTypeId,
          buildNum: key.fNum,
          schedules: key.startDate + "-" + key.endDate,
          remark: key.remark || "",
          trafficState: key.trafficState || "",
          electrifyState: key.electrifyState || "",
          tradingArea: key.tradingArea,
          assetTag: key.assetTag,
          liveYear: key.chDay,
          mapCenter: "", // 地图中心点名称
          reference: key.centerInfos,
          address: key.resAddress || "",
          dNum: key.dNum || "", // 出入口数
          adLimit: key.notPush || "",
          connData: {
            connectResName: "",
            connectMedia: "",
            commentWorkRes: "",
            commentworkMedia: "",
          },
          connID: key.connID || "", // 连排门id
          industryInfos: key.industryInfos || [], // 同行业资源回避
          mediaLevel: key.grade || "",
          adPrice: (key.asPrice || 0) / 700,
          asName: key.asName || "", // 点位所属公司名称
          asrID: key.asrID, // 所属公司id
          province: key.province,
          notPush: key.notPush,
          parkSpaceNum: key.parkSpaceNum,
          peopleFlow: key.peopleFlow,
          carFlow: key.carFlow,
          unitId: key.unitId, // 单元ID
          buildingId: key.buildingId, // 楼栋ID
          actualAdsCnt: key.actualAdsCnt, // 最多可添加点位数量
        };
        if (this.getAdsParamsData.chooseType !== 0) {
          adObj.pointCount = this.shopingCarHasPoint(
            this.pointCountType,
            key[this.pointCountType]
          )
            ? this[`${this.pointCountType}Map`][key[this.pointCountType]]
            : 0;
        }
        if (key.centerInfos && key.centerInfos.length) {
          for (let item of key.centerInfos) {
            adInfo.mapCenter +=
              item.centerName +
              "-" +
              item.centerAddress +
              "-" +
              item.distance +
              "米,";
          }
        }
        if (this.qinLinJudgeHaveDiffAD(adInfo, "mapAds")) {
          tempArr.push(adInfo);
        }
      }
      //   console.log(
      //     "根据地图选点返回的数据，设置成购物车所需的数据格式",
      //     tempArr
      //   );
      if (this.shopingList.length !== 0) {
        for (let key of tempArr) {
          this.shopingList.push(key);
        }
      } else {
        this.shopingList = JSON.parse(JSON.stringify(tempArr));
      }
      this.getMapLoading.close();
      sessFun.messageFun("success", "成功获取到" + tempArr.length + "条数据");
      this.mapBtn = true;
      this.typeShopList = this.getTypeList();
      this.getShowList();
      this.computeMedia_AD("mapAD");
      this.judgeByselect();
    },
    // 判断点位是否已存在购物车（亲邻地图）
    qinLinJudgeHaveDiffAD(data, SourceType) {
      let ADData = data;
      let shopArr = this.shopingList;
      let ifBoolea = true;
      if (shopArr.length !== 0) {
        for (let i = 0; i < shopArr.length; i++) {
          if (ADData.asID === shopArr[i].asID) {
            // console.log("相同mid,相同面", ADData);
            let ADScheArr = ADData.schedules.split("-");
            let shopScheArr = shopArr[i].schedules.split("-");
            // 全等
            if (
              ADScheArr[0] == shopScheArr[0] &&
              ADScheArr[1] == shopScheArr[1]
            ) {
              if (SourceType === "mapAds") {
                let centerName = "";
                if (ADData.reference && ADData.reference.length) {
                  for (let key of ADData.reference) {
                    let keyCenter =
                      key.centerName +
                      "-" +
                      key.centerAddress +
                      "-" +
                      key.distance +
                      "米";
                    if (!shopArr[i].mapCenter.includes(keyCenter)) {
                      centerName += keyCenter + ",";
                    }
                  }
                }
                if (shopArr[i].mapCenter !== "") {
                  shopArr[i].mapCenter = shopArr[i].mapCenter + centerName;
                } else {
                  shopArr[i].mapCenter = centerName;
                }
              }
              ifBoolea = false;
              break;
              // 左相交
            } else if (
              ADScheArr[0] <= shopScheArr[1] &&
              ADScheArr[1] >= shopScheArr[0]
            ) {
              ifBoolea = false;
              break;
              // 被包含
            }
          }
        }
      }
      return ifBoolea;
    },
    // 移除同行资源点位
    removeCommentIndustryAds(letter) {
      let shopingData = this.shopShowList;
      let arr = [];
      let num = 0; // 记录移除个数
      for (let i = 0; i < shopingData.length; i++) {
        if (
          shopingData[i].connData.commentWorkRes !== "" ||
          shopingData[i].connData.commentworkMedia !== ""
        ) {
          if (letter === "media") {
            // 移除同行媒体点位
            if (shopingData[i].connData.commentworkMedia !== "") {
              //   console.log(i, "移除同行媒体点位", shopingData[i]);
              num++;
            } else {
              arr.push(shopingData[i]);
            }
          } else {
            num++;
          }
        } else {
          arr.push(shopingData[i]);
        }
      }
      if (num > 0) {
        sessFun.messageFun("success", "成功移除" + num + "条数据");
        this.getResultData(arr);
        this.computeMedia_AD();
        this.resetPlanList();
        this.judgeByselect();
      } else {
        sessFun.messageFun("warning", "暂无同行回避点位!");
      }
    },
    // 清空购物车
    clearShop() {
      if (this.shopingList.length > 0) {
        this.$confirm("此操作将删除已选的所有数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let arr = [];
            this.shopingList.forEach((item) => {
              this.clearAdspaceShopCart(item);
            });
            this.getResultData(arr);
            this.allCheckboxUpdata();
            this.computeMedia_AD();
            sessFun.messageFun("success", "删除成功");
            this.resetPlanList(); // 重置planList的勾选
          })
          .catch(() => {
            sessFun.messageFun("info", "已取消删除");
          });
      } else {
        sessFun.messageFun("warning", "无数据可删除");
      }
    },
    // 统计购物车媒体数、面数
    computeMedia_AD(letter) {
      let shopList = [];
      let currTab = this.activeName;
      if (!this.typeShopList[currTab]) return;
      shopList = this.typeShopList[currTab].asidList;
      //   console.log("购物车统计面数媒体数shopList", shopList);
      let mediaArr = [];
      let mediaAD = [];
      let resArr = [];
      let resAsidArr = [];
      let mediaLevelNum = { ALevel: 0, BLevel: 0, CLevel: 0 };
      // A面数量、B面数量
      let adSpaceStatistics = {};
      for (let key of shopList) {
        // 等级ABC
        if (key.mediaLevel === "A") {
          mediaLevelNum.ALevel++;
        } else if (key.mediaLevel === "B") {
          mediaLevelNum.BLevel++;
        } else if (key.mediaLevel === "C") {
          mediaLevelNum.CLevel++;
        }
        // A\B面
        if (key.asLab) {
          adSpaceStatistics[key.asLab] =
            (adSpaceStatistics[key.asLab] || 0) + 1;
        }
        if (!mediaArr.includes(key.mID)) {
          mediaArr.push(key.mID);
        }
        if (!mediaAD.includes(key.asID)) {
          mediaAD.push(key.asID);
        }
        if (!resArr.includes(key.resID)) {
          resArr.push(key.resID);
        }
        // 计算各个社区面数
        let isHad = false;
        for (let data of resAsidArr) {
          if (data.resID == key.resID) {
            isHad = true;
            if (!data.asidList.includes(key.asID)) {
              data.asidList.push(key.asID);
            }
            break;
          }
        }
        if (!isHad) {
          let obj = {
            resID: key.resID,
            asidList: [key.asID],
          };
          resAsidArr.push(obj);
        }
      }
      //   console.log("resAsidArr------", resAsidArr);
      this.shopMedia_ADNum.oneNum = this.getResAsidNum(1, resAsidArr);
      this.shopMedia_ADNum.twoNum = this.getResAsidNum(2, resAsidArr);
      this.shopMedia_ADNum.threeNum = this.getResAsidNum(3, resAsidArr);
      this.shopMedia_ADNum.moreNum =
        resAsidArr.length -
        this.shopMedia_ADNum.oneNum -
        this.shopMedia_ADNum.twoNum -
        this.shopMedia_ADNum.threeNum;
      this.shopMedia_ADNum.mediaNum = mediaArr.length;
      this.shopMedia_ADNum.ADNum = mediaAD.length;
      this.shopMedia_ADNum.resNum = resArr.length;
      this.mediaLevelNum = mediaLevelNum;
      this.adSpaceStatistics = adSpaceStatistics;
    },
    // 获取社区选一面两面三名的数据
    getResAsidNum(num, arr) {
      let result = arr.filter((item) => {
        return item.asidList.length == num;
      });
      return result.length;
    },
    // dialog购物筐的显示全选中后添加都购物车
    dialogVisible() {
      this.dialogTableVisible = true;
      this.typeShopList = this.getTypeList();
      this.handleClick();
    },
    // 组合typeShopList
    getTypeList() {
      let adSpaceGroupByMediaType = {};
      for (let shoppingItem of this.shopingList) {
        if (shoppingItem.mediaTypeId) {
          if (adSpaceGroupByMediaType[shoppingItem.mediaTypeId]) {
            adSpaceGroupByMediaType[shoppingItem.mediaTypeId].asidList.push(
              shoppingItem
            );
          } else {
            adSpaceGroupByMediaType[shoppingItem.mediaTypeId] = {
              type: shoppingItem.mediaTypeId,
              mediaTypeName: shoppingItem.mediaTypeName,
              asidList: [shoppingItem],
            };
          }
        }
      }
      return Object.entries(adSpaceGroupByMediaType).map(
        ([key, value]) => value
      );
    },
    // 切换tab
    handleClick() {
      this.getShowList();
      this.getEventList();
      this.computeMedia_AD();
    },
    // 设置购物车表格数据
    getShowList() {
      if (this.typeShopList[this.activeName]) {
        this.shopShowList = this.typeShopList[this.activeName].asidList || [];
      } else {
        this.shopShowList = [];
      }
    },
    // 获取事件
    getEventList() {
      let arr = [
        {
          label: "移除被占点位",
          value: 1,
        },
        {
          label: "移除同行已选小区",
          value: 3,
        },
        {
          label: "同资源保留1个点位",
          value: 5,
        },
        {
          label: "同资源保留2个点位",
          value: 6,
        },
      ];
      this.eventList = arr;
    },
    // 事件选择
    changeEvent(val) {
      //   console.log("val", val);
      if (this.shopShowList.length) {
        switch (val) {
          case 1:
            this.clearADLock();
            break;
          case 3:
            this.removeCommentIndustryAds("res");
            break;
          case 4:
            this.removeCommentIndustryAds("media");
            break;
          case 5:
            this.containNuminRes(1);
            break;
          case 6:
            this.containNuminRes(2);
            break;
        }
      } else {
        sessFun.messageFun(
          "warning",
          `没有${this.typeShopList[this.activeName].mediaTypeName || ""}数据`
        );
      }
    },
    // 清空被占的点位
    clearADLock() {
      this.$confirm("移除所有被占点位!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        type: "warning ",
      })
        .then(() => {
          let list = this.shopingList;
          let haveADLock = false;
          for (let i = 0; i < list.length; ) {
            if (list[i].lState !== undefined && list[i].lState.length > 0) {
              list.splice(i, 1);
              haveADLock = true;
            } else {
              i++;
            }
          }
          this.typeShopList = this.getTypeList();
          this.getShowList();

          if (haveADLock) {
            sessFun.messageFun("success", "移除成功");
            this.computeMedia_AD();
          } else {
            sessFun.messageFun("warning", "暂无被占点位");
          }
        })
        .catch(() => {
          sessFun.messageFun("info", "取消成功");
        });
      this.resetPlanList();
    },
    // 同资源保留个数
    containNuminRes(num) {
      let resultArr = this.funToArr(this.shopShowList, "resID");
      resultArr = this.resRandomNum(resultArr, num);
      let len = this.shopShowList.length;
      if (resultArr.length) {
        this.getResultData(resultArr);
        if (len != resultArr.length) {
          sessFun.messageFun("success", `成功保留同资源${num}个点位！`);
        } else {
          sessFun.messageFun("warning", "暂无同资源可移除的点位！");
        }
        this.computeMedia_AD();
        this.resetPlanList();
        this.judgeByselect();
      } else {
        sessFun.messageFun("warning", "暂无同资源可移除的点位！");
      }
    },
    // 随机保留num个数点位
    resRandomNum(arr, num) {
      let result = [];
      for (let data of arr) {
        if (num > 1) {
          let randomArr = [];
          let max = data.asidList.length;
          if (num >= max) {
            result = result.concat(data.asidList);
          } else {
            randomArr = this.randomFun([], num, data.asidList.length);
            for (let item of randomArr) {
              result.push(data.asidList[item]);
            }
          }
        } else {
          let randomNum = parseInt(Math.random() * data.asidList.length, 10);
          result.push(data.asidList[randomNum]);
        }
      }
      return result;
    },
    // 递归获取不同的随机数
    randomFun(arr, num, max) {
      if (arr.length < num) {
        let randomNum = parseInt(Math.random() * max, 10);
        if (!arr.includes(randomNum)) {
          arr.push(randomNum);
        }
        return this.randomFun(arr, num, max);
      } else {
        return arr;
      }
    },
    // 分组数据
    funToArr(arr, condition) {
      let resultArr = arr.reduce((groups, item) => {
        let groupFound = groups.find(
          (arrItem) => item[condition] === arrItem[condition]
        );
        if (groupFound) {
          if (
            !JSON.stringify(groupFound.asidList).includes(JSON.stringify(item))
          ) {
            //去重
            groupFound.asidList.push(item);
          }
        } else {
          //不要直接在原来的对象修改，新建对象
          let newGroup = {
            [condition]: item[condition],
            asidList: [item],
          };
          groups.push(newGroup);
        }
        return groups;
      }, []);
      return resultArr;
    },
    // 移除A/B面
    removeAllType(type) {
      let resultArr = this.funToArr(this.shopShowList, "mID");
      //   console.log("resultArr------------das---", resultArr);
      let len = this.shopShowList.length;
      if (resultArr.length > 0) {
        resultArr = this.isEnoughMedia(type, resultArr);
        this.getResultData(resultArr);
        if (len != resultArr.length) {
          sessFun.messageFun("success", `成功移除同门${type}的点位！`);
        } else {
          sessFun.messageFun("warning", "暂无可移除点位");
        }
        this.computeMedia_AD();
        this.resetPlanList();
        this.judgeByselect();
      } else {
        sessFun.messageFun("warning", "暂无可移除点位！");
      }
    },
    // 同一媒体是否有a/b面
    isEnoughMedia(type, arr) {
      let resultArr = [];
      for (let data of arr) {
        let result = [];
        if (data.asidList.length > 1) {
          result = data.asidList.filter((item) => {
            return item.asLab != type;
          });
        } else {
          result = data.asidList;
        }
        resultArr = resultArr.concat(result);
      }
      return resultArr;
    },
    // 购物车点位更新
    getResultData(resultArr) {
      // 非当前媒体类型点位
      let other = [];
      this.typeShopList.forEach((item, index) => {
        if (this.activeName != index) {
          other = other.concat(item.asidList);
        } else {
          item.asidList = resultArr;
        }
      });
      this.shopingList = other.concat(resultArr);
      this.shopShowList = resultArr;
    },
    // 当前行是否高亮
    tableRowClassName({ row }) {
      if (row.lState !== undefined && row.lState.length > 0) {
        return "warning-row";
      } else if (
        row.connData.connectResName !== "" ||
        row.connData.commentWorkRes !== "" ||
        row.connData.connectMedia !== ""
      ) {
        return "warning-row-conncet";
      } else {
        return "";
      }
    },
    // 打开购物车则计算连排门信息
    computeConnectAdData() {
      let shopData = this.shopingList;
      let shopDataLength = shopData.length;
      for (let i = 0; i < shopDataLength; i++) {
        //连排门设置
        if (i < shopDataLength - 1) {
          for (let j = i + 1; j < shopDataLength; j++) {
            if (
              shopData[i].connID !== "" &&
              shopData[i].mID !== shopData[j].mID &&
              shopData[i].connID === shopData[j].connID
            ) {
              if (shopData[i].connData.connectResName === "") {
                shopData[i].connData.connectResName = shopData[i].resName;
                shopData[i].connData.connectMedia =
                  shopData[i].mediaName + "、" + shopData[j].mediaName;
              } else {
                if (
                  !shopData[i].connData.connectMedia.includes(
                    shopData[j].mediaName
                  )
                ) {
                  shopData[i].connData.connectMedia +=
                    "、" + shopData[j].mediaName;
                }
              }
              shopData[j].connData.connectResName =
                shopData[i].connData.connectResName;
              shopData[j].connData.connectMedia =
                shopData[i].connData.connectMedia;
            }
          }
        }
        //同行业点位回避
        if (
          shopData[i].industryInfos !== null &&
          shopData[i].industryInfos.length > 0
        ) {
          let commentWorkArr = shopData[i].industryInfos;
          for (let key of commentWorkArr) {
            if (this.industryID === key.piID) {
              //   console.log("1");
              if (shopData[i].connData.commentWorkRes === "") {
                shopData[i].connData.commentWorkRes = key.piName;
              } else {
                if (!shopData[i].connData.commentWorkRes.includes(key.piName)) {
                  shopData[i].connData.commentWorkRes += "、" + key.piName;
                }
              }
              if (shopData[i].mID == key.mID) {
                if (shopData[i].connData.commentworkMedia === "") {
                  shopData[i].connData.commentworkMedia = key.piName;
                } else {
                  if (
                    !shopData[i].connData.commentworkMedia.includes(key.piName)
                  ) {
                    shopData[i].connData.commentworkMedia += "、" + key.piName;
                  }
                }
              }
            }
          }
        }
      }
    },
    // 重置购物车连排门信息
    resetConnectAdData() {
      for (let key of this.shopingList) {
        if (key.connData) {
          key.connData = {
            connectResName: "",
            connectMedia: "",
            commentWorkRes: "",
            commentworkMedia: "",
          };
        }
      }
    },
    // 购物车行被点击
    shopRowClick(row, event, column) {
      //   console.log("购物车行被点击row", row, column);
      if (row.lState !== undefined && row.lState.length > 0) {
        let dataArr = row.lState;
        console.log("row.asID", row.asID);
        let arr = [];
        for (let key of dataArr) {
          let star = timeFormat.toDate(key.lStar, "/");
          let end = timeFormat.toDate(key.lEnd, "/");
          arr.push({
            beOccupieApName: key.apName,
            schedules: star + "-" + end,
            lState: key.lState,
          });
        }
        this.beOccupiedAdsData = arr;
        // console.log("this.beOccupiedAdsData", this.beOccupiedAdsData);
        if (!this.shopDelRowClick) {
          this.beOccupiedDialogVisible = true;
        } else {
          this.shopDelRowClick = false;
        }
      } else if (
        row.connData.connectResName !== "" ||
        row.connData.commentWorkRes !== "" ||
        row.connData.connectMedia !== ""
      ) {
        this.ActiveConnectADList = row.connData;
        // console.log("this.ActiveConnectADList", this.ActiveConnectADList);
        this.connectAdDialogVisible = true;
      }
    },
    // 添加到购物车
    AddShopingInfo(mediaInfo, adSpaceInfo) {
      this.currPageSelect++;
      let selectInfo = this.setShopingTable(mediaInfo, adSpaceInfo);
      this.shopingList.push(selectInfo);
      if (this.currPageSelect == this.currPageAsLength) {
        this.IsAll = true;
      } else {
        this.IsAll = false;
      }
    },
    // 选点列表数据到购物车数据
    setShopingTable(mediaInfo, adSpaceInfo) {
      let selectInfo = {
        rid: mediaInfo.rid,
        mID: mediaInfo.mID,
        mediaTypeName: mediaInfo.mediaTypeName,
        mediaTypeId: mediaInfo.mediaTypeId,
        asID: adSpaceInfo.asID,
        asLab: adSpaceInfo.asLab,
        resName: mediaInfo.resName,
        resID: mediaInfo.resID,
        city: mediaInfo.city,
        origin: mediaInfo.origin,
        buildType: mediaInfo.buildType,
        houseNum: mediaInfo.houseNum,
        buildPrice: mediaInfo.buildPrice,
        mediaName: mediaInfo.mediaName,
        buildNum: mediaInfo.buildNum,
        schedules: mediaInfo.schedules,
        tradingArea: mediaInfo.tradingArea,
        assetTag: mediaInfo.assetTag,
        liveYear: mediaInfo.liveYear,
        adLimit: mediaInfo.adLimit,
        mapCenter: mediaInfo.reference || "", // 地图中心点名称
        reference: mediaInfo.reference || "",
        address: mediaInfo.address || "",
        dNum: mediaInfo.dNum || "", // 出入口数
        connData: {
          connectResName: "",
          connectMedia: "",
          commentWorkRes: "",
          commentworkMedia: "",
        },
        connID: mediaInfo.connID, // 连排门id
        industryInfos: mediaInfo.industryInfos, // 同行业资源回避
        adPrice: adSpaceInfo.adPrice || 0, // 点位价格
        mediaLevel: mediaInfo.mediaLevel, // 媒体等级
        asrID: mediaInfo.asrID, // 所属公司id
        asName: mediaInfo.asName, // 所属公司名称
        remark: mediaInfo.remark,
        trafficState: mediaInfo.trafficState || "",
        electrifyState: mediaInfo.electrifyState || "",
        province: mediaInfo.province,
        notPush: mediaInfo.notPush,
        parkSpaceNum: mediaInfo.parkSpaceNum,
        peopleFlow: mediaInfo.peopleFlow,
        carFlow: mediaInfo.carFlow,
        street: mediaInfo.street, //街道
        unitCount: mediaInfo.unitCount, //单元数量
        adsList: mediaInfo.adsList,
        alias: mediaInfo.alias,
        description: mediaInfo.description,
        supportingFacilities: mediaInfo.supportingFacilities,
        liveRate: mediaInfo.liveRate,
        liftType: mediaInfo.liftType,
        mediaTypeName: mediaInfo.mediaTypeName,
        mRemark: mediaInfo.mRemark,
        lng: mediaInfo.lng,
        lat: mediaInfo.lat,
        unitId: mediaInfo.unitId, // 单元ID
        buildingId: mediaInfo.buildingId, // 楼栋ID
        actualAdsCnt: mediaInfo.actualAdsCnt, // 最多可添加点位数量
      };
      if (this.getAdsParamsData.chooseType !== 0) {
        mediaInfo.pointCount =
          this[`${this.pointCountType}Map`][mediaInfo[this.pointCountType]];
      }
      return selectInfo;
    },
    // 自定义购物车表头-清空
    renderHeader(h, { column }) {
      // console.log('********h*******',h,column)
      return h(
        "span",
        {
          class: "clearShopping",
          on: {
            click: () => {
              this.clearShop();
            },
          },
        },
        [h("span", "清空")]
      );
    },
    // 购物车删除行
    deleteRow(adSpaceRow) {
      if (
        this.planList.length > 0 &&
        adSpaceRow.city === this.planList[0].city
      ) {
        for (let i = 0; i < this.planList.length; i++) {
          if (adSpaceRow.mID === this.planList[i].mID) {
            this.planList[i].adsList.forEach((adSpaceItem) => {
              if (adSpaceItem.asID === adSpaceRow.asID) {
                adSpaceItem.checkBox = false;
              }
            });
          }
          if (
            adSpaceRow[this.pointCountType] ===
            this.planList[i][this.pointCountType]
          ) {
            // 点位表对应的点位数据减一
            this.reduceAdspaceToshopCart(this.planList[i]);
            this.planList[i].pointCount--;
          }
        }
      }
      for (let j = 0, len = this.shopingList.length; j < len; ) {
        if (
          this.shopingList[j].asID == adSpaceRow.asID &&
          this.shopingList[j].schedules === adSpaceRow.schedules
        ) {
          this.shopingList.splice(j, 1);
          break;
        } else {
          j++;
        }
      }
      this.typeShopList = this.getTypeList();
      this.getShowList();
      this.computeMedia_AD();
      this.allCheckboxUpdata();
      event.stopPropagation();
    },
    //修改动画效果及显示隐藏
    shopShow_hide(all) {
      let R = this.shopXY.x;
      let T = this.shopXY.y;
      //   console.log("Right:", R, ",Top:", T);
      let shopAnimate = document.getElementsByClassName("shopAnimate")[0];
      let animateAll = document.getElementsByClassName("shopAnimateAll")[0];

      shopAnimate.style.top = this.shopXY.y + "px";
      shopAnimate.style.right = this.shopXY.x + "px";

      animateAll.style.top = this.shopXY.y + "px";
      animateAll.style.right = this.shopXY.x - 140 + "px";
      let that = this;
      if (all === "all") {
        this.selectAll = true;
        $(".shopAnimateAll").animate(
          {
            right: "37px",
            top: "77px",
            width: "18px",
            height: "18px",
          },
          700,
          function () {
            $(".shopAnimateAll").css({
              top: T,
              right: R,
              width: "790px",
              height: "386px",
            });
            that.selectAll = false;
          }
        );
      } else {
        this.shoppingShow = true;
        $(".shopAnimate").animate(
          {
            right: "37px",
            top: "77px",
            width: "18px",
            height: "18px",
          },
          700,
          function () {
            $(".shopAnimate").css({
              top: T,
              right: R,
              width: "650px",
              height: "49px",
            });
            that.shoppingShow = false;
          }
        );
      }
    },
    //行被点击
    rowClick(row, event, column) {
      if (!this.isOccupied) {
        let star = timeFormat.toDate(row.lStar, "/");
        let end = timeFormat.toDate(row.lEnd, "/");
        let arr = [];
        arr.push({
          beOccupieApName: row.apName,
          schedules: star + "-" + end,
          lState: row.lState,
        });
        this.beOccupiedAdsData = arr;
        this.beOccupiedDialogVisible = true;
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
    // 创建报价单结构
    creatAdPlan() {
      let mediaTypeList = [],
        apMinTime = null;
      for (let sKey of this.shopingList) {
        if (!(sKey.asrID && sKey.rid && sKey.mediaTypeId)) continue;
        let isHad = false;
        let tempSchedules = sKey.schedules.split("-");
        if (apMinTime > tempSchedules[0]) {
          apMinTime = tempSchedules[0];
        }
        for (let aKey of mediaTypeList) {
          if (
            aKey.asrID == sKey.asrID &&
            aKey.rID == sKey.rid &&
            aKey.mediaTypeId == sKey.mediaTypeId
          ) {
            isHad = true;
            tempSchedules[0] < aKey.pdStar && (aKey.pdStar = tempSchedules[0]);
            tempSchedules[1] > aKey.pdEnd && (aKey.pdEnd = tempSchedules[1]);
            aKey.pdNum++;
            aKey.pdDays +=
              (Date.parse(tempSchedules[1]) - Date.parse(tempSchedules[0])) /
                (3600 * 24 * 1000) +
              1;
            break;
          }
        }
        if (!isHad) {
          let tempObj = {
            asrID: sKey.asrID,
            rID: sKey.rid,
            city: sKey.city,
            mediaTypeId: sKey.mediaTypeId,
            pdStar: tempSchedules[0],
            pdEnd: tempSchedules[1],
            //总投放天数
            pdDays:
              (Date.parse(tempSchedules[1]) - Date.parse(tempSchedules[0])) /
                (3600 * 24 * 1000) +
              1,
            pdNum: 1,
            pdRemark: "",
            // 赠送面*天
            pdFreeNum: 0,
            // 广告费用
            pdAdFee: 0,
            // 实计制作费用
            pdAdMake: 0,
            pdTotal: 0,
            pdSendFee: 0,
            pdOtherFee: 0,
          };
          mediaTypeList.push(tempObj);
        }
      }
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apname: this.planForm.planName,
        adcid: this.planForm.ownerBU,
        bid: this.planForm.companyBrand,
        suid: this.BDData.uid,
        detail: JSON.stringify(mediaTypeList),
      };
      if (["ADN_BD_KA", "ADN_BD"].includes(this.sessionData.uType)) {
        delete params.suid;
      }
      if (this.isPay && this.BDData.uType === "ADN_BD") {
        if (this.planForm.opportunityId) {
          const tempOpportunity = this.opportunityList.find(
            (opportunity) =>
              opportunity.opportunityId === this.planForm.opportunityId
          );
          params.opportunityId = this.planForm.opportunityId;
          params.opportunityName =
            (tempOpportunity && tempOpportunity.opportunityName) || "";
        }
        params.customerMediaType = this.planForm.customerMediaType || null;
      }
      api
        .postApi(this.apiVar.Advertisement + "/CreateAPDBatch", params)
        .then((res) => {
          //   console.log("创建方案", res);
          if (res.data.SysCode == 200200) {
            this.FAData.apID = res.data.Data[0].apID;
            this.PushADBFun(res.data.Data);
            this.CreateShareADSFun();
            sessionStorage.setItem("plan_apid", res.data.Data[0].apID);
            let tempSet = new Set();
            let cityArea = [];
            mediaTypeList.forEach((item) => {
              let asrIDAndRid = `${item.asrID}&&${item.rid}`;
              if (!tempSet.has(asrIDAndRid)) {
                cityArea.push({
                  asrID: item.asrID,
                  city: item.city,
                  rid: item.rID,
                });
                tempSet.add(asrIDAndRid);
              }
            });
            sessionStorage.setItem("cityArea", JSON.stringify(cityArea));
          } else {
            this.ADloading.close();
            sessFun.messageFun("warning", "方案创建失败");
          }
        });
    },
    // 价格加上逗号
    priceFormat(price) {
      return commaFormat.init(price);
    },
    // 提交方案选点信息 7700 6700
    PushADBFun(data) {
      let ADBData = data;
      let cityArr = [];
      for (let j = 0; j < ADBData.length; j++) {
        let cityObj = {
          apID: ADBData[j].apID,
          pdID: ADBData[j].pdID,
          asrID: ADBData[j].asrID,
          city: ADBData[j].city,
          mediaTypeId: ADBData[j].mediaTypeId,
        };
        cityArr.push(cityObj);
      }
      let pbSetTime = this.timestampToTime(Date.parse(new Date()));
      //   console.log("当前日期时间", pbSetTime);
      let arr = [];
      for (let key of this.shopingList) {
        for (let cKey of cityArr) {
          if (
            key.city == cKey.city &&
            key.asrID == cKey.asrID &&
            cKey.mediaTypeId == key.mediaTypeId
          ) {
            let adsInfo = {
              uID: this.sessionData.uID,
              apID: cKey.apID,
              asID: key.asID,
              pdID: cKey.pdID,
              pbStar: key.schedules.split("-")[0],
              pbEnd: key.schedules.split("-")[1],
              mapCenterName: key.mapCenter,
              resID: key.resID,
              pbSetTime: pbSetTime,
            };
            if (
              this.customPermission.pptPermission &&
              this.customPermission.pptPermission.gzqylPermission == "1"
            ) {
              adsInfo.recommendReason = key.recommendReason || ""; //  亲粤邻定制：推荐理由
            }
            arr.push(adsInfo);
          }
        }
      }
      let postData = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        abList: arr,
      };
      api
        .postApi_json(
          this.apiVar.Advertisement +
            "/PushADB?uid=" +
            this.sessionData.uID +
            "&token=" +
            this.sessionData.token,
          postData
        )
        .then((res) => {
          console.log("PushADB提交选点", res);
          if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
            this.ADloading.close();
          } else {
            if (res.data === "" || res.data === null) {
              sessFun.messageFun("warning", "提交选点失败");
            } else {
              this.ADloading.close();
              this.active = 3;
              if (this.apMinTime <= this.dateTime) {
                sessFun.messageFun(
                  "warning",
                  "该方案的投放期已经开始，建议立即发布该方案！"
                );
              } else {
                sessFun.messageFun("success", "方案创建成功");
              }
              // 清除后台缓存
              let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
              };
              api
                .postApi(
                  this.apiVar.Advertisement + "/clearAdPlanBackups",
                  params
                )
                .then((res) => {
                  //   console.log("清空缓存的方案", res);
                  if (res.data.SysCode === 200200) {
                    // console.log("缓存方案清除成功");
                  } else {
                  }
                });
              // 清除前台缓存
              cacheAdPlan.removeData(this.sessionData.uID);
            }
          }
        });
    },
    // 生成协同选点aiCode
    CreateShareADSFun() {
      let urlPath = location.href;
      console.log(urlPath);
      let aiInfo = {
        apname: this.planForm.planName,
        cname: this.cName,
        cband: this.cBand,
      };
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: this.FAData.apID,
        aiinfo: JSON.stringify(aiInfo),
      };
      api
        .postApi(this.apiVar.Advertisement + "/CreateShareCode", params)
        .then((res) => {
          //   console.log("生成协同选点aiCode", res);
          this.apAicode = res.data.aiCode; // 协同选点 aiCode
          this.shareADUrl =
            this.apiVar.qadnUrl +
            "/shareADList?apid=" +
            this.FAData.apID +
            "&aicode=" +
            res.data.aiCode;
          this.active = 3;
        });
    },
    /*完成*/
    //查看方案
    ToDetail() {
      this.$router.push("./planDetail");
    },
    // 继续创建
    continueCreate() {
      this.$router.go(0);
      // this.$router.push("./createPlanOld");
      // location.reload(false)
    },
    //复制协同选点的url
    copyUrl() {
      let Url = document.getElementById("shareUrl").innerText;
      console.log("url", Url);
      let oInput = document.createElement("input");
      oInput.value = Url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.style.display = "none";
      sessFun.messageFun("success", "复制成功");
    },
    // 公用方法
    // 方案异常时，存储当前方案基本数据及购物车点位等临时信息
    saveApInfo() {
      this.isSelect = true;
      //获取当前选择的公司id
      let selectedAsrIds = this.planForm.pointOfAsrIDs.join(",");
      if (!selectedAsrIds) {
        selectedAsrIds = this.BDData.asrID
          ? this.BDData.asrID + ""
          : this.cacheAsrID;
      }
      let planInfo = {
        uid: this.sessionData.uID,
        setTime: this.timestampToTime(Date.parse(new Date())),
        planData: {
          asrID: selectedAsrIds, //缓存公司id
          suid: this.BDData.uid, // 销售uid,如果是销售自己创建方案则uid与suid相同
          uType: this.BDData.uType, // 销售权限
          baseInfo: this.planForm,
          adsList: this.shopingList,
          throwCity: this.throwCity,
          companyBrand: this.companyBrand,
        },
      };
      //   console.log(
      //     "方案异常时，存储当前方案基本数据及购物车点位等临时信息",
      //     planInfo
      //   );
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        adPlan: JSON.stringify(planInfo),
      };
      api
        .postApi(this.apiVar.Advertisement + "/createAdPlanBackups", params)
        .then((res) => {
          //   console.log("res创建方案缓存", res);
          if (res.data.SysCode == 200200) {
          } else {
            // 后台缓存异常，则前台缓存到localStorage
            // cacheAdPlan.setData(planInfo)
          }
        });
      cacheAdPlan.setData(planInfo);
    },
    // 设置方案信息
    async setPlanInfo() {
      let returnData = cacheAdPlan.getData(this.sessionData.uID);
      if (returnData) {
        this.unfinishedData = returnData;
        this.planForm = returnData.planData.baseInfo;
        this.BDData.uid = returnData.planData.suid;
        this.BDData.uType = returnData.planData.uType || "";
        this.throwCity = returnData.planData.throwCity;
        this.shopingList = returnData.planData.adsList;
        this.companyBrand = returnData.planData.companyBrand;
        this.cacheAsrID = returnData.planData.asrID;
        if (["ADN_MD_COUNTRY", "ADN_MD"].includes(this.sessionData.uType)) {
          this.getCityList();
          // getIndustryBycID需要先获取Get_cName
          await this.Get_cName();
          // 媒介需构建销售下拉选项-第一步
          let arr = [
            {
              label: this.planForm.realNamesName,
              value: this.BDData.uid,
            },
          ];
          this.salerList = arr;
        }
        this.active = 1;
        // console.log("设置方案信息returnData", returnData);
        // 设置城市及对应的区域
        this.getAreaFun();
        this.getMediaTypesByCompany();
        this.getRejectPlanList(); // 获取排斥方案列表
        this.getIndustryBycID(); // 根据所选公司获取公司所属行业
      } else {
        this.$router.push("./createPlanOld");
        return;
      }
    },
    // 时间戳转换成日期格式 2018-06-18 10:33:24
    timestampToTime(timestamp) {
      let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = date.getDate() + " ";
      let h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      let m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":"; //date.getMinutes() + ':';
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //date.getSeconds();
      return Y + M + D + h + m + s;
    },

    // 列展示
    filterColumn(columns) {
      this.currentColumn = columns;
      this.itemKey = Math.random();
    },
    // 刷新列表
    refreshTable() {
      this.getAdList();
    },
    // 更改列表行距
    spaceSetting(size) {
      this.rowSpace = size;
    },

    // 设备型号筛选
    activeMtype(value) {
      this.mediaMType = value;
      this.setPageNoAndTableData();
      this.getAdList();
    },
    // 安装位置筛选
    activeSite(value) {
      this.site = value;
      this.setPageNoAndTableData();
      this.getAdList();
    },
    // 位置朝向
    activeSiteOrientation(value) {
      this.siteOrientation = value;
      this.setPageNoAndTableData();
      this.getAdList();
    },

    // 选点媒体信息标签
    getMediaTag(tagName) {
      let selectedAsrIds = this.planForm.pointOfAsrIDs.join(",");
      if (!selectedAsrIds) {
        selectedAsrIds = this.BDData.asrID
          ? this.BDData.asrID + ""
          : this.cacheAsrID;
      }
      const params = {
        companyIds: selectedAsrIds,
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        tagName,
      };
      return new Promise((resolve, reject) => {
        api
          .getApi("/addsp/api/v1/media/company/mediaTag", params)
          .then((res) => {
            console.log(res.data, "ss");
            resolve(res.data.data);
          })
          .catch((error) => {
            reject(error);
            console.log(error, "error---getMediaTag");
          });
      });
    },

    async initMediaTag() {
      // 设备型号
      this.mTypeList = [
        { dictDesc: "全部", dictValue: "" },
        ...(await this.getMediaTag("media_mType")),
      ];
      // 安装位置
      this.sites = [
        { dictDesc: "全部", dictValue: "" },
        ...(await this.getMediaTag("media_site")),
      ];
      // 位置朝向
      this.siteOrientations = [
        { dictDesc: "全部", dictValue: "" },
        ...(await this.getMediaTag("media_siteOrientation")),
      ];
    },

    // 点位数量变化
    async handlePointCountChange(currentValue, oldValue, row) {
      let addNum = currentValue - oldValue;
      if (+currentValue > +oldValue) {
        const point = await this.handlePointRequest(addNum, row);
        this.shopShow_hide(); // 动画效果
        point.forEach((item) => {
          item.adsList.forEach((adSpaceItem) => {
            this.AddShopingInfo(item, adSpaceItem);
            this.addAdspaceToshopCart(item);
          });
        });
      } else {
        const arr = this.shopingList.filter((item) => {
          return (
            item[this.pointCountType] === row[this.pointCountType] &&
            item.schedules === row.schedules &&
            item.mediaTypeId === this.currentMediaType
          );
        });
        const delArr = arr.slice(0, oldValue - currentValue) || [];
        delArr.forEach((item) => {
          item.adsList.forEach((adSpaceItem) => {
            this.deleteShopRow(adSpaceItem);
          });
        });
      }
    },

    // 添加点位数请求
    handlePointRequest(addNum, row) {
      let paramsData = {
        prID: this.city[this.activeIndex].rid,
        mediaTypeId: this.currentMediaType,
        dateTimeBegin: this.dateInput[0],
        dateTimeEnd: this.dateInput[1],
        uid: this.BDData.uid,
        asrIDs: this.BDData.asrIDs || "",
        chooseType: this.getAdsParamsData.chooseType,
        resID: row.resID,
        [this.pointCountType]: row[this.pointCountType],
        addNum,
      };

      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "AddShopCartItem",
        data: paramsData,
      };
      return api.postApi_new(this.apiVar.Media, params).then((res) => {
        if (res.data.SysCode === 200200) {
          if (Array.isArray(res.data.data.list)) {
            let list = this.setTableDataADDoor(res.data.data.list, true);
            return Promise.resolve(list);
          }
        }
      });
    },

    // 减少点位到购物车，更新楼栋，小区，单元数量统计
    reduceAdspaceToshopCart(adApaceInfo) {
      if (Reflect.has(this.buildingIdMap, adApaceInfo.buildingId)) {
        this.buildingIdMap[adApaceInfo.buildingId] -= 1;
      }

      if (Reflect.has(this.unitIdMap, adApaceInfo.unitId)) {
        this.unitIdMap[adApaceInfo.unitId] -= 1;
      }

      if (Reflect.has(this.resIDMap, adApaceInfo.resID)) {
        this.resIDMap[adApaceInfo.resID] -= 1;
      }
    },

    clearAdspaceShopCart(adApaceInfo) {
      if (Reflect.has(this.buildingIdMap, adApaceInfo.buildingId)) {
        this.buildingIdMap[adApaceInfo.buildingId] = 0;
      }

      if (Reflect.has(this.unitIdMap, adApaceInfo.unitId)) {
        this.unitIdMap[adApaceInfo.unitId] = 0;
      }

      if (Reflect.has(this.resIDMap, adApaceInfo.resID)) {
        this.resIDMap[adApaceInfo.resID] = 0;
      }
    },

    // 增加点位到购物车，更新楼栋，小区，单元数量统计
    addAdspaceToshopCart(adApaceInfo) {
      if (Reflect.has(this.buildingIdMap, adApaceInfo.buildingId)) {
        this.buildingIdMap[adApaceInfo.buildingId] += 1;
      } else {
        this.buildingIdMap[adApaceInfo.buildingId] = 1;
      }

      if (Reflect.has(this.unitIdMap, adApaceInfo.unitId)) {
        this.unitIdMap[adApaceInfo.unitId] += 1;
      } else {
        this.unitIdMap[adApaceInfo.unitId] = 1;
      }

      if (Reflect.has(this.resIDMap, adApaceInfo.resID)) {
        this.resIDMap[adApaceInfo.resID] += 1;
      } else {
        this.resIDMap[adApaceInfo.resID] = 1;
      }
    },

    // 初始化点位数量
    initPointCounts(arr) {
      const buildingIdMap = {};
      const unitIdMap = {};
      const resIDMap = {};
      arr.forEach((item) => {
        if (buildingIdMap[item.buildingId]) {
          buildingIdMap[item.buildingId]++;
        } else {
          buildingIdMap[item.buildingId] = 1;
        }
        if (unitIdMap[item.unitId]) {
          unitIdMap[item.unitId]++;
        } else {
          unitIdMap[item.unitId] = 1;
        }
        if (resIDMap[item.resID]) {
          resIDMap[item.resID]++;
        } else {
          resIDMap[item.resID] = 1;
        }
      });

      this.buildingIdMap = buildingIdMap;
      this.unitIdMap = unitIdMap;
      this.resIDMap = resIDMap;
    },

    // 判断购物车里是否有已选点位，计算点位数
    shopingCarHasPoint(type, typeId) {
      const pointCount = this.shopingList.filter(
        (item) => item[type] === typeId
      );
      return pointCount.length || 0;
    },

       // 配点弹窗
       handlePointSetting () {
      this.pointSettingShow = true
    },

    // 查看配点详情
    handlePointDetails (data) {
      this.pointTableShow = true
      this.adResMatch = data
    },

    // 保存配点 
    savePoint (arr) {
      for (let info of arr) {
        this.isHaveDiffPush(info);
      }
      this.judgeByselect();
      this.dialogVisible();
      this.pointTableShow = false
    },
    // 重新配点
    resetPoint () {
      this.pointTableShow = false
      this.pointSettingShow = true
    }

  },
  // 页面销毁
  destroyed() {
    if (this.active == 1 || this.active == 2) {
      //   console.log("页面销毁----");
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .postApi(this.apiVar.Advertisement + "/AddCreatePlanLog", params)
        .then((res) => {
          //   console.log("上报成功-----", res);
        })
        .catch((err) => {
          //   console.log("上报失败-----", err);
        });
    }
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/component.scss";
/deep/ .el-table__fixed,
/deep/ .el-table__fixed-right {
  height: 584px !important;
}

/deep/ .el-table__fixed-right {
  right: 6px !important;
}

/*/deep/ .el-table__fixed-right-patch{*/
/*right: 8px !important;*/
/*}*/
/deep/ .selectAdsTable .el-table__empty-text {
  left: 25%;
}

/deep/ .selectAdsTable .el-table_1_column_1 {
  text-align: center;
}

/deep/ .el-loading-mask {
  z-index: 990;
}

/deep/ .el-step__main {
  height: 20px;
}

.adsTable {
  position: relative;
  margin-top: 5px;
  .space-group {
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    overflow: auto;
    .space-item {
      margin-right: 12px;
    }
  }
}

.myCheckbox {
  position: absolute;
  width: 100px;
  height: 54px;
  text-align: center;
  line-height: 54px;
  top: 0;
  left: 0;
  z-index: 99;
}

.urlBtn {
  color: #1890ff;
  cursor: pointer;
}

.mapBtn {
  display: inline-block;
  min-width: 110px;
  text-align: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  vertical-align: bottom;
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
}

.button_row {
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
.warningInfoColor {
  display: inline-block;
  height: 16px;
  width: 16px;
  border-radius: 4px;
  vertical-align: middle;
}

.warningInfo .warningInfoName {
  color: #333;
  font-size: 12px;
}

/* 购物车表格分页 */
.cart-pagination /deep/ .el-input__inner {
  width: 100%;
}

/*状态行*/
/deep/ .el-table .warning-row {
  background: #ffc1be;
}

/deep/ .el-table .warning-row-conncet {
  background: #ffe093;
}

.shopList_adLimit {
  width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
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

.shopAnimate,
.shopAnimateAll {
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
  color: #d9d9d9;
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

.content_top_wrap,
.content_bottom_wrap {
  background: #ffffff;
  border: 1px solid #dedede;
  padding: 32px 18px 40px 18px;
}

.content_top_wrap .content_top_head {
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #dedede;
}

.content_bottom_wrap .content_bottom_head {
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #dedede;
}

.content_top_wrap .content_top_head h2,
.content_bottom_wrap .content_bottom_head h2 {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #2c313c;
  font-weight: bold;
  padding-left: 16px;
  height: 24px;

  margin-top: 8px;
}

.content_top_wrap .content_top_form_wrap,
.content_bottom_wrap .content_bottom_form_wrap {
  padding: 18px;
}

/*按钮*/
.content_bottom_btn {
  width: 100%;
  position: absolute;
  bottom: -100px;
  margin-bottom: 22px;
  text-align: center;
  .finishBtn {
    display: flex;
    justify-content: center;
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
}

.content_bottom_btn button {
  width: 80px;
  height: 34px;
  outline: none;
  cursor: pointer;
}

.content_bottom_btn button.create {
  background: #108ee9;
  border-radius: 4px;
  font-size: 14px;
  border: none;
  color: #ffffff;
}

.content_bottom_btn button.cancel {
  background: #ffffff;
  font-size: 14px;
  color: #666666;
  border: 1px solid #d9d9d9;
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
/deep/ .type-select .el-input,
/deep/ .type-select .el-input__inner {
  width: 95px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding-right: 0;
}

/deep/ .type-select .el-input__inner {
  padding-left: 10px;
  color: rgb(144, 147, 153);
}

/*方案排斥*/
/deep/ .reject_select {
  left: -6px;
}

/deep/ .reject_select .el-input,
/deep/ .reject_select .el-input__inner {
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
  line-height: 26px;
  /* top: -3px; */
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

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
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
.importXle.el-button--success {
  background: #51e171;
  border-color: #51e171;
}

/deep/ .map.el-button--primary {
  background: #ff8f49;
  border-color: #ff8f49;
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

.content_bottom_btn /deep/ .el-button span a {
  color: #606266;
}

.search-wrap {
  position: relative;
  /*清除浮动*/
  overflow: hidden;
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
  border: 1px solid #d8d8d8;
  /*margin-top: 30px;*/
  margin-top: 18px;
  padding: 0 18px 0 18px;
}

.dw-panel dl {
  border-bottom: 1px dashed #d8d8d8;
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
  color: #1890ff;
  border: 1px solid #1890ff;
}

.dw-panel .other-dd {
  padding-left: 0px;
}

.otherSelect {
  /deep/ .el-input__inner {
    max-width: 135px;
    height: 30px;
    padding-left: 10px;
    color: #1890ff;
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

.adLimitSelect /deep/ .el-select__tags > span {
  width: 68px;
  height: 28px;
  overflow: hidden;
}

.otherSelect /deep/ .el-tag {
  background: #fff;
  color: #1890ff;
}

.otherSelect /deep/ .el-input__inner:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.otherSelectActive /deep/ .el-input__inner {
  border-color: #1890ff;
}

.otherSelectActive /deep/ .el-input .el-select__caret {
  color: #1890ff;
}

.otherBtn.el-button {
  border-radius: 0;
  color: rgba(0, 0, 0, 0.35);
}

.otherBtn.el-button:hover {
  border-color: #1890ff;
}

.otherBtnActive.el-button {
  border-color: #1890ff;
  color: #1890ff;
}

.input-wrap {
  text-align: center;
}

.input-wrap .input {
  width: 66px;
  height: 26px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(194, 194, 194, 1);
}

.input-wrap .input-wrap-Btn {
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
.filter-condition {
  width: 100%;
  height: 36px;
  line-height: 36px;
  margin: 5px 0 0;
  background: rgb(241, 241, 241);
}

.filter-condition /deep/ .el-tag {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.35);
  margin-left: 10px;
}

.filter-condition /deep/ .el-tag:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.filter-condition /deep/ .el-tag:hover .el-tag__close.el-icon-close {
  color: #1890ff;
}

/* /deep/ .el-tag__close.el-icon-close:hover {
        background: #fff;
    } */

/*表格*/
/deep/ .el-table th,
.el-table tr {
  background: #f7f7f7;
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

/deep/ .el-table__expanded-cell[class*="cell"] {
  padding: 0 86px;
  background-color: #f7f7f7;
}

/deep/ .el-table__expanded-cell[class*="cell"] .el-form {
  height: 44px;
  line-height: 44px;
}

/deep/ .el-form-item__content {
  line-height: 46px;
}

/deep/ .el-form-item__label {
  padding: 0 0 0 0px;
}

/deep/ .selectAdsTable .el-table__body-wrapper {
  overflow-x: auto !important;
}

/deep/ .selectAdsTable .el-checkbox__label {
  padding-left: 4px;
}

/deep/ .car-list .el-table__body-wrapper {
  min-height: 382px;
  max-height: 402px;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden !important;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background: #fafafa;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c1c1c1;
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
  min-height: 680px;
}

.step3 /deep/ .el-dialog {
  width: 388px !important;
}

/*购物车列表*/
/deep/ .shop-cart-wrapper {
  .el-table tr th,
  .el-table tr td {
    height: 46px;
    .cell {
      height: 25px;
      line-height: 25px;
    }
  }
  .shopcar_box {
    padding: 24px 24px 0;
  }
  .top-row {
    margin-bottom: 10px;
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
    padding-bottom: 10px;
    text-align: center;
    border-top: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__body {
    padding: 0;
    border-bottom: none;
  }
}
.car-title {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
  background: #e6f7ff;
  .el-icon-info {
    color: #1890ff;
    margin-right: 4px;
  }
  span {
    font-size: 14px;
    font-weight: 600;
    color: #1890ff;
  }
  h4 {
    font-size: 14px;
    display: inline-block;
  }
}
.divide-border {
  display: inline-block;
  width: 1px;
  height: 14px;
  vertical-align: middle;
  margin: 0 8px;
  background: rgba(0, 0, 0, 0.1);
}

/deep/ .car-list .el-table__expanded-cell[class*="cell"] {
  padding: 0 46px;
  background-color: #f7f7f7;
}

/deep/ .table_wrap.car-list {
  margin-top: 0 !important;
}

/*提示*/
.tip {
  width: 100%;
  background: rgba(230, 247, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(145, 213, 255, 1);
  padding: 10px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.tip span {
  color: #1890ff;
}

.tip /deep/ .el-icon-info {
  color: #1890ff;
  margin-right: 8px;
}

/*超出省略*/
/deep/ .el-table .cell {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .el-table__row .cell span {
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
  border: 1px solid #d8d8d8;
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
  background: #fafafa;
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

/deep/ .step3 .el-input__inner,
/deep/ .step3 .el-textarea__inner {
  width: 348px;
}

/*广告费修改-赠送面天*/
/deep/ .step3 .is-controls-right .el-input__inner {
  width: 304px;
}

/*计数器*/
/deep/ .el-input-number__decrease,
/deep/ .el-input-number__increase {
  background-color: transparent !important;
}

/deep/ .el-icon-arrow-down {
  position: relative;
  top: 1px;
}

/deep/ .el-input-number .el-input__suffix {
  right: 42px !important;
}

.createPlan .type-select /deep/ .el-input__suffix {
  right: 4px;
}

/deep/
  .el-input-number.is-controls-right
  .el-input-number__decrease
  [class*="el-icon"],
.el-input-number.is-controls-right
  .el-input-number__increase
  [class*="el-icon"] {
  position: relative;
  top: 2px;
}

/deep/ .el-input-number {
  width: 304px;
  margin-bottom: 5px;
}

/deep/ .el-table th > .cell.highlight {
  color: #409eff !important;
}

.changeMakePrice .el-input__inner {
  width: 352px;
  height: 34px;
  margin-top: 6px;
}

/deep/ .changeMakePrice .NoClassified /deep/ .el-input-number,
/deep/ .step3 .NoClassified .is-controls-right .el-input__inner {
  width: 352px;
}

/deep/ .el-input-number.is-controls-right .el-input__inner {
  text-align: left;
}

/deep/ .el-tabs--border-card {
  box-shadow: none;
  border: 1px solid #d8d8d8;
}

/*完成创建*/
.successIcon img {
  width: 72px;
}

.successIcon h2 {
  font-size: 24px;
  color: #333333;
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: bold;
}

.successIcon p {
  font-size: 14px;
  color: #999999;
  margin-bottom: 16px;
}

.planPanel,
.successIcon {
  text-align: center;
}

.planPanel {
  width: 557px;
  background: #fafafa;
  border-radius: 2px;
  padding: 19px 0;
  box-sizing: border-box;
  margin: 0 auto;
}

.planPanel ul li {
  padding-left: 136px;
  line-height: 26px;
  text-align: left;
  font-size: 14px;
  color: #666666;
  margin-bottom: 10px;
}

.planPanel ul li.money {
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 600;
  color: #666666;
}
.plan-url {
  white-space: nowrap;
  width: 237px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
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
}

.noShareUl ul li {
  margin-bottom: 12px !important;
}

/*一键选点*/
/deep/ .onKeyPointFrom .el-form-item__content {
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

.ABcalePercent {
  position: relative;
}

.ABcalePercent .percent {
  position: absolute;
  top: 0;
  right: 28px;
}

.el-dialog__footer {
  text-align: center;
}

.OneKeyPoint_footer button {
  padding: 0;
  line-height: 34px;
}

/deep/ .clearShopping {
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
}

/* 方案导入 */
.import_fanan a {
  color: #606266;
}

.import_fanan .fileButton {
  width: 126px;
}

.upload_file {
  display: inline-block;
}

.warning_box {
  margin-top: 20px;
  background: rgba(255, 251, 230, 1);
  border-radius: 4px;
  border: 1px solid rgba(255, 229, 143, 1);
  color: rgba(0, 0, 0, 0.65);
  padding: 0 5px;
}

.upload_file .aButton {
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

.aButton:hover {
  border: 1px solid #409eff;
  color: #409eff;
}
/*safari下表头错位*/
/deep/ .el-table .el-table-column-checkbox .cell {
  min-width: 110px;
  height: auto;
}

/deep/ .el-table .el-table-column-resName .cell {
  min-width: 200px;
}

/deep/ .el-table .el-table-column-mediaName .cell {
  min-width: 140px;
}

/deep/ .el-table .el-table-column-mediaRemark .cell {
  min-width: 140px;
}

.ad_pagination /deep/ .el-pagination__sizes .el-input__inner {
  width: 100px;
  height: 28px;
}

.ad_pagination /deep/ .el-pagination__editor.el-input .el-input__inner {
  width: 45px;
}

.table-set {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}

.chooseType-radio {
  height: 32px;
  /deep/ .el-radio-button {
    height: 32px;
    .el-radio-button__inner {
      padding: 0 16px;
      height: 32px;
      line-height: 32px;
    }
  }
}
.pointNum {
  display: flex;
  align-items: center;
  padding-left: 16px;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.85);
}

.pointCount-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
}

.pointCount-input {
  width: 108px;
  overflow: hidden;
  /deep/ .el-input__inner {
    width: 108px !important;
    height: 24px !important;
    line-height: 24px !important;
  }
  /deep/ .el-input-number__decrease,
  /deep/.el-input-number__increase {
    height: 24px !important;
  }
}
</style>
<style>
.el-tooltip__popper.is-dark {
  max-width: 200px;
}

.other-dd-popper {
  padding: 6px;
}
</style>
