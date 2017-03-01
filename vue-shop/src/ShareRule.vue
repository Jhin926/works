<template>
  <div id="share-rule">
    <p><img src="./assets/share-rule.png" width="100%" alt="" /></p>
    <h2 class="rule-tit">** 活动规则 **</h2>
    <p class="rule-text">平台消费满200元后即可成为一级分销商，可以<span class="color-red">9折</span>的价格购买成品茶。只需<span class="color-red">将茶叶分享给好友</span>，好友即可直接以原价购买茶叶，<span class="color-red">差额作为分销商的佣金收入</span>。</p>
    <p class="rule-text">分销商等级随销售额提升。升级后享受更高折扣，并将已分销商品的佣金<span class="color-red">以新折扣核算</span>，<span class="color-red">返还差额</span>。</p>
    <p class="rule-level"><img src="./assets/share-level.png" width="100%" alt="" /></p>
  </div>
</template>

<script>
    export default {
      name: 'SharerRule'
    }
</script>
<style scoped>
  .rule-tit {
    margin: .32rem 0;
    font-size: .28rem;
    font-weight: 600;
    text-align: center;
  }
  .rule-text {
    margin: 0 .32rem;
    line-height: 1.4;
    font-size: .24rem;
  }
  .rule-text span {
    font-size: .24rem;
  }
  .rule-level {
    margin: .32rem;
  }
</style>
