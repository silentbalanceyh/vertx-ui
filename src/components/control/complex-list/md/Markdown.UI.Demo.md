
### 2.代码

```javascript
    import React from 'react'
    import Ux from "ux";
    import {Mock, Tps} from 'app';
    import {ComplexList, HelpCard} from 'web';
    import Filter from './UI.Demo.Filter';
    import FormAdd from './UI.Demo.Form.Add';
    import FormEdit from './UI.Demo.Form.Update'

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo")
        // 快速绑定专用方法，直接调用search并且绑定到一个Epic函数中生成rxSearch
        .search(Tps.fnDeptList)
        .to()
    )
    class Component extends React.PureComponent {

        render() {
            /**
             * 有一点需要说明，如果上层传入了this.props.reference，在往ComplexList
             * 中传入reference时，Jsx里会直接被reference={this}覆盖掉导致当前组件
             * 的父组件引用无法被传入，而ComplexList中的this.props.reference会指向
             * 当前组件。
             **/
            return (
                <HelpCard reference={this}>
                    <ComplexList {...this.props}
                                 reference={this}
                                 /**
                                  * Mock环境专用，传入模拟数据（数据本身为一个List），
                                  * 所有客户端行为根据该数据生成
                                  **/
                                 $mockData={Mock.fnDeptList}
                                 $formFilter={Filter}
                                 $formAdd={FormAdd}
                                 $formEdit={FormEdit}/>
                </HelpCard>
            )
        }
    }

    export default Component
```