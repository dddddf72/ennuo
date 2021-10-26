<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="$router.push('/category/add')">增加</el-button>
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- <el-table-column prop="pid" label="分类编号" width="180">
      </el-table-column> -->
      <el-table-column prop="catename" align='center' label="分类名称" width="180">
      </el-table-column>
      <el-table-column label="图片" align='center' width='180'>
        <template slot-scope="scope">
          <img v-if="scope.row.img" :src="scope.row.img">
        </template>  
      </el-table-column>
      <el-table-column prop="status" align='center' label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align='center'>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
          
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import vDelete from '../../delete'
export default {
  // components:{
  //   vDelete
  // },
  mounted() {
    this.axios.get("/api/catelist?istree=1").then((res) => {
      this.list = res.data.list;
      // console.log(res.data.list);
    });
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    // 编辑
    handleEdit(id) {
      this.$router.push("/category/" + id);
    },
    // 删除
    handleDelete(id) {
      // console.log(id);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.post("/api/catedelete", { id }).then((res) => {
            // console.log(res);
            this.list = res.data.list;
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
img 
  width 120px
</style>