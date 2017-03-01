<template>
  <div id="product">
    <div id="title">
      <h2>
        发布庄园
      </h2>
      <div class="head-handle">
        <div class="right member-handle" v-on:click="hShow = !hShow">
          <span class="left icon-member"><img src="../assets/icon-title.png" width="32" height="32" alt="" /></span>
          {{name || '空'}}
          <span class="btn-handle"></span>
          <div v-show="hShow" class="handle-con" v-on:click="loginout">
            <span><img src="../assets/icon_logout.png"></span>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <div class="manor-path">
      <router-link to="../teamanor">庄园管理</router-link> >
      <span>发布庄园</span>
    </div>
    <ul class="pro-input">
      <li>
        <label for="pro-name"><span>*</span>名称</label>
        <input class="large" type="text" id="pro-name" v-model="manorname" />
        <input class="smaller" type="text" v-model="serial"> 0/60
      </li>
      <li>
        <div class="man-price">
          <label for="pro-type"><span>*</span>单价</label>
          <input class="middle" type="text" id="pro-type" v-model="manorObj.unitPrice" /> 元
        </div>
        <div class="total-area">
          <label for="pro-num"><span>*</span>大小</label>
          <input class="middle" type="number" id="pro-num" v-model="manorObj.size" /> 亩
        </div>
      </li>
      <li>
        <div class="man-price">
          <label for="pro-stock"><span>*</span>库存</label>
          <input class="middle" type="number" id="pro-stock" v-model="manorObj.amounts" /> 份
        </div>
        <div class="total-area">
          <label for="man-total">总量</label>
          <input class="middle" type="text" id="man-total" :value="manorObj.amounts*manorObj.size" readonly /> 亩
        </div>
      </li>
      <li>
        <div>
          <label for="pro-shelf"><span>*</span>年化收益率</label>
          <input class="middle" type="text" id="pro-shelf" v-model="manorObj.annualIncome" /> %
        </div>
        <div>
          <label for="pro-sort"><span>*</span>年化收益率(显示)</label>
          <input class="middle" type="text" id="pro-sort" v-model="manorObj.annualIncomeText" />
        </div>
      </li>
      <li>
        <div>
          <label for="pro-price"><span>*</span>开始日期</label>
          <input class="middle" type="date" id="pro-price" v-model="manorObj.beginDate" />
        </div>
        <div>
          <label for="pro-grade"><span>*</span>结束日期</label>
          <input class="middle" type="date" id="pro-grade" v-model="manorObj.endDate" />
        </div>
      </li>
      <li>
        <div>
          <label for="man-time"><span>*</span>投资时长</label>
          <input class="middle" type="text" id="man-time" value="360" readonly="true" /> 天
        </div>
        <div>
          <label for="manor-no">排序号</label>
          <input class="middle" type="text" id="manor-no" v-model="serialNumber" />
        </div>
      </li>
      <li>
        <div class="tea-value">
          <label for="pro-origin"><span>*</span>茶叶价值</label>
          <input class="middle" type="text" id="pro-origin" v-model="manorObj.teaValue" /> 元
        </div>
        <label><span>*</span>春季</label>
        <div class="tea-group">
          <div class="left chioced-tea" v-for="(list, index) in chioced1">
            <ul>
              <li v-for="(item, index1) in list">
                {{item.teaCategoryName}} {{item.starLevel | starToText}} {{item.weightText}}
                <input type="text" class="tea-quantity" v-model="chioced1[index][index1].quantity" readonly="true" />
                <span class="chioced-del" v-on:click="chioced1[index].splice(index1,1);chioced1[index].length==0?chioced1.splice(index,1):chioced1.splice(index,0);"></span>
              </li>
            </ul>
            <div class="chioced-text">
              已选{{chioced1[index].length}}个产品
              <span class="chioced-change" v-on:click="addTea(index, 1)"></span>
            </div>
            <span class="chioced-del2" v-on:click="chioced1.splice(index,1)"></span>
          </div>
          <p v-on:click="chioceTea = true;checked=[proList[0]];quarter=1;" class="left btn-group">
            <img src="../assets/img-upload.png" width="100%" height="100%" alt="" />
          </p>
        </div>
      </li>
      <li>
        <label><span>*</span>夏季</label>
        <div class="tea-group">
          <div class="left chioced-tea" v-for="(list, index) in chioced2">
            <ul>
              <li v-for="(item, index1) in list">
                {{item.teaCategoryName}} {{item.starLevel | starToText}} {{item.weightText}}
                <input type="text" class="tea-quantity" v-model="chioced2[index][index1].quantity" readonly />
                <span class="chioced-del" v-on:click="chioced2[index].splice(index1,1);chioced2[index].length==0?chioced2.splice(index,1):chioced2.splice(index,0);"></span>
              </li>
            </ul>
            <div class="chioced-text">
              已选{{chioced2[index].length}}个产品
              <span class="chioced-change" v-on:click="addTea(index, 2)"></span>
            </div>
            <span class="chioced-del2" v-on:click="chioced2.splice(index,1)"></span>
          </div>
          <p v-on:click="chioceTea = true;checked=[proList[0]];quarter=2;" class="left btn-group">
            <img src="../assets/img-upload.png" width="100%" height="100%" alt="" />
          </p>
        </div>
      </li>
      <li>
        <label><span>*</span>秋季</label>
        <div class="tea-group">
          <div class="left chioced-tea" v-for="(list, index) in chioced3">
            <ul>
              <li v-for="(item, index1) in list">
                {{item.teaCategoryName}} {{item.starLevel | starToText}} {{item.weightText}}
                <input type="text" class="tea-quantity" v-model="chioced3[index][index1].quantity" readonly />
                <span class="chioced-del" v-on:click="chioced3[index].splice(index1,1);chioced3[index].length==0?chioced3.splice(index,1):chioced3.splice(index,0);"></span>
              </li>
            </ul>
            <div class="chioced-text">
              已选{{chioced3[index].length}}个产品
              <span class="chioced-change" v-on:click="addTea(index, 3)"></span>
            </div>
            <span class="chioced-del2" v-on:click="chioced3.splice(index,1)"></span>
          </div>
          <p v-on:click="chioceTea = true;checked=[proList[0]];quarter=3;" class="left btn-group">
            <img src="../assets/img-upload.png" width="100%" height="100%" alt="" />
          </p>
        </div>
      </li>
      <li>
        <label><span>*</span>冬季</label>
        <div class="tea-group">
          <div class="left chioced-tea" v-for="(list, index) in chioced4">
            <ul>
              <li v-for="(item, index1) in list">
                {{item.teaCategoryName}} {{item.starLevel | starToText}} {{item.weightText}}
                <input type="text" class="tea-quantity" v-model="chioced4[index][index1].quantity" readonly />
                <span class="chioced-del" v-on:click="chioced4[index].splice(index1,1);chioced4[index].length==0?chioced4.splice(index,1):chioced4.splice(index,0);"></span>
              </li>
            </ul>
            <div class="chioced-text">
              已选{{chioced4[index].length}}个产品
              <span class="chioced-change" v-on:click="addTea(index, 4)"></span>
            </div>
            <span class="chioced-del2" v-on:click="chioced4.splice(index,1)"></span>
          </div>
          <p v-on:click="chioceTea = true;checked=[proList[0]];quarter=4;" class="left btn-group">
            <img src="../assets/img-upload.png" width="100%" height="100%" alt="" />
          </p>
        </div>
      </li>
      <li>
        <label><span>*</span>图片</label>
        <ul class="btn-upload">
          <li class="left" v-if="imgList.length>0"><img :src="imgList[0]" width="100" height="100" /></li>
          <div class="clear"></div>
          <li><label for="upload"><img src="../assets/img-upload.png" width="100" height="100" alt="" /></label></li>
        </ul>
        <p class="upload-prompt">支持jpg、jpeg、png图片格式，主图大小不能超过3MB，宽度不超过640px</p>
      </li>
      <form style="display: none;" id="uploadImgCon" enctype="multipart/form-data" method="post">
        <input name="file" v-on:change="uploadImg($event)" id="upload" type="file"/>
        <input name="dictFileUpType" type="number" value="0" />
        <input name="uploadCatalog" type="text" value="tea" />
      </form>
      <li>
        <label><span>*</span>描述图片</label>
        <draggable class="btn-upload des-upload" :list="depictList">
          <li v-for="(img, index) in depictList" class="left del-cont">
            <span class="img-del" v-on:click="depictList.splice(index,1)"><img src="../assets/icon-del2.png"></span>
            <img :src="img" width="100" height="100" /></li>
          <div class="clear"></div>
          <li>
            <label for="uploaddes">
              <img src="../assets/img-upload.png" width="100" height="100" alt="" />
            </label>
          </li>
        </draggable>
        <form style="display: none;" id="uploadImgDes" enctype="multipart/form-data" method="post">
          <input name="file" v-on:change="uploadImgDes($event)" id="uploaddes" type="file" multiple />
          <input name="dictFileUpType" type="number" value="0" />
          <input name="uploadCatalog" type="text" value="tea" />
        </form>
        <p class="upload-prompt des-prompt">支持jpg、jpeg、png图片格式，图片大小不能超过3MB，宽度不超过640px</p>
      </li>
      <li style="display:none;">
        <label>庄园详情</label>
        <textarea class="manor-detail" v-model="manorObj.desc"></textarea>
      </li>
    </ul>
    <div class="btn-share">
      <button v-on:click="save">保存</button>
      <button v-on:click="publish">保存并发布</button>
    </div>
    <div class="check-modal" v-show="chioceTea">
      <div class="modal-inner">
        <h2 class="modal-tit">选择产品</h2>
        <span class="btn-close" v-on:click="chioceTea = false;addTeaGroup=-1"></span>
        <div class="modal-header">
          <div class="left filter-check">
            <input id="check-all" type="checkbox" v-on:change="checkedAll" />
            <label class="check-all" for="check-all">全选</label>
          </div>
          <div class="right modal-search">
            <span v-on:click="productSearch"></span>
            <input type="text" placeholder="请输入产品名称" v-model="productName" />
          </div>
          <div class="right filter-star" >
            <label>星级</label>
            <select v-model="starlevel">
              <option value="0"></option>
              <option value="1">一星</option>
              <option value="2">二星</option>
              <option value="3">三星</option>
              <option value="4">四星</option>
              <option value="5">五星</option>
              <option value="6">六星</option>
              <option value="7">七星</option>
              <option value="8">八星</option>
              <option value="9">九星</option>
            </select>
          </div>
          <div class="right filter-type">
            <label>品类</label>
            <select v-model="category">
              <option value="0"></option>
              <option v-for="cate in categoryList" v-bind:value="cate.id">{{cate.name}}</option>
            </select>
          </div>
        </div>
        <div class="modal-body">
          <ul class="tea-list">
            <li v-for="(product,index) in proList">
              <span class="set-default">
                <input name="default" type="radio" :value="index" v-model="dftTea" />
                <label>设为默认</label>
              </span>
              <p class="left item-check"><input type="checkbox" :value="product" v-model="checked" /></p>
              <p class="left item-no">{{product.artNo}}</p>
              <p class="left item-img"><img :src="product.indexPicture ? (product.indexPicture.indexOf('http') >= 0 ? product.indexPicture : 'http://'+ product.indexPicture) : ''" width="100" height="70" /></p>
              <div class="tea-info">
                <h3 class="tea-tit">{{product.teaCategoryName}} {{product.starLevel | starToText}} {{product.title}} {{product.weightText}}</h3>
                <p class="tea-price">&yen; {{product.unitPrice}}</p>
                <p class="tea-stock">库存: {{product.totalInventory}}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button class="btn-cal" v-on:click="chioceTea = false;addTeaGroup=-1">取消</button>
          <button class="right btn-submit" v-on:click="addGroup">提交</button>
          <span class="right tea-checked">已选{{checked.length}}个产品</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import datepicker from 'vue-date-picker'
import draggable from 'vuedraggable'
export default {
  name: 'manor',
  components: {
    draggable
  },
  created () {
    this.$http.get('/api/tea/list?pageSize=200').then(function (res) {
      if (res.body.code === 0) {
        this.$data.proList = res.body.data.results
        for (var i = 0; i < this.$data.proList.length; i++) {
          this.$data.proList[i].quantity = 1
          this.$data.proList[i].isDefault = 0
        }
        this.$data.proList[0].isDefault = 1
      } else {
        window.alert(res.body.message)
      }
    })
    this.$http.get('api/user/info').then(function (res) {
      if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.href = '#/login'
      } else if (res.body.code === 0) {
        this.$data.name = res.body.data.name
      } else {
        window.alert(res.body.message)
      }
    })
    this.$http.get('api/teaManor/sortno').then(function (res) {
      if (res.body.code === 0) {
        this.$data.serialNumber = res.body.data
      } else {
        window.alert(res.body.message)
      }
    })
    this.$http.get('api/tea/category/list').then(function (res) {
      if (res.body.code === 0) {
        this.$data.categoryList = res.body.data
      } else {
        window.alert(res.body.message)
      }
    })
    this.$http.get('api/teaManor/serialnumber').then(function (res) {
      if (res.body.code === 0) {
        this.$data.serial = res.body.data
      } else {
        window.alert(res.body.message)
      }
    })
  },
  methods: {
    publish: function () {
      if (this.$data.chioced1.length <= 0 || this.$data.chioced2.length <= 0 || this.$data.chioced3.length <= 0 || this.$data.chioced4.length <= 0) {
        window.alert('茶组合不能为空')
        return
      }
      if (this.$data.imgList.length > 0 && this.$data.depictList.length > 0) {
        this.$data.manorObj.teaGroups = JSON.stringify(this.chiocedObj)
        this.$data.manorObj.indexPicture = this.$data.imgSrc
        this.$data.manorObj.teaManorDescPirctures = this.$data.depictList.join(',')
        this.$data.manorObj.sortNo = this.$data.serialNumber
        this.$data.manorObj.serialNumber = this.$data.serial
        this.$data.manorObj.status = 2
        this.$data.manorObj.name = this.$data.manorname
        this.$http({
          method: 'post',
          url: '/api/teaManor/add',
          body: this.$data.manorObj
        }).then(function (res) {
          if (res.body.code === 0) {
            window.location.href = '#/index/teamanor'
          } else {
            window.alert(res.body.message)
          }
        })
      } else {
        window.alert('请上传图片')
      }
    },
    save: function () {
      if (this.$data.chioced1.length <= 0 || this.$data.chioced2.length <= 0 || this.$data.chioced3.length <= 0 || this.$data.chioced4.length <= 0) {
        window.alert('茶组合不能为空')
        return
      }
      if (this.$data.imgList.length > 0 && this.$data.depictList.length > 0) {
        this.$data.manorObj.teaGroups = JSON.stringify(this.chiocedObj)
        this.$data.manorObj.indexPicture = this.$data.imgSrc
        this.$data.manorObj.teaManorDescPirctures = this.$data.depictList.join(',')
        this.$data.manorObj.serialNumber = this.$data.serial
        this.$data.manorObj.sortNo = this.$data.serialNumber
        this.$data.manorObj.status = 1
        this.$data.manorObj.name = this.$data.manorname
        this.$http({
          method: 'post',
          url: '/api/teaManor/add',
          body: this.$data.manorObj
        }).then(function (res) {
          if (res.body.code === 0) {
            window.location.href = '#/index/teamanor'
          } else {
            window.alert(res.body.message)
          }
        })
      } else {
        window.alert('请上传图片')
      }
    },
    addTea: function (_index, qa) {
      this.$data.chioceTea = true
      this.$data.addTeaGroup = _index
      this.$data.quarter = qa
      this.$data.checked = []
      let ck = []
      if (qa === 1) {
        ck = this.$data.chioced1[_index]
      } else if (qa === 2) {
        ck = this.$data.chioced2[_index]
      } else if (qa === 3) {
        ck = this.$data.chioced3[_index]
      } else if (qa === 4) {
        ck = this.$data.chioced4[_index]
      }
      let pl = this.$data.proList
      for (let i = 0; i < ck.length; i++) {
        for (let j = 0; j < pl.length; j++) {
          if (ck[i].id === pl[j].id) {
            if (ck[i].isDefault === 1) {
              for (let k = 0; k < pl.length; k++) {
                if (pl[k].isDefault === 1) {
                  pl[k].isDefault === 0
                }
              }
              pl[j].isDefault = 1
            }
            this.$data.checked.push(pl[j])
            break
          }
        }
      }
    },
    addGroup: function () {
      let editGroup = this.$data.addTeaGroup
      let checkedTea = this.$data.checked
      let hasDef = false
      for (let i = 0; i < checkedTea.length; i++) {
        if (checkedTea[i].isDefault === 1) {
          hasDef = true
          break
        }
      }
      if (!hasDef) {
        window.alert('请至少勾选一种默认茶叶')
        return
      }
      if (editGroup === -1) { // 添加新的茶分组
        if (checkedTea.length > 0) { // 当前选中至少一个
          const qa = this.$data.quarter
          if (qa === 1) {
            let teaArr = []
            for (let i = 0; i < checkedTea.length; i++) {
              let teaObj = {}
              teaObj.id = checkedTea[i].id
              teaObj.quantity = checkedTea[i].quantity
              teaObj.isDefault = checkedTea[i].isDefault
              teaObj.teaCategoryName = checkedTea[i].teaCategoryName
              teaObj.starLevel = checkedTea[i].starLevel
              teaObj.weightText = checkedTea[i].weightText
              teaArr.push(teaObj)
            }
            this.$data.chioced1.push(teaArr)
          } else if (qa === 2) {
            let teaArr = []
            for (let i = 0; i < checkedTea.length; i++) {
              let teaObj = {}
              teaObj.id = checkedTea[i].id
              teaObj.quantity = checkedTea[i].quantity
              teaObj.isDefault = checkedTea[i].isDefault
              teaObj.teaCategoryName = checkedTea[i].teaCategoryName
              teaObj.starLevel = checkedTea[i].starLevel
              teaObj.weightText = checkedTea[i].weightText
              teaArr.push(teaObj)
            }
            this.$data.chioced2.push(teaArr)
          } else if (qa === 3) {
            let teaArr = []
            for (let i = 0; i < checkedTea.length; i++) {
              let teaObj = {}
              teaObj.id = checkedTea[i].id
              teaObj.quantity = checkedTea[i].quantity
              teaObj.isDefault = checkedTea[i].isDefault
              teaObj.teaCategoryName = checkedTea[i].teaCategoryName
              teaObj.starLevel = checkedTea[i].starLevel
              teaObj.weightText = checkedTea[i].weightText
              teaArr.push(teaObj)
            }
            this.$data.chioced3.push(teaArr)
          } else if (qa === 4) {
            let teaArr = []
            for (let i = 0; i < checkedTea.length; i++) {
              let teaObj = {}
              teaObj.id = checkedTea[i].id
              teaObj.quantity = checkedTea[i].quantity
              teaObj.isDefault = checkedTea[i].isDefault
              teaObj.teaCategoryName = checkedTea[i].teaCategoryName
              teaObj.starLevel = checkedTea[i].starLevel
              teaObj.weightText = checkedTea[i].weightText
              teaArr.push(teaObj)
            }
            this.$data.chioced4.push(teaArr)
          }
        }
      } else { // 修改已有分组
        if (checkedTea.length > 0) {
          const qa = this.$data.quarter
          if (qa === 1) {
            this.$data.chioced1[editGroup] = checkedTea
          } else if (qa === 2) {
            this.$data.chioced2[editGroup] = checkedTea
          } else if (qa === 3) {
            this.$data.chioced3[editGroup] = checkedTea
          } else if (qa === 4) {
            this.$data.chioced4[editGroup] = checkedTea
          }
        } else {
          const qua = this.$data.quarter
          if (qua === 1) {
            this.$data.chioced1.splice(editGroup, 1)
          } else if (qua === 2) {
            this.$data.chioced2.splice(editGroup, 1)
          } else if (qua === 3) {
            this.$data.chioced3.splice(editGroup, 1)
          } else if (qua === 4) {
            this.$data.chioced4.splice(editGroup, 1)
          }
        }
      }
      this.$data.addTeaGroup = -1
      this.$data.chioceTea = false
    },
    loginout: function () {
      this.$http.post('api/user/logout').then(function (res) {
        if (res.body.code === 0) {
          window.location.href = '/#/login'
        } else {
          window.alert(res.body.message)
        }
      })
    },
    uploadImgDes: function ($event) {
      const desPic = this
      var file = $event.target.value
      if (!/.(jpg|jpeg|png|GIF|JPG|png)$/.test(file)) {
        window.alert('图片类型必须是jpeg,jpg,png中的一种')
        return false
      }
      var getForms = document.getElementById('uploadImgDes')
      var reParamsdes = new window.FormData(getForms)
      var oReqs = new window.XMLHttpRequest()
      oReqs.open('POST', '/api/file/upload')
      oReqs.send(reParamsdes)
      oReqs.onreadystatechange = function () {
        if (oReqs.readyState === 4) {
          if (oReqs.status === 200) {
            const desObj = JSON.parse(oReqs.responseText)
            if (desObj.code === 0) {
              var imgArr = desObj.data.split(',')
              for (var i = 0; i < imgArr.length; i++) {
                if (imgArr[i].indexOf('http://') < 0) {
                  imgArr[i] = 'http://' + imgArr[i]
                }
              }
              const imgStr = imgArr.join(',')
              desPic.$data.desImgSrc += (',' + imgStr)
              desPic.$data.depictList = desPic.$data.depictList.concat(imgArr)
            } else {
              window.alert(desObj.message)
            }
          }
        }
      }
    },
    uploadImg: function ($event) {
      const _this = this
      var file = $event.target.value
      if (!/.(jpg|jpeg|png|GIF|JPG|png)$/.test(file)) {
        window.alert('图片类型必须是jpeg,jpg,png中的一种')
        return false
      }
      var getForm = document.getElementById('uploadImgCon')
      var reParams = new window.FormData(getForm)
      var oReq = new window.XMLHttpRequest()
      oReq.open('POST', '/api/file/upload')
      oReq.send(reParams)
      oReq.onreadystatechange = function () {
        if (oReq.readyState === 4) {
          if (oReq.status === 200) {
            const resObj = JSON.parse(oReq.responseText)
            if (resObj.code === 0) {
              _this.$data.imgSrc = resObj.data
              _this.$data.imgList.unshift(_this.$data.imgSrc)
            } else {
              window.alert(resObj.message)
            }
          }
        }
      }
    },
    checkedAll: function () {
      if (this.$data.fs) this.$data.checked = []
      else this.$data.checked = this.$data.proList
      this.$data.fs = !this.$data.fs
    },
    productSearch: function () {
      if (this.$data.starLevel !== '' && this.$data.category !== '') {
        this.$http.get('api/tea/list?name=' + this.$data.productName + '&teaCategoryId=' + this.$data.category + '&starLevel=' + this.$data.starlevel + '').then(function (res) {
          this.$data.proList = res.body.data.results
        })
      }
    }
  },
  watch: {
    dftTea: function (_val, _oldVal) {
      this.$data.proList[_val].isDefault = 1
      this.$data.proList[_oldVal].isDefault = 0
      let ck = this.$data.checked
      for (let i = 0; i < ck.length; i++) {
        if (ck[i].id === this.$data.proList[_val].id) return
      }
      this.$data.checked.push(this.$data.proList[_val])
    }
  },
  filters: {
    starToText: function (value) {
      if (value === 10) return '庄园直供'
      else {
        var starText = ['一星', '二星', '三星', '四星', '五星', '六星', '七星', '八星', '九星', '十星']
        return starText[value - 1]
      }
    }
  },
  computed: {
    chiocedObj: function () {
      var groups = []
      var data1 = this.$data.chioced1
      for (var i = 0; i < data1.length; i++) {
        var group = {}
        var teas = []
        for (var j = 0; j < data1[i].length; j++) {
          var tea = {}
          tea.teaId = data1[i][j].id
          tea.quantity = data1[i][j].quantity
          tea.isDefault = data1[i][j].isDefault
          teas.push(tea)
        }

        group.name = 'group' + i + 'spr'
        group.quarter = 1
        group.teas = teas
        groups.push(group)
      }
      var data2 = this.$data.chioced2
      for (var i2 = 0; i2 < data2.length; i2++) {
        var group2 = {}
        var teas2 = []
        for (var j2 = 0; j2 < data2[i2].length; j2++) {
          var tea2 = {}
          tea2.teaId = data2[i2][j2].id
          tea2.quantity = data2[i2][j2].quantity
          tea2.isDefault = data2[i2][j2].isDefault
          teas2.push(tea2)
        }

        group2.name = 'group' + i2 + 'sum'
        group2.quarter = 2
        group2.teas = teas2
        groups.push(group2)
      }
      var data3 = this.$data.chioced3
      for (var i3 = 0; i3 < data3.length; i3++) {
        var group3 = {}
        var teas3 = []
        for (var j3 = 0; j3 < data3[i3].length; j3++) {
          var tea3 = {}
          tea3.teaId = data3[i3][j3].id
          tea3.quantity = data3[i3][j3].quantity
          tea3.isDefault = data3[i3][j3].isDefault
          teas3.push(tea3)
        }

        group3.name = 'group' + i3 + 'aut'
        group3.quarter = 3
        group3.teas = teas3
        groups.push(group3)
      }
      var data4 = this.$data.chioced4
      for (var i4 = 0; i4 < data4.length; i4++) {
        var group4 = {}
        var teas4 = []
        for (var j4 = 0; j4 < data4[i4].length; j4++) {
          var tea4 = {}
          tea4.teaId = data4[i4][j4].id
          tea4.quantity = data4[i4][j4].quantity
          tea4.isDefault = data4[i4][j4].isDefault
          teas4.push(tea4)
        }

        group4.name = 'group' + i4 + 'win'
        group4.quarter = 4
        group4.teas = teas4
        groups.push(group4)
      }
      return groups
    }
  },
  data () {
    return {
      hShow: false,
      manorObj: {
        amounts: 0,
        size: 0
      },
      serialNumber: '',
      chioceTea: false,
      proList: [],
      checked: [],
      chioced1: [],
      chioced2: [],
      chioced3: [],
      chioced4: [],
      addTeaGroup: -1,
      dftTea: 0,
      name: '',
      depictList: [],
      imgList: [],
      sortNo: '',
      fs: false,
      checkedAll: [],
      productName: '',
      category: 0,
      categoryList: [],
      starlevel: 0,
      serial: '',
      chiocedObj: [],
      quarter: 1,
      manorname: '人人当地主'
    }
  }
}
</script>

<style scoped>
  #title {
    position: relative;
  }
  #title h2 {
    height: 60px;
    padding: 20px;
    border-bottom: 1px solid #d6d7d9;
    font-size: 16px;
  }
  .head-handle {
    position: absolute;
    top: 12px;
    right: 20px;
    width: 240px;
  }
  .member-handle {
    padding: 10px 0;
    position:relative;
    cursor:pointer;
  }
  .icon-member {
    margin-top: -8px;
    margin-right: 6px;
  }
  .btn-handle {
    display: inline-block;
    width: 9px;
    height: 6px;
    margin-top: -1px;
    margin-left: 6px;
    background: url("../assets/arrow-down.png") no-repeat;
    cursor: pointer;
  }
  .handle-con {
    width: 110px;
    height: 40px;
    margin-top: 15px;
    cursor:pointer;
    position:absolute;
    z-index:1;
    padding:10px 10px 10px 17px;
    border: 1px solid #eee;
    background: #fff;
  }
  .pro-input {
    padding: 10px 10px 30px;
  }
  .pro-input > li {
    overflow: hidden;
    margin-bottom: 20px;
  }
  .pro-input > li > div {
    float: left;
    width: 500px;
  }
  .pro-input > li .tea-value {
    width:100%;
    margin-bottom:20px;
  }
  .pro-input label {
    display: inline-block;
    float: left;
    width: 120px;
    line-height: 30px;
    margin-right: 10px;
    text-align: right;
  }
  .pro-input label span {
    color: #eb1f1c;
  }
  .pro-input input[type=text],
  .pro-input input[type=number],
  .pro-input input[type=date] {
    border: 1px solid #cdcdd0;
    height: 30px;
    padding: 0 5px;
    border-radius: 3px;
  }
  .pro-input input.large {
    width: 707px;
  }
  .pro-input input.middle {
    width: 270px;
  }
  .pro-input input.small {
    width: 145px;
  }
  .pro-input input.smaller {
    width: 50px;
    margin-left:10px;
  }
  .pro-input li > div.tea-group {
    width: 100%;
    margin-left: 130px;
    margin-top: 10px;
    float: none;
  }
  .chioced-tea {
    position: relative;
    width: 270px;
    height: 240px;
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 15px 0;
    border: 1px solid #e6e6e6;
    border-radius: 6px;
  }
  .chioced-tea .chioced-del2 {
    cursor: pointer;
    display: inline-block;
    width: 18px;
    height: 18px;
    position: absolute;
    top: -7px;
    right: -7px;
    background: url("../assets/icon-del.png") no-repeat;
  }
  .chioced-tea > ul {
    height: 194px;
    overflow-y: auto;
  }
  .chioced-tea > ul > li {
    padding:  5px 10px;
    position: relative;
  }
  .chioced-tea > ul > li span.chioced-del {
    position: absolute;
    top: 5px;
    right: 7px;
    display: none;
    width: 14px;
    height: 14px;
    background: url("../assets/icon-del2.png") no-repeat;
    cursor: pointer;
  }
  .chioced-tea > ul > li:hover {
    background-color: #f0f0f0;
  }
  .chioced-tea > ul > li:hover span.chioced-del {
    display: inline-block;
  }
  .pro-input input[type=text].tea-quantity {
    float: right;
    width: 33px;
    height: 16px;
    margin-right: 19px;
    text-align: center;
    border: none;
  }
  .pro-input input[type=text].tea-quantity:focus {
    border: 1px solid #e6e6e6;
  }
  .chioced-tea .chioced-text {
    position: absolute;
    bottom: 0;
    left: 10px;
    width: calc(100% - 20px);
    padding: 5px 0;
    border-top: 1px solid #e6e6e6;
    color: #9b9b9b;
    font-size: 12px;
  }
  .chioced-change {
    display: inline-block;
    width: 18px;
    height: 18px;
    float: right;
    margin-right: 5px;
    background: url("../assets/icon-add.png") no-repeat;
    cursor: pointer;
  }
  .btn-group {
    width: 270px;
    height: 240px;
  }
  .btn-share {
    text-align: center;
  }
  .btn-share button {
    width: 132px;
    height: 40px;
    background-color: #476d8f;
    color: #fff;
    margin:0 50px;
    font-weight: bold;
  }
  .manor-detail {
    width: 763px;
    height: 300px;
    padding: 8px;
  }

  /*弹窗样式*/
  .check-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
  }
  .modal-inner {
    position: absolute;
    width: 680px;
    height: 600px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background-color: #fff;
  }
  .modal-tit {
    height: 45px;
    line-height: 45px;
    padding-left: 20px;
    border-bottom: 1px solid #d7d7d7;
    font-weight: bold;
  }
  .btn-close {
    display: inline-block;
    width: 12px;
    height: 12px;
    position: absolute;
    top: 15px;
    right: 15px;
    background: url("../assets/icon-close.png") no-repeat;
    cursor: pointer;
  }
  .btn-close:hover {
    background: url("../assets/icon-close1.png") no-repeat;
  }
  .modal-header {
    overflow: hidden;
  }
  .filter-check {
    margin-left: 30px;
  }
  .check-all {
    line-height: 45px;
  }
  .filter-type {
    margin-top: 11px;
    margin-right: 15px;
  }
  .filter-star {
    margin-top: 11px;
    margin-right: 15px;
  }
  .modal-search {
    position: relative;
    margin-top: 9px;
    margin-right: 20px;
  }
  .modal-search span {
    display: inline-block;
    width: 14px;
    height: 12px;
    position: absolute;
    top: 8px;
    right: 8px;
    background: url("../assets/icon-search.png") no-repeat;
    cursor: pointer;
  }
  .modal-search input {
    height: 28px;
    padding: 0 8px;
    border: 1px solid #ccc;
  }
  .modal-body {
    height: 430px;
    overflow-y: auto;
    border-bottom: 1px solid #e6e6e6;
  }
  .tea-list {
    margin: 0 20px;
    border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }
  .tea-list li {
    position: relative;
    height: 90px;
    overflow: hidden;
    padding: 10px 0;
    border-bottom: 1px solid #e6e6e6;
  }
  .tea-list li:last-child {
    border-bottom: none;
  }
  .set-default {
    position: absolute;
    top: 10px;
    left: 11px;
  }
  .item-check {
    margin: 0 10px;
    line-height: 72px;
  }
  .item-no {
    width: 94px;
    margin-right: 25px;
    margin-top: 27px;
  }
  .item-img {
    margin-right: 10px;
  }
  .tea-info .tea-tit {
    margin-bottom: 10px;
  }
  .tea-info .tea-price {
    margin-bottom: 10px;
    color: #d0021b;
  }
  .tea-info .tea-stock {
    font-size: 12px;
    color: #9b9b9b;
  }
  .modal-footer {
    padding: 0 20px;
    margin-top: 15px;
  }
  .btn-cal {
    width: 100px;
    height: 40px;
    border: 1px solid #e6e6e6;
    outline: none;
    cursor: pointer;
  }
  .tea-checked {
    margin-top: 10px;
    margin-right: 15px;
  }
  .btn-submit {
    width: 100px;
    height: 40px;
    background-color: #476d8f;
    color: #fff;
    outline: none;
    cursor: pointer;
  }
  .btn-upload {
    margin-left: 130px;
  }
  .btn-upload .del-cont {
    position:relative;
  }
  .btn-upload .del-cont span {
    position:absolute;
    right:5px;
    top:5px;
    cursor:pointer;
  }
  .des-upload {
    margin:0;
  }
  .btn-upload li {
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .btn-upload li label {
    float: none;
    text-align: left;
  }
  .upload-text {
    padding-top: 42px;
    margin-left: 280px;
    color: #9b9b9b;
  }
  .upload-prompt {
    margin-left: 130px;
    color: #9b9b9b;
  }
  .des-prompt {
    clear:both;
  }
  .manor-path span {
    line-height:45px;
    color:#9b9b9b;
  }
  a.router-link-active {
    color:#476d8f;
    padding-left:20px;
  }
</style>
