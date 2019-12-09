<template>
    <div class="price-dialog">

        <ul class="city-tab">
            <li v-for="item in changePriceData.orderCompanyList" :key="item.index" @click="changePriceData.priceCurrCompany = item.index" :class="changePriceData.priceCurrCompany == item.index?'active':''">
                <h6>{{item.city}}</h6>
                <p>{{item.company}}</p>
            </li>

        </ul>
        <div class="change-price-table-wrap">
            <div class="table">
                <ul class="fwb">
                    <li></li>
                    <li><span>广告费</span></li>
                    <li><span>制作费</span></li>
                    <li><span>小计</span></li>
                </ul>
                <ul>
                    <li><span>广告门</span></li>
                    <li>
                        <div class="num-input-wrap">
                            <span>&yen;</span>
                            <el-input-number placehlder="请输入修改金额" v-model="changePriceData.AdDoorAdPrice" controls-position="right"
                                             :controls="false"  :min="0"
                                             :max="999999999"></el-input-number>
                        </div>
                    </li>
                    <li>
                        <div class="num-input-wrap">
                            <span>&yen;</span>
                            <el-input-number placehlder="请输入修改金额" v-model="changePriceData.AdDoorMakePrice"
                                             controls-position="right" :controls="false"
                                             :min="0" :max="999999999"></el-input-number>
                        </div>
                    </li>
                    <li><span>&yen;{{priceFormat(changePriceData.AdDoorAdPrice+changePriceData.AdDoorMakePrice)||0}}</span></li>
                </ul>
                <ul>
                    <li><span>道闸</span></li>
                    <li>
                        <div class="num-input-wrap">
                            <span>&yen;</span>
                            <el-input-number placehlder="请输入修改金额" v-model="changePriceData.BreakAdPrice" controls-position="right"
                                             :controls="false"  :min="0"
                                             :max="999999999"></el-input-number>
                        </div>
                    </li>
                    <li>
                        <div class="num-input-wrap">
                            <span>&yen;</span>
                            <el-input-number placehlder="请输入修改金额" v-model="changePriceData.BreakMakePrice" controls-position="right"
                                             :controls="false"  :min="0"
                                             :max="999999999"></el-input-number>
                        </div>
                    </li>
                    <li><span>&yen;{{priceFormat(changePriceData.BreakAdPrice+changePriceData.BreakMakePrice)||0}}</span></li>
                </ul>
                <ul class="fwb">
                    <li style="width: 100%"><span>合计</span> <span>&yen;{{priceFormat(changePriceData.AdDoorAdPrice+changePriceData.AdDoorMakePrice+changePriceData.BreakAdPrice+changePriceData.BreakMakePrice)||0}}</span></li>
                </ul>
            </div>
        </div>
        <span slot="footer" class="price-dialog-footer">
                 <div class="price-tip">
                     <p>原订单总额为 <span>&yen;{{changePriceData.orderOldPrice}}</span></p>
                     <p>修改后的订单总额为 <span>&yen;{{priceFormat(changePriceData.AdDoorAdPrice+changePriceData.AdDoorMakePrice+changePriceData.BreakAdPrice+changePriceData.BreakMakePrice)||0}}</span></p>
                 </div>
               <div>
                    <el-button @click="cancelChangePrice">取 消</el-button>
                    <el-button type="primary" @click="confirmChangePrice">确 定</el-button>
               </div>
            </span>
    </div>
</template>

<script>
    import {MessageBox, Message} from 'element-ui';
    // 价格格式化
    import commaFormat from "../../../commonFun/commaFormat.js";
    export default {
        name: "changeOrderPrice",
        props:{
            changePriceData:{
                type: Object,
                default: {
                    AdDoorAdPrice: 0,
                    AdDoorMakePrice: 0,
                    BreakAdPrice: 0,
                    BreakMakePrice: 0,
                    orderOldPrice:0,
                    orderCompanyList:[],
                    priceCurrCompany:0,
                }
            },

        },
        methods:{
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
            //修改订单金额
            confirmChangePrice() {
                let totalPrice = {

                }
            },
            // 取消
            cancelChangePrice() {
                this.$emit("cancel");
            },

        }
    }
</script>

<style scoped>

    .price-dialog .city-tab{
        display: flex;
        margin-bottom: 16px;
    }
    .price-dialog .city-tab li{
        padding: 8px 16px;
        background:rgba(250,250,250,1);
        border-radius:4px;
        margin-right: 16px;
        cursor: pointer;
    }
    .price-dialog .city-tab li.active{
        border:1px solid rgba(24,144,255,1);
    }
    .price-dialog .city-tab li:last-child{
        margin-right: 0px;
    }
    .price-dialog .city-tab li h6{
        font-weight:600;
        color:rgba(0,0,0,0.85);
        margin-bottom: 4px;
    }
    .price-dialog .city-tab li p{
        color:rgba(0,0,0,0.65);
        font-size: 12px;
    }
    .price-dialog .table{
        border:1px solid rgba(0,0,0,0.15);
        border-radius: 4px;
    }
    .price-dialog .table ul{
        width: 100%;
        height: 54px;
        display: flex;
        border-bottom: 1px solid rgba(0,0,0,0.15);
        color:rgba(0,0,0,0.65);
    }
    .price-dialog .table ul.fwb{
        font-weight: bold;
        color:rgba(0,0,0,0.85);
        background-color: #FAFAFA;
    }
    .price-dialog .table ul:last-child{
        border-bottom: none;
    }
    .price-dialog .table ul:last-child li{
        display: flex;
        justify-content: space-between;
    }
    .price-dialog .table ul li span{
        padding:0 16px;
        box-sizing: border-box;
    }
    .price-dialog .table ul li{
        width: 180px;
        border-right: 1px solid rgba(0,0,0,0.15);
        line-height: 54px;
        box-sizing: border-box;
    }
    .price-dialog .table ul li:last-child{
        border-right: none;
    }
    .price-dialog  .num-input-wrap{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
    }
    .price-dialog  .num-input-wrap span{
        width: 34px;
        height: 34px;
        background:rgba(246,246,246,1);
        border-radius:4px 0px 0px 4px;
        border:1px solid rgba(217,217,217,1);
        padding: 0 !important;
        text-align: center;
        line-height: 34px;
    }
    .price-dialog /deep/ .el-input-number, .price-dialog .num-input-wrap /deep/ .el-input,.price-dialog .num-input-wrap /deep/ .el-input__inner{
        width: 115px;
        height: 34px;
        text-align: left;
    }
    .price-dialog .num-input-wrap /deep/ .el-input__inner{
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        position: relative;
        top: -2px;
    }
    .price-dialog-footer{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 25px;
        margin-bottom: 15px;
    }
    .price-dialog-footer .price-tip{
        color:rgba(0,0,0,0.65);
        font-size: 14px;
        display: flex;
    }
    .price-dialog-footer .price-tip p{
        margin-right:8px;
    }
    .price-dialog-footer .price-tip span{
        color: #1890ff;
    }

</style>
