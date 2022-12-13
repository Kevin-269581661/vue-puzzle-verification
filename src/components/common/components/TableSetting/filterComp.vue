<template>
    <div style="margin-left: 8px;">
        <el-popover popper-class="filter-popover" placement="bottom" trigger="click">
            <div class="filter-box">
                <div class="filter-box-title">
                    <el-checkbox v-model="allChecked" @change="checkAll">列展示</el-checkbox>
                    <span @click="toReset">重置</span>
                </div>
            </div>
            <div class="filter-box-outer">
                <div class="filter-box-inner">
                    <!-- 左侧 -->
                    <span class="inner-fix" v-if="leftFixList.length">固定在左侧</span>
                    <draggable
                        handle=".mover"
                        v-model="leftFixList"
                        forceFallback="true"
                        group="fixLeft"
                        animation="500"
                        @start="onStart"
                        @end="onEnd"
                        :move="onMove"
                    >
                        <div
                            class="inner-column-item"
                            v-for="item in leftFixList"
                            :key="item.id"
                        >
                            <i class="el-icon-menu mover"></i>
                            <el-checkbox v-model="item.isChecked" @change="toInit">{{ item.label }}</el-checkbox>
                            <span class="fix-icon" @click="notToFix(item)">
                                <i class="el-icon-minus" style="font-size: 14px;"></i>
                            </span>
                        </div>
                    </draggable>
                    <!-- 不固定 -->
                    <span class="inner-fix">不固定</span>
                    <draggable
                        handle=".mover"
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
                            <i class="el-icon-menu mover"></i>
                            <el-checkbox v-model="item.isChecked" @change="toInit">{{ item.label }}</el-checkbox>
                            <span class="fix-icon" @click="toFixLeft(item)">
                                <i class="el-icon-upload2" style="font-size: 16px;"></i>
                            </span>
                        </span>
                    </draggable>
                    <!-- 右侧 -->
                    <span class="inner-fix" v-if="rightFixList.length">固定在右侧</span>
                    <span class="inner-column-item" v-for="item in rightFixList" :key="item.id" group="fixRight">
                        <i class="el-icon-menu"></i>
                        <el-checkbox checked disabled>{{ item.label }}</el-checkbox>
                    </span>
                </div>
            </div>
            <span slot="reference" style="cursor: pointer">
                <el-tooltip class="item" effect="dark" content="列设置" placement="top">
                    <i style="font-size: 22px; color: rgba(0, 0, 0, 0.65);" class="el-icon-setting"></i>
                </el-tooltip>
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
        },
        cacheKey: {
            type: String,
            default: () => ''
        }
    },
    data() {
        return {
            drag: false,
            // 是否全选
            allChecked: false,
            // 左侧固定数组
            leftFixList: [],
            // 不固定数组
            notFixList: [],
            // 右侧固定数组
            rightFixList: [],
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
        this.delColsType()
        this.$emit('filterColumn', [...this.leftFixList, ...this.notFixList, ...this.rightFixList])
        this.isCheckAll()
    },
    computed: {
        // 选中数组
        CheckedList() {
            const arr = [...this.notFixList.filter(v => v.isChecked), ...this.leftFixList.filter(v => v.isChecked)]
            if(arr.length === (this.notFixList.length + this.leftFixList.length)) {
                this.allChecked = true
            } else {
                this.allChecked = false
            }
            return arr
        }
    },
    watch: {
        columns(oldCol, newCol) {
            // 判断是否更新
            const isUpdate = this.isArrDifferent(oldCol, newCol)
            if (isUpdate) {
                this.delColsType()
            }
        }
    },
    methods: {
        // 判断两个数组是否相同
        isArrDifferent(arr1, arr2) {
            const a = arr1.filter(x => !arr2.some(y => y.id === x.id))
            const b = arr2.filter(x => !arr1.some(y => y.id === x.id))
            if (a.length || b.length) {
                return true
            } else {
                return false
            }
        },
        // 列字段类型处理
        delColsType() {
            // 获取本地缓存
            const allColumnList = getLocalCache(`${this.cacheKey}-allColumnList`)
            const notFixList = getLocalCache(`${this.cacheKey}-notFixList`)
            const leftFixList = getLocalCache(`${this.cacheKey}-leftFixList`)
            const rightFixList = getLocalCache(`${this.cacheKey}-rightFixList`)

            // 列字段类型处理
            const initList = this.columns.filter(v => v.fix === 'not')
            const initLeftList = this.columns.filter(v => v.fix === 'left')
            const initRightList = this.columns.filter(v => v.fix === 'right')

            // 备份初始设置
            this.initList = JSON.parse(JSON.stringify(initList))
            this.initLeftList = JSON.parse(JSON.stringify(initLeftList))
            this.initRightList = JSON.parse(JSON.stringify(initRightList))

            // 更新列字段
            const updateColumns = () => {
                this.notFixList = JSON.parse(JSON.stringify(initList))
                this.leftFixList = JSON.parse(JSON.stringify(initLeftList))
                this.rightFixList = JSON.parse(JSON.stringify(initRightList))
                addLocalCache(`${this.cacheKey}-notFixList`, this.notFixList)
                addLocalCache(`${this.cacheKey}-leftFixList`, this.leftFixList)
                addLocalCache(`${this.cacheKey}-rightFixList`, this.rightFixList)
                // 缓存总的列字段，用于比较是否更新
                addLocalCache(`${this.cacheKey}-allColumnList`, this.columns)
            }
            // 判断是否存在配置
            if(allColumnList) {
                // 判断是否更新
                if (this.isArrDifferent(allColumnList, this.columns)) {
                    updateColumns()
                }
                else {
                    this.notFixList = notFixList
                    this.leftFixList = leftFixList
                    this.rightFixList = rightFixList
                }
            }
            else {
                updateColumns()
            }
        },
        // 刷新列表
        toInit() {
            addLocalCache(`${this.cacheKey}-notFixList`, this.notFixList)
            addLocalCache(`${this.cacheKey}-leftFixList`, this.leftFixList)
            this.$emit('filterColumn', [...this.leftFixList, ...this.notFixList, ...this.rightFixList])
            this.isCheckAll()
        },
        // 重置
        toReset() {
            this.allChecked = false
            this.$emit('filterColumn', [...this.initLeftList, ...this.initList, ...this.initRightList])
            addLocalCache(`${this.cacheKey}-notFixList`, this.initList)
            addLocalCache(`${this.cacheKey}-leftFixList`, this.initLeftList)
            this.$nextTick(() => {
                // 初始化列展示弹窗
                this.notFixList = JSON.parse(JSON.stringify(this.initList))
                this.leftFixList = JSON.parse(JSON.stringify(this.initLeftList))
                this.rightFixList = JSON.parse(JSON.stringify(this.initRightList))
                this.isCheckAll()
            })
        },
        // 全选 / 全不选
        checkAll() {
            this.leftFixList.forEach(v => v.isChecked = this.allChecked)
            this.notFixList.forEach(v => v.isChecked = this.allChecked)
            this.toInit()
        },
        // 是否全选
        isCheckAll() {
            const arr = [...this.notFixList.filter(v => v.isChecked), ...this.leftFixList.filter(v => v.isChecked)]
            if(arr.length === (this.notFixList.length + this.leftFixList.length)) {
                this.allChecked = true
            } else {
                this.allChecked = false
            }
        },
        // 不固定
        notToFix(item) {
            // 获取点击项的下标
            const index = this.leftFixList.findIndex(v => v.id === item.id)
            this.leftFixList[index].fix = 'not'
            // 不固定数组中插入该项
            this.notFixList.splice(index, 0, item)
            // 左侧固定数组中删除该项
            this.leftFixList.splice(index, 1)
            this.toInit()
        },
        // 固定左侧
        toFixLeft(item) {
            const index = this.notFixList.findIndex(v => v.id === item.id)
            this.notFixList[index].fix = 'left'
            this.leftFixList.push(item)
            this.notFixList.splice(index, 1)
            this.toInit()
        },
        //开始拖拽事件
        onStart(e){
            this.drag = true;
        },
        //拖拽结束事件
        onEnd(e) {
            this.drag = false;
            this.currList.splice(this.oldIndex, 1)
            this.currList.splice(this.newIndex, 0, this.currObj)
            this.$emit('filterColumn', [...this.leftFixList, ...this.notFixList, ...this.rightFixList])
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
    min-height: 100px;
    max-height: 500px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }

    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
        border-radius: 0;
        background: #fafafa;
    }

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
            height: 24px;

            /deep/ i.el-icon-menu {
                display: block;
                line-height: 20px;
                color: #D6D6D6;
                cursor: grab;
                padding: 4px 12px 0 12px;
            }

            /deep/ label.el-checkbox {
                min-width: 130px;
                max-width: 300px;
            }

            .fix-icon {
                visibility: hidden;
                width: 28px;
                color: #1890ff;
                padding-left: 10px;
            }

            &:hover {
                background: #E6F7FF;

                .fix-icon {
                    visibility: visible;
                }
            }

        }
    }
}

</style>
<style lang="scss">
.el-popover.filter-popover {
    box-sizing: border-box;
    padding: 0 !important;
    padding-bottom: 6px !important;
    width: max-content;
}
</style>
