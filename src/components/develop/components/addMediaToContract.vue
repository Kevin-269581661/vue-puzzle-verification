<!--
 * @Author: penglei
 * @Date: 2021-06-28 14:06:42
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-01 22:23:33
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
        <el-button type="primary" @click="newMediaVisible = true"
          >创建新的媒体</el-button
        >
      </span>
    </el-dialog>
    <dialog-table
      title="选择已有媒体"
      width="944px"
      v-loading="loading"
      :tableData="mediaTableData"
      :tableColumn="mediaTableColumn"
      :visible="addMediaVisible"
      :paging="false"
      @closeDialog="addMediaVisible = false"
      @selectionChange="selectionChange"
    >
      <div slot="topTip" class="table-top-tip">
        <i class="el-icon-info" style="color: #1890ff"></i>
        <h4>
          <span>
            请勾选下面列表中的
            <span class="tip-active">{{ intentionInfo.mediaCount || "" }}</span>
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
        <el-button type="primary" @click="addMediaToContract">确 定</el-button>
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
              <el-col :span="6">
                <el-form-item label="媒体状态" prop="mstate">
                  <el-select
                    size="small"
                    v-model="item.mstate"
                    placeholder="请选择媒体状态"
                    @blur="adDoorBlur('mstate', key)"
                    @change="selectMstate(item)"
                  >
                    <el-option label="禁用" :value="'0' + key"></el-option>
                    <el-option label="正常" :value="'1' + key"></el-option>
                    <el-option label="待安装" :value="'2' + key"></el-option>
                    <el-option label="待维修" :value="'3' + key"></el-option>
                    <el-option label="已拆除" :value="'4' + key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label=" 媒体类型" prop="doorType">
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
                    collapse-tags
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
        <el-button type="primary" @click="newMediaVisible = false"
          >确 定</el-button
        >
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
    dcID: {
      type: [Number, String],
      default: () => "",
    },
  },
  components: {
    dialogTable,
  },
  data() {
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
      intentionInfo: {
        mediaCount: 3,
      },
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
        {
          label: "媒体状态",
          prop: "mState",
          minWidth: "90px",
        },
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
          prop: "assetTag",
          tip: true,
        },
      ],
      newMediaVisible: false,
      arrMedia: [
        {
          mediaName: "", //媒体名称mtitle
          usableNum: "2", //广告位面数pnum
          mstate: "", //媒体状态mstate
          doorType: "", // 门类型mType
          adSizeW: "", //广告尺寸adsize
          adSizeH: "", //广告尺寸
          visualW: "", //可视画面adviewsize
          visualH: "", //可视画面
          mediaRemark: "", //备注 mrk
          adLimit: [], //请选择广告限制 notpush
        },
      ],
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
        mstate: [
          { required: true, message: "请选择媒体状态!", trigger: "change" },
        ],
        doorType: [
          {
            required: true,
            message: "媒体类型不能为空!",
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
            message: "不能为空且只能输入数字!",
            trigger: ["blur", "change"],
          },
          { validator: validatePrice, trigger: ["blur", "change"] },
        ],
        adSizeH: [
          {
            required: true,
            type: "string",
            message: "不能为空且只能输入数字!",
            trigger: ["blur", "change"],
          },
          { validator: validatePrice, trigger: ["blur", "change"] },
        ],
        visualW: [
          {
            required: true,
            type: "string",
            message: "不能为空且只能输入数字!",
            trigger: ["blur", "change"],
          },
          { validator: validatePrice, trigger: "change" },
        ],
        visualH: [
          {
            required: true,
            type: "string",
            message: "不能为空且只能输入数字!",
            trigger: ["blur", "change"],
          },
          { validator: validatePrice, trigger: ["blur", "change"] },
        ],
      },
    };
  },
  watch: {
    /* correlateMediaMode: {
      immediate: true,
      handler(newVal, oldVal) {
        console.log("addMediaVisible", newVal);
        newVal && this.getMediaList();
        // newVal && this.getMediaList();
      },
    }, */
  },
  created() {
    this.sessionData = sessFun.getSess();
  },
  mounted() {
    this.getADLimit();
  },
  methods: {
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
          console.log("广告限制adLimit", this.adLimit);
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
    //
    showMediaList() {
      this.addMediaVisible = true;
      this.getMediaList();
    },
    // 表格勾选媒体数据
    selectionChange(selection) {
      this.selectionMediaList = selection;
    },
    // 将已有媒体与合同关联
    addMediaToContract() {
      if (this.selectionMediaList.length == 0) {
        this.$message.warning("选择媒体为空！");
      }
      api
        .postApi("/addsp/devContract/linkNewMedia", {
          dcID: this.dcID,
          mIDs: this.selectionMediaList
            .reduce((pre, cur) => {
              if (cur.mID) {
                pre.push(cur.mID);
              }
              return pre;
            }, [])
            .join(","),
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.mediaTableData = res.data.data || [];
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 小区已有媒体列表
    getMediaList() {
      this.loading = true;
      api
        .getApi("/addsp/devContract/installMediaList?resID=40162")
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.mediaTableData = res.data.data || [];
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

    handleClose(done) {
      this.newMediaVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .correlate-mode__dialog {
  .el-dialog__header {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    border-bottom: unset;
    text-align: center;
    color: rgba(0, 0, 0, 0.85);
  }
  .el-dialog__body {
    border-bottom: unset;
  }
  .el-dialog__footer {
    padding: 0 24px 24px;
    .el-button {
      width: 100%;
      & + .el-button {
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
    .el-input-number {
      width: 100%;
    }
  }
  .media-item__wrap + .media-item__wrap {
    border-top: 1px solid #e9e9e9;
  }
}
</style>
