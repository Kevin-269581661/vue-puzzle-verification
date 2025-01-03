<!-- 订单/方案详情-导出点位明细-弹框组件 -->
<template>
  <div>
    <el-dialog
      top="8vh"
      width="700px"
      append-to-body
      show-close
      title="导出点位明细"
      :visible.sync="visible"
      :close-on-click-modal="false"
      @closed="afterClose"
    >
      <template slot="title">
        <div class="dialog_header">
          <span style="margin-right: auto">导出点位明细</span>

          <el-select
            v-model="collectSelection"
            placeholder="选择模板"
            size="mini"
            filterable
            clearable
            style="width: 180px"
            @change="collectChange"
          >
            <el-option
              v-for="item in collectList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </div>
      </template>

      <div v-loading="loading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form
            ref="formRef"
            label-position="top"
            size="small"
            class="form"
            label-width="100%"
            :model="formData"
            :rules="formRules"
          >
            <el-form-item label="导出字段选择：" prop="field">
              <div class="drop_transform_warpper">
                <div class="drop_card part_left">
                  <div class="card_header">未选择</div>
                  <div class="drop_list">
                    <Draggable
                      v-model="formData.notSelectedList"
                      handle=".drop_item"
                      group="export_point_dropper"
                      animation="300"
                      ghostClass="ghost"
                      style="height: 100%"
                      :forceFallback="true"
                      :scroll="true"
                    >
                      <div
                        v-for="(item, i) in formData.notSelectedList"
                        class="drop_item"
                        :key="item.key"
                      >
                        <span class="text" :title="item.name">{{ item.name }}</span>
                        <span class="el-icon-right icon add" @click="handleAction('add', i)"></span>
                      </div>
                    </Draggable>
                  </div>
                </div>

                <div class="drop_card part_right">
                  <div class="card_header">已选择</div>
                  <div class="drop_list">
                    <Draggable
                      v-model="formData.hasSelectedList"
                      handle=".drop_item"
                      group="export_point_dropper"
                      animation="300"
                      ghostClass="ghost"
                      style="height: 100%"
                      :forceFallback="true"
                      :scroll="true"
                    >
                      <div
                        v-for="(item, i) in formData.hasSelectedList"
                        class="drop_item selected"
                        :key="item.key"
                      >
                        <span class="text" :title="item.name">{{ item.name }}</span>
                        <span
                          class="el-icon-close icon delete"
                          @click="handleAction('delete', i)"
                        ></span>
                      </div>
                    </Draggable>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div class="custom_dialog_footer">
          <div class="footer_left">
            <span class="btn_box" @click="handleCollect">
              <i class="el-icon-star-off"></i>
              收藏为模板
            </span>
            <span class="btn_box" @click="openCollectTableDialog">收藏列表</span>
          </div>
          <el-button @click="close" size="small">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="small">确 定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 收藏列表 -->
    <CollectExportPointDialog
      ref="collectExportPointDialogRef"
      :collectList="collectList"
      @getCollectList="getCollectList"
    />

    <!-- 城市选择-弹框组件 -->
    <ExportOrderCitySelectDialog
      ref="exportOrderCitySelectDialogRef"
      :cityList="cityList"
      @submitSuccess="confirmSelectCity"
    />
  </div>
</template>

<script>
import sessFun from '../../../../commonFun/sessFun.js'
import CollectExportPointDialog from './collectExportPointDialog.vue'
import ExportOrderCitySelectDialog from './exportOrderCitySelectDialog.vue'
import Draggable from 'vuedraggable'
// import { downLoadFileByRes } from '@/utils/downLoadUtil'
import FileSaver from 'file-saver'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    name: '',
    apId: null,
    // 未选中
    notSelectedList: [],
    // 已选中
    hasSelectedList: []
  }
}

export default {
  name: 'exportPointDetailDialog',
  components: {
    CollectExportPointDialog,
    ExportOrderCitySelectDialog,
    Draggable
  },
  emits: ['submitSuccess', 'afterClose'],
  data() {
    return {
      visible: false,
      loading: false,
      formData: initFormData(),
      formRules: {
        // 特殊校验
        field: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let { hasSelectedList } = this.formData
              if (!hasSelectedList || !hasSelectedList.length) {
                callback(new Error('请选择导出字段'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      // 收藏列表
      collectList: [],
      collectSelection: null,
      cityList: [
        // { id: 1, name: '广州1' },
        // { id: 2, name: '广州2' },
        // { id: 3, name: '广州3' },
        // { id: 4, name: '广州4' },
        // { id: 5, name: '广州5' },
        // { id: 6, name: '广州6' },
        // { id: 7, name: '广州7' },
        // { id: 8, name: '广州8' },
        // { id: 9, name: '广州9' }
      ]
    }
  },
  methods: {
    handleAction(type, index) {
      let item = null
      switch (type) {
        case 'add':
          item = this.formData.notSelectedList.splice(index, 1)[0]
          if (item) this.formData.hasSelectedList.push(item)
          break
        case 'delete':
          item = this.formData.hasSelectedList.splice(index, 1)[0]
          if (item) this.formData.notSelectedList.push(item)
          break
        default:
      }
    },

    /**
     * 提交
     */
    async onSubmit() {
      // this.$refs.exportOrderCitySelectDialogRef && this.$refs.exportOrderCitySelectDialogRef.open()
      // return

      if (this.loading) return
      console.log('onSubmit formData ===', this.formData)
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        this.loading = true
        // 不是是全国媒介、ka销售角色，直接走导出
        if (!['ADN_MD_COUNTRY', 'ADN_BD_KA'].includes(sessFun.getSess().uType)) {
          return await this.exportToExcel(this.formData.apId)
        }
        // 全国媒介、ka销售角色，获取所有区域子单
        const res = await this.$api.adPlan.listChildInfos({ apId: this.formData.apId })
        const { SysCode: code, MSG: message, data } = res.data || {}
        // 单个子单，直接走导出
        if (!data || !data.length) {
          return await this.exportToExcel(this.formData.apId)
        }
        this.cityList = data
        // 多个子单，打开选择框
        this.$refs.exportOrderCitySelectDialogRef &&
          this.$refs.exportOrderCitySelectDialogRef.open()
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('onSubmit error:', err)
      } finally {
        this.loading = false
      }
    },

    async confirmSelectCity({ type, regionIds }) {
      try {
        this.loading = true
        // type: 1 仅当前订单; 2 按城市导出
        if (type === 1) {
          await this.exportToExcel(this.formData.apId)
        } else {
          await this.exportToExcel(null, regionIds)
        }
      } catch (err) {
        this.$message.error(String(err) || '操作失败')
        console.error('confirmSelectCity error:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * 导出表格
     */
    async exportToExcel(apId = null, apIds = []) {
      // 增加排序字段 sort（后端要求）
      const selectedFields = this.formData.hasSelectedList.map((item, i) => ({
        ...item,
        sort: i + 1
      }))
      const res = await this.$api.adPlan.exportSpaces({
        apName: this.formData.name,
        selectedFields,
        // 方案ids(按城市导出时传)
        apIds,
        // 方案id(仅当前订单时传)
        apId
      })
      // await downLoadFileByRes(res)
      await FileSaver.saveAs(res)
      this.$message.success('导出成功')
      this.$emit('submitSuccess')
      this.close()
    },

    /**
     * 添加收藏
     */
    async handleCollect() {
      try {
        const { value: name } = await this.$prompt('请输入模板名称', '提示', {
          inputPattern: /.+/,
          inputErrorMessage: '请输入模板名称'
        })
        console.log('handleCollect name ===', name)
        this.loading = true
        const { apId, hasSelectedList } = this.formData
        // 增加排序字段 sort（后端要求）
        const selectedFields = hasSelectedList.map((item, i) => ({ ...item, sort: i + 1 }))
        const res = await this.$api.adPlan.saveSpaceExportTemplate({ apId, selectedFields, name })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('收藏成功')
        this.getCollectList({})
      } catch (err) {
        console.error('handleCollect error: ', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * 打开收藏列表
     */
    openCollectTableDialog() {
      this.$refs.collectExportPointDialogRef && this.$refs.collectExportPointDialogRef.open()
    },

    /**
     * 获取收藏列表
     */
    async getCollectList({ onComplete }, isInit = false) {
      try {
        this.loading = true
        const res = await this.$api.adPlan.listSpaceExportTemplates({
          apId: this.formData.apId
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        const collectList = []
        ;(data || []).forEach((item) => {
          if (item.id) {
            collectList.push(item)
          } else if (!item.id && isInit) {
            // 默认初始值
            this.formData.notSelectedList = item.unselectedFields ? [...item.unselectedFields] : []
            this.formData.hasSelectedList = item.selectedFields ? [...item.selectedFields] : []
          }
        })
        this.collectList = collectList
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getCollectList error:', err)
      } finally {
        this.loading = false
        onComplete && onComplete()
      }
    },

    /**
     * 选择模板
     */
    async collectChange(val) {
      if (!val) return
      try {
        const current = this.collectList.find((item) => item.id === val)
        if (!current) return
        const { selectedFields, unselectedFields } = current
        this.formData.notSelectedList = unselectedFields ? [...unselectedFields] : []
        this.formData.hasSelectedList = selectedFields ? [...selectedFields] : []
      } catch (err) {
        console.error('collectChange error:', err)
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.formData = initFormData()
      this.collectList = []
      this.collectSelection = null
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
      this.$emit('afterClose')
    },

    /**
     * 打开弹框
     */
    open(row) {
      if (this.visible) return
      this.visible = true
      if (row) {
        const { apId, name } = row
        this.formData.apId = apId
        this.formData.name = name
        this.getCollectList({}, true)
      }
    },

    /**
     * 关闭弹框
     */
    close() {
      if (!this.visible) return
      this.visible = false
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0;
}

.form /deep/ .el-form-item__error {
  padding-top: 8px;
}

.dialog_header {
  display: flex;
  align-items: center;
  padding-right: 36px;
}

.custom_dialog_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .footer_left {
    margin-right: auto;
  }
  .btn_box {
    cursor: pointer;
    & + .btn_box {
      margin-left: 20px;
    }
  }
}

.drop_transform_warpper {
  display: flex;
  justify-content: space-around;
  height: 500px;
  width: 600px;
  margin: 0 auto;
  .drop_card {
    width: 40%;
    height: 100%;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }
  .card_header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #ebeef5;
  }
  .drop_list {
    flex: 1;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden auto;
    .drop_item {
      width: 100%;
      height: 28px;
      padding: 0 30px 0 10px;
      border: 1px solid #f4f4f4;
      border-radius: 4px;
      margin-bottom: 10px;
      background-color: #f4f4f4;
      position: relative;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      user-select: none;
      &:last-child {
        margin-bottom: 0;
      }
      &:hover .icon {
        display: block;
      }
      &.selected {
        color: #409eff;
        border-color: #d9ecff;
        background-color: #ecf5ff;
      }
      &.ghost {
        opacity: 0;
      }
      .text {
        flex: 1;
        line-height: 28px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .icon {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        cursor: pointer;
        display: none;
        &.add {
          color: #409eff;
        }
        &.delete {
          color: #f56c6c;
        }
      }
    }
  }
}
</style>
