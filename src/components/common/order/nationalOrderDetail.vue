<template>
  <!-- 全国单-详情 -->
  <div class="page_container">
    <div class="page_navigation">
      <p class="clearfix">
        <a href="#">全国单管理-详情</a>
      </p>
    </div>

    <div v-loading="pageLoading" class="page_content">
      <div class="page_content_top content_top_wrapper">
        <div class="title_box">
          <div class="text">{{ detailData.name }}</div>
          <div class="action_box">
            <!-- <el-button size="small" @click="handleTotalDynamic">全局动态</el-button> -->
            <!-- <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button> -->
            <!-- 更多操作下拉框 -->
            <!-- <el-dropdown>
              <el-button style="min-width: 32px"><i class="el-icon-more"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native.prevent="publishPlan">发布</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </div>
        </div>
        <!-- 消息提示 -->
        <!-- <CustomAlert text="最新动态：广州亲粤邻科技有限公司 刚刚 上传了小样"/> -->
        <div class="sub_title">基本信息</div>
        <div class="base_info_content">
          <el-row style="flex-wrap: wrap" :gutter="16" align="middle">

            <el-col class="gutter_row" :xs="24" :md="12" :lg="8" :xl="6">
              <div class="info_item">
                <div class="item_label">客户公司：</div>
                <div class="item_value">{{ detailData.customerCompanyName }}</div>
              </div>
            </el-col>

            <el-col class="gutter_row" :xs="24" :md="12" :lg="8" :xl="6">
              <div class="info_item">
                <div class="item_label">客户品牌：</div>
                <div class="item_value">{{ detailData.customerBrandName }}</div>
              </div>
            </el-col>

            <el-col class="gutter_row" :xs="24" :md="12" :lg="8" :xl="6">
              <div class="info_item">
                <div class="item_label">所属销售：</div>
                <div class="item_value">{{ detailData.applyName }}</div>
              </div>
            </el-col>

            <el-col class="gutter_row" :xs="24" :md="12" :lg="8" :xl="6">
              <div class="info_item">
                <div class="item_label">投放日期：</div>
                <div class="item_value">{{ detailData.startTime }} - {{ detailData.endTime }}</div>
              </div>
            </el-col>

            <el-col class="gutter_row" :xs="24" :md="12" :lg="8" :xl="6">
              <div class="info_item">
                <div class="item_label">投放城市：</div>
                <div class="item_value">
                  <span class="title">{{ detailData.launchCities }}</span>
                  <el-tooltip effect="dark" :content="detailData.launchCities" placement="top">
                    <i class="el-icon-info show_more_icon" style="margin-left: 5px"></i>
                  </el-tooltip>
                </div>
              </div>
            </el-col>

            <el-col class="gutter_row" :xs="24" :md="12" :lg="8" :xl="6">
              <div class="info_item">
                <div class="item_label">所属公司：</div>
                <div class="item_value">{{ detailData.applyCompanyName }}</div>
              </div>
            </el-col>

          </el-row>
        </div>
        <div class="card_footer">

          <el-button
            :disabled="!detailData.attachment.executeRequireFlag"
            type="text" icon="el-icon-circle-check" size="small" class="btn_box"
            @click="openViewFileModal(ResourceTypeEnum.EXECUTE_REQUIRE)"
          >
            执行要求{{ detailData.attachment.executeRequireFlag ? '' : '(未上传)' }}
          </el-button>

          <el-button
            :disabled="!detailData.attachment.resourceApplyFlag"
            type="text" icon="el-icon-circle-check" size="small" class="btn_box"
            @click="openViewFileModal(ResourceTypeEnum.RESOURCE_APPLY)"
          >
            资源申请表{{ detailData.attachment.resourceApplyFlag ? '' : '(未上传)' }}
          </el-button>

          <el-button
            :disabled="!detailData.attachment.auditCardFlag"
            type="text" icon="el-icon-circle-check" size="small" class="btn_box"
            @click="openViewFileModal(ResourceTypeEnum.AUDIT_CARD)"
          >
            审核卡{{ detailData.attachment.auditCardFlag ? '' : '(未上传)' }}
          </el-button>

          <el-button
            :disabled="!detailData.attachment.customerMaterialsFlag"
            type="text" icon="el-icon-circle-check" size="small" class="btn_box"
            @click="openViewFileModal(ResourceTypeEnum.CUSTOMER_MATERIALS)"
          >
            客户素材{{ detailData.attachment.customerMaterialsFlag ? '' : '(未上传)' }}
          </el-button>

          <el-button
            :disabled="!detailData.attachment.spaceFeedbackFlag"
            type="text" icon="el-icon-circle-check" size="small" class="btn_box"
            @click="openViewFileModal(ResourceTypeEnum.SPACE_FEEDBACK)"
          >
            客户点位反馈模板{{ detailData.attachment.spaceFeedbackFlag ? '' : '(未上传)' }}
          </el-button>

          <el-button
            :disabled="!detailData.attachment.skReportFlag"
            type="text" icon="el-icon-circle-check" size="small" class="btn_box"
            @click="openViewFileModal(ResourceTypeEnum.SK_REPORT)"
          >
            客户上刊报告模板{{ detailData.attachment.skReportFlag ? '' : '(未上传)' }}
          </el-button>

          <el-button
            :disabled="!detailData.attachment.skReportFlag"
            type="text" icon="el-icon-circle-check" size="small" class="btn_box"
            @click="openViewFileModal(ResourceTypeEnum.SK_DETAIL)"
          >
            上刊明细客户反馈模板{{ detailData.attachment.skDetailFlag ? '' : '(未上传)' }}
          </el-button>

          <el-button
            :disabled="!detailData.sendInfo"
            type="text" icon="el-icon-circle-check" size="small" class="btn_box"
            @click="handleClickSendInfo"
          >
            小样寄送信息
          </el-button>

        </div>

      </div>

      <!-- 换画 tab 标签 -->
      <div v-if="tabList.length > 1" class="tab_wrapper">
        <el-tabs v-model="activeTabKey">
          <el-tab-pane v-for="item in tabList" :key="item.value" :label="item.label" :name="item.value" ></el-tab-pane>
        </el-tabs>
      </div>

      <div class="node_content_wrapper">
        <el-row class="content_wrapper">
          <el-col :span="8" class="content_left">
            <el-tree
              v-if="this.treeData.length"
              :props="{
                label: 'title',
                children: 'children',
                isLeaf: 'isLeaf'
              }"
              :load="onTreeLoadData"
              lazy
              style="width: 100%"
              @node-click="onTreeSelect"
            >
              <div class="custom_tree_node" slot-scope="{ data }">
                <!-- {{ test(node, data) }} -->
                <div v-if="data.menuType === 1" class="menu_item">
                  <span>{{ data.title }}（{{ data.count }}）</span>
                  <!-- <el-badge type="danger" is-dot  /> -->
                </div>
                <div v-else class="sub_menu_item">
                  <span class="title" :title="data.title">{{ data.title }}</span>
                  <el-badge v-if="data.confirmFlag" type="danger" is-dot />
                  <span class="progress_text">进度 {{ data.process }}</span>
                </div>
              </div>
            </el-tree>
          </el-col>
          <el-col v-loading="nodeLoading" :span="16" class="content_right">
            <div class="company_name">{{ currentCompanyItem.companyName }}</div>
              <div class="list_box">
                <div
                  v-for="(item, index) in nodeDetailList"
                  :key="item.processDetailId"
                  class="cell_box"
                >
                  <div class="box_left">
                    <img
                      :src="require(`@/assets/images/nationalOrderDetail/${item.nodeCode}.png`)"
                      alt=""
                      class="img_icon"
                    />
                    <span>{{ item.nodeName }}</span>
                    <img
                      src="@/assets/images/nationalOrderDetail/time.png"
                      class="time_icon"
                      @click="handleNodeDynamic(item.processDetailId)"
                    />
                  </div>
                  <div class="box_right">
                    <template v-if="isAuth">
                      <!-- 1、 确认点位情况 -->
                      <template v-if="item.nodeCode === 'confirmSpace'">
                        <template v-if="item.status === 1">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'choosePoint')">
                              选择点位
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 2">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'viewPoint')">
                              查看点位
                            </div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'reject')">拒绝</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div> -->
                          </div>
                        </template>
                        <template v-else-if="item.status === 3">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'choosePoint')">
                              重选点位
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">
                              确认
                            </div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 4">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'viewPoint')">
                              查看点位
                            </div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'cancel')">
                              解除确认
                            </div> -->
                          </div>
                        </template>
                      </template>

                      <!-- 2、 三色 -->
                      <template v-if="item.nodeCode === 'threeColor'">
                        <template v-if="item.status === 1">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 2">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'reject')">拒绝</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div> -->
                          </div>
                        </template>
                        <template v-else-if="item.status === 3">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">
                              确认
                            </div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 4">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'cancel')">
                              解除确认
                            </div> -->
                          </div>
                        </template>
                      </template>

                      <!-- 3、 出血 -->
                      <template v-if="item.nodeCode === 'bleedPic'">
                        <template v-if="item.status === 1">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 2">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'reject')">拒绝</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div> -->
                          </div>
                        </template>
                        <template v-else-if="item.status === 3">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">
                              确认
                            </div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 4">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'cancel')">
                              解除确认
                            </div> -->
                          </div>
                        </template>
                      </template>

                      <!-- 4、 点位反馈 -->
                      <template v-if="item.nodeCode === 'spaceFeedback'">
                        <div class="btn_group">
                          <div
                            v-if="detailData.lockPointFormType === 2"
                            class="btn_box"
                            @click="openViewFileModal(ResourceTypeEnum.SPACE_FEEDBACK)"
                          >
                            下载客户模板
                          </div>
                          <div class="btn_box" @click="handleClickChoosePointRule">选点要求</div>
                        </div>
                        <template v-if="item.status === 1">
                          <div class="btn_group">
                            <div v-if="item.fileList && item.fileList.length" class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 2">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'reject')">拒绝</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div> -->
                          </div>
                        </template>
                        <template v-else-if="item.status === 3">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">
                              确认
                            </div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 4">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'cancel')">
                              解除确认
                            </div> -->
                          </div>
                        </template>
                      </template>

                      <!-- 5、 上刊报告 -->
                      <template v-if="item.nodeCode === 'skReport'">
                        <div
                          v-if="detailData.skFormType === 2"
                          class="btn_group"
                        >
                          <div class="btn_box" @click="openViewFileModal(ResourceTypeEnum.SK_REPORT)">
                            下载客户模板
                          </div>
                        </div>
                        <template v-if="item.status === 1">
                          <div class="btn_group">
                            <div v-if="item.fileList && item.fileList.length" class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 2">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'reject')">拒绝</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div> -->
                          </div>
                        </template>
                        <template v-else-if="item.status === 3">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">
                              确认
                            </div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 4">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'cancel')">
                              解除确认
                            </div> -->
                          </div>
                        </template>
                      </template>

                      <!-- 6、 上刊明细 -->
                      <template v-if="item.nodeCode === 'skDetail'">
                        <div
                          v-if="detailData.skDetailFormType === 2"
                          class="btn_group"
                        >
                          <div class="btn_box" @click="openViewFileModal(ResourceTypeEnum.SK_DETAIL)">
                            下载客户模板
                          </div>
                        </div>
                        <template v-if="item.status === 1">
                          <div class="btn_group">
                            <div v-if="item.fileList && item.fileList.length" class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 2">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'reject')">拒绝</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div> -->
                          </div>
                        </template>
                        <template v-else-if="item.status === 3">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">
                              确认
                            </div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 4">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'cancel')">
                              解除确认
                            </div> -->
                          </div>
                        </template>
                      </template>

                      <!-- 7、 下单表 -->
                      <template v-if="item.nodeCode === 'orderForm'">
                        <template v-if="item.status === 1">
                          <div class="btn_group">
                            <div v-if="item.fileList && item.fileList.length" class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 2">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'reject')">拒绝</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div> -->
                          </div>
                        </template>
                        <template v-else-if="item.status === 3">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">
                              确认
                            </div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 4">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'cancel')">
                              解除确认
                            </div> -->
                          </div>
                        </template>
                      </template>

                      <!-- 8、 上传精美图片 -->
                      <template v-if="item.nodeCode === 'exquisitePic'">
                        <template v-if="item.status === 1">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 2">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'reject')">拒绝</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">确认</div> -->
                          </div>
                        </template>
                        <template v-else-if="item.status === 3">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <div class="btn_box" @click="handleNodeAction(item, 'upload')">
                              {{ item.fileList && item.fileList.length ? '修改' : '上传' }}
                            </div>
                            <div class="btn_box" @click="handleNodeAction(item, 'confirm')">
                              确认
                            </div>
                          </div>
                        </template>
                        <template v-else-if="item.status === 4">
                          <div class="btn_group">
                            <div class="btn_box" @click="handleNodeAction(item, 'view')">查看</div>
                            <!-- <div class="btn_box" @click="handleNodeAction(item, 'cancel')">
                              解除确认
                            </div> -->
                          </div>
                        </template>
                      </template>
                    </template>
                    <PointState :state-text="item.statusText" :color="item.statusColor" class="status_box"/>
                    <i
                      v-if="item.status === 3 && isAuth"
                      class="el-icon-warning-outline reject_icon"
                      @click="showRejectMsg(item)"
                    ></i>
                  </div>
                </div>
              </div>
          </el-col>
        </el-row>
      </div>

    </div>

    <!-- 上传文件-弹框组件 -->
    <UploadFileDialog
      :title="uploadFileData.title"
      :uploadUrl="uploadFileData.uploadUrl"
      :multiple="uploadFileData.multiple"
      :disabled="uploadFileData.disabled"
      :accept="uploadFileData.accept"
      name="file"
      ref="uploadFileDialogRef"
      @confirm="saveUploadNodeFiles"
    />

    <!-- 查看已上传的文件-弹框组件 -->
    <ViewFileDialog ref="viewFileDialogRef" />

    <!-- 上传图片/视频文件-弹框组件 -->
    <UploadPictureVideoDialog
      :title="uploadPictureVideoModalData.title"
      :isShowVideo="uploadPictureVideoModalData.isShowVideo"
      :canUpload="uploadPictureVideoModalData.canUpload"
      :canMarkImage="uploadPictureVideoModalData.canMarkImage"
      :isShowRejectExpand="uploadPictureVideoModalData.isShowRejectExpand"
      :isEditRejectExpand="uploadPictureVideoModalData.isEditRejectExpand"
      :isShowColor="uploadPictureVideoModalData.isShowColor"
      :canEditColor="uploadPictureVideoModalData.canEditColor"
      :showFooter="uploadPictureVideoModalData.showFooter"
      ref="uploadPictureVideoDialogRef"
      @submitSuccess="getNodeDetail"
    />

    <!-- 动态列表-弹框组件 -->
    <DynamicListDialog ref="dynamicListDialogRef" />

    <!-- 查看点位-弹框组件 -->
    <ViewPointDialog ref="viewPointDialogRef" />

  </div>
</template>

<script>
import sessFun from "@/commonFun/sessFun.js";
import CustomAlert from '@/components/common/components/customAlert.vue'
import PointState from '@/components/common/components/pointState.vue';
import UploadFileDialog from './components/uploadFileDialog.vue'
import ViewFileDialog from './components/viewFileDialog.vue'
import UploadPictureVideoDialog from './components/uploadPictureVideoDialog.vue'
import DynamicListDialog from './components/dynamicListDialog.vue'
import ViewPointDialog from './components/viewPointDialog.vue'
import { deserialize, getUniqueId, previewFile } from '@/utils/common'
import { ResourceTypeEnum } from './data'

// 状态显示枚举:1.确认,2.待确认,3.拒绝(回到确认),4.已完成
const statusOptions = [
  { label: '未上传', value: 1, color: '#D8D8D8' },
  { label: '待确认', value: 2, color: '#FAAD14' },
  { label: '已拒绝', value: 3, color: '#F5222D' },
  { label: '已完成', value: 4, color: '#52C41A' }
]

const initUploadFileData = () => ({
  title: '',
  uploadUrl: '/addsp/resource/upload',
  multiple: false,
  disabled: false,
  accept: ''
})

const initUploadPictureVideoModalData = () => ({
  title: '',
  isShowVideo: false,
  canUpload: false,
  canMarkImage: false,
  isShowRejectExpand: false,
  isEditRejectExpand: false,
  isShowColor: false,
  canEditColor: false,
  showFooter: false
})

export default {
  name: "nationalOrderDetail",
  components: {
    CustomAlert,
    PointState,
    UploadFileDialog,
    ViewFileDialog,
    UploadPictureVideoDialog,
    DynamicListDialog,
    ViewPointDialog
  },
  data () {
    return {
      pageLoading: false,
      nodeLoading: false,
      // 登录信息
      sessionData: {},
      ResourceTypeEnum,
      // 预加载数据
      // preparedData: {},
      statusColorObj: {
        '已处理': 'rgba(82,196,26,1)',
        '未处理': 'rgba(250,173,20,1)',
      },
      tabList: [],
      treeData: [],
      activeTabKey: null,
      // 当前选中的公司
      currentCompanyItem: {
        companyName: '',
        processCompanyId: null
      },
      // 当前选中的节点
      currentNodeItem: {
        processDetailId: null,
        nodeCode: '',
        status: null
      },
      // 节点列表数据
      /*
      确认点位情况        confirmSpace
      三色        threeColor
      出血        bleedPic
      点位反馈        spaceFeedback
      上刊报告        skReport
      上刊明细        skDetail
      下单表        orderForm
      上传精美图片        exquisitePic
      */
      nodeDetailList: [],
      uploadFileData: initUploadFileData(),
      uploadPictureVideoModalData: initUploadPictureVideoModalData(),
      // 详情数据
      detailData: {
        id: null,
        // 项目名称
        name: '',
        // 客户公司
        customerCompanyId: null,
        customerCompanyName: '',
        // 客户品牌
        customerBrandId: null,
        customerBrandName: '',
        // 所属销售
        applyBy: null,
        applyName: '',
        followBy: null,
        applyCityName: '',
        followName: '',
        // 投放开始时间
        startTime: '',
        // 投放结束时间
        endTime: '',
        // 所属公司
        applyCompanyId: null,
        applyCompanyName: '',
        applyCity: null,
        feedbackTime: '',
        isPreSk: null,
        isLock: null,
        saleMode: null,
        specification: '',
        lockPointFormType: null,
        skFormType: null,
        skDetailFormType: null,
        // 状态:1.对接中,2.投放中,3.已终止,4.已完成
        status: null,
        sendInfo: '',
        // 创建时间
        createTime: '',
        attachment: {
          // 执行要求
          executeRequireFlag: false,
          // 资源申请表
          resourceApplyFlag: false,
          // 审核卡
          auditCardFlag: false,
          // 客户素材
          customerMaterialsFlag: false,
          // 客户点位反馈模板
          spaceFeedbackFlag: false,
          // 客户上刊报告模板
          skReportFlag: false,
          // 客户上刊明细模板
          skDetailFlag: false
        },
        // 投放城市
        launchCities: '',
        // 最新动态
        latestOperate: '',
        // 流程列表
        processList: [],
        // 节点列表
        nodeList: [],
        // 公司详情
        companyList: []
      }
    };
  },
  computed: {
    // 地方媒介只能查看自己公司的数据
    isAuth() {
      return Number(this.sessionData.asrID) === this.currentCompanyItem.companyId
    }
  },
  methods: {
    /**
     * 显示拒绝原因
     */
    showRejectMsg(item) {
      // 图片直接打开弹框
      if (['threeColor'].includes(item.nodeCode)) {
        this.openUploadPictureVideoModal(item, {
          title: '拒绝原因',
          isShowVideo: true,
          isShowRejectExpand: true,
          isShowColor: true
        })
      } else if (['bleedPic', 'exquisitePic'].includes(item.nodeCode)) {
        this.openUploadPictureVideoModal(item, {
          title: '拒绝原因',
          isShowRejectExpand: true
        })
      } else {
        this.$alert(item.rejectExpand, '拒绝原因')
      }
    },
    /**
     * 跳转到选择点位页面
     */
    async goChoosePointPage() {
      try {
        this.nodeLoading = true
        // 创建计划后，后台会同步创建方案。方案跟公司绑定，先获取方案列表数据
        const { adPlanId: apID } = this.currentCompanyItem
        if (!apID) throw new Error('获取方案数据失败: 参数 adPlanId 缺失')
        const { uID: uid, token } = this.sessionData
        const res = await this.$api.advertisement.getProposal({ uid, token, start: 1, pagesize: 999, apID })
        if (!res.data || !res.data.list.length) throw new Error('获取方案数据失败')
        const row = res.data.list[0]
        // 以下逻辑参考 /planList 页面
        row.details.sort((a, b) => {
          return a.asrID - b.asrID;
        });
        let asrIDarr = [];
        for (let data of row.details) {
          data.apState = row.apState; //新增字段,判断是否是意向方案,点位面数显示为--
          if (asrIDarr.includes(data.asrID)) {
            data.isshow = 0;
          } else {
            asrIDarr.push(data.asrID);
            data.isshow = 1;
          }
        }
        row.cityArea = row.details;
        sessionStorage.setItem("plan_apid", row.apID);
        sessionStorage.setItem("cityArea", JSON.stringify(row.cityArea));
        if (row.apState == -1) {
          // 未配点意向方案详情
          this.$router.push("./planEmptyPointDetail");
        } else if (row.planMode == 1) {
          // 已配点意向方案
          this.$router.push("./planDetail");
        } else {
          this.$router.push("./planDetail");
        }
      } catch (err) {
        console.error('goChoosePointPage error: ', err)
        this.$message.error(err || '操作失败')
      } finally {
        this.nodeLoading = false
      }
    },
    /**
     * 保存上传节点文件(url)
     */
    async saveUploadNodeFiles(list, videoUrl = '') {
      try {
        const res = await this.$api.resource.uploadNodeFiles({
          processDetailId: this.currentNodeItem.processDetailId,
          urls: list,
          videoUrl
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '保存数据失败')
        this.$message.success('提交成功')
        this.getNodeDetail()
      } catch (err) {
        console.error('uploadNodeFiles error:', err)
      }
    },
    /**
     * 打开图片视频弹框
     */
    openUploadPictureVideoModal(item, options) {
      this.uploadPictureVideoModalData = {
        ...initUploadPictureVideoModalData(),
        ...options
      }
      this.$refs.uploadPictureVideoDialogRef && this.$refs.uploadPictureVideoDialogRef.open(item)
    },
    /**
     * 打开上传弹框
     */
    openUploadFileModal(title, accept, multiple) {
      this.uploadFileData = {
        ...initUploadFileData(),
        title: title || '上传文件',
        accept: accept || '',
        multiple: multiple || false
      }
      this.$refs.uploadFileDialogRef && this.$refs.uploadFileDialogRef.open()
    },
    /**
     * 全局动态记录
     */
     handleTotalDynamic() {
      this.$refs.dynamicListDialogRef.open({
        resourceId: this.detailData.id
      })
    },
    /**
     * 节点动态记录
     */
    handleNodeDynamic(processDetailId) {
      this.$refs.dynamicListDialogRef.open({
        resourceId: this.detailData.id,
        processDetailId
      })
    },
    /**
     * 小样寄送信息
     */
    handleClickSendInfo() {
      const { sendInfo } = this.detailData
      if (!sendInfo) return
      this.$alert(sendInfo, '小样寄送信息')
    },
    /**
     * 选点要求
     */
    handleClickChoosePointRule() {
      const { specification } = this.detailData
      if (!specification) return this.$message.warning('暂无选点要求')
      this.$alert(specification, '选点要求')
    },
    /**
     * 打开已上传文件弹框
     */
    openViewFileModal(resourceType) {
      const { id: resourceId } = this.detailData
      if (!resourceId) return
      this.$refs.viewFileDialogRef && this.$refs.viewFileDialogRef.open({ resourceId, resourceType })
    },
    /**
     * 获取节点列表
     */
    async getNodeDetail() {
      try {
        this.nodeLoading = true
        const res = await this.$api.resource.getNodeDetail({
          processCompanyId: this.currentCompanyItem.processCompanyId
        })
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取节点列表数据失败')
        this.nodeDetailList = data.map((item) => {
          // 处理状态显示
          const { label: statusText, color: statusColor } =
            statusOptions.find((option) => option.value === item.status) || {}
          return {
            ...item,
            statusText,
            statusColor
          }
        })
      } catch (err) {
        console.error('getNodeDetail error:', err)
      } finally {
        this.nodeLoading = false
      }
    },
    /**
     * 点击树形
     */
    onTreeSelect(data, node) {
      // 地方媒介只能查看自己公司的数据
      if (data.menuType === 2) {
        this.currentCompanyItem = data
        this.getNodeDetail()
      }
    },
    /**
     * 懒加载树形公司列表数据
     */
    async onTreeLoadData (node, resolve) {
        if (node.level === 0) {
          return resolve(this.treeData);
        }
        const { children, menuType, id: nodeId, code: key } = node.data
        // if (children && children.length) return resolve()
        if (menuType !== 1) return resolve([])
        const status = key === 'all' ? null : key === 'finished' ?  1 : 0
        const res = await this.$api.resource.listProcessCompanies({
          status,
          nodeId,
          processId: this.activeTabKey
        })
        const { SysCode: code, MSG: message, data = [] } = res.data || {}
        if (code !== 200200) throw new Error(message || '获取详情数据失败')
        const list = data.map((item) => {
          return {
            ...item,
            title: item.companyName,
            key: getUniqueId(),
            menuType: 2,
            isLeaf: true
          }
        })
        resolve(list)
    },
    /**
     * 获取详情
     */
    async getDetail() {
      try {
        const { id = null } = this.$route.query
        if (!id) return this.$message.error('获取详情数据失败，参数缺失')
        this.pageLoading = true
        const res = await this.$api.resource.getById({ id })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取详情数据失败')
        this.detailData = data
        // Object.assign(detailData, res.data)
        // 处理-左侧树形菜单
        const { nodeList, processList } = data
        const newNodeList = nodeList.map(item => {
          return {
            ...item,
            key: `0_${item.id}`,
            title: `未完成${item.name}`,
            menuType: 1,
            children: [],
            count: 0,
            isLeaf: false
          }
        })
        this.treeData = [
          { title: '全部', key: '-1', code: 'all', id: null, menuType: 1, children: [], count: 0, isLeaf: false },
          { title: '已完成', key: '1', code: 'finished', id: null, menuType: 1, children: [], count: 0, isLeaf: false },
          ...newNodeList
        ]
        // 处理-换画标签 tab，存在2个及以上才显示
        this.tabList = processList.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })
        this.activeTabKey = this.tabList[0].value
      } catch (err) {
        console.error('getDetail error:', err)
        this.$message.error(String(err) || '获取详情数据失败')
      } finally {
        this.pageLoading = false
      }
    },
    /**
     * 统计流程公司数据
     */
     async getCountProcessCompanies() {
      try {
        const res = await this.$api.resource.countProcessCompanies({
          processId: this.activeTabKey
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '获取统计流程公司数据失败')
        // data 是一个对象，key 是 `${status}_${nodeId}`，全部key -1， 已完成 1
        this.treeData.forEach((item) => {
          item.count = data[item.key] || 0
        })
      } catch (err) {
        console.error('getCountProcessCompanies error:', err)
      }
    },
    /**
     * 刷新详情和公司统计数据
     */
    async refreshDetail() {
      // 先获取到流程 id
      await this.getDetail()
      // 获取公司统计数据
      await this.getCountProcessCompanies()
    },
    /**
     * 发布
     */
    publishPlan () {
      // console.log('publishPlan ====')
    },
    /**
     * 确认上传/确认选点（地方媒介）
     */
    async handleConfirmUpload(item) {
      try {
        await this.$confirm('确认执行操作？', '温馨提示')
        this.nodeLoading = true
        const res = await this.$api.resource.confirm({
          processDetailId: item.processDetailId,
          // 地方媒介不需要确认选择颜色
          color: ''
        })
        const { SysCode: code, MSG: message, data } = res.data || {}
        if (code !== 200200) return this.$message.error(message || '操作失败')
        this.$message.success('操作成功')
        this.getNodeDetail()
      } catch (err) {
        console.error('handleConfirmUpload error:', err)
      } finally {
        this.nodeLoading = false
      }
    },
    /**
     * 处理节点按钮操作
     */
    handleNodeAction(item, buttonName) {
      this.currentNodeItem = item
      const handleObj = {
        // 1、 确认点位情况
        confirmSpace: () => {
          switch (item.status) {
            // 待上传
            case 1:
              if (buttonName === 'choosePoint') {
                this.goChoosePointPage()
                return
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 待确认
            case 2:
              if (buttonName === 'viewPoint') {
                this.goChoosePointPage()
                return
              }
              // if (buttonName === 'reject') {
              //   return handleReject(item)
              // }
              // if (buttonName === 'confirm') {
              //   return handleToConfirm(item)
              // }
              break
            // 已拒绝
            case 3:
              if (buttonName === 'choosePoint') {
                this.goChoosePointPage()
                return
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 已完成
            case 4:
              if (buttonName === 'viewPoint') {
                this.goChoosePointPage()
                return
              }
              // if (buttonName === 'cancel') {
              //   return handleCancelConfirm(item)
              // }
              break
            default:
          }
        },
        // 2、 三色
        threeColor: () => {
          switch (item.status) {
            // 待上传
            case 1:
              if (buttonName === 'upload') {
                this.openUploadPictureVideoModal(item, {
                  title: '上传三色文件',
                  isShowVideo: true,
                  canUpload: true,
                  showFooter: true
                })
                return
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 待确认
            case 2:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                this.openUploadPictureVideoModal(item, {
                  title: '查看三色文件',
                  isShowVideo: true
                })
                return
              }
              // if (buttonName === 'reject') {
              //   return rejectThreeColor(item)
              // }
              // if (buttonName === 'confirm') {
              //   return handleToConfirm(item)
              // }
              break
            // 已拒绝
            case 3:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                this.openUploadPictureVideoModal(item, {
                  title: '查看三色文件',
                  isShowVideo: true,
                  isShowRejectExpand: true,
                  isShowColor: true
                })
                return
              }
              if (buttonName === 'upload') {
                this.openUploadPictureVideoModal(item, {
                  title: '上传三色文件',
                  isShowVideo: true,
                  canUpload: true,
                  showFooter: true
                })
                return
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 已完成
            case 4:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                this.openUploadPictureVideoModal(item, {
                  title: '查看三色文件',
                  isShowVideo: true,
                  isShowColor: true
                })
                return
              }
              // if (buttonName === 'cancel') {
              //   return handleCancelConfirm(item)
              // }
              break
            default:
          }
        },
        // 3、 出血
        bleedPic: () => {
          switch (item.status) {
            // 待上传
            case 1:
              if (buttonName === 'upload') {
                this.openUploadPictureVideoModal(item, {
                  title: '上传出血图片',
                  canUpload: true,
                  showFooter: true
                })
                return
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 待确认
            case 2:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                this.openUploadPictureVideoModal(item, {
                  title: '查看出血图片'
                })
                return
              }
              // if (buttonName === 'reject') {
              //   return rejectThreeColor(item)
              // }
              // if (buttonName === 'confirm') {
              //   return handleToConfirm(item)
              // }
              break
            // 已拒绝
            case 3:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                this.openUploadPictureVideoModal(item, {
                  title: '查看出血图片',
                  isShowRejectExpand: true
                })
                return
              }
              if (buttonName === 'upload') {
                this.openUploadPictureVideoModal(item, {
                  title: '上传出血图片',
                  canUpload: true,
                  showFooter: true
                })
                return
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 已完成
            case 4:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                this.openUploadPictureVideoModal(item, {
                  title: '查看出血图片'
                })
                return
              }
              // if (buttonName === 'cancel') {
              //   return handleCancelConfirm(item)
              // }
              break
            default:
          }
        },
        // 4、 点位反馈
        spaceFeedback: () => {
          switch (item.status) {
            // 待上传
            case 1:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              if (buttonName === 'upload') {
                return this.openUploadFileModal('上传点位反馈', '.xls,.xlsx')
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 待确认
            case 2:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'reject') {
              //   return rejectThreeColor(item)
              // }
              // if (buttonName === 'confirm') {
              //   return handleToConfirm(item)
              // }
              break
            // 已拒绝
            case 3:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              if (buttonName === 'upload') {
                return this.openUploadFileModal('上传点位反馈', '.xls,.xlsx')
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 已完成
            case 4:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'cancel') {
              //   return handleCancelConfirm(item)
              // }
              break
            default:
          }
        },
        // 5、 上刊报告
        skReport: () => {
          switch (item.status) {
            // 待上传
            case 1:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              if (buttonName === 'upload') {
                return this.openUploadFileModal('上传上刊报告', '.ppt,.pptx')
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 待确认
            case 2:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'reject') {
              //   return rejectThreeColor(item)
              // }
              // if (buttonName === 'confirm') {
              //   return handleToConfirm(item)
              // }
              break
            // 已拒绝
            case 3:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              if (buttonName === 'upload') {
                return this.openUploadFileModal('上传上刊报告', '.ppt,.pptx')
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 已完成
            case 4:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'cancel') {
              //   return handleCancelConfirm(item)
              // }
              break
            default:
          }
        },
        // 6、 上刊明细
        skDetail: () => {
          switch (item.status) {
            // 待上传
            case 1:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              if (buttonName === 'upload') {
                return this.openUploadFileModal('上传上刊明细', '.xls,.xlsx')
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 待确认
            case 2:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'reject') {
              //   return rejectThreeColor(item)
              // }
              // if (buttonName === 'confirm') {
              //   return handleToConfirm(item)
              // }
              break
            // 已拒绝
            case 3:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              if (buttonName === 'upload') {
                return this.openUploadFileModal('上传上刊明细', '.xls,.xlsx')
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 已完成
            case 4:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'cancel') {
              //   return handleCancelConfirm(item)
              // }
              break
            default:
          }
        },
        // 7、 下单表
        orderForm: () => {
          switch (item.status) {
            // 待上传
            case 1:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              if (buttonName === 'upload') {
                return this.openUploadFileModal('上传下单表', '.pdf')
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 待确认
            case 2:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'reject') {
              //   return rejectThreeColor(item)
              // }
              // if (buttonName === 'confirm') {
              //   return handleToConfirm(item)
              // }
              break
            // 已拒绝
            case 3:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              if (buttonName === 'upload') {
                return this.openUploadFileModal('上传下单表', '.pdf')
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 已完成
            case 4:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'cancel') {
              //   return handleCancelConfirm(item)
              // }
              break
            default:
          }
        },
        // 8、 上传精美图片
        exquisitePic: () => {
          switch (item.status) {
            // 待上传
            case 1:
              if (buttonName === 'upload') {
                this.openUploadPictureVideoModal(item, {
                  title: '上传精美图片',
                  canUpload: true,
                  showFooter: true
                })
                return
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 待确认
            case 2:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'reject') {
              //   return rejectThreeColor(item)
              // }
              // if (buttonName === 'confirm') {
              //   return handleToConfirm(item)
              // }
              break
            // 已拒绝
            case 3:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                this.openUploadPictureVideoModal(item, {
                  title: '查看精美图片',
                  isShowRejectExpand: true
                })
                return
              }
              if (buttonName === 'upload') {
                this.openUploadPictureVideoModal(item, {
                  title: '上传精美图片',
                  canUpload: true,
                  showFooter: true
                })
                return
              }
              if (buttonName === 'confirm') {
                return this.handleConfirmUpload(item)
              }
              break
            // 已完成
            case 4:
              if (buttonName === 'view') {
                if (!item.fileList.length) return this.$message.warning('文件未上传')
                previewFile(item.fileList[0].url)
                return
              }
              // if (buttonName === 'cancel') {
              //   return handleCancelConfirm(item)
              // }
              break
            default:
          }
        }
      }
      if (item.nodeCode in handleObj) handleObj[item.nodeCode]()
    }
  },
  async mounted () {
    this.sessionData = sessFun.getSess();
    this.refreshDetail()
  },
};
</script>

<style scoped lang="scss">

.content_top_wrapper {
  padding: 24px 32px 13px;
  position: relative;
  margin-bottom: 24px;
}

.title_box {
  display: flex;
  margin-bottom: 14px;
  .text {
    flex: 1;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.85);
    font-family: Roboto;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
  }
  .action_box {
    margin-left: 20px;
  }
}

.sub_title {
  color: rgba(0, 0, 0, 0.85);
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  margin: 8px 0;
}

.base_info_content {
  margin-bottom: 20px;
  .info_item {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.85);
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 8px;
  }
  .item_label {
    font-weight: 600;
    white-space: nowrap;
  }
  .item_value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    .title {
      max-width: calc(100% - 20px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
    }
  }
  .show_more_icon {
    color: #999;
    cursor: pointer;
  }
}

.card_footer {
  border-top: 1px solid #e8e8e8;
  padding-top: 13px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .btn_box {
    // color: #1890FF;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    // line-height: 22px;
    white-space: nowrap;
    // cursor: pointer;
    min-width: 0px;
    & + .btn_box {
      margin-left: 20px;
    }
    &.disabled {
      color: rgba(0, 0, 0, 0.45);
      cursor: default;
    }
  }
}

.tab_wrapper {
  background: #fff;
  margin-bottom: 24px;
  padding: 0 32px;
  border: 1px solid #ebebeb;
  /deep/ .el-tabs__header {
    margin: 0;
    border-color: transparent;
  }
  /deep/ .el-tabs__nav-wrap::after {
    background-color: transparent;
  }
  /deep/ .el-tabs__item {
    height: 56px;
    line-height: 56px;
  }
}

.node_content_wrapper {
  background: #fff;
  padding: 24px 32px;
  border: 1px solid #ebebeb;
}

.content_wrapper {
  height: calc(80vh - 130px);
  .content_left {
    height: 100%;
    border-right: 1px solid #e9e9e9;
    overflow: auto;
    .custom_tree_node {
      flex: 1;
      overflow: hidden;
      display: flex;
      align-items: center;
      position: relative;
    }
    /deep/ .el-badge {
      display: flex;
      align-items: center;
    }
    /deep/ .el-tree-node__content {
      height: 40px !important;
      box-sizing: border-box;
      width: 100%;
      font-size: 14px;
    }
    // 右侧小方块
    .custom_tree_node .sub_menu_item::before {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      right: 0;
      width: 3px;
      height: 0px;
      background: #1890ff;
      transform: translateY(-50%);
      z-index: 10;
    }
    .el-tree-node.is-current.is-focusable > .el-tree-node__content .sub_menu_item::before {
      transition: height 0.15s ease-out;
      height: 40px;
    }
    .menu_item {
      line-height: 40px;
      color: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      box-sizing: border-box;
    }
    .sub_menu_item {
      width: 100%;
      padding-right: 20px;
      line-height: 40px;
      color: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .title {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .progress_text {
        color: rgba(0, 0, 0, 0.45);
        margin-left: 10px;
      }
    }
  }
  .content_right {
    padding-left: 40px;
    padding-right: 19px;
    overflow: hidden auto;
    height: 100%;
    .company_name {
      color: rgba(0, 0, 0, 0.85);
      font-family: PingFang SC;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .list_box {
      .cell_box {
        height: 66px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e9e9e9;
        position: relative;
        &:last-child {
          border: 0;
        }
        .box_left {
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.85);
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: 600;
          line-height: 22px;
        }
        .time_icon {
          width: 20px;
          height: 20px;
          margin-left: 5px;
          cursor: pointer;
        }
        .img_icon {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
        .box_right {
          display: flex;
          align-items: center;
        }
        .btn_group {
          display: flex;
          align-items: center;
          border-right: 1px solid #e9e9e9;
          padding: 0 16px;
        }
        .btn_box {
          color: #1890ff;
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          white-space: nowrap;
          user-select: none;
          cursor: pointer;
          & + .btn_box {
            margin-left: 16px;
          }
        }
      }
    }
  }
}

.status_box {
  margin-left: 16px;
  margin-right: 23px;
}
.reject_icon {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  font-size: 16px;
  color: #ccc;
  cursor: pointer;
}
</style>
