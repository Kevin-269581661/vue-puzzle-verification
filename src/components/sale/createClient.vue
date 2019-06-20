<template>
    <div>
        <div class="ad_mediaDetail_wrap clearfix">
            <div class="ad_mediaDetail_nav">
                <p>
                    <a href="#">客户管理</a>
                    <em> / </em>
                    <a href="#">创建客户</a>
                </p>
            </div>
            <!--客户信息-->
            <div class="mediaList_wrap">
                <div class="content_top_wrap">
                    <div class="content_top_head">
                        <h2>客户信息</h2>
                    </div>
                    <div class="content_top_form_wrap">
                        <el-form :model="clientForm" status-icon :rules="clientRules" ref="clientForm" label-width="100px" class="demo-ruleForm">
                            <el-row class="form_row" type="flex" :gutter="72">
                                <el-col :span="6">
                                    <el-form-item label="联系人:" prop="realname">
                                        <el-input v-model.trim="clientForm.realname" placeholder="请输入联系人姓名" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="账户名:" prop="sname">
                                        <el-select
                                            v-model="clientForm.sname"
                                            filterable
                                            remote
                                            reserve-keyword
                                            placeholder="请输入账户名"
                                            :remote-method="remoteMethod"
                                            :loading="loading">
                                            <el-option
                                                v-for="item in searchArr"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="职位:" prop="position">
                                        <el-input v-model.trim="clientForm.position" placeholder="请输入联系人职位" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="手机号码:" prop="phone">
                                        <el-input v-model.number="clientForm.phone" maxlength="11" minlength="11" placeholder="请输入联系人手机号码" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="form_row" type="flex" :gutter="72">
                                <el-col :span="6">
                                    <el-form-item label="所在地:" prop="cityArr" placeholder="请选择联系人所在地">
                                        <el-cascader :options="allProvince" v-model="clientForm.cityArr" separator="-" :show-all-levels="false" @change="seleProClient" @active-item-change="handleItemChange" filterable></el-cascader>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="邮箱:" prop="email">
                                        <el-input v-model.trim="clientForm.email" placeholder="请输入联系人邮箱" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="固定电话:" prop="telphone">
                                        <el-input v-model.trim="clientForm.telphone" placeholder="请输入联系人固定电话" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="事业部:" prop="division">
                                        <el-input v-model.trim="clientForm.division" placeholder="请输入联系人所属事业部" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>
            </div>
            <!--公司信息-->
            <div class="mediaList_wrap clearfix margin_16_64">
                <div class="content_bottom_wrap companyInfo">
                    <div class="content_bottom_head">
                        <h2>公司信息</h2>
                    </div>
                    <div class="content_bottom_form_wrap">
                        <el-form :model="companyForm" status-icon :rules="companyRules" ref="companyForm" label-width="100px" class="demo-ruleForm">
                            <el-row class="form_row" type="flex" :gutter="72">
                                <el-col :span="6">
                                    <el-form-item label="公司名称:" prop="cName">
                                        <el-select
                                            v-model.trim="companyForm.cName" 
                                            filterable
                                            remote
                                            reserve-keyword
                                            placeholder="请输入公司名称"
                                            :remote-method="remoteMethodCom"
                                            @change="handleSelect()"
                                            :loading="comLoading">
                                            <el-option
                                                v-for="item in companyArr"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="所在城市:" prop="cityArr" placeholder="请选择公司所在城市">
                                        <el-cascader :options="allProvince" v-model="companyForm.cityArr" separator="-" :show-all-levels="false" @change="seleProCom" @active-item-change="handleItemChange" filterable></el-cascader>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="行业分类:" prop="industryIdArr">
                                        <el-cascader :options="bussiness" v-model="companyForm.industryIdArr" change-on-select @change="handleChange" filterable></el-cascader>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="公司地址:" prop="cAddress">
                                        <el-input v-model.trim="companyForm.cAddress" placeholder="请输入公司具体地址" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row class="form_row" type="flex" :gutter="72">
                                <el-col :span="6">
                                    <el-form-item label="公司品牌:" prop="cBrand" class="tags">
                                        <el-tag v-for="tag in oldBrandTags" :key="tag.bID">
                                            {{tag.bTitle}}
                                        </el-tag>
                                        <el-tag v-for="(tag, index) in companyTags" :key="index" closable :disable-transitions="false" @close="handleClose(tag)">
                                            {{tag}}
                                        </el-tag>
                                        <el-input style="width: 90px" class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" clearable>
                                        </el-input>
                                        <el-button v-else class="button-new-tag" size="small" @click="showInput">新增品牌</el-button>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="备注:" prop="cRemark">
                                        <el-input type="textarea" v-model.trim="companyForm.cRemark" placeholder="请填写备注信息" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>
                <div class="content_bottom_btn">
                    <el-button type="primary" @click="submitData">创建</el-button>
                    <el-button @click="goBack">取消</el-button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import api from "../../api/api.js";
import areaPackageNew from "../../commonFun/areaPackage_new.js";
import industryToText from "../../commonFun/industryToText.js";
import sessFun from "../../commonFun/sessFun.js";
import {
    Form,
    FormItem,
    Input,
    Button,
    Cascader,
    Select,
    Option,
    Autocomplete,
    Tag,
    Message,
    MessageBox
} from "element-ui";

export default {
    name: "createClient",
    components: {
        elForm: Form,
        elFormItem: FormItem,
        elInput: Input,
        elButton: Button,
        elCascader: Cascader,
        elSelect: Select,
        elOption: Option,
        elAutocomplete: Autocomplete,
        elTag: Tag,
        elMessage: Message
    },
    data() {
        var validateEmail = (rule, value, callback) => {
            // var reg = new RegExp("^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$");
            // var reg = new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$");
            var reg = new RegExp(
                "^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$"
            );
            if (value) {
                if (!reg.test(value)) {
                    callback(new Error("邮箱格式有误"));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var validateFixphone = (rule, value, callback) => {
            var reg = new RegExp("^[0-9-]*$");
            if (value) {
                if (!reg.test(value)) {
                    callback(new Error('只能输入"-",数字'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        var validatePhone = (rule, value, callback) => {
            let szReg = /^1[345678]\d{9}$/;
            let HKszReg = /^\d{8}$/;        // 香港号码
            // console.log('szReg',szReg,'HKszReg',HKszReg)
            if (!szReg.test(value) && !HKszReg.test(value)) {
                callback(new Error("请输入正确的手机号码"));
            } else {
                callback();
            }
        };
        var validatesSname = (rule, value, callback) => {
            console.log(value, 'value---',this.isSame);
            let szReg = /^[^\u4e00-\u9fa5]{0,}$/;
            if (!szReg.test(value)) {
                callback(new Error("只能输入字母,数字,符号"));
            }else if (value) {
                if(!this.isSame){
                    callback();
                }else{
                    callback("该账号已经被占用");
                }
            }else {
                callback();
            }
        };
        return {
            // 账号远程搜索
            loading: false,
            searchArr: [],
            isSame: false,
            // 公司远程搜索
            comLoading: false,
            companyArr: [],
            // 登录信息
            sessionData: {},
            // 所有区域
            allProvince: [],
            //行业分类
            bussiness: [],
            // 公司所对应的原来的品牌
            oldBrandTags: [],
            //tags
            companyTags: [],
            inputVisible: false,
            inputValue: "",
            //表单
            clientForm: {
                // 选中之后的区域组合
                cityArr: [],
                realname: "",
                sname: "",
                position: "",
                phone: "",
                email: "",
                telphone: "",
                division: "",
                utype: "AD",
                uwho: "",
                puid: ""
            },
            // 保存一份旧公司信息
            oldcompanyInfo: {},
            companyForm: {
                uid: "",
                cityArr: [],
                // 选中之后的行业组合
                industryIdArr: [],
                cName: "",
                cAddress: "",
                rName: "",
                cRemark: "",
                // 地区id
                rID: "",
                // 行业id
                iID: "",
                // 公司id
                cID: "",
                iName: ""
            },
            clientRules: {
                realname: [
                    {
                        required: true,
                        message: "联系人不能为空",
                        trigger: "blur"
                    },
                    {
                        max: 30,
                        message: "最多只能输入30个字节",
                        trigger: "blur"
                    }
                ],
                sname: [
                    {
                        required: true,
                        message: "账户名不能为空",
                        trigger: "blur"
                    },
                    {
                        max: 50,
                        message: "最多只能输入50个字节",
                        trigger: "blur"
                    },
                    { validator: validatesSname, trigger: ['blur','change']}
                ],
                position: [
                    {
                        required: true,
                        message: "职位不能为空",
                        trigger: "blur"
                    },
                    {
                        max: 30,
                        message: "最多只能输入30个字节",
                        trigger: "blur"
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: "手机号码不能为空",
                        trigger: "blur"
                    },
                    {
                        type: "number",
                        message: "只能输入数字",
                        trigger: "blur"
                    },
                    { validator: validatePhone, trigger: "blur" }
                ],
                email: [
                    // {required: false, trigger: 'blur'},
                    { validator: validateEmail, trigger: "blur" },
                    {
                        type: "email",
                        message: "请输入正确的邮箱地址",
                        trigger: "blur,change"
                    }
                ],
                // cityArr :[
                // 	{required:true, message:'请选择所在地', trigger:'blur'}
                // ]
                telphone: [{ validator: validateFixphone, trigger: "blur" }],
                division: [
                    {
                        max: 40,
                        message: "最多只能输入40个字节",
                        trigger: "blur"
                    }
                ]
            },
            companyRules: {
                cName: [
                    {
                        required: true,
                        message: "公司名称不能为空",
                        trigger: "blur"
                    },
                    {
                        max: 50,
                        message: "最多只能输入50个字节",
                        trigger: "blur"
                    }
                ],
                cAddress: [
                    // {required: true, message:'公司地址不能为空', trigger:'blur'},
                    {
                        max: 200,
                        message: "最多只能输入200个字节",
                        trigger: "blur"
                    }
                ],
                cRemark: [
                    {
                        max: 200,
                        message: "最多只能输入200个字符",
                        trigger: "blur"
                    }
                ],
                industryIdArr: [
                    {
                        required: true,
                        message: "请选择行业分类",
                        trigger: "blur"
                    }
                ],
                cityArr: [
                    {
                        required: true,
                        message: "请选择所在城市",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    created() {
        this.getSession();
        this.getIndustry();
        this.getAreaData();
    },
    methods: {
        getSession(){
            this.sessionData = sessFun.getSess();
        },
        handle(item) {
            console.log(item);
            this.clientForm.sname = item.value;
        },
        // 客户远程搜索
        remoteMethod(query){
            this.searchArr = [];
            if(query){
                let sname = query;
                let session = this.sessionData;
                let info = {
                    uid: session.uID,
                    token: session.token,
                    sname: sname
                };
                this.loading = true;
                api.postApi(this.apiVar.UCAPI+"/CheckUserName", info).then(res => {
                    this.loading = false;                    
                    if (res.data.SysCode == 200200) {
                        let results = [{ value: query, label: query }];
                        this.searchArr = results;
                        console.log(res.data.data);
                        if(res.data.data.uID){
                            this.isSame = true;
                        }else{
                            this.isSame = false;
                        }
                    } else if(res.data.SysCode ==100302){
                        this.loginTimeout();
                    }else {
                        Message.warning(res.data.MSG);
                    }
                });
            }
        },
        // 选择行业
        handleChange(val) {
            console.log("industryIdArr---------", val);
            this.companyForm.industryIdArr = val;
        },
        // 选择公司所在城市
        seleProCom(val) {
            console.log("val---------", val);
            this.companyForm.cityArr = val;
        },
        seleProClient(val) {
            this.clientForm.cityArr = val;
        },
        // 获取所有行业信息
        getIndustry() {
            let arr = JSON.parse(sessionStorage.getItem("industry"));
            this.bussiness = industryToText.cascader(arr);
        },
        // 获取所有区域信息
        getAreaData() {
            this.allProvince = areaPackageNew.province();
        },
        // 点击省级去显示其对应市级
        handleItemChange(val) {
            console.log("select", val);
        },
        // 输入获取公司信息(远程搜索)        
        remoteMethodCom(query){
            this.companyArr = [];
            if(query){
                let session = this.sessionData;
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    cn: query
                };
                this.comLoading = true;
                api.postApi(this.apiVar.Advertisement+"/GetCompanyInfo", info).then(res => {
                    this.comLoading = false;                    
                    if (res.data) {
                        for (let i of res.data) {
                            i.value = i.cID;
                            i.label = i.cName;
                        }
                        if(res.data.length){
                            this.companyArr = res.data;
                        }else{
                            this.companyArr = [{label: query, value: query}];
                        }
                    } else if(res.data.SysCode ==100302){
                        this.loginTimeout();
                    }else {
                        Message.warning(res.data.MSG);
                    }
                });
            }else{
                this.oldBrandTags = [];
                this.companyTags = [];
                this.companyForm.industryIdArr = [];
                this.companyForm.cityArr = [];
                this.companyForm.cRemark = '';
                this.companyForm.cAddress = '';
            }
        },
        // 选择公司
        handleSelect() {
            this.companyTags = [];
            let item = '';
            for(let data of this.companyArr){
                if(data.cID == this.companyForm.cName){
                    item = data;
                    break;
                }
            }
            // item有即代表已有公司存在
            if(item){
                console.log(item);
                console.log(item.rID);
                // 保存cID以便在创建客户的时候进行使用
                item.cID = item.cID;
                item.cName = item.cName;
                item.cAddress = item.cAddress;
                item.cRemark = item.cRemark;
                item.iID = item.iID;
    
                // 获取公司所在地的中文名称
                let cityRID = item.rID.toString().substring(0, 2) + "0000";
                let areaRID = item.rID.toString().substring(0, 4) + "00";
                this.handleItemChange([cityRID, areaRID]);
    
                // item.cityArr = [cityRID, areaRID];
                this.$set(item, "cityArr", [cityRID, areaRID]);
    
                // 获取公司原有的品牌信息
                let bInfo = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    cid: item.cID,
                };
                api.getApi(this.apiVar.Advertisement+"/GetBrand", bInfo).then(res => {
                    console.log(res.data);
                    this.oldBrandTags = res.data;
                });
    
                // 公司信息所在行业
                let arr = JSON.parse(sessionStorage.getItem("industry"));
                // 如果有行业id则cascader显示出对应的行业
                let industryResult = [
                    industryToText.getpiID(item.iID, arr),
                    item.iID
                ];
                item.industryIdArr = industryResult;
    
                this.companyForm = item;
                // 保存一份旧公司信息以便来判断是否改变公司信息
                this.oldcompanyInfo = JSON.parse(JSON.stringify(item));
                // this.$refs["companyForm"].clearValidate();
            }
        },
        // 创建
        submitData() {
            let client_bool = false;
            this.$refs["clientForm"].validate(valid => {
                if (valid) {
                    client_bool = true;
                } else {
                    return false;
                }
            });
            let company_bool = false;
            this.$refs["companyForm"].validate(valid => {
                if (valid) {
                    company_bool = true;
                } else {
                    return false;
                }
            });
            if(client_bool && company_bool){
                // 邮箱变成小写
                this.clientForm.email = this.clientForm.email.toLowerCase();
                console.log(this.companyForm.cID);
                // 先搜索公司，如果有则不添加，没有则提交信息添加公司
                if (this.companyForm.cID) {
                    // 如果有新填入品牌则新增品牌
                    if (this.companyTags.length) {
                        this.addBrand(this.companyTags, this.companyForm.cID);
                    }
                    // console.log('clientForm', this.validateForm('clientForm'));
                    // 修改公司信息
                    this.updateCompany();

                } else {
                    console.log("nocom", company_bool, client_bool);
                    // 创建公司和用户
                    this.createCompany();
                }

            }
        },
        // 判断公司信息是否修改
        isChangeCom() {
            let companyInfo = this.oldcompanyInfo;
            console.log(companyInfo);
            for (let data of [this.companyForm]) {
                for (let item of [companyInfo]) {
                    if (
                        data.cID != item.cID ||
                        data.cAddress != item.cAddress ||
                        data.cName != item.cName ||
                        data.cRemark != item.cRemark ||
                        this.companyForm.industryIdArr[1] != item.iID ||
                        this.companyForm.cityArr[1] != item.rID
                    ) {
                        return true;
                    }
                }
            }
            return false;
        },
        // 新增品牌
        addBrand(arr, cID) {
            for (let brand of arr) {
                let AbInfo = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    bt: brand,
                    cid: cID
                };
                api.getApi(this.apiVar.Advertisement+"/AddBrand", AbInfo).then(res => {
                    console.log(res.data);
                    this.oldBrandTags.push(res.data);
                });
            }
            this.companyTags = [];
        },
        // 更新公司信息
        updateCompany() {
            // uid         int【必填】     当前用户UserID
            // cid         int【必填】     要修改的公司ID
            // cname       String          公司名
            // caddress    String          公司地址
            // rid         int             公司所在地城市ID
            // iid         int             公司所属行业ID
            // cremark     String          公司备注信息
            let cForm = this.companyForm;
            let companyInfo = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                cid: cForm.cID,
                cname: cForm.cName,
                caddress: cForm.cAddress,
                rid: cForm.cityArr[1],
                iid: cForm.industryIdArr[1],
                cremark: cForm.cRemark ? cForm.cRemark : ""
            };
            console.log("companyInfo-------", companyInfo);
            if(this.isChangeCom()){
                // 修改公司信息
                api
                    .postApi(this.apiVar.Advertisement+"/SetMyCom", companyInfo)
                    .then(res => {
                        let mes = res.data;
                        if (mes.SysCode == 300200) {
                            // Message.success("修改公司信息成功");
                            // 注册用户
                            let puid = this.sessionData.uID;
                            let cid = this.companyForm.cID;
                            this.regUser(puid, cid, mes.SysCode);
                        } else if(mes.SysCode == 100403) {
                            // Message.warning(mes.MSG);
                            // 注册用户
                            let puid = this.sessionData.uID;
                            let cid = this.companyForm.cID;
                            this.regUser(puid, cid, mes.SysCode);
                        }else{
                            Message.warning(mes.MSG);
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
            }else{
                // 注册客户
                let puid = this.sessionData.uID;
                let cid = this.companyForm.cID;
                this.regUser(puid, cid, 'client');
            }
        },
        // 创建公司
        createCompany() {
            // uid         int【必填】     当前账户UserID
            // cname       String【必填】  公司名称
            // iid         int【必填】     公司所属行业ID
            // rid         int【必填】     公司所在地区ID
            // cbrand      String          公司旗下品牌，多个品牌用半角分号,隔开
            // caddr       String          公司通讯地址
            // cremark     String          公司备注信息
            let cForm = this.companyForm;
            let companyInfo = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                cname: cForm.cName,
                iid: cForm.industryIdArr[1],
                rid: cForm.cityArr[1],
                cbrand: this.companyTags.join(","),
                caddr: cForm.cAddress,
                cremark: cForm.cRemark
            };
            // let companyInfo ={};
            // companyInfo.uid = JSON.parse(sessionStorage.getItem('session_data')).uID;
            // companyInfo.cname = this.companyForm.cName;
            // companyInfo.iid = this.companyForm.industryIdArr[1];
            // companyInfo.rid = this.companyForm.cityArr[1];
            // companyInfo.cbrand = this.companyTags.join(',');
            // companyInfo.caddr = this.companyForm.cAddress;
            // companyInfo.cremark = this.companyForm.cRemark;
            console.log(companyInfo);
            // 注册公司
            api
                .getApi(this.apiVar.Advertisement+"/AddCom", companyInfo)
                .then(res => {
                    console.log(res.data);

                    let userMsg = res.data;
                    if ((!userMsg.SysCode) && (res.data)) {
                        // 新增品牌
                        if (this.companyTags.length) {
                            this.addBrand(this.companyTags, res.data.cID);
                        }
                        // 注册客户
                        let puid = this.sessionData.uID;
                        let cid = res.data.cID;
                        this.regUser(puid, cid, 'new');
                    }else if(userMsg.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        // Message.warning(userMsg.MSG);
                        Message.warning('可能存在相同公司，请进行筛选公司之后再创建');
                    }
                })
                .catch(res => {
                    console.log(res);
                });
        },
        // 注册用户
        regUser(puid, cid, code) {
            // uid         int【必填】         当前登陆用户UserID
            // realname    String【必填】      用户真实姓名
            // sname       String【必填】      账户名
            // phone       int【必填】         用户手机号码
            // telphone    String【选填】      固定电话
            // email       String【选填】      电子邮箱
            // position    String【选填】      职务
            // division    String【选填】      部门
            // rid         int【选填】         地区ID
            // utype       String【选填】      用户类型：SM、OP、BD、MD、AD
            // uwho        String【选填】      所属公司ID，新增客户这里必填
            // puid        int                 所属所属销售uID，当utype是AD时必填
            let form = this.clientForm;
            let clientInfo = {
                uid: puid,
                token: this.sessionData.token,
                realname: form.realname,
                sname: form.sname,
                phone: form.phone,
                telphone: form.telphone,
                email: form.email,
                position: form.position,
                division: form.division,
                rid: form.cityArr[1] ? form.cityArr[1] : "",
                utype: "AD",
                uwho: cid,
                puid: puid
            };
            console.log("clientInfo---------", clientInfo);
            // this.clientForm.puid = puid;
            // this.clientForm.uwho = cid;
            // if(this.clientForm.cityArr[1]){
            // 	this.clientForm.rid = this.clientForm.cityArr[1];
            // }

            api.postApi(this.apiVar.UCAPI+"/RegUser", clientInfo)
                .then(res => {
                    console.log(res);
                    let userMsg = res.data;
                    if (userMsg.SysCode == 200200) {
                        this.resetForm();
                        let str = '';
                        if(code =="new"){
                            str = '成功创建客户,成功创建公司,是否跳转到列表页面';
                        }else if(code =='client'){
                            str = '成功创建客户,是否跳转到列表页面';
                        }else if(code ==300200){
                            str = '成功创建客户,成功修改公司信息,是否跳转到列表页面';
                        }else{
                            str = '成功创建客户,没有权限修改公司信息,是否跳转到列表页面';
                        }
                        this.changRoute(str);
                    }else if(userMsg.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(userMsg.MSG);
                    }
                })
                .catch(res => {
                    Message({
                        type: "warning",
                        message: res.data.MSG
                    });
                });
        },
        // 新建之后进行跳转
        changRoute(str){
            MessageBox.confirm(
                `${str}`,
                "提示",
                {
                    showClose: false,
                    confirmButtonText: "确定",
                    type: "warning"
                }
            )
                .then(() => {
                    this.$router.push("./clientList");
                })
                .catch(res => {
                    this.companyTags = [];
                    this.oldBrandTags = [];
                });
        },
        //重置表单
        resetForm() {
            this.$refs["companyForm"].resetFields();
            this.$refs["clientForm"].resetFields();
            this.companyTags = [];
        },
        // 取消返回
        goBack() {
            this.$router.push("./clientList");
        },
        //删除/显示/添加tags
        handleClose(tag) {
            this.companyTags.splice(this.companyTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                let temp = [];
                for (let item of this.oldBrandTags) {
                    temp.push(item.bTitle);
                }
                let comBol = this.companyTags.includes(inputValue);
                let tempBol = temp.includes(inputValue);
                if (!comBol && !tempBol) {
                    this.companyTags.push(inputValue);
                }
            }
            this.inputVisible = false;
            this.inputValue = "";
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
    }
};
</script>

<style scoped>
.content_top_wrap,
.content_bottom_wrap {
    background: #ffffff;
    padding-top: 3px;
}

.content_top_wrap .content_top_head {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #dedede;
}

.content_bottom_wrap .content_bottom_head {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #dedede;
}

.content_top_wrap .content_top_head h2,
.content_bottom_wrap .content_bottom_head h2 {
    font-size: 16px;
    color: #2c313c;
    font-weight: bold;
    padding-left: 16px;
    height: 24px;
    margin-top: 8px;
}

.content_top_form_wrap,
.content_bottom_form_wrap {
    padding: 24px 32px;
}

/*按钮*/
.content_bottom_btn {
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
    margin-top: 20px;
}

/*tags样式*/
.el-tag {
    margin-right: 5px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px !important;
    margin-left: 10px !important;
    vertical-align: bottom;
}

/deep/ .input-new-tag .el-input__suffix {
    top: -4px;
    right: 14px;
}

/deep/ .button-new-tag {
    margin-left: 0;
    position: relative;
    top: -1px;
}

/deep/ .tags .el-form-item__error {
    display: none;
}

/deep/ .tags .el-input {
    width: 90px !important;
    height: 34px;
}

/deep/ .el-tag {
    height: 34px;
    line-height: 32px;
}

/deep/ .button-new-tag {
    height: 34px;
    line-height: 32px;
}

/*按钮*/
/deep/ .el-button--default:focus,
.el-button--default:hover {
    color: #606266;
    border-color: #dcdfe6;
    background-color: #fcfcfc;
}

/deep/ .el-form.demo-ruleForm {
    display: flex;
    flex-wrap: wrap;
}

.form_row,
/deep/.el-textarea, 
/deep/.el-textarea__inner,
/deep/.el-autocomplete,
/deep/.el-cascader,
/deep/ .el-input__inner,
/deep/ .el-select,
/deep/.el-input,
/deep/ .form_row .el-form-item{
    width: 100%;
    resize: none;
}
/*样式改版*/
/deep/ .el-scrollbar__wrap{
    display: none;
}
/deep/ .el-form-item__label{
    float: none;
    line-height: 32px;
    color: rgba(0,0,0,0.85);
}
/deep/ .el-form-item__content{
    margin-left: 0 !important;
}
/deep/ .el-input__inner{
    height: 32px;
    text-align: left;
    line-height: 35px;
    padding-right: 20px;
    text-align: left;
}
</style>
