import React from 'react'
import Ux from 'ux'
import {Fn} from 'app';
import Demo from './UI.Demo';

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
        Fn.markdown(this,
            require('./md/Markdown.UI.Demo.md'),
            require('./md/Markdown.UI.Demo.Filter.md'),
            require('./md/Markdown.UI.Demo.Form.Add.md'),
            require('./md/Markdown.UI.Demo.Form.Edit.md'),
            require('./md/Markdown.Op.md'),
        )
    }

    render() {
        return Fn.ui(this, "UI.Tree",
            "UI.Demo", "UI.Demo.Filter", "UI.Demo.Form",
            "UI.Demo.js", "UI.Demo.Filter.js",
            "UI.Demo.Form.Add.js", "UI.Demo.Form.Edit.js",
            "Op.ts")(
            <Demo reference={this} rxInject={Fn.injectOptFun(this, "op.add")}/>
        )
    }
}

export default Component