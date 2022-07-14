<template>
  <div class="mediaDetail">
    <div class="ad_mediaDetail_wrap">
      <div class="ad_mediaDetail_nav clearfix">
        <p>
          <a href="#">账号管理</a>
          <em> / </em>
          <a href="#" v-if="!isEdit">创建账号</a>
          <a href="#" v-else>修改账号</a>
        </p>
      </div>
      <!--客户信息-->
      <div class="mediaList_wrap">
        <div class="mediaList_container">
          <el-form
            :model="accountForm"
            status-icon
            :rules="accountRules"
            ref="accountForm"
            label-width="120px"
            class="demo-ruleForm"
          >
            <el-form-item label="账号：" prop="account">
              <el-input
                v-model.trim="accountForm.account"
                placeholder="请输入账号"
                :disabled="isEdit"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="realName">
              <el-input
                v-model.trim="accountForm.realName"
                placeholder="请输入真实姓名"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属公司：" prop="company">
              <el-select
                v-model="accountForm.company"
                placeholder="请选择所属公司"
                filterable
                @change="companyChange"
                size="small"
              >
                <el-option
                  v-for="item in companyArr"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="角色：" prop="role">
              <el-select
                v-model="accountForm.role"
                placeholder="请选择角色"
                :disabled="isEdit"
                @change="roleSelect"
                size="small"
              >
                <el-option
                  v-for="item in roleArr"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <template v-if="accountForm.role == 'DEV'">
              <!-- 开发楼盘人员 -->
              <el-form-item label="开发类别：" prop="devManageLevel">
                <el-select
                  v-model="accountForm.devManageLevel"
                  placeholder="请选择开发类别"
                  size="small"
                >
                  <el-option
                    v-for="item in devManageLevelArr"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="accountForm.role == 'ADN_EP'">
              <!-- 工程人员后台权限 -->
              <el-form-item label="后台权限：">
                <el-switch
                  v-model="accountForm.backstagePermission"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  :disabled="showBackstagePermission"
                ></el-switch>
                <el-tooltip placement="top" v-if="showBackstagePermission">
                  <div slot="content">
                    贵司尚未开通。<a
                      class="learn-more"
                      href="https://apps.qinlinad.com/engineer.html"
                      target="_blank"
                      >了解该功能</a
                    >
                  </div>
                  <img
                    class="question-icon"
                    src="../../assets/images/question_icon.png"
                  />
                </el-tooltip>
              </el-form-item>
            </template>
            <el-form-item
              label="工程类别："
              prop="engineerLevel"
              v-if="haveEPPerssion"
            >
              <el-select
                v-model="accountForm.engineerLevel"
                placeholder="请选择工程类别"
                @change="engineerCategorySelect"
                size="small"
              >
                <el-option
                  v-for="item in engineerLevelArr"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="媒体权限："
              prop="mediaPermission"
              v-if="haveEPPerssion"
            >
              <el-select
                multiple
                v-model="accountForm.mediaPermission"
                placeholder="请选择媒体权限"
                @change="mediaAccessSelect"
                size="small"
              >
                <el-option
                  v-for="item in mediaPermissionArr"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <template
              v-if="sessionData.uType == 'ADN_SA' && accountForm.role == 'BD'"
            >
              <el-form-item label="销售类别：" prop="roleLevel">
                <el-select
                  v-model="accountForm.saleManageLevel"
                  placeholder="请选择角色"
                  size="small"
                >
                  <el-option :value="2" label="KA销售"></el-option>
                  <el-option :value="0" label="地方销售"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="权限城市："
                prop="roleCity"
                v-if="accountForm.saleManageLevel"
              >
                <el-select
                  v-model="accountForm.roleCity"
                  placeholder="请选择权限城市"
                  multiple
                  filterable
                  @change="changeCity"
                  size="small"
                >
                  <el-option
                    v-for="item in roleCityArr"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="accountForm.role == 'BD'">
              <el-form-item label="上级：" prop="boss">
                <el-autocomplete
                  v-model="accountForm.boss"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入账号"
                  @select="handleSelect"
                  size="small"
                >
                </el-autocomplete>
              </el-form-item>
              <!-- <el-form-item label="上级：" v-if="isEdit">
                <el-input
                  disabled="disabled"
                  :value="accountForm.boss"
                  size="small"
                ></el-input>
              </el-form-item> -->
            </template>
            <template
              v-if="sessionData.uType == 'ADN_SA' && accountForm.role == 'MD'"
            >
              <el-form-item label="媒介类别：" prop="roleLevel">
                <el-select
                  v-model="accountForm.mediaManageLevel"
                  placeholder="请选择角色"
                  size="small"
                >
                  <el-option :value="1" label="全国媒介"></el-option>
                  <el-option :value="0" label="地方媒介"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="部门：" prop="division">
              <el-input
                v-model="accountForm.division"
                placeholder="请输入部门"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="职务：" prop="position">
              <el-input
                v-model="accountForm.position"
                placeholder="请输入职务"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号码：" prop="phone">
              <el-input
                v-model="accountForm.phone"
                maxlength="11"
                minlength="8"
                placeholder="请输入手机号码"
                size="small"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input
                v-model="accountForm.email"
                placeholder="请输入邮箱"
                type="email"
                size="small"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="content_bottom_btn">
        <el-button type="primary" @click="submitForm('accountForm')">{{
          isEdit ? "保存" : "创建"
        }}</el-button>
        <el-button plain type="default" @click="resetForm()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import sessFun from "../../commonFun/sessFun.js";
import api from "../../api/api";
// 不同环境测试公司id
let testAsrIDConfig = {
  dev: 426,
  test: 426,
  gray: 426,
  prod: 426
};
export default {
  name: "createClient",
  components: {},
  data() {
    let validateAccount = (rule, value, callback) => {
      let reg = /^[^\u4e00-\u9fa5]{0,}$/;
      if (!reg.test(value)) {
        callback(new Error("只能输入字母、数字、符号"));
      } else {
        callback();
      }
    };
    let validateAssetId = (rule, value, callback) => {
      let szReg = /^1[3456789]\d{9}$/;
      let HKszReg = /^\d{8}$/; // 香港号码
      // console.log('szReg',szReg,'HKszReg',HKszReg)
      if (!szReg.test(value) && !HKszReg.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    let validateBoss = (rule, value, callback) => {
      if (value) {
        if (!this.accountForm.puID) {
          callback(new Error("请输入正确的账号并进行选择"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      timeout: null,
      isEdit: false, //新建/修改
      // 角色列表
      roleArr: [
        {
          label: "超级管理员",
          value: "ADN_SM",
        },
        {
          label: "媒介",
          value: "MD",
        },
        {
          label: "销售",
          value: "BD",
        },
        {
          label: "运营",
          value: "ADN_OP",
        },
        {
          label: "工程人员",
          value: "ADN_EP",
        },
      ],
      // 公司列表
      companyArr: [
        {
          label: "亲邻科技",
          value: 1,
        },
        {
          label: "亲邻科技2",
          value: 2,
        },
      ],
      // 工程类别
      engineerLevelArr: [
        {
          label: "工程总监",
          value: 1,
        },
        {
          label: "运维人员",
          value: 0,
        },
      ],
      // 开发类别
      devManageLevelArr: [
        {
          label: "开发人员",
          value: 0,
        },
        {
          label: "资产人员",
          value: 1,
        },
        {
          label: "开发总监",
          value: 2,
        },
      ],
      // 媒体权限
      mediaPermissionArr: [],
      //表单
      accountForm: {
        account: "",
        realName: "",
        role: "",
        company: "",
        boss: "",
        position: "",
        engineerLevel: "",
        devManageLevel: "",
        mediaPermission: [],
        phone: "",
        division: "",
        email: "",
        saleManageLevel: "",
        mediaManageLevel: "",
        roleCity: [],
        backstagePermission: 0,
      },
      // 权限城市数组
      roleCityArr: [],
      accountRules: {
        account: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur",
          },
          {
            max: 50,
            message: "最多只能输入50个字节",
            trigger: "blur",
          },
          { validator: validateAccount, trigger: "blur" },
        ],
        realName: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur",
          },
          {
            max: 30,
            message: "最多只能输入30个字节",
            trigger: "blur",
          },
        ],
        role: [{ required: true, message: "角色不能为空", trigger: "blur" }],
        devManageLevel: [
          { required: true, message: "开发类别不能为空", trigger: "blur" },
        ],
        engineerLevel: [
          { required: true, message: "工程类别不能为空", trigger: "blur" },
        ],
        mediaPermission: [
          { required: true, message: "媒体权限不能为空", trigger: "blur" },
        ],
        company: [
          {
            required: true,
            message: "请选择所属公司",
            trigger: "blur",
          },
        ],
        position: [
          {
            max: 20,
            message: "最多只能输入20个字节",
            trigger: "blur",
          },
        ],
        division: [
          {
            max: 20,
            message: "最多只能输入20个字节",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur",
          },
          { validator: validateAssetId, trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur",
          },
        ],
        boss: [{ validator: validateBoss, trigger: "blur" }],
      },
      // 登录信息
      sessionData: "",
      haveEPPerssion: false,
    };
  },
  mounted() {
    this.getSession();
    this.getCompany();
    this.getInitEditInfo();
    if (
      this.sessionData.rela == "直营" ||
      this.sessionData.asrID == testAsrIDConfig[this.env]
    ) {
      this.roleArr.push({
        label: "开发",
        value: "DEV",
      });
    }
  },
  methods: {
    //获取媒体权限数据
    getMediaPermission(){
      let info={
        companyIds: this.accountForm.company
      }
      api.getApi("/addsp/api/v1/company/mediaTypes", info).then(res => {
        if(res.data.SysCode== 200200){
          let _data=res.data.data;
          let _newData=[];

          if(_data.length>0){
            _data.forEach((item)=>{
              _newData.push({
                label: item.name,
                value: item.id,
              })
            })
          }
          this.mediaPermissionArr=_newData;
        }else{
          this.$message({
              message: res.data.MSG,
              type: 'error'
          });
        }
      }).catch((err)=>{
        console.log(err);
      })
    },

    /**
     * @description: level转换成角色uType
     * @param {*} utype
     * @return {*}
     */
    translateToUtype(role) {
      switch (role) {
        case "BD":
          return {
            0: "ADN_BD",
            2: "ADN_BD_KA",
          }[this.accountForm.saleManageLevel || 0];
        case "MD":
          return {
            0: "ADN_MD",
            1: "ADN_MD_COUNTRY",
          }[this.accountForm.mediaManageLevel || 0];
        case "DEV":
          return {
            0: "ADN_DEV",
            1: "ADN_DEV_ASSET",
            2: "ADN_DEV_LEADER",
          }[this.accountForm.devManageLevel || 0];
        default:
          return role;
      }
    },
    /**
     * @description: uType转换成角色和level
     * @param {*} uType
     * @return {*}
     */
    translateToLevel(uType) {
      return (
        {
          ADN_BD: {
            role: "BD",
            saleManageLevel: 0,
          },
          ADN_BD_KA: {
            role: "BD",
            saleManageLevel: 2,
          },
          ADN_MD: {
            role: "MD",
            mediaManageLevel: 0,
          },
          ADN_MD_COUNTRY: {
            role: "MD",
            mediaManageLevel: 1,
          },
          ADN_DEV: {
            role: "DEV",
            devManageLevel: 0,
          },
          ADN_DEV_ASSET: {
            role: "DEV",
            devManageLevel: 1,
          },
          ADN_DEV_LEADER: {
            role: "DEV",
            devManageLevel: 2,
          },
        }[uType] || { role: uType }
      );
    },
    // 登录信息及角色数据
    getSession() {
      this.sessionData = sessFun.getSess();
    },
    // 公司数据
    getCompany() {
      let sess = this.sessionData;
      let info = {
        uid: sess.uID,
        token: sess.token,
      };
      api
        .getApi(this.apiVar.UCAPI + "/getCompany", info)
        .then((res) => {
          console.log(res.data);
          if (res.data.SysCode == 200200) {
            let result = [];
            if (sess.ascType == 0) {
              for (let data of res.data.data) {
                let obj = {
                  label: data.asName,
                  value: data.asrID,
                };
                // customFunctionList: [{type: 3, typeValue: "工程人员登陆后台权限"}]
                let tempFunArr = data.customFunctionList;
                Array.isArray(tempFunArr) &&
                  tempFunArr.find((item) => {
                    return item.type == 3;
                  }) &&
                  (obj.backstagePermission = 1);
                result.push(obj);
              }
              // this.companyArr = result;
            } else {
              let data = res.data.data;
              let obj = {
                label: data.asName,
                value: data.asrID,
              };
              let tempFunArr = data.customFunctionList;
              Array.isArray(tempFunArr) &&
                tempFunArr.find((item) => {
                  return item.type == 3;
                }) &&
                (obj.backstagePermission = 1);
              result.push(obj);
            }
            this.companyArr = result;
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 选择角色
    roleSelect(val) {
      this.haveEPPerssion = false;
      if (
        val == "ADN_EP" &&
        this.sessionData.uType == "ADN_SM" &&
        this.sessionData.customPermission.miniAppPermission == 1
      ) {
        // 是否有新增工程类别和媒体权限的权限
        this.haveEPPerssion = true;
      }
      if (this.accountForm.role == "BD") {
        this.getRoleCity();
      }
    },
    // 选择工程类型
    engineerCategorySelect(val) {},
    // 选择媒体权限
    mediaAccessSelect(val) {},
    // 选择公司
    companyChange(val) {
      if (
        this.companyArr.find((item) => {
          return item.value == val && item.backstagePermission == 1;
        })
      ) {
        this.showBackstagePermission = false;
      } else {
        this.accountForm.backstagePermission = 0;
        this.showBackstagePermission = true;
      }

      if (
        !(
          this.sessionData.rela == "直营" ||
          this.sessionData.asrID == testAsrIDConfig[this.env]
        )
      ) {
        let devIndex = this.roleArr.findIndex((item) => item.value == "DEV");
        if (val == testAsrIDConfig[this.env] && devIndex == -1) {
          this.roleArr.push({
            label: "开发",
            value: "DEV",
          });
        } else if (val != testAsrIDConfig[this.env] && devIndex != -1) {
          this.roleArr.splice(devIndex, 1);
          // this.accountForm.role = "";
        }
      }
      this.getMediaPermission();
    },
    // 输入账号获取上级信息(远程搜索)
    querySearchAsync(queryString, callback) {
      let sessionData = this.sessionData;
      if (queryString) {
        let isOnlyID = false;
        if (this.accountForm.company) {
          isOnlyID = true;
        } else {
          this.$message.warning("请先选择所属公司");
          return;
        }
        if (isOnlyID) {
          let info = {
            uid: sessionData.uID,
            token: sessionData.token,
            asrID: this.accountForm.company,
            uType: "ADN_BD,ADN_BD_COUNTRY,ADN_BD_KA",
            sname: queryString,
          };
          api
            .postApi(this.apiVar.UCAPI + "/CheckUserName", info)
            .then((res) => {
              if (res.data.SysCode == 200200) {
                if (res.data.data.uID) {
                  let data = res.data.data;
                  data.value = data.realName;
                  this.accountForm.boss = data.realName;
                  this.accountForm.puID = data.uID;
                  var results = [data];
                  clearTimeout(this.timeout);
                  this.timeout = setTimeout(() => {
                    callback(results);
                  }, 3000 * Math.random());
                } else {
                  this.$message.warning("该公司下没有此销售");
                }
              } else {
                this.$message.warning(res.data.MSG);
              }
            });
        }
      }
    },
    handleSelect(item) {
      console.log(item);
    },
    //根据登录用户的权限设置创建新帐号的上级
    submitForm(formName) {
      if (
        this.accountForm.role == "BD" &&
        this.accountForm.saleManageLevel &&
        !this.accountForm.roleCity.length
      ) {
        this.$message.warning("当前是想创建全国销售,请选择权限城市");
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            this.postEditInfo();
          } else {
            this.createFun();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑、新建数据接口模板
    setSubmitData() {
      let actFrom = this.accountForm;
      let sess = this.sessionData;
      let account = {
        uid: sess.uID,
        token: sess.token,
        realname: actFrom.realName,
        sname: actFrom.account,
        utype: this.translateToUtype(actFrom.role),
        division: actFrom.division,
        position: actFrom.position,
        engineerLevel: actFrom.engineerLevel,
        // devManageLevel: actFrom.devManageLevel,
        phone: actFrom.phone,
        email: actFrom.email,
        puid: "",
        asrID: actFrom.company,
        authorCity: actFrom.roleCity ? this.sortCity(actFrom.roleCity) : "",
      };
      if (Array.isArray(actFrom.mediaPermission) && actFrom.mediaPermission.length > 0) {
        account.mediaPermission = actFrom.mediaPermission.join(',');
      }
      if (actFrom.puID) {
        account.puid = actFrom.puID;
      }
      if (actFrom.role == "ADN_EP") {
        account.backstagePermission = actFrom.backstagePermission || 0;
      }
      if (this.isEdit) {
        account.uID = actFrom.uID;
      }
      return account;
    },
    sortCity(arr) {
      arr.sort((a, b) => {
        return a - b;
      });
      return arr.join(",");
    },
    // 修改账户信息接口
    postEditInfo() {
      let account = this.setSubmitData();
      console.log(account);
      api
        .postApi(this.apiVar.UCAPI + "/RegUser", account)
        .then((res) => {
          console.log(res);
          let data = res.data;
          if (data.SysCode == 200200) {
            this.$alert(data.MSG + "<br>", "修改用户", {
              showClose: false,
              dangerouslyUseHTMLString: true,
              confirmButtonText: "确定",
            }).then((res) => {
              this.resetForm();
            });
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //注册接口
    createFun() {
      let account = this.setSubmitData();
      console.log("提交的账号信息", account);
      api
        .postApi(this.apiVar.UCAPI + "/RegUser", account)
        .then((res) => {
          console.log(res);
          let data = res.data;
          if (
            data.SysCode === 100300 ||
            data.MSG === "注册失败，可能是账户名称已被占用"
          ) {
            this.$message({
              message: "注册失败，可能是账户名称已被占用",
              type: "warning",
            });
          } else {
            if (data.SysCode == 200200) {
              this.$alert(
                `创建成功，初始密码为<strong style="font-weight: 600">手机号+账号</strong>，建议首次登录后修改密码！`,
                "注册用户",
                {
                  showClose: false,
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: "确定",
                }
              ).then((res) => {
                this.resetForm();
              });
            } else {
              this.$message.warning(data.MSG);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //重置表单
    resetForm() {
      if (this.isEdit) {
        if (this.sessionData.uType == "ADN_SA") {
          this.$router.push("./admin");
        } else {
          this.$router.push("./accountList");
        }
      } else {
        this.$refs["accountForm"].resetFields();
        window.history.go(-1);
      }
    },
    // 获取修改账户初始信息
    getInitEditInfo() {
      let inputPath = this.$route.fullPath;
      if (inputPath.indexOf("edit=y") !== -1) {
        let userId = sessionStorage.getItem("userId");
        let sess = this.sessionData;
        if (userId) {
          let info = {
            uid: sess.uID,
            token: sess.token,
            userId: userId,
          };
          api
            .postApi(this.apiVar.UCAPI + "/GetUser", info)
            .then((res) => {
              console.log(res.data);
              if (res.data.SysCode == 200200) {
                this.isEdit = true;
                let result = res.data.data;
                let editInfo = {
                  uID: result.uID,
                  account: result.sName,
                  realName: result.realName,
                  ...this.translateToLevel(result.uType),
                  // role: result.uType,
                  boss: result.puName ? result.puName : "",
                  position: result.position ? result.position : "",
                  engineerLevel: result.engineerLevel,
                  // devManageLevel:
                  //   result.devManageLevel >= 0 ? result.devManageLevel : "",
                  // 广告门:0， 道闸:1 目前是固定的
                  mediaPermission: result.mediaPermission ? result.mediaPermission.split(',').map(optionItem => optionItem * 1) : [],
                  phone: result.phone ? result.phone : "",
                  division: result.division ? result.division : "",
                  email: result.email ? result.email : "",
                  company: result.asrID ? result.asrID : "",
                  roleCity: result.authorCity
                    ? result.authorCity.split(",")
                    : [],
                  // saleManageLevel: result.saleManageLevel
                  //   ? result.saleManageLevel
                  //   : 0,
                  // mediaManageLevel: result.mediaManageLevel
                  //   ? result.mediaManageLevel
                  //   : 0,
                  backstagePermission: result.backstagePermission
                    ? result.backstagePermission
                    : 0,
                };
                this.companyChange(editInfo.company);
                this.accountForm = editInfo;
                this.roleSelect(editInfo.role);
              } else {
                this.$message.warning(res.data.MSG);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.$router.push("./createAccount");
          this.isEdit = false;
        }
      } else {
        this.isEdit = false;
        sessionStorage.removeItem("account_detail");
      }
    },
    // 获取权限城市
    getRoleCity() {
      console.log("getRoleCity");
      this.roleCityArr = [];
      let info = {
        data: { city: "" },
        service: "GetCityInfo",
        token: this.sessionData.token,
        uid: this.sessionData.uID,
      };
      api.postApi_new(this.apiVar.Media, info).then((res) => {
        console.log(res.data);
        if (res.data.SysCode == 200200) {
          let resinfo = res.data.data;
          let result = [];
          for (let data of resinfo) {
            let obj = {
              label: data.rName,
              value: data.rID.toString(),
            };
            result.push(obj);
          }
          result.unshift({
            label: "全国",
            value: "0",
          });
          this.roleCityArr = result;
        } else {
          this.$message.warning(res.data.MSG);
        }
      });
    },
    // 权限城市勾选
    changeCity(val) {
      if (val.includes("0")) {
        this.accountForm.roleCity = ["0"];
      }
    },
  },
  computed: {
    showBackstagePermission: {
      get() {
        if (
          this.companyArr.find((item) => {
            return (
              item.value == this.accountForm.company &&
              item.backstagePermission == 1
            );
          })
        ) {
          return false;
        } else {
          return true;
        }
      },
      set(newValue) {
        return newValue;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-form.demo-ruleForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  .el-form-item {
    margin-bottom: 16px;
    .el-form-item__label {
      padding: 0;
    }
    .el-form-item__content {
      width: 300px;
    }
    .el-input__inner {
      width: 300px;
    }
  }
}

/*按钮*/
.content_bottom_btn {
  margin: 32px 64px 0;
  text-align: center;
}

.content_bottom_btn button {
  width: 80px;
  height: 34px;
  outline: none;
  cursor: pointer;
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
/deep/ .el-popper[x-placement^="bottom"] {
  margin-top: 3px !important;
  top: 200px !important;
}

.learn-more {
  text-decoration: underline;
  color: #fff;
  cursor: pointer;
}

.question-icon {
  display: inline-flex;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  margin-left: 5px;
  filter: brightness(0.8);
}
</style>

