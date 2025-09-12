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
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login'),
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./views/Register'),
    meta: { public: true }
  },
  {
    path: '/topup',
    name: 'topUp',
    // component: HomeView
    component: () => import('./views/TopUp')
  },
  {
    path: '/pembayaran/:id/:name',
    name: 'pembayaran',
    // component: HomeView
    component: () => import('./views/Pembayaran'),
    props: true
  },

  {
    path: '/transaction',
    name: 'transaction',
    // component: HomeView
    component: () => import('./views/Transaction'),
  },

  {
    path: '/profile',
    name: 'profile',
    // component: HomeView
    component: () => import('./views/Profile'),
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
