<template>
  <div>
    <el-dialog
      title="配点设置"
      :visible.sync="dialogVisible"
      :show-close="false"
      :before-close="handleClose"
      width="519px"
    >
      <div class="top-panel">
        <el-radio-group
          v-model="mediaChooseConfig"
          @change="handleConfigChange"
        >
          <el-radio-button
            v-for="item in tagList"
            :key="item.value"
            :label="item.value"
            >{{ item.name }}</el-radio-button
          >
        </el-radio-group>
      </div>

      <div class="border-title">配点规则</div>
      <el-form
        class="point-rule"
        label-position="rigth"
        label-width="140px"
        style="margin: 0 auto"
      >
        <el-form-item label="配点要求：">
          <el-radio-group v-model="params.pdNumFirstFlag">
            <el-radio :label="false">优先覆盖目标小区</el-radio>
            <el-radio :label="true" style="margin-right: 0"
              >优先满足点位数量</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="总投放点位数：">
          <el-input-number
            v-model="params.pdNum"
            size="small"
            controls-position="right"
            :min="0"
            :max="100"
            class="input-number"
          >
          </el-input-number>
        </el-form-item>

        <template v-if="mediaChooseConfig === 3">
          <el-form-item label="每个小区配点数：">
            <el-radio-group v-model="isAllRes" @change="handleResChange">
              <el-radio :label="true">全部点位</el-radio>
              <el-radio :label="false">指定数量</el-radio>
            </el-radio-group>
            <el-input
              style="width: 100px"
              v-model="params.resChooseSpaceCount"
              size="small"
              :disabled="isAllRes"
              class="input-number"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="每栋楼配点上限：">
            <el-input-number
              v-model="params.floorChooseSpaceMax"
              size="small"
              controls-position="right"
              :min="0"
              :max="+params.resChooseSpaceCount"
              class="input-number"
              :disabled="isAllRes"
            >
            </el-input-number>
          </el-form-item>

          <el-form-item label="每单元配点上限：">
            <el-input-number
              v-model="params.unitChooseSpaceMax"
              size="small"
              controls-position="right"
              :min="0"
              :max="+params.floorChooseSpaceMax"
              class="input-number"
              :disabled="isAllRes"
            >
            </el-input-number>
          </el-form-item>
        </template>

        <template v-else-if="mediaChooseConfig === 2">
          <el-form-item label="投放楼栋数：">
            <el-radio-group v-model="isAllBuild">
              <el-radio :label="true">全部可投楼栋</el-radio>
              <el-radio :label="false">指定楼栋数</el-radio>
            </el-radio-group>
            <el-input
              style="width: 100px"
              v-model="params.floorMaxCount"
              size="small"
              :disabled="isAllBuild"
              class="input-number"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="每楼栋配点数：">
            <el-radio-group v-model="isAllBuildSpace">
              <el-radio :label="true">全部点位</el-radio>
              <el-radio :label="false">指定点位数</el-radio>
            </el-radio-group>
            <el-input
              style="width: 100px"
              v-model="params.floorChooseSpaceMax"
              size="small"
              :disabled="isAllBuildSpace"
              class="input-number"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="每单元配点上限：">
            <el-input-number
              v-model="params.unitChooseSpaceMax"
              size="small"
              controls-position="right"
              :min="0"
              :max="+params.floorChooseSpaceMax"
              class="input-number"
              :disabled="isAllBuildSpace"
            >
            </el-input-number>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="投放楼栋数：">
            <el-radio-group v-model="isAllBuild">
              <el-radio :label="true">全部可投楼栋</el-radio>
              <el-radio :label="false">指定楼栋数</el-radio>
            </el-radio-group>
            <el-input
              style="width: 100px"
              v-model="params.floorMaxCount"
              size="small"
              :disabled="isAllBuild"
              class="input-number"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="投放单元数：">
            <el-radio-group v-model="isAllUnit">
              <el-radio :label="true">全部可投单元</el-radio>
              <el-radio :label="false">指定单元数</el-radio>
            </el-radio-group>
            <el-input
              style="width: 100px"
              v-model="params.unitMaxCount"
              size="small"
              :disabled="isAllUnit"
              class="input-number"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="每单元配点数：">
            <el-radio-group v-model="isAllUnitSpace">
              <el-radio :label="true">全部点位</el-radio>
              <el-radio :label="false">指定点位数</el-radio>
            </el-radio-group>
            <el-input
              style="width: 100px"
              v-model="params.unitChooseSpaceMax"
              size="small"
              :disabled="isAllUnitSpace"
              class="input-number"
            >
            </el-input>
          </el-form-item>
        </template>
      </el-form>

      <div class="border-title">点位要求</div>
      <el-form
        class="point-rule"
        label-position="rigth"
        label-width="140px"
        style="margin: 0 auto"
      >
        <el-form-item label="方案互斥：">
          <el-select
            v-model="params.excludeApId"
            placeholder="请选择"
            size="small"
            clearable
            filterable
          >
            <el-option
              v-for="item in rejectAdPlan"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号：">
          <el-select
            v-model="params.deviceTypeList"
            placeholder="请选择"
            size="small"
            collapse-tags
            clearable
            multiple
            @change="handleChange"
          >
            <el-option
              v-for="item in mTypeList.slice(1)"
              :key="item.dictValue"
              :label="item.dictDesc"
              :value="item.dictValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置：">
          <el-checkbox-group v-model="params.mediaSiteList">
            <el-checkbox
              v-for="item in sites.slice(1)"
              :key="item.dictValue"
              :label="item.dictValue"
              >{{ item.dictDesc }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="朝外比例不高于：">
          <div class="m-inputnum">
            <el-input-number
              :disabled="!sessionData.uType === 'ADN_MD'"
              v-model="params.siteOrientationRate"
              size="small"
              controls-position="right"
              :min="1"
              :max="100"
              class="input-number"
            >
            </el-input-number>
            <span class="unit" :class="{min: params.siteOrientationRate < 10, max: params.siteOrientationRate >= 100}">%</span>
          </div>

        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleCommit">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="succeedVisible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <div class="el-message-box__container">
        <div class="el-message-box__status el-icon-success"></div>
        <div class="el-message-box__message">
          <p class="pointTitle">恭喜您，配点成功</p>
        </div>
      </div>
      <div class="pointTxt">
        计划配点共{{adResMatch.planResCount}}个小区，成功{{adResMatch.adResMatchSummaryVO.successResCount}}个，失败{{adResMatch.adResMatchSummaryVO.failResCount}}个
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDetails"
          >查看详情</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../../api/api";
import sessFun from "../../../../commonFun/sessFun";

export default {
  data() {
    return {
      tagList: [
        { name: "按小区配点", value: 3 },
        { name: "按楼栋配点", value: 2 },
        { name: "按单元配点", value: 1 },
      ],
      mediaChooseConfig: 3, // 配点纬度：0-点位 1-单元 2-楼栋 3-小区
      params: {
        excludeApId: "", // 排斥方案id
        deviceTypeList: [], // 设备类型
        mediaSiteList: [], // 位置类型集合
        pdNumFirstFlag: false, // 是否优先满足点位数量
        siteOrientationRate: 50, // 朝外比例上限

        pdNum: "", // 投放总数
        resChooseSpaceCount: "", // 小区配点数量上限 -1-全部

        floorMaxCount: "", // 楼栋数量上限 -1-全部
        floorChooseSpaceMax: "", // 楼栋配点数量上限 -1-全部

        unitMaxCount: "", // 单元数量上限 -1-全部
        unitChooseSpaceMax: "", // 单元配点数量上限 -1-全部

        matchOriginType: 0, // 匹配数据来源:0-导入小区 1-地图

        matchMediaCacheKey: "", // 导入媒体缓存
        matchResCacheKey: "", // 导入小区媒体
      },

      isAllRes: true,
      isAllBuild: true,
      isAllBuildSpace: true,
      isAllUnit: true,
      isAllUnitSpace: true,

      sessionData: "", // 登录信息

      succeedVisible: false,
      
      adResMatch: {
        adResMatchSummaryVO: {},
        adResMatchSummaryVO: {}
      },  // 配点成功详情
    };
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    // 方案互斥
    rejectAdPlan: {
      type: Array,
      default: () => [],
    },

    // 设备型号
    mTypeList: {
      type: Array,
      default: () => [],
    },

    //安装位置
    sites: {
      type: Array,
      default: () => [],
    },

    // 配点匹配数据
    matchKeys: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  watch: {
    // 监听选点维度重置页面数据
    mediaChooseConfig() {
      this.resetParams();
    },
  },
  mounted() {
    this.getSession();
  },
  methods: {
    getSession() {
      this.sessionData = sessFun.getSess();
    },
    handleChange(val) {
      const index = this.params.deviceTypeList.indexOf("全部");
      if (index !== -1) {
        this.params.deviceTypeList = ["全部"];
      }
    },

    handleClose() {
      this.dialogVisible = false;
      this.resetParams();
    },

    handleResChange(isAllRes) {
      //   if (isAllRes) {
      //     this.params.resChooseSpaceCount = "";
      //     this.params.floorChooseSpaceMax = "";
      //     this.params.unitChooseSpaceMax = "";
      //   } else {
      //     this.params.resChooseSpaceCount = 1;
      //     this.params.floorChooseSpaceMax = 1;
      //     this.params.unitChooseSpaceMax = 1;
      //   }
    },

    handleConfigChange() {},

    // 重置参数
    resetParams() {
      let params = this.params;
      params.excludeApId = "";
      params.deviceTypeList = [];
      params.mediaSiteList = [];
      params.pdNumFirstFlag = false;
      params.siteOrientationRate = 50;
      params.pdNum = "";
      params.resChooseSpaceCount = "";
      params.floorMaxCount = "";
      params.floorChooseSpaceMax = "";
      params.unitMaxCount = "";
      params.unitChooseSpaceMax = "";
      params.matchOriginType = 0;
      (this.isAllRes = true),
        (this.isAllBuild = true),
        (this.isAllBuildSpace = true),
        (this.isAllUnit = true),
        (this.isAllUnitSpace = true);
    },

    // 参数处理
    handleCommit() {
      let info = this.params;
      let tempInfo = {};
      // 公共参数
      let publicInfo = {
        mediaChooseConfig: this.mediaChooseConfig, // 配点纬度
        pdNumFirstFlag: info.pdNumFirstFlag, // 配点要求
        pdNum: info.pdNum, // 总投放点位数
        excludeApId: info.excludeApId, //方案互斥
        deviceTypeList: info.deviceTypeList, // 设备型号
        mediaSiteList: info.mediaSiteList, // 安装位置
        siteOrientationRate: info.siteOrientationRate, // 朝内外比例
        matchOriginType: info.matchOriginType, // 匹配来源
        matchMediaCacheKey: this.matchKeys.matchMediaCacheKey, //导入媒体缓存
        matchResCacheKey: this.matchKeys.matchResCacheKey, //导入小区媒体
      };
      // 按小区
      if (this.mediaChooseConfig === 3) {
        tempInfo = {
          resChooseSpaceCount: this.isAllRes
            ? -1
            : Number(info.resChooseSpaceCount), // 每个小区配点数
          floorChooseSpaceMax: this.isAllRes ? -1 : info.floorChooseSpaceMax, // 每栋楼配点上限
          unitChooseSpaceMax: this.isAllRes ? -1 : info.unitChooseSpaceMax, // 每单元配点上限
        };
      }
      // 按楼栋
      else if (this.mediaChooseConfig === 2) {
        tempInfo = {
          floorMaxCount: this.isAllBuild ? -1 : Number(info.floorMaxCount), // 投放楼栋数
          floorChooseSpaceMax: this.isAllBuildSpace
            ? -1
            : info.floorChooseSpaceMax, // 每楼栋配点数
          unitChooseSpaceMax: this.isAllBuildSpace
            ? -1
            : info.unitChooseSpaceMax, // 每单元配点上限
        };
      }
      // 按单元
      else {
        tempInfo = {
          floorMaxCount: this.isAllBuild ? -1 : Number(info.floorMaxCount), // 投放楼栋数
          unitMaxCount: this.isAllUnit ? -1 : Number(info.unitMaxCount), // 投放单元数
          unitChooseSpaceMax: this.isAllUnitSpace
            ? -1
            : Number(info.unitChooseSpaceMax), // 每单元配点数
        };
      }
      let params = {
        ...publicInfo,
        ...tempInfo,
      };
      this.handlePointConfig(params);
    },

    // 小区导入配点
    handlePointConfig(data) {
      api
        .postApi_json("/addsp/api/v2/adPlan/getResImportMatchResult", data)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.dialogVisible = false
            this.succeedVisible = true
            this.adResMatch = res.data.data
          } else {
            sessFun.messageFun("warning", `配点失败`);
          }
        })
        .catch((error) => {
          sessFun.messageFun("warning", res.data.MSG);
          console.log(error, "error---handlePointConfig");
        });
    },

    handleDetails () {
      this.dialogVisible = false
      this.succeedVisible = false
      this.$emit('handleDetails', this.adResMatch)
    }
  },
};
</script>

<style lang="scss" scoped>
.top-panel {
  width: fit-content;
  margin: 0 auto;
  table {
    border-collapse: collapse;
    td {
      display: inline-block;
      border: 1px solid #d9d9d9;
      box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
      border-radius: 2px 0px 0px 2px;
      padding: 5px 16px;
      font-weight: 400;
      font-size: 14px;
      line-height: 22px;
      cursor: pointer;

      &:hover {
        border: 1px solid #1890ff;
        color: #1890ff;
      }
    }
  }
}

.border-title {
  width: 90%;
  background-color: #f1f1f1;
  line-height: 24px;
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  padding: 4px 12px;
  margin: 24px auto;
}

.point-rule {
  /deep/ .el-form-item {
    margin-bottom: 16px;
    .el-form-item__label {
      padding: 0;
      font-weight: 400;
      font-size: 14px;
      line-height: 32px;
      color: rgba(0, 0, 0, 0.85);
    }
    .el-form-item__content {
      line-height: 32px;
    }
  }

  /deep/ .el-radio-group {
    .el-radio {
      margin-right: 16px;
    }
  }

  /deep/ .el-input-number--small {
    width: 100px;
    .el-input-number__increase,
    .el-input-number__decrease {
      background-color: #fff;
      width: 22px;
    }
  }
}

.input-number {
  /deep/ .el-input__inner {
    width: 100px;
  }
}

.pointTitle {
  font-size: 16px;
  font-weight: bold;
}
.pointTxt {
  margin-top: 16px;
  font-size: 13px;
  padding-left: 36px;
}

.m-inputnum {
  display: inline-block;
  position: relative;
  height: 34px;
  .unit {
    position: absolute;
    top: 50%;
    right: 50px;
    transform: translateY(-50%);
    z-index: 9;
    &.min {
      right: 60px;
    }
    &.max {
      right: 45px;
    }
  }
}
</style>
