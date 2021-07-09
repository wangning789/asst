<!-- eslint-disable vue/no-v-html -->
<template>
  <IChooser
    v-loading="isSaving"
    :fetch="fetch"
    :args="[route.params.id, route.fullPath]"
    class="el-card"
  >
    <!-- 工具条 -->
    <div :class="$style.bar">
      <h4>公告详情</h4>
      <div :class="$style.fr">
        <RouterLink
          v-show="be === 'detail'"
          class="el-button el-button--text"
          :to="`edit`"
        >
          <i class="i-bianji" /> 编辑
        </RouterLink>

        <ElButton
          v-show="be !== 'add'"
          type="text"
          icon="i-shanchu1"
          @click="delServe"
        >
          删除
        </ElButton>
      </div>
    </div>

    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        label-position="right"
        inline
        :model="form"
        :disabled="display"
      >
        <ElFormItem
          label="公告级别："
          prop="noticeLevel"
          :rules="{
            required: be !== 'detail',
            message: '请输入公告名称',
            trigger: 'change',
          }"
        >
          <ElSelect
            v-model="form.noticeLevel"
            placeholder="请选择"
            clearable
          >
            <ElOption
              v-for="(item, index) in noticeLevels"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="公告类型："
          prop="noticeType"
          :rules="{
            required: be !== 'detail',
            message: '请选择公告类型',
            trigger: 'change',
          }"
        >
          <ElSelect
            v-model="form.noticeType"
            placeholder="请选择"
            clearable
            @change="noticeTypeChange"
          >
            <ElOption
              v-for="(item, index) in noticeTypes"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="公开范围："
          prop="openStatus"
          :rules="{
            required: be !== 'detail',
            message: '请选择公开范围',
            trigger: 'change',
          }"
        >
          <ElSelect
            v-model="openStatus"
            placeholder="请选择"
            :disabled="isDisabled"
            clearable
          >
            <ElOption
              v-for="(label, value) in STATUS"
              :key="value"
              :label="label"
              :value="value"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          v-if="openStatus === '0'"
          label="接收对象："
          prop="departmentDTOList"
          :rules="objRules"
          multiple
        >
          <ElSelect
            v-model="form.departmentDTOList"
            placeholder="请选择"
            value-key="userId"
            :disabled="isDisabled"
            multiple
            clearable
          >
            <ElRow>
              <ElCol :span="12">
                <ElButton
                  style="width: 100%;"
                  @click="allChoice"
                >
                  全选
                </ElButton>
              </ElCol>
              <ElCol :span="12">
                <ElButton
                  style="width: 100%;"
                  @click="cancelChoice"
                >
                  取消全选
                </ElButton>
              </ElCol>
            </ElRow>

            <ElOption
              v-for="(item, index) in objects"
              :key="index"
              :label="item.organizationName"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem
          label="生效时间："
          prop="takeEffectTime"
          :rules="{
            required: be !== 'detail',
            message: '请选择生效时间',
            trigger: 'change',
          }"
        >
          <ElDatePicker
            v-model="form.takeEffectTime"
            clearable
            type="datetime"
            placeholder="请选择"
            :format="DATE_TIME.dateTime"
            :value-format="DATE_TIME.serverDateTime"
          />
        </ElFormItem>

        <h4>
          公告内容
          <span
            v-if="openStatus === '1'"
            :class="$style.tip"
          />
        </h4>
        <ElFormItem
          label="公告标题："
          prop="title"
          :rules="{
            required: be !== 'detail',
            message: '请输入公告标题',
            trigger: 'change',
          }"
        >
          <ElInput
            v-model.lazy.trim="form.title"
            show-word-limit
            placeholder="请输入公告标题"
            :maxlength="CONFIG.maxLength"
            :class="$style.wide"
          />
        </ElFormItem>

        <ElFormItem
          label="公告内容："
          prop="content"
          :rules="checkContent"
          :class="$style.content"
        >
          <div
            v-if="be === 'detail'"
            id="textA"
            class="common_rich_text_des_disable"
            v-html="form.content"
          />
          <Editor
            v-else
            id="textA"
            :value="form.content"
            :data="be"
            @paretnVisibleChange="form.content = $event"
          />
        </ElFormItem>
      </ElForm>

      <div :class="$style.center">
        <ElButton
          v-if="be === 'add'"
          type="primary"
          @click="save"
        >
          新建
        </ElButton>

        <ElButton
          v-if="be === 'edit'"
          type="primary"
          @click="save"
        >
          保存
        </ElButton>

        <ElButton @click="up()">
          取消
        </ElButton>
      </div>
    </div>
  </IChooser>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ElDatePicker from 'element-ui/lib/date-picker'
import IChooser from '@com/ChooserAsyncFunctional'
import Editor from '@com/RichText'

import { DATE_TIME } from '@/enums/format'
import { hasCN } from '@/functions/validators'
import { isNullish } from '@/utils'
import {
  noticeDetail,
  noticeSave,
  noticeEdit,
  noticeDel,
  STATUS,
} from '@/api/servicePlatform/notice'
import { getOrganizationInfo } from '@/api/systemManage/organization'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: { IChooser: IChooser as any, ElDatePicker, Editor },
  data() {
    return {
      display: false,
      isSaving: false,
      centerDialogVisible: false,
      form: { departmentDTOList: [] },
      params: {},
      objects: [],
      oldSearchBankType: [],
      isDisabled: false,
    }
  },
  computed: {
    STATUS: () => STATUS,
    DATE_TIME: () => DATE_TIME,
    openStatus: {
      get() {
        const openStatus = this.form.openStatus
        return isNullish(openStatus) ? '' : openStatus + ''
      },
      set(openStatus) {
        this.$set(
          this.form,
          'openStatus',
          openStatus === '' ? openStatus : +openStatus
        )
      },
    },
    objRules() {
      return {
        required: this.form.noticeType !== '3' && this.be !== 'detail',
        message: '请输入接收对象',
        trigger: 'change',
      }
    },
    noticeLevels: () => [
      {
        label: '紧急',
        value: '0',
      },
      {
        label: '普通',
        value: '1',
      },
    ],
    noticeTypes: () => [
      {
        label: '平台公告',
        value: '1',
      },
      {
        label: '安全资讯',
        value: '2',
      },
    ],
    checkContent() {
      return {
        required: this.be !== 'detail',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          value = this.form.content
          if (!value) {
            return callback(new Error('请输入公告内容'))
          }

          if (/<(?:img|a)/.test(value)) {
            return callback()
          }

          try {
            hasCN(value)
            callback()
          } catch (error) {
            callback(new Error('公告内容必须至少包含中文、图片、附件之一'))
          }
        },
      }
    },
  },
  methods: {
    noticeTypeChange() {
      // console.log(this.form)
      if (this.form.noticeType === '3') {
        this.openStatus = '0'
        this.form.departmentDTOList = null
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
    },
    allChoice() {
      const array =
        this.objects &&
        this.objects.length &&
        this.objects.map((item) => {
          return item.id
        })
      this.form.departmentDTOList = array
    },
    cancelChoice() {
      // 重置为空
      this.form.departmentDTOList = []
    },
    save(this: any) {
      const data = this.form
      data.createDate = null
      data.modifyDate = null
      data.deleteDate = null
      const departmentDTOList = []
      data.departmentDTOList &&
        data.departmentDTOList.length &&
        data.departmentDTOList.forEach((element) => {
          element.id && departmentDTOList.push(element.id)
        })
      if (departmentDTOList.length) {
        data.departmentDTOList = departmentDTOList
      }
      if (this.form.content) {
        if (this.form.content.match(/fileId=(\S*)"/gim)) {
          const fileIds = this.form.content
            .match(/fileId=(\S*)"/gim)
            .join('=')
            .replace(/fileId=/g, '')
            .replace(/"/g, '')
            .split('=')
          data.fileIds = fileIds.join(',')
        }
      }
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          ;(data.id ? noticeEdit : noticeSave)(data).then(() => {
            this.up(true)
            this.$notify.success('操作成功')
          })
        }
      })
    },
    async fetch(this: any, id?: string) {
      if (!id) {
        return 1
      }
      const data = (await noticeDetail({ id: id })).data.body
      if (data.noticeType === '3') {
        this.isDisabled = true
      }
      this.display = (this as any).be === 'detail'
      return (this.form = data)
    },
    // 删除服务
    async delServe(this: any) {
      const data = this.form
      await this.$confirm(
        `此操作不可逆, 确定要删除公告【${data.title}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      )
      this.isSaving = true
      try {
        await noticeDel({ id: data.id })
      } catch (error) {
        this.isSaving = false
        return
      }
      this.isSaving = false
      this.up(true)
      this.$notify.success(`删除公告【${data.title}】成功`)
    },
    // 接收对象列表
    // getObject() {
    //   listCustomer({}).then(res => {
    //     this.objects = res.data.body
    //   })
    // },
    async fetchOrganization() {
      this.objects = Object.freeze(
        (await getOrganizationInfo()).data.body || []
      )
    },
  },
  created() {
    // this.getObject()
    this.fetchOrganization()
  },
}
</script>

<style lang="scss">
@import '~element-ui/packages/theme-chalk/src/date-picker';
</style>

<style lang="scss" module>
.contentBox {
  width: $widthPage;
  margin: 0 auto;
}

.content :global {
  .tox-tinymce {
    min-height: 250px;
    border-radius: $borderRadiusBase;
  }

  .tox-editor-container {
    border-radius: $borderRadiusBase $borderRadiusBase 0 0;
  }

  .tox-statusbar {
    border-radius: 0 0 $borderRadiusBase $borderRadiusBase;
  }
}

.wide,
.content :global(.tox-tinymce) {
  width: $widthPage - $gapNormal * 2 - 125px !important;
}

.content:global(.is-error .tox-tinymce) {
  border-color: $colorDanger;
}

.bar {
  margin-bottom: $gapNormal;
  border-bottom: $borderBase;

  > h4 {
    display: inline-block;
    margin: 0 0 $gapNormal / 2 0;
    font-size: $larger;
  }

  :global(.el-button--text) {
    padding-top: 0;
    color: $colorTextCommon;

    &:hover {
      color: $colorTheme;
    }
  }
}

.content :global(#textA) {
  // stylelint-disable-next-line scss/at-extend-no-missing-placeholder
  @extend .wide;

  max-height: 300px;
  overflow-y: auto;
}

.fr {
  float: right;
}

.center {
  text-align: center;
}

.tip {
  color: $colorTextMinor;
  font-weight: normal;
  font-size: $small;
}
</style>
