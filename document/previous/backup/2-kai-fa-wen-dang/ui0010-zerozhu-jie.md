# UI0010 - zero注解

zero注解使用了ES7中的核心语法，是Zero UI的核心，它可以方便我们将一些无关逻辑的配置信息抽取出来放到组件之外，而保持组件本身的单纯性。该注解的所有方法可以从[http://localhost:5000/classes/zero.html\#tab\_index ](http://localhost:5000/classes/zero.html#tab_index查看，API工具可参考【[Reference]%28/document/3-jiao-shou-jia-jie-xi/ut0001-yuidocgong-ju-sheng-cheng-api-wen-dang.md%29】。)查看，API工具可参考【[Reference](/document/backup/3-jiao-shou-jia-jie-xi/ut0001-yuidocgong-ju-sheng-cheng-api-wen-dang.md)】。

## 1. State配置

State状态只能配初始状态，更新态在代码里面，所以不用考虑更新态的处理流程，其代码段如下：

```js
import Ux from 'ux';
const {zero, Logger} = Ux;
// 状态配置
@zero({
    state: {
        $selectedData: [],
        $selectedRoom: undefined,
        $filters: {}
    }
})
class Component extends React.PureComponent {
    render(){
        // 状态的使用
        const {$selectedData} = this.state;
        ...
    }
}
```

## 2. 资源文件绑定

资源文件绑定想对复杂一点，参考下边文件目录：

```shell
# 环境变量Z_LANGUAGE = cn
container/hotel-admin/UI.Account.js
container/hotel-admin/Cab.json
cab/cn/container/hotel-admin/UI.Account.json
```

### 2.1.Cab.json

指定当前文件的名空间`ns`，主要指定路径，名空间从`cab/${language}`之下开始计算

```json
{
    "ns": "container/main/hotel-admin"
}
```

### 2.2.UI.Account.json

资源文件配置信息，只能是Json，不支持JsonArray，根节点必须带下划线前缀：

```json
{
    "_menu": [
        {
            "key": "key.menu.user",
            "icon": "user",
            "text": "个人中心"
        },
        {
            "key": "key.menu.setting",
            "icon": "setting",
            "text": "设置"
        },
        {
            "key": "key.menu.lock",
            "icon": "lock",
            "text": "修改密码"
        },
        {
            "key": "key.menu.divide",
            "divide": true
        },
        {
            "key": "key.menu.logout",
            "icon": "logout",
            "text": "退出登录",
            "op": "logout"
        }
    ]
}
```

### 2.3.UI.Account.js

```js
import Ux from 'ux';
const { zero, Logger } = Ux;
@zero({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "UI.Account"
})
class Component extends React.PureComponent {
    render(){
        // 使用代码，读取menus
        const $menus = Ux.fromHoc(this,"menu");
        // 这里拿到的$menus就是DataArray
        ...
    }
}
```

## 3. Redux配置

Redux配置基本上没有变更原始配置，除了使用了StateIn（[UI0009 - StateIn中的r系列API](/document/previous/backup/2-kai-fa-wen-dangen-dang/ui0009-stateinzhong-de-r-xi-lie-api.md)）：

```js
@zero({
    connect: {
        s2p : state => Ux.dataIn(state)
            .rework({datum : ["menus", "hotel"]})
            .revamp(["app", "user"]).to(),
        d2p: {
            fnApp : Types.fnApp,
            fnHotel : Types.fnHotel,
            fnOut : Taper.fnFlush
        }
    }
})
class Component extends React.PureComponent {
    render(){
        // 使用流程
        const { fnApp, fnHotel, fnOut } = this.props;
        const { $app, $user, $menus, $hotel } = this.props;
        ...
    }
}
```

## 4. Loading效果

Zero UI提供了加载效果，加载效果的触发条件在于设置的变量信息，加载一般和Redux配合使用，用法如：

```js
@zero({
    connect: {
        s2p : state => Ux.dataIn(state)
            .rework({datum : ["menus", "hotel"]})
            .revamp(["app", "user"]).to(),
        d2p: {
            fnApp : Types.fnApp,
            fnHotel : Types.fnHotel,
            fnOut : Taper.fnFlush
        }
    }
    loading : ["hotel", "menus"],
})
class Component extends React.PureComponent {
    // $hotel, $menus两个变量都继承了DataContainer
    // 只有在两个变量的is()返回为true时才会调用render()方法，否则就会一直Loading
    // 如果是空数据如{}，[]也可以让is()返回false，但是一旦调用了dirty方法就会进入Loading流程
    render(){
        ...    
    }
}
```

## 5. 打开日志

打开日志只需要配置，则你不需要写任何日志代码，系统会在Console中打印彩色日志，日志API可参考Logger用法【参考：[http://10.0.0.7:5000/classes/Log.html】配置片段如下：](http://10.0.0.7:5000/classes/Log.html】配置片段如下：)

```js
import Ux from 'ux';
const {zero, Logger} = Ux;
@zero({
    logger: Logger.container
})
class Component extends React.PureComponent {
    ...
}
```

## 6. 高阶操作

高阶操作主要用于提供高阶函数Op，实现事件本身的穿透效果，这样可以区分高阶/绑定/执行三种不同的函数

```js
import Ux from 'ux';
const {zero, Logger} = Ux;
@zero({
    op : {
        "collapse" : Op.fnCollapse
    }
})
class Component extends React.PureComponent {
    render(){
        // 需要注意的是op从状态中取
        const {$op = {}} = this.state;
        return (
            <a href="#" fnCollapse={$op.collapse(this)}>高阶测试</a>
        )
    }
}
```

## 7. 表单操作

表单操作最简单，主要是引入了Ant Design中的Form，可调用Ant Design中的Form相关的API

```js
import Ux from 'ux';
const {zero, Logger} = Ux;
@zero({
    form:true
})
class Component extends React.PureComponent {
    render(){
        const { form } = this.props;
        ....
    }
}
```

## 8. 总结

zero暂时的功能只提供了以上几种，后续有其他功能引入时，再回过头来更新该文档，最终的目的很简单，是实现`render`方法和JSX中的逻辑连贯性以及直接性，zero本身就是一个`High Order Component`

