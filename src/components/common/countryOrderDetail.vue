<template>
  <div class="ad_mediaDetail_wrap clearfix">
    <div class="ad_mediaDetail_nav">
      <p>
        <a href="#">非系统全国单</a>
        <em> / </em>
        <a href="#">订单详情</a>
      </p>
    </div>
    <!--资源信息-->
    <div class="mediaList_wrap">
      <div
        class="content_top_wrap"
        v-loading="loading"
        element-loading-text="玩命加载中.."
        element-loading-spinner="el-icon-loading"
      >
        <div class="plan-title">
          <h4>
            <img src="../../assets/images/planlogo.png" alt="" />{{
              orderDetail.apName
            }}
            <p>
              {{ orderDetail.apQC }}
              <i
                class="el-icon-edit changeCID"
                v-if="['ADN_MD_COUNTRY', 'ADN_MD'].includes(role)"
                @click="changeCID = true"
              ></i>
            </p>
          </h4>
          <!--修改合同号对话框-->
          <el-dialog
            title="修改合同编号"
            :visible.sync="changeCID"
            width="320px"
          >
            <el-input
              style="width: 100%; margin-bottom: 16px"
              v-model="apQC"
            ></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button plain @click="cancelChangeID">取 消</el-button>
              <el-button type="primary" @click="confirmChangeID"
                >确 定</el-button
              >
            </span>
          </el-dialog>
          <div class="handleBtn">
            <el-select
              v-if="
                ['ADN_MD_COUNTRY'].includes(role) &&
                planPanel == 'first' &&
                orderDetail.apState != 5 &&
                orderDetail.apState != 0
              "
              size="small"
              value="换 点"
              placeholder="换 点"
              class="change-point-select"
            >
              <el-option
                label="更改排期"
                value="1"
                @click.native="changeHandleType(1)"
              ></el-option>
              <el-option
                label="终止点位"
                value="2"
                @click.native="changeHandleType(2)"
              ></el-option>
              <el-option
                label="新增点位"
                value="3"
                @click.native="changeHandleType(3)"
              ></el-option>
            </el-select>
            <el-button
              type="plain"
              @click="changePrice"
              v-if="['ADN_MD_COUNTRY'].includes(role)"
              >修改金额
            </el-button>
          </div>
        </div>
        <div>
          <detailInfo :detail="orderDetail" :isorder="true" :companyList="companyList"></detailInfo>
        </div>
      </div>
    </div>
    <div class="mediaList_wrap margin_16_64">
      <el-tabs
        class="company-tabs"
        v-if="companiesOfOrder.length"
        v-model="currentCompanyId"
        @tab-click="getSetPoint"
      >
        <el-tab-pane
          v-for="(companyItem, companyIndex) in companiesOfOrder"
          :key="companyIndex"
          :label="companyItem.asName"
          :name="companyItem.asrID + ''"
        >
          <el-tabs
            v-if="currentCompanyId == companyItem.asrID"
            v-model="planPanel"
            type="card"
          >
            <el-tab-pane label="选点排期" name="first">
              <schedule-alter-country
                v-if="orderDetail.apID && currentCompanyId"
                :detailData="orderDetail"
                :companyId="currentCompanyId"
              />
              <div class="first-wrap box-wrap">
                <el-row class="search-row">
                  <el-col>
                    <span style="font-size: 14px; color: rgba(0, 0, 0, 0.85)"
                      >资源名称：</span
                    >
                    <el-input
                      placeholder="请输入资源名称进行搜索"
                      v-model="keyword"
                      class="input-with-select"
                      style="width: 260px"
                      @change="search('current')"
                    ></el-input>
                    <el-button
                      type="primary"
                      icon="el-icon-search"
                      @click="search('current')"
                      style="position: relative; top: 2px; margin-left: 3px"
                    >
                      搜索
                    </el-button>
                    <el-button
                      style="position: relative; top: 2px"
                      @click="reset('current')"
                      plain
                      >重置
                    </el-button>
                    <el-button
                      style="
                        float: right;
                        position: relative;
                        top: 2px;
                        margin-left: 3px;
                      "
                      plain
                      type="default"
                      v-if="role != 'ADN_EP'"
                      @click="getPointRecord"
                      >更改记录
                    </el-button>
                    <el-button
                      plain
                      type="default"
                      icon="el-icon-download"
                      @click="export2Excel(orderDetail.apName)"
                      :disabled="isDown"
                      style="
                        position: relative;
                        top: 2px;
                        float: right;
                        margin-right: 3px;
                      "
                      >导出
                    </el-button>
                  </el-col>
                </el-row>
                <div class="table_wrap">
                  <el-table
                    border
                    :data="currentPointArr"
                    style="width: 100%"
                    :default-sort="{ prop: 'recName', order: 'descending' }"
                    v-loading="currPointloading"
                    element-loading-text="玩命加载中.."
                    element-loading-spinner="el-icon-loading"
                  >
                    <el-table-column type="expand">
                      <template slot-scope="props">
                        <el-form
                          label-position="left"
                          inline
                          class="demo-table-expand"
                        >
                          <el-form-item label="商圈：">
                            <span>{{ props.row.tradingArea }}</span>
                          </el-form-item>
                          <el-form-item label="楼栋数量：">
                            <span>{{ props.row.fNum }}</span>
                          </el-form-item>
                          <el-form-item label="资产编号：">
                            <span>{{ props.row.assetTag }}</span>
                          </el-form-item>
                          <el-form-item label="入住年份：">
                            <span>{{ props.row.chDay }}</span>
                          </el-form-item>
                          <el-form-item label="广告限制：">
                            <span>{{ props.row.notPush || "--" }}</span>
                          </el-form-item>
                          <el-form-item
                            v-if="sessionData.uType == 'ADN_MD_COUNTRY'"
                            label="归属公司："
                          >
                            <span class="ellipsis-td">{{
                              props.row.asName || ""
                            }}</span>
                          </el-form-item>
                        </el-form>
                        <el-form
                          v-if="customPermission.patrolPermission"
                          label-position="left"
                          inline
                          class="demo-table-expand"
                        >
                          <el-form-item label="巡点问题：">
                            <span class="ellipsis-td">{{
                              props.row.remark || "--"
                            }}</span>
                          </el-form-item>
                          <el-form-item label="通行情况：">
                            <span class="ellipsis-td">{{
                              props.row.trafficState || "--"
                            }}</span>
                          </el-form-item>
                          <el-form-item label="通电情况：">
                            <span class="ellipsis-td">{{
                              props.row.electrifyState || "--"
                            }}</span>
                          </el-form-item>
                        </el-form>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="资源名称"
                      min-width="16.1%"
                      class-name="resName-wrap"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <div
                          style="
                            float: left;
                            position: absolute;
                            left: 0;
                            top: 0;
                          "
                        >
                          <div
                            v-if="scope.row.lState == 2"
                            slot="reference"
                            class="color-line"
                            style="background-color: #ff763b"
                          ></div>
                          <div
                            v-if="scope.row.isNew == 1"
                            slot="reference"
                            class="color-line"
                          ></div>
                          <div
                            v-if="scope.row.isChange == 1"
                            slot="reference"
                            class="color-line"
                            style="background-color: #26d8bb"
                          ></div>
                        </div>
                        <span>{{ scope.row.resName || "--" }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="mTitle"
                      label="媒体名称"
                      min-width="10.3%"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="mediaTypeName"
                      label="媒体类型"
                      min-width="10.3%"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="asLab"
                      label="投放面"
                      min-width="8.8%"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="city"
                      label="城市"
                      min-width="6%"
                      :filters="filterCityData"
                      :filter-method="filterCity"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="rName"
                      label="区域"
                      min-width="7.4%"
                      :filters="filtersArea"
                      :filter-method="filterRName"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="cType"
                      label="楼盘类型"
                      min-width="8.8%"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.cType || "--" }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="hNum"
                      label="小区户数"
                      min-width="7.3%"
                      align="right"
                    >
                      <template slot-scope="scope">
                        <span>{{
                          scope.row.hNum ? priceToFormat(scope.row.hNum) : 0
                        }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="楼盘价格"
                      min-width="7.3%"
                      align="right"
                    >
                      <template slot-scope="scope">
                        <span
                          >&yen;{{
                            scope.row.hPrice
                              ? priceFormat(scope.row.hPrice / 100)
                              : 0
                          }}</span
                        >
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="timeRange"
                      label="排期"
                      min-width="14.2%"
                      :filters="scheduleList"
                      :filter-method="filterTimeRange"
                      show-overflow-tooltip
                    >
                      <template slot-scope="scope">
                        <template v-if="scope.row.lState == 2">
                          <span>{{ scope.row.finishTimeRange }}</span>
                        </template>
                        <span v-else>{{ scope.row.timeRange }}</span>
                      </template>
                    </el-table-column>

                    <div slot="empty">
                      <no-search-result></no-search-result>
                    </div>
                  </el-table>
                  <div class="table-bottom-tip">
                    <div style="display: flex">
                      <p>
                        <span
                          style="background-color: #1890ff"
                          class="color-line"
                        ></span
                        >新增点位
                      </p>
                      <p>
                        <span
                          style="background-color: #ff763b"
                          class="color-line"
                        ></span
                        >终止点位
                      </p>
                      <p>
                        <span
                          style="background-color: #26d8bb"
                          class="color-line"
                        ></span
                        >更改排期
                      </p>
                    </div>
                    <div class="ad_pagination" v-if="total">
                      <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="changePage"
                        @size-change="sizeChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :current-page.sync="currPage"
                        :page-size="pageSize"
                        :total="total"
                      >
                      </el-pagination>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="物料信息" name="third">
              <material
                :materialInfoData="materialInfoJson"
                :loading="false"
                :isOrder="true"
                :openStatus="false"
              ></material>
            </el-tab-pane>
            <el-tab-pane
              label="上刊报告"
              name="forth"
              :disabled="role == 'ADN_OP'"
            >
              <div class="changepic_box" v-if="planPanel == 'forth'">
                <Change-Pic-Country
                  :apId="apId"
                  :companyId="currentCompanyId"
                  :type="0"
                  :order-detail="orderDetail"
                  :scheduleList="scheduleList"
                  :adMaterialRemarkList="adMaterialRemarkList"
                ></Change-Pic-Country>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="下刊报告"
              name="fifth"
              :disabled="role == 'ADN_OP'"
            >
              <div class="changepic_box" v-if="planPanel == 'fifth'">
                <Change-Pic-Country
                  :apId="apId"
                  :companyId="currentCompanyId"
                  :type="1"
                  :order-detail="orderDetail"
                  :scheduleList="scheduleList"
                  :adMaterialRemarkList="adMaterialRemarkList"
                ></Change-Pic-Country>
              </div>
            </el-tab-pane>
            <el-tab-pane label="换画报告" name="sixth">
              <div class="changepic_box" v-if="planPanel == 'sixth'">
                <Change-Pic-Country
                  :apId="apId"
                  :companyId="currentCompanyId"
                  :type="2"
                  :firstTime="false"
                  :from-type="fromType"
                  :scheduleList="scheduleList"
                  :order-detail="orderDetail"
                  :painList="painList"
                  @changePain="changePain"
                  @getPainlist="getPainlist"
                ></Change-Pic-Country>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
      <!--换画弹框-->
      <!-- <div class="changepic_box FIRSTTIME" v-if="showPainModal">
        <Change-Pic-Country
          :apId="apId"
          :companyId="currentCompanyId"
          :scheduleList="scheduleList"
          :firstTime="showPainModal"
          :type="2"
          :planPanel="planPanel"
          :from-type="fromType"
          :order-detail="orderDetail"
          @hidePainModal="hidePainModal()"
        ></Change-Pic-Country>
      </div> -->
      <!--添加点位对话框-->
      <el-dialog
        title="添加点位"
        :visible.sync="dialogAddPoint"
        width="82%"
        top="6vh"
        :close-on-press-escape="false"
        :show-close="true"
      >
        <Add-Ads-Country
          :IsAddAds="IsAddPoint"
          :MediaTypeData="mediaTypeList"
          @ievent="ievent"
        ></Add-Ads-Country>
        <span slot="footer" class="dialog-footer">
          <el-button plain @click="cancelAddPoint">取 消</el-button>
          <el-button type="primary" @click="confirmAddPoint">确 定</el-button>
        </span>
      </el-dialog>
      <!--excel导入点位对话框-->
      <ImportPointByExcelCountry
        :dialogImportPoint="dialogImportPoint"
        :handleTime="handleTime"
        @resetDialogImportPoint="resetDialogImportPoint"
        @refreshCurrentTable="refreshCurrentTable"
      ></ImportPointByExcelCountry>
      <!-- 更改排期对话框 -->
      <ChangePointPlayDateRangeCountry
        :changeRangeDialog="changeRangeDialog"
        :changeList="changePointInfo.stopPointlist"
        :handleTime="handleTime"
        @resetDialogChangeRange="resetDialogChangeRange"
        @refreshCurrentTable="refreshCurrentTable"
      ></ChangePointPlayDateRangeCountry>
      <!-- 图片查看显示 -->
      <el-dialog :visible.sync="dialogVisible" class="imgPreview" top="10vh">
        <img :src="dialogImageUrl" alt="" />
      </el-dialog>

      <!--换点对话框-->
      <el-dialog
        title="更换点位"
        :visible.sync="dialogChangePoint"
        :close-on-press-escape="false"
        :show-close="false"
        :close-on-click-modal="false"
        :before-close="closeDialogChangePoint"
      >
        <div>
          <el-row class="search-row" style="margin: 0">
            <el-col>
              <span>资源名称：</span>
              <el-input
                placeholder="请输入资源名称进行搜索"
                v-model="changeKeyword"
                class="input-with-select"
                style="width: 200px"
                @change="search('change')"
              ></el-input>
              <el-button
                type="primary"
                @click="search('change')"
                icon="el-icon-search"
                style="position: relative; top: 2px; margin-left: 3px"
                >搜索
              </el-button>
              <el-button
                plain
                @click="reset('change')"
                style="position: relative; top: 2px"
                >重置
              </el-button>
              <div style="float: right; display: flex">
                <el-button
                  v-if="handleType === 1"
                  plain
                  @click="changePointPlayDateRange"
                  >更改排期</el-button
                >
                <el-button
                  v-else-if="handleType === 2"
                  plain
                  @click="stopPoint('stop')"
                  >终止点位
                </el-button>
                <el-button
                  v-else-if="handleType === 3"
                  plain
                  @click="excelAddPointDialog"
                  >导入点位
                </el-button>
              </div>
            </el-col>
          </el-row>
          <div class="table-top-tip">
            <i class="el-icon-info" style="color: #1890ff"></i>
            <h4>
              <span
                >当前点位共<em>{{ pointTotal }}</em
                >个，</span
              >
              <span v-if="handleType == 1"
                >更改排期点位<em>{{ changePointInfo.lIDArr.length }}</em
                >个</span
              >
              <span v-if="handleType == 2"
                >终止点位<em>{{ changePointInfo.stopPointNum }}</em
                >个</span
              >
              <span v-if="handleType == 3"
                >新增点位<em>{{ changePointInfo.addPointNum }}</em
                >个</span
              >
            </h4>
          </div>
          <div>
            <el-table
              border
              :data="changePointArr"
              style="width: 100%"
              :default-sort="{ prop: 'recName', order: 'descending' }"
              v-loading="changePointloading"
              ref="multipleTable"
              @select="handleSelect"
              @select-all="handleSelectAll"
              element-loading-text="玩命加载中.."
              element-loading-spinner="el-icon-loading"
              height="650"
            >
              <el-table-column
                v-if="handleType !== 3"
                type="selection"
                aria-disabled="true"
                :selectable="selectInit"
                width="45"
              >
              </el-table-column>
              <el-table-column type="expand">
                <template slot-scope="props">
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <el-form-item label="商圈:">
                      <span>{{ props.row.tradingArea }}</span>
                    </el-form-item>
                    <el-form-item label="楼栋数量:">
                      <span>{{ props.row.fNum }}</span>
                    </el-form-item>
                    <el-form-item label="资产编号:">
                      <span>{{ props.row.assetTag }}</span>
                    </el-form-item>
                    <el-form-item label="入住年份:">
                      <span>{{ props.row.chDay }}</span>
                    </el-form-item>
                    <el-form-item label="广告限制:">
                      <span>{{ props.row.notPush || "--" }}</span>
                    </el-form-item>
                  </el-form>
                  <el-form
                    label-position="left"
                    inline
                    class="demo-table-expand"
                  >
                    <el-form-item
                      v-if="
                        sessionData.uType == 'ADN_MD_COUNTRY' ||
                        sessionData.uType == 'ADN_BD_KA'
                      "
                      label="归属公司:"
                    >
                      <span class="ellipsis-td">{{
                        props.row.asName || ""
                      }}</span>
                    </el-form-item>
                    <template v-if="customPermission.patrolPermission">
                      <el-form-item label="巡点问题:">
                        <span class="ellipsis-td">{{
                          props.row.remark || "--"
                        }}</span>
                      </el-form-item>
                      <el-form-item label="通行情况:">
                        <span class="ellipsis-td">{{
                          props.row.trafficState || "--"
                        }}</span>
                      </el-form-item>
                      <el-form-item label="通电情况:">
                        <span class="ellipsis-td">{{
                          props.row.electrifyState || "--"
                        }}</span>
                      </el-form-item>
                    </template>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column
                label="资源名称"
                min-width="16.1%"
                class-name="resName-wrap"
              >
                <template slot-scope="scope">
                  <div
                    style="float: left; position: absolute; left: 0; top: 0"
                    v-if="isHandleChange"
                  >
                    <div
                      v-if="scope.row.beEnd == 1"
                      slot="reference"
                      class="color-line"
                      style="background-color: #ff763b"
                    ></div>
                    <div
                      v-else-if="scope.row.isCurrNew == 1"
                      slot="reference"
                      class="color-line"
                    ></div>
                    <div
                      v-else-if="scope.row.changePeriod == 1"
                      slot="reference"
                      class="color-line"
                      style="background-color: #26d8bb"
                    ></div>
                  </div>
                  <span>{{ scope.row.resName || "--" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="mTitle" label="媒体名称" min-width="10.3%">
              </el-table-column>
              <el-table-column prop="asLab" label="投放面" min-width="5.8%">
              </el-table-column>
              <el-table-column
                prop="asName"
                label="所属公司"
                width="120"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="city"
                label="城市"
                min-width="6%"
                :filters="filterCityData"
                :filter-method="filterCity"
              >
              </el-table-column>
              <el-table-column
                prop="rName"
                label="区域"
                min-width="7.4%"
                :filters="filtersArea"
                :filter-method="filterRName"
              >
              </el-table-column>
              <el-table-column prop="cType" label="楼盘类型" min-width="6.5%">
                <template slot-scope="scope">
                  <span>{{ scope.row.cType || "--" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="hNum"
                label="小区户数"
                min-width="6.5%"
                align="right"
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.row.hNum ? priceToFormat(scope.row.hNum) : 0
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="楼盘价格"
                min-width="7.3%"
                align="right"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span
                    >&yen;{{
                      scope.row.hPrice ? priceFormat(scope.row.hPrice / 100) : 0
                    }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="timeRange"
                label="排期"
                min-width="14.2%"
                :filters="filtersData"
                :filter-method="filterTimeRange"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.timeRange }}</span>
                </template>
              </el-table-column>
              <div slot="empty">
                <no-search-result></no-search-result>
              </div>
            </el-table>
            <!--<p style="font-size: 12px;color: #666666;margin-top: 10px">提示：带*号的为新增点位</p>-->
            <div class="table-bottom-tip">
              <div style="display: flex" v-if="isHandleChange">
                <p>
                  <span
                    style="background-color: #1890ff"
                    class="color-line"
                  ></span
                  >新增点位
                </p>
                <p>
                  <span
                    style="background-color: #ff763b"
                    class="color-line"
                  ></span
                  >终止点位
                </p>
                <p>
                  <span
                    style="background-color: #26d8bb"
                    class="color-line"
                  ></span
                  >更改排期
                </p>
              </div>
              <div class="ad_pagination" v-if="pointTotal">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  @current-change="pointChangePage"
                  @size-change="pointSizeChange"
                  :page-sizes="[10, 20, 50, 500]"
                  :current-page.sync="pointCurrPage"
                  :page-size="pointPageSize"
                  :total="pointTotal"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="isHandleChange" plain @click="doneChangePoint"
            >完 成</el-button
          >
          <el-button v-else plain @click="closeDialogChangePoint"
            >取 消</el-button
          >
        </div>
      </el-dialog>
      <!--点位更改记录对话框-->
      <el-dialog
        title="点位更改记录"
        :visible.sync="dialogChangePointRecord"
        width="60%"
      >
        <div class="record-table-out-wrap">
          <div class="table-top-tip">
            <i class="el-icon-info" style="color: #1890ff"></i>
            <h4>
              <span
                >全部点位共<em>{{ recordList.info.allPoint }}</em
                >个，</span
              >
              <span
                >已终止点位<em>{{ recordList.info.stopPoint }}</em
                >个，</span
              >
              <span
                >新增点位<em>{{ recordList.info.newPoint }}</em
                >个，</span
              >
              <span
                >当前正常投放点位<em>{{ recordList.info.normalPoint }}</em
                >个</span
              >
            </h4>
          </div>
          <div class="record-table-wrap">
            <div
              v-if="recordList.table.length > 0"
              class="record"
              v-for="(item, index) in recordList.table"
              :key="index"
            >
              <div class="line"></div>
              <div class="content">
                <h6>
                  {{ item.updateTime }}<span>操作人:{{ item.realName }}</span>
                </h6>
                <el-table
                  v-if="item.adsInfo"
                  :data="item.adsInfo"
                  border
                  style="width: 100%"
                >
                  <el-table-column prop="type" label="变更类型" min-width="6%">
                    <template slot-scope="scope">
                      {{
                        scope.row.type == 2
                          ? "更改排期"
                          : scope.row.type == 1
                          ? "新增点位"
                          : scope.row.type == 0
                          ? "终止点位"
                          : ""
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="resName"
                    label="资源名称"
                    min-width="10%"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="mTitle"
                    label="媒体名称"
                    min-width="6%"
                  >
                  </el-table-column>
                  <el-table-column prop="asLab" label="投放面" min-width="5%">
                  </el-table-column>
                  <el-table-column prop="city" label="城市" min-width="6%">
                  </el-table-column>
                  <el-table-column prop="district" label="区域" min-width="6%">
                  </el-table-column>
                  <!-- 2:更改排期 1：新增 0：终止 -->
                  <el-table-column
                    show-overflow-tooltip
                    prop="preLaunch"
                    label="原排期"
                    min-width="6%"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.type == 2
                          ? scope.row.preLaunch
                          : scope.row.type == 1
                          ? "--"
                          : scope.row.type == 0
                          ? `${scope.row.lStar}~${scope.row.lEnd}`
                          : ""
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    show-overflow-tooltip
                    prop="newLaunch"
                    label="新排期"
                    min-width="6%"
                  >
                    <template slot-scope="scope">
                      {{
                        scope.row.type == 2
                          ? scope.row.newLaunch
                          : scope.row.type == 1
                          ? `${scope.row.lStar}~${scope.row.lEnd}`
                          : scope.row.type == 0
                          ? `${scope.row.lStar}~${
                              (item.updateTime || "").split(" ")[0]
                            }`
                          : ""
                      }}
                    </template>
                  </el-table-column>
                </el-table>
                <div class="price-wrap">
                  <p>
                    原订单金额：<span
                      >&yen;{{
                        item.previousApTotal
                          ? priceFormat(item.previousApTotal / 100)
                          : 0
                      }}</span
                    >
                  </p>
                  <p>
                    变更后订单金额：<span
                      >&yen;{{
                        item.currentApTotal
                          ? priceFormat(item.currentApTotal / 100)
                          : 0
                      }}</span
                    >
                  </p>
                </div>
              </div>
            </div>
            <no-search-result
              v-if="recordList.table.length == 0"
              style="
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              "
            ></no-search-result>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogChangePointRecord = false">关 闭</el-button>
        </span>
      </el-dialog>

      <ChangeCountryOrderPrice
        v-if="changePriceModal"
        :apID="orderDetail.apID"
        :requesInfo="{ mark: this.handleTime, opType: 1 }"
        :settlementFormVisible="true"
        :tabsActiveCompany="currentCompanyId"
        @cancel="changePriceModal = false"
        @planMoneyUpdated="
          changePriceModal = false;
          getInitData();
        "
      ></ChangeCountryOrderPrice>
    </div>
    <!-- 返回框 -->
    <div class="content_bottom_btn">
      <el-button plain type="default" @click="goBack"> 返回 </el-button>
    </div>
  </div>
</template>

<script>
import { Message, MessageBox } from "element-ui";
import { api } from "../../api/api.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";
// 报价单
import apQuotation from "./components/apQuotation.vue";
import material from "./components/materialInfo.vue";
import detailInfo from "./components/detailInfo.vue";
import AddAdsCountry from "./components/addAdsCountry";
import ImportPointByExcelCountry from "./components/importPointByExcelCountry";
import ChangePointPlayDateRangeCountry from "./components/changePointPlayDateRangeCountry";
import noSearchResult from "./components/noSearchResult.vue";
import ChangePicCountry from "./components/changePicCountry.vue";
import ChangeCountryOrderPrice from "./components/changeCountryOrderPrice.vue";
import ScheduleAlterCountry from "@/components/common/components/Alter/ScheduleAlterCountry";

export default {
  name: "orderDetail",
  components: {
    apQuotation,
    material,
    detailInfo,
    AddAdsCountry,
    ImportPointByExcelCountry,
    ChangePointPlayDateRangeCountry,
    ChangePicCountry,
    noSearchResult,
    ChangeCountryOrderPrice,
    ScheduleAlterCountry,
  },
  data() {
    return {
      apId: null,
      companiesOfOrder: [],
      // 当前tab展示的公司
      currentCompanyId: "-1",
      // 媒体类型
      mediaTypeList: [],
      // 物料信息数据
      materialInfoJson: {
        mediaTypeName: "",
        materialCntInfoList: [],
      },
      // session信息
      sessionData: {},
      isDown: false,
      //选点排期列表分页
      total: 1,
      currPage: 1,
      pageSize: 10,
      //更换点位分页
      pointTotal: 1,
      pointCurrPage: 1,
      pointPageSize: 500,
      //加载中
      loading: true,
      // maLoading: true,
      // 判断
      role: "",
      customPermission: {},
      // 订单详情头部
      orderDetail: {
        AdDoor: {},
        barrier: {},
      },
      //修改合同号
      changeCID: false,
      planPanel: "first",
      // 选点排期
      setpointArr: [],
      tempSetPointArr: [],
      changePointArr: [], //更换点位列表
      changePointloading: true,
      currentPointArr: [], //选点排期列表
      // exportArr: [],
      currPointloading: true,
      // addNewAdsNum: 0,    // 添加点位数
      // 报价单详情
      quotation: {
        isDetail: true,
        quotation: [],
      },
      // 城市过滤结果
      filterCityData: [],
      // 地区过滤结果
      filtersArea: [],
      // 当前计划排期区间列表
      scheduleList: [],
      // 当前订单物料列表
      adMaterialRemarkList: [],
      // 排期时间过滤
      filtersData: [],
      //选点排期资源名称搜索
      keyword: "",
      // 资源名称类型
      selectRecName: "1",
      // 保存当前点击的那项
      imgOrder: "",
      // 默认合同编号(如果订单详情没有合同编号)
      apQC: "",
      // 图片显示放大按钮控件
      isShow: null,
      isShow2: null,
      // 终止点位时间弹出框
      isFinish: false,
      finishDate: "",
      nowRow: {},
      dateRange: {
        beginDate: "",
        endDate: "",
      },
      pickerOptions: {
        disabledDate: (time) => {
          let beginDateVal = new Date(this.dateRange.beginDate).getTime();
          let endDateVal =
            new Date(this.dateRange.endDate).getTime() - 60 * 60 * 24 * 1000;
          if (beginDateVal || endDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > endDateVal;
          }
        },
      },

      // 手动添加点位
      dialogAddPoint: false,
      // 导入点位
      dialogImportPoint: false,
      // 更换点位排期
      changeRangeDialog: false,
      IsAddPoint: true,
      addAdsArr: [],
      dateInput: "",
      pdidList: [],
      //默认
      value: "资源名称",
      buildValue: "",
      //搜索框
      searchInput: "",
      planSelect: "",
      //添加点位列表
      planList: [],
      //发送报告
      sendReportchecked: false,
      //上传照片
      dialogImageUrl: "",
      dialogVisible: false,
      //选点排期标题
      showTitle: false,
      //选点排期按钮
      showBtn: true,
      //更换点位对话框
      dialogChangePoint: false,
      //更换点位对话框搜索
      changeKeyword: "",
      //更换点位对话框数据
      changePointInfo: {
        lIDArr: [],
        allPoint: 0,
        stopPointlist: [],
        stopPointNum: 0,
        addPointlist: [],
        addPointNum: 0,
        changeAdsCount: 0,
      },

      //更换点位取消终止按钮
      cancelbtnShow: false,
      //选点排期操作
      showHandel: false,
      UploadTime: 0,
      // 导出订单图片包
      downLoading: false,
      //显示预览图蒙版
      showPreImg: null,
      // 换画
      // showPain: false,
      fromType: false,
      //第一次增加换画
      // showPainModal: false,
      // 换画列表
      painList: [],
      //点位更改记录
      dialogChangePointRecord: false,
      recordList: {
        info: {
          allPoint: 0,
          stopPoint: 0,
          newPoint: 0,
          normalPoint: 0,
        },
        table: [],
      },
      //修改订单金额数据
      changePriceModal: false,
      changePriceInfo: "",

      isHandleChange: false,
      handleTime: "", //换点操作和修改订单的时间戳
      handleType: 1,


      activeCompany: '',

      // 每个公司的金额信息
      companyList: []

    };
  },
  async created() {
    this.apId = sessionStorage.getItem("country_order_apid");
    // 根据角色判断是否有修改合同编号的权限
    this.getRole();
    // 获取订单下公司列表
    await this.getCompaniesOfOrder();
    if (this.isChangePoint()) {
      this.changeHandleType(this.handleType);
    } else {
      this.getSetPoint();
    }
    this.getScheduleList();
    this.getListCompanyFee()
    // 获取订单详情的上面公司的信息
    this.getInitData();
    // this.getMaterInfo();
    //获取物料信息
    // this.getMaterialInfo();
    this.getOrderPriceDetail();
  },
  watch: {
    currentCompanyId: {
      // immediate: true,
      handler(newVal, oldVal) {
        newVal && this.getPainlist();
      },
    },
  },
  methods: {
    //初始化各项数据
    initListData() {
      this.currPage = 1;
      this.pageSize = 10;
      this.pointCurrPage = 1;
      this.pointPageSize = 500;
      this.keyword = "";
      this.changeKeyword = "";
      this.changePointInfo = {
        lIDArr: [],
        allPoint: 0,
        stopPointlist: [],
        stopPointNum: 0,
        addPointlist: [],
        addPointNum: 0,
        changeAdsCount: 0,
      };
    },
    //获取订单金额详情
    getOrderPriceDetail() {
      api
        .getApi(this.apiVar.Advertisement + "/GetAPD", {
          apid: this.apId,
        })
        .then((res) => {
          if (!res.data.SysCode) {
            this.pdidList = res.data || [];
          } else if (res.data.SysCode == 100302) {
            this.loginTimeout();
          } else {
            Message.warning(res.data.MSG);
          }
        });
    },
    //更换点位对话框关闭
    closeDialogChangePoint() {
      //重置页数页码
      this.currPage = 1;
      this.pageSize = 10;
      this.dialogChangePoint = false;
      this.getSetPoint();
      // this.getMaterInfo();
    },
    //更换点位对话框-完成
    doneChangePoint() {
      this.closeDialogChangePoint();
      MessageBox.confirm("已完成更换点位操作，是否修改订单金额？", "提示", {
        confirmButtonText: "修改",
        cancelButtonText: "不修改",
        dangerouslyUseHTMLString: true,
        type: "success",
        closeOnClickModal: false,
      })
        .then(() => {
          this.changePriceModal = true;
          this.getOrderPriceDetail();
        })
        .catch(() => {
          // Message.info("已取消操作");
        });
    },
    // 更改排期操作
    changePointPlayDateRange() {
      if (this.changePointInfo.stopPointlist.length > 0) {
        this.changeRangeDialog = true;
      } else {
        Message.warning("请先勾选需要更改排期的点位");
      }
    },
    //终止点位操作
    stopPoint() {
      if (this.changePointInfo.stopPointlist.length > 0) {
        MessageBox.confirm("是否确定终止选中的点位？", "提示", {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let orderNewAdsInfos = [];
            let orderStoppedAdsInfos = [];
            if (this.changePointInfo.stopPointlist.length > 0) {
              for (let data of this.changePointInfo.stopPointlist) {
                orderStoppedAdsInfos.push(data);
              }
            }
            let info = {
              apID: this.orderDetail.apID,
              mark: this.handleTime,
              orderStoppedLIds: (orderStoppedAdsInfos || []).map((_) => _.lID),
            };
            api
              .postApi_json("/national/api/v1/nationalAdPlan/stopAds", info)
              .then((res) => {
                if (res.data.SysCode == 200200) {
                  Message.success(res.data.MSG);
                  this.changePointInfo.lIDArr =
                    this.changePointInfo.lIDArr.concat(
                      this.changePointInfo.stopPointlist
                    );
                  this.changePointInfo.stopPointNum =
                    this.changePointInfo.lIDArr.length;
                  for (let data of this.changePointInfo.stopPointlist) {
                    for (let item of this.setpointArr) {
                      if (
                        data.asID == item.asID &&
                        data.timeRange == item.timeRange
                      ) {
                        item.beEnd = 1;
                      }
                    }
                  }
                  this.changePointInfo.stopPointlist = [];
                  this.isHandleChange = true;
                  this.changePointPageFn();
                } else {
                  Message.warning(res.data.MSG);
                  this.dialogChangePoint = false;
                }
              });
          })
          .catch(() => {
            Message.info("已取消操作");
          });
      } else {
        Message.warning("请先勾选点位");
      }
    },
    // 改变页数
    sizeChange(pageVal) {
      this.currPointloading = true;
      this.currPage = 1;
      this.pageSize = pageVal;
      this.getSetPoint();
    },
    // 点击页数
    changePage(page) {
      this.currPointloading = true;
      this.currPage = page;
      this.getSetPoint();
    },
    // 更换点位改变页数
    pointSizeChange(pageVal) {
      this.changePointloading = true;
      this.pointCurrPage = 1;
      this.pointPageSize = pageVal;
      this.changePointPageFn();
    },
    // 点击页数
    pointChangePage(page) {
      this.changePointloading = true;
      this.pointCurrPage = page;
      this.changePointPageFn();
    },
    // 导出excel
    export2Excel(name) {
      this.isDown = true;
      api
        .getApi_file("/national/api/v1/excel/export/exportAds", {
          apID: this.orderDetail.apID,
          companyId: this.currentCompanyId,
        })
        .then((res) => {
          if (res.data && res.data.SysCode) {
            sessFun.messageFun("warning", res.data.MSG || "导出失败！");
          } else if (res.data) {
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8",
            });
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download =
              `${name}-` +
              new Date().getFullYear() +
              (new Date().getMonth() + 1) +
              new Date().getDate() +
              new Date().getHours() +
              new Date().getMinutes() +
              new Date().getSeconds() +
              ".xls"; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
          } else {
            sessFun.messageFun("warning", "导出失败！");
          }
        })
        .finally(() => {
          this.isDown = false;
        });
    },
    // 判断是否是有换点跳转过来的？
    isChangePoint() {
      let isChange = sessionStorage.getItem("change_point_country");
      sessionStorage.removeItem("change_point_country");
      if (isChange == "yes") {
        return true;
      }
      return false;
    },
    // 获取角色
    getRole() {
      this.sessionData = sessFun.getSess();
      this.customPermission = this.sessionData.customPermission;
      this.role = this.sessionData.uType;
    },
    // tab点击
    handleClick() {
      this.allPic = "";
      this.allhouse = "";
      this.citySelect = [];
      if (this.planPanel == "first") {
        this.getSetPoint();
      } else if (this.planPanel == "second") {
        this.$refs.apQuotation.judgeIsDetail();
      } else if (this.planPanel == "third") {
      } else if (this.planPanel == "forth") {
        this.getAdMaterialRemarkList();
      } else if (this.planPanel == "fifth") {
        this.getAdMaterialRemarkList();
      } else if (this.planPanel == "sixth") {
      }
    },
    //返回列表
    goBack() {
      this.$router.push("./countryOrderList");
    },
    // 获取订单内公司列表
    getCompaniesOfOrder() {
      return new Promise((resolve) => {
        api
          .getApi("/national/api/v1/nationalAdPlan/companyList", {
            apID: this.apId,
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              this.companiesOfOrder = res.data.data || [];
              if (
                Array.isArray(this.companiesOfOrder) &&
                this.companiesOfOrder.length
              ) {
                this.currentCompanyId = this.companiesOfOrder[0].asrID + "";
              }
              resolve(true);
            } else {
              resolve(false);
              Message.warning(res.data.MSG);
            }
          });
      });
    },
    // 获取订单详情的上面公司的信息
    getInitData() {
      api
        .getApi(`/national/api/v1/nationalAdPlan/${this.apId}`)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let info = res.data.data;
            this.orderDetail = {
              adcID: info.adcID,
              apID: info.apID,
              apQC: info.apQC,
              apName: info.apName,
              apState: info.apState,
              planMode: info.planMode,
              apTotal: info.apTotal,
              apcTime: info.apcTime,
              bTitle: info.bTitle,
              cName: info.cName,
              cuName: info.cuName,
              cityList: info.cityList || [],
              pdEnd: info.pdEnd,
              pdStar: info.pdStar,
              rID: info.rID,
              rIDs: info.rIDs,
              realName: info.realName,
              remark: info.remark,
              pdTotal: this.priceFormat(
                (info.apTotal || 0 - info.otherFee || 0 - info.sendFee || 0) /
                  100
              ),
              pdSendFee: this.priceFormat(info.sendFee || 0),
              pdOtherFee: this.priceFormat(info.otherFee || 0),
              Total: this.priceFormat((info.apTotal || 0) / 100),
            };
            this.apQC = this.orderDetail.apQC || "";
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
        });
    },
    // 获取物料
    /* getMaterInfo() {
      let loginData = this.sessionData;
      let info = {
        uid: loginData.uID,
        apid: this.apId,
        token: loginData.token,
      };
      // uid         int【必填】     当前账户UserID
      // apid        int             公司对应方案apID
      api
        .getApi(this.apiVar.Advertisement + "/GetAdLaunch", info)
        .then((res) => {
          if (!res.data.SysCode) {
            let initData = res.data;
            let result = initData.adSpaceInfo;
            for (let data of result) {
              let time =
                this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
              data.timeRange = time;
              let finishTimeRange = "";
              if (data.lState == 2) {
                finishTimeRange =
                  this.formatTime(data.lStar) +
                  "-" +
                  this.formatTime(data.lSetTime);
              }
              data.finishTimeRange = finishTimeRange;
            }
            // 选点排期
            this.exportArr = result;
            this.loading = false;
            this.maLoading = false;
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          this.loading = false;
          this.maLoading = false;
          console.log(res);
        });
    }, */

    // 获取物料新接口
    /* getMaterialInfo() {
      let info = {
        apID: this.apId,
      };
      api
        .getApi("/addsp/material/getMaterialCntByPlan", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let _data = res.data.data;
            let _materialCntInfoList = [];
            let _mediaTypeName = [];
            _data.forEach((item) => {
              _mediaTypeName.push(item.mediaTypeName);
              _materialCntInfoList.push(item.materialCntInfoList);
            });
            this.materialInfoJson = {
              mediaTypeName: _mediaTypeName,
              materialCntInfoList: _materialCntInfoList,
            };
          } else {
            this.$message({
              message: res.data.MSG,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, */

    // 获取当前用户所有的排期区间列表
    getScheduleList() {
      let info = {
        apID: this.apId,
        companyId: this.currentCompanyId,
      };
      api
        .getApi("/national/api/v1/nationalAdPlan/getScheduleByApID", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.scheduleList = (res.data.data || []).map((item) => {
              return { text: item, value: item };
            });
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {});
    },
    // 获取订单物料备注
    getAdMaterialRemarkList() {
      let info = {
        apID: this.apId,
      };
      api
        .getApi("/addsp/material/getAdMaterial", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.adMaterialRemarkList = (res.data.data || []).map((item) => {
              return { text: item, value: item };
            });
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {});
    },
    //获取选点排期
    getSetPoint(type, lIDs) {
      let loginData = this.sessionData;
      let info = {
        uid: loginData.uID,
        apID: this.apId,
        token: loginData.token,
        pageNum: this.currPage,
        pageSize: this.pageSize,
      };
      if (type && type === "change") {
        info.resName == this.changeKeyword;
        info.pageNum = this.pointCurrPage;
        info.pageSize = this.pointPageSize;
        this.handleType === 2 && (info.enableStop = true);
        info.lState = 1;
      } else {
        info.resName = this.keyword;
        info.companyId = this.currentCompanyId;
      }
      api
        .getApi("/national/api/v1/nationalAdPlan/pageCompanyAdlInfo", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let initData = res.data.data;
            let result = initData.list;
            this.total = initData.total;
            this.pointTotal = initData.total;
            this.changePointInfo.allPoint = initData.total;
            for (let data of result) {
              let time =
                this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
              data.timeRange = time;
              let finishTimeRange = "";
              if (data.lState == 2) {
                finishTimeRange =
                  this.formatTime(data.lStar) +
                  "-" +
                  this.formatTime(data.lSetTime);
              }
              data.finishTimeRange = finishTimeRange;
            }
            // 选点排期
            if (type && type == "change") {
              this.setpointArr = result;
              if (lIDs && lIDs.length > 0) {
                // 更改排期点位
                // this.changePointInfo.lIDArr = lIDs.concat(this.changePointInfo.lIDArr)
                let newlIDArr = lIDs.concat(this.changePointInfo.lIDArr);
                newlIDArr = Array.from(new Set(newlIDArr));
                this.changePointInfo.lIDArr = newlIDArr;
                this.setpointArr.forEach((item) => {
                  if (
                    this.changePointInfo.lIDArr.includes(item.lID) &&
                    item.isChange == 1
                  ) {
                    item.changePeriod = 1;
                  }
                });
              } else if (lIDs && lIDs.length == 0) {
                // 导入点位时lIDs为空数组
                let lastArr = this.tempSetPointArr.map((item) => item.lID);
                let tempAddArr = this.setpointArr.filter((item) => {
                  return !lastArr.includes(item.lID) && item.isNew == 1;
                });
                this.changePointInfo.addPointlist.push(...tempAddArr);
              }
              if (this.changePointInfo.addPointlist.length > 0) {
                this.changePointInfo.addPointNum =
                  this.changePointInfo.addPointlist.length;
                // 新增点位或导入点位
                for (let data of this.changePointInfo.addPointlist) {
                  for (let item of this.setpointArr) {
                    if (
                      item.isNew == 1 &&
                      data.asID == item.asID &&
                      data.timeRange == item.timeRange
                    ) {
                      item.isCurrNew = 1;
                    }
                  }
                }
              }
              this.tempSetPointArr = result;
              this.changePointPageFn();
            } else {
              // 选点排期表格
              this.currentPointArr = result;
            }

            // 城市筛选过滤点位更改记录
            this.filterCityData = filterFormat(result, "city");
            // console.log('城市filter', this.filterCityData)
            this.filtersArea = filterFormat(result, "rName");
            this.filtersData = filterFormat(result, "timeRange");
            this.changePointloading = false;
            this.currPointloading = false;
            this.loading = false;
            // this.maLoading = false;
            this.changePointloading = false;
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          this.loading = false;
          // this.maLoading = false;
          this.changePointloading = false;
          this.currPointloading = false;
          console.log(res);
        });
    },
    // 选择一条
    handleSelect(selection, row) {
      // console.log(selection, row, 'selection -row ');
      // 选中
      if (this.isHaveFun(selection, row)) {
        for (let data of selection) {
          if (!this.isHaveFun(this.changePointInfo.stopPointlist, data)) {
            this.changePointInfo.stopPointlist.push(data);
          }
        }
      } else {
        // 取消选中
        if (this.isHaveFun(this.changePointInfo.stopPointlist, row)) {
          this.changePointInfo.stopPointlist =
            this.changePointInfo.stopPointlist.filter((item) => {
              if (item.lID == row.lID) {
                return false;
              }
              return true;
            });
        }
      }
      console.log(this.changePointInfo.stopPointlist, "one--shoplist");
    },
    //全选
    handleSelectAll(selection) {
      if (selection.length) {
        for (let data of selection) {
          if (!this.isHaveFun(this.changePointInfo.stopPointlist, data)) {
            this.changePointInfo.stopPointlist.push(data);
          }
        }
      } else {
        for (let data of this.changePointArr) {
          if (this.isHaveFun(this.changePointInfo.stopPointlist, data)) {
            this.changePointInfo.stopPointlist =
              this.changePointInfo.stopPointlist.filter((item) => {
                if (item.lID == data.lID) {
                  return false;
                }
                return true;
              });
          }
        }
      }
      console.log(this.changePointInfo.stopPointlist);
    },
    //以终止的不可勾选
    selectInit(item) {
      if (item.beEnd == 1) {
        return false; //不可勾选
      } else {
        return true; //可勾选
      }
    },
    selectioUpdate() {
      console.log("是否勾选", this.changePointInfo.stopPointlist);
      let timer = setTimeout(() => {
        for (let data of this.changePointInfo.stopPointlist) {
          for (let item of this.changePointArr) {
            this.selectInit(item);
            if (data.asID == item.asID && data.timeRange == item.timeRange) {
              this.$refs.multipleTable.toggleRowSelection(item, true);
            }
          }
        }
        clearTimeout(timer);
      }, 0);
    },
    // 判断一个对象是否已经在数组中
    isHaveFun(arr, obj) {
      let res = arr.filter((item) => {
        if (item.asID == obj.asID && item.timeRange == obj.timeRange) {
          return true;
        }
        return false;
      });
      if (res.length) {
        return true;
      }
      return false;
    },
    //更换点位列表前端分页
    changePointPageFn() {
      let total = this.setpointArr.length;
      let pageNum = this.pointCurrPage;
      let pageSize = this.pointPageSize;
      let totalPage = 0;
      if (total / pageSize > parseInt(total / pageSize)) {
        totalPage = parseInt(total / pageSize) + 1;
      } else {
        totalPage = parseInt(total / pageSize);
      }
      this.pointTotal = total;
      var result = [];
      for (let i = 0; i < total; i += pageSize) {
        result.push(this.setpointArr.slice(i, i + pageSize));
      }
      //当前页
      this.changePointArr = result[pageNum - 1];
      //切换页数时勾选
      this.selectioUpdate();
      this.changePointloading = false;
      console.log("更换点位当前页数据--", this.changePointArr);
    },
    // 时间格式规范 年月日
    formatTime(val) {
      return dateFormat.toDate(val, "/");
    },
    // 时间格式规范 年月日时分秒
    formatToTime(val) {
      return dateFormat.toDateTime(val, "/");
    },
    // 价格加上逗号
    priceFormat(price) {
      return commaFormat.init(price);
    },
    priceToFormat(price) {
      return commaFormat.format(price);
    },
    // 随机生成合同编号
    getContractNo(rid) {
      let date = new Date();
      let result = "QC";
      result = result + dateFormat.toDate(date, "");
      result = result + rid.toString().substring(0, 4);
      result = result + "00" + Math.round(Math.random() * 10);
      return result;
    },
    // 搜索
    search(type) {
      if (type == "change") {
        //更换点位
        let t = [...this.tempSetPointArr];
        this.setpointArr = t.filter(
          (item) => item.resName.indexOf(this.changeKeyword) != -1
        );
        this.changePointPageFn();
      } else {
        this.getSetPoint();
      }
    },
    //重置
    reset(type) {
      if (type == "change") {
        this.changeKeyword = "";
        this.setpointArr = this.tempSetPointArr;
        this.changePointPageFn();
      } else {
        this.keyword = "";
        this.getSetPoint();
      }
    },
    //查询点位更新记录
    getPointRecord() {
      this.dialogChangePointRecord = true;
      api
        .getApi("/national/api/v1/nationalAdPlan/getOrderHistory", {
          apID: this.orderDetail.apID,
          companyId: this.currentCompanyId,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.recordList.info = {
              allPoint: res.data.data.totalAdsCount,
              stopPoint: res.data.data.stoppedAdsCount,
              newPoint: res.data.data.newAdsCount,
              normalPoint: res.data.data.usingAdsCount,
            };
            let arr = [];
            if (res.data.data.orderHistory.length) {
              for (let data of res.data.data.orderHistory) {
                let obj = {
                  ...data,
                  adsInfo: JSON.parse(data.adsInfo),
                };
                arr.push(obj);
              }
            }
            this.recordList.table = arr;
          } else {
            Message.warning(res.data.MSG);
          }
        });
    },

    // 城市筛选
    filterCity(value, row) {
      return row.city === value;
    },
    // 地区筛选
    filterRName(value, row) {
      return row.rName === value;
    },
    // 排期筛选
    filterTimeRange(value, row) {
      console.log(value);
      return row.timeRange === value;
    },
    // 取消修改合同编号
    cancelChangeID() {
      this.changeCID = false;
      Message.info("取消修改合同编号");
    },
    // 修改合同编号
    confirmChangeID() {
      let reg = /^[^\u4e00-\u9fa5]{0,}$/;
      if (!reg.test(this.apQC)) {
        Message.warning("只能输入字母、数字、符号");
        return;
      }
      let info = {
        apid: this.orderDetail.apID,
        apQC: this.apQC,
      };
      api
        .postApi_json("/national/api/v1/nationalAdPlan/editAdPlan", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.$set(this.orderDetail, "apQC", this.apQC);
            Message.success(res.data.MSG);
          } else {
            Message.warning(res.data.MSG);
          }
        });
      this.changeCID = false;
    },
    //点击换点
    changeHandleType(handleType) {
      this.handleType = handleType;
      this.initListData();
      this.handleTime = new Date().getTime();
      this.dialogChangePoint = true;
      this.changePointInfo.stopPointlist = [];
      this.changePointInfo.addPointlist = [];
      this.isHandleChange = false;
      this.getSetPoint("change");
    },
    //显示添加点位的模态框
    showAddPointDialog() {
      this.getMediaTypes();
      this.dialogAddPoint = true;
      this.IsAddPoint = !this.IsAddPoint;
    },
    //请求媒体类型列表
    getMediaTypes() {
      let info = {
        companyIds: this.companiesOfOrder.asrID,
      };
      api
        .getApi("/addsp/api/v1/company/mediaTypes", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.mediaTypeList = res.data.data;
          } else {
            this.$message({
              message: res.data.MSG,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("err:", err);
        });
    },

    // excel 导入点位弹框
    excelAddPointDialog() {
      this.dialogImportPoint = true;
    },
    resetDialogImportPoint() {
      this.dialogImportPoint = false;
    },
    refreshCurrentTable(lIDs) {
      this.currPointloading = true;
      if (lIDs) {
        // 更改排期
        this.getSetPoint("change", lIDs);
        this.getScheduleList();
        this.changePointInfo.stopPointlist = [];
      } else {
        // 新增点位
        this.getSetPoint("change");
      }
      this.isHandleChange = true;
    },
    resetDialogChangeRange() {
      this.changeRangeDialog = false;
    },
    //获取子组件选择的点位数据
    ievent(...data) {
      this.addAdsArr = data[0]; //this.encodeHtml(data[0])
    },
    //添加点位对话框确认按钮
    confirmAddPoint() {
      let addload = this.$loading({
        lock: true,
        text: "加急添加中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let arr = [];
      for (let key of this.addAdsArr) {
        let adsInfo = {
          resName: key.resName,
          city: key.city,
          tradingArea: key.tradingArea,
          asrID: key.asrID,
          cityId: key.rid,
          mediaTypeId: key.mediaTypeId,
          asID: Number(key.asID),
          pdID: null,
          pbStar: key.schedules.split("-")[0].split("/").join("-"), // 开始投放时间
          pbEnd: key.schedules.split("-")[1].split("/").join("-"), // 开始投放时间添加点位对话框确认按钮
          uID: this.sessionData.uID,
          mTitle: key.mediaName,
          asLab: key.asLab,
          rName: key.origin,
          cType: key.buildType,
          timeRange: key.schedules,
          hNum: key.houseNum,
          hPrice: key.buildPrice * 100,
          fNum: key.buildNum,
          chDay: key.liveYear,
          notPush: key.adLimit,
          isNew: 1,
        };
        for (let pKey of this.pdidList) {
          if (
            key.city == pKey.city &&
            key.asrID == pKey.asrID &&
            pKey.mediaTypeId == key.mediaTypeId
          ) {
            adsInfo.pdID = pKey.pdID;
            break;
          }
        }
        arr.push(adsInfo);
      }
      let postData = {
        apID: this.orderDetail.apID,
        mark: this.handleTime,
        orderNewAdsInfos: arr,
        orderStoppedAdsInfos: [],
      };
      api
        .postApi_json(
          this.apiVar.Advertisement + "/UpdateOrder",
          JSON.stringify(postData)
        )
        .then((res) => {
          addload.close();
          if (res.data.SysCode === 300500) {
            Message.warning(res.data.MSG);
          } else {
            if (res.data.SysCode != 200200) {
              this.$message({
                message: "新增点位失败",
                type: "warning",
              });
            } else {
              Message.success("添加点位成功");
              for (let data of arr) {
                this.changePointInfo.addPointlist.push(data);
              }
              this.dialogAddPoint = false;
              this.IsAddPoint = true;
              this.changePointInfo.addPointNum =
                this.changePointInfo.addPointlist.length;
              this.refreshCurrentTable();
            }
          }
        });
    },
    //添加点位对话框取消按钮
    cancelAddPoint() {
      this.dialogAddPoint = false;
    },
    // 获取换画列表
    getPainlist() {
      let info = {
        apID: this.apId,
        companyId: this.currentCompanyId,
      };
      api
        .getApi("/national/api/v1/replace/list", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.painList = res.data.data || [];
          } else {
            this.painList = [];
            sessFun.messageFun("warning", res.data.msg);
          }
        })
        .catch(() => {
          this.painList = [];
        });
    },
    //跳到换画tab
    /* toSixthTab() {
      this.planPanel = "sixth";
    }, */
    //隐藏
    hidePainModal() {
      // this.showPainModal = false;
    },
    //点击换画
    changePain() {
      if (this.painList.length > 0) {
        // this.showPainModal = false;
        //跳到换画报告tab
        // this.showPain = true;
        // this.planPanel = "sixth";
      } else {
        // this.showPain = false;
        //第一次
        // this.showPainModal = true;
      }
      setTimeout(() => {
        this.fromType = !this.fromType;
      }, 10);
    },
    // 操作提示统一方法
    messageFun(mesType, mes) {
      this.$message({
        message: mes,
        type: mesType,
        showClose: true,
      });
    },
    //修改订单金额-取消
    cancelChangePrice() {
      this.changePriceModal = false;
      this.getOrderPriceDetail();
      Message.info("已取消操作");
    },
    //修改金额-成功
    doneChangePrice() {
      this.changePriceModal = false;
      this.getOrderPriceDetail();
      this.getListCompanyFee()
      this.getInitData();
      sessFun.messageFun("success", "修改订单金额成功");
    },

    changePrice() {
      this.changePriceModal = true;
      this.handleTime = new Date().getTime();
    },

    // 获取公司订单金额
    getListCompanyFee () {
      const params = {
        apID: this.apId
      }
      api.getApi('/national/api/v1/nationalAdPlan/listCompanyFee', params).then((res) => {
        if (res.data.SysCode === 200200) {
          console.log(res.data.data, 'res.data.data')
          this.companyList = res.data.data
        } else {
          this.$message({
            type: 'warning',
            message: '获取公司金额失败！'
          });
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.ellipsis-td {
  width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*选点排期列表底部提示*/
.table-bottom-tip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  margin-top: 24px;
  position: relative;
  height: 48px;
}

.table-bottom-tip .ad_pagination {
  position: absolute;
  right: 0;
  margin-top: 0;
}

.table-bottom-tip p {
  margin-right: 24px;
}

.table-bottom-tip .color-line {
  display: inline-block;
  width: 2px;
  height: 12px;
  margin-right: 8px;
  position: relative;
  top: 2px;
}

/*修改合同号*/
.changeCID {
  color: #1890ff;
  cursor: pointer;
  font-size: 16px;
}

/*tabbar*/
/deep/ .el-textarea__inner {
  resize: vertical;
}

/deep/ .el-tabs__nav-wrap::after {
  background-color: transparent;
}

.box-wrap {
  background-color: #fff;
}

.first-wrap h4 span {
  font-size: 14px;
  color: #666;
  font-weight: normal;
  float: right;
  margin-right: 35px;
}

.price_quo {
  margin: 0px 32px;
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

/deep/ .el-table__column-filter-trigger {
  position: relative;
  left: 5px;
}

.table_wrap {
  margin: 16px 32px;
}

/* 搜索 */
.el-input {
  width: 180px;
  border-radius: 4px;
}

.input-with-select /deep/ .el-input__inner {
  font-size: 14px;
  vertical-align: middle;
  margin-right: 4px;
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
  border-radius: 4px;
}

/deep/ .el-input__inner {
  font-size: 14px;
  vertical-align: middle;
}

/*报价单*/

/deep/ .el-tabs--border-card {
  box-shadow: none;
}

/*详情头部*/
.content_top_wrap {
  padding: 24px 32px;
  background: #ffffff;
  /* border: 1px solid #dedede; */
  /* height: 145px; */
  position: relative;
}

.plan-title .handleBtn {
  position: absolute;
  display: flex;
  right: 28px;
  top: 30px;
}

.plan-title .handleBtn button {
  width: 74px;
  height: 32px;
  font-size: 14px;
  line-height: 9px;
  padding: 0;
}

.plan-title h4 {
  font-size: 20px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  margin-bottom: 22px;
}

.plan-title h4 p {
  display: inline-block;
  font-size: 14px;
  color: #666666;
  font-weight: normal;
  margin-left: 11px;
}

.plan-title h4 p img {
  width: 14px;
  height: 14px;
  position: relative;
  top: 1px;
  cursor: pointer;
}

.plan-title h4 img {
  width: 28px;
  height: 28px;
  position: relative;
  top: 5px;
  margin-right: 16px;
}

.plan-title .el-input__inner {
  width: 100%;
}

/*物料信息*/
/deep/ .el-table_2_column_16 .cell {
  text-align: right;
  padding-right: 20px;
}

/*页码*/
.pager {
  height: 32px;
  margin-top: 30px;
  text-align: right;
}

/* 换画 */
.changepic_box {
  margin: 0px 32px 32px;
}

/*按钮*/
.content_bottom_btn {
  width: 100%;
  text-align: center;
  margin: 32px 0;
}

.content_bottom_btn /deep/ .el-button span a {
  color: #606266;
}

/*换点表格*/
/deep/ .el-table td,
.el-table th {
  padding: 4px 0;
  height: 48px;
}

/*添加点位对话框*/
.first-wrap /deep/ .el-dialog {
  width: 87% !important;
}

/deep/ .el-dialog {
  width: 87%;
}

/*选择点位*/
/deep/ .el-date-editor .el-range__icon {
  position: relative;
  top: -2px;
  left: -3px;
}

/deep/ .el-table__row td:nth-child(2) .cell span {
  width: 225px;
}

/deep/ .table_wrap .el-table__row td:nth-child(2) .cell span {
  width: 14px;
}

/deep/ .plan-select .el-input__inner {
  width: 180px;
  margin-left: -13px;
  height: 32px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

/deep/ .el-date-editor .el-range__icon {
  position: relative;
  top: -2px;
  left: -3px;
}

/* 更换点位 */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .el-table-column--selection {
  @extend .flex-center;
  .cell {
    @extend .flex-center;
  }
}
/deep/ .el-table__expand-column .cell {
  @extend .flex-center;
}
/* 搜索 */
.search-row {
  margin: 0 32px 0;
}
.change-point-select {
  width: 74px;
  margin-left: 8px;
  margin-right: 8px;
  :hover,
  :focus {
    color: #409eff;
    border-color: #409eff;
    /deep/ .el-icon-arrow-up {
      color: #409eff;
    }
  }
  /deep/ .el-input__inner {
    text-align: center;
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 20px;
  }
  /deep/ .el-input__suffix {
    right: 1px;
  }
}
.add-point-select {
  width: 100px;
  margin-left: 8px;
  :hover,
  :focus {
    color: #409eff;
    border-color: #409eff;
    /deep/ .el-icon-arrow-up {
      color: #409eff;
    }
  }
  /deep/ .el-input__inner {
    padding-left: 8px;
  }
}

/*日期控件*/
/deep/ .el-range-separator {
  position: relative;
  top: -2px;
}

/deep/ .search-row .el-input__inner {
  height: 32px;
  line-height: 32px;
}

/deep/ .el-dialog__body {
  padding: 5px 24px;
}

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

@media screen and (max-width: 1440px) {
  /deep/ .imgPreview .el-dialog__body img {
    height: 450px;
  }
}

/deep/ .el-dialog__footer {
  padding: 0px 20px 20px;
  text-align: center;
}

/deep/ .el-dialog /deep/ .el-input__inner {
  width: 100%;
}

/deep/ .el-dialog .inline_dialog /deep/ .el-input {
  width: auto;
}

/deep/ .table_mater .el-button--small,
.el-button--small.is-round {
  padding: 0;
}

/deep/ .table_mater .el-button--small,
.el-button--small.is-round i {
  font-size: 16px;
}

/deep/ .table_mater .el-button {
  height: auto;
  border: none;
}

/* 物料信息弹出框 */
/deep/ .el-pagination .el-select .el-input .el-input__inner {
  width: 100px;
}

/deep/ .el-pagination__editor.el-input .el-input__inner {
  width: 50px;
}

/deep/ .company-tabs > .el-tabs__header {
  border-bottom: 1px solid #e6e7e9;
  height: 53px;
  line-height: 54px;
}

/*1920*/
@media all and (min-width: 1900px) {
  .plan-title .handleBtn {
    position: absolute;
    top: 30px;
  }
}

/deep/ .el-upload-list__item.is-success {
  display: none;
}

/deep/ .el-upload-list__item.is-1 {
  display: none;
}

/deep/ .disabled .el-upload--picture-card {
  display: none;
}

/deep/ .el-table__expanded-cell[class*="cell"] .el-form {
  height: 44px;
  line-height: 44px;
}

/deep/ .el-table__expanded-cell[class*="cell"] {
  padding: 0 46px;
  background-color: #f7f7f7;
}

/deep/ .el-table__row .cell span {
  overflow-x: initial;
}

.table_wrap /deep/ .el-form-item__content {
  line-height: 46px;
}

/deep/ .table_wrap .el-table__body-wrapper {
  min-height: auto;
}

.box-wrap,
#pane-second {
  margin-bottom: 32px;
}

.resName-wrap {
  position: relative;
}

.resName-wrap .color-line {
  float: left;
  width: 3px;
  height: 47px;
  background-color: #1890ff;
}

.table-top-tip {
  background: #e6f7ff;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  margin: 16px 0;
  padding: 9.5px;
}

.table-top-tip /deep/ .el-icon-info {
  margin-right: 4px;
}

.table-top-tip h4 {
  font-size: 14px;
  display: inline-block;
}

.table-top-tip em {
  font-size: 14px;
  font-weight: normal;
  margin: 0 6px;
  cursor: pointer;
  color: #1890ff;
}

/*点位更改记录*/
.record-table-wrap {
  padding: 16px 12px;
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}

.record {
  position: relative;
}

.record .line {
  width: 1px;
  height: 100%;
  background-color: #1890ff;
  position: absolute;
  left: 0;
  top: 0;
  margin-top: 14px;
}

.record .line::before {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid #1890ff;
  position: absolute;
  top: -9px;
  left: -4px;
  background-color: #fff;
}

.record .content {
  margin-left: 16px;
  padding-bottom: 25px;
}

.record .content h6 {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 9px;
}

.record .content h6 span {
  margin-left: 25px;
}

.record .price-wrap {
  display: flex;
  color: rgba(0, 0, 0, 0.85);
  font-weight: bold;
  padding: 8px 16px;
  box-sizing: border-box;
  background: rgba(250, 250, 250, 1);
  border-radius: 4px;
  border: 1px solid rgba(232, 232, 232, 1);
  margin-top: 10px;
}

.record .price-wrap p {
  margin-right: 24px;
}

.record .price-wrap p span {
  color: #1890ff;
  font-weight: normal;
}

/*滚动条*/
.record-table-wrap {
  height: 500px;
  overflow-y: auto;
  overflow-x: hidden !important;
}

.record-table-wrap::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background: #fafafa;
}

.record-table-wrap::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/

  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c1c1c1;
  border-radius: 4px;
}

.record-table-wrap /deep/ .el-table__body-wrapper,
.el-table__empty-block {
  min-height: 40px;
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
  background: rgba(0, 0, 0, 0.02);
}

/deep/ .el-upload--text .el-upload-dragger img {
  width: 28px;
  height: 30px;
}
</style>