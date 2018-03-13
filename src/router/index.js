import Vue from 'vue'
import Router from 'vue-router'
import Userinfo from '@/components/User/Userinfo'

import Board from '@/components/Kanban/Board'
import AdminUser from '@/components/Admin/AdminUser'

import LeafDetails from '@/components/Task/LeafDetails'
import AllProjects from '@/components/Task/AllProjects'
import TreeList from '@/components/Task/TreeList'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Userinfo',
      component: Userinfo
    },
    {
      path: '/board',
      name: 'board',
      component: Board,

    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminUser
    },

    {
      path: '/LeafDetails',
      name: 'LeafDetails',
      component: LeafDetails
    },
    {
      path: '/AllProjects',
      name: 'AllProjects',
      component: AllProjects,
      children:[
        {
          path:'/:uid',
          name:'singleProject'

        }
      ]
    },
    {
      path: '/TreeList',
      name: 'TreeList',
      component: TreeList
    },

  ]
})
