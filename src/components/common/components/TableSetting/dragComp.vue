<template>
    <div style="margin-left: 8px;">
        <el-popover popper-class="filter-popover" placement="bottom" :width="200" trigger="click">
            <div class="filter-box">
                <div class="filter-box-title">
                    <el-checkbox v-model="allChecked" @change="checkAll">列展示</el-checkbox>
                    <span>重置</span>
                </div>
            </div>
            <div class="filter-box-outer">
                <div class="filter-box-inner">
                    <span class="inner-fix" v-if="fixLeftList.length">固定在左侧</span>
                    <draggable
                        v-model="fixLeftList"
                        forceFallback="true"
                        group="people"
                        animation="500"
                        @start="onStart"
                        @end="onEnd"
                    >
                        <span
                            class="inner-column-item"
                            v-for="item in fixLeftList"
                            :key="item.id"
                        >
                            <i class="el-icon-menu"></i>
                            <el-checkbox v-model="item.isChecked">{{ item.label }}</el-checkbox>
                            <span class="fix-icon" @click="notToFix(item)">
                                <i class="el-icon-minus" style="font-size: 14px;"></i>
                            </span>
                        </span>
                    </draggable>

                    <span class="inner-fix">不固定</span>
                    <draggable
                        v-model="notFixList"
                        forceFallback="true"
                        group="people"
                        animation="500"
                        @start="onStart"
                        @end="onEnd"
                    >
                        <span
                            class="inner-column-item"
                            v-for="item in notFixList"
                            :key="item.id"
                        >
                            <i class="el-icon-menu"></i>
                            <el-checkbox v-model="item.isChecked">{{ item.label }}</el-checkbox>
                            <span class="fix-icon" @click="toFixLeft(item)">
                                <i class="el-icon-upload2" style="font-size: 16px;"></i>
                            </span>
                        </span>
                    </draggable>

                    <span class="inner-fix">固定在右侧</span>
                    <span class="inner-column-item" v-for="item in fixRightList" :key="item.id">
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
//导入draggable组件
import draggable from 'vuedraggable'
export default {
//注册draggable组件
    components: {
        draggable,
    },
    data() {
        return {
            drag: false,
            // 是否全选
            allChecked: false,
            // 左侧固定数组
            fixLeftList: [],
            // 不固定数组
            notFixList: [
                { fix: "not", id: 1, label: "资源名称", isChecked: true },
                { fix: "not", id: 2, label: "城市", isChecked: true },
                { fix: "not", id: 3, label: "区域", isChecked: true },
                { fix: "not", id: 4, label: "街道", isChecked: true },
                { fix: "not", id: 5, label: "地址", isChecked: true },
                { fix: "not", id: 6, label: "商圈", isChecked: true },
                { fix: "not", id: 7, label: "媒体名称", isChecked: true },
                { fix: "not", id: 8, label: "媒体位ID", isChecked: false},
                { fix: "not", id: 9, label: "设备类型", isChecked: true },
                { fix: "not", id: 10, label: "位置类型", isChecked: true },
                { fix: "not", id: 11, label: "楼栋", isChecked: false },
                { fix: "not", id: 12, label: "单元", isChecked: false },
                { fix: "not", id: 13, label: "位置朝向", isChecked: false },
                { fix: "not", id: 14, label: "投放面", isChecked: false },
                { fix: "not", id: 15, label: "创建日期", isChecked: false },
            ],
            // 右侧固定数组
            fixRightList: [
                { fix:'right', id: 1, label: "媒体状态", disabled: true },
                { fix:'right', id: 2, label: "售卖状态", disabled: true },
                { fix:'right', id: 3, label: "操作", disabled: true },
            ],
        };
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
        // 全选
        checkAll() {
            this.fixLeftList.forEach(v => v.isChecked = this.allChecked)
            this.notFixList.forEach(v => v.isChecked = this.allChecked)
        },
        // 不固定
        notToFix(item) {
            // 获取点击项的下标
            const index = this.fixLeftList.findIndex(v => v.id === item.id)
            // 不固定数组中插入该项
            this.notFixList.splice(index, 0, this.fixLeftList[index])
            // 左侧固定数组中删除该项
            this.fixLeftList.splice(index, 1)
        },
        // 固定左侧
        toFixLeft(item) {
            const index = this.notFixList.findIndex(v => v.id === item.id)
            this.fixLeftList.splice(index, 0, this.notFixList[index])
            this.notFixList.splice(index, 1)
        },
        //开始拖拽事件
        onStart(){
            this.drag=true;
        },
        //拖拽结束事件
            onEnd() {
            this.drag=false;
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
