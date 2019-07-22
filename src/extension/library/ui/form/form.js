import Ux from 'ux';
import Ex from 'ex';
import U from 'underscore';
import Raft from './form.raft';
/* ExForm 属性继承 */
const yoForm = (reference, addOn = {}, data = {}) => {
    const attrs = Ux.toProp(reference.props,
        'app',      // 应用程序 X_APP 信息
        'router',   // 路由信息 react-router
        'employee.js',     // 用户基本信息
    );
    const config = {};
    /*
     * `form`：从 hoc 的 _form 节点读取到的配置信息
     */
    if (U.isObject(addOn.form)) {
        config.form = Ux.clone(addOn.form);
    }
    /*
     * `magic`：特殊参数
     * `addon`：特殊配置
     * `control`：和后端的 UI_CONTROL 对应
     */
    if (addOn.hasOwnProperty('control')) {
        config.magic = Ux.clone(addOn.magic);
        config.control = addOn.control;
        config.addon = Ux.clone(addOn.addon);
    }
    attrs.config = Ux.clone(config);
    /* Form 特殊配置 */
    attrs.$inited = Ux.clone(data);
    return attrs;
};
/*
* ExForm 配置转换处理
* 1. 静态 _form -> 最终的 raft
* 2. 动态 magic, control -> 最终的 raft
* 实际上是 Ox 中的 normalize 方法
* */
const yiForm = (form = {}, addon = {}, id) => {
    /*
     * Form表单检查流程
     */
    if (!form.ui) {
        return Ux.E.fxFailure(10056, form.ui);
    }
    const state = {};
    // 构造 raft 配置
    const metadata = {};
    const params = {form, addon, id};
    // Render-1: <Form> 配置构造
    Raft.raftAttribute(metadata, params);
    // Render-2: <Input type="hidden"/>
    Raft.raftHidden(metadata, params);
    // Render-3: 抽取遍历专用配置
    const calculated = Raft.raftCalculated(metadata, params);
    metadata.rows = [];
    // 开始遍历
    const {normalized = []} = calculated;
    normalized.forEach((row, rowIndex) => {
        // 行配置处理
        const rowData = Raft.raftRow(metadata, {row, index: rowIndex, calculated});
        const {rowItem = {}, rowStyle} = rowData;
        rowItem.cells = [];
        // 列遍历
        row.forEach((cell, cellIndex) => {
            // 高度填平处理
            Ux.raptCell(cell, {}, rowStyle);
            // 解决 rowStyle 问题
            // 处理cell
            const cellConfig = Raft.raftPreCell(metadata, {
                cell, index: cellIndex, row: {
                    ...rowItem, length: row.length,
                },
                calculated,
            });
            // <Col/> 处理
            Raft.raftCell(cell, cellConfig);
            // Button和特殊处理
            Raft.raftSpecial(cell);
            rowItem.cells.push(cell);
        });
        Ux.D.Logger.render(5, rowItem, rowIndex);
        metadata.rows.push(rowItem)
    });
    state.raft = {
        ...metadata,
        enabled: true
    };
    Ux.D.Logger.render(3);
    state.$metadata = {};
    if (form.ajax) {
        state.$metadata.ajax = Ux.clone(form.ajax);
    }
    return state;
};
/*
 * actions格式：
 * {
 *      "name": 表单名称
 *      "op":{
 *          "id": "key"
 *      }
 * }
 * 合并后的请求格式
 * {
 *      "name": 表单名称
 *      "control": 控件ID
 *      "op": [
 *          key1,
 *          key2
 *      ]
 * }
 * 响应格式
 * {
 *      "id1": true,
 *      "id2": false
 * }
 */
const yiAction = (params = {}, control) => {
    const actionParams = {};
    if (control) {
        /*
         * 动态权限控制
         */
        actionParams.control = control;
        actionParams.remote = true;
    } else if (params.hasOwnProperty('name')) {
        /*
         * 后端静态权限控制
         */
        actionParams.name = params.name;
        actionParams.remote = true;
    } else {
        /*
         * 无权限控制
         */
        actionParams.remote = false;
    }
    actionParams.op = params.op;
    return Ex.I.action(actionParams);
};
export default {
    yoForm,
    yiForm,
    yiAction,
}