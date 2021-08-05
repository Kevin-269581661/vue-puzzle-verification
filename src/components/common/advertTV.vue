<template>
    <div class="ad_mediaMana_wrap advertTV">
        <div class="ad_mediaMana_nav clearfix">
            <p><a href="#">电视广告</a><em> / </em><a href="#">创建方案</a></p>
        </div>
        <div class="mediaMana_content_top">
            <div class="content_top_wrap">
                <div class="step-wrap">
                    <el-steps :active="active" finish-status="success">
                        <el-step title="填写基本信息"></el-step>
                        <el-step title="完善媒体策略"></el-step>
                        <el-step title="上传物料"></el-step>
                        <el-step title="完成"></el-step>
                    </el-steps>
                </div>
                <!--填写基本信息-->
                <div class="step1" v-if="active==0">
                    <div class="AdTVBasic">
                        <el-form :model="basicForm" status-icon :rules="basicDataRules" ref="basicForm" label-width="100px"
                                 class="AdTVBasicForm">
                            <el-form-item label="方案名称：" prop="planName">
                                <el-input v-model="basicForm.planName" placeholder="请输入方案名称"></el-input>
                            </el-form-item>
                            <el-form-item label="所属销售：" prop="ownerSales">
                                <el-input v-if="isBD" v-model="basicForm.ownerSales" disabled></el-input>
                                <!--BDData.realName-->
                                <el-autocomplete
                                    v-else
                                    v-model="basicForm.ownerSales"
                                    :fetch-suggestions="querySearchAsync"
                                    placeholder="请输入账号"
                                >
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="公司名称：" prop="companyName">
                                <el-select v-model="basicForm.companyName" @change="GetBrandByCid" placeholder="请选择公司名称">
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
                                <el-select v-model="basicForm.companyBrand" placeholder="请选择公司品牌">
                                    <el-option
                                        v-for="item in companyBrand"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系人：" prop="ownerBU">
                                <el-select v-model="basicForm.ownerBU" placeholder="请选择所属联系人">
                                    <el-option
                                        v-for="item in ownerBU"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="营业执照：" prop="BusinessLicense"><!--https://jsonplaceholder.typicode.com/posts/-->
                                <el-upload
                                    action="/QinlinKuyun-API/UploadServlet?type=0"
                                    :limit = '1'
                                    class="Business-uploader"
                                    list-type="picture-card"
                                    :file-list="basicForm.BusinessLicense"
                                    :on-success="handleAvatarSuccess"
                                    :on-preview="handlePictureCardPreview"
                                    :before-upload="beforeAvatarUpload"
                                    :on-remove="handleRemove"><!-- :data="imageParams"-->
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="imageUrlVisible">
                                    <img width="100%" :src="imageUrl" alt="">
                                </el-dialog>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <!--完善媒体策略-->
                <div class="step2" v-if="active==1">
                    <div class="AdTV_mediaStrategy">
                        <el-form :model="mediaStrategyForm" status-icon :rules="mediaStrategyRules" ref="mediaStrategyForm" label-width="100px"
                                 class="AdTVMSFrom">
                            <el-form-item label="起止时间：" prop="dateTime">
                                <el-date-picker
                                    v-model="mediaStrategyForm.dateTime"
                                    type="daterange"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    value-format="yyyy-MM-dd"
                                    @change="changeDateTime"
                                    class="date-select input-with-select"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="选择点位：" prop="ads">
                                <ul class="step2_ul">
                                    <li>
                                        <el-button type="primary" icon="el-icon-menu" @click="selectPlan">选择方案</el-button>
                                        <!--<el-tag type="info" closable>方案名称：碧桂园太东公园上城</el-tag>-->
                                        <el-tag
                                            :key="tag"
                                            v-for="tag in apNameTags"
                                            type="info"
                                            closable
                                            :disable-transitions="false"
                                            @close="apTabCloseFun(tag)"><!--@close="apTabCloseFun(tag)"-->
                                            方案名称:{{tag}}
                                        </el-tag>
                                    </li>
                                    <li class="fileUploadLi">
                                       <!-- https://jsonplaceholder.typicode.com/posts/ https://jsonplaceholder.typicode.com/posts/-->
                                        <el-button icon="el-icon-upload2" type="primary" @click="uploadExcel">
                                            上传文件
                                        </el-button>
                                        <el-upload
                                            class="excelUpload"
                                            ref="upload"
                                            action="https://jsonplaceholder.typicode.com/posts/"
                                            :show-file-list="false"
                                            :on-change="readExcel"
                                            :auto-upload="false"
                                            :multiple="false"
                                            style="display: none">
                                            <el-button icon="el-icon-upload2" type="primary" @click.prevent="">
                                                上传文件
                                            </el-button>
                                        </el-upload>
                                    <!--    <el-tag type="info" closable>文件名称：十月聚美优品投放方案.xls</el-tag>-->
                                        <el-tag
                                            :key="tag"
                                            v-for="tag in fileNameTags"
                                            type="info"
                                            closable
                                            :disable-transitions="false"
                                            @close="tabCloseFun(tag)">
                                            文件名称：{{tag}}
                                        </el-tag>
                                    </li>
                                </ul>
                            </el-form-item>
                            <el-form-item label="价格统计：" prop="price">
                                <div class="step2_price">
                                    <p>¥ {{ totalPrice }}<span>（共{{resNum}}个小区）</span> <el-button  @click="exportExcel" v-show="isEdit">导出</el-button></p>
                                    <el-table
                                        :data="resTableData"
                                        border
                                        style="width: 100%">
                                        <el-table-column
                                            prop="cityName"
                                            label="城市"
                                            width="65">
                                        </el-table-column>
                                        <el-table-column
                                            prop="resNum"
                                            label="社区数量"
                                            min-width="100">
                                        </el-table-column>
                                        <el-table-column
                                            prop="res_day"
                                            label="合计:小区·天"
                                            min-width="120">
                                        </el-table-column>
                                        <el-table-column
                                            label="刊例价"
                                            min-width="90">
                                            <template slot-scope="scope">
                                                ¥{{scope.row.price}}/周
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="折扣"
                                            min-width="110">
                                            <template slot-scope="scope">
                                               <span style="cursor: pointer" @click="changePrice(scope.row)">
                                                   {{scope.row.discount}}%<i class="el-icon-edit"></i>
                                               </span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            label="金额"
                                            min-width="130">
                                            <template slot-scope="scope">
                                                ¥{{scope.row.cityTotalPrice}}
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="step2_changePrice">
                        <el-dialog
                            title="修改折扣"
                            :visible.sync="CPdialogVisible"
                            width="30%">
                            <div>
                                <span>折扣</span>
                                <el-input-number v-model="discountData.discount" controls-position="right" :min="1" :max="100"></el-input-number>
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="cancel_changePrice">取 消</el-button>
                                <el-button type="primary" @click="confirm_changePrice">确 定</el-button>
                              </span>
                        </el-dialog>
                    </div>
                    <div class="step2_dialog">
                        <el-dialog
                            title="选取亲邻方案相同点位"
                            :visible.sync="planDialogVisible"
                            width="83%">
                            <div>
                                <div class="step2_dialog_Btn">
                                    <el-input placeholder="请输入方案名称" v-model="selectPlanName" clearable  @change="initData"></el-input>
                                    <el-button type="primary" prefix-icon="el-icon-search" @click="searchApName">搜 索</el-button>
                                </div>
                               <div>
                                   <el-table
                                       ref="multipleTable"
                                       :data="planAdsTableShow"
                                       @select="handleSelect"
                                       :key="planAdsDataKey"
                                       @select-all="handleSelectAll"
                                       border
                                       style="width: 100%; margin-top: 20px"
                                       class="planAdsTable">
                                       <el-table-column
                                           type="selection"
                                           width="55">
                                       </el-table-column>
                                       <el-table-column
                                           prop="planName"
                                           label="方案名称"
                                           width="160">
                                       </el-table-column>
                                       <el-table-column
                                           prop="Customer"
                                           label="客户名称">
                                       </el-table-column>
                                       <el-table-column
                                           prop="companyBrand"
                                           label="品牌">
                                       </el-table-column>
                                       <el-table-column
                                           prop="planPrice"
                                           label="方案价格">
                                       </el-table-column>
                                       <el-table-column
                                           prop="ownerBU"
                                           label="所有人"
                                           width="80">
                                       </el-table-column>
                                       <el-table-column
                                           label="投放城市(点位面数,排期）"
                                           width="265">
                                           <template slot-scope="scope">
                                               <p v-for="(item, index) of scope.row.city" :key="index">{{setComma(item.text)}}</p>
                                           </template>
                                       </el-table-column>
                                       <el-table-column
                                           prop="dateTime"
                                           label="创建日期">
                                       </el-table-column>
                                   </el-table>
                               </div>
                            </div>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="cancelFun">取 消</el-button>
                                <el-button type="primary" @click="confirmFun">确 定</el-button>
                            </span>
                        </el-dialog>
                    </div>
                </div>
                <!--上传物料-->
                <div class="step3" style="margin-bottom: 20px" v-if="active==2">
                    <div class="AdTV_materialMsg">
                        <el-table
                            :data="materialMsgTableData"
                            :span-method="objectSpanMethod"
                            border
                            style="width: 100%; margin-top: 20px"
                            class="materialMsgFrom">
                            <el-table-column
                                prop="material"
                                label="素材类型"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                prop="adsize"
                                label="尺寸">
                            </el-table-column>
                            <el-table-column
                                prop="type"
                                label="格式">
                            </el-table-column>
                            <el-table-column
                                prop="limitsize"
                                label="大小限制">
                            </el-table-column>
                            <el-table-column
                                label="文件"
                                class="uploadMaterial">
                                <template slot-scope="scope"><!-- v-if="scope.row.fileSuccess"-->
                                    <div v-if="scope.row.fileSuccess">
                                        <el-upload
                                            class="upload-demo"
                                            :action= "scope.row.url"
                                            :on-success="materialSuccess"
                                            :on-progress="materialProgress"
                                            :before-upload="materialBeforeUpload"
                                            :file-list="scope.row.uploadImgUrl"
                                            :on-remove="materialRemoveFile(scope.row)">
                                            <!--  :before-upload="materialBeforeUpload"  :on-remove="materialRemoveFile"  :on-remove="materialRemoveFile(scope.row)"-->
                                            <el-button icon="el-icon-upload2"
                                                       size="mini"
                                                       :disabled="scope.row.btnDisable"
                                                       @click="uploadClick(scope.row)">
                                                点击上传
                                            </el-button>
                                        </el-upload>
                                    </div>
                                    <el-tag v-else type="info" closable @close="fileUploadClose(scope.row)">{{scope.row.fileName}}</el-tag>
                                </template>
                            </el-table-column>
                        </el-table>
                        <span style="font-size: 12px;color: #999999">*视频验证所需时间较长,可先创建/编辑保存方案信息.</span>
                    </div>
                </div>
                <!--完成-->
                <div class="step4" style="margin-bottom: 20px" v-if="active==3">
                    <div class="createSuccess">
                        <div class="successIcon">
                            <img src="../../assets/images/createSuccess.png" alt="">
                            <!--<i class="fa fa-check-circle fa-4x" style="color:#67C23A;"></i>-->
                            <h2>{{isEdit ? '编辑成功' : '创建成功'}}</h2>
                            <p>创建时间：{{dateTime}}</p>
                        </div>
                        <div class="planPanel">
                            <ul>
                                <li><em>方案名称：</em>{{basicForm.planName}}</li>
                                <li><em>所属客户：</em>{{cName}}</li>
                                <li><em>所属品牌：</em>{{cBand}}</li>
                                <li class="money"><em>订单金额：</em>¥{{totalPrice}} <span></span></li><!--（叁拾伍萬圆整）-->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="advertTV_btn">
            <el-button @click="prev" v-if="active == 1 || active == 2" type="default">上一步</el-button>
            <el-button @click="clearData" v-if="active === 0" type="default">取消</el-button>
            <el-button style="padding: 12px" @click="next"
                       v-if="active == 0 || active == 1 || active == 2 "
                       type="primary">{{(active == 0 || active == 1) ? '下一步' : ( isEdit ? '确认' : '创建方案')}}
            </el-button>
            <div class="finishBtn" v-if="active == 3">
                <el-button type="primary" @click="continueCreate">继续创建</el-button>
                <el-button type="default" @click="ToDetail">
                    <!--<router-link to="{path='/orderList'}"></router-link>-->
                    查看方案
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "../../api/api.js";
    import sessFun from "../../commonFun/sessFun.js";
    var XLSX = null;
    import(/* webpackChunkName: "XLSX" */ "xlsx").then((res) => {
        XLSX = res;
    });
    export default {
        name: "createPlan",
        components: {},
        data() {
            let validateSales = (rule, value, callback) => {
                console.log('this.BDData', this.BDData)
                console.log('this.BDData.uid', this.BDData.uid)
                if (value) {
                    if (this.BDData.uid === '0') {
                        callback(new Error('请输入正确的账号'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            let validateName = (rule, value, callback) => {
                if (value) {
                    if (value.match(/^\s+$/)) {
                        callback(new Error('方案名称不能为空格'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            let validateBL = (rule, value, callback) =>{
                if(value.length <= 0){
                    callback(new Error('请上传营业执照'))
                }else{
                    callback();
                }
            }
            return {
                active: 0,
                sessionData: '',    // 登录用户的数据
                //setp1创建方案表单
                basicForm: {
                    planName: '',
                    ownerSales: '',   // 所属销售
                    companyName: '',
                    companyBrand: '',
                    // throwCity: [],
                    ownerBU: '',    // 所属联系人
                    BusinessLicense: [],
                },
                BDuWho: '',                     // 销售权限
                ownerBU: [],                    //step1联系人
                companyName: [],              //step1公司名称
                companyBrand: [],            //step1公司品牌
                cName: '',         // 选中公司名称
                cBand: '空',           // 选中的品牌
                oBU: '',                      // 联系人
                isBD: true,                  // 判断登录用户是否为销售
                customer: [],               // step1公司客户
                BDData: {uid: '0', realName: ''},
                LicenseUrlShow:'',          // 营业执照编辑时显示
                imageUrl: '',               // 营业执照图片地址
                imageUrlVisible: false,         // 图片显示
                imageParams:{"type": 0},             // 上传营业执照的参数
                UploadID:{n1:0,n2:0,n3:0,n4:0,n5:0,n6:0,n7:0,n8:0,},
                basicDataRules:{    // 基本信息表单验证
                    planName: [
                        {validator: validateName, trigger: 'blur'},
                        {required: true, type: 'string', message: '方案名称不能为空', trigger: 'blur'},
                        {max: 30, message: '最多只能输入30个字节', trigger: 'blur'},
                    ],
                    ownerBU: [
                        {required: true, message: '请选择联系人', trigger: 'change'},
                    ],
                    ownerSales: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {validator: validateSales, trigger: 'blur'},
                    ],
                    companyName: [
                        {required: true, message: '请选择公司名称', trigger: 'change'},
                    ],
                    BusinessLicense: [
                        {required: true,validator: validateBL, trigger: 'blur'},
                        // {required: true, message: '请上传营业执照', trigger: 'change'},
                    ],
                },
                // step2完善媒体策略
                mediaStrategyForm:{
                    dateTime:[],
                    ads:'',
                    price: '',
                },
                mediaStrategyRules:{
                    dateTime:[
                        {required: true, message: '请选择起止时间', trigger: 'change'},
                    ],
                    ads:[
                        {required: true, message: '请选择起止时间', trigger: 'change'},
                    ],
                },
                //
                apNameTags:[ // 已选中的方案tag
                   // '方案名称：测试方案',
                ],
                fileNameTags:[  // 已选上传的excle tag
                  //  '文件名称：十月聚美优品投放方案.xls'
                ],
                fileData:[],                   // 当前上传文件的数据- 表格
                TotalFileData:[],             // 所有上传文件的数据 - [{fileName:'',dataArr:[]}]
                totalResData: [],             // 所选方案的资源信息，接口原数据
                beforeResDataIndex: 1,       // 前一次遍历到的方案长度
                beApResData:[],               // 所选方案的资源信息
                repeatResData: [],            // 重复的资源及对应的方案id
                resTableData:[],              // steps2 表格数据
                totalPrice: 0,                // 总价
                resNum: 0,                     //总社区资源数
                CPdialogVisible: false,      // 修改折扣-dialog
                planDialogVisible: false,   // 选择已有方案点位的dialog
                discountData: {rid: 0, discount:0},
                planAdsDataKey: 1,
                planAdsData:[],                 // 已有方案点位表格数据
                planAdsTableShow:[],             // 要显示的方案点位列表数据
                selectPlanName: '',           // 搜索的方案名称
                beforeHavePlanList: [],            // 再次选择时前一次选中的方案列表
                havePlanList: [],              // 已选中的方案
                cityPrice: [],                  // 城市价格
                // step3上传物料
                materialLoading: false,     //上传loading
                materialMsgTableData: [
                    {
                        material: '图片素材',
                        adsize: '400x218',
                        type: 'png/jpg/gif/webp',
                        limitsize: '300kb',
                        index: '1',
                        fileUploadId:'',            // 文件上传成功后返回的id
                        fileSuccess: true,          // 上传成功后按钮隐藏
                        btnDisable: false,          // 上传过程中禁止点击
                        url:'/QinlinKuyun-API/UploadServlet?type=1',    // 上传的url地址
                        fileName: '',
                        uploadImgUrl: [],
                    }, {
                        material: '图片素材',
                        adsize: '440x300',
                        type: 'png/jpg/gif/webp',
                        limitsize: '1M',
                        index: '2',
                        fileUploadId:'',            // 文件上传返回的id
                        btnDisable: false,
                        fileSuccess: true,
                        url:'/QinlinKuyun-API/UploadServlet?type=2',
                        fileName: '',
                        uploadImgUrl: [],
                    }, {
                        material: '图片素材',
                        adsize: '440x500',
                        type: 'png/jpg/gif/webp',
                        limitsize: '1M',
                        index: '3',
                        id:'',
                        fileUploadId:'',
                        btnDisable: false,
                        fileSuccess: true,
                        url:'/QinlinKuyun-API/UploadServlet?type=3',
                        fileName: '',
                        uploadImgUrl: [],
                    }, {
                        material: '图片素材',
                        adsize: '400x500',
                        type: 'png/jpg',
                        limitsize: '300kb',
                        index: '4',
                        fileUploadId:'',
                        btnDisable: false,
                        fileSuccess: true,
                        url:'/QinlinKuyun-API/UploadServlet?type=4',
                        fileName: '',
                        uploadImgUrl: [],
                    }, {
                        material: '图片素材',
                        adsize: '1000x300',
                        type: 'png/jpg/gif/webp',
                        limitsize: '1M',
                        index: '5',
                        fileUploadId:'',
                        btnDisable: false,
                        fileSuccess: true,
                        url:'/QinlinKuyun-API/UploadServlet?type=5',
                        fileName: '',
                        uploadImgUrl: [],
                    }, {
                        material: '图片素材',
                        adsize: '1920*1080',
                        type: 'png/jpg',
                        limitsize: '500kb',
                        index: '6',
                        fileUploadId:'',
                        btnDisable: false,
                        fileSuccess: true,
                        url:'/QinlinKuyun-API/UploadServlet?type=6',
                        fileName: '',
                        uploadImgUrl: [],
                    }, {
                        material: '视频素材',
                        adsize: '1920*1080',
                        type: 'mp4',
                        limitsize: '10M',
                        index: '7',
                        fileUploadId:'',
                        btnDisable: false,
                        fileSuccess: true,
                        url:'/QinlinKuyun-API/UploadServlet?type=7',
                        fileName: '',
                        uploadImgUrl: [],
                    }, {
                        material: '视频素材',
                        adsize: '1920*1080',
                        type: 'mp4',
                        limitsize: '20M',
                        index: '8',
                        fileUploadId:'',
                        btnDisable: false,
                        fileSuccess: true,
                        url:'/QinlinKuyun-API/UploadServlet?type=8',
                        fileName: '',
                        uploadImgUrl: [],
                    }],
                uploadRow: '',      // 素材上传行的数据
                uploadType: '',     // 素材上传限制类型
                uploadSize:'',      // 素材上传限制大小
                spanArr:[],
                pos:0,
                beforeMaterialMsgTr:'',// 判断合并表格第一列
                // step4完成
                dateTime: '2018-10-11',                // 获取今天日期
                isEdit: false,                  // 是否为编辑状态
                tvApID:'',                      // 电视广告方案id
                editApData:{},                   // 编辑方案的初始化数据
                editBasicInfo:'',                // 基础数据
            };
        },
        mounted() {
            this.getsessionData()
            this.spanArr = []
            this.getSpanArr(this.materialMsgTableData)
            let starTime = this.GetDateStr(1)
            let endTime = this.GetDateStr(14)
            this.mediaStrategyForm.dateTime = [starTime, endTime] // 设置默认时间
            // this.$refs.upload.$el.querySelector('.el-upload__input').addEventListener('change', e => {
            //     // this.readExcel(e);
            // })
        },
        methods: {
            // 获取浏览器session数据
            getsessionData() {
                this.sessionData = sessFun.getSess();
                this.judgeIsEdit()
                console.log('sessionData', this.sessionData)
                if (this.sessionData.uType === 'BD') {
                    this.BDData.realName = this.sessionData.realName // username
                    this.basicForm.ownerSales = this.BDData.realName
                    this.BDData.uid = this.sessionData.uID
                    this.isBD = true
                    // this.Get_cName()
                } else {
                    this.isBD = false
                }
                if (this.isEdit) {              // 编辑状态先获取方案信息
                    this.getTheTvApDataById() // 获取该电视广告方案的信息并填充以便进行编辑
                } else {
                    if (this.isBD) {
                        this.Get_cName()
                    } else {
                        console.log('非销售')
                    }
                }
            },
            // 判断是否为编辑状态
            judgeIsEdit(){
                console.log('获取url',location.href)
                let url = location.href
                if(url.indexOf('edit=y') !== -1){
                    this.tvApID = sessionStorage.getItem('tvOrder_apid')
                    console.log('活动id',this.tvApID)
                    this.isEdit = true
                    // this.getTheTvApDataById() // 获取该电视广告方案的信息并填充以便进行编辑
                }
            },
            // 根据方案id获取该方案的信息
            getTheTvApDataById(){
                let params = {plan_id: this.tvApID}
                api.getApi(this.apiVar.QKuyun+'/GetPlanDetail', params).then(res=>{
                    console.log('编辑获取方案信息',res.data);
                    if(res.data.code == 500200){
                        let obj = res.data.data
                        this.editApData = obj
                        this.editBasicInfo = {
                            plan_id: obj.plan_id,       // 电视广告方案的id
                            plan_name: obj.plan_name,
                            company: obj.company,
                            company_id: obj.company_id,
                            brand: obj.brand,
                            brand_id: obj.brand_id,
                            sales: obj.sales,
                            sales_id: obj.sales_id,
                            budget: obj.budget,
                            create_time: obj.create_time,
                            contacts: obj.contacts,                     // 联系人
                            contacts_id: obj.contacts_id,
                            last_update_time: obj.last_update_time,
                            begin_date: obj.begin_date,
                            end_date: obj.end_date,
                            status: obj.status,                         // 状态
                        }
                        this.basicForm.ownerSales = obj.sales
                        this.BDData.uid = obj.sales_id
                        // if (this.sessionData.uType === 'MD'){
                            this.Get_cName()
                        // }
                        // this.querySearchAsync()
                        // this.editFillData()
                    }else{
                        this.$message.warning('该方案信息提取失败，请稍后再试！')
                    }
                })
            },
            // 编辑状态 - 数据填充
            editFillData(){
                console.log('数据填充',this.editApData)
                let plansAttachments = this.editApData.plansAttachments     // 上传素材信息，包括营业执照
                let planDetailSummaries = this.editApData.planDetailSummaries // step2 城市社区、价格统计表格
                let planDetails = this.editApData.planDetails               // 方案选择的社区信arr
                let associatedPlans = this.editApData.associatedPlans       // 关联方案
                let basicInfo = this.editBasicInfo
                // 第一步基础信息
                // this.BDData.uid = basicInfo.sales_id
                this.oBU = basicInfo.contacts
                this.GetBrandByCid(basicInfo.company_id)
                this.basicForm = {
                    planName: basicInfo.plan_name,
                    ownerSales: basicInfo.sales,   // 所属销售
                    companyName: basicInfo.company_id,
                    companyBrand: basicInfo.brand_id,
                    ownerBU: basicInfo.contacts_id,    // 所属联系人
                    BusinessLicense: [],            // 营业执照
                }
                console.log('基础信息',this.basicForm)
                // 第二步
                this.mediaStrategyForm.dateTime = [basicInfo.begin_date, basicInfo.end_date]  // 设置时间
                // 所选方案 tag
                for(let akey of associatedPlans){
                    if(akey.plan_id !== ''){
                        this.apNameTags.push(akey.plan_name)
                        this.havePlanList.push({apID: akey.associated_id,planName: akey.plan_name})
                    }

                }
                // 所选社区 beApResData
                let resArr = []
                for(let dkey of planDetails){
                    resArr.push({
                        apID: dkey.plan_id,
                        city: dkey.city,
                        district: dkey.district,
                        resName: dkey.community,
                        resID: dkey.resID,
                        prName: '',
                        resNumber: 1,                  // 相同资源个数，方便删除时操作
                    })
                }
                this.beApResData = resArr
                console.log('所选社区',this.beApResData)
                this.getResListByApID(0,'edit')
                console.log('方案对应资源',this.totalResData)
                // 城市社区表格 resTableData
                let arr = []
                for(let skey of planDetailSummaries){
                    arr.push({
                        cityName: skey.city,
                        resNum: skey.community_count,
                        res_day: skey.duration,
                        price: 600,
                        discount: skey.discount,
                        cityTotalPrice: skey.total
                    })
                }
                this.resTableData = arr
                this.computePrice_resNum()
                console.log('城市社区表格',this.resTableData)
                // 第三步 materialMsgTableData
                let MTD = this.materialMsgTableData
                for (let mkey of MTD) {
                    for (let akey of plansAttachments) {
                        if (mkey.index === akey.type) {
                            mkey.fileUploadId = akey.id
                            mkey.fileSuccess = false
                            mkey.fileName = akey.file_name
                            break
                        }
                    }
                }
                console.log('图片素材',this.materialMsgTableData)
                for (let akey of plansAttachments){
                    if(akey.type == '0'){
                        this.basicForm.BusinessLicense.push({name: akey.file_name, url: akey.url})
                        this.UploadID.n1 = akey.id
                        break
                    }
                }
            },
            //  勾选
            judgeByselect(){
                if(this.planAdsDataKey === 1){
                    this.planAdsDataKey = 2
                }else{
                    this.planAdsDataKey = 1
                }
                setTimeout(()=>{
                    console.log('编辑勾选方案',this.havePlanList,this.planAdsTableShow)
                    let tableShow = this.planAdsTableShow
                    for(let hkey of this.havePlanList){
                        for(let i=0;i<tableShow.length;i++){
                            if(hkey.apID == tableShow[i].apID){
                                console.log('this.$refs',this.$refs) // this.planAdsTableShow[n]
                                // if(tableShow[i].checkBox){
                                    this.$refs.multipleTable.toggleRowSelection(this.planAdsTableShow[i], true)
                                    tableShow[i].checkBox = true
                                // }
                                break
                            }
                        }
                    }
                },10)
            },
            // 下一步
            next(){
                if(this.active <= 3){
                    if(this.active === 0){
                        this.submitForm('basicForm')
                    }else if(this.active === 1){
                        if(this.beApResData.length <= 0){
                            this.$message.warning('请选择方案或上传文件')
                        }else{
                            this.active++
                            this.getBand()              // 根据id获取名称
                        }
                    }else if(this.active === 2){
                        // if(this.isEdit === true){
                        //     let isUploadMaterial = true
                        //     for(let mkey of this.materialMsgTableData){
                        //         if(mkey.fileUploadId === ''){
                        //             isUploadMaterial = false
                        //         }
                        //     }
                        //     if(isUploadMaterial){
                        //         this.createApPlan()         //创建方案接口
                        //     }else{
                        //         this.$message.warning('请上传完所有的素材！')
                        //     }
                        // }else{
                            this.createApPlan()         //创建方案接口
                        // }
                    }
                }
            },
            //上一步
            prev(){
                if(this.active > 0){
                    this.active--
                }
            },
            // 取消
            clearData(){
                this.$router.go(-1)
            },
            //继续创建
            continueCreate(){
                // this.$router.push('/advertTV')
                this.$router.push('./advertTV')
            },
            // 查看详情
            ToDetail(){
                sessionStorage.setItem("tvOrder_apid", this.tvApID);
                this.$router.push("./tvOrderDetail");
                // this.$router.push('./tvOrderList')
            },
            // step1
            // 登录用户为媒介输入销售用户名去获取该销售的信息以便获取接下来的城市、公司、品牌、投放城市等信息
            querySearchAsync(queryString, callback) {
                let uid = this.sessionData.uID
                // let sname = ''
                // if(this.isEdit && queryString === undefined){
                //     sname = this.editBasicInfo.sales
                // }
                if (queryString) {
                    let params = {
                        uid: uid,
                        token: this.sessionData.token,
                        sname: queryString
                    }
                    api.postApi(this.apiVar.UCAPI+'/GetUserName', params).then(res => {
                        //{SysCode: 100302, MSG: "登陆超时"}
                        console.log('GetUserName', res)
                        if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                            this.loginTimeout()
                        } else {
                            console.log('媒介销售信息', this.BDData)
                            if (res.data.uID) {
                                this.BDData.uid = res.data.uID
                                console.log('GetUserName数据包', res.data)
                                res.data.value = res.data.realName; //queryString
                                this.BDData.realName = res.data.realName
                                this.basicForm.ownerSales = res.data.realName
                                this.BDuWho = res.data.uWho
                                // 重新输入账号时，初始化部分数据
                                this.basicForm.companyName = ''
                                this.basicForm.companyBrand = ''
                                this.basicForm.ownerBU = ''
                                this.dynamicTags = []

                                this.Get_cName()
                                let results = [res.data];
                                clearTimeout(this.timeout)
                                this.timeout = setTimeout(() => {
                                    callback(results);
                                }, 3000 * Math.random());
                            } else {
                                this.BDData.uid = '0'
                            }
                        }
                    });
                }
            },
            //获取公司名称列表MyCustomer
            Get_cName() {
                api.getApi(this.apiVar.Advertisement+'/MyCustomer', {uid: this.BDData.uid, token: this.sessionData.token}).then(res => {
                    console.log('MyCustomer:', res.data)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else {
                        let customerList = res.data
                        this.customer = res.data    //保存所有信息，方便后面的过滤使用
                        //companyName ownerBU customer
                        let companyList = []      // 公司名称
                        let ownerList = []      // 联系人
                        for (let i = 0; i < customerList.length; i++) {
                            // console.log('公司名称',i,customerList[i].cName)
                            let companyObj = {
                                label: customerList[i].cName,
                                value: customerList[i].cID,
                            }
                            let owner = {
                                label: customerList[i].realName,
                                value: customerList[i].uID,
                            }
                            ownerList.push(owner)
                            if (i == 0) {
                                companyList.push(companyObj)
                            } else if (JSON.stringify(companyList).indexOf(JSON.stringify(companyObj)) === -1) { //判断是否有重复的公司JSON.stringify(companyObj)
                                companyList.push(companyObj)
                            }
                        }
                        this.companyName = companyList  // 公司名称列表
                        this.ownerBU = ownerList        // 联系人列表
                        if (this.isEdit) {
                            // this.getTheTvApDataById()        // 获取该电视广告方案的信息并填充以便进行编辑
                            this.editFillData()
                        }
                        console.log('公司名称列表', this.companyName, this.ownerBU)
                    }
                })
            },
            // 获取公司品牌
            GetBrandByCid(val) {
                this.basicForm.companyBrand = ''
                this.basicForm.ownerBU = ''
                console.log('所选公司的ID', val)
                let cidParams = {
                    cid: val,
                    token: this.sessionData.token
                }
                api.getApi(this.apiVar.Advertisement+'/GetBrand', cidParams).then(res => {
                    console.log('公司品牌', res.data)
                    if (res.data.SysCode === 100302 || res.data.MSG === '登陆超时') {
                        this.loginTimeout()
                    } else if (res.data.SysCode === 200200) {
                        let CBrand = res.data.data
                        let BrandList = []
                        for (let key of CBrand) {
                            BrandList.push({
                                label: key.bTitle,
                                value: key.bID
                            })
                        }
                        this.companyBrand = BrandList
                        console.log('品牌列表列表',this.companyBrand)
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
                // 选择公司后过滤联系人列表customer
                let customerList = this.customer
                let ownerList = []   // 联系人
                let BrandList = []  // 公司品牌
                for (let j = 0; j < customerList.length; j++) {
                    if (customerList[j].cID == val) {
                        let owner = {
                            label: customerList[j].realName,
                            value: customerList[j].uID,
                        }
                        ownerList.push(owner)
                    }
                }
                this.ownerBU = ownerList
            },
            // 图片上传成功
            handleAvatarSuccess(res, file) {
                console.log('res',res,'file',file)
                // this.imageUrl = URL.createObjectURL(file.raw);
                this.basicForm.BusinessLicense.push({url: res.data.url, name: file.name})//
                this.UploadID.n1 =  res.data.id
                console.log('上传图片连接',this.basicForm.BusinessLicense)
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isBMP = file.type === 'image/bmp';
                const isLt2M = file.size / 1024 / 1024 < 6;

                if (!isJPG && !isPNG && !isBMP) {
                    this.$message.error('上传的营业执照图片只能是JPG/PNG/BMP 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传营业执照图片大小不能超过 6MB!');
                }
                return (isJPG || isBMP || isPNG) && isLt2M;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.basicForm.BusinessLicense = []
            },
            handlePictureCardPreview(file) {
                this.imageUrl = file.url;
                this.imageUrlVisible = true;
                // this.BusinessLicense = this.imageUrl
                console.log('上传图片连接Preview',this.imageUrl )
            },

            //表单验证
            submitForm(formName){
                console.log(this.basicForm)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.getPlanListData()      // 获取方案列表
                        this.getCityPrice()         // 获取城市价格
                        this.active++;
                    } else {
                        console.log('error submit!!')
                        return false;
                    }
                })
            },
            // step2 完善媒体策略
            // 选择时间
            changeDateTime(val){
                // computeCityResNum
                console.log('step2选择时间',val)
            //    {cityName: key.city, resNum: 1, res_day: duration, price:0, discount: 100, cityTotalPrice: 0}
                let dayNum = this.DateDiff(val[0],val[1]) + 1
                if(this.resTableData.length >0 ){
                    for(let key of this.resTableData){
                        key.res_day = dayNum
                        // key.cityTotalPrice = dayNum * Number(key.resNum) * Number(key.price) * Number(key.discount/100)
                        key.cityTotalPrice = Math.round(parseFloat(dayNum * Number(key.resNum) * Number(key.price/7) * Number(key.discount/100))* 100)/ 100
                    //    Math.round(parseFloat(key.res_day * Number(key.resNum) * Number(key.price/7) * Number(key.discount/100)) * 100) / 100
                    }
                }
            },
            //修改折扣
            changePrice(row){
                console.log('修改折扣',row)
                this.CPdialogVisible = true
                // this.discountData.discount = row.discount
                this.discountData = {cityName: row.cityName, discount: row.discount}
                // resTableData
            },
            // 修改折扣确认按钮
            confirm_changePrice(){
                console.log('修改折扣确认按钮',this.discountData)
                for(let key of this.resTableData){
                    if(this.discountData.cityName == key.cityName){
                        key.discount = this.discountData.discount
                        // key.cityTotalPrice = key.res_day * Number(key.resNum) * Number(key.price) * Number(key.discount/100)
                        key.cityTotalPrice = Math.round(parseFloat(key.res_day * Number(key.resNum) * Number(key.price/7) * Number(key.discount/100)) * 100) / 100
                        //Math.round(parseFloat(key.res_day * Number(key.resNum) * Number(key.price/7) * Number(key.discount/100)) * 100) / 100
                        break
                    }
                }
                this.computePrice_resNum()
                this.CPdialogVisible = false
            },
            // 修改折扣取消按钮
            cancel_changePrice(){
                this.CPdialogVisible = false
            },
            //获取城市价格列表
            getCityPrice(){
                let params = {}
                // console.log('获取城市价格列表',)
                api.getApi(this.apiVar.QKuyun + '/GetAdPrice',params).then(res=>{
                    console.log('获取城市价格列表',res)
                    let dataArr = res.data.data
                        // [
                        //     {id:1,code:110100,city:'北京市'},
                        //     {id:2,code:310100,city:'上海市'},
                        //     {id:3,code:440100,city:'广州市'},
                        //     {id:4,code:440300,city:'深圳市'}
                        // ]
                    this.cityPrice = dataArr
                })
            },
            // 选择已有方案
            selectPlan(){
                this.planDialogVisible = true
                this.judgeByselect()
                this.beforeHavePlanList = this.havePlanList.concat()
            },
            // 获取方案列表
            getPlanListData(){
                let params
                // if (this.isBD) {
                    params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        pageNum: 1,
                        pageSize: 10000
                    }
                // } else {
                //     params = {uid: this.BDData.uid}
                // }
                api.postApi(this.apiVar.Advertisement + '/GetOrderList',params).then(res=>{
                    console.log('获取方案列表',res)
                    if (!res.data.SysCode) {
                        let dataArr =  res.data.orderList
                        let arr = []
                        for (let item of dataArr){
                            if (item.rIDs) {
                                let arr = item.rIDs.split(",");
                                let dataArr = [];
                                for (let i = 0; i < arr.length; i++) {
                                    let text = arr[i].substr(0, arr[i].indexOf(")") + 1);
                                    // let pdid = arr[i].substr(arr[i].indexOf(")") + 1);
                                    dataArr.push({
                                        text: text,
                                        // pdID: pdid,
                                    })
                                }
                                item.cityArea = dataArr;
                            }
                            let obj = {
                                apID: item.apID?item.apID:'',
                                planName: item.apName ? item.apName : '',
                                Customer: item.cName ? item.cName : '',
                                companyBrand: item.bTitle ? item.bTitle : '',
                                planPrice: item.apTotal ? item.apTotal : '',
                                ownerBU: item.realName ? item.realName : '',
                                city: item.cityArea ? item.cityArea : '',
                                dateTime: item.apcTime ? item.apcTime : '',
                                checkBox: false,
                            };

                            arr.push(obj)
                        }
                        this.planAdsData = arr.concat()
                        this.planAdsTableShow = arr.concat()
                        // if(this.isEdit){
                        //     this.judgeByselect()
                        // }
                        // console.log('planAdsData',this.planAdsData)
                    }else if(res.data.SysCode == 100302){
                        // this.loginTimeout();
                    } else {
                        Message.warning(res.data.MSG);
                    }
                })
            },
            // 行选中打钩或取消勾选
            handleSelect(selection, row){
                console.log('行选中打钩或取消勾选',selection,row)
                if(row.checkBox){       //行取消
                    this.eachPlanAdsData('del',row)
                }else if(!row.checkBox){    // 行选中
                    this.eachPlanAdsData('add',row)
                }
            },
            //点击全选按钮
            handleSelectAll(selection){
              console.log('点击全选按钮',selection)
                let dataArr = this.planAdsTableShow
                let selLength = selection.length
                for(let key of dataArr){
                    if(selLength > 0){
                        key.checkBox = true
                    }else{
                        key.checkBox = false
                    }
                }
                if(selLength > 0){
                    this.havePlanList = dataArr.concat()
                }else{
                    this.havePlanList = []
                }
                console.log(this.planAdsTableShow,'handleSelectAll',this.havePlanList)
            },
            // 遍历数据，选取行数据或删除行数据
            eachPlanAdsData(val,apData){
                console.log(val,'遍历数据',this.planAdsTableShow)
                // havePlanList
                let dataArr = this.planAdsTableShow
                for(let key of dataArr){
                    if(apData.apID === key.apID){
                        if(val === 'add'){
                            key.checkBox = true
                            this.havePlanList.push(key)
                        }else if(val === 'del'){
                            key.checkBox = false
                            let haveArr = this.havePlanList
                            for (let i = 0; i < haveArr.length; i++) {
                                if(haveArr[i].apID === apData.apID){
                                    haveArr.splice(i,1)
                                    break
                                }
                            }
                        }
                        break
                    }
                }
                console.log('this.havePlanList',this.havePlanList)
            },
            // 当搜索框为空的时候进行重置显示
            initData(val){
                console.log('搜索框变化的值',val)
                if (!this.selectPlanName) {
                    console.log('搜索框为空', this.planAdsData)
                    this.planAdsTableShow = this.planAdsData.concat()
                }
            },
            // 方案名称搜索
            searchApName(){
                // selectPlanName planAdsData planName
                console.log('方案名称搜索',this.selectPlanName)
                let val = this.selectPlanName
                let arr = []
                if(val !== ''){
                    for(let key of this.planAdsData){
                        if(key.planName.includes(val)){
                            arr.push(key)
                        }
                    }
                    this.planAdsTableShow = arr
                    console.log('搜索结果',arr)
                }else{
                    this.$message.warning('方案名称不能为空')
                }
            },
            // 选择方案取消按钮
            cancelFun(){
                console.log('取消选择方案')
                if(this.beforeHavePlanList.length > 0){
                    this.havePlanList = this.beforeHavePlanList
                }else{
                    this.havePlanList = []
                }
                this.planDialogVisible = false
            },
            // 选择方案确定按钮
            confirmFun(){
                console.log('选择方案确定按钮',this.havePlanList)
                let apList = this.havePlanList
                if(apList.length > 0){
                    this.planDialogVisible = false
                    this.totalResData = []
                    // this.beApResData = []
                    // this.havePlanList = []
                    this.getResListByApID(0)
                    let arr = []
                    for(let key of this.havePlanList){
                        arr.push(key.planName)
                    }
                    this.apNameTags = arr
                }else{
                    this.$message({
                        type: 'warning',
                        message: '请选择不少于1个方案'
                    })
                }
            },
            // 根据方案id获取该方案的资源信息
            getResListByApID(index,string){
                let step = index
                if(this.havePlanList.length - 1 >= index){
                    let apID = this.havePlanList[index].apID
                    let params = {
                        uid: this.sessionData.uID,
                        apid: apID,
                        token: this.sessionData.token,
                    }
                    api.getApi(this.apiVar.Advertisement + '/GetApRes',params).then(res=>{
                        console.log('获取资源列表',res)
                        let dataArr = res.data
                            // [
                            //     // {"city":"广州","district":"海珠区","resName":"南晓苑","resID":"42758"},
                            //     {crName: "广州市",resName: "A区小区",qrName: "荔湾区",prName: "广东省",resID: 42559},
                            //     {crName: "广州市",resName: "祥兴新村A区",qrName: "荔湾区",prName: "广东省",resID: 42560},
                            //     {crName: "广州市",resName: "祥兴新村B区",qrName: "荔湾区",prName: "广东省",resID: 42561},
                            // ]
                        let arr = []
                        for(let key of dataArr){
                            arr.push({
                                apID: apID,
                                city: key.crName,
                                district: key.qrName,
                                resName: key.resName,
                                resID: key.resID,
                                prName: key.prName,
                                resNumber: 1,                  // 相同资源个数，方便删除时操作
                            })
                        }
                        this.totalResData.push(arr)
                        step += 1
                        this.getResListByApID(step,string)
                    })
                }else{
                    console.log('数据获取完成',this.totalResData)
                    // this.beApResData = []
                    if(string !== 'edit'){
                        this.arrRemoveRepeat()
                    }
                    return
                }
            },
            // 所选方案数组去重
            arrRemoveRepeat(){
                // beApResData:[],               // 所选方案的资源信息
                // repeatResData: [],            // 重复的资源及对应的方案id
                let totalList = this.totalResData
                let beApList = []
                let index = 0
                if( this.beApResData.length === 0){
                    this.beApResData = totalList[0].concat()
                    index += 1
                }
                if(this.beApResData.length > 0){
                    // let index = this.beforeResDataIndex
                    // 有资源id的要删除
                    console.log('下标',index)
                    let beApResList = this.beApResData
                    for (let i = index; i < totalList.length; i++) {
                        let arr = this.totalResData[i].concat()
                        for (let key of arr) {
                            let ifHad = false
                            for (let beKey of beApResList) {        // 广州对广州市
                                if (key.resName === beKey.resName && (key.city.includes(beKey.city) || beKey.city.includes(key.city))) {
                                    console.log('相同资源', key.resName)
                                    console.log('key',arr,'beKey',beApResList)
                                    beKey.resNumber += 1
                                    ifHad = true
                                    break
                                }
                            }
                            if (!ifHad) {
                                this.beApResData.push(key)
                            }
                        }
                    }
                }
                console.log('所选方案的资源信息',this.beApResData)
                this.computeCityResNum()
            },
            // 根据所有资源列表计算每个城市的资源数
            computeCityResNum(){
                let resList = this.beApResData
                console.log('起止时间',this.mediaStrategyForm.dateTime)
                let dateTime = this.mediaStrategyForm.dateTime
                let duration = this.DateDiff(dateTime[0],dateTime[1]) + 1
                let cityArr = []
                for(let key of resList){
                    if(cityArr.length === 0){
                        let price = this.getCityPriceByName(key.city)
                        cityArr.push({cityName: key.city, resNum: 1, res_day: duration, price: price, discount: 100, cityTotalPrice: 0})
                    }else{
                        let isHad = false
                        for(let cKey of cityArr){
                            if(cKey.cityName.includes(key.city) || key.city.includes(cKey.cityName)){
                                cKey.resNum += 1
                                isHad = true
                                break
                            }
                        }
                        if(!isHad){
                            let price = this.getCityPriceByName(key.city)
                            cityArr.push({cityName: key.city, resNum: 1, res_day: duration, price: price, discount: 100, cityTotalPrice: 0})
                        }
                    }
                }
                for(let key of cityArr){
                    // Math.round(parseFloat(value) * 100) / 100
                    key.cityTotalPrice = Math.round(parseFloat(key.res_day * Number(key.resNum) * Number(key.price/7) * Number(key.discount/100)) * 100) / 100//.toFixed(2)
                }
                this.resTableData = cityArr
                this.computePrice_resNum()
                console.log('各城市资源数及其它初始信息',cityArr)

            },
            // 根据城市名返回价格
            getCityPriceByName(cityName){
                console.log('城市名',cityName)
                for(let ckey of this.cityPrice){
                    if(ckey.city.includes(cityName) || cityName.includes(ckey.city)){
                        console.log('城市刊例价',ckey.price)
                        return ckey.price
                    }
                }
                return 1000
            },
            // 计算总价格和资源数
            computePrice_resNum(){
                let totalprice = 0
                let resNum = 0
                for(let key of this.resTableData){
                    totalprice += Number(key.cityTotalPrice)
                    resNum += key.resNum
                }
                this.totalPrice = totalprice
                this.resNum = resNum
            },
            // tag方案删除
            apTabCloseFun(tag){
                console.log(tag,'tag方案删除',this.apNameTags)
                let apTags = this.apNameTags
                let apList = this.havePlanList
                let tableApArr = this.planAdsTableShow
                console.log('apList',apList,'tableApArr',tableApArr)
                for (let j = 0; j < apList.length; j++) {   // 删除选中的方案list的对应数据
                    if (apList[j].planName === tag) {
                        console.log('方案list',apList[j])
                        for (let n = 0; n < tableApArr.length; n++) {
                            if (apList[j].apID === tableApArr[n].apID) {
                                console.log('取消勾选', tableApArr[n],this.$refs.multipleTable)
                                // this.$refs.multipleTable.toggleRowSelection(this.planAdsTableShow[n], false) // planAdsData
                                this.planAdsTableShow[n].checkBox = false
                                break
                            }
                        }
                        this.delResList(apList[j].apID)                               //
                        this.havePlanList.splice(j, 1)
                        for (let i = 0; i < apTags.length; i++) {       // 删除tag
                            if (apTags[i] === tag) {
                                console.log('删除tag')
                                this.apNameTags.splice(i, 1)
                                break
                            }
                        }
                        break
                    }
                }
            },
            // tag文件删除
            tabCloseFun(val){
                console.log('tag文件删除',val,this.fileNameTags)
                console.log('总文件list',this.TotalFileData)
                let fileTags = this.fileNameTags
                // TotalFileData
                let resList = this.beApResData
                let totalList = this.TotalFileData
                for(let n=0;n<totalList.length;n++){
                    if(totalList[n].fileName === val){
                        let tagResList = totalList[n].dataArr
                        for(let tkey of tagResList){
                            for (let m = 0; m < resList.length; m++) {
                                if (tkey['小区名称'] === resList[m].resName) {
                                    if (resList[m].resNumber > 1) {
                                        resList[m].resNumber -= 1
                                    } else {
                                        this.beApResData.splice(m, 1)
                                    }
                                    break
                                }
                            }
                        }
                        for (let i = 0; i < fileTags.length; i++) {       // 删除tag
                            if (fileTags[i] === val) {
                                console.log('删除tag文件')
                                this.fileNameTags.splice(i, 1)
                                break
                            }
                        }
                        break
                    }
                }
                // 删除总list的相应数据
                for(let n=0;n<totalList.length;n++){
                    if(totalList[n].fileName === val){
                        this.TotalFileData.splice(n,1)
                        break
                    }
                }
                this.computeCityResNum()
            },
            // 删除资源信息列表对应的资源
            delResList(val){
                // this.resTableData  this.totalResData
                console.log('delResList',val,this.totalResData)
                let resList = this.beApResData
                for(let tkey of this.totalResData){
                    if(tkey[0].apID === val){
                        console.log('tkey',tkey)
                        let delArr = tkey
                        for(let dkey of delArr){
                            for(let i=0;i<resList.length;i++){
                                if(dkey.resName === resList[i].resName){
                                    if(resList[i].resNumber > 1){
                                        resList[i].resNumber -= 1
                                    }else{
                                        this.beApResData.splice(i,1)
                                    }
                                    break
                                }
                            }
                        }
                        break
                    }
                }
                console.log('删除资源信息列表对应的资源',this.beApResData)
                this.computeCityResNum()
            },
            //
            uploadExcel(){
                console.log('222')
                if(this.isEdit){
                    if(this.fileNameTags.length <= 0){
                        this.$confirm('编辑状态上传社区文件将覆盖掉之前选中的小区，请提前导出资源信息', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            document.querySelector('.fileUploadLi .el-upload button').click()
                            // this.$message({
                            //     type: 'success',
                            //     message: '删除成功!'
                            // });
                        }).catch(() => {
                            // this.$message({
                            //     type: 'info',
                            //     message: '已取消删除'
                            // });
                        });
                    }else{
                        this.$message.warning('编辑状态，只支持上传一个社区文件！')
                    }
                }else{
                    document.querySelector('.fileUploadLi .el-upload button').click()
                }
            },
            // 导入
            readExcel(e, fileList) {
                console.log('导入',e,fileList)
                const fileReader = new FileReader();
                fileReader.onload = (ev) => {
                    try {
                        const data = ev.target.result;
                        const workbook = XLSX.read(data, {
                            type: 'binary'
                        })
                        console.log('workbook.Sheets',workbook.Sheets)
                        for (let sheet in workbook.Sheets) {
                            let sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
                            if(sheetArray.length > 0){
                                this.fileData = sheetArray
                            }
                            console.log('文件转成数组',sheetArray)
                        }
                        let fileName = e.name + (this.fileNameTags.length + 1)
                        this.fileNameTags.push(fileName )      // 文件名称
                        this.TotalFileData.push({fileName: fileName,dataArr:this.fileData})
                        console.log('TotalFileData',this.TotalFileData,'上传文件的表格数据',this.fileData)
                        if(this.isEdit){
                            this.beApResData = []
                            this.apNameTags = []
                        }
                        this.addFileDataToResList()
                    }catch (e) {
                            this.$message.warning('文件类型不正确！');
                            return false;
                        }
                    };
                    fileReader.readAsBinaryString(e.raw);
            },
            // 导入成功后把数据并入资源列表
            addFileDataToResList(){
                //this.beApResData
                for(let fkey of this.fileData){
                    console.log('fkey',fkey['小区名称'])
                    if(this.isEdit){
                        console.log('编辑状态导入')
                        this.beApResData.push({
                            apID: '',
                            city: fkey['城市'],
                            district: fkey['区域'],
                            resName: fkey['小区名称'],
                            resID: '',
                            prName: '',
                            resNumber: 1,                  // 相同资源个数，方便删除时操作
                        })
                    }else{
                        let isHad = false
                        for(let vkey of this.beApResData){
                            if(fkey['小区名称'] === vkey.resName && (fkey['城市'].includes(vkey.city) || vkey.city.includes(fkey['城市']))){
                                vkey.resNumber += 1
                                isHad = true
                                break
                            }
                        }
                        if(!isHad){
                            this.beApResData.push({
                                apID: '',
                                city: fkey['城市'],
                                district: fkey['区域'],
                                resName: fkey['小区名称'],
                                resID: '',
                                prName: '',
                                resNumber: 1,                  // 相同资源个数，方便删除时操作
                            })
                        }
                    }
                }
                console.log('导入成功后把数据并入资源列表',this.beApResData)
                this.computeCityResNum()
            },
            //导出
            exportExcel(){
              console.log('导出',this.beApResData)
                let resList = [] //this.beApResData.concat()
                let apResList = this.beApResData.concat()
                for(let key of apResList){
                    resList.push({city: key.city,area: key.district,resName: key.resName})
                }
                require.ensure([], () => {
                    const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
                    const tHeader = ['城市', '区域', '小区名称'];
                    const filterVal = ['city', 'area', 'resName'];
                    const list = resList; // this.resRateList;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel(tHeader, data, this.basicForm.planName + '-投放社区表格');
                })
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            },
            // 面后面添加逗号
            setComma(value) {
                if (value) {
                    let index = value.indexOf("面");
                    let arr = value.split("");
                    arr.splice(index + 1, 0, ",");
                    return arr.join("");
                }
            },
            // step3 上传物料 排序合并表格
            getSpanArr(data) {
                for (let i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i].material === data[i - 1].material) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }
                    }
                }
            },
            /*通过给table传入span-method方法可以实现合并行或列，方法的参数是一个对象，里面包含当前行row、
            当前列column、当前行号rowIndex、当前列号columnIndex四个属性。该函数可以返回一个包含两个元素的数组，
            第一个元素代表rowspan，第二个元素代表colspan。 也可以返回一个键名为rowspan和colspan的对象。*/
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                // console.log('row',row,'column',column,'rowIndex',rowIndex,'columnIndex',columnIndex)
                if (columnIndex === 0) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            // 上传文件点击事件 - 获取上传前的校验限制
            uploadClick(row){
                console.log('row',row)
                this.uploadType = row.type
                this.uploadSize = row.limitsize
                this.uploadRow = row
            },
            // 删除
            fileUploadClose(row){
                for(let mkey of this.materialMsgTableData){
                    if(mkey.index === row.index){
                        mkey.btnDisable = false
                        mkey.fileSuccess = true
                        mkey.fileName = ''
                        mkey.fileUploadId = ''
                        break
                    }
                }
            },
            //上传前校验
            materialBeforeUpload(file){
                console.log('上传前校验',file,'大小',this.uploadSize,'类型',this.uploadType,this.uploadRow)
                let isJPG = ''
                let isGIF = ''
                let isPNG = ''
                let isWEBP = ''
                let isMP4 = ''
                if(this.uploadType === 'mp4'){
                    isMP4 =  file.type === 'video/mp4'
                }else{
                    if(this.uploadType.indexOf('jpg') !== -1){
                        isJPG = file.type === 'image/jpeg';
                    }
                    if(this.uploadType.indexOf('png') !== -1){
                        isPNG = file.type === 'image/png';
                    }
                    if(this.uploadType.indexOf('gif') !== -1){
                        isGIF = file.type === 'image/gif';
                    }
                    if(this.uploadType.indexOf('webp') !== -1){
                        isWEBP = file.type === 'image/webp';
                    }
                }

                let isSize = ''
                if(this.uploadSize.indexOf('M') !== -1){
                    let arr = this.uploadSize.split('M')
                    console.log('arrM',arr)
                    isSize= file.size / 1024 / 1024 <= Number(arr[0])
                }else{
                    let arr = this.uploadSize.split('k')
                    console.log('arrk',arr)
                    isSize= file.size <= (Number(arr[0] ) * 1024)
                    console.log('isSize',isSize)
                }
                if (!isSize) {
                    this.changeFileBtnDisable()
                    this.$message.error('上传文件大小不能超过' + this.uploadSize);
                    return false
                }
                if(this.uploadType === 'mp4'){
                    if(!isMP4){
                        this.changeFileBtnDisable()
                        this.$message.error('上传视频必须是'+ this.uploadType +'格式!');
                        return false
                    }
                }else{
                    // this.uploadRow
                    console.log( !isJPG , !isGIF , !isPNG , !isWEBP)
                    if(this.uploadRow.index == '4' || this.uploadRow.index == '6'){
                        if (!isJPG && !isPNG ){
                            this.changeFileBtnDisable()
                            this.$message.error('上传图片必须是'+ this.uploadType +'格式!');
                            return false
                        }
                    }else if (!isJPG && !isGIF && !isPNG && !isWEBP) { //!isJPG && !isPNG && !isBMP  !(isJPG || isGIF || isPNG || isWEBP)
                        this.changeFileBtnDisable()
                        this.$message.error('上传图片必须是'+ this.uploadType +'格式!');
                        return false
                    }
                }
                return true
            },
            // 文件上传时 on-progress
            materialProgress(event, file, fileList){
              console.log('文件上传时',event, file, fileList)
                for(let mkey of this.materialMsgTableData){
                    mkey.btnDisable = true
                }
                this.materialLoading = this.$loading({
                    lock: true,
                    text: '素材加速上传中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.5)'
                });
            },
            // 素材上传成功
            materialSuccess(res, file){
                console.log('上传成功',res,file)
                this.materialLoading.close()
                for(let mkey of this.materialMsgTableData){
                    if(mkey.index !== this.uploadRow.index){
                        mkey.btnDisable = false
                        // break
                    }
                    // if(mkey.index !== res.data.type){
                    //     mkey.btnDisable = false
                    // }
                }
                let isSuccess = false
                if(res.code == '500200'){
                    this.$message.success(res.msg)
                    isSuccess = true
                    console.log('素材上传成功',this.materialMsgTableData)
                }else{
                    this.$message.error(res.msg)
                    isSuccess = false
                }
                // for(let mkey of this.materialMsgTableData){
                //     if(mkey.index === res.data.type){
                //         if(isSuccess){
                //             mkey.fileSuccess = false
                //             mkey.fileName = file.name
                //             mkey.fileUploadId = res.data.id
                //         }else{
                //             mkey.fileSuccess = true
                //             mkey.btnDisable = false
                //             mkey.uploadImgUrl = []
                //         }
                //     }
                // }
                for(let mkey of this.materialMsgTableData){
                    if(mkey.index === this.uploadRow.index){
                        if(isSuccess){
                            mkey.fileSuccess = false
                            mkey.fileName = file.name
                            mkey.fileUploadId = res.data.id
                        }else{
                            mkey.fileSuccess = true
                            mkey.btnDisable = false
                            mkey.uploadImgUrl = []
                        }
                    }
                }
            },
            // 删除文件
            materialRemoveFile(row) {
                // console.log(row,'删除文件')
                for(let mkey of this.materialMsgTableData){
                    if(mkey.index === row.index){
                        mkey.btnDisable = false
                        mkey.fileSuccess = true
                        mkey.fileName = ''
                        break
                    }
                }
            },
            //
            changeFileBtnDisable(){
                for(let mkey of this.materialMsgTableData){
                    if(mkey.index === this.uploadRow.index){
                        mkey.btnDisable = false
                        break
                    }
                }
            },
            //创建方案
            createApPlan(){
                // BDData: {uid: '0', realName: ''},
                let dateTime = this.mediaStrategyForm.dateTime
                let planArr = []
                for(let key of this.havePlanList){
                    planArr.push({plan_name: key.planName,associated_id: key.apID})
                }
                let resArr = []
                for(let rkey of this.beApResData){
                    resArr.push({
                        city: rkey.city,
                        district: rkey.district,            // 区域
                        community: rkey.resName,            // 社区资源名称
                        resID: rkey.resID === '' ? 0 : rkey.resID,
                    })
                }
                let resTable = []
                for(let tkey of this.resTableData){
                    resTable.push({
                        city: tkey.cityName,
                        community_count: tkey.resNum,            // 社区资源数
                        duration: tkey.res_day,                     //
                        discount: tkey.discount,
                        total: tkey.cityTotalPrice
                    })
                }
                let imgID = [{id:this.UploadID.n1}]
                console.log('素材数据',this.materialMsgTableData)
                for(let mkey of this.materialMsgTableData){
                    if(mkey.fileUploadId !== ''){
                        imgID.push({id: mkey.fileUploadId})
                    }
                }
                let params = {
                    plan_name: this.basicForm.planName,
                    company_id: this.basicForm.companyName,
                    company: this.cName,
                    brand_id: this.basicForm.companyBrand,
                    brand: this.cBand,
                    sales: this.BDData.realName,
                    sales_id: this.BDData.uid,
                    contacts_id: this.basicForm.ownerBU,
                    contacts: this.oBU,                                           // 联系人
                    budget: this.totalPrice,                               //  预算金额
                    begin_date: dateTime[0],
                    end_date: dateTime[1],
                    associatedPlans: planArr,//JSON.stringify(planArr),              // 联投方案
                    planDetails: resArr,//JSON.stringify(resArr),                    // 社区资源信息列表
                    planDetailSummaries: resTable,//JSON.stringify(resTable),       // 按城市统计资源数、价格、折扣等
                    plansAttachments: imgID,//JSON.stringify(imgID)
                }
                console.log('参数',params)
                if(this.isEdit === true){
                    params.plan_id = this.tvApID
                    api.postApi_new(this.apiVar.QKuyun + '/UpdatePlan',params).then(res=>{
                        console.log('编辑方案',res)     // 方案创建失败，素材尚未验证通过，请稍后...
                        if(res.data.code == '500300'){
                            this.$message.warning('方案创建失败，视频素材尚未验证通过，请稍后再试...')
                        }else if(res.data.code == '500200'){
                            this.active++
                        }else{
                            this.$message({
                                type:'warning',
                                message: '编辑失败'
                            })
                        }
                    })
                }else{
                    api.postApi_new(this.apiVar.QKuyun + '/AddPlan',params).then(res=>{
                        console.log('创建方案',res) // 方案创建失败，素材尚未验证通过，请稍后...res.data.msg
                        if(res.data.code == '500300'){
                            this.$message.warning('方案创建失败，视频素材尚未验证通过，请稍后再试...')
                        }else if(res.data.code == '500200'){
                            this.tvApID = res.data.data
                            this.active++
                        }else{
                            this.$message({
                                type:'warning',
                                message: '创建失败'
                            })
                        }
                    })
                }

            },

            // 获取公司及品牌
            getBand() {
                console.log('品牌列表列表',this.companyBrand,this.companyName)
                for (let n = 0; n < this.companyName.length; n++) {
                    if (this.companyName[n].value === this.basicForm.companyName) {
                        this.cName = this.companyName[n].label
                    }
                }
                for (let n = 0; n < this.companyBrand.length; n++) {
                    if (this.companyBrand[n].value === this.basicForm.companyBrand) {
                        this.cBand = this.companyBrand[n].label
                    }
                }
                // this.ownerBU
                for (let n = 0; n < this.ownerBU.length; n++) {
                    if (this.ownerBU[n].value === this.basicForm.ownerBU) {
                        this.oBU = this.ownerBU[n].label
                    }
                }
            },
            //计算天数差的函数，通用
            DateDiff(sDate1, sDate2) {    // sDate1和sDate2是2002.12.18格式
                let aDate, oDate1, oDate2, iDays
                aDate = sDate1.split("-")
                oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])    //转换为12-18-2002格式
                aDate = sDate2.split("-")
                oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
                iDays = Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24
                return iDays
            },
            // 获取当前时间并计算N天后的日期
            GetDateStr(AddDayCount) {
                let dd = new Date();
                dd.setDate(dd.getDate() + AddDayCount)    // 获取AddDayCount天后的日期
                let y = dd.getFullYear();
                let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1)  // 获取当前月份的日期，不足10补0
                let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()       // 获取当前几号，不足10补0
                return y + "-" + m + "-" + d
            },
            // 登录超时
            loginTimeout(){
                this.$message.warning("登录超时,请重新登录");
                this.$router.push("/login");
            },
        }
    }
</script>

<style scoped>

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
        margin-bottom: 34px;
        position: relative;
    }

    .mediaMana_content_top {
        padding: 42px 60px 0 60px;
    }

    .content_top_wrap, .content_bottom_wrap {
        background: #FFFFFF;
        border: 1px solid #DEDEDE;
        /*height: 830px;*/
        padding: 40px 18px 20px 18px;
    }

    .content_top_wrap .content_top_head {
        width: 100%;
        height: 35px;
        border-bottom: 1px solid #DEDEDE;
    }

    .content_bottom_wrap .content_bottom_head {
        width: 100%;
        height: 35px;
        border-bottom: 1px solid #DEDEDE;
    }

    .content_top_wrap .content_top_head h2, .content_bottom_wrap .content_bottom_head h2 {
        font-family: PingFangSC-Semibold;
        font-size: 16px;
        color: #2C313C;
        font-weight: bold;
        padding-left: 16px;
        height: 24px;
        margin-top: 8px;
    }

    .content_top_wrap .content_top_form_wrap, .content_bottom_wrap .content_bottom_form_wrap {
        padding: 18px;
    }

    /*步骤条*/
    /deep/ .el-step__title {
        position: relative;
        top: -35px;
        left: 39px;
    }

    /deep/ .el-step__title.is-process {
        font-size: 16px;
        color: #333333;
    }

    /deep/ .el-step.is-horizontal .el-step__line {
        height: 1px;
        top: 17px;
        left: 143px;
        right: 18px;;
    }

    /deep/ .el-step__icon-inner {
        font-weight: normal;
    }

    /deep/ .el-step__icon.is-text {
        width: 32px;
        height: 32px;
        border: 1px solid
    }

    /deep/ .is-process .el-step__icon.is-text {
        border: none;
        background-color: #108EE9;
        color: #fff;
    }

    /deep/ .el-step__head.is-success {
        color: #108EE9;
        border-color: #108EE9;
    }

    /deep/ .el-step__title.is-success {
        color: #666;
    }

    /deep/ .el-step__line-inner {
        border-width: 0px !important;
    }

    /deep/ .step-wrap {
        padding: 0 179px;
    }
    .advertTV_btn{
        width: 100%;
        text-align: center;
        margin-top: 40px;
    }
    .finishBtn{
        /*margin-top: 40px;*/
    }
    /deep/ .el-form.AdTVBasicForm {
        width: 416px;
        margin: 0 auto;
    }

    .el-input {
        width: 262px;
        height: 34px;
    }

    /deep/ .el-input__inner {
        width: 300px;
        height: 34px;
    }

    /*营业执照图片上传*/
    .Business-uploader{
        width: 130px;
        height: 160px;
        overflow: hidden;
    }
    /deep/ .Business-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .Business-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    /deep/ .Business-uploader .el-upload--picture-card,
    /deep/ .Business-uploader .el-upload-list--picture-card .el-upload-list__item{
        width: 128px;
        height: 160px;
    }

    /*step2*/
    /deep/ .AdTV_mediaStrategy .el-form.AdTVMSFrom{
        /*width: 670px;*/
        width: 57%;
        margin: 0 auto;
    }
    /deep/ .el-form.AdTVMSFrom .el-button [class*=el-icon-]+span, .select-wrap button .el-icon-search{
        top:0;
        left: 0;
    }
    .step2_ul .el-button{
        background: #FFFFFF;
        border: 1px solid #C2C2C2;
        border-radius: 4px;
        width: 106px;
        height: 34px;
        /*line-height: 34px;*/
        font-size: 14px;
        color: #666666;
        padding: 0;
    }
    .step2_ul li{
        max-height: 80px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    /*tag标签*/
    .step2_ul .el-tag{
        background: #F6F6F6;
        height: 34px;
        margin-right: 3px;
    }
    .excelUpload{
        display: inline-block;
    }
    .step2_price p{
        font-size: 20px;
        color: rgba(0,0,0,0.85);
    }
    .step2_price p>span{
        font-size: 14px;
        color: #666666;
    }
    .step2_price p .el-button{
        padding: 9px 20px
    }
    .has-gutter{
        background: #F6F6F6;
    }
    /*表格*/
    /deep/ .el-table th, .el-table tr {
        background: #F7F7F7;
        padding: 10px 0;
    }

    /deep/ .el-table__header .has-gutter th{
        height: 48px !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    /deep/ .el-table th > .cell {
        color: #666666;
        line-height: 14px;
        font-size: 14px;
        font-weight: bold;
    }

    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        max-height: 198px;
        overflow-y: scroll;
        overflow-x: hidden !important;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar,
    .step2_ul li::-webkit-scrollbar{
        width: 4px;
        background: #FAFAFA;

    }
    /*滚动条里面小方块*/
    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb,
    .step2_ul li::-webkit-scrollbar-thumb{

        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }
    .el-input-number{
        width: 301px;
    }
    /deep/ .step2_changePrice .el-input-number.is-controls-right .el-input__inner{
        text-align: left;
    }
    /*step2 方案选择模态框*/
    .step2_dialog_Btn{
        width: 100%;
        height: 40px;
    }
    /deep/ .step2_dialog_Btn .el-input{
        width: 300px;
    }
    .step2_dialog_Btn .el-button{
        width: 76px;
        height: 34px;
        padding: 0;
    }
    /deep/ .step2_dialog .el-dialog__body{
        padding: 10px 20px;
    }
    /deep/ .step2_dialog .el-dialog__footer{
        text-align: center;
    }
    /*超出省略*/
    /deep/ .el-table .cell {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /deep/ .planAdsTable .el-table__body-wrapper{
        height: 455px;
        max-height: 450px;
    }
    /*step3*/
    .AdTV_materialMsg{
        /*width: 700px;*/
        width: 68%;
        margin: 0 auto;
    }
    /deep/ .AdTV_materialMsg .el-table__body-wrapper {
        height: 440px;
        max-height: 440px;
        overflow-y: scroll;
        overflow-x: hidden !important;
    }
    /deep/ .AdTV_materialMsg .el-button [class*=el-icon-]+span{
        top:0;
        left: 0;
        margin-left: 0;
    }
    /deep/ .materialMsgFrom .el-tag{
        padding: 0 20px 0 10px;
        max-width: 160px;
        position: relative;
    }
    /deep/ .materialMsgFrom .el-tag .el-icon-close{
        position: absolute;
        top:8px;
        right: 1px;
    }
    /*step4完成创建*/
    .successIcon img {
        width: 72px;
    }

    .successIcon h2 {
        font-size: 24px;
        color: #333333;
        margin-top: 24px;
        margin-bottom: 8px;
        font-weight: bold;
    }

    .successIcon p {
        font-size: 14px;
        color: #999999;
        margin-bottom: 16px;
    }

    .planPanel, .successIcon {
        text-align: center;
    }

    .planPanel {
        width: 557px;
        height: 220px;
        background: #FAFAFA;
        border-radius: 2px;
        padding: 19px 0;
        box-sizing: border-box;
        margin: 0 auto;
    }

    .planPanel ul li {
        padding-left: 207px;
        text-align: left;
        font-size: 14px;
        color: #666666;
        margin-bottom: 24px;
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
    .planPanel li.money span{
        font-size: 12px;
        color: #666666;
    }
</style>
