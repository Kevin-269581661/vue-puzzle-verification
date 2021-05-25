<template>
    <el-dialog title="修改订单金额" :visible.sync="settlementFormVisible" width="368px" custom-class="settlement-dialog" :show-close="false" :close-on-click-modal="false" :close-on-press-escap="false" :before-close="resetSettlement">
        <el-form ref="settlementForm" :model="settlementForm" :rules="settlementFormRules">
            <el-form-item label="点位单价：" prop="unitPrice" :label-width="formLabelWidth">
                <el-input placeholder="请输入金额" v-model.number="settlementForm.unitPrice" size="small" maxlength="7">
                    <template slot="append">元/面·周</template>
                </el-input>
            </el-form-item>
            <div class="form__line"></div>
            <el-form-item label="现金结算：" prop="cash" :label-width="formLabelWidth">
                <el-input placeholder="请输入金额" v-model.number="settlementForm.cash" size="small" maxlength="7">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="置换结算：" prop="displace" :label-width="formLabelWidth">
                <el-input placeholder="请输入金额" v-model.number="settlementForm.displace" size="small" maxlength="7">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="其它结算：" prop="other" :label-width="formLabelWidth">
                <el-input placeholder="请输入金额" v-model.number="settlementForm.other" size="small" maxlength="7">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="方案总价：" :label-width="formLabelWidth">
                <span class="form-item__price">{{((isNaN(settlementForm.cash)?0:settlementForm.cash*1)+(isNaN(settlementForm.displace)?0:settlementForm.displace*1)+(isNaN(settlementForm.other)?0:settlementForm.other*1)).toFixed(2)}} 元</span>
            </el-form-item>
            <div class="form__line"></div>
            <el-form-item label="金额备注：" prop="settlementRemark" :label-width="formLabelWidth">
                <el-input type="textarea" placeholder="请输入备注" v-model="settlementForm.settlementRemark" size="small"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="resetSettlement(cancelDialog)">取 消</el-button>
            <el-button type="primary" @click="setPlanPrice('settlementForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {MessageBox, Message} from 'element-ui';
    // 价格格式化
    import api from "../../../api/api.js";
    export default {
        name: "changeProposalOrderPrice",
        props: {
            apID: {
                type: [String, Number],
            },
            settlementFormVisible: {
                type: Boolean,
                default: ()=>false
            }
        },
        data() {
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
                    unitPrice: [{ validator: validatPrice, trigger: "blur" }],
                    cash: [{ validator: validatPrice, trigger: "blur" }],
                    displace: [{ validator: validatPrice, trigger: "blur" }],
                    other: [{ validator: validatPrice, trigger: "blur" }]
                }
            }
        },
        created() {
            this.sessionData = JSON.parse(sessionStorage.getItem("session_data"));
        },
        mounted() {
            
        },
        methods: {
            setPlanPrice(formName) {
                if(this.settlementFormVisible) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            console.log('success---', this.settlementForm)
                            let params = {
                                uid: this.sessionData.uID,
                                token: this.sessionData.token,
                                apID: this.apID,
                                adsWeekFee: this.settlementForm.unitPrice*100,
                                cashFee: this.settlementForm.cash*100,
                                sendFee: this.settlementForm.displace*100,
                                otherFee: this.settlementForm.other*100,
                                remark: this.settlementForm.settlementRemark||''
                            }
                            api.postApi('/addsp/proposal/updatePlanMoney', params).then((res) => {
                                if (res.data.SysCode === 200200) {
                                    // this.$emit("update:settlementFormVisible", false);
                                    this.cancelDialog()
                                    this.$emit("planMoneyUpdated")
                                    console.log("金额结算成功");
                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: '金额结算失败'
                                    });
                                }
                            });
                        } else {
                            console.warn('valid---')
                            return false;
                        }
                    });
                }
            },
            resetSettlement(done) {
                if(this.$refs.settlementForm) {
                    this.$refs.settlementForm.resetFields()
                    done()
                }
            },
            cancelDialog() {
                this.$emit('cancel')
            },
        }
    }
</script>

<style lang="scss" scoped>
/* 设置方案金额 */
/deep/ .settlement-dialog {
    .el-form-item {
        padding: 8px 0;
        margin: 0;
    }
    .form__line {
        margin: 16px 0;
        height: 1px;
        background: #E9E9E9;
    }
    .el-form-item__content {
        line-height: unset;
    }
    .form-item__price {
        line-height: 32px;
    }
    .el-dialog__header {
        padding: 16px 24px;
    }
    .el-dialog__body {
        padding: 0 24px;
    }
    .el-dialog__footer {
        padding: 16px 24px 24px;
    }
    .el-form-item__label {
        padding: 0;
        line-height: 32px;
    }
}
</style>
