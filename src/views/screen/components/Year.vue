<template>
  <div class="box_year">
    <div class="title">
      <p>年度游客对比</p>
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
    color: ['rgb(55, 162, 255)', 'rgb(255, 0, 135)', 'rgb(255, 191, 0)'],

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['2021', '2022', '2023'],
      icon: 'roundRect',
      textStyle: {
        color: 'white'
      },
      right: '10%',
      top: '5%'
    },
    grid: {
      left: '3%',
      right: '12%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        axisLabel: {
          color: '#fff'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          show: false
        },
        name: '访问量',
        nameLocation: 'end',
        nameTextStyle: {
          align: 'right',
          color: '#fff'
        }
      }
    ],
    series: [
      {
        name: '2021',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(55, 162, 255)'
            },
            {
              offset: 1,
              color: 'rgb(116, 21, 219)'
            }
          ])
        },

        data: [120, 23, 201, 334, 45, 130, 220, 23, 201, 334, 45, 130]
      },
      {
        name: '2022',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 0, 135)'
            },
            {
              offset: 1,
              color: 'rgb(135, 0, 157)'
            }
          ])
        },

        data: [220, 402, 231, 134, 190, 230, 120, 402, 231, 134, 190, 230]
      },
      {
        name: '2023',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0
        },
        showSymbol: false,
        label: {
          show: true,
          position: 'top'
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 191, 0)'
            },
            {
              offset: 1,
              color: 'rgb(224, 62, 76)'
            }
          ])
        },
        data: [220, 302, 181, 234, 210, 290, 150, 181, 234, 210, 290, 150]
      }
    ]
  })
})
</script>
<style lang="scss" scoped>
.box_year {
  width: 100%;
  height: 100%;
  background: url(../images/dataScreen-main-rc.png) no-repeat;
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
