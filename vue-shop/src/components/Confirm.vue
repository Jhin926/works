<template>
  <div class="confirm">
    <section class="confirm-inner">
      <slot name="head"></slot>
      <div class="confirm-body">
        <slot name="content"></slot>
      </div>
      <div class="confirm-foot">
        <div class="foot-inner">
          <slot name="cancel"></slot>
          <slot></slot>
          <slot name="sure"></slot>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  export default {
    name: 'confirm'
  }
</script>
<style scoped>
  .confirm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
  }
  .confirm-inner {
    position: relative;
    width: 4.8rem;
    background-color: #fff;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    margin: 40% auto 0 auto;
    padding-bottom: .7rem;
  }
  .confirm-head {
    padding: .2rem 0;
    font-size: .28rem;
    text-align: center;
  }
  .confirm-body {
    padding: .3rem .15rem;
    margin: 0 .32rem .32rem;
    text-align: center;
  }
  .confirm-body * {
    font-size: .2rem;
    color: #9b9b9b;
  }
  .confirm-foot {
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
    padding: .2rem 0;
  }
  .foot-inner > p {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    font-size: .24rem;
    text-align: center;
    border-right: 1px solid #dedede;
    color: #9b9b9b;
  }
  .foot-inner > p:last-child {
    color: #cb4042;
    border-right: none;
  }
</style>
