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
    componentDidMount() {
        Fn.markdown(this,
            require('./md/Markdown.UI.Left.md'),
            require('./md/Markdown.UI.Right.md'),
            require('./md/Markdown.Op.md'),
            require('./md/Markdown.Op.Act.md')
        )
    }

    render() {
        return Fn.ui(this, "UI.Tree",
            "UI.Left",
            "UI.Right",
            "UI.Left.js",
            "UI.Right.js",
            "Op.ts",
            "Op.Act.ts"
        )(
            <Index reference={this}
                   rxInject={Fn.injectOptFun(this)}
                   rxSet={Fn.injectSet(this)}/>
        )
    }
}

export default Component