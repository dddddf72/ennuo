<template>
  <div class="del">
    <el-button size="mini" type="danger" @click="handleDelete(rowid,url)"
      >{{url}}</el-button
    >
  </div>
</template>

<script>
export default {
    props:["rowid","url"],
  methods: {
    // 删除
    handleDelete(id,url) {
      console.log(id);
      console.log(url);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.axios.post("/api/"+url, { id }).then((res) => {
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

<style>
.del{display: inline;}
</style>