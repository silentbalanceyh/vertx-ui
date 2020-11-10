/* 左边树形结构（直接使用Tree）*/
import {Collapse, Spin, Tag, Tree} from 'antd';
import React from 'react';
import Ux from "ux";
import Op from './op/Op';

export default {
    treeResource: (reference, $tree = []) => {
        return (
            <div className={"tree-left"}>
                <Tree treeData={$tree}
                      className={"tree-resource"}
                      checkable selectable={false}
                      style={{
                          maxHeight: Ux.toHeight(112)
                      }}
                      onCheck={Op.yoResCriteria(reference)}/>
            </div>
        )
    },
    treePermission: (reference, $tree = []) => {
        /*
         * 直接处理成 Panel
         */
        const $treeData = Ux.clone($tree);
        $treeData.forEach(root => root.selectable = false)
        const {$selectedKeys = [], $selectedData, $loading = false} = reference.state;
        const closable = Ux.fromHoc(reference, "closable");
        return (
            <div className={"tree-left"}>
                <div className={"tree-permission-close"}>
                    {(() => {
                        const selected = $selectedData ? $selectedData.name : closable.empty;
                        const attrs = {};
                        if ($selectedData) {
                            attrs.color = "blue";
                            attrs.style = {
                                fontSize: 14
                            }
                            attrs.closable = true;
                            attrs.onClose = Op.rxClosePerm(reference);
                            return (
                                <Tag {...attrs}>
                                    {selected}
                                </Tag>
                            )
                        } else {
                            return (
                                <Tag style={{
                                    fontSize: 14
                                }}>{selected}</Tag>
                            );
                        }
                    })()}
                </div>
                <Spin spinning={$loading}>
                    <Collapse className={"tree-permission"} style={{
                        maxHeight: Ux.toHeight(144)
                    }}>
                        {$tree.map(root => {
                            const treeAttrs = {};
                            treeAttrs.treeData = root.children;
                            treeAttrs.selectedKeys = $selectedKeys;
                            treeAttrs.defaultExpandAll = true;
                            treeAttrs.onSelect = Op.yoPermCriteria(reference);
                            return (root.children && 0 < root.children.length) ? (
                                <Collapse.Panel key={root.key} header={root.title}>
                                    <Tree {...treeAttrs}/>
                                </Collapse.Panel>
                            ) : false
                        })}
                    </Collapse>
                </Spin>
            </div>
        )
    }
}