<!-- 描述 -->
<template>
  <ElDialog
    :visible.sync="visible"
    append-to-body
    title="选择漏洞扫描任务关联的用户"
    width="380px"
    @close="close"
  >
    <ElRow>
      <ElCol :span="24">
        <ElSelect
          v-model="userId"
          filterable
          style="width: 100%;"
          :popper-append-to-body="false"
          placeholder="请选择"
        >
          <ElOption
            v-for="item in reUserObjects"
            :key="item.userId"
            :label="item.department"
            :value="item.userId"
          />
        </ElSelect>
      </ElCol>
    </ElRow>
    <!-- <ElRow>
      <ElCol :span="24">
        <div :class="$style.desBox">
          <ITable
            :query="gQuery"
            :get="uesrAsset"
            :head="head"
          />
        </div>
      </ElCol>
    </ElRow> -->
    <span
      slot="footer"
      class="dialog-footer"
    >
      <ElButton @click="close">取 消</ElButton>
      <ElButton
        type="primary"
        @click="relationUserFn"
      >确定关联</ElButton>
    </span>
  </ElDialog>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import {
  terminalUesr,
  vulnTaskRelationUser,
  // uesrAsset,
} from '@/api/servicePlatform/operat'

// import ITable from '@com/Table'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    vulnId: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  // components: { ITable },
  data() {
    return {
      reUserObjects: [],
      userId: '',
      showUesrAsset: [],
    }
  },
  // computed: {
  //   gQuery() {
  //     return { userId: this.userId }
  //   },
  //   uesrAsset() {
  //     return uesrAsset
  //   },
  //   head() {
  //     return [
  //       {
  //         prop: 'ciName',
  //         label: '资产名称',
  //       },
  //       {
  //         prop: 'ciType',
  //         label: '资产类型',
  //       },

  //     ]
  //   },
  // },
  methods: {
    // 接受关联对象列表
    getObject(this: any) {
      terminalUesr({}).then(res => {
        this.reUserObjects = res.data.body
      })
    },
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
      this.userId = ''
    },
    // 确定关联函数
    relationUserFn() {
      if (this.userId) {
        vulnTaskRelationUser({
          userId: this.userId,
          vulnId: this.vulnId,
        }).then(res => {
          if (res.status) {
            this.$notify.success('关联成功啦')
            this.$emit('success')
            this.$emit('update:visible', false)
            this.userId = ''
            this.$router.go(0)
          } else {
            this.$message.error('服务异常,请稍后再试')
          }
        })
      } else {
        this.$message.warning('请选择关联的用户！')
      }
    },
  },
  created(this: any) {
    this.getObject()
  },
}
</script>

<style lang="scss" module>
.desSty {
  display: inline-block;
  padding: 5px 10px;
  color: #333;
  font-size: 12px;
}

.desBox {
  max-height: 100px;
  margin-top: 12px;
  overflow: auto;
}
</style>
