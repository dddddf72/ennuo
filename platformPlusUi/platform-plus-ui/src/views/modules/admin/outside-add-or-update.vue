<template>
  <el-dialog
    :title="!dataForm.outsideId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="外链名称" prop="outsideName">
        <el-input v-model="dataForm.outsideName" placeholder="外链名称"></el-input>
      </el-form-item>
      <el-form-item label="选择位置" prop="columnId">
        <el-select v-model="dataForm.columnId" placeholder="请选择位置">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="dataForm.columnId=='网站导航'" label="选择分类" prop="outsideCategroy">
        <el-select v-model="dataForm.outsideCategroy" placeholder="请选择分类">
          <el-option
            v-for="item in categroy"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
      <el-form-item label="外链地址" prop="outsideUrl">
        <el-input v-model="dataForm.outsideUrl" placeholder="外链地址"></el-input>
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
          value: '网站导航',
          label: '网站导航'
        }, {
          value: '首页悬浮',
          label: '首页悬浮'
        } ],
        categroy: [{
          value: '公安部站点',
          label: '公安部站点'
        }, {
          value: '省外站点',
          label: '省外站点'
        }, {
          value: '省内站点',
          label: '省内站点'
        },{
          value: '省厅处站点',
          label: '省厅处站点'
        },{
          value: '公安综合信息查询库',
          label: '公安综合信息查询库'
        }
        ],
        uploadPath: '',
        dialogVisible: false,
        isMultiple: true,
        visible: false,
        dataForm: {
          outsideId: null,
          outsideName: '',
          columnId: '',
          outsideCategroy: '',
          outsideUrl: '',
          pic: '',
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
        this.dataForm.outsideId = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.outsideId) {
            this.$http({
              url: `/admin/outside/info/${this.dataForm.outsideId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.outside
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
                url: `/admin/outside/${!this.dataForm.outsideId ? 'save' : 'update'}`,
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
