<template>
  <div id="">
    <p class="manor-img">
      <img :src="tea.indexPicture" width="100%" height="100%" />
      <span class="manor-num">剩余{{tea.remainSize}}亩</span>
    </p>
    <ul class="price">
      <li class="item-hei">
        <span class="big price-tit">{{tea.name}}</span><br>
        <span class="price-amount">&yen;{{(tea.unitPrice * buyNumber).toFixed(2)}}</span>
      </li>
      <li class="item-hei">
        <span class="gray middle amount-tit">购买数量:</span>
        <span class="right check-num">
          <span v-on:click="(function(){if(buyNumber>1) {buyNumber--}})()" class="left num-add"><img src="./assets/minus.png" width="100%" /></span>
          <span class="check-number">{{buyNumber}}</span>
          <span v-on:click="buyNumber++" class="right num-less"><img src="./assets/plus.png" width="100%" /></span>
        </span>
      </li>
    </ul>
    <ul class="tea-value">
      <router-link tag="li" :to="{'path': '/index/teagroup/'+tea.id+'/'+buyNumber}" class="item-hei gray middle">
        茶组合价值
        <span class="right blue big value-amount">&yen;{{tea.teaValue * buyNumber}}</span>
        <span class="arrow-r"></span>
      </router-link>
      <router-link tag="li" :to="{'path': '/index/poxy'}" class="item-hei gray middle">
        代销可获收益
        <span class="right blue big value-amount">{{tea.annualIncomeText}}</span>
        <span class="arrow-r"></span>
      </router-link>
    </ul>
    <ul class="img-list">
      <li v-for="pic in tea.teaManorPicturesShowResult">
        <img :src="pic.pictureUrl" width="100%" />
      </li>
    </ul>
    <p class="agreement">
      <span class="middle gray agm-inner">
        <span class="check" v-on:click="isActive= !isActive" v-bind:class="{ active: isActive }"></span>
        已阅读并同意
        <router-link class="middle blue" to="/agreement">《人人当地主购买使用协议》</router-link>
      </span>
    </p>
    <p class="btn-buy">
      <button class="btn-share" @click="isShare = true" v-if="!$route.params.phone">分享有惊喜</button>
      <button class="middle btn-now" v-on:click.stop="goPay(tea.id,buyNumber)">
        立即购买
      </button>
    </p>
    <footer class="seat"></footer>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
    <share v-show="isShare" v-on:hide="isShare=false"></share>
  </div>
</template>

<script>
import Share from './components/Share'
import wx from 'weixin-js-sdk'
export default {
  name: 'manordetail',
  components: {
    Share
  },
  created () {
    document.title = '人人当地主'
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
    if (wxCode !== '') {
      this.$http.get('/api/user/wx/login?code=' + wxCode).then((res) => {
        if (res.body.code === 0) {
          if (res.body.data.mobileNumber === '' || res.body.data.mobileNumber === null) {
            this.$router.push('/login/' + res.body.data.id)
          }
        }
      })
    }
    this.$http.get('/api/teamanor/detail?id=' + this.$route.params.id).then(function (res) {
      if (res.body.code === 0) {
        this.$data.tea = res.body.data
        this.$data.tea.teaManorPicturesShowResult = this.$data.tea.teaManorPicturesShowResult.reverse()
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })

    if (!this.$route.params.phone) { // 不是来自分享的
      this.$http.get('/api/wx/config').then(function (res) {
        if (res.body.code === 0) {
          const infoObj = res.body.data
          this.$http.get('/api/user/info').then(function (res) {
            let _this = this
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
                  title: '"人人当地主"互联网时代茶庄园分享平台', // 分享标题
                  link: window.location.href + '/' + mobile, // 分享链接
                  imgUrl: _this.$data.tea.indexPicture, // 分享图标
                  success: function () {
                    this.$data.isShare = false
                    // window.alert('分享成功!!!!!!!!!')
                  },
                  cancel: function () {
                    // window.alert('取消分享')
                  }
                })
                wx.onMenuShareAppMessage({
                  title: '"人人当地主"互联网时代茶庄园分享平台', // 分享标题
                  desc: '', // 分享描述
                  link: window.location.href + '/' + mobile, // 分享链接
                  imgUrl: _this.$data.tea.indexPicture, // 分享图标
                  success: function () {
                    this.$data.isShare = false
                  },
                  cancel: function () {
                    // window.alert('取消分享')
                  }
                })
              })
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
    goPay: function (_id, _num) {
      if (this.$data.isActive) {
        if (!this.$route.params.phone) {
          window.location.href = '/?#/morder/' + _id + '/' + _num
        } else {
          window.location.href = '/?#/morder/' + _id + '/' + _num + '/' + this.$route.params.phone
        }
      } else {
        this.$data.altMessage = '请先同意购买使用协议'
        this.$data.showAlt = true
      }
    }
  },
  data () {
    return {
      tea: {},
      buyNumber: 1,
      isActive: true,
      showAlt: false,
      altMessage: '错误信息',
      isShare: false
    }
  }
}
</script>

<style scoped>
  .big {
    font-size: .28rem;
  }
  .middle {
    font-size: .24rem;
  }
  .gray {
    color: #9b9b9b;
  }
  .blue {
    color: #cb4042;
  }
  .item-hei {
    padding: .25rem 0;
  }
  .item-hei a {
    display:inline-block;
    width:100%;
    height:100%;
  }
  /* 页头图片 */
  .manor-img {
    height: 3.2rem;
    position: relative;
    background-color: #fff;
  }
  .manor-num {
    display: inline-block;
    padding: 0.06rem .16rem;
    position: absolute;
    top: .16rem;
    left: 0;
    background-color: #cb4042;
    color: #fff;
    font-size: .2rem;
    line-height: .2rem;
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
  }
  .check-number {
    line-height: .28rem;
    font-size: .24rem;
  }

  /* 中间部分的信息 */
  .tea-value {
    background-color: #fff;
    margin: .32rem .16rem;
    border: 0.02rem solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .tea-value li {
    position: relative;
    margin-left: .2rem;
    padding-right: .2rem;
    border-bottom: 0.02rem solid #dedede;
  }
  .tea-value li:last-child {
    border-bottom: none;
  }
  .value-amount {
    margin-right: .4rem;
  }
  .price {
    background-color: #fff;
    border-top: 0.02rem solid #dedede;
    border-bottom: 0.02rem solid #dedede;
  }
  .price li {
    margin-left: .2rem;
    padding-right: .2rem;
    border-bottom: 0.02rem solid #dedede;
  }
  .price li:last-child {
    border-bottom: none;
  }
  .price-amount {
    display: inline-block;
    margin-top: .06rem;
    font-size: .24rem;
    color: #d0011b;
  }
  .agreement {
    margin: .2rem 0 .4rem 0;
    text-align: center;
  }
  .agm-inner {
    display: inline-block;
    position: relative;
    padding-left: .34rem;
  }
  .check {
    display: inline-block;
    width: .24rem;
    height: .24rem;
    position: absolute;
    left: 0;
    top: 0.01rem;
    border: 0.02rem solid #9b9b9b;
  }
  .check.active {
    background: url("./assets/selected.png") no-repeat;
    background-size: 100% 100%;
  }
  .img-list {
    border-top: 1px solid #dedede;
    border-bottom: 1px solid #dedede;
  }
  .img-list li img {
    display: block;
  }
  .btn-buy {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    margin-top: .4rem;
    display: box;
    display: -webkit-box;
    text-align: center;
  }
  .btn-share {
    display: block;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    height: .8rem;
    border-top: 1px solid #dedede;
    background-color: #fff;
    font-size: .2rem;
    text-align: center;
  }
  .btn-now {
    display: block;
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    height: .8rem;
    background-color: #cb4042;
    color: #fff;
  }
  .arrow-r {
    display: inline-block;
    width: .4rem;
    height: .4rem;
    position: absolute;
    top: .21rem;
    right: .1rem;
    background: url("./assets/icon_arrow.png") no-repeat;
    background-size: 100% 100%;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
