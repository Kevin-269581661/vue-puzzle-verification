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
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6" >
                                    <el-form-item label="资源类型" prop="rt">
                                        <el-select v-model="recForm.rt" placeholder="请选择资源类型"
                                                   :disabled="PathHaveEdit"
                                                   @change="selectRec"
                                                   @blur="blurFun('rt')">
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
                                            @blur="blurFun('city')"
                                            @change="handleChange">
                                        </el-cascader>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="所属区域" prop="region">
                                        <el-select v-model="recForm.region" placeholder="请选择所属区域" :clearable="true"
                                                   @change="getRegion"
                                                   @blur="blurFun('region')">
                                            <el-option v-for="item in regionOpt"
                                                       :key="item.value"
                                                       :label="item.label"
                                                       :value="item.value"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" class="el_col_resName">
                                    <el-form-item label="资源名称" prop="resname">
                                        <el-autocomplete
                                            v-model="recForm.resname"
                                            :fetch-suggestions="getResNameByFangJiaWang"
                                            placeholder=""
                                            @select="changeResName"
                                            @blur="blurFun('resname')">
                                        </el-autocomplete>
                                       <el-button size="small" type="primary" @click="getResBasicData"
                                                               class="get_resName_btn">检索</el-button>
                                    </el-form-item>
                                    <!--<p v-show="isResError" class="res_error">-->
                                        <el-tooltip class="item" effect="dark" placement="bottom-end" v-show="isResError">
                                            <div slot="content">
                                                <ul style="font-size: 12px;color: #fff">
                                                    <li>资源：{{resCommentData.resName}}</li>
                                                    <li>媒体数：{{resCommentData.mediaNum}}</li>
                                                    <li>创建时间：{{resCommentData.updateTime}}</li>
                                                </ul>
                                            </div>
                                            <p class="res_error">这个小区名称已存在 <i class="el-icon-warning"></i></p>
                                        </el-tooltip>
                                    <!--</p>-->
                                </el-col>
                            </el-row>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="资源别名" prop="resAlias">
                                        <el-input v-model="recForm.resAlias" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="位置信息" class="baseInfo"></el-form-item>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="资源地址" prop="resaddr">
                                            <el-autocomplete
                                                v-model="recForm.resaddr"
                                                :fetch-suggestions="querySearchAsync"
                                                placeholder=""
                                                @blur="blurFun('resaddr')"
                                                style="width: 100%"
                                                class="el-from-item-address">
                                            </el-autocomplete>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="地址别名" prop="addressAlias">
                                        <el-input v-model="recForm.addressAlias" placeholder=""></el-input>
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
                                                    <el-input v-model.trim="recForm.lat" placeholder=""></el-input>
                                                </el-form-item>
                                            </div>
                                            <div class="form_item_box_son">
                                                <el-form-item prop="lng">
                                                    <el-input v-model.trim="recForm.lng" placeholder=""></el-input>
                                                </el-form-item>
                                            </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="所属商圈" prop="business" class="right_form_item">
                                        <el-input v-model.trim="recForm.business" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="具体描述" prop="description">
                                        <el-input type="textarea" v-model="recForm.description" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="周边配套" prop="supportingFacilities">
                                        <el-input type="textarea" v-model="recForm.supportingFacilities" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="交通状况" prop="transportation">
                                        <el-input type="textarea" v-model="recForm.transportation" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="属性信息" class="baseInfo"></el-form-item>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="楼盘价格(元/m²)" prop="buildingPrice">
                                        <el-input v-model="recForm.buildingPrice" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="rt_village?'楼盘类型':'写字楼类型'" prop="floorType"
                                                  :class="rt_village ? '' : 'floor_house_item'">
                                        <el-select v-model="recForm.floorType" placeholder=""
                                                   @blur="blurFun('floorType')">
                                            <el-option v-for="item in floorType"
                                                       :key="item.value"
                                                       :label="item.label"
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="rt_village?'小区户数':'办公室数量'" prop="households"
                                                  :class="rt_village ? '' : 'floor_house_item'">
                                        <el-input v-model="recForm.households" controls-position="right"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="楼栋数量" prop="buildingNum">
                                        <el-input-number v-model="recForm.buildingNum" controls-position="right" :min="1" :max="9999999"></el-input-number>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="建筑类型" prop="buildingType">
                                        <el-input v-model="recForm.buildingType" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item :label="rt_village?'入住年份':'建成年份'" prop="liveTime">
                                        <el-date-picker
                                            v-model="recForm.liveTime"
                                            type="year"
                                            value-format="yyyy"
                                            format="yyyy 年"
                                            :editable="false"
                                            placeholder=""
                                            @blur="blurFun('liveTime')">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="占地面积（m²）" prop="floorSpace">
                                        <el-input v-model="recForm.floorSpace" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="建筑面积（m²）" prop="constructionSpace">
                                        <el-input v-model="recForm.constructionSpace" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="建筑结构" prop="buildingStructure">
                                        <el-input v-model="recForm.buildingStructure" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="容积率" prop="plotRatio">
                                        <el-input v-model="recForm.plotRatio" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="绿化率（%）" prop="greenPercentage">
                                        <el-input v-model="recForm.greenPercentage" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="产权年限（年）" prop="ownershipPeriod">
                                        <el-input v-model="recForm.ownershipPeriod" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="车位数" prop="carNumber">
                                        <el-input v-model="recForm.carNumber" controls-position="right" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="人流量（人次/日）" prop="peopleFlowrate">
                                        <el-input v-model="recForm.peopleFlowrate" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="车流量（车次/日）" prop="carFlowrate">
                                        <el-input v-model="recForm.carFlowrate" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="物业信息" class="baseInfo"></el-form-item>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="开发商" prop="developer">
                                        <el-input v-model="recForm.developer" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="物业公司" prop="pmc">
                                        <el-input v-model="recForm.pmc" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="物业费（元/m²/月）" prop="managementFee">
                                            <el-input v-model="recForm.managementFee" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="售楼地址" prop="salesOfficeAdd">
                                        <el-input v-model="recForm.salesOfficeAdd" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="售楼电话" prop="salesPhoneNumber">
                                        <el-input v-model="recForm.salesPhoneNumber" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="折扣信息" prop="discount">
                                        <el-input v-model="recForm.discount" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="预售许可证" prop="preSalePermit">
                                        <el-input v-model="recForm.preSalePermit" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="产权性质" prop="ownershipType">
                                        <el-input v-model="recForm.ownershipType" placeholder=""></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="小区照片" class="baseInfo"></el-form-item>
                            <el-row :gutter="76" class="from_row">
                                <el-col :span="6">
                                    <el-form-item label="" prop="mImg" class="left_form_item">
                                        <div class="upload_img_wrap" style="width: 120px;">
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
                                </el-col>
                            </el-row>
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
                                    <div class="media_deleBtn" @click="mediaDelBtnFun(key)" v-show="(key + 1) > editMediaLength">
                                        <i class="el-icon-remove"></i>
                                    </div>
                                    <!--<el-button type="danger" size="small" class="media_deleBtn" @click="mediaDelBtnFun(key)"-->
                                               <!--:disabled="(key + 1) <= editMediaLength">删除</el-button>-->
                                </div>
                                <div class="content_bottom_form_wrap">
                                    <el-form :model="item.mediaForm" status-icon :rules="mediaRules" ref="mediaForm" label-width="100px"
                                             class="demo-ruleForm">
                                        <el-row :gutter="76" class="from_row">
                                            <el-col :span="6">
                                                <el-form-item label="媒体名称" prop="mediaName">
                                                    <el-input v-model="item.mediaForm.mediaName" placeholder="例：东门"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="可投面数" prop="usableNum">
                                                    <el-input-number v-model.number="item.mediaForm.usableNum" :min="1" :max="26"
                                                                         controls-position="right" :disabled="(PathHaveEdit && key <= editMediaLength - 1)">
                                                    </el-input-number>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="媒体状态" prop="mstate">
                                                    <el-select v-model="item.mediaForm.mstate" placeholder="请选择媒体状态"
                                                               @blur="adDoorBlur('mstate',key)"
                                                               @change="selectMstate(item.mediaForm)">
                                                        <el-option label="禁用" :value="'0' + key"></el-option>
                                                        <el-option label="正常" :value="'1' + key"></el-option>
                                                        <el-option label="待安装" :value="'2' + key"></el-option>
                                                        <el-option label="待维修" :value="'3' + key"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="资产编号" prop="assetId" ref="ResAssetId"
                                                              :rules="item.mediaForm.assetIdBolean ? assetIdRules: mediaRules.assetId">
                                                    <el-input v-model.trim="item.mediaForm.assetId" placeholder="例:0034FASF342-X21"
                                                              :disabled="item.mediaForm.assetIdBolean"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="76" class="from_row">
                                            <el-col :span="6">
                                                <el-form-item label=" 媒体类型" prop="doorType">
                                                    <el-input v-model="item.mediaForm.doorType" placeholder="例:消防门"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="广告尺寸" required>
                                                    <div class="form_item_box_son">
                                                        <el-form-item prop="adSizeW" class="">
                                                            <div class="mm">
                                                                <el-input v-model="item.mediaForm.adSizeW"
                                                                          placeholder="宽度"></el-input>
                                                                <span>mm</span>
                                                            </div>
                                                        </el-form-item>
                                                    </div>
                                                    <div class="form_item_box_son">
                                                        <el-form-item prop="adSizeH">
                                                            <div class="mm">
                                                                <el-input v-model="item.mediaForm.adSizeH"
                                                                          placeholder="高度">
                                                                </el-input>
                                                                <span>mm</span>
                                                            </div>
                                                        </el-form-item>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="可视画面" required>
                                                    <div class="form_item_box_son">
                                                        <el-form-item prop="visualW">
                                                            <div class="mm">
                                                                <el-input v-model="item.mediaForm.visualW" placeholder="宽度"></el-input>
                                                                <span>mm</span>
                                                            </div>
                                                        </el-form-item>
                                                    </div>
                                                    <div class="form_item_box_son">
                                                        <el-form-item prop="visualH">
                                                            <div class="mm">
                                                                <el-input v-model="item.mediaForm.visualH" placeholder="高度"></el-input>
                                                                <span>mm</span>
                                                            </div>
                                                        </el-form-item>
                                                    </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
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
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="76" class="from_row">
                                            <el-col :span="6">
                                                <el-form-item label="媒体等级" prop="adDoorLevel"
                                                              v-if="PathHaveEdit && classified">
                                                    <el-select v-model="item.mediaForm.adDoorLevel"
                                                               placeholder="请选择媒体等级">
                                                        <el-option
                                                            v-for="(level,index) in mediaLevel"
                                                            :key="index"
                                                            :label="level.label"
                                                            :value="level.value">
                                                        </el-option>
                                                    </el-select>
                                                    <!--<br>-->
                                                    <span style="display:inline-block;font-size: 12px;color: #FF8282;line-height: 20px">
                                                        *媒体等级涉及该广告门定价，请勿随意更改。
                                                    </span>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="备注" prop="mediaRemark">
                                                    <el-input type="textarea" v-model.trim="item.mediaForm.mediaRemark" placeholder="请填写备注信息"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
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
                                            </el-col>
                                        </el-row>
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
                                    <div class="media_deleBtn" @click="roadGateDelBtnFun(key)" v-show="(key + 1) > editRoadGateLength">
                                        <i class="el-icon-remove"></i>
                                    </div>
                               <!--     <el-button type="danger" size="small" class="media_deleBtn" @click="roadGateDelBtnFun(key)" :disabled="(key + 1) <= editRoadGateLength">删除</el-button>-->
                                </div>
                                <div class="content_bottom_form_wrap">
                                    <el-form :model="item.roadGateForm" status-icon :rules="roadGateRules" ref="roadGateForm" label-width="100px"
                                             class="demo-ruleForm">
                                        <el-row :gutter="76" class="from_row">
                                            <el-col :span="6">
                                                <el-form-item label="媒体名称" prop="mediaName">
                                                    <el-input v-model="item.roadGateForm.mediaName" placeholder="例：东门"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="资产编号" prop="assetId" ref="ResAssetId" :rules="item.roadGateForm.assetIdBolean ? assetIdRules: mediaRules.assetId">
                                                        <el-input v-model.trim="item.roadGateForm.assetId" placeholder="例:0034FASF342-X21"
                                                                  :disabled="item.roadGateForm.assetIdBolean"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="可投面数" prop="usableNum">
                                                        <el-input-number v-model.number="item.roadGateForm.usableNum" :min="1" :max="3" :disabled="true"
                                                                         controls-position="right">
                                                        </el-input-number>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="媒体状态" prop="mstate">
                                                    <el-select v-model="item.roadGateForm.mstate" placeholder="请选择媒体状态"
                                                               @change="selectMstate(item.roadGateForm)">
                                                        <el-option label="禁用" :value="'0' + key"></el-option>
                                                        <el-option label="正常" :value="'1' + key"></el-option>
                                                        <el-option label="待安装" :value="'2' + key"></el-option>
                                                        <el-option label="待维修" :value="'3' + key"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="76" class="from_row">
                                            <el-col :span="6">
                                                <el-form-item label="广告限制" prop="adLimit">
                                                    <el-select v-model="item.roadGateForm.adLimit" multiple collapse-tags
                                                               placeholder="请选择广告限制" @focus="adLimitFocus(key)"
                                                               @change="changeAdLimit">
                                                        <el-option
                                                            v-for="(limit, index) in adLimit"
                                                            :key="index"
                                                            :label="limit.label"
                                                            :value="limit.value">
                                                        </el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="画面尺寸" required>
                                                        <div class="form_item_box_son">
                                                            <el-form-item prop="visualW">
                                                                <div class="mm">
                                                                    <el-input v-model="item.roadGateForm.visualW"
                                                                              placeholder="宽度"></el-input>
                                                                    <span>mm</span>
                                                                </div>
                                                            </el-form-item>
                                                        </div>
                                                        <div class="form_item_box_son">
                                                            <el-form-item prop="visualH">
                                                                <div class="mm">
                                                                    <el-input v-model="item.roadGateForm.visualH"
                                                                              placeholder="高度">
                                                                    </el-input>
                                                                    <span>mm</span>
                                                                </div>
                                                            </el-form-item>
                                                        </div>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
                                                <el-form-item label="灯箱尺寸" required>
                                                        <div class="form_item_box_son">
                                                            <el-form-item prop="LBSizeW">
                                                                <div class="mm">
                                                                    <el-input v-model="item.roadGateForm.LBSizeW" placeholder="宽度"></el-input>
                                                                    <span>mm</span>
                                                                </div>
                                                            </el-form-item>
                                                        </div>
                                                        <div class="form_item_box_son">
                                                            <el-form-item prop="LBSizeH">
                                                                <div class="mm">
                                                                    <el-input v-model="item.roadGateForm.LBSizeH"
                                                                              placeholder="高度">
                                                                    </el-input>
                                                                    <span>mm</span>
                                                                </div>
                                                            </el-form-item>
                                                        </div>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="76" class="from_row">
                                            <el-col :span="6">
                                                <el-form-item label="备注" prop="mediaRemark">
                                                    <el-input type="textarea" v-model.trim="item.roadGateForm.mediaRemark" placeholder="请填写备注信息"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="6">
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
                                            </el-col>
                                        </el-row>
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
                    <el-button type="primary" class="create" :disabled="submitBtnIsAble"
                               @click="submitForm('recForm','mediaForm','roadGateForm')">{{PathHaveEdit?'保存':'创建'}}</el-button>
                    <el-button class="cancel" @click="clearData">取消</el-button>
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
        <el-dialog
            :visible.sync="mapVisible"
            :close-on-click-modal="false"
            custom-class="map_dialog"
            title="地图"
            top="10vh"
            width="85%">
            <div
                v-loading="mapLoading"
                element-loading-text="拼命加载中..."
                element-loading-spinner="el-icon-loading">
                <el-input placeholder="请输入小区地址" style="width: 240px" size="small" v-model="searchResName"/>
                <el-button size="small" type="primary" @click="searchFun">搜索</el-button>
                <span style="font-size: 14px;color: #333333;display: inline-block;margin-top: 10px">当前选择信息:
                   城市:{{searchResData.city || '--'}} 区域:{{searchResData.district || '--'}}
                    名称:{{searchResData.title || '--'}} 经纬度:{{searchResData.lat + ',' + searchResData.lng}}
                </span>
                <!--百度地图-->
                <div id="resMap" ref="resMap"  style="height: 500px;margin-top: 14px"></div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="mapVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="addLatLngByBmap()">确定</el-button>
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
        Message
    } from 'element-ui';
    import api from '../../api/api'
    import areaPackageNew from '../../commonFun/areaPackage_new'
    import areaToTextNew from '../../commonFun/areaToText_new'
    import sessFun from '../../commonFun/sessFun.js'
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
                this.isResError = false
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
                // 判断资源名称是否有重名
                isResError: false,
                // 重新信息
                resCommentData: {
                    resName:'',
                    mediaNum:'',
                    updateTime:''
                },
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
                    resAlias: '',               // 资源别名
                },
                resAddres: {city:'',area:'',},  // 市区域地址获取经纬度
                recRules: {
                    rt: [
                        {required: true, message: '请选择资源类型!', trigger: ['blur','change']},
                    ],
                    resname: [
                        {required: true, message: '资源名称不能为空!', trigger: ['blur','change']},
                        {validator: validateSpace, trigger: ['blur','change']},
                        {validator: this.isHaveCommenName,trigger: 'blur'},
                        {max: 40, message: '最多只能输入40个字节', trigger: 'change'}
                    ],
                    city: [
                        {required: true, message: '请选择所属城市!', trigger: 'change'},
                    ],
                    region: [
                        {required: true, message: '请选择所属区域!', trigger: ['blur','change']},
                    ],
                    addressAlias: [
                        {validator: validateSpace, trigger: 'blur'},
                        {min: 0, max: 40, message: '最多只能输入40个字节', trigger: 'change'}
                    ],
                    business: [
                        {validator: validateSpace, trigger: 'blur'},
                        {min: 0, max: 40, message: '最多只能输入40个字节', trigger: 'change'}
                    ],
                    resaddr: [
                        {required: true, message: '具体地址不能为空', trigger: ['blur','change']},
                        {validator: validateSpace, trigger: 'blur'},
                        {min: 0, max: 70, message: '最多只能输入70个字节', trigger: 'change'}
                    ],
                    floorType: [
                        {required: true, message: '请选择楼盘类型', trigger: 'change'},
                    ],
                    buildingNum: [
                        {required: true, message: '楼栋数量不能为空', trigger: 'change'},
                    ],
                    households: [
                        {required: true, message: '住户数量不能为空', trigger: ['blur','change']},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    buildingPrice: [
                        {validator: validatePrice, trigger: 'blur'},
                    ],
                    liveTime: [
                        {required: true, message: '请选择年份', trigger: 'change'},
                    ],
                    lat: [
                        {required: true, message: '经度不能为空', trigger: ['blur','change']},
                        {required: true,validator: validateLat, trigger: ['blur','change']},
                    ],
                    lng: [
                        {required: true, message: '纬度不能为空', trigger: ['blur','change']},
                        {required: true,validator: validateLng, trigger: ['blur','change']},
                    ],
                    pmc: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'blur'}
                    ],
                    carNumber: [
                        {validator: validatePrice, trigger: 'blur'},
                    ],
                    carFlowrate: [
                        {validator: validatePrice, trigger: 'blur'},
                    ],
                    peopleFlowrate: [
                        {validator: validatePrice, trigger: 'blur'},
                    ],
                    greenPercentage: [  // 绿化率
                        {validator: validateGreenP, trigger: 'blur'},
                    ],
                    plotRatio: [        // 容积率
                        {validator: validateGreenP, trigger: 'blur'},
                    ],
                    developer: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'blur'}
                    ],
                    managementFee: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'blur'}
                    ],
                    salesOfficeAdd: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'blur'}
                    ],
                    salesPhoneNumber: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'blur'}
                    ],
                    preSalePermit: [
                        {max: 250, message: '最多只能输入250个字符', trigger: 'blur'}
                    ],
                    ownershipType: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'blur'}
                    ],
                    discount: [
                        {max: 250, message: '最多只能输入250个字符', trigger: 'blur'}
                    ],
                    buildingStructure: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'blur'}
                    ],
                    ownershipPeriod: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'blur'}
                    ],
                    constructionSpace: [
                        {max: 40, message: '最多只能输入40个字符', trigger: 'blur'}
                    ],
                },
                assetIdRules: [
                    {validator: validateAssetId, trigger: 'blur'},
                    {max: 40, message: '最多只能输入40个字节', trigger: 'blur'}
                ],
                mediaRules: {
                    mediaName: [
                        {required: true, message: '媒体名称不能为空', trigger: ['blur','change']},
                        {validator: validateSpace, trigger: ['blur','change']},
                        {max: 40, message: '最多只能输入40个字节', trigger: ['blur','change']}
                    ],
                    usableNum: [
                        {validator: validateNum, trigger: 'blur'},
                        {required: true, message: '可投面数不能为空', trigger: 'change'},
                    ],
                    mstate: [
                        {required: true, message: '请选择媒体状态', trigger: 'change'},
                    ],
                    assetId: [
                        {required: true, message: '资产编号不能为空', trigger: ['blur','change']},
                        {validator: validateAssetId, trigger: 'change'},
                        {max: 40, message: '最多只能输入40个字节', trigger: ['blur','change']}
                    ],
                    doorType: [
                        {required: true, message: '媒体类型不能为空', trigger: ['blur','change']},
                        {validator: validateSpace, trigger: ['blur','change']},
                        {required: true, min: 1, max: 20, message: '最多只能输入20个字节', trigger: ['blur','change']}
                    ],
                    adSizeW: [
                        {required: true, type: 'string', message: '不能为空且只能输入数字', trigger: ['blur','change']},
                        {validator: validatePrice, trigger: ['blur','change']},
                    ],
                    adSizeH: [
                        {required: true, type: 'string', message: '不能为空且只能输入数字', trigger: ['blur','change']},
                        // {type: 'number', min: 1, max: 9999999, message: '最大值9999999', trigger: 'blur'},
                        {validator: validatePrice, trigger: ['blur','change']},
                    ],
                    visualW: [
                        {required: true, type: 'string', message: '不能为空且只能输入数字', trigger: ['blur','change']},
                        {validator: validatePrice, trigger: 'change'},
                    ],
                    visualH: [
                        {required: true, type: 'string', message: '不能为空且只能输入数字', trigger: ['blur','change']},
                        {validator: validatePrice, trigger: ['blur','change']},
                    ],
                    // mediaRemark: [
                    //     {max: 200, message: '最多只能输入200个字符', trigger: 'change'}
                    // ],
                },
                //道闸表单验证
                roadGateRules:{
                    mediaName: [
                        {required: true, message: '媒体名称不能为空', trigger: 'change'},
                        {validator: validateSpace, trigger: 'blur'},
                        {max: 40, message: '最多只能输入40个字节', trigger: 'change'}
                    ],
                    usableNum: [
                        {validator: validateNum, trigger: 'change'},
                        {required: true, message: '可投面数不能为空', trigger: 'change'},
                        // { type:'number', min:1, max:26, message:'最多可投26面',trigger:'blur'},
                    ],
                    mstate: [
                        {required: true, message: '请选择媒体状态', trigger: 'change'},
                    ],
                    assetId: [
                        {required: true, message: '资产编号不能为空', trigger: 'change'},
                        {validator: validateAssetId, trigger: 'change'},
                        {max: 40, message: '最多只能输入40个字节', trigger: 'change'}
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
                    // mediaRemark: [
                    //     {max: 200, message: '最多只能输入200个字符', trigger: 'change'}
                    // ],
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
                sessionData: sessFun.getSess(),
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
                mapLoading: true,
                mapVisible: false,              // 地图弹出框
                initMap: false,                 // 地图是否已初始化
                // 当前选择的搜索信息
                searchResData:{province:'',city:'',district:'',title:'',lat:'',lng:''},
                searchResName:'',               // 搜索的社区名
                resMap:'',                      // 百度地图
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
                api.postApi_new(this.apiVar.Media, params).then(res => {
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
                        api.postApi(this.apiVar.QADNAPI + '/ResAutoComplete', params).then(res => {
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
                }else{
                    callback([])
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
                if(this.recForm.resname !== '' && this.resAddres.area !== '' && this.resAddres.city !== ''){
                    let params = {
                        // uid: this.sessionData.uID,
                        // token: this.sessionData.token,
                        city: this.resAddres.city,
                        district: this.resAddres.area,
                        name: this.recForm.resname
                    }
                    api.postApi(this.apiVar.QADNAPI + '/GetResDetails', params).then(res => {
                        console.log('res', res)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            this.loginTimeout()
                        } else {
                            if(res.data !== ''){
                                this.setFangjiaData(res.data.data)
                                // let obj = res.data.data
                            }else{
                                this.$message.warning('数据获取异常,暂无该小区数据！')
                            }
                        }
                    })
                } else {
                    this.$message.warning('资源名称及市区域都不能为空！')
                }
            },
            // 房价网数据填充
            setFangjiaData(obj){
                let ii = '<p style="font-weight: 600;font-size: 16px;color: color:rgba(0,0,0,0.85);">' +
                    '<i class="el-icon-circle-check" style="font-size: 22px;color:#52C41A;margin-right: 8px"></i>' +
                    ' 资源检索成功</p>' +
                    '<p style="font-size: 14px;padding-left: 34px;color: color:rgba(0,0,0,0.65)">将自动填入信息，可手动修改。</p>'
                MessageBox.confirm(ii,'', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    showClose: false,
                    closeOnClickModal: false,
                }).then(() => {
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
                    this.recForm.resAlias = obj.alias.join(',')                         // 资源别名
                    this.recForm.addressAlias = obj.addressAlias[0]                      // 地址别名
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
                    this.FangJiaWangData = JSON.parse(JSON.stringify(this.recForm))      //
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消成功'
                    });
                });
            },
            // 根据填写的具体地址去获取经纬度
            querySearchAsync(queryString, callback) {
                callback([])
                let uid = this.sessionData.uID
                if (queryString) {
                    let params = {
                        uid: uid,
                        token: this.sessionData.token,
                        address:   this.resAddres.city  +  this.resAddres.area + this.recForm.resaddr
                    }
                    console.log('根据填写的具体地址去获取经纬度',params)
                    api.postApi(this.apiVar.Map + '/Geocoder', params).then(res => {
                        console.log('Geocoder', res)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            this.loginTimeout()
                        } else {
                            if(res.data.status == 0){
                                this.recForm.lat = res.data.result.location.lng.toFixed(6)     // 经度
                                this.recForm.lng = res.data.result.location.lat.toFixed(6)     // 纬度
                            }
                        }
                    });
                }
            },
            openBmap(){
                this.mapVisible = true
                if(!this.initMap){
                    let timer = setTimeout(()=>{
                        this.getMap()
                        clearTimeout(timer)
                        this.initMap = true
                    },300)
                }else{

                }
            },
            //百度地图
            getMap() {
                this.resMap = new BMap.Map("resMap");    // 创建Map实例
                console.log('this.resMap',this.resMap)
                var geolocation = new BMap.Geolocation();
                let that = this
                //获取当前位置
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        let point = new BMap.Point(r.point.lng, r.point.lat);                 //定位位置
                        that.resMap.centerAndZoom(point, 16);                                 // 初始化地图
                        console.log('******************************')
                    } else {
                        that.resMap.centerAndZoom(new BMap.Point(113.369838,22.949325), 16);  // 初始化地图
                        that.resMap.setCurrentCity("广州")                                     // 设置地图显示的城市 此项是必须设置的
                    }
                    that.resMap.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                    if(that.recForm.resname){
                        // setTimeout(()=>{
                            that.searchResName =  that.recForm.resname
                            that.searchFun()
                        // },500)
                    }
                    that.mapLoading = false
                })
            },
            // 地图获取经纬度
            searchFun(){
                console.log('1百度地图搜索',this.recForm.resname)
                let lnglat = ''
                let that = this
                let options = {
                    renderOptions:{
                        map: this.resMap,
                        autoViewport: false,
                        // selectFirstResult: true
                    },
                    onSearchComplete: function(results){
                        console.log('2results',results)
                        // 判断状态是否正确
                        if (local.getStatus() == 0){
                            console.log(results.getPoi(0));  // 这就是我们想要的地址
                            that.searchResData.city = results.getPoi(0).city
                            that.searchResData.title = results.getPoi(0).title
                            let point = results.getPoi(0).point
                            lnglat = results.getPoi(0).point
                            console.log('point',point,that.searchResData)
                            that.getResDataInfoByPoint(point)
                        } else {
                            console.log('没有搜索到该地址！')
                        }
                    },
                    onMarkersSet: function(pois) {      // 给创建的标注添加点击事件
                        console.log('onMarkersSet', pois)
                        that.markerArr = pois
                        for (let key of pois) {
                            key.marker.addEventListener('click', that.showInfo);
                        }
                    }
                };
                console.log('3options',options)
                let local = new BMap.LocalSearch(this.resMap,options)
                local.search(this.resAddres.city + this.recForm.resname)
                console.log('4')
            },
            //获取点击标注的坐标
            showInfo(e) {
                for(let mkey of this.markerArr){
                    if(mkey.marker == e.target){
                        this.searchResData.address =mkey.address
                        this.searchResData.title = mkey.title
                        console.log('点击到相同的标注',mkey) // searchInfowindow target address title
                    }else{
                        console.log('不相同的标注',mkey)
                    }
                }
                let addr = {lng:e.point.lng,lat:e.point.lat} // lng经度；lat纬度
                let point = new BMap.Point(addr.lng,addr.lat)
                this.getResDataInfoByPoint(point)
                console.log('点击事件e',e,addr)
            },
            // 根据坐标获取省市区、地址
            getResDataInfoByPoint(point){
                console.log('坐标',point)
                let geoc = new BMap.Geocoder()
                let that = this
                geoc.getLocation(point, function (rs) {
                    console.log('根据坐标获取省市区、地址',rs)
                    let addComp = rs.addressComponents
                    console.log(addComp.province + "- " + addComp.city + ", " + addComp.district + "- " + addComp.street + "- " + addComp.streetNumber);
                    that.searchResData.province = addComp.province
                    that.searchResData.city = addComp.city
                    that.searchResData.district = addComp.district
                    that.searchResData.lat = point.lat
                    that.searchResData.lng = point.lng
                    console.log(that.searchResData,point.lat,point.lng)
                })
            },
            // 地图选择的经纬度
            addLatLngByBmap(){
                // lat:经度  lng:纬度
                this.recForm.lat = this.searchResData.lng
                this.recForm.lng = this.searchResData.lat
                this.mapVisible = false
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
            // 资源输入框和下拉框失去光标validateIsHaveComment
            blurFun(name){
                console.log('name',name)
                if (name === 'resname') {
                    // this.isHaveCommenName()
                } else {
                    // 手动触发校验 validateField
                    this.$refs.recForm.validateField(name,(valid)=>{
                        console.log('错误提示信息',valid)
                        if (!valid){
                            console.log('校验通过')
                        }else{
                            console.log('校验不通过')
                        }
                    })
                }
            },
            // 按所属公司的城市区域检查是否有重复的资源名称
            isHaveCommenName(rule, value, callback){
                // recForm.resname
                if(this.recForm.resname !== '' && this.resAddres.area !== '' && this.resAddres.city !== ''){
                    let params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        "service":"GetResInfoByName",
                        "data":{
                            "prId": this.recForm.city[1],
                            "rId": this.recForm.region,
                            "name": this.recForm.resname
                        }
                    }
                    console.log('params',params)
                    api.postApi_new(this.apiVar.Media,params).then(res=>{
                        console.log('资源名称查重res',res)
                        if (res.data.SysCode == 200200) {
                            let resData = res.data.data
                            if (JSON.stringify(resData) == "{}") {
                                callback();
                            } else {
                                if(resData.resId == this.recForm.resID){
                                    callback();
                                }else{
                                    this.isResError = true
                                    this.resCommentData.mediaNum = resData.mediaCount
                                    this.resCommentData.resName = resData.resName
                                    this.resCommentData.updateTime = resData.createTime
                                    callback(new Error(''))
                                }

                            }
                        } else if (res.data.SysCode == 100302){
                            this.loginTimeout()
                        } else {
                            Message({
                                type: 'warning',
                                message: '资源名称查重异常'
                            });
                        }
                    })
                }
            },
            // 广告门输入框和下拉框失去光标
            adDoorBlur(name,index){
                console.log('name',name)
                // 手动触发校验 validateField
                this.$refs.mediaForm[index].validateField(name,(valid)=>{
                    console.log('错误提示信息',valid)
                    if (!valid){
                        console.log('校验通过')
                    }else{
                        console.log('校验不通过')
                    }
                })
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
            // 选择媒体状态为待安装时修改资源编号的验证为非必填
            selectMstate(val) {
                console.log('选择了', val)
                let valArr = val.mstate.split('')
                console.log('valArr', valArr)
                let i = Number(valArr[1])
                if(this.PathHaveEdit){
                    if(val.mediaType === '广告门' && i <= this.editMediaLength - 1){
                        this.arrMedia[i].mediaForm.assetIdBolean = false
                        this.editMState(val.mid,valArr[0])
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
                    resAlias: this.recForm.resAlias,                           // 资源别名
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
                api.postApi_new(this.apiVar.Media, params).then(res => {
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
                    api.postApi_new(this.apiVar.Media, params).then(res => {
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
                api.postApi_new(this.apiVar.Media, params).then(res =>{
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
            // 表单验证 r_item:资源表单、m_item：广告门的表单、rt_item：道闸的表单
            submitForm(r_item, m_item,rt_item) {
                this.submitBtnIsAble = true
                let timer = setTimeout(()=>{
                    this.submitBtnIsAble = false
                    clearTimeout(timer)
                },500)
                let r_boolean = true
                // this.$refs[r_item].validate((valid) => {
                //     if (valid) {
                //         r_boolean = true
                //     } else {
                //         console.log('error submit!!')
                //         return false;
                //     }
                // })
                // recRules
                let validateResArr = ['rt','city','region','resname','resaddr','lat','lng','floorType','households','buildingNum','liveTime']
                for (let key of validateResArr) {
                    this.$refs.recForm.validateField(key, (valid) => {
                        console.log('错误提示信息', valid)
                        if (!valid) {
                            console.log('校验通过')
                        } else {
                            console.log('校验不通过')
                            r_boolean = false
                        }
                    })
                }
                if(!r_boolean){
                    return
                }
                for(let key of this.arrMedia){
                    if(key.mediaForm.mediaName !== '' || key.mediaForm.mstate !== ''
                        || key.mediaForm.doorType !== '' || key.mediaForm.adSizeW !== ''){
                        this.m_boolean = this.submitAdDoorFrom(m_item)
                        console.log('m_boolean',this.m_boolean)
                        break
                    }
                }
                for(let key of this.roadGateMedia){
                    if(key.roadGateForm.mediaName !== '' || key.roadGateForm.mstate !== ''
                        || key.roadGateForm.LBSizeW !== '' || key.roadGateForm.visualW !== ''){
                        this.rt_boolean = this.submitRoadGateForm(rt_item)
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
            submitRoadGateForm(rt_item){
                let isBoolean = false
                for (let i = 0; i < this.$refs[rt_item].length; i++) {
                    this.$refs[rt_item][i].validate((valid) => {
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
            // 清除表单校验
            clearFromValidate(){
                let timer = setTimeout(()=>{
                    this.$refs['recForm'].clearValidate();
                    for (let i = 0; i < this.arrMedia.length; i++) {
                        this.$refs['mediaForm'][i].clearValidate();
                    }
                    for (let j = 0; j < this.roadGateMedia.length; j++) {
                        this.$refs['roadGateForm'][j].clearValidate();
                    }
                    clearTimeout(timer)
                },500)
            },
            // 通过点击添加媒体跳转而来直接滚动到底部
            scrollBottom(){
                let timer = setTimeout(()=>{
                    console.log('来源于点击添加媒体',document.body.scrollHeight)//clientHeight
                    window.scrollTo(0,document.body.scrollHeight);
                    this.mediaAddFun()
                    clearTimeout(timer)
                },500)
            },
            // 媒体详情跳转过来，获取信息并编辑 添加
            editFun() {
                let routePath = this.$route.path
                console.log('routePath',routePath, this.$route.query);
                if (routePath.indexOf('media/mediaEdit') !== -1) {
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
                            resID: recObj.resID,
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
                            resAlias: recObj.resAlias,                                  // 资源别名
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

                        if(this.$route.query.add){
                            // console.log('来源于点击添加媒体')
                            this.scrollBottom()
                        }
                        // 清除表单校验
                        this.clearFromValidate()
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
                    api.getApi(this.apiVar.UCAPI + '/GetImg', params).then(res => {
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
                    resAlias: resObj.resAlias || '',                            // 资源别名
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
                api.postApi_new(this.apiVar.Media, params).then(res => {
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
                        api.postApi_new(this.apiVar.Media, mParams).then(res => {
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
                        api.postApi_new(this.apiVar.Media, mParams).then(res => {
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
                api.postApi_new(this.apiVar.Media, params).then(res => {
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
            // 取消
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
        height: 35px;
        line-height: 35px;
        width: calc(100% - 80px);
        margin: 18px 32px 10px;
        padding-left: 16px;
        background: rgba(245,246,250,1)
    }

    .content_top_wrap .content_top_head h2, .content_bottom_wrap .content_bottom_head h2 {
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
    .media_deleBtn >i{
        color: rgba(255,0,0,0.85);
        font-size: 24px;
        font-weight: 500;
    }

    .content_top_wrap .content_top_form_wrap{
        padding: 26px 0 16px;
    }

    /deep/ .el-form.demo-ruleForm {
        display: flex;
        flex-wrap: wrap;
    }

    .from_row{
        width: 100%;
        margin: 0 10px !important;
    }

    /deep/ .from_row .el-form-item{
        width: 100%;
    }

    /deep/ .el-cascader{
        width: 100%;
    }

    /deep/ .el-select{
        width: 100%;
    }

    /deep/ .el-input-number{
        padding-right: 0;
    }

    .el_col_resName{
        position: relative;
    }

    /deep/ .el_col_resName .el-autocomplete{
        width: calc(100% - 82px);
    }
    .res_error{
        position: absolute;
        bottom: -2px;
        left: 38px;
        font-size: 12px;
        color: rgb(245, 108, 108);
        font-family: "PingFangSC-Regular","Microsoft YaHei"
    }
    .res_error > i{
        font-size: 12px;
        color: rgb(245, 108, 108);
    }

    .get_resName_btn{
        width: 66px;
    }

    /*经纬度*/
    .form_item_box_son{
        width: 49%;
        margin-right: 1%;
        float: left;
    }

    .col_lng_lat{
        position: relative;
    }

    .lng_lat_map_btn{
        position: absolute;
        left: 100px;
        top: 6px;
        color:rgba(24,144,255,1);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }

    .el-input {
        width: 100%;
        height: 34px;
    }

    /deep/ .el-input__inner, .el-input-number {
        height: 32px;
        text-align: left;
        line-height: 35px;
        padding-right: 20px;
        text-align: left;
    }
    /deep/ .el-input-number{
        width: 100%;
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

    /deep/ .el-form-item {
        margin-bottom: 12px;
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

    /deep/ .el-form-item.baseInfo.firstInfo{
        padding-top: 0;
        margin-top: 0;
        border:none;
    }

    /deep/ .el-form-item.baseInfo{
        width: calc(100% - 64px);
        margin: 18px 32px 10px;
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

    /deep/ .el-popper[x-placement^=bottom] {
        margin-top: 3px !important;
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
    /*广告尺寸单位等*/
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

    .mediaMana_content_bottom .content_bottom_btn .el-button {
        width: 76px;
        height: 32px;
        text-align: center;
        padding: 0;
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
        color: rgba(0,0,0,0.85);
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
    /*地图弹出框*/
    .map_dialog{

    }
    /deep/ .map_dialog .el-dialog__header{
        text-align: left;
    }
    /deep/ .map_dialog .el-dialog__body{
        padding: 10px 20px;
    }

    /deep/ .el-textarea__inner {
        height: 78px !important;
        resize: none;
        position: relative;
        top: 3px;
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
        line-height: 40px;
    }

    /deep/ .el-tabs__nav{
        height: 52px;
        line-height: 52px;
    }

    /deep/ .el-input-number .el-input__inner{
        text-align: left !important;
    }
</style>
