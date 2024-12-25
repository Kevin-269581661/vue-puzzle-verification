<!-- 新建客户监播-弹窗 -->
<template>
  <div>
    <el-dialog
      width="600px"
      append-to-body
      show-close
      title="新建监播"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <div v-loading="loading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" class="form" label-width="120px" size="small"  :model="formData" :rules="formRules">

            <template v-if="step === 1">
              <el-form-item label="订单名称：" prop="apName">
                <el-input
                  v-model.trim="formData.apName"
                  placeholder="请输入"
                  clearable
                  maxlength="100"
                  style="width: 250px"
                >
                </el-input>
              </el-form-item>

              <el-form-item label="所属销售：" prop="saleId">
                <el-input v-if="isSaleRole" v-model="formData.saleName" disabled style="width: 250px"></el-input>
                <el-select
                  v-else
                  v-model="formData.saleId"
                  filterable
                  remote
                  clearable
                  placeholder="请输入"
                  style="width: 250px"
                  :remote-method="querySearchSale"
                  :loading="saleLoading"
                  :highlight-first-item="true"
                  @change="changeSale"
                >
                  <el-option
                    v-for="item in saleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="公司名称：" prop="companyId">
                <el-select
                  v-model="formData.companyId"
                  placeholder="请选择"
                  filterable
                  clearable
                  style="width: 250px"
                  @change="changeCompany"
                >
                  <el-option
                    v-for="item in companyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- crm 客户公司品牌 -->
              <el-form-item v-if="currentSaleData.customerSrc == 2" label="公司品牌：" prop="brandId">
                <el-select
                  v-model="formData.brandMedia"
                  placeholder="请选择"
                  filterable
                  clearable
                  style="width: 250px"
                  :disabled="!formData.companyId"
                  @change="changeBrandMedia"
                >
                  <el-option
                    v-for="item in brandMediaOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <!-- adn 客户公司品牌 -->
              <el-form-item v-else label="公司品牌：" prop="brandId">
                <el-select
                  v-model="formData.brandId"
                  placeholder="请选择"
                  filterable
                  clearable
                  style="width: 250px"
                  @change="changeBrand"
                >
                  <el-option
                    v-for="item in brandOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="联系人：" prop="contactId">
                <el-select
                  v-model="formData.contactId"
                  placeholder="请选择"
                  filterable
                  clearable
                  style="width: 250px"
                  :disabled="!formData.brandId"
                >
                  <el-option
                    v-for="item in contactOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

            </template>

            <el-form-item v-else label="投放城市：" prop="apId">
              <el-button
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
                  :uploadParams="uploadParams"
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
          <el-button v-if="step === 2" type="primary" size="small" @click="handleStep(-1)">
            上一步
          </el-button>
          <el-button  type="primary" size="small" @click="onSubmit">
            {{ step === 1 ? '下一步' : '确定' }}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 失败结果弹框 -->
    <FailListDialog ref="failListDialogRef" />
  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import { isEmpty } from '@/utils/common'
import { downLoadFileByUrl } from '@/utils/downLoadUtil'
import FileUpload from '@/components/common/components/FileUpload/index.vue'
import FailListDialog from '@/components/common/components/failListDialog/index.vue'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    // 订单名称
    apName: '',
    // 所属销售
    saleId: null,
    saleName: '',
    // 公司
    companyId: null,
    // 品牌
    brandId: null,
    // 方案隶属广告主(联系人)
    contactId: null,
    // 生成的订单id
    apId: null,
    brandMedia: '',
  }
}

export default {
  name: 'monitoringFormDialog',
  components: { FileUpload, FailListDialog },
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
        apName: [{ required: true, message: '请输入订单名称', trigger: 'blur' }],
        saleId: [{ required: true, message: '请选择所属销售', trigger: 'blur' }],
        companyId: [{ required: true, message: '请选择公司名称', trigger: 'blur' }],
        brandId: [{ required: true, message: '请选择公司品牌', trigger: 'blur' }],
        contactId: [{ required: true, message: '请选择联系人', trigger: 'blur' }],
        apId: [{ required: true, message: '请先上传Excel', trigger: 'blur' }],
      },
      saleLoading: false,
      saleOptions: [],
      companyOptions: [],
      brandMediaOptions: [],
      brandOptions: [],
      contactOptions: [],
      sessionData: {},
      customerList: [],
      // 失败列表明细
      failList: [],
      // 成功数
      successSize: 0,
      step: 1,
      isSaleRole: true
    }
  },
  computed: {
    uploadParams() {
      const { saleId, apName, brandId, contactId } = this.formData
      return {
        apName,
        // 关联销售
        suID: saleId,
        // 方案隶属广告主(联系人)
        adcID: contactId,
        // 客户品牌id
        bID: brandId
      }
    },
    currentSaleData() {
      if (this.isSaleRole) {
        return {
          customerSrc: this.sessionData.customerSrc
        }
      }
      return this.saleOptions.find(item => item.value === this.formData.saleId) || {}
    }
  },
  methods: {
    /**
     * 输入搜索销售
     */
    async querySearchSale(query) {
      try {
        if (isEmpty(query)) {
          this.saleOptions = []
          this.saleLoading = false
          return
        }
        this.saleLoading = true
        const res = await this.$request.postApi(this.apiVar.UCAPI + "/findBDUserByKeyword", {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          keyword: query,
          kaFlag: true
        })
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.saleOptions = data.map(item => ({
          label: item.realName + "(" + item.sName + ")",
          value: item.uID,
          uType: item.uType,
          customerSrc: item.customerSrc
        }))
      } catch (err) {
        this.saleOptions = []
        console.error('querySearchAsync error:', err)
      } finally {
        this.saleLoading = false
      }
    },

    /**
     * 选择所属销售
     */
    changeSale (val) {
      console.log("changeSale val ===", val)
      this.formData.companyId = ""
      this.formData.brandId = ""
      this.formData.brandMedia = ""
      this.formData.contactId = ""
      if (!val) return
      console.log('changeSale === ', this.currentSaleData)
      // customerSrc 客户数据源：1.adn，2.crm
      if (this.currentSaleData.customerSrc === 2) {
        this.getCrmCustomerCompanySelectList()
      } else {
        this.getAdnCustomerCompanySelectList()
      }
    },

    /**
     * 获取销售crm的客户列表下拉数据
     */
     async getCrmCustomerCompanySelectList() {
      try {
        const res = await this.$api.adPlan.listCustomers({
          uId: this.formData.saleId,
          pageNum: 1,
          pageSize: 9999
        })
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.customerList = Object.freeze(data)
        this.companyOptions = data.map(item => ({
          label: item.cName,
          value: item.cID
        }))
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getCrmCustomerCompanySelectList error:', err)
      }
    },



    /**
     * 获取adn的客户列表下拉数据
     */
    async getAdnCustomerCompanySelectList () {
      try {
        const res = await this.$request.getApi(this.apiVar.Advertisement + "/MyCustomer", {
          uid: this.formData.saleId,
          token: this.sessionData.token,
        })
        const customerList = res.data || []
        const companyList = [], contactList = []
        customerList.forEach((item, i) => {
          let companyObj = {
            label: item.cName,
            value: item.cID,
          }
          let contactObj = {
            label: item.realName,
            value: item.uID,
          }
          contactList.push(contactObj)
          if (i == 0) {
            companyList.push(companyObj)
          } else if (
            companyList.every(c => c.value !== companyObj.value)
          ) {
            companyList.push(companyObj)
          }
        })
        this.customerList = Object.freeze(customerList)
        this.companyOptions = companyList
        this.contactOptions = contactList
      } catch (err) {
        console.error('getAdnCustomerCompanySelectList error:', err)
      }
    },

    /**
     * 选择公司
     */
    changeCompany () {
      this.formData.brandId = ""
      this.formData.brandMedia = ""
      this.formData.contactId = ""
      // customerSrc 客户数据源：1.adn，2.crm
      if (this.currentSaleData.customerSrc === 2) {
        this.getCrmCustomerBrandSelectList()
      } else {
        this.getAdnCustomerBrandSelectList()
      }
    },

    /**
     * 获取 crm 客户公司品牌
     */
    getCrmCustomerBrandSelectList() {
      const item = this.customerList.find(it => it.cID === this.formData.companyId)
      if (!item) return
      this.brandMediaOptions = (item.itemList || []).map(it => {
        return {
          ...it,
          // 可能存在不同媒体类型，同一品牌名称
          label: `${it.bTitle}(${it.mediaType})`,
          value: `${it.bID}_${it.saleProcessId}`
        }
      })
    },

    /**
     * 获取 adn 客户公司品牌
     */
    async getAdnCustomerBrandSelectList() {
      try {
        const { companyId } = this.formData
        if (!companyId) return
        const res = await this.$request.getApi(this.apiVar.Advertisement + "/GetBrand", {
          cid: companyId,
          token: this.sessionData.token
        })
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.brandOptions = data.map(item => ({
          label: item.bTitle,
          value: item.bID,
        }))
        // 处理联系人下拉数据
        this.contactOptions = this.customerList
          .filter(item => item.cID === companyId)
          .map(item => ({
            label: item.realName,
            value: item.uID,
          }))
      } catch (err) {
        console.error('changeCompany error:', err)
      }
    },

    changeBrandMedia() {
      this.formData.contactId = ''
      if (this.formData.brandMedia) {
        this.formData.brandId = Number(this.formData.brandMedia.split('_')[0])
      } else {
        this.formData.brandId = ''
      }
      this.getCrmCustomerContactSelectList()
    },

    changeBrand() {
      this.formData.contactId = ''
    },

    /**
     * 获取销售crm的客户下的联系人列表
     */
     async getCrmCustomerContactSelectList() {
      try {
        const current = this.brandMediaOptions.find(item => item.value === this.formData.brandMedia)
        if (!current) return
        const res = await this.$api.adPlan.listContacts({
          saleProcessId: current.saleProcessId
        })
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.contactOptions = data.map(item => {
          return {
            label: item.realName,
            value: item.uID
          }
        })
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getCrmCustomerContactSelectList error:', err)
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
     * 处理上传结果
     */
    handleUploadRes(res) {
      const { SysCode: code, MSG: message, data } = res.data || {}
      if (code !== 200200) throw new Error(message || '上传失败 code != 200')
      this.failList = data.errorList || []
      this.successSize = data.successSize || 0
      this.formData.apId = data.apId || null
      return ''
    },

    /**
     * 上传成功回调
     */
    uploadSuccess() {
      if (this.failList.length) {
        this.$refs.uploaderRef && this.$refs.uploaderRef.reset()
        this.openFailResultDialog()
        return
      }
    },

     /**
     * 打开处理结果弹窗
     */
     openFailResultDialog() {
      if (!this.failList.length) return
      const successSize = this.successSize
      const list = this.failList
      const columns = [
        {
          title: '资源名称',
          dataIndex: 'resName',
        },
        {
          title: '媒体名称',
          dataIndex: 'mediaName',
        },
        {
          title: '媒体类型',
          dataIndex: 'mediaTypeName',
        },
        {
          title: '投放面',
          dataIndex: 'asLab',
        },
        {
          title: '资产编号',
          dataIndex: 'assetTag',
        },
        {
          title: '所属公司',
          dataIndex: 'companyName',
        },
        {
          title: '城市',
          dataIndex: 'province',
        },
        {
          title: '区域',
          dataIndex: 'district',
        },
        {
          title: '投放排期',
          dataIndex: 'schedule',
        },
        {
          title: '失败原因',
          dataIndex: 'failReason',
        }
      ]
      this.$refs.failListDialogRef && this.$refs.failListDialogRef.open({ list, columns, successSize })
    },

    async handleStep(type) {
      if (type === -1) {
        this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
        this.step--
      } else {
        this.step++
      }
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
      if (this.step === 1) return this.handleStep(1)
      // console.log('onSubmit formData ====', this.formData)
      try {
        this.loading = true
        const res = await this.$api.detecting.addNonSystemItem({
          // 非系统方案id
          nonSystemApId: this.formData.apId,
          // 客户数据源：1.adn，2.crm
          customerSrc: this.sessionData.customerSrc,
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
     * 重置数据
     */
    afterClose() {
      this.isEdit = false
      this.saleLoading = false
      this.saleOptions = []
      this.companyOptions = []
      this.brandMediaOptions = []
      this.brandOptions = []
      this.contactOptions = []
      this.customerList = []
      this.failList = []
      this.successSize = 0
      this.step = 1
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     */
    open() {
      if (this.visible) return
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      if (!this.visible) return
      this.visible = false
    }
  },
  mounted() {
    this.sessionData = sessFun.getSess()
    this.isSaleRole = ["ADN_BD_KA", "ADN_BD"].includes(this.sessionData.uType)
    if (this.isSaleRole) {
      this.formData.saleId = this.sessionData.uID
      this.formData.saleName = this.sessionData.realName
      this.changeSale(this.formData.saleId)
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
