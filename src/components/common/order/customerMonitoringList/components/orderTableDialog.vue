<!-- 客户监播-订单管理列表 - 弹框组件-->
<template>
  <div>
    <el-dialog
      width="80%"
      top="10vh"
      append-to-body
      show-close
      title="订单管理"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <div class="custom_dialog_body">
        <!-- 搜索条件 -->
        <div class="search_bar">
          <div class="search_item">
            <span class="item_title">订单名称：</span>
            <el-input
              v-model="searchData.apName"
              placeholder="请输入"
              clearable
              maxlength="30"
              size="small"
              class="item_content"
            ></el-input>
          </div>

          <div class="search_item">
            <span class="item_title">状态：</span>
            <el-select
              v-model="searchData.status"
              placeholder="请选择"
              filterable
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </div>

          <div class="search_item">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="handleRefreshSearch"
            >
              搜索
            </el-button>
            <el-button plain @click="handleReset" size="small">重置</el-button>
          </div>

        </div>

        <div class="tab_wrapper">
          <el-tabs v-model="activeTabKey" @tab-click="handleClickTab">
            <el-tab-pane v-for="item in tabList" :key="item.value" :label="item.label" :name="item.value" ></el-tab-pane>
          </el-tabs>
        </div>

        <!-- 列表 -->
        <div class="table_wrapper">
          <el-table
            ref="tableRef"
            :data="tableList"
            v-loading="tableLoading"
            height="500px"
            row-key="apId"
            style="width: 100%"
            element-loading-text="玩命加载中.."
            element-loading-spinner="el-icon-loading"
            highlight-current-row
            tooltip-effect="dark"
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
              label="订单名称"
              prop="apName"
              min-width="120"
              fixed="left"
              show-overflow-tooltip
            >
            </el-table-column>

            <el-table-column type="expand">
              <template slot-scope="scope">
                <div v-for="(item, i) in scope.row.cityList" style="line-height: 32px" :key="i">
                  {{ item.city || '--' }}（{{ item.num || '--' }}面，{{ item.pdStar || '--' }}至{{ item.pdEnd || '--' }}）
                </div>
              </template>
            </el-table-column>

            <el-table-column label="投放城市（点位面数，排期）" prop="cityList" width="300">
              <template slot-scope="scope">
                <el-tooltip placement="top-start">
                  <template slot="content">
                    <div v-for="(item, i) in scope.row.cityList" style="line-height: 32px" :key="i">
                      {{ item.city || '--' }}（{{ item.num || '--' }}面，{{ item.pdStar || '--' }}至{{ item.pdEnd || '--' }}）
                    </div>
                  </template>
                  <div>
                    <div v-for="(item, i) in scope.row.cityList.slice(0, 1)" style="line-height: 32px" :key="i">
                      {{ item.city || '--' }}（{{ item.num || '--' }}面，{{ item.pdStar || '--' }}至{{ item.pdEnd || '--' }}）
                    </div>
                    <!-- <div v-for="(item, i) in scope.row.cityList" style="line-height: 32px" :key="i">
                      {{ item.city || '--' }}（{{ item.num || '--' }}面，{{ item.pdStar || '--' }}至{{ item.pdEnd || '--' }}）
                    </div> -->
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column label="投放总面数" prop="totalNum" min-width="100" show-overflow-tooltip></el-table-column>

            <el-table-column label="媒体类型" prop="mediaTypeNames"  min-width="220" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="tag_wraper">
                  <span
                    v-for="(item, i) in scope.row.mediaTypeNameList"
                    class="tag_box"
                    :key="i"
                  >
                    {{ item }}
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="状态" width="100" fixed="right">
              <template slot-scope="scope">
                <PointState :state-text="scope.row.statusLabel" :color="scope.row.statusColor" class="status_box"/>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="150" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="handleNotSysOrder(scope.row)">非系统订单管理</el-button>
              </template>
            </el-table-column>

          </el-table>
        </div>
      </div>
      <div class="custom_dialog_footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-popconfirm title="确定要保存当前勾选的订单吗？" @confirm="handleConfirm">
          <el-button slot="reference" type="primary" size="small" style="margin-left: 12px">
            确 定
          </el-button>
        </el-popconfirm>
      </div>
    </el-dialog>

    <!-- 新建非系统订单-弹框组件 -->
    <CreateNotSysOrderDialog ref="createNotSysOrderDialogRef" @submitSuccess="handleRefreshSearch"/>
  </div>

</template>

<script>
import { Message } from "element-ui";
import PointState from '@/components/common/components/pointState.vue'
import { getLabel, getTagList } from '@/utils/common'
import CreateNotSysOrderDialog from './createNotSysOrderDialog.vue'

const initSearchData = () => ({
  // 客户监播项目id
  itemId: null,
  // 订单名字
  apName: '',
  // 0.未选 1.已选 不填.查全部
  status: null,
})

export default {
  name: 'orderTableDialog',
  components: {
    PointState,
    CreateNotSysOrderDialog
  },
  props: {},
  emits: ['submitSuccess', 'afterClose'],
  data () {
    return {
      visible: false,
      // 搜索绑定数据
      searchData: initSearchData(),
      // 真正的搜索条件
      searchCondition: {},
      tableLoading: false,
      tableList: [],
      totalTableList: [],
      preparedData: {},
      // 是否勾选全部媒体
      isCheckAll: false,
      isCheckAllCurrentPage: false,
      tabList: [
        { label: '全部', value: '0' },
        { label: '已勾选', value: '1' },
        { label: '未勾选', value: '2' },
      ],
      activeTabKey: '0',
      statusOptions: [
        { label: '已添加', value: 1, color: '#87d068' },
        { label: '未添加', value: 0, color: '#D8D8D8' },
      ],
    };
  },
  mounted () {},
  methods: {

    handleNotSysOrder(row) {
      // 有非系统全国单：点击后跳转至当前非系统全国单详情
      if (row.nonSystemApId) {
        this.goNotSysOrderDetailPage(row.nonSystemApId)
      } else {
        // 无非系统全国单：点击后弹出新建弹框
        this.$refs.createNotSysOrderDialogRef && this.$refs.createNotSysOrderDialogRef.open(row.apId)
      }
    },

    /**
     * 跳转非系统订单详情
     */
    async goNotSysOrderDetailPage(nonSystemApId) {
      // 获取详情参数
      if (this.tableLoading) return
      try {
        this.tableLoading = true
        const res = await this.$api.nationalAdPlan.pageList({
          apId: nonSystemApId
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '操作失败')
        // this.close()
        let list = data.list || []
        if (!list.length) return this.$message.warning('未找到该订单')
        const { companyList, apID,  src: apSrc } = list[0]
        sessionStorage.setItem("change_point_country", "no")
        sessionStorage.setItem("order_citylist", JSON.stringify(companyList))
        sessionStorage.setItem("country_order_apid", apID)
        sessionStorage.setItem("order_apSrc", apSrc)
        this.$router.push("/sale/countryOrderDetail")
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('handleConfirm error:', err)
      } finally {
        this.tableLoading = false
      }
    },

    handleClickTab() {
      switch (this.activeTabKey) {
        case '0':
          this.tableList = this.totalTableList
          break
        case '1':
          this.tableList = this.totalTableList.filter(it => it.selected)
          break
        case '2':
          this.tableList = this.totalTableList.filter(it => !it.selected)
          break
      }
    },

    async handleConfirm() {
      // await this.$confirm(`确定要保存当前勾选的订单吗？`, "提示", { type: "warning" })
      if (this.tableLoading) return
      try {
        this.tableLoading = true
        const apIds = this.totalTableList
          .filter(it => it.selected)
          .map(it => it.apId)
        const res = await this.$api.detecting.updateRel({
          itemId: this.searchData.itemId,
          apIds
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
        this.tableLoading = false
      }
    },

    /**
     * 获取列表数据
     */
    async getTableList(isFetch = false) {
      this.activeTabKey = '0'
      try {
        this.tableLoading = true
        if (isFetch) {
          const res = await this.$api.detecting.listOrders({
            itemId: this.searchCondition.itemId
          })
          const { SysCode: code, MSG: message, data = [] } = res.data || {}
          if (code !== 200200) return Message.error(message || '获取列表数据失败')
          this.tableList = data.map(item => {
            return {
              ...item,
              selected: item.status === 1,
              statusLabel: getLabel(item.status, this.statusOptions),
              statusColor: getLabel(item.status, this.statusOptions, { labelKey: 'color' }),
              mediaTypeNameList: getTagList(item.mediaTypeNames, ',')
            }
          })
          this.totalTableList = this.tableList
        } else {
          // 前端筛选（因为保存时，需要传所有的勾选的id，所以必须把数据缓存起来）
          let list = []
          const { apName, status } = this.searchCondition
          if (apName) {
            list = this.totalTableList.filter(it => it.apName.includes(apName))
          } else {
            list = this.totalTableList
          }
          if (status || status === 0) {
            list = list.filter(it => it.status === status)
          }
          this.tableList = list
        }
        this.testCheckAll()
      } catch (err) {
        Message.error(err || '获取列表数据失败')
        console.error('getTableList error:', err)
      } finally {
        this.tableLoading = false
      }
    },

    async handleRefreshSearch() {
      await this.handleSearch(true)
      await this.handleSearch(false)
    },

    /**
     * 搜索
     */
    async handleSearch (isFetch) {
      const searchCondition = {}
      Object.keys(this.searchData).forEach((key) => {
        let val = this.searchData[key]
        if (val === '' || val === void 0) {
          val = null
        }
        searchCondition[key] = val
      })
      this.searchCondition = searchCondition
      await this.getTableList(isFetch)
    },

    /**
     * 重置
     */
    handleReset () {
      this.searchData = {
        ...initSearchData(),
        itemId: this.searchData.itemId
      }
      this.getTableList(true)
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
    handleSelect(isSelect, { mid: mId }) {
      this.testCheckAll()
    },

    /**
     * 勾选全页
     */
     handleSelectAll(isSelect) {
      this.tableList.forEach(item => {
        item.selected = isSelect
      })
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.searchData = initSearchData()
      this.tableList = []
      this.totalTableList = []
      this.tableLoading = false
      this.isCheckAll = false
      this.isCheckAllCurrentPage = false
      this.activeTabKey = '0'
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     * @param {*} recordId 此记录的Id，编辑才传
     */
    open(itemId) {
      if (!itemId) return
      if (this.visible) return
      this.visible = true
      this.searchData.itemId = itemId
      this.handleSearch(true)
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

.search_bar {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
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

.tab_wrapper {
  background: #fff;
  margin-bottom: 24px;
  padding: 0 24px;
  border: 1px solid #ebebeb;
  /deep/ .el-tabs__header {
    margin: 0;
    border-color: transparent;
  }
  /deep/ .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  /deep/ .el-tabs__item {
    height: 56px;
    line-height: 56px;
  }
}

.tag_wraper {
  display: flex;
  align-items: center;
  height: 100%;
  // flex-wrap: wrap;
  .tag_box {
    display: inline-block;
    white-space: nowrap;
    overflow: visible;
    height: 22px;
    line-height: 22px;
    text-align: center;
    padding: 0 8px;
    background: linear-gradient(0deg, #E6F7FF, #E6F7FF),linear-gradient(0deg, #91D5FF, #91D5FF);
    border: 1px solid #91D5FF ;
    font-size: 12px;
    color: #1890FF;
    border-radius: 4px;
    & + .tag_box {
      margin-left: 8px;
    }
  }
}

</style>
