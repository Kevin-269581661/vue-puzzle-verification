<!-- 方案详情 -->
<template>
    <div>
      <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav">
          <p>
            <a href="#">方案管理</a><em> / </em><a href="#">方案详情</a>
          </p>
          <div class="tip">
            该方案由 {{ planDetail.realName }} 创建于 {{ planDetail.apcTime }}
          </div>
        </div>

        <!--资源信息-->
        <div class="mediaList_wrap">
          <div
            v-loading="loading"
            class="content_top_wrap"
            element-loading-text="玩命加载中.."
            element-loading-spinner="el-icon-loading"
          >
            <div class="plan-title">
              <h4 style="display: flex;">
                <span v-if="!planDetail.papID" class="order_type_tag blue">母</span>
                <span v-else class="order_type_tag green">子</span>
                <span>{{ planDetail.apName }}</span>
              </h4>

              <div v-if="planDetail.isSimpleRight === 1" class="handleBtn">
                <el-tooltip v-if="showLockBtn" placement="top" content="从今天起重新预锁七天">
                  <el-button @click="reLock">预 锁</el-button>
                </el-tooltip>

                <!-- apState：0 已完成；1 进行中；2 未投放；3 投放中；5 强制结束；-1 待配点 -->
                <template v-if="planDetail.apState == 1">

                  <!-- planMode：0 普通 1 意向 -->
                  <el-button
                    v-if="
                      customPermission.proposalPermission == 1 &&
                      planDetail.planMode == 1
                    "
                    @click="createShareCode"
                  >
                    协同选点
                  </el-button>

                  <el-button @click="setPlanPrice"> 设置金额 </el-button>

                  <el-button v-if="showMatchResBtn" :disabled="matchCnt >= 10" @click="matchRes" >
                    {{ `配点(${10 - matchCnt})` }}
                  </el-button>

                  <!-- 1:普通销售编辑非意向方案2:权限销售编辑意向小区3:媒介编辑所有方案 -->
                  <el-button v-if="showEditBtn" type="primary" @click="handleEdit">
                    编辑
                  </el-button>
                </template>

                <!-- 母单显示 -->
                <el-button v-if="!planDetail.papID" @click="openInfoDialog">
                  资料补充
                </el-button>
              </div>
            </div>
            <div>
              <DetailInfo v-if="isShow" :detail="planDetail"  :isSimpleRight="planDetail.isSimpleRight" />
            </div>
          </div>
        </div>

        <div class="mediaList_wrap margin_16_64">
          <el-tabs v-model="planPanel" @tab-click="handleClick">

            <!-- 选点排期 -->
            <el-tab-pane label="选点排期" name="first">
              <PlanPointScheduleTable
                :planDetail="planDetail"
                :setPointDataList="setPointDataList"
                :setpointArr="setpointArr"
                :filterCityData="filterCityData"
                :filtersData="filtersData"
                :filtersArea="filtersArea"
                :apId="apId"
              />
            </el-tab-pane>

            <!-- 物料信息 -->
            <el-tab-pane label="物料信息" name="third" v-if="planDetail.isSimpleRight === 1">
              <material
                :materialInfoData="materialInfoJson"
                :loading="maLoading"
                :isOrder="false"
                v-if="planPanel == 'third'"
              ></material>
            </el-tab-pane>

            <!-- 音频信息 -->
            <el-tab-pane label="音频信息" name="fourth" v-if="sessionData.permissions.includes('voiceAdvertisingBroadcastShow')">
              <audioList
                :audioInfoData="audioInfoList"
                :loading="voLoading"
                @getAudioList="getAudioList"
                :apId="apId"
                v-if="planPanel == 'fourth'"
              ></audioList>
              <div class="ad_pagination">
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[50, 100, 200, 300]"
                    :page-size="pageSize"
                    style="text-align: right; margin-top: 10px"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNum"
                  >
                  </el-pagination>
            </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="content_bottom_btn">
          <el-button plain class="cancel" @click="goBack">返回</el-button>
        </div>

      </div>

      <!--智能配点-->
      <add-point
        :dialogVisible="addPointDialogVisible"
        :showMatchResult="false"
        :matchCnt.sync="matchCnt"
        :apID="planDetail.apID"
        :rejectAdPlan="rejectAdPlan"
        :ADLimit="ADLimit"
        :customPermission="customPermission"
        @closeAddPoint="addPointDialogVisible = false"
        @openAddPoint="addPointDialogVisible = true"
        @merge2ShopList="BDSaveMatchToPlan"
      ></add-point>

      <!-- 订单详情-资料补充-弹窗 -->
      <OrderReplenishInfoDialog ref="orderReplenishInfoDialogRef" />

      <!-- 设置方案金额-弹窗 -->
      <EditPlanPriceDialog ref="editPlanPriceDialogRef" @submitSuccess="getInitData(true)" />
    </div>
  </template>

  <script>
  import { api } from "@/api/api.js";
  // 价格格式化
  import commaFormat from "@/commonFun/commaFormat.js";
  // 筛选过滤
  import filterFormat from "@/commonFun/filterTableData.js";
  // 时间格式化
  import dateFormat from "@/commonFun/timeFormat.js";
  import sessFun from "@/commonFun/sessFun.js";
  // 报价单
  import material from "@/components/common/components/materialInfo.vue";
  import audioList from "@/components/common/components/audioList.vue";
  import DetailInfo from "@/components/common/components/detailInfo.vue";
  import addPoint from '@/components/common/components/addPoint.vue';
  import OrderReplenishInfoDialog from  '@/components/common/components/orderReplenishInfoDialog.vue'
  import PlanPointScheduleTable from '@/components/common/components/plan/planPointScheduleTable.vue'
  import EditPlanPriceDialog from './components/editPlanPriceDialog.vue'
  import {
    Message,
    MessageBox,
  } from "element-ui";

  export default {
    name: "planDetail",
    components: {
      material,
      DetailInfo,
      addPoint,
      audioList,
      OrderReplenishInfoDialog,
      PlanPointScheduleTable,
      EditPlanPriceDialog
    },
    data () {
      return {
        materialInfoJson:{},  //物料信息数据
        audioInfoList:[],  //音频信息列表
        // 登录信息
        sessionData: {},
        addPointDialogVisible: false,
        matchCnt: 10,
        rejectAdPlan: [],                  // 排斥方案选项
        // showMatchResult: false,
        ADLimit: [                      // step2 广告限制
          { value: '地产', label: '地产' },
          { value: '汽车', label: '汽车' },
          { value: '美容', label: '美容' },
          { value: '餐饮', label: '餐饮' },
          { value: '食品', label: '食品' },
          { value: '金融', label: '金融' },
          { value: '医学', label: '医学' },
        ],
        isDown: false,
        isShow: true,
        //加载中
        loading: true,
        maLoading: true,
        voLoading: true,
        role: "",
        customPermission: {},
        // 方案详情
        planDetail: {
          AdDoor: {},
          barrier: {},
        },
        // 选点排期列表的数据
        setPointDataList: [],
        // 选点排期的全部数据
        setpointArr: [],
        // 城市过滤结果
        filterCityData: [],
        // 排期时间过滤
        filtersData: [],
        // 地区过滤结果
        filtersArea: [],
        planPanel: "first",
        // 分页时页面条目数量
        pageSize: 100,
        currentPage: 1,
        totalNum: 0,
        apId: sessionStorage.getItem('plan_apid')
      };
    },
    created () {
       //获取物料信息
      this.getMaterialInfo();
      //获取音频信息
      this.getAudioList();
      // 获取角色
      this.getRole();
      // 获取选点排期数据
      this.getInitData();
      this.getMatchCnt(sessionStorage.getItem("plan_apid"));
      this.getADLimit()       // 获取广告限制列表

    },

    provide() {
      return {
        getAudioList: this.getAudioList
      }
    },

    computed: {
      showLockBtn() {
        return ['ADN_MD_COUNTRY', 'ADN_MD'].includes(this.role) && this.planDetail.lockStatus == 1;
      },
      showMatchResBtn() {
        return this.customPermission.proposalPermission == 1 && this.planDetail.planMode == 1 && this.role == 'ADN_BD'
      },
      showEditBtn() {
        return (
          ['ADN_BD_KA', 'ADN_BD'].includes(this.role) &&
          this.customPermission.proposalPermission == 0 &&
          this.planDetail.planMode != 1
        ) || (
          ['ADN_BD_KA', 'ADN_BD'].includes(this.role) &&
          this.customPermission.proposalPermission == 1 &&
          this.planDetail.planMode == 1
        ) || ['ADN_MD_COUNTRY', 'ADN_MD'].includes(this.role)
      },
    },

    methods: {
      /**
       * 打开资料补充弹框
       */
      openInfoDialog() {
        this.$refs.orderReplenishInfoDialogRef && this.$refs.orderReplenishInfoDialogRef.open(this.apId)
      },

      handleSizeChange (val) {
        this.pageSize = val;
        this.getAudioList()
      },
      handleCurrentChange (val) {
        this.currentPage = val;
        this.getAudioList()
      },

      // tab点击
      handleClick () {
        if (this.planPanel == "first") {
          this.getSetPoint();
        } else if (this.planPanel == "second") {
        } else if (this.planPanel == "third") {
        } else if (this.planPanel == "fourth") {
        }
      },
      // 获取选点排期列表数据
      getInitData (updateDetail = false) {
        this.isShow = updateDetail;
        // 真实数据
        let apid = sessionStorage.getItem("plan_apid");
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apid: apid
        };
        // uid         int【必填】     当前账户UserID
        // apid        int             公司对应方案apID
        api.getApi(this.apiVar.Advertisement + "/GetFanganInfo", info)
          .then(res => {
            if (res.data.SysCode == 200200) {
              let info = res.data.data;
              this.planDetail = {
                papID: info.papID,
                adcID: info.adcID,
                apID: info.apID,
                apName: info.apName,
                apState: info.apState,
                planMode: info.planMode,
                lockStatus: info.lockStatus,
                apTotal: info.apTotal,
                apcTime: dateFormat.toDateTime(info.apcTime, '/'),
                bTitle: info.bTitle,
                cName: info.cName,
                cuName: info.cuName,
                cityList: info.cityList || [],
                customerDemand: info.customerDemand || '',
                pdEnd: info.pdEnd,
                pdStar: info.pdStar,
                rID: info.rID,
                rIDs: info.rIDs,
                realName: info.realName,
                remark: info.remark,
                pdTotal: this.priceFormat(info.apTotal / 100 - info.otherFee - info.sendFee),
                pdSendFee: this.priceFormat(info.sendFee),
                pdOtherFee: this.priceFormat(info.otherFee),
                Total: this.priceFormat(info.apTotal / 100),
                AdDoor: {
                  pdTotal: this.priceFormat((info.AdDoor.pdTotal - info.AdDoor.adOtherFee - info.AdDoor.adSendFee) / 100),
                  pdSendFee: this.priceFormat(info.AdDoor.adSendFee / 100),
                  pdOtherFee: this.priceFormat(info.AdDoor.adOtherFee / 100),
                },
                barrier: {
                  pdTotal: this.priceFormat((info.barrier.pdTotal - info.barrier.adOtherFee - info.barrier.adSendFee) / 100),
                  pdSendFee: this.priceFormat(info.barrier.adSendFee / 100),
                  pdOtherFee: this.priceFormat(info.barrier.adOtherFee / 100),
                },
                isSimpleRight: info.isSimpleRight
              };
              // 选点排期
              !updateDetail && this.getSetPoint();
              this.getRejectPlanList(res.data.data.suID);
            } else {
              Message.warning(res.data.MSG);
            }
          })
          .catch(res => {
            console.log(res);
          });
      },
      // 获取选点排期
      getSetPoint () {
        if (this.setpointArr.length) {
          return;
        }
        // 真实数据
        let apid = sessionStorage.getItem("plan_apid");
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apid: apid
        };
        if (this.planDetail.apState == 1) {
          // apState: 1 方案并未转成订单
          this.funcToInit(this.apiVar.Advertisement + '/GetADB', info, this.planDetail.apState);
        } else {
          this.funcToInit(this.apiVar.Advertisement + '/GetAdLaunch', info, this.planDetail.apState);
        }
      },
      /**
       * 广告限制列表
       */
      getADLimit () {
        this.ADLimit = []
        let params = {
          "uid": this.sessionData.uID,
          "token": this.sessionData.token,
          "service": "GetNotPush",
          "data": {}
        }
        api.postApi_new(this.apiVar.Media, params).then(res => {
          console.log('广告限制列表', res)
          if (res.data.SysCode === 200200) {
            let limit = res.data.data
            let limitArr = []
            for (let i = 0; i < limit.length; i++) {
              let limitObj = { value: limit[i].nTitle, label: limit[i].nTitle }
              limitArr.push(limitObj)
            }
            this.ADLimit = limitArr
          }
        })
      },
      // 获取排斥方案选择列
      getRejectPlanList (suID) {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          sales_user: suID
        }
        api.getApi(this.apiVar.Advertisement + '/getSalesProject', params).then(res => {
          console.log('销售所属方案', res)
          if (res.data.SysCode == 200200) {
            let resData = res.data.data
            let tempList = []
            for (let key of resData) {
              if (this.apid != key.apId) {
                tempList.push({
                  value: key.apId,
                  label: key.apName + '（' + key.cname + ' · ' + key.apcTime + '）'
                })
              }
            }
            this.rejectAdPlan = tempList
          } else {
            sessFun.messageFun('warning', res.data.MSG)
          }
        })
      },
      // 请求数据整合
      funcToInit (apiUrl, info, state) {
        // uid         int【必填】     当前账户UserID
        // apid        int             公司对应方案apID
        api.getApi(apiUrl, info)
          .then(res => {
            if (!res.data.SysCode) {
              let initData = res.data;
              let resInfo = initData.adSpaceInfo;
              // 城市中文名称
              for (let data of resInfo) {
                let time = "";
                if (state == 1) {
                  time = this.formatTime(data.pbStar) + "-" + this.formatTime(data.pbEnd);
                } else {
                  time = this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
                }
                data.timeRange = time;
                let finishTimeRange = '';
                if (data.lState == 2) {
                  finishTimeRange = this.formatTime(data.lStar) + "-" + this.formatTime(data.lSetTime);
                }
                data.finishTimeRange = finishTimeRange;
              }
              // 城市筛选过滤
              this.filterCityData = filterFormat(resInfo, "city");
              this.filtersArea = filterFormat(resInfo, "rName");
              this.filtersData = filterFormat(resInfo, "timeRange");
              // 选点排期列表数据处理
              this.setPointDataList = this.setPointDataFormat(resInfo)
              // 选点排期全部数据
              this.setpointArr = resInfo;
              this.loading = false;
              this.maLoading = false;

              this.$nextTick(function () {
                this.isShow = true;
              });
            } else {
              Message.warning(res.data.MSG);
            }
          })
          .catch(res => {
            this.loading = false;
            this.maLoading = false;
            console.log(res);
          });
      },
      // 选点排期数据处理
      setPointDataFormat(data) {
        let dataArr = []
        for (const info of data) {
          let obj = {
            resName: info.resName || "--",
            mTitle: info.mTitle || "--",
            mediaTypeName: info.mediaTypeName || "--",
            asLab: info.asLab || "--",
            siteOrientation: info.siteOrientation || "--",
            city: info.city || "--",
            rName: info.rName || "--",
            assetTag: info.assetTag || "--",
            street: info.street || "--",
            tradingArea: info.tradingArea || "--",
            mType: info.mType || "--",
            site: info.site || "--",
            buildingName: info.buildingName || "--",
            unitName: info.unitName || "--",
            timeRange: info.timeRange || "--",
            // 如果字段没有值，接口不返回这个字段key
            mac: info.mac || '--'
          }
          dataArr.push(obj)
        }
        return dataArr
      },
      // 获取物料新接口
      getMaterialInfo (){
        let apID = sessionStorage.getItem("plan_apid");
        let info = {
          apID
        };
        api.getApi("/addsp/material/getMaterialCntByPlan", info).then(res=>{
          if(res.data.SysCode== 200200){
            let _data=res.data.data;
            let _materialCntInfoList=[];
            let _mediaTypeName=[];
            _data.forEach((item)=>{
              _mediaTypeName.push(item.mediaTypeName);
              _materialCntInfoList.push(item.materialCntInfoList);
            })
            this.materialInfoJson={
              mediaTypeName:_mediaTypeName,
              materialCntInfoList:_materialCntInfoList
            };
          }else{
            this.$message({
                message: res.data.MSG,
                type: 'error'
            });
          }
        }).catch(err => {
          console.log(err);
        })
      },

      // 时间格式规范
      formatTime (val) {
        return dateFormat.toDate(val, "/");
      },
      // 价格加上逗号
      priceFormat (price) {
        return commaFormat.init(price);
      },
      priceToFormat (price) {
        if (!price) {
          return 0
        }
        return commaFormat.format(price);
      },
      // 返回
      goBack () {
        this.$router.push("./planList");
      },
      // 弹出框修改路径
      changeRoute () {
        MessageBox.confirm(
          `该方案被预锁,请先解除预锁,是否去解锁？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$router.push("./planList");
          })
          .catch(() => {
            Message.info("已取消操作");
          });
      },
      // 重新预锁
      reLock () {
        this.$confirm('是否确定对该方案重新进行预锁？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 方案详情的预锁重置
          api.postApi(this.apiVar.Advertisement + "/ResetFangLock", {
            uid: this.sessionData.uID,
            token: this.sessionData.token,
            apid: sessionStorage.getItem("plan_apid")
          }).then(res => {
            if (!res.data.SysCode) {
              console.log('res.data', res.data)
            } else {
              Message.success('重新预锁成功！');
            }
          });
        }).catch(() => { })
      },
      /**
       * @description: 生成协同选点链接
       * @param {*}
       * @return {*}
       */
      createShareCode () {
        api.postApi('/addsp/proposal/share/createShareCode', {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apID: this.planDetail.apID
        }).then((res) => {
          if (res.data.SysCode === 200200) {
            // let Url = this.apiVar.qadnUrl + '/shareADList?apid=' + res.data.data.apID + '&aicode=' + res.data.data.aiCode;
            let Url = `${window.location.protocol}//${window.location.host}/shareADListProposal?apid=${res.data.data.apID}&aicode=${res.data.data.aiCode}`;
            console.log('url', Url);
            let oInput = document.createElement('input');
            oInput.value = Url;
            document.body.appendChild(oInput);
            oInput.select();                // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.style.display = 'none';
            sessFun.messageFun("success", '协同选点链接复制成功，马上分享');
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
      },
      /**
       * @description: 设置方案金额
       * @param {*}
       * @return {*}
       */
      setPlanPrice (formName) {
        this.$refs.editPlanPriceDialogRef && this.$refs.editPlanPriceDialogRef.open(this.planDetail.apID)
      },

      // 销售配点
      matchRes () {
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apid: this.planDetail.apID,
        };
        api.postApi(this.apiVar.Advertisement + "/CheckLock", info).then(async res => {
          if (!res.data.SysCode) {
            if (!res.data.IsLock) {
              /* if(this.planDetail.apState!==-1) {
                  // 方案已配点，显示上次配点结果
                  this.showMatchResult = true
                  this.$nextTick(()=>{
                      // 重置显示参数，方便下次触发watch
                      this.showMatchResult = false
                  })
              } else { */
              // 方案未配点
              this.addPointDialogVisible = true
              // }
            } else {
              this.changeRoute();
            }
          }
        });
      },
      // 获取该用户下的配点次数
      getMatchCnt (apID) {
        return new Promise((resolve) => {
          api.getApi("/addsp/match/getMatchCnt?apID=" + apID).then(res => {
            if (res.data.SysCode == 200200) {
              this.matchCnt = res.data.data || 0
              resolve(true)
            } else {
              sessFun.messageFun('warning', res.data.MSG)
              resolve(false)
            }
          }).catch(err => {
            console.log(err);
            resolve(false)
          });
        })
      },
      // 替换方案中的点位
      BDSaveMatchToPlan () {
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apID: this.planDetail.apID
        };
        api.postApi("/addsp/match/UpdatePlan", info).then((res) => {
          if (res.data.SysCode === 200200) {
            location.reload(false)
            sessFun.messageFun("success", '保存配点成功！');
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
      },

      //清空草稿箱数据
      clearDrafts (apid) {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          apID: apid
        };
        return new Promise(resolve => {
          api.postApi(this.apiVar.CleanAdBackUp, params).then((res) => {
            if (res.data.SysCode === 200200) {
              console.log("清除草稿箱成功");
              resolve(1)
            } else {
              sessFun.messageFun("warning", "清除草稿箱失败");
            }
          });
        })
      },
      // 编辑
      handleEdit () {
        let apid = sessionStorage.getItem("plan_apid");
        sessionStorage.setItem("planDetail", JSON.stringify(this.planDetail))
        let session = this.sessionData;
        let info = {
          uid: session.uID,
          token: session.token,
          apid: apid,
        };
        api.postApi(this.apiVar.Advertisement + "/CheckLock", info).then(async res => {
          if (!res.data.SysCode) {
            if (!res.data.IsLock) {
              // 意向方案
              if (this.planDetail.planMode == 1) {
                if (['ADN_BD_KA', 'ADN_BD'].includes(this.role)) {
                  // 编辑意向小区
                  (await this.clearDrafts(apid)) && this.$router.push("./editEmptyPointPlan");
                } else {
                  this.$router.push("./editPlan");
                }
              } else {
                // 非意向方案
                this.$router.push("./editPlanOld");
              }
            } else {
              this.changeRoute();
            }
          }
        });
      },
      // 获取角色
      getRole () {
        this.sessionData = sessFun.getSess();
        this.role = this.sessionData.uType;
        this.customPermission = this.sessionData.customPermission;
      },

      //获取音频信息列表
      getAudioList() {
        this.voLoading =true
        let params = {
          apId: sessionStorage.getItem("plan_apid"),
          pageSize: this.pageSize,
          pageNum: this.currentPage
        }
        api.getApi('/addsp/api/v1/voice/listVoiceByApId', params)
          .then(res => {
            console.log(res)
            this.audioInfoList = res.data.data.list
            this.voLoading =false
          })
          .catch(err => {
            console.log(err)
            this.voLoading =false
          })
      }
    },
  };
  </script>

  <style lang="scss" scoped>
  @import '@/assets/component.scss';

  .ellipsis-td {
    width: 132px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* 设置方案金额 */
  /deep/ .settlement-dialog {
    .el-form-item {
      padding: 8px 0;
      margin: 0;
      .el-form-item__label {
        color: rgba(0, 0, 0, 0.65);
      }
      ::placeholder {
        /*Firefox,Chrome,Opera*/
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
      :-ms-input-placeholder {
        /*InternetExplorer10-11*/
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
      ::-ms-input-placeholder {
        /*MicrosoftEdge*/
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
    }
    .form__line {
      margin: 16px 0;
      height: 1px;
      background: #e9e9e9;
    }
    .el-form-item__content {
      line-height: unset;
      .el-input__inner {
        color: rgba(0, 0, 0, 0.65);
      }
      .el-input-group__append {
        padding: 4px 12px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.25);
      }
    }
    .special-padding.el-form-item {
      .el-input-group__append {
        padding: 4px 9px;
      }
    }
    .form-item__price {
      line-height: 32px;
      color: rgba(0, 0, 0, 0.65);
    }
    .el-dialog__header {
      padding: 16px 24px;
      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
      }
    }
    .el-dialog__body {
      padding: 0 24px;
    }
    .el-dialog__footer {
      padding: 16px 24px 24px;
      .dialog-footer__button {
        word-spacing: -1em;
        .el-button + .el-button {
          margin-left: 16px;
        }
      }
    }
    .el-form-item__label {
      padding: 0;
      line-height: 32px;
    }
  }
  /*状态行*/
  /deep/ .el-table .warning-row {
    background: #fff1f1;
  }

  /*tabbar*/
  /deep/ .el-textarea__inner {
    resize: vertical;
  }

  /deep/ .el-tabs__nav-wrap::after {
    background-color: transparent;
  }


  /deep/ .el-tabs__nav-scroll {
    padding-left: 28px;
  }

  .baojiadan /deep/ .el-tabs__nav-scroll {
    padding-left: 0;
  }

  /deep/ .el-table__column-filter-trigger {
    left: 5px;
  }

  /*报价单*/

  /deep/ .el-tabs--border-card {
    box-shadow: none;
  }

  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 40px;
  }

  .panel {
    padding: 10px 24px;
  }

  .step3 {
    padding: 0 105px;
  }

  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding: 40px;
  }
  /deep/ .el-button.el-button--text span {
    position: relative;
    top: -5px;
  }

  /*详情头部*/
  .content_top_wrap {
    padding: 24px 32px;
    background: #ffffff;
    height: 145px;
    position: relative;
  }

  .plan-title .handleBtn {
    position: absolute;
    right: 28px;
    top: 30px;
    .handleBtn--plain {
      color: #000000a6;
    }
  }

  .plan-title .handleBtn button {
    width: 74px;
    height: 32px;
    font-size: 14px;
    line-height: 9px;
    padding: 0;
  }

  .plan-title h4 {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: bold;
    margin-bottom: 22px;
  }

  .plan-title h4 p {
    display: inline-block;
    font-size: 14px;
    color: #666666;
    font-weight: normal;
    margin-left: 11px;
  }

  .plan-title h4 p img {
    width: 14px;
    height: 14px;
    position: relative;
    top: 1px;
    cursor: pointer;
  }

  .plan-title h4 img {
    width: 28px;
    height: 28px;
    position: relative;
    top: 5px;
    margin-right: 16px;
  }

  /*面包屑导航*/
  .tip {
    float: right;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    text-align: right;
    color: #999999;
  }

  /*按钮*/
  .content_bottom_btn {
    margin: 32px 0;
    width: 100%;
    text-align: center;
  }

  .content_bottom_btn button {
    width: 80px;
    height: 34px;
    line-height: 34px;
    outline: none;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    background: #ffffff;
    font-size: 14px;
    color: #666666;
  }

  /deep/ .mediaList_wrap .el-tabs__header {
    border-bottom: 1px solid #e6e7e9;
    height: 53px;
    line-height: 54px;
  }
  /deep/.mediaList_wrap .baojiadan .el-tabs__header {
    border-bottom: none;
    height: 38px;
    line-height: 38px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    margin: 0;
  }

  /deep/ .content_bottom_btn .el-button {
    padding: 0;
  }
  /deep/ .el-table__expanded-cell[class*='cell'] .el-form {
    height: 44px;
    line-height: 44px;
  }
  /deep/ .el-table__expanded-cell[class*='cell'] {
    padding: 0 46px;
    background-color: #f7f7f7;
  }
  /deep/ .el-form-item__content {
    line-height: 46px;
  }

  #pane-second {
    margin-bottom: 32px;
  }

  /deep/ .el-table td .cell {
    font-size: 14px;
  }

  .order_type_tag {
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    font-size: 18px;
    color: #fff;
    border-radius: 4px;
    margin-right: 10px;
    &.blue {
      background-color: #1890FF;
    }
    &.green {
      background-color: #67c23a;
    }
  }
  </style>
