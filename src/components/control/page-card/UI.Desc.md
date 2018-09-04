### 示例

```javascript
    import React from "react";
    // 导入Ux包
    import Ux from "ux";
    // 导入组件PageCard的核心代码
    import {PageCard} from "app";

    // 提取zero的注解@zero
    const {zero} = Ux;
    
    @zero(Ux.rxEtat(require("./Cab.json"))
        .cab("UI")
        .to()
    )
    class Component extends React.PureComponent {
        render(){
            return (
                <PageCard reference={this}>
                    {/** 子控件 **/}
                </PageCard>
            )
        }
    }
```