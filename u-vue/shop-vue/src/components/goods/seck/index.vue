<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->
    <el-button type="primary" @click="$router.push('/seck/add')"
      >增加</el-button
    >
    <el-table :data="list" style="width: 100%" row-key="id" border>
      <el-table-column prop="title" align="center" label="商品名称" width="180">
      </el-table-column>
      <el-table-column
        prop="begintime"
        align="center"
        label="开始时间"
        width="220"
      >
      </el-table-column>
      <el-table-column
        prop="endtime"
        align="center"
        label="结束时间"
        width="220"
      >
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态" width="160">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
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
export default {
  mounted() {
    this.axios.get("/api/secklist").then((res) => {
      this.list = res.data.list;
      // console.log(this.list);
      for(var i in this.list){
        this.list[i].begintime = this.format(parseInt(this.list[i].begintime))
        this.list[i].endtime = this.format(parseInt(this.list[i].endtime))
      }
    });
    
  },
  data() {
    return {
      list: [],
    };
  },
  methods: {
    //   时间
    add0(m){return m<10?'0'+m:m },
    format(date){
        var time = new Date(date);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        },
    // 编辑
    handleEdit(id) {
      this.$router.push("/seck/" + id);
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
          this.axios.post("/api/seckdelete", { id }).then((res) => {
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
  width: 120px
.tag
  margin-left: 5px
.el-pagination
  margin-top: 10px
  float: right
</style>