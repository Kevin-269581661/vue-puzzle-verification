<template>
    <span class="point">
        <b :style="{background: color}"></b>
        {{stateText}}
    </span>
</template>

<script>
export default {
    props:{
        stateText:{
            type: String,
            default: '',
        },
        color:{
            type: String,
            default: ''
        },
    },
    
}
</script>

<style scoped>
.point b{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}
</style>
