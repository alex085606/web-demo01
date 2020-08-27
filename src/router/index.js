import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: 'login' */'../components/Login.vue')
const Index = () => import(/* webpackChunkName: 'index' */'../components/Index.vue')
const Users = () => import(/* webpackChunkName: 'users' */'../components/users/Users.vue')
const Rights = () => import(/* webpackChunkName: 'rights' */'../components/rights/Rights.vue')
const Roles = () => import(/* webpackChunkName: 'rights' */'../components/rights/Roles.vue')
const Categories = () => import(/* webpackChunkName: 'products' */'../components/products/Categories.vue')
const Goods = () => import(/* webpackChunkName: 'products' */'../components/products/Goods.vue')
const GoodsAdd = () => import(/* webpackChunkName: 'products' */'../components/products/Goods-Add.vue')
Vue.use(VueRouter)

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login },
  {
    path: '/index',
    component: Index,
    children: [
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/goods', component: Goods },
      { path: '/goods-add', component: GoodsAdd }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})

export default router
