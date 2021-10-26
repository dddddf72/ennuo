<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/specs' }"
        >商品规格管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品规格添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="规格名称" prop="specsname">
        <el-input
          v-model="form.specsname"
          placeholde="请输入规格名称"
        ></el-input>
      </el-form-item>
      <!-- 动态增减表单项 -->
      <el-form-item
        label="规格属性"
        v-for="(item, index) in specsAttrs"
        :key="index"
      >
        <el-input v-model="item.value" placeholde="请输入规格属性"></el-input>
        <el-button type="primary" v-if="index == 0" @click="addAttr"
          >增加</el-button
        >
        <el-button type="danger" @click="specsAttrs.splice(index, 1)" v-else
          >删除</el-button
        >
      </el-form-item>
      <!-- 动态增减表单项 -->

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
    if (this.$route.params.id) {
      this.axios({
        url: "/api/specsinfo",
        method: "get",
        params: {
          id: this.$route.params.id,
        },
      }).then((res) => {
        // console.log(res.data.list[0]);
        this.form = res.data.list[0];
        this.form.id = this.$route.params.id;
        var arr = this.form.attrs;
        // console.log(this.specsAttrs);//["白色", "灰色", "红色", __ob__: Observer]
         this.specsAttrs.length = 0;
        arr.map(d=>{
            this.specsAttrs.push({value:`${d}`})
        })
      });
    }
  },
  data() {
    return {
      form: {
        specsname: "",
        attrs: "",
        status: 1,
      },
      specsAttrs: [{ value: "" }],
      rules: {
        specsname: [
          { required: true, message: "请输入规格名称", trigger: "blur" },
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
    addAttr() {
      if (this.specsAttrs.length < 5) {
        this.specsAttrs.push({ value: "" });
      }
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.specsAttrs.length <= 1) {
            this.$message("请填写规格属性");
            return;
          }
          var arr = [];
          this.specsAttrs.map((d) => {
            arr.push(d.value);
          });
          this.form.attrs = arr.join(",");
          var url = "/api/specsadd";
          if (this.$route.params.id) {
            url = "/api/specsedit";
          }
          this.axios.post(url, this.form).then((res) => {
            // console.log(res);
            if (res.data.code != 200) {
              alert(res.data.msg);
            } else {
              this.$router.push("/specs");
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus">
.el-input
  width: 400px
</style>