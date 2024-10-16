<!-- 客户监播-分享设置弹窗 -->
<template>
  <div class="dialog_container">
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="分享设置"
      width="710px"
      @closed="close"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-tabs v-model="currentTabName" tab-position="left" class="tab_box" >

            <el-tab-pane v-if="isPublishedLink" :label="tabList[0].label" :name="tabList[0].name">
              <div class="tab_content">
                <div class="tab_content_top">
                  <div class="title_box">分享列表</div>
                  <el-button type="primary" size="small" @click="createShareUser">新增</el-button>
                </div>
                <div class="table_wrap_box">
                  <el-table :data="shareListTabData.tableList" :loading="shareListTabData.loading" height="100%" style="width: 100%" border size="medium">
                    <el-table-column prop="name" label="用户名" width="190"></el-table-column>
                    <el-table-column prop="phone" label="手机号" width="190"></el-table-column>
                    <el-table-column label="操作" >
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="toggleDisable(scope.row)">
                          <!-- enable: 1 启用，0 禁用 -->
                          {{ scope.row.enable ? '禁用' : '启用' }}
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <!-- 暂不做分页 -->
                <!-- <div class="pagination_wrapper">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-page.sync="shareListTabData.pagination.page"
                    :page-size="shareListTabData.pagination.pageSize"
                    :total="shareListTabData.pagination.total"
                    @current-change="(v) => pageChange(v, 'shareListTabData')"
                  >
                  </el-pagination>
                </div> -->
              </div>
            </el-tab-pane>

            <el-tab-pane v-if="isPublishedLink" :label="tabList[1].label" :name="tabList[1].name">
              <div class="tab_content">
                <div class="tab_content_top">
                  <div class="title_box">申请列表</div>
                </div>
                <div class="table_wrap_box">
                  <el-table :data="applyListTabData.tableList" height="100%" style="width: 100%" border size="medium">
                    <el-table-column prop="name" label="用户名" width="140"></el-table-column>
                    <el-table-column prop="phone" label="手机号" width="140"></el-table-column>
                    <el-table-column prop="status" label="状态" width="140">
                      <template slot-scope="scope">
                        <!-- status: 0 未审，1 通过，-1 拒绝 -->
                        <div class="cell_box">
                          <el-tag v-if="scope.row.status === 0" type="warning" size="medium" >待处理</el-tag>
                          <el-tag v-else-if="scope.row.status === 1" type="success" size="medium" >已通过</el-tag>
                          <el-tag v-else-if="scope.row.status === -1" type="danger" size="medium" >已拒绝</el-tag>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" >
                      <template slot-scope="scope">
                        <!-- status: 0 未审，1 通过，-1 拒绝 -->
                        <template v-if="scope.row.status === 0">
                          <el-button type="text" size="small" @click="handleAuth(scope.row, 1)">通过</el-button>
                          <el-button type="text" size="small" @click="handleAuth(scope.row, -1)">拒绝</el-button>
                        </template>
                        <span v-else>--</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <!-- <div class="pagination_wrapper">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :current-page.sync="applyListTabData.pagination.page"
                    :page-size="applyListTabData.pagination.pageSize"
                    :total="applyListTabData.pagination.total"
                    @current-change="(v) => pageChange(v, 'applyListTabData')"
                  >
                  </el-pagination>
                </div> -->
              </div>
            </el-tab-pane>

            <el-tab-pane :label="tabList[2].label" :name="tabList[2].name">
              <div v-loading="shareLinkTabData.loading" class="tab_content">
                <div class="tab_content_top">
                  <div class="title_box">分享链接</div>
                </div>
                <div class="form_wrap_box">
                  <el-form
                    ref="formRef"
                    :model="shareLinkTabData.formData"
                    :rules="shareLinkTabData.formRules"
                    hide-required-asterisk
                    label-position="top"
                    label-width="120px"
                    size="small"
                    class="form"
                  >
                    <el-form-item label="分享名称" prop="name">
                      <el-input v-model.trim="shareLinkTabData.formData.name" placeholder="请输入" :maxlength="30" clearable class="form_item_width"></el-input>
                    </el-form-item>

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
                            v-if="item.value === 2 && shareLinkTabData.formData.type === 2"
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

            <!-- 暂不做 -->
            <!-- <el-tab-pane :label="tabList[3].label" :name="tabList[3].name">
              <div class="tab_content">
                <div class="tab_content_top">
                  <div class="title_box">数据修改</div>
                </div>
                <div class="sheet_wrap_box">
                  <div class="cell_box">
                    <div class="cell_box_left">订单整体开门数据提升20%</div>
                    <el-switch v-model="shareLinkTabData.formData.isOpen" active-text="开" inactive-text="关" class="switch_box"></el-switch>
                  </div>
                </div>
              </div>
            </el-tab-pane> -->
          </el-tabs>
        </div>
        <div class="custom_dialog_footer">
          <el-button v-if="currentTabName === tabList[2].name" type="primary" size="small" @click="saveShareConfig">保存</el-button>
          <el-button @click="close" size="small">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 新建分享列表用户-组件 -->
    <CreateShareUserDialog ref="createShareUserDialogRef" @submitSuccess="getShareTableList" />
  </div>
</template>

<script>
// import { cloneDeep } from "lodash";
import sessFun from "@/commonFun/sessFun.js";
import CreateShareUserDialog from './createShareUserDialog.vue'
import dayjs from "dayjs";
import { setClipboardData, getUrlParams } from '@/utils/common'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    // 分享名称
    name: '',
    // 手机号登录
    mobileLogin: false,
    // 验证码登录（密码）
    verificationCodeLogin: false,
    // 订单ID
    apId: null,
    // 分享类型 1：跟随订单排期 2:自定义 3:永久
    type: 3,
    // 分享开启状态 1:开启 0:关闭
    status: true,
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
    verificationCode: ''
  }
}
/**
 * 初始化标签项
 */
const initTabList = () => ([
  { label: '分享列表', name: 'shareList' },
  { label: '申请列表', name: 'applyList' },
  { label: '分享链接', name: 'shareLink' },
  // { label: '数据修改', name: 'dataUpdate' },
])

export default {
  name: 'shareConfigDialog',
  components: { CreateShareUserDialog },
  emits: ['submitSuccess', 'close'],
  props: {},
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      currentTabName: initTabList()[2].name,
      tabList: initTabList(),
      // 分享列表tab数据
      shareListTabData: {
        loading: false,
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
      },
      // 申请列表tab数据
      applyListTabData: {
        loading: false,
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
      },
      // 分享链接tab数据
      shareLinkTabData: {
        loading: false,
        formData: initFormData(),
        formRules: {
          name: [{ required: true, message: '请输入分享名称', trigger: 'blur' }],
          loginType: [{ required: true, message: '请选择访问方式', trigger: 'blur' }],
          type: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value) {
                  callback(new Error('请选择有效期'))
                } else if (value === 2 && !this.shareLinkTabData.formData.customDate.length) {
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
            { label: '永久' , value: 3 },
            { label: '跟随订单排期' , value: 1 },
            { label: '自定义' , value: 2 },
          ]
        },
        datePickerOptions: {
          // disabledDate: (t) =>  dayjs().isBefore(t, 'day')
        }
      },
      // 数据修改 tab
      dataUpdateTabData: {
        isAdd: false
      }
    }
  },
  computed: {
    isPublishedLink() {
      return !!this.shareLinkTabData.formData.shareLink
    }
  },
  watch: {
    isPublishedLink(newVal) {
      if (newVal) {
        this.currentTabName = initTabList()[0].name
      } else {
        this.currentTabName = initTabList()[2].name
      }
    },
    currentTabName(newVal) {
      switch (newVal) {
        case this.tabList[0].name:
          this.getShareTableList()
        break
        case this.tabList[1].name:
          this.getApplyTableList()
        break
        case this.tabList[2].name:
          this.getShareConfig()
        break
        // case this.tabList[3].name:

        // break
      }
    }
  },
  methods: {
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
      if (this.shareLinkTabData.loading) return
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
          verificationCodeLogin: loginType === 1,
          mobileLogin: loginType === 2,
          status: status ? 1 : 0
        }
        if (type === 2) {
          params.beginDate = customDate[0]
          params.endDate = customDate[1]
        } else {
          params.beginDate = ''
          params.endDate = ''
        }
        // console.log('提交表单 params =====', params)
        this.shareLinkTabData.loading = true
        const res = await this.$request.postApi_json('/addsp/api/v1/share/admin/config/save', params)
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return this.$message.error(message || '操作失败')
        // 生成链接
        this.shareLinkTabData.formData.shareLink = data.url
        this.shareLinkTabData.formData.verificationCode = data.code
        this.$message.success('保存成功，链接已生成')
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.shareLinkTabData.loading = false
      }
    },
    /**
     * 获取订单分享配置
     */
    async getShareConfig() {
      try {
        const apId = this.shareLinkTabData.formData.apId
        if (!apId) return
        this.shareLinkTabData.loading = true
        const res = await this.$request.getApi('/addsp/api/v1/share/admin/getShareConfig', { apId })
        const { SysCode: code, MSG: message, data = {} } = res.data
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        let loginType = null
        if (data.verificationCodeLogin) {
          loginType = 1
        } else if (data.mobileLogin) {
          loginType = 2
        }
        let customDate = []
        if (data.type === 2) {
          customDate = [data.beginDate, data.endDate]
        }
        this.shareLinkTabData.formData = {
          ...this.shareLinkTabData.formData,
          ...data,
          loginType,
          customDate,
          shareLink: data.url,
          verificationCode: data.verificationCode,
          status: data.status === 1 ? true : false
        }
      } catch (err) {
        this.$message.error(String(err) || '获取订单分享配置数据失败')
        console.error('getShareConfig error:', err)
      } finally {
        this.shareLinkTabData.loading = false
      }
    },
    /**
     * 审核用户
     */
    async handleAuth(row, status) {
      await this.$confirm(`确定要${ status === 1 ? '通过': '拒绝'}【${row.name}】吗？`, "温馨提示", { type: "warning" })
      try {
        this.applyListTabData.loading = true
        let requestUrl = ''
        if (status === 1) {
          requestUrl = `/addsp/api/v1/share/admin/user/${row.id}/pass`
        } else {
          requestUrl = `/addsp/api/v1/share/admin/user/${row.id}/reject`
        }
        const res = await this.$request.postApi_json(requestUrl)
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.getApplyTableList()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('handleAuth error:', err)
      } finally {
        this.applyListTabData.loading = false
      }
    },
    /**
     * 分页-页数改变
     */
    //  pageChange (page, type) {},
    /**
     * 新建分享用户
     */
    createShareUser() {
      const { apId, shareLink } = this.shareLinkTabData.formData
      // 必须先保存并生成了链接才能创建分享用户
      let code = ''
      if (shareLink) {
        code = getUrlParams(shareLink).code
      }
      if (!code) {
        this.$message.warning('请先发布链接再创建分享用户')
        return
      }
      this.$refs.createShareUserDialogRef && this.$refs.createShareUserDialogRef.open({ apId, code })
    },
    /**
     * 获取分享用户列表
     */
    async getShareTableList() {
      try {
        const apId = this.shareLinkTabData.formData.apId
        this.shareListTabData.loading = true
        const res = await this.$request.getApi('/addsp/api/v1/share/admin/user/listNormalUser', { apId })
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '获取分享用户列表数据失败')
        this.shareListTabData.tableList = data
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getShareTableList error:', err)
      } finally {
        this.shareListTabData.loading = false
      }
    },
    /**
     * 获取未审核用户列表(包含拒绝用户)
     */
    async getApplyTableList() {
      try {
        const apId = this.shareLinkTabData.formData.apId
        this.applyListTabData.loading = true
        const res = await this.$request.getApi('/addsp/api/v1/share/admin/user/listNotAuditUser', { apId })
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '获取未审核用户列表数据失败')
        this.applyListTabData.tableList = data
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getApplyTableList error:', err)
      } finally {
        this.applyListTabData.loading = false
      }
    },
    /**
     * 是否设置禁用
     */
    async toggleDisable(row) {
      await this.$confirm(`确定要${ row.enable ? '禁用': '启用'}【${row.name}】吗？`, "温馨提示", { type: "warning" })
      try {
        this.shareListTabData.loading = true
        let requestUrl = ''
        if (row.enable) {
          requestUrl = `/addsp/api/v1/share/admin/user/${row.id}/disable`
        } else {
          requestUrl = `/addsp/api/v1/share/admin/user/${row.id}/enable`
        }
        const res = await this.$request.postApi_json(requestUrl)
        const { SysCode: code, MSG: message, data = [] } = res.data
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.getShareTableList()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('toggleDisable error:', err)
      } finally {
        this.shareListTabData.loading = false
      }
    },
    /**
     * 编辑
     */
    handleEdit(row) {
      console.log('handleEdit row ====', row)
      const { apId, shareLink } = this.shareLinkTabData.formData
      // 必须先保存并生成了链接才能创建分享用户
      let code = getUrlParams(shareLink).code
      this.$refs.createShareUserDialogRef && this.$refs.createShareUserDialogRef.open({ apId, code, ...row })
    },
    /**
     * 重置数据
     */
    handleReset() {
      this.dialogLoading = false
      this.currentTabName = initTabList()[2].name
      this.shareListTabData.loading = false
      this.shareListTabData.tableList = []
      this.applyListTabData.loading = false
      this.applyListTabData.tableList = []
      this.shareLinkTabData.loading = false
      this.shareLinkTabData.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
    },
    /**
     * 打开弹框
     * （弹框打开时调用，一些弹框打开时的初始化处理可以在此方法内进行，譬如：通过 row.id 请求详情...）
     */
    open(apId) {
      if (!apId) return
      this.handleReset()
      this.shareLinkTabData.formData.apId = apId
      this.getShareConfig()
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      if (this.visible) {
        this.$emit('close')
        this.visible = false
      }
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
  height: 425px;
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
    top: -25px;
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
