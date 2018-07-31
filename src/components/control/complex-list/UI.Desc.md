### 示例

#### ------------------------------------------------------ UI.Demo.js

```javascript
import React from 'react'
import Ux from "ux";
import {ComplexList} from 'web';
import Types from './Act.Types';
import Filter from './UI.Demo.Filter';
import FormAdd from './UI.Demo.Form.Add';
import FormEdit from './UI.Demo.Form.Update'

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
                            reference={this}
                            $formFilter={Filter}
                            $formAdd={FormAdd}
                            $formEdit={FormEdit}/>
    }
}
export default Component
```

#### ------------------------------------------------------ UI.Demo.Form.Add.js

```javascript
import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form")
    .state({
        $op: Op
    })
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {
            $button: (reference) => Ux.aiFormButton(reference, Op)
        }, 1)
    }
}

export default Component
```

#### ------------------------------------------------------ UI.Demo.Form.Update.js

```javascript
import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form")
    .state({
        $op: Op
    })
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {
            $button: (reference) => Ux.aiFormButton(reference, Op, true)
        }, 1)
    }
}

export default Component
```

#### ------------------------------------------------------ UI.Demo.Filter.js

```javascript
import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Filter")
    .state({
        $op: Op
    })
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {
            $button: (reference, jsx) => {

                return false;
            }
        }, 1)
    }
}
export default Component
```

#### ------------------------------------------------------ Act.Epic.js

```javascript
import Ux from "ux";
import Types from "./Act.Types";
import Mock from './mock';

export default {
    fnDeptList: Ux.rxEdict(Types.fnDeptList,
        params => Ux.ajaxPost("/api/depts/search", params, Mock.fnDeptList),
        Ux.rxGrid
    )
};
```

#### ------------------------------------------------------ Act.Types.js

```javascript
import Ux from "ux";

export default {
    fnDeptList: Ux.createAction("/RX/MODULE/DEPT/SEARCH")
};
```

### ------------------------------------------------------ Op.ts

```typescript
import Ux from 'ux';

const $opSave = (reference: any) => Ux.ai2Event(reference, (values) => {

});
const $opAdd = (reference: any) => Ux.ai2Event(reference, (values) => {

});
const $opReset = (reference: any) => (event: any) => {
    
};
export default {
    $opSave,
    $opAdd,
    $opReset
}
```