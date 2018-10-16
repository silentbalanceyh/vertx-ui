import React from 'react';
import Ux from 'ux';
import {Input} from 'antd';
import Rdr from './UI.Render';
import Op from "./Op";

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInit(props);
    }

    componentDidUpdate(prevProps) {
        Ux.xtReset(this, Op.getDefault());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    render() {
        const {config = {}} = this.props;
        const {from, to} = config;
        return (
            <Input.Group compact>
                {Rdr.renderTime(this, from, "from")}
                &nbsp;&nbsp;-&nbsp;&nbsp;
                {Rdr.renderTime(this, to, "to")}
            </Input.Group>
        );
    }
}

export default Component;