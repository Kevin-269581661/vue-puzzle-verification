<template>
  <div class="ad_mediaDetail_wrap clearfix">
    <div class="ad_mediaDetail_nav">
      <p class="clearfix" v-if="!isNation">
        <a href="#" style="color: #999">方案管理</a><em> / </em><a href="#">方案列表</a>
      </p>
      <p v-else><a href="#">方案管理</a></p>
    </div>

    <div class="mediaList_wrap mediaList_search">
      <el-row class="search_row" :gutter="24">
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="search-item">
            <span>关键词：</span>
            <el-input placeholder="请输入内容" v-model="searchInfo.keyword" size="small" class="u-select">
              <el-select v-model="searchInfo.select" slot="prepend" placeholder="请选择">
                <el-option label="方案名称" value="1"></el-option>
                <el-option label="客户名称" value="2"></el-option>
                <el-option label="品牌名称" value="3"></el-option>
                <el-option v-if="['ADN_MD_COUNTRY', 'ADN_MD'].includes(role)" label="所属销售" value="4"></el-option>
              </el-select>
            </el-input>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="search-item">
            <span>日期：</span>
            <el-select size="small" v-model="searchInfo.dateType" placeholder="请选择" class="u-date">
              <el-option label="上刊日期" value="0"></el-option>
              <el-option label="下刊日期" value="1"></el-option>
              <el-option label="创建日期" value="2"></el-option>
              <!--<el-option label="换画日期" value="2"></el-option>-->
            </el-select>
            <el-date-picker size="small" class="u-date-picker" v-model="searchInfo.rangeDate" type="daterange"
              range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="选择日期"
              end-placeholder="选择日期">
            </el-date-picker>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="search-item">
            <span>选择状态：</span>
            <el-select v-model="searchInfo.status" placeholder="请选择状态" size="small" class="u-select2">
              <el-option v-for="item of stateList" :key="item.value" :label="item.text" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="search-item">
            <span>选择城市：</span>
            <el-select v-model="searchInfo.cityWord" placeholder="请选择投放城市" filterable size="small" class="u-select2">
              <el-option v-for="item of filterCityData" :key="item.rID" :label="item.text" :value="item.text">
              </el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="search-item" v-if="isAll">
            <span>选择公司：</span>
            <el-select v-model="searchInfo.company" placeholder="请选择所属公司" filterable size="small" class="u-select2">
              <el-option v-for="item of companyData" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="search-item">
            <span>是否预锁：</span>
            <el-select v-model="searchInfo.Lock" placeholder="是否预锁" size="small" class="u-select2">
              <el-option label="已预锁" value="2"></el-option>
              <el-option label="未预锁" value="1"></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <div class="btn_wrapper">
            <el-button type="primary" icon="el-icon-search" @click="search()" :disabled="!isSearch" class="marginR">搜索
            </el-button>

            <el-button plain @click="reset()" :disabled="!isReset" class="marginR">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="mediaList_wrap">
      <div class="mediaList_container">

        <div class="mediaList_title">
          <h2>方案列表</h2>

          <div class="m-act">
            <div class="btn_box">
              <el-button plain @click.native.prevent="openRecycleBin" class="marginR">回收站</el-button>

              <el-button plain v-if="['ADN_MD_COUNTRY', 'ADN_MD'].includes(role) && showExportBtns.includes(8)"
                @click.native.prevent="allPointExportVisible = true" class="marginR">总点导出</el-button>

              <template v-if="showNewBtn || !isNation">
                <el-button plain @click="reset()" v-if="showExportBtns.includes(6)" @click.native.prevent="exportRes"
                  class="marginR">门店导点</el-button>
                <el-button plain v-if="showNewBtn" @click.native.prevent="isOpenDownload = true" class="marginR">空位导出
                </el-button>
              </template>

              <template v-if="showNewBtn || !isNation">
                <el-button type="primary" icon="el-icon-plus" v-if="showNewBtn" @click="addOne()" class="marginR">新建
                </el-button>
              </template>
            </div>

            <!-- 列设置 -->
            <TableSetting refresh space filter :columns="currentPlanColumn" cacheKey="planList" @filterColumn="filterColumn"
              @refreshTable="refreshTable" @spaceSetting="spaceSetting">
            </TableSetting>

          </div>
        </div>
        <div class="table_wrap">
          <el-table @filter-change="filterChange" :data="currentPlan" style="width: 100%" @sort-change="sortChange" v-loading="loading"
            element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading" :key="itemKey" :size="rowSpace">
            <template v-for="item in currentPlanColumn">

              <template v-if="item.label === '方案名称'">
                <el-table-column :prop="item.prop" :label="item.label" min-width="14.9%" v-if="item.isChecked"
                  :fixed="item.fix === 'left' ? true : false">
                  <template slot-scope="scope">
                    <span class="u-bk-btn" v-if="scope.row.apSrc != 0">贝壳</span>
                    <span style="color: rgba(24, 144, 255, 1); cursor: pointer" @click="ToDetail(scope.row)">{{
                        scope.row.apName
                    }}</span>
                  </template>
                </el-table-column>
              </template>

              <template v-if="item.label === '客户名称'">
                <el-table-column :prop="item.prop" :label="item.label" min-width="12.6%" show-overflow-tooltip
                  v-if="item.isChecked" :fixed="item.fix === 'left' ? true : false">
                </el-table-column>
              </template>

              <template v-if="item.label === '品牌名称'">
                <el-table-column :prop="item.prop" :label="item.label" min-width="7.6%" show-overflow-tooltip
                  v-if="item.isChecked" :fixed="item.fix === 'left' ? true : false">
                </el-table-column>
              </template>

              <template v-if="item.label === '方案价格'">
                <el-table-column :prop="item.prop" :label="item.label" sortable="custom" width="120px" align="right"
                  v-if="item.isChecked" :fixed="item.fix === 'left' ? true : false">
                  <template slot-scope="scope">
                    <span v-if="scope.row.apState == '-1'">--</span>
                    <span v-else>&yen;{{
                        scope.row.apTotal ? priceFormat(scope.row.apTotal / 100) : 0
                    }}</span>
                  </template>
                </el-table-column>
              </template>

              <template v-if="item.label === '所有人'">
                <el-table-column :prop="item.prop" :label="item.label" min-width="8.1%"
                  v-if="!(role == 'AD') && !['ADN_BD_KA', 'ADN_BD'].includes(role) && item.isChecked"
                  show-overflow-tooltip :fixed="item.fix === 'left' ? true : false">
                </el-table-column>

                <el-table-column :prop="item.prop" :label="item.label" min-width="8.1%"
                  v-if="['ADN_BD_KA', 'ADN_BD'].includes(role) && item.isChecked" show-overflow-tooltip
                  :filters="filterRealName" :filter-method="filterRealNameFun" :filter-multiple="true"
                  :fixed="item.fix === 'left' ? true : false">
                </el-table-column>
              </template>

              <template v-if="item.label === '投放城市(点位面数,排期)'">
                <el-table-column :prop="item.prop" :label="item.label" min-width="25.8%" v-if="item.isChecked"
                  :fixed="item.fix === 'left' ? true : false">
                  <template slot-scope="scope">
                    <template v-if="isAll">
                      <div v-for="(item, index) of scope.row.cityArea" class="city_p">
                        <el-tooltip class="item" effect="dark" :content="
                          item.asName +
                          ' ' +
                          item.city +
                          '(' +
                          item.num +
                          '面,' +
                          formatTime(item.pdStar) +
                          '至' +
                          formatTime(item.pdEnd) +
                          ')'
                        " placement="top">
                          <div>
                            <span>
                              {{
                                  item.city +
                                  "(" +
                                  item.num +
                                  "面," +
                                  formatTime(item.pdStar) +
                                  "至" +
                                  formatTime(item.pdEnd) +
                                  ")"
                              }}
                            </span>
                          </div>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="'距离解锁还剩' + item.RemainDay + '天'"
                          placement="top">
                          <span v-show="item.RemainDay" class="lock-icon">
                            <b :class="item.RemainDay <= 3 ? 'red' : 'blue'">{{
                                item.RemainDay
                            }}</b>
                          </span>
                        </el-tooltip>
                      </div>
                    </template>
                    <template v-else>
                      <div v-for="item of scope.row.cityArea" :key="item.rid + '-' + item.asrID" class="city_p">
                        <el-tooltip class="item" effect="dark" :content="
                          item.asName +
                          ' ' +
                          item.city +
                          '(' +
                          item.num +
                          '面,' +
                          formatTime(item.pdStar) +
                          '至' +
                          formatTime(item.pdEnd) +
                          ')'
                        " placement="top">
                          <p v-if="item.apState == '-1'">
                            {{
                                item.city +
                                "(" +
                                "--面," +
                                formatTime(item.pdStar) +
                                "至" +
                                formatTime(item.pdEnd) +
                                ")"
                            }}
                          </p>
                          <p v-else>
                            {{
                                item.city +
                                "(" +
                                item.num +
                                "面," +
                                formatTime(item.pdStar) +
                                "至" +
                                formatTime(item.pdEnd) +
                                ")"
                            }}
                          </p>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="'距离解锁还剩' + item.RemainDay + '天'"
                          placement="top">
                          <span v-show="item.RemainDay" class="lock-icon">
                            <b :class="item.RemainDay <= 3 ? 'red' : 'blue'">{{
                                item.RemainDay
                            }}</b>
                          </span>
                        </el-tooltip>
                      </div>
                    </template>
                  </template>
                </el-table-column>
              </template>

              <template v-if="item.label === '媒体类型'">
                <el-table-column
                  :prop="item.prop"
                  :label="item.label"
                  width="250px"
                  show-overflow-tooltip
                  column-key="mediaTypeNames"
                  v-if="(role == 'ADN_MD' || role == 'ADN_MD_COUNTRY' || role == 'ADN_BD' || role == 'ADN_SM') && item.isChecked"
                  :fixed="item.fix === 'left' ? true : false"
                  :filters="mediaTypeFilterList"
                >
                  <template slot-scope="scope">
                    <!-- <div class="media-tag" v-for="t in scope.row.details" :key="t.mediaTypeId">
                      <div class="tag ad">
                        <el-tooltip class="item" effect="dark" :content="`预锁剩余3天${t.RemainDay}`" placement="top">
                          <img src="@/assets/images/suo-icon-ad.png" class="icon">
                        </el-tooltip>
                        {{ t.mediaTypeName }}{{ t.RemainDay ? `${t.RemainDay}天` : '' }}
                      </div>

                      <div class="tag light-box">
                        <el-tooltip class="item" effect="dark" content="预锁剩余3天" placement="top">
                          <img src="@/assets/images/suo-icon.png" class="icon">
                        </el-tooltip>
                        单元门禁灯箱（3天）
                      </div>
                    </div> -->
                    <div class="media-box">
                        <div class="media-tag" v-for="(m, index) in scope.row.mediaTypeDetails" :key="index">
                            <div
                                class="tag"
                                :class="m.mediaTypeName === '广告门' ? 'ad' :
                                        m.mediaTypeName === '单元门禁灯箱' ? 'unit-access':
                                        m.mediaTypeName === '灯箱' ? 'light-box':
                                        m.mediaTypeName === '道闸' ? 'brake': ''">
                                <template v-if="m.RemainDay">
                                    <el-tooltip class="item" effect="dark" :content="`预锁剩余${m.RemainDay || 0}天`" placement="top">
                                    <i class="el-icon-lock icon"></i>
                                    </el-tooltip>
                                    {{ m.mediaTypeName }}{{ `（剩${m.RemainDay}天）` }}
                                </template>
                                <template v-else>
                                    {{ m.mediaTypeName }}
                                </template>
                            </div>

                        </div>
                    </div>
                  </template>
                </el-table-column>

              </template>

              <template v-if="item.label === '创建日期'">
                <el-table-column :prop="item.prop" :label="item.label" width="100px" sortable="custom"
                  show-overflow-tooltip v-if="item.isChecked" :fixed="item.fix === 'left' ? true : false">
                  <template slot-scope="scope">
                    <span>{{ formatTime(scope.row.apcTime) }}</span>
                  </template>
                </el-table-column>
              </template>

              <template v-if="item.label === '状态'">
                <el-table-column class="tac" :prop="item.prop" :label="item.label" min-width="6.1%"
                  show-overflow-tooltip v-if="item.isChecked" :fixed="item.fix === 'left' ? true : false">
                  <template slot-scope="scope">
                    <point-state :state-text="stateToText(scope.row.apState).text"
                      :color="stateToText(scope.row.apState).color"></point-state>
                  </template>
                </el-table-column>
              </template>

              <template v-if="item.label === '操作'">
                <el-table-column :label="item.label" width="100px"
                  v-if="!(role == 'ADN_OP' || role == 'AD') && item.isChecked"
                  :fixed="item.fix === 'left' ? true : false">
                  <template slot-scope="scope">
                    <el-dropdown size="small" trigger="click" placement="bottom-start" :hide-on-click="false">
                      <span class="el-dropdown-link">
                        操作<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native.prevent="addPoint(scope.row)"
                          :disabled="isDisable || scope.row.apState !== -1">配点
                        </el-dropdown-item>

                        <el-dropdown-item @click.native.prevent="preload(scope.row)" :disabled="
                          isDisable ||
                          scope.row.apState !== 1 ||
                          (scope.row.apState == 1 && !scope.row.canLock) ||
                          medaiTypePermissions(scope.row.details)
                        ">预锁
                        </el-dropdown-item>

                        <el-dropdown-item @click.native.prevent="release(scope.row)" :disabled="
                          isDisable ||
                          scope.row.apState !== 1 ||
                          (scope.row.apState != 1 &&
                            scope.row.apControlLevel !== 1) ||
                          medaiTypePermissions(scope.row.details)
                        ">发布
                        </el-dropdown-item>

                        <el-dropdown-item @click.native.prevent="clearLock(scope.row)" :disabled="
                          isDisable ||
                          scope.row.apState !== 1 ||
                          (scope.row.apState == 1 && !scope.row.unLock) ||
                          medaiTypePermissions(scope.row.details)
                        ">解除预锁
                        </el-dropdown-item>

                        <el-dropdown-item @click.native.prevent="splitAdPlan(scope.row)" v-if="
                          scope.row.apControlLevel === 2 &&
                          ['ADN_BD_KA', 'ADN_BD'].includes(sessionData.uType)
                        ">
                          拆单
                        </el-dropdown-item>
                        <el-dropdown-item :disabled="
                          scope.row.apState !== 1 && scope.row.apState !== -1
                        " @click.native.prevent="deleteAdPlan(scope.row)">
                          删除
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </template>

            </template>

            <div slot="empty">
              <no-search-result></no-search-result>
            </div>
          </el-table>

          <div class="ad_pagination">
            <p>注：<span>3</span>表示预锁天数</p>
            <el-pagination background v-if="paginationShow" @size-change="sizeChange" @current-change="changePage"
              :current-page.sync="currPage" :page-sizes="pageSizes" :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="totalNum">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!--存在异常未完成的方案-->
    <el-dialog title="您有一个新方案未完成保存，是否继续编辑？" :visible.sync="unfinishedDialogVisible" width="400px"
      custom-class="unfinished_plan_dialog" :close-on-click-modal="false">
      <div>
        <ul>
          <li class="unfinished_plan_li">
            <span>方案名称:</span>
            <span>{{ planInfo.planName }}</span>
          </li>
          <li class="unfinished_plan_li">
            <span>所属销售:</span>
            <span>{{ planInfo.ownerSales }}</span>
          </li>
          <li class="unfinished_plan_li">
            <span>创建时间:</span>
            <span>{{ planInfo.cleatTime }}</span>
          </li>
          <li class="unfinished_plan_li">
            <span v-if="IsSevenBD">
              <span>已选小区:</span>
              <span>{{ planInfo.adsNum }} 个</span>
            </span>
            <span v-else>
              <span>已选点位:</span>
              <span>{{ planInfo.adsNum }} 面</span>
            </span>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="cancelEdit">放 弃</el-button>
        <el-button type="primary" class="u-btn" @click="continueEdit">继续编辑</el-button>
      </span>
    </el-dialog>

    <!-- 导出空点 -->
    <el-dialog title="空位导出" :visible.sync="isOpenDownload" width="30%">
      <download-vacancy @cancelClick="isOpenDownload = false"></download-vacancy>
    </el-dialog>
    <!-- 总点导出 -->
    <el-dialog title="总点导出" :visible.sync="allPointExportVisible" width="300px">
      <All-Point-Export @cancelClick="allPointExportVisible = false"></All-Point-Export>
    </el-dialog>

    <!--发布方案-->
    <el-dialog title="发布方案" :visible.sync="publishPlanDialog" :close-on-click-modal="false"
      custom-class="publish_dialog" :show-close="false" width="368px">
      <span class="comment">完善以下信息后提交，即可完成发布</span>
      <el-form label-position="top">
        <el-form-item label="合同编号" label-width="80px">
          <el-input size="small" v-model="QCinfo"></el-input>
        </el-form-item>
        <el-form-item label="订单类型" label-width="80px">
          <el-select v-model="planType" size="small" placeholder="请选择活动区域">
            <el-option label="常规" value="0"></el-option>
            <el-option label="续刊" value="1"></el-option>
            <el-option label="补刊" value="2"></el-option>
            <el-option label="空刊" value="3"></el-option>
            <el-option label="赠送" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="planType == 1 || planType == 2" :label="`${['常规', '续刊', '补刊', '空刊', '赠送'][planType]}订单`"
          label-width="80px">
          <el-select v-model="relatedApId" size="small" :placeholder="`请选择${['常规', '续刊', '补刊', '空刊', '赠送'][planType]
          }的订单`" filterable :clearable="true">
            <el-option v-for="item in apList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="publishPlanDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitRelease" class="u-new-btn">确 定</el-button>
      </div>
    </el-dialog>

    <!--周边小区导出-->
    <el-dialog :title="`门店导点(` + exportResStep + `/3)`" :visible.sync="isResExport" :close-on-click-modal="false"
      custom-class="Import_dialog" :show-close="false" width="448px">
      <p class="info_box" v-show="isShowExportTag">
        <i class="el-icon-warning" style="color: #1890ff"></i>
        {{
            exportResStep === 1
              ? "第一步：填写导出的基本参数"
              : exportResStep === 2
                ? "第二步：下载模板，指定周边越多，需要导出时间越长"
                : "第三步：上传填写好的表格，并点击提交"
        }}
        <!--                    <i class="el-icon-close" @click="isShowExportTag = false"></i>-->
      </p>
      <ul class="export_ul" v-show="exportResStep === 1">
        <li>
          <span>投放排期：</span>
          <el-date-picker v-model="exportInfo.date" size="small" type="daterange" range-separator="⇀" align="right"
            value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </li>
        <li>
          <span>媒体类型：</span>
          <el-select size="small" class="m_ehicle_class" multiple collapse-tags v-model="exportInfo.mediaTypeIds"
            placeholder="请选择媒体类型">
            <el-option v-for="(item, index) in allMediaTypes" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </li>
        <li>
          <span>匹配范围：</span>
          <el-input size="small" class="radius_input" placeholder="请输入1 ~ 10000的整数" v-model="exportInfo.radius">
            <template slot="append">米</template>
          </el-input>
        </li>
        <li>
          <span>导出模板：</span>
          <el-select v-model="exportInfo.type" size="small" filterable placeholder="请选择导出类型">
            <el-option label="模板A：1小区/1门店(有距离)" value="1"></el-option>
            <el-option label="模板B：1小区/多门店(无距离)" value="2"></el-option>
          </el-select>
        </li>
      </ul>
      <div class="export_step_box" v-show="exportResStep === 2">
        <img src="../../assets/images/export.png" alt="" />
        《QADN-数据导入-模板》
        <a :href="apiVar.qadnUrl + '/importTemplate/broundData.xlsx'" download="数据导入模板.xlsx" class="downloag_btn">点击下载<i
            class="el-icon-download"></i></a>
      </div>
      <div v-show="exportResStep === 3">
        <el-upload ref="exportRes" class="upload-demo" drag :action="exportAction" :file-list="exportFileData"
          :show-file-list="true" :http-request="exportUploadFile" :on-remove="exportFileRemove" :multiple="false">
          <img src="../../assets/images/export.png" alt="" />
          <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
        </el-upload>
      </div>
      <div slot="footer">
        <el-button size="small" plain @click="isResExport = false">取 消</el-button>
        <el-button size="small" plain v-show="exportResStep > 1"
          @click="exportResStep > 1 ? exportResStep-- : (exportResStep = 1)">上一步</el-button>
        <el-button size="small" type="primary" @click="nextExportRes" :loading="isBroundImport">
          {{
              isBroundImport ? "导出中.." : exportResStep >= 3 ? "确定" : "下一步"
          }}
        </el-button>
      </div>
    </el-dialog>

    <!-- 回收站 -->
    <recycleBinDialog :visible.sync="isShowRecycleBin" v-if="isShowRecycleBin" @confirm="reset" />


    <div class="media-type-dialog">
      <el-dialog :visible.sync="mediaDialogVisible" width="280px" :show-close="false">
        <h2 class="title"><img src="@/assets/images/question-circle.png" class="icon" /> 确认锁定该方案的点位吗？</h2>
        <div class="ctn" v-if="mediaDialogVisible">
          <h3>请选择要预锁的媒体类型</h3>
          <el-checkbox-group v-model="mediaTypeChecks">
            <div class="checkbox-item" v-for="item in currentMediaType" :key="item.value">
              <el-checkbox :label="item.value" :disabled="medaiTypePermissions(currentMediaType)">{{ item.label }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
          <div class="btn-box">
            <el-button class="btn" @click="handleMediaTypeCancel">取 消</el-button>
            <el-button type="primary" @click="handleMediaTypeCommit">确 定</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import api from "../../api/api.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";
// 方案缓存
import cacheAdPlan from "../../commonFun/cacheAdPlan";
import downloadVacancy from "../../components/common/components/vacancyDownload.vue";
import AllPointExport from "../../components/common/components/allPointExport.vue";
import noSearchResult from "./components/noSearchResult.vue";
import pointState from "./components/pointState.vue";
// 表格设置
import TableSetting from "./components/TableSetting/index.vue";

// 回收站
import recycleBinDialog from "./components/recycleBinDialog.vue";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
import timeFormat from "../../commonFun/timeFormat.js";
import { fastLerp } from "echarts-wordcloud/dist/echarts-wordcloud";
export default {
  name: "projectList",
  components: {
    downloadVacancy,
    noSearchResult,
    pointState,
    recycleBinDialog,
    AllPointExport,
    TableSetting
  },
  data() {
    return {
      // 搜索数据
      searchInfo: {
        // 搜索的select框
        select: "1",
        // 关键字
        keyword: "",
        // 时间范围
        rangeDate: "",
        //日期类型
        dateType: "0",
        // 状态筛选
        status: "",
        // 公司搜索
        company: "",
        // 城市筛选
        cityWord: "",
        // 是否预锁
        Lock: "",
        // 按照啥排序
        orderby: "",
        // 升序降序0/1
        desc: "",
        // 媒体类型ids
        mediaTypeIds: ""
      },
      // 公司列表
      companyData: [],
      // 分页信息
      paginationShow: true,
      pageSize: 10,
      pageSizes: [10, 20, 50],
      currPage: 1,
      totalPage: 0,
      totalNum: 0,
      isAll: false,
      Ctrlloading: false,
      // 登录信息、
      sessionData: {},
      // 合同编号
      QCinfo: "",
      // 登录者角色
      role: "",
      //   判断是否有发布，预锁解锁等功能
      isDisable: true,
      showExportBtns: [], // 导出按钮type
      //加载中
      loading: true,
      currentItem: {},

      // 预锁的城市列表
      cityList: [],
      // 状态列表
      stateList: [
        { text: "未配点", value: -1 },
        { text: "已完成", value: 0 },
        { text: "进行中", value: 1 },
        { text: "未投放", value: 2 },
        { text: "投放中", value: 3 },
        { text: "强制结束", value: 5 },
      ],
      // 根据角色判断是否显示新建按钮
      showNewBtn: true,
      isSearch: true,
      isReset: true,
      // 表格数据
      currentPlan: [],
      //过滤所有人
      filterRealName: [],
      // 权限城市过滤数组
      filterCityData: [],
      // 未完成方案提示
      unfinishedDialogVisible: false,
      // 未完成方案
      planInfo: "",
      // 继续编辑未完成方案跳转时的loading
      continueEditLoading: "",
      // 空位导出
      isOpenDownload: false,
      // 总点导出弹框显示
      allPointExportVisible: false,
      // 判断是否为全国媒介
      isNation: true,
      isSale: false, //销售权限
      // 资源导出
      isResExport: false,
      allMediaTypes: [],
      // 当前步骤
      exportAction: "/image/GetCenterPointRes",
      exportResStep: 1,
      exportInfo: {
        date: "",
        mediaTypeIds: "",
        radius: "",
        type: "",
      },
      // 导出时到提示标签
      isShowExportTag: true,
      // 上传的文件
      exportFileData: [],
      // 导出中
      isBroundImport: false,
      publishPlanDialog: false,
      planType: "0",
      relatedApId: null,
      apList: [],
      IsSevenBD: false,

      // 是否展示回收站
      isShowRecycleBin: false,

      // 预锁媒体类型窗口
      mediaDialogVisible: false,
      // 媒体类型
      currentMediaType: [],
      // 预锁的公司在这个方案中勾选的媒体类型
      mediaTypeChecks: [],

      // 表头数据
      currentPlanColumn: [
        { id: 0, label: "方案名称", prop: "apName", isChecked: true, fix: "not" },
        { id: 1, label: "客户名称", prop: "cName", isChecked: true, fix: "not" },
        { id: 2, label: "品牌名称", prop: "bTitle", isChecked: true, fix: "not" },
        { id: 3, label: "方案价格", prop: "apTotal", isChecked: true, fix: "not" },
        { id: 4, label: "所有人", prop: "realName", isChecked: true, fix: "not" },
        { id: 5, label: "投放城市(点位面数,排期)", prop: "cityArea", isChecked: true, fix: "not" },
        { id: 6, label: "媒体类型", prop: "mediaTypeDetails", isChecked: true, fix: "not" },
        { id: 7, label: "创建日期", prop: "apcTime", isChecked: true, fix: "not" },
        { id: 8, label: "状态", prop: "apState", isChecked: true, fix: "not" },
        { id: 9, label: "操作", isChecked: true, fix: "right" },
      ],
      // 行距
      rowSpace: "",
      itemKey: '',

      // 媒体类型筛选字段
      mediaTypeFilterList: []
    };
  },
  created() {
    this.getSessionData();
    this.getRole();
    this.getFanCity();
    if (this.isAll) {
      this.getCompany();
    }
    this.searchFun();
    if (this.isSale) {
      this.getSubSaleList();
    }
  },

  mounted() {
    this.getCustomConfig();
    this.getAllMediaTypes();
  },

  methods: {
    // 导出周边资源
    getCustomConfig() {
      api
        .getApi("/advertisement/GetCustomConfig")
        .then((res) => {
          if (res.data.SysCode == 200200 && Array.isArray(res.data.data)) {
            this.showExportBtns = res.data.data.map((item) => item.type);
          }
        })
        .catch((err) => {
          console.log("导出周边资源--", err);
        });
    },
    // 切换页码
    changePage(page) {
      this.currPage = page;
      console.log("page----", page);
      this.searchFun();
    },

    // 每页条数切换
    sizeChange(val) {
      console.log("val----", val);
      this.pageSize = val;
      this.currPage = 1;
      this.searchFun();
    },

    // 获取公司
    getCompany() {
      let sess = this.sessionData;
      let info = {
        uid: sess.uID,
        token: sess.token,
      };
      if (sess.ascType == 0) {
        api
          .getApi(this.apiVar.UCAPI + "/GetDirectAscr", info)
          .then((res) => {
            if (!res.data.SysCode) {
              let result = [];
              for (let data of res.data) {
                let obj = {
                  label: data.asName,
                  value: data.asrID,
                };
                result.push(obj);
              }
              this.companyData = result;
            } else if (res.data.SysCode == 100403) {
              console.error("获取投放城市", res.data.MSG);
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        api
          .getApi(this.apiVar.UCAPI + "/ShowAscr", info)
          .then((res) => {
            if (!res.data.SysCode) {
              let result = [];
              for (let data of res.data) {
                let obj = {
                  label: data.asName,
                  value: data.asrID,
                };
                result.push(obj);
              }
              this.companyData = result;
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    // 滚动加载获取数据(无搜索数据)
    getData(params) {
      api
        .getApi(this.apiVar.Advertisement + "/GetProposal", params)
        .then((res) => {
          if (!res.data.SysCode) {
            let dataInfo = res.data;
            this.totalNum = dataInfo.total;
            this.currentPlan = this.funcData(dataInfo.list);
            console.log('currentPlan', this.currentPlan);
            this.loading = false;
            if (dataInfo.totalpage == 0) {
              this.messageFun("warning", "暂无数据");
            }
          } else {
            this.messageFun("warning", res.data.MSG);
          }
        });
    },

    //获取下级销售列表
    getSubSaleList() {
      api.getApi(this.apiVar.Advertisement + "/GetSubSaleList").then((res) => {
        if (res.data.SysCode == 200200) {
          this.filterRealName = filterFormat(res.data.data, "realName", "uID");
        } else {
          this.messageFun("warning", res.data.MSG);
        }
      });
    },

    filterRealNameFun(value, row) {
      return row.realName === value;
    },

    // 数据处理
    funcData(dataArr) {
      let result = [];
      for (let data of dataArr) {
        let tmpObj = {};
        tmpObj = this.setTableData(data);
        result.push(tmpObj);
      }
      return result;
    },

    // 获取session数据
    getSessionData() {
      this.sessionData = sessFun.getSess();
      let sess = this.sessionData;
      // ascType 0:平台商 1:媒体主
      if (sess.ascType == 0 || sess.uType == "ADN_MD_COUNTRY") {
        this.isAll = true;
      } else {
        this.isAll = false;
      }
    },

    // 获取城市
    getFanCity() {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetAPDCityNames", info)
        .then((res) => {
          let arr = res.data;
          let result = [];
          if (!arr.SysCode) {
            for (let data of arr) {
              result.push({
                rName: data.rName,
                rID: data.rID,
                text: data.rName,
                value: data.rName,
              });
            }
            this.filterCityData = result;
          } else {
            this.messageFun("warning", res.data.MSG);
          }
        });
    },

    // 判断角色是否有新建按钮(媒介和销售有)
    getRole() {
      let role = this.sessionData.uType;
      this.role = role;
      this.IsSevenBD =
        this.sessionData.customPermission.proposalPermission == 1 &&
        ["ADN_BD_KA", "ADN_BD"].includes(this.sessionData.uType);
      if (["ADN_MD_COUNTRY", "ADN_MD"].includes(role)) {
        this.isDisable = false;
      }
      if (["ADN_BD", "ADN_MD"].includes(role)) {
        this.isNation = false;
      }
      if (["ADN_BD_KA", "ADN_BD"].includes(role)) {
        this.isSale = true;
      }
      if (
        !["ADN_BD_KA", "ADN_BD"].includes(role) &&
        !["ADN_MD"].includes(role)
      ) {
        this.showNewBtn = false;
      }
      if (["ADN_BD_KA", "ADN_BD", "ADN_SM"].includes(role)) {
        this.isDisable = true;
      }
    },

    // 状态转换成文本
    stateToText(val) {
      let state = [
        { text: "已完成", value: 0, color: "rgba(196,203,211,1)" },
        { text: "未配点", value: -1, color: "rgba(250, 173, 20, 1)" },
        { text: "进行中", value: 1, color: "rgba(113, 213, 217, 1)" },
        { text: "未投放", value: 2, color: "rgba(82,196,26,1)" },
        { text: "投放中", value: 3, color: "rgba(24,144,255,1)" },
        { text: "强制结束", value: 5, color: "rgba(245,34,45,1)" },
      ];
      for (let data of state) {
        if (val == data.value) {
          return data;
        }
      }
    },

    // 时间格式规范预锁
    formatTime(val) {
      return dateFormat.toDate(val, "/");
    },

    // 价格加上逗号
    priceFormat(price) {
      return commaFormat.init(price);
    },

    // 价格时间排序(请求后台接口进行排序)
    sortChange(column) {
      console.log("columm---", column);
      if (column.order == "ascending") {
        this.searchInfo.orderby = column.prop;
        this.searchInfo.desc = 0;
      } else if (column.order == "descending") {
        this.searchInfo.orderby = column.prop;
        this.searchInfo.desc = 1;
      }
      this.currPage = 1;
      this.searchFun();
    },

    routeSelect() {
      if (this.sessionData.customPermission.proposalPermission == 1) {
        // 直营
        if (["ADN_BD_KA", "ADN_BD"].includes(this.sessionData.uType)) {
          this.$router.push("./createPlan");
        } else {
          this.$router.push("./createPlanOld");
        }
      } else {
        // 加盟
        this.$router.push("./createPlanOld");
      }
    },

    //新增意向方案查询意向方案草稿箱
    getProposalAdBackUp(params) {
      api
        .getApi(this.apiVar.AddspProposal + "/getAdBackUp", params)
        .then((res) => {
          console.log("获取意向方案缓存", res);
          this.continueEditLoading.close();
          if (res.data.SysCode == 200200) {
            console.log("获取意向方案缓存成功", res.data);
            let data = res.data.data;
            if (JSON.stringify(data) === "{}" || !data) {
              this.$router.push("./createPlan");
            } else {
              // let planInfo = JSON.parse(data)
              this.showProposalCookeAdPlan(data);
              // 缓存到localStorage
              // data.uiD = params.uid
              // cacheAdPlan.setData(data)
            }
          } else {
            // 后台返回异常则查看前台是否有缓存
            let returnData = cacheAdPlan.getData(this.sessionData.uID);
            if (returnData) {
              this.showCookeAdPlan(returnData);
            } else {
              this.routeSelect();
            }
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.continueEditLoading.close();
          if (this.$route.path.includes("planList")) {
            this.routeSelect();
          }
        });
    },

    // 新建方案
    addOne() {
      this.continueEditLoading = this.$loading({
        lock: true,
        text: "正在查询是否有未完成的方案",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      if (this.IsSevenBD) {
        this.getProposalAdBackUp(params);
      } else {
        api
          .getApi(this.apiVar.Advertisement + "/getAdPlanBackups", params)
          .then((res) => {
            console.log("获取方案缓存", res);
            this.continueEditLoading.close();
            if (res.data.SysCode == 200200) {
              console.log("获取缓存成功", res.data);
              if (JSON.stringify(res.data.data) === "{}") {
                this.routeSelect();
              } else {
                let planInfo = JSON.parse(res.data.data);
                this.showCookeAdPlan(planInfo);
                // 缓存到localStorage
                cacheAdPlan.setData(planInfo);
              }
            } else {
              // 后台返回异常则查看前台是否有缓存
              let returnData = cacheAdPlan.getData(this.sessionData.uID);
              if (returnData) {
                this.showCookeAdPlan(returnData);
              } else {
                this.routeSelect();
              }
            }
          })
          .catch((err) => {
            console.log("err", err);
            this.continueEditLoading.close();
            if (this.$route.path.includes("planList")) {
              this.routeSelect();
            }
          });
      }
    },

    // 点位表盘
    goToDiaPlate() {
      console.log("this.$router", this.$router);
      this.$router.push("./adsDialPlate");
    },

    //显示意向方案缓存信息
    showProposalCookeAdPlan(adPlan) {
      this.planInfo = {
        planName: adPlan.apName,
        ownerSales: adPlan.saleRealName,
        cleatTime: adPlan.lSetTime,
        adsNum: adPlan.resList.length,
      };
      this.unfinishedDialogVisible = true;
    },

    // 显示缓存方案的信息
    showCookeAdPlan(adPlan) {
      // this.planForm.realNamesName
      let ownerSales =
        ["ADN_MD_COUNTRY", "ADN_MD"].includes(this.sessionData.uType) &&
          adPlan.planData.baseInfo.realNamesName
          ? adPlan.planData.baseInfo.realNamesName
          : adPlan.planData.baseInfo.ownerSales;
      this.planInfo = {
        planName: adPlan.planData.baseInfo.planName,
        ownerSales: ownerSales,
        cleatTime: adPlan.setTime,
        adsNum: adPlan.planData.adsList.length,
      };
      this.unfinishedDialogVisible = true;
    },

    // 随机生成合同编号编码格式： 合同编码固定[QC],日期[20180328],省份[44],城市[01],等几份合同[001](随机数)
    getContractNo(rid) {
      let date = new Date();
      let result = "QC";
      result = result + dateFormat.toDate(date, "");
      result = result + rid.toString().substring(0, 4);
      result = result + "00" + Math.round(Math.random() * 9);
      return result;
    },

    // 获取方案列表
    getPlanList(apID, suID) {
      return new Promise((resolve, reject) => {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          sales_user: suID,
        };
        api
          .getApi(this.apiVar.Advertisement + "/getSalesProject", params)
          .then((res) => {
            console.log("销售所属方案", res);
            if (res.data.SysCode == 200200) {
              let resData = res.data.data;
              let tempList = [];
              for (let key of resData) {
                if (apID != key.apId) {
                  tempList.push({
                    value: key.apId,
                    label:
                      key.apName +
                      "（" +
                      key.cname +
                      " · " +
                      (key.pdStar || "") +
                      "-" +
                      (key.pdEnd || "") +
                      "）",
                  });
                }
              }
              this.apList = tempList;
              resolve();
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
          });
      });
    },

    // 发布
    release(row) {
      // 1)	全国媒介可发布全部销售的方案
      // 2)	地方媒介只能发布只选择了该所属公司点位的方案

      this.QCinfo = "";
      // 真实数据
      this.currentItem = row;
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: row.apID,
      };
      let dataArr = row.cityArea;
      let sess = this.sessionData;
      let isRelease = false;
      if (sess.uType == "ADN_MD_COUNTRY") {
        isRelease = true;
      } else {
        let num = 0;
        for (let data of dataArr) {
          if (data.asrID == sess.asrID) {
            num++;
          }
        }
        if (num == dataArr.length) {
          isRelease = true;
        }
      }
      if (isRelease) {
        // uid         int【必填】     当前账户UserID
        // apid        int             公司对应方案apID
        api
          .getApi(this.apiVar.Advertisement + "/GetFanganInfo", info)
          .then((res) => {
            console.log(res.data);
            if (res.data.SysCode == 200200) {
              let text = res.data.data;
              if (text.apQC) {
                this.QCinfo = text.apQC;
              } else {
                this.QCinfo = this.getContractNo(text.rID);
              }
              this.getPlanList(text.apID, text.suID).then((resolve) => {
                this.publishPlanDialog = true;
              });
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          });
      } else {
        this.messageFun("warning", "您没有权限发布该方案");
      }
    },

    // 提交
    commitRelease() {
      if (/^[^\u4e00-\u9fa5]{0,}$/.test(this.QCinfo)) {
        this.Ctrlloading = this.$loading({
          text: "请耐心等待...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.5)",
        });
        // 保存合同编号
        this.saveContractNo(this.QCinfo, this.planType, this.relatedApId);
      } else {
        this.messageFun("warning", "只能输入数字,字母,字符");
      }
    },

    // 保存合同编号
    saveContractNo(contractNo, planType, relatedApId) {
      // uid         int【必填】     当前账户UserID
      // apid        int【必填】     方案apID
      // qc          String【必填】  方案合同编号
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: this.currentItem.apID,
      };
      info.qc = contractNo;
      info.planType = planType;
      if (planType == 1 || planType == 2) {
        if (!relatedApId) {
          this.messageFun(
            "warning",
            `请选择${["常规", "续刊", "补刊", "空刊", "赠送"][planType]}的订单`
          );
          this.Ctrlloading.close();
          return;
        }
        info.relatedApId = relatedApId;
      }
      api
        .postApi(this.apiVar.Advertisement + "/SetAdPlan", info)
        .then((res) => {
          if (res.data.SysCode == 300200) {
            // 查看是否被锁
            api
              .postApi(this.apiVar.Advertisement + "/CheckLock", info)
              .then((res) => {
                console.log(res.data);
                if (!res.data.SysCode) {
                  if (!res.data.IsLock) {
                    this.releaseFun();
                  } else {
                    this.messageFun("warning", "该方案被预锁,请先解除预锁");
                    this.Ctrlloading.close();
                  }
                }
              });
          } else {
            this.messageFun("warning", res.data.MSG);
            this.Ctrlloading.close();
          }
        })
        .catch((res) => {
          this.Ctrlloading.close();
        });
    },

    releaseFun() {
      let reseleInfo = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: this.currentItem.apID,
        qc: this.QCinfo,
        act: "R",
      };
      this.releaseFangan(reseleInfo);
    },

    // 发布方案(优化后的接口)
    releaseFangan(info) {
      api
        .postApi(this.apiVar.Advertisement + "/SetFangan", info)
        .then((res) => {
          if (res.data.SysCode == 300200) {
            this.messageFun("success", res.data.MSG);
            for (let data of this.currentPlan) {
              if (data.apID == this.currentItem.apID) {
                this.$set(data, "apState", 2);
                break;
              }
            }
            this.publishPlanDialog = false;
          } else if (res.data.SysCode == 300500) {
            if (res.data.asList) {
              // 存在点位被占，是否立即去方案详情修改？
              this.changeRoute();
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          } else {
            this.messageFun("warning", res.data.MSG);
          }
          this.Ctrlloading.close();
        })
        .catch((res) => {
          this.Ctrlloading.close();
        });
    },

    // 跳转到详情页面
    ToDetail(row) {
      sessionStorage.setItem("plan_apid", row.apID);
      sessionStorage.setItem("cityArea", JSON.stringify(row.cityArea));
      if (row.apState == -1) {
        // 未配点意向方案详情
        this.$router.push("./planEmptyPointDetail");
      } else if (row.planMode == 1) {
        // 已配点意向方案
        this.$router.push("./planDetail");
      } else {
        this.$router.push("./planDetail");
      }
    },

    // 跳转到编辑页面
    ToEdit(row) {
      sessionStorage.setItem("plan_apid", row.apID);
      sessionStorage.setItem("cityArea", JSON.stringify(row.cityArea));
      if (row.planMode == 1) {
        // 意向方案
        this.$router.push("./editPlan");
      } else {
        // 非意向方案
        this.$router.push("./editPlanOld");
      }
    },

    // 比较两个时间大小
    compareTime(arr, sField, eField) {
      return dateFormat.compareTime(arr, sField, eField);
    },

    // 意向方案配点（直营媒介配点）
    addPoint(row) {
      if (
        ["ADN_MD_COUNTRY", "ADN_MD"].includes(this.sessionData.uType) &&
        this.sessionData.customPermission.proposalPermission == 1
      ) {
        this.ToEdit(row);
      } else {
        this.$message.warning("暂无权限！");
      }
    },

    //预锁
    preload(row) {
      this.$confirm(
        "<p>锁定后，方案中的点位将被占用</p>",
        "是否确认锁定该方案的点位",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          this.currentItem = row;
          this.currentMediaType = row.details.map(item => {
            return {
              label: item.mediaTypeName,
              value: item.mediaTypeId,
              mediaTypeName: item.mediaTypeName
            }
          })
          let startObj = this.compareTime(row.cityArea, "pdStar", "pdEnd");
          let date = timeFormat.toDate(new Date(), "/");
          if (startObj.startTime <= date) {
            this.messageFun(
              "warning",
              "开始投放时间已经早于当前时间,请直接发布！"
            );
            return;
          }
          this.mediaDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    // 获取权限城市内的城市,进行勾选
    getCityList(arr) {
      // 1)	全国媒介可发布全部销售的方案
      // 2)	地方媒介只能发布只选择了该所属公司点位的方案
      // 1)	全国媒介可预锁全部的方案
      // 2)	地方媒介只能预锁方案中投放至该公司的部分
      let sess = this.sessionData;
      let resultArr = [];
      if (sess.uType == "ADN_MD_COUNTRY") {
        resultArr = arr;
      } else {
        for (let data of arr) {
          if (data.asrID == sess.asrID) {
            resultArr.push(data);
          }
        }
      }
      let asrIDs = [];
      let resultInfo = [];
      for (let com of resultArr) {
        if (!asrIDs.join(",").includes(com.asrID)) {
          asrIDs.push(com.asrID);
          resultInfo.push(com);
        }
      }
      return resultInfo;
    },

    // 解除预锁
    clearLock(row) {
      this.$confirm(
        "<p>解锁后，方案中的点位将被释放</p>",
        "是否确认解锁该方案的点位",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          this.currentItem = row;
          this.currentMediaType = row.details.map(item => {
            return {
              label: item.mediaTypeName,
              value: item.mediaTypeId,
              mediaTypeName: item.mediaTypeName
            }
          })
          this.Ctrlloading = this.$loading({
            text: "请耐心等待...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          this.noLockCity(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    // 检查当前拆分方案是否有点位被删除
    checkPoin(row) {
      let params = {
        apID: row.apID,
      };
      return new Promise((resolve, reject) => {
        api
          .getApi(this.apiVar.Advertisement + "/BeforeSplitAdPlanCheck", params)
          .then((res) => {
            console.log("检查点位是否被占用", res);
            if (res.data.SysCode === 200200) {
              resolve(true);
            } else if (res.data.SysCode === 200500) {
              this.$confirm(`${res.data.data}`, "确认拆单", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  // 方案拆单
                  resolve(true);
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消拆单",
                  });
                  resolve(false);
                });
            } else {
              sessFun.messageFun("warning", res.data.MSG || "检查占用点位异常");
              resolve(false);
            }
          });
      });
    },

    // KA方案拆分
    splitAdPlan(row) {
      if (row.planMode == 1) {
        // 意向方案
        api
          .postApi("/addsp/proposal/splitAdPlan", { apID: row.apID })
          .then((res) => {
            console.log("方案拆分res", res);
            if (res.data.SysCode === 200200) {
              sessFun.messageFun("success", "拆分成功");
              this.searchFun();
            } else {
              sessFun.messageFun("warning", res.data.MSG || "方案异常");
            }
          });
      } else {
        this.checkPoin(row)
          .then((res) => {
            if (res === true) {
              api
                .getApi(this.apiVar.Advertisement + "/SplitAdPlan", {
                  apID: row.apID,
                })
                .then((res) => {
                  console.log("方案拆分res", res);
                  if (res.data.SysCode === 200200) {
                    sessFun.messageFun("success", "拆分成功");
                    this.searchFun();
                  } else {
                    sessFun.messageFun("warning", res.data.MSG || "方案异常");
                  }
                });
            }
          })
          .catch((error) => { });
      }
    },

    // 预锁
    LockCity(act) {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        act: act,
        apid: this.currentItem.apID,
        mediaTypeIds: this.currentItem.mediaTypeIds
      };

      api
        .postApi(this.apiVar.Advertisement + "/SetFangan", info)
        .then((res) => {
          if (res.data.SysCode == 300200) {
            this.searchFun();
            this.messageFun("success", res.data.MSG);
          } else if (res.data.SysCode == 300500) {
            if (res.data.asList) {
              // 存在点位被占，是否立即去方案详情修改？
              this.changeRoute();
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          } else {
            this.messageFun("warning", res.data.MSG);
          }
          this.Ctrlloading.close();
          this.mediaDialogVisible = false
        })
        .catch((err) => {
          console.log(err);
          this.Ctrlloading.close();
          this.mediaDialogVisible = false
        });
    },

    // 解锁
    noLockCity(row) {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apId: row.apID,
        mediaTypeIds: row.mediaTypeIds
      };
      api
        .postApi(this.apiVar.Advertisement + "/ClFangan", info)
        .then((res) => {
          this.Ctrlloading.close();
          this.searchFun();
          this.messageFun("success", res.data.MSG);
        })
        .catch((err) => {
          console.log(err);
          this.Ctrlloading.close();
        });
    },

    // 7天以上显示7天,否则显示相隔天数
    countDay(time) {
      let dayA = Math.abs(timeFormat.getDayBetween(time, new Date()));
      console.log("dayA-----", dayA);
      let RemainDay = dayA > 7 ? 7 : dayA;
      return RemainDay;
    },

    // 弹出框修改路径
    changeRoute() {
      this.$confirm(`存在点位被占，是否修改方案？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.ToEdit(this.currentItem);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },

    // 搜索（优化）
    search() {
      let { keyword, rangeDate, status, company, cityWord, Lock, dateType, mediaTypeIds } =
        this.searchInfo;
      this.isSearch = false;
      let timer = setTimeout(() => {
        this.isSearch = true;
        clearTimeout(timer);
      }, 1000);
      if (
        keyword ||
        rangeDate ||
        status >= -1 ||
        company ||
        cityWord ||
        Lock ||
        dateType ||
        mediaTypeIds
      ) {
        this.currentPlan = [];
        this.loading = true;
        this.currPage = 1;
        this.searchFun();
      } else {
        this.messageFun("warning", "请输入搜索条件");
      }
    },

    searchFun() {
      this.paginationShow = false;
      this.loading = true;
      let info = this.searchFormat();
      this.getData(info);
      this.$nextTick(function () {
        this.paginationShow = true;
      });
    },

    // 搜索数据格式化
    searchFormat() {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        start: this.currPage,
        pagesize: this.pageSize,
      };
      let {
        select,
        keyword,
        rangeDate,
        status,
        company,
        cityWord,
        Lock,
        orderby,
        desc,
        dateType,
        mediaTypeIds
      } = this.searchInfo;
      info = {
        ...info,
        ...(keyword && { keywordType: select, keyword }),
        ...(rangeDate && { starttime: rangeDate[0], andtime: rangeDate[1] }),
        ...(status !== "" && status >= -1 && { apstate: status }),
        ...(company && { asrID: company }),
        ...(cityWord && { rname: cityWord }),
        ...(Lock && { onyusuo: Lock }),
        ...(orderby && { orderby }),
        ...(desc !== "" && desc >= 0 && { desc }),
        ...(rangeDate && { timeType: dateType }),
        ...(mediaTypeIds && { mediaTypeIds }),
      };
      return info;
    },

    // 设置表格数据
    setTableData(item) {
      let obj = {
        apSrc: item.src,
        adcID: item.adcID,
        apID: item.apID,
        apName: item.apName || "--",
        apState: item.apState || "--",
        planMode: item.planMode || 0,
        apTotal: item.apTotal || "--",
        apcTime: item.apcTime || "--",
        bTitle: item.bTitle || "--",
        cName: item.cName || "--",
        realName: item.realName || "--",
        cityArea: [],
        // isKA: item.isKA,     // 1：ka销售方案，不可发布及预锁
        apControlLevel: item.apControlLevel || "--", // 1:可预锁、发布 2：可拆单、不可预锁和发布 3.表示KA销售单已拆，不可（拆单、预锁、发布）
        details: item.details || "",
        mediaTypeDetails: [], // 媒体类型详细数据（包括预锁）
        mediaTypeNames: item.mediaTypeNames || "", // 媒体类型
        mediaTypeIds: item.mediaTypeIds || "", // 媒体类型id
      };
      // 处理媒体类型数据
      let mediaTypeNames = obj.mediaTypeNames.split(',')
      mediaTypeNames.forEach(type => {
        const index = obj.details.findIndex(item => item.mediaTypeName === type)
        if(index > -1) {
            obj.mediaTypeDetails.push(obj.details[index])
        } else {
            obj.mediaTypeDetails.push({
                mediaTypeName: type
            })
        }
      })

      item.details.sort((a, b) => {
        return a.asrID - b.asrID;
      });
      let asrIDarr = [];
      // RemainDay-预锁时间，没有的时候，就说明方案没有被预锁
      obj.canLock = item.details.some(function (item, index) {
        return !item.RemainDay;
      });
      obj.unLock = item.details.some(function (item, index) {
        return item.RemainDay;
      });
      for (let data of item.details) {
        data.apState = item.apState; //新增字段,判断是否是意向方案,点位面数显示为--
        if (asrIDarr.includes(data.asrID)) {
          data.isshow = 0;
        } else {
          asrIDarr.push(data.asrID);
          data.isshow = 1;
        }
      }
      obj.cityArea = item.details;
      return obj;
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    // 重置
    reset() {
      let info = this.searchInfo
      info.select = "1",
      info.keyword = "",
      info.rangeDate = "",
      info.status = "",
      info.company = "",
      info.Lock = "",
      info.dateType = "0"

      this.currPage = 1;
      this.currentPlan = [];
      this.isReset = false;
      let timer = setTimeout(() => {
        this.isReset = true;
        clearTimeout(timer);
      }, 1000);
      this.searchFun();
    },

    // 操作提示统一方法
    messageFun(mesType, mes) {
      this.$message({
        message: mes,
        type: mesType,
        showClose: true,
      });
    },

    //清除意向方案缓存
    clearProposalAdPlanBackups(params) {
      api
        .postApi(this.apiVar.AddspProposal + "/cleanAdBackUp", params)
        .then((res) => {
          console.log("清空意向方案缓存的方案", res);
          if (res.data.SysCode == 200200) {
            console.log("缓存意向方案清除成功");
          } else {
            console.log("缓存意向方案清除失败");
          }
        });
      cacheAdPlan.removeData(this.sessionData.uID);
      this.routeSelect();
    },

    // 放弃继续编辑
    cancelEdit() {
      this.$confirm("放弃后将清除该方案信息!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        type: "warning ",
      })
        .then(() => {
          this.unfinishedDialogVisible = false;
          let params = {
            uid: this.sessionData.uID,
            token: this.sessionData.token,
          };
          if (this.IsSevenBD) {
            this.clearProposalAdPlanBackups(params);
          } else {
            api
              .postApi(
                this.apiVar.Advertisement + "/clearAdPlanBackups",
                params
              )
              .then((res) => {
                console.log("清空缓存的方案", res);
                if (res.data.SysCode == 200200) {
                  console.log("缓存方案清除成功");
                } else {
                }
              });
            cacheAdPlan.removeData(this.sessionData.uID);
            this.routeSelect();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消成功",
          });
        });
    },

    // 继续创建
    continueEdit() {
      this.continueEditLoading = this.$loading({
        lock: true,
        text: "方案数据获取中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      if (this.IsSevenBD) {
        this.$router.push("./createPlan?unfinishedPlan");
      } else {
        this.$router.push("./createPlanOld?unfinishedPlan");
      }

      this.unfinishedDialogVisible = false;
    },

    /**
     * 周边小区导出
     * */
    exportRes() {
      // 数据初始化
      this.exportResStep = 1;
      this.exportInfo = {
        date: "",
        mediaTypeIds: "",
        radius: "",
        type: "",
      };
      this.exportFileData = [];
      this.isResExport = true;
      getAllMediaTypes()
    },

    // 个人权限公司下媒体类型列表
    getAllMediaTypes() {
      api
        .getApi("/addsp/api/v1/mediaTypes/getPersonalAuthMediaTypes")
        .then((res) => {
          let _res = res.data
          if (_res.SysCode == 200200) {
            this.allMediaTypes = _res.data || [];
            _res.data.forEach(item => {
                this.mediaTypeFilterList.push({
                    text: item.name,
                    value: item.id
                })
            })
          } else {
            this.messageFun("warning", res.data.MSG);
          }
        });
    },

    exportUploadFile(params) {
      this.exportFileData = [];
      let fileObj = params.file;
      this.exportFileData.push(fileObj);
      console.log("上传周边", params);
    },

    // 文件删除
    exportFileRemove(file, fileList) {
      console.log(file, fileList);
      this.exportFileData = fileList;
    },

    //周边小区导出下一步
    nextExportRes() {
      if (this.exportResStep === 1) {
        if (!Array.isArray(this.exportInfo.date)) {
          sessFun.messageFun("warning", "请选择投放排期");
          return;
        }
        if (!this.exportInfo.radius) {
          sessFun.messageFun("warning", "请填写半径范围");
          return;
        } else {
          if (
            !/(^[1-9]\d*$)/.test(this.exportInfo.radius) ||
            this.exportInfo.radius > 10000
          ) {
            sessFun.messageFun("warning", "请输入1~10000的整数");
            return;
          }
        }
        if (!this.exportInfo.type) {
          sessFun.messageFun("warning", "请选择类型");
          return;
        }
        this.exportResStep += 1;
      } else if (this.exportResStep < 3) {
        this.exportResStep += 1;
      } else {
        console.log("exportFileData", this.exportFileData);
        this.isBroundImport = true;
        if (this.exportFileData.length) {
          sessFun.messageFun("warning", "导出excel可能需要一分钟甚至更长时间!");
          this.importBroundRes();
        } else {
          sessFun.messageFun("warning", "请先上传文件！");
          this.isBroundImport = false;
        }
      }
    },

    // 导出周边小区
    importBroundRes() {
      let formData = new FormData();
      formData.append("file", this.exportFileData[0]);
      formData.append("radius", this.exportInfo.radius);
      formData.append("startDate", this.exportInfo.date[0]);
      formData.append("endDate", this.exportInfo.date[1]);
      formData.append("type", this.exportInfo.type);
      formData.append("mediaTypeIds", this.exportInfo.mediaTypeIds.join(","));
      if (
        this.sessionData.uType == "ADN_MD" ||
        this.sessionData.uType == "ADN_BD"
      ) {
        formData.append("asrId", this.sessionData.asrID);
      }
      // 上传文件
      const tempPage = window.open("", "_blank");
      api
        .postExportFile(this.exportAction, formData)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let routeUrl = this.$router.resolve({
              path: "/progressDown",
              query: { downtype: 3, uqKey: res.data.data.uqKey || "" },
            });
            tempPage.location = routeUrl.href;
          } else {
            this.$message({
              message: res.data.MSG || "导出失败！",
              type: "warning",
              showClose: true,
              duration: 0,
            });
          }
          this.isBroundImport = false;
          this.isResExport = false;
        })
        .catch((res) => {
          console.error("导出周边小区", res);
        });
    },

    // 删除方案
    deleteAdPlan(row) {
      console.log(this.apiVar, "this.apiVar");
      console.log(row);

      if (row.apState == 1 && !row.canLock) {
        return sessFun.messageFun(
          "warning",
          "删除失败，请先将方案解锁后再进行删除操作!"
        );
      }
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apid: row.apID,
      };
      this.$confirm("点击【确认】该方案将被移除至回收站", "确定删除该方案？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api
          .postApi(this.apiVar.Advertisement + "/DeleteAdPlan", params)
          .then((res) => {
            console.log("删除", res);
            if (res.data.SysCode == 300200) {
              this.messageFun("success", res.data.MSG);
              this.reset();
            } else {
              this.messageFun("warning", res.data.MSG);
            }
          });
      });
    },

    // 回收站
    openRecycleBin() {
      this.isShowRecycleBin = true;
      console.log(this.isShowRecycleBin, "this.isShowRecycleBin");
    },

    // 列表筛选
    filterChange(filters) {
      for (let key in filters) {
        if (key === "mediaTypeNames") {
          if (filters[key].length) {
              this.searchInfo.mediaTypeIds = filters[key].join(',');
          } else {
              this.searchInfo.mediaTypeIds = "";
          }
      }
    }
    this.search()
    },

    // 关闭预锁媒体类型弹窗
    handleMediaTypeCancel() {
      this.mediaTypeChecks = []
      this.mediaDialogVisible = false
    },

    // 对媒体类型选择进行预锁
    handleMediaTypeCommit() {
      this.Ctrlloading = this.$loading({
        text: "请耐心等待...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.LockCity("L");
      this.mediaTypeChecks = []
    },

    // 媒体类型操作权限判断
    medaiTypePermissions(arr) {
      //  广告门 道闸 地方媒介/全国媒介 可预锁/解锁/发布所见方案
      const types = arr.map(item => item.mediaTypeName)
      if ((types.includes('广告门') || types.includes('道闸')) && ["ADN_MD", "ADN_MD_COUNTRY"].includes(this.role)) {
        return false
      } else if (types.includes('单元门禁灯箱') && ["ADN_MD_COUNTRY"].includes(this.role)) {
        // 单元门禁灯箱 全国媒介可预锁/解锁/发布所见方案
        return false
      } else {
        return true
      }

    },

    // 列展示
    filterColumn(columns) {
      this.currentPlanColumn = columns
      this.itemKey = Math.random()
    },

    // 刷新列表
    refreshTable() {
      this.search();
    },

    // 更改列表行距
    spaceSetting(size) {
      this.rowSpace = size;
    },

  },

  beforeDestroy() {
    if (this.continueEditLoading) {
      this.continueEditLoading.close();
    }
  }
};
</script>
<style lang="scss" scoped>
a {
  color: #108ee9;
}

/*筛选*/
/deep/ .el-checkbox-group .el-checkbox+.el-checkbox {
  margin-left: 0;
}

.date-type-select {
  position: relative;
  left: 30px;
  z-index: 9;
  width: 104px;
}

.date-type-select /deep/ .el-input__inner {
  width: 104px !important;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  color: rgb(144, 147, 153);
}

.date-type-select /deep/ .el-input.is-focus .el-input__inner {
  border-color: #dcdfe6;
}

.typeBox p {
  height: 30px;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  border-top: 1px solid #cccccc;
}

/deep/ .el-checkbox__label {
  font-size: 10px;
  color: #8a8a8a;
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

/deep/ .min_input .el-input-group--prepend .el-input__inner {
  width: 110px;
}

.el-input {
  width: 290px;
  border-radius: 4px;
}

.flex_box {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.marginR {
  margin-right: 4px;
  margin-bottom: 16px;
}

/deep/ .el-date-editor .el-range-separator {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.25);
}

/*日期控件*/
.block {
  display: inline-block;
  margin-left: 2px;
  position: relative;
}

/deep/ .search_row .el-input__inner {
  width: 185px;
}

/deep/ .el-date-editor {
  width: 245px;
}

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
  float: left;
  position: relative;
}

/*锁*/
.fa.fa-lock.fa-lg,
.fa.fa-unlock.fa-lg {
  font-size: 16px;
  color: #d8d8d8 !important;
  position: relative;
  top: -1px;
}

/*操作*/
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.mediaList_wrap .mediaList_container .table_wrap {
  margin: 0 auto 16px;
}

.el-button+.el-button {
  margin-left: 0;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  // color: rgba(0, 0, 0, 0.65);
}

.table_wrap .city_p span {
  float: none !important;
}

.table_wrap .city_p {
  position: relative;
}

.table_wrap .city_p .lock-icon {
  position: absolute;
  right: -10px;
  top: 0px;
}

.table_wrap .city_p .lock-icon b {
  display: inline-block;
  padding: 0 4px;
  font-size: 12px;
  height: 16px;
  line-height: 16px;
  text-align: center;
}

.table_wrap .city_p .lock-icon b.blue {
  color: #1890ff;
  background: rgba(230, 247, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(145, 213, 255, 1);
}

.table_wrap .city_p .lock-icon b.red {
  color: #fa541c;
  background: rgba(255, 242, 232, 1);
  border-radius: 2px;
  border: 1px solid rgba(255, 187, 150, 1);
}

/deep/ .el-date-editor--daterange.el-input__inner {
  width: 240px;
}

.el-dialog__footer span {
  float: none !important;
}

/deep/ .el-table td .cell {
  padding: 2px 10px;
  height: auto;
  line-height: 28px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}

/*未完成方案*/
/deep/ .unfinished_plan_dialog .el-dialog__header {
  padding: 20px 20px;
  border-bottom: 1px solid #e8e8e8;
}

/deep/ .unfinished_plan_dialog .el-dialog__title {
  font-size: 15px;
}

/deep/ .unfinished_plan_dialog .el-dialog__body {
  padding: 10px 20px;
}

/deep/ .unfinished_plan_dialog .el-dialog__title {
  font-weight: bold;
}

.unfinished_plan_li {
  line-height: 28px;
}

.ad_pagination {
  display: flex;
  justify-content: space-between;
}

.ad_pagination p {
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
}

.ad_pagination span {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: rgba(230, 247, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(145, 213, 255, 1);
  text-align: center;
  color: #1890ff;
  margin-right: 5px;
}

.info_box {
  height: 32px;
  background: rgba(230, 247, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(145, 213, 255, 1);
  line-height: 32px;
  padding: 0 16px;
  position: relative;
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 16px;
}

.info_box /deep/ .el-icon-close {
  cursor: pointer;
  margin-left: 24px;
  position: absolute;
  top: 9px;
  right: 8px;
}

.downloag_btn {
  position: absolute;
  right: 18px;
  top: 14px;
  cursor: pointer;
  color: rgba(102, 102, 102, 1);
}

/deep/ .publish_dialog {
  .el-dialog__header {
    padding: 16px 24px 6px;
  }

  .el-dialog__body {
    padding: 0 24px 4px;

    .comment {
      display: block;
      color: rgba(0, 0, 0, 0.45);
      line-height: 24px;
      margin-bottom: 16px;
    }

    .el-form-item {
      margin-bottom: 12px;
    }

    .el-form-item__label {
      padding-bottom: 4px;
      line-height: 24px;
    }

    .el-input__inner {
      padding: 0 12px;
    }

    .el-input--small,
    .el-select--small {
      width: 100%;
    }
  }

  .el-dialog__footer {
    padding-top: 0;

    .el-button+.el-button {
      margin-left: 10px;
    }
  }
}

/deep/ .Import_dialog {
  border-radius: 4px;

  .el-dialog__header {
    padding: 12px 24px 16px;
  }

  .el-dialog__body {
    padding: 0 24px 24px;

    input::-webkit-input-placeholder {
      font-size: 14px;
    }
  }

  .el-dialog__footer {
    padding: 0 24px 24px;
    text-align: center;
  }

  .el-upload-list__item {
    width: 100%;
  }

  .el-upload-dragger {
    padding-top: 9%;
    width: 408px;
    height: 135px;
    background: rgba(0, 0, 0, 0.06);
  }

  .el-upload-dragger img {
    width: 28px;
    height: 30px;
  }

  .export_step_box {
    border: 1px solid rgba(218, 218, 218, 1);
    padding: 12px 18px;
    color: rgba(102, 102, 102, 1);
    font-size: 15px;
    position: relative;

    img {
      width: 24px;
      height: 27px;
      vertical-align: middle;
    }
  }

  .export_ul {
    li {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .el-select,
      .el-date-editor--daterange,
      .radius_input.el-input-group {
        width: calc(100% - 70px);
      }

      .radius_input .el-input-group__append {
        padding: 0 12px;
        font-size: 14px;
      }

      &>span {
        width: 70px;
        text-align: right;
        display: inline-block;
      }
    }

    li:last-child {
      margin-bottom: 0;
    }
  }

  .m_ehicle_class {
    input {
      font-size: 14px;
    }
  }
}

.u-bk-btn {
  padding: 0 3px;
  width: 30px;
  height: 16px;
  background: rgba(24, 144, 255, 1);
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
}

.u-more {
  background: none !important;
  color: #606266;
  margin-right: 0;
}

// .flex_box {
//   justify-content: space-between;
// }
// .flex_box::after {
//   content: '';
// }
.search-item {
  margin-bottom: 16px;
  display: flex;
  align-items: center;

  &:nth-child(4) {
    margin-right: 0;
  }

  span {
    display: inline-block;
    width: 70px;
    text-align: right;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    box-sizing: border-box;
    white-space: nowrap;
  }

  .u-select {
    min-width: 338px;

    /deep/ .el-input__inner {
      width: 232px;
    }

    /deep/ .el-select {
      width: 98px;
      padding: 0;
      box-sizing: border-box;
      color: rgba(0, 0, 0, 0.85);

      .el-input__inner {
        width: 100%;
      }
    }
  }

  .u-date {
    width: 98px;
    padding: 0;
    box-sizing: border-box;

    /deep/ .el-input {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
    }

    /deep/ .el-input__inner {
      width: 100%;
      padding: 0 10px;
      border-right: 0 none !important;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .u-date-picker {
    min-width: 203px;
    box-sizing: border-box;
    padding: 5px 15px 5px 17px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .u-select2 {
    width: 338px;

    /deep/ .el-input__inner {
      width: 100%;
    }
  }
}

.btn_wrapper {
  // margin-left: 38px;
}

/deep/ .el-table th {
  background: #fafafa;
}

.u-dropdown-more {
  height: 32px;
}

.u-new-btn {
  color: #fff;
}

.u-btn {
  color: #fff;
}

.mediaList_search {
  padding: 24px 24px 8px;
  box-sizing: border-box;
  margin-bottom: 16px;
}

.mediaList_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    height: 24px;
    color: rgba(0, 0, 0, 0.85);
  }

  .btn_box {
    height: 32px;
  }

  .m-act {
    display: flex;
    align-items: center;
  }
}

.media-box {
    display: flex;
    flex-wrap: wrap;
    .media-tag {
        margin: 4px 8px 4px 0;

        .tag {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 22px;
            padding: 0 8px;
            border: 1px solid;
            border-radius: 2px;
            font-family: 'Roboto';
            font-size: 12px;
            margin-right: 8px;
            line-height: normal;

            &:last-of-type {
            margin-right: 0;
            }

            &.ad {
            background: #E6F7FF;
            border-color: #91D5FF;
            color: #1890FF;
            }

            &.unit-access {
            background: #F6FFED;
            border-color: #B7EB8F;
            color: #52C41A;
            }

            &.light-box {
            background: #E6FFFB;
            border-color: #87E8DE;
            color: #13C2C2;
            }

            &.brake {
            background: #f9f0ff;
            border-color: #D3ADF7;
            color: #722ED1;
            }

            .icon {
            cursor: pointer;
            display: block;
            width: 10px;
            margin-right: 6px;
            }
        }
    }
}

.media-type-dialog {
  /deep/ .el-dialog {
    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      padding: 26px 24px;
    }

    .title {
      display: flex;
      align-items: center;
      margin-bottom: 9px;
      font-weight: 600;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);

      .icon {
        display: block;
        width: 24px;
        height: 24px;
        margin-right: 16px;
        line-height: normal;
      }
    }

    .ctn {
      padding-left: 40px;

      h3 {
        margin-bottom: 8px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
      }

      .checkbox-item {
        margin-bottom: 4px;

        .el-checkbox {
          display: block;
          margin-right: 0;
        }
      }

      .btn-box {
        margin-top: 23px;
        padding-left: 24px;

        .btn {
          margin-right: 14px;
        }
      }
    }

  }
}



@media only screen and (min-width: 1200px) {
  .btn_wrapper {
    .marginR {
      margin-right: 4px;

      &:last-of-type {
        margin-right: 0;
      }
    }
  }
}
</style>

<style lang="scss">
.newDrop {
  padding: 0 !important;
}
</style>
