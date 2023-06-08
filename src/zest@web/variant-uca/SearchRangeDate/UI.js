import React from 'react';
import Op from './Op';
import renderJsx from './Web';


import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';
const UCA_NAME = "SearchRangeDate";
// =====================================================
// componentInit/componentUp
// =====================================================
@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        $data: {
            start: null,
            end: null
        }
    }
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        Op.yiDefault(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        __Zn.xtReset(this, {props: prevProps, state: prevState},
            (value) => Op.yiValue(this, value));
    }

    render() {
        const {reference, config = {}, ...rest} = this.props;
        /*
         * mode 选择
         */
        const {mode = "FULL"} = config;
        const {value = {}} = this.props;
        const WebField = __Zn.V4InputGroup;
        return (
            <WebField {...rest} className={"web-range-date"}>
                {renderJsx(this, mode, value)}
            </WebField>
        );
    }
}

export default Component;