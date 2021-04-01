<template>
  <div class="ad_mediaMana_wrap createPlan">
    <div class="ad_mediaMana_nav clearfix">
      <p><a href="#">方案管理</a><em> / </em><a href="#">创建方案</a></p>
    </div>
    <div class="mediaMana_content_top">
      <div class="content_top_wrap">
        <!--选择点位-->
        <div class="step2" v-if="active == 1">
          <div>
            <div class="search-nav">
              <div class="search-wrap">
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
                  <el-input
                    class="planAdsCntClass"
                    placeholder="请输入内容"
                    v-model="planAdsCnt"
                    @change="planAdsCntChange"
                  >
                    <template slot="prepend">投放面数</template>
                  </el-input>
                </div>
                <div>
                  <el-button
                    type="primary"
                    style="background: #1890ff"
                    icon="el-icon-search"
                    class="searchBtn"
                    @click="searchFun"
                    :disabled="searchBtnAbled"
                    v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt049_ck01' }"
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
                  <!--                                    <el-button type="primary" class="map" icon="el-icon-location-outline"-->
                  <!--                                               @click="judgeMapSelect"-->
                  <!--                                               v-qadn-mta-h5="{id: 'a004_b008_c000_d000_bt050_ck03'}">地图-->
                  <!--                                    </el-button>-->
                  <el-button
                    type="primary"
                    class="map"
                    icon="el-icon-location-outline"
                    @click="setMapParams"
                    v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt050_ck03' }"
                    >地图
                  </el-button>
                  <el-button
                    type="success"
                    class="importXle"
                    @click.native.prevent="importFanan('res')"
                    v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt051_ck04' }"
                  >
                    导入小区
                  </el-button>
                  <!-- <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        @click.native.prevent="importFanan('res')"
                        v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt051_ck04' }"
                      >
                        导入小区
                      </el-dropdown-item> -->
                  <!-- <el-dropdown-item
                        @click.native.prevent="importFanan('ads')"
                        v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt052_ck04' }"
                      >
                        导入点位
                      </el-dropdown-item> -->
                  <!-- </el-dropdown-menu> -->
                  <!-- <el-button
                    type="primary"
                    @click="importFanan('copy')"
                    v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt054_ck04' }"
                    >复制方案
                  </el-button>
                  <el-button
                    plain
                    @click="dialogOneKeyPoint = true"
                    v-qadn-mta-h5="{ id: 'a004_b008_c000_d000_bt055_ck04' }"
                    >一键选点
                  </el-button> -->
                </el-col>
              </el-row>
            </div>
            <!--类型区域选择面板-->
            <div class="dw-panel" v-show="isOccupied">
              <dl>
                <dt>资源类型：</dt>
                <dd
                  :class="recType === 1 ? 'active' : ''"
                  @click="activeRecType(1)"
                >
                  社区
                </dd>
                <dd
                  :class="recType === 2 ? 'active' : ''"
                  @click="activeRecType(2)"
                >
                  写字楼
                </dd>
              </dl>
              <dl>
                <dt>媒体类型：</dt>
                <dd
                  :class="mediaType === '广告门' ? 'active' : ''"
                  @click="activeMediaType('广告门')"
                >
                  广告门
                </dd>
                <!-- <dd
                  :class="mediaType === '道闸' ? 'active' : ''"
                  @click="activeMediaType('道闸')"
                >
                  道闸
                </dd> -->
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
                  v-for="(item, index) of list"
                  :key="index"
                  :class="item.rName == areaName ? 'active' : ''"
                  @click="activeArea(item)"
                >
                  {{ item.rName }}
                </dd>
              </dl>
              <dl style="border: none">
                <dt>其它条件：</dt>
                <dd class="other-dd">
                  <!-- <el-select
                    v-model="mState"
                    placeholder="媒体状态"
                    class="otherSelect"
                    :class="mState !== '' ? 'otherSelectActive' : ''"
                    size="small"
                    @change="mStateChange"
                  >
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="待安装" value="2"></el-option>
                  </el-select> -->
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
                    :placeholder="recType == '1' ? '楼盘类型' : '写字楼类型'"
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
                  <!-- <el-select
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
                  </el-select> -->
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
            <!--提示-->
            <div class="tip">
              <i class="el-icon-info"></i>
              <p>
                共 <span>{{ total ? total : 0 }}</span> 个资源，已选资源
                <span>{{ nowPointNum > 0 ? nowPointNum : 0 }}</span> 个
              </p>
            </div>
            <!--表格-->
            <div class="table_wrap adsTable">
              <div class="myCheckbox" v-if="isOccupied">
                <el-checkbox v-model="IsAll" @change="allCheckboxAds"
                  >全选本页</el-checkbox
                >
              </div>
              <el-table
                v-loading="loading"
                element-loading-text="玩命加载中.."
                element-loading-spinner="el-icon-loading"
                border
                :data="planList"
                :default-sort="{ prop: 'resID', order: 'descending' }"
                @cell-mouse-enter="mouseEnter"
                style="width: 100%"
                class="selectAdsTable"
                height="595"
              >
                <!-- @row-click="rowClick" -->
                <!-- <el-table-column
                  fixed
                  class-name="el-table-column-checkbox"
                  width="110px"
                  >
                  :render-header="customFieldColumn"
                  <template slot-scope="scope">
                    <div v-if="isOccupied">
                      <div class="adDoor" v-if="mediaType === '广告门'">
                        <el-popover
                          v-if="scope.row.box.A"
                          placement="top-start"
                          width="310"
                          trigger="hover"
                        >
                          <span v-if="scope.row.adlInfo === ''"
                            >暂无被禁用的信息</span
                          >
                          <ul v-else>
                            <li
                              v-for="(item, index) in scope.row.adlInfo"
                              :key="index"
                            >
                              <div v-if="item.asState">
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333"
                                    >该点位：{{ item.asState }}中</span
                                  >
                                </p>
                              </div>
                              <div v-else>
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333">占点方案：</span>
                                  <span>
                                    <span style="font-weight: bold">{{
                                      sessionData.uType === "MD"
                                        ? item.beOccupieApName
                                        : "******"
                                    }}</span>
                                    方案（{{
                                      item.lState == 0
                                        ? "预锁"
                                        : item.lState == 1
                                        ? "被占"
                                        : "强制停止"
                                    }}）
                                  </span>
                                </p>
                                <p>
                                  <span style="color: #333">占点排期：</span
                                  >{{ item.schedule }}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <el-checkbox
                            slot="reference"
                            v-model="scope.row.checkBox.A"
                            label="A面"
                            @change="changeA(scope.row)"
                            :disabled="scope.row.box.A"
                          >
                          </el-checkbox>
                        </el-popover>
                        <el-checkbox
                          v-else
                          v-model="scope.row.checkBox.A"
                          label="A面"
                          @change="changeA(scope.row)"
                          :disabled="scope.row.box.A"
                        >
                        </el-checkbox>
                        <el-popover
                          v-if="scope.row.box.B"
                          placement="top-start"
                          width="310"
                          trigger="hover"
                        >
                          <span v-if="scope.row.adlInfo === ''"
                            >暂无被禁用的信息</span
                          >
                          <ul v-else>
                            <li
                              v-for="(item, index) in scope.row.adlInfo"
                              :key="index"
                            >
                              <div v-if="item.asState">
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333"
                                    >该点位：{{ item.asState }}中</span
                                  >
                                </p>
                              </div>
                              <div v-else>
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333">占点方案：</span>
                                  <span>
                                    <span style="font-weight: bold">{{
                                      sessionData.uType === "MD"
                                        ? item.beOccupieApName
                                        : "******"
                                    }}</span>
                                    方案（{{
                                      item.lState == 0
                                        ? "预锁"
                                        : item.lState == 1
                                        ? "被占"
                                        : "强制停止"
                                    }}）
                                  </span>
                                </p>
                                <p>
                                  <span style="color: #333">占点排期：</span
                                  >{{ item.schedule }}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <el-checkbox
                            slot="reference"
                            v-model="scope.row.checkBox.B"
                            label="B面"
                            @change="changeB(scope.row)"
                            :disabled="scope.row.box.B"
                          >
                          </el-checkbox>
                        </el-popover>
                        <el-checkbox
                          v-else
                          v-model="scope.row.checkBox.B"
                          label="B面"
                          @change="changeB(scope.row)"
                          :disabled="scope.row.box.B"
                        >
                        </el-checkbox>
                      </div>
                      <div class="roadGate" v-else>
                        <el-checkbox
                          v-model="scope.row.checkBox.ABC"
                          label="ABC面"
                          @change="changeABC(scope.row)"
                        >
                        </el-checkbox>
                      </div>
                    </div>
                    <div v-else>{{ scope.row.asLabs }}面</div>
                  </template>
                </el-table-column> -->

                <!-- <el-table-column
                  fixed
                  class-name="el-table-column-checkbox"
                  width="110px"
                  >
                  :render-header="customFieldColumn"
                  <template slot-scope="scope">
                    <div v-if="isOccupied">
                      <div class="adDoor" v-if="mediaType === '广告门'">
                        <el-popover
                          v-if="scope.row.box.A"
                          placement="top-start"
                          width="310"
                          trigger="hover"
                        >
                          <span v-if="scope.row.adlInfo === ''"
                            >暂无被禁用的信息</span
                          >
                          <ul v-else>
                            <li
                              v-for="(item, index) in scope.row.adlInfo"
                              :key="index"
                            >
                              <div v-if="item.asState">
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333"
                                    >该点位：{{ item.asState }}中</span
                                  >
                                </p>
                              </div>
                              <div v-else>
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333">占点方案：</span>
                                  <span>
                                    <span style="font-weight: bold">{{
                                      sessionData.uType === "MD"
                                        ? item.beOccupieApName
                                        : "******"
                                    }}</span>
                                    方案（{{
                                      item.lState == 0
                                        ? "预锁"
                                        : item.lState == 1
                                        ? "被占"
                                        : "强制停止"
                                    }}）
                                  </span>
                                </p>
                                <p>
                                  <span style="color: #333">占点排期：</span
                                  >{{ item.schedule }}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <el-checkbox
                            slot="reference"
                            v-model="scope.row.checkBox.A"
                            label="A面"
                            @change="changeA(scope.row)"
                            :disabled="scope.row.box.A"
                          >
                          </el-checkbox>
                        </el-popover>
                        <el-checkbox
                          v-else
                          v-model="scope.row.checkBox.A"
                          label="A面"
                          @change="changeA(scope.row)"
                          :disabled="scope.row.box.A"
                        >
                        </el-checkbox>
                        <el-popover
                          v-if="scope.row.box.B"
                          placement="top-start"
                          width="310"
                          trigger="hover"
                        >
                          <span v-if="scope.row.adlInfo === ''"
                            >暂无被禁用的信息</span
                          >
                          <ul v-else>
                            <li
                              v-for="(item, index) in scope.row.adlInfo"
                              :key="index"
                            >
                              <div v-if="item.asState">
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333"
                                    >该点位：{{ item.asState }}中</span
                                  >
                                </p>
                              </div>
                              <div v-else>
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333">占点方案：</span>
                                  <span>
                                    <span style="font-weight: bold">{{
                                      sessionData.uType === "MD"
                                        ? item.beOccupieApName
                                        : "******"
                                    }}</span>
                                    方案（{{
                                      item.lState == 0
                                        ? "预锁"
                                        : item.lState == 1
                                        ? "被占"
                                        : "强制停止"
                                    }}）
                                  </span>
                                </p>
                                <p>
                                  <span style="color: #333">占点排期：</span
                                  >{{ item.schedule }}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <el-checkbox
                            slot="reference"
                            v-model="scope.row.checkBox.B"
                            label="B面"
                            @change="changeB(scope.row)"
                            :disabled="scope.row.box.B"
                          >
                          </el-checkbox>
                        </el-popover>
                        <el-checkbox
                          v-else
                          v-model="scope.row.checkBox.B"
                          label="B面"
                          @change="changeB(scope.row)"
                          :disabled="scope.row.box.B"
                        >
                        </el-checkbox>
                      </div>
                      <div class="roadGate" v-else>
                        <el-checkbox
                          v-model="scope.row.checkBox.ABC"
                          label="ABC面"
                          @change="changeABC(scope.row)"
                        >
                        </el-checkbox>
                      </div>
                    </div>
                    <div v-else>{{ scope.row.asLabs }}面</div>
                  </template>
                </el-table-column> -->

                <!-- <el-table-column
                  fixed
                  class-name="el-table-column-checkbox"
                  width="110px"
                  >
                  :render-header="customFieldColumn"
                  <template slot-scope="scope">
                    <div v-if="isOccupied">
                      <div class="adDoor" v-if="mediaType === '广告门'">
                        <el-popover
                          v-if="scope.row.box.A"
                          placement="top-start"
                          width="310"
                          trigger="hover"
                        >
                          <span v-if="scope.row.adlInfo === ''"
                            >暂无被禁用的信息</span
                          >
                          <ul v-else>
                            <li
                              v-for="(item, index) in scope.row.adlInfo"
                              :key="index"
                            >
                              <div v-if="item.asState">
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333"
                                    >该点位：{{ item.asState }}中</span
                                  >
                                </p>
                              </div>
                              <div v-else>
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333">占点方案：</span>
                                  <span>
                                    <span style="font-weight: bold">{{
                                      sessionData.uType === "MD"
                                        ? item.beOccupieApName
                                        : "******"
                                    }}</span>
                                    方案（{{
                                      item.lState == 0
                                        ? "预锁"
                                        : item.lState == 1
                                        ? "被占"
                                        : "强制停止"
                                    }}）
                                  </span>
                                </p>
                                <p>
                                  <span style="color: #333">占点排期：</span
                                  >{{ item.schedule }}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <el-checkbox
                            slot="reference"
                            v-model="scope.row.checkBox.A"
                            label="A面"
                            @change="changeA(scope.row)"
                            :disabled="scope.row.box.A"
                          >
                          </el-checkbox>
                        </el-popover>
                        <el-checkbox
                          v-else
                          v-model="scope.row.checkBox.A"
                          label="A面"
                          @change="changeA(scope.row)"
                          :disabled="scope.row.box.A"
                        >
                        </el-checkbox>
                        <el-popover
                          v-if="scope.row.box.B"
                          placement="top-start"
                          width="310"
                          trigger="hover"
                        >
                          <span v-if="scope.row.adlInfo === ''"
                            >暂无被禁用的信息</span
                          >
                          <ul v-else>
                            <li
                              v-for="(item, index) in scope.row.adlInfo"
                              :key="index"
                            >
                              <div v-if="item.asState">
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333"
                                    >该点位：{{ item.asState }}中</span
                                  >
                                </p>
                              </div>
                              <div v-else>
                                <p style="margin-bottom: 5px">
                                  <span style="color: #333">占点方案：</span>
                                  <span>
                                    <span style="font-weight: bold">{{
                                      sessionData.uType === "MD"
                                        ? item.beOccupieApName
                                        : "******"
                                    }}</span>
                                    方案（{{
                                      item.lState == 0
                                        ? "预锁"
                                        : item.lState == 1
                                        ? "被占"
                                        : "强制停止"
                                    }}）
                                  </span>
                                </p>
                                <p>
                                  <span style="color: #333">占点排期：</span
                                  >{{ item.schedule }}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <el-checkbox
                            slot="reference"
                            v-model="scope.row.checkBox.B"
                            label="B面"
                            @change="changeB(scope.row)"
                            :disabled="scope.row.box.B"
                          >
                          </el-checkbox>
                        </el-popover>
                        <el-checkbox
                          v-else
                          v-model="scope.row.checkBox.B"
                          label="B面"
                          @change="changeB(scope.row)"
                          :disabled="scope.row.box.B"
                        >
                        </el-checkbox>
                      </div>
                      <div class="roadGate" v-else>
                        <el-checkbox
                          v-model="scope.row.checkBox.ABC"
                          label="ABC面"
                          @change="changeABC(scope.row)"
                        >
                        </el-checkbox>
                      </div>
                    </div>
                    <div v-else>{{ scope.row.asLabs }}面</div>
                  </template>
                </el-table-column> -->
                <!-- //TODO:页面方案列表的改造 -->
                <el-table-column
                  fixed
                  class-name="el-table-column-checkbox"
                  width="110px"
                >
                  <template slot-scope="scope">
                    <div v-if="isOccupied">
                      <div class="adDoor" v-if="mediaType === '广告门'">
                        <el-checkbox
                          v-model="scope.row.checkBox"
                          @change="ChangeCommunity(scope.row)"
                          :disabled="scope.row.box"
                        >
                        </el-checkbox>
                      </div>
                      <div class="roadGate" v-else>
                        <el-checkbox
                          v-model="scope.row.checkBox"
                          @change="changeBarrierGate(scope.row)"
                        >
                        </el-checkbox>
                      </div>
                    </div>
                    <div v-else>{{ scope.row.asLabs }}面</div>
                  </template>
                </el-table-column>

                <el-table-column
                  fixed
                  class-name="el-table-column-resName"
                  label="资源名称"
                  width="200"
                  prop="resName"
                >
                </el-table-column>
                <el-table-column prop="cityName" label="城市" min-width="110">
                </el-table-column>
                <el-table-column
                  prop="districtName"
                  label="区域"
                  min-width="110"
                >
                </el-table-column>
                <el-table-column label="商圈" min-width="130">
                  <template slot-scope="scope">
                    {{ scope.row.tradingArea || "--" }}
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="customPermission.patrolPermission == 2"
                  label="通电情况"
                  align="right"
                  min-width="110"
                >
                  <template slot-scope="scope">
                    {{ scope.row.electrifyState || "--" }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="广告限制"
                  min-width="130"
                  prop="notPush"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.notPush || "--" }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="recType == '1' ? '楼盘类型' : '写字楼类型'"
                  min-width="100"
                  prop="cType"
                  :show-overflow-tooltip="true"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.cType || "--" }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="楼盘价格" align="right" min-width="110">
                  <template slot-scope="scope">
                    <span>&yen;{{ scope.row.hPrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fNum"
                  label="楼栋数量"
                  align="right"
                  min-width="100"
                >
                </el-table-column>
                <el-table-column
                  prop="chDay"
                  align="right"
                  :label="recType === 1 ? '入住年份' : '建成年份'"
                  min-width="90"
                >
                </el-table-column>
                <el-table-column
                  prop="hNum"
                  align="right"
                  :label="recType === 1 ? '小区户数' : '办公室数量'"
                  min-width="90"
                >
                </el-table-column>
                <el-table-column label="人流量" align="right" min-width="110">
                  <template slot-scope="scope">
                    {{ scope.row.peopleFlow }}
                  </template>
                </el-table-column>
                <el-table-column label="车位数" align="right" min-width="110">
                  <template slot-scope="scope">
                    {{ scope.row.parkSpaceNum }}
                  </template>
                </el-table-column>
                <el-table-column label="车流量" align="right" min-width="110">
                  <template slot-scope="scope">
                    {{ scope.row.carFlow }}
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  prop="schedule"
                  label="排期"
                  min-width="190"
                >
                </el-table-column>
              </el-table>
              <div class="ad_pagination" v-if="total">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  @current-change="changePage"
                  @size-change="sizeChange"
                  :page-sizes="[10, 20, 50, 100, 500]"
                  :current-page.sync="pageNum"
                  :page-size="pageSize"
                  :total="total"
                >
                </el-pagination>
              </div>
            </div>
            <!--购物车-->
            <!-- <el-dialog title="已选小区" :visible.sync="dialogTableVisible">
              <template>
                <div class="table_wrap car-list" style="margin-top: 60px">
                  <el-row style="margin-bottom: 10px">
                    <el-col :span="8">
                      <el-radio-group
                        v-model="activeName"
                        size="small"
                        @change="handleClick"
                      >
                        <el-radio-button
                          :label="item.type.toString()"
                          v-for="item of typeShopList"
                          :key="item.type"
                        >
                          {{ item.mVehicle }}
                        </el-radio-button>
                      </el-radio-group>
                    </el-col>

                    <el-col :span="16" style="text-align: left">
                      <span class="button_point">
                        <el-button
                          plain
                          @click="getMapADList"
                          size="small"
                          class="mapBtn"
                          :disabled="mapBtn"
                          v-qadn-mta-h5="{
                            id: 'a004_b008_c001_d001_bt061_ck05',
                          }"
                          >获取地图选点</el-button
                        >
                      </span>
                      <el-select
                        v-model="eventType"
                        placeholder="快捷配点"
                        filterable
                        @change="changeEvent"
                      >
                        <el-option
                          v-for="item of eventList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row class="car-title">
                    <el-col>
                      <img
                        src="../../assets/images/statistics.png"
                        alt=""
                        style="vertical-align: text-top"
                      />
                      社区:<span>{{ shopMedia_ADNum.resNum }}</span>
                      (选1面:<span>{{ shopMedia_ADNum.oneNum }}</span
                      >&nbsp;&nbsp; 选2面:<span>{{
                        shopMedia_ADNum.twoNum
                      }}</span
                      >&nbsp;&nbsp; 选3面:<span>{{
                        shopMedia_ADNum.threeNum
                      }}</span
                      >&nbsp;&nbsp; 选更多:<span>{{
                        shopMedia_ADNum.moreNum
                      }}</span
                      >)
                    </el-col>
                    <el-col :span="2">
                      媒体:<span>{{ shopMedia_ADNum.mediaNum }}</span>
                    </el-col>
                    <el-col :span="5">
                      点位:<span>{{ shopMedia_ADNum.ADNum }}</span>
                      <template v-if="activeName == '1'">
                        (A面:<span>{{ mediaLevelNum.ANum }}</span> B面:<span>{{
                          mediaLevelNum.BNum
                        }}</span
                        >)
                      </template>
                    </el-col>
                    <el-col :span="5">
                      A级:<span>{{ mediaLevelNum.ALevel }}</span> B级:<span>{{
                        mediaLevelNum.BLevel
                      }}</span>
                      C级:<span>{{ mediaLevelNum.CLevel }}</span>
                    </el-col>
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
                      prop="schedule"
                      label="排期"
                      min-width="185"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.schedule }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column min-width="65">
                      <template slot-scope="scope">
                        <span>{{ scope.row.A_B }}面</span>
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
                          v-qadn-mta-h5="{
                            id:
                              activeName == 1
                                ? 'a004_b008_c001_d001_bt058_ck04'
                                : 'a004_b008_c001_d002_bt073_ck04',
                          }"
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
                        style="background: rgba(255, 0, 0, 0.08)"
                        class="warningInfoColor"
                      ></span>
                      <span class="warningInfoName">被占点位</span>
                      <span
                        style="background: rgba(255, 199, 0, 0.1)"
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

                  <div style="text-align: center; margin-top: 10px">
                    <el-button
                      @click="next"
                      type="primary"
                      v-qadn-mta-h5="{ id: 'a004_b008_c001_d001_bt072_ck03' }"
                      >下一步
                    </el-button>
                  </div>
                </div>
              </template>
            </el-dialog> -->
            <!-- 修改逻辑后的购物车组件 -->
            <shopping-cart
              :dialogTableVisible.sync="dialogTableVisible"
              :mapBtn.sync="mapBtn"
              @next="next"
              :activeName="activeName"
              :shoppingCartList="shopingList"
              :customPermission="customPermission"
              @shoppingCartdeleteRow="changeCheck"
              @shoppongCartClearData="clearShop"
              :connectAdDialogVisible.sync="connectAdDialogVisible"
              @getMapADList="getMapADList"
              :shopMedia_ADNum="shopMedia_ADNum"
            ></shopping-cart>
            <!-- :beOccupiedAdsData.sync="beOccupiedAdsData" -->
            <!-- :ActiveConnectADList.sync="ActiveConnectADList" -->
          </div>
        </div>
        <!-- <div class="step3" v-if="active == 2">
          <div class="confirmBox">
            <div class="bill-title">
              <div class="bill-title-left">
                <h4>{{ planForm.planName }}</h4>
                <p>{{ cName }}</p>
                <p>{{ cBand }}</p>
              </div>
              <div class="bill-title-right">
                <ul>
                  <li>
                    <p>
                      <em>现金结算：</em><span>¥{{ priceFormat(cash) }}</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      <em>资源置换：</em><span>¥{{ priceFormat(zyzh) }}</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      <em>其他费用：</em><span>¥{{ priceFormat(other) }}</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      <em style="top: 5px">总计：</em
                      ><span class="totalPrice"
                        >¥{{ priceFormat(totalPrice) }}</span
                      >
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="panel">
              <ap-quotation
                :quotationData="quotationObj"
                :shopingList="shopingList"
                @APQuotationArr="APQuotationArr"
                :copydata="[]"
              ></ap-quotation>
            </div>
          </div>
        </div> -->
        <div class="step4" v-if="active == 2">
          <div class="createSuccess">
            <div class="successIcon">
              <img src="../../assets/images/createSuccess.png" alt="" />
              <!--<i class="fa fa-check-circle fa-4x" style="color:#67C23A;"></i>-->
              <h2>编辑成功</h2>
              <p>编辑时间：{{ dateTime }}</p>
            </div>
            <div class="planPanel noShareUl">
              <ul>
                <li><em>方案名称：</em>{{ FAInfo.apName }}</li>
                <li><em>所属客户：</em>{{ cName || "--" }}</li>
                <li><em>所属品牌：</em>{{ cBand || "--" }}</li>
                <!-- <li class="money">
                  <em>订单金额：</em>¥{{ priceFormat(totalPrice) }}
                </li> -->
                <!-- <li style="overflow: hidden; text-overflow: ellipsis">
                  <em>协同选点：</em><span id="shareUrl">{{ shareADUrl }}</span>
                  <el-button plain @click="copyUrl" class="urlBtn"
                    >复制</el-button
                  >
                  <el-button
                    @click="downLoadFanan()"
                    type="success"
                    class="urlBtn"
                    >导出方案</el-button
                  >
                </li> -->
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_bottom_btn">
      <!-- <el-button
        plain
        @click="prev"
        v-if="active == 1"
        type="default"
        v-qadn-mta-h5="{ id: 'a004_b009_c000_d000_bt088_ck03' }"
        >上一步
      </el-button> -->
      <!-- <el-button
        plain
        @click="clearData"
        v-if="active === 0"
        type="default"
        v-qadn-mta-h5="{ id: 'a004_b007_c000_d000_bt047_ck03' }"
        >取消
      </el-button> -->
      <!-- 空点导出 -->
      <!-- <el-button
        plain
        v-if="active === 0"
        type="default"
        @click="exportEmpty()"
        v-qadn-mta-h5="{ id: 'a004_b007_c000_d000_bt048_ck04' }"
        >导空点
      </el-button> -->

      <!-- <el-button
        @click="next"
        v-if="active == 0"
        type="primary"
        v-qadn-mta-h5="{
          id:
            active == 0
              ? 'a004_b007_c000_d000_bt046_ck03'
              : 'a004_b008_c000_d000_bt057_ck03',
        }"
      >
        下一步
      </el-button> -->
      <!-- <el-button
        @click="next"
        v-if="active == 2"
        type="primary"
        v-qadn-mta-h5="{ id: 'a004_b009_c000_d000_bt089_ck03' }"
        >创建方案
      </el-button> -->

      <!-- <p v-if="active === 0" style="color: #666;font-size: 14px;margin-top:10px;">备注：导空点功能目前导出的为最近一年的空点</p> -->

      <div class="finishBtn" v-if="active == 2">
        <el-button type="default" @click="continueCreate">继续创建</el-button>
        <el-button plain type="default" @click="ToDetail"> 查看方案 </el-button>
        <el-button @click="downLoadFanan()" type="primary" class="urlBtn"
          >导出方案</el-button
        >
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
    <!-- <el-dialog
      title="被占信息"
      :visible.sync="beOccupiedDialogVisible"
      :modal="false"
      top="30vh"
      width="30%"
    >
      <ul>
        <li v-for="item in beOccupiedAdsData">
          <p>
            <span style="color: #333">占点方案：</span>
            <span v-if="sessionData.uType === 'MD'"
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
          <p><span style="color: #333">占点排期：</span>{{ item.schedule }}</p>
        </li>
      </ul>
    </el-dialog> -->
    <!--连排门信息模态框-->
    <!-- <el-dialog
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
    </el-dialog> -->
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
    <!-- 导出空位时间弹出框 -->
    <el-dialog
      :visible.sync="showEmptyPoint"
      :modal="false"
      top="35vh"
      width="40%"
    >
      <p>
        <el-radio-group v-model="dateType">
          <el-radio label="1" v-if="isShowHalfYear">默认半年日期</el-radio>
          <el-radio label="2">自定义日期</el-radio>
        </el-radio-group>
      </p>
      <p v-if="dateType == '2'" style="margin-top: 10px">
        <el-date-picker
          v-model="emptyRange"
          type="daterange"
          size="mini"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy/MM/dd"
          format="yyyy/MM/dd"
          class="date-select input-with-select"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </p>
      <span slot="footer">
        <el-button size="small" type="primary" @click="downEmptyPoint()"
          >确认</el-button
        >
      </span>
    </el-dialog>
    <!-- 导出空位弹出框 -->
    <el-dialog
      title="链接地址："
      :visible.sync="showEmpty"
      :modal="false"
      top="35vh"
      width="40%"
    >
      <p id="shareDownUrl">{{ downUrl }}</p>
      <p style="text-align: center; margin-top: 25px">
        <el-button
          type="primary"
          @click="copyUrlDown()"
          size="small"
          style="width: 80px; height: 34px; outline: none; cursor: pointer"
          >复制链接
        </el-button>
      </p>
    </el-dialog>
    <!-- 导入方案弹出框 -->
    <!-- <el-dialog
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
                '/importTemplate/广州亲粤邻小区导入定制模板.xlsx'
              "
              download="小区导入模板.xlsx"
              @click="dowmLoadFun"
              class="el-icon-download aButton"
              >下载模板</a
            >
            <a
              v-else-if="importType == '1'"
              :href="this.apiVar.qadnUrl + '/importTemplate/resTemplate.xlsx'"
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
                '/importTemplate/广州亲粤邻点位导入定制模板.xlsx'
              "
              download="点位导入模板.xlsx"
              @click="dowmLoadFun"
              class="el-icon-download aButton"
              >下载模板</a
            >
            <a
              v-else-if="importType == '2'"
              :href="this.apiVar.qadnUrl + '/importTemplate/adsTemplate.xlsx'"
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
    </el-dialog> -->
    <!-- 导入excel点位部分失败弹框 -->
    <!-- <el-dialog
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
          @cancel="cancelImport"
          @confirmImport="confirmImport"
        ></import-result>
      </template>
      <template v-if="importType == '2'">
        <div class="car-title">
          <i class="el-icon-info" style="color: #1890ff"></i>
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
              <span>{{ scope.row.asLab }}面</span>
            </template>
          </el-table-column>
          <el-table-column prop="assetTag" label="资产编号" min-width="130">
          </el-table-column>
          <el-table-column prop="schedule" label="排期" min-width="160">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.schedule"
                placement="bottom"
              >
                <span>{{ scope.row.schedule }}</span>
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
    </el-dialog> -->
    <!-- 复制方案弹出框 -->
    <!-- <el-dialog :visible.sync="isCopy" title="复制方案" width="450px">
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
    </el-dialog> -->
    <!--地图选择（无忧地图、亲邻地图）-->
    <el-dialog :visible.sync="isMapKind" title="地图选择" width="450px">
      <p>
        <span class="p_span">地图类型：</span>
        <el-radio v-model="selectMapKind" :label="1">旧版地图</el-radio>
        <el-radio v-model="selectMapKind" :label="2">新版地图</el-radio>
      </p>
      <div slot="footer" class="dialog-footer">
        <el-button plain size="small" @click="isMapKind = false"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="selectMap"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 选择选点方式弹窗 -->
    <el-dialog
      :visible.sync="isSelectPoint"
      top="158px"
      width="248px"
      center
      :show-close="false"
      :lock-scroll="false"
    >
      <div style="text-align: center">
        <span
          style="
            font-size: 16px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.85);
            line-height: 22px;
          "
          >请选择选点方式</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button
            type="primary"
            @click="automaticSelectPoint"
            style="width: 200px; margin-bottom: 8px"
            >导入表格</el-button
          >
        </div>
        <div>
          <el-button
            type="primary"
            @click="manualSelectPoint"
            style="width: 200px"
            >手动选点</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!-- 导入表格组件 -->
    <import-village-by-excel
      ref="importexcel"
      :isDialogImport.sync="isDialogImport"
      @skipAndAddShopping="handleSkipAndAdd"
      @submitBtn="submitUpload"
      :importInfoData="importInfoData"
      :importAction="doUpload"
    ></import-village-by-excel>
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
import apQuotation from "./components/apQuotation";
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
//导入表格
import importVillageByExcel from "./components/importVillageByExcel";
//购物车页面
import shoppingCart from "./components/shoppingCart";

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
    importResult,
    importVillageByExcel,
    shoppingCart,
  },
  data() {
    //客户预算自定义校验
    let validateBudget = (rule, value, callback) => {
      if (value) {
        // 数字/货币金额 (只支持正数、不支持校验千分位分隔符)
        let reg = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/;
        if (!reg.test(value)) {
          callback(new Error("请输入正数"));
        } else {
          if (value > 9999999) {
            callback(new Error("预算不能大于9,999,999"));
          } else {
            callback();
          }
        }
      } else {
        callback();
        // this.$refs["customerBudgetRef"].clearValidate()
      }
    };
    //客户要求自定义校验
    // let validateRequst = (rule, value, callback) =>{
    //     if(!value){
    //         this.$refs["customerDemandRef"].clearValidate()
    //     }else{
    //         callback();
    //     }
    // }
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
      FAInfo: {},
      //导入草稿箱子的数据
      importDraftsList: [],
      importDraftsType: 1,
      importDraftsConfig: {},
      //搜索旁投放面数
      planAdsCnt: 1,
      isDialogImport: false,
      handleTime: "", //上传时间
      isSelectPoint: false, //是否展示点位选择弹窗
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now();
        },
      },
      // 导空点是否展示半年json下载(全国媒介或全国销售有权限下载)
      isShowHalfYear: false,
      // doUpload: 'https://beta.qinlinad.com/Advertisement/AnalysisExcelAdBaseInfo',
      // doUpload: "/advertisement/AnalysisExcelAdBaseInfo",

      // doUpload: "/advertisement/AdPlanResImport",
      doUpload: "/addsp/proposal/importResExcel",
      // 空位导出url
      downUrl: "",
      // 是否显示空位导出弹出框
      showEmpty: false,
      showEmptyPoint: false,
      dateType: "1",
      emptyRange: [],
      active: 1, // 当前步骤step
      mapADDialog: false,
      loading: true, //加载中
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      selectedOptions: [],
      cityOptions: [],
      cityOther: false, // 判断是否可选择全国城市
      isBD: true, // 判断登录用户是否为销售
      // username: '',               // 获取登录用户的userName
      recType: 1, // step2  1:社区 2:写字楼
      mediaType: "广告门", // 媒体类型 广告门、道闸
      shopXY: { x: "", y: "" }, // 动画起始坐标
      shoppingShow: false, //动画效果的显示隐藏
      selectAll: false, // 是否全选
      bodyWidth: 1920,
      city: [], // step2 城市
      area: [], // step2城市下属区域
      activeIndex: 0, //step2当前选中的城市下标
      activeRName: "", //step2当前选中的城市名称
      areaName: "全市", // step2当前选中的区域
      areaRid: "", // step2当前选中的区域rid
      quotation: [], // step3 报价单汇总
      quotationObj: {}, // 传递给报价单组件的数据，标示是否来自详情
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
      adcID: [], //step1联系人
      //step1投放城市
      throwCity: [],
      //购物车
      dialogTableVisible: false,
      //选中
      checkAB: true,
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
        // {
        //   value: "资产编号",
        //   label: "资产编号",
        // },
        // {
        //   value: "被占查询",
        //   label: "被占查询",
        // },
      ],
      //默认
      selectValue: "资源名称",
      //楼盘类型
      buildType: [
        { buildlabel: "高端住宅", buildValue: "高端住宅" },
        { buildlabel: "普通住宅", buildValue: "普通住宅" },
        { buildlabel: "单体楼", buildValue: "单体楼" },
        { buildlabel: "别墅", buildValue: "别墅" },
        { buildlabel: "洋房", buildValue: "洋房" },
        { buildlabel: "商住或商用", buildValue: "商住或商用" },
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
      mState: "", // 媒体状态
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
        adcID: "", // 所属联系人
        planRemark: "",
        pointOfAsrIDs: [], // 点位所属公司id组合，根据城市联动
        customerBudget: "",
        customerDemand: "",
      },
      pointOfAsrIDs: [],
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
        adcID: [{ required: true, message: "请选择联系人", trigger: "change" }],
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
        //客户预算
        customerBudget: [{ validator: validateBudget, trigger: "blur" }],
        //客户要求
        customerDemand: [
          // {validator: validateRequst, trigger: 'blur'},
          { max: 200, message: "字数不能超过200字", trigger: "blur" },
        ],
      },
      shopingList: [], // step2购物车列表
      // 购物车展示的数据
      typeShopList: [],
      activeName: 1,
      // 事件选择
      eventType: "",
      eventList: [],
      // 购物车表格数据
      shopShowList: [],
      planList: [], //step2可选点位列表
      IsAll: false, //当前是否为全选状态
      sessionData: "", // 登录用户的数据
      FAData: { apID: "" }, // 创建方后台返回的数据
      timeout: null,
      BDData: { uid: "0", realName: "", saleManageLevel: 0 },
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
        total: 0,
        oneNum: 0,
        twoNum: 0,
        threeNum: 0,
        moreNum: 0,
      },
      ADloading: "", // 创建方案、提交选点和报价单时的loading
      areaCity: [],
      activeCityData: {}, // 城市切换的数据，默认为this.city[0]
      loadScroll: true, // 搜索后不执行滚动加载
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
      // beOccupiedDialogVisible: false, // 被占模态框
      // beOccupiedNumber: 0, // 第一次搜索记录时提前保存 planList
      isOccupied: true, // 被占搜索时隐藏过滤条件
      // beOccupiedAdsData: [], // 当前点击行的被占信息{beOccupieApName:'',lState: '',schedule: ''}
      pageNum: 1, // 页码
      totalPage: 1, // 总页数
      pageSize: 20, //每页条数
      getAdsParamsData: {}, //　获取点位列表的参数data
      apMinTime: "", // 方案创建的开始时间
      ADLimitActiveName: "1",
      isShowAll: false, // 控制表头显示时的过渡效果
      searchBtnAbled: false, // 搜索按钮禁止
      isCityPrice: false, // 判断城市最大价格是否大于2000w
      connectAdDialogVisible: false, // 连排门模态框
      // ActiveConnectADList: {}, // 购物车 - 当前点击行的连排门信息
      mediaLevelNum: { ALevel: 0, BLevel: 0, CLevel: 0, ANum: 0, BNum: 0 },
      saleManageLevel: 0, // 销售权限 0地方销售 1全国销售
      asrIDList: [], // 已选点位里存在的公司及城市
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
      // 记录两个时间判断是窗口关闭还是刷新
      _beforeUnload_time: 0,
      _gap_time: 0,
      // 地图类型
      isMapKind: false,
      selectMapKind: 2,
      ActiveMapType: 2,
      // 亲邻地图
      mapAdsList: [],
      currPageAsLength: 0, //当前页面可选的点位总数
      currPageSelect: 0, //当前页面已选择的点位数
      total: 0, //总可选点位
      // 定制权限
      customPermission: {},
      // // 购物车分页时页面条目数量
      // cartPageSize: 10,
      // currentPage: 1,
      // totalNum: 0,
      mapLock:true
    };
  },
  mounted() {
    this.getsessionData(); // 获取session中的数据
    this.areaCity = areaArr.cityArea();
    this.getSetPoint(); //获取选点排期数据
    this.getADLimit(); // 获取广告限制列表
    // 设置购物车动画起点位置
    this.setShopAnimate();
    // 获取未完成的方案并填充
    this.routePath = this.$route.fullPath;
    // if (this.routePath.indexOf("unfinishedPlan") !== -1) {
    //   this.setPlanInfo();
    // }
    // this.manualSelectPoint();
    // console.log("this.cityOptions", this.cityOptions);
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
  //     }
  // },
  watch: {
    "planForm.throwCity": {
      handler: function () {
        this.planForm.pointOfAsrIDs = [];
        this.pointOfAsrIDs = [];
        if (this.planForm.throwCity.length == 0) return;
        this.getPointOfAsr();
      },
    },
  },
  computed: {
    nowPointNum() {
      // 当购物车点位数大于0时
      if (this.shopingList.length>=0 && this.FAInfo.apID && this.mapLock) {
        this.changeApInfo();
        // this.computeMedia_AD();
      }
      return this.shopingList.length;
    },
    // currentPagination() {
    //   this.totalNum = this.shopShowList.length;
    //   return this.shopShowList.slice(
    //     (this.currentPage - 1) * this.cartPageSize,
    //     this.currentPage * this.cartPageSize
    //   );
    // },
  },
  methods: {
    //投放面数限制
    planAdsCntChange(value) {
      let reg = /^\d{1,}$/;
      let boolean = reg.test(value);
      if (!boolean) {
        sessFun.messageFun("warning", "计划面数仅能输入正整数");
        this.planAdsCnt = 1;
      }
    },
    //获取新业务逻辑数据
    getPlanResList() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apID: this.FAInfo.apID,
      };
      // this.clearDrafts();
      api.getApi("/addsp/proposal/getAdBackUp", params).then((res) => {
        console.log("获取已选小区数据", res);
        //TODO:没有设置第0步的数据
        if (res.data.SysCode === 200200) {
          this.loading = false;
          if (res.data.data.resList.length) {
            // this.clearDrafts();
            res.data.data.resList.forEach((item) => {
              item.checkBox = false;
              item.city = item.cityName;
            });
            this.handleImportDrafts(1, res.data.data.resList);

            this.shopingList = res.data.data.resList;
          }
        } else {
          sessFun.messageFun("warning", "获取失败");
        }
      });
    },
    setAllCityAndArea(citys) {
      let cityArr = citys;
      // console.log('城市数组', cityArr)
      let cityList = [];
      for (let i = 0; i < cityArr.length; i++) {
        let CityRid = areaArr.TextToCode(cityArr[i]);
        let cityObj = { rName: cityArr[i], rid: CityRid };
        cityList.push(cityObj);
      }
      this.city = cityList;
      this.city.sort(this.compareFun);
      this.activeCityData = this.city[0];
      this.activeRName = this.activeCityData.rName;
      // console.log('构建城市', this.city)
      let areaList = [];
      for (let j = 0; j < cityList.length; j++) {
        let area_Arr = areaArr.findArea(cityList[j].rid);
        area_Arr.unshift({ rid: cityList[j].rid, rName: "全市" });
        areaList.push(area_Arr);
      }
      this.area = areaList;
      // console.log('构建城市区域', this.area)
      this.cityOptions = areaArr.province();
    },
    //城市去重
    delCommentCity(arr) {
      // 使用es6的set数据结构特性
      let new_arr = [...new Set(arr)];
      return new_arr;
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
    // 时间格式规范
    formatTime(val) {
      return timeFormat.toDate(val, "/");
    },
    //根据编辑方案的apid获取选点排期
    getSetPoint() {
      // 真实数据
      let planDetail = JSON.parse(sessionStorage.getItem("planDetail"));
      let uid = this.sessionData.uID;
      this.apid = planDetail.apID;
      console.log("this.apid: ", this.apid);
      //   this.apid = sessionStorage.getItem("plan_apid");
      let params = {
        uid: uid,
        token: this.sessionData.token,
        apid: this.apid,
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetADB", params)
        .then((res) => {
          console.log("选点排期数据", res.data);
          if (!res.data.SysCode) {
            let resultArr = res.data.adSpaceInfo;
            let shopList = [];
            if (resultArr.length !== 0) {
              let LockNum = 0;
              for (let data of resultArr) {
                let time =
                  this.formatTime(data.pbStar) +
                  "-" +
                  this.formatTime(data.pbEnd);
                this.$set(data, "schedules", time);
                let checkBox = { A: false, B: false, ABC: false };
                if (data.asLab === "A") {
                  checkBox.A = true;
                } else if (data.asLab === "B") {
                  checkBox.B = true;
                } else if (data.asLab === "ABC") {
                  checkBox.ABC = true;
                }
                if (data.IsLock.length > 0) {
                  LockNum += 1;
                }
                let selectInfo = {
                  // asID: '',
                  pbStar: data.pbStar,
                  pbEnd: data.pbEnd,
                  // rid: data.rID.toString().substring(0, 4) + '00', //
                  rid: data.cityId
                    ? data.cityId
                    : data.rID.toString().substring(0, 4) + "00",
                  resID: data.resID,
                  mID: data.mID,
                  asIDs: data.asID,
                  asID: data.asID,
                  asLabs: data.asLab,
                  lState: data.IsLock ? data.IsLock : "", // 是否被占
                  resName: data.resName,
                  city: data.city,
                  origin: data.rName,
                  buildType: data.cType || "--",
                  houseNum: data.hNum,
                  buildPrice: data.hPrice / 100,
                  mediaName: data.mTitle || "",
                  remark: data.remark || "",
                  trafficState: data.trafficState || "",
                  electrifyState: data.electrifyState || "",
                  mVehicle: data.mVehicle,
                  buildNum: data.fNum,
                  schedules: data.schedules,
                  tradingArea: data.tradingArea || "",
                  assetTag: data.assetTag || "",
                  liveYear: data.chDay,
                  adLimit: data.adLimit || "",
                  mapCenter: data.mapCenterName || "", // 地图中心点名称
                  reference: data.reference || "", // 地图中心点data
                  address: data.resAddress || "",
                  dNum: data.dNum || "", // 出入口数
                  A_B: data.asLab, //data.A_B,
                  checkBox: { A: checkBox.A, B: checkBox.B, ABC: checkBox.ABC },
                  connData: {
                    connectResName: "",
                    connectMedia: "",
                    commentWorkRes: "",
                    commentworkMedia: "",
                  },
                  connID: data.connID || "", // 连排门id
                  industryInfos: data.industryInfos || [],
                  mediaLevel: data.grade || "",
                  asName: data.asName || "", // 点位所属公司名称
                  asrID: data.asrID, // 所属公司id
                };
                if (data.mVehicle === "道闸") {
                  selectInfo.adPrice = data.asPrice / 100;
                } else {
                  if (data.asPrice) {
                    selectInfo.adPrice = data.asPrice / 700;
                  } else {
                    if (data.grade === "A") {
                      selectInfo.adPrice = 3080 / 7;
                    } else if (data.grade === "B") {
                      selectInfo.adPrice = 2380 / 7;
                    } else if (data.grade === "C") {
                      selectInfo.adPrice = 1800 / 7;
                    } else {
                      selectInfo.adPrice = 1900 / 7;
                    }
                  }
                }
                if (selectInfo.mediaName === "") {
                  console.log("+++++++++++", selectInfo.resName);
                }
                shopList.push(selectInfo);
              }
              console.log("shoplist---------", shopList);
              // this.ADLockNum = LockNum        // 被占点位的个数
              this.shopingList = shopList;
              // console.log('购物车列表数据', this.shopingList)
            } else {
              this.shopingList = [];
            }
            this.shopLoading = false;
            // this.computeMedia_AD()            // 统计购物车媒体数和面数
            this.FanganInfoByApid(planDetail); //获取方案详情
            this.dialogVisible();
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
    // 根据编辑方案的apid获取该方案的详情
    FanganInfoByApid(planDetail) {
      let uid = this.sessionData.uID;
      this.editApid = sessionStorage.getItem("plan_apid");
      let params = {
        uid: uid,
        token: this.sessionData.token,
        apid: this.editApid,
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetFanganInfo", params)
        .then((res) => {
          console.log("方案详情", res.data);
          if (res.data.SysCode == 200200) {
            this.FAInfo = res.data.data;
            this.getPlanResList();
            console.log("this.FAInfo: ", this.FAInfo);
            this.planName = this.FAInfo.apName;
            this.cName = this.FAInfo.cName;
            this.cBand = this.FAInfo.bTitle;
            this.industryID = this.FAInfo.piID;
            this.BDData.uid = this.FAInfo.suID || "";
            this.BDData.asrIDs = this.FAInfo.asrIDs || "";
            this.FAInfo.cityList = this.delCommentCity(
              this.FAInfo.rIDs.split(",")
            );
            console.log("this.sessionData: ", this.sessionData);
            if (
              (this.sessionData.uType === "BD" &&
                (this.sessionData.saleManageLevel == "1" ||
                  this.sessionData.saleManageLevel == "2")) ||
              (this.sessionData.uType === "MD" &&
                this.sessionData.mediaManageLevel == "1")
            ) {
              this.setAllCityAndArea(this.FAInfo.cityList);
            } else {
              // this.setCityAndArea(this.FAInfo.cityList)
              this.getCityList(planDetail);
            }
            // this.computeConnectAdData();
            this.getAdsParamsData = {
              prID: this.city[0].rid,
              rid: "440100",
              act: 1,
              dateTimeBegin: this.dateInput[0],
              dateTimeEnd: this.dateInput[1],
              resType: this.recType,
              mVehicle: this.mediaType,
              pageNo: this.pageNo,
              pageSize: this.pageSize,
            };
            this.getAdList(); // 获取选点列表
            // this.getRejectPlanList(); // 获取排斥方案列表
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    },
    //清空草稿箱缓存
    clearDrafts() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api.postApi(this.apiVar.CleanAdBackUp, params).then((res) => {
        console.log("清空草稿箱", res);
        if (res.data.SysCode === 200200) {
          console.log("清除草稿箱失败成功");
        } else {
          sessFun.messageFun("warning", "清除草稿箱失败");
        }
      });
    },

    //购物车清空购物车
    clearShop() {
      if (this.shopingList.length > 0) {
        this.$confirm("此操作将删除已选的所有数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            // let arr = [];
            // this.getResultData(arr);
            this.handleImportDrafts(0, this.shopingList);
            this.shopingList = []
            this.allCheckboxUpdata();
            // this.computeMedia_AD(); //
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
    //在购物车里删除行，改变总表前面的check
    //TODO:在购物车里删除行
    changeCheck(rows) {
      this.handleImportDrafts(0, [rows]);
      console.log("rows: ", rows);
      if (this.planList.length > 0 && rows.city === this.planList[0].city) {
        for (let i = 0; i < this.planList.length; i++) {
          if (rows.resID === this.planList[i].resID) {
            this.planList[i].checkBox = false;
          }
        }
      }
      for (let j = 0; j < this.shopingList.length; j++) {
        if (
          this.shopingList[j].resID === rows.resID &&
          this.shopingList[j].schedule === rows.schedule
        ) {
          this.shopingList.splice(j, 1);
          break;
        }
      }
      // this.typeShopList = this.getTypeList();
      // this.getShowList();
      // this.computeMedia_AD();
      this.allCheckboxUpdata();
    },

    //   changeCheck(rows) {
    //   if (this.planList.length > 0 && rows.city === this.planList[0].city) {
    //     for (let i = 0; i < this.planList.length; i++) {
    //       if (rows.mID === this.planList[i].mID) {
    //         if (rows.A_B === "A") {
    //           this.planList[i].checkBox.A = false;
    //         } else if (rows.A_B === "B") {
    //           this.planList[i].checkBox.B = false;
    //         } else if (rows.A_B === "ABC") {
    //           this.planList[i].checkBox.ABC = false;
    //         }
    //       }
    //     }
    //   }
    //   for (let j = 0; j < this.shopingList.length; ) {
    //     if (
    //       this.shopingList[j].mID === rows.mID &&
    //       this.shopingList[j].A_B == rows.A_B &&
    //       this.shopingList[j].schedule === rows.schedule
    //     ) {
    //       this.shopingList.splice(j, 1);
    //       break;
    //     } else {
    //       j++;
    //     }
    //   }
    //   // this.typeShopList = this.getTypeList();
    //   // this.getShowList();
    //   this.computeMedia_AD();
    //   this.allCheckboxUpdata();
    // },

    //导入表格，点击确定放入购物车后的处理函数
    handleSkipAndAdd(successList) {
      //先从新建方案页面转变成选点页面
      //   if (this.active == 0) {
      //     this.manualSelectPoint();
      //   }
      console.log("点击添加到购物车后页面变更");
      // //将导入表格组件中传递出来的成功数据放入购物车
      successList = this.setShopDataByImport(successList);
      this.handleImportDrafts(1, successList);
      this.shopingList.push(...successList);
      this.computeMedia_AD(); //统计购物车里选择小区的面数个数
      this.judgeByselect(); //导入购物车中的数据与已有列表是否重复

      // this.AddShopingInfo(row, "A"); // 添加到购物车
    },
    //手动选点
    manualSelectPoint() {
      this.isSelectPoint = false;
      //   let planDetail = JSON.parse(sessionStorage.getItem("planDetail")) ;
      //   console.log('planDetail: ', planDetail);
      //   //   this.planForm.customerBudget = planDetail
      //   this.planForm.companyBrand = planDetail.cName;
      //   this.planForm.adcID = planDetail.adcID;
      //   this.planForm.planName = planDetail.apName;
      //   this.handleInputConfirm()
      //    this.planForm.throwCity =
      // 初始化
      // TODO初始化
      this.initStep2Data();
      //   this.active++;
      // 设置城市及对应的区域
      this.getAreaFun();
      //设置存入草稿箱参数
      this.importDraftsConfig.customerBudget = +this.planForm.customerBudget; //客户预算
      this.importDraftsConfig.customerDemand = this.planForm.customerDemand; //客户要求
      this.importDraftsConfig.bID = this.planForm.companyBrand; // 公司品牌
      this.importDraftsConfig.adcID = this.planForm.adcID; // 客户联系人
      this.importDraftsConfig.apName = this.planForm.planName; // 意向方案名称
      this.getAdsParamsData = {
        // prID: 110100,
        // rID: planDetail.rID,
        prID: this.city[0].rid,
        rID: this.city[0].rid,
        resType: this.recType,
        mVehicle: this.mediaType,
        pageNum: this.pageNum,
        pageSize: this.pageSize, //
      };
      this.getAdList(); // 获取选点列表
      //   this.getRejectPlanList(); // 获取排斥方案列表
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
        // this.getMapADList()
      }
    },
    //导入表格选点
    automaticSelectPoint() {
      this.isSelectPoint = false;
      this.isDialogImport = true;
    },
    // handleSizeChange(val) {
    //   this.cartPageSize = val;
    // },
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    // },
    // 分页
    changePage(val) {
      // console.log('当前页',val)
      this.currPageSelect = 0;
      this.IsAll = false;
      this.pageNum = val;
      this.getAdsParamsData.pageNum = this.pageNum;
      this.getAdList();
    },
    // 每页条数切换
    sizeChange(val) {
      this.IsAll = false;
      this.pageSize = val;
      this.pageNum = 1;
      this.getAdsParamsData.pageNum = this.pageNum;
      this.getAdsParamsData.pageSize = this.pageSize;
      this.getAdList();
    },
    //监听table滚动
    // loadMore() {
    //     if (this.loadScroll) {
    //         this.loadScroll = false
    //         if(this.pageNum <= this.total){
    //             this.getAdsParamsData.pageNum = this.pageNum
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
      if (this.sessionData.uType === "BD") {
        this.BDData.realName = this.sessionData.username; //sessionStorage.getItem('username')
        this.planForm.ownerSales = this.BDData.realName;
        this.BDData.uid = this.sessionData.uID;
        this.saleManageLevel = this.sessionData.saleManageLevel;
        this.isBD = true;
      } else {
        this.isBD = false;
      }
      let starTime, endTime;
      this.dateTime = timeFormat.returnDayCount(0, "/");
      starTime = timeFormat.returnDayCount(1, "/");
      endTime = timeFormat.returnDayCount(14, "/");
      this.dateInput = [starTime, endTime]; // 设置默认时间
      this.beforeDate = [starTime, endTime];
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
    // TODO跳转来源于首页地图选点-设置部分默认数据
    setDataByIndex() {
      this.indexData = JSON.parse(sessionStorage.getItem("indexData"));
      this.ActiveMapType = this.indexData.activeMapType;
      // this.mapADList = this.indexData.mapADList
      this.dialogTableVisible = true;
      if (this.saleManageLevel == 1) {
        this.selectedOptions = [
          this.indexData.rid.toString().substring(0, 4) + "00",
          this.indexData.rid,
        ];
        this.throwCity.push({
          value: this.indexData.rid,
          label: this.indexData.city,
        });
        this.dynamicTags.push(this.indexData.city);
      } else {
      }
      this.planForm.throwCity.push(this.indexData.rid);
    },
    // 根据方案详情的rIDs，例如: "广州市,深圳市",构建城市区域
    setCityAndArea(cityData) {
      let cityArr = cityData;
      // console.log('cityArr',cityArr)
      let cityList = [];
      for (let j = 0; j < cityArr.length; j++) {
        console.log("用户cityArr", cityArr[j]);
        cityList.push({
          rName: cityArr[j].label,
          rid: cityArr[j].value,
        });
      }
      cityList = this.filterCity(cityList);
      console.log("cityList", cityList);
      this.city = cityList;
      this.city.sort(this.compareFun); // 排序
      this.activeCityData = this.city[0]; // 设置默认显示可选点城市的信息
      this.activeRName = this.activeCityData.rName;
      // console.log('构建城市', this.city)
      let areaList = [];
      for (let j = 0; j < cityList.length; j++) {
        let area_Arr = areaArr.findArea(cityList[j].rid);
        area_Arr.unshift({ rid: cityList[j].rid, rName: "全市" });
        areaList.push(area_Arr);
      }
      this.area = areaList;
      // console.log('构建城市区域', this.area)
      this.cityOptions = areaArr.province();
    },
    //获取 城市列表
    getCityList(planDetail) {
      let cityList = [];
      for (let cKey of planDetail.cityList) {
        cityList.push({
          label: cKey.rName,
          value: cKey.rID,
        });
      }
      this.setCityAndArea(cityList);
    },
    // 获取权限下的城市列表
    // getCityList() {
    //   let cityArea = JSON.parse(sessionStorage.getItem("cityArea"));
    //   console.log("获取权限下的城市列表cityArea", cityArea);
    //   let cityList = [];
    //   for (let cKey of cityArea) {
    //     if (cKey.asrID == this.sessionData.asrID) {
    //       cityList.push({
    //         label: cKey.city,
    //         value: cKey.rid,
    //       });
    //     }
    //   }
    //   this.setCityAndArea(cityList);
    // },
    // 根据用户权限与投放城市的交集，显示城市
    filterCity(cityData) {
      let FA_rIDs_arr = this.FAInfo.cityList;
      let uRID = cityData;
      let cityArr = [];
      for (let i = 0; i < uRID.length; i++) {
        for (let j = 0; j < FA_rIDs_arr.length; j++) {
          if (uRID[i].rName == FA_rIDs_arr[j]) {
            cityArr.push(uRID[i]);
          }
        }
      }
      return cityArr;
    },
    // getCityList() {
    //   this.cityOther = false;
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //   };
    //   if (!this.isBD) {
    //     params.suID = this.BDData.uid;
    //   }
    //   api
    //     .getApi(this.apiVar.Advertisement + "/GetFanganCity", params)
    //     .then((res) => {
    //       if (
    //         res.data.SysCode === 100200 ||
    //         res.data.MSG === "该用户暂未分配公司！"
    //       ) {
    //         sessFun.messageFun("warning", res.data.MSG);
    //       } else {
    //         if (res.data !== "" && res.data !== null) {
    //           let resData = res.data;
    //           let cityList = [];
    //           for (let j = 0; j < resData.length; j++) {
    //             let cityObj = {
    //               label: resData[j].rName,
    //               value: resData[j].rID.toString(),
    //             };
    //             cityList.push(cityObj);
    //           }
    //           this.throwCity = cityList;
    //           console.log("cityList", cityList);
    //           this.cityOptions = areaArr.province();
    //         } else {
    //           sessFun.messageFun("warning", "城市数据获取异常");
    //         }
    //       }
    //     });
    // },
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
    // 下一步
    // TODO:下一步创建方案
    next() {
      if (this.active === 0) {
        console.log("planForm--", this.planForm);
        // console.log('this.dynamicTags--', this.dynamicTags)
        this.submitForm("planForm");
      } else if (this.active === 1) {
        // // 防多次点击创建
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
            this.getBand(); // 获取公司品牌
            this.creatAdPlan(); // 创建方案
            clearTimeout(timer);
          }, 500);
        }
      }
      if (this.active > 2) {
        this.active = 1;
      }
    },
    // next() {
    //   if (this.active === 0) {
    //     console.log("planForm--", this.planForm);
    //     // console.log('this.dynamicTags--', this.dynamicTags)
    //     this.submitForm("planForm");
    //   } else if (this.active === 1) {
    //     if (this.shopingList.length !== 0) {
    //       this.active++;
    //       this.getAsNameByShopingList(); // 统计购物车中存在了几个公司及城市
    //       this.creatTab(); // 报价单tab
    //       this.getBand(); // 获取公司品牌
    //     } else {
    //       sessFun.messageFun("warning", "请选择点位");
    //     }
    //   } else if (this.active === 2) {
    //     this.isCityPrice = false;
    //     this.vaildCityQuotation();
    //     // // 防多次点击创建
    //     if (!this.creating) {
    //       this.creating = true;
    //       let timer = setTimeout(() => {
    //         this.creating = false;
    //         if (!this.isCityPrice) {
    //           this.ADloading = this.$loading({
    //             lock: true,
    //             text: "加急创建中...",
    //             spinner: "el-icon-loading",
    //             background: "rgba(0, 0, 0, 0.7)",
    //           });
    //           this.creatAdPlan(); // 创建方案 当前价格大于系统支持的最大价格
    //         } else {
    //           sessFun.messageFun(
    //             "warning",
    //             "单城市总价格大于系统支持的最大价格（2000万）"
    //           );
    //         }
    //         clearTimeout(timer);
    //       }, 500);
    //     }
    //   }
    //   if (this.active > 3) {
    //     this.active = 0;
    //   }
    // },
    // 上一步
    prev() {
      if (this.active < 1) {
        this.active = 1;
      } else {
        this.active--;
      }
    },
    // 第一步的取消按钮
    clearData() {
      this.$router.push("./planList");
    },
    // 确认导出空位
    downEmptyPoint() {
      if (this.dateType == "1") {
        this.exportExcelData();
      } else {
        if (this.emptyRange.length) {
          this.dateRangeEmpty();
        } else {
          sessFun.messageFun("warning", "请先选择日期");
        }
      }
    },
    // 导出时间段的空位
    dateRangeEmpty() {
      let loadingPoint = this.$loading({
        lock: true,
        text: "玩命加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let rid = this.planForm.throwCity.join(",");
      console.log(this.emptyRange, rid);
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        rIDs: rid,
        startTime: this.emptyRange[0],
        endTime: this.emptyRange[1],
        asrIDs: this.planForm.pointOfAsrIDs.join(","),
      };
      api
        .postApi(this.apiVar.Advertisement + "/ExportSpareRes", info)
        .then((res) => {
          // console.log(res.data);
          if (!res.data.SysCode) {
            if (res.data.length) {
              let returnobj = this.formatData(res.data);
              let head = [
                "省份",
                "城市",
                "区域",
                "资源名称",
                "商圈",
                "地址",
                "媒介载体",
                "楼栋数量",
                "住户数量",
                "楼盘价格",
                "楼盘类型",
                "入住时间",
                "车流量",
                "车位数",
                "人流量",
                "广告限制",
                "点位备注",
                "媒体数量(面)",
              ];
              let customPermission = JSON.parse(
                sessionStorage.getItem("session_data")
              ).customPermission;
              if (
                (this.sessionData.uType == "MD" &&
                  this.sessionData.mediaManageLevel == 1) ||
                (this.sessionData.uType == "BD" &&
                  this.sessionData.saleManageLevel == 2)
              ) {
                head.push("归属公司");
              }
              /* if(customPermission && customPermission.patrolPermission) {
                                head.push('巡点问题', '通行情况');
                            } */
              switch (customPermission.patrolPermission) {
                case 1:
                  head.push("巡点问题", "通行情况");
                  break;
                case 2:
                  head.push("巡点问题", "通行情况", "通电情况");
                  break;
              }
              let allHead = head.concat([info.startTime + "-" + info.endTime]);
              let filename =
                returnobj.city.join("-") +
                "-" +
                info.startTime +
                "~" +
                info.endTime +
                "空位表";
              sheetExcel.toDownload(allHead, returnobj.arr, filename);
            } else {
              sessFun.messageFun("warning", "此城市没有点位");
            }
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          loadingPoint.close();
        })
        .catch((err) => {
          console.log(err);
          loadingPoint.close();
        });
    },
    // 导出空点格式化数据
    formatData(arr) {
      let returnObj = {
        city: [],
        arr: "",
      };
      let result = [];
      for (let data of arr) {
        let resObj = {
          sheetName: this.getCityName(data.rID),
          showList: [],
        };
        returnObj.city.push(resObj.sheetName);
        let dataArr = data.adDoor.concat(data.barrier);
        for (let item of dataArr) {
          let obj = {
            province: item.prName || "--",
            city: item.crName || "--",
            rName: item.rName || "--",
            resName: item.resName || "--",
            tradingArea: item.tradingArea || "--",
            resAddress: item.resAddress || "--",
            mVehicle: item.mVehicle,
            fNum: item.fNum || "--",
            hNum: item.hNum || "--",
            hPrice: item.hPrice / 100,
            cType: item.cType || "--",
            chDay: item.chDay || "--",
            carFlow: item.carFlow || "--",
            parkSpaceNum: item.parkSpaceNum || "--",
            peopleFlow: item.peopleFlow || "--",
            notPush: item.allNotPush || "--",
            remark: item.allremark || "--",
            adsNum: item.adsNum || 0,
          };
          let customPermission = JSON.parse(
            sessionStorage.getItem("session_data")
          ).customPermission;
          if (
            (this.sessionData.uType == "MD" &&
              this.sessionData.mediaManageLevel == 1) ||
            (this.sessionData.uType == "BD" &&
              this.sessionData.saleManageLevel == 2)
          ) {
            obj.asNames = item.asNames;
          }
          // 巡点定制
          if (customPermission) {
            switch (customPermission.patrolPermission) {
              case 1:
                obj.allRemark = item.allRemark;
                obj.allTrafficState = item.allTrafficState;
                break;
              case 2:
                obj.allRemark = item.allRemark;
                obj.allTrafficState = item.allTrafficState;
                obj.allElectrifyState = item.allElectrifyState;
                break;
            }
          }
          obj[this.emptyRange[0] + "-" + this.emptyRange[1]] =
            item.DateInfo.adsNum || 0;
          resObj.showList.push(obj);
        }
        result.push(resObj);
      }
      returnObj.arr = result;
      return returnObj;
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
    // 导出空位表
    exportEmpty() {
      if (this.planForm.throwCity.length) {
        this.showEmptyPoint = true;
      } else {
        sessFun.messageFun("warning", "请先选择投放城市");
      }
    },
    // 导出空点导出次数接口
    postDownLoadNum(type) {
      let data = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        type,
      };
      api
        .postApi(this.apiVar.Advertisement + "/AddExportLog", data)
        .then((res) => {
          console.log(res);
        });
    },
    /*step1*/
    // 导出数据
    exportExcelData: function () {
      this.postDownLoadNum(0);
      // this.planForm.throwCity = [110100, 440100];
      if (this.planForm.throwCity.length) {
        let loadingPoint = this.$loading({
          lock: true,
          text: "玩命加载中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        let dateArr = [];
        let self = this;
        let request_times = self.planForm.throwCity.length; //计算分几次请求
        let funcs = []; //Promise.all要用到的参数, 存放每次请求的Promise对象

        for (let i = 0; i < request_times; i++) {
          // 循环请求次数，构造请求的Promise对象并插入funcs数组
          let func = new Promise((resolve, reject) => {
            //定义Promise并处理请求逻辑
            let data = [];
            api
              .getApi(
                // this.apiVar.jsonLink + self.planForm.throwCity[i] + '.json'
                this.apiVar.Advertisement + "/ExportHalfYearSpaceRes",
                {
                  cityIds: self.planForm.throwCity[i],
                  asrIDs: this.planForm.pointOfAsrIDs.join(","),
                }
              )
              .then(function (response) {
                if (response.data.SysCode == 200200) {
                  let dataArr = response.data.data[0];
                  data.push(dataArr);
                  resolve(data);
                } else {
                  resolve("");
                }
              })
              .catch(function (error) {
                resolve("");
              });
          });
          funcs.push(func);
        }

        Promise.all(funcs).then((values) => {
          //使用Promise.all调用funcs里面的函数，并合并数据，最后给js-xlsx生成Excel
          let resultValus = [];
          for (let val of values) {
            if (val) {
              resultValus.push(val);
            }
          }
          if (resultValus.length) {
            let returnobj = self.hasPointData(resultValus);
            console.log("returnobj----", returnobj);
            let date = returnobj.date;
            let head = [
              "省份",
              "城市",
              "区域",
              "资源名称",
              "商圈",
              "地址",
              "媒介载体",
              "楼栋数量",
              "住户数量",
              "楼盘价格",
              "楼盘类型",
              "入住时间",
              "广告限制",
              "点位备注",
              "媒体数量(面)",
            ];
            let customPermission = JSON.parse(
              sessionStorage.getItem("session_data")
            ).customPermission;
            if (
              (this.sessionData.uType == "MD" &&
                this.sessionData.mediaManageLevel == 1) ||
              (this.sessionData.uType == "BD" &&
                this.sessionData.saleManageLevel == 2)
            ) {
              head.push("归属公司");
            }
            /* if(customPermission && customPermission.patrolPermission) {
                                head.push('巡点问题', '通行情况');
                            } */
            switch (customPermission.patrolPermission) {
              case 1:
                head.push("巡点问题", "通行情况");
                break;
              case 2:
                head.push("巡点问题", "通行情况", "通电情况");
                break;
            }
            let allHead = head.concat(date);
            let filename =
              returnobj.filename +
              "-" +
              date[0].substring(0, 10) +
              "~" +
              date[date.length - 1].substring(11) +
              "空位表";
            sheetExcel.toDownload(allHead, returnobj.arr, filename);
          } else {
            sessFun.messageFun("warning", "此城市没有点位");
          }
          loadingPoint.close();
        });
      } else {
        sessFun.messageFun("warning", "请先选择投放城市");
      }
    },
    // 处理数据
    hasPointData(arr) {
      let returnObj = {
        arr: "",
        date: "",
        filename: "",
      };
      let result = [];
      let allDateArr = [];
      let filenameArr = [];
      for (let data of arr) {
        if (data.length === 0 || data[0].length === 0) {
          continue;
        }
        let resObj = {
          sheetName: data[0][0].crName,
          showList: [],
        };
        filenameArr.push(resObj.sheetName);
        for (let k = 0, kLen = data.length; k < kLen; k++) {
          for (let item of data[k]) {
            let dateArr = [];
            let dataStr = [];
            let obj = {
              province: item.prName,
              city: item.crName,
              rName: item.rName,
              resName: item.resName,
              tradingArea: item.tradingArea,
              resAddress: item.resAddress,
              mVehicle: item.mVehicle,
              fNum: item.fNum,
              hNum: item.hNum,
              hPrice: item.hPrice / 100,
              cType: item.cType,
              chDay: item.chDay,
              notPush: item.allNotPush || "",
              remark: item.allremark || "",
              adsNum: item.adsNum,
            };
            if (
              (this.sessionData.uType == "MD" &&
                this.sessionData.mediaManageLevel == 1) ||
              (this.sessionData.uType == "BD" &&
                this.sessionData.saleManageLevel == 2)
            ) {
              obj.asNames = item.asNames;
            }
            let customPermission = JSON.parse(
              sessionStorage.getItem("session_data")
            ).customPermission;
            if (customPermission) {
              switch (customPermission.patrolPermission) {
                case 1:
                  obj.allRemark = item.allRemark;
                  obj.allTrafficState = item.allTrafficState;
                  break;
                case 2:
                  obj.allRemark = item.allRemark;
                  obj.allTrafficState = item.allTrafficState;
                  obj.allElectrifyState = item.allElectrifyState;
                  break;
              }
            }
            let showData = item.DateInfo.sort(this.sortDate);
            for (let date of showData) {
              dateArr.push(
                timeFormat.toDate(date.starDate, "/") +
                  "-" +
                  timeFormat.toDate(date.endDate, "/")
              );
              dataStr.push(date.adsNum);
            }
            let dateObj = this.concatObj(dateArr, dataStr);
            let resultObj = Object.assign(obj, dateObj);
            resObj.showList.push(obj);
            if (k >= kLen - 1) {
              allDateArr = dateArr;
            }
          }
        }
        result.push(resObj);
      }
      returnObj = {
        arr: result,
        date: allDateArr,
        filename: filenameArr.join("-"),
      };
      return returnObj;
    },
    // 键转换为值
    concatObj(dateArr, dataStr) {
      let obj = {};
      for (let dateI = 0, dateLen = dateArr.length; dateI < dateLen; dateI++) {
        obj[dateArr[dateI]] = dataStr[dateI];
      }
      return obj;
    },
    // 时间比较
    sortDate(a, b) {
      let aDate = timeFormat.toDate(a.starDate, "");
      let bDate = timeFormat.toDate(b.starDate, "");
      return aDate - bDate;
    },
    // 导入方案弹出框
    importFanan(type) {
      if (type == "res") {
        this.importType = "1";
        this.doUpload = "/addsp/proposal/importResExcel";
      }
      //   this.isImport = true;
      this.isDialogImport = true;
      this.fileData = [];
      this.importInfoData = {};
    },
    // 自定义上传
    uploadFile(params) {
      this.fileData = [];
      console.log(params);
      let fileObj = params.file;
      this.fileData.push(fileObj);
    },
    // 文件删除
    fileRemove(file, fileList) {
      console.log(file, fileList);
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
    // // 确认上传
    // submitUpload() {
    //   if (this.fileData.length) {
    //     let rids = this.planForm.throwCity.join(",");
    //     let sess = this.sessionData;
    //     let info = `?uid=${sess.uID}&token=${sess.token}&suId=${
    //       this.BDData.uid
    //     }&rids=${rids}&excludedApId=${
    //       this.activeAdPlan ? this.activeAdPlan : ""
    //     }&asrIDs=${this.planForm.pointOfAsrIDs.join(",")}`;
    //     let formData = new FormData();
    //     formData.append("file", this.fileData[0]);
    //     if (this.importType == "2") {
    //       this.adsImport(formData, info);
    //     } else {
    //       this.resImport(formData, info);
    //     }
    //   } else {
    //     sessFun.messageFun("warning", "请先上传文件");
    //   }
    // },
    // 确认上传
    submitUpload(importFileData) {
      if (importFileData.length) {
        let rids = this.planForm.throwCity.join(",");
        let sess = this.sessionData;
        let info = `?uid=${sess.uID}&token=${sess.token}&suId=${
          this.BDData.uid
        }&rIDs=${rids}&asrIDs=${this.planForm.pointOfAsrIDs.join(",")}`;
        let formData = new FormData();
        formData.append("file", importFileData[0].raw);
        this.resImport(formData, info);
      } else {
        sessFun.messageFun("warning", "请先上传文件");
      }
    },
    // submitUpload(importFileData) {
    //   if (importFileData.length) {
    //     let rids = this.planForm.throwCity.join(",");
    //     let sess = this.sessionData;
    //     let info = `?uid=${sess.uID}&token=${sess.token}&suId=${
    //       this.BDData.uid
    //     }&rids=${rids}&excludedApId=${
    //       this.activeAdPlan ? this.activeAdPlan : ""
    //     }&asrIDs=${this.planForm.pointOfAsrIDs.join(",")}`;
    //     let formData = new FormData();
    //     formData.append("file", importFileData[0].raw);
    //     this.resImport(formData, info);
    //   } else {
    //     sessFun.messageFun("warning", "请先上传文件");
    //   }
    // },
    // 点位导入
    // adsImport(formData, info) {
    //   // 上传文件
    //   api
    //     .postUpload_file(this.doUpload + info, formData)
    //     .then((res) => {
    //       if (!res.data.SysCode) {
    //         let importInfo = res.data;
    //         console.log("importInfo", importInfo);
    //         this.importInfoData = res.data;
    //         if (importInfo.successList.length) {
    //           this.setShopDataByImport(importInfo.successList);
    //         }
    //         console.log(
    //           "importInfo.errorList.length",
    //           importInfo.errorList.length
    //         );
    //         if (importInfo.errorList.length) {
    //           this.excelDataUpload = this.checkPointFun(importInfo);
    //           this.excelObj = {
    //             successNum: importInfo.successList.length,
    //             failNum: importInfo.errorList.length,
    //           };
    //           this.showUploadFail = true;
    //         }
    //       } else {
    //         sessFun.messageFun("warning", res.data.MSG);
    //       }
    //     })
    //     .catch((res) => {
    //       console.log(res);
    //     });
    // },

    // // 小区导入
    // resImport(formData, info) {
    //   let Loading = this.$loading({
    //     lock: true,
    //     text: "快马加鞭选点中...",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.7)",
    //   });
    //   // 上传文件
    //   api
    //     .postUpload_file(this.doUpload + info, formData)
    //     .then((res) => {
    //       if (res.data.SysCode == 200200) {
    //         let importInfo = res.data.data;
    //         this.importInfoData = importInfo;
    //         this.showUploadFail = true;
    //       } else {
    //         sessFun.messageFun("warning", res.data.MSG);
    //       }
    //       Loading.close();
    //     })
    //     .catch((res) => {
    //       console.log(res);
    //       Loading.close();
    //     });
    // },

    // 小区导入
    // TODO:小区导入
    resImport(formData, info) {
      let Loading = this.$loading({
        lock: true,
        text: "快马加鞭选点中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 上传文件

      api
        .postApi_new(this.doUpload + info, formData)
        .then((res) => {
          console.log("res: ", res);
          if (res.data.SysCode == 200200) {
            let importInfo = res.data.data;
            console.log("importInfo: ", importInfo);
            this.importInfoData = importInfo;
            // this.importSuccessList = importInfo.successList;
            // this.importErrorList = importInfo.errorList;
            this.$refs.importexcel.dialogResult = true;
            // this.showUploadFail = true;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          Loading.close();
        })
        .catch((res) => {
          console.log(res);
          Loading.close();
        });
    },
    // resImport(formData, info) {
    //   let Loading = this.$loading({
    //     lock: true,
    //     text: "快马加鞭选点中...",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.7)",
    //   });
    //   // 上传文件
    //   api
    //     .postUpload_file(this.doUpload + info, formData)
    //     .then((res) => {
    //       if (res.data.SysCode == 200200) {
    //         let importInfo = res.data.data;
    //         console.log("importInfo: ", importInfo);
    //         this.importInfoData = importInfo;
    //         // this.importSuccessList = importInfo.successList;
    //         // this.importErrorList = importInfo.errorList;
    //         this.$refs.importexcel.dialogResult = true;
    //         // this.showUploadFail = true;
    //       } else {
    //         sessFun.messageFun("warning", res.data.MSG);
    //       }
    //       Loading.close();
    //     })
    //     .catch((res) => {
    //       console.log(res);
    //       Loading.close();
    //     });
    // },
    // 取消导入
    cancelImport() {
      this.showUploadFail = false;
      this.isImport = false;
    },
    // 确定导入
    confirmImport(arr) {
      this.showUploadFail = false;
      console.log("import----data---", arr);
      for (let info of arr) {
        if (info.mVehicle == "广告门") {
          this.isHaveDiffPush(info);
        } else if (info.mVehicle == "道闸") {
          this.isHaveDiffPush(info);
        }
      }
      this.isImport = false;
      // this.dialogTableVisible = true;
      this.judgeByselect();
      this.dialogVisible();
      console.log("inport----data----shoplist", this.shopingList);
    },
    // 根据导入方案返回的数据,设置购物车所需要的数据格式
    setShopDataByImport(arr) {
      console.log("arr: ", arr);
      Message.success("成功导入" + arr.length + "条数据");
      setTimeout(() => {
        this.dialogTableVisible = true;
      }, 500);
      this.isImport = false;
      arr.forEach((item) => {
        item.checkBox = false;
        // item.city = this.city[this.activeIndex].rName;
        item.city = item.cityName;
      });

      return arr;
    },
    // setShopDataByImport(arr) {
    //   Message.success("成功导入" + arr.length + "条数据");
    //   //跳转页面后自动打开购物车页面
    //   setTimeout(() => {
    //     this.dialogTableVisible = true;
    //   }, 500);
    //   this.typeShopList = this.getTypeList();
    //   this.isImport = false;
    //   this.computeMedia_AD();
    //   this.judgeByselect();
    //   //这里是现在的新业务逻辑，只需要处理数据的格式，不需要分
    //   return arr.map((info) => {
    //     return {
    //       mID: info.mID,
    //       resType: info.resType,
    //       resID: info.resID,
    //       asID: "",
    //       asIDs: info.asID,
    //       asLabs: info.asLab,
    //       resName: info.resName,
    //       city: info.prName,
    //       rid: info.prID,
    //       origin: info.rName,
    //       buildType: info.cType,
    //       houseNum: info.hNum,
    //       buildPrice: info.hPrice / 100,
    //       mediaName: info.mTitle || "",
    //       mVehicle: info.mVehicle,
    //       buildNum: info.fNum,
    //       // schedule:
    //       //         timeFormat.toDate(data.pbStar, "/") +
    //       //         "-" +
    //       //         timeFormat.toDate(data.pbEnd, "/"),
    //       tradingArea: info.tradingArea,
    //       assetTag: info.assetTag,
    //       liveYear: info.chDay,
    //       mediaRemark: info.mRemark || "--",
    //       mapCenter: info.reference || "--", // 地图中心点
    //       address: info.resAddress || "",
    //       dNum: info.dNum || "", // 出入口数
    //       adLimit: info.notPush || "",
    //       checkBox: false,
    //       connData: {
    //         connectResName: "",
    //         connectMedia: "",
    //         commentWorkRes: "",
    //         commentworkMedia: "",
    //       },
    //       connID: info.connID || "", // 连排门id
    //       industryInfos: info.industryInfos || [], // 同行业资源回避
    //       mediaLevel: info.grade || "",
    //       adPrice:
    //         info.mVehicle === "道闸"
    //           ? info.asPrice / 100 || 0
    //           : info.asPrice / 700 || 0,
    //       asName: info.asName || "", // 点位所属公司名称
    //       asrID: info.asrID, // 所属公司id
    //     };
    //   });
    //   // let j = 0
    //   //TODO:这里是之前的业务逻辑，将数据分为广告门和闸道处理
    //   // for (let data of arr) {
    //   //   let info = data.adSInfo;
    //   //   for (let i = 0; i < 2; i++) {
    //   //     let importInfo = {
    //   //       mID: info.mID,
    //   //       resType: info.resType,
    //   //       resID: info.resID,
    //   //       asID: "",
    //   //       asIDs: info.asID,
    //   //       asLabs: info.asLab,
    //   //       resName: info.resName,
    //   //       city: info.prName,
    //   //       rid: info.prID,
    //   //       origin: info.rName,
    //   //       buildType: info.cType,
    //   //       houseNum: info.hNum,
    //   //       buildPrice: info.hPrice / 100,
    //   //       mediaName: info.mTitle || "",
    //   //       mVehicle: info.mVehicle,
    //   //       buildNum: info.fNum,
    //   //       schedule:
    //   //         timeFormat.toDate(data.pbStar, "/") +
    //   //         "-" +
    //   //         timeFormat.toDate(data.pbEnd, "/"),
    //   //       tradingArea: info.tradingArea,
    //   //       assetTag: info.assetTag,
    //   //       liveYear: info.chDay,
    //   //       mediaRemark: info.mRemark || "--",
    //   //       mapCenter: info.reference || "--", // 地图中心点
    //   //       address: info.resAddress || "",
    //   //       dNum: info.dNum || "", // 出入口数
    //   //       adLimit: info.notPush || "",
    //   //       checkBox: { A: false, B: false, ABC: false },
    //   //       connData: {
    //   //         connectResName: "",
    //   //         connectMedia: "",
    //   //         commentWorkRes: "",
    //   //         commentworkMedia: "",
    //   //       },
    //   //       connID: info.connID || "", // 连排门id
    //   //       industryInfos: info.industryInfos || [], // 同行业资源回避
    //   //       mediaLevel: info.grade || "",
    //   //       adPrice:
    //   //         info.mVehicle === "道闸"
    //   //           ? info.asPrice / 100 || 0
    //   //           : info.asPrice / 700 || 0,
    //   //       asName: info.asName || "", // 点位所属公司名称
    //   //       asrID: info.asrID, // 所属公司id
    //   //     };
    //   //     if (
    //   //       this.customPermission.pptPermission &&
    //   //       this.customPermission.pptPermission.gzqylPermission == "1"
    //   //     ) {
    //   //       importInfo.recommendReason = data.recommendReason; //  亲粤邻定制：推荐理由
    //   //     }
    //   //     if (info.mVehicle == "广告门") {
    //   //       let asLabsArr = importInfo.asLabs.split(",");
    //   //       let asIDArr = importInfo.asIDs.toString().split(",");
    //   //       for (let n = 0; n < asLabsArr.length; n++) {
    //   //         if (i === 0 && asLabsArr[n] === "A") {
    //   //           importInfo.checkBox.A = true;
    //   //           importInfo.A_B = "A";
    //   //           importInfo.asID = asIDArr[n];
    //   //           this.isHaveDiffPush(importInfo);
    //   //           break;
    //   //         } else if (i === 1 && asLabsArr[n] === "B") {
    //   //           importInfo.checkBox.B = true;
    //   //           importInfo.A_B = "B";
    //   //           importInfo.asID = asIDArr[n];
    //   //           this.isHaveDiffPush(importInfo);
    //   //           break;
    //   //         }
    //   //       }
    //   //     } else if (info.mVehicle == "道闸") {
    //   //       importInfo.checkBox.ABC = true;
    //   //       importInfo.A_B = "ABC";
    //   //       // importInfo.asID = importInfo.asIDs.toString().split(',');
    //   //       importInfo.asID = info.asID;
    //   //       this.isHaveDiffPush(importInfo);
    //   //       break;
    //   //     }
    //   //   }
    //   //   // j++
    //   // }
    //   // console.log("this.shopingList1----", this.shopingList);
    //   // Message.success("成功导入" + arr.length + "条数据");
    //   // this.typeShopList = this.getTypeList();
    //   // this.isImport = false;
    //   // this.computeMedia_AD();
    //   // this.judgeByselect();
    // },
    // 判断点位是否已存在购物车(同点位同排期去重、同点位排期交叉则合并、同点位排期联系则合并)
    isHaveDiffPush(obj) {
      console.log("obj----", obj, this.shopingList);
      let ADData = obj;
      let shopArr = this.shopingList;
      let sameMidArr = [];
      let resultArr = [];
      for (let k = 0, kLen = shopArr.length; k < shopArr.length; ) {
        if (ADData.resID === shopArr[k].resID) {
          sameMidArr.push(shopArr[k]);
          shopArr.splice(k, 1);
        } else {
          k++;
        }
      }
      console.log("sameMidArr-----1111", sameMidArr, this.shopingList, shopArr);
      for (let data of sameMidArr) {
        let ADScheArr = ADData.schedule.split("-");
        let shopScheArr = data.schedule.split("-");
        if (
          ADScheArr[0] < shopScheArr[0] &&
          shopScheArr[0] <= ADScheArr[1] &&
          ADScheArr[1] < shopScheArr[1]
        ) {
          // 左相交(购物车相交选点)
          ADData.schedule = ADScheArr[0] + "-" + shopScheArr[1];
        } else if (
          shopScheArr[0] <= ADScheArr[0] &&
          ADScheArr[1] <= shopScheArr[1]
        ) {
          ADData.schedule = shopScheArr[0] + "-" + shopScheArr[1];
          // 购物车包含选点
        } else if (
          shopScheArr[0] < ADScheArr[0] &&
          ADScheArr[0] <= shopScheArr[1] &&
          shopScheArr[1] < ADScheArr[1]
        ) {
          // 右相交(购物车相交选点)
          ADData.schedule = shopScheArr[0] + "-" + ADScheArr[1];
        } else if (
          ADScheArr[0] <= shopScheArr[0] &&
          shopScheArr[1] <= ADScheArr[1]
        ) {
          // 购物车被选点包含
          ADData.schedule = ADScheArr[0] + "-" + ADScheArr[1];
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
            ADData.schedule = timeArr[0] + "-" + timeArr[3];
          } else {
            resultArr.push(data);
          }
        }
      }
      console.log("resultArr----ADData----", resultArr, ADData);
      resultArr.push(ADData);
      console.log("resultArr*****", resultArr, this.shopingList);
      this.shopingList = this.shopingList.concat(resultArr);
    },
    // isHaveDiffPush(obj) {
    //   console.log("obj----", obj, this.shopingList);
    //   let ADData = obj;
    //   let shopArr = this.shopingList;
    //   let sameMidArr = [];
    //   let resultArr = [];
    //   for (let k = 0, kLen = shopArr.length; k < shopArr.length; ) {
    //     if (ADData.mID === shopArr[k].mID && ADData.A_B === shopArr[k].A_B) {
    //       sameMidArr.push(shopArr[k]);
    //       shopArr.splice(k, 1);
    //     } else {
    //       k++;
    //     }
    //   }
    //   console.log("sameMidArr-----1111", sameMidArr, this.shopingList, shopArr);
    //   for (let data of sameMidArr) {
    //     let ADScheArr = ADData.schedule.split("-");
    //     let shopScheArr = data.schedule.split("-");
    //     if (
    //       ADScheArr[0] < shopScheArr[0] &&
    //       shopScheArr[0] <= ADScheArr[1] &&
    //       ADScheArr[1] < shopScheArr[1]
    //     ) {
    //       // 左相交(购物车相交选点)
    //       ADData.schedule = ADScheArr[0] + "-" + shopScheArr[1];
    //     } else if (
    //       shopScheArr[0] <= ADScheArr[0] &&
    //       ADScheArr[1] <= shopScheArr[1]
    //     ) {
    //       ADData.schedule = shopScheArr[0] + "-" + shopScheArr[1];
    //       // 购物车包含选点
    //     } else if (
    //       shopScheArr[0] < ADScheArr[0] &&
    //       ADScheArr[0] <= shopScheArr[1] &&
    //       shopScheArr[1] < ADScheArr[1]
    //     ) {
    //       // 右相交(购物车相交选点)
    //       ADData.schedule = shopScheArr[0] + "-" + ADScheArr[1];
    //     } else if (
    //       ADScheArr[0] <= shopScheArr[0] &&
    //       shopScheArr[1] <= ADScheArr[1]
    //     ) {
    //       // 购物车被选点包含
    //       ADData.schedule = ADScheArr[0] + "-" + ADScheArr[1];
    //     } else {
    //       let timeArr = [
    //         ADScheArr[0],
    //         ADScheArr[1],
    //         shopScheArr[0],
    //         shopScheArr[1],
    //       ];
    //       timeArr.sort((a, b) => {
    //         return Date.parse(a) - Date.parse(b);
    //       });
    //       if (Date.parse(timeArr[2]) - Date.parse(timeArr[1]) == 86400000) {
    //         ADData.schedule = timeArr[0] + "-" + timeArr[3];
    //       } else {
    //         resultArr.push(data);
    //       }
    //     }
    //   }
    //   console.log("resultArr----ADData----", resultArr, ADData);
    //   resultArr.push(ADData);
    //   console.log("resultArr*****", resultArr, this.shopingList);
    //   this.shopingList = this.shopingList.concat(resultArr);
    // },
    // 处理有问题的点
    // checkPointFun(obj) {
    //   let resultarr = [];
    //   for (let data of obj.errorList) {
    //     let item = {
    //       resName: data.resName,
    //       city: data.city,
    //       origin: data.district,
    //       mVehicle: data.mVehicle,
    //       mediaName: data.mTitle,
    //       asLab: data.asLab,
    //       assetTag: data.assetTag,
    //       schedule: data.date,
    //       pointId: data.pointId,
    //       failReason: data.failReason,
    //     };
    //     resultarr.push(item);
    //   }
    //   return resultarr;
    // },
    // // 导出有问题的点
    // downLoadExcel() {
    //   let arr = this.questionPoint(
    //     this.excelDataUpload,
    //     this.importInfoData.successList
    //   );
    //   let allHead = [
    //     "资源名称",
    //     "市",
    //     "区",
    //     "媒介载体",
    //     "媒体名称",
    //     "投放面",
    //     "资产编号",
    //     "投放排期",
    //     "钼媒点位ID",
    //     "失败原因",
    //   ];
    //   sheetExcel.toDownload(
    //     allHead,
    //     arr,
    //     this.planForm.planName + "问题点位表"
    //   );
    // },
    // 导入excel后台返回的问题点位
    // questionPoint(arr, successArr) {
    //   let resultarr = [
    //     {
    //       sheetName: "问题点位",
    //       showList: [],
    //     },
    //     {
    //       sheetName: "正常点位",
    //       showList: [],
    //     },
    //   ];
    //   for (let data of arr) {
    //     let obj = {
    //       resName: data.resName,
    //       city: data.city,
    //       origin: data.origin,
    //       mVehicle: data.mVehicle,
    //       mediaName: data.mediaName,
    //       asLab: data.asLab,
    //       assetTag: data.assetTag,
    //       schedule: data.schedule,
    //       pointId: data.pointId,
    //       failReason: data.failReason,
    //     };
    //     resultarr[0].showList.push(obj);
    //   }
    //   for (let data of successArr) {
    //     let info = data.adSInfo;
    //     let obj = {
    //       resName: info.resName,
    //       city: info.prName,
    //       origin: info.rName,
    //       mVehicle: info.mVehicle,
    //       mediaName: info.mTitle,
    //       asLab: info.asLab,
    //       assetTag: info.assetTag,
    //       schedule:
    //         timeFormat.toDate(data.pbStar, ".") +
    //         "-" +
    //         timeFormat.toDate(data.pbEnd, "."),
    //       pointId: data.pointId,
    //     };
    //     resultarr[1].showList.push(obj);
    //   }
    //   return resultarr;
    // },
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
            console.log(err);
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
            console.log(res.data);
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
            console.log(err);
            this.isCopy = false;
          });
      } else {
        sessFun.messageFun("warning", "请先选择要复制的方案");
      }
    },
    // // 构建复制方案数据格式
    // setCopyData(info) {
    //   let checkBox = { A: false, B: false, ABC: false };
    //   if (info.asLab === "A") {
    //     checkBox.A = true;
    //   } else if (info.asLab === "B") {
    //     checkBox.B = true;
    //   } else if (info.asLab === "ABC") {
    //     checkBox.ABC = true;
    //   }
    //   let importInfo = {
    //     mID: info.mID,
    //     resType: info.resType,
    //     resID: info.resID,
    //     // asID: '',
    //     asID: info.asID,
    //     asIDs: info.asID,
    //     asLabs: info.asLab,
    //     resName: info.resName,
    //     city: info.city,
    //     rid: info.rID,
    //     origin: info.rName,
    //     buildType: info.cType,
    //     houseNum: info.hNum,
    //     buildPrice: info.hPrice / 100,
    //     mediaName: info.mTitle || "",
    //     mVehicle: info.mVehicle,
    //     buildNum: info.fNum,
    //     schedule: this.dateInput[0] + "-" + this.dateInput[1],
    //     tradingArea: info.tradingArea,
    //     assetTag: info.assetTag,
    //     liveYear: info.chDay,
    //     mediaRemark: info.mRemark || "--",
    //     mapCenter: info.reference || "--", // 地图中心点
    //     address: info.resAddress || "",
    //     dNum: info.dNum || "", // 出入口数
    //     adLimit: info.notPush || "",
    //     A_B: info.asLab,
    //     checkBox: checkBox,
    //     connData: {
    //       connectResName: "",
    //       connectMedia: "",
    //       commentWorkRes: "",
    //       commentworkMedia: "",
    //     },
    //     connID: info.connID || "", // 连排门id
    //     industryInfos: info.industryInfos || [], // 同行业资源回避
    //     mediaLevel: info.grade || "",
    //     adPrice:
    //       info.mVehicle === "道闸"
    //         ? info.asPrice / 100 || 0
    //         : info.asPrice / 700 || 0,
    //     asName: info.asName || "", // 点位所属公司名称
    //     asrID: info.asrID, // 所属公司id,
    //     lState: info.adlInfo ? info.adlInfo : "", // 是否被占
    //   };
    //   // if(info.mVehicle === '道闸'){
    //   //     importInfo.asID = info.asIDs.split(',')
    //   // }else if(info.mVehicle === '广告门'){
    //   //     importInfo.asID = info.asID
    //   // }
    //   return importInfo;
    // },
    //获取导出方案数据
    getPreExcelData() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apID: this.FAData.apID,
      };
      return api.getApi("/addsp/proposal/getPlanResList", params);
    },
    // 第四步的导出方案
    async downLoadFanan() {
      let { data } = await this.getPreExcelData();
      let arr = this.excelData(data.data);
      let allHead = [
        "省份",
        "城市",
        "区域",
        "资源名称",
        "商圈",
        "地址",
        "媒介载体",
        "楼栋数量",
        "住户数量",
        "楼盘价格",
        "楼盘类型",
        "入住年份",
        "车位数",
        "车流量",
        "人流量",
        "广告限制",
        "媒体数量（门）",
        "计划投放数量(面)",
      ];

      sheetExcel.toDownload(
        allHead,
        arr,
        this.planForm.planName
        // head
      );
    },
    // 处理数据
    excelData(arr) {
      console.log("arrr------excelData", arr);
      let dateArr = [];
      let arr2 = [];
      //将得到的数据除去不需要的
      for (let item of arr) {
        let obj = {
          provinceName: item.provinceName,
          cityName: item.cityName,
          districtName: item.districtName,
          resName: item.resName,
          tradingArea: item.tradingArea,
          resAddress: item.resAddress,
          mVehicle: item.mVehicle,
          fNum: item.fNum,
          hNum: item.hNum,
          hPrice: item.hPrice,
          cType: item.cType,
          chDay: item.chDay,
          parkSpaceNum: item.parkSpaceNum,
          carFlow: item.carFlow,
          peopleFlow: item.peopleFlow,
          notPush: item.notPush,
          actualMediaCnt: item.actualMediaCnt,
          planAdsCnt: item.planAdsCnt,
        };
        arr2.push(obj);
      }
      let obj = {
        sheetName: "小区列表",
        showList: arr2,
      };
      dateArr.push(obj);
      return dateArr;
    },
    // downLoadFanan() {
    //   let arr = this.excelData(this.shopingList);
    //   let allHead = [
    //     "资源名称",
    //     "市",
    //     "区",
    //     "商圈",
    //     "资源地址",
    //     "楼盘价格",
    //     "入住年份",
    //     "住户数量",
    //     "出入口",
    //     "楼栋数量",
    //     "楼盘（写字楼）类型",
    //     "地图中心点",
    //     "可选面数",
    //     "投放排期",
    //   ];
    //   let head = [
    //     "在线协同选点链接(可地图查看社区)  " + this.shareADUrl,
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //   ];
    //   if (
    //     (this.sessionData.uType == "MD" &&
    //       this.sessionData.mediaManageLevel == 1) ||
    //     (this.sessionData.uType == "BD" &&
    //       this.sessionData.saleManageLevel == 2)
    //   ) {
    //     allHead.push("归属公司");
    //   }
    //   /* if(this.customPermission.patrolPermission) {
    //                 allHead.push('巡点问题', '通行情况');
    //             } */
    //   switch (this.customPermission.patrolPermission) {
    //     case 1:
    //       allHead.push("巡点问题", "通行情况");
    //       break;
    //     case 2:
    //       allHead.push("巡点问题", "通行情况", "通电情况");
    //       break;
    //   }
    //   sheetExcel.toDownload(
    //     allHead,
    //     arr,
    //     this.planForm.planName + "点位表",
    //     head
    //   );
    // },
    // // 处理数据
    // excelData(arr) {
    //   console.log("arrr------excelData", arr);
    //   let dateArr = [];
    //   let filtersData = filterFormat(arr, "schedule");
    //   for (let item of filtersData) {
    //     console.log(item);
    //     let dateObj = {
    //       sheetName: item.value,
    //       showList: [],
    //       resIDArr: [],
    //     };
    //     dateArr.push(dateObj);
    //   }
    //   for (let data of arr) {
    //     let obj = {
    //       resID: data.resID,
    //       resName: data.resName,
    //       city: data.city,
    //       rName: data.origin,
    //       tradingArea: data.tradingArea,
    //       resAddress: data.address,
    //       hPrice: data.buildPrice,
    //       chDay: data.liveYear,
    //       hNum: data.houseNum,
    //       dNum: data.dNum,
    //       fNum: data.buildNum,
    //       cType: data.buildType,
    //       map: data.mapCenter,
    //       adsNum: 1,
    //       timeRange: "",
    //     };
    //     if (
    //       (this.sessionData.uType == "MD" &&
    //         this.sessionData.mediaManageLevel == 1) ||
    //       (this.sessionData.uType == "BD" &&
    //         this.sessionData.saleManageLevel == 2)
    //     ) {
    //       obj.asName = data.asName;
    //     }
    //     // 巡点权限(1：亲粤邻 2：北京)
    //     if (this.customPermission) {
    //       switch (this.customPermission.patrolPermission) {
    //         case 1:
    //           obj.remark = data.remark;
    //           obj.trafficState = data.trafficState;
    //           break;
    //         case 2:
    //           obj.remark = data.remark;
    //           obj.trafficState = data.trafficState;
    //           obj.allElectrifyState = data.allElectrifyState;
    //           break;
    //       }
    //     }
    //     for (let date of dateArr) {
    //       if (data.schedule == date.sheetName) {
    //         if (date.resIDArr.includes(data.resID)) {
    //           for (let item of date.showList) {
    //             if (item.resID == data.resID) {
    //               item.adsNum++;
    //               break;
    //             }
    //           }
    //         } else {
    //           obj.timeRange = date.sheetName;
    //           date.resIDArr.push(data.resID);
    //           date.showList.push(obj);
    //         }
    //         break;
    //       }
    //     }
    //   }
    //   for (let data of dateArr) {
    //     for (let obj of data.showList) {
    //       delete obj.resID;
    //     }
    //     data.sheetName = data.sheetName.replace(/[/]/g, ".");
    //   }
    //   // console.log('datearrr-----', dateArr);
    //   return dateArr;
    // },
    // 导出空位
    downEmpty() {
      console.log("this.planForm.throwCity----", this.planForm.throwCity);
      if (this.planForm.throwCity.length) {
        let rID = this.planForm.throwCity.join(",");
        this.downUrl = window.location.origin + "/emptyPoint?rid=" + rID;
        console.log("downUrl-----", this.downUrl);
        this.showEmpty = true;
      } else {
        sessFun.messageFun("warning", "请先选择投放城市");
      }
    },
    // 复制空位导出链接
    copyUrlDown() {
      let Url = document.getElementById("shareDownUrl").innerText;
      console.log("url", Url);
      let oInput = document.createElement("input");
      oInput.value = Url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.style.display = "none";
      sessFun.messageFun("success", "复制成功");
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
      console.log("非全国，移除城市val", val, this.planForm.throwCity);
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
            console.log("findBDUserByKeyword", res);
            if (res.data.SysCode === 200200) {
              let arr = [];
              for (let key of res.data.data) {
                arr.push({
                  label: key.realName + "(" + key.sName + ")",
                  value: key.uID,
                  saleManageLevel: key.saleManageLevel,
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
      api
        .getApi(this.apiVar.Advertisement + "/MyCustomer", params)
        .then((res) => {
          console.log("MyCustomer:", res.data);
          let customerList = res.data;
          this.customer = res.data; //保存所有信息，方便后面的过滤使用
          let companyList = []; // 公司名称
          let ownerList = []; // 联系人
          for (let i = 0; i < customerList.length; i++) {
            // console.log('公司名称',i,customerList[i].cName)
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
          this.adcID = ownerList; // 联系人列表
        });
    },
    // 获取公司品牌
    GetBrandByCid(val) {
      this.planForm.companyBrand = "";
      this.planForm.adcID = "";
      console.log("所选公司的ID", val);
      let cidParams = {
        cid: val,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetBrand", cidParams)
        .then((res) => {
          console.log("公司品牌", res.data);
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
      this.adcID = ownerList;
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
          //如果是BD弹窗选点方式，不是的话直接走之前的业务流程
          if (this.isBD) return (this.isSelectPoint = true);
          this.manualSelectPoint();
          // console.log("表单验证this.throwCity", this.throwCity);
          // //代码移动到手动选点manualSelectPoint后执行
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 初始化step2的数据
    initStep2Data() {
      this.loadScroll = true;
      this.recType = 1;
      this.pageNum = 1;
      this.planList = [];
      this.activeIndex = 0;
      this.activeRName = ""; //step2当前选中的城市名称
      this.areaName = "全市"; // step2当前选中的区域
      this.mediaType = "广告门";
      let inputPath = this.$route.fullPath;
      if (inputPath.indexOf("unfinishedPlan") !== -1) {
        // this.unfinishedData.planData.throwCity
        console.log("缓存方案再编辑", this.unfinishedData.planData);
        let arr = [];
        for (let key of this.shopingList) {
          if (
            this.unfinishedData.planData.baseInfo.throwCity.includes(key.rid)
          ) {
            arr.push(key);
          }
        }
        this.shopingList = arr;
      } else {
        this.shopingList = []; // 购物车
      }
      this.limitList = []; // 初始化广告限制
      this.filterCondition = []; // 过滤条件tag
      this.mState = ""; // 媒体状态
      this.buildValue = ""; // 楼盘类型
      for (let i in this.filterData) {
        this.filterData[i] = false;
      }
      this.IsAll = false;
    },
    /*step2*/
    // 获取排斥方案选择列
    // getRejectPlanList() {
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     sales_user: this.BDData.uid,
    //   };
    //   api
    //     .getApi(this.apiVar.Advertisement + "/getSalesProject", params)
    //     .then((res) => {
    //       console.log("销售所属方案", res);
    //       if (res.data.SysCode == 200200) {
    //         let resData = res.data.data;
    //         let tempList = [];
    //         for (let key of resData) {
    //           tempList.push({
    //             value: key.apId,
    //             label: key.apName + "--" + key.cname + "--" + key.apcTime,
    //           });
    //         }
    //         this.rejectAdPlan = tempList;
    //       } else {
    //         sessFun.messageFun("warning", res.data.MSG);
    //       }
    //     });
    // },
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
        console.log("广告限制列表", res);
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
    //TODO 设置城市区域
    getAreaFun() {
      this.area = [];
      let throwCityList = this.planForm.throwCity;
      console.log("this.throwCity: ", this.throwCity);
      console.log("throwCityList: ", throwCityList);
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
          console.log("cityArr", cityArr);
          this.city = cityArr;
          console.log("this.city: ", this.city);
          this.city.sort(this.compareFun);
          console.log("this.city ", this.city);
          this.activeCityData = this.city[0]; // 设置初始选中城市信息
          this.activeRName = this.activeCityData.rName;
          for (let n = 0; n < this.city.length; n++) {
            let rid = this.city[n].rid.toString();
            console.log("投放城市rid", rid);
            let provinceRid = rid.substring(0, 2) + "0000";
            let city_arr = this.areaCity;
            let areaArr = [];
            console.log("this.cityOptions", this.areaCity);
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
              if (i >= city_arr.length - 1) {
                console.log("this.area", this.area);
              }
            }
          }
        }
      }
    },
    // 获取广告点位列表
    //按小区选点
    getAdList() {
      this.loading = true;
      this.getAdsParamsData.startDate = this.dateInput[0];
      this.getAdsParamsData.endDate = this.dateInput[1];
      this.getAdsParamsData.apName = this.planForm.planName;
      this.getAdsParamsData.asrIDs = this.planForm.pointOfAsrIDs.join(",");
      this.getAdsParamsData.suID = this.BDData.uid;
      this.getAdsParamsData.planAdsCnt = this.planAdsCnt ? this.planAdsCnt : 1;
      this.getAdsParamsData.pageNum = this.pageNum;

      //   startDate: this.dateInput[0], //开始时间  必填
      //   endDate: this.dateInput[1], //结束时间 必填
      //   suID: this.BDData.uid, //方案所属销售用户id 必填
      //   apName: this.planForm.planName, //意向方案名称 必填
      //   asrIDs: this.planForm.pointOfAsrIDs.join(","), //附属公司id拼接，逗号相隔
      //   pageNum: this.pageNum, //第几页
      //   pageSize: this.pageSize, //每页条数
      //   asrIDs:"", //附属公司id拼接，逗号相隔
      //   rID, //区域id
      //   resType, //资源类型
      //   mVehicle, //媒体类型
      //   pageNum, //第几页
      //   pageSize, //每页大小
      //   apID, //意向方案id，编辑的时候需要带

      for (let i in this.getAdsParamsData) {
        if (!this.getAdsParamsData[i]) {
          delete this.getAdsParamsData[i];
        }
      }
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        ...this.getAdsParamsData,
      };
      let timer = setTimeout(() => {
        // setTimeout 异步让table出现loading
        let url = this.apiVar.ResList;
        api.getApi(url, params).then((res) => {
          console.log("选点列表：", res);
          if (res.data.SysCode == 200200) {
            if (res.data.data) {
              // this.planList = [];
              // this.planList = res.data.data;
              let ADList = res.data.data;
              this.setTableDataADDoor(ADList);
              this.totalPage = res.data.totalPage;
              this.total = res.data.total;
              // this.pageNum++
              // console.log(' this.pageNum++', this.pageNum)
              this.judgeByselect(); //判断购物车是否存在得到的数据
              this.searchBtnAbled = false;
            } else {
              this.planList = [];
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
    //选点原逻辑
    // getAdList() {
    //   console.log("当前页码", this.pageNum, "当前时间", this.dateInput);
    //   this.loading = true;
    //   this.getAdsParamsData.dateTimeBegin = this.dateInput[0];
    //   this.getAdsParamsData.dateTimeEnd = this.dateInput[1];
    //   this.getAdsParamsData.pageNum = this.pageNum;
    //   this.getAdsParamsData.uid = this.BDData.uid;
    //   this.getAdsParamsData.asrIDs = this.planForm.pointOfAsrIDs.join(",");
    //   for (let i in this.getAdsParamsData) {
    //     if (this.getAdsParamsData[i] === "") {
    //       delete this.getAdsParamsData[i];
    //     }
    //   }
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     service: "GetAdS",
    //     data: this.getAdsParamsData,
    //   };
    //   let timer = setTimeout(() => {
    //     // setTimeout 异步让table出现loading
    //     api.postApi_new(this.apiVar.Media, params).then((res) => {
    //       console.log("选点列表：", res);
    //       if (res.data.SysCode === 200200) {
    //         if (
    //           res.data.data.list !== undefined &&
    //           res.data.data.list.length > 0
    //         ) {
    //           this.planList = [];
    //           let ADList = res.data.data.list;
    //           this.setTableDataADDoor(ADList);
    //           this.total = res.data.data.total;
    //           this.adsCount = res.data.data.total;
    //           // this.pageNum++
    //           // console.log(' this.pageNum++', this.pageNum)
    //           this.judgeByselect();
    //           this.searchBtnAbled = false;
    //         } else {
    //           this.planList = [];
    //         }
    //         this.loading = false;
    //       } else {
    //         sessFun.messageFun("warning", res.data.MSG);
    //         this.loading = false;
    //       }
    //       this.searchBtnAbled = false;
    //     });
    //     clearTimeout(timer);
    //   }, 0);
    // },
    // 接口数据转成table
    setTableDataADDoor(ADSdata) {
      let i = 0;
      console.log("接口数据转成table当前时间", this.dateInput);
      this.planList = [];
      for (let key of ADSdata) {
        let adObj = {
          ...key,
          checkBox: false,
          city: this.city[this.activeIndex].rName,
        };
        this.planList.push(adObj);
        i++;
      }
      this.currPageAsLength = i;
      this.loadScroll = true;

      console.log(
        "表格数据",
        this.planList,
        this.currPageSelect,
        this.currPageAsLength
      );
    },
    // setTableDataADDoor(ADSdata) {
    //   let i = 0;
    //   console.log("接口数据转成table当前时间", this.dateInput);
    //   for (let key of ADSdata) {
    //     let adObj = {
    //       mID: key.mID,
    //       resType: key.resType,
    //       resID: key.resID,
    //       asIDs: key.asIDs,
    //       asLabs: key.asLabs,
    //       resName: key.resName,
    //       city: this.city[this.activeIndex].rName,
    //       rid: this.city[this.activeIndex].rid,
    //       origin: key.rName,
    //       buildType: key.cType,
    //       houseNum: key.hNum,
    //       buildPrice: key.hPrice / 100,
    //       mediaName: key.mTitle || "",
    //       mVehicle: key.mVehicle, // 媒体类型
    //       mediaRemark: key.mRemark || "--",
    //       parkSpaceNum: key.parkSpaceNum,
    //       carFlow: key.carFlow,
    //       peopleFlow: key.peopleFlow,
    //       buildNum: key.fNum,
    //       schedule: this.dateInput[0] + "-" + this.dateInput[1],
    //       remark: key.remark || "--", // 巡点定制
    //       trafficState: key.trafficState || "--", // 巡点定制
    //       electrifyState: key.electrifyState || "--", // 巡点定制
    //       tradingArea: key.tradingArea || "",
    //       assetTag: key.assetTag || "",
    //       liveYear: key.chDay,
    //       adLimit: key.notPush || "",
    //       mState:
    //         key.mState === 1 ? "正常" : key.mState === 2 ? "待安装" : "--",
    //       adSize: key.adSize || "",
    //       picSize: key.picSize || "",
    //       mapCenter: key.reference || "", // 地图中心点
    //       address: key.resAddress || "",
    //       dNum: key.dNum || "", // 出入口数
    //       connID: key.connID || "", // 连排门id
    //       industryInfos: key.industryInfos, // 同行业资源、媒体回避
    //       mediaLevel: key.grade || "", // 媒体等级
    //       asName: key.asName, // 点位所属公司名称
    //       asrID: key.asrID, // 所属公司id
    //       // checkBox: { A: false, B: false, ABC: false },
    //       checkBox: false,
    //       // box: { A: false, B: false },
    //       box: false,
    //     };
    //     // // 点位价格
    //     // if (key.mVehicle === "道闸") {
    //     //   adObj.adPrice = key.asPrice / 100;
    //     // } else {
    //     //   if (key.asPrice) {
    //     //     adObj.adPrice = key.asPrice / 700;
    //     //   } else {
    //     //     adObj.adPrice = 0;
    //     //   }
    //     // }
    //     // // A/B面
    //     // if (key.asLabs.indexOf("A") === -1) {
    //     //   adObj.box.A = true;
    //     // } else {
    //     //   //本页可选点位
    //     //   i++;
    //     // }
    //     // if (key.asLabs.indexOf("B") === -1) {
    //     //   adObj.box.B = true;
    //     // } else {
    //     //   //本页可选点位
    //     //   i++;
    //     // }
    //     // 点位状态
    //     // if (!!key.adlInfo && key.adlInfo.length > 0) {
    //     //   let arr = [];
    //     //   for (let akey of key.adlInfo) {
    //     //     if (akey.asState) {
    //     //       arr.push({
    //     //         asState: akey.asState,
    //     //       });
    //     //     } else {
    //     //       let star = timeFormat.toDate(akey.lStar, "/");
    //     //       let end = timeFormat.toDate(akey.lEnd, "/");
    //     //       arr.push({
    //     //         beOccupieApName: akey.apName,
    //     //         schedule: star + "-" + end,
    //     //         lState: akey.lState,
    //     //       });
    //     //     }
    //     //   }
    //     //   adObj.adlInfo = arr;
    //     // } else {
    //     //   adObj.adlInfo = "";
    //     // }
    //     this.planList.push(adObj);
    //     i++;
    //   }
    //   this.currPageAsLength = i;
    //   this.loadScroll = true;

    //   console.log(
    //     "表格数据",
    //     this.planList,
    //     this.currPageSelect,
    //     this.currPageAsLength
    //   );
    // },
    setpageNumAndTableData() {
      this.loadScroll = false;
      this.IsAll = false;
      this.HSearch = "";
      this.pageNum = 1;
      this.planList = [];
    },
    // 方案排斥选择
    // selectRejectPlan(val) {
    //   console.log("方案排斥选择", val, this.activeAdPlan);
    //   this.getAdsParamsData.apId = this.activeAdPlan;
    //   this.setpageNumAndTableData();
    //   this.getAdList();
    // },
    //step2搜索按钮
    searchFun() {
      this.searchBtnAbled = true;
      console.log("this.planAdsCnt: ", this.planAdsCnt);
      console.log("搜索排期时间", this.dateInput);
      console.log("this.searchInput: ", this.searchInput);
      this.areaName = "全市";
      if (this.selectValue === "被占查询") {
        this.loadScroll = false;
        //    this.isOccupied = false     // 被占搜索时隐藏过滤条件
        // this.beOccupiedGetList(); // 获取被占列表接口
        // this.beOccupiedNumber++;
      } else {
        this.loadScroll = true;
        this.isOccupied = true; //  || this.dateInput !== this.beforeDate
        if (this.searchInput !== "" && this.dateInput !== null) {
          this.setpageNumAndTableData();
          this.ResOriginSearch();
        } else if (
          this.searchInput === "" &&
          this.dateInput !== this.beforeDate &&
          this.dateInput !== null
        ) {
          this.setpageNumAndTableData();
          this.getAdList();
          this.beforeDate = this.dateInput;
        } else if (this.planAdsCnt) {
          this.setpageNumAndTableData();
          this.ResOriginSearch();
        } else if (!this.dateInput) {
          sessFun.messageFun("warning", "搜索时间不能为空");
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
      console.log("搜索框变化的值", val);
      if (!this.searchInput && this.selectValue !== "被占查询") {
        this.isOccupied = true;
        this.getAdsParamsData.tradingArea = "";
        this.getAdsParamsData.assetTag = "";
        this.getAdsParamsData.resName = "";
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    //  查询被占点位
    // beOccupiedGetList() {
    //   let starTime = this.dateInput[0];
    //   let endTime = this.dateInput[1];
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     rn: this.searchInput,
    //     ls: starTime.split(".").join(""),
    //     le: endTime.split(".").join(""),
    //     cityIds: this.city.map((_) => _.rid),
    //     saleId: this.BDData.uid,
    //     asrIDs: this.planForm.pointOfAsrIDs.join(","),
    //   };
    //   console.log("参数", params);
    //   api
    //     .postApi(this.apiVar.Advertisement + "/GetResAdplanInfo", params)
    //     .then((res) => {
    //       console.log("查询被占点位", res);
    //       this.isOccupied = false; // 被占搜索时隐藏过滤条件
    //       let dataArr = res.data;
    //       if (res.data === "" || res.data === null || res.data.length <= 0) {
    //         this.planList = [];
    //         sessFun.messageFun("warning", "暂无该小区被占信息");
    //       } else {
    //         let arr = [];
    //         for (let key of dataArr) {
    //           let AD_data = {
    //             mID: key.mID,
    //             resType: key.resType,
    //             resID: key.resID,
    //             asIDs: key.asID,
    //             asLabs: key.asLab,
    //             resName: key.resName,
    //             city: key.cityName, //'广州',
    //             origin: key.quName,
    //             buildType: key.cType,
    //             houseNum: key.hNum,
    //             buildPrice: key.hPrice / 100,
    //             mediaName: key.mTitle,
    //             buildNum: key.fNum,
    //             schedule: this.dateInput[0] + "-" + this.dateInput[1],
    //             tradingArea: key.tradingArea || "",
    //             assetTag: key.assetTag || "",
    //             liveYear: key.chDay,
    //             adLimit: key.notPush || "",
    //             mediaRemark: key.mRemark || "--",
    //             mState:
    //               key.mState === 1 ? "正常" : key.mState === 2 ? "待安装" : "",
    //             adSize: key.adSize || "",
    //             apName: key.apName, // 被占方案名称
    //             lStar: key.lStar, // 被占排期lStar，lEnd
    //             lEnd: key.lEnd,
    //             lState: key.lState, //点位状态 1被占，2强制停止  0 锁点
    //             mediaLevel: key.grade || "",
    //           };
    //           arr.push(AD_data);
    //         }
    //         this.planList = arr;
    //       }
    //       this.searchBtnAbled = false;
    //     });
    // },
    // 判断地图权限
    judgeMapSelect() {
      this.isMapKind = true;
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
        this.ActiveMapType = 1;
      } else if (this.selectMapKind == 2) {
        this.setMapParams();
        localStorage.removeItem("qinlinMapCode");
        this.ActiveMapType = 2;
      }
      this.isMapKind = false;
    },
    //step2地图选点
    mapAD() {
      console.log("地图选点提交的rid", this.activeCityData);
      let rid = this.activeCityData.rid;
      this.mapParams = {
        rid: rid,
        city: this.activeCityData.rName,
        ls: this.dateInput[0],
        le: this.dateInput[1],
      };
      let params = {
        token: this.sessionData.token,
        uid: this.sessionData.uID,
        rid: rid,
        act: 1,
        ls: this.dateInput[0],
        le: this.dateInput[1],
        suID: this.BDData.uid,
        apId: this.activeAdPlan,
      };
      if (params.apId === "") {
        delete params.apId;
      }
      console.log("生成地图MapID参数", params);
      let tempwindow = window.open();
      api
        .getApi(this.apiVar.Map + "/GetMapInfo", params)
        .then((res) => {
          console.log("GetMapInfo地图mapid返回的信息", res);
          if (!res.data.SysCode) {
            let mapid = res.data.MapID;
            this.mapBtn = false;
            this.dialogVisible();
            tempwindow.location =
              this.apiVar.wuYouMap +
              mapid +
              "&city=" +
              this.activeRName +
              "&flag=" +
              true;
          } else {
            tempwindow.close();
            sessFun.messageFun("warning", res.data.MSG + ",请尝试重新点击");
          }
        })
        .catch((err) => {
          console.log("error", err);
        });
    },
    // 设置地图选点参数
    // TODO设置地图选点参数
    setMapParams() {
      localStorage.removeItem("qinlinMapCode");
      this.ActiveMapType = 2;
      console.log("this.planAdsCnt: ", this.planAdsCnt);
      this.mapParams = {
        rid: this.activeCityData.rid,
        city: this.activeCityData.rName,
        ls: this.dateInput[0],
        le: this.dateInput[1],
        planAdsCnt: this.planAdsCnt ? this.planAdsCnt : 1,
        mVehicle: this.mediaType,
      };
      console.log("this.planAdsCnt: ", this.planAdsCnt);
      localStorage.setItem(
        "mapParams",
        JSON.stringify({
          rid: this.activeCityData.rid,
          ls: this.dateInput[0],
          le: this.dateInput[1],
          adSystemId: [this.industryID],
          suID: this.BDData.uid,
          asrIDs: this.planForm.pointOfAsrIDs,
          planAdsCnt: this.planAdsCnt ? this.planAdsCnt : 1,
          mVehicle: this.mediaType,
        })
      );
      let url = `${window.location.protocol}//${window.location.host}/ADResourceMap/chooseRes?flag=true&city=${this.mapParams.city}`;
      // let url = "";
      // if (window.location.hostname == "localhost") {
      //   url =
      //     window.location.host +
      //     "/ADResourceMap/chooseRes?city=" +
      //     this.mapParams.city +
      //     "&flag=" +
      //     true;
      // } else {
      //   url =
      //     this.apiVar.qadnUrl +
      //     "/ADResourceMap/chooseRes?city=" +
      //     this.mapParams.city +
      //     "&flag=" +
      //     true;
      // }
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
    // oneKeySelectPoint() {
    //   console.log("一键选点");
    //   let oneKeyPointLoading = this.$loading({
    //     lock: true,
    //     text: "快马加鞭选点中...",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.7)",
    //   });
    //   let IsXhr = false;
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     vehicle: "AdGate",
    //     act: 1,
    //     ls: this.dateInput[0].replace(/\./g, "/"),
    //     le: this.dateInput[1].replace(/\./g, "/"),
    //     rid: this.city[this.activeIndex].rid,
    //     total: this.oneKeyPointData.TotalPoint,
    //     everyResNumber: this.oneKeyPointData.pointNumByRes,
    //     labAPercent: this.oneKeyPointData.A_cale,
    //     rt: this.recType,
    //     rhn: this.houseNum[0],
    //     shn: this.houseNum[1],
    //     shp: this.buildPrice[0] * 100,
    //     bhp: this.buildPrice[1] * 100,
    //     suid: this.BDData.uid,
    //     asrIDs: this.planForm.pointOfAsrIDs.join(","),
    //     apId: this.activeAdPlan,
    //   };
    //   if (this.selectValue === "商圈") {
    //     params.ta = this.searchInput;
    //   }
    //   // 过滤地区rID
    //   if (this.areaName !== "全市") {
    //     params.qrid = this.areaRid;
    //   }
    //   // 限制广告不能投放类型 ,分割
    //   if (this.limitList.length > 0) {
    //     params.adLimit = this.limitList.join(",");
    //   }
    //   for (let i in params) {
    //     if (
    //       i !== "labAPercent" &&
    //       (params[i] === "" || params[i] === undefined || params[i] == 0)
    //     ) {
    //       delete params[i];
    //     }
    //   }
    //   api
    //     .postApi(this.apiVar.Advertisement + "/AutoSetAdS", params)
    //     .then((res) => {
    //       console.log("一键选点", res.data);
    //       IsXhr = true;
    //       let tempArr = [];
    //       let resArr = res.data;
    //       if (resArr !== "" && resArr.length > 0) {
    //         for (let key of res.data) {
    //           let selectInfo = {
    //             rid: this.city[this.activeIndex].rid,
    //             mID: key.mID,
    //             mVehicle: key.mVehicle,
    //             asID: key.asID,
    //             asIDs: key.asID,
    //             asLabs: key.asLab,
    //             resName: key.resName,
    //             resID: key.resID,
    //             city: this.city[this.activeIndex].rName,
    //             origin: key.rName,
    //             buildType: key.cType,
    //             houseNum: key.hNum,
    //             buildPrice: key.hPrice / 100,
    //             mediaName: key.mTitle,
    //             remark: key.remark || "--", // 巡点定制
    //             trafficState: key.trafficState || "--", // 巡点定制
    //             electrifyState: key.electrifyState || "--", // 巡点定制
    //             buildNum: key.fNum,
    //             schedule: this.dateInput[0] + "-" + this.dateInput[1],
    //             tradingArea: key.tradingArea,
    //             assetTag: key.assetTag,
    //             liveYear: key.chDay,
    //             adLimit: key.notPush,
    //             mapCenter: "", // 地图中心点name
    //             address: key.resAddress || "",
    //             dNum: key.dNum || "", // 出入口数
    //             A_B: key.asLab,
    //             // checkBox: { A: false, B: false, ABC: false },
    //             checkBox:  false ,
    //             connID: key.connID || "", // 连排门id
    //             connData: {
    //               connectResName: "",
    //               connectMedia: "",
    //               commentWorkRes: "",
    //               commentworkMedia: "",
    //             },
    //             industryInfos: key.industryInfos || [],
    //             mediaLevel: key.grade || "",
    //             adPrice:
    //               key.mVehicle === "道闸"
    //                 ? key.asPrice / 100 || 0
    //                 : key.asPrice / 700 || 0,
    //             asName: key.asName || "", // 点位所属公司名称
    //             asrID: key.asrID, // 所属公司id
    //           };
    //           if (selectInfo.asLabs === "A") {
    //             selectInfo.checkBox.A = true;
    //           } else if (selectInfo.asLabs === "B") {
    //             selectInfo.checkBox.B = true;
    //           }
    //           if (this.judgeHaveDiffAD(selectInfo)) {
    //             tempArr.push(selectInfo);
    //             // break
    //           }
    //         }
    //         if (this.shopingList.length !== 0) {
    //           for (let key of tempArr) {
    //             this.shopingList.push(key);
    //           }
    //         } else {
    //           this.shopingList = tempArr;
    //         }
    //         this.dialogOneKeyPoint = false;
    //         this.typeShopList = this.getTypeList();
    //         this.computeMedia_AD();
    //         this.judgeByselect();
    //         if (this.oneKeyPointData.TotalPoint == res.data.length) {
    //           sessFun.messageFun(
    //             "success",
    //             "成功选择了" + res.data.length + "面"
    //           );
    //         } else {
    //           sessFun.messageFun(
    //             "warning",
    //             "满足条件的点位不足" +
    //               this.oneKeyPointData.TotalPoint +
    //               "面,成功选择了" +
    //               res.data.length +
    //               "面"
    //           );
    //         }
    //       } else {
    //         sessFun.messageFun("warning", "选择失败,暂无匹配点位");
    //       }
    //       oneKeyPointLoading.close();
    //     });
    //   let timer = setTimeout(() => {
    //     if (!IsXhr) {
    //       sessFun.messageFun("warning", "点位选择异常");
    //       oneKeyPointLoading.close();
    //     } else {
    //       // console.log('一键选点已成功')
    //     }
    //     clearTimeout(timer);
    //   }, 1000 * 65);
    // },
    // step2, 资源类型切换
    activeRecType(num) {
      this.buildValue = "";
      this.getAdsParamsData.buildType = "";
      if (num == "1") {
        this.buildType = this.village;
      } else if (num == "2") {
        this.buildType = this.officeBuilding;
      }
      this.setpageNumAndTableData();
      this.recType = num;
      this.getAdsParamsData.resType = num;
      this.getAdList();
    },
    //媒体类型切换
    activeMediaType(mType) {
      console.log("媒体类型", mType);
      this.setpageNumAndTableData();
      this.mediaType = mType;
      this.getAdsParamsData.mVehicle = mType;
      this.getAdList();
    },
    // tab切换城市
    activeCity(item, index) {
      console.log("item", item, "index", index);
      this.activeIndex = index;
      this.activeRName = item.rName;
      this.activeCityData = item;
      this.areaName = "全市";
      // this.getAdsParamsData.area = "";
      this.getAdsParamsData.rID = "";
      this.getAdsParamsData.prID = this.city[index].rid;
      this.setpageNumAndTableData();
      this.getAdList();
    },
    //  stpe2, 切换区域
    //TODO:11切换区域
    activeArea(item) {
      console.log("item: ", item);
      this.areaName = item.rName;
      this.areaRid = item.rID;
      this.setpageNumAndTableData();
      if (this.areaName === "全市") {
        this.getAdsParamsData.rID = "";
      } else {
        this.getAdsParamsData.rID = item.rID;
      }
      this.getAdList();
    },
    // 选点表格头部过滤条件tab删除方法
    filterTagCloseFun(tab, index) {
      console.log("tab", tab, "index", index);
      if (tab.condition === "mstate") {
        // 媒体状态
        this.mState = "";
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
      this.setpageNumAndTableData();
      this.getAdList();
    },
    // 判断是否存在该条件的tag
    isHaveThisTag(letter, tagName) {
      console.log("letter", letter, "tagName", tagName);
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
        console.log("切换媒体状态", state, this.mState);
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
        this.setpageNumAndTableData();
        this.getAdList();
      } else {
        sessFun.messageFun("warning", "被占查询状态下，无效切换!");
      }
    },
    // 媒体等级过滤
    gradeChange(data) {
      console.log("媒体等级过滤", data);
      this.isHaveThisTag("grade", data + "级");
      this.getAdsParamsData.grade = this.activeGrade;
      this.setpageNumAndTableData();
      this.getAdList();
    },
    // 广告限制切换
    activeADLimit(limit) {
      console.log("广告限制limit", limit); // 保险,恶俗医疗
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
      this.setpageNumAndTableData();
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
        this.setpageNumAndTableData();
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
        this.setpageNumAndTableData();
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
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    // 楼盘类型过滤
    tableHeaderFilter_cType(data) {
      console.log("楼盘类型过滤", data);
      this.isHaveThisTag("cType", data);
      if (data === "全部") {
        this.getAdsParamsData.buildType = "";
      } else {
        this.getAdsParamsData.buildType = this.buildValue;
      }
      this.setpageNumAndTableData();
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
        this.setpageNumAndTableData();
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
        this.setpageNumAndTableData();
        this.getAdList();
      }
    },
    // 车位数过滤
    tableHeaderFilterByParkSpaceNum() {
      if (this.parkSpaceNum[0] == "" || this.parkSpaceNum[1] == "") {
        sessFun.messageFun("warning", "数据区间填写有误");
      } else {
        let tagName =
          "车位数:" + this.parkSpaceNum[0] + "-" + this.parkSpaceNum[1];
        this.isHaveThisTag("parkSpaceNum", tagName);
        this.filterData.pSNum = true;
        this.getAdsParamsData.parkSpaceNumMin = this.parkSpaceNum[0];
        this.getAdsParamsData.parkSpaceNumMax = this.parkSpaceNum[1];
        this.setpageNumAndTableData();
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
      console.log("judgeByselect");
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
      console.log(this.IsAll, this.currPageSelect, this.currPageAsLength);
    },
    // planList的勾选
    // TODO:planList的勾选
    hadADByshop(data) {
      let shopAD = data;
      if (this.activeRName === shopAD.city) {
        for (let key of this.planList) {
          if (key.resID === shopAD.resID) {
            let crossIf = this.crossschedule(shopAD.schedule);
            if (crossIf) {
              key.checkBox = true;
              this.currPageSelect++;
              break;
            } else {
              console.log("排期无交叉且不相等");
            }
          }
        }
      } else {
        console.log("不同城市");
      }
    },
    // // 重置planList的勾选
    // resetPlanList() {
    //   console.log("重置planList的勾选开始");
    //   for (let i = 0; i < this.planList.length; i++) {
    //     if (
    //       this.planList[i].checkBox.A ||
    //       this.planList[i].checkBox.B ||
    //       this.planList[i].checkBox.ABC
    //     ) {
    //       console.log("有勾选");
    //       this.planList[i].checkBox.A = false;
    //       this.planList[i].checkBox.B = false;
    //       this.planList[i].checkBox.ABC = false;
    //       // this.$refs.multipleTable.toggleRowSelection(this.planList[i], false)
    //     } else {
    //       console.log("无勾选");
    //     }
    //   }
    //   console.log("重置planList的勾选结束");
    // },

    // 区选重置planList的勾选
    resetPlanList() {
      console.log("重置planList的勾选开始");
      for (let i = 0; i < this.planList.length; i++) {
        if (this.planList[i].checkBox) {
          console.log("有勾选");
          this.planList[i].checkBox = false;
          // this.$refs.multipleTable.toggleRowSelection(this.planList[i], false)
        } else {
          console.log("无勾选");
        }
      }
      console.log("重置planList的勾选结束");
    },
    //点位有时间交叉
    // TODO:点位有时间交叉
    crossschedule(sche) {
      let scheArr = sche.split("-");
      if (this.dateInput[0] == scheArr[0] && this.dateInput[1] == scheArr[1]) {
        return true;
      } else if (
        this.dateInput[0] < scheArr[0] &&
        this.dateInput[1] >= scheArr[0]
      ) {
        return true;
      } else if (
        this.dateInput[0] > scheArr[0] &&
        this.dateInput[0] < scheArr[1]
      ) {
        return true;
      } else if (
        this.dateInput[1] > scheArr[0] &&
        this.dateInput[1] < scheArr[1]
      ) {
        return true;
      } else if (
        this.dateInput[0] <= scheArr[1] &&
        this.dateInput[1] > scheArr[1]
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 表头全选
    //TODO:表头全选
    allCheckboxAds() {
      console.log("allCheckboxAds", this.IsAll);
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
      console.log("全选");

      if (this.mediaType === "广告门") {
        this.allSelectToShop_adDoor();
      } else if (this.mediaType === "道闸") {
        this.allSelectToShop_roadGate();
      }
      this.shopShow_hide("all");
      // this.allSelectToShop(selection)
    },
    //取消全选
    //TODO取消全选
    cancleSelectAds() {
      console.log("取消全选", this.planList);
      let arr1 = []; //收集被删除的项
      let arr2 = [...this.shopingList]; //拷贝购物车
      for (let pkey of this.planList) {
        if (pkey.checkBox) {
          for (let i = 0; i < arr2.length; i++) {
            if (pkey.resID === arr2[i].resID) {
              arr1.push(...arr2.splice(i, 1));
              pkey.checkBox = false;
            }
          }
        }
      }
      this.handleImportDrafts(0, arr1);
      this.shopingList = arr2;
      this.currPageSelect = 0;
      // this.computeMedia_AD()
    },
    // cancleSelectAds() {
    //   console.log("取消全选", this.planList);
    //   for (let pkey of this.planList) {
    //     if (pkey.checkBox) {
    //       for (let i = 0; i < this.shopingList.length; i++) {
    //         if (pkey.resID === this.shopingList[i].resID) {
    //           if (pkey.checkBox) {
    //             this.shopingList.splice(i, 1);
    //             pkey.checkBox = false;
    //           }
    //         }
    //       }
    //     }
    //   }
    //   this.currPageSelect = 0;
    //   // this.computeMedia_AD()
    // },

    // cancleSelectAds() {
    //   console.log("取消全选", this.planList);
    //   for (let pkey of this.planList) {
    //     if (pkey.checkBox.A || pkey.checkBox.B || pkey.checkBox.ABC) {
    //       for (let i = 0; i < this.shopingList.length; ) {
    //         if (pkey.mID === this.shopingList[i].mID) {
    //           if (pkey.checkBox.A && this.shopingList[i].A_B === "A") {
    //             this.shopingList.splice(i, 1);
    //             pkey.checkBox.A = false;
    //           } else if (pkey.checkBox.B && this.shopingList[i].A_B === "B") {
    //             this.shopingList.splice(i, 1);
    //             pkey.checkBox.B = false;
    //           } else if (
    //             pkey.checkBox.ABC &&
    //             this.shopingList[i].A_B === "ABC"
    //           ) {
    //             this.shopingList.splice(i, 1);
    //             pkey.checkBox.ABC = false;
    //           } else {
    //             i++;
    //           }
    //         } else {
    //           i++;
    //         }
    //       }
    //     }
    //   }
    //   this.currPageSelect = 0;
    //   // this.computeMedia_AD()
    // },
    //获取mouseEnter屏幕时的坐标像素
    mouseEnter(row, column, cell, event) {
      let e = event || window.event;
      this.shopXY.y = e.clientY;
    },

    //新业务逻辑小区替代选AB面，勾选广告门的时候
    //TODO:勾选广告门的时候
    ChangeCommunity(row) {
      console.log("row: ", row);
      let check = row;
      if (check.checkBox) {
        this.shopShow_hide(); // 动画效果
        // this.AddShopingInfo(row, "A"); // 添加到购物车
        this.handleImportDrafts(1, [row]);
        this.AddShopingInfo(row); // 添加到购物车
      } else {
        this.IsAll = false;
        // this.deleteShopRow(check, "A"); //从购物车删除
        // this.handleImportDrafts(0, [row]);
        this.deleteShopRow(check);
      }
    },
    // 勾选道闸的时候
    changeBarrierGate(row) {
      console.log("row: ", row);
      if (row.checkBox) {
        // let obj = this.setShopingTable(row, "ABC");
        // let obj = this.setShopingTable(row);
        this.shopShow_hide();
        // this.shopingList.push(obj);
        this.handleImportDrafts(1, [row]);
        this.AddShopingInfo(row); // 添加到购物车
        // this.IsAll = true
      } else {
        this.IsAll = false;
        this.handleImportDrafts(0, [row]);
        this.deleteShopRow(row);
      }
    },
    // 选中A、B面的时候
    // changeA(row) {
    //   console.log("row: ", row);
    //   let check = row;
    //   if (check.checkBox.A) {
    //     this.shopShow_hide(); // 动画效果
    //     this.AddShopingInfo(row, "A"); // 添加到购物车
    //   } else {
    //     this.IsAll = false;
    //     this.deleteShopRow(check, "A");
    //   }
    // },
    // changeB(row) {
    //   let check = row;
    //   if (check.checkBox.B === true) {
    //     this.shopShow_hide();
    //     this.AddShopingInfo(row, "B"); // 添加到购物车
    //   } else {
    //     this.IsAll = false;
    //     this.deleteShopRow(check, "B");
    //   }
    // },
    // 道闸点位选择
    // changeABC(row) {
    //   if (row.checkBox.ABC === true) {
    //     // let obj = this.setShopingTable(row, "ABC");
    //     let obj = this.setShopingTable(row);
    //     this.shopShow_hide();
    //     this.shopingList.push(obj);
    //     // this.IsAll = true
    //   } else {
    //     this.IsAll = false;
    //     this.deleteShopRow(row, "ABC");
    //   }
    // },

    // 全选是放进购物车-广告门
    //TODO:全选
    allSelectToShop_adDoor() {
      let arr = [];
      for (let i = 0; i < this.planList.length; i++) {
        let info = this.planList[i];
        let selectInfo = this.setShopingTable(info);
        if (!info.checkBox) {
          info.checkBox = true;
          this.currPageSelect++;
          arr.push(selectInfo);
        }
      }
      this.handleImportDrafts(1, arr);
      this.shopingList.push(...arr);

      console.log("广告门全选时购物车", this.shopingList);
    },
    // 全选是放进购物车-道闸
    allSelectToShop_roadGate() {
      for (let pkey of this.planList) {
        if (!pkey.checkBox) {
          pkey.checkBox = true;
          // let selectInfo = this.setShopingTable(pkey, "ABC");
          let selectInfo = this.setShopingTable(pkey);
          this.shopingList.push(selectInfo);
        }
      }
      console.log("道闸全选时购物车", this.shopingList);
    },

    // allSelectToShop_adDoor() {
    //   for (let i = 0; i < this.planList.length; i++) {
    //     let info = this.planList[i];
    //     for (let j = 0; j < 2; j++) {
    //       // let selectInfo = this.setShopingTable(info, "");
    //       let selectInfo = this.setShopingTable(info);
    //       let asLabsArr = selectInfo.asLabs.split(",");
    //       let asIDArr = selectInfo.asIDs.split(",");
    //       if (j === 0 && !selectInfo.box.A) {
    //         if (!info.checkBox.A) {
    //           info.checkBox.A = true;
    //           selectInfo.A_B = "A";
    //           for (let n = 0; n < asLabsArr.length; n++) {
    //             if (asLabsArr[n] === "A") {
    //               // console.log('A', asIDArr[n])
    //               selectInfo.asID = asIDArr[n];
    //               break;
    //             }
    //           }
    //           this.currPageSelect++;
    //           this.shopingList.push(selectInfo);
    //         }
    //       } else if (j === 1 && !selectInfo.box.B) {
    //         if (!info.checkBox.B) {
    //           info.checkBox.B = true;
    //           selectInfo.A_B = "B";
    //           for (let n = 0; n < asLabsArr.length; n++) {
    //             if (asLabsArr[n] === "B") {
    //               // console.log('B', asIDArr[n])
    //               selectInfo.asID = asIDArr[n];
    //               break;
    //             }
    //           }
    //           this.currPageSelect++;
    //           this.shopingList.push(selectInfo);
    //         }
    //       }
    //     }
    //   }

    //   console.log("广告门全选时购物车", this.shopingList);
    // },

    // 全选是放进购物车-道闸
    // allSelectToShop_roadGate() {
    //   for (let pkey of this.planList) {
    //     if (!pkey.checkBox.ABC) {
    //       pkey.checkBox.ABC = true;
    //       // let selectInfo = this.setShopingTable(pkey, "ABC");
    //       let selectInfo = this.setShopingTable(pkey);
    //       this.shopingList.push(selectInfo);
    //     }
    //   }
    //   console.log("道闸全选时购物车", this.shopingList);
    // },
    // 取消勾时,删除购物车里对应的数据行
    //TODO:取消勾时,删除购物车里对应的数据行
    deleteShopRow(row) {
      this.currPageSelect--;
      let delArr = [];
      let copyArr = [...this.shopingList];
      for (let j = 0; j < copyArr.length; j++) {
        if (copyArr[j].resID === row.resID) {
          let crossIf = this.crossschedule(copyArr[j].schedule);
          if (crossIf) {
            delArr.push(...copyArr.splice(j, 1));
            break;
          } else {
            console.log("购物车中不存在相同点位");
          }
        }
      }
      this.handleImportDrafts(0, delArr);
      this.shopingList = copyArr;
      this.allCheckboxUpdata();
    },
    // deleteShopRow(row) {
    //   this.currPageSelect--;
    //   for (let j = 0; j < this.shopingList.length; j++) {
    //     if (this.shopingList[j].resID === row.resID) {
    //       let crossIf = this.crossschedule(this.shopingList[j].schedule);
    //       if (crossIf) {
    //         this.shopingList.splice(j, 1);
    //         break;
    //       } else {
    //         console.log("购物车中不存在相同点位");
    //       }
    //     }
    //   }

    //   this.allCheckboxUpdata();
    // },
    // 购物车-获取地图选择的点位列表
    // TODO购物车-获取地图选择的点位列表
    getMapADList() {
      console.log("触发获取地图选点信息click");
      // 亲邻地图
      this.getMapLoading = this.$loading({
        lock: true,
        text: "数据获取中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let params = {
        asrIDs: this.FAInfo.asrIDs,
        suID: this.FAInfo.suID,
        apID: this.FAInfo.apID, //意向方案id
      };
      api
        .postApi_json(this.apiVar.mapApi + "/proposal/resListByUid", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.mapAdsList = res.data.data;
            sessFun.messageFun(
              "success",
              `成功获取到${this.mapAdsList.length}条数据`
            );
            this.setMapAdsListInShopCar();
            // localStorage.removeItem("qinlinMapCode");
            this.mapBtn = true;
          } else {
            this.getMapLoading.close();
            sessFun.messageFun("warning", res.data.MSG || "数据获取异常");
          }
        })
        .catch((err) => {
          this.getMapLoading.close();
          sessFun.messageFun("warning", "数据接口异常");
        });
      // } else {
      //     this.getMapLoading.close();
      //     sessFun.messageFun('warning','请在地图选择社区并提交')
      // }
    },
    // 根据地图选点返回的数据，设置成购物车所需的数据格式（无忧地图）
    // 判断点位是否已存在购物车（无忧地图）
    judgeHaveDiffAD(data, SourceType) {
      let ADData = data;
      let shopArr = this.shopingList;
      let ifBoolea = true;
      if (shopArr.length !== 0) {
        for (let i = 0; i < shopArr.length; i++) {
          if (ADData.mID === shopArr[i].mID && ADData.A_B === shopArr[i].A_B) {
            console.log("相同mid,相同面", ADData);
            let ADScheArr = ADData.schedule.split("-");
            let shopScheArr = shopArr[i].schedule.split("-");
            // 全等
            if (
              ADScheArr[0] == shopScheArr[0] &&
              ADScheArr[1] == shopScheArr[1]
            ) {
              if (SourceType === "mapAds") {
                let centerName = "";
                if (
                  ADData.reference !== "-" &&
                  ADData.reference !== "" &&
                  ADData.reference !== undefined &&
                  ADData.reference !== null
                ) {
                  for (let key of ADData.reference) {
                    let keyCenter = key.name + "-" + key.address;
                    if (!shopArr[i].mapCenter.includes(keyCenter)) {
                      centerName += keyCenter + ",";
                    }
                  }
                }
                if (shopArr[i].mapCenter !== "") {
                  shopArr[i].mapCenter = shopArr[i].mapCenter + centerName;
                } else {
                  console.log("mapCenter为空");
                  shopArr[i].mapCenter = centerName;
                }
              }
              ifBoolea = false;
              break;
              // 左相交
            } else if (
              ADScheArr[0] < shopScheArr[0] &&
              ADScheArr[1] >= shopScheArr[0] &&
              ADScheArr[1] <= shopScheArr[1]
            ) {
              ifBoolea = false;
              break;
              // 被包含
            } else if (
              ADScheArr[0] >= shopScheArr[0] &&
              ADScheArr[1] <= shopScheArr[1]
            ) {
              ifBoolea = false;
              break;
              // 右相交
            } else if (
              ADScheArr[0] >= shopScheArr[0] &&
              ADScheArr[0] <= shopScheArr[1] &&
              ADScheArr[1] > shopScheArr[1]
            ) {
              ifBoolea = false;
              break;
              // 包含
            } else if (
              ADScheArr[0] < shopScheArr[0] &&
              ADScheArr[1] > shopScheArr[1]
            ) {
              ifBoolea = false;
              break;
            } else {
              console.log("else");
              ifBoolea = true;
            }
          }
        }
      } else {
        return ifBoolea;
      }
      return ifBoolea;
    },
    //Promise存储草稿
    changeApInfoPromise() {
      this.mapLock = false
      this.importDraftsConfig.suID = this.BDData.uid;
      this.importDraftsConfig.type = this.importDraftsType;
      this.importDraftsConfig.resList = JSON.stringify(this.importDraftsList);
      for (let i in this.importDraftsConfig == "") {
        if (!this.importDraftsConfig[i]) {
          delete this.importDraftsConfig[i];
        }
      }
      let params = {
        apID: this.FAInfo.apID,
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        ...this.importDraftsConfig,
      };
        api.postApi(this.apiVar.CreateAdBackUp, params).then((response) => {
          if (response.data.SysCode == 200200) {
            let draftsData = response.data.data
              draftsData.forEach((item) => {
              item.checkBox = false;
              item.city = item.cityName;
      });
              //this.draftsData已经是后台最新缓存，
              //如果shopingList长度发生变化又会触发购物车
              //这里将发送给购物车的数据清空
              this.handleImportDrafts(1, []);
              this.shopingList = draftsData;
              if (this.getMapLoading) {
                this.getMapLoading.close();
              }
              this.dialogTableVisible = true;
              this.computeMedia_AD();
              this.judgeByselect();
              this.mapLock = true
          } else {
            return resolve([]);
          }
        // .catch(function (error) {
        //   resolve("");
        // });
      });
    },
    // 根据地图选点返回的数据，设置成购物车所需的数据格式（亲邻地图）
    setMapAdsListInShopCar() {
      let mapAdsList = this.mapAdsList.length ? this.mapAdsList : []; // tempData
      this.handleImportDrafts(1, mapAdsList);
      this.changeApInfoPromise();
    },
    // 判断点位是否已存在购物车（亲邻地图）
    qinLinJudgeHaveDiffAD(data, SourceType) {
      let ADData = data;
      let shopArr = this.shopingList;
      let ifBoolea = true;
      if (shopArr.length !== 0) {
        for (let i = 0; i < shopArr.length; i++) {
          if (ADData.mID === shopArr[i].mID && ADData.A_B === shopArr[i].A_B) {
            console.log("相同mid,相同面", ADData);
            let ADScheArr = ADData.schedule.split("-");
            let shopScheArr = shopArr[i].schedule.split("-");
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
              ADScheArr[0] < shopScheArr[0] &&
              ADScheArr[1] >= shopScheArr[0] &&
              ADScheArr[1] <= shopScheArr[1]
            ) {
              ifBoolea = false;
              break;
              // 被包含
            } else if (
              ADScheArr[0] >= shopScheArr[0] &&
              ADScheArr[1] <= shopScheArr[1]
            ) {
              ifBoolea = false;
              break;
              // 右相交
            } else if (
              ADScheArr[0] >= shopScheArr[0] &&
              ADScheArr[0] <= shopScheArr[1] &&
              ADScheArr[1] > shopScheArr[1]
            ) {
              ifBoolea = false;
              break;
              // 包含
            } else if (
              ADScheArr[0] < shopScheArr[0] &&
              ADScheArr[1] > shopScheArr[1]
            ) {
              ifBoolea = false;
              break;
            } else {
              console.log("else");
              ifBoolea = true;
            }
          }
        }
      } else {
        return ifBoolea;
      }
      return ifBoolea;
    },
    // 统计购物车媒体数、面数
    computeMedia_AD() {
      this.shopMedia_ADNum.total = this.shopingList.length;
      this.shopMedia_ADNum.oneNum = this.getResAsidNum(1, this.shopingList);
      this.shopMedia_ADNum.twoNum = this.getResAsidNum(2, this.shopingList);
      this.shopMedia_ADNum.threeNum = this.getResAsidNum(3, this.shopingList);
      this.shopMedia_ADNum.moreNum =
        this.shopingList.length -
        this.shopMedia_ADNum.oneNum -
        this.shopMedia_ADNum.twoNum -
        this.shopMedia_ADNum.threeNum;
    },
    getResAsidNum(num, arr) {
      return arr.filter((item) => {
        return item.planAdsCnt == num;
      }).length;
      // return result.length;
    },
    // dialog购物筐的显示全选中后添加都购物车
    dialogVisible() {
      this.dialogTableVisible = true;
      this.computeMedia_AD(); // 统计媒体数量和媒体面数
      // this.eventType = "";
      // this.typeShopList = this.getTypeList();
      // this.handleClick();
    },
    // 组合typeShopList
    getTypeList() {
      console.log("--------", this.shopingList);
      let arr = [
        {
          type: 1,
          mVehicle: "广告门",
          asidList: [],
        },
        {
          type: 2,
          mVehicle: "道闸",
          asidList: [],
        },
      ];
      let type1 = [];
      let type2 = [];
      for (let data of this.shopingList) {
        if (data.mVehicle == "广告门") {
          type1.push(data);
        } else if (data.mVehicle == "道闸") {
          type2.push(data);
        }
      }
      console.log("type1------", type1);
      arr[0].asidList = type1;
      arr[1].asidList = type2;
      return arr;
    },
    // 切换tab
    // handleClick() {
    //   console.log("this.activeName----", this.activeName, this.typeShopList);
    //   this.eventType = "";
    //   this.getShowList();
    //   this.getEventList();
    //   this.computeMedia_AD();
    // },
    // 设置购物车表格数据
    getShowList() {
      let currTab = this.activeName;
      let arr = this.typeShopList[currTab - 1].asidList;
      this.shopShowList = arr;
    },
    // 获取事件
    getEventList() {
      let arr = [
        {
          label: "移除被占点位",
          value: 1,
        },
        // {
        //     label: '移除非客户的选点',
        //     value: 2,
        // },
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
      let currTab = this.activeName;
      if (currTab == 1) {
        let temp = [
          {
            label: "移除同行已选点位",
            value: 4,
          },
          {
            label: "移除同媒体A面",
            value: 7,
          },
          {
            label: "移除同媒体B面",
            value: 8,
          },
        ];
        arr = arr.concat(temp);
      } else if (currTab == 2) {
        arr = arr;
      }
      arr.sort((a, b) => {
        return a.value - b.value;
      });
      this.eventList = arr;
    },
    // 事件选择
    // changeEvent(val) {
    //   console.log("val", val);
    //   if (this.shopShowList.length) {
    //     switch (val) {
    //       case 1:
    //         this.clearADLock();
    //         this.MtaStatFun(
    //           "a004_b008_c001_d001_bt063_ck04",
    //           "a004_b008_c001_d002_bt078_ck04"
    //         );
    //         break;
    //       case 3:
    //         this.removeCommentIndustryAds("res");
    //         this.MtaStatFun(
    //           "a004_b008_c001_d001_bt065_ck04",
    //           "a004_b008_c001_d002_bt080_ck04"
    //         );
    //         break;
    //       case 4:
    //         this.removeCommentIndustryAds("media");
    //         this.MtaStatFun(
    //           "a004_b008_c001_d001_bt066_ck04",
    //           "a004_b008_c001_d002_bt081_ck04"
    //         );
    //         break;
    //       case 5:
    //         this.containNuminRes(1);
    //         this.MtaStatFun(
    //           "a004_b008_c001_d001_bt067_ck04",
    //           "a004_b008_c001_d002_bt082_ck04"
    //         );
    //         break;
    //       case 6:
    //         this.containNuminRes(2);
    //         this.MtaStatFun(
    //           "a004_b008_c001_d001_bt068_ck04",
    //           "a004_b008_c001_d002_bt083_ck04"
    //         );
    //         break;
    //       case 7:
    //         this.removeAllType("A");
    //         this.MtaStatFun(
    //           "a004_b008_c001_d001_bt069_ck04",
    //           "a004_b008_c001_d002_bt084_ck04"
    //         );
    //         break;
    //       case 8:
    //         this.removeAllType("B");
    //         this.MtaStatFun(
    //           "a004_b008_c001_d001_bt070_ck04",
    //           "a004_b008_c001_d002_bt085_ck04"
    //         );
    //         break;
    //     }
    //   } else {
    //     let active = this.activeName;
    //     sessFun.messageFun(
    //       "warning",
    //       `没有${active == "1" ? "广告门" : "道闸"}数据`
    //     );
    //   }
    // },
    // 清空被占的点位
    // clearADLock() {
    //   //this.shopingList
    //   this.$confirm("移除所有被占点位!", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     showClose: false,
    //     type: "warning ",
    //   })
    //     .then(() => {
    //       let list = this.shopingList;
    //       let haveADLock = false;
    //       for (let i = 0; i < list.length; ) {
    //         if (list[i].lState !== undefined && list[i].lState.length > 0) {
    //           list.splice(i, 1);
    //           haveADLock = true;
    //         } else {
    //           i++;
    //         }
    //       }
    //       this.typeShopList = this.getTypeList();
    //       this.getShowList();

    //       if (haveADLock) {
    //         sessFun.messageFun("success", "移除成功");
    //         this.computeMedia_AD();
    //       } else {
    //         sessFun.messageFun("warning", "暂无被占点位");
    //       }
    //     })
    //     .catch(() => {
    //       this.eventType = "";
    //       sessFun.messageFun("info", "取消成功");
    //     });
    //   // this.ADLockNum = 0
    //   this.resetPlanList();
    // },
    // 同资源保留个数
    // containNuminRes(num) {
    //   let resultArr = this.funToArr(this.shopShowList, "resID");
    //   resultArr = this.resRandomNum(resultArr, num);
    //   let len = this.shopShowList.length;
    //   if (resultArr.length) {
    //     this.getResultData(resultArr);
    //     if (len != resultArr.length) {
    //       sessFun.messageFun("success", `成功保留同资源${num}个点位！`);
    //     } else {
    //       sessFun.messageFun("warning", "暂无同资源可移除的点位！");
    //     }
    //     this.computeMedia_AD();
    //     this.resetPlanList();
    //     this.judgeByselect();
    //   } else {
    //     sessFun.messageFun("warning", "暂无同资源可移除的点位！");
    //   }
    // },
    // 随机保留num个数点位
    // resRandomNum(arr, num) {
    //   let result = [];
    //   for (let data of arr) {
    //     if (num > 1) {
    //       let randomArr = [];
    //       let max = data.asidList.length;
    //       if (num >= max) {
    //         result = result.concat(data.asidList);
    //       } else {
    //         randomArr = this.randomFun([], num, data.asidList.length);
    //         for (let item of randomArr) {
    //           result.push(data.asidList[item]);
    //         }
    //       }
    //     } else {
    //       let randomNum = parseInt(Math.random() * data.asidList.length, 10);
    //       result.push(data.asidList[randomNum]);
    //     }
    //   }
    //   return result;
    // },
    // 递归获取不同的随机数
    // randomFun(arr, num, max) {
    //   if (arr.length < num) {
    //     let randomNum = parseInt(Math.random() * max, 10);
    //     if (!arr.includes(randomNum)) {
    //       arr.push(randomNum);
    //     }
    //     return this.randomFun(arr, num, max);
    //   } else {
    //     return arr;
    //   }
    // },
    // 分组数据
    // funToArr(arr, condition) {
    //   let resultArr = arr.reduce((groups, item) => {
    //     let groupFound = groups.find(
    //       (arrItem) => item[condition] === arrItem[condition]
    //     );
    //     if (groupFound) {
    //       if (
    //         !JSON.stringify(groupFound.asidList).includes(JSON.stringify(item))
    //       ) {
    //         //去重
    //         groupFound.asidList.push(item);
    //       }
    //     } else {
    //       //不要直接在原来的对象修改，新建对象
    //       let newGroup = {
    //         [condition]: item[condition],
    //         asidList: [item],
    //       };
    //       groups.push(newGroup);
    //     }
    //     return groups;
    //   }, []);
    //   return resultArr;
    // },
    // 移除A/B面
    // removeAllType(type) {
    //   let resultArr = this.funToArr(this.shopShowList, "mID");
    //   console.log("resultArr------------das---", resultArr);
    //   let len = this.shopShowList.length;
    //   if (resultArr.length > 0) {
    //     resultArr = this.isEnoughMedia(type, resultArr);
    //     this.getResultData(resultArr);
    //     if (len != resultArr.length) {
    //       sessFun.messageFun("success", `成功移除同门${type}面的点位！`);
    //     } else {
    //       sessFun.messageFun("warning", "暂无可移除点位");
    //     }
    //     this.computeMedia_AD();
    //     this.resetPlanList();
    //     this.judgeByselect();
    //   } else {
    //     sessFun.messageFun("warning", "暂无可移除点位！");
    //   }
    // },
    // 同一媒体是否有a/b面
    // isEnoughMedia(type, arr) {
    //   let resultArr = [];
    //   for (let data of arr) {
    //     let result = [];
    //     if (data.asidList.length > 1) {
    //       result = data.asidList.filter((item) => {
    //         return item.A_B != type;
    //       });
    //     } else {
    //       result = data.asidList;
    //     }
    //     resultArr = resultArr.concat(result);
    //   }
    //   return resultArr;
    // },
    getResultData(resultArr) {
      let other = [];
      for (let data of this.typeShopList) {
        if (this.activeName != data.type) {
          other = other.concat(data.asidList);
        } else {
          data.asidList = resultArr;
        }
      }
      this.shopingList = other.concat(resultArr);
      this.shopShowList = resultArr;
    },
    // 当前行是否高亮
    // tableRowClassName({ row }) {
    //   if (row.lState !== undefined && row.lState.length > 0) {
    //     return "warning-row";
    //   } else if (
    //     row.connData.connectResName !== "" ||
    //     row.connData.commentWorkRes !== "" ||
    //     row.connData.connectMedia !== ""
    //   ) {
    //     return "warning-row-conncet";
    //   } else {
    //     return "";
    //   }
    // },

    // 打开购物车则计算连排门信息
    // computeConnectAdData() {
    //   let date1 = new Date();
    //   let shopData = this.shopingList;
    //   let shopDataLength = shopData.length;
    //   for (let i = 0; i < shopDataLength; i++) {
    //     //连排门设置
    //     if (i < shopDataLength - 1) {
    //       for (let j = i + 1; j < shopDataLength; j++) {
    //         if (
    //           shopData[i].connID !== "" &&
    //           shopData[i].mID !== shopData[j].mID &&
    //           shopData[i].connID === shopData[j].connID
    //         ) {
    //           if (shopData[i].connData.connectResName === "") {
    //             shopData[i].connData.connectResName = shopData[i].resName;
    //             shopData[i].connData.connectMedia =
    //               shopData[i].mediaName + "、" + shopData[j].mediaName;
    //           } else {
    //             if (
    //               !shopData[i].connData.connectMedia.includes(
    //                 shopData[j].mediaName
    //               )
    //             ) {
    //               shopData[i].connData.connectMedia +=
    //                 "、" + shopData[j].mediaName;
    //             }
    //           }
    //           shopData[j].connData.connectResName =
    //             shopData[i].connData.connectResName;
    //           shopData[j].connData.connectMedia =
    //             shopData[i].connData.connectMedia;
    //         }
    //       }
    //     }
    //     //同行业点位回避
    //     if (
    //       shopData[i].industryInfos !== null &&
    //       shopData[i].industryInfos.length > 0
    //     ) {
    //       let commentWorkArr = shopData[i].industryInfos;
    //       for (let key of commentWorkArr) {
    //         if (this.industryID === key.piID) {
    //           console.log("1");
    //           if (shopData[i].connData.commentWorkRes === "") {
    //             shopData[i].connData.commentWorkRes = key.piName;
    //           } else {
    //             if (!shopData[i].connData.commentWorkRes.includes(key.piName)) {
    //               shopData[i].connData.commentWorkRes += "、" + key.piName;
    //             }
    //           }
    //           if (shopData[i].mID == key.mID) {
    //             if (shopData[i].connData.commentworkMedia === "") {
    //               shopData[i].connData.commentworkMedia = key.piName;
    //             } else {
    //               if (
    //                 !shopData[i].connData.commentworkMedia.includes(key.piName)
    //               ) {
    //                 shopData[i].connData.commentworkMedia += "、" + key.piName;
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    //   let date2 = new Date();
    //   let haomiao = date2.getTime() - date1.getTime();
    //   console.log(
    //     "打开购物车则计算连排门信息",
    //     this.shopingList,
    //     haomiao / (1000 * 60)
    //   );
    // },
    // 重置购物车连排门信息
    // resetConnectAdData() {
    //   for (let key of this.shopingList) {
    //     if (key.connData) {
    //       key.connData = {
    //         connectResName: "",
    //         connectMedia: "",
    //         commentWorkRes: "",
    //         commentworkMedia: "",
    //       };
    //     }
    //   }
    // },
    // 购物车行被点击
    // shopRowClick(row, event, column) {
    //   console.log("购物车行被点击row", row, column);
    //   if (row.lState !== undefined && row.lState.length > 0) {
    //     let dataArr = row.lState;
    //     console.log("row.asID", row.asID);
    //     let arr = [];
    //     for (let key of dataArr) {
    //       let star = timeFormat.toDate(key.lStar, "/");
    //       let end = timeFormat.toDate(key.lEnd, "/");
    //       arr.push({
    //         beOccupieApName: key.apName,
    //         schedule: star + "-" + end,
    //         lState: key.lState,
    //       });
    //     }
    //     this.beOccupiedAdsData = arr;
    //     console.log("this.beOccupiedAdsData", this.beOccupiedAdsData);
    //     if (!this.shopDelRowClick) {
    //       this.beOccupiedDialogVisible = true;
    //     } else {
    //       this.shopDelRowClick = false;
    //     }
    //   } else if (
    //     row.connData.connectResName !== "" ||
    //     row.connData.commentWorkRes !== "" ||
    //     row.connData.connectMedia !== ""
    //   ) {
    //     this.ActiveConnectADList = row.connData;
    //     console.log("this.ActiveConnectADList", this.ActiveConnectADList);
    //     this.connectAdDialogVisible = true;
    //   }
    // },
    // 添加到购物车
    AddShopingInfo(info) {
      console.log("选中的row信息", info);
      this.currPageSelect++;
      // let selectInfo = this.setShopingTable(info, letter);
      let selectInfo = this.setShopingTable(info);
      // let asLabsArr = selectInfo.asLabs.split(",");
      // let asIDArr = selectInfo.asIDs.split(",");
      // if (letter == "B") {
      //   for (let n = 0; n < asLabsArr.length; n++) {
      //     if (asLabsArr[n] === "B") {
      //       console.log("B", asIDArr[n]);
      //       selectInfo.asID = asIDArr[n];
      //       break;
      //     }
      //   }
      //   this.shopingList.push(selectInfo);
      // } else if (letter == "A") {
      //   for (let n = 0; n < asLabsArr.length; n++) {
      //     if (asLabsArr[n] === "A") {
      //       console.log("A", asIDArr[n]);
      //       selectInfo.asID = asIDArr[n];
      //       break;
      //     }
      //   }
      //   this.shopingList.push(selectInfo);
      // }
      this.shopingList.push(selectInfo);
      console.log("this.shopingList: ", this.shopingList);
      if (this.currPageSelect == this.currPageAsLength) {
        this.IsAll = true;
      } else {
        this.IsAll = false;
      }
      // this.IsAll = true
      console.log(
        "shopingList",
        this.shopingList,
        this.currPageSelect,
        this.currPageAsLength
      );
    },
    // 选点列表数据到购物车数据
    setShopingTable(info) {
      console.log("info: ", info);
      let selectInfo = info;
      return selectInfo;
    },

    // setShopingTable(info) {
    //   let selectInfo = {
    //     rid: info.rid,
    //     mID: info.mID,
    //     mVehicle: info.mVehicle,
    //     asID: info.asIDs, //.split(','),
    //     asIDs: info.asIDs,
    //     asLabs: info.asLabs,
    //     resName: info.resName,
    //     resID: info.resID,
    //     city: info.city,
    //     origin: info.origin,
    //     buildType: info.buildType,
    //     houseNum: info.houseNum,
    //     buildPrice: info.buildPrice,
    //     mediaName: info.mediaName,
    //     mediaRemark: info.mediaRemark,
    //     buildNum: info.buildNum,
    //     schedule: info.schedule,
    //     remark: info.remark || "--", // 巡点定制
    //     trafficState: info.trafficState || "--", // 定制巡点
    //     electrifyState: info.electrifyState || "--", // 定制巡点
    //     tradingArea: info.tradingArea,
    //     assetTag: info.assetTag,
    //     liveYear: info.liveYear,
    //     adLimit: info.adLimit,
    //     mapCenter: info.reference || "", // 地图中心点
    //     address: info.address || "",
    //     dNum: info.dNum || "", // 出入口数
    //     // A_B: letter,
    //     // A_B: letter,
    //     // checkBox: {
    //     //   A: info.checkBox.A,
    //     //   B: info.checkBox.B,
    //     //   ABC: info.checkBox.ABC,
    //     // },
    //     checkBox: info.checkBox,
    //     // box: {
    //     //   A: info.box.A !== undefined ? info.box.A : false,
    //     //   B: info.box.B !== undefined ? info.box.B : false,
    //     // },
    //     box: info.box !== undefined ? info.box : false,
    //     connData: {
    //       connectResName: "",
    //       connectMedia: "",
    //       commentWorkRes: "",
    //       commentworkMedia: "",
    //     },
    //     connID: info.connID, // 连排门id
    //     industryInfos: info.industryInfos, // 同行业资源回避
    //     adPrice: info.adPrice, // 点位价格
    //     mediaLevel: info.mediaLevel, // 媒体等级
    //     asrID: info.asrID, // 所属公司id
    //     asName: info.asName, // 所属公司名称
    //   };
    //   return selectInfo;
    // },
    // // 自定义购物车表头-清空
    // renderHeader(h, { column }) {
    //   // console.log('********h*******',h,column)
    //   return h(
    //     "span",
    //     {
    //       class: "clearShopping",
    //       on: {
    //         click: () => {
    //           // console.log('**************123')
    //           this.clearShop();
    //           // （广告门，道闸）
    //           this.MtaStatFun(
    //             "a004_b008_c001_d001_bt059_ck04",
    //             "a004_b008_c001_d002_bt074_ck04"
    //           );
    //         },
    //       },
    //     },
    //     [h("span", "清空")]
    //   );
    // },
    // // 购物车删除行
    // deleteRow(rows) {
    //   console.log("购物车删除行", rows);
    //   console.log("删除行id", rows.mID);
    //   if (this.planList.length > 0 && rows.city === this.planList[0].city) {
    //     for (let i = 0; i < this.planList.length; i++) {
    //       if (rows.mID === this.planList[i].mID) {
    //         if (rows.A_B === "A") {
    //           this.planList[i].checkBox.A = false;
    //         } else if (rows.A_B === "B") {
    //           this.planList[i].checkBox.B = false;
    //         } else if (rows.A_B === "ABC") {
    //           this.planList[i].checkBox.ABC = false;
    //         }
    //       }
    //     }
    //   }
    //   for (let j = 0; j < this.shopingList.length; ) {
    //     if (
    //       this.shopingList[j].mID === rows.mID &&
    //       this.shopingList[j].A_B == rows.A_B &&
    //       this.shopingList[j].schedule === rows.schedule
    //     ) {
    //       this.shopingList.splice(j, 1);
    //       break;
    //     } else {
    //       j++;
    //     }
    //   }

    //   this.typeShopList = this.getTypeList();
    //   this.getShowList();
    //   this.computeMedia_AD();
    //   this.allCheckboxUpdata();
    //   event.stopPropagation();
    // },
    //修改动画效果及显示隐藏
    shopShow_hide(all) {
      let R = this.shopXY.x;
      let T = this.shopXY.y;
      console.log("Right:", R, ",Top:", T);
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
    //行被点击 beOccupiedGetList timeFormat
    // rowClick(row, event, column) {
    //   console.log("row", row, event, column);
    //   if (!this.isOccupied) {
    //     let star = timeFormat.toDate(row.lStar, "/");
    //     let end = timeFormat.toDate(row.lEnd, "/");
    //     let arr = [];
    //     arr.push({
    //       beOccupieApName: row.apName,
    //       schedule: star + "-" + end,
    //       lState: row.lState,
    //     });
    //     this.beOccupiedAdsData = arr;
    //     this.beOccupiedDialogVisible = true;
    //   }
    // },
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
    getAsNameByShopingList() {
      let asrIDs = [];
      let isHad = false;
      for (let sKey of this.shopingList) {
        isHad = true;
        for (let aKey of asrIDs) {
          if (aKey.asrID == sKey.asrID && aKey.rid == sKey.rid) {
            isHad = false;
            break;
          } else {
            isHad = true;
          }
        }
        if (isHad) {
          asrIDs.push({
            asrID: sKey.asrID,
            asName: sKey.asName,
            rid: sKey.rid,
            city: sKey.city,
          });
        }
      }
      console.log("统计购物车中存在了几个公司及城市asrIDs", asrIDs);
      this.asrIDList = asrIDs.concat();
    },
    // 创建报价单结构
    creatTab() {
      let quotationArr = [];
      for (let key of this.asrIDList) {
        let quotationObj = {
          city: key.city,
          rid: key.rid,
          asrID: key.asrID,
          asName: key.asName,
          priceMsg: {
            adDoor: {
              schedule: [], // 排期
              GMDate: 0, // 赠送面.天
              LevelGMDate: { A: 0, B: 0, C: 0 }, // 赠送面.天
              discount: "100", // 广告费折扣
              advertyPrice: 0, // 广告费
              ADNumber: 0, // 广告画数量
              makeDiscount: "100", // 制作费折扣
              MPrice: 100.0, // 制作费单价
              reaPrice: 0, // 广告费每次修改前的价格
              oldPrice: 0, //  广告费初始价格
              MReaPrice: 0, // 制作费原价
              makePrice: 0, // 制作费
              ADPrice: 0, // 刊例价(面/周)
              tfl: 0, //投放量
              cash: 0, // 现金结算
              zyzh: 0, // 资源置换
              other: 0, // 其他费用
              total: 0,
              remark: "", //备注信息
            },
            roadGate: {
              schedule: [], // 排期
              GMDate: 0, // 赠送面.天
              discount: "100", // 广告费折扣
              advertyPrice: 0, // 广告费
              ADNumber: 0, // 广告画数量
              makeDiscount: "100", // 制作费折扣
              MPrice: 300.0, // 制作费单价
              reaPrice: 0, // 广告费每次修改前的价格
              oldPrice: 0, //  广告费初始价格
              MReaPrice: 0, // 制作费原价
              makePrice: 0, // 制作费
              ADPrice: 0, // 刊例价(面/周)
              tfl: 0, //投放量
              cash: 0, // 现金结算
              zyzh: 0, // 资源置换
              other: 0, // 其他费用
              total: 0,
            },
          },
        };
        quotationArr.push(quotationObj);
      }
      this.quotation = quotationArr;
      console.log("创建报价单", this.quotation);
      this.quotationObj = { quotation: this.quotation, isDetail: false };
    },
    //计算总价格
    computeTotal() {
      // console.log('计算总价格',this.quotation)
      this.totalPrice = 0;
      this.cash = 0;
      this.other = 0;
      this.zyzh = 0;
      for (let key of this.quotation) {
        for (let i in key.priceMsg) {
          this.totalPrice += key.priceMsg[i].total;
          this.cash = Number(this.cash) + Number(key.priceMsg[i].cash);
          this.other = Number(this.other) + Number(key.priceMsg[i].other);
          this.zyzh = Number(this.zyzh) + Number(key.priceMsg[i].zyzh);
        }
      }
      if (this.other == 0 && this.zyzh == 0) {
        this.totalPrice = this.cash;
      }
    },
    // 价格加上逗号
    priceFormat(price) {
      return commaFormat.init(price);
    },
    //设置报价单
    // APQuotationArr(...data) {
    //   console.log("回传报价单:", data); // data为包含传过来所有数据的数组，第一个元素是对象，第二个元素是字符串
    //   this.quotation = data[0];
    //   let isBool = true;
    //   for (let key of this.quotation) {
    //     console.log(key.noBoolClassified);
    //     if (key.noBoolClassified) {
    //       this.active--;
    //       isBool = false;
    //       break;
    //     }
    //   }
    //   if (isBool) {
    //     this.computeTotal();
    //   }
    // },
    // 提交前校验单城市报价单价格是否大于2000w
    vaildCityQuotation() {
      for (let key of this.quotation) {
        for (let i in key.priceMsg) {
          // console.log('提交前校验单城市报价单价格是否大于2000w',key.priceMsg[i].total)
          if (key.priceMsg[i].total > 20000000) {
            this.isCityPrice = true;
            break;
          }
        }
      }
    },
    // // 创建方案基本信息及投放城市详情(报价单数据提交)
    // creatAdPlan() {
    //   console.log("creatAdPlan", this.quotation);
    //   let arr = [];
    //   let cityArea = [];
    //   for (let key of this.quotation) {
    //     cityArea.push({
    //       asrID: key.asrID,
    //       city: key.city,
    //       rid: key.rid,
    //     });
    //     for (let i in key.priceMsg) {
    //       let minTime = "";
    //       let maxTime = "";
    //       if (
    //         key.priceMsg[i].schedule.length > 0 &&
    //         key.priceMsg[i].schedule !== "" &&
    //         key.priceMsg[i].schedule !== null
    //       ) {
    //         let timeList = key.priceMsg[i].schedule.join(",");
    //         let scheduleArr = timeFormat.returnTimeArr(timeList, ",", "-");
    //         minTime = scheduleArr[0];
    //         maxTime = scheduleArr[scheduleArr.length - 1];
    //       } else {
    //         minTime = this.dateInput[0];
    //         maxTime = this.dateInput[1];
    //       }
    //       if (this.apMinTime === "") {
    //         this.apMinTime = minTime;
    //       } else {
    //         if (this.apMinTime > minTime) {
    //           this.apMinTime = minTime;
    //         }
    //       }
    //       arr.push({
    //         pdRemark: key.priceMsg[i].remark || "",
    //         asrID: key.asrID,
    //         rID: key.rid,
    //         pdDays: key.priceMsg[i].tfl,
    //         pdFreeNum: key.priceMsg[i].GMDate, // 赠送面*天
    //         pdStar: minTime.split(".").join("-"),
    //         pdEnd: maxTime.split(".").join("-"),
    //         pdAdFee: parseInt(key.priceMsg[i].advertyPrice * 100), // 广告费用
    //         pdNum: key.priceMsg[i].ADNumber, // 点位数
    //         pdAdMake: Number((key.priceMsg[i].makePrice * 100).toFixed(0)), // 实计制作费用
    //         pdTotal: Number((key.priceMsg[i].cash * 100).toFixed(0)),
    //         pdSendFee: Number((key.priceMsg[i].zyzh * 100).toFixed(0)),
    //         pdOtherFee: Number((key.priceMsg[i].other * 100).toFixed(0)),
    //         pdType: i === "adDoor" ? 0 : 1,
    //       });
    //     }
    //   }
    //   console.log("城市详情", arr, "cityArea", cityArea);
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     apname: this.planForm.planName,
    //     adcid: this.planForm.adcID,
    //     bid: this.planForm.companyBrand,
    //     // rid: this.planForm.throwCity.join(','),
    //     suid: this.BDData.uid,
    //     saleManageLevel: this.BDData.saleManageLevel,
    //     detail: JSON.stringify(arr),
    //   };
    //   if (this.sessionData.uType === "BD") {
    //     delete params.suid;
    //   }
    //   console.log("params", params);
    //   api
    //     .postApi(this.apiVar.Advertisement + "/CreateAPDBatch", params)
    //     .then((res) => {
    //       console.log("创建方案", res);
    //       if (res.data.SysCode == 200200) {
    //         this.FAData.apID = res.data.Data[0].apID;
    //         this.PushADBFun(res.data.Data);
    //         this.CreateShareADSFun();
    //         sessionStorage.setItem("plan_apid", res.data.Data[0].apID);
    //         sessionStorage.setItem("cityArea", JSON.stringify(cityArea));
    //       } else {
    //         this.ADloading.close();
    //         sessFun.messageFun("warning", "方案创建失败");
    //       }
    //     });
    // },
    // // 提交方案选点信息 7700 6700
    // PushADBFun(data) {
    //   let ADBData = data;
    //   console.log("shopingList", this.shopingList);
    //   let cityArr = [];
    //   for (let j = 0; j < ADBData.length; j++) {
    //     let cityObj = {
    //       city: ADBData[j].city,
    //       pdID: ADBData[j].pdID,
    //       pdType: ADBData[j].pdType,
    //       asrID: ADBData[j].asrID,
    //       apID: ADBData[j].apID,
    //     };
    //     cityArr.push(cityObj);
    //   }
    //   console.log("cityArr", cityArr);
    //   let pbSetTime = this.timestampToTime(Date.parse(new Date()));
    //   console.log("当前日期时间", pbSetTime);
    //   let arr = [];
    //   for (let key of this.shopingList) {
    //     for (let cKey of cityArr) {
    //       if (key.city == cKey.city && key.asrID == cKey.asrID) {
    //         let adsInfo = {
    //           uID: this.sessionData.uID,
    //           apID: cKey.apID,
    //           asID: key.asID,
    //           pdID: cKey.pdID,
    //           pbStar: key.schedule.split("-")[0],
    //           pbEnd: key.schedule.split("-")[1],
    //           mapCenterName: key.mapCenter,
    //           resID: key.resID,
    //           pbSetTime: pbSetTime,
    //         };
    //         if (
    //           this.customPermission.pptPermission &&
    //           this.customPermission.pptPermission.gzqylPermission == "1"
    //         ) {
    //           adsInfo.recommendReason = key.recommendReason || ""; //  亲粤邻定制：推荐理由
    //         }
    //         if (cKey.pdType == 0 && key.mVehicle === "广告门") {
    //           arr.push(adsInfo);
    //         } else if (cKey.pdType == 1 && key.mVehicle === "道闸") {
    //           arr.push(adsInfo);
    //         }
    //       }
    //     }
    //   }
    //   console.log("PushADBFun的arr", arr);
    //   let postData = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     abList: arr,
    //   };
    //   api
    //     .postApi_json(
    //       this.apiVar.Advertisement +
    //         "/PushADB?uid=" +
    //         this.sessionData.uID +
    //         "&token=" +
    //         this.sessionData.token,
    //       postData
    //     )
    //     .then((res) => {
    //       console.log("PushADB提交选点", res);
    //       if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
    //         this.ADloading.close();
    //       } else {
    //         if (res.data === "" || res.data === null) {
    //           sessFun.messageFun("warning", "提交选点失败");

    //         } else {
    //           this.ADloading.close();
    //           this.active = 3;
    //           if (this.apMinTime <= this.dateTime) {
    //             sessFun.messageFun(
    //               "warning",
    //               "该方案的投放期已经开始，建议立即发布该方案！"
    //             );
    //           } else {
    //             sessFun.messageFun("success", "方案创建成功");
    //           }
    //           // 清除后台缓存
    //           let params = {
    //             uid: this.sessionData.uID,
    //             token: this.sessionData.token,
    //           };
    //           api
    //             .postApi(
    //               this.apiVar.Advertisement + "/clearAdPlanBackups",
    //               params
    //             )
    //             .then((res) => {
    //               console.log("清空缓存的方案", res);
    //               if (res.data.SysCode === 200200) {
    //                 console.log("缓存方案清除成功");
    //               } else {
    //               }
    //             });
    //           // 清除前台缓存
    //           cacheAdPlan.removeData(this.sessionData.uID);
    //         }
    //       }
    //     });
    // },
    // 创建方案基本信息及投放城市详情(报价单数据提交)
    // TODO:创建方案
    creatAdPlan() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apID: this.FAInfo.apID,
      };
      api.postApi(this.apiVar.CreatePlan, params).then((res) => {
        console.log("creatAdPlancreatAdPlanres: ", res);
        if (res.data.SysCode == 200200) {
          sessionStorage.setItem("plan_apid", res.data.data.apID);
          this.FAData.apID = res.data.data.apID;
          if (res.data.data.errorResNames) {
            this.ADloading.close();
            sessFun.messageFun("warning", "存在失败小区");
            return;
          }
          // this.PushADBFun(res.data.Data);
          // this.CreateShareADSFun();
          this.active++;
          //清除草稿箱缓存
          this.clearDrafts();
          this.ADloading.close();
          // sessionStorage.setItem("cityArea", JSON.stringify(cityArea));
        } else {
          this.ADloading.close();
          sessFun.messageFun("warning", "失败");
        }
      });
    },
    // creatAdPlan() {
    //   console.log("creatAdPlan", this.quotation);
    //   let arr = [];
    //   let cityArea = [];
    //   for (let key of this.quotation) {
    //     cityArea.push({
    //       asrID: key.asrID,
    //       city: key.city,
    //       rid: key.rid,
    //     });
    //     for (let i in key.priceMsg) {
    //       let minTime = "";
    //       let maxTime = "";
    //       if (
    //         key.priceMsg[i].schedule.length > 0 &&
    //         key.priceMsg[i].schedule !== "" &&
    //         key.priceMsg[i].schedule !== null
    //       ) {
    //         let timeList = key.priceMsg[i].schedule.join(",");
    //         let scheduleArr = timeFormat.returnTimeArr(timeList, ",", "-");
    //         minTime = scheduleArr[0];
    //         maxTime = scheduleArr[scheduleArr.length - 1];
    //       } else {
    //         minTime = this.dateInput[0];
    //         maxTime = this.dateInput[1];
    //       }
    //       if (this.apMinTime === "") {
    //         this.apMinTime = minTime;
    //       } else {
    //         if (this.apMinTime > minTime) {
    //           this.apMinTime = minTime;
    //         }
    //       }
    //       arr.push({
    //         pdRemark: key.priceMsg[i].remark || "",
    //         asrID: key.asrID,
    //         rID: key.rid,
    //         pdDays: key.priceMsg[i].tfl,
    //         pdFreeNum: key.priceMsg[i].GMDate, // 赠送面*天
    //         pdStar: minTime.split(".").join("-"),
    //         pdEnd: maxTime.split(".").join("-"),
    //         pdAdFee: parseInt(key.priceMsg[i].advertyPrice * 100), // 广告费用
    //         pdNum: key.priceMsg[i].ADNumber, // 点位数
    //         pdAdMake: Number((key.priceMsg[i].makePrice * 100).toFixed(0)), // 实计制作费用
    //         pdTotal: Number((key.priceMsg[i].cash * 100).toFixed(0)),
    //         pdSendFee: Number((key.priceMsg[i].zyzh * 100).toFixed(0)),
    //         pdOtherFee: Number((key.priceMsg[i].other * 100).toFixed(0)),
    //         pdType: i === "adDoor" ? 0 : 1,
    //       });
    //     }
    //   }
    //   console.log("城市详情", arr, "cityArea", cityArea);
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     apname: this.planForm.planName,
    //     adcid: this.planForm.adcID,
    //     bid: this.planForm.companyBrand,
    //     // rid: this.planForm.throwCity.join(','),
    //     suid: this.BDData.uid,
    //     saleManageLevel: this.BDData.saleManageLevel,
    //     detail: JSON.stringify(arr),
    //   };
    //   if (this.sessionData.uType === "BD") {
    //     delete params.suid;
    //   }
    //   console.log("params", params);
    //   api
    //     .postApi(this.apiVar.Advertisement + "/CreateAPDBatch", params)
    //     .then((res) => {
    //       console.log("创建方案", res);
    //       if (res.data.SysCode == 200200) {
    //         this.FAData.apID = res.data.Data[0].apID;
    //         this.PushADBFun(res.data.Data);
    //         this.CreateShareADSFun();
    //         sessionStorage.setItem("plan_apid", res.data.Data[0].apID);
    //         sessionStorage.setItem("cityArea", JSON.stringify(cityArea));
    //       } else {
    //         this.ADloading.close();
    //         sessFun.messageFun("warning", "方案创建失败");
    //       }
    //     });
    // },
    // 提交方案选点信息 7700 6700
    // PushADBFun(data) {
    //   let ADBData = data;
    //   console.log("shopingList", this.shopingList);
    //   let cityArr = [];
    //   for (let j = 0; j < ADBData.length; j++) {
    //     let cityObj = {
    //       city: ADBData[j].city,
    //       pdID: ADBData[j].pdID,
    //       pdType: ADBData[j].pdType,
    //       asrID: ADBData[j].asrID,
    //       apID: ADBData[j].apID,
    //     };
    //     cityArr.push(cityObj);
    //   }
    //   console.log("cityArr", cityArr);
    //   let pbSetTime = this.timestampToTime(Date.parse(new Date()));
    //   console.log("当前日期时间", pbSetTime);
    //   let arr = [];
    //   for (let key of this.shopingList) {
    //     for (let cKey of cityArr) {
    //       if (key.city == cKey.city && key.asrID == cKey.asrID) {
    //         let adsInfo = {
    //           uID: this.sessionData.uID,
    //           apID: cKey.apID,
    //           asID: key.asID,
    //           pdID: cKey.pdID,
    //           pbStar: key.schedule.split("-")[0],
    //           pbEnd: key.schedule.split("-")[1],
    //           mapCenterName: key.mapCenter,
    //           resID: key.resID,
    //           pbSetTime: pbSetTime,
    //         };
    //         if (
    //           this.customPermission.pptPermission &&
    //           this.customPermission.pptPermission.gzqylPermission == "1"
    //         ) {
    //           adsInfo.recommendReason = key.recommendReason || ""; //  亲粤邻定制：推荐理由
    //         }
    //         if (cKey.pdType == 0 && key.mVehicle === "广告门") {
    //           arr.push(adsInfo);
    //         } else if (cKey.pdType == 1 && key.mVehicle === "道闸") {
    //           arr.push(adsInfo);
    //         }
    //       }
    //     }
    //   }
    //   console.log("PushADBFun的arr", arr);
    //   let postData = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     abList: arr,
    //   };
    //   api
    //     .postApi_json(
    //       this.apiVar.Advertisement +
    //         "/PushADB?uid=" +
    //         this.sessionData.uID +
    //         "&token=" +
    //         this.sessionData.token,
    //       postData
    //     )
    //     .then((res) => {
    //       console.log("PushADB提交选点", res);
    //       if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
    //         this.ADloading.close();
    //       } else {
    //         if (res.data === "" || res.data === null) {
    //           sessFun.messageFun("warning", "提交选点失败");
    //         } else {
    //           this.ADloading.close();
    //           this.active = 3;
    //           if (this.apMinTime <= this.dateTime) {
    //             sessFun.messageFun(
    //               "warning",
    //               "该方案的投放期已经开始，建议立即发布该方案！"
    //             );
    //           } else {
    //             sessFun.messageFun("success", "方案创建成功");
    //           }
    //           // 清除后台缓存
    //           let params = {
    //             uid: this.sessionData.uID,
    //             token: this.sessionData.token,
    //           };
    //           api
    //             .postApi(
    //               this.apiVar.Advertisement + "/clearAdPlanBackups",
    //               params
    //             )
    //             .then((res) => {
    //               console.log("清空缓存的方案", res);
    //               if (res.data.SysCode === 200200) {
    //                 console.log("缓存方案清除成功");
    //               } else {
    //               }
    //             });
    //           // 清除前台缓存
    //           cacheAdPlan.removeData(this.sessionData.uID);
    //         }
    //       }
    //     });
    // },

    // 生成协同选点aiCode
    // CreateShareADSFun() {
    //   let urlPath = location.href;
    //   console.log(urlPath);
    //   let aiInfo = {
    //     apname: this.planForm.planName,
    //     cname: this.cName,
    //     cband: this.cBand,
    //   };
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     apid: this.FAData.apID,
    //     aiinfo: JSON.stringify(aiInfo),
    //   };
    //   api
    //     .postApi(this.apiVar.Advertisement + "/CreateShareCode", params)
    //     .then((res) => {
    //       console.log("生成协同选点aiCode", res);
    //       this.apAicode = res.data.aiCode; // 协同选点 aiCode
    //       this.shareADUrl =
    //         this.apiVar.qadnUrl +
    //         "/shareADList?apid=" +
    //         this.FAData.apID +
    //         "&aicode=" +
    //         res.data.aiCode;
    //       this.active = 3;
    //     });
    // },
    /*完成*/
    //查看方案
    ToDetail() {
      this.$router.push("./planEmptyPointDetail");
    },
    // 继续创建
    continueCreate() {
      this.$router.push("./createPlan");
      location.reload(false);
    },
    //复制协同选点的url
    // copyUrl() {
    //   let Url = document.getElementById("shareUrl").innerText;
    //   console.log("url", Url);
    //   let oInput = document.createElement("input");
    //   oInput.value = Url;
    //   document.body.appendChild(oInput);
    //   oInput.select(); // 选择对象
    //   document.execCommand("Copy"); // 执行浏览器复制命令
    //   oInput.style.display = "none";
    //   sessFun.messageFun("success", "复制成功");
    // },
    // 公用方法
    // 方案异常时，存储当前方案基本数据及购物车点位等临时信息
    handleImportDrafts(type, list) {
      this.importDraftsType = type;
      this.importDraftsList = [...list];
    },
    // TODO:存入草稿箱, 改为更变购物车
    changeApInfo() {
      if(this.mapLock){
      this.importDraftsConfig.suID = this.BDData.uid;
      this.importDraftsConfig.type = this.importDraftsType;
      this.importDraftsConfig.resList = JSON.stringify(this.importDraftsList);
      // apID, 意向方案id
      // suID
      // type
      // apName, //意向方案名称
      //adcID, //客户联系人id
      // bID, //品牌id
      //customerBudget,//客户预算
      //customerDemand, //客户需求
      // resList
      for (let i in this.importDraftsConfig == "") {
        if (!this.importDraftsConfig[i]) {
          delete this.importDraftsConfig[i];
        }
      }

      let params = {
        apID: this.FAInfo.apID,
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        ...this.importDraftsConfig,
      };
      console.log("缓存草稿箱的数据: ", params);

      api.postApi(this.apiVar.CreateAdBackUp, params).then((res) => {
        console.log("res创建方案缓存", res);
        if (res.data.SysCode == 200200) {
        } else {
          // 后台缓存异常，则前台缓存到localStorage
          // cacheAdPlan.setData(planInfo)
          sessFun.messageFun("warning", res.data.MSG);
        }
      });

      }
      
      // cacheAdPlan.setData(planInfo);
    },
    // saveApInfo() {
    //   console.log("this.sessionData: ", this.sessionData);
    //   this.isSelect = true;
    //   let planInfo = {
    //     uid: this.sessionData.uID,
    //     setTime: this.timestampToTime(Date.parse(new Date())),
    //     planData: {
    //       suid: this.BDData.uid, // 销售uid,如果是销售自己创建方案则uid与suid相同
    //       saleManageLevel: this.BDData.saleManageLevel, // 销售权限
    //       baseInfo: this.planForm,
    //       adsList: this.shopingList,
    //       throwCity: this.throwCity,
    //       companyBrand: this.companyBrand,
    //     },
    //   };
    //   console.log(
    //     "方案异常时，存储当前方案基本数据及购物车点位等临时信息",
    //     planInfo
    //   );
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     adPlan: JSON.stringify(planInfo),
    //   };
    //   api
    //     .postApi(this.apiVar.Advertisement + "/createAdPlanBackups", params)
    //     .then((res) => {
    //       console.log("res创建方案缓存", res);
    //       if (res.data.SysCode == 200200) {
    //       } else {
    //         // 后台缓存异常，则前台缓存到localStorage
    //         // cacheAdPlan.setData(planInfo)
    //       }
    //     });
    //   cacheAdPlan.setData(planInfo);
    // },
    //按小区选点
    //  saveApInfo() {
    //   console.log("this.sessionData: ", this.sessionData);
    //   this.isSelect = true;
    //   let planInfo = {
    //     uid: this.sessionData.uID,
    //     setTime: this.timestampToTime(Date.parse(new Date())),
    //     planData: {
    //       suid: this.BDData.uid, // 销售uid,如果是销售自己创建方案则uid与suid相同
    //       saleManageLevel: this.BDData.saleManageLevel, // 销售权限
    //       baseInfo: this.planForm,
    //       adsList: this.shopingList,
    //       throwCity: this.throwCity,
    //       companyBrand: this.companyBrand,
    //     },
    //   };
    //   console.log(
    //     "方案异常时，存储当前方案基本数据及购物车点位等临时信息",
    //     planInfo
    //   );
    //   let params = {
    //     uid: this.sessionData.uID,
    //     token: this.sessionData.token,
    //     adPlan: JSON.stringify(planInfo),
    //   };
    //   api
    //     .postApi(this.apiVar.Advertisement + "/createAdPlanBackups", params)
    //     .then((res) => {
    //       console.log("res创建方案缓存", res);
    //       if (res.data.SysCode == 200200) {
    //       } else {
    //         // 后台缓存异常，则前台缓存到localStorage
    //         // cacheAdPlan.setData(planInfo)
    //       }
    //     });
    //   cacheAdPlan.setData(planInfo);
    // },
    // 设置方案信息
    // setPlanInfo() {
    //   let returnData = cacheAdPlan.getData(this.sessionData.uID);
    //   if (returnData) {
    //     this.unfinishedData = returnData;
    //     this.planForm = returnData.planData.baseInfo;
    //     this.BDData.uid = returnData.planData.suid;
    //     this.BDData.saleManageLevel = returnData.planData.saleManageLevel || 0;
    //     this.throwCity = returnData.planData.throwCity;
    //     this.shopingList = returnData.planData.adsList;
    //     this.companyBrand = returnData.planData.companyBrand;
    //     if (this.sessionData.uType === "MD") {
    //       this.getCityList();
    //       this.Get_cName();
    //       // 媒介需构建销售下拉选项-第一步
    //       let arr = [
    //         {
    //           label: this.planForm.realNamesName,
    //           value: this.BDData.uid,
    //         },
    //       ];
    //       this.salerList = arr;
    //     }
    //     this.active = 1;
    //     console.log("设置方案信息returnData", returnData);
    //     // 设置城市及对应的区域
    //     this.getAreaFun();
    //     this.getAdsParamsData = {
    //       prID: this.city[0].rid,
    //       rid: "440100",
    //       act: 1,
    //       dateTimeBegin: this.dateInput[0],
    //       dateTimeEnd: this.dateInput[1],
    //       resType: this.recType,
    //       mVehicle: this.mediaType,
    //       pageNum: this.pageNum,
    //       pageSize: this.pageSize,
    //     };
    //     this.getAdList(); // 获取选点列表
    //     // this.getRejectPlanList(); // 获取排斥方案列表
    //     this.getIndustryBycID(); // 根据所选公司获取公司所属行业
    //   } else {
    //     this.$router.push("./createPlan");
    //     return;
    //   }
    // },
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
    // 事件埋点(无法使用模板指令时)--广告门，道闸
    MtaStatFun(mtaStatIdAdDoor, mtaStatIdRoadGate) {
      if (this.activeName == 1) {
        MtaH5.clickStat(mtaStatIdAdDoor);
      } else if (this.activeName == 2) {
        MtaH5.clickStat(mtaStatIdRoadGate);
      }
    },
  },
  // 页面销毁
  destroyed() {
    if (this.active == 1 || this.active == 2) {
      console.log("页面销毁----");
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .postApi(this.apiVar.Advertisement + "/AddCreatePlanLog", params)
        .then((res) => {
          console.log("上报成功-----", res);
        })
        .catch((err) => {
          console.log("上报失败-----", err);
        });
    }
  },
};
</script>

<style scoped lang="scss">
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
  .adDoor,
  .roadGate {
    display: flex;
    // justify-content: space-between;
    justify-content: center; // 内容自适应：上下居中
    align-items: center; // 子项对齐方式：左右居中
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

/* .urlBtn {
        padding: 10px;
    } */

// .mapBtn {
//   min-width: 110px;
//   text-align: center;
//   display: inline-block;
//   border: 1px solid #d9d9d9;
//   border-radius: 4px;
//   font-family: PingFangSC-Regular;
//   font-size: 14px;
//   color: rgba(0, 0, 0, 0.65);
//   margin-bottom: 5px;
//   cursor: pointer;
// }

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
  margin-top: 10px;
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
  background: rgba(255, 0, 0, 0.08);
}

/deep/ .el-table .warning-row-conncet {
  background: rgba(255, 199, 0, 0.1);
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
  padding: 32px 18px;
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
/deep/ textarea.el-textarea__inner {
  transform: translateY(-4px);
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
  width: 300px;
  height: 34px;
  line-height: 32px;
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

.otherSelect /deep/ .el-input__inner {
  width: 100px;
  height: 30px;
  padding-left: 10px;
  color: #1890ff;
  border-radius: 0;
  overflow: hidden;
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

/deep/ .el-tag__close.el-icon-close:hover {
  background: #fff;
}

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

// /deep/ .el-table__expanded-cell[class*="cell"] {
//   padding: 0 86px;
//   background-color: #f7f7f7;
// }

// /deep/ .el-table__expanded-cell[class*="cell"] .el-form {
//   height: 44px;
//   line-height: 44px;
// }

/deep/ .el-form-item__content {
  line-height: 46px;
}

/deep/ .el-form-item__label {
  padding: 0 0 0 12px;
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
  width: 1134px;
  min-height: 680px;
}

.step3 /deep/ .el-dialog {
  width: 388px !important;
}

/*购物车列表*/
.car-title {
  background: #e6f7ff;
  border: 1px solid #bae7ff;
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

// /deep/ .car-list .el-table__expanded-cell[class*="cell"] {
//   padding: 0 46px;
//   background-color: #f7f7f7;
// }

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
  margin-top: 22px;
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
  height: 220px;
  background: #fafafa;
  border-radius: 2px;
  padding: 19px 0;
  box-sizing: border-box;
  margin: 0 auto;
}
.planPanel ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  height: 100%;
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

// .noShareUl {
//   height: 245px !important;
// }

.noShareUl ul li {
  margin-bottom: 15px !important;
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
  width: 110px;
}

/deep/ .el-table .el-table-column-resName .cell {
  width: 200px;
}

/deep/ .el-table .el-table-column-mediaName .cell {
  width: 140px;
}

/deep/ .el-table .el-table-column-mediaRemark .cell {
  width: 140px;
}

.ad_pagination /deep/ .el-pagination__sizes .el-input__inner {
  width: 100px;
}

.ad_pagination /deep/ .el-pagination__editor.el-input .el-input__inner {
  width: 45px;
}
/deep/ .el-upload--text {
  width: 100%;
}

/deep/ .el-upload--text .el-upload-list__item {
  width: 100%;
}

/deep/ .el-upload--text .el-upload-dragger {
  padding-top: 9%;
  width: 100%;
  height: 135px;
  background: rgba(0, 0, 0, 0.06);
}

.unit {
  display: inline-block;
  font-style: normal;
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.65);
  height: 32px;
  width: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 0 4px 4px 0;
  transform: translateX(-40px);
  border-left: 1px solid #d9d9d9;
}
/deep/ .planAdsCntClass.el-input {
  width: 200px;
  .el-input__inner {
    width: 105px !important;
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
