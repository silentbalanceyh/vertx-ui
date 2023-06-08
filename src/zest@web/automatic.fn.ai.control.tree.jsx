import {Tree} from "antd";
import React from "react";
import __Zn from './zero.module.dependency';

/*const aiTreeNode = (item = {}) => {
    const attrs = {};
    attrs.title = item.text;
    attrs.key = item.key;
    attrs.data = __Zn.clone(item.data);

    if (item.children && 0 < item.children.length) {
        return (
            <TreeNode {...attrs}>
                {item.children.map(each => aiTreeNode(each))}
            </TreeNode>
        )
    } else {
        return (<TreeNode {...attrs}/>)
    }
};*/
const aiTree = (item = {}, rest = {}) => {
    let treeData = [];
    if (__Zn.isArray(item)) {
        treeData = __Zn.clone(item);
    } else {
        treeData = [__Zn.clone(item)];
    }
    return (
        <Tree {...rest} className={"web-tree"}
              treeData={treeData}/>
    )
};
export default {
    aiTree,
}