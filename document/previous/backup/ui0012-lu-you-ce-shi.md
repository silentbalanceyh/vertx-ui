# UI0012 - 路由测试

路由测试的目的是让开发人员知道自己创建的目录在什么位置，如何进入路由编连，这个也是开发的第一课，Zero UI和其他脚手架不同，React-Router的信息是通过约定编程由计算机自己生成的，不存在手工路由一说。

## 1. 路由配置

目前的版本路由配置文件很简单，配置文件位于`src/route.json`中，内容如下：

```json
{
    "defined":"_hotel_admin",
    "special":{
        "_login_index":[
            "_login_index"
        ]
    }
}
```

上边的配置含义：

* 如果当前页面不指定任何路由，则默认使用第一个模板\`hotel admin\`；
* 如果路由存在于数组配置中，则使用`special`中的键对应的模板；

## 2. 添加新路由

添加新的路由在Zero UI中很简单，直接在`src/components`中创建一个新的目录，目录必须分两级

* 一级目录的业务含义为：模块，标识当前目录的模块是什么；
* 二级目录的业务含义为：页面，标识当前页面是什么；

> 不使用一级目录主要在于一级目录在分类过程中其平行扩展性问题，而二级目录已经可以满足大部分系统的需求了。

### 示例

创建一个新的目录：`order/search`，order表示订单模块，search表示订单搜索页

```shell
# 目录中需要创建UI.js的入口文件
src/components/order/search/UI.js
```

创建的新文件内容如：

```js
import React from 'react'

class Component extends React.PureComponent{
    render(){
        return (
            <div>Order/Search</div>
        )
    }
}

export default Component
```

没有特殊说明会使用`defined`中的模板；

## 3. 运行

在创建好该页面过后，需要重启服务器（启动过后和发布过程才会生成路由）。

### 3.1. 浏览器查看

在Zero UI的开发模式运行时，可以从报表中看到刚刚添加过的页面信息，直接打开[http://localhost:4100/ima/order/search](http://localhost:4100/ima/order/search) （在应用中**PORT**=4100，而**Z\_ROUTE**等于ima）可以看到下边界面

![](/document/previous/backupus/backup/image/UI0012-1.png)

在浏览器的console中（开发模式）可以看到如下输出：

![](/document/previous/backupus/backup/image/UI0012-2.png)

### 3.2. 源代码查看

查看`src/components/index.js`，可以看到更新（该文件不提交，每个人手中的这个文件可自动生成）。

```js
import _login_index from './login/index/UI';
import _order_search from './order/search/UI';
import _user_dashboard from './user/dashboard/UI';
import _user_password from './user/password/UI';
import _user_profile from './user/profile/UI';

export default {
    _login_index,
    _order_search,
    _user_dashboard,
    _user_password,
    _user_profile,
}
```

## 4. 总结

如何？是不是很简单？其实Zero UI的设计主要是想完成下边几个工作：

* 让开发人员忘掉繁琐的路径问题
  * `import`的相对路径问题；
  * 模块和模块之间的依赖路径问题；
  * `React-Router`的组件路径问题；
  * Ajax远程请求的路径问题；
* 让开发人员忘掉繁琐部署
  * 多语言环境部署
  * 多租户环境部署
* 让开发人员更集中，除了资源文件和**当前目录**，开发人员不需要关注细节逻辑，更容易集中于业务开发。



