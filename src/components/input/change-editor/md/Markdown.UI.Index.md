### 1.说明

入口说明文件，什么都不做，仅连接左右面板和提交后的面板。

### 2.代码

```js
    import React from 'react'
    import Ux from 'ux';
    import {FormPanel} from 'app';
    import Left from './UI.Left';
    import Right from './UI.Right';
    import $inited from './inited';

    class Component extends React.PureComponent {
        render() {
            return (
                <FormPanel reference={this} $inited={$inited}>
                    {Ux.aiGrid([12, 12],
                        <Left {...this.props}
                              reference={this}/>,
                        <Right {...this.props}
                               reference={this}
                               $inited={$inited}/>)}
                </FormPanel>
            )
        }
    }

    export default Component
```