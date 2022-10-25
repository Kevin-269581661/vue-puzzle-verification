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
                    <span class="inner-fix">固定在左侧</span>
                    <el-tree
                        :data="fixLeftList"
                        node-key="id"
                        show-checkbox
                        default-expand-all
                        draggable
                        :allow-drop="allowDrop"
                        :allow-drag="allowDrag"
                    >
                    </el-tree>
                    <span class="inner-fix">不固定</span>
                    <el-tree
                        :data="notFixList"
                        node-key="id"
                        show-checkbox
                        default-expand-all
                        draggable
                        :allow-drop="allowDrop"
                        :allow-drag="allowDrag"
                    >
                        <span class="custom-tree-node inner-column-item" slot-scope="{ node, data }">
                            <span>{{ node.label }}</span>
                            <span>
                                <i v-if="isFixed" class="el-icon-minus"></i>
                                <i v-else class="el-icon-upload2"></i>

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
            fixLeftList: [],
            fixRightList: [
                { id: 1, label: "媒体状态", disabled: true },
                { id: 2, label: "售卖状态", disabled: true },
                { id: 3, label: "操作", disabled: true },
            ],
            notFixList: [
                { id: 1, label: "媒体类型" },
                { id: 2, label: "媒体名称" },
                { id: 3, label: "投放面" },
                { id: 4, label: "资产编号" },
                { id: 5, label: "资源类型" },
                { id: 6, label: "创建日期" },
                { id: 7, label: "资源名称" },
                { id: 8, label: "资源别名" },
                { id: 9, label: "城市" },
                { id: 10, label: "区域" },
                { id: 11, label: "街道" },
                { id: 12, label: "地址" },
                { id: 13, label: "地址描述" },
                { id: 14, label: "经纬度" },
                { id: 15, label: "楼盘介绍" },
                { id: 16, label: "Q云企小区名称" },
                { id: 17, label: "楼盘类型" },
                { id: 18, label: "楼盘价格" },
                { id: 19, label: "住户数量" },
                { id: 20, label: "楼栋数量" },
                { id: 21, label: "单元数量" },
                { id: 22, label: "入住年份" },
                { id: 23, label: "商圈" },
                { id: 24, label: "周边配套" },
                { id: 25, label: "交通情况" },
                { id: 26, label: "出入口数" },
                { id: 27, label: "入住率" },
                { id: 28, label: "配套电梯" },
                { id: 29, label: "竞品公司" },
                { id: 30, label: "居住人群" },
                { id: 31, label: "车位数" },
                { id: 32, label: "人流量" },
                { id: 33, label: "车流量" },
                { id: 34, label: "广告限制" },
                { id: 35, label: "媒体位置" },
                { id: 36, label: "媒体位ID" },
                { id: 37, label: "设备ID" },
                { id: 38, label: "设备类型" },
                { id: 39, label: "位置类型" },
                { id: 40, label: "素材尺寸" },
                { id: 41, label: "可视尺寸" },
                { id: 42, label: "设备状态" },
                { id: 43, label: "备注" },
                { id: 44, label: "楼栋" },
                { id: 45, label: "单元" },
                { id: 46, label: "楼层" },
                { id: 47, label: "位置朝向" },

            ],
            isFixed: false,
        }
    },
    methods: {
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
    padding: 0 12px;
    overflow: scroll;
    overflow-x: hidden;
    .filter-box-inner {
        .inner-fix {
            display: block;
            font-weight: 400;
            font-size: 12px;
            line-height: 32px;
        }

        .inner-column-item {
            display: block;
            display: flex;
            justify-content: space-between;
            width: 180px;

            i {
                color: #1890ff;
                padding: 0 2px;
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
    color: #D6D6D6;
    cursor: grab;
}
</style>
<style lang="scss">
.el-popover.filter-popover {
    box-sizing: content-box;
    padding: 0 !important;
    height: 540px;
}
</style>
