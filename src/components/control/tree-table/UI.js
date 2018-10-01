import React from 'react'
import Ux from 'ux'
import {Fn} from 'app';
import Index from './UI.Demo.Index';

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
            require('./md/Markdown.UI.Demo.Index.md'),
            require('./md/Markdown.UI.Demo.Dialog.Cat.md'),
            require('./md/Markdown.UI.Demo.Dialog.Procedure.md'),
            require('./md/Markdown.Op.md'),
            require('./md/Markdown.Op.Act.md'),
            require('./md/Markdown.Op.Func.md')
        )
    }

    render() {
        return Fn.ui(this, "UI.Tree",
            "UI.Demo",
            "UI.Demo.Index",
            "UI.Demo.Dialog.Cat",
            "UI.Demo.Dialog.Procedure",
            "UI.Demo.js",
            "UI.Demo.Index.js",
            "UI.Demo.Dialog.Cat.js",
            "UI.Demo.Dialog.Procedure.js",
            "Op.ts",
            "Op.Act.ts",
            "Op.Func.ts"
        )(
            <Index reference={this}
                   rxInject={Fn.injectOptFun(this)}
                   rxSet={Fn.injectSet(this)}/>
        )
    }
}

export default Component