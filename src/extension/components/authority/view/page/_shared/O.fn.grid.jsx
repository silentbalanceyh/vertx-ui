import Ux from "ux";
import {Col, Row, Spin, Tree} from "antd";
import React from "react";

export default (reference, columns = 4) => {
    const {
        $source = [], $keySet,
        $submitting = false
    } = reference.state;
    const grid = Ux.elementGrid($source, columns);
    return (
        <Spin spinning={$submitting}>
            {grid.map((row, rowIndex) => (
                <Row key={`row${rowIndex}`}>
                    {row.map((col, colIndex) => {
                        /*
                         * 当前树中所有
                         */
                        const current = [];
                        Ux.itTree([col], item => current.push(item.key));
                        /*
                         * 当前树中被选择的
                         */
                        const keys = $keySet ? Ux.immutable(Array.from($keySet)) : Ux.immutable([]);
                        const checkedKeys = current.filter(key => keys.contains(key));
                        const attrs = Ux.toGridSpan(columns, colIndex);
                        return (
                            <Col {...attrs} key={`col${col.key}`}>
                                <Tree treeData={[col]}
                                      onCheck={Ux.rxCheckedTree(reference, [col])}
                                      checkedKeys={checkedKeys}
                                      checkStrictly
                                      selectable={false}
                                      checkable defaultExpandAll/>
                            </Col>
                        )
                    })}
                </Row>
            ))}
        </Spin>
    )
}