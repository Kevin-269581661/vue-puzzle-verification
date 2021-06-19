<!--
 * @Author: penglei
 * @Date: 2021-06-09 16:28:22
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-18 14:17:12
 * @FilePath: /frontend/src/components/develop/components/customFiled.vue
-->
<template>
  <div>
    <h1 class="custom-title">自定义字段</h1>
    <el-table
      :data="tableData"
      style="width: 100%"
      max-height="500px"
      v-loading="loading"
      element-loading-text="玩命加载中..."
      element-loading-spinner="el-icon-loading"
      class="custom-filed-table"
      border
    >
      <el-table-column prop="filedName" label="字段名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.operate">
            <el-input size="small"></el-input>
          </div>
          <div v-else>
            {{ scope.row.filedName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="filedType" label="字段类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.operate">
            <el-select
              v-model="scope.row.filedType"
              size="small"
              placeholder="请选择"
            >
              <el-option label="日期" value="date"></el-option>
              <el-option label="数值型" value="number"></el-option>
              <el-option label="单选下拉列表" value="select"></el-option>
              <el-option
                label="多选下拉列表"
                value="multipleSelect"
              ></el-option>
              <el-option label="单行文本框" value="input"></el-option>
              <el-option label="多行文本框" value="textarea"></el-option>
            </el-select>
          </div>
          <div v-else>
            {{ scope.row.filedType }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="filedValue"
        label="字段值"
        min-width="450px"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="scope.row.operate">
            <template v-if="scope.row.filedType == 'date'">
              <span>可选择具体年/月/日</span>
            </template>
            <template v-if="scope.row.filedType == 'select'">
              <!-- <span>{{scope.row}}</span> -->
              <auto-add-option
                :value="scope.row.filedValue"
                @input="(value) => (scope.row.filedValue = value)"
              ></auto-add-option>
            </template>
            <template v-else-if="scope.row.filedType == 'multipleSelect'">
              <auto-add-option
                :value="scope.row.filedValue"
                @input="(value) => (scope.row.filedValue = value)"
              ></auto-add-option>
            </template>
            <template v-else-if="scope.row.filedType == 'number'">
              <span>可填写数值</span>
            </template>
            <template v-else-if="scope.row.filedType == 'input'">
              <span>可输入单行文本内容</span>
            </template>
            <template v-else-if="scope.row.filedType == 'textarea'">
              <span>可输入多行文本内容</span>
            </template>
          </div>
          <div v-else>
            <span>{{ `${scope.row.filedValue}` }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column key="3" prop="operate" label="操作" width="198">
        <template slot-scope="scope">
          <div v-if="scope.row.operate" class="operate-column">
            <span class="operate-column-btn" @click="saveFiled(scope.row)"
              >保存</span
            >
            <span class="operate-column-btn" @click="cancelEditFiled(scope.row)"
              >取消</span
            >
          </div>
          <div v-else class="operate-column">
            <span class="operate-column-btn" @click="editFiled(scope.row)"
              >编辑</span
            >
          </div>
        </template>
      </el-table-column>
      <div slot="append">
        <div class="add_res" @click="addRow()">
          <i class="el-icon-plus" style="color: rgba(24, 144, 255, 1)"></i>
          新建字段
        </div>
      </div>
    </el-table>
  </div>
</template>

<script>
import autoAddOption from "@/components/common/components/autoAddOption.vue";
export default {
  name: "customFiled",
  components: {
    autoAddOption,
  },
  props: {},
  data() {
    return {
      tableData: [
        {
          filedName: "日期",
          filedType: "date",
          filedValue: "",
          operate: true,
        },
        {
          filedName: "单选下拉列表",
          filedType: "select",
          filedValue: ["选项1", "选项2", "选项3"],
          operate: false,
        },
        {
          filedName: "多选下拉列表",
          filedType: "multipleSelect",
          filedValue: [],
          operate: false,
        },
        {
          filedName: "数值型",
          filedType: "number",
          filedValue: 0,
          operate: false,
        },
        {
          filedName: "单行文本框",
          filedType: "input",
          filedValue: "",
          operate: false,
        },
        {
          filedName: "多行文本框",
          filedType: "textarea",
          filedValue: "",
          operate: false,
        },
      ],
      loading: false,
      currentPageSize: 10,
      currentPage: 1,
      totalNum: 0,
    };
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {
    saveFiled(row) {
      console.log("save--", row);
    },
    editFiled(row) {
      row.operate = true;
      console.log("edit--");
    },
    cancelEditFiled(row) {
      console.log("cancelEditFiled--");
      row.operate = false;
    },
    handleClose() {
      this.$emit("closeDialog");
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    addRow() {
      this.tableData.push({
        resourceId: "",
        resourceName: "",
        regionName: "",
        regionId: "",
        cityId: "",
        cityName: "",
        tradingArea: "",
        type: "",
        address: "",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-title {
  text-align: left;
  padding-bottom: 24px;
}
.add_res {
  box-sizing: border-box;
  height: 32px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  margin: 10px 16px;
  font-size: 14px;
  color: rgba(24, 144, 255, 1);
}

.add_res:hover {
  border-color: rgba(24, 144, 255, 1);
}
/deep/ .custom-filed-table.el-table tr {
  th,
  td {
    // height: 46px;
    .cell {
      // height: 25px;
      // line-height: 25px;
      .el-input-number {
        width: unset;
        // line-height: 24px;
        margin: 0;
        .el-input__inner {
          width: 64px;
          // height: 24px;
          padding: 0 28px 0 8px;
          // line-height: 24px;
          text-align: center;
        }
      }
    }
    .operate-column {
      color: #1890ff;
      .operate-column-btn {
        cursor: default;
      }
    }
  }
  /* .el-table__expanded-cell[class*="cell"] {
    padding-left: 16px;
  } */
}
/* .pagination {
  padding: 16px 0 0;
  text-align: right;
  .el-input__inner {
    width: 100%;
    height: 28px;
  }
  .el-pagination__jump {
    margin-left: 0;
  }
} */
</style>
