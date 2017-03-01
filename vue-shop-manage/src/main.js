import Vue from 'vue'
import Router from 'vue-router'
import Swiper from 'vue-awesome-swiper'
import Resource from 'vue-resource'
import RegionPicker from 'vue-region-picker'
import CHINA_REGION from 'china-area-data'

import Index from './Index'
import Shop from './components/Shop'
import ShopDetail from './components/ShopDetail'
import ShopOrder from './components/ShopOrder'
import ManorOrder from './components/ManorOrder'
import Login from './Login'
import Member from './components/Member'
import TeaManor from './components/TeaManor'
import Product from './components/Product'
import Manor from './components/Manor'
import MemberDetail from './components/MemberDetail'
import TeamanorDetail from './components/TeamanorDetail'
import ShopOrderDetail from './components/ShopOrderDetail'
import MemberEdit from './components/MemberEdit'
import ManorOrderDetail from './components/ManorOrderDetail'
import ReleaseSuccess from './components/ReleaseSuccess'
import ShopEdit from './components/ShopEdit'
import ManorEdit from './components/ManorEdit'

Vue.use(Router)
Vue.use(Swiper)
Vue.use(Resource)
// Vue.use(VueTimepicker)
Vue.use(RegionPicker, {
  region: CHINA_REGION,
  vueVersion: 2
})
Vue.http.options.emulateHTTP = true
Vue.http.options.emulateJSON = true
Vue.http.headers.common['clientType'] = 'WX'

const routes = [
  {path: '/', redirect: '/index/shop'},
  {path: '/login', component: Login},
  {
    path: '/index',
    component: Index,
    children: [
      {path: 'shop', component: Shop},
      {path: 'success', component: ReleaseSuccess},
      {path: 'shop/shopdetail/:id/:status', component: ShopDetail},
      {path: 'shop/shopedit/:id', component: ShopEdit},
      {path: 'shop/product', component: Product},
      {path: 'sorder', component: ShopOrder},
      {path: 'morder', component: ManorOrder},
      {path: 'morder/manororderdetail/:id/:no', component: ManorOrderDetail},
      {path: 'member', component: Member},
      {path: 'teamanor', component: TeaManor},
      {path: 'teamanor/manor', component: Manor},
      {path: 'member/memberdetail/:id', component: MemberDetail},
      {path: 'member/memberdetail/memberedit/:Id/:name/:level/:status', component: MemberEdit},
      {path: 'teamanor/teamanordetail/:id/:status', component: TeamanorDetail},
      {path: 'teamanor/manoredit/:id', component: ManorEdit},
      {path: 'sorder/shoporderdetail/:id/:no', component: ShopOrderDetail}
    ]
  }
]

/* routing */
const router = new Router({
  routes
})
new Vue({
  router: router
}).$mount('#app')
