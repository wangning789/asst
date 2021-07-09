// 资产概括
import { get } from '@/utils/ajax'
import { download } from '@/utils/downloader'

export const enum API {
    /** 单位领导，资产概括 */
    assetss='/asset/overView/glAssetStatistics',
    numberAssets='asset/overView/loadAssetCount',
    assetStatistics='asset/overView/loadAssetStatistics', // 资产统计
    assetStatement='asset/overView/loadAssetStatisticsReport', // 资产报表
    memberAssets='asset/overView/loadMemberCompanyAssetStatistics', // 成员资产
    overView='asset/overView/exportAssetStatisticsReport2Excel'// 导出
  }

function overView(dto: Record<string, any>) {
  const res = download(API.overView, dto)
  return res
}

function assets() {
  return get(API.assetss)
}

function numberAssets() {
  return get(API.numberAssets)
}

function assetStatistics(param: Record<string, any>) {
  return get(API.assetStatistics, param)
}

function assetStatement() {
  return get(API.assetStatement)
}

function memberAssets() {
  return get(API.memberAssets)
}

export {
  assets,
  numberAssets,
  assetStatistics,
  assetStatement,
  memberAssets,
  overView,

}
