import React from 'react'
import Ux from 'ux';
import {DataLabor} from 'entity';
import {Col, Row, Table, Tabs} from 'antd';
import Op from './Op';
import {_zero} from '../../_internal/index';

const renderPageAdd = (reference, item = {}) => {
    const {$formAdd: Component} = reference.props;
    return Component ? (
        <Tabs.TabPane {...item}>
            <Component {...reference.props}/>
        </Tabs.TabPane>
    ) : false
};
const renderPageEdit = (reference, item = {}) => {
    const {$formUpdate: Component} = reference.props;
    const {record} = reference.state;
    const $inited = record[item.key] ? record[item.key] : {};
    return Component ? (
        <Tabs.TabPane {...item}>
            <Component $inited={$inited} {...reference.props}/>
        </Tabs.TabPane>
    ) : false
};
const renderPageList = (reference, item = {}) => {
    const tableDatum = Op.initTable(reference);
    return (
        <Tabs.TabPane {...item} closable={false}>
            <Row>
                <Col span={20}>
                    {Op.renderOp(reference)}
                </Col>
                <Col span={4}>
                    {Op.renderSearch(reference)}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table {...tableDatum.table} dataSource={tableDatum.data}/>
                </Col>
            </Row>
            {Op.renderDrawer(reference)}
        </Tabs.TabPane>
    )
};

@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "grid": ["record", "query", "list"]
            })
            .rinit(["record", "query"])
            .rinit(["list"], true)
            .to(),
    },
    state: {
        view: "LIST",
        key: undefined,
        drawer: false,
        tabs: {}
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.initGrid(this);
    }

    render() {
        const {reference, $key = "grid", $query} = this.props;
        // Grid分页列表专用
        let grid = Ux.fromHoc(reference, $key);
        if (!grid) return Ux.fxRender(reference, $key);
        // 读取tabs页面
        const {tabs = {}} = this.state;
        const {items = [], ...rest} = tabs;
        return (
            <Tabs type={"editable-card"} {...rest}
                  onTabClick={Op.activeTab(this)}
                  onEdit={Op.closeTab(this)}
                  tabBarExtraContent={Op.renderSubmit(this)}
                  hideAdd={true}>
                {items.map(item => {
                    const {type, ...itemReset} = item;
                    if ("FIXED" === type) {
                        return renderPageList(this, itemReset);
                    } else {
                        if ("ADD" === type) {
                            return renderPageAdd(this, itemReset);
                        } else if ("EDIT" === type) {
                            return renderPageEdit(this, itemReset);
                        }
                    }
                })}
            </Tabs>
        )
    }
}

export default Component