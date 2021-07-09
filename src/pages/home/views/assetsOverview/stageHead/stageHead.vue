<!-- 描述 -->
<template>
  <div class="head">
    <div
      v-for="(item, index) in appLicationSystem"
      :key="index"
      class="max"
    >
      <ElCard
        class="box-card"
        :class="index<3?'card':'cardRight'"
      >
        <div
          class="box"
          @click="jumpManagement(item, index)"
        >
          <div class="Photo">
            <div
              :class="item.icon"
              style="color: #d5402b; font-size: 30px;"
            />
          </div>
          <div>
            <div class="name">
              {{ item.name }}
            </div>
            <div
              class="number"
            >
              {{ number[index] }}
            </div>
          </div>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
export default {
  props: {
    tobalAssets: {
      type: Object,
      default: Object,
    },
  },
  components: {},

  data() {
    return {
      number: [],
      appLicationSystem: [
        {
          icon: 'i-zhujizongshu',
          name: '资产总数',
        },
        {
          icon: 'i-xitongzongshu',
          name: '应用系统',
        },
        {
          icon: 'i-fuwuqi',
          name: '服务器',
        },

        {
          icon: 'i-anquanchanpin',
          name: '安全产品',
        },
      ],
    }
  },
  computed: {},
  watch: {
    tobalAssets(val) {
      if (val) {
        this.number.push(val.allTypeAssetCount)
        this.number.push(val.businessAssetCount)
        this.number.push(val.hostAssetCount)
        this.number.push(val.securityAssetCount)
      }
    },
  },
  methods: {
    jumpManagement(item, index) {
      if (index > 0) {
        this.$router.push('assetsManage')
        sessionStorage.setItem('activeName', index - 1)
      }
    },
  },

}
</script>
<style scoped lang="scss">
.head {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .max {
    flex: 1;
  }
}

.card {
  margin-right: 24px;
}

.box {
  display: flex;
  justify-content: center;
}

.cardRight {
  margin-right: 20px;
}

.Photo {
  margin-right: 50px;
}

.number {
  margin-top: 15px;
  color: #333;
  font-size: 24px;
}

.name {
  margin-top: 5px;
  color: #333;
  font-size: 16px;
}

.name:hover {
  cursor: pointer;
}
</style>
