import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExService")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        const reference = Ux.onReference(this, 1);
        return Ex.yoRender({
            ...this,
            props: {
                ...this.props,
                form: reference.props.form,
            }
        }, () => {
            const {$form = {}} = this.state;
            const {$inited = {}} = this.props;
            /*
             * 读取 form 引用
             */
            return Ux.aiFormInput(reference, $inited, $form);
        }, Ex.parserOfColor("ExService").form())
    }
}

export default Component;