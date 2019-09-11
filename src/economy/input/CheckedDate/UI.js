import React from 'react';
import Ux from 'ux';
import "./Cab.less";
import {Input} from "antd";
import Rdr from './UI.Render';
import moment from 'moment';

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        const state = Ux.xtInit(props);
        if (state.date) {
            if (!moment.isMoment(state.date)) {
                state.date = moment(state.date);
            }
        }
        this.state = state;
    }

    render() {
        return (
            <Input.Group compact>
                {Rdr.renderRadioBox(this)}
                {Rdr.renderDatePicker(this)}
            </Input.Group>
        );
    }
}

export default Component;