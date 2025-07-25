<!-- 客户管理-列表 -->
<template>
  <div class="page_container">
    <div class="page_navigation">
      <p class="clearfix">
        <a href="#">客户管理</a>
      </p>
    </div>

    <div v-loading="pageLoading" class="page_content">
      <!-- 页面顶部 -->
      <div class="page_content_top">
        <div class="page_title" style="display: flex; align-items: center;">
          <span style="margin-right: auto">客户列表</span>
          <a class="nav-text" href="https://apps.qinlinad.com/crm.html" target="_blank">如何更高效化的管理您的客户？</a>
        </div>

        <!-- 列表搜索栏 -->
        <div class="search_bar">
          <TableSearch
            :value="searchData"
            :fileds="displaySearchFileds"
            @search="handleSearch"
            @reset="handleReset"
          >
            <template slot="keyword">
              <el-input v-model="searchData.keyword"  placeholder="请输入" size="small">
                  <el-select
                    v-model="searchData.select"
                    slot="prepend"
                    placeholder="请选择"
                    size="small"
                    style="width: 100px"
                  >
                      <el-option label="公司品牌" :value="1"></el-option>
                      <el-option label="公司名称" :value="2"></el-option>
                      <el-option label="联系人" :value="3"></el-option>
                  </el-select>
              </el-input>
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
            @sortChange="sortChange"
          >

            <!-- 顶部按钮栏 -->
            <template slot="tableTool">
              <div style="display: flex; justify-content: space-between">
                <span>列表</span>
                <div>
                  <el-button
                    v-if="showNewBtn"
                    type="primary"
                    icon="el-icon-plus"
                    size="small"
                    @click="handleCreate"
                  >
                    新建
                  </el-button>
                </div>
              </div>
            </template>

            <!-- 创建日期 -->
            <template slot="joinTime" slot-scope="slotProps">
              {{ formatTime(slotProps.row.joinTime) }}
            </template>

            <!-- 客户品牌 -->
            <template slot="brandName" slot-scope="slotProps">
              <div class="tag_wraper">
                <span
                  v-for="(item, i) in slotProps.row.brandNameList"
                  class="tag_box"
                  :key="i"
                >
                  {{ item }}
                </span>
              </div>
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
  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js"
import searchTableMixin from '@/mixins/searchTableMixin'
import TableList from "@/components/common/components/TableList/index.vue"
import TableAction from "@/components/common/components/TableAction/index.vue"
import TableSearch from "@/components/common/components/TableSearch/index.vue"
import PointState from '@/components/common/components/pointState.vue'
import { getLabel, getTagList, isEmpty, isNotEmpty } from '@/utils/common'
import dateFormat from "../../commonFun/timeFormat.js";
import filterFormat from "../../commonFun/filterTableData.js";

/**
 * 初始化搜索绑定数据
 */
const initSearchData = () => ({
  select: 1,
  keyword: '',
  dateRange: [],
  asrID: null,
  beginTime: '',
  endTime: '',
  orderby: '',
  desc: '',
  brandName: '',
  companyName: '',
  contactName: ''
})
/**
 * 初始化搜索配置
 */
const initSearchFileds = () => ({
  keyword: {
    slot: 'keyword',
  },
  dateRange: {
    title: '创建日期',
    type: 'date-picker',
    props: {
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      format: 'yyyy-MM-dd',
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期"
    }
  },
  asrID: {
    title: '选择公司',
    type: 'select',
    options: [],
    optionKey: {
      value: 'asrID',
      label: 'asName'
    },
    visible: false
  }
})
/**
 * 初始化列表字段配置
 */
const initTableColumns = () => ([
  { title: '序号', type: 'index', width: 70 },
  {
    title: '联系人',
    dataIndex: 'realName',
    minWidth: 120,
  },
  {
    title: '职位',
    dataIndex: 'position',
    minWidth: 120,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    minWidth: 120,
  },
  {
    title: '公司名称',
    dataIndex: 'cName',
    minWidth: 200,
  },
  {
    title: '所在城市',
    dataIndex: 'rName',
    minWidth: 120,
  },
  {
    title: '公司品牌',
    minWidth: 220,
    slot: 'brandName',
  },
  {
    title: '所有人',
    dataIndex: 'puName',
    minWidth: 120,
    props: {
      filters: [],
      filterMethod: (value, row) => row.puName.indexOf(value) !== -1,
      filterMultiple: true,
    }
  },
  {
    title: '创建日期',
    dataIndex: 'joinTime',
    minWidth: 160,
    slot: 'joinTime',
    props: {
      sortable: 'custom',
    }
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
    page: 'pageNo',
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
  },
  data () {
    return {
      pageLoading: false,
      // 登录信息
      sessionData: {},
      // 预加载数据
      preparedData: {
        // customerCompanyOptions: [],
      },
      apiModel: {
        list: this.$api.advertisement.getCustomer
      },
      showNewBtn: true,
      isPay: 0
    };
  },
  computed: {
    displaySearchFileds() {
      return Object.keys(this.searchFileds).reduce((pre, cur) => {
        if (this.searchFileds[cur].visible || !this.searchFileds[cur].hasOwnProperty('visible')) {
          pre[cur] = this.searchFileds[cur]
        }
        return pre
      }, {})
    }
  },
  methods: {
    /**
     * 时间格式化
     */
    formatTime(time) {
      return dateFormat.toDate(time, '/');
    },

    /**
     * 获取公司下拉数据
     */
    async getCompanyOptions() {
      try {
        const { token, uID: uid } = this.sessionData
        const res = await this.$api.UCAPI.getDirectAscr({ uid, token })
        // const { SysCode: code, MSG: message, data = [] } = res.data || {}
        // if (code !== 200200) return this.$message.error(message || '获取数据失败')
        if (typeof res.data === 'string') throw new Error(res.data || '获取公司下拉数据失败')
        this.searchFileds.asrID.options = res.data || []
      } catch (err) {
        this.$message.error(String(err) || '获取公司下拉数据失败')
        console.error('getCompanyOptions error:', err)
      }
    },

    /**
     * 查询是否开通数字化公司
     */
    async getIsPay() {
      try {
        const res = await this.$api.company.isPay({
          asrID: this.sessionData.asrID
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.isPay = data ? 1 : 0
        this.getRole()
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getIsPay error:', err)
      }
    },

    /**
     * 判断角色是否有新建按钮(销售有)
     */
    getRole() {
      if (!['ADN_BD_KA', 'ADN_BD'].includes(this.sessionData.uType)) {
        this.showNewBtn = false;
      }
      // 判断KA销售权限+数字化公司，隐藏新建功能和编辑功能
      if (['ADN_BD_KA'].includes(this.sessionData.uType) && this.isPay) {
        this.showNewBtn = false
      }
    },

    /**
     * 获取下级销售列表
     */
     async getSubSaleList() {
      try {
        const res = await this.$api.advertisement.getSubSaleList()
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.tableColumns.find(v => v.dataIndex === 'puName').props.filters = filterFormat(data, "realName",'uID')
      } catch (err) {
        this.$message.error(String(err) || '获取下级销售列表数据失败')
        console.error('getSubSaleList error:', err)
      }
    },

    /**
     * 处理列表接口请求的参数
     */
     handleTableListRequestParam(params) {
      const [beginTime = '', endTime = ''] = this.searchData.dateRange || []
      switch(this.searchData.select) {
        case 1:
          params.brandName = this.searchData.keyword
          break
        case 2:
          params.companyName = this.searchData.keyword
          break
        case 3:
          params.contactName = this.searchData.keyword
          break
      }
      return {
        ...params,
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        beginTime: beginTime ? beginTime + ' 00:00:00' : '',
        endTime: endTime ? endTime + ' 23:59:59' : '',
      }
    },

    /**
     * 处理列表接口返回的数据
     */
     handleTableListResponse(res) {
      // console.log('handleTableListResponse res ===', res);
      // const { SysCode: code, MSG: message, data } = res.data || {}
      if (typeof res.data === 'string') throw new Error(res.data || '获取列表数据失败')
      let newList = [], total = 0
      if (res.data) {
        total = res.data.page.total
        newList = res.data.page.list.map(item => {
          return {
            ...item,
            brandNameList: getTagList(item.cBrand, ',')
          }
        })
      }
      return { list: newList, total }
    },

    /**
     * 新建
     */
    handleCreate () {
      this.$router.push("./createClient")
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

    // 时间排序(请求后台接口进行排序)
    sortChange({ column, prop, order }){
      if (order === "ascending"){
        this.searchData.orderby = prop
        this.searchData.desc = 0
      } else if (order === "descending"){
        this.searchData.orderby = prop
        this.searchData.desc = 1
      }
      this.handleSearch();
    },

    /**
     * 列表操作按钮组
     */
     getActionList(row) {
      return [
        {
          text: '查看',
          single: true,
          onClick: () => {
            sessionStorage.setItem("customerId", row.uID)
            this.$router.push("./clientDetail")
          }
        },
        {
          text: '订单管理',
          onClick: () => {
            this.openOrderTableDialog(row)
          }
        },
      ]
    },

  },
  created() {
    this.sessionData = sessFun.getSess()
    this.initSearchTableMixin({ initSearchData, initSearchFileds, initPagination, initTableColumns })
    this.handleSearch()
    this.getIsPay()
    if (!['ADN_BD_KA', 'ADN_BD'].includes(this.sessionData.uType)) {
      this.searchFileds.asrID.visible = true
      this.getCompanyOptions()
    } else {
      this.getSubSaleList()
    }
  },
};
</script>

<style scoped lang="scss">
.search_bar {
  padding: 24px 24px 8px;
}

.nav-text{
  margin-right: 16px;
  font-size: 14px;
  color: #1890FF;
  line-height: 20px;
  font-weight: 400;
  cursor: pointer;
}

.tag_wraper {
  display: flex;
  align-items: center;
  justify-content: center;
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

