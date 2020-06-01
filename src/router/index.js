import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import register from '@/pages/register'
import main from '@/pages/main'
import contact from '@/pages/contact'
import socket from '@/pages/socket_demo'
import setting from '@/pages/setting'
import store from "../store";
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: "/",
      redirect() {
        return "/login";
      }
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/register",
      name: "register",
      component: register
    },
	  {
	  	path: "/main",
		  name: "main",
      component: main,
      meta:{
        requireAuth:true
      }
	  },
    {
      path: "/contact",
      name: "contact",
      component: contact,
      meta:{
        requireAuth:true
      }
    },
    {
      path: "/setting",
      name: "setting",
      component: setting,
      meta:{
        requireAuth:true
      }
    },
    {
      path: "/socket",
      name: "socket",
      component: socket
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    console.log(store.state);
    if (localStorage.getItem("user") != undefined) {
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});

export default router;