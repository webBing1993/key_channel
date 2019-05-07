import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/index'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: HelloWorld
    },
    {
      path: '/keyChannel',
      name: 'keyChannel',
      component: resolve => require(['../components/keyChannel/index.vue'],resolve),
      children: [
        {
          path: '/keyChannel',
          component: resolve => require(['../components/keyChannel/homeIndex.vue'],resolve),
        },
        {
          path: '/statistics',
          component: resolve => require(['../components/keyChannel/statistics.vue'],resolve),
        },
        {
          path: '/whiteList',
          component: resolve => require(['../components/keyChannel/whiteList.vue'],resolve),
        }
      ]
    }
  ]
})
