import Ux from "ux";
import {TreeSelect} from "antd";
import React from "react";
import Ex from 'ex';

export default {
    modelKey: (reference, jsx) => {
        const models = Ux.onDatum(reference, "resource.models");
        /* 读取 */
        const type = Ux.formHit(reference, "type");
        if (type) {
            const tree = Ux.toTree(models, {title: "name"});
            /* 集成的树结构不同 */
            if (type && type.startsWith(Ex.V.PERM_INTEGRATION)) {
                /*
                 * 集成单独运算
                 */
                const treeData = tree.filter(item => type !== item.data.code);
                treeData.forEach(resource => {
                    resource.selectable = false
                });
                jsx.treeData = treeData;
            } else {
                const treeData = tree.filter(item => type === item.data.code)
                if (treeData[0]) {
                    /*
                     * 必须有
                     */
                    jsx.treeData = treeData[0].children;
                }
            }
        } else {
            /* 没选择时禁用 */
            jsx.disabled = true;
        }
        return (
            <TreeSelect {...jsx} onChange={selected => {
                const model = Ux.elementUnique(models, "key", selected);
                if (model) {
                    const {identifier} = model;
                    const changed = {};
                    changed.identifier = identifier;
                    changed.modelKey = selected;
                    Ux.formHits(reference, changed);
                }
            }}/>
        )
    }
}