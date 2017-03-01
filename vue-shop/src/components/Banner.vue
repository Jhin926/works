<template>
  <div class="banner-cont">
    <swiper :options="swiperOption" class="swiper-box">
      <swiper-slide v-for="banner in banners">
        <a @click.stop="goDetail(banner.linkUrl)" href="javascript:;" class="swiper-item">
          <img :src="banner.url" width="100%" height="100%" />
        </a>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
  export default {
    props: ['banners'],
    methods: {
      goDetail (_url) {
        if (_url !== null && _url !== undefined && _url !== '' && _url !== 'null') {
          this.$router.push(_url)
        }
      }
    },
    data () {
      return {
        // banners: [],
        swiperOption: {
          autoplay: 3000,
          pagination: '.swiper-pagination',
          slidesPerView: 1,
          paginationClickable: true,
          spaceBetween: 30
        }
      }
    }
  }
</script>

<style scoped>
  .banner-cont {
    width: 100%;
    height: 2.8rem;
    margin: auto;
  }
  .swiper-box {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .swiper-item {
    height: 100%;
    text-align: center;
    background: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
</style>
