<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/seck' }"
        >限时秒杀管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>限时秒杀增加</el-breadcrumb-item>
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
        <el-select
          v-model="form.second_cateid"
          placeholde="请选择"
          @change="cateChange2"
        >
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
      <el-form-item label="商品名称" prop="title">
        <el-input v-model="form.title" placeholde="请输入商品名称"></el-input>
      </el-form-item>
      <!-- 日期范围 -->
      <div class="block">
        <span class="demonstration">起止时间</span>
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
        >
        </el-date-picker>
      </div>
      <!-- 日期范围 -->
      <!-- 商品列表 -->
      <el-form-item label="商品列表">
        <el-select v-model="form.goodsid" placeholde="请选择">
          <el-option
            :value="item.id"
            :label="item.goodsname"
            v-for="item in goods"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 商品列表 -->
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
import { log } from 'util';
export default {
  mounted() {
    // 一级分类选择项
    this.axios.get("/api/catelist?istree=1").then((res) => {
      this.cateArr = res.data.list;
    });

    if (this.$route.params.id) {
      this.axios({
        url: "/api/seckinfo",
        method: "get",
        params: {
          id: this.$route.params.id,
        },
      }).then((res) => {
        this.form = res.data.list;
        this.form.id = this.$route.params.id;
        // 获取二级分类
        this.cateChange(this.form.first_cateid);
        // 获取商品列表
        this.cateChange2(this.form.second_cateid);
        // console.log(parseInt(this.form.begintime));
        // 默认日期
        this.value1.push(parseInt(this.form.begintime));
        this.value1.push(parseInt(this.form.endtime));
        // console.log(this.value1);
      });
    }
  },
  data() {
    return {
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        seckid: "",
        goodsid: "",
        status: 1,
      },
      value1: [],
      cateArr: [], //一级分类
      cate2Arr: [], //二级分类
      goods: [],

      rules: {
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "change" },
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "change" },
        ],
        title: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "名称长度在2-20个字符之间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 一级分类选择后
    cateChange(i) {
      this.axios({ url: "/api/catelist", params: { pid: i } }).then((res) => {
        this.cate2Arr = res.data.list;
      });
    },
    // 二级分类选择后
    cateChange2(i) {
      this.axios({
        url: "/api/goodslist",
        params: { fid: this.form.first_cateid, sid: i },
      }).then((res) => {
        this.goods = res.data.list;
      });
    },

    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          var url = "/api/seckadd";
          if (this.$route.params.id) {
            url = "/api/seckedit";
          }
          this.form.begintime = this.value1[0];
          this.form.endtime = this.value1[1];
          // console.log(this.form);
          this.axios.post(url, this.form).then((res) => {
            // console.log(res);
            if (res.data.code != 200) {
              alert(res.data.msg);
            } else {
              this.$router.push("/seck");
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus">
.el-input
  width: 400px
#desc
  width: 700px
  height: 430px
.block
  margin-bottom: 22px
.demonstration
  padding: 0 6px 0 12px
  font-size: 14px
  color: #606266
  text-align: right
  vertical-align: middle
</style>