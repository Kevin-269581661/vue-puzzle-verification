<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">刊例价</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2 style="display:inline-block;margin-right:20px;">刊例价列表</h2>
                <el-button size="small" type="primary" @click="addOne()" v-if="session_data.uType=='SM'" >新增刊例价</el-button>
            </div>
            <div class="mediaList_container">
                <div class="table_wrap">
                     <el-table border :data="publishPriceList" style="width: 100%" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                        <el-table-column label="公司名称" prop="company" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column label="城市" prop="city">
                        </el-table-column>
                        <el-table-column label="城市级别" prop="cityLevel" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{levelToText(scope.row.cityLevel) || '--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="原刊例价(/周/面)" prop="oldPrice" align="right">
                            <template slot-scope="scope">
                                <span>￥{{priceFormat(scope.row.oldPrice)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="广告门A级(/周/面)" prop="levelAprice" align="right">
                            <template slot-scope="scope">
                                <span>￥{{priceFormat(scope.row.levelAprice)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="广告门B级(/周/面)" prop="levelBprice" align="right">
                            <template slot-scope="scope">
                                <span>￥{{priceFormat(scope.row.levelBprice)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="广告门C级(/周/面)" prop="levelCprice" align="right">
                            <template slot-scope="scope">
                                <span>￥{{priceFormat(scope.row.levelCprice)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="道闸(/月/杆)" prop="barrierPrice" align="right">
                            <template slot-scope="scope">
                                <span>￥{{priceFormat(scope.row.barrierPrice)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" v-if="session_data.uType=='SM'" >
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click.native.prevent="edit(scope.row, scope.$index)">编辑
                                </el-button>
                                <el-button type="text" size="small" @click.native.prevent="delOne(scope.row, scope.$index)">删除
                                </el-button>
                                <el-button type="text" size="small" @click.native.prevent="setting(scope.row, scope.$index)">设置
                                </el-button>
                            </template>
                        </el-table-column>

                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>
                </div>
            </div>
        </div>
        <!--新增刊例价或者编辑刊例价模态框-->
        <el-dialog
            width="30%"
            :title="dialogTitle==1?'新增刊例价':'编辑刊例价'"
            :visible.sync="isShowPrice">
            <div class="priceInfo_box">
                <template v-if="dialogTitle==2">
                    <div class="new_box">
                        <p style="font-size:16px;"><b>{{priceInfo.company}}</b></p>
                        <b style="margin-right:20px;">{{priceInfo.city}}</b>
                        <el-select v-model="priceInfo.cityLevel" placeholder="请选择" @change="selectLevel()">
                            <el-option v-for="item in cityLevelArr" :key="item.level" :label="item.name" :value="item.level"></el-option>
                        </el-select>
                        <hr class="hr_style">
                    </div>
                </template>
                <template v-if="dialogTitle==1">
                    <el-select v-model="priceInfo.asrID" placeholder="请选择所属公司" filterable >
                        <el-option v-for="item of companyArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-cascader :options="allProvince" v-model="priceInfo.cityArr" separator="-" :show-all-levels="false" @change="seleProClient" @active-item-change="handleItemChange"></el-cascader>   
                    <el-select v-model="priceInfo.cityLevel" placeholder="请选择" @change="selectLevel()">
                        <el-option v-for="item in cityLevelArr" :key="item.level" :label="item.name" :value="item.level"></el-option>
                    </el-select>
                    <hr class="hr_style">
                </template>
                <div class="radio_box">
                    <el-radio-group v-model="priceInfo.mediaType" size="small">
                        <el-radio-button v-for="item in mediaTypeArr" :label="item" :key="item">{{item}}</el-radio-button>
                    </el-radio-group>
                </div>

                <template v-if="priceInfo.mediaType=='广告门'">
                    <el-card class="box-card marginTop">
                        <div slot="header" class="clearfix">
                            <el-radio v-model="priceInfo.priceType" :label="2">不使用媒体分层设置刊例价</el-radio>
                        </div>
                        <el-row>
                            <el-col :span="24" class="longInput">
                                <el-input-number v-model="priceInfo.oldPrice" controls-position="right" size="small" :disabled="priceInfo.priceType==1"></el-input-number>                        
                            </el-col>
                        </el-row>
                    </el-card>
                    <el-card class="box-card marginTop">
                        <div slot="header" class="clearfix">
                            <el-radio v-model="priceInfo.priceType" :label="1">采用媒体分层</el-radio>
                        </div>
                        <el-row>
                            <el-col :span="24">
                                <b>A级:</b>
                                <el-input-number v-model="priceInfo.levelPrice.A" controls-position="right" size="small" :disabled="priceInfo.priceType==2"></el-input-number> 
                            </el-col>
                            <el-col :span="24" class="marginTop">
                                <b>B级:</b>
                                <el-input-number v-model="priceInfo.levelPrice.B" controls-position="right" size="small" :disabled="priceInfo.priceType==2"></el-input-number>                        
                            </el-col>
                            <el-col :span="24" class="marginTop">
                                <b>C级:</b>
                                <el-input-number v-model="priceInfo.levelPrice.C" controls-position="right" size="small" :disabled="priceInfo.priceType==2"></el-input-number>                        
                            </el-col>
                        </el-row>
                    </el-card>
                </template>
                <template v-else>
                    <el-row>
                        <el-col :span="24" class="marginTop">
                            <el-input-number v-model="priceInfo.barrierPrice" controls-position="right" size="small"></el-input-number>                        
                        </el-col>
                    </el-row>
                </template>
            </div>
            <span slot="footer">
                <el-button size="small" @click="isShowPrice = false">取消</el-button>
                <el-button size="small" type="primary" @click="savePrice()">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import api from "../../api/api.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
import noSearchResult from "./components/noSearchResult.vue";

import {
    Table,
    TableColumn,
    Input,
    Button,
    MessageBox,
    Message,
    Select,
    Option,
    Cascader
} from "element-ui";

export default {
    name: "publishPriceList",
    components: {
        noSearchResult,
        elTable: Table,
        elTableColumn: TableColumn,
        elInput: Input,
        elButton: Button,
        elSelect: Select,
        elOption: Option,
        elCascader: Cascader
    },
    data() {
        return {
            // 加载中
            loading: false,
            // 登录信息
            session_data: {},
            // 公司信息
            companyArr: [],
            // 是否弹出弹出框
            isShowPrice: false,
            dialogTitle: 1,
            // 弹出框绑定值
            priceInfo: {
                asrID: '',
                company:'',
                rid: '',
                priceId: 0,
                city: '',
                cityLevel: 1,
                mediaType: '广告门',
                priceType: 2, //(原来的设置为2,采用媒体分层为1)
                oldPrice: 2800,
                levelPrice: {
                    A: 3800,
                    B: 2800,
                    C: 1800,
                },
            },
            copyPrice: {
                priceId: '',
                rid: '',
                A: '',
                B: '',
                C: '',
            },
            // 城市级别数组
            cityLevelArr:[
                {
                    level: 1,
                    name: '一线城市(北上广深)'
                },
                {
                    level: 2,
                    name: '二线城市(省会及经济发达城市)'
                },
                {
                    level: 3,
                    name: '三四线城市(地、县级市)'
                },
            ],
            // 媒介载体类型
            mediaTypeArr: ['广告门', '道闸'],
            // 表格数据
            publishPriceList: [],
            allProvince:[],
        };
    },
    created() {
        this.session_data = JSON.parse(sessionStorage.getItem("session_data"));
        this.getAreaData();
        this.getData();
        this.getCompany();
    },
    methods: {
        // 价格加上逗号
        priceFormat(price) {
            return commaFormat.format(price);
        },
        // 公司数据
        getCompany(){
            let sess = this.session_data;
            if(sess.ascType == 0){
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                };
                api.getApi(this.apiVar.UCAPI+'/ShowAscr', info).then(res =>{
                    console.log(res.data);
                    if(!res.data.SysCode){
                        let result = [];
                        for(let data of res.data){
                            let obj = {
                                label: data.asName,
                                value: data.asrID,
                            };
                            result.push(obj);
                        }
                        this.companyArr = result;
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err=>{
                    console.log(err);
                });
            }else{
                this.companyArr = [
                    {
                        label: sess.asName,
                        value: sess.asrID
                    }
                ];
            }
        },
        // 获取所有区域信息
        getAreaData() {
            let info = {
                uid: this.session_data.uID,
                token: this.session_data.token,
                service:"GetCityByAsrID",
                data: {}
            };
            api.postApi_new(this.apiVar.Media, info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    let resinfo = res.data.data;
                    let result = [];
                    for(let data of resinfo){
                        let obj = {
                            label: data.pRName,
                            value: data.pRID,
                            children: [],
                        };
                        for(let city of data.cities){
                            let cityobj = {
                                label: city.cRName,
                                value: city.cRID,
                            };
                            obj.children.push(cityobj);
                        }
                        result.push(obj);
                    }
                    this.allProvince = result;
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
                }
            }).catch(err =>{
                console.log(err);
            });
        },
        // 获取刊例价列表
        getData(){
            let info = {
                uid: this.session_data.uID,
                token: this.session_data.token,
                service:"GetAdPrice",
                data: {}
            };
            api.postApi_new(this.apiVar.Media, info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    let result = [];
                    for(let data of res.data.data){
                        let obj = this.setData(data);
                        result.push(obj);
                    }
                    this.publishPriceList = result;
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
                }
            }).catch(err =>{
                console.log(err);
            })
        },
        // 城市级别展示
        levelToText(level){
            for(let data of this.cityLevelArr){
                if(data.level == level){
                    return data.name;
                }
            }
        },
        seleProClient(val) {
            this.priceInfo.cityArr = val;
            console.log(this.priceInfo.cityArr);
        },
        // 点击省级去显示其对应市级
        handleItemChange(val) {
            console.log("select", val);
        },
        // 新增刊例价
        addOne(){
            this.dialogTitle = 1;
            this.isShowPrice = true;
            this.priceInfo = {
                asrID: '',
                company: '',
                rid: '',
                priceId: '',
                city: '',
                cityLevel: '',
                mediaType: '广告门',
                priceType: '', //(原来的设置为2,采用媒体分层为1)
                oldPrice: '',
                barrierPrice: '',
                levelPrice: {
                    A: '',
                    B: '',
                    C: '',
                },
            };
        },
        // 编辑
        edit(row, index){
            this.dialogTitle = 2;
            console.log(row, index);
            this.priceInfo = {
                asrID: row.asrID,
                company: row.company,
                rid: row.rid,
                priceId: row.priceId,
                barrierId: row.barrierId,
                city: row.city,
                cityLevel: row.cityLevel,
                mediaType: '广告门',
                priceType: row.priceType, //(原来的设置为2,采用媒体分层为1)
                oldPrice: row.oldPrice,
                barrierPrice: row.barrierPrice,
                levelPrice: {
                    A: row.levelAprice,
                    B: row.levelBprice,
                    C: row.levelCprice,
                },
            };
            this.copyPrice = {
                asrID: row.asrID,
                company: row.company,
                priceId : row.priceId,
                rid: row.rid,
                A: row.levelAprice,
                B: row.levelBprice,
                C: row.levelCprice,
            };
            console.log('edit---', this.priceInfo);
            this.isShowPrice = true;
        },
        // 保存信息
        savePrice(){
            console.log(this.priceInfo);
            let pInfo = this.priceInfo;
            let data = {
                "asrID": pInfo.asrID,
                "rid": (pInfo.priceId|| pInfo.barrierId)?pInfo.rid: pInfo.cityArr[1], //必填
                "classified": pInfo.priceType,
                "barrierPrice": pInfo.barrierPrice*100,
            };
            console.log('data---', data);
            if(pInfo.priceType == 1){
                if(pInfo.cityLevel && pInfo.levelPrice.A && pInfo.levelPrice.B && pInfo.levelPrice.C){
                    data.cityLevel = pInfo.cityLevel;
                    data.levelAPrice = pInfo.levelPrice.A*100;
                    data.levelBPrice = pInfo.levelPrice.B*100;
                    data.levelCPrice = pInfo.levelPrice.C*100;
                }else{
                    Message.warning('采用媒体分层后级别价格不能为空');
                    return;
                }
            }else{
                data.oldPrice = pInfo.oldPrice*100;
            }
            if(pInfo.priceId || pInfo.barrierId){
                let info = {
                    uid: this.session_data.uID,
                    token: this.session_data.token,
                    service:"SetAdPrice",
                    data: data
                };
                // 编辑
                api.postApi_new(this.apiVar.Media, info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        let priceList = this.publishPriceList;
                        for(let i = 0, len=priceList.length;i < len; i++){
                            if(priceList[i].rid == pInfo.rid && priceList[i].asrID == pInfo.asrID){
                                let resInfo = res.data.data;
                                priceList[i] = this.setData(resInfo);
                                break;
                            }
                        }
                        this.publishPriceList.push();
                        this.isShowPrice = false;
                        Message.success(res.data.MSG);
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            }else{
                let info = {
                    uid: this.session_data.uID,
                    token: this.session_data.token,
                    service:"AddPrice",
                    data: data
                };
                // 新增
                api.postApi_new(this.apiVar.Media, info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        this.isShowPrice = false;
                        Message.success(res.data.MSG);
                        let resInfo = res.data.data;
                        let returnInfo = this.setData(resInfo);
                        this.publishPriceList.unshift(returnInfo);
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            }
        },
        // 数据格式化
        setData(data){
            let obj = {
                priceId: data.priceId, 
                barrierId: data.barrierId, 
                company: data.asName,
                asrID: data.asrID,
                city: data.city,
                rid: data.rid,
                cityLevel: data.cityLevel,
                priceType: data.classified?data.classified:2,
                oldPrice: data.adPrice/100,
                levelAprice: data.gradeA/100,
                levelBprice: data.gradeB/100,
                levelCprice: data.gradeC/100,
                barrierPrice: data.barrierPrice/100, 
            };  
            return obj;                  
        },
        // 删除
        delOne(row, index){
            console.log(row, index);
            MessageBox.confirm('是否确认删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(res =>{
                console.log(res);
                let info ={
                    uid: this.session_data.uID,
                    token: this.session_data.token,
                    service:"DelAdPrice",
                    data: {
                        rid: row.rid,
                        asrID: row.asrID
                    }
                };
                api.postApi_new(this.apiVar.Media, info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        Message.success(res.data.MSG);
                        this.publishPriceList.splice(index, 1);
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            }).catch(err =>{
                console.log(err);
            });
        },
        // 设置
        setting(row, index){
            console.log(row, index);
            if(row.priceType == 1){
                let info = {
                    city: row.city,
                    rid: row.rid,
                    company: row.company,
                    asrID: row.asrID,
                    amID: row.priceId
                };
                sessionStorage.setItem('setPriceInfo', JSON.stringify(info));
                this.$router.push('./settingPrice');
            }else{
                Message.warning('该城市没有设置媒体分层，请先设置媒体分层');
            }
        },
        // 选择城市级别
        selectLevel(){
            console.log(this.priceInfo);
            let info = this.priceInfo;
            let copyInfo = this.copyPrice;
            let arr = [
                {
                    cityLevel: 1,
                    price: {
                        A: 3080,
                        B: 2380,
                        C: 1800
                    }
                },
                {
                    cityLevel: 2,
                    price: {
                        A: 2380,
                        B: 1800,
                        C: 1380
                    }
                },
                {
                    cityLevel: 3,
                    price: {
                        A: 1800,
                        B: 1380,
                        C: 1080
                    }
                },
            ];
            if(info.priceId || info.barrierId){
                if(info.priceType == 1){
                    let defaultPrice = {};
                    for(let data of arr){
                        if(info.cityLevel == data.cityLevel){
                            defaultPrice = data.price;
                            console.log(defaultPrice);
                            break;
                        }
                    }
                    // info.levelPrice.A = copyInfo.A?copyInfo.A: defaultPrice.A;
                    // info.levelPrice.B = copyInfo.B?copyInfo.B: defaultPrice.B;
                    // info.levelPrice.C = copyInfo.C?copyInfo.C: defaultPrice.C;
                    info.levelPrice.A = defaultPrice.A?defaultPrice.A: copyInfo.A;
                    info.levelPrice.B = defaultPrice.B?defaultPrice.B: copyInfo.B;
                    info.levelPrice.C = defaultPrice.C?defaultPrice.C: copyInfo.C;
                }
            }else{
                for(let data of arr){
                    if(info.cityLevel == data.cityLevel){
                        info.levelPrice.A = data.price.A;
                        info.levelPrice.B = data.price.B;
                        info.levelPrice.C = data.price.C;
                        break;
                    }
                }
            }
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
    }
};
</script>
<style scoped>
.changeInput {
    width: 150px;
    display: none;
}

/*筛选*/
.el-checkbox + .el-checkbox {
    margin-left: 0;
}

.typeBox p {
    height: 30px;
    font-size: 12px;
    text-align: center;
    line-height: 30px;
    border-top: 1px solid #cccccc;
}

/deep/ .el-checkbox__label {
    font-size: 10px;
    color: #8a8a8a;
}

/deep/ .el-input__inner {
    width: 100%;
    height: 30px;
}

/deep/ .el-popper[x-placement^="bottom"] {
    min-width: 9.6% !important;
}

/*表格高度*/
/deep/ .el-table__body-wrapper {
    height: 405px;
}

/deep/ .priceInfo_box .el-row{
    margin-bottom: 10px;
}
/deep/ .priceInfo_box .el-input-number--small{
    width: 89%;
}
/deep/ .priceInfo_box .el-input-number.is-controls-right .el-input__inner{
    padding-left: 0px;
    padding-right: 40px;
}
/deep/ .priceInfo_box .el-input-number .el-input{
    width: 100%;
}
/deep/ .priceInfo_box .longInput .el-input-number--small{
    width: 99%;
}
.marginTop{
    margin-top: 15px;
}
.radio_box{
    display:block;
    margin: 0 auto;
    text-align:center;
}
/deep/ .radio_box .el-radio-button, .el-radio-button__inner{
    width: 100px;
}

/deep/ .radio_box .el-radio-button__orig-radio:checked+.el-radio-button__inner, 
/deep/ .radio_box .el-radio-button__orig-radio:checked+.el-radio-button__inner,
/deep/ .radio_box .el-radio-button--small .el-radio-button__inner{
    width: 100px !important;
}

/deep/ .priceInfo_box .el-card__header{
    padding: 10px 20px
}
.hr_style{
    height:1px;
    border:none;
    border-top:1px solid #ebeef5;
}
/deep/ .priceInfo_box .new_box .el-select{
    width: 81%;
}
/deep/ .priceInfo_box .new_box .el-input{
    width: 100%;
}
/deep/ .priceInfo_box .el-select, .priceInfo_box .el-cascader{
    width: 100%;
}
/deep/ .priceInfo_box .el-input{
    width: 100%;
}
/deep/  .el-dialog__body{
    padding: 15px 20px;
}
</style>

