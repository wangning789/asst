<template>
  <IChooser
    :fetch="fetch"
    :args="[route.params.id, route.fullPath]"
    class="el-card"
  >
    <div :class="$style.bar">
      <h4>{{ route.meta.title }}</h4>
    </div>
    <div :class="$style.contentBox">
      <ElForm
        ref="form"
        label-position="right"
        :label-width="CONFIG.labelWidth"
        :model="form"
      >
        <ElFormItem
          label="通报类型："
          prop="circularType"
          :rules="{
            required: true,
            message: '请选择通报类型',
          }"
        >
          <ElSelect
            v-model="form.circularType"
            placeholder="请选择"
            :class="$style.wide"
            clearable
          >
            <ElOption
              v-for="(val, key) in CIRCULARTYPE"
              :key="key"
              :label="val"
              :value="key"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="通报对象："
          prop="circularUserIds"
          :rules="{
            required: true,
            message: '请选择通报对象',
          }"
          multiple
        >
          <ElSelect
            v-model="form.circularUserIds"
            :class="$style.wide"
            multiple
            filterable
            default-first-option
            placeholder="请选择通报对象"
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
              v-for="item in organizations"
              :key="item.id"
              :label="item.organizationName"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>

        <ElFormItem
          label="通报标题："
          prop="title"
          :rules="{
            required: true,
            message: '请输入通报标题',
            trigger: 'change',
          }"
        >
          <ElInput
            v-model.lazy.trim="form.title"
            show-word-limit
            placeholder="请输入通报标题"
            :maxlength="CONFIG.maxLength"
            :class="$style.wide"
          />
        </ElFormItem>

        <ElFormItem
          label="通报内容："
          prop="content"
          :rules="checkContent"
          :class="$style.content"
        >
          <Editor
            id="textA"
            :value="form.content"
            :data="be"
            @paretnVisibleChange="form.content = $event"
          />
        </ElFormItem>
        <!-- 通报类型为其他显示反馈选项 -->
        <template v-if="form.circularType === 'SYS_THREAT_OTHER_CIRCULAR'">
          <ElFormItem
            label="是否需要反馈："
            prop="isApproval"
            :rules="{
              required: true,
              message: '请选择',
              trigger: 'change',
            }"
          >
            <ElRadio
              v-model="form.isApproval"
              :label="1"
            >
              是
            </ElRadio>
            <ElRadio
              v-model="form.isApproval"
              :label="0"
            >
              否
            </ElRadio>
          </ElFormItem>
          <ElFormItem
            v-show="form.isApproval === 1"
            label="反馈方式："
            prop="feedbackType"
            :rules="{
              required: true,
              message: '请选择',
            }"
          >
            <ElCheckboxGroup v-model="form.feedbackType">
              <ElCheckbox
                v-for="(val, key) in FEEDBACKTYPE"
                :key="key"
                :label="key"
              >
                {{ val }}
              </ElCheckbox>
            </ElCheckboxGroup>
          </ElFormItem>
        </template>
      </ElForm>

      <div :class="$style.center">
        <ElButton
          v-if="!id"
          type="primary"
          @click="save"
        >
          发布通报
        </ElButton>
        <ElButton
          v-if="id"
          type="primary"
          @click="edit"
        >
          编辑
        </ElButton>

        <ElButton
          type="primary"
          @click="preview()"
        >
          预览
        </ElButton>

        <ElButton @click="cancel()">
          取消
        </ElButton>
      </div>
    </div>
    <IDialog
      :data="form"
      :visible.sync="visible"
    />
  </IChooser>
</template>
<script lang="ts">
// @ts-nocheck
import Editor from '@com/RichText'
import getCode from '@/enums/code'
import { decode } from '@/functions/cipher'
import IChooser from '@com/ChooserAsyncFunctional'

import { hasCN } from '@/functions/validators'
import {
  addCircular,
  getCircularAllDetail,
  updateCircular,
  getTwoLeverOrganizationInfo,
} from '@/api/noticeManage/noticeManage'
import IDialog from './Preview'
const CIRCULARTYPE = getCode('1', 'SYS_CIRCULAR_TYPE')
const FEEDBACKTYPE = getCode('1', 'SYS_FEEDBACK_TYPE')
export default {
  props: {
    route: { type: Object, required: true },
    be: { type: String, required: true },
  },
  components: { Editor, IDialog, IChooser },
  data() {
    return {
      form: {
        circularType: '',
        title: '',
        checkContent: '',
        isApproval: '',
        circularUserIds: [],
        feedbackType: [],
      },
      organizations: [],
      visible: false,
      id: this.$route.params.id,
    }
  },
  computed: {
    CIRCULARTYPE: () => CIRCULARTYPE.value,
    FEEDBACKTYPE: () => FEEDBACKTYPE.value,
    checkContent() {
      return {
        required: true,
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          value = this.form.content
          if (!value) {
            return callback(new Error('请输入通报内容'))
          }

          if (/<(?:img|a)/.test(value)) {
            return callback()
          }

          try {
            hasCN(value)
            callback()
          } catch (error) {
            callback(new Error('通报内容必须至少包含中文、图片、附件之一'))
          }
        },
      }
    },
  },
  methods: {
    async fetchOrganization() {
      this.organizations = Object.freeze(
        (await getTwoLeverOrganizationInfo()).data.body || []
      )
    },
    allChoice() {
      const array =
        this.organizations &&
        this.organizations.length &&
        this.organizations.map((item) => {
          return item.id
        })
      this.form.circularUserIds = array
    },
    cancelChoice() {
      // 重置为空
      this.form.circularUserIds = []
    },
    save() {
      const data = JSON.parse(JSON.stringify(this.form))
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          if (data.circularType !== 'SYS_THREAT_OTHER_CIRCULAR') {
            delete data.isApproval
            delete data.feedbackType
          } else if (!data.isApproval) {
            delete data.feedbackType
          } else {
            data.feedbackType = data.feedbackType.join(',')
          }
          addCircular(data).then(() => {
            this.$notify.success('操作成功')
            this.$router.replace('/noticeManage')
          })
        }
      })
    },
    edit() {
      const params = {
        id: this.form.id,
        circularType: this.form.circularType,
        circularUserIds: this.form.circularUserIds,
        title: this.form.title,
        content: this.form.content,
        feedbackCount: this.form.feedbackCount,
        feedbackNo: this.form.feedbackNo,
      }
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          updateCircular(params)
          this.$notify.success('编辑成功')
          this.$router.push('/noticeManage')
        }
      })
    },
    cancel() {
      this.$router.replace('/noticeManage')
    },
    preview() {
      ;(this.$refs.form as any).validate((valid: boolean) => {
        if (valid) {
          this.visible = true
        }
      })
    },
    async fetch(this: any, id?: string) {
      if (!id) {
        return 1
      }
      const data = (await getCircularAllDetail({ circularId: id })).data.body
      data.content = decode(data.content)
      return (this.form = data)
    },
  },
  created() {
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
