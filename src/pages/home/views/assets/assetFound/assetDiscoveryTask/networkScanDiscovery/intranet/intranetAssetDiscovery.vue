<!-- 描述 -->
<template>
  <div class="el-card">
    <!-- 头部 -->
    <div :class="$style.title">
      <div :class="$style.left">
        新建资产发现任务
      </div>
    </div>
    <div :class="$style.conter">
      <div :class="$style.form">
        <ElForm
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="130px"
          size="small"
        >
          <ElFormItem
            label="任务类型："
          >
            <div>
              内网资产发现
            </div>
          </ElFormItem>
          <ElFormItem
            label="任务名称："
            prop="taskName"
          >
            <ElInput
              v-model="ruleForm.taskName"
              size="medium"
              placeholder="请输入任务名称"
            />
          </ElFormItem>
          <ElFormItem
            label="关联组织机构："
          >
            <ElSelect
              v-model="ruleForm.belongCompanyId"
              size="small"
              :placeholder="'请选择组织机构'"
            >
              <ElOption
                v-for="item in organizations"
                :key="item.id"
                :label="item.organizationName"
                :value="item.id"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="选择扫描探针："
          >
            <ElSelect
              v-model="ruleForm.taskType"
              size="small"
              :placeholder="'请选择扫描探针'"
            >
              <ElOption
                v-for="item in PROBE_INTRANET"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disable"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            prop="discoverContent"
          >
            <span slot="label">
              扫描内容
              <ElTooltip
                class="item"
                effect="dark"
                placement="bottom-start"
              >
                <div slot="content">
                  <p>输入示例：</p>
                  <p>单个IP地址：192.0.0.2</p>
                  <p>IP端：192.0.0.1/24或192.0.0.0—192.0.0.255</p>
                </div>
                <i class="el-icon-question" />
              </ElTooltip>
              :
            </span>
            <ElInput
              v-model="ruleForm.discoverContent"
              placeholder="请输入IP地址或者网段"
              type="textarea"
            />
          </ElFormItem>
          <ElFormItem>
            <span slot="label">
              扫描级别
              <ElTooltip
                class="item"
                effect="dark"
                placement="bottom-start"
              ><div slot="content">
                 <p>快速扫描：探测主机存活状态，扫描常见端口</p>
                 <p>深度扫描：全端口扫描</p>
               </div>
                <i class="el-icon-question" />
              </ElTooltip>
              :
            </span>
            <ElSelect
              v-model="ruleForm.discoverLevel"
              size="small"
              :placeholder="'请选择扫描级别'"
            >
              <ElOption
                v-for="(item,index) in DISCOVER_LEVEL"
                :key="index"
                :label="item"
                :value="index"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            label="描述："
          >
            <ElInput
              v-model="ruleForm.description"
              type="textarea"
            />
          </ElFormItem>
          <ElFormItem
            label="任务执行时间："
          >
            <ElFormItem
              label="是否立即执行"
              prop="excuteImmediately"
            >
              <ElSelect
                v-model="ruleForm.excuteImmediately"
                size="small"
                :placeholder="'请选择执行方式'"
              >
                <ElOption
                  v-for="(item,index) in EXECUTE_IMMEDIATELY"
                  :key="index"
                  :label="item"
                  :value="index"
                />
              </ElSelect>
            </ElFormItem>

            <div v-show="ruleForm.excuteImmediately !== '1' && ruleForm.excuteImmediately !== null">
              <ElCol
                :span="24"
              >
                <ElFormItem
                  label="选择日期："
                  prop="excuteTime"
                >
                  <ElDatePicker
                    v-model="ruleForm.executeTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间"
                  />
                </ElFormItem>
              </ElCol>
            </div>
          </ElFormItem>
          <ElFormItem>
            <ElButton
              type="primary"
              @click="add"
            >
              创建
            </ElButton>
            <ElButton @click="goToNet">
              取消
            </ElButton>
          </ElFormItem>
        </ElForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import { getOrganizationInfo } from '@/api/systemManage/organization'
/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import { discoveryResultAdd, EXECUTE_IMMEDIATELY, PROBE_INTRANET, DISCOVER_LEVEL } from '@/api/assets/discoveryResilt'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  data() {
    return {
      organizations: [], // 组织机构
      ruleForm: {},
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
        discoverContent: [
          { required: true, message: '请输入IP地址或者网段', trigger: 'blur' },
        ],
        excuteImmediately: [
          { required: true, message: '请选择执行方式', trigger: 'change' },
        ],
        excuteTime: [
          { required: true, message: '请选择日期时间', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    PROBE_INTRANET: () => PROBE_INTRANET,
    EXECUTE_IMMEDIATELY: () => EXECUTE_IMMEDIATELY,
    DISCOVER_LEVEL: () => DISCOVER_LEVEL,
  },
  methods: {
    add() {
      if (!this.validate()) {
        return 1
      }
      discoveryResultAdd(this.ruleForm).then(res => {
        if (res.data.status) {
          this.$notify.success('新增成功')
          this.$router.go(-1)
        } else {
          this.$message.error(res.msg || '请求失败')
        }
      })
    },
    goToNet() {
      this.$router.go(-1)
    },
    validate() {
      let formValid
      this.$refs.ruleForm.validate((valid: boolean) => {
        formValid = valid
      })
      return formValid
    },
  },
  created() {
    getOrganizationInfo().then(res => {
      this.organizations = res.data.body
    })
  },
}
</script>

<style lang="scss" module>
.title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 10px;
  border-bottom: 1px solid #e9e9e9;

  .left {
    color: #333;
    font-weight: bold;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
  }
}

.target {
  display: flex;
  width: 500px;
  margin: 10px 0;
}

.tar :global(.el-input__inner) {
  width: 140px !important;
}

.tar :global(.el-input--small) {
  width: 140px !important;
}

.keyword {
  width: 140px;
  margin-right: 10px;
}

.selete {
  width: 80px;
  margin-right: 10px;
}

.selete :global(.el-input__inner) {
  width: 80px !important;
}

.selete :global(.el-input--small) {
  width: 80px !important;
}

.buttones {
  display: flex;
  justify-content: space-between;
}

.but {
  width: 26px;
  height: 26px;
  text-align: center;
  border-radius: 100% !important;
}

.form {
  width: 430px;
  margin: 20px 0;
}

.form :global(.el-input__inner) {
  width: 300px;
}

.conter {
  width: 1200px;
  margin: 0 auto;
}
</style>
