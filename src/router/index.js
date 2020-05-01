import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import register from '@/pages/register'
import main from '@/pages/main'
import contact from '@/pages/contact'
import setting from "../pages/setting";

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
    }
  ]
});
