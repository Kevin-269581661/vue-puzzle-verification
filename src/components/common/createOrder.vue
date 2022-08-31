<template>
  <div class="ad_mediaMana_wrap createPlan">
    <div class="ad_mediaMana_nav clearfix">
      <p><a href="#">非系统全国单</a><em> / </em><a href="#">创建订单</a></p>
    </div>
    <div class="mediaMana_content_top">
      <div class="content_top_wrap">
        <!--填写客户信息-->
        <div class="step1" v-if="active == 0">
          <div class="createPlan">
            <el-form
              :model="planForm"
              status-icon
              :rules="planRules"
              ref="planForm"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="订单名称：" prop="planName">
                <el-input
                  v-model="planForm.planName"
                  placeholder="请输入订单名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="所属销售：" prop="ownerSales">
                <el-select
                  v-model="planForm.ownerSales"
                  filterable
                  remote
                  clearable
                  placeholder="请输入关键词"
                  :remote-method="querySearchAsync"
                  :loading="salerListLoading"
                  :highlight-first-item="true"
                  @change="changeSaler"
                >
                  <el-option
                    v-for="item in salerList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="公司名称：" prop="companyName">
                <el-select
                  v-model="planForm.companyName"
                  @change="GetBrandByCid"
                  placeholder="请选择公司名称"
                  filterable
                >
                  <el-option
                    v-for="item in companyName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="公司品牌：" prop="companyBrand">
                <el-select
                  v-model="planForm.companyBrand"
                  placeholder="请选择公司品牌"
                  filterable
                >
                  <el-option
                    v-for="item in companyBrand"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系人：" prop="adcID">
                <el-select
                  v-model="planForm.adcID"
                  placeholder="请选择所属联系人"
                  filterable
                >
                  <el-option
                    v-for="item in adcID"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item
                label="投放城市："
                prop="throwCity"
                ref="planThrowCity"
              >
                <el-select
                  v-model="planForm.throwCity"
                  size="small"
                  filterable
                  multiple
                  placeholder="请选择"
                  @remove-tag="removeCity"
                >
                  <el-option
                    v-for="item in throwCity"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item> -->
              <!-- <el-form-item
                v-if="BDData.uType == 'ADN_BD_KA'"
                label="投放公司："
                prop="pointOfAsrIDs"
                ref="planPointOfAsrIDs"
              >
                <el-select
                  v-model="planForm.pointOfAsrIDs"
                  size="small"
                  filterable
                  multiple
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in pointOfAsrIDs"
                    :key="item.asrID * 1"
                    :label="item.asName"
                    :value="item.asrID * 1"
                  >
                  </el-option>
                </el-select>
              </el-form-item> -->
              <!-- <el-form-item
                label="订单金额："
                prop="customerBudget"
                ref="customerBudgetRef"
              >
                <el-input
                  v-model="planForm.customerBudget"
                  placeholder="请输入订单金额"
                >
                </el-input>
                <i class="unit">元</i>
              </el-form-item> -->
              <!-- <el-form-item
                v-if="isBD"
                label="客户要求："
                prop="customerDemand"
                ref="customerDemandRef"
              >
                <el-input
                  v-model="planForm.customerDemand"
                  type="textarea"
                  placeholder="如客户对意向小区的要求等"
                  autosize
                  resize="none"
                ></el-input>
              </el-form-item> -->
            </el-form>
          </div>
        </div>
        <div class="step4" v-if="active == 2">
          <div class="createSuccess">
            <div class="successIcon">
              <img src="../../assets/images/createSuccess.png" alt="" />
              <!--<i class="fa fa-check-circle fa-4x" style="color:#67C23A;"></i>-->
              <h2>创建成功</h2>
              <p>创建时间：{{ dateTime }}</p>
            </div>
            <div class="planPanel noShareUl">
              <ul>
                <li><em>订单名称：</em>{{ planForm.planName }}</li>
                <li><em>所属客户：</em>{{ cName || cacheCName || '--' }}</li>
                <li><em>所属品牌：</em>{{ cBand || cacheBTitle || '--' }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content_bottom_btn">
      <el-button plain @click="prev" v-if="active == 1" type="default"
        >上一步
      </el-button>
      <el-button plain @click="clearData" v-if="active === 0" type="default"
        >取消
      </el-button>

      <el-button @click="next" v-if="active == 0" type="primary">
        下一步
      </el-button>
      <div class="finishBtn" v-if="active == 2">
        <el-button @click="downLoadFanan()" type="default" class="urlBtn"
          >导出订单</el-button
        >
        <el-button type="primary" @click="toDetail">
          查看订单
        </el-button>
      </div>
    </div>
    <!--添加商品到购物车的动画效果-->
    <div class="shopAnimate" v-show="shoppingShow">
      <img src="../../assets/images/select.png" alt="" />
    </div>
    <div class="shopAnimateAll" v-show="selectAll">
      <img src="../../assets/images/allselect.png" alt="" />
    </div>
    <!-- 导入表格组件 -->
    <Create-Order-By-Import
      ref="createOrderByImport"
      :isDialogImport.sync="isDialogImport"
      @skipAndAddShopping="handleSkipAndAdd"
      @submitBtn="submitUpload"
      :importInfoData="importInfoData"
      :importAction="doUpload"
    ></Create-Order-By-Import>
  </div>
</template>

<script>
import api from "../../api/api";
import areaArr from "../../commonFun/areaPackage_new";
import sessFun from "../../commonFun/sessFun.js";
// 筛选过滤
import sheetExcel from "../../commonFun/sheetExcel.js";
// 订单导入结果
import importResult from "./components/importResult.vue";
//导入表格
import CreateOrderByImport from "./components/createOrderByImport";
//购物车页面
import shoppingCart from "./components/shoppingCart";

export default {
  name: "createOrder",
  components: {
    importResult,
    CreateOrderByImport,
    shoppingCart,
  },
  data () {
    //客户预算自定义校验
    /* let validateBudget = (rule, value, callback) => {
      if (value) {
        // 数字/货币金额 (只支持正数、不支持校验千分位分隔符)
        // let reg = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/;
        let reg = /^\d{1,}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正整数"));
        } else {
          if (value > 9999999) {
            callback(new Error("预算不能大于9,999,999"));
          } else {
            callback();
          }
        }
      } else {
        callback();
        // this.$refs["customerBudgetRef"].clearValidate()
      }
    }; */
    let validateSales = (rule, value, callback) => {
      if (value) {
        if (this.BDData.uid === "0") {
          callback(new Error("请输入正确的账号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validateName = (rule, value, callback) => {
      if (value) {
        if (value.match(/\s/)) {
          callback(new Error("订单名称不能带有空格"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let validateNum = (rule, value, callback) => {
      let reg = /^[0-9]+$/;
      if (!reg.test(value)) {
        callback(new Error("只能输入整数值"));
      } else {
        if (value < 1) {
          callback(new Error("点位数不能为0"));
        } else {
          callback();
        }
      }
    };
    let validateCale = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value !== "" && !reg.test(value)) {
        callback(new Error("只能输入数字"));
      } else {
        if (value < 0 || value > 100) {
          callback(new Error("只能输入数字(0-100)"));
        } else {
          callback();
        }
      }
    };
    return {
      //继续编辑cName
      cacheCName: "",
      cacheBTitle: "",
      //继续编辑bTitle
      //导入草稿箱子的数据
      importDraftsList: [],
      importDraftsType: "",
      importDraftsConfig: {},
      //搜索旁投放面数
      planAdsCnt: 1,
      isDialogImport: false,
      handleTime: "", //上传时间
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() <= Date.now();
        }
      },
      doUpload: "/national/api/v1/nationalAdPlan/importNationalAdPlanExcel",
      active: 0, // 当前步骤step
      mapADDialog: false,
      loading: true, //加载中
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      selectedOptions: [],
      cityOptions: [],
      mediaType: "广告门", // 媒体类型 广告门、道闸
      shopXY: { x: "", y: "" }, // 动画起始坐标
      shoppingShow: false, //动画效果的显示隐藏
      selectAll: false, // 是否全选
      bodyWidth: 1920,
      city: [], // step2 城市
      area: [], // step2城市下属区域
      activeIndex: 0, //step2当前选中的城市下标
      activeRName: "", //step2当前选中的城市名称
      areaName: "全市", // step2当前选中的区域
      areaRid: "", // step2当前选中的区域rid
      totalPrice: 0, //总价
      remark: "无", //备注
      cash: 0, // 现金结算
      zyzh: 0, // 资源置换
      other: 0, // 其他费用
      customer: [], // step1公司客户
      companyName: [], //step1公司名称
      cName: "", // 选中公司名称
      companyBrand: [], //step1公司品牌
      cBand: "", // 选中的品牌
      adcID: [], //step1联系人
      //step1投放城市
      // throwCity: [],
      //购物车
      dialogTableVisible: false,
      //选中
      checkAB: true,
      //搜索类型
      typeSelect: [
        {
          value: "资源名称",
          label: "资源名称",
        },
        {
          value: "商圈",
          label: "商圈",
        }
      ],
      //默认
      selectValue: "资源名称",
      //楼盘类型
      buildType: [
        { buildlabel: "住宅", buildValue: "住宅" },
        { buildlabel: "写字楼", buildValue: "写字楼" },
        { buildlabel: "别墅", buildValue: "别墅" },
        { buildlabel: "商住楼", buildValue: "商住楼" },
        { buildlabel: "公共场所", buildValue: "公共场所" },
      ],
      village: [
        // 社区
        { buildlabel: "高端住宅", buildValue: "高端住宅" },
        { buildlabel: "普通住宅", buildValue: "普通住宅" },
        { buildlabel: "单体楼", buildValue: "单体楼" },
        { buildlabel: "别墅", buildValue: "别墅" },
        { buildlabel: "洋房", buildValue: "洋房" },
        { buildlabel: "商住或商用", buildValue: "商住或商用" },
        { buildlabel: "公共场所", buildValue: "公共场所" },
      ],
      officeBuilding: [
        // 写字楼类型
        { buildValue: "单纯性写字楼", buildlabel: "单纯性写字楼" },
        { buildValue: "商住型写字楼", buildlabel: "商住型写字楼" },
        { buildValue: "综合型写字楼", buildlabel: "综合型写字楼" },
        { buildValue: "工业园区", buildlabel: "工业园区" },
      ],
      buildValue: "",
      //搜索框
      searchInput: "",
      planSelect: "",
      mState: "", // 媒体状态
      activeGrade: "", // 媒体等级
      dateInput: [], // 时间输入框
      beforeDate: [], // 时间输入框的前一次时间
      //setp1创建订单表单
      planForm: {
        planName: "",
        ownerSales: "", // 所属销售
        companyName: "",
        companyBrand: "",
        // throwCity: [],
        adcID: "", // 所属联系人
        planRemark: "",
        // pointOfAsrIDs: [], // 点位所属公司id组合，根据城市联动
        // customerBudget: 0,
        customerDemand: "",
      },
      // pointOfAsrIDs: [],
      // 媒介选择所属销售列表
      salerList: [],
      // 获取销售选项loading
      salerListLoading: false,
      //
      industryID: "", // 所选公司所在的行业
      planRules: {
        planName: [
          { validator: validateName, trigger: "blur" },
          {
            required: true,
            type: "string",
            message: "订单名称不能为空",
            trigger: "blur",
          },
          { max: 30, message: "最多只能输入30个字节", trigger: "blur" },
        ],
        adcID: [{ required: true, message: "请选择联系人", trigger: "change" }],
        ownerSales: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { validator: validateSales, trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "请选择公司名称", trigger: "change" },
        ],
        companyBrand: [
          { required: true, message: "请选择公司品牌", trigger: "change" },
        ],
        /* throwCity: [
          {
            required: true,
            message: "请选择投放城市(可多选)",
            trigger: "change",
          },
        ], */
        /* pointOfAsrIDs: [
          {
            required: true,
            message: "请选择归属公司(可多选)",
            trigger: "blur",
          },
        ], */
        //客户预算
        // customerBudget: [{ validator: validateBudget, trigger: "blur" }],
        //客户要求
        customerDemand: [
          // {validator: validateRequst, trigger: 'blur'},
          { max: 200, message: "字数不能超过200字", trigger: "blur" },
        ],
      },
      shopingList: [], // step2购物车列表
      // 购物车展示的数据
      activeName: 1,
      // 事件选择
      eventType: "",
      eventList: [],
      // 购物车表格数据
      shopShowList: [],
      planList: [], //step2可选点位列表
      IsAll: false, //当前是否为全选状态
      sessionData: "", // 登录用户的数据
      FAData: { apID: "" }, // 创建方后台返回的数据
      timeout: null,
      BDData: { uid: "0", realName: "", uType: "" },
      HSearch: "", // 获取传值显示‘清除’、‘确定’按钮
      houseNum: ["", ""], // 表头搜索住户数量
      buildNum: ["", ""], // 表头搜索楼栋数量
      buildPrice: ["", ""], // 表头搜索楼盘价格
      liveYear: ["", ""], // 表头搜索入住年份
      peopleFlow: ["", ""], // 表头搜索人流量
      carFlow: ["", ""], // 表头搜索车位数
      parkSpaceNum: ["", ""], // 表头搜索车流量
      filterData: {
        // 记录判断含有哪些表头的过滤条件
        hNum: false,
        bNum: false,
        bPrice: false,
        lYear: false,
        pFlow: false,
        cFlow: false,
        pSNum: false,
      },
      loadSign: true, // table滚轮
      shopMedia_ADNum: {
        total: 0,
        oneNum: 0,
        twoNum: 0,
        threeNum: 0,
        moreNum: 0,
      },
      ADloading: "", // 创建订单、提交选点和报价单时的loading
      areaCity: [],
      activeCityData: {}, // 城市切换的数据，默认为this.city[0]
      loadScroll: true, // 搜索后不执行滚动加载
      dateTime: "", // 获取今天日期
      ADLimit: [
        // step2 广告限制
        { value: "地产", label: "地产" },
      ],
      limitName: "全部", // 当前广告限制高亮，默认为全部
      limitList: [], // 当前选择的广告限制
      filterCondition: [], // 当前过滤条件
      commentMediaADNum: [], // 统计同一城市相同因不同排期而选择相同的asid
      mapADList: [], // 地图选择的点位数据
      mapParams: {}, // 记录当前地图选点时的参数，包括排期、城市名和rid
      mapBtn: true, // 获取地图选点数据的按钮，默认不可点击
      getMapLoading: "", // 获取地图选点时的loading
      // 是否导入订单
      isImport: false,
      importType: "",
      isShowTag: true,
      // 当前上传文件的数据- 表格
      fileData: [],
      // 导入excel部分失败弹出框
      showUploadFail: false,
      // 导入excel之后返回的失败成功点数
      excelObj: {
        successNum: 0,
        failNum: 0,
      },
      // excel导入返回来的数据
      importInfoData: {},
      // 导入excel之后返回的数组
      excelDataUpload: [],
      // 复制订单
      isCopy: false,
      // 搜索订单时的loading
      loadingOrder: false,
      // 搜索订单名称
      orderName: "",
      // 返回的订单列表
      orderArr: [],
      apAicode: "", // 订单的协同aicode
      shareADUrl: "", // 协同选点的url https://beta.qinlinad.com/shareADList?apid=649&aicode=0DDD2685D9D3842ECB0DDC45D79D2131

      isOccupied: true, // 被占搜索时隐藏过滤条件
      pageNum: 1, // 页码
      totalPage: 1, // 总页数
      pageSize: 20, //每页条数
      getAdsParamsData: {}, //　获取点位列表的参数data
      apMinTime: "", // 订单创建的开始时间
      ADLimitActiveName: "1",
      isShowAll: false, // 控制表头显示时的过渡效果
      searchBtnAbled: false, // 搜索按钮禁止
      isCityPrice: false, // 判断城市最大价格是否大于2000w
      connectAdDialogVisible: false, // 连排门模态框
      mediaLevelNum: { ALevel: 0, BLevel: 0, CLevel: 0, ANum: 0, BNum: 0 },
      asrIDList: [], // 已选点位里存在的公司及城市
      unfinishedData: "", // 未完成订单信息
      /*订单排斥*/
      activeSelect: "1", //
      rejectAdPlan: [], // 排斥订单选项
      activeAdPlan: "", // 当前选择的订单
      routePath: "",
      // 订单是否创建中，防多次点击创建-节流
      creating: false,
      // 记录两个时间判断是窗口关闭还是刷新
      _beforeUnload_time: 0,
      _gap_time: 0,
      ActiveMapType: 2,
      // 亲邻地图
      mapAdsList: [],
      currPageAsLength: 0, //当前页面可选的点位总数
      currPageSelect: 0, //当前页面已选择的点位数
      total: 0, //总可选点位
      // 定制权限
      customPermission: {},
    };
  },
  mounted () {
    this.getsessionData(); // 获取session中的数据
    this.areaCity = areaArr.cityArea();
    this.getADLimit(); // 获取广告限制列表
    // 获取未完成的订单并填充
    this.routePath = this.$route.fullPath;
  },
  watch: {
    /* "planForm.throwCity": {
      handler: function () {
        this.planForm.pointOfAsrIDs = [];
        this.pointOfAsrIDs = [];
        if (this.planForm.throwCity.length == 0) return;
        this.getPointOfAsr();
      },
    }, */
  },
  computed: {
  },
  methods: {
    //导入表格，点击确定放入购物车后的处理函数
    handleSkipAndAdd (successList) {
      this.isImport = false;
      this.handleImportDrafts(1, successList, 'pullAll');
      sessFun.messageFun("success", "成功导入" + successList.length + "条数据");
    },
    // 获取浏览器session数据
    getsessionData () {
      this.sessionData = sessFun.getSess();
      this.customPermission = this.sessionData.customPermission;
    },
    // 获取权限下的城市列表
    getCityList () {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        suID: this.BDData.uid
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetFanganCity", params)
        .then((res) => {
          if (
            res.data.SysCode === 100200 ||
            res.data.MSG === "该用户暂未分配公司！"
          ) {
            sessFun.messageFun("warning", res.data.MSG);
          } else {
            if (res.data !== "" && res.data !== null) {
              let resData = res.data;
              let cityList = [];
              for (let j = 0; j < resData.length; j++) {
                let cityObj = {
                  label: resData[j].rName,
                  value: resData[j].rID.toString(),
                };
                cityList.push(cityObj);
              }
              // this.throwCity = cityList;
              this.cityOptions = areaArr.province();
            } else {
              sessFun.messageFun("warning", "城市数据获取异常");
            }
          }
        });
    },
    // 获取所选权限城市下的点位所属公司
    /* getPointOfAsr () {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        suID: this.BDData.uid,
        cityIds: this.planForm.throwCity.join(","),
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetCityAscrList", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            this.pointOfAsrIDs = res.data.data;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    }, */
    // 下一步
    // TODO:下一步创建订单
    next () {
      if (this.active === 0) {
        console.log("planForm--", this.planForm);
        this.submitForm("planForm");

      } else if (this.active === 1) {
        // // 防多次点击创建
        if (!this.creating) {
          this.creating = true;
          let timer = setTimeout(() => {
            this.creating = false;
            this.ADloading = this.$loading({
              lock: true,
              text: "加急创建中...",
              spinner: "el-icon-loading",
              background: "rgba(0, 0, 0, 0.7)",
            });
            this.getBand(); // 获取公司品牌
            this.creatAdPlan(); // 创建订单
            clearTimeout(timer);
          }, 500);
        }
      }
      if (this.active > 2) {
        this.active = 0;
      }
    },
    // 上一步
    prev () {
      if (this.active < 1) {
        this.active = 0;
      } else {
        this.active--;
      }
    },
    // 第一步的取消按钮
    clearData () {
      this.$router.push("./countryOrderList");
    },
    // 获取城市中文名称
    /* getCityName (rid) {
      let str = "";
      for (let data of this.throwCity) {
        if (data.value == rid) {
          str = data.label;
          break;
        }
      }
      return str;
    }, */
    // 自定义上传
    uploadFile (params) {
      this.fileData = [];
      console.log(params);
      let fileObj = params.file;
      this.fileData.push(fileObj);
    },
    // 文件删除
    fileRemove (file, fileList) {
      console.log(file, fileList);
      this.fileData = fileList;
    },
    // 导入模版下载
    dowmLoadFun (event) {
      // 阻止冒泡事件
      event.stopPropagation();
    },
    hideTag () {
      this.isShowTag = false;
    },

    // 确认上传
    submitUpload (importFileData) {
      if (importFileData.length) {
        let formData = new FormData();
        formData.append("apName", this.planForm.planName);
        formData.append("adcID", this.planForm.adcID);
        formData.append("bID", this.planForm.companyBrand);
        // formData.append("companyIds", this.planForm.pointOfAsrIDs);
        // formData.append("price", this.planForm.customerBudget || 0);
        formData.append("suID", this.BDData.uid);
        formData.append("file", importFileData[0].raw);
        this.resImport(formData);
        // console.log('planForm.ownerSales', this.planForm.ownerSales);
      } else {
        sessFun.messageFun("warning", "请先上传文件");
      }
    },
    // 小区导入
    resImport (formData) {
      let Loading = this.$loading({
        lock: true,
        text: "快马加鞭选点中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      api
        .postApi_new(this.doUpload, formData)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            const importInfo = res.data.data;
            console.log("importInfo: ", importInfo);
            if(Array.isArray(importInfo.errorList) && importInfo.errorList.length) {
              this.importInfoData = importInfo;
              this.$refs.createOrderByImport.dialogErrorPoint = true;
            } else {
              sessFun.messageFun("success", `导入${importInfo.successSize || '--'}个点位并成功创建订单！`);
              this.$router.push('./countryOrderList')
            }
            // this.importSuccessList = importInfo.successList;
            // this.importErrorList = importInfo.errorList;
            // this.showUploadFail = true;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          Loading.close();
        })
        .catch((res) => {
          console.log(res);
          Loading.close();
        });
    },
    // 取消导入
    cancelImport () {
      this.showUploadFail = false;
      this.isImport = false;
    },
    // 确定导入
    confirmImport (arr) {
      this.showUploadFail = false;
      console.log("import----data---", arr);
      for (let info of arr) {
        if (info.mVehicle == "广告门") {
          this.isHaveDiffPush(info);
        } else if (info.mVehicle == "道闸") {
          this.isHaveDiffPush(info);
        }
      }
      this.isImport = false;
      this.judgeByselect();
      this.dialogVisible();
      console.log("inport----data----shoplist", this.shopingList);
    },
    async downLoadFanan () {
      let { data } = await this.getPreExcelData();
      console.log("datadatadatadatadata: ", data);
      let arr = this.excelData(data.data);
      let allHead = [
        "省份",
        "城市",
        "区域",
        "资源名称",
        "商圈",
        "地址",
        "媒介载体",
        "楼栋数量",
        "住户数量",
        "楼盘价格",
        "楼盘类型",
        "地图中心点",
        "入住年份",
        "车位数",
        "车流量",
        "人流量",
        "广告限制",
        "媒体数量（门）",
        "可投数量(面)",
        "计划投放数量(面)"
      ];

      let customPermission = JSON.parse(
        sessionStorage.getItem("session_data")
      )

      if (
        (customPermission.uType == "ADN_MD_COUNTRY") ||
        (customPermission.uType == "ADN_BD_KA")
      ) {
        allHead.push("归属公司");
      }

      sheetExcel.toDownload(
        allHead,
        arr,
        this.planForm.planName
        // head
      );
    },
    // 处理数据
    excelData (arr) {
      console.log("arrr------excelData", arr);
      let customPermission = JSON.parse(
        sessionStorage.getItem("session_data")
      )
      let dateArr = [];
      let arr2 = [];
      //将得到的数据除去不需要的
      for (let item of arr) {
        let obj = {
          provinceName: item.provinceName,
          cityName: item.cityName,
          districtName: item.districtName,
          resName: item.resName,
          tradingArea: item.tradingArea,
          resAddress: item.resAddress,
          mVehicle: item.mVehicle,
          fNum: item.fNum,
          hNum: item.hNum,
          hPrice: item.hPrice,
          cType: item.cType,
          map: item.mapCenterName || '',
          chDay: item.chDay,
          parkSpaceNum: item.parkSpaceNum,
          carFlow: item.carFlow,
          peopleFlow: item.peopleFlow,
          notPush: item.notPush,
          actualMediaCnt: item.actualMediaCnt,
          actualAdsCnt: item.actualAdsCnt || '',
          planAdsCnt: item.planAdsCnt
        };

        if (
          (customPermission.uType == "ADN_MD_COUNTRY") ||
          (customPermission.uType == "ADN_BD_KA")
        ) {
          obj.asName = item.asName;
        }

        arr2.push(obj);
      }
      let obj = {
        sheetName: "小区列表",
        showList: arr2,
      };
      dateArr.push(obj);
      return dateArr;
    },
    // 移除城市
    /* removeCity (val) {
      console.log("移除城市val", val, this.planForm.throwCity);
    }, */
    // 选择所属销售
    changeSaler (val) {
      console.log("选择所属销售", val);
      // 重新输入账号时，初始化部分数据
      this.planForm.companyName = "";
      this.planForm.companyBrand = "";
      this.planForm.adcID = "";
      // this.planForm.throwCity = [];
      this.dynamicTags = [];
      // this.throwCity = [];
      this.$refs["planForm"].clearValidate();
      if (val) {
        for (let key of this.salerList) {
          if (key.value == val) {
            this.planForm.realNamesName = key.label;
            this.BDData.uType = key.uType;
            break;
          }
        }
        this.BDData.uid = val;
        // console.log('----',this.planForm.realNamesName)
        this.getCityList();
        this.Get_cName();
      } else {
      }
    },
    // 登录用户为媒介输入销售用户名去获取该销售的信息以便获取接下来的城市、公司、品牌、投放城市等信息
    querySearchAsync (query) {
      if (query !== "") {
        this.salerListLoading = true;
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          kaFlag: true,
          keyword: query,
        };
        api
          .postApi(this.apiVar.UCAPI + "/findBDUserByKeyword", params)
          .then((res) => {
            if (res.data.SysCode === 200200) {
              let arr = [];
              for (let key of res.data.data) {
                arr.push({
                  label: key.realName + "(" + key.sName + ")",
                  value: key.uID,
                  uType: key.uType,
                });
              }
              this.salerList = arr;
            } else {
              this.salerList = [];
            }
            this.salerListLoading = false;
          });
      } else {
        this.salerList = [];
        this.salerListLoading = false;
      }
    },
    Get_cName () {
      let params = {
        uid: this.BDData.uid,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.Advertisement + "/MyCustomer", params)
        .then((res) => {
          console.log("MyCustomer:", res.data);
          let customerList = res.data;
          this.customer = res.data; //保存所有信息，方便后面的过滤使用
          let companyList = []; // 公司名称
          let ownerList = []; // 联系人
          for (let i = 0; i < customerList.length; i++) {
            // console.log('公司名称',i,customerList[i].cName)
            let companyObj = {
              label: customerList[i].cName,
              value: customerList[i].cID,
            };
            let owner = {
              label: customerList[i].realName,
              value: customerList[i].uID,
            };
            ownerList.push(owner);
            if (i == 0) {
              companyList.push(companyObj);
            } else if (
              JSON.stringify(companyList).indexOf(
                JSON.stringify(companyObj)
              ) === -1
            ) {
              //判断是否有重复的公司JSON.stringify(companyObj)
              companyList.push(companyObj);
            }
          }
          this.companyName = companyList; // 公司名称列表
          this.adcID = ownerList; // 联系人列表
        });
    },
    // 获取公司品牌
    GetBrandByCid (val) {
      this.planForm.companyBrand = "";
      this.planForm.adcID = "";
      console.log("所选公司的ID", val);
      let cidParams = {
        cid: val,
        token: this.sessionData.token,
      };
      api
        .getApi(this.apiVar.Advertisement + "/GetBrand", cidParams)
        .then((res) => {
          console.log("公司品牌", res.data);
          if (res.data.SysCode === 200200) {
            let CBrand = res.data.data;
            let BrandList = [];
            for (let key of CBrand) {
              BrandList.push({
                label: key.bTitle,
                value: key.bID,
              });
            }
            this.companyBrand = BrandList;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
      // 选择公司后过滤联系人列表customer
      let customerList = this.customer;
      let ownerList = []; // 联系人
      for (let j = 0; j < customerList.length; j++) {
        if (customerList[j].cID == val) {
          let owner = {
            label: customerList[j].realName,
            value: customerList[j].uID,
          };
          ownerList.push(owner);
        }
      }
      this.adcID = ownerList;
    },
    // 获取公司及品牌
    getBand () {
      for (let n = 0; n < this.companyName.length; n++) {
        if (this.companyName[n].value === this.planForm.companyName) {
          this.cName = this.companyName[n].label;
        }
      }
      for (let n = 0; n < this.companyBrand.length; n++) {
        if (this.companyBrand[n].value === this.planForm.companyBrand) {
          this.cBand = this.companyBrand[n].label;
        }
      }
    },
    // 表单验证
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isDialogImport = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /*step2*/
    // 获取排斥订单选择列
    getRejectPlanList () {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        sales_user: this.BDData.uid,
      };
      api
        .getApi(this.apiVar.Advertisement + "/getSalesProject", params)
        .then((res) => {
          console.log("销售所属订单", res);
          if (res.data.SysCode == 200200) {
            let resData = res.data.data;
            let tempList = [];
            for (let key of resData) {
              tempList.push({
                value: key.apId,
                label: key.apName + "--" + key.cname + "--" + key.apcTime,
              });
            }
            this.rejectAdPlan = tempList;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    },
    // step2 获取广告限制列表
    getADLimit () {
      this.ADLimit = [];
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetNotPush",
        data: {},
      };
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        console.log("广告限制列表", res);
        if (res.data.SysCode === 200200) {
          let limit = res.data.data;
          let limitArr = [];
          for (let i = 0; i < limit.length; i++) {
            let limitObj = { value: limit[i].nTitle, label: limit[i].nTitle };
            limitArr.push(limitObj);
          }
          this.ADLimit = limitArr;
        }
      });
    },
    // 创建订单基本信息及投放城市详情(报价单数据提交)
    creatAdPlan () {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api.postApi(this.apiVar.CreatePlan, params).then((res) => {
        console.log("创建订单", res);
        if (res.data.SysCode == 200200) {
          sessionStorage.setItem("plan_apid", res.data.data.apID);
          this.FAData.apID = res.data.data.apID;
          if (res.data.dataerrorResNames) {
            this.ADloading.close();
            sessFun.messageFun("warning", "存在失败小区：" + res.data.dataerrorResNames || '');
            return;
          }
          this.active++;
          //清除草稿箱缓存
          this.clearDrafts();
          this.ADloading.close();
        } else {
          this.ADloading.close();
          sessFun.messageFun("warning", "订单创建失败：" + res.data.MSG);
        }
      });
    },
    // 查看详情
    toDetail () {
      this.$router.push('./planDetail');
    },
    // 订单异常时，存储当前订单基本数据及购物车点位等临时信息
    handleImportDrafts (type, list, pullAll = null) {
      this.importDraftsConfig.suID = this.BDData.uid;
      this.importDraftsConfig.type = type;
      if (![2, 3, 4].includes(type)) {
        this.importDraftsConfig.resList = JSON.stringify(list);
      }
      this.changeApInfo(pullAll);
    },
    changeApInfo (pullAll) {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        ...this.importDraftsConfig,
      };
      api.postApi(this.apiVar.CreateAdBackUp, params).then((res) => {
        console.log("res创建订单缓存", res);
        if (res.data.SysCode == 200200) {
          if (pullAll) {
            (res.data.data || []).forEach((item) => {
              item.checkBox = false;
              item.city = item.cityName;
            });
            this.shopingList = res.data.data || []
            if (this.getMapLoading) {
              this.getMapLoading.close();
            }
            this.dialogTableVisible = true;
            this.judgeByselect();
          }
          this.computeMedia_AD(); //统计购物车里选择小区的面数个数
        } else {
          sessFun.messageFun("warning", res.data.MSG);
        }
      });
    },
  },
  // 页面销毁
  destroyed () {
    if (this.active == 1 || this.active == 2) {
      console.log("页面销毁----");
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
      };
      api
        .postApi(this.apiVar.Advertisement + "/AddCreatePlanLog", params)
        .then((res) => {
          console.log("上报成功-----", res);
        })
        .catch((err) => {
          console.log("上报失败-----", err);
        });
    }
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-table__fixed,
/deep/ .el-table__fixed-right {
  height: 584px !important;
}

/deep/ .el-table__fixed-right {
  right: 6px !important;
}

/*/deep/ .el-table__fixed-right-patch{*/
/*right: 8px !important;*/
/*}*/
/deep/ .selectAdsTable .el-table__empty-text {
  left: 25%;
}

/deep/ .selectAdsTable .el-table_1_column_1 {
  text-align: center;
}

/deep/ .el-loading-mask {
  z-index: 990;
}

/deep/ .el-step__main {
  height: 20px;
}

.adsTable {
  position: relative;
  margin-top: 5px;
  .adDoor,
  .roadGate {
    display: flex;
    // justify-content: space-between;
    justify-content: center; // 内容自适应：上下居中
    align-items: center; // 子项对齐方式：左右居中
  }
}

.myCheckbox {
  position: absolute;
  width: 100px;
  height: 54px;
  text-align: center;
  line-height: 54px;
  top: 0;
  left: 0;
  z-index: 99;
}

.button_row {
  margin-top: 12px;
}

/deep/ .el-form--inline .el-form-item {
  margin-right: 7px !important;
}

.row-table-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

/*购物车提示信息*/
.warningInfoColor {
  display: inline-block;
  height: 16px;
  width: 16px;
  border-radius: 4px;
  vertical-align: middle;
}

.warningInfo .warningInfoName {
  color: #333;
  font-size: 12px;
}

/* 购物车表格分页 */
.cart-pagination /deep/ .el-input__inner {
  width: 100%;
}

/*状态行*/
/deep/ .el-table .warning-row {
  background: rgba(255, 0, 0, 0.08);
}

/deep/ .el-table .warning-row-conncet {
  background: rgba(255, 199, 0, 0.1);
}

.shopList_adLimit {
  width: 132px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .el-input__inner:hover {
  border-color: #dcdfe6;
}

/deep/ .el-select .el-input.is-focus .el-input__inner {
  border-color: #dcdfe6;
}

.inputNewTag /deep/ .el-input__inner {
  width: 140px !important;
}

.input-with-select /deep/ .el-input__inner {
  font-size: 14px;
  padding: 10px 10px;
  height: 34px;
  line-height: 14px;
}

/deep/ .el-input__inner {
  font-size: 14px;
  line-height: 14px;
  width: 300px;
  height: 34px;
}

.shopAnimate,
.shopAnimateAll {
  position: fixed;
  top: 574px;
  right: 170px;
  width: auto;
  height: auto;
  color: #fff;
  z-index: 1000;
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
  margin-bottom: 145px;
  position: relative;
}

.mediaMana_content_top {
  padding: 42px 60px 0 60px;
}

.content_top_wrap,
.content_bottom_wrap {
  background: #ffffff;
  border: 1px solid #dedede;
  padding: 32px 18px;
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
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #2c313c;
  font-weight: bold;
  padding-left: 16px;
  height: 24px;

  margin-top: 8px;
}

.content_top_wrap .content_top_form_wrap,
.content_bottom_wrap .content_bottom_form_wrap {
  padding: 18px;
}

/*按钮*/
.content_bottom_btn {
  width: 100%;
  position: absolute;
  bottom: -66px;
  // margin-bottom: 22px;
  text-align: center;
}

.content_bottom_btn button {
  width: 76px;
  height: 32px;
  outline: none;
  cursor: pointer;
  margin-left: 14px;
}

.content_bottom_btn button.create {
  background: #108ee9;
  border-radius: 4px;
  font-size: 14px;
  border: none;
  color: #ffffff;
}

.content_bottom_btn button.cancel {
  background: #ffffff;
  font-size: 14px;
  color: #666666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-left: 10px;
}

/*创建订单表单*/
/deep/ .el-form.demo-ruleForm {
  width: 416px;
  margin: 0 auto;
}

.el-input {
  width: 300px;
  border-radius: 4px;
}

/deep/ .el-textarea__inner {
  width: 260px;
  height: 80px;
  resize: vertical;
}
/deep/ textarea.el-textarea__inner {
  transform: translateY(4px);
  overflow-y: hidden;
  width: 300px;
}

/*选择点位*/
/deep/ .type-select .el-input,
/deep/ .type-select .el-input__inner {
  width: 95px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding-right: 0;
}

/deep/ .type-select .el-input__inner {
  padding-left: 10px;
  color: rgb(144, 147, 153);
}

/*订单排斥*/
/deep/ .reject_select {
  left: -6px;
}

/deep/ .reject_select .el-input,
/deep/ .reject_select .el-input__inner {
  width: 185px;
  border-top-left-radius: 0;
}

/deep/ .date-select.el-input__inner {
  width: 260px;
  position: relative;
}

/*日期*/
/*日期控件*/
.block {
  display: inline-block;
  margin-left: 2px;
  position: relative;
}

/deep/ .el-date-editor .el-range__icon {
  position: relative;
  line-height: 26px;
  /* top: -3px; */
  margin-right: 2px;
}

/deep/ .el-range-separator {
  position: relative;
  top: -2px;
}

.createPlan /deep/ .el-input__inner {
  // width: 300px;
  height: 32px;
  line-height: 32px;
}

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
  float: left;
  position: relative;
}

/deep/ .el-range-editor .el-range-input {
  line-height: 20px;
}

/deep/ .el-dialog__header {
  font-weight: 700;
}

/*step2 四个按钮*/
.importXle.el-button--success {
  background: #51e171;
  border-color: #51e171;
}

/deep/ .map.el-button--primary {
  background: #ff8f49;
  border-color: #ff8f49;
}

/*下拉搜索框*/
/deep/ .el-input-group__prepend {
  width: 64px;
  background-color: #fff;
}

/deep/ .el-input-group--prepend .el-select .el-input__inner {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  width: 104px;
}

/deep/ .el-input-group--prepend .el-input__inner {
  width: 185px;
}

.content_bottom_btn /deep/ .el-button span a {
  color: #606266;
}

.search-wrap {
  position: relative;
  /*清除浮动*/
  overflow: hidden;
}

.search-wrap > div {
  float: left;
  margin-right: 7px;
  /*margin-bottom: 18px;*/
}

/*购物车图标*/
.shopcar {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  position: fixed;
  right: 29px;
  top: 75px;
  z-index: 998;
}

/deep/ .shopcar .el-badge__content.is-fixed {
  position: absolute;
  top: 10px;
  right: 25px;
}

.shopcar img {
  width: 59px;
  height: 59px;
  border-radius: 50%;
}

/*面板*/
.dw-panel {
  border: 1px solid #d8d8d8;
  /*margin-top: 30px;*/
  margin-top: 18px;
  padding: 0 18px 0 18px;
}

.dw-panel dl {
  border-bottom: 1px dashed #d8d8d8;
  line-height: 40px;
}

.dw-panel dt {
  display: inline-block;
  font-size: 14px;
  color: #999999;
  height: 40px;
}

.dw-panel .city-proper {
  padding-left: 75px;
  line-height: 34px;
}

.dw-panel dd {
  font-size: 14px;
  color: #666666;
  display: inline-block;
  line-height: 22px;
  padding: 3px 10px;
  cursor: pointer;
  margin-left: 6px;
}

.dw-panel dd.active {
  color: #1890ff;
  border: 1px solid #1890ff;
}

.dw-panel .other-dd {
  padding-left: 0px;
}

.otherSelect {
  /deep/ .el-input__inner {
    max-width: 135px;
    height: 30px;
    padding-left: 10px;
    color: #1890ff;
    border-radius: 0;
    overflow: hidden;
  }
  /deep/ .el-select__tags-text {
    display: inline-block;
    max-width: 30px;
    overflow: hidden;
    // text-overflow: ellipsis;
  }
  /deep/ .el-tag__close.el-icon-close {
    right: -5px;
    top: -5px;
  }
}

.adLimitSelect /deep/ .el-select__tags > span {
  width: 68px;
  height: 28px;
  overflow: hidden;
}

.otherSelect /deep/ .el-tag {
  background: #fff;
  color: #1890ff;
}

.otherSelect /deep/ .el-input__inner:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.otherSelectActive /deep/ .el-input__inner {
  border-color: #1890ff;
}

.otherSelectActive /deep/ .el-input .el-select__caret {
  color: #1890ff;
}

.otherBtn.el-button {
  border-radius: 0;
  color: rgba(0, 0, 0, 0.35);
}

.otherBtn.el-button:hover {
  border-color: #1890ff;
}

.otherBtnActive.el-button {
  border-color: #1890ff;
  color: #1890ff;
}

.input-wrap {
  text-align: center;
}

.input-wrap .input {
  width: 66px;
  height: 26px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(194, 194, 194, 1);
}

.input-wrap .input-wrap-Btn {
  width: 44px;
  min-width: 72px;
  height: 22px;
  margin-top: 6px;
  padding: 0;
  font-size: 12px;
  text-align: center;
  line-height: 22px;
  border-radius: 0;
}

/*筛选条件*/
.filter-condition {
  width: 100%;
  height: 36px;
  line-height: 36px;
  margin: 5px 0 0;
  background: rgb(241, 241, 241);
}

.filter-condition /deep/ .el-tag {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.35);
  margin-left: 10px;
}

.filter-condition /deep/ .el-tag:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.filter-condition /deep/ .el-tag:hover .el-tag__close.el-icon-close {
  color: #1890ff;
}

/* /deep/ .el-tag__close.el-icon-close:hover {
  background: #fff;
} */

/*表格*/
/deep/ .el-table th,
.el-table tr {
  background: #f7f7f7;
  padding: 10px 0;
}

/deep/ .el-table th > .cell {
  color: #666666;
  line-height: 14px;
  font-weight: bold;
}

/deep/ .el-table-column-checkbox .el-checkbox {
  margin-right: 0;
}

// /deep/ .el-table__expanded-cell[class*="cell"] {
//   padding: 0 86px;
//   background-color: #f7f7f7;
// }

// /deep/ .el-table__expanded-cell[class*="cell"] .el-form {
//   height: 44px;
//   line-height: 44px;
// }

// /deep/ .el-form-item__content {
//   line-height: 46px;
// }

/deep/ .el-form-item__label {
  padding: 0 0 0 12px;
}

/deep/ .selectAdsTable .el-table__body-wrapper {
  overflow-x: auto !important;
}

/deep/ .selectAdsTable .el-checkbox__label {
  padding-left: 4px;
}

/deep/ .car-list .el-table__body-wrapper {
  min-height: 382px;
  max-height: 402px;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
  height: 100%;
  overflow-y: auto;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background: #fafafa;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c1c1c1;
  border-radius: 4px;
}

/deep/ .el-form--inline .el-form-item {
  margin-right: 45px;
}

/deep/ .el-dialog {
  width: 1000px;
  /*height: 680px;*/
}

.step2 /deep/ .el-dialog {
  width: 1134px;
  min-height: 680px;
}

/*购物车列表*/
.car-title {
  background: #e6f7ff;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 5px;
}

.car-title h4 {
  font-size: 14px;
  display: inline-block;
}

.car-title p {
  font-size: 14px;
  font-weight: normal;
  display: inline-block;
  margin-left: 10px;
}

.car-title span {
  font-size: 14px;
  font-weight: normal;
  margin: 0 6px;
  cursor: pointer;
  color: #1890ff;
}

/deep/ .table_wrap.car-list {
  margin-top: 0 !important;
}

/*提示*/
.tip {
  width: 100%;
  background: rgba(230, 247, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(145, 213, 255, 1);
  padding: 10px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.tip span {
  color: #1890ff;
}

.tip /deep/ .el-icon-info {
  color: #1890ff;
  margin-right: 8px;
}

/*超出省略*/
/deep/ .el-table .cell {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .el-table__row .cell span {
  overflow-x: initial;
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #ecf5ff;
}

.bill-title {
  width: 100%;
  height: 181px;
  box-sizing: border-box;
  border: 1px solid #d8d8d8;
  margin-bottom: 10px;
  padding: 22px 60px;
}

.bill-title h4 {
  font-size: 18px;
  color: #333333;
  font-weight: bold;
  margin-bottom: 12px;
}

.bill-title p {
  margin-bottom: 12px;
  font-size: 14px;
  color: #666666;
}

.bill-title-left {
  float: left;
}

.bill-title-right {
  float: right;
}

.bill-title-right {
  font-size: 14px;
  color: #666666;
}

.bill-title-right p {
  text-align: right;
  position: relative;
}

.bill-title-right em {
  float: right;
  position: absolute;
  right: 225px;
  top: 0;
  width: 100px;
}

.bill-title-right .totalPrice {
  font-size: 22px;
  color: #333333;
  font-weight: bold;
}

/deep/ .el-tabs--border-card > .el-tabs__content {
  padding: 40px;
}

.tab-info h4 {
  width: 100%;
  background: #fafafa;
  border-radius: 2px;
  font-size: 16px;
  color: #333333;
  height: 34px;
  line-height: 34px;
  padding-left: 20px;
  font-weight: bold;
}

.tab-info p {
  margin-bottom: 40px;
  margin-top: 20px;
  margin-left: 20px;
  font-size: 14px;
  color: #666666;
}

/*确认报价单修改框*/
/deep/ .el-dialog__body {
  padding: 2px 20px 8px 20px;
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

.createPlan .type-select /deep/ .el-input__suffix {
  right: 4px;
}

/deep/
  .el-input-number.is-controls-right
  .el-input-number__decrease
  [class*='el-icon'],
.el-input-number.is-controls-right
  .el-input-number__increase
  [class*='el-icon'] {
  position: relative;
  top: 2px;
}

/deep/ .el-input-number {
  width: 304px;
  margin-bottom: 5px;
}

/deep/ .el-table th > .cell.highlight {
  color: #409eff !important;
}

/deep/ .el-input-number.is-controls-right .el-input__inner {
  text-align: left;
}

/deep/ .el-tabs--border-card {
  box-shadow: none;
  border: 1px solid #d8d8d8;
}

/*完成创建*/
.successIcon img {
  width: 72px;
}

.successIcon h2 {
  font-size: 24px;
  color: #333333;
  margin-top: 22px;
  margin-bottom: 8px;
  font-weight: bold;
}

.successIcon p {
  font-size: 14px;
  color: #999999;
  margin-bottom: 16px;
}

.planPanel,
.successIcon {
  text-align: center;
}

.planPanel {
  width: 557px;
  // height: 220px;
  background: #fafafa;
  border-radius: 2px;
  padding: 19px 0;
  box-sizing: border-box;
  margin: 0 auto;
}
.planPanel ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  height: 100%;
}
.planPanel ul li {
  padding-left: 207px;
  text-align: left;
  font-size: 14px;
  color: #666666;
  margin-bottom: 10px;
}

.planPanel ul li.money {
  margin-bottom: 10px;
  font-size: 20px;
  color: #666666;
}

.planPanel ul li em {
  font-size: 14px;
  color: #333333;
}

.planPanel ul .money i {
  font-style: normal;
  font-size: 12px;
  color: #666666;
}

// .noShareUl {
//   height: 245px !important;
// }

.noShareUl ul li {
  margin-bottom: 15px !important;
}

/*一键选点*/
.el-dialog__footer {
  text-align: center;
}

/deep/ .clearShopping {
  cursor: pointer;
  color: #1890ff;
  font-size: 14px;
}

/* 订单导入 */
.import_fanan a {
  color: #606266;
}

.import_fanan .fileButton {
  width: 126px;
}

.upload_file {
  display: inline-block;
}

.warning_box {
  margin-top: 20px;
  background: rgba(255, 251, 230, 1);
  border-radius: 4px;
  border: 1px solid rgba(255, 229, 143, 1);
  color: rgba(0, 0, 0, 0.65);
  padding: 0 5px;
}

.upload_file .aButton {
  width: 124px;
  height: 29px;
  line-height: 31px;
  text-align: center;
  display: inline-block;
  color: #666;
  margin-right: 3px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

.aButton:hover {
  border: 1px solid #409eff;
  color: #409eff;
}

/*safari下表头错位*/
/deep/ .el-table .el-table-column-checkbox .cell {
  width: 110px;
}

/deep/ .el-table .el-table-column-resName .cell {
  width: 200px;
}

/deep/ .el-table .el-table-column-mediaName .cell {
  width: 140px;
}

/deep/ .el-table .el-table-column-mediaRemark .cell {
  width: 140px;
}

.ad_pagination /deep/ .el-pagination__sizes .el-input__inner {
  width: 100px;
}

.ad_pagination /deep/ .el-pagination__editor.el-input .el-input__inner {
  width: 45px;
}
/deep/ .el-upload--text {
  width: 100%;
}

/deep/ .el-upload--text .el-upload-list__item {
  width: 100%;
}

/deep/ .el-upload--text .el-upload-dragger {
  padding-top: 9%;
  width: 100%;
  height: 135px;
  background: rgba(0, 0, 0, 0.06);
}

/* .unit {
  position: absolute;
  top: 5px;
  right: 17px;
  font-style: normal;
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.65);
  height: 30px;
  width: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 0 4px 4px 0;
  border-left: 1px solid #e6e7e9;
  // border:1px solid #E6E7E9;
} */
/deep/ .planAdsCntClass.el-input {
  width: 200px;
  .el-input__inner {
    width: 105px !important;
  }
}
.createPlan /deep/ .el-form-item {
  margin-bottom: 16px;
  .el-textarea {
    vertical-align: top;
  }
}
//选点方式按钮颜色
.el-button--goon {
  color: #fff;
  background-color: rgba(24, 144, 255, 1);
  border-color: rgba(24, 144, 255, 1);
}
.select_point_dialog {
  /deep/ .el-dialog__header {
    padding: 10px 0;
  }
  /deep/ .el-dialog__body {
    padding: 2px 20px 6px 20px;
  }
  /deep/ .el-dialog__footer {
    padding: 10px 24px 24px;
    text-align: center;
  }
}
</style>
<style>
.el-tooltip__popper.is-dark {
  max-width: 200px;
}

.other-dd-popper {
  padding: 6px;
}
</style>
