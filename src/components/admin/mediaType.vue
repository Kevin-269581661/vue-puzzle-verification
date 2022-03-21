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
                                <li v-for="(item,index) in mediaTypeList" :key="index" :class="{isEdit:item.isEdit}">
                                    <div class="mediaType_see" v-if="!item.isEdit">
                                        <p>{{item.title}}</p>
                                        <img @click="item.isEdit=true;" src="../../assets/images/mediaTypeEdit.png" alt="">
                                    </div>
                                    <div class="mediaType_edit" v-else>
                                        <el-input v-model="item.editTitle" placeholder="媒体名称"></el-input>
                                        <span @click="saveMediaType(item)">保存</span>
                                        <span @click="cancelSaveMediaType(item)">取消</span>
                                    </div>
                                </li>
                            </ul>
                            <button class="createMedia" @click="addMediaType">新增媒体</button>
                        </div>
                    </el-col>
                    <el-col :span="19">
                        <div class="mediaDetail">
                            <h3>广告门</h3>
                            <div class="mediaTable see" v-if="!isEditForm">
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
                                    <div class="mediaTable_td">
                                        <p>查看全部</p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>可投面数</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>3</p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>售卖方式</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>单面售卖</p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>监播照片尺寸</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>4:5</p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>刊例价模式</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>分级定价、统一定价</p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>投放方式</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>线下投放</p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>广告位配置</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>
                                            A面、B面
                                        </p>
                                        <p>
                                            C面
                                        </p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>媒体说明</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>暂无</p>
                                    </div>
                                </div>
                            </div>
                            <div class="mediaTable form" v-else>
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
                                    <div class="mediaTable_td">
                                        <p>暂无</p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>可投面数</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>
                                            <el-input-number 
                                            onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" 
                                            :step-strictly="true" 
                                            controls-position="right" 
                                            v-model="mediaTypeForm.projectiveSurface" 
                                            :min="1"
                                            :max="9">
                                            </el-input-number>
                                        </p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>售卖方式</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>
                                            <el-radio-group v-model="mediaTypeForm.saleType">
                                                <el-radio :label="item.value" v-for="item in saleTypeData" :key="item.value">{{item.label}}</el-radio>
                                            </el-radio-group>
                                        </p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>监播照片尺寸</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>
                                            <el-radio-group v-model="mediaTypeForm.monitoringPhotosSize">
                                                <el-radio :label="item.value" v-for="item in monitoringPhotosSizeData" :key="item.value">{{item.label}}</el-radio>
                                            </el-radio-group>
                                        </p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>刊例价模式</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>
                                            <el-checkbox-group v-model="mediaTypeForm.priceModel">
                                                <el-checkbox :label="item.value" v-for="item in priceModelData" :key="item.value">{{item.label}}</el-checkbox>
                                            </el-checkbox-group>
                                        </p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>投放方式</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p>
                                            <el-radio-group v-model="mediaTypeForm.launchType">
                                                <el-radio :label="item.value" v-for="item in launchTypeData" :key="item.value">{{item.label}}</el-radio>
                                            </el-radio-group>
                                        </p>
                                    </div>
                                </div>
                                <div class="mediaTable_tr">
                                    <div class="mediaTable_td">
                                        <p>广告位配置</p>
                                    </div>
                                    <div class="mediaTable_td">
                                        <p v-for="(item,index) in mediaTypeForm.AdSpaceConfig" :key="index">
                                            <el-input style="width: 220px;" v-model="item.AdName" placeholder="广告位名称"></el-input>
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
                                            type="textarea"
                                            :rows="3"
                                            placeholder="请输入媒体说明">
                                            </el-input>
                                        </p>
                                    </div>
                                </div>
                            </div>
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
    </div>
</template>
<script>
export default {
    name: "mediaType",
    data() {
        return{
            isEditForm: false,  //是否显示编辑媒体类型的表单
            //媒体类型列表
            mediaTypeList:[
                {
                    title:'广告门',
                    editTitle:'广告门',
                    isEdit: false
                },
                {
                    title:'道闸',
                    editTitle:'道闸',
                    isEdit: false
                },
                {
                    title:'人脸机',
                    editTitle:'人脸机',
                    isEdit: false
                }
            ],
            //售卖方式数据
            saleTypeData:[
                {
                    label: '单面售卖',
                    value: 1
                },
                {
                    label: '多面售卖',
                    value: 2
                }
            ],
            //监播照片尺寸
            monitoringPhotosSizeData: [
                {
                    label: '4:5',
                    value: 1
                },
                {
                    label: '6.6:5',
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
                    label: '线下投放',
                    value: 1
                },
                {
                    label: '线上下发',
                    value: 2
                }
            ],
            //媒体类型form数据
            mediaTypeForm:{
                projectiveSurface: 1, //可投面数
                saleType: '', //售卖方式
                monitoringPhotosSize: '',  //监播照片尺寸
                priceModel: [], //刊例价模式
                launchType: '', //投放方式
                AdSpaceConfig: [
                    {
                        AdName:''
                    }
                ],  //广告位配置
                mediaDesc: ''  //媒体说明
            }
        }
    },
    watch: {
        //监听可投面数的数值变化，生成广告位配置
        'mediaTypeForm.projectiveSurface':function(newVal,oldVal){
            if(newVal>oldVal){
                //增加
                let difference=newVal-oldVal;
                let _AdSpaceConfig=[];
                for(let i=0;i<difference;i++){
                    _AdSpaceConfig.push({
                        AdName:'' 
                    })
                }
                this.mediaTypeForm.AdSpaceConfig=this.mediaTypeForm.AdSpaceConfig.concat(_AdSpaceConfig)
            }else{
                //减少
                let difference=oldVal-newVal;
                let _AdSpaceConfig=this.mediaTypeForm.AdSpaceConfig;
                for(let i=0;i<difference;i++){
                    _AdSpaceConfig.pop();
                }
                this.mediaTypeForm.AdSpaceConfig=_AdSpaceConfig;
            }
        }
    },
    methods:{
        //新增媒体类型
        addMediaType(){
            this.mediaTypeList.push({
                title:'未命名',
                editTitle:'',
                isEdit: true
            })
        },
        //保存媒体类型名称
        saveMediaType(item){
            item.isEdit=false;
            item.title=item.editTitle;
        },
        //取消保存媒体类型名称
        cancelSaveMediaType(item){
            item.isEdit=false;
            item.editTitle=item.title;
        },
        //编辑
        editFun(){
            this.isEditForm=true;
        },
        //保存
        saveFun(){
            this.isEditForm=false;
        }
    }
}
</script>
<style scoped>
.mediaList_wrap .mediaList_container{
    margin :16px 0px;
}
.mediaTypeList{
    height: 100%;
    text-align :center;
    border-right: 0.5px solid #E6E7E9;
}
.mediaTypeUl{
    width: 100%;
}
.mediaTypeUl>li{
    width: 100%;
    height: 40px;
    box-sizing: border-box;
}
.mediaType_see{
    padding-left: 23px;
    padding-right: 26px;
}
.mediaType_edit{
    padding-left: 23px;
    padding-right: 14px;
}
.mediaType_edit>>>.el-input,.mediaType_edit>>>.el-input>.el-input__inner{
    height: 32px;
}
.mediaType_edit>>>.el-input>.el-input__inner{
    padding: 0 6px;
}
.mediaType_see,.mediaType_edit{
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.mediaTypeUl>li>.mediaType_see>p{
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 22px;
}
.mediaTypeUl>li>.mediaType_see>img{
    width: 16px;
    height: 16px;
    display: none;
    cursor: pointer;
}
.mediaTypeUl>li:hover,.mediaTypeUl>li.isEdit{
    background: #E9F7FE;
    border-right: 3px solid #1890FF;
}
.mediaTypeUl>li:hover>.mediaType_see>p{
    font-weight: 600;
    color: rgba(24, 144, 255, 0.85);
}
.mediaTypeUl>li:hover>.mediaType_see>img{
    display: inline-block;
}
.mediaType_edit >span{
    font-size: 14px;
    font-weight: 400;
    color: #1890FF;
    line-height: 22px;
    white-space: nowrap;
    margin-left: 8px;
    cursor: pointer;
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
.mediaDetail{
    box-sizing: border-box;
    padding: 16px 32px;
}
.mediaDetail>h3{
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
}
.mediaTable>.mediaTable_tr:last-child p{
    border-bottom: none;
}
.mediaTable_tr{
    widows: 100%;
    display: flex;
}
.mediaTable_tr>.mediaTable_td:nth-child(1){
    width: 13%;
    background: #FAFAFA;
    border-right: 1px solid #E8E8E8;
}
.mediaTable_tr>.mediaTable_td:nth-child(2){
    width: 87%;
}
.mediaTable_tr>.mediaTable_td{
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.mediaTable_tr>.mediaTable_td>p{
    padding: 16px;
    border-bottom: 1px solid #E8E8E8;
    flex: 1;
    display: flex;
    align-items: center;
}
.actions_btn{
    margin: 0 64px;
    text-align: center;
    margin: 32px 0px;
}
</style>