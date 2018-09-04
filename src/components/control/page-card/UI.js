import React from 'react'
import Ux from 'ux'
import {Fn, UI} from 'app';
import Demo from './UI.Demo';
import {AttrSetter} from 'web';

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
        Fn.markdown(this, require('./Markdown.UI.md'))
    }

    render() {
        const $markdown = Fn.prepareMarkdown(this, "UI.Demo.js");
        const $configuration = Fn.prepareTree(this, "UI.Tree");
        const $source = Fn.prepareJson(this, "UI.Demo");
        // 示例代码
        const demo = Ux.fromHoc(this, "demo");
        const {set = {}} = this.state;

        return (<UI {...Ux.toUniform(this.props)}
                    $markdown={$markdown}
                    $source={$source}
                    $configuration={$configuration}>
            <Demo reference={this}
                  $status={set}>
                {/** 示例代码 **/}
                {Fn.demoMessage(this)}
                {Fn.demoButtons(this, demo.buttons)}
            </Demo>
            <AttrSetter reference={this}/>
        </UI>)
    }
}

export default Component