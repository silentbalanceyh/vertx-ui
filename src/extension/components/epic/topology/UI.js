import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import {ExTab} from 'ei';
import List from './UI.List';
import Master from './master/UI';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.yiStandard(this)
    }

    render() {
        return Ex.ylCard(this, () => {
            const inherit = Ex.yoAmbient(this);
            const tabs = Ux.fromHoc(this, "tabs");
            const master = Ux.fromHoc(this, "graphic");
            return (
                <ExTab config={tabs}>
                    <List {...inherit}/>
                    <Master {...inherit} config={master}/>
                </ExTab>
            );
        }, Ex.parserOfColor("PxTopology").page())
    }
}

export default Component;