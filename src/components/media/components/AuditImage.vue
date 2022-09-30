<template>
    <div>
        <el-dialog
            title="监播图片详情"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            custom-class="custom-dialog-wrapper registration-media"
            width="60%">
            <span>这是一段信息</span>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">关 闭</el-button>
                <el-button @click="handleClose()">上一个</el-button>
                <el-button @click="handleClose()" type="primary">下一个</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'auditImage',
    props: {
        dialogVisible: {
            type: Boolean,
            default: () => false,
        },
        auditImageData: {
            type: Object,
            default: () => {}
        }
    },
    data(){
        return {}
    },
    methods:{
        handleClose () {
            this.$emit("update:dialogVisible", false)
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
