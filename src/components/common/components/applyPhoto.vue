<script>
import dayToWeek from '../../../commonFun/dayToWeek.js';
// 价格格式化
import commaFormat from "../../../commonFun/commaFormat.js";
// 消费偏好json
// import allHoppy from "../../../commonFun/json/allHoppy.json";
import allHoppy from "../../../commonFun/json/allHoppy_new.json";
// 消费偏好转换中文
import hoppyToText from "../../../commonFun/hoppyToText.js";
// 时间格式化
import dateFormat from "../../../commonFun/timeFormat.js";
import {
    Select,
    Option,
    Table,
    TableColumn,
    DatePicker,
    Button,
	Message,
	Cascader,
	Tag
} from "element-ui";
export default {
    components: {
        elSelect: Select,
        elOption: Option,
        elTable: Table,
        elTableColumn: TableColumn,
        elDatePicker: DatePicker,
		elButton: Button,
		elCascader: Cascader,
		elTag: Tag,
	},
	props:{
		data:{
			type: Array,
			default: []
		},
	},
	// created(){
	// 	for(let res of this.data){
	// 		res.schedules = [res.gsday, res.geday];
	// 	}
	// },
	computed:{
		totalCount(){
			let total = 0;
			let days = 0;
			for(let data of this.shopList){
				if(data.schedules){
					days = this.dayToNum(dayToWeek.toDays(data.schedules[0], data.schedules[1]));
					total += days*299;
				}
				// console.log(days, total);
			}

			return total;
		},
	},
	created(){
		for(let item of this.data){
			item.isSelect = false;
		}
		this.currData = JSON.parse(JSON.stringify(this.data));
		this.copyData = this.currData;
		this.shopList = [];
		this.photoData.hoppyType = [];
		console.log('allhoppy', allHoppy);
		console.log('this.data---', this.data);
		console.log('this.currData---', this.currData);
		this.allHoppy = allHoppy;
		this.hoppyTags = [{
			id: '100',
			value: '100,100',
			label: 'APP分类'
		},{
			id: '31',
			value: '31,31',
			label: '通用零售'
		},{
			id: '38',
			value: '38,38',
			label: '服装鞋包'
		}];
	},
    data() {
        return {
			// 返回到父组件数据
            photoData: {
                hoppyType: [],
                resData: []
			},
			// 时间限制
			dateRange: {
                beginDate: "",
                endDate: ""
			},
			copyData: [],
            pickerOptions: {
                disabledDate: time => {
                    let beginDateVal = new Date(
                        this.dateRange.beginDate
                    ).getTime();
                    let endDateVal =
                        new Date(this.dateRange.endDate).getTime() -60 * 60 * 24 * 1000;
                    if (beginDateVal || endDateVal) {
                        return (
                            time.getTime() < beginDateVal ||
                            time.getTime() > endDateVal
                        );
                    }
                }
            },
			// 表格数据
			currData: [],
			// 勾选的数据
			shopList: [],
			// 所有消费偏好
            allHoppy: [],
			// 搜索的社区关键字
            keyword: "",
			// 选择的时间段
			date: "",
			// 选好的消费偏好组合
			hoppyTags: [],
			// 选好的消费偏好
			selectHoppy:[],
			appList: [],
			// key: ''
        };
    },
    methods: {
		 // 价格加上逗号
        priceFormat(price) {
            return commaFormat.init(price);
		},
		// 向上取整
		dayToNum(day){
			let result = 0;
			result = Math.ceil(day/31);
			return result;
		},
		// 取消
        cancel() {
            this.$emit("cancel");
        },
		// 确定并且向上提交数据
        apply() {
			let ctList = [];
			for(let item of this.hoppyTags){
				ctList.push(item.id);
			}
			console.log('ctList-----------', ctList);
			let uType = JSON.parse(sessionStorage.getItem('session_data')).uType;
			if((uType == 'SM') && (!ctList.length)){
				Message.info('请选择消费偏好');
				return;
			}
			if(this.appList.length>5){
				Message.info('APP安装下最多选择5个');
				return;
			}
			if(ctList.length>8){
				Message.info('消费偏好选择多于8个');
				return;
			}
			console.log('ctlist', ctList);
			this.photoData.hoppyType = ctList;
			let data = this.shopList;
			this.photoData.resData = data;
			console.log('this.photoData---------', this.photoData);
            this.$emit("apply", this.photoData);
        },
		// 改变消费偏好
		checkHoppy(){
			let text = hoppyToText.getText(this.selectHoppy);
			let info = {
				id: this.selectHoppy[1],
				value: this.selectHoppy.join(','),
				label: text.second
			};
			console.log('text---------------', text);
			if(this.hoppyInclude(this.hoppyTags, this.selectHoppy)){
				Message.info('请不要选择重复的消费偏好！');
			}else{
				if(this.selectHoppy[0] == 101){
					if(this.appList.length<5 ){
						this.hoppyTags.push(info);
						this.appList.push(info);
					}else{
						Message.info('APP安装下最多选择5个');
					}
				}else{
					if(this.hoppyTags.length<8){
						this.hoppyTags.push(info);
					}else{
						Message.info('消费偏好选择不能多于8个');
					}
				}
			}
		},
		// 判断已选择的数据是否有要新添加的数据
		hoppyInclude(arr, info){
			let isInclude = false;
			for(let data of arr){
				if(data.id == info[1]){
					isInclude = true;
					break;
				}
			}
			return isInclude;
		},
		// 删除所选消费偏好
		deleHoppy(index){
			this.hoppyTags.splice(index, 1);
		},
		fiterTime(row, index){
			this.dateRange.beginDate = this.formatTime(row.lStar);
            this.dateRange.endDate = this.formatTime(row.lEnd);
		},
		// 时间格式规范
        formatTime(val) {
            return dateFormat.toDate(val, ".");
        },
		// 单选
		handleSelect(selection, row){
			console.log('selection___________', selection, row);
			row.isSelect = !row.isSelect;
			console.log('row.isSelect-------', row.isSelect);
			if(row.isSelect){
				let bool = true;
				for(let data of this.shopList){
					if(data.resID == row.resID){
						bool = false;
						break;
					}
				}
				if(bool){
					this.shopList.push(row);
				}
				
			}else{
				
				for(let i = 0; i< this.shopList.length; i++){
					if(this.shopList[i].resID == row.resID){
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
				for(let data of this.currData){
					data.isSelect = true
					let bool = true;
					for(let item of this.shopList){
						if(data.resID == item.resID){
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
				for(let data of this.currData){
					data.isSelect = false;
					for(let i = 0; i< this.shopList.length; i++){
						if(this.shopList[i].resID == data.resID){
							this.shopList.splice(i, 1);
							break;
						}
					}
				}
				console.log('取消全选之后的数据', this.shopList);
			}
		},
		// 搜索
		searchResName(){
			console.log(this.keyword);
			let arr = [];
			if(this.keyword){
				// for(let data of this.data){
				for(let data of this.copyData){
					if(data.resName.includes(this.keyword)){
						arr.push(data);
					}
				}
			}else{
				arr = this.copyData;
			}
			this.currData = arr; 
			console.log('toggleRowSelectionData--', this.currData);
			
			// let timer = setTimeout(() => {
			// 	for(let data of this.currData){
			// 		if(data.isSelect){
			// 			console.log('true---------');
			// 			this.$refs.multipleTable.toggleRowSelection(data, true);
			// 		}
			// 	}
			// 	clearTimeout(timer);
			// }, 0);

			this.SelectioUpdate();
			console.log(this.currData);
		},
		// 改变时间
        changeDate(date) {
			console.log('452',date);
			// this.key =!this.key;

			// let timer = setTimeout(() => {
			// 	for(let data of this.currData){
			// 		if(data.isSelect){
			// 			// console.log('true---------');
			// 			this.$refs.multipleTable.toggleRowSelection(data, true);
			// 		}
			// 	}
			// 	clearTimeout(timer);
			// }, 0);

			this.SelectioUpdate();
		},
		// 改变表格时间
		changeAllDate(){
			for(let data of this.currData){
				data.schedules = [this.date[0], this.date[1]];
				// if(data.isSelect){
				// 	this.$refs.multipleTable.toggleRowSelection(data, true);
				// }
			}
			// this.key =!this.key;

			// let timer = setTimeout(() => {
			// 	for(let data of this.currData){
			// 		if(data.isSelect){
			// 			// console.log('true---------');
			// 			this.$refs.multipleTable.toggleRowSelection(data, true);
			// 		}
			// 	}
			// 	clearTimeout(timer);
			// }, 0);
			this.SelectioUpdate();

			console.log('this.currData-----', this.currData);
			console.log('this.shopList-----', this.shopList);
		},
		// 是否勾选更新
		SelectioUpdate(){
			let timer = setTimeout(() => {
				for(let data of this.currData){
					if(data.isSelect){
						// console.log('true---------');
						this.$refs.multipleTable.toggleRowSelection(data, true);
					}
				}
				clearTimeout(timer);
			}, 0);
		},
		// 
		changeDateInit(row, index){
			console.log(row, index);
			// this.$set(this.data[index], 'schedules', row.schedules);
			// this.data.push();
			// this.currData.push();
			// this.key =!this.key;
			let timer = setTimeout(() => {
				for(let data of this.currData){
					if(data.isSelect){
						// console.log('true---------');
						this.$refs.multipleTable.toggleRowSelection(data, true);
					}
				}
				clearTimeout(timer);
			}, 0);
		},
	},
	watch:{
		data(){
			this.shopList = [];
			this.appList = [];
			this.keyword = '';
			// this.key =!this.key;
			for(let item of this.data){
				item.isSelect = false;
			}
			this.currData = JSON.parse(JSON.stringify(this.data));
			this.copyData = this.currData;
			if(!this.shopList.length){
				this.hoppyTags = [{
					id: '100',
					value: '100,100',
					label: 'APP分类'
				},{
					id: '31',
					value: '31,31',
					label: '通用零售'
				},{
					id: '38',
					value: '38,38',
					label: '服装鞋包'
				}];
			}
			// console.log('this.data---', this.data);
			// console.log('this.currData---', this.currData);
		}
	},
};
</script>
<template>
	<div>
		<div>
			<div class="adRole">
				<p>选择消费偏好</p>
				<el-tag
					:key="tag.id"
					v-for="(tag, index) in hoppyTags"
					closable
					:disable-transitions="false"
					@close="deleHoppy(index)">
					{{tag.label}}
				</el-tag>
				<el-cascader :options="allHoppy" :show-all-levels="false" v-model="selectHoppy" @change="checkHoppy"></el-cascader>
			</div>

			<div class="search">
				<!-- <span style="display:inline-block;width:50%"> -->
					<!-- <el-input placeholder="请输入社区名称" v-model="keyword" class="input_box" @change="searchResName()"></el-input> -->
					<el-input placeholder="请输入社区名称" v-model="keyword" @change="searchResName()"></el-input>
				<!-- </span> -->
				<!-- <span style="display:inline-block;width:22%;">
					<el-date-picker class="input_box date" v-model="date" type="daterange" range-separator="-" format="yyyy/MM/dd" value-format="yyyy/MM/dd" start-placeholder="创建日期" end-placeholder="创建日期" @change="changeAllDate()">
					</el-date-picker>
				</span> -->
			</div>
			<div class="table_content">
				<p>选择开通社区（{{this.shopList.length}}/{{this.data.length}}）</p>
				<el-table
					ref="multipleTable"
					:data="currData"
					@select="handleSelect"
                    @select-all="handleSelectAll"
					style="width: 100%" border>
					<el-table-column type="selection" width="35">
					</el-table-column>
					<el-table-column prop="city" label="城市" width="100">
					</el-table-column>
					<el-table-column prop="rName" label="区域" width="100">
					</el-table-column>
					<el-table-column prop="resName" label="社区名称" width="120">
					</el-table-column>
					<el-table-column label="投放时间">
						<template slot-scope="scope">
							<!-- <el-date-picker :key="scope.$index"  v-model="scope.row.schedules" type="daterange" range-separator="-" format="yyyy/MM/dd" value-format="yyyy/MM/dd" @change="changeDate(scope.row)" @blur="changeDateInit(scope.row, scope.$index)" @focus="fiterTime(scope.row, scope.$index)" :picker-options="pickerOptions">
							</el-date-picker> -->
							<el-date-picker :key="scope.$index"  v-model="scope.row.schedules" type="daterange" range-separator="-" format="yyyy/MM/dd" value-format="yyyy/MM/dd" @change="changeDate(scope.row)" @focus="fiterTime(scope.row, scope.$index)" :picker-options="pickerOptions">
							</el-date-picker>
						</template>
					</el-table-column>
				</el-table>
				<p class="priceInfo">
					<i class="fa fa-info-circle"></i> 总计：
					<span>￥</span>
					<span>{{priceFormat(this.totalCount)}}</span>
				</p>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="cancel()" size="mini">取消</el-button>
			<el-button type="primary" @click="apply" size="mini">确 定</el-button>
		</span>
	</div>
</template>
<style scoped>
/* .el-dialog__body{
      padding: 10px 20px;
  } */
.hoppy {
    width: 50%;
}
/deep/ .hoppy .el-input__inner {
    width: 100%;
    min-height: 34px;
}
.search {
    margin-top: 10px;
}
.input_box /deep/ .el-input__inner {
    /* font-size: 14px; */
    height: 34px;
    vertical-align: middle;
    width: 100%;
}
.date {
    width: 100%;
    /* margin-top: 8px;  */
}
/deep/.dialog-footer {
    display: block;
    text-align: right;
    margin-top: 20px;
}
.table_content {
    margin-top: 10px;
}
.search /deep/.el-date-editor {
    margin-top: 8px;
}
/deep/ .el-range-editor .el-range-input {
    width: 100px;
}
.priceInfo {
    text-align: right;
    margin-top: 18px;
}
.priceInfo span {
    font-size: 24px;
    font-weight: bold;
}
/deep/.el-range-editor.el-input__inner {
    width: 250px;
}
</style>
