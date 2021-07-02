<!--
 * @Author: penglei
 * @Date: 2021-06-28 09:17:27
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-02 17:17:00
 * @FilePath: /frontend/src/components/develop/components/nextContractDialog.vue
-->
<template>
  <!-- 合同续签 -->
  <el-dialog
    title="续签合同"
    :visible.sync="mergeVisible"
    width="388px"
    top="22vh"
    :show-close="false"
    :close-on-click-modal="false"
    custom-class="custom-dialog-wrapper custom-confirm-dialog"
  >
    <div class="content-form">
      <el-select
        multiple
        collapse-tags
        placeholder="请选择合同对象（可多选）"
        v-model="mergeOriginList"
        size="small"
      >
        <el-option
          v-for="(item, index) in contractOriginList"
          :key="index"
          :label="item.originName"
          :value="item.originID"
        >
        </el-option>
      </el-select>
    </div>

    <template slot="footer">
      <el-button @click="mergeVisible = false">取 消</el-button>
      <el-button type="primary" @click="routeNextContract">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "nextContractDialog",
  props: {
    mergeVisible: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      // 合同对象列表
      contractOriginList: [
        {
          originName: "西门/南门",
          originID: 12,
        },
        {
          originName: "停车场",
          originID: 11,
        },
        {
          originName: "北门",
          originID: 10,
        },
      ],
      // 需要合并的合同对象
      mergeOriginList: [],
    };
  },
  watch: {
    mergeVisible(val) {
      val && this.getOriginList();
    },
  },
  mounted() {},
  methods: {
    // 获取可续签的合同对象
    getOriginList() {
      console.log("getOriginList---");
      api
        .getApi("/addsp/devContract/getOriginList", { dcID: "" })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.contractOriginList = [];
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 调转到合同续签
    routeNextContract() {
      if(this.mergeOriginList.length>0) {
        this.$router.push("./nextContract");
      } else {
        this.$message.warning("请选择合同对象！")
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>