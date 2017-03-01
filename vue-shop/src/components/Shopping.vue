<template>
  <div id="shopping">
    <router-link tag="section" class="private-detail" :to="{'path': '/goodssnap/'+ (tea.teaId == undefined ? tea.id : tea.teaId)}" v-for="tea in teaList">
      <p class="private-img"><img :src="tea.indexPicture" width="100%" height="100%" /></p>
      <div class="private-info">
        <h3><span class="pri-detail-tit">{{tea.teaCategoryName}}</span><span class="pri-detail-star">{{tea.starLevel | starToText}}</span><span>{{tea.title | cutTitle}}</span></h3>
        <p class="pri-detail-weight">{{tea.weightText}}</p>
        <div class="private-price">
          <span class="new-cost">&yen; {{tea.displayPrice}}</span>
        </div>
        <span class="shopping-num"><span>x</span>{{tea.quantity}}</span>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'private',
  props: ['teaList'],
  filters: {
    cutTitle: function (value) {
      if (!value) return ''
      if (value.length > 16) {
        return value.substring(0, 16)
      }
      return value
    }
  }}
</script>

<style scoped>
  #shopping {
    margin: 0 .16rem;
    background-color: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    border: 1px solid #dedede;
  }
  .private-detail {
    overflow: hidden;
    padding: .16rem .16rem .16rem 0;
    margin-left: .16rem;
    border-bottom: 0.02rem solid #dedede;
    position: relative;
  }
  .private-detail:last-child {
    border-bottom: none;
  }
  .private-img {
    float: left;
    width: 2.7rem;
    height: 1.8rem;
  }
  .private-info {
    margin-left: 2.9rem;
  }
  .private-info h3 {
    margin-bottom: .1rem;
  }
  .private-info h3 > span {
    font-size: .28rem;
    line-height: .36rem;
    margin-right: .1rem;
  }
  .pri-detail-weight {
    font-size: .24rem;
    color: #9b9b9b;
  }
  .private-tags > span {
    display: inline-block;
    padding: 0.05rem 0.08rem;
    margin-right: 0.04rem;
    border-radius: 0.07rem;
    -webkit-border-radius: 0.07rem;
    -moz-border-radius: 0.07rem;
    font-size: .18rem;
    color: #fff;
  }
  .private-tags > span.red {
    background-color: #d0021b;
  }
  .private-tags > span.green {
    background-color: #80a951;
  }
  .private-tags > span.blue {
    background-color: #476d8f;
  }
  .private-tags > span.orange {
    background-color: #F6A623;
  }
  .private-price {
    position: absolute;
    bottom: .16rem;
    left: 2.9rem;
  }
  .private-price span.new-cost {
    color: #d0021b;
    font-size: .24rem;
    margin-right: .14rem;
  }
  span.shopping-num {
    position: absolute;
    right: .2rem;
    bottom: .16rem;
    color: #9b9b9b;
    font-size: .24rem;
  }
  span.shopping-num span {
    font-size: .24rem;
    color: #9b9b9b;
  }
</style>
