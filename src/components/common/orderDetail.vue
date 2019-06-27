<template>
    <div>
        <div class="ad_mediaDetail_wrap clearfix">
            <div class="ad_mediaDetail_nav">
                <p>
                    <a href="#">订单管理</a>
                    <em> / </em>
                    <a href="#">订单详情</a>
                </p>
            </div>
            <!--资源信息mediaMana_content_top-->
            <div class="mediaList_wrap">
                <div class="content_top_wrap" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                    <div class="plan-title">
                        <h4>
                            <img src="../../assets/images/planlogo.png" alt="">{{orderDetail.apName}}
                            <p>{{orderDetail.apQC}}
                                <i class="el-icon-edit" v-if="(role=='MD')" @click="changeCID = true" :class="{changeCID:!usableBtn}"></i>
                            </p>
                        </h4>
                        <!--修改合同号对话框-->
                        <el-dialog title="修改合同编号" :visible.sync="changeCID" width="30%">
                            <el-input v-model="apQC"></el-input>
                            <span slot="footer" class="dialog-footer">
                                <el-button plain @click="cancelChangeID">取 消</el-button>
                                <el-button type="primary" @click="confirmChangeID">确 定</el-button>
                            </span>
                        </el-dialog>
                        <div class="handleBtn">
                            <!-- <el-button plain @click="changeRemark = true" :disabled="usableBtn">监播备注</el-button> -->
                            <el-button type="primary" :disabled="usableBtn" v-if="role=='MD' && planPanel=='first' && orderDetail.apState != 5 && orderDetail.apState != 0" @click="changePoint">换点</el-button>
                            <!--监播备注对话框-->
                            <el-dialog title="监播备注" :visible.sync="changeRemark" width="30%">
                                <el-input type="textarea" v-model="remark" :rows="2"></el-input>
                                <span slot="footer" class="dialog-footer">
                                    <el-button plain @click="cancelChangeRemark">取 消</el-button>
                                    <el-button type="primary" @click="confirmChangeRemark">确 定</el-button>
                                </span>
                            </el-dialog>
                        </div>
                    </div>
                    <div>
                        <detail :detail="orderDetail" :isorder="true"></detail>
                    </div>
                </div>
            </div>
            <div class="mediaList_wrap margin_16_64">
                <el-tabs v-model="planPanel" @tab-click="handleClick()">
                    <el-tab-pane label="选点排期" name="first">
                        <div class="first-wrap box-wrap">
                            <!-- <h4 v-if="!showTitle">选点排期
                            </h4> -->
                            <h4 v-if="showTitle">
                                更换点位
                               <span>单位:面&nbsp;&nbsp; 首次投放:{{nowPointNum}}&nbsp;&nbsp; 中止投放:{{stopPointNum}} &nbsp;&nbsp;&nbsp; 新增面数:{{addNewPointNum}} &nbsp;&nbsp;&nbsp; 累计投放:{{setpointArr.length}} </span>
                            </h4>
                            <el-row class="search-row">
                                <el-col>
                                    <el-input placeholder="请输入内容" v-model="keyword" class="input-with-select" @change="init()">
                                        <el-select v-model="selectRecName" slot="prepend" placeholder="请选择">
                                            <el-option label="资源名称" value="1"></el-option>
                                        </el-select>
                                    </el-input>
                                    <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
                                    <el-button type="primary" @click="showAddPointDialog" v-show="showHandel">添加点位</el-button>
                                    <el-button plain type="default" icon="el-icon-download" @click="export2Excel(orderDetail.apName)" :disabled="isDown">导出</el-button>
                                </el-col>
                            </el-row>

                            <div class="table_wrap">
                                <el-table border :data="currentSetpoint" style="width: 100%"
                                          :default-sort="{prop: 'recName', order: 'descending'}"
                                          v-loading="loading"
                                          element-loading-text="玩命加载中.."
                                          element-loading-spinner="el-icon-loading">
                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <el-form label-position="left" inline class="demo-table-expand">
                                                <el-form-item label="商圈：">
                                                    <span>{{ props.row.tradingArea}}</span>
                                                </el-form-item>
                                                <el-form-item label="楼栋数量：">
                                                    <span>{{ props.row.fNum }}</span>
                                                </el-form-item>
                                                <el-form-item label="资产编号：">
                                                    <span>{{ props.row.assetTag }}</span>
                                                </el-form-item>
                                                <el-form-item label="入住年份：">
                                                    <span>{{ props.row.chDay }}</span>
                                                </el-form-item>
                                                <el-form-item label="广告限制：">
                                                    <span>{{ props.row.notPush }}</span>
                                                </el-form-item>
                                            </el-form>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="资源名称" min-width="16.1%">
                                        <template slot-scope="scope">
                                            <el-popover v-show="scope.row.isNew"
                                                        placement="top-start"
                                                        title="新增时间"
                                                        width="200"
                                                        trigger="hover"
                                                        :content="formatToTime(scope.row.lSetTime)">
                                                <span slot="reference" style="font-size: 18px;color: red">*</span>
                                            </el-popover>
                                            <span>{{scope.row.resName||'--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="mTitle" label="媒体名称" min-width="10.3%">
                                    </el-table-column>
                                    <el-table-column prop="asLab" label="投放面" min-width="8.8%">
                                    </el-table-column>
                                    <el-table-column prop="city" label="城市" min-width="6%" :filters="filterCityData" :filter-method="filterCity">
                                    </el-table-column>
                                    <el-table-column prop="rName" label="区域" min-width="7.4%" :filters="filtersArea" :filter-method="filterRName">
                                    </el-table-column>
                                    <el-table-column prop="cType" label="楼盘类型" min-width="8.8%">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.cType||'--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="hNum" label="小区户数" min-width="7.3%" align="right">
                                        <template slot-scope="scope">
                                            <span>{{priceToFormat(scope.row.hNum)}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="楼盘价格" min-width="7.3%" align="right">
                                        <template slot-scope="scope">
                                            <span>&yen;{{(scope.row.hPrice)?priceFormat(scope.row.hPrice/100): 0 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="timeRange" label="排期" min-width="14.2%" :filters="filtersData" :filter-method="filterTimeRange">
                                        <template slot-scope="scope">
                                            <template v-if="scope.row.lState==2">
                                                <span>{{scope.row.finishTimeRange}}</span>
                                                <el-tooltip placement="top">
                                                    <div slot="content">
                                                        <span>{{scope.row.timeRange}}</span>
                                                    </div>
                                                    <i class="el-icon-question"> </i>
                                                </el-tooltip>
                                            </template>
                                            <span v-else>{{scope.row.timeRange}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" min-width="4.3%" v-if="showHandel">
                                        <template slot-scope="scope">
                                            <span style="color:#999;cursor: pointer;" v-if="scope.row.lState==2">终止</span>
                                            <span style="color:#409EFF;cursor: pointer;" v-else @click="disContinue(scope.row)">终止</span>
                                        </template>
                                    </el-table-column>

                                    <div slot="empty">
                                        <no-search-result></no-search-result>
                                    </div>
                                </el-table>
                                <p style="font-size: 12px;color: #666666;margin-top: 10px">提示：带*号的为新增点位</p>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="报价单" name="second">
                        <ap-quotation @detailInfo="setInfo" :quotationData="quotation" :copydata="copyAsidArr" :isorder="true" :shopingList="[]" class="price_quo"></ap-quotation>
                    </el-tab-pane>
                    <el-tab-pane label="物料信息" name="third" :disabled="usableBtn">
                        <p class="search-row">
                            <el-button type="primary" size="small" @click="uploadMater()">添加上画信息</el-button>
                            <!-- <el-button type="primary" size="small" @click="uploadMater()">添加上画备注</el-button> -->
                        </p>
                        <material :material="materialInfo" :daomater="daoInfo" :loading="maLoading"></material>
                    </el-tab-pane>
                    <el-tab-pane label="上刊报告" name="forth" :disabled="usableBtn||role =='OP'">
                        <div class="forth-wrap box-wrap">
                            <div class="panel" v-loading="UpReportLoading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                                <div class="up-report">
                                    <template>
                                        <el-radio-group v-model="mediaUpType" size="medium" @change="changeUpMedia()" class="radio_style">
                                            <el-radio-button label="广告门"></el-radio-button>
                                            <el-radio-button label="道闸"></el-radio-button>
                                        </el-radio-group>
                                        <p style="font-size: 16px;color: red;display:inline-block;float:right;">提示：上传完图片后请点击保存</p>
                                    </template>

                                    <div class="up-loader-header">
                                        <el-cascader :options="citys" v-model="citySelect" @change="searchImgChange()">
                                        </el-cascader>
                                        <el-select placeholder="请选择资源" filterable v-model="allhouse" @change="searchImg()">
                                            <el-option v-for="(item, index) of allResource" :key="index" :label="item.resName" :value="item.text"></el-option>
                                        </el-select>
                                        <el-select placeholder="请选择监播图" v-model="allPic" @change="searchImg()">
                                            <!-- <el-option label="全部监播图" value="1"></el-option> -->
                                            <el-option label="已上传" value="2"></el-option>
                                            <el-option label="未上传" value="3"></el-option>
                                        </el-select>
                                        <!--进度条-->
                                        <div class="progress">
                                            <el-progress :percentage="upImgPercent"></el-progress>
                                            <span>{{ currUpNum }} / {{totalUpNum}}</span>
                                        </div>
                                    </div>

                                    <div class="imgs-box">
                                        <div class="up-loader-Imgpanel" v-for="(updata,index) in pageUpReportArr" :key="index">

                                            <el-card class="box-card" shadow="never">
                                                <div slot="header" class="clearfix img-car">
                                                    <el-tooltip class="item" effect="dark" :content='updata.city+"-"+updata.rName+"-"+updata.resName+"-"+updata.mTitle+"-"+updata.asLab' placement="bottom" v-if='(updata.city+"-"+updata.rName+"-"+updata.resName+"-"+updata.mTitle+"-"+updata.asLab).length>23'>
                                                        <span>{{wordlimit(updata.city+"-"+updata.rName+"-"+updata.resName+"-"+updata.mTitle+"-"+updata.asLab, 23)}}</span>
                                                    </el-tooltip>
                                                    <span v-else>{{updata.city+"-"+updata.rName+"-"+updata.resName+"-"+updata.mTitle+"-"+updata.asLab}}</span>
                                                    <p class="car_header">
                                                        <el-tooltip class="item" effect="dark" :content="updata.assetTag" placement="bottom" v-if="updata.assetTag&&updata.assetTag.length>10">
                                                            <span style="margin-right:10px;"><i class="el-icon-date date_fa" type="text"></i>{{wordlimit(updata.assetTag, 10)}}</span>
                                                        </el-tooltip>
                                                        <span v-else style="margin-right:10px;"><i class="el-icon-date date_fa" type="text"></i>{{updata.assetTag}}</span>
                                                        <span><i class="el-icon-date date_fa" type="text"></i>{{updata.timeRange}}</span>
                                                    </p>
                                                </div>
                                                <div class="upload-img">
                                                    <div  class="img_box" v-for="(item,index) in updata.upImgArr"
                                                          @mouseenter="showPreImg = item.pID"
                                                          @mouseleave="showPreImg = null">
                                                        <img class="upload_img_item" :src="item.url">
                                                        <label class="icon_success">
                                                            <i class="el-icon-check"></i>
                                                        </label>
                                                        <div class="icon_box" v-if="showPreImg === item.pID">
                                                            <p class="img_box_icon">
                                                                <i class="el-icon-search" @click="handlePictureCardPreview(item)"></i>
                                                                <i v-if="!item.isCollection" class="el-icon-star-off" @click="saveImgFun(updata,index,'SK')"></i>
                                                                <i v-if="item.isCollection" class="el-icon-star-on icon_save" @click="cancelImgFun(updata,index,'SK')"></i>
                                                                <i class="el-icon-delete" @click="deleteImg(item)"></i>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <el-upload class="upload_plus"
                                                        :key="index+'-'+currUpPage+'-1'"
                                                        @click.native="saveId(updata)"
                                                        :class="{disabled:uploadDisabled(updata.upImgArr)}"
                                                        :action="doUpload"
                                                        :http-request="uploadImg"
                                                        :limit="6"
                                                        list-type="picture-card"
                                                        :show-file-list="true"
                                                        :file-list="updata.upImgArr"
                                                        :before-upload="beforeAvatarUpload"
                                                        :before-remove="beforeImgRemove"
                                                        :on-preview="handlePictureCardPreview"
                                                        :on-remove="handleRemove"
                                                        :on-exceed="handleExceed" multiple>
                                                        <i class="el-icon-plus"></i>
                                                    </el-upload>
                                                </div>
                                            </el-card>
                                        </div>
                                    </div>
                                    <div class="pager">
                                        <el-pagination
                                            v-if="paginationShow"
                                            background
                                            :current-page.sync="currUpPage"
                                            :page-sizes="[6, 12]"
                                            :page-size="pageUpSize"
                                            layout="sizes, prev, pager, next, jumper"
                                            :total="totalUpPageNum"
                                            @size-change="sizeChange"
                                            @current-change='changePage'>
                                        </el-pagination>
                                    </div>
                                    <div class="up-report-bottom">
                                        <!-- <div class="up-report-bottom-checkbox"> -->
                                            <!--<el-checkbox v-model="sendReportchecked">生成报告同时发送至客户邮箱：444094173@qq.com-->
                                            <!--<el-button type="text">修改</el-button>-->
                                            <!--</el-checkbox>-->
                                        <!-- </div> -->
                                        <div class="up-report-bottom-btns">
                                            <el-button plain @click="downloadImg('SK')" :loading="downLoading">导出图片</el-button>
                                            <el-button type="primary" @click="submitUpload('SK')">保存</el-button>
                                            <el-button plain @click="showH5('SK')">查看H5</el-button>
                                            <el-button plain @click="updateReport('SK')" :loading="updateLoading">更新报告</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="下刊报告" name="fifth" :disabled="usableBtn||role =='OP'">
                        <div class="forth-wrap box-wrap">
                            <!-- <h4>下刊报告</h4> -->
                            <div class="panel" v-loading="DownReportLoading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                                <div class="up-report">
                                    <template>
                                        <el-radio-group v-model="mediaDownType" size="medium" @change="changeDownMedia()" class="radio_style">
                                            <el-radio-button label="广告门"></el-radio-button>
                                            <el-radio-button label="道闸"></el-radio-button>
                                        </el-radio-group>
                                        <p style="font-size: 16px;color: red;display:inline-block;float:right;">提示：上传完图片后请点击保存</p>
                                    </template>

                                    <div class="up-loader-header">
                                        <el-cascader :options="citys" v-model="citySelect" @change="searchImgChange()">
                                        </el-cascader>
                                        <el-select placeholder="请选择资源" filterable v-model="allhouse" @change="searchImg()">
                                            <el-option v-for="(item, index) of allResource" :key="index" :label="item.resName" :value="item.value"></el-option>
                                        </el-select>
                                        <el-select placeholder="请选择监播图" v-model="allPic" @change="searchImg()">
                                            <!-- <el-option label="全部监播图" value="1"></el-option> -->
                                            <el-option label="已上传" value="2"></el-option>
                                            <el-option label="未上传" value="3"></el-option>
                                        </el-select>
                                        <!--进度条-->
                                        <div class="progress">
                                            <el-progress :percentage="downImgPercent"></el-progress>
                                            <span>{{ currDownNum }} / {{ totalDownNum }}</span>
                                        </div>
                                    </div>


                                    <div class="imgs-box">
                                        <div class="up-loader-Imgpanel" v-for="(downData,index) in pageDownReportArr" :key="index">

                                            <el-card class="box-card" shadow="never">
                                                <div slot="header" class="clearfix img-car">
                                                    <el-tooltip class="item" effect="dark" :content='downData.city+"-"+downData.rName+"-"+downData.resName+"-"+downData.mTitle+"-"+downData.asLab' placement="bottom" v-if='(downData.city+"-"+downData.rName+"-"+downData.resName+"-"+downData.mTitle+"-"+downData.asLab).length>23'>
                                                        <span>{{wordlimit(downData.city+"-"+downData.rName+"-"+downData.resName+"-"+downData.mTitle+"-"+downData.asLab, 23)}}</span>
                                                    </el-tooltip>
                                                    <span v-else>{{downData.city+"-"+downData.rName+"-"+downData.resName+"-"+downData.mTitle+"-"+downData.asLab}}</span>
                                                    <p class="car_header">
                                                        <el-tooltip class="item" effect="dark" :content="downData.assetTag" placement="bottom" v-if="downData.assetTag && downData.assetTag.length>10">
                                                            <span style="margin-right:10px;"><i class="el-icon-date date_fa" type="text"></i>{{wordlimit(downData.assetTag, 10)}}</span>
                                                        </el-tooltip>
                                                        <span v-else style="margin-right:10px;"><i class="el-icon-date date_fa" type="text"></i>{{downData.assetTag}}</span>
                                                        <span><i class="el-icon-date date_fa" type="text"></i>{{downData.timeRange}}</span>
                                                    </p>
                                                </div>
                                                <div class="upload-img">
                                                    <div  class="img_box" v-for="(item,index) in downData.downImgArr"
                                                          @mouseenter="showPreImg = item.pID"
                                                          @mouseleave="showPreImg = null">
                                                        <img class="upload_img_item" :src="item.url">
                                                        <label class="icon_success">
                                                            <i class="el-icon-check"></i>
                                                        </label>
                                                        <div class="icon_box" v-if="showPreImg === item.pID">
                                                            <p class="img_box_icon">
                                                                <i class="el-icon-search" @click="handlePictureCardPreview(item)"></i>
                                                                <i v-if="!item.isCollection" class="el-icon-star-off" @click="saveImgFun(downData,index,'XK')"></i>
                                                                <i v-if="item.isCollection" class="el-icon-star-on icon_save" @click="cancelImgFun(downData,index,'XK')"></i>
                                                                <i class="el-icon-delete" @click="deleteImg(item)"></i>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <el-upload class="upload_plus"
                                                        @click.native="saveId(downData)"
                                                        :class="{disabled:uploadDisabled(downData.downImgArr)}"
                                                        :key="index+'-'+currUpPage+'-1'"
                                                        :action="doUpload"
                                                        :http-request="uploadImg"
                                                        list-type="picture-card"
                                                        :file-list="downData.downImgArr"
                                                        :limit="6"
                                                        :before-upload="beforeAvatarUpload"
                                                        :before-remove="beforeImgRemove"
                                                        :on-preview="handlePictureCardPreview"
                                                        :on-remove="handleRemove"
                                                        :on-exceed="handleExceed" multiple>
                                                        <i class="el-icon-plus"></i>
                                                    </el-upload>
                                                </div>
                                            </el-card>

                                        </div>
                                    </div>
                                    <div class="pager">
                                        <el-pagination v-if="paginationShow"
                                                       background
                                                       :current-page.sync="currDownPage"
                                                       :page-sizes="[6, 12]"
                                                       :page-size="pageDownSize"
                                                       layout="sizes, prev, pager, next, jumper"
                                                       :total="totalDownPageNum"
                                                       @size-change="sizeChange"
                                                       @current-change='changePage'>
                                        </el-pagination>
                                    </div>
                                    <div class="up-report-bottom">
                                        <div class="up-report-bottom-checkbox">
                                            <!--<el-checkbox v-model="sendReportchecked">生成报告同时发送至客户邮箱：444094173@qq.com-->
                                            <!--<el-button type="text">修改</el-button>-->
                                            <!--</el-checkbox>-->
                                        </div>
                                        <div class="up-report-bottom-btns">
                                            <el-button plain @click="downloadImg('XK')" :loading="downLoading">导出图片</el-button>
                                            <el-button type="primary" @click="submitUpload('XK')">保存</el-button>
                                            <el-button plain @click="showH5('XK')">查看H5</el-button>
                                            <el-button plain @click="updateReport('XK')" :loading="updateLoading">更新报告</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <!--添加点位对话框-->
                <el-dialog title="添加点位"
                           :visible.sync="dialogAddPoint"
                           width="82%"
                           top="6vh"
                           :close-on-press-escape="false"
                           :show-close="false">
                    <add-ads :IsAddAds="IsAddPoint" @ievent = "ievent"></add-ads>
                    <span slot="footer" class="dialog-footer">
                        <el-button plain @click="cancelAddPoint">取 消</el-button>
                        <el-button type="primary" @click="confirmAddPoint">确 定</el-button>
                    </span>
                </el-dialog>

                <!-- 图片查看显示 -->
                <el-dialog :visible.sync="dialogVisible" class="imgPreview" top="10vh">
                    <img  :src="dialogImageUrl" alt="" />
                </el-dialog>

                <!-- 终止点位弹出框 -->
                <el-dialog
                    title="终止点位"
                    :visible.sync="isFinish">
                    <span>请选择终止时间：</span>
                    <el-date-picker v-model="finishDate" type="date" format="yyyy.MM.dd" value-format="yyyy.MM.dd" placeholder="终止日期" :picker-options="pickerOptions">
                    </el-date-picker>
                    <span slot="footer" class="dialog-footer">
                        <el-button plain @click="isFinish = false">取消</el-button>
                        <el-button type="primary" @click="conFirmStopAds">确 定</el-button>
                    </span>
                </el-dialog>

                <!-- 上传上画素材、备注弹框 -->
                <el-dialog
                    title="画面备注信息"
                    :visible.sync="showPhotoRemark">
                    <p class="inline_dialog">
                        <el-input v-model="resNameSec" placeholder="请输入资源名称"></el-input>
                        <el-select v-model="mapName" placeholder="请选择地图中心点">
                            <el-option v-for="(item, index) of mapArr" :key="index" :label="item.name" :value="item.name"></el-option>
                        </el-select>
                        <el-button size="small" type="primary" @click="searchInfo()" :disabled="!isSearch">搜索</el-button>
                        <el-button plain size="small" @click="resetInfo()" :disabled="!isReset">重置</el-button>
                    </p>
                    <p style="margin-top:15px;">
                        <!-- <el-button size="small">添加画像</el-button> -->
                        <el-upload
                            :action="doUpload"
                            :show-file-list='false'
                            :on-success="materImgSuccess"
                            :before-upload="materImgBeforeUpload"
                            :disabled="!shopList.length"
                            style="display:inline-block;"
                        >
                            <el-button plain size="small">添加画像</el-button>
                        </el-upload>
                        <el-button plain size="small" @click="openRemark()">添加备注</el-button>
                    </p>
                    <p style="margin-top:15px;">
                        <div class="car-title">
                            <i class="el-icon-info" style="color: #1890FF;"></i>
                            <h4>添加点位备注数量<span>{{remarkNum}}</span>个
                                <!-- <span @click="clearAll()" style="cursor: pointer">&nbsp; &nbsp;清空</span> -->
                            </h4>
                        </div>
                    </p>
                    <el-table :data="materInfoArr" border height="450" ref="multipleTable" v-loading="materloading" v-loadmore="materLoadMore" @select="handleSelect" @select-all="handleSelectAll" class="table_mater">
                        <el-table-column type="selection" width="41px" scope="scope" >
                        </el-table-column>
                        </el-table-column>
                        <el-table-column prop="resName" label="资源名称">
                        </el-table-column>
                        <el-table-column prop="mTitle" label="媒体名称">
                        </el-table-column>
                        <el-table-column prop="asLab" label="面" width="60">
                        </el-table-column>
                        <el-table-column prop="city" label="城市" width="90">
                        </el-table-column>
                        <el-table-column prop="rName" label="区域" width="90">
                        </el-table-column>
                        <el-table-column prop="map" label="地图中心点">
                        </el-table-column>
                        <el-table-column prop="timeRange" label="排期" min-width="120" :filters="filtersData" :filter-method="filterTimeRange">
                        </el-table-column>
                        <el-table-column prop="remark" label="上画备注">
                        </el-table-column>
                        <el-table-column prop="imgUrl" label="操作" width="80">
                            <template slot-scope="scope">
                                <el-button size="small" icon="el-icon-picture" style="margin-right:15px;" :style="{'color':scope.row.imgUrl?'#108DE7':''}" @click="previewImg(scope.row)" :disabled="!scope.row.imgUrl"></el-button>
                                <el-button size="small" icon="el-icon-delete" :style="{'color':scope.row.imgUrl?'#108DE7':''}" @click="deleteOneImg(scope.row, scope.$index)" :disabled="!scope.row.imgUrl"></el-button>
                            </template>
                        </el-table-column>

                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>
                    <p style="text-align:center;margin-top:20px;">
                        <el-button type="primary" size="small" @click="saveAll()">保存</el-button>
                    </p>
                </el-dialog>

                <!-- 添加备注弹出框 -->
                <el-dialog
                    title="添加备注"
                    width="40%"
                    :visible.sync="showRemark">
                    <el-input type="textarea" :rows="2" placeholder="请输入备注信息" v-model="remarkInfo" :maxlength="100"> </el-input>
                    <span slot="footer" class="dialog-footer">
                        <el-button plain @click="showRemark = false" size="small">取消</el-button>
                        <el-button type="primary" @click="saveRemark()" size="small">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
            <!-- 返回框 -->
            <div class="content_bottom_btn">
                <el-button plain type="default" @click="goBack">返回</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { api } from "../../api/api.js";
// 价格格式化
import commaFormat from "../../commonFun/commaFormat.js";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
// 时间格式化
import dateFormat from "../../commonFun/timeFormat.js";
// 报价单
import apQuotation from './components/apQuotation.vue'
import material from "./components/materialInfo.vue";
import detail from "./components/detailInfo.vue";
import addAds from "./components/addAds"
import noSearchResult from "./components/noSearchResult.vue";

import {
    Table,
    TableColumn,
    Tabs,
    TabPane,
    Button,
    Upload,
    Card,
    Dialog,
    Checkbox,
    Select,
    Option,
    Input,
    Cascader,
    Progress,
    Pagination,
    Popover,
    Form,
    FormItem,
    MessageBox,
    Message
} from "element-ui";
import timeFormat from '../../commonFun/timeFormat.js';
import sessFun from '../../commonFun/sessFun.js';

export default {
    name: "orderDetail",
    components: {
        apQuotation,
        material,
        detail,
        addAds,
        noSearchResult,
        elTable: Table,
        elTableColumn: TableColumn,
        elTabs: Tabs,
        elTabPane: TabPane,
        elButton: Button,
        elUpload: Upload,
        elCard: Card,
        elDialog: Dialog,
        elCheckbox: Checkbox,
        elSelect: Select,
        elOption: Option,
        elInput: Input,
        elCascader: Cascader,
        elProgress: Progress,
        elPagination: Pagination,
        elPopover: Popover,
        elForm: Form,
        elFormItem: FormItem,
    },
    data() {
        return {
            updateLoading: false,
            // 上传图片
            formData: new FormData(),
            addload:'',
            // 所有的图片组合
            uploadImgArr: [],
            // 关联属性数组
            constractArr:[],
            // 上传图片后返回的数据数组
            uploadPidArr: [],
            mediaDownType: '广告门',
            mediaUpType: '广告门',
            // 媒体类型为广告门的资源
            mediaAdData: [],
            // 媒体类型为道闸的资源
            mediaDaoData: [],
            // 媒体类型为广告门的城市区域
            AdCitys: [],
            // 媒体类型为道闸的城市区域
            DaoCitys: [],
            mediaDaoData: [],
            // session信息
            sessionData: {},
            isDown: false,
            //加载中
            loading: true,
            maLoading: true,
            UpReportLoading: true,
            DownReportLoading: true,
            // 判断
            role: "",
            paginationShow: true,
            // 当前页
            currUpPage: 1,
            currDownPage: 1,
            currUpNum: 0,
            totalUpNum: 0,
            pageUpSize: 6,
            pageDownSize: 6,
            currDownNum: 0,
            totalDownNum: 0,
            totalUpPageNum: 0,
            totalDownPageNum: 0,
            // 订单详情头部
            orderDetail: {
                AdDoor:{},
                barrier:{},
            },
            //修改合同号
            changeCID: false,
            planPanel: "first",
            // 选点排期
            setpointArr: [],
            currentSetpoint: [],
            copyAsidArr: [],
            // addNewAdsNum: 0,    // 添加点位数
            // 报价单详情
            quotation: {
                isDetail: true,
                quotation: []
            },
            // 城市过滤结果
            filterCityData: [],
            // 地区过滤结果
            filtersArea: [],
            // 排期时间过滤
            filtersData: [],
            //选点排期资源名称搜索
            keyword: "",
            // 资源名称类型
            selectRecName: "1",
            // 保存当前点击的那项
            imgOrder: "",
            // 广告物料信息
            materialInfo:[],
            // 道闸物料信息
            daoInfo:[],
            // 是否显示上传素材弹框
            showPhotoRemark: false,
            // 是否显示上画备注弹框
            showRemark: false,
            // 备注信息内容
            remarkInfo: '',
            // 备注数量
            // remarkNum: 0,
            // 物料资源名称搜索
            resNameSec: '',
            // 地图中心点选择
            mapName: '',
            // 地图中心点数组:
            mapArr: [],
            // loading
            materloading: true,
            // 物料信息弹出框的选点信息
            materInfoArr:[],
            currInfoPage: 1,
            maInfoSize: 10,
            totalInfoPage: 0,
            loading_maInfo: false,
            // 勾选的数据
            shopList:[],
            isSearch: true,
            isReset: true,
            // 上刊报告Arr
            pageUpReportArr: [],
            upImgPercent: 0,
            // 下刊报告Arr
            pageDownReportArr: [],
            downImgPercent: 0,
            // 上传图片地址
            doUpload: "/advertisement/UpLoad",
            // doUpload: "https://beta.qinlinad.com/advertisement/UpLoad",
            upLoadObj:{},
            //上刊报告市区级联
            citys: [],
            citySelect: [],
            //上刊报告社区和监播图
            allResource: [],
            allhouse: "",
            allPic: "",
            // 下刊图片
            downImg: [],
            // 默认合同编号(如果订单详情没有合同编号)
            apQC: "",
            // 图片显示放大按钮控件
            isShow: null,
            isShow2: null,
            // 终止点位时间弹出框
            isFinish: false,
            finishDate: '',
            nowRow: {},
            dateRange:{
                beginDate: '',
                endDate: ''
            },
            pickerOptions:{
                disabledDate: (time) => {
                    let beginDateVal = new Date(this.dateRange.beginDate).getTime();
                    let endDateVal = new Date(this.dateRange.endDate).getTime()-60*60*24*1000;
                    if (beginDateVal || endDateVal) {
                        return (time.getTime() < beginDateVal) || (time.getTime() > endDateVal);
                    }
                }
            },

            //添加点位
            dialogAddPoint: false,
            IsAddPoint: true,
            addAdsArr: [],
            dateInput: "",
            pdidList:[],
            //默认
            value: "资源名称",
            buildValue: "",
            //搜索框
            searchInput: "",
            planSelect: "",
            //添加点位列表
            planList: [],
            //按钮
            usableBtn: false,
            //发送报告
            sendReportchecked: false,
            //上传照片
            dialogImageUrl: "",
            dialogVisible: false,
            //监播备注
            remark: "",
            changeRemark: false,
            //选点排期标题
            showTitle: false,
            //选点排期按钮
            showBtn: true,
            //更换点位取消终止按钮
            cancelbtnShow: false,
            //选点排期操作
            showHandel: false,
            UploadTime: 0,
            // 导出订单图片包
            downLoading: false,
            //显示预览图蒙版
            showPreImg: null,
        };
    },
    created() {
        if(this.isChangePoint()){
            this.changePoint();
        }
        // 根据角色判断是否有修改合同编号的权限
        this.getRole();
        // 获取订单详情的上面公司的信息
        this.getInitData();
        // 选点排期
        this.getSetPoint();
    },
    directives: {
        loadmore: {
            bind: function (el, binding) {
                const selectWrap = el.querySelector('.el-table__body-wrapper')
                selectWrap.addEventListener('scroll', function () {
                    const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
                    // console.log('滚动的距离',scrollDistance)
                    if (scrollDistance <= 100) {
                        binding.value()
                    }
                })
            }
        }
    },
    computed: {
        // 现投放面数
        nowPointNum() {
            if (this.setpointArr.length) {
                let num = 0;
                for (let data of this.setpointArr) {
                    if (data.isNew != 1) {
                    // if (data.lState != 2) {
                        num++;
                    }
                }
                return num;
            }
        },
        // 中止投放面数
        stopPointNum() {
            if (this.setpointArr.length) {
                let num = 0;
                for (let data of this.setpointArr) {
                    if (data.lState == 2) {
                        num++;
                    }
                }
                return num;
            }
        },
        // 新增点位
        addNewPointNum(){
            if (this.setpointArr.length) {
                let addNum = 0;
                for (let data of this.setpointArr) {
                    if (data.isNew == 1) {
                        addNum++;
                    }
                }
                return addNum;
            }
        },
        // 已经备注的数量
        remarkNum(){
            if (this.materInfoArr.length) {
                let num = 0;
                for (let data of this.materInfoArr) {
                    if (data.remark) {
                        num++;
                    }
                }
                return num;
            }
        },
    },
    methods: {
        setInfo(data){
           console.log('defail------data', data);
            this.pdidList = data;
        },
        // 导出excel
        export2Excel(name) {
            this.isDown = true;
            let resultArr = [];
            for(let data of this.currentSetpoint){
                let obj = {
                    resName: data.resName,
                    city: data.city,
                    rName: data.rName,
                    mVehicle: data.mVehicle,
                    mTitle: data.mTitle,
                    assetTag: data.assetTag,
                    asLab: data.asLab,
                    timeRange: data.timeRange,
                    finishTimeRange: data.finishTimeRange,
                    tradingArea: data.tradingArea,
                    cType: data.cType,
                    hPrice: data.hPrice/100,
                    hNum: data.hNum,
                    fNum: data.fNum,
                    chDay: data.chDay,
                    adSize: data.mVehicle == "广告门" ? data.adSize: data.picSize,
                    adViewSize: data.mVehicle == "广告门" ? data.adViewSize: data.lightBoxSize,
                    notPush: data.notPush,
                    mRemark: data.mRemark,
                    resAddress: data.resAddress,
                };
                resultArr.push(obj);
            }

            require.ensure([], () => {
                const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                const tHeader = ['资源名称', '市', '区域', '媒介载体', '媒体名称', '资产编号', '投放面', '投放日期', '终止日期', '商圈', '楼盘类型/写字楼类型', '楼盘价格', '住户数量/办公室数量', '楼栋数量', '入住年份/建成年份', '广告尺寸/画面尺寸', '可视画面/灯箱尺寸', '广告限制', '媒体备注', '详细地址'];
                const filterVal = ['resName', 'city', 'rName', 'mVehicle', 'mTitle', 'assetTag', 'asLab', 'timeRange', 'finishTimeRange', 'tradingArea', 'cType', 'hPrice', 'hNum', 'fNum', 'chDay', 'adSize', 'adViewSize', 'notPush', 'mRemark', 'resAddress'];
                const list = resultArr;
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, name);
                this.isDown = false;
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
        // 判断是否是有换点跳转过来的？
        isChangePoint(){
            let isChange = sessionStorage.getItem('change_point');
            if(isChange == 'yes'){
                return true;
            }
            return false;
        },
        // 获取角色
        getRole() {
            this.sessionData = sessFun.getSess();
            this.role = this.sessionData.uType;
        },
        // 页数大小改变
        sizeChange(pageVal) {
            console.log("pageVal", pageVal);
            if(this.planPanel == 'forth'){
                this.currUpPage = 1;
                this.UpReportLoading = true;
                this.pageUpSize = pageVal;
                this.searchFun();
            }else if(this.planPanel == 'fifth'){
                this.currDownPage = 1;
                this.DownReportLoading = true;
                this.pageDownSize = pageVal;
                this.searchFun();
            }
        },
        // 分页功能
        changePage(page) {
            console.log('page----', page);
            if(this.planPanel == 'forth'){
                this.UpReportLoading = true;
                this.currUpPage = page;
                this.searchFun();
            }else if(this.planPanel == 'fifth'){
                this.DownReportLoading = true;
                this.currDownPage = page;
                this.searchFun();
            }
        },
        // tab点击
        handleClick() {
            this.allPic = '';
            this.allhouse = '';
            this.citySelect = [];
            if (this.planPanel == "first") {
                this.getSetPoint();
            }
            if (this.planPanel == "forth") {
                // this.getUpImgInfo();
                this.searchFun();
            }
            if (this.planPanel == "fifth") {
                // this.getDownImgInfo();
                this.searchFun();
            }
        },
        // 获取地图中心点
        getMapCenter(){
            let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apID: sessionStorage.getItem('order_apid'),
                queryType: 0,
            };
            api.getApi(this.apiVar.Advertisement+'/GetAdMaterial', params).then(res =>{
                console.log('res.data-----', res.data);
                if(!res.data.SysCode && res.data.length){
                    for(let data of res.data){
                        let obj = {
                            name: data
                        };
                        this.mapArr.push(obj);
                    }
                }
            });
        },
        // 物料信息上传上画弹出框
        uploadMater(){
            this.showPhotoRemark = true;
            this.shopList = [];
            this.currInfoPage = 1;
            this.materInfoArr = [];
            this.mapArr = [];
            let info = this.searchDataFormat();
            this.getMaterInfo(info);
            this.getMapCenter();
        },
        // 物料弹出框滚动加载
        materLoadMore(){
            if(this.loading_maInfo){
                this.loading_maInfo = false;
                if(this.currInfoPage <= this.totalInfoPage){
                    this.searchInfoFun();
                }
            }
        },
        searchInfoFun(){
            let info = this.searchDataFormat();
            this.getMaterInfo(info);
        },
        getMaterInfo(params){
            api.postApi(this.apiVar.Advertisement+'/GetAdMaterial', params).then(res =>{
                console.log(res.data);
                if(res.data.total >= 0){
                    let dataInfo = res.data;
                    // 物料信息弹出框的选点信息
                    this.totalInfoPage = dataInfo.totalPage;
                    let dataArr = dataInfo.list;
                    this.materInfoArr = this.materInfoArr.concat(this.formatData(dataArr));
                    this.loading_maInfo = true;
                    this.currInfoPage++;
                    this.SelectioUpdate();
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
                }
                this.materloading = false;
            }).catch(err =>{
                this.materloading = false;
            });
        },
        // 搜索数据格式化
        searchDataFormat(){
            let res = this.resNameSec;
            let map = this.mapName;
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                pageNo: this.currInfoPage,
                pageSize: this.maInfoSize,
                apID: sessionStorage.getItem('order_apid')
            };
            if(res){
                info.resName = res;
            }
            if(map){
                info.mapCenterName = map;
            }
            return info;
        },
        // 物料信息弹出框搜索
        searchInfo(){
            console.log(this.resNameSec, this.mapName, this.materInfoArr);
            if(this.resNameSec || this.mapName){
                this.isSearch = false;
                let timer = setTimeout(()=>{
                    this.isSearch = true;
                    clearTimeout(timer);
                }, 1000);
                this.materInfoArr = [];
                this.loading_maInfo = false;
                this.materloading = true;
                this.currInfoPage = 1;
                this.searchInfoFun();
            }else{
                Message.warning('请输入搜索条件');
            }
        },
        formatData(arr){
            let result = [];
            for(let data of arr){
                let obj = this.setTableData(data);
                result.push(obj);
            }
            return result;
        },
        // 表格数据格式
        setTableData(item){
            let timeRange = timeFormat.toDate(item.lStar, '/') +'-'+ timeFormat.toDate(item.lEnd, '/');
            let timeRange1 = timeFormat.toDate(item.lStar, '/') +'-'+ timeFormat.toDate(item.lSetTime, '/');
            let obj = {
                resName: item.resName,
                mTitle: item.mTitle,
                asLab: item.asLab,
                city: item.city,
                rName: item.rName,
                map: item.mapCenterName,
                timeRange: item.lState==2? timeRange1 : timeRange,
                remark: item.remark?item.remark:'',
                imgUrl: item.picUrl?item.picUrl:'',
                uploadUser: item.uploadUser?item.uploadUser:'',
                resID: item.resID,
                lID: item.lID,
                lStar: item.lStar,
                lEnd: item.lEnd,
                asID: item.asID,
                isSelect: false,
            };
            return obj;
        },
        // 物料信息弹出框重置
        resetInfo(){
            this.mapName = '';
            this.resNameSec = '';
            this.materInfoArr = [];
            this.loading_maInfo = false;
            this.materloading = true;
            this.currInfoPage = 1;
            this.isReset = false;
            let timer = setTimeout(()=>{
                this.isReset = true;
                clearTimeout(timer);
            }, 1000);
            this.searchInfoFun();
        },
        // 打开备注框
        openRemark(){
            if(!this.shopList.length){
                Message.warning('请先勾选需要备注的选点');
                return;
            }
            this.remarkInfo = '';
            this.showRemark = true;
        },
        // 上传图片之前的格式大小判断
        materImgBeforeUpload(file){
            const isJPG = file.type === "image/jpeg" || file.type === "image/png";;
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                Message.error('只能上传jpg/png图片!');
            }
            if (!isLt2M) {
                Message.error('图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 上传图片成功后、
        materImgSuccess(res, file){
            console.log('res----file----', res, file, this.shopList);
            // this.copyAsidArr  imgUrl
            // this.materInfoArr   imgUrl
            // this.shopList
            for(let data of this.shopList){
                data.imgUrl = res[0].pURL;
            }
            for(let data of this.materInfoArr){
                for(let item of this.shopList){
                    if(data.asID == item.asID && data.lStar == item.lStar && data.lEnd == item.lEnd){
                        data.imgUrl = item.imgUrl;
                        data.uploadUser = this.sessionData.uID;
                        break;
                    }
                }
            }

        },
        // 清空
        // clearAll(){},
        // 勾选一条
        handleSelect(selection, row){
            console.log('selection___________', selection, row);
			row.isSelect = !row.isSelect;
			console.log('row.isSelect-------', row.isSelect);
			if(row.isSelect){
				let bool = true;
				for(let data of this.shopList){
					if(data.asID == row.asID  && data.lStar == row.lStar && data.lEnd == row.lEnd ){
						bool = false;
						break;
					}
				}
				if(bool){
					this.shopList.push(row);
				}

			}else{

				for(let i = 0; i< this.shopList.length; i++){
					if(this.shopList[i].asID == row.asID && this.shopList[i].lStar == row.lStar && this.shopList[i].lEnd == row.lEnd ){
						this.shopList.splice(i, 1);
					}
				}
			}
			console.log('this.shopList-----', this.shopList);
        },
        // 全选
        handleSelectAll(selection){
            console.log('selection___fdas____', selection);
			if(selection.length){
				for(let data of this.materInfoArr){
					data.isSelect = true;
					let bool = true;
					for(let item of this.shopList){
						if(data.asID == item.asID  && data.lStar == item.lStar && data.lEnd == item.lEnd ){
							console.log('重复了');
							bool = false;
							break;
						}
					}
					if(bool){
						this.shopList.push(data);
					}
				}
				console.log('this.shopListSelectTrue',this.shopList);
			}else{
				for(let data of this.materInfoArr){
					data.isSelect = false;
					for(let i = 0; i< this.shopList.length; i++){
						if(this.shopList[i].asID == data.asID && this.shopList[i].lStar == data.lStar && this.shopList[i].lEnd == data.lEnd ){
							this.shopList.splice(i, 1);
							break;
						}
					}
				}
				console.log('取消全选之后的数据', this.shopList);
			}
        },
        // 是否勾选更新
		SelectioUpdate(){
			let timer = setTimeout(() => {
                for(let item of this.shopList){
                    for(let data of this.materInfoArr){
                        if(item.asID == data.asID && item.lStar == data.lStar && item.lEnd == data.lEnd){
                            data.isSelect = true;
                            data.remark = item.remark;
                            data.imgUrl = item.imgUrl;
                            this.$refs.multipleTable.toggleRowSelection(data, true);
                        }
                    }
                }
				clearTimeout(timer);
			}, 0);
		},
        // 保存备注
        saveRemark(){
            this.showRemark = false;
            console.log('this.remarkInfo---', this.remarkInfo, this.shopList);
            for(let data of this.shopList){
                data.remark = this.remarkInfo;
            }
            for(let data of this.materInfoArr){
                for(let item of this.shopList){
                    if(data.asID == item.asID && data.lStar == item.lStar && data.lEnd  == item.lEnd){
                        data.remark = item.remark;
                        break;
                    }
                }
            }
            console.log(this.materInfoArr, this.shopList);
        },
        // 查看图片
        previewImg(row){
            this.dialogImageUrl = row.imgUrl;
            this.dialogVisible = true;
        },
        // 删除图片链接
        deleteOneImg(row, index){
            for(let data of this.materInfoArr){
                if(data.asID == row.asID && data.lStar == row.lStar && data.lEnd == row.lEnd){
                    data.imgUrl = '';
                    // Message.success('删除成功');
                    break;
                }
            }
        },
        // 保存所有信息
        saveAll(){
            console.log('this.materInfoArr---', this.materInfoArr);
            if(this.shopList.length){
                let result = [];
                for(let data of this.materInfoArr){
                    if(data.imgUrl || data.remark){
                        let obj = {
                            "lID": data.lID,
                            "picUrl": data.imgUrl,
                            "remark": data.remark,
                            "uploadUser": data.uploadUser? data.uploadUser : this.sessionData.uID
                        };
                        result.push(obj);
                    }
                }
                if(result.length){
                    let info = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        adMaterails: JSON.stringify(result),
                    };
                    api.postApi(this.apiVar.Advertisement+ '/AddAdMaterial', info).then(res =>{
                        console.log(res.data);
                        if(res.data.SysCode == 200200){
                            Message.success(res.data.MSG);
                        }else if(res.data.SysCode == 100302){
                            this.loginTimeout();
                        }else{
                            Message.warning(res.data.MSG);
                        }
                    });
                }else{
                    Message.warning('没有需要保存的点');
                }
            }else{
                Message.warning('请先勾选选点');
            }
        },
        //返回列表
        goBack() {
            let isChange = sessionStorage.getItem('change_point');
            if(isChange =='yes'){
                sessionStorage.setItem('change_point', 'no');
                // location.reload();
                this.usableBtn = false;
                $(window).scrollTop(0);
                this.showTitle = false;
                this.showBtn = true;
                this.showHandel = false;
            }else{
                this.$router.push("./orderList");
            }
        },
        // 获取选点排期列表数据
        getInitData() {
            // 真实数据
            let apid = sessionStorage.getItem("order_apid");
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apid: apid
            };
            // uid         int【必填】     当前账户UserID
            // apid        int             公司对应方案apID
            api.getApi(this.apiVar.Advertisement+"/GetFanganInfo", info)
                .then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let info = res.data.data;
                        this.orderDetail = {
                            adcID: info.adcID,
                            apID: info.apID,
                            apQC: info.apQC,
                            apName: info.apName,
                            apState: info.apState,
                            apTotal: info.apTotal,
                            apcTime: info.apcTime,
                            bTitle: info.bTitle,
                            cName: info.cName,
                            cuName: info.cuName,
                            pdEnd: info.pdEnd,
                            pdStar: info.pdStar,
                            rID: info.rID,
                            rIDs: info.rIDs,
                            realName: info.realName,
                            pdTotal: this.priceFormat((info.apTotal - info.adOtherFee- info.adSendFee)/100),
                            pdSendFee: this.priceFormat(info.adSendFee/100),
                            pdOtherFee: this.priceFormat(info.adOtherFee/100),
                            Total: this.priceFormat(info.apTotal/100),
                            AdDoor:{
                                pdTotal: this.priceFormat((info.AdDoor.pdTotal - info.AdDoor.adOtherFee- info.AdDoor.adSendFee)/100),
                                pdSendFee: this.priceFormat(info.AdDoor.adSendFee/100),
                                pdOtherFee: this.priceFormat(info.AdDoor.adOtherFee/100),
                            },
                            barrier:{
                                pdTotal: this.priceFormat((info.barrier.pdTotal - info.barrier.adOtherFee- info.barrier.adSendFee)/100),
                                pdSendFee: this.priceFormat(info.barrier.adSendFee/100),
                                pdOtherFee: this.priceFormat(info.barrier.adOtherFee/100),
                            },
                        };
                        // this.orderDetail = info;
                        console.log('orderDetail',this.orderDetail)
                        this.apQC = this.orderDetail.apQC ? this.orderDetail.apQC : this.getContractNo(this.orderDetail.rID);
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    console.log(res);
                });
        },
        // 获取选点排期
        getSetPoint(string) {

            if (this.setpointArr.length && string !== 'add') {
                return;
            }
            // 真实数据
            let loginData = this.sessionData;
            let apid = sessionStorage.getItem("order_apid");
            let info = {
                uid: loginData.uID,
                apid: apid,
                token: loginData.token
            };
            // uid         int【必填】     当前账户UserID
            // apid        int             公司对应方案apID
            api.getApi(this.apiVar.Advertisement+"/GetAdLaunch", info)
                .then(res => {
                    console.log(res.data);
                    if (!res.data.SysCode) {
                        let initData = res.data;
                        let result = initData.adSpaceInfo;
                        let mediaAd = [];
                        let mediaDao = [];
                        let cityAd = [];
                        let cityDao = [];
                        // this.addNewAdsNum = res.data.isNewCount
                        for (let data of result) {
                            let time = this.formatTime(data.lStar) + "-" +this.formatTime(data.lEnd);
                            data.timeRange = time;
                            let finishTimeRange = '';
                            if(data.lState ==2){
                                finishTimeRange = this.formatTime(data.lStar)+"-"+this.formatTime(data.lSetTime);
                            }
                            data.finishTimeRange = finishTimeRange;
                            if(data.mVehicle == '广告门'){
                                mediaAd.push(data);
                                cityAd.push(data);
                            }
                            if(data.mVehicle == '道闸'){
                                mediaDao.push(data);
                                cityDao.push(data);
                            }

                        }
                        // 选点排期
                        this.copyAsidArr = JSON.parse(JSON.stringify(result));

                        this.setpointArr = result;
                        this.currentSetpoint = this.setpointArr;
                        // 城市筛选过滤
                        this.filterCityData = filterFormat(result, "city");
                        console.log('城市filter',this.filterCityData)
                        this.filtersArea = filterFormat(result, "rName");
                        this.filtersData = filterFormat(result, "timeRange");
                        // 上下刊包括头部搜索数据源
                        this.mediaAdData = filterFormat(mediaAd, 'resID', "resName");
                        this.mediaDaoData = filterFormat(mediaDao, 'resID', "resName");
                        // this.allResource = filterFormat(result, 'resID', "resName");

                        // 区域二级联动
                        this.AdCitys = this.getCitys(cityAd);
                        this.AdCitys.unshift({
                            value: "全部",
                            label: "全部"
                        });
                        this.DaoCitys = this.getCitys(mediaDao);
                        this.DaoCitys.unshift({
                            value: "全部",
                            label: "全部"
                        });
                        this.allResource = this.mediaAdData;
                        this.citys = this.AdCitys;
                        console.log('resource--', this.allResource);

                        // 广告门物料信息
                        let mInfo = initData.gateMaterialInfo;
                        let materialRes = [];
                        for(let data of mInfo){
                            let str = data.gateMaterialSize.split('-');
                            let obj = {
                                adSize: str[0],
                                adViewSize: str[1],
                                pointNum : data.gateMaterialCount,
                                resolution : "150dpi",
                                colorMode : "CMYK",
                                photoFormat : "JPG/TIF/AI/PSD/CDR",
                            };
                            materialRes.push(obj);
                        }
                        this.materialInfo = materialRes;

                        // 道闸物料信息
                        let InfoTest = initData.roadGateMaterialInfo;
                        let daoRes = [];
                        for(let data of InfoTest){
                            let str = data.roadGateMaterialSize.split('-');
                            let obj = {
                                adSize: str[0],
                                adViewSize: str[1],
                                pointNum : data.roadGateMaterialCount,
                                resolution : "150dpi",
                                colorMode : "CMYK",
                                photoFormat : "JPG/TIF/AI/PSD/CDR",
                            };
                            daoRes.push(obj);
                        }
                        this.daoInfo = daoRes;

                        this.loading = false;
                        this.maLoading = false;
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout();
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
        // 被终止了的选点根据条件不显示上下刊报告
        filterInitData(arr){
            let result = [];
            for(let data of arr){
                let finish = dateFormat.toDate(data.lSetTime, '');
                let start = dateFormat.toDate(data.lStar, '');
                if(data.lState ==2 &&  finish < start){

                }else{
                    result.push(data);
                }
            }
            return result;
        },
        // 搜索数据格式化
        searchFormat(type){
            let session = this.sessionData;
            let info = {
                uid: session.uID,
                token: session.token,
                apId: sessionStorage.getItem('order_apid'),
                pType: type,
                pageNum: (type =='SK') ? this.currUpPage : this.currDownPage,
                pageSize: (type =='SK') ? this.pageUpSize : this.pageDownSize,
                mVehicle: (type =='SK') ? this.mediaUpType : this.mediaDownType,
            };
            let citySelect = this.citySelect;
            let allhouse = this.allhouse;
            let allPic = this.allPic;

            if(allPic){
                if(allPic == '2'){
                    info.hasUpload = "true";
                }
                if(allPic == '3'){
                    info.hasUpload = "false";
                }
            }
            if(citySelect.length){
                if(citySelect[0] == '全部'){
                    // this.searchFun();
                }else{
                    info.city = citySelect[0];
                    info.district = citySelect[1];
                }
            }
            if(allhouse){
                info.resid = allhouse;
            }
            console.log('type---', info);
            return info;
        },
        searchFun(){
            if(this.planPanel == 'forth'){
                let upinfo = this.searchFormat('SK');
                this.getUpImgInfo(upinfo);
            }else if(this.planPanel == "fifth"){
                let downinfo = this.searchFormat('XK');
                this.getDownImgInfo(downinfo);
            }
        },
        // 获取上刊图片数据
        getUpImgInfo(params) {
            api.postApi(this.apiVar.Advertisement+"/GetImg", params)
                .then(res => {
                    if (!res.data.SysCode) {
                        console.log(res.data);
                        let dataInfo = res.data;
                        this.totalUpNum = dataInfo.totalCount;
                        this.totalUpPageNum = dataInfo.searchCount;
                        this.currUpNum = dataInfo.hasPhotoCount;
                        this.upImgPercent = this.totalUpNum? Math.ceil((this.currUpNum / this.totalUpNum)*100):0;
                        for(let data of dataInfo.dataList){
                            for(let item of data.photoList){
                                item.name = item.pID+'.png',
                                item.url = item.pURL;
                                item.pID = item.pID;
                                item.isCollection = false
                            }
                            let time = this.formatTime(data.lStar) + "-" +this.formatTime(data.lEnd);
                            data.timeRange = time;
                            data.upImgArr = data.photoList;
                        }
                        this.pageUpReportArr = dataInfo.dataList;
                        this.checkImgStatus('SK')
                        console.log('this.pageUpReportArr',this.pageUpReportArr)
                        this.UpReportLoading = false;
                        if(dataInfo.totalCount == 0){
                            Message.warning('暂无数据');
                        }
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    this.UpReportLoading = false;
                    console.log(res);
                });
        },

        // 获取下刊图片数据
        getDownImgInfo(params) {
            api.postApi(this.apiVar.Advertisement+"/GetImg", params)
                .then(res => {
                    if (!res.data.SysCode) {
                        console.log(res.data);
                        let dataInfo = res.data;
                        this.totalDownNum = dataInfo.totalCount;
                        this.totalDownPageNum = dataInfo.searchCount;
                        this.currDownNum = dataInfo.hasPhotoCount;
                        this.downImgPercent = this.totalDownNum? Math.ceil((this.currDownNum / this.totalDownNum)*100):0;
                        for(let data of dataInfo.dataList){
                            for(let item of data.photoList){
                                item.name = item.pID+'.png',
                                item.url = item.pURL;
                                item.pID = item.pID;
                                item.isCollection = false;
                            }
                            let time = this.formatTime(data.lStar) + "-" +this.formatTime(data.lEnd);
                            data.timeRange = time;
                            data.downImgArr = data.photoList;
                        }
                        this.pageDownReportArr = dataInfo.dataList;
                        this.checkImgStatus('XK')
                        this.DownReportLoading = false;
                        if(dataInfo.totalCount == 0){
                            Message.warning('暂无数据');
                        }
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    this.DownReportLoading = false;
                    console.log(res);
                });
        },
        // 检查图片是否已收藏
        checkImgStatus(type){
            //advertisement/GetUserStatusByPid
            let pIDList = this.returnPIDList(type)
            if(!pIDList.length){
                return
            }
            let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                pids: pIDList.join(','),
            }
            console.log('params',params)
            api.getApi(this.apiVar.Advertisement + '/GetUserStatusByPid',params).then(res=>{
                console.log('检测图片收藏状态res',res)
                if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                    this.loginTimeout()
                } else if (res.data.SysCode === 200200) {
                    this.setImgStatus(res.data.data,type)
                } else {
                    this.messageFun('warning', res.data.MSG)
                }
            })
        },
        // 返回PIDList
        returnPIDList(type){
            let reportList = []
            if(type === 'SK'){
                reportList = this.pageUpReportArr
            }else if (type === 'XK'){
                reportList = this.pageDownReportArr
            }
            console.log(type,'reportList',reportList)
            let pIDList = []
            for(let key of reportList){
                let imgArr = type === 'SK' ? key.upImgArr : key.downImgArr
                for(let imgKey of imgArr){
                    pIDList.push(imgKey.pID)
                }
            }
            return pIDList
        },
        // 给上下刊添加图片的收藏状态
        setImgStatus(data,type){
            console.log('给上下刊添加图片的收藏状态',data)
            let reportList = []
            if(type === 'SK'){
                reportList = this.pageUpReportArr
            }else if (type === 'XK'){

            }
            console.log(type,'添加图片的收藏状态',reportList)
            for (let key of reportList) {
                let imgArr = type === 'SK' ? key.upImgArr : key.downImgArr
                for (let imgKey of imgArr) {
                    for (let pKey of data) {
                        if (pKey.pid == imgKey.pID) {
                            imgKey.isCollection = pKey.isCollection
                            break
                        }
                    }
                }
            }
            console.log('reportList',reportList,this.pageUpReportArr)
        },
        // 区域二级联动
        getCitys(arr) {
            let cityArr = [];
            for (let data of arr) {
                let obj = {
                    value: data.city,
                    label: data.city,
                    children: []
                };
                if (
                    JSON.stringify(cityArr).indexOf(JSON.stringify(obj)) === -1
                ) {
                    cityArr.push(obj);
                }
            }
            for (let item of cityArr) {
                for (let data of arr) {
                    let areaObj = {
                        value: data.rName,
                        label: data.rName
                    };
                    if (data.city == item.value) {
                        // 去重
                        if (
                            JSON.stringify(item.children).indexOf(
                                JSON.stringify(areaObj)
                            ) === -1
                        ) {
                            item.children.push(areaObj);
                        }
                    }
                }
            }
            console.log("cityArr---------------fda", cityArr);
            return cityArr;
        },
        // 时间格式规范 年月日
        formatTime(val) {
            return dateFormat.toDate(val, "/");
        },
        // 时间格式规范 年月日时分秒
        formatToTime(val) {
            return dateFormat.toDateTime(val, "/");
        },
        // 价格加上逗号
        priceFormat(price) {
            // console.log('price', price);
            return commaFormat.init(price);
        },
        priceToFormat(price){
            return commaFormat.format(price);
        },
        // 随机生成合同编号
        getContractNo(rid) {
            let date = new Date();
            let result = "QC";
            result = result + dateFormat.toDate(date, "");
            result = result + rid.toString().substring(0, 4);
            result = result + "00" + Math.round(Math.random() * 10);
            // console.log(result);
            return result;
        },
        // 当搜索框为空的时候进行重置显示
        init() {
            if (!this.keyword) {
                this.currentSetpoint = this.setpointArr;
            }
        },
        changeUpMedia(){
            if(this.mediaUpType == '广告门'){
                this.allResource = this.mediaAdData;
                this.citys = this.AdCitys;
                this.allResource.concat();
                this.citys.concat();
            }
            if(this.mediaUpType == '道闸'){
                this.allResource = this.mediaDaoData
                this.citys = this.DaoCitys;
                this.allResource.concat();
                this.citys.concat();
            }
            this.currUpPage = 1;
            this.currDownPage = 1;
            this.citySelect = [];
            this.allhouse = '';
            this.allPic = '';

            this.searchFun();
            console.log('citys----dfsa', this.citys);
        },
        changeDownMedia(){
            if(this.mediaDownType == '广告门'){
                this.allResource = this.mediaAdData;
                this.citys = this.AdCitys;
                this.allResource.concat();
                this.citys.concat();
            }
            if(this.mediaDownType == '道闸'){
                this.allResource = this.mediaDaoData
                this.citys = this.DaoCitys;
                this.allResource.concat();
                this.citys.concat();
            }
            this.currUpPage = 1;
            this.currDownPage = 1;
            this.citySelect = [];
            this.allhouse = '';
            this.allPic = '';
            this.searchFun();
        },
        // 搜索
        search() {
            // 账号，姓名
            console.log(this.selectRecName);
            console.log(this.keyword);
            let select = this.selectRecName;
            let keyword = this.keyword;
            if (this.keyword) {
                let arr = [];
                for (let data of this.setpointArr) {
                    if (data.resName) {
                        if (select == "1" && data.resName.includes(keyword)) {
                            arr.push(data);
                        }
                    }
                }
                this.currentSetpoint = arr;
                return;
            }
            this.currentSetpoint = this.setpointArr;
        },
        searchImgChange(){
            let citySelect = this.citySelect;
            if(citySelect[0] == "全部"){
                this.allPic = '';
                this.allhouse ='';
            }
            this.searchImg();
        },
        // 上下刊搜索图片
        searchImg() {
            this.currUpPage = 1;
            this.currDownPage = 1;
            let citySelect = this.citySelect;
            let allhouse = this.allhouse;
            let allPic = this.allPic;

            if(citySelect || allhouse || cityWord || (status>=0)){
                this.currentOrder = [];
                this.loading_point = false;
                this.currPage = 1;
                this.searchFun();
            }else{
                this.$message.warning('请输入搜索条件');
            }
        },
        // 城市筛选
        filterCity(value, row) {
            return row.city === value;
        },
        // 地区筛选
        filterRName(value, row) {
            return row.rName === value;
        },
        // 排期筛选
        filterTimeRange(value, row) {
            return row.timeRange === value;
        },
        // 字段截取
        wordlimit(word, num) {
            if(document.body.clientWidth<=1366){
                if (word && (word.length > num)) {
                    return word = word.substr(0, num) + '...';
                }
                return word;
            }else{
                return word;
            }
        },
        // 隐藏上传组件
        uploadDisabled(imgList){
            // console.log(imgList);
            return imgList.length>5;
        },
        // 上刊图片上传
        submitUpload(type){
            if(!this.constractArr.length){
                return;
            }
            this.addload = this.$loading({
                lock: true,
                text: '保存数据中,请稍等...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let arr = this.uploadImgArr;

            this.UploadTime = parseInt( arr.length / 6 );
            let a1 = arr.length % 6;
            if(a1 > 0){
                this.UploadTime++;
            }
            this.submitUpload_(type, 1)

        },
        submitUpload_(type, index){
            if(!this.constractArr.length){
                return;
            }
            let arr = this.uploadImgArr;

            if(this.UploadTime >= index){
                let timeArr = [];
                let formData = new FormData();
                for(let i = (index-1)*6, iLen = arr.length; i<=iLen; i++ ){
                    if(timeArr.length < 6){
                        if(i >= iLen){
                            api.postUpload_file(this.doUpload, formData).then(res =>{
                                console.log(res);
                                if(!res.data.SysCode){
                                    let result = res.data;
                                    for(let data of result){
                                        this.uploadPidArr.push(data);
                                    }
                                    index++;
                                    this.submitUpload_(type, index);
                                }else{
                                    this.addload.close();
                                    Message.warning(res.data.MSG);
                                }
                            })
                            break;
                        }else{
                            timeArr.push(i);
                            formData.append('file[]', arr[i]);
                        }
                    }else{
                        if(timeArr.length >= 6){
                            api.postUpload_file(this.doUpload, formData).then(res =>{
                                console.log(res);
                                if(!res.data.SysCode){
                                    let result = res.data;
                                    for(let data of result){
                                        this.uploadPidArr.push(data);
                                    }
                                    index++;
                                    this.submitUpload_(type, index);
                                }else{
                                    this.addload.close();
                                    Message.warning(res.data.MSG);
                                }
                            })
                            break;
                        }
                    }

                }
            }else{
                console.log('++++this.uploadPidArr++++', this.uploadPidArr);
                this.uploadConect(type, this.uploadPidArr);
            }
        },
        uploadConect(type, result){
            let uid = this.sessionData.uID;
            let token = this.sessionData.token;
            let imgsTypes =  this.constractArr;
            let pidarr = this.uploadPidArr;
            for(let t = 0, tLen=pidarr.length; t<tLen; t++){
                pidarr[t].pAlt = imgsTypes[t].pAlt
                pidarr[t].pRemarks = imgsTypes[t].pRemarks;
                pidarr[t].pType = type;
                pidarr[t].ptID = imgsTypes[t].ptID;
                pidarr[t].ptP = imgsTypes[t].ptP;
                pidarr[t].puID = imgsTypes[t].puID;
                pidarr[t].realName = imgsTypes[t].realName;
            }

            let imgs = {
                imgs: pidarr
            };
            console.log('pidarr---', pidarr);
            api.postApi_json(this.apiVar.Advertisement+'/SetImgList?uid='+uid+'&token='+token, imgs).then(res =>{
                console.log(res.data);
                this.addload.close();
                if(res.data.SysCode == 300200){
                    Message.success(res.data.MSG);
                    this.constractArr = [];
                    this.uploadImgArr = [];
                    this.uploadPidArr = [];
                    this.UploadTime = 0;
                    this.searchFun();
                } else if (res.data.SysCode == 100302) {
                    this.loginTimeout();
                } else {
                    Message.warning(res.data.MSG);
                }
            }).catch(res =>{
                this.addload.close();
            });
        },
        // 收藏
        saveImgFun(item,index,type){
            console.log('保存图片', item,index)
            let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                lId: item.lID,
                pId: type === 'SK' ? item.upImgArr[index].pID : item.downImgArr[index].pID,
                picUrl: type === 'SK' ? item.upImgArr[index].url : item.downImgArr[index].url,
                type: this.planPanel === 'forth' ? 0 : this.planPanel === 'fifth' ? 1 : "",
            }
            if (!params.lId) {
                this.messageFun('warning', '图片信息异常无法保存！')
                return
            }
            if (params.type === "") {
                delete params.type
            }
            console.log('params', params)
            api.postApi(this.apiVar.Advertisement + '/imageCollection/add', params).then(res => {
                console.log('图片收藏res', res)
                if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                    this.loginTimeout()
                } else if (res.data.SysCode === 200200) {
                    if(type === 'SK'){
                        item.upImgArr[index].isCollection = true
                    }else if(type === 'XK'){
                        item.downImgArr[index].isCollection = true
                    }
                    this.messageFun('success', '收藏成功')
                } else {
                    this.messageFun('warning', res.data.MSG)
                }
            })
        },
        // 取消收藏
        cancelImgFun(item,index,type){
            console.log('取消收藏',item,index)
            let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                pId: type === 'SK' ? item.upImgArr[index].pID : item.downImgArr[index].pID,
            }
            api.postApi(this.apiVar.Advertisement + '/imageCollection/remove', params).then(res => {
                console.log('取消收藏res', res)
                if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                    this.loginTimeout()
                } else if (res.data.SysCode === 200200) {
                    if(type === 'SK'){
                        item.upImgArr[index].isCollection = false
                    }else if(type === 'XK'){
                        item.downImgArr[index].isCollection = false
                    }
                    this.messageFun('success', '取消成功')
                } else {
                    this.messageFun('warning', res.data.MSG)
                }
            })
        },
        // 删除已上传的图片
        deleteImg(item){
            console.log('删除item',item)
            if(item.pID){
                this.$confirm('确定移除这张图片吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleRemove(item)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        uploadImg(params){
            console.log('parmas---', params);
            var fileObj = params.file;
            this.constractArr.push(this.upLoadObj);
            this.uploadImgArr.push(fileObj);
        },
        // 点击上传图片按钮之时进行储存所需数据(asid, ptp等)
        saveId(row) {
            console.log("row------", row);
            let palt = this.orderDetail.apName+'-'+row.resName+"-"+row.mTitle+row.asLab;
            let ptp = sessionStorage.getItem("order_apid");
            let account = this.sessionData.username;
            let username = this.sessionData.realName;
            let prk = {
                plan: this.orderDetail.apName ? this.orderDetail.apName : "",
                res: row.resName ? row.resName : "",
                media: row.mTitle ? row.mTitle : "",
                city: row.city ? row.city : "",
                area: row.rName ? row.rName : "",
                asLab: row.asLab ? row.asLab : "",
                lstart: row.lStar ? row.lStar : "",
                lend: row.lEnd ? row.lEnd : "",
                assettag: row.assetTag ? row.assetTag : "",
                brand: this.orderDetail.bTitle ? this.orderDetail.bTitle : "",
                account: account ? account : "",
                username: username ? username : "",
                resid: row.resID ? row.resID : "",
                address: row.resAddress ? row.resAddress : "",
                lid: row.lID ? row.lID : ""
            };
            let obj = {
                pAlt: palt,
                pID: '',
                pRemarks: JSON.stringify(prk),
                pSrc: '',
                pType: 'SK',
                pURL: "",
                pUTime: '',
                ptID: row.mVehicle=='广告门' ? row.asID: row.mID,
                ptP: ptp,
                puID: 0,
                realName: account,
            };
            this.upLoadObj = obj;
        },
        beforeImgRemove(file, fileList){
            if(file.pID){
                return this.$confirm(`确定移除这张图片吗？`);
            }
        },
        // 限制只能上传png,jpeg格式的照片
        beforeAvatarUpload(file) {
            const isIMAGE = file.type === "image/jpeg" || file.type === "image/png";
            const isLt1M = file.size / 1024 / 1024 < 8;

            if (!isIMAGE) {
                Message.error("只能上传jpg/png图片!");
            }
            if (!isLt1M) {
                Message.error("上传文件大小不能超过 8MB!");
            }
            return isIMAGE&&isLt1M;
        },
        // 超过图片上传个数
        handleExceed(files, fileList) {
            console.log(files, fileList);
            Message.warning(`当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        //删除照片
        handleRemove(file, fileList) {
            console.log('fdasl--ff', file, fileList);
            if(file.pID){
                let type = file.pType;
                let info = file;
                file.pType = 'del';
                let uid = this.sessionData.uID;
                let token = this.sessionData.token;
                let img = {
                    imgs: [info]
                };
                api.postApi_json(this.apiVar.Advertisement+'/SetImgList?uid='+uid+'&token='+token, img)
                    .then(res => {
                        console.log(res.data);
                        // 实时更新进度条
                        if (res.data.SysCode == 300200) {
                            Message.success(res.data.MSG);
                            this.allPic = '';
                            this.searchFun();
                        } else if (res.data.SysCode == 100302) {
                            this.loginTimeout();
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
            }else{
                let upLoad = this.uploadImgArr;
                for(let i = 0, iLen = upLoad.length; i<iLen; i++ ){
                    if(file.uid == upLoad[i].uid){
                        upLoad.splice(i, 1);
                        this.constractArr.splice(i, 1);
                        break;
                    }
                }
            }
        },
        // 查看预览图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 更新报告
        updateReport(type){
            let info = {
                apId: this.orderDetail.apID,
                type: type,
            };
            this.updateLoading = true;
            api.postApi(this.apiVar.Advertisement+"/UpdateSXReport", info).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 200200){
                    Message.success(res.data.MSG);
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
                }
                this.updateLoading = false;
            }).catch(err =>{
                console.log(err);
                this.updateLoading = false;
            });
        },
        // 查看h5上下刊刊报告按钮
        showH5(type){
            let apid = sessionStorage.getItem('order_apid');
            let tempwindow = window.open();
            api.getApi(this.apiVar.UCAPI+'/EncryptNo', {num: apid}).then(res =>{
                console.log(res.data);
                tempwindow.location = "/Report?"+type+"="+res.data.EncryptCode;
            }).catch(res =>{
                console.log(res);
            });
        },
        // 取消修改合同编号
        cancelChangeID() {
            this.changeCID = false;
            Message.info("取消修改合同编号");
        },
        // 修改合同编号
        confirmChangeID() {
            let reg = /^[^\u4e00-\u9fa5]{0,}$/;
            if (!reg.test(this.apQC)) {
                Message.warning("只能输入字母、数字、符号");
                return;
            }
            let qc = this.apQC;
            let apid = this.orderDetail.apID;
            let session = this.sessionData;
            // uid         int【必填】     当前账户UserID
            // apid        int【必填】     方案apID
            // qc          String【必填】  方案合同编号
            let info = {
                uid: session.uID,
                token: session.token,
                apid: apid,
                qc: qc
            };
            api.postApi(this.apiVar.Advertisement+"/SetAdPlan", info)
                .then(res => {
                    console.log(res);
                    if (res.data.SysCode == 300200) {
                        this.$set(this.orderDetail, "apQC", qc);
                        Message.success(res.data.MSG);
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
                .catch(res => {
                    console.log(res);
                });
            this.changeCID = false;
        },
        loginTimeout() {
            Message.warning("登录超时,请重新登录")
            this.$router.push("/login");
        },
        conFirmStopAds(){
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                lids: this.nowRow.lID
            };
            console.log('info---', info);
            MessageBox.confirm(
                `是否在${this.finishDate}这一天终止 ${this.nowRow.resName + this.nowRow.mTitle + this.nowRow.asLab}面在 ${
                    this.nowRow.timeRange
                } 的投放？\n`,
                "提示",
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).then(() => {
                api.postApi(this.apiVar.Advertisement+"/StopADS", info)
                    .then(res => {
                        console.log(res.data);
                        if (!res.data.SysCode) {
                            let resdata = res.data;
                            this.$set(this.nowRow, "lState", resdata.lState);
                            this.$set(this.nowRow, "lSetTime", resdata.lSetTime);
                            let time = this.formatTime(resdata.lStar)+"-"+this.formatTime(resdata.lSetTime);
                            this.$set(this.nowRow, 'finishTimeRange', time);
                            this.isFinish = false;
                            Message.success("终止成功");
                        } else if (res.data.SysCode == 100302) {
                            this.loginTimeout();
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
                })
                .catch(() => {
                    Message.info("已取消操作");
                    this.isFinish = false;
                });

        },
        //终止操作确认操作对话框
        disContinue(row) {
            // this.isFinish = true;
            // this.finishDate = '';
            // this.dateRange.beginDate = this.formatTime(row.lStar);
            // this.dateRange.endDate = this.formatTime(row.lEnd);
            // this.nowRow = row;

            // console.log(this.dateRange);
            this.nowRow = row;
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                lids: row.lID
            };
            MessageBox.confirm(
                `是否终止 ${row.resName + row.mTitle + row.asLab}面在 ${
                    row.timeRange
                } 的投放？\n`,
                "提示",
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            ).then(() => {
                api.postApi(this.apiVar.Advertisement+"/StopADS", info)
                    .then(res => {
                        console.log(res.data);
                        if (!res.data.SysCode) {
                            if(res.data){
                                // this.$set(row, "lState", res.data.lState);
                                // this.$set(row, "lSetTime", res.data.lSetTime);
                                // Message.success("终止成功");
                                let resdata = res.data;
                                this.$set(this.nowRow, "lState", resdata.lState);
                                this.$set(this.nowRow, "lSetTime", resdata.lSetTime);
                                let time = this.formatTime(resdata.lStar)+"-"+this.formatTime(resdata.lSetTime);
                                this.$set(this.nowRow, 'finishTimeRange', time);
                                this.isFinish = false;
                                Message.success("终止成功");
                            }else{
                                Message.warning('系统异常,请稍后重试');
                            }

                        } else if (res.data.SysCode == 100302) {
                            this.loginTimeout();
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
                })
                .catch(() => {
                    Message.info("已取消操作");
                });

        },

        cancelChangeRemark() {
            this.changeRemark = false;
            Message.info("取消修改监播备注");
        },
        confirmChangeRemark() {
            this.changeRemark = false;
            Message.success("修改监播备注成功");
        },
        //点击换点
        changePoint() {
            // Message.warning("该功能尚未完善");
            sessionStorage.setItem('change_point', 'yes');
            this.usableBtn = true;
            $(window).scrollTop(288);
            this.showTitle = true;
            this.showBtn = false;
            this.showHandel = true;
        },
        //保存更换点位
        saveChangePoint() {
            this.usableBtn = false;
            this.showTitle = false;
            this.showBtn = true;
            this.showHandel = false;
        },
        //取消更换点位
        cancelChangePoint() {
            this.usableBtn = false;
            this.showTitle = false;
            this.showBtn = true;
            this.showHandel = false;
        },
        //显示添加点位的模态框
        showAddPointDialog(){
            let pdidArr = this.pdidList
            console.log('pdidarr---', pdidArr);
            this.dialogAddPoint = true
            this.IsAddPoint = !this.IsAddPoint
            // if(this.IsAddPoint){
            //     this.IsAddPoint = false
            // }
        },
        //获取子组件选择的点位数据
        ievent(...data){
            console.log('allData:',data);// data为包含传过来所有数据的数组，第一个元素是对象，第二个元素是字符串
            this.addAdsArr = data[0] //this.encodeHtml(data[0])
        },
        //添加点位对话框确认按钮
        confirmAddPoint() {
            let addload = this.$loading({
                lock: true,
                text: '加急添加中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            let shopingArr = this.addAdsArr
            let pdidArr = this.pdidList
            console.log('pdidarr---', pdidArr);
            console.log('shopingArr',shopingArr)
            let userData = this.sessionData;
            let arr = []
            for (let i = 0; i < shopingArr.length; i++) {
                for (let n = 0; n < pdidArr.length; n++) {
                    if (shopingArr[i].city == pdidArr[n].city && shopingArr[i].asrID == pdidArr[n].asrID) {
                        if(pdidArr[n].pdType == 0 && shopingArr[i].mVehicle === '广告门'){
                            arr.push({
                                asID: Number(shopingArr[i].asID),
                                pdID: pdidArr[n].pdID,
                                pbStar:(shopingArr[i].schedules.split('-')[0]).split('/').join('-'),    // 开始投放时间
                                pbEnd: (shopingArr[i].schedules.split('-')[1]).split('/').join('-'),       // 开始投放时间
                                uID: this.sessionData.uID,
                            })
                            break
                        }else if(pdidArr[n].pdType == 1 && shopingArr[i].mVehicle === '道闸'){
                            for(let key of shopingArr[i].asID){
                                arr.push({
                                    asID: Number(key),
                                    pdID: pdidArr[n].pdID,
                                    pbStar: shopingArr[i].schedules.split('-')[0],
                                    pbEnd: shopingArr[i].schedules.split('-')[1],
                                    uID: this.sessionData.uID,
                                    // pbSetTime: pbSetTime,
                                })
                            }
                            break
                        }
                    }
                }
            }
            let postData = { uID: userData.uID, token: userData.token, asIDList: arr}
            console.log('添加点位对话框确认按钮', postData)
            api.postApi_json(this.apiVar.Advertisement + '/SetPDAS?uid='+ userData.uID + '&token=' + userData.token,
                JSON.stringify(postData)).then(res => {
                console.log('添加选点返回信息', res)
                addload.close()
                if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                    // addload.close()
                    this.loginTimeout()
                } else if (res.data.SysCode === 300500) {
                    Message.warning(res.data.MSG)
                }else {
                    if (res.data === '' || res.data === null) {
                        this.$message({
                            message: '新增点位失败',
                            type: 'warning'
                        })
                    } else {
                        Message.success("添加点位成功")
                        this.dialogAddPoint = false
                        this.IsAddPoint = true
                        this.getSetPoint('add')
                    }
                }
            })
        },
        //添加点位对话框取消按钮
        cancelAddPoint() {
            // this.IsAddPoint = true
            this.dialogAddPoint = false;
            // Message.info("已取消操作");
        },
        // 时间戳转换成日期格式 2018-06-18 10:33:24
        timestampToTime(timestamp) {
            let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = date.getDate() + ' ';
            let h = date.getHours() + ':';
            let m = date.getMinutes() + ':';
            let s = date.getSeconds();
            return Y + M + D + h + m + s;
        },
        // 导出图片包
        downloadImg(type){
            let info = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                apId: this.orderDetail.apID,
                type: type=='SK' ? 0 : 1,
                apName: this.orderDetail.apName,
                downtype: 1
            };
            this.downLoading = true;
            const tempPage = window.open('', '_blank');
            api.getApi(this.apiVar.Advertisement+'/DownloadImgPackage', info).then(res =>{
                if(res.data.SysCode == 200200){
                    // let routeUrl = this.$router.resolve({
                    //     path: "/progressDown",
                    //     query: info,
                    // });
                    // window.open(routeUrl.href, '_blank');

                    let routeUrl = this.$router.resolve({
                        path: "/progressDown",
                        query: info,
                    });
                    tempPage.location = routeUrl.href;
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
                }
                this.downLoading = false;
            }).catch(err =>{
                this.downLoading = false;
            });
        },
        // 操作提示统一方法
        messageFun(mesType,mes){
            this.$message({
                message: mes,
                type: mesType,
                showClose: true,
            })
        },
    },
};
</script>

<style scoped>
    /*修改合同号*/
    .changeCID {
        color: #1890ff;
        cursor: pointer;
        font-size: 16px;
    }

    /*tabbar*/
    /deep/ .el-textarea__inner {
        resize: vertical;
    }

    /deep/ .el-tabs__nav-wrap::after {
        background-color: transparent;
    }

    .box-wrap {
        background-color: #fff;
    }

    .first-wrap h4 span {
        font-size: 14px;
        color: #666;
        font-weight: normal;
        float: right;
        margin-right: 35px;
    }

    .price_quo {
        margin: 0 32px;
    }

    /deep/ .el-tabs__nav-scroll {
        padding-left: 28px;
    }

    .baojiadan /deep/ .el-tabs__nav-scroll {
        padding-left: 0;
    }

    .box-wrap > h4 {
        height: 55px;
        padding-left: 28px;
        border-bottom: 1px solid #e6e7e9;
        font-size: 16px;
        color: rgba(51, 51, 51, 0.85);
        line-height: 55px;
        font-weight: bold;
    }

    /deep/ .el-table__column-filter-trigger {
        position: relative;
        left: 5px;
    }

    .table_wrap {
        margin: 16px 32px;
    }

    /* 搜索 */
    .el-input {
        width: 180px;
        border-radius: 4px;
    }

    .input-with-select /deep/ .el-input__inner {
        font-size: 14px;
        vertical-align: middle;
        margin-right: 4px;
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

    .el-input {
        border-radius: 4px;
    }

    /deep/ .el-input__inner {
        font-size: 14px;
        vertical-align: middle;
    }

    /*报价单*/

    /deep/ .el-tabs--border-card {
        box-shadow: none;
    }

    /deep/ .el-tabs--border-card > .el-tabs__content {
        padding: 0 !important;
    }

    /deep/ .el-tabs__content {
        width: 100%;
    }

    .panel {
        margin: 0 32px;
    }

    .step3 {
        padding: 0 105px;
    }

    .price {
        width: 100%;
        height: 300px;
    }

    .price-left {
        box-sizing: border-box;
        padding-right: 66px;
        width: 49%;
        float: left;
        border-right: 1px dashed #d8d8d8;
    }

    .price-right {
        width: 49%;
        float: right;
        padding-left: 66px;
        box-sizing: border-box;
    }

    .price ul li {
        font-size: 14px;
        color: #666666;
        border-bottom: 1px solid #d8d8d8;
        height: 50px;
        line-height: 50px;
        margin-left: 19px;
        margin-right: 28px;
    }

    .price ul li:last-child {
        text-align: right;
        border-bottom: none;
        font-size: 18px;
        color: #333333;
        font-weight: bold;
    }

    .price ul li span {
        float: right;
    }

    /*详情头部*/
    .content_top_wrap {
        padding: 24px 32px;
        background: #ffffff;
        /* border: 1px solid #dedede; */
        height: 145px;
        position: relative;
    }

    .plan-title .handleBtn {
        position: absolute;
        right: 28px;
        top: 30px;
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

    .plan-title .el-input__inner {
        width: 100%;
    }

    .plan-detail {
        font-size: 14px;
        color: #333333;
        padding-left: 41px;
    }

    .plan-detail-left {
        float: left;
        width: 78%;
    }

    .plan-detail-left ul {
        width: 100%;
        float: left;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        text-align: left;
    }

    .plan-detail-left ul li {
        float: left;
        width: 280px;
        margin-bottom: 12px;
        display: flex;
    }

    .plan-detail-left ul li em {
        font-size: 14px;
        color: #666666;
    }

    .plan-detail-right {
        width: 20%;
        float: right;
        display: flex;
        justify-content: space-between;
    }

    .plan-detail-right dl {
        float: left;
        text-align: right;
    }

    .plan-detail-right dt {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
    }

    .plan-detail-right dd {
        margin-top: 4px;
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
    }

    /*物料信息*/
    /deep/ .el-table_2_column_16 .cell {
        text-align: right;
        padding-right: 20px;
    }
    .third-wrap{
        margin-bottom: 32px;
    }
    /*上刊报告*/
    .imgs-box {
        margin: 0 auto;
    }

    .up-loader-header {
        position: relative;
    }

    .progress {
        float: right;
    }

    /deep/ .up-loader-header .el-input__inner {
        height: 32px;
        width: 180px;
    }

    .moreimgs {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }

    .progress span {
        position: relative;
        top: 8px;
        left: 0;
        font-size: 14px;
        color: #666666;
    }

    /deep/ .el-progress-bar__outer {
        height: 10px !important;
    }

    /deep/ .el-progress-bar {
        width: 100%;
    }

    /deep/ .el-progress {
        position: absolute;
        line-height: 1;
        width: 43%;
        right: 65px;
        top: 10px;
    }

    .img-car {
        font-size: 14px;
        color: #666666;
        background: rgba(247, 247, 247, 1);
    }

    .car_header {
        border-top: 1px solid #dedede;
    }

    .car_header span {
        color: rgba(153, 153, 153, 1);
        line-height: 17px;
    }

    .date_fa {
        margin-right: 5px;
    }

    .up-loader-Imgpanel {
        margin-top: 11px;
        display: inline-block;
        margin-right: 2.6%;
        border: 1px solid #ebeef5;
        width: 22%;
        max-width: 383px;
        min-width: 350px;
    }

    /*上传图片*/
    /deep/ .el-card__header {
        font-size: 14px;
        height: 66px;
        color: #666666;
        background: rgba(247, 247, 247, 1);
        padding: 11px 12px;
    }

    /deep/ .el-card__body {
        padding: 0;
        height: 260px;
        overflow: hidden;
    }

    .upload-img span {
        position: absolute;
        top: 30px;
        left: 30px;
        font-size: 14px;
        color: #666666;
    }

    /deep/ .el-upload--picture-card {
        width: 30%;
        height: 105px;
        line-height: 105px;
        margin: 4.2% 1.6% 0 1.6%;
        background: rgba(251, 251, 251, 1);
        border-radius: 4px;
        border: 1px dashed #dedede;
        text-align: center;
    }

    /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 30%;
        height: 105px;
        margin: 4.2% 1.6% 0 1.6%;
    }

    /deep/ .up-loader-Imgpanel .el-card {
        border: none;
    }

    /*页码*/
    .pager {
        height: 32px;
        margin-top: 30px;
        text-align: right;
    }

    /deep/ .forth-wrap .el-radio-group {
        margin-bottom: 10px;
    }

    .up-report-bottom {
        text-align: center;
        margin: 20px;
    }

    .up-report-bottom-checkbox {
        margin-bottom: 10px;
    }

    /*按钮*/
    .content_bottom_btn {
        width: 100%;
        text-align: center;
        margin: 32px 0;
    }

    .content_bottom_btn /deep/ .el-button span a {
        color: #606266;
    }

    /*换点表格*/
    /deep/ .el-table td,
    .el-table th {
        padding: 4px 0;
        height: 48px;
    }

    /*添加点位对话框*/
    .first-wrap /deep/ .el-dialog {
        width: 87% !important;
    }

    /deep/ .el-dialog {
        width: 87%;
    }

    /*选择点位*/
    /deep/ .type-select .el-input,
    /deep/ .type-select .el-input__inner {
        width: 95px;
        position: relative;
        top: 0;
        left: -5px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        padding-right: 0;
        padding-left: 10px;
        height: 32px;
    }

    /deep/ .date-select.el-input__inner {
        width: 237px;
        position: relative;
        left: 1px;
        height: 32px;
    }

    /deep/ .el-date-editor .el-range__icon {
        position: relative;
        top: -2px;
        left: -3px;
    }

    /deep/ .el-table__row td:nth-child(2) .cell span {
        width: 225px;
    }

    /deep/ .table_wrap .el-table__row td:nth-child(2) .cell span {
        width: 14px;
    }

    /deep/ .plan-select .el-input__inner {
        width: 180px;
        margin-left: -13px;
        height: 32px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
    }

    /deep/ .el-date-editor .el-range__icon {
        position: relative;
        top: -2px;
        left: -3px;
    }

    /* 搜索 */
    .search-row {
        margin: 0 32px;
    }

    .search_col {
        margin-left: 8px;
    }

    /*日期控件*/
    .block {
        display: inline-block;
        margin-left: 2px;
        position: relative;
    }

    /deep/ .el-range-separator {
        position: relative;
        top: -2px;
    }

    /deep/ .el-input__inner {
        width: 260px;
        height: 32px;
        line-height: 32px;
    }

    /deep/ .el-dialog__body {
        padding: 5px 20px;

    }


    .imgPreview /deep/ .el-dialog{
        width: 35%;
    }
    .imgPreview /deep/ .el-dialog__body{
        text-align: center;
    }
    /deep/ .imgPreview .el-dialog__body img{
        max-width: 100%;
        width: auto;
        height: 550px;
    }
    @media screen and (max-width: 1440px) {
        /deep/ .imgPreview .el-dialog__body img{
            height: 450px;
        }
    }

    /deep/ .el-dialog__footer {
        padding: 20px 20px 20px;
    }

    /deep/ .el-dialog /deep/ .el-input__inner {
        width: 100%;
    }

    /deep/ .el-dialog .inline_dialog /deep/ .el-input {
        width: auto;
    }

    /deep/ .table_mater .el-button--small, .el-button--small.is-round {
        padding: 0;
    }

    /deep/ .table_mater .el-button--small, .el-button--small.is-round i {
        font-size: 16px;
    }

    /deep/ .table_mater .el-button {
        height: auto;
        border: none;
    }

    /* 物料信息弹出框 */
    .car-title {
        background: #E6F7FF;
        border: 1px solid #BAE7FF;
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 5px;
    }

    .car-title h4 {
        font-size: 14px;
        display: inline-block;
    }

    .car-title span {
        font-size: 14px;
        font-weight: normal;
        margin: 0 6px;
        cursor: pointer;
        color: #1890ff;
    }

    /deep/ .el-pagination .el-select .el-input .el-input__inner {
        width: 100px;
    }

    /deep/ .el-pagination__editor.el-input .el-input__inner {
        width: 50px;
    }

    /deep/ .mediaList_wrap .el-tabs__header {
        border-bottom: 1px solid #e6e7e9;
        height: 53px;
        line-height: 54px;
    }

    /deep/ .mediaList_wrap .baojiadan .el-tabs__header {
        border-bottom: none;
        height: 38px;
        line-height: 38px;
        background-color: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        margin: 0;
    }

    /*1920*/
    @media all and (min-width: 1900px) {
        .plan-title .handleBtn {
            position: absolute;
            top: 30px;
        }

        .plan-detail-right {
            width: 15%;
        }

        .plan-detail-left ul li {
            float: left;
            width: 400px;
            margin-bottom: 12px;
        }
    }

    /deep/ .disabled .el-upload--picture-card {
        /*display: none;*/
    }

    .radio_style {
        vertical-align: top;
    }
    /deep/ .el-upload-list__item.is-success{
        display: none;
    }
    /**/
    .img_box {
        width: 30%;
        height: 105px;
        margin: 4.2% 1.6% 0 1.6%;
        float: left;
        position: relative;
        overflow: hidden;
    }

    .upload_img_item {
        width: 100%;
        height: 100%;
    }
    .icon_success{
        display: block;
        position: absolute;
        right: -15px;
        top: -6px;
        width: 40px;
        height: 24px;
        background: #13ce66;
        text-align: center;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        -webkit-box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
        box-shadow: 0 0 1pc 1px rgba(0,0,0,.2)
    }
    .icon_success i{
        color: #fff;
        font-size: 12px;
        margin-top: 11px;
        transform: rotate(-45deg);
    }
    .icon_box{
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left: 0;
        background: rgba(0,0,0,.5);
        cursor:pointer;
    }
    .img_box_icon {
        width: 100%;
        margin-top:40%;
        text-align: center;
    }
    .img_box_icon i{
        color: #fff;
        font-size: 22px;
    }
    .img_box_icon i.icon_save {
        color: #FFD517;
    }

    /deep/ .disabled .el-upload--picture-card {
        display: none;
    }

    .radio_style {
        vertical-align: top;
    }

    /deep/ .el-table__expanded-cell[class*=cell] .el-form {
        height: 44px;
        line-height: 44px;
    }

    /deep/ .el-table__expanded-cell[class*=cell] {
        padding: 0 46px;
        background-color: #F7F7F7;;
    }

    /deep/ .el-table__row .cell span {
        overflow-x: initial;
    }
    /deep/ .table_wrap .el-table__body-wrapper{
        min-height: auto;
    }
</style>
