<template>
  <el-dialog
    :title="!dataForm.picId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="位置" prop="local">
        <el-select v-model="dataForm.local" placeholder="请选择位置">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="图片" prop="pic">
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
      <el-form-item label="选择皮肤" prop="hf">
        <el-select v-model="dataForm.hf" placeholder="请选择皮肤">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="外链地址" prop="url">
        <el-input v-model="dataForm.url" placeholder="外链地址"></el-input>
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
        options: [{
          value: '标题栏下',
          label: '标题栏下'
        }, {
          value: '今日值班上',
          label: '今日值班上'
        }, {
          value: '应用服务上',
          label: '应用服务上'
        }, {
          value: '应用服务下',
          label: '应用服务下'
        }],
        option: [{
          value: '正常',
          label: '正常'
        }, {
          value: '喜庆',
          label: '喜庆'
        }, {
          value: '灰色',
          label: '灰色'
        }],
        uploadPath: '',
        dialogVisible: false,
        isMultiple: true,
        visible: false,
        dataForm: {
          picId: null,
          local: '',
          pic: '',
          hf: '',
          url: ''},
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
        this.dataForm.picId = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.picId) {
            this.$http({
              url: `/admin/homepic/info/${this.dataForm.picId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.homepic
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
                url: `/admin/homepic/${!this.dataForm.picId ? 'save' : 'update'}`,
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
