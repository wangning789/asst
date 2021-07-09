<!-- 描述 -->
<template>
  <div>
    <div :class="$style.title">
      <span :class="$style.name">
        {{ typeName }}
      </span>
      <span>
        <ElButton
          type="primary"
          size="small"
          @click="addField"
        >
          添加字段
        </ElButton>
      </span>
    </div>
    <ElRow
      :gutter="14"
      :class="$style.content"
    >
      <ElCol
        v-for="(item,index) in fields"
        :key="index"
        :md="8"
        :lg="8"
        :xl="6"
      >
        <div
          ref="field"
          :class="$style.con"
        >
          <div :class="$style.pad">
            <div :class="$style.assettype">
              <span :class="$style.footname">{{ item.chName }}</span>
              <span :class="$style.fieldtype">{{ FIELD_TYPE[item.type] }}</span>
            </div>
            <div :class="$style.basic">
              <div :class="$style.flex">
                <p>排序：{{ item.displayOrder }}</p>
                <p>是否列表展示：{{ DISPLAY_TYPE[item.display] }}</p>
              </div>
              <div :class="$style.flex">
                <p v-if="item.enName.lenght < 10">
                  英文名称：{{ item.enName }}
                </p>
                <ElTooltip
                  v-else
                  class="item"
                  effect="dark"
                  :content="item.enName"
                  placement="bottom-start"
                >
                  <p :class="$style.describe">
                    英文名称：{{ item.enName }}
                  </p>
                </ElTooltip>
                <p :class="$style.required">
                  是否必填：{{ REQUIRED_TYPE[item.required] }}
                </p>
              </div>

              <p
                v-if="item.description.length < 10"
                :class="$style.describe"
              >
                描述：{{ item.description }}
              </p>
              <ElTooltip
                v-else
                class="item"
                effect="dark"
                :content="item.description"
                placement="bottom-start"
              >
                <p :class="$style.describe">
                  描述：{{ item.description }}
                </p>
              </ElTooltip>
            </div>
          </div>
          <div
            :class="$style.editIcon"
          >
            <!-- <ElTooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="bottom-start"
          > -->
            <i
              class="el-icon-edit-outline"
              style="margin-right: 10px; color: #2c73ef; cursor: pointer;"
              @click="editField(item)"
            />
            <!-- </ElTooltip> -->
            <!-- <ElTooltip
            class="item"
            effect="dark"
            content="删除"
            placement="bottom-start"
          > -->
            <i
              class="el-icon-delete"
              style="color: #f56c6c; cursor: pointer;"
              @click="deleteField(item.id)"
            />
          <!-- </ElTooltip> -->
          </div>
        </div>
      </ElCol>
    </ElRow>
    <!-- 字段弹出框   -->
    <IDrawer
      :drawer="drawer"
      :title="optType === 'add' ? '添加字段':'修改字段'"
      @handleClose="handleClose"
    >
      <div slot="buttons">
        <ElButton
          plain
          size="small"
          @click="handleClose"
        >
          取消
        </ElButton>
        <ElButton
          type="primary"
          size="small"
          @click="saveField()"
        >
          保存
        </ElButton>
      </div>
      <div slot="content">
        <ElForm
          ref="form"
          :model="form"
          size="small"
          label-width="120px"
        >
          <ElFormItem
            label="字段名称："
            prop="chName"
            :rules="[
              { required: true, message: '请输入字段名称', trigger: 'blur' },
            ]"
          >
            <ElInput
              v-model="form.chName"
              show-word-limit
              maxlength="10"
              placeholder="请输入字段名称"
            />
          </ElFormItem>
          <ElFormItem
            label="英文名称："
            prop="enName"
            :rules="[
              { required: true, message: '请输入英文名称', trigger: 'blur' },
              {pattern:/^[A-Za-z_]+$/, message: '只能有英文大小写和下划线', trigger: 'blur'}
            ]"
          >
            <ElInput
              v-model="form.enName"
              show-word-limit
              maxlength="50"
              placeholder="请输入英文名称"
            />
          </ElFormItem>
          <ElFormItem
            label="排序："
            prop="displayOrder"
            :rules="[
              { required: true, message: '请输入排序', trigger: 'blur' },
              {
                pattern: /^(([^0][0-9]+|0)$)|^(([1-9]+)$)/,
                message: '排序不能为小数',
                trigger: 'blur',
              },
              {pattern:/^[+]{0,1}(\d+)$/,
               message: '排序不能为负数',
               trigger: 'blur',
              }
            ]"
          >
            <ElInput
              v-model="form.displayOrder"
              type="number"
              placeholder="请输入排序"
            />
          </ElFormItem>
          <ElFormItem
            label="是否列表展示："
            prop="display"
            :rules="[
              { required: true, message: '请选择', trigger: 'blur' },
            ]"
          >
            <ElRadioGroup v-model="form.display">
              <ElRadio
                v-for="(label, value ) in DISPLAY_TYPE"
                :key="value"
                :label="value"
              >
                {{ label }}
              </ElRadio>
            </ElRadioGroup>
          </ElFormItem>
          <!-- v-show="form.display===1" -->
          <ElFormItem
            label="是否必填："
            prop="required"
            :rules="[
              { required: true, message: '请选择', trigger: 'blur' },
            ]"
          >
            <ElRadioGroup v-model="form.required">
              <ElRadio
                v-for="(label, value ) in REQUIRED_TYPE"
                :key="value"
                :label="value"
              >
                {{ label }}
              </ElRadio>
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem
            label="是否导出："
            prop="export"
            :rules="[
              { required: true, message: '请选择', trigger: 'blur' },
            ]"
          >
            <ElRadioGroup v-model="form.export">
              <ElRadio
                v-for="(label, value ) in EXPORT_TYPE"
                :key="value"
                :label="value"
              >
                {{ label }}
              </ElRadio>
            </ElRadioGroup>
          </ElFormItem>
          <ElFormItem
            label="类型："
            prop="type"
            :rules="[
              { required: true, message: '请选择类型', trigger: 'change' },
            ]"
          >
            <ElSelect
              v-model="form.type"
              placeholder="请选择类型"
            >
              <ElOption
                v-for="(label,value) in FIELD_TYPE"
                :key="value"
                :label="label"
                :value="value"
              />
            </ElSelect>
          </ElFormItem>
          <template v-if="form.type==='7'">
            <!-- :prop="`enumList[${index}]`" -->
            <ElFormItem
              v-for="(item, index) in enumList"
              :key="index"
              :label="`选项${index}：`"
              :rules="[
                { required: true, message: '请输入', trigger: 'change' },
              ]"
            >
              <div :class="$style.optionLine">
                <ElInput
                  v-model.trim="enumList[index]"
                  :class="$style.option"
                  placeholder="请输入"
                />
                <ElButton
                  icon="el-icon-minus"
                  :disabled="enumList.length===1"
                  size="mini"
                  circle
                  @click="deleteOption(index)"
                />
                <ElButton
                  icon="el-icon-plus"
                  size="mini"
                  circle
                  @click="addOption(index)"
                />
              </div>
            </ElFormItem>
          </template>

          <ElFormItem
            label="描述："
            prop="description"
          >
            <ElInput
              v-model="form.description"
              type="textarea"
              show-word-limit
              maxlength="60"
              placeholder="请输入描述"
            />
          </ElFormItem>
        </ElForm>
      </div>
    </IDrawer>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)
import IDrawer from '@homeCom/assets/Drawer'
// ciColumnDetail
import {
  ciColumnAdd, ciColumnModify, ciColumnDelete, FIELD_TYPE, AssetsField,
  DISPLAY_TYPE, REQUIRED_TYPE, EXPORT_TYPE, listAllColumns,
} from '@/api/assets/assetsType'
/** emit: (事件名: [参数列表, ...]) */
export default {
  /// 顺序: name/extends/mixins/props/provide/inject/model
  ///      components/directives/filters/data/computed/watch/methods
  ///      beforeCreate/created/beforeMount/mounted/beforeUpdate/updated
  ///      activated/deactivated/beforeDestroy/destroyed/errorCaptured
  props: {
    typeId: { type: String, required: true },
    typeName: { type: String, required: true },
  },
  components: {
    IDrawer,
  },
  data() {
    return {
      fields: [],
      optType: 'add',
      drawer: false,
      form: {
        ciTypeId: this.typeId, // 资产类型id
        chName: '',
        enName: '',
        displayOrder: '', // 排序
        display: '2', // 是否显示
        required: '2', // 是否必填
        export: '2', // 是否导出
        type: '', // 字段类型
        enumeration: '', // 枚举值 下拉才有
        description: '', // 备注
      },
      enumList: [''],
      options: [],
    }
  },
  computed: {
    FIELD_TYPE: () => FIELD_TYPE,
    DISPLAY_TYPE: () => DISPLAY_TYPE,
    REQUIRED_TYPE: () => REQUIRED_TYPE,
    EXPORT_TYPE: () => EXPORT_TYPE,
  },
  watch: {
    typeId() {
      this.getAllFields()
    },
  },
  methods: {
    addOption(index) {
      this.enumList.splice(index + 1, 0, '')
    },
    deleteOption(index) {
      this.enumList.splice(index, 1)
    },
    getAllFields() {
      listAllColumns(this.typeId).then(res => {
        if (res.data.status) {
          // 自编辑自定义字段
          this.fields = res.data.body.filter(item =>
            item.allowModify === '1'
          )
        }
      })
    },
    saveField() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const fn = this.form.id ? ciColumnModify : ciColumnAdd
          if (this.form.type === '7') {
            if (this.enumList.includes('')) {
              this.$message.error('请输入下拉选项')
              return
            }
            this.form.enumeration = this.enumList.length ? JSON.stringify({ ...this.enumList }) : ''
          } else {
            this.form.enumeration = ''
          }
          fn(this.form as AssetsField).then(res => {
            if (res.data.status) {
              this.$notify.success(this.form.id ? '修改成功' : '新增成功')
              this.drawer = false
              this.getAllFields()
            } else {
              this.$message.error(res.data.msg || '请求失败')
            }
          })
        }
      })
    },
    addField() {
      if (this.fields.length >= 30) {
        this.$message.error('字段最多30个')
        return
      }
      this.optType = 'add'
      this.form = {
        ciTypeId: this.typeId, // 资产类型id
        chName: '',
        enName: '',
        displayOrder: '', // 排序
        display: '2', // 是否显示
        required: '2', // 是否必填
        export: '2', // 是否导出
        type: '', // 字段类型
        enumeration: '', // 枚举值 下拉才有
        description: '', // 备注
      }
      this.enumList = ['']
      this.drawer = true
      this.$refs.form.resetFields()
    },
    handleClose() {
      this.drawer = false
    },
    editField(item) {
      this.optType = 'edit'
      this.form = JSON.parse(JSON.stringify(item))
      if (this.form.type === '7') {
        this.enumList = this.form.enumeration ? Object.values(JSON.parse(this.form.enumeration)) : ['']
      } else {
        this.enumList = ['']
      }
      this.drawer = true
    },
    deleteField(id) {
      this.$confirm('此操作不可逆, 确定删除？', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定',
      }).then(() => {
        ciColumnDelete(id).then(res => {
          if (res.data.status) {
            this.$notify.success('删除成功')
            this.getAllFields()
          } else {
            this.$message.error(res.data.msg || '删除失败')
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" module>

.title {
  display: flex;
  justify-content: space-between;

  .name {
    margin-top: 10px;
    color: #333;
    font-weight: bold;
    font-size: 14px;
  }
}

.flex {
  display: flex;
  justify-content: space-between;
}

.content {
  margin-top: 14px;

  .con {
    position: relative;
    box-sizing: border-box;
    // width: 360px;
    height: 130px;
    margin-bottom: 14px;
    border: 1px solid #e9e9e9;
    border-radius: 4px;

    .editIcon {
      position: absolute;
      right: 15px;
      bottom: 24px;
      opacity: 0;
    }

    .pad {
      padding: 10px 15px 0;
    }

    .basic {
      margin: 10px 0 28px;
    }

    p {
      margin: 0;
      padding: 5px 0;
      color: #999;
      font-weight: 400;
      font-size: 12px;
      line-height: 12px;
    }

    .describe {
      width: 190px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .required {
      white-space: nowrap;
    }

    .assettype {
      display: flex;
      justify-content: space-between;
    }
  }

  .con:hover {
    border: 1px solid #2c73ef;
  }

  .con:hover .editIcon {
    opacity: 1;
  }
}

.footname {
  color: $colorTheme;
  font-weight: bold;
  font-size: 14px;
}

.fieldtype {
  min-width: 48px;
  height: 24px;
  padding: 0 10px;
  color: $colorTheme;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  background: rgba(96, 133, 197, 0.1);
  border-radius: 20px;
}

.optionLine {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.option {
  width: 70% !important;
  margin-right: 10px;
}
</style>
