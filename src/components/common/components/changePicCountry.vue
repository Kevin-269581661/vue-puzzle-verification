<template>
  <div
    class="pic_box"
    v-loading="pageInfo.loading"
    element-loading-text="玩命加载中.."
    element-loading-spinner="el-icon-loading"
  >
    <!-- 上下刊 -->
    <template v-if="type === 0 || type === 1">
      <template>
        <el-radio-group
          v-model="publishSearchInfo.mediaType"
          size="medium"
          @change="changeMedia()"
          class="radio_style"
        >
          <el-radio-button
            v-for="item in mediaTypeList"
            :key="item.mediaTypeId"
            :label="item.mediaTypeId"
            >{{ item.mediaTypeName }}({{ item.uploadCnt }}/{{
              item.totalCnt
            }})</el-radio-button
          >
        </el-radio-group>
        <p
          style="
            font-size: 16px;
            color: red;
            display: inline-block;
            float: right;
          "
        >
          提示：上传完图片后请点击保存
        </p>
      </template>
      <el-form :inline="true" size="small">
        <el-form-item label="城市区域:">
          <el-cascader
            placeholder="请选择城市区域"
            :options="publishSearchInfo.citys"
            v-model="publishSearchInfo.citySelect"
            @change="searchImgChange()"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="资源名称:" class="tag-overflow">
          <el-select
            placeholder="请选择资源名称"
            filterable
            multiple
            collapse-tags
            v-model="publishSearchInfo.allhouse"
            @change="(arr) => changeSelect(arr, 'allhouse', 'allResource')"
          >
            <el-option label="全部" value="全部"></el-option>
            <el-option
              v-for="(item, index) of allResource"
              :key="index"
              :label="item.resName"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="监播状态:">
          <el-select
            placeholder="请选择监播状态"
            v-model="publishSearchInfo.allPic"
          >
            <el-option label="全部" value="1"></el-option>
            <el-option label="已上传" value="2"></el-option>
            <el-option label="未上传" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放状态:">
          <el-select
            placeholder="请选择投放状态"
            v-model="publishSearchInfo.lState"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option label="正常投放" value="1"></el-option>
            <el-option label="终止投放" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放排期:" class="tag-overflow">
          <el-select
            placeholder="请选择投放排期"
            multiple
            collapse-tags
            v-model="publishSearchInfo.dateRange"
            @change="(arr) => changeSelect(arr, 'dateRange', 'scheduleList')"
          >
            <el-option
              class="date_range_class"
              label="全部"
              value="全部"
            ></el-option>
            <el-option
              class="date_range_class"
              v-for="(dateRangeItem, rangeIndex) in scheduleList"
              :label="dateRangeItem.text"
              :value="dateRangeItem.value"
              :key="rangeIndex"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料备注:" class="tag-overflow">
          <el-select
            placeholder="请选择物料备注"
            multiple
            collapse-tags
            v-model="publishSearchInfo.materialRemark"
            @change="
              (arr) =>
                changeSelect(arr, 'materialRemark', 'adMaterialRemarkList')
            "
          >
            <el-option label="全部" value="全部"></el-option>
            <el-option
              v-for="(materialItem, materialIndex) in adMaterialRemarkList"
              :label="materialItem.text"
              :value="materialItem.value"
              :key="materialIndex"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="拍照状态:">
          <el-select
            placeholder="请选择拍照状态"
            v-model="publishSearchInfo.prStatus"
          >
            <el-option label="全部" value="全部"></el-option>
            <el-option label="已拍照" value="1"></el-option>
            <el-option label="未拍照" value="0"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="searchImg()">搜 索</el-button>
          <el-button type="plain" @click="resetSearch('sxk')">重 置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!-- 换画报告 -->
    <template v-else>
      <div class="list_pic" v-if="painList.length">
        <div class="pic_left">
          <el-button
            icon="el-icon-arrow-left"
            plain
            class="compare"
            @click="toLeft()"
            :disabled="activePainIndex == 0"
          ></el-button>
          <div class="pic_content">
            <span
              :class="['pain_span', activePainIndex == index ? 'active' : '']"
              v-for="(item, index) of painList"
              :key="item.id"
              @click="changePain(index)"
              >{{ item.name }}</span
            >
          </div>
          <el-button
            icon="el-icon-arrow-right"
            plain
            class="compare"
            @click="toRight()"
            :disabled="activePainIndex == painList.length - 1"
          ></el-button>
        </div>
        <div class="process">
          <el-button type="primary" @click="editReport(true)"
            >编辑报告
          </el-button>
          <span class="process_box">
            <el-progress
              :percentage="publishNumInfo.changePic.percent"
              :text-inside="true"
              :stroke-width="16"
            ></el-progress>
            {{ publishNumInfo.changePic.currNum }} /
            {{ publishNumInfo.changePic.totalNum }}
          </span>
        </div>
      </div>
      <!-- 搜索 -->
      <div class="search_pic" v-if="!firstTime">
        <el-form :inline="true" size="small">
          <el-form-item label="媒体类型:">
            <el-select
              v-model="searchInfo.mediaType"
              placeholder="请选择媒体类型"
              size="small"
            >
              <el-option
                v-for="item of searchInfo.mediaTypeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="城市区域:">
            <el-cascader
              :options="searchInfo.citys"
              v-model="searchInfo.city"
              placeholder="请选择城市区域"
              filterable
              size="small"
              @change="painCityChange()"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="资源名称:">
            <el-select
              v-model="searchInfo.resName"
              placeholder="请选择资源名称"
              size="small"
              filterable
            >
              <el-option label="全部" value="全部"></el-option>
              <el-option
                v-for="item of searchInfo.resArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="监播状态:">
            <el-select
              v-model="searchInfo.status"
              placeholder="请选择监播状态"
              size="small"
            >
              <el-option
                v-for="item of searchInfo.statusArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="拍照状态:">
            <el-select
              placeholder="请选择拍照状态"
              v-model="searchInfo.prStatus"
            >
              <el-option label="全部" value="全部"></el-option>
              <el-option label="已拍照" value="1"></el-option>
              <el-option label="未拍照" value="0"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="search()">搜 索</el-button>
            <el-button type="plain" @click="resetSearch('hh')">重 置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>

    <!-- 图片列表 -->
    <div class="imgs_box" v-if="!firstTime">
      <div class="imgs_point">
        <div
          class="point_item"
          v-for="(item, index) of imageArr || []"
          :key="index"
        >
          <div class="detail_top">
            <el-tooltip
              class="item"
              effect="dark"
              :content="
                item.city +
                '-' +
                item.rName +
                '-' +
                item.resName +
                '-' +
                item.mTitle +
                '-' +
                item.asLab
              "
              placement="bottom"
              v-if="
                (
                  item.city +
                  '-' +
                  item.rName +
                  '-' +
                  item.resName +
                  '-' +
                  item.mTitle +
                  '-' +
                  item.asLab
                ).length > 26
              "
            >
              <span>
                {{
                  wordlimit(
                    item.city +
                      "-" +
                      item.rName +
                      "-" +
                      item.resName +
                      "-" +
                      item.mTitle +
                      "-" +
                      item.asLab,
                    26
                  )
                }}
              </span>
            </el-tooltip>
            <span v-else>
              {{
                item.city +
                "-" +
                item.rName +
                "-" +
                item.resName +
                "-" +
                item.mTitle +
                "-" +
                item.asLab
              }}
            </span>
            <!-- <el-tooltip v-if="item.prStatus" class="item" effect="dark">
              <ul slot="content">
                <li style="line-height: 20px">
                  拍照人：{{ item.prRealName || "" }}
                </li>
                <li style="line-height: 20px">
                  拍照时间：{{ item.prCreateTime || "" }}
                </li>
              </ul>
              <span class="photo-record-sign">已拍照</span>
            </el-tooltip> -->
            <p class="car_header">
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.assetTag"
                placement="bottom"
                v-if="item.assetTag && item.assetTag.length > 14"
              >
                <span
                  ><i class="el-icon-date date_fa" type="text"></i
                  >{{ wordlimit(item.assetTag, 14) }}</span
                >
              </el-tooltip>
              <span v-else
                ><i class="el-icon-date date_fa" type="text"></i
                >{{ item.assetTag }}</span
              >
              <span v-if="type === 0 || type === 1"
                ><i class="el-icon-date date_fa" type="text"></i
                >{{ item.timeRange }}</span
              >
              <span v-if="type === 2"
                ><i class="el-icon-date date_fa" type="text"></i>换画日期:{{
                  item.replaceDate
                }}</span
              >
            </p>
          </div>
          <div class="detail_con">
            <div
              class="img_box"
              v-for="(img, imgIndex) of item.photoList"
              @mouseenter="showPreImg = img.pID"
              @mouseleave="showPreImg = null"
              :key="imgIndex"
            >
              <img class="upload_img_item" :src="img.thumbnailURL" />
              <label class="icon_success">
                <i class="el-icon-check"></i>
              </label>
              <div class="icon_box" v-if="showPreImg === img.pID">
                <p class="img_box_icon">
                  <i
                    class="el-icon-search"
                    @click="
                      handlePictureCardPreview(
                        img.pURL,
                        img.realName,
                        img.pUTime
                      )
                    "
                  ></i>
                  <!-- <i
                    class="el-icon-star-off"
                    v-if="!img.isCollection && sessionData.uType != 'ADN_EP'"
                    @click="saveImgFun(item, imgIndex)"
                  ></i> -->
                  <!-- <i
                    v-if="img.isCollection"
                    class="el-icon-star-on icon_save"
                    @click="cancelImgFun(item, imgIndex)"
                  ></i> -->
                  <i class="el-icon-delete" @click="deleteImg(img)"></i>
                </p>
              </div>
            </div>

            <el-upload
              class="upload_plus"
              :key="index + '-' + pageInfo.currPage + '-1'"
              @click.native="saveId(item)"
              :class="{ disabled: uploadDisabled(item.photoList || []) }"
              :action="doUpload"
              :http-request="uploadImg"
              :limit="6"
              list-type="picture-card"
              :show-file-list="true"
              :file-list="item.photoList"
              :before-upload="beforeAvatarUpload"
              :before-remove="beforeImgRemove"
              :on-preview="previewImg"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              multiple
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pager">
      <el-pagination
        v-if="pageInfo.paginationShow && !firstTime"
        background
        :current-page.sync="pageInfo.currPage"
        :page-sizes="[6, 12]"
        :page-size="pageInfo.pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="pageInfo.totalNum"
        @size-change="sizeChange"
        @current-change="changePage"
      >
      </el-pagination>
    </div>

    <div class="up-report-bottom" v-if="!firstTime">
      <el-button plain @click="downloadImg()" :loading="downLoading">
        导出图片
      </el-button>
      <el-button type="primary" @click="submitUpload()"> 保存 </el-button>
      <el-button plain @click="showH5()"> 查看H5 </el-button>
      <el-button plain @click="updateReport()" :loading="updateLoading">
        更新报告
      </el-button>
    </div>

    <!-- 换画弹出框 -->
    <el-dialog
      title="选择换画点位"
      :visible.sync="isShowPic"
      :show-close="false"
      width="1134px"
      custom-class="change_pic_class"
    >
      <el-row
        :gutter="32"
        justify="space-between"
        type="flex"
        align="center"
        class="dialog_pic"
        style="margin-bottom: 14px"
      >
        <el-col :span="8">
          <el-row type="flex" align="middle">
            <span>资源名称：</span>
            <el-select
              v-model="dialogInfo.resName"
              collapse-tags
              multiple
              filterable
              placeholder="请输入资源名称"
              size="small"
            >
              <el-option
                v-for="item in dialogInfo.resArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" align="middle">
            <span>城市区域：</span>
            <el-cascader
              v-model="dialogInfo.districtIdList"
              placeholder="请选择城市区域"
              :options="regionAreaList"
              filterable
            ></el-cascader>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" align="middle">
            <span>投放排期：</span>
            <el-select
              placeholder="请选择投放排期"
              multiple
              collapse-tags
              v-model="dialogInfo.schDateList"
              @change="
                (arr) =>
                  changeScheduleSelect(arr, 'schDateList', 'launchDateList')
              "
            >
              <el-option label="全部" value="全部"></el-option>
              <el-option
                v-for="(dateRangeItem, rangeIndex) in launchDateList"
                :label="dateRangeItem.text"
                :value="dateRangeItem.value"
                :key="rangeIndex"
              ></el-option>
            </el-select>
          </el-row>
        </el-col>
      </el-row>
      <el-row
        :gutter="32"
        justify="space-between"
        type="flex"
        align="center"
        class="dialog_pic"
      >
        <el-col :span="8">
          <el-row type="flex" align="middle">
            <span>换画状态：</span>
            <el-select
              v-model="dialogInfo.picState"
              placeholder="请选择换画状态"
              size="small"
            >
              <el-option
                v-for="(item, index) of dialogInfo.stateArr"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex" align="middle" justify="space-between">
            <div class="btn_wrapper">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchPoint()"
                >搜索</el-button
              >
              <el-button plain @click="resetPoint()" class="resetBtn"
                >重置</el-button
              >
            </div>
            <el-dropdown>
              <el-button class="batchBtn">
                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="showUpload()"
                  >换画</el-dropdown-item
                >
                <el-dropdown-item @click.native="cancelPain('all')"
                  >取消换画</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
        </el-col>
      </el-row>
      <div class="car-title">
        <i class="el-icon-info" style="color: #1890ff"></i>
        <h4>
          <span
            >全部点位共<em>{{ pointInfo.pointNum }}</em
            >个，</span
          >
          <!-- <span v-if="pointInfo.setedNum > 0"
            >已保存换画点位<em>{{ pointInfo.setedNum }}</em
            >个，</span
          > -->
          <span
            >当前选择的点位<em>{{ selectList.length || 0 }}</em
            >个</span
          >
        </h4>
      </div>

      <div class="table-wrap">
        <el-table
          :data="pointArr"
          border
          height="535"
          ref="multipleTable"
          v-loading="dialogPage.pointLoading"
          @select="handleSelect"
          @select-all="handleSelectAll"
          class="table_mater"
        >
          <el-table-column type="selection" width="41px" scope="scope">
          </el-table-column>
          <el-table-column
            prop="picUrl"
            label=""
            width="50"
            class="change-pic-icon"
          >
            <template slot-scope="scope">
              <img
                v-if="scope.row.replaceDate"
                src="../../../assets/images/changeIcon_1.png"
                alt=""
              />
              <img
                v-else
                src="../../../assets/images/changeIcon_2.png"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="resName" label="资源" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="mTitle"
            label="媒体"
            min-width="70"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="asLab" label="面" width="50">
          </el-table-column>
          <el-table-column prop="cityName" label="城市" width="90">
          </el-table-column>
          <el-table-column prop="districtName" label="区域" width="90">
          </el-table-column>
          <!-- <el-table-column
            prop="mapCenterInfo"
            label="地图中心点"
            align="center"
            width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.mapCenterInfo || "--" }}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="timeRange" label="排期" min-width="140">
          </el-table-column>
          <el-table-column prop="replaceDate" label="换画日期">
            <template slot-scope="scope">
              <span>
                {{ scope.row.replaceDate || "--" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>
                {{ scope.row.remark || "--" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <!--<i class="el-icon-picture" :style="{color:scope.row.picUrl?'#108DE7':'', margin: '0 10px'}" @click="previewImg(scope.row.picUrl)" :disabled="!scope.row.picUrl"></i>-->
              <!--<i class="el-icon-delete" :style="{'color':scope.row.picUrl?'#108DE7':''}" @click="deleteOneImg(scope.row)" :disabled="!scope.row.picUrl"></i>-->
              <span
                style="color: #1890ff; cursor: pointer"
                @click="showChangePicDetailModal(scope.row)"
                >编辑</span
              >
            </template>
          </el-table-column>

          <div slot="empty">
            <no-search-result></no-search-result>
          </div>
        </el-table>
        <div class="table_footer">
          <div class="marked_wrapper">
            <div class="marked_item">
              <img
                class="marked_img"
                src="../../../assets/images/changeIcon_1.png"
                alt=""
              />
              <span class="marked_word">已录入换画信息</span>
            </div>
            <div class="marked_item">
              <img
                class="marked_img"
                src="../../../assets/images/changeIcon_2.png"
                alt=""
              />
              <span class="marked_word">未录入换画信息</span>
            </div>
          </div>
          <div class="ad_pagination" v-if="dialogPage.totalInfoPage">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="changePainPage"
              @size-change="painSizeChange"
              :page-sizes="[10, 20, 50, 100, 500]"
              :current-page.sync="dialogPage.currInfoPage"
              :page-size="dialogPage.pageSize"
              :total="pointInfo.pointNum"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog_btn_wrapper">
        <el-button plain size="small" @click="cancel()">取消</el-button>
        <el-button type="primary" size="small" @click="saveAll()"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!--编辑换画-->
    <el-dialog
      title="编辑换画信息"
      :visible.sync="changePicDetailModal"
      custom-class="change-pic-detail-modal"
      :close-on-click-modal="false"
      :show-close="false"
      width="448px"
    >
      <div class="change-pic-detail-info">
        <div>
          <h5>
            {{ changePicDetailInfo.resName }}-{{
              changePicDetailInfo.mTitle
            }}-{{ changePicDetailInfo.asLab }}面
            <span v-if="changePicDetailInfo.replaceDate" class="a">已换画</span>
            <span v-else class="b">未换画</span>
          </h5>
          <p>地址：{{ changePicDetailInfo.resAddress }}</p>
          <p>排期：{{ changePicDetailInfo.timeRange }}</p>
        </div>
        <div class="divide"></div>
        <el-row>
          <el-col class="flex_box">
            <span> <b style="color: #ff0000">*</b> 换画日期： </span>
            <el-date-picker
              size="small"
              v-model="oneEditInfo.date"
              value-format="yyyy/MM/dd"
              format="yyyy/MM/dd"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-col>
          <el-col class="flex_box imgpain_box">
            <span>换画素材：</span>
            <el-upload
              :headers="{
                uid: sessionData.uID,
                token: sessionData.token,
              }"
              :action="doUpload"
              list-type="picture-card"
              :file-list="imgUrl"
              :before-upload="beforeUpload"
              :on-success="onsucess"
              :on-preview="previewImg"
              :on-remove="delectImg"
              :limit="1"
            >
              <span class="upload_border">
                <i class="el-icon-plus"></i>
                <span>上传图片</span>
              </span>
            </el-upload>
          </el-col>
          <el-col class="flex_box">
            <span>备注信息：</span>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入备注信息"
              v-model="oneEditInfo.remark"
              :maxlength="100"
            ></el-input>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          plain
          v-if="!changePicDetailInfo.replaceDate"
          @click="handleCloseChangePicDetail"
          >取 消
        </el-button>
        <el-button
          plain
          v-if="changePicDetailInfo.replaceDate"
          @click="handleCloseChangePicDetail"
          >关 闭
        </el-button>
        <el-button
          plain
          v-if="changePicDetailInfo.replaceDate"
          @click="cancelPain('one')"
          >取消换画
        </el-button>
        <el-button type="primary" @click="confirmChange('one')"
          >提 交</el-button
        >
      </div>
    </el-dialog>
    <!-- 批量换画弹出框 -->
    <el-dialog :visible.sync="isShowEdit" title="批量换画" width="405px">
      <el-row>
        <el-col class="flex_box">
          <span> <b style="color: #ff0000">*</b> 换画日期： </span>
          <el-date-picker
            size="small"
            v-model="allEditInfo.date"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-col>
        <el-col class="flex_box imgpain_box">
          <span>换画素材：</span>
          <el-upload
            :action="doUpload"
            :headers="{
              uid: sessionData.uID,
              token: sessionData.token,
            }"
            list-type="picture-card"
            :file-list="imgUrl"
            :before-upload="beforeUpload"
            :on-success="onsucess"
            :limit="1"
          >
            <span class="upload_border">
              <i class="el-icon-plus"></i>
              <span>上传图片</span>
            </span>
          </el-upload>
        </el-col>
        <el-col class="flex_box">
          <span>备注信息：</span>
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注信息"
            v-model="allEditInfo.remark"
            :maxlength="100"
          ></el-input>
        </el-col>
      </el-row>
      <span slot="footer">
        <el-button plain @click="cancelChange()">取 消</el-button>
        <el-button type="primary" @click="confirmChange('all')"
          >提 交</el-button
        >
      </span>
    </el-dialog>

    <!-- 图片查看显示 -->
    <el-dialog :visible.sync="dialogVisible" class="imgPreview" top="10vh">
      <img :src="dialogImageUrl" alt="暂无图片" />
      <ul class="u-comment">
        <li>
          <img src="../../../assets/images/usericon.png" />
          <span>上传用户：{{ dialogRealName }}</span>
        </li>
        <li>
          <img src="../../../assets/images/clock.png" />
          <span>上传时间：{{ dialogPUTime }}</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
import { api } from "../../../api/api.js";
import noSearchResult from "./noSearchResult.vue";
import timeFormat from "../../../commonFun/timeFormat.js";
import sessFun from "../../../commonFun/sessFun.js";
// 时间格式化
import dateFormat from "../../../commonFun/timeFormat.js";

export default {
  components: {
    noSearchResult,
  },
  props: {
    apId: {
      type: [Number, String],
      default: -1,
    },
    companyId: {
      type: [Number, String],
    },
    type: {
      type: Number,
      default: 0,
    },
    orderDetail: {
      type: Object,
    },
    scheduleList: {
      type: Array,
      default: () => [],
    },
    adMaterialRemarkList: {
      typeof: Array,
      default: () => [],
    },
    fromType: {
      type: Boolean,
    },
    planPanel: {
      type: String,
    },
    firstTime: {
      type: Boolean,
    },
  },
  data() {
    return {
      sessionData: sessFun.getSess(),
      mediaTypeList: [],
      // 上下刊搜索
      publishSearchInfo: {
        // 媒体类型
        mediaType: null,
        // 城市选择
        citySelect: ["全部"],
        // 资源选择
        allhouse: ["全部"],
        // 监播图选择
        allPic: "1",
        //投放状态
        lState: "0",
        // 搜索列表
        // 城市列表
        citys: [],
        // 投放排期
        dateRange: ["全部"],
        // 物料备注
        materialRemark: ["全部"],
        // prStatus: "全部",
      },
      // 资源列表
      allResource: [],
      // 上传图片
      addload: "",
      // 所有的图片组合
      uploadImgArr: [],
      // 关联属性数组
      constractArr: [],
      updateLoading: false,
      // 导出订单图片包
      downLoading: false,

      // 上下刊以及换画百分比数量等
      publishNumInfo: {
        // "door": {
        //     "totalCount": 0,
        //     "hasPhotoCount": 0
        // },
        // "barrier": {
        //     "totalCount": 0,
        //     "hasPhotoCount": 0
        // },
        changePic: {
          percent: 0,
          currNum: 0,
          totalNum: 0,
        },
      },
      // 换画名称列表
      painList: [],
      // 换画当前点击
      activePainIndex: 0,
      // 搜索信息
      searchInfo: {
        mediaType: null,
        city: ["全部"],
        resName: "全部",
        status: "全部",
        // prStatus: "全部",
        // 搜索列表数据
        // 媒体类型
        mediaTypeArr: [
          {
            label: "全部",
            value: null,
          },
        ],
        // 城市区域
        citys: [],
        // 资源列表
        resArr: [],
        // 状态
        statusArr: [
          {
            label: "全部",
            value: 0,
          },
          {
            label: "已上传",
            value: 1,
          },
          {
            label: "未上传",
            value: 2,
          },
        ],
      },
      // 分页信息
      pageInfo: {
        paginationShow: true,
        currPage: 1,
        totalNum: 0,
        loading: false,
        pageSize: 6,
      },
      // 图片列表
      imageArr: [],
      //显示预览图蒙版
      showPreImg: null,
      // 是否展示换画弹框
      isShowPic: false,

      // 弹出框搜索
      dialogInfo: {
        resName: [],
        picState: "",
        mapName: "",
        // 资源名称列表
        resArr: [],
        // 状态列表
        stateArr: [
          {
            label: "全部换画点位",
            value: 2,
          },
          {
            label: "已保存换画点位",
            value: 1,
          },
          {
            label: "未保存换画点位",
            value: 0,
          },
        ],
        // 地图中心点列表
        // mapArr: [],
        districtIdList: [], //区域搜索列表
        schDateList: [], //排期搜索列表
      },
      // 弹出框分页信息
      dialogPage: {
        loading_maInfo: false,
        currInfoPage: 1,
        pageSize: 500,
        totalInfoPage: 1,
        pointLoading: false,
      },
      // 全部点位以及已设置点位
      pointInfo: {
        pointNum: 0,
        setedNum: 0,
      },
      // 换画弹出框点位列表
      pointArr: [],
      // 有操作的列表
      shoplist: [],
      //勾选的数据
      selectList: [],
      // 图片放大弹出框
      dialogVisible: false,
      dialogImageUrl: "",
      dialogRealName: "",
      dialogPUTime: "",
      // 上传图片以及换画日期弹出框
      isShowEdit: false,
      // 上传图片地址
      doUpload: "http://192.168.1.177:8040/national/api/v1/photo/upload",
      // doUpload: "http://192.168.1.239/advertisement/UpLoad",
      imgUrl: [],
      allEditInfo: {
        date: "",
        url: "",
        remark: "",
      },
      oneEditInfo: {
        date: "",
        url: "",
        remark: "",
      },
      // 时间控件限制范围
      dateRange: {
        beginDate: "",
        endDate: "",
      },
      pickerOptions: {
        disabledDate: (time) => {
          // return false;
          let beginDateVal =
            new Date(this.dateRange.beginDate).getTime() + 60 * 60 * 24 * 1000;
          let endDateVal =
            new Date(this.dateRange.endDate).getTime() - 60 * 60 * 24 * 1000;
          if (beginDateVal || endDateVal) {
            return time.getTime() < beginDateVal || time.getTime() > endDateVal;
          }
        },
      },
      //换画详情对话框
      changePicDetailModal: false,
      changePicDetailInfo: "",
      isShowChanggPicForm: false,
      isSearch: false,
      // selectNum:0,//当前选择的点位
      handleFlag: false,
      isEdit: false, //是编辑或新增换画
      regionAreaList: [], //换画区域城市
      launchDateList: [], //换画排期筛选列表launchDateList
    };
  },
  mounted() {
    // 获取城市区域
    this.getCitys();
    //获取换画城市列表
    this.getRegionAreaList();
    // 获取资源列表
    this.getResArr();
    //得到换画排期筛选列表
    this.getAdChangeLaunchDateList();
    if (this.type == 0 || this.type == 1) {
      this.getAdsUploadImgCnt();
    } else if (this.type === 2) {
      this.getImgArr();
    }
  },
  watch: {
    fromType() {
      this.getPainList().then((res) => {
        this.isShowPic = true;
        this.editReport(false);
      });
    },
  },

  methods: {
    //获取媒体类型数据
    getMediaTypes() {
      //如果当前换画组数据为空时，则不进行数据请求
      if (this.painList.length <= 0) return;
      let info = {
        apID: this.apId,
        companyId: this.companyId,
        replaceRecordId: this.painList[this.activePainIndex].id,
      };
      api
        .getApi("/national/api/v1/nationalAdPlan/mediaTypeList", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let _data = res.data.data;
            let _newData = [
              {
                label: "全部",
                value: null,
              },
            ];
            _data.forEach((item) => {
              _newData.push({
                label: item.name,
                value: item.id,
              });
            });
            this.searchInfo.mediaTypeArr = _newData;
            this.searchInfo.mediaType = null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取媒体类型及上下刊点位数量和上传图片数量
    getAdsUploadImgCnt() {
      let info = {
        apID: this.apId,
        companyId: this.companyId,
      };
      if (this.type === 0 || this.type === 1) {
        info.imgType = this.type;
      }
      api
        .getApi("/national/api/v1/nationalAdPlan/getAdsUploadImgCnt", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let _data = res.data.data;
            this.mediaTypeList = _data;
            this.publishSearchInfo.mediaType = _data[0]
              ? _data[0].mediaTypeId
              : null;

            // 获取报告列表
            this.getImgArr();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 改变页数
    sizeChange(pageVal) {
      this.pageInfo.loading = true;
      this.pageInfo.currPage = 1;
      this.pageInfo.pageSize = pageVal;
      this.getImgArr();
    },
    // 点击页数
    changePage(page) {
      this.pageInfo.loading = true;
      this.pageInfo.currPage = page;
      this.getImgArr();
    },
    //换画弹框页码
    painSizeChange(pageVal) {
      this.dialogPage.currInfoPage = 1;
      this.dialogPage.pageSize = pageVal;
      this.searchInfoFun();
    },
    // 点击页数
    changePainPage(page) {
      this.dialogPage.currInfoPage = page;
      this.searchInfoFun();
    },
    // 获取图片列表
    getImgArr() {
      if (this.type === 0 || this.type === 1) {
        // 上下刊报告列表
        this.searchFun();
      } else if (this.type == 2) {
        // 获取换画名称列表
        this.getPainList().then((res) => {
          // 换画报告列表
          if (this.painList.length > 0) {
            this.search();
          }
        });
      }
    },
    // 获取城市区域
    getCitys() {
      let info = {
        apId: this.apId,
      };
      api.getApi(this.apiVar.replace + "/plan/region", info).then((res) => {
        if (res.data.SysCode == 200200) {
          let resArr = res.data.data;
          let result = this.formatCitys(resArr);
          this.searchInfo.citys = result;
          this.publishSearchInfo.citys = result;
        } else {
          sessFun.messageFun(res.data.MSG);
        }
      });
    },
    formatCitys(arr) {
      arr = arr.map((item) => {
        return {
          ...item,
          label: item.cityName,
          value: item.cityId,
          children: item.districtDtoList.map((data) => {
            return {
              ...data,
              label: data.districtName,
              value: data.districtId,
            };
          }),
        };
      });
      arr.unshift({
        value: "全部",
        label: "全部",
      });
      return arr;
    },
    // 获取资源列表
    getResArr(cityId = "", areaId = "") {
      let info = {
        apId: this.apId,
        cityId: cityId,
        districtId: areaId,
        companyId: this.companyId,
      };
      api
        .getApi("/national/api/v1/nationalAdPlan/getResByApID", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let result = (res.data.data || []).map((item) => {
              return {
                ...item,
                label: item.resName,
                value: item.resID,
              };
            });
            this.allResource = result;
            /* result.unshift({
                            value: "全部",
                            label: "全部"
                        }) */
            this.searchInfo.resArr = result;
          } else {
            sessFun.messageFun(res.data.MSG);
          }
        });
    },
    // 修改媒体类型
    changeMedia() {
      this.pageInfo.currPage = 1;
      this.resetSearch("sxk");
      this.uploadImgArr = [];
      this.constractArr = [];
      this.searchFun();
    },
    searchImgChange() {
      let { citySelect } = this.publishSearchInfo;
      if (citySelect[0] !== "全部") {
        let cityId = citySelect[0];
        let areaId = citySelect[1];
        this.getResArr(cityId, areaId);
      } else {
        this.getResArr();
      }
    },
    // 上下刊搜索图片
    searchImg() {
      let { citySelect, allhouse, allPic } = this.publishSearchInfo;
      if (citySelect.length || allhouse || allPic) {
        this.pageInfo.currPage = 1;
        this.searchFun();
      } else {
        sessFun.messageFun("warning", "请输入搜索条件");
      }
    },
    // 上下刊报告
    searchFun() {
      this.pageInfo.paginationShow = false;
      this.pageInfo.loading = true;
      let info = {};
      if (this.type === 0 || this.type === 1) {
        info = this.searchFormat(this.type);
      }
      this.getImgInfo(info);
      this.$nextTick(function () {
        // this.pageInfo.paginationShow = true;
      });
    },
    changeSelect(arr = [], target, optionsArr) {
      let allIndex = arr.indexOf("全部");
      if (allIndex !== -1 && arr.length > 1) {
        if (allIndex == 0) {
          this.publishSearchInfo[target].splice(allIndex, 1);
        } else {
          //如果存在全部并且不是第0项
          this.publishSearchInfo[target] = ["全部"];
        }
      } else if (allIndex === -1 && arr.length == this[optionsArr].length) {
        this.publishSearchInfo[target] = ["全部"];
      }
    },
    // 搜索数据格式化
    searchFormat(type) {
      let { uID, token } = this.sessionData;
      let { currPage, pageSize } = this.pageInfo;
      let {
        mediaType,
        citySelect,
        allhouse,
        allPic,
        lState,
        dateRange,
        materialRemark,
        // prStatus,
      } = this.publishSearchInfo;
      let info = {
        uid: uID,
        token: token,
        apId: this.apId,
        companyId: this.companyId,
        imgType: type,
        pageNum: currPage,
        pageSize: pageSize,
        mediaTypeId: mediaType,
        time: dateRange.includes("全部") ? "" : dateRange.join(","),
        materialRemark: materialRemark.includes("全部") ? "" : materialRemark,
        // prStatus: prStatus == "全部" ? "" : prStatus,
      };

      if (allPic == "2") {
        info.hasUpload = "true";
      }
      if (allPic == "3") {
        info.hasUpload = "false";
      }
      if (lState != "0") {
        info.lState = lState;
      }
      if (citySelect.length) {
        if (citySelect[0] == "全部") {
        } else {
          info.city = citySelect[0];
          info.district = citySelect[1];
        }
      }
      if (!allhouse.includes("全部")) {
        info.resid = allhouse;
      }
      return info;
    },
    //重置
    resetSearch(type) {
      if (type == "sxk") {
        this.publishSearchInfo = {
          ...this.publishSearchInfo,
          citySelect: ["全部"],
          // 资源选择
          allhouse: ["全部"],
          // 监播图选择
          allPic: "1",
          //投放状态
          lState: "0",
          // 投放排期
          dateRange: ["全部"],
          // 物料备注
          materialRemark: ["全部"],
          // prStatus: "全部",
        };
      } else {
        this.searchInfo = {
          ...this.searchInfo,
          mediaType: "全部",
          city: ["全部"],
          resName: "全部",
          status: "全部",
          // prStatus: "全部",
        };
      }
      this.getImgArr();
    },
    // 上下刊报告列表
    getImgInfo(params) {
      this.pageInfo.loading = true;
      api
        .getApi("/national/api/v1/nationalAdPlan/pageAdsUploadInfo", params)
        .then((res) => {
          if (res.data.SysCode === 200200) {
            let dataInfo = res.data.data;
            if (dataInfo.total == 0) {
              sessFun.messageFun("warning", `${params.mVehicle || ""}暂无数据`);
            }
            this.pageInfo = {
              ...this.pageInfo,
              ...{ totalNum: dataInfo.total },
            };
            for (let data of dataInfo.list || []) {
              for (let item of data.photoList || []) {
                item.name = item.pID + ".png";
                item.url = item.pURL;
                item.pID = item.pID;
                item.isCollection = false;
              }
              let time =
                dateFormat.toDate(data.lStar, "/") +
                "-" +
                dateFormat.toDate(data.lEnd, "/");
              data.timeRange = time;
            }
            this.imageArr = dataInfo.list || [];
            // this.checkImgStatus();
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        })
        .finally(() => {
          this.pageInfo.loading = false;
        });
    },
    // 检查图片是否已收藏
    /* checkImgStatus() {
      let pIDList = this.returnPIDList();
      if (!pIDList.length) {
        return;
      }
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        pids: pIDList.join(","),
      };
      console.log("params", params);
      api
        .getApi(this.apiVar.Advertisement + "/GetUserStatusByPid", params)
        .then((res) => {
          console.log("检测图片收藏状态res", res);
          if (res.data.SysCode === 200200) {
            this.setImgStatus(res.data.data);
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    }, */
    // 返回PIDList
    /* returnPIDList() {
      let reportList = this.imageArr;
      let pIDList = [];
      for (let key of reportList) {
        let imgArr = key.photoList;
        for (let imgKey of imgArr) {
          if (imgKey.pID) {
            pIDList.push(imgKey.pID);
          }
        }
      }
      return pIDList;
    }, */
    // 获取全部换画列表(换画名称以及id)
    getPainList() {
      let promise = new Promise((resolve, reject) => {
        let info = {
          apID: this.apId,
          companyId: this.companyId,
        };
        api.getApi("/national/api/v1/replace/list", info).then((res) => {
          if (res.data.SysCode == 200200) {
            this.painList = res.data.data.map((item) => {
              return {
                ...item,
                name: item.replaceRecordName,
              };
            });
            this.getMediaTypes();
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          resolve();
        });
      });
      return promise;
    },
    // 获取换画报告列表
    getData(params) {
      this.pageInfo.loading = true;
      api
        .postApi_json("/national/api/v1/replace/detailInfo", params)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let dataInfo = res.data.data;
            this.pageInfo = {
              ...this.pageInfo,
              ...{ totalNum: dataInfo.total },
            };
            for (let data of dataInfo.list) {
              data.city = data.cityName;
              data.rName = data.districtName;
              data.lStar = data.beginDate;
              data.lEnd = data.endDate;
              if (data.adPlanPics) {
                for (let item of data.adPlanPics) {
                  (item.name = item.pID + ".png"), (item.url = item.picUrl);
                  item.pID = item.pID;
                  item.isCollection = false;
                }
              } else {
                data.adPlanPics = [];
              }
              data.photoList = data.adPlanPics;
            }
            this.imageArr = dataInfo.list;
            // this.checkImgStatus();
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          this.pageInfo.loading = false;
        });
      //   换画组的点位完成数量
      api
        .getApi("/national/api/v1/replace/getFinishUploadCnt", {
          replaceRecordId: params.replaceRecordId,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let resData = res.data.data;
            let percent = 0;
            if (resData && resData.totalCnt && resData.finishCnt) {
              percent = Number(
                ((resData.finishCnt / resData.totalCn) * 100).toFixed(2)
              );
            }
            this.publishNumInfo.changePic = {
              percent,
              currNum: resData.finishCnt || 0,
              totalNum: resData.totalCnt || 0,
            };
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    },
    // 城市区域变化
    painCityChange() {
      let { city } = this.searchInfo;
      if (city[0] == "全部") {
        this.searchInfo = {
          ...this.searchInfo,
          city: ["全部"],
        };
      } else {
        let cityId = city[0];
        let areaId = city[1];
        this.getResArr(cityId, areaId);
      }
    },
    // 搜索
    search() {
      this.pageInfo.paginationShow = false;
      this.pageInfo.loading = true;
      let info = this.searchPointFormat();
      this.getData(info);
      this.$nextTick(function () {
        this.pageInfo.paginationShow = true;
      });
    },
    // 搜索换画列表条件
    searchPointFormat() {
      let { mediaType, city, resName, status } = this.searchInfo;
      let { currPage, pageSize } = this.pageInfo;
      let info = {
        apId: this.apId,
        replaceRecordId: this.painList.length
          ? this.painList[this.activePainIndex].id
          : "",
        // prStatus: prStatus == "全部" ? "" : prStatus,
        pageNum: currPage,
        pageSize: pageSize,
        mediaTypeId: mediaType,
      };
      if (city[0] != "全部") {
        info.districtId = city[1];
      }
      if (resName !== "全部" && resName != "") {
        info.resIds = [resName];
      }
      if (status !== "全部" && status != "") {
        info.reportStatus = status == 1 ? 1 : 0;
      }
      return info;
    },
    // 点击左边
    toLeft() {
      if (this.activePainIndex <= 0) {
        this.activePainIndex = 0;
      } else {
        this.activePainIndex--;
      }
      this.changePain(this.activePainIndex);
    },
    // 点击右边
    toRight() {
      if (this.activePainIndex < this.painList.length - 1) {
        this.activePainIndex++;
      } else {
        this.activePainIndex = this.painList.length - 1;
      }
      this.changePain(this.activePainIndex);
    },
    // 点击换画名称
    changePain(index) {
      this.dateRange = {
        beginDate: this.painList[index].startDate,
        endDate: this.painList[index].endDate,
      };
      this.pageInfo.currPage = 1;
      this.searchInfo = {
        ...this.searchInfo,
        city: [],
        resName: "",
        status: "",
      };
      this.activePainIndex = index;
      // 去获取换画列表
      this.search();

      //去获取媒体类型
      this.getMediaTypes();
    },
    // 编辑报告
    editReport(isEdit) {
      this.isShowPic = true;
      this.isEdit = isEdit;
      this.dialogPage = {
        ...this.dialogPage,
        currInfoPage: 1,
        pageSize: 500,
      };
      this.dialogInfo = {
        ...this.dialogInfo,
        resName: [],
        picState: "",
        mapName: "",
        schDateList: [],
        districtIdList: [],
      };
      this.shoplist = [];
      this.selectList = [];
      this.selectNum = 0;
      this.pointArr = [];
      this.handleFlag = false;
      // 获取资源名称列表
      this.getDialogInfoResArr();
      // 获取地图中心点
      //   this.getMapArr();
      // 获取表格数据
      this.searchInfoFun();
      //获取换画城市区域
      this.getRegionAreaList();
      //得到换画排期筛选列表
      this.getAdChangeLaunchDateList();
    },
    /**
     *  选择换画点位弹出框
     */
    searchInfoFun() {
      this.dialogPage.pointLoading = true;
      let info = this.searchDataFormat();
      this.getMaterInfo(info);
    },
    // 搜索数据格式化
    searchDataFormat() {
      let { resName, picState, mapName, districtIdList, schDateList } =
        this.dialogInfo;
      let { currInfoPage, pageSize } = this.dialogPage;
      let info = {
        pageNum: currInfoPage,
        pageSize: pageSize,
        apId: this.apId,
        ...(resName.length && { resIds: resName }),
        ...(mapName && { mapCenterInfo: mapName }),
        ...(picState >= 0 && { replaceStatus: picState == 2 ? "" : picState }),
        //后端要求查全部，就不传该字段
        ...(districtIdList.length > 1 && {
          districtIdList: [districtIdList[1]],
        }),
        ...(schDateList[0] != "全部" && schDateList.length && { schDateList }),
      };
      info.replaceRecordId = !this.isEdit
        ? null
        : this.painList[this.activePainIndex].id;
      return info;
    },
    //获取换画数据
    getMaterInfo(params) {
      this.pointArr = [];
      api
        .postApi_json("/national/api/v1/replace/getPlanLaunchAds", params)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            if (res.data.data.total >= 0) {
              let dataInfo = res.data.data;
              // 物料信息弹出框的选点信息
              let dataArr = dataInfo.list || [];
              this.pointArr = this.formatData(dataArr);

              this.dialogPage = {
                ...this.dialogPage,
                loading_maInfo: true,
                totalInfoPage: dataInfo.pages,
              };
              // 点位数量
              this.pointInfo = {
                pointNum: dataInfo.total,
                setedNum: 0,
              };
              this.selectioUpdate("all");
            }
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          this.dialogPage.pointLoading = false;
        })
        .catch((err) => {
          this.dialogPage.pointLoading = false;
        });
    },
    formatData(arr) {
      let result = [];
      for (let data of arr) {
        let obj = this.setTableData(data);
        result.push(obj);
      }
      return result;
    },
    // 表格数据格式
    setTableData(item) {
      let timeRange = item.beginDate + "-" + item.endDate;
      let obj = {
        ...item,
        id: item.replaceRecordDetailId,
        timeRange: timeRange,
      };
      return obj;
    },

    //点击编辑
    showChangePicDetailModal(item) {
      if (!item.replaceDate) {
        this.imgUrl = [];
        this.oneEditInfo = {
          date: "",
          url: "",
          remark: "",
        };
      } else {
        if (!item.picUrl) {
          this.imgUrl = [];
        } else {
          let resImg = { name: "图片1", url: item.picUrl };
          this.imgUrl = [resImg];
        }
        this.oneEditInfo = {
          date: item.replaceDate,
          url: item.picUrl,
          remark: item.remark,
        };
      }
      // 设置排期
      this.dateRange = {
        beginDate: item.beginDate,
        endDate: item.endDate,
      };
      // console.log(item,this.oneEditInfo);
      this.changePicDetailModal = true;
      this.changePicDetailInfo = item;
      if (!this.isHaveFun(this.shoplist, item)) {
        this.shoplist.push(item);
      }
    },
    //换画详情对话框关闭前
    handleCloseChangePicDetail() {
      this.changePicDetailModal = false;
    },
    // 选择一条
    handleSelect(selection, row) {
      console.log(selection, row, "selection ---row ");
      // 选中
      if (this.isHaveFun(selection, row)) {
        for (let data of selection) {
          if (!this.isHaveFun(this.shoplist, data)) {
            this.shoplist.push(data);
          }
          if (!this.isHaveFun(this.selectList, data)) {
            // this.selectNum++
            this.selectList.push(data);
          }
        }
      } else {
        // 取消选中
        if (this.isHaveFun(this.shoplist, row)) {
          this.shoplist = this.shoplist.filter((item) => {
            if (item.lID == row.lID) {
              return false;
            }
            return true;
          });
          this.selectList = this.selectList.filter((item) => {
            // this.selectNum--
            if (item.lID == row.lID) {
              return false;
            }
            return true;
          });
        }
      }
    },
    // 全选
    handleSelectAll(selection) {
      if (selection.length) {
        for (let data of selection) {
          if (!this.isHaveFun(this.shoplist, data)) {
            this.shoplist.push(data);
          }
          if (!this.isHaveFun(this.selectList, data)) {
            this.selectList.push(data);
          }
        }
      } else {
        for (let data of this.pointArr) {
          if (this.isHaveFun(this.shoplist, data)) {
            this.shoplist = this.shoplist.filter((item) => {
              if (item.lID == data.lID) {
                return false;
              }
              return true;
            });
          }
          if (this.isHaveFun(this.selectList, data)) {
            this.selectList = this.selectList.filter((item) => {
              if (item.lID == data.lID) {
                return false;
              }
              return true;
            });
          }
        }
      }
    },
    // 判断一个对象是否已经在数组中
    isHaveFun(arr, obj) {
      let res = arr.filter((item) => {
        if (item.lID == obj.lID) {
          return true;
        }
        return false;
      });
      if (res.length) {
        return true;
      }
      return false;
    },
    // 是否勾选更新
    selectioUpdate(type) {
      let timer = setTimeout(() => {
        for (let item of this.selectList) {
          for (let data of this.pointArr) {
            if (data.lID == item.lID) {
              this.$refs.multipleTable.toggleRowSelection(data, true);
            }
          }
        }
        for (let item of this.shoplist) {
          for (let data of this.pointArr) {
            if (data.lID == item.lID) {
              data.remark = item.remark;
              data.imgUrl = item.imgUrl;
              data.replaceDate = item.replaceDate;
            }
          }
        }
        clearTimeout(timer);
      }, 0);
    },
    // 获取地图中心点
    /* getMapArr() {
      let info = {
        apId: this.apId,
      };
      api
        .getApi(this.apiVar.replace + "/plan/mapCenterInfo", info)
        .then((res) => {
          console.log(res);
          if (res.data.SysCode == 200200) {
            this.dialogInfo.mapArr =
              res.data.data &&
              res.data.data.map((item) => {
                return {
                  ...item,
                  label: item.mapCenterName,
                  value: item.mapCenterName,
                };
              });
            console.log(this.dialogInfo.mapArr);
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    }, */
    // 获取弹出框资源下拉列表
    getDialogInfoResArr() {
      let info = {
        apId: this.apId,
        companyId: this.companyId,
      };
      api
        .getApi("/national/api/v1/nationalAdPlan/getResByApID", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let result = res.data.data.map((item) => {
              return {
                ...item,
                label: item.resName,
                value: item.resID,
              };
            });
            this.dialogInfo.resArr = result;
          } else {
            sessFun.messageFun(res.data.MSG);
          }
        });
    },
    // 换画点位搜索
    searchPoint() {
      console.log(this.dialogInfo);
      this.isSearch = true;
      this.pointArr = [];
      this.dialogPage = {
        ...this.dialogPage,
        loading_maInfo: false,
        currInfoPage: 1,
        totalInfoPage: 0,
        pointLoading: true,
      };
      this.searchInfoFun();
    },
    // 重置
    resetPoint() {
      this.isSearch = false;
      let info = {
        resName: [],
        picState: "",
        mapName: "",
        districtIdList: [],
        schDateList: [],
      };
      this.dialogInfo = {
        ...this.dialogInfo,
        ...info,
      };
      this.dialogPage = {
        ...this.dialogPage,
        loading_maInfo: false,
        currInfoPage: 1,
        totalInfoPage: 0,
        pointLoading: true,
      };
      this.pointArr = [];
      this.searchInfoFun();
      console.log(this.dialogInfo, this.dialogPage);
    },
    // 查看图片
    previewImg(file) {
      console.log(file);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除图片链接
    deleteOneImg(row) {
      for (let data of this.pointArr) {
        if (data.lID == row.lID) {
          data.picUrl = "";
          break;
        }
      }
      for (let data of this.shoplist) {
        if (data.lID == row.lID) {
          data.picUrl = "";
          break;
        }
      }
      this.pointArr.push();
      console.log(this.pointArr);
    },
    // 换画上传图片等
    showUpload() {
      this.imgUrl = [];
      if (this.selectList.length) {
        let start = this.selectList[0].beginDate,
          end = this.selectList[0].endDate;
        try {
          this.selectList.forEach((item) => {
            if (item.beginDate && item.endDate) {
              if (Date.parse(item.beginDate) < Date.parse(start)) {
                start = item.beginDate;
              }
              if (Date.parse(item.endDate) > Date.parse(end)) {
                end = item.endDate;
              }
            }
          });
          this.dateRange = {
            beginDate: start,
            endDate: end,
          };
        } catch (error) {
          console.log("换画日期错误", error);
        }
        this.isShowEdit = true;
        this.allEditInfo = {
          date: "",
          url: "",
          remark: "",
        };
      } else {
        sessFun.messageFun("warning", "请先选择需要换画的点位!");
      }
    },
    // 取消
    cancelChange() {
      this.isShowEdit = false;
    },
    // 上传图片之前的格式大小判断
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        sessFun.messageFun("error", "只能上传jpg/png图片!");
      }
      if (!isLt2M) {
        sessFun.messageFun("error", "图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 上传成功
    onsucess(res, file) {
      const { data } = res;
      this.imgUrl = [];
      let resImg = { name: "图片1", url: data.pURL };
      this.imgUrl = [resImg];
      console.log(this.imgUrl);
    },
    //删除图片
    delectImg(res, file) {
      this.imgUrl = [];
      this.oneEditInfo.url = "";
    },
    // 提交换画信息
    confirmChange(type) {
      this.handleFlag = true;
      if (type == "all") {
        let { date, url, remark } = this.allEditInfo;
        if (date) {
          this.isShowEdit = false;
          this.changePicDetailModal = false;
          if (this.imgUrl[0]) {
            this.allEditInfo.url = this.imgUrl[0].url;
          }
          for (let data of this.shoplist) {
            for (let item of this.selectList) {
              if (data.lID == item.lID) {
                data.remark = this.allEditInfo.remark;
                data.replaceDate = this.allEditInfo.date;
                data.picUrl = this.allEditInfo.url;
              }
            }
          }
          for (let data of this.pointArr) {
            for (let item of this.selectList) {
              if (data.lID == item.lID) {
                data.remark = this.allEditInfo.remark;
                data.replaceDate = this.allEditInfo.date;
                data.picUrl = this.allEditInfo.url;
                //取消选中
                this.$refs.multipleTable.toggleRowSelection(data, false);
              }
            }
          }
          this.selectList = [];
        } else {
          sessFun.messageFun("warning", "请选择换画日期!");
        }
      } else {
        let { date, url, remark } = this.oneEditInfo;
        if (date) {
          this.isShowEdit = false;
          this.changePicDetailModal = false;
          if (this.imgUrl[0]) {
            this.oneEditInfo.url = this.imgUrl[0].url;
          } else {
            this.oneEditInfo.url = "";
          }
          for (let data of this.pointArr) {
            if (data.lID == this.changePicDetailInfo.lID) {
              data.remark = this.oneEditInfo.remark;
              data.replaceDate = this.oneEditInfo.date;
              data.picUrl = this.oneEditInfo.url;
              this.$refs.multipleTable.toggleRowSelection(data, false);
            }
          }
        } else {
          sessFun.messageFun("warning", "请选择换画日期!");
        }
      }
    },

    // 取消
    cancel() {
      this.isShowPic = false;
      this.shoplist = [];
      this.selectList = [];
      this.$emit("hidePainModal", "false");
    },
    // 确认-生成换画任务
    saveAll() {
      if (this.handleFlag && this.shoplist.length) {
        if (this.isEdit) {
          this.editPainReport();
        } else {
          this.addPainReport();
        }
      } else {
        sessFun.messageFun(
          "warning",
          "没有点位信息发生变更，请先对点位进行操作"
        );
      }
    },
    addPainReport() {
      let that = this;
      let len = this.painList.length;
      let painInfo = {
        apId: this.apId * 1,
        companyId: this.companyId * 1,
        replaceRecordName: `换画${len + 1}`,
      };
      api
        .postApi_json("/national/api/v1/replace/saveRecord", painInfo)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let result = [];
            for (let data of this.shoplist) {
              let obj = {
                ...data,
                status: data.replaceDate ? 1 : 0,
                replaceRecordId: res.data.data,
              };
              result.push(obj);
            }
            api
              .postApi_json("/national/api/v1/replace/saveRecordDetail", result)
              .then((res) => {
                if (res.data.SysCode == 200200) {
                  that.isShowPic = false;
                  if (len == 0) {
                    //创建第一个换画报告，在父组件添加tab
                    console.log("that.$parent", that.$parent);
                    that.$parent.getPainlist();
                    that.$emit("toSixthTab", "sixth");
                  }
                  setTimeout(() => {
                    that.getPainList().then((res) => {
                      that.activePainIndex = that.painList.length - 1;
                      let info = that.searchPointFormat();
                      that.getData(info);
                      this.$emit("hidePainModal", "false");
                    });
                  }, 100);
                  sessFun.messageFun("success", "新增换画报告成功！");
                } else {
                  sessFun.messageFun("warning", res.data.MSG);
                }
              });
          } else {
            sessFun.messageFun("warning", res.data.msg);
          }
        });
    },
    editPainReport() {
      if (this.handleFlag && this.shoplist.length) {
        let result = [];
        for (let data of this.shoplist) {
          let obj = {
            ...data,
            status: data.replaceDate ? 1 : 0,
            replaceRecordId: this.painList[this.activePainIndex].id,
          };
          result.push(obj);
        }
        api
          .postApi_json("/national/api/v1/replace/saveRecordDetail", result)
          .then((res) => {
            if (res.data.SysCode == 200200) {
              this.isShowPic = false;
              sessFun.messageFun("success", res.data.MSG);
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
            this.search();
          });
      } else {
        sessFun.messageFun(
          "warning",
          "没有点位信息发生变更，请先对点位进行操作"
        );
      }
    },
    // 取消换画
    cancelPain(type) {
      if (type == "all") {
        if (this.selectList.length) {
          this.$confirm(
            "确认取消换画后，所选点位换画信息将被清空",
            "是否确认取消换画",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              // this.changePicDetailModal = false
              this.removePain(type);
            })
            .catch(() => {
              sessFun.messageFun("info", "已取消操作");
            });
        } else {
          sessFun.messageFun("warning", "请先选择需要取消换画的点位!");
        }
      } else {
        this.$confirm(
          "确认取消换画后，所选点位换画信息将被清空",
          "是否确认取消换画",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            // console.log(1);
            this.changePicDetailModal = false;
            this.removePain(type);
          })
          .catch(() => {
            // console.log(2);
            sessFun.messageFun("info", "已取消操作");
          });
      }
    },
    // 移除换画
    removePain(type) {
      this.handleFlag = true;
      if (type == "all") {
        //批量
        for (let data of this.shoplist) {
          for (let item of this.selectList) {
            if (data.lID == item.lID) {
              data.picUrl = "";
              data.remark = "";
              data.replaceDate = "";
            }
          }
        }
        for (let data of this.pointArr) {
          for (let item of this.selectList) {
            if (data.lID == item.lID) {
              data.picUrl = "";
              data.remark = "";
              data.replaceDate = "";
              //取消选中
              this.$refs.multipleTable.toggleRowSelection(data, false);
            }
          }
        }
        this.selectList = [];
      } else {
        //单个
        for (let data of this.pointArr) {
          if (data.lID == this.changePicDetailInfo.lID) {
            data.picUrl = "";
            data.remark = "";
            data.replaceDate = "";
          }
        }
      }
    },
    // 给上下刊添加图片的收藏状态
    /* setImgStatus(data) {
      console.log("给上下刊添加图片的收藏状态", data);
      let reportList = this.imageArr;
      for (let key of reportList) {
        let imgArr = key.photoList;
        for (let imgKey of imgArr) {
          for (let pKey of data) {
            if (pKey.pid == imgKey.pID) {
              imgKey.isCollection = pKey.isCollection;
              break;
            }
          }
        }
      }
      console.log("reportList", reportList, this.pageUpReportArr);
    }, */
    // 字段截取
    wordlimit(word, num) {
      if (word && word.length > num) {
        return (word = word.substr(0, num) + "...");
      }
      return word;
    },
    // 隐藏上传组件
    uploadDisabled(imgList) {
      // console.log(imgList);
      return imgList.length > 5;
    },
    // 上刊图片上传
    submitUpload() {
      if (!this.constractArr.length) {
        return;
      }
      this.addload = this.$loading({
        lock: true,
        text: "保存数据中,请稍等...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let imgArr = this.uploadImgArr;
      let arr = this.constractArr;
      let funs = [];

      for (let i = 0; i < arr.length; i++) {
        let formData = new FormData();
        formData.append("pic", imgArr[i]);
        formData.append("asrID", arr[i].asrID);
        formData.append("pAlt", arr[i].pAlt);
        formData.append("imgType", arr[i].imgType);
        formData.append("ptID", arr[i].ptID);
        formData.append("ptP", arr[i].ptP);
        formData.append("pRemarks", arr[i].pRemarks);
        formData.append("lStart", arr[i].lStart);
        formData.append("lEnd", arr[i].lEnd);
        formData.append("resId", arr[i].resId);
        formData.append("lId", arr[i].lId);
        formData.append("replaceRecordId", arr[i].replaceRecordId);
        formData.append("replaceRecordDetailId", arr[i].replaceRecordDetailId);
        funs.push(this.uploadFun(formData));
      }
      Promise.all(funs)
        .then((values) => {
          console.log(values);
          this.constractArr = [];
          this.uploadImgArr = [];
          if (this.type == 0 || this.type == 1) {
            // 上下刊报告列表
            // this.searchFun();
            this.getAdsUploadImgCnt();
          } else if (this.type === 2) {
            // 换画报告列表
            this.search();
          }
          this.addload.close();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    uploadFun(formData, end, arr) {
      let promise = new Promise((resolve, reject) => {
        api
          .postUpload_file("/national/api/v1/photo/uploadPlanPic", formData)
          .then((res) => {
            if (res.data.SysCode == 200200) {
              resolve(true);
            } else {
              sessFun.messageFun("warning", res.data.MSG);
              reject(false);
            }
          });
      });
      return promise;
    },
    // 收藏
    /* saveImgFun(item, index) {
      console.log("保存图片", item, index);
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        lId: item.lID,
        pId: item.photoList[index].pID,
        picUrl: item.photoList[index].pURL,
        type: this.type,
      };
      if (!params.lId) {
        sessFun.messageFun("warning", "图片信息异常无法保存！");
        return;
      }
      if (params.type === "") {
        delete params.type;
      }
      console.log("params", params);
      api
        .postApi(this.apiVar.Advertisement + "/imageCollection/add", params)
        .then((res) => {
          console.log("图片收藏res", res);
          if (res.data.SysCode === 200200) {
            item.photoList[index].isCollection = true;
            sessFun.messageFun("success", "收藏成功");
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    }, */
    // 取消收藏
    /* cancelImgFun(item, index) {
      console.log("取消收藏", item, index);
      let params = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        pId: item.photoList[index].pID,
      };
      api
        .postApi(this.apiVar.Advertisement + "/imageCollection/remove", params)
        .then((res) => {
          console.log("取消收藏res", res);
          if (res.data.SysCode === 200200) {
            item.photoList[index].isCollection = false;
            sessFun.messageFun("success", "取消成功");
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
        });
    }, */
    // 删除已上传的图片
    deleteImg(item) {
      console.log("删除item", item);
      if (item.pID) {
        this.$confirm("确定移除这张图片吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.handleRemove(item);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    // 上传图片
    uploadImg(params) {
      var fileObj = params.file;
      this.uploadImgArr.push(fileObj);
      this.constractArr.push(this.upLoadObj);
    },
    // 点击上传图片按钮之时进行储存所需数据(asid, ptp等)
    saveId(row) {
      let palt =
        this.orderDetail.apName +
        "-" +
        row.resName +
        "-" +
        row.mTitle +
        row.asLab;
      let ptp = this.apId;
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
        lid: row.lID ? row.lID : "",
      };
      let obj = {
        asrID: row.asrID,
        pAlt: palt,
        ptID: row.asID,
        ptP: ptp,
        pRemarks: JSON.stringify(prk),
        lStart: timeFormat.toDate(row.lStar, "/"),
        lEnd: timeFormat.toDate(row.lEnd, "/"),
        resId: row.resID,
        lId:
          row.mVehicle == "广告门"
            ? row.lID
            : row.lID
            ? row.lID.toString().split(",")[0]
            : "",
        imgType: this.type,
        replaceRecordId: row.replaceRecordId ? row.replaceRecordId : "",
        replaceRecordDetailId: row.replaceRecordDetailId
          ? row.replaceRecordDetailId
          : "",
      };
      this.upLoadObj = obj;
    },
    beforeImgRemove(file, fileList) {
      if (file.pID) {
        return this.$confirm(`确定移除这张图片吗？`);
      }
    },
    // 限制只能上传png,jpeg格式的照片
    beforeAvatarUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || file.type === "image/png";
      const isLt1M = file.size / 1024 / 1024 < 10;

      if (!isIMAGE) {
        sessFun.messageFun("error", "只能上传jpg/png图片!");
      }
      if (!isLt1M) {
        sessFun.messageFun("error", "上传文件大小不能超过 10MB!");
      }
      return isIMAGE && isLt1M;
    },
    // 超过图片上传个数
    handleExceed(files, fileList) {
      console.log(files, fileList);
      sessFun.messageFun(
        "warning",
        `当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // 查看预览图片
    handlePictureCardPreview(file, realName, pUTime) {
      console.log(file);
      this.dialogImageUrl = file;
      this.dialogRealName = realName;
      this.dialogPUTime = pUTime;
      this.dialogVisible = true;
    },
    //删除照片
    handleRemove(file, fileList) {
      if (file.pID) {
        let info = {
          photoId: file.pID,
        };
        api
          .postApi("/national/api/v1/photo/deletePlanPic", info)
          .then((res) => {
            // 实时更新进度条
            if (res.data.SysCode == 200200) {
              sessFun.messageFun("success", res.data.MSG);
              if (this.type === 0 || this.type === 1) {
                // 上下刊报告列表
                //   this.searchFun();
                this.getAdsUploadImgCnt();
              } else if (this.type === 2) {
                // 换画报告列表
                this.search();
              }
            } else {
              sessFun.messageFun("warning", res.data.MSG);
            }
          });
      } else {
        let upLoad = this.uploadImgArr;
        for (let i = 0, iLen = upLoad.length; i < iLen; i++) {
          if (file.uid == upLoad[i].uid) {
            upLoad.splice(i, 1);
            this.constractArr.splice(i, 1);
            break;
          }
        }
      }
    },
    /**
     * 导出图片包、查看H5.更新报告
     * downtype: 1为导出图片包, 2为导出pdf/ppt/pptx
     */
    // 导出图片包
    downloadImg() {
      if (this.type === 0 || this.type === 1) {
        // 上下刊报告列表
        //是否有图片
        let isHaveImg = this.mediaTypeList.some((item) => {
          return item.uploadCnt > 0;
        });
        if (!isHaveImg) {
          sessFun.messageFun("warning", "暂无图片记录");
          return;
        }
      } else if (this.type == 2) {
        // 换画报告列表
        if (!this.publishNumInfo.changePic.currNum) {
          sessFun.messageFun("warning", "暂无图片记录");
          return;
        }
      }
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        apId: this.apId,
        companyId: this.companyId,
        type: "",
        apName: this.orderDetail.apName,
        downtype: 1,
      };
      info.type = this.type;
      this.type === 2 && (info.replaceRecordId = this.painList[this.activePainIndex].id);
      this.downLoading = true;
      const tempPage = window.open("", "_blank");
      api
        .getApi("/image/downloadNationalImgPackage", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let routeUrl = this.$router.resolve({
              path: "/progressDownCountry",
              query: info,
            });
            tempPage.location = routeUrl.href;
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          this.downLoading = false;
        })
        .catch((err) => {
          this.downLoading = false;
        });
    },
    // 更新报告
    updateReport() {
      let info = {
        apId: this.apId,
        type: this.type,
        companyId: this.companyId,
      };
      if (this.type === 2) {
        info.replaceRecordId = this.painList[this.activePainIndex].id;
      }
      this.updateLoading = true;
      api
        .postApi_json("/national/api/v1/powerPoint/updateSXReport", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            sessFun.messageFun("success", res.data.MSG);
          } else {
            sessFun.messageFun("warning", res.data.MSG);
          }
          this.updateLoading = false;
        })
        .catch((err) => {
          console.log(err);
          this.updateLoading = false;
        });
    },

    /**
     *  查看h5上下刊刊报告
     *  0: "SK"
        1: "XK"
        2: "HH"
     */
    showH5() {
      let tempwindow = window.open();
      let replaceRecordId = "";
      if (this.painList && this.painList[this.activePainIndex]) {
        replaceRecordId = this.painList[this.activePainIndex].id;
      }
      tempwindow.location = `/ReportCountry?apID=${this.apId}&&companyId=${this.companyId}&&imgType=${this.type}&&replaceRecordId=${replaceRecordId}`;
    },
    //获取换画区域
    getRegionAreaList() {
      let info = {
        apId: this.apId,
      };
      api
        .getApi(this.apiVar.replace + "/plan/regionAreaList", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let resArr = res.data.data;
            //处理数据得到表头筛选数据
            let result = this.formatCitys(resArr);
            this.regionAreaList = result;
          } else {
            sessFun.messageFun(res.data.MSG);
          }
        });
    },
    //换画弹出窗选择排期
    changeScheduleSelect(arr = [], target, optionsArr) {
      let allIndex = arr.indexOf("全部");
      if (allIndex !== -1 && arr.length > 1) {
        if (allIndex == 0) {
          this.dialogInfo[target].splice(allIndex, 1);
        } else {
          //如果存在全部并且不是第0项
          this.dialogInfo[target] = ["全部"];
        }
      } else if (allIndex === -1 && arr.length == this[optionsArr].length) {
        // 不存在全部但是全选了
        this.dialogInfo[target] = ["全部"];
      }
    },
    //得到换画排期筛选列表
    getAdChangeLaunchDateList() {
      let info = {
        apID: this.apId,
        companyId: this.companyId,
      };
      api
        .getApi("/national/api/v1/nationalAdPlan/getScheduleByApID", info)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.launchDateList = (res.data.data || []).map((item) => {
              return { text: item, value: item };
            });
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch((res) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-overflow /deep/ .el-select__tags-text {
  max-width: 70px;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.date_range_class {
  width: 225px;
}
/deep/ .el-input__icon {
  line-height: unset;
}
/* 上下刊 */
.radio_style {
  vertical-align: top;
  margin-bottom: 10px;
}

/* .up-loader-header {
        position: relative;
        display: flex;
        flex-flow: row wrap;
        align-items: flex-end;
        & > div {
            flex-grow: 1;
            margin-bottom: 12px;
            margin-right: 32px;
        }
        & > button {
            margin-bottom: 12px;
        }
    } */
/* .up-loader-header>div>span{
        color:rgba(0,0,0,0.85);
        font-size: 14px;
    } */

.progress {
  float: right;
}

/* /deep/ .up-loader-header .el-input__inner {
        height: 32px;
        width: 172px;
    } */

.progress span {
  position: relative;
  top: 8px;
  left: 0;
  font-size: 14px;
  color: #666666;
}

/deep/ .el-progress-bar__outer {
  height: 16px !important;
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

/* 图片列表 */
.list_pic {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.pic_left {
  display: flex;
  justify-content: flex-start;
  max-width: 75%;
}

.pic_content {
  display: flex;
  justify-content: flex-start;
  overflow-x: scroll;
  height: 50px;
}

.pain_span {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  text-align: center;
  min-width: 74px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: rgba(0, 0, 0, 0.25);
  margin-right: 8px;
  cursor: pointer;
}

/*!*滚动条*!*/
.pic_content::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
}

.pic_content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 0px;
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}

.pic_content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
  border-radius: 0;
  background: #fafafa;
}

.compare {
  margin-right: 8px;
  width: 32px;
  min-width: 32px;
  display: inline-block;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  color: rgba(0, 0, 0, 0.65);
  cursor: pointer;
}

/* 选中 */
.active {
  border: 1px solid rgba(24, 144, 255, 1);
  color: rgba(24, 144, 255, 1);
}

/* 进度条 */
.process {
  max-width: 25%;
}

.process_box {
  min-width: 150px;
  height: 32px;
  line-height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  margin-left: 16px;
  padding: 0 10px;
  font-size: 12px;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
}

/deep/ .process_box .el-progress {
  display: inline-block;
  width: 80px;
  position: relative;
  right: 0;
  top: 0;
}

/deep/ .process_box .el-progress-bar {
  width: 80px;
}

/deep/ .search_pic .el-row span {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
}

/deep/ .search_pic .el-col-24 {
  width: auto;
}

/deep/ .search_pic .el-col-24 {
  min-width: 25%;
}

/deep/ .search_pic .el-row .el-select,
/deep/ .search_pic .el-row .el-cascader {
  width: calc(98% - 60px);
}

/* 报告列表 */
/* .imgs_box{

    } */
.imgs_point {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin: 16px -10px;
}

.point_item {
  width: 370px;
  height: 298px;
  margin: 0 10px 16px;
  border: 1px solid rgba(233, 233, 233, 1);
  overflow: hidden;
}

/* 详情头部 */
.detail_top {
  height: 56px;
  padding: 9px 16px 0;
  background: rgba(247, 247, 247, 1);
  border-bottom: 1px solid rgba(233, 233, 233, 1);
  font-size: 14px;
  color: #666666;
  background: rgba(247, 247, 247, 1);
  .photo-record-sign {
    float: right;
    margin-left: auto;
    padding: 2px 6px;
    line-height: 16px;
    font-size: 12px;
    border-radius: 2px;
    color: #1890ff;
    background: rgba(24, 144, 255, 0.1);
  }
}

.detail_top p {
  line-height: 20px;
}

.car_header {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #dedede;
}

.car_header span {
  color: rgba(153, 153, 153, 1);
  line-height: 17px;
}

.date_fa {
  margin-right: 4px;
}

/* 详情内容 */
.detail_con span {
  /* margin: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap; */

  position: absolute;
  top: 30px;
  left: 30px;
  font-size: 14px;
  color: #666666;
}

/deep/ .img_box .el-upload--picture-card {
  width: 30%;
  height: 105px;
  line-height: 105px;
  margin: 2% 1.6% 0 1.6%;
  background: rgba(251, 251, 251, 1);
  border-radius: 4px;
  border: 1px dashed #dedede;
  text-align: center;
}

/deep/ .img_box .el-upload-list--picture-card .el-upload-list__item,
/deep/ .upload_plus .el-upload-list--picture-card .el-upload-list__item {
  width: 30%;
  height: 105px;
  margin: 2% 1.6% 0 1.6%;
}

.img_box {
  /* width: 105px; */
  height: 105px;

  width: 30%;
  margin: 2% 1.6% 0 1.6%;

  /* margin-bottom: 16px; */
  float: left;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
}

.upload_img_item {
  width: 100%;
  height: 100%;
  border-top-right-radius: 6px;
}

.icon_success {
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
  -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
}

.icon_success i {
  color: #fff;
  font-size: 12px;
  margin-top: 11px;
  transform: rotate(-45deg);
}

.icon_box {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.img_box_icon {
  width: 100%;
  margin-top: 40%;
  text-align: center;
}

.img_box_icon i {
  color: #fff;
  font-size: 22px;
}

.img_box_icon i.icon_save {
  color: #ffd517;
}

/deep/ .disabled .el-upload--picture-card {
  display: none;
}

/deep/ .detail_con .el-upload--picture-card {
  /* width: 105px; */
  height: 105px;
  line-height: 105px;

  width: 30%;
  margin: 2% 1.6% 0 1.6%;
  /* margin: 0;
        margin-bottom: 16px; */

  background: rgba(251, 251, 251, 1);
  border-radius: 4px;
  border: 1px dashed #dedede;
  text-align: center;
}

/* 分页 */
.pager {
  height: 32px;
  text-align: right;
}

.up-report-bottom {
  text-align: center;
  margin: 20px;
}

/* 弹出框 */
.dialog_pic {
  flex-wrap: wrap;
  position: relative;
  span {
    width: 70px;
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }
  .el-input {
    width: auto;
  }
  /deep/ .el-select {
    width: 270px;
    height: 32px;
    .el-input__inner {
      height: 32px;
    }
  }
  /deep/ .el-cascader {
    width: 270px;
    height: 32px;
    line-height: 32px;
    .el-input__inner {
      height: 32px;
    }
    .el-input__suffix {
      height: 32px;
    }
  }
  /deep/ .el-button {
    margin-right: 5px;
  }
  /deep/ .el-dropdown .el-button {
    width: 94px;
  }
  /deep/ .resetBtn,
  /deep/ .batchBtn {
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
    }
  }
  /deep/ .batchBtn {
    margin-right: 0;
  }
}

.car-title {
  background: #e6f7ff;
  border: 1px solid #bae7ff;
  border-radius: 4px;
  margin: 16px 0;
  padding: 5px;
}

.car-title /deep/ .el-icon-info {
  margin-right: 4px;
}

.car-title h4 {
  font-size: 14px;
  display: inline-block;
}

.car-title em {
  font-size: 14px;
  font-weight: normal;
  margin: 0 6px;
  cursor: pointer;
  color: #1890ff;
}

.flex_box {
  display: flex;
  justify-content: flex-start;
  /* align-items: center; */
  margin-bottom: 16px;
}

.flex_box > span {
  width: 84px;
  text-align: right;
}

.flex_box .el-textarea {
  width: 280px;
}

.flex_box .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 280px;
}

.upload_border {
  width: 104px;
  height: 104px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
  /*border: 1px dashed rgba(0, 0, 0, 0.15);*/
  display: flex;
  line-height: 1;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
}

.upload_border .el-icon-plus {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.45);
}

.imgpain_box {
  height: 104px;
  overflow: hidden;
}

/deep/ .imgpain_box .el-upload--picture-card {
  border: 1px dashed #dedede;
  width: 104px;
  height: 104px;
  margin: 0;
}

/deep/ .imgpain_box .el-upload-list--picture-card .el-upload-list__item {
  width: 104px;
  height: 104px;
}

/deep/ .imgpain_box .el-upload-list__item.is-success {
  display: block;
}
/deep/ .imgpain_box .el-upload-list__item.is-1 {
  display: block;
}

/* 图片查看显示 */
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

.imgPreview .u-comment {
  margin-top: 20px;
  text-align: left;
}

.imgPreview .u-comment li {
  display: flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
  margin-top: 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.imgPreview .u-comment img {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.table-wrap img {
  width: 20px;
  height: 20px;
  position: relative;
  left: 4px;
  top: 6px;
}

/*换画详情弹框*/
.change-pic-detail-info h5 {
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
}

.change-pic-detail-info h5 span {
  display: inline-block;
  width: 44px;
  height: 18px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  text-align: center;
  line-height: 18px;
}

.change-pic-detail-info h5 span.a {
  background: rgba(230, 247, 255, 1);
  border: 1px solid rgba(145, 213, 255, 1);
  color: #1890ff;
}

.change-pic-detail-info p {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-bottom: 6px;
}

.change-pic-detail-info .divide {
  width: 100%;
  height: 1px;
  background: rgba(216, 216, 216, 1);
  margin: 24px 0;
}

/* 图片列表间距 */
@media all and (min-width: 1440px) {
  .imgs_point {
    margin: 16px -28px;
  }

  .point_item {
    margin: 0 28px 16px;
  }
}

@media all and (min-width: 1920px) {
  .imgs_point {
    margin: 16px -36px;
  }

  .point_item {
    margin: 0 36px 16px;
  }
  /* /deep/ .up-loader-header .el-input__inner {
            height: 32px;
            width: 312px;
        } */
}
.el-tooltip__popper.is-dark {
  max-width: 250px;
  word-break: break-all;
  word-wrap: break-word;
}

.change-pic-detail-modal /deep/ .el-dialog__body {
  padding: 5px 24px;
}
//换画框样式
/deep/ .change_pic_class {
  .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 24px;
  }
  .btn_wrapper {
    display: flex;
    justify-content: space-between;
    width: 156px;
    .el-button {
      margin: 0;
    }
  }
  .el-table--border td:first-child .cell {
    padding-left: 14px;
  }
  .table-wrap {
    .table_footer {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      margin-bottom: 24px;
      .marked_wrapper {
        display: flex;
        .marked_item {
          display: flex;
          align-items: center;
          margin-right: 16px;
          .marked_word {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.45);
            line-height: 32px;
            vertical-align: middle;
          }
          .marked_img {
            position: static;
            display: block;
            margin-right: 2px;
            height: 16px;
            width: 16px;
          }
        }
      }
      .ad_pagination {
        margin-top: 0;
        .el-pagination__editor {
          padding: 0;
        }
      }
    }
  }
  .el-dialog__body {
    padding: 0 24px;
  }
  .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    padding: 11px 0;
  }
}
</style>