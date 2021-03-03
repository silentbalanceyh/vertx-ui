import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {Of} from 'app';

import ListUser from './UI.List';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ex.yoRender(this, () => {
            const inherit = Ex.yoAmbient(this);
            // 核心方法（主 Promise）
            inherit.rxSearch = Of.apiUserSearch;
            return (<ListUser {...inherit}/>)
        }, Ex.parserOfColor("PxAuthorizedUser").page());
    }
}

export default Component;