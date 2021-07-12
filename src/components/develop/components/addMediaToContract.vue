<!--
 * @Author: penglei
 * @Date: 2021-06-28 14:06:42
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-13 01:00:09
 * @FilePath: /frontend/src/components/develop/components/addMediaToContract.vue
-->
<template>
  <div>
    <el-dialog
      title="请选择录入方式"
      :visible.sync="correlateMediaMode"
      top="22vh"
      width="248px"
      :show-close="false"
      :lock-scroll="false"
      :before-close="() => $emit('update:correlateMediaMode', false)"
      center
      class="custom-dialog-wrapper correlate-mode__dialog"
    >
      <span slot="footer">
        <el-button type="primary" @click="showMediaList"
          >选择已有媒体</el-button
        >
        <el-button type="primary" @click="showNewMedia">创建新的媒体</el-button>
      </span>
    </el-dialog>
    <dialog-table
      v-loading="loading"
      title="选择已有媒体"
      width="944px"
      rowKey="mID"
      :visible="addMediaVisible"
      :tableData="mediaTableData"
      :tableColumn="mediaTableColumn"
      :paging="false"
      @closeDialog="addMediaVisible = false"
      @selectionChange="selectionChange"
    >
      <div slot="topTip" class="table-top-tip">
        <i class="el-icon-info" style="color: #1890ff"></i>
        <h4>
          <span>
            请勾选下面列表中的
            <span class="tip-active">{{
              currentContract.surplusInstallCnt
            }}</span>
            个媒体
          </span>
        </h4>
      </div>
      <template slot="aheadColumn">
        <el-table-column
          width="54px"
          type="selection"
          align="center"
          :reserve-selection="true"
        >
        </el-table-column>
      </template>
      <template slot="dialogFooter">
        <el-button @click="addMediaVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            addMediaToContract(
              selectionMediaList
                .reduce((pre, cur) => {
                  if (cur.mID) {
                    pre.push(cur.mID);
                  }
                  return pre;
                }, [])
            )
          "
          >确 定</el-button
        >
      </template>
    </dialog-table>

    <el-dialog
      title="创建新的媒体"
      :visible.sync="newMediaVisible"
      width="944px"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper new-media__dialog"
      center
    >
      <div class="media-item__wrap" v-for="(item, key) in arrMedia" :key="key">
        <div class="content_bottom_head">
          <h2>{{ "媒体" + (key + 1) }}</h2>
        </div>
        <div class="content_bottom_form_wrap">
          <el-form
            :model="item"
            status-icon
            :rules="mediaRules"
            label-position="top"
            ref="mediaForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-row :gutter="32">
              <el-col :span="6" class="el_col_box">
                <el-form-item
                  label="媒体名称"
                  prop="mediaName"
                  ref="adMediaName"
                >
                  <el-input
                    size="small"
                    v-model="item.mediaName"
                    placeholder="例：东门"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="可投面数" prop="usableNum">
                  <el-input-number
                    v-model.number="item.usableNum"
                    :min="1"
                    :max="26"
                    controls-position="right"
                    size="small"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item label="媒体状态" prop="mstate">
                  <el-select
                    size="small"
                    v-model="item.mstate"
                    placeholder="请选择媒体状态"
                  >
                    <el-option label="待安装" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="6">
                <el-form-item label="资产编号" prop="assetId">
                  <el-input
                    size="small"
                    v-model.trim="item.assetId"
                    placeholder="例:0034FASF342-X21"
                  ></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item label="门体类型" prop="doorType">
                  <el-input
                    size="small"
                    v-model="item.doorType"
                    placeholder="例:消防门"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="32">
              <el-col :span="6">
                <el-form-item label="广告尺寸" required>
                  <div class="custom-form-item">
                    <el-form-item prop="adSizeW">
                      <el-input
                        size="mini"
                        v-model="item.adSizeW"
                        :clearable="false"
                        placeholder="宽度"
                      ></el-input>
                    </el-form-item>
                    <div class="divide-vertical"></div>
                    <el-form-item prop="adSizeH">
                      <el-input
                        v-model="item.adSizeH"
                        :clearable="false"
                        size="mini"
                        placeholder="高度"
                      >
                      </el-input>
                    </el-form-item>
                    <div class="item-append">毫米</div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="可视画面" required>
                  <div class="custom-form-item">
                    <el-form-item prop="visualW">
                      <el-input
                        size="mini"
                        v-model="item.visualW"
                        :clearable="false"
                        placeholder="宽度"
                      ></el-input>
                    </el-form-item>
                    <div class="divide-vertical"></div>
                    <el-form-item prop="visualH">
                      <el-input
                        v-model="item.visualH"
                        :clearable="false"
                        size="mini"
                        placeholder="高度"
                      >
                      </el-input>
                    </el-form-item>
                    <div class="item-append">毫米</div>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="广告限制"
                  prop="adLimit"
                  class="right_form_item"
                >
                  <el-select
                    size="small"
                    v-model="item.adLimit"
                    multiple
                    placeholder="请选择广告限制"
                  >
                    <el-option
                      v-for="(limit, index) in adLimit"
                      :key="index"
                      :label="limit.label"
                      :value="limit.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="备注" prop="mediaRemark">
                  <el-input
                    size="small"
                    type="textarea"
                    :autosize="{ minRows: 1 }"
                    v-model.trim="item.mediaRemark"
                    placeholder="请填写备注信息"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="newMediaVisible = false">取 消</el-button>
        <el-button type="primary" @click="creadMediaFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
import sessFun from "../../../commonFun/sessFun.js";
import dialogTable from "../../../components/common/components/dialogTable.vue";
export default {
  name: "addMediaToContract",
  props: {
    correlateMediaMode: {
      type: Boolean,
      default: () => false,
    },
    currentContract: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    dialogTable,
  },
  data() {
    //资产编号
    /* let validateAssetId = (rule, value, callback) => {
      let reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
      if (reg.test(value)) {
        callback(new Error("只能输入数字字母符号!"));
      } else {
        callback();
      }
    }; */
    let validateSpace = (rule, value, callback) => {
      this.isResError = false;
      if (value) {
        if (value.match(/^\s+$/)) {
          callback(new Error("所填内容不能为空格!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    // 判断是否包含有特殊字符 // “/”
    let validateSpecialString = (rule, value, callback) => {
      let reg = /[\/]/;
      if (reg.test(value)) {
        callback(new Error("不可填写特殊符号!"));
      } else {
        callback();
      }
    };
    let validateNum = (rule, value, callback) => {
      if (value !== "" && !Number.isInteger(value)) {
        callback(new Error("只能输入整数值!"));
      } else {
        if (value < 1 || value > 26) {
          callback(new Error("最少投1面，最多可投26面!"));
        } else {
          callback();
        }
      }
    };
    let validatePrice = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value !== "" && !reg.test(value)) {
        callback(new Error("只能输入数字!"));
      } else {
        if (value > 9999999) {
          callback(new Error("不得大于9999999!"));
        } else {
          callback();
        }
      }
    };

    return {
      loading: false,
      addMediaVisible: false,
      selectionMediaList: [],
      mediaTableData: [],
      mediaTableColumn: [
        {
          label: "媒体名称",
          prop: "mTitle",
          minWidth: "90px",
          tip: true,
        },
        {
          label: "可投面数",
          prop: "asCnt",
          minWidth: "90px",
        },
        /* {
          label: "媒体状态",
          prop: "mState",
          minWidth: "90px",
        }, */
        {
          label: "资产编号",
          prop: "assetTag",
          width: "150px",
          tip: true,
        },
        {
          label: "媒体类型",
          prop: "mVehicle",
          width: "90px",
        },
        {
          label: "广告尺寸",
          prop: "adSize",
          width: "100px",
        },
        {
          label: "可视画面",
          prop: "adViewSize",
          width: "100px",
        },
        {
          label: "广告限制",
          prop: "notPush",
          tip: true,
        },
      ],
      newMediaVisible: false,
      arrMedia: [],
      adLimit: [],
      mediaRules: {
        mediaName: [
          {
            required: true,
            message: "媒体名称不能为空!",
            trigger: ["blur", "change"],
          },
          { validator: validateSpace, trigger: ["blur", "change"] },
          { validator: validateSpecialString, trigger: ["blur", "change"] },
          { validator: this.validateMediaName, trigger: "blur" },
          {
            max: 40,
            message: "最多只能输入40个字节!",
            trigger: ["blur", "change"],
          },
        ],
        usableNum: [
          { validator: validateNum, trigger: "blur" },
          { required: true, message: "可投面数不能为空!", trigger: "change" },
        ],
        /* mstate: [
          { required: true, message: "请选择媒体状态!", trigger: "change" },
        ], */
        /* assetId: [
          {
            required: true,
            message: "资产编号不能为空!",
            trigger: ["blur", "change"],
          },
          { validator: validateAssetId, trigger: "change" },
          { validator: this.validateAssetTag, trigger: "blur" },
          {
            max: 40,
            message: "最多只能输入40个字节!",
            trigger: ["blur", "change"],
          },
        ], */
        doorType: [
          {
            required: true,
            message: "门体类型不能为空!",
            trigger: ["blur", "change"],
          },
          { validator: validateSpace, trigger: ["blur", "change"] },
          {
            required: true,
            min: 1,
            max: 20,
            message: "最多只能输入20个字节!",
            trigger: ["blur", "change"],
          },
        ],
        adSizeW: [
          {
            required: true,
            type: "string",
            message: "请输入数值",
            trigger: ["blur", "change"],
          },
          { validator: validatePrice, trigger: ["blur", "change"] },
        ],
        adSizeH: [
          {
            required: true,
            type: "string",
            message: "请输入数值",
            trigger: ["blur", "change"],
          },
          { validator: validatePrice, trigger: ["blur", "change"] },
        ],
        visualW: [
          {
            required: true,
            type: "string",
            message: "请输入数值",
            trigger: ["blur", "change"],
          },
          { validator: validatePrice, trigger: "change" },
        ],
        visualH: [
          {
            required: true,
            type: "string",
            message: "请输入数值",
            trigger: ["blur", "change"],
          },
          { validator: validatePrice, trigger: ["blur", "change"] },
        ],
      },
    };
  },
  watch: {
    newMediaVisible(val) {
      if(val) {
        this.getADLimit();
      }
    }
  },
  created() {
    this.sessionData = sessFun.getSess();
  },
  methods: {
    // 批量创建媒体
    creadMediaFun() {
      let resID = this.currentContract.resID,
        arr = [];
      for (let i = 0; i < this.arrMedia.length; i++) {
        let mediaForm = this.arrMedia[i];
        if (
          mediaForm.mediaName &&
          mediaForm.mediaType &&
          mediaForm.adSizeW &&
          mediaForm.adSizeH &&
          mediaForm.doorType
        ) {
          arr.push({
            resID: resID,
            uID: this.sessionData.uID,
            mTitle: mediaForm.mediaName,
            pNum: mediaForm.usableNum,
            actualNum: mediaForm.usableNum,
            adSize: mediaForm.adSizeW + "*" + mediaForm.adSizeH,
            adViewSize: mediaForm.visualW + "*" + mediaForm.visualH,
            notPush: mediaForm.adLimit.join("、"),
            // assetTag: mediaForm.assetId,
            mType: mediaForm.doorType,
            mImg: mediaForm.mImg || "",
            mVehicle: mediaForm.mediaType,
            mRemark: mediaForm.mediaRemark,
            mState: mediaForm.mstate,
          });
        } else {
          this.$message.warning("媒体信息错误！");
          return;
        }
      }
      let params = {
        uid: this.sessionData.uID,
        service: "CreateMediaBatch",
        token: this.sessionData.token,
        data: {
          medias: arr,
          rId: this.currentContract.districtId,
        },
      };
      if (params.data.medias.length) {
        api.postApi_new(this.apiVar.Media, params).then((res) => {
          if (res.data.SysCode == 200200) {
            this.newMediaVisible = false;
            this.addMediaToContract((res.data.data || []));
            this.$message.success(res.data.MSG || "媒体创建成功!");
          } else {
            this.$message.warning(res.data.MSG || "媒体创建失败！");
          }
        });
      } else {
        console.log("媒体数据为空");
      }
    },
    // 显示新建媒体
    showNewMedia() {
      if (this.currentContract.surplusInstallCnt > 0) {
        // 生成表单绑定数据
        this.arrMedia = new Array(this.currentContract.surplusInstallCnt).fill({
          mediaType: "广告门",
          mediaName: "", //媒体名称mtitle
          usableNum: "2", //广告位面数pnum
          mstate: 2, //媒体状态此处新建都是2
          doorType: "",
          adSizeW: "", //广告尺寸adsize
          adSizeH: "", //广告尺寸
          visualW: "", //可视画面adviewsize
          visualH: "", //可视画面
          mediaRemark: "", //备注 mrk
          adLimit: [], //请选择广告限制 notpush
        });
        this.arrMedia = JSON.parse(JSON.stringify(this.arrMedia));
        this.newMediaVisible = true;
      } else {
        this.$message.warning("该合同新增媒体数量已满足！");
      }
    },
    // 获取广告限制列表
    getADLimit() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetNotPush",
        data: {},
      };
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        if (res.data.SysCode == 200200) {
          this.adLimit = (res.data.data || []).map((item) => {
            return { value: item.nTitle, label: item.nTitle };
          });
        } else {
          this.$message.warning(res.data.MSG || "");
        }
      });
    },
    // 媒体名称校验去重
    validateMediaName(rule, value, callback) {
      let adArr = this.arrMedia.filter((item, index, list) => {
        if (item.mediaName === value) {
          return item;
        }
      });
      if (adArr.length >= 2) {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          callback(new Error("这个媒体名称已在同小区内存在!"));
        }, 50);
      } else {
        callback();
      }
    },
    // 显示已有媒体列表
    showMediaList() {
      this.addMediaVisible = true;
      this.getMediaList();
    },
    // 表格勾选媒体数据
    selectionChange(selection) {
      this.selectionMediaList = selection;
    },
    // 将已有媒体与合同关联
    addMediaToContract(mediaList) {
      if (mediaList.length == 0) {
        this.$message.warning("媒体数据为空！");
        return;
      }
      api
        .postApi("/addsp/devContract/linkNewMedia", {
          dcID: this.currentContract.id,
          mIDs: mediaList.join(",")
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.synDcState();
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 媒体状态同步至合同状态
    synDcState() {
      api
        .postApi_json("/addsp/devContract/synDcState", {
          dcID: this.currentContract.id,
          state: 0
        })
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.$emit("update:correlateMediaMode", false);
            this.newMediaVisible = false;
            this.addMediaVisible = false;
            this.$emit("refreshList");
            this.$message.success(res.data.MSG || "录入成功！");
            this.$message.success(res.data.MSG || "更改成功！");
          } else {
            this.$message.warning(res.data.MSG || "状态更改失败！");
          }
        });
    },
    // 小区已有媒体列表
    getMediaList() {
      this.loading = true;
      api
        .getApi(
          "/addsp/devContract/installMediaList", {
            resID: this.currentContract.resID,
            excludeDcID: this.currentContract.id
          }
        )
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let tempMediaStatus = {
              0: "禁用",
              1: "正常",
              2: "待安装",
              3: "待维修",
              4: "已拆除",
            };
            res.data.data = res.data.data || [];
            res.data.data.forEach((item) => {
              item.mState = tempMediaStatus[item.mState] || "--";
            });
            this.mediaTableData = res.data.data;
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally((res) => {
          this.loading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .correlate-mode__dialog {
  .el-dialog {
    border-radius: 4px;
  }
  .el-dialog__header {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    border-bottom: unset !important;
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    border-bottom: unset !important;
  }
  .el-dialog__footer {
    padding: 0 24px 24px !important;
    .el-button {
      width: 100%;
      & + .el-button {
        margin-left: 0;
        margin-top: 8px;
      }
    }
  }
}
.table-top-tip {
  display: flex;
  align-items: baseline;
  margin: 0 0 16px;
  padding: 8px;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  background: #e6f7ff;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
  .el-icon-info {
    color: #1890ff;
    margin-right: 4px;
  }
  h4 {
    font-size: 14px;
    display: inline-block;
  }
  .tip-active {
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: #1890ff;
    &.right {
      margin-left: auto;
    }
    &.warn {
      color: rgba(250, 102, 20, 1);
    }
  }
  .tip-active-handle {
    font-weight: 400;
  }
  .divide-border {
    display: inline-block;
    width: 1px;
    height: 14px;
    margin: 0 8px;
    vertical-align: middle;
    background: rgba(0, 0, 0, 0.1);
  }
}
.merge-btn {
  padding: 0 10px;
}
.cell-ellipsis {
  min-width: 30px;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* 创建媒体 */
/deep/ .new-media__dialog {
  .content_bottom_head {
    height: 22px;
    padding: 24px 0;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }
  .el-form-item__label {
    height: 24px;
    margin-bottom: 4px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    &:before {
      float: right;
      margin-left: 4px;
    }
  }
  .custom-form-item {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    box-sizing: border-box;
    height: 32px;
    padding: 4px 0;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background: #ffffff;
    .el-form-item__content {
      line-height: 32px;
      .el-input__inner {
        padding: 0 12px;
        border: none;
        text-align: left;
      }
    }
    .divide-vertical {
      width: 2px;
      height: 16px;
      background: #d9d9d9;
    }
    .item-append {
      flex-grow: 1;
      white-space: nowrap;
      height: 32px;
      padding: 0 8px;
      background: rgba(0, 0, 0, 0.04);
      border-radius: 0px 4px 4px 0px;
      border-left: 1px solid #d9d9d9;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
      line-height: 32px;
    }
  }
  .el-form-item__content {
    .el-input__inner {
      text-align: left;
    }
    .el-input-number {
      width: 100%;
    }
  }
  .media-item__wrap + .media-item__wrap {
    border-top: 1px solid #e9e9e9;
  }
}
</style>
