import React from 'react';
import Op from './Op';
import Ex from 'ex';
import Ux from 'ux';
import {ExForm} from 'ei';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.View")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiForm(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.props;
            const {$form = {}} = this.state;
            const form = Ex.yoForm(this, {
                form: $form,
            }, $inited);
            return (
                <ExForm {...form} $height={"300px"}
                        $op={Op.actions}/>
            );
        });
    }
}

export default Component;