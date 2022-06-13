<template>
  <el-dialog
    width="368px"
    custom-class="divide-media-dialog"
    @submit.native.prevent
    :visible.sync="dialogVisible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escap="false"
    :title="`小区拆分（${currentStep}/3）`"
  >
    <el-form
      ref="divideMediaForm"
      :model="divideMediaForm"
      :label-position="currentStep === 3 ? 'top' : ''"
      hide-required-asterisk
    >
      <el-form-item
        v-if="currentStep === 1"
        label="拆分数量："
        prop="divideResCount"
        :label-width="formLabelWidth"
        :rules="{
          required: true,
          message: '请输入拆分数量',
          trigger: 'change',
        }"
      >
        <el-input-number
          v-model="divideMediaForm.divideResCount"
          controls-position="right"
          size="small"
          :min="2"
          :max="mediasOfRes.length || 0"
        ></el-input-number>
      </el-form-item>
      <template v-if="currentStep === 2">
        <el-form-item
          v-for="(resItem, resIndex) in divideMediaForm.divideResArr"
          :key="resIndex"
          :label="`小区${resIndex * 1 + 1}：`"
          :prop="`divideResArr[${resIndex}].resName`"
          :label-width="formLabelWidth"
          :rules="[
            {
              required: true,
              message: '小区名称不能为空!',
              trigger: ['blur', 'change'],
            },
            { validator: validateSpace, trigger: ['blur', 'change'] },
            {
              validator: validateSpecialString,
              trigger: ['blur', 'change'],
            },
            { validator: (rule, value, callback) => isHaveCommenName(rule, value, callback, resIndex), trigger: 'blur' },
            { max: 40, message: '最多只能输入40个字节', trigger: 'change' },
          ]"
        >
          <el-input
            placeholder="请输入小区名称"
            v-model="resItem.resName"
            size="small"
          >
          </el-input>
        </el-form-item>
      </template>
      <template v-if="currentStep === 3">
        <el-form-item
          v-for="(resItem, resIndex) in divideMediaForm.divideResArr"
          :key="resIndex"
          :label="`${resItem.resName}：`"
          :prop="`divideResArr.${resIndex}.value`"
          :label-width="formLabelWidth"
          :rules="[{ required: true, message: '请选择媒体', trigger: 'blur' }]"
        >
          <el-select
            v-model="resItem.value"
            multiple
            clearable
            collapse-tags
            size="small"
            placeholder="请选择媒体"
            :multiple-limit="
              mediasOfRes.length - divideMediaForm.divideResCount + 1
            "
            @visible-change="(visible) => mediasOfResChange(resItem.value, visible)"
          >
            <el-option
              v-for="item in mediasOfRes"
              :key="item.mID"
              :label="item.mTitle"
              :value="item.mID"
              :disabled="item.selected"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelDialog()">取 消</el-button>
      <template v-if="currentStep === 1">
        <el-button type="primary" @click="changeStep(2)">下一步</el-button>
      </template>
      <template v-if="currentStep === 2">
        <el-button @click="changeStep(1)">上一步</el-button>
        <el-button type="primary" @click="changeStep(3)">下一步</el-button>
      </template>
      <template v-if="currentStep === 3">
        <el-button @click="changeStep(2)">上一步</el-button>
        <el-button type="primary" @click="changeStep(4)">确 定</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import api from "../../../api/api.js";
export default {
  name: "DivideMediaDialog",
  props: {
    mediasOfRes: {
      type: Array,
      default: () => [],
    },
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    resName: {
      type: String,
      default: "",
    },
    resID: {
      type: [Number, String],
      required: true,
      default: -1,
    },
    rid: {
      type: [String, Number],
      default: "",
    },
    cityId: {
      type: [String, Number],
      default: "",
    },
  },
  watch: {
    "divideMediaForm.divideResCount": {
      handler: function (newVal, oldVal) {
        if (newVal >= 2) {
          const subVal = newVal - oldVal;
          if (subVal > 0) {
            for (let i = 0; i < subVal; i += 1) {
              this.divideMediaForm.divideResArr.push({
                resName: "",
                value: [],
              });
            }
            this.divideMediaForm.divideResArr[0].resName = this.resName;
          } else {
            this.divideMediaForm.divideResArr.length = newVal;
          }
        } else {
          this.divideMediaForm.divideResArr.length = 0;
        }
      },
    },
  },
  data() {
    return {
      currentStep: 1,
      divideMediaForm: {
        divideResCount: 0,
        divideResArr: [],
      },
      /* ['零', '一', '二', '三', '四', '五', '六','七', '八', '九']
            ['万', '千', '百', '十', ''] */
      sessionData: {},
      formLabelWidth: "70px",
    };
  },
  created() {
    this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
  },
  mounted() {},
  methods: {
    validateSpace(rule, value, callback) {
      if (value) {
        if (value.match(/^\s+$/)) {
          callback(new Error("所填内容不能为空格!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 判断是否包含有特殊字符 // “/”
    validateSpecialString(rule, value, callback) {
      const reg = /[\/]/;
      if (reg.test(value)) {
        callback(new Error("不可填写特殊符号!"));
      } else {
        callback();
      }
    },
    // 按所属公司的城市区域检查是否有重复的资源名称
    async isHaveCommenName(rule, value, callback, resIndex) {
      if(this.resName === value && resIndex === 0) {
        callback();
        return;
      }
      const sameResNameCount = this.divideMediaForm.divideResArr.reduce(
        (count, item) => {
          if (value === item.resName) {
            count += 1;
          }
          return count;
        },
        0
      );
      if (sameResNameCount > 1) {
        callback(new Error("小区名称不能重复哦～"));
        return;
      }
      /* let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetResInfoByName",
        data: {
          prId: this.cityId,
          rId: this.rid,
          name: value,
        },
      };
      await api.postApi_new(this.apiVar.Media, params).then((res) => {
        if (res.data.SysCode == 200200) {
          let resData = res.data.data;
          if (resData.length) {
            callback(new Error("该小区名称已存在！"));
          } else {
            callback();
          }
        } else {
          this.$message.warning(res.data.MSG || "小区查询失败！");
        }
      }); */
    },
    // 提交小区拆分信息
    postDivideData() {
      let params = {
        originResID: this.resID,
        resDivideInfos: this.divideMediaForm.divideResArr.map((item, index) => {
          const { resName, value: mediaIDs } = item;
          const groupItem = {
            mediaIDs,
            resName,
          };
          if (index === 0) {
            groupItem.resID = this.resID;
          }
          return groupItem;
        }),
      };
      api.postApi_json("/addsp/api/v1/resInfo/divide", params).then((res) => {
        if (res.data.SysCode === 200200) {
          this.cancelDialog();
          this.$emit("refreshDetail");
          this.$message({
            type: "success",
            message: res.data.MSG || "小区拆分成功！",
          });
        } else {
          this.$message({
            type: "warning",
            message: res.data.MSG || "小区拆分失败！",
          });
        }
      });
    },
    cancelDialog() {
      if (this.$refs.divideMediaForm) {
        this.$refs.divideMediaForm.resetFields();
        this.currentStep = 1;
        this.divideMediaForm.divideResCount = 0;
        this.divideMediaForm.divideResArr.length = 0;
        // this.mediasOfResChange();
        this.$emit("update:dialogVisible", false);
      }
    },
    changeStep(nextStep) {
      if (this.currentStep < nextStep) {
        // 下一步
        this.$refs.divideMediaForm.validate((valid, object) => {
          if (valid) {
            if (nextStep === 4) {
              // 提交小区拆分数据
              this.postDivideData();
            } else {
              this.currentStep = nextStep;
            }
          } else {
            console.log("error submit!!", object);
            return false;
          }
        });
      } else {
        // 上一步
        this.$refs.divideMediaForm.clearValidate();
        this.currentStep = nextStep;
      }
    },
    // 禁用已选媒体选项
    mediasOfResChange(values = [], visible) {
      // 打开下拉时触发
      let allSelectedMedias = this.divideMediaForm.divideResArr.reduce(
        (group, item) => {
          if(visible && values == item.value) {
            // 打开下拉时不禁用当前所选
            return group;
          }
          return group.concat(item.value);
        },
        []
      );
      this.mediasOfRes.forEach((item) => {
        this.$set(item, 'selected', allSelectedMedias.includes(item.mID));
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .divide-media-dialog {
  .el-form-item {
    padding: 8px 0;
    margin: 0;

    .el-form-item__label {
      color: rgba(0, 0, 0, 0.65);
    }

    ::placeholder {
      /*Firefox,Chrome,Opera*/
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
    }

    :-ms-input-placeholder {
      /*InternetExplorer10-11*/
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
    }

    ::-ms-input-placeholder {
      /*MicrosoftEdge*/
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
    }
  }

  .el-form-item__content {
    line-height: unset;

    .el-input__inner {
      color: rgba(0, 0, 0, 0.65);
    }
    .el-input-number--small,
    .el-select--small {
      width: 100%;
    }

    .el-input-group__append {
      padding: 4px 12px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
    }
  }

  .special-padding.el-form-item {
    .el-input-group__append {
      padding: 4px 9px;
    }
  }

  .form-item__price {
    line-height: 32px;
    color: rgba(0, 0, 0, 0.65);
  }

  .el-dialog__header {
    padding: 16px 24px;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
  }

  .el-dialog__body {
    padding: 0 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px 24px;

    .dialog-footer__button {
      word-spacing: -1em;

      .el-button + .el-button {
        margin-left: 16px;
      }
    }
  }

  .el-form-item__label {
    padding: 0;
    line-height: 32px;
  }
}
</style>
