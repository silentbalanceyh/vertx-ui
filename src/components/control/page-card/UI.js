import React from 'react'
import Ux from 'ux'
import {Fn, UI} from 'app';

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
        Fn.markdown(this, require('./UI.Desc.md'))
    }

    render() {
        const $markdown = Fn.markdownPrepare(this, "UI.js");
        return (<UI {...Ux.toUniform(this.props)}
                    $markdown={$markdown}>
            Hello
        </UI>);
    }
}

export default Component