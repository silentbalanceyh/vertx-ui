import React from 'react'
import Ux from 'ux'
import {Fn, UI} from 'app';
import Demo from './UI.Demo';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .state({
        md: undefined, // Markdown源代码
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
        const demo = Ux.fromHoc(this, "demo");
        return (<UI {...Ux.toUniform(this.props)}
                    $markdown={$markdown}
                    $source={$source}
                    $configuration={$configuration}>
            <Demo reference={this}>
                {Fn.demoMessage(this)}
                {Fn.demoButtons(this, demo.buttons)}
            </Demo>
        </UI>);
    }
}

export default Component