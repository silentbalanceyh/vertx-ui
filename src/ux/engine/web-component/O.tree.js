import U from 'underscore';
import React from 'react';
import {Tree} from 'antd';
import Abs from '../../abyss';

const TreeNode = Tree.TreeNode;
const aiTreeNode = (item = {}) => {
    /*
     * 数据整合处理
     */
    const attrs = {};
    attrs.title = item.text;
    attrs.key = item.key;
    attrs.data = Abs.clone(item.data);

    if (item.children && 0 < item.children.length) {
        return (
            <TreeNode {...attrs}>
                {item.children.map(each => aiTreeNode(each))}
            </TreeNode>
        )
    } else {
        return (<TreeNode {...attrs}/>)
    }
};
const aiTree = (item = {}, rest = {}) => {
    if (U.isArray(item)) {
        return (
            <Tree {...rest} className={"web-tree"}>
                {item.map(each => aiTreeNode(each))}
            </Tree>
        )
    } else {
        return (
            <Tree {...rest} className={"web-tree"}>
                {aiTreeNode(item)}
            </Tree>
        )
    }
};
export default {
    aiTree
}