import { get } from '@/utils/ajax'
// import { download } from '@/utils/downloader'
// import { showDialog } from '@com/WorkflowDialog'
export const enum API {
  getNumber = 'service-platform/workTask/getTaskStatis',
    getType = 'service-platform/workTask/getTaskAnalysisPie',
    taskNum = 'service-platform/workTask/listToDoWorkByUserId',
    hightDisposalRate = 'service-platform/workTask/getTaskDispositionHigh',
    lowestDisposalRate = 'service-platform/workTask/getTaskDispositionLow',
    LongestTime = 'service-platform/workTask/getTaskDetailTimeHigh',
    shortestTime = 'service-platform/workTask/getTaskDetailTimeLow',
    getCurrency='service-platform/workTask/listToDoWorkByUserId',
}
function getNumber(data: number) {
  return get(API.getNumber, { data })
}

function getType(type: number) {
  return get(API.getType, { type })
}

function taskNum(type: number, allOrUnfinish: number) {
  return get(API.taskNum, { type, allOrUnfinish })
}

function hightDisposalRate(data: number) {
  return get(API.hightDisposalRate, { data })
}

function lowestDisposalRate(data: number) {
  return get(API.lowestDisposalRate, { data })
}

function LongestTime(data: number) {
  return get(API.LongestTime, { data })
}

function shortestTime(data: number) {
  return get(API.shortestTime, { data })
}

function getCurrency(type: number, allOrUnfinish: number) {
  return get(API.getCurrency, { type, allOrUnfinish })
}

export {
  getNumber,
  getType,
  taskNum,
  hightDisposalRate,
  lowestDisposalRate,
  LongestTime,
  shortestTime,
  getCurrency,
}
