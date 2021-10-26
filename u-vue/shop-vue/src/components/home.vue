<template>
  <div id="main" style="width: 1100px;height:500px;">
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted() {
    // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '近一周订单量'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
               data: ['周一', '周二', '周三', '周四', '周五', '周六', '周天']
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'line',
                data: [520, 832, 901, 634, 790, 1230, 1000],
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
  },
}
</script>

<style scoped>
#main{margin-top: 30px;}
</style>