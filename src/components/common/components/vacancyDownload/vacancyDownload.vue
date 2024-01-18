<template>
  <div>
    <!-- 空位导出-弹框组件 -->
    <el-dialog title="空位导出" :visible.sync="visible" width="700px">
      <template slot="title">
        <div class="dialog_header">
          <span style="margin-right: auto;">空位导出</span>

          <!-- <el-dropdown>
            <el-button type="plain" size="mini">
              一键筛选<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>测试</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <el-select
            v-model="collectSelection"
            placeholder="一键筛选"
            size="mini"
            filterable
            clearable
            style="width: 120px"
            @change="collectChange"
          >
            <el-option
              v-for="item in collectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

        </div>
      </template>

      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="160px" size="small" class="form">

            <el-form-item label="导出空位：" prop="loadType">
              <el-radio-group v-model="formData.loadType" @input="onChangeLoadType">
                <el-radio v-for="(item, index) in preparedData.loadTypeOptions" :label="item" :key="index">
                  {{ item }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="选择城市：" prop="city">
              <el-select
                v-model="formData.city"
                placeholder="请选择"
                filterable
                clearable
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in preparedData.cityOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="媒体类型：" prop="mediaTypeIds">
              <el-select
                v-model.trim="formData.mediaTypeIds"
                placeholder="请选择"
                filterable
                clearable
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in preparedData.mediaTypeOptions"
                  :key="item.mediaTypeId"
                  :value="item.mediaTypeId"
                  :label="item.mediaTypeName"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="开门次数范围：" prop="openDoorCount" v-if="sessionData.uType === 'ADN_MD_COUNTRY'">
              <div class="open_door_count">
                <div class="time_box">
                  <span>时间：</span>
                  <el-select v-model="formData.openDoorType" placeholder="请选择" size="small" @change="onChangeOpenDoorType">
                    <el-option
                      v-for="item in preparedData.openDoorTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-date-picker
                    v-if="formData.openDoorType === 4"
                    v-model="formData.openDoorDate"
                    :picker-options="openDoorDatePickerOptions"
                    type="daterange"
                    size="small"
                    value-format="yyyy/MM/dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 240px;margin-left: 5px"
                    >
                  </el-date-picker>
                </div>
                <div>
                  <span>范围：</span>
                  <el-input  type="number" size="small" v-model="formData.openDoorMinCount" placeholder="最小值" style="width:120px" @change="handleChangeInput"></el-input>
                  &nbsp;~&nbsp;
                  <el-input  type="number" size="small" v-model="formData.openDoorMaxCount" placeholder="最大值" style="width:120px" @change="handleChangeInput"></el-input>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="是否支持语音播报：" prop="supportVoice" v-if="sessionData.uType === 'ADN_MD_COUNTRY'">
              <el-radio-group v-model="formData.supportVoice">
                <el-radio v-for="item in preparedData.supportVoiceOptions" :label="item.value" :key="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="选择日期：" prop="dateType" >
              <el-radio-group v-model="formData.dateType">
                <el-radio v-for="item in preparedData.dateTypeOptions" :label="item.value" :key="item.value" class="radio_box">
                  <span>{{ item.label }}</span>
                  <el-date-picker
                    v-if="item.value === '2' && formData.dateType === '2'"
                    v-model="formData.customDate"
                    :picker-options="customDatePickerOptions"
                    type="daterange"
                    format="yyyy/MM/dd"
                    value-format="yyyy/MM/dd"
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

            <!-- <el-form-item label="方案过滤：" prop="planFilterType" >
              <el-radio-group v-model="formData.planFilterType" @input="onChangePlanFilter">
                <el-radio-button
                  v-for="item in preparedData.planFilterTypeOptions"
                  :key="item.value"
                  :label="item.value"
                  @click.native="onClickPlanFilterType(item.value)"
                >
                  <span>{{ item.label }}</span>
                </el-radio-button>
              </el-radio-group>
              <span v-if="formData.planFilterType === '2'" style="margin-left: 10px">已选{{ formData.planFilterSelection.length }}个</span>
            </el-form-item> -->

          </el-form>
        </div>
        <div class="custom_dialog_footer">
          <div class="footer_left">
            <span class="btn_box" @click="createCollect">
              <i class="el-icon-star-off"></i>
              收藏此筛选组合
            </span>
            <span class="btn_box" @click="openCollectTable">收藏列表</span>
          </div>
          <el-button @click="close" size="small">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="small">确 定</el-button>
        </div>

      </div>
    </el-dialog>

    <!-- 收藏列表 -->
    <VacancyDownloadCollect ref="vacancyDownloadCollect" :collectList="collectList" @getCollectList="getCollectList" @cancelCollect="cancelCollect"/>

    <!-- 选择方案 -->
    <ChoosePlanDialog ref="choosePlanDialogRef" @confirm="onConfirmChoosePlan"/>
  </div>
</template>

<script>
import FileSaver from 'file-saver';
import api from "../../../../api/api.js";
import sessFun from "../../../../commonFun/sessFun.js";
import filterData from "../../../../commonFun/filterTableData.js";
import VacancyDownloadCollect from './vacancyDownloadCollect.vue'
import ChoosePlanDialog from '@/components/common/components/choosePlanDialog.vue'
import { Message } from "element-ui";

/**
 * 初始化表单（提交）数据
 */
 const initFormData = () => {
  return {
    // 导出空位
    loadType: '',
    // 选择城市
    city: [],
    // 媒体类型
    mediaTypeIds: [],
    // 开门类型值
    openDoorType: '',
    // 开门次数日期范围
    openDoorDate: [],
    openDoorMinCount: null,
    openDoorMaxCount: null,
    supportVoice: -1,
    dateType: '1',
    customDate: [],
    // 方案过滤
    planFilterType: '1',
    planFilterSelection: []
  }
}

export default {
  components: {
    VacancyDownloadCollect,
    ChoosePlanDialog
  },
  data () {
    return {
      visible: false,
      dialogLoading: false,
      formData: initFormData(),
      formRules: {
        // 通用校验
        loadType: [{ required: true, message: '请选择选点纬度', trigger: 'blur' }],
        city: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        mediaTypeIds: [{ required: true, message: '请选择媒体类型', trigger: 'blur' }],
        // 特殊校验
        openDoorCount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let { openDoorType, openDoorMinCount, openDoorMaxCount } = this.formData
              if (!openDoorType === 4 && openDoorDate.length < 2) {
                callback(new Error('请选择自定义时间范围'))
              } else if (Number(openDoorMinCount) > Number(openDoorMaxCount)) {
                callback(new Error('最小值不能大于最大值'))
              } else if (openDoorType !== '' && openDoorMinCount === '') {
                callback(new Error('请填写最小值'))
              } else if (openDoorType !== '' && openDoorMaxCount === '') {
                callback(new Error('请填写最大值'))
              } else if (openDoorType === '' && openDoorMinCount !== '' && openDoorMaxCount !== '') {
                callback(new Error('请选择开门时间范围'))
              } else {
                callback()
              }
            }
          }
        ],
        dateType: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let { dateType, customDate } = this.formData
              if (dateType == "2" && customDate.length < 2) {
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
        loadTypeOptions: [],
        cityOptions: [],
        mediaTypeOptions: [],
        openDoorTypeOptions: [
          { label: '昨日', value: 1 },
          { label: '近7天', value: 2 },
          { label: '近30天', value: 3 },
          { label: '自定义', value: 4 },
        ],
        supportVoiceOptions: [
          { label: '不限', value: -1 },
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
        dateTypeOptions: [
          { label: '默认半年日期', value: '1' },
          { label: '自定义日期', value: '2' },
        ],
        planFilterTypeOptions: [
          { label: '全部过滤', value: '1' },
          { label: '自定义过滤', value: '2' },
        ]
      },
      // 登录信息
      sessionData: {},
      customDatePickerOptions: {
        disabledDate (time) {
          return time.getTime() <= Date.now() - 1000 * 3600 * 24;
        },
      },
      // 限制时间范围
      openDoorDatePickerOptions: {
        disabledDate(time) {
          // 如果没有后面的-8.64e6就是不可以选择今天的
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      tempMediaTypes: [],
      mediaTypeList: [],
      // 收藏列表
      collectList: [],
      collectSelection: null,
    };
  },
  methods: {
    onClickPlanFilterType(val) {
      console.log('onClickPlanFilterType e === ', val)
      if (val === '2') {
        this.$refs.choosePlanDialogRef.open(this.formData.planFilterSelection)
      }
    },
    /**
     * 确认选择方案
     */
    onConfirmChoosePlan(list) {
      console.log('onConfirmChoosePlan ====', list)
      this.formData.planFilterSelection = list
    },
    /**
     * 方案过滤切换
     */
    onChangePlanFilter(val) {
      // console.log('onChangePlanFilter ====', val)
    },
    /**
     * 开门次数时间类型切换
     */
    onChangeOpenDoorType() {
      this.formData.openDoorDate = []
    },
    /**
     * 导出类型对应媒体类型
     */
    onChangeLoadType(type) {
      this.formData.mediaTypeIds = []
      const index = this.tempMediaTypes.findIndex(item => item.chooseTypeName === type)
      this.preparedData.mediaTypeOptions = this.tempMediaTypes[index].mediaTypeList
    },
    /**
     * 获取session数据
     */
    getSessionData () {
      this.sessionData = sessFun.getSess();
      // 处理导点纬度
      let permissionList = this.sessionData.userMediaChooseConfigs || []
      // 导出空位
      let tempPermiision = []
      // 媒体类型
      let tempMediaTypes = []
      if(permissionList.length) {
        permissionList.forEach(per => {
          if(per.chooseTypeName !== '小区') {
            tempPermiision.push(per.chooseTypeName)
          }
        })
      }
      tempPermiision = [...new Set(tempPermiision)]
      let order = ['点位', '单元', '楼栋', '小区']
      tempPermiision = tempPermiision.sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b)
      })
      if(tempPermiision.length) {
        let list
        tempPermiision.forEach(item => {
            list = permissionList.filter(v => v.chooseTypeName === item)
            tempMediaTypes.push({
                chooseTypeName: item,
                mediaTypeList: list
            })
        })
      }
      // 按小区导出不做限制
      tempPermiision.push('小区')
      const resArr = filterData(permissionList, 'mediaTypeId', 'mediaTypeName').map(item => {
        return {
          mediaTypeId: item.value,
          mediaTypeName: item.mediaTypeName
        }
      })
      tempMediaTypes.push({
        chooseTypeName: '小区',
        mediaTypeList: resArr
      })
      // 导出空位的处理
      if (
        ['ADN_BD_KA', 'ADN_BD'].includes(this.sessionData.uType) &&
        this.sessionData.customPermission.proposalPermission == 1
      ) {
        tempPermiision = tempPermiision.filter(item => item !== '点位')
      }
      this.tempMediaTypes = tempMediaTypes
      this.preparedData.loadTypeOptions = tempPermiision
    },
    /**
     * 输入框校验
     */
    handleChangeInput() {
      if (this.formData.openDoorMinCount < 0 ) {
        this.formData.openDoorMinCount = ''
      }
      if (this.formData.openDoorMaxCount < 0 ) {
        this.formData.openDoorMaxCount = ''
      }
      if (this.formData.openDoorMaxCount > 100000000) {
        this.formData.openDoorMaxCount = 100000000
      }
    },
    async onSubmit () {
      await this.$refs['formRef'].validate()
      let { loadType } = this.formData;
      switch(loadType) {
        // 按小区
        case "小区": this.getExcelData('exportVacancyByCommunity', '小区'); break;
        // 按楼栋
        case "楼栋": this.getExcelData('exportVacancyByBuilding', '楼栋'); break;
        // 按单元
        case "单元": this.getExcelData('exportVacancyByUnit', '单元'); break;
        // 按点位
        case "点位": this.getExcelData('exportVacancyByAds', '点位'); break;
      }
    },
    /**
     * 获取城市下拉数据
     */
    getCityOptions () {
      let info = {
        token: this.sessionData.token,
        uid: this.sessionData.uID,
      };
      api
        .postApi(this.apiVar.Advertisement + "/GetAuthorCity", info)
        .then((res) => {
          if (res.data.SysCode == 300200) {
            let resinfo = res.data.data;
            let result = [];
            for (let data of resinfo) {
              let obj = {
                label: data.rName,
                value: data.rID,
              };
              result.push(obj);
            }
            this.preparedData.cityOptions = result;
          } else {
            Message.warning(res.data.MSG);
          }
        });
    },
    // 获取城市中文名称
    getCityName (rids) {
        let citys = [];
        for (let i = 0; i < rids.length; i++) {
            for(let data of this.preparedData.cityOptions) {
                if(data.value === rids[i]) {
                    citys.push(data.label)
                    break
                }
            }
        }
        return citys.join('-');
    },
    // 导出表格
    exportToExcel(data, name) {
        let { city, dateType, customDate } = this.formData;
        let fileName = this.getCityName(city)
        // 自定义日期
        if(dateType == '2') {
            fileName += '-' + customDate[0] + '~' + customDate[1]
        }
        // 导出excel
        FileSaver.saveAs(new Blob([data], {type: "application/vnd.ms-excel"}), `${fileName} 空位表(按${name}).xlsx`)
    },
    // 按小区/楼栋/单元/点位 - 表格数据请求
    getExcelData(url, name) {
        let loadingPoint = this.$loading({
            lock: true,
            text: "玩命加载中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
        });
        let { city, mediaTypeIds,openDoorType,openDoorMinCount,openDoorMaxCount,supportVoice, dateType, customDate, openDoorDate } = this.formData;
        let params = {
            cityIds: city.join(','),
            mediaTypeIds: mediaTypeIds.join(','),
            supportVoice,
            openDoorType: openDoorType === ''? null : openDoorType,
            openDoorMinCount: openDoorMinCount === ''? null : openDoorMinCount,
            openDoorMaxCount: openDoorMaxCount === '' ? null : openDoorMaxCount,
            openDoorBeginDate: openDoorType === 4 ? openDoorDate[0] : null,
            openDoorEndDate: openDoorType === 4 ? openDoorDate[1] : null
          }
        // 自定义日期
        if(dateType === '2') {
            params.startTime = customDate[0]
            params.endTime = customDate[1]
        }
        api.getApi_file('/addsp/api/v1/excel/export/' + url, params)
        .then((res) => {
            if (res.status === 200) {
                if(res.data) {
                    this.exportToExcel(res.data, name)
                    this.messageFun('success', '导出成功')
                }
            } else {
                this.messageFun('error', '导出失败')
            }
        })
        .catch((err) => {
            console.error('getExcelData error:', err);
        })
        .finally(() => {
            loadingPoint.close()
        })
    },
    // 操作提示统一方法
    messageFun (mesType, mes) {
      this.$message({
        message: mes,
        type: mesType,
        showClose: true,
      });
    },
    /**
     * 添加导出条件的收藏
     */
    createCollect() {
      this.$prompt('请为该筛选组合命名', '温馨提示', {
        inputPattern: /.+/,
        inputErrorMessage: '请输入筛选组合名称'
      }).then(({ value: name }) => {
        debugger
        const { city: cityIds, dateType, customDate, mediaTypeIds, loadType: vacancy } = this.formData
        const citys = cityIds.map(cityId => {
          return this.preparedData.cityOptions.find(item => item.value === cityId).label
        })
        let defaultTimeFlag = null
        if (dateType == '1') {
          defaultTimeFlag = 1
        } else if (dateType == '2') {
          defaultTimeFlag = 0
        }
        const [startTime = null, endTime = null] = customDate
        const mediaTypes = mediaTypeIds.map(id => {
          return this.preparedData.mediaTypeOptions.find(item => item.mediaTypeId === id).mediaTypeName
        })
        let params = {
          // 城市ids
          cityIds,
          // 城市s
          citys,
          // 媒体类型id
          mediaTypeIds,
          // 媒体类型
          mediaTypes,
          // 收藏名字
          name,
          // 是否默认时间: 0 否, 1 是
          defaultTimeFlag,
          // 自定义开始时间
          startTime,
          // 自定义结束时间
          endTime,
          // 空位
          vacancy,
        }
        console.log('createCollect ===> ', params)
        api
        .postApi_json(`${this.apiVar.excelExport}/saveCollect`, params)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            Message.success('操作成功');
            this.getCollectList({})
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch(err => {
          console.error('createCollect error:', err)
        })
      }).catch(() => {});
    },
    /**
     * 打开收藏列表
     */
    openCollectTable () {
      this.$refs.vacancyDownloadCollect && this.$refs.vacancyDownloadCollect.open()
    },
    /**
     * 获取收藏列表
     */
    getCollectList({ onComplete }) {
      api
        .getApi(`${this.apiVar.excelExport}/collectList`)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            const list = res.data.data || []
            this.collectList = list.map(item => {
              return {
                ...item,
                cityDisplayStr: item.citys.join('、'),
                mediaTypeDisplayStr: item.mediaTypes.join('、'),
              }
            })
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch(err => {
          console.error('getCollectList error:', err)
        })
        .finally(() => {
          onComplete && onComplete()
        })
    },
    /**
     * 取消收藏
     */
     cancelCollect({ id, onComplete }) {
      api
        .getApi(`${this.apiVar.excelExport}/deleteCollect`, { id })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            Message.success('操作成功');
            this.getCollectList({ onComplete })
          } else {
            onComplete && onComplete()
            Message.warning(res.data.MSG);
          }
        })
        .catch(err => {
          onComplete && onComplete()
          console.error('cancelCollect error:', err)
        })
    },
    /**
     * 一键筛选
     */
    collectChange(val) {
      if (this.collectSelection) {
        const itemData = this.collectList.find(item => item.id === val)
        // console.log('collectChange itemData===>', itemData)
        if (itemData) {
          let { cityIds: city = [], vacancy: loadType, mediaTypeIds = [], startTime, endTime, defaultTimeFlag } = itemData
          // 导出空位的处理
          if (!this.preparedData.loadTypeOptions.includes(loadType)) {
            loadType = null
          }
          // 选择城市的处理
          const cityIdList = this.preparedData.cityOptions.map(item => item.value)
          city = city.filter(item => cityIdList.includes(item))
          // 媒体类型的处理
          if (loadType) this.onChangeLoadType(loadType)
          const allMediaTypeIdList = this.preparedData.mediaTypeOptions.map(item => item.mediaTypeId)
          mediaTypeIds = mediaTypeIds.filter(item => allMediaTypeIdList.includes(item))
          // 选择日期的处理
          let customDate = []
          if (!defaultTimeFlag && startTime && endTime) {
            customDate = [startTime, endTime]
          }
          this.formData = {
            ...this.formData,
            city,
            loadType,
            mediaTypeIds,
            dateType: defaultTimeFlag ? '1' : '2',
            customDate
          }
          // console.log('collectChange formData===>', this.formData)
        }
      }
    },
    /**
     * 重置数据
     */
     handleReset() {
      this.formData = initFormData()
      this.$refs['formRef'] && this.$refs['formRef'].clearValidate()
    },
    open() {
      this.visible = true
    },
    close() {
      if (this.visible) {
        this.handleReset()
        this.$emit('close')
        this.visible = false
      }
    },
  },
  mounted () {
    this.getSessionData();
    this.getCityOptions();
    this.getCollectList({})
  },
  computed: {

  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0;
}

/deep/.vacancy_box .el-row {
  height: 50px;
  .el-col:first-child {
    padding-right: 14px;
    text-align: right;
  }
}
/deep/.vacancy_box .el-select {
  width: 90%;
}
/deep/.vacancy_box .el-input__inner {
  width: 100%;
}
/deep/.vacancy_box .el-date-editor {
  width: 90%;
}
/deep/.vacancy_box .el-range-editor--mini .el-range-separator {
  line-height: 30px;
}

/deep/.vacancy_box .el-result {
  padding: 0;
  padding-bottom: 50px;
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
.open_door_count {
  // display: flex;
  /deep/ .el-select{
    width: 120px;
  }
  .time_box{
    margin-bottom: 10px;
  }
}

.open-door-select{
  padding: 10px 20px;
}
.open-door-date{
  border-top: 1px solid #eee;
  width: 470px;
  padding: 10px 0;
}
.open-door-date span {
  font-weight: 400;
  font-size: 14px;
}

.radio_box {
  display: block;
  line-height: 32px;
}

</style>
