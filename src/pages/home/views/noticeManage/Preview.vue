<!-- 预览dialog-->
<template>
  <ElDialog
    :visible="visible"
    width="80%"
    height="80%"
    :title="'通报预览'"
    @close="close"
  >
    <div :class="$style.type">
      通报类型:<span>{{ CIRCULARTYPE[data.circularType] }}</span>
    </div>
    <ElScrollbar :class="$style.content">
      <div :class="$style.noticeInfo">
        <h3>{{ data.title }}</h3>
        <div v-html="data.content" />
      </div>
    </ElScrollbar>
  </ElDialog>
</template>
<script lang="ts">
// @ts-nocheck
import getCode from '@/enums/code'
const CIRCULARTYPE = getCode('1', 'SYS_CIRCULAR_TYPE')
export default {
  props: {
    visible: { type: Boolean },
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    CIRCULARTYPE: () => CIRCULARTYPE.value,
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
  },
}
</script>
<style lang="scss" module>
.type {
  margin-bottom: 24px;
  color: #333;
  font-size: 14px;
}

.noticeInfo {
  line-height: 30px;

  div {
    padding: 20px 0;
  }

  h3 {
    text-align: center;
  }
}

.content {
  height: 500px;
  background-color: #f2f4f8;
}
</style>
