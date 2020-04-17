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
            <!--资源信息-->
            <div class="mediaList_wrap">
                <div class="content_top_wrap" v-loading="loading" element-loading-text="玩命加载中.."
                     element-loading-spinner="el-icon-loading">
                    <div class="plan-title">
                        <h4>
                            <img src="../../assets/images/planlogo.png" alt="">{{orderDetail.apName}}
                            <p>{{orderDetail.apQC}}
                                <i class="el-icon-edit" v-if="(role=='MD')" @click="changeCID = true"
                                   :class="{changeCID:!usableBtn}"
                                   v-qadn-mta-h5="{id: 'a006_b011_c000_d000_bt118_ck10'}"></i>
                            </p>
                        </h4>
                        <!--修改合同号对话框-->
                        <el-dialog title="修改合同编号" :visible.sync="changeCID" width="30%">
                            <el-input v-model="apQC"></el-input>
                            <span slot="footer" class="dialog-footer">
                                <el-button plain @click="cancelChangeID"
                                           v-qadn-mta-h5="{id: 'a006_b011_c005_d000_bt120_ck08'}">取 消</el-button>
                                <el-button type="primary" @click="confirmChangeID"
                                           v-qadn-mta-h5="{id: 'a006_b011_c005_d000_bt119_ck08'}">确 定</el-button>
                            </span>
                        </el-dialog>
                        <div class="handleBtn">
                            <el-button type="plain" @click="changePain()" v-if="role=='MD'"
                                       v-qadn-mta-h5="{id: 'a006_b011_c000_d000_bt110_ck04'}">换画
                            </el-button>
                            <!--<el-button type="primary" :disabled="usableBtn"-->
                            <!--v-if="role=='MD' && planPanel=='first' && orderDetail.apState != 5 && orderDetail.apState != 0" @click="changePoint" v-qadn-mta-h5="{id: 'a006_b011_c000_d000_bt109_ck10'}">换点</el-button>-->
                            <el-button type="primary"
                                       v-if="role=='MD' && planPanel=='first' && orderDetail.apState != 5 && orderDetail.apState != 0"
                                       @click="changePoint" v-qadn-mta-h5="{id: 'a006_b011_c000_d000_bt109_ck10'}">换点
                            </el-button>
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
                            <!--    <h4 v-if="showTitle" style="margin-bottom:16px;">
                                    更换点位
                                   <span>单位:面&nbsp;&nbsp; 首次投放:{{nowPointNum}}&nbsp;&nbsp; 中止投放:{{stopPointNum}} &nbsp;&nbsp;&nbsp; 新增面数:{{addNewPointNum}} &nbsp;&nbsp;&nbsp; 累计投放:{{setpointArr.length}} </span>
                                </h4>-->
                            <el-row class="search-row">
                                <el-col>
                                    <span style="font-size: 14px;color: rgba(0,0,0,0.85)">资源名称：</span>
                                    <el-input placeholder="请输入资源名称进行搜索" v-model="keyword" class="input-with-select"
                                              style="width: 260px"></el-input>
                                    <!--<el-input placeholder="请输入内容" v-model="keyword" class="input-with-select"
                                              @change="init()">
                                        <el-select v-model="selectRecName" slot="prepend" placeholder="请选择">
                                            <el-option label="资源名称" value="1"></el-option>
                                        </el-select>
                                    </el-input>-->
                                    <el-button type="primary" icon="el-icon-search" @click="search('current')"
                                               v-qadn-mta-h5="{id: showHandel ? 'a006_b011_c012_d000_bt149_ck01' : 'a006_b011_c006_d000_bt121_ck01'}"
                                               style="position: relative;top: 2px;margin-left: 3px">
                                        搜索
                                    </el-button>
                                    <el-button style="position: relative;top: 2px" @click="reset('current')" plain>重置
                                    </el-button>
                                    <!--<el-button type="primary" @click="showAddPointDialog" v-show="showHandel" v-qadn-mta-h5="{id: 'a006_b011_c012_d000_bt150_ck04'}">添加点位</el-button>-->
                                    <el-button style="float: right;position: relative;top: 2px;margin-left: 3px" plain
                                               type="default" @click="getPointRecord">更改记录
                                    </el-button>
                                    <el-button plain type="default" icon="el-icon-download"
                                               @click="export2Excel(orderDetail.apName)" :disabled="isDown"
                                               v-qadn-mta-h5="{id: 'a006_b011_c006_d000_bt122_ck05'}"
                                               style="position: relative;top: 2px;float: right;margin-right: 3px">导出
                                    </el-button>

                                </el-col>
                            </el-row>
                            <div class="table_wrap">
                                <el-table border :data="currentPointArr" style="width: 100%"
                                          :default-sort="{prop: 'recName', order: 'descending'}"
                                          v-loading="currPointloading"
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
                                                    <span>{{ props.row.notPush || '--'}}</span>
                                                </el-form-item>
                                            </el-form>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="资源名称" min-width="16.1%" class-name="resName-wrap">
                                        <template slot-scope="scope">
                                            <div style="float:left;position: absolute;left: 0;top: 0">
                                                <!--<el-popover v-show="scope.row.isNew"-->
                                                <!--placement="top-start"-->
                                                <!--title="新增时间"-->
                                                <!--width="200"-->
                                                <!--trigger="hover"-->
                                                <!--:content="formatToTime(scope.row.lSetTime)">-->
                                                <!--<span slot="reference" style="font-size: 18px;color: red">*</span>-->
                                                <div v-if="scope.row.isNew" slot="reference" class="color-line"></div>
                                                <!--</el-popover>-->
                                                <!--<el-popover v-show="scope.row.lState==2"-->
                                                <!--placement="top-start"-->
                                                <!--title="终止时间"-->
                                                <!--width="200"-->
                                                <!--trigger="hover"-->
                                                <!--:content="formatToTime(scope.row.lSetTime)">-->
                                                <!--<span slot="reference" style="font-size: 18px;color: red">*</span>-->
                                                <div v-if="scope.row.lState==2" slot="reference" class="color-line"
                                                     style="background-color: #FF763B"></div>
                                                <!--</el-popover>-->
                                            </div>
                                            <span>{{scope.row.resName||'--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="mTitle" label="媒体名称" min-width="10.3%">
                                    </el-table-column>
                                    <el-table-column prop="asLab" label="投放面" min-width="8.8%">
                                    </el-table-column>
                                    <el-table-column prop="city" label="城市" min-width="6%" :filters="filterCityData"
                                                     :filter-method="filterCity">
                                    </el-table-column>
                                    <el-table-column prop="rName" label="区域" min-width="7.4%" :filters="filtersArea"
                                                     :filter-method="filterRName">
                                    </el-table-column>
                                    <el-table-column prop="cType" label="楼盘类型" min-width="8.8%">
                                        <template slot-scope="scope">
                                            <span>{{scope.row.cType||'--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="hNum" label="小区户数" min-width="7.3%" align="right">
                                        <template slot-scope="scope">
                                            <span>{{(scope.row.hNum)?priceToFormat(scope.row.hNum):0}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="楼盘价格" min-width="7.3%" align="right">
                                        <template slot-scope="scope">
                                            <span>&yen;{{(scope.row.hPrice)?priceFormat(scope.row.hPrice/100): 0 }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="timeRange" label="排期" min-width="14.2%"
                                                     :filters="filtersData" :filter-method="filterTimeRange">
                                        <template slot-scope="scope">
                                            <template v-if="scope.row.lState==2">
                                                <span>{{scope.row.finishTimeRange}}</span>
                                                <!--<el-tooltip placement="top">-->
                                                <!--<div slot="content">-->
                                                <!--<span>{{scope.row.timeRange}}</span>-->
                                                <!--</div>-->
                                                <!--<i class="el-icon-question"> </i>-->
                                                <!--</el-tooltip>-->
                                            </template>
                                            <span v-else>{{scope.row.timeRange}}</span>
                                        </template>
                                    </el-table-column>
                                    <!-- <el-table-column label="操作" min-width="4.3%" v-if="showHandel">
                                         <template slot-scope="scope">
                                             <span style="color:#999;cursor: pointer;" v-if="scope.row.lState==2">终止</span>
                                             <span style="color:#409EFF;cursor: pointer;" v-else @click="disContinue(scope.row)"
                                                   v-qadn-mta-h5="{id: 'a006_b011_c012_d000_bt151_ck05'}">终止</span>
                                         </template>
                                     </el-table-column>-->

                                    <div slot="empty">
                                        <no-search-result></no-search-result>
                                    </div>
                                </el-table>
                                <!--<p style="font-size: 12px;color: #666666;margin-top: 10px">提示：带*号的为新增点位</p>-->
                                <div class="table-bottom-tip">
                                    <div style="display: flex">
                                        <p><span style="background-color: #1890ff" class="color-line"></span>新增点位</p>
                                        <p><span style="background-color: #FF763B" class="color-line"></span>终止点位</p>
                                    </div>
                                    <div class="ad_pagination" v-if="total">
                                        <el-pagination
                                            background
                                            layout="total, sizes, prev, pager, next, jumper"
                                            @current-change="changePage"
                                            @size-change="sizeChange"
                                            :page-sizes="[10,20,50,100]"
                                            :current-page.sync="currPage"
                                            :page-size="pageSize"
                                            :total="total">
                                        </el-pagination>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="报价单" name="second">
                        <div>
                            <ap-quotation ref="apQuotation" @detailInfo="setInfo" :quotationData="quotation"
                                          :copydata="copyAsidArr" :isorder="true" :shopingList="[]"
                                          class="price_quo"></ap-quotation>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="物料信息" name="third" :disabled="usableBtn">
                        <material :material="materialInfo" :daomater="daoInfo" :loading="maLoading" :isOrder="true"
                                  v-if="planPanel=='third'"></material>
                    </el-tab-pane>
                    <el-tab-pane label="上刊报告" name="forth" :disabled="usableBtn||role =='OP'">
                        <div class="changepic_box" v-if="planPanel=='forth'">
                            <change-pic :type="1" :order-detail="orderDetail"></change-pic>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="下刊报告" name="fifth" :disabled="usableBtn||role =='OP'">
                        <div class="changepic_box" v-if="planPanel=='fifth'">
                            <change-pic :type="2" :order-detail="orderDetail"></change-pic>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="换画报告" name="sixth" v-if="showPain">
                        <div class="changepic_box" v-show="planPanel=='sixth'">
                            <change-pic :type="3" :firstTime="false" :from-type="fromType" :order-detail="orderDetail"></change-pic>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <!--换画弹框-->
                <div class="changepic_box FIRSTTIME" v-if="showPainModal">
                    <change-pic :firstTime="showPainModal" :type="3" :planPanel="planPanel" :from-type="fromType" :order-detail="orderDetail" @toSixthTab="toSixthTab()" @hidePainModal="hidePainModal()"></change-pic>
                </div>
                <!--添加点位对话框-->
                <el-dialog title="添加点位"
                           :visible.sync="dialogAddPoint"
                           width="82%"
                           top="6vh"
                           :close-on-press-escape="false"
                           :show-close="false">
                    <add-ads :IsAddAds="IsAddPoint" @ievent="ievent"></add-ads>
                    <span slot="footer" class="dialog-footer">
                        <el-button plain @click="cancelAddPoint" v-qadn-mta-h5="{id: 'a006_b011_c012_d009_bt154_ck08'}">取 消</el-button>
                        <el-button type="primary" @click="confirmAddPoint"
                                   v-qadn-mta-h5="{id: 'a006_b011_c012_d009_bt153_ck08'}">确 定</el-button>
                    </span>
                </el-dialog>

                <!-- 图片查看显示 -->
                <el-dialog :visible.sync="dialogVisible" class="imgPreview" top="10vh">
                    <img :src="dialogImageUrl" alt=""/>
                </el-dialog>

                <!-- 终止点位弹出框 -->
                <el-dialog
                    title="终止点位"
                    :visible.sync="isFinish">
                    <span>请选择终止时间：</span>
                    <el-date-picker v-model="finishDate" type="date" format="yyyy.MM.dd" value-format="yyyy.MM.dd"
                                    placeholder="终止日期" :picker-options="pickerOptions">
                    </el-date-picker>
                    <span slot="footer" class="dialog-footer">
                        <el-button plain @click="isFinish = false">取消</el-button>
                        <el-button type="primary" @click="conFirmStopAds">确 定</el-button>
                    </span>
                </el-dialog>

                <!--换点对话框-->
                <el-dialog title="更换点位" :visible.sync="dialogChangePoint" :close-on-press-escape="false"
                           :show-close="false" :before-close="closeDialogChangePoint" :close-on-click-modal="false">
                    <div>
                        <el-row class="search-row" style="margin: 0">
                            <el-col>
                                <span>资源名称：</span>
                                <el-input placeholder="请输入资源名称进行搜索" v-model="changeKeyword" class="input-with-select"
                                          style="width: 200px"></el-input>
                                <el-button type="primary" @click="search('change')" icon="el-icon-search"
                                           v-qadn-mta-h5="{id: showHandel ? 'a006_b011_c012_d000_bt149_ck01' : 'a006_b011_c006_d000_bt121_ck01'}"
                                           style="position: relative;top: 2px;margin-left: 3px">搜索
                                </el-button>
                                <el-button plain @click="reset('change')" style="position: relative;top: 2px">重置
                                </el-button>
                                <div style="float: right">
                                    <el-button type="primary" @click="stopPoint('stop')"
                                               v-qadn-mta-h5="{id: 'a006_b011_c012_d000_bt151_ck05'}">终止点位
                                    </el-button>
                                    <el-button type="primary" @click="showAddPointDialog"
                                               v-qadn-mta-h5="{id: 'a006_b011_c012_d000_bt150_ck04'}">新增点位
                                    </el-button>
                                </div>
                            </el-col>
                        </el-row>
                        <div class="table-top-tip">
                            <i class="el-icon-info" style="color: #1890FF;"></i>
                            <h4>
                                <span>当前点位共<em>{{pointTotal}}</em>个，</span>
                                <span>终止点位<em>{{ changePointInfo.stopPointNum }}</em>个，</span>
                                <span>新增点位<em>{{changePointInfo.addPointNum}}</em>个</span>
                            </h4>
                        </div>
                        <div>
                            <el-table border :data="changePointArr" style="width: 100%"
                                      :default-sort="{prop: 'recName', order: 'descending'}"
                                      v-loading="changePointloading"
                                      ref="multipleTable"
                                      @select="handleSelect" @select-all="handleSelectAll"
                                      element-loading-text="玩命加载中.."
                                      element-loading-spinner="el-icon-loading">
                                <el-table-column
                                    type="selection"
                                    aria-disabled="true"
                                    :selectable='selectInit'
                                    width="45">
                                </el-table-column>
                                <!--<el-table-column width="45px" >-->
                                <!--<template slot-scope="scope">-->
                                <!--<div class="roadGate">-->
                                <!--<el-checkbox v-model="scope.row.checkBox" label=""-->
                                <!--@change="handleSelectionChange(scope.row)">-->
                                <!--</el-checkbox>&lt;!&ndash;v-model="scope.row.checkBox.ABC"&ndash;&gt;-->
                                <!--</div>-->
                                <!--</template>-->
                                <!--</el-table-column>-->
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
                                                <span>{{ props.row.notPush || '--'}}</span>
                                            </el-form-item>
                                        </el-form>
                                    </template>
                                </el-table-column>
                                <el-table-column label="资源名称" min-width="16.1%" class-name="resName-wrap">
                                    <template slot-scope="scope">
                                        <div style="float:left;position: absolute;left: 0;top: 0" v-if="isHandleChange">
                                            <div v-if="scope.row.isCurrNew&&scope.row.lState!=2" slot="reference"
                                                 class="color-line"></div>
                                            <div v-if="scope.row.lState==2" slot="reference" class="color-line"
                                                 style="background-color: #FF763B"></div>
                                        </div>
                                        <span>{{scope.row.resName||'--'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="mTitle" label="媒体名称" min-width="10.3%">
                                </el-table-column>
                                <el-table-column prop="asLab" label="投放面" min-width="5.8%">
                                </el-table-column>
                                <el-table-column prop="city" label="城市" min-width="6%" :filters="filterCityData"
                                                 :filter-method="filterCity">
                                </el-table-column>
                                <el-table-column prop="rName" label="区域" min-width="7.4%" :filters="filtersArea"
                                                 :filter-method="filterRName">
                                </el-table-column>
                                <el-table-column prop="cType" label="楼盘类型" min-width="6.5%">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.cType||'--'}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="hNum" label="小区户数" min-width="6.5%" align="right">
                                    <template slot-scope="scope">
                                        <span>{{(scope.row.hNum)?priceToFormat(scope.row.hNum):0}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="楼盘价格" min-width="7.3%" align="right" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>&yen;{{(scope.row.hPrice)?priceFormat(scope.row.hPrice/100): 0 }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="timeRange" label="排期" min-width="14.2%" :filters="filtersData"
                                                 :filter-method="filterTimeRange" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span>{{scope.row.timeRange}}</span>
                                    </template>
                                </el-table-column>
                                <div slot="empty">
                                    <no-search-result></no-search-result>
                                </div>
                            </el-table>
                            <!--<p style="font-size: 12px;color: #666666;margin-top: 10px">提示：带*号的为新增点位</p>-->
                            <div class="table-bottom-tip">
                                <div style="display: flex" v-if="isHandleChange">
                                    <p><span style="background-color: #1890ff" class="color-line"></span>新增点位</p>
                                    <p><span style="background-color: #FF763B" class="color-line"></span>终止点位</p>
                                </div>
                                <div class="ad_pagination" v-if="pointTotal">
                                    <el-pagination
                                        background
                                        layout="total, sizes, prev, pager, next, jumper"
                                        @current-change="pointChangePage"
                                        @size-change="pointSizeChange"
                                        :page-sizes="[10,20,50,100]"
                                        :current-page.sync="pointCurrPage"
                                        :page-size="pointPageSize"
                                        :total="pointTotal">
                                    </el-pagination>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button v-if="isHandleChange" plain @click="doneChangePoint">完 成</el-button>
                        <el-button v-else plain @click="closeDialogChangePoint">取 消</el-button>

                    </div>
                </el-dialog>
                <!--点位更改记录对话框-->
                <el-dialog
                    title="点位更改记录"
                    :visible.sync="dialogChangePointRecord"
                    width="60%"
                >
                    <div class="record-table-out-wrap">
                        <div class="table-top-tip">
                            <i class="el-icon-info" style="color: #1890FF;"></i>
                            <h4>
                                <span>全部点位共<em>{{ recordList.info.allPoint}}</em>个，</span>
                                <span>已终止点位<em>{{ recordList.info.stopPoint}}</em>个，</span>
                                <span>新增点位<em>{{recordList.info.newPoint}}</em>个，</span>
                                <span>当前正常投放点位<em>{{recordList.info.normalPoint}}</em>个</span>
                            </h4>
                        </div>
                        <div class="record-table-wrap">
                            <div v-if="recordList.table.length>0" class="record"
                                 v-for="(item,index) in recordList.table" :key="index">
                                <div class="line"></div>
                                <div class="content">
                                    <h6>{{item.updateTime}}<span>操作人:{{item.realName}}</span></h6>
                                    <el-table
                                        v-if="item.adsInfo"
                                        :data="item.adsInfo"
                                        border
                                        style="width: 100%">
                                        <el-table-column
                                            prop="type"
                                            label="变更类型"
                                            min-width="6%">
                                            <template slot-scope="scope">
                                                {{scope.row.type==1?'新增点位':'终止点位'}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            prop="resName"
                                            label="资源名称"
                                            min-width="15%">
                                        </el-table-column>
                                        <el-table-column
                                            prop="mTitle"
                                            label="媒体名称"
                                            min-width="6%">
                                        </el-table-column>
                                        <el-table-column
                                            prop="asLab"
                                            label="投放面"
                                            min-width="5%">
                                        </el-table-column>
                                        <el-table-column
                                            prop="city"
                                            label="城市"
                                            min-width="6%">
                                        </el-table-column>
                                        <el-table-column
                                            prop="district"
                                            label="区域"
                                            min-width="6%">
                                        </el-table-column>
                                    </el-table>
                                    <div class="price-wrap">
                                        <p>
                                            原订单金额：<span>&yen;{{item.previousApTotal?priceFormat(item.previousApTotal / 100) : 0}}</span>
                                        </p>
                                        <p>
                                            变更后订单金额：<span>&yen;{{item.currentApTotal?priceFormat(item.currentApTotal / 100) : 0}}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <no-search-result v-if="recordList.table.length==0"
                                              style="width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center;"></no-search-result>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogChangePointRecord = false">关 闭</el-button>
  </span>
                </el-dialog>
                <!--修改订单金额-->
                <el-dialog
                    title="修改订单金额"
                    width="768px"
                    top="20vh"
                    custom-class="price-dialog"
                    :visible.sync="changePriceModal"
                    :before-close="cancelChangePrice">
                    <changeOrderPrice @cancel="cancelChangePrice" @done="doneChangePrice"
                                      :changePriceData="changePriceData"></changeOrderPrice>
                </el-dialog>
            </div>
            <!-- 返回框 -->
            <div class="content_bottom_btn">
                <el-button plain type="default" @click="goBack" v-qadn-mta-h5="{id: 'a006_b011_c000_d000_bt111_ck03'}">
                    返回
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {Message, MessageBox} from 'element-ui';
    import {api} from "../../api/api.js";
    // 价格格式化
    import commaFormat from "../../commonFun/commaFormat.js";
    // 筛选过滤
    import filterFormat from "../../commonFun/filterTableData.js";
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import sessFun from '../../commonFun/sessFun.js';
    // 报价单
    import apQuotation from './components/apQuotation.vue'
    import material from "./components/materialInfo.vue";
    import detail from "./components/detailInfo.vue";
    import addAds from "./components/addAds"
    import noSearchResult from "./components/noSearchResult.vue";
    import changePic from "./components/changePic.vue";
    import changeOrderPrice from "./components/changeOrderPrice.vue";

    export default {
        name: "orderDetail",
        components: {
            apQuotation,
            material,
            detail,
            addAds,
            changePic,
            noSearchResult,
            changeOrderPrice
        },
        data() {
            return {
                // session信息
                sessionData: {},
                isDown: false,
                //选点排期列表分页
                total: 1,
                currPage: 1,
                pageSize: 10,
                //更换点位分页
                pointTotal: 1,
                pointCurrPage: 1,
                pointPageSize: 10,
                //加载中
                loading: true,
                maLoading: true,
                // 判断
                role: "",
                // 订单详情头部
                orderDetail: {
                    AdDoor: {},
                    barrier: {},
                },
                //修改合同号
                changeCID: false,
                planPanel: "first",
                // 选点排期
                setpointArr: [],
                tempSetPointArr:[],
                changePointArr: [],//更换点位列表
                changePointloading: true,
                currentPointArr: [],//选点排期列表
                exportArr:[],
                currPointloading: true,
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
                materialInfo: [],
                // 道闸物料信息
                daoInfo: [],
                // 默认合同编号(如果订单详情没有合同编号)
                apQC: "",
                // 图片显示放大按钮控件
                isShow: null,
                isShow2: null,
                // 终止点位时间弹出框
                isFinish: false,
                finishDate: '',
                nowRow: {},
                dateRange: {
                    beginDate: '',
                    endDate: ''
                },
                pickerOptions: {
                    disabledDate: (time) => {
                        let beginDateVal = new Date(this.dateRange.beginDate).getTime();
                        let endDateVal = new Date(this.dateRange.endDate).getTime() - 60 * 60 * 24 * 1000;
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
                pdidList: [],
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
                //选点排期标题
                showTitle: false,
                //选点排期按钮
                showBtn: true,
                //更换点位对话框
                dialogChangePoint: false,
                //更换点位对话框搜索
                changeKeyword: '',
                //更换点位对话框数据
                changePointInfo: {
                    allPoint: 0,
                    stopPointlist: [],
                    stopPointNum: 0,
                    addPointlist: [],
                    addPointNum: 0,
                },

                //更换点位取消终止按钮
                cancelbtnShow: false,
                //选点排期操作
                showHandel: false,
                UploadTime: 0,
                // 导出订单图片包
                downLoading: false,
                //显示预览图蒙版
                showPreImg: null,
                // 换画
                showPain: false,
                fromType: false,
                //第一次增加换画
                showPainModal:false,
                // 换画列表
                painlist: [],
                //点位更改记录
                dialogChangePointRecord: false,
                recordList: {
                    info: {
                        allPoint: 0,
                        stopPoint: 0,
                        newPoint: 0,
                        normalPoint: 0,
                    },
                    table: []
                },
                //修改订单金额数据
                changePriceModal: false,
                changePriceInfo: '',
                changePriceData: {
                    AdDoorAdPrice: 0,
                    AdDoorMakePrice: 0,
                    BreakAdPrice: 0,
                    BreakMakePrice: 0,
                    orderOldPrice: 0,
                    orderCompanyList: [],
                    priceCurrCompany: 0,
                    handleTime: '',
                },
                isHandleChange: false,
                handleTime: '',//换点操作和修改订单的时间戳
            };
        },
        created() {
            if (this.isChangePoint()) {
                this.changePoint();
            } else {
                this.getSetPoint();
            }
            // 根据角色判断是否有修改合同编号的权限
            this.getRole();
            // 获取订单详情的上面公司的信息
            this.getInitData();
            // 选点排期
            this.getMaterInfo();

            if (this.role == 'MD' || this.role == 'BD') {
                // 获取换画列表
                this.getPainlist();
            }
            this.getOrderPriceDetail()
        },
        methods: {
            //初始化各项数据
            initListData() {
                this.currPage = 1
                this.pageSize = 10
                this.pointCurrPage = 1
                this.pointPageSize = 10
                this.keyword = ''
                this.changeKeyword = ''
                this.changePointInfo = {
                    allPoint: 0,
                    stopPointlist: [],
                    stopPointNum: 0,
                    addPointlist: [],
                    addPointNum: 0,
                }
            },
            //获取订单金额详情
            getOrderPriceDetail() {
                api.getApi(this.apiVar.Advertisement + "/GetAPD", {apid: sessionStorage.getItem("order_apid")})
                    .then(res => {
                        // console.log('test--', res.data);
                        if (!res.data.SysCode) {
                            sessionStorage.setItem('priceData', JSON.stringify(res.data))
                            let priceData = res.data
                            console.log('订单金额', priceData);
                            let obj = {
                                AdDoorAdPrice: 0,
                                AdDoorMakePrice: 0,
                                BreakAdPrice: 0,
                                BreakMakePrice: 0,
                                orderOldPrice: 0,
                                orderCompanyList: [],
                                priceCurrCompany: 0,
                                handleTime: this.handleTime,
                                apID: sessionStorage.getItem("order_apid"),
                                opType: 1
                            }
                            for (let item of priceData) {
                                let isHave = obj.orderCompanyList.some(key => {
                                    if (item.asrID == key.asrID && item.rID == key.rID) {
                                        //obj.orderCompanyList里是否已有相同的公司和城市
                                        return true
                                    }
                                })
                                if (isHave) {
                                    for (let data of obj.orderCompanyList) {
                                        if (item.asrID == data.asrID && item.rID == data.rID) {
                                            let totalPrice = (data.pdAdFee + data.pdAdMake + item.pdAdFee + item.pdAdMake) / 100
                                            if (data.pdType == 1) {
                                                data.BreakAdPrice = data.pdAdFee / 100;
                                                data.BreakMakePrice = data.pdAdMake / 100;
                                                data.AdDoorAdPrice = item.pdAdFee / 100;
                                                data.AdDoorMakePrice = item.pdAdMake / 100;
                                            } else {
                                                data.BreakAdPrice = item.pdAdFee / 100;
                                                data.BreakMakePrice = item.pdAdMake / 100;
                                                data.AdDoorAdPrice = data.pdAdFee / 100;
                                                data.AdDoorMakePrice = data.pdAdMake / 100;
                                            }
                                            data.orderOldPrice = this.priceFormat(totalPrice)
                                        }
                                    }
                                } else {
                                    let a = {
                                        ...item,
                                        company: item.asName,
                                    }
                                    obj.orderCompanyList.push(a)
                                }

                            }
                            let result = 0
                            for (let data of obj.orderCompanyList) {
                                result += data.AdDoorAdPrice + data.AdDoorMakePrice + data.BreakAdPrice + data.BreakMakePrice
                            }
                            console.log(result);
                            obj.orderOldPrice = this.priceFormat(result)
                            obj.AdDoorAdPrice = obj.orderCompanyList[obj.priceCurrCompany].AdDoorAdPrice
                            obj.AdDoorMakePrice = obj.orderCompanyList[obj.priceCurrCompany].AdDoorMakePrice
                            obj.BreakAdPrice = obj.orderCompanyList[obj.priceCurrCompany].BreakAdPrice
                            obj.BreakMakePrice = obj.orderCompanyList[obj.priceCurrCompany].BreakMakePrice

                            console.log(obj);
                            this.changePriceData = obj
                        } else if (res.data.SysCode == 100302) {
                            this.loginTimeout();
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
            },
            //更换点位对话框关闭
            closeDialogChangePoint() {
                //重置页数页码
                this.currPage = 1;
                this.pageSize = 10;
                this.dialogChangePoint = false
                this.getSetPoint()
                /*   MessageBox.confirm(
                       '确定后，设置的换点将被全部清除',
                       "是否确定取消更换点位",
                       {
                           dangerouslyUseHTMLString: true,
                           confirmButtonText: "确定",
                           cancelButtonText: "取消",
                           type: "warning"
                       }
                   ).then(() => {
                       this.initListData()
                       this.dialogChangePoint = false
                       this.getSetPoint()
                   })
                       .catch(() => {

                       });*/
            },
            //更换点位对话框-完成
            doneChangePoint() {
                this.closeDialogChangePoint()
                MessageBox.confirm(
                    "已完成更换点位操作，是否修改订单金额？",
                    "提示",
                    {
                        confirmButtonText: "修改",
                        cancelButtonText: "不修改",
                        dangerouslyUseHTMLString: true,
                        type: "success",
                        closeOnClickModal: false,
                    }
                ).then(() => {
                    this.changePriceModal = true
                    this.getOrderPriceDetail()

                })
                    .catch(() => {
                        // Message.info("已取消操作");
                    });
                // this.dialogChangePoint = false
            },
            //终止点位操作
            stopPoint() {
                if (this.changePointInfo.stopPointlist.length > 0) {
                    MessageBox.confirm(
                        '是否确定终止选中的点位？',
                        "提示",
                        {
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }
                    ).then(() => {
                        console.log(this.changePointInfo);
                        let orderNewAdsInfos = []
                        let orderStoppedAdsInfos = []
                        if (this.changePointInfo.stopPointlist.length > 0) {
                            for (let data of this.changePointInfo.stopPointlist) {
                                // console.log(data);
                                orderStoppedAdsInfos.push(data)
                            }
                        }
                        let info = {
                            apID: this.orderDetail.apID,
                            mark: this.handleTime,
                            orderNewAdsInfos: orderNewAdsInfos ? orderNewAdsInfos : [],
                            orderStoppedAdsInfos: orderStoppedAdsInfos ? orderStoppedAdsInfos : []
                        }
                        console.log(this.orderDetail);
                        // console.log('更换点位数据', info);
                        api.postApi_json(this.apiVar.Advertisement + '/UpdateOrder', JSON.stringify(info)).then(res => {
                            console.log(res.data)
                            if (res.data.SysCode == 200200) {
                                // this.dialogChangePoint = false
                                Message.success(res.data.MSG)
                                this.changePointInfo.stopPointNum = this.changePointInfo.stopPointlist.length
                                for (let data of this.changePointInfo.stopPointlist) {
                                    for (let item of this.setpointArr) {
                                        if (data.asID == item.asID && data.timeRange == item.timeRange) {
                                            item.lState = 2
                                        }
                                    }
                                }
                                this.changePointPageFn()
                                // this.getSetPoint('change')
                                this.changePointInfo.stopPointlist = []
                                this.changePointInfo.addPointlist = []
                                this.isHandleChange = true
                            } else {
                                Message.warning(res.data.MSG)
                                this.dialogChangePoint = false
                            }
                        })
                        // this.dialogChangePoint = false
                    })
                        .catch(() => {
                            Message.info("已取消操作");
                        });
                } else {
                    Message.warning('请先勾选点位')
                }
            },
            // 改变页数
            sizeChange(pageVal) {
                this.currPointloading = true;
                this.currPage = 1;
                this.pageSize = pageVal;
                this.getSetPoint();
            },
            // 点击页数
            changePage(page) {
                this.currPointloading = true;
                this.currPage = page;
                this.getSetPoint();
            },
            // 更换点位改变页数
            pointSizeChange(pageVal) {
                this.changePointloading = true;
                this.pointCurrPage = 1;
                this.pointPageSize = pageVal;
                // this.getSetPoint('change')
                this.changePointPageFn()
            },
            // 点击页数
            pointChangePage(page) {
                this.changePointloading = true;
                this.pointCurrPage = page;
                // this.getSetPoint('change')

                this.changePointPageFn()
            },
            setInfo(data) {
                console.log('defail------data', data);
                this.pdidList = data;
            },
            // 导出excel
            export2Excel(name) {
                this.isDown = true;
                let resultArr = [];
                for (let data of this.exportArr) {
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
                        hPrice: data.hPrice / 100,
                        hNum: data.hNum == '0' ? '&' : data.hNum,
                        fNum: data.fNum,
                        chDay: data.chDay,
                        adSize: data.mVehicle == "广告门" ? data.adSize : data.picSize,
                        adViewSize: data.mVehicle == "广告门" ? data.adViewSize : data.lightBoxSize,
                        notPush: data.notPush,
                        mRemark: data.mRemark,
                        resAddress: data.resAddress,
                    };
                    resultArr.push(obj);
                }

                require.ensure([], () => {
                    const {export_json_to_excel} = require('../../vendorExcel/Export2Excel');
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
            isChangePoint() {
                let isChange = sessionStorage.getItem('change_point');
                if (isChange == 'yes') {
                    return true;
                }
                return false;
            },
            // 获取角色
            getRole() {
                this.sessionData = sessFun.getSess();
                this.role = this.sessionData.uType;
            },
            // tab点击
            handleClick() {
                this.allPic = '';
                this.allhouse = '';
                this.citySelect = [];
                if (this.planPanel == "first") {
                    this.getSetPoint()
                    MtaH5.clickStat('a006_b011_c000_d000_bt112_ck09')
                } else if (this.planPanel == "second") {
                    this.$refs.apQuotation.judgeIsDetail()
                    MtaH5.clickStat('a006_b011_c000_d000_bt113_ck09')
                } else if (this.planPanel == "third") {
                    // this.getMaterInfo();
                    MtaH5.clickStat('a006_b011_c000_d000_bt114_ck09')
                } else if (this.planPanel == "forth") {
                    MtaH5.clickStat('a006_b011_c000_d000_bt115_ck09')
                } else if (this.planPanel == "fifth") {
                    MtaH5.clickStat('a006_b011_c000_d000_bt116_ck09')
                } else if (this.planPanel == "sixth") {
                    MtaH5.clickStat('a006_b011_c000_d000_bt117_ck09')
                }

            },
            //返回列表
            goBack() {
                // let isChange = sessionStorage.getItem('change_point');
                // if(isChange =='yes'){
                //     sessionStorage.setItem('change_point', 'no');
                //     // location.reload();
                //     this.usableBtn = false;
                //     $(window).scrollTop(0);
                //     this.showTitle = false;
                //     this.showBtn = true;
                //     this.showHandel = false;
                // }else{
                this.$router.push("./orderList");
                // }
            },
            // 获取订单详情的上面公司的信息
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
                api.getApi(this.apiVar.Advertisement + "/GetFanganInfo", info)
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
                                pdTotal: this.priceFormat((info.apTotal - info.adOtherFee - info.adSendFee) / 100),
                                pdSendFee: this.priceFormat(info.adSendFee / 100),
                                pdOtherFee: this.priceFormat(info.adOtherFee / 100),
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
                            };
                            // this.orderDetail = info;
                            console.log('orderDetail', this.orderDetail)
                            this.apQC = this.orderDetail.apQC ? this.orderDetail.apQC : this.getContractNo(this.orderDetail.rID);
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
            },
            // 获取物料
            getMaterInfo(string) {
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
                api.getApi(this.apiVar.Advertisement + "/GetAdLaunch", info)
                    .then(res => {
                        console.log(res.data);
                        if (!res.data.SysCode) {
                            let initData = res.data;
                            let result = initData.adSpaceInfo;
                            // this.addNewAdsNum = res.data.isNewCount
                            for (let data of result) {
                                let time = this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
                                data.timeRange = time;
                                let finishTimeRange = '';
                                if (data.lState == 2) {
                                    finishTimeRange = this.formatTime(data.lStar) + "-" + this.formatTime(data.lSetTime);
                                }
                                data.finishTimeRange = finishTimeRange;
                            }
                            // 选点排期
                            // this.copyAsidArr = JSON.parse(JSON.stringify(result));
                            this.exportArr = result;
                            // // 城市筛选过滤
                            // this.filterCityData = filterFormat(result, "city");
                            // console.log('城市filter', this.filterCityData)
                            // this.filtersArea = filterFormat(result, "rName");
                            // this.filtersData = filterFormat(result, "timeRange");

                            // 广告门物料信息
                            let mInfo = initData.gateMaterialInfo;
                            let materialRes = [];
                            for (let data of mInfo) {
                                let str = data.gateMaterialSize.split('-');
                                let obj = {
                                    adSize: str[0],
                                    adViewSize: str[1],
                                    pointNum: data.gateMaterialCount,
                                    resolution: "150dpi",
                                    colorMode: "CMYK",
                                    photoFormat: "JPG/TIF/AI/PSD/CDR",
                                };
                                materialRes.push(obj);
                            }
                            this.materialInfo = materialRes;

                            // 道闸物料信息
                            let InfoTest = initData.roadGateMaterialInfo;
                            let daoRes = [];
                            for (let data of InfoTest) {
                                let str = data.roadGateMaterialSize.split('-');
                                let obj = {
                                    adSize: str[0],
                                    adViewSize: str[1],
                                    pointNum: data.roadGateMaterialCount,
                                    resolution: "150dpi",
                                    colorMode: "CMYK",
                                    photoFormat: "JPG/TIF/AI/PSD/CDR",
                                };
                                daoRes.push(obj);
                            }
                            this.daoInfo = daoRes;

                            this.loading = false;
                            this.maLoading = false;
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
            //获取选点排期
            getSetPoint(type) {
                let loginData = this.sessionData;

                let apid = sessionStorage.getItem("order_apid");
                let info = {
                    uid: loginData.uID,
                    apID: apid,
                    token: loginData.token,
                    pageNum: this.currPage,
                    pageSize: this.pageSize,
                };
                if (type) {
                    if (type == 'change') {
                        info.resName == this.changeKeyword
                        info.pageNum = this.pointCurrPage
                        info.pageSize = this.pointPageSize
                        info.lState = 1
                    } else {
                        info.resName = this.keyword

                    }
                }
                api.getApi(this.apiVar.Advertisement + "/GetAdLaunchList", info)
                    .then(res => {
                        console.log(res.data);
                        if (res.data.SysCode == 200200) {
                            let initData = res.data.data;
                            let result = initData.list;
                            this.total = initData.total
                            this.pointTotal = initData.total
                            this.changePointInfo.allPoint = initData.total
                            // this.addNewAdsNum = res.data.isNewCount
                            for (let data of result) {
                                let time = this.formatTime(data.lStar) + "-" + this.formatTime(data.lEnd);
                                data.timeRange = time;
                                let finishTimeRange = '';
                                if (data.lState == 2) {
                                    finishTimeRange = this.formatTime(data.lStar) + "-" + this.formatTime(data.lSetTime);
                                }
                                data.finishTimeRange = finishTimeRange;
                            }
                            // 选点排期
                            this.copyAsidArr = JSON.parse(JSON.stringify(result));

                            if (type && type == 'change') {
                                this.setpointArr = result;
                                this.tempSetPointArr = result
                                this.changePointArr = result;
                                //本次是否有新增
                                for (let data of this.changePointInfo.addPointlist) {
                                    for (let item of  this.setpointArr) {
                                        if (data.asID == item.asID && data.timeRange == item.timeRange) {
                                            item.isCurrNew = 1
                                        }
                                    }
                                }
                                this.changePointPageFn()

                                // this.changePointPageFn()

                            } else {
                                this.currentPointArr = result;
                            }

                            // 城市筛选过滤点位更改记录
                            this.filterCityData = filterFormat(result, "city");
                            // console.log('城市filter', this.filterCityData)
                            this.filtersArea = filterFormat(result, "rName");
                            this.filtersData = filterFormat(result, "timeRange");
                            this.changePointloading = false;
                            this.currPointloading = false;
                            this.loading = false;
                            this.maLoading = false;
                            this.changePointloading = false


                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
                    .catch(res => {
                        this.loading = false;
                        this.maLoading = false;
                        this.changePointloading = false;
                        this.currPointloading = false;
                        console.log(res);
                    });
            },
            // 选择一条
            handleSelect(selection, row) {
                // console.log(selection, row, 'selection ---row ');
                // 选中
                if (this.isHaveFun(selection, row)) {
                    for (let data of selection) {
                        if (!this.isHaveFun(this.changePointInfo.stopPointlist, data)) {
                            this.changePointInfo.stopPointlist.push(data);
                        }

                    }
                } else {
                    // 取消选中
                    if (this.isHaveFun(this.changePointInfo.stopPointlist, row)) {
                        this.changePointInfo.stopPointlist = this.changePointInfo.stopPointlist.filter((item) => {
                            if (item.lID == row.lID) {
                                return false;
                            }
                            return true;
                        });

                    }
                }
                console.log(this.changePointInfo.stopPointlist, 'one--shoplist');
            },
            //全选
            handleSelectAll(selection) {
                // console.log(selection);

                if (selection.length) {
                    for (let data of selection) {
                        if (!this.isHaveFun(this.changePointInfo.stopPointlist, data)) {
                            this.changePointInfo.stopPointlist.push(data);
                        }
                    }
                } else {
                    for (let data of this.changePointArr) {
                        if (this.isHaveFun(this.changePointInfo.stopPointlist, data)) {
                            this.changePointInfo.stopPointlist = this.changePointInfo.stopPointlist.filter((item) => {
                                if (item.lID == data.lID) {
                                    return false;
                                }
                                return true;
                            });
                        }
                    }
                }
                console.log(this.changePointInfo.stopPointlist);
            },
            //以终止的不可勾选
            selectInit(item) {
                if (item.lState == 2) {
                    return false  //不可勾选
                } else {
                    return true  //可勾选
                }
            },
            selectioUpdate() {
                console.log('是否勾选', this.changePointInfo.stopPointlist);
                let timer = setTimeout(() => {
                    for (let data of this.changePointInfo.stopPointlist) {
                        for (let item of this.changePointArr) {
                            this.selectInit(item)
                            if (data.asID == item.asID && data.timeRange == item.timeRange) {
                                this.$refs.multipleTable.toggleRowSelection(item, true);
                            }
                        }
                    }
                    clearTimeout(timer)
                }, 0)

            },
            // 判断一个对象是否已经在数组中
            isHaveFun(arr, obj) {
                let res = arr.filter((item) => {
                    if (item.asID == obj.asID && item.timeRange == obj.timeRange) {
                        return true;
                    }
                    return false;
                });
                if (res.length) {
                    return true;
                }
                return false;
            },
            //更换点位列表前端分页
            changePointPageFn() {
                console.log('更换点位所有数据--', this.setpointArr);
                let total = this.setpointArr.length
                let pageNum = this.pointCurrPage
                let pageSize = this.pointPageSize
                let totalPage = 0
                if (total / pageSize > parseInt(total / pageSize)) {
                    totalPage = parseInt(total / pageSize) + 1;
                } else {
                    totalPage = parseInt(total / pageSize);
                }
                this.pointTotal = total
                var result = [];
                for (let i = 0; i < total; i += pageSize) {
                    result.push(this.setpointArr.slice(i, i + pageSize));
                }
                console.log(result);
                //当前页
                this.changePointArr = result[pageNum - 1]
                //切换页数时勾选
                this.selectioUpdate()
                this.changePointloading = false
                console.log('更换点位当前页数据--', this.changePointArr);

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
            priceToFormat(price) {
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
            // init() {
            //     if (!this.keyword) {
            //         this.changePointArr = this.setpointArr;
            //     }
            // },
            // 搜索
            search(type) {
                // 账号，姓名
                // console.log(this.selectRecName);
                console.log(this.keyword, this.changeKeyword, type);
                // let keyword = this.keyword;
                if (type == 'change') {
                    //更换点位
                    let t = [...this.setpointArr];
                    let arr = [];
                    if (this.changeKeyword !== '') {
                        for (let data of t) {
                            if (data.resName.indexOf(this.changeKeyword) != -1) {
                                console.log(data.resName, data.resName.indexOf(this.keyword.trim()));
                                arr.push(data)
                            }
                        }
                    }

                    this.setpointArr = arr
                    console.log(this.setpointArr);
                    this.changePointPageFn()
                    // this.getSetPoint(type)
                } else {
                    this.getSetPoint('type')
                }
            },
            //重置
            reset(type) {
                if (type == 'change') {
                    this.changeKeyword = ''
                    this.setpointArr = this.tempSetPointArr
                    // this.getSetPoint(type)
                    this.changePointPageFn()
                } else {
                    this.keyword = ''
                    this.getSetPoint()
                }

            },
            //查询点位更新记录
            getPointRecord() {
                this.dialogChangePointRecord = true
                api.getApi(this.apiVar.Advertisement + "/GetOrderHistory?apID=" + this.orderDetail.apID).then(res => {
                    console.log(res.data)
                    if (res.data.SysCode == 200200) {
                        this.recordList.info = {
                            allPoint: res.data.data.totalAdsCount,
                            stopPoint: res.data.data.stoppedAdsCount,
                            newPoint: res.data.data.newAdsCount,
                            normalPoint: res.data.data.usingAdsCount
                        }
                        let arr = []
                        if (res.data.data.orderHistory.length) {
                            for (let data of res.data.data.orderHistory) {
                                let obj = {
                                    ...data,
                                    adsInfo: JSON.parse(data.adsInfo)
                                }
                                arr.push(obj)
                            }
                        }
                        this.recordList.table = arr

                    } else {
                        Message.warning(res.data.MSG)
                    }
                })
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
                console.log(value);
                return row.timeRange === value;
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
                api.postApi(this.apiVar.Advertisement + "/SetAdPlan", info)
                    .then(res => {
                        console.log(res);
                        if (res.data.SysCode == 300200) {
                            this.$set(this.orderDetail, "apQC", qc);
                            Message.success(res.data.MSG);
                        } else {
                            Message.warning(res.data.MSG);
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
                this.changeCID = false;
            },
            // 终止点位
            conFirmStopAds() {
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
                    api.postApi(this.apiVar.Advertisement + "/StopADS", info)
                        .then(res => {
                            console.log(res.data);
                            if (!res.data.SysCode) {
                                let resdata = res.data;
                                this.$set(this.nowRow, "lState", resdata.lState);
                                this.$set(this.nowRow, "lSetTime", resdata.lSetTime);
                                let time = this.formatTime(resdata.lStar) + "-" + this.formatTime(resdata.lSetTime);
                                this.$set(this.nowRow, 'finishTimeRange', time);
                                this.isFinish = false;
                                Message.success("终止成功");
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

            //恢复/取消终止操作
            restoreState(row) {
                for (let data of this.setpointArr) {
                    if (data.lID == row.lID) {
                        this.$set(row, "lState", 1);
                        this.changePointInfo.stopPointlist.splice(data, 1)
                    }
                }

            },
            //点击换点
            changePoint() {
                // Message.warning("该功能尚未完善");
                sessionStorage.setItem('change_point', 'yes');
                // this.usableBtn = true;
                // $(window).scrollTop(288);
                // this.showTitle = true;
                // this.showBtn = false;
                // this.showHandel = true;
                this.initListData()
                this.handleTime = new Date().getTime()
                this.dialogChangePoint = true
                this.changePointInfo.stopPointlist = []
                this.changePointInfo.addPointlist = []
                this.isHandleChange = false
                this.getSetPoint('change')
            },
            //显示添加点位的模态框
            showAddPointDialog() {
                let pdidArr = this.pdidList
                console.log('pdidarr---', pdidArr);
                this.dialogAddPoint = true
                this.IsAddPoint = !this.IsAddPoint
                // if(this.IsAddPoint){
                //     this.IsAddPoint = false
                // }
            },
            //获取子组件选择的点位数据
            ievent(...data) {
                console.log('allData:', data);// data为包含传过来所有数据的数组，第一个元素是对象，第二个元素是字符串
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
                console.log('pdidarr---', this.addAdsArr);
                console.log('shopingArr', this.pdidList)
                let userData = this.sessionData;
                let arr = []
                for (let key of this.addAdsArr) {
                    for (let pKey of this.pdidList) {
                        if (key.city == pKey.city && key.asrID == pKey.asrID) {
                            let adsInfo = {
                                resName: key.resName,
                                city: key.city,
                                tradingArea: key.tradingArea,
                                asID: Number(key.asID),
                                pdID: pKey.pdID,
                                pbStar: (key.schedules.split('-')[0]).split('/').join('-'),    // 开始投放时间
                                pbEnd: (key.schedules.split('-')[1]).split('/').join('-'),       // 开始投放时间添加点位对话框确认按钮
                                uID: this.sessionData.uID,
                                mTitle: key.mediaName,
                                asLab: key.A_B,
                                rName: key.origin,
                                cType: key.buildType,
                                timeRange: key.schedules,
                                hNum: key.houseNum,
                                hPrice: key.buildPrice * 100,
                                fNum: key.buildNum,
                                chDay: key.liveYear,
                                notPush: key.adLimit,
                                isNew: 1,
                            }

                            if (pKey.pdType == 0 && key.mVehicle === '广告门') {
                                arr.push(adsInfo)
                                break
                            } else if (pKey.pdType == 1 && key.mVehicle === '道闸') {
                                arr.push(adsInfo)
                                break
                            }
                        }
                    }
                }
                let postData = {
                    apID: this.orderDetail.apID,
                    mark: this.handleTime,
                    orderNewAdsInfos: arr,
                    orderStoppedAdsInfos: []
                }

                console.log('添加点位对话框确认按钮', this.changePointInfo.addPointlist)
                api.postApi_json(this.apiVar.Advertisement + '/UpdateOrder',
                    JSON.stringify(postData)).then(res => {
                    console.log('添加选点返回信息', res)
                    addload.close();
                    if (res.data.SysCode === 300500) {
                        Message.warning(res.data.MSG)
                    } else {
                        if (res.data.SysCode != 200200) {
                            this.$message({
                                message: '新增点位失败',
                                type: 'warning'
                            })
                        } else {
                            Message.success("添加点位成功")
                            for (let data of arr) {
                                this.changePointInfo.addPointlist.push(data)
                                this.setpointArr.unshift(data)
                            }
                            this.dialogAddPoint = false
                            this.IsAddPoint = true
                            this.isHandleChange = true
                            this.changePointInfo.addPointNum = this.changePointInfo.addPointlist.length
                            // this.getSetPoint('change')

                            for (let data of this.changePointInfo.addPointlist) {
                                for (let item of  this.setpointArr) {
                                    if (data.asID == item.asID && data.timeRange == item.timeRange) {
                                        item.isCurrNew = 1
                                    }
                                }
                            }
                            this.changePointPageFn()

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
            // 换画
            // 获取换画列表
            getPainlist() {
                let info = {
                    apId: sessionStorage.getItem("order_apid")
                };
                api.getApi(this.apiVar.replace + '/report/list', info).then(res => {
                    console.log('换画列表',res.data);
                    if (res.data.SysCode == 200200) {
                        this.painlist = res.data.data;
                        if (this.painlist.length) {
                            this.showPain = true;
                        }
                    } else {
                        sessFun.messageFun('warning', res.data.msg);
                    }
                });
            },
            //跳到换画tab
            toSixthTab(){
                this.planPanel = 'sixth';
            },
            //隐藏
            hidePainModal(){
                this.showPainModal = false
            },
            //点击换画
            changePain() {
                if(this.painlist.length>0){
                    this.showPainModal = false
                    //跳到换画报告tab
                    this.showPain = true;
                    this.planPanel = 'sixth';
                }else{
                    this.showPain = false;
                    //第一次
                    this.showPainModal = true;
                }
                setTimeout(() => {
                    this.fromType = !this.fromType;
                }, 10);
            },
            // 新增换画报告
            /* addPainReport() {
                 let info = {
                     apId: sessionStorage.getItem("order_apid")
                 };
                 api.getApi(this.apiVar.replace + '/report/list', info).then(res => {
                     console.log(res);
                     if (res.data.SysCode == 200200) {
                         this.painlist = res.data.data;
                         let len = this.painlist.length;
                         let painInfo = {
                             apId: this.orderDetail.apID,
                             replaceRecordName: `换画${len + 1}`,
                         };
                         api.postApi_json(this.apiVar.replace + '/report/add', painInfo).then(res => {
                             if (res.data.SysCode == 200200) {
                                 sessFun.messageFun('success', '新增换画报告成功！');
                                 // this.showPain = true;
                                 // this.planPanel = 'sixth';
                                 // setTimeout(() => {
                                 //     this.fromType = !this.fromType;
                                 // }, 10);
                             } else {
                                 sessFun.messageFun('warning', res.data.msg);
                             }
                         });
                     } else {
                         sessFun.messageFun('warning', res.data.msg);
                     }
                 });
             },*/
            // 操作提示统一方法
            messageFun(mesType, mes) {
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
            //修改订单金额-取消
            cancelChangePrice() {
                this.changePriceModal = false
                this.changePriceData = {
                    AdDoorAdPrice: 0,
                    AdDoorMakePrice: 0,
                    BreakAdPrice: 0,
                    BreakMakePrice: 0,
                    orderOldPrice: 0,
                    orderCompanyList: [],
                    priceCurrCompany: 0,
                }
                Message.info("已取消操作");
            },
            //修改金额-成功
            doneChangePrice() {
                this.changePriceModal = false
                this.changePriceData = {
                    AdDoorAdPrice: 0,
                    AdDoorMakePrice: 0,
                    BreakAdPrice: 0,
                    BreakMakePrice: 0,
                    orderOldPrice: 0,
                    orderCompanyList: [],
                    priceCurrCompany: 0,
                }
                this.getInitData();
                Message.success("修改订单金额成功!");

            }
        }
        ,
    }
    ;
</script>

<style scoped>
    /*选点排期列表底部提示*/
    .table-bottom-tip {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12px;
        margin-top: 24px;
        position: relative;
        height: 48px;
    }

    .table-bottom-tip .ad_pagination {
        position: absolute;
        right: 0;
        margin-top: 0;
    }

    .table-bottom-tip p {
        margin-right: 24px;
    }

    .table-bottom-tip .color-line {
        display: inline-block;
        width: 2px;
        height: 12px;
        margin-right: 8px;
        position: relative;
        top: 2px;
    }

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
        margin: 0px 32px;
    }

    /deep/ .el-tabs__nav-scroll {
        padding-left: 28px;
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

    /*物料信息*/
    /deep/ .el-table_2_column_16 .cell {
        text-align: right;
        padding-right: 20px;
    }

    /*页码*/
    .pager {
        height: 32px;
        margin-top: 30px;
        text-align: right;
    }

    /* 换画 */
    .changepic_box {
        margin: 0px 32px 32px;
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
        margin: 0 32px 0;
    }

    /*日期控件*/
    /deep/ .el-range-separator {
        position: relative;
        top: -2px;
    }

    /deep/ .search-row .el-input__inner {
        width: 260px;
        height: 32px;
        line-height: 32px;
    }

    /deep/ .el-dialog__body {
        padding: 5px 24px 32px;

    }

    .imgPreview /deep/ .el-dialog {
        width: 35%;
    }

    .imgPreview /deep/ .el-dialog__body {
        text-align: center;
    }

    /deep/ .imgPreview .el-dialog__body img {
        max-width: 100%;
        width: auto;
        height: 550px;
    }

    @media screen and (max-width: 1440px) {
        /deep/ .imgPreview .el-dialog__body img {
            height: 450px;
        }
    }

    /deep/ .el-dialog__footer {
        padding: 0px 20px 20px;
        text-align: center;
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
        /*margin: 0;*/
    }

    /*1920*/
    @media all and (min-width: 1900px) {
        .plan-title .handleBtn {
            position: absolute;
            top: 30px;
        }
    }

    /deep/ .el-upload-list__item.is-success {
        display: none;
    }

    /deep/ .disabled .el-upload--picture-card {
        display: none;
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

    /deep/ .el-form-item__content {
        line-height: 46px;
    }

    /deep/ .table_wrap .el-table__body-wrapper {
        min-height: auto;
    }

    .box-wrap, #pane-second {
        margin-bottom: 32px;
    }

    .resName-wrap {
        position: relative;
    }

    .resName-wrap .color-line {
        float: left;
        width: 3px;
        height: 47px;
        background-color: #1890ff;

    }

    .table-top-tip {
        background: #e6f7ff;
        border: 1px solid #bae7ff;
        border-radius: 4px;
        margin: 16px 0;
        padding: 5px;
    }

    .table-top-tip /deep/ .el-icon-info {
        margin-right: 4px;
    }

    .table-top-tip h4 {
        font-size: 14px;
        display: inline-block;
    }

    .table-top-tip em {
        font-size: 14px;
        font-weight: normal;
        margin: 0 6px;
        cursor: pointer;
        color: #1890ff;
    }

    /*点位更改记录*/
    .record-table-wrap {
        padding: 16px 12px;
        border-radius: 4px;
        border: 1px solid rgba(217, 217, 217, 1);
    }

    .record {
        position: relative;
    }

    .record .line {
        width: 1px;
        height: 100%;
        background-color: #1890ff;
        position: absolute;
        left: 0;
        top: 0;
        margin-top: 14px;
    }

    .record .line::before {
        content: '';
        display: inline-block;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        border: 1px solid #1890ff;
        position: absolute;
        top: -9px;
        left: -4px;
        background-color: #fff;
    }

    .record .content {
        margin-left: 16px;
        padding-bottom: 25px;
    }

    .record .content h6 {
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 9px;
    }

    .record .content h6 span {
        margin-left: 25px;
    }

    .record .price-wrap {
        display: flex;
        color: rgba(0, 0, 0, 0.85);
        font-weight: bold;
        padding: 8px 16px;
        box-sizing: border-box;
        background: rgba(250, 250, 250, 1);
        border-radius: 4px;
        border: 1px solid rgba(232, 232, 232, 1);
        margin-top: 10px;
    }

    .record .price-wrap p {
        margin-right: 24px;
    }

    .record .price-wrap p span {
        color: #1890ff;
        font-weight: normal;
    }

    /*滚动条*/
    .record-table-wrap {
        height: 500px;
        overflow-y: auto;
        overflow-x: hidden !important;
    }

    .record-table-wrap::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background: #fafafa;
    }

    .record-table-wrap::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    }

    .record-table-wrap /deep/ .el-table__body-wrapper, .el-table__empty-block {
        min-height: 40px;
    }

</style>
