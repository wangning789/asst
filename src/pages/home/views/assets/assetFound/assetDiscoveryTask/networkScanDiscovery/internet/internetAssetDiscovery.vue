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
              互联网资产发现
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
                v-for="item in PROBE"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.disable"
              />
            </ElSelect>
          </ElFormItem>
          <!-- 扫描目标 -->
          <ElFormItem
            prop="type"
            label="扫描目标："
          >
            <div :class="$style.tar">
              <ElFormItem
                v-for="(item,index) in target"
                :key="item.name"
              >
                <div
                  :class="$style.target"
                >
                  <ElSelect
                    v-model="target[index].name"
                    size="small"
                    :placeholder="'请选择关键字'"
                    :class="$style.keyword"
                  >
                    <ElOption
                      v-for="item in KETWOD"
                      :key="item.value"
                      :label="item.value"
                      :value="item.label"
                    />
                  </ElSelect>
                  <ElSelect
                    v-model="target[index].equal"
                    size="small"
                    :class="$style.selete"
                    :placeholder="'等于'"
                  >
                    <ElOption
                      v-for="(item,index) in EQUAL"
                      :key="index"
                      :label="item"
                      :value="index"
                    />
                  </ElSelect>
                  <ElInput
                    v-model="target[index].title"
                    size="medium"
                    placeholder="请输入"
                  />
                  <div :class="$style.buttones">
                    <ElButton
                      :disabled="target.length === 1"
                      icon="el-icon-minus"
                      size="mini"
                      circle
                      @click="minus(index)"
                    />
                    <ElButton
                      icon="el-icon-plus"
                      size="mini"
                      circle
                      @click="addtarget(index)"
                    />
                  </div>
                </div>
              </ElFormItem>
            </div>
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
            prop="region"
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

            <div v-show="ruleForm.excuteImmediately !== '1'">
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
import { discoveryResultAdd, PROBE, EXECUTE_IMMEDIATELY } from '@/api/assets/discoveryResilt'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  data() {
    return {
      organizations: [], // 组织机构
      target: [{
        name: '',
        equal: '',
        title: '',
      }], // 扫描目标
      ruleForm: {},
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
        excuteImmediately: [
          { required: true, message: '请选择执行方式', trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    KETWOD: () => {
      return [
        { label: '域名', value: '域名-domain' },
        { label: 'ip', value: 'IP-ip' },
        { label: '国家', value: '国家-country' },
        { label: '端口', value: '端口-port' },
        { label: '标题', value: '标题-title' },
      ]
    },
    EQUAL: () => {
      return {
        '=': '等于',
        '!=': '不等于',
      }
    },
    PROBE: () => PROBE,
    EXECUTE_IMMEDIATELY: () => EXECUTE_IMMEDIATELY,
  },
  methods: {
    add() {
      if (!this.validate()) {
        return 1
      }
      this.ruleForm.discoverContent = ''
      this.target.forEach(item => {
        this.ruleForm.discoverContent += item.name + item.equal + item.title + '/'
      })
      discoveryResultAdd(this.ruleForm).then(res => {
        if (res.data.status) {
          this.$notify.success('新增成功')
          this.$router.go(-1)
        } else {
          this.$message.error(res.msg || '请求失败')
        }
      })
    },
    addtarget() {
      this.target.push({ })
    },
    goToNet() {
      this.$router.go(-1)
    },
    minus(index) {
      this.target.splice(index, 1)
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
  margin: 2px 0;
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
