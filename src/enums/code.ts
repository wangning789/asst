/** 码表字典 */
import Vue from 'vue'
import { Memory } from '@/utils/storage'
import CONFIG from '@/config/code'
import { sub } from '@/api/authServer/code'

const CACHE = new Memory(CONFIG.max, CONFIG.alive)

/** 码表加载状态字典 */
export const STATUS = {
  load: 0 as Falsy,
  empty: '' as Falsy,
  error: null as Falsy,
}

/** 获取码表字典 (在计算属性使用)
 * @param {String} dictType 码表类型
 * @param {String} dictCode 码值
 *
 * @returns { object } Vue 响应式对象 { value: Falsy | IObject<string> }
 */
export default function get(dictType: string, dictCode: string, fun = sub) {
  const KEY = dictType + '.' + dictCode
  let shouldGet = true // setter获取当前值

  return Vue.observable({
    get value(): Falsy | IObject<string> {
      const value = CACHE.get(KEY)

      if (value === undefined) {
        shouldGet &&
          fun({ dictType, dictCode })
            .then(res => {
              shouldGet = false
              if ((res = res.data.body)) {
                const data: IObject<string> = {}
                for (const item of res) {
                  data[item.dictCode] = item.dictName
                }
                this.value = data
              } else {
                this.value = STATUS.empty
              }
            })
            .catch(() => {
              shouldGet = false
              this.value = STATUS.error
            })

        return STATUS.load
      }

      return value
    },
    set value(data) {
      shouldGet = true
      CACHE.set(KEY, data)
    },
  })
}

/** 码表类型 */
export const enum codeType {
  /** 系统码表 */
  sys = '1',
  /** 用户码表 */
  user = '2',
}

/** 全部码表code */
export const enum userCode {
  /** 安全日志类型 */
  SECURITYLOG = 'SECURITY_LOG',
  /** 安全告警类型 */
  SECURITYALARM = 'SECURITY_ALARM',
  /** 工单流程类型 */
  WORK_TYPE = 'USR_WORK_TYPE',
}

export const enum parentCode {
 /** 单位职务类型 */
 UNIT_IDENTITY = 'UNIT_IDENTITY',
 /** 字典管理 */
 ROOT_DICT_CODE = 'ROOT_DICT_CODE',
 /** 紧急 */
 URGENT_LEVEL_WORK = 'URGENT_LEVEL_WORK',
 /** 安全厂商 */
 VENDOR = 'VENDOR',
 /** 安全告警类型 */
 SECURITY_ALARM = 'SECURITY_ALARM',
 /** 安全报表类型 */
 SecurityReportType = 'SecurityReportType',
 /** 安全日志 */
 SECURITY_LOG = 'SECURITY_LOG',
 /** 版本 */
 DEVICE_VERSION = 'DEVICE_VERSION',
 /** 知识库类型 */
 KnowledgeType = 'KnowledgeType',
 /** 网络区域 */
 NETWORK_AREA = 'NETWORK_AREA',
 /** 角色类型 */
 ROLE_CODE = 'ROLE_CODE',
 /** 工单流程类型 */
 USR_WORK_TYPE = 'USR_WORK_TYPE',
 /** 资产管理 */
 SYS_ASSET_CODE = 'SYS_ASSET_CODE',
 /** 计算服务 */
 SYS_JSFW = 'SYS_JSFW'
}

export const enum roleAttribute {
  /** 平台用户 */
  SYS_ROLE_PLATFORM = 'SYS_ROLE_PLATFORM',
  /** 集团用户 */
  SYS_ROLE_UNIT = 'SYS_ROLE_UNIT'
}
