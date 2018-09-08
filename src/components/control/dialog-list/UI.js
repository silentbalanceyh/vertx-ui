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
            require('./md/Markdown.UI.Demo.Add.md'),
            require('./md/Markdown.UI.Demo.Add.Major.md'),
            require('./md/Markdown.UI.Demo.Edit.md'),
            require('./md/Markdown.UI.Demo.Edit.Major.md'),
            require('./md/Markdown.UI.Demo.Dialog.md'),
            require('./md/Markdown.Op.md'),
            require('./md/Markdown.Op.Act.md'),
            require('./md/Markdown.Op.Sub.md'),
        )
    }

    render() {
        return Fn.ui(this, "UI.Tree",
            "UI.Demo",
            "UI.Demo.Filter",
            "UI.Demo.Form",
            "UI.Demo.Add.Major",
            "UI.Demo.Edit.Major",
            "UI.Demo.Dialog",
            "UI.Demo.js",
            "UI.Demo.Filter.js",
            "UI.Demo.Add.js",
            "UI.Demo.Add.Major.js",
            "UI.Demo.Edit.js",
            "UI.Demo.Edit.Major.js",
            "UI.Demo.Dialog.js",
            "Op.ts",
            "Op.Act.ts",
            "Op.Sub.ts"
        )(
            <Demo reference={this}
                  rxInject={Fn.injectOptFun(this)}
                  rxSet={Fn.injectSet(this)}/>
        )
    }
}

export default Component