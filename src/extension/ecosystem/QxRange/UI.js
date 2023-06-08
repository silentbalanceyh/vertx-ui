import React from 'react';
import Ux from 'ux';
import {DatePicker} from 'antd';
import Op from './Op';
import moment from 'moment';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "QxRange";
const {RangePicker} = DatePicker;

const componentInit = (reference) => {
    const state = {};
    const {config = {}} = reference.props;
    const {
        keyword,
        style = {},
        ...rest
    } = config;
    state.$keyword = keyword;
    const $picker = Ux.clone(rest);

    if (!style.width) {
        style.width = 360;
    }
    $picker.style = style;
    state.$picker = $picker;

    Ux.of(reference).in(state).ready().done();
    //state.$ready = true;
    //this.?etState(state);
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$picker = {}} = this.state;
            const {value = {}} = this.props;
            const defaultS = value.value ? value.value : [];
            const defaultV = [];
            defaultS.forEach(each => defaultV.push(moment(each)))

            const attrQx = Sk.mixQx(UCA_NAME);
            return (
                <div {...attrQx}>
                    <RangePicker {...$picker}
                                 value={defaultV}
                                 onChange={Op.rxClean(this)}
                                 onOk={Op.rxOk(this)}/>
                </div>
            )
        })
    }
}

export default Component