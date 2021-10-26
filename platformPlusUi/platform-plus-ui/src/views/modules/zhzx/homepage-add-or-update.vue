<template>
  <el-dialog
    :title="!dataForm.homeId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="栏目名称" prop="columnId">
        <el-select v-model="dataForm.columnId"   placeholder="请选择" class="width100">
          <el-option
            v-for="category in columnList"
            :key="category.columnId"
            :label="category.columnName"
            :value="category.columnId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否侧边栏" prop="isRight">
        <el-radio-group v-model="dataForm.isRight">
          <el-radio :label="0">不是</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        columnList: [],
        dataForm: {
          homeId: null,
          columnId: '',
          isRight: 0,
          zhzx: 1},
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.homeId = id || ''
        this.visible = true
        this.$http({
          url: `/admin/homecolumn/queryAll`,
          method: 'get',
          params: {
            'zhzx': 1
          }
        }).then(({data}) => {
          this.columnList = data && data.code === 0 ? data.list : []
        })
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.homeId) {
            this.$http({
              url: `/admin/homepage/info/${this.dataForm.homeId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.homepage
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/admin/homepage/${!this.dataForm.homeId ? 'save' : 'update'}`,
                method: 'post',
                data: this.dataForm
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }
          })
      }
    }
  }
</script>
