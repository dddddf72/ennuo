<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/category' }"
        >商品分类管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品分类添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="上级分类" prop="pid">
        <el-select v-model="form.pid" placeholde="请选择">
          <el-option :value="0" label="顶级分类"></el-option>
          <el-option
            :value="item.id"
            :label="item.catename"
            v-for="item in Arr"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="catename">
        <el-input
          v-model="form.catename"
          placeholde="请输入分类名称"
        ></el-input>
      </el-form-item>
      <!-- 图片上传 -->
      <el-form-item label="图片" v-if="form.pid != 0">
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
    // 下拉框选择项
    this.axios.get("/api/catelist?istree=1").then((res) => {
      this.Arr = res.data.list;
      // console.log(res.data.list);
    });
    if (this.$route.params.id) {
      this.axios({
        url: "/api/cateinfo",
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
        pid: "",
        catename: "",
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
        pid: [{ required: true, message: "请选择分类级别", trigger: "change" }],
        catename: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
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
          var url = "/api/cateadd";
          if (this.$route.params.id) {
            url = "/api/cateedit";
          }
          this.axios.post(url, data).then((res) => {
            // console.log(res);
            if (res.data.code != 200) {
              alert(res.data.msg);
            } else {
              this.$router.push("/category");
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