<template>
  <div id="">
    <section class="charge-tea" v-for="(item, tit) in infoList">
      <h2>{{tit}}</h2>
      <ul class="tea-list">
        <li v-for="detail in item">
          <h3>{{detail.teaManorName}}</h3>
          <p class="detail-time">{{detail.updateTime}}</p>
          <p class="right detail-price">
            <span class="price-num">&yen; {{detail.earnings}}</span>
            <!--<span class="right detail-arrow"><img src="./assets/icon_arrow.png" width="100%" height="100%" /></span>-->
          </p>
        </li>
      </ul>
    </section>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
  export default {
    name: 'charge-tea',
    created () {
      document.title = '累计收茶'
      this.$http.get('api/assets/tea/manor/quarter/order?earningsType=1').then(function (res) {
        if (res.body.code === 0) {
          if (JSON.stringify(res.body.data) === '{}') {
            this.$router.replace('/assets/tea/empty')
          } else {
            this.$data.infoList = res.body.data
          }
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    data () {
      return {
        infoList: {},
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
  .charge-tea {
    background-color: #fff;
  }
  .charge-tea > h2 {
    padding: .2rem .3rem .1rem .3rem;
    background-color: #efefef;
    font-size: .24rem;
  }
  .charge-tea .tea-list {
    border-top: 1px solid #dedede;
    border-bottom: 1px solid #dedede;
  }
  .charge-tea .tea-list li {
    position: relative;
    padding: .2rem .3rem;
  }
  .charge-tea .tea-list li h3 {
    font-size: .28rem;
  }
  .detail-time {
    margin-top: .15rem;
    font-size: .22rem;
    color: #9b9b9b;
  }
  .detail-price {
    position: absolute;
    top: .4rem;
    right: .2rem;
  }
  .price-num {
    font-size: .28rem;
    color: #476d8f;
  }
  .detail-arrow {
    width: .36rem;
    height: .36rem;
    margin-left: .1rem;
  }
</style>
