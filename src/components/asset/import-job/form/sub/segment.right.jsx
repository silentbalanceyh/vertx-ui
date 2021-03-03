import {Empty, Select, Tree} from 'antd';
import React from 'react';
import Ux from 'ux';
import Op from './Op';

export default (reference) => {
    const {
        $itemDrop = [], $itemDropTree = [],
        $itemDropKey, $targetKey = {}
    } = reference.state;
    const select = Ux.fromHoc(reference, "select");
    const info = Ux.fromHoc(reference, "info");
    // 计算默认值
    const selectedKeys = [];
    if ($targetKey.key) {
        selectedKeys.push($targetKey.key);
    }
    return (
        <div className={"range-target"}>
            <Select {...select} onChange={Op.rxSelect(reference)}
                    value={$itemDropKey}>
                {$itemDrop.map(item => {
                    return (
                        <Select.Option key={item.key} value={item.key}>
                            {item.name}
                        </Select.Option>
                    )
                })}
            </Select>
            {0 < $itemDropTree.length ? (
                <Tree treeData={$itemDropTree}
                      selectedKeys={selectedKeys}
                      onSelect={Op.rxTreeSelect(reference)}
                      className={"range range-tree"}
                      defaultExpandAll/>
            ) : (
                <Empty description={info.empty} className={"range range-empty"}/>
            )}
        </div>
    )
}