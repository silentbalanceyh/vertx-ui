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
        return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op)}, 1)
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
        return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op, true)}, 1)
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
        return Ux.uiFieldFilter(this, {...Ux.ai2FilterButton(1 / 3)}, 1)
    }
}

export default Component
```

#### ------------------------------------------------------ Act.Epic.js

```javascript
import Ux from "ux";
import Types from "./Act.Types";
import Mock from './a-mock';

export default {
    fnDeptList: Ux.rxEdict(Types.fnDeptList,
        params => Ux.ajaxPost("/api/depts/search", params, Mock),
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

const $opSave = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    Ux.ajaxPut("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "edit", () => {
            console.info("更新成功：", data);
            reference.props.fnClose();
        }))
});
const $opAdd = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    Ux.ajaxPost("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "add", () => {
            console.info("添加成功：", data);
            reference.props.fnClose();
        }))
});
const $opReset = (reference: any) => (event: any) => {
    event.preventDefault();
    Ux.formReset(reference);
};
export default {
    $opSave,
    $opAdd,
    $opReset
}
```