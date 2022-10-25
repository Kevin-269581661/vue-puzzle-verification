<template>
    <div style="margin-left: 8px;">
        <el-popover popper-class="filter-popover" placement="bottom" :width="200" trigger="click">
            <div class="filter-box">
                <div class="filter-box-title">
                    <el-checkbox>列展示</el-checkbox>
                    <span>重置</span>
                </div>
            </div>
            <div class="filter-box-outer">
                <div class="filter-box-inner">
                    <span class="inner-fix" v-if="fixLeftList.length">固定在左侧</span>
                    <el-tree
                        ref="leftTree"
                        :data="fixLeftList"
                        node-key="id"
                        show-checkbox
                        default-expand-all
                        draggable
                        :allow-drop="allowDrop"
                        :allow-drag="allowDrag"
                        :default-checked-keys="leftTreeKeys"
                        :check-on-click-node="true"
                    >
                        <span class="custom-tree-node inner-column-item" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span class="fix-icon" @click="notToFix(node, data)">
                                <i class="el-icon-minus" style="font-size: 14px;"></i>
                            </span>
                        </span>
                    </el-tree>
                    <span class="inner-fix">不固定</span>
                    <el-tree
                        ref="tree"
                        :data="notFixList"
                        node-key="id"
                        show-checkbox
                        default-expand-all
                        draggable
                        :allow-drop="allowDrop"
                        :allow-drag="allowDrag"
                        :default-checked-keys="treeKeys"
                        :check-on-click-node="true"
                    >
                        <span class="custom-tree-node inner-column-item" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span class="fix-icon" @click="toFixLeft(node, data)">
                                <i class="el-icon-upload2" style="font-size: 16px;"></i>
                            </span>
                        </span>
                    </el-tree>
                    <span class="inner-fix">固定在右侧</span>
                    <el-tree
                        :data="fixRightList"
                        node-key="id"
                        show-checkbox
                        default-expand-all
                        :default-checked-keys="[1, 2, 3]"
                    >
                    </el-tree>
                </div>
            </div>
            <span slot="reference" style="cursor: pointer">
                <i style="font-size: 22px; color: rgba(0, 0, 0, 0.85);" class="el-icon-setting"></i>
            </span>
        </el-popover>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 左侧固定数组
            fixLeftList: [],
            // 右侧固定数组
            fixRightList: [
                { id: 1, label: "媒体状态", disabled: true },
                { id: 2, label: "售卖状态", disabled: true },
                { id: 3, label: "操作", disabled: true },
            ],
            // 不固定数组
            notFixList: [
                { id: 1, label: "媒体类型", isFixed: false, isChecked: true },
                { id: 2, label: "媒体名称", isFixed: false, isChecked: true },
                { id: 3, label: "投放面", isFixed: false, isChecked: true },
                { id: 4, label: "资产编号", isFixed: false, isChecked: true },
                { id: 5, label: "资源类型", isFixed: false, isChecked: true },
                { id: 6, label: "创建日期", isFixed: false, isChecked: true },
                { id: 7, label: "资源名称", isFixed: false, isChecked: true },
                { id: 8, label: "资源别名", isFixed: false, isChecked: false},
                { id: 9, label: "城市", isFixed: false, isChecked: true },
                { id: 10, label: "区域", isFixed: false, isChecked: true },
                { id: 11, label: "街道", isFixed: false, isChecked: false },
                { id: 12, label: "地址", isFixed: false, isChecked: false },
                { id: 13, label: "地址描述", isFixed: false, isChecked: false },
                { id: 14, label: "经纬度", isFixed: false, isChecked: false },
                { id: 15, label: "楼盘介绍", isFixed: false, isChecked: false },
                { id: 16, label: "Q云企小区名称", isFixed: false, isChecked: false },
                { id: 17, label: "楼盘类型", isFixed: false, isChecked: false },
                { id: 18, label: "楼盘价格", isFixed: false, isChecked: false },
                { id: 19, label: "住户数量", isFixed: false, isChecked: false },
                { id: 20, label: "楼栋数量", isFixed: false, isChecked: false },
                { id: 21, label: "单元数量", isFixed: false, isChecked: false },
                { id: 22, label: "入住年份", isFixed: false, isChecked: false},
                { id: 23, label: "商圈", isFixed: false, isChecked: true },
                { id: 24, label: "周边配套", isFixed: false, isChecked: false },
                { id: 25, label: "交通情况", isFixed: false, isChecked: false },
                { id: 26, label: "出入口数", isFixed: false, isChecked: false },
                { id: 27, label: "入住率", isFixed: false, isChecked: false },
                { id: 28, label: "配套电梯", isFixed: false, isChecked: false },
                { id: 29, label: "竞品公司", isFixed: false, isChecked: false },
                { id: 30, label: "居住人群", isFixed: false, isChecked: false },
                { id: 31, label: "车位数", isFixed: false, isChecked: false },
                { id: 32, label: "人流量", isFixed: false, isChecked: false },
                { id: 33, label: "车流量", isFixed: false, isChecked: false },
                { id: 34, label: "广告限制", isFixed: false, isChecked: false },
                { id: 35, label: "媒体位置", isFixed: false, isChecked: false },
                { id: 36, label: "媒体位ID", isFixed: false, isChecked: false },
                { id: 37, label: "设备ID", isFixed: false, isChecked: false },
                { id: 38, label: "设备类型", isFixed: false, isChecked: false },
                { id: 39, label: "位置类型", isFixed: false, isChecked: false },
                { id: 40, label: "素材尺寸", isFixed: false, isChecked: false },
                { id: 41, label: "可视尺寸", isFixed: false, isChecked: false },
                { id: 42, label: "设备状态 ", isFixed: false, isChecked: false },
                { id: 43, label: "备注"  , isFixed: false, isChecked: false },
                { id: 44, label: "楼栋", isFixed: false, isChecked: false },
                { id: 45, label: "单元", isFixed: false, isChecked: false },
                { id: 46, label: "楼层", isFixed: false, isChecked: false },
                { id: 47, label: "位置朝向", isFixed: false, isChecked: false },

            ],
            leftTreeKeys: [],
            // 不固定选中项id的数组
            treeKeys: [],
        }
    },
    mounted() {
        // 初始化默认选中项
        this.treeKeys.push(...this.notFixList.filter(item => item.isChecked).map(v => v.id))
        this.$refs.tree.setCheckedKeys(this.treeKeys)
    },
    methods: {
        // 取消固定
        notToFix(node, data) {
            // 获取点击项的下标
            const index = this.fixLeftList.findIndex(item => item.id === data.id)
            // 不固定数组中插入该项
            this.notFixList.splice(index, 0, this.fixLeftList[index])
            // 左侧固定数组中删除该项
            this.fixLeftList.splice(index, 1)
        },
        // 固定到左侧
        toFixLeft(node, data) {
            // 获取点击项的下标
            const index = this.notFixList.findIndex(item => item.id === data.id)
            // 左侧固定数组中插入该项
            this.fixLeftList.splice(index, 0, this.notFixList[index])
            // 不固定数组中删除该项
            this.notFixList.splice(index, 1)

            // 修改左侧固定选中状态
            this.leftTreeKeys.push(data.id);
            this.$refs.leftTree.setCheckedKeys(this.leftTreeKeys);
            console.log(this.$refs.leftTree.getCheckedKeys());
        },

        // 拖拽相关
        allowDrop(draggingNode, dropNode, type) {
            if (type !== "inner") {
                return true;
            } else {
                return false;
            }
        },
        allowDrag(draggingNode) {
            console.log(draggingNode);
            return true;
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
    height: 500px;
    overflow: scroll;
    overflow-x: hidden;
    .filter-box-inner {
        .inner-fix {
            display: block;
            font-weight: 400;
            font-size: 12px;
            line-height: 32px;
            padding: 0 12px;
        }

        .inner-column-item {
            display: block;
            display: flex;
            justify-content: space-between;
            width: 180px;

            .fix-icon {
                box-sizing: border-box;
                display: none;
                color: #1890ff;

                i {
                    padding-right: 6px;
                }
            }

            &:hover {
                .fix-icon {
                    display: block;
                }
            }

        }
    }
    /* 滚动条整体 */
    &::-webkit-scrollbar{
        width: 8px;
        height: 100px;
        background-color: white;
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb{
        width: 10px;
        height: 50px;
        background-color: #D6D6D6;
        border-radius: 5px;
    }
}

/deep/ .el-icon-caret-right:before {
    content: "\e798";
    box-sizing: border-box;
    padding-left: 12px;
    color: #D6D6D6;
    cursor: grab;
}

/deep/ .el-tree {
    .el-tree-node__content {
        &:hover {
            background: #E6F7FF;
        }
    }
}

/deep/ .el-tree__empty-block {
    display: none;
}
</style>
<style lang="scss">
.el-popover.filter-popover {
    box-sizing: content-box;
    padding: 0 !important;
    height: 540px;
}
</style>
