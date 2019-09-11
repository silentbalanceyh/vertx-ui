import React from 'react';
import Ux from "ux";
import U from 'underscore';
import {Input} from 'antd';
import Rdr from "./UI.Render";

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        const state = Ux.xtInit(props);
        if (!U.isArray(state.checked)) {
            state.checked = [];
        }
        this.state = state;
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