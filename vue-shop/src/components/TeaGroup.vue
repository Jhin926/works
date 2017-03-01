<template>
  <div class="tea-group">
    <h1 class="group-tit">茶叶品种</h1>
    <p class="group-tip">您的茶叶组合默认包含以下茶叶</p>
    <ul v-for="(item, key) in group" class="group-list">
      <h2 class="item-title">{{key==0?'春':(key==1?'夏':(key==2?'秋':'冬'))}}</h2>
      <li>
        <div class="group-info" v-for="info in item">
          <span class="item-tit">{{info.name | cutTitle}} {{info.starLevel | starToText}}</span>
          <span class="right item-amount">{{info.weight * info.quantity * $route.params.num}}g</span>
        </div>
      </li>
    </ul>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
export default {
  name: 'teagroup',
  created () {
    document.title = '茶叶组合'
    this.$http.get('/api/teagroup/info?teaManorId=' + this.$data.id).then(function (res) {
      if (res.body.code === 0) {
        const data = res.body.data
        for (var key in data) {
          this.$data.group.push(data[key])
        }
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
  },
  filters: {
    cutTitle: function (value) {
      if (!value) return ''
      if (value.length > 15) {
        return value.substring(0, 15)
      }
      return value
    }
  },
  data () {
    return {
      id: this.$route.params.id,
      group: [],
      isShow: 0,
      showAlt: false,
      altMessage: '错误信息'
    }
  }
}
</script>

<style scoped>
  .group-tit {
    margin: .4rem .2rem .2rem .2rem;
    font-size: .36rem;
    font-weight: bold;
  }
  .group-tip {
    margin: 0 .2rem .4rem .2rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .group-list {
    padding: 0 .2rem;
  }
  .item-title {
    margin-bottom: .08rem;
    font-size: .28rem;
  }
  .group-list > li {
    padding:0.1rem 0.2rem 0 .2rem;
    min-height:0.8rem;
    margin-bottom: .2rem;
    border: .01rem solid #dedede;
    border-radius: .08rem;
    -webkit-border-radius: .08rem;
    -moz-border-radius: .08rem;
    background-color: #fff;
  }
  .group-list > li .group-info {
    overflow: hidden;
    height:0.8rem;
    line-height:0.8rem;
    border-top:1px solid #ededed;
  }
  .group-list > li .group-info:first-child {
    border-top: none;
  }
  .group-list > li .group-info.active {
    display: block !important;
  }
  .group-list > li .group-info:last-child {
    border-bottom: none;
  }
  .item-tit {
    font-size: .28rem;
  }
  .item-amount {
    margin-top: .07rem;
    font-size: .24rem;
    color: #9b9b9b;
    display: inline-block;
    height: 0.6rem;
    line-height: 0.6rem;
  }
</style>
