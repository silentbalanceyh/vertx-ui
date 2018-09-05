
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
        .search(Tps.fnDeptList)
        .to()
    )
    class Component extends React.PureComponent {

        render() {
            const {reference, ...rest} = this.props;
            return (
                <HelpCard reference={this}>
                    <ComplexList {...rest}
                                 parent={reference}
                                 reference={this}
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