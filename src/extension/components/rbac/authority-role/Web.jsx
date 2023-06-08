import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {Tree} from 'antd';
import {ExAuthority} from "ei";
import Op from './Op';

const renderMenu = (reference) => {
    const {$roles = []} = reference.state;
    const root = Ux.fromHoc(reference, "root");

    root.icon = Ux.v4Icon("team");
    root.selectable = false;
    root.children = [];
    $roles.forEach(role => {
        const item = {};
        item.key = role.key;
        item.title = role.name;
        item.data = role;
        item.icon = Ux.v4Icon("user");
        root.children.push(item);
    })
    const tree = [root];
    const {$selected = {}} = reference.state;
    return (
        <Tree treeData={tree}
              selectedKeys={[$selected.key]}
              showIcon
              onSelect={Op.rxSelected(reference)}
              defaultExpandAll/>
    )
}
const renderContent = (reference) => {
    const {$selected = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    inherit.$inited = $selected;
    return (
        <ExAuthority {...inherit}/>
    )
}
export default {
    renderMenu,
    renderContent,
}