<template>
  <div id="title">
    <h2 :class="headObj.class">
      <span class="icon-tit"></span>
      {{headObj.titText}}
    </h2>
    <div class="head-handle">
      <button class="btn-tit">
        <span class="left icon-add"></span>
        {{headObj.btnText}}
      </button>
      <div class="right member-handle">
        <span class="left icon-member"><img src="../assets/icon-title.png" width="32" height="32" alt="" /></span>
        {{headObj.userName}}
        <span class="btn-handle" v-on:click="hShow = !hShow"></span>
        <div v-show="hShow" class="handle-con">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'title',
  props: ['headObj'],
  data () {
    return {
      hShow: false
    }
  }
}
</script>

<style scoped>
  #title {
    position: relative;
  }
  #title h2 {
    height: 60px;
    padding: 20px;
    border-bottom: 1px solid #d6d7d9;
    font-size: 16px;
  }
  #title h2 .icon-tit {
    float: left;
    margin-top: 3px;
    margin-right: 10px;
  }
  .shop .icon-tit {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url('../assets/icon-shop2.png') no-repeat;
  }
  .head-handle {
    position: absolute;
    top: 12px;
    right: 20px;
    width: 240px;
  }
  .btn-tit {
    width: 106px;
    height: 35px;
    padding: 9px 5px;
    background-color: #f9f9f8;
    border: 1px solid #c7cacd;
    border-radius: 2px;
  }
  .icon-add {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-left: 2px;
    background: url("../assets/icon-add.png") no-repeat;
  }
  .member-handle {
    padding: 10px 0;
  }
  .icon-member {
    margin-top: -8px;
    margin-right: 6px;
  }
  .btn-handle {
    display: inline-block;
    width: 9px;
    height: 6px;
    margin-top: -1px;
    margin-left: 6px;
    background: url("../assets/arrow-down.png") no-repeat;
    cursor: pointer;
  }
  .handle-con {
    width: 100px;
    height: 100px;
    margin-top: 10px;
    border: 1px solid #eee;
    background: #fff;
  }
</style>
