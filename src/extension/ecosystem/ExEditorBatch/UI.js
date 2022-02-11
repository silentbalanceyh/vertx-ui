import React from 'react';
import Ex from 'ex';
import Ux from "ux";
import Op from "./Op";
import Rdr from './Web';
import {Select, Table} from "antd";

const renderField = (reference, {
    select = {},
    options = []
}) => (
    <Select {...select}>
        {options.map(option => (
            <Select.Option key={option.key}
                           value={option.value}>
                {option.label}
            </Select.Option>
        ))}
    </Select>
)
/**
 * ## 「组件」`ExEditorBatch`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * #### 1.1. 布局
 *
 * ```shell
 * |-----------------------|
 * | ------- | ___________ |  （输入框），TEXT
 * | ------- | o____ o____ |  （单选框），RADIO
 * | ------- | _________|-||  （日期选择框），DATE
 * |-----------------------|
 * ```
 *
 *
 * @memberOf module:web-component
 * @method *ExEditorBatch
 **/
// =====================================================
// componentInit/componentUp
// =====================================================
const yiOption = (reference, fieldColumn = {}, control = {}) => {
    let options = [];
    if (fieldColumn.items) {
        const items = []
        fieldColumn.items.forEach(item => {
            if ("string" === typeof item) {
                if (0 < item.indexOf(",")) {
                    items.push(item);
                } else {
                    const label = control[item] ? control[item].label : undefined;
                    if (label) {
                        items.push(item + "," + label);
                    }
                }
            }
        });
        options = Ux.Ant.toOptions(reference, {items});
    }
    return options;
}
const yiValue = (reference, config, $control = {}) => {
    const {valueColumn = {}, fieldColumn = {}} = config;
    // 新版 items 处理

    const column = {};
    column.dataIndex = "value";
    column.className = "ux-column-300 ux-left-text";
    column.title = valueColumn.title;
    column.render = (text, record) => {
        const columns = config.$columnsMy;
        let options = yiOption(reference, fieldColumn, $control);
        /*
        * 过滤
        */
        options = options.filter(item => columns.includes(item.key));
        /*
         * 是否不执行 Render
         */
        let fnRender = () => false;
        if (record.name) {
            // 选中行
            let row = options.filter(option => option.value === record.name);
            // 操作对象
            if (1 === row.length) {
                row = row[0];
                const {render = {}} = valueColumn;
                let raw = render[row.key];
                // 修正专用
                const configuration = $control[row.key];
                if (undefined === raw) {
                    fnRender = Rdr[configuration.control](reference, configuration);
                } else if ("string" === typeof raw) {
                    fnRender = Rdr[raw](reference, configuration);
                }
            } else {
                fnRender = Rdr['TEXT'](reference, row);
            }
        }
        return fnRender(record.key, text);
    };
    return column;
}
const yiOp = (reference, config = {}, $control = {}) => {
    /*
     * 左边按钮处理
     */
    const column = {};
    column.dataIndex = "key";
    column.className = "ux-column-120";
    column.render = (text, record, index) => {
        const {fieldColumn = {}} = config;
        const columns = config.$columnsMy;
        let options = yiOption(reference, fieldColumn, $control);
        /*
         * 过滤
         */
        options = options.filter(item => columns.includes(item.key));
        // ------------- 属性构造 --------------
        return Ux.aiRowAR(reference, {
            indexMax: options.length - 1,
            dataMax: options.length,
            index,
        })
    };
    return column;
};
const yiField = (reference, config = {}, $control = {}) => {
    const {fieldColumn = {}} = config;
    const column = {};
    column.dataIndex = "name";
    column.className = "ux-column-220";
    column.title = fieldColumn.title;
    column.render = (text, record, index) => {
        const columns = config.$columnsMy; // （读取我可操作的列）
        let options = yiOption(reference, fieldColumn, $control);
        /*
        * 过滤
        */
        options = options.filter(item => columns.includes(item.key));
        /*
         * 第二过滤
         * 1. 条件1，$existing中包含的不显示
         * 2. 条件2，当前记录依旧显示
         */
        const {$data = []} = reference.state;
        const $existing = $data.map(each => each.name)
            .filter(item => undefined !== item);
        options = options.filter(option => !$existing.includes(option.value) || option.value === text);
        // ------------- 属性构造 --------------
        const select = {};
        select.style = {minWidth: 200};
        select.onChange = Op.rxChange(reference, record.key);
        return renderField(reference, {select, options});
    };
    return column;
}
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    const $combine = Ex.yiCombine(reference, config);
    /* 列处理 */
    const field = config.$columns ? $combine.$columns : [];
    let $control = Ux.parseColumn(field, reference);
    $control = Ux.elementMap($control, 'key');
    let $columns = [];
    $columns.push(yiOp(reference, $combine, $control));
    $columns.push(yiField(reference, $combine, $control));
    $columns.push(yiValue(reference, $combine, $control));
    // 初始化数据
    const $data = [{key: Ux.randomUUID()}];
    // 列处理
    reference.setState({$columns, $control, $data, $combine, $ready: true})
};

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExEditorBatch")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 表格
             */
            const tables = Op.yoTable(this);
            /*
             * 按钮
             */
            const buttons = Op.yoButton(this);
            return (
                <div className={"ex-editor-table"}>
                    <Table {...tables}/>
                    {Ux.aiButton(this, buttons)}
                </div>
            )
        }, Ex.parserOfColor("ExEditorBatch").private());
    }
}

export default Component;