<template>
  <div class="alert">
    <section class="alert-inner">
      <div class="alert-body">
        <slot name="content"></slot>
      </div>
      <div class="alert-foot">
        <div class="foot-inner">
          <slot name="sure"></slot>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    name: 'alert'
  }
</script>
<style scoped>
  .alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
    z-index: 99;
  }
  .alert-inner {
    position: relative;
    width: 4.8rem;
    background-color: #fff;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    margin: 40% auto 0 auto;
    padding-bottom: .7rem;
  }
  .alert-body {
    padding: .3rem .15rem;
  }
  .alert-body * {
    text-align: center;
    font-size: .24rem;
  }
  .alert-foot {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: .7rem;
    border-top: 1px solid #dedede;
  }
  .foot-inner {
    display: box;
    display: -webkit-box;
    display: -moz-box;
  }
  .foot-inner > p {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    padding: .2rem 0;
    font-size: .24rem;
    text-align: center;
    border-right: 1px solid #dedede;
  }
  .foot-inner > p:last-child {
    border-right: none;
  }
</style>
