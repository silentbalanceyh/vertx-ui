# UI0002 - 环境变量

基础环境变量部分介绍整个Zero App中常用的环境变量，通过设置环境变量来实现不同应用同一个云环境的部署，Zero中提供的常用环境变量如下：

| 环境变量 | 脚本中引用方法 | 环境变量说明 |
| :--- | :--- | :--- |
| PORT | 无 | 当前App运行的端口号 |
| APP\_LANGUAGE | Ux.Env.LANG | 当前App运行的语言标识符，该语言标识符会对应到cab包中的目录，如默认语言为：cn，则所有资源文件目录位于：src/cab/cn/目录下 |
| APP\_ENDPOINT | Ux.Env.ENDPOINT | 当前App需要连接的远程后端EndPoint地址，前后端分离架构下专用 |
| APP\_NAME | Ux.Env.APP | 当前App的名称，该名称为系统唯一标识符 |
| APP\_ROUTE | Ux.Env. |  |



