<template>
  <ul class="banner-cont">
    <router-link v-for="banner in banners" tag="li" :to="{'path': '/shop/typeList/'+banner.id}" class="type-item">
      <img v-on:click="getImg(banner.largePicture)" class="tea-type" :src="banner.smallPicture" width="100%"/>
    </router-link>
  </ul>
</template>

<script>
  export default {
    created () {
      this.$http.get('/api/tea/category/list').then(function (res) {
        if (res.body.code === 0) {
          this.$data.banners = res.body.data
        }
      })
    },
    methods: {
      getImg: function (_url) {
        this.$emit('getImg', _url)
      }
    },
    data () {
      return {
        banners: []
      }
    }
  }
</script>

<style scoped>
  .banner-cont {
    margin: 0 .08rem;
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
  }
  .banner-cont li {
    -webkit-flex: 1;
    flex: 1;
    margin: 0 .08rem;
  }
  .tea-type {
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
</style>
