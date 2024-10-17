<!-- 新建非系统订单-弹框组件 -->
<template>
  <div>
    <el-dialog
      width="600px"
      append-to-body
      show-close
      title="新建非系统订单"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <div v-loading="loading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" class="form" label-width="100px" size="small"  :model="formData" :rules="formRules">

            <el-form-item label="投放城市：" prop="nonSystemApId">
              <el-button
                type="primary"
                icon="el-icon-download"
                style="margin-bottom: 20px"
                @click="downloadTemplate"
              >
                下载导入模板
              </el-button>
              <div class="item_box">
                <FileUpload
                  ref="uploaderRef"
                  drag
                  showFileList
                  listType="text-plain"
                  accept=".xls,.xlsx"
                  :showTip="false"
                  :maxSize="10"
                  :uploadApi="$api.nationalAdPlan.importNationalAdPlanExcel"
                  :uploadParams="formData"
                  :handleUploadRes="handleUploadRes"
                  @success="uploadSuccess"
                />
                <div class="desc">注：支持多公司多城市导入，合并一个表格导入所有城市即可。</div>
              </div>
            </el-form-item>

          </el-form>
        </div>
        <div class="custom_dialog_footer">
          <el-button size="small" @click="close">取消</el-button>
          <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 导入失败结果-弹窗 -->
    <el-dialog
      title="导入失败的点位"
      :visible.sync="dialogErrorPoint"
      top="5vh"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :center="false"
      custom-class="error-point-dialog"
      width="1134px"
    >
      <div class="custom_dialog_body">
        <el-table
          ref="errorTableRef"
          :data="errorShowList"
          border
          max-height="500"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
            :index="errorPageSize * errorCurrentPage - errorPageSize + 1"
          >
          </el-table-column>

          <el-table-column prop="resName" label="资源名称" width="120" show-overflow-tooltip></el-table-column>

          <el-table-column prop="mediaName" label="媒体名称" width="120" show-overflow-tooltip></el-table-column>

          <el-table-column prop="mediaTypeName" label="媒体类型" width="120" show-overflow-tooltip></el-table-column>

          <el-table-column prop="asLab" label="投放面" width="90"></el-table-column>

          <el-table-column prop="assetTag" label="资产编号" width="90"></el-table-column>

          <el-table-column prop="companyName" label="所属公司" width="100" show-overflow-tooltip></el-table-column>

          <el-table-column prop="city" label="城市" width="100"></el-table-column>

          <el-table-column prop="district" label="区域" width="100"></el-table-column>

          <el-table-column label="排期" width="180">
            <template slot-scope="scope">
              <div>
                {{ scope.row.schedule}}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="failReason"
            label="失败原因"
            width="360"
            show-overflow-tooltip
            fixed="right"
          >
            <template slot-scope="scope">
              <div>
                {{scope.row.failReason}}
                <el-tooltip v-if="scope.row.earliestOnPubDate" effect="dark" :content="'最早可连续投放开始日期：'+scope.row.earliestOnPubDate" placement="top-start">
                  <i class="el-icon-date"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleErrorSizeChange"
          @current-change="handleErrorCurrentChange"
          :current-page="errorCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="errorPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="errorList.length"
          style="text-align: right"
        >
        </el-pagination>
      </div>
      <span slot="footer">
        <el-button plain @click="dialogErrorPoint = false">关闭</el-button>
        <el-button plain @click="export2Excel" :disabled="isDown">导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileUpload from '@/components/common/components/FileUpload/index.vue'
import { downLoadFileByUrl } from '@/utils/downLoadUtil'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    // 订单id
    apId: null,
    // 方案名称
    apName: '',
    // 方案隶属广告主(联系人)
    adcID: null,
    // 客户品牌id
    bID: null,
    // 关联销售
    suID: null,
    // 非系统单id
    nonSystemApId: null
  }
}

export default {
  name: 'createNotSysOrderDialog',
  components: { FileUpload },
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        // 通用校验
        nonSystemApId: [{ required: true, message: '请先上传Excel', trigger: 'blur' }],
      },
      errorList: [],
      successSize: 0,
      dialogErrorPoint: false,
      //每页显示的数据量
      successPageSize: 10,
      errorPageSize: 10,
      //成功小区第几页
      successCurrentPage: 1,
      // 失败小区
      errorCurrentPage: 1,
      isDown: false,
    }
  },
  computed: {
    errorShowList() {
      if (this.errorList) {
        if (this.$refs.errorTableRef) {
          this.$refs.errorTableRef.bodyWrapper.scrollTop = 0;
        }
        return this.errorList.slice(
          (this.errorCurrentPage - 1) * this.errorPageSize,
          this.errorCurrentPage * this.errorPageSize
        );
      } else {
        return []
      }
    },
  },
  methods: {
    /**
     * 导出失败excel
     */
    export2Excel() {
      this.isDown = true;
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("@/vendorExcel/Export2Excel");
        const tHeader = [
          "资源名称",
          "媒体名称",
          "媒体类型",
          "投放面",
          "资产编号",
          "所属公司",
          '省份',
          "城市",
          "区域",
          "投放排期",
          "失败原因"
        ];
        const filterVal = [
          "resName",
          "mediaName",
          "mediaTypeName",
          "asLab",
          "assetTag",
          "companyName",
          'province',
          "city",
          "district",
          "schedule",
          "failReason"
        ];
        const list = this.errorList;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "导入失败点位");
        this.isDown = false;
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },

    /**
     * 查看失败小区
     */
    openUnsuccessful() {
      this.dialogErrorPoint = true;
    },

    handleSuccessSizeChange(val) {
      this.successPageSize = val;
    },

    handleSuccessCurrentChange(val) {
      this.successCurrentPage = val;
    },

    handleErrorSizeChange(val) {
      this.errorPageSize = val;
    },

    handleErrorCurrentChange(val) {
      this.errorCurrentPage = val;
    },

    handleUploadRes(res) {
      const { SysCode: code, MSG: message, data } = res.data || {}
      if (code !== 200200) throw new Error(message || '上传失败 code != 200')
      this.errorList = data.errorList || []
      this.successSize = data.successSize || 0
      this.formData.nonSystemApId = data.apId || null
      return ''
    },

    uploadSuccess() {
      if (this.errorList.length) {
        this.openUnsuccessful()
        return
      }
    },

    /**
     * 下载模板
     */
    downloadTemplate() {
      const url = this.apiVar.qadnUrl + '/importTemplate/非系统全国单表格模板.xlsx'
      downLoadFileByUrl(url)
    },
    /**
     * 提交表单
     */
    async onSubmit() {
      if (this.loading) return
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        this.loading = true
        const res = await this.$api.detecting.addAdPlanRel({
          ...this.formData,
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.$emit('submitSuccess')
        this.close()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取详情
     */
    async getDetail() {
      try {
        this.loading = true
        const res = await this.$api.detecting.getNonSystemOrderInfo({
          apId: this.formData.apId
        })
        const { SysCode: code, MSG: message, data = {} } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.formData = {
          ...this.formData,
          ...data
        }
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.isEdit = false
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
      this.$refs.uploaderRef && this.$refs.uploaderRef.reset()
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     */
    open(apId) {
      if (!apId) return
      if (this.visible) return
      this.visible = true
      this.formData.apId = apId
      this.getDetail()
    },
    /**
     * 关闭弹框
     */
    close() {
      if (!this.visible) return
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped="scoped">

/deep/ .el-dialog__body {
  padding: 0;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}

.item_box {
  background: #fafafa;
  padding: 10px;
  border-radius: 4px;
  padding-left: 15px;
}

.desc {
  color: #F56C6C;
  color: 14px;
  line-height: 22px;
  margin-top: 8px;
}

</style>
