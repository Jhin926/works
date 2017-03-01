<template>
  <div class="share" @click="$emit('hide')">
    <span class="share-arrow"><img src="../assets/img-arrow.png" width="100%" height="100%" /></span>
    <div class="share-tit">
      <span class="left share-img"><img src="../assets/img-share2.png" width="100%" height="100%" /></span>
      <div class="share-text">
        <p>点击后选择[发送到聊天]，</p>
        <p>将此商品分享给好友，也可以选择[朋友圈]</p>
      </div>
    </div>
    <div class="share-rule">
      <h2>** 分享奖励规则 **</h2>
      <ul class="rule-list">
        <li>平台消费满200元后即可成为一级分销商，可以9折的价格购买成品茶。只需将茶叶分享给好友，好友即可直接以原价购买茶叶，差额作为分销商的佣金收入。</li>
        <li>分销商等级随销售额提升。升级后享受更高折扣，并将已分销商品的佣金以新折扣核算，返还差额：</li>
        <li>Lv. 1 分销商：平台消费满200元（9折）</li>
        <li>Lv. 2 分销商：销售额达2000元（8折）</li>
        <li>Lv. 3 分销商：销售额达10000元（7折）</li>
        <li>Lv. 4 分销商：销售额达30000元（6折）</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'share'
  }
</script>
<style scoped>
  .share-arrow {
    position: absolute;
    width: .92rem;
    height: .92rem;
    top: .16rem;
    right: .16rem;
  }
  .share {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .9);
    z-index: 999;
  }
  .share-tit {
    overflow: hidden;
    margin: 0 .32rem;
    padding: .8rem 0;
    border-bottom: 1px solid #fff;
  }
  .share-tit .share-img {
    display: inline-block;
    width: .8rem;
    height: .8rem;
  }
  .share-tit .share-text {
    margin-left: 1.16rem;
    padding-top: .03rem;
  }
  .share-tit .share-text p {
    line-height: .36rem;
    font-size: .24rem;
    color: #fff;
  }
  .share-rule {
    margin-top: 1.32rem;
  }
  .share-rule h2 {
    color: #fff;
    text-align: center;
    font-size: .24rem;
  }
  .rule-list {
    margin: .4rem .6rem;
  }
  .rule-list li {
    line-height: .36rem;
    font-size: .24rem;
    color: #fff;
  }
</style>
