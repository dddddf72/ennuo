<template>
  <el-dialog
    :title="!dataForm.performanceId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="标题" prop="name">
        <el-input v-model="dataForm.name" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item   label="内容" prop="performanceContent">
        <ueditor v-model="dataForm.performanceContent"></ueditor>
      </el-form-item>
      <el-form-item label="附件地址" prop="enclosure">
        <el-upload
          class="upload-demo"
          :action= 'uploadPath'
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-success="success"
          :on-exceed="handleExceed"
          :data="actionInfo">
          <el-button type="primary" plain style="width: 120px;text-align: left;margin-left: 15px;"><i class="fa fa-upload">选择导入文件</i></el-button>
        </el-upload>
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
        uploadPath: '',
        dialogVisible: false,
        isMultiple: true,
        dataForm: {
          performanceId: null,
          performanceContent: '',
          name: '',
          enclosure: ''
         },
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 上传
      success (response , file , files) {
        if (response.statusCode!=1) {
          this.fileList = []
        }
        this.dataForm.enclosure = response.url
        this.$alert(response.msg)
      },
      handleRemove (file , fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file) ;
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件`);
      },
      beforeRemove (file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleSelectionChange (val) {
        this.multipleSelection = val;
        console.log(val)
      },
      handleSizeChange (val) {
        this.page_size = val
        this.init()
      },
      init (id) {
        this.uploadPath = this.$http.BASE_URL + `/sys/oss/upload?token=${this.$cookie.get('token')}`
        this.dataForm.performanceId = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.performanceId) {
            this.$http({
              url: `/admin/performance/info/${this.dataForm.performanceId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.performance
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
                url: `/admin/performance/${!this.dataForm.performanceId ? 'save' : 'update'}`,
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
