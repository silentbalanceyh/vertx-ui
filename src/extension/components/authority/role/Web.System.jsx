import React from 'react';
import {Card, Col, Row, Tabs, Tree} from 'antd';
import Ux from 'ux';
import Ex from 'ex';
import Op from "./op";

const renderCard = (reference, data = []) => {
    const {
        $heightStyle = {},
        $role,
        $op = {}
    } = reference.state;
    return (
        <Row>
            {data.map((grouped) => {
                const checkedKeys = Op.yoChoice(reference, grouped.children);
                return (
                    <Col span={8} key={grouped.key} className={"card"}>
                        <Card title={grouped.title} key={grouped.key}>
                            <Tree treeData={grouped.children}
                                  disabled={!$role}
                                  checkedKeys={checkedKeys}
                                  onCheck={$op.$opChecked(grouped.children)}
                                  defaultExpandAll
                                  {...$heightStyle} className={"card-content"}
                                  checkable             // checkable = !selectable
                                  selectable={false}/>
                        </Card>
                    </Col>
                )
            })}
        </Row>
    )
}

export default (reference) => {
    const {$source} = reference.state;
    const data = $source.system ? $source.system : [];
    const tabs = Ux.fromHoc(reference, "tabs");
    const $tabs = Ux.configTab(reference, tabs);
    const {items = [], ...rest} = $tabs;
    return (
        <Row className={"op-system"}>
            <Tabs {...rest} className={"ex-tabs"}>
                {items.map(item => (
                    <Tabs.TabPane {...item}>
                        {(() => {
                            const keys = Ux.immutable(Ex.V.PERM_PAGE[item.key]);
                            const filtered = data.filter(item => {
                                const $data = item.data;
                                if ($data) {
                                    return keys.contains($data.code);
                                } else return false;
                            });
                            return renderCard(reference, filtered);
                        })()}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </Row>
    )
}