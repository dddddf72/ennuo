<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="$router.push('/user/add')"
      >增加</el-button
    >
    <el-table :data="list" style="width: 100%" row-key="id" border>
      <!-- <el-table-column prop="id" label="角色编号" width="180">
      </el-table-column> -->
      <el-table-column prop="username" label="用户名" width="180" align='center'>
      </el-table-column>
      <el-table-column prop="rolename" label="所属角色" width="180" align='center'>
      </el-table-column>
      <el-table-column prop="status" label="状态" align='center'>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.uid)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.uid,scope.row.index)"
            >删除</el-button
          >
          <!-- <v-delete></v-delete> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="count"
      :page-size="size"
      @current-change="currentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
// import vDelete from '../../delete'
export default {
  // components:{
  //   vDelete
  // },
  mounted() {
    // 管理员总数
    // this.axios.get("/api/usercount").then((res) => {
    //   // console.log(res);
    //   this.count = res.data.list[0].total;
    // });
    // 管理员列表
    this.pagechange()
  },
  data() {
    return {
      list: [],
      count: 0, //管理员总数
      size: 3,
      page: 1,
    };
  },
  methods: {
    //分页封装
    pagechange(){
       // 管理员总数
    this.axios.get("/api/usercount").then((res) => {
      // console.log(res);
      this.count = res.data.list[0].total;
    });
      this.axios({
        url: "/api/userlist",
        params: {
          size: this.size,
          page: this.page,
        },
      }).then((res) => {
        this.list = res.data.list;
        // console.log(this.list);
      });
    },
    // 分页
    currentChange(n) {
      // console.log(n);//当前页数
      this.page = n;
      this.pagechange()
    },
    // 编辑
    handleEdit(uid) {
      this.$router.push("/user/" + uid);
    },
    // 删除
    handleDelete(uid,n) {
      // console.log(id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.post("/api/userdelete", { uid }).then((res) => {
            // console.log(res);
            // this.list = res.data.list;
            // 删除数据后，页码跟着变化
            this.list.splice(n,1);
            if(this.list.length<=0&&this.page>1){
              this.page--;
              this.pagechange();
            }
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped lang="stylus">
.el-table
  margin-top: 20px
  box-sizing: border-box
.el-pagination
  margin-top 10px
  float right
</style>