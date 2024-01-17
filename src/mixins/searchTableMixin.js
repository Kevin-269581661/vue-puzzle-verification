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
      // 真正的搜索条件（不包含分页条件）
      searchCondition: {},
      // 表格字段配置 - 建议使用 initTableColumns 传入
      tableColumns: [],
      // 表格加载状态
      tableLoading: false,
      // 表格数据
      tableList: [],
      // 列表配置
      tableSetting: {
        // 是否使用分页
        usePagination: true,
        // 是否是树型表格
        useTreeTable: false,
        // 是否滚动到顶部
        isScrollToTop: false
      },
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
        // 也可以直接写封装的 apiModel 方法
        // list: api.xxxx.list
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
      // 重置当前页码
      if (this.tableSetting.usePagination) {
        this.pagination.page = 1
      }
      this.searchParamFormat();
      this.getTableList();
    },
    /**
     * 列表重置
     */
    handleReset() {
      // 重置搜索条件
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
      let params = {}
      Object.keys(this.searchData).forEach((key) => {
        let val = this.searchData[key]
        if (val === '' || val === void 0) {
          val = null
        }
        params[key] = val
      })
      this.searchCondition = this.handleTableListRequestParam(params)
    },
    /**
     * 获取列表数据
     */
    async getTableList() {
      try {
        if (this.tableLoading) return
        // this.tableList = []
        let params = { ...this.searchCondition }
        this.tableLoading = true
        // 判断是否使用分页
        if (this.tableSetting.usePagination) {
          const { page, pageSize, keyConfig } = this.pagination
          params = {
            ...params,
            [keyConfig.page]: page,
            [keyConfig.pageSize]: pageSize
          }
        }
        // 处理请求方法
        let res = null
        let request = null
        if (typeof this.apiModel.list === 'function') {
          request = this.apiModel.list
          // 发起请求
          res = await request(params)
        } else if (this.apiModel.list && typeof this.apiModel.list === 'object') {
          const { requestUrl, requestFunction } = this.apiModel.list
          if (!requestUrl) throw new Error('getTableList error: 请配置请求地址')
          if (requestFunction) {
            request = requestFunction
          } else {
            request = this.$request.postApi_json
          }
          // 发起请求
          res = await request(requestUrl, params)
        } else {
          throw new Error('getTableList error: 请配置请求方法')
        }
        // 判断是否使用分页
        if (this.tableSetting.usePagination) {
          const { list = [], total } = this.handleTableListResponse(res)
          this.tableList = list
          this.pagination.total = total
        } else {
          this.tableList = this.handleTableListResponse(res)
        }
        this.onTableDataGot()
      } catch (err) {
        this.$message.error(String(err) || '获取列表数据失败')
        console.error('getTableList error:', err)
      } finally {
        this.tableLoading = false
      }
    },
    /**
     * 统一获取预加载数据 options 方法
     * @param {*} filedToApiModel { filedName: apiModelPromiseFunction }
     */
    async getOptions(filedToApiModel) {
      try {
        if (typeof filedToApiModel !== 'object') {
          throw new Error('filedToApiModel must be an object')
        }
        const promiseList = Object.values(filedToApiModel).map(apiModelPromiseFunction => apiModelPromiseFunction())
        const filedList = Object.keys(filedToApiModel)
        const resList = await Promise.all(promiseList)
        console.log('getOptions resList:', resList)
        resList.forEach((res, index) => {
          let options = this.handleOptionsRes(res)
          this.setOptions(filedList[index], options)
        })
      } catch (err) {
        console.error('getOptions error:', err)
        this.$message.error(String(err) || '获取预加载数据失败')
      }
    },
    /**
     * 设置 options
     * @param {*} filed
     * @param {*} options
     */
    setOptions(filed, options) {
      this.searchFileds[filed].options = options
    },
    /**
     * 处理列表接口请求的参数
     * （如有需要，请重写该方法）
     */
    handleTableListRequestParam(params) {
      return params
    },
    /**
     * 处理列表接口返回的数据
     * （如有需要，请重写该方法）
     */
    handleTableListResponse(res) {
      const { SysCode: code, MSG: message, data } = res.data || {}
      if (code !== 200200) throw new Error(message || '获取列表数据失败')
      if (this.tableSetting.usePagination) {
        const { list = [], total } = data
        return { list, total }
      }
      return data
    },
    /**
     * 列表接口请求完毕的回调
     * （如有需要，请重写该方法）
     */
    onTableDataGot() {
      console.log('列表接口请求完毕')
    },
    /**
     * 处理预加载数据返回结果
     * （如有需要，请重写该方法）
     */
    handleOptionsRes(res) {
      const { SysCode: code, MSG: message, data } = res.data || {}
      if (code !== 200200) throw new Error(message || '获取预加载数据失败')
      return data
    },
    /**
     * 初始化
     */
    initSearchTableMixin({
      initSearchData,
      initSearchFileds,
      initTableColumns,
      initPagination,
      initTableSetting
    }) {
      if (initSearchData && typeof initSearchData === 'function') {
        _initSearchData = initSearchData
        this.searchData = initSearchData()
      }
      if (initSearchFileds && typeof initSearchFileds === 'function') {
        this.searchFileds = initSearchFileds()
      }
      if (initTableColumns && typeof initTableColumns === 'function') {
        this.tableColumns = initTableColumns()
      }
      if (initPagination && typeof initPagination === 'function') {
        const paginationCustom = initPagination()
        Object.keys(paginationCustom).forEach((key) => {
          if (key in this.pagination) {
            this.pagination[key] = paginationCustom[key]
          }
        })
      }
      if (initTableSetting && typeof initTableSetting === 'function') {
        const tableSetting = initTableSetting()
        Object.keys(tableSetting).forEach((key) => {
          if (key in this.tableSetting) {
            this.tableSetting[key] = tableSetting[key]
          }
        })
      }
    },
  },
  created() {
    // 使用时，需要在子组件内这里调用 initSearchTableMixin 初始化方法
    // this.initSearchTableMixin({ initSearchData, initSearchFileds })
  }
}
