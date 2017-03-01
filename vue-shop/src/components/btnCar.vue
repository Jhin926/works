<template>
  <div class="shop-car">
    <span class="shopping-num" v-show="carNum>0">{{carNum}}</span>
    <router-link to="/shop/car"><img src="../assets/car.png" width="100%" /></router-link>
  </div>
</template>
<script>
  export default {
    name: 'app',
    props: ['carNum']
  }
</script>
<style scoped>
  .shop-car {
    width: .96rem;
    height: .96rem;
    position: fixed;
    right: .2rem;
    bottom: 1.2rem;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    /*box-shadow: 1px 2px 4px rgba(0, 0, 0, .2);
    -webkit-box-shadow: 1px 2px 4px rgba(0, 0, 0, .2);
    -moz-box-shadow: 1px 2px 4px rgba(0, 0, 0, .2);*/
  }
  .shopping-num {
    display: inline-block;
    width: .3rem;
    height: .3rem;
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 0.02rem;
    background-color: #fff;
    border: 1px solid #cb4042;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    font-size: .2rem;
    color: #cb4042;
    text-align: center;
  }
</style>
