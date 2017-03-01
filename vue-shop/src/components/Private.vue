<template>
  <div id="private" v-if="teaList.length>0">
      <router-link v-for="tea in teaList" class="private-detail" tag="section" :to="{path: '/goodsdetail/' + tea.id}">
        <p class="private-img">
          <img :src="tea.indexPicture" width="100%" height="100%" />
          <span class="private-tags" v-show="tea.userLevelName != ''">{{tea.userLevelName.substring(5)}}</span></p>
        <div class="private-info">
          <h3><span class="pri-detail-tit">{{tea.teaCategoryName}}</span><span class="pri-detail-star">{{tea.starLevel | starToText}}</span><span>{{tea.title | cutTitle}}</span></h3>
          <p class="pri-detail-weight"><span>{{tea.weightText}}</span></p>
          <div class="private-price">
            <span class="new-cost">&yen;{{tea.displayPrice}}</span>
            <span class="old-cost" v-if="tea.userLevel != 1"><del>原价&yen;{{tea.unitPrice}}</del></span>
          </div>
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
  }
}
</script>

<style scoped>
  #private {
    padding: .16rem .16rem 0 .16rem;
    background-color: #fff;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .private-detail {
    overflow: hidden;
    padding-bottom: .16rem;
    margin-bottom: .16rem;
    border-bottom: 0.02rem solid #dedede;
    position: relative;
  }
  .private-detail:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .private-img {
    float: left;
    width: 2.7rem;
    height: 1.8rem;
  }
  .private-info {
    margin-left: 2.86rem;
  }
  .private-info h3 {
    margin-bottom: .16rem;
  }
  .private-info h3 > span {
    font-size: .24rem;
    line-height: 1.3;
    margin-right: .16rem;
  }
  .pri-detail-weight {
    margin-bottom: .16rem;
  }
  .pri-detail-weight span {
    font-size: .24rem;
    color: #9b9b9b;
  }
  .private-tags {
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
  .private-price {
    position: absolute;
    bottom: .2rem;
    left: 2.9rem;
  }
  .private-price span.new-cost {
    color: #cb4042;
    font-size: .26rem;
    margin-right: .14rem;
  }
  .private-price span.old-cost del {
    color: #9b9b9b;
    font-size: .16rem;
  }
</style>
