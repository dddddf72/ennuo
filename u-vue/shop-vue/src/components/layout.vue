<template>
  <div class="box">
    <el-container>
      <el-header>
        <span class="fl">管理系统</span> 
        <span class="fr">
          欢迎：{{userinfo?userinfo.username:''}}
          <el-button type='text' @click="logout">退出</el-button>
        </span>
      </el-header>
      <el-container class="content">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu
            :default-active="defaultActive"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            unique-opened
            :default-openeds="arr"
          >
            <el-menu-item index="/home">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
                <el-menu-item :index="child.url" v-for="child in item.children"
                :key="child.id">{{child.title}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
  mounted() {
    // this.axios({
    //   url: "/api/menulist",
    //   params: {
    //     istree: 1,
    //   },
    // }).then((res) => {
    //   console.log(res.data.list);
    //   this.menulist = res.data.list;
    // });
    // console.log(this.menulist);
    // 本地存储方式
    // var userinfo = localStorage.getItem("userinfo");
    // this.menulist = JSON.parse(userinfo).menus;

    // vuex方式
    this.menulist = this.$store.state.userinfo.menus
    this.defaultActive = this.$route.meta.selected;
  },
  computed: {
    ...mapState(['userinfo'])
  },
  data() {
    return {
      defaultActive: "",
      menulist: [],
      arr:[],//当前在哪个路由
    };
  },
  watch: {
    $route(val) {
      this.defaultActive = val.meta.selected;
      if(val.meta.selected == '/'){
        this.arr = [];
      }else{
      this.arr[0] = val.meta.selected
      }
      // console.log(this.arr[0]);
    },
  },
  methods: {
    ...mapMutations(['setUserInfo']),
    logout(){
      this.setUserInfo(null);
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped lang="stylus">
.box
  width: 100%
  height: 100%
  display: flex
.el-header
  height: 60px
  line-height: 60px
  background-color: #f60
  color: #fff
.content
  flex: 1
  display: flex
  .el-main
    flex: 1
    padding: 0
    padding: 0 20px
.el-menu
  height: 100%
  border: none
  background-color: rgb(238, 241, 246)
.fl
  float left
.fr
  float right
</style>