<template>
  <div id="paging" class="right">
    <ul class="paging-list">
      <li class="prev-btn" v-on:click="checkPg(false)">&lt;</li>
      <li v-on:click="inputPg(1)" v-bind:class="{ active: curPg == 1}">1</li>
      <li class="omit" v-if="curPg>5" @click="chgArr()">...</li>
      <li v-for="pg in Math.ceil(total/sizePg)" v-if="pg>=startPg && pg<=endPg" v-bind:class="{ active: pg==curPg}" v-on:click="inputPg(pg)">{{pg}}</li>
      <li class="omit" v-if="Math.ceil(total/sizePg)>6 && endPg < Math.ceil(total/sizePg) - 1" @click="chgArr(true)">...</li>
      <li v-if="Math.ceil(total/sizePg)>5" v-on:click="inputPg(Math.ceil(total/sizePg))">{{Math.ceil(total/sizePg)}}</li>
      <li class="next-btn" v-on:click="checkPg(true)">&gt;</li>
    </ul>
    <input v-model="page" type="text" class="input-page" />
    <button v-on:click="inputPg(page)" class="btn-sure">确定</button>
    <span>共{{total}}条</span>
  </div>
</template>

<script>
export default {
  name: 'page',
  props: ['total', 'curPg'],
  methods: {
    checkPg (_next) {
      var curPg = this.$parent.$data.pageObj.curPg
      if (_next) {
        const tl = Math.ceil(this.$parent.$data.pageObj.total / this.$data.sizePg)
        if (curPg < tl) {
          curPg++
          this.$emit('chgPg', curPg)
        }
      } else {
        if (curPg > 1) {
          curPg--
          this.$emit('chgPg', curPg)
        }
      }
    },
    inputPg (_page) {
      if (_page >= 1 && _page <= Math.ceil(this.$parent.$data.pageObj.total / this.$data.sizePg)) {
        this.$emit('chgPg', _page)
      }
    },
    chgArr (_next) {
      if (_next) {
        this.$data.startPg = this.$data.endPg + 1
        this.$data.endPg += 5
        if (this.$data.startPg > Math.ceil(this.$parent.$data.pageObj.total / this.$data.sizePg) - 4) {
          this.$data.startPg = Math.ceil(this.$parent.$data.pageObj.total / this.$data.sizePg) - 4
        }
        if (this.$data.endPg >= Math.ceil(this.$parent.$data.pageObj.total / this.$data.sizePg)) {
          this.$data.endPg = Math.ceil(this.$parent.$data.pageObj.total / this.$data.sizePg) - 1
        }
        this.$emit('chgPg', this.$data.startPg)
      } else {
        this.$data.startPg -= 5
        this.$data.endPg -= 5
        if (this.$data.startPg <= 1) {
          this.$data.startPg = 2
        }
        if (this.$data.endPg < 5) {
          this.$data.endPg = 5
        }
        this.$emit('chgPg', this.$data.startPg)
      }
    }
  },
  data () {
    return {
      page: '',
      startPg: 2,
      endPg: 5,
      sizePg: this.$parent.$data.pageObj.pageSize
    }
  }
}
</script>

<style scoped>
  #paging {
    min-width: 260px;
    height: 100%;
    margin-top: 20px;
    overflow: hidden;
  }
  .paging-list {
    overflow: hidden;
    float: left;
    margin-right: 10px;
    display: inline-block;
  }
  .paging-list li {
    float: left;
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
  }
  .paging-list li.active {
    color: #476d8f;
  }
  .paging-list li:hover {
    background: #ccc;
  }
  .input-page {
    width: 28px;
    height: 24px;
    padding: 0 5px;
    margin-right: 5px;
    border: 1px solid #c8c8c8;
    text-align: center;
  }
  .btn-sure {
    outline: none;
    cursor: pointer;
    padding: 4px 0;
    margin-right: 5px;
  }
  .btn-sure:hover {
    background-color: #ccc;
  }
</style>
