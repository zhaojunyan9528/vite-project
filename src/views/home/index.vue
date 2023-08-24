<template>
  <div>
    <el-card>
      <div style="display: flex; align-items: center">
        <el-avatar :size="120" :src="userStore.avatar" />
        <div style="margin-left: 40px">
          <div
            style="
              font-size: 22px;
              font-weight: bold;
              font-style: italic;
              line-height: 2;
            "
          >
            {{ getTime() + '好,' + userStore.username }}
          </div>
          <div>{{ config.title }}</div>
        </div>
      </div>
    </el-card>
    <div style="text-align: center">
      <svg-icon name="welcome" width="800px" height="800px" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import config from '@/config'
import useUserStore from '@/store/modules/user.ts'
import { getTime } from '@/utils/date'

let userStore = useUserStore()
</script>
<style lang="scss" scoped></style>
