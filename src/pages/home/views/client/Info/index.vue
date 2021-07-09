<!-- 描述 -->
<template>
  <IChooser
    :fetch="fetch"
    :args="[route.params.id]"
    class="el-card"
  >
    <!-- 顶部按钮栏（编辑、删除、分配） -->
    <IBar
      v-show="type==='info'"
      @edit="jump('edit')"
      @del="onDel"
      @distribute="visible = true"
    />
    <ElDivider />
    <!-- 展示是详情还是编辑、新建 -->
    <KeepAlive>
      <IInfo
        v-if="type === 'info'"
        :data="form"
      />
      <IForm
        v-else
        v-loading="isSave"
        :data="form"
        :getsellman="sellMan"
        :getprovider="provider"
        @save="save"
        @cancel="cancel"
      />
    </KeepAlive>
    <!-- 相关订单、相关工单、待处理安全事件表格 -->
    <KeepAlive>
      <div v-if="type === 'info'">
        <IOrder :id="id" />
        <WorkOrder :id="id" />
        <!-- <IEvent :id="id" /> -->
      </div>
    </KeepAlive>

    <!-- 分配弹框 -->
    <ElDialog
      title="分配"
      width="30%"
      :visible.sync="visible"
    >
      <ElForm :model="form">
        <ElFormItem
          label="请分配销售人员："
          label-width="150px"
        >
          <ElSelect
            v-model="form.sellMan"
            value-key="id"
            clearable
            placeholder="请选择"
            :popper-append-to-body="false"
          >
            <ElOption
              v-for="item in sellMan"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="请分配云服务商："
          label-width="150px"
        >
          <ElSelect
            v-model="form.provider"
            multiple
            value-key="id"
            clearable
            placeholder="请选择"
            :popper-append-to-body="false"
          >
            <ElOption
              v-for="item in provider"
              :key="item.id"
              :label="item.providerName"
              :value="item"
            />
          </ElSelect>
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElButton
          type="primary"
          @click="onDistribute"
        >
          确定
        </ElButton>

        <ElButton @click="visible = false">
          取消
        </ElButton>
      </template>
    </ElDialog>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import IChooser from '@com/ChooserAsyncFunctional'
import IBar from './Bar'
import IInfo from './Info'
import IForm from './Form'
import IOrder from './Order'
import WorkOrder from './WorkOrder'
// import IEvent from './Event'
import { trim } from '@/pipe'

import {
  selectClientInfo,
  getProvider,
  addClient,
  delClient,
  updClient,
  allocationSellMan,
  allocationProvider,
} from '@/api/sell/client'
import { getSellMan } from '@/api/authServer/user'
import clone from '@/utils/clone'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
const whiteList = [
  'id',
  'customerNo',
  'department',
  'contacts',
  'phone',
  'keyStatus',
  'sellMan',
  'provider',
  'note',
  'modifyDate',
  'createDate',
]
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    route: { type: Object, required: true },
    type: { type: String, required: true },
  },
  // IOrder, WorkOrder, IEvent
  components: { IChooser, IBar, IInfo, IForm, IOrder, WorkOrder },
  data() {
    return {
      form: {},
      isSave: false,
      visible: false, // 控制弹框显示
      // 两个下拉框的值
      sellMan: [],
      provider: [],
    }
  },
  computed: {
    id() {
      return (this.route as IRoute).params.id
    },
  },
  methods: {
    async fetch(id: string) {
      if (this.type === 'add') {
        this.form = {}
        return 1
      }

      const sendForm = (await selectClientInfo(id)).data.body || {}
      Array.isArray(sendForm.sellMan) && (sendForm.sellMan = sendForm.sellMan[0])
      this.form = trim(sendForm, whiteList)

      return this.form
    },

    // 删除
    async onDel() {
      const id = this.id
      const data = this.form
      await this.$confirm(
        `此操作不可逆, 确定要删除客户编号为【${data.customerNo}】的客户？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      // 这里跳转表格页
      await delClient(id)
      this.$notify.warning('删除客户成功')
      this.up(true)
      // this.$notify({
      //   type: 'success',
      //   message: '删除客户成功',
      //   onClose: () => {
      //     this.up(true)
      //   },
      // })
    },
    // 分配
    async onDistribute() {
      const params = clone(this.form)
      params.sellMan = [params.sellMan]
      await allocationProvider(params)
      await allocationSellMan(params)
      this.$notify.success('分配成功')
      this.visible = false
      // 刷新当前页
      this.refresh()
    },
    // 保存
    async save(form: IObject) {
      this.isSave = true
      const params = clone(form)
      params.sellMan = [params.sellMan]
      if (this.type === 'add') {
        await addClient(params)
        this.$notify.success('新增成功，请10分钟后再尝试使用该客户登陆')
        this.up(true)
        // this.$notify({
        //   type: 'success',
        //   message: '新增成功',
        //   onClose: () => {
        //     this.up(true)
        //   },
        // })
      } else {
        delete params.password
        await updClient(params)
        this.form = params
        this.$notify.success('修改成功')
        this.up(true)
        // this.$notify({
        //   type: 'success',
        //   message: '修改成功',
        //   onClose: () => {
        //     this.up(true)
        //   },
        // })
      }
      // await (this.type === 'add' ? addClient : updClient)(form)
      // TODO
    },
    // 取消
    cancel() {
      this.up(true)
    },
  },
  created() {
    // 请求云服务商信息
    getProvider().then(res => {
      this.provider = res.data.body
    })
    // 请求销售负责人信息
    getSellMan().then(res => {
      this.sellMan = res.data.body
    })
  },
}
</script>
