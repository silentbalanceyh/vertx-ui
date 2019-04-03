import React from 'react';
import G6Editor from '@antv/g6-editor';

const Util = G6Editor.Util;

const jsxContent = (items = []) => {
    const attrs = [];
    items.forEach(item => {
        const attr = {};
        attr.draggable = false;
        attr['data-type'] = item.type;
        attr['data-size'] = item.size;
        attr['data-label'] = item.model.label;
        attr.className = "getItem";
        attr.src = item.src;
        attr.key = item.key;
        attrs.push(attr);
    });
    return (
        <div style={{marginLeft: "5%"}}>
            {attrs.map(attr => (
                <div key={attr.key} className={'ox-element'}>
                    <div>
                        <img {...attr} alt={attr['data-label']}/>
                    </div>
                    <label>{attr['data-label']}</label>
                </div>
            ))}
        </div>
    );
};
const jsxItem = (container) => new G6Editor.Itempannel({
    container,
    getItemModel(target) {
        return {
            ...Util.clone(target.dataset),
            shape: 'graph-model',
            icon: target.src,  // 直接读取 item 中的内容
            labelOffsetY: 48
        };
    }
});
export default {
    jsxContent,
    jsxItem
};