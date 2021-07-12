<!--
 * @Author: penglei
 * @Date: 2021-06-17 20:11:38
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-12 23:11:20
 * @FilePath: /frontend/src/components/develop/contractList.vue
-->
<template>
  <div class="ad_mediaDetail_wrap clearfix">
    <div class="ad_mediaDetail_nav">
      <p class="clearfix">
        <a href="#" style="color: #999">合同管理</a><em> / </em
        ><a href="#">合同列表</a>
      </p>
    </div>
    <div class="mediaList_wrap">
      <div class="mediaList_head">
        <h2>合同列表</h2>
      </div>
      <div class="mediaList_container">
        <el-form
          :model="searchInfo"
          ref="contractSearchForm"
          class="search-row"
        >
          <el-row :gutter="36">
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
              <el-form-item label="关键字：" :prop="searchInfo.keywordType">
                <el-input
                  placeholder="请输入内容"
                  v-model="searchInfo[searchInfo.keywordType]"
                  size="small"
                  class="search-row-item"
                >
                  <el-select
                    v-model="searchInfo.keywordType"
                    slot="prepend"
                    size="small"
                    placeholder="请选择"
                  >
                    <el-option label="资源名称" value="resName"></el-option>
                    <el-option label="物业名称" value="pmcName"></el-option>
                    <el-option label="合同编号" value="contractNo"></el-option>
                    <!-- “业务员”只有开发总监与资产人员可筛选 -->
                    <template
                      v-if="
                        sessionData.devManageLevel == 1 ||
                        sessionData.devManageLevel == 2
                      "
                    >
                      <el-option
                        label="业务员"
                        value="createUserName"
                      ></el-option>
                    </template>
                  </el-select>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
              <el-form-item label="城市区域：" prop="districtId">
                <el-cascader
                  v-model="searchInfo.districtId"
                  placeholder="请选择城市区域"
                  size="small"
                  class="search-row-item"
                  :options="areaArr"
                  :clearable="true"
                  :show-all-levels="true"
                  filterable
                  :props="{ checkStrictly: false }"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="6"
              class="combination-serch"
            >
              <el-form-item label="选择日期：" :prop="searchInfo.rangeDateType">
                <el-select
                  size="small"
                  v-model="searchInfo.rangeDateType"
                  placeholder="请选择日期"
                  class="combination-serch-select"
                >
                  <el-option label="合同开始日期" value="startDate"></el-option>
                  <el-option label="合同签约日期" value="signDate"></el-option>
                  <el-option label="最近付款日期" value="payDate"></el-option>
                  <el-option label="合同结束日期" value="endDate"></el-option>
                  <el-option label="创建日期" value="createDate"></el-option>
                </el-select>
                <el-date-picker
                  v-model="searchInfo[searchInfo.rangeDateType]"
                  size="small"
                  type="daterange"
                  align="right"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  class="combination-serch-date"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="8"
              :xl="6"
              class="row-btn-group"
            >
              <el-button type="primary" @click="searchFormat">搜索</el-button>
              <el-button plain @click="contractSearchForm">重置</el-button>
              <el-button
                v-if="sessionData.devManageLevel == 0"
                plain
                size="small"
                @click="routeCreateContract"
                >新建</el-button
              >
              <!-- <el-button plain size="small" @click="exportContract"
                >导出</el-button
              > -->
            </el-col>
          </el-row>
        </el-form>

        <div>
          <el-table
            border
            :data="contractList"
            style="width: 100%"
            v-loading="loading"
            element-loading-text="玩命加载中.."
            element-loading-spinner="el-icon-loading"
            @filter-change="filterChange"
          >
            <el-table-column
              prop="resName"
              label="资源名称"
              width="170"
              show-overflow-tooltip
              fixed="left"
            >
              <template slot-scope="scope">
                <span
                  style="color: #108ee9; cursor: pointer"
                  @click="ToDetail(scope.row)"
                  >{{ scope.row.resName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="originName"
              label="合同对象"
              width="180"
              show-overflow-tooltip
              fixed="left"
            >
              <template slot-scope="scope">
                <span>{{
                  (scope.row.originName || "待定").replace(",", "/")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="dcType"
              label="合同类型"
              min-width="110"
              show-overflow-tooltip
              fixed="left"
            >
              <template slot-scope="scope">
                <span>{{ contractTypeArr[scope.row.dcType] || "" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="startDate"
              label="合同开始日期"
              min-width="140"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="endDate"
              label="合同结束日期"
              width="140"
              align="right"
            >
            </el-table-column>
            <el-table-column
              prop="mediaCnt"
              label="合同媒体数"
              min-width="100"
              align="right"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="installMediaCnt"
              label="已装媒体数"
              min-width="100"
              align="right"
            >
            </el-table-column>

            <el-table-column
              column-key="isVenueFee"
              prop="venueFee"
              label="场地费"
              width="100"
              align="right"
              :filters="[
                { text: '无场地费', value: 0 },
                { text: '有场地费', value: 1 },
              ]"
              :filter-multiple="false"
            >
              <template slot-scope="scope">
                {{ (scope.row.venueFee / 100) | moneyFormat("¥") }}
              </template>
            </el-table-column>
            <el-table-column
              prop="devFee"
              label="开发费"
              width="100"
              align="right"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ (scope.row.devFee / 100) | moneyFormat("¥") }}
              </template>
            </el-table-column>
            <el-table-column
              prop="payDate"
              label="最近付款日期"
              width="140"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.nearPayDate || "--" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createUserName"
              label="业务员"
              width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createUserName || "" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="contractNo"
              label="合同编号"
              width="140"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.contractNo }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建日期"
              width="170"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createTime || "" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              column-key="dcState"
              prop="dcState"
              label="合同状态"
              min-width="120"
              show-overflow-tooltip
              fixed="right"
              :filters="
                Object.keys(stateList).map((i) => {
                  return { text: stateList[i].label, value: i };
                })
              "
              :filter-multiple="true"
            >
              <template slot-scope="scope">
                <div
                  class="media-status-dot"
                  :style="{ background: stateList[scope.row.dcState].color }"
                ></div>
                {{ stateList[scope.row.dcState].label }}
                <el-tooltip
                  v-if="stateList[scope.row.dcState].tip"
                  popper-class="reason-tip"
                  :content="`原因：
                  ${
                    scope.row[stateList[scope.row.dcState].tip].replace(
                      ',',
                      '、'
                    ) || '--'
                  }`"
                  placement="top"
                >
                  <img
                    class="quesition-icon"
                    src="../../assets/images/question_icon.png"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80px" fixed="right">
              <template slot-scope="scope">
                <el-dropdown
                  v-if="getContractOperation(scope.row).length"
                  size="small"
                  trigger="click"
                  placement="bottom-start"
                >
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(item, index) in getContractOperation(scope.row)"
                      :key="index"
                      @click.native.prevent="handleContract(scope.row, item)"
                      >{{ item }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="ad_pagination">
            <el-pagination
              background
              @size-change="sizeChange"
              @current-change="changePage"
              :current-page.sync="currPage"
              :page-sizes="[10, 20, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 重新提交审核 -->
    <el-dialog
      :visible.sync="resubmitVisible"
      width="388px"
      top="22vh"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
      <div slot="title"><i class="el-icon-question"></i>是否重新提交审核？</div>
      <div class="message-content">
        确定后，<span class="active">{{ currentContract.resName }}</span> 的
        <span class="active">{{
          `${contractTypeArr[currentContract.dcType] || ""}`
        }}</span>
        将被重新提交审核
      </div>

      <template slot="footer">
        <el-button @click="resubmitVisible = false">取 消</el-button>
        <el-button type="primary" @click="resubmitFun">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 合同删除 -->
    <el-dialog
      :visible.sync="deleteContractVisible"
      width="388px"
      top="22vh"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
      <div slot="title"><i class="el-icon-question"></i>是否删除该合同？</div>
      <div class="message-content">
        确定后，<span class="active">{{ currentContract.resName }}</span> 的
        <span class="active">{{
          `${contractTypeArr[currentContract.dcType] || ""}`
        }}</span>
        将被删除
      </div>

      <template slot="footer">
        <el-button @click="deleteContractVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteContractFun">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 关联媒体至合同 -->
    <add-media-to-contract
      :currentContract="currentContract"
      :correlateMediaMode.sync="correlateMediaMode"
      @refreshList="searchFormat"
    ></add-media-to-contract>
    <!-- 续签弹框 -->
    <next-contract-dialog
      :currentContract="currentContract"
      :mergeVisible.sync="mergeVisible"
      @refreshList="searchFormat"
    ></next-contract-dialog>
    <!-- 付款记录 -->
    <pay-log
      :currentContract="currentContract"
      :payLogDialogVisible.sync="payLogDialogVisible"
      :payApplyVisible.sync="payApplyVisible"
      @refreshList="searchFormat"
    ></pay-log>
    <!-- 完成签约 -->
    <sign-contract
      :signVisible.sync="signVisible"
      :currentContract="currentContract"
      @refreshList="searchFormat"
    ></sign-contract>
    <!-- 合同审核 -->
    <contract-review-dialog
      :dcID="currentContract.id"
      :contractReviewVisible.sync="contractReviewVisible"
      @refreshList="searchFormat"
    ></contract-review-dialog>
    <!-- 终止合同弹框 -->
    <el-dialog
      :visible.sync="terminateVisible"
      width="388px"
      top="22vh"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper custom-confirm-dialog"
    >
      <div slot="title"><i class="el-icon-question"></i>是否终止该合同？</div>
      <div class="message-content">
        确定后，<span class="active">{{ currentContract.resName }}</span> 的
        <span class="active">{{
          `${contractTypeArr[currentContract.dcType] || ""}`
        }}</span>
        将被终止
      </div>
      <div class="terminate-box">
        <span class="terminate-title">请选择终止原因：</span>
        <span
          v-for="(reasonItem, index) in reasons"
          :key="index"
          :class="{ 'tag-default': true, 'tag-active': reasonItem.selected }"
          @click="reasonItem.selected = !reasonItem.selected"
        >
          <i v-if="reasonItem.label == '其它'" class="el-icon-edit"></i>
          {{ reasonItem.label }}</span
        >
        <el-input
          class="terminate-input"
          v-if="reasons[6].selected"
          v-model="reasons[6].value"
          size="small"
          placeholder="请填写其他原因"
        ></el-input>
      </div>

      <template slot="footer">
        <el-button @click="terminateVisible = false">取 消</el-button>
        <el-button v-preventReClick type="primary" @click="terminateFun"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api/api.js";
import sessFun from "../../commonFun/sessFun.js";
import PayLog from "./components/payLog.vue";
import NextContractDialog from "./components/nextContractDialog.vue";
import AddMediaToContract from "./components/addMediaToContract.vue";
import SignContract from "./components/signContract.vue";
import ContractReviewDialog from "./components/contractReviewDialog.vue";

export default {
  name: "contracList",
  components: {
    PayLog,
    NextContractDialog,
    AddMediaToContract,
    SignContract,
    ContractReviewDialog,
  },

  data() {
    return {
      // 角色：0-开发人员 1-资产人员 2-开发总监
      roleArr: ["0", "1", "2"],
      // 合同类型：0-首签  1-续约 2-加门 3-补充
      contractTypeArr: {
        0: "首签合同",
        1: "续签合同",
        2: "加门合同",
        3: "补充协议",
      },
      // 后台定义合同状态
      stateList: {
        "-1": { label: "不通过", color: "#F5222D", tip: "failReason" },
        0: { label: "待审核", color: "#FFAA00" },
        1: { label: "待签约", color: "#FFAA00" },
        2: { label: "待安装", color: "#FFAA00" },
        3: { label: "待拆除", color: "#FFAA00" },
        4: { label: "正常", color: "#1890FF" },
        5: { label: "合同到期", color: "#CDD4DA" },
        6: { label: "强制终止", color: "#CDD4DA", tip: "stopReason" },
      },
      // 合同列表操作权限路径(000: 开发人员/首签/待审核)
      /* operationAuthorityArr: {
        编辑: ["000", "00-1", "010", "020", "01-1", "02-1", "030", "03-1"],
        删除: ["000", "00-1", "001", "002", "003", "010", "020", "01-1", "02-1", "011", "021", "012", "022", "013", "023", "030", "03-1", "031", "032"],
        重新提交: ["00-1", "01-1", "02-1", "03-1"],
        媒体录入: ["002", "012", "022", "032"],
        续签: ["004", "005", "006", "014", "024", "015", "025", "016", "026", "034", "035", "036"],
        补充协议: ["004", "014", "024", "034"],
        加门: ["004", "014", "024", "034"],
        付款: ["004", "005", "014", "024", "015", "025", "034", "035"],
        付款记录: ["004", "005", "006", "014", "024", "015", "025", "016", "026", "034", "035", "036", "204", "205", "206", "214", "224", "215", "225", "216", "226", "104", "105", "106", "114", "124", "115", "125", "116", "126", "134", "135", "136"],
        审核: ["200", "210", "220", "230"],
        完成签约: ["101", "111", "121", "131"],
        合同终止: ["104", "114", "124", "134"],
      }, */
      operationAuthorityArr: {
        删除: [
          "000",
          "00-1",
          "001",
          // "002",
          // "003",
          "010",
          "020",
          "01-1",
          "02-1",
          "011",
          "021",
          // "012",
          // "022",
          // "013",
          // "033",
          "030",
          "03-1",
          "031",
          // "032",
        ],
        编辑: ["000", "00-1", "010", "020", "01-1", "02-1", "030", "03-1"],
        重新提交: ["00-1", "01-1", "02-1", "03-1"],
        媒体录入: ["002", "012", "022", "032"],
        续签: [
          "004",
          "005",
          "006",
          "014",
          "024",
          "015",
          "025",
          "016",
          "026",
          "034",
          "035",
          "036",
        ],
        补充协议: ["004", "014", "024", "034"],
        加门: ["004", "014", "024", "034"],
        付款: ["004", "005", "014", "024", "015", "025", "034", "035"],
        付款记录: [
          "004",
          "005",
          "006",
          "014",
          "024",
          "015",
          "025",
          "016",
          "026",
          "034",
          "035",
          "036",
          "204",
          "205",
          "206",
          "214",
          "224",
          "234",
          "215",
          "225",
          "216",
          "226",
          "104",
          "105",
          "106",
          "114",
          "124",
          "115",
          "125",
          "116",
          "126",
          "134",
          "135",
          "136",
        ],
        审核: ["200", "210", "220", "230"],
        完成签约: ["101", "111", "121", "131"],
        合同终止: ["104", "114", "124", "134"],
      },
      areaArr: [],
      // 搜索数据
      searchInfo: {
        keywordType: "resName",
        rangeDateType: "startDate",
        resName: "",
        pmcName: "",
        createUserName: "",
        contractNo: "",
        districtId: "",
        isVenueFee: [],
        startDate: "",
        endDate: "",
        signDate: "",
        payDate: "",
        createDate: "",
        dcState: [],
      },
      // 分页信息
      pageSize: 10,
      currPage: 1,
      totalPage: 0,
      totalNum: 0,
      // 登录信息、
      sessionData: {},
      //加载中
      loading: false,
      // 录入媒体弹框
      correlateMediaMode: false,
      // 续签合同
      mergeVisible: false,
      // 付款记录
      payLogDialogVisible: false,
      // 付款申请
      payApplyVisible: false,
      // 删除合同弹框
      deleteContractVisible: false,
      // 签约弹框
      signVisible: false,
      // 重新提交弹框
      resubmitVisible: false,
      // 合同审核弹框
      contractReviewVisible: false,
      // 终止合同弹框
      terminateVisible: false,
      // 表格数据
      contractList: [],
      isDisable: false,
      currentContract: {},
      // 终止原因
      reasons: [
        { label: "业委会不通过", value: "业委会不通过", selected: false },
        { label: "修路/封路", value: "修路/封路", selected: false },
        { label: "小区改造", value: "小区改造", selected: false },
        { label: "更换物业", value: "更换物业", selected: false },
        { label: "竞品取代", value: "竞品取代", selected: false },
        { label: "我方原因", value: "我方原因", selected: false },
        { label: "其它", value: "", selected: false },
      ],
    };
  },

  created() {
    this.getSessionData();
    this.getCity();
    this.searchFormat();
  },
  methods: {
    // 重置终止原因
    resetReason() {
      this.reasons = [
        { label: "业委会不通过", value: "业委会不通过", selected: false },
        { label: "修路/封路", value: "修路/封路", selected: false },
        { label: "小区改造", value: "小区改造", selected: false },
        { label: "更换物业", value: "更换物业", selected: false },
        { label: "竞品取代", value: "竞品取代", selected: false },
        { label: "我方原因", value: "我方原因", selected: false },
        { label: "其它", value: "", selected: false },
      ];
    },
    // 合同终止
    terminateFun() {
      if (this.reasons[6].selected && !this.reasons[6].value) {
        this.$message.warning("请填写其它原因！");
        return;
      }
      let stopReason = this.reasons.reduce((pre, cur) => {
        cur.selected && cur.value !== "" && pre.push(cur.value);
        return pre;
      }, []);
      if (stopReason.length) {
        api
          .postApi("/addsp/devContract/changeDCState", {
            dcID: this.currentContract.id,
            passState: 0,
            stopReason: stopReason.join(","),
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              this.searchFormat();
              this.terminateVisible = false;
              this.$message.success(res.data.MSG || "合同终止成功！");
            } else {
              this.$message.warning(res.data.MSG || "");
            }
          });
      } else {
        this.$message.warning("请选择终止原因");
      }
    },
    // 合同删除
    deleteContractFun() {
      api
        .postApi("/addsp/devContract/delete", {
          dcID: this.currentContract.id,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.searchFormat();
            this.deleteContractVisible = false;
            this.$message.success(res.data.MSG || "合同删除成功！");
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 重新提交
    resubmitFun() {
      api
        .postApi("/addsp/devContract/changeDCState", {
          dcID: this.currentContract.id,
          passState: 1,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.searchFormat();
            this.resubmitVisible = false;
            this.$message.success(res.data.MSG || "重新提交成功！");
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 验证是否可以续签和补签
    valiateNextContract(originIDs) {
      return new Promise((resolve, reject) => {
        api
          .getApi("/addsp/devContract/valiateNextContract", {
            originIDs,
          })
          .then((res) => {
            if (res.data.SysCode == 200200) {
              resolve(true);
            } else {
              this.$message.warning("尚有续签/补充协议申请未完成！");
              resolve(false);
            }
          })
          .catch((error) => {
            resolve(false);
          });
      });
    },
    // 合同操作
    async handleContract(row, operation) {
      this.currentContract = row;
      switch (operation) {
        case "编辑":
          if (row.dcType > 0) {
            this.$router.push({
              path: "./nextContract",
              query: {
                dcID: row.id,
                originID: row.originID || "",
                handleType: row.dcType,
                edit: 1,
              },
            });
          } else {
            this.$router.push({
              path: "./editContract",
              query: { resID: row.resID, dcID: row.id },
            });
          }
          break;
        case "删除":
          this.deleteContractVisible = true;
          break;
        case "重新提交":
          this.resubmitVisible = true;
          break;
        case "媒体录入":
          this.correlateMediaMode = true;
          break;
        case "续签":
          this.mergeVisible = true;
          break;
        case "补充协议":
          if (await this.valiateNextContract(row.originID)) {
            this.$router.push({
              path: "./nextContract",
              query: {
                dcID: row.id,
                originID: row.originID || "",
                handleType: 3,
              },
            });
          }
          break;
        case "加门":
          this.$router.push({
            path: "./nextContract",
            query: {
              dcID: row.id,
              originID: row.originID || "",
              handleType: 2,
            },
          });
          break;
        case "付款":
          this.payApplyVisible = true;
          break;
        case "付款记录":
          this.payLogDialogVisible = true;
          break;
        case "审核":
          this.contractReviewVisible = true;
          break;
        case "完成签约":
          this.signVisible = true;
          break;
        case "合同终止":
          this.resetReason();
          this.terminateVisible = true;
          break;
      }
    },
    // 获取当前列表操作权限
    getContractOperation(row) {
      let tempNo = `${this.roleArr[this.sessionData.devManageLevel]}${
          row.dcType
        }${row.dcState}`,
        tempArr = [];
      for (const key in this.operationAuthorityArr) {
        if (Object.hasOwnProperty.call(this.operationAuthorityArr, key)) {
          if (this.operationAuthorityArr[key].includes(tempNo)) {
            if (key == "付款记录") {
              tempArr.push(key);
            } else {
              row.isOperate && tempArr.push(key);
            }
          }
        }
      }
      return tempArr;
    },
    // 切换页码
    changePage(page) {
      this.currPage = page;
      this.searchFormat();
    },
    // 每页条数切换
    sizeChange(val) {
      this.pageSize = val;
      this.currPage = 1;
      this.searchFormat();
    },
    // 获取session数据
    getSessionData() {
      this.sessionData = sessFun.getSess();
    },
    // 新建合同
    routeCreateContract() {
      this.$router.push("./newContract");
    },
    // 跳转到合同详情页面
    ToDetail(row) {
      console.log("合同详情");
      this.$router.push({
        path: "./contractDetail",
        query: { resID: row.resID },
      });
    },
    // 搜索数据格式化
    searchFormat() {
      let rangeDate = this.searchInfo[this.searchInfo.rangeDateType],
        rangeDateType = this.searchInfo.rangeDateType;
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        pageNum: this.currPage,
        pageSize: this.pageSize,
        [this.searchInfo.keywordType]:
          this.searchInfo[this.searchInfo.keywordType],
        districtId:
          this.searchInfo.districtId[this.searchInfo.districtId.length - 1],
        isVenueFee: this.searchInfo.isVenueFee.join(","),
        dcState: this.searchInfo.dcState.join(","),
      };
      if (Array.isArray(rangeDate) && rangeDate.length == 2) {
        params[rangeDateType + "Min"] = rangeDate[0];
        params[rangeDateType + "Max"] = rangeDate[1];
      }

      api.getApi("/addsp/devContract/list", params).then((res) => {
        if (res.data.SysCode == 200200) {
          this.contractList = res.data.data || [];
          this.totalNum = res.data.total || 0;
        } else {
          this.$message.warning(res.data.MSG);
        }
      });
    },
    // 重置
    contractSearchForm() {
      this.$refs["contractSearchForm"].resetFields();
      this.currPage = 1;
      this.searchFormat();
    },
    // 获取权限城市
    getCity() {
      let info = {
        service: "GetCompanyCitiesAction",
        token: this.sessionData.token,
        uid: this.sessionData.uID,
      };
      api
        .postApi_new(this.apiVar.Media, info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let result = [];
            for (let data of res.data.data) {
              let obj = {
                label: data.cityName,
                value: data.cityId,
                children: [],
              };
              if (data.districtList) {
                for (let data2 of data.districtList) {
                  let obj2 = {
                    label: data2.districtName,
                    value: data2.districtId,
                  };
                  obj.children.push(obj2);
                }
              }
              result.push(obj);
            }
            this.areaArr = result;
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 表头部分筛选
    filterChange(filterObj) {
      for (const key in filterObj) {
        if (Object.hasOwnProperty.call(filterObj, key)) {
          switch (key) {
            case "dcState":
              this.searchInfo.dcState = filterObj[key];
              break;
            case "isVenueFee":
              this.searchInfo.isVenueFee = filterObj[key];
          }
        }
      }
      this.currPage = 1;
      this.searchFormat();
    },
    // 导出该账户内所有合同
    exportContract() {},
  },
};
</script>
<style lang="scss">
.reason-tip {
  line-height: 22px;
  font-size: 14px;
  color: #fff;
}
</style>
<style lang="scss" scoped>
@import "../../assets/component.scss";
/deep/ .custom-confirm-dialog {
  border-radius: 4px;
  .el-dialog__header {
    padding: 24px 24px 8px;
    border: none !important;
    font-weight: 600;
    /* .el-dialog__title {
      font-size: 16px;
      color: rgba($color: #000, $alpha: 0.85);
    } */
    .el-icon-question {
      margin-right: 16px;
      color: #fa8c16;
      &:before {
        font-size: 24px;
      }
    }
  }
  .el-dialog__body {
    border: none !important;
    .content-form {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      line-height: 24px;
      /* 完成签约和付款 */
      .el-form-item {
        &:last-child {
          margin-bottom: 0;
        }
        .el-form-item__label {
          padding: 0;
          line-height: 32px;
        }
        .el-form-item__content {
          line-height: 32px;
        }
        .el-date-editor {
          width: 100%;
        }
      }
    }
    /* 重新提交和删除合同 */
    .message-content {
      padding-left: 40px;
      line-height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      & .active {
        color: #1890ff;
        font-weight: 600;
      }
    }

    .el-select {
      width: 100%;
    }
  }
  .el-dialog__footer {
    display: flex;
    justify-content: flex-end;
    padding: 24px;
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
}
a {
  color: #108ee9;
}

.search-row {
  /deep/ .el-form-item {
    display: flex;
    align-items: center;
    flex-grow: 1;
    margin-bottom: 16px;
    .el-form-item__label {
      padding: 0;
      line-height: 32px;
      white-space: nowrap;
    }
    .el-form-item__content {
      flex-grow: 1;
      display: flex;
      line-height: 32px;
    }
  }
  .search-row-item {
    width: 100%;
  }
}

/*下拉搜索框*/
/deep/ .el-input-group__prepend {
  width: 64px;
  background-color: #fff;
}
/deep/ .combination-serch {
  display: flex;
  flex-flow: row nowrap;
  .combination-serch-select .el-input__inner {
    width: 126px;
    border-radius: 4px 0 0 4px;
  }
  .combination-serch-date {
    width: 100%;
    border-left: none;
    border-radius: 0 4px 4px 0;
  }
}
@media all and (max-width: 1680px) {
  .row-btn-group {
    width: 100%;
  }
}
.row-btn-group {
  white-space: nowrap;
  margin-bottom: 16px;
}
.media-status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 4px;
}
.quesition-icon {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  vertical-align: middle;
  filter: brightness(0.75);
}
.terminate-box {
  padding-left: 40px;
  margin-top: 24px;
  .terminate-title {
    display: block;
    line-height: 22px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .tag-default {
    display: inline-block;
    box-sizing: border-box;
    height: 32px;
    padding: 0px 12px;
    margin: 8px 8px 0 0;
    line-height: 32px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e8e8e8;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
  }
  .tag-default:nth-child(4) {
    margin-right: 0;
  }
  .terminate-input {
    margin-top: 8px;
    /deep/ .el-input__inner {
      font-size: 14px;
    }
  }
  .tag-active {
    color: #1890ff;
    border: 1px solid #1890ff;
  }
}
</style>