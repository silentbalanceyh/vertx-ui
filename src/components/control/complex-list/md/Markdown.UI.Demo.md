
### 2.代码

```javascript
    import React from 'react'
    import Ux from "ux";
    import {ComplexList} from 'web';
    import Types from './Act.Types';
    import Filter from './UI.Demo.Filter';
    import FormAdd from './UI.Demo.Form.Add';
    import FormEdit from './UI.Demo.Form.Update'
    import Mock from './a-mock'

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo")
        .connect({
            rxSearch: Types.fnDeptList
        }, true)
        .to()
    )
    class Component extends React.PureComponent {

        render() {
            return <ComplexList {...this.props}
                                $mockData={Mock}
                                reference={this}
                                $formFilter={Filter}
                                $formAdd={FormAdd}
                                $formEdit={FormEdit}/>
        }
    }
    export default Component
```