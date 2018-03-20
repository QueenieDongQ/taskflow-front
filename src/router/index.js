import Vue from 'vue'
import Router from 'vue-router'
import Userinfo from '@/components/User/Userinfo'

import Board from '@/components/Kanban/Board'
import AdminUser from '@/components/Admin/AdminUser'

import myTask from '@/components/Task/myTask'
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
      path: '/projects',
      name: 'projects',
      component: AllProjects,
      // children:[
      //   {
      //     path:'projects/:id',
      //     name:'myTask',
      //     component:myTask,
      //     props: { assets:" "}
      //   }
      // ]
    },
    {
      path:'/projects/:id',
      name:'myTask',
      component:myTask,
    },
    {
      path: '/TreeList',
      name: 'TreeList',
      component: TreeList
    },

  ]
})
