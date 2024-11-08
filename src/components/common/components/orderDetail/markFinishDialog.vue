<!-- 订单详情-标记完成上画点位-弹框组件-->
<template>
  <div>
    <el-dialog
      width="90%"
      top="10vh"
      append-to-body
      show-close
      title="标记完成上画点位"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <div v-loading="loading" class="custom_dialog_body">
        <!-- 搜索条件 -->
        <div class="search_bar">
          <div class="search_item">
            <span class="item_title">城市区域：</span>
            <el-cascader
              v-model="searchData.citySelectedList"
              placeholder="请选择"
              size="small"
              filterable
              clearable
              class="item_content"
              :options="preparedData.cityOptions"
              @change="handleChangeCity"
            >
            </el-cascader>
          </div>

          <div class="search_item">
            <span class="item_title">资源名称：</span>
            <el-select
              v-model="searchData.resIds"
              placeholder="请选择"
              filterable
              clearable
              multiple
              collapse-tags
              size="small"
              class="item_content"
            >
              <el-option
                v-for="item in preparedData.resourceOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </div>

          <div class="search_item">
            <span class="item_title">投放排期：</span>
            <el-select
              v-model="searchData.scheduleSelectedList"
              placeholder="请选择"
              filterable
              clearable
              multiple
              collapse-tags
              size="small"
              class="item_content"
            >
              <el-option
                v-for="item in scheduleOptions"
                :key="item.value"
                :value="item.value"
                :label="item.text"
              />
            </el-select>
          </div>

          <div class="search_item">
            <span class="item_title">媒体名称：</span>
            <el-input
              v-model="searchData.mTitle"
              placeholder="请输入"
              clearable
              maxlength="30"
              size="small"
              class="item_content"
            ></el-input>
          </div>

          <div class="search_item">
            <span class="item_title">媒体位ID：</span>
            <el-input
              v-model="searchData.assetTag"
              placeholder="请输入"
              clearable
              maxlength="30"
              size="small"
              class="item_content"
            ></el-input>
          </div>
        </div>

        <div class="search_control">
          <div class="part_left">
            <el-button type="primary" size="small" @click="importSelection">导入选中</el-button>
            <el-button type="primary" size="small" @click="importCancelSelection">导入取消选中</el-button>
          </div>
          <el-button-group style="margin-right: 8px">
            <el-button plain size="small" @click="handleReset">重置</el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleSearch"
            >
              搜索
            </el-button>
          </el-button-group>
        </div>

        <TextAlert showIcon class="alert_box">
          <span>全部点位共 <span class="blue_text">{{ pagination.total }}</span> 个，当前选择的点位 <span class="blue_text">{{ selectedList.length }}</span> 个</span>
        </TextAlert>

        <!-- 列表 -->
        <div class="table_wrapper">
          <el-table
            ref="tableRef"
            v-loading="tableLoading"
            height="500px"
            row-key="lId"
            style="width: 100%"
            element-loading-text="玩命加载中.."
            element-loading-spinner="el-icon-loading"
            highlight-current-row
            tooltip-effect="dark"
            :data="tableList"
          >

            <el-table-column width="55" key="selection" fixed="left">
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="isCheckAllCurrentPage" @change="handleSelectAll"></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.selected" @change="val => handleSelect(val, scope.row)"></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column
              label="资源"
              prop="resName"
              min-width="120"
              fixed="left"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              label="媒体"
              prop="mTitle"
              min-width="120"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              label="媒体位ID"
              prop="assetTag"
              min-width="160"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              label="投放面"
              prop="asLab"
              min-width="100"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column
              label="城市"
              prop="cityName"
              min-width="100"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column label="区域" prop="districtName" min-width="100" show-overflow-tooltip></el-table-column>

            <el-table-column label="排期" min-width="220" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.lStar || '--' }} 至 {{ scope.row.lEnd || '--' }}
              </template>
            </el-table-column>

            <el-table-column label="状态" width="100" fixed="right">
              <template slot-scope="scope">
                <PointState :state-text="scope.row.markStatusLabel" :color="scope.row.markStatusColor" class="status_box"/>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination_wrapper">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="pagination.sizes"
            :current-page.sync="pagination.pageNum"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @current-change="changePage"
            @size-change="changeSize"
          >
          </el-pagination>
        </div>
      </div>
      <div class="custom_dialog_footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-popconfirm title="确定要保存当前勾选的结果吗？" @confirm="handleConfirm">
          <el-button slot="reference" type="primary" size="small" style="margin-left: 12px">
            确 定
          </el-button>
        </el-popconfirm>
      </div>
    </el-dialog>

    <!-- 订单详情-导入选中/导入取消选中-弹框组件 -->
    <ImportSelectionDialog ref="importSelectionDialogRef" :isImportCancel="isImportCancel" @submitSuccess="handleImportSelection" />
  </div>

</template>

<script>
import { Message } from "element-ui";
import PointState from '@/components/common/components/pointState.vue'
import TextAlert from "@/components/common/components/TextAlert/index.vue"
import { getLabel, getTagList } from '@/utils/common'
import ImportSelectionDialog from './importSelectionDialog.vue'

const initSearchData = () => ({
  // 方案id
  apId: null,
  // 媒体位ID
  assetTags: [],
  assetTag: '',
  // 资源名称
  resIds: [],
  // 媒体名称
  mTitles: [],
  mTitle: '',
  times: [],
  // 排期开始时间
  // lStar: null,
  // 排期结束时间
  // lEnd: null,
  citySelectedList: [],
  scheduleSelectedList: [],
})

export default {
  name: 'markFinishDialog',
  components: {
    PointState,
    TextAlert,
    ImportSelectionDialog
  },
  props: {
    // 当前计划排期区间列表
    scheduleOptions: {
      type: Array,
      default: () => []
    },
    // 是否是换画
    isChangePic: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submitSuccess', 'afterClose'],
  data () {
    return {
      loading: false,
      visible: false,
      // 搜索绑定数据
      searchData: initSearchData(),
      // 真正的搜索条件
      searchCondition: {},
      tableLoading: false,
      tableList: [],
      // 勾选的数据
      selectedList: [],
      pagination: {
        // 当前页码
        pageNum: 1,
        // 每页条数
        pageSize: 10,
        // 总条数
        total: 0,
        // 每页条数选项
        sizes: [10, 20, 50],
      },
      preparedData: {
        cityOptions: [],
        resourceOptions: [],
        mTitleOptions: [],
        assetTagOptions: [],
      },
      // 是否勾选全部媒体
      isCheckAll: false,
      isCheckAllCurrentPage: false,
      tabList: [
        { label: '全部', value: '0' },
        { label: '已勾选', value: '1' },
        { label: '未勾选', value: '2' },
      ],
      statusOptions: [
        { label: '已标记', value: 1, color: '#87d068' },
        { label: '未标记', value: 0, color: '#D8D8D8' },
      ],
      isImportCancel: false
    };
  },
  mounted () {},
  methods: {
    /**
     * 导入选中结果
     */
    handleImportSelection(lIds) {
      // 取消选中
      if (this.isImportCancel) {
        this.selectedList = this.selectedList.filter(item => !lIds.includes(item))
      } else {
        this.selectedList = Array.from(new Set([...lIds, ...this.selectedList]))
      }
      // 回显列表
      this.tableList.forEach(item => {
        item.selected = this.selectedList.includes(item.lId)
      })
      this.testCheckAll()
    },

    /**
     * 导入选中
     */
    importSelection () {
      this.isImportCancel = false
      const { apId } = this.searchData
      this.$refs.importSelectionDialogRef && this.$refs.importSelectionDialogRef.open(apId)
    },

    /**
     * 导入取消选中
     */
    importCancelSelection () {
      this.isImportCancel = true
      const { apId } = this.searchData
      this.$refs.importSelectionDialogRef && this.$refs.importSelectionDialogRef.open(apId)
    },

    handleChangeCity() {
      console.log('handleChangeCity ===', this.searchData.citySelectedList)
      this.searchData.resIds = []
      this.getResourceOptions()
    },

    async getResourceOptions() {
      try {
        // this.loading = true
        const [ cityId = '', districtId = '' ] = this.searchData.citySelectedList || []
        const res = await this.$request.getApi(this.apiVar.replace + '/plan/resInfo', {
          apId: this.searchData.apId,
          cityId,
          districtId
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.preparedData.resourceOptions = (data || []).map(item => {
          return {
            ...item,
            label: item.resName,
            value: item.resID,
          }
        })
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getResourceOptions error:', err)
      } finally {
        // this.loading = false
      }
    },

    async getCityOptions() {
      try {
        // this.loading = true
        const res = await this.$request.getApi(this.apiVar.replace + "/plan/region", {
          apId: this.searchData.apId
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.preparedData.cityOptions = (data || []).map(item => {
          return {
            label: item.cityName,
            value: item.cityId,
            children: item.districtDtoList.map(cell => {
              return {
                ...cell,
                label: cell.districtName,
                value: cell.districtId
              }
            })
          }
        })
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getCityOptions error:', err)
      } finally {
        // this.loading = false
      }
    },

    /**
     * 获取媒体的数据
     *
     * type:  1媒体位id/ 2媒体名称/ 3位置朝向/ 4设备型号
     */
    async getPlanDetails(type, mid = '') {
      try {
        // this.loading = true
        let params = {
          apID: this.searchData.apId
        }
        // 是否是换画
        if (this.isChangePic) {
          params.replaceRecordId = mid
        } else {
          params.mediaTypeId = mid
        }
        const res = await this.$request.postApi_json('/addsp/api/v2/adPlan/getPlanDetailItem', {
          ...params,
          type
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        switch (type) {
          case 1:
            this.preparedData.assetTagOptions = data || []
            break
          case 2:
            this.preparedData.mTitleOptions = data || []
            break
        }
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getPlanDetails error:', err)
      } finally {
        // this.loading = false
      }
    },

    /**
     * 获取上次保存的标记列表
     */
    async getLastMarkList() {
      try {
        this.loading = true
        const res = await this.$api.adLaunch.listMarkSkIds({
          apId: this.searchData.apId
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.selectedList = data || []
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getCityOptions error:', err)
      } finally {
        this.loading = false
      }
    },

    async handleConfirm() {
      if (this.tableLoading || this.loading) return
      try {
        this.loading = true
        console.log('handleConfirm ===', this.selectedList)
        const res = await this.$api.adLaunch.markSk({
          apId: this.searchData.apId,
          lIds: this.selectedList
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.$emit('submitSuccess')
        this.close()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('handleConfirm error:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取列表数据
     */
    async getTableList() {
      try {
        this.tableLoading = true
        const { pageNum, pageSize } = this.pagination
        const { assetTag, mTitle, citySelectedList, scheduleSelectedList } = this.searchCondition
        const [ city = null, district = null ] = citySelectedList || []
        console.log('scheduleSelectedList ===', scheduleSelectedList)
        const times = (scheduleSelectedList || []).map(item => {
          const [lStar, lEnd] = item.split('-')
          return { lStar, lEnd }
        })
        const res = await this.$api.adLaunch.listMarkSpaces({
          ...this.searchCondition,
          assetTags: assetTag ? [ assetTag ] : null,
          mTitles: mTitle ? [ mTitle ] : null,
          times,
          city,
          district,
          pageNum,
          pageSize
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return Message.error(message || '获取列表数据失败')
        const { list, total } = data
        this.tableList = list.map(item => {
          return {
            ...item,
            // 如果已选列表中有，则默认勾选
            selected: this.selectedList.includes(item.lId),
            markStatusLabel: getLabel(item.markStatus, this.statusOptions),
            markStatusColor: getLabel(item.markStatus, this.statusOptions, { labelKey: 'color' }),
          }
        })
        this.pagination.total = total
        this.testCheckAll()
      } catch (err) {
        Message.error(err || '获取列表数据失败')
        console.error('getTableList error:', err)
      } finally {
        this.tableLoading = false
      }
    },

    /**
     * 搜索
     */
    async handleSearch () {
      this.pagination.pageNum = 1
      const searchCondition = {}
      Object.keys(this.searchData).forEach((key) => {
        let val = this.searchData[key]
        if (val === '' || val === void 0) {
          val = null
        }
        searchCondition[key] = val
      })
      this.searchCondition = searchCondition
      await this.getTableList()
    },

    /**
     * 重置
     */
    handleReset () {
      this.searchData = {
        ...initSearchData(),
        apId: this.searchData.apId
      }
      this.handleSearch()
    },

    /**
     * 分页-切换页数
     */
    changePage (val) {
      this.pagination.pageNum = val
      this.getTableList()
    },

    /**
     * 分页-切换页大小
     */
    changeSize (val) {
      this.pagination.pageNum = 1
      this.pagination.pageSize = val
      this.getTableList()
    },

    /**
     * 检查是否全选了本页
     */
    testCheckAll() {
      this.isCheckAllCurrentPage =  this.tableList.filter(item => item.selected).length === this.tableList.length
    },

    /**
     * 勾选
     */
    handleSelect(isSelect, { lId }) {
      this.testCheckAll()
      const hasOne = this.selectedList.includes(lId)
      if (hasOne && !isSelect) {
        this.selectedList.splice(this.selectedList.indexOf(lId), 1)
      } else if (!hasOne && isSelect) {
        this.selectedList.push(lId)
      }
    },

    /**
     * 勾选全页
     */
    handleSelectAll(isSelect) {
      let lIds = []
      this.tableList.forEach(item => {
        item.selected = isSelect
        lIds.push(item.lId)
      })
      if (!lIds.length) return
      // 取消选中
      if (!isSelect) {
        this.selectedList = this.selectedList.filter(item => !lIds.includes(item))
      } else {
        this.selectedList = Array.from(new Set([...lIds, ...this.selectedList]))
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.searchData = initSearchData()
      this.tableList = []
      this.selectedList = []
      this.tableLoading = false
      this.isCheckAll = false
      this.isCheckAllCurrentPage = false
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    async open() {
      if (this.visible) return
      this.visible = true
      this.searchData.apId = sessionStorage.getItem("order_apid")
      this.getCityOptions()
      this.getResourceOptions()
      // 必须先拿到上一次标记的数据，再请求列表数据
      await this.getLastMarkList()
      this.handleSearch()
    },

    /**
     * 关闭弹框
     */
    close() {
      if (!this.visible) return
      this.visible = false
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog .el-dialog__body {
  padding: 0;
}

.custom_dialog_body {
  padding-bottom: 15px;
}

.table_wrapper >>> .el-table td .cell {
  padding: 2px 10px;
  height: auto;
  line-height: 28px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}

.search_control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.search_bar {
  display: flex;
  flex-wrap: wrap;
  // margin-bottom: 20px;
  .search_item {
    margin-bottom: 16px;
    width: 33%;
    display: inline-flex;
    align-items: center;
    padding-right: 24px;
    box-sizing: border-box;
    .item_title {
      margin-right: 14px;
      white-space: nowrap;
      width: 90px;
      text-align: right;
    }
    .item_content {
      flex: 1;
    }
  }
}

.alert_box {
  margin-bottom: 10px;
}

.blue_text {
  color: #1890FF;
  font-weight: 600;
}

</style>
