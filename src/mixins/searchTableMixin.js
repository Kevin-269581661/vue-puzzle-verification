/**
 * 带搜索、分页的列表 mixin 封装
 */

let _initSearchData = null

export default {
  data() {
    return {
      // 搜索栏字段配置 - 建议使用 initSearchFileds 传入
      searchFileds: {},
      // 搜索栏字段绑定数据 - 使用 initSearchData 传入
      searchData: {},
      // 真正的搜索条件
      searchCondition: {},
      // 表格字段配置 - 建议使用 initTableColums 传入
      tableColumns: [],
      // 表格加载状态
      tableLoading: false,
      // 表格数据
      tableList: [],
      // 不能直接在子组件中覆盖，需使用 initPagination 传入
      pagination: {
        // 当前页码
        page: 1,
        // 每页条数
        pageSize: 10,
        // 总条数
        total: 0,
        // 每页条数选项
        sizes: [10, 20, 50],
        // 请求的时候，分页字段名配置
        keyConfig: {
          page: 'pageNum',
          pageSize: 'pageSize'
        }
      },
      // 必传 - 获取数据对应 api 方法
      // apiModel: {
      //   getist: null
      // }
      apiModel: {
        list: {
          // 必传 - 请求路径
          requestUrl: '',
          // 可选 - 请求方法（传函数）
          requestFunction: ''
        }
      }
    }
  },
  methods: {
    /**
     * 列表操作按钮组
     */
    getActionList(row) {
      throw new Error('getActionList error: 请在子组件中重写该方法')
    },
    /**
     * 搜索字段变化
     */
    handleChangeSeach(filed) {
      console.log('headerSeachChange ===', filed, this.searchData[filed])
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
      if (_initSearchData) {
        this.searchData = _initSearchData()
      }
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
     * 搜索数据格式化
     */
    searchParamFormat() {
      const { page, pageSize, keyConfig } = this.pagination
      let params = {}
      Object.keys(this.searchData).forEach((key) => {
        let val = this.searchData[key]
        if (val === '' || val === void 0) {
          val = null
        }
        params[key] = val
      })
      params = this.handleTableListRequestParam(params)
      params = {
        ...params,
        [keyConfig.page]: page,
        [keyConfig.pageSize]: pageSize
      }
      this.searchCondition = params
    },
    /**
     * 获取列表数据
     */
    async getTableList() {
      try {
        const { requestUrl, requestFunction } = this.apiModel.list
        if (!requestUrl) throw new Error('getTableList error: 请配置请求地址')
        // 处理请求方法
        let request = null
        if (requestFunction) {
          request = requestFunction
        } else {
          request = this.$request.postApi_json
        }
        this.tableList = []
        this.tableLoading = true
        // 发起请求
        const res = await request(requestUrl, this.searchCondition)
        const { list = [], total } = this.handleTableListResponse(res)
        console.log('getTableList ===', list, total)
        this.tableList = list
        this.pagination.total = total
      } catch (err) {
        this.$message.error(String(err) || '获取列表数据失败')
        console.error('getTableList error:', err)
      } finally {
        this.tableLoading = false
      }
    },
    /**
     * 对列表接口请求的参数特殊处理
     * （默认不处理，如有需要，请重写该方法）
     */
    handleTableListRequestParam(params) {
      return params
    },
    /**
     * 对列表接口返回的数据特殊处理
     * （默认不处理，如有需要，请重写该方法）
     */
    handleTableListResponse(res) {
      const { SysCode: code, MSG: message, data } = res.data || {}
      if (code !== 200200) throw new Error(message || '获取列表数据失败')
      const { list = [], total } = data
      return { list, total }
    },
    /**
     * 初始化
     */
    initSearchTableMixin({
      initSearchData,
      initSearchFileds,
      initTableColums,
      initPagination
    }) {
      if (initSearchData && typeof initSearchData === 'function') {
        _initSearchData = initSearchData
        this.searchData = initSearchData()
      }
      if (initSearchFileds && typeof initSearchFileds === 'function') {
        this.searchFileds = initSearchFileds()
      }
      if (initTableColums && typeof initTableColums === 'function') {
        this.tableColumns = initTableColums()
      }
      if (initPagination && typeof initPagination === 'function') {
        const paginationCustom = initPagination()
        Object.keys(paginationCustom).forEach((key) => {
          if (key in this.pagination) {
            this.pagination[key] = paginationCustom[key]
          }
        })
      }
    }
  },
  created() {
    // 使用时，需要在子组件内这里调用 initSearchTableMixin 初始化方法
    // this.initSearchTableMixin({ initSearchData, initSearchFileds })
  }
}
