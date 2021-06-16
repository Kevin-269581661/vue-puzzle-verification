<!--
 * @Author: penglei
 * @Date: 2021-06-11 17:32:36
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-16 20:50:39
 * @FilePath: /frontend/src/components/develop/components/constractInput.vue
-->
<template>
  <div>
    <div class="ad_mediaDetail_wrap clearfix">
      <div>
        <div class="content_top_wrap">
          <div class="content_top_form_wrap">
            <el-form
              :model="constractForm"
              status-icon
              :rules="recRules"
              ref="constractForm"
              label-width="100px"
              class="demo-ruleForm resFrom"
            >
              <el-form-item
                label="基本信息"
                class="baseInfo firstInfo"
              ></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="资源名称" prop="resName">
                    <el-input v-model="recFormData.resName" disabled>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="物业公司" prop="pmc">
                    <el-input v-model="recFormData.pmc" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="联系人" prop="contactsName">
                    <el-input
                      v-model="constractForm.contactsName"
                      placeholder="请输入联系人姓名"
                      :clearable="true"
                      @blur="blurFun('contactsName')"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="el_col_box">
                  <el-form-item label="联系人手机号" prop="contactsPhone">
                    <el-input
                      v-model="constractForm.contactsPhone"
                      placeholder="请输入联系人手机号"
                      @blur="blurFun('contactsPhone')"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="合同开始日期" prop="startDate">
                    <el-date-picker
                      v-model="constractForm.startDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :editable="false"
                      placeholder="请选择合同开始日期"
                      @blur="blurFun('startDate')"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合同结束日期" prop="endDate">
                    <el-date-picker
                      v-model="constractForm.endDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :editable="false"
                      placeholder="请选择合同结束日期"
                      @blur="blurFun('endDate')"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="到期门体归属权" prop="ownership">
                    <el-select
                      placeholder="请选择到期门体归属权"
                      v-model="constractForm.ownership"
                      @blur="blurFun('ownership')"
                    >
                      <el-option label="我方" value="我方"></el-option>
                      <el-option label="物业方" value="物业方"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="合同备注" prop="remark">
                    <el-input
                      v-model="constractForm.remark"
                      placeholder="请输入合同特别条款说明"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="安装信息" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="合同媒体数量" prop="mediaCnt">
                    <el-input-number
                      v-model="constractForm.mediaCnt"
                      controls-position="right"
                      placeholder="请输入合同媒体数量"
                      @blur="blurFun('mediaCnt')"
                      :min="0"
                      :max="9999"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="赠送车场道闸" prop="freeCarGateCnt">
                    <el-input-number
                      v-model="constractForm.freeCarGateCnt"
                      controls-position="right"
                      placeholder="请输入赠送道闸数量"
                      :min="0"
                      :max="9999"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="赠送护栏门" prop="freeGuardrailDoorCnt">
                    <el-input-number
                      v-model="constractForm.freeGuardrailDoorCnt"
                      controls-position="right"
                      placeholder="请输入赠送护栏门数量"
                      :min="0"
                      :max="9999"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="赠送翼闸" prop="freeWingGateCnt">
                    <el-input-number
                      v-model="constractForm.freeWingGateCnt"
                      controls-position="right"
                      placeholder="请输入赠送翼闸数量"
                      :min="0"
                      :max="9999"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="费用信息" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="是否有场地费" prop="isVenueFee">
                    <el-select
                      v-model="constractForm.isVenueFee"
                      placeholder="请选择是否有场地费"
                      @blur="blurFun('isVenueFee')"
                    >
                      <el-option label="是" value="是"></el-option>
                      <el-option label="否" value="否"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="场地费付款方式" prop="venuePayType">
                    <el-select
                      placeholder="请选择场地费付款方式"
                      v-model="constractForm.venuePayType"
                      @blur="blurFun('venuePayType')"
                    >
                      <el-option
                        v-for="item in payTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="场地费(元/年)" prop="venueFee">
                    <el-input
                      v-model="constractForm.venueFee"
                      placeholder="请输入场地费"
                      controls-position="right"
                      @blur="blurFun('venueFee')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="场地费应付日期" prop="venueDate">
                    <el-date-picker
                      v-model="constractForm.venueDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :editable="false"
                      placeholder="请选择场地费应付日期"
                      @blur="blurFun('venueDate')"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="是否有开发费" prop="isDevFee">
                    <el-select
                      v-model="constractForm.isDevFee"
                      placeholder="请选择是否有开发费"
                      @blur="blurFun('isDevFee')"
                    >
                      <el-option label="是" value="是"></el-option>
                      <el-option label="否" value="否"></el-option
                    ></el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="开发费付款方式" prop="devPayType">
                    <el-select
                      placeholder="请选择开发费付款方式"
                      v-model="constractForm.devPayType"
                      @blur="blurFun('devPayType')"
                    >
                      <el-option
                        v-for="item in payTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="开发费(元/年)" prop="devFee">
                    <el-input
                      v-model="constractForm.devFee"
                      placeholder="请输入开发费"
                      @blur="blurFun('devFee')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="开发费应付日期" prop="devDate">
                    <el-date-picker
                      v-model="constractForm.devDate"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :editable="false"
                      placeholder="请选择开发费应付日期"
                      @blur="blurFun('devDate')"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="其它信息" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="物业规模(人数)" prop="developer">
                    <el-input
                      v-model="constractForm.developer"
                      placeholder=""
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="附件" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="24"> </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../../../api/api";
import sessFun from "../../../commonFun/sessFun.js";
export default {
  name: "resInput",
  props: {
    recFormData: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    let validateSpace = (rule, value, callback) => {
      this.isResError = false;
      if (value) {
        if (value.match(/^\s+$/)) {
          callback(new Error("所填内容不能为空格!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validatePrice = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value !== "" && !reg.test(value)) {
        callback(new Error("只能输入数字!"));
      } else {
        if (value > 9999999) {
          callback(new Error("不得大于9999999!"));
        } else {
          callback();
        }
      }
    };
    // 判断是否包含有特殊字符 // “/”
    let validateSpecialString = (rule, value, callback) => {
      let reg = /[\/]/;
      if (reg.test(value)) {
        callback(new Error("不可填写特殊符号!"));
      } else {
        callback();
      }
    };
    return {
      payTypeList: [
        { label: "按年支付固定费用", value: "按年支付固定费用" },
        { label: "一次性支付固定费用", value: "一次性支付固定费用" },
      ],
      //资源表单
      constractForm: {
        resName: "", // 资源名称
        pmc: "", // 物业公司
        contactsName: "", // 联系人
        contactsPhone: "", // 联系人手机号
        startDate: "", // 合同开始日期
        endDate: "", // 合同结束日期
        ownership: "", // 到期门体归属权
        remark: "", // 合同备注
        mediaCnt: "", //合同媒体数量
        freeCarGateCnt: "", // 赠送车场道闸
        freeGuardrailDoorCnt: "", // 赠送护栏门
        freeWingGateCnt: "", // 赠送翼闸
        isVenueFee: "", // 是否有场地费
        venuePayType: "", // 场地费付款方式
        venueFee: "", // 场地费
        venueDate: "", // 场地费应付日期
        isDevFee: "", // 是否有开发费
        devPayType: "", // 开发费付款方式
        devFee: "", // 开发费
        devDate: "", // 开发费应付日期
      },
      recRules: {
        contactsPhone: [
          {
            required: true,
            message: "请输入联系人手机号!",
            trigger: ["blur"],
          },
        ],
        startDate: [
          {
            required: true,
            message: "请选择合同开始日期!",
            trigger: "blur",
          },
        ],
        endDate: [
          {
            required: true,
            message: "请选择合同结束日期!",
            trigger: "blur",
          },
        ],
        ownership: [
          {
            required: true,
            message: "请选择到期门体归属权!",
            trigger: ["blur"],
          },
        ],
        mediaCnt: [
          { required: true, message: "请输入合同媒体数量!", trigger: "blur" },
        ],
        isVenueFee: [
          { required: true, message: "请选择是否有场地费!", trigger: "change" },
        ],
        venuePayType: [
          {
            required: true,
            message: "请选择场地费付款方式!",
            trigger: ["blur", "change"],
          },
        ],
        venueFee: [
          {
            required: true,
            message: "请输入场地费!",
            trigger: ["blur", "change"],
          },
          {
            validator: validatePrice,
            trigger: ["change", "blur"],
          },
        ],

        venueDate: [
          {
            required: true,
            message: "请选择场地费应付日期!",
            trigger: "change",
          },
        ],
        isDevFee: [
          { required: true, message: "请选择是否有开发费!", trigger: "change" },
        ],
        devPayType: [
          {
            required: true,
            message: "请选择开发费付款方式!",
            trigger: "change",
          },
        ],
        devFee: [{ required: true, message: "请输入开发费!", trigger: "blur" }],
        devDate: [
          {
            required: true,
            message: "请选择开发费应付日期!",
            trigger: "change",
          },
        ],
      },

      PathHaveEdit: false, // 新建/编辑
      doUpload: this.apiVar.qadnUrl + "/advertisement/UpLoad",

      Editloading: true, // 提交时的loading
      resData: { resID: "" }, // 创建资源成功，保存返回来的数据
      sessionData: sessFun.getSess(),
      submitBtnIsAble: false, // 防止多次点击
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted: function () {
    this.customPermission = this.sessionData.customPermission;
    // this.editFun(); // 编辑方法
  },
  methods: {
    // 资源输入框和下拉框失去光标
    blurFun(name) {
      console.log("name", name);
      // 手动触发校验
      this.$refs.constractForm.validateField(name, (valid) => {
        // console.log('错误提示信息',valid)
        if (!valid) {
          console.log("校验通过");
        } else {
          console.log("校验不通过");
        }
      });
    },
    //添加资源媒体
    createRes() {
      console.log(this.arrMedia);
      this.constractForm.uid = this.sessionData.uID;
      this.constractForm.latlng =
        this.constractForm.lat + ";" + this.constractForm.lng;
      console.log("this.constractForm", this.constractForm);
      for (let i = 0; i < this.arrMedia.length; i++) {
        console.log("arrMedia", i, this.arrMedia[i].mediaForm);
      }
      let recObj = {
        uid: this.constractForm.uid,
        rid: Number(this.constractForm.region),
        ta: this.constractForm.business, // 所属商圈
        rt: this.constractForm.rt, // 资源类型
        resname: this.constractForm.resname, // 资源名称
        resaddr: this.constractForm.resaddr, // 资源地址
        // 这里的lat为经度、lng为纬度(与生活中的lng*lat经纬度字符标识刚好相反)
        latlng: this.constractForm.latlng, // 经纬度 重庆:9.61;106.47  北京:116.46;39.92 广州: 113.27;23.13  上海:121.29;31.11 深圳:113.46;22.27
        ct: this.constractForm.floorType, //楼盘类型
        cd: this.constractForm.liveTime, // 入住时间 '2017'
        hp: (this.constractForm.buildingPrice * 100).toFixed(0), // 楼盘价格
        fn: this.constractForm.buildingNum, // 楼栋数量
        dn: this.constractForm.doorwayNum, // 出入口数量
        hn: this.constractForm.households, // 小区户数
        pmc: this.constractForm.pmc, // 物业公司
        peopleFlow: this.constractForm.peopleFlowrate, //人流量
        carFlow: this.constractForm.carFlowrate, //车流量
        parkSpaceNum: this.constractForm.carNumber, //车位数
        fullViewUrl: this.constractForm.fullViewUrl, // 资源图片

        city: this.resAddres.city,
        district: this.resAddres.area,
        resAlias: this.constractForm.resAlias, // 资源别名
        addressAlias: this.constractForm.addressAlias, // 地址别名
        description: this.constractForm.description, // 描述
        supportingFacilities: this.constractForm.supportingFacilities, // 周边配套
        buildingType: this.constractForm.buildingType, // 建筑类型
        transportation: this.constractForm.transportation, // 交通状况
        floorSpace: this.constractForm.floorSpace, // 占地面积
        constructionSpace: this.constractForm.constructionSpace, // 建筑面积
        buildingStructure: this.constractForm.buildingStructure, // 建筑结构
        greenPercentage: this.constractForm.greenPercentage, // 绿化率
        plotRatio: this.constractForm.plotRatio, // 容积率
        ownershipPeriod: this.constractForm.ownershipPeriod, // 产权年限
        developer: this.constractForm.developer, // 开发商
        // pmc: this.constractForm.propertyManagement,                      // 物业公司
        managementFee: this.constractForm.managementFee, // 物业费
        salesOfficeAdd: this.constractForm.salesOfficeAdd, // 售楼地址
        preSalePermit: this.constractForm.preSalePermit, // 预售许可证
        ownershipType: this.constractForm.ownershipType, // 产权性质
        salesPhoneNumber: this.constractForm.salesPhoneNumber, // 售楼电话
        discount: this.constractForm.discount,
      };
      for (let key in recObj) {
        if (recObj[key] === undefined || recObj[key] === null) {
          recObj[key] = "";
        }
      }
      let params = {
        uid: this.sessionData.uID,
        service: "AddRes",
        token: this.sessionData.token,
        data: recObj,
      };
      api
        .postApi_new(this.apiVar.Media, params)
        .then((res) => {
          console.log("资源数据：", res.data);
          let recData = res.data.data;
          this.resData = recData;
          if (res.data.SysCode == 200200) {
            // 设置资源图片信息
            this.resImg.ptid = recData.resID; // 资源图片的ptid就是资源的id
            this.resImg.palt = this.constractForm.resname + "-" + recData.rID;
            this.creadMediaFun(0, 0);
          } else if (
            res.data.SysCode === 100302 ||
            res.data.MSG === "登陆超时"
          ) {
            this.Editloading.close();
          } else {
            this.Editloading.close();
            sessFun.messageFun("warning", "资源创建失败！");
          }
        })
        .catch((err) => {
          console.log("新建资源请求错误", err);
          sessFun.messageFun("warning", "新建资源请求异常");
        });
    },
    // 资源图片上传前验证格式和大小
    beforeUpload_res(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        sessFun.messageFun("warning", "上传图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt2M) {
        sessFun.messageFun("warning", "上传图片大小不能超过 4MB!");
      }
      return isJPG && isLt2M;
    },
    // 资源图片上传成功
    handleDownSuccess(res) {
      console.log("上传资源图片", res);
      if (this.constractForm.fullViewUrl) {
        this.constractForm.fullViewUrl =
          this.constractForm.fullViewUrl + "," + res[0].pURL;
      } else {
        this.constractForm.fullViewUrl = res[0].pURL;
      }
      console.log(
        "this.constractForm",
        this.constractForm,
        this.constractForm.fullViewUrl
      );
    },
    // 删除原资源图片，进行重新选择
    handleRemoveR(file, fileList) {
      console.log("删除或修改了资源图片", file, fileList);
      if (this.constractForm.fullViewUrl && file.url) {
        let tempPicArr = this.constractForm.fullViewUrl.split(",");
        let resArr = tempPicArr.filter((item) => {
          if (file.response) {
            return file.response[0].pURL != item;
          } else {
            return file.url != item;
          }
        });
        this.constractForm.fullViewUrl = resArr.join(",");
      }
    },

    // 表单验证
    submitForm() {
      console.log("校验开始-----------");
      this.submitBtnIsAble = true;
      let timer = setTimeout(() => {
        this.submitBtnIsAble = false;
        clearTimeout(timer);
      }, 500);
      // 资源表单校验
      let validateResArr = [
        "contactsName",
        "contactsPhone",
        "startDate",
        "endDate",
        "ownership",
        "mediaCnt",
        "isVenueFee",
        "venuePayType",
        "venueFee",
        "venueDate",
        "isDevFee",
        "devPayType",
        "devFee",
        "devDate",
      ];
      let validatesPro = []; //Promise.all要用到的参数, 存放每次请求的Promise对象
      for (let key of validateResArr) {
        let validate = new Promise((resolve, reject) => {
          this.$refs.constractForm.validateField(key, (valid) => {
            // valid为错误信息，不为空这表示错误
            if (!valid) {
              resolve(true);
            } else {
              reject(false);
            }
          });
        });
        validatesPro.push(validate);
      }
      return Promise.all(validatesPro)
        .then((res) => {
          // 验证全部通过
          console.log("验证全部通过", res);
          return true;
        })
        .catch((err) => {
          console.log("验证失败", err);
          //验证失败 提示reject失败状态的值
          sessFun.messageFun("warning", "必填项信息不能为空或填写有误！");
          return false;
        });
    },
    //重置表单数据
    resetForm() {
      this.$refs["constractForm"].resetFields();
    },
    // 清除表单校验
    clearFromValidate() {
      console.log("清除表单校验------");
      let timer = setTimeout(() => {
        this.$refs["constractForm"].clearValidate();
        clearTimeout(timer);
      }, 500);
    },
    // 媒体详情跳转过来，获取信息并编辑 添加
    editFun() {
      let routePath = this.$route.path;
      console.log("routePath", routePath, this.$route.query);
      if (routePath.indexOf("media/mediaEdit") !== -1) {
        let recObj = JSON.parse(sessionStorage.getItem("recDetail"));
        this.resData.resID = sessionStorage.getItem("resID");
        if (recObj !== null) {
          this.PathHaveEdit = true;
          // 设置默认选中的城市
          this.constractForm.city[0] =
            recObj.rid.toString().substring(0, 2) + "0000";
          this.constractForm.city[1] = recObj.cityId;
          this.handleChange(this.constractForm.city);
          this.resAddres.city = recObj.city;
          this.resAddres.area = recObj.cityArea;
          // 获取设置资源信息
          let tempObj = {
            resID: recObj.resID,
            rt: recObj.cType,
            resname: recObj.resName,
            city: this.constractForm.city,
            region: recObj.rid.toString(),
            business: recObj.tradingArea,
            resaddr: recObj.resAddress,
            floorType: recObj.houseType,
            doorwayNum: recObj.EntryExitNum,
            buildingNum: recObj.buildingNum,
            households: recObj.HouseNum,
            buildingPrice: recObj.housePrice,
            liveTime: recObj.joinTime, // 入住时间
            pmc: recObj.pmc, // 物业公司
            peopleFlowrate: recObj.peopleFlowrate, // 人流量
            carNumber: recObj.carNumber, // 车位数
            carFlowrate: recObj.carFlowrate, // 车流量
            fullViewUrl: recObj.fullViewUrl || "",
            lat: "", // 经度
            lng: "", // 纬度
            // 房价网信息
            // city: recObj.city,
            district: recObj.district,
            resAlias: recObj.resAlias, // 资源别名
            addressAlias: recObj.addressAlias, // 地址别名
            description: recObj.description || "", // 描述
            supportingFacilities: recObj.supportingFacilities || "", // 周边配套
            buildingType: recObj.buildingType || "", // 建筑类型
            transportation: recObj.transportation || "", // 交通状况
            floorSpace: recObj.floorSpace || "", // 占地面积
            constructionSpace: recObj.constructionSpace || "", // 建筑面积
            buildingStructure: recObj.buildingStructure || "", // 建筑结构
            plotRatio: recObj.plotRatio || "", // 容积率
            greenPercentage: recObj.greenPercentage || "", // 绿化率
            ownershipPeriod: recObj.ownershipPeriod || "", // 产权年限
            developer: recObj.developer || "", // 开发商
            // propertyManagement : resData.propertyManagement || '',       // 物业公司
            managementFee: recObj.managementFee || "", // 物业费
            salesOfficeAdd: recObj.salesOfficeAdd || "", // 售楼地址
            preSalePermit: recObj.preSalePermit || "", // 预售许可证
            ownershipType: recObj.ownershipType || "", // 产权性质
            salesPhoneNumber: recObj.salesPhoneNumber, // 售楼电话
            discount: recObj.discount, // 折扣信息
          };
          //    console.log('经纬度',typeof(recObj.latLng),recObj.latLng)
          if (
            recObj.latLng != null &&
            recObj.latLng != "" &&
            recObj.latLng != undefined
          ) {
            tempObj.lat = Number(recObj.latLng.split(";")[0]); // 经度
            tempObj.lng = Number(recObj.latLng.split(";")[1]); // 纬度
          } else {
            console.log("暂无经纬度！！");
          }
          if (tempObj.rt === "写字楼") {
          }
          this.constractForm = tempObj;
          console.log("constractForm", this.constractForm);

          if (this.$route.query.add) {
            // console.log('来源于点击添加媒体')
          }
          // 清除表单校验
          this.clearFromValidate();
        } else {
          this.$router.push("./mediaInput");
          this.PathHaveEdit = false;
        }
        this.constructResImg(); // 组装要显示的资源图片
      } else {
        this.PathHaveEdit = false;
        sessionStorage.removeItem("recDetail");
        sessionStorage.removeItem("mediaList");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .ad_index_footer {
  text-align: center;
  font-size: 14px;
  color: #8a8a8a;
  margin-bottom: 16px;
  position: relative;
}

.content_top_wrap {
  background: #ffffff;
}

.content_bottom_wrap {
  margin-top: 0;
  background: #ffffff;
  padding-top: 3px;
}

.content_bottom_wrap_box {
  border-right: 1px solid rgba(230, 231, 233, 1);
  border-left: 1px solid rgba(230, 231, 233, 1);
}

.content_top_wrap .content_top_head {
  width: 100%;
  height: 35px;
  border-bottom: 1px solid #dedede;
}

.content_bottom_wrap .content_bottom_head {
  height: 35px;
  line-height: 35px;
  width: calc(100% - 80px);
  margin: 18px 32px 10px;
  padding-left: 16px;
  background: rgba(245, 246, 250, 1);
}

.content_top_wrap .content_top_head h2,
.content_bottom_wrap .content_bottom_head h2 {
  float: left;
  font-size: 16px;
  color: #333;
  font-weight: bold;
  width: 70%;
}
.content_top_wrap .content_top_form_wrap {
  padding: 0 0 16px;
}

/deep/ .el-form.demo-ruleForm {
  display: flex;
  flex-wrap: wrap;
}

.from_row {
  width: 100%;
  margin: 0 10px !important;
}

/deep/ .from_row .el-form-item {
  width: 100%;
}

/deep/ .el-cascader {
  width: 100%;
}

/deep/ .el-select {
  width: 100%;
}

/deep/ .el-input-number {
  padding-right: 0;
}

.el_col_box {
  position: relative;
}

/deep/ .el_col_box .el-autocomplete {
  width: calc(100% - 82px);
}
.the_same_error {
  position: absolute;
  bottom: 2px;
  left: 38px;
  font-size: 12px;
  color: rgb(245, 108, 108);
  font-family: "PingFangSC-Regular", "Microsoft YaHei";
}
.the_same_error > i {
  font-size: 12px;
  color: rgb(245, 108, 108);
}

.get_resName_btn {
  width: 66px;
  min-width: 66px;
}

/*经纬度*/
.form_item_box_son {
  width: 49%;
  margin-right: 1%;
  float: left;
}

.col_lng_lat {
  position: relative;
}

.lng_lat_map_btn {
  position: absolute;
  left: 100px;
  top: 6px;
  color: rgba(24, 144, 255, 1);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.el-input {
  width: 100%;
  height: 34px;
}

/deep/ .el-input__inner,
.el-input-number {
  height: 32px;
  text-align: left;
  line-height: 35px;
  padding-right: 20px;
  text-align: left;
}
/deep/ .el-input-number {
  width: 100%;
  padding-right: 0;
}
/deep/ .el-input__suffix {
  right: 0;
}

/*计数器*/
/deep/ .el-input-number__decrease,
/deep/ .el-input-number__increase {
  background-color: transparent !important;
}

/deep/ .el-icon-arrow-down {
  position: relative;
  top: 1px;
}

/deep/ .el-input-number .el-input__suffix {
  right: 42px !important;
}

/deep/
  .el-input-number.is-controls-right
  .el-input-number__decrease
  [class*="el-icon"],
.el-input-number.is-controls-right
  .el-input-number__increase
  [class*="el-icon"] {
  position: relative;
  top: 2px;
}

/deep/ .el-form-item {
  margin-bottom: 16px;
}

/deep/ .form_item_box_son .el-form-item {
  margin-bottom: 0;
}

/deep/ .el-form-item.is-required .el-form-item__label:before {
  position: absolute;
  right: 0;
  bottom: 0;
  line-height: 20px;
}

/deep/ .el-form-item.floor_house_item.is-required .el-form-item__label:before {
  left: 73px;
}

/deep/ .el-form-item.lng_lat_form_item.is-required .el-form-item__label:before {
  left: 46px;
}

/deep/ .el-form-item.baseInfo.firstInfo {
  padding-top: 0;
  margin-top: 0;
  border: none;
}

/deep/ .el-form-item.baseInfo {
  width: calc(100% - 64px);
  margin: 18px 32px 10px;
  padding-left: 16px;
  background: rgba(245, 246, 250, 1);
}

/deep/ .el-form-item.baseInfo .el-form-item__label {
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 42px;
  color: rgba(44, 49, 60, 1);
}

/deep/ .el-popper[x-placement^="bottom"] {
  margin-top: 3px !important;
}

/deep/ .el-popper[x-placement^="bottom"] {
  margin-top: 3px !important;
  top: 200px !important;
}

.el-form-item_unit {
  position: relative;
}

.el-form-item_unit span {
  position: absolute;
  left: 212px;
  color: #666666;
  top: 0;
}

/*上传图片*/
/deep/ .el-upload--picture-card {
  width: 110px;
  height: 110px;
  position: relative;
  top: 10px;
}

/deep/ .el-upload--picture-card i {
  position: relative;
  top: -15px;
}

/deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 110px;
  height: 110px;
  position: relative;
  top: 9px;
  left: 0;
}

.upload_img_wrap {
  width: 120px;
  height: 125px;
  overflow: hidden;
}
/*资源改版*/
/deep/ .el-scrollbar__wrap {
  display: none;
}
/deep/ .el-form-item__label {
  position: relative;
  float: none;
  line-height: 32px;
  color: rgba(0, 0, 0, 0.85);
}
/deep/ .el-form-item__content {
  margin-left: 0 !important;
}
/deep/ .el-tabs__item {
  width: 80px;
  font-size: 16px;
  text-align: center;
}
/deep/ .el-dialog {
  width: 670px;
}
/deep/ .el-dialog__header {
  text-align: center;
}
/deep/ .el-carousel__item {
  text-align: center;
}
/deep/ .map_dialog .el-dialog__header {
  text-align: left;
}
/deep/ .map_dialog .el-dialog__body {
  padding: 10px 20px;
}

/deep/ .el-textarea__inner {
  height: 78px !important;
  resize: none;
  position: relative;
  top: 3px;
}

/deep/ .el-textarea .el-textarea__inner::-webkit-scrollbar {
  width: 6px;
  background: #fafafa;
}

/deep/ .el-textarea .el-textarea__inner::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c1c1c1;
  border-radius: 4px;
}

/deep/ .el-cascader {
  line-height: 40px;
}

/deep/ .el-tabs__nav {
  height: 52px;
  line-height: 52px;
}

/deep/ .el-input-number .el-input__inner {
  text-align: left !important;
}
</style>
