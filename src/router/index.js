import Vue from 'vue'
import Router from 'vue-router'
import Global from '../tool/Global'

Vue.use(Router);

const router = new Router({
  routes: [
    // 首页
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/home.vue'),
    },
    // 错误的页都会进入到这里
    // {
    //   path: '*',
    //   name: '',
    //   component: () => import('@/components/Err404.vue')
    // },
    {
      path: `/login/${Global.safety}`,
      name: 'login',
      component: () => import('@/pages/login/login.vue'),
    },
    // 分享页面
    {
      path: '/SharePage',
      name: 'SharePage',
      component: () => import('@/pages/SharePage/SharePage.vue'),
    },
    // 注册页面
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/register/register.vue'),
    },
    // 重置密码
    {
      path: '/ResetPassword',
      name: 'ResetPassword',
      component: () => import('@/pages/ResetPassword/ResetPassword.vue'),
    },
    // 视频详情页
    {
      path: '/VideoDetails',
      name: 'VideoDetails',
      component: () => import('@/pages/VideoDetails/VideoDetails.vue'),
    },
  ],
});

export default router;
