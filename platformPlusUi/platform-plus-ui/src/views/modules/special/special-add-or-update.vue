<template>
  <el-dialog
    :title="!dataForm.specialId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="栏目名称" prop="specialColumnName">
        <el-select v-model="dataForm.specialColumnId"   placeholder="请选择" class="width100">
          <el-option
            v-for="category in specialColumnList"
            :key="category.specialColumnId"
            :label="category.specialColumnName"
            :value="category.specialColumnId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item label="文章简介" prop="introduce">
        <el-input v-model="dataForm.introduce" placeholder="文章简介"></el-input>
      </el-form-item>
      <el-form-item label="文章" prop="article">
        <ueditor v-model="dataForm.article"></ueditor>
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
        specialColumnList: [],
        dataForm: {
          specialId:'',
          specialColumnName: '',
          specialColumnId: '',
          title: '',
          introduce: '',
          author: '',
          source: '',
          article: '',
          remark: '',
          createUser: '',
          createTime: ''},
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.specialId = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
            this.$http({
              url: `/admin/specialcolumn/queryAll`,
              method: 'get',
            }).then(({data}) => {
              this.specialColumnList = data && data.code === 0 ? data.list : []
            })
          if (this.dataForm.specialId) {
            this.$http({
              url: `/admin/special/info/${this.dataForm.specialId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.special
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
                url: `/admin/special/${!this.dataForm.specialId ? 'save' : 'update'}`,
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
