import React from 'react';
import {Checkbox} from 'antd';

import __Zn from '../zero.uca.dependency';

const UCA_NAME = "CheckJson";
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    /* 属性数据 */
    const {value} = reference.props;
    const selected = [];
    if (value) {
        Object.keys(value).filter(key => value[key])
            .forEach(item => selected.push(item));
    }
    state.selected = selected;
    // reference.?etState(state);
    __Zn.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}
// =====================================================
// 事件部分
// =====================================================
const onChange = (reference) => (checked = []) => {
    const {$source = []} = reference.props;
    const fields = $source.map(item => item.value);
    const data = {};
    fields.forEach(field => data[field] = false);
    checked.forEach(field => data[field] = true);
    /* 数据处理 */
    __Zn.of(reference).in({
        selected: checked
    }).handle(() => {

        __Zn.fn(reference).onChange(data);
    })
    // reference.?etState({selected: checked});
    // __Zn.fn(reference).onChange(data);
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // 标准方法
        __Zn.xtRevert(this, {state: prevState, props: prevProps}, {});
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$source = []} = this.props;
            const attrs = __Zn.yoLimit(this.props);
            const WebField = __Zn.V4InputGroup;
            return (
                <WebField {...attrs} className={"web-check-json"}>
                    <Checkbox.Group options={$source}
                                    value={attrs.value ? Object.keys(attrs.value)
                                            .filter(item => attrs.value[item])
                                        : []}
                                    onChange={onChange(this)}/>
                </WebField>
            );
        }, {name: UCA_NAME, logger: true});
    }
}

export default Component