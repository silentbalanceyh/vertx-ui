import React from 'react'
import Ux from 'ux';
import { Table } from 'antd';
import Op from './Op.List';

class Component extends React.PureComponent {

    render() {
        const {$config = {}, $data = []} = this.props;
        Ux.uiTableColumn(this, $config.columns, Op);
        return (
            <Table { ...$config } dataSource={ $data } className="page-list"/>
        )
    }
}

export default Component;
