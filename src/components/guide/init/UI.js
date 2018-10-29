import React from 'react'
import Ux from "ux";
import {Fn} from "app";

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
            require('./md/Markdown.T.Init.md'),
            require('./md/Markdown.T.Build.md')
        )
    }

    render() {
        return Fn.guide(this,
            "1.代码下载",
            "2.初始化环境"
        );
    }
}

export default Component