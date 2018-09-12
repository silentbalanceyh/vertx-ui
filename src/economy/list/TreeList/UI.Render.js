import React from 'react'
import Ux from 'ux';
import {Input, Tree} from 'antd';
import Op from './Op';
import Immutable from 'immutable';
import Item from './UI.Render.Item';

const TreeNode = Tree.TreeNode;

const _renderItem = (reference, item = {}) => {
    const {selected = []} = reference.state;
    const $selected = Immutable.fromJS(selected);
    return $selected.contains(item.key) ? (
        <span>
            {item.display}&nbsp;&nbsp;
            {Item.renderOp(reference, item)}
        </span>
    ) : item.display
};
const _renderNodes = (reference, item = {}) => {
    const attrs = {};
    attrs["data-items"] = item;
    return (
        <TreeNode key={item.key}
                  title={_renderItem(reference, item)} {...attrs}>
            {(0 < item.children.length) ? (item.children.map(
                each => _renderNodes(reference, each)
            )) : false}
        </TreeNode>
    )
};

const renderTree = (reference) => {
    const treeData = Op.initTree(reference);
    const options = Op.readOptions(reference);
    // 默认是否展开
    const expand = Boolean(options['tree.expand.default']);
    const attrs = {};
    if (expand) {
        attrs.defaultExpandAll = true;
    }
    // 是否支持Tree左边部分的搜索
    const search = options["tree.search.enabled"];
    // 是否支持Tree左边部分的编辑（添加/删除/修改）
    const edit = options["tree.edit.enabled"];
    attrs.onSelect = Op.onSelect(reference, edit);
    return (
        <div className={"web-tree"}>
            {search ? <Input.Search/> : false}
            <Tree {...attrs}>
                {treeData.map(item => _renderNodes(reference, item))}
            </Tree>
        </div>
    )
};

const renderLayout = (reference, jsx) => {
    const options = Op.readOptions(reference);
    let layout = [4, 20];
    if (options.hasOwnProperty("layout.divide")) {
        layout = Ux.arrayConnect(options['layout.divide'], Ux.valueInt);
    }
    return Ux.aiGrid(layout,
        renderTree(reference),
        jsx
    );
};

export default {
    renderLayout
}