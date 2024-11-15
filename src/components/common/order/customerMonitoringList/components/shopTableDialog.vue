<!-- 监播管理-门店信息管理-弹框组件-->
<template>
  <div>
    <el-dialog
      width="90%"
      top="8vh"
      append-to-body
      show-close
      title="门店信息管理"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <div v-loading="loading" class="custom_dialog_body">
        <!-- 搜索条件 -->
        <div class="search_bar">
          <div class="search_item">
            <span class="item_title">区域：</span>
            <el-cascader
              v-model="searchData.citySelectedList"
              placeholder="请选择"
              size="small"
              filterable
              clearable
              change-on-select
              class="item_content"
              :options="preparedData.cityOptions"
              :show-all-levels="false"
              @change="handleChangeCity"
            >
            </el-cascader>
          </div>

          <div class="search_item">
            <span class="item_title">门店名称：</span>
            <el-input
              v-model="searchData.shopName"
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
            <el-button type="primary" size="small" @click="openImportShopDialog">导入新增</el-button>
            <DownloadFileButton
              text="导出"
              type="primary"
              requestUrl="/addsp/api/v1/customer/detecting/exportShops"
              :requestParams="searchCondition"
              :isJoinTimeToFileName="false"
            />
            <el-button type="danger" size="small" @click="handleDeleteBatch">批量删除</el-button>
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

        <!-- 列表 -->
        <div class="table_wrapper">
          <el-table
            ref="tableRef"
            v-loading="tableLoading"
            height="500px"
            row-key="id"
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

            <el-table-column label="门店名称" prop="shopName" min-width="120" show-overflow-tooltip fixed="left"></el-table-column>

            <el-table-column label="省" prop="provRegionName" min-width="100" show-overflow-tooltip></el-table-column>

            <el-table-column label="市" prop="cityRegionName" min-width="100" show-overflow-tooltip></el-table-column>

            <el-table-column label="区" prop="districtRegionName" min-width="100" show-overflow-tooltip></el-table-column>

            <el-table-column label="详细地址" prop="address" min-width="200" show-overflow-tooltip></el-table-column>

            <el-table-column label="经度" prop="lng" min-width="100" show-overflow-tooltip></el-table-column>

            <el-table-column label="纬度" prop="lat" min-width="100" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" style="color: #F56C6C" @click="handleDelete(scope.row)">删除</el-button>
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
        <el-button @click="close" size="small">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 订单详情-导入选中/导入取消选中-弹框组件 -->
    <ImportShopDialog ref="importShopDialogRef" @submitSuccess="getTableList" />
  </div>

</template>

<script>
import { Message } from "element-ui";
import ImportShopDialog from './importShopDialog.vue'
import DownloadFileButton from "@/components/common/components/downloadFileButton.vue"
import areaData from "@/commonFun/areaPackage_new.js"

const initSearchData = () => ({
  itemId: null,
  provRegionId: null,
  cityRegionId: null,
  districtRegionId: null,
  shopIds: [],
  citySelectedList: [],
  shopName: '',
})

export default {
  name: 'shopTableDialog',
  components: {
    ImportShopDialog,
    DownloadFileButton
  },
  props: {},
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
      selectedIds: [],
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
        cityOptions: []
      },
      // 是否勾选全部媒体
      isCheckAll: false,
      isCheckAllCurrentPage: false,
    };
  },
  mounted () {},
  methods: {
    getCityOptions() {
      this.preparedData.cityOptions = Object.freeze(areaData.cityArea())
    },

    handleChangeCity(val) {
      // console.log('handleChangeCity val ===', val)
      // 城市下拉改变时，省份不选中
      // if (Array.isArray(val) && val.length == 1) {
      //   this.searchData.citySelectedList = []
      // }
    },

    /**
     * 单个删除
     */
    async handleDelete(row) {
      await this.$confirm(`确定删除${row.provRegionName}-${row.cityRegionName}-${row.districtRegionName}-${row.address}的【${row.shopName}】门店数据吗？`, "提示", { type: "warning" })
      this.deleteShops([ row.id ])
    },

    /**
     * 批量删除
     */
    async handleDeleteBatch() {
      if (!this.selectedIds.length) return Message.warning('请先勾选要删除的门店')
      try {
        await this.$confirm(`确定删除选中的${this.selectedIds.length}条门店数据吗？`, "提示", { type: "warning" })
        await this.deleteShops(this.selectedIds, true)
      } catch (err) {
        console.error('handleDeleteBatch error:', err)
      }
    },

    async deleteShops(shopIds = [], isBatch = false) {
      if (!shopIds.length) return
      try {
        this.tableLoading = true
        const res = await this.$api.detecting.deleteShops({
          itemId: this.searchData.itemId,
          shopIds,
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return Message.error(message || '操作失败')
        Message.success('删除成功')
        if (isBatch) this.selectedIds = []
        this.getTableList()
      } catch (err) {
        Message.error(err || '操作失败')
        console.error('deleteShops error:', err)
      } finally {
        this.tableLoading = false
      }
    },

    /**
     * 导入
     */
    openImportShopDialog () {
      const { itemId } = this.searchData
      this.$refs.importShopDialogRef && this.$refs.importShopDialogRef.open(itemId)
    },

    /**
     * 获取列表数据
     */
    async getTableList() {
      try {
        this.tableLoading = true
        const { pageNum, pageSize } = this.pagination
        const res = await this.$api.detecting.pageShops({
          ...this.searchCondition,
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
            selected: this.selectedIds.includes(item.id),
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
      let searchCondition = {}
      Object.keys(this.searchData).forEach((key) => {
        let val = this.searchData[key]
        if (val === '' || val === void 0) {
          val = null
        }
        searchCondition[key] = val
      })
      // 特殊参数处理
      const { citySelectedList } = searchCondition
      const [provRegionId = null, cityRegionId = null, districtRegionId = null] = citySelectedList || []
      searchCondition = {
        ...searchCondition,
        provRegionId,
        cityRegionId,
        districtRegionId,
      }
      this.searchCondition = searchCondition
      await this.getTableList()
    },

    /**
     * 重置
     */
    handleReset () {
      this.searchData = {
        ...initSearchData(),
        itemId: this.searchData.itemId
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
    handleSelect(isSelect, { id }) {
      this.testCheckAll()
      const hasOne = this.selectedIds.includes(id)
      if (hasOne && !isSelect) {
        this.selectedIds.splice(this.selectedIds.indexOf(id), 1)
      } else if (!hasOne && isSelect) {
        this.selectedIds.push(id)
      }
    },

    /**
     * 勾选全页
     */
    handleSelectAll(isSelect) {
      let ids = []
      this.tableList.forEach(item => {
        item.selected = isSelect
        ids.push(item.id)
      })
      if (!ids.length) return
      // 取消选中
      if (!isSelect) {
        this.selectedIds = this.selectedIds.filter(item => !ids.includes(item))
      } else {
        this.selectedIds = Array.from(new Set([...ids, ...this.selectedIds]))
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.searchData = initSearchData()
      this.tableList = []
      this.selectedIds = []
      this.tableLoading = false
      this.isCheckAll = false
      this.isCheckAllCurrentPage = false
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    async open(itemId) {
      if (!itemId) return
      if (this.visible) return
      this.visible = true
      this.searchData.itemId = itemId
      this.handleSearch()
      this.getCityOptions()
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
