<template>
  <div>
    <el-dialog
      title="全国单投放确认"
      width="412px"
      :visible.sync="dialogVisible"
      :show-close="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper registration-media"
    >
      <div class="board">
        <div class="tip">请确认该订单是否已开始投放，并完善以下信息</div>
        <el-form
          ref="ruleForm"
          :model="form"
          :rules="rules"
          label-width="102px"
        >
          <el-form-item label="关联全国单：">
            <el-radio-group
              v-model="form.isRelevancy"
              @change="handleRadioChange"
            >
              <el-radio :label="1">关联</el-radio>
              <el-radio :label="0">不关联</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="选择全国单："
            v-show="form.isRelevancy === 1"
            prop="sourceId"
          >
            <el-select
              v-model="form.sourceId"
              placeholder="请选择需要关联的全国单"
              v-el-select-loadmore="loadmoreNationalOrder"
              :remote-method="remoteNationalOrderList"
              filterable
              size="small"
            >
              <el-option
                v-for="item in nationalOrderList"
                :key="item.sourceId"
                :label="item.orderName"
                :value="item.sourceId"
              ></el-option>
            </el-select>
          </el-form-item>

          <div v-show="form.isRelevancy === 0">
            <el-form-item label="方案名称：" prop="orderName">
              <el-input
                v-model="form.orderName"
                placeholder="请输入方案名称"
                size="small"
              ></el-input>
            </el-form-item>

            <el-form-item label="订单金额：" prop="amount">
              <el-input
                v-model="form.amount"
                placeholder="请输入订单金额"
                class="u-unit"
                size="small"
                @input="handlePrice($event, 'amount')"
              >
                <span slot="suffix">元</span>
              </el-input>
            </el-form-item>

            <el-form-item label="上刊日期：" prop="orderStartTime">
              <div class="date-item">
                <el-date-picker
                  type="date"
                  placeholder="请选择上刊日期"
                  value-format="timestamp"
                  v-model="form.orderStartTime"
                  style="width: 100%"
                  size="small"
                >
                </el-date-picker>
                <i class="el-input__icon el-icon-date icon"></i>
              </div>
            </el-form-item>

            <el-form-item label="下刊日期：" prop="orderEndTime">
              <div class="date-item">
                <el-date-picker
                  type="date"
                  placeholder="请选择下刊日期"
                  value-format="timestamp"
                  v-model="form.orderEndTime"
                  style="width: 100%"
                  @change="handlePicker"
                  size="small"
                ></el-date-picker>
                <i class="el-input__icon el-icon-date icon"></i>
              </div>
            </el-form-item>

            <el-form-item label="投放面数：" prop="planAdsCnt">
              <el-input
                v-model="form.planAdsCnt"
                placeholder="请输入投放面数"
                class="u-unit"
                size="small"
                @input="handlePrice($event, 'planAdsCnt')"
              >
                <span slot="suffix">面</span>
              </el-input>
            </el-form-item>

            <el-form-item label="投放城市：" prop="launchCity">
              <el-select
                v-model="form.launchCity"
                placeholder="请选择投放城市"
                multiple
                :remote-method="remoteCityList"
                filterable
                size="small"
                @change="handleCityChange"
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.rID"
                  :label="item.rName"
                  :value="item.rName"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleCommit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
import timeFormat from "../../../commonFun/timeFormat.js";
import sessFun from "../../../commonFun/sessFun.js";
export default {
  name: "launchMedia",

  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    orderData: {
      type: Object,
      default: () => { },
    }
  },

  directives: {
    'el-select-loadmore': {
      bind (el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        )
        SELECTWRAP_DOM.addEventListener('scroll', function () {
          const condition =
            this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) {
            binding.value()
          }
        })
      }
    }
  },

  data () {
    var validatePlanName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入方案名称'));
      } else {
        callback();
      }
    }

    var validateSourceId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择全国订单'));
      } else {
        callback();
      }
    }

    var validateAmount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入订单金额'));
      } else {
        callback();
      }
    }

    var validateOrderStartTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择上刊时间'));
      } else {
        callback();
      }
    }

    var validateOrderEndTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择下刊时间'));
      } else {
        callback();
      }
    }

    var validatePlanAdsCnt = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入投放面数'));
      } else {
        callback();
      }
    }

    var validateLaunchCity = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择投放城市'));
      } else {
        callback();
      }
    }

    return {
      loading: false,
      form: {
        // 全国订单
        sourceId: '',
        isRelevancy: 1,
        orderName: '',
        amount: '',
        orderStartTime: '',
        orderEndTime: '',
        planAdsCnt: '',
        launchCity: []
      },

      rules: {
        sourceId: [
          { validator: validateSourceId, trigger: 'blur' }
        ],
        orderName: [
          { validator: validatePlanName, trigger: 'blur' }
        ],
        amount: [
          { validator: validateAmount, trigger: 'blur' }
        ],
        orderStartTime: [
          { validator: validateOrderStartTime, trigger: 'blur' }
        ],
        orderEndTime: [
          { validator: validateOrderEndTime, trigger: 'blur' }
        ],
        planAdsCnt: [
          { validator: validatePlanAdsCnt, trigger: 'blur' }
        ],
        launchCity: [
          { validator: validateLaunchCity, trigger: 'blur' }
        ]
      },

      // 全国单
      nationalOrderList: [],
      // 全国单参数
      nationalOrderParams: {
        keyword: '',
        pageSize: 10,
        pageNum: 1
      },
      // 全国单总数
      nationalOrderPages: 0,

      cityList: [],

    };
  },

  watch: {
    dialogVisible (val) {
      if (val) {
        this.form.isRelevancy = 1

        this.handleRadioChange()
        this.getCityList()
        this.getNationalOrderList()
      }
    }
  },

  created () {
    this.sessionData = sessFun.getSess();
  },

  methods: {
    loadmoreNationalOrder () {
      if (this.nationalOrderParams.pageNum < this.nationalOrderPages) {
        this.nationalOrderParams.pageNum++
        this.getNationalOrderList(this.nationalOrderParams.pageNum)
      }
    },

    handleRadioChange () {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },

    handlePicker (e) {
      if (e < this.form.orderStartTime) {
        this.form.orderEndTime = ''
        this.$message({
          type: "warning",
          message: '下刊时间不能比上刊时间短',
        })
      }
    },

    handleClose () {
      this.$emit("update:dialogVisible", false)
    },

    handlePrice (e, type) {
      if (isNaN(e)) {
        this.form[type] = ''
      }
    },

    getNationalOrderList (pageNum = 1) {
      const nationalOrderParams = {
        ...this.nationalOrderParams,
        pageNum,
        suID: this.orderData.suId
      }
      api
        .getApi("/addsp/api/v1/sale/nationalOrderList", nationalOrderParams)
        .then((res) => {
          if (res.data.code === 200) {
            const resData = res.data.data;
            this.nationalOrderList = [...this.nationalOrderList, ...resData.list] || [];
            this.nationalOrderPages = resData.pages || 0;
            this.nationalOrderParams.pageNum = resData.pageNum
          } else {
            this.$message({
              type: "warning",
              message: res.data.message || "全国单列表获取异常！",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })

    },

    remoteNationalOrderList (query) {
      if (query !== '') {
        this.nationalOrderParams.keyword = query
        this.getNationalOrderList(1)
      } else {
        this.nationalOrderList = []
      }
    },

    getCityList () {
      const params = {
        suID: this.orderData.suId,
        uid: this.sessionData.uID,
        token: this.sessionData.token
      }
      api
        .getApi(this.apiVar.Advertisement + "/GetFanganCity", params)
        .then((res) => {
          this.cityList = res.data || [];
        })
        .catch((err) => {
          console.log(err);
        })
    },

    handleCityChange (arr) {
        if(arr.length){
            this.$refs.ruleForm.clearValidate('launchCity')
        }
    },

    remoteCityList (query) {
      if (query !== '') {
        this.getNationalOrderList(1)
      } else {
        this.nationalOrderList = []
      }
    },

    // 提交订单
    confirmPublishOrder () {
      const { sourceId, orderName, amount, orderStartTime, orderEndTime, planAdsCnt, launchCity, isRelevancy } = this.form
      let bodyData = {}

      if (isRelevancy === 1) {
        bodyData = {
          sourceId,
          recordId: this.orderData.recordId,
          orderEndTime
        }
      } else {
        bodyData = {
          orderName,
          amount: amount * 100,
          orderStartTime,
          orderEndTime,
          planAdsCnt,
          launchCity: launchCity.join(','),
          recordId: this.orderData.recordId
        }
      }

      this.loading = true
      api
        .postApi_json("/addsp/api/v1/sale/confirmPublishOrder", bodyData)
        .then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.$message({
              type: "success",
              message: '投放成功',
            })
            this.handleClose()
          } else {
            this.loading = false
            this.$message({
              type: "warning",
              message: res.data.message || "投放失败",
            });
          }
        })
        .catch((err) => {
          this.loading = false
          console.log(err);
        })
    },

    handleCommit () {
      let validArr = this.form.isRelevancy === 1 ? ['sourceId'] : ['orderName', 'amount', 'orderStartTime', 'orderEndTime', 'planAdsCnt', 'launchCity']
      let isValid = true
      this.$refs.ruleForm.validateField(validArr, (valid) => {
        if (valid) {
          isValid = false
        }
      })
      if (isValid) {
        this.confirmPublishOrder()
      }
    },

  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 0 24px 4px;
}
/deep/ .el-form-item {
  margin-bottom: 16px;
}
/deep/ .el-input__suffix {
  right: 10px;
}
/deep/ .el-form-item__error {
  padding-top: 1px;
}
/deep/ .el-form-item__label {
  font-family: 'PingFang SC';
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  padding: 0;
  height: 32px;
  line-height: 32px;
}
/deep/ .el-form-item {
  height: 32px;
}

/deep/ .el-form-item__content {
  height: 32px;
  line-height: 32px;
}
/deep/ .el-select {
  width: 100%;
  .el-input .el-select__caret {
    display: flex;
    align-items: center;
  }
}
.u-unit {
  /deep/ .el-input__suffix {
    width: 32px;
    background: #fafafa;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    right: 0;
    border: 1px solid #d9d9d9;
    border-radius: 0px 4px 4px 0px;
    box-sizing: border-box;
  }
}

.date-item {
  position: relative;
  .icon {
    position: absolute;
    right: 4px;
    top: -4px;
  }
}

/deep/ .el-date-editor--date {
  .el-input__prefix {
    display: none;
  }
  .el-input__inner {
    padding-left: 15px;
  }
}

.tip {
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 24px;
}
</style>
