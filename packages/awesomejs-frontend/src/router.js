import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/project-type/:projectTypeSlug',
      name: 'project-type',
      component: () => import(/* webpackChunkName: "project-type" */ './components/ProjectType.vue'),
      props: true,
    },
  ],
})
