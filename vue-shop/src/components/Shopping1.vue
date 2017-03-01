<template>
  <div id="shopping">
    <section class="private-detail" v-for="tea in teaList">
      <p class="private-img"><img :src="tea.indexPicture" width="100%" /></p>
      <div class="private-info">
        <h3><span class="pri-detail-tit">{{tea.categoryName}}</span><span class="pri-detail-star">{{tea.starLevel | starToText}}</span><!--<span>{{tea.name | cutTitle}}</span>--></h3>
        <p class="pri-detail-weight">{{tea.weight}}g</p>
        <div class="private-price">
          <span class="new-cost">&yen; {{tea.unitPrice}}</span>
        </div>
        <span class="shopping-num"><span>x</span>{{tea.quantity}}</span>
      </div>
    </section>
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
    border-radius: 2px;
    -webkit-border-radius: 2px;
    background-color: #fff;
    border: 1px solid #dedede;
  }
  .private-detail {
    overflow: hidden;
    padding: .3rem .2rem .3rem 0;
    margin-left: .2rem;
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
    font-size: .26rem;
    margin-right: .1rem;
  }
  .pri-detail-weight {
    font-size: .24rem;
    color: #9b9b9b;
  }
  .private-price {
    position: absolute;
    bottom: .3rem;
    left: 2.9rem;
  }
  .private-price span.new-cost {
    color: #d0021b;
    font-size: .26rem;
    margin-right: .14rem;
  }
  span.shopping-num {
    position: absolute;
    right: .2rem;
    bottom: .3rem;
    color: #9b9b9b;
    font-size: .24rem;
  }
  span.shopping-num span {
    font-size: .24rem;
    color: #9b9b9b;
  }
</style>
