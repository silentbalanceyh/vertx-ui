# UI0002 - 环境变量

基础环境变量部分介绍整个Zero App中常用的环境变量，通过设置环境变量来实现不同应用同一个云环境的部署，Zero中提供的常用环境变量如下：

| 环境变量 | 脚本中引用方法 | 环境变量说明 |
| :--- | :--- | :--- |
| PORT | 无 | 当前App运行的端口号 |
| APP\_LANGUAGE | Ux.Env.$LANG | 当前App运行的语言标识符，该语言标识符会对应到cab包中的目录，如默认语言为：cn，则所有资源文件目录位于：src/cab/cn/目录下 |
| APP\_ENDPOINT | Ux.Env.$ENDPOINT | 当前App需要连接的远程后端EndPoint地址，前后端分离架构下专用 |
| APP\_NAME | Ux.Env.$APP | 当前App的名称，该名称为系统唯一标识符 |
| APP\_ROUTE | Ux.Env.$PATH | 当前App的动态路由根路径，不同的应用该值应该设置为不同，所有的React Router的路径都是放在该变量下运行 |
| KEY\_SESSION | Ux.Env.$K\_SESSION | 当前App在使用SessionStorage时对应的Key前缀，默认使用@@ZUI/，使用前缀可在同一个浏览器中登陆不同的App应用且不会有数据冲突 |
| KEY\_EVENT | Ux.Env.$K\_EVENT | 当前App使用的Redux状态时候的事件前缀，用于区分不同Redux行为专用，默认值为@@ZUI-ACT |
| DEV\_DEBUG | Ux.Env.$DEBUG | 是否开启Debug模式，Debug模式中才可看见对应的日志信息 |



