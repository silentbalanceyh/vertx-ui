import {Button} from "antd";
import React from "react";
import Abs from '../../abyss';
import Ut from "../../unity";
import Dt from '../datum';

/**
 * ## 标准函数
 *
 * 渲染列清除锚点，ID格式：`__BTN_CLEAR_<column>`。
 *
 * @memberOf module:_anchor
 * @param {String} field 列名。
 * @param {Function} onClick 点击专用回调。
 * @returns {Jsx}
 */
const anchorColumn = (field, onClick) => {
    return (
        <div className={"ux-hidden"}>
            <Button id={`__BTN_CLEAR_${field}`} onClick={onClick}/>
        </div>
    );
};
/**
 * ## 标准函数
 *
 * 搜索条件清除专用锚点，清除所有搜索条件，ID格式：`__BTN_CLEAR_SEARCH`。
 *
 * @memberOf module:_anchor
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Jsx}
 */
const anchorSearch = (reference) => (
    <div className={"ux-hidden"}>
        <Button id={"__BTN_CLEAR_SEARCH"} onClick={event => {
            Abs.prevent(event);
            reference.setState({searchText: ""});
            const ref = Dt.onReference(reference, 1);
            if (ref) {
                ref.setState({
                    $condition: {},
                    $filters: {}
                });
                const {$terms = {}} = ref.state;
                activeColumn($terms);
            }
        }}/>
    </div>
);
/**
 * ## 标准函数
 *
 * 树专用的状态锚点设置
 *
 * * `__BTN_TREE_OFF`：禁用树菜单。
 * * `__BTN_TREE_ON`：启用树菜单。
 *
 * @memberOf module:_anchor
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Jsx}
 */
const anchorTree = (reference) => (
    <div className={"ux-hidden"}>
        <Button id={"__BTN_TREE_OFF"} onClick={(event) => {
            Abs.prevent(event);
            reference.setState({$disabled: true});
        }}/>
        <Button id={"__BTN_TREE_ON"} onClick={(event) => {
            Abs.prevent(event);
            reference.setState({$disabled: false});
        }}/>
    </div>
);
/**
 * ## 标准函数
 *
 * 点击查询条件的清除专用激活按钮。
 *
 * @memberOf module:_anchor
 * @param {Object} $terms 查询条件专用。
 */
const activeColumn = ($terms = {}) => {
    Object.keys($terms)
        /* 列筛选必须调用 */
        .map(id => `__BTN_CLEAR_${id}`)
        .forEach(id => Ut.connectId(id))
};
/**
 * ## 标准函数
 *
 * 点击清除搜索框的按钮专用触发函数。
 *
 * @memberOf module:_anchor
 */
const activeSearch = () => Ut.connectId("__BTN_CLEAR_SEARCH");
/**
 * ## 标准函数
 *
 * 点击树桩菜单激活按钮
 *
 * @memberOf module:_anchor
 */
const activeTreeOn = () => Ut.connectId("__BTN_TREE_ON");
/**
 * ## 标准函数
 *
 * 点击树桩菜单禁用按钮
 *
 * @memberOf module:_anchor
 */
const activeTreeOff = () => Ut.connectId("__BTN_TREE_OFF");
export default {
    anchorTree,
    activeTreeOff,
    activeTreeOn,

    anchorColumn,
    activeColumn,
    anchorSearch,
    activeSearch,
}