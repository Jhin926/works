<template>
  <div id="">
    <div class="earningsexplain">
       <div class="explain-title">
         代销您的茶叶
         <p>每个季度您都可以选择代销当季茶叶，预计可获得茶叶价值50%的代销收益。</p>
         <p class="title-none">例如：</p>
         <p class="title-none grey">1. 您可以通过资产页面点击查看您的茶庄园收益情况</p>
       </div>
       <div class="img-cont">
         <img src="./assets/daixiao1.png" width="100%">
         <img src="./assets/daixiao1-2.png" width="100%">
       </div>
      <div class="explain-title">
        <p class="grey">2. 点击【代销】后会提示您是否确认代销，可获40%收益</p>
      </div>
      <div class="img-cont"><img src="./assets/daixiao2.png" width="100%"></div>
      <div class="explain-title special">
        <p class="grey title-none">3. 确认代销后，收益将于15天后到账至您的账户余额。（第一季度仅在季度末可代销，其它季度可在该季度任意时间内代销）</p>
      </div>
      <div class="img-cont"><img src="./assets/daixiao3.png" width="100%"></div>
      <!--<div class="button">
        <button v-on:click ="back">返回</button>
      </div>-->
    </div>
  </div>
</template>

<script>
    export default {
      name: 'earningsexplain',
      methods: {
        back: function () {
          this.$router.go(-1)
        }
      },
      created () {
        document.title = '代销茶叶'
      }
    }
</script>

<style scoped>
  .earningsexplain {
    margin-top: .48rem;
  }
  .explain-title {
    margin: 0 .16rem .32rem;
    font-size:0.36rem;
  }
  p {
    font-size:0.24rem;
    line-height:0.4rem;
    padding-top: .16rem;
  }
  .title-none {
  }
  .grey {
    color:#9b9b9b;
  }
  .img-cont {
    margin: 0 .32rem;
  }
  .img-cont img {
    margin-bottom: .32rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, .15);
  }
  .special {
  }
  .button {
    width:100%;
    height:1rem;
    background:#476d8f;
  }
  .button button {
    display:inline-block;
    width:100%;
    height:100%;
    font-size:0.28rem;
    color:#fff;
    text-align:center;
    line-height:1rem;
  }
</style>
