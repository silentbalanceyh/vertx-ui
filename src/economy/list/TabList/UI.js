import React from 'react'
import Ux from 'ux';
import {Button, Input, Table, Tabs} from 'antd';
import './Cab.less'
import Op from './UI.Op';

const {TabPane} = Tabs;

const buildMain = (reference) => {
    const {
        $list = {}, $table = {}, $query = {},
        $op = {}, $metadata = {}, $tabs = {}
    } = reference.props;
    // columns渲染
    Ux.uiTableColumn(reference, $table.columns, Op);
    // paginator处理
    const pagination = Ux.uiTablePager(reference, $query.pager, $list.count);
    // selection
    const selection = $metadata.batch ? Ux.uiTableSelection(reference) : undefined;
    // metadata处理
    const op = $metadata.op;
    const dynamic = op['dynamic'] ? op['dynamic'] : [];
    // 数据data
    const data = $list.list;
    return (
        <div>
            <div className="page-op">
                <Button type="primary" icon="plus"
                        onClick={Op.fnAdd(reference, $tabs.add)}>{op.add.text}</Button>
                {dynamic ? dynamic.map(item => {
                    const attrs = {};
                    attrs.key = item.key;
                    if (item.icon) attrs.icon = item.icon;
                    if (item.hasOwnProperty("fnKey")) {
                        attrs.onClick = $op[item['fnKey']] ? $op[item['fnKey']] : () => {
                        }
                    }
                    return (
                        <Button {...attrs}>{item.text}</Button>
                    );
                }) : false}
                {op.search ? (
                    <Input.Search style={{width: 160, float: "right"}}/>
                ) : false}
            </div>
            <Table
                onChange={Ux.onAdvanced(reference)}
                rowSelection={selection}
                loading={!data}
                pagination={pagination}
                dataSource={data} {...$table}/>
        </div>
    )
};

class Component extends React.PureComponent {
    state = {
        selectedRowKeys: [],
        tabs: []
    };

    componentDidMount() {
        Op.fnInit(this);
        Ux.cycleUpdatePageList(this, "list");
    }

    componentDidUpdate(prevProps) {
        Ux.cycleUpdatePageList(this, "list", prevProps);
    }

    render() {
        // 主页组件构造
        const components = [];
        components.push(buildMain(this));
        const {$component: Component} = this.props;
        const tabs = this.state.tabs ? this.state.tabs : [];
        tabs.forEach((item, index) => {
            if (0 < index) {
                components.push(
                    <Component key={item.key}
                               {...this.props}
                               $key={item.dataKey}
                               {...Ux.toDatum(this.props)}/>
                )
            } else {
                // 第一个页面不可以关闭
                item.closable = false;
            }
        });
        const activeKey = this.state.activeKey;
        return (
            <div className="page-pagelist">
                <Tabs activeKey={activeKey} type="editable-card" hideAdd
                      onChange={Op.fnMove(this)} onEdit={Op.fnClose(this)}>
                    {tabs.map((item, index) => (<TabPane {...item}>{components[index]}</TabPane>))}
                </Tabs>
            </div>
        )
    }
}

export default Component;
