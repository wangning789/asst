# 广州市网络安全公共服务平台

## 项目资料

`svn://192.168.139.20/cetc-cloud/02工程/03工程组/03前端开发组/云安全服务RV0.2`

设计稿(蓝湖): https://lanhuapp.com/web/#/item/project/board?pid=252f1848-edcc-40dc-b09d-dab1be7381a3

## 文档&规范

模板项目为 [cloud-frame](http://192.168.139.15/cloud_sspc/cloud-frame), **<b style="color: red;">请务必先阅读该项目文档</b>**

## TODO

- 码表管理
- 日志管理
- 自定义门户编辑器 (`@/grid/components/Editor`)
- 图标概率乱码: `scss` 压缩模式下 (compressed mode) 使用 UTF-8 byte order mark (UTF-8 with BOM) 代替 @charset 声明语句导致, 暂时先使用 css `import 'element-ui/lib/theme-chalk/base.css'`
- 开发环境代理(devServer)第三方网站 set-cookie path

### 分支

- `master` 最新稳定版
- `dev` 最新开发版
- `vxx.xx.xx` 定版(`xx`为数字)
- `hotfix-xx.xx.xx` 热补丁
- `feat/fix/test...-` 新增功能/修复问题/尝试...

### SPA 划分

- `index.html` 首页
- `login.html` 登录
- `home.html` 主体功能(各门户功能)
- `me.html` 个人中心(头像密码等/设置)
- `mall.html` 商城
- `help.html` 帮助手册
- `custom.html` 自定义门户
- `404.html` 未知页
- `50x.html` 错误页

### 目录及术语

- `superAdmin` 超级管理员
- `systemAdmin` 系统管理员
- `operation` 运维
- `commercial` 运营
- `cloudService` 云服务商权限
- `sales` 销售
- `custom` 客户

### 重要提示

- 所有功能在`dev`分支上开发, 也可以拉新的分支(命名`feat-`, 开发期间不受别人推送的代码影响)待完成并合并到`dev`后删除
- 所有接口通过 `https?://{ip}:8080` 访问, 接口文档通过 `https?://{ip}:8670` 查看
- 若开发环境出现缓存相关错误信息导致热更新慢, 可以删除 `node_modules/.cache` 文件夹再试
- 要快速调试一个功能模块, 可以通过别名配置只包含相关模块 或者 新增 SPA 来挂载该模块

### 开发

- 只启动指定 SPA 有如下两种方式

  ```bash
  # 1. 通过 .env.local 指定, 正常使用命令, 比如 yarn dev
  _ENTRIES=login,home
  # 2. 通过 cli 参数
  yarn dev --entries=login,home
  ```

- 只挂载指定视图(以 `home` SPA 为例):
  1. 新建目录 `src/pages/home/route.me~` (以 `~` 开头或结束的文件/文件夹会被 git 忽略)
  2. 在 `index.ts` 中导出你的配置, 如下两种方式使用

  ```bash
  # 1. 通过 .env.local 指定, 正常使用命令, 比如 yarn dev
  _ALIAS=[["@hRoute", "home/route", "me~"]]
  # 2. 通过 cli 参数
  yarn dev --alias=me~
  ```

- 指定入口和别名可结合使用 `yarn dev --entries=login,home --alias=me~`
- `api` 层统一按照微服务划分, 放到 `src/api` 目录下, 有不同交互逻辑的, 就近添加 `api` 目录
- 请务必使用 scss 变量( `src/skin/parts` 目录)完成样式及布局, 其中需要在 js 中计算的, 请通过导出 CSS 对象的方式, 参考 `scss/export` 目录
- **禁止使用** `this.$route`, 视图组件可接受 `prop:route` 代替, 其子组件自行传递需要的 `prop`
- 除特殊情况外, 应使用通用表格组件 `@com/Table`
- 所有需要先进行异步操作的, 应使用通用异步加载器 `@com/ChooserAsyncFunctional`
- 所有下级页面需要在本页面的**部分区域**再次分发路由的, 应使用 `@com/RouterViewTransparent`, 否则都应通过路由配置完成分发

#### home 主体功能

- 由于各个视图(页面)布局有所不同, 所以如下约定:
  1. 所有视图均设置了内边距(`padding`)为 `$gapNormal`, 不需要的视图(少数)请自行覆盖该样式
  2. 需要背景色的视图请使用 class `el-card` 或者直接使用 `<ElCard />`, 视图目前有两种拉伸方式, 固定(最大)宽度居中 和 平铺, 请自行处理
  3. 需要显示当前视图名字的视图, 请接收 `props: route`, 从 `meta.name` 获取, 配置及鉴权开发暂不考虑

## 记录

- 多侧(前台/后台网站)打包部署, 指定 SPA 及别名

### 思考

### 备忘

- chunk hash 长度： 修改 [webpack.optimize.SplitChunksPlugin](node_modules/webpack/lib/optimize/SplitChunksPlugin.js)

  ```JavaScript
  /* 23 */ const hashFilename = name => {
  /* 24 */   return crypto
  /* 25 */       .createHash("md4")
  /* 26 */       .update(name)
  /* 27 */       .digest("hex")
  /* 28 */       .slice(0, 5); // 默认8无法配置
  /* 29 */ };
  ```

## 部署

完整 nginx 配置如下

```bash
user root;
worker_processes 1;

# error_log /var/log/nginx/error.log warn;
# pid /var/run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  # log_format main '$remote_addr - $remote_user [$time_local] "$request" '
  #                 '$status $body_bytes_sent "$http_referer" '
  #                 '"$http_user_agent" "$http_x_forwarded_for"';
  # access_log /var/log/nginx/access.log main;

  sendfile on;
  # tcp_nopush on;

  keepalive_timeout 90;
  # underscores_in_headers on; # 允许带下划线的请求头

  # 开启gZip(图片除外)
  gzip on;
  gzip_vary on;
  gzip_static on;
  gzip_proxied any;
  gzip_comp_level 3;
  gzip_min_length 3k;
  gzip_buffers 32 16k;
  gzip_types application/xml application/json application/ld+json application/rss+xml application/atom+xml application/xhtml+xml application/font-woff application/x-font-ttf application/x-javascript application/javascript application/x-httpd-php application/x-font-woff application/vnd.geo+json application/octet-stream application/manifest+json application/vnd.ms-fontobject application/x-web-app-manifest+json font/opentype text/vtt text/css text/plain text/vcard text/javascript text/x-component text/cache-manifest text/vnd.rim.location.xloc text/x-cross-domain-policy image/svg+xml;

  server {
    # http
    listen 1207;
    listen [::]:1207;
    # https + http2
    listen 9527 ssl http2;
    listen [::]:9527 ssl http2;

    ssl_certificate /etc/nginx/ssps.crt; # 证书
    ssl_certificate_key /etc/nginx/ssps.key; # 私匙
    ssl_session_cache shared:SSL:5m; # 共享会话缓存大小
    ssl_session_timeout 15m; # 会话超时时间
    # ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    # ssl_ciphers HIGH:!aNULL:!MD5; # 定义算法
    # ssl_prefer_server_ciphers on; # 优先采取服务器算法

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always; # HSTS策略
    add_header X-Frame-Options DENY; # 减少点击劫持
    add_header X-Content-Type-Options nosniff; # 禁止服务器自动解析资源类型
    add_header X-Xss-Protection 1; # 防XSS攻擊

    client_max_body_size 50m; # 请求体大小限制 for上传文件
    fastcgi_intercept_errors on; # 拦截(替换)代理服务的错误页

    error_page 500 502 503 504 413 /50x.html; # 错误页
    error_page 404 403 /404.html; # 未知页
    location /(50x|404).html {
      expires 7d;
      root /home/sspc2.0/Web/front;
    }

    location / {
      # 设置静态资源缓存(文件名带内容哈希)
      if ($uri ~ .*\.(js|css|jpg|jpeg|gif|png|ico|gz|svg|svgz|ttf|eot|mp4)$) {
        expires 7d; # 7天
      }
      # html(文件名不变)
      if ($uri ~ .*\.(htm|html)$) {
        expires 25m; # 25分钟
        # add_header Cache-Control private,no-store,no-cache,must-revalidate,proxy-revalidate;
      }

      index index.html;
      alias /home/sspc2.0/Web/front/;
      try_files $uri $uri/ $uri.html / =404;
    }
    location /api/ {
      proxy_pass http://192.168.130.119:9080/;
    }
    location /workflow/ {
      add_header X-Frame-Options SAMEORIGIN;
      proxy_cookie_path /cloud_workflow /workflow;
      proxy_pass http://192.168.130.119:8070/cloud_workflow/;
    }
  }
}
```