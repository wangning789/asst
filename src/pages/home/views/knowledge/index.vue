<!-- 描述 -->
<template>
  <div class="el-card">
    <h4 :class="$style.title">
      {{ route.meta.title }}
    </h4>
    <div :class="$style.btn">
      <ElInput
        v-model="fileAlias"
        :class="$style.input"
        clearable
        placeholder="请输入关键字"
      />
      <ElButton
        v-if="!isCum"
        type="primary"
        size="medium"
        @click="shiftUpload"
      >
        上传
      </ElButton>
    </div>

    <ITable
      ref="table"
      :head="head"
      :query="query"
      :get="page"
    >
      <!-- <img
        v-if="scope.row.fileName.search('docx') !== -1"
        src="@/assets/doc.png"
        style=" height: 25px;"
      >
      <img
        v-else-if="scope.row.fileName.search('xls') !== -1"
        src="@/assets/xls.png"
        style=" height: 25px;"
      >
      <img
        v-else-if="scope.row.fileName.search('pptx') !== -1"
        src="@/assets/PPT.png"
        style=" height: 25px;"
      >
      <img
        v-else-if="scope.row.fileName.search('txt') !== -1"
        src="@/assets/TXT.png"
        style="height: 25px;"
      >
      <img
        v-else
        src="@/assets/file.png"
        style=" height: 25px;"
      > -->

      <ElTableColumn
        label="操作"
        width="150"
      >
        <template #default="{ row }">
          <ElTooltip content="下载">
            <ElButton
              type="text"
              icon="el-icon-download"
              @click="downLoadFile(row)"
            />
          </ElTooltip>
          <template v-if="!isCum">
            <ElTooltip content="删除">
              <ElButton
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(row)"
              />
            </ElTooltip>
          </template>
        </template>
      </ElTableColumn>
    </ITable>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
/// import 顺序: 依赖库/vue组件/其他/CSS Module
import ITable, { ElTableColumn } from '@com/Table'

import { download } from '@/api/tools/file'
import { getAppendixInfo, deleteFile } from '@/api/knowledge/knowledge'

import { ROLES } from '@/enums'

/// 常量(UPPER_CASE), 单例/变量(camelCase), 函数(无副作用,camelCase)

/** emit: 事件说明 */
export default {
  props: {
    route: { type: Object, required: true },
    fileType: { type: Number, required: true },
  },
  components: {
    ElTableColumn,
    ITable,
  },
  data() {
    return {
      fileAlias: '',
    }
  },
  computed: {
    query() {
      return {
        fileType: this.fileType,
        fileAlias: this.fileAlias,
      }
    },
    isCum() {
      return this.authFit(ROLES.custom)
    },
    page: () => getAppendixInfo,
    head() {
      return [
        {
          prop: 'fileAlias',
          label: '文件名',
        },
        {
          prop: 'createDate',
          label: '上传时间',
        },
      ]
    },
  },
  methods: {
    shiftUpload() {
      this.jump({ path: 'upload', append: true })
    },
    downLoadFile(row) {
      let a = document.createElement('a')
      a.href = download(row.fileId)
      a.style.display = 'none'
      a.click()
      a = null
    },
    handleDelete(row) {
      this.$confirm(
        `此操作不可逆, 确定要删除文件【${row.fileAlias}】？`,
        '删除确认',
        {
          type: 'warning',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
        }
      ).then(() => {
        deleteFile(row.id, row.fileId).then(res => {
          if (res.data.status) {
            this.$refs.table.fetch()
            this.$message.success('删除成功')
          } else {
            this.$message.success('删除失败')
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" module>
.title {
  display: inline-block;
  margin: $gapNormal/2 0 $gapNormal 0;
  font-size: $larger;
}

.btn {
  display: flex;
  justify-content: space-between;
  margin-bottom: $gapNormal / 2;

  .input {
    width: 220px;
  }
}
</style>
