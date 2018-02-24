import React from 'react'
import { Table, Checkbox } from 'antd';

const renderBox = (referent = {}) => (text, record, index) => {
    return (
        <Checkbox value={ text }/>
    )
};

class Component
    extends React.PureComponent {
    render() {
        const {$columns = [], $data, $pager} = this.props;
        $columns.forEach(item => {
            if ("key" === item.dataIndex) {
                item.render = renderBox(this);
            }
        });
        return (
            <Table columns={ $columns } dataSource={ $data } pagination={ !!$pager }/>
        )
    }
}

export default Component;
