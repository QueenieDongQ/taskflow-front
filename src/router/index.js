import Vue from 'vue'
import Router from 'vue-router'
import Userinfo from '@/components/User/Userinfo'

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
      //   }
      // ]
    },
    {
      path:'/projects/:projectId',
      name:'myTask',
      component:myTask,
      props: true
    },
    {
      path: '/TreeList',
      name: 'TreeList',
      component: TreeList
    },

  ]
})
