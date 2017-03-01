<template>
  <div class="success">
    <div class="success-img-con">
      <div class="success-img">
      </div>
    </div>
    <slot name="text"></slot>
    <div class="button">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'success',
    props: ['tit'],
    created () {
      document.title = '领取成功'
    }
  }
</script>

<style scoped>
  .success {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f7f7f7;
    z-index: 999;
  }
  .success-img-con {
    width:100%;
    padding-top:2rem;
    margin:0 auto;
  }
  .success-img {
    width:1.8rem;
    height:1.8rem;
    border-radius:50%;
    background:url('../assets/icon-success.png')no-repeat;
    background-size:cover;
    margin:0 auto;
  }
  .sucess-text {
    font-size: .36rem;
    margin-top: .56rem;
    text-align: center;
  }
  p {
    width:100%;
    height:0.3rem;
    margin:0.5rem auto;
    text-align:center;
    line-height:0.3rem;
    font-size:0.26rem;
  }
  .button {
    position: absolute;
    left: .32rem;
    top: 8.5rem;
    width:5.76rem;
    height:0.8rem;
    border-radius:2px;
    -webkit-border-radius:2px;
    background-color:#cb4042;
  }
  .button button {
    width:100%;
    height:100%;
    font-size:0.28rem;
    text-align:center;
    color:#fff;
  }
</style>
