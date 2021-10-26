<template>
  <div class="sign">
    <div id="sign"></div>
    <div class="bottom">
      <el-button class="bottom-item"
                @click="clearSign"
                :disabled='disabled'
                size='small'
                type="warning">清除</el-button>
      <el-button class="bottom-item"
                @click='signSubmit'
                :disabled='disabled'
                size='small'
                type="primary">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
	mounted () {
    new this.lineCanvas({el: document.querySelector('#sign')}); // 获取id=sign的dom节点，传参
  },
  methods:{
  	lineCanvas (obj) {
      const that = this;
      for (var i in obj) {
        this[i] = obj[i];
      };  // 绑定用户和屏幕显示

      this.canvas = document.createElement('canvas'); // 创建画布
      if (!(this.canvas.getContext && this.canvas.getContext('2d'))) {  // 校验是否支持
        this.section = document.createElement('section'); // 创建画布错误时的显示
        this.section.className = 'errorCanvas';
        this.section.innerHTML = '对不起，当前浏览器暂不支持此功能！'
        this.el.prepend(this.section); // 插入
        return
      }
      this.canvas.width = this.el.clientWidth; 
      this.canvas.height = this.el.clientHeight; // 赋值画布宽高
      this.el.prepend(this.canvas); //prepend 在父节点的第一个子节点之前插入一系列Node对象或者DOMString对象。DOMString会被当作Text节点对待（也就是插入画布）

      this.cxt = this.canvas.getContext('2d'); // 建造平面文本
      this.cxt.fillStyle = this.background;
      this.cxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.cxt.strokeStyle = this.color;
      this.cxt.lineWidth = this.lineWidth;
      this.cxt.lineCap = 'round'; // 线条末端添加圆形线帽，减少线条的生硬感
      this.cxt.lineJoin = 'round'; // 线条交汇时为原型边角
      // 利用阴影，消除锯齿
      this.cxt.shadowBlur = 1;
      this.cxt.shadowColor = '#000';

      // 开始绘制
      this.canvas.addEventListener('touchstart', function (e) {
        this.cxt.beginPath();
        this.cxt.moveTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
      }.bind(this), false);

      // 绘制中
      this.canvas.addEventListener('touchmove', function (e) {
        this.cxt.lineTo(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        this.cxt.stroke();
      }.bind(this), false);

      // 结束绘制
      this.canvas.addEventListener('touchend', function (e) {
        that.isHave = true; // 判断是用户是否作画
        this.cxt.closePath();
      }.bind(this), false);

      // 保存图片,结合点击事件调用
      // this.saveEl.addEventListener('click', function () {
      //   let imgPng = this.canvas.toDataURL('image/png');  // 转换为本地url
      //   this.imgJpg = this.canvas.toBlob(blod=>{}) // 转换为blod文件，方便后端接收处理，blod参数就是blod文件
      // }.bind(this), false);

      // 清除画布，结合点击事件调用
      //  this.cxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
  }
}
</script>
<style lang="scss" scoped>
  .sign {
    width: 100%; /*最外层容器一定要设置宽高*/
    height: 100%;
   }
  #sign {
    position: relative;
    width: 100%;
    height: calc(100% - 38px);
    canvas {
      display: block;
    }
	}
</style>