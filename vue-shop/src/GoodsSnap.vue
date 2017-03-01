<template>
  <div id="">
    <div class="banner-cont">
      <swiper :options="swiperOption" class="swiper-box">
        <swiper-slide class="swiper-item" v-for="detail in detail.teaPictureResults">
          <img :src="detail.pictureUrl" width="100%" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <section class="detail-info">
      <h2 class="detail-tit"><span class="detail-type">{{detail.teaCategoryName}}</span><span class="detail-type">{{detail.starLevel | starToText}}</span><span class="detail-type">{{detail.name}}</span><span class="detail-type">{{detail.weightText}}</span></h2>
      <!--<div class="detail-tags">
        <span class="orange" v-show="detail.userLevelName !== ''">{{detail.userLevelName}}</span>
      </div>-->
      <div class="detail-price">
        <span class="new-cost">&yen;{{detail.unitPrice}}</span>
      </div>
      <span class="inventory-num">库存{{detail.totalInventory}}件</span>
    </section>
    <section class="detail-spec">
      <h2 class="spec-tit">商品规格</h2>
      <ul>
        <li>
          <span class="left type-tit">品名</span>
          <div class="type-text">{{detail.name}}</div>
        </li>
        <li>
          <span class="left type-tit">货号</span>
          <div class="type-text">{{detail.artNo}}</div>
        </li>
        <li>
          <span class="left type-tit">产品等级</span>
          <div class="type-text">{{detail.starLevel | starToText}}级</div>
        </li>
        <li>
          <span class="left type-tit">原产地</span>
          <div class="type-text">{{detail.producingArea}}</div>
        </li>
        <li>
          <span class="left type-tit">净含量</span>
          <div class="type-text">{{detail.weightText}}</div>
        </li>
        <li>
          <span class="left type-tit">保质期</span>
          <div class="type-text">{{detail.expirationDate}}</div>
        </li>
      </ul>
    </section>
    <section class="detail-detail">
      <h2 class="detail-tit2">商品详情</h2>
      <p class="detail-img" v-for="picture in detail.teaPictureShowResults"><img :src="picture.pictureUrl" width="100%" /></p>
    </section>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
import Banner from './components/Banner'

export default {
  name: 'goodsdetail',
  components: {
    Banner
  },
  beforeCreate () {
    document.title = '商品快照'
    this.$http.get('/api/order/tea/snapshoot?id=' + this.$route.params.id).then(function (res) {
      if (res.body.code === 0) {
        this.$data.detail = res.body.data
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
  },
  data () {
    return {
      detail: {},
      swiperOption: {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30,
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
}
</script>

<style scoped>
  .banner-cont {
    width: 100%;
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
  /* 产品信息 */
  .detail-info {
    position: relative;
    padding-top: .2rem;
    background-color: #fff;
    border-bottom: 0.02rem solid #dedede;
  }
  .inventory-num {
    display: inline-block;
    position: absolute;
    right: .2rem;
    bottom: .25rem;
    font-size: .28rem;
  }
  h2.detail-tit {
    padding-left: .2rem;
    margin-bottom: 0.05rem;
  }
  h2.detail-tit span {
    font-size: .3rem;
    margin-right: .1rem;
  }
  .detail-tags {
    padding-left: .2rem;
  }
  .detail-tags > span {
    display: inline-block;
    padding: 0.05rem 0.08rem;
    margin-right: 0.04rem;
    border-radius: 0.07rem;
    -webkit-border-radius: 0.07rem;
    -moz-border-radius: 0.07rem;
    font-size: .18rem;
    color: #fff;
  }
  .detail-tags > span.orange {
    background-color: #F6A623;
  }
  .detail-price {
    margin: .25rem 0;
    padding-left: .2rem;
  }
  .detail-price span.new-cost {
    margin-right: .1rem;
    font-size: .3rem;
    color: #d0021b;
  }
  .detail-price span.old-cost del {
    font-size: .24rem;
    color: #9b9b9b;
  }
  /* 商品规格 */
  .detail-spec {
    margin: .2rem 0;
    border-top: 0.02rem solid #dedede;
    border-bottom: 0.02rem solid #dedede;
    background-color: #fff;
  }
  .spec-tit {
    padding: .2rem;
    font-size: .3rem;
    border-bottom: 0.02rem solid #dedede;
  }
  .detail-spec >ul >li {
    margin-left: .2rem;
    padding: .2rem .2rem .2rem 0;
    border-bottom: 0.01rem solid #dedede;
    overflow: hidden;
  }
  .detail-spec >ul >li:last-child {
    border-bottom: none;
  }
  .type-tit {
    width: 1.5rem;
    font-size: .26rem;
    color: #9b9b9b;
  }
  .type-text {
    margin-left: 1.5rem;
    font-size: .26rem;
  }
  /* 商品详情 */
  .detail-detail {
    overflow: hidden;
    padding-bottom: .2rem;
    border-top: 0.02rem solid #dedede;
    border-bottom: 0.02rem solid #dedede;
    background-color: #fff;
  }
  .detail-tit2 {
    padding: .2rem;
    margin-bottom: 0.05rem;
    font-size: .3rem;
    border-bottom: 0.02rem solid #dedede;
  }
  .detail-img img {
    display: block;
  }
</style>
