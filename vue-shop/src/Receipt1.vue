<template>
  <div id="">
    <receiveaddress></receiveaddress>
    <div class="receipt-type">
      <h2 class="type-tit">发票类型</h2>
      <ul class="type-item">
        <li v-if="$route.params.type == 1">
          个人
          <span v-if="personal" class="right type-select"><img src="./assets/selected.png" width="100%" height="100%" /></span>
        </li>
        <li v-else>
          公司
          <span v-if="!personal" class="right type-select"><img src="./assets/selected.png" width="100%" height="100%" /></span>
        </li>
      </ul>
    </div>
    <p class="receipt-tips">如需增值税发票，请<a href="tel:400-089-9458">联系客服</a>。</p>
    <div class="receipt-info">
      <p class="left receipt-tit">发票抬头</p>
      <p class="receipt-input"><input v-model="$route.params.head" type="text" placeholder="必填" readonly /></p>
    </div>
    <div class="receipt-info">
      <p class="left receipt-tit">备注</p>
      <p class="receipt-input"><input :value="$route.params.remark == 'nothing'? '' : $route.params.remark" type="text" placeholder="选填" readonly /></p>
    </div>
  </div>
</template>

<script>
import receiveaddress from './components/ReceiveAddress'
export default {
  name: 'receipt',
  components: {
    receiveaddress
  },
  created () {
    document.title = '发票详情'
  }
}
</script>

<style scoped>
  * {
    line-height: 1;
    font-size: .24rem;
  }
  .receipt-type {
    margin: .2rem .16rem 0 .16rem;
    border: .02rem solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    background-color: #fff;
  }
  .type-tit {
    padding: .2rem;
    border-bottom: .02rem solid #dedede;
  }
  .type-item li {
    margin-left: .2rem;
    padding: .2rem 0;
    border-bottom: .02rem solid #dedede;
  }
  .type-item li:last-child {
    border-bottom: none;
  }
  .type-select {
    width: .2rem;
    height: .2rem;
    margin-right: .2rem;
  }
  .receipt-tips {
    margin: .16rem;
    font-size: .2rem;
    color: #9b9b9b;
  }
  .receipt-tips a {
    font-size: .2rem;
    color: #cb4042;
  }
  .receipt-info {
    overflow: hidden;
    margin: .2rem .16rem 0 .16rem;
    border: .01rem solid #dedede;
    background-color: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .receipt-tit {
    width: 1.6rem;
    padding: .2rem 0 .2rem .2rem;
    color: #9b9b9b;
  }
  .receipt-input {
    padding: .2rem 0;
    margin-left: 1.6rem;
    margin-right: .2rem;
  }
  .receipt-input input {
    width: 100%;
  }
  .btn-sure {
    position: fixed;
    left: .32rem;
    bottom: 1.28rem;
    width: 5.76rem;
    height: .8rem;
    text-align: center;
    background-color: #cb4042;
  }
  .btn-sure button {
    width: 100%;
    height: 100%;
    color: #fff;
  }
  input::-moz-placeholder{color: #a4a4a4;}
  input::-webkit-input-placeholder{color: #a4a4a4;}
</style>
