<template>
  <div :class="$style.noticeWrap">
    <div :class="$style.box">
      <span>公告</span>
      <div
        :class="$style.name"
        @click="click"
      >
        查看更多
      </div>
    </div>
    <div :class="$style.doc">
      <div
        v-for="(item, index) in announcements"
        :key="index"
        :class="$style.transverse"
      >
        <ElBadge
          v-if="item.readCount === 0"
          :class="$style.icon"
        >
          <div :class="$style.emailIcon">
            <i class="i-youxiang" />
          </div>
        </ElBadge>
        <div
          v-if="item.readCount > 0"
          :class="$style.icon"
        >
          <div :class="$style.emailIcon">
            <i class="i-youxiang" />
          </div>
        </div>
        <div
          v-if="item.noticeType === '1'"
          :class="$style.notification"
        >
          <div
            :class="$style.tag"
            size="medium"
          >
            平台公告
          </div>
        </div>
        <div
          v-if="item.noticeType === '2'"
          :class="$style.notification"
        >
          <ElTag
            type="success"
            size="medium"
          >
            安全资讯
          </ElTag>
        </div>
        <div
          v-if="item.noticeType === '0'"
          :class="$style.notification"
        >
          <ElTag
            type="info"
            size="medium"
          >
            其他公告
          </ElTag>
        </div>
        <div
          :class="$style.title"
          @click="clickdie(item)"
        >
          {{ item.title }}
        </div>
        <div :class="$style.time">
          {{ item.takeEffectTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
export default {
  props: {
    announcements: {
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
    clickdie(val: any) {
      this.$router.push({
        path: `notice/${val.id}/detail`,
      })
    },
    click() {
      this.$router.push({
        path: 'notice',
      })
    },
  },
}
</script>
<style lang="scss" module>
.noticeWrap {
  box-sizing: border-box;
  // height: 376px;
  padding: $gapNormal;
  background-color: #fff;
  border-radius: 10px;
}

.box {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: $smaller;

  span {
    color: #333;
    font-weight: bold;
    font-size: 16px;
  }

  div {
    color: #5084cb;
    font-size: 12px;
  }
}

.doc {
  display: flex;
  flex-direction: column;
  height: 204px;
}

.transverse {
  display: flex;
  align-items: center;
  height: 40px;
  font-size: $smaller;
}

.transverse:not(:last-child) {
  border-bottom: 1px solid #f2f4f8;
}

.icon {
  margin-right: $gapNormal;

  .emailIcon {
    width: 18px;
    height: 14px;
  }
}

.notification {
  margin-right: $gapNormal;
}

.time {
  display: flex;
  min-width: 120px;
  height: 30px;
  margin-left: auto;
  font-size: $smaller;
  line-height: 30px;
}

.tag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: $gapNormal;
  color: #409eff;
  font-size: 12px;
  background-color: rgb(236, 245, 255);
  border: 1px solid rgba(166, 206, 227, 0.5);
  border-radius: 10%;
}

.title {
  overflow: hidden; //隐藏
  font-size: 12px;
  white-space: nowrap; //文本不进行换行
  text-overflow: ellipsis;  //显示省略符号来代表被修剪的文本
  word-wrap: normal;    //保持默认处理
  word-break: keep-all;  //中英文不断词
}

.title:hover {
  cursor: pointer;
}

.name:hover {
  cursor: pointer;
}
</style>
