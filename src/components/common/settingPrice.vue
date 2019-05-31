<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <span @click="toList()" class="span_a">刊例价 / </span>
                <span>{{cityInfo.company}}({{cityInfo.city}})</span>
                <a href="#" style="color: #999">媒体级别条件设置</a>
            </p>
        </div> 
        <div class="mediaList_wrap">
            <div class="mediaList_container">
                <div class="main_box">
                    <div class="mediaList_head">
                        <h2>{{cityInfo.company}} ({{cityInfo.city}}) 媒体级别条件设置</h2>
                    </div>
                    <div class="table_wrap">
                        <el-table border :data="settingList" style="width: 100%;height:200px" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                            <el-table-column label="条件" prop="name">
                            </el-table-column>
                            <el-table-column label="1级" prop="score_25">
                                <template slot-scope="scope" >
                                    <div v-if="!scope.row.isEdit">
                                        <span v-if="scope.row.type!=4">大于</span> 
                                        <span>{{scope.row.score_25}}</span>
                                        {{scope.row.type==3 ?'%':''}}
                                        <span>{{getUnit(scope.row.type)}}</span>
                                    </div>
                                    <div v-if="scope.row.isEdit">
                                        <template v-if="scope.row.type==3">
                                            &gt;<el-input-number v-model="scope.row.score_25" controls-position="right" size="small" :min="0" :max="100"></el-input-number>%                                                                        
                                        </template>
                                        <template v-else>
                                            &gt;<el-input-number v-model="scope.row.score_25" controls-position="right" size="small" :min="0"></el-input-number>                                                                                                                    
                                        </template>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="2级" prop="score_15">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.isEdit">
                                        <template v-if="scope.row.type!=4">
                                            <span>{{scope.row.score_25}}</span>
                                            {{scope.row.type==3 ?'%':''}}~
                                            <span>{{scope.row.score_15}}</span>
                                            {{scope.row.type==3 ?'%':''}}
                                            <span>{{getUnit(scope.row.type)}}</span>
                                        </template>
                                        <template v-else>
                                            <span>{{scope.row.score_15}}</span>
                                        </template>
                                    </div>
                                    <div v-if="scope.row.isEdit">
                                        <template v-if="scope.row.type==3">
                                            <el-input-number v-model="scope.row.score_25" controls-position="right" size="small" :min="0" :max="100"></el-input-number>% ~                                                                       
                                            <el-input-number v-model="scope.row.score_15" controls-position="right" size="small" :min="0" :max="100"></el-input-number>%   
                                        </template>
                                        <template v-else>
                                            <el-input-number v-model="scope.row.score_25" controls-position="right" size="small" :min="0"></el-input-number>  ~                                                                       
                                            <el-input-number v-model="scope.row.score_15" controls-position="right" size="small" :min="0"></el-input-number>   
                                        </template>                                                                   
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="3级" prop="score_15">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.isEdit">
                                        <span v-if="scope.row.type!=4">小于</span>                                 
                                        <span>{{scope.row.score_15}}</span>
                                        {{scope.row.type==3 ?'%':''}}
                                        <span>{{getUnit(scope.row.type)}}</span>
                                    </div>
                                    <div v-if="scope.row.isEdit">
                                        <template v-if="scope.row.type==3">
                                            &lt;<el-input-number v-model="scope.row.score_15" controls-position="right" size="small" :min="0" :max="100"></el-input-number>%                                                                        
                                        </template>
                                        <template v-else>
                                            &lt;<el-input-number v-model="scope.row.score_15" controls-position="right" size="small" :min="0"></el-input-number>                                                                                                                    
                                        </template>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="120px">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.isEdit">
                                        <el-button type="text" size="small" @click.native.prevent="toEditOne(scope.row, scope.$index)">修改
                                        </el-button>
                                    </div>
                                    <div v-if="scope.row.isEdit">
                                        <el-button type="text" size="small" @click.native.prevent="toSaveOne(scope.row, scope.$index)">确定</el-button>
                                        <el-button type="text" size="small" @click.native.prevent="toCancelOne(scope.row, scope.$index)">取消</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="main_box marginTop16">
                    <div class="mediaList_head">
                        <h2>{{cityInfo.company}} ({{cityInfo.city}}) 媒体分级占比设置</h2>
                    </div>
                    <div class="table_wrap">
                        <div style="border:1px solid #ebeef5;border-radius: 3px;">
                            <el-row class="el-row_style height44">
                                <el-col :span="7" class="padleft10 borderR borderB">A级媒体占比</el-col>
                                <el-col :span="7" class="padleft10 borderR borderB">B级媒体占比</el-col>
                                <el-col :span="7" class="padleft10 borderR borderB">C级媒体占比</el-col>
                                <el-col :span="3" class="padleft10 borderB">操作</el-col>
                            </el-row>
                            <el-row class="height44">
                                <el-col :span="7" class="padleft10 borderR borderB">
                                    <el-input-number v-model="percent.aPercent" controls-position="right" size="small" :min="0" :max="100" v-if="percent.isEdit" @blur="changeNum(percent.aPercent, 'A')"></el-input-number>                                    
                                    <span v-if="!percent.isEdit">{{percent.aPercent}}</span>%
                                </el-col>
                                <el-col :span="7" class="padleft10 borderR borderB">
                                    <el-input-number v-model="percent.bPercent" controls-position="right" size="small" :min="0" :max="100" v-if="percent.isEdit" @blur="changeNum(percent.bPercent, 'B')"></el-input-number>                                    
                                    <span v-if="!percent.isEdit">{{percent.bPercent}}</span>%
                                </el-col>
                                <el-col :span="7" class="padleft10 borderR borderB">
                                    <el-input-number v-model="percent.cPercent" controls-position="right" size="small" :min="0" :max="100" v-if="percent.isEdit" @blur="changeNum(percent.cPercent, 'C')"></el-input-number>                                    
                                    <span v-if="!percent.isEdit">{{percent.cPercent}}</span>%
                                </el-col>
                                <el-col :span="3" class="padleft10 borderB">
                                    <el-button type="text" size="small" v-if="!percent.isEdit" @click="toEditPer()">修改</el-button>
                                    <el-button type="text" size="small" v-if="percent.isEdit" @click="toSavePer()">确定</el-button>
                                    <el-button type="text" size="small" v-if="percent.isEdit" @click="toCancelPer()">取消</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
                <div class="main_box marginTop16">
                    <div class="mediaList_head">
                        <h2>{{cityInfo.company}} ({{cityInfo.city}}) 折扣及溢价区间设置
                            <el-switch v-model="checked" active-color="#13ce66"></el-switch>
                        </h2>
                    </div>
                    <div class="table_wrap" >
                        <div style="border:1px solid #ebeef5;border-radius: 3px;" :class="{disableClass:!checked}">
                            <el-row class="el-row_style height44">
                                <el-col :span="19" class="padleft10 borderR borderB">类目</el-col>
                                <el-col :span="5" class="borderB padleft10">操作</el-col>
                            </el-row>
                            <el-row class="height44">
                                <el-col :span="19" class="padleft10 borderR borderB">城市所选投放面全为a面溢价区间:
                                    <el-input-number v-model="priceTalk.onlyAPremium" controls-position="right" size="small" :min="0" :max="100" v-if="priceTalk.isEditA" @blur="changeNum(priceTalk.onlyAPremium, 'allA')"></el-input-number>                                    
                                    <span v-if="!priceTalk.isEditA">{{priceTalk.onlyAPremium}}</span>%
                                </el-col>
                                <el-col :span="5" class="borderB padleft10">
                                    <el-button type="text" size="small" v-if="!priceTalk.isEditA" @click="toEditType('A')" :disabled="!checked">修改</el-button>
                                    <el-button type="text" size="small" v-if="priceTalk.isEditA" @click="toSaveType('A')" :disabled="!checked">确定</el-button>
                                    <el-button type="text" size="small" v-if="priceTalk.isEditA" @click="toCancelType('A')" :disabled="!checked">取消</el-button>
                                </el-col>
                            </el-row>
                            <el-row class="height44">
                                <el-col :span="19" class="padleft10 borderR borderB">城市A级媒体超过:
                                    <el-input-number v-model="priceTalk.execAPercent" controls-position="right" size="small" :min="0" :max="100" v-if="priceTalk.isEditB" @blur="changeNum(priceTalk.execAPercent, 'eA')"></el-input-number>                                                                        
                                    <span v-if="!priceTalk.isEditB">{{priceTalk.execAPercent}}</span>%
                                    城市报价单打折区间不得低于:
                                    <el-input-number v-model="priceTalk.discountA" controls-position="right" size="small" :min="0" :max="100" v-if="priceTalk.isEditB" @blur="changeNum(priceTalk.discountA, 'disA')"></el-input-number>                                    
                                    <span v-if="!priceTalk.isEditB">{{priceTalk.discountA}}</span>%
                                </el-col>
                                <el-col :span="5" class="borderB padleft10">
                                    <el-button type="text" size="small" v-if="!priceTalk.isEditB" @click="toEditType('B')" :disabled="!checked">修改</el-button>
                                    <el-button type="text" size="small" v-if="priceTalk.isEditB" @click="toSaveType('B')" :disabled="!checked">确定</el-button>
                                    <el-button type="text" size="small" v-if="priceTalk.isEditB" @click="toCancelType('B')" :disabled="!checked">取消</el-button>
                                </el-col>
                            </el-row>
                            <el-row class="height44">
                                <el-col :span="19" class="padleft10 borderR borderB">城市B级媒体超过:
                                    <el-input-number v-model="priceTalk.execBPercent" controls-position="right" size="small" :min="0" :max="100" v-if="priceTalk.isEditC" @blur="changeNum(priceTalk.execBPercent, 'eB')"></el-input-number>                                                                        
                                    <span v-if="!priceTalk.isEditC">{{priceTalk.execBPercent}}</span>%                                    
                                    城市报价单打折区间不得低于:
                                    <el-input-number v-model="priceTalk.discountB" controls-position="right" size="small" :min="0" :max="100" v-if="priceTalk.isEditC" @blur="changeNum(priceTalk.discountB, 'disB')"></el-input-number>                                    
                                    <span v-if="!priceTalk.isEditC">{{priceTalk.discountB}}</span>%                                    
                                </el-col>
                                <el-col :span="5" class="borderB padleft10">
                                    <el-button type="text" size="small" v-if="!priceTalk.isEditC" @click="toEditType('C')" :disabled="!checked">修改</el-button>
                                    <el-button type="text" size="small" v-if="priceTalk.isEditC" @click="toSaveType('C')" :disabled="!checked">确定</el-button>
                                    <el-button type="text" size="small" v-if="priceTalk.isEditC" @click="toCancelType('C')" :disabled="!checked">取消</el-button>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
                <p style="text-align:center;" class="marginTop16">
                    <el-button size="small" @click="cancel()">取消</el-button>
                    <el-button size="small" type="primary" @click="saveAll()">保存</el-button>
                </p>
            </div>
        </div>

        <el-dialog
            title="分层结果"
            :visible.sync="showPercent"
            width="35%">
            <p>
                <span>A级媒体个数：{{resultInfo.aPercent}} </span>
                <span>B级媒体个数：{{resultInfo.bPercent}} </span>
                <span>C级媒体个数：{{resultInfo.cPercent}} </span>
            </p>
            <!-- <span style="color:#FF944F">分层最终结果与设置的会有出入</span> -->
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="changeRoute()">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { api } from '../../api/api';
import { Message } from 'element-ui';
export default {
    data(){
        return{
            // 加载中
            loading: false,
            // 登录信息
            session_data: {},
            cityInfo: {
                city: '',
                rid: ''
            },
            checked: false,
            // 媒体级别条件设置数据
            settingList: [
                {
                    type: 1,
                    name: '资源户数',
                    score_25: 0,
                    score_15: 0,
                    isEdit: false,
                },
                {
                    type: 2,
                    name: '楼盘价格',
                    score_25: 0,
                    score_15: 0,
                    isEdit: false,
                },
                {
                    type: 3,
                    name: '上刊率',
                    score_25: 0,
                    score_15: 0,
                    isEdit: false
                },
            ],
            // 百分比
            percent:{
                aPercent: 0,
                bPercent: 0,
                cPercent: 0,
                isEdit: false
            },
            // 溢价
            priceTalk: {
                onlyAPremium: 0,
                isEditA: false,
                isEditB: false,
                isEditC: false,
                execAPercent: 0,
                discountA: 0,
                execBPercent: 0,
                discountB: 0,
            },
            // 弹出框
            showPercent: false,
            resultInfo: {
                aPercent: 30,
                bPercent: 30,
                cPercent: 30
            },
        }
    },
    methods:{
        // 返回列表
        changeRoute(){
            this.showPercent = false;
            this.$router.push('./publishPriceList');
        },
        // 返回列表
        toList(){
            this.$router.push('./publishPriceList');
        },
        // 获取媒体分层设置信息
        getSettingList(){
            let info = {
                uid: this.session_data.uID,
                token: this.session_data.token,
                service:"GetOneMediaClassifiedInfoAction",
                data: {
                    rid: this.cityInfo.rid,
                    asrID: this.cityInfo.asrID,
                    amID: this.cityInfo.amID
                }
            };
            api.postApi_new(this.apiVar.Media, info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    let resInfo = res.data.data;
                    let setInfo = this.settingList;
                    let price = this.priceTalk;
                    let per = this.percent;
                    setInfo[0].score_25 = resInfo.upHNum;
                    setInfo[0].score_15 = resInfo.downHNum;
                    setInfo[1].score_25 = resInfo.upHPrice;
                    setInfo[1].score_15 = resInfo.downHPrice;
                    setInfo[2].score_25 = resInfo.upPublicationRate;
                    setInfo[2].score_15 = resInfo.downPublicationRate;
                    per.aPercent = resInfo.percentA;
                    per.bPercent = resInfo.percentB;
                    per.cPercent = resInfo.percentC;
                    this.checked = resInfo.premium == 1?true: false;
                    let meidia = resInfo.mediaClassifiedPremium ? resInfo.mediaClassifiedPremium : {};
                    price.onlyAPremium = meidia.onlyAPremium;
                    price.execAPercent = meidia.execAPercent;
                    price.discountA = meidia.discountA;
                    price.execBPercent = meidia.execBPercent;
                    price.discountB = meidia.discountB;
                }else if(res.data.SysCode == 200500 || res.data.MSG == '分层规则不存在'){
                    for(let data of this.settingList){
                        data.isEdit = true;
                    }
                    this.percent.isEdit = true;
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }
            });
        },
        // 获取单位
        getUnit(type){
            let arr = ['户', '平方米', '上刊率'];
            if(type == 4){
                return '';
            }
            return arr[type-1];
        },
        // 取消
        cancel(){
            this.$confirm("确定后，刚刚的所有操作将不会被保存", "是否确定取消", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(res=>{
                console.log(res);
                this.$router.push('./publishPriceList');
            }).catch(res=>{
                console.log(res);
            })
        },
        // 保存
        saveAll(){
            console.log('settingList-----', this.settingList);
            console.log('priceTalk-----', this.priceTalk);
            let setInfo = this.settingList;
            let per = this.percent;
            let price = this.priceTalk;
            if( setInfo[0].score_25 &&
                setInfo[0].score_15 && 
                setInfo[1].score_25 &&
                setInfo[1].score_15 &&
                setInfo[2].score_25 &&
                setInfo[2].score_15 &&
                per.aPercent && 
                per.bPercent &&
                per.cPercent
            ){
                let info = {
                    uid: this.session_data.uID,
                    token: this.session_data.token,
                    service:"SaveOrUpdateMediaClassifiedInfoAction",
                    data: {}
                };
                let data = {
                    "rid": this.cityInfo.rid,
                    "asrID": this.cityInfo.asrID,
                    "amID": this.cityInfo.amID,
                    "downHNum": setInfo[0].score_15,
                    "upHNum": setInfo[0].score_25,
                    "downHPrice": setInfo[1].score_15,
                    "upHPrice": setInfo[1].score_25,
                    "downPublicationRate": setInfo[2].score_15,
                    "upPublicationRate": setInfo[2].score_25,
                    "percentA": per.aPercent,
                    "percentB": per.bPercent,
                    "percentC": per.cPercent,
                    "premium": 0, //1为启用 0为不启用
                    "onlyAPremium": price.onlyAPremium,
                    "execAPercent": price.execAPercent,
                    "execBPercent": price.execBPercent,
                    "discountA": price.discountA,
                    "discountB": price.discountB
                };
                if(this.checked){
                    if( price.onlyAPremium && 
                        price.execAPercent && 
                        price.discountA && 
                        price.execBPercent && 
                        price.discountB){
                        data.premium = 1;
                    }else{
                        Message.warning('城市折扣和溢价区间设置不能为空');
                        return;
                    }
                }else{
                    data.premium = 0;
                }
                info.data = data;
                api.postApi_new(this.apiVar.Media, info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        // Message.success('最终的分层结果需几分钟，请稍后查看');
                        Message.success(res.data.MSG);
                        let perInfo = {
                            uid: this.session_data.uID,
                            token: this.session_data.token,
                            service: 'MediaGrade',
                            data: {
                                rID: this.cityInfo.rid,
                                asrID: this.cityInfo.asrID,
                                amID: this.cityInfo.amID
                            }
                        };
                        api.postApi_new(this.apiVar.Media, perInfo).then(res =>{
                            console.log(res.data);
                            if(res.data.SysCode == 200200){
                                let perResInfo = res.data.data;
                                this.resultInfo = {
                                    aPercent: perResInfo.A,
                                    bPercent: perResInfo.B,
                                    cPercent: perResInfo.C,
                                };
                                this.showPercent = true;                        
                            }else{
                                Message.warning(res.data.MSG);
                            }
                        }).catch(err =>{
                            console.log(err);
                        });
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log('err---', err);
                });
            }else{
                Message.warning('级别条件设置和分级占比设置都不能为空');
            }
        },
        // 媒体级别设置
        toEditOne(row, index){
            row.isEdit = true;
            row.score_25_update = row.score_25;
            row.score_15_update = row.score_15;
        },
        toSaveOne(row, index){
            console.log(row);
            if(row.score_25 && row.score_15 && (row.score_25>row.score_15)){
                row.isEdit = false;
            }else{
                Message.warning('不能为空且必须依次递减');
            }
        },
        toCancelOne(row, index){
            row.isEdit = false;
            row.score_25 = row.score_25_update;
            row.score_15 = row.score_15_update;
        },
        // 转换为整数
        changeNum(num, type){
            console.log(num, type);
            let timer = setTimeout(()=>{
                if(num){
                    let isBool = Number.isInteger(num)
                    if(!isBool){
                        num = parseInt(num)
                    }
                    if(type == 'A' || type == 'B' || type == 'C'){
                        if(type == 'A'){
                            this.percent.aPercent = num;
                        }else if(type == 'B'){
                            this.percent.bPercent = num;
                        }else if(type == 'C'){
                            this.percent.cPercent = num;
                        }
                        this.toPerEnough();
                    }else{
                        if(type == 'allA'){
                            this.priceTalk.onlyAPremium = num;
                        }else if(type == 'eA'){
                            this.priceTalk.execAPercent = num;
                        }else if(type == 'disA'){
                            this.priceTalk.discountA = num;
                        }else if(type == 'eB'){
                            this.priceTalk.execBPercent = num;
                        }else{
                            this.priceTalk.discountB = num;
                        }
                    }
                }
                clearTimeout(timer)
            },10)
        },
        // 保持百分百
        toPerEnough(){
            let per = this.percent;
            if(per.bPercent && per.cPercent){
                per.aPercent = 100 - per.cPercent - per.bPercent;
            }else if(per.aPercent && per.cPercent){
                per.bPercent = 100 - per.cPercent - per.aPercent;
            }else if(per.bPercent && per.aPercent){
                per.cPercent = 100 - per.bPercent - per.aPercent;
            }
            console.log(per);
        },
        // 编辑百分比
        toEditPer(){
            let info = this.percent;
            info.isEdit = true;
            info.aUpdate = info.aPercent;
            info.bUpdate = info.bPercent;
            info.cUpdate = info.cPercent;
            info.aPercent = '';
            info.bPercent = '';
            info.cPercent = '';
        },
        // 保存百分比
        toSavePer(){
            let info = this.percent;
            if(info.aPercent+info.bPercent+info.cPercent == 100){
                info.isEdit = false;
            }else{
                Message.warning('三者百分比之和不为一百');
            }
        },
        // 取消百分比
        toCancelPer(){
            let info = this.percent;
            info.isEdit = false;
            info.aPercent = info.aUpdate;
            info.bPercent = info.bUpdate;
            info.cPercent = info.cUpdate;
        },
        // 编辑类目
        toEditType(type){
            console.log(type);
            let info = this.priceTalk;
            if(type == 'A'){
                info.isEditA = true;
                info.onlyAPremiumUpdate = info.onlyAPremium;
            }else if(type == 'B'){
                info.isEditB = true;
                info.execAPercentUpdate = info.execAPercent;
                info.discountAUpdate = info.discountA;

            }else{
                info.isEditC = true;
                info.execBPercentUpdate = info.execBPercent;
                info.discountBUpdate = info.discountB;
            }
        },
        // 保存类目
        toSaveType(type){
            console.log(type);
            let info = this.priceTalk;
            if(type == 'A'){
                if(info.onlyAPremium){
                    info.isEditA = false;
                }else{
                    Message.warning('不能为空');
                }
            }else if(type == 'B'){
                if(info.execAPercent && info.discountA){
                    info.isEditB = false;
                }else{
                    Message.warning('不能为空');
                }
            }else{
                if(info.execBPercent && info.discountB){
                    info.isEditC = false;
                }else{
                    Message.warning('不能为空');
                }
            }
        },
        // 取消类目
        toCancelType(type){
            console.log(type);
            let info = this.priceTalk;
            if(type == 'A'){
                info.isEditA = false;
                info.onlyAPremium = info.onlyAPremiumUpdate;
            }else if(type == 'B'){
                info.isEditB = false;
                info.execAPercent = info.execAPercentUpdate;
                info.discountA = info.discountAUpdate;
            }else{
                info.isEditC = false;
                info.execBPercent = info.execBPercentUpdate;
                info.discountB = info.discountBUpdate;
            }
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
    },
    mounted(){
        this.session_data = JSON.parse(sessionStorage.getItem("session_data"));
        let info = JSON.parse(sessionStorage.getItem('setPriceInfo'));
        this.cityInfo = {
            city: info.city,
            rid: info.rid,
            company: info.company,
            asrID: info.asrID,
            amID: info.amID
        };
        this.getSettingList();
    },
}
</script>
<style scoped>
/*下拉框*/
.el-table-filter {
    height: 176px;
    overflow-x: hidden;
    overflow-y: scroll;
}

.el-table-filter .el-table-filter__list {
    /*修改源代码*/
    max-height: 176px;
    overflow-y: scroll;
}

/deep/ .el-table-filter__list::-webkit-scrollbar {
    width: 4px;
    background: #fafafa;
}

/deep/ .el-table-filter__list::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c1c1c1;
    border-radius: 4px;
}

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

/*面包屑导航*/
.ad_mediaDetail_wrap {
    position: relative;
}
.ad_mediaDetail_nav{
    width: 90%;
    margin: 0 auto;
}
.ad_mediaDetail_nav p {
    position: absolute;
    left: 0;
    top: 12px;
    font-size: 14px;
    line-height: 18px;
}

.ad_mediaDetail_nav p a {
    color: #666;
}

.ad_mediaDetail_nav {
    height: 42px;
    position: relative;
}

/*wrap*/
.mediaList_wrap {
    width: 90%;
    /* background: #ffffff; */
    /* border: 1px solid #e6e7e9; */
    margin: 0 auto;
    margin-bottom: 90px;
}

.mediaList_wrap .mediaList_head {
    width: 100%;
    /* height: 24px; */
    /* padding: 12px 0; */
    /* margin-bottom: 20px; */
    border-bottom: 1px solid #e6e7e9;
}

.mediaList_head h2 {
    font-size: 16px;
    color: #2c313c;
    height: 48px;
    line-height: 48px;
    padding-left: 32px;
    font-weight: bold;
}

.mediaList_container {
    width: 100%;
}
.table_wrap{
    padding: 18px 32px;
    color: #606266;
    font-size: 14px;
}
.main_box {
    width: 100%;
    background: #fff;
    /* padding: 20px; */
    border-radius: 4px;
    border: 1px solid #e6e7e9;
}
.marginTop16{
    margin-top: 16px;
}

/*表格*/
/*select选中*/
/deep/ .el-select-dropdown__item.selected {
    color: #666666;
    font-weight: normal;
}

/deep/ .el-date-editor .el-range-separator {
    line-height: 26px;
}

/deep/ .el-table th,
.el-table tr {
    height: 44px;
    padding: 0;
    background-color: #f7f7f7;
}

/deep/ .el-table td {
    padding: 10px 0;
    overflow-x: hidden;
    text-overflow: ellipsis;
}

/deep/ .el-table--border {
    border-radius: 4px;
}

/deep/ .el-table th > .cell {
    font-size: 14px;
    color: #666666;
    font-weight: bold;
}

/deep/ .el-table .caret-wrapper {
    width: 22px;
}

/deep/ .el-input {
    /* width: 150px; */
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ecf5ff;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    height: 405px;
    overflow-y: scroll;
    overflow-x: hidden;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px;
    background: #fafafa;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c1c1c1;
    border-radius: 4px;
}

/deep/ .ad_mediaDetail_wrap .el-dialog__title{
    font-weight: bold;
}
.margin20{
    margin: 20px 0;
}
.border_box{
    border: 1px solid #dedede;
    border-radius: 5px;
    width: 50%;
    padding: 20px;
    font-size: 14px;
}
/deep/ .border_box .el-input-number--small{
    width: 90px;
}
/deep/ .border_box .el-input-number.is-controls-right .el-input__inner{
    padding-left: 5px;
    padding-right: 40px;
}
/deep/ .border_box .el-row{
    margin-bottom: 10px;
}

.el-row_style{
    background-color: #f7f7f7;
    font-size: 14px;
    color: #666666;
    font-weight: bold;
}

.height44{
    height: 44px;
    line-height: 43px;
}
.padleft10{
    padding-left: 10px;
}
.borderR{
    border-right: 1px solid #ebeef5;
}
.borderB{
    border-bottom: 1px solid #ebeef5;
}

/deep/ .main_box .el-input-number--small{
    width: 96px;
}
.disableClass{
    background: rgba(247, 247, 247, 1)
}
.span_a{
    cursor: pointer;
}
</style>
