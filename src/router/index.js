import Vue from 'vue'
import Router from 'vue-router'
import Userinfo from '@/components/User/Userinfo'
import Project_All from '@/components/Projects/Project_All'
// import Kanban from './components/Kanban/Kanban'
// import Board from '@/components/Kanban/Board'
import AdminUser from '@/components/Admin/AdminUser'

import LeafDetails from '@/components/Task/LeafDetails'
import RootDetails from '@/components/Task/RootDetails'
import ShowAllTasks from '@/components/Task/ShowAllTasks'
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
      path: '/projects',
      name: 'projects',
      component: Project_All,
      // children:{
      //   path:'/:id',
      //   name:'gates',
      //
      // }
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
      path: '/RootDetails',
      name: 'RootDetails',
      component: RootDetails
    },
    {
      path: '/ShowAllTasks',
      name: 'ShowAllTasks',
      component: ShowAllTasks
    },
    {
      path: '/TreeList',
      name: 'TreeList',
      component: TreeList
    },

  ]
})
