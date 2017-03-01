<template>
  <div id="">
    <div class="replacethetea">
      <div class="replace-title">
        <p>茶叶品种</p>
        <p>点击您想要替换的茶叶，选择您心仪的茶叶。</p>
      </div>
      <div v-for="(item, index) in list">
        <div class="replace-item" v-on:click="isShow = isShow==index?-1:index">
          <p class="left">{{item.teaManorGroupListResult.categoryName}} {{item.teaManorGroupListResult.starLevel |
            starToText}}</p>
          <p class="right">{{item.teaManorGroupListResult.weight}}g</p>
        </div>
        <div class="replace-item1" v-show="isShow == index">
          <div class="replace-item1-item" v-for="(it, index1) in item.teaManorGroupListResults"
               v-on:click.stop="choiceTea(index, it)">
            <p class="left">{{it.categoryName}} {{it.starLevel | starToText}}</p>
            <p class="right">{{it.weight}}g</p>
          </div>
        </div>
      </div>
      <div class="button">
        <button v-on:click="submit">确认</button>
      </div>
    </div>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
  export default {
    name: 'replacethetea',
    created () {
      document.title = '替换茶叶'
      this.$http.get('api/teagroup/tea/replace?teaManorId=' + this.$route.params.teamonarid + '&quarter=' + this.$route.params.qua).then(function (res) {
        if (res.body.code === 0) {
          var teaList = this.$data.list = res.body.data
          for (var i = 0; i < teaList.length; i++) {
            this.$data.chooseId.push(teaList[i].teaManorGroupListResult.id)
          }
        }
      })
    },
    methods: {
      choiceTea: function (_index, _item) {
        this.$data.chooseId[_index] = _item.id
        this.$data.list[_index].teaManorGroupListResult = _item
        // this.$el.className += ' active'
      },
      submit: function () {
        this.$data.isLoading = true
        const ids = this.$data.chooseId.join(',')
        this.$http.get('/api/teagroup/replace/confirm?quarterOrderId=' + this.$route.params.quarterid + '&ids=' + ids + '&orderId=' + this.$route.params.orderid).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            window.history.go(-1)
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      }
    },
    data () {
      return {
        list: {},
        chooseId: [],
        isShow: -1,
        isLoading: false,
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
    .replacethetea {
      max-width:640px;
    }
    .replace-title {
      width:100%;
      padding:0.4rem 0 0 0.2rem;
      margin-bottom:0.4rem;
    }
    .replace-title p:nth-child(1){
      font-size:0.36rem;
    }
    .replace-title p:nth-child(2){
      font-size:0.24rem;
      color:#9b9b9b;
      margin-top:0.1rem;
    }
    .replace-item {
      width:94%;
      margin:0 auto 0.2rem;
      height:0.96rem;
      border:1px solid #cb4042;
      border-radius:0.1rem;
      padding:0 0.2rem;
      background-color: #fff;
    }
    .replace-item1 {
      width:94%;
      margin:0 0 0.2rem 0.2rem;
      border:1px solid #dedede;
      border-radius:0.1rem;
      background-color: #fff;
    }
    .replace-item1 .replace-item1-item {
      height:0.8rem;
      line-height:0.8rem;
      border-bottom:1px solid #dedede;
      margin-left:0.2rem;
    }
    .replace-item1 .replace-item1-item.active {
      background-color: #dedede;
    }
    .replace-item1 .replace-item1-item:last-child {
      border-bottom:none;
    }
    .replace-item1 .replace-item1-item p {
      width:48%;
      height:100%;
      line-height:0.8rem;
      font-size:0.28rem;
    }
    .replace-item1 .replace-item1-item .right {
      padding-right:0.2rem;
      text-align:right;
      color:#989898;
    }
    .replace-item p {
      height:100%;
      line-height:0.96rem;
      font-size:0.28rem;
    }
    .replace-item .left {
      width:84%;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .replace-item .right {
      color:#989898;
      text-align:right;
      width:15%;
    }
    .button {
      width:100%;
      height:.8rem;
      background:#cb4042;
      position:fixed;
      left:0;
      bottom:0;
    }
    .button button {
      width:100%;
      height:100%;
      font-size:0.24rem;
      color:#fff;
    }
</style>
