<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->
    <el-button type="primary" @click="$router.push('/goods/add')">增加</el-button>
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      border
    >
      <el-table-column prop="goodsname" align='center' label="商品名称" width="180" >
      </el-table-column>
     <el-table-column prop="price" align='center' label="商品价格" width="100" >
      </el-table-column>
      <el-table-column prop="market_price" align='center' label="市场价格" width="100" >
      </el-table-column>
      <!-- 图片 -->
      <el-table-column label="图片" align='center' width='180'>
        <template slot-scope="scope">
          <img v-if="scope.row.img" :src="scope.row.img">
        </template>  
      </el-table-column>
      <!-- 图片 -->
      <el-table-column prop="isnew" align='center' label="是否新品" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isnew == 1">是</el-tag>
          <el-tag type="danger" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ishot" align='center' label="是否热卖" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ishot == 1">是</el-tag>
          <el-tag type="danger" v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" align='center' label="状态" width="100">
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
    <!-- 分页 -->
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
export default {
  mounted() {
    
    this.axios.get("/api/goodslist").then((res) => {
      this.list = res.data.list;
      // console.log(this.list);
    });
    // 分页
    this.pagechange()
  },
  data() {
    return {
      list: [],
      // 分页
      count:0,
      size:2,
      page:1,
    };
  },
  methods: {
    //分页封装
    pagechange(){
       // 商品总数
    this.axios.get("/api/goodscount").then((res) => {
      // console.log(res);
      this.count = res.data.list[0].total;
    });
      this.axios({
        url: "/api/goodslist",
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
    handleEdit(id) {
      this.$router.push("/goods/" + id);
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
          this.axios.post("/api/goodsdelete", { id }).then((res) => {
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
.tag
    margin-left 5px
.el-pagination
  margin-top 10px
  float right
</style>