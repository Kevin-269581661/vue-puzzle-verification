<template>
    <div class="clearfix">
        <div class="right-content-wrap">
            <div class="right-title">
                <h1>消费偏好: <i>{{formatTime(selectRes.bdsday)+'-'+formatTime(selectRes.bdday)}}</i></h1>
                <!--<div class="houseAttr">-->
                <!--<span>住户属性：</span>-->
                <!--<span>-->
                <!--<el-radio-group size="mini" v-model="houseAttr">-->
                <!--<el-radio-button label="人流"></el-radio-button>-->
                <!--<el-radio-button label="社区人流"></el-radio-button>-->
                <!--<el-radio-button label="居民"></el-radio-button>-->
                <!--<el-radio-button label="访客"></el-radio-button>-->
                <!--</el-radio-group>-->
                <!--</span>-->
                <!--</div>-->
                <div class="costType">
                    <span>消费分类：</span>
                    <span>
                        <el-radio-group size="mini" v-model="costType" @change="chooseCostType(costType)">
                            <el-radio-button v-for="type in costOptions" :label="type.name" :key="type.id"></el-radio-button>
                        </el-radio-group>
                    </span>
                </div>
            </div>
            <div class="right-content">
                <div class="style2-wrap">
                    <div class="right-charts-table" v-for="(item,index) in IndustryArr" :key="index" v-if="item.arr.length || item.dataArr.length || item.nameArr.length" :class="IndustryArr.length == 1?'wholeDiv':''">
                        <div class="right-charts-left-title">
                            <h1>{{item.tit}}</h1>
                        </div>
                        <template v-if="item.parentId ==34 || item.parentId ==35 || item.parentId ==37 || item.parentId ==38">
                            <!-- 汽车行业 -->
                            <template  v-if="item.parentId ==34">
                                <template v-if="item.key==1001 || item.key==1002 || item.key==1003 || item.key==1004">
                                    <template v-if="item.key==1001">
                                        <pie :data="item.arr" :id="'pie'+item.key"></pie>
                                    </template>
                                    <template v-if="item.key==1002 || item.key==1003 || item.key==1004">
                                        <bar :data="item.dataArr" :name="item.nameArr" :id="'bar'+item.key"></bar>
                                    </template>
                                </template>
                                <rank :data="item" v-else :key="item.parentId+'-'+item.key" :labelText="textType(item.parentId, item.key)"></rank>
                            </template>
                            <!-- 酒店行业 -->
                            <template  v-if="item.parentId ==35">
                                <template v-if="item.key==302 || item.key==303">
                                    <template v-if="item.key==302">
                                        <pie :data="item.arr" :id="'pie'+item.key"></pie>
                                    </template>
                                    <template v-if="item.key==303">
                                        <bar :data="item.dataArr" :name="item.nameArr" :id="'bar'+item.key"></bar>
                                    </template>
                                </template>
                                <rank :data="item" v-else :key="item.parentId+'-'+item.key" :labelText="textType(item.parentId, item.key)"></rank>
                            </template>
                            <!-- 美妆护肤 -->
                            <template  v-if="item.parentId ==37">
                                <template v-if="item.key==1204">
                                    <bar :data="item.dataArr" :name="item.nameArr" :id="'bar'+item.key"></bar>
                                </template>
                                <rank :data="item" v-else :key="item.parentId+'-'+item.key" :labelText="textType(item.parentId, item.key)"></rank>
                            </template>
                            <!-- 服装鞋包 -->
                            <template  v-if="item.parentId ==38">
                                <template v-if="item.key==1301 || item.key==1302">
                                    <pie :data="item.arr" :id="'pie'+item.key"></pie>
                                </template>
                                <rank :data="item" v-else :key="item.parentId+'-'+item.key" :labelText="textType(item.parentId, item.key)"></rank>
                            </template>
                        </template>
                        <!-- 其他行业 -->
                        <rank :data="item" v-else :key="item.parentId+'-'+item.key" :labelText="textType(item.parentId, item.key)"></rank>
                    </div >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { api } from '../../api/api';
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import sessFun from "../../commonFun/sessFun.js";
    // 消费偏好转换中文
    import hoppyToText from "../../commonFun/hoppyToText.js";
    import hoppyNumToText from "../../commonFun/hoppyNumToText.js";
    import rank from './components/rank.vue';
    import pie from './components/pie.vue';
    import bar from './components/bar.vue';
    import { Message } from 'element-ui';
    export default {
        name: "costPreferences",
        props:{
            selectRes:{}
        },
        components:{
            rank,
            pie,
            bar,
        },
        data() {
            return {
                // 登录信息
                sessionData:{},
                size: {
                    width: 300,
                    height: 300
                },
                houseAttr: '人流',
                costType: '汽车行业',
                costOptions: ['汽车行业', '电影行业', '餐饮行业', '通用零售', '酒店行业','母婴行业'],
                IndustryArr:[
                    {tit:'用户爱好',
                        arr:[
                            {
                                rank: 1,
                                tag: '购物达人',
                                ratio: 0.3263
                            },
                            {
                                rank: 9,
                                tag: '游戏达人',
                                ratio: 0.3009
                            },
                            {
                                rank: 10,
                                tag: '健身达人',
                                ratio: 0.2512
                            }
                        ],
                    },
                    {tit:'童车童床品类偏好',
                        arr:[
                            {
                                rank: 1,
                                tag: '婴儿床',
                                ratio: 0.4237
                            },
                            {
                                rank: 2,
                                tag: '婴儿推车',
                                ratio: 0.3559
                            },
                            {
                                rank: 3,
                                tag: '学步车',
                                ratio: 0.1525
                            },
                            {
                                rank: 4,
                                tag: '自行车',
                                ratio: 0.8470
                            },
                            {
                                rank: 5,
                                tag: '三轮车',
                                ratio: 0.5080
                            }, {
                                rank: 6,
                                tag: '滑板车',
                                ratio: 0.5080
                            },
                            {
                                rank: 7,
                                tag: '餐椅',
                                ratio: 0.3390
                            },
                            {
                                rank: 8,
                                tag: '伞车',
                                ratio: 0.1690
                            },
                            {
                                rank: 9,
                                tag: '扭扭车',
                                ratio: 0.1690
                            },
                        ],
                    },
                    {tit:'妈妈用品偏好',
                        arr:[
                            {
                                rank: 1,
                                tag: '妈咪包',
                                ratio: 0.1560
                            },

                        ],
                    },
                    {tit:'活跃母婴社区',
                        arr:[
                            {
                                rank: 1,
                                tag: '丫丫网',
                                ratio: 0.1420
                            },

                        ],
                    },
                    {tit:'关注母婴亲子品牌',
                        arr:[
                            {
                                rank: 1,
                                tag: '优家宝贝',
                                ratio: 0.1480
                            }
                        ],
                    },
                ],
            }
        },
        methods: {
            textType(parentid, id){
                console.log('parent_id', parentid, id);
                let str = '';
                if(parentid==101 || parentid==100){
                    str = '应用';
                }
                if(parentid == 31){
                    if(id == 10){
                        str = '行业';
                    }else{
                        str = '品牌';
                    }
                }
                if(parentid == 38){
                    str = '品牌';
                }
                return str;
            },
            // 获取默认数据
            getInitData(typeId){
                // apid[必填]	订单ID
                // resid[选填] 社区唯一标识
                // bdday[必填] 开始时间
                // bdsday[必填] 结束时间
                // uid[必填] 用户唯一标识
                // tooken[必填] 登陆凭证
                // procode[必填] 消费偏好对应ID(31，32，33，34，35，36，37，38，100，101)
                let session = this.sessionData;
                let startTime = this.formatTime(this.selectRes.bdsday);
                let endTime = this.formatTime(this.selectRes.bdday);
                console.log('this.selectRes+++++++', this.selectRes);
                let info = {};
                if(this.selectRes.resID){
                    info = {
                        apid: sessionStorage.getItem('AD_apid'),
                        resid: this.selectRes.resID,
                        bdday: startTime,
                        bdsday: endTime,
                        uid: session.uID,
                        tooken: session.token,
                        procode: typeId?typeId:sessionStorage.getItem('ctList_data').split(',')[0]
                    };
                }else{
                    info = {
                        apid: sessionStorage.getItem('AD_apid'),
                        bdday: startTime,
                        bdsday: endTime,
                        uid: session.uID,
                        tooken: session.token,
                        procode:  typeId?typeId:sessionStorage.getItem('ctList_data').split(',')[0]
                    };
                }
                // // 测试数据
                // let dataArr = [
                //     {
                //         tIIR: '{"1301":[{"tag":"耐克","ratio":0.4444},{"tag":"优衣库","ratio": 0.5666}],"1302":[{"tag":"耐克","ratio":0.4444},{"tag":"优衣库","ratio": 0.5666}],"1303": [{"tag":"新秀丽","ratio":0.4881},{"tag":"阿拉蕾","ratio":0.4881}], "1304":[{"tag":"耐克","ratio":0.4444},{"tag":"优衣库","ratio": 0.5666}],"1006":[{"tag":"耐克","ratio":0.4444},{"tag":"优衣库","ratio": 0.5666}]}'
                //     }
                // ];
                // let result = [];
                // for(let data of dataArr){
                //     console.log('dataArr-----', data);
                //     let initData = JSON.parse(data.tIIR);
                //     console.log(initData);
                //     for(let key in initData){
                //         let jsToText = hoppyNumToText.toObj(key);
                //         let info = {
                //             parentId: jsToText.parentId,
                //             key: key,
                //             tit: jsToText.text,
                //             arr: initData[key].sort(this.compareValue),
                //             nameArr: [],
                //             dataArr: []
                //         };
                //         if((info.parentId != 31) && (info.parentId != 32) && (info.parentId != 33) && (info.parentId != 36)){
                //             for(let item of info.arr){
                //                 item.name = item.tag;
                //                 item.value = item.ratio;
                //                 info.nameArr.push(item.tag);
                //                 info.dataArr.push(item.ratio);
                //             }
                //         }
                //         result.push(info);
                //     }
                // }
                // console.log('result--------', result);
                // this.IndustryArr = result;

                // 真实数据
                api.getApi(this.apiVar.QZhike+'/GetPianHao', info).then(res=>{
                    console.log(res.data);
                    if(res.data){
                        if(res.data.SysCode == 700200){
                            this.loginTimeout();
                        }
                        if(res.data.length){
                            let dataArr = res.data;
                            let result = [];
                            if(info.procode ==100){
                                for(let data of dataArr){
                                    console.log('100----------', data.Data);
                                    let initData = JSON.parse(data.Data);
                                    let json_info = {
                                        parentId: 100,
                                        key: 100,
                                        tit: 'APP分类',
                                        arr: initData.sort(this.compareValue),
                                        nameArr: [],
                                        dataArr: []
                                    };
                                    for(let item of initData){
                                        console.log('100data--------', item);
                                        // let jsToText = hoppyNumToText.toObj(key);
                                        item.name = item.tag || item.app_category;
                                        item.tag = item.tag || item.app_category;
                                        console.log('item.name------', item.name);
                                        item.value = item.ratio;
                                        json_info.nameArr.push(item.tag);
                                        json_info.dataArr.push(item.ratio);

                                    }
                                    result.push(json_info);
                                }
                            }else{
                                for(let data of dataArr){
                                    console.log('dataArr-----', data);
                                    let initData = JSON.parse(data.Data);
                                    console.log(initData);
                                    for(let key in initData){

                                        console.log('key--------------', key);
                                        let jsToText = hoppyNumToText.toObj(key, typeId);
                                        let json_info = {
                                            parentId: jsToText.parentId,
                                            key: key,
                                            tit: jsToText.text,
                                            arr: initData[key].sort(this.compareValue),
                                            nameArr: [],
                                            dataArr: []
                                        };
                                        // if((json_info.parentId != 31) && (json_info.parentId != 32) && (json_info.parentId != 33) && (json_info.parentId != 36)){
                                            for(let item of json_info.arr){
                                                item.name = item.tag || item.app;
                                                item.tag = item.tag || item.app;
                                                console.log('item.name------', item.name);
                                                item.value = item.ratio;
                                                json_info.nameArr.push(item.tag);
                                                json_info.dataArr.push(item.ratio);
                                            }
                                        // }
                                        result.push(json_info);
                                    }
                                }
                            }
                            console.log('result-------------', result);
                            this.IndustryArr = result;
                        }
                    }else{
                        Message.warning(res.data.MSG);
                    }
                });
            },
            // 比较大小（由大到小）
            compareValue(a, b){
                let val1 = a.ratio;
                let val2 = b.ratio;
                return val2-val1;
            },
            // 获取消费偏好
            getHoppyData(){
                // costOptions
                // console.log(hoppyNumToText.toText(1));
                let ctListData = sessionStorage.getItem('ctList_data');
                // let ctListData = '34,36';
                let costArr = [];
                for(let data of ctListData.split(',')){
                    let obj = hoppyToText.getSimpleName(data);
                    if(JSON.stringify(costArr).indexOf(JSON.stringify(obj)) === -1){
                        costArr.push(obj);
                    }
                }
                console.log('costArr----------', costArr);
                this.costOptions = costArr;
            },
            //消费分类选择
            chooseCostType(type) {
                let resultId = '';
                for(let data of this.costOptions){
                    if(data.name == type){
                        resultId = data.id;
                        break;
                    }
                }
                this.getInitData(resultId);
            },
            // 时间格式规范
            formatTime(val) {
                return dateFormat.toDate(val, "/");
            },
            loginTimeout() {
                Message.warning("登录超时,请重新登录");
                this.$router.push("/login");
            },
        },
        mounted() {
            this.sessionData = sessFun.getSess();
            console.log('selectRes-----------', this.selectRes);
            this.getHoppyData();
            this.costType = this.costOptions[0].name;
            this.getInitData(this.costOptions[0].id);
            console.log('costey--fda', this.costType);
        },
        watch:{
            selectRes(){
                console.log('this.selectRes-----', this.selectRes);
                this.getInitData();
                this.costType = this.costOptions[0].name;
            },
        },
    }
</script>

<style scoped>
    @font-face {
        font-family: DINPro-Medium;
        src: url("fonts/DINPro-Medium.otf"), url("fonts/DINPro-Medium.ttf");
    }

    @font-face {
        font-family: DINPro-Regular;
        src: url("fonts/DINPro-Regular.otf");
    }

    @font-face {
        font-family: DINCond-Bold;
        src: url("fonts/DINCond-Bold.otf");
    }

    .right-content-wrap {
        /*padding-left: 188px;*/
        padding-left: 165px;
        /* padding-top: 62px; */
    }

    .right-content-wrap .right-title {
        height: 44px;
        width: 100%;
        background-color: #fff;
        display: flex;
        padding: 12px 24px;
        border-bottom: 1px solid #DEDEDE;
        box-sizing: border-box;
        line-height: 18px;
    }

    .right-content-wrap h1 {
        font-weight: bold;
    }

    .right-content-wrap i {
        font-size: 12px;
        color: #A3A3A3;
        font-weight: normal;
        font-style: normal;
        /* margin-left: 10px; */
    }

    .houseAttr {
        display: flex;
        margin-left: 50px;
        align-items: center;
        border-right: 1px solid #d8d8d8;
        padding-right: 20px;
    }

    .houseAttr span, .costType span {
        font-size: 14px;
        color: #525151;
        float: left;
    }

    .costType {
        border-right: none;
        margin-left: 35px;
    }

    /deep/ .el-radio-button, .el-radio-button__inner {
        /* width: inherit; */
    }

    /deep/ .el-radio-button__inner {
        border: none;
    }

    /deep/ .el-radio-button--mini .el-radio-button__inner {
        padding: 5px 12px;
        border-left: none;
        /*color: #979797;*/
    }

    /deep/ .el-radio__label {
        color: #979797;
        font-size: 12px;
    }

    /deep/ .el-radio-button.is-checked .el-radio-button__inner {
        background-color: #ffffff;
        color: #4AA6FC;
        border: 1px solid #4aa6fc;
    }

    .pies {
        width: 365px;
        height: 350px;
    }

    /*列表样式*/
    .style2-wrap {
        /* width: 100%; */
        padding: 22px;
        display: flex;
        flex-wrap: wrap;
        /*justify-content: space-between;*/
    }

    .right-charts-table {
        width: 32%;
        box-sizing: border-box;
        background-color: #fff;
        border: 1px solid #dedede;
        margin: 0px 7px 24px 7px;
    }
    .wholeDiv.right-charts-table{
        width: 100%;
    }

    .right-charts-left-title h1 {
        border-bottom: 1px solid #dedede;
        height: 48px;
        line-height: 48px;
        padding-left: 24px;
    }

    /* .right-charts-left-list {
        padding: 0 24px;
    } */

    /deep/ .el-progress-bar__innerText {
        display: none;
    }

    /deep/ .el-table .cell {
        text-align: center;
    }

    /deep/ .el-table .cell img {
        width: 18px;
        height: 24px;
    }


    /*1440*/
    @media all and (min-width: 1420px) {

    }

    /*1920*/
    @media all and (min-width: 1900px) {

        .pies {
            width: 550px;
            height: 290px;
        }

        .costType .el-radio-group {
            width: 750px;
        }

    }
</style>

<style>
    .right-title .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: #409eff;
        background-color: #ffffff;
        border: 1px solid #409eff;
        /*border-left: none;*/
    }

    .right-title .el-radio-button:first-child .el-radio-button__inner {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        /*border-left: 1px solid #409eff;*/
    }

    .right-title .el-radio-button:last-child .el-radio-button__inner {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border-left: 1px solid #409eff;
    }

    .right-title .el-radio-button + .el-radio-button .el-radio-button__inner {
        border-left: none;
    }

    .costType .el-radio-group {
        font-size: 0;
        display: flex;
        /*overflow-x: scroll;*/
        width: 383px;
        padding-bottom: 6px;
        position: relative;
        top: -3px;
    }

    .costType .el-radio-group::-webkit-scrollbar {
        width: 40px;
        height: 4px;
        background: #FAFAFA;
    }

    .costType .el-radio-group::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }


</style>
