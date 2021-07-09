<template>
  <!-- 右侧申请服务 -->
  <div :class="$style.rightSty">
    <!-- <ElButton @click="applyServ">
      申请服务
    </ElButton> -->
    <h5 :class="$style.title">
      该应用下的资产
    </h5>
    <div

      :class="$style.ipList"
    >
      <p
        v-for="(item,index) in assetsData"
        :key="index"
      >
        <i v-if="index<9">{{ 0+`${index+1}` }}</i>
        <i v-if="index>=10">{{ index }}</i>
        <span>{{ item }}</span>
      </p>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { getAssetsList } from '@/api/servicePlatform/SecurityService'
// import { toDetail } from '@/api/workflow/workflow'
export default {

  props: {
    serviceType: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      assetsData: [],

    }
  },
  methods: {

    getAssetsList(applicationId) {
      getAssetsList({ applicationId: applicationId }).then(res => {
        if (res.data.body.length > 0) {
          this.assetsData = res.data.body
        }
      })
    },
  },

}

</script>

<style lang="scss" module>

.rightSty {
  height: 300px;
  margin-left: 20px;
  padding: 20px 10px 20px 30px;
  padding-left: 30px;
  color: #333;
  font-size: 12px;
  border-left: 1px solid #ebeef5;

  .ipList {
    height: 80%;
    overflow: auto;

    span {
      display: inline-block;
      color: #333;
      font-weight: 400;
      font-size: 14px;
      font-family: Microsoft YaHei;
      line-height: 22px;
    }

    p {
      display: flex;
      align-self: center;
      justify-content: flex-start;
    }

    i {
      display: inline-block;
      margin-right: 22px;
      color: #3273c4;
      font-weight: 400;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-style: normal;
    }
  }
}

.title {
  display: inline-block;
  margin-top: 0;
  padding-bottom: 0;
  color: #333;
  font-weight: bold;
  font-size: 14px;
  font-family: Microsoft YaHei;
}

</style>
