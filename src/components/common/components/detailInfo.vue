<script>
import sessFun from "../../../commonFun/sessFun.js";
export default {
    props:{
        detail:{
            type: Object,
            default: {}
        },
        isorder:{
            type: Boolean,
            default: false
        },
    },
    data(){
        return{
            role: ''
        }
    },
    created() {
        this.getRole();
    },
    methods:{
        // 去重城市
        filter(cityList=[]) {
            return cityList.map(_=>_.rName||'').join(',');
        },
        // ADorderDetail.vue传递的prop:detail无cityList
        filter2(val) {
            let res = "";
            if (val) {
                for (let data of val.split(",")) {
                    if (!res.includes(data)) {
                        res = data + "," + res;
                    }
                }
                console.log(res);
                res = res.toString().substring(0, res.toString().length - 1);
            }
            return res;
        },
        // 状态转换成文本
        stateToText(val) {
            let state = [
                { text: "未配点", state: -1, color: 'rgba(250, 173, 20, 1)' },
                { text: "已完成", state: 0, color: 'rgba(196,203,211,1)' },
                { text: "进行中", state: 1, color: 'rgb(113, 213, 217)' },
                { text: "未投放", state: 2, color: 'rgba(82,196,26,1)' },
                { text: "投放中", state: 3, color: 'rgba(24,144,255,1)' },
                { text: "强制结束", state: 5, color: 'rgba(245,34,45,1)' }
            ];
            for (let data of state) {
                if (val == data.state) {
                    return data;
                }
            }
            return {};
        },
        // 获取用户角色
        getRole() {
            this.sessionData = sessFun.getSess();
            this.role = this.sessionData.uType || '';
        },
    },
}
</script>
<template>
    <div>
        <slot>
            <div class="plan-detail">
                <div class="plan-detail-left">
                    <ul>
                        <li>
                            <span>公司名称：</span>
                            <em>{{detail.cName}}</em>
                        </li>
                        <li>
                            <span>联系人：</span>
                            <em>{{detail.cuName}}</em>
                        </li>
                        <li v-if="role != 'EP'">
                            <span>现金结算：</span>
                            <em>¥{{detail.pdTotal}}</em>
                        </li>
                        <li>
                            <span>公司品牌：</span>
                            <em>{{detail.bTitle || '--'}}</em>
                        </li>
                        <li v-if="isorder">
                            <span>投放城市：</span>
                            <em>{{filter(detail.cityList)}}</em>
                        </li>
                        <li v-else>
                            <span>投放城市：</span>
                            <em>{{filter2(detail.rIDs)}}</em>
                        </li>
                        <li v-if="role != 'EP'">
                            <span>资源置换：</span>
                            <em>¥{{detail.pdSendFee}}</em>
                        </li>
                        <li>
                            <span>所属销售：</span>
                            <em>{{detail.realName}}</em>
                        </li>
                        <li>
                            <span>客户要求：</span>
                            <em>{{detail.customerDemand||'无'}}</em>
                        </li>
                        <li v-if="role != 'EP'">
                            <span>其他费用：</span>
                            <em>¥{{detail.pdOtherFee}}</em>
                        </li>
                    </ul>
                </div>
                <div class="plan-detail-right">
                    <dl>
                        <dt>状态</dt>
                        <dd>
                            <b class="order-badge" :style="{background: stateToText(detail.apState).color}"></b>
                            {{stateToText(detail.apState).text}}
                        </dd>
                    </dl>
                    <dl v-if="role != 'EP'">
                        <dt>
                            <el-tooltip placement="top" width="200" trigger="hover" effect="dark" style="margin-left:-16px;">
                                <div slot="content">
                                    <div v-if="detail.planMode!=1" class="tooltip-box">
                                        <p class="tooltip-box__p">
                                            <b>广告门</b>
                                            <span>现金结算: <span>¥ {{detail.AdDoor.pdTotal}}</span></span>
                                            <span>资源置换: <span>¥ {{detail.AdDoor.pdSendFee}}</span></span>
                                            <span>其他费用: <span>¥ {{detail.AdDoor.pdOtherFee}}</span></span>
                                        </p>
                                        <p class="tooltip-box__p">
                                            <b>道闸</b>
                                            <span>现金结算: <span>¥ {{detail.barrier.pdTotal}}</span></span>
                                            <span>资源置换: <span>¥ {{detail.barrier.pdSendFee}}</span></span>
                                            <span>其他费用: <span>¥ {{detail.barrier.pdOtherFee}}</span></span>
                                        </p>
                                    </div>
                                    <div class="tooltip-box">
                                        <p class="tooltip-box__p">
                                            <b>金额备注</b>
                                            <span>{{detail.remark||'--'}}</span>
                                        </p>
                                    </div>
                                </div>
                                <i class="fa fa-info-circle" aria-hidden="true"></i>
                            </el-tooltip>
                            方案金额
                        </dt>
                        <dd>¥ {{detail.Total}}</dd>
                    </dl>
                </div>
            </div>
        </slot>
    </div>
</template>
<style lang="scss" scoped>
.plan-detail {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #333333;
    padding-left: 41px;
}

.plan-detail-left {
    float: left;
    width: 78.5%;
}

.plan-detail-left ul {
    width: 100%;
    float: left;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
}

.plan-detail-left ul li {
    float: left;
    width: calc(33.3% - 16px);
    margin: 0 16px 12px 0;
    font-size: 14px;
    color: #666666;
}

.plan-detail-left ul li em {
    font-size: 14px;
    color: #666666;
}
.tooltip-box {
    display: flex;
    .tooltip-box__p {
        max-width: 150px;
        b {
            font-size: 14px;
        }
        span {
            font-size: 12px;
        }
        & > * {
            display: inline-block;
            line-height: 22px;
            min-width: 75px;
        }
    }
}
.tooltip-box + .tooltip-box {
    margin-top: 8px;
}

.plan-detail-right {
    display: flex;
    justify-content: space-between;
    width: 21%;
    float: right;
}

.plan-detail-right dl {
    float: left;
    text-align: right;
}

.plan-detail-right dt {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
}

.plan-detail-right dd {
    margin-top: 4px;
    display: inline-block;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    .order-badge {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 6px;
    }
}
/*1920*/
@media all and (min-width: 1900px) {
    .plan-detail-left ul li {
        width: 400px;
    }

    .plan-detail-right {
        width: 15%;
    }
}
</style>

