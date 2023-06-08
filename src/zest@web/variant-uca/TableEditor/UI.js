import React from 'react';
import {Button, Table, Tooltip} from 'antd';

import {uca} from 'zi';
import __Zn from "../zero.uca.dependency.table.UNLOCK";
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "TableEditor";
const yiColumn = (reference) => {
    const editor = __Zn.fromHoc(reference, "editor");
    const {column = {}} = editor;
    const {config = {}, ...rest} = column;
    rest.width = 96;
    rest.render = (text, record, index) => {
        const {disabled = false} = reference.props;
        const {add = {}, remove = {}} = config;
        return (
            <Button.Group>
                <Tooltip title={add.tooltip}>
                    <Button icon={__Zn.v4Icon(add.icon)}
                            disabled={disabled}
                            onClick={__Zn.xtRowAdd(reference, record, index)}/>
                </Tooltip>
                <Tooltip title={remove.tooltip}>
                    <Button icon={__Zn.v4Icon(remove.icon)}
                            disabled={disabled}
                            onClick={event => __Zn.xtRowDel(reference, record, index)(event).then(merged => {
                                if (merged) {
                                    const {config = {}} = reference.props;
                                    __Zn.fn(reference).onChange(__Zn.xtFormat(merged, config.format));
                                }
                            })}/>
                </Tooltip>
            </Button.Group>
        );
    }
    return {...rest};
}
const yiTable = (reference, table = {}) => {
    const $table = __Zn.clone(table);
    $table.columns = [yiColumn(reference)].concat(__Zn.configColumn(reference, $table.columns));
    $table.className = $table.className ? `ux_table_editor ${table.className}` : "ux_table_editor";
    $table.pagination = false;
    return $table;
}
const componentInit = (reference) => {
    const state = {};
    /* 表格配置连接专用处理 */
    const {config = {}} = reference.props;
    const {table = {}} = config;
    state.$table = yiTable(reference, table);
    // state.$ready = true;
    /* 数据信息 */
    const {data = []} = reference.state;
    const $data = __Zn.clone(data);
    if (0 === data.length) {
        /* 新数据记录 */
        $data.push({key: __Zn.randomUUID()});
        state.data = $data;
    }
    __Zn.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
    // reference.?etState(state);
}

@uca({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    constructor(props) {
        super(props);
        this.state = __Zn.xtInitFormat(props);
    }

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$table = {}, data = []} = this.state;
            return (
                <Table {...$table} dataSource={data}/>
            );
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component