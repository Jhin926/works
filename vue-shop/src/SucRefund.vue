<template>
  <div id="applicationsuccess">
    <div class="applicationsuccess">
      <div class="success-img-con">
        <div class="success-img">
        </div>
      </div>
      <p>申请成功</p>
      <div class="success-notice">我们将在三个工作日内为您处理</div>
      <div class="button">
        <button v-on:click="back">返回商城订单</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'suc-refund',
    methods: {
      back: function () {
        this.$router.go(-2)
      }
    },
    created () {
      document.title = '申请成功'
    }
  }
</script>

<style scoped>
  .applicationsuccess {
    max-width:640px;
    margin:0 auto;
    overflow:hidden;
  }
  .success-img-con {
    width:100%;
    padding-top:1rem;
    margin:0 auto;
  }
  .success-img {
    width:1.8rem;
    height:1.8rem;
    border-radius:50%;
    background:url('./assets/icon-success.png')no-repeat;
    background-size:cover;
    margin:0 auto;
  }
  p {
    width:100%;
    height:0.3rem;
    margin:0.5rem auto 0.2rem;
    text-align:center;
    line-height:0.3rem;
    font-size:0.26rem;
  }
  .success-notice {
    width:100%;
    font-size:0.24rem;
    color:#9b9b9b;
    text-align:center;
  }.button {
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
    font-size:0.24rem;
    text-align:center;
    color:#fff;
  }
</style>
