import Vue from "vue";
import Router from "vue-router";
import store from "../store";
Vue.use(Router);

const route = new Router({
  routes: [
    {
      path: "/",
      component: () => import("../components/layout"),
      meta: { selected: "/" },
      children: [
        //系统设置
        // 菜单管理
        {
          path: "home",
          component: () => import("../components/home"),
          meta: { selected: "/home" }
        },
        {
          path: "menu",
          component: () => import("../components/setting/menu"),
          meta: { selected: "/menu" }
        },
        {
          path: "menu/add",
          component: () => import("../components/setting/menu/info"),
          meta: { selected: "/menu" }
        },
        {
          path: "menu/:id",
          component: () => import("../components/setting/menu/info"),
          meta: { selected: "/menu" }
        },
        // 角色管理
        {
          path: "role",
          component: () => import("../components/setting/role"),
          meta: { selected: "/role" }
        },
        {
          path: "role/add",
          component: () => import("../components/setting/role/info"),
          meta: { selected: "/role" }
        },
        {
          path: "role/:id",
          component: () => import("../components/setting/role/info"),
          meta: { selected: "/role" }
        },
        // 管理员管理
        {
          path: "user",
          component: () => import("../components/setting/user"),
          meta: { selected: "/user" }
        },
        {
          path: "user/add",
          component: () => import("../components/setting/user/info"),
          meta: { selected: "/user" }
        },
        {
          path: "user/:id",
          component: () => import("../components/setting/user/info"),
          meta: { selected: "/user" }
        },
        // 商城管理
        // 商品分类
        {
          path: "category",
          component: () => import("../components/goods/category"),
          meta: { selected: "/category" }
        },
        {
          path: "category/add",
          component: () => import("../components/goods/category/info"),
          meta: { selected: "/category" }
        },
        {
          path: "category/:id",
          component: () => import("../components/goods/category/info"),
          meta: { selected: "/category" }
        },
        // 商品规格
        {
          path: "specs",
          component: () => import("../components/goods/specs"),
          meta: { selected: "/specs" }
        },
        {
          path: "specs/add",
          component: () => import("../components/goods/specs/info"),
          meta: { selected: "/specs" }
        },
        {
          path: "specs/:id",
          component: () => import("../components/goods/specs/info"),
          meta: { selected: "/specs" }
        },
        // 商品管理
        {
          path: "goods",
          component: () => import("../components/goods/wares"),
          meta: { selected: "/goods" }
        },
        {
          path: "goods/add",
          component: () => import("../components/goods/wares/info"),
          meta: { selected: "/goods" }
        },
        {
          path: "goods/:id",
          component: () => import("../components/goods/wares/info"),
          meta: { selected: "/goods" }
        },
        // banner
        {
          path: "banner",
          component: () => import("../components/goods/banner"),
          meta: { selected: "/banner" }
        },
        {
          path: "banner/add",
          component: () => import("../components/goods/banner/info"),
          meta: { selected: "/banner" }
        },
        {
          path: "banner/:id",
          component: () => import("../components/goods/banner/info"),
          meta: { selected: "/banner" }
        },
        // 限时秒杀
        {
          path: "seck",
          component: () => import("../components/goods/seck"),
          meta: { selected: "/seck" }
        },
        {
          path: "seck/add",
          component: () => import("../components/goods/seck/info"),
          meta: { selected: "/seck" }
        },
        {
          path: "seck/:id",
          component: () => import("../components/goods/seck/info"),
          meta: { selected: "/seck" }
        },
        { path: "", redirect: "/menu" }
      ]
    },
    { path: "/login", component: () => import("../components/login") },
    { path: "*", redirect: "/home" }
  ]
});

// 路由守卫
route.beforeEach((to, from, next) => {
  var info = store.state.userinfo;
  // console.log(info);
  if (info) {
    var token = info["token"] ? info["token"] : "";
    // console.log(token);
    if (token == "") {
      //未登录
      if (to.path == "/login") {
        next();
      } else {
        next("/login");
      }
    } else {
      //已登录
      if (to.path == "/login") {
        next("/home");
      } else {
        // 判断当前访问的路由规则是不是在已分配的路由规则中
        var nowpath = "/" + to.path.split("/")[1];
        var allowpath = info.menus_url;
        allowpath.unshift("/"); //把没有纳入到权限管理的路由规则，进行追加
        allowpath.unshift("/home");
        if (allowpath.indexOf(nowpath) >= 0) {
          next();
        } else {
          // console.log("权限受限");
          next("/home");
        }
        // next();
      }
    }
  } else {
    next();
  }
});
export default route;
