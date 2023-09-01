<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../images/dataScreen-title.png" alt="" />
    </div>
    <div ref="charts" class="charts"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//获取图形图标的DOM节点
let charts = ref()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      right: '10%',
      top: 'center',
      orient: 'vertical',
      itemGap: 20,
      textStyle: {
        color: '#fff',
        fontSize: 14
      },
      formatter: function (name: any) {
        return name
      }
    },
    series: [
      {
        name: '年龄比例',
        type: 'pie',
        center: ['35%', '50%'],
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
          formatter: function (v: any) {
            return v.percent + '%'
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '65-100岁' },
          { value: 735, name: '25-65岁' },
          { value: 580, name: '18-25岁' },
          { value: 484, name: '12-18岁' },
          { value: 300, name: '0-12岁' }
        ]
      }
    ],
    grid: {
      left: 0,
      right: 0
    }
  })
})
</script>
<style lang="scss" scoped>
.box2 {
  width: 100%;
  height: 100%;
  background: url(../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;
  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: 100%;
  }
}
</style>
