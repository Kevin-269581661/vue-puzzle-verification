<template>
  <div class="dialog_container">
    <!-- 选择方案组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="选择方案"
      width="80%"
      @closed="close"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <!-- 搜索栏 -->
          <div class="search_wrapper">
            <TableSearch
              :value="searchData"
              :fileds="searchFileds"
              @change="handleChangeSeach"
              @search="handleSearch"
              @reset="handleReset"
            >
              <!-- 关键词 -->
              <template slot="keyword">
                <el-input v-model="searchData.keyword" placeholder="请输入"  size="small" clearable class="keyword_input_box">
                  <el-select v-model="searchData.keywordType" slot="prepend" size="small" placeholder="请选择" class="keyword_select_box">
                    <template v-for="item in searchFileds.keyword.options" >
                      <el-option v-if="item.label === '所属销售' && permissions.belongs_saler" :value="item.value" :label="item.label" :key="item.value"></el-option>
                      <el-option v-else :value="item.value" :label="item.label" :key="item.value"></el-option>
                    </template>
                  </el-select>
                </el-input>
              </template>

              <!-- 日期 -->
              <template slot="dateType">
                <div class="date_search_item">
                  <el-select v-model="searchData.dateType" placeholder="请选择" size="small" style="width: 100px">
                    <template v-for="item in searchFileds.dateType.options" >
                      <el-option :value="item.value" :label="item.label" :key="item.value"></el-option>
                    </template>
                  </el-select>
                  <el-date-picker
                    v-model="searchData.rangeDate"
                    type="daterange"
                    range-separator="-"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    start-placeholder="选择日期"
                    end-placeholder="选择日期"
                    size="small"
                    style="flex: 1"
                  >
                  </el-date-picker>
                </div>
              </template>

            </TableSearch>
          </div>
          <!-- 表格 -->
          <div class="table_wrapper">
            <TableList
              :columns="tableColumns"
              :dataSource="tableList"
              :loading="tableLoading"
              :showSetting="false"
              height="100%"
              @refreshTable="getTableList"
            >

              <!-- 方案价格 -->
              <template slot="apTotal" slot-scope="slotProps">
                <span>¥{{ slotProps.row.apTotal }}</span>
              </template>

              <!-- 投放城市 -->
              <template slot="cityArea" slot-scope="scope">
                <template v-if="permissions.is_show_all_city">
                  <div v-for="(item, index) in scope.row.details" :key="index" class="city_p">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="
                        `${item.asName} ${item.city}(${item.num}面，${formatTime(item.pdStar)}至${formatTime(item.pdEnd)})`
                      "
                      placement="top"
                    >
                      <div>
                        {{ `${item.city}(${item.num}面，${formatTime(item.pdStar)}至${formatTime(item.pdEnd)})` }}
                      </div>
                    </el-tooltip>
                  </div>
                </template>
                <template v-else>
                  <div v-for="(item, index) in scope.row.details" :key="index" class="city_p">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="
                        `${item.asName} ${item.city}(${scope.row.apState == -1 ? item.num : '--'}面，${formatTime(item.pdStar)}至${formatTime(item.pdEnd)})`
                      "
                      placement="top"
                    >
                      <div>
                        {{ `${item.city}(${scope.row.apState == -1 ? item.num : '--'}面，${formatTime(item.pdStar)}至${formatTime(item.pdEnd)})` }}
                      </div>
                    </el-tooltip>
                  </div>
                </template>
              </template>

              <!-- 媒体类型 -->
              <template slot="mediaTypeDetails" slot-scope="scope">
                <div class="media-box">
                  <div class="media-tag" v-for="(m, index) in scope.row.mediaTypeDetails" :key="index">
                    <div class="tag"
                      :class="m.mediaTypeName === '广告门' ? 'ad' :
                            m.mediaTypeName === '框架' ? 'ad' :
                            m.mediaTypeName === '单元门禁灯箱' ? 'unit-access' :
                            m.mediaTypeName === '灯箱' ? 'light-box' :
                            m.mediaTypeName === '道闸' ? 'brake' : ''">
                      <template v-if="m.RemainDay">
                        <el-tooltip class="item" effect="dark" :content="`预锁剩余${m.RemainDay || 0}天`"
                          placement="top">
                          <i class="el-icon-lock icon"></i>
                        </el-tooltip>
                        {{ m.mediaTypeName }}{{ `（剩${m.RemainDay}天）` }}
                      </template>
                      <template v-else>
                        {{ m.mediaTypeName || '--' }}
                      </template>
                    </div>
                  </div>
                </div>
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
        <div class="custom_dialog_footer">
          <el-button @click="close" size="small">取消</el-button>
          <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun"
import dateFormat from "@/commonFun/timeFormat.js"
import searchTableMixin from '@/mixins/searchTableMixin'
import TableList from "@/components/common/components/TableList/index.vue"
import TableSearch from "@/components/common/components/TableSearch/index.vue"

/**
 * 初始化搜索绑定数据
 */
const initSearchData = () => ({
  // 关键词
  keyword: '',
  keywordType: '1',
  // 日期
  dateType: '0',
  rangeDate: [],
  // 选择状态
  apstate: '',
  // 选择城市
  cityName: '',
  // 是否预锁
  lockStatus: '',
})
/**
 * 初始化搜索配置
 */
const initSearchFileds = () => ({
  keyword: {
    title: '关键词',
    slotContent: 'keyword',
    options: [
      { label: '方案名称', value: '1' },
      { label: '客户名称', value: '2' },
      { label: '品牌名称', value: '3' },
      { label: '所属销售', value: '4' },
    ]
  },
  dateType: {
    title: '日期',
    slotContent: 'dateType',
    options: [
      { label: '上刊日期', value: '0' },
      { label: '下刊日期', value: '1' },
      { label: '创建日期', value: '2' },
    ]
  },
  apstate: {
    title: '选择状态',
    type: 'select',
    props: {
      placeholder: '请选择',
      filterable: true,
    },
    options: [
      { label: '未配点', value: -1 },
      { label: '已完成', value: 0 },
      { label: '进行中', value: 1 },
      { label: '未投放', value: 2 },
      { label: '投放中', value: 3 },
      { label: '强制结束', value: 5 },
    ]
  },
  cityName: {
    title: '选择城市',
    type: 'select',
    props: {
      placeholder: '请选择',
      filterable: true,
    },
    options: [],
    optionKey: {
      value: 'rName',
      label: 'rName'
    }
  },
  lockStatus: {
    title: '是否预锁',
    type: 'select',
    props: {
      placeholder: '请选择',
    },
    options: [
      { label: '未预锁', value: '1' },
      { label: '已预锁', value: '2' },
    ]
  },
})
/**
 * 初始化列表字段
 */
const initTableColums = () => ([
  { title: '序号', type: 'selection' },
  { title: '方案名称', dataIndex: 'apName', width: 150 },
  { title: '客户名称', dataIndex: 'cName', width: 150 },
  { title: '品牌名称', dataIndex: 'bTitle', width: 150 },
  { title: '方案价格', slot: 'apTotal' },
  { title: '所有人', dataIndex: 'realName' },
  { title: '投放城市(点位面数,排期)', slot: 'cityArea', width: 320 },
  { title: '媒体类型', slot: 'mediaTypeDetails', width: 200 },
])
/**
 * 初始化列表分页数据
 */
const initPagination = () => ({
  // 请求的时候，分页字段名配置
  keyConfig: {
    page: 'start',
    pageSize: 'pagesize'
  }
})

export default {
  name: 'choosePlanDialog',
  mixins: [searchTableMixin],
  components: { TableList, TableSearch },
  emits: ['submitSuccess', 'close'],
  props: {

  },
  data() {
    return {
      visible: false,
      dialogLoading: false,
      apiModel: {
        // list: {
        //   requestUrl: this.apiVar.Advertisement + "/GetProposal",
        //   requestFunction: this.$request.getApi
        // }
        list: this.$api.advertisement.getProposal
      },
      // 预加载数据
      preparedData: {
        propTwoOptions: []
      },
      // 登录信息、
      sessionData: {},
    }
  },
  computed: {
    // 权限控制
    permissions() {
      const role = this.sessionData.uType
      return {
        belongs_saler: ['ADN_MD_COUNTRY', 'ADN_MD'].includes(role),
        is_show_all_city: this.sessionData.ascType == 0 || this.sessionData.uType == "ADN_MD_COUNTRY",
        is_show_mediaType_column: ['ADN_MD', 'ADN_MD_COUNTRY', 'ADN_BD', 'ADN_SM', 'ADN_BD_KA'].includes(role),
      }
    }
  },
  methods: {
    /**
     * 时间格式化
     */
    formatTime(val) {
      return dateFormat.toDate(val, "/")
    },
    /**
     * 处理列表接口返回的数据
     */
    handleTableListResponse(res) {
      const { list = [], total } = res.data
      const newList = list.map(item => {
        const { details, mediaTypeNames } = item
        // 处理城市
        details.sort((a, b) => a.asrID - b.asrID)
        // 处理媒体类型数据
        const mediaTypeDetails = mediaTypeNames.split(',').map(item => {
          const index = details.findIndex(cell => cell.mediaTypeName === item)
          if (index > -1) {
            return details[index]
          } else {
            return { mediaTypeName: item }
          }
        })
        return {
          ...item,
          mediaTypeDetails
        }
      })
      return { list: newList, total }
    },
    /**
     * 处理预加载数据返回结果
     */
    handleOptionsRes(res) {
      return res.data
    },
    /**
     * 处理列表接口请求的参数
     */
    handleTableListRequestParam(params) {
      const { uID: uid, token } = this.sessionData
      const [ starttime = null, andtime = null ] = params.rangeDate || []
      params = {
        ...params,
        uid,
        token,
        keywordType: params.keyword ? params.keywordType : null,
        timeType: starttime ? params.dateType : null,
        starttime,
        andtime,
        rname: params.cityName,
        onyusuo: params.lockStatus,
      }
      return params
    },
    /**
     * 提交表单
     */
    async onSubmit() {
      try {
        const { token, uID: uid } = sessFun.getSess()
        this.dialogLoading = true
        const res = await this.$request.postApi_json('/addsp/api/xxxxx', {
          ...this.formData,
          uid,
          token,
        })
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.$emit('submitSuccess')
        this.close()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 打开弹框
     * （弹框打开时调用，一些弹框打开时的初始化处理可以在此方法内进行，譬如：通过 row.id 请求详情...）
     */
    open(row) {
      this.handleSearch()
      this.visible = true
    },
    /**
     * 关闭弹框
     * （可以处理一些收尾操作，如：清除定时器、事件监听等等）
     */
    close() {
      if (!this.visible) return
      this.$emit('close')
      this.visible = false
    }
  },
  created() {
    this.sessionData = sessFun.getSess()
    const { uID: uid, token } = this.sessionData
    this.initSearchTableMixin({ initSearchData, initSearchFileds, initPagination, initTableColums })
    this.getOptions({
      cityName: () => this.$api.advertisement.getAPDCityNames({ uid, token })
    })
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped="scoped">

/deep/ .el-dialog__body {
  padding: 0;
}

/deep/ .el-input-group__append, /deep/ .el-input-group__prepend {
  background-color: #fff;
}

.custom_dialog_body {
  height: calc(80vh - 120px);
  display: flex;
  flex-direction: column;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.table_wrapper {
  flex: 1;
  overflow: hidden;
}

.keyword_input_box {
  font-size: 0;
  // letter-spacing: 0;
  /deep/ .el-input__inner {
    font-size: 14px;
    text-align: left;
  }
}

.keyword_select_box {
  width: 110px;
}

.date_search_item {
  display: flex;
  align-content: center;
  overflow: hidden;
  /deep/ .el-select .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  /deep/ .el-date-editor.el-input__inner {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-left: 1px solid transparent;
  }
  /deep/ .el-range-editor.is-active {
    border-color: #1890FF;
  }
}


.media-box {
  display: flex;
  flex-wrap: wrap;

  .media-tag {
    margin: 4px 8px 4px 0;

    .tag {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 22px;
      padding: 0 8px;
      border-radius: 2px;
      font-family: 'Roboto';
      font-size: 12px;
      margin-right: 8px;
      line-height: normal;

      &:last-of-type {
        margin-right: 0;
      }

      &.ad {
        background: #E6F7FF;
        color: #1890FF;
        border: 1px solid #91D5FF;
      }

      &.unit-access {
        background: #F6FFED;
        color: #52C41A;
        border: 1px solid #B7EB8F;
      }

      &.light-box {
        background: #E6FFFB;
        color: #13C2C2;
        border: 1px solid #87E8DE;
      }

      &.brake {
        background: #f9f0ff;
        color: #722ED1;
        border: 1px solid #D3ADF7;
      }

      &.framework{
        background: linear-gradient(0deg, #FFFBE6, #FFFBE6),linear-gradient(0deg, #FFE58F, #FFE58F);
        color: #FAAD14;
        border: 1px solid #FFE58F;
      }

      .icon {
        cursor: pointer;
        display: block;
        width: 10px;
        margin-right: 6px;
      }
    }
  }
}

</style>
