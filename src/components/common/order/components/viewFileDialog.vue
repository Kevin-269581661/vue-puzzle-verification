<template>
  <div class="dialog_container">
    <!-- 查看文件-弹框组件 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${isEdit ? '上传' : '查看'}文件`"
      width="600px"
      @closed="afterClose"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" label-width="120px" size="small" class="form">
            <el-form-item label="文件：" prop="urls">
              <template v-if="formData.urls && formData.urls.length">
                <div v-for="(item, i) in formData.urls" :key="i" class="file_box">
                  <div class="img_icon_box">
                    <i class="el-icon-document file_icon" />
                  </div>
                  <div class="file_name">{{ item.name }}</div>
                  <div class="size_box">{{ (item.size / 1024 / 1024).toFixed(3) }}MB</div>
                  <div v-if="!isEdit" class="action_box">
                    <el-button type="primary" size="mini" @click="handlePreviewFile(item)">
                      查看
                    </el-button>
                    <el-button type="primary" size="mini" @click="handleDownloadFile(item)">
                      下载
                    </el-button>
                  </div>
                </div>
              </template>
              <div v-else class="empty_box">
                <el-button v-if="isEdit" type="primary" @click="handleUploadFile">上传文件</el-button>
                <div v-else class="text">未上传</div>
              </div>
            </el-form-item>

            <el-form-item label="下载链接：" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :maxlength="1000"
                :rows="2"
                :readonly="!isEdit"
                :placeholder="isEdit ? '请输入' : ''"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom_dialog_footer">
          <template v-if="isEdit">
            <el-button @click="close" size="small">取消</el-button>
            <el-button type="primary" @click="handleOk" size="small">确定</el-button>
          </template>
          <el-button v-else @click="close" size="small">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import { ResourceTypeEnum } from '../data'
import { downloadFileByUrl, downloadFileByIframe, previewFile } from '@/utils/common'

let _resourceId = null
let _resourceType = null

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    urls: [],
    remark: ''
  }
}

export default {
  name: 'viewFileDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        // 通用校验
        // remark: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        // urls: [{ required: true, message: '请上传文件', trigger: 'blur' }],
      },
    }
  },
  methods: {
    /**
     * 打开上传弹框
     */
    openUploadFileModal(title, accept, multiple) {
      // Object.assign(uploadFileData, {
      //   ...initUploadFileData(),
      //   title: title || '上传文件',
      //   accept: accept || '',
      //   multiple: multiple || false
      // })
      // uploadFileModalRef.value?.open()
    },
    /**
     * 上传确认
     */
    handleConfirmUpload(fileList) {
      console.log('handleConfirmUpload ===', fileList)
      formData.urls = fileList
    },
    /**
     * 上传文件
     */
    handleUploadFile() {
      switch (_resourceType) {
        // 补充执行要求（.pdf.xls,.xlsx）
        case ResourceTypeEnum.EXECUTE_REQUIRE:
          openUploadFileModal('上传补充执行要求', '.pdf,.xls,.xlsx')
          break
        // 补充资源申请表（.xls,.xlsx）
        case ResourceTypeEnum.RESOURCE_APPLY:
          openUploadFileModal('上传补充资源申请表', '.xls,.xlsx')
          break
        // 补充审核卡（.xls,.xlsx,.jpeg,.jpg,.png,.pdf）
        case ResourceTypeEnum.AUDIT_CARD:
          openUploadFileModal('上传补充审核卡', '.xls,.xlsx,.jpeg,.jpg,.png,.pdf')
          break
        // 补充客户素材
        case ResourceTypeEnum.CUSTOMER_MATERIALS:
          openUploadFileModal('上传补充客户素材', '')
          break
        // 补充客户点位反馈模板
        case ResourceTypeEnum.SPACE_FEEDBACK:
          openUploadFileModal('上传补充客户点位反馈模板', '.xls,.xlsx')
          break
        // 补充客户上刊明细模板
        case ResourceTypeEnum.SK_DETAIL:
          openUploadFileModal('上传补充客户上刊明细模板', '.xls,.xlsx')
          break
        // 补充客户上刊报告模板
        case ResourceTypeEnum.SK_REPORT:
          openUploadFileModal('上传补充客户上刊报告模板', '.ppt,.pptx')
          break
        default:
          break
      }
    },
    /**
     * 查看文件
     */
    handlePreviewFile(item) {
      previewFile(item.url)
    },
    /**
     * 下载文件
     */
    async handleDownloadFile(item) {
      try {
        this.dialogLoading = true
        // await downloadFileByUrl(item.url)
        await downloadFileByIframe(item.url)
      } catch (err) {
        console.error('handleDownloadFile error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 提交表单
     */
    async onSubmit() {
      if (this.dialogLoading) return
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
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
     * 获取详情
     */
    async getDetail() {
      try {
        this.dialogLoading = true
        const res = await this.$api.resource.getFileDetail({ resourceId: _resourceId, type: _resourceType })
        const { SysCode: code, MSG: message, data = {} } = res.data
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        const { remark, urls = [] } = data
        this.formData.remark = remark
        this.formData.urls = urls
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 获取预加载数据
     */
     async getPropTwoOptions() {
      try {
        this.dialogLoading = true
        const res = await this.$request.getApi('/aaaa/bbbb')
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.preparedData.propTwoOptions = data
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 重置数据
     */
    afterClose() {
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
      this.$emit('afterClose')
    },
    /**
     * 打开弹框
     * （弹框打开时调用，一些弹框打开时的初始化处理可以在此方法内进行，譬如：通过 row.id 请求详情...）
     */
    open({
      resourceId,
      resourceType,
      isUpload = false
    }) {
      if (this.visible) return
      this.isEdit = isUpload
      _resourceId = resourceId
      _resourceType = resourceType
      if (!isUpload) this.getDetail()
      this.visible = true
    },
    /**
     * 关闭弹框
     * （可以处理一些收尾操作，如：清除定时器、事件监听等等）
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

.file_box {
  display: flex;
  padding: 15px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #eee;
  position: relative;
  &:hover {
    border-color: #1890ff;
    .action_box {
      display: block;
    }
  }
  .action_box {
    position: absolute;
    right: 15px;
    bottom: 3px;
    display: none;
    /deep/ .el-button {
      min-width: 0;
      height: 24px;
      line-height: 24px;
      padding-left: 8px;
      padding-right: 8px;
      display: inline-flex;
      align-items: center;
    }
  }
  .file_name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  .img_icon_box {
    width: 50px;
    height: 50px;
    margin-right: 20px;
    background: #f5f5f5;
    border-radius: 5px;
    color: #999;
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .size_box {
    margin-left: 20px;
    color: #999;
    font-size: 14px;
  }
}

.empty_box {
  padding: 15px;
  text-align: center;
  .text {
    color: #999;
    margin-bottom: 8px;
  }
}

</style>
