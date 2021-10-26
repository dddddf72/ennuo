<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品增加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <!-- 一级分类 -->
      <el-form-item label="一级分类" prop="first_cateid">
        <el-select
          v-model="form.first_cateid"
          placeholde="请选择"
          @change="cateChange"
        >
          <!-- <el-option :value="0" label="顶级分类"></el-option> -->
          <el-option
            :value="item.id"
            :label="item.catename"
            v-for="item in cateArr"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 一级分类 -->
      <!-- 二级分类 -->
      <el-form-item label="二级分类" prop="second_cateid">
        <el-select v-model="form.second_cateid" placeholde="请选择">
          <!-- <el-option :value="0" label="顶级分类"></el-option> -->
          <el-option
            :value="item.id"
            :label="item.catename"
            v-for="item in cate2Arr"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 二级分类 -->
      <el-form-item label="商品名称" prop="goodsname">
        <el-input
          v-model="form.goodsname"
          placeholde="请输入商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.price" placeholde="请输入菜单价格"></el-input>
      </el-form-item>
      <el-form-item label="市场价格">
        <el-input
          v-model="form.market_price"
          placeholde="请输入菜单市场价格"
        ></el-input>
      </el-form-item>
      <!-- 图片 -->
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
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 图片 -->
      <el-form-item label="商品描述">
        <div id="desc"></div>
      </el-form-item>
      <!-- 商品规格 -->
      <el-form-item label="商品规格" prop="specsid">
        <el-select
          v-model="form.specsid"
          placeholde="请选择"
          @change="specsChange"
        >
          <!-- <el-option :value="0" label="顶级分类"></el-option> -->
          <el-option
            :value="item.id"
            :label="item.specsname"
            v-for="item in specsArr"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 商品规格 -->
      <!-- 规格属性 -->
      <el-form-item label="规格属性" prop="specsattr">
        <el-select v-model="form.specsattr" placeholder="请选择">
          <!-- multiple 多选 -->
          <el-option
            :value="item"
            :label="item"
            v-for="(item, index) in specsAttr"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 规则属性 -->
      <el-form-item label="是否新品">
        <el-radio-group v-model="form.isnew">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否热卖">
        <el-radio-group v-model="form.ishot">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
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
import E from "wangeditor";
export default {
  mounted() {
    this.editor = new E("#desc");
    this.editor.create();
    this.editor.config.uploadImgShowBase64 = true;
    if (!this.$route.params.id) {
      this.fileList = []; //图片数据置空
    }
    // 一级分类选择项
    this.axios.get("/api/catelist?istree=1").then((res) => {
      this.cateArr = res.data.list;
    });
    // 属性选择项
    this.axios.get("/api/specslist").then((res) => {
      this.specsArr = res.data.list;
    });

    if (this.$route.params.id) {
      this.axios({
        url: "/api/goodsinfo",
        method: "get",
        params: {
          id: this.$route.params.id,
        },
      }).then((res) => {
        this.form = res.data.list;
        this.form.id = this.$route.params.id;
        this.fileList[0].url = this.form.img;
        // 获取二级分类
        this.cateChange(this.form.first_cateid);
        // 获取规格属性
        this.specsChange(this.form.specsid);
        // 富文本编辑器内容
        var html = this.form.description;
        this.editor.txt.html(`${html}`);
      });
    }
  },
  data() {
    return {
      form: {
        goodsname: "",
        first_cateid: "",
        second_cateid: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      cateArr: [], //一级分类
      cate2Arr: [], //二级分类
      specsArr: [], //规格
      specsAttr: [], //规格属性
      Arr: [],
      // 图片
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: [{ url: "" }],
      // 图片
      rules: {
        first_cateid: [
          { required: true, message: "请选择菜单级别", trigger: "change" },
        ],
        second_cateid: [
          { required: true, message: "请选择菜单级别", trigger: "change" },
        ],
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
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
    // 一级分类选择后
    cateChange(i) {
      // console.log(i);
      this.axios({ url: "/api/catelist", params: { pid: i } }).then((res) => {
        this.cate2Arr = res.data.list;
        // console.log(res.data.list);
      });
    },
    // 属性选择后
    specsChange(i) {
      // console.log(i);
      this.axios({ url: "/api/specsinfo", params: { id: i } }).then((res) => {
        this.specsAttr = res.data.list[0].attrs;
        if (this.$route.params.id) {
          this.form.specsattr = this.specsAttr[this.form.specsattr];
        }
      });
    },
    // 图片上传
    fileChange(file) {
      // console.log(file);
      this.form.img = file.raw;
    },
    // 图片上传

    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.form.description = this.editor.txt.html();
          var data = new FormData();
          for (let i in this.form) {
            data.append(i, this.form[i]);
          }
          var url = "/api/goodsadd";
          if (this.$route.params.id) {
            url = "/api/goodsedit";
          }
          this.axios.post(url, data).then((res) => {
            // console.log(res);
            if (res.data.code != 200) {
              alert(res.data.msg);
            } else {
              this.$router.push("/goods");
            }
          });
        }
      });
    },
    // 图片
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除
    handleRemove(file) {
      this.fileList = [];
    },
    // 图片
  },
};
</script>

<style scoped lang="stylus">
.el-input
  width: 400px
#desc
  width: 700px
  height: 430px
</style>