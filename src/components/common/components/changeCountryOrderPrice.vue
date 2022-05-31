<template>
  <el-dialog
    title="修改订单金额"
    :visible.sync="settlementFormVisible"
    width="368px"
    custom-class="settlement-dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escap="false"
    :before-close="resetSettlement"
  >
    <el-tabs class="tabs" v-model="activeCompany">
      <el-tab-pane
        :label="item.asName"
        :name="item.asrID.toString()"
        v-for="(item, index) in settlementFormList"
        :key="index"
      >
        <el-form
          ref="settlementForm"
          :model="settlementFormList[index]"
          :rules="settlementFormRules"
        >
          <el-form-item
            label="点位单价："
            prop="adsWeekFee"
            :label-width="formLabelWidth"
          >
            <el-input
              placeholder="请输入金额"
              v-model.number="settlementFormList[index].adsWeekFee"
              size="small"
              maxlength="7"
            >
              <template slot="append">元/面·周</template>
            </el-input>
          </el-form-item>

          <div class="form__line"></div>

          <el-form-item
            class="special-padding"
            label="现金结算："
            prop="cashFee"
            :label-width="formLabelWidth"
          >
            <el-input
              placeholder="请输入金额"
              v-model.number="settlementFormList[index].cashFee"
              size="small"
              maxlength="7"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item
            class="special-padding"
            label="置换结算："
            prop="sendFee"
            :label-width="formLabelWidth"
          >
            <el-input
              placeholder="请输入金额"
              v-model.number="settlementFormList[index].sendFee"
              size="small"
              maxlength="7"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item
            class="special-padding"
            label="其它结算："
            prop="otherFee"
            :label-width="formLabelWidth"
          >
            <el-input
              placeholder="请输入金额"
              v-model.number="settlementFormList[index].otherFee"
              size="small"
              maxlength="7"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="金额备注："
            prop="remark"
            :label-width="formLabelWidth"
          >
            <el-input
              type="textarea"
              placeholder="请输入备注"
              v-model="settlementFormList[index].remark"
              size="small"
            ></el-input>
          </el-form-item>

          <div class="form__line"></div>

          <el-form-item label="方案总价：" :label-width="formLabelWidth">
            <span class="form-item__price"
              >{{
                (
                  (isNaN(settlementFormList[index].cashFee)
                    ? 0
                    : settlementFormList[index].cashFee * 1) +
                  (isNaN(settlementFormList[index].sendFee)
                    ? 0
                    : settlementFormList[index].sendFee * 1) +
                  (isNaN(settlementFormList[index].otherFee)
                    ? 0
                    : settlementFormList[index].otherFee * 1)
                ).toFixed(2)
              }}
              元</span
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="resetSettlement(cancelDialog)">取 消</el-button>
      <el-button type="primary" @click="setPlanPrice('settlementForm')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { MessageBox, Message } from 'element-ui';
// 价格格式化
import api from "../../../api/api.js";
export default {
  name: "ChangeCountryOrderPrice",
  props: {
    apID: {
      type: [String, Number],
    },
    settlementFormVisible: {
      type: Boolean,
      default: () => false
    },
    requesInfo: {
      type: Object,
      default: () => { }
    },

    tabsActiveCompany: {
      type: String,
      default: ''
    }
  },
  data () {
    let validatPrice = (rule, value, callback) => {
      if (value) {
        let reg = /^\d{1,}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正整数"));
        } else if (value > 9999999) {
          callback(new Error("预算不能大于9,999,999"));
        } else {
          callback();
        }
      } else {
        callback();
        // this.$refs["customerBudgetRef"].clearValidate()
      }
    };
    return {
      sessionData: {},
      // 设置方案金额
      formLabelWidth: '70px',
      settlementForm: {
        unitPrice: 0,
        cash: 0,
        displace: 0,
        other: 0,
        settlementRemark: ''
      },
      settlementFormRules: {
        adsWeekFee: [{ validator: validatPrice, trigger: "blur" }],
        cashFee: [{ validator: validatPrice, trigger: "blur" }],
        sendFee: [{ validator: validatPrice, trigger: "blur" }],
        otherFee: [{ validator: validatPrice, trigger: "blur" }],
      },

      settlementFormList: [],
      activeCompany: ''
    }
  },

  created () {
    this.getListCompanyFee()
    this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
  },

  methods: {
    setPlanPrice (formName) {
      if (this.settlementFormVisible) {
        // this.$refs[formName].validate((valid) => {
        //   if (valid) {
        //     console.log('success---', this.settlementForm)
        //     let params = {
        //       uid: this.sessionData.uID,
        //       token: this.sessionData.token,
        //       apID: this.apID,
        //       adsWeekFee: this.settlementForm.unitPrice * 100,
        //       cashFee: this.settlementForm.cash * 100,
        //       sendFee: this.settlementForm.displace * 100,
        //       otherFee: this.settlementForm.other * 100,
        //       remark: this.settlementForm.settlementRemark || '',
        //       ...this.requesInfo
        //     }
        //     api.postApi('/addsp/proposal/updatePlanMoney', params).then((res) => {
        //       if (res.data.SysCode === 200200) {
        //         // this.$emit("update:settlementFormVisible", false);
        //         this.cancelDialog()
        //         this.$emit("planMoneyUpdated")
        //         this.$message({
        //           type: 'success',
        //           message: '金额设置成功！'
        //         });
        //       } else {
        //         this.$message({
        //           type: 'warning',
        //           message: '金额设置失败！'
        //         });
        //       }
        //     });
        //   } else {
        //     console.warn('valid---')
        //     return false;
        //   }
        // });
        let validate = true
        this.$refs.settlementForm.forEach((item, index) => {
          item.validate(valid => {
            if (!valid) {
              validate = false
              this.activeCompany = this.settlementFormList[index].asrID.toString()
              return
            }
          })
        })
        if (validate) {
          const settlementFormList = this.settlementFormList.slice(0)
          settlementFormList.forEach(item => {
            item.adsWeekFee = item.adsWeekFee * 100
            item.cashFee = item.cashFee * 100
            item.sendFee = item.sendFee * 100
            item.otherFee = item.otherFee * 100
            delete item.asName
          })
          api.postApi_json('/national/api/v1/nationalAdPlan/commitCompanyFees', settlementFormList).then((res) => {
            if (res.data.SysCode === 200200) {
              this.cancelDialog()
              this.$emit("planMoneyUpdated")
              this.$message({
                type: 'success',
                message: '金额设置成功！'
              })
            } else {
              this.$message({
                type: 'warning',
                message: '金额设置失败！'
              })
            }
          })
        } else {
          console.warn('valid---')
          return false
        }

      }

    },

    resetSettlement (done) {
      this.$refs.settlementForm.forEach(item => {
        item.resetFields()
        done()
      })

    },

    cancelDialog () {
      this.$emit('cancel')
    },

    getListCompanyFee () {
      const params = {
        apID: this.apID
      }
      api.getApi('/national/api/v1/nationalAdPlan/listCompanyFee', params).then((res) => {
        if (res.data.SysCode === 200200) {
          this.settlementFormList = res.data.data
          this.activeCompany = this.tabsActiveCompany || res.data.data[0].asrID.toString()
        } else {
          this.$message({
            type: 'warning',
            message: '获取公司金额失败！'
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
/* 设置方案金额 */
/deep/ .settlement-dialog {
  .el-form-item {
    padding: 8px 0;
    margin: 0;
    .el-form-item__label {
      color: rgba(0, 0, 0, 0.65);
    }
    ::placeholder {
      /*Firefox,Chrome,Opera*/
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
    }
    :-ms-input-placeholder {
      /*InternetExplorer10-11*/
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
    }
    ::-ms-input-placeholder {
      /*MicrosoftEdge*/
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .form__line {
    margin: 16px 0;
    height: 1px;
    background: #e9e9e9;
  }
  .el-form-item__content {
    line-height: unset;
    .el-input__inner {
      color: rgba(0, 0, 0, 0.65);
    }
    .el-input-group__append {
      padding: 4px 12px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .special-padding.el-form-item {
    .el-input-group__append {
      padding: 4px 9px;
    }
  }
  .form-item__price {
    line-height: 32px;
    color: rgba(0, 0, 0, 0.65);
  }
  .el-dialog__header {
    padding: 16px 24px;
    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 24px;
    }
  }
  .el-dialog__body {
    padding: 0 24px;
  }
  .el-dialog__footer {
    padding: 16px 24px 24px;
    .dialog-footer__button {
      word-spacing: -1em;
      .el-button + .el-button {
        margin-left: 16px;
      }
    }
  }
  .el-form-item__label {
    padding: 0;
    line-height: 32px;
  }
}

.tabs {
  /deep/ .el-tabs__nav-scroll {
    padding-left: 0 !important;
  }
}
</style>

