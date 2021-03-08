import React from 'react';
import Ex from 'ex';
import Jsx from './Web';
import Ux from "ux";
import Op from "./Op";

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
const yiValue = (reference, config) => {
    const {valueColumn = {}, fieldColumn = {}} = config;
    const column = {};
    column.dataIndex = "value";
    column.className = "ux-column-300 ux-left-text";
    column.title = valueColumn.title;
    column.render = (text, record) => {
        const columns = config.$columnsMy;
        let options = Ux.Ant.toOptions(reference, fieldColumn);
        /*
        * 过滤
        */
        const $columns = Ux.immutable(columns);
        options = options.filter(item => $columns.contains(item.key));
        /*
         * 是否不执行 Render
         */
        let fnRender = () => false;
        if (record.name) {
            // 选中行
            let row = options.filter(option => option.value === record.name);
            // 操作对象
            const Rdr = Jsx.RENDERS;

            if (1 === row.length) {
                row = row[0];
                const {render = {}} = valueColumn;
                let raw = render[row.key];
                // 修正专用
                if (undefined === raw) {
                    fnRender = Rdr['TEXT'](reference);
                } else if ("string" === typeof raw) {
                    fnRender = Rdr[raw](reference);
                } else {
                    const {type, config} = raw;
                    fnRender = Rdr[type](reference, config);
                }
            } else {
                fnRender = Rdr['TEXT'](reference, row);
            }
        }
        return fnRender(record.key, text);
    };
    return column;
}
const yiOp = (reference, config = {}) => {
    /*
     * 左边按钮处理
     */
    const column = {};
    column.dataIndex = "key";
    column.className = "ux-column-120";
    column.render = (text, record, index) => {
        const {fieldColumn = {}} = config;
        const columns = config.$columnsMy;
        let options = Ux.Ant.toOptions(reference, fieldColumn);
        /*
         * 过滤
         */
        const $columns = Ux.immutable(columns);
        options = options.filter(item => $columns.contains(item.key));
        // ------------- 属性构造 --------------
        /* 添加 */
        const left = {};
        left.icon = 'plus';
        left.disabled = (index === (options.length - 1));
        left.onClick = Op.rxAdd(reference);
        /* 删除 */
        const right = {};
        right.icon = 'minus';
        right.disabled = (0 === index);
        right.onClick = Op.rxRemove(reference, text);
        return Jsx.renderOp(reference, {
            left,
            right,
        })
    };
    return column;
};
const yiField = (reference, config = {}) => {
    const {fieldColumn = {}} = config;
    const column = {};
    column.dataIndex = "name";
    column.className = "ux-column-220";
    column.title = fieldColumn.title;
    column.render = (text, record, index) => {
        const columns = config.$columnsMy; // （读取我可操作的列）
        let options = Ux.Ant.toOptions(reference, fieldColumn);
        /*
        * 过滤
        */
        const $columns = Ux.immutable(columns);
        options = options.filter(item => $columns.contains(item.key));
        /*
         * 第二过滤
         * 1. 条件1，$existing中包含的不显示
         * 2. 条件2，当前记录依旧显示
         */
        const {$data = []} = reference.state;
        const $existing = Ux.immutable($data.map(each => each.name)
            .filter(item => undefined !== item));
        options = options.filter(option => !$existing.contains(option.value) || option.value === text);
        // ------------- 属性构造 --------------
        const select = {};
        select.style = {minWidth: 200};
        select.onChange = Op.rxChange(reference, record.key);
        return Jsx.renderField(reference, {select, options});
    };
    return column;
}
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    /* 列处理 */
    let $columns = [];
    $columns.push(yiOp(reference, config));
    $columns.push(yiField(reference, config));
    $columns.push(yiValue(reference, config));
    // 初始化数据
    const $data = [{key: Ux.randomUUID()}];
    reference.setState({$columns, $data, $ready: true})
};

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
            return Jsx.renderEditor(this, {
                tables,
                buttons,
            });
        }, Ex.parserOfColor("ExEditorBatch").private());
    }
}

export default Component;