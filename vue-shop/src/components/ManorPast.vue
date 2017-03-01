<template>
  <div class="manor-past">
    <section class="past-detail" v-for="manor in manorList">
      <h2 class="past-tit">{{manor.name}}</h2>
      <p class="past-time">{{manor.beginDate | formatTime}}-{{manor.endDate | formatTime}}</p>
      <div class="past-info">
        <div>
          <p class="info-text"><i>{{manor.size}}</i>亩</p>
          <p class="info-tit">可购面积</p>
        </div>
        <div>
          <p class="info-text"><i>{{manor.annualIncomeText}}</i></p>
          <p class="info-tit">预期代销收益</p>
        </div>
        <div>
          <p class="info-text"><i>{{manor.teaValue}}</i>元</p>
          <p class="info-tit">茶包价值</p>
        </div>
      </div>
      <span class="past-sta"><img src="../assets/icon-none.png" width="100%" /></span>
    </section>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>
<script>
  export default {
    name: 'tea',
    created () {
      document.title = '往期庄园'
      this.$http.get('/api/teamanor/list/history').then(function (res) {
        if (res.body.code === 0) {
          this.$data.manorList = res.body.data
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    filters: {
      formatTime: function (value) {
        const oldDate = new Date(value)
        var strYear = oldDate.getFullYear()
        var strMon = oldDate.getMonth() + 1
        var strDate = oldDate.getDate()
        return strYear + '年' + strMon + '月' + strDate + '日'
      }
    },
    data () {
      return {
        manorList: {},
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>
<style scoped>
  .manor-past {
    margin-top: .2rem;
  }
  .past-detail {
    position: relative;
    background-color: #fff;
    margin: 0 .2rem .2rem .2rem;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    border: 1px solid #dedede;
  }
  h2.past-tit {
    font-size: .28rem;
    padding: .3rem .2rem .2rem .2rem;
  }
  .past-time {
    color: #9b9b9b;
    font-size: .24rem;
    padding: 0 0 .2rem .2rem;
  }
  .past-info {
    border-top: .01rem solid #dedede;
    padding: .4rem 0 .3rem 0;
    display: box;
    display: -webkit-box;
    display: -moz-box;
  }
  .past-info > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    text-align: center;
  }
  .info-text {
    font-size: .24rem;
  }
  .info-text i {
    font-size: .36rem;
  }
  .info-tit {
    margin-top: .15rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .past-sta {
    position: absolute;
    width: .8rem;
    height: .8rem;
    top: .2rem;
    right: .2rem;
  }
</style>
