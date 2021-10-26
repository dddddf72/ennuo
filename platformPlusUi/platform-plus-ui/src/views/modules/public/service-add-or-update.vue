<template>
  <el-dialog
    :title="!dataForm.serviceconId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="服务名称" prop="name">
        <el-input v-model="dataForm.name" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="服务链接" prop="url">
        <el-input v-model="dataForm.url" placeholder="服务链接"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="pic">
        <el-upload
          drag
          :action= 'uploadPath'
          :show-file-list="false"
          accept="image/*"
          :limit="imgLimit"
          :multiple="isMultiple"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-exceed="handleExceed"
          :on-error="imgUploadError">
          <img  v-model="dataForm.pic" v-if="dataForm.pic" :src="dataForm.pic" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
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
        uploadPath: '',
        dialogVisible: false,
        isMultiple: true,
        visible: false,
        dataForm: {
          serviceconId: null,
          name: '',
          url: '',
          pic: ''
          },
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleRemove (file, fileList) {
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
        this.dataForm.pic = res.url
      },
      handleExceed (files, fileList) {
        this.$message.error('上传图片不能超过6张!')
        console.log(files, fileList)
      },
      imgUploadError (err) {
        console.log(err)
        this.$message.error('上传图片失败!')
      },
      init (id) {
        this.uploadPath = this.$http.BASE_URL + `/sys/oss/upload?token=${this.$cookie.get('token')}`
        this.dataForm.serviceconId = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.serviceconId) {
            this.$http({
              url: `/admin/service/info/${this.dataForm.serviceconId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.service
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
                url: `/admin/service/${!this.dataForm.serviceconId ? 'save' : 'update'}`,
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
