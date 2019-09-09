<template>
    <div class="third-wrap box-wrap">
        <div class="table_wrap">
            <p class="search-row">
                <el-button type="primary" size="small" @click="uploadMater()" v-show="isOrder">添加上画信息</el-button>
            </p>
            <el-radio-group v-model="mediaType" size="medium">
                <el-radio-button label="广告门"></el-radio-button>
                <el-radio-button label="道闸"></el-radio-button>
            </el-radio-group>
            <!-- 广告门 -->
            <el-table :data="material" border style="margin-top:16px;" v-if="mediaType=='广告门'" v-loading="loading" element-loading-text="玩命加载中..">
                <el-table-column label="序号" min-width="5.9%">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="adSize" label="广告尺寸" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="adViewSize" label="可视画面" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="resolution" label="分辨率" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="colorMode" label="颜色模式" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="photoFormat" label="文件格式" min-width="17.6%">
                </el-table-column>
                <el-table-column prop="pointNum" label="点位面数" min-width="12.7%" align="right">
                </el-table-column>
            </el-table>

            <el-table :data="daomater" border style="margin-top:16px;" v-loading="loading" element-loading-text="玩命加载中.." v-else>
                <el-table-column label="序号" min-width="5.9%">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="adSize" label="画面尺寸" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="adViewSize" label="灯箱尺寸" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="resolution" label="分辨率" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="colorMode" label="颜色模式" min-width="12.4%">
                </el-table-column>
                <el-table-column prop="photoFormat" label="文件格式" min-width="17.6%">
                </el-table-column>
                <el-table-column prop="pointNum" label="点位面数" min-width="12.7%" align="right">
                </el-table-column>
            </el-table>
        </div>

        <!-- 上传上画素材、备注弹框 -->
        <el-dialog
            title="画面备注信息"
            :visible.sync="showPhotoRemark">
            <p class="inline_dialog">
                <el-input v-model="resNameSec" placeholder="请输入资源名称" size="small"></el-input>
                <el-select v-model="mapName" placeholder="请选择地图中心点" size="small">
                    <el-option v-for="(item, index) of mapArr" :key="index" :label="item.name" :value="item.name"></el-option>
                </el-select>
                <el-button size="small" type="primary" @click="searchInfo()" :disabled="!isSearch">搜索</el-button>
                <el-button plain size="small" @click="resetInfo()" :disabled="!isReset">重置</el-button>
            </p>
            <p style="margin-top:15px;">
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
            <div class="car-title">
                <i class="el-icon-info" style="color: #1890FF;"></i>
                <h4>添加点位备注数量<span>{{remarkNum}}</span>个
                </h4>
            </div>
            <el-table :data="materInfoArr" border height="450" ref="multipleTable" v-loading="materloading" v-loadmore="materLoadMore" @select="handleSelect" @select-all="handleSelectAll" class="table_mater">
                <el-table-column type="selection" width="41px" scope="scope" >
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
                        <i class="el-icon-picture" :style="{color:scope.row.imgUrl?'#108DE7':'', margin: '0 10px'}" @click="previewImg(scope.row)" :disabled="!scope.row.imgUrl"></i>
                        <i class="el-icon-delete" :style="{color:scope.row.imgUrl?'#108DE7':''}" @click="deleteOneImg(scope.row, scope.$index)" :disabled="!scope.row.imgUrl"></i>
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
</template>

<script>
import { Table, TableColumn, Message } from 'element-ui';
import { api } from "../../../api/api.js";
import noSearchResult from "../components/noSearchResult.vue";
// 筛选过滤
import filterFormat from "../../../commonFun/filterTableData.js";
import sessFun from '../../../commonFun/sessFun.js';
// 时间格式化
import dateFormat from "../../../commonFun/timeFormat.js";

export default {
    components:{
        noSearchResult,
        elTable: Table,
        elTableColumn: TableColumn,
    },
    props:{
        material:{
            type: Array,
            default: []
        },
        daomater:{
            type: Array,
            default: []
        },
        loading: {
            type: Boolean,
            default: true
        },
        isOrder: {
            type:Boolean,
            default: false
        }
    },
    computed:{
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
    data(){
        return{
            mediaType: '广告门',
            sessionData: '',
            // 排期时间过滤
            filtersData: [],
            // 上传图片地址
            doUpload: "/advertisement/UpLoad",
            // 是否显示上传素材弹框
            showPhotoRemark: false,
            // 是否显示上画备注弹框
            showRemark: false,
            // 备注信息内容
            remarkInfo: '',
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
        }
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
    created(){
        console.log('material-----', this.material);
        console.log('material-----', this.daomater);
        this.sessionData = sessFun.getSess();
        this.materialInfo = this.material;
        this.daomaterInfo = this.daomater;
    },
    methods:{
        // 排期筛选
        filterTimeRange(value, row) {
            return row.timeRange === value;
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
            this.searchInfoFun();
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
                    console.log(dataArr, 'datearr--');
                    this.materInfoArr = this.materInfoArr.concat(this.formatData(dataArr));
                    console.log(this.materInfoArr, 'materinfoarr----');
                    this.loading_maInfo = true;
                    this.currInfoPage++;
                    this.SelectioUpdate();
                    this.filtersData = filterFormat(dataArr, "timeRange");
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
            let timeRange = dateFormat.toDate(item.lStar, '/') +'-'+ dateFormat.toDate(item.lEnd, '/');
            let timeRange1 = dateFormat.toDate(item.lStar, '/') +'-'+ dateFormat.toDate(item.lSetTime, '/');
            let obj = {
                resID: item.resID,
                lID: item.lID,
                lStar: item.lStar,
                lEnd: item.lEnd,
                asID: item.asID,
                resName: item.resName,
                mTitle: item.mTitle,
                asLab: item.asLab,
                city: item.city,
                rName: item.rName,
                map: item.mapCenterName,
                timeRange: item.lState==2? timeRange1 : timeRange,
                changePicTime: '',
                remark: item.remark?item.remark:'',
                imgUrl: item.picUrl?item.picUrl:'',
                uploadUser: item.uploadUser?item.uploadUser:'',
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
    },
}
</script>

<style scoped>
.box-wrap {
    background-color: #fff;
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
.table_wrap {
    margin: 0px 32px;
}

/deep/ .el-table th > .cell {
    font-weight: bold;
}

/* 弹出框样式 */
.car-title {
    background: #e6f7ff;
    border: 1px solid #bae7ff;
    border-radius: 4px;
    margin: 16px 0;
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
/* 搜索 */
.search-row {
    margin-bottom: 10px;
}
</style>

