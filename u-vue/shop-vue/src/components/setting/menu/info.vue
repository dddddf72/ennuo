<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/menu' }">菜单管理</el-breadcrumb-item>
      <el-breadcrumb-item
        >菜单{{usr}}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="上级菜单" prop="pid">
        <el-select v-model="form.pid" placeholde="请选择">
          <el-option :value="0" label="顶级菜单"></el-option>
          <el-option
            :value="item.id"
            :label="item.title"
            v-for="item in menuArr"
            :key="item.id"
          ></el-option>
          <!-- <el-option :value='5' label="商城管理"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="form.title" placeholde="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图标" v-if="form.type == 1">
        <el-input v-model="form.icon" placeholde="请输入菜单图标"></el-input>
      </el-form-item>
      <el-form-item label="地址" v-else>
        <el-input v-model="form.url" placeholde="请输入菜单地址"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
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
    // 下拉框选择项
    this.axios.get("/api/menulist?istree=1").then((res) => {
      this.menuArr = res.data.list;
      // console.log(res.data.list);
    });
    if (this.$route.params.id) {
      this.usr = "修改";
      this.axios({
        url: "/api/menuinfo",
        method: "get",
        params: {
          id: this.$route.params.id,
        },
      }).then((res) => {
        // console.log(res.data);
        this.form = res.data.list;
        this.form.id = this.$route.params.id;
      });
    }
  },
  data() {
    return {
      usr:"添加",
      form: {
        pid: "",
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      },
      menuArr: [],
      rules: {
        pid: [{ required: true, message: "请选择菜单级别", trigger: "change" }],
        title: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
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
          var url = "/api/menuadd";
          if (this.$route.params.id) {
            url = "/api/menuedit";
          }
          this.axios.post(url, this.form).then((res) => {
            if (res.data.code != 200) {
              alert(res.data.msg);
            } else {
              this.$router.push("/menu");
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus">
.el-input {
  width: 400px;
}
</style>