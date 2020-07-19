import React from 'react';
import {Card, Row, Tree} from 'antd';

export default (reference) => {
    const {$source} = reference.state;
    const data = $source.system ? $source.system : [];
    return (
        <Row className={"op-system"}>
            {data.map((grouped) => {
                return (
                    <Card title={grouped.title} key={grouped.key}
                          className={"card"}>
                        <Tree treeData={grouped.children}
                              defaultExpandAll
                              checkable/>
                    </Card>
                )
            })}
        </Row>
    )
}