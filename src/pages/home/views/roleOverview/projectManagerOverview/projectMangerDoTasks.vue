<template>
  <div :class="$style.myDoTask">
    <span :class="$style.title"> 我的待办</span>
    <div :class="$style.peripheral">
      <div
        v-for="(item, index) in titleName"
        :key="index"
        :class="$style.max"
      >
        <div :class="$style.box">
          <div :class="$style.modular">
            <i
              :class="item.icon"
              style="
                margin-right: 16px;
                color: #d5402b;
                font-weight: 560;
                font-size: 22px;
"
            />
            <div>
              <div :class="$style.name">
                {{ item.name }}
              </div>
              <div
                :class="$style.number"
                @click="clickJump(item)"
              >
                {{ item.number }}
              </div>
            </div>
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
    titleName: {
      type: Array,
      default: Array,
    },
  },
  components: {},
  data() {
    return {}
  },
  computed: {},
  methods: {
    clickJump(item: any) {
      if (item.name === '待办任务') {
        this.$router.push({
          path: 'taskManagement',
        })
      } else if (item.name === '待处理安全事件') {
        this.$router.push({
          path: 'securityIncident',
        })
      } else if (item.name === '处理中安全事件') {
        this.$router.push({
          path: 'securityIncident',
        })
      }
    },
  },
}
</script>

<style lang="scss" module>
.title {
  font-weight: bold;
  font-size: 16px;
}

.card {
  width: 100%;
  height: 100%;
}

.peripheral {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  width: 100%;
  height: 204px;
}

.max {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 110;
}

.modular {
  display: flex;
}

.number {
  font-size: 28px;
  cursor: pointer;
}

.name {
  display: flex;
  flex-wrap: wrap;
  width: 128px;
  height: 44px;
  color: #333;
  font-size: 16px;
}

.myDoTask {
  box-sizing: border-box;
  height: 280px;
  padding: $gapNormal;
  background-color: #fff;
  border-radius: 10px;
}
</style>
