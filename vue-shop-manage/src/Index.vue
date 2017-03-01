<template>
  <div id="index">
    <bar></bar>
    <div class="content">
      <router-view></router-view>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script>
import Bar from './components/Bar'
import contTit from './components/Title'

export default {
  name: 'app',
  created () {
  },
  components: {
    Bar,
    contTit
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  #index {
    width: 1350px;
    margin: auto;
  }
  .content {
    width: 1091px;
    margin: 20px 20px 20px 240px;
    padding-bottom: 20px;
    border-radius: 5px;
    background-color: #fff;
  }
</style>
