<!-- 客户监播-列表 -->
<template>
  <div class="page_container">
    <div class="page_navigation">
      <p class="clearfix">
        <!-- <a href="#">媒体管理</a><em> / </em><a href="#">媒体维护</a> -->
        <a href="#">客户监播管理</a>
      </p>
    </div>

    <div v-loading="pageLoading" class="page_content">
      <!-- 页面顶部 -->
      <div class="page_content_top">
        <div class="page_title">客户监播管理</div>
        <!-- 列表搜索栏 -->
        <div class="search_bar">
          <TableSearch
            :value="searchData"
            :fileds="searchFileds"
            @search="handleSearch"
            @reset="handleReset"
          >
            <!-- 所属公司 -->
            <template slot="cId">
              <el-select
                v-model="searchData.cId"
                placeholder="请选择"
                filterable
                clearable
                style="width: 100%"
                size="small"
                @change="handleChangeCId"
              >
                <el-option
                  v-for="item in preparedData.customerCompanyOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </template>

             <!-- 所属品牌 -->
             <template slot="bId">
              <el-select
                v-model="searchData.bId"
                placeholder="请选择"
                filterable
                clearable
                style="width: 100%"
                size="small"
                :disabled="!searchData.cId"
              >
                <el-option
                  v-for="item in preparedData.customerBrandOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </template>

          </TableSearch>
        </div>
      </div>
      <div class="table_content_box">
        <!-- 表格 -->
        <div class="table_wrapper">
          <TableList
            :columns="tableColumns"
            :dataSource="tableList"
            :loading="tableLoading"
            @refreshTable="getTableList"
          >

            <!-- 顶部按钮栏 -->
            <template slot="tableTool">
              <div style="display: flex; justify-content: space-between">
                <span>列表</span>
                <div>
                  <el-button type="primary" icon="el-icon-plus" size="small" @click="handleCreate">新建监播</el-button>
                </div>
              </div>
            </template>

            <!-- 订单数 -->
            <template slot="orderNum" slot-scope="slotProps">
              <el-link type="primary" :underline="false" @click="openOrderTableDialog(slotProps.row)">{{ slotProps.row.orderNum }}</el-link>
            </template>

            <!-- 是否开启自动添加 -->
            <template slot="autoAddStatus" slot-scope="slotProps">
              <PointState :state-text="slotProps.row.autoAddStatusLabel" :color="slotProps.row.autoAddStatusColor" class="status_box"/>
            </template>

            <!-- 是否开启分享 -->
            <template slot="status" slot-scope="slotProps">
              <PointState :state-text="slotProps.row.statusLabel" :color="slotProps.row.statusColor" class="status_box"/>
            </template>

            <!-- 操作列 -->
            <template slot="action" slot-scope="slotProps">
              <TableAction :actionList="getActionList(slotProps.row)" />
            </template>

          </TableList>
        </div>
        <div class="pagination_wrapper">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="pagination.sizes"
            :current-page.sync="pagination.page"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @current-change="pageChange"
            @size-change="pageSizeChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 新建客户监播-弹窗 -->
    <MonitoringFormDialog
      ref="monitoringFormDialogRef"
      :customerCompanyList="customerCompanyList"
      :statusOptions="preparedData.statusOptions"
      @submitSuccess="getTableList"
    />

    <!-- 订单管理列表-弹窗 -->
    <OrderTableDialog ref="orderTableDialogRef" />

    <!-- 分享设置-弹窗 -->
    <ShareConfigDialog ref="shareConfigDialogRef" />

  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js"
import searchTableMixin from '@/mixins/searchTableMixin'
import TableList from "@/components/common/components/TableList/index.vue"
import TableAction from "@/components/common/components/TableAction/index.vue"
import TableSearch from "@/components/common/components/TableSearch/index.vue"
import MonitoringFormDialog from './components/monitoringFormDialog.vue'
import OrderTableDialog from './components/orderTableDialog.vue'
import ShareConfigDialog from './components/shareConfigDialog.vue'
import PointState from '@/components/common/components/pointState.vue'
import { getLabel } from '@/utils/common'

/**
 * 初始化搜索绑定数据
 */
const initSearchData = () => ({
  title: '',
  cId: '',
  bId: '',
})
/**
 * 初始化搜索配置
 */
const initSearchFileds = () => ({
  name: {
    title: '标题',
    type: 'input',
    props: {
      placeholder: '请输入',
      maxlength: 100
    },
  },
  cId: {
    title: '所属公司',
    slotContent: 'cId'
  },
  bId: {
    title: '所属品牌',
    slotContent: 'bId'
  },
})
/**
 * 初始化列表字段配置
 */
const initTableColumns = () => ([
  { title: '序号', type: 'index', width: 70 },
  {
    title: '标题',
    dataIndex: 'title',
    minWidth: 160,
  },
  {
    title: '所属客户公司',
    dataIndex: 'companyName',
    minWidth: 160,
  },
  {
    title: '所属客户品牌',
    dataIndex: 'brandName',
    minWidth: 160,
  },
  {
    title: '订单数',
    dataIndex: 'orderNum',
    minWidth: 100,
    slot: 'orderNum',
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    minWidth: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    minWidth: 160,
  },
  {
    title: '是否开启自动添加',
    dataIndex: 'autoAddStatus',
    minWidth: 140,
    slot: 'autoAddStatus',
  },
  {
    title: '是否开启分享',
    dataIndex: 'status',
    minWidth: 120,
    fixed: 'right',
    slot: 'status',
  },
  {
    title: '操作',
    key: 'action',
    slot: 'action',
    fixed: 'right',
    width: 140,
  }
])
/**
 * 初始化列表分页数据
 */
 const initPagination = () => ({
  // 请求的时候，分页字段名配置
  keyConfig: {
    page: 'pageNum',
    pageSize: 'pageSize'
  }
})

export default {
  name: "customerMonitoringList",
  mixins: [searchTableMixin],
  components: {
    TableList,
    TableAction,
    TableSearch,
    PointState,
    MonitoringFormDialog,
    OrderTableDialog,
    ShareConfigDialog
  },
  data () {
    return {
      pageLoading: false,
      // 登录信息
      sessionData: {},
      // 预加载数据
      preparedData: {
        customerCompanyOptions: [],
        customerBrandOptions: [],
        statusOptions: [
          { label: '开启', value: 1, color: '#87d068' },
          { label: '关闭', value: 0, color: '#D8D8D8' },
        ],
      },
      apiModel: {
        list: this.$api.detecting.getPage
      },
      customerCompanyList: []
    };
  },
  methods: {
    /**
     * 获取销售crm的客户列表下拉数据
     */
    async getCustomerCompanySelectList() {
      try {
        const res = await this.$api.detecting.listCustomers()
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.customerCompanyList = Object.freeze(data || [])
        this.preparedData.customerCompanyOptions = this.customerCompanyList.map(item => {
          return {
            label: item.cName,
            value: item.cId
          }
        })
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getCustomerCompanySelectList error:', err)
      }
    },

    handleChangeCId() {
      this.searchData.bId = null
      const current = this.customerCompanyList.find(it => it.cId === this.searchData.cId)
      if (!current) return
      this.preparedData.customerBrandOptions = (current.brandList || []).map(it => {
        return {
          label: it.bTitle,
          value: it.bId
        }
      })
    },

    /**
     * 处理列表接口返回的数据
     */
     handleTableListResponse(res) {
      const { SysCode: code, MSG: message, data } = res.data || {}
      if (code !== 200200) throw new Error(message || '获取列表数据失败')
      const { list = [], total } = data
      const newList = list.map(item => {
        return {
          ...item,
          statusLabel: getLabel(item.status, this.preparedData.statusOptions),
          statusColor: getLabel(item.status, this.preparedData.statusOptions, { labelKey: 'color' }),
          autoAddStatusLabel: getLabel(item.autoAddStatus, this.preparedData.statusOptions),
          autoAddStatusColor: getLabel(item.autoAddStatus, this.preparedData.statusOptions, { labelKey: 'color' })
        }
      })
      return { list: newList, total }
    },

    /**
     * 新建
     */
    handleCreate () {
      this.$refs.monitoringFormDialogRef && this.$refs.monitoringFormDialogRef.open()
    },

    /**
     * 跳转详情页
     */
    goDetailPage (id) {
      this.$router.push({
        path: '/media/nationalOrderDetail',
        query: { id }
      })
    },

    openOrderTableDialog (row) {
      this.$refs.orderTableDialogRef && this.$refs.orderTableDialogRef.open(row.id)
    },

    /**
     * 列表操作按钮组
     */
     getActionList(row) {
      return [
        {
          text: '编辑',
          single: true,
          onClick: () => {
            this.$refs.monitoringFormDialogRef && this.$refs.monitoringFormDialogRef.open(row)
          }
        },
        {
          text: '订单管理',
          onClick: () => {
            this.openOrderTableDialog(row)
          }
        },
        {
          text: '分享设置',
          onClick: () => {
            this.$refs.shareConfigDialogRef && this.$refs.shareConfigDialogRef.open(row.id)
          }
        },
        // {
        //   text: '开启分享',
        //   visible: !row.status,
        //   onClick: async () => {
        //     try {
        //       const confirmRes =  await this.$confirm('确认开启分享？', '提示')
        //       if (confirmRes !== 'confirm') return
        //     } catch (err) {
        //       return
        //     }
        //   }
        // },
        // {
        //   text: '关闭分享',
        //   visible: !!row.status,
        //   onClick: async () => {
        //     try {
        //       const confirmRes =  await this.$confirm('确认关闭分享？', '提示')
        //       if (confirmRes !== 'confirm') return
        //     } catch (err) {
        //       return
        //     }
        //   }
        // },
      ]
    },

  },
  created() {
    this.sessionData = sessFun.getSess()
    this.initSearchTableMixin({ initSearchData, initSearchFileds, initPagination, initTableColumns })
    this.handleSearch()
    this.getCustomerCompanySelectList()
  },
};
</script>

<style scoped lang="scss">
.search_bar {
  padding: 24px 24px 8px;
}
</style>

