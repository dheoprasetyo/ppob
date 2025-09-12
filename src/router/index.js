import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('./views/Dashboard')
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
    component: () => import('./views/TopUp')
  },
  {
    path: '/pembayaran/:id/:name',
    name: 'pembayaran',
    component: () => import('./views/Pembayaran'),
    props: true
  },

  {
    path: '/transaction',
    name: 'transaction',
    component: () => import('./views/Transaction'),
  },

  {
    path: '/profile',
    name: 'profile',
    component: () => import('./views/Profile'),
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const authed = !!localStorage.getItem('token')
  if (!to.meta.public && !authed) return next('/login')
  if (to.path === '/login' && authed) return next('/')
  next()
})


export default router
