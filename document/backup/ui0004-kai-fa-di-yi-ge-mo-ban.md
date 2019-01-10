# UI0004 - 开发第一个模板

本文创建一个登陆界面的模板，同时讲解如何使用Zero UI开发一个模板页，前文已经提到过了，模板在路由中有特殊配置，Zero UI中并没有使用模板引擎，而且在很多场景中也没有必要。

## 1.创建模板

> 由于目前的模板不存在资源文件，所以不需要在`cab`目录下创建绑定的资源文件；

直接创建`src/container/login/index/UI.js`文件，并且创建配套的资源链接文件和风格文件

```shell
src/container/login/index/UI.js
src/container/login/index/Cab.json
src/container/login/index/Cab.less
src/container/login/index/image/bg.jpg
```

## 2.书写Less风格文件

`Cab.less`文件的内容如下：

```css
@import "../../../global";
/** 引用全局的@app变量，不同应用的app变量不同 **/
.@{app} {
    @prefix: login;
    &-@{prefix}{
        &-container{
            position: absolute;
            width: 100%;
            height: 100%;
            background-repeat:no-repeat;
            background-size:100% 100%;
        }
        &-content{
            position: relative;
            top: 25%;
            z-index: 1001;
            width: 500px;
            margin: auto;
            padding: 30px 40px 40px;
            border-radius: 10px;
            background-color: #fff;
        }
    }
}
```

这种写法会生成下边两个css的类：

```shell
ima-login-container
ima-login-content
```

## 3.资源链接文件

资源链接文件不是必须的，一般是在使用`src/cab/cn/`下的资源文件时才会使用到，因为当前模板没有使用，所以这里不考虑，但为了方便开发以及防止`require`的错误，推荐是在每个目录下写入资源文件，资源文件格式如：

```json
{
    "ns":"container/login/index"
}
```

## 4.模板代码

模板代码`UI.js`的内容如下：

```js
import "./Cab.less"
import React from 'react'
import Ux from 'ux';

class Component extends React.PureComponent{

    render(){
        const { component: Component } = this.props;
        // Ux.toStyle会链接环境变量Z_CSS_PROFIX前缀
        return (
            <div {...Ux.toStyle("login-container",require("./image/bg.jpg"))}>
                <section {...Ux.toStyle("login-content")}>
                    <Component {...this.props}/>
                </section>
            </div>
        )
    }
}

export default Component;
```

这里需要说明的有以下：

* `this.props`中的变量`component`在每个模板文件中都存在，它表示页面组件引用；
* 这里使用`:`操作符进行了重命名的操作，所以才有后边的`<Component/>`的写法，根据React的命名规范，组件本身大写开头；
* 在引用`ima-login-container`和`ima-login-content`时调用了`Ux.toStyle`的方法，该方法会链接环境变量来生成最终的`className`属性，并将属性赋值给`<div>`标签；
* 在Jsx中使用Component时使用了属性完全继承，即将当前模板的`this.props`全部传入到页面组件中；

> 这里为什么要调用`Ux.toStyle`的API，其目的是在调用过程中只传入`login-container`以及`login-content`部分，如果改换一套风格也可以直接在这里进行操作，该设计是为了后期扩展，同时在不用的应用部署时不造成CSS的污染。

## 5.总结

通过上述的步骤，一个完整的模板就开发好了，接下来看看如何开发某个页面，并且访问到【[UI0005 - 开发第一个页面](/document/backup/ui0005-kai-fa-di-yi-ge-ye-mian.md)】。



