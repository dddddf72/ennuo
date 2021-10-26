<template>
  <div class="login">
    <div class="box">
      <h1>登 录</h1>
      <el-form
        :model="info"
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="info.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" show-password prop="password">
          <el-input v-model="info.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // this.axios.post('/api/userlogin', this.info).then((res) => {
          //   if (res.data.code != 200) {
          //     alert(res.data.msg);
          //   } else {
          //     localStorage.setItem("userinfo",JSON.stringify(res.data.list));//本地存储方式
          //     this.$router.push("/");
          //   }
          // });
          this.$store.dispatch("loginSync",this.info).then(res=>{
            // console.log(res);
              if (res.data.code != 200) {
              alert(res.data.msg);
            } else {
              // localStorage.setItem("userinfo",JSON.stringify(res.data.list));//本地存储方式
              // this.$store.commit("setUserInfo",res.data.list);
              this.$router.push("/");
            }
          })

        }
      });
  },}
};
</script>

<style scoped lang="stylus">
.login
  width: 100%
  height: 100%
  background-color: #2b4b6b
// text-align: center
.box
  width: 500px
  height: 300px
  background-color: #fff
  position: fixed
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  border-radius: 5px
h1
  margin-top: 30px
  text-align: center
.el-input, .el-button
  width: 300px
</style>