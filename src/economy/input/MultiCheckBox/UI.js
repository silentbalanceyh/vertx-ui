import React from 'react';
import './Cab.less';
import Ux from 'ux';
import Op from './Op';
import {Checkbox, Row} from 'antd';
import Rdr from './UI.Render';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        const state = Ux.xtInitObject(props);
        // 用于Checkbox Group
        state.source = Op.getOptions(this);
        const {config = {}} = props;
        state.prefix = config.prefix;
        state.horizon = config.horizon;
        this.state = state;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    componentDidUpdate(prevProps) {
        Ux.xtReset(this, {});
    }

    render() {
        const {prefix = "", source = [], horizon = false} = this.state;
        const {value = {}} = this.props;
        const $values = Ux.immutable(Object.keys(value));
        return (
            <Checkbox.Group onChange={Op.on2Change(this)}
                            value={Object.keys(value)}>
                {source.map(item => (
                    <Row className={"web-check-row"} key={item.key}>
                        <Checkbox value={item.value}>
                            {item.label ? item.label : ""}
                        </Checkbox>
                        {Rdr.renderChildren(this, prefix, {
                            ...item,
                            $value: value[item.key],  // 传入子节,
                            horizon: horizon,     // 垂直排版还是水平
                            disabled: !$values.contains(item.key)
                        })}
                    </Row>
                ))}
            </Checkbox.Group>
        );
    }
}

export default Component;