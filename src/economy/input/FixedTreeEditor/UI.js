import React from 'react'
import './Cab.less'
import {Input, Table} from 'antd';
import Immutable from 'immutable';
import Op from './UI.Render';

class Component extends React.PureComponent {

    render() {
        const {config, source, $render, ...jsx} = this.props;
        const {value, ...rest} = jsx;
        let data = [];
        if (source) {
            data = Immutable.fromJS(source).toJS();
        }
        // 直接拉平Children
        if (config.children) {
            data.forEach(item => {
                if (item[config.children]) {
                    item.children = item[config.children];
                }
            })
        }
        // 处理专用的渲染
        if (config.table && config.table.columns) {
            Op.renderColumn(this, config.table.columns, jsx, $render);
        }
        return (
            <Input.Group {...rest} style={{width: "100%"}}>
                <Table {...config.table} className={"web-table-editor"}
                       pagination={false}
                       dataSource={data}/>
            </Input.Group>
        )
    }
}

export default Component