import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExTab} from 'ei';

import FormPassword from './form/UI.Password';
import FormSearch from './form/UI.Search';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Search")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const tabs = Ux.fromHoc(this, "tabs");
        const inherit = Ex.yoAmbient(this);
        return (
            <ExTab config={tabs}>
                <FormSearch {...inherit}/>
                <FormPassword/>
            </ExTab>
        );
    }
}

export default Component;