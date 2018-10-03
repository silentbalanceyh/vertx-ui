import React from 'react';
import './Cab.less';
import {Input, Table} from 'antd';
import Ux from 'ux';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.jemInit(this, props.config, true);
    }

    render() {
        const {config = {}, $render, ...jsx} = this.props;
        const {value, ...rest} = jsx;
        config.columns = Ux.jemColumn(this, config.columns, jsx, $render);
        const source = Ux.jctData(this);
        return (
            <Input.Group {...rest}>
                <Table columns={config.columns} className={"web-table-editor"}
                       pagination={false} dataSource={source}/>
            </Input.Group>
        );
    }
}

export default Component;