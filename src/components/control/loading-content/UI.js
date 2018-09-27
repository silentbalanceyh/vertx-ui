import React from 'react'
import Ux from 'ux'
import {Fn} from 'app';

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
    }

    render() {
        return Fn.ui(this, "UI.Tree",
        )(
            <div>Hello</div>
        )
    }
}

export default Component