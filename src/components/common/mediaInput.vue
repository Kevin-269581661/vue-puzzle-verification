<template>
    <div>
        <div class="ad_mediaMana_wrap">
            <div class="ad_mediaMana_nav clearfix">
                <p><a href="#">媒体管理</a><em> / </em><a href="#">录入媒体</a></p>
            </div>
            <!--资源信息-->
            <div class="mediaMana_content_top">
                <div class="content_top_wrap">
                    <div class="content_top_form_wrap">
                        <el-form :model="recForm" status-icon :rules="recRules" ref="recForm" label-width="100px"
                                 class="demo-ruleForm resFrom">
                            <el-form-item label="基本信息" class="baseInfo firstInfo"></el-form-item>
                            <el-form-item label="资源类型" prop="rt" class="left_form_item">
                                <div class="select_wrap">
                                    <el-select v-model="recForm.rt" @change="selectRec" placeholder="请选择" :disabled="PathHaveEdit">
                                        <el-option label="写字楼" value="2"></el-option>
                                        <el-option label="社区" value="1"></el-option>
                                    </el-select>
                                </div>
                            </el-form-item>
                            <el-form-item label="所属城市" prop="city">
                                <el-cascader
                                    v-if="cityOther"
                                    :options="cityOptions"
                                    v-model="recForm.city"
                                    separator="-"
                                    :show-all-levels="false"
                                    placeholder="请选择"
                                    @change="handleChange"
                                >
                                </el-cascader>
                             <!--   <el-select v-else v-model="recForm.city" placeholder="请选择" @change="recFormCity">
                                    <el-option
                                        v-for="item in throwCity"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>-->
                            </el-form-item>
                            <el-form-item label="所属区域" prop="region">
                                <el-select v-model="recForm.region" placeholder="请选择" :clearable="true" @change="getRegion">
                                    <el-option v-for="item in regionOpt"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="资源名称" prop="resname" class="res_name_form_item right_form_item">
                                <div style="position: relative">
                                    <el-autocomplete
                                        v-model="recForm.resname"
                                        :fetch-suggestions="getResNameByFangJiaWang"
                                        placeholder=""
                                        @select="changeResName">
                                    </el-autocomplete>
                                    <span style="position: absolute;left: 176px;top: 0">
                                        <el-button size="small" type="primary" @click="getResBasicData">检索</el-button>
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="位置信息" class="baseInfo"></el-form-item>
                            <el-form-item label="资源地址" prop="resaddr" class="left_form_item">
                              <!--  <el-input v-model="recForm.resaddr" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.resaddr)"></el-input>-->
                                   <el-autocomplete
                                       v-model="recForm.resaddr"
                                       :fetch-suggestions="querySearchAsync"
                                       placeholder="例：工业大道53号"
                                   >
                                   </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="地址别名" prop="addressAlias">
                                <el-input v-model="recForm.addressAlias" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.addressAlias)"></el-input>
                            </el-form-item>
                            <el-form-item label="经纬度" required class="lng_lat_form_item">
                                <el-form-item prop="lat" class="min_form_item">
                                    <el-input v-model.trim="recForm.lat" placeholder="" :disabled="returnBool(FangJiaWangData.lat)"></el-input>
                                </el-form-item>
                                <el-form-item prop="lng" class="min_form_item min_form_item_right">
                                    <el-input v-model.trim="recForm.lng" placeholder="" :disabled="returnBool(FangJiaWangData.lng)"></el-input>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="所属商圈" prop="business" class="right_form_item">
                                <el-input v-model.trim="recForm.business" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item label="描述" prop="description" class="left_form_item">
                                <el-input type="textarea" v-model="recForm.description" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.description)"></el-input>
                            </el-form-item>
                            <el-form-item label="周边配套" prop="supportingFacilities">
                                <el-input type="textarea" v-model="recForm.supportingFacilities" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.supportingFacilities)"></el-input>
                            </el-form-item>
                            <el-form-item label="交通状况" prop="transportation">
                                <el-input type="textarea" v-model="recForm.transportation" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.transportation)"></el-input>
                            </el-form-item>
                            <el-form-item label="属性信息" class="baseInfo"></el-form-item>
                            <el-form-item label="楼盘价格" prop="buildingPrice" class="rmb left_form_item">
                                <div class="mm">
                                    <el-input v-model="recForm.buildingPrice" placeholder=""
                                              :disabled="returnBool(FangJiaWangData.buildingPrice)"></el-input>
                                    <span style="left: 15px">￥</span>
                                </div>
                            </el-form-item>
                            <el-form-item :label="rt_village?'楼盘类型':'写字楼类型'" prop="floorType" :class="rt_village ? '' : 'floor_house_item'">
                                <el-select v-model="recForm.floorType" placeholder="">
                                    <el-option v-for="item in floorType"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="rt_village?'小区户数':'办公室数量'" prop="households"  :class="rt_village ? '' : 'floor_house_item'">
                                <el-input v-model="recForm.households" controls-position="right"
                                          :disabled="returnBool(FangJiaWangData.households)"></el-input>
                            </el-form-item>
                            <el-form-item label="楼栋数量" prop="buildingNum" class="right_form_item">
                                <el-input-number v-model="recForm.buildingNum" controls-position="right" :min="1"
                                                 :max="9999999" :disabled="returnBool(FangJiaWangData.buildingNum)"></el-input-number>
                            </el-form-item>
                            <el-form-item label="建筑类型" prop="buildingType" class="left_form_item">
                                <el-input v-model="recForm.buildingType" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.buildingType)"></el-input>
                            </el-form-item>
                            <el-form-item :label="rt_village?'入住年份':'建成年份'" prop="liveTime">
                                <el-date-picker
                                    v-model="recForm.liveTime"
                                    :disabled="returnBool(FangJiaWangData.liveTime)"
                                    type="year"
                                    @change="getTime"
                                    value-format="yyyy"
                                    format="yyyy 年"
                                    :editable="false"
                                    placeholder="">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="占地面积" prop="floorSpace">
                                <div class="el-form-item_unit">
                                    <el-input v-model="recForm.floorSpace" placeholder=""
                                              :disabled="returnBool(FangJiaWangData.floorSpace)">
                                    </el-input>
                                    <span>m²</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="建筑面积" prop="constructionSpace" class="right_form_item">
                                <div class="el-form-item_unit">
                                    <el-input v-model="recForm.constructionSpace" placeholder=""
                                              :disabled="returnBool(FangJiaWangData.constructionSpace)"></el-input>
                                    <span>m²</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="建筑结构" prop="buildingStructure" class="left_form_item">
                                <el-input v-model="recForm.buildingStructure" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.buildingStructure)"></el-input>
                            </el-form-item>
                            <el-form-item label="容积率" prop="plotRatio">
                                <el-input v-model="recForm.plotRatio" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.plotRatio)"></el-input>
                            </el-form-item>
                            <el-form-item label="绿化率" prop="greenPercentage">
                                <!--<div class="el-form-item_unit">-->
                                <el-input v-model="recForm.greenPercentage" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.greenPercentage)"></el-input>
                                <!--<span>%</span>-->
                                <!--</div>-->
                            </el-form-item>
                            <el-form-item label="产权年限" prop="ownershipPeriod" class="right_form_item">
                                <div class="el-form-item_unit">
                                    <el-input v-model="recForm.ownershipPeriod" placeholder=""
                                              :disabled="returnBool(FangJiaWangData.ownershipPeriod)"></el-input>
                                    <span>年</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="车位数" prop="carNumber" class="left_form_item">
                                <el-input v-model="recForm.carNumber" controls-position="right" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.carNumber)"></el-input>
                            </el-form-item>
                            <el-form-item label="人流量（人次/日）" prop="peopleFlowrate">
                                <el-input v-model="recForm.peopleFlowrate" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item label="车流量（车次/日）" prop="carFlowrate" class="right_form_item">
                                <el-input v-model="recForm.carFlowrate" placeholder=""></el-input>
                            </el-form-item>
                            <el-form-item label="物业信息" class="baseInfo"></el-form-item>
                            <el-form-item label="开发商" prop="developer" class="left_form_item">
                                <el-input v-model="recForm.developer" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.developer)"></el-input>
                            </el-form-item>
                            <el-form-item label="物业公司" prop="pmc">
                                <el-input v-model="recForm.pmc" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.pmc)"></el-input>
                            </el-form-item>
                            <el-form-item label="物业费（元/m²/月）" prop="managementFee">
                                <el-input v-model="recForm.managementFee" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.managementFee)"></el-input>
                            </el-form-item>
                            <el-form-item label="售楼地址" prop="salesOfficeAdd" class="right_form_item">
                                <el-input v-model="recForm.salesOfficeAdd" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.salesOfficeAdd)"></el-input>
                            </el-form-item>
                            <el-form-item label="售楼电话" prop="salesPhoneNumber" class="left_form_item">
                                <el-input v-model="recForm.salesPhoneNumber" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.salesPhoneNumber)"></el-input>
                            </el-form-item>
                            <el-form-item label="折扣信息" prop="discount">
                                <el-input v-model="recForm.discount" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.discount)"></el-input>
                            </el-form-item>
                            <el-form-item label="预售许可证" prop="preSalePermit">
                                <el-input v-model="recForm.preSalePermit" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.preSalePermit)"></el-input>
                            </el-form-item>
                            <el-form-item label="产权性质" prop="ownershipType" class="right_form_item">
                                <el-input v-model="recForm.ownershipType" placeholder=""
                                          :disabled="returnBool(FangJiaWangData.ownershipType)"></el-input>
                            </el-form-item>
                            <el-form-item label="小区照片" class="baseInfo"></el-form-item>
                            <el-form-item label="" prop="mImg" class="left_form_item">
                                <div class="upload_img_wrap" style="width: 120px;"><!--:auto-upload = 'false'-->
                                    <el-upload
                                        :action="doUpload"
                                        list-type="picture-card"
                                        :file-list="resUpdata"
                                        :limit = '1'
                                        :on-success="handleDownSuccess"
                                        :on-preview="handlePictureCardPreview_res"
                                        :before-upload="beforeUpload_res"
                                        :on-remove="handleRemoveR">
                                        <i class="el-icon-plus"></i>
                                    </el-upload>
                                    <el-dialog :visible.sync="resImgDialog">
                                        <img width="100%" :src="resImgUrl" alt="">
                                    </el-dialog>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <!--媒体一-->
            <div class="mediaMana_content_bottom clearfix">
                <el-tabs v-model="activeMedia" @tab-click="handleClickMedia">
                    <el-tab-pane label="广告门" name="first">
                        <div class="content_bottom_wrap_box">
                            <div class="content_bottom_wrap" v-for="(item,key) in arrMedia" :key="key">
                                <div class="content_bottom_head">
                                    <h2>{{item.text}}</h2>
                                    <el-button type="danger" size="small" class="media_deleBtn" @click="mediaDelBtnFun(key)" :disabled="(key + 1) <= editMediaLength">删除</el-button>
                                </div>
                                <div class="content_bottom_form_wrap">
                                    <el-form :model="item.mediaForm" status-icon :rules="mediaRules" ref="mediaForm" label-width="100px"
                                             class="demo-ruleForm">
                                        <el-form-item label="媒体名称" prop="mediaName">
                                            <el-input v-model="item.mediaForm.mediaName" placeholder="例：东门"></el-input>
                                        </el-form-item>
                                        <el-form-item label="可投面数" prop="usableNum">
                                            <el-input-number v-model.number="item.mediaForm.usableNum" :min="1" :max="26"
                                                             controls-position="right" :disabled="(PathHaveEdit && key <= editMediaLength - 1)">
                                            </el-input-number>
                                        </el-form-item>
                                        <el-form-item label="媒体状态" prop="mstate">
                                            <el-select v-model="item.mediaForm.mstate" placeholder="请选择媒体状态" @change="selectMstate(item.mediaForm)">
                                                <el-option label="禁用" :value="'0' + key"></el-option>
                                                <el-option label="正常" :value="'1' + key"></el-option>
                                                <el-option label="待安装" :value="'2' + key"></el-option>
                                                <el-option label="待维修" :value="'3' + key"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="资产编号" prop="assetId" ref="ResAssetId" class="right_form_item"
                                                      :rules="item.mediaForm.assetIdBolean ? assetIdRules: mediaRules.assetId">
                                            <el-input v-model.trim="item.mediaForm.assetId" placeholder="例:0034FASF342-X21" :disabled="item.mediaForm.assetIdBolean"></el-input>
                                        </el-form-item>
                                        <el-form-item label=" 媒体类型" prop="doorType">
                                            <el-input v-model="item.mediaForm.doorType" placeholder="例:消防门"></el-input>
                                        </el-form-item>
                                        <el-form-item label="广告尺寸" required>
                                            <el-form-item prop="adSizeW" class="min_form_item">
                                                <div class="mm">
                                                    <el-input v-model="item.mediaForm.adSizeW" placeholder="宽度"></el-input>
                                                    <span>mm</span>
                                                </div>
                                            </el-form-item>
                                            <el-form-item prop="adSizeH" class="min_form_item min_form_item_right">
                                                <div class="mm">
                                                    <el-input v-model="item.mediaForm.adSizeH" placeholder="高度">
                                                    </el-input>
                                                    <span>mm</span>
                                                </div>
                                            </el-form-item>
                                        </el-form-item>
                                        <el-form-item label="可视画面" required>
                                            <el-form-item prop="visualW" class="min_form_item">
                                                <div class="mm">
                                                    <el-input v-model="item.mediaForm.visualW" placeholder="宽度"></el-input>
                                                    <span>mm</span>
                                                </div>
                                            </el-form-item>
                                            <el-form-item prop="visualH" class="min_form_item min_form_item_right">
                                                <div class="mm">
                                                    <el-input v-model="item.mediaForm.visualH" placeholder="高度">
                                                    </el-input>
                                                    <span>mm</span>
                                                </div>
                                            </el-form-item>
                                        </el-form-item>
                                        <el-form-item label="广告限制" prop="adLimit" class="right_form_item">
                                            <el-select v-model="item.mediaForm.adLimit" multiple collapse-tags placeholder="请选择广告限制"
                                                       @focus="adLimitFocus(key)" @change="changeAdLimit">
                                                <el-option
                                                    v-for="(limit, index) in adLimit"
                                                    :key="index"
                                                    :label="limit.label"
                                                    :value="limit.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="媒体等级" prop="adDoorLevel" v-if="PathHaveEdit && classified">
                                            <el-select v-model="item.mediaForm.adDoorLevel" placeholder="请选择媒体等级">
                                                <el-option
                                                    v-for="(level,index) in mediaLevel"
                                                    :key="index"
                                                    :label="level.label"
                                                    :value="level.value">
                                                </el-option>
                                            </el-select>
                                            <br><span style="font-size: 12px;color: #FF8282">*媒体等级涉及该广告门定价，请勿随意更改。</span>
                                        </el-form-item>
                                        <el-form-item label="备注" prop="mediaRemark">
                                            <el-input type="textarea" v-model.trim="item.mediaForm.mediaRemark" placeholder="请填写备注信息"></el-input>
                                        </el-form-item>
                                        <el-form-item label="门禁照片:" prop="mImg">
                                            <div class="upload_img_wrap"><!-- @click="saveImgInfo(item.text)"-->
                                                <el-upload
                                                    :disabled = "isUpload"
                                                    :action="doUpload"
                                                    list-type="picture-card"
                                                    :limit='2'
                                                    :file-list="item.mediaForm.updataImg"
                                                    :before-upload="beforeUpload_ad"
                                                    :on-success="adUploadSuccess"
                                                    :on-remove="adHandleRemove"
                                                    :on-preview="handlePictureCardPreview"
                                                    @click.native="saveImgInfo(item.text)">
                                                    <i class="el-icon-plus" ></i>
                                                </el-upload>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </div>

                        <div class="addMedia">
                            <div class="addMediaBtn" @click="mediaAddFun()">+ 新增媒体</div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="道 闸" name="second">
                        <div class="content_bottom_wrap_box">
                            <div class="content_bottom_wrap" v-for="(item,key) in roadGateMedia" :key="key">
                                <div class="content_bottom_head">
                                    <h2>{{item.text}}</h2>
                                    <el-button type="danger" size="small" class="media_deleBtn" @click="roadGateDelBtnFun(key)" :disabled="(key + 1) <= editRoadGateLength">删除</el-button>
                                </div>
                                <div class="content_bottom_form_wrap">
                                    <el-form :model="item.roadGateForm" status-icon :rules="roadGateRules" ref="roadGateForm" label-width="100px"
                                             class="demo-ruleForm">
                                        <el-form-item label="媒体名称" prop="mediaName">
                                            <el-input v-model="item.roadGateForm.mediaName" placeholder="例：东门"></el-input>
                                        </el-form-item>
                                        <el-form-item label="资产编号" prop="assetId" ref="ResAssetId" :rules="item.roadGateForm.assetIdBolean ? assetIdRules: mediaRules.assetId">
                                            <el-input v-model.trim="item.roadGateForm.assetId" placeholder="例:0034FASF342-X21" :disabled="item.roadGateForm.assetIdBolean"></el-input>
                                        </el-form-item>
                                        <el-form-item label="可投面数" prop="usableNum">
                                            <el-input-number v-model.number="item.roadGateForm.usableNum" :min="1" :max="3" :disabled="true"
                                                             controls-position="right"> <!--:disabled="(PathHaveEdit && key <= editRoadGateLength - 1)"-->
                                            </el-input-number>
                                        </el-form-item>
                                        <el-form-item label="媒体状态" prop="mstate" class="right_form_item">
                                            <el-select v-model="item.roadGateForm.mstate" placeholder="请选择媒体状态" @change="selectMstate(item.roadGateForm)">
                                                <el-option label="禁用" :value="'0' + key"></el-option>
                                                <el-option label="正常" :value="'1' + key"></el-option>
                                                <el-option label="待安装" :value="'2' + key"></el-option>
                                                <el-option label="待维修" :value="'3' + key"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="广告限制" prop="adLimit">
                                            <el-select v-model="item.roadGateForm.adLimit" multiple collapse-tags
                                                       placeholder="请选择广告限制" @focus="adLimitFocus(key)" @change="changeAdLimit">
                                                <el-option
                                                    v-for="(limit, index) in adLimit"
                                                    :key="index"
                                                    :label="limit.label"
                                                    :value="limit.value">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="画面尺寸" required>
                                            <el-form-item prop="visualW" class="min_form_item">
                                                <div class="mm">
                                                    <el-input v-model="item.roadGateForm.visualW" placeholder="宽度"></el-input>
                                                    <span>mm</span>
                                                </div>
                                            </el-form-item>
                                            <el-form-item prop="visualH" class="min_form_item min_form_item_right">
                                                <div class="mm">
                                                    <el-input v-model="item.roadGateForm.visualH" placeholder="高度">
                                                    </el-input>
                                                    <span>mm</span>
                                                </div>
                                            </el-form-item>
                                        </el-form-item>
                                        <el-form-item label="灯箱尺寸" required>
                                            <el-form-item prop="LBSizeW" class="min_form_item">
                                                <div class="mm">
                                                    <el-input v-model="item.roadGateForm.LBSizeW" placeholder="宽度"></el-input>
                                                    <span>mm</span>
                                                </div>
                                            </el-form-item>
                                            <el-form-item prop="LBSizeH" class="min_form_item min_form_item_right">
                                                <div class="mm">
                                                    <el-input v-model="item.roadGateForm.LBSizeH" placeholder="高度">
                                                    </el-input>
                                                    <span>mm</span>
                                                </div>
                                            </el-form-item>
                                        </el-form-item>
                                        <el-form-item class="right_form_item"></el-form-item>
                                        <el-form-item label="备注" prop="mediaRemark">
                                            <el-input type="textarea" v-model.trim="item.roadGateForm.mediaRemark" placeholder="请填写备注信息"></el-input>
                                        </el-form-item>
                                        <el-form-item label="门禁照片:" prop="mImg">
                                            <div class="upload_img_wrap" ><!--@click="saveImgInfo(item.text)"-->
                                                <el-upload
                                                    :disabled = "isUpload"
                                                    :action="doUpload"
                                                    list-type="picture-card"
                                                    :limit='2'
                                                    :file-list="item.roadGateForm.updataImg"
                                                    :before-upload="beforeUpload_rg"
                                                    :on-success="rgUploadSuccess"
                                                    :on-remove="rgHandleRemove"
                                                    :on-preview="rgHandlePictureCardPreview"
                                                    @click.native="saveImgRGInfo(item.text)">
                                                    <i class="el-icon-plus" ></i>
                                                </el-upload>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>
                        </div>

                        <div class="addMedia">
                            <div class="addMediaBtn" @click="roadGateAddFun()">+ 新增媒体</div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="content_bottom_btn">
                    <el-button type="primary" class="create" :disabled="submitBtnIsAble" @click="submitForm('recForm','mediaForm','roadGateForm')">{{PathHaveEdit?'保存':'创建'}}</el-button>
                    <!--<button v-if='PathHaveEdit' @click="editReturn">返回</button>-->
                    <button class="cancel" @click="clearData">取消</button>
                </div>
            </div>
        </div>
        <el-dialog
            :visible.sync="mediaImgDialogVisible"
            :title="mediaImgTitle">
            <div class="block mediaImg">
                <el-carousel height="550px">
                    <el-carousel-item v-for="(src,index) in mediaImgSrc" :key="index">
                        <img :src='src' alt="媒体图片">
                    </el-carousel-item>
                </el-carousel>
            </div>
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
        Message
    } from 'element-ui';
    import api from '../../api/api'
    import areaPackageNew from '../../commonFun/areaPackage_new'
    import areaToTextNew from '../../commonFun/areaToText_new'
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
            //资产编号
            let validateAssetId = (rule, value, callback) => {
                let reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
                if (reg.test(value)) {
                    callback(new Error('只能输入数字字母符号'));
                } else {
                    callback();
                }
            };
            let validateNum = (rule, value, callback) => {
                if (value !== '' && !Number.isInteger(value)) {
                    callback(new Error('只能输入整数值'));
                } else {
                    if (value < 1 || value > 26) {
                        callback(new Error('最少投1面，最多可投26面'));
                    } else {
                        callback();
                    }
                }
            };
            let validateSpace = (rule, value, callback) => {
                if (value) {
                    if (value.match(/^\s+$/)) {
                        callback(new Error('所填内容不能为空格'))
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            let validatePrice = (rule, value, callback) => {
                let reg = /^\d+(\.\d+)?$/
                if (value !== '' && !(reg.test(value))) {
                    callback(new Error('只能输入数字'));
                } else {
                    if (value > 9999999) {
                        callback(new Error('不得大于9999999'));
                    } else {
                        callback();
                    }
                }
            };
            let validateLat = (rule, value, callback) =>{
                let reg = /^\d+(\.\d+)?$/
                // let reg =  /[^\d\.]/g
                if (value !== '' && !(reg.test(value))) {
                    callback(new Error('只能输入数字'));
                } else {
                    if (value < 0 || value > 180) {
                        callback(new Error('只能输入数字(0-180)'));
                    } else {
                        callback();
                    }
                }
            }
            let validateLng = (rule, value, callback) =>{
                let reg = /^\d+(\.\d+)?$/
                if (value !== '' && !(reg.test(value))) {
                    callback(new Error('只能输入数字'));
                } else {
                    if (value < 0 || value > 90) {
                        callback(new Error('只能输入数字(0-90)'));
                    } else {
                        callback();
                    }
                }
            }
            // 绿化率
            let validateGreenP = (rule, value, callback) =>{
                let reg = /^\d+(\.\d+)?$/
                if (value !== '' && !(reg.test(value))) {
                    callback(new Error('只能输入数字'));
                } else {
                    if (value < 0 || value > 100) {
                        callback(new Error('只能输入数字(0-100)'));
                    } else {
                        callback();
                    }
                }
            }
            return {
                isUpload: true,
                assetIdBolean: false,
                activeMedia: 'first',
                mstateOption: [
                    {label: '禁用', value: '0'},
                    {label: '正常', value: '1'},
                    {label: '待安装', value: '2'},
                    {label: '待维修', value: '3'}
                ],
                dialogImageUrl: '',//缩略图
                dialogVisible: false,
                titleArr: ['媒体一', '媒体二', '媒体三', '媒体四', '媒体五', '媒体六', '媒体七', '媒体八', '媒体九', '媒体十',
                    '媒体十一', '媒体十二', '媒体十三', '媒体十四', '媒体十五', '媒体十六', '媒体十七', '媒体十八', '媒体十九', '媒体二十',
                    '媒体二十一', '媒体二十二', '媒体二十三', '媒体二十四', '媒体二十五', '媒体二十六', '媒体二十七', '媒体二十八', '媒体二十九', '媒体三十',
                    '媒体三十一', '媒体三十二', '媒体三十三', '媒体三十四', '媒体三十五', '媒体三十六', '媒体三十七', '媒体三十八', '媒体三十九', '媒体四十',
                    '媒体四十一', '媒体四十二', '媒体四十三', '媒体四十四', '媒体四十五', '媒体四十六', '媒体四十七', '媒体四十八', '媒体四十九', '媒体五十'],
                ADTitleIndex: 0,        // 广告门title下标
                roadGateTitleIndex: 0,  // 道闸title下标
                arrMediaStatue: [],     // 编辑媒体时记录状态
                arrMedia: [
                    {
                        text: '媒体一',
                        mediaForm: {
                            mediaType: '广告门',   //媒体类型mVehicle
                            mediaName: '',      //媒体名称mtitle
                            adDoorLevel: [],    // 广告门等级
                            usableNum: '2',   //广告位面数pnum
                            mstate: '',       //媒体状态mstate
                            assetId: '',      //资产编号assettag
                            doorType: '',     // 门类型mType
                            adSizeW: '',      //广告尺寸adsize
                            adSizeH: '',     //广告尺寸
                            visualW: '',      //可视画面adviewsize
                            visualH: '',      //可视画面
                            mediaRemark: '',  //备注 mrk
                            adLimit: [],     //请选择广告限制 notpush
                            assetIdBolean: false,
                            mImg: '',
                            updataImg:[],
                        },
                    },
                ],
                m_boolean: false,   // 广告门表单验证
                rt_boolean: false, // 道闸表单验证
                editRoadGateStatue: [],   // 编辑媒体时记录状态
                roadGateMedia:[
                    {
                        text: '媒体一',
                        roadGateForm: {
                            mediaType: '道闸',   //道闸类型mVehicle
                            mediaName: '',  //道闸名称mtitle
                            usableNum: '3',   //广告位面数pnum
                            mstate: '',       //道闸状态mstate
                            assetId: '',      //资产编号assettag
                            LBSizeW: '',      //灯箱尺寸高度
                            LBSizeH: '',     //灯箱尺寸宽度
                            visualW: '',      //可视画面adviewsize
                            visualH: '',      //可视画面
                            mediaRemark: '',  //备注 mrk
                            adLimit: [],     //请选择广告限制 notpush
                            assetIdBolean: false,
                            mImg: '',
                            updataImg: []
                        },
                    },
                ],
                editRoadGateLength:0, // 编辑资源媒体时记录下原道闸的个数
                adLimit: [
                    {value: '地产', label: '地产'},
                    {value: '汽车', label: '汽车'},
                    {value: '美容', label: '美容'},
                    {value: '餐饮', label: '餐饮'},
                    {value: '食品', label: '食品'},
                    {value: '金融', label: '金融'},
                    {value: '低俗', label: '低俗'},
                ],
                //资源表单
                recForm: {
                    rt: '',                //资源类型
                    resname: '',          // 资源名称
                    city: [],
                    region: '',          // 所属区域
                    business: '',       // 所属商圈
                    resaddr: '',        // 资源地址
                    floorType: '',  // 楼盘类型
                    doorwayNum: '1',   // 出入数
                    buildingNum: '1',  // 楼栋数量
                    households: '1',   // 住户数量
                    peopleFlowrate: '',  //人流量
                    carNumber: '',        // 车位数
                    carFlowrate: '',     // 车流量
                    buildingPrice: '',  // 楼盘价格
                    liveTime: '',
                    lng: '',
                    lat: '',
                    pmc: '',
                    fullViewUrl:'',             // 资源图片
                    addressAlias: '',           // 地址别名
                    description: '',            // 描述
                    supportingFacilities: '',   // 周边配套
                    transportation: '',         // 交通状况
                    buildingType: '',           // 建筑类型
                    floorSpace: '',             // 占地面积
                    constructionSpace: '',      // 建筑面积
                    plotRatio: '',              // 容积率
                    buildingStructure: '',      // 建筑结构
                    greenPercentage: '',        // 绿化率
                    ownershipPeriod: '',        // 产权年限
                    developer: '',              // 开发商
                    propertyManagement: '',     // 物业公司
                    managementFee: '',          // 物业费
                    salesOfficeAdd: '',         // 售楼地址
                    preSalePermit: '',          // 预售许可证
                    ownershipType: '',          // 产权性质
                },
                resAddres: {city:'',area:'',},  // 市区域地址获取经纬度
                recRules: {
                    rt: [
                        {required: true, message: '请选择资源类型', trigger: 'change'},
                    ],
                    resname: [
                        {required: true, message: '资源名称不能为空', trigger: 'blur'},
                        {validator: validateSpace, trigger: 'blur'},
                        {max: 40, message: '最多只能输入40个字节', trigger: 'blur'}
                    ],
                    city: [
                        {required: true, message: '请选择所属城市', trigger: 'change'},
                    ],
                    region: [
                        {required: true, message: '请选择所属区域', trigger: 'change'},
                    ],
                    business: [
                        {validator: validateSpace, trigger: 'blur'},
                        {min: 0, max: 40, message: '最多只能输入40个字节', trigger: 'blur'}
                    ],
                    resaddr: [
                        {required: true, message: '具体地址不能为空', trigger: 'blur'},
                        {validator: validateSpace, trigger: 'blur'},
                        {min: 0, max: 70, message: '最多只能输入70个字节', trigger: 'blur'}
                    ],
                    floorType: [
                        {required: true, message: '请选择楼盘类型', trigger: 'change'},
                    ],
                    buildingNum: [
                        {required: true, message: '楼栋数量不能为空', trigger: 'blur'},
                    ],
                    households: [
                        {required: true, message: '住户数量不能为空', trigger: 'blur'},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    buildingPrice: [
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    liveTime: [
                        {required: true, message: '请选择年份', trigger: 'change'},
                    ],
                    lat: [
                        {required: true, message: '经度不能为空', trigger: 'change'},
                        {required: true,validator: validateLat, trigger: 'change'},
                    ],
                    lng: [
                        {required: true, message: '纬度不能为空', trigger: 'change'},
                        {required: true,validator: validateLng, trigger: 'change'},
                    ],
                    pmc: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    carNumber: [
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    carFlowrate: [
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    peopleFlowrate: [
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    greenPercentage: [  // 绿化率
                        {validator: validateGreenP, trigger: 'change'},
                    ],
                    plotRatio: [        // 容积率
                        {validator: validateGreenP, trigger: 'change'},
                    ],
                    developer: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    managementFee: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    salesOfficeAdd: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    salesPhoneNumber: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    preSalePermit: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    ownershipType: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    discount: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    buildingStructure: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    ownershipPeriod: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                    constructionSpace: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'change'}
                    ],
                },
                assetIdRules: [
                    {validator: validateAssetId, trigger: 'blur'},
                    {max: 40, message: '最多只能输入40个字节', trigger: 'blur'}
                ],
                mediaRules: {
                    mediaName: [
                        {required: true, message: '媒体名称不能为空', trigger: 'blur'},
                        {validator: validateSpace, trigger: 'blur'},
                        {max: 40, message: '最多只能输入40个字节', trigger: 'blur'}
                    ],
                    usableNum: [
                        {validator: validateNum, trigger: 'blur'},
                        {required: true, message: '可投面数不能为空', trigger: 'blur'},
                    ],
                    mstate: [
                        {required: true, message: '请选择媒体状态', trigger: 'change'},
                    ],
                    assetId: [
                        {required: true, message: '资产编号不能为空', trigger: 'blur'},
                        {validator: validateAssetId, trigger: 'blur'},
                        {max: 40, message: '最多只能输入40个字节', trigger: 'blur'}
                    ],
                    doorType: [
                        {required: true, message: '媒体类型不能为空', trigger: 'blur'},
                        {validator: validateSpace, trigger: 'blur'},
                        {required: true, min: 1, max: 20, message: '最多只能输入20个字节', trigger: 'blur'}
                    ],
                    adSizeW: [
                        {required: true, type: 'string', message: '宽度不能为空', trigger: 'change'},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    adSizeH: [
                        {required: true, type: 'string', message: '高度不能为空且只能为数字', trigger: 'change'},
                        // {type: 'number', min: 1, max: 9999999, message: '最大值9999999', trigger: 'blur'},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    visualW: [
                        {required: true, type: 'string', message: '不能为空且只能输入数字', trigger: 'change'},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    visualH: [
                        {required: true, type: 'string', message: '不能为空且只能输入数字', trigger: 'change'},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    mediaRemark: [
                        {max: 200, message: '最多只能输入200个字符', trigger: 'blur'}
                    ],
                },
                //道闸表单验证
                roadGateRules:{
                    mediaName: [
                        {required: true, message: '媒体名称不能为空', trigger: 'blur'},
                        {validator: validateSpace, trigger: 'blur'},
                        {max: 40, message: '最多只能输入40个字节', trigger: 'blur'}
                    ],
                    usableNum: [
                        {validator: validateNum, trigger: 'blur'},
                        {required: true, message: '可投面数不能为空', trigger: 'blur'},
                        // { type:'number', min:1, max:26, message:'最多可投26面',trigger:'blur'},
                    ],
                    mstate: [
                        {required: true, message: '请选择媒体状态', trigger: 'change'},
                    ],
                    assetId: [
                        {required: true, message: '资产编号不能为空', trigger: 'blur'},
                        {validator: validateAssetId, trigger: 'blur'},
                        {max: 40, message: '最多只能输入40个字节', trigger: 'blur'}
                    ],
                    LBSizeW: [
                        {required: true, type: 'string', message: '宽度不能为空且只能为数字', trigger: 'change'},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    LBSizeH: [
                        {required: true, type: 'string', message: '高度不能为空且只能为数字', trigger: 'change'},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    visualW: [
                        {required: true, type: 'string', message: '不能为空且只能输入数字', trigger: 'change'},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    visualH: [
                        {required: true, type: 'string', message: '不能为空且只能输入数字', trigger: 'change'},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    mediaRemark: [
                        {max: 200, message: '最多只能输入200个字符', trigger: 'blur'}
                    ],
                },
                recFormImg: '',              // 资源图片
                mediaFormImg: '',            // 媒体图片
                cityOptions: [],             //城市数组
                rt_village: true,            // 资源类型是否是社区
                regionOpt: [],               // 地区
                floorType: [                 // 显示-楼盘类型或写字楼类型  普通住宅  别墅 商住
                    {label: '高端住宅', value: '高端住宅'},
                    {label: '普通住宅', value: '普通住宅'},
                    {label: '单体楼', value: '单体楼'},
                    {label: '洋房', value: '洋房'},
                    {label: '商住', value: '商住'},
                ],
                officeBuilding: [           // 写字楼类型
                    {lable: '单纯性写字楼', value: '单纯性写字楼'},
                    {lable: '商住型写字楼', value: '商住型写字楼'},
                    {lable: '综合型写字楼', value: '综合型写字楼'},
                ],
                village:[                   // 社区
                    {label: '高端住宅', value: '高端住宅'},
                    {label: '普通住宅', value: '普通住宅'},
                    {label: '单体楼', value: '单体楼'},
                    {label: '洋房', value: '洋房'},
                    {label: '商住', value: '商住'},
                ],
                selectedOptions: [],        // 城市默认选项
                PathHaveEdit: false,        // 新建/编辑
                mediaImg_title: '',         // 媒体图片对应的媒体信息
                rgImg_title:'',             // 道闸对应的媒体信息
                mediaImg: {                 // 媒体图片
                    uid: JSON.parse(sessionStorage.getItem('session_data')).uID,
                    pid: '',                // 图片id
                    palt: '',               // 图片标题
                    ptype: '',              // 关联类型
                    ptid: '',               // 关联类型对应唯一ID
                    ptp: ''                 // 关联类型区分属性
                },
                roadGateImg: [              // 道闸图片
                    {
                        text: '媒体一',
                        mediaImg: {
                            uid: JSON.parse(sessionStorage.getItem('session_data')).uID,
                            pid: '',                // 图片id
                            palt: '',               // 图片标题
                            ptype: '',              // 关联类型
                            ptid: '',               // 关联类型对应唯一ID
                            ptp: ''                 // 关联类型区分属性
                        }
                    }
                ],
                liveTime: '',                   // 资源时间
                doUpload: '/advertisement/UpLoad',     //https://beta.qinlinad.com,
                resImg: {                       // 上传图片附带参数
                    uid: JSON.parse(sessionStorage.getItem('session_data')).uID,
                    pid: '',                // 图片id
                    palt: '',               // 图片标题
                    ptype: '',              // 关联类型
                    ptid: '',               // 关联类型对应唯一ID
                    ptp: 'media'            // 关联类型区分属性
                },
                resUpdata: [],              // 编辑资源时显示已有图片
                updataMedia: [],
                editMediaLength: 0,             // 编辑状态下 - 记录广告门原个数以禁止删除
                editRoadGateLength: 0,          // 编辑状态下 - 记录道闸原个数以禁止删除
                mediaIndex: 0,                  // 当选择广告限制是记录下媒体的下标
                Editloading: true,              // 提交时的loading
                throwCity: '',                  // 用户权限不为全国时，根据uWho确定可选城市
                uWho_throwCity: '',             // 用户权限不为全国时
                cityOther: true,                // 默认显示全国省份城市
                beforeResPID: '',               // 编辑资源前资源图片的pid
                resImgDialog: false,            // 资源图片，大图
                resImgUrl: '',                  // 上传成功后的url地址，用于显示大图
                resData: {resID:''},            // 创建资源成功，保存返回来的数据
                sessionData: JSON.parse(sessionStorage.getItem('session_data')),
                submitBtnIsAble: false,         // 防止多次点击
                mediaADImg:[],                  // 广告门媒体图片
                mediaImgDialogVisible: false,   // 媒体图片放大的模态框
                mediaImgSrc: [],                // 媒体图片放大时图片链接
                mediaImgTitle:'',               // 当前图片的媒体名称
                mediaLevel: [                   // 媒体等级
                    {label: 'A级',value: "A"},
                    {label: 'B级',value: "B"},
                    {label: 'C级',value: "C"}
                ],
                FangJiaWangData: {},            // 记录房价网拉回来的数据
                classified: false,
            };
        },
        mounted: function () {
            this.resUpdata = []
            this.ShowRegion()
            this.editFun()       // 编辑方法
            this.getADLimit()   // 获取广告限制列表
        },
        methods: {
            handleClickMedia(tab, event){
                console.log(tab, event)
            },
            // 获取广告限制列表
            getADLimit() {
                let params = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service":"GetNotPush",
                    "data": {}
                }
                api.postApi_new(this.Media, params).then(res => {
                    console.log('广告限制列表', res)
                    if(res.data.SysCode == 200200){
                        let limit = res.data.data
                        let limitArr = []
                        for (let i = 0; i < limit.length; i++) {
                            if (i === 0) {
                                let NoLimit = {value: '不限', label: '不限'}
                                limitArr.push(NoLimit)
                            }
                            let limitObj = {value: limit[i].nTitle, label: limit[i].nTitle}
                            limitArr.push(limitObj)
                        }
                        this.adLimit = limitArr
                        console.log('广告限制adLimit', this.adLimit)
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout()
                    }
                })
            },
            //获取区域
            getRegion(val){
                console.log('val',val) //resAddres
                for(let key of this.regionOpt){
                    if(key.value == val){
                        this.resAddres.area = key.label
                    }
                }
            },
            // 远程获取房价网的小区名称
            getResNameByFangJiaWang(queryString, callback){
                if(queryString){
                    if(this.resAddres.city){
                        let params = {
                            city: this.resAddres.city,          // 城市
                            keyword: queryString,
                            max: 20,
                        }
                        api.postApi(this.QADNAPI + '/ResAutoComplete', params).then(res => {
                            console.log('远程获取房价网的小区名称res', res)
                            if (res.data.code === '200200' || res.data.msg === 'success') {
                                if(res.data.data.code == '200' || res.data.data.msg === 'ok'){
                                    let results = []
                                    for (let key of res.data.data.result) {
                                        results.push({
                                            value: key.name,
                                            district: key.district,
                                            address: key.address,
                                        })
                                    }
                                    callback(results)
                                }else{
                                    this.messageFun('warning',res.data.data.msg)
                                    callback([])
                                }
                            } else {
                                this.messageFun('warning',res.data.msg)
                                callback([])
                            }
                        })
                    }else{
                        this.messageFun('warning','请先选择社区所在的城市')
                    }
                }
            },
            // 根据选择的小区获取所在区域
            changeResName(item){
                console.log(item)
                for(let key of this.regionOpt){
                    if(key.label.includes(item.district)){
                        this.recForm.region = key.value
                        this.resAddres.area = key.label
                        break
                    }
                }
            },
            // 根据所选的资源名称拉取房价网数据
            getResBasicData(){
                // recForm.resname
                if(this.recForm.resname !== '' && this.resAddres.area !== '' && this.resAddres.city !== ''){
                    let params = {
                        // uid: this.sessionData.uID,
                        // token: this.sessionData.token,
                        city: this.resAddres.city,
                        district: this.resAddres.area,
                        name: this.recForm.resname
                    }
                    api.postApi(this.QADNAPI + '/GetResDetails', params).then(res => {
                        console.log('res', res)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            this.loginTimeout()
                        } else {
                            if(res.data !== ''){
                                let obj = res.data.data
                                this.recForm.resaddr = obj.address || ''                    // 资源地址
                                this.recForm.business = obj.commercialArea || ''            // 商圈
                                this.recForm.floorType = obj.propertyType                   // 楼盘类型
                                // this.recForm.doorwayNum = obj.doorwayNum                 // 出入数
                                this.recForm.buildingNum = obj.buildingCount                // 楼栋数量
                                this.recForm.households = obj.totalUnitCount                // 住户数量
                                this.recForm.peopleFlowrate = obj.peopleFlowrate || ''      // 人流量
                                this.recForm.carNumber = obj.parking || ''                  // 车位数
                                this.recForm.carFlowrate = obj.carFlowrate || ''            // 车流量
                                this.recForm.buildingPrice = obj.avgPrice                   // 楼盘价格
                                this.recForm.liveTime = obj.finishYear ? obj.finishYear.toString() : ''           // 入住年份
                                this.recForm.lng = obj.lat                                  // 纬度
                                this.recForm.lat = obj.lng                                  // 经度
                                //
                                this.recForm.addressAlias = obj.addressAlias[0]                         // 地址别名
                                this.recForm.description = obj.description || ''                     // 描述
                                this.recForm.supportingFacilities = obj.supportingFacilities || ''   // 周边配套
                                this.recForm.buildingType = obj.buildingType || ''                   // 建筑类型
                                this.recForm.transportation = obj.transportation || ''               // 交通状况
                                this.recForm.floorSpace = obj.floorSpace || ''                       // 占地面积
                                this.recForm.constructionSpace = obj.constructionSpace || ''         // 建筑面积
                                this.recForm.buildingStructure = obj.buildingStructure || ''         // 建筑结构
                                this.recForm.greenPercentage = obj.greenPercentage || ''             // 绿化率
                                this.recForm.ownershipPeriod = obj.ownershipPeriod || ''             // 产权年限
                                this.recForm.plotRatio = obj.plotRatio || ''                         // 容积率
                                this.recForm.developer = obj.developer || ''                         // 开发商
                                this.recForm.pmc = obj.propertyManagement || ''                      // 物业公司
                                this.recForm.managementFee = obj.managementFee || ''                 // 物业费
                                this.recForm.salesOfficeAdd = obj.salesOfficeAdd || ''               // 售楼地址
                                this.recForm.preSalePermit = obj.preSalePermit || ''                 // 预售许可证
                                this.recForm.ownershipType = obj.ownershipType || ''                 // 产权性质
                                this.recForm.salesPhoneNumber = obj.salesPhoneNumber || ''           // 售楼电话

                                this.FangJiaWangData = JSON.parse(JSON.stringify(this.recForm)) //
                            }else{
                                this.$message.warning('数据获取异常,暂无该小区数据！')
                            }
                        }
                    })
                } else {
                    this.$message.warning('资源名称及市区域都不能为空！')
                }
            },
            // 根据填写的具体地址去获取经纬度
            querySearchAsync(queryString, callback) {
                let uid = this.sessionData.uID
                if (queryString) {
                    let params = {
                        uid: uid,
                        token: this.sessionData.token,
                        address:   this.resAddres.city  +  this.resAddres.area + this.recForm.resaddr
                    }
                    console.log('根据填写的具体地址去获取经纬度',params)
                    api.postApi(this.Map + '/Geocoder', params).then(res => {
                        console.log('Geocoder', res)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            this.loginTimeout()
                        } else {
                            if(res.data.status == 0){
                                this.recForm.lat = res.data.result.location.lng.toFixed(6)     // 经度
                                this.recForm.lng = res.data.result.location.lat.toFixed(6)     // 纬度
                            }
                            let timeout = setTimeout(() => {
                                clearTimeout(timeout)
                                callback([]);
                            }, 3000 * Math.random());
                        }
                    });
                }
            },
            // 广告限制，当选择为不限时
            changeAdLimit(val) {
                let valArr = val
                console.log('选择了的广告限制', valArr)
                for (let i = 0; i < valArr.length; i++) {
                    if (valArr[i] === '不限') {
                        this.arrMedia[this.mediaIndex].mediaForm.adLimit = []
                    }
                }
            },
            // 当广告限制的选择框获取焦点的时候，记录下当前媒体的下标
            adLimitFocus(key) {
                console.log('当前key值为', key)
                this.mediaIndex = key
            },
            //新增媒体面板
            mediaAddFun() {
                let mediaArr = [
                    {
                        text: '媒体二', mediaForm: {
                            mediaType: '广告门',
                            mediaName: '',
                            usableNum: '2',
                            mstate: '',
                            assetId: '',
                            doorType: '',
                            adSizeW: '',
                            adSizeH: '',
                            visualW: '',
                            visualH: '',
                            mediaRemark: '',
                            adLimit: [],
                            mImg:'',
                            updataImg:[],
                            assetIdBolean: false,
                            adDoorLevel: [],
                        }
                    },
                ]
                if (this.PathHaveEdit) {
                    mediaArr[0].mediaForm.mediaType = '广告门'
                }
                mediaArr[0].text = this.titleArr[++this.ADTitleIndex]
                // mediaImgArr[0].text = mediaArr[0].text
                if (this.ADTitleIndex < 50) {
                    this.arrMedia.push(mediaArr[0])
                } else {
                    Message({
                        message: '最多同时支持五十个媒体面板的操作！',
                        type: 'warning'
                    })
                }
            },
            //删除广告门媒体面板
            mediaDelBtnFun(index) {
                this.arrMedia.splice(index, 1)   // 删除指定下标媒体面板
                console.log('长度为', this.arrMedia.length, 'index:', index)
                if (index < this.arrMedia.length) {   // 修改面板title标签
                    for (let i = 0; i < this.arrMedia.length; i++) {
                        this.arrMedia[i].text = this.titleArr[i]
                    }
                }
                this.ADTitleIndex--
            },
            // 新增道闸面板
            roadGateAddFun(){
                let roadGateMedia = [
                    {
                        text: '媒体二',
                        roadGateForm: {
                            mediaType: '道闸',   //道闸类型mVehicle
                            mediaName: '',  //道闸名称mtitle
                            usableNum: '3',   //广告位面数pnum
                            mstate: '',       //道闸状态mstate
                            assetId: '',      //资产编号assettag
                            LBSizeW: '',      //灯箱尺寸高度
                            LBSizeH: '',     //灯箱尺寸宽度
                            visualW: '',      //可视画面adviewsize
                            visualH: '',      //可视画面
                            mediaRemark: '',  //备注 mrk
                            adLimit: [],     //请选择广告限制 notpush
                            mImg: '',
                            updataImg:[],
                            assetIdBolean: false,
                        },
                    },
                ]
                roadGateMedia[0].text = this.titleArr[++this.roadGateTitleIndex]
                if (this.roadGateTitleIndex < 50) {
                    this.roadGateMedia.push(roadGateMedia[0])
                } else {
                    Message({
                        message: '最多同时支持五十个媒体面板的操作！',
                        type: 'warning'
                    })
                }
            },
            //删除道闸媒体面板
            roadGateDelBtnFun(index){
                this.roadGateMedia.splice(index, 1)   //  删除指定下标媒体面板
                console.log('长度为', this.roadGateMedia.length, 'index:', index)
                if (index < this.roadGateMedia.length) {   // 修改面板title标签
                    for (let i = 0; i < this.roadGateMedia.length; i++) {
                        this.roadGateMedia[i].text = this.titleArr[i]
                    }
                }
                this.roadGateTitleIndex--
            },
            // 城市地区联动-省级
            ShowRegion() {
                this.cityOther = true
                this.cityOptions = areaPackageNew.province()
            },
            // uWho为全国时，根据市级城市rid，获取它的下属区、县
            handleChange(value) {
                this.recForm.region = ''
                console.log('handleChange', value)
                let cityRID = value[1]
                let cityName = areaToTextNew.toTextCity(cityRID)
                this.resAddres.city = cityName
                let regionArr = areaPackageNew.findArea(cityRID)
                console.log(cityName,'获取选中城市的区域', regionArr)
                let region = []
                for (let i = 0; i < regionArr.length; i++) {
                    let obj = {label: regionArr[i].rName, value: regionArr[i].rID}
                    region.push(obj)
                }
                this.regionOpt = region
                console.log('this.regionOpt', this.regionOpt)
            },
            // uWho不为全国时，根据市级城市rid，获取它的下属区、县
            recFormCity(val) {
                // this.recForm.region = ''
                // console.log('val', val)
                // console.log('资源所在城市', this.recForm.city)
                // this.resAddres.city = areaToTextNew.toTextCity(val)
                // let regionArr = areaPackageNew.findArea(val)
                // console.log('获取选中城市的区域', regionArr)
                // let region = []
                // for (let i = 0; i < regionArr.length; i++) {
                //     let obj = {label: regionArr[i].rName, value: regionArr[i].rID}
                //     region.push(obj)
                // }
                // this.regionOpt = region
                // console.log('this.regionOpt', this.regionOpt)
            },
            // 选择资源类型时的修改资源字段显示
            selectRec(val) {
                this.recForm.floorType = ''
                if (val === '1') {    // 社区
                    this.rt_village = true
                    this.floorType = this.village
                } else if (val === '2') {    // 写字楼
                    this.rt_village = false
                    this.floorType = this.officeBuilding
                }
            },
            // 选择入住时间,修改时间格式
            getTime(date) {
                console.log('入住时间', date);
                console.log('this.recForm.liveTime', this.recForm.liveTime, '数据类型为:', typeof(this.recForm.liveTime))
            },
            // 选择媒体状态为待安装时修改资源编号的验证为非必填
            selectMstate(val) {
                console.log('选择了', val)
                let valArr = val.mstate.split('')
                console.log('valArr', valArr)
                let i = Number(valArr[1])
                if(this.PathHaveEdit){
                    if(val.mediaType === '广告门' && i <= this.editMediaLength - 1){
                        // console.log('判断记录编辑广告门媒体的状态')
                        // if (this.arrMediaStatue[i] == 2 || this.arrMediaStatue[i] === '待安装') {
                        //     this.arrMedia[i].mediaForm.assetIdBolean = true
                        //     Message({
                        //         type: 'warning',
                        //         message: '请在亲邻助手中完成安装任务',
                        //     })
                        //     this.arrMedia[i].mediaForm.mstate = '2' + i
                        // } else if (valArr[0] === '2') {
                        //     this.arrMedia[i].mediaForm.assetIdBolean = false
                        //     Message({
                        //         type: 'warning',
                        //         message: '请按正常流程走，当前媒体已安装'
                        //     })
                        //     if (this.arrMediaStatue[i] === '禁用' || this.arrMediaStatue[i] == 0) {
                        //         this.arrMedia[i].mediaForm.mstate = '0' + i
                        //     } else if (this.arrMediaStatue[i] === '正常' || this.arrMediaStatue[i] == 1) {
                        //         this.arrMedia[i].mediaForm.mstate = '1' + i
                        //     } else if (this.arrMediaStatue[i] === '待维修' || this.arrMediaStatue[i] == 3) {
                        //         this.arrMedia[i].mediaForm.mstate = '3' + i
                        //     }
                        // } else {
                            this.arrMedia[i].mediaForm.assetIdBolean = false
                            this.editMState(val.mid,valArr[0])
                        // }
                    }else if(val.mediaType === '道闸' && i <= this.editRoadGateLength - 1){
                        console.log('判断记录编辑道闸媒体的状态')
                        if (this.editRoadGateStatue[i] == 2 || this.editRoadGateStatue[i] === '待安装') {
                            this.roadGateMedia[i].roadGateForm.assetIdBolean = true
                            Message({
                                type: 'warning',
                                message: '请在亲邻助手中完成安装任务',
                            })
                            this.roadGateMedia[i].roadGateForm.mstate = '2' + i
                        } else if (valArr[0] === '2') {
                            this.roadGateMedia[i].roadGateForm.assetIdBolean = false
                            Message({
                                type: 'warning',
                                message: '请按正常流程走，当前媒体已安装'
                            })
                            if (this.editRoadGateStatue[i] === '禁用' || this.editRoadGateStatue[i] == 0) {
                                this.roadGateMedia[i].roadGateForm.mstate = '0' + i
                            } else if (this.editRoadGateStatue[i] === '正常' || this.editRoadGateStatue[i] == 1) {
                                this.roadGateMedia[i].roadGateForm.mstate = '1' + i
                            } else if (this.editRoadGateStatue[i] === '待维修' || this.editRoadGateStatue[i] == 3) {
                                this.roadGateMedia[i].roadGateForm.mstate = '3' + i
                            }
                        } else {
                            this.roadGateMedia[i].roadGateForm.assetIdBolean = false
                            this.editMState(val.mid,valArr,i)
                        }
                    }else{
                        this.newMediaChangeMstatus(val.mediaType,valArr,i)
                    }
                }else{
                    this.newMediaChangeMstatus(val.mediaType,valArr,i)
                }
                console.log('this.$refs',this.$refs['ResAssetId'])
                this.$refs['ResAssetId'][0].clearValidate() // 清除资产编号的验证
            },
            // 新建媒体时的媒体状态或编辑时新增媒体
            newMediaChangeMstatus(mkind,mState,index) {
                console.log('mkind',mkind,'mState',mState,'index',index)
                if (mState[0] === '2') {
                    if(mkind === '广告门'){
                        this.arrMedia[index].mediaForm.assetIdBolean = true
                        this.arrMedia[index].mediaForm.assetId = ''
                    }else if(mkind === '道闸'){
                        this.roadGateMedia[index].roadGateForm.assetIdBolean = true
                        this.roadGateMedia[index].roadGateForm.assetId = ''
                    }
                } else {
                    if(mkind === '广告门'){
                        this.arrMedia[index].mediaForm.assetIdBolean = false
                        if (this.arrMedia[index].mediaForm.assetId === '') {
                            this.arrMedia[index].mediaForm.assetId = ' '
                            let that = this
                            setTimeout(function () {
                                that.arrMedia[index].mediaForm.assetId = ''
                            }, 10)
                        }
                    }else if(mkind === '道闸'){
                        this.roadGateMedia[index].roadGateForm.assetIdBolean = false
                        if (this.roadGateMedia[index].roadGateForm.assetId === '') {
                            this.roadGateMedia[index].roadGateForm.assetId = ' '
                            let that = this
                            setTimeout(function () {
                                that.roadGateMedia[index].roadGateForm.assetId = ''
                            }, 10)
                        }
                    }
                }
            },
            //添加资源媒体
            createRec() {
                console.log(this.arrMedia)
                this.recForm.uid = this.sessionData.uID
                this.recForm.latlng = this.recForm.lat + ';' + this.recForm.lng
                console.log('this.recForm', this.recForm)
                for (let i = 0; i < this.arrMedia.length; i++) {
                    console.log('arrMedia', i, this.arrMedia[i].mediaForm)
                }
                let recObj = {
                    uid: this.recForm.uid,
                    rid: Number(this.recForm.region),
                    ta: this.recForm.business,          // 所属商圈
                    rt: this.recForm.rt,                // 资源类型
                    resname: this.recForm.resname,      // 资源名称
                    resaddr: this.recForm.resaddr,      // 资源地址
                    // 这里的lat为经度、lng为纬度(与生活中的lng*lat经纬度字符标识刚好相反)
                    latlng: this.recForm.latlng,        // 经纬度 重庆:9.61;106.47  北京:116.46;39.92 广州: 113.27;23.13  上海:121.29;31.11 深圳:113.46;22.27
                    ct: this.recForm.floorType,         //楼盘类型
                    cd: this.recForm.liveTime,          // 入住时间 '2017'
                    hp: (this.recForm.buildingPrice * 100).toFixed(0),  // 楼盘价格
                    fn: this.recForm.buildingNum,                       // 楼栋数量
                    dn: this.recForm.doorwayNum,                        // 出入口数量
                    hn: this.recForm.households,                        // 小区户数
                    pmc: this.recForm.pmc,                              // 物业公司
                    peopleFlow: this.recForm.peopleFlowrate,            //人流量
                    carFlow: this.recForm.carFlowrate,                  //车流量
                    parkSpaceNum: this.recForm.carNumber,               //车位数
                    fullViewUrl: this.recForm.fullViewUrl,              // 资源图片

                    city: this.resAddres.city,
                    district: this.resAddres.area,
                    addressAlias: this.recForm.addressAlias,                   // 地址别名
                    description: this.recForm.description,                     // 描述
                    supportingFacilities: this.recForm.supportingFacilities,   // 周边配套
                    buildingType: this.recForm.buildingType,                   // 建筑类型
                    transportation: this.recForm.transportation,               // 交通状况
                    floorSpace: this.recForm.floorSpace,                       // 占地面积
                    constructionSpace: this.recForm.constructionSpace,         // 建筑面积
                    buildingStructure: this.recForm.buildingStructure,         // 建筑结构
                    greenPercentage: this.recForm.greenPercentage,             // 绿化率
                    plotRatio: this.recForm.plotRatio,                         // 容积率
                    ownershipPeriod: this.recForm.ownershipPeriod,             // 产权年限
                    developer: this.recForm.developer,                         // 开发商
                    // pmc: this.recForm.propertyManagement,                      // 物业公司
                    managementFee: this.recForm.managementFee,                 // 物业费
                    salesOfficeAdd: this.recForm.salesOfficeAdd,               // 售楼地址
                    preSalePermit: this.recForm.preSalePermit,                 // 预售许可证
                    ownershipType: this.recForm.ownershipType,                 // 产权性质
                    salesPhoneNumber: this.recForm.salesPhoneNumber,           // 售楼电话
                    discount: this.recForm.discount
                }
                for (let key in recObj) {
                    if (recObj[key] === undefined || recObj[key] === null) {
                        recObj[key] = ''
                    }
                }
                let params = {
                    uid: this.sessionData.uID,
                    service:"AddRes",
                    token: this.sessionData.token,
                    data: recObj
                }
                api.postApi_new(this.Media, params).then(res => {
                    console.log('资源数据：', res.data)
                    let recData = res.data.data
                    this.resData = recData
                    if (res.data.SysCode == 200200) {
                        // 设置资源图片信息
                        this.resImg.ptid = recData.resID        // 资源图片的ptid就是资源的id
                        this.resImg.palt = this.recForm.resname + '-' + recData.rID
                        // this.setImg()
                        Message({
                            message: '资源媒体创建成功！',
                            type: 'success'
                        })
                        this.creadMediaFun(0,0)
                    } else if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时'){
                        this.Editloading.close()
                        this.loginTimeout()
                    }else {
                        this.Editloading.close()
                        Message({
                            message: '资源创建失败！',
                            type: 'warning'
                        })
                    }
                }).catch(err => {
                    console.log('新建资源请求错误', err)
                    Message({
                        message: '新建资源请求异常',
                        type: 'warning'
                    })
                })
            },
            // 批量创建媒体
            creadMediaFun(adIndex,rtIndex,String){
                let rid = ''
                let resID = ''
                if (this.PathHaveEdit) {
                    rid = this.recForm.region
                    resID = sessionStorage.getItem('resID')
                } else {
                    rid = this.resData.rID
                    resID = this.resData.resID
                }
                console.log('adIndex',adIndex,'rtIndex',rtIndex)
                console.log('String',String)
                let arr = []
                if(this.m_boolean){
                    let mediaFrom = this.arrMedia
                    for (let i = adIndex; i < mediaFrom.length; i++) {
                        let key = mediaFrom[i].mediaForm
                        arr.push({
                            resID: resID,
                            uID: this.recForm.uid,
                            mTitle: key.mediaName,
                            pNum: key.usableNum,
                            adSize: key.adSizeW + "*" + key.adSizeH,
                            adViewSize: key.visualW + "*" + key.visualH,
                            notPush: key.adLimit.join('、'),
                            assetTag: key.assetId,
                            mType: key.doorType,
                            mImg: key.mImg || '',
                            mVehicle: key.mediaType,
                            mRemark: key.mediaRemark, // key.mediaRemark === '' ? '暂无备注' : key.mediaRemark,
                            mState: (key.mstate).split('')[0],
                            // picSize:'',
                            // lightBoxSize:'',
                        })
                    }
                }
                if(this.rt_boolean){

                    let mediaFrom = this.roadGateMedia
                    for (let i = rtIndex; i < mediaFrom.length; i++){
                        let key = mediaFrom[i].roadGateForm
                        arr.push({
                            resID: resID,
                            uID: this.recForm.uid,
                            mTitle: key.mediaName,
                            pNum: key.usableNum,
                            adSize: '',
                            adViewSize: '',
                            notPush: key.adLimit.join('、'),
                            assetTag: key.assetId,
                            mType: '',
                            mImg: key.mImg || '',
                            mVehicle: key.mediaType,
                            mRemark: key.mediaRemark,   // key.mediaRemark === '' ? '暂无备注' : key.mediaRemark,
                            mState: (key.mstate).split('')[0],
                            picSize: key.visualW + "*" + key.visualH,
                            lightBoxSize:  key.LBSizeW + "*" + key.LBSizeH,
                        })
                    }
                }
                let params = {
                    uid: this.sessionData.uID,
                    service:"CreateMediaBatch",
                    token: this.sessionData.token,
                    data: {
                        medias: arr,
                        rId: rid
                    }
                }
                console.log('params',params)
                if(params.data.medias.length){
                    api.postApi_new(this.Media , params).then(res => {
                        console.log('批量创建媒体',res)
                        this.Editloading.close()
                        if(res.data.SysCode == 200200 && res.data.data.length > 0){
                            // this.pushResMediaToWydt(res.data.data)
                            Message({
                                message: '媒体创建成功',
                                type: 'success'
                            })
                            if(String !== 'edit'){
                                this.$confirm('资源媒体创建成功!', '提示', {
                                    confirmButtonText: '继续创建',
                                    cancelButtonText: '前往列表',
                                    showClose: false,
                                    type: 'success '
                                }).then(() => {
                                    this.resetForm()  // 请求成功后重置表单
                                    this.resUpdata = []
                                }).catch(() => {
                                    this.resetForm()
                                    // window.history.go(-1)
                                    this.$router.push('./mediaList');
                                })
                            }else{
                                this.$router.push('./mediaDetail');
                            }
                        } else if (res.data.SysCode == 100302){
                            this.loginTimeout()
                        }else{
                            Message({
                                message: '媒体创建失败',
                                type: 'warning'
                            })
                        }
                    })
                }else{
                    console.log('媒体数据为空')
                }
            },
            // 将创建的媒体资源绑定到地图无忧标注的社区
            pushResMediaToWydt(mIDArr){
                let params = {
                    "service":"PushMediaToDtwy",
                    "data": {
                        resID: this.resData.resID,
                        mIDs: mIDArr,
                    }
                }
                console.log('资源媒体图片-无忧地图参数',params)
                api.postApi_new(this.Media, params).then(res =>{
                    console.log('资源媒体图片无忧地图',res)
                })
            },
            // 资源图片上传前验证格式和大小
            beforeUpload_res(file) {
                const isJPG = file.type === "image/jpeg" || file.type === "image/png";
                const isLt2M = file.size / 1024 / 1024 < 4;

                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 4MB!');
                }
                return isJPG && isLt2M;
            },
            // 资源图片上传成功
            handleDownSuccess(res) {
                console.log('上传资源图片', res)
                this.recForm.fullViewUrl = res[0].pURL
                console.log('this.recForm',this.recForm)
            },
            // 删除原资源图片，进行重新选择
            handleRemoveR(file, fileList) {
                console.log('删除或修改了资源图片', file, fileList)
                this.recForm.fullViewUrl = ''
            },
            // 资源图片放大
            handlePictureCardPreview_res(file) {
                console.log('资源图片放大',file)
                this.resImgUrl = file.url
                this.resImgDialog = true
            },

            // 设置媒体图片信息
            saveImgInfo(m_title) {
                this.$message.warning('该功能暂未开放！');
                console.log('获取当前媒体标题', m_title)
                this.mediaImg_title = m_title
            },
            // 广告门图片上传前校验
            beforeUpload_ad(file) {
                this.$message.error('该功能暂未开放！');
                return false
                // const isJPG = file.type === "image/jpeg" || file.type === "image/png";
                // const isLt6M = file.size / 1024 / 1024 < 6;
                //
                // if (!isJPG) {
                //     this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                // }
                // if (!isLt6M) {
                //     this.$message.error('上传图片大小不能超过 6MB!');
                // }
                // return isJPG && isLt6M;
            },
            // 广告门图片上传成功
            adUploadSuccess(res) {
                console.log('上传媒体图片', res) // mediaADImg
                for(let key of this.arrMedia){
                    if(this.mediaImg_title === key.text){
                        if(key.mediaForm.mImg === ''){
                            key.mediaForm.mImg = res[0].pURL
                        }else{
                            key.mediaForm.mImg  = key.mediaForm.mImg  + ';' + res[0].pURL
                        }
                        break
                    }
                }
                console.log(this.updataMedia,'媒体图片上传成功',this.arrMedia)
            },
            //广告门图片放大
            handlePictureCardPreview(file) {
                console.log('媒体图片放大',this.arrMedia)
                let timer = setTimeout(()=>{
                    for(let key of this.arrMedia){
                        if(this.mediaImg_title === key.text){ // adHandleRemove
                            this.mediaImgTitle =  key.mediaForm.mediaName
                            if(key.mediaForm.mImg.includes(';')){
                                this.mediaImgSrc = key.mediaForm.mImg.split(';')
                            }else{
                                this.mediaImgSrc = key.mediaForm.mImg.split(',')
                            }

                            this.mediaImgDialogVisible = true
                            break
                        }
                    }
                    clearTimeout(timer)
                },50)
            },
            //删除广告门图片
            adHandleRemove(file, fileList){
                console.log('删除媒体图片', file, fileList)
                let timer = setTimeout(()=>{
                    for(let key of this.arrMedia){
                        if(this.mediaImg_title === key.text){ // adHandleRemove
                            if (this.PathHaveEdit){
                                key.mediaForm.mImg = fileList[0].url
                            }else{
                                key.mediaForm.mImg = fileList[0].response[0].pURL
                            }
                            break
                        }
                    }
                    console.log(this.updataMedia,'删除媒体图片',this.arrMedia)
                    clearTimeout(timer)
                },100)
            },
            //道闸图片
            saveImgRGInfo(m_title){
                this.$message.warning('该功能暂未开放')
                this.rgImg_title = m_title
            },
            // 道闸图片上传前校验
            beforeUpload_rg(file){
                this.$message.warning('该功能暂未开放')
                return false
                // const isJPG = file.type === "image/jpeg" || file.type === "image/png";
                // const isLt6M = file.size / 1024 / 1024 < 6;
                //
                // if (!isJPG) {
                //     this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                // }
                // if (!isLt6M) {
                //     this.$message.error('上传图片大小不能超过 6MB!');
                // }
                // return isJPG && isLt6M;
            },
            // 道闸图片上传成功
            rgUploadSuccess(res){
                console.log('上传媒体图片', res) // mediaADImg
                for(let key of this.roadGateMedia){
                    if(this.rgImg_title === key.text){
                        if(key.roadGateForm.mImg === ''){
                            key.roadGateForm.mImg = res[0].pURL
                        }else{
                            key.roadGateForm.mImg  = key.roadGateForm.mImg  + ';' + res[0].pURL
                        }
                        break
                    }
                }
                console.log(this.updataMedia,'媒体图片上传成功',this.roadGateMedia)
            },
            //道闸图片放大
            rgHandlePictureCardPreview(){
                console.log('媒体图片放大',this.roadGateMedia)
                let timer = setTimeout(()=>{
                    for(let key of this.roadGateMedia){
                        if(this.rgImg_title === key.text){ // adHandleRemove
                            this.mediaImgTitle =  key.roadGateForm.mediaName
                            if(key.roadGateForm.mImg.includes(';')){
                                this.mediaImgSrc = key.roadGateForm.mImg.split(';')
                            }else{
                                this.mediaImgSrc = key.roadGateForm.mImg.split(',')
                            }
                            this.mediaImgDialogVisible = true
                            break
                        }
                    }
                    clearTimeout(timer)
                },50)
            },
            // 道闸图片删除
            rgHandleRemove(file, fileList){
                console.log('删除道闸图片', file, fileList)
                let timer = setTimeout(()=>{
                    for(let key of this.roadGateMedia){
                        if(this.rgImg_title === key.text){ // adHandleRemove
                            if (this.PathHaveEdit){
                                key.roadGateForm.mImg = fileList[0].url
                            }else{
                                key.roadGateForm.mImg = fileList[0].response[0].pURL
                            }
                            break
                        }
                    }
                    console.log('删除道闸图片',this.roadGateMedia)
                    clearTimeout(timer)
                },100)
            },
            // 表单验证
            submitForm(r_item, m_item,rt_Item) {
                this.submitBtnIsAble = true
                let timer = setTimeout(()=>{
                    this.submitBtnIsAble = false
                    clearTimeout(timer)
                },500)
                let r_boolean = false
                this.$refs[r_item].validate((valid) => {
                    if (valid) {
                        r_boolean = true
                    } else {
                        console.log('error submit!!')
                        return false;
                    }
                })
                if(!r_boolean){
                    return
                }
                for(let key of this.arrMedia){
                    if(key.mediaForm.mediaName !== '' || key.mediaForm.mstate !== '' || key.mediaForm.doorType !== '' || key.mediaForm.adSizeW !== ''){
                        this.m_boolean = this.submitAdDoorFrom(m_item)
                        console.log('m_boolean',this.m_boolean)
                        break
                    }
                }
                for(let key of this.roadGateMedia){
                    if(key.roadGateForm.mediaName !== '' || key.roadGateForm.mstate !== '' || key.roadGateForm.LBSizeW !== '' || key.roadGateForm.visualW !== ''){
                        this.rt_boolean = this.submitRoadGateForm(rt_Item)
                        break
                    }
                }
                if (r_boolean && (this.m_boolean || this.rt_boolean)) {     // 前台验证
                    if (this.PathHaveEdit) {                    // 判断是创建还是修改
                        this.Editloading = this.$loading({
                            lock: true,
                            text: '保存中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })
                        this.postEditMsg()
                    } else {
                        this.Editloading = this.$loading({
                            lock: true,
                            text: '创建中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })
                        console.log('校验成功')
                        this.createRec()
                    }
                } else {
                    if(!this.m_boolean && !this.rt_boolean){
                        this.submitAdDoorFrom(m_item)
                        // Message({
                        //     message: '至少填写一种媒介载体的信息！',
                        //     type: 'warning'
                        // })
                    }
                    Message({
                        message: '信息填写有误！',
                        type: 'warning'
                    })
                }
            },
            // 广告门校验
            submitAdDoorFrom(m_item){
                let isBoolean = false
                for (let i = 0; i < this.$refs[m_item].length; i++) {
                    this.$refs[m_item][i].validate((valid) => {
                        if (valid) {
                            isBoolean = true
                        } else {
                            isBoolean= false
                            // console.log('error submit!!',isBoolean)
                            return false;
                        }
                    })
                    if(!isBoolean){
                        break
                    }
                }
                // console.log('isBoolean',isBoolean)
                return isBoolean
            },
            // 道闸校验
            submitRoadGateForm(rt_Item){
                let isBoolean = false
                for (let i = 0; i < this.$refs[rt_Item].length; i++) {
                    this.$refs[rt_Item][i].validate((valid) => {
                        if (valid) {
                            console.log('成功道闸验证!!')
                            isBoolean = true
                        } else {
                            isBoolean= false
                            console.log('失败道闸验证!!')
                            return false;
                        }
                    })
                    if(!isBoolean){
                        break
                    }
                }
                return isBoolean
            },
            //重置表单数据
            resetForm() {
                //  this.$refs[formName].resetFields();arrMedia.mediaForm
                this.$refs['recForm'].resetFields();
                for (let i = 0; i < this.arrMedia.length; i++) {
                    this.$refs['mediaForm'][i].resetFields();
                }
                for (let i = 0; i < this.roadGateMedia.length; i++) {
                    this.$refs['roadGateForm'][i].resetFields();
                }
            },
            //编辑媒体，记录媒体状态change前的状态
            keepMStatue(index, statue,mKind) {
                let i = index
                let mStatue = statue
                console.log('i', i, ',mStatue', mStatue)
                if (mKind === '广告门') {
                    this.arrMediaStatue[i] = mStatue
                } else if (mKind === '道闸') {
                    this.editRoadGateStatue[i] = mStatue
                }
            },
            // 媒体详情跳转过来，获取信息并编辑 添加
            editFun() {
                let inputPath = this.$route.fullPath
                if (inputPath.indexOf('edit=y') !== -1) {
                    let recObj = JSON.parse(sessionStorage.getItem('recDetail'))
                    let mediaObj = JSON.parse(sessionStorage.getItem('mediaList'))
                    this.resData.resID = sessionStorage.getItem('resID')
                    if (recObj !== null || mediaObj !== null) {
                        this.PathHaveEdit = true
                        // 设置默认选中的城市
                        this.recForm.city[0] = recObj.rid.toString().substring(0, 2) + '0000'
                        this.recForm.city[1] = recObj.rid.toString().substring(0, 4) + '00'
                        this.handleChange(this.recForm.city)
                        this.resAddres.city = recObj.city
                        this.resAddres.area = recObj.cityArea
                        // 获取设置资源信息 resAddres
                        let tempObj = {
                            rt: recObj.cType,
                            resname: recObj.resName,
                            city: this.recForm.city, //recObj.city,
                            region: recObj.rid.toString(),
                            business: recObj.tradingArea,
                            resaddr: recObj.resAddress,
                            floorType: recObj.houseType,
                            doorwayNum: recObj.EntryExitNum,
                            buildingNum: recObj.buildingNum,
                            households: recObj.HouseNum,
                            buildingPrice: recObj.housePrice,
                            liveTime: recObj.joinTime,                  // 入住时间
                            pmc: recObj.pmc,                            // 物业公司
                            peopleFlowrate: recObj.peopleFlowrate,      // 人流量
                            carNumber: recObj.carNumber,                // 车位数
                            carFlowrate: recObj.carFlowrate,            // 车流量
                            fullViewUrl: recObj.fullViewUrl || '',
                            lat: '',                                    // 经度
                            lng: '',                                    // 纬度
                            // 房价网信息
                            // city: recObj.city,
                            district: recObj.district,
                            addressAlias: recObj.addressAlias,                          // 地址别名
                            description: recObj.description || '',                     // 描述
                            supportingFacilities: recObj.supportingFacilities || '',   // 周边配套
                            buildingType: recObj.buildingType || '',                   // 建筑类型
                            transportation: recObj.transportation || '',               // 交通状况
                            floorSpace: recObj.floorSpace || '',                       // 占地面积
                            constructionSpace: recObj.constructionSpace || '',         // 建筑面积
                            buildingStructure: recObj.buildingStructure || '',         // 建筑结构
                            plotRatio: recObj.plotRatio || '',                         // 容积率
                            greenPercentage: recObj.greenPercentage || '',             // 绿化率
                            ownershipPeriod: recObj.ownershipPeriod || '',             // 产权年限
                            developer: recObj.developer || '',                         // 开发商
                            // propertyManagement : resData.propertyManagement || '',       // 物业公司
                            managementFee: recObj.managementFee || '',                 // 物业费
                            salesOfficeAdd: recObj.salesOfficeAdd || '',               // 售楼地址
                            preSalePermit: recObj.preSalePermit || '',                 // 预售许可证
                            ownershipType: recObj.ownershipType || '',                 // 产权性质
                            salesPhoneNumber: recObj.salesPhoneNumber,                  // 售楼电话
                            discount: recObj.discount                                   // 折扣信息
                        }
                        //    console.log('经纬度',typeof(recObj.latLng),recObj.latLng)
                        if (recObj.latLng != null && recObj.latLng != '' && recObj.latLng != undefined) {
                            tempObj.lat = Number(recObj.latLng.split(';')[0])       // 经度
                            tempObj.lng = Number(recObj.latLng.split(';')[1])       // 纬度
                        } else {
                            console.log('暂无经纬度！！')
                        }
                        if (tempObj.rt === '写字楼') {
                            this.selectRec('2')
                        }
                        // tempObj.recRemark = recObj.remark
                        this.recForm = tempObj
                        // this.FangJiaWangData = JSON.parse(JSON.stringify(this.recForm))
                        console.log('recForm', this.recForm)
                        //设置媒体信息
                        console.log('mediaObj', mediaObj)
                        this.editMediaLength = mediaObj.length
                        for (let i = 0; i < mediaObj.length; i++) {
                            if (i < mediaObj.length - 1) { // 创建媒体面板，默认已有一个
                                this.mediaAddFun()
                            }
                            this.keepMStatue(i, mediaObj[i].mState,'广告门')    // 记录编辑媒体，初始\修改前的媒体状态
                            let adSize = {w:'',h:''}
                            let visual = {w:'',h:''}
                            if(mediaObj[i].adSize){
                                adSize.w = mediaObj[i].adSize.split('*')[0]
                                adSize.h = mediaObj[i].adSize.split('*')[1]
                            }
                            if (mediaObj[i].adViewSize) {
                                visual.w = mediaObj[i].adViewSize.split('*')[0]
                                visual.h = mediaObj[i].adViewSize.split('*')[1]
                            }
                            let media = {
                                mid: mediaObj[i].mID,
                                mediaType: mediaObj[i].mVehicle,
                                mediaName: mediaObj[i].mTitle,
                                usableNum: mediaObj[i].pNum,
                                mstate: mediaObj[i].mState.toString() + i,                       // 媒体状态
                                assetId: mediaObj[i].assetTag,
                                doorType: mediaObj[i].mType,
                                adSizeW: adSize.w, //mediaObj[i].adSize.split('*')[0],
                                adSizeH: adSize.h, //mediaObj[i].adSize.split('*')[1],
                                visualW: visual.w, //mediaObj[i].adViewSize.split('*')[0],
                                visualH: visual.h, //mediaObj[i].adViewSize.split('*')[1],
                                mediaRemark: mediaObj[i].mRemark,
                                adDoorLevel: mediaObj[i].grade,
                                mImg: mediaObj[i].mImg,
                                updataImg:[],
                                assetIdBolean: mediaObj[i].mState == 2 ? true : false
                            }
                            if(mediaObj[i].classified == 1){
                                this.classified = true
                            }
                            if(mediaObj[i].mImg){
                                let imgArr = []
                                if (mediaObj[i].mImg.includes(';')) {
                                    imgArr = mediaObj[i].mImg.split(';')
                                } else {
                                    imgArr = mediaObj[i].mImg.split(',')
                                }
                                for(let ikey of imgArr){
                                    media.updataImg.push({
                                        name: media.mediaName + i,
                                        url: ikey
                                    })
                                }
                            }
                            if (mediaObj[i].notPush !== '' && mediaObj[i].notPush !== undefined && mediaObj[i].notPush !== null) {
                                media.adLimit = mediaObj[i].notPush.split('、')
                            } else {
                                media.adLimit = []
                            }
                            console.log('media', media)
                            for (let key in media) {
                                if (media[key] == undefined || media[key] == null) {
                                    media[key] = ''
                                }
                            }
                            this.arrMedia[i].mediaForm = media
                        }
                        console.log(' 编辑状态媒体数据', this.arrMedia)
                        this.fillRoadGateData()     // 道闸数据填充
                    } else {
                        this.$router.push('./mediaInput')
                        this.PathHaveEdit = false
                    }
                    this.constructResImg()  // 组装要显示的资源图片
                } else {
                    this.PathHaveEdit = false
                    sessionStorage.removeItem('recDetail')
                    sessionStorage.removeItem('mediaList')
                }
            },
            // 编辑状态填充道闸媒体
            fillRoadGateData(){
                let roadGateList =  JSON.parse(sessionStorage.getItem('roadGateList'))
                console.log('roadGateList', roadGateList)
                this.editRoadGateLength = roadGateList.length
                for (let i = 0; i < roadGateList.length; i++) {
                    // let media = {updataImg:[]}
                    if (i < roadGateList.length - 1) { // 创建媒体面板，默认已有一个
                        this.roadGateAddFun()
                    }
                    this.keepMStatue(i, roadGateList[i].mState,'道闸')    // 记录编辑媒体，初始\修改前的媒体状态
                    let LBoxSizeArr = {w:'',h:''}
                    let adSizeArr = {w:'',h:''}
                    if(!roadGateList[i].lightBoxSize){

                    }else{
                        LBoxSizeArr.w = roadGateList[i].lightBoxSize.split('*')[0]
                        LBoxSizeArr.h = roadGateList[i].lightBoxSize.split('*')[1]
                    }
                    if (!roadGateList[i].picSize) {

                    } else {
                        adSizeArr.w = roadGateList[i].picSize.split('*')[0]
                        adSizeArr.h = roadGateList[i].picSize.split('*')[1]
                    }
                    let media = {
                        mid: roadGateList[i].mID,
                        mediaType: roadGateList[i].mVehicle,
                        mediaName: roadGateList[i].mTitle,
                        usableNum: roadGateList[i].pNum,
                        mstate: roadGateList[i].mState.toString() + i,
                        assetId: roadGateList[i].assetTag,
                        LBSizeW: LBoxSizeArr.w,
                        LBSizeH: LBoxSizeArr.h,
                        visualW: adSizeArr.w,
                        visualH: adSizeArr.h,
                        mediaRemark: roadGateList[i].mRemark,
                        mImg: roadGateList[i].mImg,
                        updataImg:[],
                        assetIdBolean: roadGateList[i].mState == 2 ? true : false
                    }
                    //assetIdBolean = true
                    if(roadGateList[i].mImg){
                        // let imgArr = roadGateList[i].mImg.split(',')
                        let imgArr = []
                        if (roadGateList[i].mImg.includes(';')) {
                            imgArr = roadGateList[i].mImg.split(';')
                        } else {
                            imgArr = roadGateList[i].mImg.split(',')
                        }
                        for(let ikey of imgArr){
                            media.updataImg.push({
                                name: media.mediaName + i,
                                url: ikey
                            })
                        }
                    }
                    if (roadGateList[i].notPush !== '' && roadGateList[i].notPush !== undefined && roadGateList[i].notPush !== null) {
                        console.log('广告限制不为空')
                        media.adLimit = roadGateList[i].notPush.split('、')
                    } else {
                        console.log('广告限制为空')
                        media.adLimit = []
                    }
                    console.log('media', media)
                    for (let key in media) {
                        if (media[key] == undefined || media[key] == null) {
                            media[key] = ''
                        }
                    }
                    this.roadGateMedia[i].roadGateForm = media
                }
            },
            // 组装要显示的资源图片
            constructResImg() {
                console.log('资源图片',this.recForm.fullViewUrl)
                if(this.recForm.fullViewUrl !== '' && this.recForm.fullViewUrl !== undefined && this.recForm.fullViewUrl !== null){
                    let resImg = {name: '资源图片', url: this.recForm.fullViewUrl}
                    this.resUpdata.push(resImg)
                }else{
                    // let resID = sessionStorage.getItem('resID')
                    let uid = this.sessionData.uID
                    let params = {
                        uid: uid,
                        token: this.sessionData.token,
                        ptype: 'restype',
                        ptid: this.resData.resID
                    }
                    api.getApi(this.UCAPI + '/GetImg', params).then(res => {
                        console.log('资源图片的信息', res)
                        if (res.data.length === 0) {
                            console.log('暂时没有该资源的图片')
                        } else {
                            let resImg = {name: res.data[0].pAlt, url: res.data[0].pURL}
                            this.resUpdata.push(resImg)
                            this.recForm.fullViewUrl = res.data[0].pURL
                        }
                    }).catch(err => {
                        console.log('error', err)
                    })
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
                let uid = this.sessionData.uID
                this.recForm.uid = uid
                // let rID = sessionStorage.getItem('resID')
                let recObj = this.recForm
                console.log('recObj', recObj)
                let SetResCTObj = {
                    resid: this.resData.resID,
                    rid: '',//recObj.region,
                    ta: recObj.business,
                    resname: recObj.resname,
                    resaddr: recObj.resaddr,
                    latlng: recObj.lat + ';' + recObj.lng,
                    ct: recObj.floorType,
                    cd: recObj.liveTime,
                    hp: (recObj.buildingPrice * 100),
                    fn: recObj.buildingNum,
                    dn: recObj.doorwayNum,
                    hn: recObj.households,
                    pmc: recObj.pmc,
                    peopleFlow: recObj.peopleFlowrate,
                    carFlow: recObj.carFlowrate,
                    parkSpaceNum: recObj.carNumber,
                    fullViewUrl: recObj.fullViewUrl || '',
                    // 房价网信息
                    addressAlias: recObj.addressAlias,                          // 地址别名
                    description : recObj.description || '',                     // 描述
                    supportingFacilities : recObj.supportingFacilities || '',   // 周边配套
                    buildingType : recObj.buildingType || '',                   // 建筑类型
                    transportation : recObj.transportation || '',               // 交通状况
                    floorSpace : recObj.floorSpace || '',                       // 占地面积
                    constructionSpace : recObj.constructionSpace || '',         // 建筑面积
                    buildingStructure : recObj.buildingStructure || '',         // 建筑结构
                    greenPercentage : recObj.greenPercentage || '',             // 绿化率
                    ownershipPeriod : recObj.ownershipPeriod || '',             // 产权年限
                    developer : recObj.developer || '',                         // 开发商
                    // propertyManagement : resData.propertyManagement || '',       // 物业公司
                    managementFee : recObj.managementFee || '',                 // 物业费
                    salesOfficeAdd : recObj.salesOfficeAdd || '',               // 售楼地址
                    preSalePermit : recObj.preSalePermit || '',                 // 预售许可证
                    ownershipType : recObj.ownershipType || '',                 // 产权性质
                    salesPhoneNumber: recObj.salesPhoneNumber,                  // 售楼电话
                    discount: recObj.discount
                }
                let recDetail = JSON.parse(sessionStorage.getItem('recDetail'))
                if (recObj.region === recDetail.cityArea) {    // 地区没有修改的时候
                    SetResCTObj.rid = recDetail.rid
                } else {
                    SetResCTObj.rid = Number(recObj.region)
                }
                for (let key in SetResCTObj) {
                    if (SetResCTObj[key] === undefined || SetResCTObj[key] === null) {
                        SetResCTObj[key] = ''
                    }
                }
                let params = {
                    "uid": uid,
                    "token": this.sessionData.token,
                    "service":"SetResCT",
                    "data": SetResCTObj
                }
                api.postApi_new(this.Media, params).then(res => {
                    console.log('修改资源信息', res)
                    if (res.data.SysCode == 200200) {
                        // 设置资源图片信息
                        console.log('m_boolean',this.m_boolean,'rt_boolean',this.rt_boolean)
                        // this.creadMediaFun(0,0)
                        if(this.m_boolean){
                            this.postAdDoorData()
                        }
                        if(this.rt_boolean){
                            this.postRoadGateData()
                        }
                        if(this.arrMedia.length > this.editMediaLength || this.roadGateMedia.length > this.editRoadGateLength){
                            console.log('广告门',this.arrMedia.length,this.editMediaLength,'道闸',this.roadGateMedia.length,this.editRoadGateLength)
                            this.creadMediaFun(this.editMediaLength,this.editRoadGateLength,'edit')
                        }
                    } else {
                        if (res.data.SysCode == 100302 || res.data.MSG === '登陆超时') {
                            this.Editloading.close()
                            Message({
                                message: '登陆超时,请重新登录',
                                type: 'warning'
                            })
                            this.$router.push('/login')
                        } else {
                            Message({
                                message: '资源保存失败',
                                type: 'warning'
                            })
                        }
                        this.Editloading.close()
                    }
                })
            },
            // 提交编辑后的广告门信息
            postAdDoorData(){
                let mediaArr = this.arrMedia
                let mIDArr = []
                for (let i = 0; i < mediaArr.length; i++) {
                    console.log('下标', i, 'this.editMediaLength', this.editMediaLength)
                    let tempObj = mediaArr[i].mediaForm
                    if (i < this.editMediaLength) {
                        if (tempObj.assetId === null || tempObj.assetId === undefined) {
                            tempObj.assetId = ''
                        }
                        let temp_media = {
                            uid: this.sessionData.uID,
                            mid: tempObj.mid,
                            mtitle: tempObj.mediaName,
                            adsize: tempObj.adSizeW + '*' + tempObj.adSizeH,
                            adviewsize: tempObj.visualW + '*' + tempObj.visualH,
                            notpush: tempObj.adLimit.join('、'),
                            assettag: tempObj.assetId,
                            mtype: tempObj.doorType,
                            mrk: tempObj.mediaRemark === '' ? '暂无备注' : tempObj.mediaRemark,
                            mImg: tempObj.mImg || '',
                            grade: tempObj.adDoorLevel || ''
                        }
                        console.log('更新媒体temp_media', temp_media)
                        if (tempObj.mstate === '正常') {
                            tempObj.mstate = '1'
                        } else if (tempObj.mstate === '禁用' || tempObj.mstate === '禁止') {
                            tempObj.mstate = '0'
                        } else if (tempObj.mstate === '待安装') {
                            tempObj.mstate = '2'
                        } else if (tempObj.mstate === '待维修') {
                            tempObj.mstate = '3'
                        }
                        tempObj.mstate = tempObj.mstate.split('')[0]
                        let mParams = {
                            "uid": this.sessionData.uID,
                            "token": this.sessionData.token,
                            "service":"SetMediaInfo",
                            "data": temp_media
                        }
                        api.postApi_new(this.Media, mParams).then(res => {
                            console.log('广告门修改', res)
                            if(res.data.SysCode == 200200){
                                mIDArr.push(res.data.data.mID)
                                if (i >= mediaArr.length - 1) {
                                    let timer = setTimeout(()=>{
                                        this.pushResMediaToWydt(mIDArr)
                                        clearTimeout(timer)
                                    },500)
                                    this.Editloading.close()
                                    Message({
                                        message: '广告门保存成功',
                                        type: 'success'
                                    })
                                    this.$router.push('./mediaDetail');
                                }
                            }else{
                                Message({
                                    message: tempObj.mediaName + '保存失败',
                                    type: 'warning'
                                })
                            }
                        })
                    } else {
                        console.log('编辑时创建媒体的下标', i)
                        this.Editloading.close()
                        break
                    }
                }
            },
            // 提交编辑后的道闸媒体信息
            postRoadGateData(){
                //this.roadGateMedia[i].roadGateForm = media
                let mediaArr = this.roadGateMedia
                let mIDArr = []
                for (let i = 0; i < mediaArr.length; i++) {
                    console.log('下标', i, 'this.editRoadGateLength', this.editRoadGateLength)
                    let tempObj = mediaArr[i].roadGateForm
                    if (i < this.editRoadGateLength) {
                        if (tempObj.assetId === null || tempObj.assetId === undefined) {
                            tempObj.assetId = ''
                        }
                        let temp_media = {
                            uid: this.sessionData.uID,
                            mid: tempObj.mid,
                            mtitle: tempObj.mediaName,
                            // adsize: tempObj.adSizeW + '*' + tempObj.adSizeH,
                            // adviewsize: tempObj.visualW + '*' + tempObj.visualH,
                            notpush: tempObj.adLimit.join('、'),
                            assettag: tempObj.assetId,
                            mtype: tempObj.doorType,
                            mrk: tempObj.mediaRemark === '' ? '暂无备注' : tempObj.mediaRemark,
                            mimg: '',
                            picSize: tempObj.visualW + "*" + tempObj.visualH,
                            lightBoxSize:  tempObj.LBSizeW + "*" + tempObj.LBSizeH,
                        }
                        console.log('更新媒体temp_media', temp_media)
                        if (tempObj.mstate === '正常') {
                            tempObj.mstate = '1'
                        } else if (tempObj.mstate === '禁用' || tempObj.mstate === '禁止') {
                            tempObj.mstate = '0'
                        } else if (tempObj.mstate === '待安装') {
                            tempObj.mstate = '2'
                        } else if (tempObj.mstate === '待维修') {
                            tempObj.mstate = '3'
                        }
                        tempObj.mstate = tempObj.mstate.split('')[0]
                        let mParams = {
                            "uid": this.sessionData.uID,
                            "token": this.sessionData.token,
                            "service":"SetMediaInfo",
                            "data": temp_media
                        }
                        api.postApi_new(this.Media, mParams).then(res => {
                            console.log('道闸修改', res)
                            if(res.data.SysCode == 200200){
                                mIDArr.push(res.data.data.mID)
                                if (i >= mediaArr.length - 1) {
                                    let timer = setTimeout(()=>{
                                        this.pushResMediaToWydt(mIDArr)
                                        clearTimeout(timer)
                                    },500)
                                    this.Editloading.close()
                                    Message({
                                        message: '道闸保存成功',
                                        type: 'success'
                                    })
                                    this.$router.push('./mediaDetail');
                                }
                            }else{
                                Message({
                                    message: tempObj.mediaName + '保存失败',
                                    type: 'warning'
                                })
                            }
                        })
                    } else {
                        console.log('编辑时创建媒体的下标', i)
                        this.Editloading.close()
                        break
                    }
                }
            },
            // 修改媒体状态
            editMState(mid, mstate) {
                let params = {
                    "uid": this.sessionData.uID,
                    "token": this.sessionData.token,
                    "service":"CtrlMedia",
                    "data": {
                        "uid": this.sessionData.uID,
                        "mid": mid,
                        "mstate": mstate
                    }
                }
                api.postApi_new(this.Media, params).then(res => {
                    console.log('修改媒体状态', res)
                    if (res.data.SysCode === 200200 || res.data.MSG === '操作成功') {
                        Message({
                            type: 'success',
                            message: '修改成功'
                        })
                    } else if (res.data.SysCode === 200302 || res.data.MSG === '广告位已被占用') {
                        Message({
                            type: 'warning',
                            message: res.data.MSG
                        })
                    } else {
                        Message({
                            type: 'warning',
                            message: '状态更改失败'
                        })
                    }
                })
            },
            // 返回true or false
            returnBool(temp){
                if (!temp || temp === '' || temp === '0') {
                    return false
                } else {
                    return true
                }
            },
            clearData() {
                this.resetForm()
                window.history.go(-1);
            },
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType
                })
            },
            // 登录超时
            loginTimeout() {
                this.$message({
                    message: '登录超时或权限异常,请重新登录',
                    type: 'warning'
                })
                this.$router.push('/login')
            },
        },
    }

</script>

<style scoped>
    /deep/ .ad_index_footer {
        text-align: center;
        font-size: 14px;
        color: #8A8A8A;
        margin-bottom: 16px;
        position: relative;
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
        color: #D9D9D9;
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

    /*资源信息*/
    .mediaMana_content_top {
        padding: 42px 60px 0 60px;
    }

    .mediaMana_content_bottom {
        padding: 11px 60px;
    }

    .content_top_wrap{
        background: #FFFFFF;
        border: 1px solid #DEDEDE;
        padding-top: 3px;
    }

    .content_bottom_wrap {
        margin-top: 0;
        background: #FFFFFF;
        padding-top: 3px;
        /*margin-top: 10px;*/
    }

    .content_bottom_wrap_box{
        border-right: 1px solid #DEDEDE;
        border-left: 1px solid #DEDEDE;
        border-bottom: 1px solid #DEDEDE;
    }

    .content_top_wrap .content_top_head {
        width: 100%;
        height: 35px;
        border-bottom: 1px solid #DEDEDE;
    }

    .content_bottom_wrap .content_bottom_head {
        width: 100%;
        height: 35px;
        line-height: 35px;
        margin-top: 24px;
    }

    .content_top_wrap .content_top_head h2, .content_bottom_wrap .content_bottom_head h2 {
        font-size: 16px;
        color: #333;
        /*color:rgba(51,51,51,0.85);*/
        font-weight: bold;
        padding-left: 32px;
        height: 24px;
        width: 70%;
        margin-top: 8px;
    }

    .content_top_wrap .content_top_form_wrap{
        padding: 26px 32px 16px;
    }
    .content_bottom_wrap .content_bottom_form_wrap{
        padding:  0 32px;
    }

    /deep/ .el-form.demo-ruleForm {
        display: flex;
        /*justify-content: space-between;*/
        flex-wrap: wrap;
    }

    /*资源信息表单*/
    .el-input {
        width: 240px;
        height: 34px;
    }

    /deep/ .el-input__inner, .el-input-number {
        width: 240px;
        height: 34px !important;
        text-align: left;
        line-height: 35px;
        padding-right: 20px;
        text-align: left;
    }
    /deep/ .el-input-number{
        padding-right: 0;
    }
    /deep/ .el-input__suffix{
        right: 0;
    }

    /*计数器*/
    /deep/ .el-input-number__decrease, /deep/ .el-input-number__increase {
        background-color: transparent !important;
    }

    /deep/ .el-icon-arrow-down {
        position: relative;
        top: 1px;
    }

    /deep/ .el-input-number .el-input__suffix {
        right: 42px !important;
    }

    /deep/ .el-input-number.is-controls-right .el-input-number__decrease [class*=el-icon], .el-input-number.is-controls-right .el-input-number__increase [class*=el-icon] {
        position: relative;
        top: 2px;
    }

    /*经纬度*/
    /deep/ .rmb .el-input__inner {
        padding-left: 30px;
    }

    /deep/ .el-form-item {
        margin-bottom: 12px;
        min-width: 26%;
        max-width: 26%;
    }
    /deep/ .el-form-item.is-required .el-form-item__label:before{
        margin-right: -6px;
        position: relative;
        left: 60px;
    }
    /deep/ .el-form-item.floor_house_item.is-required .el-form-item__label:before{
        left: 73px;
    }
    /deep/ .el-form-item.lng_lat_form_item.is-required .el-form-item__label:before{
        left: 46px;
    }
    /deep/ .el-form-item.left_form_item{
        padding-left: 16px;
    }
    /deep/ .el-form-item.right_form_item{
        min-width: 20.5%;
        max-width: 20.5%;
    }

    /deep/ .el-form-item.min_form_item{
        width: 120px;
        float: left;
        margin-bottom: 0;
    }

    /deep/ .el-form-item.min_form_item_right{
        margin-left: 44px;
    }

    /deep/ .min_form_item .el-input{
        width: 118px;
    }

    /deep/ .min_form_item .el-input__inner{
        width: 118px;
    }

    /deep/ .el-form-item.baseInfo.firstInfo{
        padding-top: 0;
        margin-top: 0;
        border:none;
    }

    /deep/ .el-form-item.baseInfo{
        min-width: 99%;
        margin: 18px 0 10px;
        padding-left: 16px;
        background:rgba(245,246,250,1);
    }

    /deep/ .el-form-item.baseInfo .el-form-item__label{
        font-size:16px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        line-height: 42px;
        color:rgba(44,49,60,1);
    }

    .res_name_form_item /deep/ .el-input__inner,
    .res_name_form_item /deep/ .el-input{
        width: 170px;
    }

    /deep/ .el-popper[x-placement^=bottom] {
        margin-top: 3px !important;
    }

    /deep/ .el-textarea__inner {
        width: 240px;
        height: 78px !important;
        resize: none;
        position: relative;
        top: 3px;
    }

    /deep/ .mediaMana_content_top .el-form-item__error {
        top: 90%;
        width: 200px;
    }

    /deep/ .el-popper[x-placement^=bottom] {
        margin-top: 3px !important;
        top: 200px !important;
    }

    /*媒体一表单*/
    .mediaMana_content_bottom .content_bottom_upload {
        width: 408px;
        height: 877px;
        border: 2px dashed #979797;
        float: left;
        margin-left: 10px;
        text-align: center;
        line-height: 810px;
        cursor: pointer;
    }

    .media_deleBtn {
        float: right;
        width: 64px;
        height: 28px;
        background-color: #FF8282;
        margin-right: 10px;
        font-size: 14px;
        color: #FFFFFF;
        line-height: 10px;
        border: none;
        margin-top: -26px;
    }
    /*广告尺寸单位等*/
    .mm {
        display: inline-block;
        position: relative;
    }

    .mm span {
        position: absolute;
        left: 68px;
        top: 0;
        color: #666666;
    }

    .el-form-item_unit{
        position: relative;
    }
    .el-form-item_unit span{
        position: absolute;
        left: 212px;
        color: #666666;
        top: 0;
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

    .mediaMana_content_bottom .content_bottom_btn button.cancel {
        background: #F5F6FA;
        border: none;
        font-size: 14px;
        color: #979797;
    }

    /deep/ .mediaMana_content_bottom .el-form-item__error {
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
        width: 236px;
        height: 125px;
        /* overflow:auto*/
        overflow: hidden;
    }
    .el-checkbox-group {
        position: relative;
        top: 5px;
        left: -10px;
        margin-bottom: -10px;
    }

    /*新增媒体*/
    .addMediaBtn {
        box-sizing: border-box;
        width: 100%;
        height: 32px;
        border: 1px dashed #D9D9D9;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        margin-top: 10px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65)
    }
    /*资源改版*/
    /deep/ .el-scrollbar__wrap{
        display: none;
    }
    /deep/ .el-form-item__label{
        float: none;
        line-height: 32px;
        color: #666666;
    }
    /deep/ .el-form-item__content{
        margin-left: 0 !important;
    }
    /*道闸tab*/
    /deep/ .el-tabs__header{
        background: #fff;
        margin: 0;
        padding-left: 24px;
        border:1px solid rgba(230,231,233,1)
    }
    /deep/ .el-tabs__item{
        /*padding: 0;*/
        width: 80px;
        font-size: 16px;
        text-align: center;
    }
    .mediaImg img{
        width: auto;
        height: 100%;
    }
    /deep/ .el-dialog{
        width: 670px;
    }
    /deep/ .el-dialog__header{
        text-align: center;
    }
    /deep/ .el-carousel__item{
        text-align: center;
    }

    /deep/ .el-textarea .el-textarea__inner::-webkit-scrollbar{
        width: 6px;
        background: #FAFAFA;
    }

    /deep/ .el-textarea .el-textarea__inner::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }

    /deep/ .el-cascader{
        line-height: 34px;
    }

    /deep/ .el-tabs__nav{
        height: 52px;
        line-height: 52px;
    }

    /deep/ .el-input-number .el-input__inner{
        text-align: left !important;
    }

    @media screen and (min-width: 980px) and (max-width: 1280px){
        /deep/ .el-form-item.left_form_item{
            padding-left: 0;
        }
    }

    /*1440*/
    @media screen and (min-width: 1420px) {
        .mediaMana_content_bottom .content_bottom_upload {
            width: 433px;
            text-align: center;
        }

        /deep/ .el-form-item.min_form_item_right{
            margin-left: 38px;
        }

    }

    /*1660*/
    @media screen and (min-width: 1600px) {
        /deep/ .el-form-item.min_form_item_right{
            margin-left: 28px;
        }

    }

    /*1920*/
    @media screen and (min-width: 1900px) {
        .mediaMana_content_bottom .content_bottom_btn {
            position: absolute;
            bottom: -66px;
            left: 896px;
        }

        .mediaMana_content_bottom .content_bottom_upload {
            width: 442px;
            text-align: center;
        }

        /deep/ .el-form-item {
            margin-bottom: 12px;
            min-width: 26%;
            max-width: 26%;
        }

        /deep/ .el-form-item.min_form_item{
            width: 120px;
        }

        /deep/ .el-form-item.min_form_item_right{
            margin-left: 16px;
        }
    }
</style>
