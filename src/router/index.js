import Vue from 'vue'
import Router from 'vue-router'
import Userinfo from '@/components/User/Userinfo'
import Project_All from '@/components/Projects/Project_All'
// import Kanban from './components/Kanban/Kanban'
// import Board from '@/components/Kanban/Board'
import AdminUser from '@/components/Admin/AdminUser'

import TreeDemo from '@/components/Task/TreeDemo'
import LeafDetails from '@/components/Task/LeafDetails'
import RootDetails from '@/components/Task/RootDetails'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Userinfo',
      component: Userinfo
    },
    {
      path: '/projects',
      name: 'projects',
      component: Project_All,
      // children:{
      //   path:'/:id',
      //   name:'gates',
      //
      // }
    },
    // {
    //   path: '/boards',
    //   name: 'boards',
    //   component: Board
    // },
    {
      path: '/admin',
      name: 'admin',
      component: AdminUser
    },
    {
      path: '/TreeDemo',
      name: 'TreeDemo',
      component: TreeDemo
    },
    {
      path: '/LeafDetails',
      name: 'LeafDetails',
      component: LeafDetails
    },
    {
      path: '/RootDetails',
      name: 'RootDetails',
      component: RootDetails
    },
    // {
    //
    // },
    // {
    //   path: '/kanban',
    //   name: 'kanban',
    //   component: Kanban
    // },
    // {
    //   path: '/project_all',
    //   name: 'project_all',
    //   component: Project_All
    // },
    // {
    //   path: '/board',
    //   name: 'board',
    //   component: Board
    // }
  ]
})
