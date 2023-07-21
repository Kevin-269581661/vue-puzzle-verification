<template>
  <div>
    <el-dialog title="收藏管理" :visible.sync="visible" width="80%" top="10vh">
      <el-table :data="collectList" v-loading="tableLoading" height="700" style="width: 100%"  element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">

        <el-table-column label="序号" type="index" width="80"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="空位类型" prop="vacancy"></el-table-column>
        <el-table-column label="城市" prop="cityDisplayStr"></el-table-column>
        <el-table-column label="媒体类型" prop="mediaTypeDisplayStr"></el-table-column>
        <el-table-column label="日期" >
          <template slot-scope="scope">
            <span v-if="scope.row.defaultTimeFlag">默认半年日期</span>
            <span v-else>{{ scope.row.startTime || '---' }} 至 {{ scope.row.endTime || '---' }}</span>
          </template>
        </el-table-column>

        <el-table-column  label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="cancelCollect(scope.row, scope.$index)">取消收藏</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    collectList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      visible: false,
      tableLoading: false
    };
  },
  mounted () {

  },
  methods: {
    /**
     * 取消收藏
     */
    cancelCollect({ id, name }, index) {
      this.$confirm(`确定要取消收藏【${name}】的筛选吗？`, '温馨提示', {
        type: 'warning'
      }).then(() => {
        this.tableLoading = true
        this.$emit('cancelCollect', {
          id,
          onComplete: () => {
            this.tableLoading = false
          }
        })
      }).catch(() => {});
    },
    /**
     * 获取收藏列表
     */
     getCollectList() {
      this.tableLoading = true
      this.$emit('getCollectList', {
        onComplete: () => {
          this.tableLoading = false
        }
      })
    },
    open() {
      this.visible = true
      // this.getCollectList()
    },
    close() {
      this.visible = false
    }
  },
};
</script>

<style lang="scss" scoped>

</style>
