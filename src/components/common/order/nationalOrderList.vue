<template>
  <!-- 全国单 -->
  <div class="page_container">
    <div class="page_navigation">
      <p class="clearfix">
        <!-- <a href="#">媒体管理</a><em> / </em><a href="#">媒体维护</a> -->
        <a href="#">全国单管理</a>
      </p>
    </div>

    <div v-loading="pageLoading" class="page_content">
      <!-- 页面顶部 -->
      <div class="page_content_top">
        <div class="page_title">全国单管理列表</div>
        <!-- 列表搜索栏 -->
        <div class="search_bar">
          <TableSearch
            :value="searchData"
            :fileds="searchFileds"
            @search="handleSearch"
            @reset="handleReset"
          >
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
                <!--
                  @click.native="onChangeStatus(item.value)"
                 -->
                <el-radio-group v-model="searchData.status" size="small" @input="onChangeStatus">
                  <el-radio-button
                    v-for="item in preparedData.statusOptions"
                    :key="item.value"
                    :label="item.value"
                    :disabled="tableLoading"
                  >
                    <span>{{ item.label }}</span>
                  </el-radio-button>
                </el-radio-group>
                <!-- <el-button type="plain" size="small" @click="goDetailPage">新建项目</el-button> -->
              </div>
            </template>

            <!-- 自定义状态列 -->
            <template slot="status" slot-scope="slotProps">
              <PointState :state-text="slotProps.row.statusText" :color="slotProps.row.statusColor"/>
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

    <!-- 全国单-创建计划-弹窗 -->
    <!-- <NationalOrderFormDialog ref="nationalOrderFormDialogRef"/> -->

  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import searchTableMixin from '@/mixins/searchTableMixin'
import PointState from '@/components/common/components/pointState.vue';
import TableList from "@/components/common/components/TableList/index.vue";
import TableAction from "@/components/common/components/TableAction/index.vue";
import TableSearch from "@/components/common/components/TableSearch/index.vue";
// import NationalOrderFormDialog from './components/nationalOrderFormDialog.vue';
/**
 * 初始化搜索绑定数据
 */
const initSearchData = () => ({
  name: '',
  customerCompanyName: '',
  customerBrandName: '',
  applyBy: '',
  applyCompanyName: '',
  // 状态:0.待确认 1.对接中,2.投放中,3.已终止,4.已完成
  status: 0
})
/**
 * 初始化搜索配置
 */
const initSearchFileds = () => ({
  name: {
    title: '项目名称',
    type: 'input',
    props: {
      placeholder: '请输入',
      maxlength: 100
    },
  },
  customerCompanyName: {
    title: '客户公司',
    type: 'input',
    props: {
      placeholder: '请输入',
      maxlength: 100
    },
  },
  customerBrandName: {
    title: '客户品牌',
    type: 'input',
    props: {
      placeholder: '请输入',
      maxlength: 100
    },
  },
  applyBy: {
    title: '下单销售',
    type: 'input',
    props: {
      placeholder: '请输入',
      maxlength: 100
    },
  },
  applyCompanyName: {
    title: '下单公司',
    type: 'input',
    props: {
      placeholder: '请输入',
      maxlength: 100
    },
  },
})
/**
 * 初始化列表字段配置
 */
const initTableColumns = () => ([
  { title: '序号', type: 'index' },
  {
    title: '项目名称',
    dataIndex: 'name',
  },
  {
    title: '客户公司',
    dataIndex: 'customerCompanyName',
  },
  {
    title: '客户品牌',
    dataIndex: 'customerBrandName',
  },
  {
    title: '下单公司',
    dataIndex: 'applyCompanyName',
  },
  {
    title: '投放日期',
    dataIndex: 'startTime',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slot: 'status',
  },
  {
    title: '操作',
    key: 'action',
    slot: 'action',
    fixed: 'right',
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
  name: "nationalOrderList",
  mixins: [searchTableMixin],
  components: {
    PointState,
    TableList,
    TableAction,
    TableSearch,
    // NationalOrderFormDialog
  },
  data () {
    return {
      pageLoading: false,
      // 登录信息
      sessionData: {},
      // 预加载数据
      preparedData: {
        statusOptions: [
          { label: '待确认', value: 0, color: '#108ee9' },
          { label: '对接中', value: 1, color: '#108ee9' },
          { label: '投放中', value: 2, color: '#2db7f5'  },
          { label: '已完成', value: 4, color: '#52C41A'  },
          { label: '已终止', value: 3, color: '#D8D8D8'  },
        ]
      },
      apiModel: {
        list: this.$api.resource.getPage
      },
    };
  },
  methods: {
    /**
     * 处理列表接口返回的数据
     */
     handleTableListResponse(res) {
      console.log('handleTableListResponse res===', res)
      const { SysCode: code, MSG: message, data } = res.data || {}
      if (code !== 200200) throw new Error(message || '获取列表数据失败')
      const { list = [], total } = data
      const newList = list.map(item => {
        // 处理状态
        const { label: statusText, color: statusColor } = this.preparedData.statusOptions.find(option => option.value === item.status) || {}
        return {
          ...item,
          statusText,
          statusColor
        }
      })
      return { list: newList, total }
    },
    /**
     * 切换状态
     */
    onChangeStatus(val) {
      console.log('onChangeStatus ===', val)
      this.handleSearch()
    },
    /**
     * 新建
     */
    // handleCreate () {
    //   // this.$refs.nationalOrderFormDialogRef && this.$refs.nationalOrderFormDialogRef.open();
    //   this.goDetailPage()
    // },
    /**
     * 跳转详情页
     */
    goDetailPage (id) {
      this.$router.push({
        path: '/media/nationalOrderDetail',
        query: { id }
      })
    },
    /**
     * 列表操作按钮组
     */
     getActionList(row) {
      return [
        {
          text: '详情',
          single: true,
          // visible: row.typeName == '巡点',
          onClick: () => this.goDetailPage(row.id)
        },
      ]
    },

  },
  created() {
    this.sessionData = sessFun.getSess()
    this.initSearchTableMixin({ initSearchData, initSearchFileds, initPagination, initTableColumns })
    this.handleSearch()
  },
};
</script>

<style scoped lang="scss">
.search_bar {
  padding: 24px 24px 8px;
}
</style>
