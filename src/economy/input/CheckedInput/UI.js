import React from 'react';
import Ux from "ux";
import U from 'underscore';
import {Input} from 'antd';
import Rdr from "./UI.Render";
import Op from "./Op";

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        const state = Ux.xtInit(props);
        if (!U.isArray(state.checked)) {
            state.checked = [];
        }
        this.state = state;
    }

    // Required：更新数据，主要用于form中的Reset动作
    componentDidUpdate(prevProps) {
        Ux.xtReset(this, Op.getDefault());
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    render() {
        return (
            <Input.Group compact>
                {Rdr.renderCheckBox(this)}
                {Rdr.renderOther(this)}
            </Input.Group>
        );
    }
}

export default Component;