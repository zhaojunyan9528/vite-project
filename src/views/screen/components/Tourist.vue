<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div ref="charts" class="charts">123</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
//水球图拓展插件
import * as echarts from 'echarts'
import 'echarts-liquidfill'

let people = ref('215908人')
let charts = ref()
onMounted(() => {
  let myecharts = echarts.init(charts.value)
  myecharts.setOption({
    series: [
      {
        type: 'liquidFill',
        data: [0.6, 0.4, 0.2],
        color: ['#1462bc', '#1593e7', '#42b8f9'],
        waveAnimation: true, //动画
        animationDuration: 3,
        animationDurationUpdate: 0,
        radius: '88%', //半径
        outline: {
          //外层边框颜色设置
          show: true,
          borderDistance: 8,
          itemStyle: {
            color: '#229cb1',
            borderColor: '#5c7bd9',
            borderWidth: 8,
            shadowBlur: 20,
            shadowColor: '#6684dd'
          }
        }
      }
    ],
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  })
})
</script>
<style lang="scss" scoped>
.box {
  background: url(../images/dataScreen-main-lt.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

    .right {
      // float: right;
      text-align: right;
      padding-right: 10px;
      color: white;
      font-size: 20px;

      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    padding: 10px;
    margin-top: 30px;
    display: flex;
    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
    }
  }

  .charts {
    width: 100%;
    height: 270px;
  }
}
</style>
