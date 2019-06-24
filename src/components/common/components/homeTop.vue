<template>
    <div class="info_box clearfix">
        <el-row justify="space-between" style="padding: 25px 0;">
            <el-col :span="10" class="img_col">
                <el-row>
                    <el-col :span="5">
                        <img :src="userInfo.avator" alt="" class="img_box">
                    </el-col>
                    <el-col :span="19" class="title">
                        <h2>{{dayText}},{{userInfo.username}},{{userInfo.greetings}}</h2>
                        <span>{{userInfo.duty}} | {{userInfo.dep}}-{{userInfo.phone}}</span>
                        <div class="img_col_honor">
                            <ul>
                                <li v-for="(key,index) of honorImg" :index="index" v-show="key.flag">
                                    <img :src="key.url" :alt="key.title">
                                    <i>{{key.title}}</i>
                                </li>
                            </ul>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="14" class="col_style">
                <dl v-for="(item, index) of dataArr" :key="index" class="dl_style">
                    <dt>{{item.name}}</dt>
                    <dd>{{priceFormat(item.data)}}</dd>
                </dl>
            </el-col>
        </el-row>
        <el-popover
            class="fix_style"
            placement="top-start"
            width="160"
            trigger="hover">
            <span class="popover_span">
                数据截止至 {{userInfo.endTime}}
            </span>
            <i slot="reference" class="el-icon-warning" style="color: #dfdfdf"></i>
        </el-popover>
    </div>
</template>

<script>
// 价格格式化
import commaFormat from "../../../commonFun/commaFormat.js";
export default {
    props: {
        userInfo: {
            type: Object,
            default: {},
        },
        dataArr: {
            type: Array,
            default: []
        },
        honorImg:{
            type: Array,
            default: []
        }
    },
    data(){
        return{
            dayText: '早上好',
        }
    },
    created(){
        let now = new Date();
        let hour = now.getHours();
        let info = '';
        if(hour < 6){info = "凌晨好";}
        else if (hour < 9){info = "早上好";}
        else if (hour < 12){info = "上午好";}
        else if (hour < 14){info = "中午好";}
        else if (hour < 17){info = "下午好";}
        else if (hour < 19){info = "傍晚好";}
        else if (hour < 22){info = "晚上好";}
        else {info = "夜里好";}
        this.dayText = info;
    },
    methods:{
        priceFormat(price){
            return commaFormat.format(parseInt(price));
        },
    },
}
</script>

<style scoped>
    .info_box{
        margin-top: 20px;
        position: relative;
        width: 100%;
        margin: 0 auto;
        height: 140px;
        background: #fff;
    }
    .dl_style{
        display: inline-block;
        text-align: right;
        padding: 0 32px;
        border-right: 1px solid #ececec;
    }
    .dl_style:last-child{
        border: none;
    }
    .title h2{
        font-size: 24px;
        height: 36px;
        line-height: 36px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .title span{
        font-size: 14px;
        color:rgba(0,0,0,0.45);
        line-height: 30px;
        margin-top: 20px;
    }
    .img_col{
        padding-left: 12px;
        height: 88px;
    }
    .img_box{
        display: block;
        margin: 0 auto;
        width: 88px;
        height: 88px;
        border-radius: 50%;
    }
    .col_style{
        text-align:right;
        height: 88px;
        line-height: 35px;
    }
    .col_style dt{
        font-family:PingFangSC-Regular;
        font-size: 14px;
        color:rgba(0,0,0,0.45)
    }
    .col_style dd{
        font-family:HelveticaNeue;
        font-size: 30px;
        color:rgba(0,0,0,0.85);
    }
    .fix_style{
        position: absolute;
        top: 11px;
        right: 11px;
    }
    /**/
    .img_col_honor li img{
        width: 15px;
        height: 20px;
        vertical-align: middle;
        position: relative;
        top: -2px;
    }
    .img_col_honor li{
        height: 20px;
        float: left;
        margin-right: 5px;
        background: #EDF6FF;
        font-size: 12px;
        color:rgba(168,193,209,1);
        border-radius: 2px;
        padding: 3px 6px 0 2px;
    }
</style>
