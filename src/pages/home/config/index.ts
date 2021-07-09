/** SPA 配置 */
export default {
  /*! 【↓ history路由必须绝对路径 ↓】 */
  /*! 网站路径 */
  /** 网站路径 */
  base: '',

  /*! 接口地址 */
  /** 接口地址 */
  baseUrl: process.env.BASE_PATH,
  /*! 【↑ history路由必须绝对路径 ↑】 */

  /*! 上传文件类型列表 */
  fileType: '.pdf,.txt,.zip,.7z,.rar,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg',

  /*! 上传文件大小 50M */
  fileSize: 50 * 1024 * 1024,
}
