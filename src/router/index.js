import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import register from '@/pages/register'
import welcome from '@/pages/welcome'

Vue.use(Router)

export default new Router({
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
      path: "/welcome",
      name: "welcome",
      component: welcome
    }
  ]
});
