# UI0002 - 环境变量

基础环境变量部分介绍整个Zero App中常用的环境变量，通过设置环境变量来实现不同应用同一个云环境的部署，Zero中提供的常用环境变量如下：

## 1. 基础环境变量

| 外部环境变量 | 脚本中引用方法 | 环境变量说明 |
| :--- | :--- | :--- |
| PORT | 无 | 当前App运行的端口号 |
| Z\_APP | Ux.Env.APP | 当前App的名称，该名称为系统唯一标识符 |
| Z\_ENDPOINT | Ux.Env.ENDPOINT | 当前App需要连接的远程后端EndPoint地址，前后端分离架构下专用 |
| Z\_LANGUAGE | Ux.Env.LANGUAGE | 当前App运行的语言标识符，该语言标识符会对应到cab包中的目录，如默认语言为：cn，则所有资源文件目录位于：src/cab/cn/目录下 |
| Z\_ROUTE | Ux.Env.ROUTE | 当前App的动态路由根路径，不同的应用该值应该设置为不同，所有的React Router的路径都是放在该变量下运行 |
| Z\_K\_SESSION | 无（用于构造Session专用） | 当前App在使用SessionStorage时对应的Key前缀，默认使用@@ZUI/，使用前缀可在同一个浏览器中登陆不同的App应用且不会有数据冲突 |
|  | Ux.Env.KEY\_APP | 当前应用保存的SessionStorage |
|  | Ux.Env.KEY\_USER | 当前应用保存的用户专用Session |
| Z\_K\_EVENT | Ux.Env.KEY\_EVENT | 当前App使用的Redux状态时候的事件前缀，用于区分不同Redux行为专用，默认值为@@ZUI-ACT |
| Z\_DEV\_DEBUG | Ux.Env.DEBUG | 是否开启Debug模式，Debug模式中才可看见对应的日志信息 |
| Z\_DEV\_MOCK | Ux.Env.MOCK | 是否打开全局的Mock功能，如果打开就可以支持Mock分离于后端的开发模式 |
|  | Ux.Env.HTTP11 | HTTP1.1的头文件常量 |
|  | Ux.Env.HTTP\_METHOD | Http方法常量 |
|  | Ux.Env.MIMES | 常用MIME映射文件 |
| Z\_CSS\_PREFIX | Ux.Env.CSS\_PREFIX | 当前站点的风格文件专用前缀设置，该设置需要定义Less的全局变量@app |
| Z\_SHARED | Ux.Env.SHARED | 全局Epic和Types共享目录名称，默认值为app，所以共享内容位于src/app/action的目录下 |
| Z\_ENTRY\_LOGIN | Ux.Env.ENTRY\_LOGIN | 当前应用的登录首页 |
| Z\_ENTRY\_ADMIN | Ux.Env.ENTRY\_ADMIN | 当前应用的管理首页【带登录控制】，关于管理首页可以直接将该页面开发成根据不同角色的分离器，这样就可以完成应用入口根据不同授权的分离功能。 |

## 2. 第三方使用的环境变量

| 环境变量 | 脚本中引用方法 | 环境变量说明 |
| :--- | :--- | :--- |
|  |  |  |

## 3. 运行查看

如果你开的是Debug模式则可以看到浏览器中`Ux.Env`的输出：

![](/document/image/UI0002.png)

### 4. 设置位置

环境变量的设置位于环境变量文件`.env.development`：

```properties
PORT=4100
Z_LANGUAGE=cn
Z_ENDPOINT=http://localhost:7000
Z_APP=vie.app.htl
Z_ROUTE=ima
Z_SHARED=app
Z_ENTRY_LOGIN=/login/index
Z_ENTRY_ADMIN=/admin/index
Z_K_SESSION=@@IMA/
Z_K_EVENT=@@IMA-ACT
Z_DEV_DEBUG=true
Z_DEV_MOCK=true
```



