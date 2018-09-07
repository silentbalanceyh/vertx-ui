import React from 'react'
import Ux from 'ux'
import {Fn} from 'app';
import Demo from './UI.Demo';

console.info(Fn);
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
        Fn.markdown(this, require('./md/Markdown.UI.Demo.md'));
    }

    render() {
        // 示例代码
        const demo = Ux.fromHoc(this, "demo");
        // 特殊代码Hoc更改
        return Fn.ui(this, "UI.Tree", "UI.Demo", "UI.Demo.js")(
            <Demo reference={this}
                  $status={Fn.inject(this, "title")}>
                {/** 示例代码 **/}
                {Fn.demoMessage(this)}
                {Fn.demoButtons(this, demo.buttons)}
            </Demo>
        )
    }
}

export default Component