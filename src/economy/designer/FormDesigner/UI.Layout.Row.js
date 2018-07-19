import React from 'react'
import {_zero} from "../../_internal";
import {Button, Col, Row, Select} from 'antd'
import Op from './Op'
import Cell from './UI.Layout.Row.Cell'

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI.Layout.Row",
    state: {
        columns: 1
    }
})
class Component extends React.Component {

    render() {
        const {$hoc, columns = 1} = this.state;
        const items = $hoc._("_info").items;
        const {$key, reference, pointer, target = {}} = this.props;
        // 列处理
        const $columns = [];
        for (let idx = 0; idx < columns; idx++) {
            const column = {};
            column.span = 24 / columns;
            column.key = `${$key}-column${idx}`;
            $columns.push(column);
        }
        return (
            <Row className={"web-layout-row"}>
                <Col span={22}>
                    {$columns.map((column, index) => {
                        const className = index < ($columns.length - 1) ?
                            "web-layout-column" : "web-layout-column-none";
                        if (!column.className) column.className = "";
                        column.className = `${className} ${column.className}`;
                        return <Cell item={column} key={column.key} pointer={pointer} target={target}/>
                    })}
                </Col>
                <Col span={2} style={{paddingLeft: 5}}>
                    <span>
                        <Button icon={"minus"} onClick={Op.rowRemove(reference, $key)}/>
                        &nbsp;&nbsp;
                        <Select className={"web-layout-row-select"} value={String(columns)}
                                onChange={Op.colSelect(this)}>
                                {items.map(item => <Select.Option key={item.key}>
                                    {item.text}
                                </Select.Option>)}
                            </Select>
                        </span>
                </Col>
            </Row>
        )
    }
}

export default Component