<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/banner' }"
        >轮播图列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>轮播图添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="轮播图名称" prop="title">
        <el-input
          v-model="form.title"
          placeholde="请输入轮播图名称"
        ></el-input>
      </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="图片">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="fileChange"
          :file-list="fileList"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
               <span class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
            </span>
           
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  mounted() {
    if(!this.$route.params.id){
      this.fileList = [];//图片数据置空
    }
    if (this.$route.params.id) {
      this.axios({
        url: "/api/bannerinfo",
        method: "get",
        params: {
          id: this.$route.params.id,
        },
      }).then((res) => {
        // console.log(res.data);
        this.form = res.data.list;
        this.form.id = this.$route.params.id;
        this.fileList[0].url = this.form.img;
      });
    }
  },
  data() {
    return {
      form: {
        id: "",
        title: "",
        img: "",
        status: 1,
      },
      Arr: [],

      // 图片
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: [{ url: "" }],
      // 图片
      rules: {
        id: [{ required: true, message: "请选择轮播图级别", trigger: "change" }],
        title: [
          { required: true, message: "请输入轮播图名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "标题长度在2-20个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 图片上传
    fileChange(file) {
      // console.log(file);
      this.form.img = file.raw;
    },
    // 图片上传
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          var data = new FormData();
          for (let i in this.form) {
            data.append(i, this.form[i]);
          }
          var url = "/api/banneradd";
          if (this.$route.params.id) {
            url = "/api/banneredit";
          }
          this.axios.post(url, data).then((res) => {
            // console.log(res);
            if (res.data.code != 200) {
              alert(res.data.msg);
            } else {
              this.$router.push("/banner");
            }
          });
        }
      });
      // console.log(this.form);
    },
    // 图片
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除
    handleRemove(file){
      this.fileList = [];
    }
    // 图片
  },
};
</script>

<style scoped lang="stylus">
.el-input
  width: 400px
</style>