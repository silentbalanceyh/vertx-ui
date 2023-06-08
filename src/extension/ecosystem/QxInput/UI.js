import React from 'react';
import {Checkbox, Input} from "antd";
import Ux from 'ux';
import Op from './Op';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "QxInput";
const componentInit = (reference) => {
    const state = {};
    const {config = {}} = reference.props;

    const {
        placeholder, style = {},
        match = {},
        keyword = []
    } = config;
    state.$keyword = keyword;
    // max-width: 160 / 200
    if (!style.width) {
        style.width = 200;
    }

    if (match.enabled) {
        const $match = {};
        $match.label = match.label;
        state.$match = $match;
    } else {
        style.width = style.width - 40;
    }

    const $input = {};
    $input.placeholder = placeholder;
    $input.allowClear = true;
    $input.style = style;
    state.$input = $input;
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$input = {}, $match} = this.state;
            const {value = {}} = this.props;
            const attrQx = Sk.mixQx(UCA_NAME);
            return (
                <div {...attrQx}>
                    <Input.Search {...$input}
                                  value={value.keyword}
                                  onChange={Op.rxChange(this, false)}
                                  onSearch={Op.rxChange(this, true)}/>
                    {$match ? (
                        <Checkbox checked={!!value.match}
                                  onChange={Op.rxMatch(this)}>
                            {$match.label}
                        </Checkbox>
                    ) : false}
                </div>
            )
        })
    }
}

export default Component