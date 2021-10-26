<template>
  <el-dialog
    :title="!dataForm.columnId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="栏目名称" prop="columnName">
        <el-input v-model="dataForm.columnName" placeholder="首页栏目名称"></el-input>
      </el-form-item>
      <el-form-item label="上级栏目名称" prop="parentName">
        <el-popover
          ref="orgListPopover"
          placement="top-start"
          trigger="click">
          <el-tree
            :data="parentOptions"
            :props="orgListTreeProps"
            node-key="columnId"
            ref="orgListTree"
            @current-change="orgListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:orgListPopover :readonly="true" placeholder="点击选择上级机构"
                  class="org-list__input"></el-input>
      </el-form-item>
      <el-form-item label="url" prop="url">
        <el-input v-model="dataForm.url" placeholder="url"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="sort">
        <el-input-number v-model="dataForm.sort"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
        dataForm: {
          columnId: null,
          columnName: '',
          parentId: '',
          url: '',
          parentName: '',
          sort: 0,
          zhzx: 0
        },
        dataRule: {
          columnName: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          parentName: [
            {required: true, message: '上级栏目不能为空', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '排序不能为空', trigger: 'blur'}
          ]
        },
        parentOptions: [],
        orgListTreeProps: {
          label: 'columnName',
          children: 'children'
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.columnId = id || 0
        this.$http({
          url: '/admin/homecolumn/list',
          method: 'get',
          params: {
            'zhzx': 0
          }
        }).then(({data}) => {
          this.parentOptions = this.treeDataTranslate(data.list, 'columnId', 'parentId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.columnId) {
            // 新增
            this.orgListTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: `/admin/homecolumn/info/${this.dataForm.columnId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.homecolumn
                this.orgListTreeSetCurrentNode('mod')
              }
            })
          }
        })
      },
      // 机构树选中
      orgListTreeCurrentChangeHandle (data) {
        this.dataForm.parentId = data.columnId
        this.dataForm.parentName = data.columnName
      },
      // 机构树设置当前选中节点
      orgListTreeSetCurrentNode (type) {
        if (type === 'mod') {
          this.$refs.orgListTree.setCurrentKey(this.dataForm.parentId)
          this.dataForm.parentName = (this.$refs.orgListTree.getCurrentNode() || {})['columnName']
        }
      },
      // 表单提交
      dataFormSubmit () {
        if (!this.dataForm.parentId) {
          this.dataForm.parentId = 0
        }
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/admin/homecolumn/${!this.dataForm.columnId ? 'save' : 'update'}`,
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
<style lang="scss">
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
