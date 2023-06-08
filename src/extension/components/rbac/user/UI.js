import React from 'react';
import Ux from 'ux';
import {ExTab} from 'ei';
import Ex from 'ex';

import ListUser from './UI.List';
import FormSearch from './UI.Search';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ex.yoRender(this, () => {
            const tabs = Ux.fromHoc(this, "tabs");
            const inherit = Ex.yoAmbient(this);
            return Ex.ylCard(this, () => (
                <ExTab {...inherit} config={tabs}>
                    <ListUser {...inherit}/>
                    <FormSearch {...inherit}/>
                </ExTab>
            ))
        }, Ex.parserOfColor("PxRBACUser").page());
    }
}

export default Component;