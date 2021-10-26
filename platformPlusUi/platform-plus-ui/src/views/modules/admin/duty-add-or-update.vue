<template>
  <el-dialog
    :title="!dataForm.dutyId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="值班领导" prop="dutyLeader">
        <el-input v-model="dataForm.dutyLeader" placeholder="值班领导"></el-input>
      </el-form-item>
      <el-form-item label="事故科值班" prop="accidentUser">
        <el-input v-model="dataForm.accidentUser" placeholder="事故科值班"></el-input>
      </el-form-item>
      <el-form-item label="交管中心值班" prop="trafficUser">
        <el-input v-model="dataForm.trafficUser" placeholder="事故科值班"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker v-model="dataForm.beginTime"
                        align="right"
                        type="date"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        placeholder="开始时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="事故科值班电话" prop="accidentNum">
        <el-input v-model="dataForm.accidentNum" placeholder="事故科值班电话"></el-input>
      </el-form-item>

      <el-form-item label="交管中心值班电话" prop="trafficNum">
        <el-input v-model="dataForm.trafficNum" placeholder="交管中心值班电话"></el-input>
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
        userList: [],
        dataForm: {
          dutyId: null,
          dutyLeader: '',
          accidentUser: '',
          trafficUser: '',
          accidentNum: '0523-87682596',
          beginTime: '',
          trafficNum: '052387388100'
        },
        dataRule: {
          dutyLeaders: [
            {required: true, message: '值班领导', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.dutyId = id || ''
        this.$http({
          url: `/sys/user/queryAll`,
          method: 'get'
        }).then(({data}) => {
          this.userList = data.list
        })
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.dutyId) {
            this.$http({
              url: `/admin/duty/info/${this.dataForm.dutyId}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm = data.duty
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
                url: `/admin/duty/${!this.dataForm.dutyId ? 'save' : 'update'}`,
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
