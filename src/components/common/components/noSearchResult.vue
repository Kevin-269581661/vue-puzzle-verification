<template>
    <div>
        <img src="../../../assets/images/nofound.png" alt="没有找到记录" width="122" height="83" />
        <slot>
            <p class="not_search">未查询到记录</p>
        </slot>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.not_search{
    margin-top: 24px;
    color: rgba(0,0,0,0.45);
}
</style>
