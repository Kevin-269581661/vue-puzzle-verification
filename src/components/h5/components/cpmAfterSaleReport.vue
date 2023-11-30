<template>
  <div v-loading="loading" class="cpm_after_sale_report">
    <template v-if="visible">
      <!-- CPM 售后报告组件 -->
      <div class="header_bar">
        <el-date-picker
          v-model="scheduleDate"
          :picker-options="scheduleDatePickerOptions"
          :clearable="false"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          placeholder="选择日期"
          size="small"
          @change="handleScheduleDateChange"
        >
        </el-date-picker>

        <el-button type="plain" size="small" style="width: 100px" @click="handleShareBtnclick">
          <!-- <img src="@/assets/images/icons/share_icon.png" /> -->
          <i class="el-icon-share"></i>
          分享设置
        </el-button>
      </div>

      <!-- 折线图 -->
      <div v-loading="chartLoading" class="chart_map_wrapper">
        <div id="reportChart" class="report_chart"></div>
      </div>

      <div class="search_bar">
        <!-- <el-row style="flex-wrap: wrap" :gutter="16" align="middle">
          <el-col class="gutter_row" :xs="24" :md="12" :lg="8" :xl="6">
            <div class="search_item">
              <div class="search_item_title">资源名称</div>
              <el-input v-model="searchData.resName" placeholder="请输入" clearable size="small"></el-input>
            </div>
          </el-col>
          <el-col class="gutter_row" :xs="24" :md="12" :lg="8" :xl="6">
            <div class="search_item">
              <div class="search_item_title">城市</div>
              <el-input v-model="searchData.resName" placeholder="请输入" clearable size="small"></el-input>
            </div>
          </el-col>
        </el-row> -->
        <div class="search_content">
          <div class="search_item">
            <div class="search_item_title">资源名称</div>
            <el-input v-model="searchData.resName" placeholder="请输入资源名称" clearable size="small" class="item_content"></el-input>
          </div>
          <div class="search_item">
            <div class="search_item_title">城市</div>
            <el-select
              v-model="searchData.rIds"
              multiple
              collapse-tags
              placeholder="请选择要筛选的城市"
              clearable
              size="small"
              class="item_content"
            >
              <el-option v-for="(item, index) in preparedData.rIdsOptions" :key="index" :label="item.name" :value="item.rid" />
            </el-select>
          </div>
        </div>

        <div class="search_control">
          <el-button-group>
            <el-button type="plain" size="small" @click="handleReset">重置</el-button>
            <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
          </el-button-group>
          <!-- 导出 -->
          <DownloadFileButton
            requestUrl="/addsp/api/v1/share/admin/adPlan/exportResInfo"
            :requestParams="searchCondition"
            :isJoinTimeToFileName="false"
            class="download_button"
          />
        </div>

      </div>

      <div class="table_wrapper">
        <el-table
          v-loading="tableLoading"
          :data="tableList"
          :load="tableLoad"
          :tree-props="{ children:'children', hasChildren: 'hasChildren' }"
          row-key="resId"
          style="width: 100%"
          height="100%"
          lazy
          border
        >
          <el-table-column prop="resName" label="资源名称" min-width="250" />
          <el-table-column prop="city" label="城市" min-width="120" />
          <el-table-column prop="areaName" label="区域" min-width="120" />
          <el-table-column prop="address" label="地址" min-width="100" />
          <el-table-column prop="buildingType" label="楼盘类型" min-width="120" />
          <el-table-column prop="tradingArea" label="商圈" min-width="120" />
          <el-table-column prop="chDay" label="入住时间" min-width="120" />
          <el-table-column prop="price" label="楼盘价格" min-width="120" />
          <el-table-column prop="adSpaceCount" label="媒体数量" min-width="120" />
          <el-table-column prop="openDoorCount" label="开门次数" min-width="120" fixed="right">
          </el-table-column>
        </el-table>
        <div class="pagination_box">
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
    </template>

    <div v-else class="empty_box">
      <img src="@/assets/images/nofound.png" alt="" class="empty_img">
      <div class="empty_text">订单未开始投放，暂无数据</div>
    </div>


    <!-- 分享设置弹窗 -->
    <ShareConfigDialog ref="shareConfigDialogRef" />
  </div>
</template>

<script>

import dayjs from "dayjs";
// import * as echarts from 'echarts'
import { debounce } from 'lodash'
import { getReportChartOptions } from "../report.data";
import sessFun from "@/commonFun/sessFun.js";
import ShareConfigDialog from "./shareConfigDialog.vue"
import DownloadFileButton from "@/components/common/components/downloadFileButton.vue";

/**
 * 初始化搜索数据
 */
const initSearchData = () => {
  return {
    beginDate: '',
    endDate: '',
    rIds: [],
    resName: '',
  }
}

export default {
  name: 'cpmAfterSaleReport',
  components: { ShareConfigDialog, DownloadFileButton },
  // emits: ['submitSuccess', 'close'],
  props: {
    // 订单ID
    apId: {
      type: Number,
    }
  },
  data() {
    return {
      visible: false,
      scheduleDate: [],
      scheduleDatePickerOptions: {
        disabledDate: (t) =>  {
          const { beginDate, endDate } = this.dateRange
          if (beginDate && endDate) {
            return dayjs(t).isBefore(dayjs(beginDate), 'day') || dayjs(t).isAfter(dayjs(endDate), 'day')
          }
          return true
        }
      },
      // 时间可选范围
      dateRange: {
        beginDate: '',
        endDate: '',
      },
      loading: false,
      chartLoading: false,
      reportChart: null,
      reportChartData: {
        xData: [],
        yData: []
      },
      // 搜索栏字段绑定数据
      searchData: initSearchData(),
      // 真正的搜索条件
      searchCondition: {},
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
      preparedData: {
        rIdsOptions: []
      },
    }
  },
  computed: {

  },
  watch: {
    apId(newVal) {
      if (newVal) this.getAdPlanDate()
    }
  },
  methods: {
    /**
     * 改变日期
     */
    handleScheduleDateChange(val) {
      console.log('改变日期 val===', val)
      if (!val) return this.$message.warning('请选择日期')
      this.refreshData()
    },
    /**
     * 刷新数据
     */
    refreshData() {
      this.handleReset()
      this.getRIdsOptions()
      this.getDaysOpenDoor()
    },
    /**
     * 获取订单每天开门次数数据
     */
     async getDaysOpenDoor() {
      try {
        this.chartLoading = true
        const [beginDate, endDate] = this.scheduleDate
        const res = await this.$api.postApi_json('/addsp/api/v1/share/admin/adPlan/daysOpenDoor', {
          apId: this.apId,
          beginDate,
          endDate
        })
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return this.$message.error(message || '获取订单开门次数数据失败')
        let xData = []
        let yData = []
        data.forEach(item => {
          xData.push(item.dateId)
          yData.push(item.count)
        })
        this.reportChartData = { xData, yData }
        this.setChartRender()
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDaysOpenDoor error:', err)
      } finally {
        this.chartLoading = false
      }
    },
    /**
     * 获取城市列表预加载数据
     */
     async getRIdsOptions() {
      try {
        // this.loading = true
        const [beginDate, endDate] = this.scheduleDate
        const res = await this.$api.postApi_json('/addsp/api/v1/share/adPlan/getCityList', {
          apId: this.apId,
          beginDate,
          endDate
        })
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '获取城市列表预加载数据失败')
        this.preparedData.rIdsOptions = data
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getRIdsOptions error:', err)
      } finally {
        // this.loading = false
      }
    },
    /**
     * 获取订单日期数据
     */
     async getAdPlanDate() {
      try {
        this.loading = true
        const res = await this.$api.getApi('/addsp/api/v1/share/admin/adPlan/getAdPlanDate', { apId: this.apId })
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return this.$message.error(message || '获取订单日期数据失败')
        let { beginDate, endDate } = data
        // 如果是未开始投放的订单，不展示数据
        if (dayjs().isBefore(dayjs(beginDate), 'day')) {
          this.visible = false
          return
        }
        this.visible = true
        // 处理默认时间：如果结束时间大于今天，取今天日期
        if (dayjs().isBefore(dayjs(endDate), 'day')) {
          endDate = dayjs().format('YYYY-MM-DD')
        }
        this.dateRange = { beginDate, endDate }
        // 展示默认时间
        this.scheduleDate = [beginDate, endDate]
        this.initChart()
        this.refreshData()
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getAdPlanDate error:', err)
      } finally {
        this.loading = false
      }
    },
    /**
     * 加载子数据
     */
    async tableLoad(row, treeNode, resolve) {
      try {
        const { beginDate, endDate } = this.searchCondition
        let params = {
          beginDate,
          endDate,
          resId: row.resId,
          apId: this.apId,
        }
        const res = await this.$api.postApi_json('/addsp/api/v1/share/admin/adPlan/resPlayMedia', params)
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取列表子数据失败')
        let list = []
        list = data.map((item, index) => {
          return {
            ...item,
            resId: row.resId + "" + index,
            resName: item.name + '（媒体位ID:' + item.mediaId + '）'
          }
        })
        resolve(list)
      } catch (err) {
        console.error('tableLoad error:', err)
        this.$message.error(String(err) || '获取列表数据失败')
      }
    },
    /**
     * 搜索数据格式化
     */
    searchParamFormat() {
      const { page: pageNum, pageSize } = this.pagination
      let params = {}
      Object.keys(this.searchData).forEach((key) => {
        let val = this.searchData[key]
        if (val === '' || val === void 0) {
          val = null
        }
        params[key] = val
      })
      // 处理日期
      if (this.scheduleDate.length) {
        const [ startTime, endTime ] = this.scheduleDate
        params.beginDate = startTime
        params.endDate = endTime
      }
      params = {
        ...params,
        apId: this.apId,
        pageNum,
        pageSize
      }
      this.searchCondition = params
    },
    /**
     * 列表搜索
     */
     handleSearch() {
      this.searchParamFormat();
      this.getTableList();
    },
    /**
     * 列表重置
     */
    handleReset() {
      this.pagination.page = 1
      this.searchData = initSearchData()
      this.handleSearch()
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
     * 获取列表数据
     */
    async getTableList() {
      try {
        this.tableLoading = true
        const res = await this.$api.postApi_json('/addsp/api/v1/share/admin/adPlan/pageResInfo', this.searchCondition)
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取列表数据失败')
        const { list = [], total } = data
        this.tableList = list.map(item => {
          return {
            ...item,
            hasChildren: true,
            children: []
          }
        })
        this.pagination.total = total
      } catch (err) {
        this.$message.error(String(err) || '获取列表数据失败')
        console.error('getTableList error:', err)
      } finally {
        this.tableLoading = false
      }
    },
    /**
     * 点击分享配置
     */
     handleShareBtnclick() {
      this.$refs.shareConfigDialogRef && this.$refs.shareConfigDialogRef.open(this.apId)
    },
    /**
     * 初始化
     */
    initChart() {
      setTimeout(() => {
        this.reportChart = echarts.init(document.getElementById('reportChart'))
        this.setChartRender()
      }, 500)
    },
    /**
     * 设置图表数据
     */
    setChartRender() {
      this.reportChart && this.reportChart.setOption(getReportChartOptions(this.reportChartData))
    },
    /**
     * 屏幕宽度变化
     */
    handleResize: debounce(function () {
      this.reportChart && this.reportChart.resize()
    }, 300)
  },
  mounted() {
    // this.initChart()
    window.addEventListener('resize', this.handleResize, false)
    if (this.apId) this.getAdPlanDate()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize, false)
  }
}
</script>

<style lang="scss" scoped="scoped">
.cpm_after_sale_report {
  padding-bottom: 60px;
  .header_bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }

  .chart_map_wrapper {
    height: 450px;
    width: 100%;
    .report_chart {
      height: 450px;
      width: 100%;
    }
  }

  .table_wrapper {
    height: 640px;
  }

  .pagination_box {
    .el-pagination {
      position: relative;
      top: 0;
      right: 0;
    }
  }

  .search_bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .search_control {
      display: flex;
    }
    .download_button {
      margin-left: 12px;
    }
    .search_content {
      display: flex;
      flex-wrap: wrap;
    }
    .search_item {
      // width: 25%;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      padding-right: 24px;
      box-sizing: border-box;
    }
    .search_item_title {
      // width: 70px;
      font-size: 14px;
      color: #000;
      margin-right: 14px;
      text-align: right;
      white-space: nowrap;
    }
    .item_content {
      // flex: 1;
      // overflow: hidden;
      width: 200px;
    }
    /deep/ .el-select {
      top: 0;
    }
  }

  .empty_box {
    padding: 120px 0 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .empty_img {
      width: 120px;
      margin-bottom: 15px;
    }
    .empty_text {
      color: #999;
      text-align: center;
    }
  }
}
</style>
