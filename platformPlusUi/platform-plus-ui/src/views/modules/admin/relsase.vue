<template>
  <div class="mod-relsase">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.columnName" placeholder="栏目名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('admin:relsase:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('admin:relsase:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="columnName"
        header-align="center"
        align="center"
        label="栏目名称">
      </el-table-column>
      <el-table-column
        prop="categoryName"
        header-align="center"
        align="center"
        label="文章分类"
        width="100">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="文章标题"
        width="200">
      </el-table-column>
      <el-table-column
        prop="introduce"
        header-align="center"
        align="center"
        label="简介"
        width="160">
      </el-table-column>
      <el-table-column
        prop="isSgin"
        header-align="center"
        align="center"
        label="需要签收">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSgin === 1" size="small" type="success">需要</el-tag>
          <el-tag v-else-if="scope.row.isSgin === 2" size="small" type="danger">不需要</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isHot"
        header-align="center"
        align="center"
        label="是否热门">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isHot === 1" size="small" type="success">是</el-tag>
          <el-tag v-else-if="scope.row.isHot === 2" size="small" type="danger">不是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isInside"
        header-align="center"
        align="center"
        label="内部文章"
        width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isInside === 1" size="small" type="success">内部文章</el-tag>
          <el-tag v-else-if="scope.row.isInside === 2" size="small" type="danger">对外公开</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="author"
        header-align="center"
        align="center"
        label="文章作者"
        width="100">
      </el-table-column>
      <el-table-column
        prop="source"
        header-align="center"
        align="center"
        label="文章来源"
        width="160">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        width="160">
      </el-table-column>
      <el-table-column
        prop="pic"
        header-align="center"
        align="center"
        label="首页图片"
        width="160">
        <!-- 图片的显示 -->
        <template   slot-scope="scope">
          <img :src="scope.row.pic"  min-width="70" height="70" />
        </template>
      </el-table-column>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="releaseType"
        header-align="center"
        align="center"
        label="发布类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.releaseType === 1" size="small" type="success">文章</el-tag>
          <el-tag v-else-if="scope.row.releaseType === 2" size="small" type="danger">视频</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"
        width="160">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('admin:relsase:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.releaseId)">修改</el-button>
          <el-button v-if="isAuth('admin:relsase:delete')" type="text" size="small" @click="deleteHandle(scope.row.releaseId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import AddOrUpdate from './relsase-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          columnName: ''
        },
        dialogVisible: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/admin/relsase/list',
          method: 'get',
          params: {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.searchForm.name,
            'zhzx': 0
          }
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.records
            this.totalPage = data.page.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.$router.push({
          name: 'admin-relsase-add-or-update',
          params: {
            id: id
          }
        })
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: '/admin/relsase/delete',
            method: 'post',
            data: ids
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
