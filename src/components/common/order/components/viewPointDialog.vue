<template>
  <div class="dialog_container">
    <!-- 查看点位-弹框组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      title="查看点位"
      width="80%"
      @closed="afterClose"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <TableList
            :columns="tableColumns"
            :dataSource="tableList"
            :loading="tableLoading"
            @refreshTable="getTableList"
          >
            <!-- 排期 -->
            <template slot="timeRange" slot-scope="slotProps">
              {{ slotProps.row.pbStar || '--' }} 至 {{ slotProps.row.pbEnd || '--' }}
            </template>

          </TableList>
        </div>
        <!-- <div class="custom_dialog_footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
        </div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableList from "@/components/common/components/TableList/index.vue";
import searchTableMixin from '@/mixins/searchTableMixin'

/**
 * 初始化搜索数据
 */
 const initSearchData = () => ({
  processCompanyId: null
})
/**
 * 初始化列表字段配置
 */
const initTableColumns = () => [
  {
    title: '资源名称',
    dataIndex: 'resName',
    fixed: 'left',
    width: 150,
  },
  {
    title: '媒体名称',
    dataIndex: 'mTitle',
    width: 150,
  },
  {
    title: '媒体类型',
    dataIndex: 'mediaTypeName',
    width: 120,
  },
  {
    title: '投放面',
    dataIndex: 'asLab',
    width: 90,
  },
  {
    title: '位置朝向',
    dataIndex: 'siteOrientation',
    width: 100,
  },
  {
    title: '城市',
    dataIndex: 'city',
    width: 100,
  },
  {
    title: '区域',
    dataIndex: 'rName',
    width: 100,
  },
  {
    title: '媒体位ID',
    dataIndex: 'assetTag',
    width: 100,
  },
  {
    title: '街道',
    dataIndex: 'street',
    width: 150,
  },
  {
    title: '商圈',
    dataIndex: 'tradingArea',
    width: 120,
  },
  {
    title: '设备类型',
    dataIndex: 'mType',
    width: 120,
  },
  {
    title: '位置类型',
    dataIndex: 'site',
    width: 100,
  },
  {
    title: '楼栋',
    dataIndex: 'buildingName',
    width: 100,
  },
  {
    title: '单元',
    dataIndex: 'unitName',
    width: 100,
  },
  {
    title: '排期',
    dataIndex: 'timeRange',
    width: 220,
    slot: 'timeRange'
  }
]

const initTableSetting = () => ({
  usePagination: false
})

export default {
  name: 'viewPointDialog',
  mixins: [searchTableMixin],
  components: { TableList },
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      // 预加载数据
      // preparedData: {
      //   propTwoOptions: []
      // },
      apiModel: {
        list: this.$api.resource.listAdPlanSpaces
      },
    }
  },
  methods: {
    /**
     * 重置数据
     */
    afterClose() {
      this.searchData = initSearchData()
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     */
    open(processCompanyId) {
      if (this.visible) return
      if (!processCompanyId) return
      this.searchData.processCompanyId = processCompanyId
      this.handleSearch()
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      if (!this.visible) return
      this.visible = false
    }
  },
  created() {
    this.initSearchTableMixin({ initSearchData, initTableColumns, initTableSetting })
  },
}
</script>

<style lang="scss" scoped="scoped">

/deep/ .el-dialog__body {
  padding: 0;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

</style>
