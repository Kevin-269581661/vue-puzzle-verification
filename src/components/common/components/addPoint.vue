<template>
  <div>
    <el-dialog
      title="智能配点"
      :visible.sync="dialogVisible"
      width="418px"
      :show-close="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="add-point-dialog"
      center
    >
      <div>
        <div class="board board1">
          <div class="board-title">配点信息</div>
          <ul class="info-list">
            <li class="info-item">
              <span class="item-label">意向投放小区：</span>
              <span class="item-content">
                80个
                <span class="active" @click="showDialogTable = true">查看</span>
              </span>
            </li>
            <li class="info-item">
              <span class="item-label">计划投放点位：</span>
              <span class="item-content"> 100 个 </span>
            </li>
            <li class="info-item">
              <span class="item-label">客户预算：</span>
              <span class="item-content"> ¥3,000,000 </span>
            </li>
            <li class="info-item">
              <span class="item-label">投放排期：</span>
              <span class="item-content"> 2021年3月29日 - 2021年4月28日 </span>
            </li>
            <li class="info-item">
              <span class="item-label">投放排期：</span>
              <span class="item-content"> 2021年3月29日 - 2021年4月28日 </span>
            </li>
            <li class="info-item">
              <span class="item-label">客户要求：</span>
              <span class="item-content ellipsis">
                客户要求广告门朝向必须朝南
              </span>
            </li>
          </ul>
        </div>

        <div class="board board2">
          <el-form label-position="top" label-width="82px">
            <el-form-item label="配点要求">
              <el-checkbox-group v-model="formDataObj.pointDemand">
                <el-checkbox
                  label="优先选择空置久的点位"
                  name="type"
                ></el-checkbox>
                <el-checkbox label="1个门选择1个点位" name="type"></el-checkbox>
                <el-checkbox label="联排门仅选1面" name="type"></el-checkbox>
              </el-checkbox-group>
              <el-checkbox
                class="combination"
                label="A面占比"
                disabled
                name="type"
              ></el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <div class="board board3">
          <div class="board-title">点位排斥</div>
          <el-form label-position="left" label-width="82px">
            <el-form-item label="方案名称：">
              <el-select
                size="mini"
                v-model="formDataObj.planName"
                placeholder="请选择方案"
              >
                <el-option
                  v-for="item in excludePlanList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广告限制：">
              <el-select
                v-model="formDataObj.region"
                placeholder="请选择广告限制"
              >
                <el-option
                  v-for="item in excludePlanList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >配 点</el-button
        >
      </span>
    </el-dialog>
    <dialog-table
      :tableData="intentionTableData"
      :tableColumn="intentionTableColumn"
      :visible="showDialogTable"
      @resetVisible="showDialogTable = false"
      title="意向投放小区"
      width="83%"
    >
      <el-table-column slot="otherColumn" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </dialog-table>
  </div>
</template>

<script>
import api from "../../../api/api";
// 时间格式化
import timeFormat from "../../../commonFun/timeFormat.js";
import sessFun from "../../../commonFun/sessFun.js";
import dialogTable from "./dialogTable.vue";
export default {
  name: "addPoint",
  components: {
    dialogTable,
  },
  data() {
    return {
      dialogVisible: true,
      showDialogTable: false,
      formDataObj: {
        planName: "",
        pointDemand: [],
        excludeAd: [],
        excludePlan: "",
      },
      excludePlanList: [
        {
          label: "排斥方案label",
          value: "排斥方案value",
        },
      ],
      intentionTableData: [
        {
          rowKey: 1,
          resource: '尚东峰景雅苑二期',
          city: '广州市',
          area: '海珠区',
          period: '2021/03/20 ~ 2021/04/23',
          mediaNum: 3,
          pointNum: 1
        },
        {
          rowKey: 2,
          resource: '尚东峰景雅苑二期',
          city: '北京市',
          area: '海淀区',
          period: '2021/03/10 ~ 2021/06/23',
          mediaNum: 6,
          pointNum: 3
        }
      ],
      intentionTableColumn: [
        {
          label: '序号',
          prop: 'rowKey',
          width: '50px'
        },
        {
          label: '资源',
          prop: 'resource',
          minWidth: '100px',
          tip: true
        },
        {
          label: '城市',
          prop: 'city',
          minWidth: '100px',
          tip: true
        },
        {
          label: '区域',
          prop: 'area',
          minWidth: '100px',
          tip: true
        },
        {
          label: '排期',
          prop: 'period',
          minWidth: '160px',
          tip: true
        },
        {
          label: '媒体数量（门）',
          prop: 'mediaNum',
          width: '120px',
          align: 'right'
        },
        {
          label: '计划投放数量（面）',
          prop: 'pointNum',
          width: '160px',
          align: 'right'
        }
      ]
    };
  },
  mounted() {},
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .add-point-dialog {
  .el-dialog__header {
    text-align: left;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__header {
    padding: 16px 24px;
  }
  .el-dialog__body {
    padding: 0 24px;
    border-bottom: 1px solid rgba(233, 233, 233, 1);
  }
  .el-dialog__footer {
  }
  .el-form-item {
    .el-form-item__label {
      padding-left: 0;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  .el-checkbox-group {
    display: flex;
    flex-flow: column;
  }
  .board {
    padding: 16px 0;
    & + .board {
      border-top: 1px solid rgba(233, 233, 233, 1);
    }
    .board-title {
      line-height: 24px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .board1 .info-item {
    margin-top: 8px;
    .active {
      color: rgba(24, 144, 255, 1);
      cursor: pointer;
    }
    .item-content.ellipsis {
      width: 290px;
      display: inline-block;
      vertical-align: text-bottom;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .board2 {
    padding-bottom: 16px;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label {
      line-height: 24px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
    .el-form-item__content {
      line-height: 32px;
    }
    .combination {
    }
  }
  .board3 {
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        line-height: 46px;
      }
    }
  }
}
</style>
