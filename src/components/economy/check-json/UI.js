import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Fn} from 'app';

import FmAdd from './UI.Add';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Fn.tplPage(this, {
            tabAdd: () => {
                return (
                    <FmAdd {...Ex.yoAmbient(this)}/>
                );
            }
        })
    }
}

export default Component