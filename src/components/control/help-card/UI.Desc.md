### 示例

```javascript
    import React from "react";
    import Ux from "ux";
    import {HelpCard} from "app";
    
    const {zero} = Ux;
    
    @zero(Ux.rxEtat(require("./Cab.json"))
        .cab("UI.Demo")
        .to()
    )
    class Component extends React.PureComponent {
        render(){
            return (
                <HelpCard reference={this}>
                    {/** 子控件 **/}
                </HelpCard>
            )
        }
    }
```