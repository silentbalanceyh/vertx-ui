import React from 'react'
import './Cab.less'
import {Input, Table} from 'antd';
import Ux from 'ux';

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = Ux.jetInit(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.jctUnsafe(this, nextProps);
    }

    render() {
        const {config = {}, $render, ...jsx} = this.props;
        const {value, ...rest} = jsx;
        config.columns = Ux.jctColumn(this, config.columns, jsx, $render);
        const data = Ux.jctData(this);
        return (
            <Input.Group {...rest}>
                <Table {...config} className={"web-table-editor"} pagination={false}
                       dataSource={data}/>
            </Input.Group>
        )
    }
}

export default Component;