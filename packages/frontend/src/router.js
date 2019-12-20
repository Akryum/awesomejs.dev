import Vue from 'vue'
import Router from 'vue-router'
import AppHome from './components/app/AppHome.vue'
import { scrollBehavior } from './util/scroll-behavior'

Vue.use(Router)

const packageRoute = (namePrefix = '') => ({
  path: 'pkg/:packageId',
  component: () => import(/* webpackChunkName: "package-view" */ './components/pkg/PackageView.vue'),
  props: route => ({
    ...route.params,
    routePrefix: namePrefix,
  }),
  meta: {
    keepScroll: true,
  },
  children: [
    {
      path: '',
      name: `${namePrefix}package`,
      component: () => import(/* webpackChunkName: "package-tab-general" */ './components/pkg/PackageTabGeneral.vue'),
    },
    {
      path: 'edit',
      name: `${namePrefix}package-edit`,
      component: () => import(/* webpackChunkName: "package-tab-edit" */ './components/pkg/PackageTabEdit.vue'),
    },
    {
      path: 'data-sources',
      name: `${namePrefix}package-data-sources`,
      component: () => import(/* webpackChunkName: "package-tab-data-sources" */ './components/pkg/PackageTabDataSources.vue'),
    },
    {
      path: 'releases',
      name: `${namePrefix}package-releases`,
      component: () => import(/* webpackChunkName: "package-tab-releases" */ './components/pkg/PackageTabReleases.vue'),
    },
  ],
})

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior,
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppHome,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './components/user/LoginView.vue'),
    },
    {
      path: '/me',
      component: () => import(/* webpackChunkName: "user-dashboard" */ './components/user/UserDashboard.vue'),
      children: [
        {
          path: '',
          name: 'user-dashboard',
          component: () => import(/* webpackChunkName: "user-tab-home" */ './components/user/UserTabHome.vue'),
          meta: {
            depthWeight: 2,
          },
        },
        {
          path: 'bookmarks',
          component: () => import(/* webpackChunkName: "user-tab-bookmarks" */ './components/user/UserTabBookmarks.vue'),
          props: true,
          children: [
            {
              path: '',
              name: 'user-bookmarks',
              component: () => import(/* webpackChunkName: "no-package-bookmar-selected" */ './components/user/NoBookmarkPackageSelected.vue'),
            },
            packageRoute('user-bookmarks-'),
          ],
        },
      ],
    },
    {
      path: '/for/:projectTypeSlug',
      component: () => import(/* webpackChunkName: "project-type" */ './components/project-type/ProjectTypeView.vue'),
      props: true,
      children: [
        {
          path: '',
          name: 'project-type',
          component: () => import(/* webpackChunkName: "no-package-selected" */ './components/pkg/NoPackageSelected.vue'),
        },
        packageRoute(),
      ],
    },
    {
      path: '/proposed/:projectTypeSlug',
      component: () => import(/* webpackChunkName: "project-type-package-proposals" */ './components/project-type/ProjectTypePackageProposalsView.vue'),
      props: true,
      meta: {
        depthWeight: 2,
      },
      children: [
        {
          path: '',
          name: 'project-type-proposals',
          component: () => import(/* webpackChunkName: "no-package-selected" */ './components/pkg/NoPackageSelected.vue'),
        },
        {
          path: 'pkg/:packageId',
          component: () => import(/* webpackChunkName: "package-proposal-view" */ './components/pkg/PackageProposalView.vue'),
          props: true,
          meta: {
            keepScroll: true,
          },
          children: [
            {
              path: '',
              name: `package-proposal`,
              component: () => import(/* webpackChunkName: "package-proposal-tab-general" */ './components/pkg/PackageProposalTabGeneral.vue'),
            },
            {
              path: 'edit',
              name: `package-proposal-edit`,
              component: () => import(/* webpackChunkName: "package-proposal-tab-edit" */ './components/pkg/PackageProposalTabEdit.vue'),
            },
            {
              path: 'data-sources',
              name: `package-proposal-data-sources`,
              component: () => import(/* webpackChunkName: "package-tab-data-sources" */ './components/pkg/PackageTabDataSources.vue'),
            },
            {
              path: 'releases',
              name: `package-proposal-releases`,
              component: () => import(/* webpackChunkName: "package-tab-releases" */ './components/pkg/PackageTabReleases.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/pkg/add',
      name: 'add-package',
      component: () => import(/* webpackChunkName: "package-add-wizard" */ './components/pkg/PackageAddWizard.vue'),
    },
    {
      path: '/about/privacy',
      name: 'about-privacy',
      component: () => import(/* webpackChunkName: "about-privacy" */ './components/about/Privacy.vue'),
    },
  ],
})
