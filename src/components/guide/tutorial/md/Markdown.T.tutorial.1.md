本文主要介绍如何使用Zero UI开发框架，开发你的第一个页面。

前提：Zero UI本地开发环境已搭建。参考'UI0001 - 项目初始化'




## 步骤



1. 在首页index中加入你的页面链接显示:

```bash
    文件路径：src/cab/cn/components/admin/index/UI.Page.Guide.json
    找到UI-开发教程中的children节点
    添加一行记录，即页面链接显示名称和路径
    添加好后就可以在主页看到新添加的目录，序号颜色都是自动生成
    
```





2. 根据页面路径，建立对应的UI.json文件，以本页面为例


```bash
    文件路径：src/cab/cn/components/guide/tutorial/UI.json
    
    {
        "_page": {
            "title": "「基础教程」创建第一个页面",
            "back": {
                "state": {
                    "todos": null,
                    "datums": null
                }
            }
        },
        "_chapter": [
            "1.操作步骤",
            "2.运行截图"
        ]
    }
    
```





3. 在src/components/guide/init 目录中创建UI.js文件（具体代码含义，参考后面章节）

```bash
    import React from 'react'
    import Ux from "ux";
    import {Fn} from "app";
    
    const {zero} = Ux;
    
    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI")
        .state({
            md: undefined, // Markdown源代码
            set: {},  // 继承属性到Demo中
        })
        .to()
    )
    class Component extends React.PureComponent {
        componentDidMount() {
            Fn.markdown(this,
                require('./md/Markdown.T.tutorial.1.md'),
                require('./md/Markdown.T.tutorial.2.md')
            )
        }
    
        render() {
            return Fn.guide(this);
        }
    }
    
    export default Component
```

4. 在 src/components/guide/tutorial 目录中创建Cab.json文件（名空间链接文件，用于链接步骤2和步骤3中创建的两个文件。）

```bash
    {
         "ns": "components/guide/tutorial"
    }
```


5. 向markdown文本文件中填充内容即可

## 结果

完成上边的步骤过后，页面已经建立好，可以保存文件后，通过启动./run-zero.sh脚本启动，看到你的第一个页面

