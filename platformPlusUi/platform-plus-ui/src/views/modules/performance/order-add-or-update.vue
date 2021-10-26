<template>
  <el-dialog
    :title="!dataForm.performanceOrderId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="中队名称" prop="orgNo">
        <el-popover
          ref="orgListPopover"
          placement="top-start"
          trigger="click">
          <el-tree
            :data="orgNoOptions"
            :props="orgListTreeProps"
            node-key="orgNo"
            ref="orgListTree"
            @current-change="orgListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.orgName" v-popover:orgListPopover :readonly="true" placeholder="请选择中队"
                  class="org-list__input"></el-input>
      </el-form-item>

      <el-form-item label="考评栏目" prop="performanceColumnId">
        <el-select v-model="dataForm.performanceColumnId"  clearable filterable placeholder="请选择考评栏目" class="width100">
          <el-option
            v-for="role in performanceColumnList"
            :key="role.performanceColumnId"
            :label="role.performanceColumnName"
            :value="role.performanceColumnId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="performanceOrder">
        <el-input-number v-model="dataForm.performanceOrder" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item label="选择月份" prop="mounth">
        <el-date-picker
          v-model="dataForm.mounth"
          type="month"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择月">
        </el-date-picker>
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
        orgNoOptions: this.treeDataTranslate(JSON.parse(sessionStorage.getItem('orgList') || '[]'), 'orgNo', 'parentNo'),
        orgListTreeProps: {
          label: 'orgName',
          children: 'children'
        },
        performanceColumnList: [],
        visible: false,
        dataForm: {
          performanceOrderId: '',
          orgNo: '',
          orgName: '',
          performanceColumnId: '',
          performanceColumnName: '',
          performanceOrder: 0,
          mounth :'',

          },
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.performanceOrderId = id || ''
        this.$http({
          url: '/performance/column/queryAll',
          method: 'get'
        }).then(({data}) => {
          this.performanceColumnList = data && data.code === 0 ? data.list : []
        }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        }).then(() => {
          if (this.dataForm.performanceOrderId) {
            this.$http({
              url: `/performance/order/info/${this.dataForm.performanceOrderId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.order
              }
            })
          }
        })
      },


      // 机构树设置当前选中节点
      orgListTreeSetCurrentNode (type) {
        if (type === 'mod') {
          this.$refs.orgListTree.setCurrentKey(this.dataForm.parentNo)
          this.dataForm.parentName = (this.$refs.orgListTree.getCurrentNode() || {})['orgName']
        }
      },
      // 机构树选中
      orgListTreeCurrentChangeHandle (data) {
        this.dataForm.orgNo = data.orgNo
        this.dataForm.orgName = data.orgName
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/performance/order/${!this.dataForm.performanceOrderId ? 'save' : 'update'}`,
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



