# 本文件夹处理与服务端的通用交互逻辑, 遵循以下规范

1. 文件夹名与微服务名一一对应
2. 文件夹下的文件名与所在微服务功能模块一一对应
3. 原则上只做基础的封装, 不负责逻辑和数据处理 (放到下一级去做或使用管道)

`api` 层正则替换 `Models` (`swagger`), 生成接口

``` TypeScript
// 1. 导出接口
export interface Module {}
// 2. 从 swagger 文档复制定义
export interface Module {
  children	[...]
  createDate	integer($int64)
  example: 1970-1-1 00:00:00
  创建日期

  createUser	string
  example: uuid
  创建者

  icon	string
  图标名称
}
// 3. 使用 VS Code 正则替换功能 (ctrl + f 大小写/全字/正则全部勾上)
// 搜索内容如下( *(\w+)\t+(.+)\n(?: *(example: .+|[^\w\n}].+)? *(?:\n *([^\w\n}].+))?)?)
 *(\w+)\t+(.+)
(?: *(example: .+|[^\w\n}].+)? *(?:
 *([^\w\n}].+))?)?
// 替换内容如下(包括最后一个换行)
/** $4 $3 */
$1?: $2

// 4. 稍作整理, 替换掉 integer/[...]..., 结果如下
export interface Module {
  children?: Module[]
  /** 创建日期 example: 1970-1-1 00:00:00 */
  createDate?: number

  /** 创建者 example: uuid */
  createUser?: string

  /** 图标名称 */
  icon?: string
}
```
