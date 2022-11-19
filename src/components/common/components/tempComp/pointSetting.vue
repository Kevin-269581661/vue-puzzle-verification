<template>
    <div>
        <el-dialog
            title="配点设置"
            :visible.sync="dialogVisible"
            :show-close="false"
            width="30%"
        >
            <div class="top-panel">
              <table>
                <td>按小区配点</td>
                <td>按楼栋配点</td>
                <td>按单元配点</td>
              </table>
            </div>

            <div class="border-title">配点规则</div>
            <el-form class="point-rule" label-position="rigth" label-width="140px" style="margin:0 auto;">
                <el-form-item label="配点要求：">
                    <el-radio-group v-model="pointRequest">
                        <el-radio :label="1">优先覆盖目标小区</el-radio>
                        <el-radio :label="2">优先满足点位数量</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="总投放点位数：">
                    <el-input-number
                        v-model="totalPointNum"
                        size="small"
                        controls-position="right"
                        :min="1"
                        :max="100">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="每个小区配点数：">
                    <el-radio-group v-model="resPointNum">
                        <el-radio :label="1">全部点数</el-radio>
                        <el-radio :label="2">指定数量</el-radio>
                    </el-radio-group>
                    <el-input
                        style="width: 100px;"
                        v-model="designPointNum"
                        size="small"
                        :disabled="resPointNum === 1 ? true : false">
                    </el-input>
                </el-form-item>
                <el-form-item label="每栋楼配点上限：">
                    <el-input-number
                        v-model="buildPointMax"
                        size="small"
                        controls-position="right"
                        :min="1"
                        :max="100">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="每单元配点上限：">
                    <el-input
                        style="width: 100px;"
                        v-model="unitPointMax"
                        size="small">
                    </el-input>
                </el-form-item>
            </el-form>

            <div class="border-title">点位要求</div>
            <el-form class="point-rule" label-position="rigth" label-width="140px" style="margin:0 auto;">
                <el-form-item label="方案互斥：">
                    <el-select
                        v-model="mutuallyExclusive"
                        placeholder="请选择"
                        size="small"
                        style="width: 90%;"
                        clearable
                    >
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备型号：">
                    <el-select
                        v-model="mTypes"
                        placeholder="请选择"
                        size="small"
                        multiple
                        collapse-tags
                        clearable
                        style="width: 90%;"
                        @change="handleChange"
                    >
                        <el-option label="全部" value="全部"></el-option>
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                        <el-option label="3" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="安装位置：">
                    <el-checkbox-group v-model="installPosition">
                        <el-checkbox label="全部"></el-checkbox>
                        <el-checkbox label="小区大门"></el-checkbox>
                        <el-checkbox label="侧门"></el-checkbox>
                        <el-checkbox label="楼栋门"></el-checkbox>
                        <el-checkbox label="单元门"></el-checkbox>
                        <el-checkbox label="室外停车场"></el-checkbox>
                        <el-checkbox label="地下停车场"></el-checkbox>
                        <el-checkbox label="其他位置"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="朝外比例不高于：">
                    <el-input-number
                        v-model="outRate"
                        size="small"
                        controls-position="right"
                        :min="1"
                        :max="100">
                    </el-input-number>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
  </template>

  <script>
  export default {
    data() {
        return {
            // 配点规则
            pointRequest: 1, //配点要求
            totalPointNum: 1, //总投放点位数
            resPointNum: 1, //每个小区配点数
            designPointNum: '', //每个小区配点数-指定数量
            buildPointMax: 1, //每栋楼配点上限
            unitPointMax: '', //每单元配点上限

            // 点位要求
            mutuallyExclusive: '', //方案互斥
            mTypes: [], //设备型号
            installPosition: [], //安装位置
            outRate: 1, //朝外比例
        }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
    },
    computed: {
      dialogVisible: {
        get() {
          return this.visible
        },
        set(val) {
          this.$emit('updateVisible', val)
        }
      }
    },
    methods: {
        handleChange(val) {
            const index = this.mTypes.indexOf('全部')
            if(index !== -1) {
                this.mTypes = ['全部']
            }
        }
    }
  }
  </script>

  <style lang="scss" scoped>
  .top-panel {
    width: fit-content;
    margin: 0 auto;
    table {
        border-collapse: collapse;
        td {
            display: inline-block;
            border: 1px solid #D9D9D9;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.016);
            border-radius: 2px 0px 0px 2px;
            padding: 5px 16px;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
            cursor: pointer;

            &:hover {
                border: 1px solid #1890FF;
                color: #1890FF;
            }
        }
    }
  }

  .border-title {
    width: 90%;
    background-color: #F1F1F1;
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
        .el-input-number__increase, .el-input-number__decrease {
            background-color: #fff;
            width: 22px;
        }
    }
  }
  </style>
