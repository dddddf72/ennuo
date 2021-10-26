<template>
  <el-dialog
    :title="!dataForm.appId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model="dataForm.appName" placeholder="应用名称"></el-input>
      </el-form-item>
      <el-form-item label="应用图标" prop="appPic">
        <el-upload
          drag
          :action= 'uploadPath'
          :show-file-list="false"
          accept="image/*"
          :limit="imgLimit"
          :multiple="isMultiple"
          :on-remove="handleRemovep"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-exceed="handleExceedp"
          :on-error="imgUploadError">
          <img  v-model="dataForm.appPic" v-if="dataForm.appPic" :src="dataForm.appPic" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="应用连接" prop="appFile">
        <el-input v-model="dataForm.appFile" placeholder="链接"></el-input>
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
        dataForm: {
          appId: null,
          appName: '',
          appPic: '',
          appFile: ''
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
        this.dataForm.appFile = response.url
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
      // 上传文件结束
      handleRemovep (file, fileList) {
        console.log(file, fileList)
      },
      beforeAvatarUpload (file) {
        console.log(file)
        const isJPG = true
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2

        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M
      },
      handleAvatarSuccess (res) {
        this.dataForm.appPic = res.url
      },
      handleExceedp (files, fileList) {
        this.$message.error('上传图片不能超过6张!')
        console.log(files, fileList)
      },
      imgUploadError (err) {
        console.log(err)
        this.$message.error('上传图片失败!')
      },
      init (id) {
        this.uploadPath = this.$http.BASE_URL + `/sys/oss/upload?token=${this.$cookie.get('token')}`
        this.dataForm.appId = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.appId) {
            this.$http({
              url: `/admin/app/info/${this.dataForm.appId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.app
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
                url: `/admin/app/${!this.dataForm.appId ? 'save' : 'update'}`,
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
