# Object写法（目前不推荐）

Object写法是老版本的@zero注解中的纯配置写法，语法如下：

```js
import Ux from 'ux';
import Types from './Act.Types';

const {zero} = Ux;

@zero({
    connect: {
        s2p: state => Ux
            .dataIn(state)
            .rework({datum: ["record"]})
            .radial([
                "model.clue",
                "model.selected"
            ], true)
            .rinit(['record'])
            .to(),                    // 1.状态树写法：StateToProp
        d2p: {
            fnOut: Ux.fnOut,          // 2.Redux中的dispatch写法：DispatchToProp
            fnRegistry: Types.fnRegistry
        }
    },
    loading: [                        // 3.遮罩效果
        "model.clue",
        "model.selected"
    ],
    "i18n.cab": require('./Cab.json'), // 4.1.配套设置名空间
    "i18n.name": "UI.Evaluation",      // 4.2.配套设置资源文件名称
    state: {
        $_tabs: {                      // 5.设置React状态
            "tabEvaluation": true,
            "tabPlan": true,
            "tabProcedure": true
        }
    }
})
class Component extends React.PureComponent {
    // 组件内代码
}
```

* 1.状态树部分的读取，参考：[UI0009 - StateIn中的r系列API](/document/backup/2-kai-fa-wen-dangen-dang/ui0009-stateinzhong-de-r-xi-lie-api.md)
* 2.调用Redux中的dispatch to props
* 3.loading：遮罩效果
  * 对于`Assist/Tabular`的遮罩效果，和前边的读、写状态树一样，传入键值即可；
  * 对于当前的其他数据，使用去`$`的变量名操作
  * 遮罩有两个条件：如`app`，`$app`变量必须不是undefined（可调用初始化动作），并且`$app.is()`必须返回true，这里再次强调一下：**如果是undefined的值，**`is()`**方法一定会返回false，而**`[]`**和**`{}`**都会返回true，有值也会返回true**。这里严格区分了undefined和空数据；
* 4.用于链接资源文件
  * 一方面`Cab.json`中保存了名空间，如果重构，只需要移动整个目录中的文件到另外的目录，并且修改名空间路径即可。
  * 另外每个组件的资源文件名和组件名应该绑定，如`UI.js`对应的资源文件应该是`UI.json`，至于路径由Zero解析。
* 5.等价于React的状态，可以在生命周期中调用`this.setState`来更新。



