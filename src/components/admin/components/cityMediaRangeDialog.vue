<!-- 城市范围管理-弹框组件 -->
<template>
  <el-dialog
    width="650px"
    append-to-body
    show-close
    title="城市范围管理"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="afterClose"
  >
    <div v-loading="loading" class="dialog_content">
      <div class="custom_dialog_body">
        <!-- 编辑 -->
        <el-form v-if="isEdit" ref="formRef" class="form" label-width="100px" size="small"  :model="formData" :rules="formRules">
          <el-form-item label="编辑城市：" prop="cityList">
              <div class="company_list">
                <div v-for="(item, index) in formData.cityList" :key="index" class="company_item">
                  <!-- 城市 -->
                  <el-select
                    v-model="item.rId"
                    placeholder="请选择城市"
                    filterable
                    clearable
                    @change="handleChangeCity(item, index)"
                  >
                    <el-option
                      v-for="cell in preparedData.applyCityOptions"
                      :key="cell.value"
                      :value="cell.value"
                      :label="cell.label"
                    />
                  </el-select>
                  <!-- 公司 -->
                  <el-select
                    v-model="item.asrId"
                    placeholder="请选择公司"
                    filterable
                    clearable
                    class="company_select"
                    :disabled="!item.rId"
                    @focus="getCompanyByCity(item)"
                  >
                    <el-option
                      v-for="cell in item.asrOptions"
                      :key="cell.value"
                      :value="cell.value"
                      :label="cell.label"
                    />
                  </el-select>
                  <!-- 删除按钮 -->
                  <div class="action_box">
                    <i class="el-icon-close delete_btn" @click="handleClickCompanyRemoveBtn(index)"></i>
                  </div>
                </div>
                <div>
                  <el-button type="primary" @click="handleClickCompanyCreateBtn">添加</el-button>
                </div>
              </div>
            </el-form-item>
        </el-form>

        <!-- 回显 -->
        <el-table v-else border style="width: 100%" :data="formData.cityList">
          <el-table-column prop="rName" label="城市" width="180"></el-table-column>
          <el-table-column prop="asrName" label="公司" ></el-table-column>
        </el-table>
      </div>
      <div class="custom_dialog_footer">
        <el-button size="small" @click="close">关闭</el-button>
        <el-button v-if="isEdit" type="primary" size="small" @click="onSubmit">保存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js"
import { getUniqueId } from '@/utils/common'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    mediaTypeId: null,
    cityList: []
  }
}

/**
 * 初始化投放城市项数据
 */
 const createCompanyItem = () => {
  return {
    // 城市ID
    rId: null,
    rName: '',
    // 公司ID
    asrId: null,
    asrName: '',
    // 公司下拉数据
    asrOptions: [],
    key: getUniqueId(),
  }
}

export default {
  name: 'cityMediaRangeDialog',
  emits: ['submitSuccess', 'afterClose'],
  props: {},
  data() {
    return {
      visible: false,
      loading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        // 特殊校验
        cityList: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value || !value.length) {
                callback(new Error('请选择城市'))
              } else if (
                value.some(
                  (item) => !item.rId || !item.asrId
                )
              ) {
                callback(new Error('请补充完整信息'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      // 预加载数据
      preparedData: {
        applyCityOptions: [],
      },
    }
  },
  methods: {
    /**
     * 点击添加城市按钮
     */
     handleClickCompanyCreateBtn() {
      this.formData.cityList.push(createCompanyItem())
    },

    /**
     * 点击删除城市按钮
     */
    handleClickCompanyRemoveBtn(index) {
      this.formData.cityList.splice(index, 1);
    },

    handleChangeCity(item, index) {
      item.asrId = null
      item.asrName = ''
      item.asrOptions = []
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
        console.log('onSubmit ===', this.formData)
        const { token, uID: uid } = sessFun.getSess()
        const cityList = this.formData.cityList
        .filter((item) => item.rId && item.asrId)
        .map((item) => {
          const { rId, asrId, asrOptions } = item
          const rName = this.preparedData.applyCityOptions.find((c) => c.value === rId).label || null
          const asrName = asrOptions.find((c) => c.value === asrId).label || null
          return {
            rId,
            rName,
            asrId,
            asrName
          }
        })
        this.loading = true
        const res = await this.$api.mediaType.updateCityRel({
          ...this.formData,
          cityList
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
        const res = await this.$api.mediaType.listCityRel({ mediaTypeId: this.formData.mediaTypeId })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        const cityList = (data || []).map(item => ({
          ...item,
          key: getUniqueId(),
          asrOptions: [{
            label: item.asrName,
            value: item.asrId
          }],
        }))
        this.formData = {
          ...this.formData,
          cityList
        }
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getDetail error:', err)
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取城市预加载数据
     */
     async getCityOptions() {
      try {
        const { token, uID: uid } = sessFun.getSess()
        // this.loading = true
        const res = await this.$api.advertisement.getFanganCity({
          uid,
          token,
          suID: uid
        })
        this.preparedData.applyCityOptions = (res.data || []).map(item => ({
          label: item.rName,
          value: item.rID
        }))
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('getCityOptions error:', err)
      } finally {
        // this.loading = false
      }
    },

    /**
     * 根据城市，获取公司下拉
     */
     async getCompanyByCity(item) {
      try {
        const { token, uID: uid } = sessFun.getSess()
        // this.loading = true
        const res = await this.$api.advertisement.getCityAscrList({
          uid,
          token,
          suID: uid,
          cityIds: item.rId
        })
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        item.asrOptions = (data || []).map(item => ({
          label: item.asName,
          value: item.asrID
        }))
      } catch (err) {
        this.$message.error(String(err) || '获取数据失败')
        console.error('handleChangeCity error:', err)
      } finally {
        // this.loading = false
      }
    },

    /**
     * 重置数据
     */
    afterClose() {
      this.isEdit = false
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
      this.$emit('afterClose')
    },

    /**
     * 打开弹框（编辑）
     */
    open(mediaTypeId) {
      if (this.visible) return
      this.visible = true
      this.isEdit = true
      if (mediaTypeId) {
        this.formData = {
          mediaTypeId,
          cityList: [ createCompanyItem() ]
        }
        this.getDetail()
        this.getCityOptions()
      }
    },

    /**
     * 打开弹框（详情）
     */
     openDetail(mediaTypeId) {
      if (this.visible) return
      this.visible = true
      this.isEdit = false
      if (mediaTypeId) {
        this.formData = {
          ...this.formData,
          mediaTypeId
        }
        this.getDetail()
      }
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

.custom_dialog_body {
  max-height: 500px;
  overflow: auto;
}

.company_list {
  .company_item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.company_select {
  margin: 0 10px;
}

.delete_btn {
  color: #F56C6C;
  font-size: 16px;
  cursor: pointer;
}

.form_item_width {
  width: 350px;
}
</style>
