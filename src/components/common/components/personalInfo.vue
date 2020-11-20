<template>
    <div class="row-box">
        <div class="item-one">

        </div>
        <div class="item-two"></div>
        <div class="item-three"></div>
    </div>
</template>

<script>
    export default {
        name: "personalInfo",
        props: {
            userInfo: {
                type: Object,
                default: {},
            },
            honorImg:{
                type: Array,
                default: []
            }
        },
        data() {
            return {
            }
        },
        methods: {
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
.row-box {
    position: relative;
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    box-sizing: border-box;
    background: #fff;
    font-family: PingFangSC-Regular, PingFang SC;
    & div {
       flex: 1; 
    }
}
</style>
