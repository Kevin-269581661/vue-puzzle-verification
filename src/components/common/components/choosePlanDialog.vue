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
                  <el-select v-model="searchData.select" slot="prepend" size="small" placeholder="请选择" class="keyword_select_box">
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
          <div class="table_wrapper">
            <TableList
              :columns="tableColumns"
              :dataSource="tableList"
              :loading="tableLoading"
              :showSetting="false"
              @refreshTable="getTableList"
            >

              <!-- 自定义状态列 -->
              <!-- <template slot="statusDesc" slot-scope="slotProps">
                <PointState :state-text="slotProps.row.statusDesc" :color="statusColorObj[slotProps.row.statusDesc]"/>
              </template> -->
            </TableList>
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
import searchTableMixin from '@/mixins/searchTableMixin'
import TableList from "@/components/common/components/TableList/index.vue"
import TableSearch from "@/components/common/components/TableSearch/index.vue"

/**
 * 初始化搜索绑定数据
 */
const initSearchData = () => ({
  // 关键词
  keyword: '',
  select: '1',
  // 日期
  dateType: '',
  rangeDate: [],
  // 选择状态
  status: '',
  // 选择城市
  cityWord: '',
  // 是否预锁
  Lock: '',
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
  status: {
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
  cityWord: {
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
  Lock: {
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
  { title: '方案名称', dataIndex: 'apName' },
  { title: '客户名称', dataIndex: 'cName' },
  { title: '品牌名称', dataIndex: 'bTitle' },
  { title: '方案价格', dataIndex: 'apTotal' },
  { title: '所有人', dataIndex: 'realName' },
  { title: '投放城市(点位面数,排期)', dataIndex: 'cityArea' },
  { title: '媒体类型', dataIndex: 'mediaTypeDetails' },
])
/**
 * 初始化列表分页数据
 */
const initPagination = () => ({
  // 请求的时候，分页字段名配置
  keyConfig: {
    page: 'pageNum',
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
        belongs_saler: ['ADN_MD_COUNTRY', 'ADN_MD'].includes(role)
      }
    }
  },
  methods: {
    /**
     * 处理列表接口返回的数据
     */
    handleTableListResponse(res) {
      const { list = [], total } = res.data
      return { list, total }
    },
    /**
     * 处理预加载数据返回结果
     */
    handleOptionsRes(res) {
      return res.data
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
      cityWord: () => this.$api.advertisement.getAPDCityNames({ uid, token })
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

.custom_dialog_footer{
  padding: 10px 20px 20px;
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

</style>
