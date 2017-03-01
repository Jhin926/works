<template>
  <div class="bar">
    <router-link class="index" tag="div" :to="{path: '/index'}">
      <p class="bar-img"></p>
      <p>首页</p>
    </router-link>
    <router-link tag="div" class="asset" :to="{path: '/assets'}">
      <p class="bar-img"></p>
      <p>资产</p>
    </router-link>
    <router-link class="shop" tag="div" :to="{path: '/shop'}">
      <p class="bar-img"></p>
      <p>商城</p>
    </router-link>
    <router-link class="my" tag="div" :to="{path: '/mine'}">
      <p class="bar-img"></p>
      <p>我的</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'bar'
}
</script>

<style scoped>
  .bar {
    width: 100%;
    height: .88rem;
    padding-top: .088rem;
    display: box;
    display: -webkit-box;
    display: -moz-box;
    background-color: #fff;
    border-top: 0.016rem solid #dedede;
    position: fixed;
    left: 0;
    bottom: 0;
  }
  .bar > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    text-align: center;
  }
  .bar > div p {
    width: .48rem;
    height: .48rem;
    margin: auto;
    font-size: .18rem;
    background-size: 100% 100%;
    text-align: center;
    color: #9b9b9b;
  }
  .bar > div.router-link-active p {
    color: #cb4042;
  }
  .bar > div p.bar-img {
    margin-bottom: .08rem;
  }
  .bar > div.index p.bar-img {
    background-image: url("../assets/home.png");
  }
  .bar > div.index.router-link-active p.bar-img {
    background-image: url("../assets/home1.png");
  }
  .bar > div.asset p.bar-img {
    background-image: url("../assets/assets.png");
  }
  .bar > div.asset.router-link-active p.bar-img {
    background-image: url("../assets/assets1.png");
  }
  .bar > div.shop p.bar-img {
    background-image: url("../assets/shop.png");
  }
  .bar > div.shop.router-link-active p.bar-img {
    background-image: url("../assets/shop1.png");
  }
  .bar > div.my p.bar-img {
    background-image: url("../assets/me.png");
  }
  .bar > div.my.router-link-active p.bar-img {
    background-image: url("../assets/me1.png");
  }
</style>
