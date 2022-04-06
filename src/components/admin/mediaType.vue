<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#">系统管理</a><em> / </em><a href="#">媒体类型</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_container">
                <el-row type="flex">
                    <el-col :span="4">
                        <div class="mediaTypeList">
                            <ul class="mediaTypeUl">
                                <li v-for="(item,index) in mediaTypeList" :key="item.id" :class="{'active':currentActiveTab==index}" @click="getMediaTypeDetail(item,index)">
                                    <div class="mediaType_see">
                                        <p>{{item.name}}</p>
                                    </div>
                                </li>
                            </ul>
                            <button class="createMedia" @click="addMediaType">新增媒体</button>
                        </div>
                    </el-col>
                    <el-col :span="19">
                        <div class="mediaDetail">
                            <div v-if="!isEditForm">
                                <h3>{{mediaTypeForm.name}}</h3>
                                <div class="mediaTable see">
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>媒体来源</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>{{sourceList | getOptionsLabel(mediaTypeForm.source)}}</p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>适用公司</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p><span class="see_all" @click="seeCompany(mediaTypeForm.id)">查看全部</span></p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>可投面数</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>{{mediaTypeForm.adSpaceNum}}</p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>售卖方式</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>{{saleTypeData | getOptionsLabel(mediaTypeForm.saleModel)}}</p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>监播照片尺寸</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>{{monitoringPhotosSizeData | getOptionsLabel(mediaTypeForm.pptType)}}</p>
                                        </div>
                                    </div>
                                    <!-- <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>刊例价模式</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>
                                                <span v-for="(item,index) in mediaTypeForm.publishPriceModel" :key="index">
                                                    {{priceModelData | getOptionsLabel(item)}} {{mediaTypeForm.publishPriceModel.length-1==index?'':'、'}}
                                                </span>
                                            </p>
                                        </div>
                                    </div> -->
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>投放方式</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>{{launchTypeData | getOptionsLabel(mediaTypeForm.releaseModel)}}</p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>广告位配置</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p v-for="item in mediaTypeForm.adSpaceConfig" :key="item.id">
                                                {{item.name}}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>媒体说明</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>{{mediaTypeForm.remark}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <el-form v-else :model="mediaTypeForm" :rules="rules" ref="mediaTypeForm">
                                <el-form-item prop="name" style="width: 220px;">
                                    <el-input v-model.trim="mediaTypeForm.name" maxlength="15" placeholder="请输入类型名称"></el-input>
                                </el-form-item>
                            
                                <div class="mediaTable form">
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>媒体来源</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>亲邻</p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>适用公司</p>
                                        </div>
                                        <!--编辑-则显示查看全部，新增-则显示暂无-->
                                        <div class="mediaTable_td" v-if="mediaTypeForm.id">
                                            <p><span class="see_all" @click="seeCompany(mediaTypeForm.id)">查看全部</span></p>
                                        </div>
                                        <div class="mediaTable_td" v-else>
                                            <p>暂无</p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>可投面数</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>
                                                <el-form-item prop="adSpaceNum">
                                                    <el-input-number 
                                                        :disabled="type=='edit'"
                                                        v-model.trim="mediaTypeForm.adSpaceNum" 
                                                        onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" 
                                                        :step-strictly="true" 
                                                        controls-position="right" 
                                                        :min="1"
                                                        :max="9">
                                                    </el-input-number>
                                                </el-form-item>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>售卖方式</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>
                                                <el-form-item prop="saleModel">
                                                    <el-radio-group v-model="mediaTypeForm.saleModel" :disabled="type=='edit'">
                                                        <el-radio :label="item.value" v-for="item in saleTypeData" :key="item.value">{{item.label}}</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>监播照片尺寸</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>
                                                <el-form-item prop="pptType">
                                                    <el-radio-group v-model="mediaTypeForm.pptType" :disabled="type=='edit'">
                                                        <el-radio :label="item.value" v-for="item in monitoringPhotosSizeData" :key="item.value">{{item.label}}</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </p>
                                        </div>
                                    </div>
                                    <!-- <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>刊例价模式</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>
                                                <el-form-item prop="publishPriceModel">
                                                    <el-checkbox-group v-model="mediaTypeForm.publishPriceModel" :disabled="type=='edit'">
                                                        <el-checkbox :label="item.value" v-for="item in priceModelData" :key="item.value">{{item.label}}</el-checkbox>
                                                    </el-checkbox-group>
                                                </el-form-item>
                                            </p>
                                        </div>
                                    </div> -->
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>广告下发方式</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>
                                                <el-form-item prop="releaseModel">
                                                    <el-radio-group v-model="mediaTypeForm.releaseModel" :disabled="type=='edit'">
                                                        <el-radio :label="item.value" v-for="item in launchTypeData" :key="item.value">{{item.label}}</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>广告位配置</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p v-for="(item,index) in mediaTypeForm.adSpaceConfig" :key="index">
                                                <el-form-item :prop="`adSpaceConfig.${index}.name`" :rules="rules.name">
                                                    <el-input :disabled="type=='edit'" style="width: 220px;" v-model.trim="item.name" maxlength="15" placeholder="广告位名称"></el-input>
                                                </el-form-item>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="mediaTable_tr">
                                        <div class="mediaTable_td">
                                            <p>媒体说明</p>
                                        </div>
                                        <div class="mediaTable_td">
                                            <p>
                                                <el-input
                                                    v-model.trim="mediaTypeForm.remark"
                                                    type="textarea"
                                                    :rows="3"
                                                    maxlength="50"
                                                    placeholder="请输入媒体说明">
                                                </el-input>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </el-form>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="actions_btn">
            <div class="edit" v-if="!isEditForm">
                <el-button type="primary" @click="editFun">编辑</el-button>
            </div>
            <div class="save" v-else>
                <el-button @click="isEditForm=false">取消</el-button>
                <el-button type="primary" @click="saveFun">保存</el-button>
            </div>
        </div>
        <el-dialog
            title="公司列表"
            :visible="isVisible"
            top="12vh"
            width="500px"
            @close="isVisible=false"
        >
            <el-table :data="companyList" v-loading="loading" border class="m-table">
                <el-table-column width="20%" property="num" label="序号"></el-table-column>
                <el-table-column width="80%" property="companyName" label="公司名称"></el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination clearfix">
            <el-pagination
                class="fr"
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange"
                :current-page="searchParams.pageNum"
                :page-sizes="[10,20,50,100]"
                :page-size="searchParams.pageSize"
                layout="total, prev, pager, next"
                :total="total"
                :background="true"
            >
            </el-pagination>
            </div>

            <div slot="footer" class="dialog-footer">
            <el-button @click="isVisible=false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import api from "../../api/api.js";
export default {
    name: "mediaType",
    data() {
        return{
            type: 'create',  //区分当前是新建还是编辑，create为新建，edit为编辑
            isVisible:false,
            loading: false,
            total: 0,
            searchParams: {
                id: 0,
                pageSize: 10,
                pageNum: 1
            },
            companyList:[],  //适用公司列表
            currentActiveTab: 0,  //当前选中的是哪个媒体类型
            isEditForm: false,  //是否显示编辑媒体类型的表单
            //媒体类型列表
            mediaTypeList:[],
            //来源数据
            sourceList:[
                {
                    label: '亲邻',
                    value: 1
                }
            ],
            //售卖方式数据
            saleTypeData:[
                {
                    label: '单面售卖',
                    value: 1
                },
                {
                    label: '整体售卖',
                    value: 2
                }
            ],
            //监播照片尺寸
            monitoringPhotosSizeData: [
                {
                    label: '4:5(广告门)',
                    value: 1
                },
                {
                    label: '6.6:5(道闸)',
                    value: 2
                }
            ],
            //刊例价模式
            priceModelData: [
                {
                    label: '分级定价',
                    value: 1
                },
                {
                    label: '统一定价',
                    value: 2
                }
            ],
            //投放方式数据
            launchTypeData: [
                {
                    label: '线上下发',
                    value: 1
                },
                {
                    label: '人工上画',
                    value: 2
                }
            ],
            //媒体类型form数据
            mediaTypeForm:{},
            //表单校验规则
            rules:{
                name: [
                    { required: true, message: '请输入类型名称', trigger: 'blur' }
                ],
                adSpaceNum:[
                    { required: true, message: '请输入可投面数', trigger: 'blur' }
                ],
                saleModel:[
                    { required: true, message: '请选择售卖方式', trigger: 'change' }
                ],
                pptType:[
                    { required: true, message: '请选择监播照片尺寸', trigger: 'change' }
                ],
                // publishPriceModel:[
                //     { required: true, type: 'array', message: '请选择刊例价模式', trigger: 'change' }
                // ],
                releaseModel:[
                    { required: true, message: '请选择投放方式', trigger: 'change' }
                ],
                'adSpaceConfig.name':[
                    { required: true, message: '请输入广告位配置', trigger: 'blur' }
                ]
            }
        }
    },
    filters:{
        getOptionsLabel(e,value){
            let optionItem=e.filter((item)=>{
                return item.value==value
            })
            if(optionItem.length>0){
                return optionItem[0].label
            }else{
                return null
            }
        }
    },
    watch: {
        //监听可投面数的数值变化，生成广告位配置
        'mediaTypeForm.adSpaceNum':function(newVal){
            let length=this.mediaTypeForm.adSpaceConfig.length
            if(newVal>length){
                //增加
                let difference=newVal-length;
                let _adSpaceConfig=[];
                for(let i=0;i<difference;i++){
                    _adSpaceConfig.push({
                        name:'' 
                    })
                }
                this.mediaTypeForm.adSpaceConfig=this.mediaTypeForm.adSpaceConfig.concat(_adSpaceConfig)
            }else{
                //减少
                let difference=length-newVal;
                let _adSpaceConfig=this.mediaTypeForm.adSpaceConfig;
                for(let i=0;i<difference;i++){
                    _adSpaceConfig.pop();
                }
                this.mediaTypeForm.adSpaceConfig=_adSpaceConfig;
            }
        }
    },
    mounted() {
        this.getMediaTypes();
    },
    methods:{
        handleCurrentChange (val) {
            this.searchParams.pageNum = val
            this.getMediaTypeCompany()
        },
        handleSizeChange (val) {
            this.searchParams.pageSize = val
            this.searchParams.pageNum = 1
            this.getMediaTypeCompany()
        },
        //查看公司列表
        seeCompany(_id){
            this.isVisible=true;
            this.searchParams.id=_id;
            this.getMediaTypeCompany();
        },
        //获取媒体类型公司列表
        getMediaTypeCompany(){
            this.loading=true;
            api.getApi('/addsp/api/v1/mediaTypes/pageMediaTypeCompany',{
                id: this.searchParams.id,
                pageNum: this.searchParams.pageNum,
                pageSize: this.searchParams.pageSize
            }).then(res=>{
                this.loading=false;
                if(res.data.SysCode == 200200) {
                    this.total=res.data.data.total;
                    let _list=res.data.data.list;
                    _list.forEach((item,index)=>{
                        item.num=(this.searchParams.pageNum-1)*this.searchParams.pageSize+index+1
                    })
                    this.companyList= _list;
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
        //媒体类型form数据初始化
        formInit(){
            let _mediaTypeForm={
                name: '',  //类型名称
                source: 1,  //来源  1：亲邻
                adSpaceNum: 1, //可投面数
                saleModel: null, //售卖方式
                pptType: null,  //监播照片尺寸
                // publishPriceModel: [], //刊例价模式
                releaseModel: null, //投放方式
                adSpaceConfig: [
                    {
                        name:'' 
                    }
                ],  //广告位配置
                remark: ''  //媒体说明
            }
            this.mediaTypeForm=_mediaTypeForm
        },
        //获取媒体类型详情
        getMediaTypeDetail(item,index){
            let _id=item.id;
            this.currentActiveTab=index;
            if(_id){
                //存在id，代表媒体类型已经创建了
                api.getApi('/addsp/api/v1/mediaType/details',{
                    id:_id
                }).then(res=>{
                    if(res.data.SysCode == 200200) {
                        let _data=res.data.data;
                        // _data.publishPriceModel=_data.publishPriceModel.split(",").map(Number);
                        this.mediaTypeForm=res.data.data;
                    }else{
                        this.$message({
                            message: res.data.MSG,
                            type: 'error'
                        });
                    }
                }).catch(err=>{
                    console.log(err);
                })
                this.isEditForm=false;
            }else{
                //不存在id，代表媒体类型还未创建
                this.type='create';
                this.isEditForm=true;
                this.formInit();
                this.$nextTick(()=>{
                    this.$refs['mediaTypeForm'].clearValidate();
                })
            }
        },
        //新增媒体类型
        addMediaType(){
            this.mediaTypeList.push({
                name:'未命名'
            })
        },
        //获取系统所有媒体类型列表
        getMediaTypes(){
            let Loading = this.$loading({
                lock: true,
                text: '正在加载中，请稍候...'
            });
            api.getApi('/addsp/api/v1/mediaTypes').then(res=>{
                if(res.data.SysCode == 200200) {
                    let _mediaTypeList=res.data.data
                    this.mediaTypeList=_mediaTypeList;
                    Loading.close();
                    let _currentActiveTab=this.currentActiveTab;
                    let firstMediaType=_mediaTypeList[_currentActiveTab]
                    this.getMediaTypeDetail(firstMediaType,_currentActiveTab)
                }else{
                    this.$message({
                        message: res.data.MSG,
                        type: 'error'
                    });
                }
            }).catch(err => {
                console.log(err);
                Loading.close();
            });
        },
        //编辑
        editFun(){
            this.type='edit';
            this.isEditForm=true;
        },
        //保存
        saveFun(){
            this.$refs['mediaTypeForm'].validate((valid) => {
                if (valid) {        
                    if(this.type=="create"){
                        //新建
                        let {
                            name,
                            source,
                            adSpaceNum,
                            saleModel,
                            pptType,
                            // publishPriceModel,
                            releaseModel,
                            adSpaceConfig,
                            remark
                        } = this.mediaTypeForm;
                        let _publishPriceModel='';
                        // publishPriceModel=publishPriceModel.sort()
                        // publishPriceModel.forEach((item)=>{
                        //     _publishPriceModel+=item+','
                        // })
                        // _publishPriceModel=_publishPriceModel.slice(0,_publishPriceModel.length-1)
                        let params={
                            name,
                            source,
                            adSpaceNum,
                            saleModel,
                            pptType,
                            // publishPriceModel:_publishPriceModel,
                            releaseModel,
                            adSpaceConfig,
                            remark
                        }
                        let Loading = this.$loading({
                            lock: true,
                            text: '正在保存中，请稍候...'
                        });
                        api.postApi_json('/addsp/api/v1/mediaTypes',params).then(res=>{
                            Loading.close();
                            if(res.data.SysCode == 200200) {
                                this.getMediaTypes();
                            }else{
                                this.$message({
                                    message: res.data.MSG,
                                    type: 'error'
                                });
                            }
                        }).catch(err => {
                            console.log(err);
                            Loading.close();
                        });
                    }else{
                        //编辑
                        let {
                            id,
                            name,
                            remark
                        } = this.mediaTypeForm;
                        let params={
                            id,
                            name,
                            remark
                        }
                        let Loading = this.$loading({
                            lock: true,
                            text: '正在保存中，请稍候...'
                        });
                        api.postApi_json('/addsp/api/v1/mediaTypes/update',params).then(res=>{
                            Loading.close();
                            if(res.data.SysCode == 200200) {
                                this.getMediaTypes();
                            }else{
                                this.$message({
                                    message: res.data.MSG,
                                    type: 'error'
                                });
                            }
                        }).catch(err => {
                            console.log(err);
                            Loading.close();
                        });
                    }
                } else {
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss" scoped>
>>>.el-form-item{
    margin-bottom: 0px;
}
>>>.el-form-item__error{
    top: 25%;
    left: 110%;
    width: 100%;
}
.mediaList_wrap{
    .mediaList_container{
        margin :16px 0px;
        .mediaTypeList{
            height: 100%;
            text-align :center;
            border-right: 0.5px solid #E6E7E9;
            .mediaTypeUl{
                width: 100%;
                li{
                    width: 100%;
                    height: 40px;
                    box-sizing: border-box;
                    .mediaType_see{
                        padding-left: 23px;
                        padding-right: 26px;
                        cursor: pointer;
                        height: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        >p{
                            font-size: 14px;
                            font-weight: 400;
                            color: rgba(0, 0, 0, 0.65);
                            line-height: 22px;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                        >img{
                            width: 16px;
                            height: 16px;
                            display: none;
                            cursor: pointer;
                        }
                    }
                    &:hover{
                        background: #E9F7FE;
                        border-right: 3px solid #1890FF;
                        .mediaType_see>p{
                            font-weight: 600;
                            color: rgba(24, 144, 255, 0.85);
                        }
                        .mediaType_see>img{
                            display: inline-block;
                        }
                    }
                    &.active{
                        background: #E9F7FE;
                        border-right: 3px solid #1890FF;
                    }
                }
            }     
            .createMedia{
                width: 80%;
                height: 40px;
                background: #1890FF;
                font-size: 14px;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 14px;
                outline: none;
                border: none;
                border-radius: 4px;
                margin-top: 14px;
                cursor: pointer;
            }
        }
        .mediaDetail{
            box-sizing: border-box;
            padding: 16px 32px;
            h3{
                font-size: 20px;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.85);
                line-height: 22px;
            }
            .mediaTable{
                width: 100%;
                border: 1px solid #E8E8E8;
                border-radius: 2px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.65);
                line-height: 22px;
                margin-top: 24px;
                .mediaTable_tr{
                    widows: 100%;
                    display: flex;
                    &:last-child{
                        p{
                            border-bottom: none;
                        }
                    }
                    .mediaTable_td{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        &:nth-child(1){
                            width: 13%;
                            background: #FAFAFA;
                            border-right: 1px solid #E8E8E8;
                        }
                        &:nth-child(2){
                            width: 87%;
                        }
                        >p{
                            padding: 16px;
                            border-bottom: 1px solid #E8E8E8;
                            flex: 1;
                            display: flex;
                            align-items: center;
                            .see_all{    
                                color: #1890FF;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }
        }
    }
} 
.actions_btn{
    margin: 0 64px;
    text-align: center;
    margin: 32px 0px;
}
</style>
<style lang="scss" scoped>
.m-table {
  width: 100%;
  /deep/ table {
    width: 100% !important;
    th {
      background: #fafafa;
      height: 46px;
      & > .cell {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
  /deep/ .el-table__empty-block {
    width: 100% !important;
  }
}

.pagination {
  padding: 16px 0 24px 0;
  display: flex;
  justify-content: flex-end;
}

.opt {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1890ff;
  cursor: pointer;
}

/deep/.el-pagination {
  padding: 0;
  button:last-of-type {
    margin-right: 0;
  }
}

/deep/ .el-dialog__body {
  padding: 24px;
  padding-bottom: 0;
}

/deep/ .el-dialog__footer {
  padding: 11px 24px;
  border-top: 1px solid #e9e9e9;
}

/deep/ .el-table__row {
  .cell {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
  }
}

/deep/ .el-table tr td {
  height: 46px;
  padding: 0;
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #e9e9e9;
  padding: 15px 24px;
  .el-dialog__title {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>