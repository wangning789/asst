// 资产概括
import { get, post } from '@/utils/ajax'

export const enum API {
  getSafetyInspection='service-platform/safetyInspection/getSafetyInspection',

  getSafetyInspectionRecord='service-platform/safetyInspectionRecord/getSafetyInspectionRecord',

  getSafetyInspectionRecordStat='service-platform/safetyInspectionRecord/getSafetyInspectionRecordStat',

  getSafetyInspectionCycle='service-platform/safetyInspectionCycle/getSafetyInspectionCycle',

  updateSafetyInspectionRecord='service-platform/safetyInspectionRecord/updateSafetyInspectionRecord',

  getSafetyInspectionRecordCycle='service-platform/safetyInspectionRecord/getSafetyInspectionRecordCycle',
}

function getSafetyInspection(param: Record<string, any>) {
  return get(API.getSafetyInspection, param)
}

function getSafetyInspectionRecordCycle(param: Record<string, any>) {
  return get(API.getSafetyInspectionRecordCycle, param)
}

function getSafetyInspectionRecord(param: Record<string, any>) {
  return get(API.getSafetyInspectionRecord, param)
}

function getSafetyInspectionRecordStat(param: Record<string, any>) {
  return get(API.getSafetyInspectionRecordStat, param)
}

function getSafetyInspectionCycle(param: Record<string, any>) {
  return get(API.getSafetyInspectionCycle, param)
}

function updateSafetyInspectionRecord(param: Record<string, any>) {
  return post(API.updateSafetyInspectionRecord, param)
}

export {
  getSafetyInspection,
  getSafetyInspectionRecord,
  getSafetyInspectionCycle,
  getSafetyInspectionRecordStat,
  updateSafetyInspectionRecord,
  getSafetyInspectionRecordCycle,
}
