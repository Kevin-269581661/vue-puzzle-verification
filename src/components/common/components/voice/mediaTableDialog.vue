<template>
  <div class="media_table_dialog">
    <!-- 媒体列表 - 弹框组件-->
    <el-dialog
      title="媒体列表"
      width="80%"
      top="10vh"
      :visible.sync="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
    >
      <div class="custom_dialog_body">
        <!-- 搜索条件 -->
        <div class="search_bar">
          <div class="search_item">
            <span class="item_title">媒体ID：</span>
            <el-input
              v-model="searchData.assetTag"
              placeholder="请输入资源名称"
              clearable
              size="small"
              class="item_content"
            ></el-input>
          </div>

          <div class="search_item">
            <span class="item_title">资源名称：</span>
            <el-input
              v-model="searchData.resName"
              placeholder="请输入方案名称"
              clearable
              size="small"
              class="item_content"
            ></el-input>
          </div>

          <div class="search_item">
            <span class="item_title">媒体名称：</span>
            <el-input
              v-model="searchData.mediaName"
              placeholder="请输入资产编号"
              clearable
              size="small"
              class="item_content"
            ></el-input>
          </div>

          <div class="search_item">
            <span class="item_title">位置类型：</span>
            <el-input
              v-model="searchData.siteType"
              placeholder="请输入位置类型"
              clearable
              size="small"
              class="item_content"
            ></el-input>
            <!-- <el-select
              v-model="searchData.siteType"
              placeholder="请选择"
              multiple
              collapse-tags
              clearable
              size="small"
              class="item_content"
            >
              <el-option
                v-for="(item, i) in preparedData.siteTypeSelectList"
                :key="i"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select> -->
          </div>

          <div class="search_item">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="handleSearch"
            >
              搜索
            </el-button>
            <el-button plain @click="handleReset" size="small">重置</el-button>
          </div>

        </div>
        <!-- 全部媒体 -->
        <div class="check_all_box">
          <el-checkbox v-model="isCheckAll" @change="handleCheckAll">全部媒体</el-checkbox>
        </div>
        <!-- 列表 -->
        <div class="table_box">
          <el-table
            ref="tableRef"
            :data="tableList"
            v-loading="tableLoading"
            height="500px"
            row-key="mid"
            style="width: 100%"
            element-loading-text="玩命加载中.."
            element-loading-spinner="el-icon-loading"
            highlight-current-row
            tooltip-effect="dark"
          >

            <!-- <el-table-column label="序号" type="index" width="80"></el-table-column> -->
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->

            <el-table-column v-if="!isCheckAll" width="55" key="selection">
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="isCheckAllCurrentPage" @change="handleSelectAll"></el-checkbox>
              </template>
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.selected" @change="val => handleSelect(val, scope.row)"></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column label="媒体名称" prop="mtitle" show-overflow-tooltip></el-table-column>

            <el-table-column label="资源名称" prop="resName" show-overflow-tooltip></el-table-column>

            <el-table-column label="城市" prop="cityName" show-overflow-tooltip></el-table-column>

            <el-table-column label="区域" prop="areaName" show-overflow-tooltip></el-table-column>

            <el-table-column label="街道" prop="street" show-overflow-tooltip></el-table-column>

            <el-table-column label="商圈" prop="tradingArea" show-overflow-tooltip></el-table-column>

            <el-table-column label="媒体备注" prop="remark" show-overflow-tooltip></el-table-column>

            <el-table-column label="位置类型" prop="siteType" show-overflow-tooltip></el-table-column>

            <el-table-column label="位置朝向" prop="siteOrientation" show-overflow-tooltip></el-table-column>

            <el-table-column label="媒体位ID" prop="assetTag" show-overflow-tooltip></el-table-column>

            <el-table-column label="楼盘类型" prop="resType" show-overflow-tooltip></el-table-column>

            <el-table-column label="楼盘价格" prop="price" show-overflow-tooltip></el-table-column>

            <el-table-column label="小区户数" prop="houseCount" show-overflow-tooltip></el-table-column>

          </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination_box">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="pagination.sizes"
            :current-page.sync="pagination.page"
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
        <el-button type="primary" @click="handleConfirm" size="small">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";

import api from "../../../../api/api.js";

const initSearchData = () => ({
  // 订单ID
  // apId: null,
  // 此记录的Id，编辑才传
  id: null,
  // 媒体位ID
  assetTag: '',
  // 资源名称
  resName: '',
  // 媒体名称
  mediaName: '',
  // 位置类型
  siteType: '',
})

export default {
  name: 'mediaTableDialog',
  props: {
    // 订单ID
    apId: {
      type: [String, Number],
      // required: true
    },
  },
  emits: ['confirm'],
  data () {
    return {
      visible: false,
      // 搜索绑定数据
      searchData: initSearchData(),
      // 真正的搜索条件
      searchCondition: {},
      tableLoading: false,
      tableList: [],
      // 用户改动勾选的数据
      tableSelectChangeList: [],
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
      preparedData: {
        siteTypeSelectList: []
      },
      // 是否勾选全部媒体
      isCheckAll: false,
      isCheckAllCurrentPage: false,
      // 已选的媒体
      selectedMediaIdList: []
    };
  },
  mounted () {

  },
  methods: {
    handleConfirm() {
      this.$emit('confirm', {
        list: this.tableSelectChangeList,
        isCheckAll: this.isCheckAll,
        total: this.pagination.total,
        selectedMediaIdList: this.selectedMediaIdList
      })
      this.close()
    },
    /**
     * 获取列表数据
     */
    async getTableList() {
      try {
        const { page: pageNum, pageSize } = this.pagination
        this.tableLoading = true
        const { data: res = {} } = await api.postApi_json('/addsp/api/v1/voice/voice/listOrderMedia', {
          ...this.searchCondition,
          // 订单ID
          apId: this.apId,
          pageNum,
          pageSize
        })
        const { code, data, message } = res
        if (code !== 200) return Message.error(message || '获取列表数据失败')
        const { list, total } = data
        this.tableList = list.map(item => {
          return {
            ...item,
            selected: this.selectedMediaIdList.includes(item.mid)
          }
        })
        this.pagination.total = total
        this.isCheckAllCurrentPage = this.handleCheckAllPage()
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
    handleSearch () {
      const searchCondition = {}
      Object.keys(this.searchData).forEach((key) => {
        let val = this.searchData[key]
        if (val === '' || val === void 0) {
          val = null
        }
        searchCondition[key] = val
      })
      this.searchCondition = searchCondition
      this.getTableList()
    },
    /**
     * 重置
     */
    handleReset () {
      this.pagination.page = 1
      this.searchData = {
        ...initSearchData(),
        id: this.searchData.id
      }
      this.getTableList();
    },
    /**
     * 分页-切换页数
     */
    changePage (val) {
      this.pagination.page = val
      this.getTableList()
    },
    /**
     * 分页-切换页大小
     */
    changeSize (val) {
      this.pagination.page = 1
      this.pagination.pageSize = val
      this.getTableList();
    },
    /**
     * 勾选全部媒体
     */
    handleCheckAll() {
      // this.isCheckAllCurrentPage = false
    },
    /**
     * 检查是否全选了本页
     */
    handleCheckAllPage() {
      return this.tableList.filter(item => item.selected).length === this.tableList.length
    },
    /**
     * 勾选
     */
     handleSelect(isSelect, { mid: mId }) {
      const hasOne = this.selectedMediaIdList.includes(mId)
      if (hasOne && !isSelect) {
        this.selectedMediaIdList.splice(this.selectedMediaIdList.indexOf(mId), 1)
      } else if (!hasOne && isSelect) {
        this.selectedMediaIdList.push(mId)
      }
      // 记录改变的值，如果有重复，覆盖旧的
      let newList = this.tableSelectChangeList.filter(cell => cell.mId != mId)
      newList.push({ mId, isSelect })
      this.tableSelectChangeList = newList
      this.isCheckAllCurrentPage = this.handleCheckAllPage()
    },
    /**
     * 勾选全页
     */
     handleSelectAll(isSelect) {
      let newList = []
      let ids = []
      this.tableList.forEach(item => {
        item.selected = isSelect

        ids = this.selectedMediaIdList.filter(mId => mId != item.mid)
        if (isSelect) ids.push(item.mid)
        this.selectedMediaIdList = ids
        // 处理改变的数据
        newList = this.tableSelectChangeList.filter(cell => cell.mId != item.mid)
        newList.push({ mId: item.mid, isSelect })
        this.tableSelectChangeList = newList
      })
    },
    /**
     * 打开弹框
     * @param {*} recordId 此记录的Id，编辑才传
     */
    open(mediaIds) {
      if (Array.isArray(mediaIds)) this.selectedMediaIdList = JSON.parse(JSON.stringify(mediaIds))
      // this.searchData.id = recordId
      this.handleSearch()
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      this.searchData = initSearchData()
      this.tableList = []
      this.tableSelectChangeList = []
      this.tableLoading = false
      this.isCheckAll = false
      this.isCheckAllCurrentPage = false
      this.pagination.page = 1
      this.visible = false
    }
  },
};
</script>

<style lang="scss" scoped>
.media_table_dialog {
  /deep/ .el-dialog .el-dialog__body {
    padding: 0;
  }
  .custom_dialog_body {
    padding-bottom: 15px;
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

  .pagination_box {
    padding-top: 15px;
    text-align: right;
  }
}
</style>
