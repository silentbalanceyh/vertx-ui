import React from 'react';
import {uca} from "zi";
import Rdr from './Web';
import __Zn from '../zero.uca.dependency';

const UCA_NAME = "GroupSwitcher";
@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const {
            readOnly = false,
            config = {},
        } = this.props;
        const ref = __Zn.onReference(this, 1);
        const {bind} = config;
        let values = [];
        if (bind) {
            values = __Zn.formGet(ref, bind);
        }
        return (
            <div>
                {readOnly ? Rdr.renderView(this, values) : Rdr.renderEdit(this, values)}
            </div>
        )
    }
}

export default Component