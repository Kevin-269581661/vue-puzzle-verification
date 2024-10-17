<!-- 客户监播-分享设置弹窗 -->
<template>
  <div class="dialog_container">
    <el-dialog
      top="7vh"
      width="710px"
      append-to-body
      show-close
      title="分享设置"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-tabs v-model="currentTabName" tab-position="left" class="tab_box" >

            <el-tab-pane :label="tabList[0].label" :name="tabList[0].name">
              <div v-loading="shareLinkTabData.loading" class="tab_content">
                <div class="tab_content_top">
                  <div class="title_box">分享链接</div>
                </div>
                <div class="form_wrap_box">
                  <el-form
                    ref="formRef"
                    hide-required-asterisk
                    label-position="top"
                    label-width="120px"
                    size="small"
                    class="form"
                    :model="shareLinkTabData.formData"
                    :rules="shareLinkTabData.formRules"
                  >
                    <el-form-item label="访问方式" prop="loginType">
                      <el-radio-group v-model="shareLinkTabData.formData.loginType">
                        <el-radio
                          v-for="item in shareLinkTabData.preparedData.loginTypeOptions"
                          :key="item.value"
                          :label="item.value"
                        >
                          {{ item.label }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item label="有效期" prop="type">
                      <el-radio-group v-model="shareLinkTabData.formData.type" @change="changeShareLinkType">
                          <el-radio
                            v-for="item in shareLinkTabData.preparedData.typeOptions"
                            :key="item.value"
                            :label="item.value"
                          >
                          <span>{{ item.label }}</span>
                          <el-date-picker
                            v-if="item.value === 1 && shareLinkTabData.formData.type === 1"
                            v-model="shareLinkTabData.formData.customDate"
                            :picker-options="shareLinkTabData.datePickerOptions"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            placeholder="选择日期"
                            size="small"
                            style="width: 240px"
                          >
                          </el-date-picker>
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item label="分享链接" prop="shareLink">
                      <el-switch v-model="shareLinkTabData.formData.status" active-text="开" inactive-text="关" class="switch_box"></el-switch>

                      <!-- 手机号访问样式 -->
                      <el-input
                        v-if="shareLinkTabData.formData.loginType === 2"
                        v-model="shareLinkTabData.formData.shareLink"
                        :disabled="!shareLinkTabData.formData.status"
                        placeholder="保存后生成链接"
                        clearable
                        readonly
                        class="form_item_width"
                      >
                        <div slot="append">
                          <el-button
                            type="primary"
                            :disabled="!shareLinkTabData.formData.shareLink || !shareLinkTabData.formData.status"
                            size="small"
                            @click="handleCopyLink">
                            复制链接
                          </el-button>
                        </div>
                      </el-input>
                      <!-- 密码访问样式 -->
                      <template v-else-if="shareLinkTabData.formData.loginType === 1">
                        <el-input
                          v-model="shareLinkTabData.formData.shareLink"
                          :disabled="!shareLinkTabData.formData.status"
                          placeholder="保存后生成链接"
                          clearable
                          readonly
                          class="form_item_width"
                        >
                        </el-input>
                        <div class="code_row form_item_width">
                          <span>密码：</span>
                          <el-input
                            v-model="shareLinkTabData.formData.verificationCode"
                            :disabled="!shareLinkTabData.formData.status"
                            placeholder="密码"
                            clearable
                            readonly
                            style="width: 120px;"
                          >
                          </el-input>
                          <el-button
                            type="primary"
                            size="small"
                            :disabled="!shareLinkTabData.formData.shareLink || !shareLinkTabData.formData.status"
                            @click="handleCopyLink"
                          >
                            复制链接和密码
                          </el-button>
                        </div>
                      </template>
                      <!-- 阻止复制遮罩 -->
                      <div v-if="!shareLinkTabData.formData.status" class="disable_text_select_mask"></div>
                    </el-form-item>

                  </el-form>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane :label="tabList[1].label" :name="tabList[1].name">
              <div class="tab_content">
                <div class="tab_content_top">
                  <div class="title_box">分享用户</div>
                  <el-button type="primary" size="small" @click="createShareUser">新增</el-button>
                </div>
                <div class="table_wrap_box">
                  <el-table :data="shareListTabData.tableList" :loading="shareListTabData.loading" height="100%" style="width: 100%" border size="medium">
                    <el-table-column prop="name" label="用户名" header-align="center" align="center" min-width="190"></el-table-column>
                    <el-table-column prop="phone" label="手机号" header-align="center" align="center" width="190"></el-table-column>
                    <el-table-column label="操作" header-align="center" align="center" width="160">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" style="color: #F56C6C" @click="handleDelete(scope.row, scope.$index)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>

          </el-tabs>
        </div>
        <div class="custom_dialog_footer">
          <el-button size="small" @click="close">关闭</el-button>
          <el-button type="primary" size="small" @click="saveShareConfig">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 新建分享列表用户-组件 -->
    <CreateShareUserDialog
      ref="createShareUserDialogRef"
      :userList="shareListTabData.tableList"
      @submitSuccess="confirmUserForm"
    />
  </div>
</template>

<script>
import CreateShareUserDialog from './createShareUserDialog.vue'
// import dayjs from "dayjs"
import { setClipboardData } from '@/utils/common'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    itemId: null,
    // 分享开启状态
    status: true,
    // 分享类型 1-自定义,2-永久
    type: 2,
    // 手机号登录
    verificationCodeLogin: false,
    // 验证码登录（密码）
    pwdLogin: false,
    // 分享有效期开始时间
    beginDate: '',
    // 订单有效期结束时间
    endDate: '',
    customDate: [],
    // 访问方式
    loginType: 1,
    // 分享链接
    shareLink: '',
    // 链接的验证码（密码）
    verificationCode: '',
    phoneList: []
  }
}
/**
 * 初始化标签项
 */
const initTabList = () => ([
  { label: '分享链接', name: 'shareLink' },
  { label: '分享用户', name: 'shareList' },
])

export default {
  name: 'shareConfigDialog',
  components: { CreateShareUserDialog },
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      currentTabName: initTabList()[0].name,
      tabList: initTabList(),
      // 分享列表tab数据
      shareListTabData: {
        loading: false,
        tableList: [],
        deleteUserIds: []
      },
      // 分享链接tab数据
      shareLinkTabData: {
        loading: false,
        formData: initFormData(),
        formRules: {
          loginType: [{ required: true, message: '请选择访问方式', trigger: 'blur' }],
          type: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请选择有效期'))
                } else if (value === 1 && !this.shareLinkTabData.formData.customDate.length) {
                  callback(new Error('请选择自定义日期'))
                } else {
                  callback()
                }
              }
            }
          ]
        },
        // 预加载数据
        preparedData: {
          loginTypeOptions: [
            { label: '密码访问（统一密码访问）' , value: 1 },
            { label: '手机号访问（用户需要通过手机号和验证码访问）' , value: 2 },
          ],
          typeOptions: [
            { label: '自定义' , value: 1 },
            { label: '永久' , value: 2 },
          ]
        },
        datePickerOptions: {
          // disabledDate: (t) =>  dayjs().isBefore(t, 'day')
        }
      }
    }
  },
  methods: {
    confirmUserForm(data) {
      const index = this.shareListTabData.tableList.findIndex(it => it.phone === data.phone)
      if (index !== -1) {
        this.$set(this.shareListTabData.tableList, index, data)
      } else {
        this.shareListTabData.tableList.push(data)
      }
    },

    /**
     * 复制链接
     */
    async handleCopyLink() {
      try {
        let text = ''
        const { loginType } = this.shareLinkTabData.formData
        const { shareLink, verificationCode } = this.shareLinkTabData.formData
        // 密码访问
        if (loginType === 1) {
          text = `链接：${shareLink}\n密码：${verificationCode}`
        }
        // 手机号访问
        else if (loginType === 2) {
          text = `链接：${shareLink}`
        }
        await setClipboardData(text)
        this.$message.success('已复制到剪切板')
      } catch (err) {
        this.$message.error('复制失败')
      }
    },

    /**
     * 切换有效期
     */
    changeShareLinkType() {
      // 情况自定义日期
      this.shareLinkTabData.formData.customDate = []
    },

     /**
     * 提交分享链接表单
     */
     async saveShareConfig() {
      if (this.dialogLoading) return
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        const { loginType, status, customDate, type } = this.shareLinkTabData.formData
        const params = {
          ...this.shareLinkTabData.formData,
          verificationCodeLogin: loginType === 2 ? 1 : 0,
          pwdLogin: loginType === 1 ? 1 : 0,
          status: status ? 1 : 0
        }
        if (type === 1) {
          params.beginDate = customDate[0]
          params.endDate = customDate[1]
        } else {
          params.beginDate = ''
          params.endDate = ''
        }
        // 新增用户列表(不用输入id)
        params.addUserList = this.shareListTabData.tableList.filter(it => !it.id)
        // 删除用户id
        params.deleteUserIds = this.shareListTabData.deleteUserIds
        // console.log('提交表单 params =====', params)
        this.dialogLoading = true
        const res = await this.$api.detecting.setShareConfig(params)
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('保存成功，链接已生成')
        this.getShareConfig()
        this.$emit('submitSuccess')
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.dialogLoading = false
      }
    },

    /**
     * 获取订单分享配置
     */
    async getShareConfig() {
      try {
        this.dialogLoading = true
        const res = await this.$api.detecting.getShareConfig({ itemId: this.shareLinkTabData.formData.itemId })
        const { SysCode: code, MSG: message, data = {} } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        let loginType = null
        // pwdLogin 账号密码登录 1:开启 0:关闭
        if (data.pwdLogin) {
          loginType = 1
        // verificationCodeLogin 手机验证码登录状态 1:开启 0:关闭
        } else if (data.verificationCodeLogin) {
          loginType = 2
        }
        let customDate = []
        // type 分享类型 1-自定义,2-永久
        if (data.type === 1) {
          customDate = [data.beginDate, data.endDate]
        }
        this.shareLinkTabData.formData = {
          ...this.shareLinkTabData.formData,
          ...data,
          loginType,
          customDate,
          shareLink: data.url,
          status: data.status === 1 ? true : false
        }
        this.shareListTabData.tableList = data.phoneList || []
      } catch (err) {
        this.$message.error(String(err) || '获取订单分享配置数据失败')
        console.error('getShareConfig error:', err)
      } finally {
        this.dialogLoading = false
      }
    },

    /**
     * 新建分享用户
     */
    createShareUser() {
      this.$refs.createShareUserDialogRef && this.$refs.createShareUserDialogRef.open()
    },

    /**
     * 编辑
     */
    handleEdit(row) {
      this.$refs.createShareUserDialogRef && this.$refs.createShareUserDialogRef.open(row)
    },

    async handleDelete(row, index) {
      try {
        await this.$confirm(`是否删除【${ row.name }】，删除后此号码将不允许登录哦~`, "删除提醒", { type: "warning" })
        const { id } = this.shareListTabData.tableList.splice(index, 1)[0]
        if (id) this.shareListTabData.deleteUserIds.push(id)
      } catch (err) {
        console.error('handleDelete error:', err)
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.isEdit = false
      this.dialogLoading = false
      this.currentTabName = initTabList()[0].name
      this.shareListTabData.loading = false
      this.shareListTabData.tableList = []
      this.shareListTabData.deleteUserIds = []
      this.shareLinkTabData.loading = false
      this.shareLinkTabData.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    open(itemId) {
      if (!itemId) return
      if (this.visible) return
      this.visible = true
      this.shareLinkTabData.formData.itemId = itemId
      this.getShareConfig()
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

/deep/ .el-tabs__item.is-active {
  background-color: #E9F7FE;
  border-radius: 4px 0 0 4px;
}

.el-button.el-button--text.el-button--small {
  min-width: 0;
  height: 32px;
  line-height: 32px;
}

.custom_dialog_footer{
  padding: 10px 20px 20px;
}
.custom_dialog_body {
  padding: 8px;
  display: flex;
}

.tab_content {
  padding: 5px;
  width: 570px;
  height: 470px;
  display: flex;
  flex-direction: column;
}

.tab_content_top {
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title_box {
    color: rgba(0, 0, 0, 0.85);
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }
}

.table_wrap_box {
  margin-top: 13px;
  flex: 1;
  overflow: hidden;
  .cell_box {
    height: 100%;
    display: flex;
    align-items: center;
  }
  /deep/ .el-table__body-wrapper {
    min-height: auto;
  }
  /deep/ .el-table__empty-block {
    // height: 100px !important;
  }
}

.form_wrap_box {
  margin-top: 5px;
  flex: 1;
  overflow: auto;
  .switch_box {
    position: absolute;
    left: 220px;
    top: -30px;
    z-index: 10;
  }
  .code_row {
    display: flex;
    margin-top: 14px;
    justify-content: space-between;
  }
  .disable_text_select_mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  /deep/ .el-button {
    padding-left: 12px;
    padding-right: 12px;
  }
  /deep/ .el-button.is-disabled {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
    background-color: #FAFAFA;
    border-color: rgba(0,0,0,0.15);
  }
  /deep/ .el-form-item__label {
    padding: 0;
    color: rgba(0, 0, 0, 0.85);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  /deep/ .el-form-item {
    margin-bottom: 24px;
  }
  /deep/ .el-form-item:not(:first-child) {
    border-top: 1px solid #E9E9E9;
    padding-top: 12px;
  }
  /deep/ .el-radio {
    display: block;
    line-height: 32px;
  }
  /deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #606266;
  }
  // /deep/ .el-input-group__append, .el-input-group__prepend {
  //   color: #fff;
  //   background-color: #1890FF;
  //   border-color: #1890FF;
  //   border: 1px solid #1890FF;
  // }
  /deep/ .el-input-group__append button.el-button {
    color: #fff;
    background-color: #1890FF;
    border-color: #1890FF;
    border: 1px solid #1890FF;
    border-radius: 0 4px 4px 0;
  }
  /deep/ .el-input-group__append .el-button.is-disabled {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
    background-color: #FAFAFA;
    border-top: 1px solid rgba(0,0,0,0.15);
    border-bottom: 0;
    border-left: 0;
    border-right: 0;
  }
  /deep/ .el-input__inner[disabled] {
    user-select: none;
  }
}

.sheet_wrap_box {
  margin-top: 5px;
  flex: 1;
  overflow: auto;
  .cell_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cell_box_left {
    flex: 1;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.85);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }
}

.form_item_width {
  width: 308px;
}

</style>
