<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">管理员列表</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表{{usr}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属角色" prop="roleid">
        <el-select v-model="form.roleid" placeholde="请选择">
          <el-option v-for="item in uesrList" :key="item.id" :value='item.id' :label="item.rolename">{{item.rolename}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholde="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" placeholde="请输入密码" show-password></el-input>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item label="状态">
        <el-tooltip :content="'Switch value: ' + form.status" placement="top" >
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2" 
          >
          </el-switch>
        </el-tooltip>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  mounted() {
    // 管理员列表
    this.axios.get("/api/rolelist").then(res=>{
      // console.log(res.data);
      this.uesrList = res.data.list
      // console.log(res.data.list);
    })
    // 获取管理员信息
    if (this.$route.params.id) {
      this.usr = "修改";
      this.axios({
        url: "/api/userinfo",
        method: "get",
        params: {
          uid: this.$route.params.id,
        },
      }).then((res) => {
        // console.log(res);
        this.form = res.data.list;
        this.form.uid = this.$route.params.id;
        this.form.password = '';
      });
    }
  },
  data() {
    return {
      usr:"添加",
      uesrList:[],
      form: {
        roleid:"",
        username: "",
        password: "",
        status: "1",
      },
      rules: {
          roleid: [
            { required: true, message: '请选择角色', trigger: 'change' },
          ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "标题长度在2-20个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          var url = "/api/useradd";
          if (this.$route.params.id) {
            url = "/api/useredit";
          }
          this.axios.post(url, this.form).then((res) => {
            if (res.data.code != 200) {
              alert(res.data.msg);
            } else {
              this.$router.push("/user");
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus">
.el-input{
  width: 400px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

</style>