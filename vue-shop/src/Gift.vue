<template>
  <div id="">
    <div class="banner-cont">
      <swiper :options="swiperOption" class="swiper-box">
        <swiper-slide class="swiper-item" v-for="img in detail.teaPictureResult">
            <img :src="img.pictureUrl" width="100%" height="100%" />
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <section class="detail-info">
      <h2 class="detail-tit"><span class="detail-type">{{detail.teaCategoryName}}</span><span class="detail-type">{{detail.starLevel | starToText}}</span><span class="detail-type">{{detail.title}}</span><span class="detail-type">{{detail.weightText}}</span></h2>
      <div class="detail-price">
        <span class="new-cost">&yen;{{detail.displayPrice}}</span>
        <span class="old-cost"><del>&yen;{{detail.unitPrice}}</del></span>
      </div>
      <div class="detail-num">
        <span class="buy-num">购买数量: {{buyNumber}}份</span>
        <span class="right check-num">
          <span v-on:click="(function(){if(buyNumber>1) {buyNumber--}})()" class="left num-add"><img src="./assets/minus.png" width="100%" /></span>
          <span class="check-number">{{buyNumber}}</span>
          <span v-on:click="buyNumber++" class="right num-less"><img src="./assets/plus.png" width="100%" /></span>
        </span>
      </div>
    </section>
      <ul class="detail-spec">
        <li>
          <span class="left type-tit">品名</span>
          <div class="type-text">{{detail.name}}</div>
        </li>
        <li>
          <span class="left type-tit">等级</span>
          <div class="type-text">{{detail.starLevel | starToText}}</div>
        </li>
        <li>
          <span class="left type-tit">净含量</span>
          <div class="type-text">{{detail.weightText}}</div>
        </li>
        <li>
          <span class="left type-tit">原产地</span>
          <div class="type-text">{{detail.producingArea}}</div>
        </li>
        <li>
          <span class="left type-tit">保质期</span>
          <div class="type-text">{{detail.expirationDate}}</div>
        </li>
        <li>
          <span class="left type-tit">货号</span>
          <div class="type-text">{{detail.artNo}}</div>
        </li>
      </ul>
    <section class="detail-detail">
      <p class="detail-img" v-for="picture in detail.teaPictureShowResult"><img :src="picture.pictureUrl" width="100%" /></p>
    </section>
    <div class="shopping-handle">
      <router-link to="/shop/car" tag="span" class="btn-share">
        <img src="./assets/car2.png" />
        <i class="car-num">{{carNum}}</i>
      </router-link>
      <span class="btn-share" @click="isShare = true" v-if="$route.params.phone == undefined"><img src="./assets/btn-share.png" /></span>
      <button class="join-car" v-on:click="joinCar">加入购物车</button>
      <button class="buy-now" v-on:click="goPay($route.params.id, buyNumber)">立即购买</button>
    </div>
    <footer class="seat"></footer>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
    <share v-show="isShare" v-on:hide="isShare=false"></share>
  </div>
</template>

<script>
import Banner from './components/Banner'
import Share from './components/Share'
import wx from 'weixin-js-sdk'

export default {
  name: 'goodsdetail',
  components: {
    Banner,
    Share
  },
  created () {
    document.title = '礼品卡'
    var wxCode = ''
    var wSearch = window.location.search.substring(1)
    var serArr = wSearch.split('&')
    for (var i = 0; i < serArr.length; i++) {
      var oneSer = serArr[i].split('=')
      if (oneSer[0] === 'code') {
        wxCode = oneSer[1]
        break
      }
    }

    this.$http.get('/api/tea/detail?id=' + this.$route.params.id).then(function (res) {
      if (res.body.code === 0) {
        this.$data.detail = res.body.data
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
    this.$http.get('/api/shoppingcart/count').then(function (res) {
      if (res.body.code === 0) {
        this.$data.carNum = res.body.data
      } else if (res.body.code === 300001 || res.body.code === 300002) {
        this.$data.isLogin = false
      }
      if (wxCode !== '') {
        this.$http.get('/api/user/wx/login?code=' + wxCode).then((res) => {
          if (res.body.code === 0) {
            if (res.body.data.mobileNumber === '' || res.body.data.mobileNumber === null) {
              this.$router.push('/login')
            } else {
              this.$data.isLogin = true
            }
          }
        })
      }
    })

    if (this.$route.params.phone === undefined) { // 不是来自分享的
      this.$http.get('/api/wx/config').then(function (res) {
        let _this = this
        if (res.body.code === 0) {
          const infoObj = res.body.data
          this.$http.get('/api/user/info').then(function (res) {
            if (res.body.code === 0) {
              const mobile = res.body.data.mobileNumber
              wx.config({
                debug: false,
                appId: infoObj.appId,
                timestamp: infoObj.timestamp,
                nonceStr: infoObj.nonceStr,
                signature: infoObj.signature,
                jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
              })
              wx.ready(function () {
                wx.onMenuShareTimeline({
                  title: _this.$data.detail.teaCategoryName + ' ' + _this.$data.starText[_this.$data.detail.starLevel - 1] + ' ' + _this.$data.detail.weightText, // 分享标题
                  link: window.location.href + '/' + mobile, // 分享链接
                  imgUrl: _this.$data.detail.teaPictureResult[0].pictureUrl, // 分享图标
                  success: function () {
                    _this.$data.isShare = false
                  },
                  cancel: function () {
                    _this.$data.isShare = false
                  }
                })
                wx.onMenuShareAppMessage({
                  title: _this.$data.detail.teaCategoryName + ' ' + _this.$data.starText[_this.$data.detail.starLevel - 1] + ' ' + _this.$data.detail.weightText, // 分享标题
                  desc: '', // 分享描述
                  link: window.location.href + '/' + mobile, // 分享链接
                  imgUrl: _this.$data.detail.teaPictureResult[0].pictureUrl, // 分享图标
                  success: function () {
                    _this.$data.isShare = false
                  },
                  cancel: function () {
                    _this.$data.isShare = false
                  }
                })
              })
            } else if (res.body.code === 300001 || res.body.code === 300002) { // 没有
              window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
            } else {
              this.$data.altMessage = res.body.message
              this.$data.showAlt = true
            }
          })
        } else if (res.body.code === 300001 || res.body.code === 300002) {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    }
  },
  methods: {
    joinCar: function () {
      this.$data.isLoading = true
      this.$http({
        method: 'post',
        url: '/api/shoppingcart/add?teaId=' + this.$route.params.id + '&quantity=' + this.$data.buyNumber
      }).then(function (res) {
        this.$data.isLoading = false
        if (res.body.code === 0) {
          this.$data.carNum++
        } else if (res.body.code === 300001 || res.body.code === 300002) {
          let url = encodeURIComponent(window.location.href)
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    goPay: function (_id, _num) {
      if (this.$route.params.phone === undefined) window.location.href = '/?#/order/' + _id + '/' + _num + '/0'
      else {
        if (!this.$data.isLogin) {
          let url = encodeURIComponent(window.location.href)
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        } else {
          window.location.href = '/?#/order/' + _id + '/' + _num + '/0/' + this.$route.params.phone
        }
      }
    }
  },
  data () {
    return {
      detail: {},
      buyNumber: 1,
      swiperOption: {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30
      },
      carNum: 0,
      isLoading: false,
      showAlt: false,
      altMessage: '错误信息',
      isShare: false,
      referrer: '',
      isLogin: true,
      starText: ['一星', '二星', '三星', '四星', '五星', '六星', '七星', '八星', '九星', '十星']
    }
  }
}
</script>

<style scoped>
  .banner-cont {
    width: 100%;
    height: 4.2rem;
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
    padding: .2rem 0;
    background-color: #fff;
    border-bottom: 0.02rem solid #dedede;
  }
  h2.detail-tit {
    padding-left: .2rem;
    margin-bottom: 0.2rem;
  }
  h2.detail-tit span {
    font-size: .28rem;
    margin-right: .1rem;
  }
  .detail-price {
    margin-bottom: .2rem;
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
  .detail-num {
    padding: .28rem .2rem .1rem .2rem;
    overflow: hidden;
    border-top: 0.02rem solid #dedede;
  }
  .buy-num {
    font-size: .24rem;
    color: #9b9b9b;
  }
  .check-num {
    display: inline-block;
    width: 1.2rem;
    height: .24rem;
    text-align: center;
  }
  .check-num .num-add,
  .check-num .num-less {
    display: inline-block;
    width: .28rem;
    height: .28rem;
    border: 0.02rem solid #dedede;
    font-size: .28rem;
    color: #9b9b9b;
    line-height: .28rem;
  }
  .check-number {
    line-height: .24rem;
    font-size: .21rem;
  }
  /* 商品规格 */
  .detail-spec {
    margin: .32rem .2rem;
    border: 0.02rem solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    background-color: #fff;
  }
  .detail-spec >li {
    margin: 0 .16rem;
    padding: .24rem 0;
    border-bottom: 0.01rem solid #dedede;
    overflow: hidden;
  }
  .detail-spec >li:last-child {
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
  .detail-img img {
    display: block;
  }
  /* 加入购物车或者立即购买 */
  .shopping-handle {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .8rem;
    background-color: #fff;
    display: box;
    display: -webkit-box;
  }
  .btn-share {
    display: block;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    height: .8rem;
    border-top: 1px solid #dedede;
    border-right: 1px solid #dedede;
    text-align: center;
    position: relative;
  }
  .btn-share img {
    width: .4rem;
    height: .4rem;
    margin-top: .2rem;
  }
  .car-num {
    position: absolute;
    top: .1rem;
    right: .1rem;
    width: .24rem;
    height: .24rem;
    padding-top: 1px;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    background-color: #cb4042;
    text-align: center;
    font-size: .18rem;
    color: #fff;
  }
  .join-car,
  .buy-now {
    display: block;
    -webkit-box-flex: 3;
    -moz-box-flex: 3;
    box-flex: 3;
    height: 100%;
    font-size: .24rem;
    text-align: center;
  }
  .join-car {
    border-top: .02rem solid #dedede;
  }
  .buy-now {
    color: #fff;
    background-color: #cb4042;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
