<template>
  <div
    :title="!releaseId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="栏目名称" prop="columnName">
        <el-popover
          ref="orgListPopover"
          placement="top-start"
          trigger="click">
          <el-tree
            :data="parentOptions"
            :props="orgListTreeProps"
            node-key="columnId"
            ref="columnListTree"
            @current-change="orgListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          >
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.columnName" v-popover:orgListPopover :readonly="true" placeholder="点击选择栏目名称"
                  class="org-list__input"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="dataForm.categoryId"   placeholder="请选择" class="width100">
          <el-option
            v-for="category in categoryList"
            :key="category.categoryId"
            :label="category.categoryName"
            :value="category.categoryId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="dataForm.title" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item label="文章视频简介" prop="introduce">
        <el-input v-model="dataForm.introduce" placeholder="文章/视频简介"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="dataForm.author" placeholder="作者"></el-input>
      </el-form-item>
      <el-form-item  v-show="dataForm.releaseType===1" label="文章" prop="article">
        <ueditor v-model="dataForm.article"></ueditor>
      </el-form-item>
      <el-form-item label="是否签收" prop="isSgin">
        <el-radio-group v-model="dataForm.isSgin">
          <el-radio :label="1">需要</el-radio>
          <el-radio :label="2">不需要</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item  v-show="dataForm.isSgin==1" size="mini" label="签收部门">
        <el-tree
          :highlight-current="true"
          :expand-on-click-node="false"
          :data="orgList"
          :props="orgListTreePropes"
          node-key="orgNo"
          ref="orgListTree"
          :default-expand-all="true"
          show-checkbox>
        </el-tree>
      </el-form-item>
      <el-form-item label="是否热门" prop="isSgin">
        <el-radio-group v-model="dataForm.isHot">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内部文章" prop="isInside">
        <el-radio-group v-model="dataForm.isInside">
          <el-radio :label="1">内部文章</el-radio>
          <el-radio :label="2">对外公开</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="首页图片">
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
      <el-button type="primary" @click="getDescribe()">返回
       </el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </div>
</template>

<script>
  export default {
    inject: ['reload'],
    data () {
      return {
        videoFlag: '',
        orgList: this.treeDataTranslate(JSON.parse(sessionStorage.getItem('orgList') || '[]'), 'orgNo', 'parentNo'),
        orgListTreePropes: {
          label: 'orgName',
          children: 'children'
        },
        uploadPath: '',
        dialogVisible: false,
        isMultiple: true,
        visible: false,
        parentOptions: [],
        orgListTreeProps: {
          label: 'columnName',
          children: 'children'
        },
        categoryList: [],
        dataForm: {
          releaseId: null,
          columnName: '',
          columnId: null,
          categoryId: null,
          title: '',
          isHot: null,
          introduce: '',
          isSgin: null,
          isInside: '',
          sginRange: '',
          author: '',
          zhzx: 1,
          source: '',
          video: '',
          article: '',
          remark: '',
          pic: '',
          releaseType: 1,
          orgNoList: []
        },
        dataRule: {
        },
        destroy: true
      }
    },

    beforeDestroy () {
        if (this.dataForm.releaseType === 2) {
          this.destroy = false
        }
    },
    methods: {
      beforeUploadvideo (file) {
        const isLt100M = file.size / 1024 / 1024  < 100;
        if (!isLt100M) {
          this.$message.error('上传视频大小不能超过100MB哦!');
          return false
        }
      },
      uploadvideoProcess (event, file) {
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0);
      },
      handlevideoSuccess(res, file) {                               //获取上传图片地址
        this.videoFlag = false;
        this.videoUploadPercent = 0 ;
        if(res.code === 0) {
          this.dataForm.video = res.url;
        } else{
          this.$message.error('视频上传失败，请重新上传！');
        }
      },
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
        this.dataForm.releaseId = id || ''
        this.$http({
          url: '/admin/homecolumn/list',
          method: 'get',
          params: {
            'zhzx': 1
          }
        }).then(({data}) => {
          this.parentOptions = this.treeDataTranslate(data.list, 'columnId', 'parentId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          this.$http({
            url: `/admin/category/queryAll`,
            method: 'get'
          }).then(({data}) => {
            this.categoryList = data && data.code === 0 ? data.list : []
          })
        }).then(() => {
          if (!this.dataForm.releaseId) {
            // 新增
            this.orgListTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: `/admin/relsase/info`,
              method: 'get',
              params: {
                releaseId: this.dataForm.releaseId
              }
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.relsase
                this.orgListTreeSetCurrentNode('mod')
                this.$refs.orgListTree.setCheckedKeys(data.relsase.orgNoList)
              }
            })
          }
        })
      },

      // 机构树选中
      orgListTreeCurrentChangeHandle (data) {
        this.dataForm.columnId = data.columnId
        this.dataForm.columnName = data.columnName
      },


      // 机构树设置当前选中节点
      orgListTreeSetCurrentNode (type) {
        if (type === 'mod') {
          this.$refs.columnListTree.setCurrentKey(this.dataForm.columnId)
          this.dataForm.columnName = (this.$refs.columnListTree.getCurrentNode() || {})['columnName']
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/admin/relsase/${!this.dataForm.releaseId ? 'save' : 'update'}`,
                method: 'post',
                data: {
                  'releaseId': this.dataForm.releaseId,
                  'columnName': this.dataForm.columnName,
                  'columnId': this.dataForm.columnId,
                  'categoryId': this.dataForm.categoryId,
                  'title': this.dataForm.title,
                  'isHot': this.dataForm.isHot,
                  'introduce': this.dataForm.introduce,
                  'isSgin': this.dataForm.isSgin,
                  'isInside': this.dataForm.isInside,
                  'sginRange': this.dataForm.sginRange,
                  'author': this.dataForm.author,
                  'source': this.dataForm.source,
                  'video': this.dataForm.video,
                  'article': this.dataForm.article,
                  'remark': this.dataForm.remark,
                  'pic': this.dataForm.pic,
                  'releaseType': this.dataForm.releaseType,
                  'orgNoList': [].concat(this.$refs.orgListTree.getCheckedKeys(), this.$refs.orgListTree.getHalfCheckedKeys()),
                  'zhzx': this.dataForm.zhzx
                }
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })
                  this.$router.push({name: 'admin-relsase'})
                  this.reload()
                  this.$emit('refreshDataList')
                }
              })
            }
          })
      },
      getDescribe () {
        this.reload()
        this.$router.push({name: 'zhzx-relsase'})
      }
    },
    created () {
      console.log('created Event  --> Goto init()')
      this.init(this.$route.params.id)
    }
  }
</script>
<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 0px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 50px;
    color: #8c939d;
    width: 230px;
    height: 230px;
    line-height: 230px;
    text-align: center;
  }
  .avatar {
    width: 210px;
    height: 210px;
    display: block;
  }
  .mod-org {

    .org-list__input,
    .icon-list__input {

      > .el-input__inner {
        cursor: pointer;
      }

    }
    &
    __icon-popover {
      max-width: 350px;
    }

    &
    __icon-list {
      max-height: 380px;
      padding: 0;
      margin: -8px 0 0 -8px;

      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;

        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }

      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }

  }
</style>
