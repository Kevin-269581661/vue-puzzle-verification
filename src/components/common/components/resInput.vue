<!--
 * @Author: penglei
 * @Date: 2021-06-11 17:32:36
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-18 16:15:16
 * @FilePath: /frontend/src/components/common/components/resInput.vue
-->
<template>
  <div>
    <div class="ad_mediaDetail_wrap clearfix">
      <div>
        <div class="content_top_wrap">
          <div class="content_top_form_wrap">
            <el-form
              :model="recForm"
              status-icon
              :rules="recRules"
              ref="recForm"
              label-width="100px"
              class="demo-ruleForm resFrom"
            >
              <el-form-item
                label="基本信息"
                class="baseInfo firstInfo"
              ></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="资源类型" prop="rt">
                    <el-select
                      v-model="recForm.rt"
                      placeholder="请选择资源类型"
                      :disabled="PathHaveEdit"
                      @change="selectRec"
                      @blur="blurFun('rt')"
                    >
                      <el-option label="写字楼" value="2"></el-option>
                      <el-option label="社区" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="所属城市" prop="city">
                    <el-cascader
                      v-if="cityOther"
                      :options="cityOptions"
                      v-model="recForm.city"
                      separator="-"
                      :show-all-levels="false"
                      placeholder="请选择所属城市"
                      filterable
                      @blur="blurFun('city')"
                      @change="handleChange"
                    >
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="所属区域" prop="region">
                    <el-select
                      v-model="recForm.region"
                      placeholder="请选择所属区域"
                      :clearable="true"
                      @change="getRegion"
                      @blur="blurFun('region')"
                    >
                      <el-option
                        v-for="item in regionOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="el_col_box">
                  <el-form-item label="资源名称" prop="resName">
                    <el-autocomplete
                      v-model="recForm.resName"
                      :fetch-suggestions="getResListByResName"
                      placeholder=""
                      :trigger-on-focus="false"
                      @select="changeResName"
                      @blur="blurFun('resName')"
                    >
                    </el-autocomplete>
                    <el-button
                      size="small"
                      type="primary"
                      @click="getResBasicData"
                      class="get_resName_btn"
                    >
                      检索</el-button
                    >
                  </el-form-item>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="bottom-end"
                    v-show="isResError"
                  >
                    <div slot="content">
                      <ul style="font-size: 12px; color: #fff">
                        <li>资源：{{ resCommentData.resName }}</li>
                        <li>媒体数：{{ resCommentData.mediaNum }}</li>
                        <li>创建时间：{{ resCommentData.updateTime }}</li>
                      </ul>
                    </div>
                    <p class="the_same_error">
                      这个小区名称已存在 <i class="el-icon-warning"></i>
                    </p>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="资源别名" prop="resAlias">
                    <el-input
                      v-model="recForm.resAlias"
                      placeholder="可填写多个，请用分号间隔"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="位置信息" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="资源地址" prop="resaddr">
                    <el-input
                      v-model="recForm.resaddr"
                      placeholder="例：广州大道中100号"
                      @blur="blurFun('resaddr')"
                      style="width: 100%"
                      class="el-from-item-address"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="地址别名" prop="addressAlias">
                    <el-input
                      v-model="recForm.addressAlias"
                      placeholder="例：花城大道1号"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" class="col_lng_lat">
                  <div
                    class="lng_lat_map_btn"
                    @click="openBmap"
                    v-qadn-mta-h5="{
                      id: PathHaveEdit
                        ? 'a002_b006_c000_d000_bt029_ck04'
                        : 'a002_b004_c000_d000_bt020_ck04',
                    }"
                  >
                    <i class="el-icon-location-outline"></i>
                    地图获取
                  </div>
                  <el-form-item
                    label="经纬度"
                    required
                    class="lng_lat_form_item"
                  >
                    <div class="form_item_box_son">
                      <el-form-item prop="lat" class="">
                        <el-input
                          v-model.trim="recForm.lat"
                          placeholder="经度"
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="form_item_box_son">
                      <el-form-item prop="lng">
                        <el-input
                          v-model.trim="recForm.lng"
                          placeholder="纬度"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="所属商圈"
                    prop="business"
                    class="right_form_item"
                  >
                    <el-input
                      v-model.trim="recForm.business"
                      placeholder=""
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="具体描述" prop="description">
                    <el-input
                      type="textarea"
                      v-model="recForm.description"
                      placeholder="请输入小区具体描述"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="周边配套" prop="supportingFacilities">
                    <el-input
                      type="textarea"
                      v-model="recForm.supportingFacilities"
                      placeholder="银行、医院、学校等"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="交通状况" prop="transportation">
                    <el-input
                      type="textarea"
                      v-model="recForm.transportation"
                      placeholder="公交、地铁等"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="属性信息" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="楼盘价格(元/m²)" prop="buildingPrice">
                    <el-input
                      v-model="recForm.buildingPrice"
                      placeholder="请输入楼盘价格"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="rt_village ? '楼盘类型' : '写字楼类型'"
                    prop="floorType"
                    :class="rt_village ? '' : 'floor_house_item'"
                  >
                    <el-select
                      v-model="recForm.floorType"
                      placeholder="请选择资源类型"
                      @blur="blurFun('floorType')"
                    >
                      <el-option
                        v-for="item in floorType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="rt_village ? '小区户数' : '办公室数量'"
                    prop="households"
                    :class="rt_village ? '' : 'floor_house_item'"
                  >
                    <el-input
                      v-model="recForm.households"
                      controls-position="right"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="楼栋数量" prop="buildingNum">
                    <el-input-number
                      v-model="recForm.buildingNum"
                      controls-position="right"
                      :min="0"
                      :max="9999"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="建筑类型" prop="buildingType">
                    <el-input
                      v-model="recForm.buildingType"
                      placeholder="例：超高层"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    :label="rt_village ? '入住年份' : '建成年份'"
                    prop="liveTime"
                  >
                    <el-date-picker
                      v-model="recForm.liveTime"
                      type="year"
                      value-format="yyyy"
                      format="yyyy 年"
                      :editable="false"
                      placeholder="请选择年份"
                      @blur="blurFun('liveTime')"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="占地面积（m²）" prop="floorSpace">
                    <el-input
                      v-model="recForm.floorSpace"
                      placeholder="请输入小区占地面积"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="建筑面积（m²）" prop="constructionSpace">
                    <el-input
                      v-model="recForm.constructionSpace"
                      placeholder="请输入小区建筑面积"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="建筑结构" prop="buildingStructure">
                    <el-input
                      v-model="recForm.buildingStructure"
                      placeholder="例：钢筋混凝土"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="容积率" prop="plotRatio">
                    <el-input
                      v-model="recForm.plotRatio"
                      placeholder="请输入小区容积率"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="绿化率（%）" prop="greenPercentage">
                    <el-input
                      v-model="recForm.greenPercentage"
                      placeholder="请输入小区绿化率"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="产权年限（年）" prop="ownershipPeriod">
                    <el-input
                      v-model="recForm.ownershipPeriod"
                      placeholder="请输入产权年限"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="出入口数" prop="doorwayNum">
                    <el-input
                      v-model="recForm.doorwayNum"
                      controls-position="right"
                      placeholder="请输入出入口数量"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="车位数" prop="carNumber">
                    <el-input
                      v-model="recForm.carNumber"
                      controls-position="right"
                      placeholder="请输入小区车位数"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="车流量（车次/日）" prop="carFlowrate">
                    <el-input
                      v-model="recForm.carFlowrate"
                      placeholder="请输入小区车流量"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="人流量（人次/日）" prop="peopleFlowrate">
                    <el-input
                      v-model="recForm.peopleFlowrate"
                      placeholder="请输入小区人流量"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="其他社区广告" prop="otherAd">
                    <el-select
                      v-model="recForm.otherAd"
                      placeholder="请选择已有的其他社区广告"
                    >
                      <el-option
                        v-for="(item, index) in otherAdList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="有无电梯" prop="liftType">
                    <el-select
                      v-model="recForm.liftType"
                      placeholder="请选择有无电梯"
                      @blur="blurFun('liftType')"
                    >
                      <el-option
                        v-for="(item, index) in liftTypeList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="入住率(%)" prop="liveRate">
                    <el-input-number
                      v-model="recForm.liveRate"
                      placeholder="请输入入住率"
                      :controls="false"
                      :min="0"
                      :max="100"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="物业信息" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="物业公司" prop="pmcName">
                    <el-input
                      v-model="recForm.pmcName"
                      placeholder="物业公司单位名称"
                      @blur="blurFun('pmcName')"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="开发商" prop="developer">
                    <el-input
                      v-model="recForm.developer"
                      placeholder="例：国有房产"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="物业费（元/m²/月）" prop="managementFee">
                    <el-input
                      v-model="recForm.managementFee"
                      placeholder="请输入物业费"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="售楼地址" prop="salesOfficeAdd">
                    <el-input
                      v-model="recForm.salesOfficeAdd"
                      placeholder="请输入售楼地址"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="76" class="from_row">
                <el-col :span="6">
                  <el-form-item label="售楼电话" prop="salesPhoneNumber">
                    <el-input
                      v-model="recForm.salesPhoneNumber"
                      placeholder="请输入售楼电话"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="折扣信息" prop="discount">
                    <el-input
                      v-model="recForm.discount"
                      placeholder="请输入折扣信息"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="预售许可证" prop="preSalePermit">
                    <el-input
                      v-model="recForm.preSalePermit"
                      placeholder="请输入预售许可证"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="产权性质" prop="ownershipType">
                    <el-input
                      v-model="recForm.ownershipType"
                      placeholder="例：国有房产"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="小区照片" class="baseInfo"></el-form-item>
              <el-row :gutter="76" class="from_row">
                <el-col :span="24">
                  <el-row v-if="customPermission.patrolPermission" type="flex">
                    <el-form-item
                      label=""
                      prop="mImg"
                      class="left_form_item"
                      style="width: 120px"
                    >
                      <div class="upload_img_wrap" style="width: 120px">
                        <el-upload
                          :action="doUpload"
                          list-type="picture-card"
                          :file-list="resUpdata[0] ? [resUpdata[0]] : []"
                          :on-success="handleDownSuccess"
                          :on-preview="handlePictureCardPreview_res"
                          :before-upload="beforeUpload_res"
                          :on-remove="handleRemoveR"
                        >
                          <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="resImgDialog">
                          <img width="100%" :src="resImgUrl" alt="" />
                        </el-dialog>
                      </div>
                    </el-form-item>
                    <el-form-item
                      label=""
                      prop="mImg"
                      class="left_form_item"
                      style="width: 120px"
                    >
                      <div class="upload_img_wrap" style="width: 120px">
                        <el-upload
                          :action="doUpload"
                          list-type="picture-card"
                          :file-list="resUpdata[1] ? [resUpdata[1]] : []"
                          :on-success="handleDownSuccess"
                          :on-preview="handlePictureCardPreview_res"
                          :before-upload="beforeUpload_res"
                          :on-remove="handleRemoveR"
                        >
                          <i class="el-icon-plus"></i>
                        </el-upload>
                      </div>
                    </el-form-item>
                    <el-form-item
                      label=""
                      prop="mImg"
                      class="left_form_item"
                      style="width: 120px"
                    >
                      <div class="upload_img_wrap" style="width: 120px">
                        <el-upload
                          :action="doUpload"
                          list-type="picture-card"
                          :file-list="resUpdata[2] ? [resUpdata[2]] : []"
                          :on-success="handleDownSuccess"
                          :on-preview="handlePictureCardPreview_res"
                          :before-upload="beforeUpload_res"
                          :on-remove="handleRemoveR"
                        >
                          <i class="el-icon-plus"></i>
                        </el-upload>
                      </div>
                    </el-form-item>
                  </el-row>
                  <el-form-item
                    v-else
                    label=""
                    prop="mImg"
                    class="left_form_item"
                  >
                    <div class="upload_img_wrap" style="width: 120px">
                      <el-upload
                        :action="doUpload"
                        list-type="picture-card"
                        :file-list="resUpdata"
                        :limit="1"
                        :on-success="handleDownSuccess"
                        :on-preview="handlePictureCardPreview_res"
                        :before-upload="beforeUpload_res"
                        :on-remove="handleRemoveR"
                      >
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      <el-dialog :visible.sync="resImgDialog">
                        <img width="100%" :src="resImgUrl" alt="" />
                      </el-dialog>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="mapVisible"
      :close-on-click-modal="false"
      custom-class="map_dialog"
      title="地图"
      top="10vh"
      width="85%"
    >
      <div
        v-loading="mapLoading"
        element-loading-text="拼命加载中..."
        element-loading-spinner="el-icon-loading"
      >
        <el-input
          placeholder="请输入小区地址"
          style="width: 240px"
          size="small"
          v-model="searchResName"
        />
        <el-button size="small" type="primary" @click="searchFun"
          >搜索</el-button
        >
        <span
          style="
            font-size: 14px;
            color: #333333;
            display: inline-block;
            margin-top: 10px;
          "
          >当前选择信息: 城市:{{ searchResData.city || "--" }} 区域:{{
            searchResData.district || "--"
          }}
          名称:{{ searchResData.title || "--" }} 经纬度:{{
            searchResData.lng + "," + searchResData.lat
          }}
        </span>
        <!--百度地图-->
        <div
          id="resMap"
          ref="resMap"
          style="height: 500px; margin-top: 14px"
        ></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="mapVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addLatLngByBmap()"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../../api/api";
import areaPackageNew from "../../../commonFun/areaPackage_new";
import areaToTextNew from "../../../commonFun/areaToText_new";
import sessFun from "../../../commonFun/sessFun.js";
export default {
  name: "resInput",
  data() {
    //资产编号
    let validateAssetId = (rule, value, callback) => {
      let reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
      if (reg.test(value)) {
        callback(new Error("只能输入数字字母符号!"));
      } else {
        callback();
      }
    };
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
    let validateLat = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value !== "" && !reg.test(value)) {
        callback(new Error("只能输入数字!"));
      } else {
        if (value < 0 || value > 180) {
          callback(new Error("只能输入数字(0-180)!"));
        } else {
          callback();
        }
      }
    };
    let validateLng = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value !== "" && !reg.test(value)) {
        callback(new Error("只能输入数字!"));
      } else {
        if (value < 0 || value > 90) {
          callback(new Error("只能输入数字(0-90)!"));
        } else {
          callback();
        }
      }
    };
    // 绿化率
    let validateGreenP = (rule, value, callback) => {
      let reg = /^\d+(\.\d+)?$/;
      if (value !== "" && !reg.test(value)) {
        callback(new Error("只能输入数字!"));
      } else {
        if (value < 0 || value > 100) {
          callback(new Error("只能输入数字(0-100)!"));
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
      // 判断资源名称是否有重名
      isResError: false,
      // 资源名称重名信息
      resCommentData: {
        resName: "",
        mediaNum: "",
        updateTime: "",
      },
      otherAdList: [
        { label: "道闸广告", value: "道闸广告" },
        { label: "社区灯箱广告", value: "社区灯箱广告" },
        { label: "电梯广告", value: "电梯广告" },
        { label: "快递柜广告", value: "快递柜广告" },
        { label: "宣传栏广告", value: "宣传栏广告" },
      ],
      liftTypeList: [
        { label: "全部楼栋有电梯", value: "全部楼栋有电梯" },
        { label: "全部楼栋无电梯", value: "全部楼栋无电梯" },
        { label: "部分楼栋有电梯", value: "部分楼栋有电梯" },
      ],
      //资源表单
      recForm: {
        rt: "", //资源类型
        resName: "", // 资源名称
        resID: null,
        city: [],
        region: "", // 所属区域
        business: "", // 所属商圈
        resaddr: "", // 资源地址
        floorType: "", // 楼盘类型
        doorwayNum: "", // 出入数
        buildingNum: "1", // 楼栋数量
        households: "1", // 住户数量
        peopleFlowrate: "", //人流量
        carNumber: "", // 车位数
        carFlowrate: "", // 车流量
        liveRate: undefined, // 入住率
        liftType: "", // 有无电梯
        otherAd: "", // 同社区其他广告
        buildingPrice: "", // 楼盘价格
        liveTime: "",
        lng: "",
        lat: "",
        pmcName: "",
        fullViewUrl: "", // 资源图片
        addressAlias: "", // 地址别名
        description: "", // 描述
        supportingFacilities: "", // 周边配套
        transportation: "", // 交通状况
        buildingType: "", // 建筑类型
        floorSpace: "", // 占地面积
        constructionSpace: "", // 建筑面积
        plotRatio: "", // 容积率
        buildingStructure: "", // 建筑结构
        greenPercentage: "", // 绿化率
        ownershipPeriod: "", // 产权年限
        developer: "", // 开发商
        propertyManagement: "", // 物业公司
        managementFee: "", // 物业费
        salesOfficeAdd: "", // 售楼地址
        preSalePermit: "", // 预售许可证
        ownershipType: "", // 产权性质
        resAlias: "", // 资源别名
      },
      // 市区域地址获取经纬度
      resAddres: { city: "", area: "" },
      recRules: {
        rt: [
          {
            required: true,
            message: "请选择资源类型!",
            trigger: ["blur", "change"],
          },
        ],
        resName: [
          {
            required: true,
            message: "资源名称不能为空!",
            trigger: ["blur", "change"],
          },
          { validator: validateSpace, trigger: ["blur", "change"] },
          { validator: validateSpecialString, trigger: ["blur", "change"] },
          // { validator: this.isHaveCommenName, trigger: "blur" },
          { max: 40, message: "最多只能输入40个字节", trigger: "change" },
        ],
        city: [
          { required: true, message: "请选择所属城市!", trigger: "change" },
        ],
        region: [
          {
            required: true,
            message: "请选择所属区域!",
            trigger: ["blur", "change"],
          },
        ],
        addressAlias: [
          { validator: validateSpace, trigger: "blur" },
          {
            min: 0,
            max: 40,
            message: "最多只能输入40个字节!",
            trigger: "change",
          },
        ],
        business: [
          { validator: validateSpace, trigger: "blur" },
          {
            min: 0,
            max: 40,
            message: "最多只能输入40个字节!",
            trigger: "change",
          },
        ],
        resaddr: [
          {
            required: true,
            message: "具体地址不能为空!",
            trigger: ["blur", "change"],
          },
          { validator: validateSpace, trigger: "blur" },
          {
            min: 0,
            max: 70,
            message: "最多只能输入70个字节!",
            trigger: "change",
          },
        ],
        floorType: [
          { required: true, message: "请选择楼盘类型!", trigger: "change" },
        ],
        buildingNum: [
          { required: true, message: "楼栋数量不能为空!", trigger: "change" },
        ],
        households: [
          {
            required: true,
            message: "住户数量不能为空!",
            trigger: ["blur", "change"],
          },
          { validator: validatePrice, trigger: "change" },
        ],
        buildingPrice: [{ validator: validatePrice, trigger: "blur" }],
        liveTime: [
          { required: true, message: "请选择年份!", trigger: "change" },
        ],
        lat: [
          {
            required: true,
            message: "经度不能为空!",
            trigger: ["blur", "change"],
          },
          {
            required: true,
            validator: validateLat,
            trigger: ["blur", "change"],
          },
        ],
        lng: [
          {
            required: true,
            message: "纬度不能为空!",
            trigger: ["blur", "change"],
          },
          {
            required: true,
            validator: validateLng,
            trigger: ["blur", "change"],
          },
        ],
        pmcName: [
          {
            required: true,
            message: "请输入物业公司单位名称！",
            trigger: "blur",
          },
          { max: 40, message: "最多只能输入40个字符!", trigger: "blur" },
        ],
        doorwayNum: [{ validator: validatePrice, trigger: "blur" }],
        carNumber: [{ validator: validatePrice, trigger: "blur" }],
        carFlowrate: [{ validator: validatePrice, trigger: "blur" }],
        peopleFlowrate: [{ validator: validatePrice, trigger: "blur" }],
        liftType: {
          required: true,
          message: "请选择有无电梯！",
          trigger: ["blur", "change"],
        },
        greenPercentage: [
          // 绿化率
          { validator: validateGreenP, trigger: "blur" },
        ],
        plotRatio: [
          // 容积率
          { validator: validateGreenP, trigger: "blur" },
        ],
        developer: [
          { max: 40, message: "最多只能输入40个字符!", trigger: "blur" },
        ],
        managementFee: [
          { max: 40, message: "最多只能输入40个字符!", trigger: "blur" },
        ],
        salesOfficeAdd: [
          { max: 40, message: "最多只能输入40个字符!", trigger: "blur" },
        ],
        salesPhoneNumber: [
          { max: 40, message: "最多只能输入40个字符!", trigger: "blur" },
        ],
        preSalePermit: [
          { max: 250, message: "最多只能输入250个字符!", trigger: "blur" },
        ],
        ownershipType: [
          { max: 40, message: "最多只能输入40个字符!", trigger: "blur" },
        ],
        discount: [
          { max: 250, message: "最多只能输入250个字符!", trigger: "blur" },
        ],
        buildingStructure: [
          { max: 40, message: "最多只能输入40个字符!", trigger: "blur" },
        ],
        ownershipPeriod: [
          { max: 40, message: "最多只能输入40个字符!", trigger: "blur" },
        ],
        constructionSpace: [
          { max: 40, message: "最多只能输入40个字符!", trigger: "blur" },
        ],
      },

      recFormImg: "", // 资源图片
      cityOptions: [], //城市数组
      rt_village: true, // 资源类型是否是社区
      regionOpt: [], // 地区
      floorType: [
        // 显示-楼盘类型或写字楼类型  普通住宅  别墅 商住
        { label: "高端住宅", value: "高端住宅" },
        { label: "普通住宅", value: "普通住宅" },
        { label: "单体楼", value: "单体楼" },
        { label: "别墅", value: "别墅" },
        { label: "洋房", value: "洋房" },
        { label: "商住或商用", value: "商住或商用" },
        { label: "公共场所", value: "公共场所" },
      ],
      officeBuilding: [
        // 写字楼类型
        { lable: "单纯性写字楼", value: "单纯性写字楼" },
        { lable: "商住型写字楼", value: "商住型写字楼" },
        { lable: "综合型写字楼", value: "综合型写字楼" },
      ],
      village: [
        // 社区
        { label: "高端住宅", value: "高端住宅" },
        { label: "普通住宅", value: "普通住宅" },
        { label: "单体楼", value: "单体楼" },
        { label: "别墅", value: "别墅" },
        { label: "洋房", value: "洋房" },
        { label: "商住或商用", value: "商住或商用" },
        { label: "公共场所", value: "公共场所" },
      ],
      selectedOptions: [], // 城市默认选项
      PathHaveEdit: false, // 新建/编辑
      liveTime: "", // 资源时间
      doUpload: this.apiVar.qadnUrl + "/advertisement/UpLoad",
      resImg: {
        // 上传图片附带参数
        uid: JSON.parse(sessionStorage.getItem("session_data")).uID,
        pid: "", // 图片id
        palt: "", // 图片标题
        ptype: "", // 关联类型
        ptid: "", // 关联类型对应唯一ID
        ptp: "media", // 关联类型区分属性
      },
      resUpdata: [], // 编辑资源时显示已有图片

      Editloading: true, // 提交时的loading
      throwCity: "", // 用户权限不为全国时，根据uWho确定可选城市
      cityOther: true, // 默认显示全国省份城市
      resImgDialog: false, // 资源图片，大图
      resImgUrl: "", // 上传成功后的url地址，用于显示大图
      resData: { resID: "" }, // 创建资源成功，保存返回来的数据
      sessionData: sessFun.getSess(),
      submitBtnIsAble: false, // 防止多次点击

      FangJiaWangData: {}, // 记录房价网拉回来的数据
      classified: false,
      mapLoading: true,
      mapVisible: false, // 地图弹出框
      initMap: false, // 地图是否已初始化
      // 当前选择的搜索信息
      searchResData: {
        province: "",
        city: "",
        district: "",
        title: "",
        lat: "",
        lng: "",
      },
      searchResName: "", // 搜索的社区名
      resMap: "", // 百度地图
      // 修改媒体状态时的行数据
      rowData: {},
      changeBeforMediaState: "",
      customPermission: {}, //巡点权限
      queryTimeout: null,
      fangJiaWangPrivateCity: [], // 房价网权限城市
    };
  },
  computed: {
    changeLatLng() {
      if (
        this.resAddres.city &&
        this.resAddres.area &&
        this.recForm.resName &&
        this.recForm.resaddr
      ) {
        return (
          this.resAddres.city +
          this.resAddres.area +
          this.recForm.resName +
          this.recForm.resaddr
        );
      } else {
        return false;
      }
    },
  },
  watch: {
    changeLatLng(val) {
      clearTimeout(this.queryTimeout);
      this.queryTimeout = setTimeout(() => {
        this.querySearchAsync(val);
      }, 500);
    },
  },
  created() {
    this.getFangJiaWangCity();
  },
  mounted: function () {
    this.customPermission = this.sessionData.customPermission;
    this.resUpdata = [];
    this.ShowRegion();
    this.editFun(); // 编辑方法
  },
  methods: {
    getFangJiaWangCity() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetResSearchCity",
        data: { asrID: this.sessionData.asrID },
      };
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        if (res.data.SysCode == 200200) {
          console.log("房价网权限城市", res);
          this.fangJiaWangPrivateCity = res.data.data || [];
        } else {
          this.$message.warning(res.data.MSG);
        }
      });
    },
    //获取区域
    getRegion(val) {
      console.log("val", val);
      for (let key of this.regionOpt) {
        if (key.value == val) {
          this.resAddres.area = key.label;
        }
      }
    },
    // 模糊查询系统内已有资源（小区）
    getResListByResName(queryString, callback) {
      if (queryString) {
        console.log("resAddres", this.recForm.city);
        if (this.resAddres.city) {
          let params = {
            service: "GetResListByResName",
            // resName: queryString,
            // max: 20,
            uid: this.sessionData.uID,
            token: this.sessionData.token,
            data: {
              cityId: this.recForm.city[1] * 1, // 城市id
              resName: queryString,
            },
          };
          api.postApi_new("/mediaService/media", params).then((res) => {
            if (res.data.SysCode === 200200) {
              let results = [];
              for (let key of res.data.data) {
                results.push({
                  value: key.resName,
                  info: key,
                });
              }
              console.log("results---", results);
              callback(results);
            } else {
              callback([]);
              sessFun.messageFun("warning", res.data.data.MSG);
            }
          });
        } else {
          callback([]);
          sessFun.messageFun("warning", "请先选择社区所在的城市");
        }
      } else {
        callback([]);
        return;
      }
    },
    // 根据选择的小区获取所在区域
    changeResName(item) {
      let resInfo = item.info;
      for (let key of this.regionOpt) {
        if (key.label.includes(resInfo.district)) {
          this.recForm.region = key.value;
          this.resAddres.area = key.label;
          break;
        }
      }
      this.setResInfo(resInfo);
    },
    // 系统录入的资源信息进行页面填充
    setResInfo(obj) {
      let ii =
        '<p style="font-weight: 600;font-size: 16px;color: color:rgba(0,0,0,0.85);">' +
        '<i class="el-icon-circle-check" style="font-size: 22px;color:#52C41A;margin-right: 8px"></i>' +
        " 资源检索成功</p>" +
        '<p style="font-size: 14px;padding-left: 34px;color: color:rgba(0,0,0,0.65)">将自动填入信息，可手动修改。</p>';
      this.$confirm(ii, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        showClose: false,
        closeOnClickModal: false,
      })
        .then(() => {
          this.recForm.resaddr = obj.resAddress || ""; // 资源地址
          this.recForm.resID = obj.resID || ""; // 小区ID
          this.recForm.business = obj.tradingArea || ""; // 商圈
          this.recForm.floorType = obj.cType; // 楼盘类型             // 出入数
          this.recForm.buildingNum = obj.fNum; // 楼栋数量
          this.recForm.households = obj.hNum; // 住户数量
          this.recForm.peopleFlowrate = obj.peopleFlow || ""; // 人流量
          this.recForm.carNumber = obj.parking || ""; // 车位数
          this.recForm.carFlowrate = obj.carFlow || ""; // 车流量
          this.recForm.buildingPrice = obj.hPrice; // 楼盘价格
          this.recForm.liveTime = obj.moveinTime || ""; // 入住年份
          this.recForm.lng = obj.latLng.split(";")[0]; // 纬度
          this.recForm.lat = obj.latLng.split(";")[1]; // 经度
          //
          this.recForm.resAlias = obj.alias || ""; // 资源别名
          this.recForm.addressAlias = obj.addressAlias || ""; // 地址别名
          this.recForm.description = obj.description || ""; // 描述
          this.recForm.supportingFacilities = obj.supportingFacilities || ""; // 周边配套
          this.recForm.buildingType = obj.buildingType || ""; // 建筑类型
          this.recForm.transportation = obj.transportation || ""; // 交通状况
          this.recForm.floorSpace = obj.floorSpace || ""; // 占地面积
          this.recForm.constructionSpace = obj.constructionSpace || ""; // 建筑面积
          this.recForm.buildingStructure = obj.buildingStructure || ""; // 建筑结构
          this.recForm.greenPercentage = obj.greenPercentage || ""; // 绿化率
          this.recForm.ownershipPeriod = obj.ownershipPeriod || ""; // 产权年限
          this.recForm.plotRatio = obj.plotRatio || ""; // 容积率
          this.recForm.developer = obj.developer || ""; // 开发商
          this.recForm.pmcName = obj.resPMC || ""; // 物业公司
          this.recForm.liftType = obj.liftType; // 有无电梯
          this.recForm.managementFee = obj.managementFee || ""; // 物业费
          this.recForm.salesOfficeAdd = obj.salesOfficeAdd || ""; // 售楼地址
          this.recForm.preSalePermit = obj.preSalePermit || ""; // 预售许可证
          this.recForm.ownershipType = obj.ownershipType || ""; // 产权性质
          this.recForm.salesPhoneNumber = obj.salesPhoneNumber || ""; // 售楼电话
          this.resUpdata = (obj.fullViewUrl || "").split(",").map((item) => {
            return { name: "资源图片", url: item };
          });
        })
        .catch((error) => {
          console.error("小区信息填充error", error);
          sessFun.messageFun("info", "取消成功");
        });
    },
    // 根据所选的资源名称拉取房价网数据
    getResBasicData() {
      let flag = this.fangJiaWangPrivateCity.some((item) => {
        return item.cityId == this.recForm.city[this.recForm.city.length - 1];
      });
      if (!flag) {
        sessFun.messageFun(
          "warning",
          `没有权限访问对应的资源(您未开通城市${this.resAddres.city}的权限)`
        );
        return;
      }
      if (
        this.recForm.resName !== "" &&
        this.resAddres.area !== "" &&
        this.resAddres.city !== ""
      ) {
        let params = {
          city: this.resAddres.city,
          district: this.resAddres.area,
          name: this.recForm.resName,
        };
        api
          .postApi(this.apiVar.QADNAPI + "/GetResDetails", params)
          .then((res) => {
            console.log("res", res);
            if (res.data !== "") {
              if (res.data.data) {
                this.setFangjiaData(res.data.data);
              } else {
                sessFun.messageFun("warning", "暂无该小区数据！");
              }
            } else {
              sessFun.messageFun("warning", "数据获取异常,暂无该小区数据");
            }
          });
      } else {
        sessFun.messageFun("warning", "资源名称及城市区域都不能为空");
      }
    },
    // 房价网数据填充
    setFangjiaData(obj) {
      let ii =
        '<p style="font-weight: 600;font-size: 16px;color: color:rgba(0,0,0,0.85);">' +
        '<i class="el-icon-circle-check" style="font-size: 22px;color:#52C41A;margin-right: 8px"></i>' +
        " 资源检索成功</p>" +
        '<p style="font-size: 14px;padding-left: 34px;color: color:rgba(0,0,0,0.65)">将自动填入信息，可手动修改。</p>';
      this.$confirm(ii, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        showClose: false,
        closeOnClickModal: false,
      })
        .then(() => {
          this.recForm.resaddr = obj.address || ""; // 资源地址
          this.recForm.business = obj.commercialArea || ""; // 商圈
          this.recForm.floorType = obj.propertyType; // 楼盘类型
          // this.recForm.doorwayNum = obj.doorwayNum                 // 出入数
          this.recForm.buildingNum = obj.buildingCount; // 楼栋数量
          this.recForm.households = obj.totalUnitCount; // 住户数量
          this.recForm.peopleFlowrate = obj.peopleFlowrate || ""; // 人流量
          this.recForm.carNumber = obj.parking || ""; // 车位数
          this.recForm.carFlowrate = obj.carFlowrate || ""; // 车流量
          this.recForm.buildingPrice = obj.avgPrice; // 楼盘价格
          this.recForm.liveTime = obj.finishYear
            ? obj.finishYear.toString()
            : ""; // 入住年份
          this.recForm.lng = obj.lat; // 纬度
          this.recForm.lat = obj.lng; // 经度
          //
          this.recForm.resAlias = obj.alias.join(","); // 资源别名
          this.recForm.addressAlias = obj.addressAlias[0]; // 地址别名
          this.recForm.description = obj.description || ""; // 描述
          this.recForm.supportingFacilities = obj.supportingFacilities || ""; // 周边配套
          this.recForm.buildingType = obj.buildingType || ""; // 建筑类型
          this.recForm.transportation = obj.transportation || ""; // 交通状况
          this.recForm.floorSpace = obj.floorSpace || ""; // 占地面积
          this.recForm.constructionSpace = obj.constructionSpace || ""; // 建筑面积
          this.recForm.buildingStructure = obj.buildingStructure || ""; // 建筑结构
          this.recForm.greenPercentage = obj.greenPercentage || ""; // 绿化率
          this.recForm.ownershipPeriod = obj.ownershipPeriod || ""; // 产权年限
          this.recForm.plotRatio = obj.plotRatio || ""; // 容积率
          this.recForm.developer = obj.developer || ""; // 开发商
          this.recForm.pmcName = obj.propertyManagement || ""; // 物业公司
          this.recForm.managementFee = obj.managementFee || ""; // 物业费
          this.recForm.salesOfficeAdd = obj.salesOfficeAdd || ""; // 售楼地址
          this.recForm.preSalePermit = obj.preSalePermit || ""; // 预售许可证
          this.recForm.ownershipType = obj.ownershipType || ""; // 产权性质
          this.recForm.salesPhoneNumber = obj.salesPhoneNumber || ""; // 售楼电话
          this.FangJiaWangData = JSON.parse(JSON.stringify(this.recForm)); //
        })
        .catch(() => {
          sessFun.messageFun("info", "取消成功");
        });
    },
    // 根据填写的具体地址去获取经纬度
    querySearchAsync(flag) {
      if (
        flag &&
        this.resAddres.city &&
        this.resAddres.area &&
        this.recForm.resName &&
        this.recForm.resaddr
      ) {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          address:
            this.resAddres.city +
            this.resAddres.area +
            this.recForm.resName +
            this.recForm.resaddr,
        };
        // console.log('根据填写的具体地址去获取经纬度',params)
        api
          .postApi(this.apiVar.Advertisement + "/Geocoder", params)
          .then((res) => {
            if (res.data.status == 0) {
              this.recForm.lat = res.data.result.location.lng; // 经度
              this.recForm.lng = res.data.result.location.lat; // 纬度
            }
          });
      } else {
        this.recForm.lat = ""; // 经度
        this.recForm.lng = ""; // 纬度
      }
    },
    openBmap() {
      this.mapVisible = true;
      if (!this.initMap) {
        let timer = setTimeout(() => {
          this.getMap();
          clearTimeout(timer);
          this.initMap = true;
        }, 300);
      } else {
      }
    },
    //百度地图
    getMap() {
      this.resMap = new BMap.Map("resMap"); // 创建Map实例
      console.log("this.resMap", this.resMap);
      var geolocation = new BMap.Geolocation();
      let that = this;
      //获取当前位置
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          let point = new BMap.Point(r.point.lng, r.point.lat); //定位位置
          that.resMap.centerAndZoom(point, 16); // 初始化地图
        } else {
          that.resMap.centerAndZoom(new BMap.Point(113.369838, 22.949325), 16); // 初始化地图
          that.resMap.setCurrentCity("广州"); // 设置地图显示的城市 此项是必须设置的
        }
        that.resMap.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
        if (that.recForm.resName) {
          that.searchResName = that.recForm.resName;
          that.searchFun();
        }
        that.mapLoading = false;
      });
    },
    // 地图获取经纬度
    searchFun() {
      console.log(this.searchResName, "百度地图搜索", this.recForm.resName);
      let lnglat = "";
      let that = this;
      let options = {
        renderOptions: {
          map: this.resMap,
          autoViewport: false,
          // selectFirstResult: true
        },
        onSearchComplete: function (results) {
          console.log("2results", results);
          // 判断状态是否正确
          if (local.getStatus() == 0) {
            console.log(results.getPoi(0)); // 这就是我们想要的地址
            that.searchResData.city = results.getPoi(0).city;
            that.searchResData.title = results.getPoi(0).title;
            let point = results.getPoi(0).point;
            lnglat = results.getPoi(0).point;
            console.log("point", point, that.searchResData);
            that.getResDataInfoByPoint(point);
          } else {
            console.log("没有搜索到该地址！");
          }
        },
        onMarkersSet: function (pois) {
          // 给创建的标注添加点击事件
          // console.log('onMarkersSet', pois)
          that.markerArr = pois;
          for (let key of pois) {
            key.marker.addEventListener("click", that.showInfo);
          }
        },
      };
      // console.log('3options',options)
      let local = new BMap.LocalSearch(this.resMap, options);
      local.search(this.resAddres.city + this.searchResName);
      // console.log('4')
    },
    //获取点击标注的坐标
    showInfo(e) {
      for (let mkey of this.markerArr) {
        if (mkey.marker == e.target) {
          this.searchResData.address = mkey.address;
          this.searchResData.title = mkey.title;
          // console.log('点击到相同的标注',mkey) // searchInfowindow target address title
        } else {
          // console.log('不相同的标注',mkey)
        }
      }
      let addr = { lng: e.point.lng, lat: e.point.lat }; // lng经度；lat纬度
      let point = new BMap.Point(addr.lng, addr.lat);
      this.getResDataInfoByPoint(point);
    },
    // 根据坐标获取省市区、地址
    getResDataInfoByPoint(point) {
      console.log("坐标", point);
      let geoc = new BMap.Geocoder();
      let that = this;
      geoc.getLocation(point, function (rs) {
        console.log("根据坐标获取省市区、地址", rs);
        let addComp = rs.addressComponents;
        console.log(
          addComp.province +
            "- " +
            addComp.city +
            ", " +
            addComp.district +
            "- " +
            addComp.street +
            "- " +
            addComp.streetNumber
        );
        that.searchResData.province = addComp.province;
        that.searchResData.city = addComp.city;
        that.searchResData.district = addComp.district;
        that.searchResData.lat = point.lat;
        that.searchResData.lng = point.lng;
        console.log(that.searchResData, point.lat, point.lng);
      });
    },
    // 地图选择的经纬度
    addLatLngByBmap() {
      // lat:经度  lng:纬度
      this.recForm.lat = this.searchResData.lng;
      this.recForm.lng = this.searchResData.lat;
      this.mapVisible = false;
    },

    // 城市地区联动-省级
    ShowRegion() {
      this.cityOther = true;
      this.cityOptions = areaPackageNew.province();
    },
    // uWho为全国时，根据市级城市rid，获取它的下属区、县
    handleChange(value) {
      this.recForm.region = "";
      this.resAddres.area = "";
      console.log("handleChange", value);
      let cityRID = value[1];
      let cityName = areaToTextNew.toTextCity(cityRID);
      this.resAddres.city = cityName;
      let regionArr = areaPackageNew.findArea(cityRID);
      console.log(cityName, "获取选中城市的区域", regionArr);
      let region = [];
      for (let i = 0; i < regionArr.length; i++) {
        let obj = { label: regionArr[i].rName, value: regionArr[i].rID };
        region.push(obj);
      }
      this.regionOpt = region;
      console.log("this.regionOpt", this.regionOpt);
    },
    // 资源输入框和下拉框失去光标
    blurFun(name) {
      console.log("name", name);
      // 手动触发校验
      this.$refs.recForm.validateField(name, (valid) => {
        console.log("错误提示信息", valid);
        if (!valid) {
          // console.log("校验通过");
        } else {
          // console.log("校验不通过");
        }
      });
    },
    // 按所属公司的城市区域检查是否有重复的资源名称
    isHaveCommenName(rule, value, callback) {
      if (
        this.recForm.resName !== "" &&
        this.resAddres.area !== "" &&
        this.resAddres.city !== ""
      ) {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          service: "GetResInfoByName",
          data: {
            prId: this.recForm.city[1],
            rId: this.recForm.region,
            name: this.recForm.resName,
          },
        };
        console.log("params", params);
        api.postApi_new(this.apiVar.Media, params).then((res) => {
          console.log("资源名称查重res", res);
          if (res.data.SysCode == 200200) {
            let resData = res.data.data;
            if (resData.length) {
              for (let key of resData) {
                if (key.resId != this.recForm.resID) {
                  this.isResError = true;
                  this.resCommentData.mediaNum = key.mediaCount;
                  this.resCommentData.resName = key.resName;
                  this.resCommentData.updateTime = key.createTime;
                  break;
                }
              }
              if (this.isResError) {
                callback(new Error(" "));
              } else {
                callback();
              }
            } else {
              callback();
            }
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
      }
    },
    // 接口返回为空时校验当前是否有重复的
    filterlocalAssetId(resData, value) {
      let num = 0;
      for (let key of this.arrMedia) {
        if (key.mediaForm.assetId === value) {
          key.isAssetIdError = false;
          num++;
        }
      }
      for (let rgKey of this.roadGateMedia) {
        if (rgKey.roadGateForm.assetId === value) {
          rgKey.isAssetIdError = false;
          num++;
        }
      }
      return num;
    },
    // 判断同资源下资产编号是否重复
    filterAssetId(resData, value) {
      let adDoor = false;
      let roadGate = false;
      for (let key of this.arrMedia) {
        if (key.mediaForm.assetId === value) {
          for (let rKey of resData) {
            if (rKey.mId !== key.mediaForm.mid) {
              key.isAssetIdError = true;
              key.assetIdCommentData.mediaName = rKey.mediaName;
              key.assetIdCommentData.resName = rKey.resName;
              key.assetIdCommentData.updateTime = rKey.createTime;
              adDoor = true;
            } else {
              key.isAssetIdError = false;
            }
          }
        }
      }
      for (let key of this.roadGateMedia) {
        if (key.roadGateForm.assetId === value) {
          for (let rKey of resData) {
            if (rKey.mId !== key.roadGateForm.mid) {
              key.isAssetIdError = true;
              key.assetIdCommentData.mediaName = rKey.mediaName;
              key.assetIdCommentData.resName = rKey.resName;
              key.assetIdCommentData.updateTime = rKey.createTime;
              roadGate = true;
            } else {
              key.isAssetIdError = false;
            }
          }
        }
      }
      if (adDoor || roadGate) {
        return true;
      } else {
        return false;
      }
    },

    // 选择资源类型时的修改资源字段显示
    selectRec(val) {
      this.recForm.floorType = "";
      if (val === "1") {
        // 社区
        this.rt_village = true;
        this.floorType = this.village;
      } else if (val === "2") {
        // 写字楼
        this.rt_village = false;
        this.floorType = this.officeBuilding;
      }
    },

    //添加资源媒体
    createRes() {
      console.log(this.arrMedia);
      this.recForm.uid = this.sessionData.uID;
      this.recForm.latlng = this.recForm.lat + ";" + this.recForm.lng;
      console.log("this.recForm", this.recForm);
      for (let i = 0; i < this.arrMedia.length; i++) {
        console.log("arrMedia", i, this.arrMedia[i].mediaForm);
      }
      let recObj = {
        uid: this.recForm.uid,
        rid: Number(this.recForm.region),
        ta: this.recForm.business, // 所属商圈
        rt: this.recForm.rt, // 资源类型
        resName: this.recForm.resName, // 资源名称
        resaddr: this.recForm.resaddr, // 资源地址
        // 这里的lat为经度、lng为纬度(与生活中的lng*lat经纬度字符标识刚好相反)
        latlng: this.recForm.latlng, // 经纬度 重庆:9.61;106.47  北京:116.46;39.92 广州: 113.27;23.13  上海:121.29;31.11 深圳:113.46;22.27
        ct: this.recForm.floorType, //楼盘类型
        cd: this.recForm.liveTime, // 入住时间 '2017'
        hp: (this.recForm.buildingPrice * 100).toFixed(0), // 楼盘价格
        fn: this.recForm.buildingNum, // 楼栋数量
        dn: this.recForm.doorwayNum, // 出入口数量
        hn: this.recForm.households, // 小区户数
        pmc: this.recForm.pmcName, // 物业公司
        peopleFlow: this.recForm.peopleFlowrate, //人流量
        carFlow: this.recForm.carFlowrate, //车流量
        parkSpaceNum: this.recForm.carNumber, //车位数
        fullViewUrl: this.recForm.fullViewUrl, // 资源图片

        city: this.resAddres.city,
        district: this.resAddres.area,
        resAlias: this.recForm.resAlias, // 资源别名
        addressAlias: this.recForm.addressAlias, // 地址别名
        description: this.recForm.description, // 描述
        supportingFacilities: this.recForm.supportingFacilities, // 周边配套
        buildingType: this.recForm.buildingType, // 建筑类型
        transportation: this.recForm.transportation, // 交通状况
        floorSpace: this.recForm.floorSpace, // 占地面积
        constructionSpace: this.recForm.constructionSpace, // 建筑面积
        buildingStructure: this.recForm.buildingStructure, // 建筑结构
        greenPercentage: this.recForm.greenPercentage, // 绿化率
        plotRatio: this.recForm.plotRatio, // 容积率
        ownershipPeriod: this.recForm.ownershipPeriod, // 产权年限
        developer: this.recForm.developer, // 开发商
        managementFee: this.recForm.managementFee, // 物业费
        salesOfficeAdd: this.recForm.salesOfficeAdd, // 售楼地址
        preSalePermit: this.recForm.preSalePermit, // 预售许可证
        ownershipType: this.recForm.ownershipType, // 产权性质
        salesPhoneNumber: this.recForm.salesPhoneNumber, // 售楼电话
        discount: this.recForm.discount,
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
            this.resImg.palt = this.recForm.resName + "-" + recData.rID;
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
      if (this.recForm.fullViewUrl) {
        this.recForm.fullViewUrl = this.recForm.fullViewUrl + "," + res[0].pURL;
      } else {
        this.recForm.fullViewUrl = res[0].pURL;
      }
      console.log("this.recForm", this.recForm, this.recForm.fullViewUrl);
    },
    // 删除原资源图片，进行重新选择
    handleRemoveR(file, fileList) {
      console.log("删除或修改了资源图片", file, fileList);
      if (this.recForm.fullViewUrl && file.url) {
        let tempPicArr = this.recForm.fullViewUrl.split(",");
        let resArr = tempPicArr.filter((item) => {
          if (file.response) {
            return file.response[0].pURL != item;
          } else {
            return file.url != item;
          }
        });
        this.recForm.fullViewUrl = resArr.join(",");
      }
    },
    // 资源图片放大
    handlePictureCardPreview_res(file) {
      console.log("资源图片放大", file);
      this.resImgUrl = file.url;
      this.resImgDialog = true;
    },
    // 表单验证 resFrom:资源表单
    submitForm() {
      console.log("校验开始-----------");
      this.submitBtnIsAble = true;
      let timer = setTimeout(() => {
        this.submitBtnIsAble = false;
        clearTimeout(timer);
      }, 500);
      // 资源表单校验
      let validateResArr = [
        "rt",
        "resName",
        "city",
        "region",
        "resaddr",
        "floorType",
        "buildingNum",
        "households",
        "liveTime",
        "lat",
        "lng",
        "pmcName",
        "liftType",
      ];
      let validatesPro = []; //Promise.all要用到的参数, 存放每次请求的Promise对象
      for (let key of validateResArr) {
        let validate = new Promise((resolve, reject) => {
          this.$refs.recForm.validateField(key, (valid) => {
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
      this.$refs["recForm"].resetFields();
    },
    // 清除表单校验
    clearFromValidate() {
      console.log("清除表单校验------");
      let timer = setTimeout(() => {
        this.$refs["recForm"].clearValidate();
        clearTimeout(timer);
      }, 500);
    },
    // 通过点击添加媒体跳转而来直接滚动到底部
    scrollBottom() {
      let timer = setTimeout(() => {
        console.log("来源于点击添加媒体", document.body.scrollHeight); //clientHeight
        window.scrollTo(0, document.body.scrollHeight);
        this.mediaAddFun();
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
          this.recForm.city[0] = recObj.rid.toString().substring(0, 2) + "0000";
          this.recForm.city[1] = recObj.cityId;
          this.handleChange(this.recForm.city);
          this.resAddres.city = recObj.city;
          this.resAddres.area = recObj.cityArea;
          // 获取设置资源信息
          let tempObj = {
            resID: recObj.resID,
            rt: recObj.cType,
            resName: recObj.resName,
            city: this.recForm.city,
            region: recObj.rid.toString(),
            business: recObj.tradingArea,
            resaddr: recObj.resAddress,
            floorType: recObj.houseType,
            doorwayNum: recObj.EntryExitNum,
            buildingNum: recObj.buildingNum,
            households: recObj.HouseNum,
            buildingPrice: recObj.housePrice,
            liveTime: recObj.joinTime, // 入住时间
            pmcName: recObj.pmc, // 物业公司
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
            this.selectRec("2");
          }
          this.recForm = tempObj;
          console.log("recForm", this.recForm);

          if (this.$route.query.add) {
            // console.log('来源于点击添加媒体')
            this.scrollBottom();
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
    // 组装要显示的资源图片
    constructResImg() {
      console.log("资源图片", this.recForm.fullViewUrl);
      if (
        this.recForm.fullViewUrl !== "" &&
        this.recForm.fullViewUrl !== undefined &&
        this.recForm.fullViewUrl !== null
      ) {
        this.recForm.fullViewUrl.split(",").forEach((item, index) => {
          let resImg = { name: "资源图片", url: item };
          this.resUpdata.push(resImg);
        });
      } else {
        let uid = this.sessionData.uID;
        let params = {
          uid: uid,
          token: this.sessionData.token,
          ptype: "restype",
          ptid: this.resData.resID,
        };
        api
          .getApi(this.apiVar.UCAPI + "/GetImg", params)
          .then((res) => {
            console.log("资源图片的信息", res);
            this.resUpdata = [];
            if (res.data.length === 0) {
              console.log("暂时没有该资源的图片");
            } else if (Array.isArray(res.data)) {
              res.data.forEach((item) => {
                let resImg = { name: item.pAlt, url: item.pURL };
                this.resUpdata.push(resImg);
                if (this.recForm.fullViewUrl) {
                  this.recForm.fullViewUrl =
                    this.recForm.fullViewUrl + "," + item.pURL;
                } else {
                  this.recForm.fullViewUrl = item.pURL;
                }
              });
            }
          })
          .catch((err) => {
            console.log("error", err);
          });
      }
    },
    // 修改资源
    postEditMsg() {
      //   uid     int【必填】     UserID
      //     resid   int【必填】     资源ID
      //     rid     int             地区id
      //     ta      String          商圈名称
      //     resName String          资源名称
      //     resaddr String          资源地址
      //     ct      String          楼盘类型
      //     cd      String          入住时间
      //     hp      int             楼盘价格
      //     fn      int             楼栋数量
      //     dn      int             出入口数量
      //     hn      int             小区户数
      let uid = this.sessionData.uID;
      this.recForm.uid = uid;
      // let rID = sessionStorage.getItem('resID')
      let recObj = this.recForm;
      console.log("recObj", recObj);
      let SetResCTObj = {
        resid: this.resData.resID,
        rid: "",
        ta: recObj.business,
        resName: recObj.resName,
        resaddr: recObj.resaddr,
        latlng: recObj.lat + ";" + recObj.lng,
        ct: recObj.floorType,
        cd: recObj.liveTime,
        hp: recObj.buildingPrice * 100,
        fn: recObj.buildingNum,
        dn: recObj.doorwayNum,
        hn: recObj.households,
        pmc: recObj.pmc,
        peopleFlow: recObj.peopleFlowrate,
        carFlow: recObj.carFlowrate,
        parkSpaceNum: recObj.carNumber,
        fullViewUrl: recObj.fullViewUrl || "",
        // 房价网信息
        resAlias: recObj.resAlias || "", // 资源别名
        addressAlias: recObj.addressAlias, // 地址别名
        description: recObj.description || "", // 描述
        supportingFacilities: recObj.supportingFacilities || "", // 周边配套
        buildingType: recObj.buildingType || "", // 建筑类型
        transportation: recObj.transportation || "", // 交通状况
        floorSpace: recObj.floorSpace || "", // 占地面积
        constructionSpace: recObj.constructionSpace || "", // 建筑面积
        buildingStructure: recObj.buildingStructure || "", // 建筑结构
        greenPercentage: recObj.greenPercentage || "", // 绿化率
        ownershipPeriod: recObj.ownershipPeriod || "", // 产权年限
        developer: recObj.developer || "", // 开发商
        // propertyManagement : resData.propertyManagement || '',       // 物业公司
        managementFee: recObj.managementFee || "", // 物业费
        salesOfficeAdd: recObj.salesOfficeAdd || "", // 售楼地址
        preSalePermit: recObj.preSalePermit || "", // 预售许可证
        ownershipType: recObj.ownershipType || "", // 产权性质
        salesPhoneNumber: recObj.salesPhoneNumber, // 售楼电话
        discount: recObj.discount,
      };
      let recDetail = JSON.parse(sessionStorage.getItem("recDetail"));
      // 地区没有修改的时候
      if (recObj.region === recDetail.cityArea) {
        SetResCTObj.rid = recDetail.rid;
      } else {
        SetResCTObj.rid = Number(recObj.region);
      }
      for (let key in SetResCTObj) {
        if (SetResCTObj[key] === undefined || SetResCTObj[key] === null) {
          SetResCTObj[key] = "";
        }
      }
      let params = {
        uid: uid,
        token: this.sessionData.token,
        service: "SetResCT",
        data: SetResCTObj,
      };
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        console.log("修改资源信息", res);
        if (res.data.SysCode == 200200) {
          // 设置资源图片信息
          console.log(
            "m_boolean",
            this.m_boolean,
            "rt_boolean",
            this.rt_boolean
          );
        } else {
          if (res.data.SysCode == 100302 || res.data.MSG === "登陆超时") {
            this.Editloading.close();
          } else {
            sessFun.messageFun("warning", "资源保存失败");
          }
          this.Editloading.close();
        }
      });
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
  margin-right: -6px !important;
  position: relative;
  left: 60px;
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
