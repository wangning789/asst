/** 图片文件转base64 */
export default (file: File, cb: (base64: string) => any) => {
  const reader = new FileReader()
  reader.onload = event => {
    // eslint-disable-next-line standard/no-callback-literal
    cb(event.target?.result as string)
  }
  reader.readAsDataURL(file)
}
