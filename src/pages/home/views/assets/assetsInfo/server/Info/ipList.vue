<!-- 描述 -->
<template>
  <ElForm
    ref="form"
    label-position="right"
    label-width="120px"
    inline
    :model="form"
  >
    <ElFormItem label="IP信息：">
      <div :class="$style.tableWrap">
        <ElTable
          ref="table"
          :data="form.ipList"
          :class="$style.table"
        >
          <ElTableColumn
            prop="type"
            width="260"
          >
            <template #header>
              <span :class="$style.danger">* </span>
              <span> 内网/互联网</span>
            </template>
            <template #default="scope">
              <ElFormItem
                :prop="'ipList[' + scope.$index + '].type'"
                :class="$style.formItem"
                :rules="{
                  required: true,
                  message: '请选择网络类型',
                  trigger: 'change',
                }"
              >
                <ElSelect
                  v-model="scope.row.type"
                  placeholder="请选择"
                  size="small"
                  @change="changeIpType(scope)"
                >
                  <ElOption
                    v-for="(val, key) in NETTYPE"
                    :key="key"
                    :label="val"
                    :value="key"
                  />
                </ElSelect>
              </ElFormItem>
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="ip"
            width="260"
          >
            <template #header>
              <span :class="$style.danger">* </span>
              <span> IP</span>
            </template>
            <template #default="scope">
              <ElFormItem
                :prop="'ipList[' + scope.$index + '].ip'"
                :rules="checkIPRules"
              >
                <ElInput
                  v-model="scope.row.ip"
                  placeholder="请输入IP地址"
                  size="small"
                  @input="((val)=>{changeIp(scope)})"
                />
                <div
                  v-show="form.ipList[scope.$index].showRepeat"
                  ref="repeatError"
                >
                  <span class="el-form-item__error">同一网络类型下的ip地址不能重复</span>
                </div>
              </ElFormItem>
            </template>
          </ElTableColumn>
          <ElTableColumn
            v-if="form.ipList.length>1"
            label="操作"
            width="100"
          >
            <template #default="scope">
              <ElButton
                class="el-icon-delete"
                title="删除"
                size="small"
                @click="delIpInfo(scope)"
              />
            </template>
          </ElTableColumn>
        </ElTable>
        <ElButton
          :class="$style.button"
          type="primary"
          size="small"
          @click="addIpInfo"
        >
          添加
        </ElButton>
      </div>
    </ElFormItem>
  </ElForm>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { isIpv4OrIPv6, isIPv6Equals, checkIP, checkIPv6 } from '@/functions/validators'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    ip: { type: Array, required: true },
  },
  components: {
    ElTable,
    ElTableColumn,
  },
  data() {
    return {
      form: {
        ipList: [{
          type: '',
          ip: '',
          showRepeat: false,
        }],
      },
      ipInfoValidate: true,
    }
  },
  computed: {
    NETTYPE: () => {
      return {
        1: '内网',
        2: '互联网',
      }
    },
    checkIPRules() {
      return {
        required: true,
        trigger: 'change',
        validator: (
          rule: any,
          value: string,
          callback: (error?: Error) => void
        ) => {
          if (value) {
            try {
              isIpv4OrIPv6(value)
              callback()
            } catch (error) {
              callback(error)
            }
          } else {
            return callback(new Error('请输入IP地址 '))
          }
        },
      }
    },
  },
  methods: {
    validate() {
      let formValid
      this.$refs.form.validate((valid: boolean) => {
        formValid = valid
      })
      return formValid
    },
    addIpInfo(this: any) {
      const obj = {
        type: '',
        ip: '',
        showRepeat: false,

      }
      this.form.ipList.push(obj)
    },
    delIpInfo(obj) {
      const num = obj.$index
      this.form.ipList = this.form.ipList.filter((item, index) => {
        if (index === num) {
          item = null
        }
        return !!item
      })
      this.changeIp()
    },
    changeIpType() {
      this.changeIp()
    },
    changeIp() {
      const ipList = this.form.ipList
      const repeatIndex = []
      this.ipInfoValidate = true
      if (this.form.ipList.length > 1) {
        for (let i = 0; i < ipList.length; i++) {
          this.form.ipList[i].showRepeat = false
          for (let j = i + 1; j < ipList.length; j++) {
            if (ipList[i].type && ipList[i].ip) {
              if (ipList[i].type === ipList[j].type) {
                if ((checkIPv6(ipList[i].ip)) &&
                    (isIPv6Equals(ipList[i].ip, ipList[j].ip))) {
                  repeatIndex.push(i, j)
                } else if (((checkIP(ipList[i].ip)) &&
                    (ipList[i].ip === ipList[j].ip))) {
                  repeatIndex.push(i, j)
                }
              }
            }
          }
        }
        if (repeatIndex.length) {
          this.showRepeatIndex = Array.from(new Set(repeatIndex))
          this.showRepeatIndex.forEach((item) => {
            this.form.ipList[item].showRepeat = true
            this.ipInfoValidate = false
          })
        }
      } else if (ipList.length === 1) {
        this.form.ipList[0].showRepeat = false
      }

      this.$emit('childByValue', this.form.ipList)
    },
  },
  created() {
    if (this.ip.length !== 0) {
      this.ip.forEach(ele => {
        ele.type = String(ele.type)
        ele.showRepeat = false
      })
      this.form.ipList = this.ip
    }
  },
}
</script>

<style lang="scss" module>
.tableWrap {
  display: flex;

  .button {
    height: 32px;
    margin-top: 20px;
  }
}

.tableWrap :global(.el-form-item__error) {
  margin-top: -6px;
}

.danger {
  color: $colorDanger !important;
}

</style>
