<template>
  <div id="app">
   
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="stylus">
html,body,#app{
  margin 0
  padding 0
  width 100%
  height 100%
}
.el-breadcrumb
  margin 15px
</style>
