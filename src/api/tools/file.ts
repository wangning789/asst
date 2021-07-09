import { HEAD, getUri, get } from '@/utils/ajax'

// service-platform 网关路径
/** 文件上传下载接口 */
export const enum API {
  /** 文件上传 */
  upload = 'tools-server/file/upload',
  /** 文件下载 */
  download = 'tools-server/file/download',
  /** 文件删除 */
  del = 'tools-server/file/delete',

}

let _uploadUrl!: string
/** 获取文件上传地址 */
function upload() {
  return _uploadUrl || (_uploadUrl = getUri(API.upload))
}

/** 获取文件下载链接 */
function download(fileId: string) {
  return getUri(API.download, { fileId })
}

/** 删除文件 */
function del(fileId: string) {
  return get(API.del, { fileIds: fileId })
}

export { HEAD, upload, download, del }
