import React from 'react';
import './Cab.less';
import Ux from 'ux';
import Op from './Op';
import {Checkbox, Row} from 'antd';
import Rdr from './UI.Render';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        const state = Ux.xtInitArray(props);
        // 用于Checkbox Group
        state.source = Op.getOptions(this);
        const {config = {}} = props;
        state.prefix = config.prefix;
        this.state = state;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    render() {
        const {prefix = "", source = []} = this.state;
        return (
            <Checkbox.Group onChange={Op.on2Change(this)}>
                {source.map(item => (
                    <Row className={"web-check-row"} key={item.key}>
                        <Checkbox value={item.value}>
                            {item.label ? item.label : ""}
                        </Checkbox>
                        {Rdr.renderChildren(this, prefix, item.children)}
                    </Row>
                ))}
            </Checkbox.Group>
        );
    }
}

export default Component;