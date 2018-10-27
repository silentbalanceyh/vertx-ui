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
            require('./md/Markdown.T.Build.md'),
        )
    }

    render() {
        console.info(this.props, this.state);
        return (
            <div>2018/10/27</div>
        )
    }
}

export default Component