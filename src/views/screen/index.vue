<template>
  <div class="container">
    <div ref="screen" class="screen">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <Map class="map" />
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Counter class="count"></Counter>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Top from './components/Top.vue'
// 左侧
import Tourist from './components/Tourist.vue'
import Age from './components/Age.vue'
import Sex from './components/Sex.vue'
// 中间
import Map from './components/Map.vue'
import Line from './components/Line.vue'
// 右侧
import Rank from './components/Rank.vue'
import Year from './components/Year.vue'
import Counter from './components/Counter.vue'

let screen = ref()
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
const getScale = (w = 1920, h = 1080) => {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  console.log(ww, wh)
  return ww < wh ? ww : wh
}
</script>
<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: url('./images/bg.png');
  background-size: cover;
  .screen {
    width: 1920px;
    height: 1080px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .bottom {
      height: 1040px;
      display: flex;
      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.5;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 40px;
        .rank {
          flex: 1.5;
        }
        .year {
          flex: 1;
        }
        .count {
          flex: 1;
        }
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;

        .map {
          flex: 2.5;
        }

        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
