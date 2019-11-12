<template>
    <div class="search-result">
        <h5>搜索结果</h5>
        <ul>
            <li></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "searchResult",
        props: {
            searchData: {
                type: Array,
                default: []
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
