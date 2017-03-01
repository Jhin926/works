<template>
  <div id="type-list">
    <div class="type-img">
      <img :src="imgurl" width="100%" />
    </div>
    <div class="type-list">
      <private :teaList="tea"></private>
    </div>
    <car :carNum="carNum"></car>
    <bar></bar>
    <footer class="seat"></footer>
  </div>
</template>

<script>
import Private from './components/Private'
import Car from './components/btnCar'
import Bar from './components/Bar'

export default {
  name: 'app',
  created () {
    this.$http.get('/api/tea/list?teaCategoryId=' + this.$route.params.id).then(function (res) {
      if (res.body.code === 0) {
        this.$data.tea = res.body.data
      }
    })

    this.$http.get('/api/shoppingcart/count').then(function (res) {
      if (res.body.code === 0) {
        this.$data.carNum = res.body.data
      }
    })
  },
  props: ['imgurl'],
  components: {
    Private,
    Car,
    Bar
  },
  data () {
    return {
      tea: [],
      carNum: 0
    }
  }
}
</script>

<style scoped>
  #type-list {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
    background-color: #efefef;
    overflow-y: auto;
  }
  .type-list {
    margin: .48rem .16rem;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
