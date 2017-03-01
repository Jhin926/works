<template>
  <div class="y-head">
    <span class="icon-tit"></span>
    <slot name="text"></slot>
  </div>
</template>

<script>
  export default {
    name: 'yhead'
  }
</script>

<style scoped>
  .y-head {
    margin: .32rem .16rem .16rem;
  }
  .tit {
    margin-left: .18rem;
    font-size: .24rem;
  }
  .icon-tit {
    float: left;
    display: inline-block;
    width: 2px;
    height: .3rem;
    background-color: #cd4042;
  }
</style>
