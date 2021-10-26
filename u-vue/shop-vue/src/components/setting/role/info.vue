<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/role' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item
        >角色{{usr}}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="rolename">
        <el-input v-model="form.rolename" placeholde="请输入角色名称"></el-input>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item label="状态">
        <el-tooltip :content="'Switch value: ' + form.status" placement="top" >
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#999"
            :active-value="1"
            :inactive-value="2" 
          >
          </el-switch>
        </el-tooltip>
      </el-form-item>
      <!-- 树形结构 -->
      <el-form-item label="角色权限">
        <el-tree
          :data="list"
          :props="defaultProps"
          show-checkbox
          check-strictly
          node-key="id"
          ref="mytree"
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="defaultCheckedKeys"
        ></el-tree>
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
    // 获取树形列表
    this.axios({
      url: "/api/menulist",
      method: "get",
      params: {
        istree: 1,
      },
    }).then((res) => {
      // console.log(res.data.list);
      this.list = res.data.list;
    });
    if (this.$route.params.id) {
      this.usr = '修改'
      this.axios({
        url: "/api/roleinfo",
        method: "get",
        params: {
          id: this.$route.params.id,
        },
      }).then((res) => {
        // console.log(res.data);
        this.form = res.data.list;
        this.defaultCheckedKeys = res.data.list.menus.split(",")  //默认展开的节点（数组）
        this.form.id = this.$route.params.id;
      });
    }
  },
  data() {
    return {
      usr: "添加",
      form: {
        rolename: "",
        menus: [],
        status: "1",
      },
      defaultCheckedKeys:[],//默认展开的节点
      // 树形结构
      list: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      // 树形结构
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
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
      // console.log(this.$refs.mytree.getCheckedKeys());
      this.form.menus = this.$refs.mytree.getCheckedKeys().join(",") //获取选中的权限的id值
      this.$refs[form].validate((valid) => {
        if (valid) {
          var url = "/api/roleadd";
          if (this.$route.params.id) {
            url = "/api/roleedit";
          }
          this.axios.post(url, this.form).then((res) => {
            if (res.data.code != 200) {
              alert(res.data.msg);
            } else {
              this.$router.push("/role");
            }
          });
        }
      });
    },
  },
  // watch: {
  //   form:{
  //     handler:function(val){
  //       console.log(val);
  //     },
  //     deep:true//显示的设置为深度监听
  //   }
  // },
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