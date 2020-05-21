import React from 'react';
import {component} from "../../_internal";
import Ux from "ux";
import Op from './op';
import {Table} from 'antd';
import './Cab.less';

/*
 * 自定义组件，编辑数据库Json
 */
@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInitFormat(props);
    }

    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$table = {}, data = []} = this.state;
            return (
                <Table {...$table} dataSource={data}/>
            );
        }, {name: "TableEditor", logger: true})
    }
}

export default Component