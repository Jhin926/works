<template>
    <router-link tag="section" class="tea-manor" :to="{path: '/manorDetail/' + tea.id}">
      <h2 class="manor-tit">
        <span class="icon-tit"></span>
        人人当地主
        <router-link to="/manorpast" class="manor-past">往期产品</router-link>
      </h2>
      <div class="manor-detail">
        <p class="manor-img">
          <img :src="tea.indexPicture" width="100%" height="100%" />
          <span class="manor-num">剩余{{tea.remainSize}}亩</span>
        </p>
        <div class="manor-info">
          <div class="manor-value">
            <p class="manor-val-tit">
              <span><img src="../assets/leaf.png" width="100%" height="100%" /></span>
              价值{{tea.teaValue}}元茶叶组合
            </p>
          </div>
          <div class="manor-profit">
            <p class="manor-val-tit">
              <span><img src="../assets/money.png" width="100%" height="100%" /></span>
              代销可获{{tea.annualIncomeText}}收益
            </p>
          </div>
        </div>
      </div>
      <alert v-if="showAlt">
        <div slot="content">{{altMessage}}</div>
        <p slot="sure" @click="showAlt = false;">确定</p>
      </alert>
    </router-link>
</template>
<script>
  export default {
    name: 'tea',
    created () {
      this.$http.get('/api/teamanor/index').then(function (res) {
        if (res.body.code === 0) {
          this.$data.tea = res.body.data
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    data () {
      return {
        tea: {},
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>
<style scoped>
  .tea-manor {
    margin-top: .48rem;
    padding: 0 .16rem;
  }
  .manor-tit {
    position: relative;
    margin-bottom: .16rem;
    font-size: .24rem;
  }
  .manor-tit .icon-tit {
    float: left;
    width: 2px;
    height: .3rem;
    margin-top: .02rem;
    margin-right: .16rem;
    background-color: #cd4042;
  }
  .manor-tit .manor-past {
    position: absolute;
    top: 0;
    right: 0;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .manor-detail {
    padding: .16rem;
    background-color: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    border: 1px solid #dedede;
  }
  .manor-img {
    position: relative;
    height: 3rem;
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
  .manor-info {
    display: box;
    display: -webkit-box;
    display: -moz-box;
  }
  .manor-info > div{
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    margin: .32rem 0 .16rem 0;
    text-align: center;
  }
  .manor-info .manor-value {
    border-right: 1px solid #dedede;
  }
  .manor-val-tit {
    vertical-align: middle;
    font-size: .24rem;
  }
  .manor-val-tit span {
    display: inline-block;
    width: .24rem;
    height: .24rem;
  }
</style>
