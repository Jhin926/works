<template>
  <div class="info" :class="info.bgImg">
    <p class="my-level">{{info.tag}}</p>
    <p class="my-name">{{info.tit}}</p>
    <div class="my-money">
      <router-link tag="div" class="left" :to="{'path': info.leftUrl}">
        <p>{{info.leftName}}</p>
        <p>&yen;{{info.leftVal}}</p>
      </router-link>
      <router-link tag="div" class="left" :to="{'path': info.rightUrl}">
        <p>{{info.rightName}}</p>
        <p>{{info.rightVal}}</p>
      </router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'overview',
    props: ['info']
  }
</script>
<style scoped>
  .info {
    width: 100%;
    height: 2.8rem;
    margin: 0 auto;
    padding-top: 0.48rem;
  }
  .info.my {
    background: url("../assets/my-cover.png") no-repeat;
    background-size: 100% 100%;
  }
  .info.assets {
    background: url("../assets/assets-cover.png") no-repeat;
    background-size: 100% 100%;
  }
  .info.m-detail {
    background: url("../assets/assets-detail.png") no-repeat;
    background-size: 100% 100%;
  }

  .info > p {
    text-align: center;
  }

  .info p.my-name {
    font-size: 0.32rem;
    color: #fff;
  }

  .info .my-level {
    margin-bottom: .08rem;
    color: rgba(255, 255, 255, .66);
    font-size: 0.2rem;
  }

  .my-money {
    height: 0.96rem;
    margin: 0.5rem .16rem 0;
    padding: .16rem 0;
    background-color: rgba(0, 0, 0, .33);
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }

  .my-money .left {
    width: 50%;
    text-align: center;
  }

  .my-money .left p {
    font-size: 0.32rem;
    color: #fff;
  }

  .my-money .left p:nth-child(1) {
    margin-bottom: .04rem;
    color: rgba(255, 255, 255, .66);
    font-size: 0.2rem;
  }

  .my-money .left:nth-child(1) {
    border-right: 1px solid rgba(255, 255, 255, .66);
  }
</style>
