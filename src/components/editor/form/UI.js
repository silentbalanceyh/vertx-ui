import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {FormDesigner} from 'web';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$data = {}} = this.state;
            return (
                <FormDesigner data={$data}/>
            );
        }, Ex.parserOfColor("PxFormEditor").page())
    }
}

export default Component