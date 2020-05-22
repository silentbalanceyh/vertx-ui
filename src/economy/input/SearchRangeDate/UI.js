import React from 'react';
import {component} from "../../_internal";
import Op from './Op';
import Ux from "ux";
import {Input} from 'antd';
import renderJsx from './Web';

@component({
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
    componentDidMount() {
        Op.yiDefault(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.xtReset(this, {props: prevProps, state: prevState},
            (value) => Op.yiValue(this, value));
    }

    render() {
        const {reference, config = {}, ...rest} = this.props;
        /*
         * mode 选择
         */
        const {mode = "FULL"} = config;
        const {$data = {}} = this.state;
        return (
            <Input.Group {...rest}>
                {renderJsx(this, mode, $data)}
            </Input.Group>
        );
    }
}

export default Component;