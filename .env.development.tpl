# ------------------- Native环境变量 -------------------
# 服务器端口号说明，默认使用 7005
PORT=7005
# 前端运行主机地址
# HOST=0.0.0.0
WSD_OK=false

# ------------------- 后端对接 -------------------
# 「后端」Z_ENDPOINT 端地址
#  1. /hosts 中已添加 ox.engine.cn 映射（本机）
#  2. 6083 为 Zero Framework 后端框架默认端口号
Z_ENDPOINT=http://ox.engine.cn:7085
# 「后端」Z_APP 对应后端 X_APP 中的 name 配置
Z_APP=app.micro.scaffold

# ------------------- 业务基础配置 ---------------
# Z_TITLE 头部标题
Z_TITLE=测试系统
# Z_LANGUAGE 语言平台
Z_LANGUAGE=cn
# 启用 Zero Extension 扩展模块：X_ 自定义头
Z_X_HEADER_SUPPORT=true

# ------------------- 前端专用变量 ---------------
# React-Router 专用地址（生成路由）
Z_ROUTE=zo
# 会话前缀，多账号支持同一浏览器登录专用
Z_K_SESSION=@@ZO/
# 应用事件前缀，多应用支持同一浏览器登录专用
Z_K_EVENT=@@ZO-ACT
# 页面：登录页
Z_ENTRY_LOGIN=/login/index
# 页面：管理主页
Z_ENTRY_ADMIN=/main/index
# 页面：密码初始化页
Z_ENTRY_FIRST=/personal/secure

# ------------------- 开发调试：Webpack ---------------
# 下边三个参数为 webpack 插件
# 「启动」打包尺寸插件
Z_DEV_PLUGIN_SIZE=false
# 「启动」循环依赖监测插件
Z_DEV_PLUGIN_LOOP=true
# 「启动」Loader耗时统计插件
Z_DEV_PLUGIN_SMP=false

# ------------------- 开发调试：插件 ---------------
# 应用插件目录 app@plugin 启用
Z_PLUGIN=true
# 模拟环境 app@mock 启用
Z_DEV_MOCK=false
# 开发辅助工具箱 HOME 键调出
Z_DEV_MONITOR=false

# ------------------- 开发调试：日志 ---------------
# 日志：基本调试日志 dgDebug
Z_DEV_DEBUG=true
# 日志：远程专用日志
Z_DEV_AJAX=false
# 日志：表单引擎日志
Z_DEV_FORM=true

# ------------------- 样式处理 ---------------
# 样式：应用样式处理
Z_SHARED=hm
# 样式：应用皮肤处理
Z_CSS_SKIN_MODULE=HM
# 样式：深色 / 浅色模式
Z_CSS_SKIN_NAME=NormLight
# 样式：是否带风格调整工具
Z_CSS_SKIN_TOOL=true
# 样式：是否带阴影效果
Z_CSS_SHADOW=true
# 样式：全局关键色
Z_CSS_COLOR="#36648b"
# 样式：全局字体
Z_CSS_FONT=14
# 样式：默认圆角
Z_CSS_RADIUS=4