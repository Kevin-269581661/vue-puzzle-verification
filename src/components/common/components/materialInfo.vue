<script>
import { Table, TableColumn } from 'element-ui';
export default {
    components:{
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
        }
    },
    data(){
        return{
            mediaType: '广告门',
        }
    },
    created(){
        console.log('material-----', this.material);
        console.log('material-----', this.daomater);
        this.materialInfo = this.material;        
        this.daomaterInfo = this.daomater;        
    },
    methods:{
    },
}
</script>
<template>
    <div class="third-wrap box-wrap">
        <div class="table_wrap">
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
                <el-table-column prop="pointNum" label="点位面数" min-width="12.7%">
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
                <el-table-column prop="pointNum" label="点位面数" min-width="12.7%">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
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
    margin: 8px 32px;
}

/deep/ .el-table th > .cell {
    font-weight: bold;
}
</style>

