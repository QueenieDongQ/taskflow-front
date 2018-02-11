import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/User/Login'
import Project_All from '@/components/Projects/Project_All'
import Kanban from '@/components/Kanban/Kanban'
import Board from '@/components/Kanban/Board'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/kanban',
      name: 'kanban',
      component: Kanban
    },
    {
      path: '/project_all',
      name: 'project_all',
      component: Project_All
    },
    {
      path: '/board',
      name: 'board',
      component: Board
    }
  ]
})
