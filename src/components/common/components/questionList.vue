<template>
    <div class="question-list">
        <h5>{{mainInfo.listTitle}}</h5>
        <ul>
            <li v-for="(item,index) in mainInfo.question" :key="index">{{item.title}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "questionList",
        props:{
            mainInfo: {
                type: Array,
                default: []
            }
        },
    }
</script>

<style scoped>

</style>
