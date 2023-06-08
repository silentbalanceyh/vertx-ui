import React from "react";
import Op from './Op';
import {Button, Input} from 'antd';

import __Zn from '../zero.uca.dependency';

const UCA_NAME = "InputArray";
const componentInit = (reference) => {
    const {value} = reference.props;
    let $data = [];
    if (__Zn.isArray(value)) {
        $data = value;
    }
    const state = {};
    state.data = $data;
    state.$holder = $data.length;

    __Zn.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}
const componentUp = (reference, virtualRef = {}) => {
    __Zn.xtRevert(reference, virtualRef, {
        reset: (values) => {
            if (undefined === values) {
                /* 无值重置 */
                __Zn.of(reference).in({
                    data: [],
                    $holder: 0
                }).done();
                // reference.?etState({data: [], $holder: 0});
            } else {
                /* 有值重置 */
                __Zn.of(reference).in({
                    data: values,
                    $holder: values.length
                }).done();
                // reference.?etState({data: values, $holder: values.length});
            }
        }
    })
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {state: prevState, props: prevProps});
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$holder = 0, data = []} = this.state;
            const {id = "", styleInput = {}, disabled = false} = this.props;
            /* 构造特殊数组 */
            const input = [];
            for (let idx = 0; idx < $holder; idx++) {
                input.push(idx);
            }
            return (
                <div className={"web-input-array"}>
                    {input.map(each => {
                        const key = `${id}-${each}`;
                        const value = data[each];
                        return (
                            <Input key={key} className={"input-segment"}
                                   addonAfter={__Zn.v4Icon("delete", {
                                       disabled,
                                       onClick: Op.onRemove(this, each)
                                   })} style={styleInput} onChange={Op.rxChange(this, each)}
                                   value={value} disabled={disabled}/>
                        );
                    })}
                    <Button icon={__Zn.v4Icon("plus")} size={"small"}
                            disabled={Op.isDisabled(this) || disabled}
                            onClick={Op.onAdd(this)}/>
                </div>
            );
        });
    }
}

export default Component