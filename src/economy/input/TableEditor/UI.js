import React from 'react';
import {component} from "../../_internal";
import Ux from "ux";
import {Button, Table, Tooltip} from 'antd';
import './Cab.less';

/**
 * ## 「组件」`TableEditor`
 *
 * 列表选择器
 *
 * ```js
 * import { TableEditor } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata": "items,选项表,24,,aiTableEditor",
 *      "optionJsx.depend.enabled": {
 *          "dataSource": [
 *              "items"
 *          ]
 *      },
 *      "optionJsx.config": {
 *          "format": {
 *              "type": "ARRAY",
 *              "keyField": "name"
 *          },
 *          "table": {
 *              "columns": [
 *                  {
 *                      "dataIndex": "name",
 *                      "title": "固定值",
 *                      "$render": "EDITOR"
 *                  },
 *                  {
 *                      "dataIndex": "label",
 *                      "title": "显示字段",
 *                      "$render": "EDITOR"
 *                  }
 *              ]
 *          }
 *      }
 * }
 * ```
 *
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Object|Ant Form给当前组件传入的值。|
 * |config|format|props|Object|多格式表格编辑。|
 * |config|table|props|Object|表格专用配置。|
 * |data||state|Any|根据格式计算的最终数据信息。|
 * |$table||state|Object|处理过的表格配置。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * ### 3. 组件核心点
 *
 * 包含了添加、删除两个操作，新增和删除按钮会在执行过程中被禁用或启用。
 *
 * @memberOf module:web-input
 * @method TableEditor
 */
// =====================================================
// componentInit/componentUp
// =====================================================

const yiColumn = (reference) => {
    const editor = Ux.fromHoc(reference, "editor");
    const {column = {}} = editor;
    const {config = {}, ...rest} = column;
    rest.width = 96;
    rest.render = (text, record, index) => {
        const {disabled = false} = reference.props;
        const {add = {}, remove = {}} = config;
        return (
            <Button.Group>
                <Tooltip title={add.tooltip}>
                    <Button icon={add.icon}
                            disabled={disabled}
                            onClick={Ux.xtRowAdd(reference, record, index)}/>
                </Tooltip>
                <Tooltip title={remove.tooltip}>
                    <Button icon={remove.icon}
                            disabled={disabled}
                            onClick={event => Ux.xtRowDel(reference, record, index)(event).then(merged => {
                                if (merged) {
                                    const {config = {}} = reference.props;
                                    Ux.fn(reference).onChange(Ux.xtFormat(merged, config.format));
                                }
                            })}/>
                </Tooltip>
            </Button.Group>
        )
    }
    return {...rest};
}
const yiTable = (reference, table = {}) => {
    const $table = Ux.clone(table);
    $table.columns = [yiColumn(reference)].concat(Ux.configColumn(reference, $table.columns));
    $table.className = $table.className ? `web-table-editor ${table.className}` : "web-table-editor";
    $table.pagination = false;
    return $table;
}
const componentInit = (reference) => {
    const state = {};
    /* 表格配置连接专用处理 */
    const {config = {}} = reference.props;
    const {table = {}} = config;
    state.$table = yiTable(reference, table);
    state.$ready = true;
    /* 数据信息 */
    const {data = []} = reference.state;
    const $data = Ux.clone(data);
    if (0 === data.length) {
        /* 新数据记录 */
        $data.push({key: Ux.randomUUID()});
        state.data = $data;
    }
    reference.setState(state);
}

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
        componentInit(this);
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