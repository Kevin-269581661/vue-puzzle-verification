<template>
  <div class="page_container">
    <div class="page_navigation">
      <p class="clearfix">
        <a href="#">媒体管理</a><em> / </em><a href="#">媒体维护</a>
      </p>
    </div>

    <div v-loading="pageLoading" class="page_content">
      <!-- 页面顶部 -->
      <div class="page_content_top">
        <div class="page_title">维护列表</div>
        <!-- 列表搜索栏 -->
        <div class="search_bar">
          <TableSearch
            :value="searchData"
            :fileds="searchFileds"
            @change="handleSeachChange"
            @search="handleSearch"
            @reset="handleReset"
          >
            <template slot="districtList">
              <el-cascader
                v-model="searchData.districtList"
                :options="searchFileds.districtList.options"
                clearable
                change-on-select
                size="small"
                placeholder="请选择"
                style="width: 100%"
              >
              </el-cascader>
            </template>

            <!-- 导出 -->
            <template slot="action">
              <DownloadFileButton
                :requestApi="$api.getApi_file"
                :requestParams="exportRequestParams"
                requestUrl="/mediaService/api/v2/exportRMList"
                downloadFileName="维护记录"
              />
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

            <!-- 自定义状态列 -->
            <template slot="statusDesc" slot-scope="slotProps">
              <PointState :state-text="slotProps.row.statusDesc" :color="statusColorObj[slotProps.row.statusDesc]"/>
            </template>

            <template slot="action" slot-scope="slotProps">
              <TableAction :actionList="getActionList(slotProps.row)" />
            </template>

          </TableList>
        </div>
        <!-- 分页器 -->
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

    <!-- 照片弹出框 -->
    <MaintainPicDialog ref="maintainPicDialogRef"/>

    <!--历史记录弹出框-->
    <MaintainHistoryDialog ref="maintainHistoryDialogRef" @refresh="getTableList"/>
  </div>
</template>

<script>
import { Message } from "element-ui";
import sessFun from "../../commonFun/sessFun.js";
import PointState from '@/components/common/components/pointState.vue';
import TableList from "@/components/common/components/TableList/index.vue";
import TableAction from "@/components/common/components/TableAction/index.vue";
import TableSearch from "@/components/common/components/TableSearch/index.vue";
import MaintainPicDialog from '@/components/common/components/maintainList/maintainPicDialog.vue'
import MaintainHistoryDialog from '@/components/common/components/maintainList/maintainHistoryDialog.vue'
import DownloadFileButton from "@/components/common/components/downloadFileButton.vue";
import { deserialize } from '@/utils/common'

/**
 * 初始化搜索绑定数据
 */
const initSearchData = () => ({
  resName: '',
  assetTag: '',
  type: '',
  status: '',
  userId: '',
  // 巡点日期
  dateList: [],
  startTime: '',
  endTime: '',
  // 所在区域
  districtList: [],
  cityId: '',
  districtId: '',
  // 通行情况
  trafficState: '',
  // 媒介情况
  mediumState: '',
  // 设备问题
  deviceProblem: '',
  // 问题反馈
  remark: '',
})
/**
 * 初始化搜索配置
 */
const initSearchFileds = () => ({
  resName: {
    title: '资源名称',
    type: 'input',
    props: {
      placeholder: '请输入',
    },
  },
  assetTag: {
    title: '资产编号',
    type: 'input',
    props: {
      placeholder: '请输入',
    },
  },
  districtList: {
    title: '所在区域',
    slotContent: 'districtList',
    options: []
  },
  type: {
    title: '维护类型',
    type: 'select',
    props: {
      placeholder: '请选择',
      filterable: true,
    },
    options: [
      { label: '巡点', value: 1 },
      // { label: '待维修', value: 2 },
      { label: '拆除', value: 3 },
      { label: '不可售卖', value: 4 },
      // { label: '维修', value: 5 },
    ]
  },
  status: {
    title: '维护状态',
    type: 'select',
    props: {
      placeholder: '请选择',
      filterable: true,
    },
    options: [
      { label: '未处理', value: 1 },
      { label: '已处理', value: 2 },
    ]
  },
  userId: {
    title: '提交者',
    type: 'select',
    props: {
      placeholder: '请选择',
      filterable: true,
    },
    options: []
  },
  dateList: {
    title: '巡点日期',
    type: 'date-picker',
    props: {
      type: 'daterange',
      rangeSeparator: '-',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期"
    },
  },
})

export default {
  name: "maintainList",
  components: {
    PointState,
    TableList,
    TableAction,
    TableSearch,
    MaintainPicDialog,
    MaintainHistoryDialog,
    DownloadFileButton
  },
  data () {
    return {
      pageLoading: false,
      // 登录信息
      sessionData: {},
      // 搜索栏字段配置
      searchFileds: initSearchFileds(),
      // 搜索栏字段绑定数据
      searchData: initSearchData(),
      // 真正的搜索条件
      searchCondition: {},
      // 表格字段配置
      tableColumns: [],
      // 表格加载状态
      tableLoading: false,
      // 表格数据
      tableList: [],
      pagination: {
        // 当前页码
        page: 1,
        // 每页条数
        pageSize: 10,
        // 总条数
        total: 0,
        // 每页条数选项
        sizes: [10, 20, 50],
      },
      // 预加载数据
      // preparedData: {},
      statusColorObj: {
        '已处理': 'rgba(82,196,26,1)',
        '未处理': 'rgba(250,173,20,1)',
      }
    };
  },
  computed: {
    exportRequestParams() {
      return {
        ...this.searchCondition,
        // get 请求，处理数组参数（无用的置空）
        dateList: null,
        districtList: null,
        isCustom: this.sessionData.customPermission && this.sessionData.customPermission.patrolPermission ? 1 : null
      }
    }
  },
  methods: {
    /**
     * 获取所在区域数据
     */
    async getDistrictOptions () {
      try {
        const { token, uID: uid } = this.sessionData
        const res = await this.$request.postApi_new(this.apiVar.Media, {
          token, uid,
          service: 'GetCompanyCitiesAction'
        }) || {}
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return Message.error(message || '获取所在区域数据失败')
        this.searchFileds['districtList'].options = data.map(item => {
          const { cityName: label, cityId: value, districtList: children } = item
          return {
            label,
            value,
            children: children.map(cell => ({
              label: cell.districtName,
              value: cell.districtId
            }))
          }
        })
      } catch (err) {
        Message.error(String(err) || '获取所在区域数据失败')
        console.error('getDistrictOptions error:', err)
      }
    },
    /**
     * 获取公司人员
     */
    async getUserOptions () {
      try {
        const { token, uID: uid } = this.sessionData
        const res = await this.$request.getApi(this.apiVar.UCAPI + '/GetSameCompanyUser', {
          token, uid
        }) || {}
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return Message.error(message || '获取公司人员数据失败')
        const list = data.map(item => ({
          label: item.realName,
          value: item.uID,
        }))
        this.searchFileds['userId'].options = list
      } catch (err) {
        Message.error(String(err) || '获取公司人员数据失败')
        console.error('getUserOptions error:', err)
      }
    },
    /**
     * 点击历史记录
     */
    showHistory (item) {
      this.$refs.maintainHistoryDialogRef && this.$refs.maintainHistoryDialogRef.open(item);
    },
    // 搜索数据格式化
    searchParamFormat() {
      const { token, uID: uid } = this.sessionData
      let params = {}
      Object.keys(this.searchData).forEach((key) => {
        let val = this.searchData[key]
        if (val === '' || val === void 0) {
          val = null
        }
        params[key] = val
      })
      // 处理日期
      if (params.dateList.length) {
        const [ startTime, endTime ] = params.dateList
        params.startTime = startTime
        params.endTime = endTime
      }
      // 处理地区
      if (params.districtList.length) {
        const [ cityId, districtId = null ] = params.districtList
        params.cityId = cityId
        params.districtId = districtId
      }
      params.uid = uid
      params.token = token
      // params.service = 'GetMediaMaintenanceListAction'
      this.searchCondition = params
    },
    /**
     * 获取列表数据
     */
    async getTableList() {
      try {
        const { token, uID: uid } = this.sessionData
        const { page: pageNum, pageSize } = this.pagination
        this.tableLoading = true
        const res = await this.$request.postApi_json('/addsp/patrolPoint/web/getList', {
          ...this.searchCondition,
          uid,
          token,
          pageNum,
          pageSize,
          // asrID: null,
          // mediaTypeIdList: null,
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return Message.error(message || '获取列表数据失败')
        const { values = [], pagerInfo } = data
        this.tableList = values.map((item) => {
          const data = {}
          item.forEach((cell) => {
            data[cell.fieldName] = deserialize(cell.value)
          })
          return data
        })
        this.pagination.total = pagerInfo.total
      } catch (err) {
        Message.error(err || '获取列表数据失败')
        console.error('getTableList error:', err)
      } finally {
        this.tableLoading = false
      }
    },
    /**
     * 打开照片弹框
     */
    openMaintainPicDialog({ picUrl }) {
      this.$refs.maintainPicDialogRef && this.$refs.maintainPicDialogRef.open(picUrl);
    },
    /**
     * 列表操作按钮组
     */
     getActionList(row) {
      return [
        {
          text: '照片',
          visible: row.typeName == '巡点',
          onClick: () => this.openMaintainPicDialog(row),
        },
        {
          text: '历史记录',
          onClick: () => this.showHistory(row),
        },
      ]
    },
    /**
     * 分页-页数改变
     */
    pageChange (val) {
      this.pagination.page = val
      this.getTableList();
    },
    /**
     * 分页-页大小改变
     */
    pageSizeChange (val) {
      this.pagination.page = 1
      this.pagination.pageSize = val
      this.getTableList();
    },
    /**
     * 搜索字段变化
     */
    handleSeachChange(filed) {
      // console.log('headerSeachChange ===', filed, this.searchData[filed])
    },
    /**
     * 列表搜索
     */
    handleSearch() {
      this.pagination.page = 1
      this.searchParamFormat();
      this.getTableList();
    },
    /**
     * 列表重置
     */
    handleReset() {
      this.searchData = initSearchData()
      this.handleSearch()
    },
    /**
     * 构造搜索配置项
     * type: labelSelect 单选, multiLabelSelect 多选
     */
    createSearchItemConfig({ type, title, fieldName, items = [] }) {
      let obj = {}
      switch (type) {
        // 下拉单选
        case 'labelSelect':
          obj = {
            title,
            type: 'select',
            props: {
              placeholder: '请选择',
              filterable: true,
            },
            options: items.map(({title}) => ({
              label: title,
              value: title,
            }))
          }
          break
        // 下拉多选
        case 'multiLabelSelect':
          obj = {
            title,
            type: 'select',
            props: {
              placeholder: '请选择',
              filterable: true,
              multiple: true,
              collapseTags: true,
            },
            options: items.map(({title}) => ({
              label: title,
              value: title,
            }))
          }
          break
        // 带有其他输入框的下拉
        case 'multiLabelInputSelect':
          obj = {
            title,
            type: 'input-select',
            props: {
              options: items.map(({title, type: optionType}) => ({
                label: title,
                value: title,
                isCustom: optionType === 'input'
              }))
            },
          }
          break
        // 输入框
        default:
        obj = {
          title,
          type: 'input',
          props: {
            placeholder: '请输入',
          },
        }
      }
      return obj
    },
    /**
     * 获取搜索字段默认值
     */
    getFiledDefaultValue({ type }) {
      let value = null;
      if (type === 'multiLabelSelect') value = []
      return value
    },
    /**
     * 获取列表字段和搜索字段配置
     */
    async getTableConfig() {
      try {
        this.pageLoading = true
        const res = await this.$request.getApi('/addsp/patrolPoint/web/getPageInfo') || {}
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return Message.error(message || '获取列表字段和搜索字段配置数据失败')
        const { searchList, headerList } = data
        // 处理搜索栏字段配置数据
        let searchFileds = {}
        let searchData = {}
        searchList.forEach(item => {
          searchFileds[item.fieldName] = this.createSearchItemConfig(item)
          searchData[item.fieldName] = this.getFiledDefaultValue(item)
        })
        this.searchFileds = Object.assign(initSearchFileds(), searchFileds)
        this.searchData = Object.assign(initSearchData(), searchData)
        // 处理列表字段配置数据
        const tableColumns = headerList.map(item => {
          const { title, fieldName: dataIndex, fixedFlag, labelStyleFlag: isTagStyle } = item
          // 状态列特殊处理
          if (dataIndex === 'statusDesc') {
            return {
              title,
              dataIndex,
              fixed: 'right',
              slot: 'statusDesc',
            }
          }
          return {
            title,
            dataIndex,
            isTagStyle,
            fixed: fixedFlag ? 'left' : null,
          }
        })
        tableColumns.unshift({ title: '序号', type: 'index' })
        tableColumns.push({
          title: '操作',
          key: 'action',
          slot: 'action',
          fixed: 'right',
        })
        this.tableColumns = tableColumns
        // console.log('tableColumns ====', this.tableColumns)
      } catch (err) {
        Message.error(String(err) || '获取列表字段和搜索字段配置数据失败')
        console.error('getTableConfig error:', err)
      } finally {
        this.pageLoading = false
      }
    },
  },
  async mounted () {
    this.sessionData = sessFun.getSess();
    // 先请求字段配置
    await this.getTableConfig()
    this.getUserOptions();
    this.getDistrictOptions();
    this.handleSearch();
  },
};
</script>

<style scoped lang="scss">
.search_bar {
  padding: 24px 24px 8px;
}
</style>
