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
                        <a class="nav-text" href="https://apps.qinlinad.com/advertisers.html" target="_blank">如何让广告主更加了解您的服务？</a>
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
                                            clearable
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
                                        <el-cascader :options="bussiness"
                                                     v-model="companyForm.industryIdArr"
                                                     @change="handleChange"
                                                     filterable>
                                        </el-cascader>
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
                                    <el-form-item label="公司品牌:" prop="cBrand" ref="cBrand">
                                        <div class="cBrand_box" :class="isHavecBrand ? '' : 'cBrand_is_empty'">
                                            <el-tooltip class="item"
                                                        v-for="(item,index) in cBrandTags"
                                                        :key="index"
                                                        effect="dark"
                                                        placement="bottom">
                                                        <div slot="content">行业：{{item.industryNames}}</div>
                                                        <el-tag
                                                            size="small"
                                                            type="info"
                                                            :key="index"
                                                            :closable="false"
                                                            :disable-transitions="false"
                                                            @click.native="tagsClick(index)"
                                                            @close="tagsClose(index)">
                                                            {{item.brandName}}
                                                        </el-tag>
                                            </el-tooltip>
                                            <el-button class="button_new_tag" plain size="small" @click="showAddDialog">+ 添加</el-button>
                                        </div>
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
                    <el-button type="primary" @click="submitData" v-qadn-mta-h5="{id: 'a001_b001_c000_d000_bt005_ck03'}">创建</el-button>
                    <el-button plain @click="goBack" v-qadn-mta-h5="{id: 'a001_b001_c000_d000_bt006_ck03'}">取消</el-button>
                </div>
            </div>
        </div>
        <el-dialog
            title="添加品牌"
            :visible.sync="addcBrandDialogVisible"
            width="448px"
            :show-close="false">
            <ul>
                <li class="li_box">
                    <span>公司品牌:</span>
                    <el-input size="small" placeholder="请输入品牌名称" v-model="addcBrand.brand"></el-input>
                </li>
                <li class="li_box">
                    <span>所属行业:</span>
                    <el-cascader :options="bussiness" size="small" class="plan-select" v-model="addcBrand.industryList"
                                 :clearable="true"
                                 @change="changeIndustry"
                                 change-on-select
                                 filterable>
                    </el-cascader>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button plain @click="addcBrandDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addcBrandConfige">确 定</el-button>
            </div>
        </el-dialog>
        <!--编辑品牌-->
        <el-dialog
            title="编辑品牌"
            :visible.sync="editcBrandDialogVisible"
            width="448px"
            :show-close="false">
            <ul>
                <li class="li_box">
                    <span>公司品牌:</span>
                    <el-input size="small" placeholder="请输入品牌名称" v-model="addcBrand.brand"></el-input>
                </li>
                <li class="li_box">
                    <span>所属行业:</span>
                    <el-cascader :options="bussiness" size="small" class="plan-select" v-model="addcBrand.industryList"
                                 :clearable="true"
                                 @change="changeIndustry"
                                 filterable>
                    </el-cascader>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button plain @click="editcBrandDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addcBrandConfige('edit')">确 定</el-button>
            </div>
        </el-dialog>
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
            let szReg = /^1[3456789]\d{9}$/;
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
        var cBrandValidate = (rule,value,callback) =>{
            if (this.cBrandTags.length) {
                this.isHavecBrand = true
                callback();
            } else {
                this.isHavecBrand = false
                callback(new Error('请添加公司品牌!'));
            }
        }
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
                iName: "",
                // 公司品牌
                cBrandTags: '',
            },
            clientRules: {
                realname: [
                    { required: true, message: "联系人不能为空", trigger: "blur" },
                    { max: 30, message: "最多只能输入30个字节", trigger: "blur" }
                ],
                sname: [
                    { required: true, message: "账户名不能为空", trigger: "blur" },
                    { max: 50, message: "最多只能输入50个字节", trigger: "blur" },
                    { validator: validatesSname, trigger: ['blur','change']}
                ],
                position: [
                    { required: true, message: "职位不能为空", trigger: "blur" },
                    { max: 30, message: "最多只能输入30个字节", trigger: "blur" }
                ],
                phone: [
                    { required: true,message: "手机号码不能为空",trigger: "blur"
                    },
                    { type: "number",message: "只能输入数字",trigger: "blur"},
                    { validator: validatePhone, trigger: "blur" }
                ],
                email: [
                    // {required: false, trigger: 'blur'},
                    { validator: validateEmail, trigger: "blur" },
                    { type: "email",message: "请输入正确的邮箱地址",trigger: "blur,change"}
                ],
                telphone: [{ validator: validateFixphone, trigger: "blur" }],
                division: [
                    { max: 40,message: "最多只能输入40个字节",trigger: "blur"}
                ]
            },
            companyRules: {
                cName: [
                    {required: true, message: "公司名称不能为空", trigger: "blur"},
                    {max: 50,message: "最多只能输入50个字节",trigger: "blur"}
                ],
                cAddress: [
                    {max: 200,message: "最多只能输入200个字节",trigger: "blur"}
                ],
                cBrand:[
                    {required: true, validator: cBrandValidate, trigger: "blur"}
                ],
                cRemark: [
                    { max: 200,message: "最多只能输入200个字符",trigger: "blur"}
                ],
                industryIdArr: [
                    {required: true,message: "请选择行业分类",trigger: "blur"}
                ],
                cityArr: [
                    {required: true,message: "请选择所在城市",trigger: "blur"}
                ]
            },
            // 公司品牌
            cBrandTags: [],
            // 待删除的品牌
            delcBrand:[],
            // 自定义-添加品牌时的唯一标示id
            addcBrandIndex: 0,
            // 标示公司品牌是否通过了表单校验
            isHavecBrand: true,
            // 添加品牌的弹出框
            addcBrandDialogVisible: false,
            editcBrandDialogVisible: false,
            addcBrand:{
                brand:'',
                industryList:[],
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
                    } else {
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
            console.log('this.bussiness',this.bussiness)
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
                    } else {
                        Message.warning(res.data.MSG);
                    }
                });
            }else{
                this.companyForm.industryIdArr = [];
                this.companyForm.cityArr = [];
                this.companyForm.cRemark = '';
                this.companyForm.cAddress = '';
            }
        },
        // 选择公司
        handleSelect() {
            // this.companyTags = [];
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

                this.$set(item, "cityArr", [cityRID, areaRID]);

                // 获取公司原有的品牌信息
                this.getCBrandBycID(item.cID)

                // 公司信息所在行业
                let arr = JSON.parse(sessionStorage.getItem("industry"));
                // 如果有行业id则cascader显示出对应的行业
                let piID = industryToText.getpiID(item.iID, arr);
                console.log('父亲行业id',piID,item.iID)
                if (piID) {
                    let industryResult = [piID, item.iID];
                    item.industryIdArr = industryResult;
                } else {
                    // 找不到父亲行业id
                    item.industryIdArr = []
                }

                this.companyForm = item;
                // 保存一份旧公司信息以便来判断是否改变公司信息
                this.oldcompanyInfo = JSON.parse(JSON.stringify(item));
                // this.$refs["companyForm"].clearValidate();
                console.log('选择的公司信息------',this.companyForm)
            }
        },
        // 获取公司原有的品牌信息
        getCBrandBycID(cID){
            // 获取公司原有的品牌信息
            let bInfo = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                cid: cID,
            };
            api.getApi(this.apiVar.Advertisement+"/GetBrand", bInfo).then(res => {
                console.log('获取公司原有的品牌信息',res.data);
                // 先排除存在cID的tag
                this.cBrandTags = this.cBrandTags.filter((item, index, arr) => {
                    if (!item.cID || !item.bID) {
                        return item
                    }
                })
                if (res.data.SysCode === 200200) {
                    for (let key of res.data.data) {
                        let industryNames = this.getIndustryNamebyId([key.parentIndustryId,key.industryId])
                        this.cBrandTags.push({
                            id: this.addcBrandIndex,
                            brandName: key.bTitle,
                            industryList: [key.parentIndustryId,key.industryId],
                            industryNames: industryNames.join('/'),
                            cID: key.cID,
                            bID: key.bID,
                        })
                        this.addcBrandIndex++
                    }
                } else {
                    this.messageFun('warning', res.data.MSG)
                }
                console.log('所选公司原有品牌',this.cBrandTags)
            });
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
                    if (this.cBrandTags.length) {
                        this.addBrand(this.companyForm.cID);
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
        //显示添加品牌弹出框
        showAddDialog(){
            this.addcBrandDialogVisible = true
            this.addcBrand = {
                brand: '',
                industryList: []
            }
        },
        // 删除品牌
        tagsClose(index) {
            if (this.cBrandTags[index].bID) {
                this.delcBrand.push(this.cBrandTags[index])
            }
            this.cBrandTags.splice(index, 1)
            // 手动校验 公司品牌
            this.$refs.companyForm.validateField('cBrand', (valid) => {})
        },
        // 显示品牌编辑
        tagsClick(index) {
            console.log('显示品牌编辑',index)
            this.addcBrand = {
                id: this.cBrandTags[index].id,
                brand: this.cBrandTags[index].brandName,
                industryList: this.cBrandTags[index].industryList.concat(),
            }
            this.editcBrandDialogVisible = true
        },
        // 添加品牌时选择的行业
        changeIndustry(val) {
            console.log('添加品牌时选择的行业', val, this.addcBrand)
        },
        // 确定添加/编辑品牌
        addcBrandConfige(val) {
            if (!this.addcBrand.brand) {
                sessFun.messageFun('warning', '请输入品牌名称!')
                return
            }
            if (this.addcBrand.industryList.length < 2) {
                sessFun.messageFun('warning', '请选择所属行业!')
                return
            }
            // 根据id去获取名称以显示
            let industryNames = this.getIndustryNamebyId(this.addcBrand.industryList)
            if (val === 'edit') {
                // 编辑品牌
                console.log('编辑------',this.addcBrand)
                for (let key of this.cBrandTags) {
                    if (key.id === this.addcBrand.id) {
                        console.log('key.id',key.id)
                        key.brandName = this.addcBrand.brand
                        key.industryList = this.addcBrand.industryList.concat()
                        key.industryNames = industryNames.join('/')
                        break
                    }
                }
                this.editcBrandDialogVisible = false
            } else {
                // 添加品牌
                console.log('添加------',this.addcBrand)
                this.cBrandTags.push({
                    id: this.addcBrandIndex,
                    brandName: this.addcBrand.brand,
                    industryList: this.addcBrand.industryList.concat(),
                    industryNames: industryNames.join('/')
                })
                this.addcBrandDialogVisible = false
                this.addcBrandIndex++
            }
            // 手动校验 公司品牌
            this.$refs.companyForm.validateField('cBrand', (valid) => {})
            console.log('this.cBrandTags', this.cBrandTags)
        },
        // 新增/编辑品牌
        addBrand(cID) {
            for (let key of this.cBrandTags) {
                if (key.bID) {
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        bTitle: key.brandName,
                        bId: key.bID,
                        instdustryId: key.industryList[1],
                    };
                    console.log('编辑品牌参数',params)
                    api.getApi(this.apiVar.Advertisement + "/UpdateBrand", params).then(res => {
                        console.log(res.data);
                    });
                } else {
                    let AbInfo = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        asrID: this.sessionData.asrID,
                        bt: key.brandName,
                        cid: cID,
                        instdustryId: key.industryList[1],
                    };
                    console.log('新增品牌AbInfo', AbInfo)
                    api.getApi(this.apiVar.Advertisement + "/AddBrand", AbInfo).then(res => {
                        console.log(res.data);
                    });
                }
            }
            // 存在删除公司原品牌
            if (this.delcBrand.length) {
                this.delcBrandFun()
            }
            this.cBrandTags = []
        },
        // 存在删除公司原品牌
        delcBrandFun(){
            for (let key of this.delcBrand) {
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    bId: key.bID,
                    cId: key.cID,
                };
                console.log('删除品牌params', params)
                api.getApi(this.apiVar.Advertisement + "/DelBrand", params).then(res => {
                    console.log('删除----', res.data);
                });
            }
        },
        // 根据id获取行业的名称
        getIndustryNamebyId(idList) {
            let industryNames = []
            for (let key of this.bussiness) {
                if (key.iID == idList[0]) {
                    industryNames.push(key.label)
                    for (let cKey of key.children) {
                        if (cKey.iID == idList[1]) {
                            industryNames.push(cKey.label)
                            break
                        }
                    }
                    break
                }
            }
            return industryNames
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
            if (this.isChangeCom()) {
                // 修改公司信息
                api
                    .postApi(this.apiVar.Advertisement + "/SetMyCom", companyInfo)
                    .then(res => {
                        let mes = res.data;
                        if (mes.SysCode == 300200) {
                            // Message.success("修改公司信息成功");
                            // 注册用户
                            let puid = this.sessionData.uID;
                            let cid = this.companyForm.cID;
                            this.regUser(puid, cid, mes.SysCode);
                        } else if (mes.SysCode == 100403) {
                            // Message.warning(mes.MSG);
                            // 注册用户
                            let puid = this.sessionData.uID;
                            let cid = this.companyForm.cID;
                            this.regUser(puid, cid, mes.SysCode);
                        } else {
                            Message.warning(mes.MSG);
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
            } else {
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
            let brands = []
            for(let key of this.cBrandTags){
                brands.push(key.brandName)
            }
            let companyInfo = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                cname: cForm.cName,
                iid: cForm.industryIdArr[1],
                rid: cForm.cityArr[1],
                cbrand: brands.join(","),
                caddr: cForm.cAddress,
                cremark: cForm.cRemark
            };
            console.log('注册公司参数',companyInfo);
            // 注册公司
            api.getApi(this.apiVar.Advertisement+"/AddCom", companyInfo)
                .then(res => {
                    console.log(res.data);
                    let userMsg = res.data;
                    if ((!userMsg.SysCode) && (res.data)) {
                        // 新增品牌 cBrandTags
                        if (this.cBrandTags.length) {
                            this.addBrand(res.data.cID);
                        }
                        // 注册客户
                        let puid = this.sessionData.uID;
                        let cid = res.data.cID;
                        this.regUser(puid, cid, 'new');
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
                    this.cBrandTags = []
                });
        },
        //重置表单
        resetForm() {
            this.$refs["companyForm"].resetFields();
            this.$refs["clientForm"].resetFields();
            this.cBrandTags = [];
        },
        // 取消返回
        goBack() {
            this.$router.push("./clientList");
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
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    /* 新增品牌 */
    .button_new_tag{
        height: 26px;
        width: 58px;
        line-height: 24px;
        border:1px dashed rgba(217,217,217,1);
        color:rgba(102,102,102,1);
    }

    /* 弹出框 */
    /deep/ .el-dialog__body{
        padding: 16px 24px;
    }

    .li_box{
        margin-bottom: 16px;
    }

    .li_box /deep/ .el-input.el-input--small,
    .li_box /deep/ .el-cascader{
        width: 330px;
    }

    /*tags样式*/
    .cBrand_box {
        min-height: 65px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
    }

    .cBrand_is_empty{
        border-color: #f56c6c;
    }

    .cBrand_box /deep/ .el-tag {
        color:rgba(0,0,0,0.65);
        background:rgba(245,245,245,1);
        border-radius:2px;
        border:1px solid rgba(217,217,217,1);
        margin-right: 6px;
        margin-bottom: 8px;
    }
    .cBrand_box .el-tag /deep/ .el-icon-close{
        color:rgba(0,0,0,0.65);
    }

    /deep/ .el-form.demo-ruleForm {
        display: flex;
        flex-wrap: wrap;
    }

    .form_row,
    /deep/ .el-textarea,
    /deep/ .el-textarea__inner,
    /deep/ .el-autocomplete,
    /deep/ .el-cascader,
    /deep/ .el-input__inner,
    /deep/ .el-select,
    /deep/ .el-input,
    /deep/ .form_row .el-form-item {
        width: 100%;
        resize: none;
    }

    /*样式改版*/
    /deep/ .el-scrollbar__wrap {
        display: none;
    }

    /deep/ .el-form-item__label {
        float: none;
        line-height: 32px;
        color: rgba(0, 0, 0, 0.85);
    }

    /deep/ .el-form-item__content {
        margin-left: 0 !important;
        line-height: unset;
    }

    /deep/ .el-input__inner {
        height: 32px;
        text-align: left;
        line-height: 35px;
        padding-right: 20px;
        text-align: left;
    }

    /deep/ .el-textarea__inner{
        min-height: 83px !important;
    }

    .content_top_head .nav-text{
        margin-right: 16px;
        font-size: 14px;
        color: #1890FF;
        line-height: 20px;
        cursor: pointer;
    }
</style>
