import React from 'react';
import './Cab.less';
import {Input, Table} from 'antd';
import Ux from 'ux';
import Op from './Op';

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = Ux.xtInitArray(props);
        // columns专用
        this.hoc = Op.getHoc(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        const {columns = []} = this.hoc;
        // 配置处理
        config.columns = columns;
        config.pagination = false;
        config.className = "web-table-editor";
        // 数据处理
        const data = Ux.xtSource(this);
        // 处理InputGroup中的jsx
        const attrs = Ux.valueFlip(jsx);
        const $attrs = Ux.clone(attrs);
        if ($attrs.onChange) delete $attrs.onChange;
        return (
            <Input.Group {...$attrs}>
                <Table {...config}
                       dataSource={data}/>
            </Input.Group>
        );
    }
}

export default Component;