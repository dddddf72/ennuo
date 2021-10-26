<template>
  <div class="mod-order">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-select v-model="searchForm.performanceColumnId"  clearable filterable placeholder="请选择考评栏目" class="width100">
          <el-option
            v-for="role in performanceColumnList"
            :key="role.performanceColumnId"
            :label="role.performanceColumnName"
            :value="role.performanceColumnId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择月份" prop="mounth">
        <el-date-picker
          v-model="searchForm.mounth"
          type="month"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('performance:order:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('performance:order:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        prop="performanceOrder"
        header-align="center"
        align="center"
        label="名次">
      </el-table-column>
      <el-table-column
        prop="orgName"
        header-align="center"
        align="center"
        label="中队名称">
      </el-table-column>
      <el-table-column
        prop="performanceColumnName"
        header-align="center"
        align="center"
        label="考评栏目">
      </el-table-column>
      <el-table-column
        prop="mounth"
        header-align="center"
        align="center"
        label="月份">
      </el-table-column>
      <el-table-column
        prop="createUser"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('performance:order:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.performanceOrderId)">修改</el-button>
          <el-button v-if="isAuth('performance:order:delete')" type="text" size="small" @click="deleteHandle(scope.row.performanceOrderId)">删除</el-button>
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
  import AddOrUpdate from './order-add-or-update'

  export default {
    data () {
      return {
        searchForm: {
          performanceColumnId: '',
          mounth: ''
        },
        performanceColumnList: [],
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
      // 获取数据列表
      getDataList () {
          this.$http({
            url: '/performance/column/queryAll',
            method: 'get'
          }).then(({data}) => {
            this.performanceColumnList = data && data.code === 0 ? data.list : []
          })

        this.$http({
          url: '/performance/order/list',
          method: 'get',
          params: {
            'page': this.pageIndex,
            'limit': this.pageSize,
            'performanceColumnId': this.searchForm.performanceColumnId,
            'mounth': this.searchForm.mounth
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
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
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
            url: '/performance/order/delete',
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
