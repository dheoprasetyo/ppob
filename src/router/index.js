import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    // component: HomeView
    component: () => import('./views/Dashboard')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login'),
    meta: { public: true }
    },
]

const router = new VueRouter({
  routes
})

// simple auth guard
router.beforeEach((to, from, next) => {
  const authed = !!localStorage.getItem('token')
  if (!to.meta.public && !authed) return next('/login')
  if (to.path === '/login' && authed) return next('/')
  next()
})


export default router
