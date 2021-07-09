<!-- 描述 -->
<template>
  <div>
    <div :class="$style.memberAssets">
      <div
        class="el-card"
        :class="$style.map"
      />
      <div
        class="el-card"
        :class="$style.assetStatistics"
      >
        <div :class="$style.title">
          资产统计
        </div>
        <div
          v-for="(item,index) in asset"
          :key="index"
          :class="$style.square"
        >
          <div :class="$style.bock">
            <div :class="$style.icon">
              <i :class="item.icon" />
            </div>
            <div :class="$style.name">
              {{ item.name }}
            </div>
            <div :class="$style.number">
              {{ item.number }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// import { Icon } from 'node_modules/element-ui/types'
// @ts-nocheck
export default {
  props: {
  },
  components: {
  },
  data() {
    return {
      asset: [
        {
          icon: 'i-jinrixinzengzichanshu',
          name: '今日新增资产数',
          number: 16,
        },
        {
          icon: 'i-jinribiangengzichanshu',
          name: '今日变更资产数',
          number: 16,
        },
        {
          icon: 'i-7rixinzengzichanshu',
          name: '7 日新增资产数',
          number: 16,
        },
        {
          icon: 'i-7ribiangengzichanshu',
          name: '7 日变更资产数',
          number: 16,
        },
      ],
    }
  },
  computed: {
  },
  watch: {

  },
  methods: {

  },

}
</script>

<style lang="scss" module>
.memberAssets {
  display: flex;
  width: 100%;
  margin-top: 16px;
}

.map {
  flex: 1;
  height: 427px;
  margin-right: 16px;
}

.assetStatistics {
  width: 287px;
  height: 427px;

  .title {
    margin: 20px 0 16px 16px;
    font-weight: bold;
    font-size: 16px;
  }
}

.square {
  // align-items: center;
  width: 254px;
  height: 75px;
  margin: auto;
  margin-bottom: 16px;
  background-color: rgb(245, 247, 251);
}

.bock {
  display: flex;
  align-items: center;
  height: 100%;
  // background-color: rosybrown;
  // margin: 0 auto;

  .icon {
    margin-left: 20px;
    color: #2c73ef;
    font-size: 22px;
  }

  .name {
    margin-left: 12px;
    font-size: 14px;
  }

  .number {
    margin-left: 62px;
    font-weight: bold;
    font-size: 22px;
  }
}
</style>
