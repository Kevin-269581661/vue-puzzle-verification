<template>
    <div style="margin-left: 8px;">
        <el-popover popper-class="filter-popover" placement="bottom" :width="200" trigger="click">
            <div class="filter-box">
                <div class="filter-box-title">
                    <el-checkbox v-model="allChecked" @change="checkAll">列展示</el-checkbox>
                    <span @click="toReset">重置</span>
                </div>
            </div>
            <div class="filter-box-outer">
                <div class="filter-box-inner">
                    <!-- 左侧 -->
                    <span class="inner-fix" v-if="fixLeftList.length">固定在左侧</span>
                    <draggable
                        v-model="fixLeftList"
                        forceFallback="true"
                        group="fixLeft"
                        animation="500"
                        @start="onStart"
                        @end="onEnd"
                        :move="onMove"
                    >
                        <span
                            class="inner-column-item"
                            v-for="item in fixLeftList"
                            :key="item.id"
                        >
                            <i class="el-icon-menu"></i>
                            <el-checkbox v-model="item.isChecked" @change="toInit">{{ item.label }}</el-checkbox>
                            <span class="fix-icon" @click="notToFix(item)">
                                <i class="el-icon-minus" style="font-size: 14px;"></i>
                            </span>
                        </span>
                    </draggable>
                    <!-- 不固定 -->
                    <span class="inner-fix">不固定</span>
                    <draggable
                        v-model="notFixList"
                        forceFallback="true"
                        group="notFix"
                        animation="500"
                        @start="onStart"
                        @end="onEnd"
                        :move="onMove"
                    >
                        <span
                            class="inner-column-item"
                            v-for="item in notFixList"
                            :key="item.id"
                        >
                            <i class="el-icon-menu"></i>
                            <el-checkbox v-model="item.isChecked" @change="toInit">{{ item.label }}</el-checkbox>
                            <span class="fix-icon" @click="toFixLeft(item)">
                                <i class="el-icon-upload2" style="font-size: 16px;"></i>
                            </span>
                        </span>
                    </draggable>
                    <!-- 右侧 -->
                    <span class="inner-fix">固定在右侧</span>
                    <span class="inner-column-item" v-for="item in fixRightList" :key="item.id" group="fixRight">
                        <i class="el-icon-menu"></i>
                        <el-checkbox checked disabled>{{ item.label }}</el-checkbox>
                    </span>
                </div>
            </div>
            <span slot="reference" style="cursor: pointer">
                <i style="font-size: 22px; color: rgba(0, 0, 0, 0.85);" class="el-icon-setting"></i>
            </span>
        </el-popover>
    </div>
</template>
<script>
import { addLocalCache, getLocalCache } from "@/utils/user.js";
//导入draggable组件
import draggable from 'vuedraggable'
export default {
//注册draggable组件
    components: {
        draggable,
    },
    props: {
        columns: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            drag: false,
            // 是否全选
            allChecked: false,
            // 左侧固定数组
            fixLeftList: [],
            // 不固定数组
            notFixList: [],
            // 右侧固定数组
            fixRightList: [],
            // 默认设置
            defaultLeftList: [],
            defaultList: [],
            // 重置设置
            initList: [],
            initLeftList: [],
            initRightList: [],

            // 拖拽
            currList: [], // 目标数组
            currObj: {}, // 拖拽对象
            oldIndex: '', // 初始下标
            newIndex: '', // 目标下标
        }
    },
    mounted() {
        const initList = this.columns.filter(v => v.fix === 'not')
        const initLeftList = this.columns.filter(v => v.fix === 'left')
        const initRightList = this.columns.filter( v => v.fix === 'right')
        // 重置数据备份
        this.initList = JSON.parse(JSON.stringify(initList))
        this.initLeftList = JSON.parse(JSON.stringify(initLeftList))
        this.initRightList = JSON.parse(JSON.stringify(initRightList))

        // 本地是否存在默认配置，有直接拿，没有则保存
        const notFixList = getLocalCache("notFixList")
        if(notFixList) {
            this.notFixList = notFixList
        } else {
            this.notFixList = JSON.parse(JSON.stringify(initList))
            addLocalCache("notFixList", this.notFixList)
        }
        const fixLeftList = getLocalCache("fixLeftList")
        if(fixLeftList) {
            this.fixLeftList = fixLeftList
        } else {
            this.fixLeftList = JSON.parse(JSON.stringify(initLeftList))
            addLocalCache("fixLeftList", this.fixLeftList)
        }
        const fixRightList = getLocalCache("fixRightList")
        if(fixRightList) {
            this.fixRightList = fixRightList
        } else {
            this.fixRightList = JSON.parse(JSON.stringify(initRightList))
            addLocalCache("fixRightList", this.fixRightList)
        }
    },
    computed: {
        // 选中数组
        CheckedList() {
            const arr = [...this.notFixList.filter(v => v.isChecked), ...this.fixLeftList.filter(v => v.isChecked)]
            if(arr.length === (this.notFixList.length + this.fixLeftList.length)) {
                this.allChecked = true
            } else {
                this.allChecked = false
            }
            return arr
        }
    },
    methods: {
        // 刷新列表
        toInit() {
            addLocalCache("notFixList", this.notFixList)
            addLocalCache("fixLeftList", this.fixLeftList)
            this.$emit('filterColumn', [...this.fixLeftList, ...this.notFixList, ...this.fixRightList])
            this.isCheckAll()
        },
        // 重置
        toReset() {
            this.allChecked = false
            this.$emit('filterColumn', [...this.initLeftList, ...this.initList, ...this.initRightList])
            this.$nextTick(() => {
                // 初始化列展示弹窗
                this.notFixList = JSON.parse(JSON.stringify(this.initList))
                this.fixLeftList = JSON.parse(JSON.stringify(this.initLeftList))
                this.fixRightList = JSON.parse(JSON.stringify(this.initRightList))
                this.isCheckAll()
            })
        },
        // 全选
        checkAll() {
            this.fixLeftList.forEach(v => v.isChecked = this.allChecked)
            this.notFixList.forEach(v => v.isChecked = this.allChecked)
        },
        // 是否全选
        isCheckAll() {
            const arr = [...this.notFixList.filter(v => v.isChecked), ...this.fixLeftList.filter(v => v.isChecked)]
            if(arr.length === (this.notFixList.length + this.fixLeftList.length)) {
                this.allChecked = true
            } else {
                this.allChecked = false
            }
        },
        // 不固定
        notToFix(item) {
            // 获取点击项的下标
            const index = this.fixLeftList.findIndex(v => v.id === item.id)
            this.fixLeftList[index].fix = 'not'
            // 不固定数组中插入该项
            this.notFixList.splice(index, 0, this.fixLeftList[index])
            // 左侧固定数组中删除该项
            this.fixLeftList.splice(index, 1)
            this.toInit()
        },
        // 固定左侧
        toFixLeft(item) {
            const index = this.notFixList.findIndex(v => v.id === item.id)
            this.notFixList[index].fix = 'left'
            this.fixLeftList.splice(index, 0, this.notFixList[index])
            this.notFixList.splice(index, 1)
            this.toInit()
            // console.log('fixLeftList', this.fixLeftList);
        },
        //开始拖拽事件
        onStart(e){
            this.drag = true;
            // console.log(e);
        },
        //拖拽结束事件
        onEnd(e) {
            this.drag = false;
            this.currList.splice(this.oldIndex, 1)
            this.currList.splice(this.newIndex, 0, this.currObj)
            this.$emit('filterColumn', [...this.fixLeftList, ...this.notFixList, ...this.fixRightList])
        },
        onMove(e){
            this.currList = e.relatedContext.list // 当前数组
            this.currObj = e.draggedContext.element // 当前对象
            this.oldIndex = e.draggedContext.index // 初始下标
            this.newIndex = e.relatedContext.index // 目标下标
      },
    },
};
</script>

<style lang="scss" scoped>
.filter-box {
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    width: 100%;
    .filter-box-title {
        display: flex;
        justify-content: space-between;
        padding: 0 12px;
        line-height: 38px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);

        span {
            cursor: pointer;
            color: #1890ff;
        }
    }
}

.filter-box-outer {
    background-color: #fff;
    .filter-box-inner {
        .inner-fix {
            display: block;
            font-weight: 400;
            font-size: 12px;
            line-height: 32px;
            padding: 0 12px;
        }

        .inner-column-item {
            display: flex;
            align-items: center;
            width: 200px;
            height: 24px;

            /deep/ i.el-icon-menu {
                display: block;
                line-height: 20px;
                color: #D6D6D6;
                cursor: grab;
                padding: 0 12px;
            }

            /deep/ label.el-checkbox {
                width: 140px;
            }

            .fix-icon {
                display: none;
                width: 28px;
                color: #1890ff;
                padding-right: 16px;
            }

            &:hover {
                background: #E6F7FF;
                .fix-icon {
                    display: block;
                }
            }

        }
    }
}

</style>
<style lang="scss">
.el-popover.filter-popover {
    box-sizing: content-box;
    padding: 0 !important;
    padding-bottom: 6px !important;
}
</style>
