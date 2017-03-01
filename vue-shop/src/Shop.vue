<template>
  <div id="">
    <div>
      <banner :banners="banners"></banner>
      <section class="type-cont">
        <h2 class="type-tit">
          <span class="icon-tit"></span>
          茶叶品类
        </h2>
        <banner2 v-on:getImg="getImgUrl"></banner2>
      </section>
      <section>
        <h2 class="type-tit">
          <span class="icon-tit"></span>
          全部茶叶
        </h2>
        <div class="private-tea">
          <private :teaList="tea"></private>
        </div>
      </section>
      <car :carNum="carNum"></car>
      <bar></bar>
      <footer class="seat"></footer>
    </div>
    <router-view v-if="isType" :imgurl="imgUrl"></router-view>
  </div>
</template>

<script>
import Banner from './components/Banner'
import Banner2 from './components/Banner2'
import Private from './components/Private'
import Car from './components/btnCar'
import Bar from './components/Bar'

export default {
  name: 'app',
  methods: {
    getImgUrl: function (_url) {
      this.$data.imgUrl = _url
      this.$data.isType = true
    }
  },
  created () {
    document.title = '商城'
    this.$http.get('/api/tea/list').then(function (res) {
      if (res.body.code === 0) {
        this.$data.tea = res.body.data
      }
    })
    this.$http.get('/api/banner/list?type=2').then(function (res) {
      if (res.body.code === 0) {
        this.$data.banners = res.body.data
      }
    })
    this.$http.get('/api/shoppingcart/count').then(function (res) {
      if (res.body.code === 0) {
        this.$data.carNum = res.body.data
      }
    })
  },
  components: {
    Banner,
    Banner2,
    Private,
    Car,
    Bar
  },
  data () {
    return {
      imgUrl: '',
      isType: false,
      tea: [],
      carNum: 0,
      banners: []
    }
  }
}
</script>

<style scoped>
  .type-tit {
    margin: .48rem 0 .16rem .16rem;
    font-size: .24rem;
  }
  .icon-tit {
    float: left;
    width: 2px;
    height: .26rem;
    margin-top: .02rem;
    margin-right: .16rem;
    background-color: #cd4042;
  }
  .private-tea {
    padding: 0 .16rem .16rem .16rem;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
