import React from 'react';
import Ux from "ux";
import {Col, Row, Switch, Table} from 'antd';
import './Cab.less';

const renderItem = (reference, data = []) => {
    const table = Ux.fromHoc(reference, "table");
    const tableConfig = table['items'];
    tableConfig.columns = Ux.configColumn(reference, tableConfig.columns);
    const dataSource = Ux.clone(data);
    Ux.configScroll(tableConfig, dataSource, reference);
    return (
        <Table {...tableConfig} dataSource={dataSource}/>
    )
}

const renderBill = (reference, data = []) => {
    const table = Ux.fromHoc(reference, "table");
    const tableConfig = table['bills'];
    tableConfig.columns = Ux.configColumn(reference, tableConfig.columns);
    //
    const dataSource = Ux.clone(data);
    const treeMap = {};
    dataSource.forEach(dataItem => {
        if (dataItem.children) {
            treeMap[dataItem.key] = Ux.clone(dataItem.children);
            delete dataItem.children;
        }
    });
    Ux.configScroll(tableConfig, dataSource, reference);
    return (
        <Table {...tableConfig} dataSource={dataSource}
               expandedRowRender={record => renderItem(reference, treeMap[record.key])}/>
    )
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("FBillList")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {data = []} = this.props;
        data.filter(each => Ux.isArray(each.children)).forEach(each => {
            each.itemCount = each.children.length;
            each.children.forEach(item => {
                item.modelKey = each.modelKey;
            });
        })
        const config = Ux.fromHoc(this, "switcher")
        const {$isBill} = this.state;
        return (
            <div className={"ex-bill-list"}>
                <Row className={"row"}>
                    <Col span={8}>
                        <Switch {...config} checked={$isBill}
                                onChange={$isBill => this.setState({$isBill})}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {(() => {
                            if ($isBill) {
                                return renderBill(this, data);
                            } else {
                                const normalized = [];
                                data.filter(each => Ux.isArray(each.children))
                                    .forEach(each => each.children.forEach(item => normalized.push(item)))
                                return renderItem(this, normalized);
                            }
                        })()}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component