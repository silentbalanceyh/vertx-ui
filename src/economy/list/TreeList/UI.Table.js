import React from 'react'
import Op from "./Op";
import Ux from 'ux';
import {Table} from 'antd';

class Component extends React.PureComponent {
    componentDidMount() {
        const table = Op.initTable(this);
        const tabs = Op.initTabs(this);
        this.setState({table, tabs});
    }

    render() {
        const {table = []} = this.state ? this.state : {};
        const {tabs = {}} = this.state ? this.state : {};
        const {items = [], ...restTabs} = tabs;
        return table ? (Ux.aiTabs(items, restTabs,
            <Table {...table}/>
        )) : false
    }
}

export default Component;