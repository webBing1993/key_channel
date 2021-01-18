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
          path: '/keyChannel/home',
          name: 'home',
          component: resolve => require(['../components/keyChannel/home.vue'],resolve),
        },
        {
          path: '/homeMasterIndex',
          name: 'homeMasterIndex',
          component: resolve => require(['../components/keyChannel/homeMasterIndex.vue'],resolve),
        },
        {
          path: '/homeMaster',
          name: 'homeMaster',
          component: resolve => require(['../components/keyChannel/homeMaster.vue'],resolve),
        },
        {
          path: '/whiteList',
          component: resolve => require(['../components/keyChannel/whiteList.vue'],resolve),
        },
        {
          path: '/whiteListMaster',
          component: resolve => require(['../components/keyChannel/whiteListMaster.vue'],resolve),
        },
        {
          path: '/blackList',
          component: resolve => require(['../components/keyChannel/blackList.vue'],resolve),
        },
        {
          path: '/hotelStatus',
          component: resolve => require(['../components/keyChannel/hotelStatus.vue'],resolve),
        },
        {
          path: '/operationLog',
          component: resolve => require(['../components/keyChannel/operationLog.vue'],resolve),
        }
      ]
    },
    {
      path: '/statistics',
      name: '/statistics',
      component: resolve => require(['../components/keyChannel/statistics.vue'],resolve),
    },
    {
      path: '/statisticsMaster',
      name: '/statisticsMaster',
      component: resolve => require(['../components/keyChannel/statisticsMaster.vue'],resolve),
    },
    {
      path: '/passwordUpdate',
      name: '/passwordUpdate',
      component: resolve => require(['../components/keyChannel/passwordUpdate.vue'],resolve),
    }
  ]
})
