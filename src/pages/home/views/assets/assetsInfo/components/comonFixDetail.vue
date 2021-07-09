<template>
  <div>
    <div>
      <div :class="$style.column">
        <div :class="$style.name">
          责任人
        </div>
        <div
          :class="$style.customData"
          :title="form.dutyList&&form.dutyList.join()"
        >
          {{ form.dutyList&&form.dutyList.join() }}
        </div>
      </div>
    </div>
    <div>
      <div :class="$style.column">
        <div :class="$style.name">
          使用人
        </div>
        <div
          :class="$style.customData"
          :title="form.usrList&&form.usrList.join()"
        >
          {{ form.usrList&&form.usrList.join() }}
        </div>
      </div>
    </div>
    <div>
      <div :class="$style.column">
        <div :class="$style.name">
          所属人
        </div>
        <div
          :class="$style.customData"
          :title="form.ownerList&&form.ownerList.join()"
        >
          {{ form.ownerList&&form.ownerList.join() }}
        </div>
      </div>
    </div>
    <div>
      <div :class="$style.column">
        <div :class="$style.name">
          所属单位
        </div>
        <div
          :class="$style.customData"
          :title="form.belongCompanyIdName"
        >
          {{ form.belongCompanyIdName }}
        </div>
      </div>
    </div>
    <div>
      <div :class="$style.column">
        <div :class="$style.name">
          备注
        </div>
        <div
          :class="$style.customData"
          :title="form.description"
        >
          {{ form.description }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck

export default {
  props: {
    form: { type: Object, required: true },
  },

}
</script>
<style lang="scss" module>
.aLine {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 16px;
}

.column {
  display: flex;

  .name {
    display: flex;
    align-items: center;
    width: 130px;
    height: 38px;
    margin-bottom: -1px;
    padding-left: 10px;
    background-color: rgb(244, 246, 251);
    border: 1px solid #e9e9e9;
  }

  .customData {
    // display: flex;
    // align-items: center;
    width: 260px;
    margin-right: -1px;
    margin-bottom: -1px;
    margin-left: -1px;
    padding-left: 10px;
    overflow: hidden; //隐藏
    line-height: 38px;
    white-space: nowrap; //文本不进行换行
    text-overflow: ellipsis;  //显示省略符号来代表被修剪的文本
    word-wrap: normal;    //保持默认处理
    word-break: keep-all;  //中英文不断词
    border: 1px solid #f0f0f0;
  }
}
</style>
