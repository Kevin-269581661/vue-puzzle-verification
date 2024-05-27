<template>
  <div>
    <div class="ad_mediaDetail_wrap clearfix">
      <div class="ad_mediaDetail_nav">
        <p><a href="#">媒体管理</a><em> / </em><a href="#">录入媒体</a></p>
      </div>
      <!-- 资源信息mediaMana_content_top-->
      <div class="mediaList_wrap">
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
                <el-form-item label="基本信息" class="baseInfo firstInfo"></el-form-item>
                <el-row :gutter="76" class="from_row">
                    <el-col :span="6">
                        <el-form-item label="资源名称" prop="resName">
                            <el-input
                            v-model="recForm.resName"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                     <!-- <el-col :span="6" class="el_col_box">
                        <el-form-item label="资源名称" prop="resname">
                            <el-autocomplete
                            v-model="recForm.resname"
                            :fetch-suggestions="getResNameByFangJiaWang"
                            placeholder=""
                            :trigger-on-focus="false"
                            @select="changeResName"
                            @blur="blurFun('resname')"
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
                        </el-col> -->
                        <el-col :span="6">
                        <el-form-item label="资源别名" prop="resAlias">
                            <el-input
                            v-model="recForm.resAlias"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="城市" prop="city">
                        <el-cascader
                        v-if="cityOther"
                        :options="cityOptions"
                        v-model="recForm.city"
                        separator="-"
                        :show-all-levels="false"
                        placeholder="请选择城市"
                        filterable
                        @blur="blurFun('city')"
                        @change="handleChange"
                        >
                        </el-cascader>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="区域" prop="region">
                        <el-select
                        v-model="recForm.region"
                        placeholder="请选择区域"
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
                </el-row>
                <el-row :gutter="76" class="from_row">
                    <el-col :span="6">
                        <el-form-item label="街道" prop="street">
                            <el-input
                            v-model="recForm.street"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="地址" prop="resaddr">
                        <el-input
                        v-model="recForm.resaddr"
                        placeholder=""
                        @blur="blurFun('resaddr')"
                        style="width: 100%"
                        class="el-from-item-address"
                        >
                        </el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="地址描述" prop="addressAlias">
                        <el-input
                        v-model="recForm.addressAlias"
                        placeholder=""
                        ></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6" class="col_lng_lat">
                    <div class="lng_lat_map_btn" @click="openBmap">
                        <i class="el-icon-location-outline"></i>
                        地图获取
                    </div>
                    <el-form-item label="经纬度" required class="lng_lat_form_item">
                        <div class="form_item_box_son">
                        <el-form-item prop="lat" class="">
                            <el-input
                            v-model.trim="recForm.lat"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                        </div>
                        <div class="form_item_box_son">
                        <el-form-item prop="lng">
                            <el-input
                            v-model.trim="recForm.lng"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                        </div>
                    </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="76" class="from_row">
                    <el-col :span="6">
                    <el-form-item label="楼盘介绍" prop="description">
                        <el-input
                        type="textarea"
                        v-model="recForm.description"
                        placeholder=""
                        ></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="画像信息" class="baseInfo"></el-form-item>
                <el-row :gutter="76" class="from_row">
                    <el-col :span="6">
                        <el-form-item label="楼盘类型" prop="floorType">
                            <el-select
                            v-model="recForm.floorType"
                            placeholder=""
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
                        <el-form-item label="楼盘价格(元/m²)" prop="buildingPrice">
                            <el-input
                            v-model="recForm.buildingPrice"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="住户数量" prop="households">
                            <el-input
                                v-model="recForm.households"
                                controls-position="right"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="楼栋数量" prop="buildingNum">
                        <el-input
                            v-model="recForm.buildingNum"
                            controls-position="right"
                        ></el-input>
                    </el-form-item>
                    </el-col>
			    </el-row>
                <el-row :gutter="76" class="from_row">
                    <el-col :span="6">
                    <el-form-item label="单元数量" prop="unitCount">
                        <el-input
                        v-model="recForm.unitCount"
                        controls-position="right"
                        ></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="入住年份" prop="liveTime">
                        <el-date-picker
                        v-model="recForm.liveTime"
                        type="year"
                        value-format="yyyy"
                        format="yyyy 年"
                        :editable="false"
                        placeholder=""
                        @blur="blurFun('liveTime')"
                        >
                        </el-date-picker>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="商圈" prop="business" class="right_form_item">
                        <el-input
                        v-model.trim="recForm.business"
                        placeholder=""
                        ></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="6">
                    <el-form-item label="周边配套" prop="supportingFacilities">
                        <el-input
                        type="textarea"
                        v-model="recForm.supportingFacilities"
                        placeholder=""
                        ></el-input>
                    </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="76" class="from_row">
                    <el-col :span="6">
                        <el-form-item label="交通状况" prop="transportation">
                            <el-input
                            type="textarea"
                            v-model="recForm.transportation"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出入口数" prop="doorwayNum">
                            <el-input
                            v-model="recForm.doorwayNum"
                            controls-position="right"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入住率（%）" prop="liveRate">
                            <el-input
                            v-model="recForm.liveRate"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="配套电梯" prop="liftType">

                            <el-select
                                v-model="recForm.liftType"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="(type, index) in ['全部有电梯', '部分有电梯', '全部无电梯']"
                                    :key="index"
                                    :label="type"
                                    :value="type">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="76" class="from_row">
                    <el-col :span="6">
                        <el-form-item label="车位数" prop="carNumber">
                            <el-input
                            v-model="recForm.carNumber"
                            controls-position="right"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="广告限制" prop="notPush" class="right_form_item">
                            <el-select
                                v-model="recForm.notPush"
                                multiple
                                collapse-tags
                                placeholder="请选择广告限制"
                                @change="(value) => changeAdLimit(value, 'basic')"
                            >
                                <el-option
                                    v-for="(limit, index) in adLimit"
                                    :key="index"
                                    :label="limit.label"
                                    :value="limit.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-form-item label="物业信息" class="baseInfo"></el-form-item>
                <el-row :gutter="76" class="from_row">
                    <el-col :span="6">
                        <el-form-item label="开发商" prop="developer">
                            <el-input
                            v-model="recForm.developer"
                            placeholder=""
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="物业公司" prop="pmc">
                            <el-input v-model="recForm.pmc" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="物业联系人" prop="pc">
                            <el-input v-model="recForm.pc" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="物业联系电话" prop="pcp">
                            <el-input v-model="recForm.pcp" placeholder=""></el-input>
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
      <!--媒体一-->
      <div class="mediaList_content">
        <el-tabs v-model="activeMediaType">
          <el-tab-pane v-for="(mediaTypeItem, mediaTypeIndex) in mediaTypeList" :key="mediaTypeIndex" :label="mediaTypeItem.name || '--'" :name="mediaTypeIndex + ''">
            <div class="content_bottom_wrap_box">
              <div
                class="content_bottom_wrap"
                v-for="(mediaItem, mediaIndex) in mediaTypeItem.mediaList"
                :key="mediaIndex"
              >
                <div class="content_bottom_head">
                  <h2>{{ mediaItem.text }}</h2>
                  <div
                    class="media_deleBtn"
                    @click="mediaDelBtnFun(mediaTypeIndex, mediaIndex)"
                    v-if="!mediaItem.mid"
                  >
                    <i class="el-icon-remove"></i>
                  </div>
                </div>
                <div class="content_bottom_form_wrap">
                  <el-form
                    :model="mediaItem.mediaForm"
                    status-icon
                    :rules="mediaRules"
                    :ref="`mediaForm${mediaTypeIndex}${mediaIndex}`"
                    label-width="100px"
                    class="demo-ruleForm"
                  >
                    <el-row :gutter="76" class="from_row">
                      <el-col :span="6" class="el_col_box">
                        <el-form-item label="媒体位置" prop="mediaName"
                          :rules="[{
                            validator: validateMediaName,
                            trigger: ['blur', 'change'],
                            options: {checkMediaTypeIndex: mediaTypeIndex, mediaIndexOfMediaType: mediaIndex}
                          },
                          {
                            required: true,
                            message: '媒体位置不能为空!',
                            trigger: ['blur', 'change'],
                          },
                          { validator: validateSpace, trigger: ['blur', 'change'] },
                          { validator: validateSpecialString, trigger: ['blur', 'change'] },
                          {
                            max: 40,
                            message: '最多只能输入40个字节!',
                            trigger: ['blur', 'change'],
                          }]"
                        >
                          <el-input
                            v-model="mediaItem.mediaForm.mediaName"
                            placeholder="例：东门"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6" class="el_col_box">
                        <el-form-item label="媒体位ID" prop="assetId"
                          ref="ResAssetId"
                          :rules="mediaRules.assetId"
                        >
                          <el-input
                            v-model.trim="mediaItem.mediaForm.assetId"
                            placeholder="例:0034FASF342-X21"
                            :disabled="mediaItem.mediaForm.assetIdBolean"
                          ></el-input>
                        </el-form-item>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          placement="bottom-end"
                          v-show="mediaItem.isAssetIdError"
                        >
                          <div slot="content">
                            <ul style="font-size: 12px; color: #fff">
                              <li>
                                资源：{{ mediaItem.assetIdCommentData.resName }}
                              </li>
                              <li>
                                媒体：{{ mediaItem.assetIdCommentData.mediaName }}
                              </li>
                              <li>
                                创建时间：{{
                                  mediaItem.assetIdCommentData.updateTime
                                }}
                              </li>
                            </ul>
                          </div>
                          <p class="the_same_error">
                            这个媒体位ID已存在 <i class="el-icon-warning"></i>
                          </p>
                        </el-tooltip>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="设备ID" prop="mac">
                          <el-input
                            v-model="mediaItem.mediaForm.mac"
                            placeholder="请输入 mac 码"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="设备类型" prop="doorType">
                          <el-input
                            v-model="mediaItem.mediaForm.doorType"
                            placeholder="例:消防门"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="位置类型" prop="site">
                          <el-select
                            v-model="mediaItem.mediaForm.site"
                            placeholder="请选择位置类型"
                            clearable
                          >
                            <el-option
                              v-for="(siteName, siteIndex) in ['小区大门', '侧门', '楼栋门', '单元门', '室外停车场', '地下停车库', '其他位置']"
                              :key="siteIndex"
                              :label="siteName"
                              :value="siteName"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="楼栋号" prop="buildingName" :rules="mediaRules.buildingName">
                          <el-input
                            v-model.trim="mediaItem.mediaForm.buildingName"
                            placeholder=""
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="单元号" prop="unitName" :rules="mediaRules.unitName">
                          <el-input
                            v-model.trim="mediaItem.mediaForm.unitName"
                            placeholder=""
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="楼层" prop="floor" :rules="mediaRules.floor">
                          <el-input
                            v-model.trim="mediaItem.mediaForm.floor"
                            placeholder=""
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="位置朝向" prop="siteOrientation">
                            <el-select
                                v-model="mediaItem.mediaForm.adSpaceInfo[0].siteOrientation"
                                placeholder="请选择位置朝向"
                                clearable
                            >
                                <el-option
                                    v-for="(item, index) in ['朝内', '朝外']"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="76" class="from_row" v-for="(adSpaceItem, adSpaceIndex) in mediaItem.mediaForm.adSpaceInfo" :key="adSpaceIndex">
                      <el-col :span="6">
                        <el-form-item :label="adSpaceItem.name + '素材尺寸'" required>
                          <div class="form_item_box_son">
                            <el-form-item :prop="`adSpaceInfo[${adSpaceIndex}].adSizeWidth`" class=""
                              :rules="{
                                required: true,
                                type: 'string',
                                message: '不能为空且只能输入数字!',
                                trigger: ['blur', 'change'],
                              }"
                            >
                              <div class="mm">
                                <el-input
                                  v-model="adSpaceItem.adSizeWidth"
                                  placeholder="宽度"
                                ></el-input>
                                <span>mm</span>
                              </div>
                            </el-form-item>
                          </div>
                          <div class="form_item_box_son">
                            <el-form-item
                              :prop="`adSpaceInfo[${adSpaceIndex}].adSizeHeight`"
                              :rules="{
                                required: true,
                                type: 'string',
                                message: '不能为空且只能输入数字!',
                                trigger: ['blur', 'change'],
                              }"
                            >
                              <div class="mm">
                                <el-input
                                  v-model="adSpaceItem.adSizeHeight"
                                  placeholder="高度"
                                >
                                </el-input>
                                <span>mm</span>
                              </div>
                            </el-form-item>
                          </div>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item :label="adSpaceItem.name + '可视尺寸'" required>
                          <div class="form_item_box_son">
                            <el-form-item :prop="`adSpaceInfo[${adSpaceIndex}].adViewSizeWidth`"
                              :rules="{
                                required: true,
                                type: 'string',
                                message: '不能为空且只能输入数字!',
                                trigger: ['blur', 'change'],
                              }"
                            >
                              <div class="mm">
                                <el-input
                                  v-model="adSpaceItem.adViewSizeWidth"
                                  placeholder="宽度"
                                ></el-input>
                                <span>mm</span>
                              </div>
                            </el-form-item>
                          </div>
                          <div class="form_item_box_son">
                            <el-form-item :prop="`adSpaceInfo[${adSpaceIndex}].adViewSizeHeight`"
                              :rules="{
                                required: true,
                                type: 'string',
                                message: '不能为空且只能输入数字!',
                                trigger: ['blur', 'change'],
                              }"
                            >
                              <div class="mm">
                                <el-input
                                  v-model="adSpaceItem.adViewSizeHeight"
                                  placeholder="高度"
                                ></el-input>
                                <span>mm</span>
                              </div>
                            </el-form-item>
                          </div>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="76" class="from_row">
                      <el-col :span="6">
                          <el-form-item label="备注" prop="mRemark">
                              <el-input type="textarea" v-model.trim="mediaItem.mediaForm.mRemark" placeholder="请填写备注信息"></el-input>
                          </el-form-item>
                      </el-col>

                      <!-- <el-col :span="6">
                        <el-form-item label="媒体预览图:" prop="mImg">
                          <div class="upload_img_wrap">
                            <el-upload
                              :disabled="isUpload"
                              :action="doUpload"
                              list-type="picture-card"
                              :limit="1"
                              :file-list="mediaItem.mediaForm.updataImg"
                              :before-upload="beforeUpload_ad"
                              :on-success="(res) => adUploadSuccess(res, mediaItem)"
                              :on-remove="adHandleRemove"
                              :on-preview="handlePictureCardPreview"
                              @click.native="saveImgInfo(mediaItem.text)"
                            >
                              <i class="el-icon-plus"></i>
                            </el-upload>
                          </div>
                        </el-form-item>
                      </el-col> -->
                    </el-row>
                  </el-form>
                </div>
              </div>
              <div v-if="!isPay && (!pathHaveEdit || mediaTypeIdsOfCompany.includes(mediaTypeItem.id))" class="add_media_btn" @click="mediaAddFun(mediaTypeItem)">+ 新增媒体</div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="content_bottom_btn">
          <el-button
            type="primary"
            class="create"
            :disabled="submitBtnIsAble"
            @click="submitForm()"
          >
            {{ pathHaveEdit ? "保存" : "创建" }}
          </el-button>
          <el-button plain class="cancel" @click="clearData"> 取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="mediaImgDialogVisible" :title="mediaImgTitle">
      <div class="block mediaImg">
        <el-carousel height="550px">
          <el-carousel-item v-for="(src, imgIndex) in mediaImgSrc" :key="imgIndex">
            <img :src="src" alt="媒体图片" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
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
        <span style="font-size: 14px; color: #333333; display: inline-block; margin-top: 10px; ">
            当前选择信息:
            城市:{{ searchResData.city || "--" }}
            区域:{{ searchResData.district || "--" }}
            名称:{{ searchResData.title || "--" }}
            经纬度:{{ searchResData.lng + "," + searchResData.lat }}
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
import {
  Form,
  FormItem,
  Select,
  Cascader,
  Option,
  Button,
  Input,
  Table,
  TableColumn,
  DatePicker,
  Dialog,
  Upload,
  InputNumber,
  MessageBox,
  Message,
} from "element-ui";
import api from "../../api/api";
import areaPackageNew from "../../commonFun/areaPackage_new";
import areaToTextNew from "../../commonFun/areaToText_new";
import sessFun from "../../commonFun/sessFun.js";

export default {
  name: "mediaInput",
  components: {
    elForm: Form,
    elFormItem: FormItem,
    elButton: Button,
    elSelect: Select,
    elOption: Option,
    elCascader: Cascader,
    elInput: Input,
    elTable: Table,
    elTableColumn: TableColumn,
    elDatePicker: DatePicker,
    elDialog: Dialog,
    elUpload: Upload,
    elInputNumber: InputNumber,
  },
  data() {
    //媒体位ID
    let validateAssetId = (rule, value, callback) => {
      let reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
      if (reg.test(value)) {
        callback(new Error("只能输入数字字母符号!"));
      } else {
        callback();
      }
    };
    let validateNum = (rule, value, callback) => {
      if (value !== "" && !Number.isInteger(value)) {
        callback(new Error("只能输入整数值!"));
      } else {
        if (value < 1 || value > 26) {
          callback(new Error("最少投1面，最多可投26面!"));
        } else {
          callback();
        }
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
        console.error(rule, value);
        callback(new Error("只能输入数字!"));
      } else {
        if (value > 9999999) {
          callback(new Error("不得大于9999999!"));
        } else {
          callback();
        }
      }
    };

    // let validateFloor = (rule, value, callback) => {
    //   let reg = /^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/;
    //   if (value !== "" && !reg.test(value)) {
    //     console.error(rule, value);
    //     callback(new Error("只能输入数字!"));
    //   } else {
    //     if (value > 9999999) {
    //       callback(new Error("不得大于9999999!"));
    //     } else {
    //       callback();
    //     }
    //   }
    // }

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
      isPay: 1,
      isUpload: true,
      assetIdBolean: false,
      dialogImageUrl: "", //缩略图
      dialogVisible: false,
      activeMediaType: "0",
      mediaTypeList: [],
      mediaTypeIdsOfCompany: [],
      // 广告限制下拉
      adLimit: [],
      // 判断资源名称是否有重名
      isResError: false,
      // 资源名称重名信息
      resCommentData: {
        resName: "",
        mediaNum: "",
        updateTime: "",
      },
      //资源表单
      recForm: {
        // 基本信息
        resname: "", // 资源名称
        resAlias: "", // 资源别名
        city: [], // 城市
        region: "", // 区域
        street: "", // 街道
        resaddr: "", // 地址
        addressAlias: "", // 地址描述
        lat: "", // 经度
        lng: "", // 纬度
        description: "", // 楼盘介绍
        // 画像信息
        floorType: "", // 楼盘类型
        buildingPrice: "", // 楼盘价格
        households: "", // 住户数量
        buildingNum: "", // 楼栋数量
        liveTime: "", // 入住年份
        business: "", // 商圈
        unitCount: "", // 单元数量
        supportingFacilities: "", // 周边配套
        transportation: "", // 交通状况
        doorwayNum: "", // 出入口数
        liveRate: "", // 入住率
        liftType: "", // 配套电梯
        carNumber: "", // 车位数
        notPush: [], // 广告限制
        // 物业信息
        developer: "", // 开发商
        pmc: "", // 物业公司
        pc: "", // 物业联系人（propertyContacts）
        pcp: "", // 物业联系电话（propertyContactsPhone）
        // 小区全貌图
        fullViewUrl: "", // 资源图片

        // ownershipPeriod: "", // 产权年限
        // buildingType: "", // 建筑类型
        // floorSpace: "", // 占地面积
        // constructionSpace: "", // 建筑面积
        // plotRatio: "", // 容积率
        // buildingStructure: "", // 建筑结构
        // greenPercentage: "", // 绿化率
        // managementFee: "", // 物业费
        // salesOfficeAdd: "", // 售楼地址
        // preSalePermit: "", // 预售许可证
        // ownershipType: "", // 产权性质
      },
      // 市区域地址获取经纬度
      resAddres: { city: "", area: "" },
      recRules: {
        // 1、画像信息
        // 资源名称
        resName: [
          {
            required: true,
            message: "资源名称不能为空!",
            trigger: ["blur", "change"],
          },
          { validator: validateSpace, trigger: ["blur", "change"] },
          { validator: validateSpecialString, trigger: ["blur", "change"] },
          { max: 40, message: "最多只能输入40个字节", trigger: "change" },
        ],
        // resname: [
        //   {
        //     required: true,
        //     message: "资源名称不能为空!",
        //     trigger: ["blur", "change"],
        //   },
        //   { validator: validateSpace, trigger: ["blur", "change"] },
        //   { validator: validateSpecialString, trigger: ["blur", "change"] },
        //   { validator: this.isHaveCommenName, trigger: "blur" },
        //   { max: 40, message: "最多只能输入40个字节", trigger: "change" },
        // ],
        // 资源别名
        resAlias: [{ required: false, max: 40, message: "最多只能输入40个字符!", trigger: "blur" }],
        // 城市
        city: [{ required: true, message: "请选择所属城市!", trigger: "change" }],
        // 区域
        region: [{ required: true, message: "请选择所属区域!", trigger: ["blur", "change"]}],
        // 街道
        street: [{ required: false, max: 40, message: "最多只能输入40个字符!", trigger: "blur" }],
        // 地址
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
        // 地址描述
        addressAlias: [
          { validator: validateSpace, trigger: "blur" },
          {
            required: false,
            min: 0,
            max: 40,
            message: "最多只能输入40个字节!",
            trigger: "change",
          },
        ],
        // 经度
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
        // 纬度
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
        // 楼盘介绍
        description: [{ required: false, max: 1000, message: "最多只能输入1000个字符!", trigger: "blur" }],

        // 2、画像信息
        // 楼盘类型
        floorType: [{ required: true, message: "请选择楼盘类型!", trigger: "change" }],
        // 楼盘价格
        buildingPrice: [
            { required: true, message: "楼盘价格不能为空!", trigger: ["blur", "change"],},
            { validator: validatePrice, trigger: "change" },
        ],
        // 住户数量
        households: [
          { required: true, message: "住户数量不能为空!", trigger: ["blur", "change"],},
          { validator: validatePrice, trigger: "change" },
        ],
        // 楼栋数量
        buildingNum: [
            { required: true, message: "楼栋数量不能为空!", trigger: ["blur", "change"],},
            { validator: validatePrice, trigger: "change" },
        ],
        // 单元数量
        unitCount: [{ required: false, validator: validatePrice, trigger: ["blur"] },],
        // 入住年份
        liveTime: [ { required: true, message: "请选择年份!", trigger: "change" }],
        // 商圈
        business: [
          { validator: validateSpace, trigger: "blur" },
          {
            required: false,
            min: 0,
            max: 40,
            message: "最多只能输入40个字节!",
            trigger: "change",
          },
        ],
        // 周边配套
        supportingFacilities: [{ required: false, max: 1000, message: "最多只能输入1000个字符!", trigger: ["blur", "change"] }],
        // 交通情况
        transportation: [{ required: false, max: 250, message: "最多只能输入250个字符!", trigger: ["blur", "change"] }],
        // 出入口数
        doorwayNum: [{ required: false, validator: validatePrice, trigger: ["blur", "change"] }],
        // 入住率
        liveRate: [{  required: false, validator: validateGreenP, trigger: ["blur", "change"] }],
        // 配套电梯
        liftType: [{ required: false, max: 40, message: "最多只能输入40个字符!", trigger: ["blur", "change"] }],
        // 车位数
        carNumber: [{ required: false, validator: validatePrice, trigger: ["blur"] }],
        // 广告限制

        // 3、物业信息
        // 开发商
        developer: [{ required: false, max: 40, message: "最多只能输入40个字符!", trigger: ["blur", "change"] }],
        // 物业公司
        pmc: [{ required: false, max: 40, message: "最多只能输入40个字符!", trigger: ["blur", "change"] }],
        // 物业联系人
        pc: [{ required: false, max: 40, message: "最多只能输入40个字符!", trigger: ["blur", "change"] }],
        // 物业联系电话
        pcp: [{ required: false, max: 40, message: "最多只能输入40个字符!", trigger: ["blur", "change"] }],
      },
      assetIdRules: [
        { validator: validateAssetId, trigger: "blur" },
        { max: 40, message: "最多只能输入40个字节!", trigger: ["blur", "change"] },
      ],
      mediaRules: {
        assetId: [
          {
            required: true,
            message: "媒体位ID不能为空!",
            trigger: ["blur", "change"],
          },
          { validator: validateAssetId, trigger: "change" },
          { validator: this.validateAssetTag, trigger: "blur" },
          {
            max: 40,
            message: "最多只能输入40个字节!",
            trigger: ["blur", "change"],
          },
        ],
        buildingName: [{ required: false, max: 40, message: "最多只能输入40个字符!", trigger: "blur" },],
        unitName: [{ required: false, max: 40, message: "最多只能输入40个字符!", trigger: "blur" },],
        // floor: [{ required: false, validator: validateFloor, trigger: ["blur"] }]
      },
      recFormImg: "", // 资源图片
      mediaFormImg: "", // 媒体图片
      cityOptions: [], //城市数组
      regionOpt: [], // 地区
      floorType: [
        // 显示-楼盘类型或写字楼类型  普通住宅  别墅 商住
        { label: "住宅", value: "住宅" },
        { label: "写字楼", value: "写字楼" },
        { label: "别墅", value: "别墅" },
        { label: "商住楼", value: "商住楼" },
        { label: "公共场所", value: "公共场所" },
      ],

      selectedOptions: [], // 城市默认选项
      pathHaveEdit: false, // 新建/编辑
      mediaImg_title: "", // 媒体图片对应的媒体信息
      rgImg_title: "", // 道闸对应的媒体信息
      mediaImg: {
        // 媒体图片
        uid: JSON.parse(sessionStorage.getItem("session_data")).uID,
        pid: "", // 图片id
        palt: "", // 图片标题
        ptype: "", // 关联类型
        ptid: "", // 关联类型对应唯一ID
        ptp: "", // 关联类型区分属性
      },
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
      updataMedia: [],
      mediaIndex: 0, // 当选择广告限制是记录下媒体的下标
      Editloading: true, // 提交时的loading
      throwCity: "", // 用户权限不为全国时，根据uWho确定可选城市
      cityOther: true, // 默认显示全国省份城市
      resImgDialog: false, // 资源图片，大图
      resImgUrl: "", // 上传成功后的url地址，用于显示大图
      resData: { resID: "" }, // 创建资源成功，保存返回来的数据
      sessionData: sessFun.getSess(),
      submitBtnIsAble: false, // 防止多次点击
      mediaADImg: [], // 广告门媒体图片
      mediaImgDialogVisible: false, // 媒体图片放大的模态框
      mediaImgSrc: [], // 媒体图片放大时图片链接
      mediaImgTitle: "", // 当前图片的媒体位置
      mediaLevel: [
        // 媒体等级
        { label: "A级", value: "A" },
        { label: "B级", value: "B" },
        { label: "C级", value: "C" },
      ],
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
      // 拆除信息
      dismantleInfo: "",
      // 拆除提示标签
      isShowTag: true,
      // 修改媒体状态时的行数据
      rowData: {},
      changeBeforMediaState: "",
      customPermission: {}, //巡点权限
      fangJiaWangPrivateCity: [], // 房价网权限城市
    };
  },
  created() {
    this.getFangJiaWangCity();
    if (this.$route.path.indexOf("media/mediaEdit") !== -1) {
      this.pathHaveEdit = true;
      this.getMediaTypesOfCompanyAndRes();
      this.getMediaTypesOfCompany(true);
    } else {
      this.pathHaveEdit = false;
      this.getMediaTypesOfCompany();
      sessionStorage.removeItem("recDetail");
      sessionStorage.removeItem("mediaTypeObj");
    }
  },
  mounted: function () {
    this.customPermission = this.sessionData.customPermission;
    this.resUpdata = [];
    this.ShowRegion();
    this.getADLimit(); // 获取广告限制列表
    this.requestIsPay();
  },
  methods: {
    // TODO: vuex持有isPay
    requestIsPay() {
      api
        .getApi("/addsp/api/v1/company/isPay", {
          asrID: this.sessionData.asrID,
        })
        .then((res) => {
          if (res.data.SysCode === 200200 && res.data.data === false) {
            this.isPay = 0;
          }
        });
    },
    validateSpace(rule, value, callback) {
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
    },
    validateSpecialString(rule, value, callback) {
      let reg = /[\/]/;
      if (reg.test(value)) {
        callback(new Error("不可填写特殊符号!"));
      } else {
        callback();
      }
    },
    // 获取公司和小区媒体类型的集合
    getMediaTypesOfCompanyAndRes() {
      api
        .getApi("/addsp/api/v1/mediaType/listCompanyAllMediaTypeDetails")
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let tempMediaTypeList = res.data.data || [];
            tempMediaTypeList.forEach((item, index) => {
              item.ADTitleIndex = 0;
              item.mediaList = [];
            });
            this.mediaTypeList = tempMediaTypeList;
            this.editFun();
          } else {
            Message.warning(res.data.MSG || "媒体类型集合获取失败！");
          }
        });
    },
    // 获取公司媒体类型列表
    getMediaTypesOfCompany(editFlag) {
      api
        .getApi("/addsp/api/v1/mediaType/listCompanyMediaTypeDetails")
        .then((res) => {
          if (res.data.SysCode == 200200) {
            if (editFlag) {
              // 编辑时，公司当前的媒体类型可以增加媒体，过往遗留媒体只能编辑
              this.mediaTypeIdsOfCompany = (res.data.data || []).map(
                (item) => item.id
              );
            } else {
              let resultArr = res.data.data || [];
              resultArr.forEach((item, index) => {
                item.ADTitleIndex = 0;
                item.mediaList = [];
              });
              this.mediaTypeList = resultArr;
              console.log('媒体列表mediatypelist', resultArr);
            }
          } else {
            Message.warning(res.data.MSG || "公司权限内媒体类型获取失败！");
          }
        });
    },
    getFangJiaWangCity() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetResSearchCity",
        data: { asrID: this.sessionData.asrID },
      };
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        if (res.data.SysCode == 200200) {
        //   console.log("房价网权限城市", res);
          this.fangJiaWangPrivateCity = res.data.data || [];
        } else {
          Message.warning(res.data.MSG);
        }
      });
    },
    // 获取广告限制列表
    getADLimit() {
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetNotPush",
        data: {},
      };
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        // console.log("广告限制列表", res);
        if (res.data.SysCode == 200200) {
          let limit = res.data.data;
          let limitArr = [];
          for (let i = 0; i < limit.length; i++) {
            if (i === 0) {
              let NoLimit = { value: "不限", label: "不限" };
              limitArr.push(NoLimit);
            }
            let limitObj = { value: limit[i].nTitle, label: limit[i].nTitle };
            limitArr.push(limitObj);
          }
          this.adLimit = limitArr;
        } else {
          Message.warning(res.data.MSG);
        }
      });
    },
    //获取区域
    getRegion(val) {
    //   console.log("val", val);
      for (let key of this.regionOpt) {
        if (key.value == val) {
          this.resAddres.area = key.label;
        }
      }
    },
    // 远程获取房价网的小区名称
    getResNameByFangJiaWang(queryString, callback) {
      let flag = this.fangJiaWangPrivateCity.some((item) => {
        return item.cityId == this.recForm.city[this.recForm.city.length - 1];
      });
      if (!flag) {
        return;
      }
      if (queryString) {
        if (this.resAddres.city) {
          let params = {
            city: this.resAddres.city, // 城市
            keyword: queryString,
            max: 20,
          };
          api
            .postApi(this.apiVar.QADNAPI + "/ResAutoComplete", params)
            .then((res) => {
            //   console.log("远程获取房价网的小区名称res", res);
              if (res.data.code === "200200" || res.data.msg === "success") {
                if (res.data.data.code == "200" || res.data.data.msg === "ok") {
                  let results = [];
                  for (let key of res.data.data.result) {
                    results.push({
                      value: key.name,
                      district: key.district,
                      address: key.address,
                    });
                  }
                  callback(results);
                } else {
                  sessFun.messageFun("warning", res.data.data.msg);
                  callback([]);
                }
              } else {
                sessFun.messageFun("warning", res.data.msg);
                callback([]);
              }
            });
        } else {
          sessFun.messageFun("warning", "请先选择社区所在的城市");
        }
      } else {
        callback([]);
      }
    },
    // 根据选择的小区获取所在区域
    changeResName(item) {
    //   console.log(item);
      for (let key of this.regionOpt) {
        if (key.label.includes(item.district)) {
          this.recForm.region = key.value;
          this.resAddres.area = key.label;
          break;
        }
      }
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
        this.recForm.resname !== "" &&
        this.resAddres.area !== "" &&
        this.resAddres.city !== ""
      ) {
        let params = {
          // uid: this.sessionData.uID,
          // token: this.sessionData.token,
          city: this.resAddres.city,
          district: this.resAddres.area,
          name: this.recForm.resname,
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
      MessageBox.confirm(ii, "", {
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
          this.recForm.resName = obj.resName
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
          this.recForm.pmc = obj.propertyManagement || ""; // 物业公司
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
        this.recForm.resname &&
        this.recForm.resaddr
      ) {
        let params = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          address:
            this.resAddres.city +
            this.resAddres.area +
            this.recForm.resname +
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
    //   console.log("this.resMap", this.resMap);
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
        if (that.recForm.resname) {
          that.searchResName = that.recForm.resname;
          that.searchFun();
        }
        that.mapLoading = false;
      });
    },
    // 地图获取经纬度
    searchFun() {
    //   console.log(this.searchResName, "百度地图搜索", this.recForm.resname);
      let lnglat = "";
      let that = this;
      let options = {
        renderOptions: {
          map: this.resMap,
          autoViewport: false,
        },
        onSearchComplete: function (results) {
        //   console.log("2results", results);
          // 判断状态是否正确
          if (local.getStatus() == 0) {
            // console.log(results.getPoi(0)); // 这就是我们想要的地址
            that.searchResData.city = results.getPoi(0).city;
            that.searchResData.title = results.getPoi(0).title;
            let point = results.getPoi(0).point;
            lnglat = results.getPoi(0).point;
            // console.log("point", point, that.searchResData);
            that.getResDataInfoByPoint(point);
          } else {
            console.log("没有搜索到该地址！");
          }
        },
        onMarkersSet: function (pois) {
          // 给创建的标注添加点击事件
          that.markerArr = pois;
          for (let key of pois) {
            key.marker.addEventListener("click", that.showInfo);
          }
        },
      };
      let local = new BMap.LocalSearch(this.resMap, options);
      local.search(this.resAddres.city + this.searchResName);
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
    //   console.log("坐标", point);
      let geoc = new BMap.Geocoder();
      let that = this;
      geoc.getLocation(point, function (rs) {
        // console.log("根据坐标获取省市区、地址", rs);
        let addComp = rs.addressComponents;
        // console.log(
        //   addComp.province +
        //     "- " +
        //     addComp.city +
        //     ", " +
        //     addComp.district +
        //     "- " +
        //     addComp.street +
        //     "- " +
        //     addComp.streetNumber
        // );
        that.searchResData.province = addComp.province;
        that.searchResData.city = addComp.city;
        that.searchResData.district = addComp.district;
        that.searchResData.lat = point.lat;
        that.searchResData.lng = point.lng;
        // console.log(that.searchResData, point.lat, point.lng);
      });
    },
    // 地图选择的经纬度
    addLatLngByBmap() {
      // lat:经度  lng:纬度
      this.recForm.lat = this.searchResData.lng;
      this.recForm.lng = this.searchResData.lat;
      this.mapVisible = false;
    },
    // 广告限制，当选择为不限时
    changeAdLimit(val, type, mediaItem) {
    //   console.log('value, mediaItem', val, mediaItem)
        let valArr = val
        for (let i = 0; i < valArr.length; i++) {
            if (valArr[i] === '不限') {
                if(type === 'basic') {
                    this.recForm.notPush = []
                }
                if(type === 'media') {
                    mediaItem.mediaForm.adLimit = []
                }
            }
        }
        // if (val[0] === '不限') {
        //     this.recForm.notPush = ""
        // }
    },
    //新增媒体面板
    mediaAddFun(mediaTypeItem) {
      let tempMediaTypeItem = JSON.parse(JSON.stringify(mediaTypeItem));
      let tempMedia = {
        text: (tempMediaTypeItem.name || "媒体") + ++mediaTypeItem.ADTitleIndex,
        isAssetIdError: false, // 资源编号重名信息
        assetIdCommentData: {
          // 资源编号重名信息
          resName: "",
          mediaName: "",
          updateTime: "",
        },
        mediaForm: {
          adSpaceInfo: tempMediaTypeItem.adSpaceConfig || [],
          mediaName: "",
          assetId: "",
          doorType: "",
          mImg: "",
          updataImg: [],
          adDoorLevel: "",
          site: "",
          mRemark: '',
          adLimit: [],
          mac: "",
          buildingName: "",
          unitName: "",
          floor: "",
          siteOrientation: "",
        },
      };
      mediaTypeItem.mediaList.push(tempMedia);
    },
    // 删除指定下标媒体面板
    mediaDelBtnFun(mediaTypeIndex, mediaIndex) {
      this.mediaTypeList[mediaTypeIndex].mediaList.splice(mediaIndex, 1);
      // 修改面板title标签, 删除最后不用重命名
      if (mediaIndex < this.mediaTypeList[mediaTypeIndex].mediaList.length) {
        for (
          let i = 0;
          i < this.mediaTypeList[mediaTypeIndex].mediaList.length;
          i++
        ) {
          this.mediaTypeList[mediaTypeIndex].mediaList[i].text =
            (this.mediaTypeList[mediaTypeIndex].name || "媒体") + (i + 1);
        }
      }
      this.mediaTypeList[mediaTypeIndex].ADTitleIndex--;
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
    //   console.log("handleChange", value);
      let cityRID = value[1];
      let cityName = areaToTextNew.toTextCity(cityRID);
      this.resAddres.city = cityName;
      let regionArr = areaPackageNew.findArea(cityRID);
    //   console.log(cityName, "获取选中城市的区域", regionArr);
      let region = [];
      for (let i = 0; i < regionArr.length; i++) {
        let obj = { label: regionArr[i].rName, value: regionArr[i].rID };
        region.push(obj);
      }
      this.regionOpt = region;
    //   console.log("this.regionOpt", this.regionOpt);
    },
    // 资源输入框和下拉框失去光标
    blurFun(name) {
      // 手动触发校验
      this.$refs.recForm.validateField(name, (valid) => {
        if (!valid) {
          console.log("校验通过");
        } else {
          console.log("校验不通过");
        }
      });
    },
    // 按所属公司的城市区域检查是否有重复的资源名称
    isHaveCommenName(rule, value, callback) {
      if (
        this.recForm.resname !== "" &&
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
            name: this.recForm.resname,
          },
        };
        api.postApi_new(this.apiVar.Media, params).then((res) => {
        //   console.log("资源名称查重res", res);
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
    //媒体位ID校验去重
    validateAssetTag(rule, value, callback) {
    //   console.log("_________媒体位ID是否重复_________", value);
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetMediaResInfo",
        data: {
          assetTag: value,
          asrId: this.sessionData.asrID,
        },
      };
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        if (res.data.SysCode == 200200) {
          let resData = res.data.data;
        //   console.log("小区信息", this.recForm);
          if (resData.length) {
            // 对比数据库资产id
            let flag = this.filterAssetId(resData, value);
            if (flag) {
              callback(new Error("已存在重复的媒体位id"));
            } else {
              callback();
            }
          } else {
            // 对比当前页面中所有媒体的资产id
            let flag = this.filterlocalAssetId(value);
            if (flag) {
              callback(new Error("这个媒体位ID已在该小区内存在!"));
            } else {
              callback();
            }
          }
        } else {
          sessFun.messageFun("warning", res.data.MSG);
        }
      });
    },
    // 接口返回为空时校验当前是否有重复的
    filterlocalAssetId(value) {
      let result = 0;
      const mediaTypeLength = this.mediaTypeList.length;
      for (
        let mediaTypeIndex = 0;
        mediaTypeIndex < mediaTypeLength;
        mediaTypeIndex++
      ) {
        let tempMediaList = this.mediaTypeList[mediaTypeIndex].mediaList;
        let mediaLength = tempMediaList.length;
        for (let mediaIndex = 0; mediaIndex < mediaLength; mediaIndex++) {
          let mediaItem = tempMediaList[mediaIndex];
          if (mediaItem.mediaForm.assetId === value) {
            result += 1;
            mediaItem.isAssetIdError = false;
          }
        }
      }
      return result >= 2;
    },
    // 判断同资源下媒体位ID是否重复
    filterAssetId(resData, value) {
      let result = false;
      const mediaTypeLength = this.mediaTypeList.length;
      for (
        let mediaTypeIndex = 0;
        mediaTypeIndex < mediaTypeLength;
        mediaTypeIndex++
      ) {
        let tempMediaList = this.mediaTypeList[mediaTypeIndex].mediaList;
        let mediaLength = tempMediaList.length;
        for (let mediaIndex = 0; mediaIndex < mediaLength; mediaIndex++) {
          let mediaItem = tempMediaList[mediaIndex];
          if (mediaItem.mediaForm.assetId === value) {
            for (let resItem of resData) {
              if (resItem.mId !== mediaItem.mid) {
                mediaItem.isAssetIdError = true;
                mediaItem.assetIdCommentData.mediaName = resItem.mediaName;
                mediaItem.assetIdCommentData.resName = resItem.resName;
                mediaItem.assetIdCommentData.updateTime = resItem.createTime;
                result = true;
              } else {
                // 编辑情况下
                mediaItem.isAssetIdError = false;
              }
            }
          }
        }
      }
      return result;
    },
    // 媒体位置校验去重
    validateMediaName(rule, value, callback, source, options) {
      const checkMediaTypeIndex = rule.options.checkMediaTypeIndex;
      const mediaIndexOfMediaType = rule.options.mediaIndexOfMediaType;
      const mediaTypeLength = this.mediaTypeList.length;
      if (checkMediaTypeIndex >= 0 && checkMediaTypeIndex < mediaTypeLength) {
        let result = 0;
        let tempMediaList = this.mediaTypeList[checkMediaTypeIndex].mediaList;
        let mediaLength = tempMediaList.length;
        const currentMediaItem = tempMediaList[mediaIndexOfMediaType]
        const { mediaForm: currentMediaForm = {} } = currentMediaItem
        const { doorType: currentDoorType = '', mediaName } = currentMediaForm
        for (let mediaIndex = 0; mediaIndex < mediaLength; mediaIndex++) {
          let mediaItem = tempMediaList[mediaIndex];
          if (mediaItem.mediaForm.mediaName === mediaName && currentDoorType !== ''  && mediaItem.mediaForm.doorType === currentDoorType) {
            result += 1;
          }
        }
        if (result >= 2) {
          callback(new Error("该媒体位置已存在!"));
        } else {
          callback();
        }
      } else {
        callback(new Error("媒体位置验证失败!"));
      }
    },
    // 广告门输入框和下拉框失去光标
    adDoorBlur(name, index) {
    //   console.log("广告门name", name);
      // 手动触发校验 validateField
      this.$refs.mediaForm[index].validateField(name, (valid) => {
        if (!valid) {
          console.log("校验通过");
        } else {
          console.log("校验不通过");
        }
      });
    },
    //添加资源媒体
    createRes() {
      const addressAlias  = this.recForm.addressAlias || ''
      this.recForm.uid = this.sessionData.uID;
      this.recForm.latlng = this.recForm.lat + ";" + this.recForm.lng;
      let recObj = {
        uid: this.recForm.uid,
        rid: Number(this.recForm.region),
        // 基本信息
        resname: this.recForm.resName, // 资源名称
        resAlias: this.recForm.resAlias || '', // 资源别名
        city: this.resAddres.city, // 城市
        district: this.resAddres.area, // 区域
        street: this.recForm.street || '', // 街道
        resaddr: this.recForm.resaddr, // 地址
        addressAlias: addressAlias, // 地址描述
        // 这里的lat为经度、lng为纬度(与生活中的lng*lat经纬度字符标识刚好相反)
        latlng: this.recForm.latlng, // 经纬度 重庆:9.61;106.47  北京:116.46;39.92 广州: 113.27;23.13  上海:121.29;31.11 深圳:113.46;22.27
        description: this.recForm.description || '', // 楼盘介绍
        // 画像信息
        ct: this.recForm.floorType, //楼盘类型
        hp: (this.recForm.buildingPrice * 100).toFixed(0), // 楼盘价格
        hn: this.recForm.households, // 住户数量
        fn: this.recForm.buildingNum, // 楼栋数量
        cd: this.recForm.liveTime, // 入住年份 '2017'
        ta: this.recForm.business || '', // 商圈
        unitCount: this.recForm.unitCount || 0, // 单元数量
        supportingFacilities: this.recForm.supportingFacilities || '', // 周边配套
        transportation: this.recForm.transportation || '', // 交通状况
        dn: this.recForm.doorwayNum || 0, // 出入口数
        liveRate: this.recForm.liveRate || 0, // 入住率
        liftType: this.recForm.liftType || '', // 配套电梯
        parkSpaceNum: this.recForm.carNumber || 0, //车位数
        // peopleFlow: this.recForm.peopleFlowrate, //人流量
        // carFlow: this.recForm.carFlowrate, // 车流量
        notPush: this.recForm.notPush.join(',') || '', // 广告限制
        // 物业信息
        developer: this.recForm.developer || '', // 开发商
        pmc: this.recForm.pmc || '', // 物业公司
        propertyContacts: this.recForm.pc || '', // 物业联系人
        propertyContactsPhone: this.recForm.pcp || '', // 物业联系电话
        // 小区全貌图
        fullViewUrl: this.recForm.fullViewUrl || '', // 资源图片


        // buildingType: this.recForm.buildingType, // 建筑类型
        // floorSpace: this.recForm.floorSpace, // 占地面积
        // constructionSpace: this.recForm.constructionSpace, // 建筑面积
        // buildingStructure: this.recForm.buildingStructure, // 建筑结构
        // greenPercentage: this.recForm.greenPercentage, // 绿化率
        // plotRatio: this.recForm.plotRatio, // 容积率
        // ownershipPeriod: this.recForm.ownershipPeriod, // 产权年限
        // managementFee: this.recForm.managementFee, // 物业费
        // salesOfficeAdd: this.recForm.salesOfficeAdd, // 售楼地址
        // preSalePermit: this.recForm.preSalePermit, // 预售许可证
        // ownershipType: this.recForm.ownershipType, // 产权性质
        // salesPhoneNumber: this.recForm.salesPhoneNumber, // 售楼电话
        // discount: this.recForm.discount,
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
        //   console.log("资源数据：", res.data);
          let recData = res.data.data;
          this.resData = recData;
          if (res.data.SysCode == 200200) {
            // 设置资源图片信息
            this.resImg.ptid = recData.resID; // 资源图片的ptid就是资源的id
            this.resImg.palt = this.recForm.resname + "-" + recData.rID;
            this.creadMediaFun();
          } else if (
            res.data.SysCode === 100302 ||
            res.data.MSG === "登陆超时"
          ) {
            this.Editloading.close();
          } else {
            this.Editloading.close();
            sessFun.messageFun("warning", res.data.MSG || "资源创建失败！");
          }
        })
        .catch((err) => {
          console.log("新建资源请求错误", err);
          sessFun.messageFun("warning", "新建资源请求异常");
        });
    },
    // 批量创建媒体
    creadMediaFun() {
      let resId = "";
      if (this.pathHaveEdit) {
        resId = sessionStorage.getItem("resID");
      } else {
        resId = this.resData.resID;
      }
      let params = [];
      const mediaTypeLength = this.mediaTypeList.length;
      for (
        let mediaTypeIndex = 0;
        mediaTypeIndex < mediaTypeLength;
        mediaTypeIndex++
      ) {
        let mediaTypeItem = this.mediaTypeList[mediaTypeIndex];
        // console.log(mediaTypeItem);
        let tempMediaList = mediaTypeItem.mediaList;
        let mediaLength = tempMediaList.length;
        mediaTop: for (
          let mediaIndex = 0;
          mediaIndex < mediaLength;
          mediaIndex++
        ) {
          let mediaItem = tempMediaList[mediaIndex];
          let tempMediaForm = mediaItem.mediaForm;
          let tempAdSpaceInfo = [];
          for (
            let adSpaceIndex = 0;
            adSpaceIndex < tempMediaForm.adSpaceInfo.length;
            adSpaceIndex++
          ) {
            let adSpaceItem = tempMediaForm.adSpaceInfo[adSpaceIndex];
            let {
              adSizeWidth,
              adSizeHeight,
              adViewSizeWidth,
              adViewSizeHeight,
              id: adSpaceId,
              siteOrientation
            } = adSpaceItem;
            if (
              adSizeWidth &&
              adSizeHeight &&
              adViewSizeWidth &&
              adViewSizeHeight &&
              adSpaceId
            ) {
              tempAdSpaceInfo.push({
                adSpaceId,
                adSizeWidth,
                adSizeHeight,
                adViewSizeWidth,
                adViewSizeHeight,
                siteOrientation
              });
            } else {
              break mediaTop;
            }
          }
          if (tempAdSpaceInfo.length === tempMediaForm.adSpaceInfo.length) {
            // 单个媒体下所有广告位验证通过
            let obj = {
              resId,
              name: tempMediaForm.mediaName || "",
              mediaTypeId: mediaTypeItem.id,
              assetTag: tempMediaForm.assetId,
              deviceType: tempMediaForm.doorType || "",
              site: tempMediaForm.site || "",
              mRemark: tempMediaForm.mRemark,
              mediaPicture: tempMediaForm.mImg || "",
              adSpaceInfo: tempAdSpaceInfo,
              notPush: tempMediaForm.adLimit.join(','),
              mac: tempMediaForm.mac || "",
              buildingName: tempMediaForm.buildingName || "",
              unitName: tempMediaForm.unitName || "",
              floor: tempMediaForm.floor || "",
            };
            params.push(obj);
          }
        }
      }
      this.batchCreateApi(params);
    },
    batchCreateApi(params, editFlag) {
        console.log(params);
      if (params.length) {
        api
          .postApi_json("/addsp/api/v1/media/create/batch", params)
          .then((res) => {
            // console.log("批量创建媒体", res);
            this.Editloading.close();
            if (res.data.SysCode == 200200) {
              if (!editFlag) {
                this.$confirm("资源媒体创建成功!", "提示", {
                  confirmButtonText: "继续创建",
                  cancelButtonText: "前往列表",
                  showClose: false,
                  type: "success ",
                })
                  .then(() => {
                    this.resetForm(); // 请求成功后重置表单
                    this.recForm.fullViewUrl = ""; // 小区照片未进行recForm数据绑定
                    this.resUpdata = [];
                  })
                  .catch(() => {
                    this.resetForm();
                    this.$router.push("./mediaList");
                  });
              } else {
                sessFun.messageFun("success", "媒体创建成功");
                this.$router.push("./mediaDetail");
              }
            } else {
              sessFun.messageFun("warning", "媒体创建失败");
            }
          });
      } else {
        console.log("媒体数据为空");
      }
    },
    batchUpdateApi(params) {
      api
        .postApi_json("/addsp/api/v1/media/update/batch", params)
        .then((res) => {
          this.Editloading.close();
          if (res.data.SysCode == 200200) {
            this.Editloading.close();
            sessFun.messageFun("success", "媒体保存成功！");
            this.$router.push("./mediaDetail");
          } else {
            sessFun.messageFun("warning", "媒体编辑失败！");
          }
        });
    },
    // 资源图片上传前验证格式和大小
    beforeUpload_res(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isJPG) {
        sessFun.messageFun("warning", "上传图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt4M) {
        sessFun.messageFun("warning", "上传图片大小不能超过 4MB!");
      }
      return isJPG && isLt4M;
    },
    // 资源图片上传成功
    handleDownSuccess(res) {
    //   console.log("上传资源图片", res);
      if (this.recForm.fullViewUrl) {
        this.recForm.fullViewUrl = this.recForm.fullViewUrl + "," + res[0].pURL;
      } else {
        this.recForm.fullViewUrl = res[0].pURL;
      }
    //   console.log("this.recForm", this.recForm, this.recForm.fullViewUrl);
    },
    // 删除原资源图片，进行重新选择
    handleRemoveR(file, fileList) {
    //   console.log("删除或修改了资源图片", file, fileList);
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
    //   console.log("资源图片放大", file);
      this.resImgUrl = file.url;
      this.resImgDialog = true;
    },
    // 设置媒体图片信息
    saveImgInfo(m_title) {
      sessFun.messageFun("warning", "该功能暂未开放");
    //   console.log("获取当前媒体标题", m_title);
      this.mediaImg_title = m_title;
    },
    // 广告门图片上传前校验
    beforeUpload_ad(file) {
      sessFun.messageFun("warning", "该功能暂未开放");
      return false;
    },
    // 广告门图片上传成功
    adUploadSuccess(res, mediaItem) {
    //   console.log("上传媒体图片", res, mediaItem);
      if (mediaItem.mediaForm.mImg === "") {
        mediaItem.mediaForm.mImg = res[0].pURL;
      } else {
        mediaItem.mediaForm.mImg = mediaItem.mediaForm.mImg + ";" + res[0].pURL;
      }
    },
    //广告门图片放大
    handlePictureCardPreview(file) {
    },
    //删除广告门图片
    adHandleRemove(file, fileList) {
    },
    // 表单验证: 资源表单、媒体表单
    submitForm() {
      console.log("校验开始-----------");
      this.submitBtnIsAble = true;
      let timer = setTimeout(() => {
        this.submitBtnIsAble = false;
        clearTimeout(timer);
      }, 500);
      // 资源表单校验
    //   console.log("资源表单校验recForm", this.$refs.recForm);
      this.$refs.recForm.validate((valid, invalidObject) => {
        if (valid) {
            // console.log('valid', valid);
          // 验证全部通过后校验媒体表单
          this.adDoorValidateFrom();
        } else {
        //   console.log("资源表单invalidObject", invalidObject);
          sessFun.messageFun("warning", "必填项信息不能为空或填写有误！");
        }
      });
    },
    // 校验所有媒体表单 v-for包含ref时，refs.key获取结果为数组, 注意：验证操作为异步
    adDoorValidateFrom() {
      let mediaValidFlag = 0;
      const mediaTypeLength = this.mediaTypeList.length;
      for (
        let mediaTypeIndex = 0;
        mediaTypeIndex < mediaTypeLength;
        mediaTypeIndex++
      ) {
        let tempMediaList = this.mediaTypeList[mediaTypeIndex].mediaList;
        let mediaLength = tempMediaList.length;
        for (let mediaIndex = 0; mediaIndex < mediaLength; mediaIndex++) {
          mediaValidFlag += 1;
          this.$refs[`mediaForm${mediaTypeIndex}${mediaIndex}`][0].validate(
            (valid, invalidObject) => {
              if (!valid) {
                console.log(
                  `invalidObject--mediaForm${mediaTypeIndex}${mediaIndex}`,
                  invalidObject
                );
                sessFun.messageFun("warning", "必填项信息不能为空或填写有误！");
                return;
              } else {
                mediaValidFlag -= 1;
                if (mediaValidFlag === 0) {
                  // 全部媒体表单验证通过
                  console.log('验证通过');
                  this.validateFinted();
                }
              }
            }
          );
        }
      }
    },
    validateFinted() {
      if (this.pathHaveEdit) {
        // 判断是创建还是修改
        console.log("编辑--------");
        this.Editloading = this.$loading({
          lock: true,
          text: "保存中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        this.postEditMsg();
      } else {
        console.log("创建--------");
        this.Editloading = this.$loading({
          lock: true,
          text: "创建中...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        this.createRes();
      }
    },
    //重置表单数据
    resetForm() {
      this.$refs["recForm"].resetFields();
      const mediaTypeLength = this.mediaTypeList.length;
      for (
        let mediaTypeIndex = 0;
        mediaTypeIndex < mediaTypeLength;
        mediaTypeIndex++
      ) {
        let tempMediaList = this.mediaTypeList[mediaTypeIndex].mediaList;
        let mediaLength = tempMediaList.length;
        for (let mediaIndex = 0; mediaIndex < mediaLength; mediaIndex++) {
          this.$refs[
            `mediaForm${mediaTypeIndex}${mediaIndex}`
          ][0].resetFields();
        }
      }
    },
    // 清除表单校验
    clearFromValidate() {
    //   console.log("清除表单校验------");
      let timer = setTimeout(() => {
        this.$refs["recForm"].clearValidate();
        const mediaTypeLength = this.mediaTypeList.length;
        for (
          let mediaTypeIndex = 0;
          mediaTypeIndex < mediaTypeLength;
          mediaTypeIndex++
        ) {
          let tempMediaList = this.mediaTypeList[mediaTypeIndex].mediaList;
          let mediaLength = tempMediaList.length;
          for (let mediaIndex = 0; mediaIndex < mediaLength; mediaIndex++) {
            this.$refs[
              `mediaForm${mediaTypeIndex}${mediaIndex}`
            ][0].clearValidate();
          }
        }
        clearTimeout(timer);
      }, 500);
    },
    // 通过点击添加媒体跳转而来直接滚动到底部
    scrollBottom() {
      let timer = setTimeout(() => {
        // console.log("来源于点击添加媒体", document.body.scrollHeight); //clientHeight
        window.scrollTo(0, document.body.scrollHeight);
        this.mediaAddFun(this.mediaTypeList[this.activeMediaType]);
        clearTimeout(timer);
      }, 500);
    },
    // 媒体详情跳转过来，获取信息并编辑 添加
    editFun() {
      let recObj = JSON.parse(sessionStorage.getItem("recDetail"));
    //   console.log('recObj', recObj);
      this.resData.resID = sessionStorage.getItem("resID");
      if (recObj !== null || mediaTypeObj !== null) {
        // 设置默认选中的城市
        this.recForm.city = [];
        this.recForm.city.push(
          recObj.rid.toString().substring(0, 2) + "0000",
          recObj.cityId + ""
        );
        this.handleChange(this.recForm.city);
        this.resAddres.city = recObj.city;
        this.resAddres.area = recObj.cityArea;
        // 获取设置资源信息
        let tempObj = {
          // 基本信息
          resName: recObj.resName,
          resAlias: recObj.resAlias || "", // 资源别名
          city: this.recForm.city, // 城市
          region: recObj.rid.toString(), // 区域
          street: recObj.street || "", // 街道
          resaddr: recObj.resAddress, // 地址
          addressAlias: recObj.addressAlias || "", // 地址描述
          lat: "", // 经度
          lng: "", // 纬度
          description: recObj.description || "", // 楼盘介绍
          // 画像信息
          floorType: recObj.houseType, // 楼盘类型
          buildingPrice: recObj.housePrice, // 楼盘价格
          households: recObj.HouseNum, // 住户数量
          buildingNum: recObj.buildingNum, // 楼栋数量
          liveTime: recObj.joinTime, // 入住年份
          business: recObj.tradingArea || "", // 商圈
          unitCount: recObj.unitCount || '', // 单元数量
          supportingFacilities: recObj.supportingFacilities || "", // 周边配套
          transportation: recObj.transportation || "", // 交通状况
          doorwayNum: recObj.EntryExitNum || '', // 出入口数
          liveRate: recObj.liveRate || '', // 入住率
          liftType: recObj.liftType || '', // 配套电梯
          carNumber: recObj.carNumber || '', // 车位数
        //   peopleFlowrate: recObj.peopleFlowrate, // 人流量
        //   carFlowrate: recObj.carFlowrate, // 车流量
          notPush: recObj.notPush ? recObj.notPush.split(',') : [], // 广告限制
          // 物业信息
          developer: recObj.developer || "", // 开发商
          pmc: recObj.pmc, // 物业公司
          pc: recObj.propertyContacts || "", // 物业联系人
          pcp: recObj.propertyContactsPhone || "", // 物业联系电话
          // 小区全貌图
          fullViewUrl: recObj.fullViewUrl || "", // 资源图片

          resID: recObj.resID,

        //   resname: recObj.resName,
        //   // 房价网信息
        //   district: recObj.district,
        //   buildingType: recObj.buildingType || "", // 建筑类型
        //   floorSpace: recObj.floorSpace || "", // 占地面积
        //   constructionSpace: recObj.constructionSpace || "", // 建筑面积
        //   buildingStructure: recObj.buildingStructure || "", // 建筑结构
        //   plotRatio: recObj.plotRatio || "", // 容积率
        //   greenPercentage: recObj.greenPercentage || "", // 绿化率
        //   ownershipPeriod: recObj.ownershipPeriod || "", // 产权年限
        //   managementFee: recObj.managementFee || "", // 物业费
        //   salesOfficeAdd: recObj.salesOfficeAdd || "", // 售楼地址
        //   preSalePermit: recObj.preSalePermit || "", // 预售许可证
        //   ownershipType: recObj.ownershipType || "", // 产权性质
        //   salesPhoneNumber: recObj.salesPhoneNumber, // 售楼电话
        //   discount: recObj.discount, // 折扣信息
        };
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
        this.recForm = tempObj;
        //设置媒体信息
        let mediaTypeObj = JSON.parse(sessionStorage.getItem("mediaTypeObj"));
        console.log(mediaTypeObj);
        for (let i = 0; i < this.mediaTypeList.length; i++) {
          let tempMediaTypeItem = this.mediaTypeList[i];
          // 将媒体详情中已有类型的媒体合并至mediaTypeList对应的媒体类型下
          if (mediaTypeObj[tempMediaTypeItem.id]) {
            let mediaTypeItemDetail = mediaTypeObj[tempMediaTypeItem.id];
            // 标记原有媒体个数
            this.mediaTypeList[i].editMediaLength = mediaTypeItemDetail.mediaList.length;
            mediaTypeItemDetail.mediaList.forEach((mediaItem) => {
              let tempAdSpaceInfos = (mediaItem.adSpaceInfos || []).map(
                (adSpaceItem) => {
                  let {
                    adSizeHeight,
                    adSizeWidth,
                    adViewSizeHeight,
                    adViewSizeWidth,
                    asId,
                    asLab,
                    siteOrientation
                  } = adSpaceItem;
                  return {
                    adSizeHeight: adSizeHeight + "",
                    adSizeWidth: adSizeWidth + "",
                    adViewSizeHeight: adViewSizeHeight + "",
                    adViewSizeWidth: adViewSizeWidth + "",
                    asId,
                    name: asLab,
                    siteOrientation
                  };
                }
              );
              let tempMediaObj = {
                adSpaceInfo: tempAdSpaceInfos, // 尺寸
                mediaName: mediaItem.mTitle || "", // 媒体位置
                assetId: mediaItem.assetTag || "", // 媒体位ID
                mac: mediaItem.mac || "", // 设备ID
                doorType: mediaItem.mType || "", // 设备类型
                adDoorLevel: mediaItem.grade || "",
                site: mediaItem.site || "", // 位置类型
                mRemark: mediaItem.mRemark, // 备注
                buildingName: mediaItem.buildingName, // 楼栋
                unitName: mediaItem.unitName, // 单元
                floor: mediaItem.floor || "", // 楼层
                mImg: mediaItem.mImg || "",
                updataImg: [],
                adLimit: mediaItem.notPush ? mediaItem.notPush.split(',') : []
              };
              if (mediaItem.mImg) {
                let imgArr = [];
                if (mediaItem.mImg.includes(";")) {
                  imgArr = mediaItem.mImg.split(";");
                } else {
                  imgArr = mediaItem.mImg.split(",");
                }
                for (let ikey of imgArr) {
                  tempMediaObj.updataImg.push({
                    name: tempMediaObj.mediaName + i,
                    url: ikey,
                  });
                }
              }
              this.mediaTypeList[i].mediaList.push({
                text:
                  (tempMediaTypeItem.name || "媒体") +
                  ++this.mediaTypeList[i].ADTitleIndex,
                isAssetIdError: false, // 资源编号重名信息
                classified: mediaItem.classified,
                mid: mediaItem.mID,
                assetIdCommentData: {
                  // 资源编号重名信息
                  resName: "",
                  mediaName: "",
                  updateTime: "",
                },
                mediaForm: tempMediaObj,
              });
            });
          }
        }
        // console.log(" 编辑状态媒体数据", this.mediaTypeList);
        if (this.$route.query.add) {
          // 来源于点击添加媒体
          this.scrollBottom();
        }
        // 清除表单校验
        this.clearFromValidate();
      } else {
        this.$router.push("./mediaInput");
        this.pathHaveEdit = false;
      }
      this.constructResImg(); // 组装要显示的资源图片
    },
    // 组装要显示的资源图片
    constructResImg() {
    //   console.log("资源图片", this.recForm.fullViewUrl);
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
            // console.log("资源图片的信息", res);
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
      //     resname String          资源名称
      //     resaddr String          资源地址
      //     ct      String          楼盘类型
      //     cd      String          入住时间
      //     hp      int             楼盘价格
      //     fn      int             楼栋数量
      //     dn      int             出入口数量
      //     hn      int             小区户数
      let uid = this.sessionData.uID;
      this.recForm.uid = uid;
      let recObj = this.recForm;
      let SetResCTObj = {
        // 基本信息
        resName: recObj.resName,
        resAlias: recObj.resAlias || "", // 资源别名
        rid: "", // 地区id
        street: recObj.street || "", // 街道
        resaddr: recObj.resaddr, // 地址
        addressAlias: recObj.addressAlias || "", // 地址描述
        latlng: recObj.lat + ";" + recObj.lng, // 经纬度
        resid: this.resData.resID,
        description: recObj.description || "", // 楼盘介绍
        // 画像信息
        ct: recObj.floorType, // 楼盘类型
        hp: recObj.buildingPrice * 100, // 楼盘价格
        hn: recObj.households, // 住户数量
        fn: recObj.buildingNum, // 楼栋数量
        cd: recObj.liveTime, // 入住年份
        ta: recObj.business || "", // 商圈
        unitCount: recObj.unitCount || 0, // 单元数量
        supportingFacilities: recObj.supportingFacilities || "", // 周边配套
        transportation: recObj.transportation || "", // 交通状况
        dn: recObj.doorwayNum || 0, // 出入口数
        liveRate: recObj.liveRate || "", // 入住率
        liftType: recObj.liftType || '', // 配套电梯
        parkSpaceNum: recObj.carNumber || 0, // 车位数
        // peopleFlow: recObj.peopleFlowrate, // 人流量
        // carFlow: recObj.carFlowrate, // 车流量
        notPush: recObj.notPush ? recObj.notPush.join(',') : '', // 广告限制
        // 物业信息
        developer: recObj.developer || "", // 开发商
        pmc: recObj.pmc || "", // 物业公司
        propertyContacts: recObj.pc || "", // 物业联系人
        propertyContactsPhone: recObj.pcp || "", // 物业联系电话
        // 小区全貌图
        fullViewUrl: recObj.fullViewUrl || "", // 资源图片


        // resname: recObj.resname,
        // // 房价网信息
        // buildingType: recObj.buildingType || "", // 建筑类型
        // floorSpace: recObj.floorSpace || "", // 占地面积
        // constructionSpace: recObj.constructionSpace || "", // 建筑面积
        // buildingStructure: recObj.buildingStructure || "", // 建筑结构
        // greenPercentage: recObj.greenPercentage || "", // 绿化率
        // ownershipPeriod: recObj.ownershipPeriod || "", // 产权年限
        // managementFee: recObj.managementFee || "", // 物业费
        // salesOfficeAdd: recObj.salesOfficeAdd || "", // 售楼地址
        // preSalePermit: recObj.preSalePermit || "", // 预售许可证
        // ownershipType: recObj.ownershipType || "", // 产权性质
        // salesPhoneNumber: recObj.salesPhoneNumber, // 售楼电话
        // discount: recObj.discount,
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
      console.log('params.data', params.data);
      api.postApi_new(this.apiVar.Media, params).then((res) => {
        // console.log("修改资源信息", res);
        if (res.data.SysCode == 200200) {
          // 设置资源图片信息
          this.postEditAdDoorData();
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
    // 提交编辑后的广告门信息,媒体创建时传广告位id,编辑的媒体传点位id
    postEditAdDoorData() {
      let resId = sessionStorage.getItem("resID");
      let editMediaParams = [];
      let newMediaParams = [];
      const mediaTypeLength = this.mediaTypeList.length;
      for (
        let mediaTypeIndex = 0;
        mediaTypeIndex < mediaTypeLength;
        mediaTypeIndex++
      ) {
        let mediaTypeItem = this.mediaTypeList[mediaTypeIndex];
        let tempMediaList = mediaTypeItem.mediaList;
        let mediaLength = tempMediaList.length;
        mediaTop: for (
          let mediaIndex = 0;
          mediaIndex < mediaLength;
          mediaIndex++
        ) {
          let mediaItem = tempMediaList[mediaIndex];
          let tempMediaForm = mediaItem.mediaForm;
          if (mediaIndex < mediaTypeItem.editMediaLength) {
            // 编辑中的媒体
            let tempAdSpaceInfo = [];
            for (
              let adSpaceIndex = 0;
              adSpaceIndex < tempMediaForm.adSpaceInfo.length;
              adSpaceIndex++
            ) {
              let adSpaceItem = tempMediaForm.adSpaceInfo[adSpaceIndex];
              let {
                adSizeWidth,
                adSizeHeight,
                adViewSizeWidth,
                adViewSizeHeight,
                asId,
                siteOrientation
              } = adSpaceItem;
              if (
                adSizeWidth &&
                adSizeHeight &&
                adViewSizeWidth &&
                adViewSizeHeight &&
                asId
              ) {
                tempAdSpaceInfo.push({
                  asId,
                  adSizeWidth,
                  adSizeHeight,
                  adViewSizeWidth,
                  adViewSizeHeight,
                  siteOrientation
                });
              } else {
                break mediaTop;
              }
            }
            if (tempAdSpaceInfo.length === tempMediaForm.adSpaceInfo.length) {
              // 单个媒体下所有广告位验证通过
              let obj = {
                mediaId: mediaItem.mid,
                name: tempMediaForm.mediaName || "",
                assetTag: tempMediaForm.assetId,
                deviceType: tempMediaForm.doorType || "",
                mediaPicture: tempMediaForm.mImg || "",
                grade: tempMediaForm.adDoorLevel || "",
                site: tempMediaForm.site || "",
                mRemark: tempMediaForm.mRemark || "",
                adSpaceInfo: tempAdSpaceInfo,
                buildingName: tempMediaForm.buildingName,
                unitName: tempMediaForm.unitName,
                floor: tempMediaForm.floor,
                mac: tempMediaForm.mac,
                notPush: tempMediaForm.adLimit.join(','),
              };
              editMediaParams.push(obj);
            }
          } else {
            // 新建中的媒体
            let tempAdSpaceInfo = [];
            for (
              let adSpaceIndex = 0;
              adSpaceIndex < tempMediaForm.adSpaceInfo.length;
              adSpaceIndex++
            ) {
              let adSpaceItem = tempMediaForm.adSpaceInfo[adSpaceIndex];
              let {
                adSizeWidth,
                adSizeHeight,
                adViewSizeWidth,
                adViewSizeHeight,
                id: adSpaceId,
                siteOrientation
              } = adSpaceItem;
              if (
                adSizeWidth &&
                adSizeHeight &&
                adViewSizeWidth &&
                adViewSizeHeight &&
                adSpaceId
              ) {
                tempAdSpaceInfo.push({
                  adSpaceId,
                  adSizeWidth,
                  adSizeHeight,
                  adViewSizeWidth,
                  adViewSizeHeight,
                  siteOrientation
                });
              } else {
                break mediaTop;
              }
            }
            if (tempAdSpaceInfo.length === tempMediaForm.adSpaceInfo.length) {
              // 单个媒体下所有广告位验证通过
              let obj = {
                resId,
                name: tempMediaForm.mediaName || "",
                mediaTypeId: mediaTypeItem.id,
                assetTag: tempMediaForm.assetId,
                deviceType: tempMediaForm.doorType || "",
                mediaPicture: tempMediaForm.mImg || "",
                mRemark: tempMediaForm.mRemark || "",
                site: tempMediaForm.site || "",
                adSpaceInfo: tempAdSpaceInfo,
              };
              newMediaParams.push(obj);
            }
          }
        }
      }
      if (editMediaParams.length) {
        this.batchUpdateApi(editMediaParams);
      } else {
        console.log("媒体编辑数据为空");
      }
      if (newMediaParams.length) {
        this.batchCreateApi(newMediaParams, true);
      } else {
        console.log("媒体新增数据为空");
      }
    },
    // 取消
    clearData() {
      this.resetForm();
      window.history.go(-1);
    },
  },
};
</script>

<style scoped lang="scss">
.mediaList_content {
  /*width: 92%;*/
  background: #ffffff;
  margin: 16px 64px 0;
  padding-bottom: 32px;
}
/deep/ .ad_index_footer {
  text-align: center;
  font-size: 14px;
  color: #8a8a8a;
  margin-bottom: 16px;
  position: relative;
}

.content_top_wrap {
  background: #ffffff;
  padding-top: 3px;
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

/*媒体删除按钮*/
.media_deleBtn {
  float: right;
  width: 50px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
}
.media_deleBtn > i {
  color: rgba(255, 0, 0, 0.85);
  font-size: 24px;
  font-weight: 500;
}

.content_top_wrap .content_top_form_wrap {
  padding: 26px 0 16px;
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
  right: 0px;
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

/deep/ .mediaMana_content_top .el-form-item__error {
  top: 90%;
  width: 200px;
}

/deep/ .el-popper[x-placement^="bottom"] {
  margin-top: 3px !important;
  top: 200px !important;
}

/*媒体一表单*/
.mediaList_content .content_bottom_upload {
  width: 408px;
  height: 877px;
  border: 2px dashed #979797;
  float: left;
  margin-left: 10px;
  text-align: center;
  line-height: 810px;
  cursor: pointer;
}
/*素材尺寸单位等*/
.mm {
  display: inline-block;
  position: relative;
}

.mm span {
  position: absolute;
  /*left: 68px;*/
  right: 20px;
  top: 0;
  color: #666666;
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
/*按钮*/
.content_bottom_btn {
  text-align: center;
  margin-top: 20px;
}

/deep/ .mediaList_content .el-form-item__error {
  top: 92%;
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

/*新增媒体*/
.add_media_btn {
  box-sizing: border-box;
  height: 32px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  text-align: center;
  line-height: 32px;
  cursor: pointer;
  margin: 10px 32px 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
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
/*道闸tab*/
/deep/ .el-tabs__header {
  background: #fff;
  margin: 0;
  padding-left: 24px;
  border: 1px solid rgba(230, 231, 233, 1);
}
/deep/ .el-tabs__item {
  min-width: 80px;
  font-size: 16px;
  text-align: center;
}
.mediaImg img {
  width: auto;
  height: 100%;
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
/*地图弹出框*/
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

.push_map_box_p {
  height: 32px;
  background: rgba(255, 251, 230, 1);
  border-radius: 4px;
  border: 1px solid rgba(255, 229, 143, 1);
  line-height: 32px;
  padding: 0 16px;
  margin-top: 16px;
  position: relative;
}

.push_map_box_p /deep/ .el-icon-close {
  cursor: pointer;
  margin-left: 24px;
  position: absolute;
  top: 9px;
  right: 8px;
}
</style>
