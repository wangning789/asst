# 微件库(WIP)

## 公共 API

- 全局组件
- 全局样式
- 全局事件
- 换肤相关 (eventBus 对内, 对外 provide(inject)/ window 事件?)
- 微件注册等

## 微件规范

通过 props 接收配置, 通过事件通信(被平台捕获或者平台再转发给其它微件)

- props: 即支持的配置项或外部数据, 甚至调用的接口
- on: 监听事件, 事件名通过平台配置
- emit: 触发事件, 事件名通过平台配置
