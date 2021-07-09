<!-- 描述 -->
<template>
  <IChooser
    :fetch="fetch"
    :args="[route.params.id]"
    :class="'el-card ' + $style.wrapper"
  >
    <template #success="{ data: { data = {}, body } }">
      <h4>基本信息</h4>
      <ElRow>
        <ElCol :span="8">
          <label>日志名称：</label>
          <span>{{ (body = (data.detail && data.detail.body) || {}).log_name }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>发生时间：</label>
          <span>{{ body.log_time }}</span>
        </ElCol>
        <ElCol :span="8">
          <label>日志级别：</label>
          <span :class="getLogLevel(body).class">{{ body.log_level }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>处理动作：</label>
          <span>{{ body.action }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>日志类型：</label>
          <span>{{ body.log_type }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>日志子类型：</label>
          <span>{{ body.log_sub_type }}</span>
        </ElCol>
      </ElRow>

      <h4>源IP信息</h4>
      <ElRow>
        <ElCol :span="8">
          <label>用户名称：</label>
          <span>{{ (body.src_ip_info || (body.src_ip_info = {})).asset_user_name }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>源IP：</label>
          <span>{{ (body.src_ip_info || (body.src_ip_info = {})).ip }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>源端口：</label>
          <span>{{ body.src_ip_info.port }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>资产名称：</label>
          <span>{{ (body.src_ip_info || (body.src_ip_info = {})).asset_name }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>资产类型：</label>
          <span>{{ (body.src_ip_info || (body.src_ip_info = {})).asset_type }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>业务系统名称：</label>
          <span>{{ (body.src_ip_info || (body.src_ip_info = {})).service_name }}</span>
        </ElCol>
      </ElRow>

      <h4>目的IP信息</h4>
      <ElRow>
        <ElCol :span="8">
          <label>用户名称：</label>
          <span>{{ (body.dst_ip_info || (body.dst_ip_info = {})).asset_user_name }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>目的IP：</label>
          <span>{{ (body.dst_ip_info || (body.dst_ip_info = {})).ip }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>源端口：</label>
          <span>{{ body.dst_ip_info.port }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>资产名称：</label>
          <span>{{ (body.dst_ip_info || (body.dst_ip_info = {})).asset_name }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>资产类型：</label>
          <span>{{ (body.dst_ip_info || (body.dst_ip_info = {})).asset_type }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>业务系统名称：</label>
          <span>{{ (body.dst_ip_info || (body.dst_ip_info = {})).service_name }}</span>
        </ElCol>
      </ElRow>

      <h4>日志来源信息</h4>
      <ElRow>
        <ElCol :span="8">
          <label>产品名称：</label>
          <span>{{ data.product }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>云平台：</label>
          <span>{{ data.detail.body.data_src_region }}</span>
        </ElCol>

        <ElCol :span="8">
          <label>网络区域：</label>
          <span>{{ NETWORK_AREA[data.detail.body.data_src_sub_region] }}</span>
        </ElCol>
      </ElRow>

      <h4>原始日志</h4>
      <!-- content -->
      <IChooser
        key="log"
        tag="pre"
        :fetch="log"
        :args="[{ orilogUuid: body.org_log_id, seclogUuid: route.params.id }]"
        :class="$style.log"
      >
        <template #success="{ data: { data: { body: logBody = {} } } }">
          <ElRow>
            <ElCol :span="20">
              <label>类型：</label>
              <span>{{ logBody.logDetail.body.type_name }}</span>
            </ElCol>

            <ElCol :span="20">
              <label>内容：</label>
              <span>{{ logBody.logDetail.body.content }}</span>
            </ElCol>
          </ElRow>
        </template>
      </IChooser>
    </template>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
import IChooser from '@com/ChooserAsyncFunctional'
import getCode from '@/enums/code'
import { selectInfo, log } from '@/api/servicePlatform/safety'
import { getLogLevel } from './enums'
const NETWORK_AREA = getCode('1', 'NETWORK_AREA')

export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: { route: { type: Object, required: true } },
  components: { IChooser },
  computed: { NETWORK_AREA: () => NETWORK_AREA.value },
  methods: {
    log,
    fetch: selectInfo,
    getLogLevel,
    getAssetTypeName(type: string) {
      switch (type) {
        case 'Server':
          return '服务器'
        case 'Workstation':
          return '工作站'
        case 'Router':
          return '路由器'
        default:
          return type
      }
    },
    format(detail: any) {
      detail = detail?.body || {}
      let result = '类型：' + (detail.type_name || '') + '\n 内容：'
      try {
        result += JSON.parse(detail.content || '').detail.eventDescription
      } catch (error) {}
      return result
    },
  },
}
</script>

<style lang="scss" module>
.wrapper {
  h4 {
    margin: $gapNormal / 2 0;
    color: $colorTextMain;
    font-size: $larger;

    &:first-of-type {
      margin-top: 0;
    }
  }

  label {
    display: inline-block;
    width: 125px - $gapNormal / 2;
    margin: $gapNormal / 2 0;
    padding-right: $gapNormal / 2;
    text-align: right;
  }
}

.log {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
