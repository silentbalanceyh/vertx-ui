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
            require('./md/Markdown.UI.Demo.Form.md'),
            require('./md/Markdown.UI.Demo.Form.Edit.md'),
            require('./md/Markdown.UI.Demo.Form.Dialog.md'),
            require('./md/Markdown.Op.md'),
            require('./md/Markdown.Op.Sub.md'),
        )
    }

    render() {
        return Fn.ui(this, "UI.Tree",
            "UI.Demo",
            "UI.Demo.Filter",
            "UI.Demo.Form",
            "UI.Demo.Form.Edit",
            "UI.Demo.Form.Dialog",
            "UI.Demo.js",
            "UI.Demo.Filter.js",
            "UI.Demo.Form.Add.js",
            "UI.Demo.Form.js",
            "UI.Demo.Form.Edit.js",
            "UI.Demo.Form.Dialog.js",
            "Op.ts",
            "Op.Sub.ts"
        )(
            <Demo reference={this}
                  rxInject={Fn.injectOptFun(this)}
                  rxSet={Fn.injectSet(this)}/>
        )
    }
}

export default Component