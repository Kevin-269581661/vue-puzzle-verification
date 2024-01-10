<template>
  <div class="dialog_container">
    <!-- 全国单-创建计划-弹窗 -->
    <el-dialog
      :visible.sync="visible"
      :append-to-body="true"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="`${isEdit ? '编辑' : '新建'}资源计划`"
      width="800px"
      @closed="close"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" size="small" class="form">

            <el-form-item label="项目名称：" prop="name">
              <el-input v-model.trim="formData.name" placeholder="请输入" clearable :maxlength="100"></el-input>
            </el-form-item>

            <el-form-item label="客户公司：" prop="customerCompanyId">
              <el-select v-model="formData.customerCompanyId" placeholder="请选择" filterable clearable class="form_item_width">
                <el-option
                  v-for="item in preparedData.customerCompanyIdOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="客户品牌：" prop="customerBrandId">
              <el-select v-model="formData.customerBrandId" placeholder="请选择" filterable clearable class="form_item_width">
                <el-option
                  v-for="item in preparedData.customerBrandIdOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="投放日期：" prop="publishDateRange">
              <el-date-picker
                v-model="formData.publishDateRange"
                :picker-options="publishDatePickerOptions"
                clearable
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                placeholder="选择日期"
                size="small"
                class="form_item_width"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="申请人：" prop="applyBy">
              <el-input v-model.trim="formData.applyBy" placeholder="请输入" clearable :maxlength="100"></el-input>
            </el-form-item>

            <el-form-item label="申请城市：" prop="applyCity">
              <el-select v-model="formData.applyCity" placeholder="请选择" filterable clearable class="form_item_width">
                <el-option
                  v-for="item in preparedData.applyCityOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="申请公司：" prop="applyCompanyId">
              <el-select v-model="formData.applyCompanyId" placeholder="请选择" filterable clearable class="form_item_width">
                <el-option
                  v-for="item in preparedData.applyCompanyIdOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="反馈时间：" prop="feedbackTime">
              <el-date-picker
                v-model="formData.feedbackTime"
                :picker-options="feedbackTimeDatePickerOptions"
                clearable
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                size="small"
                class="form_item_width"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="是否可提前上画：" prop="isPreSk">
              <el-radio-group v-model="formData.isPreSk">
                  <el-radio
                    v-for="item in preparedData.isPreSkOptions"
                    :key="item.value"
                    :label="item.value"
                  >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="是否锁点：" prop="isLock">
              <el-radio-group v-model="formData.isLock">
                  <el-radio
                    v-for="item in preparedData.isLockOptions"
                    :key="item.value"
                    :label="item.value"
                  >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="负责AE：" prop="followBy">
              <el-input v-model.trim="formData.followBy" placeholder="请输入" clearable :maxlength="100"></el-input>
            </el-form-item>

            <el-form-item label="选点需求说明：" prop="specification">
              <el-input type="textarea" v-model.trim="formData.specification" placeholder="请输入" clearable :maxlength="1000"></el-input>
            </el-form-item>

            <el-form-item label="投放城市：" prop="companyList">
              <div class="company_list">
                <div v-for="(item, index) in formData.companyList" :key="item.key" class="company_item">
                  <el-select v-model="item.city" placeholder="请选择城市" filterable clearable>
                    <el-option
                      v-for="cell in preparedData.applyCityOptions"
                      :key="cell.value"
                      :value="cell.value"
                      :label="cell.label"
                    />
                  </el-select>
                  <el-select v-model="item.companyId" placeholder="请选择公司" filterable clearable class="company_select">
                    <el-option
                      v-for="cell in preparedData.applyCompanyIdOptions"
                      :key="cell.value"
                      :value="cell.value"
                      :label="cell.label"
                    />
                  </el-select>
                  <el-input v-model.trim="item.launchNum" placeholder="发布面数" clearable :maxlength="10" style="width: 120px"></el-input>
                  <div class="action_box">
                    <el-button v-if="index === 0" type="text" @click="handleClickCompanyCreateBtn">添加</el-button>
                    <el-button v-else type="text" @click="handleClickCompanyRemoveBtn(index)" class="delete_btn">删除</el-button>
                  </div>
                </div>
              </div>
              <!-- <el-button type="primary" size="small" @click="handleClickCompanyCreateBtn">添加</el-button> -->
            </el-form-item>

            <el-form-item label="锁点返表类型：" prop="lockPointFormType">
              <el-radio-group v-model="formData.lockPointFormType">
                  <el-radio
                    v-for="item in preparedData.lockPointFormTypeOptions"
                    :key="item.value"
                    :label="item.value"
                  >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="上刊返表类型：" prop="skFormType">
              <el-radio-group v-model="formData.skFormType">
                  <el-radio
                    v-for="item in preparedData.skFormTypeOptions"
                    :key="item.value"
                    :label="item.value"
                  >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="售卖模式：" prop="saleMode">
              <el-radio-group v-model="formData.saleMode">
                  <el-radio
                    v-for="item in preparedData.saleModeOptions"
                    :key="item.value"
                    :label="item.value"
                  >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

          </el-form>
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

// import { cloneDeep } from "lodash";
import dayjs from "dayjs"
import sessFun from "@/commonFun/sessFun.js";
import { getUniqueId } from '@/utils/common'

/**
 * 初始化表单（提交）数据
 */
const initFormData = () => {
  return {
    id: null,
    // 项目名称
    name: '',
    // 客户公司id
    customerCompanyId: null,
    // 客户品牌id
    customerBrandId: null,
    // 投放时间
    publishDateRange: [],
    // 投放开始时间
    startTime: null,
    // 投放结束时间
    endTime: null,
    // 申请人id
    applyBy: null,
    // 负责ae
    followBy: null,
    // 申请公司id
    applyCompanyId: null,
    // 申请城市id
    applyCity: null,
    // 反馈时间
    feedbackTime: null,
    // 是否可提前上画：0否 1是
    isPreSk: 0,
    // 是否锁点：0否 1是
    isLock: 0,
    // 售卖模式:0:传统售卖,1:cpm售卖模式
    saleMode: 0,
    // 需求说明
    specification: '',
    // 锁点返表类型:1.系统模板,2客户模板
    lockPointFormType: 1,
    // 上刊返表类型:1.系统模板,2客户模板
    skFormType: 1,
    // 投放城市
    companyList: [
      createCompanyItem()
    ],
  }
}

/**
 * 初始化投放城市项数据
 */
const createCompanyItem = () => {
  return {
    city: '',
    companyId: '',
    launchNum: '',
    key: getUniqueId(),
  }
}

export default {
  name: 'nationalOrderFormDialog',
  emits: ['submitSuccess', 'close'],
  props: {},
  data() {
    return {
      visible: false,
      dialogLoading: false,
      isEdit: false,
      formData: initFormData(),
      formRules: {
        // 通用校验
        name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        customerCompanyId: [{ required: true, message: '请选择客户公司', trigger: 'blur' }],
        customerBrandId: [{ required: true, message: '请选择客户品牌', trigger: 'blur' }],
        publishDateRange: [{ required: true, message: '请选择投放日期', trigger: 'blur' }],
        applyBy: [{ required: true, message: '请选择申请人', trigger: 'blur' }],
        applyCity: [{ required: true, message: '请选择申请城市', trigger: 'blur' }],
        applyCompanyId: [{ required: true, message: '请选择申请公司', trigger: 'blur' }],
        feedbackTime: [{ required: true, message: '请选择反馈时间', trigger: 'blur' }],
        isPreSk: [{ required: true, message: '请选择是否可提前上画', trigger: 'blur' }],
        isLock: [{ required: true, message: '请选择是否锁点', trigger: 'blur' }],
        followBy: [{ required: true, message: '请选择负责AE', trigger: 'blur' }],
        // specification: [{ required: true, message: '请输入需求说明', trigger: 'blur' }],
        lockPointFormType: [{ required: true, message: '请选择锁点返表类型', trigger: 'blur' }],
        skFormType: [{ required: true, message: '请选择上刊返表类型', trigger: 'blur' }],
        saleMode: [{ required: true, message: '请选择售卖模式', trigger: 'blur' }],
        // 特殊校验
        companyList: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value || !value.length) {
                callback(new Error('请填写投放城市'))
              } else if (value.some(item => !item.city || !item.companyId || !item.launchNum)) {
                callback(new Error('请填写完整'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      // 预加载数据
      preparedData: {
        customerCompanyIdOptions: [],
        customerBrandIdOptions: [],
        applyCityOptions: [],
        applyCompanyIdOptions: [],
        isPreSkOptions: [
          { label: '否' , value: 0 },
          { label: '是' , value: 1 },
        ],
        isLockOptions: [
          { label: '否' , value: 0 },
          { label: '是' , value: 1 },
        ],
        lockPointFormTypeOptions: [
          { label: '系统模板' , value: 1 },
          { label: '客户模板' , value: 2 },
        ],
        skFormTypeOptions: [
          { label: '系统模板' , value: 1 },
          { label: '客户模板' , value: 2 },
        ],
        saleModeOptions: [
          { label: '传统售卖模式' , value: 0 },
          { label: 'CPM售卖模式' , value: 1 },
        ],
      },
      // 投放日期限制
      publishDatePickerOptions: {
        disabledDate: (t) =>  dayjs(t).isAfter(dayjs(), 'day')
      },
      // 反馈时间限制
      feedbackTimeDatePickerOptions: {
        disabledDate: (t) =>  dayjs(t).isAfter(dayjs(), 'day')
      },
    }
  },
  methods: {
    /**
     * 点击添加城市按钮
     */
    handleClickCompanyCreateBtn() {
      this.formData.companyList.push(createCompanyItem())
    },
    /**
     * 点击删除城市按钮
     */
    handleClickCompanyRemoveBtn(index) {
      this.formData.companyList.splice(index, 1);
    },
    /**
     * 提交表单
     */
    async onSubmit() {
      try {
        const isPass = await this.$refs['formRef'].validate()
        if (!isPass) return
      } catch (err) {
        return
      }
      try {
        // const { token, uID: uid } = sessFun.getSess()
        this.dialogLoading = true
        // 处理时间
        const [ startTime = null, endTime = null ] = this.formData.publishDateRange
        const res = await this.$api.resource.saveOrUpdatePlan({
          ...this.formData,
          startTime,
          endTime
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
    async getDetail(id) {
      if (!id) return console.error('getDetail error: id 不能为空')
      try {
        this.dialogLoading = true
        const res = await this.$api.resource.getById({ id })
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return this.$message.error(message || '获取数据失败')
        this.formData = {
          ...data,
          publishDateRange: [ data.startTime, data.endTime ]
        }
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
    handleReset() {
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
    },
    /**
     * 打开弹框
     * （弹框打开时调用，一些弹框打开时的初始化处理可以在此方法内进行，譬如：通过 row.id 请求详情...）
     */
    open(row) {
      if (this.visible) return
      if (row) {
        this.isEdit = true
        // this.formData = {
        //   ...this.formData,
        //   ...row
        // }
        // 根据 id 获取详情，二选一
        this.getDetail(row.id)
      } else {
        this.isEdit = false
      }
      this.visible = true
      // this.getPropTwoOptions()
    },
    /**
     * 关闭弹框
     * （可以处理一些收尾操作，如：清除定时器、事件监听等等）
     */
    close() {
      if (!this.visible) return
      this.handleReset()
      this.$emit('close')
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
}

.form_item_width {
  width: 350px;
}

</style>
