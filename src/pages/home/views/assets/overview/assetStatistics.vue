<!-- 描述 -->
<template>
  <div class="el-card">
    <div :class="$style.title">
      资产相关统计
    </div>
    <div :class="$style.square">
      <div
        v-for="(item,index) in statistics"
        :key="index"
        :class="index===0?$style.middleLeft:$style.middle"
      >
        <div :class="$style.list">
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
</template>

<script lang="ts">
// @ts-nocheck

export default {
  props: {
  },
  components: {

  },
  data() {
    return {
      statistics: [
        {
          name: '资产总数',
          icon: 'i-zichanzongshu',
          number: 11,
        },
        {
          name: '服务器总数/台',
          icon: 'i-fuwuqi',
          number: 15,
        },
        {
          name: '业务系统总数/台',
          icon: 'i-xitongzongshu',
          number: 120,
        },
        {
          name: '安全设备总数/台',
          icon: 'i-anquanzichanzongshu',
          number: 1120,
        },
        {
          name: '其他资产总数/台',
          icon: 'i-anquanzichanzongshu',
          number: 12,
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
.title {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 16px;
  color: $colorTextMain;
  font-weight: bold;
  font-size: 16px;
}

.square {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  .middleLeft {
    flex: 1;
    margin: 0 16px;
  }

  .middle {
    flex: 1;
    margin-right: 16px;
  }
}

.list {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;
  background: rgba(78, 122, 199, 0.05);

  .icon {
    margin: 0 16px;
    color: #2c73ef;
    font-size: 20px;
  }

  .name {
    color: $colorTextMain;
    font-size: 14px;
  }

  .number {
    position: absolute;
    right: 16px;
    color: $colorTextMain;
    font-weight: bold;
    font-size: 24px;
  }
}

</style>
