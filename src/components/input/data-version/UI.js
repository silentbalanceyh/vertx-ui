import React from 'react'
import Ux from 'ux'
import {Fn} from 'app';
import Index from './UI.Index';

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
    render() {
        return Fn.ui(this, "UI.Tree"
        )(
            <Index reference={this}
                   rxInject={Fn.injectOptFun(this)}
                   rxSet={Fn.injectSet(this)}/>
        )
    }
}

export default Component