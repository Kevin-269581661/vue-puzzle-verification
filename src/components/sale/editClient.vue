<template>
    <div>
        <div>
            <div class="ad_mediaMana_wrap">
                <div class="ad_mediaMana_nav clearfix">
                    <p>
                        <a href="#">客户管理</a>
                        <em> / </em>
                        <a href="#">修改客户信息</a>
                    </p>
                </div>
                <!--客户信息-->
                <div class="mediaMana_content_top">
                    <div class="content_top_wrap">
                        <div class="content_top_head">
                            <h2>客户信息</h2>
                        </div>
                        <div class="content_top_form_wrap">
                            <el-form :model="clientForm" status-icon :rules="clientRules" ref="clientForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="联系人:" prop="realName">
                                    <el-input v-model.trim="clientForm.realName" placeholder="请输入联系人姓名" disabled="disabled" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="账户名:" prop="sName">
                                    <el-input v-model.trim="clientForm.sName" placeholder="请输入账户名" disabled="disabled" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="职位:" prop="position">
                                    <el-input v-model.trim="clientForm.position" placeholder="请输入联系人职位" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="手机号码:" prop="phone">
                                    <el-input v-model.number="clientForm.phone" maxlength="11" minlength="11" placeholder="请输入联系人手机号码" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="所在地:" prop="cityArr">
                                    <!-- <el-cascader :options="allProvince" v-model="clientForm.cityArr" separator="-" :show-all-levels="false" @change="seleProClient" @active-item-change="handleItemChange"></el-cascader> -->
                                    <el-cascader :options="allProvince" v-model="clientForm.cityArr" separator="-" :show-all-levels="false" @change="seleProClient" ></el-cascader>
                                </el-form-item>
                                <el-form-item label="邮箱:" prop="email">
                                    <el-input v-model.trim="clientForm.email" placeholder="请输入联系人邮箱" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="固定电话:" prop="telephone">
                                    <el-input v-model.trim="clientForm.telephone" placeholder="请输入联系人固定电话" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="事业部:" prop="division">
                                    <el-input v-model.trim="clientForm.division" placeholder="请输入联系人所属事业部" clearable></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <!--公司信息-->
                <div class="mediaMana_content_bottom clearfix">
                    <div class="content_bottom_wrap companyInfo">
                        <div class="content_bottom_head">
                            <h2>公司信息</h2>
                        </div>
                        <div class="content_bottom_form_wrap">
                            <el-form :model="companyForm" status-icon :rules="companyRules" ref="companyForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="公司名称:" prop="cName">
                                    <el-input v-model.trim="companyForm.cName" placeholder="请输入公司具体地址" clearable></el-input>
                                </el-form-item>
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
                                <el-form-item label="行业分类:" prop="industryIdArr">
                                    <el-cascader placeholder="试试搜索：互联网" :options="bussiness" change-on-select v-model="companyForm.industryIdArr" @change="handleChange"></el-cascader>
                                </el-form-item>
                                <el-form-item label="公司地址:" prop="cAddress">
                                    <el-input v-model.trim="companyForm.cAddress" placeholder="请输入公司具体地址" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="所在城市:" prop="cityArr">
                                    <!-- <el-cascader :options="allProvince" v-model="companyForm.cityArr" separator="-" :show-all-levels="false" @change="seleProCom" @active-item-change="handleItemChange"></el-cascader> -->
                                    <el-cascader :options="allProvince" v-model="companyForm.cityArr" separator="-" :show-all-levels="false" @change="seleProCom" ></el-cascader>
                                </el-form-item>
                                <el-form-item label="备注:" prop="cRemark">
                                    <el-input type="textarea" v-model.trim="companyForm.cRemark" placeholder="请填写备注信息" clearable></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div class="content_bottom_btn">
                        <el-button type="primary" @click="submitData">修改</el-button>
                        <el-button @click="goBack">取消</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api/api.js";
import areaPackageNew from "../../commonFun/areaPackage_new.js";
import industryToText from "../../commonFun/industryToText.js";
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
    MessageBox,
    Message
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
        elTag: Tag
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
            let szReg = /^1[34578]\d{9}$/;
            let HKszReg = /^\d{8}$/;        // 香港号码
            // console.log('szReg',szReg,'HKszReg',HKszReg)
            if (!szReg.test(value) && !HKszReg.test(value)) {
                callback(new Error("请输入正确的手机号码"));
            } else {
                callback();
            }
        };
        return {
            oldCompany_id: '',
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
                realName: "",
                sName: "",
                position: "",
                phone: "",
                rID: "",
                email: "",
                telephone: "",
                division: "",
                utype: "AD",
                puid: ""
            },
            oldClientForm: {},
            oldcompanyInfo: {},
            companyForm: {
                cityArr: [],
                // 选中之后的行业组合
                industryIdArr: [],
                cName: "",
                cAddress: "",
                cBrand: "",
                rName: "",
                cRemark: "",
                // 地区id
                rID: "",
                // 行业id
                iID: 56,
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
                        trigger: "change"
                    },
                    {
                        type: "number",
                        message: "只能输入数字",
                        trigger: "change"
                    },
                    { validator: validatePhone, trigger: "blur" }
                ],
                email: [{ validator: validateEmail, trigger: "blur" }],
                // cityArr :[
                // 	{required:true, message:'请选择所在地', trigger:'blur'}
                // ],
                telephone: [{ validator: validateFixphone, trigger: "blur" }],
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
            this.sessionData = JSON.parse(sessionStorage.getItem('session_data'));
        },
        // 处理成所需要的数据格式或者说文本
        getFormatData() {
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                customerId: sessionStorage.getItem('customerId')
            };
            api.getApi(this.Advertisement+'/GetCustomerInfo', info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    if(!res.data.SysCode){
                        let info = res.data;
                        let BInfo = {
                            cityArr: [],
                            // 选中之后的行业组合
                            industryIdArr: [],
                            cID: info.cID ? info.cID : '',
                            rID: info.crID ? info.crID : '',
                            cName: info.cName ? info.cName :'',
                            cAddress: info.cAddress ? info.cAddress : '',
                            cBrand: info.cBrand ? info.cBrand: '',
                            rName: info.rName ? info.rName: '',
                            cRemark: info.cRemark ? info.cRemark : '',
                            iID: info.iID ? info.iID : '',
                            iName: ""
                        };
                        let uInfo = {
                            // 选中之后的区域组合
                            cityArr: [],
                            uID: info.uID,
                            uWho: info.uWho ? info.uWho: '',
                            rID: info.rID ? info.rID : '',
                            realName: info.realName ? info.realName : '',
                            email: info.email ? info.email : '',
                            phone: info.phone ? info.phone : '',
                            position: info.position ? info.position: '',
                            telephone: info.telephone ? info.telephone : '',
                            rName: "",
                            division: info.division ? info.division : '',
                            puName: info.puName ? info.puName : '',
                            sName: info.sName ? info.sName : '',
                            utype: "AD",
                            puid: info.puID ? info.puID :''
                        };
                        this.oldCompany_id = BInfo.cID;
                        // 用户信息
                        this.clientForm = uInfo;
                        this.clientForm.phone = Number(uInfo.phone);
                        let parStr = this.clientForm.rID?this.clientForm.rID.toString().substring(0, 2) + "0000" : '';
                        let rid = this.clientForm.rID?this.clientForm.rID.toString().substring(0, 4) + "00" : '';
                        let result = [parStr, rid];
                        // this.handleItemChange(result);
                        this.clientForm.cityArr = result;
                        this.oldClientForm = Object.assign({}, this.clientForm);
                        // 公司信息
                        this.companyForm = BInfo;
                        let upinfo = {
                            token: this.sessionData.token,
                            uid: this.sessionData.uID,
                            cid: this.companyForm.cID,
                        };
                        api.getApi(this.Advertisement+"/GetBrand", upinfo).then(res => {
                            console.log(res.data);
                            this.oldBrandTags = res.data;
                        });
                        let arr = JSON.parse(sessionStorage.getItem("industry"));
                        // 如果有行业id则cascader显示出对应的行业
                        let industryResult = [
                            industryToText.getpiID(this.companyForm.iID, arr),
                            this.companyForm.iID
                        ];
                        this.companyForm.industryIdArr = industryResult;
                        // 如果有市区id则cascader显示出对应的市区
                        let cParStr = this.companyForm.rID.toString().substring(0, 2) + "0000";
                        let cRid = this.companyForm.rID.toString().substring(0, 4) + "00";
                        let cResult = [cParStr, cRid];
                        // this.handleItemChange(cResult);
                        this.companyForm.cityArr = cResult;
                        this.oldcompanyInfo = this.companyForm;
                    }
                }
            });
        },
        handleChange(val) {
            this.companyForm.industryIdArr = val;
        },
        seleProCom(val) {
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
            this.getFormatData();
        },
        // 点击省级去显示其对应市级
        // handleItemChange(val) {
        //     console.log("select", val);
        // },
        // 输入获取公司信息(远程搜索)
        querySearchAsync(queryString, callback) {
            if (queryString) {
                let info ={
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    cn: queryString
                };
                api
                    .postApi(this.Advertisement+"/GetCompanyInfo", { cn: queryString })
                    .then(res => {
                        if (res.data) {
                            for (let i of res.data) {
                                i.value = i.cName; //将CUSTOMER_NAME作为value
                            }
                            // this.allCompany = res.data;
                            // var results = this.allCompany;
                            var results = res.data;
                            // this.companyForm.cID = '';
                            clearTimeout(this.timeout);
                            this.timeout = setTimeout(() => {
                                callback(results);
                            }, 3000 * Math.random());
                        }
                    });
            }
        },
        // 判断公司信息是否修改
        isChangeCom() {
            let companyInfo = JSON.parse(sessionStorage.getItem("companyInfo"));
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
        // 判断客户信息是否修改
        isChangeUser() {
            let userInfo = this.oldClientForm;
            console.log(userInfo, this.clientForm);
            for (let data of [this.clientForm]) {
                for (let item of [userInfo]) {
                    if (
                        data.division != item.division ||
                        data.email != item.email ||
                        data.phone != item.phone ||
                        data.position != item.position ||
                        data.puName != item.puName ||
                        data.telephone != item.telephone ||
                        data.cityArr[1] != item.rID
                    ) {
                        return true;
                    }
                }
            }
            return false;
        },
        // 修改
        submitData() {
            console.log(this.isChangeCom());
            let client_bool = false;
            let company_bool = false;
            this.$refs["clientForm"].validate(valid => {
                if (valid) {
                    client_bool = true;
                } else {
                    return false;
                }
            });
            this.$refs["companyForm"].validate(valid => {
                if (valid) {
                    company_bool = true;
                } else {
                    return false;
                }
            });
            if(company_bool && client_bool){
                // 如果有新填入品牌则新增品牌
                if (this.companyTags.length) {
                    let cid = (this.companyForm.cID==this.oldCompany_id) ? this.oldCompany_id : this.companyForm.cID;
                    // 新增品牌
                    this.addBrand(this.companyTags, cid);
                }
                this.updateCompany();
            }
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
            // cForm.cID = (cForm.cID==this.oldCompany_id) ? this.oldCompany_id : cForm.cID;
            let companyInfo = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                cid: cForm.cID,
                cname: cForm.cName,
                caddress: cForm.cAddress,
                rid: cForm.cityArr[1],
                iid: cForm.industryIdArr[1],
                cremark: cForm.cRemark
            };
            if(this.isChangeCom()){
                // 修改公司信息
                api.postApi(this.UCAPI+"/SetMyCom", companyInfo)
                    .then(res => {
                        let mes = res.data;
                        if (mes.SysCode == 300200) {
                            // Message.success("修改公司信息成功");
                            if(this.isChangeUser()){
                                this.updateUser(mes.SysCode);
                            }else{
                                this.changRoute('修改公司信息成功,是否跳转到列表页面');
                            }
                        } else if(mes.SysCode == 100403) {
                            // Message.warning(mes.MSG);
                            if(this.isChangeUser()){
                                this.updateUser(mes.SysCode);
                            }else{
                                this.changRoute('没有权限修改公司信息,是否跳转到列表页面');
                            }
                        }else if(mes.SysCode == 100302){
                            this.loginTimeout();
                        }else{
                            Message.warning(mes.MSG);
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
            }else{
                if(this.isChangeUser()){
                    this.updateUser();
                }else{
                    Message.warning('请填写你需要修改的信息');
                }
            }
        },
        // 编辑之后进行跳转
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
                    Message.info('取消了操作');
                    // this.companyTags = [];
                    // this.oldBrandTags = [];
                    // this.isFill = false;
                });
        },
        // 新增品牌
        addBrand(arr, cID) {
            for (let brand of arr) {
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    bt: brand,
                    cid: cID
                };
                api.getApi(this.Advertisement+"/AddBrand", info).then(res => {
                    console.log(res.data);
                    this.oldBrandTags.push(res.data);
                });
            }
            this.companyTags = [];
        },
        // 修改用户信息
        updateUser(code ='') {
            // uid         int【必填】     当前用户UserID
            // toid        int【必填】     被操作的UserID
            // rid         int             地区rID
            // rn          String          真实姓名
            // phone       String          移动电话
            // telephone   String          固定电话
            // email       String          电子邮箱
            // position    String          职务
            // division    String          所属部门
            let clForm = this.clientForm;
            let userInfo = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                toid: clForm.uID,
                rid: clForm.cityArr[1] ? clForm.cityArr[1] : "",
                phone: clForm.phone,
                telephone: clForm.telephone,
                email: clForm.email,
                position: clForm.position,
                division: clForm.division
            };
            api
                .postApi(this.UCAPI+"/SetMyCustomer", userInfo)
                .then(res => {
                    console.log(res);
                    let userMsg = res.data;
                    if (userMsg.SysCode == 100200) {
                        if(code==300200){
                            this.changRoute('成功修改客户和公司信息,是否跳转到列表页面');
                        }else if(code == 100403){
                           this.changRoute('成功修改客户信息,没有权限修改公司信息,是否跳转到列表页面');
                        }else{
                           this.changRoute('成功修改客户信息,是否跳转到列表页面');
                        }
                    } else if(userMsg.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(userMsg.MSG);
                    }
                })
                .catch(res => {
                    console.log(res);
                });
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
/*tags*/
.tags {
    position: relative;
}
.tags::before {
    position: absolute;
    left: 18px;
    top: 9px;
    content: "*";
    color: #f56c6c;
}

/*面包屑导航*/
.ad_mediaMana_nav {
    position: relative;
    height: 0;
}

.ad_mediaMana_nav p {
    padding-left: 57px;
    position: absolute;
    left: 0;
    top: 12px;
    font-size: 14px;
    line-height: 18px;
}

.ad_mediaMana_nav p em {
    font-size: 14px;
    color: #d9d9d9;
    line-height: 18px;
}

.ad_mediaMana_nav p a {
    color: #666;
}

.ad_mediaMana_nav p a:nth-of-type(1) {
    color: #999;
}

.ad_mediaMana_wrap {
    margin-bottom: 109px;
    position: relative;
}

/*wrap*/
.mediaMana_content_top {
    padding: 42px 60px 0 60px;
}

.mediaMana_content_bottom {
    padding: 11px 60px;
}

.content_top_wrap,
.content_bottom_wrap {
    background: #ffffff;
    border: 1px solid #dedede;
    padding-top: 3px;
    /*height: 280px;*/
}
.content_bottom_wrap.companyInfo {
    /*height: 280px;*/
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
    border-left: 2px solid #465d89;
    margin-top: 8px;
}

.content_top_wrap .content_top_form_wrap,
.content_bottom_wrap .content_bottom_form_wrap {
    padding: 18px;
}

/*按钮*/
.mediaMana_content_bottom .content_bottom_btn {
    position: absolute;
    bottom: -66px;
    margin-bottom: 22px;
    left: 45.3%;
}

.mediaMana_content_bottom .content_bottom_btn button {
    width: 80px;
    height: 34px;
    outline: none;
    cursor: pointer;
}

.mediaMana_content_bottom .content_bottom_btn button.create {
    background: #108ee9;
    border-radius: 2px;
    font-size: 14px;
    border: none;
    color: #ffffff;
}

.mediaMana_content_bottom .content_bottom_btn button.cancel {
    background: #f5f6fa;
    border: none;
    font-size: 14px;
    color: #979797;
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
/deep/ .input-new-tag .el-input__inner {
    width: 90px !important;
    height: 34px;
    position: relative;
    top: -5px;
    left: -9px;
}
/deep/ .input-new-tag .el-input__suffix {
    top: -4px;
    right: 14px;
}

/deep/.button-new-tag {
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

/*表单*/
/deep/.el-form.demo-ruleForm {
    /*display: flex;
		!*justify-content: space-between;*!
		flex-wrap: wrap;*/
}

/*客户信息表单*/
.el-input {
    width: 240px;
    height: 34px;
}

/deep/ .el-input__inner {
    width: 240px;
    height: 34px;
}

.lngNlat {
    display: inline-block;
}

/deep/ .RlngNlat .el-form-item__content {
    margin-left: -1px !important;
}

/deep/ .lngNlat .el-input__inner {
    width: 118px;
}

/deep/ .rmb .el-input__inner {
    padding-left: 30px;
}

/deep/ .lngNlat .el-input {
    width: 118px;
}

/deep/ .el-form-item {
    margin-bottom: 32px;
    min-width: 33.33%;
    max-width: 33.33%;
    /*float: left;*/
}
/deep/ form.el-form.demo-ruleForm{
  display: flex;
  flex-wrap: wrap;
}



/deep/ .el-popper[x-placement^="bottom"] {
    margin-top: 3px !important;
}

/deep/ .el-textarea__inner {
    width: 240px;
    height: 76px !important;
    resize: none;
    position: relative;
    top: 3px;
}

/deep/ .el-form-item__error {
    top: 95%;
    width: 200px;
}

/deep/ .el-popper[x-placement^="bottom"] {
    margin-top: 3px !important;
    top: 200px !important;
}

/*1440*/
@media all and (min-width: 1420px) {
}

/*1920*/
@media all and (min-width: 1900px) {
    .mediaMana_content_bottom .content_bottom_btn {
        position: absolute;
        bottom: -66px;
        left: 896px;
    }
    /deep/ .el-form-item {
        margin-bottom: 32px;
        min-width: 25%;
        max-width: 25%;
    }
}
</style>
