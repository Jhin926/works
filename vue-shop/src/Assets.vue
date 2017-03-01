<template>
  <div class="assets">
    <overview :info="assetsInfo"></overview>
    <ul class="manor-list">
      <router-link tag="li" v-for="item in assetList" :to="{path: '/assets/manor/'+item.manorOrderId+'/'+item.teaManorId}">
        <h2><span class="item-title">{{item.teaManorName}}</span><span class="item-status" v-if="item.isCanReceive == 1">可领取</span></h2>
        <p class="item-time">{{item.createTime}}</p>
        <span class="right item-num">
          <span class="num-text">{{item.totalSize}}亩</span>
          <img class="right" src="./assets/icon_arrow.png">
        </span>
      </router-link>
    </ul>
    <bar></bar>
    <footer class="seat"></footer>
  </div>
</template>

<script>
  import Bar from './components/Bar'
  import Overview from './components/Overview'
  export default {
    name: 'assets',
    components: {
      Bar,
      Overview
    },
    created () {
      document.title = '资产'
      this.$http.get('api/assets/info').then(function (res) {
        if (res.body.code === 300002 || res.body.code === 300001) {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        } else {
          if (res.body.data === null) {
            this.$router.replace('/assets/assets/empty')
          } else {
            var data = res.body.data
            this.$set(this.$data.assetsInfo, 'tit', data.totalAssets + '亩茶庄园')
            this.$set(this.$data.assetsInfo, 'leftVal', data.totalCollectTea)
            this.$set(this.$data.assetsInfo, 'rightVal', data.totalConsignment)
          }
        }
      })
      this.$http.get('api/assets/list').then(function (res) {
        if (res.body.code === 300002 || res.body.code === 300001) {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        } else {
          this.$data.assetList = res.body.data
        }
      })
    },
    data () {
      return {
        assetsInfo: {
          tag: '总资产',
          leftUrl: '/charge-tea',
          rightUrl: '/accumulatedcommission',
          bgImg: 'assets',
          leftName: '累计收茶',
          rightName: '累计代销'
        },
        assetList: {}
      }
    }
  }
</script>

<style scoped>
   .assets {
     overflow:hidden;
   }
   .manor-list {
     margin-top: .16rem;
   }
   .manor-list li {
     position: relative;
     margin: .16rem .16rem 0 .16rem;
     padding: .2rem .3rem;
     border: 1px solid #dedede;
     background-color: #fff;
   }
   .manor-list h2 {
     overflow: hidden;
   }
   .manor-list h2 span {
     float: left;
   }
   .manor-list .item-title {
     font-size: .28rem;
   }
   .item-status {
     display: inline-block;
     width: .8rem;
     height: .32rem;
     padding-top: .03rem;
     margin-left: .08rem;
     font-size: 0.2rem;
     text-align: center;
     color: #cb4042;
     border: 1px solid #cb4042;
   }
   .item-time {
     margin-top: .19rem;
     font-size: .24rem;
     color: #9b9b9b;
   }
   .item-num {
     display: inline-block;
     position: absolute;
     top: .45rem;
     right: .3rem;
   }
   .item-num .num-text {
     font-size: .28rem;
   }
   .item-num img {
     width: .3rem;
     height: .3rem;
     margin-top: .03rem;
     margin-left: .05rem;
   }
   .seat {
     min-width: .1rem;
     min-height: 1.1rem;
   }
</style>
